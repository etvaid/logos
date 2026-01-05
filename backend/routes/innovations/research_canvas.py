from fastapi import FastAPI, APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import json
import asyncio
from functools import lru_cache
from pathlib import Path

app = FastAPI()
router = APIRouter()

# Define data paths
PASSAGES_PATH = Path("~/Downloads/logos_corpus/output/passages_combined.jsonl").expanduser()
EMBEDDINGS_PATH = Path("~/Downloads/logos_corpus/output/embeddings.npy").expanduser()

# Pydantic model for Passage
class Passage(BaseModel):
    id: str
    text: str

# Pydantic model for AI analysis result
class AnalysisResult(BaseModel):
    passage_id: str
    keyword: str
    score: float

# Caching data to optimize loading and performance
@lru_cache(maxsize=1)
def load_passages() -> List[Passage]:
    try:
        with open(PASSAGES_PATH, 'r') as f:
            passages = [json.loads(line) for line in f]
            return [Passage(**p) for p in passages]
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Passages file not found")

@lru_cache(maxsize=1)
def load_embeddings() -> np.ndarray:
    try:
        return np.load(EMBEDDINGS_PATH)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Embeddings file not found")

# Simulate AI model for analysis
async def ai_analyze_passages(passage: Passage, keywords: List[str]) -> AnalysisResult:
    # Simulate analysis with sleep, replace with real model call in production
    await asyncio.sleep(0.1)  
    fake_result = AnalysisResult(
        passage_id=passage.id,
        keyword=keywords[0] if keywords else "general",
        score=np.random.rand()
    )
    return fake_result

@router.get("/passages/search", response_model=List[Passage])
async def search_passages(query: Optional[str] = Query(None, title="Query term", description="Term to search in passages")):
    passages = load_passages()
    return [passage for passage in passages if query.lower() in passage.text.lower()]

@router.post("/passages/analyze", response_model=List[AnalysisResult])
async def analyze_passages(keywords: List[str], passage_ids: Optional[List[str]] = None):
    passages = load_passages()
    if passage_ids:
        passages = [passage for passage in passages if passage.id in passage_ids]
    
    tasks = [ai_analyze_passages(passage, keywords) for passage in passages]
    results = await asyncio.gather(*tasks)
    return results

# Router setup
app.include_router(router, prefix="/api/research_canvas", tags=["Research Canvas"])

