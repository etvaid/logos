#!/usr/bin/env python3
"""
================================================================================
IMPORT GOSPEL OF THOMAS
================================================================================

Imports the Gospel of Thomas (114 logia) for stylometric comparison with Q.

Greek Fragments Available (POxy):
- POxy 1: Logia 26-33 (partial)
- POxy 654: Prologue, Logia 1-7
- POxy 655: Logia 36-39 (partial)

The remaining logia are available only in Coptic (Nag Hammadi Codex II).
For stylometric comparison, we use:
1. Greek fragments where available
2. Q parallels identified by scholars
3. Coptic text for reference

Key Q Parallels in Thomas (based on scholarly consensus):
- Th 3 // Q 17:20-21 (Kingdom within)
- Th 4 // Q 13:30 (First and last)
- Th 5 // Q 12:2 (Nothing hidden)
- Th 6 // Q 6:20, 11:9-10
- Th 9 // Q (Sower - Mark parallel)
- Th 10 // Q 12:49 (Fire on earth)
- Th 14 // Q 10:8-9 (Eat what is set)
- Th 16 // Q 12:51-53 (Not peace but sword)
- Th 20 // Q 13:18-19 (Mustard seed)
- Th 26 // Q 6:41-42 (Speck and log)
- Th 32 // Q 11:33 (City on hill)
- Th 33 // Q 11:33, 12:3 (Lamp)
- Th 34 // Q 6:39 (Blind leading blind)
- Th 35 // Q 11:21-22 (Strong man)
- Th 36 // Q 12:22 (Do not worry)
- Th 39 // Q 11:52 (Keys of knowledge)
- Th 40 // Q 6:43-44 (Tree and fruit)
- Th 44 // Q 12:10 (Blasphemy)
- Th 45 // Q 6:43-45 (Good treasure)
- Th 46 // Q 7:28 (Greatest born)
- Th 47 // Q 16:13 (Two masters)
- Th 54 // Q 6:20 (Blessed poor)
- Th 55 // Q 14:26-27 (Hate father, take cross)
- Th 57 // Q 13:24-30 (Weeds - Matt only)
- Th 61 // Q 17:34-35 (Two on couch)
- Th 62 // Q 12:2-3 (Mysteries)
- Th 63 // Q 12:16-21 (Rich fool)
- Th 64 // Q 14:16-24 (Great supper)
- Th 68-69 // Q 6:22-23 (Blessed persecuted)
- Th 73 // Q 10:2 (Harvest plentiful)
- Th 76 // Q 13:45-46 (Pearl - Matt only)
- Th 78 // Q 7:24-25 (Reed in wind)
- Th 86 // Q 9:57-58 (Foxes have holes)
- Th 89 // Q 11:39-41 (Outside of cup)
- Th 91 // Q 12:54-56 (Signs of times)
- Th 92 // Q 11:9-10 (Seek and find)
- Th 94 // Q 11:9-10 (Knock)
- Th 95 // Q 6:34 (Lend)
- Th 96 // Q 13:20-21 (Leaven)
- Th 107 // Q 15:4-7 (Lost sheep)
- Th 113 // Q 17:20-21 (Kingdom not coming)

================================================================================
"""

import asyncio
import asyncpg
import os
import json
from typing import Dict, List

DATABASE_URL = os.environ.get('DATABASE_URL', '')

# Gospel of Thomas - 114 Logia
# Format: (logion_num, greek_text or None, coptic_translation, q_parallel or None)
# Greek text from POxy 1, 654, 655 reconstructions

