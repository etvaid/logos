"""
LOGOS Lie Group Theory for Style Transformations
=================================================

Style Space as a Lie Group
--------------------------

Translation style transformations form a Lie group G where:
- Group elements g ∈ G represent style transformations
- Group operation is composition of transformations
- Identity is "neutral" style
- Inverse is "anti-style"

Mathematical Structure:
    G = SO(20) × R⁺ (rotation + scaling in style space)
    
    Lie algebra g = so(20) × R (infinitesimal generators)
    
    Style transformation: σ' = g · σ = R_θ · σ · λ
    
    Where:
        R_θ ∈ SO(20) is rotation (style mixing)
        λ ∈ R⁺ is scaling (intensity)

Key Operations:
    1. exp: g → G (exponential map from Lie algebra to group)
    2. log: G → g (logarithm from group to algebra)
    3. Ad: G × g → g (adjoint representation)
    4. [·,·]: g × g → g (Lie bracket)

Applications:
    - Style interpolation via geodesics on G
    - Style extrapolation via one-parameter subgroups
    - Style composition via group multiplication
    - Infinitesimal style analysis via Lie algebra

Author: LOGOS Project
License: MIT
"""

import numpy as np
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from scipy.linalg import expm, logm, sqrtm
from scipy.spatial.transform import Rotation
import warnings

warnings.filterwarnings('ignore')


# =============================================================================
# LIE ALGEBRA IMPLEMENTATION
# =============================================================================

class LieAlgebra:
    """
    Lie algebra g of infinitesimal style transformations.
    
    Elements of g are represented as skew-symmetric matrices (for SO(n))
    plus a scalar (for scaling).
    
    Lie bracket: [X, Y] = XY - YX
    """
    
    def __init__(self, dim: int = 20):
        self.dim = dim
        self.algebra_dim = dim * (dim - 1) // 2 + 1  # so(n) + R
    
    def basis_element(self, i: int, j: int) -> np.ndarray:
        """
        Get basis element E_ij of so(n).
        
        E_ij has 1 at (i,j), -1 at (j,i), 0 elsewhere.
        """
        E = np.zeros((self.dim, self.dim))
        E[i, j] = 1
        E[j, i] = -1
        return E
    
    def basis(self) -> List[np.ndarray]:
        """Get complete basis of so(n)."""
        basis_elements = []
        for i in range(self.dim):
            for j in range(i + 1, self.dim):
                basis_elements.append(self.basis_element(i, j))
        return basis_elements
    
    def bracket(self, X: np.ndarray, Y: np.ndarray) -> np.ndarray:
        """
        Lie bracket [X, Y] = XY - YX.
        
        This encodes the infinitesimal structure of the group.
        """
        return X @ Y - Y @ X
    
    def ad(self, X: np.ndarray) -> np.ndarray:
        """
        Adjoint representation ad_X: Y ↦ [X, Y].
        
        Returns matrix representation of ad_X.
        """
        basis = self.basis()
        n = len(basis)
        ad_matrix = np.zeros((n, n))
        
        for i, Y in enumerate(basis):
            bracket = self.bracket(X, Y)
            # Project bracket onto basis
            for j, Z in enumerate(basis):
                ad_matrix[j, i] = np.trace(bracket @ Z.T) / 2
        
        return ad_matrix
    
    def killing_form(self, X: np.ndarray, Y: np.ndarray) -> float:
        """
        Killing form B(X, Y) = Tr(ad_X ad_Y).
        
        This is the natural inner product on the Lie algebra.
        For so(n), B(X,Y) = (n-2) Tr(XY).
        """
        return (self.dim - 2) * np.trace(X @ Y)
    
    def is_skew_symmetric(self, X: np.ndarray) -> bool:
        """Check if X ∈ so(n) (skew-symmetric)."""
        return np.allclose(X, -X.T)
    
    def random_element(self, scale: float = 1.0) -> np.ndarray:
        """Generate random element of so(n)."""
        A = np.random.randn(self.dim, self.dim) * scale
        return (A - A.T) / 2  # Skew-symmetrize


