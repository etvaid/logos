#!/usr/bin/env python3
"""
================================================================================
MEANING RESIDUALIZATION
================================================================================

Two approaches to making style features meaning-invariant:

Mode A) Ridge Residualization:
   - For each feature dimension j, fit: x_j ≈ a_j + b_j · z_meaning
   - Residual: r_j = x_j − ŷ_j(z_meaning)
   - Generalizes to new meaning clusters (unlike per-cluster whitening)

Mode B) Mixture-of-Experts Normalization:
   - Learn K normalization parameter sets (μ_k, Σ_k) from training clusters
   - Train gating model g(z_meaning) → weights over clusters
   - For new segment: normalize using weighted mixture
   - This is "variable measurement standards" made deployable

The key insight: style should be measured CONDITIONAL on meaning, not as
a global property that we hope is invariant.
================================================================================
"""

import numpy as np
import asyncio
import asyncpg
import os
from sklearn.linear_model import Ridge
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from scipy.linalg import sqrtm, inv
from typing import Dict, List, Tuple, Optional
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ.get('DATABASE_URL', '')


class RidgeResidualizer:
    """
    Mode A: Ridge regression residualization.

    For each style feature dimension, predict it from the meaning embedding
    using ridge regression, then use the residual as the meaning-invariant
    style feature.

    This generalizes to new meaning contexts because the regression is
    trained on the full embedding space, not just specific clusters.
    """

    def __init__(self, alpha: float = 1.0):
        """
        Args:
            alpha: Ridge regularization strength
        """
        self.alpha = alpha
        self.models: List[Ridge] = []
        self.fitted = False

    def fit(self, X_style: np.ndarray, embeddings: np.ndarray):
        """
        Fit ridge regression for each style feature dimension.

        Args:
            X_style: Style feature matrix (N x D_style)
            embeddings: Meaning embeddings (N x D_embed)
        """
        print(f"    Fitting ridge residualizer...")
        print(f"    Style dims: {X_style.shape[1]}, Embedding dims: {embeddings.shape[1]}")

        # Reduce embedding dimensionality if needed
        if embeddings.shape[1] > 64:
            pca = PCA(n_components=64)
            embeddings = pca.fit_transform(embeddings)
            self.embed_pca = pca
        else:
            self.embed_pca = None

        self.models = []
        for j in range(X_style.shape[1]):
            model = Ridge(alpha=self.alpha)
            model.fit(embeddings, X_style[:, j])
            self.models.append(model)

        self.fitted = True
        print(f"    Fitted {len(self.models)} ridge models")

    def transform(self, X_style: np.ndarray, embeddings: np.ndarray) -> np.ndarray:
        """
        Transform style features to meaning-residualized features.

        Args:
            X_style: Style feature matrix (N x D_style)
            embeddings: Meaning embeddings (N x D_embed)

        Returns:
            Residualized style features (N x D_style)
        """
        if not self.fitted:
            raise ValueError("Must call fit() before transform()")

        # Apply same PCA if used in fit
        if self.embed_pca is not None:
            embeddings = self.embed_pca.transform(embeddings)

        residuals = np.zeros_like(X_style)
        for j, model in enumerate(self.models):
            predicted = model.predict(embeddings)
            residuals[:, j] = X_style[:, j] - predicted

        return residuals

    def fit_transform(self, X_style: np.ndarray, embeddings: np.ndarray) -> np.ndarray:
        """Fit and transform in one step."""
        self.fit(X_style, embeddings)
        return self.transform(X_style, embeddings)


