
from fastapi import APIRouter, Request, Query
from typing import Dict, Any, List

router = APIRouter()

@router.get("/passage/{urn}")
async def get_passage_connections(request: Request, urn: str) -> Dict[str, Any]:
    """Find intertextual connections for a passage"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            # Get the passage
            passage = await conn.fetchrow(
                "SELECT * FROM source_texts WHERE urn = $1 LIMIT 1", urn
            )
            
            if not passage:
                return {"urn": urn, "connections": [], "status": "not_found"}
            
            return {
                "urn": urn,
                "passage": passage['content'][:200] if passage else "",
                "connections": [],
                "status": "connection_analysis_pending"
            }
    except Exception as e:
        return {"urn": urn, "error": str(e)}

@router.get("/author/{author}")
async def get_author_network(request: Request, author: str) -> Dict[str, Any]:
    """Get author's influence network"""
    return {
        "author": author,
        "influences": [],  # Who influenced this author
        "influenced": [],  # Who this author influenced
        "status": "pending_network_analysis"
    }

@router.get("/network")
async def get_full_network(
    request: Request,
    limit: int = Query(100, le=500)
) -> Dict[str, Any]:
    """Get full intertextuality network for visualization"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            # Get distinct authors as nodes
            authors = await conn.fetch("""
                SELECT DISTINCT author, COUNT(*) as work_count
                FROM source_texts
                WHERE author IS NOT NULL
                GROUP BY author
                ORDER BY work_count DESC
                LIMIT $1
            """, limit)
            
            nodes = [
                {"id": a['author'], "label": a['author'], "size": a['work_count']}
                for a in authors
            ]
            
            return {
                "nodes": nodes,
                "edges": [],  # Would need intertextuality table
                "status": "nodes_only"
            }
    except Exception as e:
        return {"nodes": [], "edges": [], "error": str(e)}

@router.get("/influence")
async def get_influence_ranking(request: Request) -> Dict[str, Any]:
    """Get PageRank-style influence scores"""
    return {
        "authors": [
            {"author": "Homer", "influence_score": 1.0},
            {"author": "Plato", "influence_score": 0.92},
            {"author": "Virgil", "influence_score": 0.88},
            {"author": "Aristotle", "influence_score": 0.85},
            {"author": "Cicero", "influence_score": 0.82}
        ],
        "status": "placeholder"
    }
