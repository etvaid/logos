"""
Forensic Analysis Router
========================

Endpoints for textual forensics, anomaly detection, and authenticity analysis.
"""

from fastapi import APIRouter, Request, Query, HTTPException
from typing import Dict, Any, Optional, List
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/forensic", tags=["forensic"])


# Request/Response Models
class ForensicAnalysisRequest(BaseModel):
    work_id: Optional[int] = None
    text: Optional[str] = None
    language: str = "greek"
    analysis_types: List[str] = ["anomaly", "interpolation", "style_consistency"]


class AnomalyReport(BaseModel):
    severity: float  # 0-1
    anomaly_type: str
    location: str
    description: str
    confidence: float


# ===============================================================================
# ANOMALY DETECTION ENDPOINTS
# ===============================================================================

@router.post("/analyze")
async def run_forensic_analysis(request: Request, data: ForensicAnalysisRequest):
    """
    Run comprehensive forensic analysis on a text or work.

    Analysis types:
    - anomaly: Detect stylistic anomalies
    - interpolation: Detect potential interpolations
    - style_consistency: Check internal style consistency
    - temporal_anachronism: Detect vocabulary/concept anachronisms
    - manuscript_variants: Analyze manuscript tradition
    """
    try:
        pool = request.app.state.db_pool
        results = {}

        if "anomaly" in data.analysis_types:
            from engines import DiscoveryEngine
            engine = DiscoveryEngine(pool)
            if data.work_id:
                results["anomaly"] = await engine.detect_anomalies(data.work_id)
            else:
                results["anomaly"] = {"error": "work_id required for anomaly detection"}

        if "interpolation" in data.analysis_types:
            from engines import AuthorshipSegmenter
            engine = AuthorshipSegmenter(pool)
            if data.work_id:
                results["interpolation"] = await engine.detect_interpolations(data.work_id)
            else:
                results["interpolation"] = {"error": "work_id required"}

        if "style_consistency" in data.analysis_types:
            from engines import StyleResidualEngine
            engine = StyleResidualEngine(pool)
            if data.work_id:
                results["style_consistency"] = await engine.check_consistency(data.work_id)
            else:
                results["style_consistency"] = {"error": "work_id required"}

        return {
            "analysis_id": str(uuid.uuid4()),
            "work_id": data.work_id,
            "results": results,
            "overall_authenticity": compute_authenticity_score(results)
        }
    except Exception as e:
        return {"error": str(e)}


def compute_authenticity_score(results: Dict) -> float:
    """Compute overall authenticity score from multiple analyses."""
    scores = []
    if "anomaly" in results and isinstance(results["anomaly"], dict):
        n_anomalies = results["anomaly"].get("count", 0)
        scores.append(max(0, 1 - n_anomalies * 0.1))

    if "style_consistency" in results and isinstance(results["style_consistency"], dict):
        consistency = results["style_consistency"].get("consistency_score", 0.5)
        scores.append(consistency)

    return sum(scores) / len(scores) if scores else 0.5


@router.get("/anomalies/{work_id}")
async def get_anomalies(
    request: Request,
    work_id: int,
    min_severity: float = Query(default=0.5, ge=0, le=1)
):
    """Get all detected anomalies for a work."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, passage_id, anomaly_type, severity,
                   z_score, context_deviation, description,
                   negative_control_comparison, validated
            FROM anomalies
            WHERE work_id = $1 AND severity >= $2
            ORDER BY severity DESC
        """, work_id, min_severity)

        return {
            "work_id": work_id,
            "count": len(rows),
            "anomalies": [dict(r) for r in rows]
        }


@router.post("/anomalies/{work_id}/detect")
async def detect_new_anomalies(
    request: Request,
    work_id: int,
    threshold: float = Query(default=2.0, description="Z-score threshold")
):
    """
    Run anomaly detection on a work.

    Uses sliding window analysis to detect passages that deviate
    from the work's baseline style.
    """
    try:
        from engines import DiscoveryEngine
        pool = request.app.state.db_pool
        engine = DiscoveryEngine(pool)

        result = await engine.run_interpolation_detection(
            work_ids=[work_id],
            threshold=threshold,
            require_negative_controls=True
        )

        return {
            "work_id": work_id,
            "run_id": str(result.run_id) if hasattr(result, 'run_id') else None,
            "anomalies_found": len(result.findings) if hasattr(result, 'findings') else 0,
            "findings": result.findings[:20] if hasattr(result, 'findings') else []
        }
    except Exception as e:
        return {"error": str(e)}


