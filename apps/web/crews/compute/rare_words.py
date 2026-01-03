"""
RARE WORD DETECTION
Uses precomputed frequency table - no LLM
"""

from typing import Dict, Set
from crews.compute.frequency import CorpusFrequency
from crews.compute.overlap import tokenize

# Global frequency table (loaded once)
_freq_table = None


def get_freq_table() -> CorpusFrequency:
    global _freq_table
    if _freq_table is None:
        _freq_table = CorpusFrequency()
        _freq_table.load()
    return _freq_table


def find_rare_shared_words(text_a: str, text_b: str, threshold: int = 10) -> Dict:
    """
    Find rare words shared between two texts.
    DETERMINISTIC - uses corpus frequency table, no LLM.
    """
    freq = get_freq_table()

    tokens_a = set(tokenize(text_a))
    tokens_b = set(tokenize(text_b))
    shared = tokens_a & tokens_b

    rare_shared = freq.find_rare_shared(shared, threshold)

    # Sort by rarity (IDF)
    rare_shared.sort(key=lambda x: x['idf'], reverse=True)

    # Calculate significance
    total_shared = len(shared)
    rare_count = len(rare_shared)
    significance = rare_count / max(total_shared, 1)

    return {
        "rare_shared_words": rare_shared[:20],
        "rare_count": rare_count,
        "total_shared": total_shared,
        "significance_score": round(significance, 4),
        "most_significant": rare_shared[0] if rare_shared else None
    }
