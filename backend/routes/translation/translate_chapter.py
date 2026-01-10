"""
LOGOS Translation Engine - Chapter Translation API
Translate entire chapters with parallel text, scholar translations, and semantic analysis.

POST /api/translation/translate_chapter
- Input: { chapter_id: string, language?: string, style?: string }
- Output: { original_text, translations[], semantic_links, latencyMs }
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import asyncpg
import os
import time
import re
import unicodedata
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

_pool = None

VALID_STYLES = ['scholarly', 'literary', 'accessible', 'literal']

# Import lexicons from translate_passage
from .translate_passage import (
    GREEK_LEXICON, LATIN_LEXICON,
    detect_language, normalize_text, tokenize,
    lookup_embedded_lexicon, strip_accents_greek,
    GREEK_PATTERN, LATIN_PATTERN
)


# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class ChapterTranslationRequest(BaseModel):
    chapter_id: str
    urn: Optional[str] = None
    text: Optional[str] = None  # Can provide text directly
    language: Optional[str] = None
    style: Optional[str] = 'scholarly'
    include_scholar_translations: Optional[bool] = True


class ScholarTranslation(BaseModel):
    scholar_name: str
    translation: str
    style: Optional[str] = None
    confidence: Optional[float] = None
    source: Optional[str] = None


class SemanticLink(BaseModel):
    concept: str
    related_passages: List[str]
    domain: Optional[str] = None


class TokenInfo(BaseModel):
    token: str
    translation: Optional[str] = None
    lemma: Optional[str] = None
    pos: Optional[str] = None


class ChapterTranslationResponse(BaseModel):
    chapter_id: str
    original_text: str
    source_language: str
    style: str
    ai_translation: str
    scholar_translations: List[ScholarTranslation]
    tokens: List[TokenInfo]
    semantic_links: Dict[str, Any]
    fidelity_score: float
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
                command_timeout=30
            )
        except Exception as e:
            logger.warning(f"Database connection failed: {e}. Using embedded lexicon only.")
            _pool = "UNAVAILABLE"
    return _pool


# ============================================================================
# TRANSLATION FUNCTIONS
# ============================================================================

async def get_chapter_text(pool, chapter_id: str, urn: str = None) -> Optional[Dict]:
    """Retrieve chapter text from database."""
    if pool == "UNAVAILABLE":
        return None

    try:
        async with pool.acquire() as conn:
            # Try by URN first
            if urn:
                row = await conn.fetchrow("""
                    SELECT content, language, urn, title
                    FROM source_texts
                    WHERE urn = $1
                    LIMIT 1
                """, urn)
                if row:
                    return {
                        'text': row['content'],
                        'language': row['language'],
                        'urn': row['urn'],
                        'title': row['title']
                    }

            # Try by chapter_id
            row = await conn.fetchrow("""
                SELECT content, language, urn, title
                FROM source_texts
                WHERE id::text = $1 OR urn LIKE $2
                LIMIT 1
            """, chapter_id, f"%{chapter_id}%")

            if row:
                return {
                    'text': row['content'],
                    'language': row['language'],
                    'urn': row['urn'],
                    'title': row['title']
                }

    except Exception as e:
        logger.warning(f"Chapter lookup failed: {e}")

    return None


async def get_scholar_translations(pool, urn: str) -> List[ScholarTranslation]:
    """Retrieve existing scholar translations for a passage."""
    if pool == "UNAVAILABLE":
        return []

    try:
        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT t.translation, t.style, t.ltqi_score,
                       COALESCE(t.translator_name, 'Unknown') as translator
                FROM translations t
                JOIN source_texts st ON t.text_id = st.id
                WHERE st.urn = $1
                ORDER BY t.ltqi_score DESC NULLS LAST
                LIMIT 5
            """, urn)

            translations = []
            for row in rows:
                translations.append(ScholarTranslation(
                    scholar_name=row['translator'],
                    translation=row['translation'],
                    style=row['style'],
                    confidence=row['ltqi_score'],
                    source='database'
                ))

            return translations

    except Exception as e:
        logger.warning(f"Scholar translation lookup failed: {e}")
        return []


async def get_consensus_translation(pool, urn: str) -> Optional[str]:
    """Get consensus translation for a passage."""
    if pool == "UNAVAILABLE":
        return None

    try:
        async with pool.acquire() as conn:
            row = await conn.fetchrow("""
                SELECT consensus_translation, confidence
                FROM passage_consensus
                WHERE urn = $1
            """, urn)

            if row:
                return row['consensus_translation']

    except Exception as e:
        logger.warning(f"Consensus lookup failed: {e}")

    return None


async def lookup_translation_memory_batch(pool, tokens: List[str], source_lang: str) -> Dict[str, Dict]:
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


def translate_tokens(tokens: List[str], translations: Dict[str, Dict], style: str) -> str:
    """Assemble translation from token-level translations."""
    translated_parts = []

    for token in tokens:
        token_lower = token.lower()

        if token_lower in translations:
            trans = translations[token_lower]['translation']
            # For multiple meanings, pick the first for readability in literary style
            if '/' in trans and style in ['accessible', 'literary']:
                trans = trans.split('/')[0]
            translated_parts.append(trans)
        else:
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

    return translation.strip()


