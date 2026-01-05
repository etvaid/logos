from __future__ import annotations
import math

def wrap_deg180(x: float) -> float:
    y = (x + 180.0) % 360.0 - 180.0
    return y

def to_astronomical_year(year: int) -> int:
    return year + 1 if year < 0 else year

def deg_from_arcmin(arcmin: float) -> float:
    return arcmin / 60.0

def arcmin_from_deg(deg: float) -> float:
    return deg * 60.0

def spherical_distance_deg(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    lon1r, lat1r, lon2r, lat2r = map(math.radians, [lon1, lat1, lon2, lat2])
    cos_d = (math.sin(lat1r)*math.sin(lat2r) + math.cos(lat1r)*math.cos(lat2r)*math.cos(lon1r-lon2r))
    cos_d = max(-1.0, min(1.0, cos_d))
    return math.degrees(math.acos(cos_d))
