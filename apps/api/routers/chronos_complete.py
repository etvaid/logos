from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List, Tuple
import asyncpg
import logging
import numpy as np
from datetime import datetime
import json
import math

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Historical periods configuration
PERIODS = {
    "greek": {
        "archaic": {"start": -800, "end": -500, "name": "Archaic Greek", "key_authors": ["Homer", "Hesiod", "Sappho"]},
        "classical": {"start": -500, "end": -323, "name": "Classical Greek", "key_authors": ["Sophocles", "Plato", "Aristotle"]},
        "hellenistic": {"start": -323, "end": -31, "name": "Hellenistic Greek", "key_authors": ["Polybius", "Diodorus", "Strabo"]},
        "roman": {"start": -31, "end": 300, "name": "Roman Period Greek", "key_authors": ["Plutarch", "Lucian", "Dio Chrysostom"]},
        "byzantine": {"start": 300, "end": 600, "name": "Early Byzantine", "key_authors": ["John Chrysostom", "Basil", "Gregory"]}
    },
    "latin": {
        "archaic": {"start": -240, "end": -100, "name": "Archaic Latin", "key_authors": ["Plautus", "Terence", "Ennius"]},
        "classical": {"start": -100, "end": 14, "name": "Classical Latin", "key_authors": ["Cicero", "Caesar", "Virgil"]},
        "silver": {"start": 14, "end": 130, "name": "Silver Age", "key_authors": ["Tacitus", "Juvenal", "Pliny"]},
        "late": {"start": 130, "end": 600, "name": "Late Latin", "key_authors": ["Augustine", "Jerome", "Ammianus"]}
    }
}

# Pydantic Models
class PeriodMeaning(BaseModel):
    period: str
    period_name: str
    date_range: str
    meaning: str
    usage_count: int
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    key_contexts: Optional[List[str]] = None
    representative_authors: Optional[List[str]] = None

class TemporalAnalysis(BaseModel):
    word: str
    language: str
    status: str
    periods: List[PeriodMeaning]
    drift_score: float = Field(..., ge=0.0, le=1.0)
    evolution_summary: str
    most_stable_period: Optional[str] = None
    most_changed_period: Optional[str] = None
    total_usage: int

class DriftAnalysis(BaseModel):
    word: str
    language: str
    drift_score: float = Field(..., ge=0.0, le=1.0)
    drift_category: str
    period_comparisons: List[Dict[str, Any]]
    strongest_drift: Optional[Dict[str, Any]] = None
    stability_periods: List[str]

class PeriodInfo(BaseModel):
    period_id: str
    name: str
    language: str
    start_year: int
    end_year: int
    duration_years: int
    key_authors: List[str]
    description: str

class PeriodsResponse(BaseModel):
    periods: List[PeriodInfo]
    total_periods: int
    languages: List[str]

