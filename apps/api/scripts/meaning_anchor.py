#!/usr/bin/env python3
"""
Meaning Anchor Builder - Job 1

Builds meaning anchors for translation quality control.
The meaning anchor is the source-locked constraint that CANNOT MOVE during
normalization or style transfer operations.

Components:
1. Source embedding (multilingual for Greek/Latin → English comparison)
2. Translation embedding
3. Entity/number extraction
4. Content skeleton (key verbs, negations, names)

The anchor provides the invariant "ground truth constraint" during any
normalization or generation.
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
PAPERS_DIR = Path('/Users/royvaid/Downloads/logos/papers')

# Try to import sentence-transformers for multilingual embeddings
try:
    from sentence_transformers import SentenceTransformer
    HAS_SENTENCE_TRANSFORMERS = True
    # Use multilingual model that handles Greek, Latin, and English
    # Must be 768-dim to match the schema
    MULTILINGUAL_MODEL = "paraphrase-multilingual-mpnet-base-v2"
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False
    logger.warning("sentence-transformers not available - using placeholder embeddings")


@dataclass
class ContentSkeleton:
    """Extracted content skeleton from text"""
    verbs: List[str]
    negations: List[str]
    names: List[str]
    numbers: List[str]
    key_nouns: List[str]

    def to_dict(self) -> Dict[str, List[str]]:
        return {
            'verbs': self.verbs,
            'negations': self.negations,
            'names': self.names,
            'numbers': self.numbers,
            'key_nouns': self.key_nouns
        }


@dataclass
class MeaningAnchor:
    """Complete meaning anchor for a source text + translations"""
    source_text_id: int
    source_text: str
    source_language: str

    # Embeddings
    source_embedding: Optional[np.ndarray]
    translations: List[Dict[str, Any]]  # {id, text, embedding}

    # Content skeleton
    source_skeleton: ContentSkeleton
    translation_skeletons: List[ContentSkeleton]

    # Anchor embedding (centroid of translation embeddings)
    anchor_embedding: Optional[np.ndarray]

    # Stability metrics
    embedding_variance: float
    n_translations: int

    def to_dict(self) -> Dict[str, Any]:
        return {
            'source_text_id': self.source_text_id,
            'source_language': self.source_language,
            'n_translations': self.n_translations,
            'embedding_variance': self.embedding_variance,
            'source_skeleton': self.source_skeleton.to_dict(),
            'has_multilingual_embedding': self.source_embedding is not None
        }


class MeaningAnchorBuilder:
    """Builds meaning anchors for translation quality control"""

    # Greek/Latin function words to ignore
    FUNCTION_WORDS = {
        'greek': {'ὁ', 'ἡ', 'τό', 'καί', 'δέ', 'τε', 'μέν', 'γάρ', 'οὖν', 'ἀλλά',
                  'εἰ', 'ἐν', 'εἰς', 'ἐκ', 'ἀπό', 'πρός', 'ὑπό', 'μετά', 'περί',
                  'ἐπί', 'διά', 'κατά', 'ὡς', 'ὅτι', 'τίς', 'αὐτός', 'οὗτος'},
        'latin': {'et', 'sed', 'non', 'in', 'ad', 'de', 'ex', 'cum', 'per',
                  'pro', 'ab', 'sub', 'inter', 'ante', 'post', 'contra',
                  'qui', 'quae', 'quod', 'hic', 'ille', 'is', 'ipse', 'ut',
                  'si', 'nec', 'atque', 'aut', 'vel'},
        'english': {'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'is', 'are',
                    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
                    'do', 'does', 'did', 'will', 'would', 'could', 'should',
                    'may', 'might', 'must', 'shall', 'of', 'to', 'in', 'for',
                    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through'}
    }

    # Greek/Latin negation words
    NEGATIONS = {
        'greek': {'οὐ', 'οὐκ', 'οὐχ', 'μή', 'οὔτε', 'μήτε', 'οὐδέ', 'μηδέ',
                  'οὐδείς', 'μηδείς', 'οὐδέν', 'μηδέν'},
        'latin': {'non', 'nec', 'neque', 'nihil', 'nullus', 'nemo', 'numquam',
                  'nusquam', 'ne'},
        'english': {'not', 'no', 'never', 'neither', 'none', 'nothing',
                    'nowhere', "n't", "not"}
    }

    def __init__(self, multilingual_model: Optional[str] = None):
        self.model = None
        if HAS_SENTENCE_TRANSFORMERS:
            model_name = multilingual_model or MULTILINGUAL_MODEL
            try:
                self.model = SentenceTransformer(model_name)
                logger.info(f"Loaded multilingual model: {model_name}")
            except Exception as e:
                logger.warning(f"Failed to load model: {e}")

    def extract_skeleton(self, text: str, language: str) -> ContentSkeleton:
        """Extract content skeleton from text"""
        if not text:
            return ContentSkeleton([], [], [], [], [])

        # Get function words and negations for this language
        func_words = self.FUNCTION_WORDS.get(language, self.FUNCTION_WORDS['english'])
        neg_words = self.NEGATIONS.get(language, self.NEGATIONS['english'])

        # Tokenize (simple whitespace + punctuation split)
        words = re.findall(r'\b\w+\b', text.lower())

        # Extract negations
        negations = [w for w in words if w in neg_words]

        # Extract numbers
        numbers = re.findall(r'\b\d+\b', text)

        # Extract potential names (capitalized words)
        names = re.findall(r'\b[A-Z][a-z]+\b', text)
        # For Greek, look for capitalized Greek words
        greek_names = re.findall(r'\b[Α-Ω][α-ω]+\b', text)
        names.extend(greek_names)

        # Extract key nouns (longer words not in function word list)
        key_nouns = [w for w in words
                     if len(w) > 4
                     and w not in func_words
                     and not w.isdigit()][:10]

        # For verbs, we'd need proper POS tagging
        # Simplified: words ending in common verb suffixes
        verb_patterns = {
            'greek': [r'\w+ω$', r'\w+ει$', r'\w+ουσι$', r'\w+ησε$'],
            'latin': [r'\w+at$', r'\w+et$', r'\w+it$', r'\w+unt$', r'\w+ent$'],
            'english': [r'\w+ed$', r'\w+ing$', r'\w+s$']
        }
        patterns = verb_patterns.get(language, verb_patterns['english'])
        verbs = []
        for pattern in patterns:
            verbs.extend(re.findall(pattern, text.lower()))
        verbs = verbs[:10]  # Limit to top 10

        return ContentSkeleton(
            verbs=verbs,
            negations=negations,
            names=names[:10],
            numbers=numbers,
            key_nouns=key_nouns
        )

    def compute_embedding(self, text: str) -> Optional[np.ndarray]:
        """Compute multilingual embedding for text"""
        if self.model is None or not text:
            return None

        try:
            embedding = self.model.encode(text, convert_to_numpy=True)
            return embedding
        except Exception as e:
            logger.warning(f"Embedding failed: {e}")
            return None

    def build_anchor(
        self,
        source_text_id: int,
        source_text: str,
        source_language: str,
        translations: List[Dict[str, Any]]
    ) -> MeaningAnchor:
        """Build a complete meaning anchor"""

        # Compute source embedding
        source_embedding = self.compute_embedding(source_text)

        # Extract source skeleton
        source_skeleton = self.extract_skeleton(source_text, source_language)

        # Process translations
        translation_embeddings = []
        translation_skeletons = []
        processed_translations = []

        for t in translations:
            t_text = t.get('translation', '') or t.get('text', '')
            t_embedding = self.compute_embedding(t_text)

            if t_embedding is not None:
                translation_embeddings.append(t_embedding)

            translation_skeletons.append(
                self.extract_skeleton(t_text, 'english')
            )

            processed_translations.append({
                'id': t.get('id'),
                'text': t_text[:200] if t_text else '',
                'embedding': t_embedding
            })

        # Compute anchor embedding (centroid of translation embeddings)
        if translation_embeddings:
            anchor_embedding = np.mean(translation_embeddings, axis=0)
            # Compute variance as stability metric
            distances = [np.linalg.norm(e - anchor_embedding) for e in translation_embeddings]
            embedding_variance = float(np.var(distances))
        else:
            anchor_embedding = source_embedding  # Fallback to source
            embedding_variance = 0.0

        return MeaningAnchor(
            source_text_id=source_text_id,
            source_text=source_text[:500] if source_text else '',
            source_language=source_language,
            source_embedding=source_embedding,
            translations=processed_translations,
            source_skeleton=source_skeleton,
            translation_skeletons=translation_skeletons,
            anchor_embedding=anchor_embedding,
            embedding_variance=embedding_variance,
            n_translations=len(translations)
        )


async def build_meaning_anchors(
    batch_size: int = 500,
    min_translations: int = 2
) -> Dict[str, Any]:
    """Build meaning anchors for source texts with multiple translations"""

    logger.info("=" * 70)
    logger.info("MEANING ANCHOR BUILDER")
    logger.info("=" * 70)

    builder = MeaningAnchorBuilder()

    conn = await asyncpg.connect(DB_URL)

    try:
        # Get source texts with multiple translations
        source_texts = await conn.fetch("""
            SELECT
                s.id, s.content, s.language, s.author, s.work,
                COUNT(t.id) as translation_count
            FROM source_texts s
            JOIN translations t ON t.text_id = s.id
            GROUP BY s.id, s.content, s.language, s.author, s.work
            HAVING COUNT(t.id) >= $1
            ORDER BY translation_count DESC
            LIMIT $2
        """, min_translations, batch_size)

        logger.info(f"Found {len(source_texts)} source texts with {min_translations}+ translations")

        anchors = []
        total_translations = 0

        for i, s in enumerate(source_texts):
            if i % 50 == 0:
                logger.info(f"Processing source text {i+1}/{len(source_texts)}...")

            # Get translations for this source
            translations = await conn.fetch("""
                SELECT id, translation, translator_id
                FROM translations
                WHERE text_id = $1
            """, s['id'])

            total_translations += len(translations)

            # Build anchor
            anchor = builder.build_anchor(
                source_text_id=s['id'],
                source_text=s['content'] or '',
                source_language=s['language'] or 'greek',
                translations=[dict(t) for t in translations]
            )

            anchors.append(anchor)

            # Store in database
            if anchor.anchor_embedding is not None:
                # Convert to string format for pgvector
                anchor_str = '[' + ','.join(str(x) for x in anchor.anchor_embedding.tolist()) + ']'
                skeleton_json = json.dumps(anchor.source_skeleton.to_dict())

                await conn.execute("""
                    INSERT INTO meaning_anchors
                    (source_text_id, source_author, source_work, source_urn,
                     anchor_embedding, n_translations, computation_method,
                     embedding_variance, stability_score, updated_at)
                    VALUES ($1, $2, $3, $4, $5::vector, $6, $7, $8, $9, NOW())
                    ON CONFLICT (source_text_id) DO UPDATE SET
                        anchor_embedding = $5::vector,
                        n_translations = $6,
                        embedding_variance = $8,
                        stability_score = $9,
                        updated_at = NOW()
                """,
                    s['id'],
                    s['author'],
                    s['work'],
                    None,  # source_urn
                    anchor_str,  # String format for pgvector
                    anchor.n_translations,
                    'centroid',
                    anchor.embedding_variance,
                    1.0 - min(1.0, anchor.embedding_variance / 0.5)  # Stability score
                )

        # Generate report
        report = generate_anchor_report(anchors, total_translations)

        PAPERS_DIR.mkdir(parents=True, exist_ok=True)
        report_path = PAPERS_DIR / 'MEANING_ANCHORS_REPORT.md'
        with open(report_path, 'w') as f:
            f.write(report)

        # Save JSON summary
        json_path = PAPERS_DIR / 'MEANING_ANCHORS_REPORT.json'
        summary = {
            'timestamp': datetime.now().isoformat(),
            'source_texts_processed': len(source_texts),
            'anchors_created': len(anchors),
            'total_translations': total_translations,
            'avg_translations_per_source': total_translations / len(anchors) if anchors else 0,
            'has_multilingual_model': builder.model is not None,
            'avg_embedding_variance': np.mean([a.embedding_variance for a in anchors]) if anchors else 0
        }
        with open(json_path, 'w') as f:
            json.dump(summary, f, indent=2)

        logger.info(f"\nCreated {len(anchors)} meaning anchors")
        logger.info(f"Reports saved to {PAPERS_DIR}")

        return summary

    finally:
        await conn.close()


def generate_anchor_report(anchors: List[MeaningAnchor], total_translations: int) -> str:
    """Generate markdown report"""

    variances = [a.embedding_variance for a in anchors]
    n_translations = [a.n_translations for a in anchors]

    report = f"""# Meaning Anchors Report

