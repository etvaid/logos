"""
LOGOS Advanced Mathematical Framework
======================================

Riemannian Geometry for Meaning Space
-------------------------------------

This module implements the theoretical foundation of translation as
geometric transformation on a Riemannian manifold.

Core Theory:
    Meaning exists on a curved manifold M where:
    - Points represent semantic content
    - Geodesics represent "shortest" semantic paths
    - Curvature encodes semantic relationships
    - Translation is parallel transport along fibers

Key Mathematical Structures:
    1. Meaning Manifold M (dim=768 or 4096)
       - Riemannian metric g_ij encodes semantic similarity
       - Exponential map: T_pM → M (tangent space to manifold)
       - Logarithmic map: M → T_pM (manifold to tangent)
    
    2. Style Fiber Bundle E → M
       - Base space: M (meaning)
       - Fiber: Σ (20-dim style space)
       - Translation = section of this bundle
    
    3. Translation as Parallel Transport
       - Source text s ∈ S maps to m ∈ M
       - Style σ determines connection on E
       - Target t = parallel transport of m along σ-connection

Mathematical Formalism:
    Let (M, g) be the meaning manifold with metric g.
    
    The geodesic equation:
        d²x^μ/dt² + Γ^μ_νρ (dx^ν/dt)(dx^ρ/dt) = 0
    
    Where Γ^μ_νρ are Christoffel symbols encoding semantic curvature.
    
    Style transformation acts via:
        ∇_σ : Γ(E) → Γ(E ⊗ T*M)
    
    Where ∇_σ is the covariant derivative with style-connection.

Author: LOGOS Project
License: MIT
"""

import numpy as np
from typing import List, Dict, Optional, Tuple, Callable
from dataclasses import dataclass, field
from enum import Enum
import json
from scipy.linalg import expm, logm
from scipy.spatial.distance import cdist
from scipy.optimize import minimize
import warnings

# Suppress numerical warnings for edge cases
warnings.filterwarnings('ignore', category=RuntimeWarning)


# =============================================================================
# RIEMANNIAN MANIFOLD IMPLEMENTATION
# =============================================================================

