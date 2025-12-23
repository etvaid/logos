from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    lang: Optional[str] = None
    limit: int = 20

class SearchResult(BaseModel):
    urn: str
    text: str
    author: str
    work: str
    score: float
    translation: Optional[str] = None

DEMO = [
    {"urn": "urn:cts:greekLit:tlg0012.tlg001:1.1", "text": "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", "author": "Homer", "work": "Iliad 1.1", "score": 0.95, "translation": "Sing, goddess, the wrath of Achilles"},
    {"urn": "urn:cts:latinLit:phi0690.phi003:1.1", "text": "Arma virumque cano, Troiae qui primus ab oris", "author": "Virgil", "work": "Aeneid 1.1", "score": 0.91, "translation": "Arms and the man I sing"},
    {"urn": "urn:cts:greekLit:tlg0059.tlg030:514b", "text": "δικαιοσύνη ἐστὶν ἀρετὴ μεγίστη", "author": "Plato", "work": "Republic", "score": 0.87, "translation": "Justice is the greatest virtue"},
]

@router.post("/semantic")
async def semantic_search(req: SearchRequest):
    return {"results": DEMO[:req.limit], "query": req.query, "type": "semantic"}

@router.post("/keyword")
async def keyword_search(req: SearchRequest):
    return {"results": DEMO[:req.limit], "query": req.query, "type": "keyword"}
