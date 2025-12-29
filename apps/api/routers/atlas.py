
from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

CITIES = [
    {"name": "Athens", "lat": 37.9838, "lon": 23.7275, "founded": -1400, "population_peak": 300000},
    {"name": "Rome", "lat": 41.9028, "lon": 12.4964, "founded": -753, "population_peak": 1000000},
    {"name": "Alexandria", "lat": 31.2001, "lon": 29.9187, "founded": -331, "population_peak": 500000},
    {"name": "Sparta", "lat": 37.0755, "lon": 22.4303, "founded": -900, "population_peak": 40000},
    {"name": "Carthage", "lat": 36.8565, "lon": 10.3375, "founded": -814, "population_peak": 500000}
]

JOURNEYS = [
    {"id": "odysseus", "name": "Odysseus' Journey", "points": 12},
    {"id": "aeneas", "name": "Aeneas' Journey", "points": 8},
    {"id": "xenophon", "name": "March of the Ten Thousand", "points": 15},
    {"id": "paul", "name": "Paul's Missionary Journeys", "points": 20}
]

@router.get("/map/political/{year}")
async def get_political_map(year: int) -> Dict[str, Any]:
    """Get political boundaries at a given year"""
    return {
        "year": year,
        "boundaries": [],
        "empires": [],
        "status": "geojson_pending"
    }

@router.get("/cities")
async def list_cities() -> Dict[str, Any]:
    """List major cities"""
    return {"cities": CITIES}

@router.get("/map/sites")
async def get_archaeological_sites() -> Dict[str, Any]:
    """Get archaeological sites"""
    return {"sites": [], "status": "pending"}

@router.get("/map/authors")
async def get_author_locations() -> Dict[str, Any]:
    """Get author birthplaces"""
    return {"authors": [], "status": "pending"}

@router.get("/map/journeys/{name}")
async def get_journey(name: str) -> Dict[str, Any]:
    """Get famous journey route"""
    for j in JOURNEYS:
        if j["id"] == name:
            return {**j, "route": [], "status": "route_pending"}
    return {"error": "Journey not found"}

@router.get("/journeys")
async def list_journeys() -> Dict[str, Any]:
    """List available journeys"""
    return {"journeys": JOURNEYS}

@router.get("/timeline/events")
async def get_timeline_events() -> Dict[str, Any]:
    """Get historical events"""
    return {
        "events": [
            {"year": -776, "name": "First Olympic Games", "category": "cultural"},
            {"year": -753, "name": "Traditional founding of Rome", "category": "political"},
            {"year": -490, "name": "Battle of Marathon", "category": "military"},
            {"year": -480, "name": "Battle of Salamis", "category": "military"},
            {"year": -431, "name": "Peloponnesian War begins", "category": "military"},
            {"year": -323, "name": "Death of Alexander", "category": "political"},
            {"year": -44, "name": "Assassination of Caesar", "category": "political"},
            {"year": 79, "name": "Eruption of Vesuvius", "category": "natural"}
        ]
    }

@router.get("/timeline/authors")
async def get_author_timeline() -> Dict[str, Any]:
    """Get author lifespans"""
    return {
        "authors": [
            {"name": "Homer", "birth": -800, "death": -700, "language": "greek"},
            {"name": "Sappho", "birth": -630, "death": -570, "language": "greek"},
            {"name": "Plato", "birth": -428, "death": -348, "language": "greek"},
            {"name": "Virgil", "birth": -70, "death": -19, "language": "latin"},
            {"name": "Ovid", "birth": -43, "death": 17, "language": "latin"}
        ]
    }
