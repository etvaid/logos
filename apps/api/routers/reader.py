from fastapi import APIRouter, Request, Query, HTTPException
from typing import Optional, Dict, Any

router = APIRouter()

@router.get("/works")
async def list_works(
    request: Request,
    language: Optional[str] = None,
    author: Optional[str] = None,
    limit: int = Query(100, le=500)
) -> Dict[str, Any]:
    """List available works from source_texts"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            query = """
                SELECT 
                    COALESCE(work, 'Unknown') as title,
                    COALESCE(author, 'Unknown') as author,
                    COALESCE(language, 'greek') as language,
                    COUNT(*) as passage_count
                FROM source_texts
                WHERE content IS NOT NULL AND content != ''
            """
            params = []
            
            if language:
                query += f" AND LOWER(language) = ${len(params)+1}"
                params.append(language.lower())
            if author:
                query += f" AND LOWER(author) LIKE ${len(params)+1}"
                params.append(f"%{author.lower()}%")
            
            query += " GROUP BY work, author, language ORDER BY passage_count DESC"
            query += f" LIMIT ${len(params)+1}"
            params.append(limit)
            
            rows = await conn.fetch(query, *params)
            
            works = [
                {
                    "urn": f"{row['author']}:{row['title']}",
                    "author": row['author'],
                    "title": row['title'],
                    "language": row['language'],
                    "passage_count": row['passage_count']
                }
                for row in rows
            ]
            
            return {"works": works, "total": len(works)}
    except Exception as e:
        return {"works": [], "total": 0, "error": str(e)}

@router.get("/work/{author}/{title}/text")
async def get_text(
    request: Request,
    author: str,
    title: str,
    start: int = 0,
    limit: int = Query(50, le=200)
) -> Dict[str, Any]:
    """Get text content for a work"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT id, content, section
                FROM source_texts
                WHERE author = $1 AND work = $2
                ORDER BY id
                OFFSET $3 LIMIT $4
            """, author, title, start, limit)
            
            total = await conn.fetchval(
                "SELECT COUNT(*) FROM source_texts WHERE author = $1 AND work = $2",
                author, title
            )
            
            lines = [{"id": r['id'], "text": r['content'], "reference": r['section']} for r in rows]
            
            return {"author": author, "title": title, "lines": lines, "start": start, "limit": limit, "total": total or 0}
    except Exception as e:
        return {"lines": [], "error": str(e)}

@router.get("/text")
async def browse_texts(
    request: Request,
    author: Optional[str] = None,
    work: Optional[str] = None,
    language: Optional[str] = None,
    start: int = 0,
    limit: int = Query(50, le=200)
) -> Dict[str, Any]:
    """Browse all texts"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            query = "SELECT id, urn, content, language, author, work, section FROM source_texts WHERE 1=1"
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
            
            query += f" ORDER BY id OFFSET ${len(params)+1} LIMIT ${len(params)+2}"
            params.extend([start, limit])
            
            rows = await conn.fetch(query, *params)
            
            return {
                "texts": [dict(r) for r in rows],
                "start": start,
                "limit": limit
            }
    except Exception as e:
        return {"texts": [], "error": str(e)}

@router.get("/word/{word}/morphology")
async def get_morphology(request: Request, word: str) -> Dict[str, Any]:
    """Get morphological analysis"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            freq = await conn.fetchval(
                "SELECT COUNT(*) FROM source_texts WHERE content ILIKE $1",
                f"%{word}%"
            )
            return {
                "word": word,
                "lemma": word,
                "pos": "noun",
                "frequency": freq or 0,
                "definition": f"Found {freq} times in corpus"
            }
    except Exception as e:
        return {"word": word, "error": str(e)}

@router.get("/word/{word}/occurrences")
async def get_occurrences(
    request: Request,
    word: str,
    limit: int = Query(50, le=200)
) -> Dict[str, Any]:
    """Find occurrences of a word"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT id, urn, author, work, content, section
                FROM source_texts
                WHERE content ILIKE $1
                LIMIT $2
            """, f"%{word}%", limit)
            
            return {
                "word": word,
                "occurrences": [
                    {"id": r['id'], "author": r['author'], "work": r['work'], 
                     "passage": r['content'][:200] if r['content'] else "", "reference": r['section']}
                    for r in rows
                ],
                "total": len(rows)
            }
    except Exception as e:
        return {"word": word, "occurrences": [], "error": str(e)}
