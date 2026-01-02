#!/usr/bin/env python3
"""
EXPERIMENT HARNESS - Systematic parameter search with approval gates
"""

import asyncio
import asyncpg
import numpy as np
import json
import os
import hashlib
from datetime import datetime
from dataclasses import dataclass
from typing import Dict, List, Tuple, Optional
from sklearn.linear_model import LogisticRegression, RidgeClassifier
from sklearn.model_selection import GroupKFold
from sklearn.metrics import accuracy_score, f1_score
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ['DATABASE_URL']

# Configuration
APPROVAL_THRESHOLDS = {
    'min_accuracy': 0.60,
    'max_topic_pred': 0.15,  # Near chance for ~10 topics
    'max_ece': 0.15,
    'min_stability': 0.80,
    'min_impostor_acc': 0.50,  # Above chance on topic-matched
}

# Search space (can be expanded)
SEARCH_SPACE = {
    'mfw': [50, 100, 150, 300],
    'pca_dim': [64, 128],
    'style_dim': [16, 32],
    'confound_penalty': [0.25, 0.5, 1.0],
    'n_clusters': [16, 32],
}

@dataclass
class ExperimentConfig:
    mfw: int
    pca_dim: int
    style_dim: int
    confound_penalty: float
    n_clusters: int

    def to_dict(self) -> Dict:
        return {
            'mfw': self.mfw,
            'pca_dim': self.pca_dim,
            'style_dim': self.style_dim,
            'confound_penalty': self.confound_penalty,
            'n_clusters': self.n_clusters,
        }

    def experiment_id(self) -> str:
        config_str = json.dumps(self.to_dict(), sort_keys=True)
        return hashlib.md5(config_str.encode()).hexdigest()[:12]

@dataclass
class GateResults:
    passed_accuracy: bool = False
    passed_confound: bool = False
    passed_impostor: bool = False
    passed_stability: bool = False
    passed_calibration: bool = False

    @property
    def passed_all(self) -> bool:
        return all([
            self.passed_accuracy,
            self.passed_confound,
            self.passed_impostor,
            self.passed_stability,
            self.passed_calibration,
        ])

def compute_ece(y_true, y_prob, n_bins=10):
    """Expected Calibration Error."""
    bin_boundaries = np.linspace(0, 1, n_bins + 1)
    ece = 0.0
    for i in range(n_bins):
        mask = (y_prob >= bin_boundaries[i]) & (y_prob < bin_boundaries[i+1])
        if mask.sum() > 0:
            bin_acc = y_true[mask].mean()
            bin_conf = y_prob[mask].mean()
            ece += mask.sum() * abs(bin_acc - bin_conf)
    return ece / len(y_true)

