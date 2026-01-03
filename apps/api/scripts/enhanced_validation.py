#!/usr/bin/env python3
"""
================================================================================
ENHANCED VALIDATION: 10 FALSIFICATION GATES
================================================================================

Comprehensive validation suite for Q stylometry methodology.

Original 5 Gates:
1. Label Permutation - Random labels should fail
2. Topic Holdout - Style must persist across topics
3. Confound Check - Not just length/frequency artifacts
4. Random Features - Random noise shouldn't work
5. Stability Check - Results stable across runs

Additional 5 Gates:
6. Cross-Validation Variance - Low variance across folds
7. Out-of-Domain Transfer - Works on non-synoptic texts
8. Feature Ablation Consistency - Core features matter most
9. Adversarial Robustness - Resistant to perturbation
10. Temporal Stability - Works across text periods

================================================================================
"""

import asyncio
import asyncpg
import os
import numpy as np
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score
from sklearn.preprocessing import StandardScaler
from collections import Counter
import re
import json
from datetime import datetime
from typing import Dict, List, Tuple, Optional
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ.get('DATABASE_URL', '')

# Greek function words
GREEK_FUNCTION_WORDS = [
    'ὁ', 'ἡ', 'τό', 'τοῦ', 'τῆς', 'τῷ', 'τῇ', 'τόν', 'τήν',
    'οἱ', 'αἱ', 'τά', 'τῶν', 'τοῖς', 'ταῖς', 'τούς', 'τάς',
    'ἐν', 'εἰς', 'ἐκ', 'ἐξ', 'ἀπό', 'πρός', 'διά', 'κατά', 'μετά', 'περί',
    'καί', 'δέ', 'γάρ', 'ἀλλά', 'ἤ', 'εἰ', 'ἐάν', 'ὅτι', 'ὡς', 'ἵνα',
    'μή', 'οὐ', 'οὐκ', 'οὐχ',
    'ἐγώ', 'σύ', 'αὐτός', 'αὐτή', 'αὐτό', 'ἡμεῖς', 'ὑμεῖς',
    'οὗτος', 'ἐκεῖνος', 'ὅς', 'τίς',
    'μέν', 'οὖν', 'νῦν', 'τότε', 'πάλιν', 'εὐθύς', 'εὐθέως',
]


def normalize_greek(word: str) -> str:
    return re.sub(r'[^\u0370-\u03FF\u1F00-\u1FFF]', '', word.lower())


def tokenize_greek(text: str) -> List[str]:
    return re.findall(r'[\u0370-\u03FF\u1F00-\u1FFF]+', text)


GREEK_FUNCTION_SET = set(normalize_greek(w) for w in GREEK_FUNCTION_WORDS)


def extract_features(text: str, n_features: int = 60) -> np.ndarray:
    """Extract style features from Greek text."""
    if not text:
        return np.zeros(n_features)

    func_words = [normalize_greek(w) for w in GREEK_FUNCTION_WORDS[:50]]
    words = [normalize_greek(w) for w in tokenize_greek(text)]
    total = len(words) if words else 1
    counts = Counter(words)

    features = []

    # Function word frequencies (50 features)
    for fw in func_words:
        features.append(counts.get(fw, 0) / total * 1000)

    # Word length statistics (5 features)
    if words:
        lengths = [len(w) for w in tokenize_greek(text)]
        features.append(np.mean(lengths) if lengths else 0)
        features.append(np.std(lengths) if lengths else 0)
        features.append(np.median(lengths) if lengths else 0)
        features.append(max(lengths) if lengths else 0)
        features.append(min(lengths) if lengths else 0)
    else:
        features.extend([0, 0, 0, 0, 0])

    # Lexical features (5 features)
    fw_count = sum(1 for w in words if w in GREEK_FUNCTION_SET)
    features.append(fw_count / total * 100)  # Function word ratio
    features.append(len(set(words)) / total if total > 0 else 0)  # Vocab richness
    features.append(counts.get('καί', 0) / total * 1000)  # kai frequency
    features.append(counts.get('δέ', 0) / total * 1000)  # de frequency
    features.append(total)  # Word count

    return np.array(features[:n_features])


