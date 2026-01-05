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
        SELECT e.entry_id, o.object_id, c.catalog_key, o.object_key, o.canonical_name,
          COALESCE(e.constellation, o.constellation) AS constellation,
          e.recorded_lon, e.recorded_lat, e.magnitude_int,
          m.ra_deg, m.dec_deg, m.pmra_masyr, m.pmdec_masyr, m.parallax_mas, m.radvel_kms, m.phot_g_mean_mag
        FROM astro.catalog_entries e
        JOIN astro.catalogs c ON c.catalog_id=e.catalog_id
        JOIN astro.objects o ON o.object_id=e.object_id
        JOIN astro.modern_astrometry m ON m.object_id=o.object_id
        WHERE c.catalog_key=$1
          AND e.recorded_lon IS NOT NULL AND e.recorded_lat IS NOT NULL
          AND m.ra_deg IS NOT NULL AND m.dec_deg IS NOT NULL
          AND m.pmra_masyr IS NOT NULL AND m.pmdec_masyr IS NOT NULL
        ORDER BY e.entry_id {lim}
    """, catalog_key)

    return [EntryAstroRow(
        entry_id=int(r["entry_id"]), object_id=int(r["object_id"]),
        catalog_key=str(r["catalog_key"]), object_key=str(r["object_key"]),
        canonical_name=str(r["canonical_name"]),
        constellation=str(r["constellation"]) if r["constellation"] else None,
        recorded_lon=float(r["recorded_lon"]), recorded_lat=float(r["recorded_lat"]),
        magnitude_int=int(r["magnitude_int"]) if r["magnitude_int"] else None,
        ra_deg=float(r["ra_deg"]), dec_deg=float(r["dec_deg"]),
        pmra_masyr=float(r["pmra_masyr"]), pmdec_masyr=float(r["pmdec_masyr"]),
        parallax_mas=float(r["parallax_mas"]) if r["parallax_mas"] else None,
        radvel_kms=float(r["radvel_kms"]) if r["radvel_kms"] else None,
        phot_g_mean_mag=float(r["phot_g_mean_mag"]) if r["phot_g_mean_mag"] else None
    ) for r in rows]

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
    cfg = {
        "catalog_key": catalog_key, "epoch_ptolemy": epoch_ptolemy, "epoch_hipparchus": epoch_hipparchus,
        "hip_shift_deg": hip_shift_deg, "sigma_arcmin": sigma_arcmin, "rounding_arcmin": rounding_arcmin,
        "constellation_shrinkage": constellation_shrinkage, "limit": limit
    }
    run_id, run_key = await create_run("epoch_compare", cfg, notes=notes)
    rows = await load_entries_for_catalog(catalog_key, limit=limit)
    if not rows:
        raise RuntimeError("No rows loaded. Make sure you imported a catalog and fetched Gaia data.")

    pred = predict_two_hypotheses(rows, epoch_ptolemy, epoch_hipparchus, hipparchus_to_ptolemy_shift_deg=hip_shift_deg)
    consts = [r.constellation for r in rows]
    dlon_a = np.array([pred[str(r.entry_id)]["ptolemy_epoch"]["dlon"] for r in rows], dtype=float)
    dlat_a = np.array([pred[str(r.entry_id)]["ptolemy_epoch"]["dlat"] for r in rows], dtype=float)
    dlon_b = np.array([pred[str(r.entry_id)]["hipparchus_copy"]["dlon"] for r in rows], dtype=float)
    dlat_b = np.array([pred[str(r.entry_id)]["hipparchus_copy"]["dlat"] for r in rows], dtype=float)

    off_a = fit_global_offsets(dlon_a, dlat_a, robust=True)
    off_b = fit_global_offsets(dlon_b, dlat_b, robust=True)
    con_a = fit_constellation_offsets(consts, dlon_a - off_a[0], dlat_a - off_a[1], shrinkage=constellation_shrinkage)
    con_b = fit_constellation_offsets(consts, dlon_b - off_b[0], dlat_b - off_b[1], shrinkage=constellation_shrinkage)
    ll_cfg = LikelihoodConfig(sigma_deg=deg_from_arcmin(sigma_arcmin), rounding_deg=deg_from_arcmin(rounding_arcmin))

    loglik_a, loglik_b = [], []
    for r in rows:
        ckey = (r.constellation or "UNKNOWN").strip() or "UNKNOWN"
        oa_lon, oa_lat, _ = con_a.get(ckey, (0.0, 0.0, 0))
        ob_lon, ob_lat, _ = con_b.get(ckey, (0.0, 0.0, 0))
        pa, pb = pred[str(r.entry_id)]["ptolemy_epoch"], pred[str(r.entry_id)]["hipparchus_copy"]
        dlon_a_corr = float(pa["dlon"] - off_a[0] - oa_lon)
        dlat_a_corr = float(pa["dlat"] - off_a[1] - oa_lat)
        dlon_b_corr = float(pb["dlon"] - off_b[0] - ob_lon)
        dlat_b_corr = float(pb["dlat"] - off_b[1] - ob_lat)
        ll_a = quantized_loglik_2d(dlon_a_corr, dlat_a_corr, ll_cfg)
        ll_b = quantized_loglik_2d(dlon_b_corr, dlat_b_corr, ll_cfg)
        loglik_a.append(ll_a)
        loglik_b.append(ll_b)
        await db.execute("""
            INSERT INTO astro.predictions(run_id, entry_id, hypothesis, epoch_year, model_params,
              pred_lon, pred_lat, dlon, dlat, ang_resid, loglik)
            VALUES ($1,$2,'ptolemy_epoch',$3,$4::jsonb,$5,$6,$7,$8,$9,$10),
                   ($1,$2,'hipparchus_copy',$11,$12::jsonb,$13,$14,$15,$16,$17,$18)
            ON CONFLICT DO NOTHING
        """, run_id, r.entry_id,
        int(pa["epoch_year"]), json.dumps({"global_offset": off_a, "const_offset": [oa_lon, oa_lat]}),
        float(pa["pred_lon"]), float(pa["pred_lat"]), dlon_a_corr, dlat_a_corr, float(pa["ang_resid"]), float(ll_a),
        int(pb["epoch_year"]), json.dumps({"global_offset": off_b, "const_offset": [ob_lon, ob_lat], "hip_shift_deg": hip_shift_deg}),
        float(pb["pred_lon"]), float(pb["pred_lat"]), dlon_b_corr, dlat_b_corr, float(pb["ang_resid"]), float(ll_b))

    loglik_a, loglik_b = np.array(loglik_a), np.array(loglik_b)
    w_b = mixture_weight_mle(loglik_a, loglik_b)
    post_b = mixture_posteriors(loglik_a, loglik_b, w_b=w_b)
    n = len(rows)
    ll_a_tot, ll_b_tot = float(np.sum(loglik_a)), float(np.sum(loglik_b))
    ll_mix = float(np.sum(np.log((1-w_b)*np.exp(loglik_a - loglik_a.max()) + w_b*np.exp(loglik_b - loglik_a.max())) + loglik_a.max()))
    bic_a, bic_b, bic_m = bic(ll_a_tot, 2, n), bic(ll_b_tot, 3, n), bic(ll_mix, 4, n)
    log_bf = (min(bic_a, bic_b) - bic_m) / 2.0
    rms_a, rms_b = rms(dlon_a - off_a[0]), rms(dlon_b - off_b[0])

    await db.execute("DELETE FROM astro.systematics WHERE run_id=$1 AND catalog_key=$2", run_id, catalog_key)
    for const, (ol, ot, nn) in con_a.items():
        await db.execute("INSERT INTO astro.systematics(run_id,catalog_key,hypothesis,constellation,n_entries,offset_lon_deg,offset_lat_deg,shrinkage) VALUES ($1,$2,'ptolemy_epoch',$3,$4,$5,$6,$7)", run_id, catalog_key, const, nn, float(ol), float(ot), float(constellation_shrinkage))
    for const, (ol, ot, nn) in con_b.items():
        await db.execute("INSERT INTO astro.systematics(run_id,catalog_key,hypothesis,constellation,n_entries,offset_lon_deg,offset_lat_deg,shrinkage) VALUES ($1,$2,'hipparchus_copy',$3,$4,$5,$6,$7)", run_id, catalog_key, const, nn, float(ol), float(ot), float(constellation_shrinkage))
    await db.execute("""
        INSERT INTO astro.model_summaries(run_id, catalog_key, hypothesis_a, hypothesis_b, n_entries, rms_a, rms_b, bic_a, bic_b, bic_mix, mix_weight_b, log_bayes_factor_mix_vs_best, precession_shift_deg, rounding_arcmin, sigma_arcmin, notes)
        VALUES ($1,$2,'ptolemy_epoch','hipparchus_copy',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) ON CONFLICT DO NOTHING
    """, run_id, catalog_key, n, float(rms_a), float(rms_b), float(bic_a), float(bic_b), float(bic_m), float(w_b), float(log_bf), float(hip_shift_deg), float(rounding_arcmin), float(sigma_arcmin), notes or "")

    for i, r in enumerate(rows):
        await db.execute("INSERT INTO astro.predictions(run_id, entry_id, hypothesis, epoch_year, model_params, loglik) VALUES ($1,$2,'mixture_posterior',NULL,$3::jsonb,NULL) ON CONFLICT DO NOTHING", run_id, r.entry_id, json.dumps({"p_hipparchus_copy": float(post_b[i]), "w_b": float(w_b)}))

    return {"run_key": run_key, "run_id": run_id, "n_entries": n, "mix_weight_hipparchus_copy": float(w_b), "bic": {"ptolemy_epoch": float(bic_a), "hipparchus_copy": float(bic_b), "mixture": float(bic_m)}, "log_bayes_factor_mix_vs_best": float(log_bf)}

async def run_catalog_dating(catalog_key: str, year_min: int, year_max: int, step: int = 5, sigma_arcmin: float = 20.0, rounding_arcmin: float = 10.0, limit: Optional[int] = None, notes: str = "") -> dict[str, Any]:
    cfg = {"catalog_key": catalog_key, "year_min": year_min, "year_max": year_max, "step": step, "sigma_arcmin": sigma_arcmin, "rounding_arcmin": rounding_arcmin, "limit": limit}
    run_id, run_key = await create_run("catalog_date", cfg, notes=notes)
    rows = await load_entries_for_catalog(catalog_key, limit=limit)
    best = epoch_grid_best_fit(rows, year_min=year_min, year_max=year_max, step=step)
    for r in rows:
        b = best[str(r.entry_id)]
        await db.execute("INSERT INTO astro.predictions(run_id, entry_id, hypothesis, epoch_year, model_params, pred_lon, pred_lat, dlon, dlat, ang_resid) VALUES ($1,$2,'epoch_scan_best',$3,$4::jsonb,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING",
        run_id, r.entry_id, int(b["best_epoch"]), json.dumps({"year_min": year_min, "year_max": year_max, "step": step}), float(b["pred_lon"]), float(b["pred_lat"]), float(b["dlon"]), float(b["dlat"]), float(b["ang_resid"]))
    epochs = np.array([best[str(r.entry_id)]["best_epoch"] for r in rows], dtype=int)
    vals, counts = np.unique(epochs, return_counts=True)
    dom = int(vals[int(np.argmax(counts))])
    return {"run_key": run_key, "run_id": run_id, "n_entries": len(rows), "dominant_epoch": dom, "epoch_histogram": {int(v): int(c) for v, c in zip(vals, counts)}}
