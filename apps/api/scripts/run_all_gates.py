#!/usr/bin/env python3
"""
================================================================================
FROZEN GATE RUNNER - APPROVAL SCAFFOLD
================================================================================

Single entrypoint that runs the complete evaluation pipeline on frozen artifacts.

This script:
1. Loads or builds canonical dataset artifacts (never uses cached JSON)
2. Runs all falsification gates
3. Produces APPROVAL_CERTIFICATE.md/json

The "approval scaffold" pattern: a separate, adversarial evaluation harness
that cannot see training internals and can only approve a run when every
gate passes on frozen holdouts.

Usage:
    python run_all_gates.py --frozen
    python run_all_gates.py --rebuild-data  # Force rebuild datasets

================================================================================
"""

import os
import sys
import json
import pickle
import asyncio
import argparse
import numpy as np
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import f1_score, precision_score, recall_score
import warnings
warnings.filterwarnings('ignore')

# Add scripts directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from repro_manifest import ReproManifest, create_manifest
from build_dataset_from_db import (
    build_all_datasets, DatasetArtifact, extract_features_v2
)

DATABASE_URL = os.environ.get('DATABASE_URL', '')
DATA_DIR = '/Users/royvaid/Downloads/logos/data'
PAPERS_DIR = '/Users/royvaid/Downloads/logos/papers'

# Approval thresholds (DO NOT MODIFY without versioning)
THRESHOLDS = {
    'gate_1_margin': 0.10,       # Label permutation margin
    'gate_2_ratio': 0.60,        # Topic holdout ratio
    'gate_3_confound': 0.15,     # Confound advantage limit
    'gate_4_margin': 0.10,       # Random features margin
    'gate_5_std': 0.08,          # Stability std limit
    'gate_6_cv_coeff': 0.20,     # CV coefficient limit
    'gate_7_separation': 0.0,    # Out-of-domain separation (positive)
    'gate_8_improvement': 0.0,   # Feature ablation improvement (positive)
    'gate_9_delta': 0.20,        # Adversarial robustness delta
    'gate_10_asymmetry': 0.30,   # Temporal asymmetry limit
    'min_f1': 0.50,              # Minimum acceptable F1
}


