#!/usr/bin/env python3
"""
================================================================================
MARK RECONSTRUCTION BENCHMARK
================================================================================

Tests the stylometry methodology on the known ground truth of Markan priority.

Hypothesis: If Matthew and Luke used Mark as a source (Two-Source Hypothesis),
then the triple tradition passages should show detectable Markan stylistic
influence that distinguishes them from Q material (double tradition).

Benchmark Design:
1. Extract Greek stylometric features from synoptic passages
2. Train on triple tradition (Mark IS the source)
3. Test if we can distinguish triple from double tradition
4. Target: F1 >= 0.60

================================================================================
"""

import numpy as np
import asyncio
import asyncpg
import os
import re
from collections import Counter
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_predict, StratifiedKFold
from sklearn.metrics import accuracy_score, f1_score, classification_report, confusion_matrix
from sklearn.feature_selection import f_classif
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ.get('DATABASE_URL', '')

# Greek function words (high-frequency words that indicate style, not content)
# Based on standard Greek NT linguistic analysis
GREEK_FUNCTION_WORDS = [
    # Articles
    'ὁ', 'ἡ', 'τό', 'τοῦ', 'τῆς', 'τοῦ', 'τῷ', 'τῇ', 'τῷ', 'τόν', 'τήν', 'τό',
    'οἱ', 'αἱ', 'τά', 'τῶν', 'τοῖς', 'ταῖς', 'τούς', 'τάς',
    # Prepositions
    'ἐν', 'εἰς', 'ἐκ', 'ἐξ', 'ἀπό', 'πρός', 'διά', 'κατά', 'μετά', 'περί',
    'ὑπέρ', 'ὑπό', 'παρά', 'ἐπί', 'σύν', 'ἀνά', 'πρό', 'ἀντί',
    # Conjunctions
    'καί', 'δέ', 'γάρ', 'ἀλλά', 'ἤ', 'οὐδέ', 'μηδέ', 'εἰ', 'ἐάν', 'ὅτι',
    'ὡς', 'ὥστε', 'ἵνα', 'ὅπως', 'μή', 'οὐ', 'οὐκ', 'οὐχ', 'μήτε', 'οὔτε',
    # Pronouns
    'ἐγώ', 'σύ', 'αὐτός', 'αὐτή', 'αὐτό', 'ἡμεῖς', 'ὑμεῖς', 'αὐτοί',
    'μου', 'σου', 'αὐτοῦ', 'αὐτῆς', 'ἡμῶν', 'ὑμῶν', 'αὐτῶν',
    'μοι', 'σοι', 'αὐτῷ', 'αὐτῇ', 'ἡμῖν', 'ὑμῖν', 'αὐτοῖς',
    'με', 'σε', 'αὐτόν', 'αὐτήν', 'ἡμᾶς', 'ὑμᾶς', 'αὐτούς',
    'οὗτος', 'αὕτη', 'τοῦτο', 'ἐκεῖνος', 'ὅς', 'ἥ', 'ὅ', 'ὅστις',
    'τίς', 'τί', 'ποῖος', 'πόσος', 'ἄλλος', 'ἕτερος',
    # Particles
    'μέν', 'τε', 'οὖν', 'ἄν', 'γε', 'δή', 'ἄρα', 'νῦν', 'τότε', 'ἔτι',
    'πάλιν', 'οὕτως', 'ὧδε', 'ἐκεῖ', 'πῶς', 'ποῦ', 'πότε', 'ὅτε', 'ὅπου',
    # Common verbs (auxiliary-like)
    'εἰμί', 'ἐστίν', 'ἦν', 'ἔστιν', 'εἶναι', 'ὤν', 'ἔχω', 'ἔχει', 'εἶχεν',
    'γίνομαι', 'γίνεται', 'ἐγένετο', 'λέγω', 'λέγει', 'εἶπεν', 'λέγων',
    # Markan favorites (diagnostic)
    'εὐθύς', 'εὐθέως', 'πάλιν', 'ἤρξατο', 'πολλά', 'καί', 'γάρ',
]

