from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import json
import aiofiles
import asyncio
from ai_utils import find_semantic_paths  # Assume this is a utility to perform AI-related operations
from cachetools import cached, LRUCache

# Initialize router
router = APIRouter()

# Define cache
cache = LRUCache(maxsize=100)

# Pydantic models for request and response validation
class PathRequest(BaseModel):
    start_idea: str
    end_idea: Optional[str] = None
    max_steps: int = 5

class PathResponse(BaseModel):
    paths: List[List[str]]
    message: str

# Load corpus and embeddings asynchronously
async def load_corpus_data():
    async with aiofiles.open('~/Downloads/logos_corpus/output/passages_combined.jsonl', mode='r') as f:
        passages = await f.readlines()
    embeddings = np.load('~/Downloads/logos_corpus/output/embeddings.npy')
    return passages, embeddings

# Cache loaded data to prevent re-loading every time
@cached(cache)
def get_data():
    return asyncio.run(load_corpus_data())

# Helper function to get the passages and embeddings
def get_corpus_and_embeddings():
    passages, embeddings = get_data()
    return json.loads(''.join(passages)), embeddings

# Define the router endpoint
@router.post("/connectome/find_paths", response_model=PathResponse)
async def find_paths(request: PathRequest):
    # Handle missing start_idea
    if not request.start_idea:
        raise HTTPException(status_code=400, detail="Start idea must be provided")

    # Load corpus data and embeddings
    passages, embeddings = get_corpus_and_embeddings()

    # Use an AI utility to find semantic paths
    try:
        paths = await find_semantic_paths(
            start_idea=request.start_idea, 
            end_idea=request.end_idea,
            max_steps=request.max_steps,
            passages=passages,
            embeddings=embeddings
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding paths: {str(e)}")

    if not paths:
        message = "No paths found for the given ideas."
    else:
        message = "Paths successfully found."

    # Return response
    return PathResponse(paths=paths, message=message)

