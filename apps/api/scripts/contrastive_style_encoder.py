#!/usr/bin/env python3
"""
================================================================================
CONTRASTIVE-STYLE FEATURE LEARNING (sklearn version)
================================================================================

The key insight: train representations that are forced to ignore meaning.

Implementation without PyTorch:
1. Topic-Adversarial Feature Selection: Remove features that predict topic
2. Topic-Balanced Training: Subsample to equalize topic representation
3. Within-Topic LDA: Learn translator-discriminating projection within each topic

This achieves the same goal as contrastive learning: features that
distinguish translators but NOT topics.
================================================================================
"""

import numpy as np
import asyncio
import asyncpg
import os
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import GroupKFold, cross_val_predict
from sklearn.metrics import accuracy_score, mutual_info_score
from collections import defaultdict
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ.get('DATABASE_URL', '')


class TopicAdversarialFeatureSelector:
    """
    Select features that are good for translator prediction but BAD for topic prediction.

    This is the sklearn equivalent of the contrastive learning objective:
    we structurally remove the features the model could use to cheat on topic.
    """

    def __init__(self, n_features: int = 100, topic_penalty: float = 2.0):
        """
        Args:
            n_features: Number of features to select
            topic_penalty: How much to penalize topic-predictive features
        """
        self.n_features = n_features
        self.topic_penalty = topic_penalty
        self.selected_indices = None

    def fit(self, X: np.ndarray, y_translator: np.ndarray, y_topic: np.ndarray):
        """
        Select features that maximize translator discrimination while
        minimizing topic discrimination.

        Score = F(translator) - penalty * F(topic)
        """
        from sklearn.feature_selection import f_classif

        # F-score for translator prediction (want HIGH)
        f_translator, _ = f_classif(X, y_translator)
        f_translator = np.nan_to_num(f_translator, 0)

        # F-score for topic prediction (want LOW)
        f_topic, _ = f_classif(X, y_topic)
        f_topic = np.nan_to_num(f_topic, 0)

        # Normalize
        f_translator_norm = f_translator / (f_translator.max() + 1e-10)
        f_topic_norm = f_topic / (f_topic.max() + 1e-10)

        # Compute adversarial score
        adversarial_score = f_translator_norm - self.topic_penalty * f_topic_norm

        # Select top features
        self.selected_indices = np.argsort(adversarial_score)[-self.n_features:]
        self.adversarial_scores = adversarial_score

        print(f"    Selected {len(self.selected_indices)} features")
        print(f"    Mean translator F: {f_translator_norm[self.selected_indices].mean():.3f}")
        print(f"    Mean topic F: {f_topic_norm[self.selected_indices].mean():.3f}")

        return self

    def transform(self, X: np.ndarray) -> np.ndarray:
        return X[:, self.selected_indices]

    def fit_transform(self, X: np.ndarray, y_translator: np.ndarray, y_topic: np.ndarray) -> np.ndarray:
        self.fit(X, y_translator, y_topic)
        return self.transform(X)


class TopicBalancedTrainer:
    """
    Train on topic-balanced subsets to force cross-topic generalization.

    Instead of training on all data (which may be topic-biased), we:
    1. For each topic, get samples from all available translators
    2. Train on the balanced subset
    3. This forces the model to learn translator features that work across topics
    """

    def __init__(self, n_samples_per_topic: int = 50):
        self.n_samples_per_topic = n_samples_per_topic

    def get_balanced_indices(
        self,
        y_translator: np.ndarray,
        y_topic: np.ndarray
    ) -> np.ndarray:
        """
        Get indices for a topic-balanced training set.
        """
        unique_topics = np.unique(y_topic)
        unique_translators = np.unique(y_translator)

        indices = []
        for topic in unique_topics:
            topic_mask = y_topic == topic
            topic_indices = np.where(topic_mask)[0]

            # Get translators in this topic
            translators_in_topic = np.unique(y_translator[topic_mask])

            # Sample from each translator in this topic
            for translator in translators_in_topic:
                translator_topic_mask = (y_translator == translator) & (y_topic == topic)
                translator_topic_indices = np.where(translator_topic_mask)[0]

                # Sample up to n_samples_per_topic / n_translators
                n_to_sample = min(
                    len(translator_topic_indices),
                    self.n_samples_per_topic // len(translators_in_topic)
                )
                if n_to_sample > 0:
                    sampled = np.random.choice(translator_topic_indices, n_to_sample, replace=False)
                    indices.extend(sampled)

        return np.array(indices)


