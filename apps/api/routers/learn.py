from fastapi import APIRouter, HTTPException, Request, Query, Body
from pydantic import BaseModel, Field, validator
from typing import Dict, Any, Optional, List, Union
import asyncpg
import logging
from datetime import datetime, timedelta
import json
from enum import Enum
import random
import math

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# XP and Level Configuration
XP_REWARDS = {
    "read_passage": 10,
    "complete_exercise": 25,
    "flashcard_correct": 5,
    "daily_streak_bonus": 50
}

LEVELS = {
    "Novice": {"threshold": 0, "next": "Discipulus"},
    "Discipulus": {"threshold": 500, "next": "Studiosus"},
    "Studiosus": {"threshold": 2000, "next": "Doctus"},
    "Doctus": {"threshold": 5000, "next": "Magister"},
    "Magister": {"threshold": 10000, "next": "Philosophus"},
    "Philosophus": {"threshold": 25000, "next": None}
}

# Learning modules - 32 Latin + 32 Greek
LEARNING_MODULES = {
    "latin": [
        {"id": 1, "title": "Latin Fundamentals I", "description": "Basic Latin grammar and vocabulary", "difficulty": "beginner"},
        {"id": 2, "title": "Latin Fundamentals II", "description": "Noun declensions and verb conjugations", "difficulty": "beginner"},
        {"id": 3, "title": "Caesar's Gallic Wars I", "description": "Reading Caesar - Book 1", "difficulty": "intermediate"},
        {"id": 4, "title": "Caesar's Gallic Wars II", "description": "Reading Caesar - Book 2", "difficulty": "intermediate"},
        {"id": 5, "title": "Cicero's Speeches I", "description": "Catiline Orations", "difficulty": "advanced"},
        {"id": 6, "title": "Cicero's Speeches II", "description": "Philippics", "difficulty": "advanced"},
        {"id": 7, "title": "Virgil's Aeneid I", "description": "Epic poetry - Books 1-2", "difficulty": "advanced"},
        {"id": 8, "title": "Virgil's Aeneid II", "description": "Epic poetry - Books 3-4", "difficulty": "advanced"},
        {"id": 9, "title": "Ovid's Metamorphoses I", "description": "Mythological poetry - Books 1-3", "difficulty": "intermediate"},
        {"id": 10, "title": "Ovid's Metamorphoses II", "description": "Mythological poetry - Books 4-6", "difficulty": "intermediate"},
        {"id": 11, "title": "Livy's History I", "description": "Ab Urbe Condita - Books 1-5", "difficulty": "advanced"},
        {"id": 12, "title": "Livy's History II", "description": "Ab Urbe Condita - Books 6-10", "difficulty": "advanced"},
        {"id": 13, "title": "Horace's Odes I", "description": "Lyric poetry - Books 1-2", "difficulty": "advanced"},
        {"id": 14, "title": "Horace's Odes II", "description": "Lyric poetry - Books 3-4", "difficulty": "advanced"},
        {"id": 15, "title": "Tacitus' Annals I", "description": "Imperial history - Books 1-6", "difficulty": "expert"},
        {"id": 16, "title": "Tacitus' Annals II", "description": "Imperial history - Books 11-16", "difficulty": "expert"},
        {"id": 17, "title": "Pliny's Letters", "description": "Epistolary prose", "difficulty": "intermediate"},
        {"id": 18, "title": "Suetonius' Lives", "description": "Biographical writing", "difficulty": "intermediate"},
        {"id": 19, "title": "Quintilian's Education", "description": "Rhetorical theory", "difficulty": "advanced"},
        {"id": 20, "title": "Seneca's Philosophy", "description": "Stoic moral letters", "difficulty": "advanced"},
        {"id": 21, "title": "Petronius' Satyricon", "description": "Satirical novel", "difficulty": "intermediate"},
        {"id": 22, "title": "Apuleius' Golden Ass", "description": "Ancient novel", "difficulty": "intermediate"},
        {"id": 23, "title": "Catullus' Poems", "description": "Personal lyric poetry", "difficulty": "intermediate"},
        {"id": 24, "title": "Martial's Epigrams", "description": "Satirical short poems", "difficulty": "intermediate"},
        {"id": 25, "title": "Juvenal's Satires", "description": "Social commentary", "difficulty": "advanced"},
        {"id": 26, "title": "Lucretius' Nature", "description": "Epicurean philosophy in verse", "difficulty": "expert"},
        {"id": 27, "title": "Augustine's Confessions", "description": "Christian autobiography", "difficulty": "advanced"},
        {"id": 28, "title": "Jerome's Letters", "description": "Christian correspondence", "difficulty": "advanced"},
        {"id": 29, "title": "Boethius' Consolation", "description": "Philosophical dialogue", "difficulty": "advanced"},
        {"id": 30, "title": "Medieval Latin Texts", "description": "Later Latin literature", "difficulty": "intermediate"},
        {"id": 31, "title": "Latin Inscriptions", "description": "Epigraphic texts", "difficulty": "intermediate"},
        {"id": 32, "title": "Neo-Latin Poetry", "description": "Renaissance Latin verse", "difficulty": "advanced"}
    ],
    "greek": [
        {"id": 33, "title": "Greek Fundamentals I", "description": "Basic Greek grammar and alphabet", "difficulty": "beginner"},
        {"id": 34, "title": "Greek Fundamentals II", "description": "Noun and verb systems", "difficulty": "beginner"},
        {"id": 35, "title": "Homer's Iliad I", "description": "Epic poetry - Books 1-6", "difficulty": "advanced"},
        {"id": 36, "title": "Homer's Iliad II", "description": "Epic poetry - Books 7-12", "difficulty": "advanced"},
        {"id": 37, "title": "Homer's Odyssey I", "description": "Epic poetry - Books 1-6", "difficulty": "advanced"},
        {"id": 38, "title": "Homer's Odyssey II", "description": "Epic poetry - Books 7-12", "difficulty": "advanced"},
        {"id": 39, "title": "Plato's Republic I", "description": "Political philosophy - Books 1-5", "difficulty": "expert"},
        {"id": 40, "title": "Plato's Republic II", "description": "Political philosophy - Books 6-10", "difficulty": "expert"},
        {"id": 41, "title": "Aristotle's Ethics", "description": "Nicomachean Ethics", "difficulty": "expert"},
        {"id": 42, "title": "Aristotle's Politics", "description": "Political theory", "difficulty": "expert"},
        {"id": 43, "title": "Herodotus' Histories I", "description": "The Persian Wars - Books 1-5", "difficulty": "advanced"},
        {"id": 44, "title": "Herodotus' Histories II", "description": "The Persian Wars - Books 6-9", "difficulty": "advanced"},
        {"id": 45, "title": "Thucydides' War I", "description": "Peloponnesian War - Books 1-4", "difficulty": "expert"},
        {"id": 46, "title": "Thucydides' War II", "description": "Peloponnesian War - Books 5-8", "difficulty": "expert"},
        {"id": 47, "title": "Sophocles' Tragedies I", "description": "Oedipus cycle", "difficulty": "advanced"},
        {"id": 48, "title": "Sophocles' Tragedies II", "description": "Ajax, Electra, Philoctetes", "difficulty": "advanced"},
        {"id": 49, "title": "Euripides' Tragedies I", "description": "Medea, Hippolytus, Bacchae", "difficulty": "advanced"},
        {"id": 50, "title": "Euripides' Tragedies II", "description": "Hecuba, Trojan Women, Iphigenia", "difficulty": "advanced"},
        {"id": 51, "title": "Aeschylus' Oresteia", "description": "The trilogy", "difficulty": "expert"},
        {"id": 52, "title": "Aristophanes' Comedies", "description": "Old Comedy - Clouds, Birds, Frogs", "difficulty": "advanced"},
        {"id": 53, "title": "Xenophon's Anabasis", "description": "The march of the Ten Thousand", "difficulty": "intermediate"},
        {"id": 54, "title": "Xenophon's Memorabilia", "description": "Recollections of Socrates", "difficulty": "intermediate"},
        {"id": 55, "title": "Demosthenes' Orations", "description": "Political speeches", "difficulty": "advanced"},
        {"id": 56, "title": "Isocrates' Speeches", "description": "Rhetorical works", "difficulty": "advanced"},
        {"id": 57, "title": "Plutarch's Lives I", "description": "Parallel Lives - Greeks", "difficulty": "intermediate"},
        {"id": 58, "title": "Plutarch's Lives II", "description": "Parallel Lives - Romans", "difficulty": "intermediate"},
        {"id": 59, "title": "Pindar's Odes", "description": "Victory odes", "difficulty": "expert"},
        {"id": 60, "title": "Sappho and Alcaeus", "description": "Archaic lyric poetry", "difficulty": "advanced"},
        {"id": 61, "title": "New Testament Greek I", "description": "Gospels", "difficulty": "intermediate"},
        {"id": 62, "title": "New Testament Greek II", "description": "Paul's Letters", "difficulty": "intermediate"},
        {"id": 63, "title": "Greek Papyri", "description": "Documentary texts", "difficulty": "advanced"},
        {"id": 64, "title": "Byzantine Greek", "description": "Later Greek literature", "difficulty": "advanced"}
    ]
}

