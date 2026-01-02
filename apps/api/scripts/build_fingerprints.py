#!/usr/bin/env python3
"""
FINGERPRINT BUILDER - Unique, interpretable style signatures

Each author gets a fingerprint that:
1. Is interpretable (scholars can understand what makes this author distinct)
2. Is robust (survives falsification gates)
3. Is distinctive (separates from other authors)
"""

import asyncio
import asyncpg
import numpy as np
import json
import os
from collections import Counter
from scipy import stats
from sklearn.decomposition import PCA
from sklearn.neighbors import NearestNeighbors
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ['DATABASE_URL']

# Function words for English
FUNCTION_WORDS = [
    'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'because', 'as',
    'of', 'to', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'up',
    'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
    'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now',
    'he', 'she', 'it', 'they', 'we', 'you', 'i', 'him', 'her', 'them',
    'his', 'its', 'their', 'our', 'your', 'my', 'this', 'that', 'these',
    'those', 'which', 'who', 'whom', 'whose', 'what', 'be', 'been', 'being',
    'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'would',
    'could', 'might', 'must', 'shall', 'may', 'was', 'were', 'is', 'are', 'am'
]

def compute_sentence_profile(texts):
    """Compute sentence length statistics."""
    all_lengths = []
    for text in texts:
        sentences = [s.strip() for s in text.replace('!', '.').replace('?', '.').split('.') if s.strip()]
        lengths = [len(s.split()) for s in sentences if len(s.split()) > 0]
        all_lengths.extend(lengths)

    if len(all_lengths) < 10:
        return {'mean': 0, 'std': 0, 'skew': 0, 'kurtosis': 0}

    return {
        'mean': float(np.mean(all_lengths)),
        'std': float(np.std(all_lengths)),
        'skew': float(stats.skew(all_lengths)) if len(all_lengths) > 2 else 0,
        'kurtosis': float(stats.kurtosis(all_lengths)) if len(all_lengths) > 3 else 0
    }

def compute_vocabulary_richness(texts):
    """Compute vocabulary statistics."""
    all_tokens = []
    for text in texts:
        tokens = text.lower().split()
        all_tokens.extend(tokens)

    if len(all_tokens) < 100:
        return {'ttr': 0, 'hapax_ratio': 0, 'yule_k': 0}

    token_counts = Counter(all_tokens)
    n_tokens = len(all_tokens)
    n_types = len(token_counts)

    # Type-token ratio
    ttr = n_types / n_tokens

    # Hapax ratio (words appearing once)
    hapaxes = sum(1 for c in token_counts.values() if c == 1)
    hapax_ratio = hapaxes / n_types if n_types > 0 else 0

    # Yule's K (vocabulary richness measure)
    freq_freq = Counter(token_counts.values())
    m1 = n_tokens
    m2 = sum(f * (r ** 2) for r, f in freq_freq.items())
    yule_k = 10000 * (m2 - m1) / (m1 ** 2) if m1 > 0 else 0

    return {
        'ttr': float(ttr),
        'hapax_ratio': float(hapax_ratio),
        'yule_k': float(yule_k)
    }

def compute_function_word_signature(texts):
    """Compute function word frequency vector."""
    all_tokens = []
    for text in texts:
        tokens = text.lower().split()
        all_tokens.extend(tokens)

    n_tokens = len(all_tokens)
    if n_tokens < 100:
        return [0.0] * len(FUNCTION_WORDS)

    token_counts = Counter(all_tokens)
    signature = []
    for fw in FUNCTION_WORDS:
        freq = token_counts.get(fw, 0) / n_tokens * 1000  # per 1000 tokens
        signature.append(float(freq))

    return signature

def compute_punctuation_profile(texts):
    """Compute punctuation usage rates."""
    full_text = ' '.join(texts)
    n_chars = len(full_text)

    if n_chars < 100:
        return {'comma_rate': 0, 'semicolon_rate': 0, 'colon_rate': 0, 'question_rate': 0}

    return {
        'comma_rate': float(full_text.count(',') / n_chars * 1000),
        'semicolon_rate': float(full_text.count(';') / n_chars * 1000),
        'colon_rate': float(full_text.count(':') / n_chars * 1000),
        'question_rate': float(full_text.count('?') / n_chars * 1000),
        'exclamation_rate': float(full_text.count('!') / n_chars * 1000),
    }

