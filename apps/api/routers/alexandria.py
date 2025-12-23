from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import datetime

router = APIRouter(prefix="/alexandria", tags=["Alexandria Simulator"])

# Data Models
class PhilosophicalSchool(BaseModel):
    id: str
    name: str
    founder: str
    founded_year: int
    location: str
    core_teachings: List[str]
    notable_figures: List[str]
    influence_period: str
    description: str

class Library(BaseModel):
    id: str
    name: str
    location: str
    established_year: int
    estimated_volumes: int
    notable_collections: List[str]
    famous_scholars: List[str]
    fate: str
    description: str

class QueryRequest(BaseModel):
    query: str
    context: Optional[str] = None
    time_period: Optional[str] = None

class QueryResponse(BaseModel):
    query: str
    analysis: str
    key_connections: List[Dict[str, Any]]
    sources: List[str]
    timeline: List[Dict[str, Any]]

class IntellectualEcosystem(BaseModel):
    period: str
    dominant_schools: List[str]
    key_figures: List[Dict[str, str]]
    major_works: List[Dict[str, str]]
    cultural_context: str
    cross_influences: List[Dict[str, str]]

# Demo Data
PHILOSOPHICAL_SCHOOLS = {
    "academy": PhilosophicalSchool(
        id="academy",
        name="Platonic Academy",
        founder="Plato",
        founded_year=-387,
        location="Athens",
        core_teachings=[
            "Theory of Forms",
            "Philosopher-kings",
            "Tripartite soul",
            "Mathematical foundations of reality",
            "Dialectical method"
        ],
        notable_figures=[
            "Plato",
            "Speusippus",
            "Xenocrates",
            "Polemon",
            "Carneades"
        ],
        influence_period="387 BCE - 529 CE",
        description="Founded by Plato, the Academy was the first institution of higher learning in the Western world, emphasizing mathematics, philosophy, and dialectical reasoning."
    ),
    "lyceum": PhilosophicalSchool(
        id="lyceum",
        name="Aristotelian Lyceum",
        founder="Aristotle",
        founded_year=-335,
        location="Athens",
        core_teachings=[
            "Empirical observation",
            "Categorical logic",
            "Four causes",
            "Golden mean",
            "Biological classification"
        ],
        notable_figures=[
            "Aristotle",
            "Theophrastus",
            "Strato of Lampsacus",
            "Alexander of Aphrodisias"
        ],
        influence_period="335 BCE - 200 CE",
        description="Aristotle's school emphasized empirical research and systematic classification, producing comprehensive works on logic, biology, ethics, and politics."
    ),
    "stoa": PhilosophicalSchool(
        id="stoa",
        name="Stoic School",
        founder="Zeno of Citium",
        founded_year=-300,
        location="Athens (Stoa Poikile)",
        core_teachings=[
            "Virtue as the only good",
            "Living according to nature",
            "Cosmic sympathy",
            "Emotional detachment",
            "Universal reason (Logos)"
        ],
        notable_figures=[
            "Zeno of Citium",
            "Chrysippus",
            "Epictetus",
            "Marcus Aurelius",
            "Seneca"
        ],
        influence_period="300 BCE - 500 CE",
        description="The Stoic school taught that virtue is the only true good and that living in accordance with nature and reason leads to happiness."
    ),
    "epicurean": PhilosophicalSchool(
        id="epicurean",
        name="Epicurean Garden",
        founder="Epicurus",
        founded_year=-307,
        location="Athens",
        core_teachings=[
            "Pleasure as the highest good",
            "Atomic materialism",
            "Absence of fear (ataraxia)",
            "Friendship and community",
            "Rejection of superstition"
        ],
        notable_figures=[
            "Epicurus",
            "Metrodorus",
            "Hermarchus",
            "Lucretius"
        ],
        influence_period="307 BCE - 200 CE",
        description="The Garden of Epicurus promoted a philosophy of simple pleasures, friendship, and freedom from fear through rational understanding of nature."
    )
}

