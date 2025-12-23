from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

router = APIRouter(prefix="/reception", tags=["reception-radar"])

class CulturalPeriod(str, Enum):
    ANCIENT = "ancient"
    MEDIEVAL = "medieval"
    RENAISSANCE = "renaissance"
    ENLIGHTENMENT = "enlightenment"
    ROMANTIC = "romantic"
    MODERN = "modern"
    CONTEMPORARY = "contemporary"

class ReceptionRecord(BaseModel):
    period: CulturalPeriod
    culture: str
    adaptation_type: str
    work_title: str
    creator: str
    year: int
    influence_score: float
    description: str
    themes: List[str]

class CulturalInfluence(BaseModel):
    work_id: str
    culture_name: str
    time_period: CulturalPeriod
    adaptations: List[ReceptionRecord]
    influence_metrics: Dict[str, Any]
    cultural_impact: str

class MotifTrace(BaseModel):
    motif: str
    source_work: str
    historical_path: List[ReceptionRecord]
    evolution_summary: str

class TraceRequest(BaseModel):
    motif: str
    source_work: str
    target_cultures: Optional[List[str]] = None
    time_range: Optional[tuple[int, int]] = None

# Mock database
RECEPTION_DATABASE = {
    "homer_odyssey": [
        ReceptionRecord(
            period=CulturalPeriod.ANCIENT,
            culture="Roman",
            adaptation_type="epic_translation",
            work_title="Aeneid",
            creator="Virgil",
            year=-19,
            influence_score=9.5,
            description="Virgil's Aeneid draws heavily on Homeric structure and themes",
            themes=["heroic_journey", "divine_intervention", "fate_vs_free_will"]
        ),
        ReceptionRecord(
            period=CulturalPeriod.MEDIEVAL,
            culture="Byzantine",
            adaptation_type="manuscript_preservation",
            work_title="Venetus A Manuscript",
            creator="Byzantine Scholars",
            year=900,
            influence_score=8.0,
            description="Critical preservation and scholarly commentary",
            themes=["textual_transmission", "scholarly_commentary"]
        ),
        ReceptionRecord(
            period=CulturalPeriod.RENAISSANCE,
            culture="Italian",
            adaptation_type="vernacular_translation",
            work_title="Orlando Furioso",
            creator="Ludovico Ariosto",
            year=1516,
            influence_score=8.7,
            description="Renaissance epic romance inspired by Homeric tradition",
            themes=["chivalric_romance", "quest_narrative", "supernatural_elements"]
        ),
        ReceptionRecord(
            period=CulturalPeriod.ENLIGHTENMENT,
            culture="French",
            adaptation_type="dramatic_adaptation",
            work_title="Les Aventures de Télémaque",
            creator="François Fénelon",
            year=1699,
            influence_score=7.8,
            description="Educational novel focusing on Telemachus's journey",
            themes=["moral_education", "political_allegory", "coming_of_age"]
        ),
        ReceptionRecord(
            period=CulturalPeriod.ROMANTIC,
            culture="German",
            adaptation_type="philosophical_interpretation",
            work_title="Aesthetic Theory",
            creator="Johann Wolfgang von Goethe",
            year=1798,
            influence_score=8.2,
            description="Romantic interpretation of Homeric aesthetics",
            themes=["aesthetic_theory", "cultural_memory", "poetic_truth"]
        ),
        ReceptionRecord(
            period=CulturalPeriod.MODERN,
            culture="Irish",
            adaptation_type="modernist_novel",
            work_title="Ulysses",
            creator="James Joyce",
            year=1922,
            influence_score=9.8,
            description="Modernist masterpiece paralleling Odyssean structure",
            themes=["stream_of_consciousness", "urban_wandering", "heroic_everyday"]
        ),
        ReceptionRecord(
            period=CulturalPeriod.CONTEMPORARY,
            culture="American",
            adaptation_type="film_adaptation",
            work_title="O Brother, Where Art Thou?",
            creator="Coen Brothers",
            year=2000,
            influence_score=7.5,
            description="Depression-era American retelling of the Odyssey",
            themes=["american_mythology", "journey_home", "music_tradition"]
        )
    ]
}

CULTURAL_INFLUENCES = {
    "western_literature": {
        "work_id": "homer_odyssey",
        "culture_name": "Western Literature",
        "time_period": CulturalPeriod.CONTEMPORARY,
        "influence_metrics": {
            "direct_adaptations": 847,
            "thematic_influences": 2340,
            "academic_studies": 15670,
            "cultural_references": 8920,
            "translation_count": 234
        },
        "cultural_impact": "Foundational text shaping Western narrative structure and heroic archetypes"
    },
    "classical_education": {
        "work_id": "homer_odyssey",
        "culture_name": "Classical Education",
        "time_period": CulturalPeriod.CONTEMPORARY,
        "influence_metrics": {
            "curriculum_inclusion": 89.5,
            "student_exposure_rate": 67.2,
            "scholarly_publications": 3456,
            "pedagogical_adaptations": 567
        },
        "cultural_impact": "Central text in classical education and literary canon formation"
    }
}

