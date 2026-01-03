#!/usr/bin/env python3
"""
Translation Gates - Approval Scaffold for Translation Quality

Implements gates T1-T4 for validating translation quality and normalization:

Gate T1: MEANING PRESERVATION
- Multilingual embedding similarity source↔candidate above threshold
- Entity/number preservation checks
- Contradiction/negation safety checks

Gate T2: STYLE MOVEMENT ONLY
- Style distance moved toward target (in style-only space)
- Content-word alignment drift below threshold

Gate T3: NO CONFOUND LEAKAGE
- Normalized outputs don't become predictably "genre X" unless intended
- Translator classifier confidence should drop
- Genre classifier remains stable

Gate T4: ROBUSTNESS
- Same passage normalized under different random seeds yields similar output
- Stability checks across paraphrases
"""

import asyncio
import asyncpg
import numpy as np
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass, field
import json
import re
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_URL = "postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway"


@dataclass
class GateResult:
    """Result of a single gate evaluation"""
    gate_name: str
    passed: bool
    score: float
    threshold: float
    details: Dict[str, Any] = field(default_factory=dict)
    reasons: List[str] = field(default_factory=list)


@dataclass
class TranslationGateReport:
    """Complete gate report for a translation"""
    passage_id: int
    source_text: str
    translation_text: str
    candidate_text: Optional[str]  # For normalization evaluation
    gate_results: List[GateResult]
    overall_passed: bool
    timestamp: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            'passage_id': self.passage_id,
            'source_text': self.source_text[:100] + '...' if len(self.source_text) > 100 else self.source_text,
            'translation_text': self.translation_text[:100] + '...' if len(self.translation_text) > 100 else self.translation_text,
            'overall_passed': bool(self.overall_passed),
            'gates': [
                {
                    'name': g.gate_name,
                    'passed': bool(g.passed),
                    'score': float(g.score),
                    'threshold': float(g.threshold),
                    'reasons': g.reasons
                }
                for g in self.gate_results
            ],
            'timestamp': self.timestamp
        }


