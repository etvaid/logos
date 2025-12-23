from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

router = APIRouter(prefix="/chronos", tags=["chronos-engine"])

class Period(str, Enum):
    ARCHAIC = "archaic"  # 800-480 BCE
    CLASSICAL = "classical"  # 480-323 BCE
    HELLENISTIC = "hellenistic"  # 323-146 BCE
    ROMAN_REPUBLIC = "roman_republic"  # 509-27 BCE
    ROMAN_EMPIRE = "roman_empire"  # 27 BCE-476 CE
    LATE_ANTIQUITY = "late_antiquity"  # 150-600 CE

class ConceptEvolution(BaseModel):
    period: Period
    date_range: str
    definition: str
    key_authors: List[str]
    semantic_shift: float = Field(..., description="Semantic change intensity 0-1")
    usage_frequency: int = Field(..., description="Occurrences in corpus")
    related_terms: List[str]
    example_passages: List[Dict[str, str]]

class Concept(BaseModel):
    id: str
    term: str
    language: str
    modern_translation: str
    total_passages: int
    first_attestation: str
    last_attestation: str
    evolution_periods: int

class ConceptTimeline(BaseModel):
    concept: Concept
    evolution: List[ConceptEvolution]
    semantic_trajectory: List[Dict[str, float]]

class ConceptComparison(BaseModel):
    concepts: List[str]
    periods: Optional[List[Period]] = None
    
class ComparisonResult(BaseModel):
    concepts: List[str]
    periods: List[Period]
    semantic_distances: Dict[str, Dict[str, float]]
    convergence_points: List[Dict[str, Any]]
    divergence_points: List[Dict[str, Any]]

# Demo data
DEMO_CONCEPTS = {
    "arete": Concept(
        id="arete_001",
        term="ἀρετή",
        language="greek",
        modern_translation="virtue, excellence",
        total_passages=12847,
        first_attestation="Homer, Iliad 8.535 (8th c. BCE)",
        last_attestation="John Chrysostom, Homiliae (4th c. CE)",
        evolution_periods=6
    ),
    "logos": Concept(
        id="logos_001", 
        term="λόγος",
        language="greek",
        modern_translation="word, reason, account",
        total_passages=18293,
        first_attestation="Heraclitus, Fr. 1 (6th c. BCE)",
        last_attestation="Proclus, Elements (5th c. CE)",
        evolution_periods=5
    ),
    "virtus": Concept(
        id="virtus_001",
        term="virtus",
        language="latin", 
        modern_translation="courage, virtue",
        total_passages=9156,
        first_attestation="Ennius, Annales (3rd c. BCE)",
        last_attestation="Boethius, Consolation (6th c. CE)",
        evolution_periods=4
    )
}

DEMO_EVOLUTION = {
    "arete": [
        ConceptEvolution(
            period=Period.ARCHAIC,
            date_range="800-480 BCE",
            definition="Physical prowess and martial excellence",
            key_authors=["Homer", "Hesiod", "Tyrtaeus"],
            semantic_shift=0.0,
            usage_frequency=234,
            related_terms=["ἀνδρεία", "κλέος", "τιμή"],
            example_passages=[
                {"author": "Homer", "work": "Iliad 9.498", "text": "ἀρετὴν δ᾽ ἀνέρας εὖ μάχεσθαι"}
            ]
        ),
        ConceptEvolution(
            period=Period.CLASSICAL,
            date_range="480-323 BCE", 
            definition="Moral and intellectual virtue, excellence of character",
            key_authors=["Plato", "Aristotle", "Sophocles"],
            semantic_shift=0.7,
            usage_frequency=3421,
            related_terms=["σοφία", "δικαιοσύνη", "φρόνησις"],
            example_passages=[
                {"author": "Aristotle", "work": "EN 1106a15", "text": "ἡ ἀρετὴ ἕξις προαιρετική"}
            ]
        ),
        ConceptEvolution(
            period=Period.HELLENISTIC,
            date_range="323-146 BCE",
            definition="Stoic virtue as accordance with nature",
            key_authors=["Chrysippus", "Epictetus", "Marcus Aurelius"],
            semantic_shift=0.4,
            usage_frequency=2156,
            related_terms=["κατὰ φύσιν", "ἀπάθεια", "προκοπή"],
            example_passages=[
                {"author": "Epictetus", "work": "Disc. 1.4.18", "text": "μόνη ἀρετὴ ἀγαθόν"}
            ]
        )
    ],
    "logos": [
        ConceptEvolution(
            period=Period.ARCHAIC,
            date_range="600-480 BCE",
            definition="Divine principle governing cosmos",
            key_authors=["Heraclitus"],
            semantic_shift=0.0,
            usage_frequency=89,
            related_terms=["κόσμος", "πῦρ", "ἁρμονία"],
            example_passages=[
                {"author": "Heraclitus", "work": "Fr. 1", "text": "τοῦδε δὲ τοῦ λόγου ἐόντος ἀεί"}
            ]
        ),
        ConceptEvolution(
            period=Period.CLASSICAL,
            date_range="480-323 BCE",
            definition="Rational discourse, argument, definition",
            key_authors=["Plato", "Aristotle", "Isocrates"],
            semantic_shift=0.6,
            usage_frequency=5847,
            related_terms=["διάλεκτος", "ῥητορική", "ἐπιστήμη"],
            example_passages=[
                {"author": "Plato", "work": "Phaedrus 266d", "text": "λόγον τεχνῇ συντιθέναι"}
            ]
        )
    ],
    "virtus": [
        ConceptEvolution(
            period=Period.ROMAN_REPUBLIC,
            date_range="509-27 BCE",
            definition="Military courage and civic virtue",
            key_authors=["Cicero", "Caesar", "Sallust"],
            semantic_shift=0.0,
            usage_frequency=1843,
            related_terms=["fortitudo", "honor", "gloria"],
            example_passages=[
                {"author": "Cicero", "work": "De Officiis 1.61", "text": "virtus est animi habitus"}
            ]
        ),
        ConceptEvolution(
            period=Period.ROMAN_EMPIRE,
            date_range="27 BCE-476 CE", 
            definition="Moral excellence, Christian virtue",
            key_authors=["Seneca", "Tacitus", "Augustine"],
            semantic_shift=0.5,
            usage_frequency=2934,
            related_terms=["pietas", "clementia", "caritas"],
            example_passages=[
                {"author": "Seneca", "work": "Ep. 71.32", "text": "virtus sola liberum facit"}
            ]
        )
    ]
}

