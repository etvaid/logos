#!/usr/bin/env python3
"""
Translation Repository - Database operations for translations and quality scoring.
"""

from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass
import asyncpg
from .base import BaseRepository


@dataclass
class TranslationQualityScore:
    """Quality scores for a translation"""
    translation_id: int
    semantic_fidelity: float
    style_consistency: float
    translator_bias: float
    register_match: float
    literalness: float
    readability: float
    overall_score: float


class TranslationRepository(BaseRepository):
    """Repository for translation-related database operations."""

    async def get_translation(self, translation_id: int) -> Optional[asyncpg.Record]:
        """Get a translation by ID."""
        return await self.fetch_one("""
            SELECT t.*, tr.name as translator_name,
                   s.text_content as source_text,
                   s.reference as source_reference
            FROM translations t
            LEFT JOIN translators tr ON t.translator_id = tr.id
            LEFT JOIN source_texts s ON t.source_text_id = s.id
            WHERE t.id = $1
        """, translation_id)

    async def get_translations_by_source(
        self,
        source_text_id: int,
        limit: int = 100
    ) -> List[asyncpg.Record]:
        """Get all translations of a source text."""
        return await self.fetch_all("""
            SELECT t.*, tr.name as translator_name
            FROM translations t
            LEFT JOIN translators tr ON t.translator_id = tr.id
            WHERE t.source_text_id = $1
            ORDER BY t.ltqi_score DESC NULLS LAST
            LIMIT $2
        """, source_text_id, limit)

    async def get_translations_by_translator(
        self,
        translator_id: int,
        limit: int = 1000
    ) -> List[asyncpg.Record]:
        """Get translations by a specific translator."""
        return await self.fetch_all("""
            SELECT t.*, s.reference as source_reference
            FROM translations t
            LEFT JOIN source_texts s ON t.source_text_id = s.id
            WHERE t.translator_id = $1
            ORDER BY t.created_at DESC
            LIMIT $2
        """, translator_id, limit)

    async def get_translation_count_by_translator(self) -> List[asyncpg.Record]:
        """Get translation counts per translator."""
        return await self.fetch_all("""
            SELECT tr.id, tr.name, COUNT(t.id) as translation_count
            FROM translators tr
            LEFT JOIN translations t ON t.translator_id = tr.id
            GROUP BY tr.id, tr.name
            ORDER BY translation_count DESC
        """)

    async def get_translations_needing_quality_scores(
        self,
        limit: int = 1000
    ) -> List[asyncpg.Record]:
        """Get translations without quality scores."""
        return await self.fetch_all("""
            SELECT t.id, t.text_content, t.translator_id, t.embedding,
                   s.text_content as source_text
            FROM translations t
            LEFT JOIN source_texts s ON t.source_text_id = s.id
            WHERE t.ltqi_score IS NULL
            LIMIT $1
        """, limit)

    async def update_quality_scores(
        self,
        translation_id: int,
        scores: TranslationQualityScore
    ) -> str:
        """Update quality scores for a translation."""
        return await self.execute("""
            UPDATE translations
            SET semantic_score = $2,
                syntactic_score = $3,
                register_score = $4,
                fluency_score = $5,
                ltqi_score = $6,
                updated_at = NOW()
            WHERE id = $1
        """,
            translation_id,
            scores.semantic_fidelity,
            scores.style_consistency,
            scores.register_match,
            scores.readability,
            scores.overall_score
        )

    async def bulk_update_quality_scores(
        self,
        scores: List[Tuple[int, float, float, float, float, float]]
    ) -> None:
        """
        Bulk update quality scores.

        Args:
            scores: List of (translation_id, semantic, syntactic, register, fluency, overall)
        """
        await self.execute_many("""
            UPDATE translations
            SET semantic_score = $2,
                syntactic_score = $3,
                register_score = $4,
                fluency_score = $5,
                ltqi_score = $6,
                updated_at = NOW()
            WHERE id = $1
        """, scores)

    async def get_quality_statistics(self) -> Dict[str, Any]:
        """Get overall quality score statistics."""
        row = await self.fetch_one("""
            SELECT
                COUNT(*) as total_translations,
                COUNT(ltqi_score) as scored_translations,
                AVG(ltqi_score) as avg_ltqi,
                MIN(ltqi_score) as min_ltqi,
                MAX(ltqi_score) as max_ltqi,
                STDDEV(ltqi_score) as stddev_ltqi,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ltqi_score) as median_ltqi
            FROM translations
            WHERE ltqi_score IS NOT NULL
        """)

        return dict(row) if row else {}

    async def get_quality_by_translator(self) -> List[asyncpg.Record]:
        """Get average quality scores by translator."""
        return await self.fetch_all("""
            SELECT
                tr.id, tr.name,
                COUNT(t.id) as translation_count,
                AVG(t.ltqi_score) as avg_ltqi,
                AVG(t.semantic_score) as avg_semantic,
                AVG(t.fluency_score) as avg_fluency
            FROM translators tr
            LEFT JOIN translations t ON t.translator_id = tr.id
            WHERE t.ltqi_score IS NOT NULL
            GROUP BY tr.id, tr.name
            HAVING COUNT(t.id) >= 10
            ORDER BY avg_ltqi DESC
        """)

    async def flag_translation_issue(
        self,
        translation_id: int,
        issue_type: str,
        severity: float,
        details: Dict[str, Any]
    ) -> str:
        """Flag a translation for review."""
        import json
        return await self.execute("""
            INSERT INTO translation_issues
            (translation_id, issue_type, severity, details, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (translation_id, issue_type)
            DO UPDATE SET severity = $3, details = $4, updated_at = NOW()
        """, translation_id, issue_type, severity, json.dumps(details))

    async def get_flagged_translations(
        self,
        issue_type: str = None,
        min_severity: float = 0.5,
        limit: int = 100
    ) -> List[asyncpg.Record]:
        """Get flagged translations for review."""
        if issue_type:
            return await self.fetch_all("""
                SELECT ti.*, t.text_content, tr.name as translator_name
                FROM translation_issues ti
                JOIN translations t ON ti.translation_id = t.id
                LEFT JOIN translators tr ON t.translator_id = tr.id
                WHERE ti.issue_type = $1 AND ti.severity >= $2
                ORDER BY ti.severity DESC
                LIMIT $3
            """, issue_type, min_severity, limit)
        else:
            return await self.fetch_all("""
                SELECT ti.*, t.text_content, tr.name as translator_name
                FROM translation_issues ti
                JOIN translations t ON ti.translation_id = t.id
                LEFT JOIN translators tr ON t.translator_id = tr.id
                WHERE ti.severity >= $1
                ORDER BY ti.severity DESC
                LIMIT $2
            """, min_severity, limit)
