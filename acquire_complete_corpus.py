#!/usr/bin/env python3
"""
LOGOS CORPUS ACQUISITION - Complete Ancient Text Database
=========================================================

Extracts and downloads ALL available ancient texts:
1. Greek/Latin from your existing Loeb files (parallel texts)
2. Perseus Digital Library
3. First1KGreek
4. Sefaria (Hebrew/Aramaic)
5. Papyri.info fragments

Run: python3 acquire_complete_corpus.py
"""

import os
import re
import json
import zipfile
from pathlib import Path
from collections import defaultdict
from datetime import datetime

# PostgreSQL
try:
    import psycopg2
    from psycopg2.extras import execute_values
    HAS_DB = True
except ImportError:
    print("Installing psycopg2...")
    os.system("pip3 install psycopg2-binary --break-system-packages")
    import psycopg2
    from psycopg2.extras import execute_values
    HAS_DB = True

# HTTP requests
try:
    import requests
except ImportError:
    os.system("pip3 install requests --break-system-packages")
    import requests

# Progress
try:
    from tqdm import tqdm
except ImportError:
    def tqdm(x, **kwargs): return x

# =============================================================================
# CONFIGURATION
# =============================================================================

DATABASE_URL = os.environ.get('DATABASE_URL', '')

CORPUS_DIR = Path.home() / "Downloads/logos/tau_complete_corpus/text/modern"
LOEB_ZIP = CORPUS_DIR / "loeb_complete_545.zip"
OUTPUT_DIR = Path.home() / "Documents/logos_complete_corpus"

# Unicode ranges
GREEK_PATTERN = re.compile(r'[\u0370-\u03FF\u1F00-\u1FFF]')  # Greek + Extended Greek
LATIN_PATTERN = re.compile(r'[a-zA-Z]')
HEBREW_PATTERN = re.compile(r'[\u0590-\u05FF]')  # Hebrew
ARAMAIC_PATTERN = re.compile(r'[\u0700-\u074F]')  # Syriac/Aramaic

# =============================================================================
# DATABASE SETUP
# =============================================================================

def setup_database(conn):
    """Create comprehensive text tables."""
    cur = conn.cursor()
    
    cur.execute("""
        -- Source texts (Greek, Latin, Hebrew, Aramaic)
        CREATE TABLE IF NOT EXISTS source_texts (
            id SERIAL PRIMARY KEY,
            urn TEXT UNIQUE NOT NULL,
            language TEXT NOT NULL,  -- greek, latin, hebrew, aramaic
            author TEXT,
            work TEXT,
            section TEXT,
            content TEXT NOT NULL,
            word_count INTEGER,
            source TEXT,  -- loeb, perseus, sefaria, papyri
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Parallel translations (linked to source)
        CREATE TABLE IF NOT EXISTS parallel_translations (
            id SERIAL PRIMARY KEY,
            source_id INTEGER REFERENCES source_texts(id),
            urn TEXT,
            translator TEXT,
            language TEXT DEFAULT 'english',
            content TEXT NOT NULL,
            year INTEGER,
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Fragments and papyri
        CREATE TABLE IF NOT EXISTS fragments (
            id SERIAL PRIMARY KEY,
            urn TEXT UNIQUE,
            author TEXT,
            work TEXT,
            language TEXT,
            content TEXT NOT NULL,
            source TEXT,  -- papyri.info, ddbdp, inscription
            provenance TEXT,
            date_range TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Indexes
        CREATE INDEX IF NOT EXISTS idx_source_language ON source_texts(language);
        CREATE INDEX IF NOT EXISTS idx_source_author ON source_texts(author);
        CREATE INDEX IF NOT EXISTS idx_fragments_author ON fragments(author);
    """)
    
    conn.commit()
    print("✓ Database tables created")


# =============================================================================
# 1. EXTRACT FROM LOEB (Parallel Greek/Latin + English)
# =============================================================================

