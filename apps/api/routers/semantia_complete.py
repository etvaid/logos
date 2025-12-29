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

# Pydantic Models
class SemanticNeighbor(BaseModel):
    word: str
    similarity: float = Field(..., ge=0.0, le=1.0)
    language: str
    definition: Optional[str] = None

class WordAnalysis(BaseModel):
    word: str
    language: str
    status: str
    definition: Optional[str] = None
    usage_stats: Optional[Dict[str, Any]] = None
    semantic_field: Optional[str] = None
    neighbors: Optional[List[SemanticNeighbor]] = None

class NeighborsResponse(BaseModel):
    word: str
    language: str
    status: str
    neighbors: List[SemanticNeighbor]
    total_neighbors: int

class ComparisonResponse(BaseModel):
    word1: str
    word2: str
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    status: str
    shared_contexts: Optional[List[str]] = None
    analysis: Optional[Dict[str, Any]] = None

class EvolutionPeriod(BaseModel):
    period: str
    definition: str
    usage_frequency: int
    semantic_shift: Optional[float] = None

class EvolutionResponse(BaseModel):
    word: str
    language: str
    status: str
    periods: List[EvolutionPeriod]
    overall_trend: Optional[str] = None

class AuthorUsage(BaseModel):
    author: str
    usage_count: int
    frequency: float
    works: List[str]

class AuthorUsageResponse(BaseModel):
    word: str
    status: str
    top_authors: List[AuthorUsage]
    total_authors: int

class SemanticSearch(BaseModel):
    word: str
    relevance_score: float = Field(..., ge=0.0, le=1.0)
    definition: str
    language: str
    context_examples: Optional[List[str]] = None

class SemanticSearchResponse(BaseModel):
    query: str
    results: List[SemanticSearch]
    total_results: int
    search_type: str

class SemanticCluster(BaseModel):
    cluster_id: int
    name: str
    description: str
    words: List[str]
    centroid_words: List[str]
    coherence_score: float = Field(..., ge=0.0, le=1.0)

class ClustersResponse(BaseModel):
    clusters: List[SemanticCluster]
    total_clusters: int
    clustering_method: str

class SemanticBridge(BaseModel):
    greek_word: str
    latin_word: str
    bridge_strength: float = Field(..., ge=0.0, le=1.0)
    shared_concepts: List[str]
    translation_confidence: float = Field(..., ge=0.0, le=1.0)

