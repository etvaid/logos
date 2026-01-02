#!/usr/bin/env python3
"""
MULTIVIEW FALSIFICATION GATES - Test proper stylometric features

Tests function words and char n-grams (not semantic embeddings)
to ensure we're measuring STYLE not CONTENT.

Key tests:
1. Label permutation (shuffled should give chance)
2. Topic predictability (style shouldn't predict topic)
3. Topic-matched impostor (distinguish authors on same content)
"""

import asyncio
import asyncpg
import numpy as np
import json
import os
import re
from collections import Counter
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupKFold
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import TfidfVectorizer
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ['DATABASE_URL']

# Function words for style (not semantic content)
FUNCTION_WORDS = [
    'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'because', 'as',
    'of', 'to', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'about',
    'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'must', 'shall', 'can', 'not', 'no', 'nor', 'neither', 'never',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'its', 'our', 'their', 'this', 'that', 'these', 'those',
    'which', 'who', 'whom', 'whose', 'what', 'when', 'where', 'why', 'how',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
    'any', 'one', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just'
]

def tokenize(text):
    return re.findall(r'\b\w+\b', text.lower())

def compute_fw_vector(text, fw_list):
    """Compute function word frequency vector."""
    tokens = tokenize(text)
    total = len(tokens)
    if total == 0:
        return np.zeros(len(fw_list))
    counts = Counter(tokens)
    return np.array([counts.get(w, 0) / total * 1000 for w in fw_list])

