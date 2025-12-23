from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from enum import Enum
import re
from datetime import datetime
import math

router = APIRouter(prefix="/bias", tags=["author-bias"])

class PoliticalStance(str, Enum):
    CONSERVATIVE = "conservative"
    LIBERAL = "liberal"
    MODERATE = "moderate"
    NATIONALIST = "nationalist"
    RELIGIOUS = "religious"
    IMPERIAL = "imperial"

class BiasType(str, Enum):
    CONFIRMATION = "confirmation"
    SELECTION = "selection"
    FRAMING = "framing"
    OMISSION = "omission"
    EXAGGERATION = "exaggeration"
    PATRONAGE = "patronage"

class Patron(BaseModel):
    name: str
    relationship: str
    influence_score: float  # 0.0 to 1.0
    incentives: List[str]

class BiasIndicator(BaseModel):
    type: BiasType
    strength: float  # 0.0 to 1.0
    evidence: str
    confidence: float

class PredictedDistortion(BaseModel):
    topic: str
    direction: str  # "positive", "negative", "omit"
    magnitude: float  # 0.0 to 1.0
    reasoning: str

class AuthorProfile(BaseModel):
    name: str
    position: PoliticalStance
    patrons: List[Patron]
    predicted_distortions: List[PredictedDistortion]
    reliability_score: float
    game_theory_factors: Dict[str, Any]
    last_updated: datetime

class TextAnalysisRequest(BaseModel):
    text: str
    author: Optional[str] = None
    context: Optional[str] = None

class TextAnalysisResponse(BaseModel):
    bias_indicators: List[BiasIndicator]
    overall_bias_score: float
    dominant_bias_types: List[BiasType]
    reliability_assessment: float
    recommendations: List[str]

class GameTheoryAnalyzer:
    """Game theory model for analyzing author incentives and predicted biases"""
    
    @staticmethod
    def calculate_reliability_score(author_profile: dict) -> float:
        """Calculate reliability using game theory payoff matrices"""
        base_score = 0.7
        
        # Patron influence penalty
        patron_penalty = sum(p["influence_score"] for p in author_profile["patrons"]) * 0.1
        
        # Position extremeness penalty
        position_penalties = {
            "moderate": 0.0,
            "conservative": 0.05,
            "liberal": 0.05,
            "nationalist": 0.15,
            "religious": 0.1,
            "imperial": 0.2
        }
        position_penalty = position_penalties.get(author_profile["position"], 0.1)
        
        # Nash equilibrium consideration - authors balance truth vs. rewards
        truth_payoff = 0.3  # Intrinsic value of truth-telling
        reward_payoff = sum(p["influence_score"] for p in author_profile["patrons"]) * 0.4
        
        # Equilibrium strategy tends toward bias when rewards > truth value
        equilibrium_bias = max(0, (reward_payoff - truth_payoff) * 0.5)
        
        final_score = base_score - patron_penalty - position_penalty - equilibrium_bias
        return max(0.1, min(1.0, final_score))
    
    @staticmethod
    def predict_distortions(position: str, patrons: List[dict]) -> List[dict]:
        """Predict likely distortions based on game theory incentives"""
        distortions = []
        
        # Position-based distortions
        position_biases = {
            "imperial": [
                {"topic": "imperial_policies", "direction": "positive", "magnitude": 0.8, 
                 "reasoning": "Economic and social incentives favor imperial narrative"},
                {"topic": "rebellions", "direction": "negative", "magnitude": 0.7,
                 "reasoning": "Nash equilibrium favors delegitimizing resistance"}
            ],
            "religious": [
                {"topic": "religious_events", "direction": "positive", "magnitude": 0.9,
                 "reasoning": "Dominant strategy maximizes religious authority"},
                {"topic": "secular_criticism", "direction": "omit", "magnitude": 0.6,
                 "reasoning": "Omission strategy minimizes cognitive dissonance"}
            ],
            "nationalist": [
                {"topic": "national_achievements", "direction": "positive", "magnitude": 0.8,
                 "reasoning": "In-group bias maximizes social cohesion payoffs"},
                {"topic": "national_failures", "direction": "negative", "magnitude": 0.7,
                 "reasoning": "Minimization strategy protects group identity"}
            ]
        }
        
        distortions.extend(position_biases.get(position, []))
        
        # Patron-based distortions
        for patron in patrons:
            if patron["influence_score"] > 0.5:
                distortions.append({
                    "topic": f"{patron['name'].lower()}_related",
                    "direction": "positive",
                    "magnitude": patron["influence_score"],
                    "reasoning": f"High influence patron creates dominant strategy toward favorable coverage"
                })
        
        return distortions

