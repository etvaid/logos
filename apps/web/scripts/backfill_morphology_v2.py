#!/usr/bin/env python3
"""
Backfill morphology data using normalized schema (morph_entries + passage_tokens).
This version scales to 6M+ passages with sublinear storage growth.
"""

import os
import re
import json
import psycopg2
from psycopg2.extras import execute_batch, execute_values
from typing import List, Dict, Tuple, Optional
from datetime import datetime

DATABASE_URL = os.environ.get('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

# Greek morphology mappings
POS_TAGS = {
    'n': 'noun', 'v': 'verb', 'a': 'adjective', 'd': 'adverb',
    'p': 'preposition', 'c': 'conjunction', 'r': 'pronoun',
    'l': 'article', 'i': 'interjection', 'm': 'numeral', 'x': 'particle',
}

# Common Greek word glosses
COMMON_GLOSSES = {
    'καί': 'and', 'ὁ': 'the', 'ἡ': 'the', 'τό': 'the',
    'αὐτός': 'he, she, it; self', 'δέ': 'but, and', 'εἰμί': 'to be',
    'ἐν': 'in, among', 'εἰς': 'into, to', 'ἐκ': 'out of, from',
    'ἀπό': 'from, away from', 'πρός': 'to, toward', 'ἐπί': 'on, upon',
    'διά': 'through, because of', 'μετά': 'with, after',
    'κατά': 'down, against', 'περί': 'about, concerning',
    'ὑπό': 'by, under', 'παρά': 'beside, from', 'ἀλλά': 'but',
    'γάρ': 'for', 'οὖν': 'therefore', 'ὅτι': 'that, because',
    'εἰ': 'if', 'ὡς': 'as, like', 'οὐ': 'not', 'οὐκ': 'not', 'μή': 'not',
    'τίς': 'who? what?', 'τις': 'someone, anyone', 'ὅς': 'who, which',
    'οὗτος': 'this', 'ἐκεῖνος': 'that', 'πᾶς': 'all, every', 'εἷς': 'one',
    'λέγω': 'to say, speak', 'ἔρχομαι': 'to come, go', 'ποιέω': 'to do, make',
    'γίνομαι': 'to become, happen', 'ἔχω': 'to have, hold',
    'λαμβάνω': 'to take, receive', 'δίδωμι': 'to give', 'ὁράω': 'to see',
    'ἀκούω': 'to hear', 'οἶδα': 'to know', 'γινώσκω': 'to know',
    'θέλω': 'to wish, want', 'δύναμαι': 'to be able',
    'θεός': 'god, God', 'ἄνθρωπος': 'human, man', 'κύριος': 'lord, master',
    'Ἰησοῦς': 'Jesus', 'Χριστός': 'Christ, anointed', 'πατήρ': 'father',
    'υἱός': 'son', 'πνεῦμα': 'spirit, breath', 'λόγος': 'word, reason',
    'ἡμέρα': 'day', 'ζωή': 'life', 'κόσμος': 'world, order',
    'ἀγάπη': 'love', 'πίστις': 'faith, trust', 'ἀλήθεια': 'truth',
    'δόξα': 'glory', 'χάρις': 'grace, favor', 'εἰρήνη': 'peace',
    'βασιλεία': 'kingdom', 'ἐκκλησία': 'assembly, church',
}

# In-memory morph cache to avoid repeated lookups
morph_cache: Dict[Tuple[str, str, str, str], int] = {}

def tokenize_greek(text: str) -> List[Tuple[str, int, int]]:
    """Tokenize Greek text, returning (token, char_start, char_end) tuples."""
    text = re.sub(r'[⸀⸁⸂⸃⸄⸅]', '', text)
    tokens = []
    for match in re.finditer(r'[\w\u0370-\u03FF\u1F00-\u1FFF]+', text):
        token = match.group()
        if token.strip():
            tokens.append((token, match.start(), match.end()))
    return tokens

def normalize_greek(word: str) -> str:
    """Normalize Greek word for lookup."""
    return word.lower()

def get_gloss(word: str, lemma: str = None) -> Optional[str]:
    """Get English gloss for Greek word."""
    normalized = normalize_greek(word)
    if normalized in COMMON_GLOSSES:
        return COMMON_GLOSSES[normalized]
    if lemma:
        normalized_lemma = normalize_greek(lemma)
        if normalized_lemma in COMMON_GLOSSES:
            return COMMON_GLOSSES[normalized_lemma]
    return None

def analyze_token_basic(token: str) -> Dict:
    """Basic morphological analysis using heuristics."""
    analysis = {
        'lemma': token,
        'pos': 'unknown',
        'feats': {},
        'gloss': get_gloss(token),
    }

    # Article detection
    if token in ['ὁ', 'ἡ', 'τό', 'τοῦ', 'τῆς', 'τῷ', 'τῇ', 'τόν', 'τήν',
                  'οἱ', 'αἱ', 'τά', 'τῶν', 'τοῖς', 'ταῖς', 'τούς', 'τάς']:
        analysis['pos'] = 'article'
        analysis['lemma'] = 'ὁ'

    # Conjunction detection
    elif token in ['καί', 'δέ', 'ἀλλά', 'γάρ', 'οὖν', 'ὅτι', 'εἰ', 'ὡς', 'ἤ', 'τε']:
        analysis['pos'] = 'conjunction'

    # Preposition detection
    elif token in ['ἐν', 'εἰς', 'ἐκ', 'ἀπό', 'πρός', 'ἐπί', 'διά', 'μετά',
                   'κατά', 'περί', 'ὑπό', 'παρά', 'ὑπέρ', 'πρό', 'σύν']:
        analysis['pos'] = 'preposition'

    # Particle detection
    elif token in ['οὐ', 'οὐκ', 'οὐχ', 'μή', 'ναί', 'ἄν', 'γε', 'δή', 'μέν', 'νῦν']:
        analysis['pos'] = 'particle'

    # Verb ending patterns
    elif re.search(r'(ω|εις|ει|ομεν|ετε|ουσι|ουσιν)$', token):
        analysis['pos'] = 'verb'
        analysis['feats'] = {'tense': 'present', 'mood': 'indicative', 'voice': 'active'}

    # Noun patterns (2nd declension masculine)
    elif re.search(r'(ος|ου|ῳ|ον|οι|ων|οις|ους)$', token):
        analysis['pos'] = 'noun'
        analysis['feats'] = {'gender': 'masculine'}

    # Noun patterns (1st declension feminine)
    elif re.search(r'(η|ης|ῃ|ην|αι|ων|αις|ας)$', token):
        analysis['pos'] = 'noun'
        analysis['feats'] = {'gender': 'feminine'}

    return analysis

def get_or_create_morph_entry(cur, language: str, lemma: str, pos: str,
                               feats: dict, gloss: Optional[str]) -> int:
    """Get or create a morph_entry, returning the morph_id."""
    feats_json = json.dumps(feats, sort_keys=True) if feats else '{}'
    cache_key = (language, lemma, pos, feats_json)

    # Check cache first
    if cache_key in morph_cache:
        return morph_cache[cache_key]

    # Try to insert or get existing
    cur.execute("""
        INSERT INTO morph_entries (language, lemma, pos, feats, gloss, source)
        VALUES (%s, %s, %s, %s::jsonb, %s, 'heuristic')
        ON CONFLICT (language, lemma, pos, feats)
        DO UPDATE SET frequency = morph_entries.frequency + 1
        RETURNING morph_id
    """, (language, lemma, pos, feats_json, gloss))

    morph_id = cur.fetchone()[0]
    morph_cache[cache_key] = morph_id
    return morph_id

def process_passage(conn, urn: str, content: str, language: str = 'grc') -> int:
    """Process a single passage into compact passage_tokens format."""
    token_data = tokenize_greek(content)

    if not token_data:
        return 0

    tokens = []
    morph_ids = []
    char_starts = []
    char_ends = []

    with conn.cursor() as cur:
        for token, start, end in token_data:
            analysis = analyze_token_basic(token)

            # Get or create morph entry
            morph_id = get_or_create_morph_entry(
                cur, language,
                analysis['lemma'],
                analysis['pos'],
                analysis.get('feats', {}),
                analysis.get('gloss')
            )

            tokens.append(token)
            morph_ids.append(morph_id)
            char_starts.append(start)
            char_ends.append(end)

        # Insert passage_tokens row
        cur.execute("""
            INSERT INTO passage_tokens (urn, language, tokens, morph_ids, char_starts, char_ends)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (urn) DO UPDATE SET
                tokens = EXCLUDED.tokens,
                morph_ids = EXCLUDED.morph_ids,
                char_starts = EXCLUDED.char_starts,
                char_ends = EXCLUDED.char_ends,
                updated_at = NOW()
        """, (urn, language, tokens, morph_ids, char_starts, char_ends))

    conn.commit()
    return len(tokens)

def create_or_resume_job(conn, job_type: str, language: str, total_count: int) -> dict:
    """Create a new job or resume an existing one."""
    with conn.cursor() as cur:
        # Check for existing running/paused job
        cur.execute("""
            SELECT job_id, last_urn, processed, status
            FROM backfill_jobs
            WHERE job_type = %s AND language = %s AND status IN ('running', 'paused')
            ORDER BY created_at DESC LIMIT 1
        """, (job_type, language))
        existing = cur.fetchone()

        if existing:
            job_id, last_urn, processed, status = existing
            # Resume job
            cur.execute("""
                UPDATE backfill_jobs SET status = 'running', started_at = NOW()
                WHERE job_id = %s
            """, (job_id,))
            conn.commit()
            return {'job_id': job_id, 'last_urn': last_urn, 'processed': processed, 'resumed': True}

        # Create new job
        cur.execute("""
            INSERT INTO backfill_jobs (job_type, status, language, total_count, started_at)
            VALUES (%s, 'running', %s, %s, NOW())
            RETURNING job_id
        """, (job_type, language, total_count))
        job_id = cur.fetchone()[0]
        conn.commit()
        return {'job_id': job_id, 'last_urn': None, 'processed': 0, 'resumed': False}

def update_job_progress(conn, job_id: int, processed: int, last_urn: str, errors: int = 0):
    """Update job progress for resumability."""
    with conn.cursor() as cur:
        cur.execute("""
            UPDATE backfill_jobs
            SET processed = %s, last_urn = %s, errors = errors + %s
            WHERE job_id = %s
        """, (processed, last_urn, errors, job_id))
    conn.commit()

def complete_job(conn, job_id: int, status: str = 'done'):
    """Mark job as complete."""
    with conn.cursor() as cur:
        cur.execute("""
            UPDATE backfill_jobs SET status = %s, finished_at = NOW()
            WHERE job_id = %s
        """, (status, job_id))
    conn.commit()

def main():
    """Main backfill function with resumable job tracking."""
    print("=" * 60)
    print("LOGOS Morphology Backfill v2 (Normalized Schema)")
    print("=" * 60)

    conn = psycopg2.connect(DATABASE_URL)

    # Priority works
    priority_works = ['Matthew', 'Mark', 'Luke', 'John']

    for work in priority_works:
        print(f"\n{'='*40}")
        print(f"Processing {work}...")
        print(f"{'='*40}")

        # Count passages for this work
        with conn.cursor() as cur:
            cur.execute("""
                SELECT COUNT(*) FROM source_texts
                WHERE work = %s AND language = 'greek'
            """, (work,))
            total_count = cur.fetchone()[0]

        if total_count == 0:
            print(f"  No passages found for {work}")
            continue

        # Create or resume job
        job = create_or_resume_job(conn, 'greek_morph', work, total_count)
        job_id = job['job_id']

        if job['resumed']:
            print(f"  Resuming job {job_id} from URN: {job['last_urn']}")
            print(f"  Previously processed: {job['processed']}/{total_count}")

        # Fetch passages (after last_urn if resuming)
        with conn.cursor() as cur:
            if job['last_urn']:
                cur.execute("""
                    SELECT urn, content FROM source_texts
                    WHERE work = %s AND language = 'greek' AND urn > %s
                    ORDER BY urn
                """, (work, job['last_urn']))
            else:
                cur.execute("""
                    SELECT urn, content FROM source_texts
                    WHERE work = %s AND language = 'greek'
                    ORDER BY urn
                """, (work,))
            passages = cur.fetchall()

        print(f"  Processing {len(passages)} passages...")

        total_tokens = 0
        processed = job['processed']

        for i, (urn, content) in enumerate(passages):
            try:
                tokens_added = process_passage(conn, urn, content)
                total_tokens += tokens_added
                processed += 1

                # Update progress every 50 passages
                if (i + 1) % 50 == 0:
                    update_job_progress(conn, job_id, processed, urn)
                    print(f"    {processed}/{total_count} passages ({total_tokens} tokens)")

            except Exception as e:
                print(f"    ERROR on {urn}: {e}")
                update_job_progress(conn, job_id, processed, urn, errors=1)

        # Mark job complete
        complete_job(conn, job_id)
        print(f"  Completed {work}: {processed} passages, {total_tokens} tokens")

    # Get final stats
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM morph_entries")
        morph_count = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM passage_tokens")
        passage_count = cur.fetchone()[0]

        cur.execute("SELECT SUM(token_count) FROM passage_tokens")
        token_count = cur.fetchone()[0] or 0

        cur.execute("""
            SELECT language, pos, COUNT(*) as cnt
            FROM morph_entries
            GROUP BY language, pos
            ORDER BY cnt DESC
            LIMIT 10
        """)
        pos_dist = cur.fetchall()

    print(f"\n{'=' * 60}")
    print("BACKFILL COMPLETE")
    print(f"  Unique morph entries: {morph_count}")
    print(f"  Passages tokenized: {passage_count}")
    print(f"  Total tokens: {token_count}")
    print(f"\n  Top POS distribution:")
    for lang, pos, cnt in pos_dist:
        print(f"    {lang}/{pos}: {cnt}")
    print(f"{'=' * 60}")

    conn.close()

if __name__ == '__main__':
    main()
