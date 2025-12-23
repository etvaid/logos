from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime
import uuid

router = APIRouter()

class TranslationRequest(BaseModel):
    text: str
    source_language: str
    target_language: str
    context: Optional[str] = None

class TranslationResponse(BaseModel):
    id: str
    original_text: str
    translated_text: str
    source_language: str
    target_language: str
    confidence_score: float
    timestamp: datetime
    context_applied: Optional[str] = None

class LanguageInfo(BaseModel):
    code: str
    name: str
    family: str
    script: str
    direction: str
    active: bool

class QualityAnalysis(BaseModel):
    translation_id: str
    overall_score: float
    linguistic_accuracy: float
    contextual_relevance: float
    grammatical_correctness: float
    semantic_preservation: float
    issues: List[str]
    suggestions: List[str]

# Supported languages database
SUPPORTED_LANGUAGES = {
    "grc": LanguageInfo(
        code="grc",
        name="Ancient Greek",
        family="Indo-European",
        script="Greek",
        direction="ltr",
        active=True
    ),
    "lat": LanguageInfo(
        code="lat",
        name="Latin",
        family="Indo-European",
        script="Latin",
        direction="ltr",
        active=True
    ),
    "heb": LanguageInfo(
        code="heb",
        name="Biblical Hebrew",
        family="Semitic",
        script="Hebrew",
        direction="rtl",
        active=True
    ),
    "syc": LanguageInfo(
        code="syc",
        name="Classical Syriac",
        family="Semitic",
        script="Syriac",
        direction="rtl",
        active=True
    ),
    "cop": LanguageInfo(
        code="cop",
        name="Coptic",
        family="Afroasiatic",
        script="Coptic",
        direction="ltr",
        active=True
    )
}

# In-memory storage for translations and quality analyses
translations_db: Dict[str, TranslationResponse] = {}
quality_analyses_db: Dict[str, QualityAnalysis] = {}

def babel_translate(text: str, source: str, target: str, context: Optional[str] = None) -> tuple:
    """Simulate universal translation between classical languages"""
    
    # Mock translation logic with context awareness
    translation_map = {
        ("grc", "lat"): f"[Latin] {text}",
        ("lat", "grc"): f"[Greek] {text}",
        ("heb", "grc"): f"[Greek from Hebrew] {text}",
        ("grc", "heb"): f"[Hebrew from Greek] {text}",
        ("syc", "lat"): f"[Latin from Syriac] {text}",
        ("lat", "syc"): f"[Syriac from Latin] {text}",
        ("cop", "grc"): f"[Greek from Coptic] {text}",
        ("grc", "cop"): f"[Coptic from Greek] {text}",
        ("heb", "lat"): f"[Latin from Hebrew] {text}",
        ("lat", "heb"): f"[Hebrew from Latin] {text}",
        ("syc", "grc"): f"[Greek from Syriac] {text}",
        ("grc", "syc"): f"[Syriac from Greek] {text}",
        ("cop", "lat"): f"[Latin from Coptic] {text}",
        ("lat", "cop"): f"[Coptic from Latin] {text}",
        ("heb", "syc"): f"[Syriac from Hebrew] {text}",
        ("syc", "heb"): f"[Hebrew from Syriac] {text}",
        ("cop", "heb"): f"[Hebrew from Coptic] {text}",
        ("heb", "cop"): f"[Coptic from Hebrew] {text}",
        ("cop", "syc"): f"[Syriac from Coptic] {text}",
        ("syc", "cop"): f"[Coptic from Syriac] {text}"
    }
    
    key = (source, target)
    if key not in translation_map:
        return None, 0.0
    
    translated = translation_map[key]
    
    # Apply context if provided
    if context:
        translated = f"{translated} [Context: {context}]"
        confidence = 0.92
    else:
        confidence = 0.85
    
    return translated, confidence

def analyze_translation_quality(translation: TranslationResponse) -> QualityAnalysis:
    """Analyze the quality of a translation"""
    
    # Mock quality analysis
    base_score = translation.confidence_score
    
    # Adjust scores based on language pair difficulty
    difficult_pairs = [("heb", "grc"), ("syc", "lat"), ("cop", "heb")]
    pair = (translation.source_language, translation.target_language)
    
    if pair in difficult_pairs:
        linguistic_accuracy = base_score - 0.1
        contextual_relevance = base_score - 0.05
    else:
        linguistic_accuracy = base_score
        contextual_relevance = base_score + 0.02
    
    grammatical_correctness = base_score + 0.01
    semantic_preservation = base_score - 0.03
    
    overall_score = (linguistic_accuracy + contextual_relevance + 
                    grammatical_correctness + semantic_preservation) / 4
    
    # Generate issues and suggestions
    issues = []
    suggestions = []
    
    if overall_score < 0.8:
        issues.append("Low confidence in grammatical structure")
        suggestions.append("Consider providing more context")
    
    if translation.context_applied is None:
        issues.append("No contextual information provided")
        suggestions.append("Add historical or literary context")
    
    if pair in difficult_pairs:
        issues.append("Complex language pair with limited parallel texts")
        suggestions.append("Cross-reference with multiple sources")
    
    return QualityAnalysis(
        translation_id=translation.id,
        overall_score=round(overall_score, 3),
        linguistic_accuracy=round(linguistic_accuracy, 3),
        contextual_relevance=round(contextual_relevance, 3),
        grammatical_correctness=round(grammatical_correctness, 3),
        semantic_preservation=round(semantic_preservation, 3),
        issues=issues,
        suggestions=suggestions
    )

@router.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    """Universal translation between classical languages"""
    
    # Validate languages
    if request.source_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail=f"Unsupported source language: {request.source_language}")
    
    if request.target_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail=f"Unsupported target language: {request.target_language}")
    
    if request.source_language == request.target_language:
        raise HTTPException(status_code=400, detail="Source and target languages cannot be the same")
    
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    # Perform translation
    translated_text, confidence = babel_translate(
        request.text, 
        request.source_language, 
        request.target_language,
        request.context
    )
    
    if translated_text is None:
        raise HTTPException(status_code=500, detail="Translation failed")
    
    # Create response
    translation_id = str(uuid.uuid4())
    translation = TranslationResponse(
        id=translation_id,
        original_text=request.text,
        translated_text=translated_text,
        source_language=request.source_language,
        target_language=request.target_language,
        confidence_score=confidence,
        timestamp=datetime.utcnow(),
        context_applied=request.context
    )
    
    # Store translation
    translations_db[translation_id] = translation
    
    # Generate quality analysis
    quality_analysis = analyze_translation_quality(translation)
    quality_analyses_db[translation_id] = quality_analysis
    
    return translation

@router.get("/languages", response_model=Dict[str, LanguageInfo])
async def get_supported_languages():
    """Get all supported classical languages"""
    return SUPPORTED_LANGUAGES

@router.get("/quality/{translation_id}", response_model=QualityAnalysis)
async def get_translation_quality(translation_id: str):
    """Get quality analysis for a specific translation"""
    
    if translation_id not in quality_analyses_db:
        raise HTTPException(status_code=404, detail="Translation quality analysis not found")
    
    return quality_analyses_db[translation_id]