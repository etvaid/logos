from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import re
from datetime import datetime

router = APIRouter(prefix="/rhetorical-genome", tags=["Rhetorical Analysis"])

class RhetoricalTechnique(BaseModel):
    name: str
    description: str
    category: str
    examples: List[str]

class AnalysisRequest(BaseModel):
    text: str
    title: Optional[str] = None
    speaker: Optional[str] = None

class RhetoricalAnalysis(BaseModel):
    technique: str
    instances: List[str]
    frequency: int
    confidence: float

class SpeechAnalysis(BaseModel):
    id: str
    title: str
    speaker: str
    text: str
    techniques: List[RhetoricalAnalysis]
    overall_score: float
    analyzed_at: datetime

class ComparisonResult(BaseModel):
    speaker_a: str
    speaker_b: str
    common_techniques: List[str]
    unique_to_a: List[str]
    unique_to_b: List[str]
    similarity_score: float

# Sample data with Cicero analysis
RHETORICAL_TECHNIQUES = {
    "anaphora": RhetoricalTechnique(
        name="Anaphora",
        description="Repetition of words at the beginning of successive clauses",
        category="repetition",
        examples=["We shall fight on the beaches, we shall fight on the landing grounds"]
    ),
    "chiasmus": RhetoricalTechnique(
        name="Chiasmus",
        description="Reversal of grammatical structures in successive phrases",
        category="structure",
        examples=["Ask not what your country can do for you—ask what you can do for your country"]
    ),
    "tricolon": RhetoricalTechnique(
        name="Tricolon",
        description="Series of three parallel words, phrases, or clauses",
        category="structure",
        examples=["Veni, vidi, vici"]
    ),
    "metaphor": RhetoricalTechnique(
        name="Metaphor",
        description="Implied comparison between two unlike things",
        category="figurative",
        examples=["All the world's a stage"]
    ),
    "alliteration": RhetoricalTechnique(
        name="Alliteration",
        description="Repetition of initial consonant sounds",
        category="sound",
        examples=["Peter Piper picked a peck of pickled peppers"]
    ),
    "rhetorical_question": RhetoricalTechnique(
        name="Rhetorical Question",
        description="Question asked for effect, not expecting an answer",
        category="interrogative",
        examples=["How long, O Catiline, will you abuse our patience?"]
    )
}

# Sample analyzed speeches with Cicero
ANALYZED_SPEECHES = {
    "cicero_catiline_1": SpeechAnalysis(
        id="cicero_catiline_1",
        title="First Catiline Oration",
        speaker="Marcus Tullius Cicero",
        text="Quo usque tandem abutere, Catilina, patientia nostra? Quam diu etiam furor iste tuus nos eludet? When, O Catiline, do you mean to cease abusing our patience? How long is that madness of yours still to mock us?",
        techniques=[
            RhetoricalAnalysis(
                technique="rhetorical_question",
                instances=["Quo usque tandem abutere, Catilina, patientia nostra?", "When, O Catiline, do you mean to cease abusing our patience?"],
                frequency=2,
                confidence=0.95
            ),
            RhetoricalAnalysis(
                technique="anaphora",
                instances=["Quo usque... Quam diu", "When... How long"],
                frequency=2,
                confidence=0.88
            ),
            RhetoricalAnalysis(
                technique="alliteration",
                instances=["Catilina... cease", "patientia... patience"],
                frequency=2,
                confidence=0.72
            )
        ],
        overall_score=0.92,
        analyzed_at=datetime.now()
    ),
    "caesar_gallic": SpeechAnalysis(
        id="caesar_gallic",
        title="Gallic Wars Address",
        speaker="Gaius Julius Caesar",
        text="Veni, vidi, vici. I came, I saw, I conquered. The die is cast, and fortune favors the bold.",
        techniques=[
            RhetoricalAnalysis(
                technique="tricolon",
                instances=["Veni, vidi, vici", "I came, I saw, I conquered"],
                frequency=2,
                confidence=0.98
            ),
            RhetoricalAnalysis(
                technique="alliteration",
                instances=["fortune favors"],
                frequency=1,
                confidence=0.85
            )
        ],
        overall_score=0.87,
        analyzed_at=datetime.now()
    )
}

