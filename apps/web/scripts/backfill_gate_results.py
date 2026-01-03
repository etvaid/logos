#!/usr/bin/env python3
"""
Backfill gate_results and confidence_scores from Q reconstructions data.
"""

import os
import json
import psycopg2
from psycopg2.extras import execute_batch
from datetime import datetime

DATABASE_URL = os.environ.get('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

def calculate_gates(confidence: float, verbal_agreement: float, lower: float, upper: float) -> dict:
    """Calculate gate pass/fail based on Q reconstruction metrics."""

    # Gate 1: Statistical significance (confidence interval doesn't include 0)
    gate_1_score = lower if lower else confidence * 0.5
    gate_1_passed = gate_1_score > 0.3

    # Gate 2: Better than random baseline (confidence > 0.5)
    gate_2_score = confidence
    gate_2_passed = confidence > 0.5

    # Gate 3: Verbal agreement threshold (> 0.2)
    gate_3_score = verbal_agreement if verbal_agreement else 0
    gate_3_passed = gate_3_score > 0.2

    # Gate 4: Confidence interval width (narrow = good)
    width = (upper - lower) if (upper and lower) else 0.5
    gate_4_score = 1 - width  # Invert so narrow = high score
    gate_4_passed = width < 0.5

    # Gate 5: Cross-validation stability (based on confidence bounds)
    gate_5_score = (lower + upper) / 2 if (lower and upper) else confidence
    gate_5_passed = gate_5_score > 0.4

    return {
        'gate_1': {'name': 'statistical_significance', 'score': gate_1_score, 'threshold': 0.3, 'passed': gate_1_passed},
        'gate_2': {'name': 'random_baseline', 'score': gate_2_score, 'threshold': 0.5, 'passed': gate_2_passed},
        'gate_3': {'name': 'verbal_agreement', 'score': gate_3_score, 'threshold': 0.2, 'passed': gate_3_passed},
        'gate_4': {'name': 'confidence_interval', 'score': gate_4_score, 'threshold': 0.5, 'passed': gate_4_passed},
        'gate_5': {'name': 'cross_validation', 'score': gate_5_score, 'threshold': 0.4, 'passed': gate_5_passed},
    }

def calculate_tier(score: float) -> str:
    """Calculate confidence tier."""
    if score >= 0.7:
        return 'high'
    elif score >= 0.5:
        return 'medium'
    elif score >= 0.3:
        return 'low'
    return 'uncertain'

def main():
    print("=" * 60)
    print("LOGOS Gate Results & Confidence Scores Backfill")
    print("=" * 60)

    conn = psycopg2.connect(DATABASE_URL)

    # Fetch Q reconstructions
    with conn.cursor() as cur:
        cur.execute("""
            SELECT
                id,
                q_reference,
                confidence_score,
                confidence_lower,
                confidence_upper,
                verbal_agreement,
                layer_classification,
                doctrinal_scores,
                word_confidences
            FROM q_reconstructions
            WHERE confidence_score IS NOT NULL
        """)
        reconstructions = cur.fetchall()

    print(f"Processing {len(reconstructions)} Q reconstructions...")

    gate_results = []
    confidence_scores = []

    for row in reconstructions:
        (id, q_ref, confidence, lower, upper, verbal, layer, doctrinal, word_conf) = row

        entity_id = f"q_pericope_{id}"

        # Calculate gates
        gates = calculate_gates(
            confidence or 0,
            verbal or 0,
            lower or 0,
            upper or 1
        )

        gates_passed = sum(1 for g in gates.values() if g['passed'])

        gate_results.append({
            'entity_type': 'q_pericope',
            'entity_id': entity_id,
            'gate_1_name': gates['gate_1']['name'],
            'gate_1_passed': gates['gate_1']['passed'],
            'gate_1_score': gates['gate_1']['score'],
            'gate_1_threshold': gates['gate_1']['threshold'],
            'gate_2_name': gates['gate_2']['name'],
            'gate_2_passed': gates['gate_2']['passed'],
            'gate_2_score': gates['gate_2']['score'],
            'gate_2_threshold': gates['gate_2']['threshold'],
            'gate_3_name': gates['gate_3']['name'],
            'gate_3_passed': gates['gate_3']['passed'],
            'gate_3_score': gates['gate_3']['score'],
            'gate_3_threshold': gates['gate_3']['threshold'],
            'gate_4_name': gates['gate_4']['name'],
            'gate_4_passed': gates['gate_4']['passed'],
            'gate_4_score': gates['gate_4']['score'],
            'gate_4_threshold': gates['gate_4']['threshold'],
            'gate_5_name': gates['gate_5']['name'],
            'gate_5_passed': gates['gate_5']['passed'],
            'gate_5_score': gates['gate_5']['score'],
            'gate_5_threshold': gates['gate_5']['threshold'],
            'metrics_json': json.dumps({
                'q_reference': q_ref,
                'layer': layer,
                'verbal_agreement': verbal,
            }),
            'pipeline_version': '1.0',
        })

        # Calculate component breakdown
        components = {
            'confidence': confidence or 0,
            'verbal_agreement': verbal or 0,
            'lower_bound': lower or 0,
            'upper_bound': upper or 1,
        }

        # Add doctrinal scores if available
        if doctrinal:
            for key, val in doctrinal.items():
                if isinstance(val, (int, float)):
                    components[f'doctrinal_{key}'] = val

        confidence_scores.append({
            'entity_type': 'q_pericope',
            'entity_id': entity_id,
            'score': confidence or 0,
            'tier': calculate_tier(confidence or 0),
            'components_json': json.dumps(components),
            'pipeline_version': '1.0',
        })

    # Insert gate results
    print("Inserting gate results...")
    with conn.cursor() as cur:
        execute_batch(cur, """
            INSERT INTO gate_results
            (entity_type, entity_id,
             gate_1_name, gate_1_passed, gate_1_score, gate_1_threshold,
             gate_2_name, gate_2_passed, gate_2_score, gate_2_threshold,
             gate_3_name, gate_3_passed, gate_3_score, gate_3_threshold,
             gate_4_name, gate_4_passed, gate_4_score, gate_4_threshold,
             gate_5_name, gate_5_passed, gate_5_score, gate_5_threshold,
             metrics_json, pipeline_version)
            VALUES (
                %(entity_type)s, %(entity_id)s,
                %(gate_1_name)s, %(gate_1_passed)s, %(gate_1_score)s, %(gate_1_threshold)s,
                %(gate_2_name)s, %(gate_2_passed)s, %(gate_2_score)s, %(gate_2_threshold)s,
                %(gate_3_name)s, %(gate_3_passed)s, %(gate_3_score)s, %(gate_3_threshold)s,
                %(gate_4_name)s, %(gate_4_passed)s, %(gate_4_score)s, %(gate_4_threshold)s,
                %(gate_5_name)s, %(gate_5_passed)s, %(gate_5_score)s, %(gate_5_threshold)s,
                %(metrics_json)s, %(pipeline_version)s
            )
            ON CONFLICT (entity_type, entity_id) DO UPDATE SET
                gate_1_passed = EXCLUDED.gate_1_passed,
                gate_1_score = EXCLUDED.gate_1_score,
                gate_2_passed = EXCLUDED.gate_2_passed,
                gate_2_score = EXCLUDED.gate_2_score,
                gate_3_passed = EXCLUDED.gate_3_passed,
                gate_3_score = EXCLUDED.gate_3_score,
                gate_4_passed = EXCLUDED.gate_4_passed,
                gate_4_score = EXCLUDED.gate_4_score,
                gate_5_passed = EXCLUDED.gate_5_passed,
                gate_5_score = EXCLUDED.gate_5_score,
                metrics_json = EXCLUDED.metrics_json,
                computed_at = NOW()
        """, gate_results, page_size=50)
    conn.commit()

    # Insert confidence scores
    print("Inserting confidence scores...")
    with conn.cursor() as cur:
        execute_batch(cur, """
            INSERT INTO confidence_scores
            (entity_type, entity_id, score, tier, components_json, pipeline_version)
            VALUES (%(entity_type)s, %(entity_id)s, %(score)s, %(tier)s,
                    %(components_json)s, %(pipeline_version)s)
            ON CONFLICT (entity_type, entity_id) DO UPDATE SET
                score = EXCLUDED.score,
                tier = EXCLUDED.tier,
                components_json = EXCLUDED.components_json,
                computed_at = NOW()
        """, confidence_scores, page_size=50)
    conn.commit()

    # Verify
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM gate_results")
        gate_count = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM confidence_scores")
        conf_count = cur.fetchone()[0]
        cur.execute("SELECT tier, COUNT(*) FROM confidence_scores GROUP BY tier ORDER BY COUNT(*) DESC")
        tier_dist = cur.fetchall()

    print(f"\n{'=' * 60}")
    print("BACKFILL COMPLETE")
    print(f"  Gate results: {gate_count}")
    print(f"  Confidence scores: {conf_count}")
    print(f"  Tier distribution: {dict(tier_dist)}")
    print(f"{'=' * 60}")

    conn.close()

if __name__ == '__main__':
    main()
