"""
LOGOS Complete Translator Profiles
===================================

44+ translator profiles organized by category with full metadata.

Categories:
    - Homer (12 translators)
    - Greek Tragedy (10 translators)
    - Virgil (8 translators)
    - Greek Prose (8 translators)
    - Latin Prose (6 translators)

Each profile includes:
    - 20-dimensional style vector
    - Biographical data
    - Primary works
    - Translation philosophy
    - Notable features

Author: LOGOS Project
License: MIT
"""

import numpy as np
from typing import Dict, List, Optional
from dataclasses import dataclass, field


@dataclass
class TranslatorProfile:
    """Complete translator profile."""
    name: str
    key: str
    category: str
    style_vector: np.ndarray
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    nationality: str = ""
    primary_works: List[str] = field(default_factory=list)
    philosophy: str = ""
    features: List[str] = field(default_factory=list)
    confidence: float = 0.9
    
    def to_dict(self) -> Dict:
        return {
            'name': self.name,
            'key': self.key,
            'category': self.category,
            'style_vector': self.style_vector.tolist(),
            'birth_year': self.birth_year,
            'death_year': self.death_year,
            'nationality': self.nationality,
            'primary_works': self.primary_works,
            'philosophy': self.philosophy,
            'features': self.features,
            'confidence': self.confidence
        }


# Style vector dimension labels for reference
DIMENSIONS = [
    'FORMALITY', 'ARCHAISM', 'SENTENCE_LENGTH', 'CLAUSE_COMPLEXITY',
    'WORD_ORDER_FREEDOM', 'ANGLO_SAXON_PREF', 'FIGURATIVE_PRES', 'RHYTHMIC_REG',
    'SOURCE_FIDELITY', 'ADDITION_TOLERANCE', 'OMISSION_TOLERANCE', 'REGISTER_CONSISTENCY',
    'LEXICAL_DENSITY', 'SYNTACTIC_MIRROR', 'PARTICLE_RENDERING', 'PROPER_NAME_HANDLING',
    'DIALECT_FIDELITY', 'SEMANTIC_DRIFT', 'INTERTEXT_PRES', 'ERA_BIAS'
]


# =============================================================================
# HOMER TRANSLATORS
# =============================================================================