def analyze_text(text: str) -> List[RhetoricalAnalysis]:
    """Analyze text for rhetorical techniques"""
    results = []
    
    # Rhetorical questions
    questions = re.findall(r'[^.!?]*\?[^.!?]*', text)
    if questions:
        results.append(RhetoricalAnalysis(
            technique="rhetorical_question",
            instances=questions,
            frequency=len(questions),
            confidence=0.85
        ))
    
    # Tricolon (three-part structure)
    tricolon_pattern = r'\b\w+,\s*\w+,\s*\w+'
    tricolons = re.findall(tricolon_pattern, text)
    if tricolons:
        results.append(RhetoricalAnalysis(
            technique="tricolon",
            instances=tricolons,
            frequency=len(tricolons),
            confidence=0.75
        ))
    
    # Alliteration
    words = re.findall(r'\b[A-Za-z]+', text.lower())
    alliterations = []
    for i in range(len(words) - 1):
        if words[i][0] == words[i + 1][0]:
            alliterations.append(f"{words[i]} {words[i + 1]}")
    
    if alliterations:
        results.append(RhetoricalAnalysis(
            technique="alliteration",
            instances=alliterations,
            frequency=len(alliterations),
            confidence=0.70
        ))
    
    # Anaphora (repeated beginnings)
    sentences = re.split(r'[.!?]', text)
    sentence_starts = [s.strip().split()[:2] for s in sentences if s.strip()]
    anaphoras = []
    
    for i in range(len(sentence_starts) - 1):
        if len(sentence_starts[i]) > 0 and len(sentence_starts[i + 1]) > 0:
            if sentence_starts[i][0].lower() == sentence_starts[i + 1][0].lower():
                anaphoras.append(f"{' '.join(sentence_starts[i])} ... {' '.join(sentence_starts[i + 1])}")
    
    if anaphoras:
        results.append(RhetoricalAnalysis(
            technique="anaphora",
            instances=anaphoras,
            frequency=len(anaphoras),
            confidence=0.80
        ))
    
    return results

@router.get("/speeches", response_model=List[SpeechAnalysis])
async def get_analyzed_speeches():
    """Get all analyzed speeches"""
    return list(ANALYZED_SPEECHES.values())

@router.post("/analyze", response_model=SpeechAnalysis)
async def analyze_speech(request: AnalysisRequest):
    """Analyze text for rhetorical techniques"""
    techniques = analyze_text(request.text)
    
    # Calculate overall score
    if techniques:
        overall_score = sum(t.confidence * t.frequency for t in techniques) / len(techniques)
        overall_score = min(overall_score, 1.0)
    else:
        overall_score = 0.0
    
    speech_id = f"analysis_{len(ANALYZED_SPEECHES) + 1}"
    
    analysis = SpeechAnalysis(
        id=speech_id,
        title=request.title or "Untitled Analysis",
        speaker=request.speaker or "Unknown Speaker",
        text=request.text,
        techniques=techniques,
        overall_score=overall_score,
        analyzed_at=datetime.now()
    )
    
    ANALYZED_SPEECHES[speech_id] = analysis
    return analysis

@router.get("/techniques", response_model=Dict[str, RhetoricalTechnique])
async def get_rhetorical_techniques():
    """Get all available rhetorical techniques"""
    return RHETORICAL_TECHNIQUES

@router.get("/compare/{speaker_a}/{speaker_b}", response_model=ComparisonResult)
async def compare_speakers(speaker_a: str, speaker_b: str):
    """Compare rhetorical techniques between two speakers"""
    
    # Find speeches by speakers
    speeches_a = [s for s in ANALYZED_SPEECHES.values() if speaker_a.lower() in s.speaker.lower()]
    speeches_b = [s for s in ANALYZED_SPEECHES.values() if speaker_b.lower() in s.speaker.lower()]
    
    if not speeches_a:
        raise HTTPException(status_code=404, detail=f"No speeches found for speaker: {speaker_a}")
    if not speeches_b:
        raise HTTPException(status_code=404, detail=f"No speeches found for speaker: {speaker_b}")
    
    # Extract techniques
    techniques_a = set()
    techniques_b = set()
    
    for speech in speeches_a:
        techniques_a.update(t.technique for t in speech.techniques)
    
    for speech in speeches_b:
        techniques_b.update(t.technique for t in speech.techniques)
    
    # Compare
    common_techniques = list(techniques_a.intersection(techniques_b))
    unique_to_a = list(techniques_a - techniques_b)
    unique_to_b = list(techniques_b - techniques_a)
    
    # Calculate similarity
    total_techniques = len(techniques_a.union(techniques_b))
    similarity_score = len(common_techniques) / total_techniques if total_techniques > 0 else 0.0
    
    return ComparisonResult(
        speaker_a=speeches_a[0].speaker,
        speaker_b=speeches_b[0].speaker,
        common_techniques=common_techniques,
        unique_to_a=unique_to_a,
        unique_to_b=unique_to_b,
        similarity_score=round(similarity_score, 2)
    )

@router.get("/speeches/{speech_id}", response_model=SpeechAnalysis)
async def get_speech_analysis(speech_id: str):
    """Get detailed analysis of a specific speech"""
    if speech_id not in ANALYZED_SPEECHES:
        raise HTTPException(status_code=404, detail="Speech analysis not found")
    
    return ANALYZED_SPEECHES[speech_id]

@router.get("/speakers/{speaker_name}/techniques", response_model=Dict[str, List[RhetoricalAnalysis]])
async def get_speaker_techniques(speaker_name: str):
    """Get all rhetorical techniques used by a specific speaker"""
    speaker_speeches = [s for s in ANALYZED_SPEECHES.values() 
                       if speaker_name.lower() in s.speaker.lower()]
    
    if not speaker_speeches:
        raise HTTPException(status_code=404, detail=f"No speeches found for speaker: {speaker_name}")
    
    techniques_summary = {}
    for speech in speaker_speeches:
        for technique in speech.techniques:
            if technique.technique not in techniques_summary:
                techniques_summary[technique.technique] = []
            techniques_summary[technique.technique].append(technique)
    
    return techniques_summary