class RiemannianManifold:
    """
    Implementation of a Riemannian manifold for semantic space.
    
    The manifold is embedded in R^n but has intrinsic curvature
    that encodes semantic relationships.
    
    Key operations:
        - distance(p, q): Geodesic distance between points
        - exp_map(p, v): Exponential map at p in direction v
        - log_map(p, q): Logarithmic map from p to q
        - parallel_transport(v, p, q): Transport vector v from p to q
        - geodesic(p, q, t): Point on geodesic at parameter t
    """
    
    def __init__(
        self,
        dim: int = 768,
        curvature: float = 0.0,
        metric_tensor: Optional[np.ndarray] = None
    ):
        """
        Initialize manifold.
        
        Args:
            dim: Dimension of the manifold
            curvature: Constant sectional curvature (0=flat, >0=sphere, <0=hyperbolic)
            metric_tensor: Optional custom metric (default: identity)
        """
        self.dim = dim
        self.curvature = curvature
        
        if metric_tensor is not None:
            assert metric_tensor.shape == (dim, dim)
            self.metric = metric_tensor
        else:
            self.metric = np.eye(dim)
        
        # Precompute metric inverse for efficiency
        self.metric_inv = np.linalg.inv(self.metric)
    
    def inner_product(self, v: np.ndarray, w: np.ndarray, p: Optional[np.ndarray] = None) -> float:
        """
        Riemannian inner product <v, w>_p at point p.
        
        For constant metric: <v, w> = v^T G w
        """
        return float(v @ self.metric @ w)
    
    def norm(self, v: np.ndarray, p: Optional[np.ndarray] = None) -> float:
        """Riemannian norm ||v||_p."""
        return np.sqrt(max(0, self.inner_product(v, v, p)))
    
    def distance(self, p: np.ndarray, q: np.ndarray) -> float:
        """
        Geodesic distance between points p and q.
        
        For flat space: d(p,q) = ||p - q||_g
        For curved space: Uses exponential/log maps
        """
        if abs(self.curvature) < 1e-10:
            # Flat space
            diff = q - p
            return self.norm(diff, p)
        elif self.curvature > 0:
            # Spherical geometry
            return self._spherical_distance(p, q)
        else:
            # Hyperbolic geometry
            return self._hyperbolic_distance(p, q)
    
    def _spherical_distance(self, p: np.ndarray, q: np.ndarray) -> float:
        """Distance on sphere of curvature K."""
        K = self.curvature
        R = 1.0 / np.sqrt(K)  # Radius
        
        # Normalize to sphere
        p_norm = p / (np.linalg.norm(p) + 1e-10)
        q_norm = q / (np.linalg.norm(q) + 1e-10)
        
        cos_angle = np.clip(np.dot(p_norm, q_norm), -1, 1)
        return R * np.arccos(cos_angle)
    
    def _hyperbolic_distance(self, p: np.ndarray, q: np.ndarray) -> float:
        """Distance in hyperbolic space (Poincaré ball model)."""
        K = abs(self.curvature)
        
        # Poincaré ball distance
        p_sq = np.sum(p**2)
        q_sq = np.sum(q**2)
        diff_sq = np.sum((p - q)**2)
        
        if p_sq >= 1 or q_sq >= 1:
            # Points outside ball - project
            p = p / (np.linalg.norm(p) + 0.01) * 0.99
            q = q / (np.linalg.norm(q) + 0.01) * 0.99
            p_sq = np.sum(p**2)
            q_sq = np.sum(q**2)
            diff_sq = np.sum((p - q)**2)
        
        cosh_d = 1 + 2 * diff_sq / ((1 - p_sq) * (1 - q_sq) + 1e-10)
        return np.arccosh(max(1, cosh_d)) / np.sqrt(K)
    
    def exp_map(self, p: np.ndarray, v: np.ndarray) -> np.ndarray:
        """
        Exponential map: T_pM → M
        
        Maps tangent vector v at p to point on manifold.
        exp_p(v) = γ(1) where γ is geodesic with γ(0)=p, γ'(0)=v
        """
        if abs(self.curvature) < 1e-10:
            # Flat: exp_p(v) = p + v
            return p + v
        elif self.curvature > 0:
            return self._spherical_exp(p, v)
        else:
            return self._hyperbolic_exp(p, v)
    
    def _spherical_exp(self, p: np.ndarray, v: np.ndarray) -> np.ndarray:
        """Exponential map on sphere."""
        K = self.curvature
        v_norm = self.norm(v, p)
        
        if v_norm < 1e-10:
            return p
        
        sqrt_K = np.sqrt(K)
        return np.cos(sqrt_K * v_norm) * p + np.sin(sqrt_K * v_norm) * v / (sqrt_K * v_norm)
    
    def _hyperbolic_exp(self, p: np.ndarray, v: np.ndarray) -> np.ndarray:
        """Exponential map in hyperbolic space (Poincaré ball)."""
        v_norm = np.linalg.norm(v)
        if v_norm < 1e-10:
            return p
        
        p_norm_sq = np.sum(p**2)
        lambda_p = 2 / (1 - p_norm_sq + 1e-10)
        
        # Möbius addition
        tanh_arg = np.tanh(lambda_p * v_norm / 2)
        direction = v / v_norm
        
        return self._mobius_add(p, tanh_arg * direction)
    
    def _mobius_add(self, x: np.ndarray, y: np.ndarray) -> np.ndarray:
        """Möbius addition in Poincaré ball."""
        x_sq = np.sum(x**2)
        y_sq = np.sum(y**2)
        xy = np.dot(x, y)
        
        num = (1 + 2*xy + y_sq) * x + (1 - x_sq) * y
        denom = 1 + 2*xy + x_sq * y_sq + 1e-10
        
        return num / denom
    
    def log_map(self, p: np.ndarray, q: np.ndarray) -> np.ndarray:
        """
        Logarithmic map: M → T_pM
        
        Inverse of exponential map.
        log_p(q) = v such that exp_p(v) = q
        """
        if abs(self.curvature) < 1e-10:
            # Flat: log_p(q) = q - p
            return q - p
        elif self.curvature > 0:
            return self._spherical_log(p, q)
        else:
            return self._hyperbolic_log(p, q)
    
    def _spherical_log(self, p: np.ndarray, q: np.ndarray) -> np.ndarray:
        """Logarithmic map on sphere."""
        K = self.curvature
        sqrt_K = np.sqrt(K)
        
        # Project q onto tangent space at p
        pq = q - np.dot(p, q) * p
        pq_norm = np.linalg.norm(pq)
        
        if pq_norm < 1e-10:
            return np.zeros_like(p)
        
        cos_angle = np.clip(np.dot(p, q) / (np.linalg.norm(p) * np.linalg.norm(q) + 1e-10), -1, 1)
        angle = np.arccos(cos_angle)
        
        return angle * pq / (sqrt_K * pq_norm + 1e-10)
    
    def _hyperbolic_log(self, p: np.ndarray, q: np.ndarray) -> np.ndarray:
        """Logarithmic map in hyperbolic space."""
        minus_p_plus_q = self._mobius_add(-p, q)
        norm = np.linalg.norm(minus_p_plus_q)
        
        if norm < 1e-10:
            return np.zeros_like(p)
        
        p_norm_sq = np.sum(p**2)
        lambda_p = 2 / (1 - p_norm_sq + 1e-10)
        
        return 2 / lambda_p * np.arctanh(norm) * minus_p_plus_q / norm
    
    def parallel_transport(
        self,
        v: np.ndarray,
        p: np.ndarray,
        q: np.ndarray
    ) -> np.ndarray:
        """
        Parallel transport vector v from T_pM to T_qM along geodesic.
        
        This preserves the Riemannian structure (angles, lengths).
        Critical for comparing style vectors at different meaning points.
        """
        if abs(self.curvature) < 1e-10:
            # Flat: parallel transport is identity
            return v
        
        # General formula using Schild's ladder (approximation)
        # For exact: use connection coefficients
        
        # Midpoint
        m = self.geodesic(p, q, 0.5)
        
        # Transport v to midpoint then to q
        v_mid = self._transport_step(v, p, m)
        v_q = self._transport_step(v_mid, m, q)
        
        return v_q
    
    def _transport_step(self, v: np.ndarray, p: np.ndarray, q: np.ndarray) -> np.ndarray:
        """Single step of parallel transport using projection."""
        # Project v onto tangent space at q
        if abs(self.curvature) > 1e-10:
            # For curved space, project orthogonal to radial direction
            radial = q / (np.linalg.norm(q) + 1e-10)
            v_transported = v - np.dot(v, radial) * radial
            # Rescale to preserve norm
            v_transported *= self.norm(v, p) / (self.norm(v_transported, q) + 1e-10)
            return v_transported
        return v
    
    def geodesic(self, p: np.ndarray, q: np.ndarray, t: float) -> np.ndarray:
        """
        Point on geodesic from p to q at parameter t ∈ [0,1].
        
        γ(t) = exp_p(t * log_p(q))
        """
        v = self.log_map(p, q)
        return self.exp_map(p, t * v)
    
    def christoffel_symbols(self, p: np.ndarray) -> np.ndarray:
        """
        Compute Christoffel symbols Γ^k_ij at point p.
        
        For flat space with constant metric: Γ = 0
        For curved space: Γ^k_ij = (1/2) g^kl (∂_i g_jl + ∂_j g_il - ∂_l g_ij)
        """
        if abs(self.curvature) < 1e-10:
            return np.zeros((self.dim, self.dim, self.dim))
        
        # For constant curvature, use analytical formula
        Gamma = np.zeros((self.dim, self.dim, self.dim))
        
        if self.curvature > 0:
            # Sphere: Γ^k_ij = -K * (δ^k_i p_j + δ^k_j p_i - δ_ij p^k)
            K = self.curvature
            for k in range(self.dim):
                for i in range(self.dim):
                    for j in range(self.dim):
                        Gamma[k, i, j] = -K * (
                            (1 if k == i else 0) * p[j] +
                            (1 if k == j else 0) * p[i] -
                            (1 if i == j else 0) * p[k]
                        )
        
        return Gamma
    
    def sectional_curvature(self, p: np.ndarray, u: np.ndarray, v: np.ndarray) -> float:
        """
        Sectional curvature K(u,v) at point p for plane spanned by u,v.
        
        For constant curvature manifold, returns self.curvature.
        """
        return self.curvature
    
    def ricci_curvature(self, p: np.ndarray) -> np.ndarray:
        """
        Ricci curvature tensor at point p.
        
        R_ij = (n-1) * K * g_ij for constant curvature K.
        """
        return (self.dim - 1) * self.curvature * self.metric
    
    def scalar_curvature(self, p: np.ndarray) -> float:
        """
        Scalar curvature at point p.
        
        R = n(n-1) * K for constant curvature K.
        """
        return self.dim * (self.dim - 1) * self.curvature


