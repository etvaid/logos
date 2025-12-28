"""
LOGOS Translation Style API
============================

FastAPI endpoints for the Mathematical Translation Framework.

Endpoints:
    /api/style/translators         - List all translator profiles
    /api/style/translator/{name}   - Get specific translator profile
    /api/style/compare             - Compare two translators
    /api/style/analyze             - Analyze text to extract style
    /api/style/blend               - Blend multiple styles
    /api/style/transform           - Apply style transformation
    /api/style/ltqi                - Calculate translation quality
    /api/style/similar             - Find similar translators
    /api/style/arithmetic          - Style vector arithmetic

Author: LOGOS Project
License: MIT
"""

from fastapi import APIRouter, Query, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import numpy as np

# Import our framework
from translation_math import (
    StyleVector,
    StyleDimension,
    LTQIScore,
    StyleAnalyzer,
    TranslationTransform
)
from translator_profiles import (
    ALL_TRANSLATORS,
    get_translator,
    find_similar_translators,
    compare_translators,
    list_all_translators,
    HOMER_TRANSLATORS,
    TRAGEDY_TRANSLATORS,
    VIRGIL_TRANSLATORS
)


# =============================================================================
# PYDANTIC MODELS
# =============================================================================

class StyleVectorModel(BaseModel):
    """Style vector for API serialization."""
    name: str
    confidence: float
    dimensions: Dict[str, float]
    
    class Config:
        schema_extra = {
            "example": {
                "name": "custom_style",
                "confidence": 0.85,
                "dimensions": {
                    "FORMALITY": 0.7,
                    "ARCHAISM": 0.3,
                    "SENTENCE_LENGTH": 0.5,
                    # ... etc
                }
            }
        }


class TranslatorResponse(BaseModel):
    """Translator profile response."""
    name: str
    style: StyleVectorModel
    birth_year: Optional[int]
    death_year: Optional[int]
    nationality: str
    primary_works: List[str]
    translation_philosophy: str
    notable_features: List[str]


class CompareRequest(BaseModel):
    """Request to compare two translators."""
    translator1: str
    translator2: str


class CompareResponse(BaseModel):
    """Comparison result."""
    translator1: str
    translator2: str
    distance: float
    biggest_differences: List[Dict]


class BlendRequest(BaseModel):
    """Request to blend multiple styles."""
    translators: List[str] = Field(..., min_items=2, max_items=5)
    weights: Optional[List[float]] = None
    
    class Config:
        schema_extra = {
            "example": {
                "translators": ["Alexander Pope", "Emily Wilson"],
                "weights": [0.3, 0.7]
            }
        }


class AnalyzeRequest(BaseModel):
    """Request to analyze text for style."""
    texts: List[str] = Field(..., min_items=1)
    source_lang: str = "grc"


class TransformRequest(BaseModel):
    """Request to transform a style."""
    base_style: str  # Translator name or "custom"
    custom_style: Optional[Dict[str, float]] = None
    adjustments: Dict[str, float] = {}  # dimension -> delta
    
    class Config:
        schema_extra = {
            "example": {
                "base_style": "Robert Fagles",
                "adjustments": {
                    "FORMALITY": 0.2,
                    "ARCHAISM": -0.1
                }
            }
        }


class ArithmeticRequest(BaseModel):
    """Style arithmetic operations."""
    operation: str  # "blend", "extrapolate", "adjust"
    style1: str
    style2: Optional[str] = None
    parameter: float = 0.5  # alpha for blend, beta for extrapolate, delta for adjust
    dimension: Optional[str] = None  # For adjust operation


class LTQIRequest(BaseModel):
    """Request LTQI score calculation."""
    source_text: str
    translation: str
    source_lang: str = "grc"
    target_lang: str = "en"
    translator_style: Optional[str] = None


