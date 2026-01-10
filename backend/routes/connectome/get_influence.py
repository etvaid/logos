from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import os
import asyncio
import math

router = APIRouter()

# Simple in-memory cache
_influence_cache: Dict[str, Any] = {}

# File paths
PASSAGES_PATH = os.path.expanduser('~/Downloads/logos_corpus/output/passages_combined.jsonl')

# Load corpus data
corpus_data = None

def load_corpus_data_sync():
    global corpus_data
    try:
        with open(PASSAGES_PATH, 'r') as f:
            corpus_data = [json.loads(line) for line in f.readlines()]
    except FileNotFoundError:
        print(f"Warning: Passages file not found at {PASSAGES_PATH}")
        corpus_data = []

# Load data at module import (not using asyncio.run which can cause issues)
load_corpus_data_sync()

class InfluenceRequest(BaseModel):
    idea_id: str
    top_n: int = 10

class InfluenceResponse(BaseModel):
    related_ideas: List[Dict[str, Any]]

def mock_get_related_ideas(idea_id: str, top_n: int, corpus: List[Dict]) -> List[Dict[str, Any]]:
    """Mock implementation that returns placeholder related ideas."""
    # Return first top_n items as mock related ideas
    related = []
    for i, item in enumerate(corpus[:top_n]):
        related.append({
            "idea_id": item.get("idea_id", f"idea_{i}"),
            "text": item.get("text", f"Related passage {i}"),
            "similarity_score": round(0.95 - (i * 0.05), 2)
        })
    return related

@router.post("/", response_model=InfluenceResponse)
async def get_influence(request: InfluenceRequest):
    if corpus_data is None or len(corpus_data) == 0:
        raise HTTPException(status_code=503, detail="Corpus data not loaded")

    idea_id = request.idea_id
    top_n = min(request.top_n, len(corpus_data))

    # Cache the results for repeated requests
    if idea_id in _influence_cache:
        return InfluenceResponse(related_ideas=_influence_cache[idea_id])

    try:
        # Use mock implementation for related ideas
        related_ideas = mock_get_related_ideas(idea_id, top_n, corpus_data)

        _influence_cache[idea_id] = related_ideas
        return InfluenceResponse(related_ideas=related_ideas)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the request: {e}")

# Placeholder function for AI integration
async def process_idea_flow():
    # Assume some complex processing here
    pass

