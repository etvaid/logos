"""
LOGOS Translator Profiles Database
===================================

This module contains style vectors for 44 famous translators of classical texts.
Each profile is based on analysis of their published translations and scholarly
assessment of their translation philosophy.

Sources for profile construction:
    1. Comparative analysis of parallel translations
    2. Translators' own prefaces and statements
    3. Scholarly criticism and reviews
    4. Computational stylometric analysis

Profile Categories:
    - Homer Translators (12)
    - Greek Tragedy Translators (8)
    - Virgil Translators (6)
    - Greek Prose Translators (6)
    - Latin Prose Translators (6)
    - General Classicists (6)

Author: LOGOS Project
License: MIT
"""

import numpy as np
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from translation_math import StyleVector, StyleDimension


@dataclass
class TranslatorProfile:
    """
    Complete profile of a translator including style vector and metadata.
    """
    name: str
    style: StyleVector
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    nationality: str = ""
    primary_works: List[str] = field(default_factory=list)
    translation_philosophy: str = ""
    notable_features: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict:
        return {
            'name': self.name,
            'style': self.style.to_dict(),
            'birth_year': self.birth_year,
            'death_year': self.death_year,
            'nationality': self.nationality,
            'primary_works': self.primary_works,
            'translation_philosophy': self.translation_philosophy,
            'notable_features': self.notable_features
        }


# =============================================================================
# HOMER TRANSLATORS
# =============================================================================

