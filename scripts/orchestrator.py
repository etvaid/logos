#!/usr/bin/env python3
"""
LOGOS Overnight Orchestrator
Phase 11: Manage and monitor long-running background jobs

This script:
1. Runs all necessary build jobs in sequence
2. Tracks progress in backfill_jobs table
3. Can be run overnight to complete all processing
4. Supports resumption from checkpoints
"""

import os
import sys
import json
import asyncio
import subprocess
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import asyncpg

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

LOGS_DIR = os.path.join(os.path.dirname(__file__), '..', 'logs')
SCRIPTS_DIR = os.path.dirname(__file__)

# Job definitions
JOBS = [
    {
        'name': 'audit',
        'script': 'audit/audit.py',
        'description': 'Database audit',
        'priority': 0,
        'timeout_hours': 0.5
    },
    {
        'name': 'build_tm',
        'script': 'translate/build_tm.py',
        'description': 'Build translation memory',
        'priority': 1,
        'timeout_hours': 2
    },
    {
        'name': 'build_consensus',
        'script': 'translate/build_consensus.py',
        'description': 'Build consensus translations',
        'priority': 2,
        'timeout_hours': 1
    },
    {
        'name': 'build_style_variants',
        'script': 'translate/build_style_variants.py',
        'description': 'Generate style variants',
        'priority': 3,
        'timeout_hours': 1
    },
    {
        'name': 'build_bridge_embeddings',
        'script': 'concepts/build_bridge_embeddings.py',
        'description': 'Build multilingual bridge embeddings',
        'priority': 4,
        'timeout_hours': 4
    },
    {
        'name': 'build_clusters',
        'script': 'concepts/build_clusters.py',
        'description': 'Build concept clusters',
        'priority': 5,
        'timeout_hours': 1
    },
    {
        'name': 'backfill_embeddings',
        'script': 'embeddings/backfill_embeddings.py',
        'description': 'Backfill source text embeddings',
        'priority': 6,
        'timeout_hours': 48  # Long running
    }
]


