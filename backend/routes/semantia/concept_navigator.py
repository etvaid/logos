"""
LOGOS Concept Navigator API
Phase 8: Cross-language concept search and navigation

GET /api/semantia/concept_navigator/search
- Input: query (string), languages (optional list)
- Output: { concepts: Concept[], relatedClusters: Cluster[] }

GET /api/semantia/concept_navigator/cluster/:id
- Output: { cluster: Cluster, members: Member[], edges: Edge[] }
"""

import os
import time
from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
import asyncpg

router = APIRouter()

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

_pool = None


class ClusterSummary(BaseModel):
    clusterId: str
    name: Optional[str]
    memberCount: int
    languages: List[str]
    topTerms: dict


class ClusterMember(BaseModel):
    urn: str
    language: str
    snippet: Optional[str]
    distance: Optional[float]


class ConceptSearchResult(BaseModel):
    clusters: List[ClusterSummary]
    query: str
    latencyMs: int


class ClusterDetail(BaseModel):
    clusterId: str
    name: Optional[str]
    description: Optional[str]
    memberCount: int
    languages: List[str]
    topTerms: dict
    members: List[ClusterMember]


async def get_pool():
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            DATABASE_URL,
            ssl=False,
            min_size=2,
            max_size=10,
            command_timeout=10
        )
    return _pool


def embed_query(text: str) -> Optional[List[float]]:
    """
    Embed a query for semantic search.
    Uses cached model if available.
    """
    try:
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('intfloat/multilingual-e5-small')
        # E5 models expect "query: " prefix for queries
        embedding = model.encode(f"query: {text}", normalize_embeddings=True)
        return embedding.tolist()
    except Exception as e:
        print(f"Embedding failed: {e}")
        return None


@router.get("/search")
async def search_concepts(
    query: str = Query(..., min_length=2),
    languages: Optional[str] = None,
    limit: int = 10
) -> ConceptSearchResult:
    """
    Search for concept clusters by query text.

    Uses semantic similarity to find clusters matching the query.
    """
    start_time = time.time()

    pool = await get_pool()

    # Try semantic search first
    query_embedding = embed_query(query)

    async with pool.acquire() as conn:
        if query_embedding:
            # Semantic search using vector similarity
            embedding_str = '[' + ','.join(f'{x:.8f}' for x in query_embedding) + ']'

            rows = await conn.fetch("""
                SELECT cluster_id, name, description, member_count, languages, top_terms,
                       centroid <-> $1::vector as distance
                FROM concept_clusters
                WHERE member_count >= 5
                ORDER BY centroid <-> $1::vector
                LIMIT $2
            """, embedding_str, limit)
        else:
            # Fallback: text search on top_terms
            rows = await conn.fetch("""
                SELECT cluster_id, name, description, member_count, languages, top_terms, 0 as distance
                FROM concept_clusters
                WHERE member_count >= 5
                AND (top_terms::text ILIKE $1 OR name ILIKE $1)
                ORDER BY member_count DESC
                LIMIT $2
            """, f"%{query}%", limit)

        clusters = []
        for row in rows:
            top_terms = row['top_terms']
            if isinstance(top_terms, str):
                import json
                top_terms = json.loads(top_terms)

            clusters.append(ClusterSummary(
                clusterId=str(row['cluster_id']),
                name=row['name'],
                memberCount=row['member_count'],
                languages=row['languages'] or [],
                topTerms=top_terms or {}
            ))

    latency_ms = int((time.time() - start_time) * 1000)

    return ConceptSearchResult(
        clusters=clusters,
        query=query,
        latencyMs=latency_ms
    )


@router.get("/cluster/{cluster_id}")
async def get_cluster(cluster_id: str, limit: int = 50) -> ClusterDetail:
    """
    Get detailed information about a concept cluster.
    """
    pool = await get_pool()

    async with pool.acquire() as conn:
        # Get cluster info
        cluster = await conn.fetchrow("""
            SELECT cluster_id, name, description, member_count, languages, top_terms
            FROM concept_clusters
            WHERE cluster_id = $1
        """, cluster_id)

        if not cluster:
            raise HTTPException(404, f"Cluster not found: {cluster_id}")

        # Get members
        members_rows = await conn.fetch("""
            SELECT urn, language, snippet, distance_to_centroid
            FROM concept_members
            WHERE cluster_id = $1
            ORDER BY distance_to_centroid
            LIMIT $2
        """, cluster_id, limit)

        top_terms = cluster['top_terms']
        if isinstance(top_terms, str):
            import json
            top_terms = json.loads(top_terms)

        members = [
            ClusterMember(
                urn=m['urn'],
                language=m['language'],
                snippet=m['snippet'],
                distance=m['distance_to_centroid']
            )
            for m in members_rows
        ]

        return ClusterDetail(
            clusterId=str(cluster['cluster_id']),
            name=cluster['name'],
            description=cluster['description'],
            memberCount=cluster['member_count'],
            languages=cluster['languages'] or [],
            topTerms=top_terms or {},
            members=members
        )


@router.get("/clusters")
async def list_clusters(
    language: Optional[str] = None,
    min_size: int = 5,
    limit: int = 50
):
    """
    List all concept clusters.
    """
    pool = await get_pool()

    async with pool.acquire() as conn:
        if language:
            rows = await conn.fetch("""
                SELECT cluster_id, name, member_count, languages, top_terms
                FROM concept_clusters
                WHERE $1 = ANY(languages) AND member_count >= $2
                ORDER BY member_count DESC
                LIMIT $3
            """, language, min_size, limit)
        else:
            rows = await conn.fetch("""
                SELECT cluster_id, name, member_count, languages, top_terms
                FROM concept_clusters
                WHERE member_count >= $1
                ORDER BY member_count DESC
                LIMIT $2
            """, min_size, limit)

        clusters = []
        for row in rows:
            top_terms = row['top_terms']
            if isinstance(top_terms, str):
                import json
                top_terms = json.loads(top_terms)

            clusters.append({
                'clusterId': str(row['cluster_id']),
                'name': row['name'],
                'memberCount': row['member_count'],
                'languages': row['languages'] or [],
                'topTerms': top_terms or {}
            })

        return {"clusters": clusters, "count": len(clusters)}


@router.get("/stats")
async def get_concept_stats():
    """Get concept system statistics."""
    pool = await get_pool()

    async with pool.acquire() as conn:
        stats = await conn.fetchrow("""
            SELECT
                (SELECT COUNT(*) FROM concept_clusters) as cluster_count,
                (SELECT COUNT(*) FROM concept_members) as member_count,
                (SELECT COUNT(*) FROM bridge_embeddings) as embedding_count,
                (SELECT ARRAY_AGG(DISTINCT language) FROM concept_members) as languages
        """)

        return {
            "clusterCount": stats['cluster_count'],
            "memberCount": stats['member_count'],
            "embeddingCount": stats['embedding_count'],
            "languages": stats['languages'] or []
        }
