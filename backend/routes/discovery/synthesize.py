from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from typing import List, Dict, Any
import asyncio
import os
import time

# Initialize router
router = APIRouter()

# Simple in-memory cache with TTL (replaces cachetools TTLCache)
_cache: Dict[str, Dict[str, Any]] = {}
_cache_ttl = 300  # 5 minutes

def _get_from_cache(key: str) -> Any:
    """Get value from cache if not expired."""
    if key in _cache:
        entry = _cache[key]
        if time.time() - entry['timestamp'] < _cache_ttl:
            return entry['value']
        else:
            del _cache[key]
    return None

def _set_in_cache(key: str, value: Any) -> None:
    """Set value in cache with timestamp."""
    _cache[key] = {'value': value, 'timestamp': time.time()}

# Define paths to the data files
corpus_jsonl_path = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")

# Load corpus data
async def load_corpus_data():
    try:
        with open(corpus_jsonl_path, 'r') as f:
            passages = [json.loads(line) for line in f]
        return passages
    except FileNotFoundError:
        return []

# Define the request model
class DiscoveryRequest(BaseModel):
    query: str
    top_k: int = 5

# Example AI function placeholder
async def semantic_search(query: str, top_k: int, passages: List[Dict]) -> List[Dict]:
    """Mock semantic search that returns first top_k passages."""
    await asyncio.sleep(0.1)  # Simulate processing time
    results = passages[:top_k] if passages else []
    return results

# Router path for discovery/synthesize
@router.post("/")
async def discovery_synthesize(request: DiscoveryRequest):
    # Validate input
    if request.top_k <= 0:
        raise HTTPException(status_code=400, detail="Top_k must be positive integer")

    # Check cache
    cache_key = f"{request.query}_{request.top_k}"
    cached_result = _get_from_cache(cache_key)
    if cached_result is not None:
        return {"results": cached_result}

    # Load data
    try:
        passages = await load_corpus_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load corpus data: {str(e)}")

    # Perform semantic search
    try:
        results = await semantic_search(request.query, request.top_k, passages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Semantic search failed: {str(e)}")

    # Store in cache
    _set_in_cache(cache_key, results)

    # Return results
    return {"results": results}
