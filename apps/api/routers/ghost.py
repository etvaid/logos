from fastapi import APIRouter
from typing import Dict, Any
from pydantic import BaseModel

router = APIRouter()

LOST_WORKS = [
    {
        "id": "sappho_books",
        "title": "Sappho's Lost Books (2-9)",
        "author": "Sappho",
        "original_extent": "9 books of lyric poetry",
        "surviving": "~650 lines from quotations and papyri",
        "evidence": "Quotations in Athenaeus, Longinus, papyrus finds",
        "themes": ["Love", "Wedding songs", "Hymns to Aphrodite"]
    },
    {
        "id": "aristotle_poetics_2",
        "title": "Poetics Book II (On Comedy)",
        "author": "Aristotle",
        "original_extent": "Second book of Poetics",
        "surviving": "None (possibly echoed in Tractatus Coislinianus)",
        "evidence": "References in Poetics I, later summaries",
        "themes": ["Comedy", "Catharsis through laughter", "Comic characters"]
    },
    {
        "id": "livy_lost",
        "title": "Livy's Lost Books (11-20, 46-142)",
        "author": "Livy",
        "original_extent": "142 books total",
        "surviving": "35 books (1-10, 21-45)",
        "evidence": "Periochae (summaries), quotations",
        "themes": ["Roman Republic", "Punic Wars", "Civil Wars"]
    },
    {
        "id": "ennius_annales",
        "title": "Annales (most)",
        "author": "Ennius",
        "original_extent": "18 books of epic",
        "surviving": "~600 lines from quotations",
        "evidence": "Quotations in Cicero, grammarians",
        "themes": ["Roman history", "Epic narrative", "Latin meter development"]
    },
    {
        "id": "menander_plays",
        "title": "Menander's Comedies (most)",
        "author": "Menander",
        "original_extent": "~100 plays",
        "surviving": "1 complete (Dyskolos), substantial fragments of ~6 others",
        "evidence": "Papyrus finds, Roman adaptations",
        "themes": ["New Comedy", "Love plots", "Social situations"]
    },
]

class ReconstructRequest(BaseModel):
    work_id: str
    method: str = "contextual"

@router.get("/lost")
async def get_lost_works() -> Dict[str, Any]:
    return {"works": LOST_WORKS}

@router.get("/work/{work_id}")
async def get_work_details(work_id: str) -> Dict[str, Any]:
    work = next((w for w in LOST_WORKS if w['id'] == work_id), None)
    if work:
        return {"work": work}
    return {"error": "Work not found"}

@router.post("/reconstruct")
async def reconstruct_work(data: ReconstructRequest) -> Dict[str, Any]:
    """Generate hypothetical reconstruction"""
    work = next((w for w in LOST_WORKS if w['id'] == data.work_id), None)
    if not work:
        return {"error": "Work not found"}
    
    return {
        "work_id": data.work_id,
        "method": data.method,
        "reconstruction": f"[AI-generated hypothetical reconstruction of {work['title']}]\n\nBased on surviving fragments and ancient testimonies...",
        "confidence": 0.3,
        "warning": "This is a scholarly speculation, not a recovered text"
    }

@router.get("/")
async def root() -> Dict[str, Any]:
    return {"status": "ready", "description": "GHOST - Lost works reconstruction"}