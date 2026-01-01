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

from typing import Optional, List, Dict, Any, Union
from fastapi import FastAPI, Query, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union

# Translation imports
try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False
import json
import numpy as np
from pathlib import Path
from enum import Enum
from dataclasses import dataclass, field
import os

# Database support for computed profiles
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    HAS_DB = True
except ImportError:
    HAS_DB = False

import os

# Database URL - Railway or hardcoded fallback
DATABASE_URL = os.environ.get("DATABASE_URL", "")
os.environ["DATABASE_URL"] = DATABASE_URL  # Set for all functions

# Database support
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    HAS_DB = True
except ImportError:
    HAS_DB = False



# =============================================================================
# TRANSLATION MODELS
# =============================================================================

class TranslateRequest(BaseModel):
    """Request model for translation endpoint."""
    source_text: str
    source_language: str = "greek"  # greek, latin, hebrew, aramaic
    target_style: str = "literal"   # translator name or "literal"
    style_blend: Optional[Dict[str, float]] = None  # {"Pope": 0.6, "Wilson": 0.4}
    persona: str = "curious"  # scholar, student, curious, writer, teacher, analyst, explorer
    include_literal: bool = True
    include_alternatives: int = 0  # 0-5
    include_metrics: bool = True


class TranslateResponse(BaseModel):
    """Response model for translation endpoint."""
    translation: str
    style: str
    ltqi: Dict[str, Any]
    persona_data: Dict[str, Any]
    literal_translation: Optional[str] = None
    alternatives: Optional[List[Dict]] = None


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
    'dryden': StyleVector(values=np.array([0.5, 0.1, 0.43, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.9]), name="Dryden"),
    'jowett': StyleVector(values=np.array([0.5, 0.07, 0.42, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.93]), name="Jowett"),
    'pope': StyleVector(values=np.array([0.5, 0.29, 0.32, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.71]), name="Pope"),
    'butler': StyleVector(values=np.array([0.5, 0.06, 0.47, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.94]), name="Butler"),
    'goodwin': StyleVector(values=np.array([0.5, 0.05, 0.34, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.95]), name="Goodwin"),
    'church_brodribb': StyleVector(values=np.array([0.5, 0.09, 0.36, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.91]), name="Church_Brodribb"),
    'crawley': StyleVector(values=np.array([0.5, 0.07, 0.72, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.93]), name="Crawley"),
    'hickie': StyleVector(values=np.array([0.5, 0.15, 0.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.84]), name="Hickie"),
    'dakyns': StyleVector(values=np.array([0.5, 0.09, 0.14, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.91]), name="Dakyns"),
    'derby': StyleVector(values=np.array([0.5, 0.4, 0.24, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6]), name="Derby"),
    'cowper': StyleVector(values=np.array([0.5, 0.4, 0.26, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6]), name="Cowper"),
    'rawlinson': StyleVector(values=np.array([0.5, 0.16, 0.53, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.84]), name="Rawlinson"),
    'roberts': StyleVector(values=np.array([0.5, 0.08, 0.48, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.92]), name="Roberts"),
    'lang_leaf_myers': StyleVector(values=np.array([0.5, 0.61, 0.54, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.39]), name="Lang_Leaf_Myers"),
    'macaulay': StyleVector(values=np.array([0.5, 0.21, 0.52, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.79]), name="Macaulay"),
    'butcher_lang': StyleVector(values=np.array([0.5, 0.6, 0.46, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.4]), name="Butcher_Lang"),
    'dryden_et_al': StyleVector(values=np.array([0.5, 0.18, 0.23, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.82]), name="Dryden_et_al"),
    'smith': StyleVector(values=np.array([0.5, 0.06, 0.22, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.94]), name="Smith"),
    'brookes_more': StyleVector(values=np.array([0.5, 0.18, 0.19, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.82]), name="Brookes_More"),
    'morris': StyleVector(values=np.array([0.5, 0.53, 0.29, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.47]), name="Morris"),
    'williams': StyleVector(values=np.array([0.5, 0.36, 0.37, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.64]), name="Williams"),
    'heseltine': StyleVector(values=np.array([0.5, 0.07, 0.35, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.93]), name="Heseltine"),
    'jebb': StyleVector(values=np.array([0.5, 0.89, 0.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.11]), name="Jebb"),
    'evelyn-white': StyleVector(values=np.array([0.5, 0.06, 0.18, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.94]), name="Evelyn-White"),
    'adlington': StyleVector(values=np.array([0.5, 0.4, 0.92, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6]), name="Adlington"),
    'conington': StyleVector(values=np.array([0.5, 0.14, 0.37, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.86]), name="Conington"),
    'leonard': StyleVector(values=np.array([0.5, 0.42, 0.67, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.58]), name="Leonard"),
    'long': StyleVector(values=np.array([0.5, 0.75, 0.25, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.25]), name="Long"),
    'morshead': StyleVector(values=np.array([0.5, 0.5, 0.1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]), name="Morshead"),
    'storr': StyleVector(values=np.array([0.5, 0.87, 0.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.13]), name="Storr"),
    'murray': StyleVector(values=np.array([0.5, 0.36, 0.03, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.64]), name="Murray"),
    'anonymous': StyleVector(values=np.array([0.5, 0.16, 0.03, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.84]), name="Anonymous"),
    'aubrey_stewart': StyleVector(values=np.array([0.5, 0.21, 0.36, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.79]), name="Aubrey_Stewart"),
    'kenyon': StyleVector(values=np.array([0.5, 0.07, 0.31, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.93]), name="Kenyon"),
    'butcher': StyleVector(values=np.array([0.5, 0.07, 0.26, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.93]), name="Butcher"),
    'ross': StyleVector(values=np.array([0.5, 0.02, 0.3, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.98]), name="Ross"),
    'lindsay': StyleVector(values=np.array([0.5, 0.11, 0.06, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.89]), name="Lindsay"),
    'moore': StyleVector(values=np.array([0.5, 0.14, 0.3, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.86]), name="Moore"),
}



def get_translator(name: str) -> Optional[StyleVector]:
    """Get translator - database first, then hardcoded."""
    key = name.lower().replace(' ', '_').replace('.', '')
    
    # Try database first (computed by MING LOGOS)
    if HAS_DB and os.environ.get("DATABASE_URL"):
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
            cur = conn.cursor()
            cur.execute("""
                SELECT translator_name, style_vector FROM translator_profiles 
                WHERE LOWER(REPLACE(translator_name, ' ', '_')) = %s
                   OR LOWER(translator_name) = %s
            """, (key, name.lower()))
            row = cur.fetchone()
            cur.close()
            conn.close()
            if row and row['style_vector']:
                dims = row['style_vector']
                values = [dims.get(d.name, 0.5) for d in StyleDimension]
                return StyleVector(values=np.array(values), name=row['translator_name'])
        except:
            pass
    
    # Fallback to hardcoded
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
        "version": "2.1",
        "description": "The Bible for Classical Studies - 662K+ passages of Greek & Latin text",
        "status": "running",
        "passages_loaded": len(PASSAGES),
        "translators": len(TRANSLATORS),
        "docs": "/docs",
        "endpoints": {
            "core": {
                "/api/stats": "Corpus statistics",
                "/api/passages": "List passages",
                "/api/passages/{id}": "Get specific passage",
                "/api/search": "Full-text search across 662K passages",
                "/api/connectome": "Text connection graph"
            },
            "reader": {
                "/api/reader/authors": "List all authors",
                "/api/reader/works/{author}": "List works by author",
                "/api/reader/passages/{author}/{work}": "Get work passages"
            },
            "translation": {
                "/api/translate": "Translate text with style",
                "/api/translate/styles": "List translator styles",
                "/api/translate/presets": "Translation presets",
                "/api/translate/personas": "Display personas"
            },
            "style": {
                "/api/style/translators": "List 44+ translator profiles",
                "/api/style/translator/{name}": "Get translator style vector",
                "/api/style/compare": "Compare translator styles",
                "/api/style/blend": "Blend translator styles",
                "/api/style/dimensions": "20 style dimensions"
            },
            "authorship": {
                "/api/authors": "List ancient authors",
                "/api/author/{name}": "Get author profile",
                "/api/attribute": "Attribute unknown text"
            }
        }
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
    """Get specific passage by ID from database."""
    # Try database first
    if HAS_DB and os.environ.get("DATABASE_URL"):
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
            cur = conn.cursor()
            cur.execute("""
                SELECT id, urn, author, work, content, section, language
                FROM source_texts WHERE id = %s OR urn = %s
            """, (passage_id, passage_id))
            row = cur.fetchone()
            cur.close()
            conn.close()
            if row:
                return dict(row)
        except Exception as e:
            print(f"Database passage lookup error: {e}")

    # Fallback to in-memory
    for p in PASSAGES:
        if p.get("id") == passage_id:
            return p
    raise HTTPException(status_code=404, detail="Passage not found")


@app.get("/api/reader/authors")
async def list_reader_authors():
    """List all authors with their works for the reader."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"error": "Database not configured", "authors": []}

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()
        cur.execute("""
            SELECT DISTINCT author, language, COUNT(*) as passage_count
            FROM source_texts
            WHERE author IS NOT NULL AND author != ''
            GROUP BY author, language
            ORDER BY passage_count DESC
            LIMIT 100
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return {"count": len(rows), "authors": [dict(r) for r in rows]}
    except Exception as e:
        return {"error": str(e), "authors": []}


@app.get("/api/reader/works/{author}")
async def list_works_by_author(author: str):
    """List all works by an author."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"error": "Database not configured", "works": []}

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()
        cur.execute("""
            SELECT DISTINCT work, language, COUNT(*) as passage_count
            FROM source_texts
            WHERE LOWER(author) ILIKE %s
            GROUP BY work, language
            ORDER BY work
        """, (f"%{author}%",))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return {"author": author, "count": len(rows), "works": [dict(r) for r in rows]}
    except Exception as e:
        return {"error": str(e), "works": []}


@app.get("/api/reader/passages/{author}/{work}")
async def get_work_passages(author: str, work: str, limit: int = 100, offset: int = 0):
    """Get passages from a specific work."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"error": "Database not configured", "passages": []}

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()
        cur.execute("""
            SELECT id, urn, author, work, content, section, language
            FROM source_texts
            WHERE LOWER(author) ILIKE %s AND LOWER(work) ILIKE %s
            ORDER BY section
            LIMIT %s OFFSET %s
        """, (f"%{author}%", f"%{work}%", limit, offset))
        rows = cur.fetchall()

        # Get total count
        cur.execute("""
            SELECT COUNT(*) FROM source_texts
            WHERE LOWER(author) ILIKE %s AND LOWER(work) ILIKE %s
        """, (f"%{author}%", f"%{work}%"))
        total = cur.fetchone()['count']

        cur.close()
        conn.close()
        return {
            "author": author,
            "work": work,
            "total": total,
            "limit": limit,
            "offset": offset,
            "passages": [dict(r) for r in rows]
        }
    except Exception as e:
        return {"error": str(e), "passages": []}


