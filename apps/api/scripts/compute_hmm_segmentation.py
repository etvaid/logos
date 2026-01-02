#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                        HMM AUTHORSHIP SEGMENTATION                            ║
║                                                                               ║
║  Detect author changes and interpolations within texts.                       ║
║                                                                               ║
║  Model:                                                                       ║
║  - States: candidate authors                                                  ║
║  - Emissions: P(embedding | author) from calibrated classifier                ║
║  - Transitions: strong self-loop (0.95), uniform otherwise                    ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import os
import json
import asyncio
import numpy as np
import asyncpg
from typing import Dict, List, Tuple, Optional
from datetime import datetime
from collections import defaultdict
from dataclasses import dataclass
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from scipy.special import softmax

DATABASE_URL = os.environ.get('DATABASE_URL', '')
EMBED_DIM = 768
SELF_TRANSITION = 0.95
CALIBRATION_TEMP = 1.5


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


@dataclass
class SegmentResult:
    """Result of segmenting a text."""
    text_id: int
    segments: List[Dict]
    boundaries: List[int]
    boundary_confidences: List[float]
    dominant_author: str
    dominant_confidence: float


class CalibratedAuthorClassifier:
    """Author classifier with temperature-scaled calibration."""
    
    def __init__(self, temperature: float = CALIBRATION_TEMP):
        self.clf = LogisticRegression(max_iter=1000)
        self.scaler = StandardScaler()
        self.temperature = temperature
        self.classes_ = None
    
    def fit(self, X: np.ndarray, y: np.ndarray) -> None:
        """Fit classifier."""
        X_scaled = self.scaler.fit_transform(X)
        self.clf.fit(X_scaled, y)
        self.classes_ = self.clf.classes_
    
    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """Get calibrated probabilities."""
        X_scaled = self.scaler.transform(X)
        logits = self.clf.decision_function(X_scaled)
        
        # Temperature scaling for calibration
        calibrated = softmax(logits / self.temperature, axis=1)
        return calibrated
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict most likely author."""
        proba = self.predict_proba(X)
        return self.classes_[np.argmax(proba, axis=1)]


class HMMAuthorship:
    """HMM for authorship segmentation."""
    
    def __init__(
        self, 
        authors: List[str],
        self_transition: float = SELF_TRANSITION
    ):
        self.authors = authors
        self.n_states = len(authors)
        self.self_transition = self_transition
        
        # Build transition matrix
        other_prob = (1 - self_transition) / (self.n_states - 1) if self.n_states > 1 else 0
        self.transition = np.full((self.n_states, self.n_states), other_prob)
        np.fill_diagonal(self.transition, self_transition)
        
        # Uniform prior
        self.prior = np.ones(self.n_states) / self.n_states
    
    def viterbi(self, emissions: np.ndarray) -> Tuple[List[int], float]:
        """
        Viterbi algorithm for most likely state sequence.
        
        Args:
            emissions: (T, n_states) log probabilities
        
        Returns:
            (state_sequence, log_probability)
        """
        T = len(emissions)
        
        # Viterbi tables
        V = np.zeros((T, self.n_states))
        backptr = np.zeros((T, self.n_states), dtype=int)
        
        # Initialize
        V[0] = np.log(self.prior + 1e-10) + emissions[0]
        
        # Forward pass
        log_trans = np.log(self.transition + 1e-10)
        
        for t in range(1, T):
            for s in range(self.n_states):
                probs = V[t-1] + log_trans[:, s]
                backptr[t, s] = np.argmax(probs)
                V[t, s] = probs[backptr[t, s]] + emissions[t, s]
        
        # Backtrack
        path = [np.argmax(V[-1])]
        for t in range(T - 1, 0, -1):
            path.append(backptr[t, path[-1]])
        
        path.reverse()
        return path, np.max(V[-1])
    
    def forward_backward(self, emissions: np.ndarray) -> np.ndarray:
        """
        Forward-backward for posterior marginals.
        
        Returns:
            (T, n_states) posterior probabilities
        """
        T = len(emissions)
        
        # Convert to probabilities
        emit_prob = np.exp(emissions - emissions.max(axis=1, keepdims=True))
        emit_prob = emit_prob / emit_prob.sum(axis=1, keepdims=True)
        
        # Forward
        alpha = np.zeros((T, self.n_states))
        alpha[0] = self.prior * emit_prob[0]
        alpha[0] /= alpha[0].sum()
        
        for t in range(1, T):
            alpha[t] = emit_prob[t] * (alpha[t-1] @ self.transition)
            alpha[t] /= alpha[t].sum() + 1e-10
        
        # Backward
        beta = np.zeros((T, self.n_states))
        beta[-1] = 1.0
        
        for t in range(T - 2, -1, -1):
            beta[t] = self.transition @ (emit_prob[t+1] * beta[t+1])
            beta[t] /= beta[t].sum() + 1e-10
        
        # Posterior
        posterior = alpha * beta
        posterior /= posterior.sum(axis=1, keepdims=True)
        
        return posterior
    
    def segment(
        self, 
        emissions: np.ndarray,
        min_segment_length: int = 3
    ) -> List[Dict]:
        """
        Segment text into authorship regions.
        
        Returns list of segments with boundaries and confidences.
        """
        # Get most likely path
        path, _ = self.viterbi(emissions)
        
        # Get posteriors for confidence
        posteriors = self.forward_backward(emissions)
        
        # Extract segments
        segments = []
        current_author = path[0]
        segment_start = 0
        
        for t in range(1, len(path)):
            if path[t] != current_author:
                # End current segment
                segment_posteriors = posteriors[segment_start:t, current_author]
                segments.append({
                    'start': segment_start,
                    'end': t - 1,
                    'author_idx': current_author,
                    'author': self.authors[current_author],
                    'confidence': float(segment_posteriors.mean()),
                    'boundary_confidence': float(1 - posteriors[t-1, current_author])
                })
                
                segment_start = t
                current_author = path[t]
        
        # Final segment
        segment_posteriors = posteriors[segment_start:, current_author]
        segments.append({
            'start': segment_start,
            'end': len(path) - 1,
            'author_idx': current_author,
            'author': self.authors[current_author],
            'confidence': float(segment_posteriors.mean()),
            'boundary_confidence': 0.0  # No boundary at end
        })
        
        return segments


async def main():
    """Main execution: Build HMM segmentation system."""
    
    print("=" * 70)
    print("HMM AUTHORSHIP SEGMENTATION")
    print("=" * 70)
    
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    
    async with pool.acquire() as conn:
        # Load training data
        print("\n[1] Loading training data...")
        
        translations = await conn.fetch("""
            SELECT 
                t.id,
                t.text_id,
                t.embedding,
                t.translator_id,
                tr.name as author_name
            FROM translations t
            JOIN translators tr ON t.translator_id = tr.id
            WHERE t.embedding IS NOT NULL
            LIMIT 40000
        """)
        
        print(f"    Loaded {len(translations):,} translations")
        
        # Parse
        embeddings = []
        author_names = []
        author_id_to_name = {}
        
        for t in translations:
            emb = parse_pgvector(t['embedding'])
            if emb is not None and len(emb) == EMBED_DIM:
                embeddings.append(emb)
                author_names.append(t['author_name'])
                author_id_to_name[t['translator_id']] = t['author_name']
        
        X = np.array(embeddings, dtype=np.float32)
        y = np.array(author_names)
        
        print(f"    Valid samples: {len(X):,}")
        
        # Train classifier
        print("\n[2] Training calibrated classifier...")
        
        classifier = CalibratedAuthorClassifier(temperature=CALIBRATION_TEMP)
        classifier.fit(X, y)
        
        authors = list(classifier.classes_)
        print(f"    Trained on {len(authors)} authors")
        
        # Build HMM
        print("\n[3] Building HMM...")
        
        hmm = HMMAuthorship(authors=authors, self_transition=SELF_TRANSITION)
        print(f"    States: {hmm.n_states}")
        print(f"    Self-transition: {hmm.self_transition}")
        
        # Demo segmentation on synthetic sequence
        print("\n[4] Demo segmentation...")
        
        # Create a synthetic multi-author sequence
        n_windows = 50
        demo_embeddings = []
        true_authors = []
        
        # First half: one author, second half: another
        author1_samples = X[y == authors[0]][:25]
        author2_samples = X[y == authors[1]][:25] if len(authors) > 1 else author1_samples
        
        for i in range(25):
            if i < len(author1_samples):
                demo_embeddings.append(author1_samples[i])
                true_authors.append(authors[0])
        
        for i in range(25):
            if i < len(author2_samples):
                demo_embeddings.append(author2_samples[i])
                true_authors.append(authors[1] if len(authors) > 1 else authors[0])
        
        demo_X = np.array(demo_embeddings)
        
        # Get emission probabilities
        emissions = np.log(classifier.predict_proba(demo_X) + 1e-10)
        
        # Segment
        segments = hmm.segment(emissions)
        
        print(f"\n    Found {len(segments)} segments:")
        for seg in segments:
            print(f"      Windows {seg['start']}-{seg['end']}: {seg['author']} (conf={seg['confidence']:.3f})")
        
        # Store system info
        print("\n[5] Storing system configuration...")
        
        await conn.execute("""
            INSERT INTO build_qa_log (agent_name, check_name, passed, details)
            VALUES ($1, $2, $3, $4)
        """,
            'HMMSegmentation',
            'system_built',
            True,
            json.dumps({
                "n_authors": len(authors),
                "self_transition": SELF_TRANSITION,
                "calibration_temp": CALIBRATION_TEMP,
                "demo_segments": len(segments)
            })
        )
        
        print("\n" + "=" * 70)
        print("HMM SEGMENTATION COMPLETE")
        print(f"Authors: {len(authors)}")
        print(f"Demo segments found: {len(segments)}")
        print("=" * 70)
    
    await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
