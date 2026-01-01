#!/usr/bin/env python3
"""
LOGOS Pericope Seeding Script
==============================

Populates the pericope and synoptic parallel tables for Q reconstruction.
This includes:
- Gospel pericopes (Matthew, Mark, Luke)
- Synoptic parallels (triple tradition, double tradition)
- Saying clusters for reconstructed Q

Usage:
    python scripts/seed_pericopes.py [--reset]

Options:
    --reset    Drop and recreate tables before seeding
"""

import asyncio
import argparse
import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncpg
from config.constants import DATABASE_URL, EMBED_DIM


# ═══════════════════════════════════════════════════════════════════════════════
# PERICOPE TABLE SCHEMA (Creates if not exists)
# ═══════════════════════════════════════════════════════════════════════════════

PERICOPE_SCHEMA = f"""
-- Pericopes table for gospel passages
CREATE TABLE IF NOT EXISTS pericopes (
    id SERIAL PRIMARY KEY,
    gospel TEXT NOT NULL,  -- 'Matthew', 'Mark', 'Luke', 'Thomas', 'John'
    pericope_name TEXT NOT NULL,
    pericope_id TEXT UNIQUE,  -- e.g., 'MT_3:1-12', 'Q_3:7-9'

    -- Verse range
    start_chapter INTEGER,
    start_verse INTEGER,
    end_chapter INTEGER,
    end_verse INTEGER,
    verse_range TEXT,  -- e.g., '3:1-12'

    -- Text content
    greek_text TEXT,
    translation_text TEXT,
    word_count INTEGER,

    -- Classification
    tradition_type TEXT,  -- 'triple', 'double_mt_lk', 'mk_only', 'sondergut', 'gnostic'
    q_reference TEXT,  -- Q reference if applicable, e.g., 'Q 3:7-9'

    -- Embedding
    embedding VECTOR({EMBED_DIM}),

    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pericopes_gospel ON pericopes(gospel);
CREATE INDEX IF NOT EXISTS idx_pericopes_tradition ON pericopes(tradition_type);
CREATE INDEX IF NOT EXISTS idx_pericopes_q_ref ON pericopes(q_reference);

-- Synoptic parallels
CREATE TABLE IF NOT EXISTS synoptic_parallels (
    id SERIAL PRIMARY KEY,
    parallel_group TEXT NOT NULL,  -- Group identifier for related pericopes

    -- Linked pericopes
    pericope_a_id INTEGER REFERENCES pericopes(id),
    pericope_b_id INTEGER REFERENCES pericopes(id),

    -- Similarity metrics
    verbal_similarity FLOAT,
    semantic_similarity FLOAT,
    structural_similarity FLOAT,

    -- Edit analysis
    word_agreements INTEGER,
    word_disagreements INTEGER,
    agreement_percentage FLOAT,

    -- Classification
    parallel_type TEXT,  -- 'triple', 'double', 'gnostic_parallel'

    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(pericope_a_id, pericope_b_id)
);

CREATE INDEX IF NOT EXISTS idx_synoptic_parallels_group ON synoptic_parallels(parallel_group);

-- Saying clusters for Q reconstruction
CREATE TABLE IF NOT EXISTS saying_clusters (
    id SERIAL PRIMARY KEY,
    cluster_name TEXT NOT NULL,
    q_reference TEXT,  -- e.g., 'Q 3:7-9'

    -- Member pericopes
    member_pericope_ids INTEGER[],
    member_gospels TEXT[],

    -- Reconstruction
    reconstructed_q_text TEXT,
    reconstruction_confidence FLOAT,
    reconstruction_method TEXT,

    -- Analysis
    verbal_agreement_score FLOAT,
    thematic_coherence FLOAT,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saying_clusters_q ON saying_clusters(q_reference);
"""


# ═══════════════════════════════════════════════════════════════════════════════
# SYNOPTIC PERICOPE DATA
# Based on standard synoptic parallel lists (Aland synopsis structure)
# ═══════════════════════════════════════════════════════════════════════════════

