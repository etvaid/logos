#!/usr/bin/env python3
"""
Topic-Invariant Translator Style Space - Job 2

Builds a style feature space that discriminates translators while being
invariant to confounding factors (author, work, genre, time period).

Approach:
1. Extract style features from translations (function words, punctuation,
   sentence stats, function-word bigrams, masked char 3-grams)
2. Compute F-statistic for each feature against translator (target)
3. Compute F-statistic for each feature against confounds
4. Adversarial score = F_translator - penalty * max(F_confound)
5. Select top N features with highest adversarial score

These features form the "style-only fingerprint" that identifies a translator
independent of what they translate.
"""

import asyncio
import asyncpg
import numpy as np
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from collections import Counter, defaultdict
import json
import re
import logging
from pathlib import Path
from scipy import stats

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_URL = "postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway"
PAPERS_DIR = Path('/Users/royvaid/Downloads/logos/papers')

# English function words for style analysis
FUNCTION_WORDS = [
    # Articles
    'the', 'a', 'an',
    # Pronouns
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs',
    'this', 'that', 'these', 'those', 'who', 'whom', 'which', 'what', 'whose',
    # Prepositions
    'in', 'on', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up',
    'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
    # Conjunctions
    'and', 'but', 'or', 'nor', 'for', 'yet', 'so', 'because', 'although', 'while',
    'if', 'unless', 'until', 'when', 'where', 'whether', 'as', 'than',
    # Auxiliaries
    'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'having',
    'do', 'does', 'did', 'doing',
    'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could',
    # Other common function words
    'not', 'no', 'yes', 'very', 'just', 'only', 'also', 'even', 'still', 'already',
    'now', 'here', 'there', 'how', 'why', 'all', 'each', 'every', 'both', 'few',
    'more', 'most', 'other', 'some', 'such', 'any', 'many', 'much',
]

# Common function word bigrams
FUNCTION_BIGRAMS = [
    ('of', 'the'), ('in', 'the'), ('to', 'the'), ('and', 'the'), ('for', 'the'),
    ('on', 'the'), ('with', 'the'), ('at', 'the'), ('by', 'the'), ('from', 'the'),
    ('it', 'is'), ('there', 'is'), ('this', 'is'), ('that', 'is'), ('it', 'was'),
    ('he', 'was'), ('she', 'was'), ('they', 'were'), ('i', 'am'), ('you', 'are'),
    ('will', 'be'), ('would', 'be'), ('has', 'been'), ('have', 'been'),
    ('do', 'not'), ('does', 'not'), ('did', 'not'), ('is', 'not'), ('was', 'not'),
    ('if', 'you'), ('when', 'you'), ('as', 'if'), ('so', 'that'), ('in', 'order'),
]


@dataclass
class StyleFeatures:
    """Style features extracted from a translation"""
    translation_id: int
    translator_id: int
    author: str
    work: str
    genre: str

    # Function word frequencies (normalized)
    function_word_freqs: Dict[str, float]

    # Function word bigram frequencies
    bigram_freqs: Dict[str, float]

    # Punctuation frequencies
    punctuation_freqs: Dict[str, float]

    # Sentence statistics
    avg_sentence_length: float
    sentence_length_std: float
    avg_word_length: float

    # Character n-gram frequencies (masked)
    char_trigram_freqs: Dict[str, float]

    def to_vector(self, feature_names: List[str]) -> np.ndarray:
        """Convert to feature vector using specified feature names"""
        vector = []
        for name in feature_names:
            if name.startswith('fw_'):
                word = name[3:]
                vector.append(self.function_word_freqs.get(word, 0.0))
            elif name.startswith('bg_'):
                bigram = name[3:]
                vector.append(self.bigram_freqs.get(bigram, 0.0))
            elif name.startswith('punc_'):
                punc = name[5:]
                vector.append(self.punctuation_freqs.get(punc, 0.0))
            elif name.startswith('sent_'):
                if name == 'sent_avg_len':
                    vector.append(self.avg_sentence_length)
                elif name == 'sent_std_len':
                    vector.append(self.sentence_length_std)
                elif name == 'sent_avg_word':
                    vector.append(self.avg_word_length)
            elif name.startswith('cg_'):
                trigram = name[3:]
                vector.append(self.char_trigram_freqs.get(trigram, 0.0))
            else:
                vector.append(0.0)
        return np.array(vector)


