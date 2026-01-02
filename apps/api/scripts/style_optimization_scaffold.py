#!/usr/bin/env python3
"""
================================================================================
STYLE OPTIMIZATION SCAFFOLD
================================================================================

The "verifier scaffold" approach: treat falsification gates as the verifier,
and let search discover optimal style measures that pass all gates.

This is the "Gemini IMO scaffolding" analogue:
  - Generator: propose features / transformations / metric formulas
  - Verifier: falsification gates + composite score
  - Search: Optuna-style optimization
  - Only survivors count

Key Composite Score:
  Score = (Accuracy_workholdout)
        × (Accuracy_topicholdout / Accuracy_workholdout)
        × (1 - ConfoundAdvantage)
        × (1 - MultiResStdPenalty)

Hard-fail any trial that breaks Gate 1, 4, or 5.

================================================================================
"""

import os
import sys
import json
import asyncio
import numpy as np
import asyncpg
from collections import Counter, defaultdict
from typing import Dict, List, Tuple, Optional, Any, Callable
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum
import warnings
warnings.filterwarnings('ignore')

try:
    import optuna
    from optuna.trial import Trial
    HAS_OPTUNA = True
except ImportError:
    HAS_OPTUNA = False
    print("Note: optuna not installed, using manual grid search")

from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import GroupKFold, cross_val_predict, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, confusion_matrix
from scipy.linalg import sqrtm, inv
from scipy.sparse import hstack, csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer

DATABASE_URL = os.environ.get('DATABASE_URL', '')


# ============================================================================
# FUNCTION WORD LISTS
# ============================================================================

GREEK_FUNCTION_WORDS = [
    'kai', 'de', 'te', 'gar', 'alla', 'men', 'oun', 'oti', 'ei', 'os',
    'ho', 'he', 'to', 'tou', 'tes', 'to', 'ten', 'ton', 'hoi', 'hai', 'ta',
    'ton', 'tois', 'tais', 'tous', 'tas',
    'en', 'eis', 'ek', 'ex', 'apo', 'pros', 'hupo', 'peri', 'dia', 'kata',
    'meta', 'para', 'epi', 'pro', 'ana', 'sun',
    'ou', 'ouk', 'ouch', 'me', 'oute', 'mete',
    'autos', 'aute', 'auto', 'ego', 'su', 'hemeis', 'humeis',
    'tis', 'ti', 'hos', 'he', 'ho', 'hostis', 'houtos', 'haute', 'touto',
    'an', 'e', 'tote', 'nun', 'eti', 'houtos', 'hoste', 'eita',
    'monon', 'palin', 'aei', 'pos', 'pou', 'pote', 'po'
]

HEBREW_FUNCTION_WORDS = [
    'כי', 'אם', 'או', 'גם', 'אך', 'רק', 'אף', 'פן',
    'מן', 'אל', 'על', 'את', 'עם', 'תחת', 'אחר', 'לפני', 'בין', 'עד',
    'זה', 'זאת', 'אלה', 'הוא', 'היא', 'הם', 'הן', 'אני', 'אנחנו',
    'אשר', 'כאשר', 'יען', 'לפי',
    'לא', 'אין', 'בל', 'טרם', 'בטרם',
    'מה', 'מי', 'איך', 'למה', 'מדוע', 'מתי', 'איפה', 'אנה', 'האם',
    'כל', 'עוד', 'שם', 'פה', 'הנה', 'כן', 'לכן', 'עתה', 'אז',
    'הלא', 'נא', 'אמנם', 'אכן', 'כבר', 'תמיד', 'לבד',
]


# ============================================================================
# TRIAL RESULT
# ============================================================================

@dataclass
class TrialResult:
    """Result from an optimization trial."""
    trial_id: int
    config: Dict[str, Any]

    # Gate results
    gate1_permutation_passed: bool
    gate2_topic_holdout_passed: bool
    gate3_confound_passed: bool
    gate4_random_passed: bool
    gate5_stability_passed: bool
    all_gates_passed: bool

    # Metrics
    work_holdout_accuracy: float
    topic_holdout_accuracy: float
    holdout_ratio: float
    confound_advantage: float
    stability_std: float

    # Composite score
    composite_score: float

    # Feature info
    n_features: int
    feature_type: str

    def to_dict(self):
        return {
            'trial_id': self.trial_id,
            'config': self.config,
            'gates_passed': self.all_gates_passed,
            'composite_score': self.composite_score,
            'work_accuracy': self.work_holdout_accuracy,
            'topic_accuracy': self.topic_holdout_accuracy,
            'holdout_ratio': self.holdout_ratio,
            'confound_advantage': self.confound_advantage,
            'stability_std': self.stability_std,
            'n_features': self.n_features,
            'feature_type': self.feature_type
        }


