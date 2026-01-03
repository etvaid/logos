#!/usr/bin/env python3
"""
================================================================================
THOMAS STYLOMETRIC ANALYSIS
================================================================================

Compares Gospel of Thomas Greek fragments to Q style fingerprint.

Methodology:
1. Build Q style centroid from reconstructed Q passages
2. Build Mark style centroid for comparison
3. For each Thomas logion with Greek:
   - Extract style features
   - Compute distance to Q centroid
   - Compute distance to Mark centroid
   - Run falsification gates
4. Classify: "likely Q", "Q-adjacent", "non-Q"

Key Questions:
- Do Thomas logia with Q parallels show Q style?
- Which logia WITHOUT known parallels might be "lost Q"?
- Does Thomas preserve independent Q tradition?

================================================================================
"""

import asyncio
import asyncpg
import os
import re
import json
import numpy as np
from collections import Counter
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity, euclidean_distances
from typing import Dict, List, Tuple
from datetime import datetime

DATABASE_URL = os.environ.get('DATABASE_URL', '')

# Greek function words (same as Q analysis)
GREEK_FUNCTION_WORDS = [
    'ὁ', 'ἡ', 'τό', 'τοῦ', 'τῆς', 'τῷ', 'τῇ', 'τόν', 'τήν',
    'οἱ', 'αἱ', 'τά', 'τῶν', 'τοῖς', 'ταῖς', 'τούς', 'τάς',
    'ἐν', 'εἰς', 'ἐκ', 'ἐξ', 'ἀπό', 'πρός', 'διά', 'κατά', 'μετά', 'περί',
    'καί', 'δέ', 'γάρ', 'ἀλλά', 'ἤ', 'εἰ', 'ἐάν', 'ὅτι', 'ὡς', 'ἵνα',
    'μή', 'οὐ', 'οὐκ', 'οὐχ',
    'ἐγώ', 'σύ', 'αὐτός', 'αὐτή', 'αὐτό', 'ἡμεῖς', 'ὑμεῖς',
    'οὗτος', 'ἐκεῖνος', 'ὅς', 'τίς',
    'μέν', 'οὖν', 'νῦν', 'τότε', 'πάλιν', 'εὐθύς', 'εὐθέως',
    'εἰμί', 'ἐστίν', 'ἦν', 'ἔχω', 'λέγω', 'λέγει', 'εἶπεν',
]


def normalize_greek(word: str) -> str:
    return re.sub(r'[^\u0370-\u03FF\u1F00-\u1FFF]', '', word.lower())


def tokenize_greek(text: str) -> List[str]:
    return re.findall(r'[\u0370-\u03FF\u1F00-\u1FFF]+', text)


GREEK_FUNCTION_SET = set(normalize_greek(w) for w in GREEK_FUNCTION_WORDS)


class GreekStyleExtractor:
    """Extract style features from Greek text."""

    def __init__(self):
        self.function_words = [normalize_greek(w) for w in GREEK_FUNCTION_WORDS[:50]]

    def extract_features(self, text: str) -> np.ndarray:
        """Extract style features from Greek text."""
        if not text:
            return np.zeros(60)

        words = [normalize_greek(w) for w in tokenize_greek(text)]
        total = len(words) if words else 1
        counts = Counter(words)

        features = []

        # Function word frequencies (50 features)
        for fw in self.function_words:
            features.append(counts.get(fw, 0) / total * 1000)

        # Word length statistics (5 features)
        if words:
            lengths = [len(w) for w in tokenize_greek(text)]
            features.append(np.mean(lengths) if lengths else 0)
            features.append(np.std(lengths) if lengths else 0)
            features.append(np.median(lengths) if lengths else 0)
            features.append(max(lengths) if lengths else 0)
            features.append(min(lengths) if lengths else 0)
        else:
            features.extend([0, 0, 0, 0, 0])

        # Function word ratio (1 feature)
        fw_count = sum(1 for w in words if w in GREEK_FUNCTION_SET)
        features.append(fw_count / total * 100)

        # λέγει Ἰησοῦς formula (characteristic of Thomas and Q)
        legei_count = counts.get('λέγει', 0) + counts.get('λεγει', 0)
        features.append(legei_count / total * 1000)

        # Key particles (2 features)
        kai_count = counts.get('καί', 0) + counts.get('και', 0)
        features.append(kai_count / total * 1000)

        features.append(len(set(words)) / total if total > 0 else 0)  # vocab richness

        return np.array(features)


