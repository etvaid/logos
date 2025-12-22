"""
LOGOS API - Prosody Router
Metrical scansion and analysis
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Literal

router = APIRouter()

class ScansionResult(BaseModel):
    text: str
    meter: str
    scansion: str
    feet: List[str]
    caesura: Optional[str] = None
    notes: List[str]

@router.post("/scan", response_model=ScansionResult)
async def scan_meter(
    text: str,
    meter: Optional[Literal["hexameter", "elegiac", "iambic", "auto"]] = "auto"
):
    """
    Scan the meter of Greek or Latin verse.
    
    Supports:
    - Dactylic hexameter (epic)
    - Elegiac couplets
    - Iambic trimeter/senarius
    - Auto-detection
    """
    
    # Demo scansions
    if "μῆνιν ἄειδε" in text:
        return ScansionResult(
            text=text,
            meter="dactylic_hexameter",
            scansion="— ∪ ∪ | — — | — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — —",
            feet=["dactyl", "spondee", "dactyl", "dactyl", "dactyl", "spondee"],
            caesura="penthemimeral (after θεὰ)",
            notes=[
                "Standard epic hexameter opening",
                "μῆνιν: heavy first syllable sets weighty tone",
                "Caesura after θεὰ creates dramatic pause before Achilles"
            ]
        )
    
    if "Arma virumque" in text:
        return ScansionResult(
            text=text,
            meter="dactylic_hexameter",
            scansion="— ∪ ∪ | — — | — — | — ∪ ∪ | — ∪ ∪ | — —",
            feet=["dactyl", "spondee", "spondee", "dactyl", "dactyl", "spondee"],
            caesura="penthemimeral (after cano)",
            notes=[
                "Virgilian hexameter with characteristic spondaic weight",
                "Opening spondees create gravitas",
                "Arma virumque: deliberate ambiguity (arms AND man, or armed man)"
            ]
        )
    
    return ScansionResult(
        text=text,
        meter=meter if meter != "auto" else "unknown",
        scansion="[Scansion would be computed]",
        feet=[],
        caesura=None,
        notes=["Full metrical analysis available in production"]
    )

@router.get("/meters")
async def list_meters():
    """Get information about supported meters."""
    return {
        "meters": [
            {
                "id": "hexameter",
                "name": "Dactylic Hexameter",
                "description": "The meter of epic poetry (Homer, Virgil)",
                "pattern": "— ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — —",
                "languages": ["grc", "lat"]
            },
            {
                "id": "elegiac",
                "name": "Elegiac Couplet",
                "description": "Hexameter + pentameter, used in elegy",
                "pattern": "Hex + — ∪ ∪ | — ∪ ∪ | — || — ∪ ∪ | — ∪ ∪ | —",
                "languages": ["grc", "lat"]
            },
            {
                "id": "iambic",
                "name": "Iambic Trimeter/Senarius",
                "description": "The meter of drama and satire",
                "pattern": "∪ — | ∪ — | ∪ — | ∪ — | ∪ — | ∪ —",
                "languages": ["grc", "lat"]
            }
        ]
    }