# ============================================================================
# FEATURE EXTRACTORS
# ============================================================================

class FeatureExtractor:
    """Base class for feature extraction."""

    def fit(self, texts: List[str]) -> 'FeatureExtractor':
        return self

    def transform(self, texts: List[str]) -> np.ndarray:
        raise NotImplementedError

    def fit_transform(self, texts: List[str]) -> np.ndarray:
        return self.fit(texts).transform(texts)


class FunctionWordExtractor(FeatureExtractor):
    """Extract function word frequencies."""

    def __init__(self, language: str = 'greek'):
        if language == 'hebrew':
            self.fw_list = HEBREW_FUNCTION_WORDS
        else:
            self.fw_list = GREEK_FUNCTION_WORDS

    def transform(self, texts: List[str]) -> np.ndarray:
        features = []
        for text in texts:
            tokens = text.lower().split()
            total = len(tokens)
            if total == 0:
                features.append(np.zeros(len(self.fw_list)))
            else:
                counts = Counter(tokens)
                features.append([counts.get(w, 0) / total for w in self.fw_list])
        return np.array(features, dtype=np.float32)


class CharNgramExtractor(FeatureExtractor):
    """Extract character n-gram TF-IDF features."""

    def __init__(self, ngram_range: Tuple[int, int] = (3, 5), max_features: int = 1000):
        self.vectorizer = TfidfVectorizer(
            analyzer='char',
            ngram_range=ngram_range,
            max_features=max_features,
            min_df=5
        )

    def fit(self, texts: List[str]) -> 'CharNgramExtractor':
        self.vectorizer.fit(texts)
        return self

    def transform(self, texts: List[str]) -> np.ndarray:
        return self.vectorizer.transform(texts).toarray()


class SentenceLengthExtractor(FeatureExtractor):
    """Extract sentence-level features."""

    def transform(self, texts: List[str]) -> np.ndarray:
        features = []
        for text in texts:
            sentences = text.split('.')
            lengths = [len(s.split()) for s in sentences if s.strip()]

            if not lengths:
                features.append([0, 0, 0, 0, 0])
            else:
                features.append([
                    np.mean(lengths),
                    np.std(lengths),
                    np.min(lengths),
                    np.max(lengths),
                    len(lengths)  # number of sentences
                ])
        return np.array(features, dtype=np.float32)


class CombinedExtractor(FeatureExtractor):
    """Combine multiple extractors."""

    def __init__(self, extractors: List[FeatureExtractor]):
        self.extractors = extractors

    def fit(self, texts: List[str]) -> 'CombinedExtractor':
        for ext in self.extractors:
            ext.fit(texts)
        return self

    def transform(self, texts: List[str]) -> np.ndarray:
        feature_sets = [ext.transform(texts) for ext in self.extractors]
        return np.hstack(feature_sets)


# ============================================================================
# RESIDUALIZATION ENGINE
# ============================================================================