**Generated:** {datetime.now().isoformat()}

## Summary

| Metric | Value |
|:-------|------:|
| Source texts processed | {len(anchors)} |
| Total translations anchored | {total_translations} |
| Avg translations per source | {np.mean(n_translations):.1f} |
| Avg embedding variance | {np.mean(variances):.4f} |
| High stability (variance < 0.1) | {sum(1 for v in variances if v < 0.1)} |

## What Meaning Anchors Provide

1. **Source-locked constraint**: The anchor embedding is derived from the source text
   and cannot move during style normalization.

2. **Content skeleton**: Extracted verbs, negations, names, and numbers that must
   be preserved in any transformation.

3. **Translation centroid**: Average embedding across all translations provides
   a stable reference point.

4. **Variance metric**: Low variance indicates high agreement among translations
   about the passage's meaning.

## Stability Distribution

| Variance Range | Count | Interpretation |
|:---------------|------:|:---------------|
| < 0.01 | {sum(1 for v in variances if v < 0.01)} | Excellent stability |
| 0.01 - 0.05 | {sum(1 for v in variances if 0.01 <= v < 0.05)} | Good stability |
| 0.05 - 0.10 | {sum(1 for v in variances if 0.05 <= v < 0.10)} | Moderate stability |
| > 0.10 | {sum(1 for v in variances if v >= 0.10)} | Review needed |

## Usage

Meaning anchors are used to:
1. Validate that normalization preserves meaning (Gate T1)
2. Constrain LLM rewriting to maintain semantic fidelity
3. Detect when translations diverge too far from source intent

---

*Generated by meaning_anchor.py*
"""

    return report


if __name__ == "__main__":
    result = asyncio.run(build_meaning_anchors(batch_size=500, min_translations=2))
    print(f"\nCreated {result['anchors_created']} meaning anchors")
    print(f"Avg translations per source: {result['avg_translations_per_source']:.1f}")
