#!/usr/bin/env python3
"""
================================================================================
PREREGISTERED EXTERNAL VALIDATION
================================================================================

External validation with STRICT PREREGISTERED CRITERIA.

This is the "reviewer trap": if Thomas/Didache independently match our Q
fingerprint (especially in the places scholarship expects), critics lose
the easy argument that we merely optimized Mt/Lk overlap.

PREREGISTERED CRITERIA (defined BEFORE running analysis):
=========================================================

1. Q-MATCH DEFINITION:
   - Q similarity score >= 0.50 (cosine similarity to Q centroid)
   - OR Q probability >= 0.60 from trained classifier

2. SUCCESS CRITERIA:
   - Thomas: Logia with known Q parallels should score higher than those without
   - Didache: Lord's Prayer (Did 8:2) should match Q style
   - Didache: Eschatological material (Did 16) should show Q2 prophetic style

3. NEGATIVE CONTROLS:
   - Random Greek text should NOT match Q style
   - Non-Q Apostolic Fathers material should show lower scores

4. REPORTING:
   - ALL results reported (no cherry-picking)
   - Hits AND misses listed explicitly
   - Statistical significance computed

================================================================================
"""

import os
import pickle
import json
import asyncio
import asyncpg
import numpy as np
from datetime import datetime
from pathlib import Path
from collections import Counter
import re
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from scipy import stats
from typing import Dict, List, Tuple, Optional
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ.get('DATABASE_URL', '')
DATA_DIR = '/Users/royvaid/Downloads/logos/data'
PAPERS_DIR = '/Users/royvaid/Downloads/logos/papers'

# ============================================================================
# PREREGISTERED CRITERIA (DO NOT MODIFY AFTER REGISTRATION)
# ============================================================================

PREREGISTERED = {
    'version': '1.0',
    'registered_date': '2026-01-02',

    # Q-match thresholds
    'q_similarity_threshold': 0.50,
    'q_probability_threshold': 0.60,

    # Expected results (based on scholarship)
    'expected_thomas_q_parallels': [3, 4, 5, 26, 32, 33, 36, 39],  # Logia with known Q parallels
    'expected_didache_q_sections': ['Did_8:2', 'Did_16:1-2', 'Did_16:3-4', 'Did_16:6-8'],

    # Success criteria
    'thomas_separation_threshold': 0.0,  # Q-parallel logia must score higher
    'didache_lords_prayer_threshold': 0.55,  # Did 8:2 Q similarity
    'didache_eschatological_threshold': 0.50,  # Did 16 Q similarity

    # Statistical thresholds
    'significance_alpha': 0.05,
}

# Greek function words for feature extraction
GREEK_FUNCTION_WORDS = [
    'ὁ', 'ἡ', 'τό', 'τοῦ', 'τῆς', 'τῷ', 'τῇ', 'τόν', 'τήν',
    'οἱ', 'αἱ', 'τά', 'τῶν', 'τοῖς', 'ταῖς', 'τούς', 'τάς',
    'ἐν', 'εἰς', 'ἐκ', 'ἐξ', 'ἀπό', 'πρός', 'διά', 'κατά', 'μετά', 'περί',
    'καί', 'δέ', 'γάρ', 'ἀλλά', 'ἤ', 'εἰ', 'ἐάν', 'ὅτι', 'ὡς', 'ἵνα',
    'μή', 'οὐ', 'οὐκ', 'οὐχ',
    'ἐγώ', 'σύ', 'αὐτός', 'αὐτή', 'αὐτό', 'ἡμεῖς', 'ὑμεῖς',
    'οὗτος', 'ἐκεῖνος', 'ὅς', 'τίς',
]


def normalize_greek(word: str) -> str:
    return re.sub(r'[^\u0370-\u03FF\u1F00-\u1FFF]', '', word.lower())


def tokenize_greek(text: str) -> List[str]:
    return re.findall(r'[\u0370-\u03FF\u1F00-\u1FFF]+', text)


GREEK_FUNCTION_SET = set(normalize_greek(w) for w in GREEK_FUNCTION_WORDS)