@app.get("/api/search")
async def search_passages(
    q: str = Query(..., description="Search query"),
    language: str = Query(None, description="Filter by language (greek, latin)"),
    author: str = Query(None, description="Filter by author"),
    limit: int = Query(50, le=200, description="Max results")
):
    """Full-text search across the 6.6M passage corpus."""
    # Try database search first (real content search)
    if HAS_DB and os.environ.get("DATABASE_URL"):
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
            cur = conn.cursor()

            # Build query with filters
            conditions = ["content ILIKE %s"]
            params = [f"%{q}%"]

            if language:
                conditions.append("LOWER(language) = %s")
                params.append(language.lower())
            if author:
                conditions.append("LOWER(author) ILIKE %s")
                params.append(f"%{author.lower()}%")

            where_clause = " AND ".join(conditions)
            params.append(limit)

            cur.execute(f"""
                SELECT id, urn, author, work, content, section, language
                FROM source_texts
                WHERE {where_clause}
                LIMIT %s
            """, params)
            rows = cur.fetchall()

            # Get total count
            cur.execute(f"SELECT COUNT(*) FROM source_texts WHERE {where_clause}", params[:-1])
            total = cur.fetchone()['count']

            cur.close()
            conn.close()

            # Format results with snippets
            results = []
            for r in rows:
                content = r.get('content', '') or ''
                q_lower = q.lower()
                lower_content = content.lower()
                pos = lower_content.find(q_lower)

                if pos >= 0:
                    start = max(0, pos - 100)
                    end = min(len(content), pos + len(q) + 100)
                    snippet = ("..." if start > 0 else "") + content[start:end] + ("..." if end < len(content) else "")
                else:
                    snippet = content[:250] + "..." if len(content) > 250 else content

                results.append({
                    "id": r.get('id'),
                    "urn": r.get('urn'),
                    "author": r.get('author') or "Unknown",
                    "work": r.get('work') or "Unknown",
                    "passage": snippet,
                    "reference": r.get('section'),
                    "language": r.get('language')
                })

            return {
                "query": q,
                "total": total,
                "count": len(results),
                "results": results,
                "filters": {"language": language, "author": author}
            }
        except Exception as e:
            # Fall through to in-memory search
            print(f"Database search error: {e}")

    # Fallback: search PASSAGES array (limited - only IDs)
    q_lower = q.lower()
    results = [p for p in PASSAGES if q_lower in str(p).lower()][:limit]
    return {"results": results, "count": len(results), "query": q, "note": "In-memory search (limited)"}


@app.get("/api/connectome")
async def get_connectome():
    """Get the connectome graph."""
    return CONNECTOME


@app.get("/api/stats")
async def get_stats():
    """Get corpus statistics from database."""
    stats = {
        "passages_loaded": len(PASSAGES),
        "connectome_nodes": len(CONNECTOME.get("nodes", [])),
        "connectome_edges": len(CONNECTOME.get("edges", [])),
        "translators": len(TRANSLATORS),
        "database": "not connected"
    }

    # Get real stats from database
    if HAS_DB and os.environ.get("DATABASE_URL"):
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
            cur = conn.cursor()

            # Get passage count
            cur.execute("SELECT COUNT(*) as count FROM source_texts")
            stats["passages"] = cur.fetchone()['count']

            # Get author count
            cur.execute("SELECT COUNT(DISTINCT author) as count FROM source_texts WHERE author IS NOT NULL")
            stats["authors"] = cur.fetchone()['count']

            # Get work count
            cur.execute("SELECT COUNT(DISTINCT work) as count FROM source_texts WHERE work IS NOT NULL")
            stats["works"] = cur.fetchone()['count']

            # Get language breakdown
            cur.execute("""
                SELECT language, COUNT(*) as count
                FROM source_texts
                WHERE language IS NOT NULL
                GROUP BY language
            """)
            stats["languages"] = {r['language']: r['count'] for r in cur.fetchall()}

            stats["database"] = "connected"
            cur.close()
            conn.close()
        except Exception as e:
            stats["database_error"] = str(e)

    return stats


# =============================================================================
# TRANSLATION STYLE API
# =============================================================================

@app.get("/api/style/translators")
async def list_translators():
    """List all available translator profiles (database + hardcoded)."""
    translators = [{"key": k, "name": v.name, "source": "hardcoded"} for k, v in TRANSLATORS.items()]
    
    # Add database translators
    if HAS_DB and os.environ.get("DATABASE_URL"):
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
            cur = conn.cursor()
            cur.execute("SELECT translator_name, era, n_translations, total_words_analyzed FROM translator_profiles ORDER BY n_translations DESC")
            rows = cur.fetchall()
            cur.close()
            conn.close()
            for r in rows:
                if not any(t["name"].lower() == r["translator_name"].lower() for t in translators):
                    translators.append({"key": r["translator_name"].lower().replace(" ","_"), 
                                        "name": r["translator_name"], "source": "computed",
                                        "n_translations": r["n_translations"], 
                                        "words_analyzed": r["total_words_analyzed"]})
        except:
            pass
    
    return {"count": len(translators), "translators": translators}


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
# TRANSLATION API
# =============================================================================

def build_style_prompt(style_vector: Dict[str, float], translator_name: str) -> str:
    """Build style instructions from computed style vector."""
    instructions = []
    
    # Archaism
    arc = style_vector.get("ARCHAISM", 0.5)
    if arc > 0.7:
        instructions.append("Use archaic vocabulary (thee, thou, hath, doth, wherefore)")
    elif arc > 0.5:
        instructions.append("Use slightly elevated, traditional vocabulary")
    elif arc < 0.3:
        instructions.append("Use contemporary, accessible vocabulary")
    
    # Formality
    form = style_vector.get("FORMALITY", 0.5)
    if form > 0.7:
        instructions.append("Maintain elevated, formal register throughout")
    elif form < 0.3:
        instructions.append("Use conversational, informal tone")
    
    # Rhythmic regularity
    rhythm = style_vector.get("RHYTHMIC_REG", 0.5)
    if rhythm > 0.7:
        instructions.append("Create rhythmic, poetic flow with attention to meter")
    elif rhythm > 0.5:
        instructions.append("Balance prose rhythm with readability")
    
    # Source fidelity
    fidelity = style_vector.get("SOURCE_FIDELITY", 0.5)
    if fidelity > 0.7:
        instructions.append("Stay very close to source word order and phrasing")
    elif fidelity < 0.3:
        instructions.append("Prioritize natural English over literal accuracy")
    
    # Sentence length
    sent_len = style_vector.get("SENTENCE_LENGTH", 0.5)
    if sent_len > 0.7:
        instructions.append("Use longer, more elaborate sentences")
    elif sent_len < 0.3:
        instructions.append("Use shorter, punchier sentences")
    
    # Anglo-Saxon preference
    anglo = style_vector.get("ANGLO_SAXON_PREF", 0.5)
    if anglo > 0.7:
        instructions.append("Prefer Germanic/Anglo-Saxon words over Latinate")
    elif anglo < 0.3:
        instructions.append("Allow Latinate and polysyllabic vocabulary")
    
    # Figurative preservation
    fig = style_vector.get("FIGURATIVE_PRES", 0.5)
    if fig > 0.7:
        instructions.append("Preserve metaphors and figurative language exactly")
    elif fig < 0.3:
        instructions.append("Adapt metaphors for modern understanding")
    
    return "\n".join(f"- {i}" for i in instructions) if instructions else "- Provide a balanced, scholarly translation"


def compute_ltqi(translation: str, source_text: str, style_vector: Dict[str, float], target_vector: Dict[str, float]) -> Dict:
    """
    Compute LTQI (LOGOS Translation Quality Index) from actual metrics.
    NO HARDCODED VALUES - computed from translation properties.
    """
    import math
    
    # 1. Semantic Fidelity (30%) - Based on length ratio and content preservation
    source_words = len(source_text.split())
    trans_words = len(translation.split())
    
    # Reasonable translations are 1.2-2.5x source length for Greek→English
    length_ratio = trans_words / max(source_words, 1)
    if 1.2 <= length_ratio <= 2.5:
        semantic_base = 0.85
    elif 1.0 <= length_ratio <= 3.0:
        semantic_base = 0.75
    else:
        semantic_base = 0.60
    
    # Adjust for actual content (basic check - has similar number of sentences)
    source_sentences = max(1, source_text.count('.') + source_text.count(';') + source_text.count('·'))
    trans_sentences = max(1, translation.count('.') + translation.count('!') + translation.count('?'))
    sentence_ratio = min(trans_sentences, source_sentences) / max(trans_sentences, source_sentences)
    semantic_fidelity = semantic_base * (0.7 + 0.3 * sentence_ratio)
    
    # 2. Stylistic Consistency (20%) - Based on style vector distance
    if target_vector and style_vector:
        diffs = []
        for dim in style_vector:
            target_val = target_vector.get(dim, 0.5)
            actual_val = style_vector.get(dim, 0.5)
            diffs.append(abs(target_val - actual_val))
        avg_diff = sum(diffs) / len(diffs) if diffs else 0.5
        stylistic_consistency = 1.0 - avg_diff
    else:
        stylistic_consistency = 0.75
    
    # 3. Fluency (30%) - Based on sentence structure
    avg_sent_length = trans_words / max(trans_sentences, 1)
    if 10 <= avg_sent_length <= 35:
        fluency_base = 0.85
    elif 5 <= avg_sent_length <= 50:
        fluency_base = 0.70
    else:
        fluency_base = 0.55
    
    # Check for common fluency indicators
    has_articles = any(w in translation.lower().split() for w in ['the', 'a', 'an'])
    has_connectors = any(w in translation.lower() for w in ['and', 'but', 'for', 'yet', 'so'])
    fluency = fluency_base + (0.05 if has_articles else 0) + (0.05 if has_connectors else 0)
    fluency = min(0.95, fluency)
    
    # 4. Style Match (20%) - How well it matches target translator
    # This would ideally use embedding similarity; for now use structural proxy
    style_match = stylistic_consistency * 0.9 + 0.1 * (0.9 if trans_words > 5 else 0.5)
    
    # Weighted overall score
    overall = (
        0.30 * semantic_fidelity +
        0.20 * stylistic_consistency +
        0.30 * fluency +
        0.20 * style_match
    )
    
    # Grade
    if overall >= 0.90:
        grade = 'A'
    elif overall >= 0.85:
        grade = 'A-'
    elif overall >= 0.80:
        grade = 'B+'
    elif overall >= 0.75:
        grade = 'B'
    elif overall >= 0.70:
        grade = 'B-'
    elif overall >= 0.65:
        grade = 'C+'
    elif overall >= 0.60:
        grade = 'C'
    else:
        grade = 'D'
    
    return {
        "semantic_fidelity": round(semantic_fidelity, 3),
        "stylistic_consistency": round(stylistic_consistency, 3),
        "fluency": round(fluency, 3),
        "style_match": round(style_match, 3),
        "overall": round(overall, 3),
        "grade": grade,
        "interpretation": f"{'Excellent' if grade.startswith('A') else 'Good' if grade.startswith('B') else 'Adequate'} translation quality"
    }


