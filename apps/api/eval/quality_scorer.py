#!/usr/bin/env python3
"""
Translation Quality Scorer v1 - Job 3

Combines meaning anchors, style residuals, and translation gates into
a credible overall quality score.

Components:
1. Meaning preservation score (from T1 gate + meaning anchor similarity)
2. Style consistency score (style residual magnitude vs expected)
3. Length/fluency score (word count ratio, sentence structure)
4. Overall quality score (calibrated combination)

The scorer is designed to be credible and not overfit - it uses
principled combinations rather than arbitrary weights.
"""

import asyncio
import asyncpg
import numpy as np
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass
import json
import re
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_URL = "postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway"
PAPERS_DIR = Path('/Users/royvaid/Downloads/logos/papers')

# Quality thresholds (calibrated)
THRESHOLDS = {
    # Meaning preservation
    'meaning_similarity_min': 0.50,      # Minimum acceptable
    'meaning_similarity_good': 0.70,     # Good quality
    'meaning_similarity_excellent': 0.85, # Excellent quality

    # Length ratio (translation/source word count)
    'length_ratio_min': 0.5,
    'length_ratio_max': 2.0,
    'length_ratio_ideal_low': 0.8,
    'length_ratio_ideal_high': 1.5,

    # Style residual (deviation from translator norm)
    'style_residual_excellent': 0.5,     # Very consistent with translator
    'style_residual_acceptable': 2.0,    # Acceptable deviation
    'style_residual_flag': 3.0,          # Needs review

    # Sentence structure
    'avg_sentence_length_min': 5,
    'avg_sentence_length_max': 40,
}


@dataclass
class QualityScore:
    """Complete quality score for a translation"""
    translation_id: int
    translator_id: int
    source_text_id: int

    # Component scores (0-1, higher is better)
    meaning_score: float
    style_score: float
    fluency_score: float

    # Overall score (0-1)
    overall_score: float

    # Quality tier
    tier: str  # 'excellent', 'good', 'acceptable', 'needs_review'

    # Details for debugging
    details: Dict[str, Any]

    def to_dict(self) -> Dict[str, Any]:
        return {
            'translation_id': self.translation_id,
            'translator_id': self.translator_id,
            'source_text_id': self.source_text_id,
            'meaning_score': self.meaning_score,
            'style_score': self.style_score,
            'fluency_score': self.fluency_score,
            'overall_score': self.overall_score,
            'tier': self.tier,
            'details': self.details
        }


