#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# LOGOS ASTRO NAVIGATOR - FULL SYSTEM SETUP (Backend + DB + Pipeline + API)
# =============================================================================
# Creates:
#  - Python package astro_nav/
#  - Postgres schema astro.* (tables, indexes)
#  - CLI pipeline: db init, catalog import, gaia fetch, fit, date, mentions, report, api
#
# Requires:
#  - DATABASE_URL env var set (PostgreSQL)
# Optional:
#  - OPENAI_API_KEY for LLM-assisted text mention classification (OFF by default)
#
# Safe by default:
#  - Creates a separate schema `astro` and its own tables
#  - Does NOT modify your existing LOGOS tables

PROJECT_DIR="${PROJECT_DIR:-logos_astro_navigator}"
PYTHON_BIN="${PYTHON_BIN:-python3}"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL is not set."
  echo "Example:"
  echo "  export DATABASE_URL='postgresql://user:pass@host:5432/dbname'"
  exit 1
fi

echo "Creating ${PROJECT_DIR} ..."
mkdir -p "${PROJECT_DIR}"
cd "${PROJECT_DIR}"

echo "Writing .env.example ..."
cat > .env.example <<'ENV'
# Required
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Optional: for LLM-assisted classification of ambiguous text mentions (off by default)
OPENAI_API_KEY=

# Optional: tell mention-miner where your LOGOS text table is
# Defaults are: source_texts(urn, content, language, work, author, date, embedding)
LOGOS_TEXT_TABLE=source_texts
LOGOS_TEXT_URN_COL=urn
LOGOS_TEXT_CONTENT_COL=content
LOGOS_TEXT_LANG_COL=language
LOGOS_TEXT_WORK_COL=work
LOGOS_TEXT_AUTHOR_COL=author
LOGOS_TEXT_DATE_COL=date

# Optional: restrict mention mining to a list of works to keep it fast (comma-separated)
MENTION_WORK_ALLOWLIST=
ENV

echo "Writing requirements.txt ..."
cat > requirements.txt <<'REQ'
asyncpg==0.29.0
python-dotenv==1.0.1
pydantic==2.9.2
PyYAML==6.0.2
numpy==2.1.3
scipy==1.14.1
pandas==2.2.3
astropy==6.1.4
aiohttp==3.10.10
tqdm==4.66.6
rich==13.9.4
fastapi==0.115.5
uvicorn==0.32.0
orjson==3.10.11
matplotlib==3.9.2
REQ

echo "Creating python venv ..."
${PYTHON_BIN} -m venv .venv
source .venv/bin/activate
python -m pip install -U pip wheel setuptools
python -m pip install -r requirements.txt

mkdir -p astro_nav data/catalogs data/aliases reports/figures scripts

# =============================================================================
# SQL SCHEMA
# =============================================================================
cat > astro_nav/schema.sql <<'SQL'
CREATE SCHEMA IF NOT EXISTS astro;

