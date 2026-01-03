#!/usr/bin/env python3
"""
Base Repository - Core database operations with connection pooling.
"""

import asyncio
import asyncpg
from typing import Any, Dict, List, Optional, Tuple
from contextlib import asynccontextmanager
import logging
import os

logger = logging.getLogger(__name__)

# Default database URL
DEFAULT_DB_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway"
)

# Global connection pool
_pool: Optional[asyncpg.Pool] = None


async def get_db_pool(db_url: str = None, min_size: int = 5, max_size: int = 20) -> asyncpg.Pool:
    """Get or create the global connection pool."""
    global _pool

    if _pool is None:
        url = db_url or DEFAULT_DB_URL
        _pool = await asyncpg.create_pool(
            url,
            min_size=min_size,
            max_size=max_size,
            command_timeout=60,
            statement_cache_size=100
        )
        logger.info(f"Created connection pool with {min_size}-{max_size} connections")

    return _pool


async def close_db_pool():
    """Close the global connection pool."""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None
        logger.info("Closed connection pool")


class BaseRepository:
    """
    Base repository with common database operations.
    Uses connection pooling for efficient resource management.
    """

    def __init__(self, pool: asyncpg.Pool = None, db_url: str = None):
        self._pool = pool
        self._db_url = db_url or DEFAULT_DB_URL
        self.logger = logging.getLogger(self.__class__.__name__)

    async def get_pool(self) -> asyncpg.Pool:
        """Get connection pool, creating if necessary."""
        if self._pool is None:
            self._pool = await get_db_pool(self._db_url)
        return self._pool

    @asynccontextmanager
    async def connection(self):
        """Context manager for getting a connection from the pool."""
        pool = await self.get_pool()
        async with pool.acquire() as conn:
            yield conn

    @asynccontextmanager
    async def transaction(self):
        """Context manager for a database transaction."""
        pool = await self.get_pool()
        async with pool.acquire() as conn:
            async with conn.transaction():
                yield conn

    async def fetch_one(self, query: str, *args) -> Optional[asyncpg.Record]:
        """Fetch a single row."""
        async with self.connection() as conn:
            return await conn.fetchrow(query, *args)

    async def fetch_all(self, query: str, *args) -> List[asyncpg.Record]:
        """Fetch all rows."""
        async with self.connection() as conn:
            return await conn.fetch(query, *args)

    async def fetch_val(self, query: str, *args) -> Any:
        """Fetch a single value."""
        async with self.connection() as conn:
            return await conn.fetchval(query, *args)

    async def execute(self, query: str, *args) -> str:
        """Execute a query (INSERT, UPDATE, DELETE)."""
        async with self.connection() as conn:
            return await conn.execute(query, *args)

    async def execute_many(self, query: str, args_list: List[Tuple]) -> None:
        """Execute a query multiple times with different arguments."""
        async with self.connection() as conn:
            await conn.executemany(query, args_list)

    async def bulk_insert(
        self,
        table: str,
        records: List[Dict[str, Any]],
        columns: List[str] = None
    ) -> int:
        """
        Bulk insert records using COPY for efficiency.

        Args:
            table: Table name
            records: List of dictionaries with column: value pairs
            columns: Optional list of columns (inferred from first record if not provided)

        Returns:
            Number of records inserted
        """
        if not records:
            return 0

        if columns is None:
            columns = list(records[0].keys())

        values = [[r.get(c) for c in columns] for r in records]

        async with self.connection() as conn:
            await conn.copy_records_to_table(
                table,
                records=values,
                columns=columns
            )

        return len(records)

    async def count(self, table: str, where: str = None, *args) -> int:
        """Count rows in a table."""
        query = f"SELECT COUNT(*) FROM {table}"
        if where:
            query += f" WHERE {where}"
        return await self.fetch_val(query, *args)

    async def exists(self, table: str, where: str, *args) -> bool:
        """Check if a row exists."""
        query = f"SELECT EXISTS(SELECT 1 FROM {table} WHERE {where})"
        return await self.fetch_val(query, *args)

    async def get_table_stats(self) -> Dict[str, int]:
        """Get row counts for key tables."""
        tables = [
            "authors", "works", "source_texts", "passages", "translations",
            "style_residuals", "translators", "meaning_anchors", "pericopes",
            "intertextual_links", "lost_works", "fragments"
        ]

        stats = {}
        for table in tables:
            try:
                stats[table] = await self.count(table)
            except Exception:
                stats[table] = 0

        return stats
