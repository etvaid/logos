#!/usr/bin/env python3
"""
MING LOGOS - Load Corpus to Railway PostgreSQL
===============================================

Loads Gutenberg + Loeb corpus into Railway DB and runs style analysis.

Usage:
    python3 load_corpus_to_railway.py
"""

import os
import re
import sys
import json
import hashlib
from pathlib import Path
from datetime import datetime
from collections import Counter, defaultdict

# PostgreSQL
try:
    import psycopg2
    from psycopg2.extras import execute_values
except ImportError:
    print("Installing psycopg2...")
    os.system("pip3 install psycopg2-binary --break-system-packages")
    import psycopg2
    from psycopg2.extras import execute_values

# Progress bar
try:
    from tqdm import tqdm
except ImportError:
    def tqdm(iterable, **kwargs):
        return iterable

# =============================================================================
# CONFIGURATION
# =============================================================================

DATABASE_URL = os.environ.get('DATABASE_URL', '')

CORPUS_DIR = Path.home() / "Downloads/logos/tau_complete_corpus/text/modern"
BATCH_SIZE = 500  # Insert in batches

# =============================================================================
# GUTENBERG CATALOG (subset - will auto-discover others)
# =============================================================================

GUTENBERG_CATALOG = {
    "6130": {"author": "Homer", "work": "Iliad", "translator": "Pope", "year": 1715},
    "2199": {"author": "Homer", "work": "Iliad", "translator": "Butler", "year": 1898},
    "3059": {"author": "Homer", "work": "Odyssey", "translator": "Pope", "year": 1726},
    "1727": {"author": "Homer", "work": "Odyssey", "translator": "Butler", "year": 1900},
    "22382": {"author": "Homer", "work": "Iliad", "translator": "Derby", "year": 1864},
    "16452": {"author": "Homer", "work": "Iliad", "translator": "Cowper", "year": 1791},
    "1727": {"author": "Homer", "work": "Odyssey", "translator": "Butler", "year": 1900},
    "1051": {"author": "Virgil", "work": "Aeneid", "translator": "Dryden", "year": 1697},
    "228": {"author": "Virgil", "work": "Aeneid", "translator": "Williams", "year": 1910},
    "8710": {"author": "Plato", "work": "Republic", "translator": "Jowett", "year": 1871},
}

# =============================================================================
# STYLE DIMENSION EXTRACTION (simplified for speed)
# =============================================================================

ARCHAIC_WORDS = {
    'thee', 'thou', 'thy', 'thine', 'thyself', 'ye', 'hath', 'doth', 'dost',
    'hast', 'wilt', 'shalt', 'wouldst', 'shouldst', 'couldst', 'art', 'wert',
    'ere', 'oft', 'twas', 'tis', 'nay', 'aye', 'hence', 'thence', 'whence',
    'hither', 'thither', 'whither', 'wherefore', 'forsooth', 'methinks', 'prithee',
    'perchance', 'mayhap', 'betwixt', 'amongst', 'whilst', 'unto', 'upon'
}

GERMANIC_SUFFIXES = ['ness', 'ful', 'less', 'dom', 'hood', 'ship', 'like', 'ward']
LATINATE_SUFFIXES = ['tion', 'sion', 'ment', 'ance', 'ence', 'ity', 'ous', 'ive', 'al']


