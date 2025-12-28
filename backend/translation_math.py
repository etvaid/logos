"""
LOGOS Mathematical Translation Framework
=========================================

Core Theory: Translation as Three-Space Transformation
------------------------------------------------------
Translation is NOT a direct mapping from Source → Target.
Instead, meaning exists as a language-independent mathematical object.

Three-Space Model:
    S (Source Space): Greek/Latin token embeddings (~50K vocab, 768-dim)
    M (Meaning Space): Pure semantic content (4096-dim, language-agnostic)
    T (Target Space): English tokens + Style (~50K vocab × style)

The Translation Function:
    T(s, σ) = D_T(E_M(s) ⊕ σ)
    
Where:
    E_M : S → M     (Encoder: source to meaning)
    D_T : M × Σ → T (Decoder: meaning + style to target)
    σ ∈ Σ          (Style vector, 20 dimensions)
    ⊕              (Style application operator)

Key Insight: The same meaning m ∈ M can produce infinitely many valid
translations by varying σ. This is why Pope, Lattimore, Fagles, and Wilson
can all "correctly" translate Homer while producing vastly different texts.

Mathematical Properties:
    1. Meaning Invariance: E_M(s) is constant for a given source
    2. Style Independence: σ operates orthogonally to meaning
    3. Reversibility: Back-translation should preserve meaning (not style)
    4. Composability: Styles can be blended, interpolated, extrapolated

Author: LOGOS Project
License: MIT
"""

import numpy as np
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple, Callable
from enum import Enum
import json


# =============================================================================
# STYLE VECTOR DEFINITION (20 Dimensions)
# =============================================================================

class StyleDimension(Enum):
    """
    The 20 dimensions of translation style.
    Each dimension is normalized to [0, 1] where:
        0.0 = minimal/conservative extreme
        0.5 = neutral/balanced
        1.0 = maximal/liberal extreme
    """
    FORMALITY = 0           # casual ←→ formal
    ARCHAISM = 1            # modern ←→ archaic
    SENTENCE_LENGTH = 2     # terse ←→ elaborate
    CLAUSE_COMPLEXITY = 3   # simple ←→ nested
    WORD_ORDER_FREEDOM = 4  # strict English ←→ source-mirroring
    ANGLO_SAXON_PREF = 5    # Latinate vocabulary ←→ Germanic
    FIGURATIVE_PRES = 6     # literal rendering ←→ metaphor preservation
    RHYTHMIC_REG = 7        # prose rhythm ←→ poetic meter
    SOURCE_FIDELITY = 8     # free/dynamic ←→ literal/formal
    ADDITION_TOLERANCE = 9  # minimal additions ←→ expansive glossing
    OMISSION_TOLERANCE = 10 # complete rendering ←→ selective omission
    REGISTER_CONSISTENCY = 11  # varied register ←→ uniform register
    LEXICAL_DENSITY = 12    # sparse/simple ←→ dense/complex
    SYNTACTIC_MIRROR = 13   # English-native order ←→ source-following
    PARTICLE_RENDERING = 14 # omit particles ←→ explicit rendering
    PROPER_NAME_HANDLING = 15  # Anglicize ←→ preserve original
    DIALECT_FIDELITY = 16   # standardize ←→ preserve dialect
    SEMANTIC_DRIFT = 17     # strict equivalence ←→ interpretive freedom
    INTERTEXT_PRES = 18     # ignore allusions ←→ highlight intertexts
    ERA_BIAS = 19           # contemporary idiom ←→ period-appropriate


