from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
import asyncpg
import logging
from datetime import datetime
import re

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Pydantic Models
class AuthorWork(BaseModel):
    """Model for author work information"""
    author: str
    work: str
    urn: str
    text_count: int
    language: str

class WorksResponse(BaseModel):
    """Response model for works listing"""
    authors: Dict[str, List[AuthorWork]]
    total_authors: int
    total_works: int
    total_texts: int

class WorkMetadata(BaseModel):
    """Model for work metadata"""
    urn: str
    author: str
    work: str
    language: str
    total_sections: int
    description: Optional[str] = None
    date_composed: Optional[str] = None
    genre: Optional[str] = None

class TextSegment(BaseModel):
    """Model for text segment"""
    id: int
    urn: str
    content: str
    section_reference: str
    position: int

class TextResponse(BaseModel):
    """Response model for text with pagination"""
    urn: str
    author: str
    work: str
    language: str
    segments: List[TextSegment]
    pagination: Dict[str, Any]

class MorphologyData(BaseModel):
    """Model for word morphology"""
    word: str
    lemma: Optional[str] = None
    pos: Optional[str] = None  # part of speech
    case: Optional[str] = None
    number: Optional[str] = None
    gender: Optional[str] = None
    tense: Optional[str] = None
    mood: Optional[str] = None
    voice: Optional[str] = None
    person: Optional[str] = None
    definition: Optional[str] = None

class WordOccurrence(BaseModel):
    """Model for word occurrence with context"""
    id: int
    urn: str
    author: str
    work: str
    section_reference: str
    word: str
    context_before: str
    context_after: str
    position_in_text: int

class WordOccurrencesResponse(BaseModel):
    """Response model for word occurrences"""
    word: str
    total_occurrences: int
    occurrences: List[WordOccurrence]
    pagination: Dict[str, Any]

class WordForm(BaseModel):
    """Model for word form"""
    form: str
    count: int
    morphology: Optional[Dict[str, str]] = None

class WordFormsResponse(BaseModel):
    """Response model for word forms"""
    word: str
    lemma: Optional[str] = None
    total_forms: int
    forms: List[WordForm]


def extract_context(text: str, word: str, context_length: int = 50) -> tuple:
    """Extract context before and after a word in text"""
    if not text or not word:
        return "", ""
    
    # Find word position (case insensitive)
    word_pattern = re.compile(re.escape(word), re.IGNORECASE)
    match = word_pattern.search(text)
    
    if not match:
        return "", ""
    
    start_pos = match.start()
    end_pos = match.end()
    
    # Extract context
    context_start = max(0, start_pos - context_length)
    context_end = min(len(text), end_pos + context_length)
    
    context_before = text[context_start:start_pos].strip()
    context_after = text[end_pos:context_end].strip()
    
    return context_before, context_after


@router.get("/works", response_model=WorksResponse, summary="List all works grouped by author")
async def get_works(request: Request) -> WorksResponse:
    """
    Get all works grouped by author with text counts.
    
    Returns:
        WorksResponse: Dictionary of authors with their works and counts
    
    Raises:
        HTTPException: If database query fails
    """
    try:
        if not hasattr(request.state, 'db_pool') or not request.state.db_pool:
            raise HTTPException(status_code=503, detail="Database pool not available")
        
        db_pool = request.state.db_pool
        
        async with db_pool.acquire() as connection:
            query = """
            SELECT 
                author,
                work,
                urn,
                language,
                COUNT(*) as text_count
            FROM source_texts 
            WHERE author IS NOT NULL AND work IS NOT NULL
            GROUP BY author, work, urn, language
            ORDER BY author, work
            """
            
            rows = await connection.fetch(query)
            
            authors = {}
            total_works = 0
            total_texts = 0
            
            for row in rows:
                author = row['author']
                if author not in authors:
                    authors[author] = []
                
                work_data = AuthorWork(
                    author=author,
                    work=row['work'],
                    urn=row['urn'],
                    text_count=row['text_count'],
                    language=row['language'] or 'unknown'
                )
                
                authors[author].append(work_data)
                total_works += 1
                total_texts += row['text_count']
            
            logger.info(f"Retrieved {len(authors)} authors with {total_works} works")
            
            return WorksResponse(
                authors=authors,
                total_authors=len(authors),
                total_works=total_works,
                total_texts=total_texts
            )
            
    except asyncpg.PostgresError as e:
        logger.error(f"Database error in get_works: {e}")
        raise HTTPException(status_code=503, detail="Database query failed")
    except Exception as e:
        logger.error(f"Unexpected error in get_works: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/work/{urn}", response_model=WorkMetadata, summary="Get work metadata")
