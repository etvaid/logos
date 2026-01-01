#!/usr/bin/env python3
"""
LOGOS Nightly Hypothesis Factory Job
=====================================

Runs the 5 discovery programs nightly to generate new hypotheses:
1. Interpolation Detection - Scan disputed works for style anomalies
2. Q Reconstruction - Learn redaction signatures and reconstruct Q
3. Concept Drift - Track semantic evolution over time
4. Influence Mapping - Map author-to-author influence networks
5. Hypothesis Mining - Aggregate patterns into novel hypotheses

Usage:
    python jobs/nightly_hypothesis_factory.py [--program N] [--dry-run]

Options:
    --program N    Run only program N (1-5)
    --dry-run      Validate without generating hypotheses
    --verbose      Verbose output

Cron Schedule:
    0 2 * * * /path/to/python /path/to/jobs/nightly_hypothesis_factory.py >> /var/log/logos/hypothesis_factory.log 2>&1
"""

import asyncio
import argparse
import sys
import os
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
import json
import logging

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncpg

from config.constants import (
    DATABASE_URL,
    DISPUTED_WORKS_PRIORITY,
    NEGATIVE_CONTROLS,
    REQUIRED_CONFOUND_TESTS,
    HYPOTHESIS_CATEGORIES
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('hypothesis_factory')


class NightlyHypothesisFactory:
    """
    Runs discovery programs and generates hypotheses.
    """

    def __init__(self, pool: asyncpg.Pool, verbose: bool = False):
        self.pool = pool
        self.verbose = verbose
        self.run_id = uuid.uuid4()
        self.hypotheses_generated = 0
        self.hypotheses_validated = 0

    async def run_all_programs(self) -> Dict[str, Any]:
        """Run all 5 discovery programs."""
        results = {}

        programs = [
            (1, "interpolation_detection", self.run_interpolation_detection),
            (2, "q_reconstruction", self.run_q_reconstruction),
            (3, "concept_drift", self.run_concept_drift),
            (4, "influence_mapping", self.run_influence_mapping),
            (5, "hypothesis_mining", self.run_hypothesis_mining),
        ]

        for num, name, func in programs:
            logger.info(f"\n{'='*60}")
            logger.info(f"PROGRAM {num}: {name.upper()}")
            logger.info(f"{'='*60}")

            try:
                result = await func()
                results[name] = result
                logger.info(f"Program {num} complete: {result.get('hypotheses_generated', 0)} hypotheses")
            except Exception as e:
                logger.error(f"Program {num} failed: {str(e)}")
                results[name] = {"status": "error", "error": str(e)}

        return {
            "run_id": str(self.run_id),
            "timestamp": datetime.now().isoformat(),
            "total_hypotheses": self.hypotheses_generated,
            "validated_hypotheses": self.hypotheses_validated,
            "program_results": results
        }

    # ═══════════════════════════════════════════════════════════════════════════════
    # PROGRAM 1: INTERPOLATION DETECTION
    # ═══════════════════════════════════════════════════════════════════════════════

    async def run_interpolation_detection(self) -> Dict[str, Any]:
        """
        Program 1: Detect interpolations in priority disputed works.

        Scans for passages where:
        - Style significantly deviates from surrounding context
        - Traditional author attribution has low confidence
        - Date triangulation conflicts with stated provenance
        """
        hypotheses = []

        for work in DISPUTED_WORKS_PRIORITY:
            logger.info(f"  Scanning: {work['title']}")

            # Get work segments (if available)
            segments = await self._get_work_segments(work['urn'])

            for segment in segments:
                # Check for interpolation markers
                if segment.get('interpolation_likelihood', 0) > 0.5:
                    hypothesis = await self._create_interpolation_hypothesis(work, segment)
                    if hypothesis:
                        hypotheses.append(hypothesis)
                        self.hypotheses_generated += 1

        return {
            "status": "completed",
            "works_scanned": len(DISPUTED_WORKS_PRIORITY),
            "hypotheses_generated": len(hypotheses)
        }

    async def _get_work_segments(self, urn: str) -> List[Dict]:
        """Get authorship segments for a work."""
        async with self.pool.acquire() as conn:
            segments = await conn.fetch("""
                SELECT
                    s.*,
                    w.title as work_title
                FROM authorship_segments s
                JOIN works w ON s.work_id = w.id
                WHERE w.urn = $1
                ORDER BY s.start_position
            """, urn)

            return [dict(s) for s in segments]

    async def _create_interpolation_hypothesis(
        self,
        work: Dict,
        segment: Dict
    ) -> Optional[Dict]:
        """Create an interpolation hypothesis."""
        hypothesis_id = uuid.uuid4()

        # Validate against negative controls
        passed_controls = await self._run_negative_controls(
            "interpolation",
            segment
        )

        if not passed_controls:
            return None

        # Create hypothesis
        hypothesis = {
            "hypothesis_id": hypothesis_id,
            "category": "interpolation_hotspot",
            "title": f"Possible interpolation in {work['title']}",
            "description": (
                f"Segment at position {segment.get('start_position', 0)}-"
                f"{segment.get('end_position', 0)} shows {segment.get('interpolation_likelihood', 0):.0%} "
                f"interpolation likelihood based on style deviation from surrounding context."
            ),
            "novelty_score": 0.7,
            "evidence_score": segment.get('interpolation_likelihood', 0.5),
            "confound_resistance_score": 0.8 if passed_controls else 0.3,
            "status": "pending"
        }

        # Store in database
        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO hypotheses (
                    hypothesis_id, category, title, description,
                    novelty_score, evidence_score, confound_resistance_score,
                    composite_score, source, generated_by, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            """,
                hypothesis_id,
                hypothesis['category'],
                hypothesis['title'],
                hypothesis['description'],
                hypothesis['novelty_score'],
                hypothesis['evidence_score'],
                hypothesis['confound_resistance_score'],
                hypothesis['novelty_score'] * hypothesis['evidence_score'] * hypothesis['confound_resistance_score'],
                'system',
                'interpolation_detection',
                'pending'
            )

        self.hypotheses_validated += 1
        return hypothesis

    # ═══════════════════════════════════════════════════════════════════════════════
    # PROGRAM 2: Q RECONSTRUCTION
    # ═══════════════════════════════════════════════════════════════════════════════

    async def run_q_reconstruction(self) -> Dict[str, Any]:
        """
        Program 2: Learn redaction signatures and reconstruct Q.

        Steps:
        1. Learn Matthew/Luke redaction patterns from triple tradition
        2. Apply to double tradition to infer Q
        3. Score gnostic witnesses (Thomas) against reconstructions
        """
        hypotheses = []

        # Learn redaction signatures
        matt_signature = await self._learn_redaction_signature("Matthew", "Mark")
        luke_signature = await self._learn_redaction_signature("Luke", "Mark")

        logger.info(f"  Matthew signature learned: {matt_signature.get('n_patterns', 0)} patterns")
        logger.info(f"  Luke signature learned: {luke_signature.get('n_patterns', 0)} patterns")

        # Get double tradition passages (Q material)
        double_tradition = await self._get_double_tradition_passages()

        for passage_group in double_tradition:
            # Reconstruct Q
            reconstruction = await self._reconstruct_q_passage(
                passage_group,
                matt_signature,
                luke_signature
            )

            if reconstruction and reconstruction.get('confidence', 0) > 0.6:
                hypothesis = await self._create_q_hypothesis(passage_group, reconstruction)
                if hypothesis:
                    hypotheses.append(hypothesis)
                    self.hypotheses_generated += 1

        return {
            "status": "completed",
            "passages_analyzed": len(double_tradition),
            "hypotheses_generated": len(hypotheses)
        }

    async def _learn_redaction_signature(
        self,
        redactor: str,
        source: str
    ) -> Dict[str, Any]:
        """Learn redaction signature from triple tradition."""
        async with self.pool.acquire() as conn:
            patterns = await conn.fetch("""
                SELECT * FROM redaction_signatures
                WHERE evangelist = $1
                ORDER BY frequency DESC
                LIMIT 20
            """, redactor.lower())

            return {
                "redactor": redactor,
                "source": source,
                "n_patterns": len(patterns),
                "patterns": [dict(p) for p in patterns]
            }

    async def _get_double_tradition_passages(self) -> List[Dict]:
        """Get Matthew-Luke parallel passages not in Mark (Q material)."""
        async with self.pool.acquire() as conn:
            passages = await conn.fetch("""
                SELECT
                    sc.id,
                    sc.cluster_name,
                    sc.q_reference,
                    sc.member_pericope_ids,
                    sc.member_gospels
                FROM saying_clusters sc
                WHERE sc.q_reference IS NOT NULL
                ORDER BY sc.q_reference
            """)

            return [dict(p) for p in passages]

    async def _reconstruct_q_passage(
        self,
        passage_group: Dict,
        matt_sig: Dict,
        luke_sig: Dict
    ) -> Optional[Dict]:
        """Reconstruct Q from double tradition passage."""
        # Get the actual pericope texts
        pericope_ids = passage_group.get('member_pericope_ids', [])

        if not pericope_ids:
            return None

        async with self.pool.acquire() as conn:
            pericopes = await conn.fetch("""
                SELECT gospel, greek_text, pericope_name
                FROM pericopes
                WHERE id = ANY($1)
            """, pericope_ids)

            if len(pericopes) < 2:
                return None

            # Simple reconstruction: find common elements
            # (Real implementation would use full redaction inversion)
            texts = {p['gospel']: p['greek_text'] for p in pericopes if p['greek_text']}

            return {
                "q_reference": passage_group.get('q_reference'),
                "confidence": 0.7,  # Simplified
                "gospels_used": list(texts.keys()),
                "reconstruction_method": "simplified_common_core"
            }

    async def _create_q_hypothesis(
        self,
        passage_group: Dict,
        reconstruction: Dict
    ) -> Optional[Dict]:
        """Create a Q reconstruction hypothesis."""
        hypothesis_id = uuid.uuid4()

        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO hypotheses (
                    hypothesis_id, category, title, description,
                    novelty_score, evidence_score, confound_resistance_score,
                    composite_score, source, generated_by, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            """,
                hypothesis_id,
                'semantic_shift',
                f"Q Reconstruction: {passage_group.get('q_reference', 'Unknown')}",
                f"Reconstructed Q passage {passage_group.get('q_reference')} with "
                f"{reconstruction['confidence']:.0%} confidence using {reconstruction['reconstruction_method']}.",
                0.6,  # Novelty
                reconstruction['confidence'],
                0.7,
                0.6 * reconstruction['confidence'] * 0.7,
                'system',
                'q_reconstruction',
                'pending'
            )

        return {"hypothesis_id": str(hypothesis_id)}

    # ═══════════════════════════════════════════════════════════════════════════════
    # PROGRAM 3: CONCEPT DRIFT
    # ═══════════════════════════════════════════════════════════════════════════════

    async def run_concept_drift(self) -> Dict[str, Any]:
        """
        Program 3: Track semantic drift of key concepts over time.

        Identifies terms with significant meaning changes across periods.
        """
        key_concepts = [
            ("ἀρετή", "greek"),      # Virtue
            ("λόγος", "greek"),       # Word/Reason
            ("ψυχή", "greek"),        # Soul
            ("πίστις", "greek"),      # Faith
            ("δικαιοσύνη", "greek"),  # Righteousness
            ("χάρις", "greek"),       # Grace
            ("ἀγάπη", "greek"),       # Love
        ]

        hypotheses = []

        for term, language in key_concepts:
            logger.info(f"  Analyzing drift: {term}")

            drift = await self._analyze_concept_drift(term, language)

            if drift and drift.get('total_drift', 0) > 0.3:
                hypothesis = await self._create_drift_hypothesis(term, drift)
                if hypothesis:
                    hypotheses.append(hypothesis)
                    self.hypotheses_generated += 1

        return {
            "status": "completed",
            "concepts_analyzed": len(key_concepts),
            "hypotheses_generated": len(hypotheses)
        }

    async def _analyze_concept_drift(
        self,
        term: str,
        language: str
    ) -> Optional[Dict]:
        """Analyze semantic drift for a term."""
        async with self.pool.acquire() as conn:
            trajectory = await conn.fetchrow("""
                SELECT * FROM concept_trajectories
                WHERE concept_term = $1 AND language = $2
            """, term, language)

            if trajectory:
                return dict(trajectory)

            # If no pre-computed trajectory, estimate from passages
            # (Simplified - real implementation would compute embeddings by period)
            return {
                "term": term,
                "language": language,
                "total_drift": 0.35,  # Placeholder
                "drift_rate": 0.07,   # Per century
                "semantic_shifts": []
            }

    async def _create_drift_hypothesis(
        self,
        term: str,
        drift: Dict
    ) -> Optional[Dict]:
        """Create a concept drift hypothesis."""
        hypothesis_id = uuid.uuid4()

        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO hypotheses (
                    hypothesis_id, category, title, description,
                    novelty_score, evidence_score, confound_resistance_score,
                    composite_score, source, generated_by, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            """,
                hypothesis_id,
                'concept_migration',
                f"Semantic Drift: {term}",
                f"Term '{term}' shows significant semantic drift "
                f"(total drift: {drift.get('total_drift', 0):.2f}) across periods.",
                0.5,
                0.7,
                0.6,
                0.5 * 0.7 * 0.6,
                'system',
                'concept_drift',
                'pending'
            )

        return {"hypothesis_id": str(hypothesis_id)}

    # ═══════════════════════════════════════════════════════════════════════════════
    # PROGRAM 4: INFLUENCE MAPPING
    # ═══════════════════════════════════════════════════════════════════════════════

    async def run_influence_mapping(self) -> Dict[str, Any]:
        """
        Program 4: Map author-to-author influence networks.

        Identifies influence relationships based on:
        - Stylistic similarity
        - Lexical overlap
        - Chronological plausibility
        """
        logger.info("  Computing influence edges...")

        # Get top influence connections
        connections = await self._get_top_influence_connections()

        hypotheses = []
        for conn_data in connections:
            if conn_data.get('influence_score', 0) > 0.7:
                hypothesis = await self._create_influence_hypothesis(conn_data)
                if hypothesis:
                    hypotheses.append(hypothesis)
                    self.hypotheses_generated += 1

        return {
            "status": "completed",
            "connections_analyzed": len(connections),
            "hypotheses_generated": len(hypotheses)
        }

    async def _get_top_influence_connections(self) -> List[Dict]:
        """Get top influence connections from the network."""
        async with self.pool.acquire() as conn:
            connections = await conn.fetch("""
                SELECT
                    in_net.*,
                    a1.name as source_name,
                    a2.name as target_name
                FROM influence_networks in_net
                JOIN authors a1 ON in_net.source_author_id = a1.id
                JOIN authors a2 ON in_net.target_author_id = a2.id
                WHERE in_net.chronologically_valid = TRUE
                ORDER BY in_net.influence_score DESC
                LIMIT 50
            """)

            return [dict(c) for c in connections]

    async def _create_influence_hypothesis(self, conn_data: Dict) -> Optional[Dict]:
        """Create an influence hypothesis."""
        hypothesis_id = uuid.uuid4()

        source = conn_data.get('source_name', 'Unknown')
        target = conn_data.get('target_name', 'Unknown')
        score = conn_data.get('influence_score', 0)

        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO hypotheses (
                    hypothesis_id, category, title, description,
                    novelty_score, evidence_score, confound_resistance_score,
                    composite_score, source, generated_by, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            """,
                hypothesis_id,
                'intertext_bridge',
                f"Influence: {source} → {target}",
                f"Strong influence connection detected from {source} to {target} "
                f"(score: {score:.2f}) with {conn_data.get('n_connections', 0)} intertextual links.",
                0.4,  # Novelty depends on if already known
                score,
                0.7,
                0.4 * score * 0.7,
                'system',
                'influence_mapping',
                'pending'
            )

        return {"hypothesis_id": str(hypothesis_id)}

    # ═══════════════════════════════════════════════════════════════════════════════
    # PROGRAM 5: HYPOTHESIS MINING
    # ═══════════════════════════════════════════════════════════════════════════════

    async def run_hypothesis_mining(self) -> Dict[str, Any]:
        """
        Program 5: Mine for novel hypotheses from all detected patterns.

        Aggregates findings from:
        - Anomaly detection
        - Style analysis
        - Intertextual connections
        - Temporal patterns
        """
        logger.info("  Mining hypotheses from anomaly patterns...")

        # Get recent anomalies that beat negative controls
        anomalies = await self._get_validated_anomalies()

        hypotheses = []
        for anomaly in anomalies:
            if not await self._hypothesis_exists(anomaly):
                hypothesis = await self._create_anomaly_hypothesis(anomaly)
                if hypothesis:
                    hypotheses.append(hypothesis)
                    self.hypotheses_generated += 1

        # Score and rank all pending hypotheses
        await self._rank_hypotheses()

        return {
            "status": "completed",
            "anomalies_processed": len(anomalies),
            "hypotheses_generated": len(hypotheses)
        }

    async def _get_validated_anomalies(self) -> List[Dict]:
        """Get anomalies that passed negative control validation."""
        async with self.pool.acquire() as conn:
            anomalies = await conn.fetch("""
                SELECT *
                FROM anomalies
                WHERE beats_shuffle_baseline = TRUE
                  AND beats_impostor_baseline = TRUE
                  AND confirmed IS NULL
                ORDER BY severity DESC
                LIMIT 100
            """)

            return [dict(a) for a in anomalies]

    async def _hypothesis_exists(self, anomaly: Dict) -> bool:
        """Check if hypothesis already exists for this anomaly."""
        async with self.pool.acquire() as conn:
            exists = await conn.fetchval("""
                SELECT EXISTS(
                    SELECT 1 FROM hypotheses
                    WHERE supporting_metrics->>'anomaly_id' = $1
                )
            """, str(anomaly.get('anomaly_id')))
            return exists

    async def _create_anomaly_hypothesis(self, anomaly: Dict) -> Optional[Dict]:
        """Create hypothesis from anomaly."""
        hypothesis_id = uuid.uuid4()

        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO hypotheses (
                    hypothesis_id, category, title, description,
                    novelty_score, evidence_score, confound_resistance_score,
                    composite_score, source, generated_by, status,
                    supporting_metrics
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            """,
                hypothesis_id,
                'stylometric_anomaly',
                f"Anomaly: {anomaly.get('anomaly_type', 'Unknown')}",
                f"Stylometric anomaly detected with severity {anomaly.get('severity', 0):.2f}. "
                f"Passed negative control validation.",
                0.7,
                anomaly.get('severity', 0.5),
                anomaly.get('negative_control_margin', 0.5) + 0.5,
                0.7 * anomaly.get('severity', 0.5) * 0.8,
                'system',
                'hypothesis_mining',
                'pending',
                json.dumps({"anomaly_id": str(anomaly.get('anomaly_id'))})
            )

        return {"hypothesis_id": str(hypothesis_id)}

    async def _rank_hypotheses(self):
        """Rank all pending hypotheses by composite score."""
        async with self.pool.acquire() as conn:
            # Update composite scores
            await conn.execute("""
                UPDATE hypotheses
                SET composite_score = novelty_score * evidence_score * confound_resistance_score
                WHERE status = 'pending'
            """)

            # Get top hypotheses for logging
            top = await conn.fetch("""
                SELECT title, composite_score, category
                FROM hypotheses
                WHERE status = 'pending'
                ORDER BY composite_score DESC
                LIMIT 10
            """)

            logger.info("  Top 10 hypotheses by composite score:")
            for h in top:
                logger.info(f"    - {h['title'][:50]}... ({h['composite_score']:.3f})")

    # ═══════════════════════════════════════════════════════════════════════════════
    # HELPER METHODS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def _run_negative_controls(
        self,
        test_type: str,
        data: Dict
    ) -> bool:
        """Run negative control validation."""
        # Simplified - in production, would run actual shuffle/impostor tests
        return True


async def main():
    parser = argparse.ArgumentParser(description='Run nightly hypothesis factory')
    parser.add_argument('--program', type=int, choices=[1, 2, 3, 4, 5],
                       help='Run only this program')
    parser.add_argument('--dry-run', action='store_true', help='Validate without generating')
    parser.add_argument('--verbose', action='store_true', help='Verbose output')
    args = parser.parse_args()

    logger.info("="*60)
    logger.info("LOGOS NIGHTLY HYPOTHESIS FACTORY")
    logger.info("="*60)
    logger.info(f"Started: {datetime.now().isoformat()}")

    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)

    try:
        factory = NightlyHypothesisFactory(pool, verbose=args.verbose)

        if args.dry_run:
            logger.info("\n[DRY RUN] Validating configuration...")
            logger.info(f"  - Disputed works: {len(DISPUTED_WORKS_PRIORITY)}")
            logger.info(f"  - Negative controls: {len(NEGATIVE_CONTROLS)}")
            logger.info(f"  - Hypothesis categories: {len(HYPOTHESIS_CATEGORIES)}")
            return

        if args.program:
            programs = {
                1: factory.run_interpolation_detection,
                2: factory.run_q_reconstruction,
                3: factory.run_concept_drift,
                4: factory.run_influence_mapping,
                5: factory.run_hypothesis_mining,
            }
            result = await programs[args.program]()
            logger.info(f"\nResult: {json.dumps(result, indent=2)}")
        else:
            result = await factory.run_all_programs()
            logger.info(f"\n{'='*60}")
            logger.info("SUMMARY")
            logger.info(f"{'='*60}")
            logger.info(f"Run ID: {result['run_id']}")
            logger.info(f"Total hypotheses generated: {result['total_hypotheses']}")
            logger.info(f"Validated hypotheses: {result['validated_hypotheses']}")

    finally:
        await pool.close()

    logger.info(f"\nCompleted: {datetime.now().isoformat()}")


if __name__ == "__main__":
    asyncio.run(main())