class MixtureNormalizer:
    """
    Mode B: Mixture-of-Experts normalization.

    Learn K normalization parameter sets (μ_k, Σ_k) from training clusters,
    then use a gating model to combine them for each sample based on its
    meaning embedding.

    This is "variable measurement standards" made deployable.
    """

    def __init__(
        self,
        n_clusters: int = 20,
        shrinkage_alpha: float = 0.1,
        gating_type: str = 'soft'  # 'soft' or 'hard'
    ):
        """
        Args:
            n_clusters: Number of meaning clusters
            shrinkage_alpha: Covariance shrinkage parameter
            gating_type: 'soft' for weighted mixture, 'hard' for nearest cluster
        """
        self.n_clusters = n_clusters
        self.shrinkage_alpha = shrinkage_alpha
        self.gating_type = gating_type

        # Learned parameters
        self.cluster_model: Optional[KMeans] = None
        self.cluster_means: Dict[int, np.ndarray] = {}
        self.cluster_covs: Dict[int, np.ndarray] = {}
        self.cluster_whitening: Dict[int, np.ndarray] = {}
        self.embed_pca: Optional[PCA] = None
        self.fitted = False

    def fit(self, X_style: np.ndarray, embeddings: np.ndarray):
        """
        Fit mixture normalization parameters.

        Args:
            X_style: Style feature matrix (N x D_style)
            embeddings: Meaning embeddings (N x D_embed)
        """
        print(f"    Fitting mixture normalizer ({self.n_clusters} clusters)...")

        # Reduce embedding dimensionality
        if embeddings.shape[1] > 64:
            self.embed_pca = PCA(n_components=64)
            embed_reduced = self.embed_pca.fit_transform(embeddings)
        else:
            self.embed_pca = None
            embed_reduced = embeddings

        # Cluster by meaning
        self.cluster_model = KMeans(n_clusters=self.n_clusters, random_state=42, n_init=10)
        cluster_labels = self.cluster_model.fit_predict(embed_reduced)

        # Compute per-cluster statistics
        d_style = X_style.shape[1]

        for k in range(self.n_clusters):
            mask = cluster_labels == k
            X_k = X_style[mask]

            if len(X_k) < 5:
                # Too few samples - use global
                self.cluster_means[k] = X_style.mean(axis=0)
                self.cluster_covs[k] = np.cov(X_style.T) + self.shrinkage_alpha * np.eye(d_style)
            else:
                self.cluster_means[k] = X_k.mean(axis=0)

                # Shrinkage covariance
                if X_k.shape[0] > X_k.shape[1]:
                    cov = np.cov(X_k.T)
                else:
                    cov = np.eye(d_style)

                if np.isnan(cov).any() or np.isinf(cov).any():
                    cov = np.eye(d_style)

                self.cluster_covs[k] = (1 - self.shrinkage_alpha) * cov + self.shrinkage_alpha * np.eye(d_style)

            # Compute whitening matrix
            try:
                cov_sqrt = sqrtm(self.cluster_covs[k])
                if np.iscomplex(cov_sqrt).any():
                    cov_sqrt = cov_sqrt.real
                self.cluster_whitening[k] = inv(cov_sqrt)
            except Exception:
                self.cluster_whitening[k] = np.eye(d_style)

        self.fitted = True
        print(f"    Fitted {self.n_clusters} cluster normalizations")

    def transform(self, X_style: np.ndarray, embeddings: np.ndarray) -> np.ndarray:
        """
        Transform style features using mixture normalization.

        Args:
            X_style: Style feature matrix (N x D_style)
            embeddings: Meaning embeddings (N x D_embed)

        Returns:
            Normalized style features (N x D_style)
        """
        if not self.fitted:
            raise ValueError("Must call fit() before transform()")

        # Reduce embeddings
        if self.embed_pca is not None:
            embed_reduced = self.embed_pca.transform(embeddings)
        else:
            embed_reduced = embeddings

        n_samples = X_style.shape[0]
        d_style = X_style.shape[1]

        if self.gating_type == 'hard':
            # Hard assignment: use nearest cluster
            cluster_labels = self.cluster_model.predict(embed_reduced)

            residuals = np.zeros_like(X_style)
            for i in range(n_samples):
                k = cluster_labels[i]
                mu = self.cluster_means[k]
                W = self.cluster_whitening[k]
                residuals[i] = W @ (X_style[i] - mu)

        else:  # soft gating
            # Soft assignment: weighted mixture based on distance to cluster centers
            distances = self.cluster_model.transform(embed_reduced)  # (N, K)

            # Convert distances to weights (inverse distance weighting)
            # Add small epsilon to avoid division by zero
            inv_dist = 1.0 / (distances + 1e-6)
            weights = inv_dist / inv_dist.sum(axis=1, keepdims=True)  # (N, K)

            residuals = np.zeros_like(X_style)
            for i in range(n_samples):
                # Weighted mean and whitening
                mu_weighted = np.zeros(d_style)
                W_weighted = np.zeros((d_style, d_style))

                for k in range(self.n_clusters):
                    mu_weighted += weights[i, k] * self.cluster_means[k]
                    W_weighted += weights[i, k] * self.cluster_whitening[k]

                residuals[i] = W_weighted @ (X_style[i] - mu_weighted)

        return residuals

    def fit_transform(self, X_style: np.ndarray, embeddings: np.ndarray) -> np.ndarray:
        """Fit and transform in one step."""
        self.fit(X_style, embeddings)
        return self.transform(X_style, embeddings)


