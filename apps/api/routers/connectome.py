from fastapi import APIRouter, Request, Query
from typing import Dict, Any

router = APIRouter()

@router.get("/network")
async def get_network(request: Request, limit: int = Query(50, le=200)) -> Dict[str, Any]:
    """Get author network nodes"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            authors = await conn.fetch("""
                SELECT author, COUNT(*) as cnt
                FROM source_texts
                WHERE author IS NOT NULL
                GROUP BY author
                ORDER BY cnt DESC
                LIMIT $1
            """, limit)
            
            nodes = [
                {"id": a['author'], "label": a['author'], "size": a['cnt']}
                for a in authors
            ]
            
            return {"nodes": nodes, "total": len(nodes)}
    except Exception as e:
        return {"nodes": [], "error": str(e)}

@router.get("/influence")
async def get_influence(request: Request) -> Dict[str, Any]:
    """Get author influence ranking"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            authors = await conn.fetch("""
                SELECT author, COUNT(*) as cnt
                FROM source_texts
                WHERE author IS NOT NULL
                GROUP BY author
                ORDER BY cnt DESC
                LIMIT 20
            """)
            
            max_cnt = authors[0]['cnt'] if authors else 1
            
            return {
                "authors": [
                    {"author": a['author'], "influence_score": a['cnt'] / max_cnt}
                    for a in authors
                ]
            }
    except Exception as e:
        return {"authors": [], "error": str(e)}

@router.get("/passages/{author}")
async def get_author_passages(request: Request, author: str, limit: int = Query(20, le=100)) -> Dict[str, Any]:
    """Get passages for an author"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT id, work, content, section
                FROM source_texts
                WHERE author ILIKE $1
                LIMIT $2
            """, f"%{author}%", limit)
            
            return {
                "author": author,
                "passages": [{"id": r['id'], "work": r['work'], "text": r['content'][:200], "section": r['section']} for r in rows]
            }
    except Exception as e:
        return {"author": author, "passages": [], "error": str(e)}

@router.get("/")
async def root() -> Dict[str, Any]:
    return {"status": "ready", "description": "CONNECTOME - Intertextuality network"}