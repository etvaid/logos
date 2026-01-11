"""
LOGOS Translation Engine - Passage Translation API
Fast, accurate Greek/Latin translation with morphological analysis and translation memory.

POST /api/translation/translate_passage
- Input: { text: string, source_language?: string, style?: string, include_parsing?: bool }
- Output: { translation, tokens[], morphology[], provenance, latencyMs }
- p95 latency target: ≤200ms for cache hit, ≤500ms for full analysis
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncpg
import os
import time
import re
import unicodedata
import logging
import json
from pathlib import Path

logger = logging.getLogger(__name__)

router = APIRouter()

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

_pool = None

VALID_STYLES = ['scholarly', 'literary', 'accessible', 'literal']

# Greek and Latin character patterns for language detection
GREEK_PATTERN = re.compile(r'[\u0370-\u03FF\u1F00-\u1FFF]')
LATIN_PATTERN = re.compile(r'[a-zA-ZāēīōūȳĀĒĪŌŪȲàèìòùÀÈÌÒÙ]')

# ============================================================================
# LOAD LEXICONS FROM JSON FILE (LAZY LOADING)
# ============================================================================

_lexicons_loaded = False
GREEK_LEXICON = {}
LATIN_LEXICON = {}

def _ensure_lexicons_loaded():
    """Lazy load Greek and Latin lexicons from JSON file."""
    global _lexicons_loaded, GREEK_LEXICON, LATIN_LEXICON
    if _lexicons_loaded:
        return

    lexicon_path = Path(__file__).parent / 'lexicons.json'
    try:
        with open(lexicon_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        GREEK_LEXICON.update(data.get('greek', {}))
        LATIN_LEXICON.update(data.get('latin', {}))
        logger.info(f"Loaded lexicons: {len(GREEK_LEXICON)} Greek, {len(LATIN_LEXICON)} Latin entries")
    except Exception as e:
        logger.warning(f"Failed to load lexicons from {lexicon_path}: {e}")
    _lexicons_loaded = True


# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class TranslateRequest(BaseModel):
    text: str
    source_language: Optional[str] = None  # Auto-detect if not provided
    style: Optional[str] = 'scholarly'
    include_parsing: Optional[bool] = True
    context: Optional[str] = None


class TokenAnalysis(BaseModel):
    token: str
    lemma: Optional[str] = None
    translation: Optional[str] = None
    part_of_speech: Optional[str] = None
    morphology: Optional[Dict[str, str]] = None
    confidence: Optional[float] = None
    semantic_domain: Optional[str] = None


class TranslateResponse(BaseModel):
    source_text: str
    source_language: str
    style: str
    translation: str
    tokens: List[TokenAnalysis]
    provenance: List[Dict[str, Any]]
    fidelity_score: Optional[float] = None
    latency_ms: int


# ============================================================================
# DATABASE CONNECTION
# ============================================================================

async def get_pool():
    """Get or create database connection pool."""
    global _pool
    if _pool is None:
        try:
            _pool = await asyncpg.create_pool(
                DATABASE_URL,
                ssl=False,
                min_size=2,
                max_size=10,
                command_timeout=15
            )
        except Exception as e:
            logger.warning(f"Database connection failed: {e}. Using embedded lexicon only.")
            _pool = "UNAVAILABLE"
    return _pool


# ============================================================================
# TEXT PROCESSING UTILITIES
# ============================================================================

def detect_language(text: str) -> str:
    """Auto-detect whether text is Greek or Latin."""
    greek_chars = len(GREEK_PATTERN.findall(text))
    latin_chars = len(LATIN_PATTERN.findall(text))

    if greek_chars > latin_chars:
        return 'greek'
    elif latin_chars > 0:
        return 'latin'
    else:
        return 'greek'  # Default to Greek for classical texts


def normalize_text(text: str) -> str:
    """Normalize Unicode text for consistent processing."""
    return unicodedata.normalize('NFC', text.strip())


def strip_accents_greek(text: str) -> str:
    """Strip accents from Greek text for fuzzy matching."""
    # Decompose and remove combining diacritical marks
    decomposed = unicodedata.normalize('NFD', text)
    stripped = ''.join(c for c in decomposed if unicodedata.category(c) != 'Mn')
    return stripped.lower()


def tokenize(text: str) -> List[str]:
    """Tokenize Greek/Latin text into words."""
    # Remove punctuation but keep apostrophes and breathing marks
    text = re.sub(r'[.,;:!?\[\](){}—–\-\"\'»«·]', ' ', text)
    tokens = text.split()
    return [t.strip() for t in tokens if t.strip()]


# ============================================================================
# TRANSLATION LOOKUP FUNCTIONS
# ============================================================================

async def lookup_translation_memory(pool, tokens: List[str], source_lang: str) -> Dict[str, Dict]:
    """Look up tokens in translation memory database."""
    if pool == "UNAVAILABLE" or not tokens:
        return {}

    try:
        normalized_tokens = [t.lower() for t in tokens]
        lang_code = 'greek' if source_lang == 'greek' else 'latin'

        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT source_lemma, target_translation, confidence, frequency,
                       semantic_domain, morphological_context
                FROM translation_memory_lexeme
                WHERE LOWER(source_lemma) = ANY($1) AND source_language = $2
                ORDER BY frequency DESC, confidence DESC
            """, normalized_tokens, lang_code)

            results = {}
            for row in rows:
                lemma = row['source_lemma'].lower()
                if lemma not in results:
                    results[lemma] = {
                        'translation': row['target_translation'],
                        'confidence': row['confidence'] or 0.7,
                        'frequency': row['frequency'] or 1,
                        'semantic_domain': row['semantic_domain'],
                        'pos': row['morphological_context']
                    }
            return results

    except Exception as e:
        logger.warning(f"Translation memory lookup failed: {e}")
        return {}