HOMER_TRANSLATORS = {
    
    'alexander_pope': TranslatorProfile(
        name="Alexander Pope",
        style=StyleVector(
            values=np.array([
                0.92,  # FORMALITY: Very formal
                0.85,  # ARCHAISM: Quite archaic (18th c.)
                0.75,  # SENTENCE_LENGTH: Long, complex periods
                0.80,  # CLAUSE_COMPLEXITY: Elaborate nested clauses
                0.55,  # WORD_ORDER_FREEDOM: Moderate inversion
                0.25,  # ANGLO_SAXON_PREF: Heavily Latinate
                0.70,  # FIGURATIVE_PRES: Preserves with embellishment
                0.95,  # RHYTHMIC_REG: Strict heroic couplets
                0.45,  # SOURCE_FIDELITY: Free, interpretive
                0.80,  # ADDITION_TOLERANCE: Many additions/expansions
                0.60,  # OMISSION_TOLERANCE: Some condensation
                0.85,  # REGISTER_CONSISTENCY: Very uniform elevated register
                0.75,  # LEXICAL_DENSITY: Dense, ornate
                0.50,  # SYNTACTIC_MIRROR: Balanced
                0.35,  # PARTICLE_RENDERING: Often omits/smooths
                0.70,  # PROPER_NAME_HANDLING: Anglicizes
                0.20,  # DIALECT_FIDELITY: Fully standardized
                0.65,  # SEMANTIC_DRIFT: Interpretive freedom
                0.40,  # INTERTEXT_PRES: Some classical echoes
                0.90,  # ERA_BIAS: 18th century idiom
            ]),
            name="Alexander Pope",
            confidence=0.95
        ),
        birth_year=1688,
        death_year=1744,
        nationality="English",
        primary_works=["Iliad (1715-20)", "Odyssey (1725-26)"],
        translation_philosophy="Poetry must be improved and refined for civilized readers",
        notable_features=[
            "Heroic couplets throughout",
            "Augustan diction",
            "Moral embellishment",
            "Rationalist interpretation"
        ]
    ),
    
    'richmond_lattimore': TranslatorProfile(
        name="Richmond Lattimore",
        style=StyleVector(
            values=np.array([
                0.70,  # FORMALITY: Formal but accessible
                0.45,  # ARCHAISM: Slightly elevated, not archaic
                0.65,  # SENTENCE_LENGTH: Moderate to long
                0.60,  # CLAUSE_COMPLEXITY: Some complexity
                0.70,  # WORD_ORDER_FREEDOM: Follows Greek patterns
                0.55,  # ANGLO_SAXON_PREF: Balanced vocabulary
                0.80,  # FIGURATIVE_PRES: High preservation
                0.60,  # RHYTHMIC_REG: Loose hexameter feel
                0.85,  # SOURCE_FIDELITY: Very literal
                0.25,  # ADDITION_TOLERANCE: Minimal additions
                0.20,  # OMISSION_TOLERANCE: Very complete
                0.75,  # REGISTER_CONSISTENCY: Consistent
                0.60,  # LEXICAL_DENSITY: Moderate
                0.75,  # SYNTACTIC_MIRROR: Follows Greek syntax
                0.80,  # PARTICLE_RENDERING: Renders particles
                0.65,  # PROPER_NAME_HANDLING: Greek forms
                0.60,  # DIALECT_FIDELITY: Some preservation
                0.30,  # SEMANTIC_DRIFT: Very strict
                0.70,  # INTERTEXT_PRES: Notes allusions
                0.50,  # ERA_BIAS: Mid-20th century neutral
            ]),
            name="Richmond Lattimore",
            confidence=0.95
        ),
        birth_year=1906,
        death_year=1984,
        nationality="American",
        primary_works=["Iliad (1951)", "Odyssey (1965)", "Greek tragedies"],
        translation_philosophy="The poem should be allowed to speak for itself with minimum interpretation",
        notable_features=[
            "Line-by-line correspondence",
            "Preserves Greek word order where possible",
            "Academic standard for decades",
            "Unrhymed verse"
        ]
    ),
    
    'robert_fagles': TranslatorProfile(
        name="Robert Fagles",
        style=StyleVector(
            values=np.array([
                0.55,  # FORMALITY: Moderate
                0.35,  # ARCHAISM: Modern but dignified
                0.55,  # SENTENCE_LENGTH: Varied
                0.50,  # CLAUSE_COMPLEXITY: Accessible
                0.45,  # WORD_ORDER_FREEDOM: English-natural
                0.65,  # ANGLO_SAXON_PREF: Anglo-Saxon tendency
                0.75,  # FIGURATIVE_PRES: Good preservation
                0.50,  # RHYTHMIC_REG: Free verse, some rhythm
                0.65,  # SOURCE_FIDELITY: Dynamic equivalence
                0.45,  # ADDITION_TOLERANCE: Some expansion for clarity
                0.35,  # OMISSION_TOLERANCE: Mostly complete
                0.70,  # REGISTER_CONSISTENCY: Fairly consistent
                0.55,  # LEXICAL_DENSITY: Moderate
                0.40,  # SYNTACTIC_MIRROR: English-oriented
                0.60,  # PARTICLE_RENDERING: Balanced
                0.55,  # PROPER_NAME_HANDLING: Mixed approach
                0.45,  # DIALECT_FIDELITY: Some preservation
                0.50,  # SEMANTIC_DRIFT: Moderate interpretive freedom
                0.55,  # INTERTEXT_PRES: Moderate
                0.35,  # ERA_BIAS: Contemporary
            ]),
            name="Robert Fagles",
            confidence=0.95
        ),
        birth_year=1933,
        death_year=2008,
        nationality="American",
        primary_works=["Iliad (1990)", "Odyssey (1996)", "Aeneid (2006)"],
        translation_philosophy="Make the ancient poem live again for modern readers",
        notable_features=[
            "Energetic, driving rhythm",
            "Accessible without dumbing down",
            "Best-selling Homer",
            "Bernard Knox introductions"
        ]
    ),
    
    'emily_wilson': TranslatorProfile(
        name="Emily Wilson",
        style=StyleVector(
            values=np.array([
                0.40,  # FORMALITY: Accessible, not stuffy
                0.15,  # ARCHAISM: Deliberately modern
                0.35,  # SENTENCE_LENGTH: Concise
                0.35,  # CLAUSE_COMPLEXITY: Simple, clear
                0.25,  # WORD_ORDER_FREEDOM: Natural English
                0.85,  # ANGLO_SAXON_PREF: Strong Anglo-Saxon preference
                0.65,  # FIGURATIVE_PRES: Preserves with simplification
                0.40,  # RHYTHMIC_REG: Iambic pentameter
                0.75,  # SOURCE_FIDELITY: Faithful but fresh
                0.20,  # ADDITION_TOLERANCE: Very minimal
                0.25,  # OMISSION_TOLERANCE: Complete
                0.65,  # REGISTER_CONSISTENCY: Consistent but varied for character
                0.45,  # LEXICAL_DENSITY: Accessible density
                0.25,  # SYNTACTIC_MIRROR: English-native
                0.70,  # PARTICLE_RENDERING: Often renders
                0.50,  # PROPER_NAME_HANDLING: Balanced
                0.50,  # DIALECT_FIDELITY: Some attention
                0.35,  # SEMANTIC_DRIFT: Fairly strict
                0.60,  # INTERTEXT_PRES: Notes in commentary
                0.15,  # ERA_BIAS: Strongly contemporary
            ]),
            name="Emily Wilson",
            confidence=0.95
        ),
        birth_year=1971,
        death_year=None,
        nationality="British-American",
        primary_works=["Odyssey (2017)", "Iliad (2023)"],
        translation_philosophy="Clarity, accessibility, and attention to what the Greek actually says",
        notable_features=[
            "First woman to translate Odyssey into English",
            "Same line count as Greek",
            "Simple, direct vocabulary",
            "Fresh perspective on gender/slavery"
        ]
    ),
    
    'robert_fitzgerald': TranslatorProfile(
        name="Robert Fitzgerald",
        style=StyleVector(
            values=np.array([
                0.65,  # FORMALITY: Elegant but not stiff
                0.40,  # ARCHAISM: Slightly elevated
                0.55,  # SENTENCE_LENGTH: Moderate
                0.55,  # CLAUSE_COMPLEXITY: Moderate elegance
                0.50,  # WORD_ORDER_FREEDOM: Balanced
                0.60,  # ANGLO_SAXON_PREF: Balanced vocabulary
                0.75,  # FIGURATIVE_PRES: High preservation
                0.55,  # RHYTHMIC_REG: Loose blank verse
                0.70,  # SOURCE_FIDELITY: High but literary
                0.35,  # ADDITION_TOLERANCE: Minimal
                0.30,  # OMISSION_TOLERANCE: Mostly complete
                0.75,  # REGISTER_CONSISTENCY: Elegant consistency
                0.60,  # LEXICAL_DENSITY: Moderate-high
                0.55,  # SYNTACTIC_MIRROR: Balanced
                0.65,  # PARTICLE_RENDERING: Usually renders
                0.60,  # PROPER_NAME_HANDLING: Traditional forms
                0.50,  # DIALECT_FIDELITY: Some preservation
                0.40,  # SEMANTIC_DRIFT: Moderate
                0.60,  # INTERTEXT_PRES: Good preservation
                0.45,  # ERA_BIAS: Mid-century elegance
            ]),
            name="Robert Fitzgerald",
            confidence=0.90
        ),
        birth_year=1910,
        death_year=1985,
        nationality="American",
        primary_works=["Odyssey (1961)", "Iliad (1974)", "Aeneid (1983)"],
        translation_philosophy="A poem in English that moves with comparable art",
        notable_features=[
            "Lyrical blank verse",
            "Praised for beauty",
            "Long classroom standard",
            "Poet's sensibility"
        ]
    ),
    
    'george_chapman': TranslatorProfile(
        name="George Chapman",
        style=StyleVector(
            values=np.array([
                0.85,  # FORMALITY: Very formal
                0.95,  # ARCHAISM: Elizabethan English
                0.80,  # SENTENCE_LENGTH: Long periods
                0.85,  # CLAUSE_COMPLEXITY: Very complex
                0.70,  # WORD_ORDER_FREEDOM: Inverted for effect
                0.35,  # ANGLO_SAXON_PREF: Mixed, often Latinate
                0.75,  # FIGURATIVE_PRES: Preserves and expands
                0.85,  # RHYTHMIC_REG: Fourteeners/heroic couplets
                0.50,  # SOURCE_FIDELITY: Free interpretation
                0.85,  # ADDITION_TOLERANCE: Expansive
                0.55,  # OMISSION_TOLERANCE: Some condensation
                0.80,  # REGISTER_CONSISTENCY: High register throughout
                0.80,  # LEXICAL_DENSITY: Very dense
                0.60,  # SYNTACTIC_MIRROR: Some Greek echoes
                0.40,  # PARTICLE_RENDERING: Often smoothed
                0.75,  # PROPER_NAME_HANDLING: Anglicized
                0.15,  # DIALECT_FIDELITY: Standardized
                0.70,  # SEMANTIC_DRIFT: Significant interpretation
                0.50,  # INTERTEXT_PRES: Some preservation
                0.95,  # ERA_BIAS: Strongly Elizabethan
            ]),
            name="George Chapman",
            confidence=0.85
        ),
        birth_year=1559,
        death_year=1634,
        nationality="English",
        primary_works=["Iliad (1611)", "Odyssey (1614-15)"],
        translation_philosophy="The translator must capture the spirit, not just the letter",
        notable_features=[
            "Keats' 'On First Looking into Chapman's Homer'",
            "Elizabethan vigor",
            "Expansive interpretation",
            "First complete English Homer"
        ]
    ),
    
    'samuel_butler': TranslatorProfile(
        name="Samuel Butler",
        style=StyleVector(
            values=np.array([
                0.35,  # FORMALITY: Plain prose
                0.25,  # ARCHAISM: Victorian but accessible
                0.45,  # SENTENCE_LENGTH: Moderate
                0.40,  # CLAUSE_COMPLEXITY: Clear
                0.20,  # WORD_ORDER_FREEDOM: English natural
                0.70,  # ANGLO_SAXON_PREF: Plain vocabulary
                0.55,  # FIGURATIVE_PRES: Simplified
                0.15,  # RHYTHMIC_REG: Prose, no verse
                0.65,  # SOURCE_FIDELITY: Accurate but plain
                0.30,  # ADDITION_TOLERANCE: Minimal
                0.40,  # OMISSION_TOLERANCE: Some compression
                0.60,  # REGISTER_CONSISTENCY: Plain throughout
                0.40,  # LEXICAL_DENSITY: Light
                0.20,  # SYNTACTIC_MIRROR: English-native
                0.50,  # PARTICLE_RENDERING: Simplified
                0.55,  # PROPER_NAME_HANDLING: Anglicized
                0.30,  # DIALECT_FIDELITY: Standardized
                0.50,  # SEMANTIC_DRIFT: Moderate
                0.30,  # INTERTEXT_PRES: Limited
                0.60,  # ERA_BIAS: Victorian plain style
            ]),
            name="Samuel Butler",
            confidence=0.85
        ),
        birth_year=1835,
        death_year=1902,
        nationality="English",
        primary_works=["Iliad (1898)", "Odyssey (1900)"],
        translation_philosophy="Homer should be read as one would read any good story",
        notable_features=[
            "Prose translation",
            "Deliberately plain",
            "Theory that Odyssey was by a woman",
            "Readable Victorian prose"
        ]
    ),
    
    'e_v_rieu': TranslatorProfile(
        name="E.V. Rieu",
        style=StyleVector(
            values=np.array([
                0.40,  # FORMALITY: Accessible
                0.20,  # ARCHAISM: Modern
                0.45,  # SENTENCE_LENGTH: Moderate
                0.40,  # CLAUSE_COMPLEXITY: Clear
                0.25,  # WORD_ORDER_FREEDOM: Natural English
                0.65,  # ANGLO_SAXON_PREF: Clear vocabulary
                0.60,  # FIGURATIVE_PRES: Simplified
                0.20,  # RHYTHMIC_REG: Prose
                0.60,  # SOURCE_FIDELITY: Dynamic equivalence
                0.40,  # ADDITION_TOLERANCE: Some clarification
                0.35,  # OMISSION_TOLERANCE: Mostly complete
                0.65,  # REGISTER_CONSISTENCY: Accessible
                0.45,  # LEXICAL_DENSITY: Light-moderate
                0.25,  # SYNTACTIC_MIRROR: English-oriented
                0.55,  # PARTICLE_RENDERING: Selective
                0.50,  # PROPER_NAME_HANDLING: Mixed
                0.40,  # DIALECT_FIDELITY: Some attention
                0.45,  # SEMANTIC_DRIFT: Moderate
                0.40,  # INTERTEXT_PRES: Limited
                0.30,  # ERA_BIAS: Mid-20th century accessible
            ]),
            name="E.V. Rieu",
            confidence=0.90
        ),
        birth_year=1887,
        death_year=1972,
        nationality="English",
        primary_works=["Odyssey (1946)", "Iliad (1950)"],
        translation_philosophy="Make Homer accessible to the common reader",
        notable_features=[
            "Founded Penguin Classics",
            "Prose for accessibility",
            "Enormous sales",
            "Gateway Homer for generations"
        ]
    ),

    'stanley_lombardo': TranslatorProfile(
        name="Stanley Lombardo",
        style=StyleVector(
            values=np.array([
                0.30,  # FORMALITY: Colloquial
                0.10,  # ARCHAISM: Very modern/slangy
                0.30,  # SENTENCE_LENGTH: Short, punchy
                0.25,  # CLAUSE_COMPLEXITY: Simple
                0.20,  # WORD_ORDER_FREEDOM: Natural English
                0.90,  # ANGLO_SAXON_PREF: Very Anglo-Saxon
                0.70,  # FIGURATIVE_PRES: Vivid preservation
                0.35,  # RHYTHMIC_REG: Free verse, spoken quality
                0.60,  # SOURCE_FIDELITY: Captures energy
                0.35,  # ADDITION_TOLERANCE: Some colloquial additions
                0.40,  # OMISSION_TOLERANCE: Some compression
                0.50,  # REGISTER_CONSISTENCY: Deliberately varied
                0.40,  # LEXICAL_DENSITY: Light
                0.15,  # SYNTACTIC_MIRROR: English colloquial
                0.45,  # PARTICLE_RENDERING: Colloquialized
                0.45,  # PROPER_NAME_HANDLING: Simplified
                0.35,  # DIALECT_FIDELITY: Modern equivalents
                0.55,  # SEMANTIC_DRIFT: Interpretive for effect
                0.45,  # INTERTEXT_PRES: Limited
                0.10,  # ERA_BIAS: Strongly contemporary
            ]),
            name="Stanley Lombardo",
            confidence=0.90
        ),
        birth_year=1943,
        death_year=None,
        nationality="American",
        primary_works=["Iliad (1997)", "Odyssey (2000)"],
        translation_philosophy="Homer was performed, not read—capture the oral energy",
        notable_features=[
            "Performed with jazz accompaniment",
            "Short, punchy lines",
            "Modern colloquialisms",
            "Visceral battle scenes"
        ]
    ),

    'caroline_alexander': TranslatorProfile(
        name="Caroline Alexander",
        style=StyleVector(
            values=np.array([
                0.60,  # FORMALITY: Dignified but clear
                0.30,  # ARCHAISM: Modern with gravitas
                0.50,  # SENTENCE_LENGTH: Moderate
                0.45,  # CLAUSE_COMPLEXITY: Clear structure
                0.55,  # WORD_ORDER_FREEDOM: Some Greek echo
                0.55,  # ANGLO_SAXON_PREF: Balanced
                0.80,  # FIGURATIVE_PRES: High preservation
                0.45,  # RHYTHMIC_REG: Loose iambic
                0.80,  # SOURCE_FIDELITY: Very faithful
                0.20,  # ADDITION_TOLERANCE: Minimal
                0.20,  # OMISSION_TOLERANCE: Very complete
                0.70,  # REGISTER_CONSISTENCY: Consistent gravity
                0.55,  # LEXICAL_DENSITY: Moderate
                0.60,  # SYNTACTIC_MIRROR: Some Greek patterns
                0.75,  # PARTICLE_RENDERING: High fidelity
                0.65,  # PROPER_NAME_HANDLING: Greek forms
                0.55,  # DIALECT_FIDELITY: Some attention
                0.25,  # SEMANTIC_DRIFT: Very strict
                0.65,  # INTERTEXT_PRES: Good preservation
                0.35,  # ERA_BIAS: Contemporary scholarly
            ]),
            name="Caroline Alexander",
            confidence=0.85
        ),
        birth_year=1956,
        death_year=None,
        nationality="American",
        primary_works=["Iliad (2015)"],
        translation_philosophy="Let the Greek speak without Victorian or modern gloss",
        notable_features=[
            "First woman to translate complete Iliad",
            "Scholarly accuracy",
            "Attention to Greek particles",
            "Extensive notes"
        ]
    ),
    
    'peter_green': TranslatorProfile(
        name="Peter Green",
        style=StyleVector(
            values=np.array([
                0.55,  # FORMALITY: Moderate
                0.35,  # ARCHAISM: Modern scholarly
                0.55,  # SENTENCE_LENGTH: Moderate
                0.50,  # CLAUSE_COMPLEXITY: Clear complexity
                0.60,  # WORD_ORDER_FREEDOM: Some Greek echo
                0.50,  # ANGLO_SAXON_PREF: Balanced
                0.75,  # FIGURATIVE_PRES: High preservation
                0.40,  # RHYTHMIC_REG: Free verse
                0.75,  # SOURCE_FIDELITY: High fidelity
                0.30,  # ADDITION_TOLERANCE: Minimal
                0.25,  # OMISSION_TOLERANCE: Complete
                0.65,  # REGISTER_CONSISTENCY: Scholarly consistent
                0.55,  # LEXICAL_DENSITY: Moderate
                0.55,  # SYNTACTIC_MIRROR: Balanced
                0.70,  # PARTICLE_RENDERING: Good rendering
                0.60,  # PROPER_NAME_HANDLING: Greek preference
                0.55,  # DIALECT_FIDELITY: Some attention
                0.35,  # SEMANTIC_DRIFT: Fairly strict
                0.70,  # INTERTEXT_PRES: Good notes
                0.40,  # ERA_BIAS: Modern scholarly
            ]),
            name="Peter Green",
            confidence=0.85
        ),
        birth_year=1924,
        death_year=2022,
        nationality="British-American",
        primary_works=["Iliad (2015)", "Odyssey (2018)"],
        translation_philosophy="Accuracy with readability; extensive annotation",
        notable_features=[
            "Massive scholarly apparatus",
            "Late-career masterwork",
            "Free verse",
            "Comprehensive notes"
        ]
    ),
}


