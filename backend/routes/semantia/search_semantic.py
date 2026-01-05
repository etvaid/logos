from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Any
import numpy as np
import json
import os
from sentence_transformers import SentenceTransformer
from functools import lru_cache
import asyncio

router = APIRouter()

# Load corpus data
PASSAGES_FILE = os.path.expanduser('~/Downloads/logos_corpus/output/passages_combined.jsonl')
EMBEDDINGS_FILE = os.path.expanduser('~/Downloads/logos_corpus/output/embeddings.npy')

class SemanticSearchQuery(BaseModel):
    query: str
    top_k: int = 5

class SemanticSearchResult(BaseModel):
    result_entries: List[dict]

# Load passages
@lru_cache(maxsize=1)
def load_passages():
    with open(PASSAGES_FILE, 'r', encoding='utf-8') as file:
        return [json.loads(line) for line in file]

# Load embeddings
@lru_cache(maxsize=1)
def load_embeddings():
    return np.load(EMBEDDINGS_FILE)

# Initialize SentenceTransformer model
@lru_cache(maxsize=1)
def get_model():
    return SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Error handling
async def handle_errors(call_func, *args, **kwargs) -> Any:
    try:
        return await call_func(*args, **kwargs)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@router.post("/search_semantic", response_model=SemanticSearchResult)
async def search_semantic(query: SemanticSearchQuery):
    passages = load_passages()
    embeddings = load_embeddings()
    model = get_model()
    
    # AI integration: Encode the query
    query_embedding = await asyncio.to_thread(model.encode, query.query)
    
    # Calculate cosine similarity between query and corpus embeddings
    similarities = np.dot(embeddings, query_embedding)
    top_k_indices = np.argpartition(similarities, -query.top_k)[-query.top_k:]
    sorted_top_k_indices = top_k_indices[np.argsort(similarities[top_k_indices])[::-1]]

    # Construct response data
    result_entries = [{"passage": passages[idx], "similarity": float(similarities[idx])} for idx in sorted_top_k_indices]

    return {"result_entries": result_entries}
