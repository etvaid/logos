#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                              ║
║   LOGOS CREWAI MEGA-BUILD v1.0                                                                               ║
║   ═══════════════════════════════════════════════════════════════════════════════════════════════════════    ║
║                                                                                                              ║
║   COMPREHENSIVE BUILD SYSTEM FOR ALL 100+ FEATURES                                                           ║
║                                                                                                              ║
║   PRINCIPLES:                                                                                                ║
║   • NEVER fabricate data - all numbers from database queries                                                 ║
║   • ALWAYS verify before proceeding                                                                          ║
║   • PAUSE and ASK human if uncertain                                                                         ║
║   • TRIPLE-CHECK all outputs                                                                                 ║
║   • SCIENTIFIC rigor in all analysis                                                                         ║
║   • HONEST about limitations                                                                                 ║
║                                                                                                              ║
║   HIERARCHY:                                                                                                 ║
║   👑 CLAUDE MASTER (Extended Thinking) - Final authority, strategic decisions                                ║
║       ├── 💻 Backend Chief (Claude) → Backend Workers (Gemini)                                               ║
║       ├── 🎨 Frontend Chief (Claude) → Frontend Workers (Gemini)                                             ║
║       ├── 📊 Data Chief (Claude) → Data Workers (Gemini)                                                     ║
║       ├── 🧪 QA Chief (Claude) → QA Workers (Gemini)                                                         ║
║       └── 🔍 Verification Council (Claude + Gemini + GPT-4o - 3/4 consensus required)                        ║
║                                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

VERIFIED DATA SOURCES (from Railway PostgreSQL):
────────────────────────────────────────────────
Table                    | Rows      | Status
─────────────────────────|───────────|────────
texts                    | 121,184   | ✅ English translations
source_texts             | 4,200+    | 🔄 Greek uploading
author_profiles          | 380       | ✅ Computed from corpus
translator_profiles      | 38        | ✅ Computed from corpus
text_style_vectors       | 50,000    | ✅ 20-dimensional
word_embeddings          | 20,960    | ✅ Needs recompute on Greek