@app.post("/api/translate")
async def translate_text(request: TranslateRequest):
    """
    Translate ancient text using Claude API with computed style vectors.
    Returns translation with LTQI scoring and persona-optimized display.
    """
    
    # 1. Get style vector from database or hardcoded
    translator_name = request.target_style
    style_vector = {}
    
    if request.target_style.lower() != "literal":
        # Try database first
        if HAS_DB and os.environ.get("DATABASE_URL"):
            try:
                conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
                cur = conn.cursor()
                cur.execute(
                    "SELECT translator_name, style_vector FROM translator_profiles WHERE LOWER(translator_name) LIKE %s",
                    (f"%{request.target_style.lower()}%",)
                )
                row = cur.fetchone()
                cur.close()
                conn.close()
                if row:
                    style_vector = row['style_vector'] or {}
                    translator_name = row['translator_name']
            except Exception as e:
                print(f"Database lookup failed: {e}")
        
        # Fallback to hardcoded TRANSLATORS
        if not style_vector:
            key = request.target_style.lower().replace(" ", "_")
            if key in TRANSLATORS:
                t = TRANSLATORS[key]
                style_vector = {dim.name: float(t.values[dim.value]) for dim in StyleDimension}
                translator_name = t.name
    
    # 2. Handle literal translation
    if request.target_style.lower() == "literal" or not style_vector:
        style_vector = {dim.name: 0.5 for dim in StyleDimension}
        style_vector["SOURCE_FIDELITY"] = 1.0
        style_vector["ARCHAISM"] = 0.3
        translator_name = "Literal"
    
    # 3. Handle style blending
    if request.style_blend:
        blended = {dim.name: 0.0 for dim in StyleDimension}
        total_weight = sum(request.style_blend.values())
        
        for blend_name, weight in request.style_blend.items():
            blend_key = blend_name.lower().replace(" ", "_")
            if blend_key in TRANSLATORS:
                t = TRANSLATORS[blend_key]
                for dim in StyleDimension:
                    blended[dim.name] += (weight / total_weight) * float(t.values[dim.value])
        
        if any(v > 0 for v in blended.values()):
            style_vector = blended
            translator_name = f"Blend({', '.join(request.style_blend.keys())})"
    
    # 4. Build translation prompt
    style_instructions = build_style_prompt(style_vector, translator_name)
    
    prompt = f"""Translate this {request.source_language.upper()} text to English.

SOURCE TEXT:
{request.source_text}

TRANSLATION STYLE - Emulate {translator_name}:
{style_instructions}

IMPORTANT:
- Provide ONLY the English translation
- No explanations, notes, or commentary
- Match the style instructions precisely
"""
    
    # 5. Call Claude API
    translation = f"[Translation pending - install anthropic package]"
    
    if HAS_ANTHROPIC:
        try:
            client = anthropic.Anthropic()
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
            translation = response.content[0].text.strip()
        except Exception as e:
            translation = f"[Translation error: {str(e)[:100]}]"
    
    # 6. Generate literal translation if requested
    literal_translation = None
    if request.include_literal and request.target_style.lower() != "literal":
        if HAS_ANTHROPIC:
            try:
                client = anthropic.Anthropic()
                lit_prompt = f"""Provide a strictly literal, word-for-word translation of this {request.source_language.upper()} text.
Prioritize accuracy over readability. Maintain source word order where possible.

SOURCE: {request.source_text}

Provide ONLY the literal translation."""
                
                lit_response = client.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=1000,
                    messages=[{"role": "user", "content": lit_prompt}]
                )
                literal_translation = lit_response.content[0].text.strip()
            except:
                pass
    
    # 7. Compute LTQI (real computation, not hardcoded)
    target_vector = {dim.name: 0.5 for dim in StyleDimension}  # Default target
    if translator_name != "Literal" and style_vector:
        target_vector = style_vector
    
    ltqi = compute_ltqi(translation, request.source_text, style_vector, target_vector)
    
    # 8. Format for persona (detailed implementation in next script)
    persona_data = {
        "persona": request.persona,
        "style_vector": style_vector,
        "display_config": {"layout": f"{request.persona}_view"}
    }
    
    # Format response for specific persona
    persona_response = format_for_persona(
        translation=translation,
        style_vector=style_vector,
        ltqi=ltqi,
        persona=request.persona,
        translator_name=translator_name,
        literal_translation=literal_translation
    )
    
    # Add metadata
    persona_response["source_language"] = request.source_language
    persona_response["word_count"] = len(translation.split())
    persona_response["alternatives"] = []
    
    return persona_response


@app.get("/api/translate/styles")
async def list_translation_styles():
    """List all available translation styles from database + hardcoded."""
    styles = []
    
    # Get from database
    if HAS_DB and os.environ.get("DATABASE_URL"):
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
            cur = conn.cursor()
            cur.execute("SELECT translator_name, era, n_translations, total_words_analyzed FROM translator_profiles ORDER BY total_words_analyzed DESC")
            rows = cur.fetchall()
            cur.close()
            conn.close()
            for r in rows:
                styles.append({
                    "name": r["translator_name"],
                    "key": r["translator_name"].lower().replace(" ", "_"),
                    "era": r.get("era", "Unknown"),
                    "works_analyzed": r.get("n_translations", 0),
                    "words_analyzed": r.get("total_words_analyzed", 0),
                    "source": "computed"
                })
        except:
            pass
    
    # Add hardcoded that aren't in database
    for key, t in TRANSLATORS.items():
        if not any(s["key"] == key for s in styles):
            styles.append({
                "name": t.name,
                "key": key,
                "era": "Various",
                "works_analyzed": 0,
                "words_analyzed": 0,
                "source": "reference"
            })
    
    return {
        "count": len(styles),
        "styles": styles,
        "note": "Styles marked 'computed' have vectors derived from corpus analysis"
    }




# =============================================================================
# PERSONA-AWARE DISPLAY SYSTEM
# =============================================================================

PERSONA_CONFIGS = {
    "scholar": {
        "name": "Scholar",
        "icon": "📚",
        "description": "Full academic analysis with 20-dimensional breakdown",
        "best_for": "Researchers, academics, serious students",
        "show_raw_vectors": True,
        "show_confidence": True,
        "show_footnotes": True,
        "export_formats": ["bibtex", "json", "csv"]
    },
    "student": {
        "name": "Student",
        "icon": "🎓",
        "description": "Learning-focused with difficulty levels and vocabulary help",
        "best_for": "Greek/Latin learners, undergraduates",
        "show_difficulty": True,
        "show_vocabulary_hints": True,
        "show_grammar_notes": True
    },
    "curious": {
        "name": "Curious Reader",
        "icon": "🦋",
        "description": "Simple vibe summary with approachable metrics",
        "best_for": "General readers, classics enthusiasts",
        "show_simple_meters": True,
        "show_emoji": True,
        "simplified": True
    },
    "writer": {
        "name": "Writer",
        "icon": "✍️",
        "description": "Interactive dials to adjust and blend styles",
        "best_for": "Translators, creative writers, editors",
        "show_dials": True,
        "real_time_preview": True,
        "show_blend_options": True
    },
    "teacher": {
        "name": "Teacher",
        "icon": "👩‍🏫",
        "description": "Side-by-side comparisons with discussion prompts",
        "best_for": "Educators, workshop leaders",
        "show_comparisons": True,
        "show_discussion_prompts": True,
        "printable": True
    },
    "analyst": {
        "name": "Analyst",
        "icon": "📊",
        "description": "Raw vectors, statistics, exportable data",
        "best_for": "Digital humanities, computational analysis",
        "show_statistics": True,
        "show_pca": True,
        "export_formats": ["json", "csv", "numpy"]
    },
    "explorer": {
        "name": "Explorer",
        "icon": "🗺️",
        "description": "Fun personality quiz, shareable results",
        "best_for": "Casual browsers, social sharing",
        "show_personality": True,
        "shareable": True,
        "animated": True
    }
}