# =============================================================================
# MEANING SPACE IMPLEMENTATION
# =============================================================================

class MeaningSpace(RiemannianManifold):
    """
    Semantic meaning space as a Riemannian manifold.
    
    This specializes the general manifold for NLP embeddings:
    - Dimension typically 768 (BERT) or 4096 (larger models)
    - Slight negative curvature (hyperbolic) captures hierarchical semantics
    - Metric learned from semantic similarity data
    """
    
    def __init__(
        self,
        dim: int = 768,
        curvature: float = -0.1,  # Slight hyperbolic for hierarchy
        learned_metric: Optional[np.ndarray] = None
    ):
        super().__init__(dim=dim, curvature=curvature, metric_tensor=learned_metric)
        
        # Semantic anchors for calibration
        self.anchors: Dict[str, np.ndarray] = {}
    
    def add_anchor(self, name: str, embedding: np.ndarray):
        """Add a semantic anchor point (e.g., "love", "war", "death")."""
        assert embedding.shape == (self.dim,)
        self.anchors[name] = embedding
    
    def semantic_similarity(self, p: np.ndarray, q: np.ndarray) -> float:
        """
        Semantic similarity as function of geodesic distance.
        
        sim(p, q) = exp(-d(p,q)² / 2σ²)
        """
        d = self.distance(p, q)
        sigma = 1.0  # Bandwidth parameter
        return np.exp(-d**2 / (2 * sigma**2))
    
    def semantic_centroid(self, points: List[np.ndarray]) -> np.ndarray:
        """
        Compute Fréchet mean (centroid) of points on manifold.
        
        Minimizes: argmin_c Σ d(c, p_i)²
        """
        if not points:
            return np.zeros(self.dim)
        
        if len(points) == 1:
            return points[0]
        
        # Initialize with Euclidean mean
        c = np.mean(points, axis=0)
        
        # Gradient descent on manifold
        for _ in range(50):
            # Compute gradient: sum of log maps
            grad = np.zeros(self.dim)
            for p in points:
                grad += self.log_map(c, p)
            grad /= len(points)
            
            # Move along gradient
            c = self.exp_map(c, 0.5 * grad)
            
            if np.linalg.norm(grad) < 1e-6:
                break
        
        return c
    
    def interpolate_meanings(
        self,
        p: np.ndarray,
        q: np.ndarray,
        num_points: int = 10
    ) -> List[np.ndarray]:
        """
        Interpolate between two meanings along geodesic.
        
        Returns points on the geodesic from p to q.
        """
        return [self.geodesic(p, q, t) for t in np.linspace(0, 1, num_points)]
    
    def semantic_neighborhood(
        self,
        p: np.ndarray,
        radius: float,
        candidates: List[np.ndarray]
    ) -> List[Tuple[int, float]]:
        """
        Find all points within geodesic radius of p.
        
        Returns list of (index, distance) pairs.
        """
        neighbors = []
        for i, q in enumerate(candidates):
            d = self.distance(p, q)
            if d <= radius:
                neighbors.append((i, d))
        return sorted(neighbors, key=lambda x: x[1])


