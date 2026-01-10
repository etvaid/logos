from fastapi import FastAPI, APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from functools import lru_cache
import numpy as np
import json
import aiofiles
import asyncio

app = FastAPI()
router = APIRouter()

# Pydantic models
class ComparativeRequest(BaseModel):
    query: str
    top_k: int = 5

class ComparativeFrame(BaseModel):
    passage: str
    similarity: float

class ComparativeResponse(BaseModel):
    query: str
    frames: List[ComparativeFrame]

# Load corpus and embeddings
CORPUS_FILE = '~/Downloads/logos_corpus/output/passages_combined.jsonl'
EMBEDDINGS_FILE = '~/Downloads/logos_corpus/output/embeddings.npy'

@lru_cache()
def load_corpus():
    try:
        with open(CORPUS_FILE, 'r', encoding='utf-8') as file:
            passages = [json.loads(line) for line in file]
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Corpus file not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading corpus: {str(e)}")
    return passages

@lru_cache()
def load_embeddings():
    try:
        embeddings = np.load(EMBEDDINGS_FILE)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Embeddings file not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading embeddings: {str(e)}")
    return embeddings

async def async_load_items():
    passages = load_corpus()
    embeddings = load_embeddings()
    return passages, embeddings

# Simulated AI integration function
async def compute_similarity(query_embedding, embeddings, top_k):
    # Simulated similarity metric
    similarity = np.random.rand(embeddings.shape[0])  # Random similarity scores
    top_k_indices = np.argsort(-similarity)[:top_k]  # Get top_k highest indices
    return top_k_indices, similarity[top_k_indices]

async def get_query_embedding(query: str):
    await asyncio.sleep(0.1)  # Simulate delay for AI model processing
    return np.random.rand(768)  # Simulated query embedding

@router.post("/", response_model=ComparativeResponse)
async def analyze_comparative_frames(request: ComparativeRequest):
    try:
        passages, embeddings = await async_load_items()
        query_embedding = await get_query_embedding(request.query)
        top_k_indices, similarities = await compute_similarity(query_embedding, embeddings, request.top_k)

        frames = []
        for idx, similarity in zip(top_k_indices, similarities):
            frames.append(ComparativeFrame(passage=passages[idx]['text'], similarity=similarity))

        return ComparativeResponse(query=request.query, frames=frames)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in analysis: {str(e)}")

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
