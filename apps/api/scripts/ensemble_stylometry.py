#!/usr/bin/env python3
"""
================================================================================
ENSEMBLE STYLOMETRY
================================================================================

Combines the 9 approved topic-adversarial configurations into an ensemble.
Expected accuracy boost: 5-10% over single best model.

Approved configurations (all pass 5/5 gates):
1. Adversarial (p=10, n=50) - 31.2% acc, 0.932 ratio
2. Adversarial (p=10, n=30) - 27.6% acc, 0.930 ratio
3. Adversarial (p=15, n=50) - 30.5% acc, 0.899 ratio
4. Adversarial (p=10, n=75) - 38.3% acc, 0.891 ratio
5. Adversarial (p=20, n=50) - 30.0% acc, 0.873 ratio
6. Adversarial (p=5, n=50) - 38.1% acc, 0.793 ratio
7. Adversarial (p=5, n=30) - 32.4% acc, 0.776 ratio
8. Adversarial (p=15, n=30) - 29.3% acc, 0.871 ratio
9. Adversarial (p=20, n=30) - 29.0% acc, 0.842 ratio

================================================================================
"""

import numpy as np
import asyncio
import asyncpg
import os
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import GroupKFold, cross_val_predict
from sklearn.metrics import accuracy_score, f1_score, classification_report
from sklearn.feature_selection import f_classif
from typing import Dict, List, Tuple, Any
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ.get('DATABASE_URL', '')

# Approved configurations
APPROVED_CONFIGS = [
    {'penalty': 10, 'n_features': 50, 'name': 'p10_n50'},
    {'penalty': 10, 'n_features': 30, 'name': 'p10_n30'},
    {'penalty': 15, 'n_features': 50, 'name': 'p15_n50'},
    {'penalty': 10, 'n_features': 75, 'name': 'p10_n75'},
    {'penalty': 20, 'n_features': 50, 'name': 'p20_n50'},
    {'penalty': 5, 'n_features': 50, 'name': 'p5_n50'},
    {'penalty': 5, 'n_features': 30, 'name': 'p5_n30'},
    {'penalty': 15, 'n_features': 30, 'name': 'p15_n30'},
    {'penalty': 20, 'n_features': 30, 'name': 'p20_n30'},
]


class TopicAdversarialSelector:
    """Select features that predict translator but NOT topic."""

    def __init__(self, n_features: int = 50, penalty: float = 10.0):
        self.n_features = n_features
        self.penalty = penalty
        self.selected_indices = None
        self.scaler = StandardScaler()

    def fit(self, X: np.ndarray, y_translator: np.ndarray, y_topic: np.ndarray):
        """Fit the selector by computing adversarial scores."""
        f_translator, _ = f_classif(X, y_translator)
        f_topic, _ = f_classif(X, y_topic)

        f_translator = np.nan_to_num(f_translator, 0)
        f_topic = np.nan_to_num(f_topic, 0)

        f_t_norm = f_translator / (f_translator.max() + 1e-10)
        f_p_norm = f_topic / (f_topic.max() + 1e-10)

        score = f_t_norm - self.penalty * f_p_norm
        self.selected_indices = np.argsort(score)[-self.n_features:]

        X_sel = X[:, self.selected_indices]
        self.scaler.fit(X_sel)

        return self

    def transform(self, X: np.ndarray) -> np.ndarray:
        """Transform using selected features."""
        X_sel = X[:, self.selected_indices]
        return self.scaler.transform(X_sel)

    def fit_transform(self, X: np.ndarray, y_translator: np.ndarray, y_topic: np.ndarray) -> np.ndarray:
        self.fit(X, y_translator, y_topic)
        return self.transform(X)


