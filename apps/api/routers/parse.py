"""
LOGOS API - Morphological Parsing Router
Click-word instant parsing and definitions
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Literal

router = APIRouter()

class ParseResult(BaseModel):
    word: str
    lemma: str
    language: str
    part_of_speech: str
    morphology: dict
    definition: str
    frequency: Optional[int] = None
    examples: Optional[List[str]] = None

# Demo parsing data
GREEK_PARSES = {
    "μῆνιν": ParseResult(
        word="μῆνιν",
        lemma="μῆνις",
        language="grc",
        part_of_speech="noun",
        morphology={
            "case": "accusative",
            "number": "singular",
            "gender": "feminine",
            "declension": "3rd"
        },
        definition="wrath, anger (especially divine or heroic)",
        frequency=23,
        examples=["μῆνιν ἄειδε θεὰ (Iliad 1.1)"]
    ),
    "ἄειδε": ParseResult(
        word="ἄειδε",
        lemma="ἀείδω",
        language="grc",
        part_of_speech="verb",
        morphology={
            "tense": "present",
            "mood": "imperative",
            "voice": "active",
            "person": "2nd",
            "number": "singular"
        },
        definition="sing, sing of, celebrate in song",
        frequency=156,
        examples=["μῆνιν ἄειδε θεὰ (Iliad 1.1)"]
    ),
    "θεὰ": ParseResult(
        word="θεὰ",
        lemma="θεά",
        language="grc",
        part_of_speech="noun",
        morphology={
            "case": "nominative/vocative",
            "number": "singular",
            "gender": "feminine",
            "declension": "1st"
        },
        definition="goddess",
        frequency=342,
        examples=["μῆνιν ἄειδε θεὰ (Iliad 1.1)"]
    )
}

LATIN_PARSES = {
    "arma": ParseResult(
        word="arma",
        lemma="arma",
        language="lat",
        part_of_speech="noun",
        morphology={
            "case": "nominative/accusative",
            "number": "plural",
            "gender": "neuter",
            "declension": "2nd"
        },
        definition="arms, weapons; warfare",
        frequency=1247,
        examples=["Arma virumque cano (Aeneid 1.1)"]
    ),
    "virum": ParseResult(
        word="virum",
        lemma="vir",
        language="lat",
        part_of_speech="noun",
        morphology={
            "case": "accusative",
            "number": "singular",
            "gender": "masculine",
            "declension": "2nd"
        },
        definition="man, hero; husband",
        frequency=3421,
        examples=["Arma virumque cano (Aeneid 1.1)"]
    ),
    "cano": ParseResult(
        word="cano",
        lemma="cano",
        language="lat",
        part_of_speech="verb",
        morphology={
            "tense": "present",
            "mood": "indicative",
            "voice": "active",
            "person": "1st",
            "number": "singular"
        },
        definition="sing, sing of; prophesy; play (an instrument)",
        frequency=892,
        examples=["Arma virumque cano (Aeneid 1.1)"]
    )
}

@router.get("/{word}", response_model=ParseResult)
async def parse_word(
    word: str,
    lang: Literal["grc", "lat"] = Query(default="grc", description="Language: grc (Greek) or lat (Latin)")
):
    """
    Parse a Greek or Latin word.
    
    Returns:
    - Lemma (dictionary form)
    - Part of speech
    - Full morphological analysis
    - Definition
    - Corpus frequency
    - Example usages
    """
    
    # Check demo data
    if lang == "grc" and word in GREEK_PARSES:
        return GREEK_PARSES[word]
    elif lang == "lat" and word in LATIN_PARSES:
        return LATIN_PARSES[word]
    
    # Generic response
    return ParseResult(
        word=word,
        lemma=word,
        language=lang,
        part_of_speech="unknown",
        morphology={"note": "Full parsing available in production"},
        definition=f"[Definition for {word}]",
        frequency=None,
        examples=None
    )

@router.post("/batch")
async def batch_parse(
    words: List[str],
    lang: Literal["grc", "lat"] = "grc"
):
    """Parse multiple words at once."""
    results = []
    for word in words:
        if lang == "grc" and word in GREEK_PARSES:
            results.append(GREEK_PARSES[word])
        elif lang == "lat" and word in LATIN_PARSES:
            results.append(LATIN_PARSES[word])
        else:
            results.append(ParseResult(
                word=word,
                lemma=word,
                language=lang,
                part_of_speech="unknown",
                morphology={},
                definition=f"[{word}]"
            ))
    return {"words": results, "total": len(results)}

@router.get("/lemma/{lemma}")
async def get_lemma_info(
    lemma: str,
    lang: Literal["grc", "lat"] = "grc"
):
    """Get full information about a lemma (dictionary form)."""
    return {
        "lemma": lemma,
        "language": lang,
        "forms": [],
        "definitions": [],
        "corpus_frequency": 0,
        "first_attested": None
    }