@router.get("/concepts", response_model=List[Concept])
async def list_concepts(
    language: Optional[str] = Query(None, description="Filter by language (greek/latin)"),
    min_passages: Optional[int] = Query(None, description="Minimum passage count"),
    period: Optional[Period] = Query(None, description="Filter by historical period")
):
    """List all trackable concepts in CHRONOS ENGINE corpus."""
    concepts = list(DEMO_CONCEPTS.values())
    
    if language:
        concepts = [c for c in concepts if c.language == language.lower()]
    
    if min_passages:
        concepts = [c for c in concepts if c.total_passages >= min_passages]
        
    return concepts

@router.get("/evolution/{concept_id}", response_model=ConceptTimeline)
async def get_concept_evolution(
    concept_id: str,
    periods: Optional[List[Period]] = Query(None, description="Filter by periods"),
    include_semantic_trajectory: bool = Query(True, description="Include semantic change data")
):
    """Track evolution of a concept across historical periods."""
    
    if concept_id not in DEMO_CONCEPTS:
        raise HTTPException(status_code=404, detail=f"Concept '{concept_id}' not found")
    
    concept = DEMO_CONCEPTS[concept_id]
    evolution = DEMO_EVOLUTION.get(concept_id, [])
    
    if periods:
        evolution = [e for e in evolution if e.period in periods]
    
    semantic_trajectory = []
    if include_semantic_trajectory:
        for i, period_data in enumerate(evolution):
            semantic_trajectory.append({
                "period": period_data.period,
                "cumulative_shift": sum(e.semantic_shift for e in evolution[:i+1]),
                "period_shift": period_data.semantic_shift,
                "usage_density": period_data.usage_frequency / 1000
            })
    
    return ConceptTimeline(
        concept=concept,
        evolution=evolution,
        semantic_trajectory=semantic_trajectory
    )

@router.post("/compare", response_model=ComparisonResult)
async def compare_concepts(comparison: ConceptComparison):
    """Compare evolution patterns of multiple concepts across time."""
    
    # Validate all concepts exist
    for concept_id in comparison.concepts:
        if concept_id not in DEMO_CONCEPTS:
            raise HTTPException(status_code=404, detail=f"Concept '{concept_id}' not found")
    
    if len(comparison.concepts) < 2:
        raise HTTPException(status_code=400, detail="At least 2 concepts required for comparison")
    
    periods = comparison.periods or list(Period)
    
    # Calculate semantic distances between concepts
    semantic_distances = {}
    for i, concept1 in enumerate(comparison.concepts):
        semantic_distances[concept1] = {}
        for concept2 in comparison.concepts[i+1:]:
            # Simplified distance calculation
            distance = abs(hash(concept1) % 100 - hash(concept2) % 100) / 100
            semantic_distances[concept1][concept2] = round(distance, 3)
    
    # Find convergence points (simplified)
    convergence_points = [
        {
            "period": Period.CLASSICAL,
            "concepts": ["arete", "logos"],
            "similarity_score": 0.78,
            "description": "Both concepts develop philosophical sophistication"
        }
    ]
    
    # Find divergence points  
    divergence_points = [
        {
            "period": Period.ROMAN_EMPIRE,
            "concepts": ["arete", "virtus"], 
            "divergence_score": 0.65,
            "description": "Greek ἀρετή becomes more abstract while Latin virtus remains practical"
        }
    ]
    
    return ComparisonResult(
        concepts=comparison.concepts,
        periods=periods,
        semantic_distances=semantic_distances,
        convergence_points=convergence_points,
        divergence_points=divergence_points
    )

@router.get("/stats")
async def get_chronos_stats():
    """Get CHRONOS ENGINE statistics and corpus information."""
    return {
        "total_concepts": len(DEMO_CONCEPTS),
        "total_passages": sum(c.total_passages for c in DEMO_CONCEPTS.values()),
        "temporal_coverage": "800 BCE - 600 CE (1400 years)",
        "semantic_embeddings": 892000,
        "tracked_evolutions": sum(len(DEMO_EVOLUTION.get(k, [])) for k in DEMO_CONCEPTS.keys()),
        "supported_languages": ["greek", "latin"],
        "periods_covered": len(Period)
    }