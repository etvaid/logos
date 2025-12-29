from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter()

GREEK_MODULES = [
    {"id": "gr_alphabet", "title": "Greek Alphabet", "level": 1, "lessons": 8},
    {"id": "gr_nouns_1", "title": "First Declension Nouns", "level": 1, "lessons": 10},
    {"id": "gr_nouns_2", "title": "Second Declension Nouns", "level": 1, "lessons": 10},
    {"id": "gr_nouns_3", "title": "Third Declension Nouns", "level": 2, "lessons": 15},
    {"id": "gr_verbs_present", "title": "Present Tense Verbs", "level": 1, "lessons": 12},
    {"id": "gr_verbs_aorist", "title": "Aorist Tense", "level": 2, "lessons": 12},
    {"id": "gr_verbs_perfect", "title": "Perfect Tense", "level": 3, "lessons": 10},
    {"id": "gr_participles", "title": "Participles", "level": 3, "lessons": 15},
    {"id": "gr_infinitives", "title": "Infinitives", "level": 2, "lessons": 8},
    {"id": "gr_subjunctive", "title": "Subjunctive Mood", "level": 3, "lessons": 10},
    {"id": "gr_optative", "title": "Optative Mood", "level": 4, "lessons": 10},
    {"id": "gr_conditionals", "title": "Conditional Sentences", "level": 4, "lessons": 12},
    {"id": "gr_indirect", "title": "Indirect Discourse", "level": 4, "lessons": 10},
    {"id": "gr_prose_comp", "title": "Prose Composition", "level": 5, "lessons": 20},
    {"id": "gr_dialects", "title": "Greek Dialects", "level": 5, "lessons": 15},
    {"id": "gr_homer", "title": "Reading Homer", "level": 4, "lessons": 25},
]

LATIN_MODULES = [
    {"id": "la_alphabet", "title": "Latin Alphabet & Pronunciation", "level": 1, "lessons": 6},
    {"id": "la_nouns_1_2", "title": "First & Second Declension", "level": 1, "lessons": 12},
    {"id": "la_nouns_3", "title": "Third Declension", "level": 2, "lessons": 12},
    {"id": "la_nouns_4_5", "title": "Fourth & Fifth Declension", "level": 2, "lessons": 8},
    {"id": "la_adjectives", "title": "Adjectives", "level": 1, "lessons": 10},
    {"id": "la_verbs_present", "title": "Present System", "level": 1, "lessons": 15},
    {"id": "la_verbs_perfect", "title": "Perfect System", "level": 2, "lessons": 12},
    {"id": "la_subjunctive", "title": "Subjunctive Mood", "level": 3, "lessons": 15},
    {"id": "la_participles", "title": "Participles", "level": 3, "lessons": 12},
    {"id": "la_gerunds", "title": "Gerunds & Gerundives", "level": 3, "lessons": 8},
    {"id": "la_indirect", "title": "Indirect Statement", "level": 3, "lessons": 10},
    {"id": "la_conditionals", "title": "Conditional Sentences", "level": 4, "lessons": 10},
    {"id": "la_prose_comp", "title": "Latin Prose Composition", "level": 5, "lessons": 20},
    {"id": "la_virgil", "title": "Reading Virgil", "level": 4, "lessons": 25},
    {"id": "la_cicero", "title": "Reading Cicero", "level": 4, "lessons": 20},
    {"id": "la_medieval", "title": "Medieval Latin", "level": 5, "lessons": 15},
]

LEVELS = [
    {"name": "Novice", "min_xp": 0, "badge": "🌱"},
    {"name": "Discipulus", "min_xp": 500, "badge": "📚"},
    {"name": "Studiosus", "min_xp": 2000, "badge": "🎓"},
    {"name": "Doctus", "min_xp": 5000, "badge": "📜"},
    {"name": "Magister", "min_xp": 10000, "badge": "🏛️"},
    {"name": "Philosophus", "min_xp": 25000, "badge": "🦉"},
]

@router.get("/modules")
async def get_modules() -> Dict[str, Any]:
    """Get all learning modules"""
    return {"greek": GREEK_MODULES, "latin": LATIN_MODULES}

@router.get("/levels")
async def get_levels() -> Dict[str, Any]:
    """Get XP levels"""
    return {"levels": LEVELS}

@router.get("/achievements")
async def get_achievements() -> Dict[str, Any]:
    """Get available achievements"""
    return {
        "achievements": [
            {"id": "first_lesson", "name": "First Steps", "desc": "Complete your first lesson", "xp": 50},
            {"id": "week_streak", "name": "Dedicated Scholar", "desc": "7-day streak", "xp": 200},
            {"id": "month_streak", "name": "Devoted Student", "desc": "30-day streak", "xp": 1000},
            {"id": "all_greek_1", "name": "Greek Beginner", "desc": "Complete all Level 1 Greek", "xp": 500},
            {"id": "all_latin_1", "name": "Latin Beginner", "desc": "Complete all Level 1 Latin", "xp": 500},
            {"id": "homer_reader", "name": "Homer Reader", "desc": "Complete Reading Homer module", "xp": 1000},
            {"id": "virgil_reader", "name": "Virgil Reader", "desc": "Complete Reading Virgil module", "xp": 1000},
        ]
    }

@router.get("/")
async def root() -> Dict[str, Any]:
    return {"status": "ready", "description": "LEARN - 64 modules, gamification, XP system"}