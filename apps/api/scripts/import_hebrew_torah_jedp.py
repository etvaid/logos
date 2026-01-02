#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║         HEBREW TORAH IMPORT WITH JEDP SOURCE ASSIGNMENTS                      ║
║                                                                               ║
║  Imports Hebrew Pentateuch from Sefaria API with traditional source labels   ║
║  based on Wellhausen's Documentary Hypothesis.                               ║
║                                                                               ║
║  Sources:                                                                     ║
║    J (Jahwist/Yahwist) - Uses YHWH, anthropomorphic God, ~950 BCE            ║
║    E (Elohist) - Uses Elohim, dreams/angels, ~850 BCE                        ║
║    D (Deuteronomist) - Deuteronomy core, ~620 BCE                            ║
║    P (Priestly) - Ritual, genealogies, dates, ~500 BCE                       ║
║                                                                               ║
║  Source assignments based on:                                                 ║
║    - Friedman, R.E. "The Bible with Sources Revealed" (2003)                 ║
║    - Campbell & O'Brien "Sources of the Pentateuch" (1993)                   ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import os
import json
import asyncio
import asyncpg
import aiohttp
from typing import Dict, List, Tuple, Optional
from datetime import datetime

DATABASE_URL = os.environ.get('DATABASE_URL', '')
SEFARIA_API = "https://www.sefaria.org/api/v3/texts"

# ============================================================================
# JEDP SOURCE ASSIGNMENTS
# Based on Friedman's "The Bible with Sources Revealed" and scholarly consensus
# Format: "Book Chapter:Verse" or "Book Chapter:Start-End" -> Source
# ============================================================================