def run_experiment(config: ExperimentConfig, embeddings, authors, anchors, topics) -> Dict:
    """Run a single experiment with all gates."""

    results = {
        'experiment_id': config.experiment_id(),
        'config': config.to_dict(),
    }

    # Build representation
    X = np.array(embeddings)
    y = np.array(authors)
    anchors = np.array(anchors)
    topics = np.array(topics)

    # Filter to authors with enough samples
    author_counts = {}
    for a in y:
        author_counts[a] = author_counts.get(a, 0) + 1
    valid_authors = {a for a, c in author_counts.items() if c >= 50}

    mask = np.array([a in valid_authors for a in y])
    X, y, anchors, topics = X[mask], y[mask], anchors[mask], topics[mask]

    n_samples, n_features = X.shape
    n_authors = len(set(y))

    if n_samples < 1000 or n_authors < 3:
        results['error'] = 'Not enough data'
        return results

    # PCA reduction
    pca = PCA(n_components=min(config.pca_dim, n_features))
    X_pca = pca.fit_transform(X)

    # Cluster anchors for meaning types
    anchor_means = {}
    for i, anc in enumerate(anchors):
        if anc not in anchor_means:
            anchor_means[anc] = []
        anchor_means[anc].append(X_pca[i])

    anchor_vecs = np.array([np.mean(v, axis=0) for v in anchor_means.values()])

    kmeans = KMeans(n_clusters=min(config.n_clusters, len(anchor_vecs)), random_state=42)
    anchor_to_cluster = {}
    if len(anchor_vecs) >= config.n_clusters:
        cluster_labels = kmeans.fit_predict(anchor_vecs)
        for i, anc in enumerate(anchor_means.keys()):
            anchor_to_cluster[anc] = cluster_labels[i]
    else:
        for anc in anchor_means.keys():
            anchor_to_cluster[anc] = 0

    clusters = np.array([anchor_to_cluster.get(a, 0) for a in anchors])

    # ========== GATE 1: Work-holdout accuracy ==========
    unique_anchors = list(set(anchors))
    if len(unique_anchors) < 5:
        results['error'] = 'Not enough anchors for holdout'
        return results

    gkf = GroupKFold(n_splits=min(5, len(unique_anchors)))
    accuracies = []

    try:
        for train_idx, test_idx in gkf.split(X_pca, y, groups=anchors):
            clf = LogisticRegression(max_iter=1000)
            clf.fit(X_pca[train_idx], y[train_idx])
            pred = clf.predict(X_pca[test_idx])
            accuracies.append(accuracy_score(y[test_idx], pred))
    except Exception as e:
        results['error'] = f'CV failed: {e}'
        return results

    accuracy = np.mean(accuracies)
    results['accuracy'] = accuracy
    results['passed_accuracy'] = accuracy >= APPROVAL_THRESHOLDS['min_accuracy']

    # Early pruning
    if not results['passed_accuracy']:
        results['gates'] = GateResults(passed_accuracy=False).__dict__
        return results

    # ========== GATE 2: Confound predictability ==========
    # Train classifier to predict topic from "style" representation
    clf_topic = LogisticRegression(max_iter=500)

    # Use style residuals (anchor-mean removed)
    anchor_means_arr = {}
    for i, anc in enumerate(anchors):
        if anc not in anchor_means_arr:
            anchor_means_arr[anc] = []
        anchor_means_arr[anc].append(X_pca[i])

    X_residual = np.zeros_like(X_pca)
    for i, anc in enumerate(anchors):
        mean = np.mean(anchor_means_arr[anc], axis=0)
        X_residual[i] = X_pca[i] - mean

    try:
        topic_pred_acc = []
        for train_idx, test_idx in gkf.split(X_residual, topics, groups=anchors):
            clf_topic.fit(X_residual[train_idx], topics[train_idx])
            pred = clf_topic.predict(X_residual[test_idx])
            topic_pred_acc.append(accuracy_score(topics[test_idx], pred))

        topic_predictability = np.mean(topic_pred_acc)
        n_topics = len(set(topics))
        chance = 1.0 / n_topics

        results['topic_predictability'] = topic_predictability
        results['topic_chance'] = chance
        results['passed_confound'] = topic_predictability < (chance + APPROVAL_THRESHOLDS['max_topic_pred'])
    except:
        results['passed_confound'] = False
        results['topic_predictability'] = 1.0

    # Early pruning
    if not results['passed_confound']:
        results['gates'] = GateResults(
            passed_accuracy=results['passed_accuracy'],
            passed_confound=False
        ).__dict__
        return results

    # ========== GATE 3: Topic-matched impostor test ==========
    # For each test author, restrict candidates to same-topic authors
    impostor_correct = 0
    impostor_total = 0

    try:
        for cluster_id in set(clusters):
            cluster_mask = clusters == cluster_id
            if cluster_mask.sum() < 50:
                continue

            X_cluster = X_residual[cluster_mask]
            y_cluster = y[cluster_mask]
            anchors_cluster = anchors[cluster_mask]

            unique_authors_cluster = list(set(y_cluster))
            if len(unique_authors_cluster) < 2:
                continue

            # Within-cluster CV
            try:
                for train_idx, test_idx in GroupKFold(n_splits=3).split(
                    X_cluster, y_cluster, groups=anchors_cluster
                ):
                    if len(train_idx) < 20 or len(test_idx) < 5:
                        continue
                    clf = LogisticRegression(max_iter=500)
                    clf.fit(X_cluster[train_idx], y_cluster[train_idx])
                    pred = clf.predict(X_cluster[test_idx])
                    impostor_correct += (pred == y_cluster[test_idx]).sum()
                    impostor_total += len(test_idx)
            except:
                continue

        if impostor_total > 0:
            impostor_accuracy = impostor_correct / impostor_total
            results['impostor_accuracy'] = impostor_accuracy
            results['passed_impostor'] = impostor_accuracy >= APPROVAL_THRESHOLDS['min_impostor_acc']
        else:
            results['impostor_accuracy'] = 0.0
            results['passed_impostor'] = False
    except:
        results['passed_impostor'] = False

    # ========== GATE 4: Stability across window sizes ==========
    # This would require re-running with different window sizes
    # For now, use variance across folds as proxy
    stability_score = 1.0 - np.std(accuracies) / np.mean(accuracies) if np.mean(accuracies) > 0 else 0
    results['stability_score'] = stability_score
    results['passed_stability'] = stability_score >= APPROVAL_THRESHOLDS['min_stability']

    # ========== GATE 5: Calibration (ECE) ==========
    try:
        clf_full = LogisticRegression(max_iter=1000)

        ece_scores = []
        for train_idx, test_idx in gkf.split(X_pca, y, groups=anchors):
            clf_full.fit(X_pca[train_idx], y[train_idx])
            probs = clf_full.predict_proba(X_pca[test_idx])
            y_pred = clf_full.predict(X_pca[test_idx])

            # Get probability of predicted class
            pred_probs = probs.max(axis=1)
            y_correct = (y_pred == y[test_idx]).astype(float)

            ece = compute_ece(y_correct, pred_probs)
            ece_scores.append(ece)

        avg_ece = np.mean(ece_scores)
        results['ece'] = avg_ece
        results['passed_calibration'] = avg_ece <= APPROVAL_THRESHOLDS['max_ece']
    except:
        results['passed_calibration'] = False
        results['ece'] = 1.0

    # Final gate results
    gates = GateResults(
        passed_accuracy=results.get('passed_accuracy', False),
        passed_confound=results.get('passed_confound', False),
        passed_impostor=results.get('passed_impostor', False),
        passed_stability=results.get('passed_stability', False),
        passed_calibration=results.get('passed_calibration', False),
    )

    results['gates'] = gates.__dict__
    results['passed_all_gates'] = gates.passed_all

    return results