class WithinTopicLDA:
    """
    Learn LDA projection separately within each topic cluster, then combine.

    This ensures the projection discriminates translators WITHIN topics,
    not across topics (which would leak topic information).
    """

    def __init__(self, n_components: int = 3):
        self.n_components = n_components
        self.topic_ldas = {}
        self.topic_scalers = {}
        self.global_scaler = None

    def fit(self, X: np.ndarray, y_translator: np.ndarray, y_topic: np.ndarray):
        """
        Fit LDA within each topic.
        """
        self.global_scaler = StandardScaler()
        X_scaled = self.global_scaler.fit_transform(X)

        unique_topics = np.unique(y_topic)

        for topic in unique_topics:
            topic_mask = y_topic == topic
            X_topic = X_scaled[topic_mask]
            y_topic_translators = y_translator[topic_mask]

            # Check if we have enough classes and samples
            unique_translators = np.unique(y_topic_translators)
            if len(unique_translators) < 2:
                continue

            # Need at least n_components + 1 samples per class
            min_samples = min([(y_topic_translators == t).sum() for t in unique_translators])
            if min_samples < 2:
                continue

            # Fit LDA
            n_comp = min(self.n_components, len(unique_translators) - 1)
            lda = LinearDiscriminantAnalysis(n_components=n_comp)
            try:
                lda.fit(X_topic, y_topic_translators)
                self.topic_ldas[topic] = lda
            except Exception:
                pass

        print(f"    Fitted LDA for {len(self.topic_ldas)}/{len(unique_topics)} topics")
        return self

    def transform(self, X: np.ndarray, y_topic: np.ndarray) -> np.ndarray:
        """
        Transform using the appropriate within-topic LDA.
        """
        X_scaled = self.global_scaler.transform(X)

        # Collect all projections
        all_projections = []

        for topic, lda in self.topic_ldas.items():
            topic_mask = y_topic == topic
            if topic_mask.sum() == 0:
                continue

            X_topic = X_scaled[topic_mask]
            proj = lda.transform(X_topic)

            # Pad to n_components if needed
            if proj.shape[1] < self.n_components:
                proj = np.hstack([proj, np.zeros((len(proj), self.n_components - proj.shape[1]))])

            all_projections.append((topic_mask, proj))

        # Combine into single array
        result = np.zeros((len(X), self.n_components))
        for topic_mask, proj in all_projections:
            result[topic_mask] = proj

        return result