def extract_style_dimensions(text: str) -> dict:
    """Extract 20 style dimensions from text."""
    words = text.lower().split()
    word_count = len(words)
    
    if word_count < 10:
        return {f"dim_{i}": 0.5 for i in range(20)}
    
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    sent_count = max(1, len(sentences))
    
    def norm(val, lo, hi):
        if hi == lo:
            return 0.5
        return max(0.0, min(1.0, (val - lo) / (hi - lo)))
    
    # Dimensions
    dims = {}
    
    # 0. Lexical complexity
    avg_len = sum(len(w) for w in words) / word_count
    dims['lexical_complexity'] = norm(avg_len, 3, 8)
    
    # 1. Archaism
    archaic = sum(1 for w in words if w in ARCHAIC_WORDS)
    archaic += sum(1 for w in words if w.endswith('eth') or w.endswith('est'))
    dims['archaism'] = norm(archaic / word_count * 1000, 0, 50)
    
    # 2. Anglo-Saxon preference
    germanic = sum(1 for w in words if any(w.endswith(s) for s in GERMANIC_SUFFIXES))
    latinate = sum(1 for w in words if any(w.endswith(s) for s in LATINATE_SUFFIXES))
    dims['anglo_saxon'] = germanic / (germanic + latinate + 1)
    
    # 3-4. Sentence stats
    sent_lens = [len(s.split()) for s in sentences]
    dims['sentence_length'] = norm(sum(sent_lens) / sent_count, 10, 50)
    if len(sent_lens) > 1:
        mean_l = sum(sent_lens) / len(sent_lens)
        var = sum((x - mean_l)**2 for x in sent_lens) / len(sent_lens)
        dims['sentence_variance'] = norm(var**0.5, 0, 20)
    else:
        dims['sentence_variance'] = 0.5
    
    # 5. Clause depth
    subord = ['that', 'which', 'who', 'whom', 'whose', 'where', 'when', 'while', 
              'although', 'because', 'since', 'if', 'unless', 'whether']
    sub_count = sum(1 for w in words if w in subord)
    dims['clause_depth'] = norm(sub_count / sent_count, 0, 5)
    
    # 6. Metaphor markers
    text_lower = text.lower()
    like_count = text_lower.count(' like a ') + text_lower.count(' like the ')
    as_count = len(re.findall(r'\bas\s+\w+\s+as\b', text_lower))
    dims['metaphor'] = norm((like_count + as_count) / sent_count, 0, 1)
    
    # 7. Punctuation drama
    em_dashes = text.count('—') + text.count('--')
    exclaim = text.count('!')
    dims['punctuation_drama'] = norm((em_dashes + exclaim) / sent_count, 0, 2)
    
    # 8. Rhythm (syllable regularity estimate)
    dims['rhythm'] = 0.5  # Requires more analysis
    
    # 9. Alliteration
    alliter = 0
    for s in sentences:
        ws = s.split()
        for i in range(len(ws) - 1):
            if ws[i] and ws[i+1] and ws[i][0].lower() == ws[i+1][0].lower():
                alliter += 1
    dims['alliteration'] = norm(alliter / word_count, 0, 0.1)
    
    # Fill remaining with defaults
    for i in range(20):
        key = f"dim_{i}"
        if key not in dims:
            dims[key] = 0.5
    
    return dims


# =============================================================================
# LOEB PARSER
# =============================================================================

def parse_loeb_file(filepath: Path) -> list:
    """Parse Loeb file into passages."""
    passages = []
    
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except:
        return passages
    
    # Pattern: -NNN.NNN (AUTHOR, Work)
    pattern = re.compile(r'-(\d{3}\.\d{3})\s*\(([^,]+),\s*([^)]+)\)')
    greek_pat = re.compile(r'[\u0370-\u03FF\u1F00-\u1FFF]')
    
    current = None
    current_text = []
    
    for line in content.split('\n'):
        match = pattern.match(line)
        if match:
            if current and current_text:
                text = '\n'.join(current_text).strip()
                if len(text) > 50:
                    current['content'] = text
                    passages.append(current)
            
            current = {
                'urn': f"loeb:{match.group(1)}",
                'author': match.group(2).strip(),
                'work': match.group(3).strip(),
                'language': 'english',
                'section': match.group(1)
            }
            current_text = []
        elif current:
            # Skip Greek, metadata
            if not greek_pat.search(line) and not line.startswith('%'):
                current_text.append(line)
    
    # Last one
    if current and current_text:
        text = '\n'.join(current_text).strip()
        if len(text) > 50:
            current['content'] = text
            passages.append(current)
    
    return passages