THOMAS_LOGIA = [
    # Prologue and Logia 1-7 (POxy 654 - Greek available)
    (0, "Οὗτοι οἱ λόγοι οἱ [ἀπόκρυφοι οὓς ἐλά]λησεν Ἰη(σοῦ)ς ὁ ζῶν",
     "These are the secret sayings which the living Jesus spoke",
     None),

    (1, "καὶ ἔγραψεν Ἰούδ[ας ὁ καὶ Θωμᾶς· καὶ εἶ]πεν· ὃς ἂν τὴν ἑρμηνείαν τῶν λόγων τούτων εὕρῃ θανάτου οὐ μὴ γεύσεται",
     "And he said, Whoever finds the interpretation of these sayings will not experience death",
     None),

    (2, "λέγει Ἰη(σοῦ)ς· μὴ παυσάσ[θω ὁ ζητ]ῶν τοῦ ζητεῖν ἕως ἂ[ν] εὕρῃ καὶ ὅταν εὕρῃ [θαμβη]θήσεται καὶ θαμβηθεὶς βασ[ιλεύσ]ει καὶ βασιλεύσας ἀναπα[ήσετα]ι",
     "Jesus said, Let him who seeks continue seeking until he finds. When he finds, he will become troubled. When he becomes troubled, he will be astonished, and he will rule over all",
     None),

    (3, "λέγει Ἰη(σοῦ)ς· ἐὰν οἱ ἕλκον[τες ὑμᾶ]ς εἴπωσιν ὑμῖν· ἰδοὺ ἐν [τ]ῷ οὐρανῷ ἐστιν ἡ βα[σιλεία], προφθάσει ὑμᾶς τὰ πετεινὰ τοῦ οὐρανοῦ",
     "Jesus said, If those who lead you say, See, the Kingdom is in the sky, then the birds will precede you",
     "Q 17:20-21"),

    (4, "λέγει Ἰη(σοῦ)ς· οὐκ ὀκ[ν]ήσει ἄνθρωπος πρεσβύ[τη]ς ἐν ταῖς ἡμέραις αὐτοῦ ἐπερωτῆσαι παιδίον ἑπτὰ ἡμερῶν περὶ τοῦ τόπου τῆς ζωῆς",
     "Jesus said, The man old in days will not hesitate to ask a small child seven days old about the place of life",
     "Q 13:30"),

    (5, "λέγει Ἰη(σοῦ)ς· γνῶθι τὸ ὂν ἔμπροσθεν τῆς ὄψεώς σου καὶ τὸ κεκρυμμένον ἀπὸ σοῦ ἀποκαλυφθήσεταί σοι· οὐ γάρ ἐστιν κρυπτὸν ὃ οὐ φανερὸν γενήσεται",
     "Jesus said, Recognize what is in your sight, and that which is hidden will become plain to you. For there is nothing hidden which will not become manifest",
     "Q 12:2"),

    (6, None,  # Fragmentary in Greek
     "His disciples questioned him and said to him, Do you want us to fast? How shall we pray? Shall we give alms?",
     "Q 6:20, 11:9-10"),

    (7, None,  # Fragmentary in Greek
     "Jesus said, Blessed is the lion which becomes man when consumed by man",
     None),

    # Logia 8-25 (Coptic only)
    (8, None, "And he said, The man is like a wise fisherman who cast his net into the sea", None),
    (9, None, "Jesus said, Now the sower went out, took a handful of seeds, and scattered them", None),
    (10, None, "Jesus said, I have cast fire upon the world, and see, I am guarding it until it blazes", "Q 12:49"),
    (11, None, "Jesus said, This heaven will pass away, and the one above it will pass away", None),
    (12, None, "The disciples said to Jesus, We know that you will depart from us", None),
    (13, None, "Jesus said to his disciples, Compare me to someone and tell me whom I am like", None),
    (14, None, "Jesus said to them, If you fast, you will give rise to sin for yourselves", "Q 10:8-9"),
    (15, None, "Jesus said, When you see one who was not born of woman, prostrate yourselves", None),
    (16, None, "Jesus said, Men think, perhaps, that it is peace which I have come to cast upon the world", "Q 12:51-53"),
    (17, None, "Jesus said, I shall give you what no eye has seen and what no ear has heard", None),
    (18, None, "The disciples said to Jesus, Tell us how our end will be", None),
    (19, None, "Jesus said, Blessed is he who came into being before he came into being", None),
    (20, None, "The disciples said to Jesus, Tell us what the Kingdom of Heaven is like", "Q 13:18-19"),
    (21, None, "Mary said to Jesus, Whom are your disciples like?", None),
    (22, None, "Jesus saw infants being suckled. He said to his disciples, These infants being suckled", None),
    (23, None, "Jesus said, I shall choose you, one out of a thousand, and two out of ten thousand", None),
    (24, None, "His disciples said to him, Show us the place where you are", None),
    (25, None, "Jesus said, Love your brother like your soul, guard him like the pupil of your eye", None),

    # Logia 26-33 (POxy 1 - Greek partially available)
    (26, "λέγει Ἰη(σοῦ)ς· τὸ κάρφος τὸ ἐν τῷ ὀφθαλμῷ τοῦ ἀδελφοῦ σου βλέπεις τὴν δὲ δοκὸν τὴν ἐν τῷ σῷ ὀφθαλμῷ οὐ βλέπεις",
     "Jesus said, You see the mote in your brother's eye, but you do not see the beam in your own eye",
     "Q 6:41-42"),

    (27, "λέγει Ἰη(σοῦ)ς· ἐὰν μὴ νηστεύσητε τὸν κόσμον οὐ μὴ εὕρητε τὴν βασιλείαν τοῦ θεοῦ",
     "Jesus said, If you do not fast as regards the world, you will not find the Kingdom",
     None),

    (28, "λέγει Ἰη(σοῦ)ς· ἔστην ἐν μέσῳ τοῦ κόσμου καὶ ἐν σαρκὶ ὤφθην αὐτοῖς",
     "Jesus said, I took my place in the midst of the world, and I appeared to them in flesh",
     None),

    (29, None, "Jesus said, If the flesh came into being because of spirit, it is a wonder", None),

    (30, "λέγει Ἰη(σοῦ)ς· ὅπου ἐὰν ὦσιν [τρεῖς θε]οί εἰσιν καὶ ὅπου εἷς ἐ[στιν μόν]ος ἐγώ εἰμι μετ᾽ αὐτοῦ",
     "Jesus said, Where there are three gods, they are gods. Where there are two or one, I am with him",
     None),

    (31, "λέγει Ἰη(σοῦ)ς· οὐκ ἔστιν δεκτὸς προφήτης ἐν τῇ πατρίδι αὐτοῦ οὐδὲ ἰατρὸς ποιεῖ θεραπείας εἰς τοὺς γινώσκοντας αὐτόν",
     "Jesus said, No prophet is accepted in his own village; no physician heals those who know him",
     None),

    (32, "λέγει Ἰη(σοῦ)ς· πόλις οἰκοδομημένη ἐπ᾽ ἄκρον ὄρους ὑψηλοῦ καὶ ἐστηριγμένη οὔτε πεσεῖν δύναται οὔτε κρυβῆναι",
     "Jesus said, A city being built on a high mountain and fortified cannot fall, nor can it be hidden",
     "Q 11:33"),

    (33, "λέγει Ἰη(σοῦ)ς· ὃ ἀκούεις εἰς τὸ ἓν ὠτίον σου [τοῦτο κήρυσσ]ε ἐπὶ τῶν δωμάτων ὑμῶν",
     "Jesus said, Preach from your housetops that which you will hear in your ear",
     "Q 11:33, 12:3"),

    (34, None, "Jesus said, If a blind man leads a blind man, they will both fall into a pit", "Q 6:39"),
    (35, None, "Jesus said, It is not possible for anyone to enter the house of a strong man", "Q 11:21-22"),

    # Logia 36-39 (POxy 655 - Greek partially available)
    (36, "[λέγει Ἰη(σοῦ)ς μὴ] μεριμνᾶ[τε ἀπὸ πρωῒ] ἕως ὀψ[ὲ μηδ]ὲ ἀφ᾽ ἑ[σπέρας] ἕως πρωῒ",
     "Jesus said, Do not be concerned from morning until evening and from evening until morning",
     "Q 12:22"),

    (37, None, "His disciples said, When will you become revealed to us and when shall we see you?", None),

    (38, None, "Jesus said, Many times have you desired to hear these words which I am saying to you", None),

    (39, "λέγει Ἰ[η(σοῦ)ς· οἱ Φ]αρισαῖοι κ[αὶ οἱ γραμμ]ατεῖς ἔλα[βον τὰς κλεῖ]δας τῆς [γνώσεως ἔκρυ]ψαν αὐτά[ς",
     "Jesus said, The Pharisees and the scribes have taken the keys of knowledge and hidden them",
     "Q 11:52"),

    # Logia 40-114 (Coptic only - with Q parallels noted)
    (40, None, "Jesus said, A grapevine has been planted outside of the Father", "Q 6:43-44"),
    (41, None, "Jesus said, Whoever has something in his hand will receive more", None),
    (42, None, "Jesus said, Become passers-by", None),
    (43, None, "His disciples said to him, Who are you, that you should say these things to us?", None),
    (44, None, "Jesus said, Whoever blasphemes against the Father will be forgiven", "Q 12:10"),
    (45, None, "Jesus said, Grapes are not harvested from thorns, nor are figs gathered from thistles", "Q 6:43-45"),
    (46, None, "Jesus said, Among those born of women, from Adam until John the Baptist", "Q 7:28"),
    (47, None, "Jesus said, It is impossible for a man to mount two horses or to stretch two bows", "Q 16:13"),
    (48, None, "Jesus said, If two make peace with each other in this one house", None),
    (49, None, "Jesus said, Blessed are the solitary and elect, for you will find the Kingdom", None),
    (50, None, "Jesus said, If they say to you, Where did you come from?", None),
    (51, None, "His disciples said to him, When will the repose of the dead come about?", None),
    (52, None, "His disciples said to him, Twenty-four prophets spoke in Israel", None),
    (53, None, "His disciples said to him, Is circumcision beneficial or not?", None),
    (54, None, "Jesus said, Blessed are the poor, for yours is the Kingdom of Heaven", "Q 6:20"),
    (55, None, "Jesus said, Whoever does not hate his father and his mother cannot become a disciple", "Q 14:26-27"),
    (56, None, "Jesus said, Whoever has come to understand the world has found only a corpse", None),
    (57, None, "Jesus said, The Kingdom of the Father is like a man who had good seed", None),
    (58, None, "Jesus said, Blessed is the man who has suffered and found life", None),
    (59, None, "Jesus said, Take heed of the Living One while you are alive", None),
    (60, None, "They saw a Samaritan carrying a lamb on his way to Judea", None),
    (61, None, "Jesus said, Two will rest on a bed: the one will die, and the other will live", "Q 17:34-35"),
    (62, None, "Jesus said, It is to those who are worthy of my mysteries that I tell my mysteries", "Q 12:2-3"),
    (63, None, "Jesus said, There was a rich man who had much money", "Q 12:16-21"),
    (64, None, "Jesus said, A man had received visitors. And when he had prepared the dinner", "Q 14:16-24"),
    (65, None, "He said, There was a good man who owned a vineyard", None),
    (66, None, "Jesus said, Show me the stone which the builders have rejected", None),
    (67, None, "Jesus said, If one who knows the all still feels a personal deficiency", None),
    (68, None, "Jesus said, Blessed are you when you are hated and persecuted", "Q 6:22-23"),
    (69, None, "Jesus said, Blessed are they who have been persecuted within themselves", "Q 6:22-23"),
    (70, None, "Jesus said, That which you have will save you if you bring it forth from yourselves", None),
    (71, None, "Jesus said, I shall destroy this house, and no one will be able to rebuild it", None),
    (72, None, "A man said to him, Tell my brothers to divide my father's possessions with me", None),
    (73, None, "Jesus said, The harvest is great but the laborers are few", "Q 10:2"),
    (74, None, "He said, O Lord, there are many around the drinking trough", None),
    (75, None, "Jesus said, Many are standing at the door, but it is the solitary who will enter", None),
    (76, None, "Jesus said, The Kingdom of the Father is like a merchant who had a consignment", None),
    (77, None, "Jesus said, It is I who am the light which is above them all", None),
    (78, None, "Jesus said, Why have you come out into the desert? To see a reed shaken by wind?", "Q 7:24-25"),
    (79, None, "A woman from the crowd said to him, Blessed are the womb which bore you", None),
    (80, None, "Jesus said, He who has recognized the world has found the body", None),
    (81, None, "Jesus said, Let him who has grown rich be king", None),
    (82, None, "Jesus said, He who is near me is near the fire", None),
    (83, None, "Jesus said, The images are manifest to man, but the light in them remains concealed", None),
    (84, None, "Jesus said, When you see your likeness, you rejoice", None),
    (85, None, "Jesus said, Adam came into being from a great power and a great wealth", None),
    (86, None, "Jesus said, The foxes have their holes and the birds have their nests", "Q 9:57-58"),
    (87, None, "Jesus said, Wretched is the body that is dependent upon a body", None),
    (88, None, "Jesus said, The angels and the prophets will come to you", None),
    (89, None, "Jesus said, Why do you wash the outside of the cup?", "Q 11:39-41"),
    (90, None, "Jesus said, Come unto me, for my yoke is easy and my lordship is mild", None),
    (91, None, "They said to him, Tell us who you are so that we may believe in you", "Q 12:54-56"),
    (92, None, "Jesus said, Seek and you will find", "Q 11:9-10"),
    (93, None, "Do not give what is holy to dogs", None),
    (94, None, "Jesus said, He who seeks will find, and he who knocks will be let in", "Q 11:9-10"),
    (95, None, "Jesus said, If you have money, do not lend it at interest", "Q 6:34"),
    (96, None, "Jesus said, The Kingdom of the Father is like a certain woman", "Q 13:20-21"),
    (97, None, "Jesus said, The Kingdom of the Father is like a certain woman who was carrying a jar", None),
    (98, None, "Jesus said, The Kingdom of the Father is like a certain man who wanted to kill", None),
    (99, None, "The disciples said to him, Your brothers and your mother are standing outside", None),
    (100, None, "They showed Jesus a gold coin and said to him, Caesar's men demand taxes", None),
    (101, None, "Whoever does not hate his father and his mother as I do cannot become a disciple", None),
    (102, None, "Jesus said, Woe to the Pharisees, for they are like a dog sleeping in the manger", None),
    (103, None, "Jesus said, Fortunate is the man who knows where the brigands will enter", None),
    (104, None, "They said to Jesus, Come, let us pray today and let us fast", None),
    (105, None, "Jesus said, He who knows the father and the mother will be called the son of a harlot", None),
    (106, None, "Jesus said, When you make the two one, you will become the sons of man", None),
    (107, None, "Jesus said, The Kingdom is like a shepherd who had a hundred sheep", "Q 15:4-7"),
    (108, None, "Jesus said, He who will drink from my mouth will become like me", None),
    (109, None, "Jesus said, The Kingdom is like a man who had a hidden treasure", None),
    (110, None, "Jesus said, Whoever finds the world and becomes rich, let him renounce the world", None),
    (111, None, "Jesus said, The heavens and the earth will be rolled up in your presence", None),
    (112, None, "Jesus said, Woe to the flesh that depends on the soul", None),
    (113, None, "His disciples said to him, When will the Kingdom come?", "Q 17:20-21"),
    (114, None, "Simon Peter said to them, Let Mary leave us, for women are not worthy of Life", None),
]

