#!/usr/bin/env python3
"""
Phase 6: Paper Hardening Deliverables

Generates:
1. Ablation table - drop each feature family to show contribution
2. Precision-recall curve with operating point
3. Paper-ready summary statistics
"""
import pickle
import json
import numpy as np
from datetime import datetime
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import (
    f1_score, precision_score, recall_score,
    precision_recall_curve, average_precision_score,
    confusion_matrix, classification_report
)
import warnings
warnings.filterwarnings('ignore')

try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    HAS_MATPLOTLIB = True
except ImportError:
    HAS_MATPLOTLIB = False
    print("Note: matplotlib not available, skipping figures")

DATA_DIR = '/Users/royvaid/Downloads/logos/data'
PAPERS_DIR = '/Users/royvaid/Downloads/logos/papers'

# Feature family definitions (based on typical stylometric features)
FEATURE_FAMILIES = {
    'function_words': (0, 50),      # Function word frequencies
    'sentence_structure': (50, 60), # Sentence length, complexity
    'vocabulary': (60, 75),         # Vocabulary richness metrics
    'rhythm': (75, 90),             # Prosodic/rhythmic features
    'syntax': (90, 105),            # Syntactic patterns
}


def load_artifact(path):
    with open(path, 'rb') as f:
        return pickle.load(f)


def run_ablation_study(X, y, feature_names=None):
    """Drop each feature family and measure F1 drop."""
    print("\n" + "=" * 70)
    print("ABLATION STUDY: Feature Family Contributions")
    print("=" * 70)

    scaler = StandardScaler()
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    # Full model baseline
    X_scaled = scaler.fit_transform(X)
    full_f1 = np.mean(cross_val_score(clf, X_scaled, y, cv=cv, scoring='f1'))
    full_precision = np.mean(cross_val_score(clf, X_scaled, y, cv=cv, scoring='precision'))
    full_recall = np.mean(cross_val_score(clf, X_scaled, y, cv=cv, scoring='recall'))

    print(f"\nBaseline (all features): F1={full_f1:.3f}, P={full_precision:.3f}, R={full_recall:.3f}")

    ablation_results = {
        'baseline': {
            'f1': float(full_f1),
            'precision': float(full_precision),
            'recall': float(full_recall),
            'n_features': X.shape[1]
        },
        'ablations': {}
    }

    n_features = X.shape[1]

    # Adjust feature families to actual feature count
    adjusted_families = {}
    for name, (start, end) in FEATURE_FAMILIES.items():
        if start < n_features:
            adjusted_end = min(end, n_features)
            adjusted_families[name] = (start, adjusted_end)

    print(f"\nFeature families (adjusted for {n_features} total features):")
    for name, (start, end) in adjusted_families.items():
        print(f"  {name}: features {start}-{end} ({end-start} features)")

    print("\n" + "-" * 70)
    print(f"{'Family':<25} {'F1 w/o':<10} {'ΔF1':<10} {'Contribution':<15}")
    print("-" * 70)

    for family_name, (start, end) in adjusted_families.items():
        # Create mask to exclude this family
        mask = np.ones(n_features, dtype=bool)
        mask[start:end] = False

        X_ablated = X[:, mask]
        X_ablated_scaled = scaler.fit_transform(X_ablated)

        ablated_f1 = np.mean(cross_val_score(clf, X_ablated_scaled, y, cv=cv, scoring='f1'))
        delta_f1 = full_f1 - ablated_f1
        contribution = (delta_f1 / full_f1) * 100 if full_f1 > 0 else 0

        print(f"{family_name:<25} {ablated_f1:<10.3f} {delta_f1:<10.3f} {contribution:>6.1f}%")

        ablation_results['ablations'][family_name] = {
            'f1_without': float(ablated_f1),
            'delta_f1': float(delta_f1),
            'contribution_pct': float(contribution),
            'feature_range': [start, end]
        }

    # Also test: only function words
    if 'function_words' in adjusted_families:
        fw_start, fw_end = adjusted_families['function_words']
        X_fw = X[:, fw_start:fw_end]
        X_fw_scaled = scaler.fit_transform(X_fw)
        fw_only_f1 = np.mean(cross_val_score(clf, X_fw_scaled, y, cv=cv, scoring='f1'))
        print(f"\n{'Function words only':<25} {fw_only_f1:<10.3f}")
        ablation_results['function_words_only_f1'] = float(fw_only_f1)

    return ablation_results


