from fastapi import APIRouter, HTTPException, Request, Body
from pydantic import BaseModel, Field, validator
from typing import Dict, Any, Optional, List, Tuple
import asyncpg
import logging
from datetime import datetime
import json
import re
from enum import Enum

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Meter patterns and configurations
METER_PATTERNS = {
    "dactylic_hexameter": {
        "name": "Dactylic Hexameter",
        "pattern": "— ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ×",
        "description": "Epic meter of Homer and Virgil",
        "feet_per_line": 6,
        "substitutions": {
            "dactyl": "— ∪ ∪",
            "spondee": "— —"
        },
        "caesura_positions": ["penthemimeral", "hephthemimeral", "trochaic"]
    },
    "elegiac_pentameter": {
        "name": "Elegiac Pentameter", 
        "pattern": "— ∪ ∪ | — ∪ ∪ || — ∪ ∪ | — ∪ ∪",
        "description": "Second line of elegiac couplet",
        "feet_per_line": 5,
        "substitutions": {
            "dactyl": "— ∪ ∪",
            "spondee": "— —"
        },
        "caesura_positions": ["central"]
    },
    "iambic_trimeter": {
        "name": "Iambic Trimeter",
        "pattern": "∪ — | ∪ — | ∪ —",
        "description": "Common meter in Greek drama",
        "feet_per_line": 3,
        "substitutions": {
            "iamb": "∪ —",
            "trochee": "— ∪",
            "spondee": "— —"
        },
        "caesura_positions": ["medial"]
    },
    "sapphic_stanza": {
        "name": "Sapphic Stanza",
        "pattern": "— ∪ | — — | ∪ ∪ — | ∪ — ∪ —",
        "description": "Sapphic hendecasyllable",
        "feet_per_line": 4,
        "substitutions": {
            "trochee": "— ∪",
            "spondee": "— —",
            "dactyl": "— ∪ ∪"
        },
        "caesura_positions": ["after_fifth"]
    },
    "alcaic_stanza": {
        "name": "Alcaic Stanza",
        "pattern": "∪ — | ∪ — — | ∪ ∪ — | ∪ — ∪ —",
        "description": "Alcaic hendecasyllable",
        "feet_per_line": 4,
        "substitutions": {
            "iamb": "∪ —",
            "spondee": "— —",
            "dactyl": "— ∪ ∪"
        },
        "caesura_positions": ["after_fifth"]
    }
}

# Foot colors as specified
FOOT_COLORS = {
    "dactyl": "#C9A962",  # gold
    "spondee": "#3B82F6",  # blue
    "trochee": "#10B981",  # green
    "iamb": "#8B5CF6",     # purple
    "anapest": "#F59E0B",  # amber
    "pyrrhic": "#6B7280",  # gray
    "molossus": "#DC2626", # red
    "cretic": "#059669"    # emerald
}

