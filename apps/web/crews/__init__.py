"""
LOGOS CREWS MODULE
Deterministic-first processing architecture.

Principles:
1. Deterministic code produces ALL measurements
2. LLMs only for narrative and constrained generation
3. On-demand caching, not full precompute
4. Real job queue with proper semantics
"""

from crews.compute import (
    compute_overlap,
    find_rare_shared_words,
    cosine_similarity,
    find_shared_ngrams,
    CorpusFrequency,
)

from crews.pipelines import (
    MorphologyPipeline,
    Token,
    EvidencePipeline,
    EvidenceBundle,
)

from crews.queue import (
    JobQueue,
    Job,
    RateLimiter,
)

from crews.orchestrator import LogosOrchestrator

__all__ = [
    # Compute
    "compute_overlap",
    "find_rare_shared_words",
    "cosine_similarity",
    "find_shared_ngrams",
    "CorpusFrequency",
    # Pipelines
    "MorphologyPipeline",
    "Token",
    "EvidencePipeline",
    "EvidenceBundle",
    # Queue
    "JobQueue",
    "Job",
    "RateLimiter",
    # Orchestrator
    "LogosOrchestrator",
]