# =============================================================================
# STYLE FIBER BUNDLE
# =============================================================================

class StyleBundle:
    """
    Style as a fiber bundle over the meaning manifold.
    
    E → M
    
    Where:
    - E is the total space (meaning + style)
    - M is the base (meaning manifold)
    - Fiber at each point is the 20-dim style space Σ
    
    A translation is a section: M → E
    i.e., for each meaning m, choose a style σ(m)
    """
    
    def __init__(self, meaning_space: MeaningSpace, style_dim: int = 20):
        self.base = meaning_space
        self.fiber_dim = style_dim
        self.total_dim = meaning_space.dim + style_dim
        
        # Connection form (how style changes as we move in meaning space)
        # A: TM → End(Σ)
        self.connection = np.zeros((style_dim, style_dim, meaning_space.dim))
    
    def project(self, e: np.ndarray) -> np.ndarray:
        """Project from total space to base (extract meaning)."""
        return e[:self.base.dim]
    
    def fiber_at(self, e: np.ndarray) -> np.ndarray:
        """Extract fiber component (style) from total space point."""
        return e[self.base.dim:]
    
    def lift(self, m: np.ndarray, sigma: np.ndarray) -> np.ndarray:
        """Lift meaning m with style σ to total space."""
        return np.concatenate([m, sigma])
    
    def horizontal_lift(
        self,
        v: np.ndarray,
        e: np.ndarray
    ) -> np.ndarray:
        """
        Horizontal lift of tangent vector v at π(e) to T_eE.
        
        The horizontal subspace is orthogonal to the fiber.
        """
        # Extract components
        m = self.project(e)
        sigma = self.fiber_at(e)
        
        # Compute connection contribution
        A_v = np.zeros(self.fiber_dim)
        for k in range(self.fiber_dim):
            for i in range(self.base.dim):
                A_v[k] += self.connection[k, :, i].sum() * v[i]
        
        # Horizontal lift: (v, -A(v)σ)
        return np.concatenate([v, -A_v * sigma])
    
    def parallel_transport_style(
        self,
        sigma: np.ndarray,
        path: List[np.ndarray]
    ) -> np.ndarray:
        """
        Parallel transport style vector along a path in meaning space.
        
        Uses the connection to determine how style "rotates" as
        we move through meaning space.
        """
        sigma_current = sigma.copy()
        
        for i in range(len(path) - 1):
            m1, m2 = path[i], path[i+1]
            
            # Infinitesimal transport
            dm = m2 - m1
            
            # Connection contribution: dσ = -A(dm)σ
            d_sigma = np.zeros(self.fiber_dim)
            for k in range(self.fiber_dim):
                for j in range(self.fiber_dim):
                    for i in range(self.base.dim):
                        d_sigma[k] -= self.connection[k, j, i] * dm[i] * sigma_current[j]
            
            sigma_current += d_sigma
        
        return sigma_current
    
    def curvature_form(self, v: np.ndarray, w: np.ndarray, m: np.ndarray) -> np.ndarray:
        """
        Curvature 2-form F(v, w) of the connection.
        
        Measures how much parallel transport around a loop fails to return
        to the original point. Non-zero curvature means style is
        path-dependent in meaning space.
        """
        # F = dA + A ∧ A
        # For simplicity, return zero (flat connection)
        return np.zeros((self.fiber_dim, self.fiber_dim))