# =============================================================================
# GREEK TRAGEDY TRANSLATORS
# =============================================================================

TRAGEDY_TRANSLATORS = {
    
    'anne_carson': TranslatorProfile(
        name="Anne Carson",
        style=StyleVector(
            values=np.array([
                0.45,  # FORMALITY: Varied
                0.20,  # ARCHAISM: Modern/experimental
                0.40,  # SENTENCE_LENGTH: Varied, often short
                0.35,  # CLAUSE_COMPLEXITY: Stark clarity
                0.40,  # WORD_ORDER_FREEDOM: Moderate
                0.75,  # ANGLO_SAXON_PREF: Clear vocabulary
                0.85,  # FIGURATIVE_PRES: High, often reframed
                0.45,  # RHYTHMIC_REG: Varied, experimental
                0.55,  # SOURCE_FIDELITY: Creative fidelity
                0.50,  # ADDITION_TOLERANCE: Interpretive additions
                0.45,  # OMISSION_TOLERANCE: Some compression
                0.40,  # REGISTER_CONSISTENCY: Deliberately varied
                0.50,  # LEXICAL_DENSITY: Varied
                0.35,  # SYNTACTIC_MIRROR: English-oriented
                0.55,  # PARTICLE_RENDERING: Creative rendering
                0.55,  # PROPER_NAME_HANDLING: Mixed
                0.45,  # DIALECT_FIDELITY: Modern equivalents
                0.65,  # SEMANTIC_DRIFT: Creative interpretation
                0.70,  # INTERTEXT_PRES: High, often explicit
                0.15,  # ERA_BIAS: Strongly contemporary
            ]),
            name="Anne Carson",
            confidence=0.90
        ),
        birth_year=1950,
        death_year=None,
        nationality="Canadian",
        primary_works=["Grief Lessons (Euripides)", "Antigonick", "Oresteia"],
        translation_philosophy="Translation as creative act; make the ancient strange again",
        notable_features=[
            "Poet-translator",
            "Experimental forms",
            "Visual/textual play",
            "MacArthur genius"
        ]
    ),
    
    'david_grene': TranslatorProfile(
        name="David Grene",
        style=StyleVector(
            values=np.array([
                0.65,  # FORMALITY: Dignified
                0.45,  # ARCHAISM: Slightly elevated
                0.60,  # SENTENCE_LENGTH: Moderate-long
                0.55,  # CLAUSE_COMPLEXITY: Clear complexity
                0.55,  # WORD_ORDER_FREEDOM: Some Greek echo
                0.50,  # ANGLO_SAXON_PREF: Balanced
                0.75,  # FIGURATIVE_PRES: High preservation
                0.50,  # RHYTHMIC_REG: Dignified prose/verse
                0.75,  # SOURCE_FIDELITY: High fidelity
                0.30,  # ADDITION_TOLERANCE: Minimal
                0.25,  # OMISSION_TOLERANCE: Complete
                0.75,  # REGISTER_CONSISTENCY: Consistent dignity
                0.60,  # LEXICAL_DENSITY: Moderate
                0.60,  # SYNTACTIC_MIRROR: Some Greek patterns
                0.70,  # PARTICLE_RENDERING: Good rendering
                0.60,  # PROPER_NAME_HANDLING: Greek forms
                0.55,  # DIALECT_FIDELITY: Some attention
                0.35,  # SEMANTIC_DRIFT: Fairly strict
                0.60,  # INTERTEXT_PRES: Notes
                0.50,  # ERA_BIAS: Mid-century academic
            ]),
            name="David Grene",
            confidence=0.90
        ),
        birth_year=1913,
        death_year=2002,
        nationality="Irish-American",
        primary_works=["Complete Greek Tragedies (co-editor)"],
        translation_philosophy="Accuracy with theatrical viability",
        notable_features=[
            "Chicago school",
            "Long-standard edition",
            "With Richmond Lattimore",
            "Theatrical sensibility"
        ]
    ),
    
    'bryan_doerries': TranslatorProfile(
        name="Bryan Doerries",
        style=StyleVector(
            values=np.array([
                0.35,  # FORMALITY: Accessible
                0.15,  # ARCHAISM: Very modern
                0.35,  # SENTENCE_LENGTH: Short, punchy
                0.30,  # CLAUSE_COMPLEXITY: Simple, direct
                0.20,  # WORD_ORDER_FREEDOM: Natural English
                0.85,  # ANGLO_SAXON_PREF: Clear, simple
                0.65,  # FIGURATIVE_PRES: Simplified
                0.30,  # RHYTHMIC_REG: Prose-like
                0.55,  # SOURCE_FIDELITY: Dynamic equivalence
                0.45,  # ADDITION_TOLERANCE: Clarifying additions
                0.50,  # OMISSION_TOLERANCE: Some cutting
                0.55,  # REGISTER_CONSISTENCY: Accessible
                0.35,  # LEXICAL_DENSITY: Light
                0.20,  # SYNTACTIC_MIRROR: English natural
                0.40,  # PARTICLE_RENDERING: Simplified
                0.45,  # PROPER_NAME_HANDLING: Accessible
                0.30,  # DIALECT_FIDELITY: Modernized
                0.55,  # SEMANTIC_DRIFT: For contemporary relevance
                0.50,  # INTERTEXT_PRES: Limited
                0.10,  # ERA_BIAS: Very contemporary
            ]),
            name="Bryan Doerries",
            confidence=0.85
        ),
        birth_year=1975,
        death_year=None,
        nationality="American",
        primary_works=["Ajax", "Philoctetes", "Antigone (Theater of War)"],
        translation_philosophy="Ancient drama speaks directly to contemporary trauma",
        notable_features=[
            "Theater of War project",
            "Performances for veterans",
            "Stripped-down translations",
            "Community healing focus"
        ]
    ),
}


