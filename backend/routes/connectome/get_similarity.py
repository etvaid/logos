from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List
import json
import os
from functools import lru_cache
import aiofiles

# Define a Pydantic model for the request
class SimilarityRequestModel(BaseModel):
    passage_index: int
    top_k: int = 5

# Define a Pydantic model for the response
class SimilarityResponseModel(BaseModel):
    passage: str
    similar_passages: List[str]

router = APIRouter()

# Paths to the dataset files
PASSAGES_FILE_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")

async def load_passages() -> List[str]:
    """Asynchronously load passages from the JSONL file."""
    passages = []
    try:
        async with aiofiles.open(PASSAGES_FILE_PATH, mode='r') as file:
            async for line in file:
                data = json.loads(line)
                passages.append(data.get('text', ''))
    except FileNotFoundError:
        pass
    return passages

def mock_get_similar_indices(passage_index: int, total_passages: int, top_k: int) -> List[int]:
    """Mock implementation that returns placeholder similar passage indices."""
    # Return indices of passages that are not the current one
    indices = []
    for i in range(total_passages):
        if i != passage_index and len(indices) < top_k:
            indices.append(i)
    return indices

@router.get("/", response_model=SimilarityResponseModel)
async def get_similarity(request: SimilarityRequestModel):
    """
    Retrieve similar passages based on the given passage index and number of top-k similar results.
    """
    try:
        passages = await load_passages()

        if len(passages) == 0:
            raise HTTPException(status_code=500, detail="No passages loaded")

        if request.passage_index >= len(passages) or request.passage_index < 0:
            raise HTTPException(status_code=400, detail="Invalid passage index")

        # Use mock implementation for similar passages
        top_similar_indices = mock_get_similar_indices(
            request.passage_index,
            len(passages),
            request.top_k
        )
        similar_passages = [passages[i] for i in top_similar_indices]

        return SimilarityResponseModel(
            passage=passages[request.passage_index],
            similar_passages=similar_passages
        )

    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Corpus files not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
