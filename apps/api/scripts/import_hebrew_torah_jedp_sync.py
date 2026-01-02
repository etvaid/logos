#!/usr/bin/env python3
"""
Hebrew Torah Import with JEDP Source Assignments (Synchronous Version)
Imports Hebrew Pentateuch from Sefaria API with traditional source labels.
"""

import os
import json
import time
import requests
import psycopg2
from psycopg2.extras import execute_values
from typing import Dict, List, Tuple, Optional

DATABASE_URL = os.environ.get('DATABASE_URL', '')
SEFARIA_API = "https://www.sefaria.org/api/v3/texts"

# JEDP SOURCE ASSIGNMENTS (Friedman's "Bible with Sources Revealed")
JEDP_ASSIGNMENTS = {
    # GENESIS
    "Genesis 1:1-2:3": "P",
    "Genesis 2:4-25": "J",
    "Genesis 3:1-24": "J",
    "Genesis 4:1-26": "J",
    "Genesis 5:1-32": "P",
    "Genesis 6:1-4": "J",
    "Genesis 6:5-8": "J",
    "Genesis 6:9-22": "P",
    "Genesis 7:1-5": "J",
    "Genesis 7:6-10": "P",
    "Genesis 7:11-16": "P",
    "Genesis 7:17-24": "J",
    "Genesis 8:1-5": "P",
    "Genesis 8:6-12": "J",
    "Genesis 8:13-19": "P",
    "Genesis 8:20-22": "J",
    "Genesis 9:1-17": "P",
    "Genesis 9:18-27": "J",
    "Genesis 9:28-29": "P",
    "Genesis 10:1-32": "P",
    "Genesis 11:1-9": "J",
    "Genesis 11:10-26": "P",
    "Genesis 11:27-32": "P",
    "Genesis 12:1-9": "J",
    "Genesis 12:10-20": "J",
    "Genesis 13:1-18": "J",
    "Genesis 15:1-21": "J",
    "Genesis 16:1-16": "J",
    "Genesis 17:1-27": "P",
    "Genesis 18:1-33": "J",
    "Genesis 19:1-38": "J",
    "Genesis 20:1-18": "E",
    "Genesis 21:1-7": "P",
    "Genesis 21:8-21": "E",
    "Genesis 21:22-34": "E",
    "Genesis 22:1-19": "E",
    "Genesis 22:20-24": "J",
    "Genesis 23:1-20": "P",
    "Genesis 24:1-67": "J",
    "Genesis 25:1-6": "J",
    "Genesis 25:7-11": "P",
    "Genesis 25:12-18": "P",
    "Genesis 25:19-26": "P",
    "Genesis 25:27-34": "J",
    "Genesis 26:1-35": "J",
    "Genesis 27:1-45": "J",
    "Genesis 27:46-28:9": "P",
    "Genesis 28:10-22": "J",
    "Genesis 29:1-30": "J",
    "Genesis 29:31-30:24": "J",
    "Genesis 30:25-43": "J",
    "Genesis 31:1-55": "E",
    "Genesis 32:1-32": "J",
    "Genesis 33:1-20": "J",
    "Genesis 34:1-31": "J",
    "Genesis 35:1-15": "E",
    "Genesis 35:16-20": "E",
    "Genesis 35:21-29": "P",
    "Genesis 36:1-43": "P",
    "Genesis 37:1-36": "J",
    "Genesis 38:1-30": "J",
    "Genesis 39:1-23": "J",
    "Genesis 40:1-23": "E",
    "Genesis 41:1-57": "E",
    "Genesis 42:1-38": "E",
    "Genesis 43:1-34": "J",
    "Genesis 44:1-34": "J",
    "Genesis 45:1-28": "E",
    "Genesis 46:1-34": "J",
    "Genesis 47:1-31": "J",
    "Genesis 48:1-22": "E",
    "Genesis 49:1-33": "J",
    "Genesis 50:1-26": "E",

    # EXODUS
    "Exodus 1:1-7": "P",
    "Exodus 1:8-22": "J",
    "Exodus 2:1-25": "J",
    "Exodus 3:1-15": "E",
    "Exodus 3:16-22": "J",
    "Exodus 4:1-31": "J",
    "Exodus 5:1-23": "J",
    "Exodus 6:1-13": "P",
    "Exodus 6:14-27": "P",
    "Exodus 6:28-7:13": "P",
    "Exodus 7:14-25": "J",
    "Exodus 8:1-32": "J",
    "Exodus 9:1-35": "J",
    "Exodus 10:1-29": "J",
    "Exodus 11:1-10": "J",
    "Exodus 12:1-28": "P",
    "Exodus 12:29-42": "J",
    "Exodus 12:43-51": "P",
    "Exodus 13:1-16": "J",
    "Exodus 13:17-14:31": "J",
    "Exodus 15:1-21": "J",
    "Exodus 15:22-27": "J",
    "Exodus 16:1-36": "P",
    "Exodus 17:1-16": "J",
    "Exodus 18:1-27": "E",
    "Exodus 19:1-25": "J",
    "Exodus 20:1-17": "E",
    "Exodus 20:18-26": "E",
    "Exodus 21:1-23:33": "E",
    "Exodus 24:1-18": "J",
    "Exodus 25:1-31:18": "P",
    "Exodus 32:1-35": "J",
    "Exodus 33:1-23": "J",
    "Exodus 34:1-35": "J",
    "Exodus 35:1-40:38": "P",

    # LEVITICUS (entirely P)
    "Leviticus 1:1-27:34": "P",

    # NUMBERS
    "Numbers 1:1-10:10": "P",
    "Numbers 10:11-36": "J",
    "Numbers 11:1-35": "J",
    "Numbers 12:1-16": "E",
    "Numbers 13:1-33": "J",
    "Numbers 14:1-45": "J",
    "Numbers 15:1-41": "P",
    "Numbers 16:1-50": "J",
    "Numbers 17:1-13": "P",
    "Numbers 18:1-32": "P",
    "Numbers 19:1-22": "P",
    "Numbers 20:1-29": "J",
    "Numbers 21:1-35": "J",
    "Numbers 22:1-24:25": "E",
    "Numbers 25:1-18": "J",
    "Numbers 26:1-65": "P",
    "Numbers 27:1-23": "P",
    "Numbers 28:1-30:16": "P",
    "Numbers 31:1-54": "P",
    "Numbers 32:1-42": "J",
    "Numbers 33:1-56": "P",
    "Numbers 34:1-36:13": "P",

    # DEUTERONOMY (almost entirely D)
    "Deuteronomy 1:1-4:43": "D",
    "Deuteronomy 4:44-28:68": "D",
    "Deuteronomy 29:1-30:20": "D",
    "Deuteronomy 31:1-29": "D",
    "Deuteronomy 31:30-32:52": "D",
    "Deuteronomy 33:1-29": "D",
    "Deuteronomy 34:1-12": "P",
}


