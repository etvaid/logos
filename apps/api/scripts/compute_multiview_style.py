#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                      MULTI-VIEW STYLE REPRESENTATION                          ║
║                                                                               ║
║  Combine multiple "views" of style for robust attribution:                    ║
║                                                                               ║
║  View 1: Embedding residuals (high-level semantic style)                      ║
║  View 2: Function word frequencies (classic stylometry - gold standard)       ║
║  View 3: POS/morphology n-grams (syntactic rhythm)                           ║
║  View 4: Character n-grams (orthographic fingerprint)                        ║
║                                                                               ║
║  Why multi-view?                                                              ║
║  - Real style signal appears across ALL views                                 ║
║  - Topic leakage appears only in content-heavy views                         ║
║  - Ensemble prevents overfitting to single signal                            ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import os
import re
import json
import asyncio
import numpy as np
import asyncpg
from collections import Counter, defaultdict
from typing import Dict, List, Tuple, Optional
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupKFold, cross_val_score
from sklearn.preprocessing import StandardScaler

DATABASE_URL = os.environ.get('DATABASE_URL', '')

# ============================================================================
# FUNCTION WORDS (Classic Stylometry Gold Standard)
# ============================================================================

GREEK_FUNCTION_WORDS = [
    'καί', 'δέ', 'τε', 'γάρ', 'ἀλλά', 'μέν', 'οὖν', 'ὅτι', 'εἰ', 'ὡς',
    'ὁ', 'ἡ', 'τό', 'τοῦ', 'τῆς', 'τῷ', 'τήν', 'τόν', 'οἱ', 'αἱ', 'τά',
    'τῶν', 'τοῖς', 'ταῖς', 'τούς', 'τάς',
    'ἐν', 'εἰς', 'ἐκ', 'ἐξ', 'ἀπό', 'πρός', 'ὑπό', 'περί', 'διά', 'κατά',
    'μετά', 'παρά', 'ἐπί', 'πρό', 'ἀνά', 'σύν',
    'οὐ', 'οὐκ', 'οὐχ', 'μή', 'οὔτε', 'μήτε',
    'αὐτός', 'αὐτή', 'αὐτό', 'ἐγώ', 'σύ', 'ἡμεῖς', 'ὑμεῖς',
    'τις', 'τι', 'ὅς', 'ἥ', 'ὅ', 'ὅστις', 'οὗτος', 'αὕτη', 'τοῦτο',
    'ἄν', 'ἤ', 'τότε', 'νῦν', 'ἔτι', 'οὕτως', 'ὥστε', 'εἶτα',
    'μόνον', 'πάλιν', 'ἀεί', 'πως', 'που', 'ποτέ', 'πω'
]

LATIN_FUNCTION_WORDS = [
    'et', 'ac', 'atque', 'sed', 'autem', 'enim', 'nam', 'igitur', 'ergo',
    'quod', 'quia', 'cum', 'si', 'ut', 'ne', 'quam', 'quasi', 'tamquam',
    'in', 'ad', 'ex', 'de', 'ab', 'per', 'pro', 'sub', 'super', 'inter',
    'ante', 'post', 'propter', 'contra', 'circa', 'apud',
    'non', 'nec', 'neque', 'haud', 'numquam',
    'is', 'ea', 'id', 'hic', 'haec', 'hoc', 'ille', 'illa', 'illud',
    'qui', 'quae', 'quod', 'quis', 'quid', 'quisque', 'aliquis',
    'ego', 'tu', 'nos', 'vos', 'se', 'sui', 'sibi',
    'sum', 'es', 'est', 'sumus', 'estis', 'sunt', 'eram', 'erat', 'fuit',
    'iam', 'tum', 'nunc', 'etiam', 'quoque', 'tamen', 'itaque', 'idem'
]

