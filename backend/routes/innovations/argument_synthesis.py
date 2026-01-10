from fastapi import FastAPI, APIRouter, HTTPException, status
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Optional, Dict
from pathlib import Path
import aiofiles
import json
import numpy as np
from functools import lru_cache
import asyncio
import random

app = FastAPI()
router = APIRouter()

corpus_path = Path("~/Downloads/logos_corpus/output/passages_combined.jsonl").expanduser()
embeddings_path = Path("~/Downloads/logos_corpus/output/embeddings.npy").expanduser()

# Pydantic Models
class ArgumentRequest(BaseModel):
    research_question: str

class FollowUpRequest(BaseModel):
    follow_up_question: str

class Argument(BaseModel):
    id: str
    research_question: str
    argument_text: str
    citations: Optional[Dict[str, str]]

# In-memory storage
arguments_db = {}

async def load_corpus():
    async with aiofiles.open(corpus_path, mode='r') as f:
        passages = [json.loads(line.strip()) for line in await f.readlines()]
    embedding_data = np.load(embeddings_path)
    return passages, embedding_data

@lru_cache(maxsize=1)
def load_embeddings():
    return asyncio.run(load_corpus())

def ai_generate_argument(research_question):
    # Placeholder AI logic, replace with actual AI model inference
    return "AI-generated argument for: " + research_question

def ai_refine_argument(existing_argument, follow_up):
    # Placeholder AI logic
    return existing_argument + " Refined with follow-up: " + follow_up

@router.post("/", response_model=Argument, status_code=status.HTTP_201_CREATED)
async def create_argument(request: ArgumentRequest):
    passages, embeddings = load_embeddings()
    generated_argument = ai_generate_argument(request.research_question)
    argument_id = str(random.randint(1000, 9999))
    argument = Argument(id=argument_id, research_question=request.research_question, 
                        argument_text=generated_argument, citations={})
    arguments_db[argument_id] = argument
    return argument

@router.get("/{id}", response_model=Argument)
async def get_argument(id: str):
    argument = arguments_db.get(id)
    if not argument:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Argument not found")
    return argument

@router.post("/{id}/refine", response_model=Argument)
async def refine_argument(id: str, request: FollowUpRequest):
    argument = arguments_db.get(id)
    if not argument:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Argument not found")
    refined_text = ai_refine_argument(argument.argument_text, request.follow_up_question)
    argument.argument_text = refined_text
    return argument

@router.get("/{id}/export", response_class=FileResponse)
async def export_argument(id: str):
    argument = arguments_db.get(id)
    if not argument:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Argument not found")
    export_path = f"/tmp/{id}_argument_with_citations.txt"
    async with aiofiles.open(export_path, mode='w') as f:
        await f.write(argument.argument_text + "\nFull citations: " + json.dumps(argument.citations))
    return export_path

app.include_router(router)

# Error handling
@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "An error occurred", "details": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
