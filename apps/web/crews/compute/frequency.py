"""
CORPUS FREQUENCY TABLES
Precomputed word frequencies for IDF and rare word detection
"""

import asyncio
import os
import pickle
from typing import Dict, Set
from collections import Counter


class CorpusFrequency:
    """
    Precomputed corpus frequency table.
    Build once, use everywhere - no LLM needed.
    """

    def __init__(self, cache_path: str = None):
        if cache_path is None:
            cache_path = os.path.join(
                os.path.dirname(__file__),
                "../../data/corpus_freq.pkl"
            )
        self.cache_path = cache_path
        self.word_counts: Counter = Counter()
        self.document_counts: Counter = Counter()  # For IDF
        self.total_docs: int = 0
        self.total_words: int = 0

    async def build_from_db(self, db_url: str, sample_size: int = 100000):
        """Build frequency table from database (run once)"""
        try:
            import asyncpg
        except ImportError:
            print("asyncpg not available, skipping DB build")
            return

        pool = await asyncpg.create_pool(db_url)

        async with pool.acquire() as conn:
            rows = await conn.fetch(f"""
                SELECT content FROM source_texts
                WHERE content IS NOT NULL
                LIMIT {sample_size}
            """)

        for row in rows:
            words = row['content'].lower().split()
            self.word_counts.update(words)
            self.document_counts.update(set(words))
            self.total_docs += 1
            self.total_words += len(words)

        # Ensure directory exists
        os.makedirs(os.path.dirname(self.cache_path), exist_ok=True)

        # Save to disk
        with open(self.cache_path, 'wb') as f:
            pickle.dump({
                'word_counts': self.word_counts,
                'document_counts': self.document_counts,
                'total_docs': self.total_docs,
                'total_words': self.total_words
            }, f)

        await pool.close()

    def load(self) -> bool:
        """Load precomputed frequencies. Returns True if loaded."""
        if os.path.exists(self.cache_path):
            with open(self.cache_path, 'rb') as f:
                data = pickle.load(f)
                self.word_counts = data['word_counts']
                self.document_counts = data['document_counts']
                self.total_docs = data['total_docs']
                self.total_words = data['total_words']
            return True
        return False

    def get_frequency(self, word: str) -> float:
        """Get word frequency (0-1)"""
        return self.word_counts.get(word.lower(), 0) / max(self.total_words, 1)

    def get_idf(self, word: str) -> float:
        """Get inverse document frequency"""
        import math
        df = self.document_counts.get(word.lower(), 0)
        if df == 0:
            return 0
        return math.log(self.total_docs / df)

    def is_rare(self, word: str, threshold: int = 10) -> bool:
        """Check if word is rare in corpus"""
        return self.word_counts.get(word.lower(), 0) < threshold

    def find_rare_shared(self, words: Set[str], threshold: int = 10) -> list:
        """Find rare words from a set"""
        return [
            {
                "word": w,
                "count": self.word_counts.get(w.lower(), 0),
                "idf": self.get_idf(w)
            }
            for w in words
            if self.is_rare(w, threshold)
        ]