NEVER USE THESE NUMBERS WITHOUT QUERYING DATABASE FIRST.
The Master agent MUST verify counts before any task uses them.
"""

import os
import json
import asyncio
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path

# =============================================================================
# CONFIGURATION - VERIFIED FROM CONVERSATIONS
# =============================================================================

DATABASE_URL = os.environ.get(
    "DATABASE_URL", 
    os.getenv("DATABASE_URL", "")
)

# API Keys - Set directly
os.environ["ANTHROPIC_API_KEY"] = "ANTHROPIC_API_KEY_REMOVED"
os.environ["OPENAI_API_KEY"] = "OPENAI_API_KEY_REMOVED"
os.environ["GOOGLE_API_KEY"] = "AIzaSyCWzAtEzVzfmlrSC18UePrHFwSR-rf9hKM"
os.environ["XAI_API_KEY"] = "XAI_API_KEY_REMOVED"

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

# Output directories
OUTPUT_DIR = Path.home() / "Downloads" / "LOGOS_CREW_OUTPUT"
BACKEND_DIR = OUTPUT_DIR / "backend"
FRONTEND_DIR = OUTPUT_DIR / "frontend"
DOCS_DIR = OUTPUT_DIR / "docs"
TESTS_DIR = OUTPUT_DIR / "tests"

# =============================================================================
# LOGGING WITH HONESTY CHECKS
# =============================================================================

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(OUTPUT_DIR / "build.log") if OUTPUT_DIR.exists() else logging.StreamHandler()
    ]
)
logger = logging.getLogger("LOGOS_CREW")

# =============================================================================
# DATA INTEGRITY - NEVER FABRICATE
# =============================================================================

@dataclass
class VerifiedData:
    """All data must be verified from database before use."""
    table_name: str
    row_count: int
    verified_at: datetime
    sample_data: Optional[Dict] = None
    
    def is_stale(self, max_age_minutes: int = 30) -> bool:
        age = (datetime.now() - self.verified_at).total_seconds() / 60
        return age > max_age_minutes


class DataVerifier:
    """Verifies all data comes from real sources, not fabrication."""
    
    def __init__(self, db_url: str):
        self.db_url = db_url
        self.verified_cache: Dict[str, VerifiedData] = {}
        
    async def verify_table(self, table_name: str) -> VerifiedData:
        """Query database to verify table exists and get real count."""
        try:
            import psycopg2
            conn = psycopg2.connect(self.db_url)
            cur = conn.cursor()
            
            # Get actual count
            cur.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cur.fetchone()[0]
            
            # Get sample
            cur.execute(f"SELECT * FROM {table_name} LIMIT 1")
            sample = cur.fetchone()
            columns = [desc[0] for desc in cur.description] if cur.description else []
            sample_dict = dict(zip(columns, sample)) if sample else None
            
            conn.close()
            
            verified = VerifiedData(
                table_name=table_name,
                row_count=count,
                verified_at=datetime.now(),
                sample_data=sample_dict
            )
            self.verified_cache[table_name] = verified
            
            logger.info(f"✓ VERIFIED: {table_name} has {count:,} rows")
            return verified
            
        except Exception as e:
            logger.error(f"✗ FAILED to verify {table_name}: {e}")
            raise RuntimeError(f"Cannot proceed without verified data for {table_name}")
    
    async def verify_all_required_tables(self) -> Dict[str, VerifiedData]:
        """Verify all tables needed for build."""
        required = [
            "texts", "source_texts", "author_profiles", "translator_profiles",
            "text_style_vectors", "word_embeddings", "semantic_neighbors",
            "temporal_embeddings", "intertextual_links"
        ]
        
        results = {}
        for table in required:
            try:
                results[table] = await self.verify_table(table)
            except:
                logger.warning(f"Table {table} not found - will need to be created")
                results[table] = None
        
        return results


# =============================================================================
# HONESTY ENFORCEMENT
# =============================================================================

class HonestyChecker:
    """Ensures all agent outputs are honest and verifiable."""
    
    FORBIDDEN_PATTERNS = [
        r"approximately \d+",  # No vague approximations
        r"around \d+",
        r"about \d+ ",
        r"~\d+",  # No tildes for estimates
        r"estimated at",
        r"believed to be",
        r"probably",
        r"might have",
        r"could be around",
    ]
    
    FABRICATION_RED_FLAGS = [
        "892,317",  # Old embedding count - must verify current
        "1,708,058",  # Old passage count - must verify
        "500,000+",  # Must be exact or queried
    ]
    
    @classmethod
    def check_output(cls, text: str, verified_data: Dict[str, VerifiedData]) -> Tuple[bool, List[str]]:
        """Check if output contains fabricated data."""
        import re
        issues = []
        
        # Check for forbidden patterns
        for pattern in cls.FORBIDDEN_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                issues.append(f"Contains vague estimate: '{pattern}'")
        
        # Check for known fabrication red flags
        for flag in cls.FABRICATION_RED_FLAGS:
            if flag in text:
                issues.append(f"Contains unverified number: '{flag}' - must query database")
        
        # Check if numbers match verified data
        numbers_in_text = re.findall(r'\b(\d{1,3}(?:,\d{3})*)\b', text)
        for num_str in numbers_in_text:
            num = int(num_str.replace(",", ""))
            if num > 1000:  # Only check large numbers
                matched = False
                for table, data in verified_data.items():
                    if data and data.row_count == num:
                        matched = True
                        break
                if not matched and num > 10000:
                    issues.append(f"Large number {num_str} not found in verified data - may be fabricated")
        
        return len(issues) == 0, issues


# =============================================================================
# AGENT DEFINITIONS
# =============================================================================

class AgentRole(Enum):
    MASTER = "master"
    CHIEF = "chief"
    WORKER = "worker"
    VERIFIER = "verifier"


@dataclass
class Agent:
    """Base agent with honesty enforcement."""
    agent_id: str
    role: AgentRole
    model: str  # claude-sonnet-4-20250514, gemini-1.5-flash, gpt-4o
    system_prompt: str
    tasks_completed: int = 0
    errors: List[str] = field(default_factory=list)
    
    # Honesty rules - CRITICAL
    honesty_rules: str = """
    HONESTY RULES (VIOLATION = IMMEDIATE TERMINATION):
    
    1. NEVER fabricate numbers - always query database
    2. NEVER say "approximately" or "about" for data counts
    3. ALWAYS cite the exact table and query used
    4. IF UNCERTAIN, say "I need to verify this" and PAUSE
    5. NEVER proceed if data seems wrong - ASK HUMAN
    6. TRIPLE-CHECK all statistics before outputting
    7. If asked to make up data, REFUSE and report to Master
    8. All scholarly claims must cite actual sources
    9. Do not hallucinate author dates, work attributions, or linguistic facts
    10. When in doubt, output: "[VERIFICATION NEEDED: <what needs checking>]"
    """


# =============================================================================
# MASTER ORCHESTRATOR - SUPREME AUTHORITY
# =============================================================================

class MasterOrchestrator:
    """
    👑 CLAUDE MASTER ORCHESTRATOR
    
    The supreme authority coordinating all agents. Makes all executive decisions.
    Uses extended thinking for complex problems.
    
    RESPONSIBILITIES:
    - Verify all data before allowing tasks to proceed
    - Approve or reject agent outputs
    - Resolve conflicts between agents
    - PAUSE and ask human when uncertain
    - Ensure scientific rigor throughout
    """
    
    SYSTEM_PROMPT = """You are the MASTER ORCHESTRATOR for building LOGOS - the most advanced classical studies platform.

YOUR ABSOLUTE RULES:
1. NEVER allow fabricated data to pass. Every number must come from a verified database query.
2. NEVER proceed if uncertain. PAUSE and ask the human for clarification.
3. ALWAYS triple-check outputs from worker agents.
4. If any agent tries to fabricate data, TERMINATE that agent's task and report.
5. Scientific rigor is non-negotiable.

YOUR POWERS:
- Approve or reject any agent's work
- Reassign tasks between agents
- Pause execution to ask human
- Terminate any task that violates honesty rules

