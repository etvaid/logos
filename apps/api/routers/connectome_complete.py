from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List, Tuple, Set
import asyncpg
import logging
from datetime import datetime
import json
from collections import defaultdict, deque
import heapq

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Connection types as defined in requirements
CONNECTION_TYPES = {
    "verbal_echo": "Direct verbal parallels or echoes between texts",
    "thematic_parallel": "Similar themes or conceptual parallels",
    "structural_allusion": "Structural or compositional similarities",
    "direct_citation": "Direct quotations or explicit references"
}

# Pydantic Models
class IntertextualConnection(BaseModel):
    source_urn: str
    target_urn: str
    connection_type: str
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    evidence: Optional[str] = None
    source_author: Optional[str] = None
    target_author: Optional[str] = None
    source_work: Optional[str] = None
    target_work: Optional[str] = None

class PassageConnections(BaseModel):
    passage_urn: str
    total_connections: int
    connections: List[IntertextualConnection]
    connection_summary: Dict[str, int]
    most_connected_authors: List[str]
    most_connected_works: List[str]

class AuthorInfluence(BaseModel):
    author: str
    influence_score: float = Field(..., ge=0.0, le=1.0)
    influenced_by_count: int
    influences_count: int
    top_influences: List[str]
    top_influenced: List[str]
    total_connections: int
    connection_types: Dict[str, int]

class AuthorNetwork(BaseModel):
    author: str
    network_data: AuthorInfluence
    direct_connections: List[IntertextualConnection]
    network_metrics: Dict[str, Any]

class WorkConnections(BaseModel):
    work_urn: str
    author: str
    work_title: str
    total_connections: int
    inbound_connections: int
    outbound_connections: int
    connections: List[IntertextualConnection]
    connected_works: List[str]
    connection_strength: float = Field(..., ge=0.0, le=1.0)

class ConnectionPath(BaseModel):
    source_urn: str
    target_urn: str
    path_length: int
    path_strength: float = Field(..., ge=0.0, le=1.0)
    path_nodes: List[str]
    path_connections: List[IntertextualConnection]
    alternative_paths: Optional[List[Dict[str, Any]]] = None

class InfluenceScore(BaseModel):
    author: str
    influence_score: float = Field(..., ge=0.0, le=1.0)
    rank: int
    total_connections: int
    incoming_weight: float
    outgoing_weight: float
    centrality_measures: Dict[str, float]

class InfluenceRankings(BaseModel):
    rankings: List[InfluenceScore]
    total_authors: int
    algorithm_info: Dict[str, Any]
    last_computed: str

class NetworkNode(BaseModel):
    id: str
    label: str
    type: str  # 'author', 'work', 'passage'
    size: float
    color: str
    metadata: Dict[str, Any]

class NetworkEdge(BaseModel):
    source: str
    target: str
    weight: float
    connection_type: str
    label: Optional[str] = None
    color: Optional[str] = None
    metadata: Dict[str, Any]

class NetworkGraph(BaseModel):
    nodes: List[NetworkNode]
    edges: List[NetworkEdge]
    graph_stats: Dict[str, Any]
    layout_info: Dict[str, Any]
    filter_options: Dict[str, List[str]]


def calculate_pagerank(connections: List[Tuple[str, str, float]], damping_factor: float = 0.85) -> Dict[str, float]:
    """Calculate PageRank scores for influence analysis"""
    if not connections:
        return {}
    
    # Build adjacency list and collect all nodes
    graph = defaultdict(list)
    nodes = set()
    out_degree = defaultdict(int)
    
    for source, target, weight in connections:
        graph[source].append((target, weight))
        nodes.add(source)
        nodes.add(target)
        out_degree[source] += 1
    
    nodes = list(nodes)
    n = len(nodes)
    
    if n == 0:
        return {}
    
    # Initialize PageRank scores
    pagerank = {node: 1.0 / n for node in nodes}
    
    # Iterative computation (simplified)
    for _ in range(50):
        new_pagerank = {}
        
        for node in nodes:
            rank = (1 - damping_factor) / n
            
            # Sum contributions from incoming links
            for source in nodes:
                if out_degree[source] > 0:
                    for target, weight in graph[source]:
                        if target == node:
                            rank += damping_factor * pagerank[source] * weight / out_degree[source]
                            break
            
            new_pagerank[node] = rank
        
        pagerank = new_pagerank
    
    return pagerank


def find_shortest_path(graph: Dict[str, List[Tuple[str, float]]], start: str, end: str, max_depth: int = 6) -> Optional[Tuple[List[str], float]]:
    """Find shortest weighted path between two nodes"""
    if start == end:
        return ([start], 1.0)
    
    if start not in graph:
        return None
    
    queue = [(0, [start], 1.0)]
    visited = set()
    
    while queue:
        neg_weight, path, strength = heapq.heappop(queue)
        current = path[-1]
        
        if current in visited or len(path) > max_depth:
            continue
            
        visited.add(current)
        
        if current == end:
            return (path, strength)
        
        if current in graph:
            for neighbor, edge_weight in graph[current]:
                if neighbor not in visited:
                    new_path = path + [neighbor]
                    new_strength = strength * edge_weight
                    heapq.heappush(queue, (-new_strength, new_path, new_strength))
    
    return None


def get_connection_color(connection_type: str) -> str:
    colors = {
        "verbal_echo": "#FF6B6B",
        "thematic_parallel": "#4ECDC4",
        "structural_allusion": "#45B7D1",
        "direct_citation": "#96CEB4"
    }
    return colors.get(connection_type, "#95A5A6")


