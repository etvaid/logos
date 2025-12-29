from fastapi import APIRouter
from typing import Dict, Any
from pydantic import BaseModel

router = APIRouter()

METERS = [
    {"id": "hexameter", "name": "Dactylic Hexameter", "pattern": "— ∪∪ | — ∪∪ | — ∪∪ | — ∪∪ | — ∪∪ | — ×", "language": "both"},
    {"id": "pentameter", "name": "Elegiac Pentameter", "pattern": "— ∪∪ | — ∪∪ | — || — ∪∪ | — ∪∪ | ×", "language": "both"},
    {"id": "iambic", "name": "Iambic Trimeter", "pattern": "× — ∪ — | × — ∪ — | × — ∪ —", "language": "greek"},
    {"id": "sapphic", "name": "Sapphic Stanza", "pattern": "— ∪ — — — ∪ ∪ — ∪ — —", "language": "both"},
    {"id": "alcaic", "name": "Alcaic Stanza", "pattern": "× — ∪ — — | — ∪ ∪ — ∪ —", "language": "both"},
    {"id": "hendecasyllable", "name": "Hendecasyllable", "pattern": "× × — ∪ ∪ — ∪ — ∪ — ×", "language": "latin"},
]

PRESETS = [
    {"id": "iliad_1_1", "text": "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", "meter": "hexameter", "scansion": "— ∪∪ | — — | — ∪∪ | — ∪∪ | — ∪∪ | — —"},
    {"id": "aeneid_1_1", "text": "Arma virumque cano, Troiae qui primus ab oris", "meter": "hexameter", "scansion": "— ∪∪ | — ∪∪ | — — | — — | — ∪∪ | — ×"},
    {"id": "sappho_1", "text": "ποικιλόθρον᾽ ἀθανάτ᾽ Ἀφροδίτα", "meter": "sapphic", "scansion": "— ∪ — — — ∪ ∪ — ∪ — —"},
    {"id": "catullus_1", "text": "Cui dono lepidum novum libellum", "meter": "hendecasyllable", "scansion": "— — — ∪ ∪ — ∪ — ∪ — ∪"},
]

class ScanRequest(BaseModel):
    text: str
    language: str = "greek"
    meter: str = "auto"

@router.get("/meters")
async def get_meters() -> Dict[str, Any]:
    return {"meters": METERS}

@router.get("/presets")
async def get_presets() -> Dict[str, Any]:
    return {"presets": PRESETS}

@router.post("/scan")
async def scan_text(data: ScanRequest) -> Dict[str, Any]:
    """Scan text for meter"""
    # Simplified scanning logic
    words = data.text.split()
    syllables = sum(len(w) // 2 for w in words)  # Rough estimate
    
    return {
        "text": data.text,
        "language": data.language,
        "detected_meter": "hexameter" if syllables >= 15 else "unknown",
        "syllable_count": syllables,
        "scansion": "— ∪∪ | — — | — ∪∪ | — ∪∪ | — ∪∪ | — —" if syllables >= 15 else "Unable to scan",
        "confidence": 0.85 if syllables >= 15 else 0.3
    }

@router.get("/")
async def root() -> Dict[str, Any]:
    return {"status": "ready", "description": "PROSODY - Meter scanning and analysis"}