from fastapi import APIRouter
from typing import Optional, List

router = APIRouter()

DISCOVERIES = [
    {"id": "1", "order": 3, "hypothesis": "Intertextual promiscuity signals political heterodoxy", "confidence": 94, "novelty": 94, "p_value": "<0.001"},
    {"id": "2", "order": 2, "hypothesis": "Cross-genre intertextuality is THE mechanism of innovation", "confidence": 91, "novelty": 91, "p_value": "<0.001"},
    {"id": "3", "order": 3, "hypothesis": "Greek engagement follows bottleneck pattern 50-150 CE", "confidence": 87, "novelty": 87, "p_value": "<0.01"},
    {"id": "4", "order": 4, "hypothesis": "Stoic vocabulary correlates with political opposition", "confidence": 82, "novelty": 89, "p_value": "<0.01"},
]

@router.get("/patterns")
async def get_patterns(order: Optional[int] = None):
    if order:
        return {"discoveries": [d for d in DISCOVERIES if d["order"] == order]}
    return {"discoveries": DISCOVERIES}

@router.post("/hypothesis")
async def generate_hypothesis():
    return {"hypothesis": "New pattern detected in corpus", "novelty": 0.85, "confidence": 0.78}
