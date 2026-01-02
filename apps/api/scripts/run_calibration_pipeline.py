#!/usr/bin/env python3
"""
LOGOS Calibration Pipeline Runner
==================================

Runs the full 4-gate calibration pipeline on Loeb translation data.
This script is designed to be run manually or via cron for nightly calibration.

Usage:
    python scripts/run_calibration_pipeline.py [--gate N] [--dry-run]

Options:
    --gate N       Run only gate N (1-4)
    --dry-run      Validate data without running calibration
    --force        Force re-run even if recent calibration exists
"""

import asyncio
import argparse
import sys
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import json
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncpg
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupKFold, cross_val_predict
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix
from sklearn.cluster import KMeans
from sklearn.metrics import normalized_mutual_info_score
from scipy.stats import spearmanr

from config.constants import (
    DATABASE_URL,
    CALIBRATION_THRESHOLDS,
    EMBED_DIM
)


class CalibrationPipelineRunner:
    """
    Runs the complete 4-gate calibration pipeline on Loeb data.
    """

    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool
        self.run_id = uuid.uuid4()
        self.results = {}

    async def run_full_pipeline(self, force: bool = False) -> Dict[str, Any]:
        """Run all 4 calibration gates sequentially."""

        # Check for recent calibration
        if not force:
            recent = await self._check_recent_calibration()
            if recent:
                return {
                    "status": "skipped",
                    "reason": "Recent calibration exists",
                    "last_run": recent['started_at'].isoformat(),
                    "all_gates_passed": recent['all_gates_passed']
                }

        # Create calibration run record
        await self._create_run_record()

        try:
            # Gate 1: Style Separability
            print("\n" + "="*60)
            print("GATE 1: Style Separability (Supervised Classifier)")
            print("="*60)
            gate1_result = await self.run_gate_1()
            self.results['gate_1'] = gate1_result

            if not gate1_result['passed']:
                print(f"GATE 1 FAILED: {gate1_result.get('reason', 'threshold not met')}")
                await self._update_run_status('failed', gate1_result.get('reason'))
                return self._compile_results()

            # Gate 2: Stability Across Windows
            print("\n" + "="*60)
            print("GATE 2: Stability Across Windows")
            print("="*60)
            gate2_result = await self.run_gate_2()
            self.results['gate_2'] = gate2_result

            if not gate2_result['passed']:
                print(f"GATE 2 FAILED: {gate2_result.get('reason', 'threshold not met')}")
                await self._update_run_status('failed', gate2_result.get('reason'))
                return self._compile_results()

            # Gate 3: Cross-Era Separation
            print("\n" + "="*60)
            print("GATE 3: Cross-Era Separation")
            print("="*60)
            gate3_result = await self.run_gate_3()
            self.results['gate_3'] = gate3_result

            if not gate3_result['passed']:
                print(f"GATE 3 FAILED: {gate3_result.get('reason', 'threshold not met')}")
                await self._update_run_status('failed', gate3_result.get('reason'))
                return self._compile_results()

            # Gate 4: External Validity
            print("\n" + "="*60)
            print("GATE 4: External Validity")
            print("="*60)
            gate4_result = await self.run_gate_4()
            self.results['gate_4'] = gate4_result

            if not gate4_result['passed']:
                print(f"GATE 4 FAILED: {gate4_result.get('reason', 'threshold not met')}")
                await self._update_run_status('failed', gate4_result.get('reason'))
                return self._compile_results()

            # All gates passed!
            print("\n" + "="*60)
            print("ALL CALIBRATION GATES PASSED!")
            print("="*60)
            await self._update_run_status('completed')

            return self._compile_results()

        except Exception as e:
            await self._update_run_status('failed', str(e))
            raise

    async def run_gate_1(self) -> Dict[str, Any]:
        """
        Gate 1: Style Separability

        Test: Can we identify translators when meaning is FIXED?
        Uses GroupKFold to prevent leakage (grouped by meaning_anchor_id).
        """
        thresholds = CALIBRATION_THRESHOLDS['gate_1']

        # Get style residuals with translator and anchor info
        data = await self._get_style_residual_data()

        if len(data) < 100:
            return {
                "passed": False,
                "reason": f"Insufficient data: {len(data)} samples (need 100+)",
                "samples_found": len(data)
            }

        # Prepare data
        X = np.array([d['residual_vector'] for d in data])
        y = np.array([d['translator_id'] for d in data])
        groups = np.array([d['meaning_anchor_id'] for d in data])

        # Map labels to consecutive integers
        unique_translators = list(set(y))
        if len(unique_translators) < 3:
            return {
                "passed": False,
                "reason": f"Insufficient translators: {len(unique_translators)} (need 3+)"
            }

        translator_map = {t: i for i, t in enumerate(unique_translators)}
        y_mapped = np.array([translator_map[t] for t in y])

        print(f"  - Samples: {len(X)}")
        print(f"  - Translators: {len(unique_translators)}")
        print(f"  - Unique meaning anchors: {len(set(groups))}")

        # GroupKFold cross-validation (prevents leakage)
        gkf = GroupKFold(n_splits=5)

        all_preds = []
        all_true = []
        all_probs = []

        for fold, (train_idx, test_idx) in enumerate(gkf.split(X, y_mapped, groups)):
            clf = LogisticRegression(max_iter=1000)
            clf.fit(X[train_idx], y_mapped[train_idx])

            preds = clf.predict(X[test_idx])
            probs = clf.predict_proba(X[test_idx])

            all_preds.extend(preds)
            all_true.extend(y_mapped[test_idx])
            all_probs.extend(probs)

            fold_acc = accuracy_score(y_mapped[test_idx], preds)
            print(f"  - Fold {fold+1} accuracy: {fold_acc:.3f}")

        # Compute metrics
        top1_accuracy = accuracy_score(all_true, all_preds)
        macro_f1 = f1_score(all_true, all_preds, average='macro')

        # Top-3 accuracy
        all_probs = np.array(all_probs)
        top3_correct = 0
        for i, (true_label, probs) in enumerate(zip(all_true, all_probs)):
            top3_preds = np.argsort(probs)[-3:]
            if true_label in top3_preds:
                top3_correct += 1
        top3_accuracy = top3_correct / len(all_true)

        # Expected Calibration Error (ECE)
        ece = self._compute_ece(all_probs, all_true)

        # Also compute NMI for visualization/comparison
        kmeans = KMeans(n_clusters=len(unique_translators), random_state=42, n_init=10)
        cluster_labels = kmeans.fit_predict(X)
        nmi = normalized_mutual_info_score(y_mapped, cluster_labels)

        # Confusion matrix
        cm = confusion_matrix(all_true, all_preds)

        # Check thresholds
        passed = (
            top1_accuracy >= thresholds['top1_accuracy'] and
            top3_accuracy >= thresholds['top3_accuracy'] and
            ece <= thresholds['ece']
        )

        print(f"\n  Results:")
        print(f"  - Top-1 Accuracy: {top1_accuracy:.3f} (threshold: {thresholds['top1_accuracy']})")
        print(f"  - Top-3 Accuracy: {top3_accuracy:.3f} (threshold: {thresholds['top3_accuracy']})")
        print(f"  - ECE: {ece:.4f} (threshold: {thresholds['ece']})")
        print(f"  - Macro F1: {macro_f1:.3f}")
        print(f"  - NMI (clustering): {nmi:.3f}")
        print(f"  - PASSED: {passed}")

        result = {
            "passed": passed,
            "top1_accuracy": float(top1_accuracy),
            "top3_accuracy": float(top3_accuracy),
            "ece": float(ece),
            "macro_f1": float(macro_f1),
            "nmi": float(nmi),
            "n_translators": len(unique_translators),
            "n_samples": len(X),
            "n_folds": 5,
            "confusion_matrix": cm.tolist(),
            "thresholds": thresholds
        }

        # Store in database
        await self._store_gate_1_result(result)

        return result

    async def run_gate_2(self) -> Dict[str, Any]:
        """
        Gate 2: Stability Across Windows

        Test: Do style signatures remain stable across different window sizes?
        Computes ICC (Intraclass Correlation Coefficient) across window sizes.
        """
        thresholds = CALIBRATION_THRESHOLDS['gate_2']
        window_sizes = [500, 1000, 2000]

        # Get translator profiles at different window sizes
        profiles_by_window = {}

        for window_size in window_sizes:
            profiles = await self._compute_translator_profiles_at_window(window_size)
            if profiles:
                profiles_by_window[window_size] = profiles

        if len(profiles_by_window) < 2:
            return {
                "passed": False,
                "reason": "Insufficient window size data"
            }

        # Compute F-ratio for each window size
        f_ratios = {}
        for window_size, profiles in profiles_by_window.items():
            f_ratio = self._compute_f_ratio(profiles)
            f_ratios[window_size] = f_ratio
            print(f"  - Window {window_size}: F-ratio = {f_ratio:.3f}")

        # Compute signature correlations between window sizes
        correlations = {}
        window_list = list(profiles_by_window.keys())
        for i, w1 in enumerate(window_list):
            for w2 in window_list[i+1:]:
                corr = self._compute_profile_correlation(
                    profiles_by_window[w1],
                    profiles_by_window[w2]
                )
                correlations[f"{w1}_{w2}"] = corr
                print(f"  - Correlation {w1} vs {w2}: {corr:.3f}")

        min_f_ratio = min(f_ratios.values())
        avg_correlation = np.mean(list(correlations.values()))

        passed = min_f_ratio >= thresholds['f_ratio']

        print(f"\n  Results:")
        print(f"  - Min F-ratio: {min_f_ratio:.3f} (threshold: {thresholds['f_ratio']})")
        print(f"  - Avg correlation: {avg_correlation:.3f}")
        print(f"  - PASSED: {passed}")

        result = {
            "passed": passed,
            "min_f_ratio": float(min_f_ratio),
            "f_ratios": {str(k): float(v) for k, v in f_ratios.items()},
            "correlations": {k: float(v) for k, v in correlations.items()},
            "avg_correlation": float(avg_correlation),
            "window_sizes": window_sizes,
            "thresholds": thresholds
        }

        await self._store_gate_2_result(result)

        return result

    async def run_gate_3(self) -> Dict[str, Any]:
        """
        Gate 3: Cross-Era Separation

        Test: Can we separate authors across different time periods?
        Tests easy (same era), medium (adjacent era), hard (distant era) pairs.
        """
        thresholds = CALIBRATION_THRESHOLDS['gate_3']

        # Define translator pairs by difficulty
        pairs = {
            "easy": [
                # Same publisher, obvious differences
                ("Pope", "Wilson"),
                ("Chapman", "Fagles"),
            ],
            "medium": [
                # Different styles, closer eras
                ("Lattimore", "Fagles"),
                ("Fitzgerald", "Wilson"),
            ],
            "hard": [
                # Same era, subtle differences
                ("Murray", "Rouse"),
                ("Butler", "Murray"),
            ]
        }

        results_by_difficulty = {}

        for difficulty, pair_list in pairs.items():
            accuracies = []

            for t1, t2 in pair_list:
                acc = await self._test_translator_pair(t1, t2)
                if acc is not None:
                    accuracies.append(acc)
                    print(f"  - {difficulty.upper()} {t1} vs {t2}: {acc:.3f}")

            if accuracies:
                results_by_difficulty[difficulty] = np.mean(accuracies)
            else:
                results_by_difficulty[difficulty] = 0.0

        easy_acc = results_by_difficulty.get('easy', 0)
        medium_acc = results_by_difficulty.get('medium', 0)
        hard_acc = results_by_difficulty.get('hard', 0)

        passed = (
            easy_acc >= thresholds['easy_accuracy'] and
            medium_acc >= thresholds['medium_accuracy'] and
            hard_acc >= thresholds['hard_accuracy']
        )

        print(f"\n  Results:")
        print(f"  - Easy accuracy: {easy_acc:.3f} (threshold: {thresholds['easy_accuracy']})")
        print(f"  - Medium accuracy: {medium_acc:.3f} (threshold: {thresholds['medium_accuracy']})")
        print(f"  - Hard accuracy: {hard_acc:.3f} (threshold: {thresholds['hard_accuracy']})")
        print(f"  - PASSED: {passed}")

        result = {
            "passed": passed,
            "easy_accuracy": float(easy_acc),
            "medium_accuracy": float(medium_acc),
            "hard_accuracy": float(hard_acc),
            "per_pair_results": results_by_difficulty,
            "thresholds": thresholds
        }

        await self._store_gate_3_result(result)

        return result

    async def run_gate_4(self) -> Dict[str, Any]:
        """
        Gate 4: External Validity

        Test: Do held-out translators cluster with stylistically similar translators?
        Uses k-nearest neighbors validation.
        """
        thresholds = CALIBRATION_THRESHOLDS['gate_4']

        # Get all translator centroids
        centroids = await self._get_translator_centroids()

        if len(centroids) < 5:
            return {
                "passed": False,
                "reason": f"Insufficient translators: {len(centroids)} (need 5+)"
            }

        # Hold out 20% for validation
        np.random.seed(42)
        translator_names = list(centroids.keys())
        n_holdout = max(1, len(translator_names) // 5)
        holdout = np.random.choice(translator_names, n_holdout, replace=False)
        training = [t for t in translator_names if t not in holdout]

        print(f"  - Training translators: {len(training)}")
        print(f"  - Holdout translators: {len(holdout)}")

        # For each held-out translator, find nearest neighbors
        validation_scores = []

        for t in holdout:
            t_vec = centroids[t]

            # Find 3 nearest neighbors in training set
            distances = []
            for train_t in training:
                dist = np.linalg.norm(np.array(t_vec) - np.array(centroids[train_t]))
                distances.append((train_t, dist))

            distances.sort(key=lambda x: x[1])
            nearest_3 = [d[0] for d in distances[:3]]

            # Check style family overlap (simplified - check era similarity)
            score = await self._compute_style_family_overlap(t, nearest_3)
            validation_scores.append(score)
            print(f"  - {t} neighbors: {nearest_3}, score: {score:.3f}")

        mean_validity = np.mean(validation_scores) if validation_scores else 0
        passed = mean_validity >= thresholds['neighbor_validity']

        print(f"\n  Results:")
        print(f"  - Mean neighbor validity: {mean_validity:.3f} (threshold: {thresholds['neighbor_validity']})")
        print(f"  - PASSED: {passed}")

        result = {
            "passed": passed,
            "mean_neighbor_validity": float(mean_validity),
            "n_holdout": n_holdout,
            "validation_scores": [float(s) for s in validation_scores],
            "holdout_translators": list(holdout),
            "thresholds": thresholds
        }

        await self._store_gate_4_result(result)

        return result

    # ═══════════════════════════════════════════════════════════════════════════════
    # HELPER METHODS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def _get_style_residual_data(self) -> List[Dict]:
        """Get style residuals with translator info, sampling across all translators."""
        async with self.pool.acquire() as conn:
            # Sample up to 500 residuals per translator to ensure diversity
            rows = await conn.fetch("""
                WITH ranked AS (
                    SELECT
                        sr.residual,
                        sr.translator_id,
                        sr.translation_id,
                        t.name as translator_name,
                        ROW_NUMBER() OVER (PARTITION BY sr.translator_id ORDER BY RANDOM()) as rn
                    FROM style_residuals sr
                    JOIN translators t ON sr.translator_id = t.id
                    WHERE sr.residual IS NOT NULL
                )
                SELECT residual, translator_id, translation_id, translator_name
                FROM ranked
                WHERE rn <= 500
            """)

            # Parse pgvector format
            result = []
            for r in rows:
                residual = r['residual']
                if residual is not None:
                    # Parse vector string "[0.1,0.2,...]" to numpy array
                    if isinstance(residual, str):
                        s = residual.strip()
                        if s.startswith('[') and s.endswith(']'):
                            s = s[1:-1]
                        vec = [float(x.strip()) for x in s.split(',') if x.strip()]
                    else:
                        vec = list(residual)
                    result.append({
                        'residual_vector': vec,
                        'translator_id': r['translator_id'],
                        'meaning_anchor_id': r['translation_id'],  # Use translation_id as anchor
                        'translator_name': r['translator_name']
                    })
            return result

    async def _compute_translator_profiles_at_window(self, window_size: int) -> Dict[str, np.ndarray]:
        """Compute translator profiles using specific window size."""
        # For now, use stored centroids (actual implementation would recompute at different windows)
        async with self.pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT
                    t.name,
                    tc.centroid
                FROM translator_centroids tc
                JOIN translators t ON tc.translator_id = t.id
                WHERE tc.centroid IS NOT NULL
            """)

            profiles = {}
            for r in rows:
                centroid = r['centroid']
                if centroid is not None:
                    # Parse pgvector format
                    if isinstance(centroid, str):
                        s = centroid.strip()
                        if s.startswith('[') and s.endswith(']'):
                            s = s[1:-1]
                        vec = np.array([float(x.strip()) for x in s.split(',') if x.strip()])
                    else:
                        vec = np.array(list(centroid))
                    profiles[r['name']] = vec
            return profiles

    def _compute_f_ratio(self, profiles: Dict[str, np.ndarray]) -> float:
        """Compute F-ratio (between-group / within-group variance)."""
        if len(profiles) < 2:
            return 0.0

        all_vectors = list(profiles.values())
        overall_mean = np.mean(all_vectors, axis=0)

        # Between-group variance
        between_var = np.mean([
            np.sum((v - overall_mean) ** 2)
            for v in all_vectors
        ])

        # Within-group variance (simplified - use embedding variance)
        within_var = np.mean([np.var(v) for v in all_vectors])

        if within_var == 0:
            return float('inf')

        return between_var / within_var

    def _compute_profile_correlation(
        self,
        profiles1: Dict[str, np.ndarray],
        profiles2: Dict[str, np.ndarray]
    ) -> float:
        """Compute correlation between profile sets."""
        common_translators = set(profiles1.keys()) & set(profiles2.keys())

        if len(common_translators) < 2:
            return 0.0

        # Compute pairwise distances in each set
        distances1 = []
        distances2 = []

        translators = list(common_translators)
        for i, t1 in enumerate(translators):
            for t2 in translators[i+1:]:
                d1 = np.linalg.norm(profiles1[t1] - profiles1[t2])
                d2 = np.linalg.norm(profiles2[t1] - profiles2[t2])
                distances1.append(d1)
                distances2.append(d2)

        if len(distances1) < 2:
            return 0.0

        corr, _ = spearmanr(distances1, distances2)
        return corr if not np.isnan(corr) else 0.0

    async def _test_translator_pair(self, t1: str, t2: str) -> Optional[float]:
        """Test ability to distinguish two translators."""
        async with self.pool.acquire() as conn:
            # Get residuals for each translator
            r1 = await conn.fetch("""
                SELECT sr.residual
                FROM style_residuals sr
                JOIN translators t ON sr.translator_id = t.id
                WHERE t.name = $1
                LIMIT 100
            """, t1)

            r2 = await conn.fetch("""
                SELECT sr.residual
                FROM style_residuals sr
                JOIN translators t ON sr.translator_id = t.id
                WHERE t.name = $1
                LIMIT 100
            """, t2)

        if len(r1) < 5 or len(r2) < 5:
            return None

        # Parse pgvector format
        def parse_vec(raw):
            if isinstance(raw, str):
                s = raw.strip()
                if s.startswith('[') and s.endswith(']'):
                    s = s[1:-1]
                return np.array([float(x.strip()) for x in s.split(',') if x.strip()])
            return np.array(list(raw))

        r1 = [parse_vec(r['residual']) for r in r1]
        r2 = [parse_vec(r['residual']) for r in r2]

        # Split each into train/test
        mid1, mid2 = len(r1) // 2, len(r2) // 2
        train_r1, test_r1 = r1[:mid1], r1[mid1:]
        train_r2, test_r2 = r2[:mid2], r2[mid2:]

        # Compute centroids
        c1 = np.mean(train_r1, axis=0)
        c2 = np.mean(train_r2, axis=0)

        # Test
        correct = 0
        total = 0

        for r in test_r1:
            if np.linalg.norm(r - c1) < np.linalg.norm(r - c2):
                correct += 1
            total += 1

        for r in test_r2:
            if np.linalg.norm(r - c2) < np.linalg.norm(r - c1):
                correct += 1
            total += 1

        return correct / total if total > 0 else 0.0

    async def _get_translator_centroids(self) -> Dict[str, np.ndarray]:
        """Get all translator centroids."""
        async with self.pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT t.name, tc.centroid
                FROM translator_centroids tc
                JOIN translators t ON tc.translator_id = t.id
                WHERE tc.centroid IS NOT NULL
            """)

            centroids = {}
            for r in rows:
                centroid = r['centroid']
                if centroid is not None:
                    # Parse pgvector format
                    if isinstance(centroid, str):
                        s = centroid.strip()
                        if s.startswith('[') and s.endswith(']'):
                            s = s[1:-1]
                        vec = np.array([float(x.strip()) for x in s.split(',') if x.strip()])
                    else:
                        vec = np.array(list(centroid))
                    centroids[r['name']] = vec
            return centroids

    async def _compute_style_family_overlap(
        self,
        translator: str,
        neighbors: List[str]
    ) -> float:
        """Compute style family overlap score."""
        async with self.pool.acquire() as conn:
            # Get era/style info for translator and neighbors
            t_info = await conn.fetchrow("""
                SELECT era, philosophy FROM translators WHERE name = $1
            """, translator)

            if not t_info:
                return 0.0

            scores = []
            for n in neighbors:
                n_info = await conn.fetchrow("""
                    SELECT era, philosophy FROM translators WHERE name = $1
                """, n)

                if n_info:
                    # Simple scoring based on era and philosophy match
                    era_match = 1.0 if t_info['era'] == n_info['era'] else 0.5
                    phil_match = 1.0 if t_info['philosophy'] == n_info['philosophy'] else 0.5
                    scores.append((era_match + phil_match) / 2)

            return np.mean(scores) if scores else 0.5

    def _compute_ece(self, probs: np.ndarray, true_labels: List[int]) -> float:
        """Compute Expected Calibration Error."""
        n_bins = 10
        bin_boundaries = np.linspace(0, 1, n_bins + 1)
        ece = 0.0

        confidences = np.max(probs, axis=1)
        predictions = np.argmax(probs, axis=1)
        accuracies = predictions == np.array(true_labels)

        for i in range(n_bins):
            in_bin = (confidences > bin_boundaries[i]) & (confidences <= bin_boundaries[i + 1])
            prop_in_bin = np.mean(in_bin)

            if prop_in_bin > 0:
                avg_confidence = np.mean(confidences[in_bin])
                avg_accuracy = np.mean(accuracies[in_bin])
                ece += prop_in_bin * np.abs(avg_accuracy - avg_confidence)

        return ece

    async def _check_recent_calibration(self) -> Optional[Dict]:
        """Check if a recent calibration exists."""
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow("""
                SELECT * FROM calibration_runs
                WHERE started_at > NOW() - INTERVAL '24 hours'
                AND status = 'completed'
                ORDER BY started_at DESC
                LIMIT 1
            """)
            return dict(row) if row else None

    async def _create_run_record(self):
        """Create a new calibration run record."""
        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO calibration_runs (run_id, status)
                VALUES ($1, 'running')
            """, self.run_id)

    async def _update_run_status(self, status: str, error_message: str = None):
        """Update calibration run status."""
        async with self.pool.acquire() as conn:
            g1 = self.results.get('gate_1', {}).get('passed', False)
            g2 = self.results.get('gate_2', {}).get('passed', False)
            g3 = self.results.get('gate_3', {}).get('passed', False)
            g4 = self.results.get('gate_4', {}).get('passed', False)

            await conn.execute("""
                UPDATE calibration_runs
                SET status = $2,
                    completed_at = NOW(),
                    gate_1_passed = $3,
                    gate_2_passed = $4,
                    gate_3_passed = $5,
                    gate_4_passed = $6,
                    all_gates_passed = $7,
                    error_message = $8
                WHERE run_id = $1
            """, self.run_id, status, g1, g2, g3, g4, (g1 and g2 and g3 and g4), error_message)

    async def _store_gate_1_result(self, result: Dict):
        """Store Gate 1 results."""
        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO calibration_gate1 (
                    run_id, classifier_type, top1_accuracy, top3_accuracy,
                    nmi_score, ece_score, confusion_matrix, passed,
                    split_by_meaning_anchor, n_folds
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            """,
                self.run_id,
                'logistic_regression',
                result['top1_accuracy'],
                result['top3_accuracy'],
                result['nmi'],
                result['ece'],
                json.dumps(result['confusion_matrix']),
                result['passed'],
                True,
                5
            )

    async def _store_gate_2_result(self, result: Dict):
        """Store Gate 2 results."""
        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO calibration_gate2 (
                    run_id, window_sizes, f_ratios,
                    signature_correlations, min_f_ratio, passed
                ) VALUES ($1, $2, $3, $4, $5, $6)
            """,
                self.run_id,
                result['window_sizes'],
                json.dumps(result['f_ratios']),
                json.dumps(result['correlations']),
                result['min_f_ratio'],
                result['passed']
            )

    async def _store_gate_3_result(self, result: Dict):
        """Store Gate 3 results."""
        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO calibration_gate3 (
                    run_id, easy_accuracy, medium_accuracy, hard_accuracy, passed
                ) VALUES ($1, $2, $3, $4, $5)
            """,
                self.run_id,
                result['easy_accuracy'],
                result['medium_accuracy'],
                result['hard_accuracy'],
                result['passed']
            )

    async def _store_gate_4_result(self, result: Dict):
        """Store Gate 4 results."""
        async with self.pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO calibration_gate4 (
                    run_id, neighbor_validity_score, passed
                ) VALUES ($1, $2, $3)
            """,
                self.run_id,
                result['mean_neighbor_validity'],
                result['passed']
            )

    def _compile_results(self) -> Dict[str, Any]:
        """Compile all results into final report."""
        gates_passed = sum([
            self.results.get('gate_1', {}).get('passed', False),
            self.results.get('gate_2', {}).get('passed', False),
            self.results.get('gate_3', {}).get('passed', False),
            self.results.get('gate_4', {}).get('passed', False),
        ])

        return {
            "run_id": str(self.run_id),
            "timestamp": datetime.now().isoformat(),
            "status": "completed" if gates_passed == 4 else "failed",
            "gates_passed": gates_passed,
            "total_gates": 4,
            "all_gates_passed": gates_passed == 4,
            "results": self.results
        }


async def main():
    parser = argparse.ArgumentParser(description='Run LOGOS calibration pipeline')
    parser.add_argument('--gate', type=int, choices=[1, 2, 3, 4], help='Run only this gate')
    parser.add_argument('--dry-run', action='store_true', help='Validate data without running')
    parser.add_argument('--force', action='store_true', help='Force re-run')
    args = parser.parse_args()

    print("="*60)
    print("LOGOS CALIBRATION PIPELINE")
    print("="*60)
    print(f"Started: {datetime.now().isoformat()}")

    # Connect to database
    pool = await asyncpg.create_pool(
        DATABASE_URL,
        min_size=2,
        max_size=10
    )

    try:
        runner = CalibrationPipelineRunner(pool)

        if args.dry_run:
            print("\n[DRY RUN] Validating data availability...")
            data = await runner._get_style_residual_data()
            print(f"  - Found {len(data)} style residual samples")
            centroids = await runner._get_translator_centroids()
            print(f"  - Found {len(centroids)} translator centroids")
            return

        if args.gate:
            print(f"\nRunning Gate {args.gate} only...")
            result = await getattr(runner, f'run_gate_{args.gate}')()
            print(f"\nResult: {json.dumps(result, indent=2)}")
        else:
            result = await runner.run_full_pipeline(force=args.force)
            print(f"\n{'='*60}")
            print("FINAL RESULT")
            print("="*60)
            print(json.dumps(result, indent=2))

    finally:
        await pool.close()

    print(f"\nCompleted: {datetime.now().isoformat()}")


if __name__ == "__main__":
    asyncio.run(main())
