from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Union
import numpy as np
import json
import os
import asyncio
from ai_cache import cache  # Hypothetical caching library for async functions

# Load real corpus data
CORPUS_JSONL_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/passages_combined.jsonl")
EMBEDDINGS_PATH = os.path.expanduser("~/Downloads/logos_corpus/output/embeddings.npy")

# Load passages and embeddings
passages = []
if os.path.exists(CORPUS_JSONL_PATH):
    with open(CORPUS_JSONL_PATH, 'r') as file:
        passages = [json.loads(line) for line in file]
else:
    raise FileNotFoundError("Passages file not found.")

if os.path.exists(EMBEDDINGS_PATH):
    embeddings = np.load(EMBEDDINGS_PATH)
else:
    raise FileNotFoundError("Embeddings file not found.")

# Pydantic models
class QuizRequest(BaseModel):
    topic: str
    difficulty: str
    num_questions: int

class QuizQuestion(BaseModel):
    question_text: str
    options: List[str]
    correct_answer: str

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]

# Initialize router
router = APIRouter()

async def semantic_search(topic: str) -> List[Dict[str, Union[str, float]]]:
    # Simulate an AI-based semantic search within the corpus
    # For demonstration, we'll return random entries
    return [{"text": p['text'], "score": np.random.rand()} for p in passages]

async def generate_question(passage: Dict[str, str], difficulty: str) -> QuizQuestion:
    # AI logic to generate a question based on the passage text and difficulty
    question_text = f"What is the key idea in the following passage?\n\n{passage['text']}"
    options = ["Key Idea 1", "Key Idea 2", "Key Idea 3", "Key Idea 4"]
    correct_answer = "Key Idea 1"
    return QuizQuestion(question_text=question_text, options=options, correct_answer=correct_answer)

@router.post("/generate_quiz", response_model=QuizResponse)
@cache(expiration_time=60)  # Cache the response for 60 seconds
async def generate_quiz(quiz_request: QuizRequest):
    try:
        # Step 1: Perform a semantic search to find passages related to the topic
        related_passages = await semantic_search(quiz_request.topic)

        if not related_passages:
            raise HTTPException(status_code=404, detail="No related passages found.")
        
        # Step 2: Generate questions based on the related passages
        tasks = [generate_question(p, quiz_request.difficulty) for p in related_passages[:quiz_request.num_questions]]
        questions: List[QuizQuestion] = await asyncio.gather(*tasks)
        
        return QuizResponse(questions=questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