def lookup_embedded_lexicon(tokens: List[str], source_lang: str) -> Dict[str, Dict]:
    """Look up tokens in the embedded lexicon (fallback)."""
    _ensure_lexicons_loaded()
    lexicon = GREEK_LEXICON if source_lang == 'greek' else LATIN_LEXICON
    results = {}

    for token in tokens:
        token_lower = token.lower()

        # Direct lookup
        if token_lower in lexicon:
            entry = lexicon[token_lower]
            results[token_lower] = {
                'translation': entry['translation'],
                'confidence': 0.85,
                'pos': entry.get('pos'),
                'semantic_domain': entry.get('domain')
            }
        else:
            # Try without accents for Greek
            if source_lang == 'greek':
                stripped = strip_accents_greek(token_lower)
                for lex_word, entry in lexicon.items():
                    if strip_accents_greek(lex_word) == stripped:
                        results[token_lower] = {
                            'translation': entry['translation'],
                            'confidence': 0.75,
                            'pos': entry.get('pos'),
                            'semantic_domain': entry.get('domain')
                        }
                        break

    return results


# ============================================================================
# TRANSLATION ASSEMBLY
# ============================================================================

def assemble_translation(tokens: List[str], translations: Dict[str, Dict], style: str) -> str:
    """Assemble final translation from token-level translations."""
    translated_parts = []

    for token in tokens:
        token_lower = token.lower()

        if token_lower in translations:
            trans = translations[token_lower]['translation']
            # For multiple meanings separated by /, pick the first for readability
            if '/' in trans and style in ['accessible', 'literary']:
                trans = trans.split('/')[0]
            translated_parts.append(trans)
        else:
            # Keep untranslated tokens marked
            translated_parts.append(f"[{token}]")

    translation = ' '.join(translated_parts)

    # Post-processing based on style
    if style == 'literary':
        translation = translation.replace(' ,', ',').replace(' .', '.')
        translation = re.sub(r'\s+', ' ', translation)
        if translation:
            translation = translation[0].upper() + translation[1:]
    elif style == 'accessible':
        translation = translation.replace('[', '(').replace(']', ')')
        translation = re.sub(r'\s+', ' ', translation)
    elif style == 'scholarly':
        # Preserve structure
        pass
    elif style == 'literal':
        # Keep everything including brackets
        pass

    return translation.strip()