HOMER_TRANSLATORS = [
    TranslatorProfile(
        name="Alexander Pope",
        key="alexander_pope",
        category="homer",
        style_vector=np.array([0.92, 0.85, 0.75, 0.80, 0.55, 0.25, 0.70, 0.95, 0.45, 0.80,
                               0.60, 0.85, 0.75, 0.50, 0.35, 0.70, 0.20, 0.65, 0.40, 0.90]),
        birth_year=1688, death_year=1744, nationality="English",
        primary_works=["Iliad (1715-20)", "Odyssey (1725-26)"],
        philosophy="Poetry must be refined for civilized readers",
        features=["Heroic couplets", "Augustan diction", "Moral embellishment"]
    ),
    TranslatorProfile(
        name="Richmond Lattimore",
        key="richmond_lattimore",
        category="homer",
        style_vector=np.array([0.70, 0.45, 0.65, 0.60, 0.70, 0.55, 0.80, 0.60, 0.85, 0.25,
                               0.20, 0.75, 0.60, 0.75, 0.80, 0.65, 0.60, 0.30, 0.70, 0.50]),
        birth_year=1906, death_year=1984, nationality="American",
        primary_works=["Iliad (1951)", "Odyssey (1965)"],
        philosophy="The poem should speak for itself",
        features=["Line-by-line correspondence", "Academic standard", "Unrhymed verse"]
    ),
    TranslatorProfile(
        name="Robert Fagles",
        key="robert_fagles",
        category="homer",
        style_vector=np.array([0.55, 0.35, 0.55, 0.50, 0.45, 0.65, 0.75, 0.50, 0.65, 0.45,
                               0.35, 0.70, 0.55, 0.40, 0.60, 0.55, 0.45, 0.50, 0.55, 0.35]),
        birth_year=1933, death_year=2008, nationality="American",
        primary_works=["Iliad (1990)", "Odyssey (1996)", "Aeneid (2006)"],
        philosophy="Make ancient poetry live for modern readers",
        features=["Energetic rhythm", "Accessible", "Best-selling"]
    ),
    TranslatorProfile(
        name="Emily Wilson",
        key="emily_wilson",
        category="homer",
        style_vector=np.array([0.40, 0.15, 0.35, 0.35, 0.25, 0.85, 0.65, 0.40, 0.75, 0.20,
                               0.25, 0.65, 0.45, 0.25, 0.70, 0.50, 0.50, 0.35, 0.60, 0.15]),
        birth_year=1971, death_year=None, nationality="British-American",
        primary_works=["Odyssey (2017)", "Iliad (2023)"],
        philosophy="Clarity and attention to what the Greek actually says",
        features=["First woman to translate Odyssey", "Same line count", "Simple vocabulary"]
    ),
    TranslatorProfile(
        name="Robert Fitzgerald",
        key="robert_fitzgerald",
        category="homer",
        style_vector=np.array([0.65, 0.40, 0.55, 0.55, 0.50, 0.60, 0.75, 0.55, 0.70, 0.35,
                               0.30, 0.75, 0.60, 0.55, 0.65, 0.60, 0.50, 0.40, 0.60, 0.45]),
        birth_year=1910, death_year=1985, nationality="American",
        primary_works=["Odyssey (1961)", "Iliad (1974)", "Aeneid (1983)"],
        philosophy="A poem in English with comparable art",
        features=["Lyrical blank verse", "Long classroom standard", "Poet's sensibility"]
    ),
    TranslatorProfile(
        name="George Chapman",
        key="george_chapman",
        category="homer",
        style_vector=np.array([0.85, 0.95, 0.80, 0.85, 0.70, 0.35, 0.75, 0.85, 0.50, 0.85,
                               0.55, 0.80, 0.80, 0.60, 0.40, 0.75, 0.15, 0.70, 0.50, 0.95]),
        birth_year=1559, death_year=1634, nationality="English",
        primary_works=["Iliad (1611)", "Odyssey (1614-15)"],
        philosophy="Capture the spirit, not just the letter",
        features=["Elizabethan vigor", "Expansive interpretation", "First complete English Homer"]
    ),
    TranslatorProfile(
        name="Stanley Lombardo",
        key="stanley_lombardo",
        category="homer",
        style_vector=np.array([0.30, 0.10, 0.30, 0.25, 0.20, 0.90, 0.70, 0.35, 0.60, 0.35,
                               0.40, 0.50, 0.40, 0.15, 0.45, 0.45, 0.35, 0.55, 0.45, 0.10]),
        birth_year=1943, death_year=None, nationality="American",
        primary_works=["Iliad (1997)", "Odyssey (2000)"],
        philosophy="Capture the oral energy of performance",
        features=["Performed with jazz", "Short punchy lines", "Modern colloquialisms"]
    ),
    TranslatorProfile(
        name="Samuel Butler",
        key="samuel_butler",
        category="homer",
        style_vector=np.array([0.35, 0.25, 0.45, 0.40, 0.20, 0.70, 0.55, 0.15, 0.65, 0.30,
                               0.40, 0.60, 0.40, 0.20, 0.50, 0.55, 0.30, 0.50, 0.30, 0.60]),
        birth_year=1835, death_year=1902, nationality="English",
        primary_works=["Iliad (1898)", "Odyssey (1900)"],
        philosophy="Homer should be read as a good story",
        features=["Prose translation", "Deliberately plain", "Readable Victorian"]
    ),
    TranslatorProfile(
        name="E.V. Rieu",
        key="ev_rieu",
        category="homer",
        style_vector=np.array([0.40, 0.20, 0.45, 0.40, 0.25, 0.65, 0.60, 0.20, 0.60, 0.40,
                               0.35, 0.65, 0.45, 0.25, 0.55, 0.50, 0.40, 0.45, 0.40, 0.30]),
        birth_year=1887, death_year=1972, nationality="English",
        primary_works=["Odyssey (1946)", "Iliad (1950)"],
        philosophy="Make Homer accessible to the common reader",
        features=["Founded Penguin Classics", "Prose for accessibility", "Gateway Homer"]
    ),
    TranslatorProfile(
        name="Caroline Alexander",
        key="caroline_alexander",
        category="homer",
        style_vector=np.array([0.60, 0.30, 0.50, 0.45, 0.55, 0.55, 0.80, 0.45, 0.80, 0.20,
                               0.20, 0.70, 0.55, 0.60, 0.75, 0.65, 0.55, 0.25, 0.65, 0.35]),
        birth_year=1956, death_year=None, nationality="American",
        primary_works=["Iliad (2015)"],
        philosophy="Let the Greek speak without gloss",
        features=["First woman to translate Iliad", "Scholarly accuracy", "Extensive notes"]
    ),
    TranslatorProfile(
        name="Peter Green",
        key="peter_green",
        category="homer",
        style_vector=np.array([0.55, 0.35, 0.55, 0.50, 0.60, 0.50, 0.75, 0.40, 0.75, 0.30,
                               0.25, 0.65, 0.55, 0.55, 0.70, 0.60, 0.55, 0.35, 0.70, 0.40]),
        birth_year=1924, death_year=2022, nationality="British-American",
        primary_works=["Iliad (2015)", "Odyssey (2018)"],
        philosophy="Accuracy with readability; extensive annotation",
        features=["Massive scholarly apparatus", "Late-career masterwork", "Comprehensive notes"]
    ),
    TranslatorProfile(
        name="A.T. Murray",
        key="at_murray",
        category="homer",
        style_vector=np.array([0.75, 0.55, 0.60, 0.55, 0.50, 0.45, 0.70, 0.30, 0.80, 0.25,
                               0.20, 0.75, 0.55, 0.55, 0.70, 0.60, 0.50, 0.30, 0.55, 0.55]),
        birth_year=1866, death_year=1940, nationality="American",
        primary_works=["Iliad (Loeb 1924)", "Odyssey (Loeb 1919)"],
        philosophy="Accurate prose for scholarly reference",
        features=["Loeb Classical Library standard", "Prose", "Facing Greek text"]
    ),
]