TRIPLE_TRADITION_PERICOPES = [
    # John the Baptist's Preaching
    {
        "parallel_group": "john_baptist_preaching",
        "q_reference": "Q 3:7-9",
        "pericopes": [
            {"gospel": "Matthew", "verse_range": "3:1-12", "pericope_name": "John the Baptist's Preaching",
             "greek_text": "Ἐν δὲ ταῖς ἡμέραις ἐκείναις παραγίνεται Ἰωάννης ὁ βαπτιστὴς κηρύσσων ἐν τῇ ἐρήμῳ τῆς Ἰουδαίας..."},
            {"gospel": "Mark", "verse_range": "1:2-8", "pericope_name": "John the Baptist's Preaching",
             "greek_text": "Καθὼς γέγραπται ἐν τῷ Ἠσαΐᾳ τῷ προφήτῃ..."},
            {"gospel": "Luke", "verse_range": "3:1-18", "pericope_name": "John the Baptist's Preaching",
             "greek_text": "Ἐν ἔτει δὲ πεντεκαιδεκάτῳ τῆς ἡγεμονίας Τιβερίου Καίσαρος..."}
        ]
    },
    # Baptism of Jesus
    {
        "parallel_group": "baptism_jesus",
        "q_reference": None,
        "pericopes": [
            {"gospel": "Matthew", "verse_range": "3:13-17", "pericope_name": "Baptism of Jesus",
             "greek_text": "Τότε παραγίνεται ὁ Ἰησοῦς ἀπὸ τῆς Γαλιλαίας ἐπὶ τὸν Ἰορδάνην πρὸς τὸν Ἰωάννην..."},
            {"gospel": "Mark", "verse_range": "1:9-11", "pericope_name": "Baptism of Jesus",
             "greek_text": "Καὶ ἐγένετο ἐν ἐκείναις ταῖς ἡμέραις ἦλθεν Ἰησοῦς ἀπὸ Ναζαρὲτ τῆς Γαλιλαίας..."},
            {"gospel": "Luke", "verse_range": "3:21-22", "pericope_name": "Baptism of Jesus",
             "greek_text": "Ἐγένετο δὲ ἐν τῷ βαπτισθῆναι ἅπαντα τὸν λαὸν καὶ Ἰησοῦ βαπτισθέντος..."}
        ]
    },
    # Temptation
    {
        "parallel_group": "temptation",
        "q_reference": "Q 4:1-13",
        "pericopes": [
            {"gospel": "Matthew", "verse_range": "4:1-11", "pericope_name": "The Temptation",
             "greek_text": "Τότε ὁ Ἰησοῦς ἀνήχθη εἰς τὴν ἔρημον ὑπὸ τοῦ πνεύματος πειρασθῆναι ὑπὸ τοῦ διαβόλου..."},
            {"gospel": "Mark", "verse_range": "1:12-13", "pericope_name": "The Temptation",
             "greek_text": "Καὶ εὐθὺς τὸ πνεῦμα αὐτὸν ἐκβάλλει εἰς τὴν ἔρημον..."},
            {"gospel": "Luke", "verse_range": "4:1-13", "pericope_name": "The Temptation",
             "greek_text": "Ἰησοῦς δὲ πλήρης πνεύματος ἁγίου ὑπέστρεψεν ἀπὸ τοῦ Ἰορδάνου..."}
        ]
    },
    # Beelzebul Controversy
    {
        "parallel_group": "beelzebul",
        "q_reference": "Q 11:14-23",
        "pericopes": [
            {"gospel": "Matthew", "verse_range": "12:22-30", "pericope_name": "Beelzebul Controversy",
             "greek_text": "Τότε προσηνέχθη αὐτῷ δαιμονιζόμενος τυφλὸς καὶ κωφός..."},
            {"gospel": "Mark", "verse_range": "3:22-27", "pericope_name": "Beelzebul Controversy",
             "greek_text": "Καὶ οἱ γραμματεῖς οἱ ἀπὸ Ἱεροσολύμων καταβάντες ἔλεγον..."},
            {"gospel": "Luke", "verse_range": "11:14-23", "pericope_name": "Beelzebul Controversy",
             "greek_text": "Καὶ ἦν ἐκβάλλων δαιμόνιον κωφόν..."}
        ]
    },
    # Parable of the Sower
    {
        "parallel_group": "sower",
        "q_reference": None,
        "pericopes": [
            {"gospel": "Matthew", "verse_range": "13:1-9", "pericope_name": "Parable of the Sower",
             "greek_text": "Ἐν τῇ ἡμέρᾳ ἐκείνῃ ἐξελθὼν ὁ Ἰησοῦς τῆς οἰκίας ἐκάθητο παρὰ τὴν θάλασσαν..."},
            {"gospel": "Mark", "verse_range": "4:1-9", "pericope_name": "Parable of the Sower",
             "greek_text": "Καὶ πάλιν ἤρξατο διδάσκειν παρὰ τὴν θάλασσαν..."},
            {"gospel": "Luke", "verse_range": "8:4-8", "pericope_name": "Parable of the Sower",
             "greek_text": "Συνιόντος δὲ ὄχλου πολλοῦ..."}
        ]
    },
    # Mustard Seed
    {
        "parallel_group": "mustard_seed",
        "q_reference": "Q 13:18-19",
        "pericopes": [
            {"gospel": "Matthew", "verse_range": "13:31-32", "pericope_name": "Parable of the Mustard Seed",
             "greek_text": "Ἄλλην παραβολὴν παρέθηκεν αὐτοῖς λέγων· Ὁμοία ἐστὶν ἡ βασιλεία τῶν οὐρανῶν κόκκῳ σινάπεως..."},
            {"gospel": "Mark", "verse_range": "4:30-32", "pericope_name": "Parable of the Mustard Seed",
             "greek_text": "Καὶ ἔλεγεν· Πῶς ὁμοιώσωμεν τὴν βασιλείαν τοῦ θεοῦ..."},
            {"gospel": "Luke", "verse_range": "13:18-19", "pericope_name": "Parable of the Mustard Seed",
             "greek_text": "Ἔλεγεν οὖν· Τίνι ὁμοία ἐστὶν ἡ βασιλεία τοῦ θεοῦ..."}
        ]
    },
]


