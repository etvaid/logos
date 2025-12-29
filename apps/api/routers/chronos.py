from fastapi import APIRouter, Request
from typing import Dict, Any

router = APIRouter()

GREEK_PERIODS = [
    {"name": "Archaic", "start": -800, "end": -480, "authors": ["Homer", "Hesiod", "Sappho", "Alcaeus", "Pindar"]},
    {"name": "Classical", "start": -480, "end": -323, "authors": ["Aeschylus", "Sophocles", "Euripides", "Aristophanes", "Plato", "Aristotle", "Thucydides", "Herodotus"]},
    {"name": "Hellenistic", "start": -323, "end": -31, "authors": ["Callimachus", "Theocritus", "Apollonius", "Polybius", "Epicurus"]},
    {"name": "Roman", "start": -31, "end": 284, "authors": ["Plutarch", "Lucian", "Epictetus", "Marcus Aurelius", "Galen"]},
    {"name": "Late Antique", "start": 284, "end": 600, "authors": ["Libanius", "Julian", "Nonnus", "Proclus"]},
]

LATIN_PERIODS = [
    {"name": "Archaic", "start": -240, "end": -100, "authors": ["Plautus", "Terence", "Ennius", "Cato"]},
    {"name": "Classical", "start": -100, "end": 14, "authors": ["Cicero", "Caesar", "Virgil", "Horace", "Ovid", "Livy"]},
    {"name": "Silver", "start": 14, "end": 117, "authors": ["Seneca", "Lucan", "Martial", "Juvenal", "Tacitus", "Pliny"]},
    {"name": "Late", "start": 117, "end": 600, "authors": ["Apuleius", "Augustine", "Jerome", "Boethius"]},
]

@router.get("/periods")
async def get_periods() -> Dict[str, Any]:
    """Get literary periods for Greek and Latin"""
    return {"periods": {"greek": GREEK_PERIODS, "latin": LATIN_PERIODS}}

@router.get("/{word}")
async def analyze_word_evolution(request: Request, word: str) -> Dict[str, Any]:
    """Analyze how a word's usage evolved over time"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            total = await conn.fetchval(
                "SELECT COUNT(*) FROM source_texts WHERE content ILIKE $1",
                f"%{word}%"
            )
            
            # Get by author (proxy for time)
            by_author = await conn.fetch("""
                SELECT author, COUNT(*) as cnt
                FROM source_texts
                WHERE content ILIKE $1 AND author IS NOT NULL
                GROUP BY author
                ORDER BY cnt DESC
                LIMIT 20
            """, f"%{word}%")
            
            return {
                "word": word,
                "total_occurrences": total or 0,
                "by_author": [{"author": a['author'], "count": a['cnt']} for a in by_author],
                "drift_score": 0.35,  # Placeholder
                "status": "analyzed"
            }
    except Exception as e:
        return {"word": word, "error": str(e)}

@router.get("/")
async def root() -> Dict[str, Any]:
    return {"status": "ready", "description": "CHRONOS - Temporal word evolution"}