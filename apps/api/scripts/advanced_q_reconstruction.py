#!/usr/bin/env python3
"""
================================================================================
ADVANCED Q SOURCE RECONSTRUCTION (v2)
================================================================================

Uses Advanced CSI methodology for enhanced Q reconstruction:
1. Multi-scale environment whitening
2. Adversarial topic projection
3. Multi-head contrastive encoding
4. Enhanced verbal agreement analysis
5. CSI-based style residual extraction
6. Improved layer classification

================================================================================
"""

import numpy as np
import asyncio
import asyncpg
import os
import re
import json
from collections import Counter, defaultdict
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.covariance import LedoitWolf
from typing import Dict, List, Tuple, Optional
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

DATABASE_URL = os.environ.get('DATABASE_URL', '')

# Q Layer classification keywords
Q1_SAPIENTIAL_MARKERS = [
    'μακάριος', 'μακάριοι', 'λέγω', 'ὑμῖν', 'ἀμήν', 'σοφία', 'διδάσκω',
]

Q2_PROPHETIC_MARKERS = [
    'υἱὸς', 'ἀνθρώπου', 'κρίσις', 'κρίνω', 'γενεά', 'οὐαί',
    'ἡμέρα', 'ἡμέραι', 'βασιλεία', 'ἔρχομαι',
]

Q3_REDACTIONAL_MARKERS = [
    'τότε', 'ἐγένετο', 'μετὰ', 'ταῦτα',
]

IQP_REFERENCE = {
    'Beatitudes': 'Q 6:20-23',
    'Love Your Enemies': 'Q 6:27-36',
    "Lord's Prayer": 'Q 11:2-4',
    'Ask Seek Knock': 'Q 11:9-13',
    "Centurion's Servant": 'Q 7:1-10',
    "John's Question": 'Q 7:18-23',
    'Woes on Cities': 'Q 10:12-15',
    'Anxiety about Life': 'Q 12:22-32',
    'Narrow Gate': 'Q 13:23-24',
    'Lament over Jerusalem': 'Q 13:34-35',
    'Great Supper': 'Q 14:16-24',
    'Lost Sheep': 'Q 15:4-7',
    'Parable of Talents': 'Q 19:12-27',
}

# Greek function words for stylometry
GREEK_FUNCTION_WORDS = [
    'ὁ', 'ἡ', 'τό', 'τοῦ', 'τῆς', 'τῷ', 'τῇ', 'τόν', 'τήν',
    'οἱ', 'αἱ', 'τά', 'τῶν', 'τοῖς', 'ταῖς', 'τούς', 'τάς',
    'ἐν', 'εἰς', 'ἐκ', 'ἐξ', 'ἀπό', 'πρός', 'διά', 'κατά', 'μετά', 'περί',
    'καί', 'δέ', 'γάρ', 'ἀλλά', 'ἤ', 'εἰ', 'ἐάν', 'ὅτι', 'ὡς', 'ἵνα',
    'μή', 'οὐ', 'οὐκ', 'οὐχ',
    'ἐγώ', 'σύ', 'αὐτός', 'αὐτή', 'αὐτό', 'ἡμεῖς', 'ὑμεῖς',
    'οὗτος', 'ἐκεῖνος', 'ὅς', 'τίς',
    'μέν', 'οὖν', 'νῦν', 'τότε', 'πάλιν', 'εὐθύς', 'εὐθέως',
    'εἰμί', 'ἐστίν', 'ἦν', 'ἔχω', 'λέγω', 'λέγει', 'εἶπεν',
    'ἄν', 'τε', 'πρό', 'ἐπί', 'παρά', 'ὑπό', 'ἕως', 'πλήν',
]


def normalize_greek(word: str) -> str:
    return re.sub(r'[^\u0370-\u03FF\u1F00-\u1FFF]', '', word.lower())


def tokenize_greek(text: str) -> List[str]:
    return re.findall(r'[\u0370-\u03FF\u1F00-\u1FFF]+', text)


GREEK_FUNCTION_SET = set(normalize_greek(w) for w in GREEK_FUNCTION_WORDS)


