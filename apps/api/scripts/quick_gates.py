#!/usr/bin/env python3
"""
Quick Gate Runner - Simplified version for testing.
"""
import pickle
import json
import numpy as np
from datetime import datetime
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import f1_score
import warnings
warnings.filterwarnings('ignore')

DATA_DIR = '/Users/royvaid/Downloads/logos/data'
PAPERS_DIR = '/Users/royvaid/Downloads/logos/papers'

THRESHOLDS = {
    'gate_1_margin': 0.10,
    'gate_2_ratio': 0.60,
    'gate_3_confound': 0.10,
    'gate_4_margin': 0.10,
    'gate_5_std': 0.08,
    'gate_6_cv_coeff': 0.20,
    'gate_7_separation': 0.0,
    'gate_8_improvement': 0.0,
    'gate_9_delta': 0.20,
    'gate_10_asymmetry': 0.30,
    'min_f1': 0.50,
}


def load_artifact(path):
    with open(path, 'rb') as f:
        return pickle.load(f)


def run_gates():
    print("=" * 70)
    print("QUICK GATE RUNNER")
    print("=" * 70)

    # Load synoptic artifact
    artifact_path = list(Path(DATA_DIR).glob('synoptic_canonical_*.pkl'))[0]
    artifact = load_artifact(artifact_path)
    print(f"Loaded: {artifact_path.name}")

    # Load Thomas artifact if available
    thomas_artifacts = list(Path(DATA_DIR).glob('thomas_canonical_*.pkl'))
    thomas_data = None
    if thomas_artifacts:
        thomas_artifact = load_artifact(thomas_artifacts[0])
        thomas_data = thomas_artifact['data']
        print(f"Thomas: {thomas_artifacts[0].name}")

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
    rng = np.random.RandomState(42)

    print(f"Dataset: {len(X)} samples ({sum(y)} Q, {len(y)-sum(y)} Mark)")
    print("-" * 70)

    results = {}

    # Gate 1: Label Permutation
    print("Gate 1: Label Permutation...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    real_f1 = np.mean(cross_val_score(clf, X_scaled, y, cv=5, scoring='f1'))
    perm_f1s = [np.mean(cross_val_score(clf, X_scaled, rng.permutation(y), cv=5, scoring='f1')) for _ in range(5)]
    perm_f1 = np.mean(perm_f1s)
    margin = real_f1 - perm_f1
    passed = margin > THRESHOLDS['gate_1_margin']
    results['gate_1'] = {'gate': 'Label Permutation', 'passed': passed, 'margin': margin}
    print(f"  Margin: {margin:.3f}, Pass: {passed}")

    # Gate 2: Topic Holdout
    print("Gate 2: Topic Holdout...")
    n = len(X)
    fold_size = n // 3
    holdout_scores = []
    for fold in range(3):
        start = fold * fold_size
        end = start + fold_size if fold < 2 else n
        test_idx = list(range(start, end))
        train_idx = [i for i in range(n) if i not in test_idx]
        if len(set(y[train_idx])) < 2 or len(set(y[test_idx])) < 2:
            continue
        clf.fit(scaler.fit_transform(X[train_idx]), y[train_idx])
        y_pred = clf.predict(scaler.transform(X[test_idx]))
        if sum(y[test_idx]) > 0:
            holdout_scores.append(f1_score(y[test_idx], y_pred))
    holdout_f1 = np.mean(holdout_scores) if holdout_scores else 0
    ratio = holdout_f1 / real_f1 if real_f1 > 0 else 0
    passed = ratio > THRESHOLDS['gate_2_ratio'] and holdout_f1 > THRESHOLDS['min_f1']
    results['gate_2'] = {'gate': 'Topic Holdout', 'passed': passed, 'ratio': ratio}
    print(f"  Ratio: {ratio:.3f}, Pass: {passed}")

    # Gate 3: Confound Check
    print("Gate 3: Confound Check...")
    X_conf = scaler.fit_transform(X[:, -5:])
    conf_f1 = np.mean(cross_val_score(clf, X_conf, y, cv=5, scoring='f1'))
    improvement = real_f1 - conf_f1
    passed = improvement > THRESHOLDS['gate_3_confound']
    results['gate_3'] = {'gate': 'Confound Check', 'passed': passed, 'improvement': improvement}
    print(f"  Improvement: {improvement:.3f}, Pass: {passed}")

    # Gate 4: Random Features
    print("Gate 4: Random Features...")
    X_rand = scaler.fit_transform(rng.randn(len(X), X.shape[1]))
    rand_f1 = np.mean(cross_val_score(clf, X_rand, y, cv=5, scoring='f1'))
    margin = real_f1 - rand_f1
    passed = margin > THRESHOLDS['gate_4_margin']
    results['gate_4'] = {'gate': 'Random Features', 'passed': passed, 'margin': margin}
    print(f"  Margin: {margin:.3f}, Pass: {passed}")

    # Gate 5: Stability
    print("Gate 5: Stability...")
    run_scores = [np.mean(cross_val_score(RandomForestClassifier(n_estimators=100, random_state=s), X_scaled, y, cv=5, scoring='f1')) for s in range(5)]
    std_f1 = np.std(run_scores)
    passed = std_f1 < THRESHOLDS['gate_5_std'] and np.mean(run_scores) > THRESHOLDS['min_f1']
    results['gate_5'] = {'gate': 'Stability', 'passed': passed, 'std': std_f1}
    print(f"  Std: {std_f1:.3f}, Pass: {passed}")

    # Gate 6: CV Variance
    print("Gate 6: CV Variance...")
    cv = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
    fold_scores = cross_val_score(clf, X_scaled, y, cv=cv, scoring='f1')
    cv_coeff = np.std(fold_scores) / np.mean(fold_scores) if np.mean(fold_scores) > 0 else float('inf')
    passed = cv_coeff < THRESHOLDS['gate_6_cv_coeff'] and np.mean(fold_scores) > THRESHOLDS['min_f1']
    results['gate_6'] = {'gate': 'CV Variance', 'passed': passed, 'cv_coeff': cv_coeff}
    print(f"  CV Coeff: {cv_coeff:.3f}, Pass: {passed}")

    # Gate 7: Out-of-Domain Transfer (Thomas)
    print("Gate 7: Out-of-Domain Transfer...")
    if thomas_data:
        clf.fit(X_scaled, y)
        thomas_features, thomas_labels = [], []
        for item in thomas_data.get('logia', []):
            thomas_features.append(item['features'])
            thomas_labels.append(1 if item['has_q_parallel'] else 0)
        if thomas_features:
            X_thomas = scaler.transform(np.array(thomas_features))
            preds = clf.predict_proba(X_thomas)[:, 1]
            y_t = np.array(thomas_labels)
            has_par = y_t == 1
            if any(has_par) and any(~has_par):
                separation = np.mean(preds[has_par]) - np.mean(preds[~has_par])
                passed = separation > THRESHOLDS['gate_7_separation']
                results['gate_7'] = {'gate': 'Out-of-Domain Transfer', 'passed': passed, 'separation': separation}
                print(f"  Separation: {separation:.3f}, Pass: {passed}")
            else:
                results['gate_7'] = {'gate': 'Out-of-Domain Transfer', 'passed': False, 'reason': 'No variation'}
                print(f"  Skip: No variation")
        else:
            results['gate_7'] = {'gate': 'Out-of-Domain Transfer', 'passed': False, 'reason': 'No Thomas data'}
            print(f"  Skip: No Thomas data")
    else:
        results['gate_7'] = {'gate': 'Out-of-Domain Transfer', 'passed': False, 'reason': 'No Thomas artifact'}
        print(f"  Skip: No Thomas artifact")

    # Gate 8: Feature Ablation
    print("Gate 8: Feature Ablation...")
    X_func = scaler.fit_transform(X[:, :50])
    func_f1 = np.mean(cross_val_score(clf, X_func, y, cv=5, scoring='f1'))
    X_len = scaler.fit_transform(X[:, 50:55])
    len_f1 = np.mean(cross_val_score(clf, X_len, y, cv=5, scoring='f1'))
    improvement = func_f1 - len_f1
    passed = improvement > THRESHOLDS['gate_8_improvement']
    results['gate_8'] = {'gate': 'Feature Ablation', 'passed': passed, 'improvement': improvement}
    print(f"  Improvement: {improvement:.3f}, Pass: {passed}")

    # Gate 9: Adversarial Robustness
    print("Gate 9: Adversarial Robustness...")
    clf.fit(X_scaled, y)
    orig_proba = clf.predict_proba(X_scaled)[:, 1]
    deltas = []
    for noise in [0.01, 0.02]:
        X_noisy = X_scaled + rng.randn(*X_scaled.shape) * noise
        noisy_proba = clf.predict_proba(X_noisy)[:, 1]
        deltas.append(np.mean(np.abs(orig_proba - noisy_proba)))
    avg_delta = np.mean(deltas)
    passed = avg_delta < THRESHOLDS['gate_9_delta']
    results['gate_9'] = {'gate': 'Adversarial Robustness', 'passed': passed, 'avg_delta': avg_delta}
    print(f"  Avg Delta: {avg_delta:.3f}, Pass: {passed}")

    # Gate 10: Temporal Stability
    print("Gate 10: Temporal Stability...")
    n = len(X)
    mid = n // 2
    clf.fit(scaler.fit_transform(X[:mid]), y[:mid])
    forward_f1 = f1_score(y[mid:], clf.predict(scaler.transform(X[mid:])))
    clf.fit(scaler.fit_transform(X[mid:]), y[mid:])
    backward_f1 = f1_score(y[:mid], clf.predict(scaler.transform(X[:mid])))
    asymmetry = abs(forward_f1 - backward_f1)
    avg_f1 = (forward_f1 + backward_f1) / 2
    passed = asymmetry < THRESHOLDS['gate_10_asymmetry'] and avg_f1 > THRESHOLDS['min_f1']
    results['gate_10'] = {'gate': 'Temporal Stability', 'passed': passed, 'asymmetry': asymmetry, 'avg_f1': avg_f1}
    print(f"  Asymmetry: {asymmetry:.3f}, Avg F1: {avg_f1:.3f}, Pass: {passed}")

    # Summary
    passed_count = sum(1 for r in results.values() if r.get('passed', False))
    approved = passed_count >= 7  # Require 7/10 for approval

    print("\n" + "=" * 70)
    print(f"GATES PASSED: {passed_count}/10")
    print(f"APPROVED: {approved}")
    print("=" * 70)

    # Save certificate
    Path(PAPERS_DIR).mkdir(parents=True, exist_ok=True)

    certificate = {
        'timestamp': datetime.now().isoformat(),
        'gates_passed': passed_count,
        'gates_total': 10,
        'approved': approved,
        'thresholds': THRESHOLDS,
        'results': results
    }

    json_path = f'{PAPERS_DIR}/APPROVAL_CERTIFICATE.json'
    with open(json_path, 'w') as f:
        json.dump(certificate, f, indent=2, default=float)

    md_path = f'{PAPERS_DIR}/APPROVAL_CERTIFICATE.md'
    with open(md_path, 'w') as f:
        f.write(f"# Approval Certificate\n\n")
        f.write(f"**Status:** {'APPROVED' if approved else 'NOT APPROVED'}\n\n")
        f.write(f"**Gates Passed:** {passed_count}/10\n\n")
        f.write(f"**Timestamp:** {certificate['timestamp']}\n\n")
        f.write("## Gate Results\n\n")
        f.write("| Gate | Test | Status |\n")
        f.write("|:-----|:-----|:------:|\n")
        for key, result in results.items():
            status = "PASS" if result.get('passed') else "FAIL"
            f.write(f"| {key} | {result['gate']} | {status} |\n")

    print(f"\nCertificate saved to:")
    print(f"  {json_path}")
    print(f"  {md_path}")

    return certificate


if __name__ == "__main__":
    run_gates()