class EnsembleStylometry:
    """Ensemble of approved topic-adversarial configurations."""

    def __init__(self, configs: List[Dict] = None):
        self.configs = configs or APPROVED_CONFIGS
        self.selectors = []
        self.classifiers = []
        self.classes_ = None

    def fit(self, X: np.ndarray, y: np.ndarray, topics: np.ndarray):
        """Fit all configurations."""
        self.classes_ = np.unique(y)

        for config in self.configs:
            selector = TopicAdversarialSelector(
                n_features=config['n_features'],
                penalty=config['penalty']
            )
            X_sel = selector.fit_transform(X, y, topics)

            clf = LogisticRegression(max_iter=1000, class_weight='balanced')
            clf.fit(X_sel, y)

            self.selectors.append(selector)
            self.classifiers.append(clf)

        return self

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Average probability predictions from all models."""
        proba_sum = None

        for selector, clf in zip(self.selectors, self.classifiers):
            X_sel = selector.transform(X)
            proba = clf.predict_proba(X_sel)

            if proba_sum is None:
                proba_sum = proba
            else:
                proba_sum += proba

        return proba_sum / len(self.classifiers)

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict using averaged probabilities."""
        proba = self.predict_proba(X)
        return self.classes_[np.argmax(proba, axis=1)]


async def load_data(pool: asyncpg.Pool, translators: List[str] = None) -> Tuple[np.ndarray, np.ndarray, np.ndarray, List[str]]:
    """Load features, labels, topics, and translator names."""
    if translators is None:
        translators = ['W. H. S. Jones', 'J. M. Edmonds', 'A. D. Godley', 'A. S. Way']

    translator_list = ', '.join([f"'{t}'" for t in translators])

    async with pool.acquire() as conn:
        rows = await conn.fetch(f"""
            SELECT sf.features, sf.translator_id, tr.embedding, t.name
            FROM stylometric_features_v2 sf
            JOIN translations tr ON sf.translation_id = tr.id
            JOIN translators t ON sf.translator_id = t.id
            WHERE sf.features IS NOT NULL AND tr.embedding IS NOT NULL
              AND t.name IN ({translator_list})
        """)

    X = np.array([list(r['features']) for r in rows])
    y = np.array([r['translator_id'] for r in rows])
    names = [r['name'] for r in rows]

    # Parse embeddings
    embeddings = []
    for r in rows:
        emb = r['embedding']
        if isinstance(emb, str):
            s = emb.strip()[1:-1]
            vec = np.array([float(x.strip()) for x in s.split(',') if x.strip()])
        else:
            vec = np.array(list(emb))
        embeddings.append(vec)
    embeddings = np.array(embeddings)

    # Create topic clusters
    embed_pca = PCA(n_components=min(64, embeddings.shape[1]))
    embed_reduced = embed_pca.fit_transform(embeddings)
    kmeans = KMeans(n_clusters=20, random_state=42, n_init=10)
    topics = kmeans.fit_predict(embed_reduced)

    # Map labels
    unique_labels = list(set(y))
    label_map = {t: i for i, t in enumerate(unique_labels)}
    y_mapped = np.array([label_map[yi] for yi in y])

    # Create name map
    translator_names = {label_map[tid]: name for tid, name in zip(y, names)}

    return X, y_mapped, topics, translator_names


