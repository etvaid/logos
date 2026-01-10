from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import aiofiles
import asyncio
import numpy as np
import json
import os
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
import uvicorn

# Define the Pydantic models
class Passage(BaseModel):
    passage_id: int
    text: str

class ApparatusResponse(BaseModel):
    passage: Passage
    related_passages: List[Passage]

# Create the router
router = APIRouter()

# Load corpus data and embeddings
passages_data_file = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")
embeddings_data_file = os.path.expanduser("~/Downloads/logos_corpus/output/embeddings.npy")

# Async function to load JSONL data
async def load_passages():
    try:
        async with aiofiles.open(passages_data_file, mode='r') as f:
            passages = [json.loads(line) for line in await f.readlines()]
        return passages
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load passages: {str(e)}")

# Load embeddings synchronously for caching
@lru_cache(maxsize=1)
def load_embeddings():
    try:
        embeddings = np.load(embeddings_data_file)
        return embeddings
    except Exception as e:
        raise Exception(f"Failed to load embeddings: {str(e)}")

# API Endpoint to get apparatus with related passages
@router.get("/", response_model=ApparatusResponse)
async def get_apparatus(passage_id: int = Query(..., description="ID of the passage")):
    passages = await load_passages()
    embeddings = load_embeddings()

    # Validate provided passage_id
    if passage_id >= len(passages) or passage_id < 0:
        raise HTTPException(status_code=404, detail="Passage ID not found")

    try:
        current_embedding = embeddings[passage_id]
    except IndexError:
        raise HTTPException(status_code=404, detail="Embedding for passage ID not found")

    # Calculate cosine similarity to find related passages
    similarities = cosine_similarity([current_embedding], embeddings)[0]
    related_indices = np.argsort(similarities)[::-1][1:6]  # Get top 5 related passages excluding itself

    related_passages = [Passage(passage_id=idx, text=passages[idx]['text']) for idx in related_indices]

    response = ApparatusResponse(
        passage=Passage(passage_id=passage_id, text=passages[passage_id]['text']),
        related_passages=related_passages
    )

    return response

# Implement a simple caching strategy (ensure that results are cached for frequently accessed passages)
@router.get("/clear_cache")
async def clear_cache():
    load_embeddings.cache_clear()
    return JSONResponse(content={"detail": "Cache cleared"})


# Instantiate the app and include the router
app = FastAPI()
app.include_router(router, prefix="/tools")

# Run the application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