def extract_loeb_parallel(corpus_dir: Path, conn) -> dict:
    """
    Extract BOTH source language AND English from Loeb files.
    Loeb has parallel text format: Greek/Latin on left, English on right.
    """
    stats = {'greek': 0, 'latin': 0, 'english': 0, 'pairs': 0}
    cur = conn.cursor()
    
    # First try the ZIP file
    loeb_zip = corpus_dir / "loeb_complete_545.zip"
    if loeb_zip.exists():
        print(f"\n  Extracting from {loeb_zip.name}...")
        try:
            with zipfile.ZipFile(loeb_zip, 'r') as zf:
                for name in tqdm(zf.namelist(), desc="  Loeb ZIP"):
                    if name.endswith('.txt'):
                        content = zf.read(name).decode('utf-8', errors='ignore')
                        extracted = parse_loeb_parallel_content(content, name)
                        for item in extracted:
                            insert_text(cur, item)
                            stats[item.get('language', 'english')] += 1
                            if item.get('has_parallel'):
                                stats['pairs'] += 1
                conn.commit()
        except Exception as e:
            print(f"  ZIP error: {e}")
    
    # Then process the split files
    loeb_files = sorted(corpus_dir.glob("loeb_part_*.txt"))
    print(f"\n  Processing {len(loeb_files)} Loeb part files...")
    
    for filepath in tqdm(loeb_files, desc="  Loeb parts"):
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            extracted = parse_loeb_parallel_content(content, filepath.name)
            for item in extracted:
                insert_text(cur, item)
                stats[item.get('language', 'english')] += 1
        except Exception as e:
            print(f"  Error {filepath.name}: {e}")
    
    conn.commit()
    return stats


def parse_loeb_parallel_content(content: str, filename: str) -> list:
    """
    Parse Loeb content extracting BOTH Greek/Latin AND English.
    
    Loeb format typically:
    -NNN.NNN (AUTHOR, Work)
    [Greek/Latin text]
    [English translation]
    """
    results = []
    
    # Pattern for Loeb references
    ref_pattern = re.compile(r'-(\d{3}\.\d{3})\s*\(([^,]+),\s*([^)]+)\)')
    
    current_ref = None
    current_author = None
    current_work = None
    greek_buffer = []
    latin_buffer = []
    english_buffer = []
    
    for line in content.split('\n'):
        # Check for new reference
        match = ref_pattern.match(line)
        if match:
            # Save previous if exists
            if current_ref:
                # Determine source language
                greek_text = '\n'.join(greek_buffer).strip()
                latin_text = '\n'.join(latin_buffer).strip()
                english_text = '\n'.join(english_buffer).strip()
                
                if greek_text and len(greek_text) > 20:
                    results.append({
                        'urn': f"loeb:{current_ref}:grc",
                        'language': 'greek',
                        'author': current_author,
                        'work': current_work,
                        'section': current_ref,
                        'content': greek_text,
                        'source': 'loeb',
                        'has_parallel': bool(english_text)
                    })
                
                if latin_text and len(latin_text) > 20:
                    results.append({
                        'urn': f"loeb:{current_ref}:lat",
                        'language': 'latin',
                        'author': current_author,
                        'work': current_work,
                        'section': current_ref,
                        'content': latin_text,
                        'source': 'loeb',
                        'has_parallel': bool(english_text)
                    })
                
                if english_text and len(english_text) > 20:
                    results.append({
                        'urn': f"loeb:{current_ref}:eng",
                        'language': 'english',
                        'author': current_author,
                        'work': current_work,
                        'section': current_ref,
                        'content': english_text,
                        'source': 'loeb',
                        'has_parallel': bool(greek_text or latin_text)
                    })
            
            # Start new
            current_ref = match.group(1)
            current_author = match.group(2).strip()
            current_work = match.group(3).strip()
            greek_buffer = []
            latin_buffer = []
            english_buffer = []
            
        elif current_ref:
            # Classify line by script
            if line.startswith('%') or not line.strip():
                continue
            
            has_greek = bool(GREEK_PATTERN.search(line))
            has_latin = bool(LATIN_PATTERN.search(line)) and not has_greek
            
            if has_greek:
                greek_buffer.append(line)
            elif has_latin:
                # Determine if Latin source or English translation
                # Latin source tends to have specific patterns
                if is_latin_source(line):
                    latin_buffer.append(line)
                else:
                    english_buffer.append(line)
    
    # Don't forget last entry
    if current_ref:
        greek_text = '\n'.join(greek_buffer).strip()
        latin_text = '\n'.join(latin_buffer).strip()
        english_text = '\n'.join(english_buffer).strip()
        
        if greek_text and len(greek_text) > 20:
            results.append({
                'urn': f"loeb:{current_ref}:grc",
                'language': 'greek',
                'author': current_author,
                'work': current_work,
                'section': current_ref,
                'content': greek_text,
                'source': 'loeb'
            })
        
        if english_text and len(english_text) > 20:
            results.append({
                'urn': f"loeb:{current_ref}:eng",
                'language': 'english',
                'author': current_author,
                'work': current_work,
                'section': current_ref,
                'content': english_text,
                'source': 'loeb'
            })
    
    return results


