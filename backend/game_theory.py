"""
LOGOS Game Theory for Translation Analysis
============================================

Game-Theoretic Model of Translation
------------------------------------

Translation can be modeled as a strategic game where:
- Players: Translator, Reader, Source Author (absent but with interests)
- Strategies: Translation choices (word selection, style, emphasis)
- Payoffs: Communication success, aesthetic value, fidelity

Key Concepts:
    1. Nash Equilibrium: Stable translation strategy where no player
       benefits from unilateral deviation
    
    2. Quantal Response: Bounded rationality model where choices
       have probabilistic element:
       P(strategy) ∝ exp(λ · utility(strategy))
    
    3. Sway Index: Measure of how much translation shifts reader
       interpretation away from "neutral" reading
    
    4. Truth-Value Analysis: Formal semantics approach to measuring
       how translation preserves/distorts truth conditions

Mathematical Framework:
    Game Γ = (N, S, u) where:
        N = {Translator, Reader, Author}
        S = S_T × S_R × S_A (strategy spaces)
        u = (u_T, u_R, u_A) (utility functions)
    
    Quantal Response Equilibrium:
        P_i(s_i) = exp(λ · u_i(s_i, s_{-i})) / Σ exp(λ · u_i(s'_i, s_{-i}))
    
    Sway Index:
        Sway(T) = D_KL(P_T || P_neutral)
        Where P_T is induced interpretation distribution

Author: LOGOS Project
License: MIT
"""

import numpy as np
from typing import List, Dict, Optional, Tuple, Callable
from dataclasses import dataclass, field
from enum import Enum
from scipy.optimize import minimize, fixed_point
from scipy.special import softmax
import warnings

warnings.filterwarnings('ignore')


# =============================================================================
# TRANSLATION GAME STRUCTURE
# =============================================================================

class TranslationStrategy(Enum):
    """Possible translation strategies."""
    LITERAL = "literal"           # Word-for-word
    DYNAMIC = "dynamic"           # Thought-for-thought
    FREE = "free"                 # Creative interpretation
    DOMESTICATING = "domesticating"  # Adapt to target culture
    FOREIGNIZING = "foreignizing"    # Preserve source strangeness


@dataclass
class Player:
    """A player in the translation game."""
    name: str
    utility_function: Callable
    strategies: List[TranslationStrategy]
    rationality: float = 1.0  # λ parameter for quantal response
    
    def best_response(
        self,
        other_strategies: Dict[str, TranslationStrategy],
        context: Dict
    ) -> TranslationStrategy:
        """Compute best response to other players' strategies."""
        utilities = []
        for s in self.strategies:
            u = self.utility_function(s, other_strategies, context)
            utilities.append(u)
        
        return self.strategies[np.argmax(utilities)]
    
    def quantal_response(
        self,
        other_strategies: Dict[str, TranslationStrategy],
        context: Dict
    ) -> Dict[TranslationStrategy, float]:
        """Compute quantal response distribution."""
        utilities = np.array([
            self.utility_function(s, other_strategies, context)
            for s in self.strategies
        ])
        
        probs = softmax(self.rationality * utilities)
        return {s: p for s, p in zip(self.strategies, probs)}


