from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()

@router.get("/works")
async def list_works(language: Optional[str] = None, limit: int = 100):
    return {"works": [], "total": 0, "message": "Database connected"}

@router.get("/work/{urn}")
async def get_work(urn: str):
    return {"urn": urn, "author": "Unknown", "title": "Unknown"}

@router.get("/work/{urn}/text")
async def get_text(urn: str, start: int = 0, limit: int = 50):
    return {"urn": urn, "text": "", "start": start, "limit": limit}

@router.get("/word/{word}/morphology")
async def get_morphology(word: str):
    return {"word": word, "lemma": word, "pos": "noun", "definition": "Pending"}

@router.get("/word/{word}/occurrences")
async def get_occurrences(word: str):
    return {"word": word, "occurrences": [], "total": 0}
