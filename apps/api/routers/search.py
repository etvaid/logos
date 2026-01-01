"""
SEARCH ROUTER
=============
Full-text and semantic search across 6.6M passages.
"""
from fastapi import APIRouter, Request, Query, HTTPException
from typing import Dict, Any, Optional, List

router = APIRouter()

@router.get("/text")
async def search_text(
    request: Request,
    q: str = Query(..., min_length=1, description="Search query"),
    language: Optional[str] = Query(None, description="Filter by language"),
    author: Optional[str] = Query(None, description="Filter by author"),
    work: Optional[str] = Query(None, description="Filter by work"),
    limit: int = Query(50, le=200, description="Max results"),
    offset: int = Query(0, ge=0, description="Offset for pagination")
) -> Dict[str, Any]:
    """
    Full-text search across the corpus.
    Searches 6.6M passages with optional filters.
    """
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            # Build query
            query = """
                SELECT id, urn, author, work, content, section, language
                FROM source_texts
                WHERE content ILIKE $1
            """
            count_query = """
                SELECT COUNT(*) FROM source_texts WHERE content ILIKE $1
            """
            params = [f"%{q}%"]
            count_params = [f"%{q}%"]
            
            if language:
                query += f" AND LOWER(language) = ${len(params)+1}"
                count_query += f" AND LOWER(language) = ${len(count_params)+1}"
                params.append(language.lower())
                count_params.append(language.lower())
            
            if author:
                query += f" AND LOWER(author) LIKE ${len(params)+1}"
                count_query += f" AND LOWER(author) LIKE ${len(count_params)+1}"
                params.append(f"%{author.lower()}%")
                count_params.append(f"%{author.lower()}%")
            
            if work:
                query += f" AND LOWER(work) LIKE ${len(params)+1}"
                count_query += f" AND LOWER(work) LIKE ${len(count_params)+1}"
                params.append(f"%{work.lower()}%")
                count_params.append(f"%{work.lower()}%")
            
            # Get total count
            total = await conn.fetchval(count_query, *count_params)
            
            # Add pagination
            query += f" ORDER BY id OFFSET ${len(params)+1} LIMIT ${len(params)+2}"
            params.extend([offset, limit])
            
            rows = await conn.fetch(query, *params)
            
            # Highlight search term in results
            results = []
            for r in rows:
                content = r['content'] or ""
                # Find position of query in content
                lower_content = content.lower()
                lower_q = q.lower()
                pos = lower_content.find(lower_q)
                
                # Extract context around match
                if pos >= 0:
                    start = max(0, pos - 100)
                    end = min(len(content), pos + len(q) + 100)
                    snippet = ("..." if start > 0 else "") + content[start:end] + ("..." if end < len(content) else "")
                else:
                    snippet = content[:250] + "..." if len(content) > 250 else content
                
                results.append({
                    "id": r['id'],
                    "urn": r['urn'],
                    "author": r['author'] or "Unknown",
                    "work": r['work'] or "Unknown",
                    "passage": snippet,
                    "reference": r['section'],
                    "language": r['language']
                })
            
            return {
                "query": q,
                "total": total or 0,
                "offset": offset,
                "limit": limit,
                "results": results,
                "filters": {
                    "language": language,
                    "author": author,
                    "work": work
                }
            }
    except Exception as e:
        return {"query": q, "results": [], "total": 0, "error": str(e)}

@router.get("/semantic")
async def semantic_search(
    request: Request,
    q: str = Query(..., min_length=1),
    limit: int = Query(20, le=100)
) -> Dict[str, Any]:
    """
    Semantic search using embeddings.
    TODO: Implement with actual vector search when embeddings are ready.
    """
    # For now, fall back to text search
    return await search_text(request, q=q, limit=limit)

@router.get("/phrase")
async def phrase_search(
    request: Request,
    phrase: str = Query(..., min_length=2),
    limit: int = Query(50, le=200)
) -> Dict[str, Any]:
    """Exact phrase search"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT id, author, work, content, section, language
                FROM source_texts
                WHERE content LIKE $1
                LIMIT $2
            """, f"%{phrase}%", limit)
            
            return {
                "phrase": phrase,
                "results": [
                    {
                        "id": r['id'],
                        "author": r['author'] or "Unknown",
                        "work": r['work'] or "Unknown",
                        "passage": r['content'][:400] if r['content'] else "",
                        "reference": r['section'],
                        "language": r['language']
                    }
                    for r in rows
                ],
                "total": len(rows)
            }
    except Exception as e:
        return {"phrase": phrase, "results": [], "error": str(e)}

@router.get("/advanced")
async def advanced_search(
    request: Request,
    q: Optional[str] = None,
    author: Optional[str] = None,
    work: Optional[str] = None,
    language: Optional[str] = None,
    section: Optional[str] = None,
    limit: int = Query(50, le=200)
) -> Dict[str, Any]:
    """Advanced search with multiple field filters"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            conditions = ["1=1"]
            params = []
            
            if q:
                conditions.append(f"content ILIKE ${len(params)+1}")
                params.append(f"%{q}%")
            if author:
                conditions.append(f"LOWER(author) LIKE ${len(params)+1}")
                params.append(f"%{author.lower()}%")
            if work:
                conditions.append(f"LOWER(work) LIKE ${len(params)+1}")
                params.append(f"%{work.lower()}%")
            if language:
                conditions.append(f"LOWER(language) = ${len(params)+1}")
                params.append(language.lower())
            if section:
                conditions.append(f"section LIKE ${len(params)+1}")
                params.append(f"%{section}%")
            
            where_clause = " AND ".join(conditions)
            query = f"""
                SELECT id, author, work, content, section, language
                FROM source_texts
                WHERE {where_clause}
                LIMIT ${len(params)+1}
            """
            params.append(limit)
            
            rows = await conn.fetch(query, *params)
            
            return {
                "results": [
                    {
                        "id": r['id'],
                        "author": r['author'],
                        "work": r['work'],
                        "passage": r['content'][:300] if r['content'] else "",
                        "reference": r['section'],
                        "language": r['language']
                    }
                    for r in rows
                ],
                "total": len(rows),
                "filters": {"q": q, "author": author, "work": work, "language": language, "section": section}
            }
    except Exception as e:
        return {"results": [], "error": str(e)}

@router.get("/")
async def root() -> Dict[str, Any]:
    """Search router status"""
    return {
        "status": "ready",
        "description": "SEARCH - Full-text and semantic search across 6.6M passages",
        "endpoints": [
            "/search/text",
            "/search/semantic",
            "/search/phrase",
            "/search/advanced"
        ]
    }