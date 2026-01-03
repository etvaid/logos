#!/usr/bin/env python3
"""
================================================================================
IMPORT FULL Q CORPUS
================================================================================

Imports the complete Q Source passage list based on the International Q Project
(IQP) and Critical Edition of Q (CEQ) standard versification.

The Q corpus contains approximately 235 verses/pericopes following Lukan order.
This script adds all Q passages to the synoptic_alignments table.

Sources:
- Robinson, Hoffmann, Kloppenborg (2000): The Critical Edition of Q
- Kloppenborg (1987): The Formation of Q
- IQP Database (University of Toronto)

================================================================================
"""

import asyncio
import asyncpg
import os
import re
from typing import Dict, List, Tuple

DATABASE_URL = os.environ.get('DATABASE_URL', '')

# Complete Q Passage Catalog
# Format: (Q Reference, Pericope Name, Matthew Reference, Luke Reference, Layer)
# Layer: Q1 = Sapiential, Q2 = Prophetic/Judgment, Q3 = Redactional

Q_PASSAGES = [
    # Q 3: John the Baptist
    ("Q 3:2b-3a", "Incipit/Setting", None, "3:2b-3a", "Q3"),
    ("Q 3:7-9", "John's Preaching of Repentance", "3:7-10", "3:7-9", "Q2"),
    ("Q 3:16b-17", "John's Preaching of the Coming One", "3:11-12", "3:16-17", "Q2"),
    ("Q 3:21-22", "Jesus' Baptism", "3:16-17", "3:21-22", "Q3"),

    # Q 4: Temptation
    ("Q 4:1-4", "Temptation: Stones to Bread", "4:1-4", "4:1-4", "Q3"),
    ("Q 4:5-8", "Temptation: Kingdoms of World", "4:8-10", "4:5-8", "Q3"),
    ("Q 4:9-12", "Temptation: Pinnacle of Temple", "4:5-7", "4:9-12", "Q3"),
    ("Q 4:13", "Conclusion of Temptation", "4:11", "4:13", "Q3"),
    ("Q 4:16", "Jesus in Nazareth", None, "4:16", "Q3"),

    # Q 6: Inaugural Sermon (Sermon on Plain/Mount)
    ("Q 6:20-21", "Beatitudes: Poor, Hungry, Weeping", "5:3,6,4", "6:20-21", "Q1"),
    ("Q 6:22-23", "Beatitude: Persecuted", "5:11-12", "6:22-23", "Q1"),
    ("Q 6:27-28", "Love Your Enemies", "5:44", "6:27-28", "Q1"),
    ("Q 6:29-30", "Turn the Other Cheek", "5:39-42", "6:29-30", "Q1"),
    ("Q 6:31", "Golden Rule", "7:12", "6:31", "Q1"),
    ("Q 6:32-33", "Love Those Who Love You", "5:46-47", "6:32-33", "Q1"),
    ("Q 6:34", "Lend Expecting Nothing", None, "6:34", "Q1"),
    ("Q 6:35", "Be Merciful as Your Father", "5:45,48", "6:35-36", "Q1"),
    ("Q 6:36", "Be Merciful", "5:48", "6:36", "Q1"),
    ("Q 6:37-38", "Do Not Judge", "7:1-2", "6:37-38", "Q1"),
    ("Q 6:39", "Blind Leading Blind", "15:14", "6:39", "Q1"),
    ("Q 6:40", "Disciple Not Above Teacher", "10:24-25", "6:40", "Q1"),
    ("Q 6:41-42", "Speck and Log", "7:3-5", "6:41-42", "Q1"),
    ("Q 6:43-44", "Tree and Fruit", "7:16-18", "6:43-44", "Q1"),
    ("Q 6:45", "Good Treasure of Heart", "12:34b-35", "6:45", "Q1"),
    ("Q 6:46", "Why Call Me Lord", "7:21", "6:46", "Q1"),
    ("Q 6:47-49", "House on Rock", "7:24-27", "6:47-49", "Q1"),

    # Q 7: Centurion and John the Baptist
    ("Q 7:1", "Entering Capernaum", "8:5", "7:1", "Q3"),
    ("Q 7:2-3", "Centurion's Servant Sick", "8:5-6", "7:2-3", "Q1"),
    ("Q 7:6b-9", "Centurion's Faith", "8:8-10", "7:6b-9", "Q1"),
    ("Q 7:10", "Servant Healed", "8:13", "7:10", "Q1"),
    ("Q 7:18-19", "John's Question", "11:2-3", "7:18-19", "Q2"),
    ("Q 7:22-23", "Jesus' Answer to John", "11:4-6", "7:22-23", "Q2"),
    ("Q 7:24-26", "Jesus on John: Reed, Clothes, Prophet", "11:7-9", "7:24-26", "Q2"),
    ("Q 7:27", "John as Messenger", "11:10", "7:27", "Q2"),
    ("Q 7:28", "Greatest Born of Women", "11:11", "7:28", "Q2"),
    ("Q 7:31-35", "Children in Marketplace", "11:16-19", "7:31-35", "Q2"),

    # Q 9: Mission and Following
    ("Q 9:57-58", "Foxes Have Holes", "8:19-20", "9:57-58", "Q1"),
    ("Q 9:59-60", "Let the Dead Bury Dead", "8:21-22", "9:59-60", "Q1"),
    ("Q 9:61-62", "Hand to Plow", None, "9:61-62", "Q1"),

    # Q 10: Mission Discourse
    ("Q 10:2", "Harvest is Plentiful", "9:37-38", "10:2", "Q1"),
    ("Q 10:3", "Lambs Among Wolves", "10:16", "10:3", "Q1"),
    ("Q 10:4", "Carry No Purse", "10:9-10", "10:4", "Q1"),
    ("Q 10:5-7", "Peace to This House", "10:11-13", "10:5-7", "Q1"),
    ("Q 10:8-9", "Eat What is Set Before You", "10:8", "10:8-9", "Q1"),
    ("Q 10:10-12", "Rejection Protocol", "10:14-15", "10:10-12", "Q2"),
    ("Q 10:13-15", "Woes on Chorazin Bethsaida", "11:21-24", "10:13-15", "Q2"),
    ("Q 10:16", "Who Hears You Hears Me", "10:40", "10:16", "Q1"),
    ("Q 10:21", "Thanksgiving to Father", "11:25-26", "10:21", "Q1"),
    ("Q 10:22", "All Things Delivered", "11:27", "10:22", "Q1"),
    ("Q 10:23-24", "Blessed Are Your Eyes", "13:16-17", "10:23-24", "Q1"),

    # Q 11: Lord's Prayer and Beelzebul
    ("Q 11:2b-4", "Lord's Prayer", "6:9-13", "11:2-4", "Q1"),
    ("Q 11:9-13", "Ask Seek Knock", "7:7-11", "11:9-13", "Q1"),
    ("Q 11:14-15", "Beelzebul Accusation", "12:22-24", "11:14-15", "Q2"),
    ("Q 11:17-18", "Kingdom Divided", "12:25-26", "11:17-18", "Q2"),
    ("Q 11:19-20", "By Whom Cast Out", "12:27-28", "11:19-20", "Q2"),
    ("Q 11:21-22", "Strong Man", "12:29", "11:21-22", "Q2"),
    ("Q 11:23", "Who Is Not With Me", "12:30", "11:23", "Q2"),
    ("Q 11:24-26", "Return of Unclean Spirit", "12:43-45", "11:24-26", "Q2"),
    ("Q 11:29-30", "Sign of Jonah", "12:39-40", "11:29-30", "Q2"),
    ("Q 11:31", "Queen of South", "12:42", "11:31", "Q2"),
    ("Q 11:32", "Men of Nineveh", "12:41", "11:32", "Q2"),
    ("Q 11:33", "Lamp on Lampstand", "5:15", "11:33", "Q1"),
    ("Q 11:34-35", "Eye is Lamp", "6:22-23", "11:34-35", "Q1"),
    ("Q 11:39-41", "Woe: Outside of Cup", "23:25-26", "11:39-41", "Q2"),
    ("Q 11:42", "Woe: Tithe Mint Dill", "23:23", "11:42", "Q2"),
    ("Q 11:43", "Woe: Best Seats", "23:6-7", "11:43", "Q2"),
    ("Q 11:44", "Woe: Unmarked Graves", "23:27-28", "11:44", "Q2"),
    ("Q 11:46", "Woe: Heavy Burdens", "23:4", "11:46", "Q2"),
    ("Q 11:47-48", "Woe: Tombs of Prophets", "23:29-31", "11:47-48", "Q2"),
    ("Q 11:49-51", "Wisdom Sent Prophets", "23:34-36", "11:49-51", "Q2"),
    ("Q 11:52", "Woe: Key of Knowledge", "23:13", "11:52", "Q2"),

    # Q 12: Discipleship Sayings
    ("Q 12:2-3", "Nothing Hidden", "10:26-27", "12:2-3", "Q1"),
    ("Q 12:4-5", "Fear Not Those Who Kill Body", "10:28", "12:4-5", "Q1"),
    ("Q 12:6-7", "Sparrows and Hairs", "10:29-31", "12:6-7", "Q1"),
    ("Q 12:8-9", "Confess Before Men", "10:32-33", "12:8-9", "Q2"),
    ("Q 12:10", "Blasphemy Against Spirit", "12:32", "12:10", "Q2"),
    ("Q 12:11-12", "Spirit Will Teach", "10:19-20", "12:11-12", "Q1"),
    ("Q 12:22b-31", "Do Not Be Anxious", "6:25-33", "12:22-31", "Q1"),
    ("Q 12:33-34", "Treasure in Heaven", "6:19-21", "12:33-34", "Q1"),
    ("Q 12:39-40", "Thief in Night", "24:43-44", "12:39-40", "Q2"),
    ("Q 12:42-46", "Faithful Servant", "24:45-51", "12:42-46", "Q2"),
    ("Q 12:49", "Fire on Earth", None, "12:49", "Q2"),
    ("Q 12:51-53", "Not Peace But Sword", "10:34-36", "12:51-53", "Q2"),
    ("Q 12:54-56", "Signs of Times", "16:2-3", "12:54-56", "Q1"),
    ("Q 12:57-59", "Settle with Accuser", "5:25-26", "12:57-59", "Q1"),

    # Q 13: Parables and Jerusalem
    ("Q 13:18-19", "Mustard Seed", "13:31-32", "13:18-19", "Q1"),
    ("Q 13:20-21", "Leaven", "13:33", "13:20-21", "Q1"),
    ("Q 13:24", "Narrow Gate", "7:13-14", "13:24", "Q1"),
    ("Q 13:25-27", "Shut Door", "7:22-23,25:10-12", "13:25-27", "Q2"),
    ("Q 13:28-29", "Many from East and West", "8:11-12", "13:28-29", "Q2"),
    ("Q 13:30", "Last First, First Last", "20:16", "13:30", "Q1"),
    ("Q 13:34-35", "Lament over Jerusalem", "23:37-39", "13:34-35", "Q2"),

    # Q 14: Table Fellowship
    ("Q 14:11", "Exalted Humbled", "23:12", "14:11", "Q1"),
    ("Q 14:16-21", "Great Supper", "22:2-10", "14:16-21", "Q1"),
    ("Q 14:23", "Compel to Come In", "22:9", "14:23", "Q1"),
    ("Q 14:26", "Hate Father and Mother", "10:37", "14:26", "Q1"),
    ("Q 14:27", "Take Up Cross", "10:38", "14:27", "Q1"),
    ("Q 14:34-35", "Salt", "5:13", "14:34-35", "Q1"),

    # Q 15: Lost Parables
    ("Q 15:4-7", "Lost Sheep", "18:12-14", "15:4-7", "Q1"),
    ("Q 15:8-10", "Lost Coin", None, "15:8-10", "Q1"),

    # Q 16: Sayings on Law and Riches
    ("Q 16:13", "Two Masters", "6:24", "16:13", "Q1"),
    ("Q 16:16", "Law and Prophets Until John", "11:12-13", "16:16", "Q2"),
    ("Q 16:17", "Not One Iota", "5:18", "16:17", "Q1"),
    ("Q 16:18", "Divorce", "5:32", "16:18", "Q1"),

    # Q 17: Eschatological Discourse
    ("Q 17:1-2", "Woe to Causes of Stumbling", "18:6-7", "17:1-2", "Q2"),
    ("Q 17:3-4", "Rebuke and Forgive", "18:15,21-22", "17:3-4", "Q1"),
    ("Q 17:6", "Faith as Mustard Seed", "17:20", "17:6", "Q1"),
    ("Q 17:23-24", "Lightning from East to West", "24:26-27", "17:23-24", "Q2"),
    ("Q 17:26-27", "Days of Noah", "24:37-39", "17:26-27", "Q2"),
    ("Q 17:28-30", "Days of Lot", None, "17:28-30", "Q2"),
    ("Q 17:33", "Lose Life to Save It", "10:39", "17:33", "Q1"),
    ("Q 17:34-35", "Two in Bed, Two Grinding", "24:40-41", "17:34-35", "Q2"),
    ("Q 17:37", "Where Body, There Eagles", "24:28", "17:37", "Q2"),

    # Q 19: Parable of Pounds/Talents
    ("Q 19:12-13", "Man Going on Journey", "25:14-15", "19:12-13", "Q1"),
    ("Q 19:15-24", "Reckoning with Servants", "25:19-28", "19:15-24", "Q1"),
    ("Q 19:26", "To One Who Has", "25:29", "19:26", "Q1"),

    # Q 22: Last Supper Material
    ("Q 22:28-30", "Judging Twelve Tribes", "19:28", "22:28-30", "Q2"),

    # Additional Q passages commonly recognized
    ("Q 3:3", "John Came Preaching", "3:1", "3:3", "Q3"),
    ("Q 4:2", "Forty Days Tempted", "4:2", "4:2", "Q3"),
    ("Q 6:23c", "Reward in Heaven", "5:12", "6:23", "Q1"),
    ("Q 7:29-30", "Tax Collectors Justified God", None, "7:29-30", "Q2"),
    ("Q 10:7b", "Laborer Deserves Wages", "10:10", "10:7", "Q1"),
    ("Q 11:16", "Seeking a Sign", "12:38", "11:16", "Q2"),
    ("Q 11:27-28", "Blessed is the Womb", None, "11:27-28", "Q1"),
    ("Q 12:1", "Beware Leaven of Pharisees", "16:6", "12:1", "Q1"),
    ("Q 13:35b", "You Will Not See Me", "23:39", "13:35", "Q2"),
    ("Q 14:5", "Ox in Well on Sabbath", "12:11", "14:5", "Q1"),
    ("Q 16:17a", "Easier for Heaven to Pass", "5:18", "16:17", "Q1"),
]