# ===============================================================================
# FINGERPRINT MATCHING ENDPOINTS
# ===============================================================================

@router.post("/fingerprint/{passage_id}")
async def compute_passage_fingerprint(request: Request, passage_id: int):
    """
    Compute a stylometric fingerprint for a passage.

    Returns a vector of stylometric features that can be compared.
    """
    try:
        pool = request.app.state.db_pool

        async with pool.acquire() as conn:
            # Get passage
            passage = await conn.fetchrow("""
                SELECT id, text_content, embedding, author
                FROM source_texts
                WHERE id = $1
            """, passage_id)

            if not passage:
                raise HTTPException(status_code=404, detail="Passage not found")

            from config.constants import GREEK_FUNCTION_WORDS
            import numpy as np

            text = passage['text_content'] or ""
            words = text.split()
            total_words = len(words)

            # Function word frequencies
            fw_freqs = {}
            for w in GREEK_FUNCTION_WORDS[:30]:
                count = sum(1 for word in words if word.lower() == w.lower())
                fw_freqs[w] = count / total_words if total_words > 0 else 0

            # Sentence statistics
            sentences = text.split('.')
            sentence_lengths = [len(s.split()) for s in sentences if s.strip()]
            avg_sentence_length = np.mean(sentence_lengths) if sentence_lengths else 0
            sentence_length_std = np.std(sentence_lengths) if len(sentence_lengths) > 1 else 0

            # Hapax legomena
            word_counts = {}
            for w in words:
                word_counts[w.lower()] = word_counts.get(w.lower(), 0) + 1
            hapax_ratio = sum(1 for c in word_counts.values() if c == 1) / len(word_counts) if word_counts else 0

            fingerprint = {
                "passage_id": passage_id,
                "author": passage['author'],
                "word_count": total_words,
                "function_word_freqs": fw_freqs,
                "avg_sentence_length": float(avg_sentence_length),
                "sentence_length_std": float(sentence_length_std),
                "hapax_ratio": hapax_ratio,
                "vocabulary_richness": len(word_counts) / total_words if total_words > 0 else 0
            }

            return fingerprint
    except Exception as e:
        return {"error": str(e)}


@router.post("/fingerprint/match")
async def match_fingerprint(
    request: Request,
    passage_id: int,
    candidate_authors: Optional[List[str]] = None,
    top_k: int = Query(default=5, le=20)
):
    """
    Match a passage fingerprint against author profiles.

    Returns most similar authors based on stylometric features.
    """
    try:
        pool = request.app.state.db_pool

        # Get passage fingerprint
        passage_fp = await compute_passage_fingerprint.__wrapped__(request, passage_id)
        if "error" in passage_fp:
            return passage_fp

        async with pool.acquire() as conn:
            # Get author fingerprints
            if candidate_authors:
                profiles = await conn.fetch("""
                    SELECT author_id, author_name, function_word_freqs,
                           avg_sentence_length, hapax_ratio, internal_consistency
                    FROM authorship_fingerprints
                    WHERE author_name = ANY($1)
                """, candidate_authors)
            else:
                profiles = await conn.fetch("""
                    SELECT author_id, author_name, function_word_freqs,
                           avg_sentence_length, hapax_ratio, internal_consistency
                    FROM authorship_fingerprints
                    ORDER BY n_passages DESC
                    LIMIT 50
                """)

            import numpy as np

            matches = []
            for p in profiles:
                # Compare function word frequencies
                profile_fw = p['function_word_freqs'] or {}
                passage_fw = passage_fp['function_word_freqs']

                common_words = set(profile_fw.keys()) & set(passage_fw.keys())
                if common_words:
                    profile_vals = np.array([profile_fw.get(w, 0) for w in common_words])
                    passage_vals = np.array([passage_fw.get(w, 0) for w in common_words])

                    if profile_vals.std() > 0 and passage_vals.std() > 0:
                        corr = float(np.corrcoef(profile_vals, passage_vals)[0, 1])
                    else:
                        corr = 0
                else:
                    corr = 0

                # Compare sentence length
                if p['avg_sentence_length']:
                    sl_diff = abs(p['avg_sentence_length'] - passage_fp['avg_sentence_length'])
                    sl_sim = 1 / (1 + sl_diff)
                else:
                    sl_sim = 0

                # Combined score
                score = 0.7 * max(0, corr) + 0.3 * sl_sim

                matches.append({
                    "author_name": p['author_name'],
                    "author_id": p['author_id'],
                    "function_word_correlation": corr,
                    "sentence_length_similarity": sl_sim,
                    "overall_score": score,
                    "confidence": min(0.95, score * p.get('internal_consistency', 0.8))
                })

            matches.sort(key=lambda x: x['overall_score'], reverse=True)

            return {
                "passage_id": passage_id,
                "matches": matches[:top_k],
                "best_match": matches[0] if matches else None
            }
    except Exception as e:
        return {"error": str(e)}


