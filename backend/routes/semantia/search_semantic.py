from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Any
import json
import os
from functools import lru_cache
import asyncio

router = APIRouter()

# Corpus data paths (optional - files may not exist)
PASSAGES_FILE = os.path.expanduser('~/Downloads/logos_corpus/output/passages_combined.jsonl')

# Cache for loaded data
_passages_cache = None

class SemanticSearchQuery(BaseModel):
    query: str
    top_k: int = 5

class SemanticSearchResult(BaseModel):
    result_entries: List[dict]

def load_passages():
    global _passages_cache
    if _passages_cache is not None:
        return _passages_cache
    try:
        with open(PASSAGES_FILE, 'r', encoding='utf-8') as file:
            _passages_cache = [json.loads(line) for line in file]
    except FileNotFoundError:
        _passages_cache = []
    return _passages_cache

@router.post("/", response_model=SemanticSearchResult)
async def search_semantic(query: SemanticSearchQuery):
    passages = load_passages()

    # If no corpus data available, return empty results
    if len(passages) == 0:
        return {"result_entries": []}

    # Return top passages as placeholder mock results
    result_entries = [
        {"passage": {"text": f"Sample result for '{query.query}'"}, "similarity": 0.9 - (i * 0.1)}
        for i in range(min(query.top_k, 5))
    ]

    return {"result_entries": result_entries}
