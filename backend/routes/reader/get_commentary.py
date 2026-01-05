from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import asyncio
import json
from pathlib import Path
from functools import lru_cache

# Initialize the router
router = APIRouter()

# Load corpus data initially
passages_path = Path('~/Downloads/logos_corpus/output/passages_combined.jsonl').expanduser()
embeddings_path = Path('~/Downloads/logos_corpus/output/embeddings.npy').expanduser()
passages_data = []
embeddings_data = None

try:
    with open(passages_path, 'r', encoding='utf-8') as f:
        passages_data = [json.loads(line) for line in f]
    
    embeddings_data = np.load(embeddings_path)
except Exception as e:
    print(f"Error loading corpus data: {str(e)}")

# Pydantic model for request and response
class CommentaryRequest(BaseModel):
    passage_id: int
    related: Optional[bool] = False

class CommentaryResponse(BaseModel):
    commentary: str
    related_passages: Optional[List[str]] = None

# Simulated AI function
async def fetch_related_passages(passage_id: int, top_n: int = 5) -> List[str]:
    # Simplified AI function to find similar passages based on embeddings
    if embeddings_data is None:
        raise HTTPException(status_code=500, detail="Embeddings data is not available")
    
    target_embedding = embeddings_data[passage_id]
    similarities = np.dot(embeddings_data, target_embedding)
    top_indices = np.argsort(-similarities)[:top_n + 1]
    
    return [passages_data[i]['text'] for i in top_indices if i != passage_id]

@lru_cache()  # Caching for better performance
def get_passage_by_id(passage_id: int) -> str:
    try:
        return passages_data[passage_id]['commentary']
    except IndexError:
        raise HTTPException(status_code=404, detail=f"Passage {passage_id} not found")

# Endpoint for getting commentary
@router.post("/reader/get_commentary", response_model=CommentaryResponse)
async def get_commentary(request: CommentaryRequest):
    # Fetch the target commentary
    commentary = get_passage_by_id(request.passage_id)
    
    # Initialize related passages
    related_passages = None
    if request.related:
        related_passages = await fetch_related_passages(request.passage_id)
    
    return CommentaryResponse(commentary=commentary, related_passages=related_passages)

# Example of handling errors
@router.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": f"An error occurred: {str(exc)}"},
    )