def get_node_color(node_type: str) -> str:
    colors = {
        "author": "#E74C3C",
        "work": "#3498DB",
        "passage": "#2ECC71"
    }
    return colors.get(node_type, "#95A5A6")


@router.get("/passage/{urn}", response_model=PassageConnections)
async def get_passage_connections(urn: str, request: Request, limit: int = Query(100, ge=1, le=500)) -> PassageConnections:
    """Find all intertextual connections for a passage"""
    try:
        if not hasattr(request.state, 'db_pool') or not request.state.db_pool:
            raise HTTPException(status_code=503, detail="Database pool not available")
        
        db_pool = request.state.db_pool
        
        async with db_pool.acquire() as connection:
            connections_query = """
            SELECT i.source_urn, i.target_urn, i.connection_type, i.similarity_score, i.evidence,
                   s1.author as source_author, s1.work as source_work,
                   s2.author as target_author, s2.work as target_work
            FROM intertexts i
            LEFT JOIN source_texts s1 ON i.source_urn = s1.urn
            LEFT JOIN source_texts s2 ON i.target_urn = s2.urn
            WHERE i.source_urn = $1 OR i.target_urn = $1
            ORDER BY i.similarity_score DESC
            LIMIT $2
            """
            
            connection_rows = await connection.fetch(connections_query, urn, limit)
            
            connections = []
            connection_summary = defaultdict(int)
            authors = defaultdict(int)
            works = defaultdict(int)
            
            for row in connection_rows:
                connection = IntertextualConnection(
                    source_urn=row['source_urn'],
                    target_urn=row['target_urn'],
                    connection_type=row['connection_type'],
                    similarity_score=row['similarity_score'] or 0.0,
                    evidence=row['evidence'],
                    source_author=row['source_author'],
                    target_author=row['target_author'],
                    source_work=row['source_work'],
                    target_work=row['target_work']
                )
                connections.append(connection)
                connection_summary[row['connection_type']] += 1
                
                if row['source_urn'] != urn:
                    if row['source_author']:
                        authors[row['source_author']] += 1
                    if row['source_work']:
                        works[row['source_work']] += 1
                else:
                    if row['target_author']:
                        authors[row['target_author']] += 1
                    if row['target_work']:
                        works[row['target_work']] += 1
            
            most_connected_authors = [a for a, _ in sorted(authors.items(), key=lambda x: x[1], reverse=True)[:10]]
            most_connected_works = [w for w, _ in sorted(works.items(), key=lambda x: x[1], reverse=True)[:10]]
            
            return PassageConnections(
                passage_urn=urn,
                total_connections=len(connections),
                connections=connections,
                connection_summary=dict(connection_summary),
                most_connected_authors=most_connected_authors,
                most_connected_works=most_connected_works
            )
            
    except asyncpg.PostgresError as e:
        logger.error(f"Database error in get_passage_connections: {e}")
        raise HTTPException(status_code=503, detail="Database query failed")
    except Exception as e:
        logger.error(f"Unexpected error in get_passage_connections: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/author/{author}", response_model=AuthorNetwork)
async def get_author_network(author: str, request: Request) -> AuthorNetwork:
    """Get author's influence network"""
    try:
        if not hasattr(request.state, 'db_pool') or not request.state.db_pool:
            raise HTTPException(status_code=503, detail="Database pool not available")
        
        db_pool = request.state.db_pool
        
        async with db_pool.acquire() as connection:
            network_query = """
            SELECT i.source_urn, i.target_urn, i.connection_type, i.similarity_score, i.evidence,
                   s1.author as source_author, s1.work as source_work,
                   s2.author as target_author, s2.work as target_work
            FROM intertexts i
            LEFT JOIN source_texts s1 ON i.source_urn = s1.urn
            LEFT JOIN source_texts s2 ON i.target_urn = s2.urn
            WHERE s1.author = $1 OR s2.author = $1
            ORDER BY i.similarity_score DESC
            """
            
            network_rows = await connection.fetch(network_query, author)
            
            if not network_rows:
                raise HTTPException(status_code=404, detail=f"Author '{author}' not found in network")
            
            connections = []
            influences = set()
            influenced_by = set()
            connection_types = defaultdict(int)
            
            for row in network_rows:
                connection = IntertextualConnection(
                    source_urn=row['source_urn'],
                    target_urn=row['target_urn'],
                    connection_type=row['connection_type'],
                    similarity_score=row['similarity_score'] or 0.0,
                    evidence=row['evidence'],
                    source_author=row['source_author'],
                    target_author=row['target_author'],
                    source_work=row['source_work'],
                    target_work=row['target_work']
                )
                connections.append(connection)
                connection_types[row['connection_type']] += 1
                
                if row['source_author'] == author and row['target_author'] != author:
                    influences.add(row['target_author'])
                elif row['target_author'] == author and row['source_author'] != author:
                    influenced_by.add(row['source_author'])
            
            influence_score = min(1.0, len(connections) / 100.0) if connections else 0.0
            
            network_data = AuthorInfluence(
                author=author,
                influence_score=influence_score,
                influenced_by_count=len(influenced_by),
                influences_count=len(influences),
                top_influences=list(influences)[:10],
                top_influenced=list(influenced_by)[:10],
                total_connections=len(connections),
                connection_types=dict(connection_types)
            )
            
            network_metrics = {
                "centrality": influence_score,
                "in_degree": len(influenced_by),
                "out_degree": len(influences),
                "clustering_coefficient": 0.5  # Placeholder