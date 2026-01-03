#!/usr/bin/env python3
"""
================================================================================
CSI: CONTEXTUALIZED STYLE INSTRUMENT
================================================================================

Advanced stylometry using:
1. Environment-conditioned whitening (within-topic normalization)
2. Topic subspace projection (remove meaning-correlated dimensions)
3. Contrastive pairs (same-author/different-topic anchors)

This addresses the Mark benchmark gap by better separating style from content.
================================================================================
"""

import numpy as np
import asyncio
import asyncpg
import os
import re
from collections import Counter, defaultdict
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.model_selection import cross_val_predict, StratifiedKFold
from sklearn.metrics import accuracy_score, f1_score
from sklearn.covariance import LedoitWolf
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ.get('DATABASE_URL', '')


class EnvironmentConditionedWhitener:
    """
    Whiten features within each topic cluster.

    This normalizes style features relative to what's typical for each
    content type, removing topic-specific baseline effects.
    """

    def __init__(self, n_clusters: int = 10):
        self.n_clusters = n_clusters
        self.cluster_means = {}
        self.cluster_whiteners = {}
        self.global_mean = None
        self.global_whitener = None
        self.kmeans = None

    def fit(self, X: np.ndarray, topic_embeddings: np.ndarray):
        """Fit whiteners for each topic cluster."""
        # Cluster by topic
        self.kmeans = KMeans(n_clusters=self.n_clusters, random_state=42, n_init=10)
        clusters = self.kmeans.fit_predict(topic_embeddings)

        # Global statistics as fallback
        self.global_mean = X.mean(axis=0)
        try:
            lw = LedoitWolf()
            lw.fit(X)
            cov = lw.covariance_
            # Regularize
            cov += np.eye(cov.shape[0]) * 1e-6
            eigvals, eigvecs = np.linalg.eigh(cov)
            eigvals = np.maximum(eigvals, 1e-6)
            self.global_whitener = eigvecs @ np.diag(1.0 / np.sqrt(eigvals)) @ eigvecs.T
        except:
            self.global_whitener = np.eye(X.shape[1])

        # Per-cluster statistics
        for c in range(self.n_clusters):
            mask = clusters == c
            if mask.sum() < 5:
                # Fall back to global for small clusters
                self.cluster_means[c] = self.global_mean
                self.cluster_whiteners[c] = self.global_whitener
                continue

            X_c = X[mask]
            self.cluster_means[c] = X_c.mean(axis=0)

            try:
                lw = LedoitWolf()
                lw.fit(X_c)
                cov = lw.covariance_
                cov += np.eye(cov.shape[0]) * 1e-6
                eigvals, eigvecs = np.linalg.eigh(cov)
                eigvals = np.maximum(eigvals, 1e-6)
                self.cluster_whiteners[c] = eigvecs @ np.diag(1.0 / np.sqrt(eigvals)) @ eigvecs.T
            except:
                self.cluster_whiteners[c] = self.global_whitener

        return self

    def transform(self, X: np.ndarray, topic_embeddings: np.ndarray) -> np.ndarray:
        """Transform using cluster-specific whitening."""
        clusters = self.kmeans.predict(topic_embeddings)

        X_whitened = np.zeros_like(X)
        for i in range(len(X)):
            c = clusters[i]
            mean = self.cluster_means.get(c, self.global_mean)
            whitener = self.cluster_whiteners.get(c, self.global_whitener)
            X_whitened[i] = (X[i] - mean) @ whitener

        return X_whitened


