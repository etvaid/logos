from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random

router = APIRouter(prefix="/latin", tags=["latin-prediction"])

class PredictionRequest(BaseModel):
    text: str
    author: Optional[str] = None
    period: Optional[str] = "classical"  # classical, medieval, renaissance
    genre: Optional[str] = "epic"  # epic, lyric, prose, religious
    max_predictions: Optional[int] = 3
    context_length: Optional[int] = 50

class Prediction(BaseModel):
    text: str
    confidence: float
    explanation: str
    author_style_match: Optional[float] = None

class PredictionResponse(BaseModel):
    original_text: str
    predictions: List[Prediction]
    context_info: dict

# Mock Latin text database with patterns
LATIN_PATTERNS = {
    "epic": {
        "arma virumque": [
            ("cano, Troiae qui primus ab oris", 0.95, "Opening of Virgil's Aeneid"),
            ("cano, bellique ducis fortissima facta", 0.7, "Epic variant focusing on war deeds"),
            ("decanto, heroes magnos atque bella", 0.6, "Alternative epic opening structure")
        ],
        "aeneas": [
            ("pius et fortis, fata sequens", 0.85, "Emphasizing Aeneas's piety and fate"),
            ("dux Troianus, nova moenia quaerens", 0.8, "Focusing on leadership and city-founding"),
            ("heros magnanimis, patriam renovare", 0.7, "Heroic epithet with restoration theme")
        ]
    },
    "lyric": {
        "carpe": [
            ("diem, quam minimum credula postero", 0.9, "Horace's famous carpe diem passage"),
            ("flores, dum ver tenerum manet", 0.75, "Alternative carpe diem with spring imagery"),
            ("momentum, fugit hora brevis", 0.65, "Variant emphasizing fleeting time")
        ],
        "amor": [
            ("vincit omnia, et nos cedamus amori", 0.85, "Virgil's 'love conquers all'"),
            ("dulcis et amarus, cor meum vulnerat", 0.7, "Bittersweet love theme"),
            ("caecus facit, ratio fugit mente", 0.6, "Love as blinding force")
        ]
    },
    "prose": {
        "gallia": [
            ("est omnis divisa in partes tres", 0.95, "Caesar's Gallic Wars opening"),
            ("magna et libera olim fuit", 0.7, "Historical description variant"),
            ("rebellis semper, pacem non amat", 0.6, "Alternative characterization")
        ],
        "senatus": [
            ("populusque Romanus, imperium tenet", 0.8, "SPQR formula completion"),
            ("consultum facit, lex nova promulgatur", 0.75, "Senate decree context"),
            ("gravis et sapiens, rem publicam regit", 0.7, "Senate characterization")
        ]
    }
}

AUTHOR_STYLES = {
    "virgil": {
        "characteristics": ["epic similes", "golden line structure", "caesura patterns"],
        "vocabulary_preference": 0.9,
        "meter_weight": 0.85
    },
    "ovid": {
        "characteristics": ["mythological themes", "transformation motifs", "wit"],
        "vocabulary_preference": 0.8,
        "meter_weight": 0.75
    },
    "cicero": {
        "characteristics": ["periodic sentences", "rhetorical questions", "abstract concepts"],
        "vocabulary_preference": 0.85,
        "meter_weight": 0.1
    },
    "horace": {
        "characteristics": ["philosophical themes", "irony", "balanced expressions"],
        "vocabulary_preference": 0.8,
        "meter_weight": 0.9
    }
}

PERIOD_ADJUSTMENTS = {
    "classical": {"confidence_boost": 1.0, "vocabulary_purity": 0.95},
    "medieval": {"confidence_boost": 0.8, "vocabulary_purity": 0.7},
    "renaissance": {"confidence_boost": 0.85, "vocabulary_purity": 0.8}
}

def normalize_text(text: str) -> str:
    """Normalize Latin text for pattern matching"""
    return text.lower().strip().replace("v", "u").replace("j", "i")

def find_matching_patterns(text: str, genre: str) -> List[tuple]:
    """Find patterns that match the input text"""
    normalized = normalize_text(text)
    matches = []
    
    if genre in LATIN_PATTERNS:
        for pattern, completions in LATIN_PATTERNS[genre].items():
            if pattern in normalized or normalized in pattern:
                matches.extend(completions)
    
    # Cross-genre matching with lower confidence
    for other_genre, patterns in LATIN_PATTERNS.items():
        if other_genre != genre:
            for pattern, completions in patterns.items():
                if pattern in normalized:
                    # Reduce confidence for cross-genre matches
                    adjusted_completions = [
                        (comp, conf * 0.7, exp + " (cross-genre match)")
                        for comp, conf, exp in completions
                    ]
                    matches.extend(adjusted_completions)
    
    return matches

