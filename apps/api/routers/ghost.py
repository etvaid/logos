from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List, Union
import asyncpg
import logging
from datetime import datetime
import json
from enum import Enum
import random

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Ghost texts catalog - famous lost works
GHOST_TEXTS_CATALOG = {
    "sappho_books_2_9": {
        "id": "sappho_books_2_9",
        "title": "Sappho Books 2-9",
        "author": "Sappho",
        "work": "Complete Poems",
        "language": "greek",
        "period": "archaic",
        "date_lost": "Various periods (antiquity-medieval)",
        "fragments_count": 89,
        "reconstructable_percentage": 35.0,
        "description": "Lost books of Sappho's poetry, containing love poems, wedding songs, and personal lyrics",
        "surviving_sources": ["Papyrus fragments", "Quotations in later authors", "Oxyrhynchus Papyri"],
        "reconstruction_difficulty": "moderate",
        "major_fragments": ["Fragment 31 (Jealousy poem)", "Fragment 94 (Honestly, I wish I were dead)", "Fragment 105A (Wedding song)"]
    },
    "aristotle_poetics_ii": {
        "id": "aristotle_poetics_ii",
        "title": "Aristotle Poetics II (On Comedy)",
        "author": "Aristotle",
        "work": "Poetics",
        "language": "greek",
        "period": "classical",
        "date_lost": "Late antiquity",
        "fragments_count": 23,
        "reconstructable_percentage": 15.0,
        "description": "Lost second book of Poetics dealing with comedy, complementing the surviving book on tragedy",
        "surviving_sources": ["Tractatus Coislinianus", "Byzantine summaries", "Medieval Arabic translations"],
        "reconstruction_difficulty": "very_hard",
        "major_fragments": ["Tractatus Coislinianus", "Comic catharsis theory", "Definition of comedy"]
    },
    "livy_books_11_20": {
        "id": "livy_books_11_20",
        "title": "Livy Books 11-20 (Second Decade)",
        "author": "Livy",
        "work": "Ab Urbe Condita",
        "language": "latin",
        "period": "classical",
        "date_lost": "Medieval period",
        "fragments_count": 67,
        "reconstructable_percentage": 25.0,
        "description": "Lost books covering Roman history 292-218 BCE, including Pyrrhic Wars",
        "surviving_sources": ["Periochae (summaries)", "Later historians", "Epitomes"],
        "reconstruction_difficulty": "moderate",
        "major_fragments": ["Periocha 11", "Periocha 20", "References in Pliny"]
    },
    "livy_books_46_142": {
        "id": "livy_books_46_142",
        "title": "Livy Books 46-142 (Lost Decades)",
        "author": "Livy",
        "work": "Ab Urbe Condita",
        "language": "latin",
        "period": "classical",
        "date_lost": "Medieval period",
        "fragments_count": 234,
        "reconstructable_percentage": 20.0,
        "description": "Lost books covering Roman history from 167 BCE to Augustus' death (14 CE)",
        "surviving_sources": ["Periochae summaries", "Tacitus references", "Later epitomes"],
        "reconstruction_difficulty": "hard",
        "major_fragments": ["Summary of Civil Wars", "Augustus' rise to power", "Eastern campaigns"]
    },
    "ennius_annales": {
        "id": "ennius_annales",
        "title": "Ennius Annales (Complete Epic)",
        "author": "Ennius",
        "work": "Annales",
        "language": "latin",
        "period": "archaic",
        "date_lost": "Late antiquity",
        "fragments_count": 67,
        "reconstructable_percentage": 30.0,
        "description": "Epic poem on Roman history from Aeneas to Ennius' time, foundational to Roman literature",
        "surviving_sources": ["Cicero quotations", "Aulus Gellius", "Priscian"],
        "reconstruction_difficulty": "moderate",
        "major_fragments": ["Dream of Homer", "Battle descriptions", "Mythological episodes"]
    },
    "cicero_lost_speeches": {
        "id": "cicero_lost_speeches",
        "title": "Cicero's Lost Speeches",
        "author": "Cicero",
        "work": "Orationes (Various)",
        "language": "latin",
        "period": "classical",
        "date_lost": "Various periods",
        "fragments_count": 34,
        "reconstructable_percentage": 40.0,
        "description": "Collection of lost forensic and political speeches, including early career works",
        "surviving_sources": ["Quintilian quotations", "Asconius commentaries", "Later rhetoricians"],
        "reconstruction_difficulty": "easy",
        "major_fragments": ["Pro Roscio (early version)", "Consular speeches", "Prosecution speeches"]
    },
    "sophocles_lost_plays": {
        "id": "sophocles_lost_plays",
        "title": "Sophocles' Lost Plays (100+ Tragedies)",
        "author": "Sophocles",
        "work": "Various Tragedies",
        "language": "greek",
        "period": "classical",
        "date_lost": "Late antiquity",
        "fragments_count": 156,
        "reconstructable_percentage": 20.0,
        "description": "Over 100 lost tragedies by Sophocles, of which only 7 survive complete",
        "surviving_sources": ["Papyrus fragments", "Later anthologies", "Scholia"],
        "reconstruction_difficulty": "hard",
        "major_fragments": ["Ichneutae (Trackers)", "Nauplius", "Tereus"]
    },
    "aeschylus_lost_plays": {
        "id": "aeschylus_lost_plays",
        "title": "Aeschylus' Lost Plays (80+ Tragedies)",
        "author": "Aeschylus",
        "work": "Various Tragedies",
        "language": "greek",
        "period": "classical",
        "date_lost": "Late antiquity",
        "fragments_count": 98,
        "reconstructable_percentage": 18.0,
        "description": "Over 80 lost tragedies by Aeschylus, founder of Greek tragedy",
        "surviving_sources": ["Papyrus fragments", "Stoic quotations", "Athenaeus"],
        "reconstruction_difficulty": "very_hard",
        "major_fragments": ["Prometheus Unbound", "Myrmidons", "Niobe"]
    }
}