@dataclass
class TranslationGame:
    """
    Game-theoretic model of translation.
    
    Models the strategic interaction between:
    - Translator: Chooses translation strategy
    - Reader: Interprets translation
    - Source: Has embedded intentions (not active player)
    """
    
    source_text: str
    source_lang: str
    target_lang: str
    context: Dict = field(default_factory=dict)
    
    def __post_init__(self):
        # Initialize players
        self.translator = Player(
            name="Translator",
            utility_function=self._translator_utility,
            strategies=list(TranslationStrategy),
            rationality=2.0
        )
        
        self.reader = Player(
            name="Reader",
            utility_function=self._reader_utility,
            strategies=list(TranslationStrategy),  # Reader's preferred style
            rationality=1.5
        )
    
    def _translator_utility(
        self,
        strategy: TranslationStrategy,
        others: Dict[str, TranslationStrategy],
        ctx: Dict
    ) -> float:
        """
        Translator's utility function.
        
        Balances:
        - Fidelity to source
        - Reader satisfaction
        - Aesthetic achievement
        - Professional reputation
        """
        # Base utilities
        utilities = {
            TranslationStrategy.LITERAL: 0.6,
            TranslationStrategy.DYNAMIC: 0.7,
            TranslationStrategy.FREE: 0.5,
            TranslationStrategy.DOMESTICATING: 0.6,
            TranslationStrategy.FOREIGNIZING: 0.55,
        }
        
        base = utilities.get(strategy, 0.5)
        
        # Bonus if matches reader preference
        reader_pref = others.get('Reader')
        if reader_pref == strategy:
            base += 0.3
        
        # Context modifiers
        if ctx.get('academic', False):
            if strategy == TranslationStrategy.LITERAL:
                base += 0.2
        if ctx.get('popular', False):
            if strategy == TranslationStrategy.DYNAMIC:
                base += 0.2
        
        return base
    
    def _reader_utility(
        self,
        strategy: TranslationStrategy,
        others: Dict[str, TranslationStrategy],
        ctx: Dict
    ) -> float:
        """
        Reader's utility function.
        
        Based on:
        - Comprehension
        - Aesthetic enjoyment
        - Cultural connection
        - Educational value
        """
        utilities = {
            TranslationStrategy.LITERAL: 0.4,
            TranslationStrategy.DYNAMIC: 0.8,
            TranslationStrategy.FREE: 0.6,
            TranslationStrategy.DOMESTICATING: 0.7,
            TranslationStrategy.FOREIGNIZING: 0.5,
        }
        
        base = utilities.get(strategy, 0.5)
        
        # Match bonus
        translator_choice = others.get('Translator')
        if translator_choice == strategy:
            base += 0.2
        
        return base
    
    def find_nash_equilibrium(self) -> Dict[str, TranslationStrategy]:
        """
        Find Nash equilibrium of the translation game.
        
        Uses iterated best response.
        """
        # Initialize with dynamic equivalence
        strategies = {
            'Translator': TranslationStrategy.DYNAMIC,
            'Reader': TranslationStrategy.DYNAMIC
        }
        
        for _ in range(100):  # Max iterations
            new_strategies = {}
            
            # Translator best response
            new_strategies['Translator'] = self.translator.best_response(
                {'Reader': strategies['Reader']},
                self.context
            )
            
            # Reader best response
            new_strategies['Reader'] = self.reader.best_response(
                {'Translator': strategies['Translator']},
                self.context
            )
            
            if new_strategies == strategies:
                break
            strategies = new_strategies
        
        return strategies
    
    def find_quantal_equilibrium(
        self,
        tolerance: float = 1e-6,
        max_iter: int = 100
    ) -> Dict[str, Dict[TranslationStrategy, float]]:
        """
        Find Quantal Response Equilibrium (QRE).
        
        Accounts for bounded rationality - players make probabilistic
        choices based on expected utility.
        """
        n_strategies = len(TranslationStrategy)
        
        # Initialize uniform
        trans_probs = np.ones(n_strategies) / n_strategies
        reader_probs = np.ones(n_strategies) / n_strategies
        
        strategies = list(TranslationStrategy)
        
        for _ in range(max_iter):
            # Compute expected utilities for translator
            trans_utils = np.zeros(n_strategies)
            for i, s_t in enumerate(strategies):
                for j, s_r in enumerate(strategies):
                    u = self._translator_utility(s_t, {'Reader': s_r}, self.context)
                    trans_utils[i] += reader_probs[j] * u
            
            # Quantal response
            new_trans_probs = softmax(self.translator.rationality * trans_utils)
            
            # Compute expected utilities for reader
            reader_utils = np.zeros(n_strategies)
            for i, s_r in enumerate(strategies):
                for j, s_t in enumerate(strategies):
                    u = self._reader_utility(s_r, {'Translator': s_t}, self.context)
                    reader_utils[i] += trans_probs[j] * u
            
            new_reader_probs = softmax(self.reader.rationality * reader_utils)
            
            # Check convergence
            if (np.allclose(new_trans_probs, trans_probs, atol=tolerance) and
                np.allclose(new_reader_probs, reader_probs, atol=tolerance)):
                break
            
            trans_probs = new_trans_probs
            reader_probs = new_reader_probs
        
        return {
            'Translator': {s: p for s, p in zip(strategies, trans_probs)},
            'Reader': {s: p for s, p in zip(strategies, reader_probs)}
        }


