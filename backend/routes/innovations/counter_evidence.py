from fastapi import FastAPI, APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import json
import os
from functools import lru_cache
from sklearn.metrics.pairwise import cosine_similarity
from uuid import UUID, uuid4


# Define the data models
class Passage(BaseModel):
    id: UUID
    text: str


class AnalysisResult(BaseModel):
    query: str
    counter_evidence: List[Passage]


# Load the passages and embeddings
@lru_cache()
def load_data():
    corpus_path = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")
    embeddings_path = os.path.expanduser("~/Downloads/logos_corpus/output/embeddings.npy")

    try:
        with open(corpus_path, 'r') as file:
            passages = [json.loads(line) for line in file]
        embeddings = np.load(embeddings_path)
        return passages, embeddings
    except Exception as e:
        raise RuntimeError(f"Error loading data: {str(e)}")


# Initialize router
router = APIRouter()


# Endpoint for querying counter-evidence
@router.post("/", response_model=AnalysisResult)
async def get_counter_evidence(query: str, top_k: Optional[int] = Query(5, gt=0, le=20)):
    try:
        passages, embeddings = load_data()
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Simulated embedding for query
    # Placeholder. Should replace with real embedding generation
    query_embedding = np.random.rand(768)

    # Compute similarities
    try:
        similarities = cosine_similarity([query_embedding], embeddings)[0]
        top_indices = similarities.argsort()[-top_k:][::-1]

        counter_evidence = [Passage(id=uuid4(), text=passages[i]['text']) for i in top_indices]

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