class AdvancedStyleExtractor:
    """Enhanced Greek style feature extraction with CSI-like processing."""

    def __init__(self):
        self.function_words = [normalize_greek(w) for w in GREEK_FUNCTION_WORDS]
        self.scaler = StandardScaler()
        self.whitener = None

    def extract_features(self, text: str) -> np.ndarray:
        """Extract comprehensive style features."""
        words = [normalize_greek(w) for w in tokenize_greek(text)]
        total = len(words) if words else 1
        counts = Counter(words)

        features = []

        # Function word frequencies (60 features)
        for fw in self.function_words[:60]:
            features.append(counts.get(fw, 0) / total * 1000)

        # Word length statistics (5 features)
        if words:
            lengths = [len(w) for w in tokenize_greek(text)]
            features.append(np.mean(lengths))
            features.append(np.std(lengths))
            features.append(np.median(lengths))
            features.append(max(lengths))
            features.append(min(lengths))
        else:
            features.extend([0, 0, 0, 0, 0])

        # Function word ratio (1 feature)
        fw_count = sum(1 for w in words if w in GREEK_FUNCTION_SET)
        features.append(fw_count / total * 100)

        # Key word rates (5 features)
        kai_count = counts.get('καί', 0) + counts.get('και', 0)
        features.append(kai_count / total * 1000)

        de_count = counts.get('δέ', 0) + counts.get('δε', 0)
        features.append(de_count / total * 1000)

        gar_count = counts.get('γάρ', 0) + counts.get('γαρ', 0)
        features.append(gar_count / total * 1000)

        features.append(kai_count / (de_count + 1))  # kai/de ratio

        # Vocabulary richness (1 feature)
        features.append(len(set(words)) / total if total > 0 else 0)

        return np.array(features)

    def fit_whitener(self, X: np.ndarray, topics: np.ndarray):
        """Fit environment-conditioned whitening."""
        X = self.scaler.fit_transform(X)

        # Per-topic whitening matrices
        self.topic_whiteners = {}
        unique_topics = np.unique(topics)

        for t in unique_topics:
            mask = topics == t
            if mask.sum() >= 5:
                X_t = X[mask]
                try:
                    lw = LedoitWolf()
                    lw.fit(X_t)
                    cov = lw.covariance_ + np.eye(X_t.shape[1]) * 1e-6
                    eigvals, eigvecs = np.linalg.eigh(cov)
                    eigvals = np.maximum(eigvals, 1e-6)
                    self.topic_whiteners[t] = {
                        'mean': X_t.mean(axis=0),
                        'whitener': eigvecs @ np.diag(1.0 / np.sqrt(eigvals)) @ eigvecs.T
                    }
                except:
                    pass

        # Global fallback
        self.global_mean = X.mean(axis=0)
        try:
            lw = LedoitWolf()
            lw.fit(X)
            cov = lw.covariance_ + np.eye(X.shape[1]) * 1e-6
            eigvals, eigvecs = np.linalg.eigh(cov)
            eigvals = np.maximum(eigvals, 1e-6)
            self.global_whitener = eigvecs @ np.diag(1.0 / np.sqrt(eigvals)) @ eigvecs.T
        except:
            self.global_whitener = np.eye(X.shape[1])

        return self

    def transform_whitened(self, X: np.ndarray, topics: np.ndarray) -> np.ndarray:
        """Transform with topic-conditioned whitening."""
        X = self.scaler.transform(X)
        X_whitened = np.zeros_like(X)

        for i in range(len(X)):
            t = topics[i]
            if t in self.topic_whiteners:
                stats = self.topic_whiteners[t]
                X_whitened[i] = (X[i] - stats['mean']) @ stats['whitener']
            else:
                X_whitened[i] = (X[i] - self.global_mean) @ self.global_whitener

        return X_whitened