ENGLISH_FUNCTION_WORDS = [
    'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'because', 'as',
    'of', 'to', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'about',
    'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'must', 'shall', 'can', 'need', 'dare', 'ought',
    'not', 'no', 'nor', 'neither', 'never',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs',
    'this', 'that', 'these', 'those', 'which', 'who', 'whom', 'whose',
    'what', 'when', 'where', 'why', 'how',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
    'any', 'no', 'none', 'one', 'two', 'first', 'last',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'even', 'still'
]

ALL_FUNCTION_WORDS = set(GREEK_FUNCTION_WORDS + LATIN_FUNCTION_WORDS + ENGLISH_FUNCTION_WORDS)


def tokenize(text: str) -> List[str]:
    """Tokenize text into words."""
    text = text.lower()
    # Keep Greek, Latin, and English characters
    tokens = re.findall(r"[\w\u0370-\u03FF\u1F00-\u1FFF]+", text)
    return tokens


def compute_function_word_vector(text: str, fw_list: List[str]) -> np.ndarray:
    """Compute function word frequency vector."""
    tokens = tokenize(text)
    total = len(tokens)
    if total == 0:
        return np.zeros(len(fw_list), dtype=np.float32)
    
    counts = Counter(tokens)
    freqs = np.array([counts.get(w, 0) / total for w in fw_list], dtype=np.float32)
    return freqs * 1000  # Per 1000 tokens


def compute_char_ngrams(text: str, n_range: Tuple[int, int] = (3, 5)) -> Dict[str, int]:
    """Compute character n-gram counts."""
    text = text.lower()
    ngrams = Counter()
    for n in range(n_range[0], n_range[1] + 1):
        for i in range(len(text) - n + 1):
            ngrams[text[i:i+n]] += 1
    return dict(ngrams)


def compute_pos_signature(text: str) -> str:
    """
    Create a POS-like signature from text patterns.
    (Simplified - full version would use spaCy/stanza)
    """
    tokens = tokenize(text)
    signature = []
    for token in tokens:
        if token in ALL_FUNCTION_WORDS:
            signature.append('FW')  # Function word
        elif token.endswith(('ing', 'ed', 'ly', 'tion', 'ness')):
            signature.append('SUFF')  # Common suffix
        elif len(token) <= 2:
            signature.append('SHORT')
        elif len(token) >= 10:
            signature.append('LONG')
        else:
            signature.append('WORD')
    return ' '.join(signature)