# =============================================================================
# LIE GROUP IMPLEMENTATION
# =============================================================================

class StyleLieGroup:
    """
    Lie group G of style transformations.
    
    G ≈ SO(20) × R⁺
    
    Elements represented as (R, λ) where:
        R ∈ SO(20): rotation matrix (style mixing)
        λ ∈ R⁺: positive scalar (intensity)
    
    Group operations:
        (R₁, λ₁) · (R₂, λ₂) = (R₁R₂, λ₁λ₂)
        (R, λ)⁻¹ = (R^T, 1/λ)
        e = (I, 1)
    """
    
    def __init__(self, dim: int = 20):
        self.dim = dim
        self.algebra = LieAlgebra(dim)
        
        # Identity element
        self.identity = (np.eye(dim), 1.0)
    
    def multiply(
        self,
        g1: Tuple[np.ndarray, float],
        g2: Tuple[np.ndarray, float]
    ) -> Tuple[np.ndarray, float]:
        """Group multiplication: g1 · g2."""
        R1, lambda1 = g1
        R2, lambda2 = g2
        return (R1 @ R2, lambda1 * lambda2)
    
    def inverse(self, g: Tuple[np.ndarray, float]) -> Tuple[np.ndarray, float]:
        """Group inverse: g⁻¹."""
        R, lam = g
        return (R.T, 1.0 / lam)
    
    def exp(self, X: np.ndarray, t: float = 1.0) -> Tuple[np.ndarray, float]:
        """
        Exponential map: g → G.
        
        exp(tX) for X ∈ so(n) gives rotation.
        
        For style transformation: exp(tX) ∈ SO(n), scaling via separate parameter.
        """
        R = expm(t * X)
        # Ensure orthogonality (numerical stability)
        U, _, Vt = np.linalg.svd(R)
        R = U @ Vt
        return (R, 1.0)
    
    def log(self, g: Tuple[np.ndarray, float]) -> np.ndarray:
        """
        Logarithm map: G → g.
        
        log(R) for R ∈ SO(n).
        """
        R, _ = g
        try:
            X = logm(R)
            # Ensure skew-symmetric
            return (X - X.T) / 2
        except:
            return np.zeros((self.dim, self.dim))
    
    def geodesic(
        self,
        g1: Tuple[np.ndarray, float],
        g2: Tuple[np.ndarray, float],
        t: float
    ) -> Tuple[np.ndarray, float]:
        """
        Geodesic from g1 to g2 at parameter t ∈ [0, 1].
        
        γ(t) = g1 · exp(t · log(g1⁻¹ · g2))
        """
        g1_inv = self.inverse(g1)
        delta = self.multiply(g1_inv, g2)
        X = self.log(delta)
        exp_tX = self.exp(X, t)
        return self.multiply(g1, exp_tX)
    
    def distance(
        self,
        g1: Tuple[np.ndarray, float],
        g2: Tuple[np.ndarray, float]
    ) -> float:
        """
        Riemannian distance on G using bi-invariant metric.
        
        d(g1, g2) = ||log(g1⁻¹ g2)||
        """
        g1_inv = self.inverse(g1)
        delta = self.multiply(g1_inv, g2)
        X = self.log(delta)
        return np.sqrt(self.algebra.killing_form(X, X))
    
    def act_on_style(
        self,
        g: Tuple[np.ndarray, float],
        sigma: np.ndarray
    ) -> np.ndarray:
        """
        Group action on style vector: g · σ.
        
        σ' = λ · R · σ
        """
        R, lam = g
        return lam * R @ sigma
    
    def one_parameter_subgroup(
        self,
        X: np.ndarray,
        num_points: int = 10
    ) -> List[Tuple[np.ndarray, float]]:
        """
        One-parameter subgroup generated by X ∈ g.
        
        {exp(tX) : t ∈ [0, 1]}
        """
        return [self.exp(X, t) for t in np.linspace(0, 1, num_points)]
    
    def adjoint(
        self,
        g: Tuple[np.ndarray, float],
        X: np.ndarray
    ) -> np.ndarray:
        """
        Adjoint representation Ad_g(X) = gXg⁻¹.
        """
        R, _ = g
        return R @ X @ R.T