class ValidationSuite:
    """Comprehensive 10-gate validation suite."""

    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool
        self.X = None
        self.y = None
        self.gospels = None
        self.results = {}

    async def load_data(self):
        """Load labeled synoptic data for validation."""
        async with self.pool.acquire() as conn:
            # Get double-tradition (Q) passages
            q_rows = await conn.fetch("""
                SELECT sa.matthew_text, sa.luke_text
                FROM synoptic_alignments sa
                WHERE sa.tradition_type = 'double_mt_lk'
                  AND (sa.matthew_text IS NOT NULL OR sa.luke_text IS NOT NULL)
            """)

            # Get Mark passages (non-Q control)
            mk_rows = await conn.fetch("""
                SELECT content FROM source_texts
                WHERE work = 'Mark' AND content IS NOT NULL
                LIMIT 100
            """)

        X_list = []
        y_list = []
        gospels = []

        # Q passages (label=1)
        for row in q_rows:
            text = row['luke_text'] or row['matthew_text']
            if text and len(tokenize_greek(text)) >= 5:
                X_list.append(extract_features(text))
                y_list.append(1)
                gospels.append('Q')

        # Mark passages (label=0)
        for row in mk_rows:
            if row['content'] and len(tokenize_greek(row['content'])) >= 5:
                X_list.append(extract_features(row['content']))
                y_list.append(0)
                gospels.append('Mark')

        self.X = np.array(X_list)
        self.y = np.array(y_list)
        self.gospels = gospels

        print(f"Loaded {len(self.X)} samples: {sum(self.y)} Q, {len(self.y) - sum(self.y)} Mark")

    def gate_1_label_permutation(self) -> Dict:
        """Gate 1: Random label shuffling should fail."""
        print("\n  Gate 1: Label Permutation...")

        # Train with real labels
        clf = RandomForestClassifier(n_estimators=50, random_state=42)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(self.X)

        real_scores = cross_val_score(clf, X_scaled, self.y, cv=5, scoring='f1')
        real_f1 = np.mean(real_scores)

        # Train with shuffled labels
        perm_scores = []
        for _ in range(10):
            y_perm = np.random.permutation(self.y)
            scores = cross_val_score(clf, X_scaled, y_perm, cv=5, scoring='f1')
            perm_scores.append(np.mean(scores))

        perm_f1 = np.mean(perm_scores)
        passed = real_f1 > perm_f1 + 0.15  # Real should be 0.15+ better

        return {
            'gate': 'Label Permutation',
            'passed': bool(passed),
            'real_f1': float(real_f1),
            'permuted_f1': float(perm_f1),
            'margin': float(real_f1 - perm_f1)
        }

    def gate_2_topic_holdout(self) -> Dict:
        """Gate 2: Style should persist across different topics."""
        print("  Gate 2: Topic Holdout...")

        # Split by passage position (proxy for topic variation)
        n = len(self.X)
        fold_size = n // 3

        clf = RandomForestClassifier(n_estimators=50, random_state=42)
        scaler = StandardScaler()

        holdout_scores = []
        for fold in range(3):
            start = fold * fold_size
            end = start + fold_size if fold < 2 else n

            test_idx = list(range(start, end))
            train_idx = [i for i in range(n) if i not in test_idx]

            X_train = scaler.fit_transform(self.X[train_idx])
            X_test = scaler.transform(self.X[test_idx])

            clf.fit(X_train, self.y[train_idx])
            y_pred = clf.predict(X_test)
            holdout_scores.append(f1_score(self.y[test_idx], y_pred))

        avg_f1 = np.mean(holdout_scores)
        variance = np.var(holdout_scores)
        passed = avg_f1 > 0.6 and variance < 0.05

        return {
            'gate': 'Topic Holdout',
            'passed': bool(passed),
            'fold_scores': [float(s) for s in holdout_scores],
            'avg_f1': float(avg_f1),
            'variance': float(variance)
        }

    def gate_3_confound_check(self) -> Dict:
        """Gate 3: Not just length/frequency artifacts."""
        print("  Gate 3: Confound Check...")

        # Use only confound features (length, word count)
        confound_features = self.X[:, -5:]  # Last 5 features are length-related

        clf = RandomForestClassifier(n_estimators=50, random_state=42)
        scaler = StandardScaler()
        X_conf = scaler.fit_transform(confound_features)

        conf_scores = cross_val_score(clf, X_conf, self.y, cv=5, scoring='f1')
        conf_f1 = np.mean(conf_scores)

        # Full features
        X_full = scaler.fit_transform(self.X)
        full_scores = cross_val_score(clf, X_full, self.y, cv=5, scoring='f1')
        full_f1 = np.mean(full_scores)

        # Full should be significantly better than confounds alone
        passed = full_f1 > conf_f1 + 0.10

        return {
            'gate': 'Confound Check',
            'passed': bool(passed),
            'full_f1': float(full_f1),
            'confound_f1': float(conf_f1),
            'improvement': float(full_f1 - conf_f1)
        }

    def gate_4_random_features(self) -> Dict:
        """Gate 4: Random noise features shouldn't work."""
        print("  Gate 4: Random Features...")

        # Random features
        X_random = np.random.randn(len(self.X), 60)

        clf = RandomForestClassifier(n_estimators=50, random_state=42)
        scaler = StandardScaler()

        X_rand_scaled = scaler.fit_transform(X_random)
        rand_scores = cross_val_score(clf, X_rand_scaled, self.y, cv=5, scoring='f1')
        rand_f1 = np.mean(rand_scores)

        # Real features
        X_real_scaled = scaler.fit_transform(self.X)
        real_scores = cross_val_score(clf, X_real_scaled, self.y, cv=5, scoring='f1')
        real_f1 = np.mean(real_scores)

        passed = real_f1 > rand_f1 + 0.15 and rand_f1 < 0.60

        return {
            'gate': 'Random Features',
            'passed': bool(passed),
            'real_f1': float(real_f1),
            'random_f1': float(rand_f1),
            'margin': float(real_f1 - rand_f1)
        }

    def gate_5_stability(self) -> Dict:
        """Gate 5: Results stable across multiple runs."""
        print("  Gate 5: Stability Check...")

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(self.X)

        run_scores = []
        for seed in range(10):
            clf = RandomForestClassifier(n_estimators=50, random_state=seed)
            scores = cross_val_score(clf, X_scaled, self.y, cv=5, scoring='f1')
            run_scores.append(np.mean(scores))

        avg_f1 = np.mean(run_scores)
        std_f1 = np.std(run_scores)
        passed = std_f1 < 0.05 and avg_f1 > 0.6

        return {
            'gate': 'Stability Check',
            'passed': bool(passed),
            'mean_f1': float(avg_f1),
            'std_f1': float(std_f1),
            'min_f1': float(min(run_scores)),
            'max_f1': float(max(run_scores))
        }

    def gate_6_cv_variance(self) -> Dict:
        """Gate 6: Low variance across cross-validation folds."""
        print("  Gate 6: Cross-Validation Variance...")

        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(self.X)

        # 10-fold CV
        cv = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
        fold_scores = cross_val_score(clf, X_scaled, self.y, cv=cv, scoring='f1')

        avg_f1 = np.mean(fold_scores)
        std_f1 = np.std(fold_scores)
        cv_coeff = std_f1 / avg_f1 if avg_f1 > 0 else float('inf')

        passed = cv_coeff < 0.15 and avg_f1 > 0.6

        return {
            'gate': 'CV Variance',
            'passed': bool(passed),
            'mean_f1': float(avg_f1),
            'std_f1': float(std_f1),
            'cv_coefficient': float(cv_coeff),
            'fold_scores': [float(s) for s in fold_scores]
        }

    async def gate_7_out_of_domain(self) -> Dict:
        """Gate 7: Transfer to non-synoptic texts (Thomas/Didache)."""
        print("  Gate 7: Out-of-Domain Transfer...")

        # Train on synoptic data
        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(self.X)
        clf.fit(X_scaled, self.y)

        # Test on Thomas (has known Q parallels)
        async with self.pool.acquire() as conn:
            thomas_rows = await conn.fetch("""
                SELECT logion_num, greek_text, q_parallel
                FROM thomas_logia
                WHERE greek_text IS NOT NULL AND LENGTH(greek_text) > 20
            """)

        if not thomas_rows:
            return {
                'gate': 'Out-of-Domain Transfer',
                'passed': False,
                'reason': 'No Thomas data available',
                'accuracy': 0.0
            }

        thomas_features = []
        thomas_labels = []  # 1 if has Q parallel, 0 if not

        for row in thomas_rows:
            features = extract_features(row['greek_text'])
            thomas_features.append(features)
            thomas_labels.append(1 if row['q_parallel'] else 0)

        X_thomas = scaler.transform(np.array(thomas_features))
        y_thomas = np.array(thomas_labels)

        # Predict Q-style for Thomas
        predictions = clf.predict_proba(X_thomas)[:, 1]

        # Correlation: logia with Q parallels should score higher
        has_parallel = y_thomas == 1
        avg_score_with = np.mean(predictions[has_parallel]) if any(has_parallel) else 0
        avg_score_without = np.mean(predictions[~has_parallel]) if any(~has_parallel) else 0

        passed = avg_score_with > avg_score_without

        return {
            'gate': 'Out-of-Domain Transfer',
            'passed': bool(passed),
            'avg_q_score_with_parallel': float(avg_score_with),
            'avg_q_score_without_parallel': float(avg_score_without),
            'separation': float(avg_score_with - avg_score_without),
            'n_with_parallel': int(sum(has_parallel)),
            'n_without_parallel': int(sum(~has_parallel))
        }

    def gate_8_feature_ablation(self) -> Dict:
        """Gate 8: Core features matter most (function words > length)."""
        print("  Gate 8: Feature Ablation...")

        scaler = StandardScaler()
        clf = RandomForestClassifier(n_estimators=50, random_state=42)

        # Full model
        X_full = scaler.fit_transform(self.X)
        full_scores = cross_val_score(clf, X_full, self.y, cv=5, scoring='f1')
        full_f1 = np.mean(full_scores)

        # Function words only (first 50 features)
        X_func = scaler.fit_transform(self.X[:, :50])
        func_scores = cross_val_score(clf, X_func, self.y, cv=5, scoring='f1')
        func_f1 = np.mean(func_scores)

        # Length features only (features 50-55)
        X_length = scaler.fit_transform(self.X[:, 50:55])
        length_scores = cross_val_score(clf, X_length, self.y, cv=5, scoring='f1')
        length_f1 = np.mean(length_scores)

        # Function words should be more important than length
        passed = func_f1 > length_f1 + 0.05

        return {
            'gate': 'Feature Ablation',
            'passed': bool(passed),
            'full_f1': float(full_f1),
            'function_words_f1': float(func_f1),
            'length_f1': float(length_f1),
            'func_improvement_over_length': float(func_f1 - length_f1)
        }

    def gate_9_adversarial_robustness(self) -> Dict:
        """Gate 9: Resistant to small perturbations."""
        print("  Gate 9: Adversarial Robustness...")

        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(self.X)
        clf.fit(X_scaled, self.y)

        # Original predictions
        orig_proba = clf.predict_proba(X_scaled)[:, 1]

        # Perturbed predictions (add 5% noise)
        perturb_deltas = []
        for noise_level in [0.01, 0.02, 0.05, 0.1]:
            X_noisy = X_scaled + np.random.randn(*X_scaled.shape) * noise_level
            noisy_proba = clf.predict_proba(X_noisy)[:, 1]
            delta = np.mean(np.abs(orig_proba - noisy_proba))
            perturb_deltas.append(delta)

        # Predictions should be stable under small noise
        avg_delta = np.mean(perturb_deltas[:2])  # 1-2% noise
        passed = avg_delta < 0.15

        return {
            'gate': 'Adversarial Robustness',
            'passed': bool(passed),
            'noise_levels': [0.01, 0.02, 0.05, 0.1],
            'prediction_deltas': [float(d) for d in perturb_deltas],
            'avg_delta_low_noise': float(avg_delta)
        }

    def gate_10_temporal_stability(self) -> Dict:
        """Gate 10: Works across different text positions (proxy for temporal)."""
        print("  Gate 10: Temporal Stability...")

        # Split data into "early" and "late" halves
        n = len(self.X)
        mid = n // 2

        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        scaler = StandardScaler()

        # Train on first half, test on second
        X_train = scaler.fit_transform(self.X[:mid])
        X_test = scaler.transform(self.X[mid:])

        clf.fit(X_train, self.y[:mid])
        y_pred = clf.predict(X_test)
        forward_f1 = f1_score(self.y[mid:], y_pred)

        # Train on second half, test on first
        X_train = scaler.fit_transform(self.X[mid:])
        X_test = scaler.transform(self.X[:mid])

        clf.fit(X_train, self.y[mid:])
        y_pred = clf.predict(X_test)
        backward_f1 = f1_score(self.y[:mid], y_pred)

        avg_f1 = (forward_f1 + backward_f1) / 2
        passed = avg_f1 > 0.50 and abs(forward_f1 - backward_f1) < 0.25

        return {
            'gate': 'Temporal Stability',
            'passed': bool(passed),
            'forward_f1': float(forward_f1),
            'backward_f1': float(backward_f1),
            'avg_f1': float(avg_f1),
            'asymmetry': float(abs(forward_f1 - backward_f1))
        }

    async def run_all_gates(self) -> Dict:
        """Run all 10 falsification gates."""
        print("=" * 70)
        print("10-GATE FALSIFICATION SUITE")
        print("=" * 70)

        await self.load_data()

        print("\nRunning falsification gates...")

        # Gates 1-5 (original)
        self.results['gate_1'] = self.gate_1_label_permutation()
        self.results['gate_2'] = self.gate_2_topic_holdout()
        self.results['gate_3'] = self.gate_3_confound_check()
        self.results['gate_4'] = self.gate_4_random_features()
        self.results['gate_5'] = self.gate_5_stability()

        # Gates 6-10 (new)
        self.results['gate_6'] = self.gate_6_cv_variance()
        self.results['gate_7'] = await self.gate_7_out_of_domain()
        self.results['gate_8'] = self.gate_8_feature_ablation()
        self.results['gate_9'] = self.gate_9_adversarial_robustness()
        self.results['gate_10'] = self.gate_10_temporal_stability()

        # Summary
        passed = sum(1 for r in self.results.values() if r.get('passed', False))

        print("\n" + "=" * 70)
        print("FALSIFICATION RESULTS")
        print("=" * 70)

        for key, result in self.results.items():
            status = "PASS" if result.get('passed') else "FAIL"
            print(f"  {result['gate']}: [{status}]")

        print(f"\n  Total: {passed}/10 gates passed")

        return {
            'timestamp': datetime.now().isoformat(),
            'gates_passed': passed,
            'gates_total': 10,
            'pass_rate': passed / 10,
            'results': self.results
        }