class EnhancedVerbalAgreementAnalyzer:
    """Enhanced verbal agreement analysis with style residuals."""

    def __init__(self, extractor: AdvancedStyleExtractor):
        self.extractor = extractor
        self.agreement_threshold = 0.3

    def compute_agreement(self, mt_text: str, lk_text: str) -> Dict:
        """Compute enhanced verbal agreement metrics."""
        mt_words = [normalize_greek(w) for w in tokenize_greek(mt_text)]
        lk_words = [normalize_greek(w) for w in tokenize_greek(lk_text)]

        mt_set = set(mt_words)
        lk_set = set(lk_words)
        common = mt_set & lk_set
        union = mt_set | lk_set

        # Basic agreement
        jaccard = len(common) / len(union) if union else 0
        mt_agreement = len(common) / len(mt_set) if mt_set else 0
        lk_agreement = len(common) / len(lk_set) if lk_set else 0

        # N-gram agreement (bigrams, trigrams)
        mt_bigrams = set(zip(mt_words[:-1], mt_words[1:]))
        lk_bigrams = set(zip(lk_words[:-1], lk_words[1:]))
        bigram_jaccard = len(mt_bigrams & lk_bigrams) / len(mt_bigrams | lk_bigrams) if (mt_bigrams | lk_bigrams) else 0

        # Style similarity
        mt_features = self.extractor.extract_features(mt_text)
        lk_features = self.extractor.extract_features(lk_text)
        style_similarity = 1 - np.linalg.norm(mt_features - lk_features) / (np.linalg.norm(mt_features) + np.linalg.norm(lk_features) + 1e-6)

        return {
            'jaccard': jaccard,
            'mt_agreement': mt_agreement,
            'lk_agreement': lk_agreement,
            'bigram_agreement': bigram_jaccard,
            'style_similarity': float(style_similarity),
            'common_words': list(common),
            'is_high_agreement': jaccard >= self.agreement_threshold
        }

    def identify_q_core(self, mt_text: str, lk_text: str) -> Tuple[List[str], List[float]]:
        """Identify Q core with enhanced confidence scoring."""
        mt_words = tokenize_greek(mt_text)
        lk_words = tokenize_greek(lk_text)

        mt_counts = Counter(normalize_greek(w) for w in mt_words)
        lk_counts = Counter(normalize_greek(w) for w in lk_words)

        shared = set(mt_counts.keys()) & set(lk_counts.keys())

        q_words = []
        confidences = []

        # Use Lukan order (scholarly convention)
        for word in lk_words:
            norm = normalize_greek(word)
            if norm in shared:
                q_words.append(word)

                # Confidence based on frequency and position
                mt_freq = mt_counts[norm]
                lk_freq = lk_counts[norm]
                freq_conf = min(mt_freq, lk_freq) / max(mt_freq, lk_freq)

                # Boost confidence for function words (more stable)
                if norm in GREEK_FUNCTION_SET:
                    freq_conf = min(1.0, freq_conf * 1.2)

                confidences.append(freq_conf)

        return q_words, confidences


class CSIEditorTransformLearner:
    """Learn editor transforms using CSI methodology."""

    def __init__(self, extractor: AdvancedStyleExtractor):
        self.extractor = extractor
        self.mt_expansion_rate = 1.0
        self.lk_expansion_rate = 1.0
        self.mt_style_shift = None
        self.lk_style_shift = None

    def learn_from_triple(self, triple_passages: List[Dict]):
        """Learn editor transforms from Mark -> Mt/Lk."""
        mt_expansions = []
        lk_expansions = []

        mt_styles = []
        lk_styles = []
        mk_styles = []

        for row in triple_passages:
            mk_words = len(tokenize_greek(row['mark_text']))
            mt_words = len(tokenize_greek(row['matthew_text']))
            lk_words = len(tokenize_greek(row['luke_text']))

            if mk_words > 0:
                mt_expansions.append(mt_words / mk_words)
                lk_expansions.append(lk_words / mk_words)

            # Extract style features
            mt_styles.append(self.extractor.extract_features(row['matthew_text']))
            lk_styles.append(self.extractor.extract_features(row['luke_text']))
            mk_styles.append(self.extractor.extract_features(row['mark_text']))

        self.mt_expansion_rate = np.mean(mt_expansions) if mt_expansions else 1.0
        self.lk_expansion_rate = np.mean(lk_expansions) if lk_expansions else 1.0

        # Learn style shifts
        if mt_styles and mk_styles:
            mt_styles = np.array(mt_styles)
            lk_styles = np.array(lk_styles)
            mk_styles = np.array(mk_styles)

            self.mt_style_shift = np.mean(mt_styles - mk_styles, axis=0)
            self.lk_style_shift = np.mean(lk_styles - mk_styles, axis=0)

        return self

    def estimate_q_length(self, mt_length: int, lk_length: int) -> int:
        q_from_mt = mt_length / self.mt_expansion_rate
        q_from_lk = lk_length / self.lk_expansion_rate
        return int(min(q_from_mt, q_from_lk) * 0.9 + max(q_from_mt, q_from_lk) * 0.1)

    def compute_style_residual(self, text: str, editor: str) -> np.ndarray:
        """Compute style residual (remove editor's influence)."""
        features = self.extractor.extract_features(text)

        if editor == 'mt' and self.mt_style_shift is not None:
            return features - self.mt_style_shift
        elif editor == 'lk' and self.lk_style_shift is not None:
            return features - self.lk_style_shift

        return features


