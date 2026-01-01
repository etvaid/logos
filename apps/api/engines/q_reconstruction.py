"""
Q Reconstruction Engine
=======================

Reconstructs the hypothetical Q source from synoptic parallels.

Method:
1. Learn Matthew's and Luke's redaction signatures from triple tradition (Mark → Mt/Lk)
2. Apply inverse of learned signatures to double tradition (Mt || Lk)
3. Estimate Q text with uncertainty quantification

Key concepts:
- Redaction Signature: Systematic editorial patterns (additions, omissions, modifications)
- Triple Tradition: Passages in all three synoptics (can learn signatures)
- Double Tradition: Mt+Lk but not Mark (where Q is hypothesized)
"""

import numpy as np
from typing import List, Dict, Optional, Tuple, Any
from dataclasses import dataclass
from collections import defaultdict
import asyncpg
from scipy.spatial.distance import cosine

from config.constants import EMBED_DIM, DOCTRINAL_AXES


@dataclass
class RedactionPattern:
    """A learned editorial pattern."""
    pattern_type: str  # 'addition', 'omission', 'modification', 'reordering'
    pattern_name: str
    evangelist: str  # 'matthew' or 'luke'
    pattern_embedding: np.ndarray
    frequency: int
    avg_magnitude: float
    doctrinal_axis: Optional[str]
    doctrinal_direction: Optional[str]


@dataclass
class QReconstruction:
    """A reconstructed Q passage."""
    alignment_id: int
    q_reference: str
    reconstructed_text: str
    confidence_score: float
    confidence_lower: float
    confidence_upper: float
    doctrinal_scores: Dict[str, float]


