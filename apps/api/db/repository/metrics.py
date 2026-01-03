#!/usr/bin/env python3
"""
Metrics Repository - Database operations for advanced metrics storage.
"""

from typing import Any, Dict, List, Optional
import asyncpg
from .base import BaseRepository


class MetricsRepository(BaseRepository):
    """Repository for metrics-related database operations."""

    # ═══════════════════════════════════════════════════════════════════════════════
    # GENERIC METRICS CACHE
    # ═══════════════════════════════════════════════════════════════════════════════

    async def get_cached_metric(
        self,
        metric_name: str,
        entity_type: str,
        entity_id: int
    ) -> Optional[asyncpg.Record]:
        """Get a cached metric value."""
        return await self.fetch_one("""
            SELECT * FROM metrics_cache
            WHERE metric_name = $1
              AND entity_type = $2
              AND entity_id = $3
              AND is_valid = TRUE
              AND (expires_at IS NULL OR expires_at > NOW())
        """, metric_name, entity_type, entity_id)

    async def set_cached_metric(
        self,
        metric_name: str,
        entity_type: str,
        entity_id: int,
        metric_value: float = None,
        metric_json: Dict = None,
        expires_hours: int = 24
    ) -> str:
        """Cache a metric value."""
        import json
        return await self.execute("""
            INSERT INTO metrics_cache
            (metric_name, entity_type, entity_id, metric_value, metric_json,
             computed_at, expires_at, is_valid)
            VALUES ($1, $2, $3, $4, $5, NOW(),
                    CASE WHEN $6 > 0 THEN NOW() + INTERVAL '1 hour' * $6 ELSE NULL END,
                    TRUE)
            ON CONFLICT (metric_name, entity_type, entity_id) DO UPDATE SET
                metric_value = $4,
                metric_json = $5,
                computed_at = NOW(),
                expires_at = CASE WHEN $6 > 0 THEN NOW() + INTERVAL '1 hour' * $6 ELSE NULL END,
                is_valid = TRUE
        """,
            metric_name,
            entity_type,
            entity_id,
            metric_value,
            json.dumps(metric_json) if metric_json else None,
            expires_hours
        )

    async def invalidate_cached_metrics(
        self,
        metric_name: str = None,
        entity_type: str = None,
        entity_id: int = None
    ) -> int:
        """Invalidate cached metrics."""
        conditions = []
        params = []

        if metric_name:
            params.append(metric_name)
            conditions.append(f"metric_name = ${len(params)}")
        if entity_type:
            params.append(entity_type)
            conditions.append(f"entity_type = ${len(params)}")
        if entity_id:
            params.append(entity_id)
            conditions.append(f"entity_id = ${len(params)}")

        where_clause = " AND ".join(conditions) if conditions else "TRUE"

        result = await self.execute(f"""
            UPDATE metrics_cache
            SET is_valid = FALSE
            WHERE {where_clause}
        """, *params)

        return int(result.split()[-1]) if result else 0

    # ═══════════════════════════════════════════════════════════════════════════════
    # INTERTEXTUAL LINKS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def get_intertextual_links(
        self,
        source_id: int = None,
        target_id: int = None,
        min_score: float = 0.5,
        limit: int = 100
    ) -> List[asyncpg.Record]:
        """Get intertextual links."""
        if source_id:
            return await self.fetch_all("""
                SELECT il.*,
                       ps.text_content as source_text,
                       pt.text_content as target_text
                FROM intertextual_links il
                LEFT JOIN passages ps ON il.source_passage_id = ps.id
                LEFT JOIN passages pt ON il.target_passage_id = pt.id
                WHERE il.source_passage_id = $1
                  AND il.composite_score >= $2
                ORDER BY il.composite_score DESC
                LIMIT $3
            """, source_id, min_score, limit)
        elif target_id:
            return await self.fetch_all("""
                SELECT il.*,
                       ps.text_content as source_text,
                       pt.text_content as target_text
                FROM intertextual_links il
                LEFT JOIN passages ps ON il.source_passage_id = ps.id
                LEFT JOIN passages pt ON il.target_passage_id = pt.id
                WHERE il.target_passage_id = $1
                  AND il.composite_score >= $2
                ORDER BY il.composite_score DESC
                LIMIT $3
            """, target_id, min_score, limit)
        else:
            return await self.fetch_all("""
                SELECT il.*,
                       ps.text_content as source_text,
                       pt.text_content as target_text
                FROM intertextual_links il
                LEFT JOIN passages ps ON il.source_passage_id = ps.id
                LEFT JOIN passages pt ON il.target_passage_id = pt.id
                WHERE il.composite_score >= $1
                ORDER BY il.composite_score DESC
                LIMIT $2
            """, min_score, limit)

    async def get_intertextual_network_stats(self) -> Dict[str, Any]:
        """Get statistics about the intertextual network."""
        row = await self.fetch_one("""
            SELECT
                COUNT(*) as total_links,
                AVG(composite_score) as avg_score,
                COUNT(DISTINCT source_passage_id) as unique_sources,
                COUNT(DISTINCT target_passage_id) as unique_targets,
                COUNT(CASE WHEN link_type = 'quotation' THEN 1 END) as quotations,
                COUNT(CASE WHEN link_type = 'allusion' THEN 1 END) as allusions,
                COUNT(CASE WHEN link_type = 'echo' THEN 1 END) as echoes
            FROM intertextual_links
        """)
        return dict(row) if row else {}

    async def get_influence_network(
        self,
        min_connections: int = 3
    ) -> List[asyncpg.Record]:
        """Get author-to-author influence network."""
        return await self.fetch_all("""
            SELECT
                inf.*,
                a1.name as source_author_name,
                a2.name as target_author_name
            FROM influence_networks inf
            JOIN authors a1 ON inf.source_author_id = a1.id
            JOIN authors a2 ON inf.target_author_id = a2.id
            WHERE inf.n_connections >= $1
            ORDER BY inf.influence_score DESC
        """, min_connections)

    # ═══════════════════════════════════════════════════════════════════════════════
    # CONCEPT TRAJECTORIES
    # ═══════════════════════════════════════════════════════════════════════════════

    async def get_concept_trajectory(
        self,
        term: str,
        language: str = 'greek'
    ) -> Optional[asyncpg.Record]:
        """Get semantic trajectory for a concept."""
        return await self.fetch_one("""
            SELECT * FROM concept_trajectories
            WHERE concept_term = $1 AND language = $2
        """, term, language)

    async def get_all_concept_trajectories(
        self,
        min_drift: float = 0.1
    ) -> List[asyncpg.Record]:
        """Get all concept trajectories with significant drift."""
        return await self.fetch_all("""
            SELECT * FROM concept_trajectories
            WHERE total_drift >= $1
            ORDER BY total_drift DESC
        """, min_drift)

    async def update_concept_trajectory(
        self,
        term: str,
        language: str,
        time_points: List[int],
        embeddings_json: str,
        total_drift: float,
        drift_rate: float,
        semantic_shifts_json: str,
        neighbors_json: str
    ) -> str:
        """Update or insert concept trajectory."""
        return await self.execute("""
            INSERT INTO concept_trajectories
            (concept_term, language, time_points, embeddings_over_time,
             total_drift, drift_rate, semantic_shifts, nearest_neighbors_over_time,
             updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            ON CONFLICT (concept_term)
            WHERE language = $2
            DO UPDATE SET
                time_points = $3,
                embeddings_over_time = $4,
                total_drift = $5,
                drift_rate = $6,
                semantic_shifts = $7,
                nearest_neighbors_over_time = $8,
                updated_at = NOW()
        """,
            term,
            language,
            time_points,
            embeddings_json,
            total_drift,
            drift_rate,
            semantic_shifts_json,
            neighbors_json
        )

    # ═══════════════════════════════════════════════════════════════════════════════
    # REGIME SHIFTS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def get_regime_shifts(
        self,
        axis_id: int = None,
        min_magnitude: float = 0.1
    ) -> List[asyncpg.Record]:
        """Get detected regime shifts."""
        if axis_id:
            return await self.fetch_all("""
                SELECT rs.*, la.axis_name
                FROM regime_shifts rs
                JOIN latent_axes la ON rs.axis_id = la.id
                WHERE rs.axis_id = $1 AND rs.magnitude >= $2
                ORDER BY rs.changepoint_date
            """, axis_id, min_magnitude)
        else:
            return await self.fetch_all("""
                SELECT rs.*, la.axis_name
                FROM regime_shifts rs
                JOIN latent_axes la ON rs.axis_id = la.id
                WHERE rs.magnitude >= $1
                ORDER BY rs.changepoint_date
            """, min_magnitude)

    async def insert_regime_shift(
        self,
        axis_id: int,
        changepoint_date: int,
        changepoint_type: str,
        detection_method: str,
        detection_score: float,
        pre_mean: float,
        post_mean: float,
        magnitude: float,
        date_ci_lower: int,
        date_ci_upper: int,
        known_event: str = None
    ) -> str:
        """Insert a detected regime shift."""
        return await self.execute("""
            INSERT INTO regime_shifts
            (axis_id, changepoint_date, changepoint_type, detection_method,
             detection_score, pre_mean, post_mean, magnitude,
             date_ci_lower, date_ci_upper, known_event, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
        """,
            axis_id,
            changepoint_date,
            changepoint_type,
            detection_method,
            detection_score,
            pre_mean,
            post_mean,
            magnitude,
            date_ci_lower,
            date_ci_upper,
            known_event
        )

    # ═══════════════════════════════════════════════════════════════════════════════
    # LATENT FACTORS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def get_latent_axes(self) -> List[asyncpg.Record]:
        """Get all latent axes."""
        return await self.fetch_all("""
            SELECT * FROM latent_axes
            ORDER BY discriminative_power DESC NULLS LAST
        """)

    async def get_latent_factor_scores(
        self,
        passage_id: int = None,
        work_id: int = None,
        author_id: int = None,
        limit: int = 1000
    ) -> List[asyncpg.Record]:
        """Get latent factor scores."""
        if passage_id:
            return await self.fetch_all("""
                SELECT * FROM latent_factor_scores
                WHERE passage_id = $1
            """, passage_id)
        elif work_id:
            return await self.fetch_all("""
                SELECT * FROM latent_factor_scores
                WHERE work_id = $1
                LIMIT $2
            """, work_id, limit)
        elif author_id:
            return await self.fetch_all("""
                SELECT * FROM latent_factor_scores
                WHERE author_id = $1
                LIMIT $2
            """, author_id, limit)
        else:
            return await self.fetch_all("""
                SELECT * FROM latent_factor_scores
                ORDER BY estimated_date
                LIMIT $1
            """, limit)

    # ═══════════════════════════════════════════════════════════════════════════════
    # HYPOTHESIS TRACKING
    # ═══════════════════════════════════════════════════════════════════════════════

    async def get_hypotheses(
        self,
        category: str = None,
        status: str = None,
        min_score: float = 0.5,
        limit: int = 100
    ) -> List[asyncpg.Record]:
        """Get hypotheses."""
        conditions = ["composite_score >= $1"]
        params = [min_score]

        if category:
            params.append(category)
            conditions.append(f"category = ${len(params)}")
        if status:
            params.append(status)
            conditions.append(f"status = ${len(params)}")

        params.append(limit)
        where_clause = " AND ".join(conditions)

        return await self.fetch_all(f"""
            SELECT * FROM hypotheses
            WHERE {where_clause}
            ORDER BY composite_score DESC
            LIMIT ${len(params)}
        """, *params)

    async def get_hypothesis_tests(
        self,
        hypothesis_id: str
    ) -> List[asyncpg.Record]:
        """Get all tests for a hypothesis."""
        return await self.fetch_all("""
            SELECT * FROM hypothesis_tests
            WHERE hypothesis_id = $1
            ORDER BY created_at
        """, hypothesis_id)

    async def get_anomalies(
        self,
        work_id: int = None,
        anomaly_type: str = None,
        min_severity: float = 0.5,
        limit: int = 100
    ) -> List[asyncpg.Record]:
        """Get detected anomalies."""
        conditions = ["severity >= $1"]
        params = [min_severity]

        if work_id:
            params.append(work_id)
            conditions.append(f"work_id = ${len(params)}")
        if anomaly_type:
            params.append(anomaly_type)
            conditions.append(f"anomaly_type = ${len(params)}")

        params.append(limit)
        where_clause = " AND ".join(conditions)

        return await self.fetch_all(f"""
            SELECT * FROM anomalies
            WHERE {where_clause}
            ORDER BY severity DESC
            LIMIT ${len(params)}
        """, *params)