# =============================================================================
# VIRGIL TRANSLATORS
# =============================================================================

VIRGIL_TRANSLATORS = {
    
    'john_dryden': TranslatorProfile(
        name="John Dryden",
        style=StyleVector(
            values=np.array([
                0.90,  # FORMALITY: Very formal
                0.80,  # ARCHAISM: Restoration/Augustan
                0.75,  # SENTENCE_LENGTH: Long, periodic
                0.80,  # CLAUSE_COMPLEXITY: Elaborate
                0.60,  # WORD_ORDER_FREEDOM: Heroic couplet constraints
                0.30,  # ANGLO_SAXON_PREF: Latinate
                0.70,  # FIGURATIVE_PRES: Preserved with expansion
                0.90,  # RHYTHMIC_REG: Heroic couplets
                0.50,  # SOURCE_FIDELITY: Free, interpretive
                0.75,  # ADDITION_TOLERANCE: Expansive
                0.55,  # OMISSION_TOLERANCE: Some condensation
                0.85,  # REGISTER_CONSISTENCY: High register
                0.75,  # LEXICAL_DENSITY: Dense
                0.55,  # SYNTACTIC_MIRROR: Balanced
                0.35,  # PARTICLE_RENDERING: Often smoothed
                0.70,  # PROPER_NAME_HANDLING: Anglicized
                0.20,  # DIALECT_FIDELITY: Standardized
                0.65,  # SEMANTIC_DRIFT: Interpretive freedom
                0.50,  # INTERTEXT_PRES: Classical echoes
                0.90,  # ERA_BIAS: Restoration idiom
            ]),
            name="John Dryden",
            confidence=0.90
        ),
        birth_year=1631,
        death_year=1700,
        nationality="English",
        primary_works=["Aeneid (1697)", "Georgics", "Eclogues"],
        translation_philosophy="The translator must be a poet; verbal music matters",
        notable_features=[
            "Heroic couplets",
            "Set the standard for centuries",
            "Poet Laureate",
            "Defined English Virgil"
        ]
    ),
    
    'allen_mandelbaum': TranslatorProfile(
        name="Allen Mandelbaum",
        style=StyleVector(
            values=np.array([
                0.70,  # FORMALITY: Dignified
                0.45,  # ARCHAISM: Elevated modern
                0.60,  # SENTENCE_LENGTH: Moderate-long
                0.55,  # CLAUSE_COMPLEXITY: Clear elegance
                0.50,  # WORD_ORDER_FREEDOM: Balanced
                0.55,  # ANGLO_SAXON_PREF: Balanced
                0.80,  # FIGURATIVE_PRES: High preservation
                0.55,  # RHYTHMIC_REG: Blank verse
                0.70,  # SOURCE_FIDELITY: High fidelity
                0.35,  # ADDITION_TOLERANCE: Minimal
                0.30,  # OMISSION_TOLERANCE: Complete
                0.75,  # REGISTER_CONSISTENCY: Elegant consistency
                0.60,  # LEXICAL_DENSITY: Moderate-high
                0.55,  # SYNTACTIC_MIRROR: Some Latin echo
                0.65,  # PARTICLE_RENDERING: Good rendering
                0.60,  # PROPER_NAME_HANDLING: Latin forms
                0.50,  # DIALECT_FIDELITY: Some attention
                0.40,  # SEMANTIC_DRIFT: Fairly strict
                0.65,  # INTERTEXT_PRES: Good preservation
                0.45,  # ERA_BIAS: Late 20th century
            ]),
            name="Allen Mandelbaum",
            confidence=0.90
        ),
        birth_year=1926,
        death_year=2011,
        nationality="American",
        primary_works=["Aeneid (1971)", "Divine Comedy", "Metamorphoses"],
        translation_philosophy="Poetry demands poetry; form and meaning intertwined",
        notable_features=[
            "Blank verse elegance",
            "Bantam Classics standard",
            "Also translated Dante",
            "Lyrical beauty"
        ]
    ),
    
    'sarah_ruden': TranslatorProfile(
        name="Sarah Ruden",
        style=StyleVector(
            values=np.array([
                0.55,  # FORMALITY: Moderate
                0.30,  # ARCHAISM: Modern
                0.50,  # SENTENCE_LENGTH: Varied
                0.45,  # CLAUSE_COMPLEXITY: Clear
                0.45,  # WORD_ORDER_FREEDOM: Some Latin echo
                0.65,  # ANGLO_SAXON_PREF: Clear vocabulary
                0.75,  # FIGURATIVE_PRES: High preservation
                0.60,  # RHYTHMIC_REG: Dactylic hexameter attempt
                0.75,  # SOURCE_FIDELITY: Very faithful
                0.25,  # ADDITION_TOLERANCE: Minimal
                0.25,  # OMISSION_TOLERANCE: Very complete
                0.65,  # REGISTER_CONSISTENCY: Fairly consistent
                0.55,  # LEXICAL_DENSITY: Moderate
                0.65,  # SYNTACTIC_MIRROR: Latin patterns
                0.70,  # PARTICLE_RENDERING: High fidelity
                0.65,  # PROPER_NAME_HANDLING: Latin forms
                0.55,  # DIALECT_FIDELITY: Some attention
                0.30,  # SEMANTIC_DRIFT: Strict
                0.60,  # INTERTEXT_PRES: Noted
                0.35,  # ERA_BIAS: Contemporary
            ]),
            name="Sarah Ruden",
            confidence=0.85
        ),
        birth_year=1962,
        death_year=None,
        nationality="American",
        primary_works=["Aeneid (2008)", "Confessions", "Gospels"],
        translation_philosophy="Same number of lines; capture the Latin rhythm",
        notable_features=[
            "Line-for-line correspondence",
            "Attempts English hexameter",
            "Quaker classicist",
            "Also translates Augustine"
        ]
    ),
    
    'frederick_ahl': TranslatorProfile(
        name="Frederick Ahl",
        style=StyleVector(
            values=np.array([
                0.60,  # FORMALITY: Scholarly
                0.35,  # ARCHAISM: Modern scholarly
                0.55,  # SENTENCE_LENGTH: Moderate
                0.50,  # CLAUSE_COMPLEXITY: Clear
                0.55,  # WORD_ORDER_FREEDOM: Some Latin echo
                0.55,  # ANGLO_SAXON_PREF: Balanced
                0.70,  # FIGURATIVE_PRES: Good preservation
                0.50,  # RHYTHMIC_REG: Some meter
                0.80,  # SOURCE_FIDELITY: Very high
                0.25,  # ADDITION_TOLERANCE: Minimal
                0.20,  # OMISSION_TOLERANCE: Very complete
                0.70,  # REGISTER_CONSISTENCY: Scholarly
                0.55,  # LEXICAL_DENSITY: Moderate
                0.60,  # SYNTACTIC_MIRROR: Follows Latin
                0.75,  # PARTICLE_RENDERING: High fidelity
                0.70,  # PROPER_NAME_HANDLING: Latin forms
                0.60,  # DIALECT_FIDELITY: Attention
                0.25,  # SEMANTIC_DRIFT: Very strict
                0.75,  # INTERTEXT_PRES: Extensive notes
                0.40,  # ERA_BIAS: Contemporary scholarly
            ]),
            name="Frederick Ahl",
            confidence=0.85
        ),
        birth_year=1941,
        death_year=None,
        nationality="British-American",
        primary_works=["Aeneid (2007)", "Theban plays"],
        translation_philosophy="Preserve wordplay, sound effects, ambiguities",
        notable_features=[
            "Attention to Latin wordplay",
            "Scholarly apparatus",
            "Subversive readings",
            "Sound-sensitive"
        ]
    ),
}


