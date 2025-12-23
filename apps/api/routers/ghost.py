from fastapi import FastAPI, APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import re
from datetime import datetime

app = FastAPI()
router = APIRouter(prefix="/ghost-texts", tags=["ghost-texts"])

class Fragment(BaseModel):
    fragment_id: str = Field(..., description="Unique identifier for the fragment")
    original_author: str = Field(..., description="Author of the lost work")
    original_work: str = Field(..., description="Title of the lost work")
    fragment_text: str = Field(..., description="The surviving text fragment")
    citing_author: str = Field(..., description="Author who preserved the fragment")
    citing_work: str = Field(..., description="Work where the fragment is quoted")
    fragment_type: str = Field(..., description="Type of fragment (direct quote, paraphrase, etc.)")
    estimated_date: Optional[str] = Field(None, description="Estimated date of original work")
    context: Optional[str] = Field(None, description="Context in which the fragment appears")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence that this is an authentic fragment")

class DetectionRequest(BaseModel):
    passage: str = Field(..., description="Text passage to analyze for ghost text fragments")
    author_filter: Optional[List[str]] = Field(None, description="Filter by specific lost work authors")
    min_confidence: float = Field(0.7, ge=0.0, le=1.0, description="Minimum confidence score for matches")
    include_paraphrases: bool = Field(True, description="Include paraphrased fragments in detection")

class DetectionMatch(BaseModel):
    fragment: Fragment
    match_text: str = Field(..., description="The matching text in the passage")
    match_start: int = Field(..., description="Start position of match in passage")
    match_end: int = Field(..., description="End position of match in passage")
    similarity_score: float = Field(..., ge=0.0, le=1.0, description="Similarity score of the match")
    match_type: str = Field(..., description="Type of match (exact, partial, paraphrase)")

class DetectionResponse(BaseModel):
    passage: str
    matches: List[DetectionMatch]
    total_matches: int
    analysis_timestamp: datetime

class AuthorFragments(BaseModel):
    author: str
    total_fragments: int
    fragments: List[Fragment]
    lost_works: List[str]

# Mock database of ghost text fragments
GHOST_TEXT_DATABASE = {
    "ennius": [
        Fragment(
            fragment_id="enn_ann_001",
            original_author="Ennius",
            original_work="Annales",
            fragment_text="O Tite tute Tati tibi tanta tyranne tulisti",
            citing_author="Cicero",
            citing_work="De Oratore",
            fragment_type="direct_quote",
            estimated_date="c. 170 BCE",
            context="Cicero quotes this as an example of alliteration",
            confidence_score=0.95
        ),
        Fragment(
            fragment_id="enn_ann_002",
            original_author="Ennius",
            original_work="Annales",
            fragment_text="Musae quae pedibus magnum pulsatis Olympum",
            citing_author="Varro",
            citing_work="De Lingua Latina",
            fragment_type="direct_quote",
            estimated_date="c. 170 BCE",
            context="Quoted as example of epic invocation",
            confidence_score=0.92
        ),
        Fragment(
            fragment_id="enn_trag_001",
            original_author="Ennius",
            original_work="Medea Exul",
            fragment_text="Utinam ne in nemore Pelio securibus caesa accidisset abiegna ad terram trabes",
            citing_author="Cicero",
            citing_work="De Officiis",
            fragment_type="direct_quote",
            estimated_date="c. 169 BCE",
            context="Famous opening lines of the tragedy",
            confidence_score=0.98
        ),
        Fragment(
            fragment_id="enn_ann_003",
            original_author="Ennius",
            original_work="Annales",
            fragment_text="moribus antiquis res stat Romana virisque",
            citing_author="Augustine",
            citing_work="De Civitate Dei",
            fragment_type="direct_quote",
            estimated_date="c. 170 BCE",
            context="Quoted as expression of Roman values",
            confidence_score=0.89
        )
    ],
    "livius_andronicus": [
        Fragment(
            fragment_id="liv_ody_001",
            original_author="Livius Andronicus",
            original_work="Odusia",
            fragment_text="Virum mihi Camena insece versutum",
            citing_author="Priscian",
            citing_work="Institutiones Grammaticae",
            fragment_type="direct_quote",
            estimated_date="c. 240 BCE",
            context="Opening line of first Latin epic translation",
            confidence_score=0.94
        )
    ],
    "naevius": [
        Fragment(
            fragment_id="nae_pun_001",
            original_author="Naevius",
            original_work="Bellum Punicum",
            fragment_text="fato Metelli Romae fiunt consules",
            citing_author="Gellius",
            citing_work="Noctes Atticae",
            fragment_type="direct_quote",
            estimated_date="c. 225 BCE",
            context="Political satire that led to Naevius's imprisonment",
            confidence_score=0.91
        )
    ]
}

def calculate_text_similarity(text1: str, text2: str) -> float:
    """Calculate similarity between two texts using simple word overlap."""
    words1 = set(re.findall(r'\w+', text1.lower()))
    words2 = set(re.findall(r'\w+', text2.lower()))
    
    if not words1 or not words2:
        return 0.0
    
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    return len(intersection) / len(union) if union else 0.0

