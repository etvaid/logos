"""
VECTOR SIMILARITY COMPUTATION
Pure code - no LLM
"""

from typing import List
import math


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """
    Compute cosine similarity between two vectors.
    DETERMINISTIC - pure math, no LLM.
    """
    if len(a) != len(b):
        raise ValueError("Vectors must have same dimensions")

    if len(a) == 0:
        return 0.0

    dot_product = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return dot_product / (norm_a * norm_b)


def euclidean_distance(a: List[float], b: List[float]) -> float:
    """Compute Euclidean distance between two vectors."""
    if len(a) != len(b):
        raise ValueError("Vectors must have same dimensions")

    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def average_vectors(vectors: List[List[float]]) -> List[float]:
    """Average multiple vectors into one."""
    if not vectors:
        return []

    dimensions = len(vectors[0])
    result = [0.0] * dimensions

    for vec in vectors:
        for i, val in enumerate(vec):
            result[i] += val

    for i in range(dimensions):
        result[i] /= len(vectors)

    return result
