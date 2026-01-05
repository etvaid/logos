from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
import asyncio
import numpy as np
from pathlib import Path
import json
from functools import lru_cache

router = APIRouter()

# Pydantic models
class PassageProgress(BaseModel):
    passage_id: str = Field(..., example="00123")
    read_percentage: float = Field(..., ge=0.0, le=100.0, example=75.0)

class TrackProgressRequest(BaseModel):
    user_id: str
    progress: List[PassageProgress]

class TrackProgressResponse(BaseModel):
    success: bool
    message: Optional[str] = None

# Load corpus data
CORPUS_PATH = Path("~/Downloads/logos_corpus/output/passages_combined.jsonl").expanduser()
EMBEDDINGS_PATH = Path("~/Downloads/logos_corpus/output/embeddings.npy").expanduser()

@lru_cache()
def load_passages():
    try:
        with open(CORPUS_PATH, 'r') as f:
            passages = [json.loads(line) for line in f]
        return passages
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@lru_cache()
def load_embeddings():
    try:
        return np.load(EMBEDDINGS_PATH)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

# Async function to simulate AI operation
async def ai_suggested_reading(user_id: str, read_embeddings: np.ndarray):
    await asyncio.sleep(0.5)  # Simulate async processing time
    # Placeholder: Return dummy suggestions
    return ["00456", "00789"]

# Route to track reading progress
@router.post("/reader/track_progress", response_model=TrackProgressResponse)
async def track_progress(request: TrackProgressRequest):
    # Validate user_id and progress
    if not request.user_id or not request.progress:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid input")

    # Load data
    passages = load_passages()
    embeddings = load_embeddings()

    # Gather read embeddings
    read_passage_ids = [prog.passage_id for prog in request.progress]
    read_embeddings = embeddings[np.isin([p["id"] for p in passages], read_passage_ids)]

    # Suggest new readings via an AI-powered recommendation engine
    try:
        suggestions = await ai_suggested_reading(request.user_id, read_embeddings)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"AI Error: {str(e)}")

    # Cache or save user progress (not implemented: placeholder simulation)
    user_progress_data = {
        "user_id": request.user_id,
        "read_percentage": {p.passage_id: p.read_percentage for p in request.progress},
        "suggestions": suggestions
    }
    # In practice, save user_progress_data to database or cache

    return TrackProgressResponse(success=True, message="Progress tracked successfully")

# Register the router with the app in FastAPI app setup:
# app.include_router(router)