-- ---------- catalogs ----------
CREATE TABLE IF NOT EXISTS astro.catalogs (
  catalog_id SERIAL PRIMARY KEY,
  catalog_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  epoch_year INT, -- "as stated" epoch for that catalog (can be null / unknown)
  coord_system TEXT NOT NULL, -- e.g. 'tropical_ecliptic', 'sidereal_ecliptic', 'equatorial'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- astro objects ----------
CREATE TABLE IF NOT EXISTS astro.objects (
  object_id SERIAL PRIMARY KEY,
  object_key TEXT UNIQUE NOT NULL,
  object_type TEXT NOT NULL, -- star|constellation|asterism|other
  canonical_name TEXT NOT NULL,
  constellation TEXT,
  bayer TEXT,
  flamsteed TEXT,
  hip_id INT,
  gaia_source_id BIGINT,
  mag_modern REAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_astro_objects_hip ON astro.objects(hip_id);
CREATE INDEX IF NOT EXISTS idx_astro_objects_gaia ON astro.objects(gaia_source_id);
CREATE INDEX IF NOT EXISTS idx_astro_objects_const ON astro.objects(constellation);

-- ---------- catalog entries ----------
CREATE TABLE IF NOT EXISTS astro.catalog_entries (
  entry_id BIGSERIAL PRIMARY KEY,
  catalog_id INT NOT NULL REFERENCES astro.catalogs(catalog_id) ON DELETE CASCADE,
  object_id INT REFERENCES astro.objects(object_id) ON DELETE SET NULL,
  entry_no INT,
  constellation TEXT,
  recorded_lon DOUBLE PRECISION,
  recorded_lat DOUBLE PRECISION,
  recorded_lon_raw TEXT,
  recorded_lat_raw TEXT,
  magnitude_int INT,
  description TEXT,
  source_urn TEXT, -- link into your LOGOS text store (optional)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(catalog_id, entry_no)
);

CREATE INDEX IF NOT EXISTS idx_entries_catalog ON astro.catalog_entries(catalog_id);
CREATE INDEX IF NOT EXISTS idx_entries_object ON astro.catalog_entries(object_id);

-- ---------- modern astrometry (Gaia/modern) ----------
CREATE TABLE IF NOT EXISTS astro.modern_astrometry (
  object_id INT PRIMARY KEY REFERENCES astro.objects(object_id) ON DELETE CASCADE,
  ref_epoch_jyear DOUBLE PRECISION DEFAULT 2000.0,
  ra_deg DOUBLE PRECISION,
  dec_deg DOUBLE PRECISION,
  pmra_masyr DOUBLE PRECISION,
  pmdec_masyr DOUBLE PRECISION,
  parallax_mas DOUBLE PRECISION,
  radvel_kms DOUBLE PRECISION,
  ra_error_mas DOUBLE PRECISION,
  dec_error_mas DOUBLE PRECISION,
  pmra_error_masyr DOUBLE PRECISION,
  pmdec_error_masyr DOUBLE PRECISION,
  phot_g_mean_mag REAL,
  source TEXT DEFAULT 'GaiaDR3',
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- analysis runs ----------
CREATE TABLE IF NOT EXISTS astro.analysis_runs (
  run_id BIGSERIAL PRIMARY KEY,
  run_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  config JSONB NOT NULL,
  code_version TEXT,
  notes TEXT
);

-- ---------- per-entry predictions/residuals ----------
CREATE TABLE IF NOT EXISTS astro.predictions (
  pred_id BIGSERIAL PRIMARY KEY,
  run_id BIGINT NOT NULL REFERENCES astro.analysis_runs(run_id) ON DELETE CASCADE,
  entry_id BIGINT NOT NULL REFERENCES astro.catalog_entries(entry_id) ON DELETE CASCADE,

  hypothesis TEXT NOT NULL,        -- 'ptolemy_epoch', 'hipparchus_copy', 'epoch_scan_best', etc.
  epoch_year INT,                  -- astronomical year numbering (see code)
  model_params JSONB,              -- offsets, precession_shift, etc.

  pred_lon DOUBLE PRECISION,
  pred_lat DOUBLE PRECISION,
  dlon DOUBLE PRECISION,           -- observed - predicted, wrapped to [-180,180]
  dlat DOUBLE PRECISION,
  ang_resid DOUBLE PRECISION,      -- angular distance (deg)

  loglik DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pred_run_hyp ON astro.predictions(run_id, hypothesis);
CREATE INDEX IF NOT EXISTS idx_pred_entry ON astro.predictions(entry_id);

-- ---------- run-level model summaries ----------
CREATE TABLE IF NOT EXISTS astro.model_summaries (
  summary_id BIGSERIAL PRIMARY KEY,
  run_id BIGINT NOT NULL REFERENCES astro.analysis_runs(run_id) ON DELETE CASCADE,

  catalog_key TEXT NOT NULL,
  hypothesis_a TEXT NOT NULL,
  hypothesis_b TEXT NOT NULL,

  n_entries INT NOT NULL,

  rms_a DOUBLE PRECISION,
  rms_b DOUBLE PRECISION,

  bic_a DOUBLE PRECISION,
  bic_b DOUBLE PRECISION,
  bic_mix DOUBLE PRECISION,

  mix_weight_b DOUBLE PRECISION,         -- weight of hypothesis_b in mixture
  log_bayes_factor_mix_vs_best DOUBLE PRECISION,

  precession_shift_deg DOUBLE PRECISION, -- fitted or fixed
  rounding_arcmin DOUBLE PRECISION,
  sigma_arcmin DOUBLE PRECISION,

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_model_summaries_run ON astro.model_summaries(run_id);

-- ---------- constellation/systematics ----------
CREATE TABLE IF NOT EXISTS astro.systematics (
  sys_id BIGSERIAL PRIMARY KEY,
  run_id BIGINT NOT NULL REFERENCES astro.analysis_runs(run_id) ON DELETE CASCADE,
  catalog_key TEXT NOT NULL,
  hypothesis TEXT NOT NULL,

  constellation TEXT,
  n_entries INT,
  offset_lon_deg DOUBLE PRECISION,
  offset_lat_deg DOUBLE PRECISION,
  shrinkage DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_systematics_run ON astro.systematics(run_id, catalog_key, hypothesis);

-- ---------- job checkpointing (resumable pipeline) ----------
CREATE TABLE IF NOT EXISTS astro.jobs (
  job_id BIGSERIAL PRIMARY KEY,
  job_type TEXT NOT NULL,
  job_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending|running|done|failed
  detail JSONB,
  error TEXT,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  UNIQUE(job_type, job_key)
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON astro.jobs(job_type, status);

-- ---------- aliases + text mentions ----------
CREATE TABLE IF NOT EXISTS astro.star_aliases (
  alias_id BIGSERIAL PRIMARY KEY,
  object_id INT REFERENCES astro.objects(object_id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  language TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(object_id, alias)
);

CREATE INDEX IF NOT EXISTS idx_alias_text ON astro.star_aliases(alias);

CREATE TABLE IF NOT EXISTS astro.text_mentions (
  mention_id BIGSERIAL PRIMARY KEY,
  object_id INT REFERENCES astro.objects(object_id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  language TEXT,
  urn TEXT NOT NULL,
  char_start INT,
  char_end INT,
  snippet TEXT,
  confidence DOUBLE PRECISION DEFAULT 0.5,
  method TEXT DEFAULT 'string_match',
  evidence JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(object_id, urn, char_start, char_end)
);

CREATE INDEX IF NOT EXISTS idx_mentions_object ON astro.text_mentions(object_id);
CREATE INDEX IF NOT EXISTS idx_mentions_urn ON astro.text_mentions(urn);

SQL

# =============================================================================
# CONFIG + UTIL
# =============================================================================
cat > astro_nav/config.py <<'PY'
from __future__ import annotations
import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

@dataclass(frozen=True)
class LogosTextConfig:
    table: str = os.getenv("LOGOS_TEXT_TABLE", "source_texts")
    urn_col: str = os.getenv("LOGOS_TEXT_URN_COL", "urn")
    content_col: str = os.getenv("LOGOS_TEXT_CONTENT_COL", "content")
    lang_col: str = os.getenv("LOGOS_TEXT_LANG_COL", "language")
    work_col: str = os.getenv("LOGOS_TEXT_WORK_COL", "work")
    author_col: str = os.getenv("LOGOS_TEXT_AUTHOR_COL", "author")
    date_col: str = os.getenv("LOGOS_TEXT_DATE_COL", "date")
    work_allowlist: str = os.getenv("MENTION_WORK_ALLOWLIST", "")

    def allowlist(self) -> list[str]:
        if not self.work_allowlist.strip():
            return []
        return [x.strip() for x in self.work_allowlist.split(",") if x.strip()]

@dataclass(frozen=True)
class Settings:
    database_url: str = os.environ["DATABASE_URL"]
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    logos_text: LogosTextConfig = LogosTextConfig()

settings = Settings()
PY

cat > astro_nav/db.py <<'PY'
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
PY

cat > astro_nav/util.py <<'PY'
from __future__ import annotations
import math

def wrap_deg180(x: float) -> float:
    # wrap to [-180, 180)
    y = (x + 180.0) % 360.0 - 180.0
    return y

def to_astronomical_year(year: int) -> int:
    """
    Convert "historical" BC year input (e.g., -128 meaning 128 BC) into astronomical year numbering.
    Astronomical year numbering has year 0 = 1 BC, year -1 = 2 BC, etc.
    So 128 BC (historical) => -127 astronomical.
    For AD years, unchanged.
    """
    return year + 1 if year < 0 else year

def deg_from_arcmin(arcmin: float) -> float:
    return arcmin / 60.0

def arcmin_from_deg(deg: float) -> float:
    return deg * 60.0

def spherical_distance_deg(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    # all in degrees
    lon1r, lat1r, lon2r, lat2r = map(math.radians, [lon1, lat1, lon2, lat2])
    cos_d = (math.sin(lat1r)*math.sin(lat2r) + math.cos(lat1r)*math.cos(lat2r)*math.cos(lon1r-lon2r))
    cos_d = max(-1.0, min(1.0, cos_d))
    return math.degrees(math.acos(cos_d))
PY

# =============================================================================
# CATALOG IO
# =============================================================================
cat > astro_nav/catalog_io.py <<'PY'
from __future__ import annotations
import pandas as pd
from dataclasses import dataclass
from typing import Optional
from astro_nav import db
from astro_nav.util import wrap_deg180

@dataclass
class CatalogRow:
    object_key: str
    canonical_name: str
    constellation: Optional[str]
    hip_id: Optional[int]
    gaia_source_id: Optional[int]
    entry_no: Optional[int]
    recorded_lon: Optional[float]
    recorded_lat: Optional[float]
    magnitude_int: Optional[int]
    description: Optional[str]
    source_urn: Optional[str]

async def ensure_catalog(catalog_key: str, name: str, coord_system: str, epoch_year: Optional[int] = None, notes: str = "") -> int:
    row = await db.fetch("SELECT catalog_id FROM astro.catalogs WHERE catalog_key=$1", catalog_key)
    if row:
        return int(row[0]["catalog_id"])
    await db.execute("""
        INSERT INTO astro.catalogs(catalog_key, name, epoch_year, coord_system, notes)
        VALUES ($1,$2,$3,$4,$5)
    """, catalog_key, name, epoch_year, coord_system, notes)
    cid = await db.fetchval("SELECT catalog_id FROM astro.catalogs WHERE catalog_key=$1", catalog_key)
    return int(cid)

async def upsert_object(object_key: str, canonical_name: str, constellation: Optional[str], hip_id: Optional[int], gaia_source_id: Optional[int]) -> int:
    await db.execute("""
        INSERT INTO astro.objects(object_key, object_type, canonical_name, constellation, hip_id, gaia_source_id)
        VALUES ($1,'star',$2,$3,$4,$5)
        ON CONFLICT (object_key) DO UPDATE SET
          canonical_name=EXCLUDED.canonical_name,
          constellation=EXCLUDED.constellation,
          hip_id=COALESCE(EXCLUDED.hip_id, astro.objects.hip_id),
          gaia_source_id=COALESCE(EXCLUDED.gaia_source_id, astro.objects.gaia_source_id),
          updated_at=NOW()
    """, object_key, canonical_name, constellation, hip_id, gaia_source_id)
    oid = await db.fetchval("SELECT object_id FROM astro.objects WHERE object_key=$1", object_key)
    return int(oid)

async def import_catalog_csv(
    csv_path: str,
    catalog_key: str,
    catalog_name: str,
    coord_system: str = "tropical_ecliptic",
    epoch_year: Optional[int] = None,
    notes: str = ""
) -> None:
    df = pd.read_csv(csv_path)
    required = ["object_key", "canonical_name", "entry_no", "recorded_lon", "recorded_lat"]
    for c in required:
        if c not in df.columns:
            raise ValueError(f"CSV missing required column: {c}")

    catalog_id = await ensure_catalog(catalog_key, catalog_name, coord_system, epoch_year=epoch_year, notes=notes)

    inserted = 0
    for _, r in df.iterrows():
        constellation = r.get("constellation", None)
        hip_id = int(r["hip_id"]) if "hip_id" in df.columns and pd.notna(r["hip_id"]) else None
        gaia_source_id = int(r["gaia_source_id"]) if "gaia_source_id" in df.columns and pd.notna(r["gaia_source_id"]) else None

        oid = await upsert_object(
            object_key=str(r["object_key"]),
            canonical_name=str(r["canonical_name"]),
            constellation=str(constellation) if pd.notna(constellation) else None,
            hip_id=hip_id,
            gaia_source_id=gaia_source_id
        )

        await db.execute("""
            INSERT INTO astro.catalog_entries
              (catalog_id, object_id, entry_no, constellation, recorded_lon, recorded_lat, magnitude_int, description, source_urn)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            ON CONFLICT (catalog_id, entry_no) DO UPDATE SET
              object_id=EXCLUDED.object_id,
              constellation=EXCLUDED.constellation,
              recorded_lon=EXCLUDED.recorded_lon,
              recorded_lat=EXCLUDED.recorded_lat,
              magnitude_int=EXCLUDED.magnitude_int,
              description=EXCLUDED.description,
              source_urn=EXCLUDED.source_urn
        """,
        catalog_id,
        oid,
        int(r["entry_no"]) if pd.notna(r["entry_no"]) else None,
        str(constellation) if pd.notna(constellation) else None,
        float(r["recorded_lon"]) if pd.notna(r["recorded_lon"]) else None,
        float(r["recorded_lat"]) if pd.notna(r["recorded_lat"]) else None,
        int(r["magnitude_int"]) if "magnitude_int" in df.columns and pd.notna(r["magnitude_int"]) else None,
        str(r["description"]) if "description" in df.columns and pd.notna(r["description"]) else None,
        str(r["source_urn"]) if "source_urn" in df.columns and pd.notna(r["source_urn"]) else None
        )
        inserted += 1

    print(f"✓ Imported/updated {inserted} entries into astro.catalog_entries for catalog_key={catalog_key}")
PY

# =============================================================================
# GAIA TAP CLIENT (HIP->GAIA + ASTROMETRY)
# =============================================================================
cat > astro_nav/gaia.py <<'PY'
from __future__ import annotations
import aiohttp
import json
from typing import Optional
from astro_nav import db

GAIA_TAP_URL = "https://gea.esac.esa.int/tap-server/tap/sync"

ADQL_HIP_TO_GAIA = """
SELECT
  h.hip_id,
  g.source_id,
  g.ra,
  g.dec,
  g.pmra,
  g.pmdec,
  g.parallax,
  g.radial_velocity,
  g.ra_error,
  g.dec_error,
  g.pmra_error,
  g.pmdec_error,
  g.phot_g_mean_mag
FROM gaiadr3.hipparcos2_best_neighbour AS h
JOIN gaiadr3.gaia_source AS g ON h.source_id = g.source_id
WHERE h.hip_id IN ({hip_list})
"""

async def _tap_sync(query: str, timeout_sec: int = 120) -> dict:
    data = {
        "REQUEST": "doQuery",
        "LANG": "ADQL",
        "FORMAT": "json",
        "QUERY": query
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(GAIA_TAP_URL, data=data, timeout=timeout_sec) as resp:
            txt = await resp.text()
            if resp.status != 200:
                raise RuntimeError(f"Gaia TAP error {resp.status}: {txt[:400]}")
            return json.loads(txt)

async def fetch_gaia_for_missing(limit_objects: int = 5000, chunk_size: int = 400) -> int:
    """
    Fetch Gaia DR3 astrometry for astro.objects that have hip_id but missing modern_astrometry.
    Stores results in astro.modern_astrometry and updates astro.objects.gaia_source_id.
    """
    rows = await db.fetch("""
        SELECT o.object_id, o.hip_id
        FROM astro.objects o
        LEFT JOIN astro.modern_astrometry m ON m.object_id=o.object_id
        WHERE o.hip_id IS NOT NULL AND m.object_id IS NULL
        ORDER BY o.object_id
        LIMIT $1
    """, limit_objects)

    if not rows:
        print("✓ No missing Gaia objects found.")
        return 0

    hip_ids = [int(r["hip_id"]) for r in rows]
    total = 0

    # Map hip_id -> object_id
    hip_to_oid = {int(r["hip_id"]): int(r["object_id"]) for r in rows}

    for i in range(0, len(hip_ids), chunk_size):
        chunk = hip_ids[i:i+chunk_size]
        hip_list = ",".join(str(x) for x in chunk)
        query = ADQL_HIP_TO_GAIA.format(hip_list=hip_list)

        res = await _tap_sync(query)
        data = res.get("data", [])
        # Column order = select order
        for row in data:
            hip_id = int(row[0])
            source_id = int(row[1])
            ra = float(row[2]) if row[2] is not None else None
            dec = float(row[3]) if row[3] is not None else None
            pmra = float(row[4]) if row[4] is not None else None
            pmdec = float(row[5]) if row[5] is not None else None
            parallax = float(row[6]) if row[6] is not None else None
            radvel = float(row[7]) if row[7] is not None else None
            ra_err = float(row[8]) if row[8] is not None else None
            dec_err = float(row[9]) if row[9] is not None else None
            pmra_err = float(row[10]) if row[10] is not None else None
            pmdec_err = float(row[11]) if row[11] is not None else None
            gmag = float(row[12]) if row[12] is not None else None

            oid = hip_to_oid.get(hip_id)
            if oid is None:
                continue

            await db.execute("""
                UPDATE astro.objects SET gaia_source_id=$1, updated_at=NOW()
                WHERE object_id=$2
            """, source_id, oid)

            await db.execute("""
                INSERT INTO astro.modern_astrometry
                  (object_id, ra_deg, dec_deg, pmra_masyr, pmdec_masyr, parallax_mas, radvel_kms,
                   ra_error_mas, dec_error_mas, pmra_error_masyr, pmdec_error_masyr, phot_g_mean_mag, source)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'GaiaDR3')
                ON CONFLICT (object_id) DO UPDATE SET
                  ra_deg=EXCLUDED.ra_deg,
                  dec_deg=EXCLUDED.dec_deg,
                  pmra_masyr=EXCLUDED.pmra_masyr,
                  pmdec_masyr=EXCLUDED.pmdec_masyr,
                  parallax_mas=EXCLUDED.parallax_mas,
                  radvel_kms=EXCLUDED.radvel_kms,
                  ra_error_mas=EXCLUDED.ra_error_mas,
                  dec_error_mas=EXCLUDED.dec_error_mas,
                  pmra_error_masyr=EXCLUDED.pmra_error_masyr,
                  pmdec_error_masyr=EXCLUDED.pmdec_error_masyr,
                  phot_g_mean_mag=EXCLUDED.phot_g_mean_mag,
                  fetched_at=NOW(),
                  source='GaiaDR3'
            """, oid, ra, dec, pmra, pmdec, parallax, radvel, ra_err, dec_err, pmra_err, pmdec_err, gmag)

            total += 1

        print(f"✓ Gaia chunk {i//chunk_size + 1}: updated {len(data)} stars")

    print(f"✓ Total Gaia updates: {total}")
    return total
PY

# =============================================================================
# ASTROMETRY + PREDICTIONS
# =============================================================================
cat > astro_nav/astrometry.py <<'PY'
from __future__ import annotations
import numpy as np
from dataclasses import dataclass
from typing import Any, Optional
from astro_nav.util import spherical_distance_deg, wrap_deg180, to_astronomical_year

from astropy.time import Time
import astropy.units as u
from astropy.coordinates import SkyCoord, Distance, GeocentricTrueEcliptic

@dataclass
class EntryAstroRow:
    entry_id: int
    object_id: int
    catalog_key: str
    object_key: str
    canonical_name: str
    constellation: Optional[str]
    recorded_lon: float
    recorded_lat: float
    magnitude_int: Optional[int]
    ra_deg: float
    dec_deg: float
    pmra_masyr: float
    pmdec_masyr: float
    parallax_mas: Optional[float]
    radvel_kms: Optional[float]
    phot_g_mean_mag: Optional[float]

def _time_from_year(year: int) -> Time:
    # Convert "historical" BC year input to astronomical numbering first (e.g., -128 => -127)
    y = to_astronomical_year(year)
    return Time(float(y), format="jyear", scale="tt")

def propagate_icrs_to_ecliptic_of_date(
    ra_deg: np.ndarray,
    dec_deg: np.ndarray,
    pmra_masyr: np.ndarray,
    pmdec_masyr: np.ndarray,
    parallax_mas: np.ndarray,
    radvel_kms: np.ndarray,
    target_year: int,
    ref_year: float = 2000.0,
) -> tuple[np.ndarray, np.ndarray]:
    """
    Vectorized propagation to target epoch + conversion to true ecliptic-of-date (lon/lat degrees).

    Uses astropy apply_space_motion with Gaia-style pm_ra_cosdec.
    """
    t0 = Time(float(ref_year), format="jyear", scale="tt")
    t1 = _time_from_year(target_year)

    # Distance: handle parallax <= 0 as "unknown" -> set to 1 kpc (doesn't matter much for proper motion)
    par = np.where(np.isfinite(parallax_mas) & (parallax_mas > 0), parallax_mas, np.nan)
    # Use a safe distance where parallax missing (1 kpc)
    dist = np.where(np.isfinite(par), (Distance(parallax=par * u.mas).to(u.pc).value), 1000.0) * u.pc

    rv = np.where(np.isfinite(radvel_kms), radvel_kms, 0.0) * (u.km / u.s)

    c0 = SkyCoord(
        ra=ra_deg * u.deg,
        dec=dec_deg * u.deg,
        pm_ra_cosdec=pmra_masyr * (u.mas / u.yr),
        pm_dec=pmdec_masyr * (u.mas / u.yr),
        distance=dist,
        radial_velocity=rv,
        obstime=t0,
        frame="icrs",
    )

    c1 = c0.apply_space_motion(new_obstime=t1)
    ecl = c1.transform_to(GeocentricTrueEcliptic(obstime=t1))

    lon = ecl.lon.to(u.deg).value % 360.0
    lat = ecl.lat.to(u.deg).value
    return lon.astype(float), lat.astype(float)

def predict_two_hypotheses(
    rows: list[EntryAstroRow],
    epoch_ptolemy: int,
    epoch_hipparchus: int,
    hipparchus_to_ptolemy_shift_deg: float = 2.6666667,
) -> dict[str, dict[str, Any]]:
    """
    Returns dict keyed by entry_id:
      {
        "ptolemy_epoch": {pred_lon, pred_lat, dlon, dlat, ang_resid},
        "hipparchus_copy": {pred_lon, pred_lat, dlon, dlat, ang_resid}
      }

    hipparchus_copy:
      - propagate star to Hipparchus epoch
      - compute ecliptic coords there
      - apply constant longitude shift used by Ptolemy (default 2°40')
      - compare to Ptolemy recorded lon/lat
    """
    n = len(rows)
    ra = np.array([r.ra_deg for r in rows], dtype=float)
    dec = np.array([r.dec_deg for r in rows], dtype=float)
    pmra = np.array([r.pmra_masyr for r in rows], dtype=float)
    pmdec = np.array([r.pmdec_masyr for r in rows], dtype=float)

    parallax = np.array([r.parallax_mas if r.parallax_mas is not None else np.nan for r in rows], dtype=float)
    radvel = np.array([r.radvel_kms if r.radvel_kms is not None else np.nan for r in rows], dtype=float)

    obs_lon = np.array([r.recorded_lon for r in rows], dtype=float) % 360.0
    obs_lat = np.array([r.recorded_lat for r in rows], dtype=float)

    lon_p, lat_p = propagate_icrs_to_ecliptic_of_date(ra, dec, pmra, pmdec, parallax, radvel, epoch_ptolemy)
    lon_h, lat_h = propagate_icrs_to_ecliptic_of_date(ra, dec, pmra, pmdec, parallax, radvel, epoch_hipparchus)

    # Apply copy shift
    lon_h_copy = (lon_h + hipparchus_to_ptolemy_shift_deg) % 360.0
    lat_h_copy = lat_h

    out: dict[str, dict[str, Any]] = {}
    for i, r in enumerate(rows):
        dlon_p = wrap_deg180(float(obs_lon[i] - lon_p[i]))
        dlat_p = float(obs_lat[i] - lat_p[i])
        resid_p = spherical_distance_deg(float(obs_lon[i]), float(obs_lat[i]), float(lon_p[i]), float(lat_p[i]))

        dlon_h = wrap_deg180(float(obs_lon[i] - lon_h_copy[i]))
        dlat_h = float(obs_lat[i] - lat_h_copy[i])
        resid_h = spherical_distance_deg(float(obs_lon[i]), float(obs_lat[i]), float(lon_h_copy[i]), float(lat_h_copy[i]))

        out[str(r.entry_id)] = {
            "ptolemy_epoch": {
                "epoch_year": epoch_ptolemy,
                "pred_lon": float(lon_p[i]),
                "pred_lat": float(lat_p[i]),
                "dlon": float(dlon_p),
                "dlat": float(dlat_p),
                "ang_resid": float(resid_p),
            },
            "hipparchus_copy": {
                "epoch_year": epoch_hipparchus,
                "pred_lon": float(lon_h_copy[i]),
                "pred_lat": float(lat_h_copy[i]),
                "dlon": float(dlon_h),
                "dlat": float(dlat_h),
                "ang_resid": float(resid_h),
            },
        }
    return out

def epoch_grid_best_fit(
    rows: list[EntryAstroRow],
    year_min: int,
    year_max: int,
    step: int = 5,
) -> dict[str, dict[str, Any]]:
    """
    For each entry, scan epochs and return best epoch by smallest ang_resid.
    This is where the "spectacular" part begins: star-by-star best epochs can reveal mixed sources and later corrections.
    """
    ra = np.array([r.ra_deg for r in rows], dtype=float)
    dec = np.array([r.dec_deg for r in rows], dtype=float)
    pmra = np.array([r.pmra_masyr for r in rows], dtype=float)
    pmdec = np.array([r.pmdec_masyr for r in rows], dtype=float)
    parallax = np.array([r.parallax_mas if r.parallax_mas is not None else np.nan for r in rows], dtype=float)
    radvel = np.array([r.radvel_kms if r.radvel_kms is not None else np.nan for r in rows], dtype=float)

    obs_lon = np.array([r.recorded_lon for r in rows], dtype=float) % 360.0
    obs_lat = np.array([r.recorded_lat for r in rows], dtype=float)

    best = {
        str(r.entry_id): {
            "best_epoch": None,
            "pred_lon": None,
            "pred_lat": None,
            "dlon": None,
            "dlat": None,
            "ang_resid": 1e9,
        }
        for r in rows
    }

    for year in range(year_min, year_max + 1, step):
        lon, lat = propagate_icrs_to_ecliptic_of_date(ra, dec, pmra, pmdec, parallax, radvel, year)
        for i, r in enumerate(rows):
            resid = spherical_distance_deg(float(obs_lon[i]), float(obs_lat[i]), float(lon[i]), float(lat[i]))
            if resid < best[str(r.entry_id)]["ang_resid"]:
                best[str(r.entry_id)] = {
                    "best_epoch": int(year),
                    "pred_lon": float(lon[i]),
                    "pred_lat": float(lat[i]),
                    "dlon": float(wrap_deg180(float(obs_lon[i] - lon[i]))),
                    "dlat": float(obs_lat[i] - lat[i]),
                    "ang_resid": float(resid),
                }
    return best
PY

# =============================================================================
# MODELS: quantization-aware likelihood + systematics + mixture inference
# =============================================================================
cat > astro_nav/models.py <<'PY'
from __future__ import annotations
import math
from dataclasses import dataclass
from typing import Iterable, Optional
import numpy as np
from scipy.special import logsumexp
from astro_nav.util import deg_from_arcmin, wrap_deg180

@dataclass
class LikelihoodConfig:
    sigma_deg: float
    rounding_deg: float

def _log_norm_cdf(x: float, sigma: float) -> float:
    # log Phi(x/sigma) stable-ish
    return math.log(0.5 * (1.0 + math.erf(x / (sigma * math.sqrt(2.0)))))

def _log_interval_prob(mu: float, center: float, half_width: float, sigma: float) -> float:
    """
    Probability that N(mu, sigma) lands in [center-half, center+half].
    Used for quantization-aware likelihood: observed coordinate represents a bin.
    """
    a = (center - half_width) - mu
    b = (center + half_width) - mu
    # Use cdf difference; clamp
    pa = 0.5 * (1.0 + math.erf(a / (sigma * math.sqrt(2.0))))
    pb = 0.5 * (1.0 + math.erf(b / (sigma * math.sqrt(2.0))))
    p = max(1e-12, pb - pa)
    return math.log(p)

def quantized_loglik_2d(dlon_deg: float, dlat_deg: float, cfg: LikelihoodConfig) -> float:
    """
    dlon, dlat are observed - predicted (so mu = 0 is perfect).
    We interpret observed measurement as quantized into bins of width rounding_deg.
    """
    half = cfg.rounding_deg / 2.0
    # Each residual is treated as the bin center; likelihood integrates around that bin.
    ll_lon = _log_interval_prob(mu=0.0, center=dlon_deg, half_width=half, sigma=cfg.sigma_deg)
    ll_lat = _log_interval_prob(mu=0.0, center=dlat_deg, half_width=half, sigma=cfg.sigma_deg)
    return ll_lon + ll_lat

def rms(values: Iterable[float]) -> float:
    vals = np.array(list(values), dtype=float)
    return float(np.sqrt(np.mean(vals**2))) if len(vals) else float("nan")

def bic(loglik: float, k_params: int, n: int) -> float:
    # BIC = -2 lnL + k ln(n)
    return -2.0 * loglik + k_params * math.log(max(n, 1))

def fit_global_offsets(dlon: np.ndarray, dlat: np.ndarray, robust: bool = True) -> tuple[float, float]:
    """
    Estimate global systematics offsets to remove a constant bias.
    robust=True uses median, else mean.
    """
    if robust:
        return float(np.median(dlon)), float(np.median(dlat))
    return float(np.mean(dlon)), float(np.mean(dlat))

def fit_constellation_offsets(
    constellations: list[Optional[str]],
    dlon: np.ndarray,
    dlat: np.ndarray,
    shrinkage: float = 10.0
) -> dict[str, tuple[float, float, int]]:
    """
    Simple empirical Bayes shrinkage:
      offset_c = (n * mean_c) / (n + shrinkage)
    where shrinkage is pseudo-count.
    """
    groups: dict[str, list[int]] = {}
    for i, c in enumerate(constellations):
        key = (c or "UNKNOWN").strip() or "UNKNOWN"
        groups.setdefault(key, []).append(i)

    out: dict[str, tuple[float, float, int]] = {}
    for c, idxs in groups.items():
        n = len(idxs)
        mean_lon = float(np.mean(dlon[idxs])) if n else 0.0
        mean_lat = float(np.mean(dlat[idxs])) if n else 0.0
        w = n / (n + shrinkage)
        out[c] = (w * mean_lon, w * mean_lat, n)
    return out

def mixture_weight_mle(loglik_a: np.ndarray, loglik_b: np.ndarray) -> float:
    """
    MLE for mixture weight w for component B in:
      p = (1-w) * exp(ll_a) + w * exp(ll_b)
    We do a grid search for stability (fast + reliable).
    """
    ws = np.linspace(0.001, 0.999, 999)
    best_w = 0.5
    best_ll = -1e18
    for w in ws:
        ll = np.sum(logsumexp(np.vstack([np.log(1-w) + loglik_a, np.log(w) + loglik_b]), axis=0))
        if ll > best_ll:
            best_ll = float(ll)
            best_w = float(w)
    return best_w

def mixture_posteriors(loglik_a: np.ndarray, loglik_b: np.ndarray, w_b: float) -> np.ndarray:
    """
    Posterior p(B|data) for each observation.
    """
    log_pa = math.log(1.0 - w_b) + loglik_a
    log_pb = math.log(w_b) + loglik_b
    denom = logsumexp(np.vstack([log_pa, log_pb]), axis=0)
    return np.exp(log_pb - denom)
PY

# =============================================================================
# PIPELINE (multi-agent coordinator + resumable jobs)
# =============================================================================
cat > astro_nav/pipeline.py <<'PY'
from __future__ import annotations
import json
import hashlib
from dataclasses import dataclass
from typing import Any, Optional
import numpy as np
from astro_nav import db
from astro_nav.astrometry import EntryAstroRow, predict_two_hypotheses, epoch_grid_best_fit
from astro_nav.models import LikelihoodConfig, quantized_loglik_2d, rms, bic, fit_global_offsets, fit_constellation_offsets, mixture_weight_mle, mixture_posteriors
from astro_nav.util import deg_from_arcmin

def _run_key(prefix: str, payload: dict[str, Any]) -> str:
    h = hashlib.sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()[:16]
    return f"{prefix}_{h}"

async def create_run(prefix: str, config: dict[str, Any], notes: str = "") -> tuple[int, str]:
    run_key = _run_key(prefix, config)
    existing = await db.fetch("SELECT run_id FROM astro.analysis_runs WHERE run_key=$1", run_key)
    if existing:
        return int(existing[0]["run_id"]), run_key

    await db.execute("""
        INSERT INTO astro.analysis_runs(run_key, config, notes)
        VALUES ($1, $2::jsonb, $3)
    """, run_key, json.dumps(config), notes)
    rid = await db.fetchval("SELECT run_id FROM astro.analysis_runs WHERE run_key=$1", run_key)
    return int(rid), run_key

async def load_entries_for_catalog(catalog_key: str, limit: Optional[int] = None) -> list[EntryAstroRow]:
    lim = f"LIMIT {int(limit)}" if limit else ""
    rows = await db.fetch(f"""
        SELECT
          e.entry_id,
          o.object_id,
          c.catalog_key,
          o.object_key,
          o.canonical_name,
          COALESCE(e.constellation, o.constellation) AS constellation,
          e.recorded_lon,
          e.recorded_lat,
          e.magnitude_int,
          m.ra_deg,
          m.dec_deg,
          m.pmra_masyr,
          m.pmdec_masyr,
          m.parallax_mas,
          m.radvel_kms,
          m.phot_g_mean_mag
        FROM astro.catalog_entries e
        JOIN astro.catalogs c ON c.catalog_id=e.catalog_id
        JOIN astro.objects o ON o.object_id=e.object_id
        JOIN astro.modern_astrometry m ON m.object_id=o.object_id
        WHERE c.catalog_key=$1
          AND e.recorded_lon IS NOT NULL AND e.recorded_lat IS NOT NULL
          AND m.ra_deg IS NOT NULL AND m.dec_deg IS NOT NULL
          AND m.pmra_masyr IS NOT NULL AND m.pmdec_masyr IS NOT NULL
        ORDER BY e.entry_id
        {lim}
    """, catalog_key)

    out: list[EntryAstroRow] = []
    for r in rows:
        out.append(EntryAstroRow(
            entry_id=int(r["entry_id"]),
            object_id=int(r["object_id"]),
            catalog_key=str(r["catalog_key"]),
            object_key=str(r["object_key"]),
            canonical_name=str(r["canonical_name"]),
            constellation=str(r["constellation"]) if r["constellation"] is not None else None,
            recorded_lon=float(r["recorded_lon"]),
            recorded_lat=float(r["recorded_lat"]),
            magnitude_int=int(r["magnitude_int"]) if r["magnitude_int"] is not None else None,
            ra_deg=float(r["ra_deg"]),
            dec_deg=float(r["dec_deg"]),
            pmra_masyr=float(r["pmra_masyr"]),
            pmdec_masyr=float(r["pmdec_masyr"]),
            parallax_mas=float(r["parallax_mas"]) if r["parallax_mas"] is not None else None,
            radvel_kms=float(r["radvel_kms"]) if r["radvel_kms"] is not None else None,
            phot_g_mean_mag=float(r["phot_g_mean_mag"]) if r["phot_g_mean_mag"] is not None else None
        ))
    return out

async def run_epoch_comparison(
    catalog_key: str,
    epoch_ptolemy: int = 137,
    epoch_hipparchus: int = -128,
    hip_shift_deg: float = 2.6666667,
    sigma_arcmin: float = 20.0,
    rounding_arcmin: float = 10.0,
    constellation_shrinkage: float = 10.0,
    limit: Optional[int] = None,
    notes: str = ""
) -> dict[str, Any]:
    """
    Field-changing version:
      - computes predictions under two hypotheses
      - fits global offsets + constellation offsets (systematics)
      - uses quantization-aware likelihood (rounding-aware)
      - fits mixture weight + per-entry posterior (who looks copied?)
      - stores everything in DB as a fully reproducible run
    """
    cfg = {
        "catalog_key": catalog_key,
        "epoch_ptolemy": epoch_ptolemy,
        "epoch_hipparchus": epoch_hipparchus,
        "hip_shift_deg": hip_shift_deg,
        "sigma_arcmin": sigma_arcmin,
        "rounding_arcmin": rounding_arcmin,
        "constellation_shrinkage": constellation_shrinkage,
        "limit": limit
    }
    run_id, run_key = await create_run("epoch_compare", cfg, notes=notes)
    rows = await load_entries_for_catalog(catalog_key, limit=limit)
    if not rows:
        raise RuntimeError("No rows loaded. Make sure you imported a catalog and fetched Gaia data.")

    pred = predict_two_hypotheses(rows, epoch_ptolemy, epoch_hipparchus, hipparchus_to_ptolemy_shift_deg=hip_shift_deg)

    # Build arrays for systematics fitting
    consts = [r.constellation for r in rows]
    dlon_a = np.array([pred[str(r.entry_id)]["ptolemy_epoch"]["dlon"] for r in rows], dtype=float)
    dlat_a = np.array([pred[str(r.entry_id)]["ptolemy_epoch"]["dlat"] for r in rows], dtype=float)
    dlon_b = np.array([pred[str(r.entry_id)]["hipparchus_copy"]["dlon"] for r in rows], dtype=float)
    dlat_b = np.array([pred[str(r.entry_id)]["hipparchus_copy"]["dlat"] for r in rows], dtype=float)

    # Global offsets
    off_a = fit_global_offsets(dlon_a, dlat_a, robust=True)
    off_b = fit_global_offsets(dlon_b, dlat_b, robust=True)

    # Constellation offsets (shrinkage)
    con_a = fit_constellation_offsets(consts, dlon_a - off_a[0], dlat_a - off_a[1], shrinkage=constellation_shrinkage)
    con_b = fit_constellation_offsets(consts, dlon_b - off_b[0], dlat_b - off_b[1], shrinkage=constellation_shrinkage)

    # Likelihood config
    ll_cfg = LikelihoodConfig(
        sigma_deg=deg_from_arcmin(sigma_arcmin),
        rounding_deg=deg_from_arcmin(rounding_arcmin)
    )

    loglik_a = []
    loglik_b = []

    # Store predictions + compute loglik with systematics applied
    for r in rows:
        ckey = (r.constellation or "UNKNOWN").strip() or "UNKNOWN"
        oa_lon, oa_lat, _ = con_a.get(ckey, (0.0, 0.0, 0))
        ob_lon, ob_lat, _ = con_b.get(ckey, (0.0, 0.0, 0))

        pa = pred[str(r.entry_id)]["ptolemy_epoch"]
        pb = pred[str(r.entry_id)]["hipparchus_copy"]

        dlon_a_corr = float(pa["dlon"] - off_a[0] - oa_lon)
        dlat_a_corr = float(pa["dlat"] - off_a[1] - oa_lat)

        dlon_b_corr = float(pb["dlon"] - off_b[0] - ob_lon)
        dlat_b_corr = float(pb["dlat"] - off_b[1] - ob_lat)

        ll_a = quantized_loglik_2d(dlon_a_corr, dlat_a_corr, ll_cfg)
        ll_b = quantized_loglik_2d(dlon_b_corr, dlat_b_corr, ll_cfg)

        loglik_a.append(ll_a)
        loglik_b.append(ll_b)

        # Upsert two predictions
        await db.execute("""
            INSERT INTO astro.predictions(run_id, entry_id, hypothesis, epoch_year, model_params,
              pred_lon, pred_lat, dlon, dlat, ang_resid, loglik)
            VALUES
              ($1,$2,'ptolemy_epoch',$3,$4::jsonb,$5,$6,$7,$8,$9,$10),
              ($1,$2,'hipparchus_copy',$11,$12::jsonb,$13,$14,$15,$16,$17,$18)
            ON CONFLICT DO NOTHING
        """,
        run_id, r.entry_id,
        int(pa["epoch_year"]), json.dumps({"global_offset": off_a, "const_offset": [oa_lon, oa_lat]}),
        float(pa["pred_lon"]), float(pa["pred_lat"]), dlon_a_corr, dlat_a_corr, float(pa["ang_resid"]), float(ll_a),
        int(pb["epoch_year"]), json.dumps({"global_offset": off_b, "const_offset": [ob_lon, ob_lat], "hip_shift_deg": hip_shift_deg}),
        float(pb["pred_lon"]), float(pb["pred_lat"]), dlon_b_corr, dlat_b_corr, float(pb["ang_resid"]), float(ll_b)
        )

    loglik_a = np.array(loglik_a, dtype=float)
    loglik_b = np.array(loglik_b, dtype=float)

    # Mixture inference
    w_b = mixture_weight_mle(loglik_a, loglik_b)
    post_b = mixture_posteriors(loglik_a, loglik_b, w_b=w_b)

    # Fit summaries
    n = len(rows)
    ll_a_tot = float(np.sum(loglik_a))
    ll_b_tot = float(np.sum(loglik_b))
    # Mixture LL
    ll_mix = float(np.sum(np.log((1-w_b)*np.exp(loglik_a - loglik_a.max()) + w_b*np.exp(loglik_b - loglik_a.max())) + loglik_a.max()))
    # (The above is safe enough for typical scales; mixture BIC drives decisions, not tiny LL deltas.)

    bic_a = bic(ll_a_tot, k_params=2, n=n)   # approx: lon+lat global offsets already absorbed
    bic_b = bic(ll_b_tot, k_params=3, n=n)   # includes shift param conceptually
    bic_m = bic(ll_mix,   k_params=4, n=n)   # mix weight + offsets

    best_k1 = min(bic_a, bic_b)
    log_bf = (best_k1 - bic_m) / 2.0

    rms_a = rms([float(x) for x in (dlon_a - off_a[0])])
    rms_b = rms([float(x) for x in (dlon_b - off_b[0])])

    # Store systematics
    await db.execute("DELETE FROM astro.systematics WHERE run_id=$1 AND catalog_key=$2", run_id, catalog_key)
    for const, (ol, ot, nn) in con_a.items():
        await db.execute("""
            INSERT INTO astro.systematics(run_id,catalog_key,hypothesis,constellation,n_entries,offset_lon_deg,offset_lat_deg,shrinkage)
            VALUES ($1,$2,'ptolemy_epoch',$3,$4,$5,$6,$7)
        """, run_id, catalog_key, const, nn, float(ol), float(ot), float(constellation_shrinkage))
    for const, (ol, ot, nn) in con_b.items():
        await db.execute("""
            INSERT INTO astro.systematics(run_id,catalog_key,hypothesis,constellation,n_entries,offset_lon_deg,offset_lat_deg,shrinkage)
            VALUES ($1,$2,'hipparchus_copy',$3,$4,$5,$6,$7)
        """, run_id, catalog_key, const, nn, float(ol), float(ot), float(constellation_shrinkage))

    # Store summary
    await db.execute("""
        INSERT INTO astro.model_summaries
          (run_id, catalog_key, hypothesis_a, hypothesis_b, n_entries, rms_a, rms_b, bic_a, bic_b, bic_mix,
           mix_weight_b, log_bayes_factor_mix_vs_best, precession_shift_deg, rounding_arcmin, sigma_arcmin, notes)
        VALUES ($1,$2,'ptolemy_epoch','hipparchus_copy',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        ON CONFLICT DO NOTHING
    """,
    run_id, catalog_key, n, float(rms_a), float(rms_b), float(bic_a), float(bic_b), float(bic_m),
    float(w_b), float(log_bf), float(hip_shift_deg), float(rounding_arcmin), float(sigma_arcmin),
    notes or ""
    )

    # Store per-entry posterior as an evidence JSON on a synthetic prediction row
    # (keeps schema compact; UI can read it from predictions where hypothesis='mixture_posterior')
    for i, r in enumerate(rows):
        await db.execute("""
            INSERT INTO astro.predictions(run_id, entry_id, hypothesis, epoch_year, model_params, loglik)
            VALUES ($1,$2,'mixture_posterior',NULL,$3::jsonb,NULL)
            ON CONFLICT DO NOTHING
        """, run_id, r.entry_id, json.dumps({"p_hipparchus_copy": float(post_b[i]), "w_b": float(w_b)}))

    return {
        "run_key": run_key,
        "run_id": run_id,
        "n_entries": n,
        "mix_weight_hipparchus_copy": float(w_b),
        "bic": {"ptolemy_epoch": float(bic_a), "hipparchus_copy": float(bic_b), "mixture": float(bic_m)},
        "log_bayes_factor_mix_vs_best": float(log_bf),
    }

async def run_catalog_dating(
    catalog_key: str,
    year_min: int,
    year_max: int,
    step: int = 5,
    sigma_arcmin: float = 20.0,
    rounding_arcmin: float = 10.0,
    limit: Optional[int] = None,
    notes: str = ""
) -> dict[str, Any]:
    """
    Generic dating engine:
      - scan epochs, pick best per entry
      - aggregate to find strongest epoch cluster
    Useful for Sanskrit/Arabic/Hebrew catalogs where epoch is debated.
    """
    cfg = {
        "catalog_key": catalog_key,
        "year_min": year_min,
        "year_max": year_max,
        "step": step,
        "sigma_arcmin": sigma_arcmin,
        "rounding_arcmin": rounding_arcmin,
        "limit": limit
    }
    run_id, run_key = await create_run("catalog_date", cfg, notes=notes)
    rows = await load_entries_for_catalog(catalog_key, limit=limit)
    best = epoch_grid_best_fit(rows, year_min=year_min, year_max=year_max, step=step)

    # store
    for r in rows:
        b = best[str(r.entry_id)]
        await db.execute("""
            INSERT INTO astro.predictions(run_id, entry_id, hypothesis, epoch_year, model_params,
              pred_lon, pred_lat, dlon, dlat, ang_resid)
            VALUES ($1,$2,'epoch_scan_best',$3,$4::jsonb,$5,$6,$7,$8,$9)
            ON CONFLICT DO NOTHING
        """,
        run_id, r.entry_id, int(b["best_epoch"]), json.dumps({"year_min": year_min, "year_max": year_max, "step": step}),
        float(b["pred_lon"]), float(b["pred_lat"]), float(b["dlon"]), float(b["dlat"]), float(b["ang_resid"])
        )

    epochs = np.array([best[str(r.entry_id)]["best_epoch"] for r in rows], dtype=int)
    # dominant epoch = mode
    vals, counts = np.unique(epochs, return_counts=True)
    dom = int(vals[int(np.argmax(counts))])

    return {
        "run_key": run_key,
        "run_id": run_id,
        "n_entries": len(rows),
        "dominant_epoch": dom,
        "epoch_histogram": {int(v): int(c) for v, c in zip(vals, counts)}
    }
PY

# =============================================================================
# MENTION MINING (connect stars to texts: Greek/Sanskrit/Hebrew)
# =============================================================================
cat > astro_nav/mentions.py <<'PY'
from __future__ import annotations
import re
import json
from typing import Optional
import yaml
from astro_nav.config import settings
from astro_nav import db

def _safe_like(s: str) -> str:
    # Escape % and _ for LIKE/ILIKE
    return s.replace("%", "\\%").replace("_", "\\_")

async def load_aliases_from_yaml(path: str) -> int:
    """
    YAML format:
      - object_key: arcturus
        canonical_name: Arcturus
        aliases:
          - {text: "Arcturus", language: "en"}
          - {text: "Ἀρκτοῦρος", language: "grc"}
    If object does not exist yet, create it (object_type=star).
    """
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    inserted = 0
    for item in data:
        object_key = str(item["object_key"])
        canonical_name = str(item.get("canonical_name", object_key))
        constellation = item.get("constellation", None)

        # ensure object
        await db.execute("""
          INSERT INTO astro.objects(object_key, object_type, canonical_name, constellation)
          VALUES ($1,'star',$2,$3)
          ON CONFLICT (object_key) DO UPDATE SET canonical_name=EXCLUDED.canonical_name, updated_at=NOW()
        """, object_key, canonical_name, constellation)

        oid = await db.fetchval("SELECT object_id FROM astro.objects WHERE object_key=$1", object_key)

        for a in item.get("aliases", []):
            alias = str(a["text"]).strip()
            lang = str(a.get("language", "")).strip() or None
            src = str(a.get("source", "manual")).strip()
            if not alias:
                continue
            await db.execute("""
              INSERT INTO astro.star_aliases(object_id, alias, language, source)
              VALUES ($1,$2,$3,$4)
              ON CONFLICT (object_id, alias) DO NOTHING
            """, int(oid), alias, lang, src)
            inserted += 1

    print(f"✓ Loaded {inserted} aliases into astro.star_aliases")
    return inserted

async def mine_mentions(limit_aliases: Optional[int] = None, per_alias_limit: int = 250) -> int:
    """
    Fast-ish mention miner:
      - For each alias, searches your LOGOS text table for occurrences
      - Stores snippet + offsets into astro.text_mentions

    IMPORTANT: for 6.7M+ passages, you should set MENTION_WORK_ALLOWLIST
    to restrict to astronomy/mythography corpora (Ptolemy, Aratus, etc.)
    to keep it lightning fast.
    """
    text_cfg = settings.logos_text
    allowlist = text_cfg.allowlist()

    alias_rows = await db.fetch(f"""
      SELECT a.alias_id, a.alias, a.language, o.object_id
      FROM astro.star_aliases a
      JOIN astro.objects o ON o.object_id=a.object_id
      ORDER BY a.alias_id
      {f"LIMIT {int(limit_aliases)}" if limit_aliases else ""}
    """)

    if not alias_rows:
        print("No aliases found. Load aliases first.")
        return 0

    total = 0
    for ar in alias_rows:
        alias = str(ar["alias"])
        lang = ar["language"]
        object_id = int(ar["object_id"])

        where = []
        args = []
        # content ILIKE pattern
        where.append(f"{text_cfg.content_col} ILIKE $1 ESCAPE '\\\\'")
        args.append(f"%{_safe_like(alias)}%")

        if lang and text_cfg.lang_col:
            where.append(f"{text_cfg.lang_col} = ${len(args)+1}")
            args.append(lang)

        if allowlist and text_cfg.work_col:
            where.append(f"{text_cfg.work_col} = ANY(${len(args)+1})")
            args.append(allowlist)

        q = f"""
          SELECT {text_cfg.urn_col} AS urn, {text_cfg.content_col} AS content
          FROM {text_cfg.table}
          WHERE {' AND '.join(where)}
          LIMIT {int(per_alias_limit)}
        """

        hits = await db.fetch(q, *args)

        for h in hits:
            urn = str(h["urn"])
            content = str(h["content"] or "")
            # find first match (simple); store offsets
            m = re.search(re.escape(alias), content, flags=re.IGNORECASE)
            if not m:
                continue
            start, end = int(m.start()), int(m.end())
            snippet = content[max(0, start-80):min(len(content), end+120)]

            await db.execute("""
              INSERT INTO astro.text_mentions(object_id, alias, language, urn, char_start, char_end, snippet, confidence, method, evidence)
              VALUES ($1,$2,$3,$4,$5,$6,$7,0.6,'string_match',$8::jsonb)
              ON CONFLICT (object_id, urn, char_start, char_end) DO NOTHING
            """, object_id, alias, lang, urn, start, end, snippet, json.dumps({"pattern": "ILIKE"}))

            total += 1

        if hits:
            print(f"✓ alias='{alias}' hits={len(hits)}")

    print(f"✓ Total mentions stored: {total}")
    return total
PY

# =============================================================================
# REPORT GENERATION (publishable figures + tables)
# =============================================================================
cat > astro_nav/report.py <<'PY'
from __future__ import annotations
import os
import json
import math
import pandas as pd
import matplotlib.pyplot as plt
from astro_nav import db

async def export_run_csv(run_key: str, out_dir: str = "reports") -> dict[str, str]:
    os.makedirs(out_dir, exist_ok=True)
    run = await db.fetch("SELECT run_id, config FROM astro.analysis_runs WHERE run_key=$1", run_key)
    if not run:
        raise RuntimeError("run_key not found")

    run_id = int(run[0]["run_id"])
    preds = await db.fetch("""
      SELECT p.hypothesis, p.entry_id, p.epoch_year, p.pred_lon, p.pred_lat, p.dlon, p.dlat, p.ang_resid, p.loglik,
             o.canonical_name, o.object_key, o.constellation, o.hip_id
      FROM astro.predictions p
      JOIN astro.catalog_entries e ON e.entry_id=p.entry_id
      JOIN astro.objects o ON o.object_id=e.object_id
      WHERE p.run_id=$1
    """, run_id)

    df = pd.DataFrame([dict(r) for r in preds])
    csv_path = os.path.join(out_dir, f"{run_key}_predictions.csv")
    df.to_csv(csv_path, index=False)

    summ = await db.fetch("SELECT * FROM astro.model_summaries WHERE run_id=$1", run_id)
    summ_path = os.path.join(out_dir, f"{run_key}_model_summary.json")
    with open(summ_path, "w", encoding="utf-8") as f:
        json.dump([dict(r) for r in summ], f, indent=2, default=str)

    return {"predictions_csv": csv_path, "model_summary_json": summ_path}

async def make_figures(run_key: str, out_dir: str = "reports/figures") -> list[str]:
    os.makedirs(out_dir, exist_ok=True)
    run = await db.fetch("SELECT run_id FROM astro.analysis_runs WHERE run_key=$1", run_key)
    if not run:
        raise RuntimeError("run_key not found")
    run_id = int(run[0]["run_id"])

    preds = await db.fetch("""
      SELECT hypothesis, ang_resid, dlon, dlat
      FROM astro.predictions
      WHERE run_id=$1 AND hypothesis IN ('ptolemy_epoch','hipparchus_copy')
    """, run_id)
    df = pd.DataFrame([dict(r) for r in preds])

    paths: list[str] = []

    # Residual histogram
    plt.figure()
    for hyp in ["ptolemy_epoch","hipparchus_copy"]:
        sub = df[df["hypothesis"]==hyp]["ang_resid"].dropna().astype(float)
        plt.hist(sub, bins=40, alpha=0.5, label=hyp)
    plt.xlabel("Angular residual (deg)")
    plt.ylabel("Count")
    plt.legend()
    p1 = os.path.join(out_dir, f"{run_key}_residual_hist.png")
    plt.savefig(p1, dpi=160, bbox_inches="tight")
    plt.close()
    paths.append(p1)

    # dlon vs dlat scatter
    plt.figure()
    for hyp in ["ptolemy_epoch","hipparchus_copy"]:
        sub = df[df["hypothesis"]==hyp]
        plt.scatter(sub["dlon"], sub["dlat"], s=6, alpha=0.5, label=hyp)
    plt.xlabel("Δlon (deg) (obs - pred)")
    plt.ylabel("Δlat (deg) (obs - pred)")
    plt.legend()
    p2 = os.path.join(out_dir, f"{run_key}_dlon_dlat.png")
    plt.savefig(p2, dpi=160, bbox_inches="tight")
    plt.close()
    paths.append(p2)

    return paths

async def generate_markdown(run_key: str, out_path: str = None) -> str:
    if out_path is None:
        out_path = f"reports/{run_key}_REPORT.md"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    run = await db.fetch("SELECT run_id, created_at, config FROM astro.analysis_runs WHERE run_key=$1", run_key)
    if not run:
        raise RuntimeError("run_key not found")
    run_id = int(run[0]["run_id"])
    config = run[0]["config"]

    summary = await db.fetch("SELECT * FROM astro.model_summaries WHERE run_id=$1 ORDER BY created_at DESC LIMIT 1", run_id)
    s = dict(summary[0]) if summary else {}

    figs = await make_figures(run_key)

    md = []
    md.append(f"# LOGOS Astro Navigator Report\n")
    md.append(f"Run key: `{run_key}`\n")
    md.append(f"Config: `{json.dumps(config, indent=2)}`\n")

    if s:
        md.append("## Model summary\n")
        md.append(f"- Catalog: `{s.get('catalog_key')}`\n")
        md.append(f"- Entries analyzed: **{s.get('n_entries')}**\n")
        md.append(f"- Mixture weight (Hipparchus-copy): **{s.get('mix_weight_b'):.3f}**\n")
        md.append(f"- BIC: Ptolemy={s.get('bic_a'):.1f}, Hipparchus={s.get('bic_b'):.1f}, Mixture={s.get('bic_mix'):.1f}\n")
        md.append(f"- log Bayes factor (mixture vs best single): **{s.get('log_bayes_factor_mix_vs_best'):.2f}**\n")

    md.append("\n## Figures\n")
    for f in figs:
        md.append(f"![]({os.path.relpath(f, os.path.dirname(out_path))})\n")

    with open(out_path, "w", encoding="utf-8") as fp:
        fp.write("\n".join(md))

    return out_path
PY

# =============================================================================
# FASTAPI (for your web Star Navigator)
# =============================================================================
cat > astro_nav/api.py <<'PY'
from __future__ import annotations
import os
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
    rows = await db.fetch("""
      SELECT run_key, created_at, config
      FROM astro.analysis_runs
      ORDER BY created_at DESC
      LIMIT $1
    """, limit)
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
async def run_stars(
    run_key: str,
    hypothesis: str = Query("ptolemy_epoch"),
    limit: int = 5000
):
    r = await db.fetch("SELECT run_id FROM astro.analysis_runs WHERE run_key=$1", run_key)
    if not r:
        return ORJSONResponse({"error": "run_key not found"}, status_code=404)
    run_id = int(r[0]["run_id"])

    rows = await db.fetch("""
      SELECT
        o.object_key, o.canonical_name, o.constellation, o.hip_id,
        e.entry_id, e.recorded_lon, e.recorded_lat,
        p.epoch_year, p.pred_lon, p.pred_lat, p.dlon, p.dlat, p.ang_resid, p.model_params
      FROM astro.predictions p
      JOIN astro.catalog_entries e ON e.entry_id=p.entry_id
      JOIN astro.objects o ON o.object_id=e.object_id
      WHERE p.run_id=$1 AND p.hypothesis=$2
      LIMIT $3
    """, run_id, hypothesis, limit)

    return ORJSONResponse([dict(x) for x in rows])

@app.get("/star/{object_key}/mentions")
async def star_mentions(object_key: str, limit: int = 200):
    oid = await db.fetchval("SELECT object_id FROM astro.objects WHERE object_key=$1", object_key)
    if not oid:
        return ORJSONResponse({"error": "object_key not found"}, status_code=404)
    rows = await db.fetch("""
      SELECT urn, alias, language, char_start, char_end, snippet, confidence, method
      FROM astro.text_mentions
      WHERE object_id=$1
      ORDER BY confidence DESC, mention_id DESC
      LIMIT $2
    """, int(oid), limit)
    return ORJSONResponse([dict(r) for r in rows])
PY

# =============================================================================
# CLI
# =============================================================================
cat > astro_nav/cli.py <<'PY'
from __future__ import annotations
import argparse
import asyncio
from astro_nav import db
from astro_nav.gaia import fetch_gaia_for_missing
from astro_nav.catalog_io import import_catalog_csv
from astro_nav.pipeline import run_epoch_comparison, run_catalog_dating
from astro_nav.mentions import load_aliases_from_yaml, mine_mentions
from astro_nav.report import export_run_csv, generate_markdown
import uvicorn

def main():
    p = argparse.ArgumentParser("logos-astro-navigator")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("db-init")

    p_imp = sub.add_parser("catalog-import")
    p_imp.add_argument("--csv", required=True)
    p_imp.add_argument("--catalog-key", required=True)
    p_imp.add_argument("--catalog-name", required=True)
    p_imp.add_argument("--coord-system", default="tropical_ecliptic")
    p_imp.add_argument("--epoch-year", type=int, default=None)
    p_imp.add_argument("--notes", default="")

    p_gaia = sub.add_parser("gaia-fetch")
    p_gaia.add_argument("--limit", type=int, default=5000)

    p_cmp = sub.add_parser("compare")
    p_cmp.add_argument("--catalog-key", required=True)
    p_cmp.add_argument("--ptolemy-year", type=int, default=137)
    p_cmp.add_argument("--hipparchus-year", type=int, default=-128)
    p_cmp.add_argument("--hip-shift-deg", type=float, default=2.6666667)
    p_cmp.add_argument("--sigma-arcmin", type=float, default=20.0)
    p_cmp.add_argument("--rounding-arcmin", type=float, default=10.0)
    p_cmp.add_argument("--constellation-shrinkage", type=float, default=10.0)
    p_cmp.add_argument("--limit", type=int, default=None)
    p_cmp.add_argument("--notes", default="")

    p_date = sub.add_parser("date")
    p_date.add_argument("--catalog-key", required=True)
    p_date.add_argument("--year-min", type=int, required=True)
    p_date.add_argument("--year-max", type=int, required=True)
    p_date.add_argument("--step", type=int, default=5)
    p_date.add_argument("--sigma-arcmin", type=float, default=20.0)
    p_date.add_argument("--rounding-arcmin", type=float, default=10.0)
    p_date.add_argument("--limit", type=int, default=None)
    p_date.add_argument("--notes", default="")

    p_alias = sub.add_parser("aliases-load")
    p_alias.add_argument("--yaml", required=True)

    p_mine = sub.add_parser("mentions-mine")
    p_mine.add_argument("--limit-aliases", type=int, default=None)
    p_mine.add_argument("--per-alias-limit", type=int, default=250)

    p_rep = sub.add_parser("report")
    p_rep.add_argument("--run-key", required=True)

    p_api = sub.add_parser("api")
    p_api.add_argument("--host", default="0.0.0.0")
    p_api.add_argument("--port", type=int, default=8787)

    args = p.parse_args()

    if args.cmd == "db-init":
        asyncio.run(db.exec_sql_file("astro_nav/schema.sql"))
        print("✓ astro schema initialized")
        return

    if args.cmd == "catalog-import":
        asyncio.run(import_catalog_csv(
            csv_path=args.csv,
            catalog_key=args.catalog_key,
            catalog_name=args.catalog_name,
            coord_system=args.coord_system,
            epoch_year=args.epoch_year,
            notes=args.notes
        ))
        return

    if args.cmd == "gaia-fetch":
        asyncio.run(fetch_gaia_for_missing(limit_objects=args.limit))
        return

    if args.cmd == "compare":
        out = asyncio.run(run_epoch_comparison(
            catalog_key=args.catalog_key,
            epoch_ptolemy=args.ptolemy_year,
            epoch_hipparchus=args.hipparchus_year,
            hip_shift_deg=args.hip_shift_deg,
            sigma_arcmin=args.sigma_arcmin,
            rounding_arcmin=args.rounding_arcmin,
            constellation_shrinkage=args.constellation_shrinkage,
            limit=args.limit,
            notes=args.notes
        ))
        print(out)
        return

    if args.cmd == "date":
        out = asyncio.run(run_catalog_dating(
            catalog_key=args.catalog_key,
            year_min=args.year_min,
            year_max=args.year_max,
            step=args.step,
            sigma_arcmin=args.sigma_arcmin,
            rounding_arcmin=args.rounding_arcmin,
            limit=args.limit,
            notes=args.notes
        ))
        print(out)
        return

    if args.cmd == "aliases-load":
        asyncio.run(load_aliases_from_yaml(args.yaml))
        return

    if args.cmd == "mentions-mine":
        asyncio.run(mine_mentions(limit_aliases=args.limit_aliases, per_alias_limit=args.per_alias_limit))
        return

    if args.cmd == "report":
        async def _r():
            paths = await export_run_csv(args.run_key)
            md = await generate_markdown(args.run_key)
            return {"exports": paths, "markdown": md}
        print(asyncio.run(_r()))
        return

    if args.cmd == "api":
        uvicorn.run("astro_nav.api:app", host=args.host, port=args.port, reload=False)
        return

if __name__ == "__main__":
    main()
PY

# =============================================================================
# SAMPLE DATA (you will replace/extend with your full catalogs)
# =============================================================================
cat > data/catalogs/almagest_sample.csv <<'CSV'
object_key,canonical_name,constellation,entry_no,recorded_lon,recorded_lat,magnitude_int,hip_id,description
arcturus,Arcturus,Boo,1,177.17,31.50,1,69673,High proper motion diagnostic star
sirius,Sirius,CMa,2,77.50,-39.17,1,32349,High proper motion diagnostic star
procyon,Procyon,CMi,3,92.67,-16.17,1,37279,High proper motion diagnostic star
capella,Capella,Aur,4,55.33,22.50,1,24608,High proper motion diagnostic star
aldebaran,Aldebaran,Tau,5,42.67,-5.17,1,21421,Zodiac anchor
regulus,Regulus,Leo,6,122.50,0.17,1,49669,Zodiac anchor
spica,Spica,Vir,7,176.67,-2.00,1,65474,Zodiac anchor
CSV

cat > data/catalogs/suryasiddhanta_sample.csv <<'CSV'
object_key,canonical_name,constellation,entry_no,recorded_lon,recorded_lat,magnitude_int,hip_id,description
rohini,Aldebaran,Tau,1,49.33,-5.17,1,21421,Nakshatra Rohini (example longitude)
magha,Regulus,Leo,2,129.00,0.17,1,49669,Nakshatra Magha (example longitude)
chitra,Spica,Vir,3,180.00,-2.00,1,65474,Nakshatra Chitra (example longitude)
swati,Arcturus,Boo,4,199.00,31.50,1,69673,Nakshatra Swati (example longitude)
CSV

cat > data/aliases/star_aliases.yml <<'YAML'
- object_key: arcturus
  canonical_name: Arcturus
  constellation: Boo
  aliases:
    - {text: "Arcturus", language: "en", source: "manual"}
    - {text: "Swati", language: "sa", source: "nakshatra"}
- object_key: aldebaran
  canonical_name: Aldebaran
  constellation: Tau
  aliases:
    - {text: "Aldebaran", language: "en", source: "manual"}
    - {text: "Rohini", language: "sa", source: "nakshatra"}
- object_key: regulus
  canonical_name: Regulus
  constellation: Leo
  aliases:
    - {text: "Regulus", language: "en", source: "manual"}
    - {text: "Magha", language: "sa", source: "nakshatra"}
- object_key: spica
  canonical_name: Spica
  constellation: Vir
  aliases:
    - {text: "Spica", language: "en", source: "manual"}
    - {text: "Chitra", language: "sa", source: "nakshatra"}
YAML

# =============================================================================
# RUN SCRIPTS
# =============================================================================
cat > scripts/run_api.sh <<'SH'
#!/usr/bin/env bash
set -euo pipefail
source .venv/bin/activate
python -m astro_nav.cli api --host 0.0.0.0 --port 8787
SH
chmod +x scripts/run_api.sh

cat > scripts/quickstart.sh <<'SH'
#!/usr/bin/env bash
set -euo pipefail
source .venv/bin/activate

# 1) init schema
python -m astro_nav.cli db-init

# 2) import sample catalogs
python -m astro_nav.cli catalog-import --csv data/catalogs/almagest_sample.csv --catalog-key almagest_ptolemy --catalog-name "Almagest (sample)" --coord-system tropical_ecliptic --epoch-year 137
python -m astro_nav.cli catalog-import --csv data/catalogs/suryasiddhanta_sample.csv --catalog-key surya_siddhanta_sample --catalog-name "Surya Siddhanta (sample)" --coord-system sidereal_ecliptic

# 3) fetch Gaia data
python -m astro_nav.cli gaia-fetch --limit 5000

# 4) run core comparison (Ptolemy vs Hipparchus-copy)
python -m astro_nav.cli compare --catalog-key almagest_ptolemy --ptolemy-year 137 --hipparchus-year -128 --hip-shift-deg 2.6666667 --sigma-arcmin 20 --rounding-arcmin 10

# 5) date Sanskrit sample (epoch inference demo)
python -m astro_nav.cli date --catalog-key surya_siddhanta_sample --year-min -500 --year-max 800 --step 10

# 6) load aliases and mine mentions (fast if allowlist configured)
python -m astro_nav.cli aliases-load --yaml data/aliases/star_aliases.yml
python -m astro_nav.cli mentions-mine --per-alias-limit 100

echo "Done. Start API: ./scripts/run_api.sh"
SH
chmod +x scripts/quickstart.sh

# =============================================================================
# README
# =============================================================================
cat > README.md <<'MD'
LOGOS Astro Navigator
====================

This system turns ancient star catalogs into a modern, reproducible inference pipeline:

1) Ingest one or many ancient catalogs (Almagest, Hipparchus reconstructions, Sanskrit nakshatra lists, Hebrew/Arabic materials, etc.)
2) Cross-match to modern Gaia DR3 astrometry (HIP -> Gaia)
3) Back-propagate star positions to candidate historical epochs using Astropy space motion
4) Compare hypotheses with quantization-aware likelihood + constellation/systematic error modeling
5) Fit mixture models to detect copied vs observed subsets
6) Generate publishable figures/tables automatically
7) Link star entries to textual evidence in your LOGOS database (Greek/Sanskrit/Hebrew)

Why this can be field-changing:
- It's not "two-epoch residuals." It's model-based inference with mixture + systematics + rounding-aware likelihood.
- It can date *other* catalogs (Sanskrit, Arabic, Hebrew) by maximizing fit to modern proper-motion back-propagation.
- It can output a defensible list of "updated" vs "copied" stars with posterior probabilities.
- It's reproducible: all predictions + configs stored in DB under astro.analysis_runs.

Prereq:
- export DATABASE_URL=postgresql://...

Quickstart:
  ./scripts/quickstart.sh

Run API:
  ./scripts/run_api.sh
  http://localhost:8787/health
MD

echo ""
echo "================================================================================"
echo "✓ INSTALL COMPLETE"
echo ""
echo "Next:"
echo "  1) Copy .env.example -> .env (optional; DATABASE_URL must be set in env either way)"
echo "  2) Run: ./scripts/quickstart.sh"
echo "  3) Start API: ./scripts/run_api.sh"
echo ""
echo "To ingest FULL catalogs:"
echo "  Create CSV in data/catalogs/ with columns:"
echo "    object_key, canonical_name, entry_no, recorded_lon, recorded_lat, magnitude_int, hip_id, constellation, description, source_urn"
echo "  Then:"
echo "    python -m astro_nav.cli catalog-import --csv data/catalogs/almagest_full.csv --catalog-key almagest_ptolemy --catalog-name 'Almagest (full)' --epoch-year 137"
echo "================================================================================"
