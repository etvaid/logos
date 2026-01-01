"""
SEMANTIA ROUTER
===============
Corpus-derived word analysis - meanings from actual usage, not dictionaries.
"""
from fastapi import APIRouter, Request, Query, HTTPException
from typing import Dict, Any, Optional, List

router = APIRouter()

@router.get("/word/{word}")
async def get_word_analysis(request: Request, word: str) -> Dict[str, Any]:
    """
    Get comprehensive word analysis from the corpus.
    Returns frequency, contexts, author distribution, and more.
    """
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            # Get frequency
            freq = await conn.fetchval(
                "SELECT COUNT(*) FROM source_texts WHERE content ILIKE $1",
                f"%{word}%"
            )
            
            # Get sample contexts
            contexts = await conn.fetch("""
                SELECT id, author, work, content, section, language
                FROM source_texts
                WHERE content ILIKE $1
                ORDER BY RANDOM()
                LIMIT 15
            """, f"%{word}%")
            
            # Get author distribution
            authors = await conn.fetch("""
                SELECT author, COUNT(*) as cnt
                FROM source_texts
                WHERE content ILIKE $1 AND author IS NOT NULL
                GROUP BY author
                ORDER BY cnt DESC
                LIMIT 20
            """, f"%{word}%")
            
            # Get language distribution
            languages = await conn.fetch("""
                SELECT language, COUNT(*) as cnt
                FROM source_texts
                WHERE content ILIKE $1 AND language IS NOT NULL
                GROUP BY language
                ORDER BY cnt DESC
            """, f"%{word}%")
            
            # Get work distribution
            works = await conn.fetch("""
                SELECT work, COUNT(*) as cnt
                FROM source_texts
                WHERE content ILIKE $1 AND work IS NOT NULL
                GROUP BY work
                ORDER BY cnt DESC
                LIMIT 10
            """, f"%{word}%")
            
            return {
                "word": word,
                "frequency": freq or 0,
                "sample_contexts": [
                    {
                        "id": c['id'],
                        "author": c['author'] or "Unknown",
                        "work": c['work'] or "Unknown",
                        "passage": c['content'][:300] if c['content'] else "",
                        "reference": c['section'],
                        "language": c['language']
                    }
                    for c in contexts
                ],
                "author_distribution": [
                    {"author": a['author'], "count": a['cnt']} 
                    for a in authors
                ],
                "language_distribution": [
                    {"language": l['language'], "count": l['cnt']}
                    for l in languages
                ],
                "top_works": [
                    {"work": w['work'], "count": w['cnt']}
                    for w in works
                ],
                "analysis_type": "corpus_derived",
                "note": "Meanings derived from actual usage in 6.6M passages"
            }
    except Exception as e:
        return {"word": word, "error": str(e), "frequency": 0}

@router.get("/frequency/{word}")
async def get_frequency(request: Request, word: str) -> Dict[str, Any]:
    """Get word frequency in the corpus"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            freq = await conn.fetchval(
                "SELECT COUNT(*) FROM source_texts WHERE content ILIKE $1",
                f"%{word}%"
            )
            
            total = await conn.fetchval("SELECT COUNT(*) FROM source_texts")
            
            return {
                "word": word,
                "frequency": freq or 0,
                "total_passages": total or 0,
                "percentage": f"{(freq or 0) / (total or 1) * 100:.6f}%"
            }
    except Exception as e:
        return {"word": word, "frequency": 0, "error": str(e)}

@router.get("/contexts/{word}")
async def get_contexts(
    request: Request, 
    word: str, 
    limit: int = Query(30, le=100),
    author: Optional[str] = None,
    language: Optional[str] = None
) -> Dict[str, Any]:
    """Get sample contexts for a word with optional filters"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            query = """
                SELECT id, author, work, content, section, language
                FROM source_texts
                WHERE content ILIKE $1
            """
            params = [f"%{word}%"]
            
            if author:
                query += f" AND LOWER(author) LIKE ${len(params)+1}"
                params.append(f"%{author.lower()}%")
            
            if language:
                query += f" AND LOWER(language) = ${len(params)+1}"
                params.append(language.lower())
            
            query += f" ORDER BY RANDOM() LIMIT ${len(params)+1}"
            params.append(limit)
            
            rows = await conn.fetch(query, *params)
            
            return {
                "word": word,
                "contexts": [
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
                "total": len(rows),
                "filters_applied": {
                    "author": author,
                    "language": language
                }
            }
    except Exception as e:
        return {"word": word, "contexts": [], "error": str(e)}

@router.get("/neighbors/{word}")
async def get_semantic_neighbors(request: Request, word: str, limit: int = 10) -> Dict[str, Any]:
    """
    Get semantically similar words (placeholder for embedding-based similarity).
    TODO: Implement with actual word embeddings.
    """
    return {
        "word": word,
        "neighbors": [],
        "note": "Semantic neighbor computation requires word embeddings (Phase 2)",
        "status": "placeholder"
    }

@router.get("/")
async def root() -> Dict[str, Any]:
    """SEMANTIA router status"""
    return {
        "status": "ready",
        "description": "SEMANTIA - Corpus-derived word meanings from 6.6M passages",
        "endpoints": [
            "/semantia/word/{word}",
            "/semantia/frequency/{word}",
            "/semantia/contexts/{word}",
            "/semantia/neighbors/{word}"
        ]
    }