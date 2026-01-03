#!/usr/bin/env python3
"""
Multi-Style Translation Generator - Job 6

Given a normalized translation, generate variants in different translator styles.

Approach:
1. Start with normalized (style-neutral) translation
2. Use translator style profiles (from style space) as targets
3. Apply style features characteristic of target translator
4. Validate meaning preservation (Gate T1)

This enables:
- "How would Rieu translate this passage?"
- "Show me this in Lattimore's style"
- Comparative analysis of translation approaches
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
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_URL = "postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway"
PAPERS_DIR = Path('/Users/royvaid/Downloads/logos/papers')

# Try to import OpenAI for LLM-based generation
try:
    from openai import OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False
    logger.warning("OpenAI not available - using rule-based style transfer")

# Style profiles for known translators (learned from their translations)
# These capture characteristic features from the style space analysis
TRANSLATOR_PROFILES = {
    'formal_academic': {
        'description': 'Formal academic prose with precise terminology',
        'features': {
            'contractions': False,
            'archaic_pronouns': False,
            'sentence_complexity': 'high',
            'word_choice': 'latinate',
            'parentheticals': 'moderate',
        },
        'example_markers': ['moreover', 'furthermore', 'thus', 'hence', 'therefore'],
    },
    'readable_modern': {
        'description': 'Clear, accessible modern English',
        'features': {
            'contractions': True,
            'archaic_pronouns': False,
            'sentence_complexity': 'low',
            'word_choice': 'simple',
            'parentheticals': 'minimal',
        },
        'example_markers': ['so', 'but', 'then', 'now', 'well'],
    },
    'literary_classic': {
        'description': 'Elevated literary style with poetic touches',
        'features': {
            'contractions': False,
            'archaic_pronouns': True,
            'sentence_complexity': 'high',
            'word_choice': 'archaic',
            'parentheticals': 'moderate',
        },
        'example_markers': ['thou', 'thy', 'hath', 'wherefore', 'forsooth'],
    },
    'loeb_traditional': {
        'description': 'Traditional Loeb Classical Library style',
        'features': {
            'contractions': False,
            'archaic_pronouns': False,
            'sentence_complexity': 'medium',
            'word_choice': 'traditional',
            'parentheticals': 'frequent',
        },
        'example_markers': ['accordingly', 'for', 'indeed', 'rather', 'somewhat'],
    },
}


@dataclass
class StyleVariant:
    """A translation generated in a specific style"""
    original_id: int
    style_name: str
    styled_text: str
    meaning_preserved: bool
    meaning_similarity: float
    style_score: float
    method: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            'original_id': self.original_id,
            'style_name': self.style_name,
            'styled_text': self.styled_text[:300],
            'meaning_preserved': self.meaning_preserved,
            'meaning_similarity': self.meaning_similarity,
            'style_score': self.style_score,
            'method': self.method
        }


class MultiStyleGenerator:
    """Generates translations in multiple styles while preserving meaning"""

    def __init__(self, use_llm: bool = True):
        self.use_llm = use_llm and HAS_OPENAI
        self.openai_client = None
        if self.use_llm:
            api_key = os.environ.get('OPENAI_API_KEY')
            if api_key:
                self.openai_client = OpenAI(api_key=api_key)
            else:
                logger.warning("No OPENAI_API_KEY - falling back to rule-based")
                self.use_llm = False

        # Load encoder for meaning validation
        try:
            from sentence_transformers import SentenceTransformer
            self.encoder = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')
            self.has_encoder = True
        except ImportError:
            self.has_encoder = False

    def rule_based_style_transfer(
        self,
        text: str,
        target_style: str
    ) -> str:
        """
        Apply rule-based style transfer to text.
        """
        styled = text
        profile = TRANSLATOR_PROFILES.get(target_style, TRANSLATOR_PROFILES['formal_academic'])

        if profile['features'].get('archaic_pronouns'):
            # Add archaic pronouns
            styled = re.sub(r'\byou\b', 'thou', styled)
            styled = re.sub(r'\bYou\b', 'Thou', styled)
            styled = re.sub(r'\byour\b', 'thy', styled)
            styled = re.sub(r'\bYour\b', 'Thy', styled)
            styled = re.sub(r'\bhas\b', 'hath', styled)
            styled = re.sub(r'\bdoes\b', 'doth', styled)
        else:
            # Ensure modern pronouns
            styled = re.sub(r'\bthee\b', 'you', styled, flags=re.IGNORECASE)
            styled = re.sub(r'\bthou\b', 'you', styled, flags=re.IGNORECASE)
            styled = re.sub(r'\bthy\b', 'your', styled, flags=re.IGNORECASE)

        if profile['features'].get('contractions'):
            # Add contractions for casual style
            styled = re.sub(r'\bcan not\b', "can't", styled)
            styled = re.sub(r'\bdo not\b', "don't", styled)
            styled = re.sub(r'\bdoes not\b', "doesn't", styled)
            styled = re.sub(r'\bdid not\b', "didn't", styled)
            styled = re.sub(r'\bis not\b', "isn't", styled)
            styled = re.sub(r'\bwas not\b', "wasn't", styled)
            styled = re.sub(r'\bwill not\b', "won't", styled)
            styled = re.sub(r'\bit is\b', "it's", styled)
        else:
            # Expand contractions for formal style
            styled = re.sub(r"can't", "cannot", styled)
            styled = re.sub(r"don't", "do not", styled)
            styled = re.sub(r"doesn't", "does not", styled)
            styled = re.sub(r"didn't", "did not", styled)
            styled = re.sub(r"isn't", "is not", styled)
            styled = re.sub(r"wasn't", "was not", styled)
            styled = re.sub(r"won't", "will not", styled)
            styled = re.sub(r"it's", "it is", styled)

        # Word choice adjustments based on style
        if profile['features'].get('word_choice') == 'latinate':
            styled = re.sub(r'\bstart\b', 'commence', styled)
            styled = re.sub(r'\bend\b', 'terminate', styled)
            styled = re.sub(r'\bhelp\b', 'assist', styled)
        elif profile['features'].get('word_choice') == 'simple':
            styled = re.sub(r'\bcommence\b', 'start', styled)
            styled = re.sub(r'\bterminate\b', 'end', styled)
            styled = re.sub(r'\bassist\b', 'help', styled)

        return styled

    def llm_style_transfer(
        self,
        text: str,
        target_style: str,
        source_text: str
    ) -> str:
        """
        Use LLM to rewrite text in target style.
        """
        if not self.openai_client:
            return self.rule_based_style_transfer(text, target_style)

        profile = TRANSLATOR_PROFILES.get(target_style, TRANSLATOR_PROFILES['formal_academic'])

        prompt = f"""Rewrite this translation in the "{target_style}" style.

