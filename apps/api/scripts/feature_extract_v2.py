#!/usr/bin/env python3
"""
================================================================================
ENHANCED FEATURE EXTRACTION V2
================================================================================

Implements the full feature set that tends to survive topic holdout:

1. Function word frequencies per 1000 tokens (base)
2. Sentence-level features (mean/std/median/range)
3. Punctuation/rhythm fingerprint
4. Function-word bigrams
5. Char 3-grams on function-words-only stream (content masked)

All features are designed to be meaning-invariant and capture true style.
================================================================================
"""

import re
import numpy as np
from collections import Counter
from typing import Dict, List, Tuple, Optional
import asyncio
import asyncpg
import os
import hashlib
import json
from datetime import datetime

DATABASE_URL = os.environ.get('DATABASE_URL', '')

# ============================================================================
# FUNCTION WORDS - The most reliable topic-invariant features
# ============================================================================

ENGLISH_FUNCTION_WORDS = [
    # Articles
    'the', 'a', 'an',
    # Prepositions
    'of', 'to', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'about',
    'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'under', 'without', 'within', 'along', 'among', 'upon',
    # Conjunctions
    'and', 'or', 'but', 'nor', 'yet', 'so', 'for', 'because', 'although',
    'while', 'if', 'unless', 'until', 'since', 'though', 'whether',
    # Auxiliary/Modal verbs
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am',
    'have', 'has', 'had', 'having',
    'do', 'does', 'did', 'doing',
    'will', 'would', 'shall', 'should',
    'may', 'might', 'must', 'can', 'could',
    # Pronouns
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'its', 'our', 'their',
    'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves',
    # Demonstratives/Relatives
    'this', 'that', 'these', 'those',
    'which', 'who', 'whom', 'whose', 'what', 'where', 'when', 'why', 'how',
    # Other function words
    'not', 'no', 'as', 'than', 'then', 'now', 'here', 'there',
    'very', 'more', 'most', 'just', 'even', 'also', 'only', 'too',
    'all', 'each', 'every', 'any', 'some', 'few', 'many', 'much',
    'one', 'other', 'such', 'own',
]

FUNCTION_WORD_SET = set(ENGLISH_FUNCTION_WORDS)

# Common function word bigrams (capture syntactic habits)
FUNCTION_BIGRAMS = [
    'of the', 'in the', 'to the', 'and the', 'on the', 'at the', 'by the',
    'for the', 'with the', 'from the', 'that the', 'but the',
    'of a', 'in a', 'to a', 'with a', 'as a', 'for a',
    'it is', 'it was', 'there is', 'there was', 'there are', 'there were',
    'he was', 'he is', 'she was', 'she is', 'they were', 'they are',
    'that he', 'that she', 'that it', 'that they', 'that we',
    'and he', 'and she', 'and it', 'and they', 'and we',
    'but he', 'but she', 'but it', 'but they',
    'if the', 'if he', 'if she', 'if it', 'if they',
    'as if', 'as though', 'so that', 'such as', 'so as',
    'would be', 'could be', 'should be', 'must be', 'might be',
    'would have', 'could have', 'should have', 'must have',
    'to be', 'to have', 'to do', 'to make', 'to see',
    'in order', 'as well', 'at least', 'at all', 'at once',
]


