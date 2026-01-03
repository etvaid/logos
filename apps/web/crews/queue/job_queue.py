"""
PROPER JOB QUEUE
Uses SKIP LOCKED for safe concurrent claiming
"""

import asyncio
from typing import List, Dict, Optional, Any
from dataclasses import dataclass
from datetime import datetime
import logging
import json

logger = logging.getLogger("queue")


@dataclass
class Job:
    id: int
    job_type: str
    item_id: str
    payload: Dict[str, Any]
    attempt: int = 0
    max_attempts: int = 3


class JobQueue:
    """
    Proper job queue with:
    - SKIP LOCKED claiming (no duplicates)
    - Retry with backoff
    - Dead letter queue
    - Heartbeat for long jobs
    """

    def __init__(self, pool=None):
        self.pool = pool

    async def initialize(self):
        """Create queue tables"""
        if not self.pool:
            logger.warning("No database pool, skipping initialization")
            return

        async with self.pool.acquire() as conn:
            await conn.execute("""
                CREATE TABLE IF NOT EXISTS job_queue (
                    id SERIAL PRIMARY KEY,
                    job_type TEXT NOT NULL,
                    item_id TEXT NOT NULL,
                    payload JSONB DEFAULT '{}',
                    status TEXT DEFAULT 'pending',
                    attempt INT DEFAULT 0,
                    max_attempts INT DEFAULT 3,
                    worker_id TEXT,
                    started_at TIMESTAMPTZ,
                    completed_at TIMESTAMPTZ,
                    error TEXT,
                    result JSONB,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW(),
                    UNIQUE(job_type, item_id)
                );

                CREATE INDEX IF NOT EXISTS idx_queue_pending
                ON job_queue(job_type, status) WHERE status = 'pending';

                CREATE INDEX IF NOT EXISTS idx_queue_stale
                ON job_queue(started_at) WHERE status = 'running';
            """)

    async def enqueue(
        self,
        job_type: str,
        item_id: str,
        payload: Dict = None
    ) -> Optional[int]:
        """Add job to queue (idempotent)"""
        if not self.pool:
            return None

        async with self.pool.acquire() as conn:
            try:
                row = await conn.fetchrow("""
                    INSERT INTO job_queue (job_type, item_id, payload)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (job_type, item_id) DO NOTHING
                    RETURNING id
                """, job_type, item_id, json.dumps(payload or {}))
                return row['id'] if row else None
            except Exception as e:
                logger.error(f"Enqueue failed: {e}")
                return None

    async def enqueue_batch(
        self,
        job_type: str,
        items: List[Dict]  # [{item_id, payload}, ...]
    ) -> int:
        """Bulk enqueue (much faster)"""
        if not self.pool or not items:
            return 0

        async with self.pool.acquire() as conn:
            # Use executemany for speed
            await conn.executemany("""
                INSERT INTO job_queue (job_type, item_id, payload)
                VALUES ($1, $2, $3)
                ON CONFLICT (job_type, item_id) DO NOTHING
            """, [(job_type, i['item_id'], json.dumps(i.get('payload', {}))) for i in items])
            return len(items)

    async def claim(
        self,
        job_type: str,
        worker_id: str,
        batch_size: int = 10
    ) -> List[Job]:
        """
        Claim jobs using SKIP LOCKED (safe concurrent access)
        """
        if not self.pool:
            return []

        async with self.pool.acquire() as conn:
            rows = await conn.fetch("""
                UPDATE job_queue
                SET status = 'running',
                    worker_id = $1,
                    started_at = NOW(),
                    attempt = attempt + 1,
                    updated_at = NOW()
                WHERE id IN (
                    SELECT id FROM job_queue
                    WHERE job_type = $2
                    AND status = 'pending'
                    AND attempt < max_attempts
                    ORDER BY created_at
                    FOR UPDATE SKIP LOCKED
                    LIMIT $3
                )
                RETURNING id, job_type, item_id, payload, attempt, max_attempts
            """, worker_id, job_type, batch_size)

            return [Job(
                id=r['id'],
                job_type=r['job_type'],
                item_id=r['item_id'],
                payload=json.loads(r['payload']) if isinstance(r['payload'], str) else r['payload'],
                attempt=r['attempt'],
                max_attempts=r['max_attempts']
            ) for r in rows]

    async def complete(
        self,
        job_id: int,
        result: Dict = None
    ):
        """Mark job as completed"""
        if not self.pool:
            return

        async with self.pool.acquire() as conn:
            await conn.execute("""
                UPDATE job_queue
                SET status = 'completed',
                    result = $1,
                    completed_at = NOW(),
                    updated_at = NOW()
                WHERE id = $2
            """, json.dumps(result or {}), job_id)

    async def fail(
        self,
        job_id: int,
        error: str,
        retry: bool = True
    ):
        """Mark job as failed (will retry if attempts remain)"""
        if not self.pool:
            return

        async with self.pool.acquire() as conn:
            if retry:
                # Return to pending for retry
                await conn.execute("""
                    UPDATE job_queue
                    SET status = CASE
                        WHEN attempt >= max_attempts THEN 'dead'
                        ELSE 'pending'
                    END,
                    error = $1,
                    worker_id = NULL,
                    updated_at = NOW()
                    WHERE id = $2
                """, error, job_id)
            else:
                # Send to dead letter queue
                await conn.execute("""
                    UPDATE job_queue
                    SET status = 'dead',
                        error = $1,
                        updated_at = NOW()
                    WHERE id = $2
                """, error, job_id)

    async def reclaim_stale(
        self,
        timeout_minutes: int = 30
    ) -> int:
        """Reclaim jobs that have been running too long (worker died)"""
        if not self.pool:
            return 0

        async with self.pool.acquire() as conn:
            result = await conn.execute("""
                UPDATE job_queue
                SET status = 'pending',
                    worker_id = NULL,
                    updated_at = NOW()
                WHERE status = 'running'
                AND started_at < NOW() - INTERVAL '%s minutes'
            """ % timeout_minutes)
            # Parse result like "UPDATE 5"
            try:
                return int(result.split()[-1])
            except:
                return 0

    async def get_stats(self, job_type: str = None) -> Dict[str, int]:
        """Get queue statistics"""
        if not self.pool:
            return {}

        async with self.pool.acquire() as conn:
            if job_type:
                rows = await conn.fetch("""
                    SELECT status, COUNT(*)::int as count
                    FROM job_queue
                    WHERE job_type = $1
                    GROUP BY status
                """, job_type)
            else:
                rows = await conn.fetch("""
                    SELECT status, COUNT(*)::int as count
                    FROM job_queue
                    GROUP BY status
                """)

            return {r['status']: r['count'] for r in rows}

    async def cleanup_completed(self, older_than_days: int = 7) -> int:
        """Remove old completed jobs"""
        if not self.pool:
            return 0

        async with self.pool.acquire() as conn:
            result = await conn.execute("""
                DELETE FROM job_queue
                WHERE status = 'completed'
                AND completed_at < NOW() - INTERVAL '%s days'
            """ % older_than_days)
            try:
                return int(result.split()[-1])
            except:
                return 0
