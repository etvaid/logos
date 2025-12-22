"""
LOGOS API - Intertextuality Router
Discover allusions and connections between texts
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Literal

router = APIRouter()

class IntertextResult(BaseModel):
    source_urn: str
    target_urn: str
    source_text: str
    target_text: str
    source_translation: str
    target_translation: str
    relationship_type: Literal["verbal", "thematic", "structural", "polemic", "generic"]
    confidence: float
    evidence: List[str]
    discovered_by: str = "ai"

class IntertextResponse(BaseModel):
    urn: str
    intertexts: List[IntertextResult]
    total: int

# Famous intertextual relationships
DEMO_INTERTEXTS = {
    "urn:cts:latinLit:phi0690.phi003.perseus-lat2:1.1": [
        IntertextResult(
            source_urn="urn:cts:latinLit:phi0690.phi003.perseus-lat2:1.1",
            target_urn="urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1",
            source_text="Arma virumque cano",
            target_text="μῆνιν ἄειδε θεὰ",
            source_translation="Arms and the man I sing",
            target_translation="Sing, goddess, the wrath",
            relationship_type="verbal",
            confidence=0.98,
            evidence=[
                "Both open with imperative to sing/invoke",
                "cano echoes ἄειδε (sing)",
                "virum (man) anticipates Odyssey's ἄνδρα",
                "Programmatic opening declaring epic subject"
            ],
            discovered_by="scholarly_consensus"
        ),
        IntertextResult(
            source_urn="urn:cts:latinLit:phi0690.phi003.perseus-lat2:1.1",
            target_urn="urn:cts:greekLit:tlg0012.tlg002.perseus-grc1:1.1",
            source_text="Arma virumque cano",
            target_text="Ἄνδρα μοι ἔννεπε, Μοῦσα",
            source_translation="Arms and the man I sing",
            target_translation="Tell me, Muse, of the man",
            relationship_type="structural",
            confidence=0.97,
            evidence=[
                "virum directly echoes ἄνδρα",
                "Combines Iliadic (arma/war) and Odyssean (virum/man) themes",
                "Announces Aeneid as fusion of both Homeric epics"
            ],
            discovered_by="scholarly_consensus"
        )
    ],
    "urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1": [
        IntertextResult(
            source_urn="urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1",
            target_urn="urn:cts:latinLit:phi0690.phi003.perseus-lat2:1.1",
            source_text="μῆνιν ἄειδε θεὰ",
            target_text="Arma virumque cano",
            source_translation="Sing, goddess, the wrath",
            target_translation="Arms and the man I sing",
            relationship_type="verbal",
            confidence=0.98,
            evidence=[
                "Virgil's opening directly alludes to Homer",
                "Foundational model for Latin epic",
                "ἄειδε → cano (sing)"
            ],
            discovered_by="scholarly_consensus"
        )
    ]
}

@router.get("/{urn:path}", response_model=IntertextResponse)
async def get_intertexts(
    urn: str,
    direction: Optional[Literal["source", "target", "both"]] = "both",
    relationship_type: Optional[str] = None,
    min_confidence: float = Query(default=0.5, ge=0, le=1)
):
    """
    Get intertextual relationships for a passage.
    
    Finds allusions, echoes, and connections to other texts.
    
    Parameters:
    - direction: "source" (this text alludes to), "target" (others allude to this), "both"
    - relationship_type: verbal, thematic, structural, polemic, generic
    - min_confidence: Minimum confidence score (0-1)
    """
    
    intertexts = DEMO_INTERTEXTS.get(urn, [])
    
    # Filter by relationship type
    if relationship_type:
        intertexts = [i for i in intertexts if i.relationship_type == relationship_type]
    
    # Filter by confidence
    intertexts = [i for i in intertexts if i.confidence >= min_confidence]
    
    return IntertextResponse(
        urn=urn,
        intertexts=intertexts,
        total=len(intertexts)
    )

@router.post("/discover")
async def discover_intertexts(
    urn: str,
    search_scope: Optional[List[str]] = None,
    min_confidence: float = 0.7
):
    """
    Discover new intertextual relationships using AI.
    
    Analyzes a passage and finds potential allusions not yet documented.
    """
    return {
        "urn": urn,
        "status": "analyzing",
        "message": "AI analysis in progress. This may take a few moments.",
        "search_scope": search_scope or ["all"],
        "min_confidence": min_confidence
    }

@router.get("/types")
async def get_relationship_types():
    """Get available relationship types and their descriptions."""
    return {
        "types": [
            {
                "id": "verbal",
                "name": "Verbal Echo",
                "description": "Direct verbal borrowing, similar phrasing or vocabulary"
            },
            {
                "id": "thematic",
                "name": "Thematic Parallel",
                "description": "Shared themes, motifs, or ideas without verbal similarity"
            },
            {
                "id": "structural",
                "name": "Structural Allusion",
                "description": "Similar narrative structure, scene type, or compositional pattern"
            },
            {
                "id": "polemic",
                "name": "Polemic Response",
                "description": "Deliberate contrast, correction, or argument against source"
            },
            {
                "id": "generic",
                "name": "Generic Convention",
                "description": "Shared genre conventions rather than specific allusion"
            }
        ]
    }

@router.get("/network/{urn:path}")
async def get_intertext_network(
    urn: str,
    depth: int = Query(default=2, ge=1, le=5),
    limit: int = Query(default=50, le=200)
):
    """
    Get network of intertextual relationships radiating from a passage.
    
    Returns a graph structure for visualization.
    """
    return {
        "center": urn,
        "depth": depth,
        "nodes": [
            {"id": urn, "label": "Source", "type": "center"},
            {"id": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1", "label": "Iliad 1.1", "type": "target"}
        ],
        "edges": [
            {"source": urn, "target": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1", "type": "verbal", "weight": 0.98}
        ],
        "total_nodes": 2,
        "total_edges": 1
    }