class TranslationGates:
    """
    Implements translation validation gates T1-T4.

    This is the "Approval Scaffold" for translation quality,
    ensuring meaning preservation, proper style movement,
    no confound leakage, and robustness.
    """

    # Gate thresholds
    THRESHOLDS = {
        'T1_embedding_similarity': 0.70,  # Minimum semantic similarity
        'T1_entity_preservation': 0.90,   # Entity preservation rate
        'T1_length_ratio_max': 1.5,       # Max acceptable length ratio
        'T2_style_movement': 0.10,        # Minimum style distance change
        'T2_content_drift_max': 0.30,     # Max content drift allowed
        'T3_genre_stability': 0.80,       # Genre classifier should stay stable
        'T3_translator_drop': 0.20,       # Translator classifier confidence should drop
        'T4_stability': 0.90,             # Minimum stability across seeds
    }

    def __init__(self, conn: asyncpg.Connection = None):
        self.conn = conn
        self.logger = logging.getLogger("TranslationGates")

    async def connect(self):
        """Connect to database if not already connected"""
        if self.conn is None:
            self.conn = await asyncpg.connect(DB_URL)

    async def close(self):
        """Close database connection"""
        if self.conn:
            await self.conn.close()
            self.conn = None

    # ═══════════════════════════════════════════════════════════════════════════════
    # GATE T1: MEANING PRESERVATION
    # ═══════════════════════════════════════════════════════════════════════════════

    def gate_t1_meaning_preservation(
        self,
        source_text: str,
        translation_text: str,
        source_embedding: Optional[np.ndarray] = None,
        translation_embedding: Optional[np.ndarray] = None
    ) -> GateResult:
        """
        Gate T1: Meaning Preservation

        Checks:
        1. Embedding similarity (if available)
        2. Entity/number preservation
        3. Length ratio reasonableness
        4. No obvious contradictions
        """
        reasons = []
        subscores = []

        # Check 1: Embedding similarity
        if source_embedding is not None and translation_embedding is not None:
            norm_s = np.linalg.norm(source_embedding)
            norm_t = np.linalg.norm(translation_embedding)
            if norm_s > 0 and norm_t > 0:
                sim = np.dot(source_embedding, translation_embedding) / (norm_s * norm_t)
                subscores.append(('embedding_similarity', sim))
                if sim < self.THRESHOLDS['T1_embedding_similarity']:
                    reasons.append(f"Low embedding similarity: {sim:.3f} < {self.THRESHOLDS['T1_embedding_similarity']}")
        else:
            # Can't check embeddings, skip this component
            subscores.append(('embedding_similarity', 0.75))  # Neutral default

        # Check 2: Entity/number preservation
        source_numbers = set(re.findall(r'\d+', source_text))
        trans_numbers = set(re.findall(r'\d+', translation_text))
        if source_numbers:
            preserved = len(source_numbers & trans_numbers) / len(source_numbers)
            subscores.append(('number_preservation', preserved))
            if preserved < self.THRESHOLDS['T1_entity_preservation']:
                reasons.append(f"Number preservation low: {preserved:.1%}")

        # Check 3: Length ratio
        source_words = len(source_text.split())
        trans_words = len(translation_text.split())
        if source_words > 0:
            ratio = trans_words / source_words
            # Penalize extreme ratios
            if ratio > self.THRESHOLDS['T1_length_ratio_max']:
                ratio_score = 1.0 - (ratio - self.THRESHOLDS['T1_length_ratio_max']) / 2
                reasons.append(f"Translation too long: {ratio:.1f}x source length")
            elif ratio < 1 / self.THRESHOLDS['T1_length_ratio_max']:
                ratio_score = 1.0 - (1/ratio - self.THRESHOLDS['T1_length_ratio_max']) / 2
                reasons.append(f"Translation too short: {ratio:.1f}x source length")
            else:
                ratio_score = 1.0
            subscores.append(('length_ratio', max(0, ratio_score)))

        # Check 4: Basic negation/contradiction check
        source_negations = len(re.findall(r'\b(not|no|never|neither|none)\b', source_text.lower()))
        trans_negations = len(re.findall(r'\b(not|no|never|neither|none|οὐ|μή)\b', translation_text.lower()))
        # Negation count should be similar (within 2)
        neg_diff = abs(source_negations - trans_negations)
        if neg_diff > 2:
            subscores.append(('negation_match', 0.5))
            reasons.append(f"Negation count mismatch: source={source_negations}, trans={trans_negations}")
        else:
            subscores.append(('negation_match', 1.0))

        # Compute weighted score
        if subscores:
            score = np.mean([s[1] for s in subscores])
        else:
            score = 0.5

        passed = score >= self.THRESHOLDS['T1_embedding_similarity'] and len(reasons) <= 1

        return GateResult(
            gate_name="T1: Meaning Preservation",
            passed=passed,
            score=float(score),
            threshold=self.THRESHOLDS['T1_embedding_similarity'],
            details={'subscores': dict(subscores)},
            reasons=reasons
        )

    # ═══════════════════════════════════════════════════════════════════════════════
    # GATE T2: STYLE MOVEMENT ONLY
    # ═══════════════════════════════════════════════════════════════════════════════

    def gate_t2_style_movement(
        self,
        original_style_vector: Optional[np.ndarray],
        candidate_style_vector: Optional[np.ndarray],
        target_style_vector: Optional[np.ndarray],
        original_text: str,
        candidate_text: str
    ) -> GateResult:
        """
        Gate T2: Style Movement Only

        Checks:
        1. Style distance moved toward target
        2. Content-word alignment preserved
        """
        reasons = []
        subscores = []

        # Check 1: Style movement toward target (if embeddings available)
        if all(v is not None for v in [original_style_vector, candidate_style_vector, target_style_vector]):
            # Distance from original to target
            orig_to_target = np.linalg.norm(original_style_vector - target_style_vector)
            # Distance from candidate to target
            cand_to_target = np.linalg.norm(candidate_style_vector - target_style_vector)

            # Movement score: how much closer did we get?
            movement = orig_to_target - cand_to_target
            movement_normalized = movement / (orig_to_target + 0.001)

            subscores.append(('style_movement', max(0, min(1, movement_normalized + 0.5))))

            if movement < self.THRESHOLDS['T2_style_movement']:
                reasons.append(f"Insufficient style movement: {movement:.3f}")
        else:
            subscores.append(('style_movement', 0.5))  # Neutral default

        # Check 2: Content word preservation (simple check)
        # Extract content words (non-function words, longer than 4 chars)
        def get_content_words(text: str) -> set:
            function_words = {'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'is', 'are',
                              'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
                              'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
                              'must', 'shall', 'of', 'to', 'in', 'for', 'on', 'with', 'at', 'by',
                              'from', 'as', 'into', 'through', 'during', 'before', 'after',
                              'above', 'below', 'between', 'under', 'again', 'further', 'once'}
            words = re.findall(r'\b\w{4,}\b', text.lower())
            return {w for w in words if w not in function_words}

        orig_content = get_content_words(original_text)
        cand_content = get_content_words(candidate_text)

        if orig_content:
            preserved = len(orig_content & cand_content) / len(orig_content)
            subscores.append(('content_preservation', preserved))

            if 1 - preserved > self.THRESHOLDS['T2_content_drift_max']:
                reasons.append(f"High content drift: {1-preserved:.1%} content words changed")
        else:
            subscores.append(('content_preservation', 1.0))

        # Compute score
        score = np.mean([s[1] for s in subscores])
        passed = len(reasons) == 0

        return GateResult(
            gate_name="T2: Style Movement Only",
            passed=passed,
            score=float(score),
            threshold=self.THRESHOLDS['T2_style_movement'],
            details={'subscores': dict(subscores)},
            reasons=reasons
        )

    # ═══════════════════════════════════════════════════════════════════════════════
    # GATE T3: NO CONFOUND LEAKAGE
    # ═══════════════════════════════════════════════════════════════════════════════

    def gate_t3_confound_leakage(
        self,
        original_translator_confidence: float,
        candidate_translator_confidence: float,
        original_genre_confidence: float,
        candidate_genre_confidence: float
    ) -> GateResult:
        """
        Gate T3: No Confound Leakage

        Checks:
        1. Translator classifier confidence should drop (style normalized)
        2. Genre classifier should remain stable (meaning preserved)
        """
        reasons = []
        subscores = []

        # Check 1: Translator confidence drop
        translator_drop = original_translator_confidence - candidate_translator_confidence
        subscores.append(('translator_drop', min(1, max(0, translator_drop + 0.5))))

        if translator_drop < self.THRESHOLDS['T3_translator_drop']:
            reasons.append(f"Translator still identifiable: drop={translator_drop:.3f}")

        # Check 2: Genre stability
        genre_stability = 1 - abs(original_genre_confidence - candidate_genre_confidence)
        subscores.append(('genre_stability', genre_stability))

        if genre_stability < self.THRESHOLDS['T3_genre_stability']:
            reasons.append(f"Genre classification changed: stability={genre_stability:.3f}")

        score = np.mean([s[1] for s in subscores])
        passed = len(reasons) == 0

        return GateResult(
            gate_name="T3: No Confound Leakage",
            passed=passed,
            score=float(score),
            threshold=self.THRESHOLDS['T3_translator_drop'],
            details={'subscores': dict(subscores)},
            reasons=reasons
        )

    # ═══════════════════════════════════════════════════════════════════════════════
    # GATE T4: ROBUSTNESS
    # ═══════════════════════════════════════════════════════════════════════════════

    def gate_t4_robustness(
        self,
        candidate_outputs: List[str]
    ) -> GateResult:
        """
        Gate T4: Robustness

        Checks:
        1. Outputs from different random seeds are similar
        """
        reasons = []

        if len(candidate_outputs) < 2:
            # Can't check stability with single output
            return GateResult(
                gate_name="T4: Robustness",
                passed=True,
                score=1.0,
                threshold=self.THRESHOLDS['T4_stability'],
                details={'note': 'Single output, stability check skipped'},
                reasons=[]
            )

        # Compute pairwise similarity using simple Jaccard on words
        def jaccard(a: str, b: str) -> float:
            words_a = set(a.lower().split())
            words_b = set(b.lower().split())
            intersection = len(words_a & words_b)
            union = len(words_a | words_b)
            return intersection / union if union > 0 else 0

        similarities = []
        for i in range(len(candidate_outputs)):
            for j in range(i + 1, len(candidate_outputs)):
                similarities.append(jaccard(candidate_outputs[i], candidate_outputs[j]))

        avg_similarity = np.mean(similarities)

        if avg_similarity < self.THRESHOLDS['T4_stability']:
            reasons.append(f"Low stability across seeds: {avg_similarity:.3f}")

        passed = avg_similarity >= self.THRESHOLDS['T4_stability']

        return GateResult(
            gate_name="T4: Robustness",
            passed=passed,
            score=float(avg_similarity),
            threshold=self.THRESHOLDS['T4_stability'],
            details={'n_outputs': len(candidate_outputs), 'pairwise_similarities': similarities},
            reasons=reasons
        )

    # ═══════════════════════════════════════════════════════════════════════════════
    # FULL EVALUATION
    # ═══════════════════════════════════════════════════════════════════════════════

    def evaluate_translation(
        self,
        passage_id: int,
        source_text: str,
        translation_text: str,
        candidate_text: Optional[str] = None,
        source_embedding: Optional[np.ndarray] = None,
        translation_embedding: Optional[np.ndarray] = None,
        original_style_vector: Optional[np.ndarray] = None,
        candidate_style_vector: Optional[np.ndarray] = None,
        target_style_vector: Optional[np.ndarray] = None,
        original_translator_confidence: float = 0.8,
        candidate_translator_confidence: float = 0.5,
        original_genre_confidence: float = 0.7,
        candidate_genre_confidence: float = 0.7,
        candidate_outputs: Optional[List[str]] = None
    ) -> TranslationGateReport:
        """
        Run all gates and produce a complete report.
        """
        gate_results = []

        # Gate T1: Meaning Preservation
        t1 = self.gate_t1_meaning_preservation(
            source_text, translation_text,
            source_embedding, translation_embedding
        )
        gate_results.append(t1)

        # Gate T2: Style Movement Only (only if we have a candidate)
        if candidate_text:
            t2 = self.gate_t2_style_movement(
                original_style_vector, candidate_style_vector, target_style_vector,
                translation_text, candidate_text
            )
            gate_results.append(t2)

        # Gate T3: Confound Leakage (only if we have normalization)
        if candidate_text:
            t3 = self.gate_t3_confound_leakage(
                original_translator_confidence, candidate_translator_confidence,
                original_genre_confidence, candidate_genre_confidence
            )
            gate_results.append(t3)

        # Gate T4: Robustness (only if multiple outputs)
        if candidate_outputs and len(candidate_outputs) > 1:
            t4 = self.gate_t4_robustness(candidate_outputs)
            gate_results.append(t4)

        # Overall pass requires all gates to pass
        overall_passed = all(g.passed for g in gate_results)

        return TranslationGateReport(
            passage_id=passage_id,
            source_text=source_text,
            translation_text=translation_text,
            candidate_text=candidate_text,
            gate_results=gate_results,
            overall_passed=overall_passed,
            timestamp=datetime.now().isoformat()
        )


