from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from collections import deque

router = APIRouter()

class Person(BaseModel):
    id: str
    name: str
    title: str
    birth_year: int
    death_year: Optional[int]
    description: str

class Connection(BaseModel):
    person_id: str
    relationship: str
    strength: int  # 1-10 scale

class PersonWithConnections(BaseModel):
    person: Person
    connections: List[Connection]

class NetworkNode(BaseModel):
    person: Person
    connections: List[str]  # List of connected person IDs

class SocialNetwork(BaseModel):
    center_person: Person
    nodes: List[NetworkNode]
    total_connections: int

class ConnectionPath(BaseModel):
    from_person: Person
    to_person: Person
    path: List[Person]
    degrees_of_separation: int

# Demo data: Cicero's network
PEOPLE_DATA = {
    "cicero": Person(
        id="cicero",
        name="Marcus Tullius Cicero",
        title="Consul, Orator, Philosopher",
        birth_year=-106,
        death_year=-43,
        description="Greatest Roman orator and defender of the Republic"
    ),
    "caesar": Person(
        id="caesar",
        name="Gaius Julius Caesar",
        title="Dictator, General",
        birth_year=-100,
        death_year=-44,
        description="Military genius who crossed the Rubicon and ended the Republic"
    ),
    "pompey": Person(
        id="pompey",
        name="Gnaeus Pompeius Magnus",
        title="General, Triumvir",
        birth_year=-106,
        death_year=-48,
        description="Great general and political rival of Caesar"
    ),
    "crassus": Person(
        id="crassus",
        name="Marcus Licinius Crassus",
        title="General, Triumvir",
        birth_year=-115,
        death_year=-53,
        description="Richest man in Rome, member of First Triumvirate"
    ),
    "clodius": Person(
        id="clodius",
        name="Publius Clodius Pulcher",
        title="Tribune, Political Enemy",
        birth_year=-93,
        death_year=-52,
        description="Populist politician and fierce opponent of Cicero"
    ),
    "cato": Person(
        id="cato",
        name="Marcus Porcius Cato",
        title="Senator, Stoic Philosopher",
        birth_year=-95,
        death_year=-46,
        description="Staunch defender of Republican values and Stoic principles"
    ),
    "brutus": Person(
        id="brutus",
        name="Marcus Junius Brutus",
        title="Senator, Assassin",
        birth_year=-85,
        death_year=-42,
        description="Philosopher and leader of Caesar's assassination"
    ),
    "antony": Person(
        id="antony",
        name="Marcus Antonius",
        title="General, Triumvir",
        birth_year=-83,
        death_year=-30,
        description="Caesar's lieutenant and later enemy of Octavian"
    ),
    "atticus": Person(
        id="atticus",
        name="Titus Pomponius Atticus",
        title="Equestrian, Publisher",
        birth_year=-110,
        death_year=-32,
        description="Cicero's closest friend and correspondent"
    )
}

# Connection data with relationships
CONNECTIONS_DATA = {
    "cicero": [
        Connection(person_id="caesar", relationship="Political Rival", strength=6),
        Connection(person_id="pompey", relationship="Political Ally", strength=7),
        Connection(person_id="crassus", relationship="Acquaintance", strength=4),
        Connection(person_id="clodius", relationship="Bitter Enemy", strength=9),
        Connection(person_id="cato", relationship="Philosophical Ally", strength=8),
        Connection(person_id="brutus", relationship="Protégé", strength=8),
        Connection(person_id="antony", relationship="Enemy", strength=9),
        Connection(person_id="atticus", relationship="Best Friend", strength=10),
    ],
    "caesar": [
        Connection(person_id="cicero", relationship="Political Rival", strength=6),
        Connection(person_id="pompey", relationship="Ally turned Enemy", strength=8),
        Connection(person_id="crassus", relationship="Triumvirate Partner", strength=7),
        Connection(person_id="clodius", relationship="Political Tool", strength=5),
        Connection(person_id="cato", relationship="Opponent", strength=7),
        Connection(person_id="brutus", relationship="Protégé/Assassin", strength=10),
        Connection(person_id="antony", relationship="Lieutenant", strength=9),
    ],
    "pompey": [
        Connection(person_id="cicero", relationship="Political Ally", strength=7),
        Connection(person_id="caesar", relationship="Ally turned Enemy", strength=8),
        Connection(person_id="crassus", relationship="Triumvirate Partner", strength=6),
        Connection(person_id="cato", relationship="Late Ally", strength=6),
    ],
    "crassus": [
        Connection(person_id="cicero", relationship="Acquaintance", strength=4),
        Connection(person_id="caesar", relationship="Triumvirate Partner", strength=7),
        Connection(person_id="pompey", relationship="Triumvirate Partner", strength=6),
    ],
    "clodius": [
        Connection(person_id="cicero", relationship="Bitter Enemy", strength=9),
        Connection(person_id="caesar", relationship="Political Tool", strength=5),
    ],
    "cato": [
        Connection(person_id="cicero", relationship="Philosophical Ally", strength=8),
        Connection(person_id="caesar", relationship="Opponent", strength=7),
        Connection(person_id="pompey", relationship="Late Ally", strength=6),
        Connection(person_id="brutus", relationship="Philosophical Influence", strength=8),
    ],
    "brutus": [
        Connection(person_id="cicero", relationship="Mentor", strength=8),
        Connection(person_id="caesar", relationship="Father Figure/Victim", strength=10),
        Connection(person_id="cato", relationship="Philosophical Guide", strength=8),
    ],
    "antony": [
        Connection(person_id="cicero", relationship="Enemy", strength=9),
        Connection(person_id="caesar", relationship="Commander", strength=9),
    ],
    "atticus": [
        Connection(person_id="cicero", relationship="Best Friend", strength=10),
    ]
}