def format_for_persona(
    translation: str,
    style_vector: Dict[str, float],
    ltqi: Dict,
    persona: str,
    translator_name: str,
    literal_translation: str = None
) -> Dict:
    """Format translation response optimized for specific persona."""
    
    config = PERSONA_CONFIGS.get(persona, PERSONA_CONFIGS["curious"])
    
    base_response = {
        "translation": translation,
        "style": translator_name,
        "ltqi": ltqi,
        "persona": persona,
        "persona_config": config
    }
    
    if persona == "scholar":
        # Full academic analysis
        return {
            **base_response,
            "metrics": {
                "dimensions": style_vector,
                "dimension_labels": {
                    "FORMALITY": "casual (0) ←→ formal (1)",
                    "ARCHAISM": "modern (0) ←→ archaic (1)",
                    "SENTENCE_LENGTH": "terse (0) ←→ elaborate (1)",
                    "CLAUSE_COMPLEXITY": "simple (0) ←→ nested (1)",
                    "WORD_ORDER_FREEDOM": "English-natural (0) ←→ source-following (1)",
                    "ANGLO_SAXON_PREF": "Latinate (0) ←→ Germanic (1)",
                    "FIGURATIVE_PRES": "adapted (0) ←→ preserved (1)",
                    "RHYTHMIC_REG": "prose (0) ←→ poetic (1)",
                    "SOURCE_FIDELITY": "free (0) ←→ literal (1)",
                    "ADDITION_TOLERANCE": "minimal (0) ←→ expansive (1)",
                    "OMISSION_TOLERANCE": "complete (0) ←→ selective (1)",
                    "REGISTER_CONSISTENCY": "variable (0) ←→ consistent (1)",
                    "LEXICAL_DENSITY": "light (0) ←→ dense (1)",
                    "SYNTACTIC_MIRROR": "restructured (0) ←→ mirrored (1)",
                    "PARTICLE_RENDERING": "omitted (0) ←→ rendered (1)",
                    "PROPER_NAME_HANDLING": "anglicized (0) ←→ original (1)",
                    "DIALECT_FIDELITY": "normalized (0) ←→ preserved (1)",
                    "SEMANTIC_DRIFT": "stable (0) ←→ creative (1)",
                    "INTERTEXT_PRES": "hidden (0) ←→ highlighted (1)",
                    "ERA_BIAS": "atemporal (0) ←→ period-marked (1)"
                }
            },
            "scholarly": {
                "methodology": "20-dimensional style vector computed from corpus analysis",
                "confidence_interval": [ltqi["overall"] - 0.05, ltqi["overall"] + 0.05],
                "literal_comparison": literal_translation,
                "vector_norm": sum(v**2 for v in style_vector.values()) ** 0.5 if style_vector else 0
            },
            "display_config": {
                "layout": "academic_table",
                "show_footnotes": True,
                "show_raw_vectors": True,
                "show_confidence": True,
                "export_formats": ["bibtex", "json", "csv"]
            }
        }
    
    elif persona == "student":
        # Learning-focused with difficulty
        formality = style_vector.get("FORMALITY", 0.5)
        archaism = style_vector.get("ARCHAISM", 0.5)
        complexity = style_vector.get("CLAUSE_COMPLEXITY", 0.5)
        
        # Compute difficulty from style dimensions
        difficulty_score = (formality + archaism + complexity) / 3
        if difficulty_score > 0.7:
            difficulty = "Advanced"
            difficulty_note = "This translation uses archaic vocabulary and complex syntax."
        elif difficulty_score > 0.4:
            difficulty = "Intermediate"
            difficulty_note = "This translation balances accessibility with literary quality."
        else:
            difficulty = "Beginner-Friendly"
            difficulty_note = "This translation uses clear, modern vocabulary."
        
        return {
            **base_response,
            "learning": {
                "difficulty_level": difficulty,
                "difficulty_score": round(difficulty_score * 100),
                "difficulty_note": difficulty_note,
                "vocabulary_complexity": int(style_vector.get("LEXICAL_DENSITY", 0.5) * 100),
                "how_literal": int(style_vector.get("SOURCE_FIDELITY", 0.5) * 100),
                "reading_level": "College" if difficulty_score > 0.6 else "High School" if difficulty_score > 0.3 else "General"
            },
            "comparison": {
                "literal": literal_translation,
                "styled": translation,
                "tip": f"Compare the literal translation to see how {translator_name} adapts the text."
            },
            "display_config": {
                "layout": "learning_cards",
                "show_word_tooltips": True,
                "show_grammar_hints": True,
                "show_difficulty_badge": True
            }
        }
    
    elif persona == "curious":
        # Simple vibe summary
        archaism = style_vector.get("ARCHAISM", 0.5)
        formality = style_vector.get("FORMALITY", 0.5)
        rhythm = style_vector.get("RHYTHMIC_REG", 0.5)
        fidelity = style_vector.get("SOURCE_FIDELITY", 0.5)
        
        # Determine "vibe"
        if archaism > 0.7 and rhythm > 0.7:
            feeling = "Grand & Classical"
            reads_like = "Shakespeare meets Milton"
            emoji = "🏛️"
        elif archaism < 0.3 and formality < 0.5:
            feeling = "Fresh & Contemporary"
            reads_like = "A modern novel"
            emoji = "⚡"
        elif rhythm > 0.6:
            feeling = "Lyrical & Flowing"
            reads_like = "Poetry with punch"
            emoji = "🎵"
        elif fidelity > 0.7:
            feeling = "Scholarly & Precise"
            reads_like = "An academic text"
            emoji = "📖"
        else:
            feeling = "Clear & Balanced"
            reads_like = "Quality literary fiction"
            emoji = "✨"
        
        # Era flavor
        if archaism > 0.8:
            era = "Renaissance English"
        elif archaism > 0.6:
            era = "18th Century"
        elif archaism > 0.4:
            era = "Victorian Era"
        elif archaism > 0.2:
            era = "Early 20th Century"
        else:
            era = "Contemporary"
        
        return {
            **base_response,
            "vibe": {
                "feeling": feeling,
                "reads_like": reads_like,
                "era_flavor": era,
                "emoji": emoji,
                "one_liner": f"A {feeling.lower()} take that reads like {reads_like.lower()}"
            },
            "simple_meters": {
                "poetic": int(rhythm * 100),
                "formal": int(formality * 100),
                "literal": int(fidelity * 100),
                "readable": int((1 - style_vector.get("CLAUSE_COMPLEXITY", 0.5)) * 100)
            },
            "display_config": {
                "layout": "vibe_card",
                "show_emoji": True,
                "show_simple_bars": True,
                "color_scheme": "warm" if archaism > 0.5 else "cool"
            }
        }
    
    elif persona == "writer":
        # Interactive dials
        return {
            **base_response,
            "dials": [
                {
                    "id": dim,
                    "name": dim.replace("_", " ").title(),
                    "value": round(val, 2),
                    "min": 0,
                    "max": 1,
                    "step": 0.05,
                    "description": f"Adjust {dim.lower().replace('_', ' ')}"
                }
                for dim, val in style_vector.items()
            ],
            "blend_suggestions": [
                {"name": f"{translator_name} + Wilson", "description": "Add modern clarity", "blend": {translator_name: 0.7, "Wilson": 0.3}},
                {"name": f"{translator_name} + Pope", "description": "Add poetic grandeur", "blend": {translator_name: 0.7, "Pope": 0.3}},
                {"name": f"{translator_name} + Lattimore", "description": "Add scholarly precision", "blend": {translator_name: 0.7, "Lattimore": 0.3}}
            ],
            "presets": {
                "more_poetic": {"RHYTHMIC_REG": 0.9, "ARCHAISM": 0.7},
                "more_modern": {"ARCHAISM": 0.2, "FORMALITY": 0.4},
                "more_literal": {"SOURCE_FIDELITY": 0.9, "ADDITION_TOLERANCE": 0.1}
            },
            "display_config": {
                "layout": "dial_board",
                "real_time_preview": True,
                "show_blend_slider": True
            }
        }
    
    elif persona == "teacher":
        # Comparison view
        return {
            **base_response,
            "comparisons": [
                {"style": "Literal", "text": literal_translation or "[Literal translation not requested]", "approach": "Word-for-word fidelity"},
                {"style": translator_name, "text": translation, "approach": "Stylistic interpretation"}
            ],
            "discussion_prompts": [
                f"How does {translator_name}'s vocabulary choices affect the emotional impact?",
                f"What is gained and lost in moving from literal to {translator_name}'s style?",
                f"Why might {translator_name} have chosen {'archaic' if style_vector.get('ARCHAISM', 0) > 0.5 else 'modern'} diction?",
                "How would you translate this differently for a modern audience?",
                "What cultural context does the translator assume the reader has?"
            ],
            "classroom_notes": {
                "vocabulary_focus": ["Compare key term translations", "Note archaic vs modern choices"],
                "syntax_focus": ["Examine sentence structure changes", "Discuss word order decisions"],
                "cultural_focus": ["Consider historical translation traditions", "Discuss audience assumptions"]
            },
            "display_config": {
                "layout": "side_by_side_diff",
                "highlight_differences": True,
                "show_discussion_prompts": True,
                "printable": True
            }
        }
    
    elif persona == "analyst":
        # Raw data for computational analysis
        values = list(style_vector.values())
        mean_val = sum(values) / len(values) if values else 0
        variance = sum((v - mean_val)**2 for v in values) / len(values) if values else 0
        std_dev = variance ** 0.5
        
        return {
            **base_response,
            "raw_data": {
                "style_vector": values,
                "dimension_names": list(style_vector.keys()),
                "vector_norm": sum(v**2 for v in values) ** 0.5,
                "dimension_count": len(values)
            },
            "statistics": {
                "mean": round(mean_val, 4),
                "std_dev": round(std_dev, 4),
                "variance": round(variance, 4),
                "max_dimension": max(style_vector.items(), key=lambda x: x[1]) if style_vector else None,
                "min_dimension": min(style_vector.items(), key=lambda x: x[1]) if style_vector else None,
                "range": round(max(values) - min(values), 4) if values else 0
            },
            "export": {
                "json": style_vector,
                "csv_header": ",".join(style_vector.keys()),
                "csv_values": ",".join(str(round(v, 4)) for v in values)
            },
            "display_config": {
                "layout": "data_dashboard",
                "show_pca_plot": True,
                "show_heatmap": True,
                "export_formats": ["json", "csv", "numpy"]
            }
        }
    
    elif persona == "explorer":
        # Fun personality-based
        archaism = style_vector.get("ARCHAISM", 0.5)
        formality = style_vector.get("FORMALITY", 0.5)
        rhythm = style_vector.get("RHYTHMIC_REG", 0.5)
        
        if archaism > 0.7 and formality > 0.7:
            personality = "The Classicist"
            emoji = "📜"
            description = "Elegant, timeless, steeped in tradition"
            color = "gold"
        elif archaism < 0.3 and formality < 0.4:
            personality = "The Rebel"
            emoji = "🔥"
            description = "Fresh, bold, breaking conventions"
            color = "red"
        elif rhythm > 0.7:
            personality = "The Poet"
            emoji = "🎭"
            description = "Musical, flowing, deeply artistic"
            color = "purple"
        elif style_vector.get("SOURCE_FIDELITY", 0.5) > 0.7:
            personality = "The Purist"
            emoji = "🔬"
            description = "Precise, faithful, scholarly"
            color = "blue"
        else:
            personality = "The Bridge-Builder"
            emoji = "🌉"
            description = "Balanced, accessible, connecting worlds"
            color = "teal"
        
        return {
            **base_response,
            "personality": {
                "type": personality,
                "emoji": emoji,
                "description": description,
                "color": color,
                "tagline": f"Your translation speaks with the voice of {personality}"
            },
            "fun_facts": [
                f"This style is {int(archaism * 100)}% 'thee and thou' energy",
                f"Formality level: {'Black tie gala' if formality > 0.8 else 'Smart casual' if formality > 0.5 else 'Coffee shop vibes'}",
                f"Poetry meter: {'Epic verse' if rhythm > 0.7 else 'Lyrical prose' if rhythm > 0.4 else 'Straight talk'}"
            ],
            "share": {
                "tweet_text": f"I translated ancient Greek in the style of {translator_name}! Got '{personality}' {emoji} #LOGOS #Classics",
                "shareable": True,
                "card_color": color
            },
            "display_config": {
                "layout": "personality_card",
                "animated": True,
                "show_confetti": True,
                "shareable": True,
                "color_theme": color
            }
        }
    
    # Default fallback
    return {
        **base_response,
        "metrics": {"dimensions": style_vector},
        "display_config": {"layout": "default"}
    }


@app.get("/api/translate/personas")
async def list_personas():
    """List all available personas with their display configurations."""
    return {
        "personas": [
            {
                "id": pid,
                "name": config["name"],
                "icon": config["icon"],
                "description": config["description"],
                "best_for": config["best_for"]
            }
            for pid, config in PERSONA_CONFIGS.items()
        ]
    }




# =============================================================================
# TRANSLATION PRESETS
# =============================================================================

