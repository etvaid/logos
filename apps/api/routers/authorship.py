from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel, Field, validator
from typing import Dict, Any, Optional, List, Tuple
import asyncpg
import logging
from datetime import datetime
import json
import re
import numpy as np
from collections import Counter, defaultdict
import math

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Function words for stylometric analysis
GREEK_FUNCTION_WORDS = [
    "καί", "δέ", "γάρ", "μέν", "οὖν", "τε", "ἀλλά", "εἰ", "ὡς", "ἐν",
    "τὸν", "τὴν", "τῶν", "τοῦ", "τῆς", "ἐκ", "εἰς", "ἐπὶ", "κατὰ", "μετὰ",
    "πρὸς", "διὰ", "ὑπὸ", "περὶ", "παρὰ", "σὺν", "ἀπὸ", "ἐπεὶ", "ὅτι", "ἵνα",
    "ἐὰν", "ὅταν", "ὅπως", "ὅσος", "οὗτος", "ἐκεῖνος", "αὐτὸς", "ὃς", "τίς", "τις",
    "πᾶς", "μή", "οὐ", "οὐκ", "οὐχ", "ἄν", "κε", "πρίν", "ὅθεν", "ὅπου",
    "ὧδε", "ἔνθα", "ἐνταῦθα", "ἐκεῖ", "πότε", "τότε", "νῦν", "ἤδη", "ἔτι", "πάλιν",
    "ἅμα", "εὐθὺς", "αὐτίκα", "τάχα", "μάλιστα", "μᾶλλον", "πολὺ", "μέγα", "μικρὸν", "ὀλίγον",
    "πρῶτον", "δεύτερον", "τρίτον", "τέλος", "ἀρχή", "μέσος", "ἐπεί", "ὅπως", "ἄρα", "δή",
    "γε", "τοι", "δαί", "ἦ", "ναί", "οὐ μήν", "ἀλλὰ μήν", "καὶ δή", "καὶ γάρ", "τε καί",
    "μὲν οὖν", "οὐ μόνον", "ἀλλὰ καί", "εἰ μέν", "εἰ δέ", "ἢ μέν", "ἢ δέ", "καὶ μέν",
    "οὔτε μέν", "οὔτε δέ", "μήτε μέν", "μήτε δέ", "ἤτοι μέν", "ἤ δέ", "εἴτε μέν", "εἴτε δέ",
    "ἐπειδὴ", "ἐπειδὰν", "ἄχρι οὗ", "μέχρι οὗ", "πλὴν ὅτι", "χωρὶς τοῦ", "ἅτε δή", "ὅτε δή",
    "ἡνίκα δή", "ἐπὰν δή", "ἐὰν μή τι", "εἰ μή τι", "ἐὰν περ", "εἰ καί", "καὶ εἰ", "καίπερ",
    "καίτοι γε", "ὅμως δέ", "μέντοι γε", "οὖν δή", "τοίνυν δή", "τοιγάρτοι", "διό περ", "διότι περ"
]

LATIN_FUNCTION_WORDS = [
    "et", "sed", "enim", "autem", "nam", "cum", "in", "ad", "ut", "quod",
    "de", "ex", "pro", "per", "ob", "sub", "super", "inter", "post", "ante",
    "contra", "secundum", "propter", "sine", "causa", "gratia", "si", "nisi", "an", "ne",
    "num", "quin", "quominus", "dum", "donec", "antequam", "postquam", "quando", "ubi", "quo",
    "unde", "qua", "hic", "haec", "hoc", "ille", "illa", "illud", "is", "ea",
    "id", "ipse", "ipsa", "ipsum", "qui", "quae", "quis", "quid", "aliquis", "aliquid",
    "nullus", "nulla", "nihil", "omnis", "totus", "cunctus", "quisque", "uterque", "neuter", "alter",
    "alius", "ceteri", "reliqui", "non", "ne", "haud", "minime", "numquam", "nihil", "nemo",
    "iam", "modo", "tantum", "solum", "duntaxat", "saltem", "vix", "fere", "paene", "prope",
    "satis", "nimis", "parum", "multum", "magis", "maxime", "minus", "minime", "potius", "praesertim",
    "primum", "deinde", "tum", "tunc", "denique", "tandem", "postremo", "iterum", "rursus", "item",
    "quoque", "etiam", "quidem", "certe", "profecto", "vero", "autem", "videlicet", "scilicet", "nempe",
    "ita", "sic", "tam", "adeo", "usque", "quam", "quantum", "quomodo", "quemadmodum", "velut",
    "sicut", "tamquam", "quasi", "ut si", "ac si", "licet", "quamvis", "etsi", "tametsi",
    "quamquam", "at", "atqui", "verum", "tamen", "nihilominus", "attamen", "ergo", "igitur", "itaque",
    "idcirco", "propterea", "quare", "quamobrem", "qua re", "ea re", "hac re", "ob eam rem", "ideo", "idque"
]