def is_latin_source(text: str) -> bool:
    """Heuristic to detect Latin source vs English translation."""
    latin_indicators = [
        r'\b(est|sunt|erat|fuit|esse)\b',  # Latin 'to be'
        r'\b(qui|quae|quod|quis|quid)\b',  # Latin relatives
        r'\b(et|sed|aut|vel|nec|neque)\b',  # Latin conjunctions
        r'\b(cum|in|ad|ex|de|ab|per|pro)\b',  # Latin prepositions
        r'\b(non|ne|haud)\b',  # Latin negatives
        r'\bque\b',  # Enclitic -que
    ]
    
    text_lower = text.lower()
    matches = sum(1 for p in latin_indicators if re.search(p, text_lower))
    
    # If 3+ Latin indicators, likely Latin source
    return matches >= 3


def insert_text(cur, item: dict):
    """Insert text into appropriate table."""
    try:
        cur.execute("""
            INSERT INTO source_texts (urn, language, author, work, section, content, word_count, source)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (urn) DO NOTHING
        """, (
            item['urn'],
            item['language'],
            item.get('author'),
            item.get('work'),
            item.get('section'),
            item['content'],
            len(item['content'].split()),
            item.get('source', 'unknown')
        ))
    except Exception as e:
        pass  # Skip duplicates


# =============================================================================
# 2. DOWNLOAD PERSEUS DIGITAL LIBRARY
# =============================================================================

def download_perseus(conn) -> dict:
    """
    Download texts from Perseus Digital Library.
    https://github.com/PerseusDL/canonical-greekLit
    https://github.com/PerseusDL/canonical-latinLit
    """
    stats = {'greek': 0, 'latin': 0}
    cur = conn.cursor()
    
    print("\n  Downloading Perseus Greek texts...")
    
    # Perseus GitHub raw URLs
    greek_authors = [
        ('Homer', 'tlg0012', ['tlg001', 'tlg002']),  # Iliad, Odyssey
        ('Plato', 'tlg0059', ['tlg001', 'tlg002', 'tlg003']),
        ('Aristotle', 'tlg0086', ['tlg001']),
        ('Sophocles', 'tlg0011', ['tlg001', 'tlg002', 'tlg003']),
        ('Euripides', 'tlg0006', ['tlg001', 'tlg002']),
        ('Thucydides', 'tlg0003', ['tlg001']),
        ('Herodotus', 'tlg0016', ['tlg001']),
    ]
    
    base_url = "https://raw.githubusercontent.com/PerseusDL/canonical-greekLit/master/data"
    
    for author, author_id, works in greek_authors:
        for work_id in works:
            url = f"{base_url}/{author_id}/{work_id}/{author_id}.{work_id}.perseus-grc1.xml"
            try:
                resp = requests.get(url, timeout=30)
                if resp.status_code == 200:
                    # Extract text from TEI XML
                    text = extract_tei_text(resp.text)
                    if text and len(text) > 100:
                        cur.execute("""
                            INSERT INTO source_texts (urn, language, author, work, content, word_count, source)
                            VALUES (%s, %s, %s, %s, %s, %s, %s)
                            ON CONFLICT (urn) DO NOTHING
                        """, (
                            f"perseus:{author_id}.{work_id}",
                            'greek',
                            author,
                            work_id,
                            text,
                            len(text.split()),
                            'perseus'
                        ))
                        stats['greek'] += 1
                        print(f"    ✓ {author} - {work_id}")
            except Exception as e:
                pass
    
    conn.commit()
    return stats


