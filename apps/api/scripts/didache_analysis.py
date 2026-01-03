#!/usr/bin/env python3
"""
================================================================================
DIDACHE STYLOMETRIC ANALYSIS
================================================================================

Compares Didache Greek text to Q style fingerprint.

Key Q Parallels in Didache:
- Did 1:2-5: Two Ways / Love enemies (Q 6:27-36)
- Did 8:2: Lord's Prayer (Q 11:2-4)
- Did 16: Eschatological discourse (Q 17:23-37)

Questions:
1. Does Did 8:2 match Q Lord's Prayer style?
2. Does Did 1-5 match Q Sermon material?
3. Does Did 16 match Q apocalyptic layer (Q2)?

================================================================================
"""

import asyncio
import asyncpg
import os
import re
import json
import numpy as np
from collections import Counter
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List
from datetime import datetime

DATABASE_URL = os.environ.get('DATABASE_URL', '')

# Greek function words
GREEK_FUNCTION_WORDS = [
    'ὁ', 'ἡ', 'τό', 'τοῦ', 'τῆς', 'τῷ', 'τῇ', 'τόν', 'τήν',
    'οἱ', 'αἱ', 'τά', 'τῶν', 'τοῖς', 'ταῖς', 'τούς', 'τάς',
    'ἐν', 'εἰς', 'ἐκ', 'ἐξ', 'ἀπό', 'πρός', 'διά', 'κατά', 'μετά', 'περί',
    'καί', 'δέ', 'γάρ', 'ἀλλά', 'ἤ', 'εἰ', 'ἐάν', 'ὅτι', 'ὡς', 'ἵνα',
    'μή', 'οὐ', 'οὐκ', 'οὐχ',
    'ἐγώ', 'σύ', 'αὐτός', 'ἡμεῖς', 'ὑμεῖς',
]

