from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class MorphologyInfo(BaseModel):
    word: str
    lemma: str
    pos: str
    case: Optional[str] = None
    number: Optional[str] = None
    gender: Optional[str] = None
    tense: Optional[str] = None
    voice: Optional[str] = None
    mood: Optional[str] = None
    definition: str
    frequency: int

class ParseRequest(BaseModel):
    text: str
    language: str = "greek"  # "greek" or "latin"

class ParseResponse(BaseModel):
    words: List[MorphologyInfo]

# Demo morphological data
MORPHOLOGY_DATA = {
    "greek": {
        "μῆνιν": MorphologyInfo(
            word="μῆνιν",
            lemma="μῆνις",
            pos="noun",
            case="accusative",
            number="singular",
            gender="feminine",
            definition="anger, wrath, rage",
            frequency=85
        ),
        "ἄειδε": MorphologyInfo(
            word="ἄειδε",
            lemma="ἀείδω",
            pos="verb",
            number="singular",
            tense="present",
            voice="active",
            mood="imperative",
            definition="to sing, sing of, celebrate in song",
            frequency=142
        ),
        "θεὰ": MorphologyInfo(
            word="θεὰ",
            lemma="θεός",
            pos="noun",
            case="nominative",
            number="singular",
            gender="feminine",
            definition="goddess, divine being",
            frequency=324
        )
    },
    "latin": {
        "arma": MorphologyInfo(
            word="arma",
            lemma="arma",
            pos="noun",
            case="accusative",
            number="plural",
            gender="neuter",
            definition="arms, weapons, tools of war",
            frequency=198
        ),
        "virum": MorphologyInfo(
            word="virum",
            lemma="vir",
            pos="noun",
            case="accusative",
            number="singular",
            gender="masculine",
            definition="man, hero, husband",
            frequency=456
        ),
        "cano": MorphologyInfo(
            word="cano",
            lemma="cano",
            pos="verb",
            number="singular",
            tense="present",
            voice="active",
            mood="indicative",
            definition="to sing, chant, recite, proclaim",
            frequency=89
        )
    }
}

@router.post("/", response_model=ParseResponse)
async def parse_morphology(request: ParseRequest):
    """
    Parse text into words with morphological analysis.
    
    Returns morphological information for each word including:
    - word: original word form
    - lemma: dictionary form
    - pos: part of speech
    - case: grammatical case (if applicable)
    - number: singular/plural
    - gender: masculine/feminine/neuter (if applicable)
    - tense: verb tense (if applicable)
    - voice: active/passive/middle (if applicable)
    - mood: indicative/subjunctive/imperative/etc (if applicable)
    - definition: English definition
    - frequency: usage frequency rank
    """
    words = request.text.split()
    language_data = MORPHOLOGY_DATA.get(request.language.lower(), {})
    
    parsed_words = []
    for word in words:
        # Clean word of punctuation
        clean_word = word.strip(".,;:!?")
        
        if clean_word in language_data:
            parsed_words.append(language_data[clean_word])
        else:
            # Return basic unknown word info
            parsed_words.append(MorphologyInfo(
                word=clean_word,
                lemma=clean_word,
                pos="unknown",
                definition="[definition not found]",
                frequency=0
            ))
    
    return ParseResponse(words=parsed_words)