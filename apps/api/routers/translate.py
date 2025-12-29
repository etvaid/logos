from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "greek"
    target_lang: str = "english"
    style: str = "literal"

@router.post("/")
async def translate(req: TranslateRequest):
    return {"original": req.text, "translation": "", "style": req.style, "status": "pending"}

@router.get("/styles")
async def get_styles():
    return {"styles": ["literal", "literary", "student", "scholarly"]}