def parse_reference(ref: str) -> Tuple[str, int, int, int]:
    """Parse 'Book Chapter:Start-End' format."""
    parts = ref.split()
    book = parts[0]
    chapter_verse = parts[1]

    if ':' in chapter_verse:
        chapter, verses = chapter_verse.split(':')
        chapter = int(chapter)
        if '-' in verses:
            start, end = verses.split('-')
            return book, chapter, int(start), int(end)
        else:
            v = int(verses)
            return book, chapter, v, v
    else:
        chapter = int(chapter_verse)
        return book, chapter, 1, 999


def get_source_for_verse(book: str, chapter: int, verse: int) -> str:
    """Get JEDP source for a specific verse."""
    # Check range matches
    for ref, source in JEDP_ASSIGNMENTS.items():
        try:
            b, ch, start, end = parse_reference(ref)
            if b == book and ch == chapter and start <= verse <= end:
                return source
        except:
            continue

    # Default by book
    if book == "Leviticus":
        return "P"
    elif book == "Deuteronomy":
        return "D"

    return "?"


def fetch_sefaria_text(book: str, chapter: int) -> Optional[Dict]:
    """Fetch Hebrew text from Sefaria API."""
    ref = f"{book}.{chapter}"
    url = f"{SEFARIA_API}/{ref}"

    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"  Warning: Failed {ref}: {response.status_code}")
            return None
    except Exception as e:
        print(f"  Error: {ref}: {e}")
        return None


