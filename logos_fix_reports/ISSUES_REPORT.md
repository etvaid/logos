# LOGOS Build Issues Report

**Scan Time:** 2025-12-30T16:12:38.230700
**Source Directory:** `logos_WIRED_POLISHED_FINAL`

## Summary

- **Files Scanned:** 55
- **Lines Scanned:** 55,789
- **Characters Scanned:** 2,088,400
- **Total Issues Found:** 974

### Issues by Severity

- 🔴 **CRITICAL:** 0
- 🟠 **HIGH:** 20
- 🟡 **MEDIUM:** 952
- 🟢 **LOW:** 2

### Issues by Type

- **MISSING_TRY_EXCEPT:** 952
- **PLACEHOLDER_PASS:** 15
- **PLACEHOLDER_ELLIPSIS:** 3
- **WRONG_DB_STRING:** 2
- **PLACEHOLDER_TODO:** 1
- **PLACEHOLDER_NOTIMPLEMENTED:** 1

## Issues by File

### FP1_code_formatter.txt

- Size: 45,053 chars
- Lines: 1,257
- Issues: 26

#### 🟡 ISS-0001: MISSING_TRY_EXCEPT

- **Line:** 524
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.pool = await asyncpg.create_pool(self.DATABASE_URL, min_size=5, max_size=20)
```

#### 🟡 ISS-0002: MISSING_TRY_EXCEPT

- **Line:** 542
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0003: MISSING_TRY_EXCEPT

- **Line:** 549
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT DISTINCT translator FROM texts")
```

#### 🟡 ISS-0004: MISSING_TRY_EXCEPT

- **Line:** 572
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0005: MISSING_TRY_EXCEPT

- **Line:** 603
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0006: MISSING_TRY_EXCEPT

- **Line:** 609
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
authors = await conn.fetch("SELECT id, name, birth_year, death_year FROM author_profiles")
```

#### 🟡 ISS-0007: MISSING_TRY_EXCEPT

- **Line:** 636
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0008: MISSING_TRY_EXCEPT

- **Line:** 643
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT word, vector FROM word_embeddings")
```

#### 🟡 ISS-0009: MISSING_TRY_EXCEPT

- **Line:** 676
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0010: MISSING_TRY_EXCEPT

- **Line:** 684
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
texts = await conn.fetch("SELECT id, title, text_content FROM texts LIMIT 5000")
```

#### 🟡 ISS-0011: MISSING_TRY_EXCEPT

- **Line:** 713
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0012: MISSING_TRY_EXCEPT

- **Line:** 749
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
"source_text_density": await self.check_source_text_density()
```

#### 🟡 ISS-0013: MISSING_TRY_EXCEPT

- **Line:** 761
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0014: MISSING_TRY_EXCEPT

- **Line:** 774
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await conn.fetch(query)
```

#### 🟡 ISS-0015: MISSING_TRY_EXCEPT

- **Line:** 791
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0016: MISSING_TRY_EXCEPT

- **Line:** 793
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
health = await self.get_system_health_metrics()
```

#### 🟡 ISS-0017: MISSING_TRY_EXCEPT

- **Line:** 794
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
consistency = await self.check_translator_profile_consistency()
```

#### 🟡 ISS-0018: MISSING_TRY_EXCEPT

- **Line:** 812
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.disconnect()
```

#### 🟡 ISS-0019: MISSING_TRY_EXCEPT

- **Line:** 820
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0020: MISSING_TRY_EXCEPT

- **Line:** 853
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0021: MISSING_TRY_EXCEPT

- **Line:** 885
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0022: MISSING_TRY_EXCEPT

- **Line:** 894
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
tags = await conn.fetch("SELECT DISTINCT language FROM source_texts")
```

#### 🟡 ISS-0023: MISSING_TRY_EXCEPT

- **Line:** 912
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0024: MISSING_TRY_EXCEPT

- **Line:** 925
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await conn.fetch(query)
```

#### 🟡 ISS-0025: MISSING_TRY_EXCEPT

- **Line:** 942
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0026: MISSING_TRY_EXCEPT

- **Line:** 959
- **Code File:** `backend/logos_quality_assurance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await conn.fetchval(coverage_query)
```

### FP2_performance_optimizer.txt

- Size: 37,476 chars
- Lines: 1,035
- Issues: 31

#### 🟡 ISS-0027: MISSING_TRY_EXCEPT

- **Line:** 52
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self._ensure_cache_schema()
```

#### 🟡 ISS-0028: MISSING_TRY_EXCEPT

- **Line:** 73
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0029: MISSING_TRY_EXCEPT

- **Line:** 76
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute(query)
```

#### 🟡 ISS-0030: MISSING_TRY_EXCEPT

- **Line:** 103
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0031: MISSING_TRY_EXCEPT

- **Line:** 125
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("DELETE FROM logos_query_cache WHERE cache_key = $1", key)
```

#### 🟡 ISS-0032: MISSING_TRY_EXCEPT

- **Line:** 145
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0033: MISSING_TRY_EXCEPT

- **Line:** 180
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0034: MISSING_TRY_EXCEPT

- **Line:** 183
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("DELETE FROM logos_query_cache WHERE cache_key = $1", key)
```

#### 🟡 ISS-0035: MISSING_TRY_EXCEPT

- **Line:** 189
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟠 ISS-0036: PLACEHOLDER_ELLIPSIS

- **Line:** 208
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Ellipsis placeholder - code incomplete
- **Suggested Fix:** Expand abbreviated code to full implementation

```
...
```

#### 🟡 ISS-0037: MISSING_TRY_EXCEPT

- **Line:** 216
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
cached_result = await logos_cache_manager.get(key)
```

#### 🟡 ISS-0038: MISSING_TRY_EXCEPT

- **Line:** 229
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await logos_cache_manager.set(key, result, ttl)
```

#### 🟡 ISS-0039: MISSING_TRY_EXCEPT

- **Line:** 241
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await logos_cache_manager._get_pool()
```

#### 🟡 ISS-0040: MISSING_TRY_EXCEPT

- **Line:** 246
- **Code File:** `backend/utils/cache_decorators.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
top_keys = await conn.fetch("SELECT cache_key, hit_count FROM logos_query_cache ORDER BY hit_count DESC LIMIT 5")
```

#### 🟡 ISS-0041: MISSING_TRY_EXCEPT

- **Line:** 884
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0042: MISSING_TRY_EXCEPT

- **Line:** 900
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0043: MISSING_TRY_EXCEPT

- **Line:** 916
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0044: MISSING_TRY_EXCEPT

- **Line:** 929
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0045: MISSING_TRY_EXCEPT

- **Line:** 931
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
embeddings = await conn.fetch("SELECT word, vector FROM word_embeddings")
```

#### 🟡 ISS-0046: MISSING_TRY_EXCEPT

- **Line:** 945
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0047: MISSING_TRY_EXCEPT

- **Line:** 956
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
cached = await self.get(key)
```

#### 🟡 ISS-0048: MISSING_TRY_EXCEPT

- **Line:** 960
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0049: MISSING_TRY_EXCEPT

- **Line:** 962
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
profile = await conn.fetchrow("SELECT * FROM author_profiles WHERE name = $1", author_name)
```

#### 🟡 ISS-0050: MISSING_TRY_EXCEPT

- **Line:** 965
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.set(key, data, ttl=3600 * 12)
```

#### 🟡 ISS-0051: MISSING_TRY_EXCEPT

- **Line:** 976
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0052: MISSING_TRY_EXCEPT

- **Line:** 978
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT cache_key, expires_at, hit_count FROM logos_query_cache")
```

#### 🟡 ISS-0053: MISSING_TRY_EXCEPT

- **Line:** 995
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0054: MISSING_TRY_EXCEPT

- **Line:** 997
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("SELECT 1")
```

#### 🟡 ISS-0055: MISSING_TRY_EXCEPT

- **Line:** 1005
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0056: MISSING_TRY_EXCEPT

- **Line:** 1012
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.set(key, value, ttl)
```

#### 🟡 ISS-0057: MISSING_TRY_EXCEPT

- **Line:** 1019
- **Code File:** `frontend/utils/lazy_loader.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
val = await self.get(key)
```

### FP3_monitoring.txt

- Size: 35,706 chars
- Lines: 911
- Issues: 25

#### 🟡 ISS-0058: MISSING_TRY_EXCEPT

- **Line:** 51
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(DATABASE_URL)
```

#### 🟡 ISS-0059: MISSING_TRY_EXCEPT

- **Line:** 62
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("SELECT 1")
```

#### 🟡 ISS-0060: MISSING_TRY_EXCEPT

- **Line:** 103
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await conn.fetch("SELECT DISTINCT name FROM translator_profiles")
```

#### 🟡 ISS-0061: MISSING_TRY_EXCEPT

- **Line:** 125
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
sample = await conn.fetchrow("SELECT vector FROM word_embeddings LIMIT 1")
```

#### 🟡 ISS-0062: MISSING_TRY_EXCEPT

- **Line:** 198
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self.get_db_connection()
```

#### 🟡 ISS-0063: MISSING_TRY_EXCEPT

- **Line:** 200
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
db_latency = await self.check_database_latency(conn)
```

#### 🟡 ISS-0064: MISSING_TRY_EXCEPT

- **Line:** 201
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
texts_health = await self.check_texts_table_integrity(conn)
```

#### 🟡 ISS-0065: MISSING_TRY_EXCEPT

- **Line:** 202
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
source_health = await self.check_source_texts_volume(conn)
```

#### 🟡 ISS-0066: MISSING_TRY_EXCEPT

- **Line:** 203
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
translator_integrity = await self.verify_translator_list(conn)
```

#### 🟡 ISS-0067: MISSING_TRY_EXCEPT

- **Line:** 204
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
embedding_health = await self.check_word_embeddings_health(conn)
```

#### 🟡 ISS-0068: MISSING_TRY_EXCEPT

- **Line:** 205
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
active_conns = await self.check_active_connections(conn)
```

#### 🟡 ISS-0069: MISSING_TRY_EXCEPT

- **Line:** 253
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0070: MISSING_TRY_EXCEPT

- **Line:** 259
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
report = await self.run_full_diagnostics()
```

#### 🟡 ISS-0071: MISSING_TRY_EXCEPT

- **Line:** 268
- **Code File:** `backend/monitoring/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
#     return await monitor.run_full_diagnostics()
```

#### 🟡 ISS-0072: MISSING_TRY_EXCEPT

- **Line:** 386
- **Code File:** `backend/monitoring/metrics.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(DATABASE_URL)
```

#### 🟡 ISS-0073: MISSING_TRY_EXCEPT

- **Line:** 396
- **Code File:** `backend/monitoring/metrics.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await asyncio.sleep(60)
```

#### 🟡 ISS-0074: MISSING_TRY_EXCEPT

- **Line:** 400
- **Code File:** `backend/monitoring/metrics.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟠 ISS-0075: PLACEHOLDER_PASS

- **Line:** 518
- **Code File:** `backend/monitoring/sentry_config.py`
- **Description:** Empty pass statement - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass
```

#### 🟡 ISS-0076: MISSING_TRY_EXCEPT

- **Line:** 652
- **Code File:** `backend/monitoring/performance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(DATABASE_URL)
```

#### 🟡 ISS-0077: MISSING_TRY_EXCEPT

- **Line:** 665
- **Code File:** `backend/monitoring/performance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0078: MISSING_TRY_EXCEPT

- **Line:** 676
- **Code File:** `backend/monitoring/performance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await asyncio.sleep(1)
```

#### 🟡 ISS-0079: MISSING_TRY_EXCEPT

- **Line:** 680
- **Code File:** `backend/monitoring/performance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await asyncio.sleep(5)
```

#### 🟡 ISS-0080: MISSING_TRY_EXCEPT

- **Line:** 700
- **Code File:** `backend/monitoring/performance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(DATABASE_URL)
```

#### 🟡 ISS-0081: MISSING_TRY_EXCEPT

- **Line:** 701
- **Code File:** `backend/monitoring/performance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await conn.fetch(query)
```

#### 🟡 ISS-0082: MISSING_TRY_EXCEPT

- **Line:** 708
- **Code File:** `backend/monitoring/performance.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

### FP4_scripts.txt

- Size: 34,451 chars
- Lines: 1,019
- Issues: 26

#### 🟡 ISS-0083: MISSING_TRY_EXCEPT

- **Line:** 73
- **Code File:** `scripts/seed_database.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.pool = await asyncpg.create_pool(self.dsn, min_size=5, max_size=20)
```

#### 🟡 ISS-0084: MISSING_TRY_EXCEPT

- **Line:** 79
- **Code File:** `scripts/seed_database.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await asyncio.sleep(5)
```

#### 🟡 ISS-0085: MISSING_TRY_EXCEPT

- **Line:** 128
- **Code File:** `scripts/seed_database.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.executemany(query, authors)
```

#### 🟡 ISS-0086: MISSING_TRY_EXCEPT

- **Line:** 160
- **Code File:** `scripts/seed_database.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.executemany(query, translator_data)
```

#### 🟡 ISS-0087: MISSING_TRY_EXCEPT

- **Line:** 192
- **Code File:** `scripts/seed_database.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.executemany(query, sample_texts)
```

#### 🟡 ISS-0088: MISSING_TRY_EXCEPT

- **Line:** 220
- **Code File:** `scripts/seed_database.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.executemany(query, embedding_data)
```

#### 🟡 ISS-0089: MISSING_TRY_EXCEPT

- **Line:** 254
- **Code File:** `scripts/seed_database.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0090: MISSING_TRY_EXCEPT

- **Line:** 258
- **Code File:** `scripts/seed_database.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.seed_author_profiles()
```

#### 🟡 ISS-0091: MISSING_TRY_EXCEPT

- **Line:** 259
- **Code File:** `scripts/seed_database.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.seed_translator_profiles()
```

#### 🟡 ISS-0092: MISSING_TRY_EXCEPT

- **Line:** 260
- **Code File:** `scripts/seed_database.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.seed_texts()
```

#### 🟡 ISS-0093: MISSING_TRY_EXCEPT

- **Line:** 261
- **Code File:** `scripts/seed_database.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.seed_word_embeddings()
```

#### 🟡 ISS-0094: MISSING_TRY_EXCEPT

- **Line:** 264
- **Code File:** `scripts/seed_database.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.verify_seeding()
```

#### 🟡 ISS-0095: MISSING_TRY_EXCEPT

- **Line:** 270
- **Code File:** `scripts/seed_database.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.close()
```

#### 🟡 ISS-0096: MISSING_TRY_EXCEPT

- **Line:** 901
- **Code File:** `scripts/seed_database.py (Continued/Expanded)`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.executemany(query, source_data)
```

#### 🟡 ISS-0097: MISSING_TRY_EXCEPT

- **Line:** 923
- **Code File:** `scripts/seed_database.py (Continued/Expanded)`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE")
```

#### 🟡 ISS-0098: MISSING_TRY_EXCEPT

- **Line:** 940
- **Code File:** `scripts/seed_database.py (Continued/Expanded)`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT name FROM translator_profiles")
```

#### 🟡 ISS-0099: MISSING_TRY_EXCEPT

- **Line:** 980
- **Code File:** `scripts/seed_database.py (Continued/Expanded)`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.executemany(query, embedding_data)
```

#### 🟡 ISS-0100: MISSING_TRY_EXCEPT

- **Line:** 992
- **Code File:** `scripts/seed_database.py (Continued/Expanded)`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0101: MISSING_TRY_EXCEPT

- **Line:** 1002
- **Code File:** `scripts/seed_database.py (Continued/Expanded)`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.seed_author_profiles()
```

#### 🟡 ISS-0102: MISSING_TRY_EXCEPT

- **Line:** 1003
- **Code File:** `scripts/seed_database.py (Continued/Expanded)`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.seed_translator_profiles()
```

#### 🟡 ISS-0103: MISSING_TRY_EXCEPT

- **Line:** 1004
- **Code File:** `scripts/seed_database.py (Continued/Expanded)`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.seed_texts()
```

#### 🟡 ISS-0104: MISSING_TRY_EXCEPT

- **Line:** 1005
- **Code File:** `scripts/seed_database.py (Continued/Expanded)`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.seed_source_texts()
```

#### 🟡 ISS-0105: MISSING_TRY_EXCEPT

- **Line:** 1006
- **Code File:** `scripts/seed_database.py (Continued/Expanded)`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.seed_word_embeddings()
```

#### 🟡 ISS-0106: MISSING_TRY_EXCEPT

- **Line:** 1007
- **Code File:** `scripts/seed_database.py (Continued/Expanded)`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.seed_batch_word_embeddings()
```

#### 🟡 ISS-0107: MISSING_TRY_EXCEPT

- **Line:** 1010
- **Code File:** `scripts/seed_database.py (Continued/Expanded)`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.verify_seeding()
```

#### 🟡 ISS-0108: MISSING_TRY_EXCEPT

- **Line:** 1016
- **Code File:** `scripts/seed_database.py (Continued/Expanded)`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.close()
```

### AN1_file_inventory.txt

- Size: 40,766 chars
- Lines: 993
- Issues: 52

#### 🟡 ISS-0109: MISSING_TRY_EXCEPT

- **Line:** 68
- **Code File:** `backend/analysis/file_inventory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.pool = await asyncpg.create_pool(self.DATABASE_URL)
```

#### 🟡 ISS-0110: MISSING_TRY_EXCEPT

- **Line:** 102
- **Code File:** `backend/analysis/file_inventory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
metadata_list = await self._process_text_file(txt_file)
```

#### 🟡 ISS-0111: MISSING_TRY_EXCEPT

- **Line:** 124
- **Code File:** `backend/analysis/file_inventory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
metadata = await self._extract_file_metadata(code, lang)
```

#### 🟡 ISS-0112: MISSING_TRY_EXCEPT

- **Line:** 127
- **Code File:** `backend/analysis/file_inventory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self._save_metadata_to_db(metadata)
```

#### 🟡 ISS-0113: MISSING_TRY_EXCEPT

- **Line:** 282
- **Code File:** `backend/analysis/file_inventory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("TRUNCATE TABLE file_inventory")
```

#### 🟡 ISS-0114: MISSING_TRY_EXCEPT

- **Line:** 295
- **Code File:** `backend/analysis/file_inventory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize_db()
```

#### 🟡 ISS-0115: MISSING_TRY_EXCEPT

- **Line:** 296
- **Code File:** `backend/analysis/file_inventory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.clear_inventory_cache()
```

#### 🟡 ISS-0116: MISSING_TRY_EXCEPT

- **Line:** 297
- **Code File:** `backend/analysis/file_inventory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.scan_build_directory()
```

#### 🟡 ISS-0117: MISSING_TRY_EXCEPT

- **Line:** 298
- **Code File:** `backend/analysis/file_inventory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
summary = await self.get_inventory_summary()
```

#### 🟡 ISS-0118: MISSING_TRY_EXCEPT

- **Line:** 299
- **Code File:** `backend/analysis/file_inventory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.close()
```

#### 🟡 ISS-0119: MISSING_TRY_EXCEPT

- **Line:** 372
- **Code File:** `backend/analysis/completeness_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0120: MISSING_TRY_EXCEPT

- **Line:** 373
- **Code File:** `backend/analysis/completeness_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
files = await conn.fetch("SELECT filepath, language FROM file_inventory")
```

#### 🟡 ISS-0121: MISSING_TRY_EXCEPT

- **Line:** 384
- **Code File:** `backend/analysis/completeness_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await self._perform_deep_analysis(filepath)
```

#### 🟡 ISS-0122: MISSING_TRY_EXCEPT

