import json
import numpy as np
from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from functools import lru_cache
import asyncio
import logging

# Initialize logger
logger = logging.getLogger("uvicorn.error")

# Define data models
class Passage(BaseModel):
    id: str
    text: str

class Embedding(BaseModel):
    id: str
    vector: List[float]

class PassageEmbedding(BaseModel):
    passage: Passage
    embedding: Embedding

class NarrativeRequest(BaseModel):
    query: str

class NarrativeResponse(BaseModel):
    timeline: List[Passage]

# Initialize FastAPI app and router
app = FastAPI()
router = APIRouter()

# Load data using lru_cache for caching
@lru_cache()
def load_corpus_data():
    try:
        with open('~/Downloads/logos_corpus/output/passages_combined.jsonl', 'r') as f:
            passages = [json.loads(line) for line in f]
        embeddings = np.load('~/Downloads/logos_corpus/output/embeddings.npy')
        return passages, embeddings
    except Exception as e:
        logger.error("Error loading data: %s", str(e))
        raise HTTPException(status_code=500, detail="Failed to load corpus data")

# Asynchronous function to simulate AI-based analysis
async def analyze_query(query: str, passages: List[dict], embeddings: np.ndarray) -> List[Passage]:
    # Simulate some analysis and construct a narrative timeline
    # For demonstration, assume we simply return top 5 passages based on some criteria
    await asyncio.sleep(1)  # Simulating async operation delay
    top_passages = sorted(passages, key=lambda x: len(x.get("text", "")), reverse=True)[:5]
    return [Passage(id=p["id"], text=p["text"]) for p in top_passages]

# API Route to analyze narrative timelines
@router.post("/", response_model=NarrativeResponse)
async def get_narrative_timeline(request: NarrativeRequest):
    try:
        # Load data
        passages, embeddings = load_corpus_data()

        # Perform analysis
        narrative_timeline = await analyze_query(request.query, passages, embeddings)

        # Return response
        return NarrativeResponse(timeline=narrative_timeline)
    except HTTPException as e:
        logger.error("HTTP exception occurred: %s", str(e))
        raise e
    except Exception as e:
        logger.exception("Unhandled exception: %s", str(e))
        raise HTTPException(status_code=500, detail="An unknown error occurred")

# Register routes
app.include_router(router)

# Entry point for ASGI server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