@dataclass
class StyleVector:
    """
    A 20-dimensional style vector representing a translator's characteristic style.
    
    Mathematical representation: σ ∈ ℝ²⁰, σᵢ ∈ [0,1]
    
    The style vector captures HOW meaning is expressed, not WHAT is expressed.
    Two translations with identical meaning but different styles will have
    the same position in M-space but different σ vectors.
    """
    values: np.ndarray = field(default_factory=lambda: np.full(20, 0.5))
    name: str = "unnamed"
    confidence: float = 1.0  # How confident we are in this profile
    
    def __post_init__(self):
        if isinstance(self.values, list):
            self.values = np.array(self.values)
        assert self.values.shape == (20,), f"Style vector must be 20-dim, got {self.values.shape}"
        assert np.all((self.values >= 0) & (self.values <= 1)), "All values must be in [0,1]"
    
    def __getitem__(self, dim: StyleDimension) -> float:
        return self.values[dim.value]
    
    def __setitem__(self, dim: StyleDimension, value: float):
        assert 0 <= value <= 1, f"Value must be in [0,1], got {value}"
        self.values[dim.value] = value
    
    def distance(self, other: 'StyleVector', metric: str = 'euclidean') -> float:
        """Compute distance between two style vectors."""
        if metric == 'euclidean':
            return np.linalg.norm(self.values - other.values)
        elif metric == 'cosine':
            return 1 - np.dot(self.values, other.values) / (
                np.linalg.norm(self.values) * np.linalg.norm(other.values)
            )
        elif metric == 'manhattan':
            return np.sum(np.abs(self.values - other.values))
        else:
            raise ValueError(f"Unknown metric: {metric}")
    
    def blend(self, other: 'StyleVector', alpha: float = 0.5) -> 'StyleVector':
        """
        Blend two style vectors: σ_new = α·σ_self + (1-α)·σ_other
        
        This creates a style "between" two translators.
        Example: blend(Pope, Wilson, 0.3) = 30% Pope, 70% Wilson
        """
        assert 0 <= alpha <= 1, f"Alpha must be in [0,1], got {alpha}"
        new_values = alpha * self.values + (1 - alpha) * other.values
        return StyleVector(
            values=new_values,
            name=f"blend({self.name}, {other.name}, {alpha:.2f})",
            confidence=min(self.confidence, other.confidence) * 0.9
        )
    
    def extrapolate(self, other: 'StyleVector', beta: float = 1.5) -> 'StyleVector':
        """
        Extrapolate beyond a style: σ_new = σ_self + β·(σ_self - σ_other)
        
        This creates an "exaggerated" version of self's style relative to other.
        Example: extrapolate(Fagles, Lattimore, 1.5) = "more Fagles than Fagles"
        """
        direction = self.values - other.values
        new_values = self.values + beta * direction
        new_values = np.clip(new_values, 0, 1)  # Keep in valid range
        return StyleVector(
            values=new_values,
            name=f"extrapolate({self.name}, {other.name}, {beta:.2f})",
            confidence=self.confidence * 0.7  # Lower confidence for extrapolation
        )
    
    def adjust(self, dimension: StyleDimension, delta: float) -> 'StyleVector':
        """
        Adjust a single dimension: σ_new = σ + δ·eᵢ
        
        Example: adjust(FORMALITY, +0.2) makes translation more formal
        """
        new_values = self.values.copy()
        new_values[dimension.value] = np.clip(
            new_values[dimension.value] + delta, 0, 1
        )
        return StyleVector(
            values=new_values,
            name=f"{self.name}+{dimension.name}({delta:+.2f})",
            confidence=self.confidence * 0.95
        )
    
    def to_dict(self) -> Dict:
        """Serialize to dictionary."""
        return {
            'name': self.name,
            'confidence': self.confidence,
            'dimensions': {
                dim.name: float(self.values[dim.value])
                for dim in StyleDimension
            }
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'StyleVector':
        """Deserialize from dictionary."""
        values = np.array([
            data['dimensions'][dim.name]
            for dim in StyleDimension
        ])
        return cls(
            values=values,
            name=data.get('name', 'unnamed'),
            confidence=data.get('confidence', 1.0)
        )
    
    def describe(self) -> str:
        """Human-readable description of the style."""
        descriptions = []
        for dim in StyleDimension:
            v = self.values[dim.value]
            if v < 0.3:
                level = "low"
            elif v > 0.7:
                level = "high"
            else:
                level = "moderate"
            descriptions.append(f"  {dim.name}: {level} ({v:.2f})")
        return f"Style: {self.name}\n" + "\n".join(descriptions)


# =============================================================================
# MEANING SPACE OPERATIONS
# =============================================================================

@dataclass
class MeaningVector:
    """
    A point in Meaning Space (M).
    
    This represents the pure semantic content of a text, independent of
    any particular language or style. It's what remains constant across
    all valid translations.
    
    Dimension: 4096 (or 768 for smaller models)
    """
    embedding: np.ndarray
    source_text: str = ""
    source_language: str = ""
    metadata: Dict = field(default_factory=dict)
    
    def __post_init__(self):
        if isinstance(self.embedding, list):
            self.embedding = np.array(self.embedding)
    
    @property
    def dim(self) -> int:
        return self.embedding.shape[0]
    
    def similarity(self, other: 'MeaningVector') -> float:
        """Cosine similarity between two meaning vectors."""
        return np.dot(self.embedding, other.embedding) / (
            np.linalg.norm(self.embedding) * np.linalg.norm(other.embedding)
        )
    
    def distance(self, other: 'MeaningVector') -> float:
        """Euclidean distance in meaning space."""
        return np.linalg.norm(self.embedding - other.embedding)


# =============================================================================
# TRANSLATION QUALITY INDEX (LTQI)
# =============================================================================

@dataclass
class LTQIScore:
    """
    LOGOS Translation Quality Index
    
    A multi-dimensional quality score that captures different aspects
    of translation quality beyond simple "accuracy".
    
    Components:
        SF (Semantic Fidelity): Does the translation preserve meaning?
        SC (Stylistic Consistency): Is the style uniform throughout?
        FL (Fluency): Does it read naturally in the target language?
        CA (Cultural Accuracy): Are cultural references handled well?
        
    Formula:
        LTQI = w₁·SF + w₂·SC + w₃·FL + w₄·CA
        
    Where weights sum to 1 and can be adjusted based on use case:
        - Academic: Higher SF weight
        - Literary: Higher FL, SC weights
        - Educational: Higher CA, FL weights
    """
    semantic_fidelity: float      # 0-1: meaning preservation
    stylistic_consistency: float  # 0-1: style uniformity
    fluency: float                # 0-1: target language naturalness
    cultural_accuracy: float      # 0-1: cultural reference handling
    
    # Weights for different use cases
    weights: Dict[str, float] = field(default_factory=lambda: {
        'semantic_fidelity': 0.35,
        'stylistic_consistency': 0.20,
        'fluency': 0.30,
        'cultural_accuracy': 0.15
    })
    
    @property
    def overall(self) -> float:
        """Compute weighted overall score."""
        return (
            self.weights['semantic_fidelity'] * self.semantic_fidelity +
            self.weights['stylistic_consistency'] * self.stylistic_consistency +
            self.weights['fluency'] * self.fluency +
            self.weights['cultural_accuracy'] * self.cultural_accuracy
        )
    
    @property
    def letter_grade(self) -> str:
        """Convert to letter grade."""
        score = self.overall
        if score >= 0.95: return 'A+'
        if score >= 0.90: return 'A'
        if score >= 0.85: return 'A-'
        if score >= 0.80: return 'B+'
        if score >= 0.75: return 'B'
        if score >= 0.70: return 'B-'
        if score >= 0.65: return 'C+'
        if score >= 0.60: return 'C'
        if score >= 0.55: return 'C-'
        if score >= 0.50: return 'D'
        return 'F'
    
    def to_dict(self) -> Dict:
        return {
            'semantic_fidelity': self.semantic_fidelity,
            'stylistic_consistency': self.stylistic_consistency,
            'fluency': self.fluency,
            'cultural_accuracy': self.cultural_accuracy,
            'overall': self.overall,
            'letter_grade': self.letter_grade
        }
    
    def explain(self) -> str:
        """Human-readable explanation of the score."""
        return f"""
LTQI Score: {self.overall:.3f} ({self.letter_grade})
─────────────────────────────
Semantic Fidelity:     {self.semantic_fidelity:.3f} (weight: {self.weights['semantic_fidelity']:.0%})
Stylistic Consistency: {self.stylistic_consistency:.3f} (weight: {self.weights['stylistic_consistency']:.0%})
Fluency:               {self.fluency:.3f} (weight: {self.weights['fluency']:.0%})
Cultural Accuracy:     {self.cultural_accuracy:.3f} (weight: {self.weights['cultural_accuracy']:.0%})
"""


# =============================================================================
# TRANSLATION TRANSFORMATION
# =============================================================================

class TranslationTransform:
    """
    The core translation transformation: T(s, σ) = D_T(E_M(s) ⊕ σ)
    
    This class encapsulates the mathematical model of translation as a
    composition of encoding, style application, and decoding.
    
    In practice, this is implemented using:
        - E_M: Multilingual encoder (e.g., mBERT, XLM-R, or custom)
        - D_T: Conditional decoder (e.g., fine-tuned mT5, custom transformer)
        - ⊕: Style conditioning (learned or rule-based)
    """
    
    def __init__(
        self,
        encoder: Optional[Callable] = None,
        decoder: Optional[Callable] = None,
        style_applicator: Optional[Callable] = None
    ):
        self.encoder = encoder or self._default_encoder
        self.decoder = decoder or self._default_decoder
        self.style_applicator = style_applicator or self._default_style_applicator
    
    def _default_encoder(self, text: str, language: str) -> MeaningVector:
        """Placeholder encoder - replace with actual model."""
        # In production, use sentence-transformers or custom model
        # For now, return random embedding
        np.random.seed(hash(text) % 2**32)
        embedding = np.random.randn(768)
        embedding = embedding / np.linalg.norm(embedding)
        return MeaningVector(
            embedding=embedding,
            source_text=text,
            source_language=language
        )
    
    def _default_decoder(
        self,
        meaning: MeaningVector,
        style: StyleVector,
        target_language: str = 'en'
    ) -> str:
        """Placeholder decoder - replace with actual model."""
        # In production, use fine-tuned decoder
        return f"[Translation of '{meaning.source_text[:50]}...' in {style.name} style]"
    
    def _default_style_applicator(
        self,
        meaning: MeaningVector,
        style: StyleVector
    ) -> np.ndarray:
        """
        Apply style to meaning vector.
        
        Mathematical formulation:
            m' = m + W_σ · σ
            
        Where W_σ is a learned projection matrix that maps style dimensions
        to meaning space adjustments.
        """
        # Simplified: concatenate meaning and style embeddings
        # In production, use learned transformation
        style_expanded = np.tile(style.values, meaning.dim // 20 + 1)[:meaning.dim]
        return meaning.embedding + 0.1 * style_expanded
    
    def translate(
        self,
        source: str,
        source_lang: str,
        target_lang: str,
        style: StyleVector
    ) -> Tuple[str, LTQIScore]:
        """
        Perform translation with style.
        
        Args:
            source: Source text
            source_lang: Source language code ('grc', 'lat', etc.)
            target_lang: Target language code ('en', etc.)
            style: Style vector to apply
            
        Returns:
            Tuple of (translated_text, quality_score)
        """
        # Step 1: Encode to meaning space
        meaning = self.encoder(source, source_lang)
        
        # Step 2: Apply style
        styled_meaning = self._default_style_applicator(meaning, style)
        meaning_styled = MeaningVector(
            embedding=styled_meaning,
            source_text=meaning.source_text,
            source_language=meaning.source_language
        )
        
        # Step 3: Decode to target
        translation = self.decoder(meaning_styled, style, target_lang)
        
        # Step 4: Compute quality score
        score = self._compute_ltqi(meaning, translation, style)
        
        return translation, score
    
    def _compute_ltqi(
        self,
        source_meaning: MeaningVector,
        translation: str,
        style: StyleVector
    ) -> LTQIScore:
        """Compute LTQI score for a translation."""
        # In production, use actual metrics
        # For now, return placeholder scores
        return LTQIScore(
            semantic_fidelity=0.85,
            stylistic_consistency=0.80,
            fluency=0.82,
            cultural_accuracy=0.78
        )


# =============================================================================
# STYLE ANALYSIS
# =============================================================================

class StyleAnalyzer:
    """
    Analyze translations to extract their style vectors.
    
    Given a parallel corpus (source + translation), this extracts the
    implicit style vector used by the translator.
    
    Methods:
        1. Lexical Analysis: vocabulary choices, word frequency
        2. Syntactic Analysis: sentence structure, clause patterns
        3. Comparative Analysis: compare to known translator profiles
    """
    
    def __init__(self):
        self.feature_extractors = {
            StyleDimension.FORMALITY: self._extract_formality,
            StyleDimension.ARCHAISM: self._extract_archaism,
            StyleDimension.SENTENCE_LENGTH: self._extract_sentence_length,
            StyleDimension.CLAUSE_COMPLEXITY: self._extract_clause_complexity,
            StyleDimension.ANGLO_SAXON_PREF: self._extract_anglo_saxon,
            StyleDimension.RHYTHMIC_REG: self._extract_rhythm,
            StyleDimension.LEXICAL_DENSITY: self._extract_lexical_density,
        }
    
    def analyze(
        self,
        source_texts: List[str],
        translations: List[str],
        source_lang: str = 'grc'
    ) -> StyleVector:
        """
        Analyze a corpus of translations to extract style vector.
        
        Args:
            source_texts: List of source texts
            translations: Corresponding translations
            source_lang: Source language code
            
        Returns:
            StyleVector capturing the translator's style
        """
        values = np.full(20, 0.5)  # Start neutral
        
        for dim, extractor in self.feature_extractors.items():
            try:
                values[dim.value] = extractor(translations)
            except Exception as e:
                # Keep neutral if extraction fails
                pass
        
        return StyleVector(values=values, name="analyzed_style")
    
    def _extract_formality(self, texts: List[str]) -> float:
        """Extract formality score from texts."""
        # Markers of formality: longer words, passive voice, no contractions
        total_words = 0
        formal_markers = 0
        
        for text in texts:
            words = text.split()
            total_words += len(words)
            
            # Count formal markers
            for word in words:
                if len(word) > 8:  # Longer words are more formal
                    formal_markers += 1
                if word.lower() in ['thus', 'hence', 'therefore', 'moreover', 'furthermore']:
                    formal_markers += 2
            
            # Contractions reduce formality
            contractions = ["n't", "'ll", "'re", "'ve", "'d", "'s"]
            for c in contractions:
                formal_markers -= text.lower().count(c)
        
        if total_words == 0:
            return 0.5
        
        ratio = formal_markers / total_words
        return np.clip(ratio * 10, 0, 1)  # Scale to [0,1]
    
    def _extract_archaism(self, texts: List[str]) -> float:
        """Extract archaism score from texts."""
        archaic_words = {
            'thee', 'thou', 'thy', 'thine', 'hath', 'doth', 'wherefore',
            'hither', 'thither', 'whence', 'hence', 'whilst', 'amongst',
            'betwixt', 'oft', 'ere', 'nay', 'aye', 'forsooth', 'prithee',
            'verily', 'perchance', 'mayhap', 'methinks', 'behold'
        }
        
        total_words = 0
        archaic_count = 0
        
        for text in texts:
            words = text.lower().split()
            total_words += len(words)
            archaic_count += sum(1 for w in words if w in archaic_words)
        
        if total_words == 0:
            return 0.5
        
        ratio = archaic_count / total_words
        return np.clip(ratio * 50, 0, 1)  # Scale appropriately
    
    def _extract_sentence_length(self, texts: List[str]) -> float:
        """Extract average sentence length (normalized)."""
        import re
        
        total_sentences = 0
        total_words = 0
        
        for text in texts:
            sentences = re.split(r'[.!?]+', text)
            sentences = [s.strip() for s in sentences if s.strip()]
            total_sentences += len(sentences)
            total_words += len(text.split())
        
        if total_sentences == 0:
            return 0.5
        
        avg_length = total_words / total_sentences
        # Normalize: 10 words = 0.0, 30 words = 1.0
        return np.clip((avg_length - 10) / 20, 0, 1)
    
    def _extract_clause_complexity(self, texts: List[str]) -> float:
        """Extract clause complexity from subordinating conjunctions."""
        subordinating = {
            'although', 'because', 'since', 'while', 'whereas', 'if',
            'unless', 'until', 'when', 'whenever', 'where', 'wherever',
            'whether', 'which', 'who', 'whom', 'whose', 'that'
        }
        
        total_words = 0
        subordinate_count = 0
        
        for text in texts:
            words = text.lower().split()
            total_words += len(words)
            subordinate_count += sum(1 for w in words if w in subordinating)
        
        if total_words == 0:
            return 0.5
        
        ratio = subordinate_count / total_words
        return np.clip(ratio * 20, 0, 1)
    
    def _extract_anglo_saxon(self, texts: List[str]) -> float:
        """
        Extract Anglo-Saxon vs Latinate vocabulary preference.
        
        Anglo-Saxon words tend to be shorter, more concrete.
        Latinate words tend to be longer, more abstract.
        """
        # Common Anglo-Saxon words
        anglo_saxon = {
            'be', 'have', 'do', 'say', 'go', 'get', 'make', 'know', 'think',
            'take', 'see', 'come', 'want', 'look', 'use', 'find', 'give',
            'tell', 'work', 'call', 'try', 'ask', 'need', 'feel', 'become',
            'leave', 'put', 'mean', 'keep', 'let', 'begin', 'seem', 'help',
            'show', 'hear', 'play', 'run', 'move', 'live', 'believe', 'hold'
        }
        
        total_words = 0
        anglo_count = 0
        
        for text in texts:
            words = text.lower().split()
            total_words += len(words)
            anglo_count += sum(1 for w in words if w in anglo_saxon)
        
        if total_words == 0:
            return 0.5
        
        ratio = anglo_count / total_words
        return np.clip(ratio * 5, 0, 1)
    
    def _extract_rhythm(self, texts: List[str]) -> float:
        """Extract rhythmic regularity (syllable patterns)."""
        # Simplified: check for line breaks and consistent lengths
        import re
        
        line_lengths = []
        for text in texts:
            lines = text.split('\n')
            for line in lines:
                if line.strip():
                    line_lengths.append(len(line.split()))
        
        if len(line_lengths) < 2:
            return 0.5
        
        # Low variance = high rhythmic regularity
        variance = np.var(line_lengths)
        regularity = 1 / (1 + variance / 10)
        return np.clip(regularity, 0, 1)
    
    def _extract_lexical_density(self, texts: List[str]) -> float:
        """
        Extract lexical density (content words / total words).
        
        Higher density = more information-packed prose.
        """
        function_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'so',
            'as', 'at', 'by', 'for', 'in', 'of', 'on', 'to', 'with',
            'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did',
            'this', 'that', 'these', 'those', 'it', 'its'
        }
        
        total_words = 0
        content_words = 0
        
        for text in texts:
            words = text.lower().split()
            total_words += len(words)
            content_words += sum(1 for w in words if w not in function_words)
        
        if total_words == 0:
            return 0.5
        
        density = content_words / total_words
        # Typical range is 0.4-0.6, normalize to [0,1]
        return np.clip((density - 0.3) / 0.4, 0, 1)


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def style_distance_matrix(styles: List[StyleVector]) -> np.ndarray:
    """Compute pairwise distance matrix for a list of styles."""
    n = len(styles)
    matrix = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            matrix[i, j] = styles[i].distance(styles[j])
    return matrix


def find_nearest_style(
    target: StyleVector,
    candidates: List[StyleVector],
    k: int = 3
) -> List[Tuple[StyleVector, float]]:
    """Find k nearest known styles to a target style."""
    distances = [(s, target.distance(s)) for s in candidates]
    distances.sort(key=lambda x: x[1])
    return distances[:k]


def interpolate_styles(
    styles: List[StyleVector],
    weights: List[float]
) -> StyleVector:
    """Weighted interpolation of multiple styles."""
    assert len(styles) == len(weights), "Must have same number of styles and weights"
    assert abs(sum(weights) - 1.0) < 0.001, "Weights must sum to 1"
    
    combined = np.zeros(20)
    for style, weight in zip(styles, weights):
        combined += weight * style.values
    
    names = [f"{w:.2f}×{s.name}" for s, w in zip(styles, weights)]
    return StyleVector(
        values=combined,
        name=f"interpolate({', '.join(names)})",
        confidence=min(s.confidence for s in styles) * 0.85
    )


if __name__ == "__main__":
    # Quick test
    print("LOGOS Mathematical Translation Framework")
    print("=" * 50)
    
    # Create a sample style vector
    pope_style = StyleVector(
        values=np.array([
            0.9,  # High formality
            0.8,  # High archaism
            0.7,  # Long sentences
            0.8,  # Complex clauses
            0.6,  # Moderate word order freedom
            0.3,  # Latinate vocabulary
            0.7,  # Preserve figures
            0.9,  # High rhythm (heroic couplets)
            0.6,  # Moderate fidelity
            0.7,  # Allows additions
            0.5,  # Moderate omissions
            0.8,  # Consistent register
            0.7,  # Dense lexicon
            0.5,  # Balanced syntax
            0.4,  # Often omits particles
            0.7,  # Anglicizes names
            0.3,  # Standardizes dialect
            0.6,  # Some interpretive freedom
            0.5,  # Moderate intertext
            0.8,  # Period-appropriate
        ]),
        name="Alexander Pope"
    )
    
    wilson_style = StyleVector(
        values=np.array([
            0.4,  # Moderate formality
            0.2,  # Modern
            0.4,  # Shorter sentences
            0.4,  # Simpler clauses
            0.3,  # English word order
            0.8,  # Anglo-Saxon vocabulary
            0.6,  # Preserve some figures
            0.3,  # Prose rhythm
            0.7,  # High fidelity
            0.3,  # Minimal additions
            0.3,  # Complete rendering
            0.6,  # Mostly consistent
            0.5,  # Moderate density
            0.3,  # English-native syntax
            0.7,  # Renders particles
            0.5,  # Balanced names
            0.5,  # Balanced dialect
            0.4,  # Less interpretive
            0.6,  # Notes intertexts
            0.3,  # Contemporary
        ]),
        name="Emily Wilson"
    )
    
    print(f"\nPope-Wilson distance: {pope_style.distance(wilson_style):.3f}")
    
    # Blend styles
    blended = pope_style.blend(wilson_style, 0.5)
    print(f"\n50/50 Blend distance to Pope: {blended.distance(pope_style):.3f}")
    print(f"50/50 Blend distance to Wilson: {blended.distance(wilson_style):.3f}")
    
    # Extrapolate
    ultra_pope = pope_style.extrapolate(wilson_style, 1.5)
    print(f"\nUltra-Pope distance to Pope: {ultra_pope.distance(pope_style):.3f}")
    
    # Test LTQI
    score = LTQIScore(
        semantic_fidelity=0.85,
        stylistic_consistency=0.80,
        fluency=0.82,
        cultural_accuracy=0.78
    )
    print(score.explain())
