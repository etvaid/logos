from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

router = APIRouter()

class WorkInfo(BaseModel):
    urn: str
    author: str
    title: str
    language: str

class TextResponse(BaseModel):
    urn: str
    text: str
    start: int
    limit: int
    total_lines: int

class MorphologyResponse(BaseModel):
    word: str
    lemma: str
    pos: str
    definition: str
    morphology: Dict[str, Any]

@router.get("/works")
async def list_works(
    language: Optional[str] = None,
    author: Optional[str] = None,
    limit: int = Query(100, le=500)
):
    """List available works"""
    # This will query from database when connected
    return {
        "works": [],
        "total": 0,
        "message": "Connect to database to see works"
    }

@router.get("/work/{urn}/text")
async def get_text(
    urn: str,
    start: int = 0,
    limit: int = Query(50, le=200)
):
    """Get text content for a work"""
    return {
        "urn": urn,
        "text": "",
        "start": start,
        "limit": limit,
        "total_lines": 0,
        "message": "Connect to database to get text"
    }

@router.get("/word/{word}/morphology")
async def get_morphology(word: str):
    """Get morphological analysis for a word"""
    return {
        "word": word,
        "lemma": word,
        "pos": "unknown",
        "definition": "Morphology service in development",
        "morphology": {}
    }

@router.get("/word/{word}/occurrences")
async def get_occurrences(
    word: str,
    limit: int = Query(50, le=200)
):
    """Get all occurrences of a word in corpus"""
    return {
        "word": word,
        "occurrences": [],
        "total": 0
    }