# =============================================================================
# GREEK TRAGEDY TRANSLATORS
# =============================================================================

TRAGEDY_TRANSLATORS = [
    TranslatorProfile(
        name="Anne Carson",
        key="anne_carson",
        category="tragedy",
        style_vector=np.array([0.45, 0.20, 0.40, 0.35, 0.40, 0.75, 0.85, 0.45, 0.55, 0.50,
                               0.45, 0.40, 0.50, 0.35, 0.55, 0.55, 0.45, 0.65, 0.70, 0.15]),
        birth_year=1950, death_year=None, nationality="Canadian",
        primary_works=["Grief Lessons (Euripides)", "Antigonick", "Oresteia"],
        philosophy="Translation as creative act; make the ancient strange",
        features=["Poet-translator", "Experimental forms", "MacArthur genius"]
    ),
    TranslatorProfile(
        name="David Grene",
        key="david_grene",
        category="tragedy",
        style_vector=np.array([0.65, 0.45, 0.60, 0.55, 0.55, 0.50, 0.75, 0.50, 0.75, 0.30,
                               0.25, 0.75, 0.60, 0.60, 0.70, 0.60, 0.55, 0.35, 0.60, 0.50]),
        birth_year=1913, death_year=2002, nationality="Irish-American",
        primary_works=["Complete Greek Tragedies (co-editor)"],
        philosophy="Accuracy with theatrical viability",
        features=["Chicago school", "Long-standard edition", "With Lattimore"]
    ),
    TranslatorProfile(
        name="Robert Bagg",
        key="robert_bagg",
        category="tragedy",
        style_vector=np.array([0.50, 0.30, 0.50, 0.45, 0.45, 0.60, 0.70, 0.45, 0.65, 0.40,
                               0.35, 0.65, 0.50, 0.45, 0.60, 0.55, 0.45, 0.50, 0.55, 0.30]),
        birth_year=1935, death_year=None, nationality="American",
        primary_works=["Sophocles: Complete Plays"],
        philosophy="Performable poetry for modern theater",
        features=["Actor-friendly", "Speakable verse", "With James Scully"]
    ),
    TranslatorProfile(
        name="Edith Hamilton",
        key="edith_hamilton",
        category="tragedy",
        style_vector=np.array([0.60, 0.40, 0.55, 0.50, 0.40, 0.55, 0.70, 0.40, 0.65, 0.40,
                               0.35, 0.70, 0.55, 0.45, 0.55, 0.55, 0.45, 0.45, 0.50, 0.45]),
        birth_year=1867, death_year=1963, nationality="German-American",
        primary_works=["Three Greek Plays", "The Greek Way"],
        philosophy="Make Greek culture accessible to general readers",
        features=["Popular educator", "Clear prose", "Introductory focus"]
    ),
    TranslatorProfile(
        name="Seamus Heaney",
        key="seamus_heaney",
        category="tragedy",
        style_vector=np.array([0.55, 0.40, 0.50, 0.45, 0.50, 0.70, 0.80, 0.55, 0.60, 0.45,
                               0.40, 0.65, 0.55, 0.50, 0.55, 0.55, 0.50, 0.55, 0.60, 0.35]),
        birth_year=1939, death_year=2013, nationality="Irish",
        primary_works=["The Cure at Troy (Philoctetes)", "The Burial at Thebes (Antigone)"],
        philosophy="Poetic translation as political witness",
        features=["Nobel laureate", "Irish resonance", "Political subtext"]
    ),
    TranslatorProfile(
        name="Bryan Doerries",
        key="bryan_doerries",
        category="tragedy",
        style_vector=np.array([0.35, 0.15, 0.35, 0.30, 0.20, 0.85, 0.65, 0.30, 0.55, 0.45,
                               0.50, 0.55, 0.35, 0.20, 0.40, 0.45, 0.30, 0.55, 0.50, 0.10]),
        birth_year=1975, death_year=None, nationality="American",
        primary_works=["Ajax", "Philoctetes", "Antigone (Theater of War)"],
        philosophy="Ancient drama speaks to contemporary trauma",
        features=["Theater of War project", "Veteran performances", "Community healing"]
    ),
    TranslatorProfile(
        name="Ian Johnston",
        key="ian_johnston",
        category="tragedy",
        style_vector=np.array([0.55, 0.35, 0.50, 0.45, 0.45, 0.60, 0.70, 0.40, 0.70, 0.35,
                               0.30, 0.65, 0.50, 0.50, 0.60, 0.55, 0.45, 0.40, 0.55, 0.35]),
        birth_year=1938, death_year=2015, nationality="Canadian",
        primary_works=["Aeschylus plays", "Sophocles plays", "Euripides plays"],
        philosophy="Free online translations for education",
        features=["Open access pioneer", "Clear verse", "Educational focus"]
    ),
    TranslatorProfile(
        name="Hugh Lloyd-Jones",
        key="hugh_lloyd_jones",
        category="tragedy",
        style_vector=np.array([0.70, 0.50, 0.60, 0.55, 0.60, 0.45, 0.75, 0.45, 0.80, 0.25,
                               0.20, 0.75, 0.60, 0.65, 0.75, 0.65, 0.55, 0.30, 0.65, 0.50]),
        birth_year=1922, death_year=2009, nationality="British",
        primary_works=["Sophocles (Loeb)", "Aeschylus (Loeb)"],
        philosophy="Philological accuracy above all",
        features=["Regius Professor", "Loeb revisions", "Scholarly precision"]
    ),
    TranslatorProfile(
        name="Oliver Taplin",
        key="oliver_taplin",
        category="tragedy",
        style_vector=np.array([0.55, 0.35, 0.50, 0.45, 0.50, 0.55, 0.75, 0.50, 0.70, 0.35,
                               0.30, 0.70, 0.55, 0.55, 0.65, 0.55, 0.50, 0.40, 0.60, 0.40]),
        birth_year=1943, death_year=None, nationality="British",
        primary_works=["Oresteia"],
        philosophy="Attention to theatrical dimension",
        features=["Performance scholar", "Stage directions", "Visual emphasis"]
    ),
    TranslatorProfile(
        name="Alan Sommerstein",
        key="alan_sommerstein",
        category="tragedy",
        style_vector=np.array([0.65, 0.40, 0.55, 0.50, 0.55, 0.50, 0.70, 0.40, 0.80, 0.25,
                               0.20, 0.75, 0.55, 0.60, 0.75, 0.60, 0.55, 0.30, 0.65, 0.45]),
        birth_year=1947, death_year=None, nationality="British",
        primary_works=["Aeschylus (Loeb)", "Aristophanes"],
        philosophy="Comprehensive scholarly edition",
        features=["Loeb editor", "Extensive commentary", "Textual expertise"]
    ),
]