# =============================================================================
# DATABASE OPERATIONS
# =============================================================================

def get_connection():
    """Get PostgreSQL connection."""
    return psycopg2.connect(DATABASE_URL)


def create_style_tables(conn):
    """Create tables for style analysis if they don't exist."""
    cur = conn.cursor()
    
    # Style dimensions table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS text_style_vectors (
            id SERIAL PRIMARY KEY,
            text_id INTEGER REFERENCES texts(id),
            urn TEXT,
            lexical_complexity FLOAT,
            archaism FLOAT,
            anglo_saxon FLOAT,
            sentence_length FLOAT,
            sentence_variance FLOAT,
            clause_depth FLOAT,
            metaphor FLOAT,
            punctuation_drama FLOAT,
            rhythm FLOAT,
            alliteration FLOAT,
            style_vector JSONB,
            created_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_style_urn ON text_style_vectors(urn);
        CREATE INDEX IF NOT EXISTS idx_style_text_id ON text_style_vectors(text_id);
    """)
    
    # Translator profiles (computed from corpus)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS computed_translator_profiles (
            id SERIAL PRIMARY KEY,
            name TEXT UNIQUE,
            n_translations INTEGER,
            total_words INTEGER,
            era TEXT,
            avg_year INTEGER,
            style_vector JSONB,
            works JSONB,
            source TEXT DEFAULT 'COMPUTED_FROM_CORPUS',
            created_at TIMESTAMP DEFAULT NOW()
        );
    """)
    
    # Delta vocabulary
    cur.execute("""
        CREATE TABLE IF NOT EXISTS burrows_delta_vocab (
            id SERIAL PRIMARY KEY,
            word TEXT UNIQUE,
            rank INTEGER,
            corpus_mean FLOAT,
            corpus_std FLOAT,
            created_at TIMESTAMP DEFAULT NOW()
        );
    """)
    
    conn.commit()
    print("  ✓ Style tables created/verified")


def load_gutenberg_texts(conn, corpus_dir: Path):
    """Load Gutenberg files into texts table."""
    cur = conn.cursor()
    
    files = list(corpus_dir.glob("gutenberg_*.txt"))
    print(f"\n  Loading {len(files)} Gutenberg files...")
    
    inserted = 0
    skipped = 0
    
    for filepath in tqdm(files, desc="  Gutenberg"):
        match = re.search(r'gutenberg_(\d+)', filepath.name)
        if not match:
            continue
        
        gid = match.group(1)
        urn = f"gutenberg:{gid}"
        
        # Check if exists
        cur.execute("SELECT id FROM texts WHERE urn = %s", (urn,))
        if cur.fetchone():
            skipped += 1
            continue
        
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            if len(content.split()) < 500:
                continue
            
            # Get metadata
            meta = GUTENBERG_CATALOG.get(gid, {})
            author = meta.get('author', 'Unknown')
            work = meta.get('work', 'Unknown')
            
            # Try to extract from file header if unknown
            if author == 'Unknown':
                header = content[:3000]
                m = re.search(r'Author:\s*([^\n]+)', header)
                if m:
                    author = m.group(1).strip()
                m = re.search(r'Title:\s*([^\n]+)', header)
                if m:
                    work = m.group(1).strip()
            
            cur.execute("""
                INSERT INTO texts (urn, content, language, author, work, section)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (urn) DO NOTHING
            """, (urn, content, 'english', author, work, gid))
            
            inserted += 1
            
            if inserted % 100 == 0:
                conn.commit()
                
        except Exception as e:
            print(f"    Error: {filepath.name}: {e}")
    
    conn.commit()
    print(f"  ✓ Inserted {inserted} Gutenberg texts (skipped {skipped} existing)")
    return inserted


