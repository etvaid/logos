"""
DETERMINISTIC COMPUTE MODULE
All computations here are pure code - no LLM.
"""

from crews.compute.overlap import compute_overlap, tokenize, get_ngrams
from crews.compute.frequency import CorpusFrequency
from crews.compute.rare_words import find_rare_shared_words, get_freq_table
from crews.compute.similarity import cosine_similarity, euclidean_distance, average_vectors
from crews.compute.ngrams import (
    extract_ngrams,
    extract_ngrams_with_positions,
    find_shared_ngrams,
    find_longest_common_sequence
)

__all__ = [
    # Overlap
    "compute_overlap",
    "tokenize",
    "get_ngrams",
    # Frequency
    "CorpusFrequency",
    # Rare words
    "find_rare_shared_words",
    "get_freq_table",
    # Similarity
    "cosine_similarity",
    "euclidean_distance",
    "average_vectors",
    # N-grams
    "extract_ngrams",
    "extract_ngrams_with_positions",
    "find_shared_ngrams",
    "find_longest_common_sequence",
]
