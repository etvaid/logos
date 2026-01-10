from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import numpy as np
import json
import os
import aiofiles
import asyncio
from functools import lru_cache

# Define the Pydantic models
class DebateResponse(BaseModel):
    passage: str
    source: str

class ErrorResponse(BaseModel):
    detail: str

# Create an instance of APIRouter
router = APIRouter()

# File paths
PASSAGES_PATH = os.path.expanduser('~/Downloads/logos_corpus/output/passages_combined.jsonl')
EMBEDDINGS_PATH = os.path.expanduser('~/Downloads/logos_corpus/output/embeddings.npy')

# Async function to load data from jsonl
async def load_passages(file_path: str) -> List[dict]:
    passages = []
    try:
        async with aiofiles.open(file_path, mode='r') as f:
            async for line in f:
                passage = json.loads(line)
                passages.append(passage)
    except FileNotFoundError:
        print(f"Warning: Passages file not found at {file_path}")
    return passages

# Load numpy embeddings
def load_embeddings(file_path: str) -> np.ndarray:
    try:
        return np.load(file_path)
    except FileNotFoundError:
        print(f"Warning: Embeddings file not found at {file_path}")
        return np.array([])

# Cached data storage
_cached_passages: List[dict] = []
_cached_embeddings: Optional[np.ndarray] = None

async def get_corpus_data():
    global _cached_passages, _cached_embeddings
    if not _cached_passages:
        _cached_passages = await load_passages(PASSAGES_PATH)
        _cached_embeddings = load_embeddings(EMBEDDINGS_PATH)
    return _cached_passages, _cached_embeddings

# Simple in-memory cache for results
_result_cache: Dict[str, Any] = {}

# AI Integration - Placeholder function for semantic discovery
async def semantic_discovery(query: str) -> List[int]:
    # Mock function to demonstrate AI integration
    # In a real implementation, use ML models to infer relevant passage indices
    return [0, 1, 2]

# Router endpoint for /discovery/get_debate
@router.get("/", response_model=List[DebateResponse], responses={404: {"model": ErrorResponse}})
async def get_debate(query: str):
    # Check in-memory cache
    if query in _result_cache:
        return _result_cache[query]

    passages, embeddings = await get_corpus_data()

    # Perform semantic discovery to find relevant passages
    try:
        relevant_indices = await semantic_discovery(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail="AI processing failed")

    # Prepare response
    response = []
    for index in relevant_indices:
        if index < len(passages):
            passage = passages[index]
            response.append(DebateResponse(passage=passage.get('text', ''), source=passage.get('source', '')))

    if not response:
        raise HTTPException(status_code=404, detail="No debate passages found for the query")

    # Cache the result
    _result_cache[query] = response

    return response