def load_loeb_texts(conn, corpus_dir: Path):
    """Load Loeb passages into texts table."""
    cur = conn.cursor()
    
    files = sorted(corpus_dir.glob("loeb_part_*.txt"))
    print(f"\n  Loading {len(files)} Loeb files...")
    
    total_inserted = 0
    total_skipped = 0
    
    for filepath in tqdm(files, desc="  Loeb"):
        passages = parse_loeb_file(filepath)
        
        batch = []
        for p in passages:
            batch.append((
                p['urn'],
                p['content'],
                p['language'],
                p['author'],
                p['work'],
                p['section']
            ))
            
            if len(batch) >= BATCH_SIZE:
                try:
                    execute_values(cur, """
                        INSERT INTO texts (urn, content, language, author, work, section)
                        VALUES %s
                        ON CONFLICT (urn) DO NOTHING
                    """, batch)
                    total_inserted += len(batch)
                    conn.commit()
                except Exception as e:
                    total_skipped += len(batch)
                batch = []
        
        # Remaining
        if batch:
            try:
                execute_values(cur, """
                    INSERT INTO texts (urn, content, language, author, work, section)
                    VALUES %s
                    ON CONFLICT (urn) DO NOTHING
                """, batch)
                total_inserted += len(batch)
                conn.commit()
            except:
                total_skipped += len(batch)
    
    print(f"  ✓ Inserted {total_inserted} Loeb passages (skipped {total_skipped})")
    return total_inserted


def compute_style_vectors(conn):
    """Compute style vectors for all texts."""
    cur = conn.cursor()
    
    # Get texts without style vectors
    cur.execute("""
        SELECT t.id, t.urn, t.content 
        FROM texts t
        LEFT JOIN text_style_vectors sv ON t.id = sv.text_id
        WHERE sv.id IS NULL AND t.language = 'english'
        LIMIT 50000
    """)
    
    rows = cur.fetchall()
    print(f"\n  Computing style vectors for {len(rows)} texts...")
    
    batch = []
    for text_id, urn, content in tqdm(rows, desc="  Styles"):
        dims = extract_style_dimensions(content)
        
        batch.append((
            text_id,
            urn,
            dims.get('lexical_complexity', 0.5),
            dims.get('archaism', 0.5),
            dims.get('anglo_saxon', 0.5),
            dims.get('sentence_length', 0.5),
            dims.get('sentence_variance', 0.5),
            dims.get('clause_depth', 0.5),
            dims.get('metaphor', 0.5),
            dims.get('punctuation_drama', 0.5),
            dims.get('rhythm', 0.5),
            dims.get('alliteration', 0.5),
            json.dumps(dims)
        ))
        
        if len(batch) >= BATCH_SIZE:
            execute_values(cur, """
                INSERT INTO text_style_vectors 
                (text_id, urn, lexical_complexity, archaism, anglo_saxon, 
                 sentence_length, sentence_variance, clause_depth, metaphor,
                 punctuation_drama, rhythm, alliteration, style_vector)
                VALUES %s
            """, batch)
            conn.commit()
            batch = []
    
    if batch:
        execute_values(cur, """
            INSERT INTO text_style_vectors 
            (text_id, urn, lexical_complexity, archaism, anglo_saxon, 
             sentence_length, sentence_variance, clause_depth, metaphor,
             punctuation_drama, rhythm, alliteration, style_vector)
            VALUES %s
        """, batch)
        conn.commit()
    
    print(f"  ✓ Computed {len(rows)} style vectors")