def main():
    print("=" * 70)
    print("HEBREW TORAH IMPORT WITH JEDP SOURCE ASSIGNMENTS")
    print("=" * 70)

    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # Create table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS hebrew_torah (
            id SERIAL PRIMARY KEY,
            book TEXT NOT NULL,
            chapter INTEGER NOT NULL,
            verse INTEGER NOT NULL,
            hebrew_text TEXT NOT NULL,
            jedp_source TEXT NOT NULL,
            word_count INTEGER,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(book, chapter, verse)
        )
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_hebrew_torah_source ON hebrew_torah(jedp_source)")
    conn.commit()
    print("\n[1] Created hebrew_torah table")

    books = [
        ("Genesis", 50),
        ("Exodus", 40),
        ("Leviticus", 27),
        ("Numbers", 36),
        ("Deuteronomy", 34),
    ]

    total_verses = 0
    source_counts = {"J": 0, "E": 0, "D": 0, "P": 0, "?": 0}

    for book, num_chapters in books:
        print(f"\n[2] Importing {book} ({num_chapters} chapters)...")

        for chapter in range(1, num_chapters + 1):
            data = fetch_sefaria_text(book, chapter)

            if not data or 'versions' not in data:
                time.sleep(0.5)
                continue

            # Find Hebrew text
            hebrew_version = None
            for v in data.get('versions', []):
                if v.get('language') == 'he':
                    hebrew_version = v
                    break

            if not hebrew_version:
                continue

            verses = hebrew_version.get('text', [])

            for verse_num, hebrew_text in enumerate(verses, 1):
                if not hebrew_text or not isinstance(hebrew_text, str):
                    continue

                source = get_source_for_verse(book, chapter, verse_num)
                word_count = len(hebrew_text.split())

                try:
                    cur.execute("""
                        INSERT INTO hebrew_torah (book, chapter, verse, hebrew_text, jedp_source, word_count)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT (book, chapter, verse) DO UPDATE SET
                            hebrew_text = EXCLUDED.hebrew_text,
                            jedp_source = EXCLUDED.jedp_source,
                            word_count = EXCLUDED.word_count
                    """, (book, chapter, verse_num, hebrew_text, source, word_count))

                    total_verses += 1
                    if source in source_counts:
                        source_counts[source] += 1
                    else:
                        source_counts["?"] += 1

                except Exception as e:
                    print(f"  Error: {book} {chapter}:{verse_num}: {e}")

            conn.commit()

            if chapter % 10 == 0:
                print(f"    Chapter {chapter}/{num_chapters}")

            time.sleep(0.2)  # Rate limiting

    print(f"\n[3] Imported {total_verses} verses")

    # Source distribution
    print("\n[4] JEDP Source Distribution:")
    print("-" * 40)
    for source, count in sorted(source_counts.items(), key=lambda x: -x[1]):
        if count > 0:
            pct = count / total_verses * 100 if total_verses > 0 else 0
            print(f"  {source}: {count} verses ({pct:.1f}%)")

    # Verify
    cur.execute("SELECT COUNT(*) FROM hebrew_torah")
    count = cur.fetchone()[0]
    print(f"\n[5] Total verses in database: {count}")

    # Sample verses
    print("\n[6] Sample verses by source:")
    for source in ["J", "E", "D", "P"]:
        cur.execute("""
            SELECT book, chapter, verse, LEFT(hebrew_text, 60)
            FROM hebrew_torah
            WHERE jedp_source = %s
            LIMIT 1
        """, (source,))
        row = cur.fetchone()
        if row:
            print(f"\n  {source}: {row[0]} {row[1]}:{row[2]}")
            print(f"     {row[3]}...")

    cur.close()
    conn.close()

    print("\n" + "=" * 70)
    print("HEBREW TORAH IMPORT COMPLETE")
    print("=" * 70)


if __name__ == "__main__":
    main()