def generate_precision_recall_curve(X, y):
    """Generate precision-recall curve with operating point."""
    print("\n" + "=" * 70)
    print("PRECISION-RECALL CURVE")
    print("=" * 70)

    scaler = StandardScaler()
    clf = RandomForestClassifier(n_estimators=100, random_state=42)

    # Use cross-validation to get out-of-fold predictions
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    y_proba_all = np.zeros(len(y))

    for train_idx, test_idx in cv.split(X, y):
        X_train, X_test = X[train_idx], X[test_idx]
        y_train = y[train_idx]

        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        clf.fit(X_train_scaled, y_train)
        y_proba_all[test_idx] = clf.predict_proba(X_test_scaled)[:, 1]

    # Calculate P-R curve
    precision, recall, thresholds = precision_recall_curve(y, y_proba_all)
    avg_precision = average_precision_score(y, y_proba_all)

    # Find operating points
    operating_points = []
    for target_precision in [0.80, 0.85, 0.90, 0.95]:
        valid_idx = np.where(precision >= target_precision)[0]
        if len(valid_idx) > 0:
            idx = valid_idx[np.argmax(recall[valid_idx])]
            op = {
                'target_precision': target_precision,
                'achieved_precision': float(precision[idx]),
                'recall': float(recall[idx]),
                'threshold': float(thresholds[idx]) if idx < len(thresholds) else 1.0
            }
            operating_points.append(op)
            print(f"At P≥{target_precision:.0%}: threshold={op['threshold']:.3f}, "
                  f"P={op['achieved_precision']:.3f}, R={op['recall']:.3f}")

    # Default operating point (threshold=0.5)
    y_pred = (y_proba_all >= 0.5).astype(int)
    default_p = precision_score(y, y_pred)
    default_r = recall_score(y, y_pred)
    default_f1 = f1_score(y, y_pred)

    print(f"\nDefault (τ=0.5): P={default_p:.3f}, R={default_r:.3f}, F1={default_f1:.3f}")
    print(f"Average Precision (AP): {avg_precision:.3f}")

    pr_results = {
        'precision': precision.tolist(),
        'recall': recall.tolist(),
        'thresholds': thresholds.tolist(),
        'average_precision': float(avg_precision),
        'operating_points': operating_points,
        'default_threshold': {
            'threshold': 0.5,
            'precision': float(default_p),
            'recall': float(default_r),
            'f1': float(default_f1)
        }
    }

    # Generate figure if matplotlib available
    if HAS_MATPLOTLIB:
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.plot(recall, precision, 'b-', linewidth=2, label=f'P-R curve (AP={avg_precision:.3f})')
        ax.scatter([default_r], [default_p], color='red', s=100, zorder=5,
                   label=f'τ=0.5 (P={default_p:.2f}, R={default_r:.2f})')

        # Mark other operating points
        for op in operating_points:
            ax.scatter([op['recall']], [op['achieved_precision']],
                       marker='x', s=80, alpha=0.7)

        ax.set_xlabel('Recall', fontsize=12)
        ax.set_ylabel('Precision', fontsize=12)
        ax.set_title('Q Source Classification: Precision-Recall Curve', fontsize=14)
        ax.legend(loc='lower left')
        ax.grid(True, alpha=0.3)
        ax.set_xlim([0, 1.05])
        ax.set_ylim([0, 1.05])

        fig_path = f'{PAPERS_DIR}/precision_recall_curve.png'
        plt.savefig(fig_path, dpi=150, bbox_inches='tight')
        plt.close()
        print(f"\nFigure saved: {fig_path}")
        pr_results['figure_path'] = fig_path

    return pr_results