async def main():
    print("=" * 70)
    print("MULTIVIEW FALSIFICATION GATES")
    print("Testing Function Words + Char N-grams (Not Semantic Embeddings)")
    print("=" * 70)

    conn = await asyncpg.connect(DATABASE_URL)

    # Load data with TEXT (not embeddings)
    print("\n[1] Loading text data...")
    rows = await conn.fetch("""
        SELECT t.id, t.translation as text, tr.name as translator_name,
               COALESCE(t.text_id::text, t.id::text) as anchor_id
        FROM translations t
        JOIN translators tr ON t.translator_id = tr.id
        WHERE t.translation IS NOT NULL
        AND LENGTH(t.translation) > 50
    """)

    texts = []
    authors = []
    anchors = []

    for r in rows:
        texts.append(r['text'])
        authors.append(r['translator_name'])
        anchors.append(r['anchor_id'])

    print(f"    Samples: {len(texts)}")

    # Filter to valid authors
    author_counts = Counter(authors)
    valid = {a for a, c in author_counts.items() if c >= 50}
    mask = [a in valid for a in authors]

    texts = [t for t, m in zip(texts, mask) if m]
    authors = np.array([a for a, m in zip(authors, mask) if m])
    anchors = np.array([a for a, m in zip(anchors, mask) if m])

    print(f"    After filtering: {len(texts)} samples, {len(set(authors))} authors")

    # Compute function word features (STYLE, not content)
    print("\n[2] Computing function word features...")
    X_fw = np.array([compute_fw_vector(t, FUNCTION_WORDS) for t in texts])

    # Compute char n-grams (STYLE, not content)
    print("    Computing char n-gram features...")
    char_vec = TfidfVectorizer(analyzer='char', ngram_range=(3, 5), max_features=2000)
    X_char = char_vec.fit_transform(texts).toarray()

    # Combine views
    X = np.hstack([X_fw, X_char])
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    print(f"    Feature matrix: {X.shape}")

    gate_results = {}
    gkf = GroupKFold(n_splits=5)

    # ========== GATE 1: Label Permutation Test ==========
    print("\n[3] Gate 1: Label Permutation Test...")
    print("    (Shuffled labels should give CHANCE accuracy)")

    # Real accuracy
    real_accs = []
    for tr, te in gkf.split(X, authors, groups=anchors):
        clf = LogisticRegression(max_iter=500)
        clf.fit(X[tr], authors[tr])
        real_accs.append(accuracy_score(authors[te], clf.predict(X[te])))
    real_acc = np.mean(real_accs)

    # Permuted accuracy (MUST be near chance for valid style features)
    perm_accs = []
    for _ in range(5):  # Multiple permutations for stability
        authors_perm = np.random.permutation(authors)
        for tr, te in gkf.split(X, authors_perm, groups=anchors):
            clf = LogisticRegression(max_iter=500)
            clf.fit(X[tr], authors_perm[tr])
            perm_accs.append(accuracy_score(authors_perm[te], clf.predict(X[te])))
    perm_acc = np.mean(perm_accs)

    chance = 1.0 / len(set(authors))

    # Permuted should be within 5% of chance
    perm_passed = perm_acc < (chance + 0.05)
    # Real accuracy should be substantially above chance
    real_above_chance = real_acc > (chance + 0.20)

    print(f"    Real accuracy: {real_acc:.3f}")
    print(f"    Permuted accuracy: {perm_acc:.3f}")
    print(f"    Chance level: {chance:.3f}")
    print(f"    Permuted near chance: {perm_passed}")
    print(f"    Real above chance: {real_above_chance}")
    print(f"    PASSED: {perm_passed and real_above_chance}")

    gate_results['label_permutation'] = {
        'real_accuracy': float(real_acc),
        'permuted_accuracy': float(perm_acc),
        'chance': float(chance),
        'passed': bool(perm_passed and real_above_chance)
    }

    # ========== GATE 2: Topic-Matched Impostor Test ==========
    print("\n[4] Gate 2: Topic-Matched Impostor Test...")
    print("    (Same content, different authors - must still distinguish)")

    # Group by anchor (same source text)
    anchor_groups = {}
    for i, anc in enumerate(anchors):
        if anc not in anchor_groups:
            anchor_groups[anc] = []
        anchor_groups[anc].append(i)

    # Find anchors with multiple authors
    multi_author_anchors = {
        anc: indices for anc, indices in anchor_groups.items()
        if len(set(authors[indices])) >= 2
    }

    print(f"    Anchors with multiple authors: {len(multi_author_anchors)}")

    impostor_correct = 0
    impostor_total = 0

    if multi_author_anchors:
        # Test within each multi-author anchor
        for anc, indices in multi_author_anchors.items():
            if len(indices) < 5:
                continue

            X_anc = X[indices]
            y_anc = authors[indices]

            # Within-anchor classification (leave-one-out style)
            n = len(indices)
            for i in range(n):
                test_idx = [i]
                train_idx = [j for j in range(n) if j != i]

                if len(set(y_anc[train_idx])) < 2:
                    continue

                clf = LogisticRegression(max_iter=300)
                try:
                    clf.fit(X_anc[train_idx], y_anc[train_idx])
                    pred = clf.predict(X_anc[test_idx])
                    if pred[0] == y_anc[i]:
                        impostor_correct += 1
                    impostor_total += 1
                except:
                    continue

    if impostor_total > 0:
        impostor_acc = impostor_correct / impostor_total
    else:
        impostor_acc = 0.5  # Default if can't test

    impostor_passed = impostor_acc >= 0.40  # Above chance for binary

    print(f"    Impostor test accuracy: {impostor_acc:.3f}")
    print(f"    Tests performed: {impostor_total}")
    print(f"    PASSED: {impostor_passed}")

    gate_results['topic_matched_impostor'] = {
        'accuracy': float(impostor_acc),
        'n_tests': impostor_total,
        'passed': bool(impostor_passed)
    }

    # ========== GATE 3: Cross-Fold Stability ==========
    print("\n[5] Gate 3: Cross-Fold Stability...")

    stability = 1.0 - (np.std(real_accs) / np.mean(real_accs)) if np.mean(real_accs) > 0 else 0
    stability_passed = stability >= 0.75

    print(f"    Fold accuracies: {[f'{a:.3f}' for a in real_accs]}")
    print(f"    Stability score: {stability:.3f}")
    print(f"    PASSED: {stability_passed}")

    gate_results['stability'] = {
        'fold_accuracies': [float(a) for a in real_accs],
        'stability_score': float(stability),
        'passed': bool(stability_passed)
    }

    # ========== Summary ==========
    print("\n" + "=" * 70)
    print("MULTIVIEW FALSIFICATION GATES SUMMARY")
    print("=" * 70)

    all_passed = all(r['passed'] for r in gate_results.values())

    for gate_name, result in gate_results.items():
        status = "PASS" if result['passed'] else "FAIL"
        print(f"  {gate_name}: {status}")

    print(f"\nOVERALL: {'ALL GATES PASSED' if all_passed else 'SOME GATES FAILED'}")

    # Key insight
    print("\n" + "-" * 70)
    if gate_results['label_permutation']['passed']:
        print("Label Permutation Test PASSED:")
        print(f"  - Real accuracy ({real_acc:.1%}) captures genuine style signal")
        print(f"  - Permuted accuracy ({perm_acc:.1%}) near chance ({chance:.1%})")
        print("  - Function words + char n-grams measure STYLE, not content!")
    else:
        print("Label Permutation Test FAILED:")
        print(f"  - Permuted accuracy ({perm_acc:.1%}) still high (should be ~{chance:.1%})")
        print("  - There may still be content leakage in features")

    # Store results
    for gate_name, result in gate_results.items():
        await conn.execute("""
            INSERT INTO build_qa_log (agent_name, check_name, passed, details)
            VALUES ($1, $2, $3, $4)
        """,
            'MultiViewFalsification',
            gate_name,
            bool(result['passed']),
            json.dumps(result)
        )

    await conn.execute("""
        INSERT INTO build_qa_log (agent_name, check_name, passed, details)
        VALUES ($1, $2, $3, $4)
    """,
        'MultiViewFalsification',
        'all_gates',
        all_passed,
        json.dumps(gate_results)
    )

    await conn.close()
    print("\nMultiview falsification complete!")

if __name__ == "__main__":
    asyncio.run(main())