- **Line:** 388
- **Code File:** `backend/analysis/completeness_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0123: MISSING_TRY_EXCEPT

- **Line:** 404
- **Code File:** `backend/analysis/completeness_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
code = await self._fetch_source_code(filepath)
```

#### 🟡 ISS-0124: MISSING_TRY_EXCEPT

- **Line:** 428
- **Code File:** `backend/analysis/completeness_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0125: MISSING_TRY_EXCEPT

- **Line:** 430
- **Code File:** `backend/analysis/completeness_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow("SELECT text_content FROM texts WHERE title = $1 LIMIT 1", filepath)
```

#### 🟡 ISS-0126: MISSING_TRY_EXCEPT

- **Line:** 431
- **Code File:** `backend/analysis/completeness_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0127: MISSING_TRY_EXCEPT

- **Line:** 562
- **Code File:** `backend/analysis/completeness_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0128: MISSING_TRY_EXCEPT

- **Line:** 571
- **Code File:** `backend/analysis/completeness_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0129: MISSING_TRY_EXCEPT

- **Line:** 622
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.db_pool = await asyncpg.create_pool(self.DATABASE_URL)
```

#### 🟡 ISS-0130: MISSING_TRY_EXCEPT

- **Line:** 630
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_db_connection()
```

#### 🟡 ISS-0131: MISSING_TRY_EXCEPT

- **Line:** 640
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
missing_translators = await self._identify_missing_translators(conn)
```

#### 🟡 ISS-0132: MISSING_TRY_EXCEPT

- **Line:** 643
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
completion = await self._calculate_completion_percentage(conn, total_files)
```

#### 🟡 ISS-0133: MISSING_TRY_EXCEPT

- **Line:** 646
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
metrics = await self._aggregate_metrics(conn)
```

#### 🟡 ISS-0134: MISSING_TRY_EXCEPT

- **Line:** 659
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self._persist_report_to_db(report)
```

#### 🟡 ISS-0135: MISSING_TRY_EXCEPT

- **Line:** 674
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT DISTINCT translator FROM texts")
```

#### 🟡 ISS-0136: MISSING_TRY_EXCEPT

- **Line:** 710
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_db_connection()
```

#### 🟡 ISS-0137: MISSING_TRY_EXCEPT

- **Line:** 755
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_db_connection()
```

#### 🟡 ISS-0138: MISSING_TRY_EXCEPT

- **Line:** 757
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT data FROM gap_reports ORDER BY created_at DESC LIMIT 10")
```

#### 🟡 ISS-0139: MISSING_TRY_EXCEPT

- **Line:** 762
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_db_connection()
```

#### 🟡 ISS-0140: MISSING_TRY_EXCEPT

- **Line:** 765
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("DELETE FROM gap_reports WHERE created_at < $1", cutoff)
```

#### 🟡 ISS-0141: MISSING_TRY_EXCEPT

- **Line:** 789
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
scan_summary = await scanner.run_full_scan()
```

#### 🟡 ISS-0142: MISSING_TRY_EXCEPT

- **Line:** 795
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await checker.check_all_files()
```

#### 🟡 ISS-0143: MISSING_TRY_EXCEPT

- **Line:** 796
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await checker.save_results_to_db()
```

#### 🟡 ISS-0144: MISSING_TRY_EXCEPT

- **Line:** 803
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
report = await reporter.create_full_report()
```

#### 🟡 ISS-0145: MISSING_TRY_EXCEPT

- **Line:** 809
- **Code File:** `backend/analysis/gap_report_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await reporter.close()
```

#### 🟡 ISS-0146: MISSING_TRY_EXCEPT

- **Line:** 848
- **Code File:** `backend/analysis/cli_interface.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await scanner.initialize_db()
```

#### 🟡 ISS-0147: MISSING_TRY_EXCEPT

- **Line:** 850
- **Code File:** `backend/analysis/cli_interface.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await scanner.scan_build_directory()
```

#### 🟡 ISS-0148: MISSING_TRY_EXCEPT

- **Line:** 855
- **Code File:** `backend/analysis/cli_interface.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await checker.check_all_files()
```

#### 🟡 ISS-0149: MISSING_TRY_EXCEPT

- **Line:** 856
- **Code File:** `backend/analysis/cli_interface.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await checker.save_results_to_db()
```

#### 🟡 ISS-0150: MISSING_TRY_EXCEPT

- **Line:** 861
- **Code File:** `backend/analysis/cli_interface.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
report = await reporter.create_full_report()
```

#### 🟡 ISS-0151: MISSING_TRY_EXCEPT

- **Line:** 869
- **Code File:** `backend/analysis/cli_interface.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await scanner.close()
```

#### 🟡 ISS-0152: MISSING_TRY_EXCEPT

- **Line:** 870
- **Code File:** `backend/analysis/cli_interface.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await reporter.close()
```

#### 🟡 ISS-0153: MISSING_TRY_EXCEPT

- **Line:** 915
- **Code File:** `backend/analysis/db_schema_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.pool = await asyncpg.create_pool(self.DATABASE_URL)
```

#### 🟡 ISS-0154: MISSING_TRY_EXCEPT

- **Line:** 924
- **Code File:** `backend/analysis/db_schema_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0155: MISSING_TRY_EXCEPT

- **Line:** 971
- **Code File:** `backend/analysis/db_schema_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0156: MISSING_TRY_EXCEPT

- **Line:** 975
- **Code File:** `backend/analysis/db_schema_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("DROP TABLE IF EXISTS gap_reports;")
```

#### 🟡 ISS-0157: MISSING_TRY_EXCEPT

- **Line:** 976
- **Code File:** `backend/analysis/db_schema_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("DROP TABLE IF EXISTS completeness_results;")
```

#### 🟡 ISS-0158: MISSING_TRY_EXCEPT

- **Line:** 977
- **Code File:** `backend/analysis/db_schema_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("DROP TABLE IF EXISTS file_inventory;")
```

#### 🟡 ISS-0159: MISSING_TRY_EXCEPT

- **Line:** 988
- **Code File:** `backend/analysis/db_schema_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await manager.provision_tables()
```

#### 🟡 ISS-0160: MISSING_TRY_EXCEPT

- **Line:** 989
- **Code File:** `backend/analysis/db_schema_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await manager.close()
```

### AN2_dependency_mapper.txt

- Size: 37,503 chars
- Lines: 1,035
- Issues: 8

#### 🟡 ISS-0161: MISSING_TRY_EXCEPT

- **Line:** 213
- **Code File:** `backend/analysis/dependency_mapper.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(DATABASE_URL)
```

#### 🟡 ISS-0162: MISSING_TRY_EXCEPT

- **Line:** 232
- **Code File:** `backend/analysis/dependency_mapper.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0163: MISSING_TRY_EXCEPT

- **Line:** 445
- **Code File:** `backend/analysis/dependency_mapper.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await master_graph.sync_with_database()
```

#### 🟠 ISS-0164: PLACEHOLDER_PASS

- **Line:** 529
- **Code File:** `backend/analysis/import_resolver.py`
- **Description:** Empty pass statement - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass
```

#### 🟡 ISS-0165: MISSING_TRY_EXCEPT

- **Line:** 634
- **Code File:** `backend/analysis/import_resolver.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(DATABASE_URL)
```

#### 🟡 ISS-0166: MISSING_TRY_EXCEPT

- **Line:** 636
- **Code File:** `backend/analysis/import_resolver.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
```

#### 🟡 ISS-0167: MISSING_TRY_EXCEPT

- **Line:** 648
- **Code File:** `backend/analysis/import_resolver.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟠 ISS-0168: PLACEHOLDER_PASS

- **Line:** 1001
- **Code File:** `frontend/analysis/component_tree.ts`
- **Description:** Pass with comment - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass # (Note: Real implementation is in the primary file block)
```

### AN3_api_endpoint_mapper.txt

- Size: 36,643 chars
- Lines: 976
- Issues: 8

#### 🟡 ISS-0169: MISSING_TRY_EXCEPT

- **Line:** 439
- **Code File:** `backend/analysis/endpoint_tester.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.db_pool = await asyncpg.create_pool(DATABASE_URL)
```

#### 🟡 ISS-0170: MISSING_TRY_EXCEPT

- **Line:** 471
- **Code File:** `backend/analysis/endpoint_tester.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await client.get(url)
```

#### 🟡 ISS-0171: MISSING_TRY_EXCEPT

- **Line:** 473
- **Code File:** `backend/analysis/endpoint_tester.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await client.post(url, json=payload)
```

#### 🟡 ISS-0172: MISSING_TRY_EXCEPT

- **Line:** 527
- **Code File:** `backend/analysis/endpoint_tester.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow("SELECT id FROM texts WHERE id = $1", text_id)
```

#### 🟡 ISS-0173: MISSING_TRY_EXCEPT

- **Line:** 803
- **Code File:** `backend/api/endpoint_registry.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(DATABASE_URL)
```

#### 🟡 ISS-0174: MISSING_TRY_EXCEPT

- **Line:** 825
- **Code File:** `backend/api/endpoint_registry.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0175: MISSING_TRY_EXCEPT

- **Line:** 944
- **Code File:** `backend/api/endpoint_registry.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT * FROM author_profiles LIMIT 10")
```

#### 🟡 ISS-0176: MISSING_TRY_EXCEPT

- **Line:** 966
- **Code File:** `backend/api/endpoint_registry.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await registry.validate_all_endpoints()
```

### AN4_react_component_analyzer.txt

- Size: 30,167 chars
- Lines: 838
- Issues: 13

#### 🟡 ISS-0177: MISSING_TRY_EXCEPT

- **Line:** 589
- **Code File:** `backend/services/analysis_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.pool = await asyncpg.create_pool(self.DATABASE_URL)
```

#### 🟡 ISS-0178: MISSING_TRY_EXCEPT

- **Line:** 606
- **Code File:** `backend/services/analysis_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0179: MISSING_TRY_EXCEPT

- **Line:** 615
- **Code File:** `backend/services/analysis_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
record = await conn.fetchrow(query, translator_name)
```

#### 🟡 ISS-0180: MISSING_TRY_EXCEPT

- **Line:** 635
- **Code File:** `backend/services/analysis_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0181: MISSING_TRY_EXCEPT

- **Line:** 657
- **Code File:** `backend/services/analysis_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0182: MISSING_TRY_EXCEPT

- **Line:** 662
- **Code File:** `backend/services/analysis_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
content = await conn.fetchval(query, work_id, line_number)
```

#### 🟡 ISS-0183: MISSING_TRY_EXCEPT

- **Line:** 673
- **Code File:** `backend/services/analysis_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0184: MISSING_TRY_EXCEPT

- **Line:** 683
- **Code File:** `backend/services/analysis_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0185: MISSING_TRY_EXCEPT

- **Line:** 696
- **Code File:** `backend/services/analysis_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
stats = await self.get_text_integrity_stats()
```

#### 🟡 ISS-0186: MISSING_TRY_EXCEPT

- **Line:** 697
- **Code File:** `backend/services/analysis_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
authors = await self.analyze_author_distribution()
```

#### 🟡 ISS-0187: MISSING_TRY_EXCEPT

- **Line:** 719
- **Code File:** `backend/services/analysis_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await logos_analyzer.connect()
```

#### 🟡 ISS-0188: MISSING_TRY_EXCEPT

- **Line:** 720
- **Code File:** `backend/services/analysis_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
report = await logos_analyzer.perform_full_system_audit()
```

#### 🟡 ISS-0189: MISSING_TRY_EXCEPT

- **Line:** 722
- **Code File:** `backend/services/analysis_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await logos_analyzer.disconnect()
```

### AN5_database_query_analyzer.txt

- Size: 41,308 chars
- Lines: 953
- Issues: 19

#### 🟠 ISS-0190: PLACEHOLDER_PASS

- **Line:** 547
- **Code File:** `backend/analysis/schema_validator.py`
- **Description:** Empty pass statement - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass
```

#### 🟠 ISS-0191: PLACEHOLDER_PASS

- **Line:** 554
- **Code File:** `backend/analysis/schema_validator.py`
- **Description:** Empty pass statement - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass
```

#### 🟡 ISS-0192: MISSING_TRY_EXCEPT

- **Line:** 707
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.pool = await asyncpg.create_pool(self.dsn, min_size=1, max_size=5)
```

#### 🟡 ISS-0193: MISSING_TRY_EXCEPT

- **Line:** 722
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0194: MISSING_TRY_EXCEPT

- **Line:** 730
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await conn.fetchval(explain_sql, *params)
```

#### 🟡 ISS-0195: MISSING_TRY_EXCEPT

- **Line:** 732
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await conn.fetchval(explain_sql)
```

#### 🟡 ISS-0196: MISSING_TRY_EXCEPT

- **Line:** 782
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
plan = await self.get_explain_plan(sql, params)
```

#### 🟡 ISS-0197: MISSING_TRY_EXCEPT

- **Line:** 817
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0198: MISSING_TRY_EXCEPT

- **Line:** 823
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute(rec)
```

#### 🟡 ISS-0199: MISSING_TRY_EXCEPT

- **Line:** 849
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
plan = await self.get_explain_plan(sql)
```

#### 🟡 ISS-0200: MISSING_TRY_EXCEPT

- **Line:** 862
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
original_plan = await self.get_explain_plan(sql)
```

#### 🟡 ISS-0201: MISSING_TRY_EXCEPT

- **Line:** 871
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0202: MISSING_TRY_EXCEPT

- **Line:** 877
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute(sql)
```

#### 🟡 ISS-0203: MISSING_TRY_EXCEPT

- **Line:** 889
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0204: MISSING_TRY_EXCEPT

- **Line:** 900
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0205: MISSING_TRY_EXCEPT

- **Line:** 909
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0206: MISSING_TRY_EXCEPT

- **Line:** 918
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute(query, f"{threshold_seconds}")
```

#### 🟡 ISS-0207: MISSING_TRY_EXCEPT

- **Line:** 924
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0208: MISSING_TRY_EXCEPT

- **Line:** 927
- **Code File:** `backend/database/query_optimizer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute(f"SET statement_timeout = '{seconds}s'")
```

### BC1_api_corpus_complete.txt

- Size: 26,723 chars
- Lines: 846
- Issues: 16

#### 🟡 ISS-0209: MISSING_TRY_EXCEPT

- **Line:** 411
- **Code File:** `backend/api/corpus/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(sql, *params)
```

#### 🟡 ISS-0210: MISSING_TRY_EXCEPT

- **Line:** 412
- **Code File:** `backend/api/corpus/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
total_count = await conn.fetchval(queries.GET_TEXT_COUNT, author, translator, f"%{query}%" if query else None)
```

#### 🟡 ISS-0211: MISSING_TRY_EXCEPT

- **Line:** 433
- **Code File:** `backend/api/corpus/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(queries.GET_TEXT_BY_ID, text_id)
```

#### 🟡 ISS-0212: MISSING_TRY_EXCEPT

- **Line:** 456
- **Code File:** `backend/api/corpus/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(sql, *params)
```

#### 🟡 ISS-0213: MISSING_TRY_EXCEPT

- **Line:** 477
- **Code File:** `backend/api/corpus/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(queries.GET_ALL_AUTHORS)
```

#### 🟡 ISS-0214: MISSING_TRY_EXCEPT

- **Line:** 497
- **Code File:** `backend/api/corpus/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(queries.GET_WORKS_BY_AUTHOR, author_name)
```

#### 🟡 ISS-0215: MISSING_TRY_EXCEPT

- **Line:** 539
- **Code File:** `backend/api/corpus/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(queries.GET_MULTIPLE_TEXTS, text_ids)
```

#### 🟡 ISS-0216: MISSING_TRY_EXCEPT

- **Line:** 587
- **Code File:** `backend/api/corpus/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await corpus_service.initialize()
```

#### 🟡 ISS-0217: MISSING_TRY_EXCEPT

- **Line:** 592
- **Code File:** `backend/api/corpus/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await corpus_service.close()
```

#### 🟡 ISS-0218: MISSING_TRY_EXCEPT

- **Line:** 642
- **Code File:** `backend/api/corpus/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await corpus_service.get_text_by_id(text_id)
```

#### 🟡 ISS-0219: MISSING_TRY_EXCEPT

- **Line:** 669
- **Code File:** `backend/api/corpus/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await corpus_service.search_corpus(q, page, page_size)
```

#### 🟡 ISS-0220: MISSING_TRY_EXCEPT

- **Line:** 690
- **Code File:** `backend/api/corpus/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await corpus_service.list_authors()
```

#### 🟡 ISS-0221: MISSING_TRY_EXCEPT

- **Line:** 713
- **Code File:** `backend/api/corpus/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
works = await corpus_service.get_works_by_author(author_name)
```

#### 🟡 ISS-0222: MISSING_TRY_EXCEPT

- **Line:** 743
- **Code File:** `backend/api/corpus/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
passage = await corpus_service.get_passage(work, author, start_line, end_line)
```

#### 🟡 ISS-0223: MISSING_TRY_EXCEPT

- **Line:** 769
- **Code File:** `backend/api/corpus/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await corpus_service.compare_texts(request.text_ids)
```

#### 🟡 ISS-0224: MISSING_TRY_EXCEPT

- **Line:** 794
- **Code File:** `backend/api/corpus/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("SELECT 1")
```

### BC2_api_translate_complete.txt

- Size: 37,143 chars
- Lines: 922
- Issues: 39

#### 🟡 ISS-0225: MISSING_TRY_EXCEPT

- **Line:** 250
- **Code File:** `backend/api/translate/ltqi_calculator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
fidelity = await self._calculate_fidelity(text, source_text)
```

#### 🟡 ISS-0226: MISSING_TRY_EXCEPT

- **Line:** 475
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0227: MISSING_TRY_EXCEPT

- **Line:** 479
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0228: MISSING_TRY_EXCEPT

- **Line:** 487
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0229: MISSING_TRY_EXCEPT

- **Line:** 491
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, name)
```

#### 🟡 ISS-0230: MISSING_TRY_EXCEPT

- **Line:** 499
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0231: MISSING_TRY_EXCEPT

- **Line:** 507
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, book, chapter)
```

#### 🟡 ISS-0232: MISSING_TRY_EXCEPT

- **Line:** 525
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0233: MISSING_TRY_EXCEPT

- **Line:** 529
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, text_ids)
```

#### 🟡 ISS-0234: MISSING_TRY_EXCEPT

- **Line:** 544
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0235: MISSING_TRY_EXCEPT

- **Line:** 548
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, name)
```

#### 🟡 ISS-0236: MISSING_TRY_EXCEPT

- **Line:** 556
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0237: MISSING_TRY_EXCEPT

- **Line:** 560
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, passage_id)
```

#### 🟡 ISS-0238: MISSING_TRY_EXCEPT

- **Line:** 572
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0239: MISSING_TRY_EXCEPT

- **Line:** 576
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, work_id, line_number)
```

#### 🟡 ISS-0240: MISSING_TRY_EXCEPT

- **Line:** 584
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0241: MISSING_TRY_EXCEPT

- **Line:** 588
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0242: MISSING_TRY_EXCEPT

- **Line:** 596
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0243: MISSING_TRY_EXCEPT

- **Line:** 600
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, id_a, id_b)
```

#### 🟡 ISS-0244: MISSING_TRY_EXCEPT

- **Line:** 621
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0245: MISSING_TRY_EXCEPT

- **Line:** 625
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, name)
```

#### 🟡 ISS-0246: MISSING_TRY_EXCEPT

- **Line:** 638
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0247: MISSING_TRY_EXCEPT

