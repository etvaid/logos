#!/usr/bin/env python3
"""
Apply LOGOS Database Schema
===========================

Creates all required tables for the LOGOS platform.

Usage:
    python scripts/apply_schema.py
"""

import asyncio
import asyncpg
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.schema import ALL_TABLES_SQL, verify_schema

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    os.getenv("DATABASE_URL", "")
)


async def apply_schema():
    """Apply all schema tables."""
    print("=" * 70)
    print("LOGOS SCHEMA APPLICATION")
    print("=" * 70)
    print()

    try:
        pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=5)
    except Exception as e:
        print(f"ERROR: Could not connect to database: {e}")
        return False

    results = {}

    async with pool.acquire() as conn:
        for section_name, sql in ALL_TABLES_SQL:
            print(f"Applying: {section_name}...", end=" ")
            try:
                await conn.execute(sql)
                results[section_name] = "OK"
                print("OK")
            except Exception as e:
                error_msg = str(e)[:100]
                results[section_name] = f"ERROR: {error_msg}"
                print(f"ERROR: {error_msg}")

    print()
    print("=" * 70)
    print("VERIFICATION")
    print("=" * 70)

    verification = await verify_schema(pool)
    print(f"Expected tables: {verification['expected_count']}")
    print(f"Existing tables: {verification['existing_count']}")

    if verification['missing_tables']:
        print(f"\nMissing tables ({len(verification['missing_tables'])}):")
        for t in verification['missing_tables']:
            print(f"   - {t}")
    else:
        print("\nAll tables present!")

    if verification['extra_tables']:
        print(f"\nExtra tables ({len(verification['extra_tables'])}):")
        for t in verification['extra_tables'][:10]:
            print(f"   - {t}")

    await pool.close()

    success = verification['all_present']
    print()
    print("=" * 70)
    print(f"STATUS: {'SUCCESS' if success else 'INCOMPLETE'}")
    print("=" * 70)

    return success


if __name__ == "__main__":
    success = asyncio.run(apply_schema())
    sys.exit(0 if success else 1)
