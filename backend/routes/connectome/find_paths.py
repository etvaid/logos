from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import numpy as np
import json
import os
import asyncio
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

# File paths
PASSAGES_PATH = os.path.expanduser('~/Downloads/logos_corpus/output/passages_combined.jsonl')
EMBEDDINGS_PATH = os.path.expanduser('~/Downloads/logos_corpus/output/embeddings.npy')

# Load corpus and embeddings synchronously (avoiding asyncio.run issues)
def load_corpus_data_sync():
    passages = []
    embeddings = np.array([])
    try:
        with open(PASSAGES_PATH, 'r') as f:
            passages = [json.loads(line) for line in f.readlines()]
    except FileNotFoundError:
        print(f"Warning: Passages file not found at {PASSAGES_PATH}")

    try:
        embeddings = np.load(EMBEDDINGS_PATH)
    except FileNotFoundError:
        print(f"Warning: Embeddings file not found at {EMBEDDINGS_PATH}")

    return passages, embeddings

# Cache loaded data to prevent re-loading every time
@cached(cache)
def get_data():
    return load_corpus_data_sync()

# Helper function to get the passages and embeddings
def get_corpus_and_embeddings():
    passages, embeddings = get_data()
    return passages, embeddings

# Local implementation of find_semantic_paths
async def find_semantic_paths(start_idea: str, end_idea: Optional[str], max_steps: int,
                               passages: List[Dict], embeddings: np.ndarray) -> List[List[str]]:
    """Find semantic paths between ideas based on embeddings."""
    # Placeholder implementation - returns mock paths
    await asyncio.sleep(0.1)  # Simulate async processing
    if end_idea:
        return [[start_idea, "intermediate concept", end_idea]]
    else:
        return [[start_idea, "related concept 1"], [start_idea, "related concept 2"]]

# Define the router endpoint
@router.post("/", response_model=PathResponse)
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