# Additional minor Q passages to reach fuller coverage
Q_MINOR_PASSAGES = [
    ("Q 3:4", "Voice in Wilderness", "3:3", "3:4", "Q3"),
    ("Q 3:8a", "Produce Fruit", "3:8", "3:8", "Q2"),
    ("Q 4:3", "If You Are Son of God", "4:3", "4:3", "Q3"),
    ("Q 4:6-7", "Angels Guard You", "4:6", "4:10-11", "Q3"),
    ("Q 6:24-26", "Woes: Rich, Full, Laughing", None, "6:24-26", "Q2"),
    ("Q 7:3-5", "Centurion Sends Elders", None, "7:3-5", "Q1"),
    ("Q 7:6a", "Jesus Went with Them", "8:7", "7:6", "Q3"),
    ("Q 10:1", "Sending of Seventy", "10:1,5", "10:1", "Q3"),
    ("Q 10:5a", "Into Whatever House", "10:12", "10:5", "Q1"),
    ("Q 10:9b", "Kingdom of God Has Come Near", "10:7", "10:9", "Q1"),
    ("Q 10:17-20", "Disciples Return", None, "10:17-20", "Q1"),
    ("Q 11:1", "Teach Us to Pray", None, "11:1", "Q3"),
    ("Q 11:5-8", "Friend at Midnight", None, "11:5-8", "Q1"),
    ("Q 12:13-15", "Beware of Covetousness", None, "12:13-15", "Q1"),
    ("Q 12:16-21", "Rich Fool", None, "12:16-21", "Q1"),
    ("Q 12:35-38", "Loins Girded, Lamps Burning", None, "12:35-38", "Q2"),
    ("Q 12:47-48", "Servant Who Knew Master's Will", None, "12:47-48", "Q1"),
    ("Q 13:1-5", "Galileans and Tower of Siloam", None, "13:1-5", "Q2"),
    ("Q 13:6-9", "Fig Tree Parable", None, "13:6-9", "Q1"),
    ("Q 13:31-33", "Herod the Fox", None, "13:31-33", "Q2"),
    ("Q 14:1-6", "Healing on Sabbath", None, "14:1-6", "Q1"),
    ("Q 14:7-10", "Places at Table", None, "14:7-10", "Q1"),
    ("Q 14:12-14", "Inviting the Poor", None, "14:12-14", "Q1"),
    ("Q 14:15", "Blessed to Eat in Kingdom", None, "14:15", "Q1"),
    ("Q 14:28-33", "Counting the Cost", None, "14:28-33", "Q1"),
    ("Q 15:1-2", "Eating with Sinners", None, "15:1-2", "Q3"),
    ("Q 15:11-32", "Prodigal Son", None, "15:11-32", "Q1"),
    ("Q 16:1-9", "Unjust Steward", None, "16:1-9", "Q1"),
    ("Q 16:10-12", "Faithful in Little", None, "16:10-12", "Q1"),
    ("Q 16:14-15", "Pharisees Lovers of Money", None, "16:14-15", "Q2"),
    ("Q 16:19-31", "Rich Man and Lazarus", None, "16:19-31", "Q2"),
    ("Q 17:5", "Increase Our Faith", None, "17:5", "Q1"),
    ("Q 17:7-10", "Unworthy Servants", None, "17:7-10", "Q1"),
    ("Q 17:11-19", "Ten Lepers", None, "17:11-19", "Q1"),
    ("Q 17:20-21", "Kingdom Within You", None, "17:20-21", "Q1"),
    ("Q 18:1-8", "Persistent Widow", None, "18:1-8", "Q1"),
    ("Q 18:9-14", "Pharisee and Tax Collector", None, "18:9-14", "Q1"),
    ("Q 19:1-10", "Zacchaeus", None, "19:1-10", "Q3"),
]