class SimilarRequest(BaseModel):
    """Find similar translators request."""
    style: Dict[str, float]
    k: int = 5
    category: Optional[str] = None  # "homer", "tragedy", "virgil", or None for all


# =============================================================================
# ROUTER
# =============================================================================

router = APIRouter(prefix="/api/style", tags=["Translation Style"])


@router.get("/translators", response_model=Dict)
async def list_translators(
    category: Optional[str] = Query(None, description="Filter by category: homer, tragedy, virgil")
):
    """
    List all available translator profiles.
    
    Returns translator names grouped by category.
    """
    if category == "homer":
        pool = HOMER_TRANSLATORS
    elif category == "tragedy":
        pool = TRAGEDY_TRANSLATORS
    elif category == "virgil":
        pool = VIRGIL_TRANSLATORS
    else:
        return {
            "total": len(ALL_TRANSLATORS),
            "categories": {
                "homer": [p.name for p in HOMER_TRANSLATORS.values()],
                "tragedy": [p.name for p in TRAGEDY_TRANSLATORS.values()],
                "virgil": [p.name for p in VIRGIL_TRANSLATORS.values()]
            }
        }
    
    return {
        "category": category,
        "translators": [p.name for p in pool.values()]
    }


@router.get("/translator/{name}")
async def get_translator_profile(name: str):
    """
    Get detailed profile for a specific translator.
    
    Includes style vector, biographical info, and notable features.
    """
    profile = get_translator(name)
    if not profile:
        raise HTTPException(status_code=404, detail=f"Translator '{name}' not found")
    
    return {
        "name": profile.name,
        "style": profile.style.to_dict(),
        "birth_year": profile.birth_year,
        "death_year": profile.death_year,
        "nationality": profile.nationality,
        "primary_works": profile.primary_works,
        "translation_philosophy": profile.translation_philosophy,
        "notable_features": profile.notable_features,
        "style_description": profile.style.describe()
    }


@router.post("/compare")
async def compare_translator_styles(request: CompareRequest):
    """
    Compare two translators' styles.
    
    Returns distance metric and biggest differences across dimensions.
    """
    result = compare_translators(request.translator1, request.translator2)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/blend")
async def blend_styles(request: BlendRequest):
    """
    Blend multiple translator styles.
    
    Creates a new style vector that combines characteristics of multiple translators.
    If weights not provided, uses equal weights.
    
    Example: Blend Pope (30%) + Wilson (70%) for formal but modern style.
    """
    # Get translator profiles
    profiles = []
    for name in request.translators:
        profile = get_translator(name)
        if not profile:
            raise HTTPException(status_code=404, detail=f"Translator '{name}' not found")
        profiles.append(profile)
    
    # Default to equal weights
    weights = request.weights
    if weights is None:
        weights = [1.0 / len(profiles)] * len(profiles)
    
    if len(weights) != len(profiles):
        raise HTTPException(
            status_code=400,
            detail="Number of weights must match number of translators"
        )
    
    if abs(sum(weights) - 1.0) > 0.01:
        raise HTTPException(status_code=400, detail="Weights must sum to 1.0")
    
    # Blend styles
    combined_values = np.zeros(20)
    for profile, weight in zip(profiles, weights):
        combined_values += weight * profile.style.values
    
    blended = StyleVector(
        values=combined_values,
        name=f"blend({', '.join(request.translators)})",
        confidence=min(p.style.confidence for p in profiles) * 0.85
    )
    
    # Find most similar known translator
    similar = find_similar_translators(blended, k=3)
    
    return {
        "blended_style": blended.to_dict(),
        "components": [
            {"translator": name, "weight": w}
            for name, w in zip(request.translators, weights)
        ],
        "most_similar_to": [
            {"translator": s[0].name, "distance": s[1]}
            for s in similar
        ],
        "description": blended.describe()
    }