ANCIENT_LIBRARIES = {
    "alexandria": Library(
        id="alexandria",
        name="Library of Alexandria",
        location="Alexandria, Egypt",
        established_year=-295,
        estimated_volumes=700000,
        notable_collections=[
            "Complete works of Greek literature",
            "Egyptian papyri",
            "Mesopotamian texts",
            "Mathematical treatises",
            "Medical texts",
            "Astronomical observations"
        ],
        famous_scholars=[
            "Euclid",
            "Archimedes",
            "Eratosthenes",
            "Apollonius",
            "Hipparchus",
            "Ptolemy"
        ],
        fate="Gradual decline from 48 BCE to 642 CE",
        description="The greatest library of the ancient world, attempting to collect all human knowledge and serving as the premier center of learning."
    ),
    "pergamon": Library(
        id="pergamon",
        name="Library of Pergamon",
        location="Pergamon, Asia Minor",
        established_year=-197,
        estimated_volumes=200000,
        notable_collections=[
            "Greek manuscripts",
            "Philosophical texts",
            "Scientific treatises",
            "Historical works"
        ],
        famous_scholars=[
            "Crates of Mallus",
            "Apollodorus",
            "Dionysius Thrax"
        ],
        fate="Collection moved to Alexandria by Mark Antony in 41 BCE",
        description="Second greatest library of antiquity, famous for developing parchment as an alternative to papyrus."
    ),
    "athens": Library(
        id="athens",
        name="Library of Hadrian",
        location="Athens, Greece",
        established_year=132,
        estimated_volumes=100000,
        notable_collections=[
            "Classical Greek texts",
            "Roman literature",
            "Legal documents",
            "Philosophical manuscripts"
        ],
        famous_scholars=[
            "Herodes Atticus",
            "Pausanias",
            "Aelius Aristides"
        ],
        fate="Destroyed by Herulian invasion in 267 CE",
        description="Built by Emperor Hadrian as part of his philhellenic cultural program, preserving classical Greek learning."
    )
}

@router.get("/schools", response_model=List[PhilosophicalSchool])
async def get_philosophical_schools(
    location: Optional[str] = Query(None, description="Filter by location"),
    period: Optional[str] = Query(None, description="Filter by time period")
):
    """Get information about major philosophical schools of antiquity."""
    schools = list(PHILOSOPHICAL_SCHOOLS.values())
    
    if location:
        schools = [s for s in schools if location.lower() in s.location.lower()]
    
    return schools

@router.get("/schools/{school_id}", response_model=PhilosophicalSchool)
async def get_school_details(school_id: str):
    """Get detailed information about a specific philosophical school."""
    if school_id not in PHILOSOPHICAL_SCHOOLS:
        raise HTTPException(status_code=404, detail=f"School '{school_id}' not found")
    
    return PHILOSOPHICAL_SCHOOLS[school_id]

@router.get("/libraries", response_model=List[Library])
async def get_ancient_libraries(
    min_volumes: Optional[int] = Query(None, description="Minimum number of volumes")
):
    """Get information about major ancient libraries."""
    libraries = list(ANCIENT_LIBRARIES.values())
    
    if min_volumes:
        libraries = [lib for lib in libraries if lib.estimated_volumes >= min_volumes]
    
    return libraries

@router.get("/libraries/{library_id}", response_model=Library)
async def get_library_details(library_id: str):
    """Get detailed information about a specific ancient library."""
    if library_id not in ANCIENT_LIBRARIES:
        raise HTTPException(status_code=404, detail=f"Library '{library_id}' not found")
    
    return ANCIENT_LIBRARIES[library_id]

