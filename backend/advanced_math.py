"""
LOGOS Advanced Mathematical Framework
=====================================

This module implements the deep mathematical theory underlying translation:

1. RIEMANNIAN MANIFOLDS for Meaning Space
   - Meaning exists on a curved manifold, not flat Euclidean space
   - Geodesics represent optimal translation paths
   - Curvature encodes semantic difficulty

2. LIE GROUPS for Style Transformations
   - Style changes are group operations
   - Composition: σ₁ ∘ σ₂ = combined style
   - Inverse: σ⁻¹ = "undo" a style
   - Identity: neutral style

3. FIBER BUNDLES for Translation Structure
   - Base space: Meaning manifold M
   - Fiber: Style space Σ at each point
   - Translation = section of the bundle

4. GEODESIC INTERPOLATION
   - Smooth paths between translator styles
   - Not linear interpolation (respects manifold geometry)
   - Parallel transport of style along meaning

5. CURVATURE ANALYSIS
   - High curvature = semantic difficulty
   - Negative curvature = multiple valid interpretations
   - Flat regions = straightforward translation

Mathematical Foundations:
    - Differential geometry (do Carmo, Lee)
    - Lie theory (Hall, Kirillov)
    - Information geometry (Amari)

Author: LOGOS Project
License: MIT
"""

import numpy as np
from typing import List, Dict, Optional, Tuple, Callable
from dataclasses import dataclass, field
from scipy.linalg import expm, logm
from scipy.spatial.distance import pdist, squareform
from scipy.optimize import minimize
import warnings


# =============================================================================
# RIEMANNIAN MANIFOLD FOR MEANING SPACE
# =============================================================================