class Orchestrator:
    def __init__(self, conn: asyncpg.Connection):
        self.conn = conn
        self.start_time = datetime.now()

    async def get_job_status(self, job_name: str) -> Optional[dict]:
        """Get status of a job from backfill_jobs table."""
        row = await self.conn.fetchrow("""
            SELECT job_id, status, progress, last_checkpoint, created_at, started_at
            FROM backfill_jobs
            WHERE job_type = $1
            ORDER BY created_at DESC LIMIT 1
        """, job_name)

        if row:
            return {
                'id': row['job_id'],
                'status': row['status'],
                'progress': row['progress'],
                'last_checkpoint': row['last_checkpoint'],
                'created_at': row['created_at'],
                'updated_at': row['started_at']
            }
        return None

    async def create_job_record(self, job_name: str) -> int:
        """Create a new job record."""
        result = await self.conn.fetchrow("""
            INSERT INTO backfill_jobs (job_type, status, progress, started_at, batch_size, total_count, processed, errors)
            VALUES ($1, 'queued', 0, CURRENT_TIMESTAMP, 100, 0, 0, 0)
            RETURNING job_id
        """, job_name)
        return result['job_id']

    async def update_job_status(self, job_id: int, status: str, progress: float = None):
        """Update job status."""
        if progress is not None:
            await self.conn.execute("""
                UPDATE backfill_jobs
                SET status = $1, progress = $2, started_at = CURRENT_TIMESTAMP
                WHERE job_id = $3
            """, status, progress, job_id)
        else:
            await self.conn.execute("""
                UPDATE backfill_jobs
                SET status = $1, started_at = CURRENT_TIMESTAMP
                WHERE job_id = $2
            """, status, job_id)

    def run_script(self, script_path: str, timeout_hours: float) -> bool:
        """Run a Python script and wait for completion."""
        full_path = os.path.join(SCRIPTS_DIR, script_path)

        if not os.path.exists(full_path):
            print(f"  Script not found: {full_path}")
            return False

        # Get venv python
        venv_python = os.path.join(SCRIPTS_DIR, '..', 'venv', 'bin', 'python')
        if not os.path.exists(venv_python):
            venv_python = sys.executable

        try:
            timeout_seconds = int(timeout_hours * 3600)
            result = subprocess.run(
                [venv_python, full_path],
                timeout=timeout_seconds,
                capture_output=True,
                text=True,
                cwd=os.path.dirname(full_path)
            )

            if result.returncode == 0:
                print(f"  Completed successfully")
                return True
            else:
                print(f"  Failed with return code {result.returncode}")
                if result.stderr:
                    print(f"  Error: {result.stderr[:500]}")
                return False

        except subprocess.TimeoutExpired:
            print(f"  Timed out after {timeout_hours} hours")
            return False
        except Exception as e:
            print(f"  Error: {e}")
            return False

    async def should_run_job(self, job: dict) -> bool:
        """Determine if a job should be run."""
        status = await self.get_job_status(job['name'])

        if status is None:
            return True  # Never run

        if status['status'] == 'done':
            return False  # Already done

        if status['status'] == 'running':
            # Check if stale (no update in 2 hours)
            if status['updated_at']:
                age = datetime.now() - status['updated_at'].replace(tzinfo=None)
                if age > timedelta(hours=2):
                    print(f"  Job appears stale, will restart")
                    return True
            return False  # Still running

        return True  # queued, paused, or failed

    async def run_job(self, job: dict) -> bool:
        """Run a single job."""
        print(f"\nJob: {job['name']}")
        print(f"  Description: {job['description']}")

        # Check if should run
        if not await self.should_run_job(job):
            status = await self.get_job_status(job['name'])
            if status and status['status'] == 'done':
                print(f"  Already completed")
            elif status and status['status'] == 'running':
                print(f"  Currently running")
            return True

        # Create job record
        job_id = await self.create_job_record(job['name'])
        await self.update_job_status(job_id, 'running')

        print(f"  Starting (timeout: {job['timeout_hours']}h)...")

        # Run script
        success = self.run_script(job['script'], job['timeout_hours'])

        # Update status (use 'done' not 'completed' per constraint)
        if success:
            await self.update_job_status(job_id, 'done', 1.0)
        else:
            await self.update_job_status(job_id, 'failed')

        return success

    async def run_all(self, skip_completed: bool = True):
        """Run all jobs in order."""
        print("=" * 60)
        print("LOGOS Overnight Orchestrator")
        print(f"Started: {self.start_time.isoformat()}")
        print("=" * 60)

        # Sort by priority
        sorted_jobs = sorted(JOBS, key=lambda j: j['priority'])

        results = {}
        for job in sorted_jobs:
            success = await self.run_job(job)
            results[job['name']] = success

            if not success and job['name'] != 'backfill_embeddings':
                # Don't stop for embedding backfill failures (it's resumable)
                print(f"\nJob {job['name']} failed. Stopping orchestrator.")
                break

        # Summary
        print("\n" + "=" * 60)
        print("ORCHESTRATOR SUMMARY")
        print("=" * 60)
        for name, success in results.items():
            status = "COMPLETED" if success else "FAILED"
            print(f"  {name}: {status}")

        elapsed = datetime.now() - self.start_time
        print(f"\nTotal time: {elapsed}")

        # Save summary
        summary_path = os.path.join(LOGS_DIR, 'orchestrator_run.json')
        with open(summary_path, 'w') as f:
            json.dump({
                'started': self.start_time.isoformat(),
                'ended': datetime.now().isoformat(),
                'elapsed_seconds': elapsed.total_seconds(),
                'results': results
            }, f, indent=2)

        print(f"Summary saved to: {summary_path}")


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
        orchestrator = Orchestrator(conn)
        await orchestrator.run_all()
    except Exception as e:
        print(f"Orchestrator failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        await conn.close()


if __name__ == '__main__':
    asyncio.run(main())
