from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
import json
import aiofiles
import asyncio
from aiocache import Cache
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter()
cache = Cache(Cache.MEMORY)

# Load corpus data asynchronously upon startup
corpus_data = None
embeddings = None

async def load_corpus_data():
    global corpus_data
    global embeddings
    try:
        async with aiofiles.open('~/Downloads/logos_corpus/output/passages_combined.jsonl', mode='r') as f:
            corpus_data = [json.loads(line) for line in await f.readlines()]
        embeddings = np.load('~/Downloads/logos_corpus/output/embeddings.npy')
    except Exception as e:
        print(f"Error loading data: {e}")

# Make sure to call this function during application startup
asyncio.run(load_corpus_data())

class InfluenceRequest(BaseModel):
    idea_id: str
    top_n: int = 10

class InfluenceResponse(BaseModel):
    related_ideas: List[Dict[str, Any]]

@router.get("/connectome/get_influence", response_model=InfluenceResponse)
async def get_influence(request: InfluenceRequest):
    if embeddings is None or corpus_data is None:
        raise HTTPException(status_code=503, detail="Corpus data not loaded")

    idea_id = request.idea_id
    top_n = min(request.top_n, len(corpus_data))

    # Cache the results for repeated requests
    cached_result = await cache.get(idea_id)
    if cached_result:
        return InfluenceResponse(related_ideas=cached_result)

    try:
        # Assuming each passage has a unique 'idea_id'
        idea_index = next((index for (index, d) in enumerate(corpus_data) if d["idea_id"] == idea_id), None)
        if idea_index is None:
            raise HTTPException(status_code=404, detail="Idea ID not found in corpus")

        target_embedding = embeddings[idea_index]
        similarities = cosine_similarity([target_embedding], embeddings)[0]
        
        related_indices = similarities.argsort()[-top_n:][::-1]
        related_ideas = [corpus_data[i] for i in related_indices]

        await cache.set(idea_id, related_ideas)
        return InfluenceResponse(related_ideas=related_ideas)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while processing the request: {e}")

# Placeholder function for AI integration
async def process_idea_flow():
    # Assume some complex processing here
    pass