# Famous pre-scanned lines (10 examples)
PRESCANNED_LINES = [
    {
        "id": 1,
        "title": "Iliad 1.1",
        "author": "Homer",
        "work": "Iliad",
        "text": "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
        "language": "greek",
        "meter": "dactylic_hexameter",
        "scansion": "—  ∪ ∪ | — — | — — | ∪ ∪ — | ∪ — | — ×",
        "feet": ["dactyl", "spondee", "spondee", "dactyl", "trochee", "spondee"],
        "caesura": "penthemimeral",
        "translation": "Sing, goddess, the rage of Peleus' son Achilles"
    },
    {
        "id": 2,
        "title": "Aeneid 1.1",
        "author": "Virgil",
        "work": "Aeneid",
        "text": "Arma virumque cano, Troiae qui primus ab oris",
        "language": "latin",
        "meter": "dactylic_hexameter",
        "scansion": "— — | — — | — — | ∪ ∪ — | ∪ — | — ×",
        "feet": ["spondee", "spondee", "spondee", "dactyl", "trochee", "spondee"],
        "caesura": "penthemimeral",
        "translation": "Arms and the man I sing, who first from the shores of Troy"
    },
    {
        "id": 3,
        "title": "Odyssey 1.1",
        "author": "Homer",
        "work": "Odyssey",
        "text": "ἄνδρα μοι ἔννεπε μοῦσα πολύτροπον ὃς μάλα πολλὰ",
        "language": "greek",
        "meter": "dactylic_hexameter",
        "scansion": "— — | ∪ — — | — — | ∪ ∪ — | ∪ — | — —",
        "feet": ["spondee", "iamb+spondee", "spondee", "dactyl", "trochee", "spondee"],
        "caesura": "hephthemimeral",
        "translation": "Tell me, Muse, of the man of many ways, who wandered far"
    },
    {
        "id": 4,
        "title": "Catullus 51.1",
        "author": "Catullus",
        "work": "Carmina",
        "text": "Ille mi par esse deo videtur",
        "language": "latin",
        "meter": "sapphic_stanza",
        "scansion": "— — | — — | ∪ ∪ — | ∪ — ×",
        "feet": ["spondee", "spondee", "dactyl", "trochee"],
        "caesura": "after_fifth",
        "translation": "He seems to me equal to a god"
    },
    {
        "id": 5,
        "title": "Sappho fr. 31.1",
        "author": "Sappho",
        "work": "Fragments",
        "text": "φαίνεταί μοι κῆνος ἴσος θέοισιν",
        "language": "greek",
        "meter": "sapphic_stanza",
        "scansion": "— ∪ — | — — | ∪ ∪ — | ∪ — ×",
        "feet": ["trochee+iamb", "spondee", "dactyl", "trochee"],
        "caesura": "after_fifth",
        "translation": "That man seems to me equal to the gods"
    },
    {
        "id": 6,
        "title": "Georgics 1.1",
        "author": "Virgil",
        "work": "Georgics",
        "text": "Quid faciat laetas segetes, quo sidere terram",
        "language": "latin",
        "meter": "dactylic_hexameter",
        "scansion": "— — | — — | — — | ∪ ∪ — | ∪ — | — —",
        "feet": ["spondee", "spondee", "spondee", "dactyl", "trochee", "spondee"],
        "caesura": "penthemimeral",
        "translation": "What makes the crops joyful, under what star to turn the earth"
    },
    {
        "id": 7,
        "title": "Metamorphoses 1.1",
        "author": "Ovid",
        "work": "Metamorphoses",
        "text": "In nova fert animus mutatas dicere formas",
        "language": "latin",
        "meter": "dactylic_hexameter",
        "scansion": "— — | — — | — ∪ ∪ | — — | — — | — —",
        "feet": ["spondee", "spondee", "trochee+pyrrhic", "spondee", "spondee", "spondee"],
        "caesura": "trochaic",
        "translation": "My mind leads me to speak of forms changed into new bodies"
    },
    {
        "id": 8,
        "title": "Horace Odes 1.1.1",
        "author": "Horace",
        "work": "Odes",
        "text": "Maecenas atavis edite regibus",
        "language": "latin",
        "meter": "alcaic_stanza",
        "scansion": "— — | — — | ∪ ∪ — | ∪ — ×",
        "feet": ["spondee", "spondee", "dactyl", "trochee"],
        "caesura": "after_fifth",
        "translation": "Maecenas, descended from royal ancestors"
    },
    {
        "id": 9,
        "title": "Theogony 1",
        "author": "Hesiod",
        "work": "Theogony",
        "text": "Μουσάων Ἑλικωνιάδων ἀρχώμεθα ᾠδῆς",
        "language": "greek",
        "meter": "dactylic_hexameter",
        "scansion": "— — | ∪ ∪ — | ∪ — | — — | — — | — ×",
        "feet": ["spondee", "dactyl", "trochee", "spondee", "spondee", "spondee"],
        "caesura": "hephthemimeral",
        "translation": "From the Heliconian Muses let us begin our song"
    },
    {
        "id": 10,
        "title": "Pindar Ol. 1.1",
        "author": "Pindar",
        "work": "Olympian Odes",
        "text": "Ἄριστον μὲν ὕδωρ, ὁ δὲ χρυσὸς αἰθόμενον πῦρ",
        "language": "greek",
        "meter": "dactylic_hexameter",
        "scansion": "— — | — — | — — | ∪ ∪ — | ∪ — | — —",
        "feet": ["spondee", "spondee", "spondee", "dactyl", "trochee", "spondee"],
        "caesura": "penthemimeral",
        "translation": "Best is water, and gold like blazing fire"
    }
]

# Pydantic Models
class Language(str, Enum):
    greek = "greek"
    latin = "latin"

class MeterType(str, Enum):
    dactylic_hexameter = "dactylic_hexameter"
    elegiac_pentameter = "elegiac_pentameter"
    iambic_trimeter = "iambic_trimeter"
    sapphic_stanza = "sapphic_stanza"
    alcaic_stanza = "alcaic_stanza"

class ScanRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000, description="Text to scan")
    language: Language = Field(..., description="Language of the text")
    meter_type: MeterType = Field(..., description="Expected meter type")
    
    @validator('text')
    def validate_text(cls, v):
        if not v.strip():
            raise ValueError("Text cannot be empty")
        return v.strip()

class SyllabifyRequest(BaseModel):
    text: str = Field(..., min_length=1, max