JEDP_ASSIGNMENTS = {
    # GENESIS
    # Creation accounts
    "Genesis 1:1-2:3": "P",      # First creation account (7 days, ordered)
    "Genesis 2:4-25": "J",       # Second creation (YHWH, garden, anthropomorphic)

    # Fall and early humanity
    "Genesis 3:1-24": "J",       # Fall narrative
    "Genesis 4:1-26": "J",       # Cain and Abel
    "Genesis 5:1-32": "P",       # Genealogy Adam to Noah (precise dates)

    # Flood narratives (interweaved)
    "Genesis 6:1-4": "J",        # Sons of God
    "Genesis 6:5-8": "J",        # YHWH's regret
    "Genesis 6:9-22": "P",       # Noah's righteousness, ark specs
    "Genesis 7:1-5": "J",        # 7 pairs clean animals
    "Genesis 7:6-10": "P",       # Noah's age, dates
    "Genesis 7:11-16": "P",      # Sources of flood
    "Genesis 7:17-24": "J",      # 40 days
    "Genesis 8:1-5": "P",        # Wind, dates
    "Genesis 8:6-12": "J",       # Raven and dove
    "Genesis 8:13-19": "P",      # Precise dates
    "Genesis 8:20-22": "J",      # YHWH smells sacrifice
    "Genesis 9:1-17": "P",       # Covenant, dietary laws
    "Genesis 9:18-27": "J",      # Noah's drunkenness
    "Genesis 9:28-29": "P",      # Noah's age

    # Table of Nations and Babel
    "Genesis 10:1-32": "P",      # Genealogy
    "Genesis 11:1-9": "J",       # Tower of Babel
    "Genesis 11:10-26": "P",     # Genealogy Shem to Terah
    "Genesis 11:27-32": "P",     # Terah's line

    # Abraham narratives
    "Genesis 12:1-9": "J",       # Call of Abram
    "Genesis 12:10-20": "J",     # Sarah in Egypt
    "Genesis 13:1-18": "J",      # Lot separates
    "Genesis 14:1-24": "?",      # Unique source (debated)
    "Genesis 15:1-21": "JE",     # Covenant (mixed)
    "Genesis 16:1-16": "J",      # Hagar and Ishmael
    "Genesis 17:1-27": "P",      # Covenant of circumcision
    "Genesis 18:1-33": "J",      # Three visitors, Sodom
    "Genesis 19:1-38": "J",      # Destruction of Sodom
    "Genesis 20:1-18": "E",      # Abraham and Abimelech
    "Genesis 21:1-7": "P",       # Isaac's birth (with J elements)
    "Genesis 21:8-21": "E",      # Hagar sent away
    "Genesis 21:22-34": "E",     # Treaty with Abimelech
    "Genesis 22:1-19": "E",      # Binding of Isaac
    "Genesis 22:20-24": "J",     # Nahor's children
    "Genesis 23:1-20": "P",      # Sarah's death, cave purchase
    "Genesis 24:1-67": "J",      # Rebekah
    "Genesis 25:1-6": "J",       # Abraham's other sons
    "Genesis 25:7-11": "P",      # Abraham's death
    "Genesis 25:12-18": "P",     # Ishmael genealogy
    "Genesis 25:19-26": "P",     # Jacob and Esau birth
    "Genesis 25:27-34": "J",     # Birthright sold

    # Jacob narratives
    "Genesis 26:1-35": "J",      # Isaac and Abimelech
    "Genesis 27:1-45": "J",      # Jacob steals blessing
    "Genesis 27:46-28:9": "P",   # Jacob sent to Laban
    "Genesis 28:10-22": "JE",    # Jacob's dream (mixed)
    "Genesis 29:1-30": "JE",     # Jacob meets Rachel
    "Genesis 29:31-30:24": "JE", # Jacob's children
    "Genesis 30:25-43": "JE",    # Jacob's flocks
    "Genesis 31:1-55": "JE",     # Jacob flees Laban
    "Genesis 32:1-32": "JE",     # Jacob wrestles
    "Genesis 33:1-20": "JE",     # Jacob meets Esau
    "Genesis 34:1-31": "JE",     # Dinah
    "Genesis 35:1-15": "E",      # Bethel
    "Genesis 35:16-20": "E",     # Rachel's death
    "Genesis 35:21-29": "P",     # Isaac's death
    "Genesis 36:1-43": "P",      # Esau genealogy

    # Joseph narratives
    "Genesis 37:1-36": "JE",     # Joseph sold
    "Genesis 38:1-30": "J",      # Judah and Tamar
    "Genesis 39:1-23": "J",      # Potiphar's wife
    "Genesis 40:1-23": "E",      # Dreams in prison
    "Genesis 41:1-57": "E",      # Pharaoh's dreams
    "Genesis 42:1-38": "JE",     # Brothers in Egypt
    "Genesis 43:1-34": "JE",     # Second trip
    "Genesis 44:1-34": "JE",     # Silver cup
    "Genesis 45:1-28": "JE",     # Joseph revealed
    "Genesis 46:1-34": "JE",     # Jacob to Egypt
    "Genesis 47:1-31": "JE",     # Jacob before Pharaoh
    "Genesis 48:1-22": "JE",     # Jacob blesses sons
    "Genesis 49:1-33": "J",      # Jacob's blessing
    "Genesis 50:1-26": "JE",     # Jacob's burial, Joseph's death

    # EXODUS
    "Exodus 1:1-7": "P",         # Israelites in Egypt
    "Exodus 1:8-22": "JE",       # Oppression
    "Exodus 2:1-25": "JE",       # Moses' birth
    "Exodus 3:1-15": "E",        # Burning bush
    "Exodus 3:16-22": "J",       # Mission
    "Exodus 4:1-31": "JE",       # Signs
    "Exodus 5:1-23": "JE",       # Before Pharaoh
    "Exodus 6:1-13": "P",        # God's promise
    "Exodus 6:14-27": "P",       # Genealogy
    "Exodus 6:28-7:13": "P",     # Aaron's rod
    "Exodus 7:14-25": "JE",      # Water to blood
    "Exodus 8:1-32": "JE",       # Frogs, gnats, flies
    "Exodus 9:1-35": "JE",       # Livestock, boils, hail
    "Exodus 10:1-29": "JE",      # Locusts, darkness
    "Exodus 11:1-10": "JE",      # Warning of death
    "Exodus 12:1-28": "P",       # Passover instructions
    "Exodus 12:29-42": "JE",     # Death of firstborn
    "Exodus 12:43-51": "P",      # Passover rules
    "Exodus 13:1-16": "JE",      # Firstborn consecration
    "Exodus 13:17-14:31": "JE",  # Sea crossing
    "Exodus 15:1-21": "J",       # Song of the Sea
    "Exodus 15:22-27": "JE",     # Bitter water
    "Exodus 16:1-36": "P",       # Manna and quail
    "Exodus 17:1-16": "JE",      # Water from rock, Amalek
    "Exodus 18:1-27": "E",       # Jethro's visit
    "Exodus 19:1-25": "JE",      # Sinai
    "Exodus 20:1-17": "E",       # Ten Commandments
    "Exodus 20:18-26": "E",      # People's fear
    "Exodus 21:1-23:33": "E",    # Covenant Code
    "Exodus 24:1-18": "JE",      # Covenant ceremony
    "Exodus 25:1-31:18": "P",    # Tabernacle instructions
    "Exodus 32:1-35": "JE",      # Golden calf
    "Exodus 33:1-23": "JE",      # Moses and God
    "Exodus 34:1-35": "J",       # Covenant renewed
    "Exodus 35:1-40:38": "P",    # Tabernacle construction

    # LEVITICUS (almost entirely P)
    "Leviticus 1:1-27:34": "P",  # Priestly laws

    # NUMBERS
    "Numbers 1:1-10:10": "P",    # Census, organization
    "Numbers 10:11-36": "JE",    # Departure from Sinai
    "Numbers 11:1-35": "JE",     # Complaints
    "Numbers 12:1-16": "E",      # Miriam and Aaron
    "Numbers 13:1-33": "JE",     # Spies
    "Numbers 14:1-45": "JE",     # Rebellion
    "Numbers 15:1-41": "P",      # Various laws
    "Numbers 16:1-50": "JEP",    # Korah's rebellion
    "Numbers 17:1-13": "P",      # Aaron's rod
    "Numbers 18:1-32": "P",      # Levitical duties
    "Numbers 19:1-22": "P",      # Red heifer
    "Numbers 20:1-29": "JEP",    # Kadesh, water, Aaron's death
    "Numbers 21:1-35": "JE",     # Journey, bronze serpent
    "Numbers 22:1-24:25": "JE",  # Balaam
    "Numbers 25:1-18": "JE",     # Baal Peor
    "Numbers 26:1-65": "P",      # Second census
    "Numbers 27:1-23": "P",      # Zelophehad's daughters
    "Numbers 28:1-30:16": "P",   # Offerings, vows
    "Numbers 31:1-54": "P",      # War with Midian
    "Numbers 32:1-42": "JE",     # Transjordan tribes
    "Numbers 33:1-56": "P",      # Journey summary
    "Numbers 34:1-36:13": "P",   # Land boundaries

    # DEUTERONOMY (almost entirely D)
    "Deuteronomy 1:1-4:43": "D",   # First address
    "Deuteronomy 4:44-28:68": "D", # Law code
    "Deuteronomy 29:1-30:20": "D", # Third address
    "Deuteronomy 31:1-29": "D",    # Joshua commissioned
    "Deuteronomy 31:30-32:52": "D", # Song of Moses
    "Deuteronomy 33:1-29": "D",    # Blessing of Moses
    "Deuteronomy 34:1-12": "P",    # Moses' death (P ending)
}

