#!/usr/bin/env python3
"""
Compute full intertext evidence for all candidates.
Stage 2 of 2-stage retrieval: validate candidates with detailed evidence.
"""

import os
import sys
import json
import psycopg2
from psycopg2.extras import execute_batch
from typing import Dict, List, Any

# Add parent to path for crews imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from crews.compute.overlap import compute_overlap
from crews.compute.ngrams import find_shared_ngrams, find_longest_common_sequence

DATABASE_URL = os.environ.get('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')


def compute_evidence_for_pair(source_text: str, target_text: str) -> Dict[str, Any]:
    """Compute full evidence bundle for a passage pair."""

    # Basic overlap
    overlap = compute_overlap(source_text, target_text)

    # N-gram analysis
    ngram_2 = find_shared_ngrams(source_text, target_text, n=2)
    ngram_3 = find_shared_ngrams(source_text, target_text, n=3)
    ngram_4 = find_shared_ngrams(source_text, target_text, n=4)

    # Longest common sequences
    common_seqs = find_longest_common_sequence(source_text, target_text, min_length=3)

    # Overall confidence (weighted formula)
    confidence = (
        overlap['word_overlap'] * 0.15 +
        overlap['bigram_overlap'] * 0.25 +
        overlap['trigram_overlap'] * 0.35 +
        ngram_4['overlap_ratio'] * 0.15 +
        (0.1 if len(common_seqs) > 0 else 0)
    )

    # Connection type (rule-based)
    if overlap['trigram_overlap'] > 0.5 or len(common_seqs) >= 3:
        conn_type = 'quotation'
    elif overlap['bigram_overlap'] > 0.3:
        conn_type = 'allusion'
    elif overlap['word_overlap'] > 0.2:
        conn_type = 'echo'
    else:
        conn_type = 'parallel'

    # Directionality (placeholder - needs historical analysis)
    directionality = 'bidirectional'

    return {
        'confidence_score': round(confidence, 4),
        'connection_type': conn_type,
        'directionality': directionality,
        'lexical_overlap': overlap['word_overlap'],
        'function_word_overlap': overlap['word_overlap'] * 0.8,  # Estimate
        'rare_word_overlap': overlap['word_overlap'] * 0.5,  # Estimate
        'semantic_similarity': confidence,  # Use as proxy for now
        'ngram_overlap_2': ngram_2['overlap_ratio'],
        'ngram_overlap_3': ngram_3['overlap_ratio'],
        'ngram_overlap_4': ngram_4['overlap_ratio'],
        'syntax_similarity': overlap['bigram_overlap'],
        'matched_phrases': json.dumps(common_seqs[:10]),
        'shared_rare_words': json.dumps(overlap['shared_words'][:20]),
        'shared_ngrams': json.dumps(ngram_3['shared_ngrams'][:20]),
        'alternative_explanations': json.dumps([
            'Common source tradition',
            'Independent use of similar themes',
            'Scribal harmonization'
        ]),
        'confidence_notes': f'{conn_type}: {len(overlap["shared_words"])} shared words, {len(common_seqs)} common sequences',
        'pipeline_version': 'v3_deterministic',
    }