# Fragment types
FRAGMENT_TYPES = {
    "papyrus": "Papyrus fragment",
    "quotation": "Quotation in later author",
    "summary": "Ancient summary or epitome",
    "paraphrase": "Paraphrase by later source",
    "allusion": "Allusion or reference",
    "testimonia": "Ancient testimony about the work"
}

# Reconstruction methodologies
RECONSTRUCTION_METHODS = {
    "fragment_assembly": "Direct assembly of surviving fragments",
    "source_compilation": "Compilation from multiple ancient sources",
    "pattern_matching": "Matching against similar surviving works",
    "stylometric_analysis": "Analysis of authorial style patterns",
    "ai_reconstruction": "AI-powered text generation based on corpus",
    "comparative_reconstruction": "Reconstruction using parallel texts"
}

# Pydantic Models
class ReconstructionDifficulty(str, Enum):
    easy = "easy"
    moderate = "moderate"
    hard = "hard"
    very_hard = "very_hard"
    impossible = "impossible"

class FragmentType(str, Enum):
    papyrus = "papyrus"
    quotation = "quotation"
    summary = "summary"
    paraphrase = "paraphrase"
    allusion = "allusion"
    testimonia = "testimonia"

class GhostWork(BaseModel):
    id: str
    title: str
    author: str
    work: str
    language: str
    period: str
    date_lost: str
    fragments_count: int
    reconstructable_percentage: float = Field(..., ge=0.0, le=100.0)
    description: str
    surviving_sources: List[str]
    reconstruction_difficulty: ReconstructionDifficulty
    major_fragments: List[str]

class Fragment(BaseModel):
    id: int
    ghost_work_id: str
    fragment_number: str
    text: str
    translation: Optional[str] = None
    source: str
    fragment_type: FragmentType
    confidence: float = Field(..., ge=0.0, le=1.0)
    context: Optional[str] = None
    dating: Optional[str] = None
    scholarly_notes: Optional[str] = None

class GhostWorksResponse(BaseModel):
    works: List[GhostWork]
    total_works: int
    total_fragments: int
    languages: List[str]
    periods: List[str]
    reconstruction_stats: Dict[str, int]

class GhostWorkDetails(BaseModel):
    work: GhostWork
    fragments: List[Fragment]
    reconstruction_status: Dict[str, Any]
    related_works: List[str]
    bibliography: List[str]
    recent_discoveries: Optional[List[Dict[str, Any]]] = None

class FragmentsResponse(BaseModel):
    ghost_work_id: str
    title: str
    author: str
    total_fragments: int
    fragments: List[Fragment]
    fragment_types: Dict[str, int]
    sources: Dict[str, int]
    completeness_estimate: float = Field(..., ge=0.0, le=1.0)

class ReconstructionRequest(BaseModel):
    ghost_work_id: str = Field(..., description="ID of the ghost work to reconstruct")
    method: str = Field("ai_reconstruction", description="Reconstruction methodology")
    target_length: Optional[int] = Field(None, ge=50, le=5000, description="Target length for reconstruction")
    include_fragments: bool = Field(True, description="Include existing fragments in reconstruction")
    confidence_threshold: float = Field(0.3, ge=0.0, le=1.0, description="Minimum confidence for inclusion")
    style_matching: bool = Field(True, description="Match authorial style")

class ReconstructionResult(BaseModel):
    ghost_work_id: str
    method: str
    reconstructed_text: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    methodology: Dict[str, Any]
    evidence: List[Dict[str, Any]]
    fragment_integration: Dict[str, Any]
    limitations: List[str]
    alternative_readings: Optional[List[str]] = None
    scholarly_apparatus: Optional[Dict[str, Any]] = None
    timestamp: str

# Utility Functions
def calculate_work_completeness(work_id: str, fragments: List[Fragment]) -> float:
    """Calculate estimated completeness of a ghost work"""
    if work_id not in GHOST_TEXTS_CATALOG:
        return 0.0
    
    work = GHOST_TEXTS_CATALOG[work_id]
    base_percentage = work["reconstructable_percentage"] / 100.0
    
    # Adjust based on fragment quality
    quality_bonus = 0.0
    for fragment in fragments:
        if fragment.fragment_type in [FragmentType.papyrus, FragmentType.quotation]:
            quality_bonus += 0.02
        elif fragment.confidence > 0.8:
            quality_bonus += 0.01
    
    return min(1.0, base_percentage + quality_bonus)

def generate_mock_fragments(work_id: str, count: int) -> List[Fragment]:
    """Generate mock fragments for demonstration"""
    fragments = []
    
    if work_id not in GHOST_TEXTS_CATALOG:
        return fragments
    
    work = GHOST_TEXTS_CATALOG[work_id]
    
    for i in range(min(count, work["fragments_count"])):
        fragment = Fragment(
            id=i + 1,
            ghost_work_id=work_id,
            fragment_number=f"Fr. {i + 1}",
            text=f"[Fragment {i + 1} of {work['title']}] Lorem ipsum dolor sit amet...",
            translation=f"English translation of fragment {i + 1}...",
            source=random.choice(work["surviving_sources"]),
            fragment_type=random.choice(list(FragmentType)),
            confidence=random.uniform(0.3, 0.95),
            context=f"Context for fragment {i + 1}",