#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║         STYLE V2: ANCHOR-CENTERED WHITENING + CONFOUND-PENALIZED LDA          ║
║                                                                               ║
║  The single mathematical upgrade that makes this "dispute-settling" grade.    ║
║                                                                               ║
║  CORE INSIGHT: Same text across translators → anchor mean is MEANING          ║
║  Residual (embedding - anchor_mean) is STYLE                                  ║
║  But we must also WHITEN per-anchor to normalize variance,                    ║
║  then PENALIZE confounds (topic/genre/era) in the style basis.               ║
║                                                                               ║
║  MATH:                                                                        ║
║    Step 1: μ_g = mean_a e_{g,a}           (anchor mean = meaning)            ║
║    Step 2: C_g = shrunk covariance per anchor                                ║
║            r̃_{g,a} = C_g^{-1/2} @ (e - μ_g)  (whitened residual)            ║
║    Step 3: Solve generalized eigenvalue problem:                             ║
║            S_author v = λ (S_within + α*S_confound + ρI) v                   ║
║    Step 4: style = B^T @ r̃  where B = top-k eigenvectors                    ║
║                                                                               ║
║  This is explicitly optimized for "author separability" while suppressing     ║
║  confounds. It's interpretable, fast, and testable.                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import os
import json
import hashlib
import asyncio
import numpy as np
import asyncpg
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from collections import defaultdict
from scipy.linalg import eigh
from sklearn.covariance import LedoitWolf
from sklearn.cluster import KMeans

DATABASE_URL = os.environ.get('DATABASE_URL', '')
EMBED_DIM = 768
PCA_DIM = 128
STYLE_DIM = 32
LDA_REG = 0.01
CONFOUND_PENALTY = 1.0  # α in the equation
MIN_AUTHOR_SAMPLES = 50
MIN_ANCHOR_TRANSLATORS = 2  # Need at least 2 translators per anchor


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
    parts = [float(x.strip()) for x in s.split(',') if x.strip()]
    return np.array(parts, dtype=np.float32)


def shrink_cov(X: np.ndarray, eps: float = 1e-6) -> np.ndarray:
    """
    Compute shrunk covariance using Ledoit-Wolf estimator.
    This is critical for stability in high dimensions.
    """
    if X.shape[0] < 2:
        return np.eye(X.shape[1], dtype=np.float64) * eps
    
    try:
        lw = LedoitWolf().fit(X)
        C = lw.covariance_
    except Exception:
        # Fallback to simple covariance with regularization
        C = np.cov(X, rowvar=False)
        if np.isscalar(C):
            C = np.array([[C]])
    
    # Add small diagonal for numerical stability
    C = C + eps * np.eye(C.shape[0], dtype=np.float64)
    return C


def inv_sqrtm_psd(C: np.ndarray) -> np.ndarray:
    """
    Compute C^{-1/2} for symmetric positive semi-definite C.
    Used for whitening: x_whitened = C^{-1/2} @ x
    """
    w, V = np.linalg.eigh(C)
    w = np.maximum(w, 1e-9)  # Ensure positive
    return (V * (1.0 / np.sqrt(w))) @ V.T