# Achievements configuration (50+ achievements)
ACHIEVEMENTS = [
    {"id": 1, "title": "First Steps", "description": "Complete your first lesson", "xp_reward": 50, "type": "progress"},
    {"id": 2, "title": "Scholar", "description": "Reach 1000 XP", "xp_reward": 100, "type": "xp"},
    {"id": 3, "title": "Dedicated Student", "description": "Maintain a 7-day streak", "xp_reward": 150, "type": "streak"},
    {"id": 4, "title": "Latin Novice", "description": "Complete 5 Latin modules", "xp_reward": 200, "type": "modules"},
    {"id": 5, "title": "Greek Explorer", "description": "Complete 5 Greek modules", "xp_reward": 200, "type": "modules"},
    {"id": 6, "title": "Vocabulary Master", "description": "Learn 500 vocabulary words", "xp_reward": 250, "type": "vocabulary"},
    {"id": 7, "title": "Grammar Guru", "description": "Complete 100 grammar exercises", "xp_reward": 200, "type": "exercises"},
    {"id": 8, "title": "Translation Ace", "description": "Complete 50 translation exercises", "xp_reward": 300, "type": "exercises"},
    {"id": 9, "title": "Flashcard Champion", "description": "Review 1000 flashcards", "xp_reward": 200, "type": "flashcards"},
    {"id": 10, "title": "Perfect Week", "description": "Score 100% on all exercises for 7 days", "xp_reward": 500, "type": "performance"},
    {"id": 11, "title": "Caesar's Student", "description