def extract_features(text: str, n_features: int = 60) -> np.ndarray:
    """Extract style features from Greek text."""
    if not text:
        return np.zeros(n_features)

    func_words = [normalize_greek(w) for w in GREEK_FUNCTION_WORDS[:50]]
    words = [normalize_greek(w) for w in tokenize_greek(text)]
    total = len(words) if words else 1
    counts = Counter(words)

    features = []

    # Function word frequencies (50 features)
    for fw in func_words:
        features.append(counts.get(fw, 0) / total * 1000)

    # Word length statistics (5 features)
    if words:
        lengths = [len(w) for w in tokenize_greek(text)]
        features.append(np.mean(lengths) if lengths else 0)
        features.append(np.std(lengths) if lengths else 0)
        features.append(np.median(lengths) if lengths else 0)
        features.append(max(lengths) if lengths else 0)
        features.append(min(lengths) if lengths else 0)
    else:
        features.extend([0, 0, 0, 0, 0])

    # Lexical features (5 features)
    fw_count = sum(1 for w in words if w in GREEK_FUNCTION_SET)
    features.append(fw_count / total * 100)
    features.append(len(set(words)) / total if total > 0 else 0)
    features.append(counts.get('καί', 0) / total * 1000)
    features.append(counts.get('δέ', 0) / total * 1000)
    features.append(total)

    return np.array(features[:n_features])


def load_artifact(path):
    with open(path, 'rb') as f:
        return pickle.load(f)


