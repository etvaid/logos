from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
import numpy as np
import json
import os
from aiocache import Cache
import asyncio

router = APIRouter()

# Constants representing the path to our corpus data
PASSAGES_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")
EMBEDDINGS_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/embeddings.npy")

# Load the passage data
def load_passages():
    with open(PASSAGES_PATH, 'r', encoding='utf-8') as f:
        return [json.loads(line) for line in f]

# Load the embeddings
def load_embeddings():
    return np.load(EMBEDDINGS_PATH)

# Global variables for simplicity; consider using dependency injection or startup events for actual implementations
passages = load_passages()
embeddings = load_embeddings()

# Sample AI model class for handling semantic similarity (placeholder)
class SemanticModel:
    def find_similar(self, word_vector: np.array, top_n: int = 5):
        # Placeholder for semantic similarity logic
        similarities = np.dot(embeddings, word_vector)
        best_indices = np.argsort(similarities)[-top_n:][::-1]
        return [(passages[i], similarities[i]) for i in best_indices]

# Initialize the mock AI model
semantic_model = SemanticModel()

# Setting up cache
cache = Cache(Cache.MEMORY)

# Pydantic model for response
class TransitionResponse(BaseModel):
    word: str
    transitions: List[dict]

# Async function to find transitions
async def get_transitions(word: str, century: int, num_transitions: int) -> List[dict]:
    word_vector = np.random.rand(embeddings.shape[1])  # Replace with real word vector from embeddings
    similar_passages = semantic_model.find_similar(word_vector, top_n=num_transitions)
    # Debugging: print intermediary data for tracing
    print(f"Found similar passages for '{word}': {similar_passages}")
    
    transitions = [
        {
            "passage": passage["text"],
            "author": passage["author"],
            "similarity": similarity
        }
        for passage, similarity in similar_passages
    ]
    return transitions

# Router to handle the /get_transitions endpoint
@router.get("/chronos/get_transitions", response_model=TransitionResponse)
async def get_transitions_route(
    word: str = Query(..., description="The word to explore transitions for."),
    century: int = Query(5, description="The century for determining semantic evolution."),
    num_transitions: int = Query(5, description="Number of transitions to return.")
):
    try:
        cache_key = f"{word}:{century}:{num_transitions}"
        transitions = await cache.get(cache_key)

        if transitions is None:
            transitions = await get_transitions(word, century, num_transitions)
            await cache.set(cache_key, transitions)
        
        return TransitionResponse(word=word, transitions=transitions)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Add the router to your FastAPI app
# from fastapi import FastAPI
# app = FastAPI()
# app.include_router(router)
