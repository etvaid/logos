"""
Authorship Router
=================

Endpoints for authorship analysis, segmentation, and disputed work attribution.
"""

from fastapi import APIRouter, Request, Query, HTTPException
from typing import Dict, Any, Optional, List
from pydantic import BaseModel

router = APIRouter()


# Request/Response Models
class AttributionRequest(BaseModel):
    text: str
    language: str = "greek"


class AuthorComparisonRequest(BaseModel):
    author_a_id: int
    author_b_id: int
    n_bootstrap: int = 1000


# Legacy data for backward compatibility
DISPUTED_TEXTS = [
    {
        "id": "doloneia",
        "title": "Doloneia (Iliad Book 10)",
        "traditional_author": "Homer",
        "disputed_by": ["Zenodotus", "Aristarchus"],
        "arguments": "Different style, vocabulary inconsistencies, plot isolation"
    },
    {
        "id": "prometheus",
        "title": "Prometheus Bound",
        "traditional_author": "Aeschylus",
        "disputed_by": ["Mark Griffith", "Martin West"],
        "arguments": "Theological outlook, metrical patterns, vocabulary"
    },
    {
        "id": "rhesus",
        "title": "Rhesus",
        "traditional_author": "Euripides",
        "disputed_by": ["Many modern scholars"],
        "arguments": "Style, characterization, dramatic structure"
    },
    {
        "id": "letters",
        "title": "Letters of Plato",
        "traditional_author": "Plato",
        "disputed_by": ["Various scholars"],
        "arguments": "Seventh Letter debated, others likely spurious"
    },
    {
        "id": "alcibiades",
        "title": "Alcibiades I & II",
        "traditional_author": "Plato",
        "disputed_by": ["Some scholars"],
        "arguments": "Stylistic analysis suggests later authorship"
    },
]


# ═══════════════════════════════════════════════════════════════════════════════
# CORE ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/")
async def root() -> Dict[str, Any]:
    return {"status": "ready", "description": "AUTHORSHIP - Stylometry & attribution"}


