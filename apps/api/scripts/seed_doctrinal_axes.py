#!/usr/bin/env python3
"""
LOGOS Doctrinal Axes Seeding Script
=====================================

Seeds the doctrinal axes used for theological vocabulary analysis in Q reconstruction.
Includes Greek terms for:
- Christology (High vs Low)
- Cosmology (Gnostic vs Proto-Orthodox)
- Asceticism (High vs Low)
- Law/Ritual (Pro-Law vs Anti-Law)
- Anti-Temple sentiment

Usage:
    python scripts/seed_doctrinal_axes.py [--reset]
"""

import asyncio
import argparse
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncpg
from config.constants import DATABASE_URL, EMBED_DIM


# ═══════════════════════════════════════════════════════════════════════════════
# DOCTRINAL AXES TABLE SCHEMA
# ═══════════════════════════════════════════════════════════════════════════════

DOCTRINAL_AXES_SCHEMA = f"""
CREATE TABLE IF NOT EXISTS doctrinal_axes (
    id SERIAL PRIMARY KEY,
    axis_name TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'greek',
    period TEXT,

    -- Axis definition
    description TEXT,
    positive_pole TEXT,
    negative_pole TEXT,

    -- Seed terms (before expansion)
    positive_seed_terms TEXT[],
    negative_seed_terms TEXT[],

    -- Expanded terms (after corpus analysis)
    positive_expanded_terms TEXT[],
    negative_expanded_terms TEXT[],

    -- Computed axis vector
    axis_embedding VECTOR({EMBED_DIM}),
    positive_centroid VECTOR({EMBED_DIM}),
    negative_centroid VECTOR({EMBED_DIM}),

    -- Statistics
    n_positive_terms INTEGER,
    n_negative_terms INTEGER,
    discriminative_power FLOAT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(axis_name, language, period)
);

CREATE INDEX IF NOT EXISTS idx_doctrinal_axes_name ON doctrinal_axes(axis_name);
CREATE INDEX IF NOT EXISTS idx_doctrinal_axes_language ON doctrinal_axes(language);

-- Per-passage doctrinal scores
CREATE TABLE IF NOT EXISTS passage_doctrinal_scores (
    id SERIAL PRIMARY KEY,
    passage_id INTEGER,
    pericope_id INTEGER,

    -- Per-axis scores (-1 to +1 scale)
    christology_score FLOAT,
    cosmology_score FLOAT,
    asceticism_score FLOAT,
    law_ritual_score FLOAT,
    anti_temple_score FLOAT,

    -- Composite scores
    gnostic_index FLOAT,
    orthodoxy_index FLOAT,

    -- Confidence
    confidence FLOAT,

    -- Method
    computation_method TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_passage_doctrinal_passage ON passage_doctrinal_scores(passage_id);
CREATE INDEX IF NOT EXISTS idx_passage_doctrinal_pericope ON passage_doctrinal_scores(pericope_id);
"""


# ═══════════════════════════════════════════════════════════════════════════════
# DOCTRINAL AXES DATA
# Based on scholarly literature on early Christian diversity
# ═══════════════════════════════════════════════════════════════════════════════