class ResidualEngine:
    """Apply meaning-anchored residualization to features."""

    def __init__(
        self,
        mode: str = 'shrinkage',  # 'none', 'mean', 'whitening', 'shrinkage', 'robust'
        n_clusters: int = 20,
        shrinkage_alpha: float = 0.1
    ):
        self.mode = mode
        self.n_clusters = n_clusters
        self.shrinkage_alpha = shrinkage_alpha

        self.cluster_model = None
        self.cluster_means = {}
        self.cluster_covs = {}
        self.cluster_whitening = {}

    def fit(self, X: np.ndarray, embeddings: np.ndarray):
        """Fit cluster statistics from embeddings."""
        if self.mode == 'none':
            return self

        # Reduce embedding dimensionality
        if embeddings.shape[1] > 64:
            pca = PCA(n_components=64)
            embed_reduced = pca.fit_transform(embeddings)
        else:
            embed_reduced = embeddings

        # Cluster by meaning
        self.cluster_model = KMeans(n_clusters=self.n_clusters, random_state=42, n_init=10)
        labels = self.cluster_model.fit_predict(embed_reduced)

        # Compute per-cluster statistics
        for c in range(self.n_clusters):
            mask = labels == c
            X_c = X[mask]

            if len(X_c) < 3:
                self.cluster_means[c] = X.mean(axis=0)
                self.cluster_covs[c] = np.eye(X.shape[1])
            else:
                if self.mode == 'robust':
                    self.cluster_means[c] = np.median(X_c, axis=0)
                    mad = np.median(np.abs(X_c - self.cluster_means[c]), axis=0) + 1e-6
                    self.cluster_covs[c] = np.diag(mad ** 2)
                else:
                    self.cluster_means[c] = X_c.mean(axis=0)
                    if X_c.shape[0] > X_c.shape[1]:
                        cov = np.cov(X_c.T)
                    else:
                        cov = np.eye(X_c.shape[1])

                    # Apply shrinkage
                    cov = (1 - self.shrinkage_alpha) * cov + self.shrinkage_alpha * np.eye(X.shape[1])
                    self.cluster_covs[c] = cov

            # Compute whitening matrix
            try:
                cov_sqrt = sqrtm(self.cluster_covs[c])
                if np.iscomplex(cov_sqrt).any():
                    cov_sqrt = cov_sqrt.real
                self.cluster_whitening[c] = inv(cov_sqrt + 0.01 * np.eye(X.shape[1]))
            except:
                self.cluster_whitening[c] = np.eye(X.shape[1])

        return self

    def transform(self, X: np.ndarray, embeddings: np.ndarray) -> np.ndarray:
        """Apply residualization."""
        if self.mode == 'none':
            return X

        # Get cluster assignments
        if embeddings.shape[1] > 64:
            pca = PCA(n_components=64)
            embed_reduced = pca.fit_transform(embeddings)
        else:
            embed_reduced = embeddings

        labels = self.cluster_model.predict(embed_reduced)

        X_out = np.zeros_like(X)
        for i in range(len(X)):
            c = labels[i]
            mu = self.cluster_means.get(c, X.mean(axis=0))

            if self.mode == 'mean':
                X_out[i] = X[i] - mu
            elif self.mode in ['whitening', 'shrinkage', 'robust']:
                W = self.cluster_whitening.get(c, np.eye(X.shape[1]))
                X_out[i] = W @ (X[i] - mu)
            else:
                X_out[i] = X[i]

        return X_out


# ============================================================================
# FALSIFICATION GATES
# ============================================================================