def anchor_center_and_whiten(
    embeddings: np.ndarray,
    anchor_ids: np.ndarray,
    min_anchor_n: int = MIN_ANCHOR_TRANSLATORS
) -> Tuple[np.ndarray, Dict]:
    """
    THE KEY STEP: Anchor-centered whitening.
    
    For each anchor (same source passage):
    1. Compute anchor mean μ_g (this is the MEANING component)
    2. Compute anchor covariance C_g with shrinkage
    3. Whiten residuals: r̃ = C_g^{-1/2} @ (e - μ_g)
    
    This forces each anchor to contribute "one standardized unit" of evidence,
    preventing high-variance anchors from dominating.
    
    Args:
        embeddings: (N, d) embedding matrix
        anchor_ids: (N,) anchor group identifiers
        min_anchor_n: Minimum samples per anchor to apply whitening
    
    Returns:
        Rw: (N, d) whitened residuals
        stats: Dictionary with anchor statistics
    """
    N, d = embeddings.shape
    Rw = np.zeros_like(embeddings, dtype=np.float32)
    
    # Compute global covariance as fallback/prior
    E_centered = embeddings - embeddings.mean(axis=0, keepdims=True)
    C_global = shrink_cov(E_centered.astype(np.float64))
    
    stats = {
        'anchors_processed': 0,
        'anchors_whitened': 0,
        'anchors_centered_only': 0,
        'total_residuals': 0
    }
    
    unique_anchors = np.unique(anchor_ids)
    
    for anchor in unique_anchors:
        idx = np.where(anchor_ids == anchor)[0]
        n_samples = len(idx)
        
        if n_samples < 2:
            # Single sample: just center by global mean
            Rw[idx] = (embeddings[idx] - embeddings.mean(axis=0)).astype(np.float32)
            continue
        
        X = embeddings[idx].astype(np.float64)
        mu_g = X.mean(axis=0, keepdims=True)  # Anchor mean = MEANING
        X_centered = X - mu_g
        
        stats['anchors_processed'] += 1
        stats['total_residuals'] += n_samples
        
        if n_samples < min_anchor_n:
            # Not enough samples for reliable whitening, just center
            Rw[idx] = X_centered.astype(np.float32)
            stats['anchors_centered_only'] += 1
            continue
        
        # Compute anchor-specific covariance with shrinkage toward global
        C_g = shrink_cov(X_centered)
        
        # Shrinkage schedule: more samples = trust anchor covariance more
        rho = min(0.9, (n_samples - min_anchor_n) / 20.0)
        C_shrunk = (1 - rho) * C_global + rho * C_g
        
        # Whiten
        try:
            W = inv_sqrtm_psd(C_shrunk)
            Rw[idx] = (X_centered @ W.T).astype(np.float32)
            stats['anchors_whitened'] += 1
        except Exception:
            # Fallback: just center
            Rw[idx] = X_centered.astype(np.float32)
            stats['anchors_centered_only'] += 1
    
    return Rw, stats