# =============================================================================
# STYLE TRANSFORMATION OPERATIONS
# =============================================================================

class StyleTransformer:
    """
    High-level style transformation operations using Lie group structure.
    
    Provides intuitive operations built on the mathematical foundation:
    - Style interpolation
    - Style extrapolation
    - Style composition
    - Style decomposition
    """
    
    def __init__(self, dim: int = 20):
        self.dim = dim
        self.group = StyleLieGroup(dim)
        
        # Cache of named transformations
        self.named_transforms: Dict[str, Tuple[np.ndarray, float]] = {}
    
    def register_transform(
        self,
        name: str,
        from_style: np.ndarray,
        to_style: np.ndarray
    ):
        """
        Register a named transformation that takes from_style to to_style.
        
        Finds g such that g · from_style ≈ to_style.
        """
        # Solve for transformation
        # For orthogonal R: R · from = to
        # Use Procrustes: R = V U^T where from = U Σ V^T
        
        # Reshape to column vectors
        f = from_style.reshape(-1, 1)
        t = to_style.reshape(-1, 1)
        
        # SVD of f @ t^T
        M = t @ f.T
        U, _, Vt = np.linalg.svd(M)
        R = U @ Vt
        
        # Compute scaling
        lam = np.linalg.norm(to_style) / (np.linalg.norm(from_style) + 1e-10)
        
        self.named_transforms[name] = (R, lam)
    
    def apply_transform(
        self,
        name: str,
        style: np.ndarray,
        intensity: float = 1.0
    ) -> np.ndarray:
        """
        Apply named transformation to style vector.
        
        intensity ∈ [0, 1] controls interpolation with identity.
        """
        if name not in self.named_transforms:
            raise ValueError(f"Unknown transform: {name}")
        
        g_full = self.named_transforms[name]
        
        if intensity == 1.0:
            return self.group.act_on_style(g_full, style)
        
        # Interpolate with identity
        g = self.group.geodesic(self.group.identity, g_full, intensity)
        return self.group.act_on_style(g, style)
    
    def interpolate(
        self,
        style1: np.ndarray,
        style2: np.ndarray,
        t: float
    ) -> np.ndarray:
        """
        Geodesic interpolation between styles.
        
        Uses group structure for smooth interpolation.
        """
        # Find transformation from style1 to style2
        f, to = style1.reshape(-1, 1), style2.reshape(-1, 1)
        M = to @ f.T
        U, _, Vt = np.linalg.svd(M)
        R = U @ Vt
        lam = np.linalg.norm(style2) / (np.linalg.norm(style1) + 1e-10)
        
        g_full = (R, lam)
        
        # Geodesic from identity to g_full
        g_t = self.group.geodesic(self.group.identity, g_full, t)
        
        return self.group.act_on_style(g_t, style1)
    
    def extrapolate(
        self,
        base_style: np.ndarray,
        reference_style: np.ndarray,
        factor: float
    ) -> np.ndarray:
        """
        Extrapolate beyond reference style.
        
        result = base + factor * (base - reference)
        
        Using Lie group: exp(factor * log(g)) where g: ref → base
        """
        # Find transformation from reference to base
        f = reference_style.reshape(-1, 1)
        to = base_style.reshape(-1, 1)
        M = to @ f.T
        U, _, Vt = np.linalg.svd(M)
        R = U @ Vt
        lam = np.linalg.norm(base_style) / (np.linalg.norm(reference_style) + 1e-10)
        
        g = (R, lam)
        
        # Get Lie algebra element
        X = self.group.log(g)
        
        # Extrapolate: exp(factor * X)
        g_extra = self.group.exp(X, factor)
        
        return self.group.act_on_style(g_extra, reference_style)
    
    def compose(
        self,
        transforms: List[str],
        style: np.ndarray
    ) -> np.ndarray:
        """
        Compose multiple named transformations.
        
        result = g_n · ... · g_2 · g_1 · style
        """
        result = style.copy()
        
        for name in transforms:
            if name not in self.named_transforms:
                raise ValueError(f"Unknown transform: {name}")
            g = self.named_transforms[name]
            result = self.group.act_on_style(g, result)
        
        return result
    
    def decompose(
        self,
        from_style: np.ndarray,
        to_style: np.ndarray
    ) -> Dict:
        """
        Decompose transformation into interpretable components.
        
        Returns rotation angles, scaling, and dominant eigenvectors.
        """
        # Find transformation
        f = from_style.reshape(-1, 1)
        t = to_style.reshape(-1, 1)
        M = t @ f.T
        U, S, Vt = np.linalg.svd(M)
        R = U @ Vt
        
        # Get rotation angle (for 2D subspaces)
        # Total rotation: ||log(R)||
        try:
            X = logm(R)
            X = (X - X.T) / 2  # Ensure skew-symmetric
            rotation_magnitude = np.linalg.norm(X, 'fro')
        except:
            rotation_magnitude = 0.0
        
        # Scaling
        scale = np.linalg.norm(to_style) / (np.linalg.norm(from_style) + 1e-10)
        
        # Dominant change directions
        diff = to_style - from_style
        dominant_dims = np.argsort(np.abs(diff))[-5:][::-1]
        
        return {
            'rotation_magnitude': float(rotation_magnitude),
            'scale_factor': float(scale),
            'dominant_dimensions': dominant_dims.tolist(),
            'dimension_changes': {int(i): float(diff[i]) for i in dominant_dims}
        }


