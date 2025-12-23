from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
import base64

router = APIRouter(prefix="/palimpsest", tags=["Palimpsest Vision"])

# Data Models
class RecoveredText(BaseModel):
    id: str
    title: str
    author: str
    original_date: str
    recovery_date: datetime
    content_preview: str
    confidence_score: float
    language: str
    manuscript_source: str
    historical_significance: str

class Manuscript(BaseModel):
    id: str
    name: str
    origin: str
    estimated_age: str
    material: str
    dimensions: str
    condition: str
    layers_detected: int
    analysis_status: str
    discovered_texts: List[str]
    image_url: Optional[str]

class AnalysisRequest(BaseModel):
    manuscript_name: str
    imaging_technique: str
    resolution_dpi: int
    notes: Optional[str]

class AnalysisResult(BaseModel):
    analysis_id: str
    manuscript_name: str
    layers_found: int
    texts_recovered: List[Dict[str, str]]
    imaging_technique: str
    processing_time: float
    confidence_metrics: Dict[str, float]
    recommendations: List[str]

# Demo Data - Archimedes Palimpsest
RECOVERED_TEXTS = [
    RecoveredText(
        id="arch_001",
        title="On the Method of Mechanical Theorems",
        author="Archimedes of Syracuse",
        original_date="3rd century BCE",
        recovery_date=datetime(2005, 10, 29),
        content_preview="I thought fit to write out for you and explain in detail in the same book the peculiarity of a certain method, by which it will be possible for you to get a start to enable you to investigate some of the problems in mathematics by means of mechanics...",
        confidence_score=0.92,
        language="Ancient Greek",
        manuscript_source="Archimedes Palimpsest",
        historical_significance="Reveals Archimedes' use of infinitesimals, predating calculus by 2000 years"
    ),
    RecoveredText(
        id="arch_002",
        title="Stomachion",
        author="Archimedes of Syracuse", 
        original_date="3rd century BCE",
        recovery_date=datetime(2003, 5, 17),
        content_preview="A mathematical treatise on a puzzle similar to tangrams, exploring combinatorial geometry...",
        confidence_score=0.78,
        language="Ancient Greek",
        manuscript_source="Archimedes Palimpsest",
        historical_significance="Early work in combinatorics and recreational mathematics"
    ),
    RecoveredText(
        id="arch_003",
        title="On Floating Bodies (fragments)",
        author="Archimedes of Syracuse",
        original_date="3rd century BCE", 
        recovery_date=datetime(2007, 3, 12),
        content_preview="Additional propositions on hydrostatics and the principle of buoyancy...",
        confidence_score=0.85,
        language="Ancient Greek",
        manuscript_source="Archimedes Palimpsest",
        historical_significance="Extended understanding of Archimedes' work on fluid mechanics"
    )
]

MANUSCRIPTS = [
    Manuscript(
        id="ms_001",
        name="Archimedes Palimpsest",
        origin="Constantinople (Istanbul)",
        estimated_age="10th century CE (over 3rd century BCE original)",
        material="Parchment (goatskin)",
        dimensions="195mm × 285mm",
        condition="Heavily damaged, prayers overwritten",
        layers_detected=3,
        analysis_status="Completed",
        discovered_texts=["arch_001", "arch_002", "arch_003"],
        image_url="/images/archimedes_palimpsest.jpg"
    ),
    Manuscript(
        id="ms_002", 
        name="Syriac Galen Palimpsest",
        origin="Mar Saba Monastery",
        estimated_age="11th century CE",
        material="Parchment",
        dimensions="180mm × 240mm", 
        condition="Good, some text obscured",
        layers_detected=2,
        analysis_status="In Progress",
        discovered_texts=[],
        image_url="/images/galen_palimpsest.jpg"
    ),
    Manuscript(
        id="ms_003",
        name="Codex Ephraemi Rescriptus",
        origin="Egypt or Syria",
        estimated_age="12th century CE (over 5th century original)",
        material="Parchment",
        dimensions="210mm × 255mm",
        condition="Fair, theological overtext",
        layers_detected=2,
        analysis_status="Partially Analyzed", 
        discovered_texts=[],
        image_url="/images/ephraemi_rescriptus.jpg"
    )
]

@router.get("/discoveries", response_model=List[RecoveredText])
async def get_recovered_texts():
    """
    Retrieve all recovered texts from palimpsest analysis.
    Returns detailed information about texts discovered through multispectral imaging.
    """
    return RECOVERED_TEXTS

@router.get("/discoveries/{text_id}", response_model=RecoveredText)
async def get_recovered_text(text_id: str):
    """Get specific recovered text details"""
    text = next((t for t in RECOVERED_TEXTS if t.id == text_id), None)
    if not text:
        raise HTTPException(status_code=404, detail="Recovered text not found")
    return text

