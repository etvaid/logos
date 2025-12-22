"""
LOGOS API - Etymology Router
Word history tracking: PIE → Greek → Latin → English
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class EtymologyStage(BaseModel):
    language: str
    form: str
    meaning: str
    period: Optional[str] = None

class EtymologyResult(BaseModel):
    word: str
    etymology: List[EtymologyStage]
    cognates: List[dict]
    semantic_development: str

@router.get("/{word}")
async def get_etymology(word: str, lang: str = "grc"):
    """
    Get the etymology of a Greek or Latin word.
    
    Traces word history from Proto-Indo-European to modern descendants.
    """
    
    # Demo etymologies
    if word == "θεός" or word == "theos":
        return EtymologyResult(
            word="θεός",
            etymology=[
                EtymologyStage(language="PIE", form="*dʰeh₁s-", meaning="deity, god", period="~4000 BCE"),
                EtymologyStage(language="Proto-Greek", form="*tʰesós", meaning="god"),
                EtymologyStage(language="Ancient Greek", form="θεός", meaning="god, deity", period="~800 BCE"),
                EtymologyStage(language="Latin (borrowed)", form="deus", meaning="god"),
                EtymologyStage(language="English", form="theology, theism", meaning="study of/belief in god", period="Modern")
            ],
            cognates=[
                {"language": "Latin", "word": "deus", "meaning": "god"},
                {"language": "Sanskrit", "word": "देव (deva)", "meaning": "deity"},
                {"language": "Lithuanian", "word": "dievas", "meaning": "god"}
            ],
            semantic_development="From PIE root meaning 'to set, place' → 'that which is placed/established' → 'divine being'"
        )
    
    return EtymologyResult(
        word=word,
        etymology=[
            EtymologyStage(language=lang, form=word, meaning="[meaning]")
        ],
        cognates=[],
        semantic_development="Full etymology available in production"
    )
