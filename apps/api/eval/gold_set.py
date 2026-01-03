#!/usr/bin/env python3
"""
Gold Set Management for Translation Evaluation

Creates and manages the stratified gold set for translation quality evaluation.
Samples passages across genres, authors, translators for representative coverage.
"""

import asyncio
import asyncpg
import json
from datetime import datetime
from typing import Any, Dict, List, Optional
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_URL = "postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway"
GOLD_SET_PATH = Path('/Users/royvaid/Downloads/logos/apps/api/eval/gold_translation_set.json')


async def create_gold_set_sample(
    n_samples: int = 200,
    output_path: Path = None
) -> Dict[str, Any]:
    """
    Create a stratified gold set sample for translation evaluation.

    Stratification:
    - By genre (if available)
    - By author
    - By translator
    - By language pair

    Each sample includes fields for future human labels.
    """
    if output_path is None:
        output_path = GOLD_SET_PATH

    logger.info("Creating stratified gold set sample...")

    conn = await asyncpg.connect(DB_URL)

    try:
        # Get distribution info first
        genres = await conn.fetch("""
            SELECT DISTINCT w.genre, COUNT(*) as cnt
            FROM translations t
            JOIN source_texts s ON t.source_text_id = s.id
            JOIN works w ON s.work_id = w.id
            WHERE w.genre IS NOT NULL
            GROUP BY w.genre
            ORDER BY cnt DESC
            LIMIT 10
        """)

        translators = await conn.fetch("""
            SELECT tr.id, tr.name, COUNT(*) as cnt
            FROM translations t
            JOIN translators tr ON t.translator_id = tr.id
            GROUP BY tr.id, tr.name
            ORDER BY cnt DESC
            LIMIT 20
        """)

        logger.info(f"Found {len(genres)} genres, {len(translators)} translators")

        # Stratified sampling: aim for even distribution
        samples_per_stratum = max(5, n_samples // (len(translators) + 1))

        samples = []

        # Sample per translator
        for tr in translators:
            tr_samples = await conn.fetch("""
                SELECT
                    t.id as translation_id,
                    t.text_content as translation_text,
                    t.translator_id,
                    $3 as translator_name,
                    s.text_content as source_text,
                    s.reference as source_reference,
                    s.language as source_language,
                    w.title as work_title,
                    w.genre as genre,
                    a.name as author_name
                FROM translations t
                JOIN source_texts s ON t.source_text_id = s.id
                LEFT JOIN works w ON s.work_id = w.id
                LEFT JOIN authors a ON w.author_id = a.id
                WHERE t.translator_id = $1
                  AND t.text_content IS NOT NULL
                  AND LENGTH(t.text_content) > 50
                ORDER BY RANDOM()
                LIMIT $2
            """, tr['id'], samples_per_stratum, tr['name'])

            for sample in tr_samples:
                samples.append({
                    'translation_id': sample['translation_id'],
                    'source_text': sample['source_text'][:500] if sample['source_text'] else "",
                    'translation_text': sample['translation_text'][:500] if sample['translation_text'] else "",
                    'source_reference': sample['source_reference'],
                    'source_language': sample['source_language'] or 'greek',
                    'translator_id': sample['translator_id'],
                    'translator_name': sample['translator_name'],
                    'work_title': sample['work_title'],
                    'genre': sample['genre'] or 'unknown',
                    'author_name': sample['author_name'],
                    # Future human label fields
                    'human_semantic_score': None,
                    'human_fluency_score': None,
                    'human_overall_score': None,
                    'human_notes': None,
                    'reviewed_by': None,
                    'reviewed_at': None
                })

        # Shuffle and limit to requested size
        import random
        random.seed(42)  # Reproducible
        random.shuffle(samples)
        samples = samples[:n_samples]

        gold_set = {
            'version': '1.0',
            'created_at': datetime.now().isoformat(),
            'n_samples': len(samples),
            'stratification': {
                'genres': [{'genre': g['genre'], 'count': g['cnt']} for g in genres],
                'translators': [{'name': t['name'], 'count': t['cnt']} for t in translators[:10]]
            },
            'samples': samples
        }

        # Save to file
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w') as f:
            json.dump(gold_set, f, indent=2)

        logger.info(f"Created gold set with {len(samples)} samples")
        logger.info(f"Saved to {output_path}")

        return gold_set

    finally:
        await conn.close()


def load_gold_set(path: Path = None) -> Dict[str, Any]:
    """Load the gold set from file."""
    if path is None:
        path = GOLD_SET_PATH

    if not path.exists():
        raise FileNotFoundError(f"Gold set not found at {path}. Run create_gold_set_sample() first.")

    with open(path, 'r') as f:
        return json.load(f)


async def add_human_labels(
    translation_id: int,
    semantic_score: Optional[float] = None,
    fluency_score: Optional[float] = None,
    overall_score: Optional[float] = None,
    notes: Optional[str] = None,
    reviewer: str = "anonymous"
) -> bool:
    """
    Add human labels to a sample in the gold set.
    """
    try:
        gold_set = load_gold_set()
    except FileNotFoundError:
        logger.error("Gold set not found")
        return False

    # Find and update the sample
    for sample in gold_set['samples']:
        if sample['translation_id'] == translation_id:
            if semantic_score is not None:
                sample['human_semantic_score'] = semantic_score
            if fluency_score is not None:
                sample['human_fluency_score'] = fluency_score
            if overall_score is not None:
                sample['human_overall_score'] = overall_score
            if notes is not None:
                sample['human_notes'] = notes
            sample['reviewed_by'] = reviewer
            sample['reviewed_at'] = datetime.now().isoformat()

            # Save updated gold set
            with open(GOLD_SET_PATH, 'w') as f:
                json.dump(gold_set, f, indent=2)

            logger.info(f"Updated labels for translation {translation_id}")
            return True

    logger.warning(f"Translation {translation_id} not found in gold set")
    return False


def get_gold_set_statistics() -> Dict[str, Any]:
    """Get statistics about the gold set, including label coverage."""
    try:
        gold_set = load_gold_set()
    except FileNotFoundError:
        return {'error': 'Gold set not found'}

    samples = gold_set['samples']
    labeled = [s for s in samples if s.get('human_overall_score') is not None]

    # Genre distribution
    genre_dist = {}
    translator_dist = {}

    for s in samples:
        genre = s.get('genre', 'unknown')
        genre_dist[genre] = genre_dist.get(genre, 0) + 1

        translator = s.get('translator_name', 'unknown')
        translator_dist[translator] = translator_dist.get(translator, 0) + 1

    return {
        'version': gold_set.get('version'),
        'created_at': gold_set.get('created_at'),
        'total_samples': len(samples),
        'labeled_samples': len(labeled),
        'label_coverage': len(labeled) / len(samples) if samples else 0,
        'genre_distribution': genre_dist,
        'translator_distribution': dict(sorted(translator_dist.items(), key=lambda x: -x[1])[:10])
    }


if __name__ == "__main__":
    # Create gold set
    result = asyncio.run(create_gold_set_sample(n_samples=200))
    print(f"\nCreated gold set with {result['n_samples']} samples")

    # Print statistics
    stats = get_gold_set_statistics()
    print(f"\nGold Set Statistics:")
    print(f"  Total samples: {stats['total_samples']}")
    print(f"  Labeled: {stats['labeled_samples']}")
    print(f"  Genres: {len(stats['genre_distribution'])}")
    print(f"  Translators: {len(stats['translator_distribution'])}")
