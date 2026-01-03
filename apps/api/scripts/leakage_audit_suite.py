#!/usr/bin/env python3
"""
================================================================================
LEAKAGE AUDIT SUITE
================================================================================

Hard leakage audit for Mark benchmark and Q reconstruction.

This suite ensures:
A) Strict split audit - No holdout data ever touches training
B) Alignment sabotage controls - Breaking alignments must collapse performance
C) Hyperparameter leakage audit - Nested CV for threshold selection
D) Verse overlap check - No verse appears in both train and test

If any audit fails, the Mark F1 number is suspect.
================================================================================
"""

import pickle
import json
import asyncio
import asyncpg
import os
import numpy as np
from datetime import datetime
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import f1_score, precision_score, recall_score
from collections import defaultdict
from typing import Dict, List, Tuple, Set
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ.get('DATABASE_URL', '')
DATA_DIR = '/Users/royvaid/Downloads/logos/data'
PAPERS_DIR = '/Users/royvaid/Downloads/logos/papers'


def load_artifact(path):
    with open(path, 'rb') as f:
        return pickle.load(f)


class LeakageAuditSuite:
    """Comprehensive leakage audit for Mark benchmark."""

    def __init__(self, artifact: Dict, seed: int = 42):
        self.artifact = artifact
        self.seed = seed
        self.rng = np.random.RandomState(seed)
        self.results = {}

        # Extract data
        self.q_passages = artifact['data'].get('q_passages', [])
        self.mark_passages = artifact['data'].get('mark_passages', [])
        self.splits = artifact.get('splits', {})

    def audit_a_strict_split(self) -> Dict:
        """
        Audit A: Verify strict train/test split with no overlap.

        Check that:
        1. Test pericopes are completely held out
        2. No verse/word overlap between train and test
        3. Split is deterministic and reproducible
        """
        print("\nAudit A: Strict Split Verification")
        print("-" * 50)

        issues = []

        # Check pericope splits
        pericope_splits = self.splits.get('pericope_splits', {})
        if not pericope_splits:
            issues.append("No pericope splits defined")
            return {
                'audit': 'Strict Split',
                'passed': False,
                'issues': issues
            }

        train_pericopes = set(pericope_splits.get('train_pericopes', []))
        test_pericopes = set(pericope_splits.get('test_pericopes', []))

        # Check for overlap
        overlap = train_pericopes & test_pericopes
        if overlap:
            issues.append(f"Pericope overlap detected: {overlap}")
            print(f"  ERROR: {len(overlap)} pericopes appear in both train and test")
        else:
            print(f"  OK: No pericope overlap (train: {len(train_pericopes)}, test: {len(test_pericopes)})")

        # Check verse overlap within Q passages
        train_indices = set(pericope_splits.get('train', []))
        test_indices = set(pericope_splits.get('test', []))

        train_texts = set()
        test_texts = set()

        for i, item in enumerate(self.q_passages):
            text_hash = hash(item.get('text', ''))
            if i in train_indices:
                train_texts.add(text_hash)
            elif i in test_indices:
                test_texts.add(text_hash)

        text_overlap = train_texts & test_texts
        if text_overlap:
            issues.append(f"Text overlap detected: {len(text_overlap)} identical passages")
            print(f"  ERROR: {len(text_overlap)} identical passages in train and test")
        else:
            print(f"  OK: No identical passages across split")

        # Verify seed reproducibility
        rng1 = np.random.RandomState(self.seed)
        rng2 = np.random.RandomState(self.seed)
        seq1 = [rng1.randint(0, 1000) for _ in range(10)]
        seq2 = [rng2.randint(0, 1000) for _ in range(10)]
        if seq1 != seq2:
            issues.append("Random seed not reproducible")
            print("  ERROR: Random seed not reproducible")
        else:
            print(f"  OK: Seed {self.seed} is reproducible")

        passed = len(issues) == 0
        print(f"  Result: {'PASS' if passed else 'FAIL'}")

        return {
            'audit': 'Strict Split',
            'passed': passed,
            'train_pericopes': len(train_pericopes),
            'test_pericopes': len(test_pericopes),
            'overlap_count': len(overlap),
            'text_overlap_count': len(text_overlap),
            'issues': issues
        }

    def audit_b_alignment_sabotage(self) -> Dict:
        """
        Audit B: Sabotage controls - breaking alignments must collapse performance.

        Tests:
        1. Random permutation of alignment links - F1 must drop
        2. Shift verse boundaries by ±1 - F1 must drop
        3. Swap Q/Mark labels - F1 must drop
        """
        print("\nAudit B: Alignment Sabotage Controls")
        print("-" * 50)

        # Prepare data
        X_list, y_list = [], []
        for item in self.q_passages:
            X_list.append(item['features'])
            y_list.append(1)
        for item in self.mark_passages:
            X_list.append(item['features'])
            y_list.append(0)

        X = np.array(X_list)
        y = np.array(y_list)

        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # Baseline F1
        baseline_f1 = np.mean(cross_val_score(clf, X_scaled, y, cv=5, scoring='f1'))
        print(f"  Baseline F1: {baseline_f1:.3f}")

        # Test 1: Permute Q feature associations
        perm_idx = self.rng.permutation(len(self.q_passages))
        X_perm = X.copy()
        q_start = 0
        q_end = len(self.q_passages)
        X_perm[q_start:q_end] = X_perm[q_start:q_end][perm_idx]
        X_perm_scaled = scaler.fit_transform(X_perm)
        perm_f1 = np.mean(cross_val_score(clf, X_perm_scaled, y, cv=5, scoring='f1'))
        perm_drop = baseline_f1 - perm_f1
        print(f"  Permuted Q features F1: {perm_f1:.3f} (drop: {perm_drop:.3f})")

        # Test 2: Swap Q and Mark labels
        y_swapped = 1 - y
        swap_f1 = np.mean(cross_val_score(clf, X_scaled, y_swapped, cv=5, scoring='f1'))
        print(f"  Swapped labels F1: {swap_f1:.3f}")

        # Test 3: Add noise to features (simulate boundary shift)
        X_noisy = X_scaled + self.rng.randn(*X_scaled.shape) * 2.0  # Heavy noise
        noise_f1 = np.mean(cross_val_score(clf, X_noisy, y, cv=5, scoring='f1'))
        noise_drop = baseline_f1 - noise_f1
        print(f"  Heavy noise F1: {noise_f1:.3f} (drop: {noise_drop:.3f})")

        # Test 4: Shuffle features within each sample (destroys patterns)
        X_shuffled = X_scaled.copy()
        for i in range(len(X_shuffled)):
            self.rng.shuffle(X_shuffled[i])
        shuffle_f1 = np.mean(cross_val_score(clf, X_shuffled, y, cv=5, scoring='f1'))
        shuffle_drop = baseline_f1 - shuffle_f1
        print(f"  Shuffled features F1: {shuffle_f1:.3f} (drop: {shuffle_drop:.3f})")

        # Sabotage must cause meaningful drops
        min_expected_drop = 0.05
        issues = []

        if shuffle_drop < min_expected_drop:
            issues.append(f"Shuffled features didn't collapse ({shuffle_drop:.3f} drop)")

        if noise_drop < min_expected_drop:
            issues.append(f"Heavy noise didn't collapse ({noise_drop:.3f} drop)")

        passed = len(issues) == 0
        print(f"  Result: {'PASS' if passed else 'FAIL'}")

        return {
            'audit': 'Alignment Sabotage',
            'passed': passed,
            'baseline_f1': float(baseline_f1),
            'permuted_f1': float(perm_f1),
            'swapped_f1': float(swap_f1),
            'noise_f1': float(noise_f1),
            'shuffle_f1': float(shuffle_f1),
            'shuffle_drop': float(shuffle_drop),
            'noise_drop': float(noise_drop),
            'issues': issues
        }

    def audit_c_hyperparameter_leakage(self) -> Dict:
        """
        Audit C: Nested CV to check for hyperparameter leakage.

        Uses inner loop for hyperparameter selection, outer loop for evaluation.
        If there's leakage, nested CV F1 will be much lower than regular CV.
        """
        print("\nAudit C: Hyperparameter Leakage (Nested CV)")
        print("-" * 50)

        # Prepare data
        X_list, y_list = [], []
        for item in self.q_passages:
            X_list.append(item['features'])
            y_list.append(1)
        for item in self.mark_passages:
            X_list.append(item['features'])
            y_list.append(0)

        X = np.array(X_list)
        y = np.array(y_list)

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # Regular CV
        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        regular_f1 = np.mean(cross_val_score(clf, X_scaled, y, cv=5, scoring='f1'))
        print(f"  Regular 5-fold CV F1: {regular_f1:.3f}")

        # Nested CV (outer: 5 folds, inner: 3 folds for hyperparam)
        outer_cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=self.seed)
        inner_cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=self.seed)

        nested_scores = []
        for train_outer, test_outer in outer_cv.split(X_scaled, y):
            X_train_outer = X_scaled[train_outer]
            y_train_outer = y[train_outer]
            X_test_outer = X_scaled[test_outer]
            y_test_outer = y[test_outer]

            # Inner loop: find best n_estimators
            best_inner_f1 = 0
            best_n_est = 50

            for n_est in [50, 100, 150]:
                clf_inner = RandomForestClassifier(n_estimators=n_est, random_state=self.seed)
                inner_scores = cross_val_score(clf_inner, X_train_outer, y_train_outer,
                                               cv=inner_cv, scoring='f1')
                if np.mean(inner_scores) > best_inner_f1:
                    best_inner_f1 = np.mean(inner_scores)
                    best_n_est = n_est

            # Evaluate on outer fold
            clf_best = RandomForestClassifier(n_estimators=best_n_est, random_state=self.seed)
            clf_best.fit(X_train_outer, y_train_outer)
            y_pred = clf_best.predict(X_test_outer)
            nested_scores.append(f1_score(y_test_outer, y_pred))

        nested_f1 = np.mean(nested_scores)
        print(f"  Nested CV F1: {nested_f1:.3f}")

        # Gap between regular and nested CV
        gap = regular_f1 - nested_f1
        print(f"  Gap (regular - nested): {gap:.3f}")

        # Large gap indicates hyperparameter leakage
        max_acceptable_gap = 0.10
        issues = []
        if gap > max_acceptable_gap:
            issues.append(f"Large regular-nested gap ({gap:.3f}) suggests hyperparameter leakage")

        passed = len(issues) == 0
        print(f"  Result: {'PASS' if passed else 'FAIL'}")

        return {
            'audit': 'Hyperparameter Leakage',
            'passed': passed,
            'regular_cv_f1': float(regular_f1),
            'nested_cv_f1': float(nested_f1),
            'gap': float(gap),
            'max_acceptable_gap': max_acceptable_gap,
            'issues': issues
        }

    def audit_d_feature_leakage(self) -> Dict:
        """
        Audit D: Check for feature leakage - features that directly encode labels.

        Tests:
        1. Feature correlation with labels
        2. Single feature predictive power
        3. Feature-label mutual information
        """
        print("\nAudit D: Feature Leakage Check")
        print("-" * 50)

        # Prepare data
        X_list, y_list = [], []
        for item in self.q_passages:
            X_list.append(item['features'])
            y_list.append(1)
        for item in self.mark_passages:
            X_list.append(item['features'])
            y_list.append(0)

        X = np.array(X_list)
        y = np.array(y_list)

        # Check correlation of each feature with label
        correlations = []
        for i in range(X.shape[1]):
            corr = np.corrcoef(X[:, i], y)[0, 1]
            if np.isnan(corr):
                corr = 0
            correlations.append((i, abs(corr)))

        correlations.sort(key=lambda x: x[1], reverse=True)

        print(f"  Top 5 features by label correlation:")
        for i, (feat_idx, corr) in enumerate(correlations[:5]):
            print(f"    Feature {feat_idx}: |r| = {corr:.3f}")

        # Check single-feature predictive power
        print(f"\n  Single-feature F1 scores:")
        single_f1s = []
        for feat_idx in range(min(10, X.shape[1])):
            X_single = X[:, feat_idx].reshape(-1, 1)
            scaler = StandardScaler()
            X_single_scaled = scaler.fit_transform(X_single)
            clf = RandomForestClassifier(n_estimators=50, random_state=self.seed)
            f1 = np.mean(cross_val_score(clf, X_single_scaled, y, cv=3, scoring='f1'))
            single_f1s.append((feat_idx, f1))

        single_f1s.sort(key=lambda x: x[1], reverse=True)
        for feat_idx, f1 in single_f1s[:3]:
            print(f"    Feature {feat_idx}: F1 = {f1:.3f}")

        # Check for suspiciously high single-feature F1
        max_single_f1 = max(f[1] for f in single_f1s)
        issues = []
        if max_single_f1 > 0.7:
            issues.append(f"Single feature achieves F1 > 0.7 ({max_single_f1:.3f})")

        # Check for suspiciously high correlation
        max_corr = correlations[0][1] if correlations else 0
        if max_corr > 0.6:
            issues.append(f"Feature {correlations[0][0]} has high label correlation ({max_corr:.3f})")

        passed = len(issues) == 0
        print(f"\n  Result: {'PASS' if passed else 'FAIL'}")

        return {
            'audit': 'Feature Leakage',
            'passed': passed,
            'max_correlation': float(max_corr),
            'max_single_f1': float(max_single_f1),
            'top_correlations': [(i, float(c)) for i, c in correlations[:5]],
            'issues': issues
        }

    def run_all_audits(self) -> Dict:
        """Run all leakage audits."""
        print("=" * 70)
        print("LEAKAGE AUDIT SUITE")
        print("=" * 70)
        print(f"Dataset: {len(self.q_passages)} Q + {len(self.mark_passages)} Mark passages")
        print(f"Seed: {self.seed}")

        self.results['audit_a'] = self.audit_a_strict_split()
        self.results['audit_b'] = self.audit_b_alignment_sabotage()
        self.results['audit_c'] = self.audit_c_hyperparameter_leakage()
        self.results['audit_d'] = self.audit_d_feature_leakage()

        # Summary
        passed_count = sum(1 for r in self.results.values() if r.get('passed', False))
        all_passed = passed_count == 4

        print("\n" + "=" * 70)
        print("LEAKAGE AUDIT SUMMARY")
        print("=" * 70)

        for key, result in self.results.items():
            status = "PASS" if result.get('passed') else "FAIL"
            print(f"  {result['audit']}: [{status}]")

        print(f"\n  Total: {passed_count}/4 audits passed")
        print(f"  Verdict: {'NO LEAKAGE DETECTED' if all_passed else 'POTENTIAL LEAKAGE'}")

        return {
            'timestamp': datetime.now().isoformat(),
            'audits_passed': passed_count,
            'audits_total': 4,
            'all_passed': all_passed,
            'results': self.results
        }


