#!/usr/bin/env python3
"""
================================================================================
IMPORT SBLGNT SYNOPTIC GOSPELS
================================================================================

Imports Matthew, Mark, and Luke from the MorphGNT SBLGNT repository.
Stores verse-level Greek text in source_texts table.
Creates synoptic_alignments for parallel passages.

Source: https://github.com/morphgnt/sblgnt
License: CC BY-SA 3.0
================================================================================
"""

import asyncio
import asyncpg
import os
import re
from collections import defaultdict
from typing import Dict, List, Tuple
import urllib.request

DATABASE_URL = os.environ.get('DATABASE_URL', '')

# MorphGNT SBLGNT raw file URLs
MORPHGNT_BASE = "https://raw.githubusercontent.com/morphgnt/sblgnt/master"
GOSPEL_FILES = {
    'Matthew': '61-Mt-morphgnt.txt',
    'Mark': '62-Mk-morphgnt.txt',
    'Luke': '63-Lk-morphgnt.txt'
}

# Book codes in MorphGNT (first 2 digits of reference)
BOOK_CODES = {
    '01': 'Matthew',
    '02': 'Mark',
    '03': 'Luke'
}

# Synoptic parallel passages (subset - will expand)
# Format: (pericope_name, mt_refs, mk_refs, lk_refs)
SYNOPTIC_PARALLELS = [
    # Triple Tradition
    ("John the Baptist's Preaching", "3:1-12", "1:1-8", "3:1-20"),
    ("Baptism of Jesus", "3:13-17", "1:9-11", "3:21-22"),
    ("Temptation of Jesus", "4:1-11", "1:12-13", "4:1-13"),
    ("Beginning of Galilean Ministry", "4:12-17", "1:14-15", "4:14-15"),
    ("Call of First Disciples", "4:18-22", "1:16-20", "5:1-11"),
    ("Healing of Peter's Mother-in-law", "8:14-15", "1:29-31", "4:38-39"),
    ("Cleansing of a Leper", "8:1-4", "1:40-45", "5:12-16"),
    ("Healing of the Paralytic", "9:1-8", "2:1-12", "5:17-26"),
    ("Call of Matthew/Levi", "9:9-13", "2:13-17", "5:27-32"),
    ("Question about Fasting", "9:14-17", "2:18-22", "5:33-39"),
    ("Plucking Grain on Sabbath", "12:1-8", "2:23-28", "6:1-5"),
    ("Man with Withered Hand", "12:9-14", "3:1-6", "6:6-11"),
    ("Choosing the Twelve", "10:1-4", "3:13-19", "6:12-16"),
    ("Beelzebul Controversy", "12:22-32", "3:22-30", "11:14-23"),
    ("True Kindred", "12:46-50", "3:31-35", "8:19-21"),
    ("Parable of the Sower", "13:1-9", "4:1-9", "8:4-8"),
    ("Purpose of Parables", "13:10-17", "4:10-12", "8:9-10"),
    ("Interpretation of Sower", "13:18-23", "4:13-20", "8:11-15"),
    ("Parable of Mustard Seed", "13:31-32", "4:30-32", "13:18-19"),
    ("Stilling the Storm", "8:23-27", "4:35-41", "8:22-25"),
    ("Gerasene Demoniac", "8:28-34", "5:1-20", "8:26-39"),
    ("Jairus's Daughter", "9:18-26", "5:21-43", "8:40-56"),
    ("Mission of the Twelve", "10:5-15", "6:7-13", "9:1-6"),
    ("Death of John the Baptist", "14:1-12", "6:14-29", "9:7-9"),
    ("Feeding of Five Thousand", "14:13-21", "6:30-44", "9:10-17"),
    ("Walking on Water", "14:22-33", "6:45-52", None),
    ("Peter's Confession", "16:13-20", "8:27-30", "9:18-21"),
    ("First Passion Prediction", "16:21-23", "8:31-33", "9:22"),
    ("Conditions of Discipleship", "16:24-28", "8:34-9:1", "9:23-27"),
    ("Transfiguration", "17:1-8", "9:2-8", "9:28-36"),
    ("Coming of Elijah", "17:9-13", "9:9-13", None),
    ("Healing Epileptic Boy", "17:14-21", "9:14-29", "9:37-43"),
    ("Second Passion Prediction", "17:22-23", "9:30-32", "9:43-45"),
    ("Temple Tax", "17:24-27", None, None),
    ("Who is Greatest", "18:1-5", "9:33-37", "9:46-48"),
    ("Unknown Exorcist", None, "9:38-41", "9:49-50"),
    ("Divorce Question", "19:1-12", "10:1-12", "16:18"),
    ("Blessing Children", "19:13-15", "10:13-16", "18:15-17"),
    ("Rich Young Man", "19:16-30", "10:17-31", "18:18-30"),
    ("Third Passion Prediction", "20:17-19", "10:32-34", "18:31-34"),
    ("Request of James and John", "20:20-28", "10:35-45", None),
    ("Blind Bartimaeus", "20:29-34", "10:46-52", "18:35-43"),
    ("Triumphal Entry", "21:1-11", "11:1-11", "19:28-40"),
    ("Cleansing the Temple", "21:12-17", "11:15-19", "19:45-48"),
    ("Cursing Fig Tree", "21:18-22", "11:12-14,20-25", None),
    ("Authority Questioned", "21:23-27", "11:27-33", "20:1-8"),
    ("Parable of Wicked Tenants", "21:33-46", "12:1-12", "20:9-19"),
    ("Tribute to Caesar", "22:15-22", "12:13-17", "20:20-26"),
    ("Question about Resurrection", "22:23-33", "12:18-27", "20:27-40"),
    ("Greatest Commandment", "22:34-40", "12:28-34", "10:25-28"),
    ("David's Son", "22:41-46", "12:35-37", "20:41-44"),
    ("Woes to Scribes/Pharisees", "23:1-36", "12:38-40", "20:45-47"),
    ("Widow's Offering", None, "12:41-44", "21:1-4"),
    ("Destruction of Temple Foretold", "24:1-2", "13:1-2", "21:5-6"),
    ("Signs of End", "24:3-14", "13:3-13", "21:7-19"),
    ("Desolating Sacrilege", "24:15-28", "13:14-23", "21:20-24"),
    ("Coming of Son of Man", "24:29-31", "13:24-27", "21:25-28"),
    ("Lesson of Fig Tree", "24:32-35", "13:28-31", "21:29-33"),
    ("Unknown Day/Hour", "24:36-44", "13:32-37", None),
    ("Anointing at Bethany", "26:6-13", "14:3-9", "7:36-50"),
    ("Judas's Betrayal", "26:14-16", "14:10-11", "22:3-6"),
    ("Last Supper Preparation", "26:17-19", "14:12-16", "22:7-13"),
    ("Last Supper", "26:20-29", "14:17-25", "22:14-23"),
    ("Peter's Denial Predicted", "26:30-35", "14:26-31", "22:31-34"),
    ("Gethsemane", "26:36-46", "14:32-42", "22:39-46"),
    ("Arrest of Jesus", "26:47-56", "14:43-52", "22:47-53"),
    ("Trial before Sanhedrin", "26:57-68", "14:53-65", "22:54-71"),
    ("Peter's Denial", "26:69-75", "14:66-72", "22:54-62"),
    ("Jesus before Pilate", "27:1-2,11-14", "15:1-5", "23:1-5"),
    ("Barabbas", "27:15-26", "15:6-15", "23:13-25"),
    ("Mocking by Soldiers", "27:27-31", "15:16-20", None),
    ("Crucifixion", "27:32-44", "15:21-32", "23:26-43"),
    ("Death of Jesus", "27:45-56", "15:33-41", "23:44-49"),
    ("Burial of Jesus", "27:57-61", "15:42-47", "23:50-56"),
    ("Empty Tomb", "28:1-8", "16:1-8", "24:1-12"),

    # Double Tradition (Q material - Matthew + Luke only)
    ("Beatitudes", "5:3-12", None, "6:20-26"),
    ("Love Your Enemies", "5:43-48", None, "6:27-36"),
    ("Judging Others", "7:1-5", None, "6:37-42"),
    ("Tree and Fruits", "7:15-20", None, "6:43-45"),
    ("House on Rock", "7:24-27", None, "6:47-49"),
    ("Centurion's Servant", "8:5-13", None, "7:1-10"),
    ("John's Question", "11:2-6", None, "7:18-23"),
    ("Jesus on John", "11:7-19", None, "7:24-35"),
    ("Woes on Cities", "11:20-24", None, "10:12-15"),
    ("Thanksgiving to Father", "11:25-27", None, "10:21-22"),
    ("Lord's Prayer", "6:9-13", None, "11:2-4"),
    ("Ask, Seek, Knock", "7:7-11", None, "11:9-13"),
    ("Beelzebul (Q version)", "12:22-30", None, "11:14-23"),
    ("Return of Evil Spirit", "12:43-45", None, "11:24-26"),
    ("Sign of Jonah", "12:38-42", None, "11:29-32"),
    ("Light and Eye", "6:22-23", None, "11:33-36"),
    ("Woes on Pharisees (Q)", "23:4-36", None, "11:37-52"),
    ("Fearless Confession", "10:26-33", None, "12:2-9"),
    ("Blasphemy Against Spirit", "12:31-32", None, "12:10"),
    ("Anxiety about Life", "6:25-34", None, "12:22-32"),
    ("Treasure in Heaven", "6:19-21", None, "12:33-34"),
    ("Faithful Servant", "24:45-51", None, "12:41-46"),
    ("Signs of Times", "16:2-3", None, "12:54-56"),
    ("Settling with Accuser", "5:25-26", None, "12:57-59"),
    ("Mustard Seed (Q)", "13:31-32", None, "13:18-19"),
    ("Leaven", "13:33", None, "13:20-21"),
    ("Narrow Gate", "7:13-14", None, "13:23-24"),
    ("Shut Door", "7:22-23", None, "13:25-27"),
    ("Lament over Jerusalem", "23:37-39", None, "13:34-35"),
    ("Great Supper", "22:1-14", None, "14:15-24"),
    ("Cost of Discipleship", "10:37-38", None, "14:25-27"),
    ("Salt", "5:13", None, "14:34-35"),
    ("Lost Sheep", "18:10-14", None, "15:1-7"),
    ("Serving Two Masters", "6:24", None, "16:13"),
    ("Law and Prophets", "5:17-18", None, "16:16-17"),
    ("Divorce (Q)", "5:31-32", None, "16:18"),
    ("Scandal/Forgiveness", "18:6-7,15,21-22", None, "17:1-4"),
    ("Faith like Mustard Seed", "17:20", None, "17:5-6"),
    ("Day of Son of Man", "24:26-28,37-41", None, "17:22-37"),
    ("Parable of Talents/Pounds", "25:14-30", None, "19:11-27"),
    ("Twelve Thrones", "19:28", None, "22:28-30"),
]