@router.get("/manuscripts", response_model=List[Manuscript])
async def get_analyzed_manuscripts():
    """
    Retrieve all manuscripts that have been analyzed for palimpsest recovery.
    Includes analysis status and discovered content information.
    """
    return MANUSCRIPTS

@router.get("/manuscripts/{manuscript_id}", response_model=Manuscript) 
async def get_manuscript(manuscript_id: str):
    """Get specific manuscript details"""
    manuscript = next((m for m in MANUSCRIPTS if m.id == manuscript_id), None)
    if not manuscript:
        raise HTTPException(status_code=404, detail="Manuscript not found")
    return manuscript

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_manuscript_image(
    file: UploadFile = File(...),
    request: AnalysisRequest = None
):
    """
    Analyze uploaded manuscript image using multispectral imaging techniques
    to reveal underlying texts in palimpsests.
    """
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Simulate analysis processing
    import uuid
    import random
    
    analysis_id = str(uuid.uuid4())
    manuscript_name = request.manuscript_name if request else file.filename
    
    # Simulated analysis results
    layers_found = random.randint(1, 4)
    processing_time = random.uniform(45.5, 180.2)
    
    texts_recovered = []
    if layers_found > 1:
        texts_recovered = [
            {
                "layer": "2",
                "content_type": "Mathematical treatise",
                "language": "Ancient Greek", 
                "confidence": "0.87",
                "preview": "Περὶ μηχανικῶν θεωρημάτων πρὸς Ἐρατοσθένη μέθοδος..."
            },
            {
                "layer": "3", 
                "content_type": "Geometric diagrams",
                "language": "Ancient Greek",
                "confidence": "0.73",
                "preview": "[Geometric figures and calculations visible]"
            }
        ]
    
    confidence_metrics = {
        "text_clarity": random.uniform(0.65, 0.95),
        "layer_separation": random.uniform(0.70, 0.88), 
        "character_recognition": random.uniform(0.75, 0.92),
        "overall_quality": random.uniform(0.68, 0.89)
    }
    
    recommendations = [
        "Apply UV fluorescence imaging for better text contrast",
        "Use narrower spectral bands (650-680nm) for ink differentiation", 
        "Consider RTI (Reflectance Transformation Imaging) for surface details",
        "Digitize at higher resolution (600+ DPI) for character clarity"
    ]
    
    if confidence_metrics["overall_quality"] < 0.75:
        recommendations.extend([
            "Manuscript may benefit from conservation treatment",
            "Consider X-ray fluorescence for ink composition analysis"
        ])
    
    return AnalysisResult(
        analysis_id=analysis_id,
        manuscript_name=manuscript_name,
        layers_found=layers_found,
        texts_recovered=texts_recovered,
        imaging_technique=request.imaging_technique if request else "Multispectral",
        processing_time=processing_time,
        confidence_metrics=confidence_metrics,
        recommendations=recommendations
    )

@router.get("/analysis-techniques")
async def get_analysis_techniques():
    """Get available manuscript analysis techniques"""
    return {
        "techniques": [
            {
                "name": "Multispectral Imaging",
                "description": "Captures images at multiple wavelengths to reveal hidden text",
                "wavelength_range": "365-950nm",
                "best_for": "Iron gall ink detection"
            },
            {
                "name": "UV Fluorescence",
                "description": "Uses ultraviolet light to make inks fluoresce",
                "wavelength_range": "365nm excitation",
                "best_for": "Parchment and ink differentiation"
            },
            {
                "name": "Infrared Reflectance", 
                "description": "Penetrates surface layers to reveal underlying text",
                "wavelength_range": "700-1000nm",
                "best_for": "Carbon-based inks"
            },
            {
                "name": "X-ray Fluorescence",
                "description": "Identifies elemental composition of inks",
                "technique_type": "Spectroscopic",
                "best_for": "Metallic ink analysis"
            }
        ]
    }

@router.get("/statistics")
async def get_palimpsest_statistics():
    """Get statistics about palimpsest recovery efforts"""
    return {
        "total_manuscripts_analyzed": len(MANUSCRIPTS),
        "total_texts_recovered": len(RECOVERED_TEXTS),
        "success_rate": 0.75,
        "average_confidence_score": 0.85,
        "languages_recovered": ["Ancient Greek", "Latin", "Syriac", "Arabic"],
        "time_periods_covered": "3rd century BCE - 15th century CE",
        "most_significant_discovery": {
            "title": "On the Method of Mechanical Theorems",
            "significance": "Revealed Archimedes' early use of integral calculus concepts"
        }
    }