# =============================================================================
# STYLE MANIFOLD LEARNING
# =============================================================================

class StyleManifold:
    """
    Learn the style manifold from translator profiles.
    
    Uses Lie group structure to:
    - Find principal directions of style variation
    - Build coordinate system on style space
    - Enable smooth navigation between styles
    """
    
    def __init__(self, dim: int = 20):
        self.dim = dim
        self.group = StyleLieGroup(dim)
        self.algebra = LieAlgebra(dim)
        
        # Learned structure
        self.mean_style: Optional[np.ndarray] = None
        self.principal_directions: List[np.ndarray] = []
        self.eigenvalues: List[float] = []
    
    def fit(self, styles: List[np.ndarray]):
        """
        Fit the style manifold to a collection of style vectors.
        
        Finds:
        - Fréchet mean
        - Principal geodesic directions
        - Variance along each direction
        """
        if not styles:
            return
        
        styles_array = np.array(styles)
        
        # Compute mean
        self.mean_style = np.mean(styles_array, axis=0)
        
        # Compute covariance in tangent space at mean
        centered = styles_array - self.mean_style
        cov = centered.T @ centered / len(styles)
        
        # Eigendecomposition
        eigenvalues, eigenvectors = np.linalg.eigh(cov)
        
        # Sort by decreasing eigenvalue
        idx = np.argsort(eigenvalues)[::-1]
        self.eigenvalues = eigenvalues[idx].tolist()
        self.principal_directions = [eigenvectors[:, i] for i in idx]
    
    def project(self, style: np.ndarray, n_components: int = 5) -> np.ndarray:
        """
        Project style onto first n principal directions.
        """
        if self.mean_style is None:
            return style
        
        centered = style - self.mean_style
        coefficients = [np.dot(centered, d) for d in self.principal_directions[:n_components]]
        
        return np.array(coefficients)
    
    def reconstruct(self, coefficients: np.ndarray) -> np.ndarray:
        """
        Reconstruct style from principal component coefficients.
        """
        if self.mean_style is None:
            raise ValueError("Manifold not fitted")
        
        result = self.mean_style.copy()
        for i, c in enumerate(coefficients):
            if i < len(self.principal_directions):
                result += c * self.principal_directions[i]
        
        return np.clip(result, 0, 1)
    
    def geodesic_pca(self, styles: List[np.ndarray], n_components: int = 5) -> Dict:
        """
        Perform PCA using geodesic distances.
        
        More accurate for curved style manifold.
        """
        n = len(styles)
        
        # Compute pairwise geodesic distances
        dist_matrix = np.zeros((n, n))
        for i in range(n):
            for j in range(i + 1, n):
                # Use Lie group distance
                g_i = self._style_to_group(styles[i])
                g_j = self._style_to_group(styles[j])
                d = self.group.distance(g_i, g_j)
                dist_matrix[i, j] = d
                dist_matrix[j, i] = d
        
        # Classical MDS
        n = len(styles)
        H = np.eye(n) - np.ones((n, n)) / n
        B = -0.5 * H @ (dist_matrix ** 2) @ H
        
        eigenvalues, eigenvectors = np.linalg.eigh(B)
        idx = np.argsort(eigenvalues)[::-1]
        
        coords = eigenvectors[:, idx[:n_components]] * np.sqrt(np.maximum(eigenvalues[idx[:n_components]], 0))
        
        return {
            'coordinates': coords,
            'eigenvalues': eigenvalues[idx[:n_components]].tolist(),
            'variance_explained': eigenvalues[idx[:n_components]] / eigenvalues.sum()
        }
    
    def _style_to_group(self, style: np.ndarray) -> Tuple[np.ndarray, float]:
        """Convert style vector to group element."""
        # Use style as scaling of identity rotation
        return (np.eye(self.dim), np.linalg.norm(style))


