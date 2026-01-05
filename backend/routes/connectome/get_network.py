from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Any, Dict
import numpy as np
import json
import aioredis
import asyncio
import logging

# Initialize the logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI router
router = APIRouter()

# Load corpus data
corpus_file_path = '~/Downloads/logos_corpus/output/passages_combined.jsonl'
embeddings_file_path = '~/Downloads/logos_corpus/output/embeddings.npy'

# Async function to load data
async def load_corpus_data() -> List[Dict[str, Any]]:
    try:
        with open(corpus_file_path, 'r') as file:
            return [json.loads(line) for line in file]
    except FileNotFoundError:
        logger.error("Corpus file not found.")
        raise HTTPException(status_code=500, detail="Corpus file not found.")

async def load_embeddings() -> np.ndarray:
    try:
        return np.load(embeddings_file_path)
    except FileNotFoundError:
        logger.error("Embeddings file not found.")
        raise HTTPException(status_code=500, detail="Embeddings file not found.")

# Pydantic model for getting network request
class NetworkRequest(BaseModel):
    idea: str
    max_connections: int = 10

# Dependency to use for caching
async def get_redis() -> aioredis.Redis:
    return await aioredis.from_url("redis://localhost")

# Asynchronous endpoint to get the network of ideas
@router.post("/connectome/get_network", response_model=Dict[str, Any])
async def get_network(request: NetworkRequest, redis: aioredis.Redis = Depends(get_redis)):
    # Attempt to retrieve cached result
    cache_key = f"network:{request.idea}:{request.max_connections}"
    cached_result = await redis.get(cache_key)
    if cached_result:
        return JSONResponse(content=json.loads(cached_result))
    
    # Load data
    passages = await load_corpus_data()
    embeddings = await load_embeddings()
    
    # Placeholder for AI integration
    # Here you would integrate a model or method to analyze and find connections
    async def find_related_ideas(idea: str, max_connections: int) -> List[Dict[str, Any]]:
        await asyncio.sleep(1)  # Simulate a time-consuming task
        # Simulate finding related ideas based on embeddings
        # AI integration for semantic linking can be implemented here
        return [{"idea": f"Sample related idea {i}"} for i in range(max_connections)]

    try:
        related_ideas = await find_related_ideas(request.idea, request.max_connections)
    except Exception as e:
        logger.error(f"Error finding related ideas: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while processing idea connections.")
    
    # Cache the result
    result = {"idea": request.idea, "related_ideas": related_ideas}
    await redis.set(cache_key, json.dumps(result), ex=60 * 60)  # Cache for 1 hour

    return result

# Ensure Redis connection is closed properly
@router.on_event("shutdown")
async def on_shutdown():
    redis = await get_redis()
    await redis.close()
