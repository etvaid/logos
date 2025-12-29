
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List

router = APIRouter()

class ScanRequest(BaseModel):
    text: str
    language: str = "greek"
    meter: str = "hexameter"

METERS = {
    "hexameter": "— ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ×",
    "pentameter": "— ∪ ∪ | — ∪ ∪ | — || — ∪ ∪ | — ∪ ∪ | —",
    "iambic_trimeter": "× — ∪ — | × — ∪ — | × — ∪ —",
    "sapphic": "— ∪ — × | — ∪ ∪ | — ∪ — —",
    "alcaic": "× — ∪ — — | — ∪ ∪ — ∪ —"
}

PRESETS = [
    {"id": "iliad_1_1", "text": "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", "meter": "hexameter"},
    {"id": "odyssey_1_1", "text": "ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ", "meter": "hexameter"},
    {"id": "aeneid_1_1", "text": "Arma virumque cano, Troiae qui primus ab oris", "meter": "hexameter"},
    {"id": "sappho_1", "text": "ποικιλόθρον᾽ ἀθανάτ᾽ Ἀφρόδιτα", "meter": "sapphic"}
]

@router.post("/scan")
async def scan_text(req: ScanRequest) -> Dict[str, Any]:
    """Scan text for meter"""
    # Simplified scanning (real version needs syllabification and quantity rules)
    return {
        "text": req.text,
        "meter": req.meter,
        "pattern": METERS.get(req.meter, "Unknown meter"),
        "scansion": "",
        "feet": [],
        "caesura": None,
        "status": "basic_analysis",
        "message": "Full metrical analysis pending"
    }

@router.get("/meters")
async def list_meters() -> Dict[str, Any]:
    """List supported meters"""
    return {
        "meters": [
            {"id": k, "pattern": v} for k, v in METERS.items()
        ]
    }

@router.get("/presets")
async def get_presets() -> Dict[str, Any]:
    """Get famous pre-scanned lines"""
    return {"presets": PRESETS}

@router.post("/syllabify")
async def syllabify(req: ScanRequest) -> Dict[str, Any]:
    """Break text into syllables"""
    return {
        "text": req.text,
        "syllables": [],
        "quantities": [],
        "status": "pending"
    }
