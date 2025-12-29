from fastapi import APIRouter, Query

router = APIRouter()

@router.get("/text")
async def search_text(q: str, limit: int = 20):
    return {"query": q, "results": [], "total": 0}

@router.get("/semantic")
async def search_semantic(q: str, limit: int = 20):
    return {"query": q, "results": [], "total": 0}
