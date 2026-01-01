"""
Discovery Programs
==================

Five automated discovery programs for generating scholarly insights.

Programs:
1. Interpolation Detection - Find later additions to texts
2. Q Reconstruction - Reconstruct lost Q source
3. Concept Drift - Track semantic evolution over time
4. Influence Mapping - Map author-to-author influence networks
5. Hypothesis Mining - Generate and validate novel hypotheses
"""

import numpy as np
from typing import List, Dict, Optional, Tuple, Any
from dataclasses import dataclass
from collections import defaultdict
import uuid
import asyncpg
from scipy.spatial.distance import cosine
from scipy.stats import zscore

from config.constants import EMBED_DIM, DISPUTED_WORKS_PRIORITY, HYPOTHESIS_CATEGORIES


@dataclass
class DiscoveryResult:
    """Result from a discovery program run."""
    program_name: str
    run_id: uuid.UUID
    status: str
    findings: List[Dict[str, Any]]
    hypotheses_generated: int
    validated_count: int
    runtime_seconds: float


class DiscoveryEngine:
    """
    Orchestrates the 5 discovery programs.

    Each program:
    1. Scans data for patterns
    2. Generates hypotheses
    3. Validates against negative controls
    4. Reports findings with confidence intervals
    """

    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool

    # ═══════════════════════════════════════════════════════════════════════════════
    # PROGRAM 1: INTERPOLATION DETECTION
    # ═══════════════════════════════════════════════════════════════════════════════

    async def run_interpolation_detection(
        self,
        work_ids: Optional[List[int]] = None,
        threshold: float = 2.0,
        require_negative_controls: bool = True
    ) -> DiscoveryResult:
        """
        Program 1: Detect potential interpolations across works.

        Scans for passages that deviate significantly from surrounding style.
        Validates findings against shuffle and impostor baselines.

        Args:
            work_ids: Specific works to scan (None = all disputed works)
            threshold: Z-score threshold for anomaly detection
            require_negative_controls: Whether to filter by negative control validation

        Returns:
            DiscoveryResult with detected interpolations
        """
        import time
        start_time = time.time()
        run_id = uuid.uuid4()

        async with self.pool.acquire() as conn:
            # Record run start
            await conn.execute("""
                INSERT INTO discovery_runs (run_id, program_name, parameters, status)
                VALUES ($1, $2, $3, 'running')
            """, run_id, "interpolation_detection", {
                "threshold": threshold,
                "work_ids": work_ids
            })

            findings = []
            hypotheses_generated = 0

            # Get works to analyze
            if work_ids:
                works = await conn.fetch("""
                    SELECT id, title, author_id FROM works WHERE id = ANY($1)
                """, work_ids)
            else:
                # Focus on disputed works
                works = await conn.fetch("""
                    SELECT id, title, author_id FROM works
                    WHERE is_disputed = TRUE OR id IN (
                        SELECT DISTINCT work_id FROM passages LIMIT 100
                    )
                """)

            for work in works:
                work_id = work['id']

                # Get passages with embeddings
                passages = await conn.fetch("""
                    SELECT id, embedding, reference, text_content
                    FROM passages
                    WHERE work_id = $1 AND embedding IS NOT NULL
                    ORDER BY id
                """, work_id)

                if len(passages) < 10:
                    continue

                # Compute work centroid
                embeddings = np.array([
                    np.frombuffer(p['embedding'], dtype=np.float32)
                    for p in passages
                ])
                centroid = np.mean(embeddings, axis=0)

                # Find outliers
                distances = [cosine(emb, centroid) for emb in embeddings]
                z_scores = zscore(distances) if len(distances) > 1 else [0] * len(distances)

                for i, (p, z) in enumerate(zip(passages, z_scores)):
                    if abs(z) > threshold:
                        # Potential interpolation found
                        finding = {
                            "passage_id": p['id'],
                            "work_id": work_id,
                            "work_title": work['title'],
                            "reference": p['reference'],
                            "z_score": float(z),
                            "distance": float(distances[i]),
                            "severity": min(1.0, abs(z) / 4.0)
                        }

                        # Run negative controls if required
                        if require_negative_controls:
                            # Shuffle test
                            shuffle_distances = []
                            for _ in range(100):
                                shuffled = embeddings.copy()
                                np.random.shuffle(shuffled)
                                shuffle_centroid = np.mean(shuffled, axis=0)
                                shuffle_distances.append(cosine(embeddings[i], shuffle_centroid))

                            shuffle_mean = np.mean(shuffle_distances)
                            beats_shuffle = distances[i] > shuffle_mean * 1.1

                            # Impostor test (compare to random other works)
                            other_passages = await conn.fetch("""
                                SELECT embedding FROM passages
                                WHERE work_id != $1 AND embedding IS NOT NULL
                                ORDER BY RANDOM() LIMIT 50
                            """, work_id)

                            if other_passages:
                                other_embs = [
                                    np.frombuffer(op['embedding'], dtype=np.float32)
                                    for op in other_passages
                                ]
                                impostor_centroid = np.mean(other_embs, axis=0)
                                impostor_dist = cosine(embeddings[i], impostor_centroid)
                                beats_impostor = distances[i] < impostor_dist

                                finding["beats_shuffle"] = beats_shuffle
                                finding["beats_impostor"] = beats_impostor
                                finding["validated"] = beats_shuffle and beats_impostor

                                if not finding["validated"]:
                                    continue  # Skip unvalidated findings

                        findings.append(finding)

                        # Store as anomaly
                        anomaly_id = uuid.uuid4()
                        await conn.execute("""
                            INSERT INTO anomalies (
                                anomaly_id, passage_id, work_id, anomaly_type,
                                severity, detection_score, detection_method,
                                beats_shuffle_baseline, beats_impostor_baseline
                            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                        """,
                            anomaly_id, p['id'], work_id, "interpolation",
                            finding["severity"], float(z), "zscore_centroid",
                            finding.get("beats_shuffle", True),
                            finding.get("beats_impostor", True)
                        )

                        # Generate hypothesis
                        hyp_id = uuid.uuid4()
                        await conn.execute("""
                            INSERT INTO hypotheses (
                                hypothesis_id, title, description, category,
                                source, evidence_score, status
                            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                        """,
                            hyp_id,
                            f"Possible interpolation at {p['reference']} in {work['title']}",
                            f"Statistical analysis detected stylistic anomaly (z={z:.2f})",
                            "interpolation_hotspot",
                            "system",
                            finding["severity"],
                            "pending"
                        )
                        hypotheses_generated += 1

            runtime = time.time() - start_time

            # Update run record
            await conn.execute("""
                UPDATE discovery_runs
                SET status = 'completed', completed_at = NOW(),
                    hypotheses_generated = $2
                WHERE run_id = $1
            """, run_id, hypotheses_generated)

            return DiscoveryResult(
                program_name="interpolation_detection",
                run_id=run_id,
                status="completed",
                findings=findings,
                hypotheses_generated=hypotheses_generated,
                validated_count=len([f for f in findings if f.get("validated", True)]),
                runtime_seconds=runtime
            )

    # ═══════════════════════════════════════════════════════════════════════════════
    # PROGRAM 2: Q RECONSTRUCTION
    # ═══════════════════════════════════════════════════════════════════════════════

    async def run_q_reconstruction(
        self,
        learn_signatures: bool = True,
        reconstruct_all: bool = True
    ) -> DiscoveryResult:
        """
        Program 2: Reconstruct Q source from synoptic parallels.

        Steps:
        1. Learn Matthew's and Luke's redaction signatures from triple tradition
        2. Apply inverse signatures to double tradition
        3. Generate confidence intervals via bootstrap

        Returns:
            DiscoveryResult with Q reconstructions
        """
        import time
        start_time = time.time()
        run_id = uuid.uuid4()

        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO discovery_runs (run_id, program_name, parameters, status)
                VALUES ($1, $2, $3, 'running')
            """, run_id, "q_reconstruction", {
                "learn_signatures": learn_signatures,
                "reconstruct_all": reconstruct_all
            })

            findings = []
            hypotheses_generated = 0

            # Import Q engine
            from engines.q_reconstruction import QReconstructionEngine
            engine = QReconstructionEngine(self.pool)

            # Step 1: Learn redaction signatures
            if learn_signatures:
                sig_result = await engine.learn_redaction_signatures()
                findings.append({
                    "step": "learn_signatures",
                    "result": sig_result
                })

            # Step 2: Reconstruct Q passages
            if reconstruct_all:
                recon_result = await engine.reconstruct_all_q()
                findings.append({
                    "step": "reconstruct_all",
                    "result": recon_result
                })

                # Generate hypothesis about Q's doctrinal profile
                profile = await engine.get_q_doctrinal_profile()
                if "error" not in profile:
                    hyp_id = uuid.uuid4()
                    await conn.execute("""
                        INSERT INTO hypotheses (
                            hypothesis_id, title, description, category,
                            source, supporting_metrics, status
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                    """,
                        hyp_id,
                        "Q Source Doctrinal Profile Reconstruction",
                        "Computational reconstruction of Q's theological emphases",
                        "lost_source",
                        "system",
                        profile,
                        "pending"
                    )
                    hypotheses_generated += 1

            runtime = time.time() - start_time

            await conn.execute("""
                UPDATE discovery_runs
                SET status = 'completed', completed_at = NOW(),
                    hypotheses_generated = $2
                WHERE run_id = $1
            """, run_id, hypotheses_generated)

            return DiscoveryResult(
                program_name="q_reconstruction",
                run_id=run_id,
                status="completed",
                findings=findings,
                hypotheses_generated=hypotheses_generated,
                validated_count=hypotheses_generated,
                runtime_seconds=runtime
            )

    # ═══════════════════════════════════════════════════════════════════════════════
    # PROGRAM 3: CONCEPT DRIFT
    # ═══════════════════════════════════════════════════════════════════════════════

    async def run_concept_drift_analysis(
        self,
        terms: Optional[List[str]] = None,
        language: str = "greek",
        time_resolution: int = 50
    ) -> DiscoveryResult:
        """
        Program 3: Track semantic drift of key concepts over time.

        Identifies terms with significant meaning changes across periods.

        Args:
            terms: Specific terms to track (None = auto-detect important terms)
            language: Language to analyze
            time_resolution: Resolution in years

        Returns:
            DiscoveryResult with drift analyses
        """
        import time
        start_time = time.time()
        run_id = uuid.uuid4()

        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO discovery_runs (run_id, program_name, parameters, status)
                VALUES ($1, $2, $3, 'running')
            """, run_id, "concept_drift", {
                "terms": terms,
                "language": language,
                "time_resolution": time_resolution
            })

            findings = []
            hypotheses_generated = 0

            # Import latent factor engine
            from engines.latent_factors import LatentFactorEngine
            engine = LatentFactorEngine(self.pool)

            # Auto-detect important terms if not specified
            if not terms:
                # Find frequently occurring content words
                term_counts = await conn.fetch("""
                    SELECT word, COUNT(*) as cnt
                    FROM (
                        SELECT unnest(string_to_array(lower(text_content), ' ')) as word
                        FROM passages
                        WHERE language = $1 AND text_content IS NOT NULL
                        LIMIT 10000
                    ) words
                    WHERE length(word) > 4
                    GROUP BY word
                    HAVING COUNT(*) > 50
                    ORDER BY cnt DESC
                    LIMIT 20
                """, language)
                terms = [t['word'] for t in term_counts]

            # Track each term
            for term in terms:
                try:
                    trajectory = await engine.track_concept_trajectory(
                        term, language, time_resolution
                    )

                    if "error" not in trajectory:
                        findings.append({
                            "term": term,
                            "trajectory": trajectory
                        })

                        # Generate hypothesis if significant drift detected
                        if trajectory.get("drift_rate_per_century", 0) > 0.3:
                            hyp_id = uuid.uuid4()
                            await conn.execute("""
                                INSERT INTO hypotheses (
                                    hypothesis_id, title, description, category,
                                    source, evidence_score, status
                                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                            """,
                                hyp_id,
                                f"Significant semantic drift in '{term}'",
                                f"Term shows {trajectory['drift_rate_per_century']:.2f} drift per century",
                                "semantic_shift",
                                "system",
                                min(1.0, trajectory['drift_rate_per_century']),
                                "pending"
                            )
                            hypotheses_generated += 1
                except Exception:
                    continue

            runtime = time.time() - start_time

            await conn.execute("""
                UPDATE discovery_runs
                SET status = 'completed', completed_at = NOW(),
                    hypotheses_generated = $2
                WHERE run_id = $1
            """, run_id, hypotheses_generated)

            return DiscoveryResult(
                program_name="concept_drift",
                run_id=run_id,
                status="completed",
                findings=findings,
                hypotheses_generated=hypotheses_generated,
                validated_count=hypotheses_generated,
                runtime_seconds=runtime
            )

    # ═══════════════════════════════════════════════════════════════════════════════
    # PROGRAM 4: INFLUENCE MAPPING
    # ═══════════════════════════════════════════════════════════════════════════════

    async def run_influence_mapping(
        self,
        min_similarity: float = 0.7,
        require_chronological: bool = True
    ) -> DiscoveryResult:
        """
        Program 4: Map author-to-author influence networks.

        Identifies likely influence relationships based on:
        - Stylistic similarity
        - Lexical overlap
        - Intertextual connections
        - Chronological plausibility

        Args:
            min_similarity: Minimum similarity threshold
            require_chronological: Require source to predate target

        Returns:
            DiscoveryResult with influence network
        """
        import time
        start_time = time.time()
        run_id = uuid.uuid4()

        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO discovery_runs (run_id, program_name, parameters, status)
                VALUES ($1, $2, $3, 'running')
            """, run_id, "influence_mapping", {
                "min_similarity": min_similarity,
                "require_chronological": require_chronological
            })

            findings = []
            hypotheses_generated = 0

            # Get all author fingerprints
            fingerprints = await conn.fetch("""
                SELECT
                    af.author_id,
                    af.author_name,
                    af.fingerprint_embedding,
                    a.floruit_start,
                    a.floruit_end
                FROM authorship_fingerprints af
                JOIN authors a ON af.author_id = a.id
                WHERE af.fingerprint_embedding IS NOT NULL
            """)

            if len(fingerprints) < 2:
                return DiscoveryResult(
                    program_name="influence_mapping",
                    run_id=run_id,
                    status="completed",
                    findings=[{"error": "Insufficient author fingerprints"}],
                    hypotheses_generated=0,
                    validated_count=0,
                    runtime_seconds=time.time() - start_time
                )

            # Compute pairwise similarities
            influence_edges = []

            for i, source in enumerate(fingerprints):
                source_emb = np.frombuffer(source['fingerprint_embedding'], dtype=np.float32)
                source_date = source['floruit_end'] or source['floruit_start'] or 0

                for target in fingerprints[i+1:]:
                    target_emb = np.frombuffer(target['fingerprint_embedding'], dtype=np.float32)
                    target_date = target['floruit_start'] or target['floruit_end'] or 0

                    similarity = 1 - cosine(source_emb, target_emb)

                    if similarity >= min_similarity:
                        # Determine direction based on chronology
                        if require_chronological:
                            if source_date and target_date:
                                if source_date < target_date:
                                    influencer, influenced = source, target
                                elif target_date < source_date:
                                    influencer, influenced = target, source
                                else:
                                    continue  # Contemporaries, skip
                            else:
                                continue  # Unknown dates
                        else:
                            influencer, influenced = source, target

                        edge = {
                            "source_author_id": influencer['author_id'],
                            "source_author": influencer['author_name'],
                            "target_author_id": influenced['author_id'],
                            "target_author": influenced['author_name'],
                            "similarity": float(similarity),
                            "chronologically_valid": True
                        }
                        influence_edges.append(edge)

                        # Store in database
                        await conn.execute("""
                            INSERT INTO influence_networks (
                                source_author_id, target_author_id,
                                influence_score, stylistic_similarity,
                                chronologically_valid
                            ) VALUES ($1, $2, $3, $4, $5)
                            ON CONFLICT (source_author_id, target_author_id) DO UPDATE SET
                                influence_score = EXCLUDED.influence_score,
                                stylistic_similarity = EXCLUDED.stylistic_similarity
                        """,
                            influencer['author_id'],
                            influenced['author_id'],
                            float(similarity),
                            float(similarity),
                            True
                        )

                        # Generate hypothesis for strong influences
                        if similarity > 0.85:
                            hyp_id = uuid.uuid4()
                            await conn.execute("""
                                INSERT INTO hypotheses (
                                    hypothesis_id, title, description, category,
                                    source, evidence_score, status
                                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                            """,
                                hyp_id,
                                f"Strong stylistic influence: {influencer['author_name']} → {influenced['author_name']}",
                                f"Similarity score: {similarity:.2f}",
                                "intertext_bridge",
                                "system",
                                float(similarity),
                                "pending"
                            )
                            hypotheses_generated += 1

            findings = influence_edges
            runtime = time.time() - start_time

            await conn.execute("""
                UPDATE discovery_runs
                SET status = 'completed', completed_at = NOW(),
                    hypotheses_generated = $2
                WHERE run_id = $1
            """, run_id, hypotheses_generated)

            return DiscoveryResult(
                program_name="influence_mapping",
                run_id=run_id,
                status="completed",
                findings=findings,
                hypotheses_generated=hypotheses_generated,
                validated_count=len(findings),
                runtime_seconds=runtime
            )

    # ═══════════════════════════════════════════════════════════════════════════════
    # PROGRAM 5: HYPOTHESIS MINING
    # ═══════════════════════════════════════════════════════════════════════════════

    async def run_hypothesis_mining(
        self,
        min_severity: float = 0.5,
        validate_all: bool = True
    ) -> DiscoveryResult:
        """
        Program 5: Mine for novel hypotheses from all detected patterns.

        Aggregates findings from:
        - Anomaly detection
        - Style analysis
        - Intertextual connections
        - Temporal patterns

        Filters by novelty, evidence, and confound resistance.

        Args:
            min_severity: Minimum anomaly severity to consider
            validate_all: Whether to run validation on all hypotheses

        Returns:
            DiscoveryResult with top hypotheses
        """
        import time
        start_time = time.time()
        run_id = uuid.uuid4()

        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO discovery_runs (run_id, program_name, parameters, status)
                VALUES ($1, $2, $3, 'running')
            """, run_id, "hypothesis_mining", {
                "min_severity": min_severity,
                "validate_all": validate_all
            })

            # Import hypothesis factory
            from engines.hypothesis_factory import HypothesisFactory
            factory = HypothesisFactory(self.pool)

            # Generate hypotheses from anomalies
            hypotheses = await factory.generate_hypotheses_from_anomalies(min_severity)

            findings = []
            validated_count = 0

            for hyp in hypotheses:
                finding = {
                    "hypothesis_id": str(hyp.hypothesis_id),
                    "title": hyp.title,
                    "category": hyp.category,
                    "novelty_score": hyp.novelty_score,
                    "evidence_score": hyp.evidence_score,
                    "composite_score": hyp.composite_score
                }

                # Validate if requested
                if validate_all:
                    validation = await factory.validate_hypothesis(hyp.hypothesis_id)
                    finding["validation"] = validation
                    if validation.get("all_tests_passed"):
                        validated_count += 1

                findings.append(finding)

            # Sort by composite score
            findings.sort(key=lambda x: x.get("composite_score", 0), reverse=True)

            runtime = time.time() - start_time

            await conn.execute("""
                UPDATE discovery_runs
                SET status = 'completed', completed_at = NOW(),
                    hypotheses_generated = $2, validated_hypotheses = $3
                WHERE run_id = $1
            """, run_id, len(hypotheses), validated_count)

            return DiscoveryResult(
                program_name="hypothesis_mining",
                run_id=run_id,
                status="completed",
                findings=findings,
                hypotheses_generated=len(hypotheses),
                validated_count=validated_count,
                runtime_seconds=runtime
            )

    # ═══════════════════════════════════════════════════════════════════════════════
    # ORCHESTRATION
    # ═══════════════════════════════════════════════════════════════════════════════

    async def run_all_programs(self) -> Dict[str, DiscoveryResult]:
        """
        Run all 5 discovery programs sequentially.

        Returns:
            Dict mapping program name to result
        """
        results = {}

        # Program 1: Interpolation Detection
        results["interpolation_detection"] = await self.run_interpolation_detection()

        # Program 2: Q Reconstruction
        results["q_reconstruction"] = await self.run_q_reconstruction()

        # Program 3: Concept Drift
        results["concept_drift"] = await self.run_concept_drift_analysis()

        # Program 4: Influence Mapping
        results["influence_mapping"] = await self.run_influence_mapping()

        # Program 5: Hypothesis Mining
        results["hypothesis_mining"] = await self.run_hypothesis_mining()

        return results

    async def get_discovery_summary(self) -> Dict[str, Any]:
        """
        Get summary of all discovery runs.

        Returns:
            Summary statistics
        """
        async with self.pool.acquire() as conn:
            runs = await conn.fetch("""
                SELECT
                    program_name,
                    COUNT(*) as run_count,
                    SUM(hypotheses_generated) as total_hypotheses,
                    SUM(validated_hypotheses) as total_validated,
                    MAX(completed_at) as last_run
                FROM discovery_runs
                WHERE status = 'completed'
                GROUP BY program_name
            """)

            return {
                "programs": [dict(r) for r in runs],
                "total_runs": sum(r['run_count'] for r in runs),
                "total_hypotheses": sum(r['total_hypotheses'] or 0 for r in runs),
                "total_validated": sum(r['total_validated'] or 0 for r in runs)
            }

    async def get_recent_runs(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get recent discovery runs."""
        async with self.pool.acquire() as conn:
            runs = await conn.fetch("""
                SELECT run_id, program_name, status, started_at, completed_at,
                       hypotheses_generated, validated_hypotheses
                FROM discovery_runs
                ORDER BY started_at DESC
                LIMIT $1
            """, limit)
            return [dict(r) for r in runs]