# ===============================================================================
# TEMPORAL ANALYSIS ENDPOINTS
# ===============================================================================

@router.post("/anachronism/{work_id}")
async def detect_anachronisms(
    request: Request,
    work_id: int,
    claimed_date: Optional[int] = None
):
    """
    Detect potential anachronisms in a work.

    Checks for vocabulary, concepts, or references that postdate
    the claimed composition date.
    """
    try:
        pool = request.app.state.db_pool

        async with pool.acquire() as conn:
            # Get work
            work = await conn.fetchrow("""
                SELECT id, title, author, date_earliest, date_latest
                FROM works
                WHERE id = $1
            """, work_id)

            if not work:
                raise HTTPException(status_code=404, detail="Work not found")

            date = claimed_date or work.get('date_earliest') or -400

            # Get passages
            passages = await conn.fetch("""
                SELECT id, text_content, reference
                FROM source_texts
                WHERE work_id = $1
            """, work_id)

            # Check for anachronistic terms (simplified)
            anachronistic_terms = {
                "χριστιανός": -50,  # Christian (term from ~50 CE)
                "εὐαγγέλιον": -30,  # Gospel (NT technical sense)
                "μοναχός": 300,  # Monk
                "κανών": 200,  # Canon (ecclesiastical)
            }

            findings = []
            for p in passages:
                text = p['text_content'] or ""
                for term, earliest_date in anachronistic_terms.items():
                    if term in text and date < earliest_date:
                        findings.append({
                            "passage_id": p['id'],
                            "reference": p['reference'],
                            "term": term,
                            "term_earliest_date": earliest_date,
                            "claimed_date": date,
                            "anachronism_years": earliest_date - date
                        })

            return {
                "work_id": work_id,
                "claimed_date": date,
                "n_anachronisms": len(findings),
                "findings": findings,
                "verdict": "suspicious" if findings else "consistent"
            }
    except Exception as e:
        return {"error": str(e)}


# ===============================================================================
# MANUSCRIPT TRADITION ENDPOINTS
# ===============================================================================

@router.get("/manuscripts/{work_id}")
async def get_manuscript_tradition(request: Request, work_id: int):
    """
    Get manuscript tradition information for a work.

    Shows textual variants and their attestation.
    """
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        # Get manuscripts
        manuscripts = await conn.fetch("""
            SELECT id, siglum, name, date_earliest, date_latest,
                   provenance, text_type, quality_rating
            FROM manuscripts
            WHERE work_id = $1
            ORDER BY date_earliest
        """, work_id)

        # Get variant readings
        variants = await conn.fetch("""
            SELECT tv.id, tv.location, tv.reading_a, tv.reading_b,
                   tv.manuscripts_a, tv.manuscripts_b, tv.significance
            FROM textual_variants tv
            WHERE tv.work_id = $1
            ORDER BY tv.significance DESC
            LIMIT 50
        """, work_id)

        return {
            "work_id": work_id,
            "manuscripts": [dict(m) for m in manuscripts],
            "variants": [dict(v) for v in variants],
            "n_manuscripts": len(manuscripts),
            "n_variants": len(variants)
        }


# ===============================================================================
# COMPREHENSIVE REPORT ENDPOINTS
# ===============================================================================