DOCTRINAL_AXES_DATA = [
    # ═══════════════════════════════════════════════════════════════════════════════
    # CHRISTOLOGY: High (divine) vs Low (human)
    # ═══════════════════════════════════════════════════════════════════════════════
    {
        "axis_name": "christology",
        "language": "greek",
        "description": "Degree of divine status attributed to Jesus",
        "positive_pole": "High Christology (Divine)",
        "negative_pole": "Low Christology (Human)",
        "positive_seed_terms": [
            # High Christology Greek terms
            "κύριος",           # Lord (kyrios) - divine title
            "θεός",             # God (theos)
            "υἱὸς θεοῦ",        # Son of God (huios theou)
            "λόγος",            # Word/Logos (logos) - Johannine/Stoic
            "σωτήρ",            # Savior (soter)
            "χριστός",          # Christ/Anointed (christos)
            "μονογενής",        # Only-begotten (monogenes)
            "πρωτότοκος",       # First-born (prototokos)
            "ἐγώ εἰμι",         # I AM (ego eimi) - divine self-identification
            "δόξα",             # Glory (doxa)
            "προΰπάρχω",        # Pre-exist (prouparcho)
            "ἀπαύγασμα",        # Radiance (apaugasma) - Hebrews 1:3
        ],
        "negative_seed_terms": [
            # Low Christology Greek terms
            "διδάσκαλος",       # Teacher (didaskalos)
            "ῥαββί",            # Rabbi (rabbi)
            "προφήτης",         # Prophet (prophetes)
            "υἱὸς ἀνθρώπου",    # Son of Man (huios anthropou)
            "ἄνθρωπος",         # Man/Human (anthropos)
            "υἱὸς Δαυίδ",       # Son of David (huios Dauid)
            "μεσίτης",          # Mediator (mesites)
            "ἀπόστολος",        # Apostle/Sent one (apostolos)
            "δοῦλος",           # Servant (doulos)
            "ἀδελφός",          # Brother (adelphos)
        ]
    },

    # ═══════════════════════════════════════════════════════════════════════════════
    # COSMOLOGY: Gnostic (dualistic) vs Proto-Orthodox (creation good)
    # ═══════════════════════════════════════════════════════════════════════════════
    {
        "axis_name": "cosmology",
        "language": "greek",
        "description": "Attitude toward material creation and cosmological dualism",
        "positive_pole": "Gnostic (Dualistic, anti-cosmic)",
        "negative_pole": "Proto-Orthodox (Creation affirming)",
        "positive_seed_terms": [
            # Gnostic Greek terms
            "πλήρωμα",          # Fullness/Pleroma (pleroma)
            "αἰών",             # Aeon (aion) - emanated being
            "ἀρχών",            # Archon/Ruler (archon) - cosmic power
            "δημιουργός",       # Demiurge (demiourgos) - lesser creator
            "ὕλη",              # Matter (hyle) - evil matter
            "σκότος",           # Darkness (skotos)
            "φῶς",              # Light (phos) - divine light
            "πνεῦμα",           # Spirit (pneuma) - divine spark
            "ἄγνοια",           # Ignorance (agnoia)
            "γνῶσις",           # Knowledge (gnosis) - salvific knowledge
            "ἀρχοντικός",       # Archontic (relating to rulers)
            "κόσμος",           # World/Cosmos (kosmos) - used negatively
            "σπέρμα",           # Seed (sperma) - divine seed in humans
        ],
        "negative_seed_terms": [
            # Proto-Orthodox Greek terms
            "κτίσις",           # Creation (ktisis)
            "ποίημα",           # Made thing (poiema)
            "δημιουργία",       # Creation/making (demiourgia) - positive
            "καλός",            # Good/Beautiful (kalos)
            "ἀγαθός",           # Good (agathos)
            "εὐλογητός",        # Blessed (eulogetos)
            "κύριος παντοκράτωρ", # Lord Almighty (kyrios pantokrator)
            "ἔργον",            # Work (ergon) - God's works
            "σάρξ",             # Flesh (sarx) - when used positively
            "ἀνάστασις σαρκός", # Resurrection of flesh
        ]
    },

    # ═══════════════════════════════════════════════════════════════════════════════
    # ASCETICISM: High (body-denying) vs Low (world-affirming)
    # ═══════════════════════════════════════════════════════════════════════════════
    {
        "axis_name": "asceticism",
        "language": "greek",
        "description": "Degree of bodily renunciation and world-denial",
        "positive_pole": "High Asceticism (Renunciation)",
        "negative_pole": "Low Asceticism (World-affirming)",
        "positive_seed_terms": [
            # High Asceticism Greek terms
            "ἐγκράτεια",        # Self-control (enkrateia)
            "νηστεία",          # Fasting (nesteia)
            "παρθενία",         # Virginity (parthenia)
            "ἁγνεία",           # Purity (hagneia)
            "ἀποταγή",          # Renunciation (apotage)
            "ἄσκησις",          # Training/Discipline (askesis)
            "ἀπέχω",            # Abstain (apecho)
            "σῶμα τῆς ἁμαρτίας", # Body of sin
            "νεκρόω",           # Put to death (nekroo) - mortify
            "σταυρόω",          # Crucify (stauroo) - crucify flesh
            "ἀπάρνησις",        # Self-denial (aparnesis)
            "μοναχός",          # Single/Alone (monachos)
        ],
        "negative_seed_terms": [
            # Low Asceticism Greek terms
            "γάμος",            # Marriage (gamos)
            "τέκνα",            # Children (tekna)
            "οἶκος",            # House/Household (oikos)
            "σάρξ",             # Flesh (sarx) - neutral/positive
            "τροφή",            # Food (trophe)
            "οἶνος",            # Wine (oinos)
            "εὐφροσύνη",        # Joy/Gladness (euphrosyne)
            "ἑορτή",            # Festival (heorte)
            "εὐχαριστία",       # Thanksgiving (eucharistia)
            "κτῆσις",           # Possession (ktesis)
        ]
    },

    # ═══════════════════════════════════════════════════════════════════════════════
    # LAW/RITUAL: Pro-Law vs Anti-Law
    # ═══════════════════════════════════════════════════════════════════════════════
    {
        "axis_name": "law_ritual",
        "language": "greek",
        "description": "Attitude toward Jewish law and ritual observance",
        "positive_pole": "Pro-Law (Torah observance)",
        "negative_pole": "Anti-Law (Freedom from law)",
        "positive_seed_terms": [
            # Pro-Law Greek terms
            "νόμος",            # Law (nomos)
            "ἐντολή",           # Commandment (entole)
            "περιτομή",         # Circumcision (peritome)
            "σάββατον",         # Sabbath (sabbaton)
            "καθαρός",          # Pure/Clean (katharos)
            "ἀκαθαρσία",        # Impurity (akatharsia) - to be avoided
            "τηρέω",            # Keep/Observe (tereo)
            "φυλάσσω",          # Guard (phylasso)
            "δικαιοσύνη",       # Righteousness (dikaiosyne) - legal
            "ἔργον νόμου",      # Work of law (ergon nomou)
            "γραμματεύς",       # Scribe (grammateus)
            "ζηλωτής",          # Zealot (zelotes) - for law
        ],
        "negative_seed_terms": [
            # Anti-Law Greek terms
            "ἐλευθερία",        # Freedom (eleutheria)
            "πίστις",           # Faith (pistis)
            "χάρις",            # Grace (charis)
            "πνεῦμα",           # Spirit (pneuma) - vs letter
            "γράμμα",           # Letter (gramma) - of the law
            "κατάρα",           # Curse (katara) - of the law
            "δουλεία",          # Slavery (douleia) - to law
            "στοιχεῖα",         # Elements (stoicheia) - weak elements
            "ἀνομία",           # Lawlessness (anomia) - sometimes positive
            "ἀκροβυστία",       # Uncircumcision (akrobystia)
        ]
    },

    # ═══════════════════════════════════════════════════════════════════════════════
    # ANTI-TEMPLE: Temple-critical vs Temple-affirming
    # ═══════════════════════════════════════════════════════════════════════════════
    {
        "axis_name": "anti_temple",
        "language": "greek",
        "description": "Attitude toward Jerusalem temple and sacrificial system",
        "positive_pole": "Anti-Temple (Temple critique)",
        "negative_pole": "Pro-Temple (Temple affirming)",
        "positive_seed_terms": [
            # Anti-Temple Greek terms
            "ναὸς χειροποίητος",    # Temple made with hands
            "χειροποίητος",         # Made with hands (cheiropoietos) - pejorative
            "ἀχειροποίητος",        # Not made with hands (acheiropoietos) - spiritual
            "καταλύω",              # Destroy (katalyo) - temple destruction
            "λῃστής",               # Robber (lestes) - den of robbers
            "ἔμπορος",              # Merchant (emporos) - temple commerce critique
            "καθαρίζω",             # Cleanse (katharizo) - temple cleansing
            "ἐρημόω",               # Make desolate (eremoo)
            "βδέλυγμα",             # Abomination (bdelygma)
            "τόπος ἅγιος",          # Holy place - used critically
        ],
        "negative_seed_terms": [
            # Pro-Temple Greek terms
            "ναός",                 # Temple (naos)
            "ἱερόν",                # Temple precinct (hieron)
            "θυσιαστήριον",         # Altar (thusiasterion)
            "λατρεία",              # Worship/Service (latreia)
            "προσφορά",             # Offering (prosphora)
            "θυσία",                # Sacrifice (thysia)
            "ἱερεύς",               # Priest (hiereus)
            "ἀρχιερεύς",            # High priest (archiereus)
            "λειτουργία",           # Ministry/Liturgy (leitourgia)
            "ἁγίασμα",              # Sanctuary (hagiasma)
            "προσκυνέω",            # Worship (proskyneo)
        ]
    },

    # ═══════════════════════════════════════════════════════════════════════════════
    # ARAMAIC DOCTRINAL TERMS (for Talmudic/Rabbinic analysis)
    # ═══════════════════════════════════════════════════════════════════════════════
    {
        "axis_name": "christology",
        "language": "aramaic",
        "description": "Messianic and divine terminology in Aramaic",
        "positive_pole": "High Christology (Divine)",
        "negative_pole": "Low Christology (Human)",
        "positive_seed_terms": [
            "מָרֵא",             # Lord (mare)
            "אֱלָהָא",           # God (elaha)
            "מְשִׁיחָא",          # Messiah (meshicha)
            "בַּר אֱלָהָא",       # Son of God (bar elaha)
            "מֵימְרָא",          # Word/Memra (memra) - divine intermediary
            "יְקָרָא",           # Glory (yeqara)
            "שְׁכִינְתָּא",        # Divine Presence (shekhinta)
        ],
        "negative_seed_terms": [
            "רַבִּי",            # Rabbi
            "מַלְפָנָא",          # Teacher (malpana)
            "נְבִיָּא",           # Prophet (neviya)
            "בַּר אֱנָשָׁא",       # Son of Man (bar enasha)
            "אֱנָשָׁא",           # Man (enasha)
            "עַבְדָּא",           # Servant (avda)
        ]
    },
]