@router.post("/analyze")
async def analyze_text_style(request: AnalyzeRequest):
    """
    Analyze translation text to extract its implicit style vector.
    
    Given a corpus of translations, extracts the style characteristics
    based on lexical, syntactic, and rhetorical features.
    """
    analyzer = StyleAnalyzer()
    
    # Analyze the texts
    style = analyzer.analyze(
        source_texts=[],  # Would need parallel source
        translations=request.texts,
        source_lang=request.source_lang
    )
    
    # Find similar translators
    similar = find_similar_translators(style, k=5)
    
    return {
        "extracted_style": style.to_dict(),
        "similar_translators": [
            {"translator": s[0].name, "distance": float(s[1])}
            for s in similar
        ],
        "description": style.describe(),
        "analysis_notes": "Style extracted from lexical and syntactic features"
    }


@router.post("/transform")
async def transform_style(request: TransformRequest):
    """
    Transform a base style by adjusting specific dimensions.
    
    Start from a known translator's style and adjust dimensions
    to create a custom style.
    
    Example: Take Fagles and increase formality by 0.2
    """
    # Get base style
    if request.base_style.lower() == "custom":
        if not request.custom_style:
            raise HTTPException(
                status_code=400,
                detail="Must provide custom_style when base_style is 'custom'"
            )
        base = StyleVector(
            values=np.array([request.custom_style.get(d.name, 0.5) for d in StyleDimension]),
            name="custom"
        )
    else:
        profile = get_translator(request.base_style)
        if not profile:
            raise HTTPException(
                status_code=404,
                detail=f"Translator '{request.base_style}' not found"
            )
        base = profile.style
    
    # Apply adjustments
    result = base
    for dim_name, delta in request.adjustments.items():
        try:
            dim = StyleDimension[dim_name.upper()]
            result = result.adjust(dim, delta)
        except KeyError:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown dimension: {dim_name}"
            )
    
    # Find similar translators to result
    similar = find_similar_translators(result, k=3)
    
    return {
        "original_style": base.to_dict(),
        "transformed_style": result.to_dict(),
        "adjustments_applied": request.adjustments,
        "similar_to": [
            {"translator": s[0].name, "distance": s[1]}
            for s in similar
        ]
    }


@router.post("/arithmetic")
async def style_arithmetic(request: ArithmeticRequest):
    """
    Perform style vector arithmetic.
    
    Operations:
    - blend: α·style1 + (1-α)·style2
    - extrapolate: style1 + β·(style1 - style2) [exaggerate style1 vs style2]
    - adjust: style1 + δ·e_i [adjust single dimension]
    
    Example: extrapolate(Fagles, Lattimore, 1.5) = "more Fagles than Fagles"
    """
    # Get first style
    profile1 = get_translator(request.style1)
    if not profile1:
        raise HTTPException(status_code=404, detail=f"Translator '{request.style1}' not found")
    style1 = profile1.style
    
    if request.operation == "blend":
        if not request.style2:
            raise HTTPException(status_code=400, detail="blend requires style2")
        profile2 = get_translator(request.style2)
        if not profile2:
            raise HTTPException(status_code=404, detail=f"Translator '{request.style2}' not found")
        
        result = style1.blend(profile2.style, request.parameter)
        operation_desc = f"{request.parameter:.0%} {request.style1} + {1-request.parameter:.0%} {request.style2}"
        
    elif request.operation == "extrapolate":
        if not request.style2:
            raise HTTPException(status_code=400, detail="extrapolate requires style2")
        profile2 = get_translator(request.style2)
        if not profile2:
            raise HTTPException(status_code=404, detail=f"Translator '{request.style2}' not found")
        
        result = style1.extrapolate(profile2.style, request.parameter)
        operation_desc = f"{request.style1} + {request.parameter}×({request.style1} - {request.style2})"
        
    elif request.operation == "adjust":
        if not request.dimension:
            raise HTTPException(status_code=400, detail="adjust requires dimension")
        try:
            dim = StyleDimension[request.dimension.upper()]
        except KeyError:
            raise HTTPException(status_code=400, detail=f"Unknown dimension: {request.dimension}")
        
        result = style1.adjust(dim, request.parameter)
        operation_desc = f"{request.style1} + {request.parameter:+.2f}×{request.dimension}"
        
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown operation: {request.operation}. Use 'blend', 'extrapolate', or 'adjust'"
        )
    
    # Find similar translators
    similar = find_similar_translators(result, k=3)
    
    return {
        "operation": request.operation,
        "operation_description": operation_desc,
        "result": result.to_dict(),
        "similar_to": [
            {"translator": s[0].name, "distance": s[1]}
            for s in similar
        ]
    }