DOUBLE_TRADITION_PERICOPES = [
    # Beatitudes (Q material - Mt/Lk only)
    {
        "parallel_group": "beatitudes",
        "q_reference": "Q 6:20-23",
        "pericopes": [
            {"gospel": "Matthew", "verse_range": "5:3-12", "pericope_name": "The Beatitudes",
             "greek_text": "Μακάριοι οἱ πτωχοὶ τῷ πνεύματι, ὅτι αὐτῶν ἐστιν ἡ βασιλεία τῶν οὐρανῶν..."},
            {"gospel": "Luke", "verse_range": "6:20-23", "pericope_name": "The Beatitudes",
             "greek_text": "Μακάριοι οἱ πτωχοί, ὅτι ὑμετέρα ἐστὶν ἡ βασιλεία τοῦ θεοῦ..."}
        ]
    },
    # Love Your Enemies
    {
        "parallel_group": "love_enemies",
        "q_reference": "Q 6:27-36",
        "pericopes": [
            {"gospel": "Matthew", "verse_range": "5:38-48", "pericope_name": "Love Your Enemies",
             "greek_text": "Ἠκούσατε ὅτι ἐρρέθη· Ὀφθαλμὸν ἀντὶ ὀφθαλμοῦ..."},
            {"gospel": "Luke", "verse_range": "6:27-36", "pericope_name": "Love Your Enemies",
             "greek_text": "Ἀλλὰ ὑμῖν λέγω τοῖς ἀκούουσιν· ἀγαπᾶτε τοὺς ἐχθροὺς ὑμῶν..."}
        ]
    },
    # Lord's Prayer
    {
        "parallel_group": "lords_prayer",
        "q_reference": "Q 11:2-4",
        "pericopes": [
            {"gospel": "Matthew", "verse_range": "6:9-13", "pericope_name": "The Lord's Prayer",
             "greek_text": "Πάτερ ἡμῶν ὁ ἐν τοῖς οὐρανοῖς· ἁγιασθήτω τὸ ὄνομά σου..."},
            {"gospel": "Luke", "verse_range": "11:2-4", "pericope_name": "The Lord's Prayer",
             "greek_text": "Πάτερ, ἁγιασθήτω τὸ ὄνομά σου..."}
        ]
    },
    # Ask, Seek, Knock
    {
        "parallel_group": "ask_seek_knock",
        "q_reference": "Q 11:9-13",
        "pericopes": [
            {"gospel": "Matthew", "verse_range": "7:7-11", "pericope_name": "Ask, Seek, Knock",
             "greek_text": "Αἰτεῖτε καὶ δοθήσεται ὑμῖν, ζητεῖτε καὶ εὑρήσετε, κρούετε καὶ ἀνοιγήσεται ὑμῖν..."},
            {"gospel": "Luke", "verse_range": "11:9-13", "pericope_name": "Ask, Seek, Knock",
             "greek_text": "Κἀγὼ ὑμῖν λέγω· αἰτεῖτε καὶ δοθήσεται ὑμῖν..."}
        ]
    },
    # Woes on Pharisees
    {
        "parallel_group": "woes_pharisees",
        "q_reference": "Q 11:39-52",
        "pericopes": [
            {"gospel": "Matthew", "verse_range": "23:1-36", "pericope_name": "Woes on Pharisees",
             "greek_text": "Τότε ὁ Ἰησοῦς ἐλάλησεν τοῖς ὄχλοις καὶ τοῖς μαθηταῖς αὐτοῦ..."},
            {"gospel": "Luke", "verse_range": "11:37-54", "pericope_name": "Woes on Pharisees",
             "greek_text": "Ἐν δὲ τῷ λαλῆσαι ἐρωτᾷ αὐτὸν Φαρισαῖος ὅπως ἀριστήσῃ παρ᾽ αὐτῷ..."}
        ]
    },
    # Mission Discourse
    {
        "parallel_group": "mission_discourse",
        "q_reference": "Q 10:2-16",
        "pericopes": [
            {"gospel": "Matthew", "verse_range": "10:1-16", "pericope_name": "Mission Discourse",
             "greek_text": "Καὶ προσκαλεσάμενος τοὺς δώδεκα μαθητὰς αὐτοῦ..."},
            {"gospel": "Luke", "verse_range": "10:1-12", "pericope_name": "Mission of the Seventy",
             "greek_text": "Μετὰ δὲ ταῦτα ἀνέδειξεν ὁ κύριος ἑτέρους ἑβδομήκοντα..."}
        ]
    },
]


