from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
import asyncpg
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


# Dependency to get database connection from main app
async def get_db():
    """Get database connection from pool"""
    from main import db_pool
    if not db_pool:
        raise HTTPException(status_code=500, detail="Database connection not available")
    async with db_pool.acquire() as connection:
        yield connection


def determine_status(count: int) -> str:
    """Determine availability status based on count"""
    if count >= 1000:
        return "available"
    elif count > 0:
        return "partial"
    else:
        return "coming_soon"


@router.get("/availability")
async def get_corpus_availability(db: asyncpg.Connection = Depends(get_db)) -> Dict[str, Any]:
    """
    Get corpus availability by language
    
    Returns:
        Dict containing language availability status:
        - available: >= 1000 texts
        - partial: > 0 texts
        - coming_soon: 0 texts
    """
    try:
        # Query to get count of source texts by language
        query = """
        SELECT language, COUNT(*) as text_count 
        FROM source_texts 
        GROUP BY language 
        ORDER BY text_count DESC
        """
        
        # Execute query
        rows = await db.fetch(query)
        
        # Process results
        availability = {}
        total_texts = 0
        
        for row in rows:
            language = row['language']
            count = row['text_count']
            status = determine_status(count)
            
            availability[language] = {
                "status": status,
                "text_count": count
            }
            total_texts += count
        
        # Add summary statistics
        summary = {
            "total_languages": len(availability),
            "total_texts": total_texts,
            "available_languages": len([lang for lang, data in availability.items() if data["status"] == "available"]),
            "partial_languages": len([lang for lang, data in availability.items() if data["status"] == "partial"]),
            "coming_soon_languages": len([lang for lang, data in availability.items() if data["status"] == "coming_soon"])
        }
        
        return {
            "success": True,
            "data": {
                "languages": availability,
                "summary": summary
            }
        }
        
    except asyncpg.PostgresError as e:
        logger.error(f"Database error in get_corpus_availability: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in get_corpus_availability: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )


@router.get("/languages")
async def get_available_languages(db: asyncpg.Connection = Depends(get_db)) -> Dict[str, Any]:
    """
    Get list of all available languages in the corpus
    
    Returns:
        List of languages with their text counts
    """
    try:
        query = """
        SELECT DISTINCT language 
        FROM source_texts 
        ORDER BY language
        """
        
        rows = await db.fetch(query)
        languages = [row['language'] for row in rows]
        
        return {
            "success": True,
            "data": {
                "languages": languages,
                "count": len(languages)
            }
        }
        
    except asyncpg.PostgresError as e:
        logger.error(f"Database error in get_available_languages: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in get_available_languages: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )


@router.get("/stats")
async def get_corpus_stats(db: asyncpg.Connection = Depends(get_db)) -> Dict[str, Any]:
    """
    Get comprehensive corpus statistics
    
    Returns:
        Detailed statistics about the corpus
    """
    try:
        # Get total counts
        total_texts_query = "SELECT COUNT(*) as total FROM source_texts"
        total_texts = await db.fetchval(total_texts_query)
        
        # Get language breakdown
        language_query = """
        SELECT 
            language,
            COUNT(*) as text_count,
            COUNT(DISTINCT author) as author_count
        FROM source_texts 
        GROUP BY language 
        ORDER BY text_count DESC
        """
        
        language_stats = await db.fetch(language_query)
        
        # Get top authors
        author_query = """
        SELECT 
            author,
            language,
            COUNT(*) as text_count
        FROM source_texts 
        GROUP BY author, language 
        ORDER BY text_count DESC 
        LIMIT 10
        """
        
        top_authors = await db.fetch(author_query)
        
        return {
            "success": True,
            "data": {
                "total_texts": total_texts,
                "language_breakdown": [
                    {
                        "language": row['language'],
                        "text_count": row['text_count'],
                        "author_count": row['author_count'],
                        "status": determine_status(row['text_count'])
                    }
                    for row in language_stats
                ],
                "top_authors": [
                    {
                        "author": row['author'],
                        "language": row['language'],
                        "text_count": row['text_count']
                    }
                    for row in top_authors
                ]
            }
        }
        
    except asyncpg.PostgresError as e:
        logger.error(f"Database error in get_corpus_stats: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error in get_corpus_stats: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