async def build_q_centroid(pool: asyncpg.Pool, extractor: GreekStyleExtractor) -> Tuple[np.ndarray, np.ndarray]:
    """Build Q style centroid from reconstructed Q passages."""

    async with pool.acquire() as conn:
        # Get Q passages with Greek text
        rows = await conn.fetch("""
            SELECT sa.matthew_text, sa.luke_text
            FROM synoptic_alignments sa
            WHERE sa.tradition_type = 'double_mt_lk'
              AND (sa.matthew_text IS NOT NULL OR sa.luke_text IS NOT NULL)
        """)

    q_features = []
    for row in rows:
        # Use Luke text preferentially (Q follows Lukan order)
        text = row['luke_text'] or row['matthew_text']
        if text:
            features = extractor.extract_features(text)
            q_features.append(features)

    if not q_features:
        return np.zeros(60), np.zeros(60)

    q_features = np.array(q_features)
    q_centroid = np.mean(q_features, axis=0)
    q_std = np.std(q_features, axis=0)

    return q_centroid, q_std


async def build_mark_centroid(pool: asyncpg.Pool, extractor: GreekStyleExtractor) -> np.ndarray:
    """Build Mark style centroid for comparison."""

    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT content FROM source_texts
            WHERE work = 'Mark' AND content IS NOT NULL
            LIMIT 100
        """)

    mk_features = []
    for row in rows:
        if row['content']:
            features = extractor.extract_features(row['content'])
            mk_features.append(features)

    if not mk_features:
        return np.zeros(60)

    return np.mean(mk_features, axis=0)


async def analyze_thomas_stylometry(pool: asyncpg.Pool):
    """Run stylometric analysis on Thomas Greek fragments."""
    print("=" * 70)
    print("THOMAS STYLOMETRIC ANALYSIS")
    print("=" * 70)

    extractor = GreekStyleExtractor()

    # Build centroids
    print("\nBuilding style centroids...")
    q_centroid, q_std = await build_q_centroid(pool, extractor)
    mk_centroid = await build_mark_centroid(pool, extractor)

    print(f"  Q centroid built from double-tradition passages")
    print(f"  Mark centroid built from Gospel of Mark")

    # Load Thomas logia with Greek
    async with pool.acquire() as conn:
        thomas_rows = await conn.fetch("""
            SELECT logion_num, greek_text, q_parallel, coptic_translation
            FROM thomas_logia
            WHERE greek_text IS NOT NULL AND LENGTH(greek_text) > 20
            ORDER BY logion_num
        """)

    print(f"\nAnalyzing {len(thomas_rows)} Thomas logia with Greek text...")
    print("-" * 70)

    results = []
    q_similar = []
    q_adjacent = []
    non_q = []

    for row in thomas_rows:
        logion = row['logion_num']
        greek = row['greek_text']
        q_par = row['q_parallel']

        # Extract features
        features = extractor.extract_features(greek)

        # Compute distances
        q_distance = np.linalg.norm(features - q_centroid)
        mk_distance = np.linalg.norm(features - mk_centroid)

        # Cosine similarity
        q_cos = cosine_similarity([features], [q_centroid])[0][0]
        mk_cos = cosine_similarity([features], [mk_centroid])[0][0]

        # Classification based on relative distance
        q_ratio = q_distance / (mk_distance + 1e-6)

        if q_cos > 0.7 and q_ratio < 0.8:
            classification = "likely_Q"
            q_similar.append(logion)
        elif q_cos > 0.5 and q_ratio < 1.2:
            classification = "Q_adjacent"
            q_adjacent.append(logion)
        else:
            classification = "non_Q"
            non_q.append(logion)

        result = {
            'logion': logion,
            'has_q_parallel': q_par is not None,
            'q_parallel': q_par,
            'q_similarity': float(q_cos),
            'mark_similarity': float(mk_cos),
            'q_distance': float(q_distance),
            'mark_distance': float(mk_distance),
            'q_ratio': float(q_ratio),
            'classification': classification,
            'greek_excerpt': greek[:80] + '...' if len(greek) > 80 else greek
        }
        results.append(result)

        # Print summary
        q_status = "✓" if q_par else " "
        class_symbol = {"likely_Q": "★", "Q_adjacent": "◆", "non_Q": "○"}[classification]

        print(f"  Th {logion:3d} [{q_status}] {class_symbol} Q-sim: {q_cos:.3f} | Mk-sim: {mk_cos:.3f} | {classification}")

    # Summary statistics
    print("\n" + "=" * 70)
    print("THOMAS-Q ANALYSIS SUMMARY")
    print("=" * 70)

    print(f"\nClassification Results:")
    print(f"  ★ Likely Q style: {len(q_similar)} logia")
    print(f"  ◆ Q-adjacent: {len(q_adjacent)} logia")
    print(f"  ○ Non-Q style: {len(non_q)} logia")

    # Validate against known Q parallels
    known_q = [r for r in results if r['has_q_parallel']]
    q_style_with_parallel = sum(1 for r in known_q if r['classification'] in ['likely_Q', 'Q_adjacent'])

    print(f"\nValidation (logia with known Q parallels):")
    print(f"  Total with Q parallels: {len(known_q)}")
    print(f"  Show Q style: {q_style_with_parallel} ({q_style_with_parallel/len(known_q)*100:.1f}%)" if known_q else "")

    # Potential "lost Q" candidates
    potential_lost_q = [r for r in results if r['classification'] == 'likely_Q' and not r['has_q_parallel']]

    print(f"\nPotential 'Lost Q' Candidates (Q style but no known parallel):")
    for r in potential_lost_q:
        print(f"  Th {r['logion']}: Q-sim {r['q_similarity']:.3f}")
        print(f"    '{r['greek_excerpt']}'")

    # Store results
    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS thomas_analysis (
                id SERIAL PRIMARY KEY,
                logion_num INTEGER UNIQUE,
                q_similarity FLOAT,
                mark_similarity FLOAT,
                classification TEXT,
                is_potential_lost_q BOOLEAN,
                analysis_date TIMESTAMP DEFAULT NOW()
            )
        """)

        await conn.execute("DELETE FROM thomas_analysis")

        for r in results:
            await conn.execute("""
                INSERT INTO thomas_analysis (logion_num, q_similarity, mark_similarity, classification, is_potential_lost_q)
                VALUES ($1, $2, $3, $4, $5)
            """, r['logion'], r['q_similarity'], r['mark_similarity'], r['classification'],
               r['classification'] == 'likely_Q' and not r['has_q_parallel'])

    # Save full results
    output = {
        'timestamp': datetime.now().isoformat(),
        'summary': {
            'total_analyzed': len(results),
            'likely_q': len(q_similar),
            'q_adjacent': len(q_adjacent),
            'non_q': len(non_q),
            'known_parallels_show_q_style_pct': q_style_with_parallel / len(known_q) * 100 if known_q else 0,
            'potential_lost_q': len(potential_lost_q)
        },
        'logia_with_q_style': q_similar,
        'potential_lost_q': [r['logion'] for r in potential_lost_q],
        'results': results
    }

    output_path = '/Users/royvaid/Downloads/logos/papers/THOMAS_Q_ANALYSIS.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nResults saved to: {output_path}")

    return output


async def main():
    pool = await asyncpg.create_pool(DATABASE_URL)
    results = await analyze_thomas_stylometry(pool)
    await pool.close()
    return results


if __name__ == "__main__":
    asyncio.run(main())