@dataclass
class AdversarialFeature:
    """A feature with adversarial scoring"""
    name: str
    f_translator: float  # F-statistic for translator discrimination
    f_author: float      # F-statistic for author (confound)
    f_work: float        # F-statistic for work (confound)
    f_genre: float       # F-statistic for genre (confound)
    adversarial_score: float  # Combined score

    def to_dict(self) -> Dict[str, Any]:
        return {
            'name': self.name,
            'f_translator': self.f_translator,
            'f_author': self.f_author,
            'f_work': self.f_work,
            'f_genre': self.f_genre,
            'adversarial_score': self.adversarial_score
        }


class StyleSpaceBuilder:
    """Builds topic-invariant translator style space"""

    def __init__(self, confound_penalty: float = 1.0):
        self.confound_penalty = confound_penalty
        self.punctuation_chars = set('.,;:!?-"\'()[]{}…—–')

    def tokenize(self, text: str) -> List[str]:
        """Simple word tokenization"""
        if not text:
            return []
        # Lowercase and extract words
        words = re.findall(r'\b[a-z]+\b', text.lower())
        return words

    def get_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        if not text:
            return []
        # Split on sentence-ending punctuation
        sentences = re.split(r'[.!?]+', text)
        return [s.strip() for s in sentences if s.strip()]

    def mask_content_trigrams(self, text: str) -> List[str]:
        """
        Extract character trigrams with content words masked.
        This captures style patterns while hiding topic-specific content.
        """
        if not text:
            return []

        # Lowercase
        text = text.lower()

        # Mask non-function words with 'X'
        words = self.tokenize(text)
        function_set = set(FUNCTION_WORDS)

        masked_text = text
        for word in words:
            if word not in function_set and len(word) > 3:
                # Mask content words
                pattern = r'\b' + re.escape(word) + r'\b'
                masked_text = re.sub(pattern, 'X' * len(word), masked_text, count=1)

        # Extract character trigrams
        trigrams = []
        for i in range(len(masked_text) - 2):
            trigram = masked_text[i:i+3]
            # Only include trigrams with at least one letter
            if any(c.isalpha() or c == 'X' for c in trigram):
                trigrams.append(trigram)

        return trigrams

    def extract_features(
        self,
        translation_id: int,
        text: str,
        translator_id: int,
        author: str,
        work: str,
        genre: str
    ) -> StyleFeatures:
        """Extract all style features from a translation"""

        words = self.tokenize(text)
        sentences = self.get_sentences(text)
        total_words = len(words) if words else 1

        # Function word frequencies
        word_counts = Counter(words)
        function_word_freqs = {
            fw: word_counts.get(fw, 0) / total_words
            for fw in FUNCTION_WORDS
        }

        # Function word bigrams
        bigram_counts = Counter()
        for i in range(len(words) - 1):
            bigram = (words[i], words[i+1])
            if bigram in FUNCTION_BIGRAMS:
                bigram_counts[bigram] += 1

        bigram_freqs = {
            f"{b[0]}_{b[1]}": count / max(1, len(words) - 1)
            for b, count in bigram_counts.items()
        }
        # Add zeros for missing bigrams
        for b in FUNCTION_BIGRAMS:
            key = f"{b[0]}_{b[1]}"
            if key not in bigram_freqs:
                bigram_freqs[key] = 0.0

        # Punctuation frequencies
        total_chars = len(text) if text else 1
        punc_counts = Counter(c for c in text if c in self.punctuation_chars)
        punctuation_freqs = {
            p: punc_counts.get(p, 0) / total_chars
            for p in self.punctuation_chars
        }

        # Sentence statistics
        if sentences:
            sentence_lengths = [len(self.tokenize(s)) for s in sentences]
            avg_sentence_length = np.mean(sentence_lengths)
            sentence_length_std = np.std(sentence_lengths) if len(sentence_lengths) > 1 else 0.0
        else:
            avg_sentence_length = 0.0
            sentence_length_std = 0.0

        # Average word length
        if words:
            avg_word_length = np.mean([len(w) for w in words])
        else:
            avg_word_length = 0.0

        # Masked character trigrams
        trigrams = self.mask_content_trigrams(text)
        trigram_counts = Counter(trigrams)
        total_trigrams = len(trigrams) if trigrams else 1

        # Keep top 50 most common trigrams
        top_trigrams = dict(trigram_counts.most_common(50))
        char_trigram_freqs = {
            t: count / total_trigrams
            for t, count in top_trigrams.items()
        }

        return StyleFeatures(
            translation_id=translation_id,
            translator_id=translator_id,
            author=author or 'unknown',
            work=work or 'unknown',
            genre=genre or 'unknown',
            function_word_freqs=function_word_freqs,
            bigram_freqs=bigram_freqs,
            punctuation_freqs=punctuation_freqs,
            avg_sentence_length=avg_sentence_length,
            sentence_length_std=sentence_length_std,
            avg_word_length=avg_word_length,
            char_trigram_freqs=char_trigram_freqs
        )

    def compute_f_statistic(
        self,
        feature_values: List[float],
        group_labels: List[Any]
    ) -> float:
        """
        Compute F-statistic for ANOVA testing if feature discriminates groups.
        Higher F means feature better discriminates between groups.
        """
        if not feature_values or not group_labels:
            return 0.0

        # Group values by label
        groups = defaultdict(list)
        for val, label in zip(feature_values, group_labels):
            if label is not None:
                groups[label].append(val)

        # Need at least 2 groups with 2+ samples each
        valid_groups = [v for v in groups.values() if len(v) >= 2]
        if len(valid_groups) < 2:
            return 0.0

        try:
            f_stat, p_val = stats.f_oneway(*valid_groups)
            if np.isnan(f_stat) or np.isinf(f_stat):
                return 0.0
            return float(f_stat)
        except Exception:
            return 0.0

    def select_adversarial_features(
        self,
        all_features: List[StyleFeatures],
        n_select: int = 100
    ) -> List[AdversarialFeature]:
        """
        Select features that discriminate translators while being
        invariant to confounding factors.

        adversarial_score = F_translator - penalty * max(F_author, F_work, F_genre)
        """

        if not all_features:
            return []

        # Build feature name list
        feature_names = []

        # Function words
        feature_names.extend([f'fw_{fw}' for fw in FUNCTION_WORDS])

        # Bigrams
        feature_names.extend([f'bg_{b[0]}_{b[1]}' for b in FUNCTION_BIGRAMS])

        # Punctuation
        feature_names.extend([f'punc_{p}' for p in sorted(self.punctuation_chars)])

        # Sentence stats
        feature_names.extend(['sent_avg_len', 'sent_std_len', 'sent_avg_word'])

        # Collect all trigrams
        all_trigrams = set()
        for sf in all_features:
            all_trigrams.update(sf.char_trigram_freqs.keys())
        # Take most common 100
        trigram_counts = Counter()
        for sf in all_features:
            for t, freq in sf.char_trigram_freqs.items():
                trigram_counts[t] += freq
        top_trigrams = [t for t, _ in trigram_counts.most_common(100)]
        feature_names.extend([f'cg_{t}' for t in top_trigrams])

        logger.info(f"Total feature dimensions: {len(feature_names)}")

        # Extract labels
        translators = [sf.translator_id for sf in all_features]
        authors = [sf.author for sf in all_features]
        works = [sf.work for sf in all_features]
        genres = [sf.genre for sf in all_features]

        # Compute adversarial scores for each feature
        adversarial_features = []

        for i, fname in enumerate(feature_names):
            if i % 50 == 0:
                logger.info(f"Processing feature {i+1}/{len(feature_names)}")

            # Extract feature values
            values = []
            for sf in all_features:
                vec = sf.to_vector([fname])
                values.append(vec[0])

            # Compute F-statistics
            f_translator = self.compute_f_statistic(values, translators)
            f_author = self.compute_f_statistic(values, authors)
            f_work = self.compute_f_statistic(values, works)
            f_genre = self.compute_f_statistic(values, genres)

            # Adversarial score: want high translator F, low confound F
            max_confound = max(f_author, f_work, f_genre)
            adversarial_score = f_translator - self.confound_penalty * max_confound

            adversarial_features.append(AdversarialFeature(
                name=fname,
                f_translator=f_translator,
                f_author=f_author,
                f_work=f_work,
                f_genre=f_genre,
                adversarial_score=adversarial_score
            ))

        # Sort by adversarial score and select top N
        adversarial_features.sort(key=lambda x: x.adversarial_score, reverse=True)
        selected = adversarial_features[:n_select]

        logger.info(f"Selected {len(selected)} adversarial features")
        logger.info(f"Top 5 features: {[f.name for f in selected[:5]]}")

        return selected


