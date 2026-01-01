"""
LOGOS Platform Constants and Configuration
==========================================

CRITICAL: All embedding dimensions and model configurations must use these constants.
Never hardcode dimensions - always reference EMBED_DIM.
"""

import os
from typing import List, Dict

# ═══════════════════════════════════════════════════════════════════════════════
# EMBEDDING CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

# Primary embedding dimension - MUST BE CONSISTENT EVERYWHERE
EMBED_DIM = 768

# Embedding model for semantic embeddings
EMBED_MODEL = "sentence-transformers/all-mpnet-base-v2"  # 768-dim

# Style vector dimension (interpretable features)
STYLE_DIM = 20

# ═══════════════════════════════════════════════════════════════════════════════
# DATABASE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    os.getenv("DATABASE_URL", "")
)

MIN_POOL_SIZE = 5
MAX_POOL_SIZE = 20
COMMAND_TIMEOUT = 60

# ═══════════════════════════════════════════════════════════════════════════════
# CALIBRATION THRESHOLDS
# ═══════════════════════════════════════════════════════════════════════════════

CALIBRATION_THRESHOLDS = {
    "gate_1": {
        "nmi": 0.6,
        "top1_accuracy": 0.70,
        "top3_accuracy": 0.85,
        "ece": 0.05,  # Expected Calibration Error
    },
    "gate_2": {
        "f_ratio": 3.0,
    },
    "gate_3": {
        "easy_accuracy": 0.90,
        "medium_accuracy": 0.80,
        "hard_accuracy": 0.70,
    },
    "gate_4": {
        "neighbor_validity": 0.80,
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# FUNCTION WORD LISTS
# ═══════════════════════════════════════════════════════════════════════════════

GREEK_FUNCTION_WORDS: List[str] = [
    "καί", "δέ", "τε", "γάρ", "μέν", "ἀλλά", "οὖν", "εἰ", "ὡς", "ἄν",
    "ὅτι", "ἤ", "οὐ", "οὐκ", "οὐχ", "μή", "πρός", "ἐν", "εἰς", "ἐκ",
    "ἀπό", "διά", "κατά", "μετά", "περί", "ὑπό", "ὑπέρ", "παρά", "ἐπί", "πρό",
    "ὁ", "ἡ", "τό", "τοῦ", "τῆς", "αὐτός", "αὐτή", "αὐτό", "ἐγώ", "σύ",
    "ἡμεῖς", "ὑμεῖς", "οὗτος", "ἐκεῖνος", "ὅς", "ὅστις", "τίς", "τις", "πᾶς", "εἷς"
]

LATIN_FUNCTION_WORDS: List[str] = [
    "et", "sed", "non", "in", "ad", "cum", "quod", "ut", "si", "enim",
    "nec", "neque", "atque", "ac", "aut", "vel", "nam", "autem", "tamen", "quia",
    "ne", "per", "de", "ex", "ab", "pro", "sub", "ob", "inter", "ante",
    "post", "super", "contra", "is", "ea", "id", "hic", "haec", "hoc", "ille",
    "ego", "tu", "nos", "vos", "qui", "quae", "quis", "quid", "omnis", "unus"
]

FUNCTION_WORDS: Dict[str, List[str]] = {
    "greek": GREEK_FUNCTION_WORDS,
    "latin": LATIN_FUNCTION_WORDS,
}

# ═══════════════════════════════════════════════════════════════════════════════
# STYLE VECTOR DIMENSIONS (20 interpretable features)
# ═══════════════════════════════════════════════════════════════════════════════

STYLE_DIMENSIONS: List[str] = [
    "lexical_complexity",    # 0: Vocabulary sophistication
    "archaism",              # 1: Archaic vs modern diction
    "anglo_saxon",           # 2: Germanic vs Latinate (for English)
    "proper_noun_form",      # 3: Greek(1) vs Latin(0) names
    "epithet_compression",   # 4: Full vs compressed epithets
    "sentence_length",       # 5: Average sentence length
    "sentence_variance",     # 6: Length consistency
    "clause_depth",          # 7: Syntactic complexity
    "word_order",            # 8: Source word order fidelity
    "hypotaxis",             # 9: Subordinate clause preference
    "metaphor",              # 10: Figurative preservation
    "addition",              # 11: Translator additions
    "omission",              # 12: Translator omissions
    "semantic_drift",        # 13: Meaning flexibility
    "rhythm",                # 14: Rhythmic regularity
    "alliteration",          # 15: Sound repetition
    "punctuation_drama",     # 16: Em-dashes, exclamations
    "dialect",               # 17: Dialect fidelity
    "intertext",             # 18: Allusion preservation
    "era_bias",              # 19: Victorian(0) → Modern(1)
]

# ═══════════════════════════════════════════════════════════════════════════════
# PERIOD DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════════════

PERIODS = {
    "archaic": {"start": -800, "end": -500, "description": "Epic diction, oral formulas"},
    "classical": {"start": -500, "end": -323, "description": "Attic prose, drama, philosophy"},
    "hellenistic": {"start": -323, "end": -31, "description": "Koine, scholarship, Alexandria"},
    "early_imperial": {"start": -31, "end": 200, "description": "Silver Latin, Second Sophistic"},
    "late_antique": {"start": 200, "end": 600, "description": "Christian literature, patristics"},
}

# ═══════════════════════════════════════════════════════════════════════════════
# DISPUTED WORKS FOR INTERPOLATION ANALYSIS
# ═══════════════════════════════════════════════════════════════════════════════

DISPUTED_WORKS_PRIORITY = [
    # Greek
    {"urn": "urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:10", "title": "Iliad Book 10 (Doloneia)", "traditional": "Homer"},
    {"urn": "urn:cts:greekLit:tlg0085.tlg003", "title": "Prometheus Bound", "traditional": "Aeschylus"},
    {"urn": "urn:cts:greekLit:tlg0006.tlg017", "title": "Rhesus", "traditional": "Euripides"},
    {"urn": "urn:cts:greekLit:tlg0059.tlg007", "title": "Seventh Letter", "traditional": "Plato"},
    # Latin
    {"urn": "urn:cts:latinLit:phi0690.phi003", "title": "Appendix Vergiliana", "traditional": "Virgil"},
    {"urn": "urn:cts:latinLit:phi1017.phi008", "title": "Octavia", "traditional": "Seneca"},
    {"urn": "urn:cts:latinLit:phi1351.phi001", "title": "Dialogus de Oratoribus", "traditional": "Tacitus"},
]

# ═══════════════════════════════════════════════════════════════════════════════
# NEGATIVE CONTROL METHODS
# ═══════════════════════════════════════════════════════════════════════════════

NEGATIVE_CONTROLS = {
    "shuffle_sentences": "Preserves word frequencies, breaks discourse",
    "shuffle_paragraphs": "Preserves paragraph topics, breaks flow",
    "topic_matched_impostor": "Same genre/time, different author",
    "random_baseline": "Random text of same length",
    "word_shuffle": "Preserves word frequencies exactly, destroys all structure",
    "function_word_swap": "Preserves content words, destroys stylometric signature",
}

# ═══════════════════════════════════════════════════════════════════════════════
# REQUIRED CONFOUND TESTS
# ═══════════════════════════════════════════════════════════════════════════════

REQUIRED_CONFOUND_TESTS = {
    # Existing
    "genre_controlled": "Result holds when controlling for genre",
    "length_controlled": "Result holds when controlling for text length",
    "time_controlled": "Result holds when controlling for time period",
    # NEW - Required
    "stable_across_windows": "Result persists at 500/1000/2000 token windows",
    "stable_across_subsamples": "Result persists in bootstrap resamples",
    "beats_negative_controls": "Result beats shuffle/impostor baselines",
    # Domain-specific
    "dialect_controlled": "Result holds when controlling for dialect (Attic/Ionic/Koine)",
    "manuscript_controlled": "Result not driven by single manuscript tradition",
}

# ═══════════════════════════════════════════════════════════════════════════════
# DOCTRINAL AXES (for Q Reconstruction)
# ═══════════════════════════════════════════════════════════════════════════════

DOCTRINAL_AXES = {
    "christology": {
        "high": ["κύριος", "θεός", "υἱὸς θεοῦ", "λόγος", "σωτήρ", "χριστός", "μονογενής"],
        "low": ["διδάσκαλος", "ῥαββί", "προφήτης", "υἱὸς ἀνθρώπου", "ἄνθρωπος"]
    },
    "cosmology": {
        "gnostic": ["πλήρωμα", "αἰών", "ἀρχών", "δημιουργός", "ὕλη", "σκότος", "φῶς", "πνεῦμα"],
        "proto_orthodox": ["κόσμος", "κτίσις", "ποίημα", "δημιουργία"]
    },
    "asceticism": {
        "high": ["ἐγκράτεια", "νηστεία", "παρθενία", "ἁγνεία"],
        "low": ["γάμος", "τέκνα", "οἶκος"]
    },
    "law_ritual": {
        "pro_law": ["νόμος", "ἐντολή", "περιτομή", "σάββατον", "καθαρός"],
        "anti_law": ["ἐλευθερία", "πίστις", "χάρις"]
    },
    "anti_temple": {
        "anti": ["ναός χειροποίητος"],
        "pro": ["ναός", "θυσιαστήριον", "λατρεία", "προσφορά"]
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# LTQI WEIGHTS
# ═══════════════════════════════════════════════════════════════════════════════

LTQI_WEIGHTS = {
    "semantic": 0.30,
    "syntactic": 0.20,
    "register": 0.15,
    "fluency": 0.15,
    "corpus": 0.20,
}

# ═══════════════════════════════════════════════════════════════════════════════
# HYPOTHESIS CATEGORIES
# ═══════════════════════════════════════════════════════════════════════════════

HYPOTHESIS_CATEGORIES = [
    "stylometric_anomaly",
    "intertext_bridge",
    "semantic_shift",
    "concept_migration",
    "interpolation_hotspot",
    "canon_hinge",
    "lost_source",
    "regime_shift",
]