async def create_doctrinal_tables(pool: asyncpg.Pool):
    """Create doctrinal axes tables."""
    async with pool.acquire() as conn:
        await conn.execute(DOCTRINAL_AXES_SCHEMA)
    print("Doctrinal axes tables created/verified")


async def seed_doctrinal_axes(pool: asyncpg.Pool, reset: bool = False):
    """Seed doctrinal axes data."""

    if reset:
        print("Resetting doctrinal axes tables...")
        async with pool.acquire() as conn:
            await conn.execute("DROP TABLE IF EXISTS passage_doctrinal_scores CASCADE")
            await conn.execute("DROP TABLE IF EXISTS doctrinal_axes CASCADE")
        await create_doctrinal_tables(pool)

    print("\nSeeding doctrinal axes...")

    for axis_data in DOCTRINAL_AXES_DATA:
        async with pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO doctrinal_axes (
                    axis_name, language, description,
                    positive_pole, negative_pole,
                    positive_seed_terms, negative_seed_terms,
                    n_positive_terms, n_negative_terms
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (axis_name, language, period) DO UPDATE SET
                    positive_seed_terms = EXCLUDED.positive_seed_terms,
                    negative_seed_terms = EXCLUDED.negative_seed_terms,
                    updated_at = NOW()
            """,
                axis_data["axis_name"],
                axis_data["language"],
                axis_data["description"],
                axis_data["positive_pole"],
                axis_data["negative_pole"],
                axis_data["positive_seed_terms"],
                axis_data["negative_seed_terms"],
                len(axis_data["positive_seed_terms"]),
                len(axis_data["negative_seed_terms"])
            )

        print(f"  - {axis_data['axis_name']} ({axis_data['language']}): "
              f"{len(axis_data['positive_seed_terms'])} positive, "
              f"{len(axis_data['negative_seed_terms'])} negative terms")


async def verify_data(pool: asyncpg.Pool):
    """Verify seeded data."""
    async with pool.acquire() as conn:
        axes = await conn.fetch("""
            SELECT axis_name, language, n_positive_terms, n_negative_terms
            FROM doctrinal_axes
            ORDER BY axis_name, language
        """)

        total_terms = await conn.fetchrow("""
            SELECT
                SUM(n_positive_terms) as total_positive,
                SUM(n_negative_terms) as total_negative
            FROM doctrinal_axes
        """)

    print("\n" + "="*60)
    print("DOCTRINAL AXES VERIFICATION")
    print("="*60)

    print("\nAxes by language:")
    for row in axes:
        print(f"  - {row['axis_name']} ({row['language']}): "
              f"+{row['n_positive_terms']}/-{row['n_negative_terms']} terms")

    print(f"\nTotal: {total_terms['total_positive']} positive, "
          f"{total_terms['total_negative']} negative terms")


async def main():
    parser = argparse.ArgumentParser(description='Seed doctrinal axes for Q reconstruction')
    parser.add_argument('--reset', action='store_true', help='Reset tables before seeding')
    args = parser.parse_args()

    print("="*60)
    print("LOGOS DOCTRINAL AXES SEEDING")
    print("="*60)

    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)

    try:
        await create_doctrinal_tables(pool)
        await seed_doctrinal_axes(pool, reset=args.reset)
        await verify_data(pool)
        print("\nDoctrinal axes seeding complete!")

    finally:
        await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