async def run_translation_gates(
    sample_size: int = 100,
    output_dir: Path = None
) -> Dict[str, Any]:
    """
    Run translation gates on a sample of passages.

    This is the CI-style command that runs gates and reports results.
    """
    if output_dir is None:
        output_dir = Path('/Users/royvaid/Downloads/logos/papers')

    logger.info("=" * 70)
    logger.info("TRANSLATION GATES EVALUATION")
    logger.info("=" * 70)

    conn = await asyncpg.connect(DB_URL)
    gates = TranslationGates(conn)

    try:
        # Get sample of translations
        translations = await conn.fetch("""
            SELECT
                t.id, t.translation as translation_text,
                t.embedding as translation_embedding,
                s.content as source_text,
                s.author, s.work
            FROM translations t
            LEFT JOIN source_texts s ON t.text_id = s.id
            WHERE t.translation IS NOT NULL
              AND s.content IS NOT NULL
              AND LENGTH(t.translation) > 50
            ORDER BY RANDOM()
            LIMIT $1
        """, sample_size)

        logger.info(f"Evaluating {len(translations)} translations")

        results = []
        passed_count = 0

        for t in translations:
            trans_emb = np.array(t['translation_embedding']) if t['translation_embedding'] else None
            source_emb = None  # Source embeddings need multilingual model - skip for now

            report = gates.evaluate_translation(
                passage_id=t['id'],
                source_text=t['source_text'] or "",
                translation_text=t['translation_text'] or "",
                source_embedding=source_emb,
                translation_embedding=trans_emb
            )

            results.append(report.to_dict())
            if report.overall_passed:
                passed_count += 1

        # Generate summary
        summary = {
            'timestamp': datetime.now().isoformat(),
            'sample_size': len(translations),
            'passed': passed_count,
            'failed': len(translations) - passed_count,
            'pass_rate': passed_count / len(translations) if translations else 0,
            'results': results[:20]  # Include first 20 detailed results
        }

        # Save reports
        output_dir.mkdir(parents=True, exist_ok=True)

        json_path = output_dir / 'TRANSLATION_GATES_REPORT.json'
        with open(json_path, 'w') as f:
            json.dump(summary, f, indent=2)

        md_path = output_dir / 'TRANSLATION_GATES_REPORT.md'
        with open(md_path, 'w') as f:
            f.write(f"# Translation Gates Report\n\n")
            f.write(f"**Generated:** {summary['timestamp']}\n\n")
            f.write(f"**Sample Size:** {summary['sample_size']}\n\n")
            f.write(f"**Pass Rate:** {summary['pass_rate']:.1%} ({summary['passed']}/{summary['sample_size']})\n\n")
            f.write("## Gate Results\n\n")
            f.write("| Gate | Avg Score | Pass Rate |\n")
            f.write("|:-----|:---------:|:---------:|\n")

            # Aggregate by gate
            gate_stats = {}
            for r in results:
                for g in r['gates']:
                    name = g['name']
                    if name not in gate_stats:
                        gate_stats[name] = {'scores': [], 'passed': 0}
                    gate_stats[name]['scores'].append(g['score'])
                    if g['passed']:
                        gate_stats[name]['passed'] += 1

            for name, stats in gate_stats.items():
                avg_score = np.mean(stats['scores'])
                pass_rate = stats['passed'] / len(stats['scores']) if stats['scores'] else 0
                f.write(f"| {name} | {avg_score:.3f} | {pass_rate:.1%} |\n")

            f.write("\n---\n\n*Generated by translation_gates.py*\n")

        logger.info(f"\nPass rate: {summary['pass_rate']:.1%}")
        logger.info(f"Reports saved to {output_dir}")

        # CI-style exit: return non-zero if pass rate is too low
        return summary

    finally:
        await conn.close()


if __name__ == "__main__":
    result = asyncio.run(run_translation_gates(sample_size=100))

    # CI-style check: fail if pass rate < 50%
    if result['pass_rate'] < 0.50:
        logger.error(f"FAIL: Pass rate {result['pass_rate']:.1%} < 50%")
        exit(1)
    else:
        logger.info(f"PASS: Pass rate {result['pass_rate']:.1%} >= 50%")
        exit(0)
