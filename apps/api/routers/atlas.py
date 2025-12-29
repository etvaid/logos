from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter()

CITIES = [
    {"name": "Athens", "lat": 37.9838, "lon": 23.7275, "founded": -1400, "population_peak": 300000},
    {"name": "Rome", "lat": 41.9028, "lon": 12.4964, "founded": -753, "population_peak": 1000000},
    {"name": "Alexandria", "lat": 31.2001, "lon": 29.9187, "founded": -331, "population_peak": 500000},
    {"name": "Sparta", "lat": 37.0755, "lon": 22.4303, "founded": -900, "population_peak": 50000},
    {"name": "Corinth", "lat": 37.9389, "lon": 22.9322, "founded": -700, "population_peak": 90000},
    {"name": "Thebes", "lat": 38.3167, "lon": 23.3167, "founded": -1500, "population_peak": 40000},
    {"name": "Syracuse", "lat": 37.0755, "lon": 15.2866, "founded": -734, "population_peak": 250000},
    {"name": "Carthage", "lat": 36.8565, "lon": 10.3375, "founded": -814, "population_peak": 500000},
    {"name": "Constantinople", "lat": 41.0082, "lon": 28.9784, "founded": 330, "population_peak": 500000},
    {"name": "Antioch", "lat": 36.2028, "lon": 36.1606, "founded": -300, "population_peak": 250000},
]

JOURNEYS = [
    {"id": "odysseus", "name": "Odysseus' Voyage", "points": 15, "duration": "10 years"},
    {"id": "aeneas", "name": "Aeneas' Journey", "points": 12, "duration": "7 years"},
    {"id": "xenophon", "name": "March of the Ten Thousand", "points": 25, "duration": "2 years"},
    {"id": "paul", "name": "Paul's Missionary Journeys", "points": 30, "duration": "15 years"},
    {"id": "alexander", "name": "Alexander's Conquests", "points": 40, "duration": "13 years"},
]

EVENTS = [
    {"year": -776, "name": "First Olympic Games", "category": "culture"},
    {"year": -490, "name": "Battle of Marathon", "category": "military"},
    {"year": -480, "name": "Battle of Thermopylae", "category": "military"},
    {"year": -480, "name": "Battle of Salamis", "category": "military"},
    {"year": -431, "name": "Peloponnesian War begins", "category": "military"},
    {"year": -399, "name": "Death of Socrates", "category": "philosophy"},
    {"year": -336, "name": "Alexander becomes king", "category": "political"},
    {"year": -323, "name": "Death of Alexander", "category": "political"},
    {"year": -264, "name": "First Punic War", "category": "military"},
    {"year": -44, "name": "Assassination of Caesar", "category": "political"},
    {"year": -31, "name": "Battle of Actium", "category": "military"},
    {"year": 79, "name": "Eruption of Vesuvius", "category": "disaster"},
    {"year": 313, "name": "Edict of Milan", "category": "religion"},
    {"year": 476, "name": "Fall of Western Rome", "category": "political"},
]

AUTHOR_LIFESPANS = [
    {"name": "Homer", "birth": -850, "death": -750, "language": "greek"},
    {"name": "Sappho", "birth": -630, "death": -570, "language": "greek"},
    {"name": "Aeschylus", "birth": -525, "death": -456, "language": "greek"},
    {"name": "Sophocles", "birth": -496, "death": -406, "language": "greek"},
    {"name": "Euripides", "birth": -480, "death": -406, "language": "greek"},
    {"name": "Plato", "birth": -428, "death": -348, "language": "greek"},
    {"name": "Aristotle", "birth": -384, "death": -322, "language": "greek"},
    {"name": "Virgil", "birth": -70, "death": -19, "language": "latin"},
    {"name": "Horace", "birth": -65, "death": -8, "language": "latin"},
    {"name": "Ovid", "birth": -43, "death": 17, "language": "latin"},
    {"name": "Seneca", "birth": -4, "death": 65, "language": "latin"},
    {"name": "Tacitus", "birth": 56, "death": 120, "language": "latin"},
    {"name": "Augustine", "birth": 354, "death": 430, "language": "latin"},
]

@router.get("/cities")
async def get_cities() -> Dict[str, Any]:
    return {"cities": CITIES}

@router.get("/journeys")
async def get_journeys() -> Dict[str, Any]:
    return {"journeys": JOURNEYS}

@router.get("/timeline/events")
async def get_events() -> Dict[str, Any]:
    return {"events": EVENTS}

@router.get("/timeline/authors")
async def get_author_lifespans() -> Dict[str, Any]:
    return {"authors": AUTHOR_LIFESPANS}

@router.get("/")
async def root() -> Dict[str, Any]:
    return {"status": "ready", "description": "ATLAS - Historical maps and timeline"}