async def get_work_metadata(urn: str, request: Request) -> WorkMetadata:
    """
    Get metadata for a specific work by URN.
    
    Args:
        urn: The URN identifier for the work
        
    Returns:
        WorkMetadata: Metadata for the specified work
    
    Raises:
        HTTPException: If work not found or database query fails
    """
    try:
        if not hasattr(request.state, 'db_pool') or not request.state.db_pool:
            raise HTTPException(status_code=503, detail="Database pool not available")
        
        db_pool = request.state.db_pool
        
        async with db_pool.acquire() as connection:
            query = """
            SELECT 
                urn,
                author,
                work,
                language,
                COUNT(*) as total_sections
            FROM source_texts 
            WHERE urn = $1
            GROUP BY urn, author, work, language
            """
            
            row = await connection.fetchrow(query, urn)
            
            if not row:
                raise HTTPException(status_code=404, detail=f"Work with URN '{urn}' not found")
            
            logger.info(f"Retrieved metadata for work: {urn}")
            
            return WorkMetadata(
                urn=row['urn'],
                author=row['author'],
                work=row['work'],
                language=row['language'] or 'unknown',
                total_sections=row['total_sections']
            )
            
    except asyncpg.PostgresError as e:
        logger.error(f"Database error in get_work_metadata: {e}")
        raise HTTPException(status_code=503, detail="Database query failed")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_work_metadata: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/work/{urn}/text", response_model=TextResponse, summary="Get work text with pagination")
async def get_work_text(
    urn: str, 
    request: Request,
    start: int = Query(0, ge=0, description="Starting position for pagination"),
    limit: int = Query(50, ge=1, le=500, description="Number of text segments to return")
) -> TextResponse:
    """
    Get text content for a specific work with pagination.
    
    Args:
        urn: The URN identifier for the work
        start: Starting position for pagination (default: 0)
        limit: Number of segments to return (default: 50, max: 500)
        
    Returns:
        TextResponse: Text content with pagination info
    
    Raises:
        HTTPException: If work not found or database query fails
    """
    try:
        if not hasattr(request.state, 'db_pool') or not request.state.db_pool:
            raise HTTPException(status_code=503, detail="Database pool not available")
        
        db_pool = request.state.db_pool
        
        async with db_pool.acquire() as connection:
            metadata_query = """
            SELECT DISTINCT author, work, language 
            FROM source_texts 
            WHERE urn = $1
            LIMIT 1
            """
            
            metadata_row = await connection.fetchrow(metadata_query, urn)
            
            if not metadata_row:
                raise HTTPException(status_code=404, detail=f"Work with URN '{urn}' not found")
            
            count_query = "SELECT COUNT(*) FROM source_texts WHERE urn = $1"
            total_count = await connection.fetchval(count_query, urn)
            
            text_query = """
            SELECT 
                id,
                urn,
                content,
                section_reference
            FROM source_texts 
            WHERE urn = $1
            ORDER BY id
            OFFSET $2 LIMIT $3
            """
            
            text_rows = await connection.fetch(text_query, urn, start, limit)
            
            segments = []
            for i, row in enumerate(text_rows):
                segment = TextSegment(
                    id=row['id'],
                    urn=row['urn'],
                    content=row['content'] or '',
                    section_reference=row['section_reference'] or '',
                    position=start + i
                )
                segments.append(segment)
            
            pagination = {
                "start": start,
                "limit": limit,
                "total": total_count,
                "returned": len(segments),
                "has_next": start + limit < total_count,
                "has_previous": start > 0,
                "next_start": start + limit if start + limit < total_count else None,
                "previous_start": max(0, start - limit) if start > 0 else None
            }
            
            logger.info(f"Retrieved {len(segments)} text segments for work: {urn}")
            
            return TextResponse(
                urn=urn,
                author=metadata_row['author'],
                work=metadata_row['work'],
                language=metadata_row['language'] or 'unknown',
                segments=segments,
                pagination=pagination
            )
            
    except asyncpg.PostgresError as e:
        logger.error(f"Database error in get_work_text: {e}")
        raise HTTPException(status_code=503, detail="Database query failed")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_work_text: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/word/{word}/morphology", response_model=MorphologyData, summary="Get word morphology")
async def get_word_morphology(word: str, request: Request) -> MorphologyData:
    """
    Get morphological analysis for a word.
    
    Args:
        word: The word to analyze
        
    Returns:
        MorphologyData: Morphological information for the word
    
    Raises:
        HTTPException: If database query fails
    """
    try:
        if not hasattr(request.state, 'db_pool') or not request.state.db_pool:
            raise HTTPException(status_code=503, detail="Database pool not available")
        
        db_pool = request.state.db_pool
        normalized_word = word.lower().strip()
        
        async with db_pool.acquire() as connection:
            try:
                morphology_query = """
                SELECT 
                    word,
                    lemma,
                    pos,
                    case_val as case,
                    number_val as number,
                    gender,
                    tense,
                    mood,
                    voice,
                    person,
                    definition
                FROM morphology 
                WHERE LOWER(word) = $1 OR LOWER(lemma) = $1
                LIMIT 1
                """
                
                morph_row = await connection.fetchrow(morphology_query, normalized_word)
                
                if morph_row:
                    return MorphologyData(
                        word=word,
                        lemma=morph_row['lemma'],
                        pos=morph_row['pos'],
                        case=morph_row['case'],
                        number=morph_row['number'],
                        gender=morph_row['gender'],
                        tense=morph_row['tense'],
                        mood=morph_row['mood'],
                        voice=morph_row['voice'],
                        person=morph_row['person'],
                        definition=morph_row['definition']
                    )
                    
            except asyncpg.UndefinedTableError:
                pass
            
            logger.info(f"No morphological data found for word: {word}")