# =============================================================================
# VIRGIL TRANSLATORS
# =============================================================================

VIRGIL_TRANSLATORS = [
    TranslatorProfile(
        name="John Dryden",
        key="john_dryden",
        category="virgil",
        style_vector=np.array([0.90, 0.80, 0.75, 0.80, 0.60, 0.30, 0.70, 0.90, 0.50, 0.75,
                               0.55, 0.85, 0.75, 0.55, 0.35, 0.70, 0.20, 0.65, 0.50, 0.90]),
        birth_year=1631, death_year=1700, nationality="English",
        primary_works=["Aeneid (1697)", "Georgics", "Eclogues"],
        philosophy="The translator must be a poet",
        features=["Heroic couplets", "Set standard for centuries", "Poet Laureate"]
    ),
    TranslatorProfile(
        name="Allen Mandelbaum",
        key="allen_mandelbaum",
        category="virgil",
        style_vector=np.array([0.70, 0.45, 0.60, 0.55, 0.50, 0.55, 0.80, 0.55, 0.70, 0.35,
                               0.30, 0.75, 0.60, 0.55, 0.65, 0.60, 0.50, 0.40, 0.65, 0.45]),
        birth_year=1926, death_year=2011, nationality="American",
        primary_works=["Aeneid (1971)", "Divine Comedy", "Metamorphoses"],
        philosophy="Poetry demands poetry",
        features=["Blank verse elegance", "Also translated Dante", "Lyrical beauty"]
    ),
    TranslatorProfile(
        name="Sarah Ruden",
        key="sarah_ruden",
        category="virgil",
        style_vector=np.array([0.55, 0.30, 0.50, 0.45, 0.45, 0.65, 0.75, 0.60, 0.75, 0.25,
                               0.25, 0.65, 0.55, 0.65, 0.70, 0.65, 0.55, 0.30, 0.60, 0.35]),
        birth_year=1962, death_year=None, nationality="American",
        primary_works=["Aeneid (2008)", "Confessions", "Gospels"],
        philosophy="Same number of lines; capture Latin rhythm",
        features=["Line-for-line", "Attempts hexameter", "Quaker classicist"]
    ),
    TranslatorProfile(
        name="Frederick Ahl",
        key="frederick_ahl",
        category="virgil",
        style_vector=np.array([0.60, 0.35, 0.55, 0.50, 0.55, 0.55, 0.70, 0.50, 0.80, 0.25,
                               0.20, 0.70, 0.55, 0.60, 0.75, 0.70, 0.60, 0.25, 0.75, 0.40]),
        birth_year=1941, death_year=None, nationality="British-American",
        primary_works=["Aeneid (2007)", "Theban plays"],
        philosophy="Preserve wordplay, sound effects, ambiguities",
        features=["Attention to wordplay", "Subversive readings", "Sound-sensitive"]
    ),
    TranslatorProfile(
        name="Shadi Bartsch",
        key="shadi_bartsch",
        category="virgil",
        style_vector=np.array([0.55, 0.25, 0.50, 0.45, 0.40, 0.60, 0.75, 0.45, 0.75, 0.30,
                               0.25, 0.70, 0.55, 0.50, 0.70, 0.60, 0.50, 0.35, 0.65, 0.30]),
        birth_year=1966, death_year=None, nationality="American",
        primary_works=["Aeneid (2021)"],
        philosophy="Modern verse accessible to contemporary readers",
        features=["Recent translation", "Readable modern English", "Scholarly accuracy"]
    ),
    TranslatorProfile(
        name="David Ferry",
        key="david_ferry",
        category="virgil",
        style_vector=np.array([0.60, 0.35, 0.55, 0.50, 0.45, 0.60, 0.80, 0.55, 0.70, 0.35,
                               0.30, 0.70, 0.55, 0.50, 0.60, 0.55, 0.50, 0.45, 0.60, 0.40]),
        birth_year=1924, death_year=2024, nationality="American",
        primary_works=["Georgics", "Eclogues", "Aeneid (Books 1-6)"],
        philosophy="Poetic translation as its own art form",
        features=["Distinguished poet", "National Book Award", "Iambic pentameter"]
    ),
    TranslatorProfile(
        name="C. Day Lewis",
        key="c_day_lewis",
        category="virgil",
        style_vector=np.array([0.65, 0.40, 0.55, 0.50, 0.50, 0.55, 0.75, 0.50, 0.70, 0.35,
                               0.30, 0.70, 0.55, 0.50, 0.60, 0.55, 0.50, 0.40, 0.55, 0.45]),
        birth_year=1904, death_year=1972, nationality="British-Irish",
        primary_works=["Aeneid (1952)", "Georgics", "Eclogues"],
        philosophy="Make Virgil sound like great English poetry",
        features=["Poet Laureate", "Verse translation", "Widely read"]
    ),
    TranslatorProfile(
        name="W.F. Jackson Knight",
        key="jackson_knight",
        category="virgil",
        style_vector=np.array([0.60, 0.45, 0.55, 0.50, 0.45, 0.50, 0.70, 0.35, 0.70, 0.35,
                               0.30, 0.70, 0.55, 0.50, 0.60, 0.55, 0.50, 0.40, 0.55, 0.45]),
        birth_year=1895, death_year=1964, nationality="British",
        primary_works=["Aeneid (Penguin 1956)"],
        philosophy="Prose for accuracy and accessibility",
        features=["Penguin Classics", "Prose translation", "Scholarly introduction"]
    ),
]


