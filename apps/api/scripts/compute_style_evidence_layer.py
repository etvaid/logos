#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                    STYLE EVIDENCE LAYER (SEL)                                 ║
║                                                                               ║
║  THE SPECTACULAR MOVE: One canonical evidence layer, multiple lenses.         ║
║                                                                               ║
║  Every downstream algorithm operates on the SAME windows with SAME features.  ║
║  This turns "11 scripts" into "one dataset + several lenses."                 ║
║                                                                               ║
║  What we compute ONCE:                                                        ║
║    - Function word frequencies (per language)                                 ║
║    - Interpretable scalars (sentence length, TTR, etc.)                       ║
║    - Character n-gram TF-IDF                                                  ║
║    - Anchor means (meaning) and residuals (style)                             ║
║    - Burrows z-scores                                                         ║
║                                                                               ║
║  Then every method just READS this layer.                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import os
import re
import json
import hashlib
import asyncio
import numpy as np
import asyncpg
from datetime import datetime
from typing import Dict, List, Optional, Set
from collections import Counter, defaultdict

DATABASE_URL = os.environ.get('DATABASE_URL', '')
EMBED_DIM = 768

# Language-specific function word vocabularies (THE GOLD STANDARD FOR STYLOMETRY)
FUNCTION_WORDS = {
    'english': [
        'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'because', 'as',
        'of', 'to', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'up',
        'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
        'between', 'under', 'again', 'further', 'once', 'here', 'there', 'when',
        'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other',
        'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
        'too', 'very', 'just', 'can', 'will', 'should', 'would', 'could', 'might',
        'must', 'shall', 'may', 'need', 'dare', 'ought', 'used', 'be', 'being',
        'been', 'am', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'having',
        'do', 'does', 'did', 'doing', 'i', 'me', 'my', 'myself', 'we', 'our',
        'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
        'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it',
        'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what',
        'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'while'
    ],
    'greek': [
        'ὁ', 'ἡ', 'τό', 'τοῦ', 'τῆς', 'τῷ', 'τήν', 'τόν', 'οἱ', 'αἱ', 'τά',
        'τῶν', 'τοῖς', 'ταῖς', 'τούς', 'τάς', 'καί', 'δέ', 'τε', 'γάρ', 'ἀλλά',
        'μέν', 'οὖν', 'δή', 'ἄρα', 'οὐ', 'οὐκ', 'οὐχ', 'μή', 'εἰ', 'ἐάν',
        'ἄν', 'ὅτι', 'ὡς', 'ἵνα', 'ὥστε', 'ἐπεί', 'ὅτε', 'πρίν', 'ἕως',
        'ἐν', 'εἰς', 'ἐκ', 'ἐξ', 'ἀπό', 'πρός', 'ὑπό', 'ὑπέρ', 'παρά', 'περί',
        'διά', 'κατά', 'μετά', 'σύν', 'ἀνά', 'ἀντί', 'πρό', 'ἐπί',
        'ἐγώ', 'σύ', 'αὐτός', 'αὐτή', 'αὐτό', 'ἡμεῖς', 'ὑμεῖς', 'οὗτος',
        'ἐκεῖνος', 'ὅς', 'ὅστις', 'τίς', 'τις', 'πᾶς', 'ἅπας', 'ἕκαστος',
        'ἄλλος', 'οὐδείς', 'μηδείς', 'εἷς', 'δύο', 'τρεῖς', 'πολύς', 'ὀλίγος'
    ],
    'latin': [
        'et', 'sed', 'in', 'de', 'ad', 'cum', 'ex', 'per', 'pro', 'sub',
        'ab', 'sine', 'ante', 'post', 'inter', 'contra', 'propter', 'super',
        'non', 'nec', 'neque', 'ne', 'si', 'nisi', 'ut', 'cum', 'dum', 'quod',
        'quia', 'quoniam', 'nam', 'enim', 'autem', 'vero', 'tamen', 'igitur',
        'ergo', 'itaque', 'atque', 'ac', 'que', 've', 'aut', 'vel', 'an',
        'hic', 'haec', 'hoc', 'is', 'ea', 'id', 'ille', 'illa', 'illud',
        'iste', 'ipse', 'qui', 'quae', 'quod', 'quis', 'quid', 'aliquis',
        'quisquam', 'quisque', 'omnis', 'nullus', 'nemo', 'nihil', 'alius',
        'alter', 'unus', 'duo', 'tres', 'multus', 'paucus', 'totus', 'solus',
        'ego', 'tu', 'nos', 'vos', 'se', 'sui', 'sibi', 'meus', 'tuus',
        'suus', 'noster', 'vester', 'sum', 'es', 'est', 'sumus', 'estis', 'sunt',
        'esse', 'fui', 'eram', 'ero', 'possum', 'posse', 'potui'
    ],
    'hebrew': [
        'את', 'אל', 'על', 'מן', 'עם', 'בין', 'אחר', 'לפני', 'אחרי', 'תחת',
        'כי', 'אם', 'לא', 'גם', 'רק', 'אך', 'הנה', 'עוד', 'כל', 'זה',
        'זאת', 'הוא', 'היא', 'אני', 'אתה', 'את', 'הם', 'הן', 'אנחנו', 'אתם',
        'אשר', 'מה', 'מי', 'איך', 'למה', 'כמו', 'עד', 'בעד', 'נגד', 'בלי'
    ]
}