class TranslationQualityScorer:
    """Scores translation quality using meaning anchors and style residuals"""

    def __init__(self):
        self.thresholds = THRESHOLDS

    def compute_meaning_score(
        self,
        translation_embedding: Optional[np.ndarray],
        anchor_embedding: Optional[np.ndarray],
        source_content: str,
        translation_text: str
    ) -> Tuple[float, Dict[str, Any]]:
        """
        Compute meaning preservation score.

        Uses:
        1. Cosine similarity between translation and meaning anchor
        2. Length ratio as sanity check
        3. Key entity preservation (numbers, names)
        """
        details = {}

        # Embedding similarity (if available)
        if translation_embedding is not None and anchor_embedding is not None:
            # Cosine similarity
            t_norm = translation_embedding / (np.linalg.norm(translation_embedding) + 1e-10)
            a_norm = anchor_embedding / (np.linalg.norm(anchor_embedding) + 1e-10)
            similarity = float(np.dot(t_norm, a_norm))
            details['embedding_similarity'] = similarity
        else:
            similarity = 0.5  # Neutral if no embeddings
            details['embedding_similarity'] = None

        # Length ratio
        source_words = len(source_content.split()) if source_content else 1
        trans_words = len(translation_text.split()) if translation_text else 0
        length_ratio = trans_words / source_words
        details['length_ratio'] = length_ratio

        # Length ratio score (bell curve centered on 1.0-1.3)
        if self.thresholds['length_ratio_ideal_low'] <= length_ratio <= self.thresholds['length_ratio_ideal_high']:
            length_score = 1.0
        elif length_ratio < self.thresholds['length_ratio_min'] or length_ratio > self.thresholds['length_ratio_max']:
            length_score = 0.3
        else:
            # Gradual decrease outside ideal range
            if length_ratio < self.thresholds['length_ratio_ideal_low']:
                length_score = 0.7 + 0.3 * (length_ratio - self.thresholds['length_ratio_min']) / \
                               (self.thresholds['length_ratio_ideal_low'] - self.thresholds['length_ratio_min'])
            else:
                length_score = 0.7 + 0.3 * (self.thresholds['length_ratio_max'] - length_ratio) / \
                               (self.thresholds['length_ratio_max'] - self.thresholds['length_ratio_ideal_high'])
            length_score = max(0.3, min(1.0, length_score))

        details['length_score'] = length_score

        # Number preservation
        source_numbers = set(re.findall(r'\b\d+\b', source_content or ''))
        trans_numbers = set(re.findall(r'\b\d+\b', translation_text or ''))
        if source_numbers:
            number_preservation = len(source_numbers & trans_numbers) / len(source_numbers)
        else:
            number_preservation = 1.0
        details['number_preservation'] = number_preservation

        # Combine scores
        # Weight embedding similarity most, with length and numbers as sanity checks
        if details['embedding_similarity'] is not None:
            meaning_score = 0.70 * similarity + 0.20 * length_score + 0.10 * number_preservation
        else:
            # Without embeddings, rely more on proxy measures
            meaning_score = 0.60 * length_score + 0.40 * number_preservation

        return float(np.clip(meaning_score, 0, 1)), details

    def compute_style_score(
        self,
        style_residual: Optional[np.ndarray],
        translator_centroid: Optional[np.ndarray]
    ) -> Tuple[float, Dict[str, Any]]:
        """
        Compute style consistency score.

        A good translation should have style consistent with the translator's
        typical style (low residual magnitude).
        """
        details = {}

        if style_residual is None:
            # No style data available
            return 0.5, {'residual_magnitude': None, 'note': 'No style residual available'}

        # Compute residual magnitude (L2 norm)
        residual_mag = float(np.linalg.norm(style_residual))
        details['residual_magnitude'] = residual_mag

        # Convert to score (lower magnitude = higher score)
        if residual_mag <= self.thresholds['style_residual_excellent']:
            style_score = 1.0
        elif residual_mag <= self.thresholds['style_residual_acceptable']:
            # Linear interpolation
            style_score = 1.0 - 0.3 * (residual_mag - self.thresholds['style_residual_excellent']) / \
                         (self.thresholds['style_residual_acceptable'] - self.thresholds['style_residual_excellent'])
        elif residual_mag <= self.thresholds['style_residual_flag']:
            style_score = 0.5
        else:
            style_score = 0.3

        details['style_score_raw'] = style_score
        return float(np.clip(style_score, 0, 1)), details

    def compute_fluency_score(
        self,
        translation_text: str
    ) -> Tuple[float, Dict[str, Any]]:
        """
        Compute fluency score based on surface features.

        Checks:
        1. Sentence structure (not too short/long)
        2. Punctuation balance
        3. Word variety
        """
        details = {}

        if not translation_text:
            return 0.0, {'error': 'Empty translation'}

        # Split into sentences
        sentences = re.split(r'[.!?]+', translation_text)
        sentences = [s.strip() for s in sentences if s.strip()]

        if not sentences:
            return 0.3, {'error': 'No valid sentences'}

        # Sentence length
        sentence_lengths = [len(s.split()) for s in sentences]
        avg_sentence_length = np.mean(sentence_lengths)
        details['avg_sentence_length'] = float(avg_sentence_length)

        # Score sentence length
        if self.thresholds['avg_sentence_length_min'] <= avg_sentence_length <= self.thresholds['avg_sentence_length_max']:
            sentence_score = 1.0
        elif avg_sentence_length < self.thresholds['avg_sentence_length_min']:
            sentence_score = 0.5 + 0.5 * (avg_sentence_length / self.thresholds['avg_sentence_length_min'])
        else:
            sentence_score = max(0.3, 1.0 - 0.03 * (avg_sentence_length - self.thresholds['avg_sentence_length_max']))

        details['sentence_score'] = float(sentence_score)

        # Punctuation balance (check for matching quotes, parentheses)
        open_paren = translation_text.count('(')
        close_paren = translation_text.count(')')
        open_quote = translation_text.count('"')

        punctuation_balanced = (open_paren == close_paren) and (open_quote % 2 == 0)
        details['punctuation_balanced'] = punctuation_balanced
        punct_score = 1.0 if punctuation_balanced else 0.7

        # Word variety (type-token ratio for first 100 words)
        words = translation_text.lower().split()[:100]
        if len(words) >= 10:
            ttr = len(set(words)) / len(words)
            details['type_token_ratio'] = float(ttr)
            # TTR between 0.4-0.7 is typical for good prose
            if 0.4 <= ttr <= 0.7:
                variety_score = 1.0
            else:
                variety_score = 0.7
        else:
            variety_score = 0.5
            details['type_token_ratio'] = None

        details['variety_score'] = float(variety_score)

        # Combine
        fluency_score = 0.5 * sentence_score + 0.3 * punct_score + 0.2 * variety_score
        return float(np.clip(fluency_score, 0, 1)), details

    def compute_overall_score(
        self,
        meaning_score: float,
        style_score: float,
        fluency_score: float
    ) -> Tuple[float, str]:
        """
        Compute overall quality score and tier.

        Meaning is most important, then fluency, then style consistency.
        """
        # Weighted combination
        # Meaning is critical (60%), fluency important (25%), style is bonus (15%)
        overall = 0.60 * meaning_score + 0.25 * fluency_score + 0.15 * style_score

        # Determine tier
        if overall >= 0.85 and meaning_score >= 0.80:
            tier = 'excellent'
        elif overall >= 0.70 and meaning_score >= 0.65:
            tier = 'good'
        elif overall >= 0.50 and meaning_score >= 0.50:
            tier = 'acceptable'
        else:
            tier = 'needs_review'

        return float(overall), tier

    async def score_translation(
        self,
        conn: asyncpg.Connection,
        translation_id: int
    ) -> Optional[QualityScore]:
        """Score a single translation"""

        # Get translation data
        trans = await conn.fetchrow("""
            SELECT
                t.id as translation_id,
                t.translator_id,
                t.text_id as source_text_id,
                t.translation,
                t.embedding,
                s.content as source_content
            FROM translations t
            JOIN source_texts s ON t.text_id = s.id
            WHERE t.id = $1
        """, translation_id)

        if not trans:
            return None

        # Get meaning anchor if available
        anchor = await conn.fetchrow("""
            SELECT anchor_embedding
            FROM meaning_anchors
            WHERE source_text_id = $1
        """, trans['source_text_id'])

        anchor_embedding = None
        if anchor and anchor['anchor_embedding']:
            anchor_val = anchor['anchor_embedding']
            if isinstance(anchor_val, str):
                anchor_val = anchor_val.strip('[]')
                anchor_embedding = np.array([float(x) for x in anchor_val.split(',')])
            else:
                anchor_embedding = np.array(anchor_val)

        # Get style residual if available
        residual = await conn.fetchrow("""
            SELECT residual
            FROM style_residuals
            WHERE translation_id = $1
        """, translation_id)

        style_residual = None
        if residual and residual['residual']:
            # Parse vector string if needed
            residual_val = residual['residual']
            if isinstance(residual_val, str):
                # Parse '[0.1,0.2,...]' format
                residual_val = residual_val.strip('[]')
                style_residual = np.array([float(x) for x in residual_val.split(',')])
            else:
                style_residual = np.array(residual_val)

        # Get translation embedding
        translation_embedding = None
        if trans['embedding']:
            emb_val = trans['embedding']
            if isinstance(emb_val, str):
                emb_val = emb_val.strip('[]')
                translation_embedding = np.array([float(x) for x in emb_val.split(',')])
            else:
                translation_embedding = np.array(emb_val)

        # Compute component scores
        meaning_score, meaning_details = self.compute_meaning_score(
            translation_embedding,
            anchor_embedding,
            trans['source_content'] or '',
            trans['translation'] or ''
        )

        style_score, style_details = self.compute_style_score(
            style_residual,
            None  # Centroid not needed for residual-based scoring
        )

        fluency_score, fluency_details = self.compute_fluency_score(
            trans['translation'] or ''
        )

        # Overall score
        overall_score, tier = self.compute_overall_score(
            meaning_score, style_score, fluency_score
        )

        return QualityScore(
            translation_id=translation_id,
            translator_id=trans['translator_id'],
            source_text_id=trans['source_text_id'],
            meaning_score=meaning_score,
            style_score=style_score,
            fluency_score=fluency_score,
            overall_score=overall_score,
            tier=tier,
            details={
                'meaning': meaning_details,
                'style': style_details,
                'fluency': fluency_details
            }
        )


