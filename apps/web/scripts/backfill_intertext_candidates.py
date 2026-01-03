#!/usr/bin/env python3
"""
Backfill intertext_candidates using multiple methods:
1. Vector similarity (cosine on embeddings)
2. Lexical overlap (Jaccard on lemmas)
3. N-gram overlap (shared 3-grams)

This is stage 1 of 2-stage retrieval: generate many candidates quickly.
Stage 2 (intertext_evidence) does expensive validation on candidates.
"""

import os
import re
import json
import psycopg2
from psycopg2.extras import execute_batch
from typing import List, Dict, Set, Tuple
from collections import defaultdict
import math

DATABASE_URL = os.environ.get('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

def get_lemmas_for_passage(conn, urn: str) -> Set[str]:
    """Get set of lemmas for a passage from passage_tokens + morph_entries."""
    with conn.cursor() as cur:
        cur.execute("""
            SELECT DISTINCT me.lemma
            FROM passage_tokens pt
            JOIN UNNEST(pt.morph_ids) AS mid ON true
            JOIN morph_entries me ON me.morph_id = mid
            WHERE pt.urn = %s AND me.pos NOT IN ('article', 'conjunction', 'preposition', 'particle')
        """, (urn,))
        return {row[0] for row in cur.fetchall()}

def get_tokens_for_passage(conn, urn: str) -> List[str]:
    """Get token list for n-gram computation."""
    with conn.cursor() as cur:
        cur.execute("SELECT tokens FROM passage_tokens WHERE urn = %s", (urn,))
        row = cur.fetchone()
        return row[0] if row else []

def jaccard_similarity(set1: Set[str], set2: Set[str]) -> float:
    """Compute Jaccard similarity between two sets."""
    if not set1 or not set2:
        return 0.0
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    return intersection / union if union > 0 else 0.0

def get_ngrams(tokens: List[str], n: int = 3) -> Set[Tuple[str, ...]]:
    """Extract n-grams from token list."""
    if len(tokens) < n:
        return set()
    return {tuple(tokens[i:i+n]) for i in range(len(tokens) - n + 1)}

def ngram_overlap(tokens1: List[str], tokens2: List[str], n: int = 3) -> float:
    """Compute n-gram overlap between two token lists."""
    ngrams1 = get_ngrams(tokens1, n)
    ngrams2 = get_ngrams(tokens2, n)
    return jaccard_similarity(ngrams1, ngrams2)

def generate_lexical_candidates(conn, source_urns: List[str], target_urns: List[str],
                                 threshold: float = 0.15) -> List[Dict]:
    """Generate candidates based on lexical (lemma) overlap."""
    print("  Computing lexical candidates...")

    # Pre-fetch all lemmas
    source_lemmas = {}
    target_lemmas = {}

    for urn in source_urns:
        source_lemmas[urn] = get_lemmas_for_passage(conn, urn)

    for urn in target_urns:
        target_lemmas[urn] = get_lemmas_for_passage(conn, urn)

    candidates = []
    for s_urn in source_urns:
        s_lemmas = source_lemmas.get(s_urn, set())
        if not s_lemmas:
            continue

        scored_targets = []
        for t_urn in target_urns:
            if s_urn == t_urn:
                continue
            t_lemmas = target_lemmas.get(t_urn, set())
            if not t_lemmas:
                continue

            score = jaccard_similarity(s_lemmas, t_lemmas)
            if score >= threshold:
                scored_targets.append((t_urn, score))

        # Rank and keep top 20
        scored_targets.sort(key=lambda x: -x[1])
        for rank, (t_urn, score) in enumerate(scored_targets[:20], 1):
            candidates.append({
                'source_urn': s_urn,
                'target_urn': t_urn,
                'method': 'lexical',
                'score': score,
                'rank': rank,
            })

    return candidates

def generate_ngram_candidates(conn, source_urns: List[str], target_urns: List[str],
                               threshold: float = 0.1) -> List[Dict]:
    """Generate candidates based on 3-gram overlap."""
    print("  Computing n-gram candidates...")

    # Pre-fetch all tokens
    source_tokens = {}
    target_tokens = {}

    for urn in source_urns:
        source_tokens[urn] = get_tokens_for_passage(conn, urn)

    for urn in target_urns:
        target_tokens[urn] = get_tokens_for_passage(conn, urn)

    candidates = []
    for s_urn in source_urns:
        s_tokens = source_tokens.get(s_urn, [])
        if len(s_tokens) < 3:
            continue

        scored_targets = []
        for t_urn in target_urns:
            if s_urn == t_urn:
                continue
            t_tokens = target_tokens.get(t_urn, [])
            if len(t_tokens) < 3:
                continue

            score = ngram_overlap(s_tokens, t_tokens, n=3)
            if score >= threshold:
                scored_targets.append((t_urn, score))

        # Rank and keep top 10
        scored_targets.sort(key=lambda x: -x[1])
        for rank, (t_urn, score) in enumerate(scored_targets[:10], 1):
            candidates.append({
                'source_urn': s_urn,
                'target_urn': t_urn,
                'method': 'ngram',
                'score': score,
                'rank': rank,
            })

    return candidates

def generate_vector_candidates(conn, source_urns: List[str], target_urns: List[str],
                                threshold: float = 0.7, limit: int = 20) -> List[Dict]:
    """
    Generate candidates using vector similarity.
    Currently skipped - word_embeddings is word-level, not passage-level.
    TODO: Create passage_embeddings table by averaging word vectors.
    """
    print("  Computing vector candidates...")
    print("    Skipping: passage embeddings not yet computed")
    return []

def main():
    print("=" * 60)
    print("LOGOS Intertext Candidate Generation")
    print("=" * 60)

    conn = psycopg2.connect(DATABASE_URL)

    # Get all Greek passages from Synoptic Gospels
    with conn.cursor() as cur:
        cur.execute("""
            SELECT DISTINCT urn FROM passage_tokens
            WHERE language = 'grc'
            ORDER BY urn
        """)
        all_urns = [row[0] for row in cur.fetchall()]

    print(f"Found {len(all_urns)} Greek passages")

    # Separate by work for targeted comparison
    matthew_urns = [u for u in all_urns if '.tlg001:' in u]
    mark_urns = [u for u in all_urns if '.tlg002:' in u]
    luke_urns = [u for u in all_urns if '.tlg003:' in u]

    print(f"  Matthew: {len(matthew_urns)}")
    print(f"  Mark: {len(mark_urns)}")
    print(f"  Luke: {len(luke_urns)}")

    all_candidates = []

    # Generate candidates between synoptic pairs
    pairs = [
        ("Matthew-Mark", matthew_urns[:200], mark_urns[:200]),
        ("Matthew-Luke", matthew_urns[:200], luke_urns[:200]),
        ("Mark-Luke", mark_urns[:200], luke_urns[:200]),
    ]

    for pair_name, source_urns, target_urns in pairs:
        print(f"\n{pair_name}:")

        # Lexical candidates
        lexical = generate_lexical_candidates(conn, source_urns, target_urns)
        all_candidates.extend(lexical)
        print(f"    Lexical: {len(lexical)} candidates")

        # N-gram candidates
        ngram = generate_ngram_candidates(conn, source_urns, target_urns)
        all_candidates.extend(ngram)
        print(f"    N-gram: {len(ngram)} candidates")

        # Vector candidates
        vector = generate_vector_candidates(conn, source_urns, target_urns)
        all_candidates.extend(vector)
        print(f"    Vector: {len(vector)} candidates")

    print(f"\nTotal candidates: {len(all_candidates)}")

    # Insert candidates
    if all_candidates:
        print("Inserting candidates...")
        with conn.cursor() as cur:
            execute_batch(cur, """
                INSERT INTO intertext_candidates (source_urn, target_urn, method, score, rank)
                VALUES (%(source_urn)s, %(target_urn)s, %(method)s, %(score)s, %(rank)s)
                ON CONFLICT (source_urn, target_urn, method)
                DO UPDATE SET score = EXCLUDED.score, rank = EXCLUDED.rank
            """, all_candidates, page_size=100)
        conn.commit()

    # Verify
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM intertext_candidates")
        total = cur.fetchone()[0]
        cur.execute("SELECT method, COUNT(*) FROM intertext_candidates GROUP BY method")
        by_method = dict(cur.fetchall())

    print(f"\n{'=' * 60}")
    print("CANDIDATE GENERATION COMPLETE")
    print(f"  Total candidates: {total}")
    print(f"  By method: {by_method}")
    print(f"{'=' * 60}")

    conn.close()

if __name__ == '__main__':
    main()