def generate_summary_statistics(X, y, artifact):
    """Generate paper-ready summary statistics."""
    print("\n" + "=" * 70)
    print("SUMMARY STATISTICS FOR PUBLICATION")
    print("=" * 70)

    scaler = StandardScaler()
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    X_scaled = scaler.fit_transform(X)

    # Cross-validation metrics
    f1_scores = cross_val_score(clf, X_scaled, y, cv=cv, scoring='f1')
    precision_scores = cross_val_score(clf, X_scaled, y, cv=cv, scoring='precision')
    recall_scores = cross_val_score(clf, X_scaled, y, cv=cv, scoring='recall')
    accuracy_scores = cross_val_score(clf, X_scaled, y, cv=cv, scoring='accuracy')

    # Train final model for predictions
    clf.fit(X_scaled, y)
    y_pred = clf.predict(X_scaled)
    y_proba = clf.predict_proba(X_scaled)[:, 1]

    # Confusion matrix
    tn, fp, fn, tp = confusion_matrix(y, y_pred).ravel()

    # Q-specific statistics
    q_passages = artifact['data'].get('q_passages', [])
    mark_passages = artifact['data'].get('mark_passages', [])

    q_confidences = [p.get('q_probability', y_proba[i]) for i, p in enumerate(q_passages)]

    summary = {
        'dataset': {
            'total_passages': len(y),
            'q_passages': int(sum(y)),
            'mark_passages': int(len(y) - sum(y)),
            'class_balance': float(sum(y) / len(y))
        },
        'cross_validation': {
            'f1_mean': float(np.mean(f1_scores)),
            'f1_std': float(np.std(f1_scores)),
            'f1_95ci': [float(np.mean(f1_scores) - 1.96*np.std(f1_scores)),
                        float(np.mean(f1_scores) + 1.96*np.std(f1_scores))],
            'precision_mean': float(np.mean(precision_scores)),
            'precision_std': float(np.std(precision_scores)),
            'recall_mean': float(np.mean(recall_scores)),
            'recall_std': float(np.std(recall_scores)),
            'accuracy_mean': float(np.mean(accuracy_scores)),
            'accuracy_std': float(np.std(accuracy_scores))
        },
        'confusion_matrix': {
            'true_positive': int(tp),
            'true_negative': int(tn),
            'false_positive': int(fp),
            'false_negative': int(fn),
            'sensitivity': float(tp / (tp + fn)) if (tp + fn) > 0 else 0,
            'specificity': float(tn / (tn + fp)) if (tn + fp) > 0 else 0
        },
        'q_reconstruction': {
            'n_passages': len(q_passages),
            'mean_confidence': float(np.mean(q_confidences)) if q_confidences else 0,
            'median_confidence': float(np.median(q_confidences)) if q_confidences else 0,
            'high_confidence_count': int(sum(1 for c in q_confidences if c >= 0.7)),
            'high_confidence_pct': float(sum(1 for c in q_confidences if c >= 0.7) / len(q_confidences) * 100) if q_confidences else 0
        }
    }

    print(f"\n--- Dataset ---")
    print(f"Total passages: {summary['dataset']['total_passages']}")
    print(f"Q passages: {summary['dataset']['q_passages']} ({summary['dataset']['class_balance']*100:.1f}%)")
    print(f"Mark passages: {summary['dataset']['mark_passages']}")

    print(f"\n--- Cross-Validation Performance ---")
    print(f"F1 Score: {summary['cross_validation']['f1_mean']:.3f} ± {summary['cross_validation']['f1_std']:.3f}")
    print(f"Precision: {summary['cross_validation']['precision_mean']:.3f} ± {summary['cross_validation']['precision_std']:.3f}")
    print(f"Recall: {summary['cross_validation']['recall_mean']:.3f} ± {summary['cross_validation']['recall_std']:.3f}")
    print(f"Accuracy: {summary['cross_validation']['accuracy_mean']:.3f} ± {summary['cross_validation']['accuracy_std']:.3f}")

    print(f"\n--- Confusion Matrix ---")
    print(f"TP={tp}, TN={tn}, FP={fp}, FN={fn}")
    print(f"Sensitivity (TPR): {summary['confusion_matrix']['sensitivity']:.3f}")
    print(f"Specificity (TNR): {summary['confusion_matrix']['specificity']:.3f}")

    print(f"\n--- Q Reconstruction ---")
    print(f"Passages identified: {summary['q_reconstruction']['n_passages']}")
    print(f"Mean confidence: {summary['q_reconstruction']['mean_confidence']:.3f}")
    print(f"High confidence (≥70%): {summary['q_reconstruction']['high_confidence_count']} ({summary['q_reconstruction']['high_confidence_pct']:.1f}%)")

    return summary


