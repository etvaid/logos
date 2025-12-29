from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel, Field, validator
from typing import Dict, Any, Optional, List, Union
import asyncpg
import logging
from datetime import datetime
import json
import re
import numpy as np
from enum import Enum

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Search configuration
MAX_SEARCH_RESULTS = 1000
DEFAULT_LIMIT = 50
SEMANTIC_SIMILARITY_THRESHOLD = 0.3

# Historical periods for filtering
PERIODS = {
    "greek": {
        "archaic": {"start": -800, "end": -500, "name": "Archaic Greek (800-500 BCE)"},
        "classical": {"start": -500, "end": -323, "name": "Classical Greek (500-323 BCE)"},
        "hellenistic": {"start": -323, "end": -31, "name": "Hellenistic Greek (323-31 BCE)"},
        "roman": {"start": -31, "end": 300, "name": "Roman Period Greek (31 BCE-300 CE)"},
        "byzantine": {"start": 300, "end": 600, "name": "Early Byzantine (300-600 CE)"}
    },
    "latin": {
        "archaic": {"start": -240, "end": -100, "name": "Archaic Latin (240-100 BCE)"},
        "classical": {"start": -100, "end": 14, "name": "Classical Latin (100 BCE-14 CE)"},
        "silver": {"start": 14, "end": 130, "name": "Silver Age (14-130 CE)"},
        "late": {"start": 130, "end": 600, "name": "Late Latin (130-600 CE)"}
    }
}

# Pydantic Models
class SearchType(str, Enum):
    full_text = "full_text"
    semantic = "semantic"
    phrase = "phrase"
    author = "author"
    advanced = "advanced"

class SortBy(str, Enum):
    relevance = "relevance"
    author = "author"
    work = "work"
    date = "date"
    similarity = "similarity"

class SearchFilters(BaseModel):
    authors: Optional[List[str]] = Field(None, description="Filter by specific authors")
    works: Optional[List[str]] = Field(None, description="Filter by specific works")
    languages: Optional[List[str]] = Field(None, description="Filter by languages (greek, latin, etc.)")
    periods: Optional[List[str]] = Field(None, description="Filter by historical periods")
    date_range: Optional[Dict[str, int]] = Field(None, description="Date range filter {start: -500, end: 100}")
    min_length: Optional[int] = Field(None, ge=1, description="Minimum text length")
    max_length: Optional[int] = Field(None, ge=1, description="Maximum text length")
    
class TextSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000, description="Search query text")
    search_type: SearchType = Field(SearchType.full_text, description="Type of search to perform")
    filters: Optional[SearchFilters] = Field(None, description="Search filters")
    limit: int = Field(DEFAULT_LIMIT, ge=1, le=MAX_SEARCH_RESULTS, description="Maximum results to return")
    offset: int = Field(0, ge=0, description="Results offset for pagination")
    sort_by: SortBy = Field(SortBy.relevance, description="Sort results by")
    include_snippets: bool = Field(True, description="Include text snippets in results")
    snippet_length: int = Field(200, ge=50, le=500, description="Length of text snippets")
    
    @validator('query')
    def validate_query(cls, v):
        if not v.strip():
            raise ValueError("Query cannot be empty")
        return v.strip()

class SemanticSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Semantic search query")
    similarity_threshold: float = Field(SEMANTIC_SIMILARITY_THRESHOLD, ge=0.0, le=1.0, description="Minimum similarity score")
    filters: Optional[SearchFilters] = Field(None, description="Search filters")
    limit: int = Field(DEFAULT_LIMIT, ge=1, le=100, description="Maximum results to return")
    include_context: bool = Field(True, description="Include surrounding context")
    
class PhraseSearchRequest(BaseModel):
    phrase: str = Field(..., min_length=2, max_length=200, description="Exact phrase to search")
    exact_match: bool = Field(True, description="Require exact word order")
    case_sensitive: bool = Field(False, description="Case sensitive search")
    filters: Optional[SearchFilters] = Field(None, description="Search filters")
    limit: int = Field(DEFAULT_LIMIT, ge=1, le=500, description="Maximum results to return")
    
class AdvancedSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000, description="Boolean query with AND, OR, NOT operators")
    filters: Optional[SearchFilters] = Field(None, description="Search filters")
    limit: int = Field(DEFAULT_LIMIT, ge=1, le=MAX_SEARCH_RESULTS, description="Maximum results to return")
    explain: bool = Field(False, description="Include query explanation")

class SearchResult(BaseModel):
    id: int
    urn: str
    author: str
    work: str
    section_reference: str
    content: str
    snippet: Optional[str] = None
    language: str
    relevance_score: float = Field(..., ge=0.0, le=1.0)
    similarity_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    word_count: Optional[int] = None
    date_composed: Optional[int] = None
    highlights: Optional[List[str]] = None

class SearchResponse(BaseModel):
    query: str
    search_type: str
    results: List[SearchResult]
    total_results: int
    returned_results: int
    pagination: Dict[str, Any]
    search_stats: Dict[str, Any]
    filters_applied: Optional[Dict[str, Any]] = None
    suggestions: Optional[List[str]] = None
    execution_time_ms: float
    timestamp: str