- **Line:** 642
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
status = await conn.execute(query, vector, name)
```

#### 🟡 ISS-0248: MISSING_TRY_EXCEPT

- **Line:** 653
- **Code File:** `backend/api/translate/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await conn.fetchval("SELECT 1")
```

#### 🟡 ISS-0249: MISSING_TRY_EXCEPT

- **Line:** 700
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await translation_service.connect()
```

#### 🟡 ISS-0250: MISSING_TRY_EXCEPT

- **Line:** 706
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await translation_service.disconnect()
```

#### 🟡 ISS-0251: MISSING_TRY_EXCEPT

- **Line:** 717
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
translators = await translation_service.get_all_translators()
```

#### 🟡 ISS-0252: MISSING_TRY_EXCEPT

- **Line:** 735
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
works = await translation_service.get_works_by_translator(name.value)
```

#### 🟡 ISS-0253: MISSING_TRY_EXCEPT

- **Line:** 755
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
translations = await translation_service.get_passage_translations(book, chapter)
```

#### 🟡 ISS-0254: MISSING_TRY_EXCEPT

- **Line:** 776
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
comparison_data = await translation_service.compare_translations(ids)
```

#### 🟡 ISS-0255: MISSING_TRY_EXCEPT

- **Line:** 812
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
analysis = await translation_service.analyze_translation_diff(id_a, id_b)
```

#### 🟡 ISS-0256: MISSING_TRY_EXCEPT

- **Line:** 828
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
profiles = await translation_service.get_style_profiles()
```

#### 🟡 ISS-0257: MISSING_TRY_EXCEPT

- **Line:** 860
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
stats = await translation_service.get_translator_stats(name.value)
```

#### 🟡 ISS-0258: MISSING_TRY_EXCEPT

- **Line:** 869
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
is_db_up = await translation_service.health_check()
```

#### 🟡 ISS-0259: MISSING_TRY_EXCEPT

- **Line:** 882
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not translation_service.pool: await translation_service.connect()
```

#### 🟡 ISS-0260: MISSING_TRY_EXCEPT

- **Line:** 886
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(sql, f"%{query}%", limit)
```

#### 🟡 ISS-0261: MISSING_TRY_EXCEPT

- **Line:** 900
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
profile = await translation_service.get_translator_by_name(name.value)
```

#### 🟡 ISS-0262: MISSING_TRY_EXCEPT

- **Line:** 904
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
works_data = await translation_service.get_works_by_translator(name.value)
```

#### 🟡 ISS-0263: MISSING_TRY_EXCEPT

- **Line:** 912
- **Code File:** `backend/api/translate/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
stats = await translation_service.get_translator_stats(name.value)
```

### BC3_api_semantia_complete.txt

- Size: 37,057 chars
- Lines: 1,005
- Issues: 33

#### 🟡 ISS-0264: MISSING_TRY_EXCEPT

- **Line:** 419
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await asyncpg.connect(self.db_url)
```

#### 🟡 ISS-0265: MISSING_TRY_EXCEPT

- **Line:** 434
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self._get_connection()
```

#### 🟡 ISS-0266: MISSING_TRY_EXCEPT

- **Line:** 437
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, word)
```

#### 🟡 ISS-0267: MISSING_TRY_EXCEPT

- **Line:** 453
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0268: MISSING_TRY_EXCEPT

- **Line:** 466
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self._get_connection()
```

#### 🟡 ISS-0269: MISSING_TRY_EXCEPT

- **Line:** 470
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
frequency = await conn.fetchval(freq_query, f"% {word} %")
```

#### 🟡 ISS-0270: MISSING_TRY_EXCEPT

- **Line:** 473
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
target_vector = await self.get_word_vector(word)
```

#### 🟡 ISS-0271: MISSING_TRY_EXCEPT

- **Line:** 482
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(all_vec_query)
```

#### 🟡 ISS-0272: MISSING_TRY_EXCEPT

- **Line:** 504
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0273: MISSING_TRY_EXCEPT

- **Line:** 517
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self._get_connection()
```

#### 🟡 ISS-0274: MISSING_TRY_EXCEPT

- **Line:** 526
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, f"% {word} %")
```

#### 🟡 ISS-0275: MISSING_TRY_EXCEPT

- **Line:** 543
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
genres = await conn.fetchval(genre_query, auth)
```

#### 🟡 ISS-0276: MISSING_TRY_EXCEPT

- **Line:** 564
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0277: MISSING_TRY_EXCEPT

- **Line:** 581
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
vec = await self.get_word_vector(word)
```

#### 🟡 ISS-0278: MISSING_TRY_EXCEPT

- **Line:** 624
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self._get_connection()
```

#### 🟡 ISS-0279: MISSING_TRY_EXCEPT

- **Line:** 654
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0280: MISSING_TRY_EXCEPT

- **Line:** 668
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self._get_connection()
```

#### 🟡 ISS-0281: MISSING_TRY_EXCEPT

- **Line:** 676
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, author, f"% {word} %")
```

#### 🟡 ISS-0282: MISSING_TRY_EXCEPT

- **Line:** 702
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0283: MISSING_TRY_EXCEPT

- **Line:** 715
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self._get_connection()
```

#### 🟡 ISS-0284: MISSING_TRY_EXCEPT

- **Line:** 719
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
work_id = await conn.fetchval(query, f"% {word} %")
```

#### 🟡 ISS-0285: MISSING_TRY_EXCEPT

- **Line:** 724
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
earliest_work = await conn.fetchval("SELECT title FROM texts WHERE id = $1", work_id)
```

#### 🟡 ISS-0286: MISSING_TRY_EXCEPT

- **Line:** 737
- **Code File:** `backend/api/semantia/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0287: MISSING_TRY_EXCEPT

- **Line:** 794
- **Code File:** `backend/api/semantia/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
analysis = await service.get_word_analysis(word)
```

#### 🟡 ISS-0288: MISSING_TRY_EXCEPT

- **Line:** 829
- **Code File:** `backend/api/semantia/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
analysis = await service.get_word_analysis(word)
```

#### 🟡 ISS-0289: MISSING_TRY_EXCEPT

- **Line:** 857
- **Code File:** `backend/api/semantia/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
clusters = await service.get_semantic_clusters(limit=limit)
```

#### 🟡 ISS-0290: MISSING_TRY_EXCEPT

- **Line:** 881
- **Code File:** `backend/api/semantia/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
comparison = await service.compare_words(request.words)
```

#### 🟡 ISS-0291: MISSING_TRY_EXCEPT

- **Line:** 905
- **Code File:** `backend/api/semantia/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
data = await service.get_etymology(word)
```

#### 🟡 ISS-0292: MISSING_TRY_EXCEPT

- **Line:** 929
- **Code File:** `backend/api/semantia/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
usage = await service.get_word_usage(word)
```

#### 🟡 ISS-0293: MISSING_TRY_EXCEPT

- **Line:** 954
- **Code File:** `backend/api/semantia/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
usage = await service.get_author_usage(word, author)
```

#### 🟡 ISS-0294: MISSING_TRY_EXCEPT

- **Line:** 982
- **Code File:** `backend/api/semantia/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await service._get_connection()
```

#### 🟡 ISS-0295: MISSING_TRY_EXCEPT

- **Line:** 983
- **Code File:** `backend/api/semantia/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
val = await conn.fetchval("SELECT 1")
```

#### 🟡 ISS-0296: MISSING_TRY_EXCEPT

- **Line:** 984
- **Code File:** `backend/api/semantia/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

### BC4_api_chronos_complete.txt

- Size: 50,770 chars
- Lines: 1,301
- Issues: 23

#### 🟡 ISS-0297: MISSING_TRY_EXCEPT

- **Line:** 586
- **Code File:** `backend/api/chronos/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.pool = await asyncpg.create_pool(DATABASE_URL)
```

#### 🟡 ISS-0298: MISSING_TRY_EXCEPT

- **Line:** 623
- **Code File:** `backend/api/chronos/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0299: MISSING_TRY_EXCEPT

- **Line:** 689
- **Code File:** `backend/api/chronos/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0300: MISSING_TRY_EXCEPT

- **Line:** 726
- **Code File:** `backend/api/chronos/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0301: MISSING_TRY_EXCEPT

- **Line:** 772
- **Code File:** `backend/api/chronos/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0302: MISSING_TRY_EXCEPT

- **Line:** 822
- **Code File:** `backend/api/chronos/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
vocab_a = await self.get_period_vocabulary(period_a_id)
```

#### 🟡 ISS-0303: MISSING_TRY_EXCEPT

- **Line:** 823
- **Code File:** `backend/api/chronos/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
vocab_b = await self.get_period_vocabulary(period_b_id)
```

#### 🟡 ISS-0304: MISSING_TRY_EXCEPT

- **Line:** 851
- **Code File:** `backend/api/chronos/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0305: MISSING_TRY_EXCEPT

- **Line:** 914
- **Code File:** `backend/api/chronos/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0306: MISSING_TRY_EXCEPT

- **Line:** 962
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await service.connect()
```

#### 🟡 ISS-0307: MISSING_TRY_EXCEPT

- **Line:** 965
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await service.disconnect()
```

#### 🟡 ISS-0308: MISSING_TRY_EXCEPT

- **Line:** 975
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
periods = await service.get_all_periods()
```

#### 🟡 ISS-0309: MISSING_TRY_EXCEPT

- **Line:** 999
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
timeline = await service.get_timeline_events(start_year, end_year)
```

#### 🟡 ISS-0310: MISSING_TRY_EXCEPT

- **Line:** 1021
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
analysis = await service.get_word_drift(word)
```

#### 🟡 ISS-0311: MISSING_TRY_EXCEPT

- **Line:** 1044
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
authors = await service.get_authors_in_period(period)
```

#### 🟡 ISS-0312: MISSING_TRY_EXCEPT

- **Line:** 1066
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
vocab = await service.get_period_vocabulary(period)
```

#### 🟡 ISS-0313: MISSING_TRY_EXCEPT

- **Line:** 1090
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
comparison = await service.compare_periods(request.period_a_id, request.period_b_id)
```

#### 🟡 ISS-0314: MISSING_TRY_EXCEPT

- **Line:** 1121
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
context = await service.get_author_historical_context(author)
```

#### 🟡 ISS-0315: MISSING_TRY_EXCEPT

- **Line:** 1143
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
clusters = await service.get_semantic_clusters_for_period(period)
```

#### 🟡 ISS-0316: MISSING_TRY_EXCEPT

- **Line:** 1191
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
res = await service.run_custom_query(query, [author_id])
```

#### 🟡 ISS-0317: MISSING_TRY_EXCEPT

- **Line:** 1224
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await service.run_custom_query(query, [year])
```

#### 🟡 ISS-0318: MISSING_TRY_EXCEPT

- **Line:** 1248
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
stats = await service.run_custom_query(query, [period.start_year, period.end_year])
```

#### 🟡 ISS-0319: MISSING_TRY_EXCEPT

- **Line:** 1287
- **Code File:** `backend/api/chronos/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
res = await service.run_custom_query(query, [translator_name])
```

### BC5_api_connectome_complete.txt

- Size: 39,282 chars
- Lines: 1,019
- Issues: 30

#### 🟡 ISS-0320: MISSING_TRY_EXCEPT

- **Line:** 517
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self._pool = await asyncpg.create_pool(self.DATABASE_URL, min_size=5, max_size=20)
```

#### 🟡 ISS-0321: MISSING_TRY_EXCEPT

- **Line:** 534
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
authors = await conn.fetch("SELECT id, name, birth_year, death_year, nationality, genres FROM author_profiles")
```

#### 🟡 ISS-0322: MISSING_TRY_EXCEPT

- **Line:** 549
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
texts = await conn.fetch("SELECT id, title, author, translator FROM texts")
```

#### 🟡 ISS-0323: MISSING_TRY_EXCEPT

- **Line:** 559
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
translators = await conn.fetch("SELECT DISTINCT name, works_translated FROM translator_profiles")
```

#### 🟡 ISS-0324: MISSING_TRY_EXCEPT

- **Line:** 626
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
nodes = await self.fetch_all_nodes()
```

#### 🟡 ISS-0325: MISSING_TRY_EXCEPT

- **Line:** 627
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
edges = await self.fetch_all_edges()
```

#### 🟡 ISS-0326: MISSING_TRY_EXCEPT

- **Line:** 637
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.sync_graph()
```

#### 🟡 ISS-0327: MISSING_TRY_EXCEPT

- **Line:** 664
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.sync_graph()
```

#### 🟡 ISS-0328: MISSING_TRY_EXCEPT

- **Line:** 681
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.sync_graph()
```

#### 🟡 ISS-0329: MISSING_TRY_EXCEPT

- **Line:** 709
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.sync_graph()
```

#### 🟡 ISS-0330: MISSING_TRY_EXCEPT

- **Line:** 730
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.sync_graph()
```

#### 🟡 ISS-0331: MISSING_TRY_EXCEPT

- **Line:** 736
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.sync_graph()
```

#### 🟡 ISS-0332: MISSING_TRY_EXCEPT

- **Line:** 742
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.sync_graph()
```

#### 🟡 ISS-0333: MISSING_TRY_EXCEPT

- **Line:** 748
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.sync_graph()
```

#### 🟡 ISS-0334: MISSING_TRY_EXCEPT

- **Line:** 754
- **Code File:** `backend/api/connectome/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.sync_graph()
```

#### 🟡 ISS-0335: MISSING_TRY_EXCEPT

- **Line:** 800
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await _connectome_service.initialize()
```

#### 🟡 ISS-0336: MISSING_TRY_EXCEPT

- **Line:** 807
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await _connectome_service.initialize()
```

#### 🟡 ISS-0337: MISSING_TRY_EXCEPT

- **Line:** 810
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await _connectome_service.sync_graph()
```

#### 🟡 ISS-0338: MISSING_TRY_EXCEPT

- **Line:** 819
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await _connectome_service.close()
```

#### 🟡 ISS-0339: MISSING_TRY_EXCEPT

- **Line:** 828
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
stats = await service.get_system_stats()
```

#### 🟡 ISS-0340: MISSING_TRY_EXCEPT

- **Line:** 848
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await service.get_full_graph()
```

#### 🟡 ISS-0341: MISSING_TRY_EXCEPT

- **Line:** 862
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
node = await service.get_node_by_id(node_id)
```

#### 🟡 ISS-0342: MISSING_TRY_EXCEPT

- **Line:** 876
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
edges = await service.get_edges_for_node(node_id)
```

#### 🟡 ISS-0343: MISSING_TRY_EXCEPT

- **Line:** 891
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
path_result = await service.get_path(request.source_id, request.target_id)
```

#### 🟡 ISS-0344: MISSING_TRY_EXCEPT

- **Line:** 911
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await service.get_pagerank()
```

#### 🟡 ISS-0345: MISSING_TRY_EXCEPT

- **Line:** 926
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await service.get_subgraph(request.root_node_ids, request.depth)
```

#### 🟡 ISS-0346: MISSING_TRY_EXCEPT

- **Line:** 937
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await service.get_communities()
```

#### 🟡 ISS-0347: MISSING_TRY_EXCEPT

- **Line:** 952
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await service.search_nodes(q, types)
```

#### 🟡 ISS-0348: MISSING_TRY_EXCEPT

- **Line:** 964
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await service.sync_graph()
```

#### 🟡 ISS-0349: MISSING_TRY_EXCEPT

- **Line:** 1005
- **Code File:** `backend/api/connectome/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
node = await service.get_node_by_id(nid)
```

### BC6_api_discovery_complete.txt

- Size: 36,765 chars
- Lines: 883
- Issues: 44

#### 🟡 ISS-0350: MISSING_TRY_EXCEPT

- **Line:** 189
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self._pool = await asyncpg.create_pool(self.db_url)
```

#### 🟡 ISS-0351: MISSING_TRY_EXCEPT

- **Line:** 198
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0352: MISSING_TRY_EXCEPT

- **Line:** 215
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0353: MISSING_TRY_EXCEPT

- **Line:** 225
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0354: MISSING_TRY_EXCEPT

- **Line:** 246
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0355: MISSING_TRY_EXCEPT

- **Line:** 267
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0356: MISSING_TRY_EXCEPT

- **Line:** 280
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
hypothesis = await self.get_hypothesis_by_id(hypothesis_id)
```

#### 🟡 ISS-0357: MISSING_TRY_EXCEPT

- **Line:** 284
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0358: MISSING_TRY_EXCEPT

- **Line:** 294
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
overlap_count = await conn.fetchval(overlap_query, f"%{keywords[0]}%", f"%{keywords[1]}%")
```

#### 🟡 ISS-0359: MISSING_TRY_EXCEPT

- **Line:** 318
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0360: MISSING_TRY_EXCEPT

- **Line:** 336
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0361: MISSING_TRY_EXCEPT

- **Line:** 339
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("DELETE FROM discovery_evidence WHERE hypothesis_id = $1", hypothesis_id)
```

#### 🟡 ISS-0362: MISSING_TRY_EXCEPT

- **Line:** 340
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await conn.execute("DELETE FROM discovery_hypotheses WHERE id = $1", hypothesis_id)
```

#### 🟡 ISS-0363: MISSING_TRY_EXCEPT

- **Line:** 345
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0364: MISSING_TRY_EXCEPT

- **Line:** 361
- **Code File:** `backend/api/discovery/service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self._get_pool()
```

#### 🟡 ISS-0365: MISSING_TRY_EXCEPT

- **Line:** 433
- **Code File:** `backend/api/discovery/hypothesis_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.db_url)
```

#### 🟡 ISS-0366: MISSING_TRY_EXCEPT

- **Line:** 439
- **Code File:** `backend/api/discovery/hypothesis_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
h_linguistic = await self._analyze_linguistic_patterns(conn, request)
```

#### 🟡 ISS-0367: MISSING_TRY_EXCEPT

- **Line:** 444
- **Code File:** `backend/api/discovery/hypothesis_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
h_translator = await self._analyze_translator_fidelity(conn, request)
```

#### 🟡 ISS-0368: MISSING_TRY_EXCEPT

- **Line:** 448
- **Code File:** `backend/api/discovery/hypothesis_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
h_semantic = await self._detect_semantic_anomalies(conn, request)
```

#### 🟡 ISS-0369: MISSING_TRY_EXCEPT

- **Line:** 456
- **Code File:** `backend/api/discovery/hypothesis_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0370: MISSING_TRY_EXCEPT

- **Line:** 501
- **Code File:** `backend/api/discovery/hypothesis_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, request.translator)
```

#### 🟡 ISS-0371: MISSING_TRY_EXCEPT

- **Line:** 520
- **Code File:** `backend/api/discovery/hypothesis_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
embeddings = await conn.fetch("SELECT word, vector FROM word_embeddings LIMIT 100")
```

#### 🟡 ISS-0372: MISSING_TRY_EXCEPT

- **Line:** 539
- **Code File:** `backend/api/discovery/hypothesis_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.db_url)
```

#### 🟡 ISS-0373: MISSING_TRY_EXCEPT

- **Line:** 560
- **Code File:** `backend/api/discovery/hypothesis_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0374: MISSING_TRY_EXCEPT

- **Line:** 605
- **Code File:** `backend/api/discovery/hypothesis_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.db_url)
```

#### 🟡 ISS-0375: MISSING_TRY_EXCEPT

- **Line:** 615
- **Code File:** `backend/api/discovery/hypothesis_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0376: MISSING_TRY_EXCEPT

- **Line:** 654
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await service.close()
```

#### 🟡 ISS-0377: MISSING_TRY_EXCEPT

