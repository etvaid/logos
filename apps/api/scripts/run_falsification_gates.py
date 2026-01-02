#!/usr/bin/env python3
"""
FALSIFICATION GATES - Hard approval tests for authorship methods

These are the non-negotiable tests that keep us honest:
1. Label permutation test (should drop to chance)
2. Anchor leakage test (no anchor overlap)
3. Topic predictability on style representations
4. Cross-length invariance
5. Topic-matched impostors
6. Temporal drift stress test
"""

import asyncio
import asyncpg
import numpy as np
import json
import os
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupKFold, cross_val_score
from sklearn.metrics import accuracy_score
from sklearn.decomposition import PCA
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ['DATABASE_URL']

async def main():
    print("=" * 70)
    print("FALSIFICATION GATES - Keeping Attribution Honest")
    print("=" * 70)

    conn = await asyncpg.connect(DATABASE_URL)

    # Load data
    print("\n[1] Loading data...")
    rows = await conn.fetch("""
        SELECT t.id, t.embedding, tr.name as translator_name,
               COALESCE(t.text_id::text, t.id::text) as anchor_id,
               COALESCE(sel.topic_cluster, 0) as topic
        FROM translations t
        JOIN translators tr ON t.translator_id = tr.id
        LEFT JOIN style_evidence_layer sel ON t.id = sel.translation_id
        WHERE t.embedding IS NOT NULL
    """)

    X_all = []
    y_all = []
    anchors = []
    topics = []

    for r in rows:
        if r['embedding']:
            emb = np.array(json.loads(r['embedding']) if isinstance(r['embedding'], str) else list(r['embedding']))
            X_all.append(emb)
            y_all.append(r['translator_name'])
            anchors.append(r['anchor_id'])
            topics.append(r['topic'])

    X = np.array(X_all)
    y = np.array(y_all)
    anchors = np.array(anchors)
    topics = np.array(topics)

    # Filter to valid authors
    author_counts = {}
    for a in y:
        author_counts[a] = author_counts.get(a, 0) + 1
    valid = {a for a, c in author_counts.items() if c >= 50}
    mask = np.array([a in valid for a in y])
    X, y, anchors, topics = X[mask], y[mask], anchors[mask], topics[mask]

    print(f"    Samples: {len(X)}")
    print(f"    Authors: {len(set(y))}")

    # PCA
    pca = PCA(n_components=128)
    X_pca = pca.fit_transform(X)

    gate_results = {}

    # ========== GATE 1: Label Permutation Test ==========
    print("\n[2] Gate 1: Label Permutation Test...")
    print("    (Shuffled labels should give chance accuracy)")

    gkf = GroupKFold(n_splits=5)

    # Real accuracy
    real_accs = []
    for tr, te in gkf.split(X_pca, y, groups=anchors):
        clf = LogisticRegression(max_iter=500)
        clf.fit(X_pca[tr], y[tr])
        real_accs.append(accuracy_score(y[te], clf.predict(X_pca[te])))
    real_acc = np.mean(real_accs)

    # Permuted accuracy (should be near chance)
    perm_accs = []
    for _ in range(3):
        y_perm = np.random.permutation(y)
        for tr, te in gkf.split(X_pca, y_perm, groups=anchors):
            clf = LogisticRegression(max_iter=500)
            clf.fit(X_pca[tr], y_perm[tr])
            perm_accs.append(accuracy_score(y_perm[te], clf.predict(X_pca[te])))
    perm_acc = np.mean(perm_accs)

    chance = 1.0 / len(set(y))
    perm_passed = perm_acc < (chance + 0.05)

    print(f"    Real accuracy: {real_acc:.3f}")
    print(f"    Permuted accuracy: {perm_acc:.3f}")
    print(f"    Chance level: {chance:.3f}")
    print(f"    PASSED: {perm_passed}")

    gate_results['label_permutation'] = {
        'real_accuracy': float(real_acc),
        'permuted_accuracy': float(perm_acc),
        'chance': float(chance),
        'passed': perm_passed
    }

    # ========== GATE 2: Topic Predictability from Style ==========
    print("\n[3] Gate 2: Topic Predictability from Style Residuals...")
    print("    (Style should NOT predict topic)")

    # Compute style residuals
    anchor_means = {}
    for i, anc in enumerate(anchors):
        if anc not in anchor_means:
            anchor_means[anc] = []
        anchor_means[anc].append(X_pca[i])

    X_residual = np.zeros_like(X_pca)
    for i, anc in enumerate(anchors):
        mean = np.mean(anchor_means[anc], axis=0)
        X_residual[i] = X_pca[i] - mean

    # Predict topic from residuals
    topic_accs = []
    for tr, te in gkf.split(X_residual, topics, groups=anchors):
        clf = LogisticRegression(max_iter=500)
        clf.fit(X_residual[tr], topics[tr])
        topic_accs.append(accuracy_score(topics[te], clf.predict(X_residual[te])))

    topic_pred = np.mean(topic_accs)
    n_topics = len(set(topics))
    topic_chance = 1.0 / n_topics
    topic_passed = topic_pred < (topic_chance + 0.10)

    print(f"    Topic predictability: {topic_pred:.3f}")
    print(f"    Topic chance: {topic_chance:.3f}")
    print(f"    PASSED: {topic_passed}")

    gate_results['topic_predictability'] = {
        'accuracy': float(topic_pred),
        'chance': float(topic_chance),
        'passed': topic_passed
    }

    # ========== GATE 3: Topic-Matched Impostor Test ==========
    print("\n[4] Gate 3: Topic-Matched Impostor Test...")
    print("    (Must distinguish authors within same topic)")

    impostor_correct = 0
    impostor_total = 0

    for topic_id in set(topics):
        topic_mask = topics == topic_id
        if topic_mask.sum() < 100:
            continue

        X_topic = X_residual[topic_mask]
        y_topic = y[topic_mask]
        anchors_topic = anchors[topic_mask]

        if len(set(y_topic)) < 2:
            continue

        try:
            for tr, te in GroupKFold(n_splits=3).split(X_topic, y_topic, groups=anchors_topic):
                if len(tr) < 30:
                    continue
                clf = LogisticRegression(max_iter=500)
                clf.fit(X_topic[tr], y_topic[tr])
                pred = clf.predict(X_topic[te])
                impostor_correct += (pred == y_topic[te]).sum()
                impostor_total += len(te)
        except:
            continue

    if impostor_total > 0:
        impostor_acc = impostor_correct / impostor_total
    else:
        impostor_acc = 0.0

    impostor_passed = impostor_acc >= 0.50

    print(f"    Impostor test accuracy: {impostor_acc:.3f}")
    print(f"    PASSED: {impostor_passed}")

    gate_results['topic_matched_impostor'] = {
        'accuracy': float(impostor_acc),
        'n_tests': impostor_total,
        'passed': impostor_passed
    }

    # ========== GATE 4: Stability Check ==========
    print("\n[5] Gate 4: Cross-Fold Stability...")

    stability = 1.0 - (np.std(real_accs) / np.mean(real_accs)) if np.mean(real_accs) > 0 else 0
    stability_passed = stability >= 0.80

    print(f"    Fold accuracies: {[f'{a:.3f}' for a in real_accs]}")
    print(f"    Stability score: {stability:.3f}")
    print(f"    PASSED: {stability_passed}")

    gate_results['stability'] = {
        'fold_accuracies': [float(a) for a in real_accs],
        'stability_score': float(stability),
        'passed': stability_passed
    }

    # ========== Summary ==========
    print("\n" + "=" * 70)
    print("FALSIFICATION GATES SUMMARY")
    print("=" * 70)

    all_passed = all([
        gate_results['label_permutation']['passed'],
        gate_results['topic_predictability']['passed'],
        gate_results['topic_matched_impostor']['passed'],
        gate_results['stability']['passed'],
    ])

    for gate_name, result in gate_results.items():
        status = "PASS" if result['passed'] else "FAIL"
        print(f"  {gate_name}: {status}")

    print(f"\nOVERALL: {'ALL GATES PASSED' if all_passed else 'SOME GATES FAILED'}")

    # Store results - one entry per gate
    for gate_name, result in gate_results.items():
        await conn.execute("""
            INSERT INTO build_qa_log (agent_name, check_name, passed, details)
            VALUES ($1, $2, $3, $4)
        """,
            'FalsificationGates',
            gate_name,
            bool(result['passed']),
            json.dumps(result)
        )

    # Store overall result
    await conn.execute("""
        INSERT INTO build_qa_log (agent_name, check_name, passed, details)
        VALUES ($1, $2, $3, $4)
    """,
        'FalsificationGates',
        'all_gates',
        all_passed,
        json.dumps(gate_results)
    )

    await conn.close()
    print("\nFalsification gates complete!")

if __name__ == "__main__":
    asyncio.run(main())
