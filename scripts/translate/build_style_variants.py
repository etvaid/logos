#!/usr/bin/env python3
"""
LOGOS Style Variant Builder
Phase 4: Create 4 style variants for each consensus translation

Styles:
- scholarly: Technical, preserves original structure, includes notes
- literary: Natural, flowing prose
- accessible: Simple vocabulary, shorter sentences
- literal: Word-for-word, close to source

Since most existing translations are "literal" style, we:
1. Use existing translations where they match the passage
2. Generate derived variants using text transformations
"""

import os
import sys
import re
import json
import asyncio
from datetime import datetime
from typing import List, Dict, Optional
import asyncpg

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

LOGS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'logs')

# Style definitions
STYLES = ['scholarly', 'literary', 'accessible', 'literal']


def simplify_vocabulary(text: str) -> str:
    """
    Create accessible version by simplifying vocabulary.
    This is a basic transformation - production would use better NLP.
    """
    # Common simplifications for classical texts
    simplifications = {
        r'\bthus\b': 'so',
        r'\bhence\b': 'therefore',
        r'\bwhence\b': 'from where',
        r'\bwherefore\b': 'why',
        r'\bhither\b': 'here',
        r'\bthither\b': 'there',
        r'\bwhither\b': 'where',
        r'\bdoth\b': 'does',
        r'\bhath\b': 'has',
        r'\bshall\b': 'will',
        r'\bart\b': 'are',
        r'\bthee\b': 'you',
        r'\bthou\b': 'you',
        r'\bthy\b': 'your',
        r'\bthine\b': 'yours',
        r'\bunto\b': 'to',
        r'\bwithal\b': 'with',
        r'\bverily\b': 'truly',
        r'\bbehold\b': 'look',
        r'\blamentations\b': 'sorrows',
        r'\bbesought\b': 'begged',
        r'\bsupplication\b': 'prayer',
        r'\bwroth\b': 'angry',
        r'\bsmote\b': 'struck',
        r'\bslew\b': 'killed',
        r'\bbegat\b': 'fathered',
        r'\bbegotten\b': 'born',
    }

    result = text
    for pattern, replacement in simplifications.items():
        result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)

    return result


def make_literary(text: str) -> str:
    """
    Create literary version by improving flow.
    Basic transformation - production would use better NLP.
    """
    # Remove excessive punctuation
    result = re.sub(r';', ',', text)

    # Break up very long sentences
    words = text.split()
    if len(words) > 50:
        # Find a good breaking point
        mid = len(words) // 2
        # Look for comma near middle
        for i in range(mid - 5, mid + 5):
            if i < len(words) and words[i].endswith(','):
                words[i] = words[i][:-1] + '.'
                if i + 1 < len(words):
                    words[i + 1] = words[i + 1].capitalize()
                break
        result = ' '.join(words)

    return result


def make_scholarly(text: str) -> str:
    """
    Create scholarly version by preserving structure.
    Basic transformation - production would add notes and references.
    """
    # Preserve original but normalize
    result = text.strip()

    # Add implicit subjects in brackets for clarity (simplified)
    if result.startswith(('And ', 'But ', 'For ', 'So ')):
        pass  # Keep connectives for scholarly context

    return result


def create_style_variant(consensus_text: str, style: str) -> str:
    """Generate a style variant from consensus."""
    if style == 'literal':
        return consensus_text  # Consensus is already neutral/literal

    elif style == 'accessible':
        return simplify_vocabulary(consensus_text)

    elif style == 'literary':
        return make_literary(consensus_text)

    elif style == 'scholarly':
        return make_scholarly(consensus_text)

    return consensus_text