class BridgesResponse(BaseModel):
    bridges: List[SemanticBridge]
    total_bridges: int
    bridge_types: List[str]


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors using dot(a,b) / (norm(a) * norm(b))"""
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


def get_not_found_response(word: str, response_type: str = "analysis", word2: str = "") -> Dict[str, Any]:
    base = {"word": word, "status": "not_found"}
    
    if response_type == "neighbors":
        base.update({"language": "unknown", "neighbors": [], "total_neighbors": 0})
    elif response_type == "comparison":
        base.update({"word2": word2, "similarity_score": 0.0})
    elif response_type == "evolution":
        base.update({"language": "unknown", "periods": []})
    elif response_type == "authors":
        base.update({"top_authors": [], "total_authors": 0})
    else:
        base.update({"language": "unknown", "definition": None, "usage_stats": None, "semantic_field": None})
    
    return base


@router.get("/{word}", response_model=WordAnalysis, summary="Full word semantic analysis")
async def get_word_analysis(word: str, request: Request) -> WordAnalysis:
    """Get complete semantic analysis: definition from corpus (NOT dictionary), usage stats, semantic field"""
    try:
        if not hasattr(request.state, 'db_pool') or not request.state.db_pool:
            raise HTTPException(status_code=503, detail="Database pool not available")
        
        db_pool = request.state.db_pool
        normalized_word = word.lower().strip()
        
        async with db_pool.acquire() as connection:
            embedding_query = "SELECT word, language FROM word_embeddings WHERE LOWER(word) = $1 LIMIT 1"
            embedding_row = await connection.fetchrow(embedding_query, normalized_word)
            
            if not embedding_row:
                return WordAnalysis(**get_not_found_response(word))
            
            semantia_query = "SELECT definition, neighbors, clusters FROM computed_semantia WHERE LOWER(word) = $1 LIMIT 1"
            semantia_row = await connection.fetchrow(semantia_query, normalized_word)
            
            usage_query = """
            SELECT COUNT(*) as total_occurrences,
                   COUNT(DISTINCT author) as unique_authors,
                   COUNT(DISTINCT work) as unique_works
            FROM source_texts 
            WHERE LOWER(content) LIKE $1
            """
            usage_row = await connection.fetchrow(usage_query, f"%{normalized_word}%")
            
            usage_stats = {
                "total_occurrences": usage_row['total_occurrences'] if usage_row else 0,
                "unique_authors": usage_row['unique_authors'] if usage_row else 0,
                "unique_works": usage_row['unique_works'] if usage_row else 0
            }
            
            neighbors = []
            semantic_field = None
            
            if semantia_row and semantia_row['neighbors']:
                try:
                    neighbor_data = json.loads(semantia_row['neighbors']) if isinstance(semantia_row['neighbors'], str) else semantia_row['neighbors']
                    if isinstance(neighbor_data, list):
                        for neighbor in neighbor_data[:5]:
                            if isinstance(neighbor, dict):
                                neighbors.append(SemanticNeighbor(
                                    word=neighbor.get('word', ''),
                                    similarity=neighbor.get('similarity', 0.0),
                                    language=neighbor.get('language', embedding_row['language'])
                                ))
                        
                        if semantia_row['clusters']:
                            cluster_data = json.loads(semantia_row['clusters']) if isinstance(semantia_row['clusters'], str) else semantia_row['clusters']
                            if isinstance(cluster_data, dict) and 'primary_cluster' in cluster_data:
                                semantic_field = cluster_data['primary_cluster']
                except Exception as e:
                    logger.warning(f"Error parsing data for {word}: {e}")
            
            return WordAnalysis(
                word=word,
                language=embedding_row['language'],
                status="found",
                definition=semantia_row['definition'] if semantia_row else None,
                usage_stats=usage_stats,
                semantic_field=semantic_field,
                neighbors=neighbors
            )
            
    except asyncpg.PostgresError as e:
        logger.error(f"Database error in get_word_analysis: {e}")
        raise HTTPException(status_code=503, detail="Database query failed")
    except Exception as e:
        logger.error(f"Unexpected error in get_word_analysis: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{word}/neighbors", response_model=NeighborsResponse, summary="Top 20 similar words using cosine similarity")
async def get_word_neighbors(word: str, request: Request, limit: int = Query(20, ge=1, le=50)) -> NeighborsResponse:
    """Get top 20 similar words using cosine similarity on embeddings: dot(a,b) / (norm(a) * norm(b))"""
    try:
        if not hasattr(request.state, 'db_pool') or not request.state.db_pool:
            raise HTTPException(status_code=503, detail="Database pool not available")
        
        db_pool = request.state.db_pool
        normalized_word = word.lower().strip()
        
        async with db_pool.acquire() as connection:
            target_query = "SELECT word, embedding, language FROM word_embeddings WHERE LOWER(word) = $1 LIMIT 1"
            target_row = await connection.fetchrow(target_query, normalized_word)
            
            if not target_row:
                return NeighborsResponse(**get_not_found_response(word, "neighbors"))
            
            target_embedding = target_row['embedding']
            target_language = target_row['language']
            
            candidates_query = """
            SELECT word, embedding, language 
            FROM word_embeddings 
            WHERE LOWER(word) != $1 AND language = $2
            LIMIT 1000
            """
            candidate_rows = await connection.fetch(candidates_query, normalized_word, target_language)
            
            similarities = []
            for candidate_row in candidate_rows:
                similarity = cosine_similarity(target_embedding, candidate_row['embedding'])
                if similarity > 0.1:
                    similarities.append({
                        'word': candidate_row['word'],
                        'similarity': similarity,
                        'language': candidate_row['language']
                    })
            
            similarities.sort(key=lambda x: x['similarity'], reverse=True)
            top_similarities = similarities[:limit]
            
            neighbors = []
            for sim in top_similarities:
                def_query = "SELECT definition FROM computed_semantia WHERE LOWER(word) = $1 LIMIT 1"
                def_row = await connection.fetchrow(def_query, sim['word'].lower())
                
                neighbor = SemanticNeighbor(
                    word=sim['word'],
                    similarity=sim['similarity'],
                    language=sim['language'],
                    definition=def_row['definition'] if def_row else None
                )
                neighbors.append(neighbor)
            
            return NeighborsResponse(
                word=word,
                language=target_language,
                status="found",
                neighbors=neighbors,
                total_neighbors=len(neighbors)
            )
            
    except asyncpg.PostgresError as e:
        logger.error(f"Database error in get_word_neighbors: {e}")
        raise HTTPException(status_code=503, detail="Database query failed")
    except Exception as e:
        logger.error(f"Unexpected error in get_word_neighbors: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{word}/compare/{other}", response_model=ComparisonResponse, summary="Compare two words")
async def compare_words(word: str, other: str, request: Request) -> ComparisonResponse:
    """Compare two words: similarity score, shared contexts"""
    try:
        if not hasattr(request.state, 'db_pool') or not request.state.db_pool:
            raise HTTPException(status_code=503, detail="Database pool not available")
        
        db_pool = request.state.db_pool
        normalized_word1 = word.lower().strip()
        normalized_word2 = other.lower().strip()
        
        async with db_pool.acquire() as connection:
            embedding_query = "SELECT word, embedding, language FROM word_embeddings WHERE LOWER(word) IN ($1, $2)"
            embedding_rows = await connection.fetch(embedding_query, normalized_word1, normalized_word2)
            
            if len(embedding_rows) < 2:
                return ComparisonResponse(**get_not_found_response(word, "comparison", other))
            
            word1_embedding = None
            word2_embedding = None
            
            for row in embedding_rows:
                if row['word'].lower() == normalized_word1:
                    word1_embedding = row['embedding']
                elif row['word'].lower() == normalized_word2:
                    word2_embedding = row['embedding']
            
            if word1_embedding is None or word2_embedding is None:
                return ComparisonResponse(**get_not_found_response(word, "comparison", other))
            
            similarity_score = cosine_similarity(word1_embedding, word2_embedding)
            
            # Get shared contexts
            context_query = """
            SELECT DISTINCT st1.content, st1.author, st1.work
            FROM source_texts st1, source_texts st2
            WHERE LOWER(st1.content) LIKE $1 
              AND LOWER(st2.content) LIKE $2
              AND st1.work = st2.work
            LIMIT 5
            """
            context_rows = await connection.fetch(context_query, f"%{normalized_word1}%", f"%{normalized_wor