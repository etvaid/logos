"""
Calibration Router
==================

Endpoints for calibration gates and validation.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/calibration", tags=["calibration"])


# Request/Response Models
class CalibrationRunResponse(BaseModel):
    run_id: str
    status: str
    gates: Dict[str, Any]
    all_gates_passed: Optional[bool] = None


class GateDetailResponse(BaseModel):
    passed: bool
    metrics: Dict[str, float]
    thresholds: Dict[str, float]
    details: Optional[Dict[str, Any]] = None


# ═══════════════════════════════════════════════════════════════════════════════
# CALIBRATION ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/run", response_model=CalibrationRunResponse)
async def run_full_calibration(request):
    """
    Run full calibration (all 4 gates).

    Gates:
    1. Style Separability (supervised classifier, grouped by meaning_anchor)
    2. Stability Across Windows (500/1000/2000 tokens)
    3. Cross-Era Separation (easy/medium/hard difficulty)
    4. External Validity (known disputed works)
    """
    from engines import CalibrationEngine
    pool = request.app.state.pool
    engine = CalibrationEngine(pool)
    result = await engine.run_full_calibration()
    return result


@router.get("/latest")
async def get_latest_calibration(request):
    """Get most recent calibration results."""
    from engines import CalibrationEngine
    pool = request.app.state.pool
    engine = CalibrationEngine(pool)
    result = await engine.get_latest_calibration()
    if not result:
        raise HTTPException(status_code=404, detail="No calibration runs found")
    return result


@router.get("/history")
async def get_calibration_history(request, limit: int = 10):
    """Get calibration history."""
    from engines import CalibrationEngine
    pool = request.app.state.pool
    engine = CalibrationEngine(pool)
    return await engine.get_calibration_history(limit=limit)


@router.get("/check-required")
async def check_calibration_required(request):
    """Check if recalibration is needed."""
    from engines import CalibrationEngine
    pool = request.app.state.pool
    engine = CalibrationEngine(pool)
    return await engine.check_calibration_required()


# ═══════════════════════════════════════════════════════════════════════════════
# INDIVIDUAL GATE ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/gate/1")
async def run_gate_1(request):
    """
    Run Gate 1: Style Separability.

    Uses supervised classifier with GroupKFold by meaning_anchor_id
    to prevent data leakage.
    """
    from engines import CalibrationEngine
    pool = request.app.state.pool
    engine = CalibrationEngine(pool)
    run_id = uuid.uuid4()
    return await engine.run_gate_1_separability(run_id)


@router.post("/gate/2")
async def run_gate_2(request):
    """
    Run Gate 2: Stability Across Windows.

    Tests F-ratio at 500, 1000, 2000 token windows.
    """
    from engines import CalibrationEngine
    pool = request.app.state.pool
    engine = CalibrationEngine(pool)
    run_id = uuid.uuid4()
    return await engine.run_gate_2_stability(run_id)


@router.post("/gate/3")
async def run_gate_3(request):
    """
    Run Gate 3: Cross-Era Separation.

    Tests easy (same author), medium (same era), hard (cross-era) cases.
    """
    from engines import CalibrationEngine
    pool = request.app.state.pool
    engine = CalibrationEngine(pool)
    run_id = uuid.uuid4()
    return await engine.run_gate_3_cross_era(run_id)


@router.post("/gate/4")
async def run_gate_4(request):
    """
    Run Gate 4: External Validity.

    Validates against known scholarly consensus on disputed works.
    """
    from engines import CalibrationEngine
    pool = request.app.state.pool
    engine = CalibrationEngine(pool)
    run_id = uuid.uuid4()
    return await engine.run_gate_4_external_validity(run_id)


# ═══════════════════════════════════════════════════════════════════════════════
# THRESHOLD ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/thresholds")
async def get_thresholds():
    """Get current calibration thresholds."""
    from config.constants import CALIBRATION_THRESHOLDS
    return CALIBRATION_THRESHOLDS


@router.get("/thresholds/{gate}")
async def get_gate_thresholds(gate: int):
    """Get thresholds for a specific gate."""
    from config.constants import CALIBRATION_THRESHOLDS
    key = f"gate_{gate}"
    if key not in CALIBRATION_THRESHOLDS:
        raise HTTPException(status_code=404, detail=f"Gate {gate} not found")
    return CALIBRATION_THRESHOLDS[key]