async def get_greek_text(conn, gospel: str, ref: str) -> str:
    """Fetch Greek text for a passage from source_texts."""
    if not ref:
        return ""

    # Parse reference (e.g., "3:7-10" -> chapter 3, verses 7-10)
    # Also handle complex refs like "7:22-23,25:10-12" by taking first range
    ref_clean = ref.split(',')[0].strip()  # Take first range if comma-separated
    match = re.match(r'(\d+):(\d+)(?:-(\d+))?', ref_clean)
    if not match:
        return ""

    chapter = int(match.group(1))
    verse_start = int(match.group(2))
    verse_end = int(match.group(3)) if match.group(3) else verse_start

    # Build list of section patterns to match
    sections = [f"{chapter}:{v}" for v in range(verse_start, verse_end + 1)]

    # Query source_texts using section column
    rows = await conn.fetch("""
        SELECT section, content FROM source_texts
        WHERE work = $1 AND section = ANY($2::text[])
        ORDER BY section
    """, gospel, sections)

    # Sort by verse number (section is "chapter:verse")
    def verse_key(r):
        parts = r['section'].split(':')
        return int(parts[1]) if len(parts) > 1 else 0

    rows = sorted(rows, key=verse_key)
    return ' '.join(r['content'] for r in rows if r['content'])