# Didache Greek Text (key sections)
DIDACHE_SECTIONS = {
    'Did_1:1-2': {
        'greek': """Ὁδοὶ δύο εἰσί, μία τῆς ζωῆς καὶ μία τοῦ θανάτου, διαφορὰ δὲ πολλὴ μεταξὺ τῶν δύο ὁδῶν.
Ἡ μὲν οὖν ὁδὸς τῆς ζωῆς ἐστιν αὕτη· πρῶτον ἀγαπήσεις τὸν θεὸν τὸν ποιήσαντά σε, δεύτερον τὸν πλησίον σου ὡς σεαυτόν·
πάντα δὲ ὅσα ἐὰν θελήσῃς μὴ γίνεσθαί σοι, καὶ σὺ ἄλλῳ μὴ ποίει.""",
        'q_parallel': 'Q 6:31 (Golden Rule)',
        'layer': 'Q1',
    },
    'Did_1:3-4': {
        'greek': """Τούτων δὲ τῶν λόγων ἡ διδαχή ἐστιν αὕτη· εὐλογεῖτε τοὺς καταρωμένους ὑμῖν καὶ προσεύχεσθε ὑπὲρ τῶν ἐχθρῶν ὑμῶν,
νηστεύετε δὲ ὑπὲρ τῶν διωκόντων ὑμᾶς· ποία γὰρ χάρις, ἐὰν ἀγαπᾶτε τοὺς ἀγαπῶντας ὑμᾶς;
οὐχὶ καὶ τὰ ἔθνη τὸ αὐτὸ ποιοῦσιν; ὑμεῖς δὲ ἀγαπᾶτε τοὺς μισοῦντας ὑμᾶς καὶ οὐχ ἕξετε ἐχθρόν.""",
        'q_parallel': 'Q 6:27-28, 32-33 (Love Enemies)',
        'layer': 'Q1',
    },
    'Did_1:5': {
        'greek': """Παντὶ τῷ αἰτοῦντί σε δίδου καὶ μὴ ἀπαίτει· πᾶσι γὰρ θέλει δίδοσθαι ὁ πατὴρ ἐκ τῶν ἰδίων χαρισμάτων.
Μακάριος ὁ διδοὺς κατὰ τὴν ἐντολήν· ἀθῷος γάρ ἐστιν.""",
        'q_parallel': 'Q 6:30 (Give to those who ask)',
        'layer': 'Q1',
    },
    'Did_8:2': {
        'greek': """Μηδὲ προσεύχεσθε ὡς οἱ ὑποκριταί, ἀλλ᾽ ὡς ἐκέλευσεν ὁ κύριος ἐν τῷ εὐαγγελίῳ αὐτοῦ, οὕτω προσεύχεσθε·
Πάτερ ἡμῶν ὁ ἐν τῷ οὐρανῷ, ἁγιασθήτω τὸ ὄνομά σου, ἐλθέτω ἡ βασιλεία σου, γενηθήτω τὸ θέλημά σου ὡς ἐν οὐρανῷ καὶ ἐπὶ γῆς·
τὸν ἄρτον ἡμῶν τὸν ἐπιούσιον δὸς ἡμῖν σήμερον, καὶ ἄφες ἡμῖν τὴν ὀφειλὴν ἡμῶν, ὡς καὶ ἡμεῖς ἀφίεμεν τοῖς ὀφειλέταις ἡμῶν·
καὶ μὴ εἰσενέγκῃς ἡμᾶς εἰς πειρασμόν, ἀλλὰ ῥῦσαι ἡμᾶς ἀπὸ τοῦ πονηροῦ· ὅτι σοῦ ἐστιν ἡ δύναμις καὶ ἡ δόξα εἰς τοὺς αἰῶνας.""",
        'q_parallel': 'Q 11:2-4 (Lord\'s Prayer)',
        'layer': 'Q1',
    },
    'Did_16:1-2': {
        'greek': """Γρηγορεῖτε ὑπὲρ τῆς ζωῆς ὑμῶν· οἱ λύχνοι ὑμῶν μὴ σβεσθήτωσαν, καὶ αἱ ὀσφύες ὑμῶν μὴ ἐκλυέσθωσαν,
ἀλλὰ γίνεσθε ἕτοιμοι· οὐ γὰρ οἴδατε τὴν ὥραν ἐν ᾗ ὁ κύριος ἡμῶν ἔρχεται.
Πυκνῶς δὲ συναχθήσεσθε ζητοῦντες τὰ ἀνήκοντα ταῖς ψυχαῖς ὑμῶν· οὐ γὰρ ὠφελήσει ὑμᾶς ὁ πᾶς χρόνος τῆς πίστεως ὑμῶν,
ἐὰν μὴ ἐν τῷ ἐσχάτῳ καιρῷ τελειωθῆτε.""",
        'q_parallel': 'Q 12:35-40 (Be Ready)',
        'layer': 'Q2',
    },
    'Did_16:3-4': {
        'greek': """Ἐν γὰρ ταῖς ἐσχάταις ἡμέραις πληθυνθήσονται οἱ ψευδοπροφῆται καὶ οἱ φθορεῖς,
καὶ στραφήσονται τὰ πρόβατα εἰς λύκους, καὶ ἡ ἀγάπη στραφήσεται εἰς μῖσος.
Αὐξανούσης γὰρ τῆς ἀνομίας μισήσουσιν ἀλλήλους καὶ διώξουσι καὶ παραδώσουσι,
καὶ τότε φανήσεται ὁ κοσμοπλανὴς ὡς υἱὸς θεοῦ καὶ ποιήσει σημεῖα καὶ τέρατα.""",
        'q_parallel': 'Q 17:23-24, 17:37 (Day of Son of Man)',
        'layer': 'Q2',
    },
    'Did_16:6-8': {
        'greek': """Καὶ τότε φανήσεται τὰ σημεῖα τῆς ἀληθείας· πρῶτον σημεῖον ἐκπετάσεως ἐν οὐρανῷ,
εἶτα σημεῖον φωνῆς σάλπιγγος, καὶ τὸ τρίτον ἀνάστασις νεκρῶν·
οὐ πάντων δέ, ἀλλ᾽ ὡς ἐρρέθη· Ἥξει ὁ κύριος καὶ πάντες οἱ ἅγιοι μετ᾽ αὐτοῦ.
Τότε ὄψεται ὁ κόσμος τὸν κύριον ἐρχόμενον ἐπάνω τῶν νεφελῶν τοῦ οὐρανοῦ.""",
        'q_parallel': 'Q 17:24 (Lightning), cf. Mark 13',
        'layer': 'Q2',
    },
}


