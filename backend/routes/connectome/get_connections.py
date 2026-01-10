from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Any, Dict
import numpy as np
import json
import os
import asyncio
import aiofiles
import hashlib
from functools import lru_cache

router = APIRouter()

# Define paths to data files
CORPUS_JSONL_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")
CORPUS_EMBEDDINGS_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/embeddings.npy")

class ConnectionRequest(BaseModel):
    idea_id: str
    threshold: float = 0.8  # Similarity threshold for connections

class ConnectionResponse(BaseModel):
    idea_id: str
    related_ideas: List[Dict[str, Any]]

# Load the embeddings into memory (or potentially from a database for large datasets)
def load_embeddings():
    if not os.path.exists(CORPUS_EMBEDDINGS_PATH):
        return None
    try:
        return np.load(CORPUS_EMBEDDINGS_PATH)
    except Exception:
        return None

# Async loading JSONL corpus file
async def load_corpus():
    if not os.path.exists(CORPUS_JSONL_PATH):
        return []
    try:
        entries = []
        async with aiofiles.open(CORPUS_JSONL_PATH, mode='r') as file:
            async for line in file:
                entry = json.loads(line)
                entries.append(entry)
        return entries
    except Exception:
        return []

cached_embeddings = None
cached_corpus = None

@router.on_event("startup")
async def startup_event():
    global cached_embeddings, cached_corpus
    try:
        cached_embeddings = load_embeddings()
        cached_corpus = await load_corpus()
    except Exception:
        cached_embeddings = None
        cached_corpus = []

# Function to calculate cosine similarity
def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

def find_connections(idea_id, threshold):
    try:
        idea_index = next((index for (index, d) in enumerate(cached_corpus) if d["id"] == idea_id), None)
        if idea_index is None:
            raise ValueError("Idea not found")

        idea_embedding = cached_embeddings[idea_index]
        connections = []

        for index, entry in enumerate(cached_corpus):
            if index == idea_index:
                continue

            similarity = cosine_similarity(idea_embedding, cached_embeddings[index])
            if similarity >= threshold:
                connections.append({
                    "idea_id": entry["id"],
                    "similarity": similarity,
                    "title": entry.get("title", "Untitled"),
                    "excerpt": entry.get("excerpt", "")
                })

        return connections

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error processing connections: " + str(e))

@lru_cache(maxsize=256)
def connections_hash(idea_id, threshold):
    return hashlib.sha256(f"{idea_id}_{threshold}".encode()).hexdigest()

@router.post("/", response_model=ConnectionResponse)
async def get_connections(request: ConnectionRequest):
    try:
        connections = find_connections(request.idea_id, request.threshold)
        return ConnectionResponse(idea_id=request.idea_id, related_ideas=connections)
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unexpected error: " + str(e))
