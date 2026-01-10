from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict
import numpy as np
import json
import os

router = APIRouter()

# Pydantic models for request and response
class VocabRequest(BaseModel):
    known_words: List[str]
    text_excerpt: str

class VocabResponse(BaseModel):
    unknown_words: List[str]
    status: str

# Load embeddings and passages
CORPUS_PATH_JSON = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")
CORPUS_PATH_EMBEDDINGS = os.path.expanduser("~/Downloads/logos_corpus/output/embeddings.npy")

def load_passages(corpus_path: str) -> List[Dict]:
    """Load passages from JSONL file."""
    try:
        with open(corpus_path, 'r', encoding='utf-8') as f:
            return [json.loads(line) for line in f]
    except FileNotFoundError:
        print(f"Warning: Passages file not found at {corpus_path}")
        return []

def load_embeddings(corpus_path: str) -> np.ndarray:
    """Load embeddings from numpy file."""
    try:
        return np.load(corpus_path)
    except FileNotFoundError:
        print(f"Warning: Embeddings file not found at {corpus_path}")
        return np.array([])

# Load data at startup with graceful handling
passages = load_passages(CORPUS_PATH_JSON)
embeddings = load_embeddings(CORPUS_PATH_EMBEDDINGS)

def find_unknown_words(known_words: List[str], text_excerpt: str) -> List[str]:
    """Find words in the text that are not in the known words list."""
    # Simple implementation: tokenize and find unknown words
    words_in_text = set(text_excerpt.lower().split())
    known_set = set(w.lower() for w in known_words)
    unknown = [w for w in words_in_text if w not in known_set and len(w) > 2]
    return unknown

# Simple in-memory cache
_vocab_cache: Dict[str, List[str]] = {}

async def get_vocab_list(known_words: List[str], text_excerpt: str) -> List[str]:
    """Get vocabulary list with caching."""
    cache_key = f"{','.join(sorted(known_words))}:{hash(text_excerpt)}"
    if cache_key in _vocab_cache:
        return _vocab_cache[cache_key]

    unknown_words = find_unknown_words(known_words, text_excerpt)
    _vocab_cache[cache_key] = unknown_words
    return unknown_words

@router.post("/", response_model=VocabResponse)
async def create_vocab_list(vocab_request: VocabRequest):
    try:
        # Asynchronously determine unknown words
        unknown_words = await get_vocab_list(vocab_request.known_words, vocab_request.text_excerpt)

        response = VocabResponse(
            unknown_words=unknown_words,
            status="success"
        )
        return response
    except Exception as e:
        # Error handling with an HTTP exception
        raise HTTPException(status_code=500, detail=str(e))
