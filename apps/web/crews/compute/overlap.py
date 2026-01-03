"""
DETERMINISTIC OVERLAP CALCULATION
No LLM - pure code, reproducible, free
"""

from typing import Dict, List, Set, Tuple
from collections import Counter
import re


def tokenize(text: str) -> List[str]:
    """Simple tokenization"""
    return re.findall(r'\b\w+\b', text.lower())


def get_ngrams(tokens: List[str], n: int) -> Set[Tuple[str, ...]]:
    """Extract n-grams from token list"""
    if len(tokens) < n:
        return set()
    return set(tuple(tokens[i:i+n]) for i in range(len(tokens) - n + 1))


def compute_overlap(text_a: str, text_b: str) -> Dict[str, float]:
    """
    Compute all overlap metrics between two texts.
    DETERMINISTIC - no LLM, reproducible, free.
    """
    tokens_a = tokenize(text_a)
    tokens_b = tokenize(text_b)

    # Word overlap (Jaccard)
    set_a = set(tokens_a)
    set_b = set(tokens_b)
    intersection = set_a & set_b
    union = set_a | set_b
    word_overlap = len(intersection) / len(union) if union else 0

    # Bigram overlap
    bigrams_a = get_ngrams(tokens_a, 2)
    bigrams_b = get_ngrams(tokens_b, 2)
    bigram_intersection = bigrams_a & bigrams_b
    bigram_union = bigrams_a | bigrams_b
    bigram_overlap = len(bigram_intersection) / len(bigram_union) if bigram_union else 0

    # Trigram overlap
    trigrams_a = get_ngrams(tokens_a, 3)
    trigrams_b = get_ngrams(tokens_b, 3)
    trigram_intersection = trigrams_a & trigrams_b
    trigram_union = trigrams_a | trigrams_b
    trigram_overlap = len(trigram_intersection) / len(trigram_union) if trigram_union else 0

    # Matched phrases (3+ word sequences)
    matched_phrases = [' '.join(t) for t in trigram_intersection]

    return {
        "word_overlap": round(word_overlap, 4),
        "bigram_overlap": round(bigram_overlap, 4),
        "trigram_overlap": round(trigram_overlap, 4),
        "shared_words": list(intersection),
        "matched_phrases": matched_phrases[:20],  # Top 20
        "unique_a": len(set_a - set_b),
        "unique_b": len(set_b - set_a),
    }
