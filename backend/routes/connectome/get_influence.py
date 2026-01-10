from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
import json
import os
import asyncio
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter()

# Simple in-memory cache
_influence_cache: Dict[str, Any] = {}

# File paths
PASSAGES_PATH = os.path.expanduser('~/Downloads/logos_corpus/output/passages_combined.jsonl')
EMBEDDINGS_PATH = os.path.expanduser('~/Downloads/logos_corpus/output/embeddings.npy')

# Load corpus data
corpus_data = None
embeddings = None

def load_corpus_data_sync():
    global corpus_data, embeddings
    try:
        with open(PASSAGES_PATH, 'r') as f:
            corpus_data = [json.loads(line) for line in f.readlines()]
    except FileNotFoundError:
        print(f"Warning: Passages file not found at {PASSAGES_PATH}")
        corpus_data = []

    try:
        embeddings = np.load(EMBEDDINGS_PATH)
    except FileNotFoundError:
        print(f"Warning: Embeddings file not found at {EMBEDDINGS_PATH}")
        embeddings = np.array([])

# Load data at module import (not using asyncio.run which can cause issues)
load_corpus_data_sync()

class InfluenceRequest(BaseModel):
    idea_id: str
    top_n: int = 10

class InfluenceResponse(BaseModel):
    related_ideas: List[Dict[str, Any]]

@router.post("/", response_model=InfluenceResponse)
async def get_influence(request: InfluenceRequest):
    if embeddings is None or corpus_data is None or len(corpus_data) == 0:
        raise HTTPException(status_code=503, detail="Corpus data not loaded")

    idea_id = request.idea_id
    top_n = min(request.top_n, len(corpus_data))

    # Cache the results for repeated requests
    if idea_id in _influence_cache:
        return InfluenceResponse(related_ideas=_influence_cache[idea_id])

    try:
        # Assuming each passage has a unique 'idea_id'
        idea_index = next((index for (index, d) in enumerate(corpus_data) if d.get("idea_id") == idea_id), None)
        if idea_index is None:
            raise HTTPException(status_code=404, detail="Idea ID not found in corpus")

        target_embedding = embeddings[idea_index]
        similarities = cosine_similarity([target_embedding], embeddings)[0]

        related_indices = similarities.argsort()[-top_n:][::-1]
        related_ideas = [corpus_data[i] for i in related_indices]

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

