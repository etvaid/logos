from fastapi import APIRouter

router = APIRouter()

WORDS = {
    "ἀρετή": {"word": "ἀρετή", "language": "Greek", "occurrences": 4523, "traditional_def": "virtue, excellence (LSJ)", "semantia_finding": "Meaning shifted from martial excellence (Homer) to ethical virtue (Plato) to religious holiness (Christian)", "neighbors": [{"word": "φρόνησις", "sim": 0.89}], "challenges_lexicon": True},
    "λόγος": {"word": "λόγος", "language": "Greek", "occurrences": 10663, "traditional_def": "word, speech, reason (LSJ)", "semantia_finding": "Most semantically complex word in Greek. Clusters differently in philosophical, rhetorical, and theological contexts.", "neighbors": [{"word": "λέγειν", "sim": 0.95}], "challenges_lexicon": True},
    "θεός": {"word": "θεός", "language": "Greek", "occurrences": 8942, "traditional_def": "god, deity (LSJ)", "semantia_finding": "Clusters with αἰώνιος, ὑψίστου, ἔλεος in religious texts - organic discovery of theological language.", "neighbors": [{"word": "αἰώνιος", "sim": 0.995}], "challenges_lexicon": False},
}

@router.get("/word/{word}")
async def get_word(word: str):
    return WORDS.get(word, {"error": "Word not found"})

@router.get("/neighbors/{word}")
async def get_neighbors(word: str):
    w = WORDS.get(word)
    if w:
        return {"neighbors": w.get("neighbors", [])}
    return {"neighbors": []}
