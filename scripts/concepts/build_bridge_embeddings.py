#!/usr/bin/env python3
"""
LOGOS Bridge Embeddings Builder
Phase 6: Create multilingual embeddings for cross-language concept search

Uses multilingual-e5-small model (384 dimensions) to project passages
into a shared multilingual space where Greek/Latin/Hebrew/English
passages about similar concepts cluster together.
"""

import os
import sys
import json
import asyncio
from datetime import datetime
from typing import List, Optional
import asyncpg
import numpy as np

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

LOGS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'logs')
BATCH_SIZE = 50

# Model for multilingual embeddings
MODEL_NAME = 'intfloat/multilingual-e5-small'


def load_model():
    """Load the multilingual embedding model."""
    print(f"Loading model: {MODEL_NAME}")
    try:
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer(MODEL_NAME)
        print(f"Model loaded. Embedding dimension: {model.get_sentence_embedding_dimension()}")
        return model
    except Exception as e:
        print(f"Failed to load model: {e}")
        return None


def compute_bridge_embedding(model, text: str, language: str) -> Optional[List[float]]:
    """
    Compute bridge embedding for a text.

    For multilingual-e5, we prefix with "query: " for queries
    and "passage: " for passages to improve retrieval.
    """
    if not text or not model:
        return None

    try:
        # Clean and truncate
        text = ' '.join(text.split())[:1000]

        # E5 models expect passage prefix for documents
        prefixed_text = f"passage: {text}"

        embedding = model.encode(prefixed_text, normalize_embeddings=True)
        return embedding.tolist()
    except Exception as e:
        print(f"Embedding error: {e}")
        return None


class BridgeEmbeddingBuilder:
    def __init__(self, conn: asyncpg.Connection, model):
        self.conn = conn
        self.model = model
        self.embedded_count = 0

    async def get_passages_to_embed(self, limit: int = 10000) -> List[dict]:
        """Get passages that need bridge embeddings."""
        print("Finding passages needing bridge embeddings...")

        # Get passages from consensus that don't have bridge embeddings yet
        rows = await self.conn.fetch("""
            SELECT c.urn, c.source_language, c.consensus_translation, c.source_text
            FROM passage_consensus c
            LEFT JOIN bridge_embeddings b ON c.urn = b.urn
            WHERE b.id IS NULL
            ORDER BY c.id
            LIMIT $1
        """, limit)

        print(f"Found {len(rows)} consensus passages to embed")
        return rows

    async def get_source_texts_to_embed(self, limit: int = 10000) -> List[dict]:
        """Get source texts that need bridge embeddings."""
        # Sample from source_texts for initial clustering
        rows = await self.conn.fetch("""
            SELECT st.urn, st.language, st.content
            FROM source_texts st
            LEFT JOIN bridge_embeddings b ON st.urn = b.urn
            WHERE b.id IS NULL
            AND st.content IS NOT NULL
            AND LENGTH(st.content) > 50
            AND st.language IN ('greek', 'latin', 'hebrew', 'aramaic')
            ORDER BY RANDOM()
            LIMIT $1
        """, limit)

        print(f"Found {len(rows)} source texts to embed")
        return rows

    async def save_bridge_embedding(self, urn: str, language: str, embedding: List[float]):
        """Save a bridge embedding to database."""
        if not embedding or len(embedding) != 384:
            return False

        embedding_str = '[' + ','.join(f'{x:.8f}' for x in embedding) + ']'

        try:
            await self.conn.execute("""
                INSERT INTO bridge_embeddings (urn, language, embedding)
                VALUES ($1, $2, $3::vector)
                ON CONFLICT (urn) DO UPDATE SET
                    embedding = EXCLUDED.embedding
            """, urn, language, embedding_str)
            self.embedded_count += 1
            return True
        except Exception as e:
            print(f"Save error for {urn}: {e}")
            return False

    async def build_consensus_embeddings(self):
        """Build bridge embeddings for consensus translations."""
        passages = await self.get_passages_to_embed()

        print(f"\nComputing bridge embeddings for {len(passages)} consensus passages...")

        for i, row in enumerate(passages):
            # Use translation for English, source for others
            text = row['consensus_translation'] or row['source_text']
            language = row['source_language']

            if text:
                embedding = compute_bridge_embedding(self.model, text, language)
                if embedding:
                    await self.save_bridge_embedding(row['urn'], language, embedding)

            if (i + 1) % 100 == 0:
                print(f"  Processed {i + 1}/{len(passages)} consensus passages...")

    async def build_source_embeddings(self, sample_size: int = 5000):
        """Build bridge embeddings for source text samples."""
        sources = await self.get_source_texts_to_embed(sample_size)

        print(f"\nComputing bridge embeddings for {len(sources)} source texts...")

        for i, row in enumerate(sources):
            text = row['content']
            language = row['language']

            if text:
                embedding = compute_bridge_embedding(self.model, text, language)
                if embedding:
                    await self.save_bridge_embedding(row['urn'], language, embedding)

            if (i + 1) % 500 == 0:
                print(f"  Processed {i + 1}/{len(sources)} source texts...")

    async def build(self):
        """Main build process."""
        print("=" * 60)
        print("LOGOS Bridge Embedding Builder - Phase 6")
        print("=" * 60)
        print()

        # Build for consensus first
        await self.build_consensus_embeddings()

        # Build sample of source texts for clustering
        await self.build_source_embeddings(sample_size=2000)

        # Record evidence
        await self.conn.execute("""
            INSERT INTO evidence_trails
                (entity_type, entity_id, action, actor, evidence)
            VALUES ($1, $2, $3, $4, $5)
        """, 'bridge_embeddings', 'phase6_build', 'created', 'system:bridge_builder',
            json.dumps({
                'embedded_count': self.embedded_count,
                'model': MODEL_NAME,
                'dimension': 384,
                'build_time': datetime.now().isoformat()
            }))

        print()
        print("=" * 60)
        print("Bridge Embedding Build Complete!")
        print(f"  Embeddings created: {self.embedded_count:,}")
        print(f"  Model: {MODEL_NAME}")
        print("=" * 60)


async def main():
    os.makedirs(LOGS_DIR, exist_ok=True)

    # Load model
    model = load_model()
    if model is None:
        print("Cannot proceed without embedding model")
        sys.exit(1)

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
        builder = BridgeEmbeddingBuilder(conn, model)
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