class MeaningManifold:
    """
    Riemannian manifold structure on meaning space.
    
    The key insight: meaning does NOT live in flat Euclidean space.
    Semantic relationships have intrinsic curvature - some meanings
    are "closer" than Euclidean distance suggests, others "farther".
    
    We model this with a learned metric tensor g_ij(x) that varies
    across the manifold. Distance is computed by integrating:
    
        d(p,q) = ∫ √(g_ij dx^i dx^j) along geodesic
    
    For computational tractability, we use a diagonal metric:
        g_ii(x) = 1 + κ_i · f_i(x)
        
    Where κ_i are learned curvature parameters and f_i are
    feature functions on the embedding space.
    """
    
    def __init__(self, dim: int = 768, curvature_params: Optional[np.ndarray] = None):
        self.dim = dim
        self.curvature = curvature_params or np.zeros(dim)
        
        # Learned semantic clusters (affect local metric)
        self.cluster_centers = []
        self.cluster_radii = []
    
    def metric_tensor(self, point: np.ndarray) -> np.ndarray:
        """
        Compute the metric tensor g_ij at a point.
        
        Returns diagonal metric (for efficiency).
        Full metric would be dim × dim matrix.
        """
        g = np.ones(self.dim)
        
        # Add curvature contributions from nearby clusters
        for center, radius in zip(self.cluster_centers, self.cluster_radii):
            dist = np.linalg.norm(point - center)
            if dist < radius * 3:
                # Gaussian bump in metric near cluster centers
                bump = np.exp(-(dist / radius) ** 2)
                g += bump * self.curvature
        
        return np.diag(g)
    
    def inner_product(self, point: np.ndarray, v1: np.ndarray, v2: np.ndarray) -> float:
        """
        Riemannian inner product: <v1, v2>_p = v1^T g(p) v2
        """
        g = self.metric_tensor(point)
        return float(v1 @ g @ v2)
    
    def norm(self, point: np.ndarray, v: np.ndarray) -> float:
        """Riemannian norm of tangent vector."""
        return np.sqrt(self.inner_product(point, v, v))
    
    def geodesic_distance(
        self, 
        p: np.ndarray, 
        q: np.ndarray, 
        num_steps: int = 100
    ) -> float:
        """
        Approximate geodesic distance by numerical integration.
        
        For the true geodesic, we'd solve the geodesic equation:
            d²x^i/dt² + Γ^i_jk (dx^j/dt)(dx^k/dt) = 0
            
        For efficiency, we approximate with a straight line and
        integrate the metric along it.
        """
        # Parameterize straight path (approximation)
        t = np.linspace(0, 1, num_steps)
        path = np.outer(1 - t, p) + np.outer(t, q)
        
        # Integrate metric along path
        total = 0.0
        velocity = q - p
        
        for i in range(num_steps - 1):
            point = path[i]
            g = self.metric_tensor(point)
            # Length element: ds² = g_ij dx^i dx^j
            ds = np.sqrt(velocity @ g @ velocity) / num_steps
            total += ds
        
        return total
    
    def exponential_map(self, point: np.ndarray, tangent: np.ndarray) -> np.ndarray:
        """
        Exponential map: exp_p(v) = endpoint of geodesic starting at p with velocity v.
        
        For flat space, this is just p + v.
        For curved space, the geodesic curves.
        
        We use a first-order approximation here.
        """
        # First-order: just move along tangent
        # TODO: implement geodesic shooting for accuracy
        return point + tangent
    
    def logarithmic_map(self, p: np.ndarray, q: np.ndarray) -> np.ndarray:
        """
        Logarithmic map: log_p(q) = initial velocity of geodesic from p to q.
        
        Inverse of exponential map.
        """
        # First-order approximation
        return q - p
    
    def parallel_transport(
        self,
        vector: np.ndarray,
        path: List[np.ndarray]
    ) -> np.ndarray:
        """
        Parallel transport a vector along a path.
        
        In curved space, vectors change when transported!
        This is crucial for comparing styles at different meanings.
        """
        result = vector.copy()
        
        for i in range(len(path) - 1):
            # Simplified: use connection coefficients
            # Full implementation would use Christoffel symbols
            p1, p2 = path[i], path[i + 1]
            
            # Estimate curvature effect
            g1 = self.metric_tensor(p1)
            g2 = self.metric_tensor(p2)
            
            # Adjust vector for metric change
            scale = np.sqrt(np.diag(g1) / np.diag(g2))
            result = result * scale
        
        return result
    
    def sectional_curvature(self, point: np.ndarray, plane: Tuple[int, int]) -> float:
        """
        Sectional curvature at a point in a 2D plane.
        
        Positive curvature: sphere-like (geodesics converge)
        Negative curvature: saddle-like (geodesics diverge)
        Zero curvature: flat (Euclidean)
        
        For translation: negative curvature means multiple valid paths.
        """
        i, j = plane
        eps = 0.01
        
        # Numerical approximation using metric variation
        g_center = self.metric_tensor(point)
        
        perturbations = []
        for di, dj in [(eps, 0), (-eps, 0), (0, eps), (0, -eps)]:
            p = point.copy()
            p[i] += di
            p[j] += dj
            perturbations.append(self.metric_tensor(p))
        
        # Curvature from second derivatives of metric
        # Simplified scalar curvature approximation
        laplacian = sum(np.trace(g - g_center) for g in perturbations) / (4 * eps**2)
        
        return float(laplacian)


# =============================================================================
# LIE GROUP FOR STYLE TRANSFORMATIONS
# =============================================================================

