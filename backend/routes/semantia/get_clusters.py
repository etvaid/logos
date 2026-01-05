from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import numpy as np
import json
import asyncio
from typing import List, Dict, Any
from functools import lru_cache

# Define the Pydantic model for input validation
class ClusterRequest(BaseModel):
    word: str
    number_of_neighbors: int = 5

# Define a model for the response
class ClusterResponse(BaseModel):
    word: str
    clusters: List[Dict[str, Any]]

# Load the corpus data asynchronously
async def load_corpus_data():
    try:
        with open('~/Downloads/logos_corpus/output/passages_combined.jsonl', 'r') as f:
            passages = [json.loads(line) for line in f]
        embeddings = np.load('~/Downloads/logos_corpus/output/embeddings.npy')
        return passages, embeddings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@lru_cache()
def get_corpus_data():
    # Use caching for efficient data access
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(load_corpus_data())

# Initialize the router
router = APIRouter()

# Define an asynchronous operation to get clusters
@router.post("/semantia/get_clusters", response_model=ClusterResponse)
async def get_clusters(request: ClusterRequest):
    passages, embeddings = get_corpus_data()

    # Handle unexpected errors
    try:
        # Locate the word index in the corpus to find its embedding
        word_index = next((index for index, passage in enumerate(passages) if request.word in passage['text']), None)

        if word_index is None:
            raise HTTPException(status_code=404, detail=f"Word '{request.word}' not found in corpus")

        # Fetch the embedding for the given word
        word_embedding = embeddings[word_index]

        # Calculate similarity to find semantic neighborhoods
        similarities = np.dot(embeddings, word_embedding)
        nearest_indices = similarities.argsort()[-request.number_of_neighbors:][::-1]

        # Prepare the cluster data
        clusters = [
            {
                "passage": passages[i],
                "similarity": float(similarities[i])
            } for i in nearest_indices if i != word_index
        ]

        return ClusterResponse(word=request.word, clusters=clusters)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Error handling for unhandled exceptions
@router.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"detail": "An unexpected error occurred."})
