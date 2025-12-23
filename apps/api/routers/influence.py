from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

router = APIRouter(prefix="/influence-tracer", tags=["Influence Tracer"])

# Pydantic models
class Author(BaseModel):
    name: str
    period: str
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    major_works: List[str]

class InfluenceConnection(BaseModel):
    source_author: str
    target_author: str
    source_work: str
    target_work: str
    connection_type: str
    confidence_score: float
    evidence_passages: List[str]
    semantic_similarity: float

class InfluenceChain(BaseModel):
    chain_id: str
    source_author: str
    target_author: str
    path: List[str]
    connections: List[InfluenceConnection]
    total_confidence: float
    chain_length: int

class TraceRequest(BaseModel):
    text: str
    author: Optional[str] = None
    work: Optional[str] = None
    max_influences: int = 10
    min_confidence: float = 0.6

class TraceResult(BaseModel):
    input_text: str
    detected_influences: List[InfluenceConnection]
    suggested_authors: List[str]
    semantic_matches: List[Dict[str, Any]]
    trace_timestamp: datetime

class AuthorInfluences(BaseModel):
    author: Author
    influenced_by: List[InfluenceConnection]
    influences_on: List[InfluenceConnection]
    influence_score: float
    network_centrality: float

# Mock data for demo
DEMO_AUTHORS = {
    "Homer": Author(
        name="Homer",
        period="Archaic",
        birth_year=-800,
        death_year=-750,
        major_works=["Iliad", "Odyssey"]
    ),
    "Virgil": Author(
        name="Virgil",
        period="Augustan",
        birth_year=-70,
        death_year=-19,
        major_works=["Aeneid", "Georgics", "Eclogues"]
    ),
    "Dante": Author(
        name="Dante",
        period="Medieval",
        birth_year=1265,
        death_year=1321,
        major_works=["Divine Comedy", "Vita Nuova"]
    )
}

DEMO_CONNECTIONS = [
    InfluenceConnection(
        source_author="Homer",
        target_author="Virgil",
        source_work="Iliad",
        target_work="Aeneid",
        connection_type="epic_structure",
        confidence_score=0.95,
        evidence_passages=[
            "Sing, goddess, the rage of Achilles (Il. 1.1)",
            "I sing of arms and the man (Aen. 1.1)"
        ],
        semantic_similarity=0.87
    ),
    InfluenceConnection(
        source_author="Virgil",
        target_author="Dante",
        source_work="Aeneid",
        target_work="Divine Comedy",
        connection_type="underworld_journey",
        confidence_score=0.92,
        evidence_passages=[
            "Aeneas descends to Hades (Aen. 6)",
            "Dante's journey through Hell (Inf. 1-34)"
        ],
        semantic_similarity=0.84
    )
]

@router.get("/author/{name}", response_model=AuthorInfluences)
async def get_author_influences(
    name: str,
    include_indirect: bool = Query(False, description="Include indirect influences"),
    min_confidence: float = Query(0.5, description="Minimum confidence threshold")
):
    """
    Get comprehensive influence data for a specific author.
    Analyzes both influences on the author and the author's influence on others.
    """
    author_key = name.title()
    
    if author_key not in DEMO_AUTHORS:
        raise HTTPException(status_code=404, detail=f"Author '{name}' not found in database")
    
    author = DEMO_AUTHORS[author_key]
    
    # Filter connections by confidence
    influenced_by = [conn for conn in DEMO_CONNECTIONS 
                    if conn.target_author == author_key and conn.confidence_score >= min_confidence]
    
    influences_on = [conn for conn in DEMO_CONNECTIONS 
                    if conn.source_author == author_key and conn.confidence_score >= min_confidence]
    
    # Calculate influence metrics
    influence_score = len(influences_on) * 0.6 + len(influenced_by) * 0.4
    network_centrality = min(influence_score / 10.0, 1.0)
    
    return AuthorInfluences(
        author=author,
        influenced_by=influenced_by,
        influences_on=influences_on,
        influence_score=influence_score,
        network_centrality=network_centrality
    )

