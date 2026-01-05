from __future__ import annotations
import orjson
from fastapi import FastAPI, Query
from fastapi.responses import ORJSONResponse
from astro_nav import db

app = FastAPI(title="LOGOS Astro Navigator API", version="1.0")

@app.get("/health")
async def health():
    return {"ok": True}

@app.get("/catalogs")
async def catalogs():
    rows = await db.fetch("SELECT catalog_key, name, coord_system, epoch_year FROM astro.catalogs ORDER BY catalog_key")
    return ORJSONResponse([dict(r) for r in rows])

@app.get("/runs")
async def runs(limit: int = 50):
    rows = await db.fetch("SELECT run_key, created_at, config FROM astro.analysis_runs ORDER BY created_at DESC LIMIT $1", limit)
    return ORJSONResponse([dict(r) for r in rows])

@app.get("/run/{run_key}/summary")
async def run_summary(run_key: str):
    r = await db.fetch("SELECT run_id FROM astro.analysis_runs WHERE run_key=$1", run_key)
    if not r:
        return ORJSONResponse({"error": "run_key not found"}, status_code=404)
    run_id = int(r[0]["run_id"])
    s = await db.fetch("SELECT * FROM astro.model_summaries WHERE run_id=$1 ORDER BY created_at DESC", run_id)
    return ORJSONResponse([dict(x) for x in s])

@app.get("/run/{run_key}/stars")
async def run_stars(run_key: str, hypothesis: str = Query("ptolemy_epoch"), limit: int = 5000):
    r = await db.fetch("SELECT run_id FROM astro.analysis_runs WHERE run_key=$1", run_key)
    if not r:
        return ORJSONResponse({"error": "run_key not found"}, status_code=404)
    run_id = int(r[0]["run_id"])
    rows = await db.fetch("""
      SELECT o.object_key, o.canonical_name, o.constellation, o.hip_id, e.entry_id, e.recorded_lon, e.recorded_lat,
             p.epoch_year, p.pred_lon, p.pred_lat, p.dlon, p.dlat, p.ang_resid, p.model_params
      FROM astro.predictions p JOIN astro.catalog_entries e ON e.entry_id=p.entry_id JOIN astro.objects o ON o.object_id=e.object_id
      WHERE p.run_id=$1 AND p.hypothesis=$2 LIMIT $3
    """, run_id, hypothesis, limit)
    return ORJSONResponse([dict(x) for x in rows])

@app.get("/star/{object_key}/mentions")
async def star_mentions(object_key: str, limit: int = 200):
    oid = await db.fetchval("SELECT object_id FROM astro.objects WHERE object_key=$1", object_key)
    if not oid:
        return ORJSONResponse({"error": "object_key not found"}, status_code=404)
    rows = await db.fetch("SELECT urn, alias, language, char_start, char_end, snippet, confidence, method FROM astro.text_mentions WHERE object_id=$1 ORDER BY confidence DESC, mention_id DESC LIMIT $2", int(oid), limit)
    return ORJSONResponse([dict(r) for r in rows])