# =============================================================================
# GREEK PROSE TRANSLATORS
# =============================================================================

GREEK_PROSE_TRANSLATORS = [
    TranslatorProfile(
        name="Benjamin Jowett",
        key="benjamin_jowett",
        category="greek_prose",
        style_vector=np.array([0.80, 0.65, 0.65, 0.60, 0.45, 0.40, 0.65, 0.30, 0.65, 0.45,
                               0.40, 0.80, 0.60, 0.45, 0.50, 0.55, 0.35, 0.50, 0.45, 0.70]),
        birth_year=1817, death_year=1893, nationality="English",
        primary_works=["Plato: Complete Dialogues", "Thucydides"],
        philosophy="Classical prose for educated Victorians",
        features=["Master of Balliol", "Victorian standard", "Elegant prose"]
    ),
    TranslatorProfile(
        name="G.M.A. Grube",
        key="gma_grube",
        category="greek_prose",
        style_vector=np.array([0.60, 0.35, 0.50, 0.45, 0.40, 0.60, 0.65, 0.25, 0.75, 0.30,
                               0.25, 0.70, 0.50, 0.45, 0.60, 0.55, 0.45, 0.35, 0.55, 0.40]),
        birth_year=1899, death_year=1982, nationality="Canadian",
        primary_works=["Plato's Republic", "Plato's Five Dialogues"],
        philosophy="Clear, accurate philosophical translation",
        features=["Hackett editions", "Widely taught", "Accurate philosophy"]
    ),
    TranslatorProfile(
        name="Robin Waterfield",
        key="robin_waterfield",
        category="greek_prose",
        style_vector=np.array([0.50, 0.25, 0.50, 0.45, 0.35, 0.65, 0.65, 0.25, 0.70, 0.35,
                               0.30, 0.65, 0.50, 0.40, 0.55, 0.55, 0.45, 0.40, 0.55, 0.30]),
        birth_year=1952, death_year=None, nationality="British",
        primary_works=["Herodotus", "Plato dialogues", "Xenophon"],
        philosophy="Readable modern translations with good notes",
        features=["Oxford World's Classics", "Prolific translator", "Clear prose"]
    ),
    TranslatorProfile(
        name="W.H.D. Rouse",
        key="whd_rouse",
        category="greek_prose",
        style_vector=np.array([0.45, 0.30, 0.45, 0.40, 0.30, 0.70, 0.60, 0.20, 0.60, 0.40,
                               0.35, 0.60, 0.45, 0.30, 0.50, 0.50, 0.40, 0.45, 0.45, 0.35]),
        birth_year=1863, death_year=1950, nationality="English",
        primary_works=["Homer (prose)", "Plato dialogues"],
        philosophy="Plain English for students",
        features=["Direct method teacher", "Simple prose", "Signet Classics"]
    ),
    TranslatorProfile(
        name="Aubrey de Sélincourt",
        key="aubrey_de_selincourt",
        category="greek_prose",
        style_vector=np.array([0.55, 0.35, 0.55, 0.50, 0.40, 0.55, 0.65, 0.30, 0.65, 0.40,
                               0.35, 0.65, 0.50, 0.40, 0.55, 0.55, 0.45, 0.45, 0.50, 0.40]),
        birth_year=1894, death_year=1962, nationality="British",
        primary_works=["Herodotus", "Livy", "Arrian"],
        philosophy="Fluent narrative prose",
        features=["Penguin Classics", "Narrative drive", "Readable history"]
    ),
    TranslatorProfile(
        name="Rex Warner",
        key="rex_warner",
        category="greek_prose",
        style_vector=np.array([0.55, 0.35, 0.55, 0.50, 0.40, 0.55, 0.65, 0.25, 0.70, 0.35,
                               0.30, 0.70, 0.55, 0.45, 0.60, 0.55, 0.45, 0.40, 0.55, 0.40]),
        birth_year=1905, death_year=1986, nationality="British",
        primary_works=["Thucydides", "Xenophon"],
        philosophy="Clear prose for the general reader",
        features=["Penguin Classics", "Novelist", "Direct style"]
    ),
    TranslatorProfile(
        name="Tom Holland",
        key="tom_holland",
        category="greek_prose",
        style_vector=np.array([0.45, 0.20, 0.50, 0.45, 0.30, 0.70, 0.60, 0.25, 0.65, 0.40,
                               0.35, 0.60, 0.50, 0.35, 0.50, 0.50, 0.40, 0.50, 0.50, 0.20]),
        birth_year=1968, death_year=None, nationality="British",
        primary_works=["Herodotus", "Thucydides (forthcoming)"],
        philosophy="Vivid narrative for popular audience",
        features=["Popular historian", "Engaging style", "Best-seller"]
    ),
    TranslatorProfile(
        name="C.D.C. Reeve",
        key="cdc_reeve",
        category="greek_prose",
        style_vector=np.array([0.60, 0.30, 0.50, 0.45, 0.40, 0.55, 0.65, 0.25, 0.80, 0.25,
                               0.20, 0.75, 0.55, 0.50, 0.65, 0.55, 0.45, 0.30, 0.60, 0.35]),
        birth_year=1948, death_year=None, nationality="British-American",
        primary_works=["Plato's Republic", "Aristotle selections"],
        philosophy="Philosophically precise translation",
        features=["Hackett editions", "Technical accuracy", "Detailed notes"]
    ),
]