def main():
    print("=" * 60)
    print("LOGOS Intertext Evidence Computation")
    print("Stage 2: Validating candidates with full evidence")
    print("=" * 60)

    conn = psycopg2.connect(DATABASE_URL)

    # Get all candidates that don't have evidence yet
    with conn.cursor() as cur:
        cur.execute("""
            SELECT ic.source_urn, ic.target_urn, ic.method, ic.score
            FROM intertext_candidates ic
            LEFT JOIN intertext_evidence ie
                ON ic.source_urn = ie.source_urn AND ic.target_urn = ie.target_urn
            WHERE ie.id IS NULL
            ORDER BY ic.score DESC
            -- Process ALL candidates
        """)
        candidates = cur.fetchall()

    print(f"Found {len(candidates)} candidates needing evidence")

    if not candidates:
        print("All candidates already have evidence. Done.")
        return

    # Get all unique URNs
    all_urns = set()
    for source, target, _, _ in candidates:
        all_urns.add(source)
        all_urns.add(target)

    # Fetch all passage texts
    print(f"Fetching {len(all_urns)} passages...")
    passage_texts = {}
    with conn.cursor() as cur:
        cur.execute("""
            SELECT urn, content FROM source_texts WHERE urn = ANY(%s)
        """, (list(all_urns),))
        for urn, content in cur.fetchall():
            passage_texts[urn] = content

    print(f"  Loaded {len(passage_texts)} passage texts")

    # Compute evidence for each candidate
    evidence_records = []
    skipped = 0

    for i, (source_urn, target_urn, method, score) in enumerate(candidates):
        source_text = passage_texts.get(source_urn)
        target_text = passage_texts.get(target_urn)

        if not source_text or not target_text:
            skipped += 1
            continue

        # Compute evidence
        evidence = compute_evidence_for_pair(source_text, target_text)
        evidence['source_urn'] = source_urn
        evidence['target_urn'] = target_urn

        evidence_records.append(evidence)

        if (i + 1) % 50 == 0:
            print(f"  Processed {i + 1}/{len(candidates)} candidates")

    print(f"\nComputed evidence for {len(evidence_records)} pairs (skipped {skipped})")

    # Insert evidence
    if evidence_records:
        print("Inserting evidence records...")
        with conn.cursor() as cur:
            execute_batch(cur, """
                INSERT INTO intertext_evidence
                (source_urn, target_urn, confidence_score, connection_type, directionality,
                 lexical_overlap, function_word_overlap, rare_word_overlap, semantic_similarity,
                 ngram_overlap_2, ngram_overlap_3, ngram_overlap_4, syntax_similarity,
                 matched_phrases, shared_rare_words, shared_ngrams,
                 alternative_explanations, confidence_notes, pipeline_version)
                VALUES (
                    %(source_urn)s, %(target_urn)s, %(confidence_score)s, %(connection_type)s, %(directionality)s,
                    %(lexical_overlap)s, %(function_word_overlap)s, %(rare_word_overlap)s, %(semantic_similarity)s,
                    %(ngram_overlap_2)s, %(ngram_overlap_3)s, %(ngram_overlap_4)s, %(syntax_similarity)s,
                    %(matched_phrases)s, %(shared_rare_words)s, %(shared_ngrams)s,
                    %(alternative_explanations)s, %(confidence_notes)s, %(pipeline_version)s
                )
                ON CONFLICT (source_urn, target_urn) DO UPDATE SET
                    confidence_score = EXCLUDED.confidence_score,
                    connection_type = EXCLUDED.connection_type,
                    lexical_overlap = EXCLUDED.lexical_overlap,
                    ngram_overlap_3 = EXCLUDED.ngram_overlap_3,
                    matched_phrases = EXCLUDED.matched_phrases,
                    shared_rare_words = EXCLUDED.shared_rare_words,
                    pipeline_version = EXCLUDED.pipeline_version,
                    computed_at = NOW()
            """, evidence_records, page_size=50)
        conn.commit()

    # Verify and report
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM intertext_evidence")
        total_evidence = cur.fetchone()[0]

        cur.execute("""
            SELECT connection_type, COUNT(*), AVG(confidence_score)::numeric(4,2)
            FROM intertext_evidence
            GROUP BY connection_type
            ORDER BY COUNT(*) DESC
        """)
        type_dist = cur.fetchall()

    print(f"\n{'=' * 60}")
    print("EVIDENCE COMPUTATION COMPLETE")
    print(f"  Total evidence records: {total_evidence}")
    print(f"\n  Distribution by type:")
    for conn_type, count, avg_conf in type_dist:
        print(f"    {conn_type}: {count} (avg confidence: {avg_conf})")
    print(f"{'=' * 60}")

    conn.close()


if __name__ == '__main__':
    main()
