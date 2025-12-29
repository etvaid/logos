from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field, validator
from typing import Dict, Any, Optional, List
import logging
from datetime import datetime
import os
from anthropic import Anthropic
import asyncio
import json
import re
from enum import Enum
import time

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Translation styles configuration
TRANSLATION_STYLES = {
    "literal": {
        "name": "Literal",
        "description": "Word-for-word translation with grammatical tags and annotations",
        "prompt_modifier": "Provide a word-for-word literal translation with grammatical annotations in brackets. Show morphological information where relevant.",
        "best_for": ["Linguistic analysis", "Grammar study", "Philological research"]
    },
    "literary": {
        "name": "Literary", 
        "description": "Elegant, flowing English that captures the beauty and style of the original",
        "prompt_modifier": "Provide an elegant, literary translation that captures the style, rhythm, and beauty of the original text while maintaining readability.",
        "best_for": ["Poetry", "Prose literature", "Public reading"]
    },
    "student": {
        "name": "Student",
        "description": "Clear translation with explanations and cultural context in brackets",
        "prompt_modifier": "Provide a clear translation suitable for students, with explanations of difficult concepts, cultural references, and grammatical constructions in brackets.",
        "best_for": ["Language learning", "First-time readers", "Educational contexts"]
    },
    "scholarly": {
        "name": "Scholarly",
        "description": "Academic precision with attention to nuance and technical terminology",
        "prompt_modifier": "Provide a precise, scholarly translation that preserves all nuances, technical terminology, and academic rigor of the original text.",
        "best_for": ["Academic research", "Critical editions", "Professional study"]
    }
}

# Historical translator voices
TRANSLATOR_VOICES = {
    "pope": {
        "name": "Alexander Pope",
        "period": "18th century (1688-1744)",
        "style": "Heroic couplets, elevated diction, neoclassical elegance",
        "famous_for": "Iliad and Odyssey translations in heroic couplets",
        "prompt_modifier": "Translate in the style of Alexander Pope: use elevated, formal diction with balanced, elegant phrasing reminiscent of 18th-century neoclassical poetry.",
        "characteristics": ["Heroic couplets", "Elevated diction", "Balanced phrases", "Classical allusions"]
    },
    "lattimore": {
        "name": "Richmond Lattimore", 
        "period": "20th century (1906-1984)",
        "style": "Literal accuracy with poetic sensitivity",
        "famous_for": "Homer, Greek tragedy, and lyric poetry translations",
        "prompt_modifier": "Translate in the style of Richmond Lattimore: maintain literal accuracy while preserving poetic rhythm and the natural cadence of speech.",
        "characteristics": ["Literal accuracy", "Poetic rhythm", "Natural speech patterns", "Scholarly precision"]
    },
    "fagles": {
        "name": "Robert Fagles",
        "period": "Late 20th century (1933-2008)",
        "style": "Modern, accessible, dramatic vigor",
        "famous_for": "Homer, Virgil, Aeschylus, and Sophocles translations",
        "prompt_modifier": "Translate in the style of Robert Fagles: use modern, vigorous English with dramatic flair and accessibility for contemporary readers.",
        "characteristics": ["Modern language", "Dramatic vigor", "Contemporary accessibility", "Dynamic phrasing"]
    },
    "wilson": {
        "name": "Emily Wilson",
        "period": "21st century (1971-present)",
        "style": "Fresh, clear, contemporary while respecting original meter",
        "famous_for": "First woman to translate Homer's Odyssey into English (2017)",
        "prompt_modifier": "Translate in the style of Emily Wilson: use clear, contemporary language that is both fresh and respectful of the original's structure and meaning.",
        "characteristics": ["Contemporary clarity", "Gender-conscious language", "Metrical awareness", "Fresh perspective"]
    }
}

# Supported languages
SUPPORTED_LANGUAGES = {
    "greek": "Ancient Greek",
    "latin": "Latin", 
    "english": "English",
    "hebrew": "Biblical Hebrew",
    "aramaic": "Aramaic"
}

# Pydantic Models
class TranslationStyle(str, Enum):
    literal = "literal"
    literary = "literary"
    student = "student" 
    scholarly = "scholarly"

class TranslatorVoice(str, Enum):
    pope = "pope"
    lattimore = "lattimore"
    fagles = "fagles"
    wilson = "wilson"

class TranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text to translate")
    source_lang: str = Field(..., description="Source language code")
    target_lang: str = Field("english", description="Target language code")
    style: TranslationStyle = Field(TranslationStyle.scholarly, description="Translation style")
    voice: Optional[TranslatorVoice] = Field(None, description="Historical translator voice (optional)")
    include_analysis: bool = Field(False, description="Include grammatical and contextual analysis")
    
    @validator('source_lang', 'target_lang')
    def validate_language(cls, v):
        if v.lower() not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported language: {v}. Supported: {list(SUPPORTED_LANGUAGES.keys())}")
        return v.lower()
    
    @validator('text')
    def validate_text_length(cls, v):
        if len(v.strip()) == 0:
            raise ValueError("Text cannot be empty")
        return v.strip()

class WordConfidence(BaseModel):
    word: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    alternatives: Optional[List[str]] = None
    grammatical_info: Optional[str] = None

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    source_language: str
    target_language: str
    style: str
    voice: Optional[str] = None
    overall_confidence: float = Field(..., ge=0.0, le=1.0)
    word_confidences: List[WordConfidence]
    analysis: Optional[Dict[str, Any]] = None
    metadata: Dict[str, Any]
    timestamp: str

