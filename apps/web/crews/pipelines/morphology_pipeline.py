"""
MORPHOLOGY PIPELINE
Deterministic-first with LLM fallback only for failures
"""

import asyncio
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import logging
import re

logger = logging.getLogger("morphology")


@dataclass
class Token:
    surface: str
    lemma: str
    pos: str
    parse: Optional[str] = None
    gloss: Optional[str] = None
    confidence: float = 1.0
    source: str = "deterministic"  # or "llm_fallback"


# Common Greek words for basic lookup
GREEK_GLOSSES = {
    'καί': 'and', 'ὁ': 'the', 'ἡ': 'the', 'τό': 'the',
    'αὐτός': 'he/she/it', 'δέ': 'but/and', 'εἰμί': 'to be',
    'ἐν': 'in', 'εἰς': 'into', 'ἐκ': 'from',
    'ἀπό': 'from', 'πρός': 'to/toward', 'ἐπί': 'on/upon',
    'διά': 'through', 'μετά': 'with/after', 'κατά': 'according to',
    'περί': 'about', 'ὑπό': 'by/under', 'παρά': 'beside',
    'ἀλλά': 'but', 'γάρ': 'for', 'οὖν': 'therefore',
    'ὅτι': 'that/because', 'εἰ': 'if', 'ὡς': 'as/like',
    'οὐ': 'not', 'μή': 'not', 'θεός': 'god/God',
    'κύριος': 'lord', 'Ἰησοῦς': 'Jesus', 'Χριστός': 'Christ',
    'λέγω': 'to say', 'ποιέω': 'to do/make', 'ἔρχομαι': 'to come',
}


