"""
Discovery Router
================

Endpoints for the 5 discovery programs and pattern detection.
"""

from fastapi import APIRouter, Request, Query
from typing import Dict, Any, Optional, List
from pydantic import BaseModel

router = APIRouter()


# Legacy data (kept for backward compatibility)
PATTERNS = [
    {"id": "p1", "order": 1, "type": "Syntactic", "pattern": "Genitive Absolute", "confidence": 0.92, "frequency": 15420, "description": "Participial clause in genitive case"},
    {"id": "p2", "order": 1, "type": "Syntactic", "pattern": "Accusative of Respect", "confidence": 0.88, "frequency": 8350, "description": "Accusative specifying the respect in which something is true"},
    {"id": "p3", "order": 2, "type": "Semantic", "pattern": "Ship of State Metaphor", "confidence": 0.85, "frequency": 234, "description": "Political community as a ship navigating"},
    {"id": "p4", "order": 2, "type": "Semantic", "pattern": "Body Politic", "confidence": 0.82, "frequency": 189, "description": "State as a human body with parts"},
    {"id": "p5", "order": 3, "type": "Thematic", "pattern": "Nostos Theme", "confidence": 0.91, "frequency": 456, "description": "Return home after long journey"},
    {"id": "p6", "order": 3, "type": "Thematic", "pattern": "Kleos vs Nostos", "confidence": 0.89, "frequency": 123, "description": "Glory vs homecoming tension"},
    {"id": "p7", "order": 4, "type": "Stylistic", "pattern": "Homeric Simile", "confidence": 0.95, "frequency": 2350, "description": "Extended epic simile pattern"},
    {"id": "p8", "order": 4, "type": "Stylistic", "pattern": "Ring Composition", "confidence": 0.87, "frequency": 567, "description": "ABCBA structural pattern"},
]

HYPOTHESES = [
    {"id": "h1", "title": "Homeric Authorship Unity", "description": "Statistical analysis of style variation across Iliad and Odyssey", "difficulty": "Advanced", "estimated_time": "40 hours"},
    {"id": "h2", "title": "Platonic Dialogue Evolution", "description": "Track stylistic changes from early to late dialogues", "difficulty": "Intermediate", "estimated_time": "20 hours"},
    {"id": "h3", "title": "Roman Reception of Greek Tragedy", "description": "Intertextual connections between Greek tragedians and Seneca", "difficulty": "Advanced", "estimated_time": "60 hours"},
    {"id": "h4", "title": "Function Word Evolution", "description": "How Greek particles changed from Homer to Koine", "difficulty": "Intermediate", "estimated_time": "30 hours"},
]


# Request models
class GenerateRequest(BaseModel):
    pattern_ids: list
    format: str = "latex"


class InterpolationRequest(BaseModel):
    work_ids: Optional[List[int]] = None
    threshold: float = 2.0
    require_negative_controls: bool = True


class ConceptDriftRequest(BaseModel):
    terms: Optional[List[str]] = None
    language: str = "greek"
    time_resolution: int = 50


class InfluenceRequest(BaseModel):
    min_similarity: float = 0.7
    require_chronological: bool = True


# ═══════════════════════════════════════════════════════════════════════════════
# LEGACY ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/")
async def root() -> Dict[str, Any]:
    return {
        "status": "ready",
        "description": "DISCOVERY - 5 automated discovery programs",
        "programs": [
            "interpolation_detection",
            "q_reconstruction",
            "concept_drift",
            "influence_mapping",
            "hypothesis_mining"
        ]
    }


@router.get("/patterns")
async def get_patterns() -> Dict[str, Any]:
    return {"patterns": PATTERNS}


@router.get("/hypotheses")
async def get_hypotheses() -> Dict[str, Any]:
    return {"hypotheses": HYPOTHESES}


@router.post("/generate")
async def generate_paper(data: GenerateRequest) -> Dict[str, Any]:
    """Generate research paper from patterns"""
    selected = [p for p in PATTERNS if p['id'] in data.pattern_ids]
    return {
        "status": "generated",
        "patterns_used": len(selected),
        "format": data.format,
        "preview": "\\section{Introduction}\nThis paper analyzes patterns in classical texts..."
    }