def parse_reference(ref_str: str) -> List[Tuple[int, int]]:
    """Parse a reference string like '3:1-12' into list of (chapter, verse) tuples."""
    verses = []
    if not ref_str:
        return verses

    # Handle comma-separated ranges like "11:12-14,20-25" or "27:1-2,11-14"
    parts = ref_str.split(',')
    current_chapter = None

    for part in parts:
        part = part.strip()

        # Count colons to determine format
        colon_count = part.count(':')

        if colon_count == 1:
            # Standard format like "3:1-12" or "3:1"
            chap_str, verse_str = part.split(':')
            current_chapter = int(chap_str)
            verse_part = verse_str
        elif colon_count == 0:
            # Just verse range in current chapter like "20-25"
            verse_part = part
        else:
            # Multiple colons - complex reference, skip for now
            continue

        if '-' in verse_part:
            start, end = verse_part.split('-')
            try:
                for v in range(int(start), int(end) + 1):
                    verses.append((current_chapter, v))
            except ValueError:
                continue
        else:
            try:
                verses.append((current_chapter, int(verse_part)))
            except ValueError:
                continue

    return verses


def download_morphgnt_file(gospel: str) -> str:
    """Download a MorphGNT file and return its content."""
    filename = GOSPEL_FILES[gospel]
    url = f"{MORPHGNT_BASE}/{filename}"
    print(f"  Downloading {gospel} from {url}...")

    with urllib.request.urlopen(url) as response:
        content = response.read().decode('utf-8')

    return content