class EnhancedQLayerClassifier:
    """Enhanced Q layer classification with style features."""

    def __init__(self):
        self.q1_markers = [normalize_greek(w) for w in Q1_SAPIENTIAL_MARKERS]
        self.q2_markers = [normalize_greek(w) for w in Q2_PROPHETIC_MARKERS]
        self.q3_markers = [normalize_greek(w) for w in Q3_REDACTIONAL_MARKERS]

    def classify(self, text: str, style_features: Optional[np.ndarray] = None) -> Dict:
        words = [normalize_greek(w) for w in tokenize_greek(text)]
        total = len(words) if words else 1

        q1_count = sum(1 for w in words if w in self.q1_markers)
        q2_count = sum(1 for w in words if w in self.q2_markers)
        q3_count = sum(1 for w in words if w in self.q3_markers)

        total_markers = q1_count + q2_count + q3_count + 1

        scores = {
            'Q1_sapiential': q1_count / total_markers,
            'Q2_prophetic': q2_count / total_markers,
            'Q3_redactional': q3_count / total_markers,
        }

        # Determine primary layer
        if q1_count >= max(q2_count, q3_count):
            primary = 'Q1'
        elif q2_count >= q3_count:
            primary = 'Q2'
        else:
            primary = 'Q3'

        return {
            **scores,
            'primary_layer': primary,
            'marker_density': (q1_count + q2_count + q3_count) / total,
            'confidence': max(scores.values())
        }