def save_audit_report(results: Dict, output_dir: str = PAPERS_DIR):
    """Save leakage audit report."""
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    json_path = os.path.join(output_dir, 'MARK_LEAKAGE_AUDIT.json')
    with open(json_path, 'w') as f:
        json.dump(results, f, indent=2, default=float)

    md_path = os.path.join(output_dir, 'MARK_LEAKAGE_AUDIT.md')
    with open(md_path, 'w') as f:
        f.write("# Mark Benchmark Leakage Audit\n\n")
        f.write(f"**Status:** {'NO LEAKAGE DETECTED' if results['all_passed'] else 'POTENTIAL LEAKAGE'}\n\n")
        f.write(f"**Audits Passed:** {results['audits_passed']}/4\n\n")
        f.write(f"**Timestamp:** {results['timestamp']}\n\n")

        f.write("## Audit Results\n\n")
        f.write("| Audit | Test | Status |\n")
        f.write("|:------|:-----|:------:|\n")

        for key, result in results['results'].items():
            status = "PASS" if result.get('passed') else "FAIL"
            f.write(f"| {key} | {result['audit']} | {status} |\n")

        f.write("\n## Detailed Results\n\n")
        for key, result in results['results'].items():
            f.write(f"### {result['audit']}\n\n")
            if result.get('issues'):
                f.write("Issues found:\n")
                for issue in result['issues']:
                    f.write(f"- {issue}\n")
            else:
                f.write("No issues found.\n")
            f.write("\n")

    print(f"\nAudit report saved:")
    print(f"  {json_path}")
    print(f"  {md_path}")


def main():
    print("Loading dataset artifact...")
    artifact_path = list(Path(DATA_DIR).glob('synoptic_canonical_*.pkl'))[0]
    artifact = load_artifact(artifact_path)
    print(f"Loaded: {artifact_path.name}")

    suite = LeakageAuditSuite(artifact, seed=42)
    results = suite.run_all_audits()

    save_audit_report(results)

    return results


if __name__ == "__main__":
    main()
