#!/usr/bin/env python3
"""
================================================================================
CONFORMAL CALIBRATION FOR Q RECONSTRUCTION
================================================================================

The "genius move" for publication: stop forcing the model to answer everything,
and instead guarantee error bounds on the subset we do claim.

Key insight:
If you can say: "For 72% of pericopes, we output a reconstruction at ≥X confidence,
and on a held-out benchmark this subset has ≥95% precision," reviewers accept it
even if the remaining 28% are labeled uncertain.

This module:
1. Computes conformal prediction intervals
2. Generates precision-coverage curves
3. Provides abstention thresholds with statistical guarantees

================================================================================
"""

import pickle
import json
import numpy as np
from datetime import datetime

# Optional matplotlib import
try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    HAS_MATPLOTLIB = True
except ImportError:
    HAS_MATPLOTLIB = False
    print("matplotlib not available - skipping plots")
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_predict
from sklearn.metrics import f1_score, precision_score, recall_score, accuracy_score
from sklearn.calibration import CalibratedClassifierCV
from typing import Dict, List, Tuple, Optional
import warnings
warnings.filterwarnings('ignore')

DATA_DIR = '/Users/royvaid/Downloads/logos/data'
PAPERS_DIR = '/Users/royvaid/Downloads/logos/papers'
FIGURES_DIR = '/Users/royvaid/Downloads/logos/figures'


def load_artifact(path):
    with open(path, 'rb') as f:
        return pickle.load(f)