class PeriodComparison(BaseModel):
    word: str
    language: str
    period1: str
    period2: str
    period1_meaning: str
    period2_meaning: str
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    semantic_shift: str
    usage_change: Dict[str, Any]
    contextual_examples: Optional[List[Dict[str, str]]] = None


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    try:
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0
        a = np.array(vec1, dtype=np.float32)
        b = np.array(vec2, dtype=np.float32)
        dot_product = np.dot(a, b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        similarity = dot_product / (norm_a * norm_b)
        return max(0.0, min(1.0, (similarity + 1) / 2))
    except Exception as e:
        logger.warning(f"Error calculating cosine similarity: {e}")
        return 0.0


def calculate_drift_score(period_embeddings: List[Tuple[str, List[float]]]) -> float:
    if len(period_embeddings) < 2:
        return 0.0
    similarities = []
    for i in range(len(period_embeddings) - 1):
        similarity = cosine_similarity(period_embeddings[i][1], period_embeddings[i + 1][1])
        similarities.append(similarity)
    avg_similarity = sum(similarities) / len(similarities)
    drift_score = 1.0 - avg_similarity
    return max(0.0, min(1.0, drift_score))


def get_drift_category(drift_score: float) -> str:
    if drift_score < 0.2:
        return "stable"
    elif drift_score < 0.5:
        return "moderate"
    else:
        return "high"


def get_semantic_shift_category(similarity: float) -> str:
    if similarity > 0.9:
        return "none"
    elif similarity > 0.7:
        return "slight"
    elif similarity > 0.5:
        return "moderate"
    elif similarity > 0.3:
        return "significant"
    else:
        return "complete"


def detect_language_from_periods(periods: List[str]) -> str:
    greek_periods = set(PERIODS["greek"].keys())
    latin_periods = set(PERIODS["latin"].keys())
    period_set = set(periods)
    if period_set.intersection(greek_periods):
        return "greek"
    elif period_set.intersection(latin_periods):
        return "latin"
    else:
        return "unknown"


@router.get("/{word}", response_model=TemporalAnalysis, summary="Full temporal analysis")
async def get_temporal_analysis(word: str, request: Request) -> TemporalAnalysis:
    """Get complete temporal analysis: meaning in each period and drift score"""
    try:
        if not hasattr(request.state, 'db_pool') or not request.state.db_pool:
            raise HTTPException(status_code=503, detail="Database pool not available")
        
        db_pool = request.state.db_pool
        normalized_word = word.lower().strip()
        
        async with db_pool.acquire() as connection:
            temporal_query = """
            SELECT period, embedding, usage_count
            FROM computed_temporal 
            WHERE LOWER(word) = $1
            ORDER BY period
            """
            
            temporal_rows = await connection.fetch(temporal_query, normalized_word)
            
            if not temporal_rows:
                return TemporalAnalysis(
                    word=word,
                    language="unknown",
                    status="not_found",
                    periods=[],
                    drift_score=0.0,
                    evolution_summary="Word not found in temporal database",
                    total_usage=0
                )
            
            periods_found = [row['period'] for row in temporal_rows]
            language = detect_language_from_periods(periods_found)
            
            period_meanings = []
            period_embeddings = []
            total_usage = 0
            
            for row in temporal_rows:
                period_id = row['period']
                usage_count = row['usage_count'] or 0
                total_usage += usage_count
                
                period_info = None
                if language in PERIODS and period_id in PERIODS[language]:
                    period_info = PERIODS[language][period_id]
                
                if period_info:
                    date_range = f"{period_info['start']} to {period_info['end']} CE"
                    period_name = period_info['name']
                    key_authors = period_info['key_authors']
                else:
                    date_range = "Unknown"
                    period_name = period_id.title()
                    key_authors = []
                
                meaning = f"Usage in {period_name}: documented in {usage_count} instances"
                confidence = min(1.0, usage_count / 100.0) if usage_count > 0 else 0.1
                
                period_meaning = PeriodMeaning(
                    period=period_id,
                    period_name=period_name,
                    date_range=date_range,
                    meaning=meaning,
                    usage_count=usage_count,
                    confidence_score=confidence,
                    representative_authors=key_authors[:3]
                )
                
                period_meanings.append(period_meaning)
                period_embeddings.append((period_id, row['embedding']))
            
            drift_score = calculate_drift_score(period_embeddings)
            drift_category = get_drift_category(drift_score)
            
            evolution_summary = f"The word '{word}' shows {drift_category} semantic drift across {len(period_meanings)} periods."
            
            return TemporalAnalysis(
                word=word,
                language=language,
                status="found",
                periods=period_meanings,
                drift_score=drift_score,
                evolution_summary=evolution_summary,
                total_usage=total_usage
            )
            
    except asyncpg.PostgresError as e:
        logger.error(f"Database error in get_temporal_analysis: {e}")
        raise HTTPException(status_code=503, detail="Database query failed")
    except Exception as e:
        logger.error(f"Unexpected error in get_temporal_analysis: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{word}/drift", response_model=DriftAnalysis, summary="Semantic drift score")
async def get_semantic_drift(word: str, request: Request) -> DriftAnalysis:
    """Get semantic drift score (0-1) showing how much word meaning changed over time"""
    try:
        if not hasattr(request.state, 'db_pool') or not request.state.db_pool:
            raise HTTPException(status_code=503, detail="Database pool not available")
        
        db_pool = request.state.db_pool
        normalized_word = word.lower().strip()
        
        async with db_pool.acquire() as connection:
            temporal_query = """
            SELECT period, embedding, usage_count
            FROM computed_temporal 
            WHERE LOWER(word) = $1
            ORDER BY period
            """
            
            temporal_rows = await connection.fetch(temporal_query, normalized_word)
            
            if not temporal_rows:
                return DriftAnalysis(
                    word=word,
                    language="unknown",
                    drift_score=0.0,
                    drift_category="unknown",
                    period_comparisons=[],
                    stability_periods=[]
                )
            
            periods_found = [row['period'] for row in temporal_rows]
            language = detect_language_from_periods(periods_found)
            
            period_embeddings = [(row['period'], row['embedding']) for row in temporal_rows]
            drift_score = calculate_drift_score(period_embeddings)
            drift_category = get_drift_category(drift_score)
            
            # Calculate period-to-period comparisons
            comparisons = []
            stable_periods = []
            
            for i in range(len(period_embeddings) - 1):
                period1, emb1 = period_embeddings[i]
                period2, emb2 = period_embeddings[i + 1]
                similarity = cosine_similarity(emb1, emb2)
                
                comparison = {
                    "from_period": period1,
                    "to_period": period2,
                    "similarity": similarity,
                    "drift": 1.0 - similarity,
                    "shift_category": get_semantic_shift_category(similarity)
                }
                comparisons.append(comparison)
                
                if similarity > 0.8:
                    stable_periods.extend([period1, period2])
            
            # Find strongest drift
            strongest_drift = None
            if comparisons:
                strongest_drift = min(comparisons, key=lambda x: x['similarity'])
            
            return DriftAnalysis(
                word=word,
                language=language,
                drift_score=drift_score,
                drift_category=drift_category,
                period_comparisons=comparisons,
                strongest_drift=strongest_drift,
                stability_periods=list(set(stable_periods))
            )
            
    except asyncpg.PostgresError as e:
        logger.error(f"Database error in get_semantic_drift: {e}")
        raise HTTPException(status_code=503, detail="Database query failed")
    except Exception as e:
        logger.error(f"Unexpected error in get_semantic_drift: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{word}/period/{period}", response_model=PeriodMeaning, summary="Word meaning in specific period")
async def get_period_meaning(word: str, period: str, request: Request) -> PeriodMeaning:
    """Get word meaning and usage in a specific historical period