@router.get("/work/{id}/reception", response_model=List[ReceptionRecord])
async def get_reception_history(
    id: str,
    period: Optional[CulturalPeriod] = None,
    culture: Optional[str] = None,
    min_influence: Optional[float] = Query(None, ge=0.0, le=10.0)
):
    """
    Get reception history for a specific work across cultures and time periods.
    
    Demo: /work/homer_odyssey/reception - Shows Homer's influence through history
    """
    if id not in RECEPTION_DATABASE:
        raise HTTPException(status_code=404, detail=f"Work '{id}' not found in reception database")
    
    records = RECEPTION_DATABASE[id].copy()
    
    # Apply filters
    if period:
        records = [r for r in records if r.period == period]
    
    if culture:
        records = [r for r in records if culture.lower() in r.culture.lower()]
    
    if min_influence is not None:
        records = [r for r in records if r.influence_score >= min_influence]
    
    # Sort by chronological order
    records.sort(key=lambda x: x.year)
    
    return records

@router.get("/culture/{name}", response_model=CulturalInfluence)
async def get_cultural_influence(
    name: str,
    metrics_only: bool = Query(False, description="Return only influence metrics")
):
    """
    Analyze classical work's influence on a specific culture or domain.
    
    Demo: /culture/western_literature - Shows Homer's impact on Western literary tradition
    """
    culture_key = name.lower().replace(" ", "_")
    
    if culture_key not in CULTURAL_INFLUENCES:
        raise HTTPException(status_code=404, detail=f"Cultural influence data for '{name}' not found")
    
    influence_data = CULTURAL_INFLUENCES[culture_key]
    
    # Get related reception records
    work_id = influence_data["work_id"]
    adaptations = RECEPTION_DATABASE.get(work_id, [])
    
    if not metrics_only:
        # Filter adaptations relevant to this culture
        relevant_adaptations = [
            record for record in adaptations
            if name.lower() in record.culture.lower() or 
               any(theme in record.themes for theme in ["cultural_memory", "aesthetic_theory"])
        ]
    else:
        relevant_adaptations = []
    
    return CulturalInfluence(
        work_id=influence_data["work_id"],
        culture_name=influence_data["culture_name"],
        time_period=influence_data["time_period"],
        adaptations=relevant_adaptations,
        influence_metrics=influence_data["influence_metrics"],
        cultural_impact=influence_data["cultural_impact"]
    )

@router.post("/trace", response_model=MotifTrace)
async def trace_motif_through_history(request: TraceRequest):
    """
    Trace a specific motif or theme through its historical adaptations and transformations.
    
    Demo: Trace "heroic_journey" motif from Homer through various cultures
    """
    if request.source_work not in RECEPTION_DATABASE:
        raise HTTPException(status_code=404, detail=f"Source work '{request.source_work}' not found")
    
    all_records = RECEPTION_DATABASE[request.source_work]
    
    # Filter records containing the motif
    relevant_records = [
        record for record in all_records
        if request.motif.lower() in [theme.lower() for theme in record.themes] or
           request.motif.lower() in record.description.lower()
    ]
    
    # Apply additional filters
    if request.target_cultures:
        relevant_records = [
            record for record in relevant_records
            if any(culture.lower() in record.culture.lower() for culture in request.target_cultures)
        ]
    
    if request.time_range:
        start_year, end_year = request.time_range
        relevant_records = [
            record for record in relevant_records
            if start_year <= record.year <= end_year
        ]
    
    if not relevant_records:
        raise HTTPException(
            status_code=404, 
            detail=f"No traces found for motif '{request.motif}' in specified parameters"
        )
    
    # Sort chronologically
    relevant_records.sort(key=lambda x: x.year)
    
    # Generate evolution summary
    cultures = list(set(record.culture for record in relevant_records))
    periods = list(set(record.period.value for record in relevant_records))
    
    evolution_summary = (
        f"The '{request.motif}' motif from {request.source_work} has evolved through "
        f"{len(relevant_records)} major adaptations across {len(cultures)} cultures "
        f"({', '.join(cultures)}) spanning {len(periods)} historical periods. "
        f"The motif shows continuous transformation from {relevant_records[0].year} "
        f"to {relevant_records[-1].year}, adapting to each era's cultural context."
    )
    
    return MotifTrace(
        motif=request.motif,
        source_work=request.source_work,
        historical_path=relevant_records,
        evolution_summary=evolution_summary
    )

# Additional utility endpoints for the demo

@router.get("/demo/homer-influence")
async def demo_homer_influence():
    """
    Demo endpoint showing Homer's comprehensive cultural influence
    """
    return {
        "overview": "Homer's Odyssey Influence Demonstration",
        "endpoints_to_try": [
            "GET /reception/work/homer_odyssey/reception - Complete reception history",
            "GET /reception/work/homer_odyssey/reception?period=modern - Modern adaptations only",
            "GET /reception/culture/western_literature - Impact on Western literature",
            "POST /reception/trace - Trace heroic_journey motif"
        ],
        "sample_trace_request": {
            "motif": "heroic_journey",
            "source_work": "homer_odyssey",
            "target_cultures": ["Irish", "American"],
            "time_range": [1900, 2000]
        },
        "key_insights": {
            "temporal_span": "From ancient Rome (-19 CE) to contemporary America (2000 CE)",
            "cultural_breadth": "Roman, Byzantine, Italian, French, German, Irish, American traditions",
            "adaptation_types": ["epic translation", "manuscript preservation", "modernist novel", "film adaptation"],
            "influence_score_range": "7.5 to 9.8 out of 10"
        }
    }