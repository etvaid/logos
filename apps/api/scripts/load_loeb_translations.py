#!/usr/bin/env python3
"""
LOGOS Loeb Translation Loader (Batch Version)
==============================================

Parses Loeb Library files and loads Greek/English translation pairs
into the translations table using fast batch inserts.

Usage:
    export DATABASE_URL="postgresql://..."
    python scripts/load_loeb_translations.py
"""

import os
import re
import asyncio
import asyncpg
from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import dataclass

DATABASE_URL = os.environ.get("DATABASE_URL", "")
BATCH_SIZE = 500

# Loeb translator mapping (LCL number -> translator info)
LOEB_TRANSLATORS = {
    "001": {"name": "R. C. Seaton", "era": "modern"},
    "002": {"name": "J. M. Edmonds", "era": "modern"},
    "003": {"name": "A. S. Way", "era": "modern"},
    "004": {"name": "A. D. Godley", "era": "modern"},
    "005": {"name": "W. H. S. Jones", "era": "modern"},
    "006": {"name": "H. Rushton Fairclough", "era": "modern"},
    "007": {"name": "H. E. Butler", "era": "modern"},
    "008": {"name": "W. R. Paton", "era": "modern"},
    "009": {"name": "A. T. Murray", "era": "modern"},
    "010": {"name": "H. Rackham", "era": "modern"},
    "default": {"name": "Loeb Translator", "era": "modern"},
}

GREEK_PATTERN = re.compile(r'[\u0370-\u03FF\u1F00-\u1FFF]')


@dataclass
class TranslationPair:
    section_id: str
    author: str
    work: str
    greek_text: str
    english_text: str
    translator: str
    loeb_number: str


def detect_language(text: str) -> str:
    greek_chars = len(GREEK_PATTERN.findall(text))
    total_chars = len(text.strip())
    if total_chars == 0:
        return "empty"
    return "greek" if greek_chars / total_chars > 0.3 else "english"


def parse_loeb_file(filepath: Path) -> List[TranslationPair]:
    """Parse a Loeb file and extract translation pairs."""
    pairs = []

    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    section_pattern = re.compile(r'^-(\d{3})\.(\d{3}) \(([^,]+),\s*([^)]+)\)', re.MULTILINE)
    sections = section_pattern.split(content)

    i = 1
    while i + 4 < len(sections):
        lcl_num = sections[i]
        section_num = sections[i + 1]
        author = sections[i + 2].strip()
        work = sections[i + 3].strip()
        text_block = sections[i + 4] if i + 4 < len(sections) else ""

        lines = text_block.split('\n')
        greek_lines = []
        english_lines = []

        for line in lines:
            line = line.strip()
            if not line or line.startswith('\\') or line.startswith('Page number'):
                continue
            if line.startswith('Footnotes'):
                break
            if line.startswith('%'):
                continue

            lang = detect_language(line)
            if lang == "greek":
                greek_lines.append(line)
            elif lang == "english" and len(line) > 20:
                if not any(x in line.lower() for x in ['book', 'chapter', 'section', author.lower()[:10]]):
                    english_lines.append(line)

        greek_text = ' '.join(greek_lines).strip()
        english_text = ' '.join(english_lines).strip()

        if len(greek_text) > 50 and len(english_text) > 50:
            translator_info = LOEB_TRANSLATORS.get(lcl_num, LOEB_TRANSLATORS["default"])
            pairs.append(TranslationPair(
                section_id=f"{lcl_num}.{section_num}",
                author=author,
                work=work,
                greek_text=greek_text[:5000],
                english_text=english_text[:5000],
                translator=translator_info["name"],
                loeb_number=lcl_num
            ))

        i += 5

    return pairs


async def load_translations_batch(pairs: List[TranslationPair]):
    """Load translation pairs using batch inserts."""
    if not DATABASE_URL:
        print("ERROR: DATABASE_URL not set")
        return

    print(f"Connecting to database...")
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)

    async with pool.acquire() as conn:
        # Get or create all translators first
        translator_ids = {}
        unique_translators = set(p.translator for p in pairs)

        for name in unique_translators:
            row = await conn.fetchrow("SELECT id FROM translators WHERE name = $1", name)
            if row:
                translator_ids[name] = row['id']
            else:
                try:
                    row = await conn.fetchrow("""
                        INSERT INTO translators (name, era, philosophy)
                        VALUES ($1, 'modern', 'Loeb Classical Library scholarly translation')
                        RETURNING id
                    """, name)
                    translator_ids[name] = row['id']
                except Exception as e:
                    print(f"  Error creating translator {name}: {e}")
                    row = await conn.fetchrow("SELECT id FROM translators WHERE name = $1", name)
                    if row:
                        translator_ids[name] = row['id']

        print(f"  Created/found {len(translator_ids)} translators")

        # Prepare batch data
        batch_data = []
        for pair in pairs:
            tid = translator_ids.get(pair.translator)
            if tid:
                batch_data.append((None, tid, pair.english_text, 'literal'))

        print(f"  Preparing {len(batch_data):,} translations for batch insert...")

        # Insert in batches using copy_records_to_table (fastest)
        total_inserted = 0

        for i in range(0, len(batch_data), BATCH_SIZE):
            batch = batch_data[i:i + BATCH_SIZE]
            try:
                await conn.copy_records_to_table(
                    'translations',
                    records=batch,
                    columns=['text_id', 'translator_id', 'translation', 'style']
                )
                total_inserted += len(batch)
                if total_inserted % 5000 == 0:
                    print(f"    Inserted {total_inserted:,} / {len(batch_data):,}")
            except Exception as e:
                # Fallback to executemany for this batch
                print(f"  COPY failed, using executemany: {e}")
                try:
                    await conn.executemany("""
                        INSERT INTO translations (text_id, translator_id, translation, style)
                        VALUES ($1, $2, $3, $4)
                    """, batch)
                    total_inserted += len(batch)
                except Exception as e2:
                    print(f"  Batch insert failed: {e2}")

        print(f"\n  Total inserted: {total_inserted:,}")

    await pool.close()


async def main():
    print("=" * 60)
    print("LOGOS LOEB TRANSLATION LOADER (BATCH)")
    print("=" * 60)

    corpus_dir = Path.home() / "Downloads/logos/tau_complete_corpus/text/modern"
    loeb_files = sorted(corpus_dir.glob("loeb_part_*.txt"))

    print(f"Found {len(loeb_files)} Loeb files")

    all_pairs = []
    for filepath in loeb_files:
        print(f"\nParsing {filepath.name}...")
        pairs = parse_loeb_file(filepath)
        print(f"  Found {len(pairs):,} translation pairs")
        all_pairs.extend(pairs)

    print(f"\nTotal pairs: {len(all_pairs):,}")

    if all_pairs:
        print("\nLoading into database (batch mode)...")
        await load_translations_batch(all_pairs)

    print("\nDone!")


if __name__ == "__main__":
    asyncio.run(main())
