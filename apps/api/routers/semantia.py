
from fastapi import APIRouter, Request, Query
from typing import Dict, Any, List
import math

router = APIRouter()

@router.get("/{word}")
async def get_word_analysis(request: Request, word: str) -> Dict[str, Any]:
    """Get semantic analysis for a word from corpus (not dictionary)"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            # Get frequency
            freq = await conn.fetchval("""
                SELECT COUNT(*) FROM source_texts 
                WHERE content ILIKE $1
            """, f"%{word}%")
            
            # Get sample contexts
            samples = await conn.fetch("""
                SELECT author, work, content, section_reference
                FROM source_texts
                WHERE content ILIKE $1
                LIMIT 5
            """, f"%{word}%")
            
            # Check for embedding
            embedding_row = await conn.fetchrow("""
                SELECT * FROM word_embeddings WHERE word = $1
            """, word)
            
            return {
                "word": word,
                "lemma": word,
                "corpus_frequency": freq or 0,
                "has_embedding": embedding_row is not None,
                "definition": f"Appears {freq} times in corpus. Corpus-derived meaning pending full analysis.",
                "sample_contexts": [
                    {
                        "author": s['author'],
                        "work": s['work'],
                        "passage": s['content'][:150] + "...",
                        "reference": s['section_reference']
                    }
                    for s in samples
                ],
                "semantic_field": "pending",
                "status": "ready"
            }
    except Exception as e:
        return {"word": word, "error": str(e), "status": "error"}

@router.get("/{word}/neighbors")
async def get_semantic_neighbors(
    request: Request,
    word: str,
    limit: int = Query(20, le=50)
) -> Dict[str, Any]:
    """Get semantically similar words using cosine similarity on embeddings"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            # Get the word's embedding
            target = await conn.fetchrow("""
                SELECT embedding FROM word_embeddings WHERE word = $1
            """, word)
            
            if not target:
                return {"word": word, "neighbors": [], "status": "no_embedding"}
            
            # Find similar words (simplified - real version would use pgvector)
            # For now return placeholder
            return {
                "word": word,
                "neighbors": [],
                "status": "embedding_found",
                "message": "Use pgvector extension for cosine similarity search"
            }
    except Exception as e:
        return {"word": word, "neighbors": [], "error": str(e)}

@router.get("/{word}/compare/{other}")
async def compare_words(request: Request, word: str, other: str) -> Dict[str, Any]:
    """Compare two words semantically"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            freq1 = await conn.fetchval(
                "SELECT COUNT(*) FROM source_texts WHERE content ILIKE $1",
                f"%{word}%"
            )
            freq2 = await conn.fetchval(
                "SELECT COUNT(*) FROM source_texts WHERE content ILIKE $1",
                f"%{other}%"
            )
            
            # Find co-occurrences
            cooccur = await conn.fetchval("""
                SELECT COUNT(*) FROM source_texts 
                WHERE content ILIKE $1 AND content ILIKE $2
            """, f"%{word}%", f"%{other}%")
            
            return {
                "word1": word,
                "word2": other,
                "freq1": freq1 or 0,
                "freq2": freq2 or 0,
                "cooccurrences": cooccur or 0,
                "similarity": 0.0,  # Would calculate from embeddings
                "status": "ready"
            }
    except Exception as e:
        return {"word1": word, "word2": other, "error": str(e)}

@router.get("/{word}/evolution")
async def get_evolution(request: Request, word: str) -> Dict[str, Any]:
    """Get how word meaning changed over time periods"""
    return {
        "word": word,
        "periods": [
            {"name": "Archaic", "years": "-800 to -500", "usage": "pending"},
            {"name": "Classical", "years": "-500 to -323", "usage": "pending"},
            {"name": "Hellenistic", "years": "-323 to -31", "usage": "pending"},
            {"name": "Roman", "years": "-31 to 300", "usage": "pending"}
        ],
        "drift_score": 0.0,
        "status": "pending_temporal_analysis"
    }

@router.get("/{word}/authors")
async def get_word_by_authors(request: Request, word: str) -> Dict[str, Any]:
    """Get which authors use this word most"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT author, COUNT(*) as count
                FROM source_texts
                WHERE content ILIKE $1
                GROUP BY author
                ORDER BY count DESC
                LIMIT 20
            """, f"%{word}%")
            
            return {
                "word": word,
                "authors": [{"author": r['author'], "count": r['count']} for r in rows]
            }
    except Exception as e:
        return {"word": word, "authors": [], "error": str(e)}

@router.get("/clusters")
async def get_clusters(request: Request) -> Dict[str, Any]:
    """Get semantic clusters"""
    return {
        "clusters": [
            {"id": 1, "name": "Warfare & Combat", "size": 2500},
            {"id": 2, "name": "Divine & Religious", "size": 1800},
            {"id": 3, "name": "Human Body", "size": 1500},
            {"id": 4, "name": "Nature & Environment", "size": 1400},
            {"id": 5, "name": "Social Relations", "size": 1200},
            {"id": 6, "name": "Abstract Concepts", "size": 1100},
            {"id": 7, "name": "Material Culture", "size": 900},
            {"id": 8, "name": "Time & Space", "size": 800}
        ],
        "status": "placeholder"
    }

@router.get("/bridges")
async def get_bridges(request: Request) -> Dict[str, Any]:
    """Get Greek-Latin semantic bridges"""
    return {
        "bridges": [
            {"greek": "λόγος", "latin": "ratio/verbum", "semantic_overlap": 0.85},
            {"greek": "ἀρετή", "latin": "virtus", "semantic_overlap": 0.72},
            {"greek": "φύσις", "latin": "natura", "semantic_overlap": 0.91},
            {"greek": "ψυχή", "latin": "anima", "semantic_overlap": 0.78}
        ],
        "status": "placeholder"
    }
