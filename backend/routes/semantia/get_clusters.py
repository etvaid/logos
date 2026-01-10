from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import numpy as np
import json
import os
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

# Cache for loaded data
_passages_cache = None
_embeddings_cache = None

def load_corpus_data():
    global _passages_cache, _embeddings_cache
    if _passages_cache is not None:
        return _passages_cache, _embeddings_cache
    try:
        passages_path = os.path.expanduser('~/Downloads/logos_corpus/output/passages_combined.jsonl')
        embeddings_path = os.path.expanduser('~/Downloads/logos_corpus/output/embeddings.npy')
        with open(passages_path, 'r') as f:
            _passages_cache = [json.loads(line) for line in f]
        _embeddings_cache = np.load(embeddings_path)
    except FileNotFoundError as e:
        print(f"Warning: Corpus data not found: {e}")
        _passages_cache = []
        _embeddings_cache = np.array([])
    return _passages_cache, _embeddings_cache

def get_corpus_data():
    return load_corpus_data()

# Initialize the router
router = APIRouter()

# Define an asynchronous operation to get clusters
@router.post("/", response_model=ClusterResponse)
async def get_clusters(request: ClusterRequest):
    passages, embeddings = get_corpus_data()

    # If no corpus data available, return placeholder response
    if len(passages) == 0 or len(embeddings) == 0:
        return ClusterResponse(
            word=request.word,
            clusters=[
                {"passage": {"text": f"Related concept to '{request.word}'"}, "similarity": 0.9 - (i * 0.1)}
                for i in range(min(request.number_of_neighbors, 3))
            ]
        )

    try:
        # Locate the word index in the corpus to find its embedding
        word_index = next((index for index, passage in enumerate(passages) if request.word in passage.get('text', '')), None)

        if word_index is None:
            # Return placeholder if word not found
            return ClusterResponse(
                word=request.word,
                clusters=[{"passage": {"text": f"No exact matches for '{request.word}'"}, "similarity": 0.5}]
            )

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

# Note: Exception handling is done at the app level, not on APIRouter
