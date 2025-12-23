from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os

router = APIRouter()

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "greek"
    style: str = "literal"

class TranslateResponse(BaseModel):
    original: str
    translation: str
    source_lang: str
    style: str

@router.post("")
async def translate_text(request: TranslateRequest):
    style_prompts = {
        "literal": "Translate word-for-word, preserving original structure",
        "literary": "Translate for literary beauty and flow",
        "student": "Translate clearly for students learning the language"
    }
    
    prompt = f"""Translate this {request.source_lang} text to English.
Style: {style_prompts.get(request.style, style_prompts['literal'])}

Text: {request.text}

Provide only the translation, no explanation."""

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": os.getenv("ANTHROPIC_API_KEY", ""),
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                json={
                    "model": "claude-sonnet-4-20250514",
                    "max_tokens": 2048,
                    "messages": [{"role": "user", "content": prompt}]
                },
                timeout=60.0
            )
            
            if response.status_code == 200:
                data = response.json()
                translation = data["content"][0]["text"]
                return TranslateResponse(
                    original=request.text,
                    translation=translation,
                    source_lang=request.source_lang,
                    style=request.style
                )
            else:
                raise HTTPException(status_code=500, detail=f"API error: {response.text}")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
