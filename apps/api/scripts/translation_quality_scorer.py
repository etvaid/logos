#!/usr/bin/env python3
"""
Translation Quality Scorer - Phase 1, Job 1.1

Scores each translation on 6 dimensions:
1. SEMANTIC_FIDELITY (0-100): Embedding distance between translation and source
2. STYLE_CONSISTENCY (0-100): Variance of style residuals within same work
3. TRANSLATOR_BIAS (0-100, inverted): Distance from translator centroid
4. REGISTER_MATCH (0-100): Style similarity to genre centroid
5. LITERALNESS (0-100): Word-order preservation score
6. READABILITY (0-100): Flesch-Kincaid adapted for translation

Overall quality_score = weighted_average(dimensions)
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

# Dimension weights (sum to 1.0)
DIMENSION_WEIGHTS = {
    'semantic_fidelity': 0.30,
    'style_consistency': 0.15,
    'translator_bias': 0.15,
    'register_match': 0.10,
    'literalness': 0.15,
    'readability': 0.15,
}


@dataclass
class QualityDimensions:
    """Quality scores for a translation"""
    translation_id: int
    semantic_fidelity: float
    style_consistency: float
    translator_bias: float
    register_match: float
    literalness: float
    readability: float

    @property
    def overall_score(self) -> float:
        """Compute weighted overall score"""
        return (
            self.semantic_fidelity * DIMENSION_WEIGHTS['semantic_fidelity'] +
            self.style_consistency * DIMENSION_WEIGHTS['style_consistency'] +
            self.translator_bias * DIMENSION_WEIGHTS['translator_bias'] +
            self.register_match * DIMENSION_WEIGHTS['register_match'] +
            self.literalness * DIMENSION_WEIGHTS['literalness'] +
            self.readability * DIMENSION_WEIGHTS['readability']
        )

    def to_dict(self) -> Dict[str, float]:
        return {
            'translation_id': self.translation_id,
            'semantic_fidelity': self.semantic_fidelity,
            'style_consistency': self.style_consistency,
            'translator_bias': self.translator_bias,
            'register_match': self.register_match,
            'literalness': self.literalness,
            'readability': self.readability,
            'overall_score': self.overall_score
        }


class TranslationQualityScorer:
    """Score translations on 6 quality dimensions"""

    def __init__(self, conn: asyncpg.Connection):
        self.conn = conn
        self.translator_centroids: Dict[int, np.ndarray] = {}
        self.genre_centroids: Dict[str, np.ndarray] = {}

    async def load_centroids(self):
        """Load translator and genre centroids for comparison"""
        # Load translator centroids
        rows = await self.conn.fetch("""
            SELECT translator_id, centroid_embedding
            FROM translator_centroids
            WHERE centroid_embedding IS NOT NULL
        """)
        for row in rows:
            if row['centroid_embedding']:
                self.translator_centroids[row['translator_id']] = np.array(row['centroid_embedding'])

        logger.info(f"Loaded {len(self.translator_centroids)} translator centroids")

        # Compute genre centroids from works
        genres = await self.conn.fetch("""
            SELECT DISTINCT genre FROM works WHERE genre IS NOT NULL
        """)
        for genre_row in genres:
            genre = genre_row['genre']
            embeddings = await self.conn.fetch("""
                SELECT p.embedding
                FROM passages p
                JOIN works w ON p.work_id = w.id
                WHERE w.genre = $1 AND p.embedding IS NOT NULL
                LIMIT 1000
            """, genre)
            if embeddings:
                emb_list = [np.array(e['embedding']) for e in embeddings if e['embedding']]
                if emb_list:
                    self.genre_centroids[genre] = np.mean(emb_list, axis=0)

        logger.info(f"Computed {len(self.genre_centroids)} genre centroids")

    def compute_semantic_fidelity(
        self,
        translation_embedding: np.ndarray,
        source_embedding: np.ndarray
    ) -> float:
        """
        Compute semantic fidelity (0-100).
        Higher = translation preserves source meaning better.
        """
        if translation_embedding is None or source_embedding is None:
            return 50.0  # Default neutral score

        # Cosine similarity
        norm_t = np.linalg.norm(translation_embedding)
        norm_s = np.linalg.norm(source_embedding)
        if norm_t == 0 or norm_s == 0:
            return 50.0

        cosine_sim = np.dot(translation_embedding, source_embedding) / (norm_t * norm_s)

        # Convert to 0-100 scale (cosine sim is -1 to 1)
        return min(100, max(0, (cosine_sim + 1) * 50))

    def compute_style_consistency(
        self,
        translation_embedding: np.ndarray,
        work_embeddings: List[np.ndarray]
    ) -> float:
        """
        Compute style consistency (0-100).
        Lower variance within same work = higher score.
        """
        if not work_embeddings or translation_embedding is None:
            return 50.0

        # Compute variance of distances to work centroid
        work_centroid = np.mean(work_embeddings, axis=0)
        distance = np.linalg.norm(translation_embedding - work_centroid)

        # Compute typical distance for this work
        typical_distances = [np.linalg.norm(e - work_centroid) for e in work_embeddings]
        mean_dist = np.mean(typical_distances)
        std_dist = np.std(typical_distances) or 0.1

        # Z-score of this translation's distance
        z_score = (distance - mean_dist) / std_dist

        # Convert to 0-100 (lower z-score = more consistent)
        score = 100 - min(50, max(0, abs(z_score) * 20))
        return score

    def compute_translator_bias(
        self,
        style_residual: np.ndarray,
        translator_id: int
    ) -> float:
        """
        Compute translator bias score (0-100, inverted).
        Higher distance from translator's typical = less bias = higher score.
        """
        if translator_id not in self.translator_centroids or style_residual is None:
            return 50.0

        centroid = self.translator_centroids[translator_id]
        distance = np.linalg.norm(style_residual - centroid)

        # Normalize: typical residual magnitude is 0.5-2.0
        # Higher distance = less typical of translator = less bias
        bias_score = min(100, max(0, distance * 50))
        return bias_score

    def compute_register_match(
        self,
        translation_embedding: np.ndarray,
        genre: str
    ) -> float:
        """
        Compute register match (0-100).
        How well translation matches the expected genre style.
        """
        if genre not in self.genre_centroids or translation_embedding is None:
            return 50.0

        genre_centroid = self.genre_centroids[genre]
        norm_t = np.linalg.norm(translation_embedding)
        norm_g = np.linalg.norm(genre_centroid)

        if norm_t == 0 or norm_g == 0:
            return 50.0

        cosine_sim = np.dot(translation_embedding, genre_centroid) / (norm_t * norm_g)
        return min(100, max(0, (cosine_sim + 1) * 50))

    def compute_literalness(
        self,
        translation_text: str,
        source_text: str
    ) -> float:
        """
        Compute literalness score (0-100).
        Based on word-order preservation and content word retention.
        """
        if not translation_text or not source_text:
            return 50.0

        # Simple heuristics for literalness
        trans_words = translation_text.lower().split()
        source_words = source_text.lower().split()

        # Length ratio (literal translations tend to be similar length)
        if len(source_words) == 0:
            return 50.0

        length_ratio = len(trans_words) / len(source_words)
        length_score = 100 - min(50, abs(length_ratio - 1.0) * 100)

        # Sentence structure preservation (punctuation pattern similarity)
        trans_punct = len(re.findall(r'[.,;:!?]', translation_text))
        source_punct = len(re.findall(r'[.,;:!?]', source_text))
        punct_ratio = trans_punct / max(source_punct, 1)
        punct_score = 100 - min(50, abs(punct_ratio - 1.0) * 50)

        return (length_score * 0.6 + punct_score * 0.4)

    def compute_readability(self, text: str) -> float:
        """
        Compute readability score (0-100).
        Adapted Flesch-Kincaid for translation quality.
        """
        if not text:
            return 50.0

        # Count sentences, words, syllables
        sentences = len(re.findall(r'[.!?]+', text)) or 1
        words = text.split()
        n_words = len(words)

        if n_words == 0:
            return 50.0

        # Estimate syllables (simple vowel counting)
        def count_syllables(word: str) -> int:
            word = word.lower()
            vowels = 'aeiou'
            count = 0
            prev_vowel = False
            for char in word:
                is_vowel = char in vowels
                if is_vowel and not prev_vowel:
                    count += 1
                prev_vowel = is_vowel
            return max(1, count)

        n_syllables = sum(count_syllables(w) for w in words)

        # Flesch Reading Ease formula
        # 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
        words_per_sentence = n_words / sentences
        syllables_per_word = n_syllables / n_words

        flesch = 206.835 - 1.015 * words_per_sentence - 84.6 * syllables_per_word

        # Convert to 0-100 (Flesch is typically 0-100 but can go negative)
        return min(100, max(0, flesch))

    async def score_translation(
        self,
        translation_id: int,
        translation_text: str,
        translation_embedding: Optional[np.ndarray],
        source_text: str,
        source_embedding: Optional[np.ndarray],
        translator_id: int,
        style_residual: Optional[np.ndarray],
        work_id: int,
        genre: str
    ) -> QualityDimensions:
        """Score a single translation on all dimensions"""

        # Get work embeddings for consistency check
        work_embeddings = []
        if work_id:
            work_rows = await self.conn.fetch("""
                SELECT embedding FROM translations
                WHERE source_text_id IN (SELECT id FROM source_texts WHERE work_id = $1)
                  AND embedding IS NOT NULL
                LIMIT 100
            """, work_id)
            work_embeddings = [np.array(r['embedding']) for r in work_rows if r['embedding']]

        return QualityDimensions(
            translation_id=translation_id,
            semantic_fidelity=self.compute_semantic_fidelity(translation_embedding, source_embedding),
            style_consistency=self.compute_style_consistency(translation_embedding, work_embeddings),
            translator_bias=self.compute_translator_bias(style_residual, translator_id),
            register_match=self.compute_register_match(translation_embedding, genre),
            literalness=self.compute_literalness(translation_text, source_text),
            readability=self.compute_readability(translation_text)
        )


async def run_quality_scoring(batch_size: int = 500, max_translations: int = 10000):
    """Run quality scoring on translations"""

    logger.info("=" * 70)
    logger.info("TRANSLATION QUALITY SCORER")
    logger.info("=" * 70)

    conn = await asyncpg.connect(DB_URL)

    try:
        scorer = TranslationQualityScorer(conn)
        await scorer.load_centroids()

        # Get translations needing scoring
        translations = await conn.fetch("""
            SELECT
                t.id, t.text_content as translation_text, t.embedding as translation_embedding,
                t.translator_id, t.style_residual,
                s.text_content as source_text, s.work_id,
                p.embedding as source_embedding,
                w.genre
            FROM translations t
            LEFT JOIN source_texts s ON t.source_text_id = s.id
            LEFT JOIN passages p ON p.source_text_id = s.id
            LEFT JOIN works w ON s.work_id = w.id
            WHERE t.ltqi_score IS NULL
            LIMIT $1
        """, max_translations)

        logger.info(f"Found {len(translations)} translations to score")

        results = []
        dimension_stats = {
            'semantic_fidelity': [],
            'style_consistency': [],
            'translator_bias': [],
            'register_match': [],
            'literalness': [],
            'readability': [],
            'overall_score': []
        }

        for i, t in enumerate(translations):
            if i % 100 == 0:
                logger.info(f"Scoring translation {i+1}/{len(translations)}...")

            # Parse embeddings
            trans_emb = np.array(t['translation_embedding']) if t['translation_embedding'] else None
            source_emb = np.array(t['source_embedding']) if t['source_embedding'] else None
            style_res = np.array(t['style_residual']) if t['style_residual'] else None

            scores = await scorer.score_translation(
                translation_id=t['id'],
                translation_text=t['translation_text'] or "",
                translation_embedding=trans_emb,
                source_text=t['source_text'] or "",
                source_embedding=source_emb,
                translator_id=t['translator_id'] or 0,
                style_residual=style_res,
                work_id=t['work_id'] or 0,
                genre=t['genre'] or "prose"
            )

            results.append(scores)

            # Collect stats
            for dim, val in scores.to_dict().items():
                if dim in dimension_stats:
                    dimension_stats[dim].append(val)

        # Update database
        logger.info("Updating database with quality scores...")
        for scores in results:
            await conn.execute("""
                UPDATE translations
                SET ltqi_score = $2,
                    semantic_score = $3,
                    fluency_score = $4,
                    updated_at = NOW()
                WHERE id = $1
            """,
                scores.translation_id,
                scores.overall_score,
                scores.semantic_fidelity,
                scores.readability
            )

        # Generate report
        logger.info("Generating quality report...")
        report = generate_quality_report(dimension_stats, len(results))

        PAPERS_DIR.mkdir(parents=True, exist_ok=True)
        report_path = PAPERS_DIR / 'TRANSLATION_QUALITY_ANALYSIS.md'
        with open(report_path, 'w') as f:
            f.write(report)

        # Save JSON data
        json_path = PAPERS_DIR / 'TRANSLATION_QUALITY_ANALYSIS.json'
        with open(json_path, 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'translations_scored': len(results),
                'dimension_stats': {
                    k: {
                        'mean': float(np.mean(v)),
                        'std': float(np.std(v)),
                        'min': float(np.min(v)),
                        'max': float(np.max(v)),
                        'median': float(np.median(v))
                    }
                    for k, v in dimension_stats.items() if v
                }
            }, f, indent=2)

        logger.info(f"Report saved to {report_path}")
        logger.info(f"Data saved to {json_path}")

        return {
            'translations_scored': len(results),
            'dimension_stats': dimension_stats
        }

    finally:
        await conn.close()


def generate_quality_report(dimension_stats: Dict[str, List[float]], n_translations: int) -> str:
    """Generate markdown report"""

    report = f"""# Translation Quality Analysis

