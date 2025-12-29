from fastapi import APIRouter, Request, Query
from typing import Dict, Any, Optional

router = APIRouter()

@router.get("/word/{word}")
async def get_word_analysis(request: Request, word: str) -> Dict[str, Any]:
    """Get comprehensive word analysis from corpus"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            freq = await conn.fetchval(
                "SELECT COUNT(*) FROM source_texts WHERE content ILIKE $1",
                f"%{word}%"
            )
            
            contexts = await conn.fetch("""
                SELECT author, work, content, section
                FROM source_texts
                WHERE content ILIKE $1
                LIMIT 10
            """, f"%{word}%")
            
            authors = await conn.fetch("""
                SELECT author, COUNT(*) as cnt
                FROM source_texts
                WHERE content ILIKE $1 AND author IS NOT NULL
                GROUP BY author
                ORDER BY cnt DESC
                LIMIT 10
            """, f"%{word}%")
            
            return {
                "word": word,
                "frequency": freq or 0,
                "sample_contexts": [
                    {"author": c['author'], "work": c['work'], 
                     "text": c['content'][:200] if c['content'] else "", 
                     "reference": c['section']}
                    for c in contexts
                ],
                "author_distribution": [{"author": a['author'], "count": a['cnt']} for a in authors],
                "status": "analyzed"
            }
    except Exception as e:
        return {"word": word, "error": str(e)}

@router.get("/frequency/{word}")
async def get_frequency(request: Request, word: str) -> Dict[str, Any]:
    """Get word frequency in corpus"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            freq = await conn.fetchval(
                "SELECT COUNT(*) FROM source_texts WHERE content ILIKE $1",
                f"%{word}%"
            )
            return {"word": word, "frequency": freq or 0}
    except Exception as e:
        return {"word": word, "frequency": 0, "error": str(e)}

@router.get("/contexts/{word}")
async def get_contexts(request: Request, word: str, limit: int = Query(20, le=100)) -> Dict[str, Any]:
    """Get sample contexts for a word"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT author, work, content, section
                FROM source_texts
                WHERE content ILIKE $1
                LIMIT $2
            """, f"%{word}%", limit)
            
            return {
                "word": word,
                "contexts": [
                    {"author": r['author'], "work": r['work'], 
                     "text": r['content'][:300] if r['content'] else "",
                     "reference": r['section']}
                    for r in rows
                ],
                "total": len(rows)
            }
    except Exception as e:
        return {"word": word, "contexts": [], "error": str(e)}

@router.get("/logos")
async def logos_endpoint(request: Request) -> Dict[str, Any]:
    """Default SEMANTIA endpoint"""
    return {"status": "ready", "description": "SEMANTIA - Corpus-derived word meanings"}