from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/knowledge-graph", tags=["knowledge-graph"])

# Pydantic models
class Entity(BaseModel):
    id: str
    type: str  # person, place, work, event
    name: str
    description: str
    attributes: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class Connection(BaseModel):
    id: str
    from_entity: str
    to_entity: str
    relationship: str
    strength: float  # 0.0 to 1.0
    description: str

class ConnectionResponse(BaseModel):
    entity: Entity
    connections: List[Dict[str, Any]]

class QueryRequest(BaseModel):
    query: str
    limit: Optional[int] = 10
    entity_types: Optional[List[str]] = None

class QueryResponse(BaseModel):
    query: str
    results: List[Entity]
    connections: List[Connection]
    interpretation: str

# Demo data
DEMO_ENTITIES = {
    "homer": Entity(
        id="homer",
        type="person",
        name="Homer",
        description="Ancient Greek epic poet, traditionally said to be the author of the Iliad and the Odyssey",
        attributes={
            "period": "8th century BC",
            "birthplace": "Unknown (possibly Ionia)",
            "occupation": "Epic poet",
            "notable_works": ["Iliad", "Odyssey"],
            "historical_status": "Legendary/Historical"
        },
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    "virgil": Entity(
        id="virgil",
        type="person", 
        name="Virgil",
        description="Roman poet of the Augustan period, author of the Aeneid",
        attributes={
            "period": "70-19 BC",
            "birthplace": "Andes, near Mantua",
            "occupation": "Poet",
            "notable_works": ["Aeneid", "Georgics", "Eclogues"],
            "patron": "Augustus Caesar"
        },
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    "augustine": Entity(
        id="augustine",
        type="person",
        name="Augustine of Hippo",
        description="Theologian, philosopher, and bishop in Roman Africa",
        attributes={
            "period": "354-430 AD",
            "birthplace": "Thagaste, Numidia",
            "occupation": "Bishop, theologian, philosopher",
            "notable_works": ["Confessions", "City of God", "On Christian Doctrine"],
            "sainthood": "Saint in Catholic Church"
        },
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    "iliad": Entity(
        id="iliad",
        type="work",
        name="The Iliad",
        description="Ancient Greek epic poem attributed to Homer",
        attributes={
            "author": "Homer",
            "genre": "Epic poetry",
            "subject": "Trojan War",
            "composition_date": "8th century BC",
            "language": "Ancient Greek"
        },
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    "aeneid": Entity(
        id="aeneid",
        type="work", 
        name="The Aeneid",
        description="Latin epic poem written by Virgil",
        attributes={
            "author": "Virgil",
            "genre": "Epic poetry",
            "subject": "Founding of Rome",
            "composition_date": "29-19 BC",
            "language": "Latin"
        },
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    "troy": Entity(
        id="troy",
        type="place",
        name="Troy",
        description="Ancient city in Asia Minor, setting of the Trojan War",
        attributes={
            "location": "Modern-day Turkey",
            "historical_period": "Bronze Age",
            "significance": "Setting of Iliad",
            "archaeological_site": "Hisarlik"
        },
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
}

DEMO_CONNECTIONS = [
    Connection(
        id="homer-iliad",
        from_entity="homer",
        to_entity="iliad", 
        relationship="authored",
        strength=1.0,
        description="Homer is traditionally credited as the author of the Iliad"
    ),
    Connection(
        id="virgil-aeneid",
        from_entity="virgil",
        to_entity="aeneid",
        relationship="authored", 
        strength=1.0,
        description="Virgil wrote the Aeneid"
    ),
    Connection(
        id="virgil-homer",
        from_entity="virgil",
        to_entity="homer",
        relationship="influenced_by",
        strength=0.9,
        description="Virgil was heavily influenced by Homer's epic poetry"
    ),
    Connection(
        id="iliad-troy",
        from_entity="iliad",
        to_entity="troy",
        relationship="set_in",
        strength=1.0,
        description="The Iliad is set during the siege of Troy"
    ),
    Connection(
        id="aeneid-troy",
        from_entity="aeneid", 
        to_entity="troy",
        relationship="references",
        strength=0.8,
        description="The Aeneid begins with the fall of Troy"
    ),
    Connection(
        id="augustine-virgil",
        from_entity="augustine",
        to_entity="virgil",
        relationship="references",
        strength=0.7,
        description="Augustine references Virgil in his theological works"
    )
]

@router.get("/entity/{entity_type}/{entity_id}", response_model=Entity)
async def get_entity(entity_type: str, entity_id: str):
    """Get a specific entity by type and ID"""
    entity = DEMO_ENTITIES.get(entity_id.lower())
    
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    
    if entity.type != entity_type:
        raise HTTPException(status_code=400, detail=f"Entity {entity_id} is not of type {entity_type}")
    
    return entity

@router.get("/connections/{entity_id}", response_model=ConnectionResponse)
async def get_connections(entity_id: str, relationship_type: Optional[str] = None):
    """Get all connections for a specific entity"""
    entity = DEMO_ENTITIES.get(entity_id.lower())
    
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    
    # Find all connections for this entity
    connections = []
    for conn in DEMO_CONNECTIONS:
        if conn.from_entity == entity_id or conn.to_entity == entity_id:
            if relationship_type is None or conn.relationship == relationship_type:
                # Get the connected entity
                connected_entity_id = conn.to_entity if conn.from_entity == entity_id else conn.from_entity
                connected_entity = DEMO_ENTITIES.get(connected_entity_id)
                
                if connected_entity:
                    connections.append({
                        "entity": connected_entity,
                        "relationship": conn.relationship,
                        "strength": conn.strength,
                        "description": conn.description,
                        "direction": "outgoing" if conn.from_entity == entity_id else "incoming"
                    })
    
    return ConnectionResponse(entity=entity, connections=connections)

@router.post("/query", response_model=QueryResponse)
async def query_knowledge_graph(query_request: QueryRequest):
    """Query the knowledge graph using natural language"""
    query = query_request.query.lower()
    results = []
    connections = []
    
    # Simple keyword matching for demo
    for entity in DEMO_ENTITIES.values():
        if (query in entity.name.lower() or 
            query in entity.description.lower() or
            any(query in str(v).lower() for v in entity.attributes.values())):
            
            if query_request.entity_types is None or entity.type in query_request.entity_types:
                results.append(entity)
                
                # Add relevant connections
                for conn in DEMO_CONNECTIONS:
                    if conn.from_entity == entity.id or conn.to_entity == entity.id:
                        connections.append(conn)
    
    # Limit results
    results = results[:query_request.limit]
    
    interpretation = f"Found {len(results)} entities matching '{query_request.query}'"
    
    return QueryResponse(
        query=query_request.query,
        results=results,
        connections=connections,
        interpretation=interpretation
    )

@router.get("/entities", response_model=List[Entity])
async def list_entities(entity_type: Optional[str] = None, limit: Optional[int] = 10):
    """List all entities, optionally filtered by type"""
    entities = list(DEMO_ENTITIES.values())
    
    if entity_type:
        entities = [e for e in entities if e.type == entity_type]
    
    return entities[:limit]

@router.get("/entity-types", response_model=List[str])
async def get_entity_types():
    """Get all available entity types"""
    types = set(entity.type for entity in DEMO_ENTITIES.values())
    return list(types)