async def test_residualization():
    """
    Test residualization methods on actual data and compare to baseline.
    """
    pool = await asyncpg.create_pool(DATABASE_URL)

    async with pool.acquire() as conn:
        # Get features and embeddings
        rows = await conn.fetch("""
            SELECT sf.features, sf.translator_id, tr.embedding
            FROM stylometric_features_v2 sf
            JOIN translations tr ON sf.translation_id = tr.id
            WHERE sf.features IS NOT NULL
              AND tr.embedding IS NOT NULL
        """)

        print(f"Loaded {len(rows)} samples with features and embeddings")

        if len(rows) < 100:
            print("Not enough data for testing")
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

        print(f"Style features: {X_style.shape}")
        print(f"Embeddings: {embeddings.shape}")

        # Test 1: Baseline (no residualization)
        print("\n" + "=" * 60)
        print("BASELINE (no residualization)")
        print("=" * 60)
        await evaluate_features(X_style, y, embeddings, "Baseline")

        # Test 2: Ridge residualization
        print("\n" + "=" * 60)
        print("RIDGE RESIDUALIZATION")
        print("=" * 60)
        ridge = RidgeResidualizer(alpha=1.0)
        X_ridge = ridge.fit_transform(X_style, embeddings)
        await evaluate_features(X_ridge, y, embeddings, "Ridge")

        # Test 3: Mixture normalization (hard)
        print("\n" + "=" * 60)
        print("MIXTURE NORMALIZATION (hard)")
        print("=" * 60)
        mixture_hard = MixtureNormalizer(n_clusters=20, gating_type='hard')
        X_mixture_hard = mixture_hard.fit_transform(X_style, embeddings)
        await evaluate_features(X_mixture_hard, y, embeddings, "Mixture-Hard")

        # Test 4: Mixture normalization (soft)
        print("\n" + "=" * 60)
        print("MIXTURE NORMALIZATION (soft)")
        print("=" * 60)
        mixture_soft = MixtureNormalizer(n_clusters=20, gating_type='soft')
        X_mixture_soft = mixture_soft.fit_transform(X_style, embeddings)
        await evaluate_features(X_mixture_soft, y, embeddings, "Mixture-Soft")

    await pool.close()