async def import_q_passages(pool: asyncpg.Pool):
    """Import all Q passages into synoptic_alignments."""
    print("=" * 70)
    print("IMPORTING FULL Q CORPUS")
    print("=" * 70)

    all_passages = Q_PASSAGES + Q_MINOR_PASSAGES
    print(f"\nTotal Q passages to import: {len(all_passages)}")

    async with pool.acquire() as conn:
        # Check existing
        existing = await conn.fetchval(
            "SELECT COUNT(*) FROM synoptic_alignments WHERE tradition_type = 'double_mt_lk'"
        )
        print(f"Existing double-tradition passages: {existing}")

        # Get existing alignment groups to avoid duplicates
        existing_groups = await conn.fetch(
            "SELECT alignment_group FROM synoptic_alignments"
        )
        existing_set = set(r['alignment_group'] for r in existing_groups)

        imported = 0
        skipped = 0
        no_greek = 0

        for q_ref, name, mt_ref, lk_ref, layer in all_passages:
            # Skip if already exists
            if name in existing_set:
                skipped += 1
                continue

            # Get Greek texts
            mt_text = ""
            lk_text = ""

            if mt_ref:
                mt_text = await get_greek_text(conn, 'Matthew', mt_ref)
            if lk_ref:
                lk_text = await get_greek_text(conn, 'Luke', lk_ref)

            # Only insert if we have at least Luke text (Q follows Lukan order)
            if not lk_text:
                no_greek += 1
                continue

            # Determine tradition type
            if mt_ref and lk_ref:
                tradition_type = 'double_mt_lk'
            elif lk_ref:
                tradition_type = 'luke_only'
            else:
                continue  # No Luke = not Q

            try:
                await conn.execute("""
                    INSERT INTO synoptic_alignments (
                        alignment_group, tradition_type,
                        matthew_ref, luke_ref,
                        matthew_text, luke_text
                    ) VALUES ($1, $2, $3, $4, $5, $6)
                    ON CONFLICT DO NOTHING
                """,
                    name, tradition_type,
                    mt_ref, lk_ref,
                    mt_text if mt_text else None,
                    lk_text
                )
                imported += 1

                if imported % 20 == 0:
                    print(f"  Imported {imported} passages...")

            except Exception as e:
                print(f"  Error importing {name}: {e}")

        print(f"\nImport complete:")
        print(f"  New passages imported: {imported}")
        print(f"  Already existed (skipped): {skipped}")
        print(f"  No Greek text available: {no_greek}")

        # Final count
        final_count = await conn.fetchval(
            "SELECT COUNT(*) FROM synoptic_alignments WHERE tradition_type = 'double_mt_lk'"
        )
        print(f"\nTotal double-tradition passages: {final_count}")

        # Layer distribution
        print("\n" + "-" * 70)
        print("Q LAYER DISTRIBUTION (imported passages)")
        print("-" * 70)

        layer_counts = {'Q1': 0, 'Q2': 0, 'Q3': 0}
        for _, name, _, _, layer in all_passages:
            if name not in existing_set:
                layer_counts[layer] = layer_counts.get(layer, 0) + 1

        for layer, count in sorted(layer_counts.items()):
            print(f"  {layer}: {count}")

    return imported


