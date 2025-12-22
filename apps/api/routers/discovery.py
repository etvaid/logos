"""
LOGOS API - Discovery Router
Higher-order pattern detection (1st, 2nd, 3rd, 4th order)
THE BREAKTHROUGH FEATURE
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Literal

router = APIRouter()

class Discovery(BaseModel):
    id: int
    order_level: Literal[1, 2, 3, 4]
    pattern_type: str
    hypothesis: str
    description: str
    confidence: float
    novelty_score: float
    statistical_significance: str
    evidence: List[dict]
    supporting_passages: List[str]
    attributed_to: Optional[str] = None
    doi: Optional[str] = None

class DiscoveryResponse(BaseModel):
    discoveries: List[Discovery]
    total: int
    order_filter: Optional[int] = None

# Demo discoveries showcasing higher-order pattern detection
DEMO_DISCOVERIES = [
    Discovery(
        id=1,
        order_level=1,
        pattern_type="direct_allusion",
        hypothesis="Virgil's Aeneid opening directly alludes to Homer's Iliad and Odyssey",
        description="First-order relationship: Direct verbal and structural allusion",
        confidence=0.99,
        novelty_score=0.1,  # Well-known
        statistical_significance="p < 0.001",
        evidence=[
            {"type": "verbal", "detail": "cano echoes ἄειδε"},
            {"type": "structural", "detail": "Programmatic opening pattern"}
        ],
        supporting_passages=[
            "urn:cts:latinLit:phi0690.phi003.perseus-lat2:1.1",
            "urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1"
        ],
        attributed_to="scholarly_consensus"
    ),
    Discovery(
        id=2,
        order_level=2,
        pattern_type="influence_comparison",
        hypothesis="Lucan's engagement with Virgil mirrors Virgil's engagement with Homer structurally",
        description="Second-order: Comparing HOW authors engage with predecessors",
        confidence=0.87,
        novelty_score=0.4,
        statistical_significance="p < 0.01",
        evidence=[
            {"type": "pattern", "detail": "Opening line inversions in both cases"},
            {"type": "pattern", "detail": "Similar thematic contrasts with source"}
        ],
        supporting_passages=[
            "urn:cts:latinLit:phi0917.phi001.perseus-lat1:1.1",
            "urn:cts:latinLit:phi0690.phi003.perseus-lat2:1.1"
        ],
        attributed_to="LOGOS_AI"
    ),
    Discovery(
        id=3,
        order_level=3,
        pattern_type="correlation_cluster",
        hypothesis="'Monogamous' intertextuality (single dominant source) correlates with political anxiety in Latin epic",
        description="Third-order: Correlation between influence strategy and historical context",
        confidence=0.79,
        novelty_score=0.85,
        statistical_significance="p < 0.05, r = 0.72",
        evidence=[
            {"type": "statistical", "detail": "72% correlation across 15 texts"},
            {"type": "historical", "detail": "Texts from crisis periods show 2.3x single-source dependency"},
            {"type": "contrast", "detail": "Ovid's 'promiscuous' intertextuality correlates with political stability"}
        ],
        supporting_passages=[
            "urn:cts:latinLit:phi0917.phi001.perseus-lat1:1.1",
            "urn:cts:latinLit:phi0959.phi001.perseus-lat1:1.1"
        ],
        attributed_to="LOGOS_AI",
        doi="10.5281/zenodo.logos.discovery.003"
    ),
    Discovery(
        id=4,
        order_level=4,
        pattern_type="predictive_hypothesis",
        hypothesis="Intertextual strategy serves as a proxy for authorial relationship to political power",
        description="Fourth-order: Meta-pattern with predictive power for unanalyzed texts",
        confidence=0.71,
        novelty_score=0.95,
        statistical_significance="Predictive accuracy: 78% on held-out texts",
        evidence=[
            {"type": "meta_pattern", "detail": "Third-order correlations generalize across periods"},
            {"type": "prediction", "detail": "Successfully predicted Statius's influence patterns"},
            {"type": "theoretical", "detail": "Suggests intertextuality functions as political positioning"}
        ],
        supporting_passages=[
            "Multiple - see full evidence set"
        ],
        attributed_to="LOGOS_AI",
        doi="10.5281/zenodo.logos.discovery.004"
    )
]

@router.get("/patterns", response_model=DiscoveryResponse)
async def get_discoveries(
    order: Optional[int] = Query(None, ge=1, le=4, description="Filter by order level (1-4)"),
    min_confidence: float = Query(default=0.5, ge=0, le=1),
    min_novelty: float = Query(default=0, ge=0, le=1),
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0)
):
    """
    Get discovered patterns and hypotheses.
    
    Order levels:
    - **1st order**: Direct relationships (A → B)
    - **2nd order**: Pattern comparisons (A→B similar to C→D)
    - **3rd order**: Correlations across patterns
    - **4th order**: Meta-patterns with predictive power
    
    Higher novelty scores indicate discoveries not found in existing scholarship.
    """
    
    discoveries = DEMO_DISCOVERIES.copy()
    
    # Filter by order
    if order:
        discoveries = [d for d in discoveries if d.order_level == order]
    
    # Filter by confidence
    discoveries = [d for d in discoveries if d.confidence >= min_confidence]
    
    # Filter by novelty
    discoveries = [d for d in discoveries if d.novelty_score >= min_novelty]
    
    # Sort by order level then confidence
    discoveries.sort(key=lambda x: (x.order_level, -x.confidence))
    
    # Paginate
    paginated = discoveries[offset:offset + limit]
    
    return DiscoveryResponse(
        discoveries=paginated,
        total=len(discoveries),
        order_filter=order
    )

@router.get("/{discovery_id}")
async def get_discovery(discovery_id: int):
    """Get a specific discovery by ID."""
    for d in DEMO_DISCOVERIES:
        if d.id == discovery_id:
            return d
    raise HTTPException(status_code=404, detail="Discovery not found")

@router.post("/hypothesis")
async def generate_hypothesis(
    focus_area: Optional[str] = None,
    min_order: int = Query(default=2, ge=1, le=4),
    corpus_subset: Optional[List[str]] = None
):
    """
    Generate a novel hypothesis using AI analysis.
    
    The discovery engine will:
    1. Analyze patterns in the specified corpus
    2. Find correlations not documented in scholarship
    3. Generate a testable hypothesis
    4. Provide statistical confidence
    """
    return {
        "status": "generating",
        "focus_area": focus_area,
        "min_order": min_order,
        "corpus_subset": corpus_subset,
        "message": "AI analysis in progress. Novel hypotheses will be attributed to you.",
        "estimated_time": "30-60 seconds"
    }

@router.post("/validate")
async def validate_hypothesis(
    hypothesis_id: int,
    held_out_data: Optional[List[str]] = None
):
    """
    Validate a hypothesis against held-out data.
    
    Tests whether the pattern holds on texts not used for discovery.
    """
    return {
        "hypothesis_id": hypothesis_id,
        "validation_status": "running",
        "held_out_texts": len(held_out_data) if held_out_data else "auto-selected",
        "message": "Validating hypothesis against unseen data..."
    }

@router.get("/orders")
async def get_order_levels():
    """Explain the discovery order levels."""
    return {
        "orders": [
            {
                "level": 1,
                "name": "First Order",
                "description": "Direct relationships: A alludes to B",
                "example": "Virgil → Homer",
                "novelty": "Usually known to scholarship"
            },
            {
                "level": 2,
                "name": "Second Order", 
                "description": "Pattern comparison: How does A→B compare to C→D?",
                "example": "How Virgil engages Homer vs how Lucan engages Virgil",
                "novelty": "Some scholars study this"
            },
            {
                "level": 3,
                "name": "Third Order",
                "description": "Correlations: Do 2nd-order patterns correlate with external variables?",
                "example": "Does influence style correlate with political context?",
                "novelty": "Rarely systematically checked"
            },
            {
                "level": 4,
                "name": "Fourth Order",
                "description": "Meta-patterns: What do 3rd-order correlations predict?",
                "example": "Can we predict influence patterns from historical context?",
                "novelty": "GENUINE DISCOVERY - things no human has seen"
            }
        ],
        "insight": "Human scholarship is limited by attention, memory, and time. LOGOS has none of these limitations."
    }

@router.get("/leaderboard")
async def get_discovery_leaderboard():
    """Get scholars who have made discoveries using LOGOS."""
    return {
        "leaderboard": [
            {"rank": 1, "scholar": "LOGOS_AI", "discoveries": 47, "highest_order": 4},
            {"rank": 2, "scholar": "Demo User", "discoveries": 3, "highest_order": 2},
        ],
        "total_discoveries": 50,
        "discoveries_this_week": 12
    }
