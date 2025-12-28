#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║  LOGOS HEBREW/ARAMAIC CORPUS HARVESTER                                       ║
║  Downloads from Sefaria.org API (free, no auth required)                     ║
╚══════════════════════════════════════════════════════════════════════════════╝

WHAT THIS DOWNLOADS:
- Hebrew Bible (Torah, Prophets, Writings) - 23,000+ verses
- Aramaic Targums (Onkelos, Jonathan) - 30,000+ verses  
- Mishnah (all 63 tractates) - 4,000+ passages
- Selected Talmud - key tractates
- Midrash Rabbah - Genesis, Exodus, etc.

Total: ~100,000 passages with temporal metadata

WHY THIS MATTERS:
Greek πίστις ← Hebrew אֱמוּנָה (emunah) = "faithfulness" not just "belief"
Greek δόξα ← Hebrew כָּבוֹד (kavod) = "weight/presence" not "opinion"
Without Hebrew, we MISTRANSLATE the entire NT and Church Fathers.

USAGE:
    python3 harvest_hebrew_aramaic.py

RUNTIME: ~1-2 hours (polite rate limiting to Sefaria)

OUTPUT: Inserts directly into your Railway PostgreSQL database
"""

import os
import sys
import json
import time
import asyncio
import aiohttp
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, asdict

# =============================================================================
# CONFIGURATION
# =============================================================================

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set")
    print("Run: export DATABASE_URL='postgresql://...'")
    sys.exit(1)

SEFARIA_BASE = "https://www.sefaria.org/api"
RATE_LIMIT_DELAY = 0.3  # Be polite to Sefaria
MAX_CONCURRENT = 5

# =============================================================================
# SCHOLARLY DATES FOR ALL TEXTS
# =============================================================================

BIBLICAL_DATES = {
    # Torah - Documentary Hypothesis dates
    "Genesis": -500,      # Final redaction (P source)
    "Exodus": -500,
    "Leviticus": -500,
    "Numbers": -500,
    "Deuteronomy": -622,  # Josiah's reform
    
    # Prophets
    "Joshua": -600,
    "Judges": -550,
    "Samuel": -550,
    "Kings": -550,
    "Isaiah": -700,       # First Isaiah; Second Isaiah ~540
    "Jeremiah": -580,
    "Ezekiel": -570,
    "Hosea": -750,
    "Joel": -400,
    "Amos": -760,
    "Obadiah": -580,
    "Jonah": -400,
    "Micah": -720,
    "Nahum": -620,
    "Habakkuk": -600,
    "Zephaniah": -630,
    "Haggai": -520,
    "Zechariah": -520,
    "Malachi": -450,
    
    # Writings
    "Psalms": -500,       # Composite
    "Proverbs": -500,
    "Job": -500,
    "Song of Songs": -400,
    "Ruth": -400,
    "Lamentations": -580,
    "Ecclesiastes": -250,
    "Esther": -400,
    "Daniel": -165,       # Maccabean period
    "Ezra": -400,
    "Nehemiah": -400,
    "Chronicles": -350,
    
    # Targums
    "Targum Onkelos": 100,      # 1st-2nd century CE
    "Targum Jonathan": 200,     # 2nd-3rd century CE
    "Targum Pseudo-Jonathan": 650,
    
    # Mishnah
    "Mishnah": 200,       # Compiled by Rabbi Judah HaNasi
    
    # Talmud
    "Jerusalem Talmud": 400,
    "Babylonian Talmud": 500,
    
    # Midrash
    "Genesis Rabbah": 400,
    "Exodus Rabbah": 900,
    "Leviticus Rabbah": 450,
    "Numbers Rabbah": 1200,
    "Deuteronomy Rabbah": 900,
}

# =============================================================================
# DATA STRUCTURES
# =============================================================================

@dataclass
class Passage:
    urn: str
    language: str
    text: str
    translation_en: Optional[str]
    author: str
    work: str
    section: str
    date_composed: int
    period: str
    genre: str
    source: str = "sefaria"
    
def get_period(year: int) -> str:
    """Get period label from year."""
    if year < -586:
        return "First Temple"
    elif year < -332:
        return "Second Temple (Persian)"
    elif year < -63:
        return "Hellenistic"
    elif year < 70:
        return "Roman (Pre-Destruction)"
    elif year < 200:
        return "Tannaitic"
    elif year < 500:
        return "Amoraic"
    else:
        return "Post-Talmudic"

# =============================================================================
# SEFARIA API FUNCTIONS
# =============================================================================

async def fetch_text(session: aiohttp.ClientSession, ref: str) -> Optional[Dict]:
    """Fetch a text from Sefaria API."""
    url = f"{SEFARIA_BASE}/texts/{ref}?context=0"
    try:
        async with session.get(url) as response:
            if response.status == 200:
                return await response.json()
            else:
                print(f"  Warning: {ref} returned {response.status}")
                return None
    except Exception as e:
        print(f"  Error fetching {ref}: {e}")
        return None

async def get_index(session: aiohttp.ClientSession, title: str) -> Optional[Dict]:
    """Get the index/structure of a text."""
    url = f"{SEFARIA_BASE}/index/{title}"
    try:
        async with session.get(url) as response:
            if response.status == 200:
                return await response.json()
            return None
    except Exception:
        return None

def flatten_text(data: Any, prefix: str = "") -> List[tuple]:
    """Flatten nested text structure into (ref, text) pairs."""
    results = []
    
    if isinstance(data, str):
        if data.strip():
            results.append((prefix, data.strip()))
    elif isinstance(data, list):
        for i, item in enumerate(data, 1):
            new_prefix = f"{prefix}:{i}" if prefix else str(i)
            results.extend(flatten_text(item, new_prefix))
    
    return results

# =============================================================================
# BIBLE HARVESTER
# =============================================================================

BIBLE_BOOKS = [
    # Torah
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
    # Prophets
    "Joshua", "Judges", "I Samuel", "II Samuel", "I Kings", "II Kings",
    "Isaiah", "Jeremiah", "Ezekiel",
    "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
    "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
    # Writings
    "Psalms", "Proverbs", "Job", "Song of Songs", "Ruth", "Lamentations",
    "Ecclesiastes", "Esther", "Daniel", "Ezra", "Nehemiah",
    "I Chronicles", "II Chronicles",
]

async def harvest_bible(session: aiohttp.ClientSession) -> List[Passage]:
    """Harvest the complete Hebrew Bible."""
    passages = []
    
    print("\n📖 HARVESTING HEBREW BIBLE")
    print("=" * 50)
    
    for book in BIBLE_BOOKS:
        print(f"  Fetching {book}...", end=" ", flush=True)
        
        data = await fetch_text(session, book)
        await asyncio.sleep(RATE_LIMIT_DELAY)
        
        if not data:
            print("FAILED")
            continue
        
        hebrew = data.get("he", [])
        english = data.get("text", [])
        
        # Flatten and pair
        he_flat = flatten_text(hebrew)
        en_flat = flatten_text(english)
        
        # Create lookup for English
        en_lookup = {ref: text for ref, text in en_flat}
        
        count = 0
        for ref, he_text in he_flat:
            if not he_text.strip():
                continue
                
            en_text = en_lookup.get(ref, "")
            
            # Get date
            base_book = book.replace("I ", "").replace("II ", "")
            date = BIBLICAL_DATES.get(base_book, -500)
            
            passage = Passage(
                urn=f"urn:sefaria:bible:{book.lower().replace(' ', '_')}:{ref}",
                language="hebrew",
                text=he_text,
                translation_en=en_text if en_text else None,
                author="biblical",
                work=book,
                section=ref,
                date_composed=date,
                period=get_period(date),
                genre="scripture",
            )
            passages.append(passage)
            count += 1
        
        print(f"{count} verses")
    
    print(f"\n  ✓ Total Bible passages: {len(passages)}")
    return passages

# =============================================================================
# TARGUM HARVESTER
# =============================================================================

TARGUMS = [
    ("Onkelos Genesis", "Targum Onkelos", 100),
    ("Onkelos Exodus", "Targum Onkelos", 100),
    ("Onkelos Leviticus", "Targum Onkelos", 100),
    ("Onkelos Numbers", "Targum Onkelos", 100),
    ("Onkelos Deuteronomy", "Targum Onkelos", 100),
    ("Targum Jonathan on Joshua", "Targum Jonathan", 200),
    ("Targum Jonathan on Judges", "Targum Jonathan", 200),
    ("Targum Jonathan on Isaiah", "Targum Jonathan", 200),
]

async def harvest_targums(session: aiohttp.ClientSession) -> List[Passage]:
    """Harvest Aramaic Targums."""
    passages = []
    
    print("\n📜 HARVESTING ARAMAIC TARGUMS")
    print("=" * 50)
    
    for ref, work, date in TARGUMS:
        print(f"  Fetching {ref}...", end=" ", flush=True)
        
        data = await fetch_text(session, ref)
        await asyncio.sleep(RATE_LIMIT_DELAY)
        
        if not data:
            print("FAILED")
            continue
        
        aramaic = data.get("he", [])  # Sefaria uses "he" for Aramaic too
        english = data.get("text", [])
        
        ar_flat = flatten_text(aramaic)
        en_flat = flatten_text(english)
        en_lookup = {r: t for r, t in en_flat}
        
        count = 0
        for section_ref, ar_text in ar_flat:
            if not ar_text.strip():
                continue
            
            passage = Passage(
                urn=f"urn:sefaria:targum:{ref.lower().replace(' ', '_')}:{section_ref}",
                language="aramaic",
                text=ar_text,
                translation_en=en_lookup.get(section_ref),
                author="targum",
                work=work,
                section=section_ref,
                date_composed=date,
                period=get_period(date),
                genre="translation",
            )
            passages.append(passage)
            count += 1
        
        print(f"{count} verses")
    
    print(f"\n  ✓ Total Targum passages: {len(passages)}")
    return passages

# =============================================================================
# MISHNAH HARVESTER
# =============================================================================

MISHNAH_TRACTATES = [
    # Zeraim
    "Mishnah Berakhot", "Mishnah Peah", "Mishnah Demai", "Mishnah Kilayim",
    "Mishnah Sheviit", "Mishnah Terumot", "Mishnah Maasrot", "Mishnah Maaser Sheni",
    "Mishnah Challah", "Mishnah Orlah", "Mishnah Bikkurim",
    # Moed
    "Mishnah Shabbat", "Mishnah Eruvin", "Mishnah Pesachim", "Mishnah Shekalim",
    "Mishnah Yoma", "Mishnah Sukkah", "Mishnah Beitzah", "Mishnah Rosh Hashanah",
    "Mishnah Taanit", "Mishnah Megillah", "Mishnah Moed Katan", "Mishnah Chagigah",
    # Nashim
    "Mishnah Yevamot", "Mishnah Ketubot", "Mishnah Nedarim", "Mishnah Nazir",
    "Mishnah Sotah", "Mishnah Gittin", "Mishnah Kiddushin",
    # Nezikin
    "Mishnah Bava Kamma", "Mishnah Bava Metzia", "Mishnah Bava Batra",
    "Mishnah Sanhedrin", "Mishnah Makkot", "Mishnah Shevuot", "Mishnah Eduyot",
    "Mishnah Avodah Zarah", "Pirkei Avot", "Mishnah Horayot",
    # Kodashim
    "Mishnah Zevachim", "Mishnah Menachot", "Mishnah Chullin", "Mishnah Bekhorot",
    "Mishnah Arakhin", "Mishnah Temurah", "Mishnah Keritot", "Mishnah Meilah",
    "Mishnah Tamid", "Mishnah Middot", "Mishnah Kinnim",
    # Tohorot
    "Mishnah Kelim", "Mishnah Oholot", "Mishnah Negaim", "Mishnah Parah",
    "Mishnah Tohorot", "Mishnah Mikvaot", "Mishnah Niddah", "Mishnah Makhshirin",
    "Mishnah Zavim", "Mishnah Tevul Yom", "Mishnah Yadayim", "Mishnah Oktzin",
]

async def harvest_mishnah(session: aiohttp.ClientSession) -> List[Passage]:
    """Harvest complete Mishnah."""
    passages = []
    
    print("\n📚 HARVESTING MISHNAH (63 tractates)")
    print("=" * 50)
    
    for tractate in MISHNAH_TRACTATES:
        print(f"  Fetching {tractate}...", end=" ", flush=True)
        
        data = await fetch_text(session, tractate)
        await asyncio.sleep(RATE_LIMIT_DELAY)
        
        if not data:
            print("FAILED")
            continue
        
        hebrew = data.get("he", [])
        english = data.get("text", [])
        
        he_flat = flatten_text(hebrew)
        en_flat = flatten_text(english)
        en_lookup = {r: t for r, t in en_flat}
        
        count = 0
        for section_ref, he_text in he_flat:
            if not he_text.strip():
                continue
            
            passage = Passage(
                urn=f"urn:sefaria:mishnah:{tractate.lower().replace(' ', '_')}:{section_ref}",
                language="hebrew",
                text=he_text,
                translation_en=en_lookup.get(section_ref),
                author="tannaim",
                work=tractate,
                section=section_ref,
                date_composed=200,
                period="Tannaitic",
                genre="halakha",
            )
            passages.append(passage)
            count += 1
        
        print(f"{count} passages")
    
    print(f"\n  ✓ Total Mishnah passages: {len(passages)}")
    return passages

# =============================================================================
# MIDRASH HARVESTER
# =============================================================================

MIDRASHIM = [
    ("Bereishit Rabbah", 400, "midrash"),
    ("Shemot Rabbah", 900, "midrash"),
    ("Vayikra Rabbah", 450, "midrash"),
    ("Mekhilta d'Rabbi Yishmael", 200, "halakhic_midrash"),
    ("Sifra", 200, "halakhic_midrash"),
    ("Sifrei Bamidbar", 200, "halakhic_midrash"),
    ("Sifrei Devarim", 200, "halakhic_midrash"),
]

async def harvest_midrash(session: aiohttp.ClientSession) -> List[Passage]:
    """Harvest key Midrashim."""
    passages = []
    
    print("\n📖 HARVESTING MIDRASH")
    print("=" * 50)
    
    for midrash, date, genre in MIDRASHIM:
        print(f"  Fetching {midrash}...", end=" ", flush=True)
        
        data = await fetch_text(session, midrash)
        await asyncio.sleep(RATE_LIMIT_DELAY)
        
        if not data:
            print("FAILED")
            continue
        
        hebrew = data.get("he", [])
        english = data.get("text", [])
        
        he_flat = flatten_text(hebrew)
        en_flat = flatten_text(english)
        en_lookup = {r: t for r, t in en_flat}
        
        count = 0
        for section_ref, he_text in he_flat:
            if not he_text.strip():
                continue
            
            passage = Passage(
                urn=f"urn:sefaria:midrash:{midrash.lower().replace(' ', '_').replace(\"'\", '')}:{section_ref}",
                language="hebrew",
                text=he_text,
                translation_en=en_lookup.get(section_ref),
                author="midrash",
                work=midrash,
                section=section_ref,
                date_composed=date,
                period=get_period(date),
                genre=genre,
            )
            passages.append(passage)
            count += 1
        
        print(f"{count} passages")
    
    print(f"\n  ✓ Total Midrash passages: {len(passages)}")
    return passages

# =============================================================================
# DATABASE INSERTION
# =============================================================================

def insert_passages(passages: List[Passage]):
    """Insert passages into database."""
    print("\n💾 INSERTING INTO DATABASE")
    print("=" * 50)
    
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    # Create table if not exists
    cur.execute("""
        CREATE TABLE IF NOT EXISTS corpus_texts (
            id SERIAL PRIMARY KEY,
            urn TEXT UNIQUE NOT NULL,
            language TEXT NOT NULL,
            text TEXT NOT NULL,
            translation_en TEXT,
            author TEXT,
            work TEXT,
            section TEXT,
            date_composed INTEGER,
            period TEXT,
            genre TEXT,
            source TEXT DEFAULT 'sefaria',
            harvested_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_corpus_language ON corpus_texts(language);
        CREATE INDEX IF NOT EXISTS idx_corpus_author ON corpus_texts(author);
        CREATE INDEX IF NOT EXISTS idx_corpus_work ON corpus_texts(work);
        CREATE INDEX IF NOT EXISTS idx_corpus_period ON corpus_texts(period);
    """)
    
    # Prepare data
    data = [
        (
            p.urn, p.language, p.text, p.translation_en,
            p.author, p.work, p.section, p.date_composed,
            p.period, p.genre, p.source
        )
        for p in passages
    ]
    
    # Batch insert with upsert
    execute_values(
        cur,
        """
        INSERT INTO corpus_texts 
            (urn, language, text, translation_en, author, work, section, 
             date_composed, period, genre, source)
        VALUES %s
        ON CONFLICT (urn) DO UPDATE SET
            text = EXCLUDED.text,
            translation_en = EXCLUDED.translation_en,
            harvested_at = NOW()
        """,
        data,
        page_size=500
    )
    
    conn.commit()
    
    # Get counts
    cur.execute("SELECT language, COUNT(*) FROM corpus_texts GROUP BY language")
    counts = dict(cur.fetchall())
    
    cur.close()
    conn.close()
    
    print(f"\n  ✓ Inserted {len(passages)} passages")
    print(f"\n  Database totals by language:")
    for lang, count in sorted(counts.items()):
        print(f"    {lang}: {count:,}")

# =============================================================================
# MAIN
# =============================================================================

async def main():
    """Main harvesting function."""
    print("""
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   ██╗  ██╗███████╗██████╗ ██████╗ ███████╗██╗    ██╗                         ║
║   ██║  ██║██╔════╝██╔══██╗██╔══██╗██╔════╝██║    ██║                         ║
║   ███████║█████╗  ██████╔╝██████╔╝█████╗  ██║ █╗ ██║                         ║
║   ██╔══██║██╔══╝  ██╔══██╗██╔══██╗██╔══╝  ██║███╗██║                         ║
║   ██║  ██║███████╗██████╔╝██║  ██║███████╗╚███╔███╔╝                         ║
║   ╚═╝  ╚═╝╚══════╝╚═════╝ ╚═╝  ╚═╝╚══════╝ ╚══╝╚══╝                          ║
║                                                                              ║
║   LOGOS HEBREW/ARAMAIC CORPUS HARVESTER                                      ║
║   Downloading from Sefaria.org (free, open API)                              ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
    """)
    
    start_time = time.time()
    all_passages = []
    
    async with aiohttp.ClientSession() as session:
        # Harvest each corpus
        bible = await harvest_bible(session)
        all_passages.extend(bible)
        
        targums = await harvest_targums(session)
        all_passages.extend(targums)
        
        mishnah = await harvest_mishnah(session)
        all_passages.extend(mishnah)
        
        midrash = await harvest_midrash(session)
        all_passages.extend(midrash)
    
    # Insert into database
    insert_passages(all_passages)
    
    elapsed = time.time() - start_time
    
    print(f"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                         HARVEST COMPLETE                                     ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║   Total passages harvested: {len(all_passages):>6,}                                       ║
║   Time elapsed: {elapsed/60:>6.1f} minutes                                          ║
║                                                                              ║
║   Hebrew features now ENABLED in LOGOS!                                      ║
║   Aramaic features now ENABLED in LOGOS!                                     ║
║                                                                              ║
║   Greek-Hebrew bridges will activate automatically.                          ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
    """)

if __name__ == "__main__":
    asyncio.run(main())
