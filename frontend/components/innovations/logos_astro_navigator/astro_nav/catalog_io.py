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

    print(f"Imported/updated {inserted} entries into astro.catalog_entries for catalog_key={catalog_key}")