- **Line:** 670
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await service.get_all_hypotheses(limit, offset)
```

#### 🟡 ISS-0378: MISSING_TRY_EXCEPT

- **Line:** 689
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
new_hypotheses = await generator.generate(request)
```

#### 🟡 ISS-0379: MISSING_TRY_EXCEPT

- **Line:** 692
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await service.create_hypothesis(h)
```

#### 🟡 ISS-0380: MISSING_TRY_EXCEPT

- **Line:** 709
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
evidence = await service.get_evidence_for_hypothesis(hypothesis_id)
```

#### 🟡 ISS-0381: MISSING_TRY_EXCEPT

- **Line:** 726
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
hypothesis = await service.get_hypothesis_by_id(hypothesis_id)
```

#### 🟡 ISS-0382: MISSING_TRY_EXCEPT

- **Line:** 730
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await generator.validate_with_evidence(hypothesis)
```

#### 🟡 ISS-0383: MISSING_TRY_EXCEPT

- **Line:** 734
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await service.update_hypothesis_status(hypothesis_id, HypothesisStatus.VALIDATED)
```

#### 🟡 ISS-0384: MISSING_TRY_EXCEPT

- **Line:** 748
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await service.calculate_novelty(hypothesis_id)
```

#### 🟡 ISS-0385: MISSING_TRY_EXCEPT

- **Line:** 762
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
hypothesis = await service.get_hypothesis_by_id(hypothesis_id)
```

#### 🟡 ISS-0386: MISSING_TRY_EXCEPT

- **Line:** 766
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
evidence = await service.get_evidence_for_hypothesis(hypothesis_id)
```

#### 🟡 ISS-0387: MISSING_TRY_EXCEPT

- **Line:** 767
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
paper = await generator.generate_research_paper(hypothesis, evidence)
```

#### 🟡 ISS-0388: MISSING_TRY_EXCEPT

- **Line:** 779
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await service.find_related_research(hypothesis_id)
```

#### 🟡 ISS-0389: MISSING_TRY_EXCEPT

- **Line:** 788
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await service.get_system_stats()
```

#### 🟡 ISS-0390: MISSING_TRY_EXCEPT

- **Line:** 798
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
success = await service.delete_hypothesis(hypothesis_id)
```

#### 🟡 ISS-0391: MISSING_TRY_EXCEPT

- **Line:** 812
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
success = await service.update_hypothesis_status(hypothesis_id, new_status)
```

#### 🟡 ISS-0392: MISSING_TRY_EXCEPT

- **Line:** 816
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
updated = await service.get_hypothesis_by_id(hypothesis_id)
```

#### 🟡 ISS-0393: MISSING_TRY_EXCEPT

- **Line:** 834
- **Code File:** `backend/api/discovery/router.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
all_h = await service.get_all_hypotheses(limit=100)
```

### BC7_database_layer_complete.txt

- Size: 35,686 chars
- Lines: 930
- Issues: 40

#### 🟠 ISS-0394: PLACEHOLDER_PASS

- **Line:** 22
- **Code File:** `backend/database/connection.py`
- **Description:** Empty pass statement - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass
```

#### 🟠 ISS-0395: PLACEHOLDER_PASS

- **Line:** 26
- **Code File:** `backend/database/connection.py`
- **Description:** Empty pass statement - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass
```

#### 🟡 ISS-0396: MISSING_TRY_EXCEPT

- **Line:** 109
- **Code File:** `backend/database/connection.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize()
```

#### 🟡 ISS-0397: MISSING_TRY_EXCEPT

- **Line:** 137
- **Code File:** `backend/database/connection.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await conn.execute(query, *args, timeout=timeout)
```

#### 🟡 ISS-0398: MISSING_TRY_EXCEPT

- **Line:** 155
- **Code File:** `backend/database/connection.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await conn.fetch(query, *args, timeout=timeout)
```

#### 🟡 ISS-0399: MISSING_TRY_EXCEPT

- **Line:** 169
- **Code File:** `backend/database/connection.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await conn.fetchrow(query, *args, timeout=timeout)
```

#### 🟡 ISS-0400: MISSING_TRY_EXCEPT

- **Line:** 181
- **Code File:** `backend/database/connection.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await conn.fetchval(query, *args, column=column, timeout=timeout)
```

#### 🟡 ISS-0401: MISSING_TRY_EXCEPT

- **Line:** 197
- **Code File:** `backend/database/connection.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
val = await self.fetchval("SELECT 1")
```

#### 🟡 ISS-0402: MISSING_TRY_EXCEPT

- **Line:** 287
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
record = await db_manager.fetchrow(query, text_id)
```

#### 🟡 ISS-0403: MISSING_TRY_EXCEPT

- **Line:** 304
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db_manager.fetch(query, search_term, f"%{search_term}%", limit, offset)
```

#### 🟡 ISS-0404: MISSING_TRY_EXCEPT

- **Line:** 310
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db_manager.fetch(query, author_name, limit)
```

#### 🟡 ISS-0405: MISSING_TRY_EXCEPT

- **Line:** 323
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db_manager.fetch(query, translator_name, limit)
```

#### 🟡 ISS-0406: MISSING_TRY_EXCEPT

- **Line:** 329
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db_manager.fetch(query, title, author)
```

#### 🟡 ISS-0407: MISSING_TRY_EXCEPT

- **Line:** 339
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db_manager.fetch(query, title, author, translator)
```

#### 🟡 ISS-0408: MISSING_TRY_EXCEPT

- **Line:** 350
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
record = await db_manager.fetchrow(query, name)
```

#### 🟡 ISS-0409: MISSING_TRY_EXCEPT

- **Line:** 356
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db_manager.fetch(query, nationality)
```

#### 🟡 ISS-0410: MISSING_TRY_EXCEPT

- **Line:** 362
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db_manager.fetch(query, genre)
```

#### 🟡 ISS-0411: MISSING_TRY_EXCEPT

- **Line:** 374
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
record = await db_manager.fetchrow(query)
```

#### 🟡 ISS-0412: MISSING_TRY_EXCEPT

- **Line:** 385
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
record = await db_manager.fetchrow(query, name)
```

#### 🟡 ISS-0413: MISSING_TRY_EXCEPT

- **Line:** 391
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db_manager.fetch(query)
```

#### 🟡 ISS-0414: MISSING_TRY_EXCEPT

- **Line:** 397
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
val = await db_manager.fetchval(query, name)
```

#### 🟡 ISS-0415: MISSING_TRY_EXCEPT

- **Line:** 419
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
target_vector = await self.get_word_vector(word)
```

#### 🟡 ISS-0416: MISSING_TRY_EXCEPT

- **Line:** 447
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db_manager.fetch(query, work_id, start_line, end_line)
```

#### 🟡 ISS-0417: MISSING_TRY_EXCEPT

- **Line:** 453
- **Code File:** `backend/database/queries.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
record = await db_manager.fetchrow(query, work_id, line_number)
```

#### 🟠 ISS-0418: PLACEHOLDER_PASS

- **Line:** 475
- **Code File:** `backend/database/transactions.py`
- **Description:** Empty pass statement - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass
```

#### 🟡 ISS-0419: MISSING_TRY_EXCEPT

- **Line:** 575
- **Code File:** `backend/database/transactions.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await tx.execute(query, update['content'], update['id'])
```

#### 🟡 ISS-0420: MISSING_TRY_EXCEPT

- **Line:** 667
- **Code File:** `backend/database/migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
version = await db_manager.fetchval(query)
```

#### 🟡 ISS-0421: MISSING_TRY_EXCEPT

- **Line:** 680
- **Code File:** `backend/database/migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await db_manager.execute(self._migration_list[0].up_script)
```

#### 🟡 ISS-0422: MISSING_TRY_EXCEPT

- **Line:** 686
- **Code File:** `backend/database/migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
current_version = await self.get_current_version()
```

#### 🟡 ISS-0423: MISSING_TRY_EXCEPT

- **Line:** 693
- **Code File:** `backend/database/migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await db_manager.execute(migration.up_script)
```

#### 🟡 ISS-0424: MISSING_TRY_EXCEPT

- **Line:** 709
- **Code File:** `backend/database/migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
current_version = await self.get_current_version()
```

#### 🟡 ISS-0425: MISSING_TRY_EXCEPT

- **Line:** 718
- **Code File:** `backend/database/migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await db_manager.execute(migration.down_script)
```

#### 🟡 ISS-0426: MISSING_TRY_EXCEPT

- **Line:** 733
- **Code File:** `backend/database/migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
#     await db_manager.initialize()
```

#### 🟡 ISS-0427: MISSING_TRY_EXCEPT

- **Line:** 734
- **Code File:** `backend/database/migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
#     await migration_manager.run_migrations()
```

#### 🟡 ISS-0428: MISSING_TRY_EXCEPT

- **Line:** 807
- **Code File:** `backend/database/utils.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("VACUUM ANALYZE")
```

#### 🟡 ISS-0429: MISSING_TRY_EXCEPT

- **Line:** 821
- **Code File:** `backend/database/utils.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db_manager.fetch(query)
```

#### 🟡 ISS-0430: MISSING_TRY_EXCEPT

- **Line:** 832
- **Code File:** `backend/database/utils.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db_manager.fetch(query)
```

#### 🟡 ISS-0431: MISSING_TRY_EXCEPT

- **Line:** 861
- **Code File:** `backend/database/search_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
similar = await embedding_queries.find_similar_words(word, limit=3)
```

#### 🟡 ISS-0432: MISSING_TRY_EXCEPT

- **Line:** 870
- **Code File:** `backend/database/search_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
hits = await text_queries.search_texts(term, limit=limit // 2)
```

#### 🟡 ISS-0433: MISSING_TRY_EXCEPT

- **Line:** 923
- **Code File:** `backend/database/search_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db_manager.fetch(sql, *params)
```

### BC8_services_layer_complete.txt

- Size: 36,572 chars
- Lines: 969
- Issues: 43

#### 🟡 ISS-0434: MISSING_TRY_EXCEPT

- **Line:** 85
- **Code File:** `backend/services/base.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await asyncio.sleep(delay)
```

#### 🟡 ISS-0435: MISSING_TRY_EXCEPT

- **Line:** 149
- **Code File:** `backend/services/base.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self.get_pool()
```

#### 🟡 ISS-0436: MISSING_TRY_EXCEPT

- **Line:** 153
- **Code File:** `backend/services/base.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await connection.fetchrow(query, *args)
```

#### 🟡 ISS-0437: MISSING_TRY_EXCEPT

- **Line:** 173
- **Code File:** `backend/services/base.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self.get_pool()
```

#### 🟡 ISS-0438: MISSING_TRY_EXCEPT

- **Line:** 177
- **Code File:** `backend/services/base.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await connection.fetch(query, *args)
```

#### 🟡 ISS-0439: MISSING_TRY_EXCEPT

- **Line:** 196
- **Code File:** `backend/services/base.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self.get_pool()
```

#### 🟡 ISS-0440: MISSING_TRY_EXCEPT

- **Line:** 201
- **Code File:** `backend/services/base.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await connection.execute(query, *args)
```

#### 🟡 ISS-0441: MISSING_TRY_EXCEPT

- **Line:** 240
- **Code File:** `backend/services/base.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
# await self.execute_fetch_one("INSERT INTO audit_logs ...", ...)
```

#### 🟡 ISS-0442: MISSING_TRY_EXCEPT

- **Line:** 248
- **Code File:** `backend/services/base.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await self.get_pool()
```

#### 🟡 ISS-0443: MISSING_TRY_EXCEPT

- **Line:** 250
- **Code File:** `backend/services/base.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await conn.fetchval("SELECT 1")
```

#### 🟡 ISS-0444: MISSING_TRY_EXCEPT

- **Line:** 352
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
client = await self._get_client()
```

#### 🟡 ISS-0445: MISSING_TRY_EXCEPT

- **Line:** 353
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
data = await client.get(key)
```

#### 🟡 ISS-0446: MISSING_TRY_EXCEPT

- **Line:** 376
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
client = await self._get_client()
```

#### 🟡 ISS-0447: MISSING_TRY_EXCEPT

- **Line:** 379
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await client.set(key, serialized_value, ex=expire_time)
```

#### 🟡 ISS-0448: MISSING_TRY_EXCEPT

- **Line:** 391
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
client = await self._get_client()
```

#### 🟡 ISS-0449: MISSING_TRY_EXCEPT

- **Line:** 392
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await client.delete(key)
```

#### 🟡 ISS-0450: MISSING_TRY_EXCEPT

- **Line:** 411
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
client = await self._get_client()
```

#### 🟡 ISS-0451: MISSING_TRY_EXCEPT

- **Line:** 414
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await client.delete(key)
```

#### 🟡 ISS-0452: MISSING_TRY_EXCEPT

- **Line:** 427
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
cached_val = await self.get(key)
```

#### 🟡 ISS-0453: MISSING_TRY_EXCEPT

- **Line:** 434
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.set(key, new_val, ttl)
```

#### 🟡 ISS-0454: MISSING_TRY_EXCEPT

- **Line:** 442
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
client = await self._get_client()
```

#### 🟡 ISS-0455: MISSING_TRY_EXCEPT

- **Line:** 443
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await client.incr(key)
```

#### 🟡 ISS-0456: MISSING_TRY_EXCEPT

- **Line:** 453
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
client = await self._get_client()
```

#### 🟡 ISS-0457: MISSING_TRY_EXCEPT

- **Line:** 454
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
values = await client.mget(keys)
```

#### 🟡 ISS-0458: MISSING_TRY_EXCEPT

- **Line:** 469
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
client = await self._get_client()
```

#### 🟡 ISS-0459: MISSING_TRY_EXCEPT

- **Line:** 474
- **Code File:** `backend/services/cache.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await pipe.execute()
```

#### 🟠 ISS-0460: PLACEHOLDER_PASS

- **Line:** 551
- **Code File:** `backend/services/events.py`
- **Description:** Empty pass statement - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass
```

#### 🟡 ISS-0461: MISSING_TRY_EXCEPT

- **Line:** 610
- **Code File:** `backend/services/events.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await asyncio.gather(*tasks, return_exceptions=True)
```

#### 🟡 ISS-0462: MISSING_TRY_EXCEPT

- **Line:** 638
- **Code File:** `backend/services/events.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.publish(LogosEventType.SYSTEM_MAINTENANCE, payload, originator="admin")
```

#### 🟠 ISS-0463: PLACEHOLDER_PASS

- **Line:** 674
- **Code File:** `backend/services/factory.py`
- **Description:** Empty pass statement - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass
```

#### 🟡 ISS-0464: MISSING_TRY_EXCEPT

- **Line:** 698
- **Code File:** `backend/services/factory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await event_publisher.start()
```

#### 🟡 ISS-0465: MISSING_TRY_EXCEPT

- **Line:** 704
- **Code File:** `backend/services/factory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await BaseService.get_pool()
```

#### 🟡 ISS-0466: MISSING_TRY_EXCEPT

- **Line:** 787
- **Code File:** `backend/services/factory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await self.execute_fetch_one(query, text_id)
```

#### 🟡 ISS-0467: MISSING_TRY_EXCEPT

- **Line:** 805
- **Code File:** `backend/services/factory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await self.execute_fetch_all(query, work_id, start_line, end_line)
```

#### 🟡 ISS-0468: MISSING_TRY_EXCEPT

- **Line:** 822
- **Code File:** `backend/services/factory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await self.execute_fetch_all(query, search_pattern, limit, offset)
```

#### 🟡 ISS-0469: MISSING_TRY_EXCEPT

- **Line:** 829
- **Code File:** `backend/services/factory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
profile = await self.execute_fetch_one(query, author_id)
```

#### 🟡 ISS-0470: MISSING_TRY_EXCEPT

- **Line:** 840
- **Code File:** `backend/services/factory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await self.execute_fetch_all(query)
```

#### 🟡 ISS-0471: MISSING_TRY_EXCEPT

- **Line:** 873
- **Code File:** `backend/services/factory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.log_audit_trail("CREATE_TEXT", user_id, "texts", new_id)
```

#### 🟡 ISS-0472: MISSING_TRY_EXCEPT

- **Line:** 896
- **Code File:** `backend/services/factory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await self.execute_fetch_all(query, nationality)
```

#### 🟡 ISS-0473: MISSING_TRY_EXCEPT

- **Line:** 899
- **Code File:** `backend/services/factory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await self.execute_fetch_all(query)
```

#### 🟡 ISS-0474: MISSING_TRY_EXCEPT

- **Line:** 908
- **Code File:** `backend/services/factory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.log_audit_trail("UPDATE_AUTHOR", user_id, "author_profiles", author_id)
```

#### 🟡 ISS-0475: MISSING_TRY_EXCEPT

- **Line:** 929
- **Code File:** `backend/services/factory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
stats = await self.execute_fetch_one(query, author_id)
```

#### 🟡 ISS-0476: MISSING_TRY_EXCEPT

- **Line:** 956
- **Code File:** `backend/services/factory.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await self.execute_fetch_one(query, word)
```

### FC2_semantia_component.txt

- Size: 44,916 chars
- Lines: 1,267
- Issues: 25

#### 🟡 ISS-0477: MISSING_TRY_EXCEPT

- **Line:** 77
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0478: MISSING_TRY_EXCEPT

- **Line:** 82
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, word)
```

#### 🟡 ISS-0479: MISSING_TRY_EXCEPT

- **Line:** 97
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0480: MISSING_TRY_EXCEPT

- **Line:** 99
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
target_vector = await self.get_word_vector(word)
```

#### 🟡 ISS-0481: MISSING_TRY_EXCEPT

- **Line:** 124
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, target_vector, word, limit)
```

#### 🟡 ISS-0482: MISSING_TRY_EXCEPT

- **Line:** 140
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0483: MISSING_TRY_EXCEPT

- **Line:** 156
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, f"% {word} %")
```

#### 🟡 ISS-0484: MISSING_TRY_EXCEPT

- **Line:** 165
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0485: MISSING_TRY_EXCEPT

- **Line:** 180
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, f"% {word} %", self.AUTHORIZED_TRANSLATORS)
```

#### 🟡 ISS-0486: MISSING_TRY_EXCEPT

- **Line:** 192
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0487: MISSING_TRY_EXCEPT

- **Line:** 208
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, f"% {word} %")
```

#### 🟡 ISS-0488: MISSING_TRY_EXCEPT

- **Line:** 228
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0489: MISSING_TRY_EXCEPT

- **Line:** 244
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0490: MISSING_TRY_EXCEPT

- **Line:** 253
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0491: MISSING_TRY_EXCEPT

- **Line:** 258
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, words)
```

#### 🟡 ISS-0492: MISSING_TRY_EXCEPT

- **Line:** 267
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0493: MISSING_TRY_EXCEPT

- **Line:** 278
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, author_id)
```

#### 🟡 ISS-0494: MISSING_TRY_EXCEPT

- **Line:** 297
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0495: MISSING_TRY_EXCEPT

- **Line:** 306
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, translator_name)
```

#### 🟡 ISS-0496: MISSING_TRY_EXCEPT

- **Line:** 317
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0497: MISSING_TRY_EXCEPT

- **Line:** 332
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, query_vector, threshold)
```

#### 🟡 ISS-0498: MISSING_TRY_EXCEPT

- **Line:** 341
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0499: MISSING_TRY_EXCEPT

- **Line:** 355
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, f"% {word} %")
```

#### 🟡 ISS-0500: MISSING_TRY_EXCEPT