async def run_bootstrap_confidence(pool: asyncpg.Pool, n_bootstrap: int = 100) -> Dict:
    """Job 3.2: Bootstrap confidence intervals."""
    print("\n" + "=" * 70)
    print("BOOTSTRAP CONFIDENCE INTERVALS")
    print("=" * 70)

    async with pool.acquire() as conn:
        # Get Q passages
        rows = await conn.fetch("""
            SELECT sa.matthew_text, sa.luke_text
            FROM synoptic_alignments sa
            WHERE sa.tradition_type = 'double_mt_lk'
              AND (sa.matthew_text IS NOT NULL OR sa.luke_text IS NOT NULL)
        """)

        # Get Mark passages
        mk_rows = await conn.fetch("""
            SELECT content FROM source_texts
            WHERE work = 'Mark' AND content IS NOT NULL
            LIMIT 100
        """)

    # Build dataset
    X_list = []
    y_list = []

    for row in rows:
        text = row['luke_text'] or row['matthew_text']
        if text and len(tokenize_greek(text)) >= 5:
            X_list.append(extract_features(text))
            y_list.append(1)

    for row in mk_rows:
        if row['content'] and len(tokenize_greek(row['content'])) >= 5:
            X_list.append(extract_features(row['content']))
            y_list.append(0)

    X = np.array(X_list)
    y = np.array(y_list)

    print(f"\nDataset: {len(X)} samples")
    print(f"Running {n_bootstrap} bootstrap iterations...")

    bootstrap_f1s = []

    for i in range(n_bootstrap):
        # Bootstrap sample
        idx = np.random.choice(len(X), size=len(X), replace=True)
        X_boot = X[idx]
        y_boot = y[idx]

        # Out-of-bag for testing
        oob_idx = list(set(range(len(X))) - set(idx))
        if len(oob_idx) < 10:
            continue

        X_test = X[oob_idx]
        y_test = y[oob_idx]

        # Train and evaluate
        scaler = StandardScaler()
        X_train = scaler.fit_transform(X_boot)
        X_test_scaled = scaler.transform(X_test)

        clf = RandomForestClassifier(n_estimators=50, random_state=i)
        clf.fit(X_train, y_boot)
        y_pred = clf.predict(X_test_scaled)

        bootstrap_f1s.append(f1_score(y_test, y_pred))

        if (i + 1) % 25 == 0:
            print(f"  Completed {i + 1}/{n_bootstrap}")

    # Calculate confidence intervals
    bootstrap_f1s = np.array(bootstrap_f1s)
    mean_f1 = np.mean(bootstrap_f1s)
    std_f1 = np.std(bootstrap_f1s)
    ci_95_low = np.percentile(bootstrap_f1s, 2.5)
    ci_95_high = np.percentile(bootstrap_f1s, 97.5)
    ci_99_low = np.percentile(bootstrap_f1s, 0.5)
    ci_99_high = np.percentile(bootstrap_f1s, 99.5)

    print(f"\nBootstrap Results:")
    print(f"  Mean F1: {mean_f1:.4f}")
    print(f"  Std F1:  {std_f1:.4f}")
    print(f"  95% CI:  [{ci_95_low:.4f}, {ci_95_high:.4f}]")
    print(f"  99% CI:  [{ci_99_low:.4f}, {ci_99_high:.4f}]")

    return {
        'n_bootstrap': n_bootstrap,
        'mean_f1': float(mean_f1),
        'std_f1': float(std_f1),
        'ci_95': [float(ci_95_low), float(ci_95_high)],
        'ci_99': [float(ci_99_low), float(ci_99_high)],
        'bootstrap_scores': [float(f) for f in bootstrap_f1s]
    }