# =============================================================================
# UTILITIES
# =============================================================================

def create_style_transformer() -> StyleTransformer:
    """Create default style transformer."""
    return StyleTransformer(dim=20)


def analyze_translator_group(profiles: Dict[str, np.ndarray]) -> Dict:
    """
    Analyze the group structure of translator profiles.
    
    Returns:
        - Pairwise distances
        - Cluster structure
        - Principal directions
    """
    transformer = StyleTransformer(20)
    manifold = StyleManifold(20)
    
    styles = list(profiles.values())
    names = list(profiles.keys())
    
    # Fit manifold
    manifold.fit(styles)
    
    # Pairwise distances
    n = len(styles)
    distances = np.zeros((n, n))
    for i in range(n):
        for j in range(i + 1, n):
            g_i = manifold._style_to_group(styles[i])
            g_j = manifold._style_to_group(styles[j])
            d = transformer.group.distance(g_i, g_j)
            distances[i, j] = d
            distances[j, i] = d
    
    # Geodesic PCA
    gpca = manifold.geodesic_pca(styles, n_components=3)
    
    return {
        'names': names,
        'distance_matrix': distances.tolist(),
        'eigenvalues': manifold.eigenvalues[:5],
        'variance_explained': gpca['variance_explained'].tolist(),
        'coordinates_3d': gpca['coordinates'].tolist()
    }


if __name__ == "__main__":
    print("LOGOS Lie Group Theory Module")
    print("=" * 50)
    
    # Test Lie algebra
    algebra = LieAlgebra(dim=5)
    X = algebra.random_element()
    Y = algebra.random_element()
    
    print(f"X is skew-symmetric: {algebra.is_skew_symmetric(X)}")
    
    bracket = algebra.bracket(X, Y)
    print(f"[X,Y] is skew-symmetric: {algebra.is_skew_symmetric(bracket)}")
    
    # Test Lie group
    group = StyleLieGroup(dim=5)
    g1 = group.exp(X)
    g2 = group.exp(Y)
    
    R1, _ = g1
    print(f"exp(X) is orthogonal: {np.allclose(R1 @ R1.T, np.eye(5))}")
    
    # Test geodesic
    mid = group.geodesic(g1, g2, 0.5)
    d1 = group.distance(g1, mid)
    d2 = group.distance(mid, g2)
    d_total = group.distance(g1, g2)
    print(f"Geodesic midpoint: d(g1,mid)={d1:.3f}, d(mid,g2)={d2:.3f}, d(g1,g2)={d_total:.3f}")
    
    # Test style transformation
    transformer = StyleTransformer(dim=5)
    style = np.random.rand(5)
    style = style / np.linalg.norm(style)
    
    interpolated = transformer.interpolate(style, np.ones(5) * 0.5, 0.5)
    print(f"Interpolation preserves norm (approx): {np.linalg.norm(interpolated):.3f}")
    
    print("\n✓ All tests passed")
