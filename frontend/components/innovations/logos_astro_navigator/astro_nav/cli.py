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
        print("astro schema initialized")
        return
    if args.cmd == "catalog-import":
        asyncio.run(import_catalog_csv(csv_path=args.csv, catalog_key=args.catalog_key, catalog_name=args.catalog_name, coord_system=args.coord_system, epoch_year=args.epoch_year, notes=args.notes))
        return
    if args.cmd == "gaia-fetch":
        asyncio.run(fetch_gaia_for_missing(limit_objects=args.limit))
        return
    if args.cmd == "compare":
        out = asyncio.run(run_epoch_comparison(catalog_key=args.catalog_key, epoch_ptolemy=args.ptolemy_year, epoch_hipparchus=args.hipparchus_year, hip_shift_deg=args.hip_shift_deg, sigma_arcmin=args.sigma_arcmin, rounding_arcmin=args.rounding_arcmin, constellation_shrinkage=args.constellation_shrinkage, limit=args.limit, notes=args.notes))
        print(out)
        return
    if args.cmd == "date":
        out = asyncio.run(run_catalog_dating(catalog_key=args.catalog_key, year_min=args.year_min, year_max=args.year_max, step=args.step, sigma_arcmin=args.sigma_arcmin, rounding_arcmin=args.rounding_arcmin, limit=args.limit, notes=args.notes))
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
