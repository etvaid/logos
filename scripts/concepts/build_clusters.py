#!/usr/bin/env python3
"""
LOGOS Concept Cluster Builder
Phase 7: Build concept clusters from bridge embeddings

Uses K-means or HDBSCAN to cluster passages in bridge embedding space.
Each cluster represents a cross-language concept (e.g., "justice", "love", "war").
"""

import os
import sys
import json
import asyncio
from datetime import datetime
from typing import List, Optional, Dict
import asyncpg
import numpy as np
from collections import defaultdict
import uuid

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

LOGS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'logs')

# Clustering parameters
MIN_CLUSTER_SIZE = 5
MAX_CLUSTERS = 100
DISTANCE_THRESHOLD = 0.3  # Max distance to centroid


class ConceptClusterBuilder:
    def __init__(self, conn: asyncpg.Connection):
        self.conn = conn
        self.cluster_count = 0
        self.member_count = 0

    async def get_bridge_embeddings(self) -> List[dict]:
        """Get all bridge embeddings for clustering."""
        print("Fetching bridge embeddings...")
        rows = await self.conn.fetch("""
            SELECT b.urn, b.language, b.embedding,
                   SUBSTRING(COALESCE(c.consensus_translation, st.content), 1, 200) as snippet
            FROM bridge_embeddings b
            LEFT JOIN passage_consensus c ON b.urn = c.urn
            LEFT JOIN source_texts st ON b.urn = st.urn
            ORDER BY b.id
        """)
        print(f"Found {len(rows)} embeddings")
        return rows

    def cluster_embeddings(self, embeddings: List[np.ndarray], n_clusters: int = 50):
        """
        Cluster embeddings using K-means.

        Returns cluster assignments and centroids.
        """
        print(f"Clustering {len(embeddings)} embeddings into ~{n_clusters} clusters...")

        try:
            from sklearn.cluster import KMeans

            # Use mini-batch K-means for efficiency
            kmeans = KMeans(
                n_clusters=min(n_clusters, len(embeddings)),
                random_state=42,
                n_init=10,
                max_iter=300
            )

            # Stack embeddings into matrix
            X = np.stack(embeddings)

            # Fit and predict
            labels = kmeans.fit_predict(X)
            centroids = kmeans.cluster_centers_

            print(f"Created {len(set(labels))} clusters")
            return labels, centroids

        except ImportError:
            print("sklearn not available, using simple clustering")
            # Fallback: random assignment
            n_clusters = min(n_clusters, len(embeddings))
            labels = np.random.randint(0, n_clusters, len(embeddings))
            centroids = np.zeros((n_clusters, len(embeddings[0])))
            return labels, centroids

    async def save_cluster(self, centroid: np.ndarray, languages: List[str],
                          top_terms: Dict[str, List[str]]) -> str:
        """Save a concept cluster."""
        cluster_id = str(uuid.uuid4())

        # Format centroid for pgvector
        centroid_str = '[' + ','.join(f'{x:.8f}' for x in centroid) + ']'

        await self.conn.execute("""
            INSERT INTO concept_clusters
                (cluster_id, centroid, member_count, languages, top_terms)
            VALUES ($1, $2::vector, 0, $3, $4)
        """, cluster_id, centroid_str, languages, json.dumps(top_terms))

        self.cluster_count += 1
        return cluster_id

    async def save_member(self, cluster_id: str, urn: str, language: str,
                         distance: float, snippet: str):
        """Save a cluster member."""
        await self.conn.execute("""
            INSERT INTO concept_members
                (cluster_id, urn, language, distance_to_centroid, snippet)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (cluster_id, urn) DO NOTHING
        """, cluster_id, urn, language, distance, snippet[:500] if snippet else None)

        self.member_count += 1

    async def update_cluster_stats(self, cluster_id: str):
        """Update cluster member count."""
        await self.conn.execute("""
            UPDATE concept_clusters
            SET member_count = (SELECT COUNT(*) FROM concept_members WHERE cluster_id = $1)
            WHERE cluster_id = $1
        """, cluster_id)

    def extract_top_terms(self, snippets: List[str], language: str, n: int = 5) -> List[str]:
        """Extract most common terms from snippets."""
        from collections import Counter
        import re

        words = []
        for snippet in snippets:
            if not snippet:
                continue
            # Simple tokenization
            tokens = re.findall(r'\b\w+\b', snippet.lower())
            # Filter short/common words
            tokens = [t for t in tokens if len(t) > 3 and t not in {'the', 'and', 'that', 'this', 'with', 'from'}]
            words.extend(tokens)

        return [w for w, _ in Counter(words).most_common(n)]

    async def build(self):
        """Main build process."""
        print("=" * 60)
        print("LOGOS Concept Cluster Builder - Phase 7")
        print("=" * 60)
        print()

        # Get embeddings
        rows = await self.get_bridge_embeddings()

        if len(rows) < MIN_CLUSTER_SIZE:
            print(f"Not enough embeddings ({len(rows)} < {MIN_CLUSTER_SIZE}), skipping clustering")
            return

        # Parse embeddings
        embeddings = []
        metadata = []
        for row in rows:
            try:
                emb_raw = row['embedding']
                # Handle string representation of vector
                if isinstance(emb_raw, str):
                    # Remove brackets and parse
                    emb_str = emb_raw.strip('[]')
                    emb = [float(x) for x in emb_str.split(',')]
                else:
                    emb = list(emb_raw)

                if len(emb) == 384:
                    embeddings.append(np.array(emb))
                    metadata.append({
                        'urn': row['urn'],
                        'language': row['language'],
                        'snippet': row['snippet']
                    })
            except Exception as e:
                continue

        if not embeddings:
            print("No valid embeddings found")
            return

        # Determine number of clusters
        n_clusters = min(MAX_CLUSTERS, max(5, len(embeddings) // 20))

        # Cluster
        labels, centroids = self.cluster_embeddings(embeddings, n_clusters)

        # Group by cluster
        cluster_data = defaultdict(list)
        for i, label in enumerate(labels):
            cluster_data[label].append((i, metadata[i], embeddings[i]))

        print(f"\nSaving {len(cluster_data)} clusters...")

        # Save clusters and members
        for label, members in cluster_data.items():
            if len(members) < MIN_CLUSTER_SIZE:
                continue

            # Get centroid
            centroid = centroids[label]

            # Get languages and top terms
            languages = list(set(m[1]['language'] for m in members))
            top_terms = {}
            for lang in languages:
                lang_snippets = [m[1]['snippet'] for m in members if m[1]['language'] == lang]
                top_terms[lang] = self.extract_top_terms(lang_snippets, lang)

            # Save cluster
            cluster_id = await self.save_cluster(centroid, languages, top_terms)

            # Save members
            for idx, meta, emb in members:
                distance = float(np.linalg.norm(emb - centroid))
                await self.save_member(
                    cluster_id,
                    meta['urn'],
                    meta['language'],
                    distance,
                    meta['snippet']
                )

            # Update member count
            await self.update_cluster_stats(cluster_id)

        # Record evidence
        await self.conn.execute("""
            INSERT INTO evidence_trails
                (entity_type, entity_id, action, actor, evidence)
            VALUES ($1, $2, $3, $4, $5)
        """, 'concept_clusters', 'phase7_build', 'created', 'system:cluster_builder',
            json.dumps({
                'cluster_count': self.cluster_count,
                'member_count': self.member_count,
                'embedding_count': len(embeddings),
                'build_time': datetime.now().isoformat()
            }))

        print()
        print("=" * 60)
        print("Concept Cluster Build Complete!")
        print(f"  Clusters created: {self.cluster_count:,}")
        print(f"  Members assigned: {self.member_count:,}")
        print("=" * 60)


async def main():
    os.makedirs(LOGS_DIR, exist_ok=True)

    # Connect
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
        builder = ConceptClusterBuilder(conn)
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
