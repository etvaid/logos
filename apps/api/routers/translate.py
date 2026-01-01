"""
TRANSLATE ROUTER
================
Provides AI-powered translation with 4 distinct styles.
Uses Claude API for high-quality translations.
"""
from fastapi import APIRouter, Request, HTTPException
from typing import Dict, Any, Optional
from pydantic import BaseModel
import httpx
import os

router = APIRouter()

# Translation styles with detailed prompts
STYLES = [
    {
        "id": "literal",
        "name": "Literal",
        "description": "Word-for-word accuracy, preserving original structure and order as much as possible in English",
        "prompt_modifier": "Provide a strictly literal translation. Preserve word order and grammatical structure where possible. Prioritize accuracy over elegance. Include bracketed words [like this] where English requires words not in the original."
    },
    {
        "id": "literary",
        "name": "Literary",
        "description": "Elegant, flowing English that reads naturally while remaining faithful to the meaning",
        "prompt_modifier": "Provide an elegant, literary translation. Prioritize natural English flow and readability. Capture the tone and style of the original. This should read as fine English prose or poetry."
    },
    {
        "id": "student",
        "name": "Student",
        "description": "Clear translation with learning aids, vocabulary notes, and grammatical explanations",
        "prompt_modifier": "Provide a clear translation suitable for students learning the language. After the translation, include: 1) Key vocabulary with definitions, 2) Notable grammatical constructions explained, 3) Any cultural context needed."
    },
    {
        "id": "scholarly",
        "name": "Scholarly",
        "description": "Academic precision with attention to nuance, alternative readings, and critical apparatus",
        "prompt_modifier": "Provide a precise scholarly translation. Include: 1) The translation with attention to textual nuances, 2) Alternative translations for ambiguous words in {brackets}, 3) Brief notes on any textual variants or scholarly debates about interpretation."
    },
]

class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "greek"
    target_lang: str = "english"
    style: str = "literary"

@router.get("/styles")
async def get_styles() -> Dict[str, Any]:
    """Get available translation styles"""
    return {"styles": STYLES}

@router.post("/")
async def translate(request: Request, data: TranslateRequest) -> Dict[str, Any]:
    """
    Translate text using Claude API with specified style.
    
    Supports Greek, Latin, Hebrew, Aramaic to English.
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    
    # Get style configuration
    style_config = next((s for s in STYLES if s["id"] == data.style), STYLES[1])
    
    if not api_key:
        # Return helpful error with mock translation for testing
        return {
            "source": data.text,
            "translation": f"[API key required for translation. Text: {data.text[:100]}...]",
            "source_lang": data.source_lang,
            "target_lang": data.target_lang,
            "style": data.style,
            "style_name": style_config["name"],
            "note": "Set ANTHROPIC_API_KEY environment variable for real translations"
        }
    
    # Build the translation prompt
    language_names = {
        "greek": "Ancient Greek",
        "latin": "Latin", 
        "hebrew": "Biblical Hebrew",
        "aramaic": "Aramaic"
    }
    
    source_name = language_names.get(data.source_lang, data.source_lang.title())
    
    prompt = f"""You are an expert translator of {source_name} with deep knowledge of classical literature, grammar, and cultural context.

Translate the following {source_name} text to {data.target_lang.title()}.

{style_config["prompt_modifier"]}

TEXT TO TRANSLATE:
{data.text}

TRANSLATION:"""

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
                    "max_tokens": 2048,
                    "messages": [{"role": "user", "content": prompt}]
                },
                timeout=60.0
            )
            
            if response.status_code != 200:
                return {
                    "source": data.text,
                    "translation": f"API error: {response.status_code}",
                    "error": response.text
                }
            
            result = response.json()
            translation = result.get("content", [{}])[0].get("text", "Translation failed")
            
            return {
                "source": data.text,
                "translation": translation,
                "source_lang": data.source_lang,
                "target_lang": data.target_lang,
                "style": data.style,
                "style_name": style_config["name"],
                "model": "claude-sonnet-4-20250514"
            }
    except httpx.TimeoutException:
        return {"source": data.text, "translation": "Request timed out", "error": "timeout"}
    except Exception as e:
        return {"source": data.text, "translation": f"Error: {str(e)}", "error": str(e)}

@router.get("/")
async def root() -> Dict[str, Any]:
    """Translate router status"""
    return {
        "status": "ready",
        "description": "TRANSLATE - AI-powered translation with 4 styles",
        "styles_available": len(STYLES),
        "supported_languages": ["greek", "latin", "hebrew", "aramaic"]
    }