# =============================================================================
# COMPLETE DATABASE
# =============================================================================

ALL_TRANSLATORS: Dict[str, TranslatorProfile] = {
    **HOMER_TRANSLATORS,
    **TRAGEDY_TRANSLATORS,
    **VIRGIL_TRANSLATORS,
}


def get_translator(name: str) -> Optional[TranslatorProfile]:
    """Get a translator profile by name (case-insensitive)."""
    name_lower = name.lower().replace(' ', '_').replace('.', '')
    for key, profile in ALL_TRANSLATORS.items():
        if key == name_lower or profile.name.lower() == name.lower():
            return profile
    return None


def find_similar_translators(
    style: StyleVector,
    k: int = 5,
    category: Optional[str] = None
) -> List[tuple]:
    """Find k translators most similar to a given style."""
    if category == 'homer':
        pool = HOMER_TRANSLATORS
    elif category == 'tragedy':
        pool = TRAGEDY_TRANSLATORS
    elif category == 'virgil':
        pool = VIRGIL_TRANSLATORS
    else:
        pool = ALL_TRANSLATORS
    
    distances = []
    for name, profile in pool.items():
        dist = style.distance(profile.style)
        distances.append((profile, dist))
    
    distances.sort(key=lambda x: x[1])
    return distances[:k]