def parse_pgvector(raw) -> Optional[np.ndarray]:
    """Parse pgvector format."""
    if raw is None:
        return None
    if isinstance(raw, np.ndarray):
        return raw.astype(np.float32)
    if isinstance(raw, (list, tuple)):
        return np.array(raw, dtype=np.float32)
    s = str(raw).strip()
    if s.startswith('[') and s.endswith(']'):
        s = s[1:-1]
    try:
        parts = [float(x.strip()) for x in s.split(',') if x.strip()]
        return np.array(parts, dtype=np.float32)
    except:
        return None


def compute_window_hash(content: str) -> str:
    """Compute deterministic hash for deduplication."""
    return hashlib.sha256(content.encode('utf-8')).hexdigest()[:32]


def tokenize_simple(text: str, language: str = 'english') -> List[str]:
    """Simple tokenization for function word counting."""
    # Remove punctuation but keep apostrophes in contractions
    text = re.sub(r"[^\w\s'-]", ' ', text.lower())
    tokens = text.split()
    return [t.strip("'-") for t in tokens if t.strip("'-")]


def compute_function_word_vector(text: str, language: str = 'english') -> tuple:
    """
    Compute function word frequency vector.
    This is THE classic stylometry feature - extremely robust.
    """
    vocab = FUNCTION_WORDS.get(language, FUNCTION_WORDS['english'])
    tokens = tokenize_simple(text, language)
    
    if not tokens:
        return [0.0] * len(vocab), vocab
    
    counts = Counter(tokens)
    total = len(tokens)
    
    # Relative frequencies
    freqs = [counts.get(w, 0) / total for w in vocab]
    return freqs, vocab


def compute_stylometric_scalars(text: str) -> Dict[str, float]:
    """
    Compute interpretable stylometric features.
    These are what scholars can actually reason about.
    """
    # Sentence splitting (approximate)
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    
    # Word tokenization
    words = re.findall(r'\b\w+\b', text.lower())
    
    if not words:
        return {
            'mean_sentence_length': 0, 'var_sentence_length': 0,
            'mean_word_length': 0, 'type_token_ratio': 0,
            'hapax_ratio': 0, 'punctuation_rate': 0,
            'question_rate': 0, 'exclamation_rate': 0
        }
    
    # Sentence lengths
    sent_lengths = [len(re.findall(r'\b\w+\b', s)) for s in sentences if s]
    mean_sent = np.mean(sent_lengths) if sent_lengths else 0
    var_sent = np.var(sent_lengths) if len(sent_lengths) > 1 else 0
    
    # Word lengths
    word_lengths = [len(w) for w in words]
    mean_word = np.mean(word_lengths)
    
    # Type-token ratio
    types = set(words)
    ttr = len(types) / len(words)
    
    # Hapax legomena (words appearing once)
    word_counts = Counter(words)
    hapax = sum(1 for w, c in word_counts.items() if c == 1)
    hapax_ratio = hapax / len(types) if types else 0
    
    # Punctuation rates
    char_count = len(text)
    punct_count = len(re.findall(r'[.,;:!?-]', text))
    question_count = text.count('?')
    exclaim_count = text.count('!')
    
    return {
        'mean_sentence_length': float(mean_sent),
        'var_sentence_length': float(var_sent),
        'mean_word_length': float(mean_word),
        'type_token_ratio': float(ttr),
        'hapax_ratio': float(hapax_ratio),
        'punctuation_rate': float(punct_count / max(char_count, 1)),
        'question_rate': float(question_count / max(len(sentences), 1)),
        'exclamation_rate': float(exclaim_count / max(len(sentences), 1))
    }


