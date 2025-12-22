"""
LOGOS API - Learning Router
Flashcards, exercises, and progress tracking
"""

from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class Flashcard(BaseModel):
    id: int
    word: str
    language: str
    definition: str
    example_urn: Optional[str] = None
    example_text: Optional[str] = None
    ease_factor: float = 2.5
    interval_days: int = 1
    due: bool = True

class LearningProgress(BaseModel):
    vocabulary_mastered: int
    passages_read: int
    exercises_completed: int
    streak_days: int
    xp_total: int
    level: int
    achievements: List[str]

@router.get("/flashcards")
async def get_due_flashcards(
    limit: int = Query(default=20, le=100),
    language: Optional[str] = None
):
    """Get flashcards due for review."""
    demo_cards = [
        Flashcard(id=1, word="μῆνις", language="grc", definition="wrath, anger", example_urn="urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1"),
        Flashcard(id=2, word="arma", language="lat", definition="arms, weapons", example_urn="urn:cts:latinLit:phi0690.phi003.perseus-lat2:1.1"),
        Flashcard(id=3, word="ἀείδω", language="grc", definition="sing, celebrate", example_urn="urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1"),
    ]
    
    if language:
        demo_cards = [c for c in demo_cards if c.language == language]
    
    return {"flashcards": demo_cards[:limit], "total_due": len(demo_cards)}

@router.post("/flashcards/review")
async def submit_review(card_id: int, quality: int = Query(..., ge=0, le=5)):
    """
    Submit a flashcard review.
    
    Quality: 0 (forgot) to 5 (perfect recall)
    Uses spaced repetition algorithm.
    """
    return {
        "card_id": card_id,
        "quality": quality,
        "new_interval": 3 if quality >= 3 else 1,
        "new_ease_factor": 2.5,
        "message": "Review recorded"
    }

@router.get("/progress", response_model=LearningProgress)
async def get_progress():
    """Get user's learning progress."""
    return LearningProgress(
        vocabulary_mastered=127,
        passages_read=45,
        exercises_completed=89,
        streak_days=7,
        xp_total=2450,
        level=5,
        achievements=["First Word", "Week Streak", "Homer Reader"]
    )

@router.post("/exercise")
async def get_exercise(
    exercise_type: str = "vocabulary",
    difficulty: str = "intermediate",
    language: str = "grc"
):
    """Get a practice exercise."""
    return {
        "type": exercise_type,
        "difficulty": difficulty,
        "language": language,
        "question": "What is the nominative singular of μῆνις?",
        "options": ["μῆνις", "μῆνιν", "μήνιδος", "μῆνι"],
        "correct_index": 0
    }
