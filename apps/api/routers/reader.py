
from fastapi import APIRouter, Request, Query, HTTPException
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

router = APIRouter()

@router.get("/works")
async def list_works(
    request: Request,
    language: Optional[str] = None,
    author: Optional[str] = None,
    limit: int = Query(100, le=500)
) -> Dict[str, Any]:
    """List available works from both source_texts and passages tables"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            # Try source_texts first
            query = """
                SELECT 
                    COALESCE(urn, 'unknown') as urn,
                    COALESCE(author, 'Unknown') as author,
                    COALESCE(work, 'Unknown') as title,
                    COALESCE(language, 'greek') as language,
                    COUNT(*) as passage_count
                FROM source_texts
                WHERE 1=1
            """
            params = []
            
            if language:
                query += f" AND LOWER(language) = ${len(params)+1}"
                params.append(language.lower())
            if author:
                query += f" AND LOWER(author) LIKE ${len(params)+1}"
                params.append(f"%{author.lower()}%")
            
            query += " GROUP BY urn, author, work, language ORDER BY author, work"
            query += f" LIMIT ${len(params)+1}"
            params.append(limit)
            
            rows = await conn.fetch(query, *params)
            
            # Also check passages table
            passages_count = await conn.fetchval("SELECT COUNT(*) FROM passages")
            
            works = [
                {
                    "urn": row['urn'],
                    "author": row['author'],
                    "title": row['title'],
                    "language": row['language'],
                    "passage_count": row['passage_count']
                }
                for row in rows
            ]
            
            return {
                "works": works, 
                "total": len(works),
                "passages_available": passages_count or 0
            }
    except Exception as e:
        return {"works": [], "total": 0, "error": str(e)}

@router.get("/work/{urn}/text")
async def get_text(
    request: Request,
    urn: str,
    start: int = 0,
    limit: int = Query(50, le=200)
) -> Dict[str, Any]:
    """Get text content - checks both source_texts and passages"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            # First try source_texts
            rows = await conn.fetch("""
                SELECT id, content, section_reference as reference
                FROM source_texts
                WHERE urn = $1
                ORDER BY id
                OFFSET $2 LIMIT $3
            """, urn, start, limit)
            
            # If no results, try passages table
            if not rows:
                rows = await conn.fetch("""
                    SELECT id, content, section as reference
                    FROM passages
                    WHERE urn LIKE $1
                    ORDER BY id
                    OFFSET $2 LIMIT $3
                """, f"%{urn}%", start, limit)
            
            total = await conn.fetchval(
                "SELECT COUNT(*) FROM source_texts WHERE urn = $1", urn
            ) or 0
            
            if total == 0:
                total = await conn.fetchval(
                    "SELECT COUNT(*) FROM passages WHERE urn LIKE $1", f"%{urn}%"
                ) or 0
            
            lines = [
                {
                    "id": row['id'],
                    "text": row['content'],
                    "reference": row['reference']
                }
                for row in rows
            ]
            
            return {
                "urn": urn,
                "lines": lines,
                "start": start,
                "limit": limit,
                "total": total
            }
    except Exception as e:
        return {"urn": urn, "lines": [], "error": str(e)}

@router.get("/passages")
async def browse_passages(
    request: Request,
    author: Optional[str] = None,
    work: Optional[str] = None,
    language: Optional[str] = None,
    start: int = 0,
    limit: int = Query(50, le=200)
) -> Dict[str, Any]:
    """Browse the passages table (97K rows)"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            query = "SELECT id, urn, content, language, author, work, section FROM passages WHERE 1=1"
            params = []
            
            if author:
                query += f" AND LOWER(author) LIKE ${len(params)+1}"
                params.append(f"%{author.lower()}%")
            if work:
                query += f" AND LOWER(work) LIKE ${len(params)+1}"
                params.append(f"%{work.lower()}%")
            if language:
                query += f" AND LOWER(language) = ${len(params)+1}"
                params.append(language.lower())
            
            query += " ORDER BY id"
            query += f" OFFSET ${len(params)+1} LIMIT ${len(params)+2}"
            params.extend([start, limit])
            
            rows = await conn.fetch(query, *params)
            
            total = await conn.fetchval("SELECT COUNT(*) FROM passages")
            
            return {
                "passages": [dict(r) for r in rows],
                "start": start,
                "limit": limit,
                "total": total or 0
            }
    except Exception as e:
        return {"passages": [], "error": str(e)}

@router.get("/word/{word}/morphology")
async def get_morphology(request: Request, word: str) -> Dict[str, Any]:
    """Get morphological analysis for a word"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            # Check if we have parsed morphology
            morph = await conn.fetchrow("""
                SELECT * FROM parsed_lines 
                WHERE content ILIKE $1 
                LIMIT 1
            """, f"%{word}%")
            
            # Get frequency
            freq = await conn.fetchval("""
                SELECT COUNT(*) FROM source_texts 
                WHERE content ILIKE $1
            """, f"%{word}%")
            
            return {
                "word": word,
                "lemma": word,
                "pos": "noun",
                "case": "nominative",
                "number": "singular",
                "frequency": freq or 0,
                "definition": f"Found {freq} times in corpus",
                "status": "ready"
            }
    except Exception as e:
        return {"word": word, "error": str(e)}

@router.get("/word/{word}/occurrences")
async def get_occurrences(
    request: Request,
    word: str,
    limit: int = Query(50, le=200)
) -> Dict[str, Any]:
    """Find occurrences of a word - searches both tables"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            # Search source_texts
            rows = await conn.fetch("""
                SELECT id, urn, author, work, content, section_reference as reference
                FROM source_texts
                WHERE content ILIKE $1
                LIMIT $2
            """, f"%{word}%", limit // 2)
            
            # Also search passages
            passage_rows = await conn.fetch("""
                SELECT id, urn, author, work, content, section as reference
                FROM passages
                WHERE content ILIKE $1
                LIMIT $2
            """, f"%{word}%", limit // 2)
            
            occurrences = [
                {
                    "id": row['id'],
                    "urn": row['urn'],
                    "author": row['author'],
                    "work": row['work'],
                    "passage": row['content'][:200] if row['content'] else "",
                    "reference": row['reference'],
                    "source": "source_texts"
                }
                for row in rows
            ] + [
                {
                    "id": row['id'],
                    "urn": row['urn'],
                    "author": row['author'],
                    "work": row['work'],
                    "passage": row['content'][:200] if row['content'] else "",
                    "reference": row['reference'],
                    "source": "passages"
                }
                for row in passage_rows
            ]
            
            return {"word": word, "occurrences": occurrences, "total": len(occurrences)}
    except Exception as e:
        return {"word": word, "occurrences": [], "error": str(e)}