def extract_semantic_concepts(tokens: List[str], translations: Dict[str, Dict]) -> Dict[str, Any]:
    """Extract semantic concepts from translated tokens."""
    domains = {}
    key_terms = []

    for token in tokens:
        token_lower = token.lower()
        if token_lower in translations:
            trans = translations[token_lower]
            domain = trans.get('semantic_domain')
            if domain:
                if domain not in domains:
                    domains[domain] = []
                domains[domain].append({
                    'term': token,
                    'translation': trans['translation']
                })

            # Identify key philosophical/important terms
            if trans.get('confidence', 0) > 0.7:
                key_terms.append({
                    'source': token,
                    'translation': trans['translation'],
                    'domain': domain
                })

    return {
        'domains': domains,
        'key_terms': key_terms[:10],  # Top 10 key terms
        'total_concepts': len(key_terms)
    }


# ============================================================================
# API ENDPOINT
# ============================================================================

@router.post("")
async def translate_chapter(request: ChapterTranslationRequest) -> ChapterTranslationResponse:
    """
    Translate a chapter with comprehensive analysis.

    Features:
    - Token-by-token translation with lexicon lookup
    - Scholar translations from database
    - Semantic domain extraction
    - Multiple style options
    """
    start_time = time.time()

    pool = await get_pool()

    # Get chapter text
    original_text = None
    source_language = None
    urn = request.urn

    if request.text:
        # Text provided directly
        original_text = normalize_text(request.text)
        source_language = request.language or detect_language(original_text)
    else:
        # Look up from database
        chapter_data = await get_chapter_text(pool, request.chapter_id, request.urn)
        if chapter_data:
            original_text = chapter_data['text']
            source_language = chapter_data.get('language', 'greek')
            urn = chapter_data.get('urn', request.chapter_id)

    if not original_text:
        raise HTTPException(404, f"Chapter not found: {request.chapter_id}")

    original_text = normalize_text(original_text)

    # Normalize language
    if source_language:
        source_language = source_language.lower()
        if source_language in ['grc', 'ancient greek', 'gr']:
            source_language = 'greek'
        elif source_language in ['lat', 'la']:
            source_language = 'latin'
    else:
        source_language = detect_language(original_text)

    style = request.style or 'scholarly'
    if style not in VALID_STYLES:
        style = 'scholarly'

    # Tokenize
    tokens = tokenize(original_text)
    if not tokens:
        raise HTTPException(400, "No valid tokens found in chapter text")

    # Multi-tiered translation lookup
    all_translations = {}

    # Tier 1: Database lookup
    if pool != "UNAVAILABLE":
        db_results = await lookup_translation_memory_batch(pool, tokens, source_language)
        all_translations.update(db_results)

    # Tier 2: Embedded lexicon for remaining tokens
    unmatched = [t for t in tokens if t.lower() not in all_translations]
    if unmatched:
        lexicon_results = lookup_embedded_lexicon(unmatched, source_language)
        all_translations.update(lexicon_results)

    # Generate AI translation
    ai_translation = translate_tokens(tokens, all_translations, style)

    # Try to get consensus translation as alternative
    consensus = None
    if pool != "UNAVAILABLE" and urn:
        consensus = await get_consensus_translation(pool, urn)

    # Get scholar translations
    scholar_translations = []
    if request.include_scholar_translations and pool != "UNAVAILABLE" and urn:
        scholar_translations = await get_scholar_translations(pool, urn)

    # If we have a consensus, add it as a scholar translation
    if consensus and consensus != ai_translation:
        scholar_translations.insert(0, ScholarTranslation(
            scholar_name="LOGOS Consensus",
            translation=consensus,
            style="literal",
            confidence=0.9,
            source="consensus"
        ))

    # Build token info
    token_info = []
    for token in tokens:
        token_lower = token.lower()
        info = TokenInfo(token=token)
        if token_lower in all_translations:
            trans = all_translations[token_lower]
            info.translation = trans.get('translation')
            info.lemma = token_lower
            info.pos = trans.get('pos')
        token_info.append(info)

    # Extract semantic concepts
    semantic_links = extract_semantic_concepts(tokens, all_translations)

    # Calculate fidelity score
    matched_count = sum(1 for t in token_info if t.translation)
    fidelity_score = matched_count / len(tokens) if tokens else 0.0

    latency_ms = int((time.time() - start_time) * 1000)

    return ChapterTranslationResponse(
        chapter_id=request.chapter_id,
        original_text=original_text,
        source_language=source_language,
        style=style,
        ai_translation=ai_translation,
        scholar_translations=scholar_translations,
        tokens=token_info,
        semantic_links=semantic_links,
        fidelity_score=round(fidelity_score, 3),
        latency_ms=latency_ms
    )


@router.get("/info/{chapter_id}")
async def get_chapter_info(chapter_id: str):
    """Get basic info about a chapter without full translation."""
    pool = await get_pool()

    if pool == "UNAVAILABLE":
        raise HTTPException(503, "Database unavailable")

    try:
        async with pool.acquire() as conn:
            row = await conn.fetchrow("""
                SELECT id, urn, title, language,
                       LENGTH(content) as char_count,
                       array_length(string_to_array(content, ' '), 1) as word_count
                FROM source_texts
                WHERE id::text = $1 OR urn LIKE $2
                LIMIT 1
            """, chapter_id, f"%{chapter_id}%")

            if not row:
                raise HTTPException(404, f"Chapter not found: {chapter_id}")

            return {
                "chapter_id": str(row['id']),
                "urn": row['urn'],
                "title": row['title'],
                "language": row['language'],
                "char_count": row['char_count'],
                "word_count": row['word_count']
            }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Error retrieving chapter info: {str(e)}")
