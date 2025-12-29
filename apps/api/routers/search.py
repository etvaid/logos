from fastapi import APIRouter, Request, Query
from typing import Dict, Any, Optional

router = APIRouter()

@router.get("/text")
async def search_text(
    request: Request,
    q: str = Query(..., min_length=1),
    language: Optional[str] = None,
    author: Optional[str] = None,
    limit: int = Query(50, le=200)
) -> Dict[str, Any]:
    """Full-text search across corpus"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            query = """
                SELECT id, urn, author, work, content, section, language
                FROM source_texts
                WHERE content ILIKE $1
            """
            params = [f"%{q}%"]
            
            if language:
                query += f" AND LOWER(language) = ${len(params)+1}"
                params.append(language.lower())
            if author:
                query += f" AND LOWER(author) LIKE ${len(params)+1}"
                params.append(f"%{author.lower()}%")
            
            query += f" LIMIT ${len(params)+1}"
            params.append(limit)
            
            rows = await conn.fetch(query, *params)
            
            return {
                "query": q,
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
                "total": len(rows)
            }
    except Exception as e:
        return {"query": q, "results": [], "error": str(e)}

@router.get("/semantic")
async def semantic_search(
    request: Request,
    q: str = Query(..., min_length=1),
    limit: int = Query(20, le=100)
) -> Dict[str, Any]:
    """Semantic search using embeddings (placeholder)"""
    # TODO: Implement with actual embeddings when available
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
                SELECT id, author, work, content, section
                FROM source_texts
                WHERE content LIKE $1
                LIMIT $2
            """, f"%{phrase}%", limit)
            
            return {
                "phrase": phrase,
                "results": [
                    {"id": r['id'], "author": r['author'], "work": r['work'], 
                     "passage": r['content'][:300] if r['content'] else "", "reference": r['section']}
                    for r in rows
                ],
                "total": len(rows)
            }
    except Exception as e:
        return {"phrase": phrase, "results": [], "error": str(e)}

@router.get("/")
async def root() -> Dict[str, Any]:
    return {"status": "ready", "description": "SEARCH - Full-text and semantic search"}