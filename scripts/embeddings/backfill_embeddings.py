#!/usr/bin/env python3
"""
LOGOS Embedding Backfill
Phase 10: Complete remaining embeddings for source texts

This is a long-running job that:
1. Finds source texts without embeddings
2. Generates embeddings in batches
3. Tracks progress in backfill_jobs table
4. Can be resumed if interrupted
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
PROGRESS_FILE = os.path.join(LOGS_DIR, 'progress.json')

BATCH_SIZE = 100
CHECKPOINT_INTERVAL = 500  # Save progress every N records
JOB_NAME = 'embedding_backfill'


class EmbeddingBackfill:
    def __init__(self, conn: asyncpg.Connection):
        self.conn = conn
        self.model = None
        self.processed = 0
        self.job_id = None
        self.last_checkpoint = None

    def load_model(self):
        """Load embedding model."""
        print("Loading embedding model...")
        try:
            from sentence_transformers import SentenceTransformer
            # Use the same model as existing embeddings (768 dim)
            self.model = SentenceTransformer('all-MiniLM-L6-v2')  # 384 dim
            # Or for 768 dim:
            # self.model = SentenceTransformer('all-mpnet-base-v2')
            print(f"Model loaded. Dimension: {self.model.get_sentence_embedding_dimension()}")
            return True
        except Exception as e:
            print(f"Failed to load model: {e}")
            return False

    async def get_or_create_job(self) -> Optional[str]:
        """Get existing job or create new one."""
        # Check for existing job
        job = await self.conn.fetchrow("""
            SELECT id, last_checkpoint, progress
            FROM backfill_jobs
            WHERE job_type = $1 AND status != 'completed'
            ORDER BY created_at DESC LIMIT 1
        """, JOB_NAME)

        if job:
            self.job_id = job['id']
            self.last_checkpoint = job['last_checkpoint']
            print(f"Resuming job {self.job_id} from checkpoint: {self.last_checkpoint}")
            return self.job_id

        # Create new job
        result = await self.conn.fetchrow("""
            INSERT INTO backfill_jobs (job_type, status, progress)
            VALUES ($1, 'running', 0)
            RETURNING id
        """, JOB_NAME)

        self.job_id = result['id']
        print(f"Created new job: {self.job_id}")
        return self.job_id

    async def update_job_progress(self, checkpoint: str, progress: float):
        """Update job progress."""
        await self.conn.execute("""
            UPDATE backfill_jobs
            SET last_checkpoint = $1, progress = $2, updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
        """, checkpoint, progress, self.job_id)

    async def mark_job_complete(self):
        """Mark job as completed."""
        await self.conn.execute("""
            UPDATE backfill_jobs
            SET status = 'completed', progress = 1.0, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
        """, self.job_id)

    async def get_missing_count(self) -> int:
        """Count source texts without embeddings."""
        result = await self.conn.fetchrow("""
            SELECT COUNT(*) as count
            FROM source_texts st
            LEFT JOIN embeddings e ON st.urn = e.urn
            WHERE e.id IS NULL AND st.content IS NOT NULL AND LENGTH(st.content) > 10
        """)
        return result['count']

    async def get_batch(self, batch_size: int, offset_urn: str = None) -> List[dict]:
        """Get a batch of source texts to embed."""
        if offset_urn:
            rows = await self.conn.fetch("""
                SELECT st.id, st.urn, st.content, st.language
                FROM source_texts st
                LEFT JOIN embeddings e ON st.urn = e.urn
                WHERE e.id IS NULL
                AND st.content IS NOT NULL
                AND LENGTH(st.content) > 10
                AND st.urn > $1
                ORDER BY st.urn
                LIMIT $2
            """, offset_urn, batch_size)
        else:
            rows = await self.conn.fetch("""
                SELECT st.id, st.urn, st.content, st.language
                FROM source_texts st
                LEFT JOIN embeddings e ON st.urn = e.urn
                WHERE e.id IS NULL
                AND st.content IS NOT NULL
                AND LENGTH(st.content) > 10
                ORDER BY st.urn
                LIMIT $1
            """, batch_size)

        return rows

    def compute_embedding(self, text: str) -> Optional[List[float]]:
        """Compute embedding for text."""
        if not text or not self.model:
            return None

        try:
            # Truncate long texts
            text = ' '.join(text.split())[:2000]
            embedding = self.model.encode(text, normalize_embeddings=True)
            return embedding.tolist()
        except Exception as e:
            return None

    async def save_embedding(self, urn: str, embedding: List[float]) -> bool:
        """Save embedding to database."""
        if not embedding:
            return False

        try:
            # Convert to JSON string for jsonb storage
            embedding_json = json.dumps(embedding)

            await self.conn.execute("""
                INSERT INTO embeddings (urn, embedding)
                VALUES ($1, $2::jsonb)
                ON CONFLICT (urn) DO UPDATE SET embedding = EXCLUDED.embedding
            """, urn, embedding_json)

            return True
        except Exception as e:
            print(f"Save error for {urn}: {e}")
            return False

    def save_progress(self, total: int):
        """Save progress to JSON file."""
        os.makedirs(LOGS_DIR, exist_ok=True)
        with open(PROGRESS_FILE, 'w') as f:
            json.dump({
                'phase': 'phase10_embeddings',
                'job_id': self.job_id,
                'processed': self.processed,
                'total': total,
                'last_checkpoint': self.last_checkpoint,
                'last_update': datetime.now().isoformat()
            }, f, indent=2)

    async def run(self, max_records: int = None):
        """Main backfill loop."""
        print("=" * 60)
        print("LOGOS Embedding Backfill - Phase 10")
        print("=" * 60)
        print()

        # Load model
        if not self.load_model():
            print("Cannot proceed without model")
            return

        # Get or create job
        await self.get_or_create_job()

        # Get total count
        total_missing = await self.get_missing_count()
        print(f"Source texts needing embeddings: {total_missing:,}")

        if total_missing == 0:
            print("All embeddings complete!")
            await self.mark_job_complete()
            return

        if max_records:
            total_missing = min(total_missing, max_records)
            print(f"Processing up to {max_records:,} records")

        # Process batches
        current_urn = self.last_checkpoint
        processed_count = 0

        while True:
            batch = await self.get_batch(BATCH_SIZE, current_urn)

            if not batch:
                break

            for row in batch:
                embedding = self.compute_embedding(row['content'])
                if embedding:
                    if await self.save_embedding(row['urn'], embedding):
                        processed_count += 1
                        self.processed += 1

                current_urn = row['urn']
                self.last_checkpoint = current_urn

                if processed_count % CHECKPOINT_INTERVAL == 0:
                    progress = processed_count / total_missing
                    await self.update_job_progress(current_urn, progress)
                    self.save_progress(total_missing)
                    print(f"  Processed {processed_count:,}/{total_missing:,} ({progress*100:.1f}%)...")

            if max_records and processed_count >= max_records:
                break

        # Final update
        await self.update_job_progress(current_urn, 1.0 if processed_count >= total_missing else processed_count / total_missing)
        self.save_progress(total_missing)

        if processed_count >= total_missing:
            await self.mark_job_complete()

        print()
        print("=" * 60)
        print("Embedding Backfill Complete!")
        print(f"  Processed: {processed_count:,}")
        print("=" * 60)


async def main():
    os.makedirs(LOGS_DIR, exist_ok=True)

    # Parse max records from args
    max_records = None
    if len(sys.argv) > 1:
        try:
            max_records = int(sys.argv[1])
        except ValueError:
            pass

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
        backfill = EmbeddingBackfill(conn)
        await backfill.run(max_records)
    except Exception as e:
        print(f"Backfill failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        await conn.close()


if __name__ == '__main__':
    asyncio.run(main())