def generate_paper_ready_table(ablation_results, summary):
    """Generate LaTeX-ready tables for paper."""
    tables = {}

    # Table 1: Model Performance
    perf = summary['cross_validation']
    table1 = f"""
\\begin{{table}}[h]
\\centering
\\caption{{Q Source Classification Performance (5-fold CV)}}
\\begin{{tabular}}{{lcc}}
\\hline
\\textbf{{Metric}} & \\textbf{{Mean}} & \\textbf{{Std}} \\\\
\\hline
F1 Score & {perf['f1_mean']:.3f} & {perf['f1_std']:.3f} \\\\
Precision & {perf['precision_mean']:.3f} & {perf['precision_std']:.3f} \\\\
Recall & {perf['recall_mean']:.3f} & {perf['recall_std']:.3f} \\\\
Accuracy & {perf['accuracy_mean']:.3f} & {perf['accuracy_std']:.3f} \\\\
\\hline
\\end{{tabular}}
\\label{{tab:performance}}
\\end{{table}}
"""
    tables['performance'] = table1

    # Table 2: Ablation Study
    ablations = ablation_results['ablations']
    ablation_rows = []
    for family, data in sorted(ablations.items(), key=lambda x: -x[1]['contribution_pct']):
        ablation_rows.append(
            f"{family.replace('_', ' ').title()} & {data['f1_without']:.3f} & "
            f"{data['delta_f1']:.3f} & {data['contribution_pct']:.1f}\\%"
        )

    table2 = f"""
\\begin{{table}}[h]
\\centering
\\caption{{Feature Family Ablation Study}}
\\begin{{tabular}}{{lccc}}
\\hline
\\textbf{{Feature Family}} & \\textbf{{F1 w/o}} & \\textbf{{$\\Delta$F1}} & \\textbf{{Contrib.}} \\\\
\\hline
All Features & {ablation_results['baseline']['f1']:.3f} & --- & 100\\% \\\\
\\hline
{chr(10).join(ablation_rows)} \\\\
\\hline
\\end{{tabular}}
\\label{{tab:ablation}}
\\end{{table}}
"""
    tables['ablation'] = table2

    return tables


