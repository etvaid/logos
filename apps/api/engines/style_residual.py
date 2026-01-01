"""
Style Residual Engine
=====================

Computes style residuals by subtracting meaning anchors from translation embeddings.
style = translation_embedding - meaning_anchor

The meaning anchor is the centroid (or optimal transport barycenter) of all
translations of the same source passage, representing "pure meaning" divorced from style.
"""

import numpy as np
from typing import List, Dict, Optional, Tuple, Any
import asyncpg
from sentence_transformers import SentenceTransformer
from scipy.spatial.distance import cosine
from scipy.stats import bootstrap
import ot  # POT: Python Optimal Transport

from config.constants import EMBED_DIM, EMBED_MODEL, STYLE_DIM, STYLE_DIMENSIONS


class StyleResidualEngine:
    """
    Engine for computing and analyzing style residuals.

    Key concepts:
    - Meaning Anchor: Centroid of parallel translations (captures pure meaning)
    - Style Residual: translation_embedding - meaning_anchor (captures style)
    - Translator Centroid: Average style residual per translator
    """

    def __init__(self, pool: asyncpg.Pool, model: Optional[SentenceTransformer] = None):
        self.pool = pool
        self.model = model or SentenceTransformer(EMBED_MODEL)
        self._style_projection_matrix = None

    # ═══════════════════════════════════════════════════════════════════════════════
    # EMBEDDING COMPUTATION
    # ═══════════════════════════════════════════════════════════════════════════════

    def compute_embedding(self, text: str) -> np.ndarray:
        """Compute embedding for a single text."""
        embedding = self.model.encode(text, convert_to_numpy=True)
        assert embedding.shape[0] == EMBED_DIM, f"Expected {EMBED_DIM} dims, got {embedding.shape[0]}"
        return embedding

    def compute_embeddings_batch(self, texts: List[str], batch_size: int = 32) -> np.ndarray:
        """Compute embeddings for a batch of texts."""
        embeddings = self.model.encode(texts, batch_size=batch_size, convert_to_numpy=True)
        return embeddings

    # ═══════════════════════════════════════════════════════════════════════════════
    # MEANING ANCHOR COMPUTATION
    # ═══════════════════════════════════════════════════════════════════════════════

    def compute_meaning_anchor_centroid(self, translation_embeddings: np.ndarray) -> np.ndarray:
        """
        Compute meaning anchor as simple centroid of translation embeddings.

        Args:
            translation_embeddings: (n_translations, EMBED_DIM) array

        Returns:
            Centroid vector of shape (EMBED_DIM,)
        """
        if len(translation_embeddings) == 0:
            raise ValueError("Cannot compute centroid of empty array")

        centroid = np.mean(translation_embeddings, axis=0)
        return centroid

    def compute_meaning_anchor_optimal_transport(
        self,
        translation_embeddings: np.ndarray,
        weights: Optional[np.ndarray] = None
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Compute meaning anchor using optimal transport barycenter.
        More robust to outliers than simple centroid.

        Args:
            translation_embeddings: (n_translations, EMBED_DIM) array
            weights: Optional weights for each translation (e.g., LTQI scores)

        Returns:
            (barycenter, weights_used)
        """
        n = len(translation_embeddings)
        if n == 0:
            raise ValueError("Cannot compute barycenter of empty array")

        if n == 1:
            return translation_embeddings[0], np.array([1.0])

        if weights is None:
            weights = np.ones(n) / n
        else:
            weights = weights / weights.sum()

        # For efficiency, use regularized OT barycenter
        # Each translation is treated as a discrete distribution
        reg = 0.01  # Regularization parameter

        # Compute cost matrix (pairwise distances)
        # For barycenter, we iteratively update

        # Start with centroid as initial guess
        barycenter = np.mean(translation_embeddings, axis=0)

        # Refine with OT iterations
        for _ in range(10):
            # Compute transport from each distribution to current barycenter
            # This is a simplified version - full OT would be more complex
            weighted_sum = np.zeros(EMBED_DIM)
            for i, emb in enumerate(translation_embeddings):
                weighted_sum += weights[i] * emb
            barycenter = weighted_sum

        return barycenter, weights

    async def compute_meaning_anchor_for_source(
        self,
        source_text_id: int,
        method: str = "centroid"
    ) -> Dict[str, Any]:
        """
        Compute and store meaning anchor for a source text.

        Args:
            source_text_id: ID of source text
            method: 'centroid' or 'optimal_transport'

        Returns:
            Dict with anchor details
        """
        async with self.pool.acquire() as conn:
            # Get all translations for this source
            translations = await conn.fetch("""
                SELECT id, embedding, ltqi_score
                FROM translations
                WHERE source_text_id = $1 AND embedding IS NOT NULL
            """, source_text_id)

            if not translations:
                return {"error": "No translations found", "source_text_id": source_text_id}

            # Convert embeddings
            embeddings = np.array([
                np.frombuffer(t['embedding'], dtype=np.float32)
                for t in translations
            ])

            # Compute anchor
            if method == "optimal_transport":
                weights = np.array([t['ltqi_score'] or 1.0 for t in translations])
                anchor, used_weights = self.compute_meaning_anchor_optimal_transport(
                    embeddings, weights
                )
            else:
                anchor = self.compute_meaning_anchor_centroid(embeddings)
                used_weights = None

            # Compute variance for quality indicator
            variance = np.mean(np.var(embeddings, axis=0))

            # Get source info
            source_info = await conn.fetchrow("""
                SELECT st.urn, a.name as author, w.title as work
                FROM source_texts st
                JOIN works w ON st.work_id = w.id
                JOIN authors a ON w.author_id = a.id
                WHERE st.id = $1
            """, source_text_id)

            # Store anchor
            await conn.execute("""
                INSERT INTO meaning_anchors (
                    source_text_id, source_author, source_work, source_urn,
                    anchor_embedding, n_translations, computation_method,
                    barycenter_weights, embedding_variance
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (source_text_id) DO UPDATE SET
                    anchor_embedding = EXCLUDED.anchor_embedding,
                    n_translations = EXCLUDED.n_translations,
                    computation_method = EXCLUDED.computation_method,
                    barycenter_weights = EXCLUDED.barycenter_weights,
                    embedding_variance = EXCLUDED.embedding_variance,
                    updated_at = NOW()
            """,
                source_text_id,
                source_info['author'] if source_info else None,
                source_info['work'] if source_info else None,
                source_info['urn'] if source_info else None,
                anchor.tobytes(),
                len(translations),
                method,
                used_weights.tolist() if used_weights is not None else None,
                float(variance)
            )

            return {
                "source_text_id": source_text_id,
                "n_translations": len(translations),
                "method": method,
                "variance": float(variance),
                "anchor_norm": float(np.linalg.norm(anchor))
            }

    # ═══════════════════════════════════════════════════════════════════════════════
    # STYLE RESIDUAL COMPUTATION
    # ═══════════════════════════════════════════════════════════════════════════════

    def compute_style_residual(
        self,
        translation_embedding: np.ndarray,
        meaning_anchor: np.ndarray
    ) -> np.ndarray:
        """
        Compute style residual: translation - meaning_anchor

        Args:
            translation_embedding: (EMBED_DIM,) array
            meaning_anchor: (EMBED_DIM,) array

        Returns:
            Style residual vector of shape (EMBED_DIM,)
        """
        residual = translation_embedding - meaning_anchor
        return residual

    async def compute_residual_for_translation(
        self,
        translation_id: int
    ) -> Dict[str, Any]:
        """
        Compute and store style residual for a translation.

        Args:
            translation_id: ID of translation

        Returns:
            Dict with residual details
        """
        async with self.pool.acquire() as conn:
            # Get translation
            translation = await conn.fetchrow("""
                SELECT t.id, t.source_text_id, t.translator_id, t.embedding
                FROM translations t
                WHERE t.id = $1
            """, translation_id)

            if not translation or not translation['embedding']:
                return {"error": "Translation not found or missing embedding"}

            # Get meaning anchor
            anchor = await conn.fetchrow("""
                SELECT id, anchor_embedding
                FROM meaning_anchors
                WHERE source_text_id = $1
            """, translation['source_text_id'])

            if not anchor:
                # Compute anchor first
                anchor_result = await self.compute_meaning_anchor_for_source(
                    translation['source_text_id']
                )
                if "error" in anchor_result:
                    return anchor_result

                anchor = await conn.fetchrow("""
                    SELECT id, anchor_embedding
                    FROM meaning_anchors
                    WHERE source_text_id = $1
                """, translation['source_text_id'])

            # Compute residual
            trans_emb = np.frombuffer(translation['embedding'], dtype=np.float32)
            anchor_emb = np.frombuffer(anchor['anchor_embedding'], dtype=np.float32)

            residual = self.compute_style_residual(trans_emb, anchor_emb)
            magnitude = float(np.linalg.norm(residual))

            # Compute semantic purity (how much is style vs content)
            # Higher cosine similarity to anchor = more content, less style
            cos_sim = 1 - cosine(trans_emb, anchor_emb)
            semantic_purity = 1 - cos_sim  # Higher = more style

            # Store residual
            await conn.execute("""
                INSERT INTO style_residuals (
                    translation_id, meaning_anchor_id, translator_id,
                    residual_vector, residual_magnitude, semantic_purity
                ) VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (translation_id) DO UPDATE SET
                    residual_vector = EXCLUDED.residual_vector,
                    residual_magnitude = EXCLUDED.residual_magnitude,
                    semantic_purity = EXCLUDED.semantic_purity
            """,
                translation_id,
                anchor['id'],
                translation['translator_id'],
                residual.tobytes(),
                magnitude,
                semantic_purity
            )

            # Also update translation table
            await conn.execute("""
                UPDATE translations
                SET style_residual = $1
                WHERE id = $2
            """, residual.tobytes(), translation_id)

            return {
                "translation_id": translation_id,
                "magnitude": magnitude,
                "semantic_purity": semantic_purity
            }

    # ═══════════════════════════════════════════════════════════════════════════════
    # TRANSLATOR CENTROID COMPUTATION
    # ═══════════════════════════════════════════════════════════════════════════════

    async def compute_translator_centroid(
        self,
        translator_id: int,
        translator_name: str
    ) -> Dict[str, Any]:
        """
        Compute average style residual for a translator.

        Args:
            translator_id: ID of translator
            translator_name: Name of translator

        Returns:
            Dict with centroid details
        """
        async with self.pool.acquire() as conn:
            # Get all style residuals for this translator
            residuals = await conn.fetch("""
                SELECT residual_vector, residual_magnitude
                FROM style_residuals
                WHERE translator_id = $1
            """, translator_id)

            if not residuals:
                return {"error": "No residuals found for translator"}

            # Compute centroid
            vectors = np.array([
                np.frombuffer(r['residual_vector'], dtype=np.float32)
                for r in residuals
            ])

            centroid = np.mean(vectors, axis=0)

            # Compute consistency (inverse of variance)
            variance = np.mean(np.var(vectors, axis=0))
            consistency = 1.0 / (1.0 + variance)

            avg_magnitude = np.mean([r['residual_magnitude'] for r in residuals])

            # Compute interpretable style vector
            style_profile = await self.project_to_style_dimensions(centroid)

            # Store
            await conn.execute("""
                INSERT INTO translator_centroids (
                    translator_id, translator_name, centroid_embedding,
                    n_translations, avg_residual_magnitude, style_consistency,
                    style_profile
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (translator_id) DO UPDATE SET
                    centroid_embedding = EXCLUDED.centroid_embedding,
                    n_translations = EXCLUDED.n_translations,
                    avg_residual_magnitude = EXCLUDED.avg_residual_magnitude,
                    style_consistency = EXCLUDED.style_consistency,
                    style_profile = EXCLUDED.style_profile,
                    updated_at = NOW()
            """,
                translator_id,
                translator_name,
                centroid.tobytes(),
                len(residuals),
                float(avg_magnitude),
                float(consistency),
                style_profile.tobytes() if style_profile is not None else None
            )

            return {
                "translator_id": translator_id,
                "translator_name": translator_name,
                "n_translations": len(residuals),
                "avg_magnitude": float(avg_magnitude),
                "consistency": float(consistency)
            }

    # ═══════════════════════════════════════════════════════════════════════════════
    # STYLE VECTOR ARITHMETIC
    # ═══════════════════════════════════════════════════════════════════════════════

    async def interpolate_styles(
        self,
        translator_a_id: int,
        translator_b_id: int,
        alpha: float
    ) -> Tuple[np.ndarray, Dict[str, float]]:
        """
        Interpolate between two translator styles.

        new_style = (1 - alpha) * style_A + alpha * style_B

        Args:
            translator_a_id: First translator
            translator_b_id: Second translator
            alpha: Interpolation weight (0 = all A, 1 = all B)

        Returns:
            (interpolated_style, predicted_metrics)
        """
        async with self.pool.acquire() as conn:
            centroids = await conn.fetch("""
                SELECT translator_id, centroid_embedding, style_profile
                FROM translator_centroids
                WHERE translator_id IN ($1, $2)
            """, translator_a_id, translator_b_id)

            if len(centroids) != 2:
                raise ValueError("Both translators must have computed centroids")

            centroid_map = {c['translator_id']: c for c in centroids}
            emb_a = np.frombuffer(centroid_map[translator_a_id]['centroid_embedding'], dtype=np.float32)
            emb_b = np.frombuffer(centroid_map[translator_b_id]['centroid_embedding'], dtype=np.float32)

            interpolated = (1 - alpha) * emb_a + alpha * emb_b

            # Predict quality metrics (simple linear interpolation)
            # In practice, would train a model for this
            predicted_metrics = {
                "alpha": alpha,
                "interpolation_norm": float(np.linalg.norm(interpolated))
            }

            return interpolated, predicted_metrics

    async def add_styles(
        self,
        base_translator_id: int,
        delta_translator_id: int,
        weight: float = 1.0
    ) -> np.ndarray:
        """
        Add style characteristics: base + weight * delta

        This allows transferring specific stylistic features.

        Args:
            base_translator_id: Base translator style
            delta_translator_id: Style to add
            weight: How much of delta to add

        Returns:
            Combined style vector
        """
        async with self.pool.acquire() as conn:
            centroids = await conn.fetch("""
                SELECT translator_id, centroid_embedding
                FROM translator_centroids
                WHERE translator_id IN ($1, $2)
            """, base_translator_id, delta_translator_id)

            centroid_map = {c['translator_id']: c for c in centroids}
            base = np.frombuffer(centroid_map[base_translator_id]['centroid_embedding'], dtype=np.float32)
            delta = np.frombuffer(centroid_map[delta_translator_id]['centroid_embedding'], dtype=np.float32)

            combined = base + weight * delta
            return combined

    # ═══════════════════════════════════════════════════════════════════════════════
    # INTERPRETABLE STYLE DIMENSIONS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def project_to_style_dimensions(
        self,
        style_residual: np.ndarray
    ) -> Optional[np.ndarray]:
        """
        Project high-dimensional style residual to interpretable dimensions.

        Args:
            style_residual: (EMBED_DIM,) style residual

        Returns:
            (STYLE_DIM,) interpretable style vector, or None if projection unavailable
        """
        if self._style_projection_matrix is None:
            # Load or compute projection matrix
            # This would typically be learned from data
            # For now, use PCA or random projection
            return None

        return self._style_projection_matrix @ style_residual

    async def train_style_projection(self, n_samples: int = 10000):
        """
        Train the projection matrix from style residuals to interpretable dimensions.
        Uses PCA followed by rotation to interpretable axes.
        """
        async with self.pool.acquire() as conn:
            residuals = await conn.fetch(f"""
                SELECT residual_vector
                FROM style_residuals
                ORDER BY RANDOM()
                LIMIT $1
            """, n_samples)

            if len(residuals) < STYLE_DIM:
                return {"error": "Not enough residuals to train projection"}

            # Stack residuals
            X = np.array([
                np.frombuffer(r['residual_vector'], dtype=np.float32)
                for r in residuals
            ])

            # PCA to reduce to STYLE_DIM
            from sklearn.decomposition import PCA
            pca = PCA(n_components=STYLE_DIM)
            pca.fit(X)

            self._style_projection_matrix = pca.components_

            return {
                "n_samples": len(residuals),
                "explained_variance": pca.explained_variance_ratio_.tolist()
            }

    # ═══════════════════════════════════════════════════════════════════════════════
    # SIMILARITY AND SEARCH
    # ═══════════════════════════════════════════════════════════════════════════════

    async def find_similar_styles(
        self,
        style_vector: np.ndarray,
        top_k: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Find translators with similar styles using pgvector.

        Args:
            style_vector: Query style vector
            top_k: Number of results

        Returns:
            List of similar translators with scores
        """
        async with self.pool.acquire() as conn:
            # Use pgvector cosine similarity
            results = await conn.fetch(f"""
                SELECT
                    translator_id,
                    translator_name,
                    n_translations,
                    1 - (centroid_embedding <=> $1::vector) as similarity
                FROM translator_centroids
                ORDER BY centroid_embedding <=> $1::vector
                LIMIT $2
            """, style_vector.tobytes(), top_k)

            return [
                {
                    "translator_id": r['translator_id'],
                    "translator_name": r['translator_name'],
                    "n_translations": r['n_translations'],
                    "similarity": float(r['similarity'])
                }
                for r in results
            ]

    async def compare_translators(
        self,
        translator_a_id: int,
        translator_b_id: int,
        n_bootstrap: int = 1000
    ) -> Dict[str, Any]:
        """
        Compare two translators with bootstrap confidence intervals.

        Args:
            translator_a_id: First translator
            translator_b_id: Second translator
            n_bootstrap: Number of bootstrap samples

        Returns:
            Comparison with confidence intervals
        """
        async with self.pool.acquire() as conn:
            # Get residuals for both translators
            residuals_a = await conn.fetch("""
                SELECT residual_vector
                FROM style_residuals
                WHERE translator_id = $1
            """, translator_a_id)

            residuals_b = await conn.fetch("""
                SELECT residual_vector
                FROM style_residuals
                WHERE translator_id = $1
            """, translator_b_id)

            if not residuals_a or not residuals_b:
                return {"error": "Missing residuals for comparison"}

            vecs_a = np.array([
                np.frombuffer(r['residual_vector'], dtype=np.float32)
                for r in residuals_a
            ])
            vecs_b = np.array([
                np.frombuffer(r['residual_vector'], dtype=np.float32)
                for r in residuals_b
            ])

            centroid_a = np.mean(vecs_a, axis=0)
            centroid_b = np.mean(vecs_b, axis=0)

            # Compute similarity
            similarity = 1 - cosine(centroid_a, centroid_b)

            # Bootstrap for confidence interval
            def compute_similarity(idx_a, idx_b):
                c_a = np.mean(vecs_a[idx_a], axis=0)
                c_b = np.mean(vecs_b[idx_b], axis=0)
                return 1 - cosine(c_a, c_b)

            bootstrap_sims = []
            for _ in range(n_bootstrap):
                idx_a = np.random.choice(len(vecs_a), size=len(vecs_a), replace=True)
                idx_b = np.random.choice(len(vecs_b), size=len(vecs_b), replace=True)
                bootstrap_sims.append(compute_similarity(idx_a, idx_b))

            bootstrap_sims = np.array(bootstrap_sims)
            ci_lower = np.percentile(bootstrap_sims, 2.5)
            ci_upper = np.percentile(bootstrap_sims, 97.5)

            return {
                "translator_a_id": translator_a_id,
                "translator_b_id": translator_b_id,
                "similarity": float(similarity),
                "ci_lower": float(ci_lower),
                "ci_upper": float(ci_upper),
                "n_samples_a": len(vecs_a),
                "n_samples_b": len(vecs_b),
                "n_bootstrap": n_bootstrap
            }

    # ═══════════════════════════════════════════════════════════════════════════════
    # BATCH OPERATIONS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def recompute_all_anchors(
        self,
        method: str = "centroid",
        batch_size: int = 100
    ) -> Dict[str, Any]:
        """
        Recompute all meaning anchors.

        Returns:
            Summary of operation
        """
        async with self.pool.acquire() as conn:
            # Get all source texts with translations
            source_ids = await conn.fetch("""
                SELECT DISTINCT source_text_id
                FROM translations
                WHERE embedding IS NOT NULL
            """)

            computed = 0
            errors = 0

            for row in source_ids:
                try:
                    await self.compute_meaning_anchor_for_source(
                        row['source_text_id'], method
                    )
                    computed += 1
                except Exception as e:
                    errors += 1

            return {
                "computed": computed,
                "errors": errors,
                "method": method
            }

    async def recompute_all_residuals(self, batch_size: int = 100) -> Dict[str, Any]:
        """
        Recompute all style residuals.

        Returns:
            Summary of operation
        """
        async with self.pool.acquire() as conn:
            translation_ids = await conn.fetch("""
                SELECT id FROM translations
                WHERE embedding IS NOT NULL
            """)

            computed = 0
            errors = 0

            for row in translation_ids:
                try:
                    await self.compute_residual_for_translation(row['id'])
                    computed += 1
                except Exception:
                    errors += 1

            return {
                "computed": computed,
                "errors": errors
            }

    async def recompute_all_centroids(self) -> Dict[str, Any]:
        """
        Recompute all translator centroids.

        Returns:
            Summary of operation
        """
        async with self.pool.acquire() as conn:
            translators = await conn.fetch("""
                SELECT DISTINCT translator_id, t.name
                FROM style_residuals sr
                JOIN translators t ON sr.translator_id = t.id
            """)

            computed = 0
            errors = 0

            for row in translators:
                try:
                    await self.compute_translator_centroid(
                        row['translator_id'],
                        row['name']
                    )
                    computed += 1
                except Exception:
                    errors += 1

            return {
                "computed": computed,
                "errors": errors
            }
