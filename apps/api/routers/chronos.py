
from fastapi import APIRouter, Request
from typing import Dict, Any

router = APIRouter()

PERIODS = {
    "greek": [
        {"name": "Archaic", "start": -800, "end": -500, "authors": ["Homer", "Hesiod", "Sappho"]},
        {"name": "Classical", "start": -500, "end": -323, "authors": ["Sophocles", "Plato", "Thucydides"]},
        {"name": "Hellenistic", "start": -323, "end": -31, "authors": ["Callimachus", "Apollonius", "Polybius"]},
        {"name": "Roman", "start": -31, "end": 300, "authors": ["Plutarch", "Lucian", "Plotinus"]},
        {"name": "Byzantine", "start": 300, "end": 600, "authors": ["Proclus", "Procopius"]}
    ],
    "latin": [
        {"name": "Archaic", "start": -240, "end": -100, "authors": ["Plautus", "Ennius", "Terence"]},
        {"name": "Classical", "start": -100, "end": 14, "authors": ["Cicero", "Virgil", "Horace"]},
        {"name": "Silver", "start": 14, "end": 130, "authors": ["Seneca", "Tacitus", "Juvenal"]},
        {"name": "Late", "start": 130, "end": 600, "authors": ["Apuleius", "Augustine", "Boethius"]}
    ]
}

@router.get("/{word}")
async def get_temporal_analysis(request: Request, word: str) -> Dict[str, Any]:
    """Get temporal evolution of word meaning"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            # Get usage by period (simplified - would need date metadata)
            total = await conn.fetchval(
                "SELECT COUNT(*) FROM source_texts WHERE content ILIKE $1",
                f"%{word}%"
            )
            
            return {
                "word": word,
                "total_occurrences": total or 0,
                "periods": [],  # Would need date metadata in corpus
                "drift_score": 0.0,
                "status": "temporal_analysis_pending",
                "message": "Full temporal analysis requires date metadata on texts"
            }
    except Exception as e:
        return {"word": word, "error": str(e)}

@router.get("/{word}/drift")
async def get_drift(request: Request, word: str) -> Dict[str, Any]:
    """Get semantic drift score for a word"""
    return {
        "word": word,
        "drift_score": 0.0,
        "interpretation": "0 = stable meaning, 1 = completely changed",
        "status": "pending_embedding_analysis"
    }

@router.get("/periods")
async def list_periods() -> Dict[str, Any]:
    """List all historical periods"""
    return {"periods": PERIODS}

@router.get("/periods/{period}")
async def get_period(period: str) -> Dict[str, Any]:
    """Get details about a specific period"""
    for lang, periods in PERIODS.items():
        for p in periods:
            if p["name"].lower() == period.lower():
                return {"language": lang, **p}
    return {"error": "Period not found"}