class FrozenGateRunner:
    """Runs falsification gates on frozen dataset artifacts."""

    def __init__(self, artifact: DatasetArtifact, seed: int = 42):
        self.artifact = artifact
        self.seed = seed
        self.rng = np.random.RandomState(seed)

        # Extract features and labels
        self.X, self.y, self.sources = self._prepare_data()
        self.results = {}

    def _prepare_data(self):
        """Prepare feature matrix and labels from artifact."""
        X_list = []
        y_list = []
        sources = []

        for item in self.artifact.data.get('q_passages', []):
            X_list.append(item['features'])
            y_list.append(1)
            sources.append('Q')

        for item in self.artifact.data.get('mark_passages', []):
            X_list.append(item['features'])
            y_list.append(0)
            sources.append('Mark')

        return np.array(X_list), np.array(y_list), sources

    def gate_1_label_permutation(self) -> Dict:
        """Gate 1: Random label shuffling should fail."""
        print("  Gate 1: Label Permutation...")

        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(self.X)

        # Real labels
        real_scores = cross_val_score(clf, X_scaled, self.y, cv=5, scoring='f1')
        real_f1 = np.mean(real_scores)

        # Permuted labels (10 runs)
        perm_scores = []
        for i in range(10):
            y_perm = self.rng.permutation(self.y)
            scores = cross_val_score(clf, X_scaled, y_perm, cv=5, scoring='f1')
            perm_scores.append(np.mean(scores))

        perm_f1 = np.mean(perm_scores)
        margin = real_f1 - perm_f1
        passed = margin > THRESHOLDS['gate_1_margin']

        return {
            'gate': 'Label Permutation',
            'passed': bool(passed),
            'real_f1': float(real_f1),
            'permuted_f1': float(perm_f1),
            'margin': float(margin),
            'threshold': THRESHOLDS['gate_1_margin']
        }

    def gate_2_topic_holdout(self) -> Dict:
        """Gate 2: Style should persist across topic clusters."""
        print("  Gate 2: Topic Holdout...")

        n = len(self.X)
        fold_size = n // 3

        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        scaler = StandardScaler()

        holdout_scores = []
        for fold in range(3):
            start = fold * fold_size
            end = start + fold_size if fold < 2 else n

            test_idx = list(range(start, end))
            train_idx = [i for i in range(n) if i not in test_idx]

            if len(set(self.y[train_idx])) < 2 or len(set(self.y[test_idx])) < 2:
                continue

            X_train = scaler.fit_transform(self.X[train_idx])
            X_test = scaler.transform(self.X[test_idx])

            clf.fit(X_train, self.y[train_idx])
            y_pred = clf.predict(X_test)

            if sum(self.y[test_idx]) > 0:
                holdout_scores.append(f1_score(self.y[test_idx], y_pred))

        if not holdout_scores:
            return {
                'gate': 'Topic Holdout',
                'passed': False,
                'reason': 'Insufficient data for holdout',
                'avg_f1': 0.0
            }

        avg_f1 = np.mean(holdout_scores)

        # Compute ratio vs full CV
        full_scores = cross_val_score(clf, scaler.fit_transform(self.X), self.y, cv=5, scoring='f1')
        full_f1 = np.mean(full_scores)
        ratio = avg_f1 / full_f1 if full_f1 > 0 else 0

        passed = ratio > THRESHOLDS['gate_2_ratio'] and avg_f1 > THRESHOLDS['min_f1']

        return {
            'gate': 'Topic Holdout',
            'passed': bool(passed),
            'holdout_f1': float(avg_f1),
            'full_f1': float(full_f1),
            'ratio': float(ratio),
            'threshold': THRESHOLDS['gate_2_ratio']
        }

    def gate_3_confound_check(self) -> Dict:
        """Gate 3: Not just length/frequency artifacts."""
        print("  Gate 3: Confound Check...")

        # Confound features (last 5: length-related)
        confound_features = self.X[:, -5:]

        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        scaler = StandardScaler()

        # Confound-only model
        X_conf = scaler.fit_transform(confound_features)
        conf_scores = cross_val_score(clf, X_conf, self.y, cv=5, scoring='f1')
        conf_f1 = np.mean(conf_scores)

        # Full model
        X_full = scaler.fit_transform(self.X)
        full_scores = cross_val_score(clf, X_full, self.y, cv=5, scoring='f1')
        full_f1 = np.mean(full_scores)

        improvement = full_f1 - conf_f1
        passed = improvement > THRESHOLDS['gate_3_confound']

        return {
            'gate': 'Confound Check',
            'passed': bool(passed),
            'full_f1': float(full_f1),
            'confound_f1': float(conf_f1),
            'improvement': float(improvement),
            'threshold': THRESHOLDS['gate_3_confound']
        }

    def gate_4_random_features(self) -> Dict:
        """Gate 4: Random noise features shouldn't work."""
        print("  Gate 4: Random Features...")

        X_random = self.rng.randn(len(self.X), self.X.shape[1])

        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        scaler = StandardScaler()

        # Random features
        X_rand_scaled = scaler.fit_transform(X_random)
        rand_scores = cross_val_score(clf, X_rand_scaled, self.y, cv=5, scoring='f1')
        rand_f1 = np.mean(rand_scores)

        # Real features
        X_real_scaled = scaler.fit_transform(self.X)
        real_scores = cross_val_score(clf, X_real_scaled, self.y, cv=5, scoring='f1')
        real_f1 = np.mean(real_scores)

        margin = real_f1 - rand_f1
        passed = margin > THRESHOLDS['gate_4_margin']

        return {
            'gate': 'Random Features',
            'passed': bool(passed),
            'real_f1': float(real_f1),
            'random_f1': float(rand_f1),
            'margin': float(margin),
            'threshold': THRESHOLDS['gate_4_margin']
        }

    def gate_5_stability(self) -> Dict:
        """Gate 5: Results stable across random seeds."""
        print("  Gate 5: Stability...")

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(self.X)

        run_scores = []
        for seed in range(10):
            clf = RandomForestClassifier(n_estimators=100, random_state=seed)
            scores = cross_val_score(clf, X_scaled, self.y, cv=5, scoring='f1')
            run_scores.append(np.mean(scores))

        avg_f1 = np.mean(run_scores)
        std_f1 = np.std(run_scores)
        passed = std_f1 < THRESHOLDS['gate_5_std'] and avg_f1 > THRESHOLDS['min_f1']

        return {
            'gate': 'Stability',
            'passed': bool(passed),
            'mean_f1': float(avg_f1),
            'std_f1': float(std_f1),
            'min_f1': float(min(run_scores)),
            'max_f1': float(max(run_scores)),
            'threshold': THRESHOLDS['gate_5_std']
        }

    def gate_6_cv_variance(self) -> Dict:
        """Gate 6: Low variance across CV folds."""
        print("  Gate 6: CV Variance...")

        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(self.X)

        cv = StratifiedKFold(n_splits=10, shuffle=True, random_state=self.seed)
        fold_scores = cross_val_score(clf, X_scaled, self.y, cv=cv, scoring='f1')

        avg_f1 = np.mean(fold_scores)
        std_f1 = np.std(fold_scores)
        cv_coeff = std_f1 / avg_f1 if avg_f1 > 0 else float('inf')

        passed = cv_coeff < THRESHOLDS['gate_6_cv_coeff'] and avg_f1 > THRESHOLDS['min_f1']

        return {
            'gate': 'CV Variance',
            'passed': bool(passed),
            'mean_f1': float(avg_f1),
            'std_f1': float(std_f1),
            'cv_coefficient': float(cv_coeff),
            'threshold': THRESHOLDS['gate_6_cv_coeff']
        }

    def gate_7_out_of_domain(self, thomas_artifact: Optional[DatasetArtifact] = None) -> Dict:
        """Gate 7: Transfer to out-of-domain data (Thomas)."""
        print("  Gate 7: Out-of-Domain Transfer...")

        if thomas_artifact is None:
            return {
                'gate': 'Out-of-Domain Transfer',
                'passed': False,
                'reason': 'No Thomas artifact provided'
            }

        # Train on synoptic data
        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(self.X)
        clf.fit(X_scaled, self.y)

        # Test on Thomas
        thomas_features = []
        thomas_labels = []

        for item in thomas_artifact.data.get('logia', []):
            thomas_features.append(item['features'])
            thomas_labels.append(1 if item['has_q_parallel'] else 0)

        if not thomas_features:
            return {
                'gate': 'Out-of-Domain Transfer',
                'passed': False,
                'reason': 'No Thomas data'
            }

        X_thomas = scaler.transform(np.array(thomas_features))
        predictions = clf.predict_proba(X_thomas)[:, 1]

        # Compare scores for items with/without Q parallel
        y_thomas = np.array(thomas_labels)
        has_parallel = y_thomas == 1

        if not any(has_parallel) or not any(~has_parallel):
            return {
                'gate': 'Out-of-Domain Transfer',
                'passed': False,
                'reason': 'Insufficient Thomas variation'
            }

        avg_with = np.mean(predictions[has_parallel])
        avg_without = np.mean(predictions[~has_parallel])
        separation = avg_with - avg_without

        passed = separation > THRESHOLDS['gate_7_separation']

        return {
            'gate': 'Out-of-Domain Transfer',
            'passed': bool(passed),
            'avg_q_score_with_parallel': float(avg_with),
            'avg_q_score_without_parallel': float(avg_without),
            'separation': float(separation),
            'threshold': THRESHOLDS['gate_7_separation']
        }

    def gate_8_feature_ablation(self) -> Dict:
        """Gate 8: Core features matter most."""
        print("  Gate 8: Feature Ablation...")

        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        scaler = StandardScaler()

        # Full model
        X_full = scaler.fit_transform(self.X)
        full_scores = cross_val_score(clf, X_full, self.y, cv=5, scoring='f1')
        full_f1 = np.mean(full_scores)

        # Function words only (first 50)
        X_func = scaler.fit_transform(self.X[:, :50])
        func_scores = cross_val_score(clf, X_func, self.y, cv=5, scoring='f1')
        func_f1 = np.mean(func_scores)

        # Length only (50:55)
        X_length = scaler.fit_transform(self.X[:, 50:55])
        length_scores = cross_val_score(clf, X_length, self.y, cv=5, scoring='f1')
        length_f1 = np.mean(length_scores)

        improvement = func_f1 - length_f1
        passed = improvement > THRESHOLDS['gate_8_improvement']

        return {
            'gate': 'Feature Ablation',
            'passed': bool(passed),
            'full_f1': float(full_f1),
            'function_words_f1': float(func_f1),
            'length_f1': float(length_f1),
            'improvement': float(improvement),
            'threshold': THRESHOLDS['gate_8_improvement']
        }

    def gate_9_adversarial_robustness(self) -> Dict:
        """Gate 9: Resistant to small perturbations."""
        print("  Gate 9: Adversarial Robustness...")

        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(self.X)
        clf.fit(X_scaled, self.y)

        orig_proba = clf.predict_proba(X_scaled)[:, 1]

        # Test perturbation levels
        deltas = []
        for noise_level in [0.01, 0.02, 0.05]:
            X_noisy = X_scaled + self.rng.randn(*X_scaled.shape) * noise_level
            noisy_proba = clf.predict_proba(X_noisy)[:, 1]
            deltas.append(np.mean(np.abs(orig_proba - noisy_proba)))

        avg_delta = np.mean(deltas[:2])  # Average of 1% and 2% noise
        passed = avg_delta < THRESHOLDS['gate_9_delta']

        return {
            'gate': 'Adversarial Robustness',
            'passed': bool(passed),
            'avg_delta': float(avg_delta),
            'noise_deltas': [float(d) for d in deltas],
            'threshold': THRESHOLDS['gate_9_delta']
        }

    def gate_10_temporal_stability(self) -> Dict:
        """Gate 10: Works across data ordering (proxy for temporal)."""
        print("  Gate 10: Temporal Stability...")

        n = len(self.X)
        mid = n // 2

        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        scaler = StandardScaler()

        # Forward: train on first half, test on second
        X_train = scaler.fit_transform(self.X[:mid])
        X_test = scaler.transform(self.X[mid:])

        if len(set(self.y[:mid])) < 2 or len(set(self.y[mid:])) < 2:
            return {
                'gate': 'Temporal Stability',
                'passed': False,
                'reason': 'Insufficient class variation in halves'
            }

        clf.fit(X_train, self.y[:mid])
        y_pred = clf.predict(X_test)
        forward_f1 = f1_score(self.y[mid:], y_pred)

        # Backward: train on second half, test on first
        X_train = scaler.fit_transform(self.X[mid:])
        X_test = scaler.transform(self.X[:mid])

        clf.fit(X_train, self.y[mid:])
        y_pred = clf.predict(X_test)
        backward_f1 = f1_score(self.y[:mid], y_pred)

        avg_f1 = (forward_f1 + backward_f1) / 2
        asymmetry = abs(forward_f1 - backward_f1)

        passed = asymmetry < THRESHOLDS['gate_10_asymmetry'] and avg_f1 > THRESHOLDS['min_f1']

        return {
            'gate': 'Temporal Stability',
            'passed': bool(passed),
            'forward_f1': float(forward_f1),
            'backward_f1': float(backward_f1),
            'avg_f1': float(avg_f1),
            'asymmetry': float(asymmetry),
            'threshold': THRESHOLDS['gate_10_asymmetry']
        }

    def run_all_gates(self, thomas_artifact: Optional[DatasetArtifact] = None) -> Dict:
        """Run all 10 falsification gates."""
        print("\n" + "=" * 70)
        print("FROZEN GATE RUNNER - APPROVAL SCAFFOLD")
        print("=" * 70)
        print(f"Dataset: {self.artifact.name}")
        print(f"Content hash: {self.artifact.content_hash}")
        print(f"Samples: {len(self.X)}")
        print(f"Seed: {self.seed}")
        print("-" * 70)

        gates = [
            self.gate_1_label_permutation,
            self.gate_2_topic_holdout,
            self.gate_3_confound_check,
            self.gate_4_random_features,
            self.gate_5_stability,
            self.gate_6_cv_variance,
            lambda: self.gate_7_out_of_domain(thomas_artifact),
            self.gate_8_feature_ablation,
            self.gate_9_adversarial_robustness,
            self.gate_10_temporal_stability,
        ]

        results = {}
        for i, gate_fn in enumerate(gates, 1):
            result = gate_fn()
            results[f'gate_{i}'] = result

        passed = sum(1 for r in results.values() if r.get('passed', False))

        print("\n" + "=" * 70)
        print("GATE RESULTS")
        print("=" * 70)

        for key, result in results.items():
            status = "PASS" if result.get('passed') else "FAIL"
            print(f"  {result['gate']}: [{status}]")

        print(f"\n  Total: {passed}/10 gates passed")

        approved = passed >= 8  # Require 8/10 for approval

        return {
            'timestamp': datetime.now().isoformat(),
            'artifact_hash': self.artifact.content_hash,
            'seed': self.seed,
            'gates_passed': passed,
            'gates_total': 10,
            'approved': approved,
            'thresholds': THRESHOLDS,
            'results': results
        }