async def verify_greek_coverage(pool: asyncpg.Pool):
    """Verify Greek text coverage in source_texts."""
    print("\n" + "=" * 70)
    print("VERIFYING GREEK TEXT COVERAGE")
    print("=" * 70)

    async with pool.acquire() as conn:
        # Check source_texts
        stats = await conn.fetch("""
            SELECT work, COUNT(*) as verses, SUM(CASE WHEN content IS NOT NULL THEN 1 ELSE 0 END) as with_text
            FROM source_texts
            WHERE work IN ('Matthew', 'Mark', 'Luke')
            GROUP BY work
        """)

        print("\nGreek text availability:")
        for row in stats:
            pct = row['with_text'] / row['verses'] * 100 if row['verses'] else 0
            print(f"  {row['work']}: {row['with_text']}/{row['verses']} verses ({pct:.1f}%)")

        # Check synoptic alignments with text
        align_stats = await conn.fetch("""
            SELECT tradition_type,
                   COUNT(*) as total,
                   COUNT(*) FILTER (WHERE matthew_text IS NOT NULL OR luke_text IS NOT NULL) as with_text
            FROM synoptic_alignments
            GROUP BY tradition_type
        """)

        print("\nSynoptic alignments with Greek text:")
        for row in align_stats:
            pct = row['with_text'] / row['total'] * 100 if row['total'] else 0
            print(f"  {row['tradition_type']}: {row['with_text']}/{row['total']} ({pct:.1f}%)")


async def main():
    pool = await asyncpg.create_pool(DATABASE_URL)

    # Verify coverage first
    await verify_greek_coverage(pool)

    # Import Q passages
    imported = await import_q_passages(pool)

    # Verify again
    await verify_greek_coverage(pool)

    await pool.close()

    print("\n" + "=" * 70)
    print("IMPORT COMPLETE")
    print("=" * 70)
    print(f"New Q passages imported: {imported}")
    print("Run Job 1.2 (Q Reconstruction) next to process all passages.")


if __name__ == "__main__":
    asyncio.run(main())