@router.get("/report/{work_id}")
async def generate_forensic_report(request: Request, work_id: int):
    """
    Generate comprehensive forensic report for a work.

    Includes all analysis types and overall authenticity assessment.
    """
    pool = request.app.state.db_pool

    async with pool.acquire() as conn:
        # Get work info
        work = await conn.fetchrow("""
            SELECT id, title, author, date_earliest, date_latest
            FROM works
            WHERE id = $1
        """, work_id)

        if not work:
            raise HTTPException(status_code=404, detail="Work not found")

        # Get anomaly count
        anomaly_count = await conn.fetchval("""
            SELECT COUNT(*) FROM anomalies WHERE work_id = $1
        """, work_id)

        # Get segment count (from authorship analysis)
        segment_count = await conn.fetchval("""
            SELECT COUNT(DISTINCT predicted_author_name)
            FROM authorship_segments
            WHERE work_id = $1
        """, work_id)

        # Get hypotheses about this work
        hypotheses = await conn.fetch("""
            SELECT hypothesis_id, title, composite_score, status
            FROM hypotheses
            WHERE supporting_passages::text LIKE '%' || $1::text || '%'
            LIMIT 5
        """, work_id)

        return {
            "work": dict(work),
            "forensic_summary": {
                "anomaly_count": anomaly_count or 0,
                "distinct_authorial_voices": segment_count or 1,
                "related_hypotheses": [dict(h) for h in hypotheses]
            },
            "authenticity_assessment": {
                "traditional_attribution_confidence": 0.8 if (anomaly_count or 0) < 5 else 0.5,
                "unity_of_authorship": (segment_count or 1) == 1,
                "requires_investigation": (anomaly_count or 0) > 10
            }
        }


# ===============================================================================
# DISPUTED WORKS QUEUE
# ===============================================================================

@router.get("/disputed-queue")
async def get_disputed_queue(request: Request):
    """Get queue of works awaiting forensic analysis."""
    from config.constants import DISPUTED_WORKS_PRIORITY

    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        # Check which have been analyzed
        queue = []
        for work in DISPUTED_WORKS_PRIORITY:
            analysis_count = await conn.fetchval("""
                SELECT COUNT(*) FROM anomalies a
                JOIN source_texts st ON a.passage_id = st.id
                WHERE st.urn LIKE $1 || '%'
            """, work['urn'])

            queue.append({
                **work,
                "analyzed": (analysis_count or 0) > 0,
                "anomaly_count": analysis_count or 0
            })

        return {
            "queue": queue,
            "analyzed": sum(1 for w in queue if w['analyzed']),
            "pending": sum(1 for w in queue if not w['analyzed'])
        }


@router.post("/disputed-queue/{work_urn}/analyze")
async def analyze_disputed_work_from_queue(
    request: Request,
    work_urn: str
):
    """
    Trigger forensic analysis on a disputed work from the queue.
    """
    try:
        pool = request.app.state.db_pool

        # Find work
        async with pool.acquire() as conn:
            work = await conn.fetchrow("""
                SELECT id FROM works WHERE urn = $1
            """, work_urn)

            if not work:
                return {"error": f"Work not found: {work_urn}"}

        # Run analysis
        from engines import DiscoveryEngine, AuthorshipSegmenter
        engine = DiscoveryEngine(pool)

        result = await engine.run_interpolation_detection(
            work_ids=[work['id']],
            threshold=2.0,
            require_negative_controls=True
        )

        return {
            "work_urn": work_urn,
            "work_id": work['id'],
            "analysis_complete": True,
            "findings_count": len(result.findings) if hasattr(result, 'findings') else 0
        }
    except Exception as e:
        return {"error": str(e)}


# ===============================================================================
# MEANING-ANCHORED STYLOMETRY ENDPOINTS
# ===============================================================================

class MeaningAnchoredRequest(BaseModel):
    residual_mode: str = "shrinkage"  # none, mean, whitening, shrinkage, robust
    n_meaning_clusters: int = 20
    shrinkage_alpha: float = 0.1