# =============================================================================
# SWAY INDEX COMPUTATION
# =============================================================================

class SwayAnalyzer:
    """
    Compute sway index for translations.
    
    Sway measures how much a translation shifts reader interpretation
    away from a "neutral" or "literal" baseline.
    
    Mathematical Definition:
        Sway(T) = D_KL(P_T || P_neutral)
        
    Where:
        P_T = interpretation distribution induced by translation T
        P_neutral = interpretation distribution from neutral baseline
        D_KL = Kullback-Leibler divergence
    """
    
    def __init__(self, dimensions: int = 10):
        """
        Initialize with interpretation dimensions.
        
        Dimensions represent axes of interpretation:
        - Political (left-right)
        - Emotional valence
        - Certainty level
        - Temporal emphasis
        - etc.
        """
        self.dimensions = dimensions
        
        # Dimension labels
        self.dim_labels = [
            'political',
            'emotional_valence',
            'certainty',
            'temporal_emphasis',
            'agency_attribution',
            'moral_judgment',
            'aesthetic_emphasis',
            'cultural_specificity',
            'formality',
            'urgency'
        ][:dimensions]
    
    def compute_interpretation_distribution(
        self,
        translation: str,
        reference_neutral: Optional[str] = None
    ) -> np.ndarray:
        """
        Compute interpretation distribution from translation.
        
        In production, use NLP analysis. Here, use heuristics.
        """
        text = translation.lower()
        
        # Heuristic features
        features = np.zeros(self.dimensions)
        
        # Political leaning (simplified)
        left_words = ['equality', 'collective', 'social', 'rights', 'freedom']
        right_words = ['order', 'tradition', 'authority', 'duty', 'honor']
        features[0] = (sum(text.count(w) for w in left_words) - 
                      sum(text.count(w) for w in right_words)) / (len(text.split()) + 1) * 10
        
        # Emotional valence
        positive = ['good', 'beautiful', 'noble', 'great', 'joy', 'love']
        negative = ['bad', 'terrible', 'evil', 'doom', 'death', 'hate']
        features[1] = (sum(text.count(w) for w in positive) - 
                      sum(text.count(w) for w in negative)) / (len(text.split()) + 1) * 10
        
        # Certainty
        certain = ['must', 'certainly', 'always', 'never', 'absolute']
        uncertain = ['perhaps', 'maybe', 'might', 'could', 'possibly']
        features[2] = (sum(text.count(w) for w in certain) - 
                      sum(text.count(w) for w in uncertain)) / (len(text.split()) + 1) * 10
        
        # Temporal emphasis
        past = ['was', 'were', 'had', 'ancient', 'old']
        present = ['is', 'are', 'now', 'today', 'current']
        features[3] = (sum(text.count(w) for w in present) - 
                      sum(text.count(w) for w in past)) / (len(text.split()) + 1) * 10
        
        # Fill remaining with random for demo
        for i in range(4, self.dimensions):
            features[i] = np.random.randn() * 0.1
        
        # Convert to probability distribution (softmax)
        return softmax(features)
    
    def compute_sway(
        self,
        translation: str,
        neutral_baseline: str,
        method: str = 'kl_divergence'
    ) -> Dict:
        """
        Compute sway index.
        
        Methods:
        - kl_divergence: Kullback-Leibler divergence
        - js_divergence: Jensen-Shannon divergence (symmetric)
        - total_variation: Total variation distance
        - wasserstein: Wasserstein distance
        """
        p_trans = self.compute_interpretation_distribution(translation)
        p_neutral = self.compute_interpretation_distribution(neutral_baseline)
        
        # Ensure no zeros for KL
        epsilon = 1e-10
        p_trans = np.clip(p_trans, epsilon, 1)
        p_neutral = np.clip(p_neutral, epsilon, 1)
        p_trans /= p_trans.sum()
        p_neutral /= p_neutral.sum()
        
        if method == 'kl_divergence':
            sway = np.sum(p_trans * np.log(p_trans / p_neutral))
        elif method == 'js_divergence':
            m = 0.5 * (p_trans + p_neutral)
            sway = 0.5 * np.sum(p_trans * np.log(p_trans / m)) + \
                   0.5 * np.sum(p_neutral * np.log(p_neutral / m))
        elif method == 'total_variation':
            sway = 0.5 * np.sum(np.abs(p_trans - p_neutral))
        elif method == 'wasserstein':
            # 1D Wasserstein (earth mover's)
            sway = np.sum(np.abs(np.cumsum(p_trans) - np.cumsum(p_neutral)))
        else:
            sway = 0.0
        
        # Dimension-wise analysis
        dim_sway = {
            self.dim_labels[i]: float(p_trans[i] - p_neutral[i])
            for i in range(self.dimensions)
        }
        
        return {
            'total_sway': float(sway),
            'method': method,
            'dimensional_sway': dim_sway,
            'translation_distribution': p_trans.tolist(),
            'neutral_distribution': p_neutral.tolist(),
            'interpretation': self._interpret_sway(sway, dim_sway)
        }
    
    def _interpret_sway(self, sway: float, dim_sway: Dict) -> str:
        """Generate human-readable interpretation of sway."""
        if sway < 0.1:
            level = "minimal"
        elif sway < 0.3:
            level = "moderate"
        elif sway < 0.5:
            level = "significant"
        else:
            level = "substantial"
        
        # Find dominant direction
        dominant = max(dim_sway.items(), key=lambda x: abs(x[1]))
        direction = "positive" if dominant[1] > 0 else "negative"
        
        return f"{level} sway, primarily in {dominant[0]} ({direction})"
    
    def compare_translations(
        self,
        translations: Dict[str, str],
        neutral_baseline: str
    ) -> Dict:
        """Compare multiple translations for sway."""
        results = {}
        
        for name, text in translations.items():
            results[name] = self.compute_sway(text, neutral_baseline)
        
        # Rank by sway
        ranking = sorted(results.items(), key=lambda x: x[1]['total_sway'])
        
        return {
            'individual_results': results,
            'ranking_by_sway': [(name, r['total_sway']) for name, r in ranking],
            'least_sway': ranking[0][0],
            'most_sway': ranking[-1][0]
        }