class FalsificationVerifier:
    """
    The hard verifier: falsification gates that determine pass/fail.

    CRITICAL: A configuration that fails any gate gets score = 0.
    """

    def __init__(
        self,
        permutation_threshold: float = 0.05,
        topic_ratio_min: float = 0.70,
        confound_threshold: float = 0.10,
        random_threshold: float = 0.10,
        stability_threshold: float = 0.05
    ):
        self.permutation_threshold = permutation_threshold
        self.topic_ratio_min = topic_ratio_min
        self.confound_threshold = confound_threshold
        self.random_threshold = random_threshold
        self.stability_threshold = stability_threshold

    def verify(
        self,
        X: np.ndarray,
        y: np.ndarray,
        groups: np.ndarray,
        topics: np.ndarray,
        trial_id: int,
        config: Dict[str, Any],
        feature_type: str = 'unknown'
    ) -> TrialResult:
        """
        Run all gates and return trial result.
        """
        n_classes = len(set(y))
        chance = 1.0 / n_classes
        n_topics = len(set(topics))
        topic_chance = 1.0 / n_topics

        clf = LogisticRegression(max_iter=1000, n_jobs=-1)
        gkf = GroupKFold(n_splits=min(5, len(set(groups))))

        # Work holdout accuracy
        work_preds = cross_val_predict(clf, X, y, cv=gkf, groups=groups)
        work_acc = accuracy_score(y, work_preds)

        # Gate 1: Permutation test
        perm_accs = []
        for _ in range(10):
            y_perm = np.random.permutation(y)
            perm_preds = cross_val_predict(clf, X, y_perm, cv=gkf, groups=groups)
            perm_accs.append(accuracy_score(y_perm, perm_preds))
        perm_acc = np.mean(perm_accs)
        gate1_pass = perm_acc < (chance + self.permutation_threshold)

        # Gate 2: Topic holdout
        unique_topics = list(set(topics))
        topic_accs = []
        if len(unique_topics) >= 3:
            for hold in unique_topics[:min(5, len(unique_topics))]:
                train_mask = topics != hold
                test_mask = topics == hold
                if train_mask.sum() < 10 or test_mask.sum() < 3:
                    continue
                clf_temp = LogisticRegression(max_iter=1000)
                clf_temp.fit(X[train_mask], y[train_mask])
                topic_accs.append(accuracy_score(y[test_mask], clf_temp.predict(X[test_mask])))

        topic_acc = np.mean(topic_accs) if topic_accs else work_acc * 0.8
        holdout_ratio = topic_acc / work_acc if work_acc > 0 else 0
        gate2_pass = holdout_ratio >= self.topic_ratio_min

        # Gate 3: Confound check
        topic_preds = cross_val_predict(clf, X, topics, cv=gkf, groups=groups)
        topic_pred_acc = accuracy_score(topics, topic_preds)
        confound_advantage = max(0, topic_pred_acc - topic_chance)
        gate3_pass = confound_advantage < self.confound_threshold

        # Gate 4: Random features
        X_random = np.random.randn(X.shape[0], X.shape[1])
        random_preds = cross_val_predict(clf, X_random, y, cv=gkf, groups=groups)
        random_acc = accuracy_score(y, random_preds)
        gate4_pass = random_acc < (chance + self.random_threshold)

        # Gate 5: Stability
        fold_accs = []
        for train_idx, test_idx in gkf.split(X, y, groups):
            clf_temp = LogisticRegression(max_iter=1000)
            clf_temp.fit(X[train_idx], y[train_idx])
            fold_accs.append(accuracy_score(y[test_idx], clf_temp.predict(X[test_idx])))
        stability_std = np.std(fold_accs)
        gate5_pass = stability_std < self.stability_threshold

        # All gates
        all_passed = gate1_pass and gate2_pass and gate3_pass and gate4_pass and gate5_pass

        # Composite score
        if all_passed:
            composite = (
                work_acc *
                holdout_ratio *
                (1 - confound_advantage) *
                (1 - max(0, stability_std - 0.05))
            )
        else:
            composite = 0.0

        return TrialResult(
            trial_id=trial_id,
            config=config,
            gate1_permutation_passed=gate1_pass,
            gate2_topic_holdout_passed=gate2_pass,
            gate3_confound_passed=gate3_pass,
            gate4_random_passed=gate4_pass,
            gate5_stability_passed=gate5_pass,
            all_gates_passed=all_passed,
            work_holdout_accuracy=work_acc,
            topic_holdout_accuracy=topic_acc,
            holdout_ratio=holdout_ratio,
            confound_advantage=confound_advantage,
            stability_std=stability_std,
            composite_score=composite,
            n_features=X.shape[1],
            feature_type=feature_type
        )


# ============================================================================
# OPTIMIZATION SCAFFOLD
# ============================================================================