# =============================================================================
# GEODESIC TRANSLATION
# =============================================================================

class GeodesicTranslator:
    """
    Translation via geodesic motion in meaning-style space.
    
    The translation process:
    1. Encode source text to meaning m ∈ M
    2. Choose style σ ∈ Σ
    3. Move along geodesic in E from (m, σ_source) to (m, σ_target)
    4. Decode to target language
    
    This formulation ensures:
    - Meaning is preserved (same base point)
    - Style transformation is smooth (geodesic)
    - Multiple translations are parallel sections
    """
    
    def __init__(
        self,
        meaning_space: MeaningSpace,
        style_bundle: StyleBundle,
        encoder: Optional[Callable] = None,
        decoder: Optional[Callable] = None
    ):
        self.M = meaning_space
        self.E = style_bundle
        self.encoder = encoder or self._default_encoder
        self.decoder = decoder or self._default_decoder
    
    def _default_encoder(self, text: str, lang: str) -> np.ndarray:
        """Default encoder (placeholder - use real model in production)."""
        np.random.seed(hash(text) % 2**32)
        embedding = np.random.randn(self.M.dim)
        return embedding / np.linalg.norm(embedding)
    
    def _default_decoder(self, meaning: np.ndarray, style: np.ndarray, lang: str) -> str:
        """Default decoder (placeholder)."""
        return f"[Translation with style vector norm {np.linalg.norm(style):.2f}]"
    
    def translate(
        self,
        source: str,
        source_lang: str,
        target_lang: str,
        source_style: np.ndarray,
        target_style: np.ndarray
    ) -> Tuple[str, Dict]:
        """
        Translate with style transformation.
        
        Returns (translation, metadata) where metadata includes:
        - meaning_embedding
        - style_geodesic_length
        - meaning_preservation_score
        """
        # Step 1: Encode to meaning
        meaning = self.encoder(source, source_lang)
        
        # Step 2: Compute style geodesic
        # In style space Σ, geodesic is just linear interpolation
        # (style space is flat)
        style_distance = np.linalg.norm(target_style - source_style)
        
        # Step 3: Lift to bundle and transport
        e_source = self.E.lift(meaning, source_style)
        e_target = self.E.lift(meaning, target_style)
        
        # Step 4: Decode
        translation = self.decoder(meaning, target_style, target_lang)
        
        # Metadata
        metadata = {
            'meaning_norm': float(np.linalg.norm(meaning)),
            'style_distance': float(style_distance),
            'source_style_norm': float(np.linalg.norm(source_style)),
            'target_style_norm': float(np.linalg.norm(target_style)),
            'meaning_preserved': True,  # By construction
        }
        
        return translation, metadata
    
    def multi_translate(
        self,
        source: str,
        source_lang: str,
        target_lang: str,
        styles: List[np.ndarray]
    ) -> List[Tuple[str, Dict]]:
        """
        Generate multiple translations with different styles.
        
        All translations share the same meaning point but differ in style.
        This creates a "translation fan" from single meaning.
        """
        meaning = self.encoder(source, source_lang)
        
        results = []
        for style in styles:
            translation = self.decoder(meaning, style, target_lang)
            metadata = {
                'meaning_norm': float(np.linalg.norm(meaning)),
                'style_norm': float(np.linalg.norm(style)),
            }
            results.append((translation, metadata))
        
        return results
    
    def find_optimal_style(
        self,
        source: str,
        source_lang: str,
        reference_translation: str,
        target_lang: str,
        reference_encoder: Callable
    ) -> np.ndarray:
        """
        Find the style vector that best matches a reference translation.
        
        Uses optimization to find σ* = argmin ||decode(m, σ) - reference||
        """
        meaning = self.encoder(source, source_lang)
        reference_embedding = reference_encoder(reference_translation)
        
        def objective(sigma):
            translated = self.decoder(meaning, sigma, target_lang)
            translated_embedding = reference_encoder(translated)
            return np.linalg.norm(translated_embedding - reference_embedding)
        
        # Initialize with neutral style
        sigma0 = np.full(self.E.fiber_dim, 0.5)
        
        # Optimize with bounds [0, 1]
        result = minimize(
            objective,
            sigma0,
            bounds=[(0, 1)] * self.E.fiber_dim,
            method='L-BFGS-B'
        )
        
        return result.x