def compute_translator_profiles(conn):
    """Build translator profiles from Gutenberg texts."""
    cur = conn.cursor()
    
    # Get Gutenberg texts with style vectors
    cur.execute("""
        SELECT t.urn, t.author, t.work, sv.style_vector, LENGTH(t.content) as chars
        FROM texts t
        JOIN text_style_vectors sv ON t.id = sv.text_id
        WHERE t.urn LIKE 'gutenberg:%'
    """)
    
    rows = cur.fetchall()
    print(f"\n  Building translator profiles from {len(rows)} Gutenberg texts...")
    
    # Group by translator (extracted from URN or metadata)
    by_translator = defaultdict(list)
    
    for urn, author, work, style_json, chars in rows:
        # Extract translator from Gutenberg catalog
        gid = urn.replace('gutenberg:', '')
        meta = GUTENBERG_CATALOG.get(gid, {})
        translator = meta.get('translator', 'Unknown')
        year = meta.get('year', 0)
        
        if translator != 'Unknown':
            by_translator[translator].append({
                'author': author,
                'work': work,
                'style': json.loads(style_json) if isinstance(style_json, str) else style_json,
                'chars': chars,
                'year': year
            })
    
    # Compute average profiles
    profiles = []
    for translator, texts in by_translator.items():
        if len(texts) < 1:
            continue
        
        # Average style
        all_dims = defaultdict(list)
        works = []
        years = []
        total_chars = 0
        
        for t in texts:
            for dim, val in t['style'].items():
                all_dims[dim].append(val)
            works.append(f"{t['author']} - {t['work']}")
            if t['year']:
                years.append(t['year'])
            total_chars += t['chars']
        
        avg_style = {dim: sum(vals)/len(vals) for dim, vals in all_dims.items()}
        avg_year = int(sum(years) / len(years)) if years else None
        
        # Era
        if avg_year:
            if avg_year < 1700:
                era = "Renaissance/Restoration"
            elif avg_year < 1800:
                era = "Augustan"
            elif avg_year < 1870:
                era = "Romantic"
            elif avg_year < 1920:
                era = "Victorian/Edwardian"
            else:
                era = "Modern"
        else:
            era = "Unknown"
        
        profiles.append((
            translator,
            len(texts),
            total_chars // 5,  # Approx words
            era,
            avg_year,
            json.dumps(avg_style),
            json.dumps(works[:10])
        ))
    
    # Insert
    cur.execute("DELETE FROM computed_translator_profiles")
    execute_values(cur, """
        INSERT INTO computed_translator_profiles 
        (name, n_translations, total_words, era, avg_year, style_vector, works)
        VALUES %s
    """, profiles)
    
    conn.commit()
    print(f"  ✓ Built {len(profiles)} translator profiles")


# =============================================================================
# MAIN
# =============================================================================

def main():
    print("=" * 70)
    print("MING LOGOS - Load Corpus to Railway PostgreSQL")
    print("=" * 70)
    print(f"\nDatabase: {DATABASE_URL[:50]}...")
    print(f"Corpus: {CORPUS_DIR}")
    
    conn = get_connection()
    print("\n✓ Connected to Railway PostgreSQL")
    
    # Create tables
    print("\n[1] Creating style tables...")
    create_style_tables(conn)
    
    # Load Gutenberg
    print("\n[2] Loading Gutenberg corpus...")
    load_gutenberg_texts(conn, CORPUS_DIR)
    
    # Load Loeb
    print("\n[3] Loading Loeb corpus...")
    load_loeb_texts(conn, CORPUS_DIR)
    
    # Check totals
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM texts")
    total = cur.fetchone()[0]
    print(f"\n  Total texts in database: {total}")
    
    # Compute styles
    print("\n[4] Computing style vectors...")
    compute_style_vectors(conn)
    
    # Build profiles
    print("\n[5] Building translator profiles...")
    compute_translator_profiles(conn)
    
    # Summary
    cur.execute("SELECT COUNT(*) FROM text_style_vectors")
    n_styles = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM computed_translator_profiles")
    n_profiles = cur.fetchone()[0]
    
    print("\n" + "=" * 70)
    print("COMPLETE")
    print("=" * 70)
    print(f"\n  Texts: {total}")
    print(f"  Style vectors: {n_styles}")
    print(f"  Translator profiles: {n_profiles}")
    
    conn.close()


if __name__ == "__main__":
    main()
