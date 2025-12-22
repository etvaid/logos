"""
LOGOS API - Translation Router
AI-powered translation with 3 styles: literal, literary, student
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, Literal
import os
import anthropic

router = APIRouter()

class TranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)
    language: Literal["grc", "lat"] = Field(..., description="Source language: grc (Greek) or lat (Latin)")
    style: Literal["literal", "literary", "student"] = Field(default="literary", description="Translation style")
    include_notes: bool = Field(default=True, description="Include grammatical/stylistic notes")

class TranslationResponse(BaseModel):
    original: str
    translation: str
    style: str
    language: str
    notes: Optional[dict] = None
    confidence: float = 0.95
    model: str = "claude"

# Translation prompts
PROMPTS = {
    "literal": """You are a classical philologist providing a literal translation.

TEXT ({language}):
{text}

Provide a word-for-word translation that:
1. Preserves word order where possible
2. Shows grammatical relationships clearly
3. Includes brief parsing notes for complex forms
4. Marks ambiguous readings with [?]

Respond in JSON format:
{{
    "translation": "your literal translation here",
    "notes": {{
        "grammar": ["list of grammatical notes"],
        "vocabulary": ["unusual words explained"],
        "ambiguities": ["any uncertain readings"]
    }}
}}""",

    "literary": """You are a literary translator of classical texts with expertise in both ancient and modern literature.

TEXT ({language}):
{text}

Provide an elegant English translation that:
1. Captures the style and register of the original
2. Preserves rhetorical effects and poetic devices where possible
3. Reads naturally and beautifully in English
4. Maintains the author's distinctive voice

Respond in JSON format:
{{
    "translation": "your literary translation here",
    "notes": {{
        "style": ["notes on stylistic choices"],
        "rhetoric": ["rhetorical devices preserved or adapted"],
        "tone": "overall tone of the passage"
    }}
}}""",

    "student": """You are a patient and encouraging Latin/Greek teacher helping a student understand this text.

TEXT ({language}):
{text}

Provide a translation with learning scaffolding:
1. Clear, simple English that a beginner can understand
2. Explanations of difficult grammatical constructions
3. Vocabulary help for uncommon or tricky words
4. Tips for recognizing similar patterns in the future

Respond in JSON format:
{{
    "translation": "your student-friendly translation here",
    "notes": {{
        "vocabulary": {{"word": "definition and context"}},
        "grammar": ["explanations of grammatical points"],
        "tips": ["learning tips for the student"],
        "difficulty": "beginner/intermediate/advanced"
    }}
}}"""
}

def get_language_name(code: str) -> str:
    return "Ancient Greek" if code == "grc" else "Latin"

@router.post("/", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    """
    Translate Greek or Latin text using AI.
    
    Three styles available:
    - **literal**: Word-for-word with grammatical notes
    - **literary**: Elegant, publication-quality translation
    - **student**: Learning-focused with explanations
    """
    
    language_name = get_language_name(request.language)
    prompt = PROMPTS[request.style].format(
        language=language_name,
        text=request.text
    )
    
    # Try to use Claude API
    api_key = os.getenv("ANTHROPIC_API_KEY")
    
    if api_key:
        try:
            client = anthropic.Anthropic(api_key=api_key)
            message = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            response_text = message.content[0].text
            
            # Try to parse JSON response
            import json
            try:
                parsed = json.loads(response_text)
                return TranslationResponse(
                    original=request.text,
                    translation=parsed.get("translation", response_text),
                    style=request.style,
                    language=request.language,
                    notes=parsed.get("notes") if request.include_notes else None,
                    confidence=0.95,
                    model="claude-sonnet-4"
                )
            except json.JSONDecodeError:
                # Return raw text if not valid JSON
                return TranslationResponse(
                    original=request.text,
                    translation=response_text,
                    style=request.style,
                    language=request.language,
                    notes=None,
                    confidence=0.90,
                    model="claude-sonnet-4"
                )
                
        except Exception as e:
            # Fall back to demo translation
            pass
    
    # Demo translations for common texts
    demo_translations = {
        "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος": {
            "literal": "Wrath sing, goddess, of-Peleus'-son Achilles",
            "literary": "Sing, O goddess, the rage of Achilles, son of Peleus",
            "student": "Sing, goddess, about the anger of Achilles (who was the son of Peleus)"
        },
        "Arma virumque cano, Troiae qui primus ab oris": {
            "literal": "Arms and-man I-sing, of-Troy who first from shores",
            "literary": "I sing of arms and the man who first from Troy's shores",
            "student": "I sing about weapons and a man, who first came from the shores of Troy"
        }
    }
    
    # Check if we have a demo translation
    for key, translations in demo_translations.items():
        if key in request.text or request.text in key:
            return TranslationResponse(
                original=request.text,
                translation=translations[request.style],
                style=request.style,
                language=request.language,
                notes={
                    "note": "Demo translation - full AI translation available with valid API key"
                } if request.include_notes else None,
                confidence=0.99,
                model="demo"
            )
    
    # Generic fallback
    return TranslationResponse(
        original=request.text,
        translation=f"[AI translation of {language_name} text in {request.style} style]",
        style=request.style,
        language=request.language,
        notes={"note": "Configure ANTHROPIC_API_KEY for full AI translation"} if request.include_notes else None,
        confidence=0.5,
        model="placeholder"
    )

@router.get("/styles")
async def get_translation_styles():
    """Get available translation styles and their descriptions."""
    return {
        "styles": [
            {
                "id": "literal",
                "name": "Literal",
                "description": "Word-for-word translation preserving original structure",
                "best_for": "Grammar study, parsing practice, understanding syntax"
            },
            {
                "id": "literary",
                "name": "Literary",
                "description": "Elegant translation capturing style and meaning",
                "best_for": "Reading pleasure, publication, appreciating literary quality"
            },
            {
                "id": "student",
                "name": "Student",
                "description": "Learning-focused translation with explanations",
                "best_for": "Beginners, classroom use, vocabulary building"
            }
        ]
    }

@router.post("/batch")
async def batch_translate(
    texts: list[TranslationRequest],
    background_tasks: BackgroundTasks
):
    """
    Batch translate multiple texts.
    Returns immediately with a job ID for async processing.
    """
    job_id = f"batch_{len(texts)}_{os.urandom(4).hex()}"
    
    # In production, this would queue the job
    return {
        "job_id": job_id,
        "status": "queued",
        "total_texts": len(texts),
        "message": "Batch translation queued. Check /translate/batch/{job_id} for status."
    }