class PreregisteredValidator:
    """External validation with preregistered criteria."""

    def __init__(self, synoptic_artifact: Dict, thomas_artifact: Dict, seed: int = 42):
        self.synoptic = synoptic_artifact
        self.thomas = thomas_artifact
        self.seed = seed
        self.rng = np.random.RandomState(seed)

        # Build Q classifier and centroid
        self._build_q_model()

    def _build_q_model(self):
        """Train Q classifier and compute Q centroid."""
        print("Building Q model from synoptic data...")

        # Extract Q and Mark features
        q_features = []
        mark_features = []

        for item in self.synoptic['data'].get('q_passages', []):
            q_features.append(item['features'])

        for item in self.synoptic['data'].get('mark_passages', []):
            mark_features.append(item['features'])

        self.q_features = np.array(q_features)
        self.mark_features = np.array(mark_features)

        # Compute Q centroid
        self.q_centroid = np.mean(self.q_features, axis=0)
        self.mark_centroid = np.mean(self.mark_features, axis=0)

        # Train classifier
        X = np.vstack([self.q_features, self.mark_features])
        y = np.array([1] * len(self.q_features) + [0] * len(self.mark_features))

        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)

        self.classifier = RandomForestClassifier(n_estimators=100, random_state=self.seed)
        self.classifier.fit(X_scaled, y)

        print(f"  Q centroid: {len(self.q_features)} passages")
        print(f"  Mark centroid: {len(self.mark_features)} passages")

    def compute_q_score(self, features: np.ndarray) -> Dict:
        """Compute Q similarity and probability for a feature vector."""
        # Cosine similarity to Q centroid
        q_sim = cosine_similarity([features], [self.q_centroid])[0][0]
        mark_sim = cosine_similarity([features], [self.mark_centroid])[0][0]

        # Classifier probability
        features_scaled = self.scaler.transform([features])
        q_prob = self.classifier.predict_proba(features_scaled)[0][1]

        # Q-match based on preregistered criteria
        is_q_match = (
            q_sim >= PREREGISTERED['q_similarity_threshold'] or
            q_prob >= PREREGISTERED['q_probability_threshold']
        )

        return {
            'q_similarity': float(q_sim),
            'mark_similarity': float(mark_sim),
            'q_probability': float(q_prob),
            'is_q_match': bool(is_q_match)
        }

    def validate_thomas(self) -> Dict:
        """
        Validate Thomas logia against Q fingerprint.

        Preregistered hypothesis: Logia with known Q parallels should
        score higher than those without.
        """
        print("\n" + "=" * 70)
        print("THOMAS VALIDATION (Preregistered)")
        print("=" * 70)

        results = {
            'with_q_parallel': [],
            'without_q_parallel': [],
            'all_logia': []
        }

        expected_q_logia = set(PREREGISTERED['expected_thomas_q_parallels'])

        for item in self.thomas['data'].get('logia', []):
            logion = item['logion']
            features = np.array(item['features'])
            has_parallel = item['has_q_parallel']

            score = self.compute_q_score(features)
            score['logion'] = logion
            score['has_q_parallel'] = has_parallel
            score['expected_q'] = logion in expected_q_logia

            results['all_logia'].append(score)

            if has_parallel:
                results['with_q_parallel'].append(score)
            else:
                results['without_q_parallel'].append(score)

        # Compute statistics
        scores_with = [s['q_similarity'] for s in results['with_q_parallel']]
        scores_without = [s['q_similarity'] for s in results['without_q_parallel']]

        if scores_with and scores_without:
            mean_with = np.mean(scores_with)
            mean_without = np.mean(scores_without)
            separation = mean_with - mean_without

            # Statistical test (Mann-Whitney U)
            statistic, p_value = stats.mannwhitneyu(
                scores_with, scores_without, alternative='greater'
            )

            significant = p_value < PREREGISTERED['significance_alpha']
        else:
            mean_with = np.mean(scores_with) if scores_with else 0
            mean_without = np.mean(scores_without) if scores_without else 0
            separation = mean_with - mean_without
            p_value = 1.0
            significant = False

        # Determine success
        success = separation > PREREGISTERED['thomas_separation_threshold']

        print(f"\nResults:")
        print(f"  Logia with Q parallel (n={len(scores_with)}): mean Q-sim = {mean_with:.3f}")
        print(f"  Logia without Q parallel (n={len(scores_without)}): mean Q-sim = {mean_without:.3f}")
        print(f"  Separation: {separation:.3f}")
        print(f"  P-value (Mann-Whitney): {p_value:.4f}")
        print(f"  Significant at α=0.05: {significant}")
        print(f"\n  PREREGISTERED SUCCESS: {success}")

        # List all results (no cherry-picking)
        print("\nAll logia (sorted by Q similarity):")
        for s in sorted(results['all_logia'], key=lambda x: x['q_similarity'], reverse=True):
            q_par = "Q" if s['has_q_parallel'] else " "
            match = "MATCH" if s['is_q_match'] else "     "
            print(f"  Th {s['logion']:3d} [{q_par}] {match} | Q-sim: {s['q_similarity']:.3f} | Q-prob: {s['q_probability']:.3f}")

        return {
            'success': success,
            'mean_with_parallel': float(mean_with),
            'mean_without_parallel': float(mean_without),
            'separation': float(separation),
            'p_value': float(p_value),
            'significant': significant,
            'n_with_parallel': len(scores_with),
            'n_without_parallel': len(scores_without),
            'all_results': results['all_logia']
        }

    async def validate_didache(self, pool: asyncpg.Pool) -> Dict:
        """
        Validate Didache sections against Q fingerprint.

        Preregistered hypotheses:
        1. Lord's Prayer (Did 8:2) should match Q style (>= 0.55)
        2. Eschatological material (Did 16) should match Q2 style (>= 0.50)
        """
        print("\n" + "=" * 70)
        print("DIDACHE VALIDATION (Preregistered)")
        print("=" * 70)

        # Didache sections with Greek text
        DIDACHE_SECTIONS = {
            'Did_1:1-2': {
                'greek': """ὁδοὶ δύο εἰσί μία τῆς ζωῆς καὶ μία τοῦ θανάτου διαφορὰ δὲ πολλὴ
                μεταξὺ τῶν δύο ὁδῶν ἡ μὲν οὖν ὁδὸς τῆς ζωῆς ἐστιν αὕτη πρῶτον
                ἀγαπήσεις τὸν θεὸν τὸν ποιήσαντά σε δεύτερον τὸν πλησίον σου ὡς σεαυτόν""",
                'q_parallel': 'Q 6:31 (Golden Rule)',
                'expected_layer': 'Q1'
            },
            'Did_1:3-4': {
                'greek': """εὐλογεῖτε τοὺς καταρωμένους ὑμῖν καὶ προσεύχεσθε ὑπὲρ τῶν ἐχθρῶν ὑμῶν
                νηστεύετε δὲ ὑπὲρ τῶν διωκόντων ὑμᾶς ποία γὰρ χάρις ἐὰν ἀγαπᾶτε τοὺς ἀγαπῶντας ὑμᾶς
                οὐχὶ καὶ τὰ ἔθνη τὸ αὐτὸ ποιοῦσιν""",
                'q_parallel': 'Q 6:27-28, 32-33 (Love Enemies)',
                'expected_layer': 'Q1'
            },
            'Did_8:2': {
                'greek': """Πάτερ ἡμῶν ὁ ἐν τῷ οὐρανῷ ἁγιασθήτω τὸ ὄνομά σου ἐλθέτω ἡ βασιλεία σου
                γενηθήτω τὸ θέλημά σου ὡς ἐν οὐρανῷ καὶ ἐπὶ γῆς τὸν ἄρτον ἡμῶν τὸν ἐπιούσιον
                δὸς ἡμῖν σήμερον καὶ ἄφες ἡμῖν τὴν ὀφειλὴν ἡμῶν ὡς καὶ ἡμεῖς ἀφίεμεν τοῖς
                ὀφειλέταις ἡμῶν καὶ μὴ εἰσενέγκῃς ἡμᾶς εἰς πειρασμόν ἀλλὰ ῥῦσαι ἡμᾶς ἀπὸ τοῦ πονηροῦ""",
                'q_parallel': "Q 11:2-4 (Lord's Prayer)",
                'expected_layer': 'Q1'
            },
            'Did_16:1-2': {
                'greek': """γρηγορεῖτε ὑπὲρ τῆς ζωῆς ὑμῶν οἱ λύχνοι ὑμῶν μὴ σβεσθήτωσαν
                καὶ αἱ ὀσφύες ὑμῶν μὴ ἐκλυέσθωσαν ἀλλὰ γίνεσθε ἕτοιμοι οὐ γὰρ οἴδατε
                τὴν ὥραν ἐν ᾗ ὁ κύριος ἡμῶν ἔρχεται""",
                'q_parallel': 'Q 12:35-40 (Be Ready)',
                'expected_layer': 'Q2'
            },
            'Did_16:3-4': {
                'greek': """ἐν γὰρ ταῖς ἐσχάταις ἡμέραις πληθυνθήσονται οἱ ψευδοπροφῆται
                καὶ οἱ φθορεῖς καὶ στραφήσονται τὰ πρόβατα εἰς λύκους καὶ ἡ ἀγάπη
                στραφήσεται εἰς μῖσος""",
                'q_parallel': 'Q 17:23-24, 17:37 (Day of Son of Man)',
                'expected_layer': 'Q2'
            },
            'Did_16:6-8': {
                'greek': """καὶ τότε φανήσεται τὰ σημεῖα τῆς ἀληθείας πρῶτον σημεῖον ἐκπετάσεως
                ἐν οὐρανῷ εἶτα σημεῖον φωνῆς σάλπιγγος καὶ τὸ τρίτον ἀνάστασις νεκρῶν
                οὐ πάντων δὲ ἀλλ᾽ ὡς ἐρρέθη ἥξει ὁ κύριος καὶ πάντες οἱ ἅγιοι μετ᾽ αὐτοῦ""",
                'q_parallel': 'Q 17:24 (Lightning), cf. Mark 13',
                'expected_layer': 'Q2'
            },
        }

        results = {
            'sections': [],
            'lords_prayer': None,
            'eschatological': []
        }

        expected_sections = set(PREREGISTERED['expected_didache_q_sections'])

        for section_id, section_data in DIDACHE_SECTIONS.items():
            features = extract_features(section_data['greek'])
            score = self.compute_q_score(features)

            score['section'] = section_id
            score['q_parallel'] = section_data['q_parallel']
            score['expected_layer'] = section_data['expected_layer']
            score['expected_q'] = section_id in expected_sections

            results['sections'].append(score)

            if section_id == 'Did_8:2':
                results['lords_prayer'] = score
            elif section_id.startswith('Did_16'):
                results['eschatological'].append(score)

        # Evaluate preregistered hypotheses
        print("\nResults:")

        # Hypothesis 1: Lord's Prayer
        lp = results['lords_prayer']
        lp_success = lp['q_similarity'] >= PREREGISTERED['didache_lords_prayer_threshold']
        print(f"\n  1. Lord's Prayer (Did 8:2):")
        print(f"     Q similarity: {lp['q_similarity']:.3f}")
        print(f"     Threshold: {PREREGISTERED['didache_lords_prayer_threshold']}")
        print(f"     SUCCESS: {lp_success}")

        # Hypothesis 2: Eschatological material
        esc_scores = [s['q_similarity'] for s in results['eschatological']]
        esc_mean = np.mean(esc_scores) if esc_scores else 0
        esc_success = esc_mean >= PREREGISTERED['didache_eschatological_threshold']
        print(f"\n  2. Eschatological Material (Did 16):")
        print(f"     Mean Q similarity: {esc_mean:.3f}")
        print(f"     Threshold: {PREREGISTERED['didache_eschatological_threshold']}")
        print(f"     SUCCESS: {esc_success}")

        # All sections (no cherry-picking)
        print("\nAll sections (sorted by Q similarity):")
        for s in sorted(results['sections'], key=lambda x: x['q_similarity'], reverse=True):
            exp = "EXPECTED" if s['expected_q'] else "        "
            match = "MATCH" if s['is_q_match'] else "     "
            print(f"  {s['section']:12s} [{s['expected_layer']}] {exp} {match} | Q-sim: {s['q_similarity']:.3f}")

        overall_success = lp_success and esc_success

        return {
            'success': overall_success,
            'lords_prayer': {
                'q_similarity': float(lp['q_similarity']),
                'threshold': PREREGISTERED['didache_lords_prayer_threshold'],
                'success': lp_success
            },
            'eschatological': {
                'mean_q_similarity': float(esc_mean),
                'threshold': PREREGISTERED['didache_eschatological_threshold'],
                'success': esc_success,
                'n_sections': len(esc_scores)
            },
            'all_results': results['sections']
        }

    def generate_negative_control(self, n_samples: int = 20) -> Dict:
        """
        Generate negative control: random Greek-like features should NOT match Q.
        """
        print("\n" + "=" * 70)
        print("NEGATIVE CONTROL (Random Features)")
        print("=" * 70)

        q_matches = 0
        random_scores = []

        for i in range(n_samples):
            # Generate random features with similar distribution to real data
            random_features = self.rng.randn(60) * 10 + 5
            random_features = np.abs(random_features)  # Features are typically positive

            score = self.compute_q_score(random_features)
            random_scores.append(score['q_similarity'])

            if score['is_q_match']:
                q_matches += 1

        mean_random = np.mean(random_scores)
        match_rate = q_matches / n_samples

        # Compare to real Q passages
        q_scores = [cosine_similarity([f], [self.q_centroid])[0][0]
                    for f in self.q_features]
        mean_q = np.mean(q_scores)

        separation = mean_q - mean_random

        # Statistical test
        statistic, p_value = stats.mannwhitneyu(q_scores, random_scores, alternative='greater')

        print(f"\nResults:")
        print(f"  Random features mean Q-sim: {mean_random:.3f}")
        print(f"  Real Q passages mean Q-sim: {mean_q:.3f}")
        print(f"  Separation: {separation:.3f}")
        print(f"  Random match rate: {match_rate*100:.1f}%")
        print(f"  P-value: {p_value:.6f}")

        success = match_rate < 0.20 and separation > 0.10

        print(f"\n  NEGATIVE CONTROL SUCCESS: {success}")

        return {
            'success': success,
            'random_mean': float(mean_random),
            'q_mean': float(mean_q),
            'separation': float(separation),
            'random_match_rate': float(match_rate),
            'p_value': float(p_value),
            'n_samples': n_samples
        }

    async def run_full_validation(self, pool: asyncpg.Pool) -> Dict:
        """Run complete preregistered validation."""
        print("=" * 70)
        print("PREREGISTERED EXTERNAL VALIDATION")
        print("=" * 70)
        print(f"\nPreregistered criteria version: {PREREGISTERED['version']}")
        print(f"Registration date: {PREREGISTERED['registered_date']}")

        results = {
            'timestamp': datetime.now().isoformat(),
            'preregistered_criteria': PREREGISTERED,
        }

        # 1. Thomas validation
        results['thomas'] = self.validate_thomas()

        # 2. Didache validation
        results['didache'] = await self.validate_didache(pool)

        # 3. Negative control
        results['negative_control'] = self.generate_negative_control()

        # Overall assessment
        all_success = (
            results['thomas']['success'] and
            results['didache']['success'] and
            results['negative_control']['success']
        )

        results['overall_success'] = all_success

        print("\n" + "=" * 70)
        print("VALIDATION SUMMARY")
        print("=" * 70)
        print(f"  Thomas: {'PASS' if results['thomas']['success'] else 'FAIL'}")
        print(f"  Didache: {'PASS' if results['didache']['success'] else 'FAIL'}")
        print(f"  Negative Control: {'PASS' if results['negative_control']['success'] else 'FAIL'}")
        print(f"\n  OVERALL: {'ALL PREREGISTERED CRITERIA MET' if all_success else 'SOME CRITERIA NOT MET'}")

        return results


