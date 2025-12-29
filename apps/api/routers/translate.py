from fastapi import APIRouter, Request
from typing import Dict, Any
from pydantic import BaseModel
import httpx
import os

router = APIRouter()

STYLES = [
    {"id": "literal", "name": "Literal", "description": "Word-for-word accuracy, preserving structure"},
    {"id": "literary", "name": "Literary", "description": "Elegant English, prioritizing readability"},
    {"id": "student", "name": "Student", "description": "Clear with learning aids and notes"},
    {"id": "scholarly", "name": "Scholarly", "description": "Academic precision with apparatus"},
]

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "greek"
    target_lang: str = "english"
    style: str = "literary"

@router.get("/styles")
async def get_styles() -> Dict[str, Any]:
    return {"styles": STYLES}

@router.post("/")
async def translate(request: Request, data: TranslateRequest) -> Dict[str, Any]:
    """Translate text using Claude API"""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    
    if not api_key:
        return {
            "source": data.text,
            "translation": "[Translation requires ANTHROPIC_API_KEY]",
            "style": data.style,
            "error": "API key not configured"
        }
    
    style_prompts = {
        "literal": "Provide a strictly literal translation, preserving word order and structure as much as possible.",
        "literary": "Provide an elegant, readable English translation that flows naturally while remaining accurate.",
        "student": "Provide a clear translation with brief explanatory notes for learners.",
        "scholarly": "Provide a precise academic translation with attention to nuance and alternative readings.",
    }
    
    prompt = f"""Translate this {data.source_lang} text to {data.target_lang}.

Style: {style_prompts.get(data.style, style_prompts['literary'])}

Text: {data.text}

Translation:"""

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                json={
                    "model": "claude-sonnet-4-20250514",
                    "max_tokens": 1024,
                    "messages": [{"role": "user", "content": prompt}]
                },
                timeout=30.0
            )
            
            result = response.json()
            translation = result.get("content", [{}])[0].get("text", "Translation failed")
            
            return {
                "source": data.text,
                "translation": translation,
                "source_lang": data.source_lang,
                "target_lang": data.target_lang,
                "style": data.style
            }
    except Exception as e:
        return {"source": data.text, "translation": f"Error: {str(e)}", "style": data.style}

@router.get("/")
async def root() -> Dict[str, Any]:
    return {"status": "ready", "description": "TRANSLATE - AI translation with 4 styles"}