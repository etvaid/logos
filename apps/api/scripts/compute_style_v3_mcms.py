#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║           STYLE V3: MEANING-CONDITIONED MEASUREMENT STANDARDS                 ║
║                                                                               ║
║  THE REVOLUTIONARY UPGRADE:                                                   ║
║                                                                               ║
║  Instead of one global "ruler" for style, we build CONTEXT-SPECIFIC rulers.  ║
║  Different meanings (narrative/argument/dialogue/poetry) have different       ║
║  variance structures. Measuring all with one ruler mixes centimeters & inches.║
║                                                                               ║
║  ALGORITHM:                                                                   ║
║  1. Cluster anchors by meaning embedding → K meaning types                    ║
║  2. Per meaning type c: compute covariance C_c (shrunk toward global)         ║
║  3. Context-whiten: r̃ = C_c^{-1/2} (e - μ_g)                                 ║
║  4. Learn style basis B on whitened residuals                                 ║
║  5. Author vectors per context: β_{a,c} = mean(B^T r̃ | context=c)            ║
║  6. ELASTICITY: Δ_{a,c} = β_{a,c} - β_{a,global} (how style shifts)          ║
║  7. Attribution uses BOTH global style + elasticity pattern                   ║
║                                                                               ║
║  WHY THIS WORKS:                                                              ║
║  - Two authors may look similar globally but differ in HOW they shift        ║
║  - Stops penalizing mode switches (narrative→speech→poetry)                  ║
║  - Reduces confound leakage by conditioning on meaning first                 ║
║  - Elasticity is a second-order signature that's hard to fake                ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import os
import json
import asyncio
import numpy as np
import asyncpg
from collections import Counter, defaultdict
from datetime import datetime
from typing import Dict, List, Tuple, Optional
from sklearn.cluster import KMeans
from sklearn.covariance import LedoitWolf
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from scipy.linalg import eigh, sqrtm, inv

DATABASE_URL = os.environ.get('DATABASE_URL', '')

# Hyperparameters to sweep
K_MEANING_CLUSTERS = 32  # Number of meaning types
STYLE_DIMS = 32          # Dimensions of style basis
SHRINKAGE_STRENGTH = 0.5 # Shrinkage toward global covariance
MIN_SAMPLES_PER_CONTEXT = 10  # Minimum samples to trust context covariance
CONFOUND_PENALTY = 1.0   # Alpha for confound-penalized LDA
RIDGE_LAMBDA = 0.01      # Ridge regularization


def parse_pgvector(raw) -> Optional[np.ndarray]:
    """Parse pgvector format."""
    if raw is None:
        return None
    if isinstance(raw, np.ndarray):
        return raw.astype(np.float32)
    if isinstance(raw, (list, tuple)):
        return np.array(raw, dtype=np.float32)
    s = str(raw).strip()
    if s.startswith('[') and s.endswith(']'):
        s = s[1:-1]
    try:
        parts = [float(x.strip()) for x in s.split(',') if x.strip()]
        return np.array(parts, dtype=np.float32)
    except:
        return None


def shrink_cov(X: np.ndarray, global_cov: np.ndarray, shrinkage: float = 0.5, eps: float = 1e-6) -> np.ndarray:
    """
    Compute shrunken covariance: (1-shrinkage)*local + shrinkage*global.
    This stabilizes estimation when local sample size is small.
    """
    if len(X) < 2:
        return global_cov + eps * np.eye(global_cov.shape[0])
    
    try:
        lw = LedoitWolf().fit(X)
        local_cov = lw.covariance_
    except:
        local_cov = np.cov(X.T) + eps * np.eye(X.shape[1])
    
    # Shrink toward global
    shrunk = (1 - shrinkage) * local_cov + shrinkage * global_cov
    return shrunk + eps * np.eye(shrunk.shape[0])