async def evaluate_features(X: np.ndarray, y: np.ndarray, embeddings: np.ndarray, name: str):
    """
    Evaluate feature set with all 5 gates.
    """
    from sklearn.linear_model import LogisticRegression
    from sklearn.model_selection import GroupKFold, cross_val_predict
    from sklearn.metrics import accuracy_score
    from sklearn.cluster import KMeans

    # Create groups (each sample is its own group for simplicity)
    groups = np.arange(len(y))

    # Map labels
    unique_labels = list(set(y))
    label_map = {t: i for i, t in enumerate(unique_labels)}
    y_mapped = np.array([label_map[yi] for yi in y])

    n_classes = len(unique_labels)
    chance = 1.0 / n_classes

    # Cluster for topics
    embed_pca = PCA(n_components=64)
    embed_reduced = embed_pca.fit_transform(embeddings)
    kmeans = KMeans(n_clusters=20, random_state=42, n_init=10)
    topics = kmeans.fit_predict(embed_reduced)

    clf = LogisticRegression(max_iter=1000, class_weight='balanced')
    gkf = GroupKFold(n_splits=5)

    # Gate 1: Real vs permuted
    real_preds = cross_val_predict(clf, X, y_mapped, cv=gkf, groups=groups)
    real_acc = accuracy_score(y_mapped, real_preds)

    perm_accs = []
    for _ in range(10):
        y_perm = np.random.permutation(y_mapped)
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
        clf_temp.fit(X[train_mask], y_mapped[train_mask])
        pred = clf_temp.predict(X[test_mask])
        topic_accs.append(accuracy_score(y_mapped[test_mask], pred))

    topic_holdout_acc = np.mean(topic_accs) if topic_accs else real_acc * 0.5
    holdout_ratio = topic_holdout_acc / real_acc if real_acc > 0 else 0
    gate2_pass = holdout_ratio >= 0.70

    # Gate 3: Confound check
    topic_preds = cross_val_predict(LogisticRegression(max_iter=1000), X, topics, cv=gkf, groups=groups)
    topic_pred_acc = accuracy_score(topics, topic_preds)
    confound = max(0, topic_pred_acc - 1.0 / 20)
    gate3_pass = confound < 0.10

    # Gate 4: Random features
    X_random = np.random.randn(X.shape[0], X.shape[1])
    random_preds = cross_val_predict(clf, X_random, y_mapped, cv=gkf, groups=groups)
    random_acc = accuracy_score(y_mapped, random_preds)
    gate4_pass = random_acc < (chance + 0.10)

    # Gate 5: Stability
    fold_accs = []
    for train_idx, test_idx in gkf.split(X, y_mapped, groups):
        clf_temp = LogisticRegression(max_iter=1000, class_weight='balanced')
        clf_temp.fit(X[train_idx], y_mapped[train_idx])
        fold_accs.append(accuracy_score(y_mapped[test_idx], clf_temp.predict(X[test_idx])))
    acc_std = np.std(fold_accs)
    gate5_pass = acc_std < 0.05

    # Results
    gates_passed = sum([gate1_pass, gate2_pass, gate3_pass, gate4_pass, gate5_pass])

    print(f"\n{name} Results:")
    print(f"  Work Accuracy: {real_acc:.3f} (chance: {chance:.3f})")
    print(f"  Topic Holdout Acc: {topic_holdout_acc:.3f}")
    print(f"  Holdout Ratio: {holdout_ratio:.3f}")
    print(f"\n  Gate 1 (Permutation): {'PASS' if gate1_pass else 'FAIL'} (perm={perm_acc:.3f})")
    print(f"  Gate 2 (Topic Holdout): {'PASS' if gate2_pass else 'FAIL'} (ratio={holdout_ratio:.3f})")
    print(f"  Gate 3 (Confound): {'PASS' if gate3_pass else 'FAIL'} (confound={confound:.3f})")
    print(f"  Gate 4 (Random): {'PASS' if gate4_pass else 'FAIL'} (random={random_acc:.3f})")
    print(f"  Gate 5 (Stability): {'PASS' if gate5_pass else 'FAIL'} (std={acc_std:.3f})")
    print(f"\n  Gates Passed: {gates_passed}/5")

    return {
        'name': name,
        'accuracy': real_acc,
        'holdout_ratio': holdout_ratio,
        'gates_passed': gates_passed,
        'gate2_pass': gate2_pass
    }


if __name__ == "__main__":
    asyncio.run(test_residualization())