class AuthorSearchResult(BaseModel):
    author: str
    total_passages: int
    works: List[str]
    passages: List[SearchResult]
    author_stats: Dict[str, Any]

class AuthorSearchResponse(BaseModel):
    author_name: str
    query: str
    results: AuthorSearchResult
    pagination: Dict[str, Any]
    execution_time_ms: float
    timestamp: str

# Utility Functions
def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
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

def extract_snippet(content: str, query: str, snippet_length: int = 200) -> str:
    """Extract relevant snippet containing the search query"""
    if not content or not query:
        return content[:snippet_length] if content else ""
    
    # Find query words in content
    query_words = query.lower().split()
    content_lower = content.lower()
    
    # Find first occurrence of any query word
    best_pos = 0
    for word in query_words:
        pos = content_lower.find(word)
        if pos != -1:
            best_pos = pos
            break
    
    # Extract snippet centered around the found position
    start_pos = max(0, best_pos - snippet_length // 2)
    end_pos = min(len(content), start_pos + snippet_length)
    
    snippet = content[start_pos:end_pos]
    
    # Add ellipsis if needed
    if start_pos > 0:
        snippet = "..." + snippet
    if end_pos < len(content):
        snippet = snippet + "..."
    
    return snippet

def highlight_matches(text: str, query: str) -> List[str]:
    """Extract highlighted matches from text"""
    if not text or not query:
        return []
    
    highlights = []
    query_words = query.lower().split()
    text_lower = text.lower()
    
    for word in query_words:
        pattern = re.compile(re.escape(word), re.IGNORECASE)
        matches = pattern.finditer(text)
        for match in matches:
            start, end = match.span()
            context_start = max(0, start - 20)
            context_end = min(len(text), end + 20)
            highlight = text[context_start:context_end]
            highlights.append(highlight.strip())
    
    return highlights[:5]  # Limit to 5 highlights

def parse_boolean_query(query: str) -> Dict[str, Any]:
    """Parse boolean search query with AND, OR, NOT operators"""
    # Simplified boolean query parser
    # In production, would use a proper query parser
    
    query = query.strip()
    
    # Split by operators while preserving them
    tokens = re.split(r'\s+(AND|OR|NOT)\s+', query, flags=re.IGNORECASE)
    
    parsed = {
        "must": [],  # AND terms
        "should": [],  # OR terms  
        "must_not": []  # NOT terms
    }
    
    current_op = "AND"  # Default operator
    
    for token in tokens:
        token = token.strip()
        if not token:
            continue
            
        if token.upper() in ["AND", "OR", "NOT"]:
            current_op = token.upper()
        else:
            if current_op == "AND":
                parsed["must"].append(token)
            elif current_op == "OR":
                parsed["should"].append(token)
            elif current_op == "NOT":
                parsed["must_not"].append(token)
    
    # If no explicit AND terms, treat first term as must
    if not parsed["must"] and parsed["should"]:
        parsed["must"].append(parsed["should"].pop(0))
    
    return parsed

def build_filter_conditions(filters: Optional[SearchFilters]) -> tuple:
    """Build SQL WHERE conditions from search filters"""
    conditions = []
    params = []
    param_count = 0
    
    if not filters:
        return "", []
    
    if filters.authors:
        param_count += 1
        conditions.append(f"author = ANY(${param_count})")
        params.append(filters.authors)
    
    if filters.works:
        param_count += 1
        conditions.append(f"work = ANY(${param_count})")
        params.append(filters.works)
    
    if filters.languages:
        param_count += 1
        conditions.append(f"language = ANY(${param_count})")
        params.append(filters.languages)
    
    if filters.date_range:
        if "start" in filters.date_range:
            param_count += 1
            conditions.append(f"date_composed >= ${param_count}")
            params.append(filters.date_range["start"])
        if "end" in filters.date_range:
            param_count += 1
            conditions.append(f"date_composed <= ${param_count}")
            params.append(filters.date_range["end"])
    
    if filters.min_length:
        param_count += 1
        conditions.append(f"LENGTH(content) >= ${param_count}")
        params.append(filters.min_length)
    
    if filters.max_length:
        param_count += 1
        conditions.append(f"LENGTH(content) <= ${param_count}")
        params.append(filters.max_length)
    
    where_clause = " AND ".join(conditions) if conditions else ""
    return where_clause, params

async def get_query_embedding(query: str, db_connection) -> Optional[List[float]]:
    """Get embedding for search query using existing word embeddings"""
    try:
        # Simple approach: average embeddings of query words
        words = query.lower().split()
        if not words:
            return None
        
        embeddings = []
        
        for word in words:
            word_query = "SELECT embedding FROM word_embeddings WHERE LOWER(word) = $1 LIMIT 1"
            row = await db_connection.fetchrow(word_query, word)
            if row and row['embedding']:
                embeddings.append(row['embedding'])
        
        if not embeddings:
            return None
        
        # Average the embeddings
        avg_embedding = np.mean(embeddings, axis=0).tolist()
        return avg_embedding
        
    except Exception as e:
        logger.warning(f"Error getting query embedding