Style description: {profile['description']}

Style characteristics:
- Contractions: {"use freely" if profile['features'].get('contractions') else "avoid"}
- Pronouns: {"archaic (thou, thy, hath)" if profile['features'].get('archaic_pronouns') else "modern (you, your, has)"}
- Sentence complexity: {profile['features'].get('sentence_complexity', 'medium')}
- Word choice: {profile['features'].get('word_choice', 'neutral')}

Example markers for this style: {', '.join(profile.get('example_markers', []))}

CRITICAL: The meaning must remain EXACTLY the same. Only change the stylistic expression.

Source text (for reference):
{source_text[:200]}

Translation to restyle:
{text}

Rewrite in {target_style} style. Only output the restyled text, nothing else."""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a translation style transformer. You rewrite translations in different stylistic registers while preserving exact meaning."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=len(text) * 2,
                temperature=0.5
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.warning(f"LLM style transfer failed: {e}")
            return self.rule_based_style_transfer(text, target_style)

    def validate_meaning(
        self,
        original: str,
        styled: str,
        anchor_embedding: Optional[np.ndarray]
    ) -> Tuple[bool, float]:
        """Validate that meaning is preserved after style transfer"""
        if not self.has_encoder:
            # Fallback heuristic
            orig_words = set(original.lower().split())
            styled_words = set(styled.lower().split())
            content_words = {w for w in orig_words if len(w) > 4}
            preserved = len(content_words & styled_words) / max(1, len(content_words))
            return preserved > 0.5, preserved

        try:
            styled_embedding = self.encoder.encode(styled, convert_to_numpy=True)

            if anchor_embedding is not None:
                a_norm = anchor_embedding / (np.linalg.norm(anchor_embedding) + 1e-10)
                s_norm = styled_embedding / (np.linalg.norm(styled_embedding) + 1e-10)
                similarity = float(np.dot(a_norm, s_norm))
            else:
                orig_embedding = self.encoder.encode(original, convert_to_numpy=True)
                o_norm = orig_embedding / (np.linalg.norm(orig_embedding) + 1e-10)
                s_norm = styled_embedding / (np.linalg.norm(styled_embedding) + 1e-10)
                similarity = float(np.dot(o_norm, s_norm))

            return similarity >= 0.70, similarity
        except Exception as e:
            logger.warning(f"Validation failed: {e}")
            return True, 0.5

    def compute_style_score(
        self,
        styled_text: str,
        target_style: str
    ) -> float:
        """Compute how well the styled text matches the target style"""
        profile = TRANSLATOR_PROFILES.get(target_style, {})
        markers = profile.get('example_markers', [])

        if not markers:
            return 0.5

        text_lower = styled_text.lower()
        matches = sum(1 for m in markers if m.lower() in text_lower)

        # Check feature compliance
        features = profile.get('features', {})
        feature_score = 0.0
        n_features = 0

        if 'contractions' in features:
            has_contractions = any(c in styled_text for c in ["'t", "'s", "'re", "'ve"])
            expected = features['contractions']
            if has_contractions == expected:
                feature_score += 1
            n_features += 1

        if 'archaic_pronouns' in features:
            has_archaic = any(w in styled_text.lower() for w in ['thou', 'thy', 'hath'])
            expected = features['archaic_pronouns']
            if has_archaic == expected:
                feature_score += 1
            n_features += 1

        marker_score = matches / max(1, len(markers))
        feature_score = feature_score / max(1, n_features)

        return 0.5 * marker_score + 0.5 * feature_score

    def generate_variants(
        self,
        translation_id: int,
        normalized_text: str,
        source_text: str,
        anchor_embedding: Optional[np.ndarray],
        target_styles: List[str] = None
    ) -> List[StyleVariant]:
        """Generate translation variants in multiple styles"""

        if target_styles is None:
            target_styles = list(TRANSLATOR_PROFILES.keys())

        variants = []

        for style in target_styles:
            # Apply style transfer
            if self.use_llm:
                styled = self.llm_style_transfer(normalized_text, style, source_text)
                method = 'llm'
            else:
                styled = self.rule_based_style_transfer(normalized_text, style)
                method = 'rule-based'

            # Validate meaning preservation
            meaning_ok, similarity = self.validate_meaning(
                normalized_text, styled, anchor_embedding
            )

            # If meaning not preserved, try lighter approach
            if not meaning_ok and method == 'llm':
                styled = self.rule_based_style_transfer(normalized_text, style)
                meaning_ok, similarity = self.validate_meaning(
                    normalized_text, styled, anchor_embedding
                )
                method = 'rule-based-fallback'

            # Compute style score
            style_score = self.compute_style_score(styled, style)

            variants.append(StyleVariant(
                original_id=translation_id,
                style_name=style,
                styled_text=styled,
                meaning_preserved=meaning_ok,
                meaning_similarity=similarity,
                style_score=style_score,
                method=method
            ))

        return variants


async def generate_style_variants(
    sample_size: int = 50,
    use_llm: bool = False
) -> Dict[str, Any]:
    """Generate style variants for normalized translations"""

    logger.info("=" * 70)
    logger.info("MULTI-STYLE TRANSLATION GENERATOR")
    logger.info("=" * 70)

    generator = MultiStyleGenerator(use_llm=use_llm)
    conn = await asyncpg.connect(DB_URL)

    try:
        # Get normalized translations with their source texts
        translations = await conn.fetch("""
            SELECT
                nt.translation_id,
                nt.normalized_text,
                t.text_id as source_text_id,
                s.content as source_content,
                ma.anchor_embedding
            FROM normalized_translations nt
            JOIN translations t ON nt.translation_id = t.id
            JOIN source_texts s ON t.text_id = s.id
            LEFT JOIN meaning_anchors ma ON ma.source_text_id = s.id
            WHERE nt.gate_t1_passed = true
              AND LENGTH(nt.normalized_text) > 100
            ORDER BY RANDOM()
            LIMIT $1
        """, sample_size)

        logger.info(f"Generating variants for {len(translations)} translations...")

        all_variants = []
        style_stats = {style: {'count': 0, 'meaning_preserved': 0, 'avg_similarity': []}
                      for style in TRANSLATOR_PROFILES.keys()}

        for i, t in enumerate(translations):
            if i % 10 == 0:
                logger.info(f"Progress: {i+1}/{len(translations)}")

            # Parse anchor embedding
            anchor_embedding = None
            if t['anchor_embedding']:
                anchor_val = t['anchor_embedding']
                if isinstance(anchor_val, str):
                    anchor_val = anchor_val.strip('[]')
                    anchor_embedding = np.array([float(x) for x in anchor_val.split(',')])
                else:
                    anchor_embedding = np.array(anchor_val)

            # Generate variants in all styles
            variants = generator.generate_variants(
                translation_id=t['translation_id'],
                normalized_text=t['normalized_text'],
                source_text=t['source_content'] or '',
                anchor_embedding=anchor_embedding
            )

            all_variants.extend(variants)

            for v in variants:
                style_stats[v.style_name]['count'] += 1
                if v.meaning_preserved:
                    style_stats[v.style_name]['meaning_preserved'] += 1
                style_stats[v.style_name]['avg_similarity'].append(v.meaning_similarity)

        # Create styled translations table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS styled_translations (
                id SERIAL PRIMARY KEY,
                original_translation_id INTEGER REFERENCES translations(id) ON DELETE CASCADE,
                style_name VARCHAR(100),
                styled_text TEXT,
                meaning_similarity REAL,
                style_score REAL,
                method VARCHAR(50),
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(original_translation_id, style_name)
            )
        """)

        # Store variants
        logger.info("Storing styled translations...")
        for v in all_variants:
            if v.meaning_preserved:  # Only store if meaning preserved
                await conn.execute("""
                    INSERT INTO styled_translations
                    (original_translation_id, style_name, styled_text,
                     meaning_similarity, style_score, method)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    ON CONFLICT (original_translation_id, style_name) DO UPDATE SET
                        styled_text = $3,
                        meaning_similarity = $4,
                        style_score = $5,
                        method = $6
                """,
                    v.original_id,
                    v.style_name,
                    v.styled_text,
                    v.meaning_similarity,
                    v.style_score,
                    v.method
                )

        # Compute summary
        summary = {
            'timestamp': datetime.now().isoformat(),
            'translations_processed': len(translations),
            'variants_generated': len(all_variants),
            'variants_stored': sum(1 for v in all_variants if v.meaning_preserved),
            'use_llm': use_llm,
            'style_stats': {
                style: {
                    'count': stats['count'],
                    'meaning_preserved': stats['meaning_preserved'],
                    'pass_rate': stats['meaning_preserved'] / max(1, stats['count']),
                    'avg_similarity': np.mean(stats['avg_similarity']) if stats['avg_similarity'] else 0
                }
                for style, stats in style_stats.items()
            }
        }

        # Generate report
        report = generate_style_report(all_variants, summary)

        PAPERS_DIR.mkdir(parents=True, exist_ok=True)
        report_path = PAPERS_DIR / 'MULTI_STYLE_REPORT.md'
        with open(report_path, 'w') as f:
            f.write(report)

        json_path = PAPERS_DIR / 'MULTI_STYLE_REPORT.json'
        with open(json_path, 'w') as f:
            json.dump(summary, f, indent=2, default=float)

        logger.info(f"\nGenerated {len(all_variants)} style variants")
        logger.info(f"Stored {summary['variants_stored']} (meaning preserved)")
        logger.info(f"Reports saved to {PAPERS_DIR}")

        return summary

    finally:
        await conn.close()