# =============================================================================
# LATIN PROSE TRANSLATORS
# =============================================================================

LATIN_PROSE_TRANSLATORS = [
    TranslatorProfile(
        name="P.G. Walsh",
        key="pg_walsh",
        category="latin_prose",
        style_vector=np.array([0.60, 0.35, 0.55, 0.50, 0.45, 0.55, 0.65, 0.25, 0.75, 0.30,
                               0.25, 0.70, 0.55, 0.50, 0.65, 0.55, 0.50, 0.35, 0.60, 0.40]),
        birth_year=1923, death_year=2013, nationality="British",
        primary_works=["Livy", "Petronius", "Apuleius"],
        philosophy="Accurate scholarly translation",
        features=["Oxford World's Classics", "Prolific", "Reliable"]
    ),
    TranslatorProfile(
        name="Robert Graves",
        key="robert_graves",
        category="latin_prose",
        style_vector=np.array([0.50, 0.30, 0.50, 0.45, 0.35, 0.65, 0.70, 0.35, 0.60, 0.45,
                               0.40, 0.60, 0.50, 0.40, 0.55, 0.50, 0.45, 0.50, 0.55, 0.35]),
        birth_year=1895, death_year=1985, nationality="British",
        primary_works=["Suetonius", "Apuleius", "Lucan"],
        philosophy="Literary translation by a literary man",
        features=["Novelist-poet", "Readable prose", "Some liberties"]
    ),
    TranslatorProfile(
        name="Michael Grant",
        key="michael_grant",
        category="latin_prose",
        style_vector=np.array([0.55, 0.30, 0.50, 0.45, 0.35, 0.60, 0.60, 0.25, 0.70, 0.35,
                               0.30, 0.65, 0.50, 0.40, 0.55, 0.55, 0.45, 0.40, 0.55, 0.35]),
        birth_year=1914, death_year=2004, nationality="British",
        primary_works=["Tacitus", "Cicero"],
        philosophy="Accessible scholarly translation",
        features=["Penguin Classics", "Prolific popularizer", "Good notes"]
    ),
    TranslatorProfile(
        name="Betty Radice",
        key="betty_radice",
        category="latin_prose",
        style_vector=np.array([0.55, 0.35, 0.50, 0.45, 0.40, 0.55, 0.65, 0.25, 0.70, 0.30,
                               0.30, 0.70, 0.50, 0.45, 0.60, 0.55, 0.45, 0.35, 0.55, 0.40]),
        birth_year=1912, death_year=1985, nationality="British",
        primary_works=["Pliny the Younger", "Erasmus", "Terence"],
        philosophy="Scholarly elegance",
        features=["Penguin editor", "Elegant prose", "Widely respected"]
    ),
    TranslatorProfile(
        name="Carolyn Hammond",
        key="carolyn_hammond",
        category="latin_prose",
        style_vector=np.array([0.55, 0.30, 0.50, 0.45, 0.40, 0.60, 0.65, 0.25, 0.75, 0.30,
                               0.25, 0.70, 0.50, 0.45, 0.60, 0.55, 0.45, 0.35, 0.55, 0.35]),
        birth_year=None, death_year=None, nationality="British",
        primary_works=["Caesar's Gallic War"],
        philosophy="Clear, accurate translation for students",
        features=["Oxford World's Classics", "Student-focused", "Good notes"]
    ),
    TranslatorProfile(
        name="A.J. Woodman",
        key="aj_woodman",
        category="latin_prose",
        style_vector=np.array([0.65, 0.40, 0.55, 0.50, 0.50, 0.50, 0.70, 0.30, 0.80, 0.25,
                               0.20, 0.75, 0.55, 0.55, 0.70, 0.60, 0.50, 0.30, 0.65, 0.45]),
        birth_year=1945, death_year=None, nationality="British",
        primary_works=["Tacitus: Annals", "Sallust"],
        philosophy="Philological precision with readable English",
        features=["Cambridge editions", "Scholarly apparatus", "Detailed commentary"]
    ),
]


