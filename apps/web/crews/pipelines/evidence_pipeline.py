"""
EVIDENCE PIPELINE
Deterministic scoring + LLM explanation (never LLM scoring)
"""

import asyncio
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, asdict
import logging

from crews.compute.overlap import compute_overlap
from crews.compute.rare_words import find_rare_shared_words
from crews.compute.similarity import cosine_similarity

logger = logging.getLogger("evidence")


@dataclass
class EvidenceBundle:
    """All evidence for an intertextual connection"""
    source_urn: str
    target_urn: str

    # DETERMINISTIC SCORES (computed by code)
    word_overlap: float
    bigram_overlap: float
    trigram_overlap: float
    rare_word_significance: float
    embedding_similarity: float

    # DERIVED (formula, not LLM)
    overall_confidence: float
    connection_type: str  # Rule-based classification

    # Details
    shared_words: List[str]
    matched_phrases: List[str]
    rare_shared_words: List[Dict]

    # LLM EXPLANATION (narrative only)
    explanation: Optional[str] = None


class EvidencePipeline:
    """
    Computes all evidence deterministically.
    LLM only writes explanation text (never calculates).
    """

    def __init__(self, embedding_model=None, llm_client=None):
        self.embedding_model = embedding_model
        self.llm_client = llm_client

    def compute_evidence(
        self,
        source_text: str,
        target_text: str,
        source_embedding: List[float] = None,
        target_embedding: List[float] = None,
        source_urn: str = "",
        target_urn: str = ""
    ) -> EvidenceBundle:
        """
        DETERMINISTIC evidence computation.
        No LLM - pure code, reproducible.
        """
        # 1. Overlap metrics (code)
        overlap = compute_overlap(source_text, target_text)

        # 2. Rare word analysis (code + frequency table)
        rare_words = find_rare_shared_words(source_text, target_text)

        # 3. Embedding similarity (code)
        embedding_sim = 0.0
        if source_embedding and target_embedding:
            embedding_sim = cosine_similarity(source_embedding, target_embedding)

        # 4. Overall confidence (FORMULA, not LLM)
        # Weighted combination of metrics
        overall = (
            overlap['word_overlap'] * 0.2 +
            overlap['bigram_overlap'] * 0.3 +
            overlap['trigram_overlap'] * 0.3 +
            rare_words['significance_score'] * 0.1 +
            embedding_sim * 0.1
        )

        # 5. Connection type (RULE-BASED, not LLM)
        if overlap['trigram_overlap'] > 0.5:
            conn_type = "direct_quotation"
        elif overlap['bigram_overlap'] > 0.3:
            conn_type = "close_allusion"
        elif overlap['word_overlap'] > 0.2:
            conn_type = "allusion"
        elif embedding_sim > 0.7:
            conn_type = "thematic_parallel"
        else:
            conn_type = "possible_echo"

        return EvidenceBundle(
            source_urn=source_urn,
            target_urn=target_urn,
            word_overlap=overlap['word_overlap'],
            bigram_overlap=overlap['bigram_overlap'],
            trigram_overlap=overlap['trigram_overlap'],
            rare_word_significance=rare_words['significance_score'],
            embedding_similarity=round(embedding_sim, 4),
            overall_confidence=round(overall, 4),
            connection_type=conn_type,
            shared_words=overlap['shared_words'][:20],
            matched_phrases=overlap['matched_phrases'][:10],
            rare_shared_words=rare_words['rare_shared_words'][:10],
        )

    async def generate_explanation(
        self,
        evidence: EvidenceBundle,
        source_text: str,
        target_text: str,
        source_work: str = "",
        target_work: str = ""
    ) -> str:
        """
        LLM ONLY writes explanation.
        It does NOT calculate - it receives pre-calculated evidence.
        """
        if not self.llm_client:
            return self._template_explanation(evidence)

        prompt = f"""Write a brief scholarly explanation of this intertextual connection.

SOURCE ({source_work}): {source_text[:200]}
TARGET ({target_work}): {target_text[:200]}

PRE-CALCULATED EVIDENCE (do not recalculate):
- Word overlap: {evidence.word_overlap:.1%}
- Bigram overlap: {evidence.bigram_overlap:.1%}
- Trigram overlap: {evidence.trigram_overlap:.1%}
- Shared rare words: {evidence.rare_shared_words[:5]}
- Embedding similarity: {evidence.embedding_similarity:.1%}
- Connection type: {evidence.connection_type}
- Overall confidence: {evidence.overall_confidence:.1%}

Write 2-3 sentences explaining WHY these texts are connected.
Use the evidence provided. Do NOT make up new numbers."""

        try:
            response = await self.llm_client.generate(prompt, json_output=False)
            return response
        except Exception as e:
            logger.error(f"LLM explanation failed: {e}")
            return self._template_explanation(evidence)

    def _template_explanation(self, evidence: EvidenceBundle) -> str:
        """Fallback template explanation"""
        conn_type = evidence.connection_type
        confidence = evidence.overall_confidence

        if conn_type == "direct_quotation":
            return f"This appears to be a direct quotation with {confidence:.0%} confidence, based on significant trigram overlap and shared rare vocabulary."
        elif conn_type == "close_allusion":
            return f"This is likely a close allusion with {confidence:.0%} confidence, showing substantial phrasal similarity in key terms."
        elif conn_type == "allusion":
            return f"This shows signs of allusion with {confidence:.0%} confidence, based on shared vocabulary and thematic overlap."
        elif conn_type == "thematic_parallel":
            return f"This represents a thematic parallel with {confidence:.0%} confidence, indicated by semantic similarity despite different vocabulary."
        else:
            return f"This connection ({conn_type}) has {confidence:.0%} confidence based on lexical and thematic analysis."

    def to_dict(self, evidence: EvidenceBundle) -> Dict[str, Any]:
        """Convert evidence bundle to dictionary."""
        return asdict(evidence)

    def compute_batch(
        self,
        pairs: List[Dict],  # [{source_text, target_text, source_urn, target_urn}, ...]
    ) -> List[EvidenceBundle]:
        """Compute evidence for multiple pairs efficiently."""
        return [
            self.compute_evidence(
                source_text=p['source_text'],
                target_text=p['target_text'],
                source_urn=p.get('source_urn', ''),
                target_urn=p.get('target_urn', '')
            )
            for p in pairs
        ]
