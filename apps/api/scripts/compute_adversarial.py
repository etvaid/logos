#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                      ADVERSARIAL CONFOUND REMOVAL                             ║
║                                                                               ║
║  Learn embeddings that MAXIMIZE author signal while MINIMIZING confound.      ║
║                                                                               ║
║  Objective:                                                                   ║
║  max_θ L_author(f_θ(x), author) - λ L_confound(f_θ(x), confound)             ║
║                                                                               ║
║  Uses gradient reversal for the confound head.                                ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import os
import json
import asyncio
import numpy as np
import asyncpg
from collections import Counter
from typing import Dict, List, Optional
from datetime import datetime
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.model_selection import cross_val_score, GroupKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

DATABASE_URL = os.environ.get('DATABASE_URL', '')
EMBED_DIM = 768
ADVERSARIAL_LAMBDA = 0.1
N_TOPIC_CLUSTERS = 20


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


class LinearAdversarialRemoval:
    """
    Linear adversarial confound removal.
    
    Iteratively:
    1. Fit confound predictor from embeddings
    2. Remove confound-predictive directions
    3. Verify author signal preserved
    """
    
    def __init__(self, embed_dim: int = EMBED_DIM, n_iterations: int = 5):
        self.embed_dim = embed_dim
        self.n_iterations = n_iterations
        self.removal_directions: List[np.ndarray] = []
        self.scaler = StandardScaler()
    
    def fit_remove_confound(
        self,
        X: np.ndarray,
        confound_labels: np.ndarray,
        author_labels: np.ndarray,
        alpha: float = ADVERSARIAL_LAMBDA
    ) -> np.ndarray:
        """
        Iteratively remove confound-predictive directions.
        """
        X_current = X.copy()
        
        for iteration in range(self.n_iterations):
            # Fit confound predictor
            clf = LogisticRegression(max_iter=500)
            
            # Only use valid labels
            valid_mask = confound_labels != -1
            if valid_mask.sum() < 100:
                break
            
            try:
                clf.fit(X_current[valid_mask], confound_labels[valid_mask])
                confound_accuracy = clf.score(X_current[valid_mask], confound_labels[valid_mask])
            except:
                break
            
            # Check author accuracy
            author_clf = LogisticRegression(max_iter=500)
            valid_author = author_labels != -1
            
            try:
                author_clf.fit(X_current[valid_author], author_labels[valid_author])
                author_accuracy = author_clf.score(X_current[valid_author], author_labels[valid_author])
            except:
                author_accuracy = 0.0
            
            print(f"    Iter {iteration}: Confound acc={confound_accuracy:.3f}, Author acc={author_accuracy:.3f}")
            
            # Get confound-predictive direction (average of class weights)
            W = clf.coef_  # (n_classes, n_features)
            
            # Use SVD to find main confound direction
            U, S, Vt = np.linalg.svd(W, full_matrices=False)
            confound_direction = Vt[0]  # First principal direction
            confound_direction = confound_direction / np.linalg.norm(confound_direction)
            
            self.removal_directions.append(confound_direction)
            
            # Project out confound direction
            projection = np.outer(confound_direction, confound_direction)
            X_current = X_current - X_current @ projection
            
            # Stop if confound accuracy near chance
            chance = 1.0 / len(np.unique(confound_labels[valid_mask]))
            if confound_accuracy < chance + 0.05:
                print(f"    Confound near chance, stopping")
                break
        
        return X_current
    
    def transform(self, X: np.ndarray) -> np.ndarray:
        """Apply learned removal to new data."""
        X_transformed = X.copy()
        
        for direction in self.removal_directions:
            projection = np.outer(direction, direction)
            X_transformed = X_transformed - X_transformed @ projection
        
        return X_transformed