@router.post("/stylometry/anchored-analysis")
async def run_anchored_stylometry(
    request: Request,
    params: MeaningAnchoredRequest
):
    """
    Run meaning-anchored residual stylometry analysis.

    The key innovation: style is measured CONDITIONAL on meaning.
    Different meaning contexts have different "expected language" and
    different noise levels (heteroscedasticity).

    Modes:
    - none: No anchoring (baseline)
    - mean: Subtract cluster mean (x - mu_t)
    - whitening: Full whitening (Sigma_t^{-1/2} * (x - mu_t))
    - shrinkage: Shrinkage covariance estimation (recommended)
    - robust: Median + MAD estimation
    """
    try:
        pool = request.app.state.db_pool

        async with pool.acquire() as conn:
            # Load translation data with embeddings
            rows = await conn.fetch("""
                SELECT t.id, t.translation as text, t.embedding,
                       tr.name as author,
                       COALESCE(t.text_id::text, t.id::text) as anchor
                FROM translations t
                JOIN translators tr ON t.translator_id = tr.id
                WHERE t.embedding IS NOT NULL
                AND t.translation IS NOT NULL
                AND LENGTH(t.translation) > 100
                LIMIT 5000
            """)

            if len(rows) < 100:
                return {"error": "Insufficient data for analysis"}

            # This would call the actual analysis engine
            # For now, return configuration info
            return {
                "status": "configured",
                "mode": params.residual_mode,
                "n_clusters": params.n_meaning_clusters,
                "shrinkage_alpha": params.shrinkage_alpha,
                "n_samples": len(rows),
                "methodology": {
                    "description": "Meaning-anchored residual style analysis",
                    "formula": "r'_i = Sigma_t^{-1/2} * (x_i - mu_t)",
                    "interpretation": "Deviation from expected language for this meaning context"
                }
            }
    except Exception as e:
        return {"error": str(e)}


@router.get("/stylometry/falsification-gates")
async def get_falsification_gates(request: Request):
    """
    Get the five falsification gates that validate stylometric methods.

    These are the non-negotiable tests that keep attribution honest:
    1. Label Permutation: Shuffled labels must collapse to chance
    2. Topic Holdout: Must generalize across meaning clusters
    3. Confound Check: Style should NOT predict topic
    4. Random Features: Random noise should be chance
    5. Multi-Resolution: Stable across segment sizes

    A method that fails ANY gate is rejected, regardless of accuracy.
    """
    gates = [
        {
            "gate": 1,
            "name": "label_permutation",
            "description": "Shuffled labels must collapse to chance accuracy",
            "threshold": "perm_acc < chance + 0.05",
            "rationale": "If the model works on random labels, it's memorizing, not learning style"
        },
        {
            "gate": 2,
            "name": "topic_holdout",
            "description": "Must generalize across held-out meaning clusters",
            "threshold": "topic_holdout_acc / work_holdout_acc >= 0.70",
            "rationale": "Style should transfer to new topics, not be topic-specific"
        },
        {
            "gate": 3,
            "name": "confound_check",
            "description": "Style features should NOT predict topic",
            "threshold": "topic_pred_acc < topic_chance + 0.10",
            "rationale": "If style predicts topic, we're measuring topic, not style"
        },
        {
            "gate": 4,
            "name": "random_features",
            "description": "Random features should give chance accuracy",
            "threshold": "random_acc < chance + 0.10",
            "rationale": "Sanity check that the task isn't trivially solvable"
        },
        {
            "gate": 5,
            "name": "multi_resolution",
            "description": "Results stable across different segment sizes",
            "threshold": "std(accuracies) < 0.05",
            "rationale": "Real style patterns should be resolution-independent"
        }
    ]

    composite_formula = """
    Composite Score = (work_holdout_acc)
                    × (topic_holdout_acc / work_holdout_acc)
                    × (1 - confound_advantage)
                    × (1 - max(0, std - 0.05))

    Only computed if ALL gates pass. Otherwise score = 0.
    """

    return {
        "gates": gates,
        "composite_formula": composite_formula,
        "methodology_reference": "Meaning-anchored residual stylometry with falsification gates"
    }


