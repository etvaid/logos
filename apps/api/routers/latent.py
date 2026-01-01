"""
Latent Factors Router
=====================

Endpoints for latent factor analysis and regime shift detection.
"""

from fastapi import APIRouter, Request, Query, HTTPException
from typing import Dict, Any, Optional, List
from pydantic import BaseModel

router = APIRouter(prefix="/latent", tags=["latent-factors"])


# Request/Response Models
class AxisDefinition(BaseModel):
    axis_name: str
    positive_pole: str
    negative_pole: str
    positive_markers: List[str]
    negative_markers: List[str]


class ConceptTrajectoryRequest(BaseModel):
    term: str
    language: str = "greek"
    time_resolution: int = 50


# ═══════════════════════════════════════════════════════════════════════════════
# AXIS DEFINITION ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/axes")
async def define_axis(request: Request, data: AxisDefinition):
    """
    Define a new semantic axis from marker terms.

    The axis vector is computed as:
    axis = centroid(positive_markers) - centroid(negative_markers)
    """
    try:
        from engines import LatentFactorEngine
        pool = request.app.state.db_pool
        engine = LatentFactorEngine(pool)
        return await engine.define_axis(
            data.axis_name,
            data.positive_pole,
            data.negative_pole,
            data.positive_markers,
            data.negative_markers
        )
    except Exception as e:
        return {"error": str(e)}


@router.get("/axes")
async def list_axes(request: Request):
    """List all defined latent axes."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, axis_name, positive_pole, negative_pole,
                   discriminative_power, created_at
            FROM latent_axes
            ORDER BY axis_name
        """)
        return [dict(r) for r in rows]


