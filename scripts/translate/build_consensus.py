#!/usr/bin/env python3
"""
LOGOS Consensus Builder
Phase 3: Build neutral consensus translations from multiple translations

This script:
1. Finds passages with multiple translations
2. Computes a consensus "neutral core" translation
3. Stores in passage_consensus table
4. Computes consensus embeddings
"""

import os
import sys
import re
import json
import asyncio
from datetime import datetime
from typing import List, Dict, Optional, Tuple
from collections import Counter
import asyncpg
import numpy as np

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

LOGS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'logs')


def clean_text(text: str) -> str:
    """Clean translation text."""
    if not text:
        return ""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    text = ' '.join(text.split())
    return text.strip()


def compute_word_consensus(translations: List[str]) -> str:
    """
    Compute a consensus translation from multiple translations.

    Strategy:
    1. Split each translation into sentences
    2. For each position, vote on most common words
    3. Reconstruct the consensus

    For a simple approach, we use the translation that is most
    similar to all others (median translation).
    """
    if not translations:
        return ""

    if len(translations) == 1:
        return clean_text(translations[0])

    # Clean all translations
    cleaned = [clean_text(t) for t in translations if t]
    cleaned = [c for c in cleaned if c]  # Remove empty

    if not cleaned:
        return ""

    if len(cleaned) == 1:
        return cleaned[0]

    # Simple approach: use the "median" translation
    # (the one most similar to all others by word overlap)

    def word_overlap(t1: str, t2: str) -> float:
        """Compute word overlap between two translations."""
        words1 = set(t1.lower().split())
        words2 = set(t2.lower().split())
        if not words1 or not words2:
            return 0.0
        intersection = words1 & words2
        union = words1 | words2
        return len(intersection) / len(union)

    # Compute similarity matrix
    n = len(cleaned)
    similarities = []

    for i, t1 in enumerate(cleaned):
        total_sim = sum(word_overlap(t1, t2) for j, t2 in enumerate(cleaned) if i != j)
        avg_sim = total_sim / (n - 1) if n > 1 else 0
        similarities.append((avg_sim, i, t1))

    # Sort by similarity (descending) and return the most representative
    similarities.sort(reverse=True)
    return similarities[0][2]


def detect_theological_choices(text: str, source_lang: str) -> Dict[str, str]:
    """
    Detect theological translation choices.
    E.g., יהוה -> "the LORD" or "Yahweh"
    """
    choices = {}

    if source_lang == 'hebrew':
        # Check for divine name translations
        if 'the LORD' in text or 'the Lord' in text:
            choices['יהוה'] = 'the LORD'
        elif 'Yahweh' in text or 'YHWH' in text:
            choices['יהוה'] = 'Yahweh'

        if 'God' in text:
            choices['אלהים'] = 'God'

    return choices


async def compute_embedding_average(conn, translation_ids: List[int]) -> Optional[List[float]]:
    """
    Compute average embedding from multiple translations.
    Returns the centroid embedding.
    """
    rows = await conn.fetch("""
        SELECT embedding FROM translations
        WHERE id = ANY($1) AND embedding IS NOT NULL
    """, translation_ids)

    if not rows:
        return None

    embeddings = []
    for row in rows:
        if row['embedding']:
            try:
                # The embedding is stored as vector type
                emb = list(row['embedding'])
                if len(emb) == 768:
                    embeddings.append(emb)
            except:
                pass

    if not embeddings:
        return None

    # Compute centroid
    centroid = np.mean(embeddings, axis=0)
    # Normalize
    norm = np.linalg.norm(centroid)
    if norm > 0:
        centroid = centroid / norm

    return centroid.tolist()


