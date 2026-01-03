#!/usr/bin/env python3
"""
Extract named entities from passages using dictionary matching.
Fast, deterministic entity extraction.
"""

import os
import re
import psycopg2
from psycopg2.extras import execute_batch
from typing import Dict, List, Set

DATABASE_URL = os.environ.get('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')


def build_entity_patterns(conn) -> Dict[str, int]:
    """Build regex patterns from named_entities table."""
    patterns = {}

    with conn.cursor() as cur:
        cur.execute("""
            SELECT id, canonical_name, aliases FROM named_entities
        """)
        for entity_id, canonical, aliases in cur.fetchall():
            # Add canonical name
            patterns[canonical] = entity_id
            # Add aliases
            if aliases:
                for alias in aliases:
                    if alias:
                        patterns[alias] = entity_id

    return patterns


def find_entities_in_text(text: str, patterns: Dict[str, int]) -> List[Dict]:
    """Find all entity mentions in text."""
    mentions = []

    for pattern, entity_id in patterns.items():
        # Use word boundaries for matching
        regex = re.compile(r'\b' + re.escape(pattern) + r'\b', re.IGNORECASE)
        for match in regex.finditer(text):
            mentions.append({
                'entity_id': entity_id,
                'mention_text': match.group(),
                'char_start': match.start(),
                'char_end': match.end(),
            })

    return mentions


def main():
    print("=" * 60)
    print("LOGOS Entity Extraction")
    print("=" * 60)

    conn = psycopg2.connect(DATABASE_URL)

    # Build patterns from database
    print("Building entity patterns...")
    patterns = build_entity_patterns(conn)
    print(f"  Loaded {len(patterns)} entity patterns")

    # Get all passages
    with conn.cursor() as cur:
        cur.execute("""
            SELECT urn, content FROM source_texts
            WHERE language = 'greek' AND content IS NOT NULL
        """)
        passages = cur.fetchall()

    print(f"Processing {len(passages)} passages...")

    all_mentions = []
    passages_with_entities = 0

    for i, (urn, content) in enumerate(passages):
        mentions = find_entities_in_text(content, patterns)

        if mentions:
            passages_with_entities += 1
            for mention in mentions:
                mention['urn'] = urn
                mention['confidence'] = 0.9
                mention['source'] = 'dictionary'
                all_mentions.append(mention)

        if (i + 1) % 500 == 0:
            print(f"  Processed {i + 1}/{len(passages)} passages ({len(all_mentions)} mentions)")

    print(f"\nFound {len(all_mentions)} mentions in {passages_with_entities} passages")

    # Insert mentions
    if all_mentions:
        print("Inserting entity mentions...")
        with conn.cursor() as cur:
            execute_batch(cur, """
                INSERT INTO entity_mentions (urn, entity_id, mention_text, char_start, char_end, confidence, source)
                VALUES (%(urn)s, %(entity_id)s, %(mention_text)s, %(char_start)s, %(char_end)s, %(confidence)s, %(source)s)
                ON CONFLICT (urn, entity_id, char_start) DO NOTHING
            """, all_mentions, page_size=100)
        conn.commit()

    # Verify
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM entity_mentions")
        total = cur.fetchone()[0]

        cur.execute("""
            SELECT ne.entity_type, COUNT(*)
            FROM entity_mentions em
            JOIN named_entities ne ON em.entity_id = ne.id
            GROUP BY ne.entity_type
            ORDER BY COUNT(*) DESC
        """)
        type_dist = cur.fetchall()

    print(f"\n{'=' * 60}")
    print("ENTITY EXTRACTION COMPLETE")
    print(f"  Total mentions: {total}")
    print(f"\n  By type:")
    for entity_type, count in type_dist:
        print(f"    {entity_type}: {count}")
    print(f"{'=' * 60}")

    conn.close()


if __name__ == '__main__':
    main()
