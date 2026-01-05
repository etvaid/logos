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
    t0 = Time(float(ref_year), format="jyear", scale="tt")
    t1 = _time_from_year(target_year)

    par = np.where(np.isfinite(parallax_mas) & (parallax_mas > 0), parallax_mas, np.nan)
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
