"""
LOGOS API - Audio Router
Pronunciation in 3 systems: Classical, Ecclesiastical, Reconstructed
"""

from fastapi import APIRouter, Query
from typing import Literal

router = APIRouter()

@router.get("/pronounce")
async def get_pronunciation(
    text: str = Query(..., max_length=500),
    style: Literal["classical", "ecclesiastical", "reconstructed"] = "classical",
    language: Literal["grc", "lat"] = "grc"
):
    """
    Get pronunciation audio for Greek or Latin text.
    
    Styles:
    - classical: Historical reconstruction of ancient pronunciation
    - ecclesiastical: Church/liturgical pronunciation
    - reconstructed: Modern scholarly reconstruction
    """
    return {
        "text": text,
        "language": language,
        "style": style,
        "ipa": "[phonetic transcription]",
        "audio_url": f"/api/audio/file/{style}/{language}/{hash(text) % 10000}.mp3",
        "notes": f"Pronunciation in {style} style"
    }

@router.get("/styles")
async def get_pronunciation_styles():
    """Get information about pronunciation styles."""
    return {
        "styles": [
            {
                "id": "classical",
                "name": "Classical",
                "description": "Reconstruction of ancient Attic Greek / Classical Latin pronunciation",
                "features": ["Pitch accent (Greek)", "Vowel quantity distinctions", "Historical consonant values"]
            },
            {
                "id": "ecclesiastical",
                "name": "Ecclesiastical",
                "description": "Church pronunciation used in liturgy",
                "features": ["Italianate Latin", "Byzantine Greek", "Used in Catholic/Orthodox traditions"]
            },
            {
                "id": "reconstructed",
                "name": "Reconstructed",
                "description": "Modern scholarly reconstruction based on latest research",
                "features": ["Based on comparative linguistics", "Accounts for dialect variation", "Reflects current scholarship"]
            }
        ]
    }