VERIFIED DATA (query database to update):
- texts: 121,184 rows (English translations)
- source_texts: ~4,200 rows (Greek originals, still uploading)
- author_profiles: 380 rows (computed from corpus)
- translator_profiles: 38 rows (computed from corpus)
- text_style_vectors: 50,000 rows

BEFORE ANY TASK USES DATA:
1. Query the actual table count
2. Store the verified count
3. Only use verified numbers in outputs
"""
    
    def __init__(self, verifier: DataVerifier):
        self.verifier = verifier
        self.verified_data: Dict[str, VerifiedData] = {}
        self.pending_human_questions: List[str] = []
        self.execution_paused = False
        
    async def initialize(self):
        """Initialize by verifying all data sources."""
        logger.info("=" * 70)
        logger.info("👑 MASTER ORCHESTRATOR INITIALIZING")
        logger.info("=" * 70)
        logger.info("Verifying all data sources before proceeding...")
        
        self.verified_data = await self.verifier.verify_all_required_tables()
        
        logger.info("-" * 70)
        logger.info("VERIFIED DATA SUMMARY:")
        for table, data in self.verified_data.items():
            if data:
                logger.info(f"  ✓ {table}: {data.row_count:,} rows")
            else:
                logger.info(f"  ✗ {table}: NOT FOUND (will create)")
        logger.info("-" * 70)
        
        return self.verified_data
    
    def pause_for_human(self, question: str):
        """Pause execution and ask human a question."""
        self.execution_paused = True
        self.pending_human_questions.append(question)
        logger.warning(f"⏸️ PAUSED - Human input needed: {question}")
        
    def check_output_honesty(self, output: str, agent_id: str) -> bool:
        """Check if agent output is honest."""
        is_honest, issues = HonestyChecker.check_output(output, self.verified_data)
        
        if not is_honest:
            logger.error(f"❌ HONESTY VIOLATION from {agent_id}:")
            for issue in issues:
                logger.error(f"   - {issue}")
            return False
        
        return True


# =============================================================================
# COMPLETE FEATURE LIST - FROM ALL CONVERSATIONS
# =============================================================================

# These are VERIFIED features discussed across all conversations
# Each has been checked against the conversation history

COMPLETE_FEATURES = {
    # =========================================================================
    # PHASE 1: TRANSLATION SYSTEM (from conversation history)
    # =========================================================================
    "phase_1_translation": {
        "name": "Translation System",
        "priority": 1,
        "estimated_hours": 3,
        "features": [
            {
                "id": "translate_endpoint",
                "name": "POST /api/translate",
                "description": "Core translation endpoint using Claude API with style vectors",
                "data_sources": ["translator_profiles (38 rows)", "text_style_vectors"],
                "must_query": "SELECT style_vector FROM translator_profiles WHERE translator_name = $1",
                "verification_required": True,
            },
            {
                "id": "translate_personas",
                "name": "7 Translation Personas",
                "description": "Scholar, Student, Curious, Writer, Teacher, Analyst, Explorer",
                "data_sources": ["Code logic only - no data fabrication"],
                "verification_required": False,
            },
            {
                "id": "translate_styles",
                "name": "GET /api/translate/styles",
                "description": "List all 38 translator styles",
                "data_sources": ["translator_profiles"],
                "must_query": "SELECT translator_name, era, n_translations FROM translator_profiles",
                "verification_required": True,
            },
            {
                "id": "translate_ltqi",
                "name": "LTQI Scoring",
                "description": "LOGOS Translation Quality Index - computed from style vectors",
                "data_sources": ["text_style_vectors (20 dimensions)"],
                "must_query": "SELECT style_vector FROM text_style_vectors WHERE text_id = $1",
                "verification_required": True,
            },
            {
                "id": "translate_presets",
                "name": "7 Translation Presets",
                "description": "Classic, Modern, Poetic, Literal, Academic, Creative, Blend",
                "data_sources": ["Code logic only"],
                "verification_required": False,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 2: SEMANTIA (Semantic Analysis)
    # =========================================================================
    "phase_2_semantia": {
        "name": "SEMANTIA - Semantic Analysis",
        "priority": 1,
        "estimated_hours": 4,
        "features": [
            {
                "id": "semantia_word",
                "name": "GET /api/semantia/{word}",
                "description": "Word analysis with embedding, neighbors, usage patterns",
                "data_sources": ["word_embeddings", "texts"],
                "must_query": "SELECT * FROM word_embeddings WHERE word = $1",
                "verification_required": True,
            },
            {
                "id": "semantia_neighbors",
                "name": "GET /api/semantia/neighbors/{word}",
                "description": "Top 20 semantically similar words by cosine similarity",
                "data_sources": ["word_embeddings", "semantic_neighbors"],
                "must_query": "SELECT neighbor, similarity FROM semantic_neighbors WHERE word = $1 ORDER BY similarity DESC LIMIT 20",
                "verification_required": True,
            },
            {
                "id": "semantia_compare",
                "name": "GET /api/semantia/compare",
                "description": "Compare two words - cosine similarity between embeddings",
                "data_sources": ["word_embeddings"],
                "verification_required": True,
            },
            {
                "id": "semantia_clusters",
                "name": "GET /api/semantia/clusters",
                "description": "8 semantic clusters from scholarly analysis",
                "data_sources": ["Curated clusters + word_embeddings"],
                "clusters": [
                    "Virtue & Excellence (ἀρετή, virtus)",
                    "Speech & Reason (λόγος, ratio)",
                    "Soul & Spirit (ψυχή, anima)",
                    "Anger & Emotion (μῆνις, ira)",
                    "Justice & Law (δίκη, iustitia)",
                    "Love & Desire (ἔρως, amor)",
                    "Fate & Necessity (μοῖρα, fatum)",
                    "Knowledge & Wisdom (σοφία, sapientia)",
                ],
                "verification_required": False,  # Curated, not from data
            },
            {
                "id": "semantia_bridges",
                "name": "GET /api/semantia/bridges",
                "description": "Greek-Latin semantic bridges from parallel texts",
                "data_sources": ["texts", "source_texts"],
                "must_query": "SELECT * FROM cross_lingual_bridges ORDER BY similarity DESC",
                "verification_required": True,
            },
            {
                "id": "semantia_search",
                "name": "GET /api/semantia/search",
                "description": "Search words by meaning using embedding similarity",
                "data_sources": ["word_embeddings"],
                "verification_required": True,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 3: CHRONOS (Temporal Evolution)
    # =========================================================================
    "phase_3_chronos": {
        "name": "CHRONOS - Temporal Evolution",
        "priority": 1,
        "estimated_hours": 4,
        "features": [
            {
                "id": "chronos_word",
                "name": "GET /api/chronos/{word}",
                "description": "Track word meaning evolution across 1400 years",
                "data_sources": ["temporal_embeddings", "texts"],
                "periods": [
                    {"name": "Archaic", "range": "800-500 BCE"},
                    {"name": "Classical", "range": "500-323 BCE"},
                    {"name": "Hellenistic", "range": "323-31 BCE"},
                    {"name": "Imperial", "range": "31 BCE - 284 CE"},
                    {"name": "Late Antique", "range": "284-600 CE"},
                ],
                "must_query": "SELECT period, embedding, primary_meaning FROM temporal_embeddings WHERE word = $1",
                "verification_required": True,
            },
            {
                "id": "chronos_periods",
                "name": "GET /api/chronos/periods",
                "description": "List all historical periods with characteristics",
                "data_sources": ["Scholarly definitions"],
                "verification_required": False,
            },
            {
                "id": "chronos_compare",
                "name": "GET /api/chronos/compare",
                "description": "Compare word meaning between two periods",
                "data_sources": ["temporal_embeddings"],
                "verification_required": True,
            },
            {
                "id": "chronos_drift",
                "name": "Semantic Drift Calculation",
                "description": "Quantify how much meaning changed (cosine distance)",
                "data_sources": ["temporal_embeddings"],
                "must_query": "SELECT drift_from_previous FROM temporal_embeddings WHERE word = $1",
                "verification_required": True,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 4: CONNECTOME (Intertextuality)
    # =========================================================================
    "phase_4_connectome": {
        "name": "CONNECTOME - Intertextual Network",
        "priority": 2,
        "estimated_hours": 5,
        "features": [
            {
                "id": "connectome_full",
                "name": "GET /api/connectome",
                "description": "Full intertextual graph data for visualization",
                "data_sources": ["intertextual_links", "texts", "authors"],
                "must_query": "SELECT source_urn, target_urn, link_type, strength FROM intertextual_links",
                "verification_required": True,
            },
            {
                "id": "connectome_author",
                "name": "GET /api/connectome/author/{name}",
                "description": "All connections for specific author",
                "data_sources": ["intertextual_links", "author_profiles"],
                "verification_required": True,
            },
            {
                "id": "connectome_work",
                "name": "GET /api/connectome/work/{urn}",
                "description": "All connections for specific work",
                "data_sources": ["intertextual_links"],
                "verification_required": True,
            },
            {
                "id": "connectome_influence",
                "name": "GET /api/connectome/influence",
                "description": "Author influence scores (PageRank-style)",
                "data_sources": ["intertextual_links", "author_profiles"],
                "verification_required": True,
            },
            {
                "id": "connectome_path",
                "name": "GET /api/connectome/path",
                "description": "Find connection path between two texts",
                "data_sources": ["intertextual_links"],
                "verification_required": True,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 5: DISCOVERY ENGINE
    # =========================================================================
    "phase_5_discovery": {
        "name": "DISCOVERY - Pattern Detection & Ghost Text",
        "priority": 2,
        "estimated_hours": 5,
        "features": [
            {
                "id": "discovery_patterns",
                "name": "GET /api/discovery/patterns",
                "description": "4-order pattern detection (verbal, thematic, structural, meta)",
                "data_sources": ["texts", "intertextual_links"],
                "pattern_types": [
                    "1st order: Direct verbal echoes (shared phrases)",
                    "2nd order: Thematic parallels (same topic)",
                    "3rd order: Structural allusions (same narrative pattern)",
                    "4th order: Meta-patterns (patterns of patterns)",
                ],
                "verification_required": True,
            },
            {
                "id": "ghost_reconstruct",
                "name": "POST /api/ghost/reconstruct",
                "description": "Reconstruct lost works from fragments + author style",
                "data_sources": ["author_profiles", "fragments"],
                "verification_required": True,
            },
            {
                "id": "ghost_works",
                "name": "GET /api/ghost/works",
                "description": "Catalog of lost works with surviving fragments",
                "data_sources": ["fragments", "scholarly catalogs"],
                "examples": [
                    "Sappho's 9 lost books",
                    "Aristotle's Poetics Book II (on Comedy)",
                    "Livy's lost books",
                    "Ennius' Annales fragments",
                ],
                "verification_required": True,  # Fragment count must be verified
            },
            {
                "id": "papers_generate",
                "name": "POST /api/papers/generate",
                "description": "Auto-generate academic papers from analysis",
                "data_sources": ["All analysis results"],
                "paper_types": [
                    "Style analysis papers",
                    "Delta decomposition papers",
                    "Authorship attribution papers",
                    "Diachronic evolution papers",
                ],
                "verification_required": True,
            },
            {
                "id": "discovery_synthesize",
                "name": "POST /api/discovery/synthesize",
                "description": "Cross-corpus research synthesis",
                "data_sources": ["All computed analyses"],
                "verification_required": True,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 6: AUTHORSHIP ATTRIBUTION (PARTIAL DONE)
    # =========================================================================
    "phase_6_authorship": {
        "name": "AUTHORSHIP - Attribution & Stylometry",
        "priority": 2,
        "estimated_hours": 3,
        "features": [
            {
                "id": "authorship_attribute",
                "name": "POST /api/attribute",
                "description": "Attribute unknown text to most likely author",
                "data_sources": ["author_profiles (380 rows)"],
                "status": "✅ DONE",
                "verification_required": True,
            },
            {
                "id": "authorship_authors",
                "name": "GET /api/authors",
                "description": "List all 380 ancient authors",
                "data_sources": ["author_profiles"],
                "status": "✅ DONE",
                "verification_required": True,
            },
            {
                "id": "authorship_disputed",
                "name": "GET /api/authorship/disputed",
                "description": "List disputed texts with analysis",
                "data_sources": ["disputed_analyses"],
                "disputed_works": [
                    "Iliad Book 10 (Doloneia)",
                    "Prometheus Bound (Aeschylus?)",
                    "Rhesus (Euripides?)",
                    "[Cicero] Rhetorica ad Herennium",
                    "Octavia (Seneca?)",
                ],
                "verification_required": True,
            },
            {
                "id": "authorship_fingerprint",
                "name": "GET /api/authorship/fingerprint/{author}",
                "description": "Full stylometric fingerprint for author",
                "data_sources": ["author_profiles", "text_style_vectors"],
                "fingerprint_includes": [
                    "20-dimensional style vector",
                    "Function word frequencies",
                    "Signature words",
                    "Average sentence length",
                    "Vocabulary richness",
                ],
                "verification_required": True,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 7: LEARNING SYSTEM
    # =========================================================================
    "phase_7_learning": {
        "name": "LEARNING - Curriculum & Gamification",
        "priority": 3,
        "estimated_hours": 8,
        "features": [
            {
                "id": "learn_modules",
                "name": "GET /api/learn/modules",
                "description": "64 curriculum modules (32 Latin + 32 Greek)",
                "data_sources": ["curriculum content (generated)"],
                "module_structure": [
                    "8 levels × 4 modules per level = 32 per language",
                    "Each module: 8 lessons",
                    "Total: 512 lessons",
                ],
                "verification_required": False,  # Generated content
            },
            {
                "id": "learn_lessons",
                "name": "GET /api/learn/lesson/{id}",
                "description": "Individual lesson content",
                "data_sources": ["curriculum content"],
                "verification_required": False,
            },
            {
                "id": "learn_progress",
                "name": "POST /api/learn/progress",
                "description": "Track user progress (XP, level, streaks)",
                "data_sources": ["user_progress table (new)"],
                "xp_awards": [
                    "Word clicked: 5 XP",
                    "Passage completed: 50 XP",
                    "Quiz correct: 25 XP",
                    "Daily streak: +10% bonus",
                ],
                "verification_required": False,  # User data
            },
            {
                "id": "learn_flashcards",
                "name": "GET /api/flashcards/due",
                "description": "SRS-based vocabulary flashcards",
                "data_sources": ["flashcards table (new)", "word frequency from corpus"],
                "algorithm": "SM-2 spaced repetition",
                "verification_required": False,
            },
            {
                "id": "learn_achievements",
                "name": "GET /api/learn/achievements",
                "description": "50+ achievement badges",
                "data_sources": ["achievements table (new)"],
                "achievement_examples": [
                    "Ciceronian: Read 10,000 Latin words",
                    "Homerist: Complete Iliad Book 1",
                    "Polyglot: Use 3+ translation styles",
                    "Scholar: Generate first paper",
                ],
                "verification_required": False,
            },
            {
                "id": "learn_essays",
                "name": "History Essays",
                "description": "60+ Roman + 44+ Greek history essays",
                "data_sources": ["Generated content with scholarly citations"],
                "verification_required": False,
            },
            {
                "id": "learn_grammar",
                "name": "Grammar Tables & Exercises",
                "description": "Declension/conjugation tables, exercises",
                "data_sources": ["Scholarly grammar data"],
                "verification_required": False,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 8: FRONTEND
    # =========================================================================
    "phase_8_frontend": {
        "name": "FRONTEND - 10 Main Pages",
        "priority": 1,
        "estimated_hours": 12,
        "features": [
            {
                "id": "page_home",
                "name": "Home Page /",
                "description": "Landing page with stats, featured content, navigation",
                "components": ["StatCards", "FeaturedTexts", "Navigation", "SearchBar"],
                "data_sources": ["All tables for stats"],
                "stats_queries": [
                    "SELECT COUNT(*) FROM texts",
                    "SELECT COUNT(*) FROM author_profiles",
                    "SELECT COUNT(*) FROM translator_profiles",
                ],
                "verification_required": True,  # Stats must be real
            },
            {
                "id": "page_reader",
                "name": "Reader Page /reader/{urn}",
                "description": "THE core feature - click any word for morphology, SEMANTIA, translations",
                "components": [
                    "TextDisplay (virtualized for long texts)",
                    "WordPopup (morphology, definition, etymology)",
                    "MorphologyPanel (lemma, POS, case, number, etc.)",
                    "TranslationPanel (3 styles + historical voices)",
                    "IntertextualityPanel (related passages)",
                    "FormsTable (all inflected forms)",
                ],
                "features": [
                    "Click any word: <100ms morphology popup",
                    "SEMANTIA corpus-derived definition (not just LSJ)",
                    "Etymology with PIE roots",
                    "Semantic neighbors from embeddings",
                    "3 translation styles: Literal, Literary, Student",
                    "Syntax highlighting by POS",
                    "Meter scanning for poetry",
                    "Keyboard navigation (j/k/m/s/t/e/i)",
                ],
                "verification_required": True,
            },
            {
                "id": "page_semantia",
                "name": "SEMANTIA Page /semantia",
                "description": "3D semantic space visualization",
                "components": [
                    "Semantic3DView (Three.js with instanced meshes)",
                    "ClusterPanel (8 semantic clusters)",
                    "NeighborList (similar words)",
                    "WordDetailPanel (full analysis)",
                ],
                "performance": "50K points at 60fps",
                "verification_required": True,
            },
            {
                "id": "page_chronos",
                "name": "CHRONOS Page /chronos",
                "description": "Temporal evolution visualization",
                "components": [
                    "Timeline (D3.js, 800 BCE - 600 CE)",
                    "PeriodSelector",
                    "DriftChart (meaning change over time)",
                    "AuthorInfluencePanel",
                ],
                "verification_required": True,
            },
            {
                "id": "page_connectome",
                "name": "Connectome Page /connectome",
                "description": "Intertextual network graph",
                "components": [
                    "ForceGraph (D3.js + WebGL for 500K edges)",
                    "AuthorNodes (color by era)",
                    "EdgePanel (connection details)",
                    "PathFinder (route between texts)",
                ],
                "performance": "500K+ connections at 60fps",
                "verification_required": True,
            },
            {
                "id": "page_discovery",
                "name": "Discovery Page /discovery",
                "description": "AI research synthesis",
                "components": [
                    "PatternCards (4-order patterns)",
                    "GhostTextPreview",
                    "PaperGenerator",
                    "NoveltyScore",
                ],
                "verification_required": True,
            },
            {
                "id": "page_learn",
                "name": "Learn Page /learn",
                "description": "Curriculum, flashcards, progress",
                "components": [
                    "ModuleList",
                    "LessonViewer",
                    "Flashcard",
                    "ProgressRing",
                    "AchievementPanel",
                    "StreakCounter",
                ],
                "verification_required": False,
            },
            {
                "id": "page_translate",
                "name": "Translate Page /translate",
                "description": "Full translation interface",
                "components": [
                    "StyleSelector (38 translators)",
                    "PersonaToggle (7 personas)",
                    "PreviewPanel",
                    "LTQIScore",
                    "BulkTranslate (250-5000 words)",
                ],
                "verification_required": True,
            },
            {
                "id": "page_maps",
                "name": "Maps Page /maps",
                "description": "Ancient world map with time slider",
                "components": [
                    "AncientMap (Mapbox GL JS)",
                    "TimeSlider (political boundaries)",
                    "LocationMarkers",
                    "SiteDetails",
                ],
                "verification_required": False,
            },
            {
                "id": "page_search",
                "name": "Search Page /search",
                "description": "Semantic + full-text search",
                "components": [
                    "SearchBar",
                    "SemanticSearch (embedding similarity)",
                    "FullTextSearch",
                    "ResultList",
                    "Filters (author, era, work, language)",
                ],
                "verification_required": True,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 9: VISUALIZATIONS
    # =========================================================================
    "phase_9_visualizations": {
        "name": "VISUALIZATIONS - Advanced Graphics",
        "priority": 2,
        "estimated_hours": 5,
        "features": [
            {
                "id": "viz_3d_space",
                "name": "3D Semantic Space",
                "description": "Three.js visualization of word embeddings",
                "library": "Three.js with instanced meshes",
                "data_sources": ["word_embeddings"],
                "performance": "50K points at 60fps",
                "verification_required": True,
            },
            {
                "id": "viz_force_graph",
                "name": "Force-Directed Graph",
                "description": "D3.js + WebGL for intertextual network",
                "library": "D3.js with WebGL (regl)",
                "data_sources": ["intertextual_links"],
                "performance": "500K edges at 60fps",
                "verification_required": True,
            },
            {
                "id": "viz_timeline",
                "name": "Interactive Timeline",
                "description": "D3.js timeline from 800 BCE to 600 CE",
                "library": "D3.js custom",
                "data_sources": ["temporal_embeddings", "author_profiles"],
                "verification_required": True,
            },
            {
                "id": "viz_radar",
                "name": "Style Radar Charts",
                "description": "20-dimension radar for style comparison",
                "library": "Chart.js or Recharts",
                "data_sources": ["translator_profiles", "author_profiles"],
                "verification_required": True,
            },
            {
                "id": "viz_heatmaps",
                "name": "Correlation Heatmaps",
                "description": "Author-author, era-era similarities",
                "library": "Plotly",
                "data_sources": ["Computed correlations"],
                "verification_required": True,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 10: SPECIAL FEATURES
    # =========================================================================
    "phase_10_special": {
        "name": "SPECIAL - Hebrew, Audio, Advanced",
        "priority": 3,
        "estimated_hours": 8,
        "features": [
            {
                "id": "special_hebrew",
                "name": "Hebrew/Aramaic Corpus",
                "description": "Sefaria integration for Semitic texts",
                "data_sources": ["Sefaria API"],
                "estimated_passages": "~92,000 (Tanakh, Mishnah, Targums, Talmud)",
                "script_exists": True,
                "verification_required": True,
            },
            {
                "id": "special_aramaic",
                "name": "Dead Sea Scrolls",
                "description": "Fragment integration",
                "data_sources": ["DSS Digital Library"],
                "verification_required": True,
            },
            {
                "id": "special_vesuvius",
                "name": "Vesuvius Scroll Integration",
                "description": "Fragment prediction for carbonized scrolls",
                "data_sources": ["Philodemus profile", "Epicurean vocabulary"],
                "verification_required": True,
            },
            {
                "id": "special_audio",
                "name": "Audio Pronunciation",
                "description": "Greek/Latin TTS",
                "pronunciations": [
                    "Reconstructed Classical Attic",
                    "Koine pronunciation",
                    "Erasmian (modern scholarly)",
                    "Latin Classical",
                    "Latin Ecclesiastical",
                ],
                "verification_required": False,
            },
            {
                "id": "special_era_blend",
                "name": "Era-Blended Translation",
                "description": "1550-1950 slider for historical translation styles",
                "data_sources": ["translator_profiles by era"],
                "verification_required": True,
            },
            {
                "id": "special_citations",
                "name": "Citation Generation",
                "description": "BibTeX, Chicago, MLA, APA",
                "data_sources": ["Code logic"],
                "verification_required": False,
            },
            {
                "id": "special_pdf_export",
                "name": "PDF Export",
                "description": "Export papers and texts as PDF",
                "data_sources": ["Code logic"],
                "verification_required": False,
            },
            {
                "id": "special_openapi",
                "name": "OpenAPI Documentation",
                "description": "Auto-generated API docs",
                "data_sources": ["FastAPI auto-generation"],
                "verification_required": False,
            },
            {
                "id": "special_mobile",
                "name": "Mobile Responsive",
                "description": "All pages work on mobile",
                "data_sources": ["Tailwind CSS"],
                "verification_required": False,
            },
        ]
    },
    
    # =========================================================================
    # 34 TITAN ANALYSES (from conversations)
    # =========================================================================
    "titan_analyses": {
        "name": "34 TITAN Analyses",
        "priority": 2,
        "estimated_hours": 6,
        "analyses": [
            # Tier 1 (1-12)
            "Lemma Semantics", "Metaphor Detection", "Sentiment Context", "Temporal Evolution",
            "Frequency Curves", "Author Profiles", "School Vocabularies", "Multi-Order Connections",
            "Thematic Clusters", "Genre Analysis", "Intertextuality Index", "Greek-Latin Mapping",
            # Tier 2 (13-17)
            "Definition Analyzer", "Contested Meanings", "Citation Networks", "Neologism Tracker",
            "Technical Terms",
            # Tier 3 (18-22)
            "Dialectal Markers", "Morphology Patterns", "Hapax Legomena", "Meter Patterns",
            "Formulaic Language",
            # Tier 4 (23-27)
            "Argument Structures", "Emotion Terms", "Counterfactual Detection", "Etymology Chains",
            "Personification",
            # Tier 5 (28-32)
            "Body-Mind Terms", "Spatial Language", "Gender Terms", "Class/Status Terms",
            "Death/Afterlife",
            # Tier 6 (33-34)
            "Stylometry Features", "Function Word Analysis",
        ],
    },
    
    # =========================================================================
    # 7 PERSONAS
    # =========================================================================
    "personas": {
        "name": "7 User Personas",
        "personas": [
            {"id": "latin_professor", "name": "Latin Professor", "icon": "👨‍🏫", "needs": "Bulk translation, critical apparatus"},
            {"id": "greek_professor", "name": "Greek Professor", "icon": "👩‍🏫", "needs": "Dialect analysis, meter, prosody"},
            {"id": "linguist", "name": "Historical Linguist", "icon": "🔬", "needs": "PIE roots, semantic drift, cognates"},
            {"id": "student", "name": "Undergraduate Student", "icon": "📚", "needs": "Simplified, gamified, flashcards"},
            {"id": "historian", "name": "Ancient Historian", "icon": "🏛️", "needs": "Timeline, maps, prosopography"},
            {"id": "archaeologist", "name": "Archaeologist", "icon": "⛏️", "needs": "Inscriptions, sites, material culture"},
            {"id": "digital_humanist", "name": "Digital Humanist", "icon": "📊", "needs": "API, bulk export, statistics"},
        ],
    },
}


# =============================================================================
# TASK GENERATION
# =============================================================================

def generate_all_tasks() -> List[Dict]:
    """Generate tasks for all features."""
    tasks = []
    task_id = 0
    
    for phase_id, phase in COMPLETE_FEATURES.items():
        if phase_id in ["titan_analyses", "personas"]:
            continue  # These are reference data, not tasks
            
        for feature in phase.get("features", []):
            task_id += 1
            tasks.append({
                "id": task_id,
                "phase": phase_id,
                "phase_name": phase["name"],
                "feature_id": feature["id"],
                "feature_name": feature["name"],
                "description": feature["description"],
                "data_sources": feature.get("data_sources", []),
                "must_query": feature.get("must_query"),
                "verification_required": feature.get("verification_required", True),
                "status": feature.get("status", "pending"),
            })
    
    return tasks


# =============================================================================
# MAIN CREW EXECUTION
# =============================================================================

async def main():
    """Main execution."""
    print("""
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                              ║
║   LOGOS CREWAI MEGA-BUILD v1.0                                                                               ║
║                                                                                                              ║
║   Building ALL 100+ features with SCIENTIFIC RIGOR                                                           ║
║                                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
    """)
    
    # Check API keys
    if not ANTHROPIC_API_KEY:
        print("❌ ERROR: ANTHROPIC_API_KEY not set")
        print("   Run: export ANTHROPIC_API_KEY='your-key'")
        return
    
    if not GOOGLE_API_KEY:
        print("⚠️ WARNING: GOOGLE_API_KEY not set - will use Claude for all tasks")
    
    # Create output directories
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    BACKEND_DIR.mkdir(parents=True, exist_ok=True)
    FRONTEND_DIR.mkdir(parents=True, exist_ok=True)
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    TESTS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Initialize verifier
    verifier = DataVerifier(DATABASE_URL)
    
    # Initialize master
    master = MasterOrchestrator(verifier)
    verified_data = await master.initialize()
    
    # Generate tasks
    tasks = generate_all_tasks()
    
    print(f"\n📋 Generated {len(tasks)} tasks across {len(COMPLETE_FEATURES) - 2} phases\n")
    
    # Summary
    print("PHASE SUMMARY:")
    print("-" * 70)
    for phase_id, phase in COMPLETE_FEATURES.items():
        if phase_id in ["titan_analyses", "personas"]:
            continue
        feature_count = len(phase.get("features", []))
        print(f"  {phase['name']}: {feature_count} features (~{phase.get('estimated_hours', '?')}h)")
    print("-" * 70)
    
    total_features = sum(len(p.get("features", [])) for p in COMPLETE_FEATURES.values())
    print(f"  TOTAL: {total_features} features")
    print()
    
    # Ask for confirmation
    print("⚠️ BEFORE PROCEEDING:")
    print("   1. Ensure Greek upload is complete (check your other terminal)")
    print("   2. Verify database connection is working")
    print("   3. Set all API keys")
    print()
    
    proceed = input("Proceed with build? (yes/no): ")
    if proceed.lower() != "yes":
        print("Build cancelled.")
        return
    
    # TODO: Add actual CrewAI execution here
    # For now, output the task list and specifications
    
    # Save task list
    with open(OUTPUT_DIR / "tasks.json", "w") as f:
        json.dump(tasks, f, indent=2)
    
    # Save complete spec
    with open(OUTPUT_DIR / "complete_spec.json", "w") as f:
        json.dump(COMPLETE_FEATURES, f, indent=2, default=str)
    
    print(f"\n✓ Task list saved to {OUTPUT_DIR / 'tasks.json'}")
    print(f"✓ Complete spec saved to {OUTPUT_DIR / 'complete_spec.json'}")
    print()
    print("=" * 70)
    print("NEXT STEPS:")
    print("=" * 70)
    print("1. Review tasks.json and complete_spec.json")
    print("2. Install CrewAI: pip install crewai")
    print("3. Run the crew execution (will be added)")
    print()
    print("For now, you can run individual phases manually using")
    print("the specifications in complete_spec.json")


if __name__ == "__main__":
    asyncio.run(main())
