from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os
import asyncio
from functools import lru_cache

# Initialize router
router = APIRouter()

# Simple in-memory cache
_data_cache: Dict[str, Any] = {}

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

# Load corpus synchronously (avoiding asyncio.run issues)
def load_corpus_data_sync():
    passages = []
    try:
        with open(PASSAGES_PATH, 'r') as f:
            passages = [json.loads(line) for line in f.readlines()]
    except FileNotFoundError:
        print(f"Warning: Passages file not found at {PASSAGES_PATH}")

    return passages

# Helper function to get the passages with simple caching
def get_corpus():
    if 'passages' not in _data_cache:
        _data_cache['passages'] = load_corpus_data_sync()
    return _data_cache['passages']

# Local implementation of find_semantic_paths
async def find_semantic_paths(start_idea: str, end_idea: Optional[str], max_steps: int,
                               passages: List[Dict]) -> List[List[str]]:
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

    # Load corpus data
    passages = get_corpus()

    # Use an AI utility to find semantic paths
    try:
        paths = await find_semantic_paths(
            start_idea=request.start_idea,
            end_idea=request.end_idea,
            max_steps=request.max_steps,
            passages=passages
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding paths: {str(e)}")

    if not paths:
        message = "No paths found for the given ideas."
    else:
        message = "Paths successfully found."

    # Return response
    return PathResponse(paths=paths, message=message)