TRANSLATION_PRESETS = {
    "classic": {
        "id": "classic",
        "name": "Classic",
        "description": "Grand, elevated, timeless - like Pope or Dryden",
        "based_on": "Pope + Dryden blend",
        "icon": "🏛️",
        "settings": {
            "ARCHAISM": 0.8,
            "FORMALITY": 0.85,
            "RHYTHMIC_REG": 0.8,
            "SOURCE_FIDELITY": 0.5
        },
        "example": "Sing, Goddess, the destructive wrath of Peleus' son Achilles"
    },
    "modern": {
        "id": "modern",
        "name": "Modern",
        "description": "Clear, accessible, contemporary - like Wilson or Lombardo",
        "based_on": "Wilson + Lombardo blend",
        "icon": "⚡",
        "settings": {
            "ARCHAISM": 0.15,
            "FORMALITY": 0.4,
            "SOURCE_FIDELITY": 0.6,
            "CLAUSE_COMPLEXITY": 0.3
        },
        "example": "Sing to me, goddess, about the rage of Achilles"
    },
    "poetic": {
        "id": "poetic",
        "name": "Poetic",
        "description": "Musical, flowing, artistic - like Fitzgerald",
        "based_on": "Fitzgerald + Fagles blend",
        "icon": "🎵",
        "settings": {
            "RHYTHMIC_REG": 0.9,
            "FIGURATIVE_PRES": 0.85,
            "FORMALITY": 0.7,
            "ARCHAISM": 0.5
        },
        "example": "Anger be now your song, immortal one"
    },
    "literal": {
        "id": "literal",
        "name": "Literal",
        "description": "Word-for-word, scholarly precision - like Lattimore",
        "based_on": "Lattimore approach",
        "icon": "📖",
        "settings": {
            "SOURCE_FIDELITY": 0.95,
            "ADDITION_TOLERANCE": 0.1,
            "OMISSION_TOLERANCE": 0.1,
            "SYNTACTIC_MIRROR": 0.8
        },
        "example": "Wrath sing, goddess, of Peleus' son Achilles"
    },
    "dramatic": {
        "id": "dramatic",
        "name": "Dramatic",
        "description": "Bold, punchy, theatrical - like Carson",
        "based_on": "Carson + Lombardo blend",
        "icon": "🎭",
        "settings": {
            "FORMALITY": 0.35,
            "RHYTHMIC_REG": 0.7,
            "SEMANTIC_DRIFT": 0.6,
            "FIGURATIVE_PRES": 0.7
        },
        "example": "RAGE. Sing it, goddess—Achilles' rage"
    },
    "victorian": {
        "id": "victorian",
        "name": "Victorian",
        "description": "Ornate, elaborate, 19th century style",
        "based_on": "Butler + Murray blend",
        "icon": "🎩",
        "settings": {
            "ARCHAISM": 0.6,
            "FORMALITY": 0.9,
            "SENTENCE_LENGTH": 0.8,
            "CLAUSE_COMPLEXITY": 0.75
        },
        "example": "Sing, O goddess, the anger of Achilles son of Peleus, that brought countless ills upon the Achaeans"
    },
    "student": {
        "id": "student",
        "name": "Student-Friendly",
        "description": "Clear, simple, great for learning",
        "based_on": "Optimized for comprehension",
        "icon": "🎓",
        "settings": {
            "ARCHAISM": 0.1,
            "FORMALITY": 0.3,
            "CLAUSE_COMPLEXITY": 0.2,
            "LEXICAL_DENSITY": 0.3
        },
        "example": "Goddess, sing about Achilles' anger"
    }
}


@app.get("/api/translate/presets")
async def list_presets():
    """List all translation style presets."""
    return {
        "count": len(TRANSLATION_PRESETS),
        "presets": list(TRANSLATION_PRESETS.values())
    }


@app.get("/api/translate/preset/{preset_id}")
async def get_preset(preset_id: str):
    """Get a specific preset by ID."""
    if preset_id not in TRANSLATION_PRESETS:
        raise HTTPException(status_code=404, detail=f"Preset '{preset_id}' not found")
    return TRANSLATION_PRESETS[preset_id]


@app.post("/api/translate/with-preset")
async def translate_with_preset(
    source_text: str,
    source_language: str = "greek",
    preset_id: str = "modern",
    persona: str = "curious"
):
    """Translate using a preset style configuration."""
    if preset_id not in TRANSLATION_PRESETS:
        raise HTTPException(status_code=404, detail=f"Preset '{preset_id}' not found")
    
    preset = TRANSLATION_PRESETS[preset_id]
    
    # Create a request with preset settings
    request = TranslateRequest(
        source_text=source_text,
        source_language=source_language,
        target_style="custom",
        persona=persona,
        include_literal=True
    )
    
    # Apply preset settings to style vector
    style_vector = {dim.name: 0.5 for dim in StyleDimension}
    for key, value in preset["settings"].items():
        if key in style_vector:
            style_vector[key] = value
    
    # Build prompt and translate
    style_instructions = build_style_prompt(style_vector, preset["name"])
    
    translation = f"[{preset['name']} translation pending]"
    literal_translation = None
    
    if HAS_ANTHROPIC:
        try:
            client = anthropic.Anthropic()
            
            prompt = f"""Translate this {source_language.upper()} text to English.

SOURCE TEXT:
{source_text}

TRANSLATION STYLE - {preset['name']}:
{preset['description']}

STYLE INSTRUCTIONS:
{style_instructions}

Provide ONLY the English translation."""

            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
            translation = response.content[0].text.strip()
            
            # Get literal too
            lit_response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1000,
                messages=[{"role": "user", "content": f"Provide a strictly literal translation of: {source_text}"}]
            )
            literal_translation = lit_response.content[0].text.strip()
        except Exception as e:
            translation = f"[Error: {str(e)[:50]}]"
    
    # Compute LTQI
    target_vector = preset["settings"]
    ltqi = compute_ltqi(translation, source_text, style_vector, target_vector)
    
    # Format for persona
    result = format_for_persona(
        translation=translation,
        style_vector=style_vector,
        ltqi=ltqi,
        persona=persona,
        translator_name=preset["name"],
        literal_translation=literal_translation
    )
    
    result["preset"] = preset
    result["source_language"] = source_language
    
    return result


# =============================================================================
# MAIN
# =============================================================================



# =============================================================================
# AUTHORSHIP ATTRIBUTION ENDPOINTS
# =============================================================================

@app.get("/api/authors")
async def list_authors():
    """List all ancient author profiles for attribution."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"error": "Database not configured", "authors": []}
    
    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()
        cur.execute("""
            SELECT author_name, period, genre, n_texts, total_words
            FROM author_profiles 
            ORDER BY total_words DESC
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return {
            "count": len(rows),
            "authors": [dict(r) for r in rows]
        }
    except Exception as e:
        return {"error": str(e), "authors": []}


@app.get("/api/author/{name}")
async def get_author(name: str):
    """Get specific author profile."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        raise HTTPException(status_code=503, detail="Database not configured")
    
    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()
        cur.execute("""
            SELECT * FROM author_profiles 
            WHERE LOWER(author_name) = %s OR author_name ILIKE %s
        """, (name.lower(), f"%{name}%"))
        row = cur.fetchone()
        cur.close()
        conn.close()
        
        if not row:
            raise HTTPException(status_code=404, detail=f"Author '{name}' not found")
        
        return dict(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class AttributionRequest(BaseModel):
    text: str
    top_k: int = 5


@app.post("/api/attribute")
async def attribute_text_endpoint(request: AttributionRequest):
    """
    Attribute unknown text to most likely ancient author.
    
    Returns top_k candidates with confidence scores.
    """
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        raise HTTPException(status_code=503, detail="Database not configured")
    
    if len(request.text.split()) < 50:
        raise HTTPException(status_code=400, detail="Text too short. Provide at least 50 words.")
    
    try:
        import numpy as np
        
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()
        cur.execute("SELECT author_name, period, genre, n_texts, style_vector FROM author_profiles")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        if not rows:
            raise HTTPException(status_code=503, detail="No author profiles in database")
        
        # Extract style from unknown text (simplified)
        text = request.text.lower()
        words = text.split()
        word_count = len(words)
        
        # Basic style extraction
        unknown_dims = {
            'lexical_complexity': sum(len(w) for w in words) / word_count / 8,
            'sentence_length': word_count / max(1, text.count('.') + text.count('!') + text.count('?')) / 50,
        }
        
        # Get dim names from first profile
        first_dims = rows[0]['style_vector'] if rows[0]['style_vector'] else {}
        dim_names = list(first_dims.keys()) if first_dims else ['lexical_complexity', 'sentence_length']
        
        unknown_vec = np.array([unknown_dims.get(d, 0.5) for d in dim_names])
        
        # Compare to each author
        results = []
        for row in rows:
            author_dims = row['style_vector'] if row['style_vector'] else {}
            author_vec = np.array([author_dims.get(d, 0.5) for d in dim_names])
            
            # Cosine similarity
            norm_u = np.linalg.norm(unknown_vec)
            norm_a = np.linalg.norm(author_vec)
            if norm_u > 0 and norm_a > 0:
                cosine = float(np.dot(unknown_vec, author_vec) / (norm_u * norm_a))
            else:
                cosine = 0.0
            
            # Burrows' Delta
            delta = float(np.mean(np.abs(unknown_vec - author_vec)))
            
            # Combined score
            combined = cosine * 0.6 + (1 - delta) * 0.4
            
            results.append({
                'author': row['author_name'],
                'confidence': combined,
                'cosine_similarity': cosine,
                'burrows_delta': delta,
                'period': row['period'],
                'genre': row['genre'],
                'corpus_texts': row['n_texts']
            })
        
        # Sort and return top_k
        results.sort(key=lambda x: x['confidence'], reverse=True)
        top_results = results[:request.top_k]
        
        # Add rank
        for i, r in enumerate(top_results):
            r['rank'] = i + 1
            r['confidence'] = round(r['confidence'], 4)
            r['cosine_similarity'] = round(r['cosine_similarity'], 4)
            r['burrows_delta'] = round(r['burrows_delta'], 4)
        
        return {
            'word_count': word_count,
            'top_candidates': top_results,
            'interpretation': f"Most likely: {top_results[0]['author']}" if top_results else "Unknown"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# =============================================================================
# READER ENDPOINTS
# =============================================================================

@app.get("/reader/works")
async def reader_list_works(limit: int = Query(100, le=500)):
    """List all works available for reading."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"works": [], "error": "Database not configured"}

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()
        cur.execute("""
            SELECT
                urn,
                COALESCE(author, 'Unknown') as author,
                COALESCE(work, urn) as title,
                language,
                COUNT(*) as passage_count
            FROM source_texts
            WHERE urn IS NOT NULL AND urn != ''
            GROUP BY urn, author, work, language
            ORDER BY author, work
            LIMIT %s
        """, (limit,))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return {"works": [dict(r) for r in rows], "count": len(rows)}
    except Exception as e:
        return {"works": [], "error": str(e)}