async def main():
    print("=" * 70)
    print("FINGERPRINT BUILDER - Unique Author Signatures")
    print("=" * 70)

    conn = await asyncpg.connect(DATABASE_URL)

    # Load data by author
    print("\n[1] Loading author data...")

    rows = await conn.fetch("""
        SELECT tr.name as translator_name, t.translation as english_text, t.embedding
        FROM translations t
        JOIN translators tr ON t.translator_id = tr.id
        WHERE t.embedding IS NOT NULL
    """)

    author_data = {}
    author_embeddings = {}

    for r in rows:
        author = r['translator_name']
        if author not in author_data:
            author_data[author] = []
            author_embeddings[author] = []
        author_data[author].append(r['english_text'])
        emb = np.array(json.loads(r['embedding']) if isinstance(r['embedding'], str) else list(r['embedding']))
        author_embeddings[author].append(emb)

    print(f"    Found {len(author_data)} authors")

    # Filter to authors with sufficient data
    MIN_SAMPLES = 50
    valid_authors = [a for a, texts in author_data.items() if len(texts) >= MIN_SAMPLES]
    print(f"    Authors with >= {MIN_SAMPLES} samples: {len(valid_authors)}")

    # Build fingerprints
    print("\n[2] Building fingerprints...")

    fingerprints = {}
    style_vectors = []
    author_order = []

    for author in valid_authors:
        texts = author_data[author]
        embeddings = np.array(author_embeddings[author])

        # Interpretable features
        sentence_profile = compute_sentence_profile(texts)
        vocab_richness = compute_vocabulary_richness(texts)
        fw_signature = compute_function_word_signature(texts)
        punct_profile = compute_punctuation_profile(texts)

        # Learned style vector (mean embedding, will be refined)
        mean_embedding = embeddings.mean(axis=0)

        fingerprints[author] = {
            'sentence_profile': sentence_profile,
            'vocabulary_richness': vocab_richness,
            'function_word_signature': fw_signature[:20],  # Top 20 for display
            'punctuation_profile': punct_profile,
            'sample_count': len(texts),
        }

        style_vectors.append(mean_embedding)
        author_order.append(author)

    # Compute distinctiveness
    print("\n[3] Computing distinctiveness metrics...")

    if len(style_vectors) > 1:
        X = np.array(style_vectors)

        # PCA for visualization
        pca = PCA(n_components=min(32, len(X)))
        X_pca = pca.fit_transform(X)

        # Nearest neighbor distances
        nn = NearestNeighbors(n_neighbors=2)
        nn.fit(X_pca)
        distances, indices = nn.kneighbors(X_pca)

        for i, author in enumerate(author_order):
            nn_dist = distances[i, 1]  # Distance to nearest neighbor
            nn_author = author_order[indices[i, 1]]

            fingerprints[author]['nearest_neighbor'] = nn_author
            fingerprints[author]['nn_distance'] = float(nn_dist)
            fingerprints[author]['style_vector_pca'] = X_pca[i].tolist()[:8]

    # Rank by distinctiveness
    sorted_authors = sorted(
        fingerprints.keys(),
        key=lambda a: fingerprints[a].get('nn_distance', 0),
        reverse=True
    )

    for rank, author in enumerate(sorted_authors, 1):
        fingerprints[author]['distinctiveness_rank'] = rank

    # Store fingerprints
    print("\n[4] Storing fingerprints...")

    for author, fp in fingerprints.items():
        # Get author_id
        author_id = await conn.fetchval("""
            SELECT id FROM authors WHERE name_en = $1
        """, author)

        if not author_id:
            # Create author
            author_id = await conn.fetchval("""
                INSERT INTO authors (name_en)
                VALUES ($1)
                ON CONFLICT (name_en) DO UPDATE SET updated_at = NOW()
                RETURNING id
            """, author)

        await conn.execute("""
            INSERT INTO author_fingerprints (
                author_id, author_name, fingerprint_version,
                sentence_length_profile, vocabulary_richness, punctuation_profile,
                fingerprint_confidence, sample_count,
                nearest_neighbor_distance, distinctiveness_rank
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (author_id, fingerprint_version) DO UPDATE SET
                sentence_length_profile = EXCLUDED.sentence_length_profile,
                vocabulary_richness = EXCLUDED.vocabulary_richness,
                punctuation_profile = EXCLUDED.punctuation_profile,
                sample_count = EXCLUDED.sample_count,
                nearest_neighbor_distance = EXCLUDED.nearest_neighbor_distance,
                distinctiveness_rank = EXCLUDED.distinctiveness_rank
        """,
            author_id, author, 'v4.0',
            json.dumps(fp['sentence_profile']),
            json.dumps(fp['vocabulary_richness']),
            json.dumps(fp['punctuation_profile']),
            0.8,  # placeholder confidence
            fp['sample_count'],
            fp.get('nn_distance'),
            fp.get('distinctiveness_rank')
        )

    # Print summary
    print("\n" + "=" * 70)
    print("FINGERPRINT SUMMARY")
    print("=" * 70)

    print("\nTop 5 Most Distinctive Authors:")
    for author in sorted_authors[:5]:
        fp = fingerprints[author]
        print(f"\n  {author}:")
        print(f"    Samples: {fp['sample_count']}")
        print(f"    Sentence length: {fp['sentence_profile']['mean']:.1f} +/- {fp['sentence_profile']['std']:.1f}")
        print(f"    Vocabulary TTR: {fp['vocabulary_richness']['ttr']:.3f}")
        print(f"    NN distance: {fp.get('nn_distance', 0):.3f}")
        print(f"    Nearest to: {fp.get('nearest_neighbor', 'N/A')}")

    await conn.close()
    print("\nFingerprint building complete!")

if __name__ == "__main__":
    asyncio.run(main())
