#!/usr/bin/env python3
"""
================================================================================
TRANSLATOR × TOPIC COVERAGE AUDIT
================================================================================

Critical diagnostic to determine if Gate 2 is failing due to:
A) Style features still encoding meaning (fixable with better features/residualization)
B) Data geometry where translators don't have cross-topic coverage (unfixable without more data)

If translators only appear in narrow topic subsets, topic holdout will collapse
even with perfect style features because the classifier never sees some translators
in training for some meaning regions.

Outputs:
- Per-translator topic coverage stats
- Mutual Information MI(translator; topic_cluster)
- Assessment of whether Gate 2 split is mathematically winnable
================================================================================
"""

import asyncio
import asyncpg
import numpy as np
import os
from collections import defaultdict, Counter
from sklearn.cluster import KMeans
from sklearn.metrics import mutual_info_score, normalized_mutual_info_score
from scipy.stats import entropy
import json

DATABASE_URL = os.environ.get('DATABASE_URL', '')


async def run_overlap_audit(n_clusters: int = 20):
    """
    Audit translator × topic cluster overlap.

    This is the single highest leverage debugging step because it tells us
    whether to invest in invariance modeling or corpus redesign.
    """
    pool = await asyncpg.create_pool(DATABASE_URL)

    async with pool.acquire() as conn:
        # Get translations with embeddings
        rows = await conn.fetch("""
            SELECT tr.id, tr.translation, tr.embedding, t.name, t.id as translator_id
            FROM translations tr
            JOIN translators t ON tr.translator_id = t.id
            WHERE tr.translation IS NOT NULL
              AND tr.embedding IS NOT NULL
              AND LENGTH(tr.translation) > 200
              AND t.name != 'Loeb Translator'
        """)

        print(f"=" * 70)
        print("TRANSLATOR × TOPIC COVERAGE AUDIT")
        print("=" * 70)
        print(f"\nTotal samples: {len(rows)}")

        # Parse embeddings
        embeddings = []
        translator_ids = []
        translator_names = []

        for r in rows:
            emb = r['embedding']
            if isinstance(emb, str):
                s = emb.strip()
                if s.startswith('[') and s.endswith(']'):
                    s = s[1:-1]
                vec = np.array([float(x.strip()) for x in s.split(',') if x.strip()])
            else:
                vec = np.array(list(emb))
            embeddings.append(vec)
            translator_ids.append(r['translator_id'])
            translator_names.append(r['name'])

        embeddings = np.array(embeddings)
        translator_ids = np.array(translator_ids)

        # Create meaning clusters (same as Gate 2)
        print(f"\nClustering into {n_clusters} meaning clusters...")
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        topic_clusters = kmeans.fit_predict(embeddings)

        # Build translator -> unique names mapping
        unique_translators = list(set(translator_ids))
        translator_name_map = {}
        for tid, name in zip(translator_ids, translator_names):
            translator_name_map[tid] = name

        print(f"Unique translators: {len(unique_translators)}")
        print(f"Topic clusters: {n_clusters}")

        # =====================================================================
        # PER-TRANSLATOR TOPIC COVERAGE STATISTICS
        # =====================================================================
        print(f"\n" + "=" * 70)
        print("PER-TRANSLATOR TOPIC COVERAGE")
        print("=" * 70)

        translator_stats = {}

        for tid in unique_translators:
            mask = translator_ids == tid
            clusters_for_translator = topic_clusters[mask]

            # Number of clusters represented
            unique_clusters = set(clusters_for_translator)
            n_clusters_represented = len(unique_clusters)

            # Cluster distribution
            cluster_counts = Counter(clusters_for_translator)
            total = len(clusters_for_translator)

            # Entropy of cluster distribution (higher = more spread)
            probs = np.array([cluster_counts[c] / total for c in range(n_clusters)])
            probs = probs[probs > 0]  # Only non-zero
            cluster_entropy = entropy(probs)
            max_entropy = np.log(n_clusters)  # Maximum possible entropy
            normalized_entropy = cluster_entropy / max_entropy if max_entropy > 0 else 0

            # Min/median/max samples per cluster
            counts = list(cluster_counts.values())
            min_samples = min(counts)
            max_samples = max(counts)
            median_samples = np.median(counts)

            translator_stats[tid] = {
                'name': translator_name_map[tid],
                'total_samples': total,
                'n_clusters_represented': n_clusters_represented,
                'cluster_coverage_pct': n_clusters_represented / n_clusters * 100,
                'cluster_entropy': cluster_entropy,
                'normalized_entropy': normalized_entropy,
                'min_samples_per_cluster': min_samples,
                'max_samples_per_cluster': max_samples,
                'median_samples_per_cluster': median_samples,
                'cluster_distribution': dict(cluster_counts)
            }

        # Sort by total samples descending
        sorted_translators = sorted(translator_stats.items(),
                                     key=lambda x: x[1]['total_samples'],
                                     reverse=True)

        print(f"\n{'Translator':<20} {'Samples':>8} {'Clusters':>10} {'Coverage':>10} {'Entropy':>10} {'Min/Med/Max':>15}")
        print("-" * 75)

        low_coverage_count = 0
        for tid, stats in sorted_translators:
            name = stats['name'][:18]
            coverage_flag = "⚠" if stats['n_clusters_represented'] < 5 else " "
            print(f"{name:<20} {stats['total_samples']:>8} {stats['n_clusters_represented']:>10} "
                  f"{stats['cluster_coverage_pct']:>9.1f}% {stats['normalized_entropy']:>10.3f} "
                  f"{stats['min_samples_per_cluster']:>4}/{stats['median_samples_per_cluster']:>4.0f}/{stats['max_samples_per_cluster']:>4} {coverage_flag}")

            if stats['n_clusters_represented'] < 5:
                low_coverage_count += 1

        # =====================================================================
        # MUTUAL INFORMATION ANALYSIS
        # =====================================================================
        print(f"\n" + "=" * 70)
        print("MUTUAL INFORMATION ANALYSIS")
        print("=" * 70)

        # MI(translator; topic_cluster)
        mi = mutual_info_score(translator_ids, topic_clusters)
        nmi = normalized_mutual_info_score(translator_ids, topic_clusters)

        # Compute maximum possible MI for reference
        translator_entropy = entropy([Counter(translator_ids)[t] / len(translator_ids)
                                       for t in unique_translators])
        topic_entropy = entropy([Counter(topic_clusters)[c] / len(topic_clusters)
                                  for c in range(n_clusters)])

        print(f"\nMutual Information (raw): {mi:.4f}")
        print(f"Normalized MI: {nmi:.4f}")
        print(f"Translator entropy: {translator_entropy:.4f}")
        print(f"Topic cluster entropy: {topic_entropy:.4f}")
        print(f"\nInterpretation:")
        if nmi > 0.3:
            print("  ⚠ HIGH NMI (>0.3): Translators are strongly associated with specific topics")
            print("    Gate 2 is partly a 'label shift' test, not purely 'topic invariance'")
        elif nmi > 0.15:
            print("  ⚡ MODERATE NMI (0.15-0.3): Some translator-topic association exists")
            print("    Gate 2 is partially confounded but likely still informative")
        else:
            print("  ✓ LOW NMI (<0.15): Translators are well-distributed across topics")
            print("    Gate 2 is a valid topic invariance test")

        # =====================================================================
        # GATE 2 SPLIT ANALYSIS
        # =====================================================================
        print(f"\n" + "=" * 70)
        print("GATE 2 SPLIT ANALYSIS")
        print("=" * 70)

        # Simulate what happens when we hold out each topic cluster
        holdout_problems = []

        for holdout_cluster in range(n_clusters):
            train_mask = topic_clusters != holdout_cluster
            test_mask = topic_clusters == holdout_cluster

            train_translators = set(translator_ids[train_mask])
            test_translators = set(translator_ids[test_mask])

            # Translators only in test (never seen in training)
            unseen_in_train = test_translators - train_translators

            if unseen_in_train:
                holdout_problems.append({
                    'cluster': holdout_cluster,
                    'n_test_samples': test_mask.sum(),
                    'unseen_translators': [translator_name_map[t] for t in unseen_in_train],
                    'n_unseen': len(unseen_in_train)
                })

        if holdout_problems:
            print(f"\n⚠ CRITICAL: {len(holdout_problems)} clusters have translators not seen in training!")
            print("  This makes Gate 2 mathematically unwinnable for those splits.\n")

            for prob in holdout_problems[:5]:  # Show first 5
                print(f"  Cluster {prob['cluster']}: {prob['n_test_samples']} test samples")
                print(f"    Unseen translators: {', '.join(prob['unseen_translators'][:3])}")
        else:
            print("\n✓ All translators appear in training for all topic holdout splits")
            print("  Gate 2 is mathematically winnable (if features are good enough)")

        # =====================================================================
        # FINAL ASSESSMENT
        # =====================================================================
        print(f"\n" + "=" * 70)
        print("FINAL ASSESSMENT")
        print("=" * 70)

        low_coverage_pct = low_coverage_count / len(unique_translators) * 100

        print(f"\nTranslators with <5 topic clusters: {low_coverage_count}/{len(unique_translators)} ({low_coverage_pct:.1f}%)")
        print(f"Normalized MI (translator ↔ topic): {nmi:.4f}")
        print(f"Holdout splits with unseen translators: {len(holdout_problems)}/{n_clusters}")

        # Determine if Gate 2 is a data problem or feature problem
        data_problem = low_coverage_pct > 30 or len(holdout_problems) > n_clusters * 0.2 or nmi > 0.3

        print(f"\n" + "-" * 70)
        if data_problem:
            print("DIAGNOSIS: Gate 2 failure is PARTLY a DATA GEOMETRY problem")
            print("\nRecommendations:")
            print("  1. Redesign Gate 2 to evaluate only on 'overlap subset'")
            print("     (translators with sufficient cross-topic coverage)")
            print("  2. OR expand corpus with more diverse translations per translator")
            print("  3. Use stratified topic-holdout that ensures all translators in train")
        else:
            print("DIAGNOSIS: Gate 2 failure is likely a FEATURE/MODEL problem")
            print("\nRecommendations:")
            print("  1. Implement meaning-conditioned residualization")
            print("  2. Train contrastive style encoder with anchor-negative pairs")
            print("  3. Add more meaning-invariant features (punct, syntax)")
        print("-" * 70)

        # Save full report
        report = {
            'n_samples': len(rows),
            'n_translators': len(unique_translators),
            'n_clusters': n_clusters,
            'mutual_information': {
                'raw': float(mi),
                'normalized': float(nmi),
                'translator_entropy': float(translator_entropy),
                'topic_entropy': float(topic_entropy)
            },
            'translator_stats': {translator_name_map[tid]: stats for tid, stats in translator_stats.items()},
            'holdout_problems': holdout_problems,
            'low_coverage_count': low_coverage_count,
            'low_coverage_pct': low_coverage_pct,
            'diagnosis': 'data_geometry' if data_problem else 'feature_model'
        }

        # Save to file
        with open('/Users/royvaid/Downloads/logos/papers/TOPIC_TRANSLATOR_AUDIT.json', 'w') as f:
            json.dump(report, f, indent=2, default=str)

        print(f"\nFull report saved to: papers/TOPIC_TRANSLATOR_AUDIT.json")

    await pool.close()
    return report


if __name__ == "__main__":
    asyncio.run(run_overlap_audit())