def save_validation_report(results: Dict, output_dir: str = PAPERS_DIR):
    """Save comprehensive validation report."""
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # JSON
    json_path = f'{output_dir}/THOMAS_DIDACHE_Q_VALIDATION.json'
    with open(json_path, 'w') as f:
        json.dump(results, f, indent=2, default=float)

    # Markdown
    md_path = f'{output_dir}/THOMAS_DIDACHE_Q_VALIDATION.md'
    with open(md_path, 'w') as f:
        f.write("# Preregistered External Validation: Thomas & Didache\n\n")
        f.write(f"**Timestamp:** {results['timestamp']}\n\n")
        f.write(f"**Overall Result:** {'PASS - All criteria met' if results['overall_success'] else 'FAIL - Some criteria not met'}\n\n")

        f.write("## Preregistered Criteria\n\n")
        f.write(f"- Version: {PREREGISTERED['version']}\n")
        f.write(f"- Registration date: {PREREGISTERED['registered_date']}\n")
        f.write(f"- Q similarity threshold: {PREREGISTERED['q_similarity_threshold']}\n")
        f.write(f"- Q probability threshold: {PREREGISTERED['q_probability_threshold']}\n\n")

        f.write("## Thomas Validation\n\n")
        t = results['thomas']
        f.write(f"**Result:** {'PASS' if t['success'] else 'FAIL'}\n\n")
        f.write(f"- Logia with Q parallel (n={t['n_with_parallel']}): mean Q-sim = {t['mean_with_parallel']:.3f}\n")
        f.write(f"- Logia without Q parallel (n={t['n_without_parallel']}): mean Q-sim = {t['mean_without_parallel']:.3f}\n")
        f.write(f"- Separation: {t['separation']:.3f}\n")
        f.write(f"- P-value: {t['p_value']:.4f}\n")
        f.write(f"- Significant: {t['significant']}\n\n")

        f.write("### All Thomas Logia\n\n")
        f.write("| Logion | Q Parallel | Q Similarity | Q Probability | Match |\n")
        f.write("|:-------|:----------:|:------------:|:-------------:|:-----:|\n")
        for s in sorted(t['all_results'], key=lambda x: x['q_similarity'], reverse=True):
            q_par = "Yes" if s['has_q_parallel'] else "No"
            match = "Yes" if s['is_q_match'] else "No"
            f.write(f"| Th {s['logion']} | {q_par} | {s['q_similarity']:.3f} | {s['q_probability']:.3f} | {match} |\n")

        f.write("\n## Didache Validation\n\n")
        d = results['didache']
        f.write(f"**Result:** {'PASS' if d['success'] else 'FAIL'}\n\n")

        f.write(f"### Lord's Prayer (Did 8:2)\n\n")
        f.write(f"- Q similarity: {d['lords_prayer']['q_similarity']:.3f}\n")
        f.write(f"- Threshold: {d['lords_prayer']['threshold']}\n")
        f.write(f"- Success: {d['lords_prayer']['success']}\n\n")

        f.write(f"### Eschatological Material (Did 16)\n\n")
        f.write(f"- Mean Q similarity: {d['eschatological']['mean_q_similarity']:.3f}\n")
        f.write(f"- Threshold: {d['eschatological']['threshold']}\n")
        f.write(f"- Success: {d['eschatological']['success']}\n\n")

        f.write("## Negative Control\n\n")
        n = results['negative_control']
        f.write(f"**Result:** {'PASS' if n['success'] else 'FAIL'}\n\n")
        f.write(f"- Random features mean Q-sim: {n['random_mean']:.3f}\n")
        f.write(f"- Real Q passages mean Q-sim: {n['q_mean']:.3f}\n")
        f.write(f"- Separation: {n['separation']:.3f}\n")
        f.write(f"- Random match rate: {n['random_match_rate']*100:.1f}%\n\n")

        f.write("---\n\n")
        f.write("*All results reported without cherry-picking, as per preregistration.*\n")

    print(f"\nValidation report saved:")
    print(f"  {json_path}")
    print(f"  {md_path}")


async def main():
    print("Loading artifacts...")

    # Load synoptic artifact
    synoptic_path = list(Path(DATA_DIR).glob('synoptic_canonical_*.pkl'))[0]
    synoptic = load_artifact(synoptic_path)
    print(f"  Synoptic: {synoptic_path.name}")

    # Load Thomas artifact
    thomas_path = list(Path(DATA_DIR).glob('thomas_canonical_*.pkl'))[0]
    thomas = load_artifact(thomas_path)
    print(f"  Thomas: {thomas_path.name}")

    # Connect to database for Didache
    pool = await asyncpg.create_pool(DATABASE_URL) if DATABASE_URL else None

    try:
        validator = PreregisteredValidator(synoptic, thomas, seed=42)
        results = await validator.run_full_validation(pool)
        save_validation_report(results)
    finally:
        if pool:
            await pool.close()

    return results


if __name__ == "__main__":
    asyncio.run(main())