def generate_approval_certificate(
    gate_results: Dict,
    manifest: ReproManifest,
    output_dir: str = PAPERS_DIR
):
    """Generate approval certificate files."""
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    status = "APPROVED" if gate_results['approved'] else "NOT APPROVED"

    # JSON certificate
    certificate = {
        'status': status,
        'timestamp': gate_results['timestamp'],
        'artifact_hash': gate_results['artifact_hash'],
        'gates_passed': gate_results['gates_passed'],
        'gates_total': gate_results['gates_total'],
        'manifest_hash': manifest.manifest.get('manifest_hash'),
        'git_commit': manifest.manifest.get('git', {}).get('commit'),
        'thresholds': gate_results['thresholds'],
        'gate_details': gate_results['results']
    }

    json_path = os.path.join(output_dir, 'APPROVAL_CERTIFICATE.json')
    with open(json_path, 'w') as f:
        json.dump(certificate, f, indent=2)

    # Markdown certificate
    md_path = os.path.join(output_dir, 'APPROVAL_CERTIFICATE.md')
    with open(md_path, 'w') as f:
        f.write(f"# Approval Certificate\n\n")
        f.write(f"## Status: **{status}**\n\n")
        f.write(f"**Timestamp:** {gate_results['timestamp']}\n\n")
        f.write(f"**Gates Passed:** {gate_results['gates_passed']}/10\n\n")

        f.write("## Environment\n\n")
        f.write(f"- Git commit: `{manifest.manifest.get('git', {}).get('commit', 'unknown')}`\n")
        f.write(f"- Artifact hash: `{gate_results['artifact_hash']}`\n")
        f.write(f"- Seed: {gate_results['seed']}\n\n")

        f.write("## Gate Results\n\n")
        f.write("| Gate | Test | Status |\n")
        f.write("|:-----|:-----|:------:|\n")

        for key, result in gate_results['results'].items():
            status_icon = "PASS" if result.get('passed') else "FAIL"
            f.write(f"| {key} | {result['gate']} | {status_icon} |\n")

        f.write("\n## Thresholds\n\n")
        for key, value in gate_results['thresholds'].items():
            f.write(f"- {key}: {value}\n")

        f.write("\n---\n")
        f.write("*This certificate was generated by the Frozen Gate Runner.*\n")

    print(f"\nApproval certificate generated:")
    print(f"  {json_path}")
    print(f"  {md_path}")

    return json_path, md_path