async def build_style_space(
    sample_size: int = 1000,
    n_features: int = 50,
    confound_penalty: float = 1.0
) -> Dict[str, Any]:
    """
    Build the topic-invariant translator style space.
    """

    logger.info("=" * 70)
    logger.info("TOPIC-INVARIANT STYLE SPACE BUILDER")
    logger.info("=" * 70)

    builder = StyleSpaceBuilder(confound_penalty=confound_penalty)

    conn = await asyncpg.connect(DB_URL)

    try:
        # Get translations with metadata
        translations = await conn.fetch("""
            SELECT
                t.id as translation_id,
                t.translation,
                t.translator_id,
                tr.name as translator_name,
                s.author,
                s.work,
                'unknown' as genre
            FROM translations t
            JOIN translators tr ON t.translator_id = tr.id
            JOIN source_texts s ON t.text_id = s.id
            WHERE t.translation IS NOT NULL
              AND LENGTH(t.translation) > 100
            ORDER BY RANDOM()
            LIMIT $1
        """, sample_size)

        logger.info(f"Fetched {len(translations)} translations for analysis")

        # Get translator distribution
        translator_counts = Counter(t['translator_name'] for t in translations)
        logger.info(f"Translators: {len(translator_counts)}")
        for name, count in translator_counts.most_common(5):
            logger.info(f"  {name}: {count}")

        # Extract features from all translations
        all_features = []
        for i, t in enumerate(translations):
            if i % 100 == 0:
                logger.info(f"Extracting features {i+1}/{len(translations)}...")

            features = builder.extract_features(
                translation_id=t['translation_id'],
                text=t['translation'],
                translator_id=t['translator_id'],
                author=t['author'],
                work=t['work'],
                genre=t['genre']
            )
            all_features.append(features)

        # Select adversarial features
        selected_features = builder.select_adversarial_features(
            all_features,
            n_select=n_features
        )

        # Compute style residuals for each translation
        # Style residual = translation features projected into adversarial space
        # minus meaning anchor (if available)

        selected_names = [f.name for f in selected_features]

        # Compute translator style centroids in adversarial space
        translator_vectors = defaultdict(list)
        for sf in all_features:
            vec = sf.to_vector(selected_names)
            translator_vectors[sf.translator_id].append(vec)

        translator_centroids = {}
        for tid, vectors in translator_vectors.items():
            if vectors:
                centroid = np.mean(vectors, axis=0)
                translator_centroids[tid] = centroid

        # Store style residuals and centroids
        logger.info("Storing style residuals...")

        for sf in all_features:
            style_vec = sf.to_vector(selected_names)

            # Compute residual: style - translator_centroid
            if sf.translator_id in translator_centroids:
                residual = style_vec - translator_centroids[sf.translator_id]
            else:
                residual = style_vec

            # Store in database (pad to 768 dimensions to match schema)
            residual_768 = np.zeros(768)
            residual_768[:min(768, len(residual))] = residual[:min(768, len(residual))]
            residual_str = '[' + ','.join(str(float(x)) for x in residual_768) + ']'

            # Check if translation already has a style residual
            existing = await conn.fetchval(
                "SELECT id FROM style_residuals WHERE translation_id = $1",
                sf.translation_id
            )
            if existing:
                await conn.execute("""
                    UPDATE style_residuals SET residual = $2::vector
                    WHERE translation_id = $1
                """, sf.translation_id, residual_str)
            else:
                await conn.execute("""
                    INSERT INTO style_residuals (translation_id, translator_id, residual)
                    VALUES ($1, $2, $3::vector)
                """, sf.translation_id, sf.translator_id, residual_str)

        # Store translator centroids (use existing translator_centroids table)
        logger.info("Storing translator centroids...")

        for tid, centroid in translator_centroids.items():
            # Pad to 768 dimensions to match schema
            centroid_768 = np.zeros(768)
            centroid_768[:min(768, len(centroid))] = centroid[:min(768, len(centroid))]
            centroid_str = '[' + ','.join(str(float(x)) for x in centroid_768) + ']'

            # Check if centroid exists
            existing = await conn.fetchval(
                "SELECT id FROM translator_centroids WHERE translator_id = $1",
                tid
            )
            if existing:
                await conn.execute("""
                    UPDATE translator_centroids
                    SET centroid = $2::vector, sample_count = $3
                    WHERE translator_id = $1
                """, tid, centroid_str, len(translator_vectors[tid]))
            else:
                await conn.execute("""
                    INSERT INTO translator_centroids (translator_id, centroid, sample_count)
                    VALUES ($1, $2::vector, $3)
                """, tid, centroid_str, len(translator_vectors[tid]))

        # Generate report
        report = generate_style_space_report(
            n_translations=len(translations),
            n_translators=len(translator_counts),
            selected_features=selected_features,
            translator_counts=translator_counts
        )

        PAPERS_DIR.mkdir(parents=True, exist_ok=True)
        report_path = PAPERS_DIR / 'STYLE_SPACE_REPORT.md'
        with open(report_path, 'w') as f:
            f.write(report)

        # Save JSON with feature details
        json_path = PAPERS_DIR / 'STYLE_SPACE_REPORT.json'
        summary = {
            'timestamp': datetime.now().isoformat(),
            'n_translations': len(translations),
            'n_translators': len(translator_counts),
            'n_features_selected': len(selected_features),
            'confound_penalty': confound_penalty,
            'top_features': [f.to_dict() for f in selected_features[:20]],
            'translator_distribution': dict(translator_counts.most_common(20))
        }
        with open(json_path, 'w') as f:
            json.dump(summary, f, indent=2)

        logger.info(f"\nCreated style space with {len(selected_features)} adversarial features")
        logger.info(f"Stored {len(all_features)} style residuals")
        logger.info(f"Stored {len(translator_centroids)} translator centroids")
        logger.info(f"Reports saved to {PAPERS_DIR}")

        return summary

    finally:
        await conn.close()