class BulkTranslationItem(BaseModel):
    id: str = Field(..., description="Unique identifier for this text")
    text: str = Field(..., min_length=1, max_length=1000, description="Text to translate")
    source_lang: str
    target_lang: str = "english"
    style: TranslationStyle = TranslationStyle.scholarly
    
class BulkTranslationRequest(BaseModel):
    items: List[BulkTranslationItem] = Field(..., max_items=50, description="List of texts to translate")
    
    @validator('items')
    def validate_total_length(cls, v):
        total_chars = sum(len(item.text) for item in v)
        if total_chars > 5000:
            raise ValueError(f"Total text length ({total_chars}) exceeds 5000 characters")
        return v

class BulkTranslationResponse(BaseModel):
    results: List[TranslationResponse]
    total_processed: int
    total_characters: int
    processing_time_seconds: float
    timestamp: str

class StyleInfo(BaseModel):
    id: str
    name: str
    description: str
    example_prompt: str
    best_for: List[str]

class StylesResponse(BaseModel):
    styles: List[StyleInfo]
    default_style: str
    total_styles: int

class VoiceInfo(BaseModel):
    id: str
    name: str
    period: str
    style_description: str
    famous_for: str
    example_characteristics: List[str]

class VoicesResponse(BaseModel):
    voices: List[VoiceInfo]
    total_voices: int
    period_range: str


def get_claude_client() -> Anthropic:
    """Initialize Claude API client"""
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not configured")
    return Anthropic(api_key=api_key)


def build_translation_prompt(text: str, source_lang: str, target_lang: str, style: str, voice: Optional[str] = None, include_analysis: bool = False) -> str:
    """Build the prompt for Claude API translation"""
    source_lang_name = SUPPORTED_LANGUAGES.get(source_lang, source_lang)
    target_lang_name = SUPPORTED_LANGUAGES.get(target_lang, target_lang)
    
    base_prompt = f"""You are an expert classical scholar and translator specializing in {source_lang_name} texts. Please translate the following {source_lang_name} text into {target_lang_name}.

Text to translate:
{text}

"""
    
    # Add style modifier
    if style in TRANSLATION_STYLES:
        base_prompt += f"Translation approach: {TRANSLATION_STYLES[style]['prompt_modifier']}\n\n"
    
    # Add voice modifier if specified
    if voice and voice in TRANSLATOR_VOICES:
        base_prompt += f"Translator style: {TRANSLATOR_VOICES[voice]['prompt_modifier']}\n\n"
    
    # Add analysis request if needed
    if include_analysis:
        base_prompt += """Please also provide:
1. Grammatical analysis of difficult constructions
2. Cultural or historical context where relevant
3. Alternative translation possibilities for ambiguous passages
4. Commentary on stylistic features

"""
    
    base_prompt += """Please format your response as a JSON object with the following structure:
{
  "translation": "your translation here",
  "confidence": 0.95,
  "word_analysis": [
    {
      "word": "original word",
      "translation": "translated word", 
      "confidence": 0.9,
      "alternatives": ["alt1", "alt2"],
      "grammatical_info": "morphological/syntactic info"
    }
  ],
  "analysis": {
    "grammatical_notes": "analysis of grammar",
    "cultural_context": "historical/cultural notes",
    "style_notes": "observations about style",
    "translation_challenges": "difficult passages explained"
  }
}

Provide valid JSON only, no additional text."""
    
    return base_prompt


def calculate_word_confidences(text: str, claude_response: Dict[str, Any]) -> List[WordConfidence]:
    """Calculate word-level confidence scores from Claude response"""
    word_confidences = []
    
    # Try to extract word analysis from Claude response
    if 'word_analysis' in claude_response and isinstance(claude_response['word_analysis'], list):
        for word_data in claude_response['word_analysis']:
            if isinstance(word_data, dict):
                confidence = WordConfidence(
                    word=word_data.get('word', ''),
                    confidence=min(1.0, max(0.0, word_data.get('confidence', 0.8))),
                    alternatives=word_data.get('alternatives', []),
                    grammatical_info=word_data.get('grammatical_info')
                )
                word_confidences.append(confidence)
    
    # If no word analysis provided, create basic word-level confidences
    if not word_confidences:
        words = re.findall(r'\b\w+\b', text)
        base_confidence = claude_response.get('confidence', 0.8)
        
        for word in words[:20]:  # Limit to first 20 words for performance
            confidence = WordConfidence(
                word=word,
                confidence=max(0.6, base_confidence - 0.1),  # Slightly lower than overall
                alternatives=None,
                grammatical_info=None
            )
            word_confidences.append(confidence)
    
    return word_confidences


async def translate_with_claude(request: TranslationRequest) -> TranslationResponse:
    """Translate text using Claude API"""
    try:
        client = get_claude_client()
        
        prompt = build_translation_prompt(
            request.text,
            request.source_lang,
            request.target_lang, 
            request.style.value,
            request.voice.value if request.voice else None,
            request.include_analysis
        )
        
        # Call Claude API
        response = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=2000,
            temperature=0.3,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        # Parse Claude response
        content = response.content[0].text.strip()
        
        try:
            # Try to parse as JSON
            claude_data = json.loads(content)
        except json.JSONDecodeError:
            # Fallback: extract translation from text
            logger.warning(f"Failed to parse Claude response as JSON: {content[:100]}...")
            claude_data = {
                "translation": content,
                "confidence": 0.8,
                "word_analysis": [],
                "analysis": {"notes": "Basic translation provided - JSON parsing failed"}
            }
        
        # Calculate word confidences
        word_confidences = calculate_word_confidences(request.text, claude_data)
        
        # Calculate overall confidence
        overall_confidence = claude_data.get('confidence', 0.8)
        if word_confidences:
            avg_wor