@router.post("/stylometry/jedp-knockout")
async def run_jedp_knockout(request: Request):
    """
    Run the JEDP divine name knockout test suite.

    Tests whether JEDP source discrimination survives without divine names:
    1. Full model (with divine names)
    2. Divine names removed
    3. Divine names replaced with placeholder

    If performance collapses only when removed, we're detecting
    "divine name patterns" not deeper style.
    """
    try:
        pool = request.app.state.db_pool

        async with pool.acquire() as conn:
            # Check for Hebrew Bible data
            table_exists = await conn.fetchval("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_name = 'hebrew_bible'
                )
            """)

            if not table_exists:
                return {
                    "error": "hebrew_bible table not found",
                    "recommendation": "Run import_hebrew_torah_jedp.py first"
                }

            # Count JEDP verses
            counts = await conn.fetch("""
                SELECT source_label, COUNT(*) as count
                FROM hebrew_bible
                WHERE source_label IN ('J', 'E', 'D', 'P')
                GROUP BY source_label
            """)

            return {
                "status": "ready",
                "jedp_data": {row['source_label']: row['count'] for row in counts},
                "tests_to_run": [
                    "original (with divine names)",
                    "divine_names_removed",
                    "divine_names_replaced"
                ],
                "divine_names": ["יהוה (YHWH)", "אלהים (Elohim)", "אל (El)", "אדני (Adonai)", "שדי (Shaddai)"],
                "interpretation": {
                    "valid": "Style signal persists beyond divine names",
                    "invalid": "Model is primarily a divine name detector",
                    "partial": "Some style signal, but divine names contribute significantly"
                }
            }
    except Exception as e:
        return {"error": str(e)}


@router.get("/stylometry/mark-reconstruction")
async def get_mark_reconstruction_info(request: Request):
    """
    Get information about the Mark reconstruction benchmark.

    This is the publishable validation: reconstruct a KNOWN source (Mark)
    from edited witnesses (Matthew, Luke).

    If we can't reconstruct Mark better than trivial baselines,
    we're not ready to reconstruct Q.
    """
    try:
        pool = request.app.state.db_pool

        async with pool.acquire() as conn:
            # Check for pericope data
            table_exists = await conn.fetchval("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_name = 'pericopes'
                )
            """)

            if not table_exists:
                return {
                    "error": "pericopes table not found",
                    "recommendation": "Run seed_pericopes.py first"
                }

            # Count pericopes by tradition type
            counts = await conn.fetch("""
                SELECT tradition_type, COUNT(*) as count
                FROM pericopes
                GROUP BY tradition_type
            """)

            triple_count = sum(row['count'] for row in counts if row['tradition_type'] == 'triple')
            double_count = sum(row['count'] for row in counts if row['tradition_type'] == 'double_mt_lk')

            return {
                "status": "ready",
                "triple_tradition_pericopes": triple_count,
                "double_tradition_pericopes": double_count,
                "methodology": {
                    "step_1": "Learn editor transforms on triple tradition (Mark is known)",
                    "step_2": "Hide Mark, reconstruct from Matthew + Luke",
                    "step_3": "Compare reconstruction to actual Mark",
                    "step_4": "If successful, apply same method to double tradition for Q"
                },
                "metrics": [
                    "verbal_agreement: % of words correctly reconstructed",
                    "precision: reconstructed words that are in actual",
                    "recall: actual words that are in reconstruction",
                    "f1: harmonic mean of precision and recall"
                ],
                "verdict_thresholds": {
                    "ready_for_q": "F1 >= 0.60",
                    "marginal": "0.40 <= F1 < 0.60",
                    "not_ready": "F1 < 0.40"
                }
            }
    except Exception as e:
        return {"error": str(e)}


@router.get("/stylometry/q-reconstruction")
async def get_q_reconstruction_info(request: Request):
    """
    Get information about Q Source reconstruction methodology.

    Uses the validated Mark reconstruction methodology to infer
    the latent Q source from double tradition (Matthew + Luke only).
    """
    try:
        pool = request.app.state.db_pool

        async with pool.acquire() as conn:
            # Get Q-referenced pericopes
            q_pericopes = await conn.fetch("""
                SELECT q_reference, COUNT(*) as count
                FROM pericopes
                WHERE q_reference IS NOT NULL
                GROUP BY q_reference
                ORDER BY q_reference
            """)

            return {
                "status": "available",
                "q_pericopes": [
                    {"reference": row['q_reference'], "witnesses": row['count']}
                    for row in q_pericopes
                ],
                "methodology": {
                    "principle": "Q is the latent source that, when passed through Matthew-editor and Luke-editor transforms, best explains their observed forms",
                    "step_1": "Use editor transforms learned from Mark benchmark",
                    "step_2": "Find common words (verbal agreement) between Mt and Lk",
                    "step_3": "Apply inverse editor transforms to reconstruct Q",
                    "step_4": "Validate using posterior predictive checks"
                },
                "validation": {
                    "posterior_predictive": "Simulate Mt/Lk from reconstructed Q using editor models",
                    "q_style_consistency": "Check that reconstructed Q has coherent style under anchoring",
                    "competing_hypothesis": "Compare two-source vs alternatives under same constraints"
                },
                "scholarly_context": "Q (Quelle) is the hypothetical sayings source used by Matthew and Luke but not Mark, explaining their shared non-Markan material"
            }
    except Exception as e:
        return {"error": str(e)}