def calculate_author_match(prediction: str, author: Optional[str]) -> Optional[float]:
    """Calculate how well prediction matches author's style"""
    if not author or author.lower() not in AUTHOR_STYLES:
        return None
    
    author_data = AUTHOR_STYLES[author.lower()]
    
    # Simple heuristic based on vocabulary and structure
    base_score = author_data["vocabulary_preference"]
    
    # Adjust based on prediction characteristics
    if author.lower() == "virgil" and ("fortis" in prediction or "pius" in prediction):
        base_score += 0.1
    elif author.lower() == "ovid" and ("amor" in prediction or "forma" in prediction):
        base_score += 0.1
    elif author.lower() == "cicero" and ("res publica" in prediction or "senatus" in prediction):
        base_score += 0.1
    elif author.lower() == "horace" and ("diem" in prediction or "vita" in prediction):
        base_score += 0.1
    
    return min(base_score, 1.0)

def generate_fallback_predictions(text: str, genre: str, count: int) -> List[Prediction]:
    """Generate fallback predictions when no patterns match"""
    fallbacks = {
        "epic": [
            "magnus et fortis, bella gerere solet",
            "clarus in armis, hostes vincere novit", 
            "nobilis heros, patriam defendere cupit"
        ],
        "lyric": [
            "dulcis et suavis, cor tenerum movet",
            "tempus fugit, memento vitae brevis",
            "amor et dolor, simul in corde habitant"
        ],
        "prose": [
            "res magna et difficilis est",
            "populus Romanus semper victor fuit",
            "sapientia et virtus hominem decorant"
        ]
    }
    
    predictions = []
    for i, fallback in enumerate(fallbacks.get(genre, fallbacks["prose"])[:count]):
        predictions.append(Prediction(
            text=fallback,
            confidence=0.4 - (i * 0.1),
            explanation=f"Generated fallback completion for {genre} genre",
            author_style_match=None
        ))
    
    return predictions

@router.post("/complete", response_model=PredictionResponse)
async def predict_latin_text(request: PredictionRequest):
    """
    Predict completion for Latin text based on context, author, period, and genre.
    
    - **text**: The Latin text to complete
    - **author**: Optional author name for style matching
    - **period**: Historical period (classical, medieval, renaissance)
    - **genre**: Text genre (epic, lyric, prose, religious)
    - **max_predictions**: Maximum number of predictions to return
    """
    try:
        # Find matching patterns
        matches = find_matching_patterns(request.text, request.genre)
        
        predictions = []
        
        if matches:
            # Sort by confidence and take top matches
            matches.sort(key=lambda x: x[1], reverse=True)
            
            for completion, confidence, explanation in matches[:request.max_predictions]:
                # Apply period adjustments
                period_adj = PERIOD_ADJUSTMENTS.get(request.period, PERIOD_ADJUSTMENTS["classical"])
                adjusted_confidence = confidence * period_adj["confidence_boost"]
                
                # Calculate author style match
                author_match = calculate_author_match(completion, request.author)
                
                predictions.append(Prediction(
                    text=completion,
                    confidence=min(adjusted_confidence, 1.0),
                    explanation=explanation,
                    author_style_match=author_match
                ))
        
        # Fill remaining slots with fallback predictions if needed
        if len(predictions) < request.max_predictions:
            remaining = request.max_predictions - len(predictions)
            fallbacks = generate_fallback_predictions(request.text, request.genre, remaining)
            predictions.extend(fallbacks)
        
        # Ensure we don't exceed max_predictions
        predictions = predictions[:request.max_predictions]
        
        context_info = {
            "genre": request.genre,
            "period": request.period,
            "author": request.author,
            "pattern_matches_found": len(matches) > 0,
            "total_patterns_checked": sum(len(patterns) for patterns in LATIN_PATTERNS.values())
        }
        
        return PredictionResponse(
            original_text=request.text,
            predictions=predictions,
            context_info=context_info
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing Latin text: {str(e)}")

@router.get("/authors")
async def get_supported_authors():
    """Get list of supported authors for style matching"""
    return {
        "authors": list(AUTHOR_STYLES.keys()),
        "details": AUTHOR_STYLES
    }

@router.get("/genres")
async def get_supported_genres():
    """Get list of supported genres"""
    return {
        "genres": list(LATIN_PATTERNS.keys()),
        "pattern_counts": {genre: len(patterns) for genre, patterns in LATIN_PATTERNS.items()}
    }

@router.get("/periods")
async def get_supported_periods():
    """Get list of supported historical periods"""
    return {
        "periods": list(PERIOD_ADJUSTMENTS.keys()),
        "adjustments": PERIOD_ADJUSTMENTS
    }

# Demo endpoint
@router.get("/demo")
async def demo_prediction():
    """Demonstration of Latin text prediction"""
    demo_request = PredictionRequest(
        text="Arma virumque",
        author="virgil",
        period="classical",
        genre="epic",
        max_predictions=3
    )
    
    return await predict_latin_text(demo_request)