def parse_morphgnt(content: str, book_name: str) -> Dict[str, str]:
    """
    Parse MorphGNT content into verses.

    Returns dict of {reference: greek_text}
    where reference is like "Matthew 1:1"
    """
    verses = defaultdict(list)

    for line in content.strip().split('\n'):
        if not line.strip():
            continue

        parts = line.split()
        if len(parts) < 4:
            continue

        # Reference format: BBCCVV (Book-Chapter-Verse)
        ref_code = parts[0]
        word = parts[3]  # The actual Greek word

        # Parse reference
        chapter = int(ref_code[2:4])
        verse = int(ref_code[4:6])

        ref_str = f"{book_name} {chapter}:{verse}"
        verses[ref_str].append(word)

    # Join words into verse text
    return {ref: ' '.join(words) for ref, words in verses.items()}


async def create_tables(conn):
    """Ensure required tables exist."""

    # Check if source_texts needs URN column update
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS source_texts (
            id SERIAL PRIMARY KEY,
            urn TEXT UNIQUE,
            language TEXT,
            author TEXT,
            work TEXT,
            section TEXT,
            content TEXT,
            word_count INTEGER,
            source TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)

    # Create synoptic_alignments if not exists
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS synoptic_alignments (
            id SERIAL PRIMARY KEY,
            pericope_name TEXT,
            tradition_type TEXT,  -- 'triple', 'double_mt_lk', 'double_mk_lk', 'special_mt', 'special_lk'
            matthew_refs TEXT,
            mark_refs TEXT,
            luke_refs TEXT,
            matthew_text TEXT,
            mark_text TEXT,
            luke_text TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)

    await conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_source_texts_work ON source_texts(work)
    """)
    await conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_source_texts_urn ON source_texts(urn)
    """)
    await conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_synoptic_tradition ON synoptic_alignments(tradition_type)
    """)


async def import_gospel(conn, gospel: str, verses: Dict[str, str]) -> int:
    """Import a gospel's verses into source_texts."""

    count = 0
    for ref, text in verses.items():
        # Parse reference like "Matthew 1:1"
        parts = ref.split(' ')
        book = parts[0]
        chap_verse = parts[1]
        chapter, verse = chap_verse.split(':')

        urn = f"urn:cts:greekLit:tlg0031.tlg00{GOSPEL_FILES[gospel][1]}:{chap_verse}"
        word_count = len(text.split())

        try:
            await conn.execute("""
                INSERT INTO source_texts (urn, language, author, work, section, content, word_count, source)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (urn) DO UPDATE SET
                    content = EXCLUDED.content,
                    word_count = EXCLUDED.word_count
            """, urn, 'greek', 'New Testament', gospel, chap_verse, text, word_count, 'SBLGNT/MorphGNT')
            count += 1
        except Exception as e:
            print(f"  Error inserting {ref}: {e}")

    return count