# Hebrew function words for style analysis
HEBREW_FUNCTION_WORDS = [
    # Conjunctions
    'ו', 'וְ', 'כִּי', 'אִם', 'אוֹ', 'גַּם', 'אַךְ', 'רַק',
    # Prepositions
    'בְּ', 'לְ', 'מִן', 'אֶל', 'עַל', 'אֶת', 'עִם', 'תַּחַת',
    # Articles and particles
    'הַ', 'אֲשֶׁר', 'זֶה', 'זֹאת', 'הוּא', 'הִיא', 'הֵם', 'הֵן',
    # Negation
    'לֹא', 'אַל', 'אֵין', 'בְּלִי',
    # Question words
    'מָה', 'מִי', 'אֵיךְ', 'לָמָּה', 'מָתַי', 'אֵיפֹה',
    # Common particles
    'כֹּל', 'כָּל', 'עוֹד', 'שָׁם', 'פֹּה', 'הִנֵּה',
    # Divine names (key for J vs E!)
    'יהוה', 'אֱלֹהִים', 'אֵל', 'אֲדֹנָי', 'שַׁדַּי',
]


def parse_reference(ref: str) -> Tuple[str, int, int, int]:
    """Parse 'Book Chapter:Start-End' or 'Book Chapter:Verse' format."""
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
        return book, chapter, 1, 999  # Whole chapter


def get_source_for_verse(book: str, chapter: int, verse: int) -> str:
    """Get JEDP source for a specific verse."""
    ref_key = f"{book} {chapter}:{verse}"

    # Check exact match first
    if ref_key in JEDP_ASSIGNMENTS:
        return JEDP_ASSIGNMENTS[ref_key]

    # Check range matches
    for ref, source in JEDP_ASSIGNMENTS.items():
        try:
            b, ch, start, end = parse_reference(ref)
            if b == book and ch == chapter and start <= verse <= end:
                return source
        except:
            continue

    # Default assignments by book
    if book == "Leviticus":
        return "P"
    elif book == "Deuteronomy":
        return "D"

    return "?"  # Unknown


async def fetch_sefaria_text(session: aiohttp.ClientSession, book: str, chapter: int) -> Optional[Dict]:
    """Fetch Hebrew text from Sefaria API."""
    ref = f"{book}.{chapter}"
    url = f"{SEFARIA_API}/{ref}?version=hebrew"

    try:
        async with session.get(url) as response:
            if response.status == 200:
                return await response.json()
            else:
                print(f"  Warning: Failed to fetch {ref}: {response.status}")
                return None
    except Exception as e:
        print(f"  Error fetching {ref}: {e}")
        return None