async def main():
    print("=" * 70)
    print("EXPERIMENT HARNESS - Systematic Parameter Search")
    print("=" * 70)

    conn = await asyncpg.connect(DATABASE_URL)

    # Load data
    print("\n[1] Loading data...")
    rows = await conn.fetch("""
        SELECT t.id, t.embedding, tr.name as translator_name,
               COALESCE(t.text_id::text, t.id::text) as anchor_id,
               COALESCE(sel.topic_cluster, 0) as topic
        FROM translations t
        JOIN translators tr ON t.translator_id = tr.id
        LEFT JOIN style_evidence_layer sel ON t.id = sel.translation_id
        WHERE t.embedding IS NOT NULL
    """)

    embeddings = []
    authors = []
    anchors = []
    topics = []

    for r in rows:
        if r['embedding']:
            emb = np.array(json.loads(r['embedding']) if isinstance(r['embedding'], str) else list(r['embedding']))
            embeddings.append(emb)
            authors.append(r['translator_name'])
            anchors.append(r['anchor_id'])
            topics.append(r['topic'])

    print(f"    Loaded {len(embeddings)} samples")
    print(f"    Authors: {len(set(authors))}")
    print(f"    Anchors: {len(set(anchors))}")

    # Generate experiment configurations
    print("\n[2] Generating experiment configurations...")
    configs = []
    for mfw in SEARCH_SPACE['mfw']:
        for pca_dim in SEARCH_SPACE['pca_dim']:
            for style_dim in SEARCH_SPACE['style_dim']:
                for cp in SEARCH_SPACE['confound_penalty']:
                    for nc in SEARCH_SPACE['n_clusters']:
                        configs.append(ExperimentConfig(
                            mfw=mfw, pca_dim=pca_dim, style_dim=style_dim,
                            confound_penalty=cp, n_clusters=nc
                        ))

    print(f"    Total configurations: {len(configs)}")

    # Run experiments
    print("\n[3] Running experiments with approval gates...")

    approved_experiments = []
    failed_experiments = []

    for i, config in enumerate(configs):
        if i % 10 == 0:
            print(f"    Progress: {i}/{len(configs)}")

        results = run_experiment(config, embeddings, authors, anchors, topics)

        # Store in database
        await conn.execute("""
            INSERT INTO experiment_runs (
                experiment_id, method_name, parameters,
                accuracy, topic_predictability, ece, stability_score,
                passed_accuracy_gate, passed_confound_gate, passed_impostor_gate,
                passed_stability_gate, passed_calibration_gate, passed_all_gates
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            ON CONFLICT (experiment_id) DO UPDATE SET
                accuracy = EXCLUDED.accuracy,
                topic_predictability = EXCLUDED.topic_predictability,
                passed_all_gates = EXCLUDED.passed_all_gates
        """,
            results['experiment_id'],
            'StyleV4_Harness',
            json.dumps(results['config']),
            results.get('accuracy'),
            results.get('topic_predictability'),
            results.get('ece'),
            results.get('stability_score'),
            results.get('passed_accuracy', False),
            results.get('passed_confound', False),
            results.get('passed_impostor', False),
            results.get('passed_stability', False),
            results.get('passed_calibration', False),
            results.get('passed_all_gates', False),
        )

        if results.get('passed_all_gates'):
            approved_experiments.append(results)
            print(f"      APPROVED: {config.experiment_id()} - acc={results['accuracy']:.3f}")
        else:
            failed_experiments.append(results)

    # Summary
    print("\n" + "=" * 70)
    print("EXPERIMENT SUMMARY")
    print("=" * 70)
    print(f"Total experiments: {len(configs)}")
    print(f"Approved (passed all gates): {len(approved_experiments)}")
    print(f"Rejected: {len(failed_experiments)}")

    if approved_experiments:
        best = max(approved_experiments, key=lambda x: x.get('accuracy', 0))
        print(f"\nBest approved configuration:")
        print(f"  Accuracy: {best['accuracy']:.3f}")
        print(f"  Topic predictability: {best.get('topic_predictability', 'N/A')}")
        print(f"  ECE: {best.get('ece', 'N/A')}")
        print(f"  Config: {best['config']}")

    await conn.close()
    print("\nExperiment harness complete!")

if __name__ == "__main__":
    asyncio.run(main())
