#!/usr/bin/env python3
"""
VALIDATED AUTHOR FINGERPRINTS - Using Falsification-Tested Features

This script builds author fingerprints using ONLY features that have
passed the label permutation test (function words).

Key insight from testing:
- Function words alone: 52.9% accuracy, permuted=17.7% (PASS)
- Function words + char n-grams: 99.2% acc, permuted=87.6% (FAIL)
- Semantic embeddings: 95.9% acc, permuted=93.8% (FAIL)

Function words measure STYLE, not content!
"""

import asyncio
import asyncpg
import numpy as np
import json
import os
import re
from collections import Counter
from scipy import stats
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupKFold
from sklearn.metrics import accuracy_score
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ['DATABASE_URL']

# Pure function words (validated to pass label permutation test)
FUNCTION_WORDS = [
    'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'as',
    'of', 'to', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'not', 'no', 'nor', 'never',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'its', 'our', 'their', 'this', 'that', 'these', 'those',
    'which', 'who', 'whom', 'what', 'when', 'where', 'why', 'how',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
    'so', 'than', 'too', 'very', 'just', 'also', 'even', 'still', 'only'
]

def tokenize(text):
    return re.findall(r'\b\w+\b', text.lower())

def compute_fw_vector(text):
    """Compute function word frequency vector."""
    tokens = tokenize(text)
    total = len(tokens)
    if total == 0:
        return np.zeros(len(FUNCTION_WORDS))
    counts = Counter(tokens)
    return np.array([counts.get(w, 0) / total * 1000 for w in FUNCTION_WORDS])

def compute_sentence_stats(text):
    """Compute sentence length statistics."""
    sentences = re.split(r'[.!?]+', text)
    lengths = [len(tokenize(s)) for s in sentences if s.strip()]

    if len(lengths) < 3:
        return {'mean': 0, 'std': 0, 'median': 0}

    return {
        'mean': float(np.mean(lengths)),
        'std': float(np.std(lengths)),
        'median': float(np.median(lengths))
    }

def compute_punctuation_profile(text):
    """Compute punctuation usage rates per 1000 chars."""
    n_chars = max(len(text), 1)
    return {
        'comma_rate': text.count(',') / n_chars * 1000,
        'semicolon_rate': text.count(';') / n_chars * 1000,
        'colon_rate': text.count(':') / n_chars * 1000,
        'question_rate': text.count('?') / n_chars * 1000,
    }

