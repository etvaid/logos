#!/usr/bin/env bash
set -euo pipefail
source .venv/bin/activate
python -m astro_nav.cli api --host 0.0.0.0 --port 8787
