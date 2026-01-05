from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import numpy as np
import json
import asyncio
from typing import List, Dict, Any
from functools import lru_cache

router = APIRouter()
CORPUS_JSONL_PATH = "~/Downloads/logos_corpus/output/passages_combined.jsonl"
EMBEDDINGS_NPY_PATH = "~/Downloads/logos_corpus/output/embeddings.npy"

class PassageModel(BaseModel):
    text: str
    author: str
    title: str
    date: str
    words: List[str]

class SemanticNeighborhoodResponse(BaseModel):
    neighborhood: Dict[str, Any]
    drift: List[str]

@lru_cache(maxsize=64)
def load_corpus():
    # Load passages and embeddings
    with open(CORPUS_JSONL_PATH, 'r') as f:
        passages = [json.loads(line) for line in f]
    
    embeddings = np.load(EMBEDDINGS_NPY_PATH)
    return passages, embeddings

def find_semantic_neighborhood(word: str):
    # Placeholder for actual AI/ML model to find semantic neighborhoods
    return {"words": ["example_word1", "example_word2"]}

def find_meaning_drift(word: str):
    # Placeholder for actual AI/ML model to find meaning drift
    return ["drift_example1", "drift_example2"]

async def search_corpus(word: str) -> SemanticNeighborhoodResponse:
    passages, embeddings = load_corpus()

    # Simulate complex AI operations
    await asyncio.sleep(1)  # This simulates async processing time

    neighborhood = find_semantic_neighborhood(word)
    drift = find_meaning_drift(word)
    
    # Returning response in the expected format
    return SemanticNeighborhoodResponse(neighborhood=neighborhood, drift=drift)

@router.get("/semantia/get_history", response_model=SemanticNeighborhoodResponse)
async def get_history(word: str):
    if not word:
        raise HTTPException(status_code=400, detail="Word parameter is required.")
    
    try:
        result = await search_corpus(word)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

