# LOGOS Operations Runbook v1.1

## Quick Reference

### Database Connection
```bash
DATABASE_URL="postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway"
```

### Running Scripts
```bash
cd ~/Downloads/logos/apps/api
source ~/Downloads/logos/venv/bin/activate

# Check data readiness
python scripts/data_readiness_check.py

# Apply schema updates
python scripts/apply_schema.py

# Seed pericopes (synoptic data)
python scripts/seed_pericopes.py

# Seed doctrinal axes (Greek terms)
python scripts/seed_doctrinal_axes.py

# Run calibration pipeline
python scripts/run_calibration_pipeline.py
```

---

## 1. Data Readiness Check

Before running calibration or analysis, verify the database:

```bash
python scripts/data_readiness_check.py
```

**Expected Output for "READY" status:**
- `passages`: > 100
- `translations`: > 20
- `translators`: > 5
- `pericopes`: > 0 (for Q reconstruction)
- `doctrinal_axes`: > 0 (for theological analysis)

---

## 2. Schema Management

### Apply New Tables
```bash
python scripts/apply_schema.py
```

This creates all 50+ tables including:
- Core: `authors`, `works`, `source_texts`, `passages`, `translations`
- Style: `meaning_anchors`, `style_residuals`, `translator_centroids`
- Calibration: `calibration_runs`, `calibration_gate1-4`
- Authorship: `authorship_fingerprints`, `authorship_segments`
- Hypothesis: `hypotheses`, `hypothesis_tests`, `anomalies`
- Q Reconstruction: `pericopes`, `synoptic_alignments`, `q_reconstructions`
- Latent: `latent_axes`, `regime_shifts`, `concept_trajectories`

### Verify Schema
```python
from db.schema import verify_schema
import asyncpg
pool = await asyncpg.create_pool(DATABASE_URL)
result = await verify_schema(pool)
print(result['missing_tables'])
```

---

## 3. Calibration Pipeline

### Full 4-Gate Calibration
```bash
python scripts/run_calibration_pipeline.py
```

**Gates:**
1. **Style Separability** - GroupKFold classifier, NMI > 0.6, Top-1 > 70%
2. **Stability Across Windows** - F-ratio > 3.0 at 500/1000/2000 tokens
3. **Cross-Era Separation** - Easy > 90%, Medium > 80%, Hard > 70%
4. **External Validity** - Neighbor validity > 80% on known disputed works

### Run Individual Gates
```python
from engines import CalibrationEngine
import asyncpg

pool = await asyncpg.create_pool(DATABASE_URL)
engine = CalibrationEngine(pool)

# Run specific gate
result = await engine.run_gate_1_separability(run_id)
result = await engine.run_gate_2_stability(run_id)
result = await engine.run_gate_3_cross_era(run_id)
result = await engine.run_gate_4_external_validity(run_id)
```

---

## 4. Seeding Data

### Pericopes (Synoptic Parallels)
```bash
python scripts/seed_pericopes.py
```

Seeds:
- Triple tradition pericopes (Matt/Mark/Luke)
- Double tradition Q material
- Thomas parallels

### Doctrinal Axes
```bash
python scripts/seed_doctrinal_axes.py
```

Seeds 5 Greek axes + 1 Aramaic:
- `christology` - κύριος, θεός, υἱὸς θεοῦ vs διδάσκαλος, ῥαββί
- `cosmology` - πλήρωμα, αἰών vs κόσμος, κτίσις
- `asceticism` - ἐγκράτεια, νηστεία vs γάμος, τέκνα
- `law_ritual` - νόμος, ἐντολή vs ἐλευθερία, πίστις
- `anti_temple` - ναός χειροποίητος vs ναός, θυσιαστήριον

---

## 5. Nightly Jobs

### Hypothesis Factory (cron: 0 2 * * *)
```bash
python jobs/nightly_hypothesis_factory.py
```

Runs 5 discovery programs:
1. **Interpolation Detection** - Scans disputed works for anomalies
2. **Q Reconstruction** - Updates Q texts from synoptic data
3. **Concept Drift** - Tracks semantic evolution of key terms
4. **Influence Mapping** - Updates author influence network
5. **Hypothesis Mining** - Generates hypotheses from anomalies

---

## 6. API Endpoints

### Start API Server
```bash
cd ~/Downloads/logos/apps/api
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /calibration/run` | Run full calibration |
| `GET /calibration/latest` | Get latest calibration results |
| `POST /style/residuals/compute/{id}` | Compute style residual |
| `POST /authorship/segment/{work_id}` | Segment work by author |
| `POST /hypothesis/generate/from-anomalies` | Generate hypotheses |
| `POST /synoptic/q/reconstruct/{id}` | Reconstruct Q passage |
| `POST /discovery/programs/run-all` | Run all 5 discovery programs |
| `GET /uncertainty/ece` | Get calibration error metrics |

---

## 7. Troubleshooting

### "relation does not exist"
```bash
python scripts/apply_schema.py
```

### "EMBED_DIM mismatch"
All embeddings must be VECTOR(768). Check:
```python
from config.constants import EMBED_DIM
print(EMBED_DIM)  # Should be 768
```

### "Calibration not ready"
Run data readiness check:
```bash
python scripts/data_readiness_check.py
```

Ensure minimum data:
- 100+ passages with embeddings
- 20+ translations
- 5+ translators

### "Foreign key violation"
Check that referenced tables have data:
```sql
SELECT COUNT(*) FROM texts;  -- For translations.text_id
SELECT COUNT(*) FROM passages;  -- For other FKs
```

---

## 8. Monitoring

### Check Calibration Status
```bash
curl http://localhost:8000/calibration/latest | jq .
```

### Check Hypothesis Summary
```bash
curl http://localhost:8000/hypothesis/summary | jq .
```

### Check Discovery Runs
```bash
curl http://localhost:8000/discovery/programs/summary | jq .
```

---

## 9. Database Backup

```bash
pg_dump $DATABASE_URL > logos_backup_$(date +%Y%m%d).sql
```

### Restore
```bash
psql $DATABASE_URL < logos_backup_YYYYMMDD.sql
```

---

## 10. Deployment

### Railway (Current)
The Procfile points to `/backend`. To use `/apps/api`:

```
web: cd apps/api && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Environment Variables
```
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...  # For AI features
```

---

## Version History

- **v1.1** (2026-01-01): Added calibration, discovery, Q reconstruction
- **v1.0** (2024-12-28): Initial corpus and basic API