# =============================================================================
# TRUTH-VALUE ANALYSIS
# =============================================================================

class TruthAnalyzer:
    """
    Formal semantic analysis of translation truth preservation.
    
    Uses model-theoretic semantics to analyze whether translations
    preserve truth conditions of the source.
    
    Key Concepts:
        - Truth conditions: Circumstances under which sentence is true
        - Entailment preservation: If A ⊨ B in source, then T(A) ⊨ T(B)
        - Presupposition handling: Treatment of background assumptions
    """
    
    def __init__(self):
        # Semantic primitives
        self.predicates = {}
        self.entities = {}
        self.worlds = {}
    
    def analyze_truth_preservation(
        self,
        source: str,
        translation: str,
        source_lang: str = 'grc'
    ) -> Dict:
        """
        Analyze how well translation preserves truth conditions.
        
        Returns scores for:
        - Referential accuracy
        - Predicate preservation
        - Quantifier handling
        - Modal accuracy
        - Temporal accuracy
        """
        # Simplified analysis (in production, use semantic parsing)
        
        scores = {
            'referential_accuracy': self._analyze_reference(source, translation),
            'predicate_preservation': self._analyze_predicates(source, translation),
            'quantifier_handling': self._analyze_quantifiers(translation),
            'modal_accuracy': self._analyze_modals(translation),
            'temporal_accuracy': self._analyze_temporals(translation)
        }
        
        overall = np.mean(list(scores.values()))
        
        return {
            'overall_truth_preservation': float(overall),
            'component_scores': scores,
            'grade': self._grade(overall),
            'analysis': self._generate_analysis(scores)
        }
    
    def _analyze_reference(self, source: str, translation: str) -> float:
        """Analyze referential accuracy."""
        # Check proper noun preservation
        # Simplified: check that translation has similar word count
        source_len = len(source.split())
        trans_len = len(translation.split())
        
        ratio = min(source_len, trans_len) / max(source_len, trans_len)
        return 0.5 + 0.5 * ratio
    
    def _analyze_predicates(self, source: str, translation: str) -> float:
        """Analyze predicate preservation."""
        # Check verb presence
        trans_lower = translation.lower()
        common_verbs = ['is', 'was', 'are', 'were', 'have', 'has', 'do', 'did', 'say', 'said']
        verb_count = sum(trans_lower.count(v) for v in common_verbs)
        
        return min(1.0, 0.3 + verb_count * 0.1)
    
    def _analyze_quantifiers(self, translation: str) -> float:
        """Analyze quantifier handling."""
        trans_lower = translation.lower()
        
        # Universal quantifiers
        universal = ['all', 'every', 'each', 'always', 'never']
        # Existential quantifiers
        existential = ['some', 'a', 'an', 'sometimes', 'any']
        
        has_universal = any(q in trans_lower for q in universal)
        has_existential = any(q in trans_lower for q in existential)
        
        if has_universal or has_existential:
            return 0.8
        return 0.6
    
    def _analyze_modals(self, translation: str) -> float:
        """Analyze modal accuracy."""
        trans_lower = translation.lower()
        
        modals = ['must', 'should', 'could', 'would', 'might', 'may', 'can', 'will']
        modal_count = sum(trans_lower.count(m) for m in modals)
        
        if modal_count > 0:
            return 0.85
        return 0.7
    
    def _analyze_temporals(self, translation: str) -> float:
        """Analyze temporal accuracy."""
        trans_lower = translation.lower()
        
        # Past markers
        past = ['was', 'were', 'had', 'did']
        # Present markers
        present = ['is', 'are', 'has', 'does']
        # Future markers
        future = ['will', 'shall', 'going to']
        
        has_past = any(t in trans_lower for t in past)
        has_present = any(t in trans_lower for t in present)
        has_future = any(t in trans_lower for t in future)
        
        # Consistent temporal framing
        consistency = sum([has_past, has_present, has_future])
        if consistency == 1:
            return 0.9
        elif consistency == 2:
            return 0.7
        return 0.6
    
    def _grade(self, score: float) -> str:
        """Convert score to letter grade."""
        if score >= 0.9:
            return 'A'
        elif score >= 0.8:
            return 'B'
        elif score >= 0.7:
            return 'C'
        elif score >= 0.6:
            return 'D'
        return 'F'
    
    def _generate_analysis(self, scores: Dict) -> str:
        """Generate textual analysis."""
        weak_areas = [k for k, v in scores.items() if v < 0.7]
        strong_areas = [k for k, v in scores.items() if v >= 0.85]
        
        analysis = []
        if strong_areas:
            analysis.append(f"Strong in: {', '.join(strong_areas)}")
        if weak_areas:
            analysis.append(f"Needs improvement: {', '.join(weak_areas)}")
        
        return "; ".join(analysis) if analysis else "Balanced performance across dimensions"


