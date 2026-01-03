"""
N-GRAM EXTRACTION AND ANALYSIS
Pure code - no LLM
"""

from typing import List, Set, Tuple, Dict
from collections import Counter
from crews.compute.overlap import tokenize


def extract_ngrams(text: str, n: int) -> List[Tuple[str, ...]]:
    """Extract all n-grams from text."""
    tokens = tokenize(text)
    if len(tokens) < n:
        return []
    return [tuple(tokens[i:i+n]) for i in range(len(tokens) - n + 1)]


def extract_ngrams_with_positions(text: str, n: int) -> List[Dict]:
    """Extract n-grams with their positions."""
    tokens = tokenize(text)
    if len(tokens) < n:
        return []

    return [
        {
            "ngram": tuple(tokens[i:i+n]),
            "text": " ".join(tokens[i:i+n]),
            "start_token": i,
            "end_token": i + n - 1
        }
        for i in range(len(tokens) - n + 1)
    ]


def find_shared_ngrams(text_a: str, text_b: str, n: int = 3) -> Dict:
    """
    Find shared n-grams between two texts.
    DETERMINISTIC - pure code.
    """
    ngrams_a = set(extract_ngrams(text_a, n))
    ngrams_b = set(extract_ngrams(text_b, n))

    shared = ngrams_a & ngrams_b

    return {
        "n": n,
        "shared_ngrams": [" ".join(ng) for ng in list(shared)[:50]],
        "shared_count": len(shared),
        "unique_a": len(ngrams_a - ngrams_b),
        "unique_b": len(ngrams_b - ngrams_a),
        "overlap_ratio": len(shared) / len(ngrams_a | ngrams_b) if ngrams_a | ngrams_b else 0
    }


def find_longest_common_sequence(text_a: str, text_b: str, min_length: int = 3) -> List[str]:
    """
    Find longest common token sequences.
    Uses dynamic programming - no LLM.
    """
    tokens_a = tokenize(text_a)
    tokens_b = tokenize(text_b)

    m, n = len(tokens_a), len(tokens_b)
    if m == 0 or n == 0:
        return []

    # DP table for LCS length
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if tokens_a[i-1] == tokens_b[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = 0

    # Find all sequences >= min_length
    sequences = []
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            length = dp[i][j]
            if length >= min_length:
                seq = tokens_a[i-length:i]
                seq_text = " ".join(seq)
                if seq_text not in sequences:
                    sequences.append(seq_text)

    # Sort by length (longest first)
    sequences.sort(key=len, reverse=True)

    return sequences[:20]  # Top 20
