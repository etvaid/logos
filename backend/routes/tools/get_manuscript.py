from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
import asyncio
import os
from functools import lru_cache

router = APIRouter()

class ManuscriptRequest(BaseModel):
    query: str
    top_n: Optional[int] = 5

class ManuscriptResponse(BaseModel):
    passage: str
    similarity_score: float

# Load passages only
@lru_cache(maxsize=1)
def load_corpus():
    corpus_path = os.path.expanduser('~/Downloads/logos_corpus/output/passages_combined.jsonl')
    try:
        with open(corpus_path, 'r') as f:
            passages = [json.loads(line) for line in f]
        return passages
    except FileNotFoundError:
        return []

# Simple query result cache
_query_cache: Dict[str, List[ManuscriptResponse]] = {}

async def process_manuscript_query(query: str, top_n: int):
    """Mock implementation that returns placeholder manuscript results."""
    passages = load_corpus()

    if len(passages) == 0:
        return []

    # Return first top_n passages as mock results with decreasing scores
    top_n = min(top_n, len(passages))
    results = [
        ManuscriptResponse(
            passage=passages[idx].get('text', f'Manuscript passage {idx}'),
            similarity_score=round(0.95 - (idx * 0.05), 2)
        )
        for idx in range(top_n)
    ]

    return results

@router.post("/", response_model=List[ManuscriptResponse], status_code=status.HTTP_200_OK)
async def get_manuscript(request: ManuscriptRequest):
    try:
        result = await process_manuscript_query(request.query, request.top_n)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cached", response_model=List[ManuscriptResponse], status_code=status.HTTP_200_OK)
async def get_manuscript_cached(query: str = Query(...), top_n: int = 5):
    try:
        cache_key = f"{query}_{top_n}"
        if cache_key in _query_cache:
            return _query_cache[cache_key]

        result = await process_manuscript_query(query, top_n)
        _query_cache[cache_key] = result
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
