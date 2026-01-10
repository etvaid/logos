from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Any
import numpy as np
from functools import lru_cache
import json
import os

# Constants for file paths
CORPUS_JSONL_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")
EMBEDDINGS_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/embeddings.npy")

router = APIRouter()

# Pydantic models
class QuestionRequest(BaseModel):
    question: str

class PassageResponse(BaseModel):
    passage_id: int
    text: str
    relevance_score: float

# In-memory storage for corpus data
corpus_data = []
embeddings = np.array([])

# Load corpus data (simulated with caching for simplicity)
@lru_cache(maxsize=1)
def load_corpus_data():
    global corpus_data, embeddings
    try:
        with open(CORPUS_JSONL_PATH, 'r') as file:
            corpus_data = [json.loads(line) for line in file.readlines()]
        embeddings = np.load(EMBEDDINGS_PATH)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading corpus data: {str(e)}")
    return corpus_data, embeddings

# Dummy function for semantic search
def semantic_search(question: str, corpus: List[Any], embeddings: np.ndarray) -> List[PassageResponse]:
    # In a real implementation, replace this with AI model inference or similarity metrics
    return [
        PassageResponse(
            passage_id=i,
            text=corpus[i]['text'],
            relevance_score=np.random.rand()
        ) for i in range(min(5, len(corpus)))
    ]

@router.post("/", response_model=List[PassageResponse])
async def ask_question(request: QuestionRequest):
    try:
        # Load corpus data and embeddings
        corpus, embeddings = load_corpus_data()
        # Perform semantic search
        results = semantic_search(request.question, corpus, embeddings)
        # Sort results by relevance score descending and return top 5
        results.sort(key=lambda x: x.relevance_score, reverse=True)
        return results[:5]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