async def create_synoptic_alignments(conn, all_verses: Dict[str, Dict[str, str]]) -> int:
    """Create synoptic alignment records with full text."""

    count = 0

    for pericope_name, mt_refs, mk_refs, lk_refs in SYNOPTIC_PARALLELS:
        # Determine tradition type
        if mt_refs and mk_refs and lk_refs:
            tradition_type = 'triple'
        elif mt_refs and lk_refs and not mk_refs:
            tradition_type = 'double_mt_lk'  # Q material
        elif mk_refs and lk_refs and not mt_refs:
            tradition_type = 'double_mk_lk'
        elif mt_refs and mk_refs and not lk_refs:
            tradition_type = 'double_mt_mk'
        elif mt_refs and not mk_refs and not lk_refs:
            tradition_type = 'special_mt'
        elif lk_refs and not mt_refs and not mk_refs:
            tradition_type = 'special_lk'
        elif mk_refs and not mt_refs and not lk_refs:
            tradition_type = 'special_mk'
        else:
            continue

        # Collect text for each gospel
        def get_text(gospel: str, refs: str) -> str:
            if not refs:
                return None
            verses_list = parse_reference(refs)
            texts = []
            for chap, verse in verses_list:
                ref_key = f"{gospel} {chap}:{verse}"
                if ref_key in all_verses.get(gospel, {}):
                    texts.append(all_verses[gospel][ref_key])
            return ' '.join(texts) if texts else None

        mt_text = get_text('Matthew', mt_refs)
        mk_text = get_text('Mark', mk_refs)
        lk_text = get_text('Luke', lk_refs)

        try:
            # Use existing table schema: alignment_group instead of pericope_name
            # matthew_ref instead of matthew_refs, etc.
            await conn.execute("""
                INSERT INTO synoptic_alignments
                (alignment_group, tradition_type, matthew_ref, mark_ref, luke_ref,
                 matthew_text, mark_text, luke_text)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT DO NOTHING
            """, pericope_name, tradition_type, mt_refs, mk_refs, lk_refs,
                 mt_text, mk_text, lk_text)
            count += 1
        except Exception as e:
            print(f"  Error creating alignment for {pericope_name}: {e}")

    return count