class FeatureExtractorV2:
    """
    Enhanced feature extraction with meaning-invariant style features.
    """

    def __init__(self):
        self.function_words = ENGLISH_FUNCTION_WORDS
        self.function_word_set = FUNCTION_WORD_SET
        self.function_bigrams = FUNCTION_BIGRAMS
        self.feature_names = self._build_feature_names()

    def _build_feature_names(self) -> List[str]:
        """Build list of all feature names."""
        names = []

        # Function word frequencies
        for fw in self.function_words:
            names.append(f'fw_{fw}')

        # Sentence features
        names.extend([
            'sent_len_mean', 'sent_len_std', 'sent_len_median',
            'sent_len_min', 'sent_len_max', 'sent_len_range',
        ])

        # Punctuation features
        names.extend([
            'punct_comma_rate', 'punct_semicolon_rate', 'punct_colon_rate',
            'punct_period_rate', 'punct_question_rate', 'punct_exclaim_rate',
            'punct_dash_rate', 'punct_quote_rate', 'punct_paren_rate',
            'punct_total_rate',
        ])

        # Function word bigrams
        for bg in self.function_bigrams:
            names.append(f'bg_{bg.replace(" ", "_")}')

        # Char 3-grams on masked text (top 50)
        # These will be computed dynamically but we reserve space
        for i in range(50):
            names.append(f'char3gram_{i}')

        return names

    def extract_features(self, text: str) -> Dict[str, float]:
        """
        Extract all features from a text.

        Args:
            text: Input text

        Returns:
            Dictionary of feature name -> value
        """
        features = {}

        # Tokenize
        words = text.lower().split()
        total_words = len(words) if words else 1

        # =====================================================================
        # 1. FUNCTION WORD FREQUENCIES (per 1000 tokens)
        # =====================================================================
        word_counts = Counter(words)
        for fw in self.function_words:
            freq = word_counts.get(fw, 0) / total_words * 1000
            features[f'fw_{fw}'] = freq

        # =====================================================================
        # 2. SENTENCE-LEVEL FEATURES
        # =====================================================================
        # Split into sentences (simple heuristic)
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]

        if sentences:
            sent_lengths = [len(s.split()) for s in sentences]
            features['sent_len_mean'] = np.mean(sent_lengths)
            features['sent_len_std'] = np.std(sent_lengths)
            features['sent_len_median'] = np.median(sent_lengths)
            features['sent_len_min'] = min(sent_lengths)
            features['sent_len_max'] = max(sent_lengths)
            features['sent_len_range'] = max(sent_lengths) - min(sent_lengths)
        else:
            for key in ['sent_len_mean', 'sent_len_std', 'sent_len_median',
                        'sent_len_min', 'sent_len_max', 'sent_len_range']:
                features[key] = 0.0

        # =====================================================================
        # 3. PUNCTUATION/RHYTHM FINGERPRINT
        # =====================================================================
        total_chars = len(text) if text else 1

        # Count punctuation marks
        features['punct_comma_rate'] = text.count(',') / total_chars * 1000
        features['punct_semicolon_rate'] = text.count(';') / total_chars * 1000
        features['punct_colon_rate'] = text.count(':') / total_chars * 1000
        features['punct_period_rate'] = text.count('.') / total_chars * 1000
        features['punct_question_rate'] = text.count('?') / total_chars * 1000
        features['punct_exclaim_rate'] = text.count('!') / total_chars * 1000
        features['punct_dash_rate'] = (text.count('-') + text.count('—') + text.count('–')) / total_chars * 1000
        features['punct_quote_rate'] = (text.count('"') + text.count("'") + text.count('"') + text.count('"')) / total_chars * 1000
        features['punct_paren_rate'] = (text.count('(') + text.count(')')) / total_chars * 1000
        features['punct_total_rate'] = sum([
            features['punct_comma_rate'], features['punct_semicolon_rate'],
            features['punct_colon_rate'], features['punct_period_rate'],
            features['punct_question_rate'], features['punct_exclaim_rate'],
            features['punct_dash_rate']
        ])

        # =====================================================================
        # 4. FUNCTION WORD BIGRAMS
        # =====================================================================
        bigram_counts = Counter()
        for i in range(len(words) - 1):
            bigram = f"{words[i]} {words[i+1]}"
            if bigram in self.function_bigrams:
                bigram_counts[bigram] += 1

        for bg in self.function_bigrams:
            freq = bigram_counts.get(bg, 0) / total_words * 1000
            features[f'bg_{bg.replace(" ", "_")}'] = freq

        # =====================================================================
        # 5. CHAR 3-GRAMS ON FUNCTION-WORDS-ONLY TEXT
        # =====================================================================
        # Create masked text: replace content words with placeholder
        masked_words = []
        for word in words:
            if word in self.function_word_set:
                masked_words.append(word)
            else:
                masked_words.append('_')

        masked_text = ' '.join(masked_words)

        # Extract char 3-grams
        char3_counts = Counter()
        for i in range(len(masked_text) - 2):
            trigram = masked_text[i:i+3]
            char3_counts[trigram] += 1

        # Normalize by text length
        total_trigrams = len(masked_text) - 2 if len(masked_text) > 2 else 1

        # Get top 50 trigrams and create features
        # For consistency, we use a fixed set of common trigrams
        common_char3grams = [
            'the', 'he ', ' th', 'nd ', 'and', ' an', 'of ', ' of', 'to ',
            ' to', 'in ', ' in', 'a _', '_ _', '_  ', '  _', ' _ ', 'is ',
            ' is', 'it ', ' it', 'at ', ' at', 'on ', ' on', 'or ', ' or',
            'as ', ' as', 'be ', ' be', 'was', 'for', ' fo', 'his', ' hi',
            'hat', 'tha', 'not', ' no', 'but', ' bu', 'wit', ' wi', 'ere',
            'her', 'you', ' yo', 'all', ' al', 'ave', 'hav', ' ha',
        ]

        for i, tg in enumerate(common_char3grams[:50]):
            features[f'char3gram_{i}'] = char3_counts.get(tg, 0) / total_trigrams * 1000

        # Fill remaining with zeros
        for i in range(len(common_char3grams), 50):
            features[f'char3gram_{i}'] = 0.0

        return features

    def extract_features_vector(self, text: str) -> np.ndarray:
        """Extract features as a numpy vector."""
        features = self.extract_features(text)
        return np.array([features.get(name, 0.0) for name in self.feature_names])

    def get_feature_names(self) -> List[str]:
        """Get ordered list of feature names."""
        return self.feature_names


