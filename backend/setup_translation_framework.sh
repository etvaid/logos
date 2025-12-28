#!/bin/bash
# =============================================================================
# LOGOS Translation Framework Setup Script
# =============================================================================
# 
# This script:
# 1. Copies the math framework to your LOGOS backend
# 2. Updates the production API
# 3. Pushes to git for Railway deployment
# 4. Optionally processes Loeb DSL files
#
# Usage:
#   ./setup_translation_framework.sh [--loeb /path/to/loeb.dsl]
#
# =============================================================================

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║     LOGOS Mathematical Translation Framework Setup            ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

# Configuration
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LOGOS_BACKEND="${HOME}/LOGOS_BACKEND"
LOGOS_GIT="${HOME}/Downloads/logos"

# Check if backend exists
if [ ! -d "$LOGOS_BACKEND" ]; then
    echo "Creating LOGOS_BACKEND directory..."
    mkdir -p "$LOGOS_BACKEND"
fi

# Step 1: Copy framework files
echo ""
echo "Step 1: Copying translation framework files..."
echo "─────────────────────────────────────────────────"

cp "$SCRIPT_DIR/translation_math.py" "$LOGOS_BACKEND/" 2>/dev/null || echo "  translation_math.py - skipped (not found)"
cp "$SCRIPT_DIR/translator_profiles.py" "$LOGOS_BACKEND/" 2>/dev/null || echo "  translator_profiles.py - skipped (not found)"
cp "$SCRIPT_DIR/translation_api.py" "$LOGOS_BACKEND/" 2>/dev/null || echo "  translation_api.py - skipped (not found)"
cp "$SCRIPT_DIR/loeb_converter.py" "$LOGOS_BACKEND/" 2>/dev/null || echo "  loeb_converter.py - skipped (not found)"
cp "$SCRIPT_DIR/main_complete.py" "$LOGOS_BACKEND/main.py" 2>/dev/null || echo "  main_complete.py - skipped (not found)"

echo "✓ Framework files copied"

# Step 2: Update git repository
echo ""
echo "Step 2: Updating git repository..."
echo "─────────────────────────────────────────────────"

if [ -d "$LOGOS_GIT/backend" ]; then
    cp "$LOGOS_BACKEND/main.py" "$LOGOS_GIT/backend/"
    
    cd "$LOGOS_GIT"
    git add -A
    git commit -m "Add Mathematical Translation Framework v2.0" || echo "No changes to commit"
    
    echo ""
    read -p "Push to production? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push
        echo "✓ Pushed to production - Railway will auto-deploy"
    fi
else
    echo "⚠ Git repository not found at $LOGOS_GIT"
    echo "  Run: cd ~/Downloads/logos && mkdir -p backend && cp ~/LOGOS_BACKEND/main.py backend/"
fi

# Step 3: Process Loeb DSL (optional)
echo ""
echo "Step 3: Loeb DSL Processing"
echo "─────────────────────────────────────────────────"

LOEB_FILE=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --loeb)
            LOEB_FILE="$2"
            shift 2
            ;;
        *)
            shift
            ;;
    esac
done

if [ -n "$LOEB_FILE" ] && [ -f "$LOEB_FILE" ]; then
    echo "Processing Loeb DSL file: $LOEB_FILE"
    python3 "$LOGOS_BACKEND/loeb_converter.py" --input "$LOEB_FILE" --output "$LOGOS_BACKEND/loeb_texts"
    echo "✓ Loeb texts extracted to $LOGOS_BACKEND/loeb_texts"
else
    echo "No Loeb DSL file specified. To process:"
    echo "  ./setup_translation_framework.sh --loeb ~/Downloads/loeb.dsl"
fi

# Step 4: Test locally
echo ""
echo "Step 4: Testing"
echo "─────────────────────────────────────────────────"
echo ""
echo "To test locally:"
echo "  cd $LOGOS_BACKEND"
echo "  python3 -m uvicorn main:app --host 0.0.0.0 --port 8003 --reload"
echo ""
echo "Then visit:"
echo "  http://localhost:8003/docs"
echo ""
echo "API Endpoints added:"
echo "  GET  /api/style/translators      - List all translators"
echo "  GET  /api/style/translator/{n}   - Get translator profile"
echo "  POST /api/style/compare          - Compare two translators"
echo "  POST /api/style/blend            - Blend multiple styles"
echo "  POST /api/style/arithmetic       - Style vector math"
echo "  GET  /api/style/dimensions       - List style dimensions"
echo "  POST /api/style/ltqi             - Translation quality score"
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete!                            ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