async def main():
    """Main import function."""
    print("=" * 70)
    print("IMPORTING SBLGNT SYNOPTIC GOSPELS")
    print("=" * 70)

    pool = await asyncpg.create_pool(DATABASE_URL)

    async with pool.acquire() as conn:
        # Create tables
        print("\nCreating/verifying tables...")
        await create_tables(conn)

        # Download and parse each gospel
        all_verses = {}

        for gospel in ['Matthew', 'Mark', 'Luke']:
            print(f"\nProcessing {gospel}...")

            # Download
            content = download_morphgnt_file(gospel)

            # Parse
            verses = parse_morphgnt(content, gospel)
            all_verses[gospel] = verses
            print(f"  Parsed {len(verses)} verses")

            # Import
            count = await import_gospel(conn, gospel, verses)
            print(f"  Imported {count} verses to source_texts")

        # Create synoptic alignments
        print("\nCreating synoptic alignments...")
        align_count = await create_synoptic_alignments(conn, all_verses)
        print(f"  Created {align_count} synoptic alignment records")

        # Summary stats
        print("\n" + "=" * 70)
        print("IMPORT SUMMARY")
        print("=" * 70)

        for gospel in ['Matthew', 'Mark', 'Luke']:
            count = await conn.fetchval(
                "SELECT COUNT(*) FROM source_texts WHERE work = $1", gospel
            )
            word_count = await conn.fetchval(
                "SELECT SUM(word_count) FROM source_texts WHERE work = $1", gospel
            )
            print(f"  {gospel}: {count} verses, {word_count:,} words")

        # Alignment stats
        stats = await conn.fetch("""
            SELECT tradition_type, COUNT(*) as cnt
            FROM synoptic_alignments
            GROUP BY tradition_type
            ORDER BY cnt DESC
        """)
        print("\n  Synoptic Alignments:")
        for row in stats:
            print(f"    {row['tradition_type']}: {row['cnt']} pericopes")

    await pool.close()
    print("\nDone!")


if __name__ == "__main__":
    asyncio.run(main())