def build_network_graph():
    """Build adjacency list for pathfinding"""
    graph = {}
    for person_id in PEOPLE_DATA.keys():
        graph[person_id] = []
        if person_id in CONNECTIONS_DATA:
            for connection in CONNECTIONS_DATA[person_id]:
                graph[person_id].append(connection.person_id)
    return graph

def find_shortest_path(graph: Dict, start: str, end: str) -> List[str]:
    """Find shortest path using BFS"""
    if start == end:
        return [start]
    
    queue = deque([(start, [start])])
    visited = {start}
    
    while queue:
        current, path = queue.popleft()
        
        for neighbor in graph.get(current, []):
            if neighbor == end:
                return path + [neighbor]
            
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    
    return []

@router.get("/person/{person_id}", response_model=PersonWithConnections)
async def get_person_with_connections(person_id: str):
    """Get a person with their social connections"""
    if person_id not in PEOPLE_DATA:
        raise HTTPException(status_code=404, detail="Person not found in Antiqua network")
    
    person = PEOPLE_DATA[person_id]
    connections = CONNECTIONS_DATA.get(person_id, [])
    
    return PersonWithConnections(
        person=person,
        connections=connections
    )

@router.get("/network/{center_id}", response_model=SocialNetwork)
async def get_social_network(center_id: str):
    """Get the full social network centered on a person"""
    if center_id not in PEOPLE_DATA:
        raise HTTPException(status_code=404, detail="Person not found in Antiqua network")
    
    center_person = PEOPLE_DATA[center_id]
    nodes = []
    total_connections = 0
    
    # Get all people connected to the center person
    connected_people = set([center_id])
    if center_id in CONNECTIONS_DATA:
        for connection in CONNECTIONS_DATA[center_id]:
            connected_people.add(connection.person_id)
    
    # Build network nodes
    for person_id in connected_people:
        person = PEOPLE_DATA[person_id]
        person_connections = []
        
        if person_id in CONNECTIONS_DATA:
            person_connections = [conn.person_id for conn in CONNECTIONS_DATA[person_id] 
                                if conn.person_id in connected_people]
            total_connections += len(person_connections)
        
        nodes.append(NetworkNode(
            person=person,
            connections=person_connections
        ))
    
    return SocialNetwork(
        center_person=center_person,
        nodes=nodes,
        total_connections=total_connections // 2  # Each connection counted twice
    )

@router.get("/path/{from_id}/{to_id}", response_model=ConnectionPath)
async def get_connection_path(from_id: str, to_id: str):
    """Find the connection path between two people"""
    if from_id not in PEOPLE_DATA:
        raise HTTPException(status_code=404, detail=f"Person '{from_id}' not found")
    if to_id not in PEOPLE_DATA:
        raise HTTPException(status_code=404, detail=f"Person '{to_id}' not found")
    
    graph = build_network_graph()
    path_ids = find_shortest_path(graph, from_id, to_id)
    
    if not path_ids:
        raise HTTPException(
            status_code=404, 
            detail=f"No connection path found between {from_id} and {to_id}"
        )
    
    path_people = [PEOPLE_DATA[person_id] for person_id in path_ids]
    
    return ConnectionPath(
        from_person=PEOPLE_DATA[from_id],
        to_person=PEOPLE_DATA[to_id],
        path=path_people,
        degrees_of_separation=len(path_ids) - 1
    )

# Bonus endpoint: Get all people in the network
@router.get("/people", response_model=List[Person])
async def get_all_people():
    """Get all people in the Antiqua social network"""
    return list(PEOPLE_DATA.values())

# Bonus endpoint: Network statistics
@router.get("/stats")
async def get_network_stats():
    """Get statistics about the social network"""
    total_people = len(PEOPLE_DATA)
    total_connections = sum(len(connections) for connections in CONNECTIONS_DATA.values())
    
    # Find most connected person
    most_connected = max(CONNECTIONS_DATA.items(), key=lambda x: len(x[1]))
    most_connected_person = PEOPLE_DATA[most_connected[0]]
    
    return {
        "total_people": total_people,
        "total_connections": total_connections // 2,  # Each connection counted twice
        "most_connected_person": {
            "name": most_connected_person.name,
            "connections": len(most_connected[1])
        },
        "network_density": round((total_connections / 2) / (total_people * (total_people - 1) / 2), 3),
        "era": "Late Roman Republic (106-30 BCE)"
    }