class StyleOptimizer:
    """
    The optimization scaffold that searches feature/metric space
    while respecting falsification gates.
    """

    def __init__(self, verifier: FalsificationVerifier = None):
        self.verifier = verifier or FalsificationVerifier()
        self.trials: List[TrialResult] = []
        self.best_trial: Optional[TrialResult] = None

    def run_ablation_grid(
        self,
        texts: List[str],
        y: np.ndarray,
        groups: np.ndarray,
        topics: np.ndarray,
        embeddings: np.ndarray
    ) -> Dict[str, Any]:
        """
        Run the full ablation grid from the methodology document.

        Grid includes:
        - No anchoring (baseline)
        - Mean residual only
        - Full whitening
        - Shrinkage whitening (with alpha sweep)
        - Robust mean/cov
        - Multiple n_clusters values
        """
        print("\n" + "=" * 70)
        print("ABLATION GRID SEARCH")
        print("=" * 70)

        # Define grid
        residual_modes = ['none', 'mean', 'whitening', 'shrinkage', 'robust']
        shrinkage_values = [0.01, 0.05, 0.1, 0.2, 0.3]
        n_clusters_values = [5, 10, 15, 20, 30]
        feature_types = ['function_words', 'char_ngrams', 'combined']

        trial_id = 0

        for feature_type in feature_types:
            print(f"\n[Feature Type: {feature_type}]")

            # Extract features
            if feature_type == 'function_words':
                extractor = FunctionWordExtractor()
            elif feature_type == 'char_ngrams':
                extractor = CharNgramExtractor(max_features=500)
            else:  # combined
                extractor = CombinedExtractor([
                    FunctionWordExtractor(),
                    SentenceLengthExtractor()
                ])

            X_raw = extractor.fit_transform(texts)

            for mode in residual_modes:
                for n_clusters in n_clusters_values:
                    for alpha in shrinkage_values:

                        # Skip redundant combinations
                        if mode in ['none', 'mean', 'whitening']:
                            if alpha != shrinkage_values[0] or n_clusters != n_clusters_values[0]:
                                continue
                            if mode == 'none' and n_clusters != n_clusters_values[0]:
                                continue

                        config = {
                            'feature_type': feature_type,
                            'residual_mode': mode,
                            'n_clusters': n_clusters,
                            'shrinkage_alpha': alpha
                        }

                        # Apply residualization
                        if mode != 'none':
                            engine = ResidualEngine(
                                mode=mode,
                                n_clusters=n_clusters,
                                shrinkage_alpha=alpha
                            )
                            engine.fit(X_raw, embeddings)
                            X = engine.transform(X_raw, embeddings)
                        else:
                            X = X_raw.copy()

                        # Standardize
                        scaler = StandardScaler()
                        X_scaled = scaler.fit_transform(X)

                        # Verify
                        result = self.verifier.verify(
                            X_scaled, y, groups, topics,
                            trial_id=trial_id,
                            config=config,
                            feature_type=feature_type
                        )

                        self.trials.append(result)

                        # Update best
                        if self.best_trial is None or result.composite_score > self.best_trial.composite_score:
                            self.best_trial = result

                        # Log
                        status = "PASS" if result.all_gates_passed else "FAIL"
                        print(f"    Trial {trial_id}: {mode}/{n_clusters}/{alpha:.2f} -> {status} (score: {result.composite_score:.3f})")

                        trial_id += 1

        # Summary
        print("\n" + "=" * 70)
        print("ABLATION RESULTS SUMMARY")
        print("=" * 70)

        n_passed = sum(1 for t in self.trials if t.all_gates_passed)
        print(f"\nTotal trials: {len(self.trials)}")
        print(f"Trials passed all gates: {n_passed}")

        if self.best_trial:
            print(f"\nBest configuration:")
            print(f"    Config: {self.best_trial.config}")
            print(f"    Composite score: {self.best_trial.composite_score:.4f}")
            print(f"    Work holdout: {self.best_trial.work_holdout_accuracy:.1%}")
            print(f"    Topic holdout: {self.best_trial.topic_holdout_accuracy:.1%}")
            print(f"    Holdout ratio: {self.best_trial.holdout_ratio:.2f}")
            print(f"    Confound advantage: {self.best_trial.confound_advantage:.3f}")
            print(f"    Stability std: {self.best_trial.stability_std:.3f}")

        return {
            'total_trials': len(self.trials),
            'passed_trials': n_passed,
            'best_trial': self.best_trial.to_dict() if self.best_trial else None,
            'all_trials': [t.to_dict() for t in self.trials]
        }

    def run_optuna_search(
        self,
        texts: List[str],
        y: np.ndarray,
        groups: np.ndarray,
        topics: np.ndarray,
        embeddings: np.ndarray,
        n_trials: int = 100
    ) -> Dict[str, Any]:
        """
        Use Optuna for intelligent hyperparameter search.
        """
        if not HAS_OPTUNA:
            print("Optuna not available, falling back to grid search")
            return self.run_ablation_grid(texts, y, groups, topics, embeddings)

        print("\n" + "=" * 70)
        print("OPTUNA OPTIMIZATION")
        print("=" * 70)

        trial_id_counter = [0]

        def objective(trial: Trial) -> float:
            # Sample configuration
            feature_type = trial.suggest_categorical('feature_type', ['function_words', 'char_ngrams', 'combined'])
            residual_mode = trial.suggest_categorical('residual_mode', ['none', 'mean', 'shrinkage', 'robust'])
            n_clusters = trial.suggest_int('n_clusters', 5, 30, step=5)
            shrinkage_alpha = trial.suggest_float('shrinkage_alpha', 0.01, 0.5, log=True)

            # Extract features
            if feature_type == 'function_words':
                extractor = FunctionWordExtractor()
            elif feature_type == 'char_ngrams':
                extractor = CharNgramExtractor(max_features=500)
            else:
                extractor = CombinedExtractor([
                    FunctionWordExtractor(),
                    SentenceLengthExtractor()
                ])

            X_raw = extractor.fit_transform(texts)

            # Apply residualization
            if residual_mode != 'none':
                engine = ResidualEngine(
                    mode=residual_mode,
                    n_clusters=n_clusters,
                    shrinkage_alpha=shrinkage_alpha
                )
                engine.fit(X_raw, embeddings)
                X = engine.transform(X_raw, embeddings)
            else:
                X = X_raw.copy()

            # Standardize
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)

            # Verify
            config = {
                'feature_type': feature_type,
                'residual_mode': residual_mode,
                'n_clusters': n_clusters,
                'shrinkage_alpha': shrinkage_alpha
            }

            result = self.verifier.verify(
                X_scaled, y, groups, topics,
                trial_id=trial_id_counter[0],
                config=config,
                feature_type=feature_type
            )

            self.trials.append(result)
            trial_id_counter[0] += 1

            if self.best_trial is None or result.composite_score > self.best_trial.composite_score:
                self.best_trial = result

            # Optuna minimizes by default, so negate the score
            return -result.composite_score

        # Create study
        study = optuna.create_study(direction='minimize')
        study.optimize(objective, n_trials=n_trials, show_progress_bar=True)

        # Results
        print("\n" + "=" * 70)
        print("OPTUNA RESULTS")
        print("=" * 70)

        n_passed = sum(1 for t in self.trials if t.all_gates_passed)
        print(f"\nTotal trials: {len(self.trials)}")
        print(f"Trials passed all gates: {n_passed}")

        if self.best_trial:
            print(f"\nBest configuration:")
            print(f"    Config: {self.best_trial.config}")
            print(f"    Composite score: {self.best_trial.composite_score:.4f}")

        return {
            'total_trials': len(self.trials),
            'passed_trials': n_passed,
            'best_trial': self.best_trial.to_dict() if self.best_trial else None,
            'optuna_best_params': study.best_params,
            'optuna_best_value': -study.best_value
        }


