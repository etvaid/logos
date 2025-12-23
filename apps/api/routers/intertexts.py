from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from enum import Enum

router = APIRouter(prefix="/intertextuality", tags=["intertextuality"])

class IntertextType(str, Enum):
    VERBAL = "verbal"
    STRUCTURAL = "structural"
    THEMATIC = "thematic"
    FORMULAIC = "formulaic"

class IntertextualConnection(BaseModel):
    source_urn: str
    target_urn: str
    connection_type: IntertextType
    confidence_score: float
    source_text: str
    target_text: str
    description: Optional[str] = None
    author: Optional[str] = None
    work: Optional[str] = None

class DetectionRequest(BaseModel):
    text: str
    language: Optional[str] = "latin"
    min_confidence: Optional[float] = 0.5
    max_results: Optional[int] = 10
    connection_types: Optional[List[IntertextType]] = None

class DetectionResponse(BaseModel):
    text: str
    connections: List[IntertextualConnection]
    total_found: int
    processing_time: float

class PassageIntertexts(BaseModel):
    urn: str
    text: str
    intertexts: List[IntertextualConnection]
    total_count: int

# Mock database of intertextual connections
MOCK_INTERTEXTS = {
    "urn:cts:latinLit:phi0690.phi003.perseus-lat1:1.1": [
        IntertextualConnection(
            source_urn="urn:cts:latinLit:phi0690.phi003.perseus-lat1:1.1",
            target_urn="urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1",
            connection_type=IntertextType.STRUCTURAL,
            confidence_score=0.89,
            source_text="Arma virumque cano, Troiae qui primus ab oris",
            target_text="μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
            description="Epic opening formula with imperative to Muse",
            author="Homer",
            work="Iliad"
        ),
        IntertextualConnection(
            source_urn="urn:cts:latinLit:phi0690.phi003.perseus-lat1:1.1",
            target_urn="urn:cts:greekLit:tlg0012.tlg002.perseus-grc1:1.1",
            connection_type=IntertextType.VERBAL,
            confidence_score=0.92,
            source_text="Arma virumque cano, Troiae qui primus ab oris",
            target_text="ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ",
            description="Focus on the hero (virum/ἄνδρα) in epic opening",
            author="Homer",
            work="Odyssey"
        )
    ]
}

MOCK_TEXTS = {
    "urn:cts:latinLit:phi0690.phi003.perseus-lat1:1.1": "Arma virumque cano, Troiae qui primus ab oris"
}

@router.get("/{urn}", response_model=PassageIntertexts)
async def get_passage_intertexts(
    urn: str,
    connection_type: Optional[IntertextType] = Query(None, description="Filter by connection type"),
    min_confidence: Optional[float] = Query(0.0, ge=0.0, le=1.0, description="Minimum confidence score"),
    max_results: Optional[int] = Query(None, gt=0, description="Maximum number of results")
):
    """
    Get intertextual connections for a specific passage identified by CTS URN.
    
    Returns all known intertextual connections with the specified passage,
    including confidence scores and connection types.
    """
    if urn not in MOCK_INTERTEXTS:
        raise HTTPException(status_code=404, detail=f"No intertexts found for URN: {urn}")
    
    intertexts = MOCK_INTERTEXTS[urn].copy()
    
    # Apply filters
    if connection_type:
        intertexts = [it for it in intertexts if it.connection_type == connection_type]
    
    if min_confidence > 0:
        intertexts = [it for it in intertexts if it.confidence_score >= min_confidence]
    
    # Sort by confidence score (descending)
    intertexts.sort(key=lambda x: x.confidence_score, reverse=True)
    
    # Limit results
    if max_results:
        intertexts = intertexts[:max_results]
    
    text = MOCK_TEXTS.get(urn, "")
    
    return PassageIntertexts(
        urn=urn,
        text=text,
        intertexts=intertexts,
        total_count=len(intertexts)
    )

@router.post("/detect", response_model=DetectionResponse)
async def detect_allusions(request: DetectionRequest):
    """
    Detect potential intertextual connections and allusions in the provided text.
    
    Uses various algorithms to identify verbal, structural, and thematic connections
    with known classical texts in the corpus.
    """
    import time
    start_time = time.time()
    
    # Mock detection logic
    detected_connections = []
    
    # Simple keyword-based detection for demo
    if "arma" in request.text.lower() and "cano" in request.text.lower():
        detected_connections.extend([
            IntertextualConnection(
                source_urn="urn:cts:user:input:1",
                target_urn="urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1",
                connection_type=IntertextType.STRUCTURAL,
                confidence_score=0.89,
                source_text=request.text[:50] + "..." if len(request.text) > 50 else request.text,
                target_text="μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
                description="Epic opening formula reminiscent of Homeric tradition",
                author="Homer",
                work="Iliad"
            ),
            IntertextualConnection(
                source_urn="urn:cts:user:input:1",
                target_urn="urn:cts:greekLit:tlg0012.tlg002.perseus-grc1:1.1",
                connection_type=IntertextType.VERBAL,
                confidence_score=0.92,
                source_text=request.text[:50] + "..." if len(request.text) > 50 else request.text,
                target_text="ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ",
                description="Hero-focused epic opening",
                author="Homer",
                work="Odyssey"
            )
        ])
    
    # Apply filters
    if request.connection_types:
        detected_connections = [
            conn for conn in detected_connections 
            if conn.connection_type in request.connection_types
        ]
    
    if request.min_confidence:
        detected_connections = [
            conn for conn in detected_connections 
            if conn.confidence_score >= request.min_confidence
        ]
    
    # Sort by confidence score
    detected_connections.sort(key=lambda x: x.confidence_score, reverse=True)
    
    # Limit results
    if request.max_results:
        detected_connections = detected_connections[:request.max_results]
    
    processing_time = time.time() - start_time
    
    return DetectionResponse(
        text=request.text,
        connections=detected_connections,
        total_found=len(detected_connections),
        processing_time=processing_time
    )

@router.get("/types", response_model=List[str])
async def get_connection_types():
    """Get all available intertextual connection types."""
    return [connection_type.value for connection_type in IntertextType]

@router.get("/{urn}/statistics")
async def get_intertext_statistics(urn: str):
    """Get statistical overview of intertextual connections for a passage."""
    if urn not in MOCK_INTERTEXTS:
        raise HTTPException(status_code=404, detail=f"No intertexts found for URN: {urn}")
    
    intertexts = MOCK_INTERTEXTS[urn]
    
    # Calculate statistics
    type_counts = {}
    confidence_sum = 0
    authors = set()
    works = set()
    
    for intertext in intertexts:
        # Count by type
        type_str = intertext.connection_type.value
        type_counts[type_str] = type_counts.get(type_str, 0) + 1
        
        confidence_sum += intertext.confidence_score
        
        if intertext.author:
            authors.add(intertext.author)
        if intertext.work:
            works.add(intertext.work)
    
    return {
        "urn": urn,
        "total_connections": len(intertexts),
        "average_confidence": confidence_sum / len(intertexts) if intertexts else 0,
        "connections_by_type": type_counts,
        "unique_authors": len(authors),
        "unique_works": len(works),
        "authors_referenced": list(authors),
        "works_referenced": list(works)
    }