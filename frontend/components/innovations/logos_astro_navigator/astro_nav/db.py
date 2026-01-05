from __future__ import annotations
import asyncpg
from typing import Any, Iterable, Optional
from astro_nav.config import settings

_pool: Optional[asyncpg.Pool] = None

async def get_pool(min_size: int = 2, max_size: int = 10) -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(settings.database_url, min_size=min_size, max_size=max_size)
    return _pool

async def close_pool() -> None:
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None

async def exec_sql(sql: str) -> None:
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(sql)

async def exec_sql_file(path: str) -> None:
    with open(path, "r", encoding="utf-8") as f:
        sql = f.read()
    await exec_sql(sql)

async def fetchval(query: str, *args: Any) -> Any:
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await conn.fetchval(query, *args)

async def fetch(query: str, *args: Any) -> list[asyncpg.Record]:
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await conn.fetch(query, *args)

async def execute(query: str, *args: Any) -> str:
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await conn.execute(query, *args)

async def copy_records(table: str, columns: list[str], records: Iterable[tuple[Any, ...]]) -> None:
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.copy_records_to_table(table, records=records, columns=columns)