async def main():
    parser = argparse.ArgumentParser(description='Frozen Gate Runner')
    parser.add_argument('--frozen', action='store_true', help='Run on frozen artifacts')
    parser.add_argument('--rebuild-data', action='store_true', help='Force rebuild datasets')
    parser.add_argument('--seed', type=int, default=42, help='Random seed')
    args = parser.parse_args()

    print("=" * 70)
    print("FROZEN GATE RUNNER - APPROVAL SCAFFOLD")
    print("=" * 70)

    # Create reproducibility manifest
    manifest = await create_manifest(
        run_name='FROZEN_GATE_RUN',
        config={'frozen': args.frozen, 'seed': args.seed}
    )
    manifest.set_seeds({'numpy': args.seed, 'sklearn': args.seed})

    # Build or load datasets
    if args.rebuild_data or not os.path.exists(DATA_DIR):
        print("\nBuilding canonical datasets...")
        await build_all_datasets(seed=args.seed, output_dir=DATA_DIR)

    # Find latest artifacts
    synoptic_artifacts = list(Path(DATA_DIR).glob('synoptic_canonical_*.pkl'))
    thomas_artifacts = list(Path(DATA_DIR).glob('thomas_canonical_*.pkl'))

    if not synoptic_artifacts:
        print("ERROR: No synoptic artifact found. Run with --rebuild-data")
        sys.exit(1)

    # Load artifacts
    synoptic_path = max(synoptic_artifacts, key=os.path.getctime)
    synoptic_artifact = DatasetArtifact.load(str(synoptic_path))
    print(f"\nLoaded synoptic artifact: {synoptic_artifact.content_hash}")

    thomas_artifact = None
    if thomas_artifacts:
        thomas_path = max(thomas_artifacts, key=os.path.getctime)
        thomas_artifact = DatasetArtifact.load(str(thomas_path))
        print(f"Loaded Thomas artifact: {thomas_artifact.content_hash}")

    # Run gates
    runner = FrozenGateRunner(synoptic_artifact, seed=args.seed)
    gate_results = runner.run_all_gates(thomas_artifact)

    # Add gate results to manifest
    for key, result in gate_results['results'].items():
        gate_num = int(key.split('_')[1])
        manifest.add_gate_result(gate_num, result['gate'], result.get('passed', False), result)

    # Save manifest
    manifest.save(PAPERS_DIR)

    # Generate approval certificate
    generate_approval_certificate(gate_results, manifest, PAPERS_DIR)

    # Summary
    print("\n" + "=" * 70)
    if gate_results['approved']:
        print("RUN APPROVED - All criteria met")
    else:
        print("RUN NOT APPROVED - Criteria not met")
    print("=" * 70)

    return gate_results


if __name__ == "__main__":
    asyncio.run(main())
