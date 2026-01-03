#!/usr/bin/env python3
"""
================================================================================
CANONICAL DATASET BUILDER
================================================================================

Builds reproducible dataset artifacts from canonical database tables ONLY.

Key principles:
1. NO cached JSON files - always query canonical DB tables
2. Deterministic ordering and splits
3. Content-addressable artifacts (hash-based filenames)
4. Frozen splits for evaluation

Output:
- dataset_<hash>.pkl - Complete dataset artifact
- dataset_<hash>_splits.json - Train/val/test split definitions

This eliminates the silent confound risk of stale cached data.
================================================================================
"""

import os
import sys
import json
import pickle
import hashlib
import asyncio
import asyncpg
import numpy as np
from datetime import datetime
from typing import Dict, List, Tuple, Any, Optional
from collections import Counter
import re
from pathlib import Path

DATABASE_URL = os.environ.get('DATABASE_URL', '')

# Greek function words (canonical list - DO NOT MODIFY without versioning)
GREEK_FUNCTION_WORDS_V2 = [
    'ὁ', 'ἡ', 'τό', 'τοῦ', 'τῆς', 'τῷ', 'τῇ', 'τόν', 'τήν',
    'οἱ', 'αἱ', 'τά', 'τῶν', 'τοῖς', 'ταῖς', 'τούς', 'τάς',
    'ἐν', 'εἰς', 'ἐκ', 'ἐξ', 'ἀπό', 'πρός', 'διά', 'κατά', 'μετά', 'περί',
    'καί', 'δέ', 'γάρ', 'ἀλλά', 'ἤ', 'εἰ', 'ἐάν', 'ὅτι', 'ὡς', 'ἵνα',
    'μή', 'οὐ', 'οὐκ', 'οὐχ',
    'ἐγώ', 'σύ', 'αὐτός', 'αὐτή', 'αὐτό', 'ἡμεῖς', 'ὑμεῖς',
    'οὗτος', 'ἐκεῖνος', 'ὅς', 'τίς',
    'μέν', 'οὖν', 'νῦν', 'τότε', 'πάλιν', 'εὐθύς', 'εὐθέως',
]
FEATURE_VERSION = "v2.1"


def normalize_greek(word: str) -> str:
    """Normalize Greek word for comparison."""
    return re.sub(r'[^\u0370-\u03FF\u1F00-\u1FFF]', '', word.lower())


def tokenize_greek(text: str) -> List[str]:
    """Tokenize Greek text."""
    return re.findall(r'[\u0370-\u03FF\u1F00-\u1FFF]+', text)


GREEK_FUNCTION_SET = set(normalize_greek(w) for w in GREEK_FUNCTION_WORDS_V2)


def extract_features_v2(text: str, n_features: int = 60) -> np.ndarray:
    """
    Extract style features from Greek text.
    Version 2.1 - deterministic, reproducible.
    """
    if not text:
        return np.zeros(n_features)

    func_words = [normalize_greek(w) for w in GREEK_FUNCTION_WORDS_V2[:50]]
    words = [normalize_greek(w) for w in tokenize_greek(text)]
    total = len(words) if words else 1
    counts = Counter(words)

    features = []

    # Function word frequencies (50 features)
    for fw in func_words:
        features.append(counts.get(fw, 0) / total * 1000)

    # Word length statistics (5 features)
    if words:
        lengths = [len(w) for w in tokenize_greek(text)]
        features.append(np.mean(lengths) if lengths else 0)
        features.append(np.std(lengths) if lengths else 0)
        features.append(np.median(lengths) if lengths else 0)
        features.append(max(lengths) if lengths else 0)
        features.append(min(lengths) if lengths else 0)
    else:
        features.extend([0, 0, 0, 0, 0])

    # Lexical features (5 features)
    fw_count = sum(1 for w in words if w in GREEK_FUNCTION_SET)
    features.append(fw_count / total * 100)  # Function word ratio
    features.append(len(set(words)) / total if total > 0 else 0)  # Vocab richness
    features.append(counts.get('καί', 0) / total * 1000)  # kai frequency
    features.append(counts.get('δέ', 0) / total * 1000)  # de frequency
    features.append(total)  # Word count

    return np.array(features[:n_features])


def compute_content_hash(data: Dict) -> str:
    """Compute SHA256 hash of dataset content."""
    content = json.dumps(data, default=str, sort_keys=True)
    return hashlib.sha256(content.encode()).hexdigest()[:12]


