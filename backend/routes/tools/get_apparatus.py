from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import aiofiles
import asyncio
import json
import os
from functools import lru_cache
import uvicorn

# Define the Pydantic models
class Passage(BaseModel):
    passage_id: int
    text: str

class ApparatusResponse(BaseModel):
    passage: Passage
    related_passages: List[Passage]

# Create the router
router = APIRouter()

# Load corpus data
passages_data_file = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")

# Async function to load JSONL data
async def load_passages():
    try:
        async with aiofiles.open(passages_data_file, mode='r') as f:
            passages = [json.loads(line) for line in await f.readlines()]
        return passages
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load passages: {str(e)}")

def mock_get_related_passages(passage_id: int, passages: List[dict], num_related: int = 5) -> List[Passage]:
    """Mock implementation that returns placeholder related passages."""
    related = []
    count = 0
    for idx, p in enumerate(passages):
        if idx != passage_id and count < num_related:
            related.append(Passage(passage_id=idx, text=p.get('text', f'Related passage {idx}')))
            count += 1
    return related

# API Endpoint to get apparatus with related passages
@router.get("/", response_model=ApparatusResponse)
async def get_apparatus(passage_id: int = Query(..., description="ID of the passage")):
    passages = await load_passages()

    # Validate provided passage_id
    if passage_id >= len(passages) or passage_id < 0:
        raise HTTPException(status_code=404, detail="Passage ID not found")

    # Use mock implementation for related passages
    related_passages = mock_get_related_passages(passage_id, passages)

    response = ApparatusResponse(
        passage=Passage(passage_id=passage_id, text=passages[passage_id].get('text', '')),
        related_passages=related_passages
    )

    return response

# Simple cache clear endpoint (kept for API compatibility)
@router.get("/clear_cache")
async def clear_cache():
    return JSONResponse(content={"detail": "Cache cleared"})


# Instantiate the app and include the router
app = FastAPI()
app.include_router(router, prefix="/tools")

# Run the application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