def normalize_greek(word: str) -> str:
    return re.sub(r'[^\u0370-\u03FF\u1F00-\u1FFF]', '', word.lower())


def tokenize_greek(text: str) -> List[str]:
    return re.findall(r'[\u0370-\u03FF\u1F00-\u1FFF]+', text)


GREEK_FUNCTION_SET = set(normalize_greek(w) for w in GREEK_FUNCTION_WORDS)


class GreekStyleExtractor:
    """Extract style features from Greek text."""

    def __init__(self):
        self.function_words = [normalize_greek(w) for w in GREEK_FUNCTION_WORDS[:50]]

    def extract_features(self, text: str) -> np.ndarray:
        if not text:
            return np.zeros(60)

        words = [normalize_greek(w) for w in tokenize_greek(text)]
        total = len(words) if words else 1
        counts = Counter(words)

        features = []

        for fw in self.function_words:
            features.append(counts.get(fw, 0) / total * 1000)

        if words:
            lengths = [len(w) for w in tokenize_greek(text)]
            features.append(np.mean(lengths) if lengths else 0)
            features.append(np.std(lengths) if lengths else 0)
            features.append(np.median(lengths) if lengths else 0)
            features.append(max(lengths) if lengths else 0)
            features.append(min(lengths) if lengths else 0)
        else:
            features.extend([0, 0, 0, 0, 0])

        fw_count = sum(1 for w in words if w in GREEK_FUNCTION_SET)
        features.append(fw_count / total * 100)

        # Didache-specific: ὁδός (way) frequency
        hodos_count = counts.get('ὁδός', 0) + counts.get('οδος', 0)
        features.append(hodos_count / total * 1000)

        kai_count = counts.get('καί', 0) + counts.get('και', 0)
        features.append(kai_count / total * 1000)

        features.append(len(set(words)) / total if total > 0 else 0)

        return np.array(features)


async def build_q_centroids(pool: asyncpg.Pool, extractor: GreekStyleExtractor) -> Dict:
    """Build Q style centroids by layer."""

    centroids = {}

    async with pool.acquire() as conn:
        # Get Q passages by layer
        for layer in ['Q1', 'Q2', 'Q3']:
            rows = await conn.fetch("""
                SELECT sa.luke_text
                FROM synoptic_alignments sa
                JOIN q_reconstructions qr ON sa.id = qr.alignment_id
                WHERE sa.tradition_type = 'double_mt_lk'
                  AND sa.luke_text IS NOT NULL
                  AND qr.layer_classification = $1
            """, layer)

            features_list = []
            for row in rows:
                if row['luke_text']:
                    features_list.append(extractor.extract_features(row['luke_text']))

            if features_list:
                centroids[layer] = np.mean(features_list, axis=0)

        # Overall Q centroid
        all_rows = await conn.fetch("""
            SELECT sa.luke_text
            FROM synoptic_alignments sa
            WHERE sa.tradition_type = 'double_mt_lk'
              AND sa.luke_text IS NOT NULL
        """)

        all_features = [extractor.extract_features(r['luke_text']) for r in all_rows if r['luke_text']]
        if all_features:
            centroids['Q_overall'] = np.mean(all_features, axis=0)

    return centroids


