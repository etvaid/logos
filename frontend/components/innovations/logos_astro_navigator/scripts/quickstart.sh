#!/usr/bin/env bash
set -euo pipefail
source .venv/bin/activate

python -m astro_nav.cli db-init
python -m astro_nav.cli catalog-import --csv data/catalogs/almagest_sample.csv --catalog-key almagest_ptolemy --catalog-name "Almagest (sample)" --coord-system tropical_ecliptic --epoch-year 137
python -m astro_nav.cli catalog-import --csv data/catalogs/suryasiddhanta_sample.csv --catalog-key surya_siddhanta_sample --catalog-name "Surya Siddhanta (sample)" --coord-system sidereal_ecliptic
python -m astro_nav.cli gaia-fetch --limit 5000
python -m astro_nav.cli compare --catalog-key almagest_ptolemy --ptolemy-year 137 --hipparchus-year -128 --hip-shift-deg 2.6666667 --sigma-arcmin 20 --rounding-arcmin 10
python -m astro_nav.cli date --catalog-key surya_siddhanta_sample --year-min -500 --year-max 800 --step 10
python -m astro_nav.cli aliases-load --yaml data/aliases/star_aliases.yml
python -m astro_nav.cli mentions-mine --per-alias-limit 100

echo "Done. Start API: ./scripts/run_api.sh"