async def extract_and_store_features(
    pool: asyncpg.Pool,
    config_hash: str = None,
    limit: int = None
):
    """
    Extract features from all translations and store in DB.

    Args:
        pool: Database connection pool
        config_hash: Unique identifier for this feature config
        limit: Optional limit on number of translations to process
    """
    extractor = FeatureExtractorV2()

    if config_hash is None:
        config_hash = hashlib.md5(
            json.dumps({
                'version': 'v2',
                'function_words': len(extractor.function_words),
                'bigrams': len(extractor.function_bigrams),
                'timestamp': datetime.now().isoformat()
            }).encode()
        ).hexdigest()[:16]

    async with pool.acquire() as conn:
        # Check if table exists, create if not
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS stylometric_features_v2 (
                id SERIAL PRIMARY KEY,
                translation_id INTEGER REFERENCES translations(id),
                translator_id INTEGER,
                config_hash TEXT,
                features FLOAT8[],
                feature_names TEXT[],
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)

        # Create indexes
        await conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_stylometric_v2_config
            ON stylometric_features_v2(config_hash)
        """)

        # Get translations
        query = """
            SELECT tr.id, tr.translation, t.id as translator_id, t.name
            FROM translations tr
            JOIN translators t ON tr.translator_id = t.id
            WHERE tr.translation IS NOT NULL
              AND LENGTH(tr.translation) > 200
              AND t.name != 'Loeb Translator'
        """
        if limit:
            query += f" LIMIT {limit}"

        rows = await conn.fetch(query)
        print(f"Extracting features for {len(rows)} translations...")

        # Extract and store
        batch_size = 100
        for i in range(0, len(rows), batch_size):
            batch = rows[i:i+batch_size]
            values = []

            for r in batch:
                features = extractor.extract_features_vector(r['translation'])
                values.append((
                    r['id'],
                    r['translator_id'],
                    config_hash,
                    features.tolist(),
                    extractor.feature_names
                ))

            await conn.executemany("""
                INSERT INTO stylometric_features_v2
                (translation_id, translator_id, config_hash, features, feature_names)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT DO NOTHING
            """, values)

            if (i + batch_size) % 500 == 0:
                print(f"  Processed {i + batch_size}/{len(rows)}...")

    print(f"\nFeatures stored with config_hash: {config_hash}")
    print(f"Feature vector dimension: {len(extractor.feature_names)}")

    return config_hash, extractor.feature_names


async def main():
    """Test feature extraction."""
    pool = await asyncpg.create_pool(DATABASE_URL)

    # Test on a sample text
    extractor = FeatureExtractorV2()

    sample_text = """
    The quick brown fox jumped over the lazy dog. It was a beautiful day,
    and the sun was shining brightly. He thought to himself that this
    was indeed the best of times; however, it could also be the worst
    of times. What would happen next? No one could say for certain.
    """

    features = extractor.extract_features(sample_text)

    print("Sample feature extraction:")
    print(f"  Total features: {len(features)}")
    print(f"  Function words: {sum(1 for k in features if k.startswith('fw_'))}")
    print(f"  Sentence features: {sum(1 for k in features if k.startswith('sent_'))}")
    print(f"  Punctuation features: {sum(1 for k in features if k.startswith('punct_'))}")
    print(f"  Bigram features: {sum(1 for k in features if k.startswith('bg_'))}")
    print(f"  Char3gram features: {sum(1 for k in features if k.startswith('char3gram_'))}")

    print("\nTop 10 non-zero features:")
    sorted_features = sorted(features.items(), key=lambda x: -x[1])
    for name, val in sorted_features[:10]:
        print(f"  {name}: {val:.3f}")

    # Extract and store all features
    print("\n" + "=" * 60)
    print("Extracting features for all translations...")
    config_hash, feature_names = await extract_and_store_features(pool)

    print(f"\nDone! Config hash: {config_hash}")

    await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