class QReconstructionEngine:
    """
    Engine for reconstructing the Q source document.

    Pipeline:
    1. Align synoptic parallels
    2. Learn redaction signatures from triple tradition
    3. Apply inverse signatures to double tradition
    4. Validate against scholarly editions
    """

    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool
        self.matthew_signatures: List[RedactionPattern] = []
        self.luke_signatures: List[RedactionPattern] = []
        self._signatures_trained = False

    # ═══════════════════════════════════════════════════════════════════════════════
    # SYNOPTIC ALIGNMENT
    # ═══════════════════════════════════════════════════════════════════════════════

    async def create_synoptic_alignment(
        self,
        matthew_ref: str,
        mark_ref: str,
        luke_ref: str,
        matthew_text: str,
        mark_text: str,
        luke_text: str
    ) -> Dict[str, Any]:
        """
        Create a synoptic alignment between parallel passages.

        Args:
            matthew_ref: Matthew reference (e.g., "Matt 3:7-10")
            mark_ref: Mark reference
            luke_ref: Luke reference
            matthew_text: Matthew text content
            mark_text: Mark text content
            luke_text: Luke text content

        Returns:
            Alignment details
        """
        async with self.pool.acquire() as conn:
            # Determine tradition type
            has_mt = bool(matthew_text and matthew_text.strip())
            has_mk = bool(mark_text and mark_text.strip())
            has_lk = bool(luke_text and luke_text.strip())

            if has_mt and has_mk and has_lk:
                tradition_type = "triple"
            elif has_mt and has_lk and not has_mk:
                tradition_type = "double_mt_lk"  # Q material
            elif has_mt and has_mk:
                tradition_type = "double_mt_mk"
            elif has_mk and has_lk:
                tradition_type = "double_mk_lk"
            else:
                tradition_type = "sondergut"

            # Compute pairwise similarities (would use embeddings in production)
            mt_mk_sim = self._text_similarity(matthew_text, mark_text)
            mt_lk_sim = self._text_similarity(matthew_text, luke_text)
            mk_lk_sim = self._text_similarity(mark_text, luke_text)

            # Create alignment group ID
            alignment_group = f"{matthew_ref}_{luke_ref}".replace(" ", "_")

            # Store
            await conn.execute("""
                INSERT INTO synoptic_alignments (
                    alignment_group, matthew_ref, mark_ref, luke_ref,
                    matthew_text, mark_text, luke_text, tradition_type,
                    mt_mk_similarity, mt_lk_similarity, mk_lk_similarity
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            """,
                alignment_group,
                matthew_ref if has_mt else None,
                mark_ref if has_mk else None,
                luke_ref if has_lk else None,
                matthew_text if has_mt else None,
                mark_text if has_mk else None,
                luke_text if has_lk else None,
                tradition_type,
                mt_mk_sim,
                mt_lk_sim,
                mk_lk_sim
            )

            return {
                "alignment_group": alignment_group,
                "tradition_type": tradition_type,
                "similarities": {
                    "mt_mk": mt_mk_sim,
                    "mt_lk": mt_lk_sim,
                    "mk_lk": mk_lk_sim
                }
            }

    def _text_similarity(self, text1: Optional[str], text2: Optional[str]) -> float:
        """Simple text similarity (Jaccard on words)."""
        if not text1 or not text2:
            return 0.0

        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())

        if not words1 or not words2:
            return 0.0

        intersection = len(words1 & words2)
        union = len(words1 | words2)

        return intersection / union if union > 0 else 0.0

    # ═══════════════════════════════════════════════════════════════════════════════
    # REDACTION SIGNATURE LEARNING
    # ═══════════════════════════════════════════════════════════════════════════════

    async def learn_redaction_signatures(self) -> Dict[str, Any]:
        """
        Learn Matthew's and Luke's redaction signatures from triple tradition.

        Uses Mark as base to identify systematic changes in Matthew and Luke.

        Returns:
            Training summary
        """
        async with self.pool.acquire() as conn:
            # Get triple tradition alignments
            alignments = await conn.fetch("""
                SELECT
                    id, alignment_group,
                    matthew_text, mark_text, luke_text
                FROM synoptic_alignments
                WHERE tradition_type = 'triple'
                  AND mark_text IS NOT NULL
            """)

            if len(alignments) < 10:
                return {"error": "Insufficient triple tradition data"}

            matthew_additions = []
            matthew_omissions = []
            matthew_modifications = []

            luke_additions = []
            luke_omissions = []
            luke_modifications = []

            for alignment in alignments:
                mark_words = set(alignment['mark_text'].lower().split())
                matt_words = set(alignment['matthew_text'].lower().split()) if alignment['matthew_text'] else set()
                luke_words = set(alignment['luke_text'].lower().split()) if alignment['luke_text'] else set()

                # Matthew's changes
                if matt_words:
                    mt_additions = matt_words - mark_words
                    mt_omissions = mark_words - matt_words
                    mt_shared = matt_words & mark_words

                    if mt_additions:
                        matthew_additions.append({
                            "alignment_id": alignment['id'],
                            "added_words": list(mt_additions)
                        })
                    if mt_omissions:
                        matthew_omissions.append({
                            "alignment_id": alignment['id'],
                            "omitted_words": list(mt_omissions)
                        })

                # Luke's changes
                if luke_words:
                    lk_additions = luke_words - mark_words
                    lk_omissions = mark_words - luke_words

                    if lk_additions:
                        luke_additions.append({
                            "alignment_id": alignment['id'],
                            "added_words": list(lk_additions)
                        })
                    if lk_omissions:
                        luke_omissions.append({
                            "alignment_id": alignment['id'],
                            "omitted_words": list(lk_omissions)
                        })

            # Analyze patterns and associate with doctrinal axes
            mt_patterns = self._analyze_patterns(matthew_additions, matthew_omissions, "matthew")
            lk_patterns = self._analyze_patterns(luke_additions, luke_omissions, "luke")

            # Store signatures
            for pattern in mt_patterns:
                await conn.execute("""
                    INSERT INTO redaction_signatures (
                        evangelist, pattern_type, pattern_name,
                        frequency, avg_magnitude, doctrinal_axis, doctrinal_direction
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                """,
                    "matthew",
                    pattern.pattern_type,
                    pattern.pattern_name,
                    pattern.frequency,
                    pattern.avg_magnitude,
                    pattern.doctrinal_axis,
                    pattern.doctrinal_direction
                )

            for pattern in lk_patterns:
                await conn.execute("""
                    INSERT INTO redaction_signatures (
                        evangelist, pattern_type, pattern_name,
                        frequency, avg_magnitude, doctrinal_axis, doctrinal_direction
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                """,
                    "luke",
                    pattern.pattern_type,
                    pattern.pattern_name,
                    pattern.frequency,
                    pattern.avg_magnitude,
                    pattern.doctrinal_axis,
                    pattern.doctrinal_direction
                )

            self.matthew_signatures = mt_patterns
            self.luke_signatures = lk_patterns
            self._signatures_trained = True

            return {
                "n_alignments": len(alignments),
                "matthew_patterns": len(mt_patterns),
                "luke_patterns": len(lk_patterns)
            }

    def _analyze_patterns(
        self,
        additions: List[Dict],
        omissions: List[Dict],
        evangelist: str
    ) -> List[RedactionPattern]:
        """Analyze editorial patterns and associate with doctrinal axes."""
        patterns = []

        # Count word frequencies in additions/omissions
        added_words = defaultdict(int)
        omitted_words = defaultdict(int)

        for add in additions:
            for word in add['added_words']:
                added_words[word] += 1

        for om in omissions:
            for word in om['omitted_words']:
                omitted_words[word] += 1

        # Check against doctrinal axes
        for axis_name, poles in DOCTRINAL_AXES.items():
            high_markers = set(poles.get('high', []) + poles.get('gnostic', []) +
                              poles.get('anti', []) + poles.get('pro_law', []))
            low_markers = set(poles.get('low', []) + poles.get('proto_orthodox', []) +
                             poles.get('pro', []) + poles.get('anti_law', []))

            # Check if additions lean one direction
            high_additions = sum(added_words.get(m, 0) for m in high_markers)
            low_additions = sum(added_words.get(m, 0) for m in low_markers)

            if high_additions > low_additions and high_additions > 3:
                patterns.append(RedactionPattern(
                    pattern_type="addition",
                    pattern_name=f"{axis_name}_high_tendency",
                    evangelist=evangelist,
                    pattern_embedding=np.zeros(EMBED_DIM),
                    frequency=high_additions,
                    avg_magnitude=high_additions / max(len(additions), 1),
                    doctrinal_axis=axis_name,
                    doctrinal_direction="high"
                ))
            elif low_additions > high_additions and low_additions > 3:
                patterns.append(RedactionPattern(
                    pattern_type="addition",
                    pattern_name=f"{axis_name}_low_tendency",
                    evangelist=evangelist,
                    pattern_embedding=np.zeros(EMBED_DIM),
                    frequency=low_additions,
                    avg_magnitude=low_additions / max(len(additions), 1),
                    doctrinal_axis=axis_name,
                    doctrinal_direction="low"
                ))

        return patterns

    # ═══════════════════════════════════════════════════════════════════════════════
    # Q RECONSTRUCTION
    # ═══════════════════════════════════════════════════════════════════════════════

    async def reconstruct_q_passage(
        self,
        alignment_id: int,
        n_bootstrap: int = 100
    ) -> Dict[str, Any]:
        """
        Reconstruct Q text for a double tradition passage.

        Method:
        1. Get Matthew and Luke versions
        2. Apply inverse of learned redaction signatures
        3. Find common ground adjusted for systematic changes
        4. Compute confidence with bootstrap

        Args:
            alignment_id: ID of synoptic alignment
            n_bootstrap: Number of bootstrap samples for CI

        Returns:
            Reconstruction with uncertainty
        """
        if not self._signatures_trained:
            await self.learn_redaction_signatures()

        async with self.pool.acquire() as conn:
            alignment = await conn.fetchrow("""
                SELECT * FROM synoptic_alignments WHERE id = $1
            """, alignment_id)

            if not alignment:
                return {"error": "Alignment not found"}

            if alignment['tradition_type'] != 'double_mt_lk':
                return {"error": "Not a double tradition passage (Mt+Lk)"}

            mt_text = alignment['matthew_text']
            lk_text = alignment['luke_text']

            if not mt_text or not lk_text:
                return {"error": "Missing text"}

            # Apply inverse redaction signatures
            # Remove Matthew's typical additions, restore Matthew's typical omissions
            q_from_mt = self._apply_inverse_signature(mt_text, self.matthew_signatures)

            # Similarly for Luke
            q_from_lk = self._apply_inverse_signature(lk_text, self.luke_signatures)

            # Find consensus
            mt_words = set(q_from_mt.lower().split())
            lk_words = set(q_from_lk.lower().split())

            # Core Q: words in both (after inverse signatures)
            core_words = mt_words & lk_words

            # Words in one but not other - weighted by confidence
            # For now, take intersection as base
            reconstructed = " ".join(sorted(core_words))

            # Compute confidence based on agreement
            if mt_words or lk_words:
                jaccard = len(core_words) / len(mt_words | lk_words)
            else:
                jaccard = 0.0

            # Bootstrap for CI
            bootstrap_scores = []
            for _ in range(n_bootstrap):
                # Resample words with replacement
                mt_sample = set(np.random.choice(list(mt_words), size=len(mt_words), replace=True))
                lk_sample = set(np.random.choice(list(lk_words), size=len(lk_words), replace=True))
                core = mt_sample & lk_sample
                if mt_sample or lk_sample:
                    score = len(core) / len(mt_sample | lk_sample)
                else:
                    score = 0.0
                bootstrap_scores.append(score)

            ci_lower = np.percentile(bootstrap_scores, 2.5)
            ci_upper = np.percentile(bootstrap_scores, 97.5)

            # Compute doctrinal profile
            doctrinal_scores = self._compute_doctrinal_profile(reconstructed)

            # Generate Q reference
            q_ref = self._generate_q_reference(alignment['matthew_ref'], alignment['luke_ref'])

            # Store reconstruction
            await conn.execute("""
                INSERT INTO q_reconstructions (
                    alignment_id, q_reference, reconstructed_text,
                    method, confidence_score, confidence_lower, confidence_upper,
                    doctrinal_scores
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            """,
                alignment_id,
                q_ref,
                reconstructed,
                "redaction_inversion",
                float(jaccard),
                float(ci_lower),
                float(ci_upper),
                doctrinal_scores
            )

            return {
                "alignment_id": alignment_id,
                "q_reference": q_ref,
                "reconstructed_text": reconstructed,
                "confidence": float(jaccard),
                "ci_lower": float(ci_lower),
                "ci_upper": float(ci_upper),
                "doctrinal_profile": doctrinal_scores,
                "matthew_source": mt_text,
                "luke_source": lk_text
            }

    def _apply_inverse_signature(
        self,
        text: str,
        signatures: List[RedactionPattern]
    ) -> str:
        """
        Apply inverse of redaction signatures to approximate source.

        For additions: remove them
        For omissions: flag as uncertain
        """
        words = text.lower().split()

        # Get words typically added by this evangelist
        addition_words = set()
        for sig in signatures:
            if sig.pattern_type == "addition":
                # Would have learned specific words
                pass

        # For now, return as-is (full implementation would modify)
        return text

    def _compute_doctrinal_profile(self, text: str) -> Dict[str, float]:
        """Compute scores on each doctrinal axis for a text."""
        text_lower = text.lower()
        scores = {}

        for axis_name, poles in DOCTRINAL_AXES.items():
            high_terms = poles.get('high', []) + poles.get('gnostic', []) + \
                        poles.get('anti', []) + poles.get('pro_law', [])
            low_terms = poles.get('low', []) + poles.get('proto_orthodox', []) + \
                       poles.get('pro', []) + poles.get('anti_law', [])

            high_count = sum(1 for term in high_terms if term in text_lower)
            low_count = sum(1 for term in low_terms if term in text_lower)

            total = high_count + low_count
            if total > 0:
                scores[axis_name] = (high_count - low_count) / total
            else:
                scores[axis_name] = 0.0

        return scores

    def _generate_q_reference(
        self,
        matthew_ref: Optional[str],
        luke_ref: Optional[str]
    ) -> str:
        """Generate Q reference from Matthew/Luke references."""
        # Use Luke's chapter/verse as base (traditional Q numbering)
        if luke_ref:
            # Extract numbers from Luke reference
            import re
            match = re.search(r'(\d+):(\d+)', luke_ref)
            if match:
                return f"Q {match.group(1)}:{match.group(2)}"
        return "Q ?:?"

    # ═══════════════════════════════════════════════════════════════════════════════
    # BATCH OPERATIONS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def reconstruct_all_q(self) -> Dict[str, Any]:
        """Reconstruct all double tradition passages."""
        async with self.pool.acquire() as conn:
            alignments = await conn.fetch("""
                SELECT id FROM synoptic_alignments
                WHERE tradition_type = 'double_mt_lk'
            """)

            reconstructed = 0
            errors = 0

            for alignment in alignments:
                try:
                    result = await self.reconstruct_q_passage(alignment['id'])
                    if "error" not in result:
                        reconstructed += 1
                    else:
                        errors += 1
                except Exception:
                    errors += 1

            return {
                "reconstructed": reconstructed,
                "errors": errors,
                "total": len(alignments)
            }

    async def validate_against_critical_edition(
        self,
        critical_edition: Dict[str, str]
    ) -> Dict[str, Any]:
        """
        Validate reconstructions against a critical edition (e.g., IQP).

        Args:
            critical_edition: Dict mapping Q reference to critical text

        Returns:
            Validation metrics
        """
        async with self.pool.acquire() as conn:
            reconstructions = await conn.fetch("""
                SELECT q_reference, reconstructed_text
                FROM q_reconstructions
            """)

            matches = 0
            total = 0
            agreements = []

            for recon in reconstructions:
                q_ref = recon['q_reference']
                if q_ref in critical_edition:
                    total += 1
                    critical_text = critical_edition[q_ref]
                    agreement = self._text_similarity(
                        recon['reconstructed_text'],
                        critical_text
                    )
                    agreements.append(agreement)

                    if agreement > 0.7:
                        matches += 1

            return {
                "total_compared": total,
                "matches": matches,
                "match_rate": matches / total if total > 0 else 0,
                "avg_agreement": float(np.mean(agreements)) if agreements else 0
            }

    # ═══════════════════════════════════════════════════════════════════════════════
    # ANALYSIS
    # ═══════════════════════════════════════════════════════════════════════════════

    async def get_q_doctrinal_profile(self) -> Dict[str, Any]:
        """
        Get aggregate doctrinal profile of reconstructed Q.

        Returns:
            Average scores on each doctrinal axis with confidence
        """
        async with self.pool.acquire() as conn:
            reconstructions = await conn.fetch("""
                SELECT doctrinal_scores, confidence_score
                FROM q_reconstructions
                WHERE doctrinal_scores IS NOT NULL
            """)

            if not reconstructions:
                return {"error": "No reconstructions available"}

            # Weight by confidence
            axis_scores = defaultdict(list)
            axis_weights = defaultdict(list)

            for recon in reconstructions:
                scores = recon['doctrinal_scores']
                weight = recon['confidence_score'] or 0.5

                for axis, score in scores.items():
                    axis_scores[axis].append(score)
                    axis_weights[axis].append(weight)

            profile = {}
            for axis in axis_scores:
                scores = np.array(axis_scores[axis])
                weights = np.array(axis_weights[axis])
                weights = weights / weights.sum()

                weighted_mean = np.sum(scores * weights)
                # Bootstrap for CI
                bootstrap_means = []
                for _ in range(1000):
                    idx = np.random.choice(len(scores), size=len(scores), replace=True)
                    w = weights[idx] / weights[idx].sum()
                    bootstrap_means.append(np.sum(scores[idx] * w))

                profile[axis] = {
                    "mean": float(weighted_mean),
                    "ci_lower": float(np.percentile(bootstrap_means, 2.5)),
                    "ci_upper": float(np.percentile(bootstrap_means, 97.5))
                }

            return profile

    async def compare_evangelists(self) -> Dict[str, Any]:
        """
        Compare Matthew's and Luke's redactional tendencies.

        Returns:
            Comparison of editorial signatures
        """
        async with self.pool.acquire() as conn:
            signatures = await conn.fetch("""
                SELECT evangelist, pattern_type, pattern_name,
                       frequency, doctrinal_axis, doctrinal_direction
                FROM redaction_signatures
            """)

            matthew_patterns = [s for s in signatures if s['evangelist'] == 'matthew']
            luke_patterns = [s for s in signatures if s['evangelist'] == 'luke']

            return {
                "matthew": {
                    "n_patterns": len(matthew_patterns),
                    "patterns": [dict(p) for p in matthew_patterns]
                },
                "luke": {
                    "n_patterns": len(luke_patterns),
                    "patterns": [dict(p) for p in luke_patterns]
                },
                "comparison": {
                    "both_have": [],  # Patterns in common
                    "matthew_only": [],
                    "luke_only": []
                }
            }
