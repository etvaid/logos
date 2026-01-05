from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import json
import numpy as np
import os
import asyncio
from cachetools import LRUCache, cached

# Router setup
router = APIRouter()

# Paths to corpus data
CORPUS_JSONL_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")
CORPUS_EMBEDDINGS_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/embeddings.npy")

# Load corpus data
def load_corpus_data():
    with open(CORPUS_JSONL_PATH, 'r', encoding='utf-8') as file:
        passages = [json.loads(line) for line in file if line.strip()]
    embeddings = np.load(CORPUS_EMBEDDINGS_PATH)
    return passages, embeddings

passages, embeddings = load_corpus_data()

# Caching setup
cache = LRUCache(maxsize=100)

# Pydantic models
class FindingModel(BaseModel):
    id: Optional[str] = Field(None, description="Unique identifier for the finding")
    content: str = Field(..., description="Content of the finding")
    tags: List[str] = Field([], description="Tags associated with the finding")

class FindingResponseModel(BaseModel):
    success: bool = False
    data: Optional[Dict[str, Any]] = None
    message: str = 'An error occurred'

# Dummy AI processing function that simulates a semantic understanding task
async def process_finding(content: str) -> str:
    await asyncio.sleep(0.1)  # Simulate processing delay
    return f"Processed content for: {content[:30]}..."  # Truncate for demonstration

# Dependency for getting corpus data
async def get_corpus_data():
    return passages, embeddings

# Routes
@router.post("/discovery/save_finding", response_model=FindingResponseModel)
async def save_finding(finding: FindingModel, corpus=Depends(get_corpus_data)):
    try:
        # Implement AI semantic processing
        processed_content = await process_finding(finding.content)

        # Caching demo (e.g., save finding content by id)
        if finding.id:
            cache[finding.id] = {"content": processed_content, "tags": finding.tags}
        
        response = FindingResponseModel(
            success=True,
            data={"id": finding.id, "content": processed_content, "tags": finding.tags},
            message="Finding successfully saved!"
        )
        return response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save finding: {str(e)}"
        )

# Make the router available for inclusion in the FastAPI application