class ConsensusBuilder:
    def __init__(self, conn: asyncpg.Connection):
        self.conn = conn
        self.consensus_count = 0
        self.single_count = 0

    async def get_multi_translation_passages(self) -> List[dict]:
        """Get all passages with 2+ translations."""
        print("Finding passages with multiple translations...")
        rows = await self.conn.fetch("""
            SELECT text_id, COUNT(*) as trans_count
            FROM translations
            WHERE text_id IS NOT NULL
            GROUP BY text_id
            HAVING COUNT(*) >= 2
            ORDER BY trans_count DESC
        """)
        print(f"Found {len(rows)} passages with 2+ translations")
        return rows

    async def get_single_translation_passages(self) -> List[dict]:
        """Get all passages with exactly 1 translation."""
        print("Finding passages with single translations...")
        rows = await self.conn.fetch("""
            SELECT text_id
            FROM translations
            WHERE text_id IS NOT NULL
            GROUP BY text_id
            HAVING COUNT(*) = 1
        """)
        print(f"Found {len(rows)} passages with 1 translation")
        return rows

    async def build_consensus_for_passage(self, text_id: int) -> Optional[dict]:
        """Build consensus for a single passage."""
        # Get all translations for this passage
        trans_rows = await self.conn.fetch("""
            SELECT t.id, t.translation, t.style,
                   st.urn, st.language, st.content
            FROM translations t
            JOIN source_texts st ON t.text_id = st.id
            WHERE t.text_id = $1
        """, text_id)

        if not trans_rows:
            return None

        # Extract data
        translations = [r['translation'] for r in trans_rows if r['translation']]
        source_lang = trans_rows[0]['language']
        source_text = trans_rows[0]['content']
        urn = trans_rows[0]['urn'] or f"text:{text_id}"
        translation_ids = [r['id'] for r in trans_rows]

        # Compute consensus
        consensus_text = compute_word_consensus(translations)

        if not consensus_text:
            return None

        # Detect theological choices
        theological_choices = detect_theological_choices(consensus_text, source_lang)

        # Compute consensus embedding (average of all translation embeddings)
        consensus_embedding = await compute_embedding_average(self.conn, translation_ids)

        return {
            'urn': urn,
            'source_language': source_lang,
            'source_text': clean_text(source_text) if source_text else '',
            'consensus_translation': consensus_text,
            'confidence': min(0.9, 0.5 + (len(translations) * 0.1)),  # Higher confidence with more translations
            'contributor_count': len(translations),
            'embedding': consensus_embedding,
            'theological_choices': theological_choices
        }

    async def build_single_consensus(self, text_id: int) -> Optional[dict]:
        """Build consensus entry for single-translation passage."""
        row = await self.conn.fetchrow("""
            SELECT t.id, t.translation, t.style, t.embedding,
                   st.urn, st.language, st.content
            FROM translations t
            JOIN source_texts st ON t.text_id = st.id
            WHERE t.text_id = $1
            LIMIT 1
        """, text_id)

        if not row or not row['translation']:
            return None

        source_lang = row['language']
        source_text = row['content']
        urn = row['urn'] or f"text:{text_id}"

        translation = clean_text(row['translation'])
        theological_choices = detect_theological_choices(translation, source_lang)

        embedding = None
        if row['embedding']:
            try:
                embedding = list(row['embedding'])
            except:
                pass

        return {
            'urn': urn,
            'source_language': source_lang,
            'source_text': clean_text(source_text) if source_text else '',
            'consensus_translation': translation,
            'confidence': 0.5,  # Single translation = lower confidence
            'contributor_count': 1,
            'embedding': embedding,
            'theological_choices': theological_choices
        }

    async def save_consensus(self, consensus: dict):
        """Save consensus to database."""
        # Format embedding for pgvector - must be proper format
        embedding_param = None
        if consensus['embedding'] and isinstance(consensus['embedding'], list):
            try:
                # Ensure we have a flat list of floats
                emb_list = [float(x) for x in consensus['embedding']]
                if len(emb_list) == 768:
                    embedding_param = '[' + ','.join(f'{x:.8f}' for x in emb_list) + ']'
            except (TypeError, ValueError):
                pass

        theological_json = None
        if consensus.get('theological_choices'):
            theological_json = json.dumps(consensus['theological_choices'])

        await self.conn.execute("""
            INSERT INTO passage_consensus
                (urn, source_language, source_text, consensus_translation,
                 confidence, contributor_count, embedding, theological_choices)
            VALUES ($1, $2, $3, $4, $5, $6, $7::vector, $8::jsonb)
            ON CONFLICT (urn) DO UPDATE SET
                consensus_translation = EXCLUDED.consensus_translation,
                confidence = EXCLUDED.confidence,
                contributor_count = EXCLUDED.contributor_count,
                embedding = EXCLUDED.embedding,
                theological_choices = EXCLUDED.theological_choices,
                updated_at = CURRENT_TIMESTAMP
        """, consensus['urn'], consensus['source_language'],
            consensus['source_text'], consensus['consensus_translation'],
            consensus['confidence'], consensus['contributor_count'],
            embedding_param, theological_json)

    async def build(self):
        """Main build process."""
        print("=" * 60)
        print("LOGOS Consensus Builder - Phase 3")
        print("=" * 60)
        print()

        # Process multi-translation passages first
        multi_passages = await self.get_multi_translation_passages()

        print(f"\nProcessing {len(multi_passages)} multi-translation passages...")
        for i, row in enumerate(multi_passages):
            consensus = await self.build_consensus_for_passage(row['text_id'])
            if consensus:
                await self.save_consensus(consensus)
                self.consensus_count += 1

            if (i + 1) % 50 == 0:
                print(f"  Processed {i + 1}/{len(multi_passages)} multi-translation passages...")

        # Process single-translation passages
        single_passages = await self.get_single_translation_passages()

        print(f"\nProcessing {len(single_passages)} single-translation passages...")
        for i, row in enumerate(single_passages):
            consensus = await self.build_single_consensus(row['text_id'])
            if consensus:
                await self.save_consensus(consensus)
                self.single_count += 1

            if (i + 1) % 50 == 0:
                print(f"  Processed {i + 1}/{len(single_passages)} single-translation passages...")

        # Record evidence
        await self.conn.execute("""
            INSERT INTO evidence_trails
                (entity_type, entity_id, action, actor, evidence)
            VALUES ($1, $2, $3, $4, $5)
        """, 'passage_consensus', 'phase3_build', 'created', 'system:consensus_builder',
            json.dumps({
                'multi_translation_count': self.consensus_count,
                'single_translation_count': self.single_count,
                'total_consensus': self.consensus_count + self.single_count,
                'build_time': datetime.now().isoformat()
            }))

        print()
        print("=" * 60)
        print("Consensus Build Complete!")
        print(f"  Multi-translation consensus: {self.consensus_count:,}")
        print(f"  Single-translation entries: {self.single_count:,}")
        print(f"  Total: {self.consensus_count + self.single_count:,}")
        print("=" * 60)


async def main():
    os.makedirs(LOGS_DIR, exist_ok=True)

    # Connect
    conn = None
    for ssl_mode in [False, 'prefer', 'require']:
        try:
            conn = await asyncpg.connect(DATABASE_URL, ssl=ssl_mode)
            print(f"Connected with ssl={ssl_mode}")
            break
        except Exception as e:
            print(f"Connection with ssl={ssl_mode} failed: {e}")
            continue

    if conn is None:
        print("Could not connect to database")
        sys.exit(1)

    try:
        builder = ConsensusBuilder(conn)
        await builder.build()
    except Exception as e:
        print(f"Build failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        await conn.close()


if __name__ == '__main__':
    asyncio.run(main())