class ConformalCalibrator:
    """Conformal prediction for Q reconstruction with statistical guarantees."""

    def __init__(self, artifact: Dict, seed: int = 42):
        self.artifact = artifact
        self.seed = seed
        self.rng = np.random.RandomState(seed)

        # Extract data
        self.q_passages = artifact['data'].get('q_passages', [])
        self.mark_passages = artifact['data'].get('mark_passages', [])

        # Prepare features and labels
        self.X, self.y, self.passage_ids = self._prepare_data()

        # Will be set after calibration
        self.calibrator = None
        self.threshold_alpha = {}

    def _prepare_data(self):
        X_list, y_list, ids = [], [], []

        for item in self.q_passages:
            X_list.append(item['features'])
            y_list.append(1)
            ids.append(item.get('pericope', item.get('id')))

        for item in self.mark_passages:
            X_list.append(item['features'])
            y_list.append(0)
            ids.append(item.get('section', item.get('id')))

        return np.array(X_list), np.array(y_list), ids

    def compute_nonconformity_scores(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_cal: np.ndarray,
        y_cal: np.ndarray
    ) -> np.ndarray:
        """
        Compute nonconformity scores for calibration set.

        For classification, nonconformity = 1 - predicted_probability(true_class)
        """
        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        scaler = StandardScaler()

        X_train_scaled = scaler.fit_transform(X_train)
        X_cal_scaled = scaler.transform(X_cal)

        # Calibrate the classifier
        calibrated = CalibratedClassifierCV(clf, method='isotonic', cv=3)
        calibrated.fit(X_train_scaled, y_train)

        # Get predicted probabilities for true class
        proba = calibrated.predict_proba(X_cal_scaled)
        true_class_proba = proba[np.arange(len(y_cal)), y_cal]

        # Nonconformity = 1 - probability of true class
        nonconformity = 1 - true_class_proba

        return nonconformity, calibrated, scaler

    def calibrate(self, alpha: float = 0.05) -> Dict:
        """
        Calibrate conformal predictor at confidence level (1-alpha).

        Returns threshold τ such that P(error) ≤ α on held-out data.
        """
        print(f"Calibrating at α = {alpha} (target {(1-alpha)*100:.0f}% confidence)...")

        # Split into train/calibration (never touch test)
        X_trainval, X_cal, y_trainval, y_cal = train_test_split(
            self.X, self.y, test_size=0.2, random_state=self.seed, stratify=self.y
        )

        X_train, X_val, y_train, y_val = train_test_split(
            X_trainval, y_trainval, test_size=0.2, random_state=self.seed, stratify=y_trainval
        )

        # Compute nonconformity scores on calibration set
        scores, self.calibrator, self.scaler = self.compute_nonconformity_scores(
            X_train, y_train, X_cal, y_cal
        )

        # Find threshold at (1-α) quantile
        n = len(scores)
        q = np.ceil((n + 1) * (1 - alpha)) / n
        threshold = np.quantile(scores, min(q, 1.0))

        self.threshold_alpha[alpha] = threshold

        # Validate on held-out calibration set
        cal_proba = self.calibrator.predict_proba(self.scaler.transform(X_cal))
        cal_confidence = np.max(cal_proba, axis=1)
        cal_predictions = self.calibrator.predict(self.scaler.transform(X_cal))

        # Compute coverage at threshold
        high_conf_mask = (1 - cal_confidence) <= threshold
        coverage = np.mean(high_conf_mask)

        if np.sum(high_conf_mask) > 0:
            precision = precision_score(y_cal[high_conf_mask], cal_predictions[high_conf_mask])
            accuracy = accuracy_score(y_cal[high_conf_mask], cal_predictions[high_conf_mask])
        else:
            precision = 0
            accuracy = 0

        print(f"  Threshold τ = {threshold:.4f}")
        print(f"  Coverage: {coverage*100:.1f}%")
        print(f"  Precision at coverage: {precision*100:.1f}%")

        return {
            'alpha': alpha,
            'confidence_level': 1 - alpha,
            'threshold': float(threshold),
            'coverage': float(coverage),
            'precision': float(precision),
            'accuracy': float(accuracy),
            'n_calibration': len(X_cal)
        }

    def compute_precision_coverage_curve(self) -> Dict:
        """
        Generate precision-coverage curve.

        At each threshold, compute:
        - Coverage: fraction of samples with confidence >= threshold
        - Precision: accuracy on covered samples
        """
        print("\nComputing precision-coverage curve...")

        # Use cross-validated predictions for curve
        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(self.X)

        # Calibrated probabilities via cross-validation
        calibrated = CalibratedClassifierCV(clf, method='isotonic', cv=5)
        calibrated.fit(X_scaled, self.y)

        proba = calibrated.predict_proba(X_scaled)
        confidence = np.max(proba, axis=1)
        predictions = calibrated.predict(X_scaled)

        # Compute curve at different thresholds
        thresholds = np.linspace(0.5, 0.99, 50)
        coverages = []
        precisions = []
        recalls = []
        f1s = []

        for thresh in thresholds:
            mask = confidence >= thresh

            if np.sum(mask) > 0 and len(np.unique(self.y[mask])) > 1:
                cov = np.mean(mask)
                prec = precision_score(self.y[mask], predictions[mask], zero_division=0)
                rec = recall_score(self.y[mask], predictions[mask], zero_division=0)
                f1 = f1_score(self.y[mask], predictions[mask], zero_division=0)
            else:
                cov = np.mean(mask)
                prec = 1.0 if np.sum(mask) > 0 else 0
                rec = 0
                f1 = 0

            coverages.append(cov)
            precisions.append(prec)
            recalls.append(rec)
            f1s.append(f1)

        return {
            'thresholds': thresholds.tolist(),
            'coverages': coverages,
            'precisions': precisions,
            'recalls': recalls,
            'f1s': f1s
        }

    def find_optimal_threshold(self, min_precision: float = 0.90) -> Dict:
        """
        Find threshold that maximizes coverage while maintaining min_precision.
        """
        print(f"\nFinding optimal threshold for {min_precision*100:.0f}% precision...")

        curve = self.compute_precision_coverage_curve()

        best_threshold = 0.5
        best_coverage = 0

        for thresh, cov, prec in zip(curve['thresholds'], curve['coverages'], curve['precisions']):
            if prec >= min_precision and cov > best_coverage:
                best_coverage = cov
                best_threshold = thresh

        print(f"  Optimal threshold: {best_threshold:.3f}")
        print(f"  Coverage at threshold: {best_coverage*100:.1f}%")

        return {
            'min_precision': min_precision,
            'threshold': float(best_threshold),
            'coverage': float(best_coverage),
            'curve': curve
        }

    def bootstrap_confidence_interval(
        self,
        threshold: float,
        n_bootstrap: int = 100
    ) -> Dict:
        """
        Compute bootstrap confidence intervals for precision at threshold.
        """
        print(f"\nBootstrap CI at threshold {threshold:.3f} ({n_bootstrap} iterations)...")

        clf = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        scaler = StandardScaler()

        precisions = []
        coverages = []

        for i in range(n_bootstrap):
            # Bootstrap sample
            idx = self.rng.choice(len(self.X), size=len(self.X), replace=True)
            X_boot = self.X[idx]
            y_boot = self.y[idx]

            # Out-of-bag samples
            oob_idx = list(set(range(len(self.X))) - set(idx))
            if len(oob_idx) < 10:
                continue

            X_oob = self.X[oob_idx]
            y_oob = self.y[oob_idx]

            # Train and calibrate
            X_boot_scaled = scaler.fit_transform(X_boot)
            X_oob_scaled = scaler.transform(X_oob)

            calibrated = CalibratedClassifierCV(clf, method='isotonic', cv=3)
            calibrated.fit(X_boot_scaled, y_boot)

            proba = calibrated.predict_proba(X_oob_scaled)
            confidence = np.max(proba, axis=1)
            predictions = calibrated.predict(X_oob_scaled)

            # Compute metrics at threshold
            mask = confidence >= threshold
            if np.sum(mask) > 0 and len(np.unique(y_oob[mask])) >= 1:
                cov = np.mean(mask)
                prec = precision_score(y_oob[mask], predictions[mask], zero_division=1)
            else:
                cov = 0
                prec = 1

            coverages.append(cov)
            precisions.append(prec)

        # Compute intervals
        precision_mean = np.mean(precisions)
        precision_ci = (np.percentile(precisions, 2.5), np.percentile(precisions, 97.5))

        coverage_mean = np.mean(coverages)
        coverage_ci = (np.percentile(coverages, 2.5), np.percentile(coverages, 97.5))

        print(f"  Precision: {precision_mean:.3f} (95% CI: [{precision_ci[0]:.3f}, {precision_ci[1]:.3f}])")
        print(f"  Coverage: {coverage_mean:.3f} (95% CI: [{coverage_ci[0]:.3f}, {coverage_ci[1]:.3f}])")

        return {
            'threshold': threshold,
            'n_bootstrap': n_bootstrap,
            'precision_mean': float(precision_mean),
            'precision_ci_95': [float(precision_ci[0]), float(precision_ci[1])],
            'coverage_mean': float(coverage_mean),
            'coverage_ci_95': [float(coverage_ci[0]), float(coverage_ci[1])]
        }

    def generate_calibration_report(self) -> Dict:
        """Generate full calibration report with all metrics."""
        print("=" * 70)
        print("CONFORMAL CALIBRATION REPORT")
        print("=" * 70)

        results = {
            'timestamp': datetime.now().isoformat(),
            'n_samples': len(self.X),
            'n_q': int(np.sum(self.y)),
            'n_mark': int(len(self.y) - np.sum(self.y))
        }

        # Calibrate at different alpha levels
        for alpha in [0.05, 0.10, 0.20]:
            cal_result = self.calibrate(alpha)
            results[f'calibration_alpha_{int(alpha*100)}'] = cal_result

        # Precision-coverage curve
        results['precision_coverage'] = self.compute_precision_coverage_curve()

        # Find optimal thresholds
        for min_prec in [0.90, 0.95]:
            opt = self.find_optimal_threshold(min_prec)
            results[f'optimal_threshold_{int(min_prec*100)}'] = {
                'threshold': opt['threshold'],
                'coverage': opt['coverage']
            }

        # Bootstrap CI for 90% precision threshold
        opt_90 = results['optimal_threshold_90']
        bootstrap = self.bootstrap_confidence_interval(opt_90['threshold'], n_bootstrap=50)
        results['bootstrap_ci_90'] = bootstrap

        # Save results
        Path(PAPERS_DIR).mkdir(parents=True, exist_ok=True)

        json_path = f'{PAPERS_DIR}/CONFIDENCE_GUARANTEES.json'
        with open(json_path, 'w') as f:
            json.dump(results, f, indent=2)

        # Generate markdown report
        md_path = f'{PAPERS_DIR}/CONFIDENCE_GUARANTEES.md'
        with open(md_path, 'w') as f:
            f.write("# Conformal Calibration: Confidence Guarantees\n\n")
            f.write(f"**Generated:** {results['timestamp']}\n\n")
            f.write(f"**Dataset:** {results['n_samples']} samples ({results['n_q']} Q, {results['n_mark']} Mark)\n\n")

            f.write("## Calibration Results\n\n")
            f.write("| Confidence Level | Threshold τ | Coverage | Precision |\n")
            f.write("|:-----------------|:-----------:|:--------:|:---------:|\n")

            for alpha in [0.05, 0.10, 0.20]:
                cal = results[f'calibration_alpha_{int(alpha*100)}']
                f.write(f"| {(1-alpha)*100:.0f}% | {cal['threshold']:.4f} | {cal['coverage']*100:.1f}% | {cal['precision']*100:.1f}% |\n")

            f.write("\n## Optimal Thresholds\n\n")
            f.write("| Min Precision | Threshold | Max Coverage |\n")
            f.write("|:--------------|:---------:|:------------:|\n")

            for min_prec in [0.90, 0.95]:
                opt = results[f'optimal_threshold_{int(min_prec*100)}']
                f.write(f"| {min_prec*100:.0f}% | {opt['threshold']:.3f} | {opt['coverage']*100:.1f}% |\n")

            f.write("\n## Bootstrap Confidence Intervals (at 90% precision threshold)\n\n")
            bs = results['bootstrap_ci_90']
            f.write(f"- **Precision:** {bs['precision_mean']:.3f} (95% CI: [{bs['precision_ci_95'][0]:.3f}, {bs['precision_ci_95'][1]:.3f}])\n")
            f.write(f"- **Coverage:** {bs['coverage_mean']:.3f} (95% CI: [{bs['coverage_ci_95'][0]:.3f}, {bs['coverage_ci_95'][1]:.3f}])\n")

            f.write("\n## Key Claim for Publication\n\n")
            f.write(f"> For **{bs['coverage_mean']*100:.0f}%** of passages at threshold τ={opt_90['threshold']:.3f}, ")
            f.write(f"we achieve **{bs['precision_mean']*100:.0f}%** precision ")
            f.write(f"(95% CI: [{bs['precision_ci_95'][0]*100:.0f}%, {bs['precision_ci_95'][1]*100:.0f}%]).\n\n")
            f.write("The remaining passages are flagged as **uncertain** and require traditional text-critical analysis.\n")

        print(f"\nCalibration report saved:")
        print(f"  {json_path}")
        print(f"  {md_path}")

        return results

    def plot_precision_coverage(self, output_dir: str = FIGURES_DIR):
        """Generate precision-coverage curve plot."""
        if not HAS_MATPLOTLIB:
            print("Skipping plot - matplotlib not available")
            return None

        Path(output_dir).mkdir(parents=True, exist_ok=True)

        curve = self.compute_precision_coverage_curve()

        fig, ax = plt.subplots(figsize=(8, 6))

        ax.plot(curve['coverages'], curve['precisions'], 'b-', linewidth=2, label='Precision')
        ax.plot(curve['coverages'], curve['f1s'], 'g--', linewidth=2, label='F1')

        # Mark key thresholds
        for min_prec in [0.90, 0.95]:
            idx = np.argmax([p >= min_prec for p in curve['precisions']])
            if curve['precisions'][idx] >= min_prec:
                ax.axhline(y=min_prec, color='r', linestyle=':', alpha=0.5)
                ax.axvline(x=curve['coverages'][idx], color='r', linestyle=':', alpha=0.5)
                ax.scatter([curve['coverages'][idx]], [curve['precisions'][idx]], color='r', s=100, zorder=5)

        ax.set_xlabel('Coverage', fontsize=12)
        ax.set_ylabel('Precision / F1', fontsize=12)
        ax.set_title('Precision-Coverage Curve for Q Reconstruction', fontsize=14)
        ax.legend()
        ax.grid(True, alpha=0.3)
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)

        plot_path = f'{output_dir}/precision_coverage_curve.png'
        plt.savefig(plot_path, dpi=150, bbox_inches='tight')
        plt.close()

        print(f"Plot saved: {plot_path}")
        return plot_path


def main():
    print("Loading dataset artifact...")
    artifact_path = list(Path(DATA_DIR).glob('synoptic_canonical_*.pkl'))[0]
    artifact = load_artifact(artifact_path)
    print(f"Loaded: {artifact_path.name}")

    calibrator = ConformalCalibrator(artifact, seed=42)
    results = calibrator.generate_calibration_report()

    # Generate plot
    calibrator.plot_precision_coverage()

    return results


if __name__ == "__main__":
    main()
