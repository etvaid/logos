"""
LOGOS Citation Bundle API
Phase 9: WOW features - Generate scholarly citations for translations

GET /api/translation/citation_bundle/:urn
- Output: { passage, translations[], sources[], citationFormats }
"""

import os
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncpg

router = APIRouter()

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

_pool = None


class TranslationVariant(BaseModel):
    style: str
    text: str
    fidelityScore: Optional[float]


class SourceReference(BaseModel):
    type: str  # 'manuscript', 'edition', 'commentary', 'parallel'
    title: str
    author: Optional[str]
    year: Optional[str]
    location: Optional[str]


class CitationBundle(BaseModel):
    urn: str
    sourceLanguage: str
    sourceText: str
    author: Optional[str]
    work: Optional[str]
    section: Optional[str]
    translations: List[TranslationVariant]
    sources: List[SourceReference]
    citations: dict  # Multiple citation formats
    provenance: List[dict]
    generatedAt: str


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


def format_chicago_citation(author: str, work: str, section: str, year: str = None) -> str:
    """Generate Chicago style citation."""
    parts = []
    if author:
        parts.append(author)
    if work:
        parts.append(f"*{work}*")
    if section:
        parts.append(section)
    if year:
        parts.append(f"({year})")
    return ", ".join(parts) + "."


def format_mla_citation(author: str, work: str, section: str, edition: str = None) -> str:
    """Generate MLA style citation."""
    parts = []
    if author:
        parts.append(author + ".")
    if work:
        parts.append(f"*{work}*.")
    if edition:
        parts.append(edition + ".")
    if section:
        parts.append(section + ".")
    return " ".join(parts)


def format_apa_citation(author: str, work: str, year: str = None) -> str:
    """Generate APA style citation."""
    parts = []
    if author:
        parts.append(author)
    if year:
        parts.append(f"({year})")
    else:
        parts.append("(n.d.)")
    if work:
        parts.append(f"*{work}*")
    return ". ".join(parts) + "."


def format_turabian_citation(author: str, work: str, section: str, translator: str = None) -> str:
    """Generate Turabian style citation."""
    parts = []
    if author:
        parts.append(author)
    if work:
        parts.append(f"*{work}*")
    if section:
        parts.append(section)
    if translator:
        parts.append(f"trans. {translator}")
    return ", ".join(parts) + "."


@router.get("/{urn:path}")
async def get_citation_bundle(urn: str) -> CitationBundle:
    """
    Generate a complete citation bundle for a passage.

    Includes all translation variants, source references,
    and formatted citations in multiple academic styles.
    """
    pool = await get_pool()

    async with pool.acquire() as conn:
        # Get passage consensus
        consensus = await conn.fetchrow("""
            SELECT urn, source_language, source_text, consensus_translation,
                   confidence, contributor_count, theological_choices
            FROM passage_consensus
            WHERE urn = $1
        """, urn)

        if not consensus:
            # Try to find from source_texts
            source = await conn.fetchrow("""
                SELECT urn, language, content, author, work, section
                FROM source_texts
                WHERE urn = $1
            """, urn)

            if not source:
                raise HTTPException(404, f"Passage not found: {urn}")

            # Build minimal bundle from source
            return CitationBundle(
                urn=urn,
                sourceLanguage=source['language'],
                sourceText=source['content'] or '',
                author=source['author'],
                work=source['work'],
                section=source['section'],
                translations=[],
                sources=[],
                citations={
                    'chicago': format_chicago_citation(source['author'], source['work'], source['section']),
                    'mla': format_mla_citation(source['author'], source['work'], source['section']),
                    'apa': format_apa_citation(source['author'], source['work']),
                    'turabian': format_turabian_citation(source['author'], source['work'], source['section'])
                },
                provenance=[{'type': 'source_text', 'urn': urn}],
                generatedAt=datetime.now().isoformat()
            )

        # Get style variants
        variants = await conn.fetch("""
            SELECT style, variant_text, fidelity_score
            FROM passage_style_variants
            WHERE urn = $1
        """, urn)

        translations = [
            TranslationVariant(
                style=v['style'],
                text=v['variant_text'],
                fidelityScore=v['fidelity_score']
            )
            for v in variants
        ]

        # Add consensus as "neutral" variant if not in variants
        if not any(t.style == 'neutral' for t in translations):
            translations.insert(0, TranslationVariant(
                style='neutral',
                text=consensus['consensus_translation'],
                fidelityScore=None
            ))

        # Get source metadata
        source_meta = await conn.fetchrow("""
            SELECT author, work, section
            FROM source_texts
            WHERE urn = $1
        """, urn)

        author = source_meta['author'] if source_meta else None
        work = source_meta['work'] if source_meta else None
        section = source_meta['section'] if source_meta else None

        # Generate sources list (in production, would query actual sources)
        sources = [
            SourceReference(
                type='primary',
                title=f"{work or 'Unknown Work'}",
                author=author,
                year=None,
                location=section
            )
        ]

        # Generate citations
        citations = {
            'chicago': format_chicago_citation(author, work, section),
            'mla': format_mla_citation(author, work, section),
            'apa': format_apa_citation(author, work),
            'turabian': format_turabian_citation(author, work, section)
        }

        # Build provenance trail
        provenance = [
            {'type': 'consensus', 'contributors': consensus['contributor_count'], 'confidence': consensus['confidence']},
            {'type': 'variants', 'count': len(variants)}
        ]

        if consensus['theological_choices']:
            provenance.append({'type': 'theological_choices', 'choices': consensus['theological_choices']})

        return CitationBundle(
            urn=urn,
            sourceLanguage=consensus['source_language'],
            sourceText=consensus['source_text'] or '',
            author=author,
            work=work,
            section=section,
            translations=translations,
            sources=sources,
            citations=citations,
            provenance=provenance,
            generatedAt=datetime.now().isoformat()
        )
