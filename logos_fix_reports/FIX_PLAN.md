# LOGOS Fix Plan

Review each proposed fix below. Edit APPROVED_FIXES.json to approve/reject.

---

## 🟠 HIGH Priority Issues

These issues result in non-functional code.

### ISS-0036: PLACEHOLDER_ELLIPSIS

**File:** `backend/utils/cache_decorators.py`
**Line:** 208
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        @logos_cache(ttl=3600)
        async def get_text_by_translator(translator_name: str):
>>> ...  # <-- ISSUE HERE
    """
    def decorator(func: T) -> T:
```

**Problem:** Ellipsis placeholder - code incomplete

**Proposed Fix:** Expand abbreviated code to full implementation

---

### ISS-0075: PLACEHOLDER_PASS

**File:** `backend/monitoring/sentry_config.py`
**Line:** 518
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if "request" in event and "data" in event["request"]:
            # Logic to scrub potential sensitive fields
>>> pass  # <-- ISSUE HERE

        return event
```

**Problem:** Empty pass statement - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0164: PLACEHOLDER_PASS

**File:** `backend/analysis/import_resolver.py`
**Line:** 529
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                spec = importlib.util.find_spec(module_name)
            except (ModuleNotFoundError, ValueError):
>>> pass  # <-- ISSUE HERE

            if spec and spec.origin:
```

**Problem:** Empty pass statement - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0168: PLACEHOLDER_PASS

**File:** `frontend/analysis/component_tree.ts`
**Line:** 1001
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
def get_circular_paths(self):
    # Already implemented detect_cycles, but adding a path-specific variant
>>> pass # (Note: Real implementation is in the primary file block)  # <-- ISSUE HERE
*/

```

**Problem:** Pass with comment - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0190: PLACEHOLDER_PASS

**File:** `backend/analysis/schema_validator.py`
**Line:** 547
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if not col_refs and "SELECT *" not in sql.upper():
            # If no columns were found but it's not a SELECT *, something might be wrong
>>> pass  # <-- ISSUE HERE

        # 3. Check for reserved keyword misuse
```

**Problem:** Empty pass statement - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0191: PLACEHOLDER_PASS

**File:** `backend/analysis/schema_validator.py`
**Line:** 554
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if clean_word in self.reserved_keywords:
                # Basic check to see if keyword is used as an identifier without quotes
>>> pass  # <-- ISSUE HERE

        is_valid = len(errors) == 0
```

**Problem:** Empty pass statement - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0394: PLACEHOLDER_PASS

**File:** `backend/database/connection.py`
**Line:** 22
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
class DatabaseConfigurationError(Exception):
    """Raised when database configuration is invalid or missing."""
>>> pass  # <-- ISSUE HERE

class DatabaseConnectionError(Exception):
```

**Problem:** Empty pass statement - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0395: PLACEHOLDER_PASS

**File:** `backend/database/connection.py`
**Line:** 26
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
class DatabaseConnectionError(Exception):
    """Raised when a connection to the database cannot be established."""
>>> pass  # <-- ISSUE HERE

class DatabasePool:
```

**Problem:** Empty pass statement - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0418: PLACEHOLDER_PASS

**File:** `backend/database/transactions.py`
**Line:** 475
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
class TransactionError(Exception):
    """Raised when a transaction fails to commit or rollback."""
>>> pass  # <-- ISSUE HERE

class Transaction:
```

**Problem:** Empty pass statement - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0460: PLACEHOLDER_PASS

**File:** `backend/services/events.py`
**Line:** 551
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                await self._worker_task
            except asyncio.CancelledError:
>>> pass  # <-- ISSUE HERE
        logger.info("EventPublisher background worker stopped.")

```

**Problem:** Empty pass statement - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0463: PLACEHOLDER_PASS

**File:** `backend/services/factory.py`
**Line:** 674
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    def __init__(self):
        # This class is primarily used via class methods
>>> pass  # <-- ISSUE HERE

    @classmethod
```

**Problem:** Empty pass statement - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0544: PLACEHOLDER_PASS

**File:** `backend/api/validators.py`
**Line:** 701
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if v and 'birth_year' in values and values['birth_year'] and v < values['birth_year']:
            # Note: Classical dates are often negative (BCE), so we handle logic carefully
>>> pass # Simplified for this example, but in production, BCE logic is complex  # <-- ISSUE HERE
        return v

```

**Problem:** Pass with comment - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0559: PLACEHOLDER_ELLIPSIS

**File:** `unknown`
**Line:** 477
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
  { label: "Rawlinson", value: "Rawlinson", description: "Herodotus specialist" },
  { label: "Jebb", value: "Jebb", description: "Sophocles specialist" },
>>> // ... (Mapping internal constants to these real names)  # <-- ISSUE HERE
].concat([
  "Dakyns", "Church_Brodribb", "Cowper", "Butcher_Lang", "Lang_Leaf_Myers", 
```

**Problem:** Ellipsis in comment - code abbreviated

**Proposed Fix:** Expand abbreviated code to full implementation

---

### ISS-0661: PLACEHOLDER_ELLIPSIS

**File:** `docs/API.md`
**Line:** 474
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if translator:
            # Validate translator against the allowed list
>>> allowed = ["Jowett", "Dryden", "Dakyns", "Pope", "Murray", "Butler"] # ... etc  # <-- ISSUE HERE
            if translator not in allowed:
                raise HTTPException(status_code=400, detail="Invalid or Restricted Translator")
```

**Problem:** Ellipsis in comment - code abbreviated

**Proposed Fix:** Expand abbreviated code to full implementation

---

### ISS-0702: PLACEHOLDER_PASS

**File:** `backend/verification/pass1/syntax_validator.py`
**Line:** 314
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        For this implementation, we assume token-level scanning happens elsewhere.
        """
>>> pass # Placeholder logic handled by standard ast.parse limitations  # <-- ISSUE HERE

# filepath: backend/verification/pass1/import_checker.py
```

**Problem:** Pass with comment - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0705: PLACEHOLDER_PASS

**File:** `backend/verification/pass1/import_checker.py`
**Line:** 421
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    logger.warning(f"Module {module_name} referenced in {file_path} not found in environment.")
        except Exception:
>>> pass # Module resolution errors are handled gracefully  # <-- ISSUE HERE

    async def _verify_against_production_db(self) -> None:
```

**Problem:** Pass with comment - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0747: PLACEHOLDER_PASS

**File:** `backend/verification/pass2/query_validator.py`
**Line:** 164
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    # We check if the column name exists in the string
                    # In a real system, we'd use a SQL parser like sqlglot
>>> pass # logic continues below  # <-- ISSUE HERE

        # Real implementation of entity checking
```

**Problem:** Pass with comment - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0848: PLACEHOLDER_PASS

**File:** `verification/pass2/auth_validator.py`
**Line:** 898
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Allows adding routes to the public allow-list."""
        # This would require an instance variable for public routes
>>> pass # Implementation detail  # <-- ISSUE HERE

    async def check_session_security(self):
```

**Problem:** Pass with comment - needs real implementation

**Proposed Fix:** Generate real implementation for this function/method

---

### ISS-0954: PLACEHOLDER_TODO

**File:** `tools/placeholder_finder.py`
**Line:** 33
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """Defines the severity levels for identified placeholders."""
    CRITICAL = "CRITICAL"  # pass statements in logic, ... in code
>>> HIGH = "HIGH"          # TODO or FIXME in production paths  # <-- ISSUE HERE
    MEDIUM = "MEDIUM"      # Incomplete docstrings
    LOW = "LOW"           # Minor formatting issues
```

**Problem:** TODO comment found - code not complete

**Proposed Fix:** Implement the TODO/FIXME item

---

### ISS-0955: PLACEHOLDER_NOTIMPLEMENTED

**File:** `tools/placeholder_finder.py`
**Line:** 73
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            r"add implementation",
            r"NotImplementedError",
>>> r"raise NotImplemented",  # <-- ISSUE HERE
            r"\.\.\."
        ]
```

**Problem:** NotImplemented raised - needs implementation

**Proposed Fix:** Implement the function instead of raising error

---

## 🟡 MEDIUM Priority Issues

These issues should be fixed for production quality.

### ISS-0001: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 524
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            logger.info("Attempting to connect to Railway PostgreSQL...")
>>> self.pool = await asyncpg.create_pool(self.DATABASE_URL, min_size=5, max_size=20)  # <-- ISSUE HERE
            logger.info("Database connection pool established successfully.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0002: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 542
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
        
        results = {"status": "PASS", "violations": [], "count": 0}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0003: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 549
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                logger.info("Auditing translator compliance in 'texts' table...")
>>> rows = await conn.fetch("SELECT DISTINCT translator FROM texts")  # <-- ISSUE HERE
                
                for row in rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0004: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 572
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        analysis = {"total_rows": 0, "language_distribution": {}, "avg_length": 0.0}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0005: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 603
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        anomalies = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0006: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 609
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                logger.info("Verifying author profile chronological data...")
>>> authors = await conn.fetch("SELECT id, name, birth_year, death_year FROM author_profiles")  # <-- ISSUE HERE
                
                for author in authors:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0007: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 636
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        stats = {"valid_embeddings": 0, "invalid_embeddings": 0, "total_checked": 0}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0008: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 643
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                logger.info("Auditing word embeddings for vector integrity...")
>>> rows = await conn.fetch("SELECT word, vector FROM word_embeddings")  # <-- ISSUE HERE
                
                for row in rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0009: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 676
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        report = {"checked": 0, "malformed": []}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0010: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 684
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                logger.info("Scanning text content for formatting anomalies...")
                # Sample 5000 rows for performance
>>> texts = await conn.fetch("SELECT id, title, text_content FROM texts LIMIT 5000")  # <-- ISSUE HERE
                
                for text in texts:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0011: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 713
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        required_tables = {"texts", "source_texts", "author_profiles", "translator_profiles", "word_embeddings"}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0012: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 749
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            "embedding_stats": await self.audit_word_embeddings(),
            "author_anomalies": len(await self.verify_author_profiles()),
>>> "source_text_density": await self.check_source_text_density()  # <-- ISSUE HERE
        }
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0013: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 761
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        missing_profiles = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0014: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 774
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    WHERE tp.name IS NULL AND t.translator IS NOT NULL
                """
>>> results = await conn.fetch(query)  # <-- ISSUE HERE
                
                for row in results:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0015: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 791
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> await self.connect()  # <-- ISSUE HERE
            
            health = await self.get_system_health_metrics()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0016: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 793
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            await self.connect()
            
>>> health = await self.get_system_health_metrics()  # <-- ISSUE HERE
            consistency = await self.check_translator_profile_consistency()
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0017: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 794
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            health = await self.get_system_health_metrics()
>>> consistency = await self.check_translator_profile_consistency()  # <-- ISSUE HERE
            
            report = {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0018: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 812
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return json.dumps({"status": "CRITICAL_FAILURE", "error": str(e)})
        finally:
>>> await self.disconnect()  # <-- ISSUE HERE

    async def validate_line_number_sequence(self, work_id: int) -> bool:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0019: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 820
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0020: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 853
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        distribution = {"short": 0, "medium": 0, "long": 0, "total": 0}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0021: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 885
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        valid_codes = {"grc", "lat", "eng", "heb"}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0022: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 894
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                logger.info("Verifying language tags in source_texts...")
                
>>> tags = await conn.fetch("SELECT DISTINCT language FROM source_texts")  # <-- ISSUE HERE
                for row in tags:
                    lang = row['language']
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0023: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 912
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        duplicates = {}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0024: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 925
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    HAVING COUNT(*) > 1
                """
>>> results = await conn.fetch(query)  # <-- ISSUE HERE
                
                for row in results:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0025: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 942
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0026: MISSING_TRY_EXCEPT

**File:** `backend/logos_quality_assurance.py`
**Line:** 959
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                        (SELECT COUNT(*) FROM corpus_words)::float as coverage
                """
>>> result = await conn.fetchval(coverage_query)  # <-- ISSUE HERE
                
                coverage_pct = (result or 0.0) * 100
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0027: MISSING_TRY_EXCEPT

**File:** `backend/utils/cache_decorators.py`
**Line:** 52
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                )
                logger.info("Successfully established connection pool for LogosDistributedCache.")
>>> await self._ensure_cache_schema()  # <-- ISSUE HERE
            except Exception as e:
                logger.error(f"Failed to connect to Railway PostgreSQL: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0028: MISSING_TRY_EXCEPT

**File:** `backend/utils/cache_decorators.py`
**Line:** 73
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        CREATE INDEX IF NOT EXISTS idx_cache_expiry ON logos_query_cache (expires_at);
        """
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            async with conn.transaction():
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0029: MISSING_TRY_EXCEPT

**File:** `backend/utils/cache_decorators.py`
**Line:** 76
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        async with pool.acquire() as conn:
            async with conn.transaction():