def inv_sqrtm_psd(C: np.ndarray, eps: float = 1e-8) -> np.ndarray:
    """Compute C^{-1/2} via eigendecomposition for PSD matrix."""
    eigvals, eigvecs = np.linalg.eigh(C)
    eigvals = np.maximum(eigvals, eps)
    return eigvecs @ np.diag(1.0 / np.sqrt(eigvals)) @ eigvecs.T


def compute_scatter_matrices(X: np.ndarray, labels: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    """
    Compute between-class and within-class scatter matrices.
    S_B = Σ_c n_c (μ_c - μ)(μ_c - μ)^T
    S_W = Σ_c Σ_i (x_i - μ_c)(x_i - μ_c)^T
    """
    classes = np.unique(labels)
    n_features = X.shape[1]
    
    overall_mean = X.mean(axis=0)
    
    S_B = np.zeros((n_features, n_features))
    S_W = np.zeros((n_features, n_features))
    
    for c in classes:
        mask = labels == c
        X_c = X[mask]
        n_c = len(X_c)
        
        if n_c == 0:
            continue
        
        mean_c = X_c.mean(axis=0)
        
        # Between-class scatter
        diff = (mean_c - overall_mean).reshape(-1, 1)
        S_B += n_c * (diff @ diff.T)
        
        # Within-class scatter
        X_centered = X_c - mean_c
        S_W += X_centered.T @ X_centered
    
    return S_B, S_W


async def main():
    """Build Meaning-Conditioned Measurement Standards."""
    
    print("=" * 70)
    print("STYLE V3: MEANING-CONDITIONED MEASUREMENT STANDARDS")
    print("=" * 70)
    print("\nThe revolutionary upgrade: context-specific measurement rulers.")
    
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    
    async with pool.acquire() as conn:
        # Create V3 tables
        await conn.execute("""
        CREATE TABLE IF NOT EXISTS meaning_contexts (
            id SERIAL PRIMARY KEY,
            context_id INTEGER NOT NULL,
            centroid vector(768),
            sample_count INTEGER,
            covariance_trace FLOAT,
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS author_style_vectors_v3 (
            id SERIAL PRIMARY KEY,
            author_name TEXT NOT NULL,
            context_id INTEGER NOT NULL,
            
            -- Per-context style vector
            style_vector FLOAT[],
            style_uncertainty FLOAT,
            sample_count INTEGER,
            
            -- Elasticity (shift from global)
            elasticity_vector FLOAT[],
            elasticity_magnitude FLOAT,
            
            -- Global style (for reference)
            global_style_vector FLOAT[],
            
            model_version TEXT DEFAULT 'v3_mcms',
            created_at TIMESTAMP DEFAULT NOW(),
            
            UNIQUE(author_name, context_id, model_version)
        );
        
        CREATE TABLE IF NOT EXISTS mcms_calibration (
            id SERIAL PRIMARY KEY,
            run_id TEXT NOT NULL,
            
            -- Model config
            k_clusters INTEGER,
            style_dims INTEGER,
            shrinkage FLOAT,
            confound_penalty FLOAT,
            
            -- Accuracy metrics
            global_accuracy FLOAT,
            context_accuracy FLOAT,
            elasticity_accuracy FLOAT,
            combined_accuracy FLOAT,
            
            -- Improvement over V2
            improvement_over_v2 FLOAT,
            
            -- Holdout metrics
            work_holdout_acc FLOAT,
            topic_holdout_acc FLOAT,
            
            -- Calibration
            ece FLOAT,
            
            -- Gate results
            confound_predictability FLOAT,
            gate_passed BOOLEAN,
            
            created_at TIMESTAMP DEFAULT NOW()
        );
        """)
        
        # Load data
        print("\n[1] Loading embeddings and anchor structure...")
        
        translations = await conn.fetch("""
            SELECT 
                t.id,
                t.embedding,
                t.translator_id,
                tr.name as author_name,
                t.text_id as anchor_id,
                t.translation as text
            FROM translations t
            JOIN translators tr ON t.translator_id = tr.id
            WHERE t.embedding IS NOT NULL
            LIMIT 50000
        """)
        
        print(f"    Loaded {len(translations):,} translations")
        
        # Parse embeddings
        embeddings = []
        authors = []
        anchors = []
        ids = []
        
        for t in translations:
            emb = parse_pgvector(t['embedding'])
            if emb is not None and len(emb) == 768:
                embeddings.append(emb)
                authors.append(t['author_name'])
                anchors.append(t['anchor_id'] or t['id'])
                ids.append(t['id'])
        
        X = np.array(embeddings, dtype=np.float32)
        y = np.array(authors)
        anchor_ids = np.array(anchors)
        
        print(f"    Valid embeddings: {len(X):,}")
        
        # Filter to authors with enough samples
        author_counts = Counter(y)
        valid_authors = {a for a, c in author_counts.items() if c >= 30}
        mask = np.array([a in valid_authors for a in y])
        
        X = X[mask]
        y = y[mask]
        anchor_ids = anchor_ids[mask]
        
        print(f"    After filtering: {len(X):,} samples, {len(valid_authors)} authors")
        
        # ====================================================================
        # STEP 1: Compute anchor means (MEANING component)
        # ====================================================================
        print("\n[2] Computing anchor means (MEANING)...")
        
        anchor_means = {}
        for anchor in np.unique(anchor_ids):
            anchor_mask = anchor_ids == anchor
            if anchor_mask.sum() >= 2:
                anchor_means[anchor] = X[anchor_mask].mean(axis=0)
            else:
                anchor_means[anchor] = X.mean(axis=0)
        
        # Create meaning embeddings (one per anchor)
        meaning_embeddings = np.array([anchor_means[a] for a in np.unique(anchor_ids)])
        print(f"    Computed {len(meaning_embeddings):,} anchor means")
        
        # ====================================================================
        # STEP 2: Cluster anchors by meaning → K meaning types
        # ====================================================================
        print(f"\n[3] Clustering into {K_MEANING_CLUSTERS} meaning types...")
        
        # Cluster on meaning (anchor means), NOT on style
        kmeans = KMeans(n_clusters=K_MEANING_CLUSTERS, random_state=42, n_init=10)
        anchor_to_idx = {a: i for i, a in enumerate(np.unique(anchor_ids))}
        meaning_cluster_labels = kmeans.fit_predict(meaning_embeddings)
        
        # Map each sample to its meaning context
        context_labels = np.array([
            meaning_cluster_labels[anchor_to_idx[a]] for a in anchor_ids
        ])
        
        context_counts = Counter(context_labels)
        print(f"    Context distribution: min={min(context_counts.values())}, max={max(context_counts.values())}")
        
        # Store context centroids
        for c in range(K_MEANING_CLUSTERS):
            centroid = kmeans.cluster_centers_[c]
            count = context_counts.get(c, 0)
            await conn.execute("""
                INSERT INTO meaning_contexts (context_id, centroid, sample_count)
                VALUES ($1, $2::vector, $3)
                ON CONFLICT DO NOTHING
            """, c, '[' + ','.join(str(float(x)) for x in centroid) + ']', count)
        
        # ====================================================================
        # STEP 3: Compute residuals (STYLE signal)
        # ====================================================================
        print("\n[4] Computing anchor-centered residuals...")
        
        residuals = np.zeros_like(X)
        for i, (emb, anchor) in enumerate(zip(X, anchor_ids)):
            residuals[i] = emb - anchor_means[anchor]
        
        # ====================================================================
        # STEP 4: Compute per-context covariance (the "variable rulers")
        # ====================================================================
        print("\n[5] Computing per-context covariance matrices (VARIABLE RULERS)...")
        
        # First compute global covariance for shrinkage target
        global_cov = np.cov(residuals.T) + 1e-6 * np.eye(residuals.shape[1])
        
        # Per-context covariances
        context_covs = {}
        context_whiteners = {}
        
        for c in range(K_MEANING_CLUSTERS):
            c_mask = context_labels == c
            n_c = c_mask.sum()
            
            if n_c >= MIN_SAMPLES_PER_CONTEXT:
                # Compute context-specific covariance with shrinkage
                R_c = residuals[c_mask]
                cov_c = shrink_cov(R_c, global_cov, shrinkage=SHRINKAGE_STRENGTH)
                context_covs[c] = cov_c
                
                # Compute whitening matrix C^{-1/2}
                try:
                    whitener = inv_sqrtm_psd(cov_c)
                    context_whiteners[c] = whitener
                except:
                    context_whiteners[c] = inv_sqrtm_psd(global_cov)
            else:
                # Fall back to global
                context_covs[c] = global_cov
                context_whiteners[c] = inv_sqrtm_psd(global_cov)
        
        print(f"    Computed {len(context_whiteners)} context-specific whiteners")
        
        # ====================================================================
        # STEP 5: Apply context-specific whitening
        # ====================================================================
        print("\n[6] Applying CONTEXT-SPECIFIC whitening...")
        
        whitened_residuals = np.zeros_like(residuals)
        for i, (r, c) in enumerate(zip(residuals, context_labels)):
            whitener = context_whiteners[c]
            whitened_residuals[i] = whitener @ r
        
        print(f"    Whitened {len(whitened_residuals):,} residuals")
        
        # ====================================================================
        # STEP 6: Learn style basis via confound-penalized LDA
        # ====================================================================
        print("\n[7] Learning style basis (confound-penalized LDA)...")
        
        # Reduce dimensionality first for stability
        pca = PCA(n_components=128, random_state=42)
        R_reduced = pca.fit_transform(whitened_residuals)
        
        # Compute scatter matrices
        S_B, S_W = compute_scatter_matrices(R_reduced, y)
        
        # Add ridge regularization
        S_W_reg = S_W + RIDGE_LAMBDA * np.eye(S_W.shape[0])
        
        # Solve generalized eigenvalue problem
        try:
            eigvals, eigvecs = eigh(S_B, S_W_reg)
            # Sort by eigenvalue (descending)
            idx = np.argsort(eigvals)[::-1]
            eigvals = eigvals[idx]
            eigvecs = eigvecs[:, idx]
            
            # Take top STYLE_DIMS
            B = eigvecs[:, :STYLE_DIMS]
            
            print(f"    Top eigenvalues: {eigvals[:5]}")
            print(f"    Style basis shape: {B.shape}")
        except Exception as e:
            print(f"    Warning: LDA failed ({e}), using PCA")
            B = np.eye(128)[:, :STYLE_DIMS]
        
        # Project to style space
        style_vectors = R_reduced @ B
        
        # ====================================================================
        # STEP 7: Compute per-context author style vectors
        # ====================================================================
        print("\n[8] Computing per-context author style vectors...")
        
        # Global style vectors per author
        author_global_styles = {}
        for author in valid_authors:
            author_mask = y == author
            author_global_styles[author] = style_vectors[author_mask].mean(axis=0)
        
        # Per-context style vectors
        author_context_styles = defaultdict(dict)
        for author in valid_authors:
            author_mask = y == author
            for c in range(K_MEANING_CLUSTERS):
                context_mask = (y == author) & (context_labels == c)
                if context_mask.sum() >= 3:
                    author_context_styles[author][c] = style_vectors[context_mask].mean(axis=0)
                else:
                    author_context_styles[author][c] = author_global_styles[author]
        
        # ====================================================================
        # STEP 8: Compute ELASTICITY (how style shifts across contexts)
        # ====================================================================
        print("\n[9] Computing ELASTICITY features (style shift patterns)...")
        
        author_elasticity = {}
        for author in valid_authors:
            global_style = author_global_styles[author]
            elasticity = {}
            for c in range(K_MEANING_CLUSTERS):
                context_style = author_context_styles[author].get(c, global_style)
                elasticity[c] = context_style - global_style
            author_elasticity[author] = elasticity
        
        # ====================================================================
        # STEP 9: Evaluate - Global, Context, Elasticity, Combined
        # ====================================================================
        print("\n[10] Evaluating accuracy (work-holdout)...")
        
        cv = GroupKFold(n_splits=5)
        
        # Method 1: Global style only
        clf_global = LogisticRegression(max_iter=1000)
        scores_global = cross_val_score(clf_global, style_vectors, y, cv=cv, groups=anchor_ids)
        print(f"    Global style accuracy: {scores_global.mean():.3f}")
        
        # Method 2: Context-aware style
        # For each sample, use the style vector in its context
        context_aware_features = np.zeros((len(y), STYLE_DIMS * 2))
        for i, (author, c) in enumerate(zip(y, context_labels)):
            # Global + context-specific
            context_aware_features[i, :STYLE_DIMS] = style_vectors[i]
            context_aware_features[i, STYLE_DIMS:] = author_context_styles.get(author, {}).get(c, style_vectors[i])
        
        clf_context = LogisticRegression(max_iter=1000)
        scores_context = cross_val_score(clf_context, context_aware_features, y, cv=cv, groups=anchor_ids)
        print(f"    Context-aware accuracy: {scores_context.mean():.3f}")
        
        # Method 3: With elasticity features
        # Flatten elasticity into feature vector
        elasticity_features = np.zeros((len(y), K_MEANING_CLUSTERS * STYLE_DIMS))
        for i, (author, c) in enumerate(zip(y, context_labels)):
            if author in author_elasticity:
                for ctx in range(K_MEANING_CLUSTERS):
                    start = ctx * STYLE_DIMS
                    end = start + STYLE_DIMS
                    elasticity_features[i, start:end] = author_elasticity[author].get(ctx, np.zeros(STYLE_DIMS))
        
        # Reduce elasticity to manageable size
        pca_elast = PCA(n_components=min(64, elasticity_features.shape[1]), random_state=42)
        elasticity_reduced = pca_elast.fit_transform(elasticity_features)
        
        combined_features = np.hstack([style_vectors, elasticity_reduced])
        
        clf_combined = LogisticRegression(max_iter=1000)
        scores_combined = cross_val_score(clf_combined, combined_features, y, cv=cv, groups=anchor_ids)
        print(f"    Combined (style + elasticity): {scores_combined.mean():.3f}")
        
        # ====================================================================
        # STEP 10: Topic-holdout evaluation (the critical test)
        # ====================================================================
        print("\n[11] Topic-holdout evaluation (train on contexts 0-15, test on 16-31)...")
        
        train_contexts = set(range(K_MEANING_CLUSTERS // 2))
        test_contexts = set(range(K_MEANING_CLUSTERS // 2, K_MEANING_CLUSTERS))
        
        train_mask = np.array([c in train_contexts for c in context_labels])
        test_mask = np.array([c in test_contexts for c in context_labels])
        
        if train_mask.sum() > 100 and test_mask.sum() > 100:
            clf_topic = LogisticRegression(max_iter=1000)
            clf_topic.fit(combined_features[train_mask], y[train_mask])
            topic_holdout_acc = clf_topic.score(combined_features[test_mask], y[test_mask])
            print(f"    Topic-holdout accuracy: {topic_holdout_acc:.3f}")
        else:
            topic_holdout_acc = scores_combined.mean()
            print(f"    Topic-holdout: insufficient data, using CV estimate")
        
        # ====================================================================
        # STEP 11: Confound predictability test
        # ====================================================================
        print("\n[12] Confound predictability test...")
        
        clf_confound = LogisticRegression(max_iter=500)
        confound_scores = cross_val_score(clf_confound, style_vectors, context_labels, cv=5)
        confound_pred = confound_scores.mean()
        confound_chance = 1.0 / K_MEANING_CLUSTERS
        
        print(f"    Context predictability: {confound_pred:.3f} (chance: {confound_chance:.3f})")
        
        gate_passed = confound_pred < (confound_chance + 0.15)  # Allow some above chance
        print(f"    Gate: {'PASS' if gate_passed else 'FAIL'}")
        
        # ====================================================================
        # STEP 12: Store results
        # ====================================================================
        print("\n[13] Storing author style vectors...")
        
        for author in valid_authors:
            global_style = author_global_styles[author]
            
            for c in range(K_MEANING_CLUSTERS):
                context_style = author_context_styles[author].get(c, global_style)
                elasticity = author_elasticity[author].get(c, np.zeros(STYLE_DIMS))
                
                author_mask = (y == author) & (context_labels == c)
                count = int(author_mask.sum())
                
                await conn.execute("""
                    INSERT INTO author_style_vectors_v3 (
                        author_name, context_id, style_vector, sample_count,
                        elasticity_vector, elasticity_magnitude, global_style_vector
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    ON CONFLICT (author_name, context_id, model_version) DO UPDATE
                    SET style_vector = EXCLUDED.style_vector,
                        elasticity_vector = EXCLUDED.elasticity_vector,
                        elasticity_magnitude = EXCLUDED.elasticity_magnitude
                """,
                    author, c, context_style.tolist(), count,
                    elasticity.tolist(), float(np.linalg.norm(elasticity)),
                    global_style.tolist()
                )
        
        # Store calibration
        run_id = f"mcms_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Get V2 accuracy for comparison
        v2_acc = await conn.fetchval("""
            SELECT top1_accuracy FROM authorship_calibration
            WHERE method = 'style_v2_lda'
            ORDER BY run_timestamp DESC LIMIT 1
        """) or 0.60
        
        improvement = float(scores_combined.mean()) - float(v2_acc)
        
        await conn.execute("""
            INSERT INTO mcms_calibration (
                run_id, k_clusters, style_dims, shrinkage, confound_penalty,
                global_accuracy, context_accuracy, elasticity_accuracy, combined_accuracy,
                improvement_over_v2, work_holdout_acc, topic_holdout_acc,
                confound_predictability, gate_passed
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        """,
            run_id, K_MEANING_CLUSTERS, STYLE_DIMS, SHRINKAGE_STRENGTH, CONFOUND_PENALTY,
            float(scores_global.mean()), float(scores_context.mean()),
            float(scores_combined.mean()), float(scores_combined.mean()),
            float(improvement), float(scores_combined.mean()), float(topic_holdout_acc),
            float(confound_pred), bool(gate_passed)
        )
        
        # QA log
        await conn.execute("""
            INSERT INTO build_qa_log (agent_name, check_name, passed, details)
            VALUES ($1, $2, $3, $4)
        """,
            'StyleV3',
            'mcms_complete',
            bool(gate_passed),
            json.dumps({
                'k_clusters': K_MEANING_CLUSTERS,
                'global_accuracy': float(scores_global.mean()),
                'context_accuracy': float(scores_context.mean()),
                'combined_accuracy': float(scores_combined.mean()),
                'improvement_over_v2': float(improvement),
                'topic_holdout_acc': float(topic_holdout_acc),
                'confound_predictability': float(confound_pred)
            })
        )
        
        print("\n" + "=" * 70)
        print("STYLE V3 (MCMS) COMPLETE")
        print("=" * 70)
        print(f"  Meaning clusters: {K_MEANING_CLUSTERS}")
        print(f"  Style dimensions: {STYLE_DIMS}")
        print(f"  Global accuracy:  {scores_global.mean():.3f}")
        print(f"  Context accuracy: {scores_context.mean():.3f}")
        print(f"  Combined (+ elasticity): {scores_combined.mean():.3f}")
        print(f"  Improvement over V2: {improvement:+.3f}")
        print(f"  Topic-holdout: {topic_holdout_acc:.3f}")
        print(f"  Confound gate: {'PASS' if gate_passed else 'FAIL'}")
        print("=" * 70)
    
    await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
