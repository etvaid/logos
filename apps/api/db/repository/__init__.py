"""
LOGOS Database Repository Layer

Provides clean, type-safe access to database operations.
Replaces JSON file dependencies with direct PostgreSQL queries.
"""

from .base import BaseRepository, get_db_pool
from .translations import TranslationRepository
from .stylometry import StylometryRepository
from .metrics import MetricsRepository

__all__ = [
    'BaseRepository',
    'get_db_pool',
    'TranslationRepository',
    'StylometryRepository',
    'MetricsRepository',
]
