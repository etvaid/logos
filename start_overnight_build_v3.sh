#!/bin/bash
#
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║       LOGOS OVERNIGHT BUILD V3 - MEANING-CONDITIONED MEASUREMENT          ║
# ║                                                                           ║
# ║  NEW IN V3: StyleV3 Agent with MCMS (Meaning-Conditioned Measurement)     ║
# ║    • Context-specific "rulers" for different meaning types                ║
# ║    • ELASTICITY features: how author style SHIFTS across contexts         ║
# ║    • Per-context author vectors: β_{a,c}                                  ║
# ║    • Topic-holdout evaluation (the critical test)                         ║
# ║                                                                           ║
# ║  13 AGENTS (6,500+ LINES):                                                ║
# ║    1. SchemaArchitect    - Database schema + SEL tables                   ║
# ║    2. StyleEvidenceLayer - Canonical feature store                        ║
# ║    3. BurrowsDelta       - Classic stylometry (69.5% baseline)           ║
# ║    4. FixedEffects       - Multi-way decomposition                       ║
# ║    5. StyleV2            - Whitening + confound-penalized LDA            ║
# ║    6. StyleV3 (NEW!)     - MCMS: Meaning-Conditioned Measurement         ║
# ║    7. Adversarial        - Confound removal                              ║
# ║    8. MultiView          - Function words + char n-grams                 ║
# ║    9. HMMSegmentation    - UNKNOWN state + length priors                 ║
# ║   10. Falsification      - 6 gates + 4 negative controls                 ║
# ║   11. Integration        - Reliability-weighted fusion                   ║
# ║   12. BiblicalAnalysis   - Disputed text analysis                        ║
# ║   13. PublicationReport  - Proof bundles + scholar-grade output          ║
# ║                                                                           ║
# ╚══════════════════════════════════════════════════════════════════════════╝

set -e

LOGOS_DIR="${HOME}/Downloads/logos"
SCRIPTS_DIR="${LOGOS_DIR}/apps/api/scripts"
LOG_DIR="${LOGOS_DIR}/overnight_logs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "╔══════════════════════════════════════════════════════════════════════════╗"
echo "║       LOGOS OVERNIGHT BUILD V3 - MEANING-CONDITIONED MEASUREMENT          ║"
echo "╚══════════════════════════════════════════════════════════════════════════╝"
echo ""

if [ -z "$DATABASE_URL" ]; then
    export DATABASE_URL="postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway"
fi

mkdir -p "$LOG_DIR"
mkdir -p "$SCRIPTS_DIR"

cp logos_overnight_build_v3_mcms.py "$SCRIPTS_DIR/"
chmod +x "$SCRIPTS_DIR/logos_overnight_build_v3_mcms.py"

echo -e "${GREEN}✓ Build script ready (6500+ lines, 13 agents)${NC}"

cd "$SCRIPTS_DIR"
nohup python3 logos_overnight_build_v3_mcms.py --full-build --biblical-analysis \
    > "$LOG_DIR/build_${TIMESTAMP}.log" 2>&1 &

BUILD_PID=$!
echo "$BUILD_PID" > "$LOG_DIR/build.pid"

echo ""
echo -e "${GREEN}✓ Build started (PID: $BUILD_PID)${NC}"
echo ""
echo "Monitor: tail -f $LOG_DIR/build_${TIMESTAMP}.log"
echo ""
