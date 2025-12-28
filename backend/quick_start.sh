#!/bin/bash
# =============================================================================
# LOGOS Quick Start - Run When Loeb Download Finishes
# =============================================================================
#
# This script:
# 1. Extracts the Loeb DSL archive
# 2. Converts to text files
# 3. Copies the math framework to your backend
# 4. Starts the local API
#
# Usage: ./quick_start.sh
# =============================================================================

set -e

echo "╔═══════════════════════════════════════════════════════════════════════╗"
echo "║            LOGOS Mathematical Translation Framework                    ║"
echo "║                     Quick Start Script                                 ║"
echo "╚═══════════════════════════════════════════════════════════════════════╝"
echo ""

# Detect download location
DOWNLOAD_DIR="${HOME}/Downloads"
LOGOS_MATH="${HOME}/LOGOS_BACKEND"
LOEB_OUTPUT="${LOGOS_MATH}/loeb_texts"

# Step 1: Find and extract Loeb archive
echo "Step 1: Looking for Loeb download..."
echo "─────────────────────────────────────────────────"

LOEB_FILE=""
for pattern in "loeb*.rar" "Loeb*.rar" "*loeb*.rar"; do
    found=$(find "$DOWNLOAD_DIR" -maxdepth 1 -name "$pattern" 2>/dev/null | head -1)
    if [ -n "$found" ]; then
        LOEB_FILE="$found"
        break
    fi
done

if [ -z "$LOEB_FILE" ]; then
    echo "❌ Loeb RAR file not found in ~/Downloads"
    echo "   Please ensure the download is complete."
    echo ""
    echo "   Looking for files matching: loeb*.rar"
    ls -la "$DOWNLOAD_DIR"/*.rar 2>/dev/null || echo "   No RAR files found."
    exit 1
fi

echo "✓ Found: $LOEB_FILE"
echo ""

# Extract
echo "Step 2: Extracting archive..."
echo "─────────────────────────────────────────────────"

mkdir -p "$LOGOS_MATH/loeb_raw"
cd "$LOGOS_MATH/loeb_raw"

if command -v unar &> /dev/null; then
    unar -q "$LOEB_FILE"
elif command -v unrar &> /dev/null; then
    unrar x -o+ "$LOEB_FILE"
else
    echo "❌ No RAR extractor found. Install with: brew install unar"
    exit 1
fi

echo "✓ Extracted to $LOGOS_MATH/loeb_raw"
echo ""

# Step 3: Find and convert DSL file
echo "Step 3: Converting DSL to text..."
echo "─────────────────────────────────────────────────"

DSL_FILE=$(find "$LOGOS_MATH/loeb_raw" -name "*.dsl" | head -1)

if [ -z "$DSL_FILE" ]; then
    echo "❌ No .dsl file found in extracted archive"
    echo "   Contents of extracted directory:"
    ls -la "$LOGOS_MATH/loeb_raw"
    exit 1
fi

echo "✓ Found DSL: $DSL_FILE"

# Copy converter if needed
CONVERTER="/home/claude/logos_math/loeb_converter.py"
if [ ! -f "$LOGOS_MATH/loeb_converter.py" ] && [ -f "$CONVERTER" ]; then
    cp "$CONVERTER" "$LOGOS_MATH/"
fi

# Run converter
cd "$LOGOS_MATH"
python3 loeb_converter.py --input "$DSL_FILE" --output "$LOEB_OUTPUT" || {
    echo "⚠ Converter failed. Trying alternative approach..."
    
    # Simple fallback: just extract text
    mkdir -p "$LOEB_OUTPUT"
    cat "$DSL_FILE" | iconv -f UTF-16LE -t UTF-8 2>/dev/null | \
        sed 's/\[.*\]//g' > "$LOEB_OUTPUT/loeb_all_text.txt"
    
    echo "✓ Basic text extracted to $LOEB_OUTPUT/loeb_all_text.txt"
}

echo ""

# Step 4: Copy framework files
echo "Step 4: Setting up framework..."
echo "─────────────────────────────────────────────────"

FRAMEWORK_SRC="/home/claude/logos_math"

for file in translation_math.py translator_profiles_complete.py advanced_math.py main_complete.py; do
    if [ -f "$FRAMEWORK_SRC/$file" ]; then
        cp "$FRAMEWORK_SRC/$file" "$LOGOS_MATH/" 2>/dev/null && echo "  ✓ $file"
    fi
done

# Use main_complete.py as the main entry
if [ -f "$LOGOS_MATH/main_complete.py" ]; then
    cp "$LOGOS_MATH/main_complete.py" "$LOGOS_MATH/main.py"
fi

echo ""

# Step 5: Start local API
echo "Step 5: Starting API..."
echo "─────────────────────────────────────────────────"

cd "$LOGOS_MATH"

# Check if port is in use
if lsof -i:8003 &>/dev/null; then
    echo "⚠ Port 8003 is in use. Killing existing process..."
    lsof -ti:8003 | xargs kill -9 2>/dev/null || true
    sleep 1
fi

echo ""
echo "Starting LOGOS API on http://localhost:8003"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

python3 -m uvicorn main:app --host 0.0.0.0 --port 8003

# This line won't be reached until Ctrl+C
echo ""
echo "Server stopped."