- **Line:** 364
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0501: MISSING_TRY_EXCEPT

- **Line:** 368
- **Code File:** `backend/services/semantic_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("SELECT 1")
```

### FC3_chronos_component.txt

- Size: 45,928 chars
- Lines: 1,080
- Issues: 12

#### 🟡 ISS-0502: MISSING_TRY_EXCEPT

- **Line:** 73
- **Code File:** `backend/services/chronos_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0503: MISSING_TRY_EXCEPT

- **Line:** 83
- **Code File:** `backend/services/chronos_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await connection.fetch(query)
```

#### 🟡 ISS-0504: MISSING_TRY_EXCEPT

- **Line:** 106
- **Code File:** `backend/services/chronos_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0505: MISSING_TRY_EXCEPT

- **Line:** 124
- **Code File:** `backend/services/chronos_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await connection.fetch(query, word)
```

#### 🟡 ISS-0506: MISSING_TRY_EXCEPT

- **Line:** 150
- **Code File:** `backend/services/chronos_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0507: MISSING_TRY_EXCEPT

- **Line:** 168
- **Code File:** `backend/services/chronos_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await connection.fetch(base_query, *params)
```

#### 🟡 ISS-0508: MISSING_TRY_EXCEPT

- **Line:** 189
- **Code File:** `backend/services/chronos_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0509: MISSING_TRY_EXCEPT

- **Line:** 210
- **Code File:** `backend/services/chronos_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
authors_count = await connection.fetchval(count_query, start, end)
```

#### 🟡 ISS-0510: MISSING_TRY_EXCEPT

- **Line:** 211
- **Code File:** `backend/services/chronos_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
works_count = await connection.fetchval(work_query, start, end)
```

#### 🟡 ISS-0511: MISSING_TRY_EXCEPT

- **Line:** 232
- **Code File:** `backend/services/chronos_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await service.connect()
```

#### 🟡 ISS-0512: MISSING_TRY_EXCEPT

- **Line:** 233
- **Code File:** `backend/services/chronos_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
authors = await service.get_author_lifespans()
```

#### 🟡 ISS-0513: MISSING_TRY_EXCEPT

- **Line:** 235
- **Code File:** `backend/services/chronos_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await service.disconnect()
```

### FC4_connectome_component.txt

- Size: 49,153 chars
- Lines: 1,322
- Issues: 4

#### 🟡 ISS-0514: MISSING_TRY_EXCEPT

- **Line:** 1152
- **Code File:** `backend/graph_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize()
```

#### 🟡 ISS-0515: MISSING_TRY_EXCEPT

- **Line:** 1175
- **Code File:** `backend/graph_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT id, title as name, author, translator FROM texts LIMIT 100")
```

#### 🟡 ISS-0516: MISSING_TRY_EXCEPT

- **Line:** 1242
- **Code File:** `backend/graph_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize()
```

#### 🟡 ISS-0517: MISSING_TRY_EXCEPT

- **Line:** 1292
- **Code File:** `backend/graph_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize()
```

### FC5_translation_component.txt

- Size: 40,768 chars
- Lines: 1,093
- Issues: 9

#### 🟡 ISS-0518: MISSING_TRY_EXCEPT

- **Line:** 79
- **Code File:** `backend/services/translation_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0519: MISSING_TRY_EXCEPT

- **Line:** 88
- **Code File:** `backend/services/translation_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, text_id)
```

#### 🟡 ISS-0520: MISSING_TRY_EXCEPT

- **Line:** 121
- **Code File:** `backend/services/translation_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
vector_data = await conn.fetchval(style_query, translator_name)
```

#### 🟡 ISS-0521: MISSING_TRY_EXCEPT

- **Line:** 188
- **Code File:** `backend/services/translation_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, author_name, ALLOWED_TRANSLATORS)
```

#### 🟡 ISS-0522: MISSING_TRY_EXCEPT

- **Line:** 214
- **Code File:** `backend/services/translation_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
data = await self.get_translation_by_id(tid)
```

#### 🟡 ISS-0523: MISSING_TRY_EXCEPT

- **Line:** 216
- **Code File:** `backend/services/translation_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
score = await self.calculate_ltqi(data['text_content'], data['translator'])
```

#### 🟡 ISS-0524: MISSING_TRY_EXCEPT

- **Line:** 232
- **Code File:** `backend/services/translation_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
align = await self.get_word_alignment(results[i]['content'], results[i+1]['content'])
```

#### 🟡 ISS-0525: MISSING_TRY_EXCEPT

- **Line:** 258
- **Code File:** `backend/services/translation_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
profile = await conn.fetchrow(query, name)
```

#### 🟡 ISS-0526: MISSING_TRY_EXCEPT

- **Line:** 291
- **Code File:** `backend/services/translation_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
lines = await conn.fetch(query, work_id, line_start, line_end)
```

### FC7_atlas_component.txt

- Size: 37,838 chars
- Lines: 915
- Issues: 6

#### 🟡 ISS-0527: MISSING_TRY_EXCEPT

- **Line:** 70
- **Code File:** `backend/services/atlas_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0528: MISSING_TRY_EXCEPT

- **Line:** 92
- **Code File:** `backend/services/atlas_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0529: MISSING_TRY_EXCEPT

- **Line:** 118
- **Code File:** `backend/services/atlas_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0530: MISSING_TRY_EXCEPT

- **Line:** 134
- **Code File:** `backend/services/atlas_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0531: MISSING_TRY_EXCEPT

- **Line:** 218
- **Code File:** `backend/services/atlas_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0532: MISSING_TRY_EXCEPT

- **Line:** 229
- **Code File:** `backend/services/atlas_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(sql, f"%{query}%")
```

### W1_backend_main.txt

- Size: 30,268 chars
- Lines: 758
- Issues: 5

#### 🟡 ISS-0533: MISSING_TRY_EXCEPT

- **Line:** 546
- **Code File:** `backend/main.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0534: MISSING_TRY_EXCEPT

- **Line:** 564
- **Code File:** `backend/main.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await db_manager.connect()
```

#### 🟡 ISS-0535: MISSING_TRY_EXCEPT

- **Line:** 573
- **Code File:** `backend/main.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await db_manager.disconnect()
```

#### 🟡 ISS-0536: MISSING_TRY_EXCEPT

- **Line:** 617
- **Code File:** `backend/main.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await db.execute("SELECT 1")
```

#### 🟡 ISS-0537: MISSING_TRY_EXCEPT

- **Line:** 709
- **Code File:** `backend/main.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
sample = await db_conn.fetchrow("SELECT word, vector FROM word_embeddings LIMIT 1")
```

### W2_router_registry.txt

- Size: 30,068 chars
- Lines: 766
- Issues: 7

#### 🟡 ISS-0538: MISSING_TRY_EXCEPT

- **Line:** 172
- **Code File:** `backend/api/__init__.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("SELECT 1")
```

#### 🟡 ISS-0539: MISSING_TRY_EXCEPT

- **Line:** 268
- **Code File:** `backend/api/deps.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await DatabaseManager.get_pool()
```

#### 🟡 ISS-0540: MISSING_TRY_EXCEPT

- **Line:** 287
- **Code File:** `backend/api/deps.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await redis.close()
```

#### 🟡 ISS-0541: MISSING_TRY_EXCEPT

- **Line:** 488
- **Code File:** `backend/api/auth.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
existing = await conn.fetchval("SELECT id FROM users WHERE username = $1", scholar_data['username'])
```

#### 🟡 ISS-0542: MISSING_TRY_EXCEPT

- **Line:** 513
- **Code File:** `backend/api/auth.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pool = await DatabaseManager.get_pool()
```

#### 🟡 ISS-0543: MISSING_TRY_EXCEPT

- **Line:** 565
- **Code File:** `backend/api/rate_limit.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await pipe.execute()
```

#### 🟠 ISS-0544: PLACEHOLDER_PASS

- **Line:** 701
- **Code File:** `backend/api/validators.py`
- **Description:** Pass with comment - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass # Simplified for this example, but in production, BCE logic is complex
```

### W5_component_exports.txt

- Size: 40,549 chars
- Lines: 1,310
- Issues: 14

#### 🟡 ISS-0545: MISSING_TRY_EXCEPT

- **Line:** 99
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0546: MISSING_TRY_EXCEPT

- **Line:** 103
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow("SELECT * FROM texts WHERE id = $1", text_id)
```

#### 🟡 ISS-0547: MISSING_TRY_EXCEPT

- **Line:** 121
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0548: MISSING_TRY_EXCEPT

- **Line:** 137
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0549: MISSING_TRY_EXCEPT

- **Line:** 157
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0550: MISSING_TRY_EXCEPT

- **Line:** 173
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0551: MISSING_TRY_EXCEPT

- **Line:** 192
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0552: MISSING_TRY_EXCEPT

- **Line:** 215
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0553: MISSING_TRY_EXCEPT

- **Line:** 236
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0554: MISSING_TRY_EXCEPT

- **Line:** 242
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await conn.fetchval("SELECT 1")
```

#### 🟡 ISS-0555: MISSING_TRY_EXCEPT

- **Line:** 252
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0556: MISSING_TRY_EXCEPT

- **Line:** 268
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0557: MISSING_TRY_EXCEPT

- **Line:** 284
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0558: MISSING_TRY_EXCEPT

- **Line:** 305
- **Code File:** `backend/database_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

### W6_shared_components.txt

- Size: 37,860 chars
- Lines: 1,088
- Issues: 1

#### 🟠 ISS-0559: PLACEHOLDER_ELLIPSIS

- **Line:** 477
- **Code File:** `unknown`
- **Description:** Ellipsis in comment - code abbreviated
- **Suggested Fix:** Expand abbreviated code to full implementation

```
// ... (Mapping internal constants to these real names)
```

### PS1_backend_config.txt

- Size: 36,302 chars
- Lines: 1,104
- Issues: 31

#### 🟡 ISS-0560: MISSING_TRY_EXCEPT

- **Line:** 550
- **Code File:** `backend/app/db/connection.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0561: MISSING_TRY_EXCEPT

- **Line:** 555
- **Code File:** `backend/app/db/connection.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await connection.fetchrow(query, *args)
```

#### 🟡 ISS-0562: MISSING_TRY_EXCEPT

- **Line:** 565
- **Code File:** `backend/app/db/connection.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0563: MISSING_TRY_EXCEPT

- **Line:** 570
- **Code File:** `backend/app/db/connection.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await connection.fetch(query, *args)
```

#### 🟡 ISS-0564: MISSING_TRY_EXCEPT

- **Line:** 580
- **Code File:** `backend/app/db/connection.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0565: MISSING_TRY_EXCEPT

- **Line:** 585
- **Code File:** `backend/app/db/connection.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await connection.execute(query, *args)
```

#### 🟡 ISS-0566: MISSING_TRY_EXCEPT

- **Line:** 596
- **Code File:** `backend/app/db/connection.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await self.fetch_one("SELECT 1")
```

#### 🟡 ISS-0567: MISSING_TRY_EXCEPT

- **Line:** 633
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
record = await db.fetch_one(query, text_id)
```

#### 🟡 ISS-0568: MISSING_TRY_EXCEPT

- **Line:** 661
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db.fetch_all(query, f"%{author_name}%", limit)
```

#### 🟡 ISS-0569: MISSING_TRY_EXCEPT

- **Line:** 688
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db.fetch_all(query, work_id, start_line, end_line)
```

#### 🟡 ISS-0570: MISSING_TRY_EXCEPT

- **Line:** 701
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
record = await db.fetch_one(query, name)
```

#### 🟡 ISS-0571: MISSING_TRY_EXCEPT

- **Line:** 720
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
record = await db.fetch_one(query, name)
```

#### 🟡 ISS-0572: MISSING_TRY_EXCEPT

- **Line:** 735
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
record = await db.fetch_one(query, word)
```

#### 🟡 ISS-0573: MISSING_TRY_EXCEPT

- **Line:** 755
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db.fetch_all(query, translator_name)
```

#### 🟡 ISS-0574: MISSING_TRY_EXCEPT

- **Line:** 768
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
author_records = await db.fetch_all(author_query, genre)
```

#### 🟡 ISS-0575: MISSING_TRY_EXCEPT

- **Line:** 776
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
text_records = await db.fetch_all(text_query, author_names)
```

#### 🟡 ISS-0576: MISSING_TRY_EXCEPT

- **Line:** 795
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db.fetch_all(query, title, book, chapter)
```

#### 🟡 ISS-0577: MISSING_TRY_EXCEPT

- **Line:** 813
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db.fetch_all(query, words)
```

#### 🟡 ISS-0578: MISSING_TRY_EXCEPT

- **Line:** 831
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db.fetch_all(query)
```

#### 🟡 ISS-0579: MISSING_TRY_EXCEPT

- **Line:** 849
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db.fetch_all(query)
```

#### 🟡 ISS-0580: MISSING_TRY_EXCEPT

- **Line:** 865
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db.fetch_all(query, limit)
```

#### 🟡 ISS-0581: MISSING_TRY_EXCEPT

- **Line:** 882
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
record = await db.fetch_one(query, work_id)
```

#### 🟡 ISS-0582: MISSING_TRY_EXCEPT

- **Line:** 903
- **Code File:** `backend/app/db/repository.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
records = await db.fetch_all(query, f"%{search_term}%", limit)
```

#### 🟡 ISS-0583: MISSING_TRY_EXCEPT

- **Line:** 1000
- **Code File:** `backend/app/main.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await db.connect()
```

#### 🟡 ISS-0584: MISSING_TRY_EXCEPT

- **Line:** 1013
- **Code File:** `backend/app/main.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await db.disconnect()
```

#### 🟡 ISS-0585: MISSING_TRY_EXCEPT

- **Line:** 1034
- **Code File:** `backend/app/main.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
db_healthy = await db.check_health()
```

#### 🟡 ISS-0586: MISSING_TRY_EXCEPT

- **Line:** 1055
- **Code File:** `backend/app/main.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
text = await repo.get_text_by_id(text_id)
```

#### 🟡 ISS-0587: MISSING_TRY_EXCEPT

- **Line:** 1066
- **Code File:** `backend/app/main.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await repo.search_texts_by_author(author)
```

#### 🟡 ISS-0588: MISSING_TRY_EXCEPT

- **Line:** 1068
- **Code File:** `backend/app/main.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await repo.search_full_text(query)
```

#### 🟡 ISS-0589: MISSING_TRY_EXCEPT

- **Line:** 1077
- **Code File:** `backend/app/main.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
profile = await repo.get_author_profile(name)
```

#### 🟡 ISS-0590: MISSING_TRY_EXCEPT

- **Line:** 1081
- **Code File:** `backend/app/main.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
works = await repo.search_texts_by_author(name)
```

### PS2_frontend_config.txt

- Size: 35,871 chars
- Lines: 1,082
- Issues: 30

#### 🟡 ISS-0591: MISSING_TRY_EXCEPT

- **Line:** 450
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0592: MISSING_TRY_EXCEPT

- **Line:** 455
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, text_id)
```

#### 🟡 ISS-0593: MISSING_TRY_EXCEPT

- **Line:** 472
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0594: MISSING_TRY_EXCEPT

- **Line:** 482
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, f"%{author_name}%")
```

#### 🟡 ISS-0595: MISSING_TRY_EXCEPT

- **Line:** 491
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0596: MISSING_TRY_EXCEPT

- **Line:** 501
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, work_id, start_line, end_line)
```

#### 🟡 ISS-0597: MISSING_TRY_EXCEPT

- **Line:** 509
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0598: MISSING_TRY_EXCEPT

- **Line:** 514
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, author_id)
```

#### 🟡 ISS-0599: MISSING_TRY_EXCEPT

- **Line:** 524
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0600: MISSING_TRY_EXCEPT

- **Line:** 529
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, word)
```

#### 🟡 ISS-0601: MISSING_TRY_EXCEPT

- **Line:** 540
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0602: MISSING_TRY_EXCEPT

- **Line:** 542
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
target_vec = await self.get_word_embedding(target_word)
```

#### 🟡 ISS-0603: MISSING_TRY_EXCEPT

- **Line:** 550
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT word, vector FROM word_embeddings")
```

#### 🟡 ISS-0604: MISSING_TRY_EXCEPT

- **Line:** 570
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0605: MISSING_TRY_EXCEPT

- **Line:** 576
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
trans_data = await conn.fetchrow(trans_query, text_id, chapter)
```

#### 🟡 ISS-0606: MISSING_TRY_EXCEPT

- **Line:** 588
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
source_lines = await conn.fetch(source_query, text_id)
```

#### 🟡 ISS-0607: MISSING_TRY_EXCEPT

- **Line:** 601
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0608: MISSING_TRY_EXCEPT

- **Line:** 610
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, translator_name)
```

#### 🟡 ISS-0609: MISSING_TRY_EXCEPT

- **Line:** 620
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0610: MISSING_TRY_EXCEPT

- **Line:** 630
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, genre)
```

#### 🟡 ISS-0611: MISSING_TRY_EXCEPT

- **Line:** 638
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0612: MISSING_TRY_EXCEPT

- **Line:** 658
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0613: MISSING_TRY_EXCEPT

- **Line:** 681
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0614: MISSING_TRY_EXCEPT

- **Line:** 686
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query)
```

#### 🟡 ISS-0615: MISSING_TRY_EXCEPT

- **Line:** 701
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0616: MISSING_TRY_EXCEPT

- **Line:** 713
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, keyword)
```

#### 🟡 ISS-0617: MISSING_TRY_EXCEPT

- **Line:** 721
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0618: MISSING_TRY_EXCEPT

- **Line:** 736
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
status = await conn.execute(query, author_id, *values)
```

#### 🟡 ISS-0619: MISSING_TRY_EXCEPT

- **Line:** 745
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self._initialized: await self.initialize()
```

#### 🟡 ISS-0620: MISSING_TRY_EXCEPT

- **Line:** 755
- **Code File:** `backend/database_service.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

### PS3_database_migrations.txt

- Size: 35,580 chars
- Lines: 925
- Issues: 21

#### 🟡 ISS-0621: MISSING_TRY_EXCEPT

- **Line:** 654
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.conn = await asyncpg.connect(self.db_url)
```

#### 🟡 ISS-0622: MISSING_TRY_EXCEPT

- **Line:** 660
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await asyncio.sleep(2 ** retry_count)
```

#### 🟡 ISS-0623: MISSING_TRY_EXCEPT

- **Line:** 717
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
applied = await self.get_applied_migrations()
```

#### 🟡 ISS-0624: MISSING_TRY_EXCEPT

- **Line:** 772
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0625: MISSING_TRY_EXCEPT

- **Line:** 773
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.ensure_migration_table()
```

#### 🟡 ISS-0626: MISSING_TRY_EXCEPT

- **Line:** 775
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
pending = await self.get_pending_migrations()
```

#### 🟡 ISS-0627: MISSING_TRY_EXCEPT

- **Line:** 785
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.disconnect()
```

#### 🟡 ISS-0628: MISSING_TRY_EXCEPT

- **Line:** 789
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
success = await self.execute_migration(migration_file)
```

#### 🟡 ISS-0629: MISSING_TRY_EXCEPT

- **Line:** 797
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.disconnect()
```

#### 🟡 ISS-0630: MISSING_TRY_EXCEPT

- **Line:** 806
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0631: MISSING_TRY_EXCEPT

- **Line:** 820
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.disconnect()
```

#### 🟡 ISS-0632: MISSING_TRY_EXCEPT

- **Line:** 829
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0633: MISSING_TRY_EXCEPT

