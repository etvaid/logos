from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
import json
import os
from pathlib import Path
import asyncio
import aiofiles
from functools import lru_cache

# Define Pydantic model for vocabulary request
class VocabularyRequest(BaseModel):
    passage_id: str

# Define Pydantic model for vocabulary response
class VocabularyResponse(BaseModel):
    passage_id: str
    vocabulary: Dict[str, Any]  # You can adjust this type based on expected response

# Initialize Router
router = APIRouter()

# Load corpus data
CORPUS_FILE = Path('~/Downloads/logos_corpus/output/passages_combined.jsonl').expanduser()
EMBEDDINGS_FILE = Path('~/Downloads/logos_corpus/output/embeddings.npy').expanduser()

# Read the embeddings data using numpy
async def load_embeddings():
    if EMBEDDINGS_FILE.exists():
        return np.load(EMBEDDINGS_FILE)
    else:
        raise FileNotFoundError("Embeddings file not found.")

# Read the passages data asynchronously
async def load_passages():
    passages = []
    if CORPUS_FILE.exists():
        async with aiofiles.open(CORPUS_FILE, mode='r') as f:
            async for line in f:
                passages.append(json.loads(line))
    else:
        raise FileNotFoundError("Corpus file not found.")
    return passages

# AI integration
async def ai_process_vocabulary(passage: Dict[str, Any]) -> Dict[str, Any]:
    # Placeholder for AI integration
    # You can add functionality here to process the passage using an AI model.
    return {"word": "definition"}

# Caching for passages
@lru_cache(maxsize=128)
def get_passage_by_id(passage_id: str, passages: List[Dict[str, Any]]) -> Dict[str, Any]:
    for passage in passages:
        if passage.get('id') == passage_id:
            return passage
    raise KeyError("Passage ID not found.")

# Define the /get_vocabulary endpoint
@router.post("/", response_model=VocabularyResponse)
async def get_vocabulary(request: VocabularyRequest):
    try:
        # Load data files
        passages = await load_passages()
        embeddings = await load_embeddings()

        # Get the requested passage by ID
        passage = get_passage_by_id(request.passage_id, passages)

        # Process vocabulary using AI
        vocabulary = await ai_process_vocabulary(passage)

        # Respond with vocabulary
        return VocabularyResponse(passage_id=request.passage_id, vocabulary=vocabulary)

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    except KeyError:
        raise HTTPException(status_code=404, detail="Passage ID not found.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

