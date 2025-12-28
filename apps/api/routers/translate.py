from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "greek"
    style: str = "literal"

@router.post("/")
async def translate(request: TranslateRequest):
    return {"original": request.text, "translation": "", "status": "coming_soon", "message": "Translation endpoint in development"}

@router.get("/styles")
async def get_styles():
    return {"styles": ["literal", "literary", "student"]}
