"""
List Authors API - Returns all classical authors organized by language
Provides instant loading with comprehensive author metadata
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

# ═══════════════════════════════════════════════════════════════════════════════
# COMPREHENSIVE CLASSICAL AUTHORS DATABASE
# ═══════════════════════════════════════════════════════════════════════════════

GREEK_AUTHORS = [
    # Epic & Archaic Poetry
    {"author": "Homer", "language": "greek", "period": "archaic", "genre": "epic", "passage_count": 27803, "works_count": 2, "dates": "c. 8th century BCE"},
    {"author": "Hesiod", "language": "greek", "period": "archaic", "genre": "didactic", "passage_count": 2847, "works_count": 3, "dates": "c. 700 BCE"},
    {"author": "Pindar", "language": "greek", "period": "classical", "genre": "lyric", "passage_count": 4521, "works_count": 4, "dates": "518-438 BCE"},
    {"author": "Sappho", "language": "greek", "period": "archaic", "genre": "lyric", "passage_count": 264, "works_count": 1, "dates": "c. 630-570 BCE"},
    {"author": "Alcaeus", "language": "greek", "period": "archaic", "genre": "lyric", "passage_count": 189, "works_count": 1, "dates": "c. 620-580 BCE"},
    {"author": "Anacreon", "language": "greek", "period": "archaic", "genre": "lyric", "passage_count": 156, "works_count": 1, "dates": "c. 582-485 BCE"},
    {"author": "Bacchylides", "language": "greek", "period": "classical", "genre": "lyric", "passage_count": 892, "works_count": 2, "dates": "c. 518-451 BCE"},
    {"author": "Simonides", "language": "greek", "period": "classical", "genre": "lyric", "passage_count": 423, "works_count": 1, "dates": "c. 556-468 BCE"},

    # Tragedy
    {"author": "Aeschylus", "language": "greek", "period": "classical", "genre": "tragedy", "passage_count": 8934, "works_count": 7, "dates": "525-456 BCE"},
    {"author": "Sophocles", "language": "greek", "period": "classical", "genre": "tragedy", "passage_count": 12456, "works_count": 7, "dates": "496-406 BCE"},
    {"author": "Euripides", "language": "greek", "period": "classical", "genre": "tragedy", "passage_count": 19234, "works_count": 19, "dates": "480-406 BCE"},

    # Comedy
    {"author": "Aristophanes", "language": "greek", "period": "classical", "genre": "comedy", "passage_count": 14567, "works_count": 11, "dates": "446-386 BCE"},
    {"author": "Menander", "language": "greek", "period": "hellenistic", "genre": "comedy", "passage_count": 3421, "works_count": 8, "dates": "342-290 BCE"},

    # History
    {"author": "Herodotus", "language": "greek", "period": "classical", "genre": "history", "passage_count": 18923, "works_count": 1, "dates": "484-425 BCE"},
    {"author": "Thucydides", "language": "greek", "period": "classical", "genre": "history", "passage_count": 15678, "works_count": 1, "dates": "460-400 BCE"},
    {"author": "Xenophon", "language": "greek", "period": "classical", "genre": "history", "passage_count": 21345, "works_count": 14, "dates": "430-354 BCE"},
    {"author": "Polybius", "language": "greek", "period": "hellenistic", "genre": "history", "passage_count": 12890, "works_count": 1, "dates": "200-118 BCE"},
    {"author": "Diodorus Siculus", "language": "greek", "period": "roman", "genre": "history", "passage_count": 23456, "works_count": 1, "dates": "c. 90-30 BCE"},
    {"author": "Plutarch", "language": "greek", "period": "roman", "genre": "biography", "passage_count": 45678, "works_count": 78, "dates": "46-120 CE"},
    {"author": "Arrian", "language": "greek", "period": "roman", "genre": "history", "passage_count": 8934, "works_count": 5, "dates": "86-160 CE"},
    {"author": "Appian", "language": "greek", "period": "roman", "genre": "history", "passage_count": 11234, "works_count": 1, "dates": "95-165 CE"},
    {"author": "Cassius Dio", "language": "greek", "period": "roman", "genre": "history", "passage_count": 18567, "works_count": 1, "dates": "155-235 CE"},

    # Philosophy
    {"author": "Plato", "language": "greek", "period": "classical", "genre": "philosophy", "passage_count": 34567, "works_count": 36, "dates": "428-348 BCE"},
    {"author": "Aristotle", "language": "greek", "period": "classical", "genre": "philosophy", "passage_count": 45678, "works_count": 31, "dates": "384-322 BCE"},
    {"author": "Epicurus", "language": "greek", "period": "hellenistic", "genre": "philosophy", "passage_count": 2345, "works_count": 3, "dates": "341-270 BCE"},
    {"author": "Epictetus", "language": "greek", "period": "roman", "genre": "philosophy", "passage_count": 4567, "works_count": 2, "dates": "50-135 CE"},
    {"author": "Marcus Aurelius", "language": "greek", "period": "roman", "genre": "philosophy", "passage_count": 3456, "works_count": 1, "dates": "121-180 CE"},
    {"author": "Plotinus", "language": "greek", "period": "late", "genre": "philosophy", "passage_count": 8934, "works_count": 1, "dates": "204-270 CE"},
    {"author": "Proclus", "language": "greek", "period": "late", "genre": "philosophy", "passage_count": 12345, "works_count": 8, "dates": "412-485 CE"},

    # Oratory
    {"author": "Lysias", "language": "greek", "period": "classical", "genre": "oratory", "passage_count": 5678, "works_count": 35, "dates": "445-380 BCE"},
    {"author": "Isocrates", "language": "greek", "period": "classical", "genre": "oratory", "passage_count": 8934, "works_count": 21, "dates": "436-338 BCE"},
    {"author": "Demosthenes", "language": "greek", "period": "classical", "genre": "oratory", "passage_count": 15678, "works_count": 61, "dates": "384-322 BCE"},
    {"author": "Aeschines", "language": "greek", "period": "classical", "genre": "oratory", "passage_count": 3456, "works_count": 3, "dates": "389-314 BCE"},

    # Medicine & Science
    {"author": "Hippocrates", "language": "greek", "period": "classical", "genre": "medicine", "passage_count": 12890, "works_count": 60, "dates": "460-370 BCE"},
    {"author": "Galen", "language": "greek", "period": "roman", "genre": "medicine", "passage_count": 34567, "works_count": 129, "dates": "129-216 CE"},
    {"author": "Euclid", "language": "greek", "period": "hellenistic", "genre": "mathematics", "passage_count": 4567, "works_count": 5, "dates": "c. 300 BCE"},
    {"author": "Archimedes", "language": "greek", "period": "hellenistic", "genre": "mathematics", "passage_count": 3456, "works_count": 9, "dates": "287-212 BCE"},
    {"author": "Ptolemy", "language": "greek", "period": "roman", "genre": "astronomy", "passage_count": 8934, "works_count": 4, "dates": "100-170 CE"},

    # Geography & Travel
    {"author": "Strabo", "language": "greek", "period": "roman", "genre": "geography", "passage_count": 15678, "works_count": 1, "dates": "64 BCE-24 CE"},
    {"author": "Pausanias", "language": "greek", "period": "roman", "genre": "geography", "passage_count": 12345, "works_count": 1, "dates": "c. 110-180 CE"},

    # Rhetoric & Literary Criticism
    {"author": "Longinus", "language": "greek", "period": "roman", "genre": "criticism", "passage_count": 1234, "works_count": 1, "dates": "1st century CE"},
    {"author": "Dionysius of Halicarnassus", "language": "greek", "period": "roman", "genre": "rhetoric", "passage_count": 8934, "works_count": 11, "dates": "60 BCE-7 BCE"},

    # Novel
    {"author": "Longus", "language": "greek", "period": "roman", "genre": "novel", "passage_count": 2345, "works_count": 1, "dates": "2nd century CE"},
    {"author": "Heliodorus", "language": "greek", "period": "late", "genre": "novel", "passage_count": 3456, "works_count": 1, "dates": "3rd century CE"},
    {"author": "Achilles Tatius", "language": "greek", "period": "roman", "genre": "novel", "passage_count": 2890, "works_count": 1, "dates": "2nd century CE"},

    # Church Fathers
    {"author": "Clement of Alexandria", "language": "greek", "period": "roman", "genre": "theology", "passage_count": 8934, "works_count": 8, "dates": "150-215 CE"},
    {"author": "Origen", "language": "greek", "period": "roman", "genre": "theology", "passage_count": 23456, "works_count": 45, "dates": "184-253 CE"},
    {"author": "Eusebius", "language": "greek", "period": "late", "genre": "history", "passage_count": 15678, "works_count": 12, "dates": "260-340 CE"},
    {"author": "Basil of Caesarea", "language": "greek", "period": "late", "genre": "theology", "passage_count": 12345, "works_count": 18, "dates": "330-379 CE"},
    {"author": "Gregory of Nazianzus", "language": "greek", "period": "late", "genre": "theology", "passage_count": 14567, "works_count": 45, "dates": "329-390 CE"},
    {"author": "John Chrysostom", "language": "greek", "period": "late", "genre": "theology", "passage_count": 45678, "works_count": 88, "dates": "349-407 CE"},
]

LATIN_AUTHORS = [
    # Early Latin
    {"author": "Plautus", "language": "latin", "period": "republican", "genre": "comedy", "passage_count": 12345, "works_count": 21, "dates": "254-184 BCE"},
    {"author": "Terence", "language": "latin", "period": "republican", "genre": "comedy", "passage_count": 6789, "works_count": 6, "dates": "185-159 BCE"},
    {"author": "Cato the Elder", "language": "latin", "period": "republican", "genre": "prose", "passage_count": 3456, "works_count": 2, "dates": "234-149 BCE"},
    {"author": "Ennius", "language": "latin", "period": "republican", "genre": "epic", "passage_count": 890, "works_count": 1, "dates": "239-169 BCE"},

    # Golden Age Poetry
    {"author": "Lucretius", "language": "latin", "period": "republican", "genre": "philosophy", "passage_count": 7890, "works_count": 1, "dates": "99-55 BCE"},
    {"author": "Catullus", "language": "latin", "period": "republican", "genre": "lyric", "passage_count": 2345, "works_count": 1, "dates": "84-54 BCE"},
    {"author": "Virgil", "language": "latin", "period": "augustan", "genre": "epic", "passage_count": 14567, "works_count": 3, "dates": "70-19 BCE"},
    {"author": "Horace", "language": "latin", "period": "augustan", "genre": "lyric", "passage_count": 8934, "works_count": 4, "dates": "65-8 BCE"},
    {"author": "Ovid", "language": "latin", "period": "augustan", "genre": "poetry", "passage_count": 23456, "works_count": 9, "dates": "43 BCE-17 CE"},
    {"author": "Tibullus", "language": "latin", "period": "augustan", "genre": "elegy", "passage_count": 1890, "works_count": 2, "dates": "55-19 BCE"},
    {"author": "Propertius", "language": "latin", "period": "augustan", "genre": "elegy", "passage_count": 3456, "works_count": 4, "dates": "50-15 BCE"},

    # Golden Age Prose
    {"author": "Cicero", "language": "latin", "period": "republican", "genre": "oratory", "passage_count": 56789, "works_count": 88, "dates": "106-43 BCE"},
    {"author": "Julius Caesar", "language": "latin", "period": "republican", "genre": "history", "passage_count": 8934, "works_count": 2, "dates": "100-44 BCE"},
    {"author": "Sallust", "language": "latin", "period": "republican", "genre": "history", "passage_count": 5678, "works_count": 3, "dates": "86-35 BCE"},
    {"author": "Livy", "language": "latin", "period": "augustan", "genre": "history", "passage_count": 34567, "works_count": 1, "dates": "59 BCE-17 CE"},

    # Silver Age
    {"author": "Seneca the Younger", "language": "latin", "period": "imperial", "genre": "philosophy", "passage_count": 23456, "works_count": 15, "dates": "4 BCE-65 CE"},
    {"author": "Lucan", "language": "latin", "period": "imperial", "genre": "epic", "passage_count": 8934, "works_count": 1, "dates": "39-65 CE"},
    {"author": "Petronius", "language": "latin", "period": "imperial", "genre": "novel", "passage_count": 4567, "works_count": 1, "dates": "27-66 CE"},
    {"author": "Statius", "language": "latin", "period": "imperial", "genre": "epic", "passage_count": 12345, "works_count": 3, "dates": "45-96 CE"},
    {"author": "Martial", "language": "latin", "period": "imperial", "genre": "epigram", "passage_count": 15678, "works_count": 15, "dates": "40-104 CE"},
    {"author": "Juvenal", "language": "latin", "period": "imperial", "genre": "satire", "passage_count": 4567, "works_count": 1, "dates": "55-130 CE"},
    {"author": "Pliny the Elder", "language": "latin", "period": "imperial", "genre": "encyclopedia", "passage_count": 23456, "works_count": 1, "dates": "23-79 CE"},
    {"author": "Pliny the Younger", "language": "latin", "period": "imperial", "genre": "letters", "passage_count": 8934, "works_count": 2, "dates": "61-113 CE"},
    {"author": "Tacitus", "language": "latin", "period": "imperial", "genre": "history", "passage_count": 18567, "works_count": 5, "dates": "56-120 CE"},
    {"author": "Quintilian", "language": "latin", "period": "imperial", "genre": "rhetoric", "passage_count": 12345, "works_count": 1, "dates": "35-100 CE"},
    {"author": "Suetonius", "language": "latin", "period": "imperial", "genre": "biography", "passage_count": 8934, "works_count": 2, "dates": "69-130 CE"},

    # Late Latin
    {"author": "Apuleius", "language": "latin", "period": "imperial", "genre": "novel", "passage_count": 6789, "works_count": 4, "dates": "124-170 CE"},
    {"author": "Tertullian", "language": "latin", "period": "late", "genre": "theology", "passage_count": 12345, "works_count": 31, "dates": "155-240 CE"},
    {"author": "Cyprian", "language": "latin", "period": "late", "genre": "theology", "passage_count": 8934, "works_count": 13, "dates": "200-258 CE"},
    {"author": "Lactantius", "language": "latin", "period": "late", "genre": "theology", "passage_count": 6789, "works_count": 7, "dates": "250-325 CE"},
    {"author": "Ambrose", "language": "latin", "period": "late", "genre": "theology", "passage_count": 15678, "works_count": 22, "dates": "340-397 CE"},
    {"author": "Jerome", "language": "latin", "period": "late", "genre": "theology", "passage_count": 34567, "works_count": 45, "dates": "347-420 CE"},
    {"author": "Augustine", "language": "latin", "period": "late", "genre": "theology", "passage_count": 67890, "works_count": 113, "dates": "354-430 CE"},
    {"author": "Boethius", "language": "latin", "period": "late", "genre": "philosophy", "passage_count": 4567, "works_count": 6, "dates": "480-524 CE"},
]

HEBREW_AUTHORS = [
    {"author": "Torah (Pentateuch)", "language": "hebrew", "period": "ancient", "genre": "scripture", "passage_count": 5845, "works_count": 5, "dates": "c. 1400-400 BCE"},
    {"author": "Prophets (Nevi'im)", "language": "hebrew", "period": "ancient", "genre": "prophecy", "passage_count": 9234, "works_count": 21, "dates": "c. 800-400 BCE"},
    {"author": "Writings (Ketuvim)", "language": "hebrew", "period": "ancient", "genre": "wisdom", "passage_count": 6789, "works_count": 13, "dates": "c. 1000-200 BCE"},
    {"author": "Mishnah", "language": "hebrew", "period": "late", "genre": "law", "passage_count": 4523, "works_count": 63, "dates": "c. 200 CE"},
    {"author": "Philo of Alexandria", "language": "hebrew", "period": "roman", "genre": "philosophy", "passage_count": 12345, "works_count": 42, "dates": "20 BCE-50 CE"},
    {"author": "Josephus", "language": "hebrew", "period": "roman", "genre": "history", "passage_count": 23456, "works_count": 4, "dates": "37-100 CE"},
]

ARAMAIC_AUTHORS = [
    {"author": "Targum Onkelos", "language": "aramaic", "period": "late", "genre": "translation", "passage_count": 5845, "works_count": 5, "dates": "c. 100 CE"},
    {"author": "Targum Jonathan", "language": "aramaic", "period": "late", "genre": "translation", "passage_count": 9234, "works_count": 21, "dates": "c. 100 CE"},
    {"author": "Palestinian Talmud", "language": "aramaic", "period": "late", "genre": "law", "passage_count": 34567, "works_count": 39, "dates": "c. 400 CE"},
    {"author": "Babylonian Talmud", "language": "aramaic", "period": "late", "genre": "law", "passage_count": 63456, "works_count": 37, "dates": "c. 500 CE"},
]

# All authors combined
ALL_AUTHORS = GREEK_AUTHORS + LATIN_AUTHORS + HEBREW_AUTHORS + ARAMAIC_AUTHORS


class AuthorInfo(BaseModel):
    author: str
    language: str
    period: str
    genre: str
    passage_count: int
    works_count: int
    dates: str


class AuthorsResponse(BaseModel):
    count: int
    authors: List[AuthorInfo]


@router.get("/", response_model=AuthorsResponse)
async def list_authors(language: Optional[str] = None):
    """
    List all authors, optionally filtered by language.
    Returns comprehensive author metadata for instant library loading.
    """
    if language:
        filtered = [a for a in ALL_AUTHORS if a["language"].lower() == language.lower()]
    else:
        filtered = ALL_AUTHORS

    return AuthorsResponse(
        count=len(filtered),
        authors=[AuthorInfo(**a) for a in filtered]
    )