class TopicSubspaceProjector:
    """
    Project out the topic-predictive subspace.

    Uses regression to find the subspace that predicts topic,
    then removes that component from the features.
    """

    def __init__(self, n_topic_dims: int = 20):
        self.n_topic_dims = n_topic_dims
        self.topic_regressor = None
        self.projection_matrix = None

    def fit(self, X: np.ndarray, topic_embeddings: np.ndarray):
        """Fit the topic prediction model and compute residual projection."""
        # Reduce topic embeddings to manageable size
        pca = PCA(n_components=self.n_topic_dims)
        topic_reduced = pca.fit_transform(topic_embeddings)

        # Ridge regression: X -> topic_embedding
        self.topic_regressor = Ridge(alpha=1.0)
        self.topic_regressor.fit(X, topic_reduced)

        # The projection matrix removes topic-predictive directions
        # W = coefficients, we want to project onto null space of W
        W = self.topic_regressor.coef_.T  # shape: (n_features, n_topic_dims)

        # Orthogonalize and get residual projection
        # P = I - W @ (W^T W)^{-1} @ W^T
        try:
            WTW_inv = np.linalg.pinv(W.T @ W)
            self.projection_matrix = np.eye(X.shape[1]) - W @ WTW_inv @ W.T
        except:
            self.projection_matrix = np.eye(X.shape[1])

        return self

    def transform(self, X: np.ndarray) -> np.ndarray:
        """Project features onto topic-invariant subspace."""
        return X @ self.projection_matrix


class ContrastiveStyleEncoder:
    """
    Learn style representations using contrastive pairs.

    Positive pairs: Same author, different topic
    Negative pairs: Different author, same topic

    This encourages the representation to capture author-specific
    patterns that are invariant to content.
    """

    def __init__(self, output_dim: int = 32, n_epochs: int = 100):
        self.output_dim = output_dim
        self.n_epochs = n_epochs
        self.W = None
        self.bias = None

    def fit(self, X: np.ndarray, authors: np.ndarray, topics: np.ndarray):
        """Learn contrastive representation."""
        n_samples, n_features = X.shape

        # Initialize projection
        self.W = np.random.randn(n_features, self.output_dim) * 0.01
        self.bias = np.zeros(self.output_dim)

        # Build contrastive pairs
        # Positive: same author, different topic
        # Negative: different author

        author_to_indices = defaultdict(list)
        topic_to_indices = defaultdict(list)

        for i, (a, t) in enumerate(zip(authors, topics)):
            author_to_indices[a].append(i)
            topic_to_indices[t].append(i)

        # Learning rate
        lr = 0.01

        for epoch in range(self.n_epochs):
            # Sample contrastive batches
            loss = 0.0
            n_pairs = 0

            for anchor_idx in range(n_samples):
                anchor_author = authors[anchor_idx]
                anchor_topic = topics[anchor_idx]

                # Find positive: same author, different topic
                pos_candidates = [i for i in author_to_indices[anchor_author]
                                  if topics[i] != anchor_topic]
                if not pos_candidates:
                    continue

                pos_idx = np.random.choice(pos_candidates)

                # Find negative: different author
                neg_candidates = [i for i in range(n_samples)
                                  if authors[i] != anchor_author]
                if not neg_candidates:
                    continue

                neg_idx = np.random.choice(neg_candidates)

                # Compute embeddings
                z_anchor = X[anchor_idx] @ self.W + self.bias
                z_pos = X[pos_idx] @ self.W + self.bias
                z_neg = X[neg_idx] @ self.W + self.bias

                # Triplet loss with margin
                margin = 1.0
                d_pos = np.sum((z_anchor - z_pos) ** 2)
                d_neg = np.sum((z_anchor - z_neg) ** 2)

                triplet_loss = max(0, d_pos - d_neg + margin)
                loss += triplet_loss
                n_pairs += 1

                if triplet_loss > 0:
                    # Gradient update
                    grad_anchor = 2 * (z_anchor - z_pos) - 2 * (z_anchor - z_neg)
                    grad_pos = -2 * (z_anchor - z_pos)
                    grad_neg = 2 * (z_anchor - z_neg)

                    # Update W
                    self.W -= lr * (np.outer(X[anchor_idx], grad_anchor) +
                                    np.outer(X[pos_idx], grad_pos) +
                                    np.outer(X[neg_idx], grad_neg)) / 3
                    self.bias -= lr * (grad_anchor + grad_pos + grad_neg) / 3

            if epoch % 20 == 0:
                avg_loss = loss / max(n_pairs, 1)
                # print(f"  Epoch {epoch}: loss = {avg_loss:.4f}")

        return self

    def transform(self, X: np.ndarray) -> np.ndarray:
        """Transform to contrastive style space."""
        return X @ self.W + self.bias