# Pre-defined author profiles
AUTHOR_PROFILES = {
    "tacitus": {
        "name": "Tacitus",
        "position": "imperial",
        "patrons": [
            {
                "name": "Roman Senate Elite",
                "relationship": "social_class",
                "influence_score": 0.7,
                "incentives": ["maintain_status", "critique_emperors", "preserve_traditions"]
            },
            {
                "name": "Trajan",
                "relationship": "contemporary_emperor", 
                "influence_score": 0.4,
                "incentives": ["measured_praise", "contrast_with_predecessors"]
            }
        ]
    },
    "josephus": {
        "name": "Josephus",
        "position": "nationalist",
        "patrons": [
            {
                "name": "Flavian Dynasty",
                "relationship": "patron_beneficiary",
                "influence_score": 0.9,
                "incentives": ["justify_roman_rule", "minimize_rebellion_legitimacy"]
            },
            {
                "name": "Jewish Diaspora",
                "relationship": "cultural_audience",
                "influence_score": 0.6, 
                "incentives": ["preserve_jewish_dignity", "explain_defeat"]
            }
        ]
    },
    "eusebius": {
        "name": "Eusebius",
        "position": "religious",
        "patrons": [
            {
                "name": "Constantine I",
                "relationship": "imperial_patron",
                "influence_score": 0.95,
                "incentives": ["legitimize_christian_empire", "providential_history"]
            },
            {
                "name": "Christian Church",
                "relationship": "institutional_authority",
                "influence_score": 0.8,
                "incentives": ["orthodox_narrative", "martyrdom_emphasis", "divine_victory"]
            }
        ]
    }
}

class BiasAnalyzer:
    """Analyzes text for bias indicators using linguistic patterns"""
    
    BIAS_PATTERNS = {
        BiasType.CONFIRMATION: [
            r'\b(clearly|obviously|undoubtedly|certainly)\b',
            r'\b(proves|demonstrates|shows beyond doubt)\b'
        ],
        BiasType.FRAMING: [
            r'\b(so-called|alleged|claimed|purported)\b',
            r'\b(terrorist|freedom fighter|rebel|patriot)\b'
        ],
        BiasType.EXAGGERATION: [
            r'\b(countless|innumerable|unprecedented|extraordinary)\b',
            r'\b(massive|enormous|tremendous|incredible)\b'
        ],
        BiasType.SELECTION: [
            r'\b(notably|significantly|importantly)\b',
            r'\b(while ignoring|despite|however)\b'
        ]
    }
    
    @staticmethod
    def analyze_text_bias(text: str) -> List[BiasIndicator]:
        """Analyze text for bias indicators"""
        indicators = []
        
        for bias_type, patterns in BiasAnalyzer.BIAS_PATTERNS.items():
            for pattern in patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    indicators.append(BiasIndicator(
                        type=bias_type,
                        strength=0.6,  # Base strength
                        evidence=match.group(),
                        confidence=0.7
                    ))
        
        return indicators
    
    @staticmethod
    def calculate_overall_bias(indicators: List[BiasIndicator]) -> float:
        """Calculate overall bias score using game theory weighted approach"""
        if not indicators:
            return 0.0
        
        # Weight different bias types by their game-theoretic impact
        type_weights = {
            BiasType.PATRONAGE: 1.0,
            BiasType.OMISSION: 0.9,
            BiasType.FRAMING: 0.8,
            BiasType.SELECTION: 0.7,
            BiasType.EXAGGERATION: 0.6,
            BiasType.CONFIRMATION: 0.5
        }
        
        weighted_sum = sum(
            indicator.strength * type_weights.get(indicator.type, 0.5) * indicator.confidence
            for indicator in indicators
        )
        
        return min(1.0, weighted_sum / len(indicators))