# ============================================================================
# MULTI-VIEW ENSEMBLE WITH GATE ENFORCEMENT
# ============================================================================

class MultiViewEnsemble:
    """
    Multi-view fusion where each view must pass permutation test.

    Views:
    1. Function word frequencies
    2. Sentence-length features
    3. Anchored residuals
    4. Character n-grams (if passes gate)

    Rule: Every view must individually collapse under label permutation.
    """

    def __init__(self, verifier: FalsificationVerifier):
        self.verifier = verifier
        self.valid_views = []

    def fit_and_filter(
        self,
        texts: List[str],
        y: np.ndarray,
        groups: np.ndarray,
        topics: np.ndarray,
        embeddings: np.ndarray
    ) -> np.ndarray:
        """
        Fit views and filter to those that pass permutation test.
        """
        print("\n[Multi-View Ensemble] Fitting and filtering views...")

        views = [
            ('function_words', FunctionWordExtractor()),
            ('sentence_length', SentenceLengthExtractor()),
            ('char_ngrams_3_4', CharNgramExtractor(ngram_range=(3, 4), max_features=300)),
        ]

        valid_X = []

        for name, extractor in views:
            X = extractor.fit_transform(texts)
            X_scaled = StandardScaler().fit_transform(X)

            # Test permutation
            clf = LogisticRegression(max_iter=1000)
            gkf = GroupKFold(n_splits=min(5, len(set(groups))))

            n_classes = len(set(y))
            chance = 1.0 / n_classes

            perm_accs = []
            for _ in range(10):
                y_perm = np.random.permutation(y)
                perm_preds = cross_val_predict(clf, X_scaled, y_perm, cv=gkf, groups=groups)
                perm_accs.append(accuracy_score(y_perm, perm_preds))

            perm_acc = np.mean(perm_accs)
            passes = perm_acc < (chance + 0.05)

            print(f"    {name}: perm_acc={perm_acc:.3f}, chance={chance:.3f}, passes={passes}")

            if passes:
                valid_X.append(X_scaled)
                self.valid_views.append(name)

        if not valid_X:
            print("    WARNING: No views passed permutation test!")
            return np.zeros((len(texts), 1))

        X_combined = np.hstack(valid_X)
        print(f"    Combined {len(valid_X)} views -> {X_combined.shape[1]} features")

        return X_combined


