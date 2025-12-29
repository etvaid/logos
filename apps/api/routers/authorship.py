
from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Dict, Any, List

router = APIRouter()

class AttributeRequest(BaseModel):
    text: str
    language: str = "greek"

# Greek function words for stylometry
GREEK_FUNCTION_WORDS = ["καί", "δέ", "γάρ", "μέν", "οὖν", "τε", "ἀλλά", "εἰ", "ὡς", "ἐν"]
LATIN_FUNCTION_WORDS = ["et", "sed", "enim", "autem", "nam", "cum", "in", "ad", "ut", "quod"]

@router.post("/attribute")
async def attribute_text(request: Request, req: AttributeRequest) -> Dict[str, Any]:
    """Attribute text to likely author using stylometry"""
    text = req.text.lower()
    
    # Count function words
    function_words = GREEK_FUNCTION_WORDS if req.language == "greek" else LATIN_FUNCTION_WORDS
    word_freqs = {}
    for word in function_words:
        count = text.count(word)
        word_freqs[word] = count
    
    # Simple heuristic (real version would use trained models)
    return {
        "text_length": len(req.text),
        "language": req.language,
        "function_word_profile": word_freqs,
        "candidates": [
            {"author": "Unknown", "confidence": 0.0, "method": "function_word_analysis"}
        ],
        "status": "basic_analysis",
        "message": "Full attribution requires author profile database"
    }

@router.get("/authors")
async def list_authors(request: Request) -> Dict[str, Any]:
    """List all authors with stylometric profiles"""
    try:
        pool = request.app.state.db_pool
        async with pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT DISTINCT author, language, COUNT(*) as passage_count
                FROM source_texts
                WHERE author IS NOT NULL
                GROUP BY author, language
                ORDER BY passage_count DESC
                LIMIT 100
            """)
            
            return {
                "authors": [
                    {
                        "name": r['author'],
                        "language": r['language'],
                        "passage_count": r['passage_count'],
                        "has_profile": False
                    }
                    for r in rows
                ],
                "total": len(rows)
            }
    except Exception as e:
        return {"authors": [], "error": str(e)}

@router.get("/disputed")
async def get_disputed_texts() -> Dict[str, Any]:
    """List famous disputed texts"""
    return {
        "texts": [
            {
                "id": "doloneia",
                "title": "Doloneia (Iliad Book 10)",
                "traditional_author": "Homer",
                "disputed_by": ["Aristarchus", "Modern scholars"],
                "arguments": "Stylistic differences, late vocabulary"
            },
            {
                "id": "prometheus_bound",
                "title": "Prometheus Bound",
                "traditional_author": "Aeschylus",
                "disputed_by": ["Mark Griffith"],
                "arguments": "Unusual meter, theological differences"
            },
            {
                "id": "rhesus",
                "title": "Rhesus",
                "traditional_author": "Euripides",
                "disputed_by": ["Multiple scholars"],
                "arguments": "Fourth-century production elements"
            }
        ]
    }

@router.get("/author/{name}/fingerprint")
async def get_fingerprint(request: Request, name: str) -> Dict[str, Any]:
    """Get stylometric fingerprint for an author"""
    return {
        "author": name,
        "fingerprint": {
            "mean_sentence_length": 0.0,
            "vocabulary_richness": 0.0,
            "function_word_freqs": {},
            "particle_usage": 0.0
        },
        "status": "fingerprint_pending"
    }