class StyleVariantBuilder:
    def __init__(self, conn: asyncpg.Connection):
        self.conn = conn
        self.variant_count = 0

    async def get_consensus_entries(self) -> List[dict]:
        """Get all consensus entries."""
        print("Fetching consensus entries...")
        rows = await self.conn.fetch("""
            SELECT id, urn, source_language, consensus_translation, embedding
            FROM passage_consensus
            ORDER BY id
        """)
        print(f"Found {len(rows)} consensus entries")
        return rows

    async def get_existing_variants(self, urn: str) -> Dict[str, str]:
        """Get existing translation variants for a URN."""
        # Try to find translations for this passage by text_id
        rows = await self.conn.fetch("""
            SELECT t.style, t.translation, t.embedding, t.style_vector
            FROM translations t
            JOIN source_texts st ON t.text_id = st.id
            WHERE st.urn = $1
        """, urn)

        variants = {}
        for row in rows:
            style = row['style'] or 'literal'
            if style in STYLES:
                variants[style] = {
                    'text': row['translation'],
                    'embedding': row['embedding'],
                    'style_vector': row['style_vector']
                }
        return variants

    async def save_variant(self, consensus_id: int, urn: str, style: str,
                          variant_text: str, embedding=None, style_vector=None):
        """Save a style variant."""
        # Format embedding if present
        embedding_str = None
        if embedding and isinstance(embedding, (list, tuple)):
            try:
                emb_list = [float(x) for x in embedding]
                if len(emb_list) == 768:
                    embedding_str = '[' + ','.join(f'{x:.8f}' for x in emb_list) + ']'
            except:
                pass

        style_vector_str = None
        if style_vector and isinstance(style_vector, (list, tuple)):
            try:
                sv_list = [float(x) for x in style_vector]
                if len(sv_list) == 20:
                    style_vector_str = '[' + ','.join(f'{x:.8f}' for x in sv_list) + ']'
            except:
                pass

        await self.conn.execute("""
            INSERT INTO passage_style_variants
                (consensus_id, urn, style, variant_text, embedding, style_vector)
            VALUES ($1, $2, $3, $4, $5::vector, $6::vector)
            ON CONFLICT (consensus_id, style) DO UPDATE SET
                variant_text = EXCLUDED.variant_text,
                embedding = EXCLUDED.embedding,
                style_vector = EXCLUDED.style_vector
        """, consensus_id, urn, style, variant_text, embedding_str, style_vector_str)

        self.variant_count += 1

    async def build_variants_for_consensus(self, consensus: dict):
        """Build all style variants for a consensus entry."""
        consensus_id = consensus['id']
        urn = consensus['urn']
        consensus_text = consensus['consensus_translation']
        consensus_embedding = consensus['embedding']

        # Get any existing translations with style info
        existing = await self.get_existing_variants(urn)

        # Create variants for each style
        for style in STYLES:
            if style in existing:
                # Use existing translation
                variant = existing[style]
                await self.save_variant(
                    consensus_id, urn, style,
                    variant['text'],
                    variant.get('embedding'),
                    variant.get('style_vector')
                )
            else:
                # Generate variant from consensus
                variant_text = create_style_variant(consensus_text, style)
                await self.save_variant(
                    consensus_id, urn, style,
                    variant_text,
                    consensus_embedding if style == 'literal' else None,
                    None
                )

    async def build(self):
        """Main build process."""
        print("=" * 60)
        print("LOGOS Style Variant Builder - Phase 4")
        print("=" * 60)
        print()

        consensus_entries = await self.get_consensus_entries()

        print(f"\nProcessing {len(consensus_entries)} consensus entries...")
        print(f"Creating {len(STYLES)} variants each: {', '.join(STYLES)}")
        print()

        for i, consensus in enumerate(consensus_entries):
            await self.build_variants_for_consensus(consensus)

            if (i + 1) % 100 == 0:
                print(f"  Processed {i + 1}/{len(consensus_entries)} entries ({self.variant_count} variants)...")

        # Record evidence
        await self.conn.execute("""
            INSERT INTO evidence_trails
                (entity_type, entity_id, action, actor, evidence)
            VALUES ($1, $2, $3, $4, $5)
        """, 'passage_style_variants', 'phase4_build', 'created', 'system:style_variant_builder',
            json.dumps({
                'consensus_count': len(consensus_entries),
                'variant_count': self.variant_count,
                'styles': STYLES,
                'build_time': datetime.now().isoformat()
            }))

        print()
        print("=" * 60)
        print("Style Variant Build Complete!")
        print(f"  Consensus entries processed: {len(consensus_entries):,}")
        print(f"  Style variants created: {self.variant_count:,}")
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
        builder = StyleVariantBuilder(conn)
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
