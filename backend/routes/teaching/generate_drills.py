from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import json
import os
import asyncio
import hashlib
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

# Define the router
router = APIRouter()

# File paths for corpus data
PASSAGES_PATH = "~/Downloads/logos_corpus/output/passages_combined.jsonl"
EMBEDDINGS_PATH = "~/Downloads/logos_corpus/output/embeddings.npy"

# Pydantic models
class DrillRequest(BaseModel):
    student_id: int
    known_vocabulary: List[str]
    difficulty_level: Optional[str] = "beginner"  # Options: "beginner", "intermediate", "advanced"

class DrillItem(BaseModel):
    passage_id: int
    text: str
    highlight_words: List[str]

class DrillResponse(BaseModel):
    student_id: int
    drills: List[DrillItem]

# Mock AI Integration
async def fetch_semantic_insights(text: str) -> List[str]:
    # Simulate AI processing with asynchronous delay
    await asyncio.sleep(0.1)
    # Assume AI is highlighting words related to the difficulty level or unknown vocabulary
    return [word for word in text.split() if len(word) > 5]  # Simplified example

# Utility function to load data
def load_corpus_data():
    with open(os.path.expanduser(PASSAGES_PATH), 'r') as file:
        passages = [json.loads(line) for line in file]
    embeddings = np.load(os.path.expanduser(EMBEDDINGS_PATH), allow_pickle=True)
    return passages, embeddings

# Endpoint to generate drills
@router.post("/generate_drills", response_model=DrillResponse)
@cache(expire=60)  # Cache for 60 seconds
async def generate_drills(request: DrillRequest):
    try:
        passages, embeddings = load_corpus_data()

        # Filter passages based on student's vocabulary
        filtered_passages = [
            passage for passage in passages if not set(request.known_vocabulary).intersection(set(passage["text"].split()))
        ]

        # Pick passages based on difficulty level and semantic insights
        selected_passages = []
        for passage in filtered_passages:
            if request.difficulty_level == "beginner":
                if len(passage["text"].split()) < 50:  # Simple heuristic for demo
                    selected_passages.append(passage)
            elif request.difficulty_level == "intermediate":
                if 50 <= len(passage["text"].split()) < 100:
                    selected_passages.append(passage)
            else:
                if len(passage["text"].split()) >= 100:
                    selected_passages.append(passage)
            
            if len(selected_passages) >= 5:  # Limit number of drills
                break

        drills = []
        for passage in selected_passages:
            highlight_words = await fetch_semantic_insights(passage["text"])
            drills.append(DrillItem(passage_id=passage["id"], text=passage["text"], highlight_words=highlight_words))

        return DrillResponse(student_id=request.student_id, drills=drills)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Initialize the cache with memory backend for this example
FastAPICache.init()

