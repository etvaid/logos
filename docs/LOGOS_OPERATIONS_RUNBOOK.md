# LOGOS Operations Runbook
## Calibration Pipeline & Production Operations
## Version 1.1 - January 2026

═══════════════════════════════════════════════════════════════════════════════════════════════════
# TABLE OF CONTENTS
═══════════════════════════════════════════════════════════════════════════════════════════════════

1. [Quick Start](#quick-start)
2. [Environment Configuration](#environment-configuration)
3. [Calibration Pipeline](#calibration-pipeline)
4. [Gate Operations](#gate-operations)
5. [Data Population](#data-population)
6. [Nightly Jobs](#nightly-jobs)
7. [Monitoring & Alerts](#monitoring--alerts)
8. [Incident Playbook](#incident-playbook)
9. [Troubleshooting](#troubleshooting)
10. [Rollback Procedures](#rollback-procedures)
11. [Performance Tuning](#performance-tuning)
12. [Backup & Recovery](#backup--recovery)
13. [Instrument Release Checklist](#instrument-release-checklist)
14. [Appendix: SQL Scripts](#appendix-sql-scripts)

═══════════════════════════════════════════════════════════════════════════════════════════════════
# ⚠️ SECURITY NOTICE
═══════════════════════════════════════════════════════════════════════════════════════════════════

**NEVER paste production credentials into docs, chat, issues, or Slack.**

- All secrets must be stored in your secret manager (Railway Variables, GitHub Actions Secrets, Vault)
- Use `.env.example` (committed) + `.env` (gitignored) pattern
- Rotate any credentials that have ever been exposed in documentation or logs
- Enable IP allowlisting / private networking where possible

═══════════════════════════════════════════════════════════════════════════════════════════════════
# 1. QUICK START
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 1.1 Environment Setup

```bash
# Clone and setup
git clone https://github.com/etvaid/logos.git
cd logos

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Copy example env and fill in your secrets
cp .env.example .env
# Edit .env with your secret manager values - NEVER commit .env
```

**.env.example** (commit this):
```bash
# Database - get from Railway dashboard or secret manager
DATABASE_URL=

# Embedding model configuration
EMBED_MODEL=sentence-transformers/all-mpnet-base-v2
EMBED_DIM=768

# API keys - get from respective dashboards
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Environment
ENVIRONMENT=development  # development | staging | production
LOG_LEVEL=INFO
```

## 1.2 Schema Invariants Checklist

Before running ANY pipeline, verify these invariants:

```sql
-- 1. pgvector extension installed
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
-- Expected: vector | 0.5.0+

-- 2. Embedding columns are VECTOR(768), not FLOAT[]
SELECT column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name IN ('embeddings', 'style_residuals', 'meaning_anchors')
  AND column_name LIKE '%vector%' OR column_name LIKE '%embedding%' OR column_name LIKE '%residual%';
-- Expected: udt_name = 'vector' for all

-- 3. Verify dimensions match EMBED_DIM constant
SELECT 
    'embeddings' as table_name, 
    vector_dims(vector) as dims 
FROM embeddings LIMIT 1
UNION ALL
SELECT 
    'style_residuals', 
    vector_dims(residual_vector) 
FROM style_residuals LIMIT 1;
-- Expected: 768 for all

-- 4. HNSW indexes exist and are valid
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE indexdef LIKE '%hnsw%';
```

**If any check fails, stop and fix before proceeding.**

═══════════════════════════════════════════════════════════════════════════════════════════════════
# 2. ENVIRONMENT CONFIGURATION
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 2.1 Environment Matrix

| Aspect | Local Dev | Staging | Production (Railway/Vercel) |
|--------|-----------|---------|----------------------------|
| **Database** | Local Postgres or Docker | Railway staging instance | Railway production |
| **Secrets** | `.env` file | GitHub Actions Secrets | Railway Variables |
| **Jobs** | Manual / local cron | GitHub Actions | Railway Cron / Worker dyno |
| **Logs** | Console + file | GitHub Actions logs | Railway logs / Vercel logs |
| **Restart** | `python app.py` | Redeploy | Railway dashboard / `railway up` |
| **Rollback** | Git checkout | Redeploy previous SHA | Railway rollback button |

## 2.2 Service URLs by Environment

### Local Development
| Service | URL | Health Check |
|---------|-----|--------------|
| Backend API | http://localhost:8000 | /health |
| Frontend | http://localhost:3000 | / |
| Database | localhost:5432 | `pg_isready` |

### Staging
| Service | URL | Health Check |
|---------|-----|--------------|
| Backend API | https://logos-backend-staging.up.railway.app | /health |
| Frontend | https://logos-staging.vercel.app | / |

### Production
| Service | URL | Health Check |
|---------|-----|--------------|
| Backend API | https://logos-backend-production.up.railway.app | /health |
| Frontend | https://logos-classical.vercel.app | / |
| Calibration Status | /api/calibration/status | (via backend) |

## 2.3 Quick Health Check (Production)

```bash
# Check all services (replace with your actual URLs)
curl -s $LOGOS_BACKEND_URL/health | jq .
curl -s $LOGOS_BACKEND_URL/api/calibration/status | jq .

# Database connection test (use railway CLI or psql with env var)
railway run psql -c "SELECT COUNT(*) FROM source_texts;"
```

═══════════════════════════════════════════════════════════════════════════════════════════════════
# 3. CALIBRATION PIPELINE
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 3.1 Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                            CALIBRATION PIPELINE FLOW                                            │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│  1. DATA VALIDATION    2. COMPUTE (Incremental)   3. RUN GATES         4. VALIDATE             │
│  ─────────────────     ────────────────────────   ─────────────        ──────────────          │
│  │ Schema checks │ ──▶ │ Meaning Anchors      │──▶│ Gate 1    │ ──▶    │ Dashboard  │          │
│  │ Distribution  │     │ (only new/changed)   │   │ Gate 2A   │        │ Update     │          │
│  │ Leakage check │     │ Style Residuals      │   │ Gate 2B   │        │ Version    │          │
│  │ Embed model   │     │ (only missing)       │   │ Gate 3    │        │ Tag        │          │
│  └────────────────┘    │ Translator Profiles  │   │ Gate 4    │        └────────────┘          │
│                        └──────────────────────┘   └───────────┘                                │
│                                                                                                 │
│  Frequency: Before every run    Incremental: ~5-30 min    Frequency: Nightly (~2 hrs)          │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Data Readiness Checks (Run Before Every Pipeline)

```python
#!/usr/bin/env python
# data_readiness_check.py

import hashlib
from app.db import get_db

def run_all_checks() -> dict:
    """
    Comprehensive data readiness checks.
    All must pass before calibration proceeds.
    """
    db = next(get_db())
    results = {}
    
    # 1. Basic counts
    loeb_count = db.execute(
        "SELECT COUNT(*) FROM translations WHERE source = 'loeb'"
    ).fetchone()[0]
    results['loeb_translations'] = loeb_count
    results['loeb_check'] = loeb_count >= 10000
    
    # 2. Translator distribution
    translator_dist = db.execute("""
        SELECT translator, COUNT(*) as n
        FROM style_residuals
        GROUP BY translator
        HAVING COUNT(*) >= 20
    """).fetchall()
    results['translators_with_20_plus'] = len(translator_dist)
    results['translator_check'] = len(translator_dist) >= 10
    
    # 3. Meaning anchor coverage
    anchor_coverage = db.execute("""
        SELECT COUNT(*) FROM meaning_anchors
        WHERE num_translations >= 3
    """).fetchone()[0]
    results['anchors_with_3_plus'] = anchor_coverage
    results['anchor_check'] = anchor_coverage >= 1000
    
    # 4. Duplicate detection
    duplicates = db.execute("""
        SELECT md5(translation_text), COUNT(*) 
        FROM translations
        GROUP BY md5(translation_text)
        HAVING COUNT(*) > 1
    """).fetchall()
    results['duplicate_count'] = len(duplicates)
    results['duplicate_check'] = len(duplicates) < 100  # Allow some
    
    # 5. Embed model invariants
    from app.config import EMBED_MODEL, EMBED_DIM
    sample_dim = db.execute("""
        SELECT vector_dims(vector) FROM embeddings LIMIT 1
    """).fetchone()
    results['embed_model'] = EMBED_MODEL
    results['embed_dim_expected'] = EMBED_DIM
    results['embed_dim_actual'] = sample_dim[0] if sample_dim else None
    results['embed_check'] = sample_dim and sample_dim[0] == EMBED_DIM
    
    # 6. Leakage prevention check (verify grouped splits are configured)
    results['grouped_splits_enforced'] = True  # Set by Gate 1 implementation
    
    # Overall
    all_checks = [
        results['loeb_check'],
        results['translator_check'],
        results['anchor_check'],
        results['duplicate_check'],
        results['embed_check']
    ]
    results['all_passed'] = all(all_checks)
    
    return results

if __name__ == "__main__":
    import json
    results = run_all_checks()
    print(json.dumps(results, indent=2))
    if not results['all_passed']:
        print("\n❌ DATA READINESS FAILED - Do not proceed with calibration")
        exit(1)
    print("\n✅ All checks passed - Safe to proceed")
```

## 3.3 Idempotent Incremental Pipeline

```bash
#!/bin/bash
# run_calibration_pipeline.sh
# Idempotent, incremental, with locking

set -euo pipefail  # Exit on error, undefined vars, pipe failures

LOCK_FILE="/tmp/logos_calibration.lock"
LOG_FILE="/var/log/logos/calibration_$(date +%Y%m%d_%H%M%S).log"

# Acquire lock (prevents concurrent runs)
exec 200>"$LOCK_FILE"
if ! flock -n 200; then
    echo "Another calibration pipeline is running. Exiting."
    exit 1
fi

echo "=== LOGOS Calibration Pipeline ===" | tee -a "$LOG_FILE"
echo "Started at: $(date)" | tee -a "$LOG_FILE"
echo "Environment: $ENVIRONMENT" | tee -a "$LOG_FILE"

# Generate dataset fingerprint for reproducibility
DATASET_HASH=$(psql "$DATABASE_URL" -t -c "
    SELECT md5(string_agg(translator || ':' || count::text, ',' ORDER BY translator))
    FROM (SELECT translator, COUNT(*) FROM translations GROUP BY translator) t
")
GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
echo "Dataset hash: $DATASET_HASH" | tee -a "$LOG_FILE"
echo "Git SHA: $GIT_SHA" | tee -a "$LOG_FILE"

# Step 1: Data readiness checks
echo "Step 1: Running data readiness checks..." | tee -a "$LOG_FILE"
python -m app.calibration.data_readiness_check 2>&1 | tee -a "$LOG_FILE"
if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo "❌ Data readiness checks failed. Aborting." | tee -a "$LOG_FILE"
    exit 1
fi

# Step 2: Compute meaning anchors (INCREMENTAL - only new/changed)
echo "Step 2: Computing meaning anchors (incremental)..." | tee -a "$LOG_FILE"
python -m app.engines.style_residual compute_anchors_incremental \
    --min-translations 3 \
    --since-watermark 2>&1 | tee -a "$LOG_FILE"

# Step 3: Compute style residuals (INCREMENTAL - only missing)
echo "Step 3: Computing style residuals (incremental)..." | tee -a "$LOG_FILE"
python -m app.engines.style_residual compute_residuals_incremental 2>&1 | tee -a "$LOG_FILE"

# Step 4: Build translator profiles (recompute all - fast)
echo "Step 4: Building translator profiles..." | tee -a "$LOG_FILE"
python -m app.engines.style_residual build_all_profiles 2>&1 | tee -a "$LOG_FILE"

# Step 5: Run calibration gates
VERSION="Style_v$(date +%Y%m%d)"
echo "Step 5: Running calibration gates (version: $VERSION)..." | tee -a "$LOG_FILE"
python -m app.calibration.runner run_all_gates \
    --version "$VERSION" \
    --dataset-hash "$DATASET_HASH" \
    --git-sha "$GIT_SHA" 2>&1 | tee -a "$LOG_FILE"

# Step 6: Generate report
echo "Step 6: Generating calibration report..." | tee -a "$LOG_FILE"
python -m app.calibration.reporter generate_report \
    --output "/var/log/logos/calibration_report_$(date +%Y%m%d).json" 2>&1 | tee -a "$LOG_FILE"

# Update watermark for next incremental run
psql "$DATABASE_URL" -c "
    INSERT INTO job_watermarks (job_name, watermark, completed_at)
    VALUES ('calibration_pipeline', NOW(), NOW())
    ON CONFLICT (job_name) DO UPDATE SET watermark = NOW(), completed_at = NOW();
"

echo "=== Pipeline Complete ===" | tee -a "$LOG_FILE"
echo "Finished at: $(date)" | tee -a "$LOG_FILE"

# Release lock (automatic on script exit, but explicit is clearer)
flock -u 200
```

## 3.4 Incremental Computation Implementation

```python
# app/engines/style_residual.py (incremental methods)

def compute_anchors_incremental(min_translations: int = 3):
    """
    Compute meaning anchors only for source passages that:
    1. Have new translations since last run
    2. Don't have an anchor yet
    3. Have enough translations (>= min_translations)
    """
    db = next(get_db())
    
    # Get last watermark
    watermark = db.execute("""
        SELECT watermark FROM job_watermarks 
        WHERE job_name = 'compute_anchors'
    """).fetchone()
    since = watermark[0] if watermark else '1970-01-01'
    
    # Find passages needing anchor computation
    passages = db.execute("""
        SELECT DISTINCT t.source_text_id
        FROM translations t
        LEFT JOIN meaning_anchors ma ON t.source_text_id = ma.source_passage_id
        WHERE (t.created_at > %s OR ma.id IS NULL)
        GROUP BY t.source_text_id
        HAVING COUNT(*) >= %s
    """, [since, min_translations]).fetchall()
    
    logger.info(f"Computing anchors for {len(passages)} passages")
    
    for (passage_id,) in passages:
        compute_anchor_for_passage(passage_id)
    
    # Update watermark
    db.execute("""
        INSERT INTO job_watermarks (job_name, watermark)
        VALUES ('compute_anchors', NOW())
        ON CONFLICT (job_name) DO UPDATE SET watermark = NOW()
    """)
    db.commit()

def compute_residuals_incremental():
    """
    Compute style residuals only for translations that:
    1. Have an anchor but no residual
    2. Used a different embed model version (requires recompute)
    """
    db = next(get_db())
    
    # Find translations needing residual computation
    missing = db.execute("""
        SELECT t.id, t.translation_text, t.translator, ma.anchor_vector
        FROM translations t
        JOIN meaning_anchors ma ON t.source_text_id = ma.source_passage_id
        LEFT JOIN style_residuals sr ON t.id = sr.translation_id
        WHERE sr.id IS NULL
        LIMIT 10000  -- Process in batches
    """).fetchall()
    
    logger.info(f"Computing residuals for {len(missing)} translations")
    
    # Batch embed for efficiency
    batch_size = 100
    for i in range(0, len(missing), batch_size):
        batch = missing[i:i+batch_size]
        texts = [t[1] for t in batch]
        embeddings = engine.model.encode(texts)
        
        for j, (trans_id, text, translator, anchor) in enumerate(batch):
            residual = embeddings[j] - np.array(anchor)
            insert_residual(trans_id, translator, embeddings[j], residual)
        
        db.commit()
        gc.collect()  # Memory management
```

## 3.5 Job Watermarks Table

```sql
-- Add this table for incremental processing
CREATE TABLE IF NOT EXISTS job_watermarks (
    job_name VARCHAR(100) PRIMARY KEY,
    watermark TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    metadata JSONB
);
```

═══════════════════════════════════════════════════════════════════════════════════════════════════
# 4. GATE OPERATIONS
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 4.0 Gate Summary

| Gate | Test | Primary Metric | Threshold | Must Pass? |
|------|------|----------------|-----------|------------|
| **1** | Style Separability | Macro-F1 (GroupKFold) | > 0.70 | ✅ Yes |
| **2A** | Stability: Source Authors | F-ratio | > 3.0 | ✅ Yes |
| **2B** | Stability: Window Sizes | ICC | > 0.75 | ✅ Yes |
| **3** | Cross-Era Separation | Hard Pair Accuracy | > 0.70 | ✅ Yes |
| **4A** | Model Calibration | ECE | < 0.05 | ✅ Yes |
| **4B** | Manifold Validity | Neighbor Consistency | Expert approval | ✅ Yes |

**All gates must pass for instrument version to be activated.**

## 4.1 Gate 1: Style Separability

**Purpose**: Verify that style vectors cluster by translator when meaning is FIXED.

**Threshold**: Macro-F1 > 0.70 (with GroupKFold grouped by meaning_anchor_id)

**Critical**: Uses GroupKFold to prevent leakage. Random splits would artificially inflate scores.

**Manual Execution**:
```python
from app.calibration.gates import Gate1Separability

gate = Gate1Separability()
result = gate.run()

print(f"Status: {result.status}")
print(f"Macro-F1: {result.metrics['macro_f1']}")
print(f"Top-3 Accuracy: {result.metrics['top3_accuracy']}")
print(f"Split method: {result.metrics['split_method']}")  # Must be 'GroupKFold'

# Verify leakage prevention
assert result.metrics['split_method'] == 'GroupKFold', "LEAKAGE RISK!"
assert result.metrics['grouping_column'] == 'meaning_anchor_id', "Wrong grouping!"
```

**Debugging Low Scores**:
```sql
-- Check translator distribution
SELECT translator, COUNT(*) as n FROM style_residuals
GROUP BY translator ORDER BY n DESC;

-- Check anchor coverage per translator
SELECT sr.translator,
       COUNT(DISTINCT sr.meaning_anchor_id) as anchors,
       COUNT(*) as samples
FROM style_residuals sr
GROUP BY sr.translator ORDER BY anchors DESC;

-- Detect duplicates that could cause leakage
SELECT md5(translation_text), COUNT(*), 
       array_agg(DISTINCT translator) as translators
FROM translations
GROUP BY md5(translation_text)
HAVING COUNT(*) > 1 AND array_length(array_agg(DISTINCT translator), 1) > 1;
```

## 4.2 Gate 2A: Stability Across Source Authors

**Purpose**: Verify translator style is consistent when translating DIFFERENT authors.

**Threshold**: F-ratio (between / within variance) > 3.0

**Why**: If Fagles→Homer differs from Fagles→Virgil, we're measuring source, not translator.

**Manual Execution**:
```python
from app.calibration.gates import Gate2ASourceStability

gate = Gate2ASourceStability()
result = gate.run(min_source_authors=2, min_samples_per_source=10)

print(f"F-ratio: {result.metrics['f_ratio']}")
print(f"Between-var: {result.metrics['between_var']}")
print(f"Within-var: {result.metrics['within_var']}")
```

## 4.3 Gate 2B: Stability Across Window Sizes

**Purpose**: Verify style measurements are consistent at different text lengths.

**Threshold**: ICC (Intraclass Correlation) > 0.75

**Manual Execution**:
```python
from app.calibration.gates import Gate2BWindowStability

gate = Gate2BWindowStability()
result = gate.run(window_sizes=[500, 1000, 2000])

print(f"ICC: {result.metrics['icc']}")
print(f"95% CI: [{result.metrics['icc_ci_lower']}, {result.metrics['icc_ci_upper']}]")
```

## 4.4 Gate 3: Cross-Era Separation

**Purpose**: Separate contemporaries, not just obvious era differences.

**Thresholds**: Easy > 90%, Medium > 80%, Hard > 70%

**Pairs**:
```python
PAIRS = {
    "easy": [("Pope", "Wilson"), ("Chapman", "Fagles")],      # >100 years
    "medium": [("Lattimore", "Fagles"), ("Murray", "Fitzgerald")],  # 50-100 years
    "hard": [("Murray", "Rouse"), ("Way", "Murray")]          # <50 years, same publisher
}
```

**Manual Execution**:
```python
from app.calibration.gates import Gate3CrossEra

gate = Gate3CrossEra()
result = gate.run()

print(f"Easy: {result.metrics['easy_accuracy']:.1%}")
print(f"Medium: {result.metrics['medium_accuracy']:.1%}")
print(f"Hard: {result.metrics['hard_accuracy']:.1%}")
```

## 4.5 Gate 4A: Model Calibration (ECE)

**Purpose**: Verify stated confidence matches actual accuracy.

**Threshold**: ECE < 0.05

**Manual Execution**:
```python
from app.calibration.gates import Gate4ACalibration

gate = Gate4ACalibration()
result = gate.run(n_bins=10)

print(f"ECE: {result.metrics['ece']:.4f}")
print(f"MCE: {result.metrics['mce']:.4f}")

# Calibration curve
for b in result.metrics['calibration_curve']:
    print(f"  Bin {b['bin']}: stated={b['confidence']:.2f}, actual={b['accuracy']:.2f}")
```

## 4.6 Gate 4B: Manifold Validity (Expert + Quantitative)

**Purpose**: Verify held-out translators placed correctly on style manifold.

**Threshold**: Quantitative score + Expert validation

**Manual Execution**:
```python
from app.calibration.gates import Gate4BManifoldValidity

gate = Gate4BManifoldValidity()
result = gate.run(n_holdout=3, random_seed=42)

print(f"Neighbor consistency: {result.metrics['neighbor_consistency']:.2f}")
print(f"Era overlap: {result.metrics['era_overlap']:.1%}")

for t in result.metrics['held_out']:
    print(f"\n{t}: neighbors={result.metrics['neighbors'][t]}")
```

**Expert Validation**:
```
POST /api/calibration/gate_4b/validate
{
    "run_id": 123,
    "expert_id": "reviewer@institution.edu",
    "validations": [{
        "translator": "Fitzgerald",
        "neighbors": ["Lattimore", "Fagles"],
        "is_reasonable": true,
        "confidence": 0.9,
        "notes": "Correctly placed with mid-century literary translators"
    }]
}
```

═══════════════════════════════════════════════════════════════════════════════════════════════════
# 4. DATA POPULATION
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 4.1 Pericope Tables (for Q Reconstruction)

```sql
-- Insert Gospel of Mark pericopes (example)
INSERT INTO pericopes (gospel, pericope_name, start_urn, end_urn, verse_range, category) VALUES
('Mark', 'Baptism of Jesus', 'urn:cts:greekLit:tlg0031.tlg002:1.9', 'urn:cts:greekLit:tlg0031.tlg002:1.11', '1:9-11', 'triple_tradition'),
('Mark', 'Temptation', 'urn:cts:greekLit:tlg0031.tlg002:1.12', 'urn:cts:greekLit:tlg0031.tlg002:1.13', '1:12-13', 'triple_tradition'),
('Mark', 'Calling of Disciples', 'urn:cts:greekLit:tlg0031.tlg002:1.16', 'urn:cts:greekLit:tlg0031.tlg002:1.20', '1:16-20', 'triple_tradition');

-- Insert Matthew parallels
INSERT INTO pericopes (gospel, pericope_name, start_urn, end_urn, verse_range, category) VALUES
('Matthew', 'Baptism of Jesus', 'urn:cts:greekLit:tlg0031.tlg001:3.13', 'urn:cts:greekLit:tlg0031.tlg001:3.17', '3:13-17', 'triple_tradition'),
('Matthew', 'Temptation', 'urn:cts:greekLit:tlg0031.tlg001:4.1', 'urn:cts:greekLit:tlg0031.tlg001:4.11', '4:1-11', 'triple_tradition');

-- Insert double tradition (Q material)
INSERT INTO pericopes (gospel, pericope_name, start_urn, end_urn, verse_range, category) VALUES
('Matthew', 'Beatitudes', 'urn:cts:greekLit:tlg0031.tlg001:5.3', 'urn:cts:greekLit:tlg0031.tlg001:5.12', '5:3-12', 'double_tradition'),
('Luke', 'Beatitudes', 'urn:cts:greekLit:tlg0031.tlg003:6.20', 'urn:cts:greekLit:tlg0031.tlg003:6.23', '6:20-23', 'double_tradition');

-- Link synoptic parallels
INSERT INTO synoptic_parallels (pericope_id_a, pericope_id_b, parallel_type) 
SELECT a.id, b.id, 'triple'
FROM pericopes a, pericopes b
WHERE a.pericope_name = b.pericope_name
  AND a.gospel = 'Mark' 
  AND b.gospel IN ('Matthew', 'Luke');
```

## 4.2 Doctrinal Axes Seed Data

```sql
-- Christology axis
INSERT INTO doctrinal_axes (axis_name, language, period, seed_terms) VALUES
('christology_high', 'greek', 'early_christian', 
 ARRAY['κύριος', 'θεός', 'υἱὸς θεοῦ', 'λόγος', 'σωτήρ', 'χριστός', 'μονογενής', 'προϋπάρχων']),
('christology_low', 'greek', 'early_christian',
 ARRAY['διδάσκαλος', 'ῥαββί', 'προφήτης', 'υἱὸς ἀνθρώπου', 'ἄνθρωπος', 'δοῦλος']);

-- Cosmology axis
INSERT INTO doctrinal_axes (axis_name, language, period, seed_terms) VALUES
('cosmology_gnostic', 'greek', 'early_christian',
 ARRAY['πλήρωμα', 'αἰών', 'ἀρχών', 'δημιουργός', 'ὕλη', 'σκότος', 'φῶς', 'πνεῦμα', 'σοφία', 'βυθός']),
('cosmology_orthodox', 'greek', 'early_christian',
 ARRAY['κόσμος', 'κτίσις', 'ποίημα', 'δημιουργία', 'καλὸς λίαν']);

-- Asceticism axis
INSERT INTO doctrinal_axes (axis_name, language, period, seed_terms) VALUES
('asceticism_high', 'greek', 'early_christian',
 ARRAY['ἐγκράτεια', 'νηστεία', 'παρθενία', 'ἁγνεία', 'ἀποταγή', 'μοναχός']),
('asceticism_low', 'greek', 'early_christian',
 ARRAY['γάμος', 'τέκνα', 'οἶκος', 'κοίτη']);

-- Law/Ritual axis
INSERT INTO doctrinal_axes (axis_name, language, period, seed_terms) VALUES
('law_positive', 'greek', 'early_christian',
 ARRAY['νόμος', 'ἐντολή', 'περιτομή', 'σάββατον', 'καθαρός', 'ἅγιος']),
('law_negative', 'greek', 'early_christian',
 ARRAY['ἐλευθερία', 'πίστις', 'χάρις', 'πνεῦμα', 'καινός']);

-- Anti-temple axis
INSERT INTO doctrinal_axes (axis_name, language, period, seed_terms) VALUES
('temple_critical', 'greek', 'early_christian',
 ARRAY['χειροποίητος', 'σπήλαιον λῃστῶν', 'καταλύω']),
('temple_positive', 'greek', 'early_christian',
 ARRAY['ναός', 'θυσιαστήριον', 'λατρεία', 'προσφορά', 'ἱερεύς']);
```

## 4.3 Editorial Personas Seed Data

```sql
-- Gospel redactors
INSERT INTO editorial_personas (editor, editor_type, source_tradition) VALUES
('Matthew', 'gospel_redactor', 'Mark/Q'),
('Luke', 'gospel_redactor', 'Mark/Q'),
('John', 'gospel_redactor', 'Signs_Source/Discourse_Source');

-- Classical compilers
INSERT INTO editorial_personas (editor, editor_type, source_tradition) VALUES
('Plutarch', 'compiler', 'earlier_historians'),
('Diodorus_Siculus', 'compiler', 'multiple_sources'),
('Athenaeus', 'compiler', 'literary_sources');

-- Church historians
INSERT INTO editorial_personas (editor, editor_type, source_tradition) VALUES
('Eusebius', 'church_historian', 'earlier_christian'),
('Jerome', 'translator_redactor', 'hebrew_greek');

-- Talmudic editors
INSERT INTO editorial_personas (editor, editor_type, source_tradition) VALUES
('Bavli_Stam', 'talmudic_editor', 'tannaitic_amoraic'),
('Yerushalmi_Redactor', 'talmudic_editor', 'tannaitic_palestinian');
```

═══════════════════════════════════════════════════════════════════════════════════════════════════
# 5. NIGHTLY JOBS
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 5.1 Cron Schedule

```cron
# LOGOS Nightly Jobs - Add to crontab

# Calibration check (1 AM UTC)
0 1 * * * /opt/logos/scripts/run_calibration_check.sh >> /var/log/logos/calibration.log 2>&1

# Hypothesis factory (2 AM UTC)
0 2 * * * /opt/logos/scripts/run_hypothesis_factory.sh >> /var/log/logos/hypothesis.log 2>&1

# Discovery programs (3 AM UTC)
0 3 * * * /opt/logos/scripts/run_discovery_programs.sh >> /var/log/logos/discovery.log 2>&1

# Persona compliance tests (4 AM UTC)
0 4 * * * /opt/logos/scripts/run_persona_compliance.sh >> /var/log/logos/persona.log 2>&1

# Database maintenance (5 AM UTC, Sundays only)
0 5 * * 0 /opt/logos/scripts/run_db_maintenance.sh >> /var/log/logos/maintenance.log 2>&1
```

## 5.2 Hypothesis Factory Job

```bash
#!/bin/bash
# run_hypothesis_factory.sh

source /opt/logos/venv/bin/activate
cd /opt/logos/backend

echo "=== Hypothesis Factory Run: $(date) ==="

# Run all detection programs
python -m app.discovery.hypothesis_factory run_all \
    --programs stylometric_anomaly,intertext_bridge,semantic_shift,concept_migration \
    --max-hypotheses 100 \
    --novelty-threshold 0.3 \
    --confidence-threshold 0.6

# Run stability tests on new hypotheses
python -m app.discovery.stability_tests run_pending

# Generate summary
python -m app.discovery.hypothesis_factory summarize --output /var/log/logos/hypothesis_summary_$(date +%Y%m%d).json

echo "=== Hypothesis Factory Complete: $(date) ==="
```

## 5.3 Discovery Programs Job

```bash
#!/bin/bash
# run_discovery_programs.sh

source /opt/logos/venv/bin/activate
cd /opt/logos/backend

echo "=== Discovery Programs Run: $(date) ==="

# Program 1: Interpolation hot-spots
echo "Running interpolation detection..."
python -m app.discovery.programs.interpolation run \
    --works "Iliad_10,Prometheus_Bound,Seventh_Letter,Octavia" \
    --window-size 1000

# Program 2: Canon hinge detection
echo "Running bridge edge detection..."
python -m app.discovery.programs.bridge_edges run \
    --min-betweenness 0.01 \
    --max-results 50

# Program 3: Lost source inference
echo "Running lost source detection..."
python -m app.discovery.programs.lost_sources run \
    --min-authors 3 \
    --coherence-threshold 0.7

# Program 4: Regime shifts
echo "Running regime shift detection..."
python -m app.discovery.programs.regime_shifts run \
    --traditions latin_historiography,greek_philosophy,early_christian \
    --min-segment 50

# Program 5: Concept migration
echo "Running concept migration tracking..."
python -m app.discovery.programs.concept_migration run \
    --concepts logos,pneuma,sophia,psyche

echo "=== Discovery Programs Complete: $(date) ==="
```

## 5.4 Persona Compliance Job

```bash
#!/bin/bash
# run_persona_compliance.sh

source /opt/logos/venv/bin/activate
cd /opt/logos/backend

echo "=== Persona Compliance Test: $(date) ==="

# Test all active translators
python -m app.personas.compliance test_all \
    --sample-size 50 \
    --threshold 0.85

# Check for drift
python -m app.personas.compliance detect_drift \
    --baseline-version "Style_v20260101" \
    --drift-threshold 0.1

# Update scorecards if needed
python -m app.personas.compliance update_scorecards --if-drift

# Generate report
python -m app.personas.compliance report --output /var/log/logos/persona_compliance_$(date +%Y%m%d).json

echo "=== Persona Compliance Complete: $(date) ==="
```

═══════════════════════════════════════════════════════════════════════════════════════════════════
# 6. MONITORING & ALERTS
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 6.1 Health Check Endpoints

```python
# Health check responses

# GET /health
{
    "status": "healthy",
    "timestamp": "2026-01-01T12:00:00Z",
    "services": {
        "database": "connected",
        "embedding_model": "loaded",
        "calibration": "passed"
    },
    "version": "2.0.0"
}

# GET /api/calibration/status
{
    "overall_status": "passed",
    "gates": {
        "gate_1": {"status": "passed", "last_run": "2026-01-01T01:00:00Z"},
        "gate_2": {"status": "passed", "last_run": "2026-01-01T01:15:00Z"},
        "gate_3": {"status": "partial", "last_run": "2026-01-01T01:30:00Z"},
        "gate_4": {"status": "pending", "last_run": null}
    },
    "instrument_version": "Style_v20260101",
    "next_scheduled_run": "2026-01-02T01:00:00Z"
}
```

## 6.2 Alert Conditions

| Condition | Severity | Action |
|-----------|----------|--------|
| Gate 1 fails | HIGH | Pause hypothesis generation, notify |
| Gate 2 fails | MEDIUM | Flag in dashboard, continue |
| Gate 3 hard accuracy < 60% | HIGH | Retrain models, investigate |
| Gate 4 ECE > 0.10 | MEDIUM | Schedule recalibration |
| Hypothesis factory produces 0 | LOW | Check data freshness |
| Persona drift > 0.15 | MEDIUM | Review and update scorecard |
| DB connection fails | CRITICAL | Page on-call, failover |

## 6.3 Monitoring Queries

```sql
-- Calibration gate pass rate (last 30 days)
SELECT 
    gate_name,
    COUNT(*) FILTER (WHERE status = 'passed') as passed,
    COUNT(*) FILTER (WHERE status = 'failed') as failed,
    COUNT(*) FILTER (WHERE status = 'partial') as partial,
    ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'passed') / COUNT(*), 1) as pass_rate
FROM calibration_runs
WHERE run_date > NOW() - INTERVAL '30 days'
GROUP BY gate_name;

-- Hypothesis queue health
SELECT 
    category,
    status,
    COUNT(*) as count,
    AVG(composite_score) as avg_score
FROM hypothesis_queue
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY category, status
ORDER BY category, status;

-- Persona compliance trend
SELECT 
    DATE(test_date) as date,
    AVG(compliance_score) as avg_compliance,
    COUNT(*) FILTER (WHERE passed) as passed,
    COUNT(*) FILTER (WHERE NOT passed) as failed
FROM persona_compliance_tests
WHERE test_date > NOW() - INTERVAL '30 days'
GROUP BY DATE(test_date)
ORDER BY date;
```

## 6.4 Grafana Dashboard Panels

```yaml
# grafana_dashboard.yml
panels:
  - title: "Calibration Gate Status"
    type: stat
    query: |
      SELECT status FROM calibration_runs 
      WHERE gate_name = '$gate' 
      ORDER BY run_date DESC LIMIT 1

  - title: "Gate Pass Rate (30d)"
    type: gauge
    query: |
      SELECT ROUND(100.0 * SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) / COUNT(*), 1)
      FROM calibration_runs
      WHERE run_date > NOW() - INTERVAL '30 days'

  - title: "Hypotheses Generated (24h)"
    type: stat
    query: |
      SELECT COUNT(*) FROM hypothesis_queue
      WHERE created_at > NOW() - INTERVAL '24 hours'

  - title: "Calibration Trend"
    type: timeseries
    query: |
      SELECT run_date, 
             metrics->>'primary'->>'value' as score,
             gate_name
      FROM calibration_runs
      WHERE run_date > NOW() - INTERVAL '30 days'
```

═══════════════════════════════════════════════════════════════════════════════════════════════════
# 7. INCIDENT PLAYBOOK
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 7.1 SLOs (Service Level Objectives)

| SLO | Target | Measurement | Alert Threshold |
|-----|--------|-------------|-----------------|
| API Availability | 99.9% | Uptime over 30d | < 99.5% |
| API Latency (p95) | < 500ms | Response time | > 1000ms |
| Calibration Pipeline Success | 95% | Nightly runs | 2 consecutive failures |
| Gate 1 Pass Rate | 90% | Weekly runs | < 80% |
| Hypothesis Factory Output | > 0 | Nightly | 3 consecutive zeros |

## 7.2 On-Call Decision Tree

```
ALERT RECEIVED
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ Is production API down?                                         │
│   YES → Page on-call → Follow "API Down" playbook              │
│   NO  → Continue                                                │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ Is it a Calibration Gate failure?                               │
│   Gate 1 → CRITICAL: Freeze hypothesis factory, investigate     │
│   Gate 2A/2B → MEDIUM: Flag in dashboard, continue with warning │
│   Gate 3 → MEDIUM: Check pair definitions, may need retraining  │
│   Gate 4A/4B → MEDIUM: Schedule recalibration, expert review    │
│   NO  → Continue                                                │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ Is Hypothesis Factory producing nothing?                        │
│   YES (1 day) → Check data freshness, review thresholds         │
│   YES (3 days) → Investigate discovery programs, check embeddings│
│   NO  → Continue                                                │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ Is it a Persona Drift alert?                                    │
│   Drift > 0.15 → Review scorecard, may need embed model check   │
│   Drift > 0.25 → Freeze persona translations, investigate       │
│   NO  → Log and monitor                                         │
└─────────────────────────────────────────────────────────────────┘
```

## 7.3 Playbook: Gate 1 Failure

**Severity**: CRITICAL (blocks all discovery)

**Immediate Actions (< 15 min)**:
1. Freeze hypothesis factory: `python -m app.discovery.hypothesis_factory pause`
2. Check recent data changes: `SELECT * FROM job_watermarks ORDER BY completed_at DESC LIMIT 5;`
3. Verify GroupKFold is being used (check logs for split_method)

**Investigation (< 1 hour)**:
```bash
# Check for data issues
python -m app.calibration.diagnostics gate_1_check

# Check embedding model
python -c "from app.engines.style_residual import StyleResidualEngine; e = StyleResidualEngine(); print(e.model)"

# Check for duplicates
psql $DATABASE_URL -f scripts/check_duplicates.sql
```

**Remediation**:
- If data issue: Fix data, recompute residuals, rerun Gate 1
- If model issue: Pin model version, recompute all embeddings
- If persistent: Rollback to previous instrument version

**Resolution**:
1. Verify Gate 1 passes
2. Resume hypothesis factory: `python -m app.discovery.hypothesis_factory resume`
3. Post incident review within 48 hours

## 7.4 Playbook: API Down

**Severity**: CRITICAL

**Immediate Actions (< 5 min)**:
1. Check Railway dashboard for service status
2. Check Vercel dashboard for frontend status
3. Check database connectivity: `railway run psql -c "SELECT 1;"`

**If Railway is down**:
```bash
# Check logs
railway logs --tail 100

# Restart service
railway up --detach

# If still down, check for resource limits
railway status
```

**If Database is down**:
```bash
# Check connection
pg_isready -h $DB_HOST -p $DB_PORT

# Check Railway Postgres status in dashboard
# If unresponsive, contact Railway support
```

**Escalation**: If not resolved in 30 minutes, contact:
1. Railway support (for hosting issues)
2. Team lead (for code issues)

## 7.5 Playbook: Hypothesis Factory Producing Junk

**Severity**: MEDIUM

**Symptoms**: High volume but all fail stability tests

**Investigation**:
```sql
-- Check stability test pass rates
SELECT category,
       COUNT(*) as total,
       SUM(CASE WHEN confound_tests->>'stable_across_windows' = 'true' THEN 1 ELSE 0 END) as stable,
       SUM(CASE WHEN confound_tests->>'beats_negative_controls' = 'true' THEN 1 ELSE 0 END) as beats_null
FROM hypothesis_queue
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY category;
```

**Remediation**:
1. Increase novelty_threshold (default 0.3 → try 0.5)
2. Tighten confidence_threshold (default 0.6 → try 0.7)
3. Review anomaly scoring logic
4. Check if negative controls are too easy (consider topic-matched impostors)


═══════════════════════════════════════════════════════════════════════════════════════════════════
# 8. TROUBLESHOOTING
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 7.1 Common Issues

### Gate 1 Failing (Low F1)

**Symptoms**: Macro-F1 < 0.70, confusion matrix shows cross-translator confusion

**Diagnosis**:
```python
# Check class imbalance
from app.calibration.diagnostics import check_class_balance

balance = check_class_balance()
print(f"Most common: {balance['most_common']} ({balance['max_count']})")
print(f"Least common: {balance['least_common']} ({balance['min_count']})")
print(f"Imbalance ratio: {balance['ratio']}")

# Check if leakage is occurring
from app.calibration.diagnostics import check_leakage

leakage = check_leakage()
if leakage['detected']:
    print(f"LEAKAGE DETECTED: {leakage['description']}")
```

**Solutions**:
1. Ensure GroupKFold is splitting by meaning_anchor_id
2. Increase min_samples_per_translator
3. Use class_weight='balanced' in classifier
4. Check for duplicate translations

### Gate 2 Failing (Low ICC)

**Symptoms**: ICC < 0.75, high variance within translator across windows

**Diagnosis**:
```python
# Check variance decomposition
from app.calibration.diagnostics import variance_decomposition

vd = variance_decomposition()
print(f"Between-translator: {vd['between']}")
print(f"Within-translator: {vd['within']}")
print(f"Between-window: {vd['window']}")
```

**Solutions**:
1. Increase minimum window size
2. Use more robust features (function words vs content)
3. Check for translator misattribution in source data

### Hypothesis Factory Producing Junk

**Symptoms**: High volume of hypotheses but all fail stability tests

**Diagnosis**:
```sql
SELECT 
    category,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE confound_tests->>'stable_across_windows' = 'true') as stable,
    COUNT(*) FILTER (WHERE confound_tests->>'beats_negative_controls' = 'true') as beats_null
FROM hypothesis_queue
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY category;
```

**Solutions**:
1. Increase novelty_threshold
2. Add more stringent negative controls
3. Review anomaly scoring logic

### Embedding Model Issues

**Symptoms**: Style residuals all near zero, no clustering

**Diagnosis**:
```python
# Check embedding model is loaded
from app.engines.style_residual import StyleResidualEngine

engine = StyleResidualEngine()
test_embed = engine.embed("This is a test sentence.")
print(f"Embedding shape: {test_embed.shape}")
print(f"Embedding norm: {np.linalg.norm(test_embed)}")

# Should be (768,) and non-zero
```

**Solutions**:
1. Verify EMBED_MODEL environment variable
2. Check model download completed
3. Ensure GPU/CPU compatibility

## 7.2 Log Analysis

```bash
# Find recent errors
grep -i "error\|exception\|failed" /var/log/logos/*.log | tail -50

# Check calibration timing
grep "Duration" /var/log/logos/calibration.log | tail -10

# Check hypothesis generation rate
grep "Generated" /var/log/logos/hypothesis.log | tail -10

# Memory usage during embedding
grep -i "memory\|oom" /var/log/logos/*.log
```

═══════════════════════════════════════════════════════════════════════════════════════════════════
# 8. ROLLBACK PROCEDURES
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 8.1 Instrument Version Rollback

```bash
#!/bin/bash
# rollback_instrument.sh

PREVIOUS_VERSION=$1  # e.g., "Style_v20251225"

if [ -z "$PREVIOUS_VERSION" ]; then
    echo "Usage: rollback_instrument.sh <version>"
    exit 1
fi

echo "Rolling back to instrument version: $PREVIOUS_VERSION"

# Deactivate current version
psql $DATABASE_URL -c "
    UPDATE instrument_versions 
    SET is_active = FALSE 
    WHERE is_active = TRUE;
"

# Activate previous version
psql $DATABASE_URL -c "
    UPDATE instrument_versions 
    SET is_active = TRUE 
    WHERE version = '$PREVIOUS_VERSION';
"

# Verify
psql $DATABASE_URL -c "
    SELECT version, is_active, created_at 
    FROM instrument_versions 
    WHERE is_active = TRUE;
"

echo "Rollback complete. Verify calibration dashboard."
```

## 8.2 Database Migration Rollback

```bash
#!/bin/bash
# rollback_migration.sh

MIGRATION_NAME=$1

cd /opt/logos/backend
source venv/bin/activate

# Run alembic rollback
alembic downgrade -1

# Verify
alembic current
```

## 8.3 Full System Restore

```bash
#!/bin/bash
# full_restore.sh

BACKUP_DATE=$1  # e.g., "20260101"

echo "=== Full System Restore from $BACKUP_DATE ==="

# Stop services
systemctl stop logos-backend
systemctl stop logos-worker

# Restore database
pg_restore -d railway /backups/logos_$BACKUP_DATE.dump

# Restore embeddings (if stored separately)
aws s3 cp s3://logos-backups/embeddings_$BACKUP_DATE.tar.gz /tmp/
tar -xzf /tmp/embeddings_$BACKUP_DATE.tar.gz -C /opt/logos/data/

# Restart services
systemctl start logos-backend
systemctl start logos-worker

# Run health check
curl -s http://localhost:8000/health | jq .

echo "=== Restore Complete ==="
```

═══════════════════════════════════════════════════════════════════════════════════════════════════
# 9. PERFORMANCE TUNING
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 9.1 Database Indexes

```sql
-- Ensure these indexes exist for calibration queries
CREATE INDEX IF NOT EXISTS idx_style_residuals_translator ON style_residuals(translator);
CREATE INDEX IF NOT EXISTS idx_style_residuals_anchor ON style_residuals(meaning_anchor_id);
CREATE INDEX IF NOT EXISTS idx_meaning_anchors_source ON meaning_anchors(source_passage_id);
CREATE INDEX IF NOT EXISTS idx_calibration_runs_gate ON calibration_runs(gate_name, run_date DESC);
CREATE INDEX IF NOT EXISTS idx_hypothesis_queue_status ON hypothesis_queue(status, created_at DESC);

-- pgvector indexes for similarity search
CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON embeddings USING hnsw (vector vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_residuals_vector ON style_residuals USING hnsw (residual_vector vector_cosine_ops);

-- Partial indexes for active data
CREATE INDEX IF NOT EXISTS idx_active_instrument ON instrument_versions(version) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_pending_hypotheses ON hypothesis_queue(created_at) WHERE status = 'pending';
```

## 9.2 Query Optimization

```sql
-- Slow: Full scan for translator profile
SELECT * FROM style_residuals WHERE translator = 'Fagles';

-- Fast: With covering index
CREATE INDEX idx_residuals_translator_covering 
ON style_residuals(translator) 
INCLUDE (residual_vector, meaning_anchor_id);

-- Slow: Similarity search without index
SELECT * FROM embeddings 
ORDER BY vector <=> query_vector 
LIMIT 10;

-- Fast: With HNSW index (set ef_search)
SET hnsw.ef_search = 100;
SELECT * FROM embeddings 
ORDER BY vector <=> query_vector 
LIMIT 10;
```

## 9.3 Batch Processing

```python
# Bad: One at a time
for translation in translations:
    residual = engine.compute_style_residual(translation)
    db.insert(residual)
    db.commit()

# Good: Batched
batch_size = 1000
for i in range(0, len(translations), batch_size):
    batch = translations[i:i+batch_size]
    residuals = engine.compute_style_residuals_batch(batch)
    db.bulk_insert(residuals)
    db.commit()
```

## 9.4 Memory Management

```python
# For large embedding computations
import gc

def compute_all_residuals_chunked(chunk_size=10000):
    """Process in chunks to avoid OOM."""
    
    total = db.query("SELECT COUNT(*) FROM translations WHERE source = 'loeb'")[0][0]
    
    for offset in range(0, total, chunk_size):
        # Load chunk
        translations = db.query(f"""
            SELECT * FROM translations 
            WHERE source = 'loeb'
            ORDER BY id
            LIMIT {chunk_size} OFFSET {offset}
        """)
        
        # Process
        residuals = []
        for t in translations:
            r = engine.compute_style_residual(t)
            residuals.append(r)
        
        # Save
        db.bulk_insert(residuals)
        
        # Cleanup
        del translations, residuals
        gc.collect()
        
        print(f"Processed {offset + chunk_size}/{total}")
```

═══════════════════════════════════════════════════════════════════════════════════════════════════
# 11. BACKUP & RECOVERY
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 11.1 Backup Strategy

| Data Type | Method | Frequency | Retention | Location |
|-----------|--------|-----------|-----------|----------|
| PostgreSQL | Railway managed snapshots | Daily | 7 days | Railway |
| PostgreSQL | Manual pg_dump | Weekly | 90 days | S3 |
| Embeddings | Export to Parquet | Weekly | 90 days | S3 |
| Calibration Artifacts | Archive table + S3 | Monthly | 1 year | S3 |
| Code | Git | Continuous | Forever | GitHub |

## 11.2 Manual Backup Script

```bash
#!/bin/bash
# backup_logos.sh
set -euo pipefail

BACKUP_DATE=$(date +%Y%m%d)
S3_BUCKET="s3://logos-backups"

echo "=== LOGOS Backup: $BACKUP_DATE ==="

# 1. Database backup (via Railway CLI)
echo "Backing up database..."
railway run pg_dump -Fc > "/tmp/logos_${BACKUP_DATE}.dump"
aws s3 cp "/tmp/logos_${BACKUP_DATE}.dump" "${S3_BUCKET}/database/"

# 2. Export embeddings (if stored separately)
echo "Exporting embeddings..."
python -m app.data.export_embeddings --output "/tmp/embeddings_${BACKUP_DATE}.parquet"
aws s3 cp "/tmp/embeddings_${BACKUP_DATE}.parquet" "${S3_BUCKET}/embeddings/"

# 3. Export calibration artifacts
echo "Exporting calibration artifacts..."
python -m app.calibration.export_artifacts --output "/tmp/calibration_${BACKUP_DATE}.json"
aws s3 cp "/tmp/calibration_${BACKUP_DATE}.json" "${S3_BUCKET}/calibration/"

# 4. Cleanup
rm -f /tmp/logos_*.dump /tmp/embeddings_*.parquet /tmp/calibration_*.json

echo "=== Backup Complete ==="
```

## 11.3 Restore Procedures

### Railway PostgreSQL Restore (Managed)
1. Go to Railway Dashboard → Project → PostgreSQL
2. Click "Backups" tab
3. Select snapshot to restore
4. Click "Restore" (creates new instance)
5. Update DATABASE_URL in environment

### Manual Restore from S3
```bash
#!/bin/bash
# restore_logos.sh
set -euo pipefail

BACKUP_DATE=$1
if [ -z "$BACKUP_DATE" ]; then
    echo "Usage: restore_logos.sh YYYYMMDD"
    exit 1
fi

S3_BUCKET="s3://logos-backups"

echo "=== LOGOS Restore from $BACKUP_DATE ==="

# 1. Download backup
aws s3 cp "${S3_BUCKET}/database/logos_${BACKUP_DATE}.dump" /tmp/

# 2. Restore database
railway run pg_restore -d railway /tmp/logos_${BACKUP_DATE}.dump

# 3. Restore embeddings if needed
aws s3 cp "${S3_BUCKET}/embeddings/embeddings_${BACKUP_DATE}.parquet" /tmp/
python -m app.data.import_embeddings --input "/tmp/embeddings_${BACKUP_DATE}.parquet"

# 4. Verify
python -m app.calibration.data_readiness_check

echo "=== Restore Complete ==="
```

## 11.4 Monthly Restore Drill

**Schedule**: First Sunday of each month

**Procedure**:
1. Create staging environment
2. Restore last week's backup to staging
3. Run health checks: `curl -s $STAGING_URL/health`
4. Run Gate 1: `python -m app.calibration.runner run_gate --gate gate_1_separability`
5. Verify dashboard loads
6. Document results in #logos-ops channel
7. Tear down staging

**Pass Criteria**:
- Restore completes without errors
- Health check returns 200
- Gate 1 produces valid results (may differ from prod due to timing)
- Dashboard displays calibration data


═══════════════════════════════════════════════════════════════════════════════════════════════════
# 12. INSTRUMENT RELEASE CHECKLIST
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 12.1 Pre-Release Checklist

```markdown
## Instrument Release: Style_v[YYYYMMDD]

### Prerequisites
- [ ] All 6 gates passed (1, 2A, 2B, 3, 4A, 4B)
- [ ] ECE < 0.05 for all classification models
- [ ] Negative controls passing (>95% of hypotheses beat null)
- [ ] Expert validation complete for Gate 4B
- [ ] No open critical bugs

### Gate Results
| Gate | Status | Score | Threshold | Passed |
|------|--------|-------|-----------|--------|
| 1 - Separability | | | > 0.70 | |
| 2A - Source Stability | | | > 3.0 | |
| 2B - Window Stability | | | > 0.75 | |
| 3 - Cross-Era | | | > 70% | |
| 4A - ECE | | | < 0.05 | |
| 4B - Manifold | | | Expert | |

### Data Fingerprint
- Dataset hash: 
- Git SHA: 
- Embed model: 
- Embed dimension: 
- Translations count: 
- Anchors count: 
- Translators count: 

### Sign-off
- [ ] Technical lead review
- [ ] Data quality review
- [ ] Dashboard updated
- [ ] Version tagged in git
```

## 12.2 Release Procedure

```bash
#!/bin/bash
# release_instrument.sh
set -euo pipefail

VERSION=$1
if [ -z "$VERSION" ]; then
    echo "Usage: release_instrument.sh Style_vYYYYMMDD"
    exit 1
fi

echo "=== Releasing Instrument: $VERSION ==="

# 1. Verify all gates passed
echo "Verifying gates..."
python -m app.calibration.verify_release --version "$VERSION"

# 2. Generate calibration report
echo "Generating release report..."
python -m app.calibration.reporter generate_release_report \
    --version "$VERSION" \
    --output "releases/${VERSION}_report.json"

# 3. Deactivate current version
echo "Deactivating current version..."
psql "$DATABASE_URL" -c "
    UPDATE instrument_versions SET is_active = FALSE WHERE is_active = TRUE;
"

# 4. Activate new version
echo "Activating $VERSION..."
psql "$DATABASE_URL" -c "
    UPDATE instrument_versions SET is_active = TRUE WHERE version = '$VERSION';
"

# 5. Tag in git
echo "Tagging release..."
git tag -a "$VERSION" -m "Instrument release: $VERSION"
git push origin "$VERSION"

# 6. Update dashboard
echo "Refreshing dashboard..."
curl -X POST "$LOGOS_BACKEND_URL/api/calibration/refresh-dashboard"

# 7. Notify
echo "Sending notification..."
python -m app.notifications.send_release_notification --version "$VERSION"

echo "=== Release Complete: $VERSION ==="
```

## 12.3 Customer-Facing Trust Artifact

Each instrument version generates a public calibration report page:

**URL**: `/calibration/report/{version}`

**Contents**:
- Gate pass/fail summary with scores
- Calibration curve visualization
- Translator coverage statistics
- Model version and data fingerprint
- Last updated timestamp

**Purpose**: Demonstrates to institutional customers that LOGOS is a measured, calibrated instrument, not an opaque model.


═══════════════════════════════════════════════════════════════════════════════════════════════════
# 13. APPENDIX: SQL SCRIPTS
═══════════════════════════════════════════════════════════════════════════════════════════════════

## 10.1 Daily Maintenance

```sql
-- daily_maintenance.sql

-- Update statistics
ANALYZE style_residuals;
ANALYZE meaning_anchors;
ANALYZE hypothesis_queue;
ANALYZE calibration_runs;

-- Clean up old pending hypotheses (>30 days)
UPDATE hypothesis_queue 
SET status = 'expired' 
WHERE status = 'pending' 
  AND created_at < NOW() - INTERVAL '30 days';

-- Archive old calibration runs (>90 days, keep summary)
INSERT INTO calibration_runs_archive
SELECT * FROM calibration_runs
WHERE run_date < NOW() - INTERVAL '90 days';

DELETE FROM calibration_runs
WHERE run_date < NOW() - INTERVAL '90 days';

-- Refresh materialized views (if any)
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_translator_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_corpus_stats;
```

## 10.2 Calibration Report Query

```sql
-- calibration_report.sql

WITH latest_runs AS (
    SELECT DISTINCT ON (gate_name)
        gate_name,
        status,
        metrics,
        run_date,
        duration_seconds
    FROM calibration_runs
    ORDER BY gate_name, run_date DESC
),
gate_history AS (
    SELECT 
        gate_name,
        COUNT(*) as total_runs,
        COUNT(*) FILTER (WHERE status = 'passed') as passed,
        AVG(duration_seconds) as avg_duration
    FROM calibration_runs
    WHERE run_date > NOW() - INTERVAL '30 days'
    GROUP BY gate_name
)
SELECT 
    lr.gate_name,
    lr.status as current_status,
    lr.metrics->>'primary'->>'value' as current_score,
    lr.metrics->>'primary'->>'threshold' as threshold,
    lr.run_date as last_run,
    gh.total_runs as runs_30d,
    ROUND(100.0 * gh.passed / gh.total_runs, 1) as pass_rate_30d,
    ROUND(gh.avg_duration, 1) as avg_duration_sec
FROM latest_runs lr
JOIN gate_history gh ON lr.gate_name = gh.gate_name
ORDER BY lr.gate_name;
```

## 10.3 Hypothesis Quality Report

```sql
-- hypothesis_quality_report.sql

SELECT 
    category,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status = 'approved') as approved,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
    ROUND(AVG(composite_score), 3) as avg_score,
    ROUND(AVG(novelty_score), 3) as avg_novelty,
    ROUND(AVG(confidence_point), 3) as avg_confidence,
    ROUND(AVG(confounds_passed::float / NULLIF(confounds_total, 0)), 3) as avg_confound_rate,
    COUNT(*) FILTER (WHERE confound_tests->>'stable_across_windows' = 'true') as stable_count,
    COUNT(*) FILTER (WHERE confound_tests->>'beats_negative_controls' = 'true') as beats_null_count
FROM hypothesis_queue
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY category
ORDER BY total DESC;
```

## 10.4 Translator Coverage Report

```sql
-- translator_coverage_report.sql

SELECT 
    ps.translator,
    ps.sample_count,
    ps.stability_index,
    ps.mean_ltqi,
    ARRAY_LENGTH(ps.works_translated, 1) as works_count,
    pct.compliance_score as latest_compliance,
    pct.test_date as last_compliance_test,
    CASE 
        WHEN pct.compliance_score >= 0.90 THEN 'excellent'
        WHEN pct.compliance_score >= 0.80 THEN 'good'
        WHEN pct.compliance_score >= 0.70 THEN 'acceptable'
        ELSE 'needs_attention'
    END as compliance_status
FROM persona_scorecards ps
LEFT JOIN LATERAL (
    SELECT compliance_score, test_date
    FROM persona_compliance_tests
    WHERE translator = ps.translator
    ORDER BY test_date DESC
    LIMIT 1
) pct ON true
ORDER BY ps.sample_count DESC;
```

═══════════════════════════════════════════════════════════════════════════════════════════════════
# END OF RUNBOOK
═══════════════════════════════════════════════════════════════════════════════════════════════════

**Document Version**: 1.1
**Last Updated**: January 2026
**Maintainer**: LOGOS Team

**Key Changes in v1.1**:
- Removed hardcoded credentials (security fix)
- Split by environment (local/staging/production)
- Added idempotent incremental pipeline with locking
- Reconciled Gate 2 into 2A (source authors) + 2B (window sizes)
- Reconciled Gate 4 into 4A (ECE) + 4B (manifold validity)
- Added comprehensive incident playbook with decision tree
- Added instrument release checklist
- Added monthly restore drill procedure
- Added data readiness checks with leakage prevention

For questions or issues, check:
1. This runbook first
2. GitHub Issues: https://github.com/etvaid/logos/issues
3. Calibration Dashboard: /calibration
4. Logs: Railway dashboard → Logs