async def main():
    print("=" * 70)
    print("HEBREW TORAH IMPORT WITH JEDP SOURCE ASSIGNMENTS")
    print("=" * 70)
    print("\nImporting from Sefaria API with Wellhausen source labels...")

    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=5)

    async with pool.acquire() as conn:
        # Create tables for Hebrew texts
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS hebrew_torah (
                id SERIAL PRIMARY KEY,
                book TEXT NOT NULL,
                chapter INTEGER NOT NULL,
                verse INTEGER NOT NULL,
                hebrew_text TEXT NOT NULL,
                jedp_source TEXT NOT NULL,

                -- Analysis fields
                word_count INTEGER,
                function_word_vector FLOAT[],

                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(book, chapter, verse)
            );

            CREATE INDEX IF NOT EXISTS idx_hebrew_torah_source
            ON hebrew_torah(jedp_source);

            CREATE INDEX IF NOT EXISTS idx_hebrew_torah_book_chapter
            ON hebrew_torah(book, chapter);
        """)

        print("\n[1] Created hebrew_torah table")

        # Books to import
        books = [
            ("Genesis", 50),
            ("Exodus", 40),
            ("Leviticus", 27),
            ("Numbers", 36),
            ("Deuteronomy", 34),
        ]

        total_verses = 0
        source_counts = {"J": 0, "E": 0, "D": 0, "P": 0, "JE": 0, "JEP": 0, "?": 0}

        async with aiohttp.ClientSession() as session:
            for book, num_chapters in books:
                print(f"\n[2] Importing {book} ({num_chapters} chapters)...")

                for chapter in range(1, num_chapters + 1):
                    data = await fetch_sefaria_text(session, book, chapter)

                    if not data or 'versions' not in data:
                        continue

                    # Get Hebrew text
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

                        # Get JEDP source
                        source = get_source_for_verse(book, chapter, verse_num)

                        # Count words
                        words = hebrew_text.split()
                        word_count = len(words)

                        # Insert into database
                        try:
                            await conn.execute("""
                                INSERT INTO hebrew_torah (book, chapter, verse, hebrew_text, jedp_source, word_count)
                                VALUES ($1, $2, $3, $4, $5, $6)
                                ON CONFLICT (book, chapter, verse) DO UPDATE SET
                                    hebrew_text = EXCLUDED.hebrew_text,
                                    jedp_source = EXCLUDED.jedp_source,
                                    word_count = EXCLUDED.word_count
                            """, book, chapter, verse_num, hebrew_text, source, word_count)

                            total_verses += 1

                            # Count sources
                            for s in ["J", "E", "D", "P"]:
                                if s in source:
                                    source_counts[s] += 1
                            if source == "?":
                                source_counts["?"] += 1

                        except Exception as e:
                            print(f"  Error inserting {book} {chapter}:{verse_num}: {e}")

                    if chapter % 10 == 0:
                        print(f"    Chapter {chapter}/{num_chapters} done")

                    # Rate limiting
                    await asyncio.sleep(0.1)

        print(f"\n[3] Imported {total_verses} verses")

        # Print source distribution
        print("\n[4] JEDP Source Distribution:")
        print("-" * 40)
        for source, count in sorted(source_counts.items(), key=lambda x: -x[1]):
            if count > 0:
                pct = count / total_verses * 100 if total_verses > 0 else 0
                print(f"  {source}: {count} verses ({pct:.1f}%)")

        # Verify import
        count = await conn.fetchval("SELECT COUNT(*) FROM hebrew_torah")
        print(f"\n[5] Total verses in database: {count}")

        # Sample some verses
        print("\n[6] Sample verses by source:")
        for source in ["J", "E", "D", "P"]:
            sample = await conn.fetchrow("""
                SELECT book, chapter, verse, LEFT(hebrew_text, 50) as sample, jedp_source
                FROM hebrew_torah
                WHERE jedp_source = $1
                LIMIT 1
            """, source)
            if sample:
                print(f"\n  {source}: {sample['book']} {sample['chapter']}:{sample['verse']}")
                print(f"     {sample['sample']}...")

    await pool.close()

    print("\n" + "=" * 70)
    print("HEBREW TORAH IMPORT COMPLETE")
    print("=" * 70)
    print("\nNext: Run JEDP analysis with logos_jedp_hebrew_analysis.py")


if __name__ == "__main__":
    asyncio.run(main())