THOMAS_PARALLELS = [
    # Thomas parallels to synoptic/Q material
    {
        "parallel_group": "thomas_mustard",
        "pericopes": [
            {"gospel": "Thomas", "verse_range": "20", "pericope_name": "Mustard Seed (Thomas)",
             "greek_text": "ΠΕϪΕ ΜΜΑΘΗΤΗC ΝΙHC ϪΕ ϪΟΟC ΕΡΟC ϪΕ..."}  # Coptic/Greek
        ]
    },
    {
        "parallel_group": "thomas_sower",
        "pericopes": [
            {"gospel": "Thomas", "verse_range": "9", "pericope_name": "The Sower (Thomas)",
             "greek_text": "ΠΕϪΕ ΙC ϪΕ ΕΙC ΗΗΤΕ ΑΦΕΙ ΕΒΟΛ ΝϬΙ..."}
        ]
    },
    {
        "parallel_group": "thomas_rich_fool",
        "pericopes": [
            {"gospel": "Thomas", "verse_range": "63", "pericope_name": "Rich Fool (Thomas)",
             "greek_text": "ΠΕϪΕ ΙC ϪΕ ΝΕΟΥΝ ΟΥΡΩΜΕ ΝΡΜΜΑΟ..."}
        ]
    },
]


async def create_pericope_tables(pool: asyncpg.Pool):
    """Create pericope-related tables if they don't exist."""
    async with pool.acquire() as conn:
        await conn.execute(PERICOPE_SCHEMA)
    print("Pericope tables created/verified")


async def seed_pericopes(pool: asyncpg.Pool, reset: bool = False):
    """Seed pericope data."""

    if reset:
        print("Resetting pericope tables...")
        async with pool.acquire() as conn:
            await conn.execute("DROP TABLE IF EXISTS saying_clusters CASCADE")
            await conn.execute("DROP TABLE IF EXISTS synoptic_parallels CASCADE")
            await conn.execute("DROP TABLE IF EXISTS pericopes CASCADE")
        await create_pericope_tables(pool)

    print("\nSeeding triple tradition pericopes...")
    for parallel_group_data in TRIPLE_TRADITION_PERICOPES:
        await _seed_parallel_group(pool, parallel_group_data, "triple")

    print("\nSeeding double tradition pericopes (Q material)...")
    for parallel_group_data in DOUBLE_TRADITION_PERICOPES:
        await _seed_parallel_group(pool, parallel_group_data, "double_mt_lk")

    print("\nSeeding Thomas parallels...")
    for parallel_group_data in THOMAS_PARALLELS:
        await _seed_parallel_group(pool, parallel_group_data, "gnostic")

    print("\nCreating saying clusters...")
    await _create_saying_clusters(pool)


