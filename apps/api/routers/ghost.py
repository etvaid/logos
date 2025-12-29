from fastapi import APIRouter

router = APIRouter()

@router.get("/works")
async def list_lost_works():
    return {"works": []}

@router.get("/work/{id}")
async def get_lost_work(id: str):
    return {"id": id, "title": "", "fragments": []}