class StyleLieGroup:
    """
    Lie group structure on translation style space.
    
    Key insight: Style transformations form a GROUP:
        - Composition: Apply Pope's style, then modernize = new style
        - Inverse: "Undo" a style transformation
        - Identity: Neutral/transparent style
    
    We model this as a matrix Lie group acting on style vectors:
        σ_new = g · σ_old
        
    Where g ∈ G ⊂ GL(20) is a group element.
    
    The Lie algebra 𝔤 consists of infinitesimal transformations:
        g(t) = exp(t · X) for X ∈ 𝔤
        
    This allows smooth interpolation between styles via:
        g(t) = exp(t · log(g))
    """
    
    def __init__(self, dim: int = 20):
        self.dim = dim
        
        # Generators of the Lie algebra (basis elements)
        # Each generator corresponds to a "direction" in style space
        self.generators = self._init_generators()
    
    def _init_generators(self) -> List[np.ndarray]:
        """
        Initialize Lie algebra generators.
        
        We use a basis that corresponds to meaningful style operations:
        - Formality shift
        - Archaism shift
        - etc.
        
        Plus "interaction" generators for coupled changes.
        """
        generators = []
        
        # Diagonal generators (single dimension shifts)
        for i in range(self.dim):
            X = np.zeros((self.dim, self.dim))
            X[i, i] = 1.0
            generators.append(X)
        
        # Off-diagonal generators (dimension interactions)
        # e.g., increasing formality often increases archaism
        interactions = [
            (0, 1, 0.5),   # formality-archaism coupling
            (2, 3, 0.3),   # sentence length-complexity coupling
            (6, 7, 0.4),   # figurative-rhythmic coupling
            (8, 9, -0.3),  # fidelity-addition inverse coupling
        ]
        
        for i, j, strength in interactions:
            X = np.zeros((self.dim, self.dim))
            X[i, j] = strength
            X[j, i] = strength
            generators.append(X)
        
        return generators
    
    def exp(self, algebra_element: np.ndarray) -> np.ndarray:
        """
        Exponential map: 𝔤 → G
        
        Maps Lie algebra element to group element.
        """
        return expm(algebra_element)
    
    def log(self, group_element: np.ndarray) -> np.ndarray:
        """
        Logarithmic map: G → 𝔤
        
        Maps group element to Lie algebra element.
        """
        return logm(group_element)
    
    def compose(self, g1: np.ndarray, g2: np.ndarray) -> np.ndarray:
        """Group multiplication."""
        return g1 @ g2
    
    def inverse(self, g: np.ndarray) -> np.ndarray:
        """Group inverse."""
        return np.linalg.inv(g)
    
    def identity(self) -> np.ndarray:
        """Identity element."""
        return np.eye(self.dim)
    
    def act(self, g: np.ndarray, style: np.ndarray) -> np.ndarray:
        """
        Group action on style vector.
        
        σ_new = g · σ
        """
        result = g @ style
        # Clamp to valid range [0, 1]
        return np.clip(result, 0, 1)
    
    def geodesic(
        self,
        g1: np.ndarray,
        g2: np.ndarray,
        t: float
    ) -> np.ndarray:
        """
        Geodesic interpolation between group elements.
        
        g(t) = g1 · exp(t · log(g1⁻¹ · g2))
        
        This is the "natural" path on the Lie group.
        """
        g1_inv = self.inverse(g1)
        diff = self.log(g1_inv @ g2)
        return g1 @ self.exp(t * diff)
    
    def style_to_group(self, source: np.ndarray, target: np.ndarray) -> np.ndarray:
        """
        Find group element that transforms source style to target.
        
        Solves: g · source ≈ target
        """
        # Simple: diagonal scaling
        # More sophisticated: find optimal g via optimization
        
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            scale = np.where(source > 0.01, target / source, 1.0)
        
        return np.diag(np.clip(scale, 0.1, 10.0))
    
    def interpolate_styles(
        self,
        style1: np.ndarray,
        style2: np.ndarray,
        t: float
    ) -> np.ndarray:
        """
        Geodesic interpolation between two styles.
        
        This respects the group structure, giving a more natural
        interpolation than linear blending.
        """
        # Find transformation from neutral to each style
        neutral = np.full(self.dim, 0.5)
        
        g1 = self.style_to_group(neutral, style1)
        g2 = self.style_to_group(neutral, style2)
        
        # Geodesic interpolation of group elements
        g_interp = self.geodesic(g1, g2, t)
        
        # Apply to neutral style
        return self.act(g_interp, neutral)
    
    def commutator(self, X: np.ndarray, Y: np.ndarray) -> np.ndarray:
        """
        Lie bracket: [X, Y] = XY - YX
        
        Measures how much X and Y "fail to commute".
        Non-zero commutator means order of style operations matters!
        """
        return X @ Y - Y @ X
    
    def adjoint(self, g: np.ndarray, X: np.ndarray) -> np.ndarray:
        """
        Adjoint representation: Ad_g(X) = g X g⁻¹
        
        How the group acts on its own Lie algebra.
        """
        return g @ X @ self.inverse(g)