class CanonicalDatasetBuilder:
    """Builds reproducible datasets from canonical DB tables."""

    def __init__(self, pool: asyncpg.Pool, seed: int = 42):
        self.pool = pool
        self.seed = seed
        self.rng = np.random.RandomState(seed)

    async def build_synoptic_dataset(self) -> Dict:
        """Build dataset from synoptic_alignments table."""
        print("Building synoptic dataset from canonical tables...")

        async with self.pool.acquire() as conn:
            # Q passages (double tradition)
            q_rows = await conn.fetch("""
                SELECT id, alignment_group, matthew_ref, luke_ref,
                       matthew_text, luke_text, tradition_type
                FROM synoptic_alignments
                WHERE tradition_type = 'double_mt_lk'
                  AND (matthew_text IS NOT NULL OR luke_text IS NOT NULL)
                ORDER BY id
            """)

            # Mark passages (control)
            mk_rows = await conn.fetch("""
                SELECT urn, section, content
                FROM source_texts
                WHERE work = 'Mark' AND content IS NOT NULL
                ORDER BY section
                LIMIT 150
            """)

        # Process Q passages
        q_data = []
        for row in q_rows:
            text = row['luke_text'] or row['matthew_text']
            if text and len(tokenize_greek(text)) >= 5:
                features = extract_features_v2(text)
                q_data.append({
                    'id': row['id'],
                    'alignment_group': row['alignment_group'],
                    'pericope': row['alignment_group'],  # Use alignment_group as pericope ID
                    'text': text,
                    'features': features.tolist(),
                    'label': 1,
                    'source': 'Q'
                })

        # Process Mark passages
        mk_data = []
        for row in mk_rows:
            if row['content'] and len(tokenize_greek(row['content'])) >= 5:
                features = extract_features_v2(row['content'])
                mk_data.append({
                    'id': f"mark_{row['section']}",
                    'section': row['section'],
                    'text': row['content'],
                    'features': features.tolist(),
                    'label': 0,
                    'source': 'Mark'
                })

        print(f"  Q passages: {len(q_data)}")
        print(f"  Mark passages: {len(mk_data)}")

        return {
            'q_passages': q_data,
            'mark_passages': mk_data,
            'feature_version': FEATURE_VERSION,
            'timestamp': datetime.now().isoformat()
        }

    async def build_thomas_dataset(self) -> Dict:
        """Build Thomas dataset from canonical tables."""
        print("Building Thomas dataset...")

        async with self.pool.acquire() as conn:
            rows = await conn.fetch("""
                SELECT logion_num, greek_text, coptic_translation, q_parallel
                FROM thomas_logia
                WHERE greek_text IS NOT NULL AND LENGTH(greek_text) > 20
                ORDER BY logion_num
            """)

        thomas_data = []
        for row in rows:
            features = extract_features_v2(row['greek_text'])
            thomas_data.append({
                'logion': row['logion_num'],
                'greek_text': row['greek_text'],
                'coptic': row['coptic_translation'],
                'q_parallel': row['q_parallel'],
                'has_q_parallel': row['q_parallel'] is not None,
                'features': features.tolist()
            })

        print(f"  Thomas logia with Greek: {len(thomas_data)}")

        return {
            'logia': thomas_data,
            'feature_version': FEATURE_VERSION,
            'timestamp': datetime.now().isoformat()
        }

    def create_frozen_splits(
        self,
        data: List[Dict],
        test_ratio: float = 0.2,
        val_ratio: float = 0.1
    ) -> Dict[str, List[int]]:
        """
        Create frozen train/val/test splits.
        Uses deterministic seed for reproducibility.
        """
        n = len(data)
        indices = list(range(n))
        self.rng.shuffle(indices)

        n_test = int(n * test_ratio)
        n_val = int(n * val_ratio)

        test_indices = sorted(indices[:n_test])
        val_indices = sorted(indices[n_test:n_test + n_val])
        train_indices = sorted(indices[n_test + n_val:])

        return {
            'train': train_indices,
            'val': val_indices,
            'test': test_indices,
            'seed': self.seed,
            'test_ratio': test_ratio,
            'val_ratio': val_ratio
        }

    def create_pericope_splits(
        self,
        data: List[Dict],
        test_pericope_ratio: float = 0.2
    ) -> Dict[str, List[int]]:
        """
        Create splits by pericope (not by passage) to prevent leakage.
        Entire pericopes go to train or test, never split.
        """
        # Group by pericope
        pericope_to_indices = {}
        for i, item in enumerate(data):
            pericope = item.get('pericope') or item.get('q_reference') or f"item_{i}"
            if pericope not in pericope_to_indices:
                pericope_to_indices[pericope] = []
            pericope_to_indices[pericope].append(i)

        # Shuffle pericopes
        pericopes = list(pericope_to_indices.keys())
        self.rng.shuffle(pericopes)

        n_test_pericopes = int(len(pericopes) * test_pericope_ratio)

        test_pericopes = set(pericopes[:n_test_pericopes])
        train_pericopes = set(pericopes[n_test_pericopes:])

        test_indices = []
        train_indices = []

        for pericope in test_pericopes:
            test_indices.extend(pericope_to_indices[pericope])
        for pericope in train_pericopes:
            train_indices.extend(pericope_to_indices[pericope])

        return {
            'train': sorted(train_indices),
            'test': sorted(test_indices),
            'train_pericopes': list(train_pericopes),
            'test_pericopes': list(test_pericopes),
            'seed': self.seed
        }


