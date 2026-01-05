from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import json
import os
import asyncio
from functools import lru_cache  # Simple caching mechanism

# Constants for file paths
PASSAGES_JSONL_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")
EMBEDDINGS_NPY_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/embeddings.npy")

# Load Embeddings
try:
    embeddings = np.load(EMBEDDINGS_NPY_PATH)
except Exception as e:
    embeddings = None
    print(f"Error loading embeddings: {e}")

# Define Pydantic model
class Passage(BaseModel):
    text: str
    embeddings_index: int

class CollateTextsRequest(BaseModel):
    search_terms: List[str]
    max_results: Optional[int] = 10

# Initialize Router
router = APIRouter()

@lru_cache(maxsize=128)
def load_passages():
    """Load the passage data from the JSONL file."""
    passages = []
    try:
        with open(PASSAGES_JSONL_PATH, 'r') as f:
            for line in f:
                passage_data = json.loads(line)
                passages.append(Passage(**passage_data))
    except FileNotFoundError as e:
        print(f"File not found: {e}")
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
    return passages

@router.get("/tools/collate_texts")
async def collate_texts(request: CollateTextsRequest):
    """
    Endpoint to collate texts based on AI semantic search.
    This uses vector embeddings to find semantically similar texts.
    """
    if embeddings is None:
        raise HTTPException(status_code=500, detail="Embeddings not available.")
    
    # Load passages
    passages = load_passages()
    if not passages:
        raise HTTPException(status_code=500, detail="Failed to load passages data.")

    # Simulate AI-based semantic search
    # For the purpose of demonstration, this is a stub implementation
    # In a real scenario, the below logic would involve complex computations
    matching_passages = [passage for i, passage in enumerate(passages) if i < request.max_results]
    
    return JSONResponse(content=[passage.dict() for passage in matching_passages])

# Simulate a simple AI integration 
async def semantic_search(search_terms: List[str], num_results: int):
    # Dummy function to simulate AI search using embeddings
    # Would actually compare search terms with embeddings
    await asyncio.sleep(1)  # Simulate async work
    return list(range(num_results))  # Return index list

# Implementation details for a semantic search 
@router.post("/tools/search_semantics")
async def search_semantics(collate_request: CollateTextsRequest):
    # Perform async AI-powered semantic search
    try:
        results_indices = await semantic_search(collate_request.search_terms, collate_request.max_results)
        passages = load_passages()
        results = [passages[i] for i in results_indices]
        return JSONResponse(content=[result.dict() for result in results])
    except Exception as e:
        print(f"Error during semantic search: {e}")
        raise HTTPException(status_code=500, detail="Error performing semantic search.")