# =============================================================================
# COMBINED DATABASE
# =============================================================================

ALL_TRANSLATORS = (
    HOMER_TRANSLATORS +
    TRAGEDY_TRANSLATORS +
    VIRGIL_TRANSLATORS +
    GREEK_PROSE_TRANSLATORS +
    LATIN_PROSE_TRANSLATORS
)

TRANSLATORS_BY_KEY = {t.key: t for t in ALL_TRANSLATORS}
TRANSLATORS_BY_CATEGORY = {
    'homer': HOMER_TRANSLATORS,
    'tragedy': TRAGEDY_TRANSLATORS,
    'virgil': VIRGIL_TRANSLATORS,
    'greek_prose': GREEK_PROSE_TRANSLATORS,
    'latin_prose': LATIN_PROSE_TRANSLATORS,
}


def get_translator(name: str) -> Optional[TranslatorProfile]:
    """Get translator by name or key."""
    key = name.lower().replace(' ', '_').replace('.', '')
    if key in TRANSLATORS_BY_KEY:
        return TRANSLATORS_BY_KEY[key]
    for t in ALL_TRANSLATORS:
        if t.name.lower() == name.lower():
            return t
    return None


def list_translators(category: Optional[str] = None) -> List[str]:
    """List translator names, optionally filtered by category."""
    if category and category in TRANSLATORS_BY_CATEGORY:
        return [t.name for t in TRANSLATORS_BY_CATEGORY[category]]
    return [t.name for t in ALL_TRANSLATORS]