@router.post("/ltqi")
async def calculate_ltqi(request: LTQIRequest):
    """
    Calculate LOGOS Translation Quality Index for a translation.
    
    LTQI Components:
    - Semantic Fidelity (SF): How well meaning is preserved
    - Stylistic Consistency (SC): Uniformity of style throughout
    - Fluency (FL): Natural flow in target language
    - Cultural Accuracy (CA): Handling of cultural references
    
    Returns overall score (0-1) and letter grade.
    """
    # In production, this would use actual NLP models
    # For now, return computed estimate based on text features
    
    translation = request.translation
    
    # Simple heuristic scoring (replace with real models)
    word_count = len(translation.split())
    sentence_count = translation.count('.') + translation.count('!') + translation.count('?')
    avg_sentence_len = word_count / max(sentence_count, 1)
    
    # Estimate scores based on heuristics
    semantic_fidelity = min(0.95, 0.7 + 0.01 * min(word_count, 25))
    stylistic_consistency = 0.85 if 15 < avg_sentence_len < 30 else 0.70
    fluency = 0.80 if sentence_count > 0 else 0.50
    cultural_accuracy = 0.75
    
    # If translator style provided, adjust scores
    if request.translator_style:
        profile = get_translator(request.translator_style)
        if profile:
            # Higher fidelity translators get fidelity bonus
            if profile.style[StyleDimension.SOURCE_FIDELITY] > 0.7:
                semantic_fidelity = min(1.0, semantic_fidelity + 0.05)
    
    score = LTQIScore(
        semantic_fidelity=semantic_fidelity,
        stylistic_consistency=stylistic_consistency,
        fluency=fluency,
        cultural_accuracy=cultural_accuracy
    )
    
    return {
        "source_text_length": len(request.source_text),
        "translation_length": len(request.translation),
        "scores": score.to_dict(),
        "explanation": score.explain(),
        "recommendations": _generate_recommendations(score)
    }


def _generate_recommendations(score: LTQIScore) -> List[str]:
    """Generate improvement recommendations based on LTQI score."""
    recs = []
    
    if score.semantic_fidelity < 0.75:
        recs.append("Consider checking key terms against source for accuracy")
    
    if score.stylistic_consistency < 0.75:
        recs.append("Review for consistent register and tone throughout")
    
    if score.fluency < 0.75:
        recs.append("Consider smoothing sentence transitions and word choice")
    
    if score.cultural_accuracy < 0.75:
        recs.append("Review cultural references and proper nouns")
    
    if not recs:
        recs.append("Translation scores well across all dimensions")
    
    return recs


@router.post("/similar")
async def find_similar(request: SimilarRequest):
    """
    Find translators most similar to a given style vector.
    
    Useful for identifying which known translator's approach
    most closely matches an analyzed or custom style.
    """
    # Convert dict to StyleVector
    values = np.array([request.style.get(d.name, 0.5) for d in StyleDimension])
    style = StyleVector(values=values, name="query")
    
    similar = find_similar_translators(style, k=request.k, category=request.category)
    
    return {
        "query_style": style.to_dict(),
        "similar_translators": [
            {
                "name": s[0].name,
                "distance": float(s[1]),
                "style": s[0].style.to_dict()
            }
            for s in similar
        ]
    }


