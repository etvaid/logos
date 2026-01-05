from __future__ import annotations
import aiohttp
import json
from typing import Optional
from astro_nav import db

GAIA_TAP_URL = "https://gea.esac.esa.int/tap-server/tap/sync"

ADQL_HIP_TO_GAIA = "SELECT h.original_ext_source_id AS hip_id, g.source_id, g.ra, g.dec, g.pmra, g.pmdec, g.parallax, g.radial_velocity, g.ra_error, g.dec_error, g.pmra_error, g.pmdec_error, g.phot_g_mean_mag FROM gaiadr3.hipparcos2_best_neighbour AS h JOIN gaiadr3.gaia_source AS g ON h.source_id = g.source_id WHERE h.original_ext_source_id IN ({hip_list})"

async def _tap_sync(query: str, timeout_sec: int = 120) -> dict:
    form_data = aiohttp.FormData()
    form_data.add_field('REQUEST', 'doQuery')
    form_data.add_field('LANG', 'ADQL')
    form_data.add_field('FORMAT', 'json')
    form_data.add_field('QUERY', query.strip())
    timeout = aiohttp.ClientTimeout(total=timeout_sec)
    async with aiohttp.ClientSession(timeout=timeout) as session:
        async with session.post(GAIA_TAP_URL, data=form_data) as resp:
            txt = await resp.text()
            if resp.status != 200:
                raise RuntimeError(f"Gaia TAP error {resp.status}: {txt[:800]}")
            return json.loads(txt)

async def fetch_gaia_for_missing(limit_objects: int = 5000, chunk_size: int = 400) -> int:
    rows = await db.fetch("""
        SELECT o.object_id, o.hip_id
        FROM astro.objects o
        LEFT JOIN astro.modern_astrometry m ON m.object_id=o.object_id
        WHERE o.hip_id IS NOT NULL AND m.object_id IS NULL
        ORDER BY o.object_id
        LIMIT $1
    """, limit_objects)

    if not rows:
        print("No missing Gaia objects found.")
        return 0

    hip_ids = [int(r["hip_id"]) for r in rows]
    total = 0
    hip_to_oid = {int(r["hip_id"]): int(r["object_id"]) for r in rows}

    for i in range(0, len(hip_ids), chunk_size):
        chunk = hip_ids[i:i+chunk_size]
        hip_list = ",".join(str(x) for x in chunk)
        query = ADQL_HIP_TO_GAIA.format(hip_list=hip_list)

        res = await _tap_sync(query)
        data = res.get("data", [])
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
                  ra_deg=EXCLUDED.ra_deg, dec_deg=EXCLUDED.dec_deg,
                  pmra_masyr=EXCLUDED.pmra_masyr, pmdec_masyr=EXCLUDED.pmdec_masyr,
                  parallax_mas=EXCLUDED.parallax_mas, radvel_kms=EXCLUDED.radvel_kms,
                  ra_error_mas=EXCLUDED.ra_error_mas, dec_error_mas=EXCLUDED.dec_error_mas,
                  pmra_error_masyr=EXCLUDED.pmra_error_masyr, pmdec_error_masyr=EXCLUDED.pmdec_error_masyr,
                  phot_g_mean_mag=EXCLUDED.phot_g_mean_mag, fetched_at=NOW(), source='GaiaDR3'
            """, oid, ra, dec, pmra, pmdec, parallax, radvel, ra_err, dec_err, pmra_err, pmdec_err, gmag)
            total += 1

        print(f"Gaia chunk {i//chunk_size + 1}: updated {len(data)} stars")

    print(f"Total Gaia updates: {total}")
    return total