@router.get("/author/{name}", response_model=AuthorProfile)
async def get_author_profile(name: str):
    """Get author's bias profile using game theory analysis"""
    name_lower = name.lower()
    
    if name_lower not in AUTHOR_PROFILES:
        raise HTTPException(status_code=404, detail=f"Author profile for '{name}' not found")
    
    profile_data = AUTHOR_PROFILES[name_lower]
    
    # Calculate game theory factors
    analyzer = GameTheoryAnalyzer()
    reliability_score = analyzer.calculate_reliability_score(profile_data)
    predicted_distortions = analyzer.predict_distortions(
        profile_data["position"], 
        profile_data["patrons"]
    )
    
    # Game theory analysis factors
    game_theory_factors = {
        "patron_influence_total": sum(p["influence_score"] for p in profile_data["patrons"]),
        "incentive_alignment": "low" if reliability_score > 0.7 else "high",
        "nash_equilibrium": "truth_telling" if reliability_score > 0.6 else "bias_favorable",
        "dominant_strategy": "accuracy" if len(predicted_distortions) < 3 else "patronage_alignment"
    }
    
    return AuthorProfile(
        name=profile_data["name"],
        position=PoliticalStance(profile_data["position"]),
        patrons=[Patron(**p) for p in profile_data["patrons"]],
        predicted_distortions=[PredictedDistortion(**d) for d in predicted_distortions],
        reliability_score=reliability_score,
        game_theory_factors=game_theory_factors,
        last_updated=datetime.now()
    )

@router.post("/analyze", response_model=TextAnalysisResponse)
async def analyze_text_bias(request: TextAnalysisRequest):
    """Analyze text for bias indicators using game theory principles"""
    analyzer = BiasAnalyzer()
    
    # Analyze bias indicators
    bias_indicators = analyzer.analyze_text_bias(request.text)
    
    # Calculate overall bias score
    overall_bias = analyzer.calculate_overall_bias(bias_indicators)
    
    # Determine dominant bias types
    bias_counts = {}
    for indicator in bias_indicators:
        bias_counts[indicator.type] = bias_counts.get(indicator.type, 0) + 1
    
    dominant_types = sorted(bias_counts.keys(), key=lambda x: bias_counts[x], reverse=True)[:3]
    
    # Calculate reliability assessment
    base_reliability = 0.8
    reliability_penalty = min(0.4, overall_bias * 0.5)
    reliability_assessment = base_reliability - reliability_penalty
    
    # Generate recommendations based on game theory
    recommendations = []
    
    if overall_bias > 0.6:
        recommendations.append("High bias detected - cross-reference with multiple sources")
        recommendations.append("Consider author's incentive structure and patron relationships")
    
    if BiasType.PATRONAGE in dominant_types:
        recommendations.append("Patronage bias detected - examine funding sources and relationships")
    
    if BiasType.OMISSION in dominant_types:
        recommendations.append("Selection bias likely - seek alternative perspectives on omitted topics")
    
    if request.author and request.author.lower() in AUTHOR_PROFILES:
        recommendations.append(f"Cross-reference with known bias patterns for {request.author}")
    
    if len(recommendations) == 0:
        recommendations.append("Relatively low bias detected - standard source evaluation applies")
    
    return TextAnalysisResponse(
        bias_indicators=bias_indicators,
        overall_bias_score=overall_bias,
        dominant_bias_types=dominant_types,
        reliability_assessment=reliability_assessment,
        recommendations=recommendations
    )

@router.get("/authors", response_model=List[str])
async def list_available_authors():
    """List all available author profiles"""
    return [profile["name"] for profile in AUTHOR_PROFILES.values()]

@router.get("/bias-types", response_model=List[str])
async def get_bias_types():
    """Get list of all bias types analyzed"""
    return [bias_type.value for bias_type in BiasType]