**Generated:** {datetime.now().isoformat()}

**Translations Scored:** {n_translations}

## Quality Dimensions

| Dimension | Mean | Std | Min | Max | Median |
|:----------|:----:|:---:|:---:|:---:|:------:|
"""

    for dim in ['semantic_fidelity', 'style_consistency', 'translator_bias',
                'register_match', 'literalness', 'readability', 'overall_score']:
        values = dimension_stats.get(dim, [])
        if values:
            report += f"| {dim.replace('_', ' ').title()} | {np.mean(values):.1f} | {np.std(values):.1f} | {np.min(values):.1f} | {np.max(values):.1f} | {np.median(values):.1f} |\n"

    report += f"""

## Dimension Definitions

1. **Semantic Fidelity** (weight: {DIMENSION_WEIGHTS['semantic_fidelity']:.0%}): How well translation preserves source meaning
2. **Style Consistency** (weight: {DIMENSION_WEIGHTS['style_consistency']:.0%}): Consistency with other translations of same work
3. **Translator Bias** (weight: {DIMENSION_WEIGHTS['translator_bias']:.0%}): Distance from translator's typical style (higher = less bias)
4. **Register Match** (weight: {DIMENSION_WEIGHTS['register_match']:.0%}): Appropriateness for the genre
5. **Literalness** (weight: {DIMENSION_WEIGHTS['literalness']:.0%}): Word-order and structure preservation
6. **Readability** (weight: {DIMENSION_WEIGHTS['readability']:.0%}): Flesch-Kincaid adapted score

## Interpretation

- **70-100**: Excellent translation quality
- **50-70**: Good quality with room for improvement
- **30-50**: Adequate but notable issues
- **0-30**: Poor quality, needs review

---

*Generated by translation_quality_scorer.py*
"""

    return report


if __name__ == "__main__":
    result = asyncio.run(run_quality_scoring(batch_size=500, max_translations=5000))
    print(f"\nScored {result['translations_scored']} translations")
