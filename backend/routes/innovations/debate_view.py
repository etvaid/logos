from fastapi import FastAPI, APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import numpy as np
import json
import os
from functools import lru_cache
import logging

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Simulate AI integration by setting up a simple similarity search
class AIAnalyzer:
    def __init__(self, corpus_path: str, embeddings_path: str):
        self.corpus_path = corpus_path
        self.embeddings_path = embeddings_path
        self.passages = self.load_corpus()
        self.embeddings = self.load_embeddings()

    def load_corpus(self) -> List[dict]:
        if not os.path.exists(self.corpus_path):
            logger.error("Corpus file not found!")
            raise FileNotFoundError("Corpus file not found!")
        
        passages = []
        with open(self.corpus_path, 'r', encoding='utf-8') as f:
            for line in f:
                passages.append(json.loads(line.strip()))
        return passages

    def load_embeddings(self) -> np.ndarray:
        if not os.path.exists(self.embeddings_path):
            logger.error("Embeddings file not found!")
            raise FileNotFoundError("Embeddings file not found!")
        
        return np.load(self.embeddings_path)

    async def analyze(self, query_embedding: np.ndarray) -> List[dict]:
        # Async sleep to simulate processing time
        await asyncio.sleep(0.1)

        # Calculate similarities (e.g., dot product)
        similarities = self.embeddings @ query_embedding
        top_indices = np.argsort(-similarities)[:5]  # top 5 results
        return [self.passages[idx] for idx in top_indices]

class DebateQuery(BaseModel):
    query_text: str

class AnalysisResult(BaseModel):
    passages: List[str]

# Set up routes
router = APIRouter()

# Load AI model
@lru_cache()
def get_ai_analyzer() -> AIAnalyzer:
    # Update paths to the correct location
    corpus_path = os.path.expanduser('~/Downloads/logos_corpus/output/passages_combined.jsonl')
    embeddings_path = os.path.expanduser('~/Downloads/logos_corpus/output/embeddings.npy')
    return AIAnalyzer(corpus_path, embeddings_path)

@router.post("/debate/analyze", response_model=AnalysisResult)
async def analyze_debate(query: DebateQuery, analyzer: AIAnalyzer = Depends(get_ai_analyzer)):
    # FAKE: Embed the query text. In practice, use a real AI model.
    query_embedding = np.random.rand(768)  # Dummy embedding

    try:
        results = await analyzer.analyze(query_embedding)
    except (FileNotFoundError, Exception) as e:
        logger.error(f"An error occurred during analysis: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during analysis.")

    return AnalysisResult(passages=[result['content'] for result in results])

app = FastAPI()
app.include_router(router, prefix="/api")

# Error handler
@app.exception_handler(FileNotFoundError)
async def file_not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": str(exc)},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
