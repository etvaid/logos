import json
import numpy as np
from fastapi import FastAPI, APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List
from functools import lru_cache
import aiofiles
import asyncio
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()
router = APIRouter()

# Pydantic models
class PassageRequest(BaseModel):
    query: str
    top_k: int = 5

class PassageResponse(BaseModel):
    passages: List[str]
    scores: List[float]

# Global variables for storing data
passages = []
embeddings = np.array([])

# Load data asynchronously
async def load_corpus_data(corpus_path):
    global passages
    async with aiofiles.open(corpus_path, 'r') as f:
        passages = [json.loads(line) for line in await f.readlines()]

async def load_embeddings_data(embeddings_path):
    global embeddings
    embeddings = np.load(embeddings_path)

# Initialize global variables (ideally called at startup)
async def initialize_data():
    corpus_path = "~/Downloads/logos_corpus/output/passages_combined.jsonl"
    embeddings_path = "~/Downloads/logos_corpus/output/embeddings.npy"
    await asyncio.gather(
        load_corpus_data(corpus_path),
        load_embeddings_data(embeddings_path)
    )

# AI analysis function
async def analyze_query(query_embedding, top_k):
    try:
        similarities = cosine_similarity([query_embedding], embeddings).flatten()
        top_indices = similarities.argsort()[-top_k:][::-1]
        top_passages = [passages[i]['text'] for i in top_indices]
        top_scores = [similarities[i] for i in top_indices]
        return top_passages, top_scores
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@lru_cache
def cached_embedding(query: str):
    # Mock embedding generation from the query
    return np.random.rand(768)

# Endpoints
@router.post("/analyze/", response_model=PassageResponse)
async def analyze_passage(request: PassageRequest):
    try:
        query_embedding = cached_embedding(request.query)
        passages, scores = await analyze_query(query_embedding, request.top_k)
        return PassageResponse(passages=passages, scores=scores)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing request: {str(e)}")

# Error handling for not found routes
@app.exception_handler(404)
async def not_found_exception_handler(request, exc):
    return JSONResponse(status_code=404, content={"message": "Resource not found"})

# Error handling for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(status_code=422, content={"message": str(exc)})

# Include router
app.include_router(router)

# Ensure data initialization
@app.on_event("startup")
async def startup_event():
    await initialize_data()
    print("Data initialized")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