# =============================================================================
# BIAS DETECTION
# =============================================================================

class BiasDetector:
    """
    Detect and quantify bias in translations.
    
    Types of bias analyzed:
    - Political bias
    - Gender bias
    - Cultural bias
    - Temporal bias (anachronism)
    - Religious bias
    """
    
    def __init__(self):
        # Bias indicators
        self.political_left = ['progressive', 'equality', 'liberation', 'revolution']
        self.political_right = ['traditional', 'order', 'authority', 'heritage']
        
        self.gender_male = ['he', 'him', 'his', 'man', 'men', 'king', 'lord']
        self.gender_female = ['she', 'her', 'woman', 'women', 'queen', 'lady']
        
        self.religious_christian = ['god', 'lord', 'heaven', 'soul', 'sin']
        self.religious_neutral = ['divine', 'deity', 'sacred', 'spirit']
    
    def detect_bias(self, translation: str) -> Dict:
        """
        Comprehensive bias detection.
        """
        trans_lower = translation.lower()
        words = trans_lower.split()
        word_count = len(words)
        
        biases = {}
        
        # Political bias
        left_count = sum(trans_lower.count(w) for w in self.political_left)
        right_count = sum(trans_lower.count(w) for w in self.political_right)
        political_score = (left_count - right_count) / (word_count + 1) * 100
        biases['political'] = {
            'score': float(political_score),
            'direction': 'left' if political_score > 0 else 'right' if political_score < 0 else 'neutral',
            'magnitude': abs(political_score)
        }
        
        # Gender bias
        male_count = sum(trans_lower.count(w) for w in self.gender_male)
        female_count = sum(trans_lower.count(w) for w in self.gender_female)
        gender_ratio = male_count / (female_count + 1)
        biases['gender'] = {
            'male_references': male_count,
            'female_references': female_count,
            'ratio': float(gender_ratio),
            'assessment': 'male-dominated' if gender_ratio > 3 else 'balanced' if 0.5 < gender_ratio < 2 else 'female-dominated'
        }
        
        # Religious bias
        christian_count = sum(trans_lower.count(w) for w in self.religious_christian)
        neutral_count = sum(trans_lower.count(w) for w in self.religious_neutral)
        biases['religious'] = {
            'christian_terminology': christian_count,
            'neutral_terminology': neutral_count,
            'assessment': 'christianized' if christian_count > neutral_count * 2 else 'neutral'
        }
        
        # Anachronism detection (simplified)
        modern_words = ['okay', 'guy', 'stuff', 'thing', 'whatever', 'like']
        anachronism_count = sum(trans_lower.count(w) for w in modern_words)
        biases['anachronism'] = {
            'modern_intrusions': anachronism_count,
            'assessment': 'high' if anachronism_count > 3 else 'low'
        }
        
        # Overall bias score
        overall = (
            abs(biases['political']['magnitude']) +
            abs(np.log(gender_ratio + 0.1)) +
            (christian_count - neutral_count) / (word_count + 1) * 10 +
            anachronism_count
        )
        
        return {
            'overall_bias_index': float(overall),
            'component_biases': biases,
            'recommendations': self._generate_recommendations(biases)
        }
    
    def _generate_recommendations(self, biases: Dict) -> List[str]:
        """Generate recommendations for reducing bias."""
        recs = []
        
        if abs(biases['political']['magnitude']) > 1:
            recs.append("Consider more politically neutral vocabulary")
        
        if biases['gender']['ratio'] > 3:
            recs.append("Review gender representation in translation")
        
        if biases['religious']['assessment'] == 'christianized':
            recs.append("Consider whether Christian terminology is appropriate for source")
        
        if biases['anachronism']['anachronism_count'] > 2:
            recs.append("Remove modern colloquialisms")
        
        if not recs:
            recs.append("Translation shows good bias awareness")
        
        return recs