async def score_translations_batch(
    sample_size: int = 500
) -> Dict[str, Any]:
    """Score a batch of translations and generate report"""

    logger.info("=" * 70)
    logger.info("TRANSLATION QUALITY SCORER")
    logger.info("=" * 70)

    scorer = TranslationQualityScorer()
    conn = await asyncpg.connect(DB_URL)

    try:
        # Get sample of translations
        translations = await conn.fetch("""
            SELECT t.id
            FROM translations t
            JOIN source_texts s ON t.text_id = s.id
            WHERE t.translation IS NOT NULL
              AND LENGTH(t.translation) > 50
            ORDER BY RANDOM()
            LIMIT $1
        """, sample_size)

        logger.info(f"Scoring {len(translations)} translations...")

        scores = []
        tier_counts = {'excellent': 0, 'good': 0, 'acceptable': 0, 'needs_review': 0}

        for i, t in enumerate(translations):
            if i % 100 == 0:
                logger.info(f"Progress: {i+1}/{len(translations)}")

            score = await scorer.score_translation(conn, t['id'])
            if score:
                scores.append(score)
                tier_counts[score.tier] += 1

        # Compute summary statistics
        if scores:
            meaning_scores = [s.meaning_score for s in scores]
            style_scores = [s.style_score for s in scores]
            fluency_scores = [s.fluency_score for s in scores]
            overall_scores = [s.overall_score for s in scores]

            summary = {
                'timestamp': datetime.now().isoformat(),
                'n_scored': len(scores),
                'tier_distribution': tier_counts,
                'avg_meaning_score': float(np.mean(meaning_scores)),
                'avg_style_score': float(np.mean(style_scores)),
                'avg_fluency_score': float(np.mean(fluency_scores)),
                'avg_overall_score': float(np.mean(overall_scores)),
                'std_overall_score': float(np.std(overall_scores)),
                'pass_rate': (tier_counts['excellent'] + tier_counts['good'] + tier_counts['acceptable']) / len(scores)
            }
        else:
            summary = {'error': 'No scores computed', 'n_scored': 0}

        # Store scores in database
        logger.info("Storing quality scores...")
        for score in scores:
            await conn.execute("""
                INSERT INTO translation_quality_scores
                (translation_id, meaning_score, style_score, fluency_score,
                 overall_score, quality_tier, details)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (translation_id) DO UPDATE SET
                    meaning_score = $2,
                    style_score = $3,
                    fluency_score = $4,
                    overall_score = $5,
                    quality_tier = $6,
                    details = $7
            """,
                score.translation_id,
                score.meaning_score,
                score.style_score,
                score.fluency_score,
                score.overall_score,
                score.tier,
                json.dumps(score.details)
            )

        # Generate report
        report = generate_quality_report(scores, summary)

        PAPERS_DIR.mkdir(parents=True, exist_ok=True)
        report_path = PAPERS_DIR / 'QUALITY_SCORER_REPORT.md'
        with open(report_path, 'w') as f:
            f.write(report)

        json_path = PAPERS_DIR / 'QUALITY_SCORER_REPORT.json'
        with open(json_path, 'w') as f:
            json.dump(summary, f, indent=2)

        logger.info(f"\nScored {len(scores)} translations")
        logger.info(f"Average overall score: {summary.get('avg_overall_score', 0):.3f}")
        logger.info(f"Tier distribution: {tier_counts}")
        logger.info(f"Reports saved to {PAPERS_DIR}")

        return summary

    finally:
        await conn.close()