@router.get("/chain/{source}/{target}", response_model=InfluenceChain)
async def get_influence_chain(
    source: str,
    target: str,
    max_depth: int = Query(5, description="Maximum chain length to explore"),
    algorithm: str = Query("shortest_path", description="Pathfinding algorithm")
):
    """
    Trace the influence chain between two authors.
    Demonstrates Homer → Virgil → Dante transmission.
    """
    source_key = source.title()
    target_key = target.title()
    
    # Demo: Homer → Virgil → Dante chain
    if source_key == "Homer" and target_key == "Dante":
        chain_connections = DEMO_CONNECTIONS
        path = ["Homer", "Virgil", "Dante"]
        total_confidence = sum(conn.confidence_score for conn in chain_connections) / len(chain_connections)
        
        return InfluenceChain(
            chain_id=f"chain_{source_key}_{target_key}",
            source_author=source_key,
            target_author=target_key,
            path=path,
            connections=chain_connections,
            total_confidence=total_confidence,
            chain_length=len(path) - 1
        )
    
    # Handle other combinations
    direct_connection = None
    for conn in DEMO_CONNECTIONS:
        if conn.source_author == source_key and conn.target_author == target_key:
            direct_connection = conn
            break
    
    if direct_connection:
        return InfluenceChain(
            chain_id=f"direct_{source_key}_{target_key}",
            source_author=source_key,
            target_author=target_key,
            path=[source_key, target_key],
            connections=[direct_connection],
            total_confidence=direct_connection.confidence_score,
            chain_length=1
        )
    
    raise HTTPException(
        status_code=404, 
        detail=f"No influence chain found between {source} and {target}"
    )

@router.post("/trace", response_model=TraceResult)
async def trace_text_influences(request: TraceRequest):
    """
    Trace influences in a given text using AI semantic analysis.
    Identifies potential source authors and works based on style and content.
    """
    # Simulate AI analysis
    detected_influences = []
    suggested_authors = []
    semantic_matches = []
    
    # Simple keyword-based demo matching
    text_lower = request.text.lower()
    
    if any(word in text_lower for word in ["arms", "man", "sing", "war"]):
        epic_influence = InfluenceConnection(
            source_author="Homer",
            target_author="Unknown",
            source_work="Iliad",
            target_work="User Text",
            connection_type="epic_formulation",
            confidence_score=0.78,
            evidence_passages=[request.text[:100] + "..."],
            semantic_similarity=0.75
        )
        detected_influences.append(epic_influence)
        suggested_authors.append("Homer")
        
        semantic_matches.append({
            "passage": "Sing, goddess, the rage of Achilles",
            "similarity_score": 0.75,
            "source": "Iliad 1.1",
            "match_type": "invocation_pattern"
        })
    
    if any(word in text_lower for word in ["journey", "dark", "lost", "guide"]):
        journey_influence = InfluenceConnection(
            source_author="Dante",
            target_author="Unknown",
            source_work="Divine Comedy",
            target_work="User Text",
            connection_type="spiritual_journey",
            confidence_score=0.72,
            evidence_passages=[request.text[:100] + "..."],
            semantic_similarity=0.69
        )
        detected_influences.append(journey_influence)
        suggested_authors.append("Dante")
        
        semantic_matches.append({
            "passage": "In the middle of our life's journey",
            "similarity_score": 0.69,
            "source": "Inferno 1.1",
            "match_type": "journey_motif"
        })
    
    # Filter by confidence threshold
    detected_influences = [inf for inf in detected_influences 
                          if inf.confidence_score >= request.min_confidence]
    
    # Limit results
    detected_influences = detected_influences[:request.max_influences]
    
    return TraceResult(
        input_text=request.text,
        detected_influences=detected_influences,
        suggested_authors=list(set(suggested_authors)),
        semantic_matches=semantic_matches,
        trace_timestamp=datetime.now()
    )

@router.get("/stats")
async def get_influence_stats():
    """Get overall statistics about the influence network."""
    return {
        "total_authors": len(DEMO_AUTHORS),
        "total_connections": len(DEMO_CONNECTIONS),
        "coverage_period": "800 BCE - 1321 CE",
        "most_influential": "Homer",
        "strongest_connection": max(DEMO_CONNECTIONS, key=lambda x: x.confidence_score).dict(),
        "network_density": 0.67,
        "average_confidence": sum(conn.confidence_score for conn in DEMO_CONNECTIONS) / len(DEMO_CONNECTIONS)
    }