>>> await conn.execute(query)  # <-- ISSUE HERE
                logger.info("LOGOS cache schema verified and ready.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0030: MISSING_TRY_EXCEPT

**File:** `backend/utils/cache_decorators.py`
**Line:** 103
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

        # Level 2: Persistent PostgreSQL Cache
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        try:
            async with pool.acquire() as conn:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0031: MISSING_TRY_EXCEPT

**File:** `backend/utils/cache_decorators.py`
**Line:** 125
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                        return value
                    else:
>>> await conn.execute("DELETE FROM logos_query_cache WHERE cache_key = $1", key)  # <-- ISSUE HERE
        except Exception as e:
            logger.error(f"Error retrieving from persistent cache: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0032: MISSING_TRY_EXCEPT

**File:** `backend/utils/cache_decorators.py`
**Line:** 145
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

        # Level 2: Persistent Update
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        try:
            async with pool.acquire() as conn:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0033: MISSING_TRY_EXCEPT

**File:** `backend/utils/cache_decorators.py`
**Line:** 180
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            del self._memory_cache[key]
        
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        try:
            async with pool.acquire() as conn:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0034: MISSING_TRY_EXCEPT

**File:** `backend/utils/cache_decorators.py`
**Line:** 183
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with pool.acquire() as conn:
>>> await conn.execute("DELETE FROM logos_query_cache WHERE cache_key = $1", key)  # <-- ISSUE HERE
        except Exception as e:
            logger.error(f"Error invalidating cache key {key}: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0035: MISSING_TRY_EXCEPT

**File:** `backend/utils/cache_decorators.py`
**Line:** 189
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def vacuum(self):
        """Cleans up expired entries from the persistent database."""
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        try:
            async with pool.acquire() as conn:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0037: MISSING_TRY_EXCEPT

**File:** `backend/utils/cache_decorators.py`
**Line:** 216
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            # Try to get from cache
>>> cached_result = await logos_cache_manager.get(key)  # <-- ISSUE HERE
            if cached_result is not None:
                return cached_result
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0038: MISSING_TRY_EXCEPT

**File:** `backend/utils/cache_decorators.py`
**Line:** 229
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # Store result in cache
            if result is not None:
>>> await logos_cache_manager.set(key, result, ttl)  # <-- ISSUE HERE
            
            return result
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0039: MISSING_TRY_EXCEPT

**File:** `backend/utils/cache_decorators.py`
**Line:** 241
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_stats() -> Dict[str, Any]:
        """Returns statistics about the current cache state."""
>>> pool = await logos_cache_manager._get_pool()  # <-- ISSUE HERE
        try:
            async with pool.acquire() as conn:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0040: MISSING_TRY_EXCEPT

**File:** `backend/utils/cache_decorators.py`
**Line:** 246
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                total_entries = await conn.fetchval("SELECT count(*) FROM logos_query_cache")
                avg_hits = await conn.fetchval("SELECT AVG(hit_count) FROM logos_query_cache")
>>> top_keys = await conn.fetch("SELECT cache_key, hit_count FROM logos_query_cache ORDER BY hit_count DESC LIMIT 5")  # <-- ISSUE HERE
                
                return {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0041: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 884
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info(f"Starting cache warmup for translators: {top_translators}")
        
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            for translator in top_translators:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0042: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 900
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        Invalidates all cache keys matching a specific pattern (e.g., all 'Homer' queries).
        """
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            # Persistent layer
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0043: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 916
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_cache_efficiency(self) -> float:
        """Calculates the hit/miss ratio for the current session."""
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            total_hits = await conn.fetchval("SELECT SUM(hit_count) FROM logos_query_cache")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0044: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 929
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        These are 300-dimension vectors used for semantic search.
        """
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            embeddings = await conn.fetch("SELECT word, vector FROM word_embeddings")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0045: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 931
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        pool = await self._get_pool()
        async with pool.acquire() as conn:
>>> embeddings = await conn.fetch("SELECT word, vector FROM word_embeddings")  # <-- ISSUE HERE
            for emb in embeddings:
                key = f"emb:{emb['word']}"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0046: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 945
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        Removes entries that haven't been accessed much to save space.
        """
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            deleted = await conn.execute(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0047: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 956
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """High-level wrapper for author profile caching."""
        key = f"author_profile:{author_name}"
>>> cached = await self.get(key)  # <-- ISSUE HERE
        if cached:
            return cached
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0048: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 960
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return cached
            
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            profile = await conn.fetchrow("SELECT * FROM author_profiles WHERE name = $1", author_name)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0049: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 962
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        pool = await self._get_pool()
        async with pool.acquire() as conn:
>>> profile = await conn.fetchrow("SELECT * FROM author_profiles WHERE name = $1", author_name)  # <-- ISSUE HERE
            if profile:
                data = dict(profile)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0050: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 965
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if profile:
                data = dict(profile)
>>> await self.set(key, data, ttl=3600 * 12)  # <-- ISSUE HERE
                return data
        return None
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0051: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 976
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def export_cache_metadata(self) -> str:
        """Exports cache keys and metadata to a JSON string for auditing."""
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            rows = await conn.fetch("SELECT cache_key, expires_at, hit_count FROM logos_query_cache")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0052: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 978
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        pool = await self._get_pool()
        async with pool.acquire() as conn:
>>> rows = await conn.fetch("SELECT cache_key, expires_at, hit_count FROM logos_query_cache")  # <-- ISSUE HERE
            return json.dumps([dict(r) for r in rows], default=str)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0053: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 995
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Verifies that the cache table is responsive and not corrupted."""
        try:
>>> pool = await self._get_pool()  # <-- ISSUE HERE
            async with pool.acquire() as conn:
                await conn.execute("SELECT 1")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0054: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 997
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            pool = await self._get_pool()
            async with pool.acquire() as conn:
>>> await conn.execute("SELECT 1")  # <-- ISSUE HERE
            return True
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0055: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 1005
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_expired_count(self) -> int:
        """Returns the number of expired items waiting for vacuuming."""
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            return await conn.fetchval("SELECT count(*) FROM logos_query_cache WHERE expires_at < CURRENT_TIMESTAMP")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0056: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 1012
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Stores multiple items in cache efficiently."""
        for key, value in mapping.items():
>>> await self.set(key, value, ttl)  # <-- ISSUE HERE
        logger.info(f"Batch cached {len(mapping)} items.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0057: MISSING_TRY_EXCEPT

**File:** `frontend/utils/lazy_loader.ts`
**Line:** 1019
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        results = {}
        for key in keys:
>>> val = await self.get(key)  # <-- ISSUE HERE
            if val is not None:
                results[key] = val
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0058: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 51
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Establishes a connection to the Railway PostgreSQL instance."""
        try:
>>> conn = await asyncpg.connect(DATABASE_URL)  # <-- ISSUE HERE
            logger.info("Database connection established for health check.")
            return conn
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0059: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 62
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        start = time.perf_counter()
        try:
>>> await conn.execute("SELECT 1")  # <-- ISSUE HERE
            latency = (time.perf_counter() - start) * 1000
            logger.info(f"Database latency: {latency:.2f}ms")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0060: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 103
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Ensures all 38 approved translators are present in the database."""
        try:
>>> results = await conn.fetch("SELECT DISTINCT name FROM translator_profiles")  # <-- ISSUE HERE
            db_translators = {r['name'] for r in results}
            missing = [t for t in self.required_translators if t not in db_translators]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0061: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 125
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            row_count = await conn.fetchval("SELECT COUNT(*) FROM word_embeddings")
>>> sample = await conn.fetchrow("SELECT vector FROM word_embeddings LIMIT 1")  # <-- ISSUE HERE
            
            vector_valid = False
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0062: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 198
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        conn = None
        try:
>>> conn = await self.get_db_connection()  # <-- ISSUE HERE
            
            db_latency = await self.check_database_latency(conn)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0063: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 200
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            conn = await self.get_db_connection()
            
>>> db_latency = await self.check_database_latency(conn)  # <-- ISSUE HERE
            texts_health = await self.check_texts_table_integrity(conn)
            source_health = await self.check_source_texts_volume(conn)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0064: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 201
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            db_latency = await self.check_database_latency(conn)
>>> texts_health = await self.check_texts_table_integrity(conn)  # <-- ISSUE HERE
            source_health = await self.check_source_texts_volume(conn)
            translator_integrity = await self.verify_translator_list(conn)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0065: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 202
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            db_latency = await self.check_database_latency(conn)
            texts_health = await self.check_texts_table_integrity(conn)
>>> source_health = await self.check_source_texts_volume(conn)  # <-- ISSUE HERE
            translator_integrity = await self.verify_translator_list(conn)
            embedding_health = await self.check_word_embeddings_health(conn)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0066: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 203
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            texts_health = await self.check_texts_table_integrity(conn)
            source_health = await self.check_source_texts_volume(conn)
>>> translator_integrity = await self.verify_translator_list(conn)  # <-- ISSUE HERE
            embedding_health = await self.check_word_embeddings_health(conn)
            active_conns = await self.check_active_connections(conn)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0067: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 204
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            source_health = await self.check_source_texts_volume(conn)
            translator_integrity = await self.verify_translator_list(conn)
>>> embedding_health = await self.check_word_embeddings_health(conn)  # <-- ISSUE HERE
            active_conns = await self.check_active_connections(conn)
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0068: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 205
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            translator_integrity = await self.verify_translator_list(conn)
            embedding_health = await self.check_word_embeddings_health(conn)
>>> active_conns = await self.check_active_connections(conn)  # <-- ISSUE HERE
            
            cpu = self.check_cpu_usage()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0069: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 253
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        finally:
            if conn:
>>> await conn.close()  # <-- ISSUE HERE
                logger.info("Database connection closed after health check.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0070: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 259
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Background task for periodic health logging."""
        while True:
>>> report = await self.run_full_diagnostics()  # <-- ISSUE HERE
            if report.status != "HEALTHY":
                logger.warning(f"SYSTEM ALERT: Status is {report.status}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0071: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/health.py`
**Line:** 268
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
# async def health_endpoint():
#     monitor = HealthMonitor()
>>> #     return await monitor.run_full_diagnostics()  # <-- ISSUE HERE
```

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0072: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/metrics.py`
**Line:** 386
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        conn = None
        try:
>>> conn = await asyncpg.connect(DATABASE_URL)  # <-- ISSUE HERE
            while True:
                # Update active connections
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0073: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/metrics.py`
**Line:** 396
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                logger.info(f"Gauges updated: DB Conns={active_conns}, SourceTexts={source_count}")
                
>>> await asyncio.sleep(60)  # <-- ISSUE HERE
        except Exception as e:
            logger.error(f"Failed to update DB gauges: {e}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0074: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/metrics.py`
**Line:** 400
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            logger.error(f"Failed to update DB gauges: {e}")
            if conn:
>>> await conn.close()  # <-- ISSUE HERE

    def generate_metrics_report(self) -> bytes:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0076: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/performance.py`
**Line:** 652
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        conn = None
        try:
>>> conn = await asyncpg.connect(DATABASE_URL)  # <-- ISSUE HERE
            explain_query = f"EXPLAIN ANALYZE {query}"
            plan = await conn.fetch(explain_query, *(params or []))
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0077: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/performance.py`
**Line:** 665
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        finally:
            if conn:
>>> await conn.close()  # <-- ISSUE HERE

    def clear_metrics(self):
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0078: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/performance.py`
**Line:** 676
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        while True:
            start = time.perf_counter()
>>> await asyncio.sleep(1)  # <-- ISSUE HERE
            lag = time.perf_counter() - start - 1
            if lag > 0.1:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0079: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/performance.py`
**Line:** 680
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if lag > 0.1:
                logger.warning(f"EVENT LOOP LAG DETECTED: {lag:.4f}s. Possible CPU blocking.")
>>> await asyncio.sleep(5)  # <-- ISSUE HERE

    def log_summary_report(self):
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0080: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/performance.py`
**Line:** 700
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        conn = None
        try:
>>> conn = await asyncpg.connect(DATABASE_URL)  # <-- ISSUE HERE
            results = await conn.fetch(query)
            for row in results:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0081: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/performance.py`
**Line:** 701
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            conn = await asyncpg.connect(DATABASE_URL)
>>> results = await conn.fetch(query)  # <-- ISSUE HERE
            for row in results:
                logger.info(f"Table {row['table_name']}: {row['total_size']}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0082: MISSING_TRY_EXCEPT

**File:** `backend/monitoring/performance.py`
**Line:** 708
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        finally:
            if conn:
>>> await conn.close()  # <-- ISSUE HERE

# Global performance interceptor
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0083: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py`
**Line:** 73
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            try:
                logger.info(f"Attempting to connect to database (Attempt {retry_count + 1})...")
>>> self.pool = await asyncpg.create_pool(self.dsn, min_size=5, max_size=20)  # <-- ISSUE HERE
                logger.info("Successfully established database connection pool.")
                return
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0084: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py`
**Line:** 79
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                retry_count += 1
                logger.error(f"Connection failed: {str(e)}. Retrying in 5 seconds...")
>>> await asyncio.sleep(5)  # <-- ISSUE HERE
        
        logger.critical("Failed to connect to the database after multiple attempts.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0085: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py`
**Line:** 128
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                logger.info(f"Seeding {len(authors)} author profiles...")
>>> await conn.executemany(query, authors)  # <-- ISSUE HERE
                logger.info("Successfully seeded author profiles.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0086: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py`
**Line:** 160
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                # We need to convert the list to a JSON string or stay with the array depending on schema
                # For this implementation, we assume the DB column is a vector/float array type
>>> await conn.executemany(query, translator_data)  # <-- ISSUE HERE
                logger.info("Successfully seeded translator profiles.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0087: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py`
**Line:** 192
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                logger.info(f"Seeding {len(sample_texts)} sample texts...")
>>> await conn.executemany(query, sample_texts)  # <-- ISSUE HERE
                logger.info("Successfully seeded sample texts.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0088: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py`
**Line:** 220
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                logger.info(f"Seeding {len(embedding_data)} word embeddings...")
>>> await conn.executemany(query, embedding_data)  # <-- ISSUE HERE
                logger.info("Successfully seeded word embeddings.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0089: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py`
**Line:** 254
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> await self.connect()  # <-- ISSUE HERE
            
            # Execute seeding steps
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0090: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py`
**Line:** 258
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # Execute seeding steps
            logger.info("Starting master seeding process...")
>>> await self.seed_author_profiles()  # <-- ISSUE HERE
            await self.seed_translator_profiles()
            await self.seed_texts()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0091: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py`
**Line:** 259
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            logger.info("Starting master seeding process...")
            await self.seed_author_profiles()
>>> await self.seed_translator_profiles()  # <-- ISSUE HERE
            await self.seed_texts()
            await self.seed_word_embeddings()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0092: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py`
**Line:** 260
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            await self.seed_author_profiles()
            await self.seed_translator_profiles()
>>> await self.seed_texts()  # <-- ISSUE HERE
            await self.seed_word_embeddings()
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0093: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py`
**Line:** 261
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            await self.seed_translator_profiles()
            await self.seed_texts()
>>> await self.seed_word_embeddings()  # <-- ISSUE HERE
            
            # Verify
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0094: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py`
**Line:** 264
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            # Verify
>>> await self.verify_seeding()  # <-- ISSUE HERE
            
            logger.info("Master seeding process completed successfully.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0095: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py`
**Line:** 270
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            logger.critical(f"Seeding process failed: {str(e)}")
        finally:
>>> await self.close()  # <-- ISSUE HERE

if __name__ == "__main__":
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0096: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py (Continued/Expanded)`
**Line:** 901
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        async with self.pool.acquire() as conn:
            logger.info(f"Seeding {len(source_data)} source language texts...")
>>> await conn.executemany(query, source_data)  # <-- ISSUE HERE
            logger.info("Successfully seeded source texts.")
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0097: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py (Continued/Expanded)`
**Line:** 923
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            for table in tables:
                logger.info(f"Truncating table {table}...")
>>> await conn.execute(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE")  # <-- ISSUE HERE
            logger.info("Database cleanup completed.")
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0098: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py (Continued/Expanded)`
**Line:** 940
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        async with self.pool.acquire() as conn:
>>> rows = await conn.fetch("SELECT name FROM translator_profiles")  # <-- ISSUE HERE
            found_names = [r['name'] for r in rows]
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0099: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py (Continued/Expanded)`
**Line:** 980
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        async with self.pool.acquire() as conn:
            logger.info(f"Seeding batch of {len(embedding_data)} word embeddings...")
>>> await conn.executemany(query, embedding_data)  # <-- ISSUE HERE
            logger.info("Batch embedding seed complete.")
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0100: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py (Continued/Expanded)`
**Line:** 992
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    logger.info("Starting production-grade seeding sequence...")
>>> await self.connect()  # <-- ISSUE HERE
    
    try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0101: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py (Continued/Expanded)`
**Line:** 1002
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

        # Seeding
>>> await self.seed_author_profiles()  # <-- ISSUE HERE
        await self.seed_translator_profiles()
        await self.seed_texts()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0102: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py (Continued/Expanded)`
**Line:** 1003
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # Seeding
        await self.seed_author_profiles()
>>> await self.seed_translator_profiles()  # <-- ISSUE HERE
        await self.seed_texts()
        await self.seed_source_texts()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0103: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py (Continued/Expanded)`
**Line:** 1004
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        await self.seed_author_profiles()
        await self.seed_translator_profiles()
>>> await self.seed_texts()  # <-- ISSUE HERE
        await self.seed_source_texts()
        await self.seed_word_embeddings()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0104: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py (Continued/Expanded)`
**Line:** 1005
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        await self.seed_translator_profiles()
        await self.seed_texts()
>>> await self.seed_source_texts()  # <-- ISSUE HERE
        await self.seed_word_embeddings()
        await self.seed_batch_word_embeddings()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0105: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py (Continued/Expanded)`
**Line:** 1006
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        await self.seed_texts()
        await self.seed_source_texts()
>>> await self.seed_word_embeddings()  # <-- ISSUE HERE
        await self.seed_batch_word_embeddings()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0106: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py (Continued/Expanded)`
**Line:** 1007
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        await self.seed_source_texts()
        await self.seed_word_embeddings()
>>> await self.seed_batch_word_embeddings()  # <-- ISSUE HERE
        
        # Verification
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0107: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py (Continued/Expanded)`
**Line:** 1010
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        # Verification
>>> await self.verify_seeding()  # <-- ISSUE HERE
        
        logger.info("Production seeding sequence completed successfully.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0108: MISSING_TRY_EXCEPT

**File:** `scripts/seed_database.py (Continued/Expanded)`
**Line:** 1016
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.critical(f"Seeding failed: {str(e)}")
    finally:
>>> await self.close()  # <-- ISSUE HERE

# The code above provides a complete, robust, and production-ready suite of utilities.
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0109: MISSING_TRY_EXCEPT

**File:** `backend/analysis/file_inventory.py`
**Line:** 68
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            logger.info("Connecting to Railway PostgreSQL database...")
>>> self.pool = await asyncpg.create_pool(self.DATABASE_URL)  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                await conn.execute("""
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0110: MISSING_TRY_EXCEPT

**File:** `backend/analysis/file_inventory.py`
**Line:** 102
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            for txt_file in txt_files:
>>> metadata_list = await self._process_text_file(txt_file)  # <-- ISSUE HERE
                all_metadata.extend(metadata_list)
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0111: MISSING_TRY_EXCEPT

**File:** `backend/analysis/file_inventory.py`
**Line:** 124
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            for lang, code in matches:
>>> metadata = await self._extract_file_metadata(code, lang)  # <-- ISSUE HERE
                if metadata:
                    results.append(metadata)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0112: MISSING_TRY_EXCEPT

**File:** `backend/analysis/file_inventory.py`
**Line:** 127
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                if metadata:
                    results.append(metadata)
>>> await self._save_metadata_to_db(metadata)  # <-- ISSUE HERE
            
            return results
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0113: MISSING_TRY_EXCEPT

**File:** `backend/analysis/file_inventory.py`
**Line:** 282
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> await conn.execute("TRUNCATE TABLE file_inventory")  # <-- ISSUE HERE
                logger.info("Inventory table truncated.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0114: MISSING_TRY_EXCEPT

**File:** `backend/analysis/file_inventory.py`
**Line:** 295
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def run_full_scan(self) -> Dict[str, Any]:
        """Orchestrates the full scanning process."""
>>> await self.initialize_db()  # <-- ISSUE HERE
        await self.clear_inventory_cache()
        await self.scan_build_directory()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0115: MISSING_TRY_EXCEPT

**File:** `backend/analysis/file_inventory.py`
**Line:** 296
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Orchestrates the full scanning process."""
        await self.initialize_db()
>>> await self.clear_inventory_cache()  # <-- ISSUE HERE
        await self.scan_build_directory()
        summary = await self.get_inventory_summary()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0116: MISSING_TRY_EXCEPT

**File:** `backend/analysis/file_inventory.py`
**Line:** 297
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        await self.initialize_db()
        await self.clear_inventory_cache()
>>> await self.scan_build_directory()  # <-- ISSUE HERE
        summary = await self.get_inventory_summary()
        await self.close()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0117: MISSING_TRY_EXCEPT

**File:** `backend/analysis/file_inventory.py`
**Line:** 298
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        await self.clear_inventory_cache()
        await self.scan_build_directory()
>>> summary = await self.get_inventory_summary()  # <-- ISSUE HERE
        await self.close()
        return summary
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0118: MISSING_TRY_EXCEPT

**File:** `backend/analysis/file_inventory.py`
**Line:** 299
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        await self.scan_build_directory()
        summary = await self.get_inventory_summary()
>>> await self.close()  # <-- ISSUE HERE
        return summary

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0119: MISSING_TRY_EXCEPT

**File:** `backend/analysis/completeness_checker.py`
**Line:** 372
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Fetches all files from the inventory and performs deep analysis."""
        try:
>>> conn = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
            files = await conn.fetch("SELECT filepath, language FROM file_inventory")
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0120: MISSING_TRY_EXCEPT

**File:** `backend/analysis/completeness_checker.py`
**Line:** 373
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            conn = await asyncpg.connect(self.DATABASE_URL)
>>> files = await conn.fetch("SELECT filepath, language FROM file_inventory")  # <-- ISSUE HERE
            
            # Note: In a real scenario, we'd read the actual code content here.
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0121: MISSING_TRY_EXCEPT

**File:** `backend/analysis/completeness_checker.py`
**Line:** 384
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                # In production, this would read from the local build directory
                # or a 'source_texts' table.
>>> result = await self._perform_deep_analysis(filepath)  # <-- ISSUE HERE
                self.results.append(result)
                self.total_checked += 1
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0122: MISSING_TRY_EXCEPT

**File:** `backend/analysis/completeness_checker.py`
**Line:** 388
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                self.total_checked += 1
                
>>> await conn.close()  # <-- ISSUE HERE
            return self.results
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0123: MISSING_TRY_EXCEPT

**File:** `backend/analysis/completeness_checker.py`
**Line:** 404
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # For the purpose of this logic, we assume we have access to it.
        # Let's assume we fetch it from a hypothetical 'build_source' table.
>>> code = await self._fetch_source_code(filepath)  # <-- ISSUE HERE
        
        issues = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0124: MISSING_TRY_EXCEPT

**File:** `backend/analysis/completeness_checker.py`
**Line:** 428
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # In the real LOGOS system, this would query the source_texts or a build table
        try:
>>> conn = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
            # Hypothetical query - in reality, we'd use the scanned content
            row = await conn.fetchrow("SELECT text_content FROM texts WHERE title = $1 LIMIT 1", filepath)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0125: MISSING_TRY_EXCEPT

**File:** `backend/analysis/completeness_checker.py`
**Line:** 430
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            conn = await asyncpg.connect(self.DATABASE_URL)
            # Hypothetical query - in reality, we'd use the scanned content
>>> row = await conn.fetchrow("SELECT text_content FROM texts WHERE title = $1 LIMIT 1", filepath)  # <-- ISSUE HERE
            await conn.close()
            return row['text_content'] if row else ""
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0126: MISSING_TRY_EXCEPT

**File:** `backend/analysis/completeness_checker.py`
**Line:** 431
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # Hypothetical query - in reality, we'd use the scanned content
            row = await conn.fetchrow("SELECT text_content FROM texts WHERE title = $1 LIMIT 1", filepath)
>>> await conn.close()  # <-- ISSUE HERE
            return row['text_content'] if row else ""
        except Exception:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0127: MISSING_TRY_EXCEPT

**File:** `backend/analysis/completeness_checker.py`
**Line:** 562
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Persists analysis results to the database."""
        try:
>>> conn = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
            await conn.execute("CREATE TABLE IF NOT EXISTS completeness_results (id SERIAL, filepath TEXT, score FLOAT, issues_count INTEGER, status TEXT)")
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0128: MISSING_TRY_EXCEPT

**File:** `backend/analysis/completeness_checker.py`
**Line:** 571
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    VALUES ($1, $2, $3, $4)
                """, res.file_path, res.score, len(res.issues), status)
>>> await conn.close()  # <-- ISSUE HERE
        except Exception as e:
            logger.error(f"Failed to save results: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0129: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 622
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Ensures a database connection pool is available."""
        if not self.db_pool:
>>> self.db_pool = await asyncpg.create_pool(self.DATABASE_URL)  # <-- ISSUE HERE
        return self.db_pool

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0130: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 630
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        Fetches data from multiple analysis tables.
        """
>>> pool = await self._get_db_connection()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            # 1. Aggregate basic metrics
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0131: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 640
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            # 2. Identify missing translators from the required list
>>> missing_translators = await self._identify_missing_translators(conn)  # <-- ISSUE HERE
            
            # 3. Calculate completion percentage based on SLOC and Issue density
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0132: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 643
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            # 3. Calculate completion percentage based on SLOC and Issue density
>>> completion = await self._calculate_completion_percentage(conn, total_files)  # <-- ISSUE HERE
            
            # 4. Aggregate quality metrics
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0133: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 646
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            # 4. Aggregate quality metrics
>>> metrics = await self._aggregate_metrics(conn)  # <-- ISSUE HERE
            
            report = GapReport(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0134: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 659
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            self.current_report = report
>>> await self._persist_report_to_db(report)  # <-- ISSUE HERE
            return report

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0135: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 674
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        # Query distinct translators in the texts table
>>> rows = await conn.fetch("SELECT DISTINCT translator FROM texts")  # <-- ISSUE HERE
        existing = {row['translator'] for row in rows if row['translator']}
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0136: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 710
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def _persist_report_to_db(self, report: GapReport) -> None:
        """Saves the generated report as JSON into a history table."""
>>> pool = await self._get_db_connection()  # <-- ISSUE HERE
        try:
            async with pool.acquire() as conn:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0137: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 755
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def fetch_historical_trends(self) -> List[Dict[str, Any]]:
        """Retrieves past reports to analyze completion trends over time."""
>>> pool = await self._get_db_connection()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            rows = await conn.fetch("SELECT data FROM gap_reports ORDER BY created_at DESC LIMIT 10")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0138: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 757
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        pool = await self._get_db_connection()
        async with pool.acquire() as conn:
>>> rows = await conn.fetch("SELECT data FROM gap_reports ORDER BY created_at DESC LIMIT 10")  # <-- ISSUE HERE
            return [json.loads(r['data']) for r in rows]

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0139: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 762
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def cleanup_old_data(self, days: int = 30) -> None:
        """Removes reports older than a certain threshold."""
>>> pool = await self._get_db_connection()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            cutoff = datetime.datetime.utcnow() - datetime.timedelta(days=days)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0140: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 765
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        async with pool.acquire() as conn:
            cutoff = datetime.datetime.utcnow() - datetime.timedelta(days=days)
>>> await conn.execute("DELETE FROM gap_reports WHERE created_at < $1", cutoff)  # <-- ISSUE HERE
            logger.info(f"Cleaned up reports older than {days} days.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0141: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 789
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    scanner = InventoryScanner(build_dir)
    print("Starting file inventory scan...")
>>> scan_summary = await scanner.run_full_scan()  # <-- ISSUE HERE
    print(f"Scan Complete: {scan_summary['total_files']} files cataloged.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0142: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 795
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    checker = CodeCompletenessChecker()
    print("Starting deep completeness analysis...")
>>> results = await checker.check_all_files()  # <-- ISSUE HERE
    await checker.save_results_to_db()
    failures = checker.get_critical_failure_count()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0143: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 796
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    print("Starting deep completeness analysis...")
    results = await checker.check_all_files()
>>> await checker.save_results_to_db()  # <-- ISSUE HERE
    failures = checker.get_critical_failure_count()
    print(f"Analysis Complete: {len(results)} files checked, {failures} critical failures found.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0144: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 803
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    reporter = ReportGenerator()
    print("Generating gap report...")
>>> report = await reporter.create_full_report()  # <-- ISSUE HERE
    markdown_summary = reporter._format_markdown_summary()
    
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0145: MISSING_TRY_EXCEPT

**File:** `backend/analysis/gap_report_generator.py`
**Line:** 809
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    print(markdown_summary)
    
>>> await reporter.close()  # <-- ISSUE HERE
    print("\nLOGOS Analysis Suite Finished.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0146: MISSING_TRY_EXCEPT

**File:** `backend/analysis/cli_interface.py`
**Line:** 848
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # Step 1: Inventory
        scanner = InventoryScanner(directory)
>>> await scanner.initialize_db()  # <-- ISSUE HERE
        print("[1/3] Scanning build directory...")
        await scanner.scan_build_directory()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0147: MISSING_TRY_EXCEPT

**File:** `backend/analysis/cli_interface.py`
**Line:** 850
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        await scanner.initialize_db()
        print("[1/3] Scanning build directory...")
>>> await scanner.scan_build_directory()  # <-- ISSUE HERE
        
        # Step 2: Completeness
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0148: MISSING_TRY_EXCEPT

**File:** `backend/analysis/cli_interface.py`
**Line:** 855
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        checker = CodeCompletenessChecker()
        print("[2/3] Analyzing code completeness...")
>>> await checker.check_all_files()  # <-- ISSUE HERE
        await checker.save_results_to_db()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0149: MISSING_TRY_EXCEPT

**File:** `backend/analysis/cli_interface.py`
**Line:** 856
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        print("[2/3] Analyzing code completeness...")
        await checker.check_all_files()
>>> await checker.save_results_to_db()  # <-- ISSUE HERE
        
        # Step 3: Reporting
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0150: MISSING_TRY_EXCEPT

**File:** `backend/analysis/cli_interface.py`
**Line:** 861
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        reporter = ReportGenerator()
        print("[3/3] Generating final gap report...")
>>> report = await reporter.create_full_report()  # <-- ISSUE HERE
        
        print("\n" + "="*50)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0151: MISSING_TRY_EXCEPT

**File:** `backend/analysis/cli_interface.py`
**Line:** 869
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        print("="*50)
        
>>> await scanner.close()  # <-- ISSUE HERE
        await reporter.close()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0152: MISSING_TRY_EXCEPT

**File:** `backend/analysis/cli_interface.py`
**Line:** 870
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        await scanner.close()
>>> await reporter.close()  # <-- ISSUE HERE
        
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0153: MISSING_TRY_EXCEPT

**File:** `backend/analysis/db_schema_manager.py`
**Line:** 915
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Connects to the Railway instance."""
        try:
>>> self.pool = await asyncpg.create_pool(self.DATABASE_URL)  # <-- ISSUE HERE
            logger.info("SchemaManager connected to database.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0154: MISSING_TRY_EXCEPT

**File:** `backend/analysis/db_schema_manager.py`
**Line:** 924
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Creates all necessary tables for the analysis suite."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        async with self.pool.acquire() as conn:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0155: MISSING_TRY_EXCEPT

**File:** `backend/analysis/db_schema_manager.py`
**Line:** 971
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Drops all analysis tables - USE WITH CAUTION."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        async with self.pool.acquire() as conn:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0156: MISSING_TRY_EXCEPT

**File:** `backend/analysis/db_schema_manager.py`
**Line:** 975
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        async with self.pool.acquire() as conn:
            logger.warning("Dropping all analysis tables...")
>>> await conn.execute("DROP TABLE IF EXISTS gap_reports;")  # <-- ISSUE HERE
            await conn.execute("DROP TABLE IF EXISTS completeness_results;")
            await conn.execute("DROP TABLE IF EXISTS file_inventory;")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0157: MISSING_TRY_EXCEPT

**File:** `backend/analysis/db_schema_manager.py`
**Line:** 976
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            logger.warning("Dropping all analysis tables...")
            await conn.execute("DROP TABLE IF EXISTS gap_reports;")
>>> await conn.execute("DROP TABLE IF EXISTS completeness_results;")  # <-- ISSUE HERE
            await conn.execute("DROP TABLE IF EXISTS file_inventory;")
            logger.info("Tables dropped.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0158: MISSING_TRY_EXCEPT

**File:** `backend/analysis/db_schema_manager.py`
**Line:** 977
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            await conn.execute("DROP TABLE IF EXISTS gap_reports;")
            await conn.execute("DROP TABLE IF EXISTS completeness_results;")
>>> await conn.execute("DROP TABLE IF EXISTS file_inventory;")  # <-- ISSUE HERE
            logger.info("Tables dropped.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0159: MISSING_TRY_EXCEPT

**File:** `backend/analysis/db_schema_manager.py`
**Line:** 988
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """Stand-alone script to setup the database."""
    manager = SchemaManager()
>>> await manager.provision_tables()  # <-- ISSUE HERE
    await manager.close()

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0160: MISSING_TRY_EXCEPT

**File:** `backend/analysis/db_schema_manager.py`
**Line:** 989
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    manager = SchemaManager()
    await manager.provision_tables()
>>> await manager.close()  # <-- ISSUE HERE

if __name__ == "__main__":
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0161: MISSING_TRY_EXCEPT

**File:** `backend/analysis/dependency_mapper.py`
**Line:** 213
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Cross-references identified tables with the actual PostgreSQL schema."""
        try:
>>> conn = await asyncpg.connect(DATABASE_URL)  # <-- ISSUE HERE
            logger.info("Connected to Railway PostgreSQL for schema validation.")
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0162: MISSING_TRY_EXCEPT

**File:** `backend/analysis/dependency_mapper.py`
**Line:** 232
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                        node.metadata['db_status'] = 'verified'
            
>>> await conn.close()  # <-- ISSUE HERE
        except Exception as e:
            logger.error(f"Failed to sync with database: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0163: MISSING_TRY_EXCEPT

**File:** `backend/analysis/dependency_mapper.py`
**Line:** 445
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    
    # Database sync
>>> await master_graph.sync_with_database()  # <-- ISSUE HERE
    
    # Final report
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0165: MISSING_TRY_EXCEPT

**File:** `backend/analysis/import_resolver.py`
**Line:** 634
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        invalid_tables = []
        try:
>>> conn = await asyncpg.connect(DATABASE_URL)  # <-- ISSUE HERE
            # Query for actual tables
            rows = await conn.fetch("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0166: MISSING_TRY_EXCEPT

**File:** `backend/analysis/import_resolver.py`
**Line:** 636
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            conn = await asyncpg.connect(DATABASE_URL)
            # Query for actual tables
>>> rows = await conn.fetch("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")  # <-- ISSUE HERE
            valid_tables = {row['table_name'] for row in rows}
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0167: MISSING_TRY_EXCEPT

**File:** `backend/analysis/import_resolver.py`
**Line:** 648
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                        invalid_tables.append(table)
            
>>> await conn.close()  # <-- ISSUE HERE
        except Exception as e:
            logger.error(f"Database validation failed: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0169: MISSING_TRY_EXCEPT

**File:** `backend/analysis/endpoint_tester.py`
**Line:** 439
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Establishes a connection pool to the Railway PostgreSQL database."""
        try:
>>> self.db_pool = await asyncpg.create_pool(DATABASE_URL)  # <-- ISSUE HERE
            logger.info("Database connection pool established for integrity testing.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0170: MISSING_TRY_EXCEPT

**File:** `backend/analysis/endpoint_tester.py`
**Line:** 471
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with httpx.AsyncClient(timeout=10.0) as client:
                if method.upper() == "GET":
>>> response = await client.get(url)  # <-- ISSUE HERE
                elif method.upper() == "POST":
                    response = await client.post(url, json=payload)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0171: MISSING_TRY_EXCEPT

**File:** `backend/analysis/endpoint_tester.py`
**Line:** 473
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    response = await client.get(url)
                elif method.upper() == "POST":
>>> response = await client.post(url, json=payload)  # <-- ISSUE HERE
                else:
                    raise ValueError(f"Unsupported method: {method}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0172: MISSING_TRY_EXCEPT

**File:** `backend/analysis/endpoint_tester.py`
**Line:** 527
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    text_id = int(text_id_str)
                    async with self.db_pool.acquire() as conn:
>>> row = await conn.fetchrow("SELECT id FROM texts WHERE id = $1", text_id)  # <-- ISSUE HERE
                        return row is not None
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0173: MISSING_TRY_EXCEPT

**File:** `backend/api/endpoint_registry.py`
**Line:** 803
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        try:
>>> conn = await asyncpg.connect(DATABASE_URL)  # <-- ISSUE HERE
            
            for key, meta in self.endpoints.items():
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0174: MISSING_TRY_EXCEPT

**File:** `backend/api/endpoint_registry.py`
**Line:** 825
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                results[key] = is_valid
            
>>> await conn.close()  # <-- ISSUE HERE
            return results

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0175: MISSING_TRY_EXCEPT

**File:** `backend/api/endpoint_registry.py`
**Line:** 944
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    async with asyncpg.connect(DATABASE_URL) as conn:
>>> rows = await conn.fetch("SELECT * FROM author_profiles LIMIT 10")  # <-- ISSUE HERE
        return [dict(r) for r in rows]

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0176: MISSING_TRY_EXCEPT

**File:** `backend/api/endpoint_registry.py`
**Line:** 966
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    Convenience function to run validation on startup.
    """
>>> results = await registry.validate_all_endpoints()  # <-- ISSUE HERE
    for endpoint, valid in results.items():
        if not valid:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0177: MISSING_TRY_EXCEPT

**File:** `backend/services/analysis_engine.py`
**Line:** 589
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Establishes a connection pool to the Railway PostgreSQL instance."""
        try:
>>> self.pool = await asyncpg.create_pool(self.DATABASE_URL)  # <-- ISSUE HERE
            logger.info("Successfully connected to Railway Database.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0178: MISSING_TRY_EXCEPT

**File:** `backend/services/analysis_engine.py`
**Line:** 606
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        if translator_name not in self.ALLOWED_TRANSLATORS:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0179: MISSING_TRY_EXCEPT

**File:** `backend/services/analysis_engine.py`
**Line:** 615
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                query = "SELECT * FROM translator_profiles WHERE name = $1"
>>> record = await conn.fetchrow(query, translator_name)  # <-- ISSUE HERE
                
                if record:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0180: MISSING_TRY_EXCEPT

**File:** `backend/services/analysis_engine.py`
**Line:** 635
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0181: MISSING_TRY_EXCEPT

**File:** `backend/services/analysis_engine.py`
**Line:** 657
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0182: MISSING_TRY_EXCEPT

**File:** `backend/services/analysis_engine.py`
**Line:** 662
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                query = "SELECT content FROM source_texts WHERE work_id = $1 AND line_number = $2"
>>> content = await conn.fetchval(query, work_id, line_number)  # <-- ISSUE HERE
                return content
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0183: MISSING_TRY_EXCEPT

**File:** `backend/services/analysis_engine.py`
**Line:** 673
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0184: MISSING_TRY_EXCEPT

**File:** `backend/services/analysis_engine.py`
**Line:** 683
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    ORDER BY count DESC
                """
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
                return [dict(r) for r in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0185: MISSING_TRY_EXCEPT

**File:** `backend/services/analysis_engine.py`
**Line:** 696
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        try:
>>> stats = await self.get_text_integrity_stats()  # <-- ISSUE HERE
            authors = await self.analyze_author_distribution()
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0186: MISSING_TRY_EXCEPT

**File:** `backend/services/analysis_engine.py`
**Line:** 697
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            stats = await self.get_text_integrity_stats()
>>> authors = await self.analyze_author_distribution()  # <-- ISSUE HERE
            
            audit_report = {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0187: MISSING_TRY_EXCEPT

**File:** `backend/services/analysis_engine.py`
**Line:** 719
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
async def main():
    """Testing entry point for the analysis engine."""
>>> await logos_analyzer.connect()  # <-- ISSUE HERE
    report = await logos_analyzer.perform_full_system_audit()
    print(report)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0188: MISSING_TRY_EXCEPT

**File:** `backend/services/analysis_engine.py`
**Line:** 720
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """Testing entry point for the analysis engine."""
    await logos_analyzer.connect()
>>> report = await logos_analyzer.perform_full_system_audit()  # <-- ISSUE HERE
    print(report)
    await logos_analyzer.disconnect()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0189: MISSING_TRY_EXCEPT

**File:** `backend/services/analysis_engine.py`
**Line:** 722
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    report = await logos_analyzer.perform_full_system_audit()
    print(report)
>>> await logos_analyzer.disconnect()  # <-- ISSUE HERE

if __name__ == "__main__":
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0192: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 707
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if not self.pool:
            try:
>>> self.pool = await asyncpg.create_pool(self.dsn, min_size=1, max_size=5)  # <-- ISSUE HERE
                logger.info("Successfully connected to Railway PostgreSQL pool.")
            except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0193: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 722
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Runs EXPLAIN (FORMAT JSON) on the provided query."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
        
        explain_sql = f"EXPLAIN (FORMAT JSON, ANALYZE, BUFFERS) {sql}"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0194: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 730
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                async with conn.transaction():
                    if params:
>>> result = await conn.fetchval(explain_sql, *params)  # <-- ISSUE HERE
                    else:
                        result = await conn.fetchval(explain_sql)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0195: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 732
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                        result = await conn.fetchval(explain_sql, *params)
                    else:
>>> result = await conn.fetchval(explain_sql)  # <-- ISSUE HERE
                    
                    plan_data = json.loads(result)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0196: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 782
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        start_time = time.time()
        
>>> plan = await self.get_explain_plan(sql, params)  # <-- ISSUE HERE
        if "error" in plan:
            return {"status": "error", "message": plan["error"]}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0197: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 817
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Executes index creation SQL based on recommendations."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        for rec in recommendations:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0198: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 823
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                try:
                    async with self.pool.acquire() as conn:
>>> await conn.execute(rec)  # <-- ISSUE HERE
                        logger.info("Applied index: %s", rec)
                except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0199: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 849
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def analyze_buffer_usage(self, sql: str) -> Dict[str, int]:
        """Analyzes how much of the query hits the shared buffer cache vs disk."""
>>> plan = await self.get_explain_plan(sql)  # <-- ISSUE HERE
        buffers = {
            "shared_hit": plan.get("Shared Hit Blocks", 0),
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0200: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 862
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # This is complex in production; usually involves a temporary transaction
        # and 'SET enable_seqscan = off' to force index usage simulation.
>>> original_plan = await self.get_explain_plan(sql)  # <-- ISSUE HERE
        original_cost = original_plan.get("Total Cost", 0)
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0201: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 871
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Runs the query multiple times to get average performance metrics."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        times = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0202: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 877
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            start = time.time()
            async with self.pool.acquire() as conn:
>>> await conn.execute(sql)  # <-- ISSUE HERE
            times.append((time.time() - start) * 1000)
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0203: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 889
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves statistics for all queries from pg_stat_statements."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0204: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 900
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
                return [dict(r) for r in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0205: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 909
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Terminates backend processes running longer than the threshold."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0206: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 918
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        async with self.pool.acquire() as conn:
>>> await conn.execute(query, f"{threshold_seconds}")  # <-- ISSUE HERE
            logger.warning("Terminated queries running longer than %d seconds.", threshold_seconds)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0207: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 924
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Sets a session-level timeout for all queries in the pool."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        async with self.pool.acquire() as conn:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0208: MISSING_TRY_EXCEPT

**File:** `backend/database/query_optimizer.py`
**Line:** 927
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
        async with self.pool.acquire() as conn:
>>> await conn.execute(f"SET statement_timeout = '{seconds}s'")  # <-- ISSUE HERE
            logger.info("Statement timeout set to %d seconds.", seconds)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0209: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/service.py`
**Line:** 411
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(sql, *params)  # <-- ISSUE HERE
                total_count = await conn.fetchval(queries.GET_TEXT_COUNT, author, translator, f"%{query}%" if query else None)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0210: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/service.py`
**Line:** 412
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                rows = await conn.fetch(sql, *params)
>>> total_count = await conn.fetchval(queries.GET_TEXT_COUNT, author, translator, f"%{query}%" if query else None)  # <-- ISSUE HERE

            items = [TextMetadata(**dict(row)) for row in rows]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0211: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/service.py`
**Line:** 433
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow(queries.GET_TEXT_BY_ID, text_id)  # <-- ISSUE HERE
                
            if not row:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0212: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/service.py`
**Line:** 456
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(sql, *params)  # <-- ISSUE HERE
                total_hits = await conn.fetchval(queries.SEARCH_COUNT, ' & '.join(query.split()))

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0213: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/service.py`
**Line:** 477
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(queries.GET_ALL_AUTHORS)  # <-- ISSUE HERE
            
            profiles = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0214: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/service.py`
**Line:** 497
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(queries.GET_WORKS_BY_AUTHOR, author_name)  # <-- ISSUE HERE
            
            if not rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0215: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/service.py`
**Line:** 539
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(queries.GET_MULTIPLE_TEXTS, text_ids)  # <-- ISSUE HERE
            
            if len(rows) < len(text_ids):
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0216: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/router.py`
**Line:** 587
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
async def startup_event():
    """Lifecycle hook to initialize database connections."""
>>> await corpus_service.initialize()  # <-- ISSUE HERE

@router.on_event("shutdown")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0217: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/router.py`
**Line:** 592
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
async def shutdown_event():
    """Lifecycle hook to clean up database connections."""
>>> await corpus_service.close()  # <-- ISSUE HERE


```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0218: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/router.py`
**Line:** 642
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    logger.info(f"Fetching text detail for ID: {text_id}")
    try:
>>> return await corpus_service.get_text_by_id(text_id)  # <-- ISSUE HERE
    except HTTPException as he:
        raise he
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0219: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/router.py`
**Line:** 669
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    logger.info(f"Corpus search initiated: query='{q}'")
    try:
>>> return await corpus_service.search_corpus(q, page, page_size)  # <-- ISSUE HERE
    except Exception as e:
        logger.error(f"Search failure for query '{q}': {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0220: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/router.py`
**Line:** 690
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    logger.info("Fetching all author profiles")
    try:
>>> return await corpus_service.list_authors()  # <-- ISSUE HERE
    except Exception as e:
        logger.error(f"Error fetching authors: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0221: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/router.py`
**Line:** 713
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    logger.info(f"Fetching works for author: {author_name}")
    try:
>>> works = await corpus_service.get_works_by_author(author_name)  # <-- ISSUE HERE
        if not works:
            raise HTTPException(status_code=404, detail="No works found for the specified author.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0222: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/router.py`
**Line:** 743
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    logger.info(f"Fetching passage: {author} {work} {start_line}-{end_line}")
    try:
>>> passage = await corpus_service.get_passage(work, author, start_line, end_line)  # <-- ISSUE HERE
        if not passage:
            raise HTTPException(status_code=404, detail="Passage not found.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0223: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/router.py`
**Line:** 769
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    logger.info(f"Comparing texts: {request.text_ids}")
    try:
>>> results = await corpus_service.compare_texts(request.text_ids)  # <-- ISSUE HERE
        if not results:
            raise HTTPException(status_code=404, detail="None of the requested texts were found.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0224: MISSING_TRY_EXCEPT

**File:** `backend/api/corpus/router.py`
**Line:** 794
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        async with corpus_service.pool.acquire() as conn:
>>> await conn.execute("SELECT 1")  # <-- ISSUE HERE
        return {"status": "healthy", "database": "connected", "timestamp": "2023-10-27T12:00:00Z"}
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0225: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/ltqi_calculator.py`
**Line:** 250
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            fidelity = 0.85 # Default high fidelity for verified texts
            if source_text:
>>> fidelity = await self._calculate_fidelity(text, source_text)  # <-- ISSUE HERE

            # Weighted overall score calculation
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0226: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 475
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_all_translators(self) -> List[Dict[str, Any]]:
        """Fetch all 38 valid translator profiles from the database."""
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        query = "SELECT * FROM translator_profiles ORDER BY name ASC"
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0227: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 479
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0228: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 487
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_translator_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        """Retrieve a specific translator's profile and works."""
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        query = "SELECT * FROM translator_profiles WHERE name = $1"
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0229: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 491
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow(query, name)  # <-- ISSUE HERE
                return dict(row) if row else None
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0230: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 499
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_passage_translations(self, book: str, chapter: int) -> List[TranslationPassage]:
        """Fetch all available translations for a specific passage."""
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        query = """
            SELECT id, title, author, translator, text_content, book, chapter 
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0231: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 507
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, book, chapter)  # <-- ISSUE HERE
                return [
                    TranslationPassage(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0232: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 525
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def compare_translations(self, text_ids: List[int]) -> List[Dict[str, Any]]:
        """Fetch and compare multiple specific translation records."""
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        query = "SELECT * FROM texts WHERE id = ANY($1)"
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0233: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 529
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, text_ids)  # <-- ISSUE HERE
                results = []
                for row in rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0234: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 544
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_works_by_translator(self, name: str) -> List[Dict[str, Any]]:
        """Retrieve all works associated with a specific translator."""
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        query = "SELECT title, author, book, chapter FROM texts WHERE translator = $1 GROUP BY title, author, book, chapter"
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0235: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 548
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, name)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0236: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 556
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def calculate_ltqi_for_passage(self, passage_id: int) -> Optional[LTQIResult]:
        """Calculate LTQI for a specific passage in the database."""
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        query = "SELECT text_content FROM texts WHERE id = $1"
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0237: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 560
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow(query, passage_id)  # <-- ISSUE HERE
                if not row:
                    return None
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0238: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 572
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def search_source_texts(self, work_id: int, line_number: int) -> Optional[Dict[str, Any]]:
        """Fetch the original source text (Greek/Latin) for alignment."""
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        query = "SELECT * FROM source_texts WHERE work_id = $1 AND line_number = $2"
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0239: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 576
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow(query, work_id, line_number)  # <-- ISSUE HERE
                return dict(row) if row else None
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0240: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 584
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_style_profiles(self) -> List[Dict[str, Any]]:
        """Retrieve stylistic vectors for all translators."""
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        query = "SELECT name, style_vector FROM translator_profiles"
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0241: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 588
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
                return [{"name": r['name'], "vector": r['style_vector']} for r in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0242: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 596
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def analyze_translation_diff(self, id_a: int, id_b: int) -> Dict[str, Any]:
        """Perform a deep lexical and semantic comparison between two translations."""
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        query = "SELECT id, translator, text_content FROM texts WHERE id IN ($1, $2)"
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0243: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 600
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, id_a, id_b)  # <-- ISSUE HERE
                if len(rows) < 2:
                    raise ValueError("One or both translation IDs not found.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0244: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 621
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_translator_stats(self, name: str) -> Dict[str, Any]:
        """Get aggregate statistics for a translator's body of work."""
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        query = "SELECT text_content FROM texts WHERE translator = $1"
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0245: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 625
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, name)  # <-- ISSUE HERE
                if not rows:
                    return {"error": "No data found for translator"}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0246: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 638
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def update_translator_style_vector(self, name: str, vector: List[float]) -> bool:
        """Update a translator's style vector (Internal use for machine learning updates)."""
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        query = "UPDATE translator_profiles SET style_vector = $1 WHERE name = $2"
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0247: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 642
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> status = await conn.execute(query, vector, name)  # <-- ISSUE HERE
                return status == "UPDATE 1"
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0248: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/service.py`
**Line:** 653
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> result = await conn.fetchval("SELECT 1")  # <-- ISSUE HERE
                return result == 1
        except Exception:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0249: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 700
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
async def startup_event():
    """Initialize resources on startup."""
>>> await translation_service.connect()  # <-- ISSUE HERE
    logger.info("Translation API Router started and DB pool initialized.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0250: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 706
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
async def shutdown_event():
    """Cleanup resources on shutdown."""
>>> await translation_service.disconnect()  # <-- ISSUE HERE
    logger.info("Translation API Router shut down and DB pool closed.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0251: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 717
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info("Fetching list of all translators.")
>>> translators = await translation_service.get_all_translators()  # <-- ISSUE HERE
        if not translators:
            raise HTTPException(status_code=404, detail="No translators found in database.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0252: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 735
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info(f"Fetching works for translator: {name}")
>>> works = await translation_service.get_works_by_translator(name.value)  # <-- ISSUE HERE
        if not works:
            raise HTTPException(status_code=404, detail=f"No works found for translator {name}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0253: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 755
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info(f"Fetching translations for {book} Chapter {chapter}")
>>> translations = await translation_service.get_passage_translations(book, chapter)  # <-- ISSUE HERE
        if not translations:
            raise HTTPException(status_code=404, detail="No translations found for the specified passage.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0254: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 776
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info(f"Comparing translation IDs: {ids}")
>>> comparison_data = await translation_service.compare_translations(ids)  # <-- ISSUE HERE
        
        # Transform into response model
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0255: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 812
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info(f"Analyzing differences between ID {id_a} and {id_b}")
>>> analysis = await translation_service.analyze_translation_diff(id_a, id_b)  # <-- ISSUE HERE
        return analysis
    except ValueError as ve:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0256: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 828
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info("Fetching all stylistic profiles.")
>>> profiles = await translation_service.get_style_profiles()  # <-- ISSUE HERE
        return profiles
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0257: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 860
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info(f"Generating aggregate stats for {name}")
>>> stats = await translation_service.get_translator_stats(name.value)  # <-- ISSUE HERE
        return stats
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0258: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 869
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
async def health_check():
    """Service health check for production monitoring."""
>>> is_db_up = await translation_service.health_check()  # <-- ISSUE HERE
    if not is_db_up:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0259: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 882
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    Search across all translations for specific phrases or keywords.
    """
>>> if not translation_service.pool: await translation_service.connect()  # <-- ISSUE HERE
    sql = "SELECT * FROM texts WHERE text_content ILIKE $1 LIMIT $2"
    try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0260: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 886
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        async with translation_service.pool.acquire() as conn:
>>> rows = await conn.fetch(sql, f"%{query}%", limit)  # <-- ISSUE HERE
            return [TranslationPassage(**dict(row)) for row in rows]
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0261: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 900
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    try:
>>> profile = await translation_service.get_translator_by_name(name.value)  # <-- ISSUE HERE
        if not profile:
            raise HTTPException(status_code=404, detail="Translator profile not found")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0262: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 904
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            raise HTTPException(status_code=404, detail="Translator profile not found")
        
>>> works_data = await translation_service.get_works_by_translator(name.value)  # <-- ISSUE HERE
        works = [TranslatorWork(
            title=w['title'], 
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0263: MISSING_TRY_EXCEPT

**File:** `backend/api/translate/router.py`
**Line:** 912
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        ) for w in works_data]
        
>>> stats = await translation_service.get_translator_stats(name.value)  # <-- ISSUE HERE
        
        return TranslatorDetailResponse(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0264: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 419
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Creates and returns a database connection."""
        try:
>>> return await asyncpg.connect(self.db_url)  # <-- ISSUE HERE
        except Exception as e:
            logger.error(f"Database connection failed: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0265: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 434
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            np.ndarray: The vector or None if not found.
        """
>>> conn = await self._get_connection()  # <-- ISSUE HERE
        try:
            query = "SELECT vector FROM word_embeddings WHERE word = $1"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0266: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 437
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            query = "SELECT vector FROM word_embeddings WHERE word = $1"
>>> row = await conn.fetchrow(query, word)  # <-- ISSUE HERE
            
            if not row:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0267: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 453
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return None
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    async def get_word_analysis(self, word: str) -> WordAnalysisResponse:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0268: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 466
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        logger.info(f"Performing analysis for word: {word}")
>>> conn = await self._get_connection()  # <-- ISSUE HERE
        try:
            # 1. Get frequency from texts table
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0269: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 470
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # 1. Get frequency from texts table
            freq_query = "SELECT COUNT(*) FROM texts WHERE text_content ILIKE $1"
>>> frequency = await conn.fetchval(freq_query, f"% {word} %")  # <-- ISSUE HERE
            
            # 2. Get vector and neighbors
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0270: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 473
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            # 2. Get vector and neighbors
>>> target_vector = await self.get_word_vector(word)  # <-- ISSUE HERE
            neighbors = []
            magnitude = 0.0
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0271: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 482
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                # Fetch all vectors for neighbor calculation (limited for performance)
                all_vec_query = "SELECT word, vector FROM word_embeddings LIMIT 5000"
>>> rows = await conn.fetch(all_vec_query)  # <-- ISSUE HERE
                
                candidate_map = {}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0272: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 504
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            raise
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    async def get_word_usage(self, word: str) -> WordUsageResponse:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0273: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 517
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        logger.info(f"Analyzing usage patterns for: {word}")
>>> conn = await self._get_connection()  # <-- ISSUE HERE
        try:
            # Query usage by author and translator
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0274: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 526
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                GROUP BY author, translator
            """
>>> rows = await conn.fetch(query, f"% {word} %")  # <-- ISSUE HERE
            
            usage_by_author = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0275: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 543
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                # Get author profile for genre
                genre_query = "SELECT genres FROM author_profiles WHERE name = $1"
>>> genres = await conn.fetchval(genre_query, auth)  # <-- ISSUE HERE
                
                usage_by_author.append(UsagePattern(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0276: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 564
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            raise
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    async def compare_words(self, words: List[str]) -> ComparisonResponse:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0277: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 581
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        for word in words:
>>> vec = await self.get_word_vector(word)  # <-- ISSUE HERE
            if vec is not None:
                vectors[word] = vec
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0278: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 624
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        logger.info(f"Generating {limit} semantic clusters.")
>>> conn = await self._get_connection()  # <-- ISSUE HERE
        try:
            query = "SELECT word, vector FROM word_embeddings LIMIT $1"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0279: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 654
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            raise
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    async def get_author_usage(self, word: str, author: str) -> AuthorUsageResponse:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0280: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 668
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        logger.info(f"Fetching author usage: {author} -> {word}")
>>> conn = await self._get_connection()  # <-- ISSUE HERE
        try:
            # Get frequency in author's works
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0281: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 676
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                WHERE author = $1 AND text_content ILIKE $2
            """
>>> rows = await conn.fetch(query, author, f"% {word} %")  # <-- ISSUE HERE
            
            works = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0282: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 702
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            raise
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    async def get_etymology(self, word: str) -> EtymologyData:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0283: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 715
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        logger.info(f"Fetching etymology for: {word}")
>>> conn = await self._get_connection()  # <-- ISSUE HERE
        try:
            # Search source_texts for the word in original language
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0284: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 719
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # Search source_texts for the word in original language
            query = "SELECT work_id FROM source_texts WHERE content ILIKE $1 LIMIT 1"
>>> work_id = await conn.fetchval(query, f"% {word} %")  # <-- ISSUE HERE
            
            # Find earliest work title
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0285: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 724
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            earliest_work = "Unknown"
            if work_id:
>>> earliest_work = await conn.fetchval("SELECT title FROM texts WHERE id = $1", work_id)  # <-- ISSUE HERE

            return EtymologyData(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0286: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/service.py`
**Line:** 737
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return EtymologyData(word=word)
        finally:
>>> await conn.close()  # <-- ISSUE HERE

# filepath: backend/api/semantia/router.py
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0287: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/router.py`
**Line:** 794
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info(f"API Request: Word Analysis for '{word}'")
>>> analysis = await service.get_word_analysis(word)  # <-- ISSUE HERE
        
        if not analysis:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0288: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/router.py`
**Line:** 829
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info(f"API Request: Neighbors for '{word}' (limit: {limit})")
>>> analysis = await service.get_word_analysis(word)  # <-- ISSUE HERE
        
        if not analysis.neighbors:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0289: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/router.py`
**Line:** 857
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info(f"API Request: Semantic Clusters (limit: {limit})")
>>> clusters = await service.get_semantic_clusters(limit=limit)  # <-- ISSUE HERE
        return clusters
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0290: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/router.py`
**Line:** 881
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info(f"API Request: Comparing {len(request.words)} words.")
>>> comparison = await service.compare_words(request.words)  # <-- ISSUE HERE
        return comparison
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0291: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/router.py`
**Line:** 905
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info(f"API Request: Etymology for '{word}'")
>>> data = await service.get_etymology(word)  # <-- ISSUE HERE
        return data
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0292: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/router.py`
**Line:** 929
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info(f"API Request: Usage patterns for '{word}'")
>>> usage = await service.get_word_usage(word)  # <-- ISSUE HERE
        return usage
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0293: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/router.py`
**Line:** 954
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info(f"API Request: Author usage for '{author}' -> '{word}'")
>>> usage = await service.get_author_usage(word, author)  # <-- ISSUE HERE
        
        if usage.frequency == 0:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0294: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/router.py`
**Line:** 982
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    try:
>>> conn = await service._get_connection()  # <-- ISSUE HERE
        val = await conn.fetchval("SELECT 1")
        await conn.close()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0295: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/router.py`
**Line:** 983
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        conn = await service._get_connection()
>>> val = await conn.fetchval("SELECT 1")  # <-- ISSUE HERE
        await conn.close()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0296: MISSING_TRY_EXCEPT

**File:** `backend/api/semantia/router.py`
**Line:** 984
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        conn = await service._get_connection()
        val = await conn.fetchval("SELECT 1")
>>> await conn.close()  # <-- ISSUE HERE
        
        if val == 1:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0297: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/service.py`
**Line:** 586
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            if not self.pool:
>>> self.pool = await asyncpg.create_pool(DATABASE_URL)  # <-- ISSUE HERE
                logger.info("Successfully connected to Railway PostgreSQL for ChronosService")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0298: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/service.py`
**Line:** 623
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            TimelineResponse: Collection of events.
        """
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0299: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/service.py`
**Line:** 689
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            Dict: Analysis results.
        """
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0300: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/service.py`
**Line:** 726
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            PeriodAuthorList: List of authors.
        """
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        
        period = self.analyzer.get_period_by_id(period_id)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0301: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/service.py`
**Line:** 772
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            Dict: Vocabulary statistics.
        """
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        
        period = self.analyzer.get_period_by_id(period_id)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0302: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/service.py`
**Line:** 822
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> vocab_a = await self.get_period_vocabulary(period_a_id)  # <-- ISSUE HERE
            vocab_b = await self.get_period_vocabulary(period_b_id)
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0303: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/service.py`
**Line:** 823
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            vocab_a = await self.get_period_vocabulary(period_a_id)
>>> vocab_b = await self.get_period_vocabulary(period_b_id)  # <-- ISSUE HERE
            
            words_a = [item['word'] for item in vocab_a['top_terms']]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0304: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/service.py`
**Line:** 851
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            AuthorHistoricalContext: Contextual data.
        """
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0305: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/service.py`
**Line:** 914
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            List[Dict]: Query results.
        """
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
        try:
            if params:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0306: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 962
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    service = ChronosService()
    try:
>>> await service.connect()  # <-- ISSUE HERE
        yield service
    finally:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0307: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 965
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        yield service
    finally:
>>> await service.disconnect()  # <-- ISSUE HERE

@router.get("/periods", response_model=List[HistoricalPeriod])
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0308: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 975
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info("Handling GET /periods")
>>> periods = await service.get_all_periods()  # <-- ISSUE HERE
        return periods
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0309: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 999
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            raise HTTPException(status_code=400, detail="Start year must be before end year")
            
>>> timeline = await service.get_timeline_events(start_year, end_year)  # <-- ISSUE HERE
        return timeline
    except HTTPException:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0310: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 1021
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info("Handling GET /word-drift/%s", word)
>>> analysis = await service.get_word_drift(word)  # <-- ISSUE HERE
        if "error" in analysis:
            raise HTTPException(status_code=404, detail=analysis["error"])
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0311: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 1044
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info("Handling GET /period/%s/authors", period)
>>> authors = await service.get_authors_in_period(period)  # <-- ISSUE HERE
        return authors
    except ValueError as ve:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0312: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 1066
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info("Handling GET /period/%s/vocabulary", period)
>>> vocab = await service.get_period_vocabulary(period)  # <-- ISSUE HERE
        return vocab
    except ValueError as ve:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0313: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 1090
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    request.period_a_id, request.period_b_id)
        
>>> comparison = await service.compare_periods(request.period_a_id, request.period_b_id)  # <-- ISSUE HERE
        
        # Map service response to Pydantic model
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0314: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 1121
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info("Handling GET /author/%s/period", author)
>>> context = await service.get_author_historical_context(author)  # <-- ISSUE HERE
        return context
    except ValueError as ve:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0315: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 1143
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info("Handling GET /clusters/%s", period)
>>> clusters = await service.get_semantic_clusters_for_period(period)  # <-- ISSUE HERE
        return clusters
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0316: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 1191
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        query = "SELECT name, birth_year, death_year FROM author_profiles WHERE id = $1"
>>> res = await service.run_custom_query(query, [author_id])  # <-- ISSUE HERE
        if not res:
            raise HTTPException(status_code=404, detail="Author not found")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0317: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 1224
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            LIMIT 20
        """
>>> results = await service.run_custom_query(query, [year])  # <-- ISSUE HERE
        return results
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0318: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 1248
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            WHERE a.birth_year BETWEEN $1 AND $2
        """
>>> stats = await service.run_custom_query(query, [period.start_year, period.end_year])  # <-- ISSUE HERE
        
        return {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0319: MISSING_TRY_EXCEPT

**File:** `backend/api/chronos/router.py`
**Line:** 1287
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            WHERE t.translator = $1
        """
>>> res = await service.run_custom_query(query, [translator_name])  # <-- ISSUE HERE
        
        return {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0320: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 517
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if not self._pool:
            try:
>>> self._pool = await asyncpg.create_pool(self.DATABASE_URL, min_size=5, max_size=20)  # <-- ISSUE HERE
                logger.info("Connectome Database Pool initialized successfully.")
            except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0321: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 534
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        async with self._pool.acquire() as conn:
            # 1. Fetch Authors
>>> authors = await conn.fetch("SELECT id, name, birth_year, death_year, nationality, genres FROM author_profiles")  # <-- ISSUE HERE
            for row in authors:
                nodes.append(Node(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0322: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 549
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

            # 2. Fetch Works (Texts)
>>> texts = await conn.fetch("SELECT id, title, author, translator FROM texts")  # <-- ISSUE HERE
            for row in texts:
                nodes.append(Node(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0323: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 559
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

            # 3. Fetch Translators (Unique set from the texts table)
>>> translators = await conn.fetch("SELECT DISTINCT name, works_translated FROM translator_profiles")  # <-- ISSUE HERE
            for row in translators:
                if row['name'] in self.VALID_TRANSLATORS:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0324: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 626
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def sync_graph(self) -> GraphData:
        """Synchronizes the GraphEngine with the latest database state."""
>>> nodes = await self.fetch_all_nodes()  # <-- ISSUE HERE
        edges = await self.fetch_all_edges()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0325: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 627
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Synchronizes the GraphEngine with the latest database state."""
        nodes = await self.fetch_all_nodes()
>>> edges = await self.fetch_all_edges()  # <-- ISSUE HERE
        
        self.engine.build_from_models(nodes, edges)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0326: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 637
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Returns the complete knowledge graph."""
        if not self._last_sync:
>>> await self.sync_graph()  # <-- ISSUE HERE
            
        # Extract all from engine
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0327: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 664
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves a specific node by its ID."""
        if not self._last_sync:
>>> await self.sync_graph()  # <-- ISSUE HERE
            
        if node_id not in self.engine._graph:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0328: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 681
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves all edges connected to a specific node."""
        if not self._last_sync:
>>> await self.sync_graph()  # <-- ISSUE HERE
            
        if node_id not in self.engine._graph:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0329: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 709
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Searches for nodes by label or metadata."""
        if not self._last_sync:
>>> await self.sync_graph()  # <-- ISSUE HERE
            
        results = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0330: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 730
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Calculates PageRank for the entire graph."""
        if not self._last_sync:
>>> await self.sync_graph()  # <-- ISSUE HERE
        return self.engine.compute_pagerank()

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0331: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 736
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Finds shortest path between two nodes."""
        if not self._last_sync:
>>> await self.sync_graph()  # <-- ISSUE HERE
        return self.engine.find_shortest_path(source_id, target_id)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0332: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 742
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Extracts a subgraph around roots."""
        if not self._last_sync:
>>> await self.sync_graph()  # <-- ISSUE HERE
        return self.engine.extract_subgraph(root_ids, depth)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0333: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 748
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Detects communities in the graph."""
        if not self._last_sync:
>>> await self.sync_graph()  # <-- ISSUE HERE
        return self.engine.detect_communities()

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0334: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/service.py`
**Line:** 754
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Returns health and performance statistics for the Connectome."""
        if not self._last_sync:
>>> await self.sync_graph()  # <-- ISSUE HERE
            
        return {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0335: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 800
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """Dependency provider for the ConnectomeService."""
    if not _connectome_service._pool:
>>> await _connectome_service.initialize()  # <-- ISSUE HERE
    return _connectome_service

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0336: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 807
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """Logic to run when the API starts up."""
    logger.info("Starting up Connectome API Router...")
>>> await _connectome_service.initialize()  # <-- ISSUE HERE
    # Pre-sync the graph to warm up the cache
    try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0337: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 810
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    # Pre-sync the graph to warm up the cache
    try:
>>> await _connectome_service.sync_graph()  # <-- ISSUE HERE
        logger.info("Connectome graph synchronization complete.")
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0338: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 819
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """Logic to run when the API shuts down."""
    logger.info("Shutting down Connectome API Router...")
>>> await _connectome_service.close()  # <-- ISSUE HERE

@router.get("/status", response_model=ConnectomeStatus)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0339: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 828
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    try:
>>> stats = await service.get_system_stats()  # <-- ISSUE HERE
        return ConnectomeStatus(
            total_nodes=stats["total_nodes"],
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0340: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 848
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        logger.info("Fetching full knowledge graph...")
>>> return await service.get_full_graph()  # <-- ISSUE HERE
    except Exception as e:
        logger.error(f"Error fetching full graph: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0341: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 862
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    Includes metadata such as lifespans for authors or genres for works.
    """
>>> node = await service.get_node_by_id(node_id)  # <-- ISSUE HERE
    if not node:
        logger.warning(f"Node not found: {node_id}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0342: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 876
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    Retrieves all incoming and outgoing relationships for a specific entity.
    """
>>> edges = await service.get_edges_for_node(node_id)  # <-- ISSUE HERE
    if not edges and not await service.get_node_by_id(node_id):
        raise HTTPException(status_code=404, detail=f"Node {node_id} not found")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0343: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 891
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    try:
>>> path_result = await service.get_path(request.source_id, request.target_id)  # <-- ISSUE HERE
        if not path_result.path_found:
            raise HTTPException(status_code=404, detail="No connection found between specified nodes")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0344: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 911
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    try:
>>> results = await service.get_pagerank()  # <-- ISSUE HERE
        return results[:limit]
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0345: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 926
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    try:
>>> return await service.get_subgraph(request.root_node_ids, request.depth)  # <-- ISSUE HERE
    except Exception as e:
        logger.error(f"Subgraph extraction failed: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0346: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 937
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    try:
>>> return await service.get_communities()  # <-- ISSUE HERE
    except Exception as e:
        logger.error(f"Community detection failed: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0347: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 952
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    try:
>>> return await service.search_nodes(q, types)  # <-- ISSUE HERE
    except Exception as e:
        logger.error(f"Search failed: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0348: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 964
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    try:
>>> await service.sync_graph()  # <-- ISSUE HERE
        return {"status": "synchronization_started", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0349: MISSING_TRY_EXCEPT

**File:** `backend/api/connectome/router.py`
**Line:** 1005
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    neighbors = []
    for nid in neighbor_ids:
>>> node = await service.get_node_by_id(nid)  # <-- ISSUE HERE
        if node:
            neighbors.append(node)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0350: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 189
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if self._pool is None:
            try:
>>> self._pool = await asyncpg.create_pool(self.db_url)  # <-- ISSUE HERE
                logger.info("Database connection pool established for DiscoveryService.")
            except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0351: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 198
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_all_hypotheses(self, limit: int = 50, offset: int = 0) -> List[Hypothesis]:
        """Retrieves a paginated list of all research hypotheses from the system."""
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0352: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 215
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_hypothesis_by_id(self, hypothesis_id: uuid.UUID) -> Optional[Hypothesis]:
        """Fetches a specific hypothesis by its unique identifier."""
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0353: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 225
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def create_hypothesis(self, hypothesis: Hypothesis) -> Hypothesis:
        """Persists a new research hypothesis to the database."""
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0354: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 246
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_evidence_for_hypothesis(self, hypothesis_id: uuid.UUID) -> List[Evidence]:
        """Retrieves all supporting evidence linked to a specific hypothesis."""
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            rows = await conn.fetch(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0355: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 267
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def update_hypothesis_status(self, hypothesis_id: uuid.UUID, status: HypothesisStatus) -> bool:
        """Updates the status of a hypothesis (e.g., from DRAFT to VALIDATED)."""
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            result = await conn.execute(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0356: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 280
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        existing texts and embeddings in the database.
        """
>>> hypothesis = await self.get_hypothesis_by_id(hypothesis_id)  # <-- ISSUE HERE
        if not hypothesis:
            raise ValueError(f"Hypothesis {hypothesis_id} not found.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0357: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 284
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            raise ValueError(f"Hypothesis {hypothesis_id} not found.")

>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            # Query word_embeddings to check semantic uniqueness
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0358: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 294
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            """
            keywords = hypothesis.tags[:2] if hypothesis.tags else ["classical", "analysis"]
>>> overlap_count = await conn.fetchval(overlap_query, f"%{keywords[0]}%", f"%{keywords[1]}%")  # <-- ISSUE HERE
            
            semantic_uniqueness = 1.0 - (min(overlap_count, 100) / 100.0)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0359: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 318
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def find_related_research(self, hypothesis_id: uuid.UUID) -> List[RelatedResearch]:
        """Finds other hypotheses that share semantic or thematic links."""
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            # In production, this would use vector similarity on hypothesis descriptions
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0360: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 336
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def delete_hypothesis(self, hypothesis_id: uuid.UUID) -> bool:
        """Removes a hypothesis and its associated evidence from the system."""
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            async with conn.transaction():
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0361: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 339
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        async with pool.acquire() as conn:
            async with conn.transaction():
>>> await conn.execute("DELETE FROM discovery_evidence WHERE hypothesis_id = $1", hypothesis_id)  # <-- ISSUE HERE
                result = await conn.execute("DELETE FROM discovery_hypotheses WHERE id = $1", hypothesis_id)
                return result == "DELETE 1"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0362: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 340
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with conn.transaction():
                await conn.execute("DELETE FROM discovery_evidence WHERE hypothesis_id = $1", hypothesis_id)
>>> result = await conn.execute("DELETE FROM discovery_hypotheses WHERE id = $1", hypothesis_id)  # <-- ISSUE HERE
                return result == "DELETE 1"

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0363: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 345
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_system_stats(self) -> DiscoveryStats:
        """Aggregates high-level statistics about the discovery system."""
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            total = await conn.fetchval("SELECT count(*) FROM discovery_hypotheses")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0364: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/service.py`
**Line:** 361
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def link_evidence(self, evidence: Evidence) -> Evidence:
        """Links a new piece of evidence to an existing hypothesis."""
>>> pool = await self._get_pool()  # <-- ISSUE HERE
        async with pool.acquire() as conn:
            await conn.execute(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0365: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/hypothesis_generator.py`
**Line:** 433
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        logger.info(f"Generating hypotheses for domain: {request.domain}")
>>> conn = await asyncpg.connect(self.db_url)  # <-- ISSUE HERE
        try:
            hypotheses = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0366: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/hypothesis_generator.py`
**Line:** 439
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # Strategy 1: Linguistic Shift Analysis
            if request.author_name:
>>> h_linguistic = await self._analyze_linguistic_patterns(conn, request)  # <-- ISSUE HERE
                hypotheses.extend(h_linguistic)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0367: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/hypothesis_generator.py`
**Line:** 444
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # Strategy 2: Translator Bias Detection
            if request.translator:
>>> h_translator = await self._analyze_translator_fidelity(conn, request)  # <-- ISSUE HERE
                hypotheses.extend(h_translator)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0368: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/hypothesis_generator.py`
**Line:** 448
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

            # Strategy 3: Semantic Anomaly Detection
>>> h_semantic = await self._detect_semantic_anomalies(conn, request)  # <-- ISSUE HERE
            hypotheses.extend(h_semantic)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0369: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/hypothesis_generator.py`
**Line:** 456
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            raise
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    async def _analyze_linguistic_patterns(self, conn: asyncpg.Connection, request: DiscoveryRequest) -> List[Hypothesis]:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0370: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/hypothesis_generator.py`
**Line:** 501
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            LIMIT 5
        """
>>> rows = await conn.fetch(query, request.translator)  # <-- ISSUE HERE
        
        results = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0371: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/hypothesis_generator.py`
**Line:** 520
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Uses the 300-dimension word embeddings to find thematic outliers."""
        # Query word_embeddings
>>> embeddings = await conn.fetch("SELECT word, vector FROM word_embeddings LIMIT 100")  # <-- ISSUE HERE
        
        # In a real system, we'd perform PCA or T-SNE here
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0372: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/hypothesis_generator.py`
**Line:** 539
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        Validates a hypothesis by searching for supporting lines in the 6.6M source_texts.
        """
>>> conn = await asyncpg.connect(self.db_url)  # <-- ISSUE HERE
        try:
            # Search source_texts for relevant snippets
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0373: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/hypothesis_generator.py`
**Line:** 560
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            )
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    async def generate_research_paper(self, hypothesis: Hypothesis, evidence: List[Evidence]) -> ResearchPaper:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0374: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/hypothesis_generator.py`
**Line:** 605
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_author_context(self, author_name: str) -> Dict[str, Any]:
        """Retrieves historical context from author_profiles."""
>>> conn = await asyncpg.connect(self.db_url)  # <-- ISSUE HERE
        try:
            row = await conn.fetchrow(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0375: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/hypothesis_generator.py`
**Line:** 615
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return {}
        finally:
>>> await conn.close()  # <-- ISSUE HERE
```

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0376: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 654
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        yield service
    finally:
>>> await service.close()  # <-- ISSUE HERE

async def get_generator():
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0377: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 670
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    try:
>>> return await service.get_all_hypotheses(limit, offset)  # <-- ISSUE HERE
    except Exception as e:
        logger.error(f"Failed to list hypotheses: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0378: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 689
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    try:
>>> new_hypotheses = await generator.generate(request)  # <-- ISSUE HERE
        # Persist the newly generated hypotheses
        for h in new_hypotheses:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0379: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 692
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # Persist the newly generated hypotheses
        for h in new_hypotheses:
>>> await service.create_hypothesis(h)  # <-- ISSUE HERE
        return new_hypotheses
    except ValueError as ve:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0380: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 709
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    that supports a given hypothesis.
    """
>>> evidence = await service.get_evidence_for_hypothesis(hypothesis_id)  # <-- ISSUE HERE
    if not evidence:
        # If no evidence is stored, attempt to find some on-the-fly
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0381: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 726
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    Calculates p-values and confidence scores.
    """
>>> hypothesis = await service.get_hypothesis_by_id(hypothesis_id)  # <-- ISSUE HERE
    if not hypothesis:
        raise HTTPException(status_code=404, detail="Hypothesis not found")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0382: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 730
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        raise HTTPException(status_code=404, detail="Hypothesis not found")
    
>>> result = await generator.validate_with_evidence(hypothesis)  # <-- ISSUE HERE
    
    # Update status if valid
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0383: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 734
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    # Update status if valid
    if result.is_valid:
>>> await service.update_hypothesis_status(hypothesis_id, HypothesisStatus.VALIDATED)  # <-- ISSUE HERE
    
    return result
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0384: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 748
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    try:
>>> return await service.calculate_novelty(hypothesis_id)  # <-- ISSUE HERE
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0385: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 762
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    and its supporting evidence.
    """
>>> hypothesis = await service.get_hypothesis_by_id(hypothesis_id)  # <-- ISSUE HERE
    if not hypothesis:
        raise HTTPException(status_code=404, detail="Hypothesis not found")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0386: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 766
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        raise HTTPException(status_code=404, detail="Hypothesis not found")
    
>>> evidence = await service.get_evidence_for_hypothesis(hypothesis_id)  # <-- ISSUE HERE
    paper = await generator.generate_research_paper(hypothesis, evidence)
    return paper
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0387: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 767
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    
    evidence = await service.get_evidence_for_hypothesis(hypothesis_id)
>>> paper = await generator.generate_research_paper(hypothesis, evidence)  # <-- ISSUE HERE
    return paper

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0388: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 779
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    thematically related to the current one.
    """
>>> return await service.find_related_research(hypothesis_id)  # <-- ISSUE HERE

@router.get("/stats", response_model=DiscoveryStats)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0389: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 788
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    Returns global statistics for the LOGOS Discovery system.
    """
>>> return await service.get_system_stats()  # <-- ISSUE HERE

@router.delete("/{hypothesis_id}", status_code=status.HTTP_204_NO_CONTENT)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0390: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 798
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    Deletes a hypothesis and all associated evidence.
    """
>>> success = await service.delete_hypothesis(hypothesis_id)  # <-- ISSUE HERE
    if not success:
        raise HTTPException(status_code=404, detail="Hypothesis not found or already deleted.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0391: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 812
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    Manually updates the status of a hypothesis (e.g., for peer review workflow).
    """
>>> success = await service.update_hypothesis_status(hypothesis_id, new_status)  # <-- ISSUE HERE
    if not success:
        raise HTTPException(status_code=404, detail="Hypothesis not found.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0392: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 816
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        raise HTTPException(status_code=404, detail="Hypothesis not found.")
    
>>> updated = await service.get_hypothesis_by_id(hypothesis_id)  # <-- ISSUE HERE
    return updated

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0393: MISSING_TRY_EXCEPT

**File:** `backend/api/discovery/router.py`
**Line:** 834
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    # This would use a full-text search query in production
>>> all_h = await service.get_all_hypotheses(limit=100)  # <-- ISSUE HERE
    filtered = [
        h for h in all_h 
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0396: MISSING_TRY_EXCEPT

**File:** `backend/database/connection.py`
**Line:** 109
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if not self._pool:
            logger.info("Pool not initialized. Attempting lazy initialization...")
>>> await self.initialize()  # <-- ISSUE HERE

        connection = await self._pool.acquire()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0397: MISSING_TRY_EXCEPT

**File:** `backend/database/connection.py`
**Line:** 137
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            try:
                start_time = time.time()
>>> result = await conn.execute(query, *args, timeout=timeout)  # <-- ISSUE HERE
                duration = time.time() - start_time
                logger.info(f"Execution successful ({duration:.3f}s): {query[:100]}...")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0398: MISSING_TRY_EXCEPT

**File:** `backend/database/connection.py`
**Line:** 155
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            try:
                start_time = time.time()
>>> results = await conn.fetch(query, *args, timeout=timeout)  # <-- ISSUE HERE
                duration = time.time() - start_time
                logger.info(f"Fetch successful: {len(results)} rows returned ({duration:.3f}s)")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0399: MISSING_TRY_EXCEPT

**File:** `backend/database/connection.py`
**Line:** 169
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        async with self.get_connection() as conn:
            try:
>>> result = await conn.fetchrow(query, *args, timeout=timeout)  # <-- ISSUE HERE
                return result
            except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0400: MISSING_TRY_EXCEPT

**File:** `backend/database/connection.py`
**Line:** 181
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        async with self.get_connection() as conn:
            try:
>>> return await conn.fetchval(query, *args, column=column, timeout=timeout)  # <-- ISSUE HERE
            except Exception as e:
                logger.error(f"Fetchval failed: {e}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0401: MISSING_TRY_EXCEPT

**File:** `backend/database/connection.py`
**Line:** 197
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            start_time = time.time()
            # Simple heartbeat query
>>> val = await self.fetchval("SELECT 1")  # <-- ISSUE HERE
            latency = time.time() - start_time
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0402: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 287
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Fetches a specific text entry by its primary key."""
        query = "SELECT * FROM texts WHERE id = $1"
>>> record = await db_manager.fetchrow(query, text_id)  # <-- ISSUE HERE
        return self._format_record(record) if record else None

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0403: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 304
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            LIMIT $3 OFFSET $4
        """
>>> records = await db_manager.fetch(query, search_term, f"%{search_term}%", limit, offset)  # <-- ISSUE HERE
        return self._format_records(records)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0404: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 310
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Fetches texts written by a specific author."""
        query = "SELECT * FROM texts WHERE author = $1 ORDER BY id LIMIT $2"
>>> records = await db_manager.fetch(query, author_name, limit)  # <-- ISSUE HERE
        return self._format_records(records)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0405: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 323
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
        query = "SELECT * FROM texts WHERE translator = $1 ORDER BY id LIMIT $2"
>>> records = await db_manager.fetch(query, translator_name, limit)  # <-- ISSUE HERE
        return self._format_records(records)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0406: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 329
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Returns a list of available chapters for a specific work."""
        query = "SELECT DISTINCT chapter FROM texts WHERE title = $1 AND author = $2 ORDER BY chapter"
>>> records = await db_manager.fetch(query, title, author)  # <-- ISSUE HERE
        return [r['chapter'] for r in records]

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0407: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 339
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            ORDER BY chapter, id
        """
>>> records = await db_manager.fetch(query, title, author, translator)  # <-- ISSUE HERE
        return self._format_records(records)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0408: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 350
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves biographical data for an author."""
        query = "SELECT * FROM author_profiles WHERE name = $1"
>>> record = await db_manager.fetchrow(query, name)  # <-- ISSUE HERE
        return self._format_record(record) if record else None

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0409: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 356
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Filters authors by their country of origin."""
        query = "SELECT * FROM author_profiles WHERE nationality = $1 ORDER BY birth_year"
>>> records = await db_manager.fetch(query, nationality)  # <-- ISSUE HERE
        return self._format_records(records)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0410: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 362
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Filters authors by genre tags (e.g., 'Philosophy', 'Tragedy')."""
        query = "SELECT * FROM author_profiles WHERE $1 = ANY(genres)"
>>> records = await db_manager.fetch(query, genre)  # <-- ISSUE HERE
        return self._format_records(records)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0411: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 374
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            FROM author_profiles
        """
>>> record = await db_manager.fetchrow(query)  # <-- ISSUE HERE
        return self._format_record(record)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0412: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 385
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves data for a specific translator."""
        query = "SELECT * FROM translator_profiles WHERE name = $1"
>>> record = await db_manager.fetchrow(query, name)  # <-- ISSUE HERE
        return self._format_record(record) if record else None

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0413: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 391
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Returns all 38 approved translators."""
        query = "SELECT * FROM translator_profiles ORDER BY name ASC"
>>> records = await db_manager.fetch(query)  # <-- ISSUE HERE
        return self._format_records(records)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0414: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 397
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves the stylistic embedding vector for a translator."""
        query = "SELECT style_vector FROM translator_profiles WHERE name = $1"
>>> val = await db_manager.fetchval(query, name)  # <-- ISSUE HERE
        return val if val else None

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0415: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 419
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # Manual cosine similarity if pgvector is not installed: (A · B) / (||A|| ||B||)
        # For simplicity in this production layer, we use the dot product approach
>>> target_vector = await self.get_word_vector(word)  # <-- ISSUE HERE
        if not target_vector:
            return []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0416: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 447
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            ORDER BY line_number ASC
        """
>>> records = await db_manager.fetch(query, work_id, start_line, end_line)  # <-- ISSUE HERE
        return self._format_records(records)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0417: MISSING_TRY_EXCEPT

**File:** `backend/database/queries.py`
**Line:** 453
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Fetches a specific line of source text."""
        query = "SELECT * FROM source_texts WHERE work_id = $1 AND line_number = $2"
>>> record = await db_manager.fetchrow(query, work_id, line_number)  # <-- ISSUE HERE
        return self._format_record(record) if record else None

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0419: MISSING_TRY_EXCEPT

**File:** `backend/database/transactions.py`
**Line:** 575
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                for update in updates:
                    query = "UPDATE texts SET text_content = $1 WHERE id = $2"
>>> await tx.execute(query, update['content'], update['id'])  # <-- ISSUE HERE
                return True
            except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0420: MISSING_TRY_EXCEPT

**File:** `backend/database/migrations.py`
**Line:** 667
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        query = f"SELECT MAX(version) FROM {self.migrations_table}"
        try:
>>> version = await db_manager.fetchval(query)  # <-- ISSUE HERE
            return version if version else 0
        except Exception:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0421: MISSING_TRY_EXCEPT

**File:** `backend/database/migrations.py`
**Line:** 680
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if await self.get_current_version() == 0:
            logger.info("Initializing migration tracking...")
>>> await db_manager.execute(self._migration_list[0].up_script)  # <-- ISSUE HERE
            await db_manager.execute(
                f"INSERT INTO {self.migrations_table} (version, description) VALUES ($1, $2)",
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0422: MISSING_TRY_EXCEPT

**File:** `backend/database/migrations.py`
**Line:** 686
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            )

>>> current_version = await self.get_current_version()  # <-- ISSUE HERE
        
        for migration in self._migration_list:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0423: MISSING_TRY_EXCEPT

**File:** `backend/database/migrations.py`
**Line:** 693
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                try:
                    # Run migration script
>>> await db_manager.execute(migration.up_script)  # <-- ISSUE HERE
                    
                    # Record success
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0424: MISSING_TRY_EXCEPT

**File:** `backend/database/migrations.py`
**Line:** 709
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def rollback_last_migration(self):
        """Rolls back the most recently applied migration."""
>>> current_version = await self.get_current_version()  # <-- ISSUE HERE
        if current_version <= 1:
            logger.warning("Cannot rollback initial migration.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0425: MISSING_TRY_EXCEPT

**File:** `backend/database/migrations.py`
**Line:** 718
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            logger.info(f"Rolling back migration v{current_version}: {migration.description}")
            try:
>>> await db_manager.execute(migration.down_script)  # <-- ISSUE HERE
                await db_manager.execute(
                    f"DELETE FROM {self.migrations_table} WHERE version = $1",
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0426: MISSING_TRY_EXCEPT

**File:** `backend/database/migrations.py`
**Line:** 733
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
# Example of usage in a main entry point:
# async def startup():
>>> #     await db_manager.initialize()  # <-- ISSUE HERE
#     await migration_manager.run_migrations()
#     # System is ready for scholars.
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0427: MISSING_TRY_EXCEPT

**File:** `backend/database/migrations.py`
**Line:** 734
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
# async def startup():
#     await db_manager.initialize()
>>> #     await migration_manager.run_migrations()  # <-- ISSUE HERE
#     # System is ready for scholars.

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0428: MISSING_TRY_EXCEPT

**File:** `backend/database/utils.py`
**Line:** 807
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # Vacuum cannot run inside a transaction block in some Postgres configs
        async with db_manager.get_connection() as conn:
>>> await conn.execute("VACUUM ANALYZE")  # <-- ISSUE HERE
        logger.info("Database optimization complete.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0429: MISSING_TRY_EXCEPT

**File:** `backend/database/utils.py`
**Line:** 821
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            ORDER BY idx_scan DESC;
        """
>>> records = await db_manager.fetch(query)  # <-- ISSUE HERE
        return [dict(r) for r in records]

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0430: MISSING_TRY_EXCEPT

**File:** `backend/database/utils.py`
**Line:** 832
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            WHERE state != 'idle'
        """
>>> records = await db_manager.fetch(query)  # <-- ISSUE HERE
        return [dict(r) for r in records]

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0431: MISSING_TRY_EXCEPT

**File:** `backend/database/search_engine.py`
**Line:** 861
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        for word in words:
>>> similar = await embedding_queries.find_similar_words(word, limit=3)  # <-- ISSUE HERE
            expanded_terms.extend([s['word'] for s in similar])

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0432: MISSING_TRY_EXCEPT

**File:** `backend/database/search_engine.py`
**Line:** 870
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        results = []
        for term in expanded_terms:
>>> hits = await text_queries.search_texts(term, limit=limit // 2)  # <-- ISSUE HERE
            results.extend(hits)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0433: MISSING_TRY_EXCEPT

**File:** `backend/database/search_engine.py`
**Line:** 923
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        sql += " LIMIT 50"
        
>>> records = await db_manager.fetch(sql, *params)  # <-- ISSUE HERE
        return [dict(r) for r in records]

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0434: MISSING_TRY_EXCEPT

**File:** `backend/services/base.py`
**Line:** 85
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    
                    logger.warning(f"Retry {retries}/{max_retries} for {func.__name__} after error: {str(e)}. Waiting {delay}s...")
>>> await asyncio.sleep(delay)  # <-- ISSUE HERE
                    delay *= backoff_factor
            return await func(*args, **kwargs)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0435: MISSING_TRY_EXCEPT

**File:** `backend/services/base.py`
**Line:** 149
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            A dictionary representing the row, or None if no record found.
        """
>>> pool = await self.get_pool()  # <-- ISSUE HERE
        start_time = time.perf_counter()
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0436: MISSING_TRY_EXCEPT

**File:** `backend/services/base.py`
**Line:** 153
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with pool.acquire() as connection:
>>> row = await connection.fetchrow(query, *args)  # <-- ISSUE HERE
                execution_time = (time.perf_counter() - start_time) * 1000
                self.logger.debug(f"Query executed in {execution_time:.2f}ms: {query[:100]}...")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0437: MISSING_TRY_EXCEPT

**File:** `backend/services/base.py`
**Line:** 173
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            A list of dictionaries representing the rows.
        """
>>> pool = await self.get_pool()  # <-- ISSUE HERE
        start_time = time.perf_counter()
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0438: MISSING_TRY_EXCEPT

**File:** `backend/services/base.py`
**Line:** 177
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with pool.acquire() as connection:
>>> rows = await connection.fetch(query, *args)  # <-- ISSUE HERE
                execution_time = (time.perf_counter() - start_time) * 1000
                self.logger.info(f"Fetched {len(rows)} rows in {execution_time:.2f}ms")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0439: MISSING_TRY_EXCEPT

**File:** `backend/services/base.py`
**Line:** 196
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            True if transaction committed successfully.
        """
>>> pool = await self.get_pool()  # <-- ISSUE HERE
        try:
            async with pool.acquire() as connection:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0440: MISSING_TRY_EXCEPT

**File:** `backend/services/base.py`
**Line:** 201
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                async with connection.transaction():
                    for query, args in queries_with_args:
>>> await connection.execute(query, *args)  # <-- ISSUE HERE
            self.logger.info(f"Transaction committed successfully with {len(queries_with_args)} operations.")
            return True
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0441: MISSING_TRY_EXCEPT

**File:** `backend/services/base.py`
**Line:** 240
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        self.logger.info(f"AUDIT: {json.dumps(audit_entry)}")
        # Implementation for writing to database would go here:
>>> # await self.execute_fetch_one("INSERT INTO audit_logs ...", ...)  # <-- ISSUE HERE

    async def health_check(self) -> Dict[str, Any]:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0442: MISSING_TRY_EXCEPT

**File:** `backend/services/base.py`
**Line:** 248
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> pool = await self.get_pool()  # <-- ISSUE HERE
            async with pool.acquire() as conn:
                result = await conn.fetchval("SELECT 1")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0443: MISSING_TRY_EXCEPT

**File:** `backend/services/base.py`
**Line:** 250
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            pool = await self.get_pool()
            async with pool.acquire() as conn:
>>> result = await conn.fetchval("SELECT 1")  # <-- ISSUE HERE
                return {
                    "status": "healthy" if result == 1 else "unhealthy",
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0444: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 352
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> client = await self._get_client()  # <-- ISSUE HERE
            data = await client.get(key)
            if data:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0445: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 353
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            client = await self._get_client()
>>> data = await client.get(key)  # <-- ISSUE HERE
            if data:
                logger.debug(f"Cache HIT for key: {key}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0446: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 376
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> client = await self._get_client()  # <-- ISSUE HERE
            serialized_value = pickle.dumps(value)
            expire_time = ttl or self.default_ttl
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0447: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 379
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            serialized_value = pickle.dumps(value)
            expire_time = ttl or self.default_ttl
>>> await client.set(key, serialized_value, ex=expire_time)  # <-- ISSUE HERE
            logger.debug(f"Cache SET for key: {key} (TTL: {expire_time}s)")
            return True
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0448: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 391
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> client = await self._get_client()  # <-- ISSUE HERE
            await client.delete(key)
            logger.info(f"Cache DELETE for key: {key}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0449: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 392
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            client = await self._get_client()
>>> await client.delete(key)  # <-- ISSUE HERE
            logger.info(f"Cache DELETE for key: {key}")
            return True
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0450: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 411
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> client = await self._get_client()  # <-- ISSUE HERE
            count = 0
            async for key in client.scan_iter(f"{namespace}*"):
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0451: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 414
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            count = 0
            async for key in client.scan_iter(f"{namespace}*"):
>>> await client.delete(key)  # <-- ISSUE HERE
                count += 1
            logger.info(f"Cleared {count} keys from namespace: {namespace}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0452: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 427
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        This is the most common usage pattern in the LOGOS service layer.
        """
>>> cached_val = await self.get(key)  # <-- ISSUE HERE
        if cached_val is not None:
            return cached_val
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0453: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 434
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        new_val = await creator_func()
        if new_val is not None:
>>> await self.set(key, new_val, ttl)  # <-- ISSUE HERE
        return new_val

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0454: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 442
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> client = await self._get_client()  # <-- ISSUE HERE
            return await client.incr(key)
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0455: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 443
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            client = await self._get_client()
>>> return await client.incr(key)  # <-- ISSUE HERE
        except Exception as e:
            logger.error(f"Error incrementing key {key}: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0456: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 453
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> client = await self._get_client()  # <-- ISSUE HERE
            values = await client.mget(keys)
            result = {}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0457: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 454
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            client = await self._get_client()
>>> values = await client.mget(keys)  # <-- ISSUE HERE
            result = {}
            for i, val in enumerate(values):
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0458: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 469
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> client = await self._get_client()  # <-- ISSUE HERE
            pipe = client.pipeline()
            expire_time = ttl or self.default_ttl
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0459: MISSING_TRY_EXCEPT

**File:** `backend/services/cache.py`
**Line:** 474
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            for key, value in mapping.items():
                pipe.set(key, pickle.dumps(value), ex=expire_time)
>>> await pipe.execute()  # <-- ISSUE HERE
            return True
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0461: MISSING_TRY_EXCEPT

**File:** `backend/services/events.py`
**Line:** 610
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                
                if tasks:
>>> await asyncio.gather(*tasks, return_exceptions=True)  # <-- ISSUE HERE
                
                self._queue.task_done()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0462: MISSING_TRY_EXCEPT

**File:** `backend/services/events.py`
**Line:** 638
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            "type": "broadcast"
        }
>>> await self.publish(LogosEventType.SYSTEM_MAINTENANCE, payload, originator="admin")  # <-- ISSUE HERE
        logger.info(f"Broadcast sent to channel '{channel}': {message}")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0464: MISSING_TRY_EXCEPT

**File:** `backend/services/factory.py`
**Line:** 698
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # 2. Initialize Event Publisher
        event_publisher = EventPublisher()
>>> await event_publisher.start()  # <-- ISSUE HERE
        cls._instances["events"] = event_publisher
        logger.info("Event Publisher registered and started.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0465: MISSING_TRY_EXCEPT

**File:** `backend/services/factory.py`
**Line:** 704
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # 3. Initialize Database Pool (via BaseService)
        try:
>>> await BaseService.get_pool()  # <-- ISSUE HERE
            logger.info("Database Pool pre-warmed.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0466: MISSING_TRY_EXCEPT

**File:** `backend/services/factory.py`
**Line:** 787
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        async def fetch_from_db():
            query = "SELECT * FROM texts WHERE id = $1"
>>> return await self.execute_fetch_one(query, text_id)  # <-- ISSUE HERE

        text = await self.cache.get_or_set(cache_key, fetch_from_db, ttl=3600)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0467: MISSING_TRY_EXCEPT

**File:** `backend/services/factory.py`
**Line:** 805
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            ORDER BY line_number ASC
        """
>>> results = await self.execute_fetch_all(query, work_id, start_line, end_line)  # <-- ISSUE HERE
        return results

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0468: MISSING_TRY_EXCEPT

**File:** `backend/services/factory.py`
**Line:** 822
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # Ensure author_name uses SQL wildcards
        search_pattern = f"%{author_name}%"
>>> return await self.execute_fetch_all(query, search_pattern, limit, offset)  # <-- ISSUE HERE

    async def get_author_profile(self, author_id: int) -> Dict[str, Any]:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0469: MISSING_TRY_EXCEPT

**File:** `backend/services/factory.py`
**Line:** 829
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        query = "SELECT * FROM author_profiles WHERE id = $1"
>>> profile = await self.execute_fetch_one(query, author_id)  # <-- ISSUE HERE
        if not profile:
            raise ResourceNotFoundError("AuthorProfile", author_id)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0470: MISSING_TRY_EXCEPT

**File:** `backend/services/factory.py`
**Line:** 840
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # This uses the specific list provided in requirements
        query = "SELECT DISTINCT name FROM translator_profiles ORDER BY name ASC"
>>> rows = await self.execute_fetch_all(query)  # <-- ISSUE HERE
        return [row['name'] for row in rows]

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0471: MISSING_TRY_EXCEPT

**File:** `backend/services/factory.py`
**Line:** 873
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        # 3. Audit and Event logic
>>> await self.log_audit_trail("CREATE_TEXT", user_id, "texts", new_id)  # <-- ISSUE HERE
        await self.events.publish(
            LogosEventType.TRANSLATION_ADDED, 
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0472: MISSING_TRY_EXCEPT

**File:** `backend/services/factory.py`
**Line:** 896
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if nationality:
            query = "SELECT * FROM author_profiles WHERE nationality = $1 ORDER BY name"
>>> return await self.execute_fetch_all(query, nationality)  # <-- ISSUE HERE
        else:
            query = "SELECT * FROM author_profiles ORDER BY name"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0473: MISSING_TRY_EXCEPT

**File:** `backend/services/factory.py`
**Line:** 899
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        else:
            query = "SELECT * FROM author_profiles ORDER BY name"
>>> return await self.execute_fetch_all(query)  # <-- ISSUE HERE

    async def update_biography(self, author_id: int, biography: str, user_id: str):
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0474: MISSING_TRY_EXCEPT

**File:** `backend/services/factory.py`
**Line:** 908
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        await self.execute_transaction([(query, (biography, author_id))])
        
>>> await self.log_audit_trail("UPDATE_AUTHOR", user_id, "author_profiles", author_id)  # <-- ISSUE HERE
        await self.events.publish(
            LogosEventType.AUTHOR_PROFILE_UPDATED,
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0475: MISSING_TRY_EXCEPT

**File:** `backend/services/factory.py`
**Line:** 929
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            GROUP BY a.name
        """
>>> stats = await self.execute_fetch_one(query, author_id)  # <-- ISSUE HERE
        if not stats:
            raise ResourceNotFoundError("AuthorStats", author_id)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0476: MISSING_TRY_EXCEPT

**File:** `backend/services/factory.py`
**Line:** 956
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        query = "SELECT vector FROM word_embeddings WHERE word = $1"
>>> result = await self.execute_fetch_one(query, word)  # <-- ISSUE HERE
        
        if not result:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0477: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 77
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves the 300-dimension vector for a specific word."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
        
        query = "SELECT vector FROM word_embeddings WHERE word = $1"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0478: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 82
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow(query, word)  # <-- ISSUE HERE
                if row:
                    # Assuming vector is stored as a float array or binary
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0479: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 97
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        target_vector = await self.get_word_vector(word)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0480: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 99
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            await self.connect()

>>> target_vector = await self.get_word_vector(word)  # <-- ISSUE HERE
        if not target_vector:
            logger.warning(f"Word '{word}' not found in embeddings.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0481: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 124
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, target_vector, word, limit)  # <-- ISSUE HERE
                results = []
                for row in rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0482: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 140
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves word usage frequency across historical eras and authors."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0483: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 156
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, f"% {word} %")  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0484: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 165
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Analyzes how different translators handle specific semantic concepts."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0485: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 180
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, f"% {word} %", self.AUTHORIZED_TRANSLATORS)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0486: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 192
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        # Complex query to find original source word correlations
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0487: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 208
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, f"% {word} %")  # <-- ISSUE HERE
                nodes = []
                for row in rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0488: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 228
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves pre-calculated semantic clusters for visualization."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        # This query groups words by their vector proximity (simplified for SQL)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0489: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 244
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0490: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 253
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Handles bulk requests for vector data to minimize round-trips."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        query = "SELECT word, vector FROM word_embeddings WHERE word = ANY($1)"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0491: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 258
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, words)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0492: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 267
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Maps an author's entire vocabulary into semantic space."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0493: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 278
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow(query, author_id)  # <-- ISSUE HERE
                if not row:
                    return {}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0494: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 297
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves the style vector for a translator from translator_profiles."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        if translator_name not in self.AUTHORIZED_TRANSLATORS:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0495: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 306
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow(query, translator_name)  # <-- ISSUE HERE
                if row and row['style_vector']:
                    return list(row['style_vector'])
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0496: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 317
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Searches for words closest to an arbitrary vector point."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0497: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 332
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, query_vector, threshold)  # <-- ISSUE HERE
                return [row['word'] for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0498: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 341
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Links English words to their Greek/Latin counterparts in source_texts."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0499: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 355
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, f"% {word} %")  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0500: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 364
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Verifies database connectivity and table integrity."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
        
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0501: MISSING_TRY_EXCEPT

**File:** `backend/services/semantic_service.py`
**Line:** 368
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> await conn.execute("SELECT 1")  # <-- ISSUE HERE
                # Check row counts as per schema
                text_count = await conn.fetchval("SELECT COUNT(*) FROM texts")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0502: MISSING_TRY_EXCEPT

**File:** `backend/services/chronos_service.py`
**Line:** 73
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0503: MISSING_TRY_EXCEPT

**File:** `backend/services/chronos_service.py`
**Line:** 83
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as connection:
>>> rows = await connection.fetch(query)  # <-- ISSUE HERE
                results = []
                for row in rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0504: MISSING_TRY_EXCEPT

**File:** `backend/services/chronos_service.py`
**Line:** 106
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        # This query joins word embeddings with the text content and author dates
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0505: MISSING_TRY_EXCEPT

**File:** `backend/services/chronos_service.py`
**Line:** 124
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as connection:
>>> rows = await connection.fetch(query, word)  # <-- ISSUE HERE
                drift_data = []
                for row in rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0506: MISSING_TRY_EXCEPT

**File:** `backend/services/chronos_service.py`
**Line:** 150
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        base_query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0507: MISSING_TRY_EXCEPT

**File:** `backend/services/chronos_service.py`
**Line:** 168
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as connection:
>>> rows = await connection.fetch(base_query, *params)  # <-- ISSUE HERE
                works = []
                for row in rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0508: MISSING_TRY_EXCEPT

**File:** `backend/services/chronos_service.py`
**Line:** 189
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        periods = {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0509: MISSING_TRY_EXCEPT

**File:** `backend/services/chronos_service.py`
**Line:** 210
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    """
                    
>>> authors_count = await connection.fetchval(count_query, start, end)  # <-- ISSUE HERE
                    works_count = await connection.fetchval(work_query, start, end)
                    
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0510: MISSING_TRY_EXCEPT

**File:** `backend/services/chronos_service.py`
**Line:** 211
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    
                    authors_count = await connection.fetchval(count_query, start, end)
>>> works_count = await connection.fetchval(work_query, start, end)  # <-- ISSUE HERE
                    
                    stats[name] = {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0511: MISSING_TRY_EXCEPT

**File:** `backend/services/chronos_service.py`
**Line:** 232
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
async def main():
    service = ChronosService()
>>> await service.connect()  # <-- ISSUE HERE
    authors = await service.get_author_lifespans()
    print(f"Loaded {len(authors)} authors.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0512: MISSING_TRY_EXCEPT

**File:** `backend/services/chronos_service.py`
**Line:** 233
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    service = ChronosService()
    await service.connect()
>>> authors = await service.get_author_lifespans()  # <-- ISSUE HERE
    print(f"Loaded {len(authors)} authors.")
    await service.disconnect()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0513: MISSING_TRY_EXCEPT

**File:** `backend/services/chronos_service.py`
**Line:** 235
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    authors = await service.get_author_lifespans()
    print(f"Loaded {len(authors)} authors.")
>>> await service.disconnect()  # <-- ISSUE HERE

if __name__ == "__main__":
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0514: MISSING_TRY_EXCEPT

**File:** `backend/graph_service.py`
**Line:** 1152
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.initialize()  # <-- ISSUE HERE

        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0515: MISSING_TRY_EXCEPT

**File:** `backend/graph_service.py`
**Line:** 1175
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                # Fetching nodes
>>> rows = await conn.fetch("SELECT id, title as name, author, translator FROM texts LIMIT 100")  # <-- ISSUE HERE
                
                nodes = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0516: MISSING_TRY_EXCEPT

**File:** `backend/graph_service.py`
**Line:** 1242
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.initialize()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0517: MISSING_TRY_EXCEPT

**File:** `backend/graph_service.py`
**Line:** 1292
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.initialize()  # <-- ISSUE HERE

        # This would typically use a vector similarity search (pgvector)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0518: MISSING_TRY_EXCEPT

**File:** `backend/services/translation_service.py`
**Line:** 79
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
        
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0519: MISSING_TRY_EXCEPT

**File:** `backend/services/translation_service.py`
**Line:** 88
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    WHERE id = $1
                """
>>> row = await conn.fetchrow(query, text_id)  # <-- ISSUE HERE
                
                if not row:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0520: MISSING_TRY_EXCEPT

**File:** `backend/services/translation_service.py`
**Line:** 121
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                style_query = "SELECT style_vector FROM translator_profiles WHERE name = $1"
>>> vector_data = await conn.fetchval(style_query, translator_name)  # <-- ISSUE HERE
                
                if vector_data:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0521: MISSING_TRY_EXCEPT

**File:** `backend/services/translation_service.py`
**Line:** 188
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    ORDER BY p.birth_year ASC
                """
>>> rows = await conn.fetch(query, author_name, ALLOWED_TRANSLATORS)  # <-- ISSUE HERE
                
                timeline = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0522: MISSING_TRY_EXCEPT

**File:** `backend/services/translation_service.py`
**Line:** 214
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            results = []
            for tid in text_ids:
>>> data = await self.get_translation_by_id(tid)  # <-- ISSUE HERE
                if "error" not in data:
                    score = await self.calculate_ltqi(data['text_content'], data['translator'])
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0523: MISSING_TRY_EXCEPT

**File:** `backend/services/translation_service.py`
**Line:** 216
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                data = await self.get_translation_by_id(tid)
                if "error" not in data:
>>> score = await self.calculate_ltqi(data['text_content'], data['translator'])  # <-- ISSUE HERE
                    results.append({
                        "id": data['id'],
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0524: MISSING_TRY_EXCEPT

**File:** `backend/services/translation_service.py`
**Line:** 232
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if len(results) >= 2:
                for i in range(len(results) - 1):
>>> align = await self.get_word_alignment(results[i]['content'], results[i+1]['content'])  # <-- ISSUE HERE
                    comparisons.append({
                        "pair": [results[i]['translator'], results[i+1]['translator']],
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0525: MISSING_TRY_EXCEPT

**File:** `backend/services/translation_service.py`
**Line:** 258
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    WHERE name = $1
                """
>>> profile = await conn.fetchrow(query, name)  # <-- ISSUE HERE
                
                if not profile:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0526: MISSING_TRY_EXCEPT

**File:** `backend/services/translation_service.py`
**Line:** 291
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    ORDER BY line_number ASC
                """
>>> lines = await conn.fetch(query, work_id, line_start, line_end)  # <-- ISSUE HERE
                return [dict(line) for line in lines]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0527: MISSING_TRY_EXCEPT

**File:** `backend/services/atlas_service.py`
**Line:** 70
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0528: MISSING_TRY_EXCEPT

**File:** `backend/services/atlas_service.py`
**Line:** 92
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
                results = []
                for row in rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0529: MISSING_TRY_EXCEPT

**File:** `backend/services/atlas_service.py`
**Line:** 118
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        # Complex query to find unique works and their historical origins
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0530: MISSING_TRY_EXCEPT

**File:** `backend/services/atlas_service.py`
**Line:** 134
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
                locations = []
                for row in rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0531: MISSING_TRY_EXCEPT

**File:** `backend/services/atlas_service.py`
**Line:** 218
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE

        sql = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0532: MISSING_TRY_EXCEPT

**File:** `backend/services/atlas_service.py`
**Line:** 229
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(sql, f"%{query}%")  # <-- ISSUE HERE
                return [dict(r) for r in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0533: MISSING_TRY_EXCEPT

**File:** `backend/main.py`
**Line:** 546
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Dependency for FastAPI routes to acquire a connection from the pool."""
        if not self.pool:
>>> await self.connect()  # <-- ISSUE HERE
        async with self.pool.acquire() as connection:
            yield connection
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0534: MISSING_TRY_EXCEPT

**File:** `backend/main.py`
**Line:** 564
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    
    # Initialize DB
>>> await db_manager.connect()  # <-- ISSUE HERE
    
    # Verify Whitelist
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0535: MISSING_TRY_EXCEPT

**File:** `backend/main.py`
**Line:** 573
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    # SHUTDOWN
    logger.info("--- LOGOS SYSTEM SHUTDOWN ---")
>>> await db_manager.disconnect()  # <-- ISSUE HERE

def create_application() -> FastAPI:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0536: MISSING_TRY_EXCEPT

**File:** `backend/main.py`
**Line:** 617
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            # Check DB
>>> await db.execute("SELECT 1")  # <-- ISSUE HERE
            db_status = "healthy"
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0537: MISSING_TRY_EXCEPT

**File:** `backend/main.py`
**Line:** 709
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Validates that word embeddings have the correct 300-dimension structure."""
        try:
>>> sample = await db_conn.fetchrow("SELECT word, vector FROM word_embeddings LIMIT 1")  # <-- ISSUE HERE
            if not sample:
                return {"status": "empty", "message": "No embeddings found"}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0538: MISSING_TRY_EXCEPT

**File:** `backend/api/__init__.py`
**Line:** 172
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            try:
                async with self.db_pool.acquire() as conn:
>>> await conn.execute("SELECT 1")  # <-- ISSUE HERE
                return health_status
            except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0539: MISSING_TRY_EXCEPT

**File:** `backend/api/deps.py`
**Line:** 268
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    Usage: async with get_db_connection() as conn: ...
    """
>>> pool = await DatabaseManager.get_pool()  # <-- ISSUE HERE
    async with pool.acquire() as connection:
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0540: MISSING_TRY_EXCEPT

**File:** `backend/api/deps.py`
**Line:** 287
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        yield redis
    finally:
>>> await redis.close()  # <-- ISSUE HERE

class TranslatorRegistry:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0541: MISSING_TRY_EXCEPT

**File:** `backend/api/auth.py`
**Line:** 488
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.db_pool.acquire() as conn:
                # Check for existing user
>>> existing = await conn.fetchval("SELECT id FROM users WHERE username = $1", scholar_data['username'])  # <-- ISSUE HERE
                if existing:
                    raise HTTPException(status_code=400, detail="Username already registered.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0542: MISSING_TRY_EXCEPT

**File:** `backend/api/auth.py`
**Line:** 513
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    # This would normally use the global pool from DatabaseManager
    from .deps import DatabaseManager
>>> pool = await DatabaseManager.get_pool()  # <-- ISSUE HERE
    return ScholarAuthService(pool)

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0543: MISSING_TRY_EXCEPT

**File:** `backend/api/rate_limit.py`
**Line:** 565
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                pipe.expire(key, 60)
                
>>> results = await pipe.execute()  # <-- ISSUE HERE
                request_count = results[1]
                
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0545: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 99
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Fetches a specific text by its primary key."""
        if not self._pool:
>>> await self.connect()  # <-- ISSUE HERE
        
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0546: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 103
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self._pool.acquire() as conn:
>>> row = await conn.fetchrow("SELECT * FROM texts WHERE id = $1", text_id)  # <-- ISSUE HERE
                if row:
                    return TextRecord(**dict(row))
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0547: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 121
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

        if not self._pool:
>>> await self.connect()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0548: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 137
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves raw source text lines (Greek/Latin) for the Connectome view."""
        if not self._pool:
>>> await self.connect()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0549: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 157
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Fetches biographical data for the Chronos timeline."""
        if not self._pool:
>>> await self.connect()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0550: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 173
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves word embeddings for SEMANTIA analysis."""
        if not self._pool:
>>> await self.connect()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0551: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 192
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Performs a full-text search across the texts table."""
        if not self._pool:
>>> await self.connect()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0552: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 215
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Aggregates data for the Translation Analytics dashboard."""
        if not self._pool:
>>> await self.connect()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0553: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 236
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if not self._pool:
            try:
>>> await self.connect()  # <-- ISSUE HERE
            except:
                return False
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0554: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 242
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self._pool.acquire() as conn:
>>> result = await conn.fetchval("SELECT 1")  # <-- ISSUE HERE
                return result == 1
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0555: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 252
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # This queries a hypothetical spatial extension or metadata in texts
        if not self._pool:
>>> await self.connect()  # <-- ISSUE HERE
        
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0556: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 268
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Efficiently fetches multiple word vectors for semantic mapping."""
        if not self._pool:
>>> await self.connect()  # <-- ISSUE HERE
            
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0557: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 284
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves events for the Chronos timeline based on author life periods."""
        if not self._pool:
>>> await self.connect()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0558: MISSING_TRY_EXCEPT

**File:** `backend/database_engine.py`
**Line:** 305
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Retrieves both source and translated text for side-by-side comparison."""
        if not self._pool:
>>> await self.connect()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0560: MISSING_TRY_EXCEPT

**File:** `backend/app/db/connection.py`
**Line:** 550
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if self._pool is None:
>>> await self.connect()  # <-- ISSUE HERE
        
        async with self._pool.acquire() as connection:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0561: MISSING_TRY_EXCEPT

**File:** `backend/app/db/connection.py`
**Line:** 555
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            try:
                logger.debug(f"Executing fetch_one: {query} with args {args}")
>>> return await connection.fetchrow(query, *args)  # <-- ISSUE HERE
            except Exception as e:
                logger.error(f"Database error in fetch_one: {str(e)} | Query: {query}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0562: MISSING_TRY_EXCEPT

**File:** `backend/app/db/connection.py`
**Line:** 565
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if self._pool is None:
>>> await self.connect()  # <-- ISSUE HERE
            
        async with self._pool.acquire() as connection:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0563: MISSING_TRY_EXCEPT

**File:** `backend/app/db/connection.py`
**Line:** 570
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            try:
                logger.debug(f"Executing fetch_all: {query} with args {args}")
>>> return await connection.fetch(query, *args)  # <-- ISSUE HERE
            except Exception as e:
                logger.error(f"Database error in fetch_all: {str(e)} | Query: {query}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0564: MISSING_TRY_EXCEPT

**File:** `backend/app/db/connection.py`
**Line:** 580
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if self._pool is None:
>>> await self.connect()  # <-- ISSUE HERE
            
        async with self._pool.acquire() as connection:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0565: MISSING_TRY_EXCEPT

**File:** `backend/app/db/connection.py`
**Line:** 585
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            try:
                logger.debug(f"Executing command: {query} with args {args}")
>>> return await connection.execute(query, *args)  # <-- ISSUE HERE
            except Exception as e:
                logger.error(f"Database error in execute: {str(e)} | Query: {query}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0566: MISSING_TRY_EXCEPT

**File:** `backend/app/db/connection.py`
**Line:** 596
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> result = await self.fetch_one("SELECT 1")  # <-- ISSUE HERE
            return result is not None
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0567: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 633
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        query = "SELECT id, title, author, translator, text_content, book, chapter FROM texts WHERE id = $1"
        try:
>>> record = await db.fetch_one(query, text_id)  # <-- ISSUE HERE
            if not record:
                logger.info(f"Text with ID {text_id} not found.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0568: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 661
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> records = await db.fetch_all(query, f"%{author_name}%", limit)  # <-- ISSUE HERE
            valid_results = []
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0569: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 688
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> records = await db.fetch_all(query, work_id, start_line, end_line)  # <-- ISSUE HERE
            logger.info(f"Retrieved {len(records)} source lines for work_id {work_id}")
            return [dict(rec) for rec in records]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0570: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 701
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        query = "SELECT id, name, birth_year, death_year, nationality, genres FROM author_profiles WHERE name = $1"
        try:
>>> record = await db.fetch_one(query, name)  # <-- ISSUE HERE
            if record:
                return dict(record)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0571: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 720
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        query = "SELECT id, name, style_vector, works_translated FROM translator_profiles WHERE name = $1"
        try:
>>> record = await db.fetch_one(query, name)  # <-- ISSUE HERE
            if record:
                return dict(record)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0572: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 735
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        query = "SELECT vector FROM word_embeddings WHERE word = $1"
        try:
>>> record = await db.fetch_one(query, word)  # <-- ISSUE HERE
            if record and record['vector']:
                # Assuming vector is stored as a list/array in Postgres
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0573: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 755
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        query = "SELECT id, title, author, translator, book, chapter FROM texts WHERE translator = $1"
        try:
>>> records = await db.fetch_all(query, translator_name)  # <-- ISSUE HERE
            return [dict(rec) for rec in records]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0574: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 768
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        author_query = "SELECT name FROM author_profiles WHERE $1 = ANY(genres)"
        try:
>>> author_records = await db.fetch_all(author_query, genre)  # <-- ISSUE HERE
            author_names = [rec['name'] for rec in author_records]
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0575: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 776
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # Then, find their texts
            text_query = "SELECT id, title, author, translator FROM texts WHERE author = ANY($1)"
>>> text_records = await db.fetch_all(text_query, author_names)  # <-- ISSUE HERE
            
            # Filter by whitelist
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0576: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 795
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> records = await db.fetch_all(query, title, book, chapter)  # <-- ISSUE HERE
            results = []
            for rec in records:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0577: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 813
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        query = "SELECT word, vector FROM word_embeddings WHERE word = ANY($1)"
        try:
>>> records = await db.fetch_all(query, words)  # <-- ISSUE HERE
            return {r['word']: np.array(r['vector'], dtype=np.float32) for r in records}
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0578: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 831
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> records = await db.fetch_all(query)  # <-- ISSUE HERE
            return [dict(rec) for rec in records]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0579: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 849
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> records = await db.fetch_all(query)  # <-- ISSUE HERE
            valid_stats = []
            for rec in records:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0580: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 865
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        query = "SELECT id, title, author, translator FROM texts ORDER BY id DESC LIMIT $1"
        try:
>>> records = await db.fetch_all(query, limit)  # <-- ISSUE HERE
            return [dict(rec) for rec in records if settings.validate_translator_access(rec['translator'])]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0581: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 882
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> record = await db.fetch_one(query, work_id)  # <-- ISSUE HERE
            if record:
                return dict(record)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0582: MISSING_TRY_EXCEPT

**File:** `backend/app/db/repository.py`
**Line:** 903
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            # Note: In production, we would use tsvector for performance
>>> records = await db.fetch_all(query, f"%{search_term}%", limit)  # <-- ISSUE HERE
            return [dict(rec) for rec in records if settings.validate_translator_access(rec['translator'])]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0583: MISSING_TRY_EXCEPT

**File:** `backend/app/main.py`
**Line:** 1000
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    logger.info("Starting up LOGOS Backend...")
    try:
>>> await db.connect()  # <-- ISSUE HERE
        logger.info("Startup complete. Database connected.")
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0584: MISSING_TRY_EXCEPT

**File:** `backend/app/main.py`
**Line:** 1013
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    logger.info("Shutting down LOGOS Backend...")
>>> await db.disconnect()  # <-- ISSUE HERE
    logger.info("Shutdown complete.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0585: MISSING_TRY_EXCEPT

**File:** `backend/app/main.py`
**Line:** 1034
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    Verifies database connectivity.
    """
>>> db_healthy = await db.check_health()  # <-- ISSUE HERE
    if db_healthy:
        return {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0586: MISSING_TRY_EXCEPT

**File:** `backend/app/main.py`
**Line:** 1055
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    Enforces translator whitelist via the repository layer.
    """
>>> text = await repo.get_text_by_id(text_id)  # <-- ISSUE HERE
    if not text:
        raise HTTPException(status_code=404, detail="Text not found or access restricted.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0587: MISSING_TRY_EXCEPT

**File:** `backend/app/main.py`
**Line:** 1066
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    if author:
>>> results = await repo.search_texts_by_author(author)  # <-- ISSUE HERE
    else:
        results = await repo.search_full_text(query)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0588: MISSING_TRY_EXCEPT

**File:** `backend/app/main.py`
**Line:** 1068
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        results = await repo.search_texts_by_author(author)
    else:
>>> results = await repo.search_full_text(query)  # <-- ISSUE HERE
    
    return {"results": results, "count": len(results)}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0589: MISSING_TRY_EXCEPT

**File:** `backend/app/main.py`
**Line:** 1077
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    Retrieves the profile and works of a classical author.
    """
>>> profile = await repo.get_author_profile(name)  # <-- ISSUE HERE
    if not profile:
        raise HTTPException(status_code=404, detail="Author profile not found.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0590: MISSING_TRY_EXCEPT

**File:** `backend/app/main.py`
**Line:** 1081
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        raise HTTPException(status_code=404, detail="Author profile not found.")
    
>>> works = await repo.search_texts_by_author(name)  # <-- ISSUE HERE
    return {
        "profile": profile,
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0591: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 450
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_text_by_id(self, text_id: int) -> Dict[str, Any]:
        """Fetches a specific text entry with full metadata."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        query = "SELECT * FROM texts WHERE id = $1"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0592: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 455
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow(query, text_id)  # <-- ISSUE HERE
                if not row:
                    logger.warning(f"Text ID {text_id} not found in database.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0593: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 472
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def search_texts_by_author(self, author_name: str) -> List[Dict[str, Any]]:
        """Performs a case-insensitive search for works by a specific author."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0594: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 482
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, f"%{author_name}%")  # <-- ISSUE HERE
                logger.info(f"Retrieved {len(rows)} works for author: {author_name}")
                return [dict(row) for row in rows]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0595: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 491
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_source_text_lines(self, work_id: int, start_line: int, end_line: int) -> List[Dict[str, Any]]:
        """Retrieves original language lines for comparative philology."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0596: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 501
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, work_id, start_line, end_line)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0597: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 509
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_author_profile(self, author_id: int) -> Dict[str, Any]:
        """Fetches comprehensive biographical data for an author."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        query = "SELECT * FROM author_profiles WHERE id = $1"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0598: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 514
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow(query, author_id)  # <-- ISSUE HERE
                if row:
                    return dict(row)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0599: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 524
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_word_embedding(self, word: str) -> Optional[np.ndarray]:
        """Retrieves the 300-dimensional vector for a specific word."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        query = "SELECT vector FROM word_embeddings WHERE word = $1"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0600: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 529
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow(query, word)  # <-- ISSUE HERE
                if row and row['vector']:
                    # Assuming vector is stored as a float array or binary
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0601: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 540
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def find_similar_words(self, target_word: str, limit: int = 10) -> List[Tuple[str, float]]:
        """Calculates cosine similarity across the embedding space to find semantic relatives."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        target_vec = await self.get_word_embedding(target_word)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0602: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 542
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if not self._initialized: await self.initialize()
        
>>> target_vec = await self.get_word_embedding(target_word)  # <-- ISSUE HERE
        if target_vec is None:
            return []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0603: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 550
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                # Optimized batch retrieval for similarity calculation
>>> rows = await conn.fetch("SELECT word, vector FROM word_embeddings")  # <-- ISSUE HERE
                for row in rows:
                    if row['word'] == target_word: continue
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0604: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 570
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_bilingual_view(self, text_id: int, chapter: int) -> List[Dict[str, Any]]:
        """Constructs a side-by-side view of translation and source text."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0605: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 576
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                # 1. Get the translated content
                trans_query = "SELECT text_content, author, title FROM texts WHERE id = $1 AND chapter = $2"
>>> trans_data = await conn.fetchrow(trans_query, text_id, chapter)  # <-- ISSUE HERE
                
                if not trans_data:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0606: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 588
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    ORDER BY line_number ASC
                """
>>> source_lines = await conn.fetch(source_query, text_id)  # <-- ISSUE HERE
                
                return {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0607: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 601
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_translator_insights(self, translator_name: str) -> Dict[str, Any]:
        """Retrieves style vectors and historical context for a translator."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        if translator_name not in TranslatorRegistry.ALLOWED:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0608: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 610
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow(query, translator_name)  # <-- ISSUE HERE
                if row:
                    return dict(row)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0609: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 620
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_works_by_genre(self, genre: str) -> List[Dict[str, Any]]:
        """Filters author profiles and their associated works by genre (e.g., 'Epic Poetry')."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0610: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 630
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, genre)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0611: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 638
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_db_statistics(self) -> Dict[str, int]:
        """Returns counts for system monitoring and dashboard display."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0612: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 658
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def verify_integrity(self) -> bool:
        """Performs a health check on the database connection and schema."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0613: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 681
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def fetch_random_classical_quote(self) -> Dict[str, str]:
        """Retrieves a random snippet from the texts for the 'Daily Wisdom' feature."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        query = "SELECT text_content, author, title FROM texts ORDER BY RANDOM() LIMIT 1"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0614: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 686
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow(query)  # <-- ISSUE HERE
                if row:
                    content = row['text_content'][:280] + "..." if len(row['text_content']) > 280 else row['text_content']
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0615: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 701
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def search_full_text(self, keyword: str) -> List[Dict[str, Any]]:
        """Performs a deep full-text search across all translations."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        # Using PostgreSQL's full-text search capabilities
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0616: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 713
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, keyword)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0617: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 721
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def update_author_metadata(self, author_id: int, updates: Dict[str, Any]) -> bool:
        """Updates author profile information with strict validation."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        # Build dynamic query safely
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0618: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 736
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> status = await conn.execute(query, author_id, *values)  # <-- ISSUE HERE
                logger.info(f"Updated author {author_id}: {status}")
                return status == "UPDATE 1"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0619: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 745
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_translator_workload_distribution(self) -> List[Dict[str, Any]]:
        """Analytical query to see which translators have the most entries in the system."""
>>> if not self._initialized: await self.initialize()  # <-- ISSUE HERE
        
        query = """
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0620: MISSING_TRY_EXCEPT

**File:** `backend/database_service.py`
**Line:** 755
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0621: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 654
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            try:
                logger.info(f"Attempting to connect to database (Attempt {retry_count + 1})...")
>>> self.conn = await asyncpg.connect(self.db_url)  # <-- ISSUE HERE
                logger.info("Successfully connected to Railway PostgreSQL.")
                return
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0622: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 660
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                retry_count += 1
                logger.warning(f"Connection attempt {retry_count} failed: {e}")
>>> await asyncio.sleep(2 ** retry_count)  # <-- ISSUE HERE
        
        raise ConnectionError("Failed to connect to database after maximum retries.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0623: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 717
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        all_files = sorted(list(self.migrations_dir.glob("*.sql")))
>>> applied = await self.get_applied_migrations()  # <-- ISSUE HERE
        
        pending = [f for f in all_files if f.name not in applied]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0624: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 772
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            Dictionary containing summary statistics of the run.
        """
>>> await self.connect()  # <-- ISSUE HERE
        await self.ensure_migration_table()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0625: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 773
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        await self.connect()
>>> await self.ensure_migration_table()  # <-- ISSUE HERE
        
        pending = await self.get_pending_migrations()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0626: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 775
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        await self.ensure_migration_table()
        
>>> pending = await self.get_pending_migrations()  # <-- ISSUE HERE
        results = {
            "total": len(pending),
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0627: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 785
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if not pending:
            logger.info("No pending migrations to apply. System is up to date.")
>>> await self.disconnect()  # <-- ISSUE HERE
            return results

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0628: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 789
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

        for migration_file in pending:
>>> success = await self.execute_migration(migration_file)  # <-- ISSUE HERE
            if success:
                results["applied"] += 1
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0629: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 797
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                break # Stop execution on first failure to maintain integrity

>>> await self.disconnect()  # <-- ISSUE HERE
        logger.info(f"Migration run complete. Applied: {results['applied']}, Failed: {results['failed']}")
        return results
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0630: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 806
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        Ensures that the $10M production system is ready for scholar traffic.
        """
>>> await self.connect()  # <-- ISSUE HERE
        required_tables = ['users', 'texts', 'source_texts', 'annotations', 'bookmarks']
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0631: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 820
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                logger.error(f"Health Check Failed: Table '{table}' is missing!")
        
>>> await self.disconnect()  # <-- ISSUE HERE

    async def rollback_last_migration(self) -> bool:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0632: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 829
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        logger.warning("Rollback requested. Searching for last applied migration...")
>>> await self.connect()  # <-- ISSUE HERE
        last = await self.conn.fetchrow(
            "SELECT filename FROM schema_migrations WHERE success = TRUE ORDER BY id DESC LIMIT 1"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0633: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 836
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        if not last:
            logger.info("No migrations to rollback.")
>>> await self.disconnect()  # <-- ISSUE HERE
            return False
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0634: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 841
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.warning(f"Rollback logic for {last['filename']} would be executed here.")
        # In a full implementation, you'd look for filename.replace('.sql', '.rollback.sql')
>>> await self.disconnect()  # <-- ISSUE HERE
        return True

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0635: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 853
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def get_database_statistics(self) -> Dict[str, Any]:
        """Gathers database size and performance metrics."""
>>> await self.connect()  # <-- ISSUE HERE
        stats = {}
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0636: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 864
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            logger.error(f"Failed to fetch DB stats: {e}")
        finally:
>>> await self.disconnect()  # <-- ISSUE HERE
        return stats

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0637: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 870
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Pings the database to ensure connectivity."""
        try:
>>> await self.connect()  # <-- ISSUE HERE
            val = await self.conn.fetchval("SELECT 1")
            await self.disconnect()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0638: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 872
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            await self.connect()
            val = await self.conn.fetchval("SELECT 1")
>>> await self.disconnect()  # <-- ISSUE HERE
            return val == 1
        except Exception:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0639: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 905
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        # 1. Run Migrations
>>> results = await manager.run_all()  # <-- ISSUE HERE
        print(manager.generate_migration_report(results))
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0640: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 910
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # 2. Verify State
        if results['failed'] == 0:
>>> await manager.verify_database_state()  # <-- ISSUE HERE
            
            # 3. Get Stats
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0641: MISSING_TRY_EXCEPT

**File:** `backend/migrations/run_migrations.py`
**Line:** 913
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            # 3. Get Stats
>>> stats = await manager.get_database_statistics()  # <-- ISSUE HERE
            logger.info(f"Database Size: {stats.get('db_size')}")
        else:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0644: MISSING_TRY_EXCEPT

**File:** `scripts/production_validator.py`
**Line:** 546
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                if retry_count == max_retries:
                    raise ConnectionError("Could not connect to production database after 5 attempts.")
>>> await asyncio.sleep(2 ** retry_count)  # <-- ISSUE HERE

    async def disconnect(self) -> None:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0645: MISSING_TRY_EXCEPT

**File:** `scripts/production_validator.py`
**Line:** 608
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                # Check 'texts' table
>>> text_translators = await conn.fetch("SELECT DISTINCT translator FROM texts")  # <-- ISSUE HERE
                # Check 'translator_profiles' table
                profile_translators = await conn.fetch("SELECT name FROM translator_profiles")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0646: MISSING_TRY_EXCEPT

**File:** `scripts/production_validator.py`
**Line:** 610
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                text_translators = await conn.fetch("SELECT DISTINCT translator FROM texts")
                # Check 'translator_profiles' table
>>> profile_translators = await conn.fetch("SELECT name FROM translator_profiles")  # <-- ISSUE HERE
                
                all_found = {row['translator'] for row in text_translators if row['translator']}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0647: MISSING_TRY_EXCEPT

**File:** `scripts/production_validator.py`
**Line:** 635
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> sample = await conn.fetchrow("SELECT vector FROM word_embeddings LIMIT 1")  # <-- ISSUE HERE
                if not sample:
                    logger.warning("No embeddings found in word_embeddings table.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0648: MISSING_TRY_EXCEPT

**File:** `scripts/production_validator.py`
**Line:** 689
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        logger.info("=== LOGOS PRODUCTION SYSTEM AUDIT STARTING ===")
>>> await self.connect()  # <-- ISSUE HERE
        
        results = [
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0649: MISSING_TRY_EXCEPT

**File:** `scripts/production_validator.py`
**Line:** 695
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            await self.validate_translators(),
            await self.validate_embeddings(),
>>> await self.check_data_integrity()  # <-- ISSUE HERE
        ]
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0650: MISSING_TRY_EXCEPT

**File:** `scripts/production_validator.py`
**Line:** 698
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        ]
        
>>> await self.disconnect()  # <-- ISSUE HERE
        
        success = all(results)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0651: MISSING_TRY_EXCEPT

**File:** `scripts/production_validator.py`
**Line:** 713
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        logger.info(f"Generating deployment report to {output_path}...")
>>> await self.connect()  # <-- ISSUE HERE
        
        report = {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0652: MISSING_TRY_EXCEPT

**File:** `scripts/production_validator.py`
**Line:** 722
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                "translators": await self.validate_translators(),
                "embeddings": await self.validate_embeddings(),
>>> "integrity": await self.check_data_integrity()  # <-- ISSUE HERE
            },
            "timestamp": "2023-10-27T12:00:00Z" # In real use, use datetime.now()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0653: MISSING_TRY_EXCEPT

**File:** `scripts/production_validator.py`
**Line:** 730
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            json.dump(report, f, indent=4)
        
>>> await self.disconnect()  # <-- ISSUE HERE
        logger.info("Report generation complete.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0654: MISSING_TRY_EXCEPT

**File:** `scripts/production_validator.py`
**Line:** 770
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> top_works = await conn.fetch("SELECT id, title FROM texts LIMIT 100")  # <-- ISSUE HERE
                for work in top_works:
                    # Simulate Redis SET
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0655: MISSING_TRY_EXCEPT

**File:** `scripts/production_validator.py`
**Line:** 810
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                start_time = asyncio.get_event_loop().time()
>>> await conn.fetch(query)  # <-- ISSUE HERE
                duration = asyncio.get_event_loop().time() - start_time
                logger.info(f"Stress test query took {duration:.4f} seconds.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0656: MISSING_TRY_EXCEPT

**File:** `backend/infrastructure/health.py`
**Line:** 916
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        Compiles all health metrics into a single response.
        """
>>> db_status = await self.check_database(db)  # <-- ISSUE HERE
        uptime = self.get_uptime()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0657: MISSING_TRY_EXCEPT

**File:** `backend/infrastructure/health.py`
**Line:** 943
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # In a real FastAPI app, the DB session is injected via Depends
        # For this file, we assume the logic
>>> status = await monitor.get_full_status(db)  # <-- ISSUE HERE
        if status["status"] != "healthy":
            raise HTTPException(status_code=503, detail=status)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0658: MISSING_TRY_EXCEPT

**File:** `docs/SETUP.md`
**Line:** 269
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    print(f"Connecting to: {db_url}")
    try:
>>> conn = await asyncpg.connect(db_url)  # <-- ISSUE HERE
        row = await conn.fetchrow('SELECT count(*) FROM texts')
        print(f"Connection successful! Row count in 'texts': {row[0]}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0659: MISSING_TRY_EXCEPT

**File:** `docs/SETUP.md`
**Line:** 272
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        row = await conn.fetchrow('SELECT count(*) FROM texts')
        print(f"Connection successful! Row count in 'texts': {row[0]}")
>>> await conn.close()  # <-- ISSUE HERE
    except Exception as e:
        print(f"Connection failed: {e}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0660: MISSING_TRY_EXCEPT

**File:** `docs/API.md`
**Line:** 447
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """
    try:
>>> conn = await asyncpg.connect(DATABASE_URL)  # <-- ISSUE HERE
        return conn
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0662: MISSING_TRY_EXCEPT

**File:** `docs/API.md`
**Line:** 483
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        logger.info(f"Executing query: {query} with params: {params}")
>>> rows = await conn.fetch(query, *params)  # <-- ISSUE HERE
        
        return [dict(row) for row in rows]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0663: MISSING_TRY_EXCEPT

**File:** `docs/API.md`
**Line:** 490
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        raise HTTPException(status_code=500, detail="Search operation failed")
    finally:
>>> await conn.close()  # <-- ISSUE HERE
```

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0664: MISSING_TRY_EXCEPT

**File:** `server/app.py`
**Line:** 855
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Initializes the connection pool."""
        try:
>>> self.pool = await asyncpg.create_pool(self.dsn, min_size=5, max_size=20)  # <-- ISSUE HERE
            logger.info("Successfully established connection pool to Railway.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0665: MISSING_TRY_EXCEPT

**File:** `server/app.py`
**Line:** 901
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                
                query += f" LIMIT {limit}"
>>> rows = await conn.fetch(query, *args)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
            except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0666: MISSING_TRY_EXCEPT

**File:** `server/app.py`
**Line:** 912
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
@app.on_event("startup")
async def startup():
>>> await db.connect()  # <-- ISSUE HERE

@app.on_event("shutdown")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0667: MISSING_TRY_EXCEPT

**File:** `server/app.py`
**Line:** 916
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
@app.on_event("shutdown")
async def shutdown():
>>> await db.disconnect()  # <-- ISSUE HERE

# --- API Routes ---
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0668: MISSING_TRY_EXCEPT

**File:** `server/app.py`
**Line:** 937
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    logger.info(f"Text search initiated: author={author}, translator={translator}")
    try:
>>> results = await db.fetch_texts(author, translator, limit)  # <-- ISSUE HERE
        return results
    except HTTPException as he:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0669: MISSING_TRY_EXCEPT

**File:** `server/app.py`
**Line:** 952
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    
    async with db.pool.acquire() as conn:
>>> rows = await conn.fetch("SELECT id, name, birth_year, death_year, nationality, genres FROM author_profiles ORDER BY name ASC")  # <-- ISSUE HERE
        return [dict(row) for row in rows]

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0670: MISSING_TRY_EXCEPT

**File:** `verification/pass1/contract_validator.py`
**Line:** 102
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            logger.info("Connecting to Railway PostgreSQL for schema verification...")
>>> self.db_pool = await asyncpg.create_pool(DATABASE_URL)  # <-- ISSUE HERE
            async with self.db_pool.acquire() as conn:
                version = await conn.fetchval("SELECT version()")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0671: MISSING_TRY_EXCEPT

**File:** `verification/pass1/contract_validator.py`
**Line:** 255
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info("=== Starting LOGOS API Contract Validation ===")
        
>>> await self.initialize_database()  # <-- ISSUE HERE
        
        self.scan_backend_endpoints()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0672: MISSING_TRY_EXCEPT

**File:** `verification/pass1/contract_validator.py`
**Line:** 284
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

        # Deep Database Schema Validation
>>> await self._validate_database_alignment(results)  # <-- ISSUE HERE

        await self.close_database()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0673: MISSING_TRY_EXCEPT

**File:** `verification/pass1/contract_validator.py`
**Line:** 286
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        await self._validate_database_alignment(results)

>>> await self.close_database()  # <-- ISSUE HERE
        logger.info("=== Validation Complete ===")
        return results
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0674: MISSING_TRY_EXCEPT

**File:** `verification/pass1/contract_validator.py`
**Line:** 329
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        async with self.db_pool.acquire() as conn:
            # Check 'texts' table columns
>>> columns = await conn.fetch("SELECT column_name FROM information_schema.columns WHERE table_name = 'texts'")  # <-- ISSUE HERE
            text_cols = {row['column_name'] for row in columns}
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0675: MISSING_TRY_EXCEPT

**File:** `verification/pass1/contract_validator.py`
**Line:** 342
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

            # Check 'translator_profiles' table
>>> columns = await conn.fetch("SELECT column_name FROM information_schema.columns WHERE table_name = 'translator_profiles'")  # <-- ISSUE HERE
            trans_cols = {row['column_name'] for row in columns}
            required_trans_cols = {'id', 'name', 'style_vector', 'works_translated'}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0676: MISSING_TRY_EXCEPT

**File:** `verification/pass1/contract_reporter.py`
**Line:** 883
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        validator = ContractValidator(BACKEND_DIR, FRONTEND_DIR)
        try:
>>> results = await validator.validate_all()  # <-- ISSUE HERE
            
            reporter = ContractReporter()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0677: MISSING_TRY_EXCEPT

**File:** `verification/pass1/python_deps_validator.py`
**Line:** 78
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            logger.info("Connecting to LOGOS production database...")
>>> self.db_connection = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
            logger.info("Database connection established successfully.")
            return True
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0678: MISSING_TRY_EXCEPT

**File:** `verification/pass1/python_deps_validator.py`
**Line:** 193
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        # 1. Database Integrity Check
>>> db_init = await self.initialize_database()  # <-- ISSUE HERE
        db_violations = []
        if db_init:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0679: MISSING_TRY_EXCEPT

**File:** `verification/pass1/python_deps_validator.py`
**Line:** 196
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        db_violations = []
        if db_init:
>>> db_violations = await self.verify_translator_table_integrity()  # <-- ISSUE HERE
        
        # 2. File Scanning and Import Extraction
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0680: MISSING_TRY_EXCEPT

**File:** `verification/pass1/python_deps_validator.py`
**Line:** 219
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            code_violations.extend(violations)

>>> await self.close_database()  # <-- ISSUE HERE
        
        report = {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0681: MISSING_TRY_EXCEPT

**File:** `verification/pass1/npm_deps_validator.ts`
**Line:** 555
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        self.check_python_version()
        self.check_library_versions()
>>> await self.check_postgres_version()  # <-- ISSUE HERE
        
        self.log_results()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0682: MISSING_TRY_EXCEPT

**File:** `verification/pass1/npm_deps_validator.ts`
**Line:** 604
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Connects to the DB and verifies the PostgreSQL version."""
        try:
>>> conn = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
            server_version = conn.get_server_version()
            # server_version is a named tuple: ServerVersion(major=15, minor=3, patch=0)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0683: MISSING_TRY_EXCEPT

**File:** `verification/pass1/npm_deps_validator.ts`
**Line:** 618
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                self.results["database"] = {"status": "PASS", "current": ver_str}
            
>>> await conn.close()  # <-- ISSUE HERE
        except Exception as e:
            logger.error(f"Failed to check database version: {e}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0684: MISSING_TRY_EXCEPT

**File:** `verification/pass1/security_scanner.py`
**Line:** 680
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        self.scan_files_for_secrets()
        self.scan_for_illegal_content()
>>> await self.audit_database_permissions()  # <-- ISSUE HERE
        await self.verify_data_integrity()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0685: MISSING_TRY_EXCEPT

**File:** `verification/pass1/security_scanner.py`
**Line:** 681
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        self.scan_for_illegal_content()
        await self.audit_database_permissions()
>>> await self.verify_data_integrity()  # <-- ISSUE HERE
        
        logger.info(f"Security audit complete. Found {len(self.findings)} issues.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0686: MISSING_TRY_EXCEPT

**File:** `verification/pass1/security_scanner.py`
**Line:** 738
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info("Auditing database user permissions...")
        try:
>>> conn = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
            # Check if current user is superuser
            is_superuser = await conn.fetchval("SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0687: MISSING_TRY_EXCEPT

**File:** `verification/pass1/security_scanner.py`
**Line:** 740
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            conn = await asyncpg.connect(self.DATABASE_URL)
            # Check if current user is superuser
>>> is_superuser = await conn.fetchval("SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER")  # <-- ISSUE HERE
            if is_superuser:
                self.findings.append({
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0688: MISSING_TRY_EXCEPT

**File:** `verification/pass1/security_scanner.py`
**Line:** 748
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                })
                logger.warning("Database connection is using superuser privileges.")
>>> await conn.close()  # <-- ISSUE HERE
        except Exception as e:
            logger.error(f"DB permission audit failed: {e}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0689: MISSING_TRY_EXCEPT

**File:** `verification/pass1/security_scanner.py`
**Line:** 756
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info("Verifying translator table integrity...")
        try:
>>> conn = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
            # Ensure the approved list matches the DB
            rows = await conn.fetch("SELECT name FROM translator_profiles")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0690: MISSING_TRY_EXCEPT

**File:** `verification/pass1/security_scanner.py`
**Line:** 758
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            conn = await asyncpg.connect(self.DATABASE_URL)
            # Ensure the approved list matches the DB
>>> rows = await conn.fetch("SELECT name FROM translator_profiles")  # <-- ISSUE HERE
            db_names = {row['name'] for row in rows}
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0691: MISSING_TRY_EXCEPT

**File:** `verification/pass1/security_scanner.py`
**Line:** 770
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    logger.critical(f"DATABASE CORRUPTION: Forbidden entity '{forbidden}' detected in production!")
            
>>> await conn.close()  # <-- ISSUE HERE
        except Exception as e:
            logger.error(f"Data integrity check failed: {e}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0692: MISSING_TRY_EXCEPT

**File:** `verification/pass1/security_scanner.py`
**Line:** 796
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    # 1. Python Validator
    py_val = PythonDependencyValidator(project_root)
>>> py_report = await py_val.run_full_validation()  # <-- ISSUE HERE
    
    # 2. Version Checker
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0693: MISSING_TRY_EXCEPT

**File:** `verification/pass1/security_scanner.py`
**Line:** 800
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    # 2. Version Checker
    ver_checker = VersionChecker()
>>> await ver_checker.check_all()  # <-- ISSUE HERE
    
    # 3. Security Scanner
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0694: MISSING_TRY_EXCEPT

**File:** `verification/pass1/security_scanner.py`
**Line:** 804
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    # 3. Security Scanner
    sec_scanner = SecurityScanner(project_root)
>>> await sec_scanner.run_security_audit()  # <-- ISSUE HERE
    print(sec_scanner.generate_security_report())

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0695: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/syntax_validator.py`
**Line:** 79
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            logger.info("Connecting to Railway PostgreSQL...")
>>> self.pool = await asyncpg.create_pool(self.DATABASE_URL)  # <-- ISSUE HERE
            logger.info("Database connection pool established successfully.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0696: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/syntax_validator.py`
**Line:** 131
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # Phase 3: Integrity Check against Database
            # We check if the file mentions any translators not in our production DB
>>> db_check_status = await self._verify_translators_in_db(visitor.detected_translators)  # <-- ISSUE HERE
            if not db_check_status:
                errors.append({"line": 0, "msg": "File contains translators not present in production database."})
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0697: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/syntax_validator.py`
**Line:** 163
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        if not self.pool:
>>> await self.initialize_db_connection()  # <-- ISSUE HERE

        async with self.pool.acquire() as conn:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0698: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/syntax_validator.py`
**Line:** 168
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            try:
                # Query the actual production table: translator_profiles
>>> rows = await conn.fetch("SELECT name FROM translator_profiles")  # <-- ISSUE HERE
                db_translators = {row['name'] for row in rows}
                
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0699: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/syntax_validator.py`
**Line:** 198
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        tasks = [self.validate_file(f) for f in all_files]
>>> results = await asyncio.gather(*tasks)  # <-- ISSUE HERE
        
        # Log summary to database
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0700: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/syntax_validator.py`
**Line:** 201
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        # Log summary to database
>>> await self._log_results_to_db(results)  # <-- ISSUE HERE
        
        return results
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0701: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/syntax_validator.py`
**Line:** 224
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    
                    # Implementation of actual DB insert (logic only, assuming schema)
>>> # await conn.execute("INSERT INTO validation_logs ...")  # <-- ISSUE HERE
            except Exception as e:
                logger.error(f"Failed to log results to database: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0703: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/import_checker.py`
**Line:** 360
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                if file.endswith('.py'):
                    full_path = os.path.join(root, file)
>>> await self._analyze_file_imports(full_path)  # <-- ISSUE HERE
        
        await self._verify_against_production_db()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0704: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/import_checker.py`
**Line:** 362
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    await self._analyze_file_imports(full_path)
        
>>> await self._verify_against_production_db()  # <-- ISSUE HERE
        return self.violations

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0706: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/import_checker.py`
**Line:** 428
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> conn = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
            # Query the 'texts' table to see if we have any hardcoded references 
            # in the code that don't exist in the database.
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0707: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/import_checker.py`
**Line:** 431
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # Query the 'texts' table to see if we have any hardcoded references 
            # in the code that don't exist in the database.
>>> db_texts = await conn.fetch("SELECT DISTINCT title FROM texts")  # <-- ISSUE HERE
            valid_titles = {row['title'].lower().replace(' ', '_') for row in db_texts}
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0708: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/import_checker.py`
**Line:** 437
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # to ensure we aren't importing modules for non-existent texts.
            logger.info(f"Verified imports against {len(valid_titles)} production text titles.")
>>> await conn.close()  # <-- ISSUE HERE
        except Exception as e:
            logger.error(f"DB verification failed in ImportChecker: {e}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0709: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/fix_suggester.py`
**Line:** 602
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        if "copyrighted translator" in msg:
>>> return await self._suggest_translator_replacement(violation)  # <-- ISSUE HERE
        elif "pass statement" in msg:
            return "REPLACE 'pass' with a concrete implementation or a logging statement. Stubs are forbidden."
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0710: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/fix_suggester.py`
**Line:** 628
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # Verify replacement availability in DB
        try:
>>> conn = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
            row = await conn.fetchrow(
                "SELECT name FROM translator_profiles WHERE name = $1", 
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0711: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/fix_suggester.py`
**Line:** 633
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                replacement
            )
>>> await conn.close()  # <-- ISSUE HERE
            
            if row:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0712: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/fix_suggester.py`
**Line:** 662
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        suggestions = []
        for v in violations:
>>> fix = await self.suggest_fix(v)  # <-- ISSUE HERE
            suggestions.append(f"FILE: {v.get('file')} LINE: {v.get('line')} -> {fix}")
        return suggestions
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0713: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/fix_suggester.py`
**Line:** 675
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    # 1. Syntax Validation
    validator = LogosSyntaxValidator(project_path)
>>> await validator.initialize_db_connection()  # <-- ISSUE HERE
    syntax_results = await validator.run_full_validation()
    
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0714: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/fix_suggester.py`
**Line:** 676
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    validator = LogosSyntaxValidator(project_path)
    await validator.initialize_db_connection()
>>> syntax_results = await validator.run_full_validation()  # <-- ISSUE HERE
    
    # 2. Import Checking
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0715: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/fix_suggester.py`
**Line:** 680
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    # 2. Import Checking
    import_checker = LogosImportChecker(project_path)
>>> import_violations = await import_checker.run_check()  # <-- ISSUE HERE
    
    # 3. Circular Dependency Detection
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0716: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/fix_suggester.py`
**Line:** 694
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    all_violations.extend(import_violations)
    
>>> fixes = await suggester.process_report(all_violations)  # <-- ISSUE HERE
    
    for fix in fixes:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0717: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass1/fix_suggester.py`
**Line:** 699
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        print(fix)
        
>>> await validator.close_db_connection()  # <-- ISSUE HERE

if __name__ == "__main__":
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0718: MISSING_TRY_EXCEPT

**File:** `verification/pass2/placeholder_scanner.py`
**Line:** 73
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            logger.info("Connecting to Railway PostgreSQL database...")
>>> self.db_connection = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
            logger.info("Database connection established successfully.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0719: MISSING_TRY_EXCEPT

**File:** `verification/pass2/placeholder_scanner.py`
**Line:** 201
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

        logger.info(f"Scan complete. Total violations found: {total_violations}")
>>> await self.log_results_to_db()  # <-- ISSUE HERE
        return total_violations

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0720: MISSING_TRY_EXCEPT

**File:** `verification/pass2/placeholder_scanner.py`
**Line:** 209
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.db_connection:
>>> await self.connect_db()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0721: MISSING_TRY_EXCEPT

**File:** `verification/pass2/placeholder_scanner.py`
**Line:** 261
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.db_connection:
>>> await self.connect_db()  # <-- ISSUE HERE
            
        logger.info("Validating database records for forbidden translators...")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0722: MISSING_TRY_EXCEPT

**File:** `verification/pass2/placeholder_scanner.py`
**Line:** 289
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.db_connection:
>>> await self.connect_db()  # <-- ISSUE HERE
            
        metrics = {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0723: MISSING_TRY_EXCEPT

**File:** `verification/pass2/placeholder_scanner.py`
**Line:** 335
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    scanner = PlaceholderScanner(target_directory=".")
    try:
>>> await scanner.connect_db()  # <-- ISSUE HERE
        violations_count = await scanner.run_full_scan()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0724: MISSING_TRY_EXCEPT

**File:** `verification/pass2/placeholder_scanner.py`
**Line:** 336
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        await scanner.connect_db()
>>> violations_count = await scanner.run_full_scan()  # <-- ISSUE HERE
        
        db_valid = await scanner.validate_translators_in_db()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0725: MISSING_TRY_EXCEPT

**File:** `verification/pass2/placeholder_scanner.py`
**Line:** 338
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        violations_count = await scanner.run_full_scan()
        
>>> db_valid = await scanner.validate_translators_in_db()  # <-- ISSUE HERE
        integrity_metrics = await scanner.check_source_text_integrity()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0726: MISSING_TRY_EXCEPT

**File:** `verification/pass2/placeholder_scanner.py`
**Line:** 339
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        db_valid = await scanner.validate_translators_in_db()
>>> integrity_metrics = await scanner.check_source_text_integrity()  # <-- ISSUE HERE
        
        print(scanner.generate_report())
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0727: MISSING_TRY_EXCEPT

**File:** `verification/pass2/placeholder_scanner.py`
**Line:** 354
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        exit(1)
    finally:
>>> await scanner.close_db()  # <-- ISSUE HERE

if __name__ == "__main__":
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0728: MISSING_TRY_EXCEPT

**File:** `verification/pass2/implementation_checker.py`
**Line:** 399
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Connects to the Railway database."""
        try:
>>> self.db_conn = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
            logger.info("ImplementationChecker connected to database.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0729: MISSING_TRY_EXCEPT

**File:** `verification/pass2/implementation_checker.py`
**Line:** 475
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.db_conn:
>>> await self.connect()  # <-- ISSUE HERE

        expected_tables = ['texts', 'source_texts', 'author_profiles', 'translator_profiles', 'word_embeddings']
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0730: MISSING_TRY_EXCEPT

**File:** `verification/pass2/implementation_checker.py`
**Line:** 530
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                             logger.debug(f"Function '{func['name']}' in {file} is short ({func['line_count']} lines).")

>>> db_status = await self.verify_database_schema_completeness()  # <-- ISSUE HERE
        if not db_status:
            logger.critical("Database integrity check FAILED. Production deployment halted.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0731: MISSING_TRY_EXCEPT

**File:** `verification/pass2/implementation_checker.py`
**Line:** 543
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.db_conn:
>>> await self.connect()  # <-- ISSUE HERE
            
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0732: MISSING_TRY_EXCEPT

**File:** `verification/pass2/implementation_checker.py`
**Line:** 561
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    checker = ImplementationChecker(root_path=".")
    try:
>>> results = await checker.run_audit()  # <-- ISSUE HERE
        await checker.log_audit_to_db(results)
    finally:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0733: MISSING_TRY_EXCEPT

**File:** `verification/pass2/implementation_checker.py`
**Line:** 562
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        results = await checker.run_audit()
>>> await checker.log_audit_to_db(results)  # <-- ISSUE HERE
    finally:
        await checker.disconnect()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0734: MISSING_TRY_EXCEPT

**File:** `verification/pass2/implementation_checker.py`
**Line:** 564
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        await checker.log_audit_to_db(results)
    finally:
>>> await checker.disconnect()  # <-- ISSUE HERE

if __name__ == "__main__":
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0735: MISSING_TRY_EXCEPT

**File:** `verification/pass2/feature_checklist.py`
**Line:** 625
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Establishes connection to the Railway database."""
        try:
>>> self.db_conn = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
            logger.info("FeatureChecklist connected to database.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0736: MISSING_TRY_EXCEPT

**File:** `verification/pass2/feature_checklist.py`
**Line:** 640
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.db_conn:
>>> await self.connect()  # <-- ISSUE HERE

        logger.info("Validating translators in 'texts' table...")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0737: MISSING_TRY_EXCEPT

**File:** `verification/pass2/feature_checklist.py`
**Line:** 669
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.db_conn:
>>> await self.connect()  # <-- ISSUE HERE

        logger.info("Validating 'translator_profiles' table...")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0738: MISSING_TRY_EXCEPT

**File:** `verification/pass2/feature_checklist.py`
**Line:** 695
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.db_conn:
>>> await self.connect()  # <-- ISSUE HERE

        logger.info("Checking word_embeddings vector data...")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0739: MISSING_TRY_EXCEPT

**File:** `verification/pass2/feature_checklist.py`
**Line:** 725
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.db_conn:
>>> await self.connect()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0740: MISSING_TRY_EXCEPT

**File:** `verification/pass2/feature_checklist.py`
**Line:** 748
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            await self.validate_translator_profiles(),
            await self.check_word_embeddings(),
>>> await self.verify_author_profiles()  # <-- ISSUE HERE
        ]
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0741: MISSING_TRY_EXCEPT

**File:** `verification/pass2/feature_checklist.py`
**Line:** 762
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    checklist = FeatureChecklist()
    try:
>>> success = await checklist.run_full_checklist()  # <-- ISSUE HERE
        if not success:
            exit(1)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0742: MISSING_TRY_EXCEPT

**File:** `verification/pass2/feature_checklist.py`
**Line:** 766
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            exit(1)
    finally:
>>> await checklist.disconnect()  # <-- ISSUE HERE

if __name__ == "__main__":
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0743: MISSING_TRY_EXCEPT

**File:** `verification/pass2/coverage_reporter.py`
**Line:** 814
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Connects to the Railway database."""
        try:
>>> self.db_conn = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
        except Exception as e:
            logger.error(f"Database connection error: {e}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0744: MISSING_TRY_EXCEPT

**File:** `verification/pass2/coverage_reporter.py`
**Line:** 828
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.db_conn:
>>> await self.connect()  # <-- ISSUE HERE

        tables = ['texts', 'source_texts', 'author_profiles', 'translator_profiles', 'word_embeddings']
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0745: MISSING_TRY_EXCEPT

**File:** `verification/pass2/coverage_reporter.py`
**Line:** 871
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        Compiles all data into a final JSON report and logs to database.
        """
>>> await self.fetch_database_metrics()  # <-- ISSUE HERE
        self.calculate_readiness_score(scanner_violations, checker_results)
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0746: MISSING_TRY_EXCEPT

**File:** `verification/pass2/coverage_reporter.py`
**Line:** 913
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        )
    finally:
>>> await reporter.disconnect()  # <-- ISSUE HERE

if __name__ == "__main__":
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0748: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/query_validator.py`
**Line:** 220
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            try:
                if self.pool is None:
>>> await self.initialize_pool()  # <-- ISSUE HERE
                
                async with self.pool.acquire() as conn:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0749: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/query_validator.py`
**Line:** 225
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    # Use EXPLAIN to check if the query is actually executable
                    explain_query = f"EXPLAIN {sql}"
>>> await conn.execute(explain_query)  # <-- ISSUE HERE
                    logger.info("Query successfully passed PostgreSQL EXPLAIN check.")
            except asyncpg.PostgresError as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0750: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/query_validator.py`
**Line:** 323
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            if self.pool is None:
>>> await self.initialize_pool()  # <-- ISSUE HERE
                
            async with self.pool.acquire() as conn:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0751: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/query_validator.py`
**Line:** 326
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow("SELECT id FROM texts WHERE id = $1", work_id)  # <-- ISSUE HERE
                if row:
                    logger.info(f"Access verified for work_id: {work_id}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0752: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/query_validator.py`
**Line:** 349
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            if self.pool is None:
>>> await self.initialize_pool()  # <-- ISSUE HERE
                
            async with self.pool.acquire() as conn:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0753: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/query_validator.py`
**Line:** 352
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow("SELECT word FROM word_embeddings WHERE word = $1", word)  # <-- ISSUE HERE
                if row:
                    logger.info(f"Word embedding found for: {word}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0754: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/query_validator.py`
**Line:** 373
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        try:
>>> await self.initialize_pool()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                version = await conn.fetchval("SELECT version()")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0755: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 436
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            if self.pool is None:
>>> self.pool = await asyncpg.create_pool(dsn=self.db_url)  # <-- ISSUE HERE
                logger.info("SchemaChecker connected to database.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0756: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 460
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                rows = await conn.fetch(query)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0757: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 462
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if not self.pool: await self.connect()
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
                tables = [row['table_name'] for row in rows]
                logger.info(f"Tables found in database: {tables}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0758: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 481
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                rows = await conn.fetch(query, table_name)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0759: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 483
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if not self.pool: await self.connect()
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, table_name)  # <-- ISSUE HERE
                columns = [row['column_name'] for row in rows]
                logger.info(f"Columns for {table_name}: {columns}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0760: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 496
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        logger.info(f"Verifying integrity for table: {table_name}")
>>> actual_columns = await self.get_table_columns(table_name)  # <-- ISSUE HERE
        expected_columns = self.expected_schema.get(table_name, [])
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0761: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 528
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        for table in self.expected_schema.keys():
>>> report = await self.verify_table_integrity(table)  # <-- ISSUE HERE
            audit_results[table] = report
            if not report["is_valid"]:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0762: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 553
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        types = {}
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                rows = await conn.fetch(query, table_name)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0763: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 555
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if not self.pool: await self.connect()
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query, table_name)  # <-- ISSUE HERE
                for row in rows:
                    types[row['column_name']] = row['data_type']
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0764: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 575
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        tables_with_pk = []
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                rows = await conn.fetch(query)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0765: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 577
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if not self.pool: await self.connect()
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
                tables_with_pk = [row['table_name'] for row in rows]
                logger.info(f"Tables with primary keys: {tables_with_pk}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0766: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 592
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        for table in self.expected_schema.keys():
            try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
                async with self.pool.acquire() as conn:
                    count = await conn.fetchval(f"SELECT COUNT(*) FROM {table}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0767: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 624
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        fks = []
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                rows = await conn.fetch(query)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0768: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 626
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if not self.pool: await self.connect()
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
                for row in rows:
                    fks.append(dict(row))
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0769: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 645
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                pattern = f"%({column_name})%"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0770: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 648
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                pattern = f"%({column_name})%"
>>> count = await conn.fetchval(query, table_name, pattern)  # <-- ISSUE HERE
                return count > 0
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0771: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 659
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                size = await conn.fetchval("SELECT pg_size_pretty(pg_database_size(current_database()))")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0772: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/schema_checker.py`
**Line:** 677
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            "row_counts": await self.check_row_counts(),
            "pk_status": await self.validate_primary_keys(),
>>> "fk_status": await self.verify_foreign_keys()  # <-- ISSUE HERE
        }
        logger.info("Maintenance check finished.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0773: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 970
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if self.pool is None:
>>> self.pool = await asyncpg.create_pool(dsn=self.db_url)  # <-- ISSUE HERE
            logger.info("PerformanceAnalyzer connected.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0774: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 986
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                explain_query = f"EXPLAIN (FORMAT JSON) {sql}"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0775: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 989
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                explain_query = f"EXPLAIN (FORMAT JSON) {sql}"
>>> result = await conn.fetchval(explain_query)  # <-- ISSUE HERE
                # asyncpg returns the result as a string for JSON format
                plan = json.loads(result)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0776: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1002
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        Extracts cost and plan information from the query.
        """
>>> plan_data = await self.get_explain_plan(sql)  # <-- ISSUE HERE
        if not plan_data:
            return {"error": "Could not analyze query."}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0777: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1023
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        Checks if the query plan involves a Sequential Scan on large tables.
        """
>>> plan_data = await self.get_explain_plan(sql)  # <-- ISSUE HERE
        if not plan_data:
            return False
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0778: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1047
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                # We use a transaction to ensure we don't commit anything (though LOGOS is read-only for scholars)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0779: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1052
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                async with conn.transaction():
                    query = f"EXPLAIN ANALYZE {sql}"
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
                    # Parse the last row for execution time
                    last_row = rows[-1][0]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0780: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1087
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        sql = f"SELECT vector FROM word_embeddings WHERE word = '{word}'"
>>> cost_report = await self.analyze_query_cost(sql)  # <-- ISSUE HERE
        
        # Vector lookups should be indexed
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0781: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1090
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        # Vector lookups should be indexed
>>> is_indexed = await self.check_index_existence("word_embeddings", "word")  # <-- ISSUE HERE
        cost_report["is_indexed"] = is_indexed
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0782: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1105
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                count = await conn.fetchval(query, table, f"%({column})%")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0783: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1124
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                rows = await conn.fetch(query)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0784: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1126
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if not self.pool: await self.connect()
            async with self.pool.acquire() as conn:
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
                return [dict(r) for r in rows]
        except Exception:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0785: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1138
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info("Starting comprehensive performance audit...")
        
>>> cost_info = await self.analyze_query_cost(sql)  # <-- ISSUE HERE
        has_seq_scan = await self.check_for_seq_scans(sql)
        exec_time = await self.measure_actual_execution_time(sql)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0786: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1139
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        cost_info = await self.analyze_query_cost(sql)
>>> has_seq_scan = await self.check_for_seq_scans(sql)  # <-- ISSUE HERE
        exec_time = await self.measure_actual_execution_time(sql)
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0787: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1140
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        cost_info = await self.analyze_query_cost(sql)
        has_seq_scan = await self.check_for_seq_scans(sql)
>>> exec_time = await self.measure_actual_execution_time(sql)  # <-- ISSUE HERE
        
        audit = {
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0788: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1148
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            "actual_execution_time_ms": exec_time,
            "performance_rating": "OPTIMAL" if exec_time < 100 else "SUBOPTIMAL",
>>> "recommendations": await self.suggest_indexes(sql)  # <-- ISSUE HERE
        }
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0789: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1163
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                await conn.execute("SELECT 1")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0790: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1165
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if not self.pool: await self.connect()
            async with self.pool.acquire() as conn:
>>> await conn.execute("SELECT 1")  # <-- ISSUE HERE
                return True
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0791: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1181
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                row = await conn.fetchrow(query, table_name)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0792: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1183
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if not self.pool: await self.connect()
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow(query, table_name)  # <-- ISSUE HERE
                if row:
                    return dict(row)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0793: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1196
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                await conn.execute(f"ANALYZE {table_name}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0794: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1198
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if not self.pool: await self.connect()
            async with self.pool.acquire() as conn:
>>> await conn.execute(f"ANALYZE {table_name}")  # <-- ISSUE HERE
                logger.info(f"Table {table_name} analyzed successfully.")
                return True
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0795: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1215
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> if not self.pool: await self.connect()  # <-- ISSUE HERE
            async with self.pool.acquire() as conn:
                ratio = await conn.fetchval(query)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0796: MISSING_TRY_EXCEPT

**File:** `backend/verification/pass2/performance_analyzer.py`
**Line:** 1217
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if not self.pool: await self.connect()
            async with self.pool.acquire() as conn:
>>> ratio = await conn.fetchval(query)  # <-- ISSUE HERE
                return float(ratio)
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0797: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 65
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            logger.info("Attempting to connect to the LOGOS production database...")
>>> conn = await asyncpg.connect(self.db_url)  # <-- ISSUE HERE
            logger.info("Successfully established connection to Railway PostgreSQL.")
            return conn
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0798: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 83
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            bool: True if integrity is maintained, False otherwise.
        """
>>> conn = await self.connect_to_database()  # <-- ISSUE HERE
        try:
            logger.info("Starting database integrity validation...")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0799: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 89
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # Check for forbidden translators in the 'texts' table
            query = "SELECT DISTINCT translator FROM texts WHERE translator IS NOT NULL"
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
            
            found_translators = [row['translator'] for row in rows]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0800: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 100
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # Verify row counts for 'source_texts' to ensure data availability
            count_query = "SELECT COUNT(*) FROM source_texts"
>>> count = await conn.fetchval(count_query)  # <-- ISSUE HERE
            
            if count < 6000000:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0801: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 112
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return False
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    def audit_python_file_for_try_except(self, file_path: str) -> Dict[str, Any]:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0802: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 180
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            List[str]: A list of names of validated translators.
        """
>>> conn = await self.connect_to_database()  # <-- ISSUE HERE
        try:
            logger.info("Auditing translator profiles...")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0803: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 184
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            logger.info("Auditing translator profiles...")
            query = "SELECT name, style_vector FROM translator_profiles"
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
            
            valid_names = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0804: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 204
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return []
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    def check_for_forbidden_patterns(self, file_content: str) -> List[str]:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0805: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 241
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            Dict[str, int]: Table names and their current row counts.
        """
>>> conn = await self.connect_to_database()  # <-- ISSUE HERE
        results = {}
        tables = ['texts', 'source_texts', 'author_profiles', 'translator_profiles', 'word_embeddings']
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0806: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 256
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return {}
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    def validate_api_response_structure(self, response_data: Dict[str, Any]) -> bool:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0807: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 288
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            bool: True if health check passes.
        """
>>> conn = await self.connect_to_database()  # <-- ISSUE HERE
        try:
            # Sample 100 embeddings
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0808: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 292
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # Sample 100 embeddings
            query = "SELECT word, vector FROM word_embeddings LIMIT 100"
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
            
            if not rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0809: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 311
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return False
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    def generate_audit_report(self) -> str:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0810: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 348
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        # 1. Database Checks
>>> db_integrity = await self.validate_database_integrity()  # <-- ISSUE HERE
        table_counts = await self.audit_all_tables()
        embeddings_ok = await self.check_word_embeddings_health()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0811: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 349
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # 1. Database Checks
        db_integrity = await self.validate_database_integrity()
>>> table_counts = await self.audit_all_tables()  # <-- ISSUE HERE
        embeddings_ok = await self.check_word_embeddings_health()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0812: MISSING_TRY_EXCEPT

**File:** `verification/pass2/error_handler_validator.py`
**Line:** 350
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        db_integrity = await self.validate_database_integrity()
        table_counts = await self.audit_all_tables()
>>> embeddings_ok = await self.check_word_embeddings_health()  # <-- ISSUE HERE
        
        # 2. Code Audits
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0813: MISSING_TRY_EXCEPT

**File:** `verification/pass2/api_error_checker.py`
**Line:** 426
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            logger.info(f"Testing retrieval for text_id: {text_id}")
>>> conn = await asyncpg.connect(self.db_url)  # <-- ISSUE HERE
            
            query = "SELECT * FROM texts WHERE id = $1"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0814: MISSING_TRY_EXCEPT

**File:** `verification/pass2/api_error_checker.py`
**Line:** 429
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            query = "SELECT * FROM texts WHERE id = $1"
>>> row = await conn.fetchrow(query, text_id)  # <-- ISSUE HERE
            
            if row is None:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0815: MISSING_TRY_EXCEPT

**File:** `verification/pass2/api_error_checker.py`
**Line:** 460
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        finally:
            if conn:
>>> await conn.close()  # <-- ISSUE HERE

    async def validate_author_lookup(self, author_name: str) -> Dict[str, Any]:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0816: MISSING_TRY_EXCEPT

**File:** `verification/pass2/api_error_checker.py`
**Line:** 482
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                ).dict()

>>> conn = await asyncpg.connect(self.db_url)  # <-- ISSUE HERE
            query = "SELECT * FROM author_profiles WHERE name ILIKE $1"
            rows = await conn.fetch(query, f"%{author_name}%")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0817: MISSING_TRY_EXCEPT

**File:** `verification/pass2/api_error_checker.py`
**Line:** 484
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            conn = await asyncpg.connect(self.db_url)
            query = "SELECT * FROM author_profiles WHERE name ILIKE $1"
>>> rows = await conn.fetch(query, f"%{author_name}%")  # <-- ISSUE HERE
            
            if not rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0818: MISSING_TRY_EXCEPT

**File:** `verification/pass2/api_error_checker.py`
**Line:** 502
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        finally:
            if conn:
>>> await conn.close()  # <-- ISSUE HERE

    async def check_translator_permission(self, translator_name: str) -> bool:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0819: MISSING_TRY_EXCEPT

**File:** `verification/pass2/api_error_checker.py`
**Line:** 553
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            "text_retrieval_valid": await self.test_text_retrieval_error_handling(1),
            "text_retrieval_invalid": await self.test_text_retrieval_error_handling(999999),
>>> "author_lookup": await self.validate_author_lookup("Homer")  # <-- ISSUE HERE
        }
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0820: MISSING_TRY_EXCEPT

**File:** `verification/pass2/frontend_error_checker.ts`
**Line:** 897
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    
    # Run DB Table Audit
>>> counts = await validator.audit_all_tables()  # <-- ISSUE HERE
    print(f"Table Audit Results: {json.dumps(counts, indent=2)}")
    
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0821: MISSING_TRY_EXCEPT

**File:** `verification/pass2/frontend_error_checker.ts`
**Line:** 902
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    # Run API Health Check
    api_checker = ApiErrorChecker()
>>> api_results = await api_checker.audit_api_endpoint_health()  # <-- ISSUE HERE
    print(f"API Health Audit: {json.dumps(api_results, indent=2)}")
    
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0822: MISSING_TRY_EXCEPT

**File:** `verification/pass2/frontend_error_checker.ts`
**Line:** 906
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    
    # Run Integrity Check
>>> integrity_pass = await validator.validate_database_integrity()  # <-- ISSUE HERE
    if integrity_pass:
        logger.info("DATABASE INTEGRITY: OK")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0823: MISSING_TRY_EXCEPT

**File:** `verification/pass2/frontend_error_checker.ts`
**Line:** 913
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

    # Final check for forbidden translators across the board
>>> translators = await validator.verify_translator_profiles()  # <-- ISSUE HERE
    logger.info(f"Verified Translators: {', '.join(translators[:5])}... and {len(translators)-5} others.")

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0824: MISSING_TRY_EXCEPT

**File:** `verification/pass2/credential_scanner.py`
**Line:** 71
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> conn = await asyncpg.connect(self.db_url)  # <-- ISSUE HERE
            logger.info("Successfully connected to Railway database for security logging.")
            return conn
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0825: MISSING_TRY_EXCEPT

**File:** `verification/pass2/credential_scanner.py`
**Line:** 177
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            for file in files:
                file_path = os.path.join(root, file)
>>> findings = await self.scan_file(file_path)  # <-- ISSUE HERE
                if findings:
                    all_findings.extend(findings)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0826: MISSING_TRY_EXCEPT

**File:** `verification/pass2/credential_scanner.py`
**Line:** 196
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return

>>> conn = await self.initialize_db_connection()  # <-- ISSUE HERE
        try:
            # Note: Using 'texts' table as a proxy for logging in this specific environment
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0827: MISSING_TRY_EXCEPT

**File:** `verification/pass2/credential_scanner.py`
**Line:** 219
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            logger.error(f"Failed to log findings to database: {str(e)}")
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    def generate_report(self) -> str:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0828: MISSING_TRY_EXCEPT

**File:** `verification/pass2/credential_scanner.py`
**Line:** 268
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        # 1. Check Environment
>>> await self.validate_environment_variables()  # <-- ISSUE HERE
        
        # 2. Scan Filesystem
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0829: MISSING_TRY_EXCEPT

**File:** `verification/pass2/credential_scanner.py`
**Line:** 271
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        # 2. Scan Filesystem
>>> findings = await self.run_directory_scan(target_path)  # <-- ISSUE HERE
        
        # 3. Log to DB
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0830: MISSING_TRY_EXCEPT

**File:** `verification/pass2/credential_scanner.py`
**Line:** 274
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        # 3. Log to DB
>>> await self.log_findings_to_db(findings)  # <-- ISSUE HERE
        
        # 4. Final Summary
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0831: MISSING_TRY_EXCEPT

**File:** `verification/pass2/credential_scanner.py`
**Line:** 310
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        This is a specific check for the 'texts' table in the LOGOS schema.
        """
>>> conn = await self.initialize_db_connection()  # <-- ISSUE HERE
        try:
            # Searching for patterns like 'password: ...' or 'key: ...' in the actual classical texts
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0832: MISSING_TRY_EXCEPT

**File:** `verification/pass2/credential_scanner.py`
**Line:** 315
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            # to ensure no data contamination.
            query = "SELECT id, title FROM texts WHERE text_content ~* 'password|secret_key|apikey' LIMIT 10"
>>> rows = await conn.fetch(query)  # <-- ISSUE HERE
            if rows:
                for row in rows:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0833: MISSING_TRY_EXCEPT

**File:** `verification/pass2/credential_scanner.py`
**Line:** 324
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            logger.error(f"Error during database integrity check: {str(e)}")
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    def set_entropy_threshold(self, threshold: float):
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0834: MISSING_TRY_EXCEPT

**File:** `verification/pass2/injection_checker.py`
**Line:** 389
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Initializes the database connection for logging audit results."""
        try:
>>> self.conn = await asyncpg.connect(self.db_url)  # <-- ISSUE HERE
            logger.info("Injection Checker connected to Railway DB.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0835: MISSING_TRY_EXCEPT

**File:** `verification/pass2/injection_checker.py`
**Line:** 510
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        Orchestrates the full injection check process.
        """
>>> await self.initialize_audit_log()  # <-- ISSUE HERE
        await self.scan_directory(path)
        await self.log_results_to_db()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0836: MISSING_TRY_EXCEPT

**File:** `verification/pass2/injection_checker.py`
**Line:** 511
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        await self.initialize_audit_log()
>>> await self.scan_directory(path)  # <-- ISSUE HERE
        await self.log_results_to_db()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0837: MISSING_TRY_EXCEPT

**File:** `verification/pass2/injection_checker.py`
**Line:** 512
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        await self.initialize_audit_log()
        await self.scan_directory(path)
>>> await self.log_results_to_db()  # <-- ISSUE HERE
        
        if self.vulnerabilities:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0838: MISSING_TRY_EXCEPT

**File:** `verification/pass2/xss_scanner.py`
**Line:** 618
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def connect_db(self):
        """Connects to the Railway database."""
>>> return await asyncpg.connect(self.db_url)  # <-- ISSUE HERE

    async def scan_frontend_file(self, file_path: str):
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0839: MISSING_TRY_EXCEPT

**File:** `verification/pass2/xss_scanner.py`
**Line:** 673
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                path = os.path.join(root, file)
                if file.endswith(('.tsx', '.jsx', '.ts', '.js')):
>>> await self.scan_frontend_file(path)  # <-- ISSUE HERE
                elif file.endswith('.py'):
                    await self.scan_backend_file(path)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0840: MISSING_TRY_EXCEPT

**File:** `verification/pass2/xss_scanner.py`
**Line:** 675
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    await self.scan_frontend_file(path)
                elif file.endswith('.py'):
>>> await self.scan_backend_file(path)  # <-- ISSUE HERE

    async def log_to_db(self):
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0841: MISSING_TRY_EXCEPT

**File:** `verification/pass2/xss_scanner.py`
**Line:** 682
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return

>>> conn = await self.connect_db()  # <-- ISSUE HERE
        try:
            for v in self.vulnerabilities:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0842: MISSING_TRY_EXCEPT

**File:** `verification/pass2/xss_scanner.py`
**Line:** 692
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            logger.info(f"Logged {len(self.vulnerabilities)} XSS issues.")
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    def generate_summary(self):
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0843: MISSING_TRY_EXCEPT

**File:** `verification/pass2/auth_validator.py`
**Line:** 786
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def connect_db(self):
        """Connects to the Railway database."""
>>> return await asyncpg.connect(self.db_url)  # <-- ISSUE HERE

    def visit_FunctionDef(self, node: ast.FunctionDef):
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0844: MISSING_TRY_EXCEPT

**File:** `verification/pass2/auth_validator.py`
**Line:** 860
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return

>>> conn = await self.connect_db()  # <-- ISSUE HERE
        try:
            for v in self.violations:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0845: MISSING_TRY_EXCEPT

**File:** `verification/pass2/auth_validator.py`
**Line:** 870
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            logger.info(f"Logged {len(self.violations)} violations to database.")
        finally:
>>> await conn.close()  # <-- ISSUE HERE

    def generate_report(self):
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0846: MISSING_TRY_EXCEPT

**File:** `verification/pass2/auth_validator.py`
**Line:** 885
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    async def perform_full_audit(self, path: str):
        """Runs the complete audit process."""
>>> await self.scan_project(path)  # <-- ISSUE HERE
        await self.log_violations_to_db()
        self.generate_report()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0847: MISSING_TRY_EXCEPT

**File:** `verification/pass2/auth_validator.py`
**Line:** 886
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Runs the complete audit process."""
        await self.scan_project(path)
>>> await self.log_violations_to_db()  # <-- ISSUE HERE
        self.generate_report()
        return len(self.violations) == 0
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0849: MISSING_TRY_EXCEPT

**File:** `verification/pass2/auth_validator.py`
**Line:** 941
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # 1. Credential Scan
        cred_scanner = LogosCredentialScanner(DB_URL)
>>> await cred_scanner.perform_full_audit(".")  # <-- ISSUE HERE
        
        # 2. Injection Scan
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0850: MISSING_TRY_EXCEPT

**File:** `verification/pass2/auth_validator.py`
**Line:** 945
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # 2. Injection Scan
        inj_checker = LogosInjectionChecker(DB_URL)
>>> await inj_checker.run_full_check(".")  # <-- ISSUE HERE
        
        # 3. XSS Scan
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0851: MISSING_TRY_EXCEPT

**File:** `verification/pass2/auth_validator.py`
**Line:** 949
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # 3. XSS Scan
        xss_scanner = LogosXSSScanner(DB_URL)
>>> await xss_scanner.run_scan(".")  # <-- ISSUE HERE
        await xss_scanner.log_to_db()
        xss_scanner.generate_summary()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0852: MISSING_TRY_EXCEPT

**File:** `verification/pass2/auth_validator.py`
**Line:** 950
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        xss_scanner = LogosXSSScanner(DB_URL)
        await xss_scanner.run_scan(".")
>>> await xss_scanner.log_to_db()  # <-- ISSUE HERE
        xss_scanner.generate_summary()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0853: MISSING_TRY_EXCEPT

**File:** `verification/pass2/auth_validator.py`
**Line:** 955
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        # 4. Auth Validation
        auth_validator = LogosAuthValidator(DB_URL)
>>> await auth_validator.perform_full_audit(".")  # <-- ISSUE HERE
        
        print("\nProduction Security Suite Execution Complete.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0854: MISSING_TRY_EXCEPT

**File:** `backend/tests/conftest.py`
**Line:** 70
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        logger.info("Closing database connection pool...")
>>> await pool.close()  # <-- ISSUE HERE
    except Exception as e:
        logger.critical(f"CRITICAL: Database connection failed: {str(e)}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0855: MISSING_TRY_EXCEPT

**File:** `backend/tests/conftest.py`
**Line:** 107
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    
    try:
>>> response = await api_client.post("/auth/login", json=test_credentials)  # <-- ISSUE HERE
        if response.status_code != 200:
            logger.error(f"Authentication failed: {response.text}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0856: MISSING_TRY_EXCEPT

**File:** `backend/tests/conftest.py`
**Line:** 147
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            # Remove any test-labeled annotations or logs
>>> await conn.execute("DELETE FROM texts WHERE title LIKE 'TEST_LOGOS_%'")  # <-- ISSUE HERE
            logger.info("Cleanup completed successfully.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0857: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_corpus_api.py`
**Line:** 184
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            params = {"page": 1, "page_size": 20}
>>> response = await api_client.get("/corpus/texts", params=params)  # <-- ISSUE HERE
            
            assert response.status_code == 200, f"Expected 200, got {response.status_code}"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0858: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_corpus_api.py`
**Line:** 213
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        search_query = "Iliad"
        try:
>>> response = await api_client.get(f"/corpus/search?q={search_query}")  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0859: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_corpus_api.py`
**Line:** 244
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info(f"Testing content integrity for text ID: {target_id}")
        try:
>>> response = await api_client.get(f"/corpus/texts/{target_id}")  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0860: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_corpus_api.py`
**Line:** 267
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info("Testing author filtering for 'Plato'...")
        try:
>>> response = await api_client.get("/corpus/texts", params={"author": "Plato"})  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0861: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_corpus_api.py`
**Line:** 287
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info(f"Testing profile retrieval for {author_name}")
        try:
>>> response = await api_client.get(f"/corpus/authors/{author_name}")  # <-- ISSUE HERE
            assert response.status_code in [200, 404] # 404 is acceptable if not in profiles yet
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0862: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_corpus_api.py`
**Line:** 308
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info(f"Testing error handling for invalid ID: {invalid_id}")
        try:
>>> response = await api_client.get(f"/corpus/texts/{invalid_id}")  # <-- ISSUE HERE
            assert response.status_code == 404
            error_data = response.json()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0863: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_corpus_api.py`
**Line:** 325
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            # Attempt to delete a text without a token
>>> response = await api_client.delete("/corpus/texts/1")  # <-- ISSUE HERE
            assert response.status_code in [401, 403], "Unauthorized deletion should be blocked"
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0864: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_corpus_api.py`
**Line:** 341
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            try:
                # Sample 5 texts and check their source language availability
>>> sample_texts = await conn.fetch("SELECT id, title FROM texts LIMIT 5")  # <-- ISSUE HERE
                for text in sample_texts:
                    source_exists = await conn.fetchval(
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0865: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_corpus_api.py`
**Line:** 360
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info("Testing empty search query...")
        try:
>>> response = await api_client.get("/corpus/search?q=")  # <-- ISSUE HERE
            # API should either return 400 or an empty list, not 500
            assert response.status_code in [200, 400]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0866: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_corpus_api.py`
**Line:** 377
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info(f"Testing SQL injection prevention with query: {malicious_query}")
        try:
>>> response = await api_client.get(f"/corpus/search?q={malicious_query}")  # <-- ISSUE HERE
            # The system should treat this as a literal string or reject it.
            # It must NOT execute the DROP command.
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0867: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_translate_api.py`
**Line:** 423
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        }
        try:
>>> response = await api_client.post("/translate/compare", json=payload)  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0868: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_translate_api.py`
**Line:** 454
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        }
        try:
>>> response = await api_client.post("/translate/compare", json=payload)  # <-- ISSUE HERE
            # The API should return 403 Forbidden or 400 Bad Request for copyrighted material
            assert response.status_code in [400, 403, 422]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0869: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_translate_api.py`
**Line:** 470
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            for translator in valid_translators[:5]:  # Sampling first 5 for speed
>>> response = await api_client.get(f"/translate/profiles/{translator}")  # <-- ISSUE HERE
                assert response.status_code == 200
                profile = response.json()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0870: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_translate_api.py`
**Line:** 493
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        }
        try:
>>> response = await api_client.post("/translate/align", json=payload)  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0871: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_translate_api.py`
**Line:** 516
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        params = {"t1": "Pope", "t2": "Cowper"}
        try:
>>> response = await api_client.get("/translate/style-similarity", params=params)  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0872: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_translate_api.py`
**Line:** 539
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        }
        try:
>>> response = await api_client.post("/translate/compare", json=payload)  # <-- ISSUE HERE
            assert response.status_code == 200
            data = response.json()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0873: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_translate_api.py`
**Line:** 560
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        }
        try:
>>> response = await api_client.post("/translate/bulk", json=payload)  # <-- ISSUE HERE
            assert response.status_code == 200
            data = response.json()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0874: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_semantia_api.py`
**Line:** 601
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info(f"Looking up vector for word: {word}")
        try:
>>> response = await api_client.get(f"/semantia/vector/{word}")  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0875: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_semantia_api.py`
**Line:** 624
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info(f"Testing semantic similarity for: {word}")
        try:
>>> response = await api_client.get(f"/semantia/similar/{word}?top_n=5")  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0876: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_semantia_api.py`
**Line:** 652
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        }
        try:
>>> response = await api_client.post("/semantia/analogy", json=payload)  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0877: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_semantia_api.py`
**Line:** 672
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info(f"Testing semantic drift for: {word}")
        try:
>>> response = await api_client.get(f"/semantia/drift/{word}")  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0878: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_semantia_api.py`
**Line:** 695
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info(f"Testing batch vector retrieval for {len(words)} words.")
        try:
>>> response = await api_client.post("/semantia/vectors/batch", json={"words": words})  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0879: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_chronos_api.py`
**Line:** 736
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info(f"Testing timeline for author: {author}")
        try:
>>> response = await api_client.get(f"/chronos/timeline/author/{author}")  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0880: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_chronos_api.py`
**Line:** 759
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info(f"Testing era overview for: {era_id}")
        try:
>>> response = await api_client.get(f"/chronos/eras/{era_id}")  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0881: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_chronos_api.py`
**Line:** 780
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info(f"Testing event lookup: {event}")
        try:
>>> response = await api_client.get(f"/chronos/events/search?q={event}")  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0882: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_chronos_api.py`
**Line:** 798
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        params = {"author1": "Herodotus", "author2": "Thucydides"}
        try:
>>> response = await api_client.get("/chronos/compare", params=params)  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0883: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_connectome_api.py`
**Line:** 838
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        params = {"source_id": 102, "target_id": 201} # Odyssey -> Aeneid
        try:
>>> response = await api_client.get("/connectome/links", params=params)  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0884: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_connectome_api.py`
**Line:** 859
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info(f"Testing influence graph for {author}")
        try:
>>> response = await api_client.get(f"/connectome/influence/{author}")  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0885: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_connectome_api.py`
**Line:** 881
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info("Testing citation network density...")
        try:
>>> response = await api_client.get("/connectome/network/stats")  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0886: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_connectome_api.py`
**Line:** 904
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        }
        try:
>>> response = await api_client.post("/connectome/detect-allusions", json=payload)  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0887: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_auth.py`
**Line:** 946
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        }
        try:
>>> response = await api_client.post("/auth/login", json=credentials)  # <-- ISSUE HERE
            assert response.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0888: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_auth.py`
**Line:** 968
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        }
        try:
>>> response = await api_client.post("/auth/login", json=credentials)  # <-- ISSUE HERE
            assert response.status_code == 401
            assert "detail" in response.json()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0889: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_auth.py`
**Line:** 992
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        }
        try:
>>> response = await api_client.post("/auth/register", json=payload)  # <-- ISSUE HERE
            assert response.status_code == 201
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0890: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_auth.py`
**Line:** 1011
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        headers = {"Authorization": f"Bearer {auth_token}"}
        try:
>>> response = await api_client.post("/auth/refresh", headers=headers)  # <-- ISSUE HERE
            # Some systems use a separate refresh token, adjusting for standard JWT refresh
            assert response.status_code in [200, 405] 
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0891: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_auth.py`
**Line:** 1032
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        headers = {"Authorization": f"Bearer {auth_token}"}
        try:
>>> response = await api_client.get("/auth/me", headers=headers)  # <-- ISSUE HERE
            assert response.status_code == 200
            assert "username" in response.json()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0892: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_auth.py`
**Line:** 1053
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        }
        try:
>>> response = await api_client.post("/auth/register", json=payload)  # <-- ISSUE HERE
            assert response.status_code == 400
            assert "password" in response.text.lower()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0893: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_auth.py`
**Line:** 1070
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            # 1. Logout
>>> logout_res = await api_client.post("/auth/logout", headers=headers)  # <-- ISSUE HERE
            assert logout_res.status_code == 200
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0894: MISSING_TRY_EXCEPT

**File:** `backend/tests/test_auth.py`
**Line:** 1074
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            # 2. Try to use the same token again
>>> retry_res = await api_client.get("/auth/me", headers=headers)  # <-- ISSUE HERE
            assert retry_res.status_code == 401, "Token should be invalid after logout"
            logger.info("Logout and invalidation verified.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0895: MISSING_TRY_EXCEPT

**File:** `backend/database/query_engine.py`
**Line:** 1350
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            logger.info("LOGOS_DB_ENGINE: Initializing connection pool...")
>>> self.pool = await asyncpg.create_pool(DATABASE_URL, min_size=5, max_size=20)  # <-- ISSUE HERE
            logger.info("LOGOS_DB_ENGINE: Connection pool established.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0896: MISSING_TRY_EXCEPT

**File:** `backend/database/query_engine.py`
**Line:** 1366
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

        if not self.pool:
>>> await self.initialize()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0897: MISSING_TRY_EXCEPT

**File:** `backend/database/query_engine.py`
**Line:** 1376
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    ORDER BY chapter ASC;
                """
>>> rows = await connection.fetch(query, title, translator, book)  # <-- ISSUE HERE
                
                results = [dict(row) for row in rows]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0898: MISSING_TRY_EXCEPT

**File:** `backend/database/query_engine.py`
**Line:** 1390
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.initialize()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0899: MISSING_TRY_EXCEPT

**File:** `backend/database/query_engine.py`
**Line:** 1404
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    LIMIT $2;
                """
>>> rows = await connection.fetch(query, search_term, limit)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0900: MISSING_TRY_EXCEPT

**File:** `backend/database/query_engine.py`
**Line:** 1415
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.initialize()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0901: MISSING_TRY_EXCEPT

**File:** `backend/database/query_engine.py`
**Line:** 1435
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.pool:
>>> await self.initialize()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0902: MISSING_TRY_EXCEPT

**File:** `backend/database/query_engine.py`
**Line:** 1444
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    ORDER BY birth_year ASC;
                """
>>> rows = await connection.fetch(query)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0903: MISSING_TRY_EXCEPT

**File:** `backend/database/manager.py`
**Line:** 75
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self._is_connected:
>>> await self.connect()  # <-- ISSUE HERE
        
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0904: MISSING_TRY_EXCEPT

**File:** `backend/database/manager.py`
**Line:** 80
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                query = "SELECT id, title, author, translator, text_content, book, chapter FROM texts WHERE id = $1"
>>> row = await conn.fetchrow(query, text_id)  # <-- ISSUE HERE
                if row:
                    logger.info(f"Successfully fetched text ID {text_id}: {row['title']}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0905: MISSING_TRY_EXCEPT

**File:** `backend/database/manager.py`
**Line:** 97
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self._is_connected:
>>> await self.connect()  # <-- ISSUE HERE

        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0906: MISSING_TRY_EXCEPT

**File:** `backend/database/manager.py`
**Line:** 107
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    LIMIT $2
                """
>>> rows = await conn.fetch(query, f"%{search_term}%", limit)  # <-- ISSUE HERE
                logger.info(f"Search for '{search_term}' returned {len(rows)} results.")
                return [dict(row) for row in rows]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0907: MISSING_TRY_EXCEPT

**File:** `backend/database/manager.py`
**Line:** 135
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                query = "SELECT title, author, book, chapter FROM texts WHERE translator = $1"
>>> rows = await conn.fetch(query, translator_name)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0908: MISSING_TRY_EXCEPT

**File:** `backend/database/manager.py`
**Line:** 149
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                # Fetch target vector
>>> target_row = await conn.fetchrow("SELECT vector FROM word_embeddings WHERE word = $1", word)  # <-- ISSUE HERE
                if not target_row:
                    return []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0909: MISSING_TRY_EXCEPT

**File:** `backend/database/manager.py`
**Line:** 158
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                # Here we simulate the logic for the E2E test state.
                query = "SELECT word, vector FROM word_embeddings LIMIT 1000"
>>> all_words = await conn.fetch(query)  # <-- ISSUE HERE
                
                results = []
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0910: MISSING_TRY_EXCEPT

**File:** `backend/database/manager.py`
**Line:** 184
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    ORDER BY line_number ASC
                """
>>> rows = await conn.fetch(query, work_id, start_line, end_line)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0911: MISSING_TRY_EXCEPT

**File:** `backend/database/manager.py`
**Line:** 194
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            async with self.pool.acquire() as conn:
>>> row = await conn.fetchrow("SELECT * FROM author_profiles WHERE name = $1", author_name)  # <-- ISSUE HERE
                return dict(row) if row else None
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0912: MISSING_TRY_EXCEPT

**File:** `backend/database/manager.py`
**Line:** 211
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    WHERE title = $1 AND book = $2 AND chapter = $3
                """
>>> rows = await conn.fetch(query, title, book, chapter)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0913: MISSING_TRY_EXCEPT

**File:** `backend/database/manager.py`
**Line:** 227
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                    ORDER BY birth_year ASC
                """
>>> rows = await conn.fetch(query, start_year, end_year)  # <-- ISSUE HERE
                return [dict(row) for row in rows]
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0914: MISSING_TRY_EXCEPT

**File:** `backend/database/manager.py`
**Line:** 270
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            async with self.pool.acquire() as conn:
                query = "SELECT id, title, author, text_content FROM texts ORDER BY RANDOM() LIMIT 1"
>>> row = await conn.fetchrow(query)  # <-- ISSUE HERE
                return dict(row) if row else {}
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0915: MISSING_TRY_EXCEPT

**File:** `backend/database/manager.py`
**Line:** 295
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            if not self.pool: return False
            async with self.pool.acquire() as conn:
>>> result = await conn.fetchval("SELECT 1")  # <-- ISSUE HERE
                return result == 1
        except Exception:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0916: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 100
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            try:
                # Check translator_profiles table
>>> rows = await conn.fetch("SELECT name FROM translator_profiles")  # <-- ISSUE HERE
                for row in rows:
                    name = row['name']
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0917: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 109
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

                # Check texts table for metadata violations
>>> text_rows = await conn.fetch("SELECT DISTINCT translator FROM texts")  # <-- ISSUE HERE
                for row in text_rows:
                    trans = row['translator']
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0918: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 163
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        async with self.pool.acquire() as conn:
            try:
>>> sample_vectors = await conn.fetch("SELECT word, vector FROM word_embeddings LIMIT 100")  # <-- ISSUE HERE
                valid_count = 0
                error_count = 0
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0919: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 279
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.info("Building INTEGRATION_REPORT.md...")
        
>>> translator_data = await self.validate_translator_integrity()  # <-- ISSUE HERE
        coverage_data = await self.verify_text_coverage()
        vector_data = await self.perform_vector_sanity_check()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0920: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 280
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        translator_data = await self.validate_translator_integrity()
>>> coverage_data = await self.verify_text_coverage()  # <-- ISSUE HERE
        vector_data = await self.perform_vector_sanity_check()
        perf_data = await self.analyze_system_performance()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0921: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 281
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        translator_data = await self.validate_translator_integrity()
        coverage_data = await self.verify_text_coverage()
>>> vector_data = await self.perform_vector_sanity_check()  # <-- ISSUE HERE
        perf_data = await self.analyze_system_performance()
        security_data = await self.run_security_scan()
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0922: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 282
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        coverage_data = await self.verify_text_coverage()
        vector_data = await self.perform_vector_sanity_check()
>>> perf_data = await self.analyze_system_performance()  # <-- ISSUE HERE
        security_data = await self.run_security_scan()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0923: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 283
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        vector_data = await self.perform_vector_sanity_check()
        perf_data = await self.analyze_system_performance()
>>> security_data = await self.run_security_scan()  # <-- ISSUE HERE
        
        report = f"""# LOGOS SYSTEM INTEGRATION REPORT
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0924: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 330
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
### 7. DETAILED INVENTORY
"""
>>> inventory = await self.generate_inventory()  # <-- ISSUE HERE
        for item in inventory:
            report += f"- {item['module']}: {item['asset']} ({item.get('rows', item.get('type'))})\n"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0925: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 335
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

        report += "\n### 8. RESOLVED ISSUES\n"
>>> resolutions = await self.resolve_known_issues()  # <-- ISSUE HERE
        for res in resolutions:
            report += f"- **{res['issue']}**: {res['status']} - {res['fix']}\n"
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0926: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 402
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        os.makedirs("verification/final", exist_ok=True)
        
>>> inventory = await self.generate_inventory()  # <-- ISSUE HERE
        with open("verification/final/inventory.json", "w") as f:
            json.dump(inventory, f, indent=4)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0927: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 406
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            json.dump(inventory, f, indent=4)
            
>>> issues = await self.resolve_known_issues()  # <-- ISSUE HERE
        with open("verification/final/issues_resolved.json", "w") as f:
            json.dump(issues, f, indent=4)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0928: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 419
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            json.dump(test_results, f, indent=4)
            
>>> security = await self.run_security_scan()  # <-- ISSUE HERE
        with open("verification/final/security_scan.json", "w") as f:
            json.dump(security, f, indent=4)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0929: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 426
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """Main entry point for the integration process."""
        try:
>>> await self.connect()  # <-- ISSUE HERE
            
            # Generate markdown reports
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0930: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 429
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            # Generate markdown reports
>>> report_md = await self.build_integration_report()  # <-- ISSUE HERE
            with open("INTEGRATION_REPORT.md", "w") as f:
                f.write(report_md)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0931: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 433
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                f.write(report_md)
                
>>> checklist_md = await self.build_deployment_checklist()  # <-- ISSUE HERE
            with open("verification/final/deployment_checklist.md", "w") as f:
                f.write(checklist_md)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0932: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 438
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                
            # Generate JSON files
>>> await self.export_json_files()  # <-- ISSUE HERE
            
            logger.info("FULL INTEGRATION PROCESS COMPLETED SUCCESSFULLY.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0933: MISSING_TRY_EXCEPT

**File:** `app/services/integration_manager.py`
**Line:** 444
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            logger.critical(f"INTEGRATION PROCESS FAILED: {e}")
        finally:
>>> await self.disconnect()  # <-- ISSUE HERE

if __name__ == "__main__":
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0934: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 542
**Auto-fixable:** No - requires AI agent

**Current Code:**
```

async def get_db():
>>> conn = await asyncpg.connect(DATABASE_URL)  # <-- ISSUE HERE
    try:
        yield conn
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0935: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 546
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        yield conn
    finally:
>>> await conn.close()  # <-- ISSUE HERE

@app.get("/texts")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0936: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 568
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            params.append(translator)
            
>>> rows = await db.fetch(query, *params)  # <-- ISSUE HERE
        return [dict(r) for r in rows]
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0937: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 578
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """Fetches the full content of a specific translation."""
    try:
>>> row = await db.fetchrow("SELECT * FROM texts WHERE id = $1", text_id)  # <-- ISSUE HERE
        if not row:
            raise HTTPException(status_code=404, detail="Text not found")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0938: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 590
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """Fetches the original language source text for a work."""
    try:
>>> rows = await db.fetch("SELECT * FROM source_texts WHERE work_id = $1 ORDER BY line_number", work_id)  # <-- ISSUE HERE
        return [dict(r) for r in rows]
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0939: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 608
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            LIMIT 20
        """
>>> rows = await db.fetch(query, q)  # <-- ISSUE HERE
        return [dict(r) for r in rows]
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0940: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 618
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """Lists all author profiles."""
    try:
>>> rows = await db.fetch("SELECT * FROM author_profiles ORDER BY name")  # <-- ISSUE HERE
        return [dict(r) for r in rows]
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0941: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 628
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """Lists all approved translator profiles."""
    try:
>>> rows = await db.fetch("SELECT * FROM translator_profiles ORDER BY name")  # <-- ISSUE HERE
        # Double-check exclusion of forbidden names
        forbidden = {"Chapman", "Lattimore", "Fagles", "Wilson"}
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0942: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 641
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """Returns stylistic vectors and metrics for a specific translator."""
    try:
>>> row = await db.fetchrow("SELECT * FROM translator_profiles WHERE name = $1", name)  # <-- ISSUE HERE
        if not row:
            raise HTTPException(status_code=404, detail="Translator profile not found")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0943: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 653
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """Retrieves the 300D vector for a specific word."""
    try:
>>> row = await db.fetchrow("SELECT vector FROM word_embeddings WHERE word = $1", word)  # <-- ISSUE HERE
        if not row:
            raise HTTPException(status_code=404, detail="Word not found in embedding space")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0944: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 665
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """System health check."""
    try:
>>> await db.execute("SELECT 1")  # <-- ISSUE HERE
        return {"status": "healthy", "database": "connected", "version": "1.0.0"}
    except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0945: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 687
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    """Gets all works associated with a specific author ID."""
    try:
>>> author_name = await db.fetchval("SELECT name FROM author_profiles WHERE id = $1", author_id)  # <-- ISSUE HERE
        rows = await db.fetch("SELECT * FROM texts WHERE author = $1", author_name)
        return [dict(r) for r in rows]
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0946: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 688
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
    try:
        author_name = await db.fetchval("SELECT name FROM author_profiles WHERE id = $1", author_id)
>>> rows = await db.fetch("SELECT * FROM texts WHERE author = $1", author_name)  # <-- ISSUE HERE
        return [dict(r) for r in rows]
    except Exception:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0947: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 704
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            LIMIT $2
        """
>>> rows = await db.fetch(query, word, limit)  # <-- ISSUE HERE
        return [dict(r) for r in rows]
    except Exception:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0948: MISSING_TRY_EXCEPT

**File:** `app/api/v1/endpoints.py`
**Line:** 729
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
async def get_recent_additions(db: asyncpg.Connection = Depends(get_db)):
    """Returns the most recently added translations."""
>>> rows = await db.fetch("SELECT * FROM texts ORDER BY id DESC LIMIT 5")  # <-- ISSUE HERE
    return [dict(r) for r in rows]

```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0949: MISSING_TRY_EXCEPT

**File:** `tools/import_fixer.py`
**Line:** 64
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        try:
>>> self.db_pool = await asyncpg.create_pool(self.DATABASE_URL)  # <-- ISSUE HERE
            async with self.db_pool.acquire() as conn:
                # Ensure we can connect and the database is responsive
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0950: MISSING_TRY_EXCEPT

**File:** `tools/import_fixer.py`
**Line:** 93
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        """
        if not self.db_pool:
>>> await self.initialize_db()  # <-- ISSUE HERE
            
        try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0951: MISSING_TRY_EXCEPT

**File:** `tools/import_fixer.py`
**Line:** 331
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                
            file_str = str(py_file)
>>> fixed_missing = await self.fix_file(file_str)  # <-- ISSUE HERE
            fixed_unused = await self.remove_unused_imports(file_str)
            
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0952: MISSING_TRY_EXCEPT

**File:** `tools/import_fixer.py`
**Line:** 332
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            file_str = str(py_file)
            fixed_missing = await self.fix_file(file_str)
>>> fixed_unused = await self.remove_unused_imports(file_str)  # <-- ISSUE HERE
            
            if fixed_missing or fixed_unused:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0953: MISSING_TRY_EXCEPT

**File:** `tools/circular_import_resolver.py`
**Line:** 617
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        logger.warning(f"Detected {len(cycles)} circular dependencies.")
        for cycle in cycles:
>>> success = await self.resolve_cycle(cycle)  # <-- ISSUE HERE
            if success:
                logger.info(f"Resolved cycle: {cycle}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0956: MISSING_TRY_EXCEPT

**File:** `tools/placeholder_finder.py`
**Line:** 92
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                if file.endswith(('.py', '.ts', '.tsx', '.js')):
                    file_path = os.path.join(root, file)
>>> await self.process_file(file_path)  # <-- ISSUE HERE
        
        logger.info(f"Scan complete. Found {len(self.found_placeholders)} placeholders.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0957: MISSING_TRY_EXCEPT

**File:** `tools/placeholder_finder.py`
**Line:** 109
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
            if file_path.endswith('.py'):
>>> await self._analyze_python_ast(file_path, content)  # <-- ISSUE HERE
            
            await self._regex_scan(file_path, content)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0958: MISSING_TRY_EXCEPT

**File:** `tools/placeholder_finder.py`
**Line:** 111
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
                await self._analyze_python_ast(file_path, content)
            
>>> await self._regex_scan(file_path, content)  # <-- ISSUE HERE
            
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0959: MISSING_TRY_EXCEPT

**File:** `tools/implementation_generator.py`
**Line:** 273
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            if not self.conn:
>>> self.conn = await asyncpg.connect(self.DATABASE_URL)  # <-- ISSUE HERE
                logger.info("Database connection established for code generation.")
        except Exception as e:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0960: MISSING_TRY_EXCEPT

**File:** `tools/implementation_generator.py`
**Line:** 302
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        
        if any(keyword in name_lower for keyword in ["get", "fetch", "find", "search", "query"]):
>>> return await self._generate_database_query_logic(context)  # <-- ISSUE HERE
        elif any(keyword in name_lower for keyword in ["save", "update", "delete", "insert"]):
            return await self._generate_database_mutation_logic(context)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0961: MISSING_TRY_EXCEPT

**File:** `tools/implementation_generator.py`
**Line:** 304
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return await self._generate_database_query_logic(context)
        elif any(keyword in name_lower for keyword in ["save", "update", "delete", "insert"]):
>>> return await self._generate_database_mutation_logic(context)  # <-- ISSUE HERE
        elif any(keyword in name_lower for keyword in ["calculate", "compute", "process"]):
            return self._generate_computational_logic(context)
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0962: MISSING_TRY_EXCEPT

**File:** `tools/batch_completer.py`
**Line:** 595
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            for match in placeholders:
                if match.severity == Severity.CRITICAL or match.severity == Severity.HIGH:
>>> await self._process_placeholder(match)  # <-- ISSUE HERE
            
            logger.info("Batch completion process finished successfully.")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0963: MISSING_TRY_EXCEPT

**File:** `tools/async_wrapper.py`
**Line:** 65
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            logger.info("Connecting to Railway PostgreSQL for schema verification...")
>>> conn = await asyncpg.connect(self.database_url)  # <-- ISSUE HERE
            
            # Verify critical tables for LOGOS scholars
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0964: MISSING_TRY_EXCEPT

**File:** `tools/async_wrapper.py`
**Line:** 71
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            for table in tables:
                query = f"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '{table}')"
>>> exists = await conn.fetchval(query)  # <-- ISSUE HERE
                if not exists:
                    logger.error(f"Critical production table missing: {table}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0965: MISSING_TRY_EXCEPT

**File:** `tools/async_wrapper.py`
**Line:** 83
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        finally:
            if conn:
>>> await conn.close()  # <-- ISSUE HERE

    def create_error_handler_node(self, original_body: List[ast.stmt]) -> ast.Try:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0966: MISSING_TRY_EXCEPT

**File:** `tools/database_integrity_checker.py`
**Line:** 791
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        try:
            logger.info("Attempting to connect to LOGOS Production Database...")
>>> conn = await asyncpg.connect(self.dsn)  # <-- ISSUE HERE
            version = await conn.fetchval("SELECT version()")
            logger.info(f"Connected successfully. Server version: {version}")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0967: MISSING_TRY_EXCEPT

**File:** `tools/database_integrity_checker.py`
**Line:** 800
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        finally:
            if conn:
>>> await conn.close()  # <-- ISSUE HERE

    async def validate_text_counts(self) -> Dict[str, Any]:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0968: MISSING_TRY_EXCEPT

**File:** `tools/database_integrity_checker.py`
**Line:** 809
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        conn = None
        try:
>>> conn = await asyncpg.connect(self.dsn)  # <-- ISSUE HERE
            
            text_count = await conn.fetchval("SELECT COUNT(*) FROM texts")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0969: MISSING_TRY_EXCEPT

**File:** `tools/database_integrity_checker.py`
**Line:** 831
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        finally:
            if conn:
>>> await conn.close()  # <-- ISSUE HERE

    async def scan_for_unauthorized_content(self) -> List[str]:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0970: MISSING_TRY_EXCEPT

**File:** `tools/database_integrity_checker.py`
**Line:** 840
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        conn = None
        try:
>>> conn = await asyncpg.connect(self.dsn)  # <-- ISSUE HERE
            # Find all unique translators in the texts table
            translators = await conn.fetch("SELECT DISTINCT translator FROM texts WHERE translator IS NOT NULL")
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0971: MISSING_TRY_EXCEPT

**File:** `tools/database_integrity_checker.py`
**Line:** 842
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            conn = await asyncpg.connect(self.dsn)
            # Find all unique translators in the texts table
>>> translators = await conn.fetch("SELECT DISTINCT translator FROM texts WHERE translator IS NOT NULL")  # <-- ISSUE HERE
            
            for record in translators:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0972: MISSING_TRY_EXCEPT

**File:** `tools/database_integrity_checker.py`
**Line:** 856
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
        finally:
            if conn:
>>> await conn.close()  # <-- ISSUE HERE

    async def perform_full_maintenance(self):
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0973: MISSING_TRY_EXCEPT

**File:** `tools/database_integrity_checker.py`
**Line:** 867
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            return
            
>>> counts = await self.validate_text_counts()  # <-- ISSUE HERE
        violations = await self.scan_for_unauthorized_content()
        
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

### ISS-0974: MISSING_TRY_EXCEPT

**File:** `tools/database_integrity_checker.py`
**Line:** 868
**Auto-fixable:** No - requires AI agent

**Current Code:**
```
            
        counts = await self.validate_text_counts()
>>> violations = await self.scan_for_unauthorized_content()  # <-- ISSUE HERE
        
        if violations:
```

**Problem:** Async call without error handling - wrap in try/except

**Proposed Fix:** Wrap in try/except with proper error handling

---

## 🟢 LOW Priority Issues

These are minor improvements.

### ISS-0642: WRONG_DB_STRING

**File:** `.github/workflows/ci.yml`
**Line:** 136
**Auto-fixable:** Yes

**Current Code:**
```
      - name: Database Schema Validation
        env:
>>> DATABASE_URL: postgresql://postgres:JKLqDvdTtmRjGnOgDvGFLqLKVkcjQLFs@localhost:5432/railway  # <-- ISSUE HERE
        run: |
          python scripts/production_validator.py --check-schema
```

**Problem:** Localhost database - should use Railway connection

**Proposed Fix:** Replace with Railway database URL

---

### ISS-0643: WRONG_DB_STRING

**File:** `.github/workflows/ci.yml`
**Line:** 142
**Auto-fixable:** Yes

**Current Code:**
```
      - name: Execute Backend Test Suite
        env:
>>> DATABASE_URL: postgresql://postgres:JKLqDvdTtmRjGnOgDvGFLqLKVkcjQLFs@localhost:5432/railway  # <-- ISSUE HERE
          ENVIRONMENT: testing
        run: |
```

**Problem:** Localhost database - should use Railway connection

**Proposed Fix:** Replace with Railway database URL

---
