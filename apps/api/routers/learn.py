from fastapi import APIRouter

router = APIRouter()

@router.get("/modules")
async def list_modules():
    return {"modules": [], "total": 64}

@router.get("/module/{id}")
async def get_module(id: str):
    return {"id": id, "title": "", "lessons": []}

@router.get("/user/{id}/stats")
async def user_stats(id: str):
    return {"xp": 0, "level": "Novice", "streak": 0}