# Create set for fast lookup (normalized)
def normalize_greek(word):
    """Normalize Greek word for comparison."""
    # Remove punctuation and lowercase
    return re.sub(r'[^\u0370-\u03FF\u1F00-\u1FFF]', '', word.lower())

GREEK_FUNCTION_SET = set(normalize_greek(w) for w in GREEK_FUNCTION_WORDS)


class GreekFeatureExtractor:
    """Extract stylometric features from Greek text."""

    def __init__(self):
        self.function_words = [normalize_greek(w) for w in GREEK_FUNCTION_WORDS]
        self.function_word_set = GREEK_FUNCTION_SET

    def tokenize(self, text: str) -> List[str]:
        """Tokenize Greek text into words."""
        # Split on whitespace and punctuation
        words = re.findall(r'[\u0370-\u03FF\u1F00-\u1FFF]+', text.lower())
        return words

    def extract_features(self, text: str) -> Dict[str, float]:
        """Extract all features from Greek text."""
        features = {}
        words = self.tokenize(text)
        total_words = len(words) if words else 1

        # Function word frequencies
        word_counts = Counter(words)
        for i, fw in enumerate(self.function_words[:100]):  # Top 100
            freq = word_counts.get(fw, 0) / total_words * 1000
            features[f'fw_{i}'] = freq

        # Word length statistics
        if words:
            lengths = [len(w) for w in words]
            features['word_len_mean'] = np.mean(lengths)
            features['word_len_std'] = np.std(lengths)
            features['word_len_max'] = max(lengths)
        else:
            features['word_len_mean'] = 0
            features['word_len_std'] = 0
            features['word_len_max'] = 0

        # Function word ratio
        fw_count = sum(1 for w in words if w in self.function_word_set)
        features['fw_ratio'] = fw_count / total_words * 100

        # Sentence length (approximate by periods and question marks)
        sentences = re.split(r'[.;·]', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        if sentences:
            sent_lens = [len(self.tokenize(s)) for s in sentences]
            features['sent_len_mean'] = np.mean(sent_lens)
            features['sent_len_std'] = np.std(sent_lens) if len(sent_lens) > 1 else 0
        else:
            features['sent_len_mean'] = total_words
            features['sent_len_std'] = 0

        # Kai frequency (Markan favorite)
        kai_count = word_counts.get('καί', 0) + word_counts.get('και', 0)
        features['kai_rate'] = kai_count / total_words * 1000

        # Historical present marker (common in Mark)
        # Approximate by looking for present tense verbs in narrative
        present_markers = ['λέγει', 'ἔρχεται', 'λέγουσιν', 'ἔρχονται']
        present_count = sum(word_counts.get(normalize_greek(m), 0) for m in present_markers)
        features['historical_present'] = present_count / total_words * 1000

        # Euthus/eutheos (immediately) - Markan favorite
        euthus_count = word_counts.get('εὐθύς', 0) + word_counts.get('εὐθέως', 0) + \
                       word_counts.get('ευθυς', 0) + word_counts.get('ευθεως', 0)
        features['euthus_rate'] = euthus_count / total_words * 1000

        return features

    def extract_feature_vector(self, text: str) -> np.ndarray:
        """Extract features as numpy vector."""
        features = self.extract_features(text)
        return np.array(list(features.values()))

    def get_feature_names(self) -> List[str]:
        """Get feature names."""
        # Generate a sample to get names
        sample_features = self.extract_features("τοῦ λόγου")
        return list(sample_features.keys())


async def load_synoptic_data(pool: asyncpg.Pool) -> Tuple[List[Dict], List[Dict]]:
    """Load triple and double tradition passages."""

    async with pool.acquire() as conn:
        # Get triple tradition (has Mark)
        triple = await conn.fetch("""
            SELECT alignment_group, matthew_text, mark_text, luke_text,
                   matthew_ref, mark_ref, luke_ref
            FROM synoptic_alignments
            WHERE tradition_type = 'triple'
              AND matthew_text IS NOT NULL
              AND mark_text IS NOT NULL
              AND luke_text IS NOT NULL
        """)

        # Get double tradition Q material (no Mark)
        double = await conn.fetch("""
            SELECT alignment_group, matthew_text, luke_text,
                   matthew_ref, luke_ref
            FROM synoptic_alignments
            WHERE tradition_type = 'double_mt_lk'
              AND matthew_text IS NOT NULL
              AND luke_text IS NOT NULL
        """)

    return list(triple), list(double)


async def run_mark_benchmark(pool: asyncpg.Pool) -> Dict:
    """
    Run the Mark reconstruction benchmark.

    Test 1: Can we distinguish triple tradition (has Markan source) from
            double tradition (Q source, no Mark)?

    Test 2: Within triple tradition, can we identify which gospel is Mark
            based on style alone?
    """
    print("=" * 70)
    print("MARK RECONSTRUCTION BENCHMARK")
    print("=" * 70)

    triple, double = await load_synoptic_data(pool)

    print(f"\nData loaded:")
    print(f"  Triple tradition passages: {len(triple)}")
    print(f"  Double tradition (Q) passages: {len(double)}")

    if len(triple) < 5 or len(double) < 5:
        print("\nInsufficient data for benchmark. Need more synoptic alignments.")
        return {'error': 'insufficient_data'}

    extractor = GreekFeatureExtractor()

    # =========================================================================
    # TEST 1: Triple vs Double Tradition Classification
    # =========================================================================
    print("\n" + "-" * 70)
    print("TEST 1: Triple vs Double Tradition")
    print("-" * 70)
    print("Can we distinguish passages that have Markan source from Q-only?")

    X_all = []
    y_all = []

    # Extract features from triple tradition (combined Mt+Lk, label=1 for has-Mark)
    for row in triple:
        # Combine Matthew and Luke text (what we'd see without Mark)
        combined_text = f"{row['matthew_text']} {row['luke_text']}"
        features = extractor.extract_feature_vector(combined_text)
        X_all.append(features)
        y_all.append(1)  # Has Markan source

    # Extract features from double tradition (Q only, label=0)
    for row in double:
        combined_text = f"{row['matthew_text']} {row['luke_text']}"
        features = extractor.extract_feature_vector(combined_text)
        X_all.append(features)
        y_all.append(0)  # No Markan source (Q only)

    X = np.array(X_all)
    y = np.array(y_all)

    # Handle any NaN/inf
    X = np.nan_to_num(X, nan=0.0, posinf=0.0, neginf=0.0)

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Cross-validation
    clf = LogisticRegression(max_iter=1000, class_weight='balanced')
    cv = StratifiedKFold(n_splits=min(5, min(sum(y==0), sum(y==1))))

    if cv.n_splits >= 2:
        preds = cross_val_predict(clf, X_scaled, y, cv=cv)
        test1_acc = accuracy_score(y, preds)
        test1_f1 = f1_score(y, preds, average='binary')

        print(f"\nResults:")
        print(f"  Accuracy: {test1_acc:.3f}")
        print(f"  F1 Score: {test1_f1:.3f}")
        print(f"  Chance: 0.500")
        print(f"\nConfusion Matrix:")
        cm = confusion_matrix(y, preds)
        print(f"  Predicted:    Q-only  Has-Mark")
        print(f"  Actual Q-only:  {cm[0,0]:4d}    {cm[0,1]:4d}")
        print(f"  Actual Has-Mark:{cm[1,0]:4d}    {cm[1,1]:4d}")
    else:
        print("Not enough data for cross-validation")
        test1_acc = 0.5
        test1_f1 = 0.5

    # =========================================================================
    # TEST 2: Within Triple Tradition - Identify Mark
    # =========================================================================
    print("\n" + "-" * 70)
    print("TEST 2: Gospel Identification within Triple Tradition")
    print("-" * 70)
    print("Can we identify which text is Matthew, Mark, or Luke?")

    X_gospel = []
    y_gospel = []

    for row in triple:
        # Matthew
        mt_features = extractor.extract_feature_vector(row['matthew_text'])
        X_gospel.append(mt_features)
        y_gospel.append(0)  # Matthew

        # Mark
        mk_features = extractor.extract_feature_vector(row['mark_text'])
        X_gospel.append(mk_features)
        y_gospel.append(1)  # Mark

        # Luke
        lk_features = extractor.extract_feature_vector(row['luke_text'])
        X_gospel.append(lk_features)
        y_gospel.append(2)  # Luke

    X_g = np.array(X_gospel)
    y_g = np.array(y_gospel)
    X_g = np.nan_to_num(X_g, nan=0.0, posinf=0.0, neginf=0.0)

    scaler_g = StandardScaler()
    X_g_scaled = scaler_g.fit_transform(X_g)

    clf_g = LogisticRegression(max_iter=1000, class_weight='balanced')
    cv_g = StratifiedKFold(n_splits=min(5, len(triple)))

    if cv_g.n_splits >= 2:
        preds_g = cross_val_predict(clf_g, X_g_scaled, y_g, cv=cv_g)
        test2_acc = accuracy_score(y_g, preds_g)
        test2_f1 = f1_score(y_g, preds_g, average='macro')

        print(f"\nResults:")
        print(f"  Accuracy: {test2_acc:.3f}")
        print(f"  Macro F1: {test2_f1:.3f}")
        print(f"  Chance: 0.333")
        print(f"\nPer-Gospel Performance:")
        labels = ['Matthew', 'Mark', 'Luke']
        for i, label in enumerate(labels):
            mask = y_g == i
            if mask.sum() > 0:
                acc = accuracy_score(y_g[mask], preds_g[mask])
                print(f"  {label}: {acc:.3f}")
    else:
        print("Not enough data for cross-validation")
        test2_acc = 0.33
        test2_f1 = 0.33

    # =========================================================================
    # TEST 3: Mark-specific Feature Analysis
    # =========================================================================
    print("\n" + "-" * 70)
    print("TEST 3: Mark-specific Stylistic Markers")
    print("-" * 70)

    # Compare average feature values across gospels
    mt_features_all = []
    mk_features_all = []
    lk_features_all = []

    for row in triple:
        mt_features_all.append(extractor.extract_features(row['matthew_text']))
        mk_features_all.append(extractor.extract_features(row['mark_text']))
        lk_features_all.append(extractor.extract_features(row['luke_text']))

    # Key Markan markers
    markers = ['kai_rate', 'historical_present', 'euthus_rate', 'sent_len_mean']

    print("\nKey stylistic markers (per 1000 words or mean):")
    print(f"{'Marker':<20} {'Matthew':>10} {'Mark':>10} {'Luke':>10}")
    print("-" * 52)

    for marker in markers:
        mt_val = np.mean([f.get(marker, 0) for f in mt_features_all])
        mk_val = np.mean([f.get(marker, 0) for f in mk_features_all])
        lk_val = np.mean([f.get(marker, 0) for f in lk_features_all])
        print(f"{marker:<20} {mt_val:>10.2f} {mk_val:>10.2f} {lk_val:>10.2f}")

    # =========================================================================
    # SUMMARY
    # =========================================================================
    print("\n" + "=" * 70)
    print("BENCHMARK SUMMARY")
    print("=" * 70)

    # Weighted average F1 (Test 2 is more important)
    overall_f1 = (test1_f1 * 0.3 + test2_f1 * 0.7)

    print(f"\nTest 1 (Triple vs Double): F1 = {test1_f1:.3f}")
    print(f"Test 2 (Gospel ID): F1 = {test2_f1:.3f}")
    print(f"Overall F1: {overall_f1:.3f}")
    print(f"Target: F1 >= 0.60")

    if overall_f1 >= 0.60:
        print("\n✓ BENCHMARK PASSED - Methodology validated on Mark reconstruction")
    else:
        print(f"\n✗ BENCHMARK NOT MET - Need CSI or more data")
        print(f"  Gap to target: {0.60 - overall_f1:.3f}")

    return {
        'test1_acc': test1_acc,
        'test1_f1': test1_f1,
        'test2_acc': test2_acc,
        'test2_f1': test2_f1,
        'overall_f1': overall_f1,
        'passed': overall_f1 >= 0.60
    }


async def main():
    pool = await asyncpg.create_pool(DATABASE_URL)
    results = await run_mark_benchmark(pool)
    await pool.close()
    return results


if __name__ == "__main__":
    asyncio.run(main())