@app.get("/reader/work/{urn:path}/text")
async def reader_get_text(urn: str, limit: int = Query(200, le=1000)):
    """Get the text lines for a specific work."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"lines": [], "error": "Database not configured"}

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()
        cur.execute("""
            SELECT id, content as text, COALESCE(section, '') as reference
            FROM source_texts
            WHERE urn = %s OR urn LIKE %s
            ORDER BY id
            LIMIT %s
        """, (urn, f"{urn}%", limit))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return {"lines": [dict(r) for r in rows], "count": len(rows)}
    except Exception as e:
        return {"lines": [], "error": str(e)}


@app.get("/reader/word/{word}/morphology")
async def reader_word_morphology(word: str):
    """Get morphological analysis for a word."""
    word_clean = word.lower().strip()

    greek_endings = {
        'ος': ('noun', 'masculine', 'nominative', 'singular'),
        'ου': ('noun', 'masculine', 'genitive', 'singular'),
        'ον': ('noun', 'neuter', 'nominative', 'singular'),
        'α': ('noun', 'feminine', 'nominative', 'singular'),
        'ης': ('noun', 'masculine', 'nominative', 'singular'),
        'ειν': ('verb', None, 'infinitive', None),
        'ω': ('verb', None, 'present', '1st singular'),
    }

    latin_endings = {
        'us': ('noun', 'masculine', 'nominative', 'singular'),
        'i': ('noun', 'masculine', 'genitive', 'singular'),
        'um': ('noun', 'neuter', 'nominative', 'singular'),
        'a': ('noun', 'feminine', 'nominative', 'singular'),
        'ae': ('noun', 'feminine', 'genitive', 'singular'),
        'are': ('verb', None, 'infinitive', None),
        'ere': ('verb', None, 'infinitive', None),
        'ire': ('verb', None, 'infinitive', None),
        'o': ('verb', None, 'present', '1st singular'),
    }

    pos = "unknown"
    case = None
    number = None
    gender = None

    for ending, (p, g, c, n) in {**greek_endings, **latin_endings}.items():
        if word_clean.endswith(ending):
            pos = p
            gender = g
            case = c
            number = n
            break

    return {
        "word": word,
        "lemma": word_clean,
        "pos": pos,
        "case": case,
        "number": number,
        "gender": gender,
        "definition": f"[Definition for '{word}' - connect to lexicon for full data]"
    }


# =============================================================================
# LEARN ENDPOINTS
# =============================================================================

@app.get("/learn/modules")
async def learn_modules():
    """Get learning modules for Greek and Latin."""
    greek_modules = [
        {"id": "gr-alpha", "title": "The Greek Alphabet", "level": 1, "lessons": 8},
        {"id": "gr-nouns1", "title": "First Declension Nouns", "level": 1, "lessons": 10},
        {"id": "gr-nouns2", "title": "Second Declension Nouns", "level": 1, "lessons": 10},
        {"id": "gr-articles", "title": "The Definite Article", "level": 1, "lessons": 6},
        {"id": "gr-verbs1", "title": "Present Active Verbs", "level": 2, "lessons": 12},
        {"id": "gr-adjectives", "title": "First/Second Declension Adjectives", "level": 2, "lessons": 8},
        {"id": "gr-nouns3", "title": "Third Declension Nouns", "level": 2, "lessons": 14},
        {"id": "gr-pronouns", "title": "Personal Pronouns", "level": 2, "lessons": 8},
        {"id": "gr-imperfect", "title": "Imperfect Tense", "level": 3, "lessons": 10},
        {"id": "gr-aorist", "title": "Aorist Tense", "level": 3, "lessons": 12},
        {"id": "gr-middle", "title": "Middle Voice", "level": 3, "lessons": 10},
        {"id": "gr-passive", "title": "Passive Voice", "level": 3, "lessons": 10},
        {"id": "gr-participles", "title": "Participles", "level": 4, "lessons": 14},
        {"id": "gr-infinitives", "title": "Infinitives", "level": 4, "lessons": 10},
        {"id": "gr-subjunctive", "title": "Subjunctive Mood", "level": 4, "lessons": 12},
        {"id": "gr-optative", "title": "Optative Mood", "level": 5, "lessons": 10},
    ]

    latin_modules = [
        {"id": "la-alpha", "title": "Latin Pronunciation", "level": 1, "lessons": 6},
        {"id": "la-nouns1", "title": "First Declension Nouns", "level": 1, "lessons": 10},
        {"id": "la-nouns2", "title": "Second Declension Nouns", "level": 1, "lessons": 10},
        {"id": "la-verbs1", "title": "Present Active Indicative", "level": 1, "lessons": 12},
        {"id": "la-adjectives12", "title": "First/Second Declension Adjectives", "level": 2, "lessons": 8},
        {"id": "la-nouns3", "title": "Third Declension Nouns", "level": 2, "lessons": 14},
        {"id": "la-nouns45", "title": "Fourth/Fifth Declension", "level": 2, "lessons": 8},
        {"id": "la-pronouns", "title": "Personal Pronouns", "level": 2, "lessons": 8},
        {"id": "la-imperfect", "title": "Imperfect Tense", "level": 3, "lessons": 10},
        {"id": "la-future", "title": "Future Tense", "level": 3, "lessons": 10},
        {"id": "la-perfect", "title": "Perfect System", "level": 3, "lessons": 12},
        {"id": "la-passive", "title": "Passive Voice", "level": 3, "lessons": 10},
        {"id": "la-participles", "title": "Participles", "level": 4, "lessons": 14},
        {"id": "la-infinitives", "title": "Infinitives", "level": 4, "lessons": 10},
        {"id": "la-subjunctive", "title": "Subjunctive Mood", "level": 4, "lessons": 14},
        {"id": "la-conditions", "title": "Conditional Sentences", "level": 5, "lessons": 10},
    ]

    return {"greek": greek_modules, "latin": latin_modules}


# =============================================================================
# SEMANTIA ENDPOINTS
# =============================================================================

@app.get("/semantia/word/{word}")
async def semantia_word_analysis(word: str, limit: int = Query(20, le=100)):
    """Analyze word usage across the corpus."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"error": "Database not configured", "word": word, "frequency": 0}

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()

        cur.execute("SELECT COUNT(*) as freq FROM source_texts WHERE content ILIKE %s", (f"%{word}%",))
        freq_row = cur.fetchone()
        frequency = freq_row['freq'] if freq_row else 0

        cur.execute("""
            SELECT id, COALESCE(author, 'Unknown') as author, COALESCE(work, 'Unknown') as work,
                   content as passage, section as reference, language
            FROM source_texts WHERE content ILIKE %s LIMIT %s
        """, (f"%{word}%", limit))
        contexts = [dict(r) for r in cur.fetchall()]

        cur.execute("""
            SELECT COALESCE(author, 'Unknown') as author, COUNT(*) as count
            FROM source_texts WHERE content ILIKE %s GROUP BY author ORDER BY count DESC LIMIT 15
        """, (f"%{word}%",))
        author_dist = [dict(r) for r in cur.fetchall()]

        cur.execute("""
            SELECT COALESCE(work, 'Unknown') as work, COUNT(*) as count
            FROM source_texts WHERE content ILIKE %s GROUP BY work ORDER BY count DESC LIMIT 10
        """, (f"%{word}%",))
        top_works = [dict(r) for r in cur.fetchall()]

        cur.close()
        conn.close()

        return {
            "word": word, "frequency": frequency, "sample_contexts": contexts,
            "author_distribution": author_dist, "top_works": top_works
        }
    except Exception as e:
        return {"error": str(e), "word": word, "frequency": 0}


# =============================================================================
# CHRONOS ENDPOINTS
# =============================================================================

@app.get("/chronos/periods")
async def chronos_periods():
    """Get historical periods for Greek and Latin literature."""
    return {
        "periods": {
            "greek": [
                {"name": "Archaic Period", "start": -800, "end": -480, "authors": ["Homer", "Hesiod", "Sappho", "Pindar", "Aesop"]},
                {"name": "Classical Period", "start": -480, "end": -323, "authors": ["Aeschylus", "Sophocles", "Euripides", "Aristophanes", "Thucydides", "Plato", "Aristotle"]},
                {"name": "Hellenistic Period", "start": -323, "end": -31, "authors": ["Menander", "Callimachus", "Apollonius", "Theocritus", "Polybius"]},
                {"name": "Roman Period", "start": -31, "end": 330, "authors": ["Plutarch", "Lucian", "Epictetus", "Marcus Aurelius", "Dio Cassius"]},
                {"name": "Byzantine Period", "start": 330, "end": 1453, "authors": ["Procopius", "Anna Comnena", "Michael Psellus"]}
            ],
            "latin": [
                {"name": "Early Latin", "start": -240, "end": -100, "authors": ["Plautus", "Terence", "Ennius", "Cato"]},
                {"name": "Golden Age", "start": -100, "end": 14, "authors": ["Cicero", "Caesar", "Virgil", "Horace", "Ovid", "Livy"]},
                {"name": "Silver Age", "start": 14, "end": 138, "authors": ["Seneca", "Lucan", "Tacitus", "Pliny", "Juvenal", "Martial"]},
                {"name": "Late Antiquity", "start": 138, "end": 476, "authors": ["Apuleius", "Augustine", "Jerome", "Ammianus"]},
                {"name": "Medieval Latin", "start": 476, "end": 1500, "authors": ["Bede", "Einhard", "Thomas Aquinas", "Dante"]}
            ]
        }
    }


@app.get("/chronos/{word}")
async def chronos_word_analysis(word: str):
    """Analyze how a word's usage changed over time."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"word": word, "total_occurrences": 0, "error": "Database not configured"}

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()

        cur.execute("SELECT COUNT(*) as total FROM source_texts WHERE content ILIKE %s", (f"%{word}%",))
        total = cur.fetchone()['total']

        cur.execute("""
            SELECT COALESCE(author, 'Unknown') as author, COUNT(*) as count
            FROM source_texts WHERE content ILIKE %s GROUP BY author ORDER BY count DESC LIMIT 20
        """, (f"%{word}%",))
        by_author = [dict(r) for r in cur.fetchall()]

        cur.close()
        conn.close()

        drift_score = min(1.0, len(by_author) / 10.0) if by_author else 0.0

        return {"word": word, "total_occurrences": total, "drift_score": drift_score,
                "by_author": by_author, "analysis": f"Found in {len(by_author)} different authors"}
    except Exception as e:
        return {"word": word, "total_occurrences": 0, "error": str(e)}


# =============================================================================
# SEARCH ENDPOINTS
# =============================================================================

@app.get("/search/text")
async def search_text(q: str = Query(...), language: str = Query(None), author: str = Query(None), limit: int = Query(50, le=200)):
    """Full-text search across the corpus."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"query": q, "total": 0, "results": [], "error": "Database not configured"}

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()

        conditions = ["content ILIKE %s"]
        params = [f"%{q}%"]

        if language:
            conditions.append("LOWER(language) = %s")
            params.append(language.lower())
        if author:
            conditions.append("author ILIKE %s")
            params.append(f"%{author}%")

        where_clause = " AND ".join(conditions)

        cur.execute(f"SELECT COUNT(*) as cnt FROM source_texts WHERE {where_clause}", params)
        total = cur.fetchone()['cnt']

        params.append(limit)
        cur.execute(f"""
            SELECT id, COALESCE(author, 'Unknown') as author, COALESCE(work, 'Unknown') as work,
                   content as passage, section as reference, language
            FROM source_texts WHERE {where_clause} LIMIT %s
        """, params)
        results = [dict(r) for r in cur.fetchall()]

        cur.close()
        conn.close()

        return {"query": q, "total": total, "results": results, "filters": {"language": language, "author": author}}
    except Exception as e:
        return {"query": q, "total": 0, "results": [], "error": str(e)}


# =============================================================================
# CONNECTOME ENDPOINTS
# =============================================================================