def find_substring_matches(passage: str, fragment_text: str, min_similarity: float = 0.3) -> List[tuple]:
    """Find potential matches of fragment text within passage."""
    matches = []
    words = fragment_text.split()
    
    # Look for exact matches first
    if fragment_text.lower() in passage.lower():
        start = passage.lower().find(fragment_text.lower())
        matches.append((start, start + len(fragment_text), 1.0, "exact"))
    
    # Look for partial matches with sliding window
    for i in range(len(passage)):
        for j in range(i + 10, min(len(passage) + 1, i + len(fragment_text) + 50)):
            substring = passage[i:j]
            similarity = calculate_text_similarity(substring, fragment_text)
            if similarity >= min_similarity:
                match_type = "exact" if similarity > 0.9 else "partial" if similarity > 0.6 else "paraphrase"
                matches.append((i, j, similarity, match_type))
    
    return matches

@router.post("/detect", response_model=DetectionResponse)
async def detect_ghost_texts(request: DetectionRequest):
    """Detect ghost text fragments in a given passage."""
    matches = []
    
    # Get all fragments to search
    fragments_to_search = []
    for author, author_fragments in GHOST_TEXT_DATABASE.items():
        if request.author_filter and author not in [a.lower() for a in request.author_filter]:
            continue
        fragments_to_search.extend(author_fragments)
    
    # Search for each fragment in the passage
    for fragment in fragments_to_search:
        if fragment.confidence_score < request.min_confidence:
            continue
            
        fragment_matches = find_substring_matches(request.passage, fragment.fragment_text)
        
        for start, end, similarity, match_type in fragment_matches:
            if match_type == "paraphrase" and not request.include_paraphrases:
                continue
                
            match = DetectionMatch(
                fragment=fragment,
                match_text=request.passage[start:end],
                match_start=start,
                match_end=end,
                similarity_score=similarity,
                match_type=match_type
            )
            matches.append(match)
    
    # Sort matches by position in text
    matches.sort(key=lambda x: x.match_start)
    
    return DetectionResponse(
        passage=request.passage,
        matches=matches,
        total_matches=len(matches),
        analysis_timestamp=datetime.now()
    )

@router.get("/authors", response_model=List[str])
async def get_available_authors():
    """Get list of authors with ghost text fragments in the database."""
    return list(GHOST_TEXT_DATABASE.keys())

@router.get("/authors/{author}/fragments", response_model=AuthorFragments)
async def get_author_fragments(author: str):
    """Get all fragments for a specific author."""
    author_key = author.lower()
    if author_key not in GHOST_TEXT_DATABASE:
        raise HTTPException(status_code=404, detail=f"Author '{author}' not found in database")
    
    fragments = GHOST_TEXT_DATABASE[author_key]
    lost_works = list(set(f.original_work for f in fragments))
    
    return AuthorFragments(
        author=author,
        total_fragments=len(fragments),
        fragments=fragments,
        lost_works=lost_works
    )

@router.get("/fragments/{fragment_id}", response_model=Fragment)
async def get_fragment_by_id(fragment_id: str):
    """Get a specific fragment by its ID."""
    for author_fragments in GHOST_TEXT_DATABASE.values():
        for fragment in author_fragments:
            if fragment.fragment_id == fragment_id:
                return fragment
    
    raise HTTPException(status_code=404, detail=f"Fragment '{fragment_id}' not found")

@router.get("/search", response_model=List[Fragment])
async def search_fragments(
    q: str = Query(..., description="Search query"),
    author: Optional[str] = Query(None, description="Filter by author"),
    work: Optional[str] = Query(None, description="Filter by original work"),
    min_confidence: float = Query(0.0, ge=0.0, le=1.0, description="Minimum confidence score")
):
    """Search fragments by text, author, or work."""
    results = []
    
    for author_key, author_fragments in GHOST_TEXT_DATABASE.items():
        if author and author.lower() != author_key:
            continue
            
        for fragment in author_fragments:
            if fragment.confidence_score < min_confidence:
                continue
                
            if work and work.lower() not in fragment.original_work.lower():
                continue
            
            # Search in fragment text, context, and metadata
            searchable_text = f"{fragment.fragment_text} {fragment.context or ''} {fragment.original_work} {fragment.citing_work}".lower()
            if q.lower() in searchable_text:
                results.append(fragment)
    
    return results

@router.get("/statistics")
async def get_database_statistics():
    """Get statistics about the ghost text database."""
    total_fragments = sum(len(fragments) for fragments in GHOST_TEXT_DATABASE.values())
    total_authors = len(GHOST_TEXT_DATABASE)
    
    author_stats = {}
    work_counts = {}
    
    for author, fragments in GHOST_TEXT_DATABASE.items():
        author_stats[author] = len(fragments)
        for fragment in fragments:
            work = fragment.original_work
            work_counts[work] = work_counts.get(work, 0) + 1
    
    avg_confidence = sum(
        fragment.confidence_score 
        for fragments in GHOST_TEXT_DATABASE.values() 
        for fragment in fragments
    ) / total_fragments if total_fragments > 0 else 0
    
    return {
        "total_fragments": total_fragments,
        "total_authors": total_authors,
        "total_lost_works": len(work_counts),
        "average_confidence_score": round(avg_confidence, 3),
        "fragments_by_author": author_stats,
        "fragments_by_work": work_counts
    }

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)