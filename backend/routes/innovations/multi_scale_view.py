import json
from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from functools import lru_cache
import aiofiles
import asyncio
import os

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

# Load data asynchronously
async def load_corpus_data(corpus_path):
    global passages
    expanded_path = os.path.expanduser(corpus_path)
    try:
        async with aiofiles.open(expanded_path, 'r') as f:
            passages = [json.loads(line) for line in await f.readlines()]
    except FileNotFoundError:
        print(f"Warning: Corpus file not found at {expanded_path}")
        passages = []

# Initialize global variables (ideally called at startup)
async def initialize_data():
    corpus_path = "~/Downloads/logos_corpus/output/passages_combined.jsonl"
    await load_corpus_data(corpus_path)

# Mock analysis function
async def analyze_query(query: str, top_k: int):
    """Mock implementation that returns placeholder passages and scores."""
    try:
        if len(passages) == 0:
            return [], []

        # Return first top_k passages as mock results
        top_k = min(top_k, len(passages))
        top_passages = [passages[i].get('text', f'Passage {i}') for i in range(top_k)]
        top_scores = [round(0.95 - (i * 0.05), 2) for i in range(top_k)]
        return top_passages, top_scores
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Endpoints
@router.post("/", response_model=PassageResponse)
async def analyze_passage(request: PassageRequest):
    try:
        result_passages, scores = await analyze_query(request.query, request.top_k)
        return PassageResponse(passages=result_passages, scores=scores)
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
