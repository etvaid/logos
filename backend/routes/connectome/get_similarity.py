from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List
import numpy as np
import json
import os
from scipy.spatial.distance import cosine
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
EMBEDDINGS_FILE_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/embeddings.npy")

@lru_cache(maxsize=1)
def load_embeddings() -> np.ndarray:
    """Load embeddings from the .npy file."""
    return np.load(EMBEDDINGS_FILE_PATH)

async def load_passages() -> List[str]:
    """Asynchronously load passages from the JSONL file."""
    passages = []
    async with aiofiles.open(PASSAGES_FILE_PATH, mode='r') as file:
        async for line in file:
            data = json.loads(line)
            passages.append(data.get('text', ''))
    return passages

def calculate_similarity(embeddings: np.ndarray, index: int, top_k: int) -> List[int]:
    """Calculate top-k similar passages based on cosine similarity."""
    target_embedding = embeddings[index]
    similarities = [1 - cosine(target_embedding, emb) for emb in embeddings]
    sorted_indices = np.argsort(similarities)[::-1][1:top_k+1]  # Exclude self
    return sorted_indices.tolist()

@router.get("/", response_model=SimilarityResponseModel)
async def get_similarity(request: SimilarityRequestModel):
    """
    Retrieve similar passages based on the given passage index and number of top-k similar results.
    """
    try:
        passages = await load_passages()
        embeddings = load_embeddings()
        
        if request.passage_index >= len(passages) or request.passage_index < 0:
            raise HTTPException(status_code=400, detail="Invalid passage index")

        top_similar_indices = calculate_similarity(embeddings, request.passage_index, request.top_k)
        similar_passages = [passages[i] for i in top_similar_indices]

        return SimilarityResponseModel(
            passage=passages[request.passage_index],
            similar_passages=similar_passages
        )

    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Corpus files not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