- **Line:** 836
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.disconnect()
```

#### 🟡 ISS-0634: MISSING_TRY_EXCEPT

- **Line:** 841
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.disconnect()
```

#### 🟡 ISS-0635: MISSING_TRY_EXCEPT

- **Line:** 853
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0636: MISSING_TRY_EXCEPT

- **Line:** 864
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.disconnect()
```

#### 🟡 ISS-0637: MISSING_TRY_EXCEPT

- **Line:** 870
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0638: MISSING_TRY_EXCEPT

- **Line:** 872
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.disconnect()
```

#### 🟡 ISS-0639: MISSING_TRY_EXCEPT

- **Line:** 905
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await manager.run_all()
```

#### 🟡 ISS-0640: MISSING_TRY_EXCEPT

- **Line:** 910
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await manager.verify_database_state()
```

#### 🟡 ISS-0641: MISSING_TRY_EXCEPT

- **Line:** 913
- **Code File:** `backend/migrations/run_migrations.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
stats = await manager.get_database_statistics()
```

### PS4_deployment_config.txt

- Size: 31,575 chars
- Lines: 951
- Issues: 16

#### 🟢 ISS-0642: WRONG_DB_STRING

- **Line:** 136
- **Code File:** `.github/workflows/ci.yml`
- **Description:** Localhost database - should use Railway connection
- **Suggested Fix:** Replace with Railway database URL

```
DATABASE_URL: postgresql://postgres:JKLqDvdTtmRjGnOgDvGFLqLKVkcjQLFs@localhost:5432/railway
```

#### 🟢 ISS-0643: WRONG_DB_STRING

- **Line:** 142
- **Code File:** `.github/workflows/ci.yml`
- **Description:** Localhost database - should use Railway connection
- **Suggested Fix:** Replace with Railway database URL

```
DATABASE_URL: postgresql://postgres:JKLqDvdTtmRjGnOgDvGFLqLKVkcjQLFs@localhost:5432/railway
```

#### 🟡 ISS-0644: MISSING_TRY_EXCEPT

- **Line:** 546
- **Code File:** `scripts/production_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await asyncio.sleep(2 ** retry_count)
```

#### 🟡 ISS-0645: MISSING_TRY_EXCEPT

- **Line:** 608
- **Code File:** `scripts/production_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
text_translators = await conn.fetch("SELECT DISTINCT translator FROM texts")
```

#### 🟡 ISS-0646: MISSING_TRY_EXCEPT

- **Line:** 610
- **Code File:** `scripts/production_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
profile_translators = await conn.fetch("SELECT name FROM translator_profiles")
```

#### 🟡 ISS-0647: MISSING_TRY_EXCEPT

- **Line:** 635
- **Code File:** `scripts/production_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
sample = await conn.fetchrow("SELECT vector FROM word_embeddings LIMIT 1")
```

#### 🟡 ISS-0648: MISSING_TRY_EXCEPT

- **Line:** 689
- **Code File:** `scripts/production_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0649: MISSING_TRY_EXCEPT

- **Line:** 695
- **Code File:** `scripts/production_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.check_data_integrity()
```

#### 🟡 ISS-0650: MISSING_TRY_EXCEPT

- **Line:** 698
- **Code File:** `scripts/production_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.disconnect()
```

#### 🟡 ISS-0651: MISSING_TRY_EXCEPT

- **Line:** 713
- **Code File:** `scripts/production_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0652: MISSING_TRY_EXCEPT

- **Line:** 722
- **Code File:** `scripts/production_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
"integrity": await self.check_data_integrity()
```

#### 🟡 ISS-0653: MISSING_TRY_EXCEPT

- **Line:** 730
- **Code File:** `scripts/production_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.disconnect()
```

#### 🟡 ISS-0654: MISSING_TRY_EXCEPT

- **Line:** 770
- **Code File:** `scripts/production_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
top_works = await conn.fetch("SELECT id, title FROM texts LIMIT 100")
```

#### 🟡 ISS-0655: MISSING_TRY_EXCEPT

- **Line:** 810
- **Code File:** `scripts/production_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.fetch(query)
```

#### 🟡 ISS-0656: MISSING_TRY_EXCEPT

- **Line:** 916
- **Code File:** `backend/infrastructure/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
db_status = await self.check_database(db)
```

#### 🟡 ISS-0657: MISSING_TRY_EXCEPT

- **Line:** 943
- **Code File:** `backend/infrastructure/health.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
status = await monitor.get_full_status(db)
```

### PS5_documentation.txt

- Size: 38,179 chars
- Lines: 1,107
- Issues: 12

#### 🟡 ISS-0658: MISSING_TRY_EXCEPT

- **Line:** 269
- **Code File:** `docs/SETUP.md`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(db_url)
```

#### 🟡 ISS-0659: MISSING_TRY_EXCEPT

- **Line:** 272
- **Code File:** `docs/SETUP.md`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0660: MISSING_TRY_EXCEPT

- **Line:** 447
- **Code File:** `docs/API.md`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(DATABASE_URL)
```

#### 🟠 ISS-0661: PLACEHOLDER_ELLIPSIS

- **Line:** 474
- **Code File:** `docs/API.md`
- **Description:** Ellipsis in comment - code abbreviated
- **Suggested Fix:** Expand abbreviated code to full implementation

```
allowed = ["Jowett", "Dryden", "Dakyns", "Pope", "Murray", "Butler"] # ... etc
```

#### 🟡 ISS-0662: MISSING_TRY_EXCEPT

- **Line:** 483
- **Code File:** `docs/API.md`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, *params)
```

#### 🟡 ISS-0663: MISSING_TRY_EXCEPT

- **Line:** 490
- **Code File:** `docs/API.md`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0664: MISSING_TRY_EXCEPT

- **Line:** 855
- **Code File:** `server/app.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.pool = await asyncpg.create_pool(self.dsn, min_size=5, max_size=20)
```

#### 🟡 ISS-0665: MISSING_TRY_EXCEPT

- **Line:** 901
- **Code File:** `server/app.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, *args)
```

#### 🟡 ISS-0666: MISSING_TRY_EXCEPT

- **Line:** 912
- **Code File:** `server/app.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await db.connect()
```

#### 🟡 ISS-0667: MISSING_TRY_EXCEPT

- **Line:** 916
- **Code File:** `server/app.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await db.disconnect()
```

#### 🟡 ISS-0668: MISSING_TRY_EXCEPT

- **Line:** 937
- **Code File:** `server/app.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await db.fetch_texts(author, translator, limit)
```

#### 🟡 ISS-0669: MISSING_TRY_EXCEPT

- **Line:** 952
- **Code File:** `server/app.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT id, name, birth_year, death_year, nationality, genres FROM author_profiles ORDER BY name ASC")
```

### V1P1_api_contract.txt

- Size: 36,442 chars
- Lines: 902
- Issues: 7

#### 🟡 ISS-0670: MISSING_TRY_EXCEPT

- **Line:** 102
- **Code File:** `verification/pass1/contract_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.db_pool = await asyncpg.create_pool(DATABASE_URL)
```

#### 🟡 ISS-0671: MISSING_TRY_EXCEPT

- **Line:** 255
- **Code File:** `verification/pass1/contract_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize_database()
```

#### 🟡 ISS-0672: MISSING_TRY_EXCEPT

- **Line:** 284
- **Code File:** `verification/pass1/contract_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self._validate_database_alignment(results)
```

#### 🟡 ISS-0673: MISSING_TRY_EXCEPT

- **Line:** 286
- **Code File:** `verification/pass1/contract_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.close_database()
```

#### 🟡 ISS-0674: MISSING_TRY_EXCEPT

- **Line:** 329
- **Code File:** `verification/pass1/contract_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
columns = await conn.fetch("SELECT column_name FROM information_schema.columns WHERE table_name = 'texts'")
```

#### 🟡 ISS-0675: MISSING_TRY_EXCEPT

- **Line:** 342
- **Code File:** `verification/pass1/contract_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
columns = await conn.fetch("SELECT column_name FROM information_schema.columns WHERE table_name = 'translator_profiles'")
```

#### 🟡 ISS-0676: MISSING_TRY_EXCEPT

- **Line:** 883
- **Code File:** `verification/pass1/contract_reporter.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await validator.validate_all()
```

### V1P1_dependency_check.txt

- Size: 31,616 chars
- Lines: 816
- Issues: 18

#### 🟡 ISS-0677: MISSING_TRY_EXCEPT

- **Line:** 78
- **Code File:** `verification/pass1/python_deps_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.db_connection = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0678: MISSING_TRY_EXCEPT

- **Line:** 193
- **Code File:** `verification/pass1/python_deps_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
db_init = await self.initialize_database()
```

#### 🟡 ISS-0679: MISSING_TRY_EXCEPT

- **Line:** 196
- **Code File:** `verification/pass1/python_deps_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
db_violations = await self.verify_translator_table_integrity()
```

#### 🟡 ISS-0680: MISSING_TRY_EXCEPT

- **Line:** 219
- **Code File:** `verification/pass1/python_deps_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.close_database()
```

#### 🟡 ISS-0681: MISSING_TRY_EXCEPT

- **Line:** 555
- **Code File:** `verification/pass1/npm_deps_validator.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.check_postgres_version()
```

#### 🟡 ISS-0682: MISSING_TRY_EXCEPT

- **Line:** 604
- **Code File:** `verification/pass1/npm_deps_validator.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0683: MISSING_TRY_EXCEPT

- **Line:** 618
- **Code File:** `verification/pass1/npm_deps_validator.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0684: MISSING_TRY_EXCEPT

- **Line:** 680
- **Code File:** `verification/pass1/security_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.audit_database_permissions()
```

#### 🟡 ISS-0685: MISSING_TRY_EXCEPT

- **Line:** 681
- **Code File:** `verification/pass1/security_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.verify_data_integrity()
```

#### 🟡 ISS-0686: MISSING_TRY_EXCEPT

- **Line:** 738
- **Code File:** `verification/pass1/security_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0687: MISSING_TRY_EXCEPT

- **Line:** 740
- **Code File:** `verification/pass1/security_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
is_superuser = await conn.fetchval("SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER")
```

#### 🟡 ISS-0688: MISSING_TRY_EXCEPT

- **Line:** 748
- **Code File:** `verification/pass1/security_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0689: MISSING_TRY_EXCEPT

- **Line:** 756
- **Code File:** `verification/pass1/security_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0690: MISSING_TRY_EXCEPT

- **Line:** 758
- **Code File:** `verification/pass1/security_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT name FROM translator_profiles")
```

#### 🟡 ISS-0691: MISSING_TRY_EXCEPT

- **Line:** 770
- **Code File:** `verification/pass1/security_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0692: MISSING_TRY_EXCEPT

- **Line:** 796
- **Code File:** `verification/pass1/security_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
py_report = await py_val.run_full_validation()
```

#### 🟡 ISS-0693: MISSING_TRY_EXCEPT

- **Line:** 800
- **Code File:** `verification/pass1/security_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await ver_checker.check_all()
```

#### 🟡 ISS-0694: MISSING_TRY_EXCEPT

- **Line:** 804
- **Code File:** `verification/pass1/security_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await sec_scanner.run_security_audit()
```

### V1P1_python_syntax.txt

- Size: 28,012 chars
- Lines: 714
- Issues: 23

#### 🟡 ISS-0695: MISSING_TRY_EXCEPT

- **Line:** 79
- **Code File:** `backend/verification/pass1/syntax_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.pool = await asyncpg.create_pool(self.DATABASE_URL)
```

#### 🟡 ISS-0696: MISSING_TRY_EXCEPT

- **Line:** 131
- **Code File:** `backend/verification/pass1/syntax_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
db_check_status = await self._verify_translators_in_db(visitor.detected_translators)
```

#### 🟡 ISS-0697: MISSING_TRY_EXCEPT

- **Line:** 163
- **Code File:** `backend/verification/pass1/syntax_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize_db_connection()
```

#### 🟡 ISS-0698: MISSING_TRY_EXCEPT

- **Line:** 168
- **Code File:** `backend/verification/pass1/syntax_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT name FROM translator_profiles")
```

#### 🟡 ISS-0699: MISSING_TRY_EXCEPT

- **Line:** 198
- **Code File:** `backend/verification/pass1/syntax_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await asyncio.gather(*tasks)
```

#### 🟡 ISS-0700: MISSING_TRY_EXCEPT

- **Line:** 201
- **Code File:** `backend/verification/pass1/syntax_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self._log_results_to_db(results)
```

#### 🟡 ISS-0701: MISSING_TRY_EXCEPT

- **Line:** 224
- **Code File:** `backend/verification/pass1/syntax_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
# await conn.execute("INSERT INTO validation_logs ...")
```

#### 🟠 ISS-0702: PLACEHOLDER_PASS

- **Line:** 314
- **Code File:** `backend/verification/pass1/syntax_validator.py`
- **Description:** Pass with comment - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass # Placeholder logic handled by standard ast.parse limitations
```

#### 🟡 ISS-0703: MISSING_TRY_EXCEPT

- **Line:** 360
- **Code File:** `backend/verification/pass1/import_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self._analyze_file_imports(full_path)
```

#### 🟡 ISS-0704: MISSING_TRY_EXCEPT

- **Line:** 362
- **Code File:** `backend/verification/pass1/import_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self._verify_against_production_db()
```

#### 🟠 ISS-0705: PLACEHOLDER_PASS

- **Line:** 421
- **Code File:** `backend/verification/pass1/import_checker.py`
- **Description:** Pass with comment - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass # Module resolution errors are handled gracefully
```

#### 🟡 ISS-0706: MISSING_TRY_EXCEPT

- **Line:** 428
- **Code File:** `backend/verification/pass1/import_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0707: MISSING_TRY_EXCEPT

- **Line:** 431
- **Code File:** `backend/verification/pass1/import_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
db_texts = await conn.fetch("SELECT DISTINCT title FROM texts")
```

#### 🟡 ISS-0708: MISSING_TRY_EXCEPT

- **Line:** 437
- **Code File:** `backend/verification/pass1/import_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0709: MISSING_TRY_EXCEPT

- **Line:** 602
- **Code File:** `backend/verification/pass1/fix_suggester.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await self._suggest_translator_replacement(violation)
```

#### 🟡 ISS-0710: MISSING_TRY_EXCEPT

- **Line:** 628
- **Code File:** `backend/verification/pass1/fix_suggester.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0711: MISSING_TRY_EXCEPT

- **Line:** 633
- **Code File:** `backend/verification/pass1/fix_suggester.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0712: MISSING_TRY_EXCEPT

- **Line:** 662
- **Code File:** `backend/verification/pass1/fix_suggester.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
fix = await self.suggest_fix(v)
```

#### 🟡 ISS-0713: MISSING_TRY_EXCEPT

- **Line:** 675
- **Code File:** `backend/verification/pass1/fix_suggester.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await validator.initialize_db_connection()
```

#### 🟡 ISS-0714: MISSING_TRY_EXCEPT

- **Line:** 676
- **Code File:** `backend/verification/pass1/fix_suggester.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
syntax_results = await validator.run_full_validation()
```

#### 🟡 ISS-0715: MISSING_TRY_EXCEPT

- **Line:** 680
- **Code File:** `backend/verification/pass1/fix_suggester.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
import_violations = await import_checker.run_check()
```

#### 🟡 ISS-0716: MISSING_TRY_EXCEPT

- **Line:** 694
- **Code File:** `backend/verification/pass1/fix_suggester.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
fixes = await suggester.process_report(all_violations)
```

#### 🟡 ISS-0717: MISSING_TRY_EXCEPT

- **Line:** 699
- **Code File:** `backend/verification/pass1/fix_suggester.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await validator.close_db_connection()
```

### V2P2_completeness.txt

- Size: 35,540 chars
- Lines: 916
- Issues: 29

#### 🟡 ISS-0718: MISSING_TRY_EXCEPT

- **Line:** 73
- **Code File:** `verification/pass2/placeholder_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.db_connection = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0719: MISSING_TRY_EXCEPT

- **Line:** 201
- **Code File:** `verification/pass2/placeholder_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.log_results_to_db()
```

#### 🟡 ISS-0720: MISSING_TRY_EXCEPT

- **Line:** 209
- **Code File:** `verification/pass2/placeholder_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect_db()
```

#### 🟡 ISS-0721: MISSING_TRY_EXCEPT

- **Line:** 261
- **Code File:** `verification/pass2/placeholder_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect_db()
```

#### 🟡 ISS-0722: MISSING_TRY_EXCEPT

- **Line:** 289
- **Code File:** `verification/pass2/placeholder_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect_db()
```

#### 🟡 ISS-0723: MISSING_TRY_EXCEPT

- **Line:** 335
- **Code File:** `verification/pass2/placeholder_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await scanner.connect_db()
```

#### 🟡 ISS-0724: MISSING_TRY_EXCEPT

- **Line:** 336
- **Code File:** `verification/pass2/placeholder_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
violations_count = await scanner.run_full_scan()
```

#### 🟡 ISS-0725: MISSING_TRY_EXCEPT

- **Line:** 338
- **Code File:** `verification/pass2/placeholder_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
db_valid = await scanner.validate_translators_in_db()
```

#### 🟡 ISS-0726: MISSING_TRY_EXCEPT

- **Line:** 339
- **Code File:** `verification/pass2/placeholder_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
integrity_metrics = await scanner.check_source_text_integrity()
```

#### 🟡 ISS-0727: MISSING_TRY_EXCEPT

- **Line:** 354
- **Code File:** `verification/pass2/placeholder_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await scanner.close_db()
```

#### 🟡 ISS-0728: MISSING_TRY_EXCEPT

- **Line:** 399
- **Code File:** `verification/pass2/implementation_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.db_conn = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0729: MISSING_TRY_EXCEPT

- **Line:** 475
- **Code File:** `verification/pass2/implementation_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0730: MISSING_TRY_EXCEPT

- **Line:** 530
- **Code File:** `verification/pass2/implementation_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
db_status = await self.verify_database_schema_completeness()
```

#### 🟡 ISS-0731: MISSING_TRY_EXCEPT

- **Line:** 543
- **Code File:** `verification/pass2/implementation_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0732: MISSING_TRY_EXCEPT

- **Line:** 561
- **Code File:** `verification/pass2/implementation_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
results = await checker.run_audit()
```

#### 🟡 ISS-0733: MISSING_TRY_EXCEPT

- **Line:** 562
- **Code File:** `verification/pass2/implementation_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await checker.log_audit_to_db(results)
```

#### 🟡 ISS-0734: MISSING_TRY_EXCEPT

- **Line:** 564
- **Code File:** `verification/pass2/implementation_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await checker.disconnect()
```

#### 🟡 ISS-0735: MISSING_TRY_EXCEPT

- **Line:** 625
- **Code File:** `verification/pass2/feature_checklist.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.db_conn = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0736: MISSING_TRY_EXCEPT

- **Line:** 640
- **Code File:** `verification/pass2/feature_checklist.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0737: MISSING_TRY_EXCEPT

- **Line:** 669
- **Code File:** `verification/pass2/feature_checklist.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0738: MISSING_TRY_EXCEPT

- **Line:** 695
- **Code File:** `verification/pass2/feature_checklist.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0739: MISSING_TRY_EXCEPT