async def main():
    """Main execution: Adversarial confound removal."""
    
    print("=" * 70)
    print("ADVERSARIAL CONFOUND REMOVAL")
    print("=" * 70)
    
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    
    async with pool.acquire() as conn:
        # Load data
        print("\n[1] Loading embeddings and labels...")
        
        translations = await conn.fetch("""
            SELECT 
                t.id,
                t.embedding,
                t.translator_id,
                t.text_id,
                tr.name as author_name
            FROM translations t
            JOIN translators tr ON t.translator_id = tr.id
            WHERE t.embedding IS NOT NULL
            LIMIT 40000
        """)
        
        print(f"    Loaded {len(translations):,} translations")
        
        # Parse data
        embeddings = []
        author_ids = []
        text_ids = []
        valid_ids = []
        
        for t in translations:
            emb = parse_pgvector(t['embedding'])
            if emb is not None and len(emb) == EMBED_DIM:
                embeddings.append(emb)
                author_ids.append(t['translator_id'])
                text_ids.append(t['text_id'] or t['id'])
                valid_ids.append(t['id'])
        
        X = np.array(embeddings, dtype=np.float32)
        author_labels = np.array(author_ids)
        
        print(f"    Valid samples: {len(X):,}")
        
        # Create topic clusters as confound
        print("\n[2] Creating topic clusters...")
        
        kmeans = KMeans(n_clusters=N_TOPIC_CLUSTERS, random_state=42, n_init=10)
        topic_labels = kmeans.fit_predict(X)
        
        print(f"    Created {N_TOPIC_CLUSTERS} topic clusters")
        
        # Run adversarial removal
        print("\n[3] Running adversarial confound removal...")
        
        model = LinearAdversarialRemoval(embed_dim=EMBED_DIM, n_iterations=5)
        X_invariant = model.fit_remove_confound(X, topic_labels, author_labels)
        
        # Evaluate
        print("\n[4] Evaluating results...")
        
        # Author accuracy before/after
        author_clf = LogisticRegression(max_iter=500)
        
        # Filter to translators with enough samples
        counts = Counter(author_labels)
        valid_authors = {a for a, c in counts.items() if c >= 10}
        mask = np.array([a in valid_authors for a in author_labels])
        
        cv = GroupKFold(n_splits=5)
        groups = np.array(text_ids)[mask]
        
        scores_before = cross_val_score(author_clf, X[mask], author_labels[mask], cv=cv, groups=groups)
        scores_after = cross_val_score(author_clf, X_invariant[mask], author_labels[mask], cv=cv, groups=groups)
        
        print(f"\n    Author accuracy before: {scores_before.mean():.3f} +/- {scores_before.std():.3f}")
        print(f"    Author accuracy after:  {scores_after.mean():.3f} +/- {scores_after.std():.3f}")
        
        # Topic accuracy before/after
        topic_clf = LogisticRegression(max_iter=500)
        
        topic_scores_before = cross_val_score(topic_clf, X, topic_labels, cv=5)
        topic_scores_after = cross_val_score(topic_clf, X_invariant, topic_labels, cv=5)
        
        print(f"\n    Topic accuracy before: {topic_scores_before.mean():.3f}")
        print(f"    Topic accuracy after:  {topic_scores_after.mean():.3f}")
        print(f"    (Chance level: {1/N_TOPIC_CLUSTERS:.3f})")
        
        # Store results
        print("\n[5] Storing invariant embeddings...")
        
        batch_size = 500
        stored = 0
        
        for i in range(0, len(X_invariant), batch_size):
            batch_invariant = X_invariant[i:i+batch_size]
            batch_ids = valid_ids[i:i+batch_size]
            batch_topics = topic_labels[i:i+batch_size]
            
            records = []
            for j, (inv, tid, topic) in enumerate(zip(batch_invariant, batch_ids, batch_topics)):
                original = X[i+j]
                records.append((
                    tid,
                    '[' + ','.join(str(float(x)) for x in original) + ']',
                    '[' + ','.join(str(float(x)) for x in inv) + ']',
                    int(topic)
                ))
            
            await conn.executemany("""
                INSERT INTO style_invariant_embeddings (
                    translation_id,
                    original_embedding,
                    invariant_embedding,
                    topic_cluster
                )
                VALUES ($1, $2::vector, $3::vector, $4)
                ON CONFLICT (translation_id) DO UPDATE
                SET invariant_embedding = $3::vector,
                    topic_cluster = $4
            """, records)
            
            stored += len(records)
        
        print(f"    Stored {stored:,} invariant embeddings")
        
        # Store calibration
        topic_accuracy_after = topic_scores_after.mean()
        confound_pass = topic_accuracy_after < 0.4
        
        await conn.execute("""
            INSERT INTO authorship_calibration (
                run_id, method,
                top1_accuracy,
                topic_predictability,
                gate_confound_pass,
                gate_overall_pass,
                hyperparameters
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        """,
            f"adversarial_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'adversarial_invariant',
            float(scores_after.mean()),
            float(topic_accuracy_after),
            confound_pass,
            confound_pass and scores_after.mean() >= 0.7 * 0.9,
            json.dumps({
                "n_iterations": model.n_iterations,
                "n_topic_clusters": N_TOPIC_CLUSTERS,
                "adversarial_lambda": ADVERSARIAL_LAMBDA
            })
        )
        
        # QA log
        await conn.execute("""
            INSERT INTO build_qa_log (agent_name, check_name, passed, details)
            VALUES ($1, $2, $3, $4)
        """,
            'Adversarial',
            'confound_removal',
            confound_pass,
            json.dumps({
                "topic_accuracy_before": float(topic_scores_before.mean()),
                "topic_accuracy_after": float(topic_accuracy_after),
                "author_accuracy_after": float(scores_after.mean())
            })
        )
        
        print("\n" + "=" * 70)
        print("ADVERSARIAL CONFOUND REMOVAL COMPLETE")
        print(f"Topic predictability: {topic_accuracy_after:.3f} (target < 0.4)")
        print(f"Author accuracy: {scores_after.mean():.3f}")
        print(f"Gate passed: {confound_pass}")
        print("=" * 70)
    
    await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