@router.get("/dimensions")
async def list_dimensions():
    """
    List all 20 style dimensions with descriptions.
    """
    descriptions = {
        StyleDimension.FORMALITY: ("Formality", "casual ←→ formal", "Level of formal vs colloquial language"),
        StyleDimension.ARCHAISM: ("Archaism", "modern ←→ archaic", "Use of archaic vs contemporary vocabulary"),
        StyleDimension.SENTENCE_LENGTH: ("Sentence Length", "terse ←→ elaborate", "Average sentence length and complexity"),
        StyleDimension.CLAUSE_COMPLEXITY: ("Clause Complexity", "simple ←→ nested", "Depth of subordinate clause nesting"),
        StyleDimension.WORD_ORDER_FREEDOM: ("Word Order Freedom", "strict English ←→ source-mirroring", "Adherence to English vs source word order"),
        StyleDimension.ANGLO_SAXON_PREF: ("Anglo-Saxon Preference", "Latinate ←→ Germanic", "Preference for Germanic vs Latinate vocabulary"),
        StyleDimension.FIGURATIVE_PRES: ("Figurative Preservation", "literal ←→ metaphoric", "Preservation of figures of speech"),
        StyleDimension.RHYTHMIC_REG: ("Rhythmic Regularity", "prose ←→ poetic", "Regularity of rhythm and meter"),
        StyleDimension.SOURCE_FIDELITY: ("Source Fidelity", "free ←→ literal", "Closeness to source text structure"),
        StyleDimension.ADDITION_TOLERANCE: ("Addition Tolerance", "minimal ←→ expansive", "Willingness to add clarifying content"),
        StyleDimension.OMISSION_TOLERANCE: ("Omission Tolerance", "complete ←→ selective", "Willingness to omit source content"),
        StyleDimension.REGISTER_CONSISTENCY: ("Register Consistency", "varied ←→ uniform", "Consistency of stylistic register"),
        StyleDimension.LEXICAL_DENSITY: ("Lexical Density", "sparse ←→ dense", "Information density per sentence"),
        StyleDimension.SYNTACTIC_MIRROR: ("Syntactic Mirroring", "English-native ←→ source-following", "Following source syntax patterns"),
        StyleDimension.PARTICLE_RENDERING: ("Particle Rendering", "omit ←→ explicit", "Rendering of Greek/Latin particles"),
        StyleDimension.PROPER_NAME_HANDLING: ("Proper Name Handling", "Anglicize ←→ preserve", "Treatment of proper nouns"),
        StyleDimension.DIALECT_FIDELITY: ("Dialect Fidelity", "standardize ←→ preserve", "Preservation of dialect features"),
        StyleDimension.SEMANTIC_DRIFT: ("Semantic Drift Tolerance", "strict ←→ interpretive", "Allowance for interpretive freedom"),
        StyleDimension.INTERTEXT_PRES: ("Intertext Preservation", "ignore ←→ highlight", "Attention to intertextual references"),
        StyleDimension.ERA_BIAS: ("Era Bias", "contemporary ←→ period-appropriate", "Contemporary vs period-appropriate idiom"),
    }
    
    return {
        "count": len(StyleDimension),
        "dimensions": [
            {
                "id": dim.value,
                "name": dim.name,
                "display_name": descriptions[dim][0],
                "scale": descriptions[dim][1],
                "description": descriptions[dim][2]
            }
            for dim in StyleDimension
        ]
    }


# =============================================================================
# INTEGRATION FUNCTION
# =============================================================================

def create_style_router() -> APIRouter:
    """Factory function to create the style API router."""
    return router


if __name__ == "__main__":
    # Test the router
    import uvicorn
    from fastapi import FastAPI
    
    app = FastAPI(title="LOGOS Translation Style API")
    app.include_router(router)
    
    uvicorn.run(app, host="0.0.0.0", port=8004)