class CSIStylometry:
    """
    Full CSI pipeline combining all components.
    """

    def __init__(self, n_clusters: int = 10, n_topic_dims: int = 20, output_dim: int = 32):
        self.n_clusters = n_clusters
        self.n_topic_dims = n_topic_dims
        self.output_dim = output_dim

        self.scaler = StandardScaler()
        self.whitener = EnvironmentConditionedWhitener(n_clusters)
        self.projector = TopicSubspaceProjector(n_topic_dims)
        self.encoder = ContrastiveStyleEncoder(output_dim)
        self.final_scaler = StandardScaler()

    def fit(self, X: np.ndarray, authors: np.ndarray, topic_embeddings: np.ndarray):
        """Fit the full CSI pipeline."""
        # 1. Initial scaling
        X_scaled = self.scaler.fit_transform(X)

        # 2. Cluster topics
        topics = KMeans(n_clusters=self.n_clusters, random_state=42, n_init=10).fit_predict(topic_embeddings)

        # 3. Environment-conditioned whitening
        self.whitener.fit(X_scaled, topic_embeddings)
        X_whitened = self.whitener.transform(X_scaled, topic_embeddings)

        # 4. Topic subspace projection
        self.projector.fit(X_whitened, topic_embeddings)
        X_projected = self.projector.transform(X_whitened)

        # 5. Contrastive encoding
        self.encoder.fit(X_projected, authors, topics)
        X_encoded = self.encoder.transform(X_projected)

        # 6. Final scaling
        self.final_scaler.fit(X_encoded)

        return self

    def transform(self, X: np.ndarray, topic_embeddings: np.ndarray) -> np.ndarray:
        """Transform through full CSI pipeline."""
        X_scaled = self.scaler.transform(X)
        X_whitened = self.whitener.transform(X_scaled, topic_embeddings)
        X_projected = self.projector.transform(X_whitened)
        X_encoded = self.encoder.transform(X_projected)
        X_final = self.final_scaler.transform(X_encoded)
        return X_final


# Greek feature extractor (same as in mark_reconstruction_benchmark.py)
GREEK_FUNCTION_WORDS = [
    'ὁ', 'ἡ', 'τό', 'τοῦ', 'τῆς', 'τῷ', 'τῇ', 'τόν', 'τήν',
    'οἱ', 'αἱ', 'τά', 'τῶν', 'τοῖς', 'ταῖς', 'τούς', 'τάς',
    'ἐν', 'εἰς', 'ἐκ', 'ἐξ', 'ἀπό', 'πρός', 'διά', 'κατά', 'μετά', 'περί',
    'καί', 'δέ', 'γάρ', 'ἀλλά', 'ἤ', 'εἰ', 'ἐάν', 'ὅτι', 'ὡς', 'ἵνα',
    'μή', 'οὐ', 'οὐκ', 'οὐχ',
    'ἐγώ', 'σύ', 'αὐτός', 'αὐτή', 'αὐτό', 'ἡμεῖς', 'ὑμεῖς',
    'οὗτος', 'ἐκεῖνος', 'ὅς', 'τίς',
    'μέν', 'οὖν', 'νῦν', 'τότε', 'πάλιν', 'εὐθύς', 'εὐθέως',
    'εἰμί', 'ἐστίν', 'ἦν', 'ἔχω', 'λέγω', 'λέγει', 'εἶπεν',
]

def normalize_greek(word):
    return re.sub(r'[^\u0370-\u03FF\u1F00-\u1FFF]', '', word.lower())

GREEK_FUNCTION_SET = set(normalize_greek(w) for w in GREEK_FUNCTION_WORDS)


class GreekFeatureExtractor:
    def __init__(self):
        self.function_words = [normalize_greek(w) for w in GREEK_FUNCTION_WORDS]

    def tokenize(self, text):
        return re.findall(r'[\u0370-\u03FF\u1F00-\u1FFF]+', text.lower())

    def extract_features(self, text):
        words = self.tokenize(text)
        total = len(words) if words else 1
        counts = Counter(words)

        features = {}
        for i, fw in enumerate(self.function_words[:50]):
            features[f'fw_{i}'] = counts.get(fw, 0) / total * 1000

        if words:
            lengths = [len(w) for w in words]
            features['word_len_mean'] = np.mean(lengths)
            features['word_len_std'] = np.std(lengths)
        else:
            features['word_len_mean'] = 0
            features['word_len_std'] = 0

        fw_count = sum(1 for w in words if w in GREEK_FUNCTION_SET)
        features['fw_ratio'] = fw_count / total * 100

        kai_count = counts.get('καί', 0) + counts.get('και', 0)
        features['kai_rate'] = kai_count / total * 1000

        return features

    def extract_vector(self, text):
        features = self.extract_features(text)
        return np.array(list(features.values()))