async def _seed_parallel_group(pool: asyncpg.Pool, group_data: dict, tradition_type: str):
    """Seed a parallel group of pericopes."""
    parallel_group = group_data["parallel_group"]
    q_reference = group_data.get("q_reference")

    pericope_ids = []

    for pericope_data in group_data["pericopes"]:
        gospel = pericope_data["gospel"]
        verse_range = pericope_data["verse_range"]
        pericope_name = pericope_data["pericope_name"]
        greek_text = pericope_data.get("greek_text", "")

        # Parse verse range
        parts = verse_range.split("-")
        start_parts = parts[0].split(":")
        start_chapter = int(start_parts[0])
        start_verse = int(start_parts[1]) if len(start_parts) > 1 else 1

        end_chapter = start_chapter
        end_verse = start_verse
        if len(parts) > 1:
            end_parts = parts[1].split(":")
            if len(end_parts) > 1:
                end_chapter = int(end_parts[0])
                end_verse = int(end_parts[1])
            else:
                end_verse = int(end_parts[0])

        pericope_id = f"{gospel[:2].upper()}_{verse_range}"

        async with pool.acquire() as conn:
            result = await conn.fetchrow("""
                INSERT INTO pericopes (
                    gospel, pericope_name, pericope_id,
                    start_chapter, start_verse, end_chapter, end_verse,
                    verse_range, greek_text, tradition_type, q_reference,
                    word_count
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                ON CONFLICT (pericope_id) DO UPDATE SET
                    greek_text = EXCLUDED.greek_text,
                    tradition_type = EXCLUDED.tradition_type
                RETURNING id
            """,
                gospel, pericope_name, pericope_id,
                start_chapter, start_verse, end_chapter, end_verse,
                verse_range, greek_text, tradition_type, q_reference,
                len(greek_text.split()) if greek_text else 0
            )
            pericope_ids.append(result['id'])

    # Create parallel links
    for i in range(len(pericope_ids)):
        for j in range(i + 1, len(pericope_ids)):
            async with pool.acquire() as conn:
                await conn.execute("""
                    INSERT INTO synoptic_parallels (
                        parallel_group, pericope_a_id, pericope_b_id,
                        parallel_type
                    ) VALUES ($1, $2, $3, $4)
                    ON CONFLICT (pericope_a_id, pericope_b_id) DO NOTHING
                """, parallel_group, pericope_ids[i], pericope_ids[j], tradition_type)

    print(f"  - Seeded {parallel_group}: {len(pericope_ids)} pericopes")


async def _create_saying_clusters(pool: asyncpg.Pool):
    """Create saying clusters from Q pericopes."""
    async with pool.acquire() as conn:
        # Get all Q-referenced pericopes grouped by Q reference
        q_groups = await conn.fetch("""
            SELECT q_reference, array_agg(id) as pericope_ids, array_agg(gospel) as gospels
            FROM pericopes
            WHERE q_reference IS NOT NULL
            GROUP BY q_reference
        """)

        for group in q_groups:
            q_ref = group['q_reference']
            pericope_ids = group['pericope_ids']
            gospels = group['gospels']

            await conn.execute("""
                INSERT INTO saying_clusters (
                    cluster_name, q_reference,
                    member_pericope_ids, member_gospels
                ) VALUES ($1, $2, $3, $4)
                ON CONFLICT DO NOTHING
            """,
                f"Cluster: {q_ref}",
                q_ref,
                pericope_ids,
                gospels
            )

        cluster_count = await conn.fetchval("SELECT COUNT(*) FROM saying_clusters")
        print(f"  - Created {cluster_count} saying clusters")


async def verify_data(pool: asyncpg.Pool):
    """Verify seeded data."""
    async with pool.acquire() as conn:
        pericope_count = await conn.fetchval("SELECT COUNT(*) FROM pericopes")
        parallel_count = await conn.fetchval("SELECT COUNT(*) FROM synoptic_parallels")
        cluster_count = await conn.fetchval("SELECT COUNT(*) FROM saying_clusters")

        by_gospel = await conn.fetch("""
            SELECT gospel, COUNT(*) as count
            FROM pericopes
            GROUP BY gospel
            ORDER BY gospel
        """)

        by_tradition = await conn.fetch("""
            SELECT tradition_type, COUNT(*) as count
            FROM pericopes
            GROUP BY tradition_type
        """)

    print("\n" + "="*50)
    print("VERIFICATION SUMMARY")
    print("="*50)
    print(f"Total pericopes: {pericope_count}")
    print(f"Synoptic parallels: {parallel_count}")
    print(f"Saying clusters: {cluster_count}")

    print("\nBy Gospel:")
    for row in by_gospel:
        print(f"  - {row['gospel']}: {row['count']}")

    print("\nBy Tradition Type:")
    for row in by_tradition:
        print(f"  - {row['tradition_type']}: {row['count']}")


async def main():
    parser = argparse.ArgumentParser(description='Seed pericope data for Q reconstruction')
    parser.add_argument('--reset', action='store_true', help='Reset tables before seeding')
    args = parser.parse_args()

    print("="*50)
    print("LOGOS PERICOPE SEEDING")
    print("="*50)

    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)

    try:
        await create_pericope_tables(pool)
        await seed_pericopes(pool, reset=args.reset)
        await verify_data(pool)
        print("\nPericope seeding complete!")

    finally:
        await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
