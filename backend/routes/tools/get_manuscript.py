from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import json
import asyncio
import aiofiles
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache

router = APIRouter()

class ManuscriptRequest(BaseModel):
    query: str
    top_n: Optional[int] = 5

class ManuscriptResponse(BaseModel):
    passage: str
    similarity_score: float

# Load embeddings and passages (could take some time, consider optimizing further)
@lru_cache(maxsize=1)
def load_corpus():
    embeddings = np.load('~/Downloads/logos_corpus/output/embeddings.npy')
    with open('~/Downloads/logos_corpus/output/passages_combined.jsonl', 'r') as f:
        passages = [json.loads(line) for line in f]
    return embeddings, passages

async def process_manuscript_query(query: str, top_n: int):
    embeddings, passages = load_corpus()
    
    # Simulate AI model embedding extraction for the query
    embedded_query = np.random.rand(embeddings.shape[1])  # Placeholder for actual AI model embedding

    # Compute similarities
    similarities = cosine_similarity([embedded_query], embeddings)
    ranked_indexes = similarities[0].argsort()[-top_n:][::-1]
    
    results = [
        ManuscriptResponse(passage=passages[idx]['text'], similarity_score=similarities[0][idx])
        for idx in ranked_indexes
    ]

    return results

@router.post("/tools/get_manuscript", response_model=List[ManuscriptResponse], status_code=status.HTTP_200_OK)
async def get_manuscript(request: ManuscriptRequest):
    try:
        result = await process_manuscript_query(request.query, request.top_n)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Caching layer to prevent re-computation for repeat queries
@lru_cache(maxsize=1000)
def cache_query_result(query: str, top_n: int):
    return asyncio.run(process_manuscript_query(query, top_n))

@router.get("/tools/get_manuscript_cached", response_model=List[ManuscriptResponse], status_code=status.HTTP_200_OK)
async def get_manuscript_cached(query: str = Query(...), top_n: int = 5):
    try:
        result = cache_query_result(query, top_n)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
