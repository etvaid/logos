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

# API Keys - User must set these
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
    # PHASE 1: TRANSLATION SYSTEM (32 features)
    # =========================================================================
    "phase_1_translation": {
        "name": "Translation System",
        "priority": 1,
        "estimated_hours": 6,
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
            {
                "id": "translate_delta_orthographic",
                "name": "Delta Layer 1: Orthographic",
                "description": "Spelling, capitalization, punctuation differences",
                "verification_required": False,
            },
            {
                "id": "translate_delta_morphological",
                "name": "Delta Layer 2: Morphological",
                "description": "Tense, case, number, gender choices",
                "verification_required": True,
            },
            {
                "id": "translate_delta_lexical",
                "name": "Delta Layer 3: Lexical",
                "description": "Word choice differences (synonym selection)",
                "verification_required": True,
            },
            {
                "id": "translate_delta_syntactic",
                "name": "Delta Layer 4: Syntactic",
                "description": "Sentence structure, word order",
                "verification_required": True,
            },
            {
                "id": "translate_delta_semantic",
                "name": "Delta Layer 5: Semantic",
                "description": "Meaning interpretation differences",
                "verification_required": True,
            },
            {
                "id": "translate_delta_discourse",
                "name": "Delta Layer 6: Discourse",
                "description": "Paragraph, section organization",
                "verification_required": True,
            },
            {
                "id": "translate_delta_pragmatic",
                "name": "Delta Layer 7: Pragmatic",
                "description": "Cultural, contextual interpretation",
                "verification_required": True,
            },
            {
                "id": "translate_voice_pope",
                "name": "Voice: Alexander Pope",
                "description": "18th century heroic couplets style",
                "data_sources": ["translator_profiles"],
                "verification_required": True,
            },
            {
                "id": "translate_voice_chapman",
                "name": "Voice: George Chapman",
                "description": "Elizabethan style translation",
                "data_sources": ["translator_profiles"],
                "verification_required": True,
            },
            {
                "id": "translate_voice_lattimore",
                "name": "Voice: Richmond Lattimore",
                "description": "Scholarly literal style",
                "data_sources": ["translator_profiles"],
                "verification_required": True,
            },
            {
                "id": "translate_voice_fagles",
                "name": "Voice: Robert Fagles",
                "description": "Modern literary style",
                "data_sources": ["translator_profiles"],
                "verification_required": True,
            },
            {
                "id": "translate_voice_wilson",
                "name": "Voice: Emily Wilson",
                "description": "Contemporary accessible style",
                "data_sources": ["translator_profiles"],
                "verification_required": True,
            },
            {
                "id": "translate_voice_murray",
                "name": "Voice: Gilbert Murray",
                "description": "Victorian dramatic style",
                "data_sources": ["translator_profiles"],
                "verification_required": True,
            },
            {
                "id": "translate_word_confidence",
                "name": "Word-Level Confidence",
                "description": "Confidence scores with corpus evidence for each word",
                "data_sources": ["word_embeddings", "texts"],
                "verification_required": True,
            },
            {
                "id": "translate_challenge",
                "name": "Translation Challenge Button",
                "description": "Contest translations with scholarly evidence",
                "verification_required": False,
            },
            {
                "id": "translate_ngram",
                "name": "N-gram Phrase Lookup",
                "description": "1-100 word exact phrase search",
                "data_sources": ["texts", "source_texts"],
                "verification_required": True,
            },
            {
                "id": "translate_era_blend",
                "name": "Era-Blended Translation",
                "description": "1550-1950 slider for historical translation styles",
                "data_sources": ["translator_profiles by era"],
                "verification_required": True,
            },
            {
                "id": "translate_bulk",
                "name": "Bulk Translation API",
                "description": "POST /api/translate/bulk - 250-5000 words at once",
                "verification_required": False,
            },
            {
                "id": "translate_compare",
                "name": "Translation Comparison",
                "description": "Side-by-side comparison of multiple translators",
                "verification_required": True,
            },
            {
                "id": "translate_history",
                "name": "Translation History API",
                "description": "Track user translation preferences and history",
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
    # PHASE 8: FRONTEND (20 features)
    # =========================================================================
    "phase_8_frontend": {
        "name": "FRONTEND - 20 Pages & Components",
        "priority": 1,
        "estimated_hours": 16,
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
            {
                "id": "page_authorship",
                "name": "Authorship Page /authorship",
                "description": "Stylometric analysis and attribution interface",
                "components": ["StyleCompare", "DeltaAnalysis", "DisputedWorks"],
                "verification_required": True,
            },
            {
                "id": "page_ghost",
                "name": "Ghost Texts Page /ghost",
                "description": "Lost works reconstruction interface",
                "components": ["FragmentViewer", "ReconstructionPanel", "ConfidenceBar"],
                "verification_required": True,
            },
            {
                "id": "page_corpus",
                "name": "Corpus Page /corpus",
                "description": "Browse and manage corpus content",
                "components": ["AuthorBrowser", "WorkList", "TextPreview", "UploadForm"],
                "verification_required": True,
            },
            {
                "id": "page_settings",
                "name": "Settings Page /settings",
                "description": "User preferences and configuration",
                "components": ["PreferenceForm", "ThemeSelector", "APIKeys"],
                "verification_required": False,
            },
            {
                "id": "page_profile",
                "name": "Profile Page /profile",
                "description": "User profile with stats and achievements",
                "components": ["ProfileCard", "StatsPanel", "AchievementGrid", "History"],
                "verification_required": False,
            },
            {
                "id": "page_api_docs",
                "name": "API Docs Page /api-docs",
                "description": "Interactive API documentation",
                "components": ["SwaggerUI", "EndpointList", "TryIt"],
                "verification_required": False,
            },
            {
                "id": "component_word_popup",
                "name": "WordPopup Component",
                "description": "Reusable word morphology popup",
                "verification_required": True,
            },
            {
                "id": "component_stat_card",
                "name": "StatCard Component",
                "description": "Reusable statistics display card",
                "verification_required": False,
            },
            {
                "id": "component_loading",
                "name": "Loading Components",
                "description": "Skeletons, spinners, progress bars",
                "verification_required": False,
            },
            {
                "id": "layout_main",
                "name": "Main Layout",
                "description": "App shell with navigation, sidebar, footer",
                "verification_required": False,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 9: VISUALIZATIONS
    # =========================================================================
    "phase_9_visualizations": {
        "name": "VISUALIZATIONS - Advanced Graphics",
        "priority": 2,
        "estimated_hours": 6,
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
            {
                "id": "viz_word_cloud",
                "name": "Word Cloud Generator",
                "description": "Interactive word clouds by author/work/era",
                "library": "D3-cloud",
                "verification_required": True,
            },
            {
                "id": "viz_sankey",
                "name": "Influence Sankey Diagram",
                "description": "Flow of influence between authors/schools",
                "library": "D3 Sankey",
                "verification_required": True,
            },
            {
                "id": "viz_treemap",
                "name": "Corpus Treemap",
                "description": "Corpus composition by author/genre/era",
                "library": "D3 Treemap",
                "verification_required": True,
            },
            {
                "id": "viz_parallel_coords",
                "name": "Parallel Coordinates",
                "description": "Multi-dimensional style comparison",
                "library": "D3 Parallel Coordinates",
                "verification_required": True,
            },
            {
                "id": "viz_export",
                "name": "Visualization Export",
                "description": "Export visualizations as SVG/PNG/PDF",
                "verification_required": False,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 10: SPECIAL FEATURES (35 features)
    # =========================================================================
    "phase_10_special": {
        "name": "SPECIAL - Comprehensive Features",
        "priority": 3,
        "estimated_hours": 12,
        "features": [
            # Hebrew/Aramaic (5 features)
            {
                "id": "special_hebrew_corpus",
                "name": "Hebrew Corpus",
                "description": "Sefaria integration: Torah, Prophets, Writings, Mishnah",
                "data_sources": ["Sefaria API"],
                "status": "coming_soon",
                "verification_required": True,
            },
            {
                "id": "special_aramaic_corpus",
                "name": "Aramaic Corpus",
                "description": "Targums (Onkelos, Jonathan), Talmud Aramaic sections",
                "data_sources": ["Sefaria API"],
                "status": "coming_soon",
                "verification_required": True,
            },
            {
                "id": "special_dss",
                "name": "Dead Sea Scrolls",
                "description": "Qumran fragments integration with paleographic dating",
                "data_sources": ["DSS Digital Library"],
                "verification_required": True,
            },
            {
                "id": "special_greek_hebrew_bridge",
                "name": "Greek-Hebrew Semantic Bridges",
                "description": "πίστις↔אֱמוּנָה, δόξα↔כָּבוֹד, λόγος↔דָּבָר mappings",
                "data_sources": ["Cross-lingual embeddings"],
                "verification_required": True,
            },
            {
                "id": "special_septuagint",
                "name": "Septuagint Analysis",
                "description": "Greek translation of Hebrew Bible with translation techniques",
                "data_sources": ["LXX corpus", "Hebrew originals"],
                "verification_required": True,
            },
            # Vesuvius Challenge (5 features)
            {
                "id": "special_vesuvius_predict",
                "name": "Vesuvius Fragment Prediction",
                "description": "Predict next words in carbonized Herculaneum papyri",
                "data_sources": ["Philodemus profile", "Epicurean vocabulary"],
                "verification_required": True,
            },
            {
                "id": "special_philodemus_profile",
                "name": "Philodemus Language Model",
                "description": "100+ Epicurean vocabulary terms: ἀταραξία, ἡδονή, ἄτομος, κενόν",
                "data_sources": ["Philodemus corpus"],
                "verification_required": True,
            },
            {
                "id": "special_epicurean_vocab",
                "name": "Epicurean Vocabulary Database",
                "description": "Technical Epicurean terms with frequencies and collocations",
                "data_sources": ["Epicurean texts"],
                "verification_required": True,
            },
            {
                "id": "special_fragment_completion",
                "name": "Fragment Completion Engine",
                "description": "AI-powered completion using collocations and style",
                "data_sources": ["Author profiles", "word_embeddings"],
                "verification_required": True,
            },
            {
                "id": "special_reading_validation",
                "name": "Reading Validation",
                "description": "Validate if ML readings make linguistic sense",
                "data_sources": ["Language models", "grammar rules"],
                "verification_required": True,
            },
            # Audio Pronunciation (5 features)
            {
                "id": "special_audio_classical_attic",
                "name": "Classical Attic Pronunciation",
                "description": "Reconstructed 5th century BCE Attic with pitch accent",
                "data_sources": ["TTS engine + phonetic rules"],
                "verification_required": False,
            },
            {
                "id": "special_audio_koine",
                "name": "Koine Pronunciation",
                "description": "New Testament era pronunciation",
                "data_sources": ["TTS engine + phonetic rules"],
                "verification_required": False,
            },
            {
                "id": "special_audio_erasmian",
                "name": "Erasmian Pronunciation",
                "description": "Modern scholarly convention pronunciation",
                "data_sources": ["TTS engine + phonetic rules"],
                "verification_required": False,
            },
            {
                "id": "special_audio_latin_classical",
                "name": "Latin Classical Pronunciation",
                "description": "Restored classical Latin pronunciation",
                "data_sources": ["TTS engine + phonetic rules"],
                "verification_required": False,
            },
            {
                "id": "special_audio_latin_ecclesiastical",
                "name": "Latin Ecclesiastical Pronunciation",
                "description": "Church Latin pronunciation",
                "data_sources": ["TTS engine + phonetic rules"],
                "verification_required": False,
            },
            # Epigraphic & Papyri (7 features)
            {
                "id": "special_cil",
                "name": "CIL Integration",
                "description": "Corpus Inscriptionum Latinarum with search",
                "data_sources": ["CIL database"],
                "verification_required": True,
            },
            {
                "id": "special_ig",
                "name": "IG Integration",
                "description": "Inscriptiones Graecae with search",
                "data_sources": ["IG database"],
                "verification_required": True,
            },
            {
                "id": "special_seg",
                "name": "SEG Integration",
                "description": "Supplementum Epigraphicum Graecum",
                "data_sources": ["SEG database"],
                "verification_required": True,
            },
            {
                "id": "special_leiden",
                "name": "Leiden+ Markup",
                "description": "Standard epigraphic notation support",
                "data_sources": ["Code logic"],
                "verification_required": False,
            },
            {
                "id": "special_papyri",
                "name": "Papyri Database",
                "description": "P.Oxy, P.Mich, documentary + literary papyri",
                "data_sources": ["Papyri databases"],
                "verification_required": True,
            },
            {
                "id": "special_manuscripts",
                "name": "Manuscript Viewer",
                "description": "IIIF integration with zoom and annotation",
                "data_sources": ["IIIF servers"],
                "verification_required": False,
            },
            {
                "id": "special_apparatus",
                "name": "Critical Apparatus",
                "description": "Full sigla and variant readings display",
                "data_sources": ["Critical editions"],
                "verification_required": True,
            },
            # OCR & Tools (4 features)
            {
                "id": "special_ocr_greek",
                "name": "Greek OCR",
                "description": "Polytonic Greek recognition from images",
                "data_sources": ["Tesseract + custom model"],
                "verification_required": False,
            },
            {
                "id": "special_ocr_latin",
                "name": "Latin OCR",
                "description": "Latin manuscript hand support",
                "data_sources": ["Tesseract + custom model"],
                "verification_required": False,
            },
            {
                "id": "special_text_diff",
                "name": "Text Comparison/Diff",
                "description": "Side-by-side comparison with highlighting",
                "data_sources": ["Code logic"],
                "verification_required": False,
            },
            {
                "id": "special_ngram",
                "name": "N-gram Phrase Lookup",
                "description": "1-100 word exact phrase search across corpus",
                "data_sources": ["texts", "source_texts"],
                "verification_required": True,
            },
            # Export & Collaboration (5 features)
            {
                "id": "special_citations",
                "name": "Citation Generation",
                "description": "BibTeX, Chicago, MLA, APA, Turabian formats",
                "data_sources": ["Code logic"],
                "verification_required": False,
            },
            {
                "id": "special_pdf_export",
                "name": "PDF Export",
                "description": "Export papers, texts, and analyses as PDF",
                "data_sources": ["Code logic"],
                "verification_required": False,
            },
            {
                "id": "special_collaborative",
                "name": "Collaborative Annotations",
                "description": "Shared notes with version history",
                "data_sources": ["User annotations table"],
                "verification_required": False,
            },
            {
                "id": "special_pwa",
                "name": "Mobile PWA",
                "description": "Offline access with service worker",
                "data_sources": ["Code logic"],
                "verification_required": False,
            },
            {
                "id": "special_openapi",
                "name": "OpenAPI Documentation",
                "description": "Auto-generated API docs with examples",
                "data_sources": ["FastAPI auto-generation"],
                "verification_required": False,
            },
            # Advanced Analysis (4 features)
            {
                "id": "special_stemma",
                "name": "Stemma Codicum",
                "description": "Manuscript family tree visualization",
                "data_sources": ["Critical editions", "D3.js"],
                "verification_required": True,
            },
            {
                "id": "special_prosopography",
                "name": "Prosopography Database",
                "description": "50+ ancient people with relationships",
                "data_sources": ["PIR, LGPN databases"],
                "verification_required": True,
            },
            {
                "id": "special_family_trees",
                "name": "Family Tree Visualization",
                "description": "D3.js network graphs for ancient families",
                "data_sources": ["Prosopography data"],
                "verification_required": True,
            },
            {
                "id": "special_coins",
                "name": "Coin Legends",
                "description": "Numismatic texts with images",
                "data_sources": ["Numismatic databases"],
                "verification_required": True,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 11: ATLAS & MAPS (15 features)
    # =========================================================================
    "phase_11_atlas": {
        "name": "ATLAS - Maps & Geography",
        "priority": 3,
        "estimated_hours": 6,
        "features": [
            {
                "id": "atlas_political_map",
                "name": "Political Map",
                "description": "Mapbox GL JS with ancient political boundaries",
                "data_sources": ["GeoJSON boundaries"],
                "verification_required": False,
            },
            {
                "id": "atlas_time_slider",
                "name": "Time Slider Animation",
                "description": "800 BCE - 600 CE with play/pause, speed control",
                "data_sources": ["Temporal boundary data"],
                "verification_required": False,
            },
            {
                "id": "atlas_empire_colors",
                "name": "Empire Colors",
                "description": "Greek=blue, Roman=red, Persian=amber, Carthaginian=purple",
                "data_sources": ["Code logic"],
                "verification_required": False,
            },
            {
                "id": "atlas_language_spread",
                "name": "Language Spread Map",
                "description": "Greek/Latin distribution animation over time",
                "data_sources": ["Linguistic geography data"],
                "verification_required": False,
            },
            {
                "id": "atlas_sites",
                "name": "Archaeological Sites",
                "description": "100+ sites with photos and inscriptions",
                "data_sources": ["Site database"],
                "verification_required": True,
            },
            {
                "id": "atlas_author_origins",
                "name": "Author Origins Map",
                "description": "Birthplace markers for all 380 authors",
                "data_sources": ["author_profiles"],
                "verification_required": True,
            },
            {
                "id": "atlas_trade_routes",
                "name": "Trade Routes",
                "description": "Commodity icons, port cities, trade networks",
                "data_sources": ["Trade route data"],
                "verification_required": False,
            },
            {
                "id": "atlas_journeys",
                "name": "Famous Journeys",
                "description": "Odysseus, Aeneas, Paul routes with animation",
                "data_sources": ["Literary sources"],
                "verification_required": False,
            },
            {
                "id": "atlas_cities",
                "name": "City Database",
                "description": "Rome, Athens, Alexandria, Carthage with populations",
                "data_sources": ["City database"],
                "verification_required": True,
            },
            {
                "id": "atlas_city_detail",
                "name": "City Detail Popup",
                "description": "Founding date, significance, key texts",
                "data_sources": ["City database", "texts"],
                "verification_required": True,
            },
            {
                "id": "atlas_timeline",
                "name": "Interactive Timeline",
                "description": "D3.js horizontal scroll timeline",
                "data_sources": ["Event database"],
                "verification_required": False,
            },
            {
                "id": "atlas_events",
                "name": "Historical Events",
                "description": "Persian Wars, Alexander, Punic Wars, Caesar",
                "data_sources": ["Event database"],
                "verification_required": True,
            },
            {
                "id": "atlas_author_lifespans",
                "name": "Author Lifespans",
                "description": "Bar display for all 380 authors",
                "data_sources": ["author_profiles"],
                "verification_required": True,
            },
            {
                "id": "atlas_category_filter",
                "name": "Category Filter",
                "description": "Filter by political, literary, cultural events",
                "data_sources": ["Code logic"],
                "verification_required": False,
            },
            {
                "id": "atlas_event_text_links",
                "name": "Event-Text Links",
                "description": "Click event → relevant passages",
                "data_sources": ["Event-text mapping"],
                "verification_required": True,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 12: TRANSLATION EXPANDED (21 more features)
    # =========================================================================
    "phase_12_translation_expanded": {
        "name": "TRANSLATION - Expanded Features",
        "priority": 2,
        "estimated_hours": 6,
        "features": [
            {
                "id": "trans_delta_decomposition",
                "name": "7-Layer Delta Decomposition",
                "description": "Orthographic, morphological, lexical, syntactic, semantic, discourse, pragmatic",
                "data_sources": ["Translation analysis"],
                "verification_required": True,
            },
            {
                "id": "trans_ltqi_l",
                "name": "LTQI-L Lexical Score",
                "description": "Lexical accuracy component of LTQI",
                "data_sources": ["text_style_vectors"],
                "verification_required": True,
            },
            {
                "id": "trans_ltqi_t",
                "name": "LTQI-T Terminology Score",
                "description": "Technical terminology accuracy",
                "data_sources": ["text_style_vectors"],
                "verification_required": True,
            },
            {
                "id": "trans_ltqi_q",
                "name": "LTQI-Q Quality Score",
                "description": "Overall translation quality",
                "data_sources": ["text_style_vectors"],
                "verification_required": True,
            },
            {
                "id": "trans_ltqi_i",
                "name": "LTQI-I Interpretation Score",
                "description": "Interpretive choices accuracy",
                "data_sources": ["text_style_vectors"],
                "verification_required": True,
            },
            {
                "id": "trans_historical_voices",
                "name": "38 Historical Translator Voices",
                "description": "Pope, Chapman, Lattimore, Fagles, Wilson, Murray, etc.",
                "data_sources": ["translator_profiles"],
                "verification_required": True,
            },
            {
                "id": "trans_word_confidence",
                "name": "Word-Level Confidence",
                "description": "Confidence scores with corpus evidence for each word",
                "data_sources": ["word_embeddings", "texts"],
                "verification_required": True,
            },
            {
                "id": "trans_challenge_button",
                "name": "Translation Challenge",
                "description": "Contest translations with scholarly evidence",
                "data_sources": ["User submissions"],
                "verification_required": False,
            },
            {
                "id": "trans_era_blend",
                "name": "Era-Blended Translation",
                "description": "1550-1950 slider for historical translation styles",
                "data_sources": ["translator_profiles by era"],
                "verification_required": True,
            },
            {
                "id": "trans_4_styles",
                "name": "4 Translation Styles",
                "description": "Literal, Literary, Student, Scholarly",
                "data_sources": ["Code logic"],
                "verification_required": False,
            },
            {
                "id": "trans_bulk",
                "name": "Bulk Translation",
                "description": "Translate 250-5000 words at once",
                "data_sources": ["Claude API"],
                "verification_required": False,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 13: DISCOVERY EXPANDED (expanded from 14 to 20 features)
    # =========================================================================
    "phase_13_discovery_expanded": {
        "name": "DISCOVERY - Ghost Texts & Lost Works",
        "priority": 2,
        "estimated_hours": 6,
        "features": [
            {
                "id": "ghost_sappho",
                "name": "Sappho Books 2-9",
                "description": "89 fragments, 35% confidence reconstruction",
                "data_sources": ["Fragment collections"],
                "verification_required": True,
            },
            {
                "id": "ghost_aristotle_poetics",
                "name": "Aristotle Poetics II",
                "description": "23 fragments, Tractatus Coislinianus evidence",
                "data_sources": ["Fragment collections", "Tractatus"],
                "verification_required": True,
            },
            {
                "id": "ghost_livy",
                "name": "Livy Lost Books",
                "description": "Books 11-20, 46-142 via Periochae summaries",
                "data_sources": ["Periochae", "Fragment collections"],
                "verification_required": True,
            },
            {
                "id": "ghost_ennius",
                "name": "Ennius Annales",
                "description": "67 fragments of lost portions",
                "data_sources": ["Fragment collections"],
                "verification_required": True,
            },
            {
                "id": "ghost_cicero",
                "name": "Cicero Lost Speeches",
                "description": "34 referenced speeches reconstructed from citations",
                "data_sources": ["Fragment collections", "citations"],
                "verification_required": True,
            },
            {
                "id": "ghost_reconstruction_citation",
                "name": "Citation-Based Reconstruction",
                "description": "Rebuild from quotations in other authors",
                "data_sources": ["Intertextual links"],
                "verification_required": True,
            },
            {
                "id": "ghost_reconstruction_semantic",
                "name": "Semantic Pattern Matching",
                "description": "Find lost content via semantic similarity",
                "data_sources": ["word_embeddings"],
                "verification_required": True,
            },
            {
                "id": "ghost_reconstruction_metrical",
                "name": "Metrical Reconstruction",
                "description": "Complete fragmentary verses using meter",
                "data_sources": ["Meter patterns"],
                "verification_required": True,
            },
            {
                "id": "discovery_4order_verbal",
                "name": "1st Order: Verbal Echoes",
                "description": "Direct phrase matches across corpus",
                "data_sources": ["texts"],
                "verification_required": True,
            },
            {
                "id": "discovery_4order_thematic",
                "name": "2nd Order: Thematic Parallels",
                "description": "Same topic, different wording",
                "data_sources": ["texts", "word_embeddings"],
                "verification_required": True,
            },
            {
                "id": "discovery_4order_structural",
                "name": "3rd Order: Structural Allusions",
                "description": "Same narrative pattern (ring composition, etc.)",
                "data_sources": ["texts"],
                "verification_required": True,
            },
            {
                "id": "discovery_4order_meta",
                "name": "4th Order: Meta-Patterns",
                "description": "Patterns of patterns across literature",
                "data_sources": ["texts", "analysis results"],
                "verification_required": True,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 14: AUTHORSHIP EXPANDED (expanded from 9 to 20 features)
    # =========================================================================
    "phase_14_authorship_expanded": {
        "name": "AUTHORSHIP - Forensic Analysis",
        "priority": 2,
        "estimated_hours": 5,
        "features": [
            {
                "id": "auth_burrows_delta",
                "name": "Burrows' Delta (2002)",
                "description": "Classic stylometric distance measure",
                "data_sources": ["text_style_vectors"],
                "verification_required": True,
            },
            {
                "id": "auth_cosine_delta",
                "name": "Cosine Delta (Evert 2017)",
                "description": "Improved distance measure for attribution",
                "data_sources": ["text_style_vectors"],
                "verification_required": True,
            },
            {
                "id": "auth_7layer_delta",
                "name": "7-Layer Delta Decomposition",
                "description": "Causal decomposition of style differences",
                "data_sources": ["text_style_vectors"],
                "verification_required": True,
            },
            {
                "id": "auth_greek_function_words",
                "name": "Greek Function Words",
                "description": "50+ particles: καί, δέ, γάρ, μέν, οὖν, ἀλλά",
                "data_sources": ["source_texts"],
                "verification_required": True,
            },
            {
                "id": "auth_latin_function_words",
                "name": "Latin Function Words",
                "description": "50+ particles: et, sed, enim, autem, nam, atque",
                "data_sources": ["texts"],
                "verification_required": True,
            },
            {
                "id": "auth_temporal_markers",
                "name": "Temporal Vocabulary Markers",
                "description": "Archaic vs Classical vs Koine vocabulary",
                "data_sources": ["temporal_embeddings"],
                "verification_required": True,
            },
            {
                "id": "auth_event_correlation",
                "name": "Historical Event Correlation",
                "description": "Detect interpolations via event references",
                "data_sources": ["Event database", "texts"],
                "verification_required": True,
            },
            {
                "id": "auth_anomaly_scanner",
                "name": "Anomaly Scanner",
                "description": "Flag unsuspected interpolations automatically",
                "data_sources": ["text_style_vectors"],
                "verification_required": True,
            },
            {
                "id": "auth_chronology",
                "name": "Chronology Analyzer",
                "description": "Lutosławski method for ordering works by style evolution",
                "data_sources": ["author_profiles", "text_style_vectors"],
                "verification_required": True,
            },
            {
                "id": "auth_disputed_doloneia",
                "name": "Doloneia Analysis (Iliad 10)",
                "description": "Full stylometric analysis of disputed book",
                "data_sources": ["source_texts", "text_style_vectors"],
                "verification_required": True,
            },
            {
                "id": "auth_disputed_prometheus",
                "name": "Prometheus Bound Analysis",
                "description": "Aeschylus attribution analysis",
                "data_sources": ["source_texts", "text_style_vectors"],
                "verification_required": True,
            },
            {
                "id": "auth_disputed_rhesus",
                "name": "Rhesus Analysis",
                "description": "Euripides attribution analysis",
                "data_sources": ["source_texts", "text_style_vectors"],
                "verification_required": True,
            },
            {
                "id": "auth_disputed_seventh_letter",
                "name": "Seventh Letter Analysis",
                "description": "Plato attribution analysis",
                "data_sources": ["source_texts", "text_style_vectors"],
                "verification_required": True,
            },
            {
                "id": "auth_disputed_octavia",
                "name": "Octavia Analysis",
                "description": "Seneca attribution analysis",
                "data_sources": ["texts", "text_style_vectors"],
                "verification_required": True,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 15: READER EXPANDED (30 features total)
    # =========================================================================
    "phase_15_reader_expanded": {
        "name": "READER - Complete Features",
        "priority": 1,
        "estimated_hours": 8,
        "features": [
            {
                "id": "reader_click_morphology",
                "name": "Click-Word Morphology",
                "description": "<100ms popup with full morphological analysis",
                "data_sources": ["Morpheus", "source_texts"],
                "verification_required": True,
            },
            {
                "id": "reader_syntax_highlighting",
                "name": "10 Syntax Color Schemes",
                "description": "POS-based coloring: Noun=blue, Verb=red, etc.",
                "data_sources": ["Code logic"],
                "verification_required": False,
            },
            {
                "id": "reader_meter_hexameter",
                "name": "Dactylic Hexameter Scanning",
                "description": "— ∪ ∪ | — ∪ ∪ | — — | — — | — ∪ ∪ | — ×",
                "data_sources": ["Meter rules"],
                "verification_required": False,
            },
            {
                "id": "reader_meter_pentameter",
                "name": "Elegiac Pentameter",
                "description": "For elegiac couplets",
                "data_sources": ["Meter rules"],
                "verification_required": False,
            },
            {
                "id": "reader_meter_iambic",
                "name": "Iambic Trimeter",
                "description": "For drama (tragedy, comedy)",
                "data_sources": ["Meter rules"],
                "verification_required": False,
            },
            {
                "id": "reader_meter_lyric",
                "name": "Lyric Meters",
                "description": "Sapphic, Alcaic stanzas",
                "data_sources": ["Meter rules"],
                "verification_required": False,
            },
            {
                "id": "reader_caesura",
                "name": "Caesura Marking",
                "description": "Penthemimeral, trochaic, hephthemimeral",
                "data_sources": ["Meter rules"],
                "verification_required": False,
            },
            {
                "id": "reader_foot_colors",
                "name": "Foot Color Coding",
                "description": "Dactyl=gold, Spondee=blue, Trochee=green",
                "data_sources": ["Code logic"],
                "verification_required": False,
            },
            {
                "id": "reader_karaoke",
                "name": "Karaoke Mode",
                "description": "Highlight words as audio plays",
                "data_sources": ["Audio sync"],
                "verification_required": False,
            },
            {
                "id": "reader_keyboard_nav",
                "name": "Keyboard Navigation",
                "description": "j/k/m/s/t/e/i shortcuts",
                "data_sources": ["Code logic"],
                "verification_required": False,
            },
            {
                "id": "reader_forms_table",
                "name": "Complete Forms Table",
                "description": "All inflected forms for clicked word",
                "data_sources": ["Morpheus"],
                "verification_required": True,
            },
            {
                "id": "reader_etymology",
                "name": "Etymology Panel",
                "description": "PIE roots, cognates across languages",
                "data_sources": ["Etymology database"],
                "verification_required": True,
            },
            {
                "id": "reader_3_trans_styles",
                "name": "3 Translation Styles in Reader",
                "description": "Toggle Literal/Literary/Student inline",
                "data_sources": ["translator_profiles"],
                "verification_required": True,
            },
            {
                "id": "reader_intertextuality_panel",
                "name": "Intertextuality Panel",
                "description": "Related passages from connectome",
                "data_sources": ["intertextual_links"],
                "verification_required": True,
            },
            {
                "id": "reader_semantic_neighbors",
                "name": "Semantic Neighbors in Popup",
                "description": "Top 10 similar words from embeddings",
                "data_sources": ["word_embeddings"],
                "verification_required": True,
            },
        ]
    },
    
    # =========================================================================
    # PHASE 16: 34 TITAN ANALYSES (all buildable)
    # =========================================================================
    "phase_16_titan": {
        "name": "TITAN - 34 Deep Analyses",
        "priority": 2,
        "estimated_hours": 10,
        "features": [
            # Tier 1 (1-12)
            {"id": "titan_lemma_semantics", "name": "Lemma Semantics", "description": "Deep lemma meaning analysis across corpus", "verification_required": True},
            {"id": "titan_metaphor_detection", "name": "Metaphor Detection", "description": "Identify and catalog metaphorical language", "verification_required": True},
            {"id": "titan_sentiment_context", "name": "Sentiment Context", "description": "Contextual sentiment analysis", "verification_required": True},
            {"id": "titan_temporal_evolution", "name": "Temporal Evolution", "description": "Track meaning changes over 1400 years", "verification_required": True},
            {"id": "titan_frequency_curves", "name": "Frequency Curves", "description": "Word usage frequency over time", "verification_required": True},
            {"id": "titan_author_profiles", "name": "Author Style Profiles", "description": "Comprehensive stylometric profiles", "verification_required": True},
            {"id": "titan_school_vocabularies", "name": "School Vocabularies", "description": "Stoic, Epicurean, Platonic, Peripatetic terms", "verification_required": True},
            {"id": "titan_multi_order", "name": "Multi-Order Connections", "description": "4-order intertextual analysis", "verification_required": True},
            {"id": "titan_thematic_clusters", "name": "Thematic Clusters", "description": "Topic modeling across corpus", "verification_required": True},
            {"id": "titan_genre_analysis", "name": "Genre Analysis", "description": "Genre-specific vocabulary and style", "verification_required": True},
            {"id": "titan_intertextuality_index", "name": "Intertextuality Index", "description": "Quantified influence scores", "verification_required": True},
            {"id": "titan_greek_latin_mapping", "name": "Greek-Latin Mapping", "description": "Cross-linguistic concept mapping", "verification_required": True},
            # Tier 2 (13-17)
            {"id": "titan_definition_analyzer", "name": "Definition Analyzer", "description": "Extract ancient definitions", "verification_required": True},
            {"id": "titan_contested_meanings", "name": "Contested Meanings", "description": "Track scholarly disagreements", "verification_required": True},
            {"id": "titan_citation_networks", "name": "Citation Networks", "description": "Who quotes whom analysis", "verification_required": True},
            {"id": "titan_neologism_tracker", "name": "Neologism Tracker", "description": "Track new word introductions", "verification_required": True},
            {"id": "titan_technical_terms", "name": "Technical Terms", "description": "Domain-specific vocabulary", "verification_required": True},
            # Tier 3 (18-22)
            {"id": "titan_dialectal_markers", "name": "Dialectal Markers", "description": "Attic, Ionic, Doric, Aeolic features", "verification_required": True},
            {"id": "titan_morphology_patterns", "name": "Morphology Patterns", "description": "Unusual morphological features", "verification_required": True},
            {"id": "titan_hapax_legomena", "name": "Hapax Legomena", "description": "Words appearing only once", "verification_required": True},
            {"id": "titan_meter_patterns", "name": "Meter Pattern Analysis", "description": "Metrical preference analysis", "verification_required": True},
            {"id": "titan_formulaic_language", "name": "Formulaic Language", "description": "Epic formulas, stock phrases", "verification_required": True},
            # Tier 4 (23-27)
            {"id": "titan_argument_structures", "name": "Argument Structures", "description": "Logical argument patterns", "verification_required": True},
            {"id": "titan_emotion_terms", "name": "Emotion Terms", "description": "Vocabulary of emotions", "verification_required": True},
            {"id": "titan_counterfactual", "name": "Counterfactual Detection", "description": "Hypothetical constructions", "verification_required": True},
            {"id": "titan_etymology_chains", "name": "Etymology Chains", "description": "Word derivation networks", "verification_required": True},
            {"id": "titan_personification", "name": "Personification", "description": "Anthropomorphic language", "verification_required": True},
            # Tier 5 (28-32)
            {"id": "titan_body_mind", "name": "Body-Mind Terms", "description": "σῶμα/ψυχή vocabulary analysis", "verification_required": True},
            {"id": "titan_spatial_language", "name": "Spatial Language", "description": "Space and movement terms", "verification_required": True},
            {"id": "titan_gender_terms", "name": "Gender Terms", "description": "Gendered vocabulary analysis", "verification_required": True},
            {"id": "titan_class_status", "name": "Class/Status Terms", "description": "Social hierarchy vocabulary", "verification_required": True},
            {"id": "titan_death_afterlife", "name": "Death/Afterlife Terms", "description": "Θάνατος, Ἅιδης vocabulary", "verification_required": True},
            # Tier 6 (33-34)
            {"id": "titan_stylometry", "name": "Stylometry Features", "description": "Full stylometric feature extraction", "verification_required": True},
            {"id": "titan_function_words", "name": "Function Word Analysis", "description": "High-frequency word patterns", "verification_required": True},
        ]
    },
    
    # =========================================================================
    # PHASE 17: PERSONAS & UI (12 features)
    # =========================================================================
    "phase_17_personas": {
        "name": "PERSONAS - User-Specific Views",
        "priority": 3,
        "estimated_hours": 4,
        "features": [
            {"id": "persona_latin_prof", "name": "Latin Professor View", "description": "Bulk translation, critical apparatus focus", "verification_required": False},
            {"id": "persona_greek_prof", "name": "Greek Professor View", "description": "Dialect analysis, meter, prosody focus", "verification_required": False},
            {"id": "persona_linguist", "name": "Linguist View", "description": "PIE roots, semantic drift, cognates focus", "verification_required": False},
            {"id": "persona_student", "name": "Student View", "description": "Simplified, gamified, flashcards focus", "verification_required": False},
            {"id": "persona_historian", "name": "Historian View", "description": "Timeline, maps, prosopography focus", "verification_required": False},
            {"id": "persona_archaeologist", "name": "Archaeologist View", "description": "Inscriptions, sites, material culture focus", "verification_required": False},
            {"id": "persona_digital_humanist", "name": "Digital Humanist View", "description": "API, bulk export, statistics focus", "verification_required": False},
            {"id": "layer_raw", "name": "Raw Text Layer", "description": "Unprocessed original text", "verification_required": False},
            {"id": "layer_normalized", "name": "Normalized Layer", "description": "Standardized orthography", "verification_required": False},
            {"id": "layer_morphology", "name": "Morphology Layer", "description": "Full parsing overlay", "verification_required": False},
            {"id": "layer_translation", "name": "Translation Layer", "description": "Multiple translation styles", "verification_required": False},
            {"id": "layer_analysis", "name": "Analysis Layer", "description": "Semantic, stylistic annotations", "verification_required": False},
        ]
    },
    
    # =========================================================================
    # PHASE 18: CORPUS MANAGEMENT (28 features)
    # =========================================================================
    "phase_18_corpus": {
        "name": "CORPUS - Acquisition & Management",
        "priority": 1,
        "estimated_hours": 8,
        "features": [
            {"id": "corpus_greek_perseus", "name": "Greek: Perseus Digital Library", "description": "Primary Greek source", "verification_required": True},
            {"id": "corpus_greek_first1k", "name": "Greek: First1KGreek", "description": "First 1000 years of Greek", "verification_required": True},
            {"id": "corpus_latin_library", "name": "Latin: Latin Library", "description": "Comprehensive Latin texts", "verification_required": True},
            {"id": "corpus_latin_phi5", "name": "Latin: PHI5 Classical Latin", "description": "Packard Humanities Institute", "verification_required": True},
            {"id": "corpus_hebrew_sefaria", "name": "Hebrew: Sefaria", "description": "Torah, Prophets, Writings", "status": "coming_soon", "verification_required": True},
            {"id": "corpus_aramaic_targums", "name": "Aramaic: Targums", "description": "Onkelos, Jonathan", "status": "coming_soon", "verification_required": True},
            {"id": "corpus_mishnah", "name": "Hebrew: Mishnah", "description": "63 tractates", "status": "coming_soon", "verification_required": True},
            {"id": "corpus_talmud", "name": "Aramaic: Talmud", "description": "Babylonian and Jerusalem", "status": "coming_soon", "verification_required": True},
            {"id": "corpus_sanskrit_gretil", "name": "Sanskrit: GRETIL", "description": "Göttingen texts", "status": "coming_soon", "verification_required": True},
            {"id": "corpus_pali_tipitaka", "name": "Pali: Tipitaka", "description": "Buddhist canon", "status": "coming_soon", "verification_required": True},
            {"id": "corpus_coptic", "name": "Coptic Texts", "description": "Nag Hammadi, Gnostic", "status": "coming_soon", "verification_required": True},
            {"id": "corpus_syriac", "name": "Syriac Texts", "description": "Peshitta, Church Fathers", "status": "coming_soon", "verification_required": True},
            {"id": "corpus_upload_api", "name": "POST /api/corpus/upload", "description": "Upload new texts", "verification_required": True},
            {"id": "corpus_validate", "name": "POST /api/corpus/validate", "description": "Validate text format", "verification_required": False},
            {"id": "corpus_availability", "name": "GET /api/corpus/availability", "description": "Check corpus status per language", "verification_required": True},
            {"id": "corpus_stats", "name": "GET /api/corpus/stats", "description": "Corpus statistics endpoint", "verification_required": True},
            {"id": "corpus_search", "name": "GET /api/corpus/search", "description": "Full-text corpus search", "verification_required": True},
            {"id": "corpus_browse", "name": "GET /api/corpus/browse", "description": "Browse corpus by author/work", "verification_required": True},
            {"id": "corpus_export", "name": "GET /api/corpus/export", "description": "Export subset as TEI-XML", "verification_required": False},
            {"id": "corpus_dedupe", "name": "POST /api/corpus/dedupe", "description": "Remove duplicate texts", "verification_required": True},
            {"id": "corpus_coming_soon_hebrew", "name": "Coming Soon: Hebrew UI", "description": "Graceful degradation for Hebrew", "verification_required": False},
            {"id": "corpus_coming_soon_aramaic", "name": "Coming Soon: Aramaic UI", "description": "Graceful degradation for Aramaic", "verification_required": False},
            {"id": "corpus_coming_soon_sanskrit", "name": "Coming Soon: Sanskrit UI", "description": "Graceful degradation for Sanskrit", "verification_required": False},
            {"id": "corpus_morphology_greek", "name": "Greek Morphology Engine", "description": "Morpheus integration", "verification_required": True},
            {"id": "corpus_morphology_latin", "name": "Latin Morphology Engine", "description": "Whitaker's Words + Morpheus", "verification_required": True},
            {"id": "corpus_morphology_hebrew", "name": "Hebrew Morphology Engine", "description": "ETCBC integration", "status": "coming_soon", "verification_required": True},
            {"id": "corpus_urn_resolver", "name": "URN Resolver", "description": "CTS URN resolution", "verification_required": True},
            {"id": "corpus_tei_parser", "name": "TEI-XML Parser", "description": "Parse TEI-encoded texts", "verification_required": False},
        ]
    },
    
    # =========================================================================
    # PHASE 19: ACADEMIC FEATURES (15 features)
    # =========================================================================
    "phase_19_academic": {
        "name": "ACADEMIC - Research Tools",
        "priority": 2,
        "estimated_hours": 5,
        "features": [
            {"id": "acad_paper_generator", "name": "Paper Generator", "description": "Auto-generate academic papers from analysis", "verification_required": True},
            {"id": "acad_paper_style_analysis", "name": "Style Analysis Papers", "description": "Generate style comparison papers", "verification_required": True},
            {"id": "acad_paper_delta", "name": "Delta Decomposition Papers", "description": "Translation difference papers", "verification_required": True},
            {"id": "acad_paper_authorship", "name": "Authorship Papers", "description": "Attribution analysis papers", "verification_required": True},
            {"id": "acad_paper_diachronic", "name": "Diachronic Papers", "description": "Temporal evolution papers", "verification_required": True},
            {"id": "acad_bibliography", "name": "Bibliography Manager", "description": "Collect and format citations", "verification_required": False},
            {"id": "acad_footnotes", "name": "Footnote Generator", "description": "Auto-generate scholarly footnotes", "verification_required": True},
            {"id": "acad_peer_review", "name": "Peer Review Mode", "description": "Track changes and comments", "verification_required": False},
            {"id": "acad_latex_export", "name": "LaTeX Export", "description": "Export papers as LaTeX", "verification_required": False},
            {"id": "acad_word_export", "name": "Word Export", "description": "Export papers as .docx", "verification_required": False},
            {"id": "acad_collaboration", "name": "Collaboration Features", "description": "Share annotations with colleagues", "verification_required": False},
            {"id": "acad_annotation_export", "name": "Annotation Export", "description": "Export annotations as JSON/TEI", "verification_required": False},
            {"id": "acad_research_history", "name": "Research History", "description": "Track analysis history per user", "verification_required": False},
            {"id": "acad_bookmark", "name": "Bookmarks & Collections", "description": "Save and organize passages", "verification_required": False},
            {"id": "acad_api_access", "name": "API Access Keys", "description": "Generate API keys for researchers", "verification_required": False},
        ]
    },
    
    # =========================================================================
    # PHASE 20: GAMIFICATION (15 features)
    # =========================================================================
    "phase_20_gamification": {
        "name": "GAMIFICATION - Learning System",
        "priority": 3,
        "estimated_hours": 5,
        "features": [
            {"id": "game_xp_system", "name": "XP System", "description": "5 XP/word, 50 XP/passage, 25 XP/quiz", "verification_required": False},
            {"id": "game_levels", "name": "12 Levels", "description": "Novice to Magister progression", "verification_required": False},
            {"id": "game_streaks", "name": "Daily Streaks", "description": "+10% bonus for consecutive days", "verification_required": False},
            {"id": "game_achievements", "name": "50+ Achievements", "description": "Ciceronian, Homerist, Polyglot badges", "verification_required": False},
            {"id": "game_leaderboard", "name": "Leaderboard", "description": "Weekly/monthly rankings", "verification_required": False},
            {"id": "game_srs_flashcards", "name": "SM-2 Flashcards", "description": "Spaced repetition vocabulary", "verification_required": False},
            {"id": "game_quizzes", "name": "Quiz Generator", "description": "Auto-generate quizzes from texts", "verification_required": False},
            {"id": "game_challenges", "name": "Daily Challenges", "description": "Daily translation/parsing tasks", "verification_required": False},
            {"id": "game_multiplayer", "name": "Multiplayer Mode", "description": "Compete with other learners", "verification_required": False},
            {"id": "game_curriculum_latin", "name": "Latin Curriculum", "description": "32 modules, 256 lessons", "verification_required": False},
            {"id": "game_curriculum_greek", "name": "Greek Curriculum", "description": "32 modules, 256 lessons", "verification_required": False},
            {"id": "game_grammar_tables", "name": "Grammar Tables", "description": "Interactive declension/conjugation", "verification_required": False},
            {"id": "game_history_essays", "name": "History Essays", "description": "60+ Roman + 44+ Greek essays", "verification_required": False},
            {"id": "game_progress_tracking", "name": "Progress Tracking", "description": "Visual progress dashboard", "verification_required": False},
            {"id": "game_certificates", "name": "Certificates", "description": "Generate completion certificates", "verification_required": False},
        ]
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
        # All phases are now buildable features
        for feature in phase.get("features", []):
            task_id += 1
            tasks.append({
                "id": task_id,
                "phase": phase_id,
                "phase_name": phase["name"],
                "feature_id": feature["id"],
                "feature_name": feature["name"],
                "description": feature.get("description", ""),
                "data_sources": feature.get("data_sources", []),
                "must_query": feature.get("must_query"),
                "verification_required": feature.get("verification_required", True),
                "status": feature.get("status", "pending"),
                "components": feature.get("components", []),
                "features": feature.get("features", []),
            })
    
    return tasks


# =============================================================================
# CLAUDE API CLIENT (Direct - No CrewAI Dependency)
# =============================================================================

import aiohttp
import time
import traceback

class ClaudeAPIClient:
    """Direct Anthropic API client - avoids CrewAI/tiktoken build issues."""
    
    BASE_URL = "https://api.anthropic.com/v1/messages"
    MODEL = "claude-sonnet-4-20250514"  # Latest Sonnet for all agents
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.request_count = 0
        self.total_tokens = 0
        
    async def call(self, system_prompt: str, user_message: str, max_tokens: int = 8192) -> str:
        """Make a single Claude API call."""
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        payload = {
            "model": self.MODEL,
            "max_tokens": max_tokens,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_message}]
        }
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(self.BASE_URL, headers=headers, json=payload) as resp:
                    if resp.status != 200:
                        error_text = await resp.text()
                        logger.error(f"API Error {resp.status}: {error_text}")
                        return f"ERROR: API returned {resp.status}"
                    
                    result = await resp.json()
                    self.request_count += 1
                    if "usage" in result:
                        self.total_tokens += result["usage"].get("output_tokens", 0)
                    
                    return result["content"][0]["text"]
            except Exception as e:
                logger.error(f"API call failed: {e}")
                return f"ERROR: {str(e)}"


# =============================================================================
# SWARM AGENTS - ALL CLAUDE-POWERED
# =============================================================================

class SwarmAgent:
    """Base swarm agent powered by Claude."""
    
    def __init__(self, agent_id: str, role: str, client: ClaudeAPIClient):
        self.agent_id = agent_id
        self.role = role
        self.client = client
        self.tasks_completed = 0
        self.errors = []
        
    async def execute(self, task: Dict, context: str = "") -> Dict:
        """Execute a task and return result."""
        raise NotImplementedError


class BackendBuilderAgent(SwarmAgent):
    """Builds FastAPI backend routers and endpoints."""
    
    SYSTEM_PROMPT = """You are an EXPERT FastAPI backend developer building LOGOS - the ultimate classical studies platform.

YOUR ROLE: Generate complete, working FastAPI router code for the given feature.

RULES:
1. Generate COMPLETE, WORKING Python code - no placeholders
2. Use asyncpg for PostgreSQL queries
3. Include proper error handling with try/except
4. Add Pydantic models for request/response
5. Include docstrings and comments
6. Follow FastAPI best practices
7. Handle graceful degradation for unavailable corpora

DATABASE CONNECTION:
- Use: DATABASE_URL from environment
- Tables: texts, source_texts, author_profiles, translator_profiles, text_style_vectors, word_embeddings

CORPUS AVAILABILITY (check before queries):
- Greek: AVAILABLE (121,184+ texts)
- Latin: AVAILABLE (~45,000 texts)
- Hebrew/Aramaic: COMING SOON (return graceful message)
- Sanskrit/Pali: COMING SOON (return graceful message)

OUTPUT FORMAT:
Return ONLY the Python code. Start with:
```python
# filepath: routers/{filename}.py
from fastapi import APIRouter, HTTPException, Query
...
```

CRITICAL: Generate REAL, WORKING code. No shortcuts. No TODOs."""

    async def execute(self, task: Dict, context: str = "") -> Dict:
        """Build a backend router."""
        user_prompt = f"""BUILD BACKEND ROUTER FOR: {task['feature_name']}

FEATURE DESCRIPTION:
{task['description']}

DATA SOURCES: {', '.join(task.get('data_sources', []))}

COMPONENTS TO INCLUDE:
{json.dumps(task.get('components', []), indent=2)}

FEATURE DETAILS:
{json.dumps(task.get('features', []), indent=2)}

REQUIRED SQL QUERY (if any): {task.get('must_query', 'N/A')}

ADDITIONAL CONTEXT:
{context}

Generate the COMPLETE FastAPI router code now. Include ALL endpoints for this feature."""

        code = await self.client.call(self.SYSTEM_PROMPT, user_prompt, max_tokens=8192)
        
        # Extract code from response
        if "```python" in code:
            code = code.split("```python")[1].split("```")[0]
        
        self.tasks_completed += 1
        
        return {
            "agent": self.agent_id,
            "task_id": task["id"],
            "feature_id": task["feature_id"],
            "status": "completed" if "ERROR" not in code else "failed",
            "code": code,
            "type": "backend"
        }


class FrontendBuilderAgent(SwarmAgent):
    """Builds Next.js frontend pages and components."""
    
    SYSTEM_PROMPT = """You are an EXPERT Next.js/React frontend developer building LOGOS - the ultimate classical studies platform.

YOUR ROLE: Generate complete, working React/Next.js code for the given feature.

RULES:
1. Generate COMPLETE, WORKING TypeScript/React code - no placeholders
2. Use Next.js 14 App Router (app/ directory)
3. Use Tailwind CSS for styling
4. Include proper loading states and error handling
5. Use React hooks correctly
6. Fetch from backend API at /api/* endpoints
7. Make it responsive (mobile-friendly)
8. Include accessibility attributes

UI STYLE:
- Dark theme with gold/amber accents
- Professional, academic aesthetic
- Smooth animations
- Loading skeletons for async content

OUTPUT FORMAT:
Return ONLY the code. Start with:
```tsx
// filepath: app/{path}/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
...
```

CRITICAL: Generate REAL, WORKING code. No shortcuts. No TODOs."""

    async def execute(self, task: Dict, context: str = "") -> Dict:
        """Build a frontend page/component."""
        user_prompt = f"""BUILD FRONTEND PAGE FOR: {task['feature_name']}

FEATURE DESCRIPTION:
{task['description']}

COMPONENTS TO BUILD:
{json.dumps(task.get('components', []), indent=2)}

FEATURES TO IMPLEMENT:
{json.dumps(task.get('features', []), indent=2)}

BACKEND ENDPOINTS TO CALL:
- Check task details for relevant /api/* endpoints

ADDITIONAL CONTEXT:
{context}

Generate the COMPLETE Next.js page code now. Include ALL components for this feature."""

        code = await self.client.call(self.SYSTEM_PROMPT, user_prompt, max_tokens=8192)
        
        # Extract code from response
        if "```tsx" in code:
            code = code.split("```tsx")[1].split("```")[0]
        elif "```typescript" in code:
            code = code.split("```typescript")[1].split("```")[0]
        
        self.tasks_completed += 1
        
        return {
            "agent": self.agent_id,
            "task_id": task["id"],
            "feature_id": task["feature_id"],
            "status": "completed" if "ERROR" not in code else "failed",
            "code": code,
            "type": "frontend"
        }


class QAAgent(SwarmAgent):
    """Validates code quality and correctness."""
    
    SYSTEM_PROMPT = """You are a SENIOR QA engineer reviewing code for LOGOS - the ultimate classical studies platform.

YOUR ROLE: Review code for bugs, security issues, and best practices.

CHECK FOR:
1. Syntax errors
2. Missing imports
3. Unhandled errors
4. SQL injection vulnerabilities
5. Missing type hints
6. Incomplete implementations (TODOs, placeholders)
7. Performance issues
8. Accessibility issues (frontend)
9. API response format consistency
10. Proper error messages

OUTPUT FORMAT (JSON):
{
    "passed": true/false,
    "score": 0-100,
    "issues": [
        {"severity": "critical|major|minor", "line": N, "description": "..."}
    ],
    "suggestions": ["..."],
    "fixed_code": "..." (if issues found, provide corrected version)
}

Be STRICT. Real production code only."""

    async def execute(self, task: Dict, context: str = "") -> Dict:
        """Review and validate code."""
        code = context  # The code to review is passed as context
        
        user_prompt = f"""REVIEW THIS CODE:

Feature: {task['feature_name']}
Type: {task.get('type', 'unknown')}

CODE:
```
{code}
```

Provide your QA review in JSON format. If there are issues, include fixed_code with corrections."""

        review = await self.client.call(self.SYSTEM_PROMPT, user_prompt, max_tokens=8192)
        
        # Parse JSON response
        try:
            if "```json" in review:
                review_json = review.split("```json")[1].split("```")[0]
            elif "```" in review:
                review_json = review.split("```")[1].split("```")[0]
            else:
                review_json = review
            
            result = json.loads(review_json)
        except:
            result = {"passed": False, "score": 0, "issues": [{"severity": "critical", "description": "QA review failed to parse"}]}
        
        self.tasks_completed += 1
        
        return {
            "agent": self.agent_id,
            "task_id": task["id"],
            "feature_id": task["feature_id"],
            "qa_result": result,
            "type": "qa"
        }


class FixerAgent(SwarmAgent):
    """Fixes code based on QA feedback."""
    
    SYSTEM_PROMPT = """You are an EXPERT code fixer for LOGOS - the ultimate classical studies platform.

YOUR ROLE: Fix code issues identified by QA.

RULES:
1. Address ALL issues identified by QA
2. Maintain original functionality
3. Improve code quality
4. Add missing error handling
5. Fix security vulnerabilities
6. Complete any incomplete implementations

OUTPUT FORMAT:
Return ONLY the fixed code. Start with the appropriate code block:
```python
# Fixed code here
```
or
```tsx
// Fixed code here
```

DO NOT explain changes. Just provide the corrected code."""

    async def execute(self, task: Dict, context: str = "") -> Dict:
        """Fix code based on QA feedback."""
        original_code = context.get("original_code", "")
        qa_result = context.get("qa_result", {})
        
        user_prompt = f"""FIX THIS CODE BASED ON QA FEEDBACK:

Feature: {task['feature_name']}

ORIGINAL CODE:
```
{original_code}
```

QA ISSUES:
{json.dumps(qa_result.get('issues', []), indent=2)}

QA SUGGESTIONS:
{json.dumps(qa_result.get('suggestions', []), indent=2)}

Provide the COMPLETE fixed code."""

        fixed_code = await self.client.call(self.SYSTEM_PROMPT, user_prompt, max_tokens=8192)
        
        # Extract code
        if "```python" in fixed_code:
            fixed_code = fixed_code.split("```python")[1].split("```")[0]
        elif "```tsx" in fixed_code:
            fixed_code = fixed_code.split("```tsx")[1].split("```")[0]
        elif "```" in fixed_code:
            fixed_code = fixed_code.split("```")[1].split("```")[0]
        
        self.tasks_completed += 1
        
        return {
            "agent": self.agent_id,
            "task_id": task["id"],
            "feature_id": task["feature_id"],
            "fixed_code": fixed_code,
            "type": "fix"
        }


class DocumentationAgent(SwarmAgent):
    """Generates documentation for features."""
    
    SYSTEM_PROMPT = """You are a TECHNICAL WRITER creating documentation for LOGOS - the ultimate classical studies platform.

YOUR ROLE: Generate comprehensive documentation for features.

INCLUDE:
1. Overview/Description
2. API Endpoints (if backend)
3. Usage Examples
4. Request/Response formats
5. Error codes
6. Configuration options
7. Dependencies

OUTPUT FORMAT (Markdown):
# Feature Name

## Overview
...

## API Reference
...

## Examples
...

Be thorough and accurate."""

    async def execute(self, task: Dict, context: str = "") -> Dict:
        """Generate documentation."""
        user_prompt = f"""GENERATE DOCUMENTATION FOR: {task['feature_name']}

FEATURE DESCRIPTION:
{task['description']}

COMPONENTS:
{json.dumps(task.get('components', []), indent=2)}

CODE (for reference):
```
{context[:4000] if context else 'N/A'}
```

Generate comprehensive Markdown documentation."""

        docs = await self.client.call(self.SYSTEM_PROMPT, user_prompt, max_tokens=4096)
        
        self.tasks_completed += 1
        
        return {
            "agent": self.agent_id,
            "task_id": task["id"],
            "feature_id": task["feature_id"],
            "documentation": docs,
            "type": "docs"
        }


# =============================================================================
# MASTER SWARM ORCHESTRATOR
# =============================================================================

class SwarmOrchestrator:
    """
    👑 MASTER ORCHESTRATOR
    
    Coordinates all Claude builder agents to build LOGOS systematically.
    
    WORKFLOW:
    1. Verify database connection
    2. For each phase:
       a. Backend agents build routers
       b. QA agents review code
       c. Fixer agents correct issues
       d. Frontend agents build pages
       e. QA agents review frontend
       f. Fixer agents correct issues
       g. Documentation agents document
    3. Save all outputs
    4. Generate summary report
    """
    
    def __init__(self, api_key: str, database_url: str):
        self.client = ClaudeAPIClient(api_key)
        self.database_url = database_url
        
        # Initialize agent pool
        self.backend_agents = [
            BackendBuilderAgent(f"backend_{i}", "backend_builder", self.client)
            for i in range(3)  # 3 parallel backend builders
        ]
        self.frontend_agents = [
            FrontendBuilderAgent(f"frontend_{i}", "frontend_builder", self.client)
            for i in range(3)  # 3 parallel frontend builders
        ]
        self.qa_agents = [
            QAAgent(f"qa_{i}", "qa", self.client)
            for i in range(2)  # 2 QA agents
        ]
        self.fixer_agents = [
            FixerAgent(f"fixer_{i}", "fixer", self.client)
            for i in range(2)  # 2 fixer agents
        ]
        self.doc_agents = [
            DocumentationAgent(f"docs_{i}", "docs", self.client)
            for i in range(1)  # 1 documentation agent
        ]
        
        # Results storage
        self.results = {
            "backend": {},
            "frontend": {},
            "docs": {},
            "qa_reports": {},
            "errors": [],
            "summary": {}
        }
        
        # Progress tracking
        self.total_tasks = 0
        self.completed_tasks = 0
        self.failed_tasks = 0
        
    async def verify_database(self) -> Dict:
        """Verify database connection and get table counts."""
        try:
            import asyncpg
            conn = await asyncpg.connect(self.database_url)
            
            tables = ["texts", "source_texts", "author_profiles", "translator_profiles", "text_style_vectors", "word_embeddings"]
            counts = {}
            
            for table in tables:
                try:
                    result = await conn.fetchval(f"SELECT COUNT(*) FROM {table}")
                    counts[table] = result
                except:
                    counts[table] = 0
            
            await conn.close()
            return {"connected": True, "counts": counts}
        except Exception as e:
            logger.error(f"Database verification failed: {e}")
            return {"connected": False, "error": str(e)}
    
    async def build_feature(self, task: Dict, is_backend: bool = True) -> Dict:
        """Build a single feature with QA and fixing."""
        feature_id = task["feature_id"]
        logger.info(f"🔨 Building: {task['feature_name']}")
        
        # Step 1: Build code
        if is_backend:
            agent = self.backend_agents[self.completed_tasks % len(self.backend_agents)]
        else:
            agent = self.frontend_agents[self.completed_tasks % len(self.frontend_agents)]
        
        build_result = await agent.execute(task)
        code = build_result.get("code", "")
        
        if "ERROR" in code or not code.strip():
            logger.error(f"❌ Build failed for {feature_id}")
            self.failed_tasks += 1
            return {"status": "build_failed", "feature_id": feature_id}
        
        # Step 2: QA Review
        qa_agent = self.qa_agents[self.completed_tasks % len(self.qa_agents)]
        qa_result = await qa_agent.execute(task, code)
        qa_data = qa_result.get("qa_result", {})
        
        # Step 3: Fix if needed
        final_code = code
        if not qa_data.get("passed", False) and qa_data.get("score", 100) < 80:
            logger.info(f"🔧 Fixing issues in {feature_id}")
            fixer_agent = self.fixer_agents[self.completed_tasks % len(self.fixer_agents)]
            fix_result = await fixer_agent.execute(task, {
                "original_code": code,
                "qa_result": qa_data
            })
            fixed_code = fix_result.get("fixed_code", "")
            if fixed_code and "ERROR" not in fixed_code:
                final_code = fixed_code
                
                # Re-QA the fixed code
                qa_result_2 = await qa_agent.execute(task, final_code)
                qa_data = qa_result_2.get("qa_result", {})
        
        self.completed_tasks += 1
        
        return {
            "status": "completed",
            "feature_id": feature_id,
            "feature_name": task["feature_name"],
            "code": final_code,
            "qa_score": qa_data.get("score", 0),
            "qa_passed": qa_data.get("passed", False),
            "type": "backend" if is_backend else "frontend"
        }
    
    async def build_phase(self, phase_id: str, phase_data: Dict) -> Dict:
        """Build all features in a phase."""
        logger.info(f"\n{'='*70}")
        logger.info(f"📦 PHASE: {phase_data['name']}")
        logger.info(f"{'='*70}\n")
        
        features = phase_data.get("features", [])
        phase_results = []
        
        # Determine if this is a backend or frontend phase
        is_backend = "frontend" not in phase_id.lower() and "page" not in phase_id.lower()
        
        for feature in features:
            task = {
                "id": len(phase_results) + 1,
                "phase": phase_id,
                "phase_name": phase_data["name"],
                "feature_id": feature["id"],
                "feature_name": feature["name"],
                "description": feature["description"],
                "data_sources": feature.get("data_sources", []),
                "must_query": feature.get("must_query"),
                "components": feature.get("components", []),
                "features": feature.get("features", []),
            }
            
            result = await self.build_feature(task, is_backend)
            phase_results.append(result)
            
            # Rate limiting
            await asyncio.sleep(1)
        
        return {
            "phase_id": phase_id,
            "phase_name": phase_data["name"],
            "features_built": len([r for r in phase_results if r["status"] == "completed"]),
            "features_failed": len([r for r in phase_results if r["status"] != "completed"]),
            "results": phase_results
        }
    
    async def save_results(self):
        """Save all generated code to files."""
        logger.info("\n💾 Saving results...")
        
        # Create output directories
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        BACKEND_DIR.mkdir(parents=True, exist_ok=True)
        FRONTEND_DIR.mkdir(parents=True, exist_ok=True)
        DOCS_DIR.mkdir(parents=True, exist_ok=True)
        
        saved_files = []
        
        for phase_id, phase_results in self.results.get("phases", {}).items():
            for result in phase_results.get("results", []):
                if result["status"] != "completed":
                    continue
                
                code = result.get("code", "")
                feature_id = result["feature_id"]
                
                if result["type"] == "backend":
                    filepath = BACKEND_DIR / f"{feature_id}.py"
                else:
                    filepath = FRONTEND_DIR / f"{feature_id}.tsx"
                
                with open(filepath, "w") as f:
                    f.write(code)
                
                saved_files.append(str(filepath))
                logger.info(f"  ✓ Saved: {filepath.name}")
        
        # Save summary
        summary = {
            "timestamp": datetime.now().isoformat(),
            "total_tasks": self.total_tasks,
            "completed": self.completed_tasks,
            "failed": self.failed_tasks,
            "api_calls": self.client.request_count,
            "tokens_used": self.client.total_tokens,
            "files_saved": saved_files,
        }
        
        with open(OUTPUT_DIR / "build_summary.json", "w") as f:
            json.dump(summary, f, indent=2)
        
        logger.info(f"\n✅ Saved {len(saved_files)} files to {OUTPUT_DIR}")
        return summary
    
    async def run(self, phases_to_build: List[str] = None):
        """Run the full build process."""
        start_time = time.time()
        
        print("""
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                              ║
║   🚀 LOGOS SWARM BUILD SYSTEM v2.0                                                                           ║
║                                                                                                              ║
║   Powered by Claude Agents - Building ALL 294 Features                                                       ║
║                                                                                                              ║
║   AGENTS:                                                                                                    ║
║   • 3 Backend Builders (FastAPI routers)                                                                     ║
║   • 3 Frontend Builders (Next.js pages)                                                                      ║
║   • 2 QA Agents (code review)                                                                                ║
║   • 2 Fixer Agents (bug fixes)                                                                               ║
║   • 1 Documentation Agent                                                                                    ║
║                                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
        """)
        
        # Verify database
        logger.info("📊 Verifying database connection...")
        db_status = await self.verify_database()
        
        if db_status.get("connected"):
            logger.info("✅ Database connected!")
            for table, count in db_status.get("counts", {}).items():
                logger.info(f"   • {table}: {count:,} rows")
        else:
            logger.warning(f"⚠️ Database not available: {db_status.get('error')}")
            logger.info("   Continuing with graceful degradation...")
        
        # Determine phases to build
        if phases_to_build is None:
            phases_to_build = list(COMPLETE_FEATURES.keys())
        
        # Count total tasks
        self.total_tasks = sum(
            len(COMPLETE_FEATURES[p].get("features", []))
            for p in phases_to_build
            if p in COMPLETE_FEATURES
        )
        
        logger.info(f"\n📋 Building {self.total_tasks} features across {len(phases_to_build)} phases\n")
        
        # Build each phase
        self.results["phases"] = {}
        
        for phase_id in phases_to_build:
            if phase_id not in COMPLETE_FEATURES:
                continue
            
            phase_data = COMPLETE_FEATURES[phase_id]
            phase_result = await self.build_phase(phase_id, phase_data)
            self.results["phases"][phase_id] = phase_result
        
        # Save all results
        summary = await self.save_results()
        
        # Final report
        elapsed = time.time() - start_time
        
        print(f"""
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                              ║
║   ✅ BUILD COMPLETE                                                                                          ║
║                                                                                                              ║
║   Features Built: {self.completed_tasks}/{self.total_tasks}                                                                                  ║
║   Failed: {self.failed_tasks}                                                                                             ║
║   API Calls: {self.client.request_count}                                                                                         ║
║   Tokens Used: {self.client.total_tokens:,}                                                                                     ║
║   Time Elapsed: {elapsed/60:.1f} minutes                                                                              ║
║                                                                                                              ║
║   Output Directory: {OUTPUT_DIR}                               ║
║                                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
        """)
        
        return self.results


# =============================================================================
# MAIN CREW EXECUTION
# =============================================================================

async def main():
    """Main execution."""
    
    # Check API key
    if not ANTHROPIC_API_KEY:
        print("""
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                              ║
║   ❌ ERROR: ANTHROPIC_API_KEY not set                                                                        ║
║                                                                                                              ║
║   Please run:                                                                                                ║
║   export ANTHROPIC_API_KEY='your-key-here'                                                                   ║
║                                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
        """)
        return
    
    # Create output directories
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Show menu
    print("""
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                              ║
║   LOGOS MEGA-BUILD SYSTEM                                                                                    ║
║   ═══════════════════════════════════════════════════════════════════════════════════════════════════════    ║
║                                                                                                              ║
║   BUILD OPTIONS:                                                                                             ║
║                                                                                                              ║
║   1. FULL BUILD (All 294 features) - ~4-6 hours                                                              ║
║   2. BACKEND ONLY (Phases 1-6) - ~2-3 hours                                                                  ║
║   3. FRONTEND ONLY (Phase 8) - ~1-2 hours                                                                    ║
║   4. SINGLE PHASE (choose one)                                                                               ║
║   5. TEST BUILD (1 feature per phase) - ~30 minutes                                                          ║
║                                                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
    """)
    
    print("Available phases:")
    for i, (phase_id, phase) in enumerate(COMPLETE_FEATURES.items()):
        feature_count = len(phase.get("features", []))
        print(f"  {i+1}. {phase['name']}: {feature_count} features")
    
    print()
    choice = input("Enter choice (1-5) or phase number: ").strip()
    
    # Determine phases to build
    all_phases = list(COMPLETE_FEATURES.keys())
    backend_phases = [p for p in all_phases if "frontend" not in p.lower() and "viz" not in p.lower() and "atlas" not in p.lower()]
    frontend_phases = [p for p in all_phases if "frontend" in p.lower() or "viz" in p.lower() or "atlas" in p.lower()]
    
    phases_to_build = all_phases  # Default to all
    
    if choice == "1":
        phases_to_build = all_phases
    elif choice == "2":
        phases_to_build = backend_phases
    elif choice == "3":
        phases_to_build = frontend_phases
    elif choice == "4":
        phase_choice = input(f"Enter phase number (1-{len(all_phases)}): ").strip()
        try:
            idx = int(phase_choice) - 1
            phases_to_build = [all_phases[idx]]
        except:
            print("Invalid phase number, building all phases")
    elif choice == "5":
        # Test build - just first feature of each phase
        phases_to_build = all_phases[:3]  # Just first 3 phases for testing
    
    # Confirm
    total_features = sum(
        len(COMPLETE_FEATURES[p].get("features", []))
        for p in phases_to_build
        if p in COMPLETE_FEATURES
    )
    
    print(f"\n📋 Will build {total_features} features across {len(phases_to_build)} phases")
    print(f"   Estimated time: {total_features * 2} - {total_features * 4} minutes")
    print(f"   Estimated API calls: ~{total_features * 3}")
    print()
    
    confirm = input("Proceed with build? (yes/no): ").strip().lower()
    if confirm != "yes":
        print("Build cancelled.")
        return
    
    # Run the swarm
    orchestrator = SwarmOrchestrator(ANTHROPIC_API_KEY, DATABASE_URL)
    results = await orchestrator.run(phases_to_build)
    
    # Save final results
    with open(OUTPUT_DIR / "full_results.json", "w") as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n✅ Full results saved to {OUTPUT_DIR / 'full_results.json'}")
    print(f"📁 Generated code saved to {BACKEND_DIR} and {FRONTEND_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