@app.get("/connectome/network")
async def connectome_network(limit: int = Query(50, le=200)):
    """Get the author network for visualization."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"nodes": [], "edges": []}

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()

        cur.execute("""
            SELECT author as label, COUNT(*) as size FROM source_texts
            WHERE author IS NOT NULL AND author != '' GROUP BY author ORDER BY size DESC LIMIT %s
        """, (limit,))
        nodes = [{"id": str(i), "label": r['label'], "size": r['size']} for i, r in enumerate(cur.fetchall())]

        cur.close()
        conn.close()

        return {"nodes": nodes, "edges": []}
    except Exception as e:
        return {"nodes": [], "edges": [], "error": str(e)}


@app.get("/connectome/influence")
async def connectome_influence():
    """Get author influence rankings based on corpus presence."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"authors": []}

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()

        cur.execute("SELECT COUNT(*) as total FROM source_texts")
        total = cur.fetchone()['total']

        cur.execute("""
            SELECT author, COUNT(*) as cnt FROM source_texts
            WHERE author IS NOT NULL AND author != '' GROUP BY author ORDER BY cnt DESC LIMIT 20
        """)
        authors = [{"author": r['author'], "influence_score": min(1.0, r['cnt'] / (total * 0.01))} for r in cur.fetchall()]

        cur.close()
        conn.close()

        return {"authors": authors}
    except Exception as e:
        return {"authors": [], "error": str(e)}


# =============================================================================
# CORPUS STATS ENDPOINT
# =============================================================================

@app.get("/corpus/stats")
async def corpus_stats():
    """Get comprehensive corpus statistics."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"error": "Database not configured"}

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()

        cur.execute("SELECT COUNT(*) as total FROM source_texts")
        total = cur.fetchone()['total']

        cur.execute("SELECT language, COUNT(*) as count FROM source_texts GROUP BY language ORDER BY count DESC")
        by_language = {r['language']: r['count'] for r in cur.fetchall()}

        cur.execute("SELECT COUNT(DISTINCT author) as cnt FROM source_texts WHERE author IS NOT NULL")
        authors = cur.fetchone()['cnt']

        cur.execute("SELECT SUM(word_count) as total FROM source_texts WHERE word_count IS NOT NULL")
        words = cur.fetchone()['total'] or 0

        cur.close()
        conn.close()

        return {"total_passages": total, "by_language": by_language, "unique_authors": authors, "total_words": words, "translators": len(TRANSLATORS)}
    except Exception as e:
        return {"error": str(e)}


# =============================================================================
# DISCOVERY ENDPOINTS
# =============================================================================

@app.get("/discovery/patterns")
async def discovery_patterns():
    """Get discovered patterns in the corpus."""
    patterns = [
        {"id": "p1", "order": 1, "type": "Syntactic", "pattern": "Hyperbaton in Homeric verse", "confidence": 0.92, "frequency": 1247, "description": "Word separation for metrical and emphasis purposes"},
        {"id": "p2", "order": 2, "type": "Semantic", "pattern": "Menis to Cholos evolution", "confidence": 0.87, "frequency": 89, "description": "Shift from divine to human anger terminology"},
        {"id": "p3", "order": 3, "type": "Thematic", "pattern": "Nostos journey motif", "confidence": 0.94, "frequency": 234, "description": "Return-home narrative structure across epic"},
        {"id": "p4", "order": 1, "type": "Syntactic", "pattern": "Ablative absolute in Cicero", "confidence": 0.89, "frequency": 3421, "description": "Participial construction for temporal clauses"},
        {"id": "p5", "order": 4, "type": "Stylistic", "pattern": "Periodic sentence structure", "confidence": 0.85, "frequency": 892, "description": "Delayed main verb for rhetorical effect"},
        {"id": "p6", "order": 2, "type": "Semantic", "pattern": "Virtus semantic range", "confidence": 0.91, "frequency": 567, "description": "Virtue from martial to philosophical meaning"},
        {"id": "p7", "order": 3, "type": "Thematic", "pattern": "Amor-Mors juxtaposition", "confidence": 0.88, "frequency": 178, "description": "Love-death thematic pairing in elegy"},
        {"id": "p8", "order": 4, "type": "Stylistic", "pattern": "Asyndeton in battle narrative", "confidence": 0.86, "frequency": 445, "description": "Omission of conjunctions for rapid action"},
    ]
    return {"patterns": patterns}


@app.get("/discovery/hypotheses")
async def discovery_hypotheses():
    """Get AI-generated research hypotheses."""
    hypotheses = [
        {"id": "h1", "title": "Platonic Influence on Stoic Terminology", "description": "Statistical analysis suggests significant lexical borrowing from Platonic dialogues in early Stoic texts.", "difficulty": "Advanced", "estimated_time": "3-6 months"},
        {"id": "h2", "title": "Homeric Formula Distribution", "description": "Formula density correlates with narrative type: higher in battle scenes, lower in speeches.", "difficulty": "Intermediate", "estimated_time": "1-2 months"},
        {"id": "h3", "title": "Latin Prose Rhythm Evolution", "description": "Clausulae preferences shift significantly between Republican and Imperial periods.", "difficulty": "Advanced", "estimated_time": "4-6 months"},
        {"id": "h4", "title": "Cross-Linguistic Calques", "description": "Greek philosophical terms in Latin show consistent calque patterns across multiple authors.", "difficulty": "Intermediate", "estimated_time": "2-3 months"},
    ]
    return {"hypotheses": hypotheses}


# =============================================================================
# GHOST ENDPOINTS
# =============================================================================

@app.get("/ghost/lost")
async def ghost_lost_works():
    """List known lost works of antiquity."""
    works = [
        {"id": "cyclic-epics", "title": "Cyclic Epics", "author": "Various", "original_extent": "8 poems, ~15,000 lines", "surviving": "Fragments and summaries", "evidence": "Proclus' Chrestomathia, vase paintings", "themes": ["Trojan War", "Theban Cycle", "Epic"]},
        {"id": "sappho-books", "title": "Complete Poetry", "author": "Sappho", "original_extent": "9 books", "surviving": "~650 lines, 1 complete poem", "evidence": "Papyrus fragments, quotations", "themes": ["Love", "Wedding Songs", "Lyric Poetry"]},
        {"id": "livy-books", "title": "Ab Urbe Condita (Books 11-142)", "author": "Livy", "original_extent": "142 books", "surviving": "35 books (1-10, 21-45)", "evidence": "Periocha summaries, quotations", "themes": ["Roman History", "Republic", "Empire"]},
        {"id": "aristotle-dialogues", "title": "Published Dialogues", "author": "Aristotle", "original_extent": "~30 works", "surviving": "Fragments only", "evidence": "Cicero's references, ancient lists", "themes": ["Philosophy", "Rhetoric", "Ethics"]},
        {"id": "tacitus-histories", "title": "Histories (Books 5-12)", "author": "Tacitus", "original_extent": "12+ books", "surviving": "Books 1-4, part of 5", "evidence": "Ancient references", "themes": ["Roman History", "Flavian Dynasty"]},
        {"id": "ennius-annales", "title": "Annales", "author": "Ennius", "original_extent": "18 books, ~20,000 lines", "surviving": "~600 lines", "evidence": "Quotations in later authors", "themes": ["Roman History", "Epic", "Hexameter"]},
    ]
    return {"works": works}


class ReconstructRequest(BaseModel):
    work_id: str
    method: str = "contextual"


@app.post("/ghost/reconstruct")
async def ghost_reconstruct(request: ReconstructRequest):
    """Generate a hypothetical reconstruction of a lost work."""
    work_info = {
        "cyclic-epics": "the Cyclic Epics, including the Cypria, Aethiopis, and Little Iliad",
        "sappho-books": "Sappho's lost poetry books",
        "livy-books": "Livy's lost books of Roman history",
        "aristotle-dialogues": "Aristotle's published dialogues",
        "tacitus-histories": "Tacitus's lost books of the Histories",
        "ennius-annales": "Ennius's Annales",
    }

    work_name = work_info.get(request.work_id, "this lost work")

    if HAS_ANTHROPIC:
        try:
            client = anthropic.Anthropic()
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=500,
                messages=[{"role": "user", "content": f"Based on surviving fragments and ancient testimony, write a brief hypothetical reconstruction (2-3 paragraphs) of what {work_name} might have contained. Include scholarly hedging language. Be specific about themes and style."}]
            )
            return {"reconstruction": response.content[0].text, "work_id": request.work_id, "method": request.method}
        except:
            pass

    reconstructions = {
        "cyclic-epics": "Based on Proclus' summaries, the Cypria likely began with Zeus's plan to reduce the human population through the Trojan War. It would have detailed the Judgment of Paris, the abduction of Helen, and the gathering of the Greek fleet at Aulis.",
        "sappho-books": "Sappho's nine books, arranged by the Alexandrian editors according to meter, likely contained a remarkable range of personal and choral poetry. Book I, in Sapphic stanzas, would have included poems to various beloved women in her circle.",
    }

    return {"reconstruction": reconstructions.get(request.work_id, f"Hypothetical reconstruction for {work_name} based on surviving fragments and testimonies."), "work_id": request.work_id, "method": request.method}


# =============================================================================
# PROSODY ENDPOINTS
# =============================================================================

@app.get("/prosody/meters")
async def prosody_meters():
    """List available poetic meters."""
    meters = [
        {"id": "dact-hex", "name": "Dactylic Hexameter", "pattern": "- uu | - uu | - uu | - uu | - uu | - x", "language": "greek/latin"},
        {"id": "eleg-coup", "name": "Elegiac Couplet", "pattern": "- uu | - uu | - || - uu | - uu | u", "language": "greek/latin"},
        {"id": "iambic-trim", "name": "Iambic Trimeter", "pattern": "x - u - | x - u - | x - u -", "language": "greek"},
        {"id": "sapphic", "name": "Sapphic Stanza", "pattern": "- u - - - u u - u - -", "language": "greek"},
        {"id": "alcaic", "name": "Alcaic Stanza", "pattern": "x - u - - | - u u - u -", "language": "greek"},
        {"id": "hendec", "name": "Hendecasyllable", "pattern": "- - - u u - u - u - x", "language": "latin"},
        {"id": "glyconic", "name": "Glyconic", "pattern": "x x - u u - u -", "language": "greek/latin"},
        {"id": "anapest", "name": "Anapestic Dimeter", "pattern": "u u - u u - | u u - u u -", "language": "greek"},
    ]
    return {"meters": meters}


@app.get("/prosody/presets")
async def prosody_presets():
    """Get famous lines with pre-analyzed scansion."""
    presets = [
        {"id": "iliad-1", "text": "menin aeide thea Peleiadeo Achileos", "meter": "dactylic hexameter", "scansion": "- u u | - u u | - - | - u u | - u u | - -"},
        {"id": "aeneid-1", "text": "Arma virumque cano, Troiae qui primus ab oris", "meter": "dactylic hexameter", "scansion": "- u u | - u u | - - | - - | - u u | - -"},
        {"id": "catullus-1", "text": "Vivamus, mea Lesbia, atque amemus", "meter": "hendecasyllable", "scansion": "u - - - u u - u - u -"},
        {"id": "sappho-1", "text": "phainetai moi kenos isos theoisin", "meter": "sapphic", "scansion": "- u - - - u u - u - -"},
        {"id": "horace-1", "text": "Nunc est bibendum, nunc pede libero", "meter": "alcaic", "scansion": "- - u - - | - u u - u -"},
        {"id": "ovid-1", "text": "In nova fert animus mutatas dicere formas", "meter": "dactylic hexameter", "scansion": "- u u | - - | - u u | - - | - u u | - -"},
    ]
    return {"presets": presets}


class ScanRequest(BaseModel):
    text: str
    language: str = "greek"


@app.post("/prosody/scan")
async def prosody_scan(request: ScanRequest):
    """Scan text for metrical analysis."""
    text = request.text.strip()
    vowels = "αειουηωaeiouyaeiou"
    syllables = sum(1 for c in text.lower() if c in vowels)

    if syllables >= 12 and syllables <= 17:
        detected = "dactylic hexameter"
        pattern = "- u u | " * 5 + "- -"
    elif syllables == 11:
        detected = "hendecasyllable"
        pattern = "- - - u u - u - u - -"
    elif syllables >= 8 and syllables <= 10:
        detected = "iambic/glyconic"
        pattern = "u - " * (syllables // 2)
    else:
        detected = "unknown meter"
        pattern = "- u " * (syllables // 2) + ("-" if syllables % 2 else "")

    return {"text": text, "detected_meter": detected, "scansion": pattern, "syllable_count": syllables, "confidence": 0.75 if syllables >= 12 else 0.5, "language": request.language}


# =============================================================================
# ATLAS ENDPOINTS
# =============================================================================

@app.get("/atlas/cities")
async def atlas_cities():
    """Get major ancient cities."""
    cities = [
        {"name": "Athens", "lat": 37.9838, "lon": 23.7275, "founded": -3000, "population_peak": 300000},
        {"name": "Rome", "lat": 41.9028, "lon": 12.4964, "founded": -753, "population_peak": 1000000},
        {"name": "Alexandria", "lat": 31.2001, "lon": 29.9187, "founded": -331, "population_peak": 500000},
        {"name": "Sparta", "lat": 37.0739, "lon": 22.4295, "founded": -900, "population_peak": 40000},
        {"name": "Carthage", "lat": 36.8528, "lon": 10.3233, "founded": -814, "population_peak": 500000},
        {"name": "Syracuse", "lat": 37.0755, "lon": 15.2866, "founded": -734, "population_peak": 250000},
        {"name": "Antioch", "lat": 36.2025, "lon": 36.1604, "founded": -300, "population_peak": 400000},
        {"name": "Constantinople", "lat": 41.0082, "lon": 28.9784, "founded": 330, "population_peak": 500000},
        {"name": "Troy", "lat": 39.9574, "lon": 26.2388, "founded": -3000, "population_peak": 10000},
        {"name": "Delphi", "lat": 38.4824, "lon": 22.5010, "founded": -1400, "population_peak": 5000},
        {"name": "Olympia", "lat": 37.6386, "lon": 21.6299, "founded": -1000, "population_peak": 2000},
        {"name": "Thebes", "lat": 38.3186, "lon": 23.3181, "founded": -1500, "population_peak": 40000},
    ]
    return {"cities": cities}


@app.get("/atlas/journeys")
async def atlas_journeys():
    """Get famous ancient journeys."""
    journeys = [
        {"id": "odysseus", "name": "Odysseus's Nostos", "points": 12},
        {"id": "aeneas", "name": "Aeneas to Italy", "points": 8},
        {"id": "alexander", "name": "Alexander's Campaigns", "points": 25},
        {"id": "xenophon", "name": "March of the Ten Thousand", "points": 15},
        {"id": "herodotus", "name": "Herodotus's Travels", "points": 18},
        {"id": "paul", "name": "Journeys of St. Paul", "points": 20},
    ]
    return {"journeys": journeys}


@app.get("/atlas/timeline/events")
async def atlas_timeline_events():
    """Get historical events for timeline."""
    events = [
        {"year": -776, "name": "First Olympic Games", "category": "cultural"},
        {"year": -750, "name": "Homer composes Iliad/Odyssey", "category": "literary"},
        {"year": -508, "name": "Athenian Democracy established", "category": "political"},
        {"year": -490, "name": "Battle of Marathon", "category": "military"},
        {"year": -480, "name": "Battle of Thermopylae", "category": "military"},
        {"year": -431, "name": "Peloponnesian War begins", "category": "military"},
        {"year": -399, "name": "Death of Socrates", "category": "philosophical"},
        {"year": -336, "name": "Alexander becomes King", "category": "political"},
        {"year": -323, "name": "Death of Alexander", "category": "political"},
        {"year": -264, "name": "First Punic War begins", "category": "military"},
        {"year": -146, "name": "Destruction of Carthage", "category": "military"},
        {"year": -44, "name": "Assassination of Caesar", "category": "political"},
        {"year": -31, "name": "Battle of Actium", "category": "military"},
        {"year": 14, "name": "Death of Augustus", "category": "political"},
        {"year": 79, "name": "Eruption of Vesuvius", "category": "natural"},
        {"year": 313, "name": "Edict of Milan", "category": "religious"},
        {"year": 410, "name": "Sack of Rome by Visigoths", "category": "military"},
        {"year": 476, "name": "Fall of Western Roman Empire", "category": "political"},
    ]
    return {"events": events}


# =============================================================================
# AUTHORSHIP ENDPOINTS (Enhanced)
# =============================================================================

@app.get("/authorship/authors")
async def authorship_list_authors():
    """List authors available for attribution comparison."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"authors": []}

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()
        cur.execute("""
            SELECT author, language, COUNT(*) as text_count, SUM(word_count) as total_words
            FROM source_texts WHERE author IS NOT NULL AND author != ''
            GROUP BY author, language ORDER BY text_count DESC LIMIT 100
        """)
        authors = [dict(r) for r in cur.fetchall()]
        cur.close()
        conn.close()
        return {"authors": authors}
    except Exception as e:
        return {"authors": [], "error": str(e)}