class MorphologyPipeline:
    """
    Deterministic morphology with LLM fallback only.

    Order:
    1. Try CLTK deterministic analyzer
    2. If fails, try heuristic analysis
    3. ONLY IF BOTH FAIL: Use LLM with candidate list
    4. Validate LLM output against lexicon
    """

    def __init__(self, llm_client=None, lexicon: set = None):
        self.llm_client = llm_client
        self.lexicon = lexicon or set()
        self.cltk_available = False
        self.greek_nlp = None
        self.latin_nlp = None
        self._init_cltk()

    def _init_cltk(self):
        """Initialize CLTK analyzers"""
        try:
            from cltk import NLP
            self.greek_nlp = NLP(language="grc", suppress_banner=True)
            self.latin_nlp = NLP(language="lat", suppress_banner=True)
            self.cltk_available = True
            logger.info("CLTK initialized successfully")
        except ImportError:
            logger.warning("CLTK not available, will use heuristics + LLM fallback")
        except Exception as e:
            logger.warning(f"CLTK initialization failed: {e}")

    def analyze_with_cltk(self, text: str, language: str) -> List[Token]:
        """
        Primary: Deterministic analysis using CLTK.
        Fast, free, reproducible.
        """
        if not self.cltk_available:
            return []

        try:
            nlp = self.greek_nlp if language in ["greek", "grc"] else self.latin_nlp
            if nlp is None:
                return []

            doc = nlp.analyze(text=text)
            tokens = []

            for word in doc.words:
                parse = None
                if hasattr(word, 'features') and word.features:
                    parse = str(word.features)

                lemma = word.lemma if hasattr(word, 'lemma') and word.lemma else word.string
                pos = word.pos if hasattr(word, 'pos') else "UNK"

                tokens.append(Token(
                    surface=word.string,
                    lemma=lemma,
                    pos=pos,
                    parse=parse,
                    gloss=GREEK_GLOSSES.get(lemma),
                    confidence=0.9 if lemma != word.string else 0.5,
                    source="cltk"
                ))

            return tokens
        except Exception as e:
            logger.error(f"CLTK analysis failed: {e}")
            return []

    def analyze_with_heuristics(self, text: str, language: str) -> List[Token]:
        """
        Secondary: Heuristic analysis for Greek/Latin.
        No external dependencies, decent accuracy for common patterns.
        """
        # Split on whitespace and punctuation
        raw_tokens = re.findall(r'[\w\u0370-\u03FF\u1F00-\u1FFF]+', text)
        tokens = []

        for surface in raw_tokens:
            pos = self._guess_pos(surface, language)
            lemma = self._guess_lemma(surface, language)
            gloss = GREEK_GLOSSES.get(lemma) or GREEK_GLOSSES.get(surface)

            tokens.append(Token(
                surface=surface,
                lemma=lemma,
                pos=pos,
                parse=None,
                gloss=gloss,
                confidence=0.6 if pos != "UNK" else 0.3,
                source="heuristic"
            ))

        return tokens

    def _guess_pos(self, word: str, language: str) -> str:
        """Guess part of speech from word form (Greek heuristics)."""
        # Articles
        if word in ['ὁ', 'ἡ', 'τό', 'τοῦ', 'τῆς', 'τῷ', 'τῇ', 'τόν', 'τήν',
                    'οἱ', 'αἱ', 'τά', 'τῶν', 'τοῖς', 'ταῖς', 'τούς', 'τάς']:
            return "article"

        # Conjunctions
        if word in ['καί', 'δέ', 'ἀλλά', 'γάρ', 'οὖν', 'ὅτι', 'εἰ', 'ὡς', 'ἤ', 'τε']:
            return "conjunction"

        # Prepositions
        if word in ['ἐν', 'εἰς', 'ἐκ', 'ἀπό', 'πρός', 'ἐπί', 'διά', 'μετά',
                    'κατά', 'περί', 'ὑπό', 'παρά', 'ὑπέρ', 'πρό', 'σύν']:
            return "preposition"

        # Particles
        if word in ['οὐ', 'οὐκ', 'οὐχ', 'μή', 'ναί', 'ἄν', 'γε', 'δή', 'μέν', 'νῦν']:
            return "particle"

        # Verb endings
        if re.search(r'(ω|εις|ει|ομεν|ετε|ουσι|ουσιν|ειν)$', word):
            return "verb"

        # Noun endings (masculine 2nd declension)
        if re.search(r'(ος|ου|ῳ|ον|οι|ων|οις|ους)$', word):
            return "noun"

        # Noun endings (feminine 1st declension)
        if re.search(r'(η|ης|ῃ|ην|αι|ων|αις|ας)$', word):
            return "noun"

        return "UNK"

    def _guess_lemma(self, word: str, language: str) -> str:
        """Guess lemma from word form."""
        # For known words, return as-is (they're often already lemmas or close)
        if word in GREEK_GLOSSES:
            return word
        # Otherwise return the surface form
        return word

    async def analyze_with_llm_fallback(
        self,
        failed_tokens: List[str],
        context: str,
        language: str
    ) -> List[Token]:
        """
        FALLBACK ONLY: Use LLM for tokens that failed deterministic analysis.
        Includes validation against lexicon.
        """
        if not self.llm_client or not failed_tokens:
            return []

        prompt = f"""Analyze these {language} tokens that could not be parsed deterministically.

Context: {context[:200]}
Tokens needing analysis: {failed_tokens}

For each token provide:
- surface: the token
- lemma: dictionary form (MUST be a valid {language} word)
- pos: part of speech
- parse: grammatical analysis
- confidence: your confidence 0-1

Return as JSON: {{"tokens": [...]}}

BE CONSERVATIVE. If unsure, set confidence < 0.5."""

        try:
            response = await self.llm_client.generate(prompt)
            llm_tokens = response.get('tokens', [])

            # Validate against lexicon
            validated = []
            for t in llm_tokens:
                token = Token(
                    surface=t['surface'],
                    lemma=t['lemma'],
                    pos=t['pos'],
                    parse=t.get('parse'),
                    confidence=t.get('confidence', 0.5),
                    source="llm_fallback"
                )

                # Check lemma exists in lexicon (if we have one)
                if self.lexicon and token.lemma.lower() not in self.lexicon:
                    token.confidence *= 0.5  # Penalize unknown lemmas
                    logger.warning(f"LLM lemma '{token.lemma}' not in lexicon")

                validated.append(token)

            return validated
        except Exception as e:
            logger.error(f"LLM fallback failed: {e}")
            return []

    async def analyze(self, text: str, language: str = "greek") -> List[Token]:
        """
        Main entry point: Deterministic first, LLM fallback only for failures.
        """
        # Step 1: Try CLTK (if available)
        tokens = self.analyze_with_cltk(text, language)

        # Step 2: If CLTK failed or unavailable, use heuristics
        if not tokens:
            tokens = self.analyze_with_heuristics(text, language)

        # Step 3: Find failures (low confidence or missing lemma)
        failed_surfaces = [
            t.surface for t in tokens
            if t.confidence < 0.5 or t.lemma == t.surface
        ]

        # Step 4: LLM fallback for failures ONLY
        if failed_surfaces and self.llm_client:
            logger.info(f"LLM fallback for {len(failed_surfaces)} tokens")
            fallback_tokens = await self.analyze_with_llm_fallback(
                failed_surfaces, text, language
            )

            # Merge fallback into results
            fallback_map = {t.surface: t for t in fallback_tokens}
            for i, token in enumerate(tokens):
                if token.surface in fallback_map:
                    tokens[i] = fallback_map[token.surface]

        return tokens

    def analyze_sync(self, text: str, language: str = "greek") -> List[Token]:
        """Synchronous version (no LLM fallback)."""
        tokens = self.analyze_with_cltk(text, language)
        if not tokens:
            tokens = self.analyze_with_heuristics(text, language)
        return tokens