- **Line:** 725
- **Code File:** `verification/pass2/feature_checklist.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0740: MISSING_TRY_EXCEPT

- **Line:** 748
- **Code File:** `verification/pass2/feature_checklist.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.verify_author_profiles()
```

#### 🟡 ISS-0741: MISSING_TRY_EXCEPT

- **Line:** 762
- **Code File:** `verification/pass2/feature_checklist.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
success = await checklist.run_full_checklist()
```

#### 🟡 ISS-0742: MISSING_TRY_EXCEPT

- **Line:** 766
- **Code File:** `verification/pass2/feature_checklist.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await checklist.disconnect()
```

#### 🟡 ISS-0743: MISSING_TRY_EXCEPT

- **Line:** 814
- **Code File:** `verification/pass2/coverage_reporter.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.db_conn = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0744: MISSING_TRY_EXCEPT

- **Line:** 828
- **Code File:** `verification/pass2/coverage_reporter.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0745: MISSING_TRY_EXCEPT

- **Line:** 871
- **Code File:** `verification/pass2/coverage_reporter.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.fetch_database_metrics()
```

#### 🟡 ISS-0746: MISSING_TRY_EXCEPT

- **Line:** 913
- **Code File:** `verification/pass2/coverage_reporter.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await reporter.disconnect()
```

### V2P2_db_queries.txt

- Size: 45,330 chars
- Lines: 1,222
- Issues: 50

#### 🟠 ISS-0747: PLACEHOLDER_PASS

- **Line:** 164
- **Code File:** `backend/verification/pass2/query_validator.py`
- **Description:** Pass with comment - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass # logic continues below
```

#### 🟡 ISS-0748: MISSING_TRY_EXCEPT

- **Line:** 220
- **Code File:** `backend/verification/pass2/query_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize_pool()
```

#### 🟡 ISS-0749: MISSING_TRY_EXCEPT

- **Line:** 225
- **Code File:** `backend/verification/pass2/query_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute(explain_query)
```

#### 🟡 ISS-0750: MISSING_TRY_EXCEPT

- **Line:** 323
- **Code File:** `backend/verification/pass2/query_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize_pool()
```

#### 🟡 ISS-0751: MISSING_TRY_EXCEPT

- **Line:** 326
- **Code File:** `backend/verification/pass2/query_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow("SELECT id FROM texts WHERE id = $1", work_id)
```

#### 🟡 ISS-0752: MISSING_TRY_EXCEPT

- **Line:** 349
- **Code File:** `backend/verification/pass2/query_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize_pool()
```

#### 🟡 ISS-0753: MISSING_TRY_EXCEPT

- **Line:** 352
- **Code File:** `backend/verification/pass2/query_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow("SELECT word FROM word_embeddings WHERE word = $1", word)
```

#### 🟡 ISS-0754: MISSING_TRY_EXCEPT

- **Line:** 373
- **Code File:** `backend/verification/pass2/query_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize_pool()
```

#### 🟡 ISS-0755: MISSING_TRY_EXCEPT

- **Line:** 436
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.pool = await asyncpg.create_pool(dsn=self.db_url)
```

#### 🟡 ISS-0756: MISSING_TRY_EXCEPT

- **Line:** 460
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0757: MISSING_TRY_EXCEPT

- **Line:** 462
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0758: MISSING_TRY_EXCEPT

- **Line:** 481
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0759: MISSING_TRY_EXCEPT

- **Line:** 483
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, table_name)
```

#### 🟡 ISS-0760: MISSING_TRY_EXCEPT

- **Line:** 496
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
actual_columns = await self.get_table_columns(table_name)
```

#### 🟡 ISS-0761: MISSING_TRY_EXCEPT

- **Line:** 528
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
report = await self.verify_table_integrity(table)
```

#### 🟡 ISS-0762: MISSING_TRY_EXCEPT

- **Line:** 553
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0763: MISSING_TRY_EXCEPT

- **Line:** 555
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, table_name)
```

#### 🟡 ISS-0764: MISSING_TRY_EXCEPT

- **Line:** 575
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0765: MISSING_TRY_EXCEPT

- **Line:** 577
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0766: MISSING_TRY_EXCEPT

- **Line:** 592
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0767: MISSING_TRY_EXCEPT

- **Line:** 624
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0768: MISSING_TRY_EXCEPT

- **Line:** 626
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0769: MISSING_TRY_EXCEPT

- **Line:** 645
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0770: MISSING_TRY_EXCEPT

- **Line:** 648
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
count = await conn.fetchval(query, table_name, pattern)
```

#### 🟡 ISS-0771: MISSING_TRY_EXCEPT

- **Line:** 659
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0772: MISSING_TRY_EXCEPT

- **Line:** 677
- **Code File:** `backend/verification/pass2/schema_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
"fk_status": await self.verify_foreign_keys()
```

#### 🟡 ISS-0773: MISSING_TRY_EXCEPT

- **Line:** 970
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.pool = await asyncpg.create_pool(dsn=self.db_url)
```

#### 🟡 ISS-0774: MISSING_TRY_EXCEPT

- **Line:** 986
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0775: MISSING_TRY_EXCEPT

- **Line:** 989
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await conn.fetchval(explain_query)
```

#### 🟡 ISS-0776: MISSING_TRY_EXCEPT

- **Line:** 1002
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
plan_data = await self.get_explain_plan(sql)
```

#### 🟡 ISS-0777: MISSING_TRY_EXCEPT

- **Line:** 1023
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
plan_data = await self.get_explain_plan(sql)
```

#### 🟡 ISS-0778: MISSING_TRY_EXCEPT

- **Line:** 1047
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0779: MISSING_TRY_EXCEPT

- **Line:** 1052
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0780: MISSING_TRY_EXCEPT

- **Line:** 1087
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
cost_report = await self.analyze_query_cost(sql)
```

#### 🟡 ISS-0781: MISSING_TRY_EXCEPT

- **Line:** 1090
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
is_indexed = await self.check_index_existence("word_embeddings", "word")
```

#### 🟡 ISS-0782: MISSING_TRY_EXCEPT

- **Line:** 1105
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0783: MISSING_TRY_EXCEPT

- **Line:** 1124
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0784: MISSING_TRY_EXCEPT

- **Line:** 1126
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0785: MISSING_TRY_EXCEPT

- **Line:** 1138
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
cost_info = await self.analyze_query_cost(sql)
```

#### 🟡 ISS-0786: MISSING_TRY_EXCEPT

- **Line:** 1139
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
has_seq_scan = await self.check_for_seq_scans(sql)
```

#### 🟡 ISS-0787: MISSING_TRY_EXCEPT

- **Line:** 1140
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
exec_time = await self.measure_actual_execution_time(sql)
```

#### 🟡 ISS-0788: MISSING_TRY_EXCEPT

- **Line:** 1148
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
"recommendations": await self.suggest_indexes(sql)
```

#### 🟡 ISS-0789: MISSING_TRY_EXCEPT

- **Line:** 1163
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0790: MISSING_TRY_EXCEPT

- **Line:** 1165
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("SELECT 1")
```

#### 🟡 ISS-0791: MISSING_TRY_EXCEPT

- **Line:** 1181
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0792: MISSING_TRY_EXCEPT

- **Line:** 1183
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, table_name)
```

#### 🟡 ISS-0793: MISSING_TRY_EXCEPT

- **Line:** 1196
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0794: MISSING_TRY_EXCEPT

- **Line:** 1198
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute(f"ANALYZE {table_name}")
```

#### 🟡 ISS-0795: MISSING_TRY_EXCEPT

- **Line:** 1215
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
if not self.pool: await self.connect()
```

#### 🟡 ISS-0796: MISSING_TRY_EXCEPT

- **Line:** 1217
- **Code File:** `backend/verification/pass2/performance_analyzer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
ratio = await conn.fetchval(query)
```

### V2P2_error_handling.txt

- Size: 34,134 chars
- Lines: 924
- Issues: 27

#### 🟡 ISS-0797: MISSING_TRY_EXCEPT

- **Line:** 65
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.db_url)
```

#### 🟡 ISS-0798: MISSING_TRY_EXCEPT

- **Line:** 83
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self.connect_to_database()
```

#### 🟡 ISS-0799: MISSING_TRY_EXCEPT

- **Line:** 89
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0800: MISSING_TRY_EXCEPT

- **Line:** 100
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
count = await conn.fetchval(count_query)
```

#### 🟡 ISS-0801: MISSING_TRY_EXCEPT

- **Line:** 112
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0802: MISSING_TRY_EXCEPT

- **Line:** 180
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self.connect_to_database()
```

#### 🟡 ISS-0803: MISSING_TRY_EXCEPT

- **Line:** 184
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0804: MISSING_TRY_EXCEPT

- **Line:** 204
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0805: MISSING_TRY_EXCEPT

- **Line:** 241
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self.connect_to_database()
```

#### 🟡 ISS-0806: MISSING_TRY_EXCEPT

- **Line:** 256
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0807: MISSING_TRY_EXCEPT

- **Line:** 288
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self.connect_to_database()
```

#### 🟡 ISS-0808: MISSING_TRY_EXCEPT

- **Line:** 292
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0809: MISSING_TRY_EXCEPT

- **Line:** 311
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0810: MISSING_TRY_EXCEPT

- **Line:** 348
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
db_integrity = await self.validate_database_integrity()
```

#### 🟡 ISS-0811: MISSING_TRY_EXCEPT

- **Line:** 349
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
table_counts = await self.audit_all_tables()
```

#### 🟡 ISS-0812: MISSING_TRY_EXCEPT

- **Line:** 350
- **Code File:** `verification/pass2/error_handler_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
embeddings_ok = await self.check_word_embeddings_health()
```

#### 🟡 ISS-0813: MISSING_TRY_EXCEPT

- **Line:** 426
- **Code File:** `verification/pass2/api_error_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.db_url)
```

#### 🟡 ISS-0814: MISSING_TRY_EXCEPT

- **Line:** 429
- **Code File:** `verification/pass2/api_error_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, text_id)
```

#### 🟡 ISS-0815: MISSING_TRY_EXCEPT

- **Line:** 460
- **Code File:** `verification/pass2/api_error_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0816: MISSING_TRY_EXCEPT

- **Line:** 482
- **Code File:** `verification/pass2/api_error_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.db_url)
```

#### 🟡 ISS-0817: MISSING_TRY_EXCEPT

- **Line:** 484
- **Code File:** `verification/pass2/api_error_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, f"%{author_name}%")
```

#### 🟡 ISS-0818: MISSING_TRY_EXCEPT

- **Line:** 502
- **Code File:** `verification/pass2/api_error_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0819: MISSING_TRY_EXCEPT

- **Line:** 553
- **Code File:** `verification/pass2/api_error_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
"author_lookup": await self.validate_author_lookup("Homer")
```

#### 🟡 ISS-0820: MISSING_TRY_EXCEPT

- **Line:** 897
- **Code File:** `verification/pass2/frontend_error_checker.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
counts = await validator.audit_all_tables()
```

#### 🟡 ISS-0821: MISSING_TRY_EXCEPT

- **Line:** 902
- **Code File:** `verification/pass2/frontend_error_checker.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
api_results = await api_checker.audit_api_endpoint_health()
```

#### 🟡 ISS-0822: MISSING_TRY_EXCEPT

- **Line:** 906
- **Code File:** `verification/pass2/frontend_error_checker.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
integrity_pass = await validator.validate_database_integrity()
```

#### 🟡 ISS-0823: MISSING_TRY_EXCEPT

- **Line:** 913
- **Code File:** `verification/pass2/frontend_error_checker.ts`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
translators = await validator.verify_translator_profiles()
```

### V2P2_security.txt

- Size: 36,388 chars
- Lines: 959
- Issues: 30

#### 🟡 ISS-0824: MISSING_TRY_EXCEPT

- **Line:** 71
- **Code File:** `verification/pass2/credential_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.db_url)
```

#### 🟡 ISS-0825: MISSING_TRY_EXCEPT

- **Line:** 177
- **Code File:** `verification/pass2/credential_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
findings = await self.scan_file(file_path)
```

#### 🟡 ISS-0826: MISSING_TRY_EXCEPT

- **Line:** 196
- **Code File:** `verification/pass2/credential_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self.initialize_db_connection()
```

#### 🟡 ISS-0827: MISSING_TRY_EXCEPT

- **Line:** 219
- **Code File:** `verification/pass2/credential_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0828: MISSING_TRY_EXCEPT

- **Line:** 268
- **Code File:** `verification/pass2/credential_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.validate_environment_variables()
```

#### 🟡 ISS-0829: MISSING_TRY_EXCEPT

- **Line:** 271
- **Code File:** `verification/pass2/credential_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
findings = await self.run_directory_scan(target_path)
```

#### 🟡 ISS-0830: MISSING_TRY_EXCEPT

- **Line:** 274
- **Code File:** `verification/pass2/credential_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.log_findings_to_db(findings)
```

#### 🟡 ISS-0831: MISSING_TRY_EXCEPT

- **Line:** 310
- **Code File:** `verification/pass2/credential_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self.initialize_db_connection()
```

#### 🟡 ISS-0832: MISSING_TRY_EXCEPT

- **Line:** 315
- **Code File:** `verification/pass2/credential_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query)
```

#### 🟡 ISS-0833: MISSING_TRY_EXCEPT

- **Line:** 324
- **Code File:** `verification/pass2/credential_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0834: MISSING_TRY_EXCEPT

- **Line:** 389
- **Code File:** `verification/pass2/injection_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.conn = await asyncpg.connect(self.db_url)
```

#### 🟡 ISS-0835: MISSING_TRY_EXCEPT

- **Line:** 510
- **Code File:** `verification/pass2/injection_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize_audit_log()
```

#### 🟡 ISS-0836: MISSING_TRY_EXCEPT

- **Line:** 511
- **Code File:** `verification/pass2/injection_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.scan_directory(path)
```

#### 🟡 ISS-0837: MISSING_TRY_EXCEPT

- **Line:** 512
- **Code File:** `verification/pass2/injection_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.log_results_to_db()
```

#### 🟡 ISS-0838: MISSING_TRY_EXCEPT

- **Line:** 618
- **Code File:** `verification/pass2/xss_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await asyncpg.connect(self.db_url)
```

#### 🟡 ISS-0839: MISSING_TRY_EXCEPT

- **Line:** 673
- **Code File:** `verification/pass2/xss_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.scan_frontend_file(path)
```

#### 🟡 ISS-0840: MISSING_TRY_EXCEPT

- **Line:** 675
- **Code File:** `verification/pass2/xss_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.scan_backend_file(path)
```

#### 🟡 ISS-0841: MISSING_TRY_EXCEPT

- **Line:** 682
- **Code File:** `verification/pass2/xss_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self.connect_db()
```

#### 🟡 ISS-0842: MISSING_TRY_EXCEPT

- **Line:** 692
- **Code File:** `verification/pass2/xss_scanner.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0843: MISSING_TRY_EXCEPT

- **Line:** 786
- **Code File:** `verification/pass2/auth_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await asyncpg.connect(self.db_url)
```

#### 🟡 ISS-0844: MISSING_TRY_EXCEPT

- **Line:** 860
- **Code File:** `verification/pass2/auth_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await self.connect_db()
```

#### 🟡 ISS-0845: MISSING_TRY_EXCEPT