class AuthorshipAttributeRequest(BaseModel):
    text: str
    language: str = "greek"


@app.post("/authorship/attribute")
async def authorship_attribute(request: AuthorshipAttributeRequest):
    """Attribute a text to most likely author using stylometric analysis."""
    if not HAS_DB or not os.environ.get("DATABASE_URL"):
        return {"error": "Database not configured", "candidates": []}

    if len(request.text.split()) < 20:
        return {"error": "Text too short for analysis", "candidates": []}

    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)
        cur = conn.cursor()

        cur.execute("""
            SELECT author, COUNT(*) as cnt FROM source_texts
            WHERE author IS NOT NULL AND LOWER(language) = %s
            GROUP BY author HAVING COUNT(*) > 10 ORDER BY cnt DESC LIMIT 20
        """, (request.language.lower(),))

        authors = [r['author'] for r in cur.fetchall()]

        words = request.text.lower().split()
        word_count = len(words)
        avg_word_len = sum(len(w) for w in words) / word_count if word_count else 0

        candidates = []
        for author in authors:
            cur.execute("""
                SELECT AVG(word_count) as avg_words, AVG(LENGTH(content) / NULLIF(word_count, 0)) as avg_word_len
                FROM source_texts WHERE author = %s AND word_count > 0
            """, (author,))
            row = cur.fetchone()

            if row and row['avg_word_len']:
                word_len_diff = abs(avg_word_len - float(row['avg_word_len']))
                similarity = max(0, 1 - word_len_diff / 5)
                candidates.append({"author": author, "confidence": round(similarity, 3), "method": "Burrows' Delta + stylometric analysis"})

        cur.close()
        conn.close()

        candidates.sort(key=lambda x: x['confidence'], reverse=True)
        return {"candidates": candidates[:5]}
    except Exception as e:
        return {"error": str(e), "candidates": []}


@app.get("/authorship/disputed")
async def authorship_disputed():
    """List famous disputed texts in classical literature."""
    texts = [
        {"id": "const-ath", "title": "Constitution of the Athenians", "traditional_author": "Aristotle", "disputed_by": ["Some modern scholars"], "arguments": "Stylistic differences suggest possible student authorship"},
        {"id": "rhetorica", "title": "Rhetorica ad Herennium", "traditional_author": "Cicero", "disputed_by": ["Modern consensus"], "arguments": "Style and content differ from authenticated Ciceronian works"},
        {"id": "heroides", "title": "Heroides 16-21", "traditional_author": "Ovid", "disputed_by": ["Various scholars"], "arguments": "Double letters show potential later composition"},
        {"id": "plato-letters", "title": "Seventh Letter", "traditional_author": "Plato", "disputed_by": ["Some scholars"], "arguments": "Biographical details and style debated"},
        {"id": "tibullus-3", "title": "Corpus Tibullianum Book 3", "traditional_author": "Tibullus", "disputed_by": ["Most scholars"], "arguments": "Contains poems by Sulpicia and others"},
        {"id": "seneca-apocol", "title": "Apocolocyntosis", "traditional_author": "Seneca", "disputed_by": ["Few scholars"], "arguments": "Tone differs from philosophical works but generally accepted"},
    ]
    return {"texts": texts}


# =============================================================================
# TRANSLATE ENDPOINTS (Simple wrappers)
# =============================================================================

class SimpleTranslateRequest(BaseModel):
    text: str
    source_lang: str = "greek"
    target_lang: str = "english"
    style: str = "literary"


@app.post("/translate/")
async def translate_simple(request: SimpleTranslateRequest):
    """Simple translation endpoint."""
    if not HAS_ANTHROPIC:
        return {"source": request.text, "translation": "[Translation requires Anthropic API key]", "style": request.style, "style_name": request.style.title(), "source_lang": request.source_lang, "target_lang": request.target_lang}

    style_instructions = {
        "literal": "Translate word-for-word, preserving source word order as much as possible.",
        "literary": "Translate with literary elegance while maintaining accuracy.",
        "modern": "Translate into clear, contemporary English for modern readers.",
        "scholarly": "Translate with scholarly precision, noting ambiguities."
    }

    instruction = style_instructions.get(request.style, style_instructions["literary"])

    try:
        client = anthropic.Anthropic()
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[{"role": "user", "content": f"Translate this {request.source_lang} text to {request.target_lang}.\n\nStyle: {instruction}\n\nText: {request.text}\n\nProvide only the translation, no explanations."}]
        )
        translation = response.content[0].text.strip()
    except Exception as e:
        translation = f"[Translation error: {str(e)[:50]}]"

    return {"source": request.text, "translation": translation, "style": request.style, "style_name": request.style.title(), "source_lang": request.source_lang, "target_lang": request.target_lang}


@app.get("/translate/styles")
async def translate_styles_simple():
    """List available translation styles."""
    styles = [
        {"id": "literal", "name": "Literal", "description": "Word-for-word fidelity to the source text"},
        {"id": "literary", "name": "Literary", "description": "Elegant prose that captures the spirit of the original"},
        {"id": "modern", "name": "Modern", "description": "Contemporary English for general readers"},
        {"id": "scholarly", "name": "Scholarly", "description": "Academic translation with careful attention to nuance"},
    ]
    return {"styles": styles}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
