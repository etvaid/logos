"""
LOGOS Translation Evaluation Harness

Deterministic evaluation for translation quality and normalization.
Implements translation gates T1-T4 per the "Approval Scaffold" methodology.
"""

from .translation_gates import TranslationGates, run_translation_gates
from .gold_set import load_gold_set, create_gold_set_sample

__all__ = [
    'TranslationGates',
    'run_translation_gates',
    'load_gold_set',
    'create_gold_set_sample',
]
