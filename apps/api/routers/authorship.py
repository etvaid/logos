from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AttributeRequest(BaseModel):
    text: str
    language: str = "greek"

@router.post("/attribute")
async def attribute(req: AttributeRequest):
    return {"candidates": [], "confidence": 0.0}

@router.get("/authors")
async def list_authors():
    return {"authors": [], "total": 0}

@router.get("/disputed")
async def disputed_texts():
    return {"texts": []}