async def analyze_didache(pool: asyncpg.Pool):
    """Run stylometric analysis on Didache."""
    print("=" * 70)
    print("DIDACHE STYLOMETRIC ANALYSIS")
    print("=" * 70)

    extractor = GreekStyleExtractor()

    # Build Q centroids
    print("\nBuilding Q layer centroids...")
    centroids = await build_q_centroids(pool, extractor)

    print(f"  Q1 (Sapiential) centroid: built")
    print(f"  Q2 (Prophetic) centroid: {'built' if 'Q2' in centroids else 'insufficient data'}")
    print(f"  Q overall centroid: built")

    # Analyze each Didache section
    print(f"\nAnalyzing {len(DIDACHE_SECTIONS)} Didache sections...")
    print("-" * 70)

    results = []

    for section_id, section_data in DIDACHE_SECTIONS.items():
        greek = section_data['greek']
        expected_layer = section_data['layer']
        q_parallel = section_data['q_parallel']

        features = extractor.extract_features(greek)

        # Compare to Q centroids
        similarities = {}
        for layer_name, centroid in centroids.items():
            if centroid is not None:
                sim = cosine_similarity([features], [centroid])[0][0]
                similarities[layer_name] = float(sim)

        # Best match
        best_match = max(similarities.items(), key=lambda x: x[1])

        # Does it match expected layer?
        layer_match = best_match[0] == expected_layer or (expected_layer in best_match[0])

        result = {
            'section': section_id,
            'expected_layer': expected_layer,
            'q_parallel': q_parallel,
            'similarities': similarities,
            'best_match': best_match[0],
            'best_similarity': best_match[1],
            'layer_match': layer_match,
            'word_count': len(tokenize_greek(greek))
        }
        results.append(result)

        # Print
        match_symbol = "✓" if layer_match else "✗"
        print(f"  {section_id:<12} | Q-sim: {similarities.get('Q_overall', 0):.3f} | "
              f"Best: {best_match[0]:<10} ({best_match[1]:.3f}) | "
              f"Expected: {expected_layer} {match_symbol}")

    # Summary
    print("\n" + "=" * 70)
    print("DIDACHE-Q ANALYSIS SUMMARY")
    print("=" * 70)

    q1_sections = [r for r in results if r['expected_layer'] == 'Q1']
    q2_sections = [r for r in results if r['expected_layer'] == 'Q2']

    q1_avg = np.mean([r['similarities'].get('Q_overall', 0) for r in q1_sections]) if q1_sections else 0
    q2_avg = np.mean([r['similarities'].get('Q_overall', 0) for r in q2_sections]) if q2_sections else 0

    print(f"\nQ1 (Sermon) sections:")
    print(f"  Count: {len(q1_sections)}")
    print(f"  Avg Q similarity: {q1_avg:.3f}")

    print(f"\nQ2 (Eschatological) sections:")
    print(f"  Count: {len(q2_sections)}")
    print(f"  Avg Q similarity: {q2_avg:.3f}")

    # Key findings
    print("\n" + "-" * 70)
    print("KEY FINDINGS")
    print("-" * 70)

    # Lord's Prayer comparison
    lords_prayer = next((r for r in results if 'Did_8:2' in r['section']), None)
    if lords_prayer:
        print(f"\n1. Lord's Prayer (Did 8:2):")
        print(f"   Q similarity: {lords_prayer['similarities'].get('Q_overall', 0):.3f}")
        if lords_prayer['similarities'].get('Q1', 0) > lords_prayer['similarities'].get('Q2', 0):
            print(f"   Matches Q1 (sapiential) layer as expected")
        else:
            print(f"   Matches Q2 (prophetic) layer")

    # Eschatological material
    esc_sections = [r for r in results if 'Did_16' in r['section']]
    if esc_sections:
        avg_q2 = np.mean([r['similarities'].get('Q2', 0) for r in esc_sections if 'Q2' in r['similarities']])
        print(f"\n2. Eschatological Material (Did 16):")
        print(f"   Avg Q2 similarity: {avg_q2:.3f}")
        print(f"   {'Confirms Q2 (prophetic) style' if avg_q2 > 0.4 else 'Weak Q2 connection'}")

    # Save results
    output = {
        'timestamp': datetime.now().isoformat(),
        'summary': {
            'sections_analyzed': len(results),
            'q1_sections': len(q1_sections),
            'q2_sections': len(q2_sections),
            'q1_avg_similarity': float(q1_avg),
            'q2_avg_similarity': float(q2_avg),
        },
        'findings': {
            'lords_prayer_q_similarity': lords_prayer['similarities'].get('Q_overall', 0) if lords_prayer else 0,
            'eschatological_q2_similarity': float(avg_q2) if esc_sections else 0,
        },
        'results': results
    }

    output_path = '/Users/royvaid/Downloads/logos/papers/DIDACHE_Q_ANALYSIS.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nResults saved to: {output_path}")

    return output


async def main():
    pool = await asyncpg.create_pool(DATABASE_URL)
    results = await analyze_didache(pool)
    await pool.close()
    return results


if __name__ == "__main__":
    asyncio.run(main())
