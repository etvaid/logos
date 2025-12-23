from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime, timedelta

router = APIRouter(prefix="/organic-learning", tags=["Organic Learning"])

# Data models
class WordExample(BaseModel):
    sentence: str
    translation: str
    source: str
    context: str

class DailyWord(BaseModel):
    word: str
    definition: str
    pronunciation: str
    etymology: str
    examples: List[WordExample]
    date: str

class VocabularyItem(BaseModel):
    word: str
    definition: str
    difficulty: str
    mastery_level: int
    last_reviewed: str

class ProgressUpdate(BaseModel):
    word: str
    correct: bool
    time_spent: int
    difficulty_rating: int

class ProgressResponse(BaseModel):
    message: str
    new_mastery_level: int
    next_review_date: str

# Sample data
DAILY_WORD_DATA = {
    "word": "μῆνις",
    "definition": "wrath, anger, rage (especially divine or heroic anger)",
    "pronunciation": "MEH-nis",
    "etymology": "From Proto-Indo-European *men- (to think, mind). Related to Latin mens (mind) and English 'mental'.",
    "examples": [
        {
            "sentence": "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
            "translation": "Sing, goddess, of the wrath of Achilles, son of Peleus",
            "source": "Homer, Iliad 1.1",
            "context": "The famous opening line of the Iliad, introducing the central theme of Achilles' anger"
        },
        {
            "sentence": "οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε",
            "translation": "destructive wrath, which brought countless sorrows to the Achaeans",
            "source": "Homer, Iliad 1.2",
            "context": "Continuation describing the devastating effects of Achilles' wrath"
        },
        {
            "sentence": "θεῶν μῆνις χαλεπή",
            "translation": "the harsh wrath of the gods",
            "source": "Herodotus, Histories 1.34",
            "context": "Croesus speaking about divine retribution and the anger of the gods"
        },
        {
            "sentence": "μῆνιν καὶ ὀργὴν ἀποθέσθαι",
            "translation": "to put aside wrath and anger",
            "source": "Xenophon, Cyropaedia 3.1.38",
            "context": "Advice on controlling one's temper in leadership situations"
        },
        {
            "sentence": "ἀθανάτων μῆνις βαρεῖα",
            "translation": "the heavy wrath of the immortals",
            "source": "Pindar, Pythian 2.34",
            "context": "Warning about the consequences of offending the gods"
        }
    ],
    "date": datetime.now().strftime("%Y-%m-%d")
}

VOCABULARY_DATA = [
    {
        "word": "μῆνις",
        "definition": "wrath, anger, rage",
        "difficulty": "intermediate",
        "mastery_level": 3,
        "last_reviewed": "2024-01-15"
    },
    {
        "word": "ἀρετή",
        "definition": "virtue, excellence",
        "difficulty": "intermediate",
        "mastery_level": 4,
        "last_reviewed": "2024-01-14"
    },
    {
        "word": "σοφία",
        "definition": "wisdom",
        "difficulty": "beginner",
        "mastery_level": 5,
        "last_reviewed": "2024-01-13"
    },
    {
        "word": "δικαιοσύνη",
        "definition": "justice, righteousness",
        "difficulty": "advanced",
        "mastery_level": 2,
        "last_reviewed": "2024-01-12"
    },
    {
        "word": "φιλοσοφία",
        "definition": "love of wisdom, philosophy",
        "difficulty": "intermediate",
        "mastery_level": 4,
        "last_reviewed": "2024-01-11"
    }
]

@router.get("/daily", response_model=DailyWord)
async def get_daily_word():
    """
    Get the word of the day with examples from classical texts.
    Returns a curated word with definition, etymology, and contextual examples.
    """
    try:
        return DailyWord(**DAILY_WORD_DATA)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving daily word: {str(e)}")

@router.get("/vocabulary", response_model=List[VocabularyItem])
async def get_vocabulary_list(
    difficulty: str = None,
    min_mastery: int = None,
    limit: int = 20
):
    """
    Get user's vocabulary list with optional filtering.
    
    Args:
        difficulty: Filter by difficulty level (beginner, intermediate, advanced)
        min_mastery: Filter by minimum mastery level (1-5)
        limit: Maximum number of items to return
    """
    try:
        vocabulary = VOCABULARY_DATA.copy()
        
        # Apply filters
        if difficulty:
            vocabulary = [item for item in vocabulary if item["difficulty"] == difficulty]
        
        if min_mastery is not None:
            vocabulary = [item for item in vocabulary if item["mastery_level"] >= min_mastery]
        
        # Apply limit
        vocabulary = vocabulary[:limit]
        
        return [VocabularyItem(**item) for item in vocabulary]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving vocabulary: {str(e)}")

@router.post("/progress", response_model=ProgressResponse)
async def update_progress(progress: ProgressUpdate):
    """
    Update user's learning progress for a specific word.
    
    Args:
        progress: Progress data including word, correctness, time spent, and difficulty rating
    """
    try:
        # Find the word in vocabulary
        word_found = False
        new_mastery_level = 1
        
        for item in VOCABULARY_DATA:
            if item["word"] == progress.word:
                word_found = True
                current_mastery = item["mastery_level"]
                
                # Update mastery level based on performance
                if progress.correct:
                    new_mastery_level = min(5, current_mastery + 1)
                else:
                    new_mastery_level = max(1, current_mastery - 1)
                
                # Update the item
                item["mastery_level"] = new_mastery_level
                item["last_reviewed"] = datetime.now().strftime("%Y-%m-%d")
                break
        
        if not word_found:
            raise HTTPException(status_code=404, detail="Word not found in vocabulary")
        
        # Calculate next review date based on mastery level
        days_until_next_review = new_mastery_level * 2
        next_review_date = (datetime.now() + timedelta(days=days_until_next_review)).strftime("%Y-%m-%d")
        
        return ProgressResponse(
            message=f"Progress updated successfully for '{progress.word}'",
            new_mastery_level=new_mastery_level,
            next_review_date=next_review_date
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating progress: {str(e)}")