"""
Hypothesis Factory Router
=========================

Endpoints for hypothesis generation, validation, and tracking.
"""

from fastapi import APIRouter, Request, Query, HTTPException
from typing import Dict, Any, Optional, List
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/hypothesis", tags=["hypothesis"])


# Request/Response Models
class UserHypothesis(BaseModel):
    title: str
    description: str
    category: str
    supporting_evidence: Optional[List[Dict[str, Any]]] = None


class FalsificationEvidence(BaseModel):
    evidence_type: str
    details: Dict[str, Any]


# ═══════════════════════════════════════════════════════════════════════════════
# GENERATION ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/generate/from-anomalies")
async def generate_from_anomalies(
    request: Request,
    min_severity: float = Query(default=0.7, description="Minimum anomaly severity")
):
    """
    Generate hypotheses from detected anomalies.

    Scans anomalies table for significant findings and generates hypothesis objects.
    """
    try:
        from engines import HypothesisFactory
        pool = request.app.state.db_pool
        factory = HypothesisFactory(pool)
        hypotheses = await factory.generate_hypotheses_from_anomalies(min_severity)
        return {
            "generated": len(hypotheses),
            "hypotheses": [
                {
                    "hypothesis_id": str(h.hypothesis_id),
                    "title": h.title,
                    "category": h.category,
                    "novelty_score": h.novelty_score,
                    "evidence_score": h.evidence_score,
                    "composite_score": h.composite_score
                }
                for h in hypotheses
            ]
        }
    except Exception as e:
        return {"error": str(e)}


@router.post("/submit")
async def submit_user_hypothesis(request: Request, data: UserHypothesis):
    """
    Submit a user-generated hypothesis.

    Will be scored for novelty and queued for validation.
    """
    try:
        pool = request.app.state.db_pool
        hypothesis_id = uuid.uuid4()

        async with pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO hypotheses (
                    hypothesis_id, title, description, category, source,
                    supporting_passages, status
                ) VALUES ($1, $2, $3, $4, 'user', $5, 'pending')
            """,
                hypothesis_id,
                data.title,
                data.description,
                data.category,
                data.supporting_evidence or []
            )

        return {
            "hypothesis_id": str(hypothesis_id),
            "status": "pending",
            "message": "Hypothesis submitted for validation"
        }
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# VALIDATION ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/validate/{hypothesis_id}")
async def validate_hypothesis(request: Request, hypothesis_id: str):
    """
    Run validation tests on a hypothesis.

    Tests:
    - Window stability
    - Subsample stability
    - Negative control comparison
    - Confound resistance
    """
    try:
        from engines import HypothesisFactory
        pool = request.app.state.db_pool
        factory = HypothesisFactory(pool)
        return await factory.validate_hypothesis(uuid.UUID(hypothesis_id))
    except Exception as e:
        return {"error": str(e)}


@router.post("/falsify/{hypothesis_id}")
async def attempt_falsification(
    request: Request,
    hypothesis_id: str,
    evidence: FalsificationEvidence
):
    """
    Attempt to falsify a hypothesis with new evidence.

    If falsification succeeds, hypothesis is marked as falsified.
    """
    try:
        from engines import HypothesisFactory
        pool = request.app.state.db_pool
        factory = HypothesisFactory(pool)
        return await factory.attempt_falsification(
            uuid.UUID(hypothesis_id),
            evidence.dict()
        )
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# QUERY ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/top")
async def get_top_hypotheses(
    request: Request,
    n: int = Query(default=20, le=100),
    category: Optional[str] = None,
    min_composite: float = Query(default=0.5, ge=0, le=1)
):
    """Get top hypotheses by composite score."""
    try:
        from engines import HypothesisFactory
        pool = request.app.state.db_pool
        factory = HypothesisFactory(pool)
        return await factory.get_top_hypotheses(n, category, min_composite)
    except Exception as e:
        return {"error": str(e)}


@router.get("/summary")
async def get_hypothesis_summary(request: Request):
    """Get summary statistics of all hypotheses."""
    try:
        from engines import HypothesisFactory
        pool = request.app.state.db_pool
        factory = HypothesisFactory(pool)
        return await factory.get_hypothesis_summary()
    except Exception as e:
        return {"error": str(e)}


@router.get("/{hypothesis_id}")
async def get_hypothesis(request: Request, hypothesis_id: str):
    """Get a specific hypothesis by ID."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        hypothesis = await conn.fetchrow("""
            SELECT hypothesis_id, title, description, category, source,
                   novelty_score, evidence_score, confound_resistance_score,
                   composite_score, status, supporting_passages,
                   falsification_criteria, created_at
            FROM hypotheses
            WHERE hypothesis_id = $1
        """, uuid.UUID(hypothesis_id))

        if not hypothesis:
            raise HTTPException(status_code=404, detail="Hypothesis not found")

        return dict(hypothesis)


@router.get("/")
async def list_hypotheses(
    request: Request,
    limit: int = Query(default=50, le=200),
    status: Optional[str] = None,
    category: Optional[str] = None
):
    """List hypotheses with optional filters."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        query = """
            SELECT hypothesis_id, title, category, source,
                   composite_score, status, created_at
            FROM hypotheses
            WHERE 1=1
        """
        params = []

        if status:
            params.append(status)
            query += f" AND status = ${len(params)}"

        if category:
            params.append(category)
            query += f" AND category = ${len(params)}"

        params.append(limit)
        query += f" ORDER BY composite_score DESC NULLS LAST LIMIT ${len(params)}"

        rows = await conn.fetch(query, *params)
        return [dict(r) for r in rows]


# ═══════════════════════════════════════════════════════════════════════════════
# CATEGORY ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/categories")
async def get_categories():
    """Get all hypothesis categories."""
    from config.constants import HYPOTHESIS_CATEGORIES
    return {"categories": HYPOTHESIS_CATEGORIES}


# ═══════════════════════════════════════════════════════════════════════════════
# TEST ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/tests/{hypothesis_id}")
async def get_hypothesis_tests(request: Request, hypothesis_id: str):
    """Get all tests run for a hypothesis."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        tests = await conn.fetch("""
            SELECT test_type, test_name, passed, p_value,
                   effect_size, test_details, created_at
            FROM hypothesis_tests
            WHERE hypothesis_id = $1
            ORDER BY created_at DESC
        """, uuid.UUID(hypothesis_id))
        return [dict(t) for t in tests]