def compare_translators(name1: str, name2: str) -> Dict:
    """Compare two translators."""
    t1 = get_translator(name1)
    t2 = get_translator(name2)
    
    if not t1 or not t2:
        return {"error": "Translator not found"}
    
    diff = t1.style_vector - t2.style_vector
    distance = np.linalg.norm(diff)
    
    differences = []
    for i, dim in enumerate(DIMENSIONS):
        if abs(diff[i]) > 0.25:
            differences.append({
                'dimension': dim,
                'difference': float(diff[i]),
                t1.name: float(t1.style_vector[i]),
                t2.name: float(t2.style_vector[i])
            })
    
    differences.sort(key=lambda x: abs(x['difference']), reverse=True)
    
    return {
        'translator1': t1.name,
        'translator2': t2.name,
        'distance': float(distance),
        'biggest_differences': differences[:10]
    }


if __name__ == "__main__":
    print(f"LOGOS Translator Profiles Database")
    print(f"=" * 50)
    print(f"Total translators: {len(ALL_TRANSLATORS)}")
    for cat, translators in TRANSLATORS_BY_CATEGORY.items():
        print(f"  {cat}: {len(translators)}")
    
    print(f"\nSample comparison: Pope vs Wilson")
    result = compare_translators("Alexander Pope", "Emily Wilson")
    print(f"  Distance: {result['distance']:.3f}")
    print(f"  Top difference: {result['biggest_differences'][0]['dimension']}")