@router.post("/query", response_model=QueryResponse)
async def analyze_philosophical_query(request: QueryRequest):
    """Analyze philosophical influences and connections."""
    query = request.query.lower()
    
    # Example analysis for Platonic influences on Christianity
    if "platonic" in query and "christian" in query:
        return QueryResponse(
            query=request.query,
            analysis="""Platonic philosophy profoundly influenced early Christian thought through several key pathways. 
            The Platonic Theory of Forms provided a framework for understanding divine perfection and transcendence, 
            while Platonic metaphysics offered tools for articulating the relationship between the material and spiritual realms. 
            Key figures like Augustine of Hippo synthesized Platonic idealism with Christian doctrine, creating lasting 
            theological foundations.""",
            key_connections=[
                {
                    "concept": "Theory of Forms",
                    "platonic_aspect": "Eternal, perfect archetypes",
                    "christian_adaptation": "Divine attributes and heavenly realm",
                    "influence_strength": "high"
                },
                {
                    "concept": "Soul's ascent",
                    "platonic_aspect": "Philosophical contemplation leading to the Good",
                    "christian_adaptation": "Mystical union with God",
                    "influence_strength": "high"
                },
                {
                    "concept": "Dualism",
                    "platonic_aspect": "Material vs. spiritual reality",
                    "christian_adaptation": "Body vs. soul, earthly vs. heavenly",
                    "influence_strength": "medium"
                }
            ],
            sources=[
                "Augustine's Confessions and City of God",
                "Pseudo-Dionysius the Areopagite",
                "Clement of Alexandria",
                "Justin Martyr's Apologies"
            ],
            timeline=[
                {"period": "50-150 CE", "development": "Early Christian encounters with Greek philosophy"},
                {"period": "150-250 CE", "development": "Alexandrian school synthesis (Clement, Origen)"},
                {"period": "354-430 CE", "development": "Augustine's comprehensive integration"},
                {"period": "500-600 CE", "development": "Pseudo-Dionysian mystical theology"}
            ]
        )
    
    # Stoic influence analysis
    elif "stoic" in query:
        return QueryResponse(
            query=request.query,
            analysis="""Stoicism provided practical ethical frameworks and cosmological concepts that influenced various 
            philosophical and religious traditions. The Stoic emphasis on virtue, rational order, and cosmic sympathy 
            created bridges between Greek philosophy and later Roman, Christian, and Islamic thought.""",
            key_connections=[
                {
                    "concept": "Logos",
                    "stoic_aspect": "Universal reason governing cosmos",
                    "later_influence": "Christian Word/Logos theology",
                    "influence_strength": "high"
                },
                {
                    "concept": "Natural Law",
                    "stoic_aspect": "Rational principles governing behavior",
                    "later_influence": "Roman jurisprudence and Christian ethics",
                    "influence_strength": "high"
                }
            ],
            sources=[
                "Marcus Aurelius' Meditations",
                "Epictetus' Discourses",
                "Seneca's Letters",
                "Cicero's De Officiis"
            ],
            timeline=[
                {"period": "300-200 BCE", "development": "Early Stoic foundations"},
                {"period": "100 BCE-200 CE", "development": "Roman Stoicism"},
                {"period": "200-500 CE", "development": "Christian appropriation of Stoic ethics"}
            ]
        )
    
    else:
        return QueryResponse(
            query=request.query,
            analysis=f"Analysis for '{request.query}' would explore the philosophical connections and historical influences related to this topic.",
            key_connections=[
                {
                    "concept": "General philosophical inquiry",
                    "description": "Cross-cultural philosophical exchange",
                    "influence_strength": "variable"
                }
            ],
            sources=["Various ancient sources"],
            timeline=[{"period": "General", "development": "Ongoing philosophical development"}]
        )