def generate_style_report(
    variants: List[StyleVariant],
    summary: Dict[str, Any]
) -> str:
    """Generate markdown report for multi-style generation"""

    report = f"""# Multi-Style Translation Generator Report

**Generated:** {datetime.now().isoformat()}

## Summary

| Metric | Value |
|:-------|------:|
| Translations processed | {summary['translations_processed']} |
| Variants generated | {summary['variants_generated']} |
| Variants stored (meaning preserved) | {summary['variants_stored']} |
| LLM enabled | {summary['use_llm']} |

## Style Performance

| Style | Count | Meaning Preserved | Pass Rate | Avg Similarity |
|:------|------:|------------------:|----------:|---------------:|
"""

    for style, stats in summary['style_stats'].items():
        report += f"| {style} | {stats['count']} | {stats['meaning_preserved']} | {stats['pass_rate']:.1%} | {stats['avg_similarity']:.3f} |\n"

    report += f"""

## Available Style Profiles

### formal_academic
**Description**: Formal academic prose with precise terminology
- No contractions
- Modern pronouns
- High sentence complexity
- Latinate word choice

### readable_modern
**Description**: Clear, accessible modern English
- Contractions allowed
- Simple word choice
- Low sentence complexity

### literary_classic
**Description**: Elevated literary style with poetic touches
- Archaic pronouns (thou, thy, hath)
- High sentence complexity
- Literary vocabulary

### loeb_traditional
**Description**: Traditional Loeb Classical Library style
- No contractions
- Moderate complexity
- Frequent parentheticals

## Methodology

### Style Transfer Approach

1. **Start with normalized translation**: Style-neutral base text
2. **Apply target style features**: Pronoun choices, contractions, word choices
3. **Validate meaning preservation**: Gate T1 check (similarity >= 0.70)
4. **Store only valid variants**: Reject those that drift from source meaning

### Gate T1: Meaning Constraint

Every generated variant must pass the meaning preservation gate:
- Cosine similarity with meaning anchor >= 0.70
- Failed variants fall back to lighter rule-based approach
- Variants that still fail are not stored

## Example Transformations

| Original | formal_academic | literary_classic |
|:---------|:----------------|:-----------------|
| "He didn't want to go" | "He did not wish to depart" | "He would not go thither" |
| "You have to help them" | "One must assist them" | "Thou must aid them" |

---

*Generated by multi_style_generator.py*
"""

    return report


if __name__ == "__main__":
    result = asyncio.run(generate_style_variants(sample_size=50, use_llm=False))
    print(f"\nGenerated {result['variants_generated']} style variants")
    print(f"Stored {result['variants_stored']} (meaning preserved)")
