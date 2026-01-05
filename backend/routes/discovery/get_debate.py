from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import json
import aiofiles
import asyncio
from functools import lru_cache
import aioredis

# Define the Pydantic models
class DebateResponse(BaseModel):
    passage: str
    source: str

class ErrorResponse(BaseModel):
    detail: str

# Create an instance of APIRouter
router = APIRouter()

# Async function to load data from jsonl
async def load_passages(file_path: str) -> List[dict]:
    passages = []
    async with aiofiles.open(file_path, mode='r') as f:
        async for line in f:
            passage = json.loads(line)
            passages.append(passage)
    return passages

# Load numpy embeddings
async def load_embeddings(file_path: str) -> np.ndarray:
    return np.load(file_path)

# Cache to store the loaded data
@lru_cache(maxsize=1)
async def get_corpus_data():
    passages = await load_passages('~/Downloads/logos_corpus/output/passages_combined.jsonl')
    embeddings = await load_embeddings('~/Downloads/logos_corpus/output/embeddings.npy')
    return passages, embeddings

# Redis setup for caching
redis_client = aioredis.from_url("redis://localhost")

# AI Integration - Placeholder function for semantic discovery
async def semantic_discovery(query: str) -> List[int]:
    # Mock function to demonstrate AI integration
    # In a real implementation, use ML models to infer relevant passage indices
    return [0, 1, 2]

# Router endpoint for /discovery/get_debate
@router.get("/discovery/get_debate", response_model=List[DebateResponse], responses={404: {"model": ErrorResponse}})
async def get_debate(query: str, cache: aioredis.Redis = Depends(redis_client)):
    if await cache.exists(query):
        # Retrieve cached result
        cached_result = await cache.get(query)
        return json.loads(cached_result)

    passages, embeddings = await get_corpus_data()
    
    # Perform semantic discovery to find relevant passages
    try:
        relevant_indices = await semantic_discovery(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail="AI processing failed")

    # Prepare response
    response = []
    for index in relevant_indices:
        passage = passages[index]
        response.append(DebateResponse(passage=passage['text'], source=passage['source']))

    if not response:
        raise HTTPException(status_code=404, detail="No debate passages found for the query")

    # Cache the result
    await cache.set(query, json.dumps([r.dict() for r in response]))

    return response
