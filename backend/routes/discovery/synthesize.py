from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import numpy as np
import json
from typing import List
import asyncio
from cachetools import TTLCache
import os

# Initialize router
router = APIRouter()

# Define the cache
cache = TTLCache(maxsize=100, ttl=300)

# Define paths to the data files
corpus_jsonl_path = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")
embeddings_npy_path = os.path.expanduser("~/Downloads/logos_corpus/output/embeddings.npy")

# Load corpus data
async def load_corpus_data():
    with open(corpus_jsonl_path, 'r') as f:
        passages = [json.loads(line) for line in f]
    embeddings = np.load(embeddings_npy_path)
    return passages, embeddings

# Define the request model
class DiscoveryRequest(BaseModel):
    query: str
    top_k: int = 5

# Example AI function placeholder
async def semantic_search(query: str, top_k: int, passages, embeddings):
    # Simulate an AI semantic search function (replace with real implementation)
    await asyncio.sleep(1)  # Simulate processing time
    results = passages[:top_k]
    return results

# Router path for discovery/synthesize
@router.post("/")
async def discovery_synthesize(request: DiscoveryRequest):
    # Validate input
    if request.top_k <= 0:
        raise HTTPException(status_code=400, detail="Top_k must be positive integer")

    # Caching
    cache_key = f"{request.query}_{request.top_k}"
    if cache_key in cache:
        return {"results": cache[cache_key]}

    # Load data
    try:
        passages, embeddings = await load_corpus_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load corpus data: {str(e)}")

    # Perform semantic search
    try:
        results = await semantic_search(request.query, request.top_k, passages, embeddings)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Semantic search failed: {str(e)}")

    # Store in cache
    cache[cache_key] = results

    # Return results
    return {"results": results}