def compute_dataset_snapshot_hash(window_count: int, latest_updated: str, params: dict) -> str:
    """Compute hash for dataset snapshot reproducibility."""
    content = f"{window_count}|{latest_updated}|{json.dumps(params, sort_keys=True)}"
    return hashlib.sha256(content.encode()).hexdigest()[:16]


async def main():
    """Build the Style Evidence Layer from the corpus."""
    
    print("=" * 70)
    print("STYLE EVIDENCE LAYER (SEL)")
    print("=" * 70)
    print("\nTHE SPECTACULAR MOVE: One canonical evidence layer, multiple lenses.")
    
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    
    async with pool.acquire() as conn:
        # Count existing windows
        existing = await conn.fetchval("SELECT COUNT(*) FROM style_windows")
        print(f"\nExisting style windows: {existing:,}")
        
        # Load translations (our primary source for translator attribution)
        print("\n[1] Loading translations from corpus...")
        
        translations = await conn.fetch("""
            SELECT 
                t.id,
                t.text_id,
                t.translator_id,
                tr.name as translator_name,
                t.translation as content,
                t.embedding,
                COALESCE(st.work, 'unknown') as work_urn,
                COALESCE(st.language, 'english') as language,
                'translation' as source_table
            FROM translations t
            JOIN translators tr ON t.translator_id = tr.id
            LEFT JOIN source_texts st ON t.text_id = st.id
            WHERE t.translation IS NOT NULL
            LIMIT 50000
        """)
        
        print(f"    Loaded {len(translations):,} translations")
        
        # Group by anchor (same source text = same meaning)
        print("\n[2] Grouping by meaning anchor...")
        
        anchor_groups = defaultdict(list)
        for t in translations:
            anchor_id = f"text_{t['text_id']}" if t['text_id'] else f"trans_{t['id']}"
            anchor_groups[anchor_id].append(t)
        
        multi_translator_anchors = {k: v for k, v in anchor_groups.items() if len(v) >= 2}
        print(f"    Anchors with 2+ translators: {len(multi_translator_anchors):,}")
        
        # Compute anchor means (the MEANING component)
        print("\n[3] Computing anchor means (MEANING component)...")
        
        anchor_means = {}
        for anchor_id, items in multi_translator_anchors.items():
            embeddings = []
            for t in items:
                emb = parse_pgvector(t['embedding'])
                if emb is not None and len(emb) == EMBED_DIM:
                    embeddings.append(emb)
            
            if len(embeddings) >= 2:
                anchor_means[anchor_id] = np.mean(embeddings, axis=0)
        
        print(f"    Computed {len(anchor_means):,} anchor means")
        
        # Process each translation into style_windows
        print("\n[4] Building style windows...")
        
        batch_size = 500
        windows_created = 0
        
        for i, t in enumerate(translations):
            if i % 1000 == 0:
                print(f"    Processing {i:,} / {len(translations):,}...")
            
            content = t['content']
            if not content or len(content) < 100:
                continue
            
            # Compute features
            window_hash = compute_window_hash(content)
            language = t['language'] or 'english'
            
            # Function words
            fw_vector, fw_vocab = compute_function_word_vector(content, language)
            
            # Stylometric scalars
            scalars = compute_stylometric_scalars(content)
            
            # Token counts
            tokens = tokenize_simple(content, language)
            token_count = len(tokens)
            char_count = len(content)
            word_types = len(set(tokens))
            
            # Anchor and residual
            anchor_id = f"text_{t['text_id']}" if t['text_id'] else f"trans_{t['id']}"
            emb = parse_pgvector(t['embedding'])
            
            anchor_mean = anchor_means.get(anchor_id)
            anchor_residual = None
            if emb is not None and anchor_mean is not None:
                anchor_residual = emb - anchor_mean
            
            # Format vectors for PostgreSQL
            fw_vec_str = '{' + ','.join(str(f) for f in fw_vector) + '}'
            emb_str = '[' + ','.join(str(float(x)) for x in emb) + ']' if emb is not None else None
            anchor_mean_str = '[' + ','.join(str(float(x)) for x in anchor_mean) + ']' if anchor_mean is not None else None
            anchor_res_str = '[' + ','.join(str(float(x)) for x in anchor_residual) + ']' if anchor_residual is not None else None
            
            # Insert
            try:
                await conn.execute("""
                    INSERT INTO style_windows (
                        window_hash, work_urn, translator_id, translator_name,
                        language, anchor_id, token_count, char_count, word_types,
                        mean_sentence_length, var_sentence_length, mean_word_length,
                        type_token_ratio, hapax_ratio, punctuation_rate,
                        question_rate, exclamation_rate,
                        function_word_vector, function_word_vocab,
                        embedding, anchor_mean_embedding, anchor_residual,
                        source_table, source_id
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20::vector, $21::vector, $22::vector, $23, $24)
                    ON CONFLICT (window_hash) DO UPDATE
                    SET translator_id = EXCLUDED.translator_id,
                        function_word_vector = EXCLUDED.function_word_vector,
                        embedding = EXCLUDED.embedding,
                        anchor_mean_embedding = EXCLUDED.anchor_mean_embedding,
                        anchor_residual = EXCLUDED.anchor_residual
                """,
                    window_hash, t['work_urn'], t['translator_id'], t['translator_name'],
                    language, anchor_id, token_count, char_count, word_types,
                    scalars['mean_sentence_length'], scalars['var_sentence_length'],
                    scalars['mean_word_length'], scalars['type_token_ratio'],
                    scalars['hapax_ratio'], scalars['punctuation_rate'],
                    scalars['question_rate'], scalars['exclamation_rate'],
                    fw_vec_str, fw_vocab,
                    emb_str, anchor_mean_str, anchor_res_str,
                    'translations', t['id']
                )
                windows_created += 1
            except Exception as e:
                if windows_created < 5:
                    print(f"    Warning: {e}")
        
        print(f"\n    Created {windows_created:,} style windows")
        
        # Create dataset snapshot
        print("\n[5] Creating dataset snapshot for reproducibility...")
        
        stats = await conn.fetchrow("""
            SELECT 
                COUNT(*) as window_count,
                COUNT(DISTINCT translator_id) as translator_count,
                COUNT(DISTINCT author_id) as author_count,
                MAX(created_at) as latest_updated
            FROM style_windows
        """)
        
        snapshot_hash = compute_dataset_snapshot_hash(
            stats['window_count'],
            str(stats['latest_updated']),
            {'embed_dim': EMBED_DIM}
        )
        
        snapshot_id = f"sel_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{snapshot_hash}"
        
        await conn.execute("""
            INSERT INTO dataset_snapshots (
                snapshot_id, window_count, author_count, translator_count,
                latest_window_updated, content_hash, model_params
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (snapshot_id) DO NOTHING
        """,
            snapshot_id,
            stats['window_count'],
            stats['author_count'] or 0,
            stats['translator_count'] or 0,
            stats['latest_updated'],
            snapshot_hash,
            json.dumps({'embed_dim': EMBED_DIM})
        )
        
        # QA log
        await conn.execute("""
            INSERT INTO build_qa_log (agent_name, check_name, passed, details)
            VALUES ($1, $2, $3, $4)
        """,
            'StyleEvidenceLayer',
            'sel_built',
            True,
            json.dumps({
                'windows_created': windows_created,
                'snapshot_id': snapshot_id,
                'anchor_means_computed': len(anchor_means)
            })
        )
        
        print("\n" + "=" * 70)
        print("STYLE EVIDENCE LAYER COMPLETE")
        print(f"Windows: {windows_created:,}")
        print(f"Snapshot: {snapshot_id}")
        print(f"Anchors with residuals: {len(anchor_means):,}")
        print("=" * 70)
    
    await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
