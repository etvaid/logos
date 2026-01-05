#!/usr/bin/env python3
"""
LOGOS Translation Memory Builder
Phase 2: Build TM from existing translations

This script:
1. Reads all translations with their source texts
2. Extracts word-level alignments using co-occurrence statistics
3. Populates translation_memory_* tables
4. Tracks progress to logs/progress.json
"""

import os
import sys
import re
import json
import asyncio
from datetime import datetime
from collections import defaultdict, Counter
from typing import Dict, List, Tuple, Optional, Set
import asyncpg
import unicodedata
from dataclasses import dataclass, asdict

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

LOGS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'logs')
PROGRESS_FILE = os.path.join(LOGS_DIR, 'progress.json')

# Batch sizes
BATCH_SIZE = 100
PROGRESS_INTERVAL = 60  # seconds between progress updates

@dataclass
class Progress:
    phase: str
    step: str
    processed: int
    total: int
    start_time: str
    last_update: str
    lexeme_count: int = 0
    phrase_count: int = 0
    idiom_count: int = 0


def clean_text(text: str) -> str:
    """Remove HTML tags and normalize text."""
    if not text:
        return ""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Remove special characters but keep Greek/Hebrew/Latin
    text = re.sub(r'[\[\]\(\)\{\}]', '', text)
    # Normalize whitespace
    text = ' '.join(text.split())
    return text.strip()


def tokenize_greek(text: str) -> List[str]:
    """Tokenize Greek text."""
    text = clean_text(text)
    # Greek word pattern
    tokens = re.findall(r'[\u0370-\u03FF\u1F00-\u1FFF]+', text, re.UNICODE)
    return [t.lower() for t in tokens if len(t) > 1]


def tokenize_latin(text: str) -> List[str]:
    """Tokenize Latin text."""
    text = clean_text(text)
    # Latin word pattern (including macrons)
    tokens = re.findall(r'[a-zA-ZāēīōūĀĒĪŌŪ]+', text, re.UNICODE)
    return [t.lower() for t in tokens if len(t) > 1]


def tokenize_hebrew(text: str) -> List[str]:
    """Tokenize Hebrew text."""
    text = clean_text(text)
    # Hebrew word pattern
    tokens = re.findall(r'[\u0590-\u05FF]+', text, re.UNICODE)
    return [t for t in tokens if len(t) > 1]


def tokenize_english(text: str) -> List[str]:
    """Tokenize English translation."""
    text = clean_text(text)
    tokens = re.findall(r"[a-zA-Z']+", text)
    return [t.lower() for t in tokens if len(t) > 1]


def tokenize(text: str, language: str) -> List[str]:
    """Tokenize text based on language."""
    if language == 'greek':
        return tokenize_greek(text)
    elif language == 'latin':
        return tokenize_latin(text)
    elif language in ('hebrew', 'aramaic'):
        return tokenize_hebrew(text)
    else:
        return tokenize_english(text)


def extract_bigrams(tokens: List[str]) -> List[str]:
    """Extract word bigrams for phrase detection."""
    return [f"{tokens[i]} {tokens[i+1]}" for i in range(len(tokens) - 1)]


def extract_trigrams(tokens: List[str]) -> List[str]:
    """Extract word trigrams for phrase detection."""
    return [f"{tokens[i]} {tokens[i+1]} {tokens[i+2]}" for i in range(len(tokens) - 2)]


