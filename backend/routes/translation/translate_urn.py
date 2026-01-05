"""
LOGOS Translation Engine API
Phase 5: Fast translation lookup with style variants and provenance

POST /api/translation/translate_urn
- Input: { urn: string, style?: "scholarly"|"literary"|"accessible"|"literal" }
- Output: { translation, provenance[], fidelityScore, latencyMs }
- p95 latency ≤ 50ms for cache hit
"""

import os
import time
import json
from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncpg

router = APIRouter()

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

# Connection pool (initialized lazily)
_pool = None

VALID_STYLES = ['scholarly', 'literary', 'accessible', 'literal']


class TranslateRequest(BaseModel):
    urn: str
    style: Optional[str] = 'scholarly'


class ProvenanceItem(BaseModel):
    source: str
    confidence: float
    details: Optional[dict] = None


class TranslateResponse(BaseModel):
    urn: str
    style: str
    translation: str
    sourceText: Optional[str] = None
    sourceLanguage: Optional[str] = None
    provenance: List[ProvenanceItem]
    fidelityScore: Optional[float] = None
    latencyMs: int
    cached: bool


async def get_pool():
    """Get or create connection pool."""
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
async def translate_urn(request: TranslateRequest) -> TranslateResponse:
    """
    Translate a passage by URN.

    1. Look up pre-computed passage_style_variants (cache hit)
    2. If miss, look up passage_consensus and generate variant
    3. If still miss, look up from translations table directly
    4. Return with full provenance trail
    """
    start_time = time.time()

    urn = request.urn.strip()
    style = request.style or 'scholarly'

    if style not in VALID_STYLES:
        raise HTTPException(400, f"Invalid style. Must be one of: {', '.join(VALID_STYLES)}")

    if not urn:
        raise HTTPException(400, "URN is required")

    pool = await get_pool()
    provenance = []

    async with pool.acquire() as conn:
        # Strategy 1: Pre-computed style variant (fastest path)
        variant = await conn.fetchrow("""
            SELECT v.variant_text, v.fidelity_score,
                   c.source_text, c.source_language, c.confidence
            FROM passage_style_variants v
            JOIN passage_consensus c ON v.consensus_id = c.id
            WHERE v.urn = $1 AND v.style = $2
        """, urn, style)

        if variant:
            latency_ms = int((time.time() - start_time) * 1000)
            return TranslateResponse(
                urn=urn,
                style=style,
                translation=variant['variant_text'],
                sourceText=variant['source_text'],
                sourceLanguage=variant['source_language'],
                provenance=[
                    ProvenanceItem(
                        source='passage_style_variants',
                        confidence=variant['confidence'] or 0.8,
                        details={'cached': True}
                    )
                ],
                fidelityScore=variant['fidelity_score'],
                latencyMs=latency_ms,
                cached=True
            )

        # Strategy 2: Consensus entry (slower - need to select default)
        consensus = await conn.fetchrow("""
            SELECT id, consensus_translation, source_text, source_language,
                   confidence, fidelity_score
            FROM passage_consensus
            WHERE urn = $1
        """, urn)

        if consensus:
            # Return consensus as fallback (style=literal is closest to consensus)
            latency_ms = int((time.time() - start_time) * 1000)
            return TranslateResponse(
                urn=urn,
                style='literal',  # Consensus is neutral/literal
                translation=consensus['consensus_translation'],
                sourceText=consensus['source_text'],
                sourceLanguage=consensus['source_language'],
                provenance=[
                    ProvenanceItem(
                        source='passage_consensus',
                        confidence=consensus['confidence'] or 0.7,
                        details={'requested_style': style, 'returned_style': 'literal'}
                    )
                ],
                fidelityScore=consensus['fidelity_score'],
                latencyMs=latency_ms,
                cached=False
            )

        # Strategy 3: Direct translation lookup (slowest path)
        # Try to find by URN in source_texts
        translation = await conn.fetchrow("""
            SELECT t.translation, t.style, t.ltqi_score,
                   st.content as source_text, st.language as source_language
            FROM translations t
            JOIN source_texts st ON t.text_id = st.id
            WHERE st.urn = $1
            ORDER BY t.ltqi_score DESC NULLS LAST
            LIMIT 1
        """, urn)

        if translation:
            latency_ms = int((time.time() - start_time) * 1000)
            return TranslateResponse(
                urn=urn,
                style=translation['style'] or 'literal',
                translation=translation['translation'],
                sourceText=translation['source_text'],
                sourceLanguage=translation['source_language'],
                provenance=[
                    ProvenanceItem(
                        source='translations',
                        confidence=0.6,
                        details={'direct_lookup': True}
                    )
                ],
                fidelityScore=translation['ltqi_score'],
                latencyMs=latency_ms,
                cached=False
            )

        # No translation found
        latency_ms = int((time.time() - start_time) * 1000)
        raise HTTPException(404, f"No translation found for URN: {urn}")


@router.get("/styles")
async def get_styles():
    """Get available translation styles."""
    return {
        "styles": [
            {"id": "scholarly", "name": "Scholarly", "description": "Technical, preserves original structure"},
            {"id": "literary", "name": "Literary", "description": "Natural, flowing prose"},
            {"id": "accessible", "name": "Accessible", "description": "Simple vocabulary, clear sentences"},
            {"id": "literal", "name": "Literal", "description": "Word-for-word, close to source"}
        ]
    }


@router.get("/stats")
async def get_translation_stats():
    """Get translation system statistics."""
    pool = await get_pool()

    async with pool.acquire() as conn:
        stats = await conn.fetchrow("""
            SELECT
                (SELECT COUNT(*) FROM passage_consensus) as consensus_count,
                (SELECT COUNT(*) FROM passage_style_variants) as variant_count,
                (SELECT COUNT(*) FROM translation_memory_lexeme) as lexeme_count,
                (SELECT COUNT(*) FROM translation_memory_phrase) as phrase_count,
                (SELECT COUNT(*) FROM translations) as total_translations
        """)

        return {
            "consensusCount": stats['consensus_count'],
            "variantCount": stats['variant_count'],
            "lexemeCount": stats['lexeme_count'],
            "phraseCount": stats['phrase_count'],
            "totalTranslations": stats['total_translations'],
            "styles": VALID_STYLES
        }
