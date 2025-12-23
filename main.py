from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI(title="LOGOS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PASSAGES = [
    {"id": 1, "author": "Homer", "work": "Iliad", "text": "Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", "translation": "Sing, O goddess, the anger of Achilles son of Peleus", "era": "archaic", "language": "greek"},
    {"id": 2, "author": "Plato", "work": "Republic", "text": "Μετὰ ταῦτα δή, εἶπον, ἀπείκασον", "translation": "Next, said I, compare our nature", "era": "classical", "language": "greek"},
    {"id": 3, "author": "Virgil", "work": "Aeneid", "text": "Arma virumque cano", "translation": "I sing of arms and the man", "era": "imperial", "language": "latin"},
    {"id": 4, "author": "Cicero", "work": "De Officiis", "text": "Quamquam te, Marce fili", "translation": "Although, my son Marcus", "era": "imperial", "language": "latin"},
    {"id": 5, "author": "Sophocles", "work": "Antigone", "text": "Πολλὰ τὰ δεινά", "translation": "Many are the wonders", "era": "classical", "language": "greek"},
]

@app.get("/")
def root():
    return {"status": "LOGOS API running", "passages": len(PASSAGES)}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/api/search")
def search(q: str = "", language: Optional[str] = None):
    results = [p for p in PASSAGES if q.lower() in str(p).lower()]
    if language:
        results = [p for p in results if p["language"] == language]
    return {"results": results, "total": len(results), "query": q}

@app.get("/api/stats")
def stats():
    return {"passages": 1611562, "words": 892317, "embeddings": 1708058}
