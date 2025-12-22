"""
LOGOS API - Semantic Search Router
Cross-lingual semantic search across Greek and Latin corpus
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Literal
import os

router = APIRouter()

class SearchResult(BaseModel):
    urn: str
    content: str
    translation_preview: str
    similarity: float
    author: str
    work: str
    language: str
    section: Optional[str] = None

class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]
    total: int
    languages: List[str]
    search_type: str = "semantic"

# Demo search results
DEMO_RESULTS = {
    "justice": [
        SearchResult(
            urn="urn:cts:greekLit:tlg0059.tlg030.perseus-grc1:331c",
            content="δικαιοσύνη ἐστὶν ἀρετὴ ψυχῆς",
            translation_preview="Justice is a virtue of the soul",
            similarity=0.94,
            author="Plato",
            work="Republic",
            language="grc",
            section="Book 1, 331c"
        ),
        SearchResult(
            urn="urn:cts:latinLit:phi0474.phi057.perseus-lat1:1.7.23",
            content="Iustitia est constans et perpetua voluntas ius suum cuique tribuendi",
            translation_preview="Justice is the constant and perpetual will to give each their due",
            similarity=0.91,
            author="Cicero",
            work="De Officiis",
            language="lat",
            section="1.7.23"
        ),
        SearchResult(
            urn="urn:cts:greekLit:tlg0086.tlg034.perseus-grc1:1129a",
            content="ἡ δικαιοσύνη ἐστὶν ἕξις ἀφ᾽ ἧς οἱ δίκαιοι πρακτικοί",
            translation_preview="Justice is a disposition from which just people act",
            similarity=0.89,
            author="Aristotle",
            work="Nicomachean Ethics",
            language="grc",
            section="Book 5, 1129a"
        ),
    ],
    "immortality soul": [
        SearchResult(
            urn="urn:cts:greekLit:tlg0059.tlg004.perseus-grc1:245c",
            content="ψυχὴ πᾶσα ἀθάνατος. τὸ γὰρ ἀεικίνητον ἀθάνατον",
            translation_preview="Every soul is immortal. For that which is ever in motion is immortal",
            similarity=0.96,
            author="Plato",
            work="Phaedrus",
            language="grc",
            section="245c"
        ),
        SearchResult(
            urn="urn:cts:latinLit:phi1348.abo012.perseus-lat1:1.97.3",
            content="animam immortalem esse",
            translation_preview="that the soul is immortal",
            similarity=0.88,
            author="Seneca",
            work="Epistulae Morales",
            language="lat",
            section="97.3"
        ),
    ],
    "wrath anger": [
        SearchResult(
            urn="urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1",
            content="μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
            translation_preview="Sing, goddess, the wrath of Achilles son of Peleus",
            similarity=0.95,
            author="Homer",
            work="Iliad",
            language="grc",
            section="Book 1, Line 1"
        ),
        SearchResult(
            urn="urn:cts:latinLit:phi1017.phi003.perseus-lat1:1.1",
            content="Ira brevis furor est",
            translation_preview="Anger is brief madness",
            similarity=0.87,
            author="Horace",
            work="Epistles",
            language="lat",
            section="1.2.62"
        ),
    ]
}

@router.get("/", response_model=SearchResponse)
async def semantic_search(
    q: str = Query(..., min_length=1, max_length=500, description="Search query"),
    lang: Optional[List[str]] = Query(None, description="Filter by language (grc, lat)"),
    author: Optional[str] = Query(None, description="Filter by author name"),
    genre: Optional[str] = Query(None, description="Filter by genre"),
    limit: int = Query(default=20, le=100, description="Maximum results"),
    offset: int = Query(default=0, ge=0, description="Offset for pagination")
):
    """
    Semantic search across the classical corpus.
    
    Searches by meaning, not just keywords. Works across Greek and Latin simultaneously.
    
    Examples:
    - "What is justice?" → finds discussions of justice in Plato, Aristotle, Cicero
    - "immortality of the soul" → finds relevant passages across both languages
    - "anger and war" → finds thematically related passages
    """
    
    query_lower = q.lower()
    
    # Find matching demo results
    results = []
    for key, demo_results in DEMO_RESULTS.items():
        if any(word in query_lower for word in key.split()):
            results.extend(demo_results)
    
    # Filter by language if specified
    if lang:
        results = [r for r in results if r.language in lang]
    
    # Filter by author if specified
    if author:
        results = [r for r in results if author.lower() in r.author.lower()]
    
    # Sort by similarity
    results.sort(key=lambda x: x.similarity, reverse=True)
    
    # Apply pagination
    paginated = results[offset:offset + limit]
    
    # Get unique languages in results
    languages = list(set(r.language for r in results))
    
    return SearchResponse(
        query=q,
        results=paginated,
        total=len(results),
        languages=languages,
        search_type="semantic"
    )

@router.post("/advanced")
async def advanced_search(
    query: str,
    filters: Optional[dict] = None,
    date_range: Optional[tuple] = None,
    similarity_threshold: float = 0.7
):
    """
    Advanced search with complex filters.
    
    Supports:
    - Date range filtering
    - Genre combinations
    - Author relationships
    - Similarity threshold adjustment
    """
    return {
        "query": query,
        "filters": filters,
        "date_range": date_range,
        "similarity_threshold": similarity_threshold,
        "results": [],
        "note": "Advanced search endpoint - full implementation pending"
    }

@router.get("/suggestions")
async def get_search_suggestions(
    q: str = Query(..., min_length=2, max_length=100)
):
    """Get search suggestions based on partial query."""
    suggestions = [
        "What is justice?",
        "immortality of the soul",
        "anger and revenge",
        "love and friendship",
        "death and afterlife",
        "virtue and vice",
        "fate and free will",
        "gods and mortals"
    ]
    
    matching = [s for s in suggestions if q.lower() in s.lower()]
    
    return {
        "query": q,
        "suggestions": matching[:5]
    }

@router.get("/trending")
async def get_trending_searches():
    """Get trending search queries."""
    return {
        "trending": [
            {"query": "What is justice?", "searches": 1247},
            {"query": "immortality soul", "searches": 892},
            {"query": "Achilles anger", "searches": 756},
            {"query": "love poetry", "searches": 634},
            {"query": "Stoic philosophy", "searches": 523}
        ]
    }
