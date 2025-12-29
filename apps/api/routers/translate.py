
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import httpx

router = APIRouter()

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "greek"
    target_lang: str = "english"
    style: str = "literal"

STYLES = {
    "literal": "Translate word-for-word, preserving original syntax",
    "literary": "Translate into flowing, elegant English prose",
    "student": "Include grammatical explanations in brackets",
    "scholarly": "Academic precision with technical terminology"
}

@router.post("/")
async def translate(req: TranslateRequest) -> Dict[str, Any]:
    """Translate text using Claude API"""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    
    if not api_key:
        return {
            "original": req.text,
            "translation": "",
            "style": req.style,
            "status": "api_key_not_configured",
            "message": "Set ANTHROPIC_API_KEY environment variable"
        }
    
    prompt = f"""Translate the following {req.source_lang} text to {req.target_lang}.
Style: {STYLES.get(req.style, STYLES['literal'])}

Text: {req.text}

Provide only the translation, no explanations."""

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
            
            if response.status_code == 200:
                data = response.json()
                translation = data["content"][0]["text"]
                return {
                    "original": req.text,
                    "translation": translation,
                    "style": req.style,
                    "source_lang": req.source_lang,
                    "target_lang": req.target_lang,
                    "status": "success"
                }
            else:
                return {
                    "original": req.text,
                    "translation": "",
                    "status": "api_error",
                    "error": response.text
                }
    except Exception as e:
        return {
            "original": req.text,
            "translation": "",
            "status": "error",
            "error": str(e)
        }

@router.get("/styles")
async def get_styles() -> Dict[str, Any]:
    """List available translation styles"""
    return {
        "styles": [
            {"id": "literal", "name": "Literal", "description": STYLES["literal"]},
            {"id": "literary", "name": "Literary", "description": STYLES["literary"]},
            {"id": "student", "name": "Student", "description": STYLES["student"]},
            {"id": "scholarly", "name": "Scholarly", "description": STYLES["scholarly"]}
        ]
    }

@router.get("/voices")
async def get_voices() -> Dict[str, Any]:
    """List historical translator voices"""
    return {
        "voices": [
            {"id": "pope", "name": "Alexander Pope", "era": "18th century", "style": "Heroic couplets"},
            {"id": "lattimore", "name": "Richmond Lattimore", "era": "20th century", "style": "Faithful rhythm"},
            {"id": "fagles", "name": "Robert Fagles", "era": "20th century", "style": "Dynamic equivalence"},
            {"id": "wilson", "name": "Emily Wilson", "era": "21st century", "style": "Clear, accessible"}
        ]
    }