# Thomas-Q Parallel mapping
THOMAS_Q_PARALLELS = {
    3: "Q 17:20-21",
    4: "Q 13:30",
    5: "Q 12:2",
    6: "Q 6:20, 11:9-10",
    10: "Q 12:49",
    14: "Q 10:8-9",
    16: "Q 12:51-53",
    20: "Q 13:18-19",
    26: "Q 6:41-42",
    32: "Q 11:33",
    33: "Q 11:33, 12:3",
    34: "Q 6:39",
    35: "Q 11:21-22",
    36: "Q 12:22",
    39: "Q 11:52",
    40: "Q 6:43-44",
    44: "Q 12:10",
    45: "Q 6:43-45",
    46: "Q 7:28",
    47: "Q 16:13",
    54: "Q 6:20",
    55: "Q 14:26-27",
    61: "Q 17:34-35",
    62: "Q 12:2-3",
    63: "Q 12:16-21",
    64: "Q 14:16-24",
    68: "Q 6:22-23",
    69: "Q 6:22-23",
    73: "Q 10:2",
    78: "Q 7:24-25",
    86: "Q 9:57-58",
    89: "Q 11:39-41",
    91: "Q 12:54-56",
    92: "Q 11:9-10",
    94: "Q 11:9-10",
    95: "Q 6:34",
    96: "Q 13:20-21",
    107: "Q 15:4-7",
    113: "Q 17:20-21",
}