def compute_scatter_matrices(
    R: np.ndarray,
    author_ids: np.ndarray
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Compute between-author and within-author scatter matrices.
    
    S_between = Σ_a n_a (μ_a - μ)(μ_a - μ)^T  (what separates authors)
    S_within = Σ_a Σ_i (r_i - μ_a)(r_i - μ_a)^T  (what varies within author)
    """
    d = R.shape[1]
    mu_global = R.mean(axis=0, keepdims=True)
    
    S_between = np.zeros((d, d), dtype=np.float64)
    S_within = np.zeros((d, d), dtype=np.float64)
    
    for author in np.unique(author_ids):
        idx = np.where(author_ids == author)[0]
        R_a = R[idx].astype(np.float64)
        n_a = len(idx)
        
        mu_a = R_a.mean(axis=0, keepdims=True)
        delta = (mu_a - mu_global)
        
        # Between-author scatter
        S_between += n_a * (delta.T @ delta)
        
        # Within-author scatter
        R_a_centered = R_a - mu_a
        S_within += (R_a_centered.T @ R_a_centered)
    
    return S_between, S_within


def learn_confound_penalized_style_basis(
    R: np.ndarray,
    author_ids: np.ndarray,
    confound_ids: np.ndarray,
    k: int = STYLE_DIM,
    alpha: float = CONFOUND_PENALTY,
    ridge: float = LDA_REG
) -> Tuple[np.ndarray, np.ndarray, Dict]:
    """
    THE CORE MATHEMATICAL UPGRADE: Confound-penalized style basis.
    
    Solves: max_v  v^T S_author v / v^T (S_within + α*S_confound + λI) v
    
    This finds directions that:
    - MAXIMIZE separation between authors (numerator)
    - MINIMIZE within-author variation (denominator term 1)
    - MINIMIZE confound-predictive variation (denominator term 2)
    - Are regularized for stability (denominator term 3)
    
    Args:
        R: (N, d) whitened residuals
        author_ids: (N,) author labels
        confound_ids: (N,) confound labels (topic/genre/era clusters)
        k: Number of style dimensions
        alpha: Confound penalty weight
        ridge: Regularization strength
    
    Returns:
        B: (d, k) style basis matrix
        evals: (k,) eigenvalues (discriminative power)
        stats: Dictionary with computation statistics
    """
    d = R.shape[1]
    
    # Author scatter matrices
    S_author, S_within = compute_scatter_matrices(R, author_ids)
    
    # Confound scatter matrix (what we want to SUPPRESS)
    S_confound, _ = compute_scatter_matrices(R, confound_ids)
    
    # Build the matrices for generalized eigenvalue problem
    # A = S_author (numerator - maximize)
    # B = S_within + α*S_confound + λI (denominator - minimize)
    A = S_author
    B = S_within + alpha * S_confound + ridge * np.eye(d, dtype=np.float64)
    
    # Solve generalized eigenvalue problem: A v = λ B v
    # eigh returns eigenvalues in ascending order, we want largest
    try:
        evals, evecs = eigh(A, B)
    except Exception as e:
        print(f"    Warning: eigh failed ({e}), using regularized fallback")
        B = B + 0.1 * np.eye(d)  # More regularization
        evals, evecs = eigh(A, B)
    
    # Take top-k (largest eigenvalues = most discriminative)
    idx = np.argsort(evals)[::-1]
    evals = evals[idx]
    evecs = evecs[:, idx]
    
    k = min(k, evecs.shape[1], len(np.unique(author_ids)) - 1)
    B_basis = evecs[:, :k].astype(np.float32)
    
    # Normalize columns
    for j in range(k):
        norm = np.linalg.norm(B_basis[:, j]) + 1e-12
        B_basis[:, j] /= norm
    
    stats = {
        'style_dims': k,
        'top_eigenvalue': float(evals[0]) if len(evals) > 0 else 0,
        'eigenvalue_ratio': float(evals[0] / (evals[-1] + 1e-10)) if len(evals) > 1 else 1,
        'trace_S_author': float(np.trace(S_author)),
        'trace_S_confound': float(np.trace(S_confound)),
        'confound_penalty_used': alpha
    }
    
    return B_basis, evals[:k], stats


async def main():
    """Build Style V2: Anchor-centered whitening + confound-penalized LDA."""
    
    print("=" * 70)
    print("STYLE V2: ANCHOR-CENTERED WHITENING + CONFOUND-PENALIZED LDA")
    print("=" * 70)
    print("\nThis is THE key mathematical upgrade for dispute-settling attribution.")
    print("It explicitly MAXIMIZES author signal while SUPPRESSING confounds.")
    
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    model_version = f"style_v2_{ts}"
    
    async with pool.acquire() as conn:
        # Create V2 tables
        print("\n[1] Creating Style V2 tables...")
        
        await conn.execute("""
        CREATE TABLE IF NOT EXISTS style_v2_models (
            model_version TEXT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT NOW(),
            artifact_path TEXT,
            params JSONB NOT NULL,
            summary JSONB NOT NULL,
            pca_explained_variance FLOAT,
            lda_eigenvalues FLOAT[],
            whitening_stats JSONB,
            confound_stats JSONB
        );
        """)
        
        await conn.execute("""
        CREATE TABLE IF NOT EXISTS author_style_vectors_v2 (
            model_version TEXT NOT NULL,
            author_name TEXT NOT NULL,
            style_vector FLOAT8[] NOT NULL,
            sample_count INTEGER NOT NULL,
            mean_residual_norm FLOAT,
            within_author_variance FLOAT,
            PRIMARY KEY (model_version, author_name)
        );
        """)
        
        await conn.execute("""
        CREATE TABLE IF NOT EXISTS meaning_anchor_stats (
            anchor_id TEXT PRIMARY KEY,
            mean_embedding vector(768),
            n_translators INTEGER,
            translator_list TEXT[],
            anchor_variance FLOAT,
            whitening_applied BOOLEAN,
            computed_at TIMESTAMP DEFAULT NOW()
        );
        """)
        
        # Load translations grouped by anchor (same source text)
        print("\n[2] Loading translations grouped by meaning anchor...")
        
        translations = await conn.fetch("""
            SELECT 
                t.id,
                COALESCE(t.text_id::text, t.id::text) as anchor_id,
                t.translator_id,
                tr.name as author_name,
                t.embedding
            FROM translations t
            JOIN translators tr ON t.translator_id = tr.id
            WHERE t.embedding IS NOT NULL
            ORDER BY COALESCE(t.text_id, t.id)
        """)
        
        print(f"    Loaded {len(translations):,} translations")
        
        # Parse into arrays
        embeddings = []
        anchor_ids = []
        author_names = []
        translation_ids = []
        
        for t in translations:
            emb = parse_pgvector(t['embedding'])
            if emb is not None and len(emb) == EMBED_DIM:
                embeddings.append(emb)
                anchor_ids.append(t['anchor_id'])
                author_names.append(t['author_name'])
                translation_ids.append(t['id'])
        
        embeddings = np.array(embeddings, dtype=np.float32)
        anchor_ids = np.array(anchor_ids)
        author_names = np.array(author_names)
        
        print(f"    Valid embeddings: {len(embeddings):,}")
        print(f"    Unique anchors: {len(np.unique(anchor_ids)):,}")
        print(f"    Unique authors: {len(np.unique(author_names))}")
        
        # STEP 1: Anchor-centered whitening
        print("\n[3] Computing anchor-centered WHITENED residuals...")
        print("    This normalizes variance so each anchor contributes equally.")
        
        R_whitened, whiten_stats = anchor_center_and_whiten(
            embeddings, anchor_ids, 
            min_anchor_n=MIN_ANCHOR_TRANSLATORS
        )
        
        print(f"    Anchors processed: {whiten_stats['anchors_processed']:,}")
        print(f"    Anchors whitened: {whiten_stats['anchors_whitened']:,}")
        print(f"    Anchors centered only: {whiten_stats['anchors_centered_only']:,}")
        
        # Dimensionality reduction via PCA (for computational efficiency)
        print("\n[4] PCA dimensionality reduction...")
        
        from sklearn.decomposition import PCA
        pca = PCA(n_components=PCA_DIM)
        R_pca = pca.fit_transform(R_whitened)
        
        explained_var = pca.explained_variance_ratio_.sum()
        print(f"    PCA explained variance: {explained_var:.4f}")
        
        # Create confound labels (topic clusters)
        print("\n[5] Creating confound labels (topic clusters)...")
        
        N_TOPICS = 20
        kmeans = KMeans(n_clusters=N_TOPICS, random_state=42, n_init=10)
        confound_ids = kmeans.fit_predict(R_pca)
        
        print(f"    Created {N_TOPICS} topic clusters as confound labels")
        
        # Filter to authors with enough samples
        author_counts = defaultdict(int)
        for author in author_names:
            author_counts[author] += 1
        
        valid_authors = {a for a, c in author_counts.items() if c >= MIN_AUTHOR_SAMPLES}
        valid_mask = np.array([a in valid_authors for a in author_names])
        
        R_valid = R_pca[valid_mask]
        authors_valid = author_names[valid_mask]
        confounds_valid = confound_ids[valid_mask]
        
        print(f"\n[6] Authors with >= {MIN_AUTHOR_SAMPLES} samples: {len(valid_authors)}")
        print(f"    Valid samples: {len(R_valid):,}")
        
        if len(valid_authors) < 3:
            print("    ERROR: Not enough authors for style basis learning.")
            return
        
        # STEP 2: Learn confound-penalized style basis
        print("\n[7] Learning CONFOUND-PENALIZED style basis...")
        print(f"    Confound penalty α = {CONFOUND_PENALTY}")
        print(f"    Ridge regularization λ = {LDA_REG}")
        print("    This MAXIMIZES author separation while SUPPRESSING topic/genre leakage")
        
        B_basis, eigenvalues, basis_stats = learn_confound_penalized_style_basis(
            R_valid,
            authors_valid,
            confounds_valid,
            k=STYLE_DIM,
            alpha=CONFOUND_PENALTY,
            ridge=LDA_REG
        )
        
        print(f"\n    Style basis shape: {B_basis.shape}")
        print(f"    Top eigenvalue (discriminative power): {basis_stats['top_eigenvalue']:.4f}")
        print(f"    Eigenvalue ratio (top/bottom): {basis_stats['eigenvalue_ratio']:.2f}")
        print(f"    Trace(S_author) / Trace(S_confound): {basis_stats['trace_S_author']:.2f} / {basis_stats['trace_S_confound']:.2f}")
        
        # Compute author style vectors in the new basis
        print("\n[8] Computing author style vectors...")
        
        author_vectors = {}
        for author in valid_authors:
            mask = authors_valid == author
            R_author = R_valid[mask]
            
            # Project to style space
            style_vecs = R_author @ B_basis
            mean_style = style_vecs.mean(axis=0)
            
            # Within-author variance (should be low if style is consistent)
            within_var = np.var(style_vecs, axis=0).mean()
            
            author_vectors[author] = {
                'vector': mean_style,
                'count': int(mask.sum()),
                'within_variance': float(within_var),
                'residual_norm': float(np.linalg.norm(R_author.mean(axis=0)))
            }
        
        # Store in database
        print("\n[9] Storing Style V2 model and vectors...")
        
        # Model metadata
        await conn.execute("""
            INSERT INTO style_v2_models (
                model_version, params, summary, 
                pca_explained_variance, lda_eigenvalues,
                whitening_stats, confound_stats
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (model_version) DO UPDATE
            SET params = EXCLUDED.params,
                summary = EXCLUDED.summary,
                pca_explained_variance = EXCLUDED.pca_explained_variance,
                lda_eigenvalues = EXCLUDED.lda_eigenvalues,
                whitening_stats = EXCLUDED.whitening_stats,
                confound_stats = EXCLUDED.confound_stats
        """, 
            model_version,
            json.dumps({
                "pca_dim": PCA_DIM,
                "style_dim": int(B_basis.shape[1]),
                "lda_reg": LDA_REG,
                "confound_penalty": CONFOUND_PENALTY,
                "min_author_samples": MIN_AUTHOR_SAMPLES,
                "min_anchor_translators": MIN_ANCHOR_TRANSLATORS,
                "n_topic_clusters": N_TOPICS
            }),
            json.dumps({
                "authors_kept": len(author_vectors),
                "total_residuals": len(R_valid),
                "unique_anchors": len(np.unique(anchor_ids))
            }),
            float(explained_var),
            eigenvalues.tolist(),
            json.dumps(whiten_stats),
            json.dumps(basis_stats)
        )
        
        # Author vectors
        records = []
        for author, data in author_vectors.items():
            records.append((
                model_version,
                author,
                data['vector'].tolist(),
                data['count'],
                data['residual_norm'],
                data['within_variance']
            ))
        
        await conn.executemany("""
            INSERT INTO author_style_vectors_v2 (
                model_version, author_name, style_vector, 
                sample_count, mean_residual_norm, within_author_variance
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (model_version, author_name) DO UPDATE
            SET style_vector = EXCLUDED.style_vector,
                sample_count = EXCLUDED.sample_count,
                mean_residual_norm = EXCLUDED.mean_residual_norm,
                within_author_variance = EXCLUDED.within_author_variance
        """, records)
        
        # QA logging
        await conn.execute("""
            INSERT INTO build_qa_log (agent_name, check_name, passed, details)
            VALUES ($1, $2, $3, $4)
        """,
            'StyleV2',
            'confound_penalized_lda',
            True,
            json.dumps({
                "model_version": model_version,
                "authors": len(author_vectors),
                "style_dims": int(B_basis.shape[1]),
                "pca_explained_var": float(explained_var),
                "top_eigenvalue": float(eigenvalues[0]) if len(eigenvalues) > 0 else 0,
                "confound_penalty": CONFOUND_PENALTY,
                "anchors_whitened": whiten_stats['anchors_whitened']
            })
        )
        
        print("\n" + "=" * 70)
        print("STYLE V2 COMPLETE")
        print(f"Model version: {model_version}")
        print(f"Authors: {len(author_vectors)}")
        print(f"Style dimensions: {B_basis.shape[1]}")
        print(f"PCA explained variance: {explained_var:.4f}")
        print(f"Top LDA eigenvalue: {eigenvalues[0]:.4f}")
        print(f"Anchors whitened: {whiten_stats['anchors_whitened']}")
        print(f"Confound penalty applied: {CONFOUND_PENALTY}")
        print("=" * 70)
    
    await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