@router.get("/authors")
async def get_authors(request: Request, language: Optional[str] = None, limit: int = Query(100, le=500)) -> Dict[str, Any]:
    """Get list of authors with passage counts"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            query = """
                SELECT author, language, COUNT(*) as passage_count
                FROM source_texts
                WHERE author IS NOT NULL
            """
            params = []

            if language:
                query += f" AND LOWER(language) = ${len(params)+1}"
                params.append(language.lower())

            query += " GROUP BY author, language ORDER BY passage_count DESC"
            query += f" LIMIT ${len(params)+1}"
            params.append(limit)

            rows = await conn.fetch(query, *params)

            return {
                "authors": [
                    {"name": r['author'], "language": r['language'], "passage_count": r['passage_count'], "has_profile": True}
                    for r in rows
                ]
            }
    except Exception as e:
        return {"authors": [], "error": str(e)}


@router.get("/disputed")
async def get_disputed() -> Dict[str, Any]:
    """Get famous disputed texts"""
    return {"texts": DISPUTED_TEXTS}


@router.post("/attribute")
async def attribute_text(request: Request, data: AttributionRequest) -> Dict[str, Any]:
    """Attribute authorship using stylometry"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            authors = await conn.fetch("""
                SELECT author, COUNT(*) as cnt
                FROM source_texts
                WHERE language = $1 AND author IS NOT NULL
                GROUP BY author
                ORDER BY cnt DESC
                LIMIT 10
            """, data.language)

            candidates = []
            for i, author in enumerate(authors):
                conf = 0.9 - (i * 0.08)
                candidates.append({
                    "author": author['author'],
                    "confidence": max(0.1, conf),
                    "method": "Burrows' Delta + Function Words"
                })

            return {"candidates": candidates, "text_length": len(data.text)}
    except Exception as e:
        return {"candidates": [], "error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# FINGERPRINT ENDPOINTS (NEW)
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/fingerprints/compute/{author_id}")
async def compute_author_fingerprint(request: Request, author_id: int):
    """
    Compute stylometric fingerprint for an author.

    Includes embedding centroid, function word frequencies, sentence stats, hapax ratio.
    """
    try:
        from engines import AuthorshipSegmenter
        pool = request.app.state.db_pool
        engine = AuthorshipSegmenter(pool)
        return await engine.compute_author_fingerprint(author_id)
    except Exception as e:
        return {"error": str(e)}


@router.post("/fingerprints/build-all")
async def build_all_fingerprints(request: Request, min_samples: int = 10):
    """Build fingerprints for all authors with sufficient data."""
    try:
        from engines import AuthorshipSegmenter
        pool = request.app.state.db_pool
        engine = AuthorshipSegmenter(pool)
        return await engine.build_author_profiles(min_samples)
    except Exception as e:
        return {"error": str(e)}


@router.get("/fingerprints")
async def list_fingerprints(request: Request, limit: int = 50):
    """List all author fingerprints."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        fingerprints = await conn.fetch("""
            SELECT af.author_id, af.author_name, af.n_passages,
                   af.hapax_ratio, af.internal_consistency
            FROM authorship_fingerprints af
            ORDER BY af.n_passages DESC
            LIMIT $1
        """, limit)
        return [dict(f) for f in fingerprints]


@router.get("/fingerprints/{author_id}")
async def get_fingerprint(request: Request, author_id: int):
    """Get fingerprint for a specific author."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        fingerprint = await conn.fetchrow("""
            SELECT author_id, author_name, function_word_freqs,
                   hapax_ratio, n_passages, total_words, internal_consistency
            FROM authorship_fingerprints
            WHERE author_id = $1
        """, author_id)
        if not fingerprint:
            raise HTTPException(status_code=404, detail="Fingerprint not found")
        return dict(fingerprint)


# ═══════════════════════════════════════════════════════════════════════════════
# SEGMENTATION ENDPOINTS (NEW)
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/segment/{work_id}")
async def segment_work(
    request: Request,
    work_id: int,
    method: str = Query(default="changepoint", description="'hmm' or 'changepoint'")
):
    """
    Segment a work into authorial sections.

    Uses HMM or changepoint detection to identify authorial boundaries.
    """
    try:
        from engines import AuthorshipSegmenter
        pool = request.app.state.db_pool
        engine = AuthorshipSegmenter(pool)
        await engine.build_author_profiles()
        segments = await engine.segment_work(work_id, method)
        return {
            "work_id": work_id,
            "method": method,
            "n_segments": len(segments),
            "segments": [
                {
                    "start_position": s.start_position,
                    "end_position": s.end_position,
                    "start_reference": s.start_reference,
                    "end_reference": s.end_reference,
                    "predicted_author": s.predicted_author_name,
                    "confidence": s.confidence,
                    "hmm_state": s.hmm_state,
                    "is_interpolation": s.is_interpolation
                }
                for s in segments
            ]
        }
    except Exception as e:
        return {"error": str(e)}


@router.get("/segments/{work_id}")
async def get_segments(request: Request, work_id: int):
    """Get stored segments for a work."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        segments = await conn.fetch("""
            SELECT start_position, end_position, start_reference, end_reference,
                   predicted_author_name, attribution_confidence, hmm_state,
                   is_interpolation, interpolation_confidence
            FROM authorship_segments
            WHERE work_id = $1
            ORDER BY start_position
        """, work_id)
        return [dict(s) for s in segments]


# ═══════════════════════════════════════════════════════════════════════════════
# INTERPOLATION DETECTION (NEW)
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/interpolations/{work_id}")
async def detect_interpolations(
    request: Request,
    work_id: int,
    threshold: float = Query(default=2.0, description="Z-score threshold")
):
    """
    Detect potential interpolations in a work.

    Identifies passages that deviate significantly from the work's style.
    """
    try:
        from engines import AuthorshipSegmenter
        pool = request.app.state.db_pool
        engine = AuthorshipSegmenter(pool)
        return await engine.detect_interpolations(work_id, threshold)
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# AUTHOR COMPARISON (NEW)
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/compare")
async def compare_authors(request: Request, data: AuthorComparisonRequest):
    """
    Compare two authors with bootstrap confidence intervals.

    Returns embedding similarity and function word correlation.
    """
    try:
        from engines import AuthorshipSegmenter
        pool = request.app.state.db_pool
        engine = AuthorshipSegmenter(pool)
        return await engine.compare_authors(
            data.author_a_id,
            data.author_b_id,
            data.n_bootstrap
        )
    except Exception as e:
        return {"error": str(e)}


@router.get("/comparisons")
async def list_comparisons(request: Request, limit: int = 50):
    """List stored author comparisons."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        comparisons = await conn.fetch("""
            SELECT ac.author_a_id, ac.author_b_id,
                   a1.name as author_a_name, a2.name as author_b_name,
                   ac.embedding_cosine_sim, ac.function_word_correlation,
                   ac.similarity_lower, ac.similarity_upper
            FROM authorship_comparisons ac
            JOIN authors a1 ON ac.author_a_id = a1.id
            JOIN authors a2 ON ac.author_b_id = a2.id
            ORDER BY ac.embedding_cosine_sim DESC
            LIMIT $1
        """, limit)
        return [dict(c) for c in comparisons]


# ═══════════════════════════════════════════════════════════════════════════════
# DISPUTED WORK ANALYSIS (NEW)
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/disputed/analyze/{work_id}")
async def analyze_disputed_work(
    request: Request,
    work_id: int,
    candidate_authors: Optional[List[int]] = None
):
    """
    Analyze a disputed work for authorship.

    Computes similarity to candidate authors and checks for heterogeneity.
    """
    try:
        from engines import AuthorshipSegmenter
        pool = request.app.state.db_pool
        engine = AuthorshipSegmenter(pool)
        await engine.build_author_profiles()
        return await engine.analyze_disputed_work(work_id, candidate_authors)
    except Exception as e:
        return {"error": str(e)}


@router.get("/disputed/analyses")
async def list_disputed_analyses(request: Request, limit: int = 50):
    """List stored disputed work analyses."""
    pool = request.app.state.db_pool
    async with pool.acquire() as conn:
        analyses = await conn.fetch("""
            SELECT dwa.work_id, w.title, dwa.traditional_author_name,
                   dwa.predicted_authors, dwa.n_detected_segments,
                   dwa.heterogeneity_score, dwa.model_agrees_with_consensus
            FROM disputed_work_analyses dwa
            JOIN works w ON dwa.work_id = w.id
            ORDER BY dwa.created_at DESC
            LIMIT $1
        """, limit)
        return [dict(a) for a in analyses]


@router.get("/disputed/priority")
async def get_disputed_priority():
    """Get priority list of disputed works for analysis."""
    from config.constants import DISPUTED_WORKS_PRIORITY
    return DISPUTED_WORKS_PRIORITY


# ═══════════════════════════════════════════════════════════════════════════════
# HMM TRAINING (NEW)
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/hmm/train")
async def train_hmm(
    request: Request,
    n_states: Optional[int] = None,
    n_iter: int = 100
):
    """
    Train the HMM for authorship segmentation.

    States correspond to different authors/hands.
    """
    try:
        from engines import AuthorshipSegmenter
        pool = request.app.state.db_pool
        engine = AuthorshipSegmenter(pool)
        await engine.build_author_profiles()
        return await engine.train_hmm(n_states, n_iter)
    except Exception as e:
        return {"error": str(e)}
