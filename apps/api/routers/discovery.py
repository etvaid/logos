from fastapi import APIRouter, Request
from typing import Dict, Any
from pydantic import BaseModel

router = APIRouter()

PATTERNS = [
    {"id": "p1", "order": 1, "type": "Syntactic", "pattern": "Genitive Absolute", "confidence": 0.92, "frequency": 15420, "description": "Participial clause in genitive case"},
    {"id": "p2", "order": 1, "type": "Syntactic", "pattern": "Accusative of Respect", "confidence": 0.88, "frequency": 8350, "description": "Accusative specifying the respect in which something is true"},
    {"id": "p3", "order": 2, "type": "Semantic", "pattern": "Ship of State Metaphor", "confidence": 0.85, "frequency": 234, "description": "Political community as a ship navigating"},
    {"id": "p4", "order": 2, "type": "Semantic", "pattern": "Body Politic", "confidence": 0.82, "frequency": 189, "description": "State as a human body with parts"},
    {"id": "p5", "order": 3, "type": "Thematic", "pattern": "Nostos Theme", "confidence": 0.91, "frequency": 456, "description": "Return home after long journey"},
    {"id": "p6", "order": 3, "type": "Thematic", "pattern": "Kleos vs Nostos", "confidence": 0.89, "frequency": 123, "description": "Glory vs homecoming tension"},
    {"id": "p7", "order": 4, "type": "Stylistic", "pattern": "Homeric Simile", "confidence": 0.95, "frequency": 2350, "description": "Extended epic simile pattern"},
    {"id": "p8", "order": 4, "type": "Stylistic", "pattern": "Ring Composition", "confidence": 0.87, "frequency": 567, "description": "ABCBA structural pattern"},
]

HYPOTHESES = [
    {"id": "h1", "title": "Homeric Authorship Unity", "description": "Statistical analysis of style variation across Iliad and Odyssey", "difficulty": "Advanced", "estimated_time": "40 hours"},
    {"id": "h2", "title": "Platonic Dialogue Evolution", "description": "Track stylistic changes from early to late dialogues", "difficulty": "Intermediate", "estimated_time": "20 hours"},
    {"id": "h3", "title": "Roman Reception of Greek Tragedy", "description": "Intertextual connections between Greek tragedians and Seneca", "difficulty": "Advanced", "estimated_time": "60 hours"},
    {"id": "h4", "title": "Function Word Evolution", "description": "How Greek particles changed from Homer to Koine", "difficulty": "Intermediate", "estimated_time": "30 hours"},
]

@router.get("/patterns")
async def get_patterns() -> Dict[str, Any]:
    return {"patterns": PATTERNS}

@router.get("/hypotheses")
async def get_hypotheses() -> Dict[str, Any]:
    return {"hypotheses": HYPOTHESES}

class GenerateRequest(BaseModel):
    pattern_ids: list
    format: str = "latex"

@router.post("/generate")
async def generate_paper(data: GenerateRequest) -> Dict[str, Any]:
    """Generate research paper from patterns"""
    selected = [p for p in PATTERNS if p['id'] in data.pattern_ids]
    return {
        "status": "generated",
        "patterns_used": len(selected),
        "format": data.format,
        "preview": "\\section{Introduction}\nThis paper analyzes patterns in classical texts..."
    }

@router.get("/")
async def root() -> Dict[str, Any]:
    return {"status": "ready", "description": "DISCOVERY - AI pattern detection"}