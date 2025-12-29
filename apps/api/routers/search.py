
from fastapi import APIRouter, Request, Query
from typing import Dict, Any, Optional

router = APIRouter()

@router.get("/text")
async def search_text(
    request: Request,
    q: str,
    language: Optional[str] = None,
    author: Optional[str] = None,
    limit: int = Query(20, le=100)
) -> Dict[str, Any]:
    """Full-text search"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            query = """
                SELECT id, urn, author, work, content, language, section_reference
                FROM source_texts
                WHERE content ILIKE $1
            """
            params = [f"%{q}%"]
            
            if language:
                query += " AND LOWER(language) = $2"
                params.append(language.lower())
            if author:
                idx = len(params) + 1
                query += f" AND LOWER(author) LIKE ${idx}"
                params.append(f"%{author.lower()}%")
            
            query += f" LIMIT ${len(params) + 1}"
            params.append(limit)
            
            rows = await conn.fetch(query, *params)
            
            results = [
                {
                    "id": r['id'],
                    "urn": r['urn'],
                    "author": r['author'],
                    "work": r['work'],
                    "passage": r['content'][:200],
                    "reference": r['section_reference'],
                    "language": r['language']
                }
                for r in rows
            ]
            
            return {"query": q, "results": results, "total": len(results)}
    except Exception as e:
        return {"query": q, "results": [], "error": str(e)}

@router.get("/semantic")
async def search_semantic(
    request: Request,
    q: str,
    limit: int = Query(20, le=100)
) -> Dict[str, Any]:
    """Semantic search using embeddings"""
    return {
        "query": q,
        "results": [],
        "status": "pending_embedding_search",
        "message": "Semantic search requires pgvector extension"
    }

@router.get("/phrase")
async def search_phrase(
    request: Request,
    q: str,
    limit: int = Query(20, le=100)
) -> Dict[str, Any]:
    """Exact phrase search"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT id, urn, author, work, content, section_reference
                FROM source_texts
                WHERE content LIKE $1
                LIMIT $2
            """, f"%{q}%", limit)
            
            return {
                "query": q,
                "results": [
                    {
                        "id": r['id'],
                        "urn": r['urn'],
                        "author": r['author'],
                        "passage": r['content'][:200],
                        "reference": r['section_reference']
                    }
                    for r in rows
                ],
                "total": len(rows)
            }
    except Exception as e:
        return {"query": q, "results": [], "error": str(e)}