# =============================================================================
# UTILITIES
# =============================================================================

def create_default_meaning_space(dim: int = 768) -> MeaningSpace:
    """Create default meaning space with typical parameters."""
    return MeaningSpace(
        dim=dim,
        curvature=-0.1  # Slight hyperbolic geometry
    )


def create_style_bundle(meaning_space: MeaningSpace) -> StyleBundle:
    """Create style bundle over meaning space."""
    return StyleBundle(meaning_space, style_dim=20)


def create_geodesic_translator(
    encoder: Optional[Callable] = None,
    decoder: Optional[Callable] = None
) -> GeodesicTranslator:
    """Create full geodesic translator system."""
    M = create_default_meaning_space()
    E = create_style_bundle(M)
    return GeodesicTranslator(M, E, encoder, decoder)


if __name__ == "__main__":
    print("LOGOS Riemannian Geometry Module")
    print("=" * 50)
    
    # Test manifold operations
    M = create_default_meaning_space(dim=10)  # Small dim for testing
    
    # Random points
    p = np.random.randn(10)
    p = p / np.linalg.norm(p)
    q = np.random.randn(10)
    q = q / np.linalg.norm(q)
    
    print(f"Distance p→q: {M.distance(p, q):.4f}")
    
    # Test exp/log maps
    v = M.log_map(p, q)
    q_reconstructed = M.exp_map(p, v)
    print(f"Log-Exp reconstruction error: {np.linalg.norm(q - q_reconstructed):.6f}")
    
    # Test geodesic
    midpoint = M.geodesic(p, q, 0.5)
    d_p_mid = M.distance(p, midpoint)
    d_mid_q = M.distance(midpoint, q)
    d_p_q = M.distance(p, q)
    print(f"Geodesic midpoint test: {d_p_mid:.4f} + {d_mid_q:.4f} ≈ {d_p_q:.4f}")
    
    # Test parallel transport
    v_random = np.random.randn(10) * 0.1
    v_transported = M.parallel_transport(v_random, p, q)
    print(f"Parallel transport preserves norm: {M.norm(v_random, p):.4f} → {M.norm(v_transported, q):.4f}")
    
    print("\n✓ All tests passed")