def generate_style_space_report(
    n_translations: int,
    n_translators: int,
    selected_features: List[AdversarialFeature],
    translator_counts: Counter
) -> str:
    """Generate markdown report for style space"""

    # Categorize features
    fw_features = [f for f in selected_features if f.name.startswith('fw_')]
    bg_features = [f for f in selected_features if f.name.startswith('bg_')]
    punc_features = [f for f in selected_features if f.name.startswith('punc_')]
    sent_features = [f for f in selected_features if f.name.startswith('sent_')]
    cg_features = [f for f in selected_features if f.name.startswith('cg_')]

    report = f"""# Topic-Invariant Style Space Report

**Generated:** {datetime.now().isoformat()}

## Summary

| Metric | Value |
|:-------|------:|
| Translations analyzed | {n_translations} |
| Translators | {n_translators} |
| Features selected | {len(selected_features)} |
| Function word features | {len(fw_features)} |
| Bigram features | {len(bg_features)} |
| Punctuation features | {len(punc_features)} |
| Sentence features | {len(sent_features)} |
| Character trigram features | {len(cg_features)} |

## What Topic-Invariant Style Space Provides

1. **Translator fingerprint**: Features that identify a translator's style
   independent of what author/work/genre they are translating.

2. **Confound resistance**: Features are selected to have HIGH discrimination
   for translator but LOW discrimination for confounding factors.

3. **Style residuals**: For each translation, we compute the style residual
   (deviation from translator's centroid) which captures translation-specific
   style variations.

4. **Adversarial selection**: Features are scored as:
   `adversarial_score = F_translator - penalty × max(F_confounds)`

## Top 20 Adversarial Features

| Rank | Feature | F_translator | F_author | F_work | F_genre | Adv. Score |
|-----:|:--------|-------------:|---------:|-------:|--------:|-----------:|
"""

    for i, f in enumerate(selected_features[:20]):
        report += f"| {i+1} | {f.name} | {f.f_translator:.1f} | {f.f_author:.1f} | {f.f_work:.1f} | {f.f_genre:.1f} | {f.adversarial_score:.1f} |\n"

    report += f"""

## Translator Distribution

| Translator | Translations |
|:-----------|-------------:|
"""

    for name, count in translator_counts.most_common(10):
        report += f"| {name} | {count} |\n"

    report += f"""

## Feature Categories

### Function Words ({len(fw_features)} selected)
"""
    if fw_features:
        report += "Top 5: " + ", ".join(f.name[3:] for f in fw_features[:5]) + "\n"

    report += f"""
### Function Word Bigrams ({len(bg_features)} selected)
"""
    if bg_features:
        report += "Top 5: " + ", ".join(f.name[3:].replace('_', ' ') for f in bg_features[:5]) + "\n"

    report += f"""
### Punctuation ({len(punc_features)} selected)
"""
    if punc_features:
        report += "Top 5: " + ", ".join(repr(f.name[5:]) for f in punc_features[:5]) + "\n"

    report += f"""
### Sentence Statistics ({len(sent_features)} selected)
"""
    if sent_features:
        report += ", ".join(f.name for f in sent_features) + "\n"

    report += f"""
### Character Trigrams ({len(cg_features)} selected)
"""
    if cg_features:
        report += "Top 5: " + ", ".join(repr(f.name[3:]) for f in cg_features[:5]) + "\n"

    report += """

## Usage

The style space enables:
1. **Style normalization**: Remove translator-specific style while preserving meaning
2. **Multi-style generation**: Generate translations in different translator styles
3. **Quality scoring**: Detect when a translation's style is anomalous
4. **Attribution**: Identify which translator produced an unsigned translation

---

*Generated by style_space.py*
"""

    return report


if __name__ == "__main__":
    result = asyncio.run(build_style_space(
        sample_size=1000,
        n_features=50,
        confound_penalty=1.0
    ))
    print(f"\nCreated style space with {result['n_features_selected']} adversarial features")
    print(f"Analyzed {result['n_translations']} translations from {result['n_translators']} translators")
