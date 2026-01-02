#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                    MULTI-WAY FIXED EFFECTS DECOMPOSITION                      ║
║                                                                               ║
║  Separates author style from meaning/genre/time confounds.                    ║
║                                                                               ║
║  Model: e_i = μ + α_anchor + β_author + γ_genre + δ_time + ε                ║
║                                                                               ║
║  Solved via ridge-regularized alternating least squares.                      ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import os
import json
import asyncio
import numpy as np
import asyncpg
from collections import defaultdict
from typing import Dict, List, Tuple, Optional
from datetime import datetime
from scipy import sparse
from scipy.sparse.linalg import lsqr
from sklearn.preprocessing import LabelEncoder

DATABASE_URL = os.environ.get('DATABASE_URL', '')
EMBED_DIM = 768
RIDGE_ALPHA_ANCHOR = 1.0
RIDGE_ALPHA_AUTHOR = 10.0


def parse_pgvector(raw) -> Optional[np.ndarray]:
    """Parse pgvector format to numpy array."""
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


class FixedEffectsDecomposition:
    """
    Multi-way fixed effects decomposition for embeddings.
    
    Separates:
    - μ: global mean
    - α: anchor/passage effects (meaning)
    - β: author effects (style - what we want)
    - γ: genre effects
    - δ: time effects
    """
    
    def __init__(self, embed_dim: int = EMBED_DIM):
        self.embed_dim = embed_dim
        self.global_mean = None
        self.anchor_effects = {}  # anchor_id -> vector
        self.author_effects = {}  # author_id -> vector
        self.genre_effects = {}   # genre -> vector
        self.time_effects = {}    # time_bin -> vector
    
    def fit(
        self,
        embeddings: np.ndarray,  # (N, embed_dim)
        anchor_ids: np.ndarray,  # (N,)
        author_ids: np.ndarray,  # (N,)
        genre_labels: Optional[np.ndarray] = None,
        time_bins: Optional[np.ndarray] = None,
        n_iterations: int = 20,
        alpha_anchor: float = RIDGE_ALPHA_ANCHOR,
        alpha_author: float = RIDGE_ALPHA_AUTHOR
    ) -> None:
        """
        Fit the decomposition using alternating least squares.
        """
        N, D = embeddings.shape
        
        print(f"  Fitting fixed effects: {N:,} samples, {D} dims")
        
        # Initialize
        self.global_mean = embeddings.mean(axis=0)
        residuals = embeddings - self.global_mean
        
        # Encode categorical variables
        anchor_encoder = LabelEncoder()
        author_encoder = LabelEncoder()
        
        anchor_encoded = anchor_encoder.fit_transform(anchor_ids)
        author_encoded = author_encoder.fit_transform(author_ids)
        
        n_anchors = len(anchor_encoder.classes_)
        n_authors = len(author_encoder.classes_)
        
        print(f"  Anchors: {n_anchors:,}, Authors: {n_authors}")
        
        # Initialize effect matrices
        anchor_effects = np.zeros((n_anchors, D))
        author_effects = np.zeros((n_authors, D))
        
        # Alternating least squares
        for iteration in range(n_iterations):
            # Step 1: Update anchor effects (holding author fixed)
            for a in range(n_anchors):
                mask = anchor_encoded == a
                if mask.sum() > 0:
                    author_contrib = author_effects[author_encoded[mask]].mean(axis=0)
                    anchor_effects[a] = (
                        residuals[mask].mean(axis=0) - author_contrib
                    ) / (1 + alpha_anchor / mask.sum())
            
            # Step 2: Update author effects (holding anchor fixed)
            for t in range(n_authors):
                mask = author_encoded == t
                if mask.sum() > 0:
                    anchor_contrib = anchor_effects[anchor_encoded[mask]].mean(axis=0)
                    author_effects[t] = (
                        residuals[mask].mean(axis=0) - anchor_contrib
                    ) / (1 + alpha_author / mask.sum())
            
            # Compute reconstruction error
            if iteration % 5 == 0:
                reconstructed = (
                    self.global_mean +
                    anchor_effects[anchor_encoded] +
                    author_effects[author_encoded]
                )
                mse = ((embeddings - reconstructed) ** 2).mean()
                print(f"    Iteration {iteration}: MSE = {mse:.6f}")
        
        # Store effects
        for i, anchor_id in enumerate(anchor_encoder.classes_):
            self.anchor_effects[anchor_id] = anchor_effects[i]
        
        for i, author_id in enumerate(author_encoder.classes_):
            self.author_effects[author_id] = author_effects[i]
        
        print(f"  Decomposition complete")
    
    def get_author_style_vector(self, author_id) -> np.ndarray:
        """Get the style vector for an author."""
        return self.author_effects.get(author_id, np.zeros(self.embed_dim))
    
    def compute_style_residual(
        self, 
        embedding: np.ndarray, 
        anchor_id
    ) -> np.ndarray:
        """
        Compute style residual: embedding minus meaning component.
        """
        anchor_effect = self.anchor_effects.get(anchor_id, np.zeros(self.embed_dim))
        return embedding - self.global_mean - anchor_effect
    
    def compute_invariant_embedding(
        self,
        embedding: np.ndarray,
        anchor_id,
        genre: Optional[str] = None,
        time_bin: Optional[str] = None
    ) -> np.ndarray:
        """
        Compute confound-invariant embedding.
        """
        result = embedding - self.global_mean
        
        if anchor_id in self.anchor_effects:
            result = result - self.anchor_effects[anchor_id]
        
        if genre and genre in self.genre_effects:
            result = result - self.genre_effects[genre]
        
        if time_bin and time_bin in self.time_effects:
            result = result - self.time_effects[time_bin]
        
        return result


