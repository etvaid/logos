#!/usr/bin/env python3
"""
LOGOS Database Backup Script
Phase 0.5: Backup critical tables before migrations
"""

import os
import sys
import json
import asyncio
from datetime import datetime
import asyncpg

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

BACKUP_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'backups')

# Critical tables to backup (small enough to export fully)
CRITICAL_TABLES = [
    'translations',           # 38K rows - most critical
    'translation_review_queue',
    'style_invariant_embeddings',
]

# Large tables - backup schema + sample only
LARGE_TABLES = [
    'embeddings',            # 1.28M rows - too large for full backup
    'source_texts',          # 6.7M rows
]


async def backup_table(conn, table_name: str, backup_path: str, limit: int = None) -> dict:
    """Backup a table to JSON file."""
    print(f"  Backing up {table_name}...")

    # Get column info
    cols = await conn.fetch(f"""
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = '{table_name}'
        ORDER BY ordinal_position
    """)

    if not cols:
        print(f"    Table {table_name} not found or has no columns")
        return {'table': table_name, 'status': 'not_found', 'rows': 0}

    columns = [c['column_name'] for c in cols]

    # Build query - exclude large binary/vector columns for portability
    safe_columns = []
    for col in cols:
        if col['data_type'] in ('USER-DEFINED', 'bytea') and 'embedding' in col['column_name'].lower():
            # Skip large embedding columns - they can be regenerated
            continue
        if col['data_type'] in ('USER-DEFINED', 'bytea') and 'vector' in col['column_name'].lower():
            continue
        safe_columns.append(col['column_name'])

    query = f"SELECT {', '.join(safe_columns)} FROM {table_name}"
    if limit:
        query += f" LIMIT {limit}"

    rows = await conn.fetch(query)

    # Convert to serializable format
    data = []
    for row in rows:
        row_dict = {}
        for key in row.keys():
            val = row[key]
            if isinstance(val, (datetime,)):
                val = val.isoformat()
            elif isinstance(val, bytes):
                val = val.hex()
            elif hasattr(val, '__iter__') and not isinstance(val, (str, dict)):
                val = list(val)
            row_dict[key] = val
        data.append(row_dict)

    # Write backup
    with open(backup_path, 'w') as f:
        json.dump({
            'table': table_name,
            'backed_up_at': datetime.now().isoformat(),
            'columns': safe_columns,
            'row_count': len(data),
            'data': data
        }, f, indent=2, default=str)

    print(f"    Backed up {len(data)} rows to {backup_path}")
    return {'table': table_name, 'status': 'success', 'rows': len(data)}


async def backup_schema(conn, backup_path: str):
    """Backup all table schemas."""
    print("  Backing up database schema...")

    tables = await conn.fetch("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
    """)

    schema = {}
    for t in tables:
        table_name = t['table_name']
        cols = await conn.fetch(f"""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = '{table_name}'
            ORDER BY ordinal_position
        """)
        schema[table_name] = [dict(c) for c in cols]

    with open(backup_path, 'w') as f:
        json.dump({
            'backed_up_at': datetime.now().isoformat(),
            'tables': schema
        }, f, indent=2)

    print(f"    Schema backed up: {len(schema)} tables")
    return len(schema)


async def run_backup():
    """Run full backup."""
    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

    # Try connection
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
        raise Exception("Could not connect to database")

    results = []

    try:
        # 1. Schema backup
        schema_path = os.path.join(BACKUP_DIR, f'schema_{timestamp}.json')
        await backup_schema(conn, schema_path)

        # 2. Critical tables - full backup
        print("\nBacking up critical tables (full)...")
        for table in CRITICAL_TABLES:
            try:
                backup_path = os.path.join(BACKUP_DIR, f'{table}_{timestamp}.json')
                result = await backup_table(conn, table, backup_path)
                results.append(result)
            except Exception as e:
                print(f"    Error backing up {table}: {e}")
                results.append({'table': table, 'status': 'error', 'error': str(e)})

        # 3. Large tables - sample backup (first 1000 rows for verification)
        print("\nBacking up large tables (sample)...")
        for table in LARGE_TABLES:
            try:
                backup_path = os.path.join(BACKUP_DIR, f'{table}_sample_{timestamp}.json')
                result = await backup_table(conn, table, backup_path, limit=1000)
                results.append(result)
            except Exception as e:
                print(f"    Error backing up {table}: {e}")
                results.append({'table': table, 'status': 'error', 'error': str(e)})

        # 4. Write backup manifest
        manifest_path = os.path.join(BACKUP_DIR, f'manifest_{timestamp}.json')
        with open(manifest_path, 'w') as f:
            json.dump({
                'timestamp': timestamp,
                'backed_up_at': datetime.now().isoformat(),
                'results': results
            }, f, indent=2)

        print(f"\nBackup manifest written to: {manifest_path}")

    finally:
        await conn.close()

    return results


async def main():
    print("=" * 60)
    print("LOGOS Database Backup - Phase 0.5")
    print("=" * 60)
    print()

    try:
        results = await run_backup()

        print("\n" + "=" * 60)
        print("BACKUP SUMMARY")
        print("=" * 60)
        for r in results:
            status = r.get('status', 'unknown')
            rows = r.get('rows', 0)
            print(f"  {r['table']}: {status} ({rows:,} rows)")

        print("\nBackup completed successfully!")

    except Exception as e:
        print(f"Backup failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    asyncio.run(main())