# ============================================================================
# API ENDPOINT
# ============================================================================

@router.post("")
async def translate_passage(request: TranslateRequest) -> TranslateResponse:
    """
    Translate a Greek or Latin passage with morphological analysis.

    Uses multi-tiered lookup:
    1. Embedded comprehensive lexicon (fast, curated)
    2. Database translation memory (if available)
    3. Dictionary API fallback (Logeion)
    4. Claude API for very rare words (last resort)
    """
    start_time = time.time()

    text = normalize_text(request.text)
    if not text:
        raise HTTPException(400, "Text is required")

    style = request.style or 'scholarly'
    if style not in VALID_STYLES:
        raise HTTPException(400, f"Invalid style. Must be one of: {', '.join(VALID_STYLES)}")

    # Detect or validate language
    source_language = request.source_language
    if source_language:
        source_language = source_language.lower()
        if source_language in ['grc', 'ancient greek', 'gr']:
            source_language = 'greek'
        elif source_language in ['lat', 'la']:
            source_language = 'latin'
    else:
        source_language = detect_language(text)

    if source_language not in ['greek', 'latin']:
        raise HTTPException(400, "Invalid language. Must be 'greek' or 'latin'")

    # Tokenize
    tokens = tokenize(text)
    if not tokens:
        raise HTTPException(400, "No valid tokens found in text")

    provenance = []
    all_translations = {}

    # Tier 1: Embedded lexicon lookup FIRST (high quality, curated)
    lexicon_results = lookup_embedded_lexicon(tokens, source_language)
    all_translations.update(lexicon_results)
    provenance.append({
        'source': 'embedded_lexicon',
        'matches': len(lexicon_results),
        'total_tokens': len(tokens)
    })

    # Tier 2: Database lookup for remaining tokens only
    unmatched = [t for t in tokens if t.lower() not in all_translations]
    if unmatched:
        pool = await get_pool()
        if pool != "UNAVAILABLE":
            db_results = await lookup_translation_memory(pool, unmatched, source_language)
            all_translations.update(db_results)
            provenance.append({
                'source': 'translation_memory_db',
                'matches': len(db_results),
                'tokens_checked': len(unmatched)
            })

    # Build token analysis
    token_analyses = []
    for token in tokens:
        token_lower = token.lower()
        analysis = TokenAnalysis(token=token)

        if token_lower in all_translations:
            trans = all_translations[token_lower]
            analysis.translation = trans.get('translation')
            analysis.confidence = trans.get('confidence')
            analysis.semantic_domain = trans.get('semantic_domain')
            analysis.part_of_speech = trans.get('pos')
            # Set lemma to the matched form
            analysis.lemma = token_lower

        token_analyses.append(analysis)

    # Tier 3: Dictionary API fallback (Logeion/Perseus) for rare words - 50-200ms
    still_unmatched = [t.token for t in token_analyses if not t.translation]
    if still_unmatched:
        import httpx
        dict_matches = 0
        for word in still_unmatched:
            try:
                # Try Logeion API (University of Chicago - free, comprehensive)
                lang_code = "greek" if source_language == "greek" else "latin"
                url = f"https://logeion.uchicago.edu/api/{lang_code}/{word}"
                async with httpx.AsyncClient(timeout=2.0) as client:
                    resp = await client.get(url)
                    if resp.status_code == 200:
                        data = resp.json()
                        # Extract definition from Logeion response
                        if data and isinstance(data, dict):
                            # Logeion returns definitions in various formats
                            definition = None
                            if 'lsj' in data and data['lsj']:  # Liddell-Scott-Jones for Greek
                                definition = data['lsj'].get('def', '')[:100]
                            elif 'ls' in data and data['ls']:  # Lewis-Short for Latin
                                definition = data['ls'].get('def', '')[:100]
                            elif 'middle_liddell' in data and data['middle_liddell']:
                                definition = data['middle_liddell'].get('def', '')[:100]

                            if definition:
                                # Clean up definition
                                definition = definition.split(';')[0].strip()
                                definition = definition.split(',')[0].strip()

                                # Update token analysis
                                for t in token_analyses:
                                    if t.token == word and not t.translation:
                                        t.translation = definition
                                        t.confidence = 0.90
                                        t.semantic_domain = "dictionary"

                                all_translations[word.lower()] = {
                                    'translation': definition,
                                    'confidence': 0.90,
                                    'pos': 'unknown'
                                }
                                dict_matches += 1
            except Exception as e:
                logger.debug(f"Dictionary lookup failed for {word}: {e}")
                continue

        if dict_matches > 0:
            provenance.append({
                'source': 'logeion_dictionary',
                'matches': dict_matches,
                'tokens_checked': len(still_unmatched)
            })

    # Tier 4: Claude API fallback for very rare words (last resort) - 2-3 seconds
    still_unmatched = [t.token for t in token_analyses if not t.translation]
    if still_unmatched:
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if api_key:
            try:
                import anthropic
                client = anthropic.Anthropic(api_key=api_key)
                language_name = "Ancient Greek" if source_language == "greek" else "Latin"

                prompt = f"""Translate these {language_name} words to English (one word/phrase each):
{', '.join(still_unmatched)}

Format: word: translation"""

                message = client.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=300,
                    messages=[{"role": "user", "content": prompt}]
                )

                response_text = message.content[0].text
                ai_matches = 0
                for line in response_text.strip().split('\n'):
                    if ':' in line:
                        word, trans = line.split(':', 1)
                        word = word.strip()
                        trans = trans.strip()
                        for t in token_analyses:
                            if t.token.lower() == word.lower() and not t.translation:
                                t.translation = trans
                                t.confidence = 0.95
                                t.semantic_domain = "ai-translated"
                                ai_matches += 1
                        all_translations[word.lower()] = {
                            'translation': trans,
                            'confidence': 0.95,
                            'pos': 'unknown'
                        }

                if ai_matches > 0:
                    provenance.append({
                        'source': 'claude_api',
                        'matches': ai_matches,
                        'tokens_checked': len(still_unmatched)
                    })
            except Exception as e:
                logger.warning(f"Claude API fallback failed: {e}")

    # Assemble translation
    translation = assemble_translation(tokens, all_translations, style)

    # Calculate fidelity score
    matched_count = sum(1 for t in token_analyses if t.translation)
    fidelity_score = matched_count / len(tokens) if tokens else 0.0

    latency_ms = int((time.time() - start_time) * 1000)

    return TranslateResponse(
        source_text=text,
        source_language=source_language,
        style=style,
        translation=translation,
        tokens=token_analyses,
        provenance=provenance,
        fidelity_score=round(fidelity_score, 3),
        latency_ms=latency_ms
    )


@router.get("/languages")
async def get_supported_languages():
    """Get supported source languages."""
    return {
        "languages": [
            {"code": "greek", "name": "Ancient Greek", "aliases": ["grc", "ancient greek", "gr"]},
            {"code": "latin", "name": "Latin", "aliases": ["lat", "la"]}
        ]
    }


@router.get("/styles")
async def get_translation_styles():
    """Get available translation styles."""
    return {
        "styles": [
            {"id": "scholarly", "name": "Scholarly", "description": "Preserves original structure, technical vocabulary"},
            {"id": "literary", "name": "Literary", "description": "Natural, flowing prose"},
            {"id": "accessible", "name": "Accessible", "description": "Simple vocabulary, clear sentences"},
            {"id": "literal", "name": "Literal", "description": "Word-for-word, close to source"}
        ]
    }


@router.get("/lexicon/stats")
async def get_lexicon_stats():
    """Get embedded lexicon statistics."""
    _ensure_lexicons_loaded()
    return {
        "greek_entries": len(GREEK_LEXICON),
        "latin_entries": len(LATIN_LEXICON),
        "total_entries": len(GREEK_LEXICON) + len(LATIN_LEXICON)
    }