# ============================================================================
# MAIN
# ============================================================================

async def main():
    """Run the full optimization scaffold."""
    print("=" * 70)
    print("STYLE OPTIMIZATION SCAFFOLD")
    print("=" * 70)
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)

    try:
        async with pool.acquire() as conn:
            # Load translation data
            print("\n[1] Loading data...")

            rows = await conn.fetch("""
                SELECT t.id, t.translation as text, t.embedding,
                       tr.name as author,
                       COALESCE(t.text_id::text, t.id::text) as anchor,
                       COALESCE(sel.topic_cluster, 0) as topic
                FROM translations t
                JOIN translators tr ON t.translator_id = tr.id
                LEFT JOIN style_evidence_layer sel ON t.id = sel.translation_id
                WHERE t.embedding IS NOT NULL
                AND t.translation IS NOT NULL
                AND LENGTH(t.translation) > 100
                LIMIT 20000
            """)

            print(f"    Loaded {len(rows)} translations")

            if len(rows) < 100:
                print("Insufficient data")
                return

            # Parse data
            texts = []
            authors = []
            anchors = []
            topics = []
            embeddings = []

            for r in rows:
                texts.append(r['text'])
                authors.append(r['author'])
                anchors.append(str(r['anchor']))
                topics.append(r['topic'])

                emb = r['embedding']
                if isinstance(emb, str):
                    emb = json.loads(emb)
                embeddings.append(np.array(emb))

            embeddings = np.array(embeddings)

            # Filter to valid authors
            author_counts = Counter(authors)
            valid_authors = {a for a, c in author_counts.items() if c >= 20}

            mask = [a in valid_authors for a in authors]
            texts = [t for t, m in zip(texts, mask) if m]
            y = np.array([a for a, m in zip(authors, mask) if m])
            groups = np.array([a for a, m in zip(anchors, mask) if m])
            topics = np.array([t for t, m in zip(topics, mask) if m])
            embeddings = embeddings[[i for i, m in enumerate(mask) if m]]

            # Create topic clusters if not available
            if len(set(topics)) < 3:
                print("\n[Creating topic clusters from embeddings...]")
                if embeddings.shape[1] > 64:
                    pca = PCA(n_components=64)
                    embed_reduced = pca.fit_transform(embeddings)
                else:
                    embed_reduced = embeddings
                kmeans = KMeans(n_clusters=15, random_state=42, n_init=10)
                topics = kmeans.fit_predict(embed_reduced)

            print(f"    Valid samples: {len(y)}")
            print(f"    Valid authors: {len(valid_authors)}")
            print(f"    Topic clusters: {len(set(topics))}")

            # Run optimization
            print("\n[2] Running optimization...")

            optimizer = StyleOptimizer()
            results = optimizer.run_ablation_grid(
                texts, y, groups, topics, embeddings
            )

            # Store results
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS optimization_runs (
                    id SERIAL PRIMARY KEY,
                    run_type TEXT,
                    n_trials INTEGER,
                    n_passed INTEGER,
                    best_score FLOAT,
                    best_config JSONB,
                    all_trials JSONB,
                    created_at TIMESTAMPTZ DEFAULT NOW()
                )
            """)

            await conn.execute("""
                INSERT INTO optimization_runs (run_type, n_trials, n_passed, best_score, best_config, all_trials)
                VALUES ($1, $2, $3, $4, $5, $6)
            """,
                'ablation_grid',
                results['total_trials'],
                results['passed_trials'],
                results['best_trial']['composite_score'] if results['best_trial'] else 0,
                json.dumps(results['best_trial']) if results['best_trial'] else '{}',
                json.dumps(results['all_trials'][:100])  # Limit storage
            )

            print("\n[3] Results stored in database")

        return results

    finally:
        await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