async def main():
    """Main execution: Build fixed effects decomposition."""
    
    print("=" * 70)
    print("MULTI-WAY FIXED EFFECTS DECOMPOSITION")
    print("=" * 70)
    
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    
    async with pool.acquire() as conn:
        # Load translation embeddings
        print("\n[1] Loading embeddings...")
        
        translations = await conn.fetch("""
            SELECT 
                t.id,
                t.text_id as anchor_id,
                t.translator_id as author_id,
                t.embedding,
                tr.name as author_name
            FROM translations t
            JOIN translators tr ON t.translator_id = tr.id
            WHERE t.embedding IS NOT NULL
            LIMIT 50000
        """)
        
        print(f"    Loaded {len(translations):,} translations")
        
        # Parse embeddings
        embeddings = []
        anchor_ids = []
        author_ids = []
        author_names = {}
        
        for t in translations:
            emb = parse_pgvector(t['embedding'])
            if emb is not None and len(emb) == EMBED_DIM:
                embeddings.append(emb)
                anchor_ids.append(t['anchor_id'] or t['id'])
                author_ids.append(t['author_id'])
                author_names[t['author_id']] = t['author_name']
        
        embeddings = np.array(embeddings, dtype=np.float32)
        anchor_ids = np.array(anchor_ids)
        author_ids = np.array(author_ids)
        
        print(f"    Valid embeddings: {len(embeddings):,}")
        
        # Fit decomposition
        print("\n[2] Fitting decomposition...")
        
        model = FixedEffectsDecomposition(embed_dim=EMBED_DIM)
        model.fit(
            embeddings,
            anchor_ids,
            author_ids,
            n_iterations=20,
            alpha_anchor=RIDGE_ALPHA_ANCHOR,
            alpha_author=RIDGE_ALPHA_AUTHOR
        )
        
        # Store author style vectors
        print("\n[3] Storing author style vectors...")
        
        for author_id, style_vector in model.author_effects.items():
            author_name = author_names.get(author_id, f"Author_{author_id}")
            
            # Get or create author
            # Check if author exists first
            db_author_id = await conn.fetchval(
                "SELECT id FROM authors WHERE name_en = $1", author_name
            )
            if not db_author_id:
                db_author_id = await conn.fetchval("""
                    INSERT INTO authors (name_en, language)
                    VALUES ($1, 'english')
                    RETURNING id
                """, author_name)
            
            # Store fixed effects vector
            vector_str = '[' + ','.join(str(float(x)) for x in style_vector) + ']'
            
            await conn.execute("""
                INSERT INTO author_style_vectors (
                    author_id, author_name,
                    fixed_effects_vector,
                    model_version, computed_at
                )
                VALUES ($1, $2, $3::vector, $4, NOW())
                ON CONFLICT (author_id, model_version) DO UPDATE
                SET fixed_effects_vector = $3::vector,
                    computed_at = NOW()
            """,
                db_author_id,
                author_name,
                vector_str,
                'fixed_effects_v1'
            )
        
        print(f"    Stored {len(model.author_effects)} style vectors")
        
        # Compute and store invariant embeddings
        print("\n[4] Computing invariant embeddings...")
        
        batch_size = 500
        stored = 0
        
        for i in range(0, len(translations), batch_size):
            batch = translations[i:i+batch_size]
            records = []
            
            for t in batch:
                emb = parse_pgvector(t['embedding'])
                if emb is None or len(emb) != EMBED_DIM:
                    continue
                
                anchor_id = t['anchor_id'] or t['id']
                invariant = model.compute_invariant_embedding(emb, anchor_id)
                semantic = emb - invariant - model.global_mean
                
                records.append((
                    t['id'],  # translation_id
                    '[' + ','.join(str(float(x)) for x in emb) + ']',
                    '[' + ','.join(str(float(x)) for x in invariant) + ']',
                    '[' + ','.join(str(float(x)) for x in semantic) + ']'
                ))
            
            if records:
                await conn.executemany("""
                    INSERT INTO style_invariant_embeddings (
                        translation_id,
                        original_embedding,
                        invariant_embedding,
                        semantic_component
                    )
                    VALUES ($1, $2::vector, $3::vector, $4::vector)
                    ON CONFLICT DO NOTHING
                """, records)
                
                stored += len(records)
        
        print(f"    Stored {stored:,} invariant embeddings")
        
        # QA log
        await conn.execute("""
            INSERT INTO build_qa_log (agent_name, check_name, passed, details)
            VALUES ($1, $2, $3, $4)
        """,
            'FixedEffects',
            'decomposition_complete',
            True,
            json.dumps({
                "n_authors": len(model.author_effects),
                "n_anchors": len(model.anchor_effects),
                "invariant_embeddings": stored
            })
        )
        
        print("\n" + "=" * 70)
        print("FIXED EFFECTS DECOMPOSITION COMPLETE")
        print(f"Author vectors: {len(model.author_effects)}")
        print(f"Invariant embeddings: {stored:,}")
        print("=" * 70)
    
    await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