# Disputed texts
DISPUTED_TEXTS = {
    "greek": [
        {"urn": "urn:cts:greekLit:tlg0012.tlg003", "title": "Doloneia (Iliad 10)", "author": "Homer", "dispute": "Authorship questioned since antiquity"},
        {"urn": "urn:cts:greekLit:tlg0085.tlg002", "title": "Prometheus Bound", "author": "Aeschylus", "dispute": "Stylistic differences suggest different author"},
        {"urn": "urn:cts:greekLit:tlg0085.tlg003", "title": "Rhesus", "author": "Euripides", "dispute": "Attribution disputed since ancient times"},
        {"urn": "urn:cts:greekLit:tlg0059.tlg999", "title": "Pseudo-Platonic Dialogues", "author": "Plato", "dispute": "Various dialogues of questionable authenticity"}
    ],
    "latin": [
        {"urn": "urn:cts:latinLit:phi0959.phi999", "title": "Appendix Vergiliana", "author": "Virgil", "dispute": "Collection of works attributed to Virgil with questionable authenticity"},
        {"urn": "urn:cts:latinLit:phi0474.phi999", "title": "Pseudo-Ciceronian Speeches", "author": "Cicero", "dispute": "Various speeches in Ciceronian corpus of doubtful authenticity"}
    ]
}

# Pydantic Models
class AttributionRequest(BaseModel):
    text: str = Field(..., min_length=100, max_length=10000)
    language: str = Field(..., description="Language: 'greek' or 'latin'")
    candidates: Optional[List[str]] = None
    
    @validator('language')
    def validate_language(cls, v):
        if v.lower() not in ['greek', 'latin']:
            raise ValueError("Language must be 'greek' or 'latin'")
        return v.lower()

class AuthorCandidate(BaseModel):
    author: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    delta_score: float
    similarity_rank: int = Field(..., ge=1)
    profile_match: Dict[str, float]
    distinctive_features: List[str]

class AttributionResponse(BaseModel):
    text_preview: str
    language: str
    top_candidates: List[AuthorCandidate]
    total_candidates_analyzed: int
    analysis_confidence: float = Field(..., ge=0.0, le=1.0)
    stylometric_features: Dict[str, float]
    methodology: str = "Burrows' Delta with top 150 function words"
    text_length: int
    function_words_found: int
    timestamp: str

class AuthorProfile(BaseModel):
    author: str
    language: str
    total_texts: int
    total_words: int
    stylometric_profile: Dict[str, float]
    distinctive_words: List[str]
    mean_sentence_length: float
    vocabulary_richness: float
    chronological_period: Optional[str] = None
    major_works: List[str]
    last_updated: str

class AuthorsListResponse(BaseModel):
    authors: List[AuthorProfile]
    total_authors: int
    languages: Dict[str, int]
    last_updated: str

class FingerprintResponse(BaseModel):
    author: str
    language: str
    fingerprint: Dict[str, float]
    dimension_count: int
    profile_completeness: float = Field(..., ge=0.0, le=1.0)
    comparative_features: Dict[str, Any]
    reliability_score: float = Field(..., ge=0.0, le=1.0)

class DisputedText(BaseModel):
    urn: str
    title: str
    attributed_author: str
    dispute_reason: str
    language: str
    stylometric_evidence: Optional[Dict[str, Any]] = None
    scholarly_consensus: Optional[str] = None

class DisputedTextsResponse(BaseModel):
    disputed_texts: List[DisputedText]
    total_disputed: int
    languages: Dict[str, int]
    dispute_categories: List[str]

class CompareTextsRequest(BaseModel):
    text1: str = Field(..., min_length=100, max_length=5000)
    text2: str = Field(..., min_length=100, max_length=5000)
    language: str
    
    @validator('language')
    def validate_language(cls, v):
        if v.lower() not in ['greek', 'latin']:
            raise ValueError("Language must be 'greek' or 'latin'")
        return v.lower()

class TextComparison(BaseModel):
    text1_preview: str
    text2_preview: str
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    delta_distance: float
    feature_comparison: Dict[str, Dict[str, float]]
    stylistic_differences: List[str]
    statistical_significance: float = Field(..., ge=0.0, le=1.0)

class ComparisonResponse(BaseModel):
    comparison: TextComparison
    methodology: str
    confidence_level: float = Field(..., ge=0.0, le=1.0)
    recommendation: str
    timestamp: str

class FunctionWordFrequency(BaseModel):
    word: str
    frequency: float = Field(..., ge=0.0, le=1.0)
    raw_count: int
    relative_frequency: float
    rank: int

class FunctionWordsResponse(BaseModel):
    author: str
    language: str
    function_words: List[FunctionWordFrequency]
    total_function_words: int
    text_coverage: float = Field(..., ge=0.0, le=1.0)
    most_distinctive: List[str]
    profile_summary: Dict[str, float]

# Stylometric analysis functions
def extract_function_words(text: str, language: str) -> Dict[str, int]:
    """Extract function word frequencies from text"""
    words = GREEK_FUNCTION_WORDS if language == 'greek' else LATIN_FUNCTION_WORDS
    text_lower = text.lower()
    word_counts = {}