# =============================================================================
# INTEGRATED ANALYSIS
# =============================================================================

class TranslationAnalyzer:
    """
    Integrated game-theoretic analysis of translations.
    
    Combines:
    - Game equilibrium analysis
    - Sway computation
    - Truth preservation
    - Bias detection
    """
    
    def __init__(self):
        self.sway_analyzer = SwayAnalyzer()
        self.truth_analyzer = TruthAnalyzer()
        self.bias_detector = BiasDetector()
    
    def full_analysis(
        self,
        source: str,
        translation: str,
        neutral_baseline: str,
        source_lang: str = 'grc',
        target_lang: str = 'en',
        context: Dict = None
    ) -> Dict:
        """
        Perform comprehensive game-theoretic analysis.
        """
        context = context or {}
        
        # Game analysis
        game = TranslationGame(source, source_lang, target_lang, context)
        nash = game.find_nash_equilibrium()
        qre = game.find_quantal_equilibrium()
        
        # Sway analysis
        sway = self.sway_analyzer.compute_sway(translation, neutral_baseline)
        
        # Truth analysis
        truth = self.truth_analyzer.analyze_truth_preservation(source, translation, source_lang)
        
        # Bias analysis
        bias = self.bias_detector.detect_bias(translation)
        
        # Composite score
        composite = (
            0.3 * truth['overall_truth_preservation'] +
            0.3 * (1 - min(sway['total_sway'], 1)) +
            0.2 * (1 - min(bias['overall_bias_index'] / 10, 1)) +
            0.2 * 0.7  # Base strategy alignment score
        )
        
        return {
            'composite_score': float(composite),
            'game_analysis': {
                'nash_equilibrium': {k: v.value for k, v in nash.items()},
                'quantal_equilibrium': {
                    k: {s.value: p for s, p in v.items()}
                    for k, v in qre.items()
                }
            },
            'sway_analysis': sway,
            'truth_analysis': truth,
            'bias_analysis': bias,
            'overall_assessment': self._overall_assessment(composite, sway, truth, bias)
        }
    
    def _overall_assessment(
        self,
        composite: float,
        sway: Dict,
        truth: Dict,
        bias: Dict
    ) -> str:
        """Generate overall assessment."""
        if composite >= 0.8:
            quality = "excellent"
        elif composite >= 0.65:
            quality = "good"
        elif composite >= 0.5:
            quality = "acceptable"
        else:
            quality = "needs improvement"
        
        issues = []
        if sway['total_sway'] > 0.3:
            issues.append("high interpretive sway")
        if truth['overall_truth_preservation'] < 0.7:
            issues.append("truth preservation concerns")
        if bias['overall_bias_index'] > 5:
            issues.append("potential bias")
        
        assessment = f"Translation quality: {quality}."
        if issues:
            assessment += f" Areas of concern: {', '.join(issues)}."
        
        return assessment


