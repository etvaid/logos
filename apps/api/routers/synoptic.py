"""
Synoptic/Q Reconstruction Router
================================

Endpoints for synoptic alignment and Q source reconstruction.
"""

from fastapi import APIRouter, Request, Query, HTTPException
from typing import Dict, Any, Optional, List
from pydantic import BaseModel

router = APIRouter(prefix="/synoptic", tags=["synoptic"])


# Request/Response Models
class AlignmentRequest(BaseModel):
    matthew_ref: Optional[str] = None
    mark_ref: Optional[str] = None
    luke_ref: Optional[str] = None
    matthew_text: Optional[str] = None
    mark_text: Optional[str] = None
    luke_text: Optional[str] = None


class CriticalEditionEntry(BaseModel):
    q_reference: str
    critical_text: str


# ═══════════════════════════════════════════════════════════════════════════════
# ALIGNMENT ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/alignments")
async def create_alignment(request: Request, data: AlignmentRequest):
    """
    Create a synoptic alignment between parallel passages.

    Aligns Matthew, Mark, and Luke versions of a passage.
    """
    try:
        from engines import QReconstructionEngine
        pool = request.app.state.db_pool
        engine = QReconstructionEngine(pool)
        return await engine.create_synoptic_alignment(
            matthew_ref=data.matthew_ref,
            mark_ref=data.mark_ref,
            luke_ref=data.luke_ref,
            matthew_text=data.matthew_text,
            mark_text=data.mark_text,
            luke_text=data.luke_text
        )
    except Exception as e:
        return {"error": str(e)}


