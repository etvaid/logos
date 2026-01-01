"""
Style Residual Router
=====================

Endpoints for style vector arithmetic and residual computation.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

router = APIRouter(prefix="/style", tags=["style"])


# Request/Response Models
class InterpolationRequest(BaseModel):
    translator_a_id: int
    translator_b_id: int
    alpha: float  # 0-1, where 0 = all A, 1 = all B


class StyleComparisonResponse(BaseModel):
    translator_a_id: int
    translator_b_id: int
    similarity: float
    ci_lower: float
    ci_upper: float
    n_samples_a: int
    n_samples_b: int


# ═══════════════════════════════════════════════════════════════════════════════
# MEANING ANCHOR ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/anchors/compute/{source_text_id}")
async def compute_meaning_anchor(
    request,
    source_text_id: int,
    method: str = Query(default="centroid", description="'centroid' or 'optimal_transport'")
):
    """
    Compute meaning anchor for a source text.

    The meaning anchor is the centroid (or OT barycenter) of all translations.
    """
    from engines import StyleResidualEngine
    pool = request.app.state.pool
    engine = StyleResidualEngine(pool)
    return await engine.compute_meaning_anchor_for_source(source_text_id, method)


@router.post("/anchors/recompute-all")
async def recompute_all_anchors(
    request,
    method: str = Query(default="centroid")
):
    """Recompute all meaning anchors."""
    from engines import StyleResidualEngine
    pool = request.app.state.pool
    engine = StyleResidualEngine(pool)
    return await engine.recompute_all_anchors(method)


@router.get("/anchors/{source_text_id}")
async def get_meaning_anchor(request, source_text_id: int):
    """Get meaning anchor for a source text."""
    pool = request.app.state.pool
    async with pool.acquire() as conn:
        anchor = await conn.fetchrow("""
            SELECT id, source_author, source_work, source_urn,
                   n_translations, computation_method, embedding_variance
            FROM meaning_anchors
            WHERE source_text_id = $1
        """, source_text_id)
        if not anchor:
            raise HTTPException(status_code=404, detail="Anchor not found")
        return dict(anchor)


# ═══════════════════════════════════════════════════════════════════════════════
# STYLE RESIDUAL ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/residuals/compute/{translation_id}")
async def compute_style_residual(request, translation_id: int):
    """
    Compute style residual for a translation.

    style_residual = translation_embedding - meaning_anchor
    """
    from engines import StyleResidualEngine
    pool = request.app.state.pool
    engine = StyleResidualEngine(pool)
    return await engine.compute_residual_for_translation(translation_id)


@router.post("/residuals/recompute-all")
async def recompute_all_residuals(request):
    """Recompute all style residuals."""
    from engines import StyleResidualEngine
    pool = request.app.state.pool
    engine = StyleResidualEngine(pool)
    return await engine.recompute_all_residuals()


@router.get("/residuals/{translation_id}")
async def get_style_residual(request, translation_id: int):
    """Get style residual for a translation."""
    pool = request.app.state.pool
    async with pool.acquire() as conn:
        residual = await conn.fetchrow("""
            SELECT id, meaning_anchor_id, translator_id,
                   residual_magnitude, semantic_purity
            FROM style_residuals
            WHERE translation_id = $1
        """, translation_id)
        if not residual:
            raise HTTPException(status_code=404, detail="Residual not found")
        return dict(residual)


# ═══════════════════════════════════════════════════════════════════════════════
# TRANSLATOR CENTROID ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/centroids/compute/{translator_id}")
async def compute_translator_centroid(request, translator_id: int, translator_name: str):
    """
    Compute style centroid for a translator.

    Centroid = average of all their style residuals.
    """
    from engines import StyleResidualEngine
    pool = request.app.state.pool
    engine = StyleResidualEngine(pool)
    return await engine.compute_translator_centroid(translator_id, translator_name)


@router.post("/centroids/recompute-all")
async def recompute_all_centroids(request):
    """Recompute all translator centroids."""
    from engines import StyleResidualEngine
    pool = request.app.state.pool
    engine = StyleResidualEngine(pool)
    return await engine.recompute_all_centroids()


@router.get("/centroids")
async def list_translator_centroids(request, limit: int = 50):
    """List all translator centroids."""
    pool = request.app.state.pool
    async with pool.acquire() as conn:
        centroids = await conn.fetch("""
            SELECT translator_id, translator_name, n_translations,
                   avg_residual_magnitude, style_consistency
            FROM translator_centroids
            ORDER BY n_translations DESC
            LIMIT $1
        """, limit)
        return [dict(c) for c in centroids]


@router.get("/centroids/{translator_id}")
async def get_translator_centroid(request, translator_id: int):
    """Get centroid for a specific translator."""
    pool = request.app.state.pool
    async with pool.acquire() as conn:
        centroid = await conn.fetchrow("""
            SELECT translator_id, translator_name, n_translations,
                   avg_residual_magnitude, style_consistency
            FROM translator_centroids
            WHERE translator_id = $1
        """, translator_id)
        if not centroid:
            raise HTTPException(status_code=404, detail="Centroid not found")
        return dict(centroid)


# ═══════════════════════════════════════════════════════════════════════════════
# STYLE ARITHMETIC ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/interpolate")
async def interpolate_styles(request, data: InterpolationRequest):
    """
    Interpolate between two translator styles.

    new_style = (1 - alpha) * style_A + alpha * style_B
    """
    from engines import StyleResidualEngine
    pool = request.app.state.pool
    engine = StyleResidualEngine(pool)
    style, metrics = await engine.interpolate_styles(
        data.translator_a_id,
        data.translator_b_id,
        data.alpha
    )
    return {
        "alpha": data.alpha,
        "style_norm": float(metrics.get("interpolation_norm", 0)),
        "translator_a_id": data.translator_a_id,
        "translator_b_id": data.translator_b_id
    }


@router.post("/compare")
async def compare_translators(
    request,
    translator_a_id: int,
    translator_b_id: int,
    n_bootstrap: int = Query(default=1000, le=10000)
):
    """
    Compare two translators with bootstrap confidence intervals.
    """
    from engines import StyleResidualEngine
    pool = request.app.state.pool
    engine = StyleResidualEngine(pool)
    return await engine.compare_translators(translator_a_id, translator_b_id, n_bootstrap)


@router.get("/similar/{translator_id}")
async def find_similar_styles(
    request,
    translator_id: int,
    top_k: int = Query(default=10, le=50)
):
    """Find translators with similar styles."""
    from engines import StyleResidualEngine
    pool = request.app.state.pool

    # Get translator centroid
    async with pool.acquire() as conn:
        centroid = await conn.fetchrow("""
            SELECT centroid_embedding
            FROM translator_centroids
            WHERE translator_id = $1
        """, translator_id)

        if not centroid:
            raise HTTPException(status_code=404, detail="Translator not found")

    import numpy as np
    style_vector = np.frombuffer(centroid['centroid_embedding'], dtype=np.float32)

    engine = StyleResidualEngine(pool)
    return await engine.find_similar_styles(style_vector, top_k)


# ═══════════════════════════════════════════════════════════════════════════════
# STYLE PROJECTION ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/projection/train")
async def train_style_projection(request, n_samples: int = 10000):
    """
    Train projection from high-dim residuals to interpretable style dimensions.
    """
    from engines import StyleResidualEngine
    pool = request.app.state.pool
    engine = StyleResidualEngine(pool)
    return await engine.train_style_projection(n_samples)


@router.get("/dimensions")
async def get_style_dimensions():
    """Get the 20 interpretable style dimensions."""
    from config.constants import STYLE_DIMENSIONS
    return {"dimensions": STYLE_DIMENSIONS, "count": len(STYLE_DIMENSIONS)}