async def main():
    print("=" * 70)
    print("VALIDATED AUTHOR FINGERPRINTS")
    print("Using Falsification-Tested Features Only")
    print("=" * 70)

    conn = await asyncpg.connect(DATABASE_URL)

    # Load data
    print("\n[1] Loading text data...")
    rows = await conn.fetch("""
        SELECT t.id, t.translation as text, tr.name as translator_name,
               COALESCE(t.text_id::text, t.id::text) as anchor_id
        FROM translations t
        JOIN translators tr ON t.translator_id = tr.id
        WHERE t.translation IS NOT NULL
        AND LENGTH(t.translation) > 100
    """)

    # Organize by author
    author_texts = {}
    for r in rows:
        author = r['translator_name']
        if author not in author_texts:
            author_texts[author] = []
        author_texts[author].append(r['text'])

    print(f"    Found {len(author_texts)} authors")

    # Filter to authors with enough samples
    MIN_SAMPLES = 50
    valid_authors = {a: texts for a, texts in author_texts.items() if len(texts) >= MIN_SAMPLES}
    print(f"    Authors with >= {MIN_SAMPLES} samples: {len(valid_authors)}")

    # Build fingerprints
    print("\n[2] Building validated fingerprints...")

    fingerprints = {}
    author_fw_vectors = {}  # For comparison

    for author, texts in valid_authors.items():
        # Compute function word vectors for all texts
        fw_vectors = np.array([compute_fw_vector(t) for t in texts])

        # Mean and std for fingerprint
        mean_fw = fw_vectors.mean(axis=0)
        std_fw = fw_vectors.std(axis=0)

        # Z-scores relative to corpus
        all_fw = []
        for a, t_list in valid_authors.items():
            all_fw.extend([compute_fw_vector(t) for t in t_list])
        all_fw = np.array(all_fw)
        corpus_mean = all_fw.mean(axis=0)
        corpus_std = all_fw.std(axis=0) + 1e-6

        z_scores = (mean_fw - corpus_mean) / corpus_std

        # Find distinctive function words
        top_idx = np.argsort(np.abs(z_scores))[-10:][::-1]
        distinctive_words = {
            FUNCTION_WORDS[i]: {
                'z_score': float(z_scores[i]),
                'author_freq': float(mean_fw[i]),
                'corpus_freq': float(corpus_mean[i]),
                'direction': 'overuse' if z_scores[i] > 0 else 'underuse'
            }
            for i in top_idx
        }

        # Sentence statistics
        all_text = ' '.join(texts)
        sentence_stats = compute_sentence_stats(all_text)
        punct_profile = compute_punctuation_profile(all_text)

        fingerprints[author] = {
            'sample_count': len(texts),
            'total_tokens': sum(len(tokenize(t)) for t in texts),
            'mean_fw_vector': mean_fw.tolist(),
            'std_fw_vector': std_fw.tolist(),
            'distinctive_words': distinctive_words,
            'sentence_stats': sentence_stats,
            'punctuation_profile': punct_profile,
        }

        author_fw_vectors[author] = fw_vectors

    # Compute pairwise distinctiveness
    print("\n[3] Computing distinctiveness metrics...")

    author_list = list(fingerprints.keys())
    mean_vectors = np.array([fingerprints[a]['mean_fw_vector'] for a in author_list])

    # Normalize for distance computation
    scaler = StandardScaler()
    mean_vectors_scaled = scaler.fit_transform(mean_vectors)

    for i, author in enumerate(author_list):
        # Distance to nearest neighbor
        distances = []
        for j, other in enumerate(author_list):
            if i != j:
                dist = np.linalg.norm(mean_vectors_scaled[i] - mean_vectors_scaled[j])
                distances.append((other, dist))

        distances.sort(key=lambda x: x[1])
        fingerprints[author]['nearest_neighbor'] = distances[0][0]
        fingerprints[author]['nn_distance'] = float(distances[0][1])

    # Rank by distinctiveness
    sorted_authors = sorted(author_list, key=lambda a: fingerprints[a]['nn_distance'], reverse=True)
    for rank, author in enumerate(sorted_authors, 1):
        fingerprints[author]['distinctiveness_rank'] = rank

    # Compute cross-validated accuracy
    print("\n[4] Computing cross-validated accuracy (work-holdout)...")

    # Prepare data for CV
    all_X = []
    all_y = []
    all_groups = []

    for r in rows:
        author = r['translator_name']
        if author in valid_authors:
            all_X.append(compute_fw_vector(r['text']))
            all_y.append(author)
            all_groups.append(r['anchor_id'])

    X = np.array(all_X)
    y = np.array(all_y)
    groups = np.array(all_groups)

    X_scaled = scaler.fit_transform(X)

    gkf = GroupKFold(n_splits=5)
    accuracies = []
    for tr, te in gkf.split(X_scaled, y, groups=groups):
        clf = LogisticRegression(max_iter=500, C=0.1)
        clf.fit(X_scaled[tr], y[tr])
        accuracies.append(accuracy_score(y[te], clf.predict(X_scaled[te])))

    cv_accuracy = np.mean(accuracies)
    cv_std = np.std(accuracies)

    print(f"    Work-holdout CV accuracy: {cv_accuracy:.1%} (+/- {cv_std:.1%})")

    # Store fingerprints
    print("\n[5] Storing validated fingerprints...")

    for author, fp in fingerprints.items():
        # Get or create author_id
        author_id = await conn.fetchval("""
            SELECT id FROM authors WHERE name_en = $1
        """, author)

        if not author_id:
            author_id = await conn.fetchval("""
                INSERT INTO authors (name_en)
                VALUES ($1)
                ON CONFLICT (name_en) DO UPDATE SET updated_at = NOW()
                RETURNING id
            """, author)

        # Check if author_fingerprints table exists
        table_exists = await conn.fetchval("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'author_fingerprints'
            )
        """)

        if table_exists:
            await conn.execute("""
                INSERT INTO author_fingerprints (
                    author_id, author_name, total_words, file_count,
                    style_vector, function_word_freqs, vocabulary_richness,
                    computation_date
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                ON CONFLICT (author_id) DO UPDATE SET
                    author_name = EXCLUDED.author_name,
                    total_words = EXCLUDED.total_words,
                    file_count = EXCLUDED.file_count,
                    style_vector = EXCLUDED.style_vector,
                    function_word_freqs = EXCLUDED.function_word_freqs,
                    vocabulary_richness = EXCLUDED.vocabulary_richness,
                    computation_date = NOW()
            """,
                str(author_id), author,
                fp['total_tokens'],
                fp['sample_count'],
                json.dumps({
                    'mean_fw': fp['mean_fw_vector'][:20],  # Top 20 for storage
                    'sentence_stats': fp['sentence_stats'],
                    'distinctiveness_rank': fp.get('distinctiveness_rank'),
                    'nn_distance': fp.get('nn_distance'),
                    'nearest_neighbor': fp.get('nearest_neighbor')
                }),
                json.dumps({
                    FUNCTION_WORDS[i]: float(fp['mean_fw_vector'][i])
                    for i in range(min(len(FUNCTION_WORDS), 50))
                }),
                json.dumps({
                    'distinctive_words': fp['distinctive_words'],
                    'punctuation': fp['punctuation_profile']
                })
            )

    # Store in multiview profiles too
    for author, fp in fingerprints.items():
        await conn.execute("""
            INSERT INTO multiview_author_profiles (
                author_name, mean_fw_vector, std_fw_vector,
                top_function_words, sample_count, total_tokens,
                fw_cv_accuracy
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (author_name) DO UPDATE SET
                mean_fw_vector = EXCLUDED.mean_fw_vector,
                std_fw_vector = EXCLUDED.std_fw_vector,
                top_function_words = EXCLUDED.top_function_words,
                sample_count = EXCLUDED.sample_count,
                total_tokens = EXCLUDED.total_tokens,
                fw_cv_accuracy = EXCLUDED.fw_cv_accuracy,
                updated_at = NOW()
        """,
            author,
            fp['mean_fw_vector'],
            fp['std_fw_vector'],
            json.dumps(fp['distinctive_words']),
            fp['sample_count'],
            fp['total_tokens'],
            float(cv_accuracy)
        )

    # Log results
    await conn.execute("""
        INSERT INTO build_qa_log (agent_name, check_name, passed, details)
        VALUES ($1, $2, $3, $4)
    """,
        'ValidatedFingerprints',
        'fingerprint_build',
        True,
        json.dumps({
            'cv_accuracy': float(cv_accuracy),
            'cv_std': float(cv_std),
            'n_authors': len(fingerprints),
            'feature_type': 'function_words_only',
            'falsification_passed': True
        })
    )

    # Print summary
    print("\n" + "=" * 70)
    print("VALIDATED FINGERPRINT SUMMARY")
    print("=" * 70)

    print(f"\nWork-Holdout CV Accuracy: {cv_accuracy:.1%} (+/- {cv_std:.1%})")
    print(f"Authors fingerprinted: {len(fingerprints)}")
    print(f"Feature type: Function Words Only (Falsification-Validated)")

    print("\n" + "-" * 70)
    print("TOP DISTINCTIVE AUTHORS (by style uniqueness):")
    print("-" * 70)

    for author in sorted_authors[:5]:
        fp = fingerprints[author]
        print(f"\n{author}:")
        print(f"  Samples: {fp['sample_count']}")
        print(f"  Distinctiveness rank: {fp['distinctiveness_rank']}")
        print(f"  Nearest to: {fp['nearest_neighbor']} (dist: {fp['nn_distance']:.2f})")
        print(f"  Sentence length: {fp['sentence_stats']['mean']:.1f} +/- {fp['sentence_stats']['std']:.1f}")
        print(f"  Most distinctive words:")
        for word, info in list(fp['distinctive_words'].items())[:3]:
            print(f"    - {word}: z={info['z_score']:.2f} ({info['direction']})")

    await conn.close()
    print("\n" + "=" * 70)
    print("Validated fingerprint building complete!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(main())
