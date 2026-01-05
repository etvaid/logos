#!/usr/bin/env python3
"""
LOGOS Migration Runner
Executes SQL migrations against the database
"""

import os
import sys
import asyncio
import asyncpg
from datetime import datetime

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

MIGRATIONS_DIR = os.path.dirname(__file__)


async def run_migration(conn, migration_file: str) -> bool:
    """Run a single migration file."""
    migration_path = os.path.join(MIGRATIONS_DIR, migration_file)

    if not os.path.exists(migration_path):
        print(f"  Migration file not found: {migration_path}")
        return False

    print(f"  Running {migration_file}...")

    with open(migration_path, 'r') as f:
        sql = f.read()

    try:
        # Split by semicolons and execute each statement
        # But be careful with $$ blocks
        await conn.execute(sql)
        print(f"  {migration_file} completed successfully!")
        return True
    except Exception as e:
        print(f"  Error in {migration_file}: {e}")
        return False


async def main():
    print("=" * 60)
    print("LOGOS Migration Runner")
    print("=" * 60)
    print()

    # Connect to database
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
        # Get list of migration files
        migrations = sorted([f for f in os.listdir(MIGRATIONS_DIR) if f.endswith('.sql')])

        if not migrations:
            print("No migration files found")
            return

        print(f"\nFound {len(migrations)} migration(s):")
        for m in migrations:
            print(f"  - {m}")
        print()

        # Run each migration
        success_count = 0
        for migration in migrations:
            if await run_migration(conn, migration):
                success_count += 1

        print()
        print("=" * 60)
        print(f"Migrations complete: {success_count}/{len(migrations)} successful")
        print("=" * 60)

        # Show current table counts
        print("\nVerifying new tables...")
        tables = [
            'translation_memory_lexeme',
            'translation_memory_phrase',
            'translation_memory_idiom',
            'translation_order_templates',
            'passage_consensus',
            'passage_style_variants',
            'translation_runs',
            'bridge_embeddings',
            'chunk_bridge_embeddings',
            'concept_clusters',
            'concept_members',
            'concept_edges',
            'evidence_trails'
        ]

        for table in tables:
            try:
                result = await conn.fetchrow(f"SELECT COUNT(*) as count FROM {table}")
                print(f"  {table}: {result['count']} rows")
            except Exception as e:
                print(f"  {table}: ERROR - {e}")

    finally:
        await conn.close()


if __name__ == '__main__':
    asyncio.run(main())