# ═══════════════════════════════════════════════════════════════════════════════
# PROGRAM 1: INTERPOLATION DETECTION
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/programs/interpolation")
async def run_interpolation_detection(request: Request, data: InterpolationRequest):
    """
    Program 1: Detect potential interpolations across works.

    Scans for passages that deviate significantly from surrounding style.
    Validates against shuffle and impostor baselines.
    """
    try:
        from engines import DiscoveryEngine
        pool = request.app.state.db_pool
        engine = DiscoveryEngine(pool)
        result = await engine.run_interpolation_detection(
            work_ids=data.work_ids,
            threshold=data.threshold,
            require_negative_controls=data.require_negative_controls
        )
        return {
            "program": result.program_name,
            "run_id": str(result.run_id),
            "status": result.status,
            "findings_count": len(result.findings),
            "hypotheses_generated": result.hypotheses_generated,
            "validated_count": result.validated_count,
            "runtime_seconds": result.runtime_seconds,
            "findings": result.findings[:20]  # Limit response size
        }
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# PROGRAM 2: Q RECONSTRUCTION
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/programs/q-reconstruction")
async def run_q_reconstruction(
    request: Request,
    learn_signatures: bool = True,
    reconstruct_all: bool = True
):
    """
    Program 2: Reconstruct Q source from synoptic parallels.

    Steps:
    1. Learn Matthew's and Luke's redaction signatures from triple tradition
    2. Apply inverse signatures to double tradition
    3. Generate confidence intervals via bootstrap
    """
    try:
        from engines import DiscoveryEngine
        pool = request.app.state.db_pool
        engine = DiscoveryEngine(pool)
        result = await engine.run_q_reconstruction(
            learn_signatures=learn_signatures,
            reconstruct_all=reconstruct_all
        )
        return {
            "program": result.program_name,
            "run_id": str(result.run_id),
            "status": result.status,
            "hypotheses_generated": result.hypotheses_generated,
            "runtime_seconds": result.runtime_seconds,
            "findings": result.findings
        }
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# PROGRAM 3: CONCEPT DRIFT
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/programs/concept-drift")
async def run_concept_drift(request: Request, data: ConceptDriftRequest):
    """
    Program 3: Track semantic drift of key concepts over time.

    Identifies terms with significant meaning changes across periods.
    """
    try:
        from engines import DiscoveryEngine
        pool = request.app.state.db_pool
        engine = DiscoveryEngine(pool)
        result = await engine.run_concept_drift_analysis(
            terms=data.terms,
            language=data.language,
            time_resolution=data.time_resolution
        )
        return {
            "program": result.program_name,
            "run_id": str(result.run_id),
            "status": result.status,
            "terms_analyzed": len(result.findings),
            "hypotheses_generated": result.hypotheses_generated,
            "runtime_seconds": result.runtime_seconds,
            "findings": result.findings
        }
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# PROGRAM 4: INFLUENCE MAPPING
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/programs/influence-mapping")
async def run_influence_mapping(request: Request, data: InfluenceRequest):
    """
    Program 4: Map author-to-author influence networks.

    Identifies likely influence relationships based on stylistic similarity,
    lexical overlap, and chronological plausibility.
    """
    try:
        from engines import DiscoveryEngine
        pool = request.app.state.db_pool
        engine = DiscoveryEngine(pool)
        result = await engine.run_influence_mapping(
            min_similarity=data.min_similarity,
            require_chronological=data.require_chronological
        )
        return {
            "program": result.program_name,
            "run_id": str(result.run_id),
            "status": result.status,
            "edges_found": len(result.findings),
            "hypotheses_generated": result.hypotheses_generated,
            "runtime_seconds": result.runtime_seconds,
            "findings": result.findings[:50]  # Limit response size
        }
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# PROGRAM 5: HYPOTHESIS MINING
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/programs/hypothesis-mining")
async def run_hypothesis_mining(
    request: Request,
    min_severity: float = 0.5,
    validate_all: bool = True
):
    """
    Program 5: Mine for novel hypotheses from all detected patterns.

    Aggregates findings from anomaly detection, style analysis,
    intertextual connections, and temporal patterns.
    """
    try:
        from engines import DiscoveryEngine
        pool = request.app.state.db_pool
        engine = DiscoveryEngine(pool)
        result = await engine.run_hypothesis_mining(
            min_severity=min_severity,
            validate_all=validate_all
        )
        return {
            "program": result.program_name,
            "run_id": str(result.run_id),
            "status": result.status,
            "hypotheses_generated": result.hypotheses_generated,
            "validated_count": result.validated_count,
            "runtime_seconds": result.runtime_seconds,
            "top_findings": result.findings[:20]
        }
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# ORCHESTRATION
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/programs/run-all")
async def run_all_programs(request: Request):
    """
    Run all 5 discovery programs sequentially.

    This is a long-running operation.
    """
    try:
        from engines import DiscoveryEngine
        pool = request.app.state.db_pool
        engine = DiscoveryEngine(pool)
        results = await engine.run_all_programs()

        return {
            "status": "completed",
            "programs_run": len(results),
            "results": {
                name: {
                    "run_id": str(r.run_id),
                    "hypotheses_generated": r.hypotheses_generated,
                    "validated_count": r.validated_count,
                    "runtime_seconds": r.runtime_seconds
                }
                for name, r in results.items()
            }
        }
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════════════════════
# STATUS AND HISTORY
# ═══════════════════════════════════════════════════════════════════════════════

@router.get("/programs/summary")
async def get_discovery_summary(request: Request):
    """Get summary of all discovery runs."""
    try:
        from engines import DiscoveryEngine
        pool = request.app.state.db_pool
        engine = DiscoveryEngine(pool)
        return await engine.get_discovery_summary()
    except Exception as e:
        return {"error": str(e)}


@router.get("/programs/history")
async def get_discovery_history(request: Request, limit: int = Query(default=20, le=100)):
    """Get recent discovery runs."""
    try:
        from engines import DiscoveryEngine
        pool = request.app.state.db_pool
        engine = DiscoveryEngine(pool)
        runs = await engine.get_recent_runs(limit)
        return {"runs": runs}
    except Exception as e:
        return {"error": str(e)}


@router.get("/programs/{run_id}")
async def get_discovery_run(request: Request, run_id: str):
    """Get details of a specific discovery run."""
    import uuid
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            run = await conn.fetchrow("""
                SELECT * FROM discovery_runs WHERE run_id = $1
            """, uuid.UUID(run_id))
            if not run:
                return {"error": "Run not found"}
            return dict(run)
    except Exception as e:
        return {"error": str(e)}