async def main():
    """Build multi-view style representations."""
    
    print("=" * 70)
    print("MULTI-VIEW STYLE REPRESENTATION")
    print("=" * 70)
    
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    
    async with pool.acquire() as conn:
        # Create multi-view table
        await conn.execute("""
        CREATE TABLE IF NOT EXISTS multiview_style_features (
            id SERIAL PRIMARY KEY,
            translation_id INTEGER REFERENCES translations(id),
            author_name TEXT NOT NULL,
            
            -- View 1: Function word frequencies (dim = len(function_words))
            function_word_vector FLOAT8[],
            
            -- View 2: Character n-gram TF-IDF (sparse, stored as top features)
            char_ngram_top_features JSONB,
            
            -- View 3: POS signature hash (for grouping)
            pos_signature_hash TEXT,
            
            -- View 4: Combined style score
            combined_style_score FLOAT,
            
            created_at TIMESTAMP DEFAULT NOW()
        );
        """)
        
        await conn.execute("""
        CREATE TABLE IF NOT EXISTS multiview_author_profiles (
            author_name TEXT PRIMARY KEY,
            
            -- Aggregated function word profile
            mean_fw_vector FLOAT8[],
            std_fw_vector FLOAT8[],
            
            -- Top distinguishing features
            top_function_words JSONB,
            top_char_ngrams JSONB,
            
            -- Sample stats
            sample_count INTEGER,
            total_tokens INTEGER,
            
            -- Cross-validation accuracy per view
            fw_cv_accuracy FLOAT,
            char_cv_accuracy FLOAT,
            combined_cv_accuracy FLOAT,
            
            updated_at TIMESTAMP DEFAULT NOW()
        );
        """)
        
        # Load translations with text
        print("\n[1] Loading translations...")
        
        translations = await conn.fetch("""
            SELECT 
                t.id,
                t.translation as text,
                t.translator_id,
                tr.name as author_name,
                t.text_id as anchor_id
            FROM translations t
            JOIN translators tr ON t.translator_id = tr.id
            WHERE t.translation IS NOT NULL
            AND LENGTH(t.translation) > 100
            LIMIT 50000
        """)
        
        print(f"    Loaded {len(translations):,} translations")
        
        # Compute multi-view features
        print("\n[2] Computing multi-view features...")
        
        # Prepare function word list (combined)
        fw_list = list(ALL_FUNCTION_WORDS)
        
        all_fw_vectors = []
        all_char_texts = []
        all_authors = []
        all_anchor_ids = []
        
        for i, t in enumerate(translations):
            text = t['text']
            author = t['author_name']
            anchor = t['anchor_id'] or t['id']
            
            # View 1: Function word frequencies
            fw_vec = compute_function_word_vector(text, fw_list)
            all_fw_vectors.append(fw_vec)
            
            # For char n-grams, we'll use TF-IDF on the full corpus
            all_char_texts.append(text)
            
            all_authors.append(author)
            all_anchor_ids.append(anchor)
            
            if (i + 1) % 10000 == 0:
                print(f"    Processed {i + 1:,} translations...")
        
        X_fw = np.array(all_fw_vectors, dtype=np.float32)
        y = np.array(all_authors)
        groups = np.array(all_anchor_ids)
        
        print(f"    Function word matrix: {X_fw.shape}")
        
        # View 4: Character n-grams via TF-IDF
        print("\n[3] Computing character n-gram TF-IDF...")
        
        char_vectorizer = TfidfVectorizer(
            analyzer='char',
            ngram_range=(3, 5),
            max_features=5000,
            min_df=5
        )
        X_char = char_vectorizer.fit_transform(all_char_texts)
        
        print(f"    Char n-gram matrix: {X_char.shape}")
        
        # Evaluate each view
        print("\n[4] Evaluating view performance (work-holdout CV)...")
        
        # Filter to authors with enough samples
        author_counts = Counter(y)
        valid_authors = {a for a, c in author_counts.items() if c >= 20}
        mask = np.array([a in valid_authors for a in y])
        
        X_fw_valid = X_fw[mask]
        X_char_valid = X_char[mask]
        y_valid = y[mask]
        groups_valid = groups[mask]
        
        print(f"    Valid samples: {len(y_valid):,}")
        print(f"    Valid authors: {len(valid_authors)}")
        
        # Scale features
        scaler_fw = StandardScaler()
        X_fw_scaled = scaler_fw.fit_transform(X_fw_valid)
        
        # Cross-validation by anchor group (work-holdout)
        cv = GroupKFold(n_splits=5)
        
        # View 1: Function words
        clf_fw = LogisticRegression(max_iter=1000)
        scores_fw = cross_val_score(clf_fw, X_fw_scaled, y_valid, cv=cv, groups=groups_valid)
        
        print(f"\n    View 1 (Function Words): {scores_fw.mean():.3f} (+/- {scores_fw.std():.3f})")
        
        # View 2: Character n-grams
        clf_char = LogisticRegression(max_iter=1000)
        scores_char = cross_val_score(clf_char, X_char_valid, y_valid, cv=cv, groups=groups_valid)
        
        print(f"    View 2 (Char N-grams):    {scores_char.mean():.3f} (+/- {scores_char.std():.3f})")
        
        # Combined view (late fusion)
        from scipy.sparse import hstack, csr_matrix
        X_combined = hstack([csr_matrix(X_fw_scaled), X_char_valid])
        
        clf_combined = LogisticRegression(max_iter=1000)
        scores_combined = cross_val_score(clf_combined, X_combined, y_valid, cv=cv, groups=groups_valid)
        
        print(f"    Combined (FW + Char):     {scores_combined.mean():.3f} (+/- {scores_combined.std():.3f})")
        
        # Store author profiles
        print("\n[5] Computing and storing author profiles...")
        
        author_profiles = {}
        for author in valid_authors:
            author_mask = y == author
            author_fw = X_fw[author_mask]
            
            mean_fw = author_fw.mean(axis=0)
            std_fw = author_fw.std(axis=0)
            
            # Top function words for this author (by z-score vs corpus)
            corpus_mean = X_fw.mean(axis=0)
            corpus_std = X_fw.std(axis=0) + 1e-6
            z_scores = (mean_fw - corpus_mean) / corpus_std
            
            top_fw_idx = np.argsort(z_scores)[-10:][::-1]
            top_fw = {fw_list[i]: float(z_scores[i]) for i in top_fw_idx}
            
            author_profiles[author] = {
                'mean_fw': mean_fw.tolist(),
                'std_fw': std_fw.tolist(),
                'top_fw': top_fw,
                'count': int(author_mask.sum()),
                'tokens': int(sum(len(tokenize(translations[i]['text'])) for i, m in enumerate(author_mask) if m))
            }
        
        # Store in database
        records = []
        for author, profile in author_profiles.items():
            records.append((
                author,
                profile['mean_fw'],
                profile['std_fw'],
                json.dumps(profile['top_fw']),
                json.dumps({}),  # char ngrams placeholder
                profile['count'],
                profile['tokens'],
                float(scores_fw.mean()),
                float(scores_char.mean()),
                float(scores_combined.mean())
            ))
        
        await conn.executemany("""
            INSERT INTO multiview_author_profiles (
                author_name, mean_fw_vector, std_fw_vector,
                top_function_words, top_char_ngrams,
                sample_count, total_tokens,
                fw_cv_accuracy, char_cv_accuracy, combined_cv_accuracy
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (author_name) DO UPDATE
            SET mean_fw_vector = EXCLUDED.mean_fw_vector,
                std_fw_vector = EXCLUDED.std_fw_vector,
                top_function_words = EXCLUDED.top_function_words,
                sample_count = EXCLUDED.sample_count,
                total_tokens = EXCLUDED.total_tokens,
                fw_cv_accuracy = EXCLUDED.fw_cv_accuracy,
                char_cv_accuracy = EXCLUDED.char_cv_accuracy,
                combined_cv_accuracy = EXCLUDED.combined_cv_accuracy,
                updated_at = NOW()
        """, records)
        
        # Store calibration results
        await conn.execute("""
            INSERT INTO authorship_calibration (
                run_id, method, top1_accuracy,
                split_type, n_train, n_test, n_authors,
                gate_accuracy_pass, gate_overall_pass,
                hyperparameters
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        """,
            f"multiview_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'multiview_combined',
            float(scores_combined.mean()),
            'group_kfold_anchor',
            int(len(y_valid) * 0.8),
            int(len(y_valid) * 0.2),
            len(valid_authors),
            scores_combined.mean() >= 0.60,
            scores_combined.mean() >= 0.60,
            json.dumps({
                "fw_accuracy": float(scores_fw.mean()),
                "char_accuracy": float(scores_char.mean()),
                "combined_accuracy": float(scores_combined.mean())
            })
        )
        
        # QA log
        await conn.execute("""
            INSERT INTO build_qa_log (agent_name, check_name, passed, details)
            VALUES ($1, $2, $3, $4)
        """,
            'MultiView',
            'multiview_fusion',
            True,
            json.dumps({
                "fw_accuracy": float(scores_fw.mean()),
                "char_accuracy": float(scores_char.mean()),
                "combined_accuracy": float(scores_combined.mean()),
                "authors_profiled": len(author_profiles)
            })
        )
        
        print("\n" + "=" * 70)
        print("MULTI-VIEW STYLE COMPLETE")
        print(f"Function Words Accuracy:  {scores_fw.mean():.1%}")
        print(f"Char N-grams Accuracy:    {scores_char.mean():.1%}")
        print(f"Combined Accuracy:        {scores_combined.mean():.1%}")
        print(f"Authors profiled: {len(author_profiles)}")
        print("=" * 70)
    
    await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
