"""
LOGOS Engines Module
====================

Core analytical engines for the LOGOS platform.
"""

from .style_residual import StyleResidualEngine
from .calibration import CalibrationEngine
from .authorship import AuthorshipSegmenter
from .hypothesis_factory import HypothesisFactory
from .latent_factors import LatentFactorEngine
from .q_reconstruction import QReconstructionEngine
from .discovery import DiscoveryEngine

__all__ = [
    "StyleResidualEngine",
    "CalibrationEngine",
    "AuthorshipSegmenter",
    "HypothesisFactory",
    "LatentFactorEngine",
    "QReconstructionEngine",
    "DiscoveryEngine",
]