@router.get("/axes/{axis_name}")
async def get_axis(request: Request, axis_name: str):
    """Get details of a specific axis."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        axis = await conn.fetchrow("""
            SELECT * FROM latent_axes WHERE axis_name = $1
        """, axis_name)
        if not axis:
            raise HTTPException(status_code=404, detail="Axis not found")
        return dict(axis)


@router.post("/axes/load")
async def load_all_axes(request: Request):
    """Load all defined axes into memory."""
    try:
        from engines import LatentFactorEngine
        pool = request.app.state.db_pool
        engine = LatentFactorEngine(pool)
        return await engine.load_axes()
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# FACTOR SCORING ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/scores/passage/{passage_id}")
async def score_passage(request: Request, passage_id: int):
    """
    Project a passage onto all defined axes.

    Returns score for each axis.
    """
    try:
        from engines import LatentFactorEngine
        pool = request.app.state.db_pool
        engine = LatentFactorEngine(pool)
        return await engine.score_passage(passage_id)
    except Exception as e:
        return {"error": str(e)}


@router.post("/scores/all")
async def score_all_passages(request: Request, batch_size: int = 1000):
    """Score all passages on all axes."""
    try:
        from engines import LatentFactorEngine
        pool = request.app.state.db_pool
        engine = LatentFactorEngine(pool)
        return await engine.score_all_passages(batch_size)
    except Exception as e:
        return {"error": str(e)}


@router.get("/scores")
async def get_factor_scores(
    request: Request,
    work_id: Optional[int] = None,
    author_id: Optional[int] = None,
    limit: int = Query(default=100, le=1000)
):
    """Get factor scores with optional filters."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        query = """
            SELECT passage_id, work_id, author_id, axis_scores, estimated_date
            FROM latent_factor_scores
            WHERE 1=1
        """
        params = []

        if work_id:
            params.append(work_id)
            query += f" AND work_id = ${len(params)}"

        if author_id:
            params.append(author_id)
            query += f" AND author_id = ${len(params)}"

        params.append(limit)
        query += f" ORDER BY estimated_date LIMIT ${len(params)}"

        rows = await conn.fetch(query, *params)
        return [dict(r) for r in rows]


# ═══════════════════════════════════════════════════════════════════════════════
# REGIME SHIFT ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/regime-shifts/{axis_name}")
async def detect_regime_shifts(
    request: Request,
    axis_name: str,
    method: str = Query(default="pelt", description="'pelt', 'binseg', or 'window'"),
    min_size: int = 10,
    penalty: float = 10.0
):
    """
    Detect regime shifts (changepoints) in a latent factor over time.

    Uses Bayesian changepoint detection algorithms.
    """
    try:
        from engines import LatentFactorEngine
        pool = request.app.state.db_pool
        engine = LatentFactorEngine(pool)
        await engine.load_axes()
        return await engine.detect_regime_shifts(axis_name, method, min_size, penalty)
    except Exception as e:
        return {"error": str(e)}


@router.get("/regime-shifts")
async def list_regime_shifts(
    request: Request,
    axis_name: Optional[str] = None,
    limit: int = 50
):
    """List detected regime shifts."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        query = """
            SELECT rs.id, la.axis_name, rs.changepoint_date, rs.changepoint_type,
                   rs.pre_mean, rs.post_mean, rs.magnitude, rs.known_event,
                   rs.date_ci_lower, rs.date_ci_upper
            FROM regime_shifts rs
            JOIN latent_axes la ON rs.axis_id = la.id
        """
        params = []

        if axis_name:
            params.append(axis_name)
            query += f" WHERE la.axis_name = ${len(params)}"

        params.append(limit)
        query += f" ORDER BY rs.changepoint_date LIMIT ${len(params)}"

        rows = await conn.fetch(query, *params)
        return [dict(r) for r in rows]


# ═══════════════════════════════════════════════════════════════════════════════
# CONCEPT TRAJECTORY ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/concept-trajectory")
async def track_concept_trajectory(request: Request, data: ConceptTrajectoryRequest):
    """
    Track how a concept's meaning evolves over time.

    Returns drift metrics and detected semantic shifts.
    """
    try:
        from engines import LatentFactorEngine
        pool = request.app.state.db_pool
        engine = LatentFactorEngine(pool)
        return await engine.track_concept_trajectory(
            data.term,
            data.language,
            data.time_resolution
        )
    except Exception as e:
        return {"error": str(e)}


@router.get("/concept-trajectories")
async def list_concept_trajectories(request: Request, limit: int = 50):
    """List tracked concept trajectories."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT concept_term, language, time_points,
                   total_drift, drift_rate, semantic_shifts
            FROM concept_trajectories
            ORDER BY drift_rate DESC
            LIMIT $1
        """, limit)
        return [dict(r) for r in rows]


# ═══════════════════════════════════════════════════════════════════════════════
# TIME SERIES ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/time-series/{axis_name}")
async def get_factor_time_series(
    request: Request,
    axis_name: str,
    start_year: Optional[int] = None,
    end_year: Optional[int] = None,
    resolution: int = Query(default=25, description="Time resolution in years")
):
    """
    Get time series of a latent factor.

    Returns aggregated scores per time period with confidence intervals.
    """
    try:
        from engines import LatentFactorEngine
        pool = request.app.state.db_pool
        engine = LatentFactorEngine(pool)
        await engine.load_axes()
        return await engine.get_factor_time_series(
            axis_name, start_year, end_year, resolution
        )
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# CORRELATION ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/correlations")
async def correlate_axes(request: Request):
    """
    Compute correlations between all latent axes.

    Returns correlation matrix.
    """
    try:
        from engines import LatentFactorEngine
        pool = request.app.state.db_pool
        engine = LatentFactorEngine(pool)
        await engine.load_axes()
        return await engine.correlate_axes()
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# HISTORICAL EVENTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/historical-events")
async def get_historical_events():
    """Get known historical events for correlation."""
    return {
        -490: "Battle of Marathon",
        -480: "Battle of Salamis",
        -431: "Start of Peloponnesian War",
        -404: "Fall of Athens",
        -338: "Battle of Chaeronea",
        -323: "Death of Alexander",
        -146: "Destruction of Corinth",
        -44: "Assassination of Caesar",
        -31: "Battle of Actium",
        14: "Death of Augustus",
        64: "Great Fire of Rome",
        70: "Destruction of Jerusalem",
        117: "Death of Trajan",
        180: "Death of Marcus Aurelius",
        284: "Reign of Diocletian",
        313: "Edict of Milan",
        325: "Council of Nicaea",
        410: "Sack of Rome",
        476: "Fall of Western Empire",
    }