async def run_ablation_study(pool: asyncpg.Pool) -> Dict:
    """Job 3.3: Feature group ablation study."""
    print("\n" + "=" * 70)
    print("FEATURE GROUP ABLATION STUDY")
    print("=" * 70)

    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT sa.matthew_text, sa.luke_text
            FROM synoptic_alignments sa
            WHERE sa.tradition_type = 'double_mt_lk'
              AND (sa.matthew_text IS NOT NULL OR sa.luke_text IS NOT NULL)
        """)

        mk_rows = await conn.fetch("""
            SELECT content FROM source_texts
            WHERE work = 'Mark' AND content IS NOT NULL
            LIMIT 100
        """)

    X_list = []
    y_list = []

    for row in rows:
        text = row['luke_text'] or row['matthew_text']
        if text and len(tokenize_greek(text)) >= 5:
            X_list.append(extract_features(text))
            y_list.append(1)

    for row in mk_rows:
        if row['content'] and len(tokenize_greek(row['content'])) >= 5:
            X_list.append(extract_features(row['content']))
            y_list.append(0)

    X = np.array(X_list)
    y = np.array(y_list)

    # Define feature groups
    feature_groups = {
        'articles': list(range(0, 17)),       # Greek articles
        'prepositions': list(range(17, 27)),   # Prepositions
        'conjunctions': list(range(27, 40)),   # Conjunctions/particles
        'negations': list(range(40, 44)),      # Negations
        'pronouns': list(range(44, 50)),       # Pronouns
        'word_length': list(range(50, 55)),    # Word length stats
        'lexical': list(range(55, 60))         # Lexical features
    }

    scaler = StandardScaler()
    clf = RandomForestClassifier(n_estimators=100, random_state=42)

    # Full model baseline
    X_full = scaler.fit_transform(X)
    full_scores = cross_val_score(clf, X_full, y, cv=5, scoring='f1')
    full_f1 = np.mean(full_scores)

    print(f"\nFull model F1: {full_f1:.4f}")
    print("\nAblation results (removing each group):")

    ablation_results = {}

    for group_name, indices in feature_groups.items():
        # Remove this group
        keep_indices = [i for i in range(60) if i not in indices]
        X_ablated = X[:, keep_indices]

        X_abl_scaled = scaler.fit_transform(X_ablated)
        abl_scores = cross_val_score(clf, X_abl_scaled, y, cv=5, scoring='f1')
        abl_f1 = np.mean(abl_scores)

        impact = full_f1 - abl_f1

        ablation_results[group_name] = {
            'f1_without': float(abl_f1),
            'impact': float(impact),
            'n_features': len(indices)
        }

        direction = "↓" if impact > 0 else "↑"
        print(f"  -{group_name}: F1={abl_f1:.4f} (impact: {direction}{abs(impact):.4f})")

    # Sort by impact
    sorted_groups = sorted(ablation_results.items(), key=lambda x: x[1]['impact'], reverse=True)

    print("\nFeature importance ranking:")
    for i, (group, data) in enumerate(sorted_groups, 1):
        print(f"  {i}. {group}: {data['impact']:.4f} impact")

    return {
        'full_f1': float(full_f1),
        'ablation_results': ablation_results,
        'importance_ranking': [g[0] for g in sorted_groups]
    }


async def main():
    pool = await asyncpg.create_pool(DATABASE_URL)

    try:
        # Job 3.1: 10 falsification gates
        suite = ValidationSuite(pool)
        gate_results = await suite.run_all_gates()

        # Job 3.2: Bootstrap confidence intervals
        bootstrap_results = await run_bootstrap_confidence(pool, n_bootstrap=100)

        # Job 3.3: Ablation study
        ablation_results = await run_ablation_study(pool)

        # Save all results
        output = {
            'timestamp': datetime.now().isoformat(),
            'falsification_gates': gate_results,
            'bootstrap_confidence': bootstrap_results,
            'ablation_study': ablation_results
        }

        output_path = '/Users/royvaid/Downloads/logos/papers/VALIDATION_RESULTS.json'
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2)

        print(f"\n\nAll results saved to: {output_path}")

        # Summary
        print("\n" + "=" * 70)
        print("PHASE 3 VALIDATION SUMMARY")
        print("=" * 70)
        print(f"  Falsification Gates: {gate_results['gates_passed']}/10 passed")
        print(f"  Bootstrap F1: {bootstrap_results['mean_f1']:.4f} (95% CI: [{bootstrap_results['ci_95'][0]:.4f}, {bootstrap_results['ci_95'][1]:.4f}])")
        print(f"  Top feature groups: {', '.join(ablation_results['importance_ranking'][:3])}")

        return output

    finally:
        await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