def generate_quality_report(
    scores: List[QualityScore],
    summary: Dict[str, Any]
) -> str:
    """Generate markdown report for quality scoring"""

    tier_counts = summary.get('tier_distribution', {})

    report = f"""# Translation Quality Scorer Report

**Generated:** {datetime.now().isoformat()}

## Summary

| Metric | Value |
|:-------|------:|
| Translations scored | {summary.get('n_scored', 0)} |
| Average overall score | {summary.get('avg_overall_score', 0):.3f} |
| Std deviation | {summary.get('std_overall_score', 0):.3f} |
| Pass rate (acceptable+) | {summary.get('pass_rate', 0):.1%} |

## Component Scores

| Component | Average | Description |
|:----------|--------:|:------------|
| Meaning | {summary.get('avg_meaning_score', 0):.3f} | Semantic preservation (embeddings + proxies) |
| Style | {summary.get('avg_style_score', 0):.3f} | Consistency with translator's style |
| Fluency | {summary.get('avg_fluency_score', 0):.3f} | Sentence structure, punctuation, variety |

## Quality Tier Distribution

| Tier | Count | Percentage |
|:-----|------:|-----------:|
| Excellent | {tier_counts.get('excellent', 0)} | {tier_counts.get('excellent', 0) / max(1, len(scores)):.1%} |
| Good | {tier_counts.get('good', 0)} | {tier_counts.get('good', 0) / max(1, len(scores)):.1%} |
| Acceptable | {tier_counts.get('acceptable', 0)} | {tier_counts.get('acceptable', 0) / max(1, len(scores)):.1%} |
| Needs Review | {tier_counts.get('needs_review', 0)} | {tier_counts.get('needs_review', 0) / max(1, len(scores)):.1%} |

## Scoring Methodology

### Meaning Score (60% weight)
- Cosine similarity between translation embedding and meaning anchor
- Length ratio check (source vs translation word count)
- Number/entity preservation

### Fluency Score (25% weight)
- Average sentence length (ideal: 5-40 words)
- Punctuation balance (matching parentheses, quotes)
- Type-token ratio (word variety)

### Style Score (15% weight)
- Deviation from translator's style centroid
- Lower residual magnitude = higher consistency

### Overall Formula
```
overall = 0.60 × meaning + 0.25 × fluency + 0.15 × style
```

### Quality Tiers
- **Excellent**: overall >= 0.85 AND meaning >= 0.80
- **Good**: overall >= 0.70 AND meaning >= 0.65
- **Acceptable**: overall >= 0.50 AND meaning >= 0.50
- **Needs Review**: below acceptable thresholds

---

*Generated by quality_scorer.py*
"""

    return report


if __name__ == "__main__":
    result = asyncio.run(score_translations_batch(sample_size=500))
    print(f"\nScored {result.get('n_scored', 0)} translations")
    print(f"Average overall score: {result.get('avg_overall_score', 0):.3f}")
    print(f"Pass rate: {result.get('pass_rate', 0):.1%}")