- **Line:** 870
- **Code File:** `verification/pass2/auth_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0846: MISSING_TRY_EXCEPT

- **Line:** 885
- **Code File:** `verification/pass2/auth_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.scan_project(path)
```

#### 🟡 ISS-0847: MISSING_TRY_EXCEPT

- **Line:** 886
- **Code File:** `verification/pass2/auth_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.log_violations_to_db()
```

#### 🟠 ISS-0848: PLACEHOLDER_PASS

- **Line:** 898
- **Code File:** `verification/pass2/auth_validator.py`
- **Description:** Pass with comment - needs real implementation
- **Suggested Fix:** Generate real implementation for this function/method

```
pass # Implementation detail
```

#### 🟡 ISS-0849: MISSING_TRY_EXCEPT

- **Line:** 941
- **Code File:** `verification/pass2/auth_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await cred_scanner.perform_full_audit(".")
```

#### 🟡 ISS-0850: MISSING_TRY_EXCEPT

- **Line:** 945
- **Code File:** `verification/pass2/auth_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await inj_checker.run_full_check(".")
```

#### 🟡 ISS-0851: MISSING_TRY_EXCEPT

- **Line:** 949
- **Code File:** `verification/pass2/auth_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await xss_scanner.run_scan(".")
```

#### 🟡 ISS-0852: MISSING_TRY_EXCEPT

- **Line:** 950
- **Code File:** `verification/pass2/auth_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await xss_scanner.log_to_db()
```

#### 🟡 ISS-0853: MISSING_TRY_EXCEPT

- **Line:** 955
- **Code File:** `verification/pass2/auth_validator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await auth_validator.perform_full_audit(".")
```

### V3P3_api_tests.txt

- Size: 43,127 chars
- Lines: 1,080
- Issues: 41

#### 🟡 ISS-0854: MISSING_TRY_EXCEPT

- **Line:** 70
- **Code File:** `backend/tests/conftest.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await pool.close()
```

#### 🟡 ISS-0855: MISSING_TRY_EXCEPT

- **Line:** 107
- **Code File:** `backend/tests/conftest.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/auth/login", json=test_credentials)
```

#### 🟡 ISS-0856: MISSING_TRY_EXCEPT

- **Line:** 147
- **Code File:** `backend/tests/conftest.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.execute("DELETE FROM texts WHERE title LIKE 'TEST_LOGOS_%'")
```

#### 🟡 ISS-0857: MISSING_TRY_EXCEPT

- **Line:** 184
- **Code File:** `backend/tests/test_corpus_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get("/corpus/texts", params=params)
```

#### 🟡 ISS-0858: MISSING_TRY_EXCEPT

- **Line:** 213
- **Code File:** `backend/tests/test_corpus_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get(f"/corpus/search?q={search_query}")
```

#### 🟡 ISS-0859: MISSING_TRY_EXCEPT

- **Line:** 244
- **Code File:** `backend/tests/test_corpus_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get(f"/corpus/texts/{target_id}")
```

#### 🟡 ISS-0860: MISSING_TRY_EXCEPT

- **Line:** 267
- **Code File:** `backend/tests/test_corpus_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get("/corpus/texts", params={"author": "Plato"})
```

#### 🟡 ISS-0861: MISSING_TRY_EXCEPT

- **Line:** 287
- **Code File:** `backend/tests/test_corpus_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get(f"/corpus/authors/{author_name}")
```

#### 🟡 ISS-0862: MISSING_TRY_EXCEPT

- **Line:** 308
- **Code File:** `backend/tests/test_corpus_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get(f"/corpus/texts/{invalid_id}")
```

#### 🟡 ISS-0863: MISSING_TRY_EXCEPT

- **Line:** 325
- **Code File:** `backend/tests/test_corpus_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.delete("/corpus/texts/1")
```

#### 🟡 ISS-0864: MISSING_TRY_EXCEPT

- **Line:** 341
- **Code File:** `backend/tests/test_corpus_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
sample_texts = await conn.fetch("SELECT id, title FROM texts LIMIT 5")
```

#### 🟡 ISS-0865: MISSING_TRY_EXCEPT

- **Line:** 360
- **Code File:** `backend/tests/test_corpus_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get("/corpus/search?q=")
```

#### 🟡 ISS-0866: MISSING_TRY_EXCEPT

- **Line:** 377
- **Code File:** `backend/tests/test_corpus_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get(f"/corpus/search?q={malicious_query}")
```

#### 🟡 ISS-0867: MISSING_TRY_EXCEPT

- **Line:** 423
- **Code File:** `backend/tests/test_translate_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/translate/compare", json=payload)
```

#### 🟡 ISS-0868: MISSING_TRY_EXCEPT

- **Line:** 454
- **Code File:** `backend/tests/test_translate_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/translate/compare", json=payload)
```

#### 🟡 ISS-0869: MISSING_TRY_EXCEPT

- **Line:** 470
- **Code File:** `backend/tests/test_translate_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get(f"/translate/profiles/{translator}")
```

#### 🟡 ISS-0870: MISSING_TRY_EXCEPT

- **Line:** 493
- **Code File:** `backend/tests/test_translate_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/translate/align", json=payload)
```

#### 🟡 ISS-0871: MISSING_TRY_EXCEPT

- **Line:** 516
- **Code File:** `backend/tests/test_translate_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get("/translate/style-similarity", params=params)
```

#### 🟡 ISS-0872: MISSING_TRY_EXCEPT

- **Line:** 539
- **Code File:** `backend/tests/test_translate_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/translate/compare", json=payload)
```

#### 🟡 ISS-0873: MISSING_TRY_EXCEPT

- **Line:** 560
- **Code File:** `backend/tests/test_translate_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/translate/bulk", json=payload)
```

#### 🟡 ISS-0874: MISSING_TRY_EXCEPT

- **Line:** 601
- **Code File:** `backend/tests/test_semantia_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get(f"/semantia/vector/{word}")
```

#### 🟡 ISS-0875: MISSING_TRY_EXCEPT

- **Line:** 624
- **Code File:** `backend/tests/test_semantia_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get(f"/semantia/similar/{word}?top_n=5")
```

#### 🟡 ISS-0876: MISSING_TRY_EXCEPT

- **Line:** 652
- **Code File:** `backend/tests/test_semantia_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/semantia/analogy", json=payload)
```

#### 🟡 ISS-0877: MISSING_TRY_EXCEPT

- **Line:** 672
- **Code File:** `backend/tests/test_semantia_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get(f"/semantia/drift/{word}")
```

#### 🟡 ISS-0878: MISSING_TRY_EXCEPT

- **Line:** 695
- **Code File:** `backend/tests/test_semantia_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/semantia/vectors/batch", json={"words": words})
```

#### 🟡 ISS-0879: MISSING_TRY_EXCEPT

- **Line:** 736
- **Code File:** `backend/tests/test_chronos_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get(f"/chronos/timeline/author/{author}")
```

#### 🟡 ISS-0880: MISSING_TRY_EXCEPT

- **Line:** 759
- **Code File:** `backend/tests/test_chronos_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get(f"/chronos/eras/{era_id}")
```

#### 🟡 ISS-0881: MISSING_TRY_EXCEPT

- **Line:** 780
- **Code File:** `backend/tests/test_chronos_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get(f"/chronos/events/search?q={event}")
```

#### 🟡 ISS-0882: MISSING_TRY_EXCEPT

- **Line:** 798
- **Code File:** `backend/tests/test_chronos_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get("/chronos/compare", params=params)
```

#### 🟡 ISS-0883: MISSING_TRY_EXCEPT

- **Line:** 838
- **Code File:** `backend/tests/test_connectome_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get("/connectome/links", params=params)
```

#### 🟡 ISS-0884: MISSING_TRY_EXCEPT

- **Line:** 859
- **Code File:** `backend/tests/test_connectome_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get(f"/connectome/influence/{author}")
```

#### 🟡 ISS-0885: MISSING_TRY_EXCEPT

- **Line:** 881
- **Code File:** `backend/tests/test_connectome_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get("/connectome/network/stats")
```

#### 🟡 ISS-0886: MISSING_TRY_EXCEPT

- **Line:** 904
- **Code File:** `backend/tests/test_connectome_api.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/connectome/detect-allusions", json=payload)
```

#### 🟡 ISS-0887: MISSING_TRY_EXCEPT

- **Line:** 946
- **Code File:** `backend/tests/test_auth.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/auth/login", json=credentials)
```

#### 🟡 ISS-0888: MISSING_TRY_EXCEPT

- **Line:** 968
- **Code File:** `backend/tests/test_auth.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/auth/login", json=credentials)
```

#### 🟡 ISS-0889: MISSING_TRY_EXCEPT

- **Line:** 992
- **Code File:** `backend/tests/test_auth.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/auth/register", json=payload)
```

#### 🟡 ISS-0890: MISSING_TRY_EXCEPT

- **Line:** 1011
- **Code File:** `backend/tests/test_auth.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/auth/refresh", headers=headers)
```

#### 🟡 ISS-0891: MISSING_TRY_EXCEPT

- **Line:** 1032
- **Code File:** `backend/tests/test_auth.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.get("/auth/me", headers=headers)
```

#### 🟡 ISS-0892: MISSING_TRY_EXCEPT

- **Line:** 1053
- **Code File:** `backend/tests/test_auth.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
response = await api_client.post("/auth/register", json=payload)
```

#### 🟡 ISS-0893: MISSING_TRY_EXCEPT

- **Line:** 1070
- **Code File:** `backend/tests/test_auth.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
logout_res = await api_client.post("/auth/logout", headers=headers)
```

#### 🟡 ISS-0894: MISSING_TRY_EXCEPT

- **Line:** 1074
- **Code File:** `backend/tests/test_auth.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
retry_res = await api_client.get("/auth/me", headers=headers)
```

### V3P3_component_tests.txt

- Size: 55,688 chars
- Lines: 1,458
- Issues: 8

#### 🟡 ISS-0895: MISSING_TRY_EXCEPT

- **Line:** 1350
- **Code File:** `backend/database/query_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.pool = await asyncpg.create_pool(DATABASE_URL, min_size=5, max_size=20)
```

#### 🟡 ISS-0896: MISSING_TRY_EXCEPT

- **Line:** 1366
- **Code File:** `backend/database/query_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize()
```

#### 🟡 ISS-0897: MISSING_TRY_EXCEPT

- **Line:** 1376
- **Code File:** `backend/database/query_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await connection.fetch(query, title, translator, book)
```

#### 🟡 ISS-0898: MISSING_TRY_EXCEPT

- **Line:** 1390
- **Code File:** `backend/database/query_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize()
```

#### 🟡 ISS-0899: MISSING_TRY_EXCEPT

- **Line:** 1404
- **Code File:** `backend/database/query_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await connection.fetch(query, search_term, limit)
```

#### 🟡 ISS-0900: MISSING_TRY_EXCEPT

- **Line:** 1415
- **Code File:** `backend/database/query_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize()
```

#### 🟡 ISS-0901: MISSING_TRY_EXCEPT

- **Line:** 1435
- **Code File:** `backend/database/query_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize()
```

#### 🟡 ISS-0902: MISSING_TRY_EXCEPT

- **Line:** 1444
- **Code File:** `backend/database/query_engine.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await connection.fetch(query)
```

### V3P3_e2e_tests.txt

- Size: 35,797 chars
- Lines: 954
- Issues: 13

#### 🟡 ISS-0903: MISSING_TRY_EXCEPT

- **Line:** 75
- **Code File:** `backend/database/manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0904: MISSING_TRY_EXCEPT

- **Line:** 80
- **Code File:** `backend/database/manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query, text_id)
```

#### 🟡 ISS-0905: MISSING_TRY_EXCEPT

- **Line:** 97
- **Code File:** `backend/database/manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0906: MISSING_TRY_EXCEPT

- **Line:** 107
- **Code File:** `backend/database/manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, f"%{search_term}%", limit)
```

#### 🟡 ISS-0907: MISSING_TRY_EXCEPT

- **Line:** 135
- **Code File:** `backend/database/manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, translator_name)
```

#### 🟡 ISS-0908: MISSING_TRY_EXCEPT

- **Line:** 149
- **Code File:** `backend/database/manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
target_row = await conn.fetchrow("SELECT vector FROM word_embeddings WHERE word = $1", word)
```

#### 🟡 ISS-0909: MISSING_TRY_EXCEPT

- **Line:** 158
- **Code File:** `backend/database/manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
all_words = await conn.fetch(query)
```

#### 🟡 ISS-0910: MISSING_TRY_EXCEPT

- **Line:** 184
- **Code File:** `backend/database/manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, work_id, start_line, end_line)
```

#### 🟡 ISS-0911: MISSING_TRY_EXCEPT

- **Line:** 194
- **Code File:** `backend/database/manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow("SELECT * FROM author_profiles WHERE name = $1", author_name)
```

#### 🟡 ISS-0912: MISSING_TRY_EXCEPT

- **Line:** 211
- **Code File:** `backend/database/manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, title, book, chapter)
```

#### 🟡 ISS-0913: MISSING_TRY_EXCEPT

- **Line:** 227
- **Code File:** `backend/database/manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch(query, start_year, end_year)
```

#### 🟡 ISS-0914: MISSING_TRY_EXCEPT

- **Line:** 270
- **Code File:** `backend/database/manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await conn.fetchrow(query)
```

#### 🟡 ISS-0915: MISSING_TRY_EXCEPT

- **Line:** 295
- **Code File:** `backend/database/manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
result = await conn.fetchval("SELECT 1")
```

### V3P3_final_report.txt

- Size: 37,196 chars
- Lines: 846
- Issues: 33

#### 🟡 ISS-0916: MISSING_TRY_EXCEPT

- **Line:** 100
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await conn.fetch("SELECT name FROM translator_profiles")
```

#### 🟡 ISS-0917: MISSING_TRY_EXCEPT

- **Line:** 109
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
text_rows = await conn.fetch("SELECT DISTINCT translator FROM texts")
```

#### 🟡 ISS-0918: MISSING_TRY_EXCEPT

- **Line:** 163
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
sample_vectors = await conn.fetch("SELECT word, vector FROM word_embeddings LIMIT 100")
```

#### 🟡 ISS-0919: MISSING_TRY_EXCEPT

- **Line:** 279
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
translator_data = await self.validate_translator_integrity()
```

#### 🟡 ISS-0920: MISSING_TRY_EXCEPT

- **Line:** 280
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
coverage_data = await self.verify_text_coverage()
```

#### 🟡 ISS-0921: MISSING_TRY_EXCEPT

- **Line:** 281
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
vector_data = await self.perform_vector_sanity_check()
```

#### 🟡 ISS-0922: MISSING_TRY_EXCEPT

- **Line:** 282
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
perf_data = await self.analyze_system_performance()
```

#### 🟡 ISS-0923: MISSING_TRY_EXCEPT

- **Line:** 283
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
security_data = await self.run_security_scan()
```

#### 🟡 ISS-0924: MISSING_TRY_EXCEPT

- **Line:** 330
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
inventory = await self.generate_inventory()
```

#### 🟡 ISS-0925: MISSING_TRY_EXCEPT

- **Line:** 335
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
resolutions = await self.resolve_known_issues()
```

#### 🟡 ISS-0926: MISSING_TRY_EXCEPT

- **Line:** 402
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
inventory = await self.generate_inventory()
```

#### 🟡 ISS-0927: MISSING_TRY_EXCEPT

- **Line:** 406
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
issues = await self.resolve_known_issues()
```

#### 🟡 ISS-0928: MISSING_TRY_EXCEPT

- **Line:** 419
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
security = await self.run_security_scan()
```

#### 🟡 ISS-0929: MISSING_TRY_EXCEPT

- **Line:** 426
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.connect()
```

#### 🟡 ISS-0930: MISSING_TRY_EXCEPT

- **Line:** 429
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
report_md = await self.build_integration_report()
```

#### 🟡 ISS-0931: MISSING_TRY_EXCEPT

- **Line:** 433
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
checklist_md = await self.build_deployment_checklist()
```

#### 🟡 ISS-0932: MISSING_TRY_EXCEPT

- **Line:** 438
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.export_json_files()
```

#### 🟡 ISS-0933: MISSING_TRY_EXCEPT

- **Line:** 444
- **Code File:** `app/services/integration_manager.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.disconnect()
```

#### 🟡 ISS-0934: MISSING_TRY_EXCEPT

- **Line:** 542
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(DATABASE_URL)
```

#### 🟡 ISS-0935: MISSING_TRY_EXCEPT

- **Line:** 546
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0936: MISSING_TRY_EXCEPT

- **Line:** 568
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await db.fetch(query, *params)
```

#### 🟡 ISS-0937: MISSING_TRY_EXCEPT

- **Line:** 578
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await db.fetchrow("SELECT * FROM texts WHERE id = $1", text_id)
```

#### 🟡 ISS-0938: MISSING_TRY_EXCEPT

- **Line:** 590
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await db.fetch("SELECT * FROM source_texts WHERE work_id = $1 ORDER BY line_number", work_id)
```

#### 🟡 ISS-0939: MISSING_TRY_EXCEPT

- **Line:** 608
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await db.fetch(query, q)
```

#### 🟡 ISS-0940: MISSING_TRY_EXCEPT

- **Line:** 618
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await db.fetch("SELECT * FROM author_profiles ORDER BY name")
```

#### 🟡 ISS-0941: MISSING_TRY_EXCEPT

- **Line:** 628
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await db.fetch("SELECT * FROM translator_profiles ORDER BY name")
```

#### 🟡 ISS-0942: MISSING_TRY_EXCEPT

- **Line:** 641
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await db.fetchrow("SELECT * FROM translator_profiles WHERE name = $1", name)
```

#### 🟡 ISS-0943: MISSING_TRY_EXCEPT

- **Line:** 653
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
row = await db.fetchrow("SELECT vector FROM word_embeddings WHERE word = $1", word)
```

#### 🟡 ISS-0944: MISSING_TRY_EXCEPT

- **Line:** 665
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await db.execute("SELECT 1")
```

#### 🟡 ISS-0945: MISSING_TRY_EXCEPT

- **Line:** 687
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
author_name = await db.fetchval("SELECT name FROM author_profiles WHERE id = $1", author_id)
```

#### 🟡 ISS-0946: MISSING_TRY_EXCEPT

- **Line:** 688
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await db.fetch("SELECT * FROM texts WHERE author = $1", author_name)
```

#### 🟡 ISS-0947: MISSING_TRY_EXCEPT

- **Line:** 704
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await db.fetch(query, word, limit)
```

#### 🟡 ISS-0948: MISSING_TRY_EXCEPT

- **Line:** 729
- **Code File:** `app/api/v1/endpoints.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
rows = await db.fetch("SELECT * FROM texts ORDER BY id DESC LIMIT 5")
```

### FR1_import_fixer.txt

- Size: 35,510 chars
- Lines: 955
- Issues: 5

#### 🟡 ISS-0949: MISSING_TRY_EXCEPT

- **Line:** 64
- **Code File:** `tools/import_fixer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.db_pool = await asyncpg.create_pool(self.DATABASE_URL)
```

#### 🟡 ISS-0950: MISSING_TRY_EXCEPT

- **Line:** 93
- **Code File:** `tools/import_fixer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.initialize_db()
```

#### 🟡 ISS-0951: MISSING_TRY_EXCEPT

- **Line:** 331
- **Code File:** `tools/import_fixer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
fixed_missing = await self.fix_file(file_str)
```

#### 🟡 ISS-0952: MISSING_TRY_EXCEPT

- **Line:** 332
- **Code File:** `tools/import_fixer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
fixed_unused = await self.remove_unused_imports(file_str)
```

#### 🟡 ISS-0953: MISSING_TRY_EXCEPT

- **Line:** 617
- **Code File:** `tools/circular_import_resolver.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
success = await self.resolve_cycle(cycle)
```

### FR2_placeholder_remover.txt

- Size: 28,559 chars
- Lines: 708
- Issues: 9

#### 🟠 ISS-0954: PLACEHOLDER_TODO

- **Line:** 33
- **Code File:** `tools/placeholder_finder.py`
- **Description:** TODO comment found - code not complete
- **Suggested Fix:** Implement the TODO/FIXME item

```
HIGH = "HIGH"          # TODO or FIXME in production paths
```

#### 🟠 ISS-0955: PLACEHOLDER_NOTIMPLEMENTED

- **Line:** 73
- **Code File:** `tools/placeholder_finder.py`
- **Description:** NotImplemented raised - needs implementation
- **Suggested Fix:** Implement the function instead of raising error

```
r"raise NotImplemented",
```

#### 🟡 ISS-0956: MISSING_TRY_EXCEPT

- **Line:** 92
- **Code File:** `tools/placeholder_finder.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self.process_file(file_path)
```

#### 🟡 ISS-0957: MISSING_TRY_EXCEPT

- **Line:** 109
- **Code File:** `tools/placeholder_finder.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self._analyze_python_ast(file_path, content)
```

#### 🟡 ISS-0958: MISSING_TRY_EXCEPT

- **Line:** 111
- **Code File:** `tools/placeholder_finder.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self._regex_scan(file_path, content)
```

#### 🟡 ISS-0959: MISSING_TRY_EXCEPT

- **Line:** 273
- **Code File:** `tools/implementation_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
self.conn = await asyncpg.connect(self.DATABASE_URL)
```

#### 🟡 ISS-0960: MISSING_TRY_EXCEPT

- **Line:** 302
- **Code File:** `tools/implementation_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await self._generate_database_query_logic(context)
```

#### 🟡 ISS-0961: MISSING_TRY_EXCEPT

- **Line:** 304
- **Code File:** `tools/implementation_generator.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
return await self._generate_database_mutation_logic(context)
```

#### 🟡 ISS-0962: MISSING_TRY_EXCEPT

- **Line:** 595
- **Code File:** `tools/batch_completer.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await self._process_placeholder(match)
```

### FR4_error_handler_adder.txt

- Size: 34,241 chars
- Lines: 881
- Issues: 12

#### 🟡 ISS-0963: MISSING_TRY_EXCEPT

- **Line:** 65
- **Code File:** `tools/async_wrapper.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.database_url)
```

#### 🟡 ISS-0964: MISSING_TRY_EXCEPT

- **Line:** 71
- **Code File:** `tools/async_wrapper.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
exists = await conn.fetchval(query)
```

#### 🟡 ISS-0965: MISSING_TRY_EXCEPT

- **Line:** 83
- **Code File:** `tools/async_wrapper.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0966: MISSING_TRY_EXCEPT

- **Line:** 791
- **Code File:** `tools/database_integrity_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.dsn)
```

#### 🟡 ISS-0967: MISSING_TRY_EXCEPT

- **Line:** 800
- **Code File:** `tools/database_integrity_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0968: MISSING_TRY_EXCEPT

- **Line:** 809
- **Code File:** `tools/database_integrity_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.dsn)
```

#### 🟡 ISS-0969: MISSING_TRY_EXCEPT

- **Line:** 831
- **Code File:** `tools/database_integrity_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0970: MISSING_TRY_EXCEPT

- **Line:** 840
- **Code File:** `tools/database_integrity_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
conn = await asyncpg.connect(self.dsn)
```

#### 🟡 ISS-0971: MISSING_TRY_EXCEPT

- **Line:** 842
- **Code File:** `tools/database_integrity_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
translators = await conn.fetch("SELECT DISTINCT translator FROM texts WHERE translator IS NOT NULL")
```

#### 🟡 ISS-0972: MISSING_TRY_EXCEPT

- **Line:** 856
- **Code File:** `tools/database_integrity_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
await conn.close()
```

#### 🟡 ISS-0973: MISSING_TRY_EXCEPT

- **Line:** 867
- **Code File:** `tools/database_integrity_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
counts = await self.validate_text_counts()
```

#### 🟡 ISS-0974: MISSING_TRY_EXCEPT

- **Line:** 868
- **Code File:** `tools/database_integrity_checker.py`
- **Description:** Async call without error handling - wrap in try/except
- **Suggested Fix:** Wrap in try/except with proper error handling

```
violations = await self.scan_for_unauthorized_content()
```