@router.get("/alignments")
async def list_alignments(
    request: Request,
    tradition_type: Optional[str] = None,
    limit: int = Query(default=50, le=200)
):
    """List synoptic alignments."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        query = """
            SELECT id, alignment_group, tradition_type,
                   matthew_ref, mark_ref, luke_ref,
                   mt_mk_similarity, mt_lk_similarity, mk_lk_similarity
            FROM synoptic_alignments
        """
        params = []

        if tradition_type:
            params.append(tradition_type)
            query += f" WHERE tradition_type = ${len(params)}"

        params.append(limit)
        query += f" ORDER BY id DESC LIMIT ${len(params)}"

        rows = await conn.fetch(query, *params)
        return [dict(r) for r in rows]


@router.get("/alignments/{alignment_id}")
async def get_alignment(request: Request, alignment_id: int):
    """Get a specific alignment with full text."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        alignment = await conn.fetchrow("""
            SELECT * FROM synoptic_alignments WHERE id = $1
        """, alignment_id)

        if not alignment:
            raise HTTPException(status_code=404, detail="Alignment not found")

        return dict(alignment)


# ═══════════════════════════════════════════════════════════════════════════════
# REDACTION SIGNATURE ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/signatures/learn")
async def learn_redaction_signatures(request: Request):
    """
    Learn redaction signatures from triple tradition.

    Identifies systematic changes Matthew and Luke make to Mark.
    """
    try:
        from engines import QReconstructionEngine
        pool = request.app.state.db_pool
        engine = QReconstructionEngine(pool)
        return await engine.learn_redaction_signatures()
    except Exception as e:
        return {"error": str(e)}


@router.get("/signatures")
async def list_redaction_signatures(
    request: Request,
    evangelist: Optional[str] = None,
    limit: int = 50
):
    """List learned redaction signatures."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        query = """
            SELECT evangelist, pattern_type, pattern_name,
                   frequency, avg_magnitude, doctrinal_axis, doctrinal_direction
            FROM redaction_signatures
        """
        params = []

        if evangelist:
            params.append(evangelist)
            query += f" WHERE evangelist = ${len(params)}"

        params.append(limit)
        query += f" ORDER BY frequency DESC LIMIT ${len(params)}"

        rows = await conn.fetch(query, *params)
        return [dict(r) for r in rows]


@router.get("/signatures/compare")
async def compare_evangelists(request: Request):
    """Compare Matthew's and Luke's redactional tendencies."""
    try:
        from engines import QReconstructionEngine
        pool = request.app.state.db_pool
        engine = QReconstructionEngine(pool)
        return await engine.compare_evangelists()
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# Q RECONSTRUCTION ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/q/reconstruct/{alignment_id}")
async def reconstruct_q_passage(
    request: Request,
    alignment_id: int,
    n_bootstrap: int = Query(default=100, le=1000)
):
    """
    Reconstruct Q text for a double tradition passage.

    Uses inverse of learned redaction signatures.
    """
    try:
        from engines import QReconstructionEngine
        pool = request.app.state.db_pool
        engine = QReconstructionEngine(pool)
        return await engine.reconstruct_q_passage(alignment_id, n_bootstrap)
    except Exception as e:
        return {"error": str(e)}


@router.post("/q/reconstruct-all")
async def reconstruct_all_q(request: Request):
    """Reconstruct Q for all double tradition passages."""
    try:
        from engines import QReconstructionEngine
        pool = request.app.state.db_pool
        engine = QReconstructionEngine(pool)
        return await engine.reconstruct_all_q()
    except Exception as e:
        return {"error": str(e)}


@router.get("/q/reconstructions")
async def list_q_reconstructions(
    request: Request,
    limit: int = Query(default=50, le=200)
):
    """List Q reconstructions."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT q.id, q.alignment_id, q.q_reference, q.reconstructed_text,
                   q.confidence_score, q.confidence_lower, q.confidence_upper,
                   q.doctrinal_scores, sa.matthew_ref, sa.luke_ref
            FROM q_reconstructions q
            JOIN synoptic_alignments sa ON q.alignment_id = sa.id
            ORDER BY q.q_reference
            LIMIT $1
        """, limit)
        return [dict(r) for r in rows]


@router.get("/q/reconstructions/{reconstruction_id}")
async def get_q_reconstruction(request: Request, reconstruction_id: int):
    """Get a specific Q reconstruction."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        recon = await conn.fetchrow("""
            SELECT q.*, sa.matthew_text, sa.luke_text, sa.mark_text
            FROM q_reconstructions q
            JOIN synoptic_alignments sa ON q.alignment_id = sa.id
            WHERE q.id = $1
        """, reconstruction_id)

        if not recon:
            raise HTTPException(status_code=404, detail="Reconstruction not found")

        return dict(recon)


# ═══════════════════════════════════════════════════════════════════════════════
# Q ANALYSIS ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/q/doctrinal-profile")
async def get_q_doctrinal_profile(request: Request):
    """
    Get aggregate doctrinal profile of reconstructed Q.

    Shows Q's position on each doctrinal axis with confidence intervals.
    """
    try:
        from engines import QReconstructionEngine
        pool = request.app.state.db_pool
        engine = QReconstructionEngine(pool)
        return await engine.get_q_doctrinal_profile()
    except Exception as e:
        return {"error": str(e)}


@router.post("/q/validate")
async def validate_against_critical_edition(
    request: Request,
    entries: List[CriticalEditionEntry]
):
    """
    Validate reconstructions against a critical edition.

    Compares model output to scholarly Q editions (e.g., IQP).
    """
    try:
        from engines import QReconstructionEngine
        pool = request.app.state.db_pool
        engine = QReconstructionEngine(pool)
        edition_dict = {e.q_reference: e.critical_text for e in entries}
        return await engine.validate_against_critical_edition(edition_dict)
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# DOCTRINAL AXES
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/doctrinal-axes")
async def get_doctrinal_axes():
    """Get the doctrinal axes used for Q analysis."""
    from config.constants import DOCTRINAL_AXES
    return DOCTRINAL_AXES


# ═══════════════════════════════════════════════════════════════════════════════
# TRADITION TYPES
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/tradition-types")
async def get_tradition_types():
    """Get explanation of tradition types."""
    return {
        "triple": "Present in Matthew, Mark, and Luke",
        "double_mt_lk": "Present in Matthew and Luke but not Mark (Q material)",
        "double_mt_mk": "Present in Matthew and Mark but not Luke",
        "double_mk_lk": "Present in Mark and Luke but not Matthew",
        "sondergut": "Unique to one gospel"
    }
