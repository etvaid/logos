#!/usr/bin/env python3
"""
PURE STYLE FALSIFICATION - Function Words Only

Test if pure function word frequencies pass the label permutation test.
Function words (the, a, of, to, etc.) are content-independent.
"""

import asyncio
import asyncpg
import numpy as np
import json
import os
import re
from collections import Counter
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupKFold, StratifiedKFold
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ['DATABASE_URL']

# Pure function words - no content words
FUNCTION_WORDS = [
    'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'as',
    'of', 'to', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'not', 'no', 'nor', 'never',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'its', 'our', 'their', 'this', 'that', 'these', 'those',
    'which', 'who', 'whom', 'what', 'when', 'where', 'why', 'how',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
    'so', 'than', 'too', 'very', 'just', 'also', 'even', 'still', 'only'
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
    print("PURE STYLE FALSIFICATION - Function Words Only")
    print("=" * 70)

    conn = await asyncpg.connect(DATABASE_URL)

    # Load data
    print("\n[1] Loading text data...")
    rows = await conn.fetch("""
        SELECT t.id, t.translation as text, tr.name as translator_name,
               COALESCE(t.text_id::text, t.id::text) as anchor_id
        FROM translations t
        JOIN translators tr ON t.translator_id = tr.id
        WHERE t.translation IS NOT NULL
        AND LENGTH(t.translation) > 100
    """)

    texts = []
    authors = []
    anchors = []

    for r in rows:
        texts.append(r['text'])
        authors.append(r['translator_name'])
        anchors.append(r['anchor_id'])

    # Filter to valid authors
    author_counts = Counter(authors)
    print(f"\nAuthor distribution:")
    for a, c in sorted(author_counts.items(), key=lambda x: -x[1]):
        print(f"    {a}: {c}")

    valid = {a for a, c in author_counts.items() if c >= 100}
    mask = [a in valid for a in authors]

    texts = [t for t, m in zip(texts, mask) if m]
    authors = np.array([a for a, m in zip(authors, mask) if m])
    anchors = np.array([a for a, m in zip(anchors, mask) if m])

    print(f"\nAfter filtering: {len(texts)} samples, {len(set(authors))} authors")

    # Compute ONLY function word features
    print("\n[2] Computing pure function word features...")
    X = np.array([compute_fw_vector(t, FUNCTION_WORDS) for t in texts])

    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    print(f"    Feature matrix: {X.shape}")

    # Balance dataset for fair test
    print("\n[3] Balancing dataset...")
    min_samples = min(author_counts[a] for a in set(authors))
    min_samples = min(min_samples, 500)  # Cap at 500 per author

    balanced_idx = []
    for author in set(authors):
        author_idx = np.where(authors == author)[0]
        np.random.seed(42)
        selected = np.random.choice(author_idx, size=min(len(author_idx), min_samples), replace=False)
        balanced_idx.extend(selected)

    balanced_idx = np.array(balanced_idx)
    np.random.shuffle(balanced_idx)

    X_bal = X[balanced_idx]
    y_bal = authors[balanced_idx]
    groups_bal = anchors[balanced_idx]

    print(f"    Balanced: {len(X_bal)} samples, {len(set(y_bal))} authors")
    print(f"    ~{len(X_bal) // len(set(y_bal))} samples per author")

    # ========== TEST 1: Real Labels ==========
    print("\n[4] Testing with REAL labels...")

    gkf = GroupKFold(n_splits=5)
    real_accs = []
    for tr, te in gkf.split(X_bal, y_bal, groups=groups_bal):
        clf = LogisticRegression(max_iter=500, C=0.1)
        clf.fit(X_bal[tr], y_bal[tr])
        real_accs.append(accuracy_score(y_bal[te], clf.predict(X_bal[te])))

    real_acc = np.mean(real_accs)
    print(f"    Real accuracy: {real_acc:.3f} (+/- {np.std(real_accs):.3f})")

    # ========== TEST 2: Permuted Labels ==========
    print("\n[5] Testing with PERMUTED labels...")

    perm_accs = []
    for seed in range(10):  # Multiple permutations
        np.random.seed(seed)
        y_perm = np.random.permutation(y_bal)

        for tr, te in gkf.split(X_bal, y_perm, groups=groups_bal):
            clf = LogisticRegression(max_iter=500, C=0.1)
            clf.fit(X_bal[tr], y_perm[tr])
            perm_accs.append(accuracy_score(y_perm[te], clf.predict(X_bal[te])))

    perm_acc = np.mean(perm_accs)
    print(f"    Permuted accuracy: {perm_acc:.3f} (+/- {np.std(perm_accs):.3f})")

    chance = 1.0 / len(set(y_bal))
    print(f"    Chance level: {chance:.3f}")

    # ========== TEST 3: Same-Anchor Test ==========
    print("\n[6] Same-Anchor (Topic-Matched) Test...")

    # Find anchors with multiple authors
    anchor_to_authors = {}
    for i, (anc, auth) in enumerate(zip(groups_bal, y_bal)):
        if anc not in anchor_to_authors:
            anchor_to_authors[anc] = set()
        anchor_to_authors[anc].add(auth)

    multi_author_anchors = [anc for anc, auths in anchor_to_authors.items() if len(auths) >= 2]
    print(f"    Anchors with 2+ authors: {len(multi_author_anchors)}")

    # Sample pairs from same anchor
    same_anchor_pairs = []
    for anc in multi_author_anchors:
        anc_mask = groups_bal == anc
        anc_idx = np.where(anc_mask)[0]

        auths_in_anc = y_bal[anc_idx]
        unique_auths = list(set(auths_in_anc))

        if len(unique_auths) >= 2:
            for i in range(len(anc_idx)):
                for j in range(i+1, len(anc_idx)):
                    if y_bal[anc_idx[i]] != y_bal[anc_idx[j]]:
                        same_anchor_pairs.append((anc_idx[i], anc_idx[j]))

    if same_anchor_pairs:
        # Test distinguishability within same anchor
        correct = 0
        total = 0
        for i, j in same_anchor_pairs[:200]:  # Sample
            # Simple: which one is closer to its author centroid?
            auth_i = y_bal[i]
            auth_j = y_bal[j]

            # Get centroids
            cent_i = X_bal[y_bal == auth_i].mean(axis=0)
            cent_j = X_bal[y_bal == auth_j].mean(axis=0)

            # Distances
            dist_i_to_i = np.linalg.norm(X_bal[i] - cent_i)
            dist_i_to_j = np.linalg.norm(X_bal[i] - cent_j)
            dist_j_to_j = np.linalg.norm(X_bal[j] - cent_j)
            dist_j_to_i = np.linalg.norm(X_bal[j] - cent_i)

            # Correct if each is closer to its own centroid
            if dist_i_to_i < dist_i_to_j and dist_j_to_j < dist_j_to_i:
                correct += 1
            total += 1

        same_anchor_acc = correct / total if total > 0 else 0
        print(f"    Same-anchor distinguishability: {same_anchor_acc:.3f} ({total} pairs)")

    # ========== Summary ==========
    print("\n" + "=" * 70)
    print("PURE STYLE TEST SUMMARY")
    print("=" * 70)

    label_perm_passed = perm_acc < (chance + 0.10)

    print(f"\n  Real accuracy:      {real_acc:.1%}")
    print(f"  Permuted accuracy:  {perm_acc:.1%}")
    print(f"  Chance level:       {chance:.1%}")
    print(f"\n  Label Permutation Test: {'PASS' if label_perm_passed else 'FAIL'}")

    if label_perm_passed:
        print("\n  Function words alone capture GENUINE style signal!")
        print("  Permuted labels give near-chance accuracy.")
    else:
        diff = perm_acc - chance
        print(f"\n  Permuted accuracy {diff:.1%} above chance.")
        print("  Possible causes:")
        print("    - Anchor (content) patterns still influencing results")
        print("    - Class imbalance effects")
        print("    - Need stricter anchor-based CV")

    # Store results
    await conn.execute("""
        INSERT INTO build_qa_log (agent_name, check_name, passed, details)
        VALUES ($1, $2, $3, $4)
    """,
        'PureStyleTest',
        'function_words_only',
        bool(label_perm_passed),
        json.dumps({
            'real_accuracy': float(real_acc),
            'permuted_accuracy': float(perm_acc),
            'chance': float(chance),
            'n_samples': len(X_bal),
            'n_authors': len(set(y_bal)),
            'features': 'function_words_only'
        })
    )

    await conn.close()
    print("\nPure style test complete!")

if __name__ == "__main__":
    asyncio.run(main())
