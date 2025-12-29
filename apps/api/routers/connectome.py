from fastapi import APIRouter

router = APIRouter()

@router.get("/passage/{urn}")
async def get_connections(urn: str):
    return {"urn": urn, "connections": []}

@router.get("/network")
async def get_network():
    return {"nodes": [], "edges": []}

@router.get("/influence")
async def get_influence():
    return {"authors": []}