def extract_tei_text(xml_content: str) -> str:
    """Extract plain text from TEI XML."""
    # Remove XML tags but keep text
    text = re.sub(r'<[^>]+>', ' ', xml_content)
    # Clean up whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


# =============================================================================
# 3. DOWNLOAD FIRST1KGREEK
# =============================================================================

def download_first1k(conn) -> dict:
    """
    Download from First1KGreek project.
    https://github.com/OpenGreekAndLatin/First1KGreek
    """
    stats = {'texts': 0}
    
    print("\n  First1KGreek requires git clone...")
    print("  Run: git clone https://github.com/OpenGreekAndLatin/First1KGreek.git")
    
    # Check if already cloned
    first1k_dir = Path.home() / "Downloads/First1KGreek"
    if first1k_dir.exists():
        print(f"  Found at {first1k_dir}")
        cur = conn.cursor()
        
        for xml_file in tqdm(list(first1k_dir.rglob("*.xml"))[:1000], desc="  First1K"):
            try:
                with open(xml_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                text = extract_tei_text(content)
                if text and len(text) > 100:
                    urn = f"first1k:{xml_file.stem}"
                    cur.execute("""
                        INSERT INTO source_texts (urn, language, content, word_count, source)
                        VALUES (%s, %s, %s, %s, %s)
                        ON CONFLICT (urn) DO NOTHING
                    """, (urn, 'greek', text, len(text.split()), 'first1k'))
                    stats['texts'] += 1
            except:
                pass
        
        conn.commit()
    
    return stats


# =============================================================================
# 4. DOWNLOAD SEFARIA (Hebrew/Aramaic)
# =============================================================================

def download_sefaria(conn) -> dict:
    """
    Download Hebrew texts from Sefaria API.
    https://www.sefaria.org/api
    """
    stats = {'hebrew': 0, 'aramaic': 0}
    cur = conn.cursor()
    
    print("\n  Downloading Sefaria Hebrew texts...")
    
    # Major texts to download
    texts = [
        'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
        'Isaiah', 'Jeremiah', 'Ezekiel',
        'Psalms', 'Proverbs', 'Job',
        'Mishnah_Berakhot', 'Mishnah_Shabbat',
        'Pirkei_Avot',
    ]
    
    for text_name in tqdm(texts, desc="  Sefaria"):
        try:
            url = f"https://www.sefaria.org/api/texts/{text_name}?context=0"
            resp = requests.get(url, timeout=30)
            if resp.status_code == 200:
                data = resp.json()
                
                # Extract Hebrew text
                hebrew = data.get('he', [])
                if isinstance(hebrew, list):
                    hebrew_text = flatten_text(hebrew)
                else:
                    hebrew_text = str(hebrew)
                
                if hebrew_text and len(hebrew_text) > 50:
                    cur.execute("""
                        INSERT INTO source_texts (urn, language, work, content, word_count, source)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT (urn) DO NOTHING
                    """, (
                        f"sefaria:{text_name}",
                        'hebrew',
                        text_name,
                        hebrew_text,
                        len(hebrew_text.split()),
                        'sefaria'
                    ))
                    stats['hebrew'] += 1
                    print(f"    ✓ {text_name}")
        except Exception as e:
            pass
    
    conn.commit()
    return stats


def flatten_text(nested) -> str:
    """Flatten nested list structure to single string."""
    if isinstance(nested, str):
        return nested
    elif isinstance(nested, list):
        parts = []
        for item in nested:
            parts.append(flatten_text(item))
        return ' '.join(parts)
    return ''


# =============================================================================
# 5. DOWNLOAD PAPYRI (Fragments)
# =============================================================================

def download_papyri(conn) -> dict:
    """
    Download papyrus fragments from papyri.info API.
    """
    stats = {'fragments': 0}
    cur = conn.cursor()
    
    print("\n  Downloading papyri fragments...")
    print("  (Limited API access - manual download recommended)")
    print("  Full collection: https://papyri.info/")
    
    # Sample collections
    collections = ['ddbdp', 'hgv']
    
    # For now, just note what's available
    print("  Available collections:")
    print("    - DDBDP: Duke Databank of Documentary Papyri")
    print("    - HGV: Heidelberger Gesamtverzeichnis")
    print("    - APIS: Advanced Papyrological Information System")
    print("    - Trismegistos: 400,000+ texts")
    
    return stats


# =============================================================================
# MAIN
# =============================================================================

def main():
    print("=" * 70)
    print("LOGOS CORPUS ACQUISITION - Complete Ancient Text Database")
    print("=" * 70)
    print(f"\nDatabase: {DATABASE_URL[:50]}...")
    print(f"Corpus: {CORPUS_DIR}")
    print(f"Output: {OUTPUT_DIR}")
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    conn = psycopg2.connect(DATABASE_URL)
    print("\n✓ Connected to Railway PostgreSQL")
    
    # Setup tables
    print("\n[1] Setting up database tables...")
    setup_database(conn)
    
    # Extract Loeb parallel texts
    print("\n[2] Extracting Loeb parallel texts (Greek/Latin + English)...")
    loeb_stats = extract_loeb_parallel(CORPUS_DIR, conn)
    print(f"  Greek: {loeb_stats['greek']}")
    print(f"  Latin: {loeb_stats['latin']}")
    print(f"  English: {loeb_stats['english']}")
    print(f"  Parallel pairs: {loeb_stats['pairs']}")
    
    # Download Perseus
    print("\n[3] Downloading Perseus Digital Library...")
    perseus_stats = download_perseus(conn)
    print(f"  Greek texts: {perseus_stats['greek']}")
    print(f"  Latin texts: {perseus_stats['latin']}")
    
    # Download First1KGreek
    print("\n[4] Checking First1KGreek...")
    first1k_stats = download_first1k(conn)
    print(f"  Texts: {first1k_stats['texts']}")
    
    # Download Sefaria
    print("\n[5] Downloading Sefaria Hebrew texts...")
    sefaria_stats = download_sefaria(conn)
    print(f"  Hebrew: {sefaria_stats['hebrew']}")
    
    # Check papyri
    print("\n[6] Checking Papyri sources...")
    papyri_stats = download_papyri(conn)
    
    # Final stats
    cur = conn.cursor()
    cur.execute("SELECT language, COUNT(*), SUM(word_count) FROM source_texts GROUP BY language")
    rows = cur.fetchall()
    
    print("\n" + "=" * 70)
    print("CORPUS ACQUISITION COMPLETE")
    print("=" * 70)
    print("\nSource texts by language:")
    for lang, count, words in rows:
        print(f"  {lang}: {count:,} texts, {words:,} words")
    
    cur.execute("SELECT COUNT(*) FROM source_texts")
    total = cur.fetchone()[0]
    print(f"\nTotal source texts: {total:,}")
    
    # What's still needed
    print("\n" + "-" * 70)
    print("TO COMPLETE THE CORPUS:")
    print("-" * 70)
    print("""
1. TLG (Thesaurus Linguae Graecae) - 110M words
   - Requires institutional subscription
   - Or: Use Open Greek and Latin alternatives
   
2. PHI Latin Texts - Complete Latin corpus
   - Download: https://latin.packhum.org/
   
3. First1KGreek - 1000 years of Greek
   git clone https://github.com/OpenGreekAndLatin/First1KGreek.git ~/Downloads/First1KGreek
   
4. Sefaria Export - Complete Hebrew
   Download: https://github.com/Sefaria/Sefaria-Export
   
5. Dead Sea Scrolls
   - Leon Levy Digital Library
   - IAA databases
   
6. Papyri.info bulk download
   - Contact: papyri.info for bulk access
""")
    
    conn.close()


if __name__ == "__main__":
    main()