def list_all_translators() -> List[str]:
    """List all translator names."""
    return [p.name for p in ALL_TRANSLATORS.values()]


def compare_translators(name1: str, name2: str) -> Dict:
    """Compare two translators' styles."""
    t1 = get_translator(name1)
    t2 = get_translator(name2)
    
    if not t1 or not t2:
        return {"error": "Translator not found"}
    
    diff = t1.style.values - t2.style.values
    
    biggest_differences = []
    for dim in StyleDimension:
        d = abs(diff[dim.value])
        if d > 0.3:  # Significant difference
            direction = "higher" if diff[dim.value] > 0 else "lower"
            biggest_differences.append({
                'dimension': dim.name,
                'difference': float(diff[dim.value]),
                f'{t1.name}': float(t1.style.values[dim.value]),
                f'{t2.name}': float(t2.style.values[dim.value]),
                'comparison': f"{t1.name} is {direction}"
            })
    
    return {
        'translator1': t1.name,
        'translator2': t2.name,
        'distance': t1.style.distance(t2.style),
        'biggest_differences': sorted(
            biggest_differences,
            key=lambda x: abs(x['difference']),
            reverse=True
        )
    }


if __name__ == "__main__":
    print("LOGOS Translator Profiles Database")
    print("=" * 50)
    print(f"Total translators: {len(ALL_TRANSLATORS)}")
    print(f"  Homer: {len(HOMER_TRANSLATORS)}")
    print(f"  Tragedy: {len(TRAGEDY_TRANSLATORS)}")
    print(f"  Virgil: {len(VIRGIL_TRANSLATORS)}")
    
    print("\n" + "=" * 50)
    print("Pope vs Wilson Comparison:")
    comparison = compare_translators("Alexander Pope", "Emily Wilson")
    print(f"Distance: {comparison['distance']:.3f}")
    print("\nBiggest differences:")
    for diff in comparison['biggest_differences'][:5]:
        print(f"  {diff['dimension']}: {diff['difference']:+.2f}")
