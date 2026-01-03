#!/usr/bin/env python3
"""
Backfill morphology data for Greek texts using CLTK.
Priority: Synoptic Gospels (Matthew, Mark, Luke) first.
"""

import os
import re
import json
import psycopg2
from psycopg2.extras import execute_batch
from typing import List, Dict, Tuple, Optional

# Database connection
DATABASE_URL = os.environ.get('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

# Greek morphology mappings
POS_TAGS = {
    'n': 'noun',
    'v': 'verb',
    'a': 'adjective',
    'd': 'adverb',
    'p': 'preposition',
    'c': 'conjunction',
    'r': 'pronoun',
    'l': 'article',
    'i': 'interjection',
    'm': 'numeral',
    'x': 'particle',
}

CASE_TAGS = {
    'n': 'nominative',
    'g': 'genitive',
    'd': 'dative',
    'a': 'accusative',
    'v': 'vocative',
}

NUMBER_TAGS = {
    's': 'singular',
    'p': 'plural',
    'd': 'dual',
}

GENDER_TAGS = {
    'm': 'masculine',
    'f': 'feminine',
    'n': 'neuter',
}

TENSE_TAGS = {
    'p': 'present',
    'i': 'imperfect',
    'f': 'future',
    'a': 'aorist',
    'r': 'perfect',
    'l': 'pluperfect',
    't': 'future perfect',
}

MOOD_TAGS = {
    'i': 'indicative',
    's': 'subjunctive',
    'o': 'optative',
    'm': 'imperative',
    'n': 'infinitive',
    'p': 'participle',
}

VOICE_TAGS = {
    'a': 'active',
    'm': 'middle',
    'p': 'passive',
    'e': 'middle-passive',
}

PERSON_TAGS = {
    '1': '1st',
    '2': '2nd',
    '3': '3rd',
}

# Common Greek word glosses (basic LSJ-derived)
COMMON_GLOSSES = {
    'καί': 'and',
    'ὁ': 'the',
    'ἡ': 'the',
    'τό': 'the',
    'τοῦ': 'the (gen)',
    'τῆς': 'the (gen)',
    'αὐτός': 'he, she, it; self',
    'αὐτοῦ': 'of him/it',
    'αὐτῷ': 'to him/it',
    'αὐτόν': 'him/it',
    'δέ': 'but, and',
    'εἰμί': 'to be',
    'ἐν': 'in, among',
    'εἰς': 'into, to',
    'ἐκ': 'out of, from',
    'ἀπό': 'from, away from',
    'πρός': 'to, toward',
    'ἐπί': 'on, upon',
    'διά': 'through, because of',
    'μετά': 'with, after',
    'κατά': 'down, against',
    'περί': 'about, concerning',
    'ὑπό': 'by, under',
    'παρά': 'beside, from',
    'ἀλλά': 'but',
    'γάρ': 'for',
    'οὖν': 'therefore',
    'ὅτι': 'that, because',
    'εἰ': 'if',
    'ὡς': 'as, like',
    'οὐ': 'not',
    'οὐκ': 'not',
    'μή': 'not',
    'τίς': 'who? what?',
    'τις': 'someone, anyone',
    'ὅς': 'who, which',
    'οὗτος': 'this',
    'ἐκεῖνος': 'that',
    'πᾶς': 'all, every',
    'εἷς': 'one',
    'λέγω': 'to say, speak',
    'ἔρχομαι': 'to come, go',
    'ποιέω': 'to do, make',
    'γίνομαι': 'to become, happen',
    'ἔχω': 'to have, hold',
    'λαμβάνω': 'to take, receive',
    'δίδωμι': 'to give',
    'ὁράω': 'to see',
    'ἀκούω': 'to hear',
    'οἶδα': 'to know',
    'γινώσκω': 'to know',
    'θέλω': 'to wish, want',
    'δύναμαι': 'to be able',
    'θεός': 'god, God',
    'ἄνθρωπος': 'human, man',
    'κύριος': 'lord, master',
    'Ἰησοῦς': 'Jesus',
    'Χριστός': 'Christ, anointed',
    'πατήρ': 'father',
    'υἱός': 'son',
    'πνεῦμα': 'spirit, breath',
    'λόγος': 'word, reason',
    'ἡμέρα': 'day',
    'ζωή': 'life',
    'κόσμος': 'world, order',
    'ἀγάπη': 'love',
    'πίστις': 'faith, trust',
    'ἀλήθεια': 'truth',
    'δόξα': 'glory',
    'χάρις': 'grace, favor',
    'εἰρήνη': 'peace',
    'βασιλεία': 'kingdom',
    'ἐκκλησία': 'assembly, church',
    'ναός': 'temple',
    'οἶκος': 'house',
    'ὄνομα': 'name',
    'ὄχλος': 'crowd',
    'μαθητής': 'disciple, student',
    'ἀρχιερεύς': 'high priest',
}

def tokenize_greek(text: str) -> List[Tuple[int, str]]:
    """Tokenize Greek text, returning (index, token) pairs."""
    # Remove editorial marks and normalize
    text = re.sub(r'[⸀⸁⸂⸃⸄⸅]', '', text)  # Remove text-critical marks

    # Split on whitespace and punctuation, keeping tokens
    tokens = []
    idx = 0
    for match in re.finditer(r'[\w\u0370-\u03FF\u1F00-\u1FFF]+|[^\s\w]', text):
        token = match.group()
        if token.strip():
            tokens.append((idx, token))
            idx += 1
    return tokens

def normalize_greek(word: str) -> str:
    """Normalize Greek word for lookup (lowercase, strip accents for comparison)."""
    # Basic lowercasing - Greek-aware
    return word.lower()

def get_gloss(word: str, lemma: str = None) -> Optional[str]:
    """Get English gloss for Greek word."""
    # Try word first, then lemma
    normalized = normalize_greek(word)
    if normalized in COMMON_GLOSSES:
        return COMMON_GLOSSES[normalized]
    if lemma:
        normalized_lemma = normalize_greek(lemma)
        if normalized_lemma in COMMON_GLOSSES:
            return COMMON_GLOSSES[normalized_lemma]
    return None

def analyze_token_basic(token: str) -> Dict:
    """
    Basic morphological analysis without CLTK.
    Uses heuristics for common patterns.
    """
    analysis = {
        'lemma': token,
        'pos': None,
        'morphology_code': None,
        'case_value': None,
        'number_value': None,
        'gender': None,
        'tense': None,
        'mood': None,
        'voice': None,
        'person': None,
        'gloss': get_gloss(token),
        'confidence': 0.5,
        'source': 'heuristic',
    }

    # Article detection
    if token in ['ὁ', 'ἡ', 'τό', 'τοῦ', 'τῆς', 'τοῦ', 'τῷ', 'τῇ', 'τῷ',
                  'τόν', 'τήν', 'τό', 'οἱ', 'αἱ', 'τά', 'τῶν', 'τοῖς',
                  'ταῖς', 'τούς', 'τάς']:
        analysis['pos'] = 'article'
        analysis['confidence'] = 0.9

    # Conjunction detection
    elif token in ['καί', 'δέ', 'ἀλλά', 'γάρ', 'οὖν', 'ὅτι', 'εἰ', 'ὡς', 'ἤ', 'τε']:
        analysis['pos'] = 'conjunction'
        analysis['confidence'] = 0.9

    # Preposition detection
    elif token in ['ἐν', 'εἰς', 'ἐκ', 'ἀπό', 'πρός', 'ἐπί', 'διά', 'μετά',
                   'κατά', 'περί', 'ὑπό', 'παρά', 'ὑπέρ', 'πρό', 'σύν']:
        analysis['pos'] = 'preposition'
        analysis['confidence'] = 0.9

    # Particle/adverb detection
    elif token in ['οὐ', 'οὐκ', 'οὐχ', 'μή', 'ναί', 'ἄν', 'γε', 'δή', 'μέν', 'νῦν']:
        analysis['pos'] = 'particle'
        analysis['confidence'] = 0.85

    # Verb ending patterns
    elif re.search(r'(ω|εις|ει|ομεν|ετε|ουσι|ουσιν)$', token):
        analysis['pos'] = 'verb'
        analysis['tense'] = 'present'
        analysis['mood'] = 'indicative'
        analysis['voice'] = 'active'
        analysis['confidence'] = 0.6

    elif re.search(r'(ον|ες|εν|ομεν|ετε|ον)$', token) and len(token) > 4:
        analysis['pos'] = 'verb'
        analysis['tense'] = 'imperfect'
        analysis['confidence'] = 0.5

    # Noun ending patterns
    elif re.search(r'(ος|ου|ῳ|ον|οι|ων|οις|ους)$', token):
        analysis['pos'] = 'noun'
        analysis['gender'] = 'masculine'
        analysis['confidence'] = 0.5

    elif re.search(r'(η|ης|ῃ|ην|αι|ων|αις|ας)$', token):
        analysis['pos'] = 'noun'
        analysis['gender'] = 'feminine'
        analysis['confidence'] = 0.5

    elif re.search(r'(ον|ου|ῳ|α|ων|οις)$', token) and analysis['pos'] != 'verb':
        analysis['pos'] = 'noun'
        analysis['gender'] = 'neuter'
        analysis['confidence'] = 0.4

    return analysis

def try_cltk_analysis(token: str) -> Optional[Dict]:
    """Try to use CLTK for morphological analysis if available."""
    try:
        from cltk import NLP
        from cltk.alphabet.grc import normalize_grc

        # Initialize CLTK for Greek
        cltk_nlp = NLP(language="grc")
        doc = cltk_nlp.analyze(text=token)

        if doc.words:
            word = doc.words[0]
            return {
                'lemma': word.lemma if hasattr(word, 'lemma') else token,
                'pos': word.pos if hasattr(word, 'pos') else None,
                'morphology_code': str(word.morpho) if hasattr(word, 'morpho') else None,
                'confidence': 0.85,
                'source': 'cltk',
            }
    except Exception as e:
        pass  # CLTK not available or failed
    return None

def process_passage(conn, urn: str, content: str, batch_size: int = 100) -> int:
    """Process a single passage and insert token annotations."""
    tokens = tokenize_greek(content)

    annotations = []
    for idx, token in tokens:
        # Skip punctuation
        if len(token) == 1 and not re.match(r'[\u0370-\u03FF\u1F00-\u1FFF]', token):
            continue

        # Try CLTK first, fall back to heuristics
        analysis = try_cltk_analysis(token)
        if not analysis:
            analysis = analyze_token_basic(token)

        # Get gloss
        gloss = get_gloss(token, analysis.get('lemma'))

        annotations.append({
            'urn': urn,
            'token_index': idx,
            'surface_form': token,
            'lemma': analysis.get('lemma'),
            'pos': analysis.get('pos'),
            'morphology_code': analysis.get('morphology_code'),
            'case_value': analysis.get('case_value'),
            'number_value': analysis.get('number_value'),
            'gender': analysis.get('gender'),
            'tense': analysis.get('tense'),
            'mood': analysis.get('mood'),
            'voice': analysis.get('voice'),
            'person': analysis.get('person'),
            'gloss': gloss,
            'confidence': analysis.get('confidence', 0.5),
            'source': analysis.get('source', 'heuristic'),
        })

    # Insert in batches
    if annotations:
        with conn.cursor() as cur:
            execute_batch(cur, """
                INSERT INTO token_annotations
                (urn, token_index, surface_form, lemma, pos, morphology_code,
                 case_value, number_value, gender, tense, mood, voice, person,
                 gloss, confidence, source)
                VALUES (%(urn)s, %(token_index)s, %(surface_form)s, %(lemma)s,
                        %(pos)s, %(morphology_code)s, %(case_value)s, %(number_value)s,
                        %(gender)s, %(tense)s, %(mood)s, %(voice)s, %(person)s,
                        %(gloss)s, %(confidence)s, %(source)s)
                ON CONFLICT (urn, token_index) DO UPDATE SET
                    lemma = EXCLUDED.lemma,
                    pos = EXCLUDED.pos,
                    gloss = EXCLUDED.gloss,
                    confidence = EXCLUDED.confidence,
                    source = EXCLUDED.source
            """, annotations, page_size=batch_size)
        conn.commit()

    return len(annotations)

def main():
    """Main backfill function."""
    print("=" * 60)
    print("LOGOS Morphology Backfill")
    print("=" * 60)

    conn = psycopg2.connect(DATABASE_URL)

    # Priority 1: Synoptic Gospels (Greek)
    priority_works = ['Matthew', 'Mark', 'Luke', 'John']

    total_tokens = 0

    for work in priority_works:
        print(f"\nProcessing {work}...")

        with conn.cursor() as cur:
            cur.execute("""
                SELECT urn, content
                FROM source_texts
                WHERE work = %s AND language = 'greek'
                ORDER BY section
            """, (work,))
            passages = cur.fetchall()

        print(f"  Found {len(passages)} passages")

        for i, (urn, content) in enumerate(passages):
            tokens_added = process_passage(conn, urn, content)
            total_tokens += tokens_added

            if (i + 1) % 100 == 0:
                print(f"  Processed {i + 1}/{len(passages)} passages ({total_tokens} tokens)")

        print(f"  Completed {work}: {len(passages)} passages")

    # Get stats
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM token_annotations")
        total = cur.fetchone()[0]

        cur.execute("SELECT COUNT(DISTINCT urn) FROM token_annotations")
        urns = cur.fetchone()[0]

    print(f"\n{'=' * 60}")
    print(f"BACKFILL COMPLETE")
    print(f"  Total tokens: {total}")
    print(f"  Passages covered: {urns}")
    print(f"{'=' * 60}")

    conn.close()

if __name__ == '__main__':
    main()
