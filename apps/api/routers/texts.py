"""
LOGOS API - Texts Router
Retrieve texts by CTS URN
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from pydantic import BaseModel

router = APIRouter()

class TextResponse(BaseModel):
    urn: str
    content: str
    language: str
    author: Optional[str] = None
    work: Optional[str] = None
    section: Optional[str] = None
    word_count: Optional[int] = None
    translation_preview: Optional[str] = None

class AuthorResponse(BaseModel):
    id: int
    name_en: str
    name_original: Optional[str] = None
    language: str
    era: Optional[str] = None
    works_count: int = 0

class WorkResponse(BaseModel):
    id: int
    urn: str
    title_en: str
    title_original: Optional[str] = None
    author: str
    language: str
    genre: Optional[str] = None
    word_count: Optional[int] = None

# Sample data for demonstration
SAMPLE_TEXTS = {
    "urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1": {
        "urn": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1",
        "content": "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
        "language": "grc",
        "author": "Homer",
        "work": "Iliad",
        "section": "Book 1, Line 1",
        "word_count": 5,
        "translation_preview": "Sing, goddess, the wrath of Achilles son of Peleus"
    },
    "urn:cts:latinLit:phi0690.phi003.perseus-lat2:1.1": {
        "urn": "urn:cts:latinLit:phi0690.phi003.perseus-lat2:1.1",
        "content": "Arma virumque cano, Troiae qui primus ab oris",
        "language": "lat",
        "author": "Virgil",
        "work": "Aeneid",
        "section": "Book 1, Line 1",
        "word_count": 8,
        "translation_preview": "Arms and the man I sing, who first from Troy's shores"
    }
}

@router.get("/{urn:path}", response_model=TextResponse)
async def get_text_by_urn(urn: str):
    """
    Get a text passage by its CTS URN.
    
    Example URNs:
    - urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1 (Iliad 1.1)
    - urn:cts:latinLit:phi0690.phi003.perseus-lat2:1.1 (Aeneid 1.1)
    """
    if urn in SAMPLE_TEXTS:
        return TextResponse(**SAMPLE_TEXTS[urn])
    
    # Return a placeholder for demo
    return TextResponse(
        urn=urn,
        content="[Text content would be retrieved from database]",
        language="grc" if "greekLit" in urn else "lat",
        author="Unknown",
        work="Unknown",
        section=urn.split(":")[-1] if ":" in urn else None
    )

@router.get("/work/{work_id}")
async def get_texts_by_work(
    work_id: int,
    limit: int = Query(default=50, le=500),
    offset: int = Query(default=0, ge=0)
):
    """Get all passages from a specific work."""
    return {
        "work_id": work_id,
        "passages": [],
        "total": 0,
        "limit": limit,
        "offset": offset
    }

@router.get("/author/{author_id}")
async def get_works_by_author(author_id: int):
    """Get all works by a specific author."""
    return {
        "author_id": author_id,
        "works": []
    }

@router.get("/")
async def list_texts(
    language: Optional[str] = Query(None, regex="^(grc|lat)$"),
    author: Optional[str] = None,
    genre: Optional[str] = None,
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0)
):
    """List available texts with optional filtering."""
    return {
        "texts": list(SAMPLE_TEXTS.values()),
        "total": len(SAMPLE_TEXTS),
        "limit": limit,
        "offset": offset,
        "filters": {
            "language": language,
            "author": author,
            "genre": genre
        }
    }

@router.get("/authors", response_model=List[AuthorResponse])
async def list_authors(
    language: Optional[str] = Query(None, regex="^(grc|lat)$"),
    limit: int = Query(default=50, le=200)
):
    """List all authors in the corpus."""
    authors = [
        AuthorResponse(id=1, name_en="Homer", name_original="Ὅμηρος", language="grc", era="8th c. BCE", works_count=2),
        AuthorResponse(id=2, name_en="Virgil", name_original="Vergilius", language="lat", era="1st c. BCE", works_count=3),
        AuthorResponse(id=3, name_en="Plato", name_original="Πλάτων", language="grc", era="4th c. BCE", works_count=36),
        AuthorResponse(id=4, name_en="Cicero", name_original="Cicero", language="lat", era="1st c. BCE", works_count=88),
    ]
    if language:
        authors = [a for a in authors if a.language == language]
    return authors[:limit]

@router.get("/works", response_model=List[WorkResponse])
async def list_works(
    author_id: Optional[int] = None,
    language: Optional[str] = Query(None, regex="^(grc|lat)$"),
    genre: Optional[str] = None,
    limit: int = Query(default=50, le=200)
):
    """List all works in the corpus."""
    works = [
        WorkResponse(id=1, urn="urn:cts:greekLit:tlg0012.tlg001", title_en="Iliad", title_original="Ἰλιάς", author="Homer", language="grc", genre="Epic", word_count=115477),
        WorkResponse(id=2, urn="urn:cts:greekLit:tlg0012.tlg002", title_en="Odyssey", title_original="Ὀδύσσεια", author="Homer", language="grc", genre="Epic", word_count=87765),
        WorkResponse(id=3, urn="urn:cts:latinLit:phi0690.phi003", title_en="Aeneid", title_original="Aeneis", author="Virgil", language="lat", genre="Epic", word_count=63719),
    ]
    if language:
        works = [w for w in works if w.language == language]
    return works[:limit]