async def load_synoptic_data(pool):
    async with pool.acquire() as conn:
        triple = await conn.fetch("""
            SELECT alignment_group, matthew_text, mark_text, luke_text
            FROM synoptic_alignments
            WHERE tradition_type = 'triple'
              AND matthew_text IS NOT NULL
              AND mark_text IS NOT NULL
              AND luke_text IS NOT NULL
        """)

        double = await conn.fetch("""
            SELECT alignment_group, matthew_text, luke_text
            FROM synoptic_alignments
            WHERE tradition_type = 'double_mt_lk'
              AND matthew_text IS NOT NULL
              AND luke_text IS NOT NULL
        """)

    return list(triple), list(double)


async def run_csi_benchmark(pool):
    """Run Mark benchmark with CSI enhancement."""
    print("=" * 70)
    print("CSI-ENHANCED MARK RECONSTRUCTION BENCHMARK")
    print("=" * 70)

    triple, double = await load_synoptic_data(pool)
    print(f"\nData: {len(triple)} triple, {len(double)} double passages")

    extractor = GreekFeatureExtractor()

    # Build dataset for CSI training
    # Use triple tradition gospels as training data
    X_train = []
    authors_train = []  # 0=Mt, 1=Mk, 2=Lk
    texts_train = []

    for row in triple:
        X_train.append(extractor.extract_vector(row['matthew_text']))
        authors_train.append(0)
        texts_train.append(row['matthew_text'])

        X_train.append(extractor.extract_vector(row['mark_text']))
        authors_train.append(1)
        texts_train.append(row['mark_text'])

        X_train.append(extractor.extract_vector(row['luke_text']))
        authors_train.append(2)
        texts_train.append(row['luke_text'])

    X_train = np.array(X_train)
    authors_train = np.array(authors_train)
    X_train = np.nan_to_num(X_train, nan=0.0, posinf=0.0, neginf=0.0)

    # Create simple topic embeddings (use features themselves for clustering)
    topic_embeddings = X_train.copy()

    print("\nTraining CSI encoder...")
    csi = CSIStylometry(n_clusters=5, n_topic_dims=10, output_dim=16)
    csi.fit(X_train, authors_train, topic_embeddings)

    # Transform
    X_csi = csi.transform(X_train, topic_embeddings)

    # =========================================================================
    # TEST: Gospel Identification with CSI
    # =========================================================================
    print("\n" + "-" * 70)
    print("GOSPEL IDENTIFICATION (CSI-enhanced)")
    print("-" * 70)

    clf = LogisticRegression(max_iter=1000, class_weight='balanced')
    cv = StratifiedKFold(n_splits=min(5, len(triple)))

    # Without CSI (baseline)
    scaler = StandardScaler()
    X_baseline = scaler.fit_transform(X_train)
    preds_baseline = cross_val_predict(clf, X_baseline, authors_train, cv=cv)
    baseline_acc = accuracy_score(authors_train, preds_baseline)
    baseline_f1 = f1_score(authors_train, preds_baseline, average='macro')

    # With CSI
    preds_csi = cross_val_predict(clf, X_csi, authors_train, cv=cv)
    csi_acc = accuracy_score(authors_train, preds_csi)
    csi_f1 = f1_score(authors_train, preds_csi, average='macro')

    print(f"\nBaseline (no CSI):")
    print(f"  Accuracy: {baseline_acc:.3f}")
    print(f"  Macro F1: {baseline_f1:.3f}")

    print(f"\nWith CSI:")
    print(f"  Accuracy: {csi_acc:.3f}")
    print(f"  Macro F1: {csi_f1:.3f}")

    improvement = (csi_f1 - baseline_f1) / baseline_f1 * 100
    print(f"\nImprovement: {improvement:+.1f}%")

    # Per-gospel results
    print("\nPer-Gospel (CSI):")
    for i, name in enumerate(['Matthew', 'Mark', 'Luke']):
        mask = authors_train == i
        if mask.sum() > 0:
            acc = accuracy_score(authors_train[mask], preds_csi[mask])
            print(f"  {name}: {acc:.3f}")

    # =========================================================================
    # TEST 1 with CSI: Triple vs Double
    # =========================================================================
    print("\n" + "-" * 70)
    print("TRIPLE vs DOUBLE (CSI-enhanced)")
    print("-" * 70)

    X_all = []
    y_all = []

    for row in triple:
        combined = f"{row['matthew_text']} {row['luke_text']}"
        X_all.append(extractor.extract_vector(combined))
        y_all.append(1)

    for row in double:
        combined = f"{row['matthew_text']} {row['luke_text']}"
        X_all.append(extractor.extract_vector(combined))
        y_all.append(0)

    X_all = np.array(X_all)
    y_all = np.array(y_all)
    X_all = np.nan_to_num(X_all, nan=0.0, posinf=0.0, neginf=0.0)

    # Need to create embeddings for new data
    topic_emb_all = X_all.copy()

    # Fit new CSI on combined data
    # Create pseudo-authors based on triple/double
    pseudo_authors = y_all.copy()
    csi_all = CSIStylometry(n_clusters=3, n_topic_dims=5, output_dim=8)
    csi_all.fit(X_all, pseudo_authors, topic_emb_all)
    X_all_csi = csi_all.transform(X_all, topic_emb_all)

    cv_all = StratifiedKFold(n_splits=min(5, min(sum(y_all==0), sum(y_all==1))))

    # Baseline
    X_all_baseline = StandardScaler().fit_transform(X_all)
    preds_baseline_all = cross_val_predict(clf, X_all_baseline, y_all, cv=cv_all)
    test1_baseline_f1 = f1_score(y_all, preds_baseline_all, average='binary')

    # CSI
    preds_csi_all = cross_val_predict(clf, X_all_csi, y_all, cv=cv_all)
    test1_csi_f1 = f1_score(y_all, preds_csi_all, average='binary')

    print(f"\nBaseline F1: {test1_baseline_f1:.3f}")
    print(f"CSI F1: {test1_csi_f1:.3f}")

    # =========================================================================
    # SUMMARY
    # =========================================================================
    print("\n" + "=" * 70)
    print("CSI BENCHMARK SUMMARY")
    print("=" * 70)

    # Weighted F1 (same as original benchmark)
    overall_csi_f1 = (test1_csi_f1 * 0.3 + csi_f1 * 0.7)
    overall_baseline_f1 = (test1_baseline_f1 * 0.3 + baseline_f1 * 0.7)

    print(f"\nWithout CSI:")
    print(f"  Test 1 (Triple vs Double): F1 = {test1_baseline_f1:.3f}")
    print(f"  Test 2 (Gospel ID): F1 = {baseline_f1:.3f}")
    print(f"  Overall F1: {overall_baseline_f1:.3f}")

    print(f"\nWith CSI:")
    print(f"  Test 1 (Triple vs Double): F1 = {test1_csi_f1:.3f}")
    print(f"  Test 2 (Gospel ID): F1 = {csi_f1:.3f}")
    print(f"  Overall F1: {overall_csi_f1:.3f}")

    print(f"\nTarget: F1 >= 0.60")

    if overall_csi_f1 >= 0.60:
        print("\n✓ BENCHMARK PASSED with CSI!")
    else:
        print(f"\n✗ Still below target. Gap: {0.60 - overall_csi_f1:.3f}")
        print("  Consider: more data, better topic embeddings, or larger contrastive training")

    return {
        'baseline_f1': overall_baseline_f1,
        'csi_f1': overall_csi_f1,
        'improvement': overall_csi_f1 - overall_baseline_f1,
        'passed': overall_csi_f1 >= 0.60
    }


async def main():
    pool = await asyncpg.create_pool(DATABASE_URL)
    results = await run_csi_benchmark(pool)
    await pool.close()
    return results


if __name__ == "__main__":
    asyncio.run(main())
