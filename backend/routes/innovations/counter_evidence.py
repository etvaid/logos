from fastapi import FastAPI, APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from functools import lru_cache
from uuid import UUID, uuid4


# Define the data models
class Passage(BaseModel):
    id: UUID
    text: str


class AnalysisResult(BaseModel):
    query: str
    counter_evidence: List[Passage]


# Load the passages
@lru_cache()
def load_data():
    corpus_path = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")

    try:
        with open(corpus_path, 'r') as file:
            passages = [json.loads(line) for line in file]
        return passages
    except Exception as e:
        raise RuntimeError(f"Error loading data: {str(e)}")


# Initialize router
router = APIRouter()


def mock_get_counter_evidence(query: str, top_k: int, passages: List[dict]) -> List[Passage]:
    """Mock implementation that returns placeholder counter-evidence passages."""
    # Return first top_k passages as mock counter-evidence
    result = []
    for i in range(min(top_k, len(passages))):
        result.append(Passage(id=uuid4(), text=passages[i].get('text', f'Counter-evidence passage {i}')))
    return result


# Endpoint for querying counter-evidence
@router.post("/", response_model=AnalysisResult)
async def get_counter_evidence(query: str, top_k: Optional[int] = Query(5, gt=0, le=20)):
    try:
        passages = load_data()
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Use mock implementation for counter-evidence
    try:
        counter_evidence = mock_get_counter_evidence(query, top_k, passages)
        return AnalysisResult(query=query, counter_evidence=counter_evidence)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during analysis: {str(e)}")


# Initialize FastAPI app
app = FastAPI()

# Include router with the prefixed path
app.include_router(router, prefix="/counter-evidence")


# Root endpoint for testing
@app.get("/")
async def root():
    return {"message": "Counter-Evidence Display API"}


# Simple health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

