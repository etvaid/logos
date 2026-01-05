from fastapi import APIRouter, HTTPException
import numpy as np
import json
from pydantic import BaseModel
from typing import List, Dict
from functools import lru_cache
import asyncio

router = APIRouter()

# Loading corpus data
async def load_corpus_data():
    try:
        with open('~/Downloads/logos_corpus/output/passages_combined.jsonl', 'r') as f:
            passages = [json.loads(line) for line in f]
        
        embeddings = np.load('~/Downloads/logos_corpus/output/embeddings.npy')
        return passages, embeddings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Pydantic models
class WordComparisonRequest(BaseModel):
    words: List[str]
    context_size: int = 5

class WordComparisonResponse(BaseModel):
    word: str
    semantic_neighborhood: List[str]
    meaning_drift: Dict[str, List[str]]

# AI integration function to find semantic neighborhoods
async def find_semantic_neighborhood(word: str, embeddings: np.ndarray, passages: List[Dict], context_size: int):
    # Dummy implementation of semantic neighborhood discovery
    # Replace with actual AI-powered embeddings comparison
    # Find index based on dummy logic
    index = 0
    return [passages[i]['text'] for i in range(index, index + context_size if index + context_size < len(passages) else len(passages))]

# AI integration function to track meaning drift
async def track_meaning_drift(word: str, passages: List[Dict]):
    # Dummy implementation of meaning drift
    # Replace with actual logic to identify and track meaning drift
    meaning_drift = {}
    for passage in passages:
        # Dummy logic for populating meaning drift
        if word in passage['text']:
            meaning_drift.setdefault(word, []).append(passage['text'])

    return meaning_drift

# Caching based on word and context size to avoid repetitive calculations
@lru_cache(maxsize=128)
async def compare_words_caching(word: str, context_size: int):
    passages, embeddings = await load_corpus_data()
    neighborhood = await find_semantic_neighborhood(word, embeddings, passages, context_size)
    meaning_drift = await track_meaning_drift(word, passages)
    return neighborhood, meaning_drift

@router.post("/semantia/compare_words", response_model=Dict[str, WordComparisonResponse])
async def compare_words(request: WordComparisonRequest):
    try:
        tasks = [compare_words_caching(word, request.context_size) for word in request.words]
        
        # Run processes concurrently
        results = await asyncio.gather(*tasks)
        
        comparison_results = {}
        for i, word in enumerate(request.words):
            neighborhood, meaning_drift = results[i]
            comparison_results[word] = WordComparisonResponse(
                word=word, semantic_neighborhood=neighborhood, meaning_drift=meaning_drift
            )
        
        return comparison_results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
