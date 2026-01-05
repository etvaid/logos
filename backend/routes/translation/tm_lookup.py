"""
LOGOS Translation Memory Lookup API
Phase 5: Query translation memory for lexemes, phrases, idioms

POST /api/translation/tm_lookup
- Input: { tokens: string[], sourceLanguage: string }
- Output: { matches: TmMatch[] }
- p95 latency ≤ 100ms
"""

import os
import time
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncpg

router = APIRouter()

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

_pool = None


class TmLookupRequest(BaseModel):
    tokens: List[str]
    sourceLanguage: str


class TmMatch(BaseModel):
    sourceToken: str
    targetTranslation: str
    matchType: str  # 'lexeme', 'phrase', 'idiom'
    confidence: float
    frequency: int
    semanticDomain: Optional[str] = None


class TmLookupResponse(BaseModel):
    matches: List[TmMatch]
    latencyMs: int


async def get_pool():
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            DATABASE_URL,
            ssl=False,
            min_size=2,
            max_size=10,
            command_timeout=10
        )
    return _pool


@router.post("")
async def tm_lookup(request: TmLookupRequest) -> TmLookupResponse:
    """
    Look up translation memory entries for given tokens.
    Returns lexeme, phrase, and idiom matches.
    """
    start_time = time.time()

    if not request.tokens:
        return TmLookupResponse(matches=[], latencyMs=0)

    source_lang = request.sourceLanguage.lower()
    tokens = [t.lower().strip() for t in request.tokens if t.strip()]

    if not tokens:
        return TmLookupResponse(matches=[], latencyMs=0)

    pool = await get_pool()
    matches = []

    async with pool.acquire() as conn:
        # 1. Lexeme matches
        lexeme_rows = await conn.fetch("""
            SELECT source_lemma, target_translation, confidence, frequency, semantic_domain
            FROM translation_memory_lexeme
            WHERE source_lemma = ANY($1) AND source_language = $2
            ORDER BY frequency DESC, confidence DESC
            LIMIT 100
        """, tokens, source_lang)

        for row in lexeme_rows:
            matches.append(TmMatch(
                sourceToken=row['source_lemma'],
                targetTranslation=row['target_translation'],
                matchType='lexeme',
                confidence=row['confidence'] or 0.5,
                frequency=row['frequency'] or 1,
                semanticDomain=row['semantic_domain']
            ))

        # 2. Phrase matches (bigrams)
        if len(tokens) >= 2:
            bigrams = [f"{tokens[i]} {tokens[i+1]}" for i in range(len(tokens) - 1)]
            phrase_rows = await conn.fetch("""
                SELECT source_phrase, target_phrase, confidence, frequency
                FROM translation_memory_phrase
                WHERE source_phrase = ANY($1) AND source_language = $2
                ORDER BY frequency DESC, confidence DESC
                LIMIT 50
            """, bigrams, source_lang)

            for row in phrase_rows:
                matches.append(TmMatch(
                    sourceToken=row['source_phrase'],
                    targetTranslation=row['target_phrase'],
                    matchType='phrase',
                    confidence=row['confidence'] or 0.5,
                    frequency=row['frequency'] or 1
                ))

        # 3. Idiom matches
        idiom_rows = await conn.fetch("""
            SELECT source_idiom, idiomatic_translation, explanation
            FROM translation_memory_idiom
            WHERE source_idiom = ANY($1) AND source_language = $2
            LIMIT 20
        """, tokens, source_lang)

        for row in idiom_rows:
            matches.append(TmMatch(
                sourceToken=row['source_idiom'],
                targetTranslation=row['idiomatic_translation'],
                matchType='idiom',
                confidence=0.8,  # Idioms are manually curated
                frequency=1
            ))

    latency_ms = int((time.time() - start_time) * 1000)
    return TmLookupResponse(matches=matches, latencyMs=latency_ms)


@router.get("/search")
async def search_tm(
    query: str,
    source_language: Optional[str] = None,
    limit: int = 20
):
    """
    Search translation memory by query string.
    """
    if not query or len(query) < 2:
        raise HTTPException(400, "Query must be at least 2 characters")

    pool = await get_pool()

    async with pool.acquire() as conn:
        # Search lexemes
        if source_language:
            rows = await conn.fetch("""
                SELECT source_lemma, target_translation, source_language,
                       confidence, frequency, semantic_domain
                FROM translation_memory_lexeme
                WHERE (source_lemma ILIKE $1 OR target_translation ILIKE $1)
                AND source_language = $2
                ORDER BY frequency DESC
                LIMIT $3
            """, f"%{query}%", source_language, limit)
        else:
            rows = await conn.fetch("""
                SELECT source_lemma, target_translation, source_language,
                       confidence, frequency, semantic_domain
                FROM translation_memory_lexeme
                WHERE source_lemma ILIKE $1 OR target_translation ILIKE $1
                ORDER BY frequency DESC
                LIMIT $2
            """, f"%{query}%", limit)

        return {
            "results": [dict(r) for r in rows],
            "query": query,
            "count": len(rows)
        }
