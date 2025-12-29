
from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

LOST_WORKS = [
    {
        "id": "sappho_2_9",
        "title": "Sappho Books 2-9",
        "author": "Sappho",
        "fragments": 89,
        "reconstructable": 0.35,
        "description": "Most of Sappho's nine books of poetry are lost"
    },
    {
        "id": "aristotle_poetics_2",
        "title": "Poetics II (On Comedy)",
        "author": "Aristotle",
        "fragments": 23,
        "reconstructable": 0.15,
        "description": "Lost second book on comedy, traces in Tractatus Coislinianus"
    },
    {
        "id": "livy_lost",
        "title": "Livy Books 11-20, 46-142",
        "author": "Livy",
        "fragments": 0,
        "reconstructable": 0.05,
        "description": "Periochae summaries survive"
    },
    {
        "id": "ennius_annales",
        "title": "Annales",
        "author": "Ennius",
        "fragments": 67,
        "reconstructable": 0.20,
        "description": "Epic history of Rome, major influence on Virgil"
    }
]

@router.get("/works")
async def list_lost_works() -> Dict[str, Any]:
    """List cataloged lost works"""
    return {"works": LOST_WORKS, "total": len(LOST_WORKS)}

@router.get("/work/{id}")
async def get_lost_work(id: str) -> Dict[str, Any]:
    """Get details about a lost work"""
    for w in LOST_WORKS:
        if w["id"] == id:
            return w
    return {"error": "Work not found"}

@router.get("/work/{id}/fragments")
async def get_fragments(id: str) -> Dict[str, Any]:
    """Get surviving fragments"""
    return {
        "work_id": id,
        "fragments": [],
        "status": "fragment_collection_pending"
    }

@router.post("/reconstruct")
async def reconstruct() -> Dict[str, Any]:
    """AI-powered reconstruction attempt"""
    return {
        "status": "pending",
        "message": "Reconstruction requires Claude API integration"
    }
