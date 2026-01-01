"""
Uncertainty Quantification Router
=================================

Endpoints for confidence intervals, calibration, and uncertainty metrics.
"""

from fastapi import APIRouter, Request, Query, HTTPException
from typing import Dict, Any, Optional, List
from pydantic import BaseModel

router = APIRouter(prefix="/uncertainty", tags=["uncertainty"])


# Request/Response Models
class UncertaintyRequest(BaseModel):
    analysis_type: str  # 'authorship', 'dating', 'style', 'hypothesis'
    entity_id: int
    n_bootstrap: int = 1000


class CalibrationCheck(BaseModel):
    predicted_confidence: float
    actual_outcome: bool


# ===============================================================================
# CONFIDENCE INTERVAL ENDPOINTS
# ===============================================================================

@router.post("/bootstrap")
async def compute_bootstrap_ci(request: Request, data: UncertaintyRequest):
    """
    Compute bootstrap confidence intervals for an analysis.

    Uses n_bootstrap resamples to estimate CI for the metric of interest.
    """
    try:
        pool = request.app.state.db_pool

        # Dispatch based on analysis type
        if data.analysis_type == "authorship":
            from engines import AuthorshipSegmenter
            engine = AuthorshipSegmenter(pool)
            return await engine.compute_attribution_ci(data.entity_id, data.n_bootstrap)
        elif data.analysis_type == "dating":
            from engines import LatentFactorEngine
            engine = LatentFactorEngine(pool)
            return await engine.compute_dating_ci(data.entity_id, data.n_bootstrap)
        elif data.analysis_type == "style":
            from engines import StyleResidualEngine
            engine = StyleResidualEngine(pool)
            return await engine.compute_style_ci(data.entity_id, data.n_bootstrap)
        elif data.analysis_type == "hypothesis":
            from engines import HypothesisFactory
            factory = HypothesisFactory(pool)
            return await factory.compute_hypothesis_ci(data.entity_id, data.n_bootstrap)
        else:
            return {"error": f"Unknown analysis type: {data.analysis_type}"}
    except Exception as e:
        return {"error": str(e)}


@router.get("/calibration-curve/{analysis_type}")
async def get_calibration_curve(
    request: Request,
    analysis_type: str,
    n_bins: int = Query(default=10, le=20)
):
    """
    Get reliability/calibration curve for an analysis type.

    Returns expected vs actual accuracy for confidence bins.
    Deviations indicate over/under-confidence.
    """
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        # Get predictions with known outcomes
        rows = await conn.fetch("""
            SELECT predicted_confidence, actual_correct
            FROM calibration_evaluations
            WHERE analysis_type = $1
            ORDER BY predicted_confidence
        """, analysis_type)

        if not rows:
            return {"error": "No calibration data available", "bins": []}

        # Compute calibration curve
        import numpy as np
        confs = np.array([r['predicted_confidence'] for r in rows])
        correct = np.array([r['actual_correct'] for r in rows])

        bins = []
        bin_edges = np.linspace(0, 1, n_bins + 1)

        for i in range(n_bins):
            mask = (confs >= bin_edges[i]) & (confs < bin_edges[i+1])
            if mask.sum() > 0:
                mean_conf = float(confs[mask].mean())
                actual_acc = float(correct[mask].mean())
                count = int(mask.sum())
                bins.append({
                    "bin_start": float(bin_edges[i]),
                    "bin_end": float(bin_edges[i+1]),
                    "mean_confidence": mean_conf,
                    "actual_accuracy": actual_acc,
                    "calibration_error": abs(mean_conf - actual_acc),
                    "n_samples": count
                })

        # Compute ECE (Expected Calibration Error)
        total_samples = sum(b['n_samples'] for b in bins)
        ece = sum(
            b['calibration_error'] * b['n_samples'] / total_samples
            for b in bins
        ) if total_samples > 0 else 0

        return {
            "analysis_type": analysis_type,
            "n_bins": n_bins,
            "ece": ece,
            "bins": bins,
            "is_well_calibrated": ece < 0.05
        }