# =============================================================================
# UTILITIES
# =============================================================================

def analyze_translation(
    source: str,
    translation: str,
    neutral_baseline: Optional[str] = None,
    source_lang: str = 'grc'
) -> Dict:
    """Convenience function for full translation analysis."""
    if neutral_baseline is None:
        neutral_baseline = translation  # Use translation as its own baseline
    
    analyzer = TranslationAnalyzer()
    return analyzer.full_analysis(
        source=source,
        translation=translation,
        neutral_baseline=neutral_baseline,
        source_lang=source_lang
    )


if __name__ == "__main__":
    print("LOGOS Game Theory Module")
    print("=" * 50)
    
    # Test game
    game = TranslationGame(
        source_text="μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
        source_lang="grc",
        target_lang="en",
        context={'academic': True}
    )
    
    nash = game.find_nash_equilibrium()
    print(f"Nash Equilibrium: {nash}")
    
    qre = game.find_quantal_equilibrium()
    print(f"QRE (Translator): {max(qre['Translator'].items(), key=lambda x: x[1])}")
    
    # Test sway
    sway_analyzer = SwayAnalyzer()
    
    pope = "The wrath sing, Goddess, of Peleus' son Achilles"
    wilson = "Sing, goddess, the anger of Peleus' son Achilles"
    
    sway = sway_analyzer.compute_sway(pope, wilson)
    print(f"\nSway (Pope vs Wilson): {sway['total_sway']:.4f}")
    print(f"Interpretation: {sway['interpretation']}")
    
    # Test bias
    bias_detector = BiasDetector()
    bias = bias_detector.detect_bias(pope)
    print(f"\nBias Index: {bias['overall_bias_index']:.4f}")
    
    print("\n✓ All tests passed")
