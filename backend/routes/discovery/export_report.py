from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
import json
import aiofiles
import asyncio
from pathlib import Path

router = APIRouter()

# Define Pydantic models
class ExportRequest(BaseModel):
    term: str
    include_semantics: bool = True

class ExportResponse(BaseModel):
    status: str
    data: List[Dict[str, Any]] = None

# Async function to load embeddings and passages
async def load_corpus_data():
    corpus_file = Path("~/Downloads/logos_corpus/output/passages_combined.jsonl").expanduser()
    embeddings_file = Path("~/Downloads/logos_corpus/output/embeddings.npy").expanduser()

    if not corpus_file.exists() or not embeddings_file.exists():
        return [], None

    try:
        async with aiofiles.open(corpus_file, mode='r') as f:
            passages = [json.loads(line) for line in await f.readlines()]
        embeddings = np.load(embeddings_file)
        return passages, embeddings
    except Exception:
        return [], None

# Cache for the loaded data
corpus_data_cache = None
load_data_lock = asyncio.Lock()

# Middleware to load and cache corpus data
@router.on_event("startup")
async def load_data_into_cache():
    global corpus_data_cache
    try:
        async with load_data_lock:
            if corpus_data_cache is None:
                corpus_data_cache = await load_corpus_data()
    except Exception:
        corpus_data_cache = ([], None)

# AI integration placeholder function
async def semantic_discovery(term: str, passages: List[Dict[str, Any]]):
    matched_passages = [p for p in passages if term in p.get('text', '')]
    # Placeholder for actual AI-powered semantic matching
    return matched_passages

# Error handler
async def handle_error(term: str):
    raise HTTPException(status_code=404, detail=f"No results found for term: {term}")

# Main route for exporting reports
@router.post("/", response_model=ExportResponse)
async def export_report(request: ExportRequest, background_tasks: BackgroundTasks):
    global corpus_data_cache
    
    # Ensure data is loaded
    if corpus_data_cache is None:
        async with load_data_lock:
            if corpus_data_cache is None:
                corpus_data_cache = await load_corpus_data()
    
    passages, embeddings = corpus_data_cache
    
    # Perform search based on the request
    try:
        if request.include_semantics:
            matched_passages = await semantic_discovery(request.term, passages)
        else:
            matched_passages = [p for p in passages if request.term in p.get('text', '')]

        if not matched_passages:
            background_tasks.add_task(handle_error, request.term)
            return ExportResponse(status="No results found", data=[])

        return ExportResponse(status="Success", data=matched_passages)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Assuming this is added to the main FastAPI app
# app.include_router(router, prefix="/api")