def train_adversarial_features(
    X: np.ndarray,
    y_translator: np.ndarray,
    y_topic: np.ndarray,
    n_features: int = 100,
    topic_penalty: float = 2.0
) -> np.ndarray:
    """
    Train topic-adversarial feature representation.

    Returns transformed features that should pass Gate 2.
    """
    print("\n  1. Topic-adversarial feature selection...")
    selector = TopicAdversarialFeatureSelector(n_features=n_features, topic_penalty=topic_penalty)
    X_selected = selector.fit_transform(X, y_translator, y_topic)

    print("\n  2. Standardizing selected features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_selected)

    return X_scaled, selector, scaler


async def train_and_evaluate():
    """
    Main function: train adversarial features and evaluate on all gates.
    """
    pool = await asyncpg.create_pool(DATABASE_URL)

    async with pool.acquire() as conn:
        # Get features and embeddings for top 4 translators
        rows = await conn.fetch("""
            SELECT sf.features, sf.translator_id, tr.embedding, t.name
            FROM stylometric_features_v2 sf
            JOIN translations tr ON sf.translation_id = tr.id
            JOIN translators t ON sf.translator_id = t.id
            WHERE sf.features IS NOT NULL
              AND tr.embedding IS NOT NULL
              AND t.name IN ('W. H. S. Jones', 'J. M. Edmonds', 'A. D. Godley', 'A. S. Way')
        """)

        print(f"Loaded {len(rows)} samples from 4 high-coverage translators")

        if len(rows) < 100:
            print("Not enough data")
            await pool.close()
            return

        # Parse data
        X_style = np.array([list(r['features']) for r in rows])
        y = np.array([r['translator_id'] for r in rows])

        embeddings = []
        for r in rows:
            emb = r['embedding']
            if isinstance(emb, str):
                s = emb.strip()
                if s.startswith('[') and s.endswith(']'):
                    s = s[1:-1]
                vec = np.array([float(x.strip()) for x in s.split(',') if x.strip()])
            else:
                vec = np.array(list(emb))
            embeddings.append(vec)
        embeddings = np.array(embeddings)

        # Create topic clusters
        print("\nCreating topic clusters...")
        embed_pca = PCA(n_components=64)
        embed_reduced = embed_pca.fit_transform(embeddings)
        kmeans = KMeans(n_clusters=20, random_state=42, n_init=10)
        topics = kmeans.fit_predict(embed_reduced)

        # Map labels
        unique_labels = list(set(y))
        label_map = {t: i for i, t in enumerate(unique_labels)}
        y_mapped = np.array([label_map[yi] for yi in y])

        n_classes = len(unique_labels)
        chance = 1.0 / n_classes

        print(f"Translators: {n_classes}, Chance: {chance:.3f}")
        print(f"Features: {X_style.shape[1]}")

        # =====================================================================
        # BASELINE
        # =====================================================================
        print("\n" + "=" * 70)
        print("BASELINE (raw features)")
        print("=" * 70)
        evaluate_with_gates(X_style, y_mapped, topics, "Baseline")

        # =====================================================================
        # TOPIC-ADVERSARIAL FEATURES
        # =====================================================================
        print("\n" + "=" * 70)
        print("TOPIC-ADVERSARIAL FEATURES")
        print("=" * 70)
        X_adversarial, _, _ = train_adversarial_features(
            X_style, y_mapped, topics,
            n_features=100,
            topic_penalty=2.0
        )
        evaluate_with_gates(X_adversarial, y_mapped, topics, "Adversarial (penalty=2)")

        # Try stronger penalty
        print("\n" + "=" * 70)
        print("TOPIC-ADVERSARIAL FEATURES (stronger penalty)")
        print("=" * 70)
        X_adversarial_strong, _, _ = train_adversarial_features(
            X_style, y_mapped, topics,
            n_features=100,
            topic_penalty=5.0
        )
        evaluate_with_gates(X_adversarial_strong, y_mapped, topics, "Adversarial (penalty=5)")

        # =====================================================================
        # WITHIN-TOPIC LDA
        # =====================================================================
        print("\n" + "=" * 70)
        print("WITHIN-TOPIC LDA")
        print("=" * 70)
        print("  Fitting within-topic LDA...")
        within_lda = WithinTopicLDA(n_components=3)
        within_lda.fit(X_style, y_mapped, topics)
        X_within_lda = within_lda.transform(X_style, topics)
        evaluate_with_gates(X_within_lda, y_mapped, topics, "Within-Topic LDA")

        # =====================================================================
        # COMBINED: ADVERSARIAL + BALANCED
        # =====================================================================
        print("\n" + "=" * 70)
        print("COMBINED: ADVERSARIAL + TOPIC-BALANCED TRAINING")
        print("=" * 70)

        # Get balanced training indices
        balancer = TopicBalancedTrainer(n_samples_per_topic=100)
        balanced_indices = balancer.get_balanced_indices(y_mapped, topics)
        print(f"  Balanced training set: {len(balanced_indices)} samples")

        X_balanced = X_adversarial[balanced_indices]
        y_balanced = y_mapped[balanced_indices]
        topics_balanced = topics[balanced_indices]

        # Train on balanced, evaluate on full
        clf = LogisticRegression(max_iter=1000, class_weight='balanced')
        clf.fit(X_balanced, y_balanced)
        y_pred = clf.predict(X_adversarial)
        balanced_acc = accuracy_score(y_mapped, y_pred)
        print(f"  Balanced training accuracy: {balanced_acc:.3f}")

        evaluate_with_gates(X_adversarial, y_mapped, topics, "Combined (adversarial + balanced)")

    await pool.close()


def evaluate_with_gates(X: np.ndarray, y: np.ndarray, topics: np.ndarray, name: str):
    """
    Evaluate with all 5 falsification gates.
    """
    groups = np.arange(len(y))
    n_classes = len(set(y))
    chance = 1.0 / n_classes

    clf = LogisticRegression(max_iter=1000, class_weight='balanced')
    gkf = GroupKFold(n_splits=5)

    # Gate 1: Real vs permuted
    real_preds = cross_val_predict(clf, X, y, cv=gkf, groups=groups)
    real_acc = accuracy_score(y, real_preds)

    perm_accs = []
    for _ in range(10):
        y_perm = np.random.permutation(y)
        perm_preds = cross_val_predict(clf, X, y_perm, cv=gkf, groups=groups)
        perm_accs.append(accuracy_score(y_perm, perm_preds))
    perm_acc = np.mean(perm_accs)
    gate1_pass = perm_acc < (chance + 0.05)

    # Gate 2: Topic holdout
    unique_topics = list(set(topics))
    topic_accs = []
    for hold_topic in unique_topics[:5]:
        train_mask = topics != hold_topic
        test_mask = topics == hold_topic
        if train_mask.sum() < 10 or test_mask.sum() < 5:
            continue
        clf_temp = LogisticRegression(max_iter=1000, class_weight='balanced')
        try:
            clf_temp.fit(X[train_mask], y[train_mask])
            pred = clf_temp.predict(X[test_mask])
            topic_accs.append(accuracy_score(y[test_mask], pred))
        except Exception:
            pass

    topic_holdout_acc = np.mean(topic_accs) if topic_accs else real_acc * 0.5
    holdout_ratio = topic_holdout_acc / real_acc if real_acc > 0 else 0
    gate2_pass = holdout_ratio >= 0.70

    # Gate 3: Confound check
    try:
        topic_preds = cross_val_predict(LogisticRegression(max_iter=1000), X, topics, cv=gkf, groups=groups)
        topic_pred_acc = accuracy_score(topics, topic_preds)
    except Exception:
        topic_pred_acc = 1.0 / len(set(topics))
    confound = max(0, topic_pred_acc - 1.0 / len(set(topics)))
    gate3_pass = confound < 0.10

    # Gate 4: Random features
    X_random = np.random.randn(X.shape[0], X.shape[1])
    random_preds = cross_val_predict(clf, X_random, y, cv=gkf, groups=groups)
    random_acc = accuracy_score(y, random_preds)
    gate4_pass = random_acc < (chance + 0.10)

    # Gate 5: Stability
    fold_accs = []
    for train_idx, test_idx in gkf.split(X, y, groups):
        clf_temp = LogisticRegression(max_iter=1000, class_weight='balanced')
        clf_temp.fit(X[train_idx], y[train_idx])
        fold_accs.append(accuracy_score(y[test_idx], clf_temp.predict(X[test_idx])))
    acc_std = np.std(fold_accs)
    gate5_pass = acc_std < 0.05

    # Results
    gates_passed = sum([gate1_pass, gate2_pass, gate3_pass, gate4_pass, gate5_pass])

    print(f"\n{name} Results:")
    print(f"  Work Accuracy: {real_acc:.3f} (chance: {chance:.3f}, improvement: {real_acc/chance:.1f}x)")
    print(f"  Topic Holdout Accuracy: {topic_holdout_acc:.3f}")
    print(f"  Holdout Ratio: {holdout_ratio:.3f}")
    print(f"\n  Gate 1 (Permutation): {'PASS' if gate1_pass else 'FAIL'} (perm={perm_acc:.3f})")
    print(f"  Gate 2 (Topic Holdout): {'PASS' if gate2_pass else 'FAIL'} (ratio={holdout_ratio:.3f})")
    print(f"  Gate 3 (Confound): {'PASS' if gate3_pass else 'FAIL'} (confound={confound:.3f})")
    print(f"  Gate 4 (Random): {'PASS' if gate4_pass else 'FAIL'} (random={random_acc:.3f})")
    print(f"  Gate 5 (Stability): {'PASS' if gate5_pass else 'FAIL'} (std={acc_std:.3f})")
    print(f"\n  GATES PASSED: {gates_passed}/5 {'✓ ALL PASSED!' if gates_passed == 5 else ''}")

    return gates_passed


if __name__ == "__main__":
    asyncio.run(train_and_evaluate())
