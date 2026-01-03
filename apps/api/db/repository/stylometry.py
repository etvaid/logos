#!/usr/bin/env python3
"""
Stylometry Repository - Database operations for style analysis.
"""

from typing import Any, Dict, List, Optional, Tuple
import asyncpg
import numpy as np
from .base import BaseRepository


class StylometryRepository(BaseRepository):
    """Repository for stylometry-related database operations."""

    # ═══════════════════════════════════════════════════════════════════════════════
    # TRANSLATOR OPERATIONS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def get_translator(self, translator_id: int) -> Optional[asyncpg.Record]:
        """Get translator by ID."""
        return await self.fetch_one("""
            SELECT t.*, tp.style_vector, tp.avg_ltqi, tp.n_translations
            FROM translators t
            LEFT JOIN translator_profiles tp ON tp.translator_id = t.id
            WHERE t.id = $1
        """, translator_id)

    async def get_all_translators(self) -> List[asyncpg.Record]:
        """Get all translators with their profiles."""
        return await self.fetch_all("""
            SELECT t.*, tp.style_vector, tp.avg_ltqi, tp.n_translations
            FROM translators t
            LEFT JOIN translator_profiles tp ON tp.translator_id = t.id
            ORDER BY tp.n_translations DESC NULLS LAST
        """)

    async def get_translator_centroid(
        self,
        translator_id: int
    ) -> Optional[asyncpg.Record]:
        """Get translator's style centroid."""
        return await self.fetch_one("""
            SELECT *
            FROM translator_centroids
            WHERE translator_id = $1
        """, translator_id)

    async def get_all_translator_centroids(self) -> List[asyncpg.Record]:
        """Get all translator centroids for comparison."""
        return await self.fetch_all("""
            SELECT tc.*, t.name as translator_name
            FROM translator_centroids tc
            JOIN translators t ON t.id = tc.translator_id
            ORDER BY tc.n_translations DESC
        """)

    async def update_translator_centroid(
        self,
        translator_id: int,
        translator_name: str,
        centroid_embedding: List[float],
        n_translations: int,
        avg_residual_magnitude: float,
        style_consistency: float
    ) -> str:
        """Update or insert translator centroid."""
        return await self.execute("""
            INSERT INTO translator_centroids
            (translator_id, translator_name, centroid_embedding,
             n_translations, avg_residual_magnitude, style_consistency, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            ON CONFLICT (translator_id)
            DO UPDATE SET
                centroid_embedding = $3,
                n_translations = $4,
                avg_residual_magnitude = $5,
                style_consistency = $6,
                updated_at = NOW()
        """,
            translator_id,
            translator_name,
            centroid_embedding,
            n_translations,
            avg_residual_magnitude,
            style_consistency
        )

    # ═══════════════════════════════════════════════════════════════════════════════
    # STYLE RESIDUAL OPERATIONS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def get_style_residuals_by_translator(
        self,
        translator_id: int,
        limit: int = 1000
    ) -> List[asyncpg.Record]:
        """Get style residuals for a translator."""
        return await self.fetch_all("""
            SELECT sr.*, t.text_content as translation_text
            FROM style_residuals sr
            JOIN translations t ON sr.translation_id = t.id
            WHERE sr.translator_id = $1
            LIMIT $2
        """, translator_id, limit)

    async def get_residual_statistics(self) -> Dict[str, Any]:
        """Get overall residual statistics."""
        row = await self.fetch_one("""
            SELECT
                COUNT(*) as total_residuals,
                AVG(residual_magnitude) as avg_magnitude,
                STDDEV(residual_magnitude) as stddev_magnitude,
                AVG(semantic_purity) as avg_purity
            FROM style_residuals
        """)
        return dict(row) if row else {}

    async def get_residual_stats_by_translator(self) -> List[asyncpg.Record]:
        """Get residual statistics per translator."""
        return await self.fetch_all("""
            SELECT
                sr.translator_id,
                t.name as translator_name,
                COUNT(*) as residual_count,
                AVG(sr.residual_magnitude) as avg_magnitude,
                STDDEV(sr.residual_magnitude) as stddev_magnitude,
                AVG(sr.semantic_purity) as avg_purity
            FROM style_residuals sr
            JOIN translators t ON sr.translator_id = t.id
            GROUP BY sr.translator_id, t.name
            ORDER BY residual_count DESC
        """)

    async def insert_style_residual(
        self,
        translation_id: int,
        meaning_anchor_id: int,
        translator_id: int,
        residual_vector: List[float],
        residual_magnitude: float,
        semantic_purity: float
    ) -> str:
        """Insert a style residual."""
        return await self.execute("""
            INSERT INTO style_residuals
            (translation_id, meaning_anchor_id, translator_id,
             residual_vector, residual_magnitude, semantic_purity, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            ON CONFLICT (translation_id) DO UPDATE SET
                residual_vector = $4,
                residual_magnitude = $5,
                semantic_purity = $6
        """,
            translation_id,
            meaning_anchor_id,
            translator_id,
            residual_vector,
            residual_magnitude,
            semantic_purity
        )

    # ═══════════════════════════════════════════════════════════════════════════════
    # MEANING ANCHOR OPERATIONS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def get_meaning_anchor(
        self,
        source_text_id: int
    ) -> Optional[asyncpg.Record]:
        """Get meaning anchor for a source text."""
        return await self.fetch_one("""
            SELECT * FROM meaning_anchors
            WHERE source_text_id = $1
        """, source_text_id)

    async def get_meaning_anchors_needing_update(
        self,
        min_translations: int = 2,
        limit: int = 1000
    ) -> List[asyncpg.Record]:
        """Get source texts that need meaning anchor computation."""
        return await self.fetch_all("""
            SELECT s.id as source_text_id,
                   s.reference,
                   COUNT(t.id) as translation_count
            FROM source_texts s
            JOIN translations t ON t.source_text_id = s.id
            LEFT JOIN meaning_anchors ma ON ma.source_text_id = s.id
            WHERE t.embedding IS NOT NULL
            GROUP BY s.id, s.reference
            HAVING COUNT(t.id) >= $1
               AND (ma.id IS NULL OR ma.n_translations < COUNT(t.id))
            ORDER BY translation_count DESC
            LIMIT $2
        """, min_translations, limit)

    async def update_meaning_anchor(
        self,
        source_text_id: int,
        source_author: str,
        source_work: str,
        source_urn: str,
        anchor_embedding: List[float],
        n_translations: int,
        computation_method: str,
        embedding_variance: float,
        stability_score: float
    ) -> str:
        """Update or insert meaning anchor."""
        return await self.execute("""
            INSERT INTO meaning_anchors
            (source_text_id, source_author, source_work, source_urn,
             anchor_embedding, n_translations, computation_method,
             embedding_variance, stability_score, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
            ON CONFLICT (source_text_id) DO UPDATE SET
                anchor_embedding = $5,
                n_translations = $6,
                computation_method = $7,
                embedding_variance = $8,
                stability_score = $9,
                updated_at = NOW()
        """,
            source_text_id,
            source_author,
            source_work,
            source_urn,
            anchor_embedding,
            n_translations,
            computation_method,
            embedding_variance,
            stability_score
        )

    # ═══════════════════════════════════════════════════════════════════════════════
    # AUTHORSHIP FINGERPRINT OPERATIONS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def get_authorship_fingerprint(
        self,
        author_id: int
    ) -> Optional[asyncpg.Record]:
        """Get authorship fingerprint for an author."""
        return await self.fetch_one("""
            SELECT af.*, a.name as author_name
            FROM authorship_fingerprints af
            JOIN authors a ON a.id = af.author_id
            WHERE af.author_id = $1
        """, author_id)

    async def get_all_authorship_fingerprints(self) -> List[asyncpg.Record]:
        """Get all authorship fingerprints."""
        return await self.fetch_all("""
            SELECT af.*, a.name as author_name
            FROM authorship_fingerprints af
            JOIN authors a ON a.id = af.author_id
            ORDER BY af.n_passages DESC
        """)

    async def update_authorship_fingerprint(
        self,
        author_id: int,
        author_name: str,
        fingerprint_embedding: List[float],
        function_word_freqs: Dict[str, float],
        n_passages: int,
        total_words: int,
        internal_consistency: float,
        cross_work_stability: float
    ) -> str:
        """Update or insert authorship fingerprint."""
        import json
        return await self.execute("""
            INSERT INTO authorship_fingerprints
            (author_id, author_name, fingerprint_embedding, function_word_freqs,
             n_passages, total_words, internal_consistency, cross_work_stability, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            ON CONFLICT (author_id) DO UPDATE SET
                fingerprint_embedding = $3,
                function_word_freqs = $4,
                n_passages = $5,
                total_words = $6,
                internal_consistency = $7,
                cross_work_stability = $8,
                updated_at = NOW()
        """,
            author_id,
            author_name,
            fingerprint_embedding,
            json.dumps(function_word_freqs),
            n_passages,
            total_words,
            internal_consistency,
            cross_work_stability
        )

    # ═══════════════════════════════════════════════════════════════════════════════
    # PASSAGE STYLE OPERATIONS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def get_passages_without_style_vectors(
        self,
        limit: int = 1000
    ) -> List[asyncpg.Record]:
        """Get passages that need style vector computation."""
        return await self.fetch_all("""
            SELECT id, text_content, language, word_count
            FROM passages
            WHERE style_vector IS NULL
              AND text_content IS NOT NULL
              AND LENGTH(text_content) > 100
            LIMIT $1
        """, limit)

    async def update_passage_style_vector(
        self,
        passage_id: int,
        style_vector: List[float]
    ) -> str:
        """Update passage style vector."""
        return await self.execute("""
            UPDATE passages
            SET style_vector = $2, updated_at = NOW()
            WHERE id = $1
        """, passage_id, style_vector)

    async def bulk_update_style_vectors(
        self,
        updates: List[Tuple[int, List[float]]]
    ) -> None:
        """Bulk update passage style vectors."""
        await self.execute_many("""
            UPDATE passages
            SET style_vector = $2, updated_at = NOW()
            WHERE id = $1
        """, updates)

    async def find_similar_style(
        self,
        style_vector: List[float],
        limit: int = 10,
        exclude_id: int = None
    ) -> List[asyncpg.Record]:
        """Find passages with similar style."""
        if exclude_id:
            return await self.fetch_all("""
                SELECT id, text_content, reference,
                       1 - (style_vector <=> $1) as similarity
                FROM passages
                WHERE style_vector IS NOT NULL
                  AND id != $2
                ORDER BY style_vector <=> $1
                LIMIT $3
            """, style_vector, exclude_id, limit)
        else:
            return await self.fetch_all("""
                SELECT id, text_content, reference,
                       1 - (style_vector <=> $1) as similarity
                FROM passages
                WHERE style_vector IS NOT NULL
                ORDER BY style_vector <=> $1
                LIMIT $2
            """, style_vector, limit)
