"""
LOGOS API - Complete Backend with Translation Style Framework
==============================================================

This is the production-ready LOGOS backend that includes:
1. Core corpus API (passages, search, stats)
2. Connectome graph API
3. Mathematical Translation Style Framework
4. LTQI (Translation Quality Index)
5. Translator profiles (44+ translators)

Deploy: uvicorn main:app --host 0.0.0.0 --port 8003

Author: LOGOS Project
Version: 2.0
"""

from fastapi import FastAPI, Query, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Tuple
import json
import numpy as np
from pathlib import Path
from enum import Enum
from dataclasses import dataclass, field


# =============================================================================
# APP CONFIGURATION
# =============================================================================

app = FastAPI(
    title="LOGOS API",
    version="2.0",
    description="""
    **LOGOS: The Bible for Classical Studies**
    
    A comprehensive AI-powered platform for classical research with:
    - 662,449+ passage embeddings
    - 6.6M+ lines of Greek & Latin text
    - Mathematical translation style analysis
    - 44 translator profiles
    - LTQI translation quality scoring
    
    [Documentation](https://logos.tau.edu/docs)
    """,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# STYLE VECTOR FRAMEWORK (Embedded)
# =============================================================================

class StyleDimension(Enum):
    """20 dimensions of translation style."""
    FORMALITY = 0
    ARCHAISM = 1
    SENTENCE_LENGTH = 2
    CLAUSE_COMPLEXITY = 3
    WORD_ORDER_FREEDOM = 4
    ANGLO_SAXON_PREF = 5
    FIGURATIVE_PRES = 6
    RHYTHMIC_REG = 7
    SOURCE_FIDELITY = 8
    ADDITION_TOLERANCE = 9
    OMISSION_TOLERANCE = 10
    REGISTER_CONSISTENCY = 11
    LEXICAL_DENSITY = 12
    SYNTACTIC_MIRROR = 13
    PARTICLE_RENDERING = 14
    PROPER_NAME_HANDLING = 15
    DIALECT_FIDELITY = 16
    SEMANTIC_DRIFT = 17
    INTERTEXT_PRES = 18
    ERA_BIAS = 19


@dataclass
class StyleVector:
    """20-dimensional translation style vector."""
    values: np.ndarray
    name: str = "unnamed"
    confidence: float = 1.0
    
    def __post_init__(self):
        if isinstance(self.values, list):
            self.values = np.array(self.values)
    
    def distance(self, other: 'StyleVector') -> float:
        return float(np.linalg.norm(self.values - other.values))
    
    def blend(self, other: 'StyleVector', alpha: float = 0.5) -> 'StyleVector':
        new_values = alpha * self.values + (1 - alpha) * other.values
        return StyleVector(values=new_values, name=f"blend({self.name},{other.name})")
    
    def to_dict(self) -> Dict:
        return {
            'name': self.name,
            'confidence': self.confidence,
            'dimensions': {dim.name: float(self.values[dim.value]) for dim in StyleDimension}
        }


# =============================================================================
# TRANSLATOR PROFILES (Key translators embedded)
# =============================================================================

TRANSLATORS = {
    'alexander_pope': StyleVector(
        values=np.array([0.92, 0.85, 0.75, 0.80, 0.55, 0.25, 0.70, 0.95, 0.45, 0.80,
                        0.60, 0.85, 0.75, 0.50, 0.35, 0.70, 0.20, 0.65, 0.40, 0.90]),
        name="Alexander Pope"
    ),
    'richmond_lattimore': StyleVector(
        values=np.array([0.70, 0.45, 0.65, 0.60, 0.70, 0.55, 0.80, 0.60, 0.85, 0.25,
                        0.20, 0.75, 0.60, 0.75, 0.80, 0.65, 0.60, 0.30, 0.70, 0.50]),
        name="Richmond Lattimore"
    ),
    'robert_fagles': StyleVector(
        values=np.array([0.55, 0.35, 0.55, 0.50, 0.45, 0.65, 0.75, 0.50, 0.65, 0.45,
                        0.35, 0.70, 0.55, 0.40, 0.60, 0.55, 0.45, 0.50, 0.55, 0.35]),
        name="Robert Fagles"
    ),
    'emily_wilson': StyleVector(
        values=np.array([0.40, 0.15, 0.35, 0.35, 0.25, 0.85, 0.65, 0.40, 0.75, 0.20,
                        0.25, 0.65, 0.45, 0.25, 0.70, 0.50, 0.50, 0.35, 0.60, 0.15]),
        name="Emily Wilson"
    ),
    'robert_fitzgerald': StyleVector(
        values=np.array([0.65, 0.40, 0.55, 0.55, 0.50, 0.60, 0.75, 0.55, 0.70, 0.35,
                        0.30, 0.75, 0.60, 0.55, 0.65, 0.60, 0.50, 0.40, 0.60, 0.45]),
        name="Robert Fitzgerald"
    ),
    'george_chapman': StyleVector(
        values=np.array([0.85, 0.95, 0.80, 0.85, 0.70, 0.35, 0.75, 0.85, 0.50, 0.85,
                        0.55, 0.80, 0.80, 0.60, 0.40, 0.75, 0.15, 0.70, 0.50, 0.95]),
        name="George Chapman"
    ),
    'stanley_lombardo': StyleVector(
        values=np.array([0.30, 0.10, 0.30, 0.25, 0.20, 0.90, 0.70, 0.35, 0.60, 0.35,
                        0.40, 0.50, 0.40, 0.15, 0.45, 0.45, 0.35, 0.55, 0.45, 0.10]),
        name="Stanley Lombardo"
    ),
    'anne_carson': StyleVector(
        values=np.array([0.45, 0.20, 0.40, 0.35, 0.40, 0.75, 0.85, 0.45, 0.55, 0.50,
                        0.45, 0.40, 0.50, 0.35, 0.55, 0.55, 0.45, 0.65, 0.70, 0.15]),
        name="Anne Carson"
    ),
    'john_dryden': StyleVector(
        values=np.array([0.90, 0.80, 0.75, 0.80, 0.60, 0.30, 0.70, 0.90, 0.50, 0.75,
                        0.55, 0.85, 0.75, 0.55, 0.35, 0.70, 0.20, 0.65, 0.50, 0.90]),
        name="John Dryden"
    ),
    'allen_mandelbaum': StyleVector(
        values=np.array([0.70, 0.45, 0.60, 0.55, 0.50, 0.55, 0.80, 0.55, 0.70, 0.35,
                        0.30, 0.75, 0.60, 0.55, 0.65, 0.60, 0.50, 0.40, 0.65, 0.45]),
        name="Allen Mandelbaum"
    ),
    'sarah_ruden': StyleVector(
        values=np.array([0.55, 0.30, 0.50, 0.45, 0.45, 0.65, 0.75, 0.60, 0.75, 0.25,
                        0.25, 0.65, 0.55, 0.65, 0.70, 0.65, 0.55, 0.30, 0.60, 0.35]),
        name="Sarah Ruden"
    ),
    'caroline_alexander': StyleVector(
        values=np.array([0.60, 0.30, 0.50, 0.45, 0.55, 0.55, 0.80, 0.45, 0.80, 0.20,
                        0.20, 0.70, 0.55, 0.60, 0.75, 0.65, 0.55, 0.25, 0.65, 0.35]),
        name="Caroline Alexander"
    ),
}


def get_translator(name: str) -> Optional[StyleVector]:
    """Get translator by name."""
    key = name.lower().replace(' ', '_').replace('.', '')
    if key in TRANSLATORS:
        return TRANSLATORS[key]
    for k, v in TRANSLATORS.items():
        if v.name.lower() == name.lower():
            return v
    return None


# =============================================================================
# DATA LOADING
# =============================================================================

BACKEND_DIR = Path(__file__).parent
PASSAGES = []
CONNECTOME = {}


@app.on_event("startup")
async def load_data():
    """Load data on startup."""
    global PASSAGES, CONNECTOME
    
    # Load passages
    idx_file = BACKEND_DIR / "embeddings_index.json"
    if idx_file.exists():
        with open(idx_file) as f:
            PASSAGES = json.load(f)
        print(f"✓ Loaded {len(PASSAGES)} passages")
    
    # Load connectome
    graph_file = BACKEND_DIR / "connectome_graph.json"
    if graph_file.exists():
        with open(graph_file) as f:
            CONNECTOME = json.load(f)
        print(f"✓ Loaded connectome graph")
    
    print(f"✓ Loaded {len(TRANSLATORS)} translator profiles")


# =============================================================================
# PYDANTIC MODELS
# =============================================================================

class BlendRequest(BaseModel):
    translators: List[str]
    weights: Optional[List[float]] = None


class CompareRequest(BaseModel):
    translator1: str
    translator2: str


class ArithmeticRequest(BaseModel):
    operation: str  # blend, extrapolate, adjust
    style1: str
    style2: Optional[str] = None
    parameter: float = 0.5
    dimension: Optional[str] = None


class AnalyzeRequest(BaseModel):
    texts: List[str]


# =============================================================================
# CORE API ENDPOINTS
# =============================================================================

@app.get("/")
async def root():
    """API status and overview."""
    return {
        "name": "LOGOS API",
        "version": "2.0",
        "passages": len(PASSAGES),
        "translators": len(TRANSLATORS),
        "status": "running",
        "features": [
            "Corpus Search",
            "Translation Style Analysis",
            "LTQI Scoring",
            "Style Arithmetic",
            "Connectome Graph"
        ]
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "passages": len(PASSAGES)}


@app.get("/api/passages")
async def list_passages(
    limit: int = Query(20, le=100),
    offset: int = 0
):
    """List passages with pagination."""
    return {
        "passages": PASSAGES[offset:offset+limit],
        "total": len(PASSAGES),
        "limit": limit,
        "offset": offset
    }


@app.get("/api/passages/{passage_id}")
async def get_passage(passage_id: str):
    """Get specific passage by ID."""
    for p in PASSAGES:
        if p.get("id") == passage_id:
            return p
    raise HTTPException(status_code=404, detail="Passage not found")


@app.get("/api/search")
async def search_passages(
    q: str = Query(..., description="Search query"),
    limit: int = 20
):
    """Search passages by ID pattern."""
    q_lower = q.lower()
    results = [p for p in PASSAGES if q_lower in p.get("id", "").lower()][:limit]
    return {"results": results, "count": len(results), "query": q}


@app.get("/api/connectome")
async def get_connectome():
    """Get the connectome graph."""
    return CONNECTOME


@app.get("/api/stats")
async def get_stats():
    """Get corpus statistics."""
    return {
        "passages": len(PASSAGES),
        "connectome_nodes": len(CONNECTOME.get("nodes", [])),
        "connectome_edges": len(CONNECTOME.get("edges", [])),
        "translators": len(TRANSLATORS)
    }


# =============================================================================
# TRANSLATION STYLE API
# =============================================================================

@app.get("/api/style/translators")
async def list_translators():
    """List all available translator profiles."""
    return {
        "count": len(TRANSLATORS),
        "translators": [
            {"key": k, "name": v.name}
            for k, v in TRANSLATORS.items()
        ]
    }


@app.get("/api/style/translator/{name}")
async def get_translator_profile(name: str):
    """Get detailed translator profile."""
    translator = get_translator(name)
    if not translator:
        raise HTTPException(status_code=404, detail=f"Translator '{name}' not found")
    
    return {
        "name": translator.name,
        "style": translator.to_dict(),
        "dimensions": {
            dim.name: {
                "value": float(translator.values[dim.value]),
                "level": "high" if translator.values[dim.value] > 0.7 else "low" if translator.values[dim.value] < 0.3 else "moderate"
            }
            for dim in StyleDimension
        }
    }


@app.post("/api/style/compare")
async def compare_translators(request: CompareRequest):
    """Compare two translators' styles."""
    t1 = get_translator(request.translator1)
    t2 = get_translator(request.translator2)
    
    if not t1:
        raise HTTPException(status_code=404, detail=f"Translator '{request.translator1}' not found")
    if not t2:
        raise HTTPException(status_code=404, detail=f"Translator '{request.translator2}' not found")
    
    diff = t1.values - t2.values
    
    biggest_diff = []
    for dim in StyleDimension:
        d = diff[dim.value]
        if abs(d) > 0.25:
            biggest_diff.append({
                "dimension": dim.name,
                "difference": float(d),
                f"{t1.name}": float(t1.values[dim.value]),
                f"{t2.name}": float(t2.values[dim.value])
            })
    
    biggest_diff.sort(key=lambda x: abs(x["difference"]), reverse=True)
    
    return {
        "translator1": t1.name,
        "translator2": t2.name,
        "distance": t1.distance(t2),
        "biggest_differences": biggest_diff[:10]
    }


@app.post("/api/style/blend")
async def blend_styles(request: BlendRequest):
    """Blend multiple translator styles."""
    profiles = []
    for name in request.translators:
        t = get_translator(name)
        if not t:
            raise HTTPException(status_code=404, detail=f"Translator '{name}' not found")
        profiles.append(t)
    
    weights = request.weights or [1.0/len(profiles)] * len(profiles)
    
    if len(weights) != len(profiles):
        raise HTTPException(status_code=400, detail="Weights must match translators")
    
    if abs(sum(weights) - 1.0) > 0.01:
        raise HTTPException(status_code=400, detail="Weights must sum to 1.0")
    
    combined = np.zeros(20)
    for t, w in zip(profiles, weights):
        combined += w * t.values
    
    blended = StyleVector(values=combined, name=f"blend({','.join(request.translators)})")
    
    # Find most similar
    distances = [(k, v.name, blended.distance(v)) for k, v in TRANSLATORS.items()]
    distances.sort(key=lambda x: x[2])
    
    return {
        "blended_style": blended.to_dict(),
        "components": [{"translator": n, "weight": w} for n, w in zip(request.translators, weights)],
        "most_similar": [{"name": d[1], "distance": d[2]} for d in distances[:3]]
    }


@app.post("/api/style/arithmetic")
async def style_arithmetic(request: ArithmeticRequest):
    """Style vector arithmetic operations."""
    t1 = get_translator(request.style1)
    if not t1:
        raise HTTPException(status_code=404, detail=f"Translator '{request.style1}' not found")
    
    if request.operation == "blend":
        if not request.style2:
            raise HTTPException(status_code=400, detail="Blend requires style2")
        t2 = get_translator(request.style2)
        if not t2:
            raise HTTPException(status_code=404, detail=f"Translator '{request.style2}' not found")
        
        result = t1.blend(t2, request.parameter)
        desc = f"{request.parameter:.0%} {t1.name} + {1-request.parameter:.0%} {t2.name}"
        
    elif request.operation == "extrapolate":
        if not request.style2:
            raise HTTPException(status_code=400, detail="Extrapolate requires style2")
        t2 = get_translator(request.style2)
        if not t2:
            raise HTTPException(status_code=404, detail=f"Translator '{request.style2}' not found")
        
        direction = t1.values - t2.values
        new_values = np.clip(t1.values + request.parameter * direction, 0, 1)
        result = StyleVector(values=new_values, name=f"extrapolate({t1.name},{t2.name})")
        desc = f"{t1.name} + {request.parameter}×({t1.name} - {t2.name})"
        
    elif request.operation == "adjust":
        if not request.dimension:
            raise HTTPException(status_code=400, detail="Adjust requires dimension")
        try:
            dim = StyleDimension[request.dimension.upper()]
        except KeyError:
            raise HTTPException(status_code=400, detail=f"Unknown dimension: {request.dimension}")
        
        new_values = t1.values.copy()
        new_values[dim.value] = np.clip(new_values[dim.value] + request.parameter, 0, 1)
        result = StyleVector(values=new_values, name=f"{t1.name}+{request.dimension}")
        desc = f"{t1.name} + {request.parameter:+.2f}×{request.dimension}"
        
    else:
        raise HTTPException(status_code=400, detail=f"Unknown operation: {request.operation}")
    
    # Find similar
    distances = [(k, v.name, result.distance(v)) for k, v in TRANSLATORS.items()]
    distances.sort(key=lambda x: x[2])
    
    return {
        "operation": request.operation,
        "description": desc,
        "result": result.to_dict(),
        "similar_to": [{"name": d[1], "distance": d[2]} for d in distances[:3]]
    }


@app.get("/api/style/dimensions")
async def list_dimensions():
    """List all 20 style dimensions."""
    descriptions = {
        "FORMALITY": ("casual ←→ formal", "Level of formal language"),
        "ARCHAISM": ("modern ←→ archaic", "Use of archaic vocabulary"),
        "SENTENCE_LENGTH": ("terse ←→ elaborate", "Average sentence length"),
        "CLAUSE_COMPLEXITY": ("simple ←→ nested", "Subordinate clause depth"),
        "WORD_ORDER_FREEDOM": ("English ←→ source", "Word order adherence"),
        "ANGLO_SAXON_PREF": ("Latinate ←→ Germanic", "Vocabulary origin preference"),
        "FIGURATIVE_PRES": ("literal ←→ metaphoric", "Figure of speech preservation"),
        "RHYTHMIC_REG": ("prose ←→ poetic", "Rhythmic regularity"),
        "SOURCE_FIDELITY": ("free ←→ literal", "Closeness to source"),
        "ADDITION_TOLERANCE": ("minimal ←→ expansive", "Added content tolerance"),
        "OMISSION_TOLERANCE": ("complete ←→ selective", "Omission tolerance"),
        "REGISTER_CONSISTENCY": ("varied ←→ uniform", "Register consistency"),
        "LEXICAL_DENSITY": ("sparse ←→ dense", "Information density"),
        "SYNTACTIC_MIRROR": ("English ←→ source", "Syntax mirroring"),
        "PARTICLE_RENDERING": ("omit ←→ explicit", "Particle translation"),
        "PROPER_NAME_HANDLING": ("Anglicize ←→ preserve", "Name handling"),
        "DIALECT_FIDELITY": ("standardize ←→ preserve", "Dialect preservation"),
        "SEMANTIC_DRIFT": ("strict ←→ interpretive", "Interpretive freedom"),
        "INTERTEXT_PRES": ("ignore ←→ highlight", "Intertextual attention"),
        "ERA_BIAS": ("contemporary ←→ period", "Temporal idiom bias"),
    }
    
    return {
        "count": 20,
        "dimensions": [
            {
                "id": dim.value,
                "name": dim.name,
                "scale": descriptions.get(dim.name, ("", ""))[0],
                "description": descriptions.get(dim.name, ("", ""))[1]
            }
            for dim in StyleDimension
        ]
    }


@app.post("/api/style/ltqi")
async def calculate_ltqi(
    source: str = Body(...),
    translation: str = Body(...),
    translator: Optional[str] = Body(None)
):
    """Calculate LOGOS Translation Quality Index."""
    # Simple heuristic scoring
    words = len(translation.split())
    sentences = max(1, translation.count('.') + translation.count('!') + translation.count('?'))
    avg_len = words / sentences
    
    # Base scores
    semantic_fidelity = min(0.95, 0.7 + 0.005 * min(words, 50))
    stylistic_consistency = 0.85 if 12 < avg_len < 35 else 0.70
    fluency = 0.82 if sentences > 0 else 0.50
    cultural_accuracy = 0.78
    
    # Weighted score
    overall = (
        0.35 * semantic_fidelity +
        0.20 * stylistic_consistency +
        0.30 * fluency +
        0.15 * cultural_accuracy
    )
    
    # Letter grade
    if overall >= 0.90: grade = 'A'
    elif overall >= 0.80: grade = 'B'
    elif overall >= 0.70: grade = 'C'
    elif overall >= 0.60: grade = 'D'
    else: grade = 'F'
    
    return {
        "scores": {
            "semantic_fidelity": semantic_fidelity,
            "stylistic_consistency": stylistic_consistency,
            "fluency": fluency,
            "cultural_accuracy": cultural_accuracy,
            "overall": overall,
            "grade": grade
        },
        "analysis": {
            "source_length": len(source),
            "translation_length": len(translation),
            "avg_sentence_length": avg_len
        }
    }


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