@router.get("/ecosystem/{period}", response_model=IntellectualEcosystem)
async def get_intellectual_ecosystem(period: str):
    """Get the intellectual ecosystem for a specific historical period."""
    
    ecosystems = {
        "hellenistic": IntellectualEcosystem(
            period="Hellenistic Period (323-146 BCE)",
            dominant_schools=["Stoicism", "Epicureanism", "Skepticism", "Cynicism"],
            key_figures=[
                {"name": "Zeno of Citium", "school": "Stoicism", "contribution": "Founded Stoic school"},
                {"name": "Epicurus", "school": "Epicureanism", "contribution": "Pleasure-based ethics"},
                {"name": "Pyrrho", "school": "Skepticism", "contribution": "Systematic doubt"},
                {"name": "Euclid", "field": "Mathematics", "contribution": "Elements of geometry"}
            ],
            major_works=[
                {"title": "Elements", "author": "Euclid", "field": "Mathematics"},
                {"title": "Letter to Menoeceus", "author": "Epicurus", "field": "Ethics"},
                {"title": "On the Heavens", "author": "Aristotle", "field": "Cosmology"}
            ],
            cultural_context="Post-Alexandrine cosmopolitan culture with emphasis on individual ethics and practical philosophy in an uncertain political landscape.",
            cross_influences=[
                {"from": "Eastern wisdom traditions", "to": "Greek philosophy", "nature": "Mystical and practical elements"},
                {"from": "Aristotelian science", "to": "Hellenistic research", "nature": "Empirical methodology"},
                {"from": "Platonic idealism", "to": "Religious thought", "nature": "Transcendent metaphysics"}
            ]
        ),
        "roman": IntellectualEcosystem(
            period="Roman Imperial Period (27 BCE - 476 CE)",
            dominant_schools=["Roman Stoicism", "Neo-Platonism", "Early Christianity"],
            key_figures=[
                {"name": "Marcus Aurelius", "school": "Stoicism", "contribution": "Meditations on Stoic practice"},
                {"name": "Plotinus", "school": "Neo-Platonism", "contribution": "The Enneads"},
                {"name": "Augustine", "school": "Christian Philosophy", "contribution": "Synthesis of faith and reason"},
                {"name": "Boethius", "field": "Philosophy", "contribution": "Consolation of Philosophy"}
            ],
            major_works=[
                {"title": "Meditations", "author": "Marcus Aurelius", "field": "Ethics"},
                {"title": "Enneads", "author": "Plotinus", "field": "Metaphysics"},
                {"title": "Confessions", "author": "Augustine", "field": "Autobiography/Theology"},
                {"title": "Natural History", "author": "Pliny the Elder", "field": "Natural Science"}
            ],
            cultural_context="Imperial Roman culture blending Greek philosophical traditions with Roman practical governance and emerging Christian theology.",
            cross_influences=[
                {"from": "Stoicism", "to": "Roman law and governance", "nature": "Natural law theory"},
                {"from": "Platonism", "to": "Christian theology", "nature": "Metaphysical framework"},
                {"from": "Eastern Christianity", "to": "Western theology", "nature": "Mystical traditions"}
            ]
        ),
        "late_antique": IntellectualEcosystem(
            period="Late Antiquity (300-600 CE)",
            dominant_schools=["Christian Theology", "Neo-Platonism", "Islamic Philosophy"],
            key_figures=[
                {"name": "Augustine of Hippo", "school": "Christian Philosophy", "contribution": "City of God"},
                {"name": "Proclus", "school": "Neo-Platonism", "contribution": "Systematic Neo-Platonic theology"},
                {"name": "Boethius", "field": "Philosophy", "contribution": "Transmitted Greek philosophy to medieval world"},
                {"name": "John Damascene", "school": "Christian Theology", "contribution": "Systematic theology"}
            ],
            major_works=[
                {"title": "City of God", "author": "Augustine", "field": "Political Theology"},
                {"title": "Elements of Theology", "author": "Proclus", "field": "Metaphysics"},
                {"title": "Consolation of Philosophy", "author": "Boethius", "field": "Ethics"},
                {"title": "Fount of Knowledge", "author": "John Damascene", "field": "Theology"}
            ],
            cultural_context="Transition from classical antiquity to medieval period, with Christianity becoming dominant while preserving and transforming Greek philosophical heritage.",
            cross_influences=[
                {"from": "Greek philosophy", "to": "Christian theology", "nature": "Systematic rational framework"},
                {"from": "Eastern monasticism", "to": "Western Christianity", "nature": "Mystical practices"},
                {"from": "Roman legal tradition", "to": "Canon law", "nature": "Institutional structure"}
            ]
        )
    }
    
    period_key = period.lower().replace(" ", "_").replace("-", "_")
    
    if period_key not in ecosystems:
        available_periods = list(ecosystems.keys())
        raise HTTPException(
            status_code=404, 
            detail=f"Period '{period}' not found. Available periods: {', '.join(available_periods)}"
        )
    
    return ecosystems[period_key]

@router.get("/ecosystem", response_model=List[str])
async def list_available_periods():
    """List all available historical periods for ecosystem analysis."""
    return [
        "hellenistic",
        "roman", 
        "late_antique"
    ]