# =============================================================================
# FIBER BUNDLE FOR TRANSLATION
# =============================================================================

@dataclass
class TranslationBundle:
    """
    Fiber bundle structure for translation.
    
    Mathematical structure:
        E → M (total space over meaning manifold)
        
    Where:
        - M is the meaning manifold (base space)
        - Σ is the style space (fiber)
        - E = M × Σ locally (total space)
        - π: E → M is projection to meaning
    
    A translation is a SECTION of this bundle:
        s: M → E such that π ∘ s = id_M
        
    In other words, for each meaning m ∈ M, we choose a style σ ∈ Σ.
    Different translators = different sections of the same bundle.
    """
    
    meaning_dim: int = 768
    style_dim: int = 20
    
    def __post_init__(self):
        self.meaning_manifold = MeaningManifold(self.meaning_dim)
        self.style_group = StyleLieGroup(self.style_dim)
    
    def section(
        self,
        meaning: np.ndarray,
        translator_style: np.ndarray
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Evaluate a section (translator) at a meaning point.
        
        Returns (meaning, style) pair in total space.
        """
        return (meaning, translator_style)
    
    def project(self, total_point: Tuple[np.ndarray, np.ndarray]) -> np.ndarray:
        """
        Projection π: E → M
        
        Forgets the style, keeps only meaning.
        """
        return total_point[0]
    
    def fiber_at(self, meaning: np.ndarray) -> 'StyleLieGroup':
        """
        Get the fiber (style space) at a meaning point.
        
        The fiber is a copy of the style group at each point.
        """
        return self.style_group
    
    def connection(
        self,
        meaning: np.ndarray,
        tangent: np.ndarray
    ) -> np.ndarray:
        """
        Connection form: relates fibers at nearby points.
        
        This tells us how to "transport" a style choice
        as we move along the meaning manifold.
        
        A good translation maintains consistent style = parallel section.
        """
        # Simplified: return identity (flat connection)
        # Full implementation would learn connection from data
        return np.eye(self.style_dim)
    
    def parallel_section(
        self,
        path: List[np.ndarray],
        initial_style: np.ndarray
    ) -> List[Tuple[np.ndarray, np.ndarray]]:
        """
        Parallel transport a style along a meaning path.
        
        Returns a section (meaning, style) at each point.
        
        This represents maintaining consistent style across a translation.
        """
        section = [(path[0], initial_style)]
        style = initial_style.copy()
        
        for i in range(1, len(path)):
            tangent = path[i] - path[i-1]
            
            # Get connection at this point
            A = self.connection(path[i-1], tangent)
            
            # Transport style: dσ/dt = -A · σ
            # Simplified: σ_new = A · σ_old
            style = A @ style
            style = np.clip(style, 0, 1)
            
            section.append((path[i], style))
        
        return section
    
    def curvature_2form(
        self,
        meaning: np.ndarray,
        v1: np.ndarray,
        v2: np.ndarray
    ) -> np.ndarray:
        """
        Curvature 2-form: F(v1, v2)
        
        Measures how much parallel transport around a loop
        fails to return to the starting point.
        
        Non-zero curvature = style drift over long translations.
        """
        eps = 0.01
        
        # Transport around small parallelogram
        A1 = self.connection(meaning, eps * v1)
        A2 = self.connection(meaning + eps * v1, eps * v2)
        A3 = self.connection(meaning + eps * v1 + eps * v2, -eps * v1)
        A4 = self.connection(meaning + eps * v2, -eps * v2)
        
        # Holonomy = composition around loop
        holonomy = A1 @ A2 @ A3 @ A4
        
        # Curvature = deviation from identity
        return (holonomy - np.eye(self.style_dim)) / eps**2


# =============================================================================
# GEODESIC STYLE INTERPOLATION
# =============================================================================

class GeodesicInterpolator:
    """
    Geodesic interpolation between translator styles.
    
    Unlike linear interpolation (α·σ₁ + (1-α)·σ₂), geodesic
    interpolation follows the natural geometry of style space.
    
    Benefits:
        - Preserves style "constraints" (e.g., high formality → high archaism)
        - Smoother transitions
        - Mathematically principled
    
    Methods:
        1. Lie group geodesic (for group structure)
        2. Riemannian geodesic (for metric structure)
        3. Bézier geodesic (for smooth curves through multiple points)
    """
    
    def __init__(self):
        self.group = StyleLieGroup(20)
    
    def linear(
        self,
        style1: np.ndarray,
        style2: np.ndarray,
        t: float
    ) -> np.ndarray:
        """Simple linear interpolation (baseline)."""
        return (1 - t) * style1 + t * style2
    
    def lie_geodesic(
        self,
        style1: np.ndarray,
        style2: np.ndarray,
        t: float
    ) -> np.ndarray:
        """
        Geodesic on Lie group.
        
        Treats styles as group elements and interpolates via exp/log.
        """
        return self.group.interpolate_styles(style1, style2, t)
    
    def spherical(
        self,
        style1: np.ndarray,
        style2: np.ndarray,
        t: float
    ) -> np.ndarray:
        """
        Spherical linear interpolation (slerp).
        
        Treats style vectors as points on a hypersphere.
        """
        # Normalize to unit sphere
        s1_norm = style1 / (np.linalg.norm(style1) + 1e-8)
        s2_norm = style2 / (np.linalg.norm(style2) + 1e-8)
        
        # Angle between vectors
        dot = np.clip(np.dot(s1_norm, s2_norm), -1, 1)
        theta = np.arccos(dot)
        
        if theta < 1e-6:
            return style1
        
        # Slerp formula
        result = (
            np.sin((1 - t) * theta) / np.sin(theta) * s1_norm +
            np.sin(t * theta) / np.sin(theta) * s2_norm
        )
        
        # Rescale to original magnitude
        mag = (1 - t) * np.linalg.norm(style1) + t * np.linalg.norm(style2)
        return result * mag
    
    def bezier_geodesic(
        self,
        control_points: List[np.ndarray],
        t: float
    ) -> np.ndarray:
        """
        De Casteljau's algorithm with geodesic interpolation.
        
        Allows smooth curves through multiple translator styles.
        """
        points = [p.copy() for p in control_points]
        
        while len(points) > 1:
            new_points = []
            for i in range(len(points) - 1):
                # Use geodesic interpolation at each level
                new_points.append(self.lie_geodesic(points[i], points[i+1], t))
            points = new_points
        
        return points[0]
    
    def geodesic_path(
        self,
        style1: np.ndarray,
        style2: np.ndarray,
        num_points: int = 10
    ) -> List[np.ndarray]:
        """Generate a full geodesic path between two styles."""
        t_values = np.linspace(0, 1, num_points)
        return [self.lie_geodesic(style1, style2, t) for t in t_values]
    
    def arc_length(
        self,
        style1: np.ndarray,
        style2: np.ndarray,
        method: str = 'lie'
    ) -> float:
        """
        Compute arc length of geodesic between styles.
        
        This is the "true" distance respecting the geometry.
        """
        path = self.geodesic_path(style1, style2, num_points=50)
        
        total = 0.0
        for i in range(len(path) - 1):
            total += np.linalg.norm(path[i+1] - path[i])
        
        return total


# =============================================================================
# STYLE SPACE VISUALIZATION
# =============================================================================

class StyleSpaceProjection:
    """
    Project high-dimensional style space to 2D/3D for visualization.
    
    Methods:
        - PCA: Linear projection preserving variance
        - t-SNE: Non-linear preserving local structure
        - UMAP: Non-linear preserving global + local structure
        - MDS: Preserving pairwise distances
    """
    
    def __init__(self, styles: List[np.ndarray], names: List[str]):
        self.styles = np.array(styles)
        self.names = names
    
    def pca(self, n_components: int = 2) -> np.ndarray:
        """Principal Component Analysis projection."""
        centered = self.styles - np.mean(self.styles, axis=0)
        
        # SVD for PCA
        U, S, Vt = np.linalg.svd(centered, full_matrices=False)
        
        # Project onto top components
        return centered @ Vt[:n_components].T
    
    def mds(self, n_components: int = 2) -> np.ndarray:
        """Multidimensional Scaling using pairwise distances."""
        # Compute distance matrix
        D = squareform(pdist(self.styles))
        
        # Classical MDS
        n = len(self.styles)
        H = np.eye(n) - np.ones((n, n)) / n  # Centering matrix
        B = -0.5 * H @ (D ** 2) @ H  # Double-centered distance matrix
        
        # Eigendecomposition
        eigenvalues, eigenvectors = np.linalg.eigh(B)
        
        # Sort by eigenvalue (descending)
        idx = np.argsort(eigenvalues)[::-1]
        eigenvalues = eigenvalues[idx]
        eigenvectors = eigenvectors[:, idx]
        
        # Project
        coords = eigenvectors[:, :n_components] * np.sqrt(np.abs(eigenvalues[:n_components]))
        
        return coords
    
    def to_visualization_data(self, method: str = 'pca') -> Dict:
        """
        Export for D3.js / Three.js visualization.
        
        Returns JSON-serializable dict with:
            - points: [{x, y, name, style}, ...]
            - edges: [{source, target, distance}, ...]
        """
        if method == 'pca':
            coords = self.pca(2)
        else:
            coords = self.mds(2)
        
        # Normalize to [0, 1]
        coords_min = coords.min(axis=0)
        coords_max = coords.max(axis=0)
        coords_norm = (coords - coords_min) / (coords_max - coords_min + 1e-8)
        
        points = []
        for i, (name, coord) in enumerate(zip(self.names, coords_norm)):
            points.append({
                'id': i,
                'name': name,
                'x': float(coord[0]),
                'y': float(coord[1]),
                'style': self.styles[i].tolist()
            })
        
        # Compute edges (nearest neighbors)
        edges = []
        D = squareform(pdist(self.styles))
        for i in range(len(self.styles)):
            # Find 3 nearest neighbors
            nearest = np.argsort(D[i])[1:4]  # Skip self
            for j in nearest:
                if i < j:  # Avoid duplicates
                    edges.append({
                        'source': i,
                        'target': int(j),
                        'distance': float(D[i, j])
                    })
        
        return {
            'points': points,
            'edges': edges,
            'method': method
        }


# =============================================================================
# SEMANTIC CURVATURE ANALYSIS
# =============================================================================

class SemanticCurvatureAnalyzer:
    """
    Analyze semantic curvature to identify translation difficulty.
    
    High positive curvature: Constrained meaning, one clear translation
    Flat (zero curvature): Standard translation, multiple valid options
    Negative curvature: Ambiguous meaning, many divergent interpretations
    
    Applications:
        - Identify passages needing interpretive notes
        - Explain why translations diverge
        - Predict translation difficulty
    """
    
    def __init__(self, manifold: MeaningManifold):
        self.manifold = manifold
    
    def local_curvature(
        self,
        embedding: np.ndarray,
        neighborhood: List[np.ndarray]
    ) -> float:
        """
        Estimate curvature from local embedding neighborhood.
        
        Uses the eigenvalue spread of the local covariance matrix.
        """
        if len(neighborhood) < 3:
            return 0.0
        
        # Center on the point
        centered = np.array(neighborhood) - embedding
        
        # Local covariance
        cov = np.cov(centered.T)
        
        # Eigenvalues
        eigenvalues = np.linalg.eigvalsh(cov)
        eigenvalues = np.sort(eigenvalues)[::-1]
        
        # Curvature from eigenvalue ratio
        # High ratio = locally flat
        # Low ratio = curved (all directions similar)
        if eigenvalues[-1] > 1e-8:
            ratio = eigenvalues[0] / eigenvalues[-1]
            curvature = 1.0 / (1.0 + np.log(ratio))
        else:
            curvature = 1.0
        
        return float(curvature)
    
    def translation_difficulty(
        self,
        source_embedding: np.ndarray,
        translations: List[np.ndarray]
    ) -> Dict:
        """
        Assess translation difficulty from divergence of translations.
        
        If multiple translations of the same source have divergent
        embeddings, the passage has high semantic curvature (ambiguity).
        """
        if len(translations) < 2:
            return {'difficulty': 'unknown', 'score': 0.5}
        
        # Compute pairwise distances
        distances = pdist(np.array(translations))
        
        mean_dist = np.mean(distances)
        std_dist = np.std(distances)
        
        # Categorize difficulty
        if mean_dist < 0.1:
            difficulty = 'easy'
            score = 0.2
        elif mean_dist < 0.3:
            difficulty = 'moderate'
            score = 0.5
        else:
            difficulty = 'hard'
            score = 0.8
        
        return {
            'difficulty': difficulty,
            'score': score,
            'mean_divergence': float(mean_dist),
            'std_divergence': float(std_dist),
            'interpretation': self._interpret_difficulty(difficulty)
        }
    
    def _interpret_difficulty(self, difficulty: str) -> str:
        interpretations = {
            'easy': "Translators agree on meaning; straightforward passage",
            'moderate': "Some interpretive variation; multiple valid readings",
            'hard': "High semantic ambiguity; translators diverge significantly"
        }
        return interpretations.get(difficulty, "")


# =============================================================================
# EXPORTS
# =============================================================================

__all__ = [
    'MeaningManifold',
    'StyleLieGroup', 
    'TranslationBundle',
    'GeodesicInterpolator',
    'StyleSpaceProjection',
    'SemanticCurvatureAnalyzer'
]


if __name__ == "__main__":
    print("LOGOS Advanced Mathematical Framework")
    print("=" * 50)
    
    # Test Lie group interpolation
    group = StyleLieGroup(20)
    
    # Pope and Wilson styles (simplified)
    pope = np.array([0.9, 0.85, 0.75, 0.8, 0.55, 0.25, 0.7, 0.95, 0.45, 0.8,
                     0.6, 0.85, 0.75, 0.5, 0.35, 0.7, 0.2, 0.65, 0.4, 0.9])
    wilson = np.array([0.4, 0.15, 0.35, 0.35, 0.25, 0.85, 0.65, 0.4, 0.75, 0.2,
                       0.25, 0.65, 0.45, 0.25, 0.7, 0.5, 0.5, 0.35, 0.6, 0.15])
    
    interpolator = GeodesicInterpolator()
    
    print("\nGeodesic interpolation Pope → Wilson:")
    for t in [0.0, 0.25, 0.5, 0.75, 1.0]:
        interp = interpolator.lie_geodesic(pope, wilson, t)
        print(f"  t={t:.2f}: formality={interp[0]:.2f}, archaism={interp[1]:.2f}")
    
    print("\nLinear vs Geodesic at t=0.5:")
    linear_mid = interpolator.linear(pope, wilson, 0.5)
    geo_mid = interpolator.lie_geodesic(pope, wilson, 0.5)
    print(f"  Linear:   formality={linear_mid[0]:.3f}")
    print(f"  Geodesic: formality={geo_mid[0]:.3f}")
    
    # Test visualization export
    styles = [pope, wilson, (pope + wilson) / 2]
    names = ["Pope", "Wilson", "Midpoint"]
    
    projector = StyleSpaceProjection(styles, names)
    viz_data = projector.to_visualization_data('pca')
    
    print(f"\nVisualization data: {len(viz_data['points'])} points, {len(viz_data['edges'])} edges")