async def evaluate_ensemble(pool: asyncpg.Pool):
    """Evaluate ensemble vs single best model."""
    print("=" * 70)
    print("ENSEMBLE STYLOMETRY EVALUATION")
    print("=" * 70)

    X, y, topics, translator_names = await load_data(pool)
    n_classes = len(set(y))
    chance = 1.0 / n_classes

    print(f"\nData: {len(X)} samples, {X.shape[1]} features, {n_classes} classes")
    print(f"Chance baseline: {chance:.1%}")

    groups = np.arange(len(y))
    gkf = GroupKFold(n_splits=5)

    # Single best model (p=10, n=50)
    print("\n" + "-" * 70)
    print("SINGLE BEST MODEL (p=10, n=50)")
    print("-" * 70)

    selector = TopicAdversarialSelector(n_features=50, penalty=10)
    X_sel = selector.fit_transform(X, y, topics)

    clf = LogisticRegression(max_iter=1000, class_weight='balanced')
    single_preds = cross_val_predict(clf, X_sel, y, cv=gkf, groups=groups)
    single_acc = accuracy_score(y, single_preds)
    single_f1 = f1_score(y, single_preds, average='macro')

    print(f"Accuracy: {single_acc:.3f} ({single_acc/chance:.2f}x chance)")
    print(f"Macro F1: {single_f1:.3f}")

    # Ensemble (all 9 approved configs)
    print("\n" + "-" * 70)
    print("ENSEMBLE (9 approved configurations)")
    print("-" * 70)

    # Cross-validation with ensemble
    ensemble_preds = np.zeros(len(y), dtype=int)
    ensemble_proba = np.zeros((len(y), n_classes))

    for fold_idx, (train_idx, test_idx) in enumerate(gkf.split(X, y, groups)):
        X_train, X_test = X[train_idx], X[test_idx]
        y_train = y[train_idx]
        topics_train = topics[train_idx]

        ensemble = EnsembleStylometry(APPROVED_CONFIGS)
        ensemble.fit(X_train, y_train, topics_train)

        fold_proba = ensemble.predict_proba(X_test)
        ensemble_proba[test_idx] = fold_proba
        ensemble_preds[test_idx] = ensemble.classes_[np.argmax(fold_proba, axis=1)]

    ensemble_acc = accuracy_score(y, ensemble_preds)
    ensemble_f1 = f1_score(y, ensemble_preds, average='macro')

    print(f"Accuracy: {ensemble_acc:.3f} ({ensemble_acc/chance:.2f}x chance)")
    print(f"Macro F1: {ensemble_f1:.3f}")

    # Improvement
    acc_improvement = (ensemble_acc - single_acc) / single_acc * 100
    f1_improvement = (ensemble_f1 - single_f1) / single_f1 * 100

    print("\n" + "-" * 70)
    print("IMPROVEMENT FROM ENSEMBLE")
    print("-" * 70)
    print(f"Accuracy: {single_acc:.3f} -> {ensemble_acc:.3f} ({acc_improvement:+.1f}%)")
    print(f"Macro F1: {single_f1:.3f} -> {ensemble_f1:.3f} ({f1_improvement:+.1f}%)")

    # Per-class results
    print("\n" + "-" * 70)
    print("PER-CLASS RESULTS (Ensemble)")
    print("-" * 70)
    unique_classes = sorted(set(y))
    for cls in unique_classes:
        name = translator_names.get(cls, f"Class {cls}")[:20]
        cls_mask = y == cls
        cls_acc = accuracy_score(y[cls_mask], ensemble_preds[cls_mask])
        print(f"  {name}: {cls_acc:.3f}")

    # Topic holdout test for ensemble
    print("\n" + "-" * 70)
    print("TOPIC HOLDOUT (Ensemble)")
    print("-" * 70)

    unique_topics = list(set(topics))
    topic_accs = []

    for hold_topic in unique_topics[:7]:
        train_mask = topics != hold_topic
        test_mask = topics == hold_topic

        if train_mask.sum() < 10 or test_mask.sum() < 5:
            continue

        X_train, y_train = X[train_mask], y[train_mask]
        topics_train = topics[train_mask]
        X_test, y_test = X[test_mask], y[test_mask]

        ensemble = EnsembleStylometry(APPROVED_CONFIGS)
        ensemble.fit(X_train, y_train, topics_train)
        preds = ensemble.predict(X_test)
        topic_accs.append(accuracy_score(y_test, preds))

    topic_holdout_acc = np.mean(topic_accs)
    holdout_ratio = topic_holdout_acc / ensemble_acc

    print(f"Work Accuracy: {ensemble_acc:.3f}")
    print(f"Topic Holdout Accuracy: {topic_holdout_acc:.3f}")
    print(f"Holdout Ratio: {holdout_ratio:.3f} (threshold: 0.70)")
    print(f"Gate 2: {'PASS' if holdout_ratio >= 0.70 else 'FAIL'}")

    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Single model accuracy: {single_acc:.3f}")
    print(f"Ensemble accuracy: {ensemble_acc:.3f}")
    print(f"Improvement: {acc_improvement:+.1f}%")
    print(f"Ensemble Gate 2 ratio: {holdout_ratio:.3f}")

    return {
        'single_acc': single_acc,
        'ensemble_acc': ensemble_acc,
        'improvement_pct': acc_improvement,
        'holdout_ratio': holdout_ratio,
        'ensemble_f1': ensemble_f1
    }


async def main():
    pool = await asyncpg.create_pool(DATABASE_URL)
    results = await evaluate_ensemble(pool)
    await pool.close()
    return results


if __name__ == "__main__":
    asyncio.run(main())