def main():
    print("=" * 70)
    print("PHASE 6: PAPER HARDENING DELIVERABLES")
    print("=" * 70)
    print(f"Timestamp: {datetime.now().isoformat()}")

    # Load artifact
    artifact_path = list(Path(DATA_DIR).glob('synoptic_canonical_*.pkl'))[0]
    artifact = load_artifact(artifact_path)
    print(f"\nLoaded: {artifact_path.name}")

    # Extract data
    X_list, y_list = [], []
    for item in artifact['data'].get('q_passages', []):
        X_list.append(item['features'])
        y_list.append(1)
    for item in artifact['data'].get('mark_passages', []):
        X_list.append(item['features'])
        y_list.append(0)

    X = np.array(X_list)
    y = np.array(y_list)

    print(f"Dataset: {len(X)} samples ({sum(y)} Q, {len(y)-sum(y)} Mark)")
    print(f"Features: {X.shape[1]}")

    # Run all analyses
    ablation_results = run_ablation_study(X, y)
    pr_results = generate_precision_recall_curve(X, y)
    summary = generate_summary_statistics(X, y, artifact)
    tables = generate_paper_ready_table(ablation_results, summary)

    # Compile all results
    results = {
        'timestamp': datetime.now().isoformat(),
        'artifact': artifact_path.name,
        'ablation': ablation_results,
        'precision_recall': pr_results,
        'summary': summary,
        'latex_tables': tables
    }

    # Save results
    Path(PAPERS_DIR).mkdir(parents=True, exist_ok=True)

    json_path = f'{PAPERS_DIR}/PAPER_HARDENING_RESULTS.json'
    with open(json_path, 'w') as f:
        # Remove non-serializable items
        results_clean = {k: v for k, v in results.items() if k != 'precision_recall'}
        results_clean['precision_recall'] = {
            'average_precision': pr_results['average_precision'],
            'operating_points': pr_results['operating_points'],
            'default_threshold': pr_results['default_threshold']
        }
        json.dump(results_clean, f, indent=2)

    # Generate markdown report
    md_path = f'{PAPERS_DIR}/PAPER_HARDENING_RESULTS.md'
    with open(md_path, 'w') as f:
        f.write("# Phase 6: Paper Hardening Results\n\n")
        f.write(f"**Generated:** {results['timestamp']}\n\n")

        f.write("## Model Performance (5-fold CV)\n\n")
        f.write("| Metric | Mean | Std |\n")
        f.write("|:-------|:----:|:---:|\n")
        perf = summary['cross_validation']
        f.write(f"| F1 Score | {perf['f1_mean']:.3f} | {perf['f1_std']:.3f} |\n")
        f.write(f"| Precision | {perf['precision_mean']:.3f} | {perf['precision_std']:.3f} |\n")
        f.write(f"| Recall | {perf['recall_mean']:.3f} | {perf['recall_std']:.3f} |\n")
        f.write(f"| Accuracy | {perf['accuracy_mean']:.3f} | {perf['accuracy_std']:.3f} |\n\n")

        f.write("## Feature Family Ablation\n\n")
        f.write("| Family | F1 w/o | ΔF1 | Contribution |\n")
        f.write("|:-------|:------:|:---:|:------------:|\n")
        f.write(f"| All Features | {ablation_results['baseline']['f1']:.3f} | --- | 100% |\n")
        for family, data in sorted(ablation_results['ablations'].items(),
                                   key=lambda x: -x[1]['contribution_pct']):
            f.write(f"| {family.replace('_', ' ').title()} | {data['f1_without']:.3f} | "
                    f"{data['delta_f1']:.3f} | {data['contribution_pct']:.1f}% |\n")
        f.write("\n")

        f.write("## Operating Points\n\n")
        f.write("| Target Precision | Threshold | Achieved P | Recall |\n")
        f.write("|:-----------------|:---------:|:----------:|:------:|\n")
        for op in pr_results['operating_points']:
            f.write(f"| {op['target_precision']:.0%} | {op['threshold']:.3f} | "
                    f"{op['achieved_precision']:.3f} | {op['recall']:.3f} |\n")
        f.write(f"| Default | 0.500 | {pr_results['default_threshold']['precision']:.3f} | "
                f"{pr_results['default_threshold']['recall']:.3f} |\n\n")

        f.write("## Key Claims for Publication\n\n")
        f.write(f"1. **Primary Result:** F1 = {perf['f1_mean']:.3f} ± {perf['f1_std']:.3f} "
                f"(5-fold CV, n={summary['dataset']['total_passages']})\n\n")
        f.write(f"2. **Q Reconstruction:** {summary['q_reconstruction']['n_passages']} passages, "
                f"mean confidence {summary['q_reconstruction']['mean_confidence']:.1%}\n\n")
        f.write(f"3. **High-Confidence Subset:** {summary['q_reconstruction']['high_confidence_count']} passages "
                f"({summary['q_reconstruction']['high_confidence_pct']:.1f}%) exceed 70% confidence\n\n")
        f.write(f"4. **Feature Importance:** Function words contribute "
                f"{ablation_results['ablations'].get('function_words', {}).get('contribution_pct', 0):.1f}% of discriminative power\n\n")

        f.write("---\n\n")
        f.write("*Generated by paper_hardening.py*\n")

    print("\n" + "=" * 70)
    print("PHASE 6 COMPLETE")
    print("=" * 70)
    print(f"\nResults saved to:")
    print(f"  {json_path}")
    print(f"  {md_path}")
    if HAS_MATPLOTLIB:
        print(f"  {PAPERS_DIR}/precision_recall_curve.png")

    return results


if __name__ == "__main__":
    main()
