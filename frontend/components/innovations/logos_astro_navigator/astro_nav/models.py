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

def _log_interval_prob(mu: float, center: float, half_width: float, sigma: float) -> float:
    a = (center - half_width) - mu
    b = (center + half_width) - mu
    pa = 0.5 * (1.0 + math.erf(a / (sigma * math.sqrt(2.0))))
    pb = 0.5 * (1.0 + math.erf(b / (sigma * math.sqrt(2.0))))
    p = max(1e-12, pb - pa)
    return math.log(p)

def quantized_loglik_2d(dlon_deg: float, dlat_deg: float, cfg: LikelihoodConfig) -> float:
    half = cfg.rounding_deg / 2.0
    ll_lon = _log_interval_prob(mu=0.0, center=dlon_deg, half_width=half, sigma=cfg.sigma_deg)
    ll_lat = _log_interval_prob(mu=0.0, center=dlat_deg, half_width=half, sigma=cfg.sigma_deg)
    return ll_lon + ll_lat

def rms(values: Iterable[float]) -> float:
    vals = np.array(list(values), dtype=float)
    return float(np.sqrt(np.mean(vals**2))) if len(vals) else float("nan")

def bic(loglik: float, k_params: int, n: int) -> float:
    return -2.0 * loglik + k_params * math.log(max(n, 1))

def fit_global_offsets(dlon: np.ndarray, dlat: np.ndarray, robust: bool = True) -> tuple[float, float]:
    if robust:
        return float(np.median(dlon)), float(np.median(dlat))
    return float(np.mean(dlon)), float(np.mean(dlat))

def fit_constellation_offsets(
    constellations: list[Optional[str]],
    dlon: np.ndarray,
    dlat: np.ndarray,
    shrinkage: float = 10.0
) -> dict[str, tuple[float, float, int]]:
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
    log_pa = math.log(1.0 - w_b) + loglik_a
    log_pb = math.log(w_b) + loglik_b
    denom = logsumexp(np.vstack([log_pa, log_pb]), axis=0)
    return np.exp(log_pb - denom)