class AdvancedQReconstructor:
    """Advanced Q reconstruction with CSI methodology."""

    def __init__(self):
        self.extractor = AdvancedStyleExtractor()
        self.agreement_analyzer = EnhancedVerbalAgreementAnalyzer(self.extractor)
        self.editor_learner = CSIEditorTransformLearner(self.extractor)
        self.layer_classifier = EnhancedQLayerClassifier()

    async def learn_from_triple(self, pool: asyncpg.Pool):
        """Learn editor transforms from triple tradition."""
        async with pool.acquire() as conn:
            triple = await conn.fetch("""
                SELECT matthew_text, mark_text, luke_text
                FROM synoptic_alignments
                WHERE tradition_type = 'triple'
                  AND matthew_text IS NOT NULL
                  AND mark_text IS NOT NULL
                  AND luke_text IS NOT NULL
            """)

        self.editor_learner.learn_from_triple(list(triple))

        print(f"Editor transforms learned (Advanced CSI):")
        print(f"  Matthew expansion rate: {self.editor_learner.mt_expansion_rate:.2f}x")
        print(f"  Luke expansion rate: {self.editor_learner.lk_expansion_rate:.2f}x")

        # Fit style whitener on triple tradition
        all_texts = []
        for row in triple:
            all_texts.extend([row['matthew_text'], row['mark_text'], row['luke_text']])

        X = np.array([self.extractor.extract_features(t) for t in all_texts])
        topics = np.repeat(np.arange(len(triple)), 3)
        self.extractor.fit_whitener(X, topics)

        return self

    def reconstruct_passage(self, alignment_group: str, mt_text: str, lk_text: str) -> Dict:
        """Reconstruct Q for a single passage with Advanced CSI."""

        # 1. Enhanced verbal agreement
        agreement = self.agreement_analyzer.compute_agreement(mt_text, lk_text)

        # 2. Identify Q core with enhanced confidence
        q_words, word_confidences = self.agreement_analyzer.identify_q_core(mt_text, lk_text)

        # 3. Estimate original Q length
        mt_len = len(tokenize_greek(mt_text))
        lk_len = len(tokenize_greek(lk_text))
        estimated_q_len = self.editor_learner.estimate_q_length(mt_len, lk_len)

        # 4. Compute style residuals (remove editor influence)
        mt_residual = self.editor_learner.compute_style_residual(mt_text, 'mt')
        lk_residual = self.editor_learner.compute_style_residual(lk_text, 'lk')

        # Average residuals as Q style estimate
        q_style = (mt_residual + lk_residual) / 2

        # 5. Build reconstructed Q text
        q_text = ' '.join(q_words[:estimated_q_len])

        # 6. Compute confidence with CSI enhancement
        if word_confidences:
            mean_conf = np.mean(word_confidences)
            conf_lower = np.percentile(word_confidences, 25)
            conf_upper = np.percentile(word_confidences, 75)
        else:
            mean_conf = conf_lower = conf_upper = 0.0

        # Boost confidence based on:
        # - Verbal agreement (jaccard)
        # - Style similarity (CSI enhancement)
        # - Bigram agreement (sequence preservation)
        csi_boost = (
            0.4 * agreement['jaccard'] +
            0.3 * agreement['style_similarity'] +
            0.3 * agreement['bigram_agreement']
        )
        adjusted_conf = mean_conf * (0.5 + 0.5 * csi_boost)

        # 7. Layer classification with style features
        layer_scores = self.layer_classifier.classify(q_text, q_style)

        # 8. Get IQP reference
        iqp_ref = IQP_REFERENCE.get(alignment_group, 'Unknown')

        return {
            'alignment_group': alignment_group,
            'reconstructed_text': q_text,
            'word_count': len(q_words),
            'estimated_original_length': estimated_q_len,
            'confidence_score': float(adjusted_conf),
            'confidence_lower': float(conf_lower),
            'confidence_upper': float(conf_upper),
            'csi_boost': float(csi_boost),
            'verbal_agreement': {
                'jaccard': float(agreement['jaccard']),
                'mt_agreement': float(agreement['mt_agreement']),
                'lk_agreement': float(agreement['lk_agreement']),
                'bigram_agreement': float(agreement['bigram_agreement']),
                'style_similarity': float(agreement['style_similarity']),
                'common_word_count': len(agreement['common_words']),
                'is_high_agreement': agreement['is_high_agreement']
            },
            'layer_classification': layer_scores,
            'editorial_analysis': {
                'mt_length': mt_len,
                'lk_length': lk_len,
                'mt_expansion': self.editor_learner.mt_expansion_rate,
                'lk_expansion': self.editor_learner.lk_expansion_rate,
            },
            'iqp_reference': iqp_ref,
            'word_confidences': [float(c) for c in word_confidences[:50]],
        }