async def import_thomas(pool: asyncpg.Pool):
    """Import Gospel of Thomas into database."""
    print("=" * 70)
    print("IMPORTING GOSPEL OF THOMAS")
    print("=" * 70)

    async with pool.acquire() as conn:
        # Create thomas_logia table if not exists
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS thomas_logia (
                id SERIAL PRIMARY KEY,
                logion_num INTEGER UNIQUE NOT NULL,
                greek_text TEXT,
                coptic_translation TEXT,
                q_parallel TEXT,
                has_greek BOOLEAN DEFAULT FALSE,
                word_count INTEGER,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)

        # Create thomas_q_parallels table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS thomas_q_parallels (
                id SERIAL PRIMARY KEY,
                thomas_logion INTEGER NOT NULL,
                q_reference TEXT NOT NULL,
                parallel_type TEXT DEFAULT 'thematic',
                confidence FLOAT DEFAULT 0.5,
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(thomas_logion, q_reference)
            )
        """)

        # Clear existing data
        await conn.execute("DELETE FROM thomas_logia")
        await conn.execute("DELETE FROM thomas_q_parallels")

        imported = 0
        greek_count = 0
        q_parallel_count = 0

        for logion_num, greek_text, coptic, q_parallel in THOMAS_LOGIA:
            has_greek = greek_text is not None and len(greek_text) > 0
            if has_greek:
                greek_count += 1

            # Count words in Greek if available
            word_count = len(greek_text.split()) if greek_text else 0

            await conn.execute("""
                INSERT INTO thomas_logia (logion_num, greek_text, coptic_translation, q_parallel, has_greek, word_count)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (logion_num) DO UPDATE SET
                    greek_text = EXCLUDED.greek_text,
                    coptic_translation = EXCLUDED.coptic_translation,
                    q_parallel = EXCLUDED.q_parallel,
                    has_greek = EXCLUDED.has_greek,
                    word_count = EXCLUDED.word_count
            """, logion_num, greek_text, coptic, q_parallel, has_greek, word_count)
            imported += 1

        # Import Q parallels
        for thomas_logion, q_ref in THOMAS_Q_PARALLELS.items():
            # Some entries have multiple Q refs
            for ref in q_ref.split(', '):
                await conn.execute("""
                    INSERT INTO thomas_q_parallels (thomas_logion, q_reference, parallel_type, confidence)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (thomas_logion, q_reference) DO NOTHING
                """, thomas_logion, ref.strip(), 'scholarly_consensus', 0.8)
                q_parallel_count += 1

    print(f"\nImport complete:")
    print(f"  Total logia: {imported}")
    print(f"  With Greek text: {greek_count}")
    print(f"  With Q parallels: {len(THOMAS_Q_PARALLELS)}")
    print(f"  Q parallel mappings: {q_parallel_count}")

    # Verify
    async with pool.acquire() as conn:
        stats = await conn.fetchrow("""
            SELECT
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE has_greek) as with_greek,
                COUNT(*) FILTER (WHERE q_parallel IS NOT NULL) as with_q_parallel
            FROM thomas_logia
        """)

        print(f"\nVerification:")
        print(f"  Total logia in DB: {stats['total']}")
        print(f"  With Greek fragments: {stats['with_greek']}")
        print(f"  With Q parallels: {stats['with_q_parallel']}")

    return {
        'total_logia': imported,
        'greek_fragments': greek_count,
        'q_parallels': len(THOMAS_Q_PARALLELS)
    }


async def main():
    pool = await asyncpg.create_pool(DATABASE_URL)
    results = await import_thomas(pool)
    await pool.close()

    print("\n" + "=" * 70)
    print("THOMAS IMPORT COMPLETE")
    print("=" * 70)
    print(f"Ready for stylometric analysis (Job 2.2)")

    return results


if __name__ == "__main__":
    asyncio.run(main())
