
from fastapi import APIRouter, Request
from typing import Dict, Any

router = APIRouter()

GREEK_MODULES = [
    {"id": "g01", "title": "Greek Alphabet", "level": 1, "lessons": 5},
    {"id": "g02", "title": "Basic Nouns (1st Declension)", "level": 1, "lessons": 8},
    {"id": "g03", "title": "Basic Nouns (2nd Declension)", "level": 1, "lessons": 6},
    {"id": "g04", "title": "Present Active Indicative", "level": 2, "lessons": 7},
    {"id": "g05", "title": "Imperfect Active", "level": 2, "lessons": 5},
    # ... add more
]

LATIN_MODULES = [
    {"id": "l01", "title": "Latin Alphabet & Pronunciation", "level": 1, "lessons": 4},
    {"id": "l02", "title": "First Declension", "level": 1, "lessons": 6},
    {"id": "l03", "title": "Second Declension", "level": 1, "lessons": 6},
    {"id": "l04", "title": "Present Active Indicative", "level": 2, "lessons": 7},
    {"id": "l05", "title": "Imperfect Active", "level": 2, "lessons": 5},
    # ... add more
]

LEVELS = [
    {"name": "Novice", "min_xp": 0},
    {"name": "Discipulus", "min_xp": 500},
    {"name": "Studiosus", "min_xp": 2000},
    {"name": "Doctus", "min_xp": 5000},
    {"name": "Magister", "min_xp": 10000},
    {"name": "Philosophus", "min_xp": 25000}
]

@router.get("/modules")
async def list_modules() -> Dict[str, Any]:
    """List all learning modules"""
    return {
        "greek": GREEK_MODULES,
        "latin": LATIN_MODULES,
        "total": len(GREEK_MODULES) + len(LATIN_MODULES)
    }

@router.get("/module/{id}")
async def get_module(id: str) -> Dict[str, Any]:
    """Get module details"""
    all_modules = GREEK_MODULES + LATIN_MODULES
    for m in all_modules:
        if m["id"] == id:
            return {**m, "lessons": []}
    return {"error": "Module not found"}

@router.get("/user/{user_id}/stats")
async def get_user_stats(user_id: str) -> Dict[str, Any]:
    """Get user learning statistics"""
    return {
        "user_id": user_id,
        "xp": 0,
        "level": "Novice",
        "streak": 0,
        "completed_modules": [],
        "achievements": []
    }

@router.get("/levels")
async def get_levels() -> Dict[str, Any]:
    """Get XP levels"""
    return {"levels": LEVELS}

@router.get("/achievements")
async def get_achievements() -> Dict[str, Any]:
    """List all achievements"""
    return {
        "achievements": [
            {"id": "first_word", "name": "First Word", "description": "Look up your first word"},
            {"id": "reader", "name": "Avid Reader", "description": "Read 100 passages"},
            {"id": "streak_7", "name": "Week Warrior", "description": "7-day streak"},
            {"id": "streak_30", "name": "Monthly Master", "description": "30-day streak"}
        ]
    }