class TranslationMemoryBuilder:
    def __init__(self, conn: asyncpg.Connection):
        self.conn = conn
        self.lexeme_pairs: Dict[Tuple[str, str, str], Counter] = defaultdict(Counter)
        self.phrase_pairs: Dict[Tuple[str, str, str], Counter] = defaultdict(Counter)
        self.source_urns: Dict[str, Set[str]] = defaultdict(set)
        self.progress = Progress(
            phase="phase2_tm_build",
            step="initializing",
            processed=0,
            total=0,
            start_time=datetime.now().isoformat(),
            last_update=datetime.now().isoformat()
        )

    def save_progress(self):
        """Save progress to JSON file."""
        os.makedirs(LOGS_DIR, exist_ok=True)
        self.progress.last_update = datetime.now().isoformat()
        with open(PROGRESS_FILE, 'w') as f:
            json.dump(asdict(self.progress), f, indent=2)

    async def get_translations(self) -> List[dict]:
        """Fetch all translations with their source texts."""
        print("Fetching translations with source texts...")
        rows = await self.conn.fetch("""
            SELECT t.id, t.text_id, t.urn, t.style, t.translation,
                   st.language as source_language,
                   st.content as source_content,
                   st.urn as source_urn
            FROM translations t
            LEFT JOIN source_texts st ON t.text_id = st.id
            WHERE st.content IS NOT NULL
            AND st.language IN ('greek', 'latin', 'hebrew', 'aramaic')
            AND LENGTH(t.translation) > 10
            AND LENGTH(st.content) > 10
        """)
        print(f"Found {len(rows)} translations with source content")
        return rows

    def align_words(self, source_tokens: List[str], target_tokens: List[str],
                    source_lang: str) -> List[Tuple[str, str, float]]:
        """
        Simple word alignment using co-occurrence.
        Returns list of (source_word, target_word, confidence) tuples.

        This is a simplified approach - for production, use statistical aligners.
        """
        alignments = []

        if not source_tokens or not target_tokens:
            return alignments

        # Build co-occurrence matrix (simplified)
        # For each source word, find most likely target words
        source_set = set(source_tokens)
        target_set = set(target_tokens)

        # Simple heuristic: if source has N unique words and target has M,
        # create potential alignments based on position proximity
        source_positions = {w: i for i, w in enumerate(source_tokens)}
        target_positions = {w: i for i, w in enumerate(target_tokens)}

        for src_word in source_set:
            src_pos = source_positions.get(src_word, 0) / max(len(source_tokens), 1)

            best_target = None
            best_score = 0

            for tgt_word in target_set:
                tgt_pos = target_positions.get(tgt_word, 0) / max(len(target_tokens), 1)

                # Position-based alignment score
                pos_score = 1.0 - abs(src_pos - tgt_pos)

                # Bonus for similar length ratio
                len_ratio = min(len(src_word), len(tgt_word)) / max(len(src_word), len(tgt_word))

                score = pos_score * 0.7 + len_ratio * 0.3

                if score > best_score and score > 0.3:
                    best_score = score
                    best_target = tgt_word

            if best_target:
                alignments.append((src_word, best_target, best_score))

        return alignments

    async def process_translation(self, row: dict):
        """Process a single translation pair."""
        source_text = row['source_content']
        target_text = row['translation']
        source_lang = row['source_language']
        urn = row['source_urn'] or row['urn'] or str(row['id'])

        # Tokenize
        source_tokens = tokenize(source_text, source_lang)
        target_tokens = tokenize_english(target_text)

        if not source_tokens or not target_tokens:
            return

        # Extract word alignments
        alignments = self.align_words(source_tokens, target_tokens, source_lang)

        for src_word, tgt_word, confidence in alignments:
            key = (src_word, source_lang, tgt_word)
            self.lexeme_pairs[key][urn] = confidence
            self.source_urns[f"{src_word}:{source_lang}:{tgt_word}"].add(urn)

        # Extract phrase alignments (bigrams)
        source_bigrams = extract_bigrams(source_tokens)
        target_bigrams = extract_bigrams(target_tokens)

        for i, src_bi in enumerate(source_bigrams):
            if i < len(target_bigrams):
                key = (src_bi, source_lang, target_bigrams[i])
                self.phrase_pairs[key][urn] = 0.5

    async def save_lexeme_pairs(self):
        """Save lexeme pairs to database."""
        print(f"\nSaving {len(self.lexeme_pairs)} lexeme pairs...")
        self.progress.step = "saving_lexeme_pairs"

        batch = []
        count = 0

        for (src_lemma, src_lang, tgt_trans), urn_scores in self.lexeme_pairs.items():
            frequency = len(urn_scores)
            confidence = sum(urn_scores.values()) / frequency if frequency > 0 else 0.5
            urns = list(urn_scores.keys())[:100]  # Limit URN list size

            batch.append((src_lemma, src_lang, tgt_trans, confidence, frequency, urns))

            if len(batch) >= BATCH_SIZE:
                await self._insert_lexeme_batch(batch)
                count += len(batch)
                batch = []
                if count % 1000 == 0:
                    print(f"  Inserted {count} lexeme pairs...")

        if batch:
            await self._insert_lexeme_batch(batch)
            count += len(batch)

        self.progress.lexeme_count = count
        print(f"  Saved {count} lexeme pairs")

    async def _insert_lexeme_batch(self, batch: list):
        """Insert batch of lexeme pairs."""
        await self.conn.executemany("""
            INSERT INTO translation_memory_lexeme
                (source_lemma, source_language, target_translation, confidence, frequency, source_urns)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (source_lemma, source_language, target_translation, morphological_context)
            DO UPDATE SET
                frequency = translation_memory_lexeme.frequency + EXCLUDED.frequency,
                confidence = (translation_memory_lexeme.confidence + EXCLUDED.confidence) / 2,
                updated_at = CURRENT_TIMESTAMP
        """, batch)

    async def save_phrase_pairs(self):
        """Save phrase pairs to database."""
        print(f"\nSaving {len(self.phrase_pairs)} phrase pairs...")
        self.progress.step = "saving_phrase_pairs"

        batch = []
        count = 0

        for (src_phrase, src_lang, tgt_phrase), urn_scores in self.phrase_pairs.items():
            frequency = len(urn_scores)
            confidence = 0.5  # Lower confidence for phrases
            urns = list(urn_scores.keys())[:50]

            batch.append((src_phrase, src_lang, tgt_phrase, confidence, frequency, urns))

            if len(batch) >= BATCH_SIZE:
                await self._insert_phrase_batch(batch)
                count += len(batch)
                batch = []

        if batch:
            await self._insert_phrase_batch(batch)
            count += len(batch)

        self.progress.phrase_count = count
        print(f"  Saved {count} phrase pairs")

    async def _insert_phrase_batch(self, batch: list):
        """Insert batch of phrase pairs."""
        await self.conn.executemany("""
            INSERT INTO translation_memory_phrase
                (source_phrase, source_language, target_phrase, confidence, frequency, source_urns)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (source_phrase, source_language, target_phrase)
            DO UPDATE SET
                frequency = translation_memory_phrase.frequency + EXCLUDED.frequency,
                updated_at = CURRENT_TIMESTAMP
        """, batch)

    async def record_evidence(self):
        """Record evidence trail for TM build."""
        print("\nRecording evidence trail...")
        await self.conn.execute("""
            INSERT INTO evidence_trails
                (entity_type, entity_id, action, actor, evidence)
            VALUES ($1, $2, $3, $4, $5)
        """, 'translation_memory', 'phase2_build', 'created', 'system:tm_builder',
            json.dumps({
                'lexeme_count': self.progress.lexeme_count,
                'phrase_count': self.progress.phrase_count,
                'source_translations': self.progress.total,
                'build_time': self.progress.last_update
            }))

    async def build(self):
        """Main build process."""
        print("=" * 60)
        print("LOGOS Translation Memory Builder - Phase 2")
        print("=" * 60)
        print()

        # Get translations
        translations = await self.get_translations()
        self.progress.total = len(translations)
        self.save_progress()

        # Process each translation
        print(f"\nProcessing {len(translations)} translations...")
        self.progress.step = "processing_translations"

        for i, row in enumerate(translations):
            await self.process_translation(row)
            self.progress.processed = i + 1

            if (i + 1) % 500 == 0:
                print(f"  Processed {i + 1}/{len(translations)} translations...")
                self.save_progress()

        # Save to database
        await self.save_lexeme_pairs()
        await self.save_phrase_pairs()
        await self.record_evidence()

        # Final progress update
        self.progress.step = "completed"
        self.save_progress()

        print()
        print("=" * 60)
        print("Translation Memory Build Complete!")
        print(f"  Lexeme pairs: {self.progress.lexeme_count:,}")
        print(f"  Phrase pairs: {self.progress.phrase_count:,}")
        print("=" * 60)


async def main():
    os.makedirs(LOGS_DIR, exist_ok=True)

    # Connect to database
    conn = None
    for ssl_mode in [False, 'prefer', 'require']:
        try:
            conn = await asyncpg.connect(DATABASE_URL, ssl=ssl_mode)
            print(f"Connected with ssl={ssl_mode}")
            break
        except Exception as e:
            print(f"Connection with ssl={ssl_mode} failed: {e}")
            continue

    if conn is None:
        print("Could not connect to database")
        sys.exit(1)

    try:
        builder = TranslationMemoryBuilder(conn)
        await builder.build()
    except Exception as e:
        print(f"Build failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        await conn.close()


if __name__ == '__main__':
    asyncio.run(main())