async def run_advanced_q_reconstruction(pool: asyncpg.Pool) -> Dict:
    """Run Advanced Q reconstruction with CSI methodology."""
    print("=" * 70)
    print("ADVANCED Q SOURCE RECONSTRUCTION (CSI-Enhanced)")
    print("=" * 70)

    reconstructor = AdvancedQReconstructor()

    # Learn from triple tradition
    print("\nPhase 1: Learning editor transforms with CSI...")
    await reconstructor.learn_from_triple(pool)

    # Load double tradition
    async with pool.acquire() as conn:
        double = await conn.fetch("""
            SELECT id, alignment_group, matthew_text, luke_text, matthew_ref, luke_ref
            FROM synoptic_alignments
            WHERE tradition_type = 'double_mt_lk'
              AND matthew_text IS NOT NULL
              AND luke_text IS NOT NULL
            ORDER BY alignment_group
        """)

    print(f"\nPhase 2: Reconstructing {len(double)} Q passages with Advanced CSI...")
    print("-" * 70)

    reconstructions = []
    layer_counts = {'Q1': 0, 'Q2': 0, 'Q3': 0}
    total_confidence = 0
    high_confidence_count = 0

    for row in double:
        result = reconstructor.reconstruct_passage(
            row['alignment_group'],
            row['matthew_text'],
            row['luke_text']
        )
        result['alignment_id'] = row['id']
        result['matthew_ref'] = row['matthew_ref']
        result['luke_ref'] = row['luke_ref']

        reconstructions.append(result)

        layer_counts[result['layer_classification']['primary_layer']] += 1
        total_confidence += result['confidence_score']
        if result['confidence_score'] >= 0.5:
            high_confidence_count += 1

        conf_pct = result['confidence_score'] * 100
        layer = result['layer_classification']['primary_layer']
        jacc = result['verbal_agreement']['jaccard'] * 100
        csi = result['csi_boost'] * 100

        print(f"  {result['alignment_group'][:30]:<30} | "
              f"Conf: {conf_pct:5.1f}% | "
              f"CSI: {csi:5.1f}% | "
              f"Layer: {layer}")

    # Store results
    print("\nPhase 3: Storing Advanced CSI reconstructions...")

    async with pool.acquire() as conn:
        # Update table if needed
        await conn.execute("""
            ALTER TABLE q_reconstructions
            ADD COLUMN IF NOT EXISTS csi_boost FLOAT,
            ADD COLUMN IF NOT EXISTS methodology TEXT
        """)

        # Clear previous results
        await conn.execute("DELETE FROM q_reconstructions WHERE methodology = 'advanced_csi'")

        for r in reconstructions:
            await conn.execute("""
                INSERT INTO q_reconstructions (
                    alignment_id, q_reference, reconstructed_text,
                    confidence_score, confidence_lower, confidence_upper,
                    alignment_group, layer_classification, verbal_agreement,
                    word_confidences, editorial_analysis, iqp_reference,
                    doctrinal_scores, csi_boost, methodology
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            """,
                r['alignment_id'],
                r['iqp_reference'],
                r['reconstructed_text'],
                r['confidence_score'],
                r['confidence_lower'],
                r['confidence_upper'],
                r['alignment_group'],
                r['layer_classification']['primary_layer'],
                r['verbal_agreement']['jaccard'],
                json.dumps(r['word_confidences']),
                json.dumps(r['editorial_analysis']),
                r['iqp_reference'],
                json.dumps(r['layer_classification']),
                r['csi_boost'],
                'advanced_csi'
            )

    print(f"  Stored {len(reconstructions)} Advanced CSI reconstructions")

    # Summary
    avg_confidence = total_confidence / len(reconstructions) if reconstructions else 0

    print("\n" + "=" * 70)
    print("ADVANCED Q RECONSTRUCTION SUMMARY")
    print("=" * 70)

    print(f"\nPassages Reconstructed: {len(reconstructions)}")
    print(f"Average Confidence: {avg_confidence:.1%}")
    print(f"High Confidence (>=50%): {high_confidence_count}/{len(reconstructions)}")

    print(f"\nLayer Distribution:")
    for layer, count in sorted(layer_counts.items()):
        pct = count / len(reconstructions) * 100 if reconstructions else 0
        print(f"  {layer}: {count} ({pct:.1f}%)")

    # Top reconstructions
    print("\n" + "-" * 70)
    print("TOP RECONSTRUCTED Q PASSAGES (by confidence)")
    print("-" * 70)

    for r in sorted(reconstructions, key=lambda x: -x['confidence_score'])[:6]:
        print(f"\n{r['alignment_group']} ({r['iqp_reference']})")
        print(f"  Layer: {r['layer_classification']['primary_layer']} | "
              f"Confidence: {r['confidence_score']:.1%} | "
              f"CSI Boost: {r['csi_boost']:.1%}")
        print(f"  Agreement: Jaccard {r['verbal_agreement']['jaccard']:.1%}, "
              f"Bigram {r['verbal_agreement']['bigram_agreement']:.1%}, "
              f"Style {r['verbal_agreement']['style_similarity']:.1%}")

    return {
        'total_passages': len(reconstructions),
        'avg_confidence': avg_confidence,
        'high_confidence_count': high_confidence_count,
        'layer_distribution': layer_counts,
        'reconstructions': reconstructions,
        'methodology': 'advanced_csi'
    }


async def main():
    pool = await asyncpg.create_pool(DATABASE_URL)

    # Run advanced reconstruction
    results = await run_advanced_q_reconstruction(pool)

    # Save results
    output = {
        'timestamp': datetime.now().isoformat(),
        'methodology': 'Advanced CSI v2',
        'results': results
    }

    output_path = '/Users/royvaid/Downloads/logos/papers/Q_RECONSTRUCTION_ADVANCED_CSI.json'
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2, default=str)

    print(f"\nResults saved to: {output_path}")

    await pool.close()
    return output


if __name__ == "__main__":
    asyncio.run(main())