@router.get("/ece")
async def get_expected_calibration_error(request: Request):
    """
    Get ECE (Expected Calibration Error) for all analysis types.

    ECE measures how well predicted confidences match actual accuracy.
    Lower is better; < 0.05 is well-calibrated.
    """
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT
                analysis_type,
                AVG(ABS(predicted_confidence - actual_correct::int)) as ece,
                COUNT(*) as n_samples
            FROM calibration_evaluations
            GROUP BY analysis_type
        """)

        return {
            "analysis_types": [
                {
                    "type": r['analysis_type'],
                    "ece": float(r['ece']) if r['ece'] else 0,
                    "n_samples": r['n_samples'],
                    "is_well_calibrated": (r['ece'] or 0) < 0.05
                }
                for r in rows
            ]
        }


# ===============================================================================
# STABILITY ENDPOINTS
# ===============================================================================

@router.post("/stability/window-test/{entity_id}")
async def test_window_stability(
    request: Request,
    entity_id: int,
    windows: List[int] = Query(default=[500, 1000, 2000])
):
    """
    Test if a result is stable across different window sizes.

    Returns the result computed at each window size and consistency metrics.
    """
    try:
        from engines import StyleResidualEngine
        pool = request.app.state.db_pool
        engine = StyleResidualEngine(pool)

        results = {}
        for window in windows:
            result = await engine.compute_style_at_window(entity_id, window)
            results[window] = result

        # Compute consistency
        values = [r.get('primary_metric', 0) for r in results.values()]
        import numpy as np
        std = float(np.std(values)) if len(values) > 1 else 0
        mean = float(np.mean(values)) if values else 0
        cv = std / mean if mean > 0 else float('inf')

        return {
            "entity_id": entity_id,
            "windows": windows,
            "results": results,
            "stability": {
                "mean": mean,
                "std": std,
                "coefficient_of_variation": cv,
                "is_stable": cv < 0.1  # Less than 10% variation
            }
        }
    except Exception as e:
        return {"error": str(e)}


@router.post("/stability/subsample-test/{entity_id}")
async def test_subsample_stability(
    request: Request,
    entity_id: int,
    n_subsamples: int = Query(default=100, le=500),
    subsample_fraction: float = Query(default=0.8)
):
    """
    Test if a result is stable across random subsamples.

    Computes the result on n_subsamples random subsets of the data.
    """
    try:
        from engines import StyleResidualEngine
        pool = request.app.state.db_pool
        engine = StyleResidualEngine(pool)

        results = await engine.subsample_stability_test(
            entity_id, n_subsamples, subsample_fraction
        )

        return {
            "entity_id": entity_id,
            "n_subsamples": n_subsamples,
            "subsample_fraction": subsample_fraction,
            "results": results
        }
    except Exception as e:
        return {"error": str(e)}


# ===============================================================================
# NEGATIVE CONTROL COMPARISON
# ===============================================================================

@router.post("/negative-controls/{entity_id}")
async def compare_to_negative_controls(
    request: Request,
    entity_id: int,
    controls: Optional[List[str]] = None
):
    """
    Compare a result to negative control baselines.

    Controls:
    - shuffle_sentences: Preserves word frequencies, breaks discourse
    - shuffle_paragraphs: Preserves paragraph topics, breaks flow
    - topic_matched_impostor: Same genre/time, different author
    """
    from config.constants import NEGATIVE_CONTROLS

    if controls is None:
        controls = list(NEGATIVE_CONTROLS.keys())[:3]

    try:
        from engines import DiscoveryEngine
        pool = request.app.state.db_pool
        engine = DiscoveryEngine(pool)

        real_result = await engine.compute_metric(entity_id)
        control_results = {}

        for control in controls:
            if control in NEGATIVE_CONTROLS:
                control_result = await engine.compute_metric_with_control(
                    entity_id, control
                )
                control_results[control] = control_result

        # Check if real result beats all controls
        real_value = real_result.get('metric_value', 0)
        beats_all = all(
            real_value > cr.get('metric_value', 0)
            for cr in control_results.values()
        )

        return {
            "entity_id": entity_id,
            "real_result": real_result,
            "control_results": control_results,
            "beats_all_controls": beats_all,
            "available_controls": NEGATIVE_CONTROLS
        }
    except Exception as e:
        return {"error": str(e)}


# ===============================================================================
# UNCERTAINTY SUMMARY
# ===============================================================================

@router.get("/summary")
async def get_uncertainty_summary(request: Request):
    """
    Get overall uncertainty quantification summary.

    Shows calibration status across all analysis types.
    """
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        # Get recent calibration runs
        runs = await conn.fetch("""
            SELECT cr.run_id, cr.created_at,
                   cr.gate_1_passed, cr.gate_2_passed,
                   cr.gate_3_passed, cr.gate_4_passed,
                   cr.all_gates_passed
            FROM calibration_runs cr
            ORDER BY cr.created_at DESC
            LIMIT 5
        """)

        # Get hypothesis validation rates
        hyp_stats = await conn.fetchrow("""
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'validated' THEN 1 ELSE 0 END) as validated,
                SUM(CASE WHEN status = 'falsified' THEN 1 ELSE 0 END) as falsified,
                AVG(composite_score) as avg_score
            FROM hypotheses
            WHERE composite_score IS NOT NULL
        """)

        return {
            "calibration": {
                "recent_runs": [dict(r) for r in runs],
                "latest_passed": runs[0]['all_gates_passed'] if runs else None
            },
            "hypotheses": {
                "total": hyp_stats['total'] or 0,
                "validated": hyp_stats['validated'] or 0,
                "falsified": hyp_stats['falsified'] or 0,
                "validation_rate": (
                    (hyp_stats['validated'] or 0) / hyp_stats['total']
                    if hyp_stats['total'] else 0
                ),
                "avg_score": float(hyp_stats['avg_score']) if hyp_stats['avg_score'] else 0
            },
            "status": "calibrated" if (runs and runs[0]['all_gates_passed']) else "needs_calibration"
        }