class DatasetArtifact:
    """A versioned, content-addressed dataset artifact."""

    def __init__(self, name: str, data: Dict, splits: Dict):
        self.name = name
        self.data = data
        self.splits = splits
        self.content_hash = compute_content_hash({
            'data': data,
            'splits': splits
        })
        self.created_at = datetime.now().isoformat()

    def save(self, output_dir: str = '/Users/royvaid/Downloads/logos/data'):
        """Save artifact to disk with content-addressed filename."""
        Path(output_dir).mkdir(parents=True, exist_ok=True)

        base_name = f"{self.name}_{self.content_hash}"

        # Save pickle (full artifact)
        pkl_path = os.path.join(output_dir, f"{base_name}.pkl")
        with open(pkl_path, 'wb') as f:
            pickle.dump({
                'name': self.name,
                'data': self.data,
                'splits': self.splits,
                'content_hash': self.content_hash,
                'created_at': self.created_at
            }, f)

        # Save splits as JSON (for inspection)
        splits_path = os.path.join(output_dir, f"{base_name}_splits.json")
        with open(splits_path, 'w') as f:
            json.dump(self.splits, f, indent=2)

        # Save metadata
        meta_path = os.path.join(output_dir, f"{base_name}_meta.json")
        with open(meta_path, 'w') as f:
            json.dump({
                'name': self.name,
                'content_hash': self.content_hash,
                'created_at': self.created_at,
                'n_samples': len(self.data.get('q_passages', []) or []) +
                            len(self.data.get('mark_passages', []) or []),
                'feature_version': self.data.get('feature_version')
            }, f, indent=2)

        print(f"Dataset artifact saved:")
        print(f"  {pkl_path}")
        print(f"  {splits_path}")
        print(f"  {meta_path}")

        return pkl_path

    @classmethod
    def load(cls, path: str) -> 'DatasetArtifact':
        """Load artifact from disk."""
        with open(path, 'rb') as f:
            data = pickle.load(f)

        artifact = cls(
            name=data['name'],
            data=data['data'],
            splits=data['splits']
        )
        artifact.content_hash = data['content_hash']
        artifact.created_at = data['created_at']

        return artifact


async def build_all_datasets(
    seed: int = 42,
    output_dir: str = '/Users/royvaid/Downloads/logos/data'
) -> Dict[str, str]:
    """Build all canonical datasets and save as artifacts."""
    print("=" * 70)
    print("CANONICAL DATASET BUILDER")
    print("=" * 70)

    pool = await asyncpg.create_pool(DATABASE_URL)
    builder = CanonicalDatasetBuilder(pool, seed=seed)

    artifacts = {}

    try:
        # Build synoptic dataset
        print("\n1. Building synoptic dataset...")
        synoptic_data = await builder.build_synoptic_dataset()

        # Combine Q and Mark for classification
        all_passages = synoptic_data['q_passages'] + synoptic_data['mark_passages']

        # Create pericope-level splits (prevents leakage)
        pericope_splits = builder.create_pericope_splits(
            synoptic_data['q_passages'],
            test_pericope_ratio=0.2
        )

        # Create passage-level splits for Mark benchmark
        passage_splits = builder.create_frozen_splits(
            all_passages,
            test_ratio=0.2,
            val_ratio=0.1
        )

        synoptic_artifact = DatasetArtifact(
            name='synoptic_canonical',
            data=synoptic_data,
            splits={
                'pericope_splits': pericope_splits,
                'passage_splits': passage_splits
            }
        )
        artifacts['synoptic'] = synoptic_artifact.save(output_dir)

        # Build Thomas dataset
        print("\n2. Building Thomas dataset...")
        thomas_data = await builder.build_thomas_dataset()

        thomas_splits = builder.create_frozen_splits(
            thomas_data['logia'],
            test_ratio=0.3
        )

        thomas_artifact = DatasetArtifact(
            name='thomas_canonical',
            data=thomas_data,
            splits=thomas_splits
        )
        artifacts['thomas'] = thomas_artifact.save(output_dir)

        # Summary
        print("\n" + "=" * 70)
        print("DATASET BUILD COMPLETE")
        print("=" * 70)
        print(f"Synoptic: {len(synoptic_data['q_passages'])} Q + {len(synoptic_data['mark_passages'])} Mark")
        print(f"Thomas: {len(thomas_data['logia'])} logia")
        print(f"Seed: {seed}")
        print(f"Feature version: {FEATURE_VERSION}")

    finally:
        await pool.close()

    return artifacts


async def main():
    """Build all canonical datasets."""
    artifacts = await build_all_datasets(seed=42)
    print("\nArtifacts created:")
    for name, path in artifacts.items():
        print(f"  {name}: {path}")


if __name__ == "__main__":
    asyncio.run(main())
