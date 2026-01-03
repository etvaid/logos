#!/usr/bin/env python3
"""
Test deterministic compute functions.
All tests should be reproducible - same input = same output.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from crews.compute.overlap import compute_overlap, tokenize, get_ngrams
from crews.compute.similarity import cosine_similarity, average_vectors
from crews.compute.ngrams import find_shared_ngrams, find_longest_common_sequence
from crews.pipelines.morphology_pipeline import MorphologyPipeline
from crews.pipelines.evidence_pipeline import EvidencePipeline


def test_tokenize():
    """Test tokenization is deterministic."""
    text = "The quick brown fox jumps over the lazy dog."
    tokens = tokenize(text)
    assert tokens == ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog']
    print("  tokenize: PASS")


def test_ngrams():
    """Test n-gram extraction is deterministic."""
    tokens = ['the', 'quick', 'brown', 'fox']
    bigrams = get_ngrams(tokens, 2)
    assert ('the', 'quick') in bigrams
    assert ('quick', 'brown') in bigrams
    assert ('brown', 'fox') in bigrams
    assert len(bigrams) == 3
    print("  ngrams: PASS")


def test_overlap():
    """Test overlap computation is deterministic and accurate."""
    text_a = "The quick brown fox jumps over the lazy dog"
    text_b = "The lazy brown fox sleeps under the quick cat"

    result = compute_overlap(text_a, text_b)

    # Check all expected fields
    assert 'word_overlap' in result
    assert 'bigram_overlap' in result
    assert 'trigram_overlap' in result
    assert 'shared_words' in result

    # Check reproducibility (run twice)
    result2 = compute_overlap(text_a, text_b)
    assert result['word_overlap'] == result2['word_overlap']
    assert result['bigram_overlap'] == result2['bigram_overlap']

    # Check that shared words are correct
    assert 'the' in result['shared_words']
    assert 'brown' in result['shared_words']
    assert 'fox' in result['shared_words']
    assert 'lazy' in result['shared_words']
    assert 'quick' in result['shared_words']

    print(f"  overlap: PASS (word={result['word_overlap']:.2%}, bigram={result['bigram_overlap']:.2%})")


def test_cosine_similarity():
    """Test cosine similarity is deterministic."""
    a = [1.0, 0.0, 0.0]
    b = [0.0, 1.0, 0.0]
    c = [1.0, 0.0, 0.0]

    # Orthogonal vectors
    sim_ab = cosine_similarity(a, b)
    assert abs(sim_ab - 0.0) < 0.001

    # Identical vectors
    sim_ac = cosine_similarity(a, c)
    assert abs(sim_ac - 1.0) < 0.001

    # 45 degree angle
    d = [1.0, 1.0, 0.0]
    sim_ad = cosine_similarity(a, d)
    assert abs(sim_ad - 0.7071) < 0.01  # 1/sqrt(2)

    print("  cosine_similarity: PASS")


def test_average_vectors():
    """Test vector averaging."""
    vectors = [
        [1.0, 2.0, 3.0],
        [3.0, 2.0, 1.0],
    ]
    avg = average_vectors(vectors)
    assert avg == [2.0, 2.0, 2.0]
    print("  average_vectors: PASS")


def test_shared_ngrams():
    """Test shared n-gram detection."""
    text_a = "The quick brown fox jumps over the lazy dog"
    text_b = "The quick brown cat sleeps over the lazy dog"

    result = find_shared_ngrams(text_a, text_b, n=3)

    assert result['n'] == 3
    assert result['shared_count'] > 0
    # "the quick brown" should be shared
    assert any('quick brown' in ng for ng in result['shared_ngrams'])

    print(f"  shared_ngrams: PASS (shared={result['shared_count']})")


def test_longest_common_sequence():
    """Test longest common sequence detection."""
    text_a = "The quick brown fox jumps over the lazy dog in the park"
    text_b = "A cat jumps over the lazy dog and runs away"

    sequences = find_longest_common_sequence(text_a, text_b, min_length=3)

    # "jumps over the lazy dog" should be found
    assert any('lazy dog' in seq for seq in sequences)

    print(f"  longest_common_sequence: PASS (found {len(sequences)} sequences)")


def test_morphology_pipeline():
    """Test morphology pipeline (heuristics only, no CLTK)."""
    pipeline = MorphologyPipeline()

    # Greek test with known words
    greek_text = "καί δέ ὁ θεός"
    tokens = pipeline.analyze_sync(greek_text, "greek")

    assert len(tokens) > 0

    # Check article detection
    article = next((t for t in tokens if t.surface == 'ὁ'), None)
    if article:
        assert article.pos == 'article', f"Expected article, got {article.pos}"

    print(f"  morphology_pipeline: PASS ({len(tokens)} tokens analyzed)")


def test_evidence_pipeline():
    """Test evidence pipeline produces deterministic output."""
    pipeline = EvidencePipeline()

    source = "For God so loved the world that he gave his only Son"
    target = "God loved the world and gave his Son for salvation"

    evidence = pipeline.compute_evidence(source, target, source_urn="test:1", target_urn="test:2")

    # Check all fields
    assert evidence.word_overlap > 0
    assert evidence.overall_confidence > 0
    assert evidence.connection_type in ['direct_quotation', 'close_allusion', 'allusion', 'thematic_parallel', 'possible_echo']

    # Check reproducibility
    evidence2 = pipeline.compute_evidence(source, target, source_urn="test:1", target_urn="test:2")
    assert evidence.word_overlap == evidence2.word_overlap
    assert evidence.overall_confidence == evidence2.overall_confidence

    print(f"  evidence_pipeline: PASS (confidence={evidence.overall_confidence:.2%}, type={evidence.connection_type})")


def main():
    print("=" * 60)
    print("DETERMINISTIC COMPUTE TESTS")
    print("=" * 60)
    print()

    print("Testing compute/overlap.py:")
    test_tokenize()
    test_ngrams()
    test_overlap()

    print("\nTesting compute/similarity.py:")
    test_cosine_similarity()
    test_average_vectors()

    print("\nTesting compute/ngrams.py:")
    test_shared_ngrams()
    test_longest_common_sequence()

    print("\nTesting pipelines/morphology_pipeline.py:")
    test_morphology_pipeline()

    print("\nTesting pipelines/evidence_pipeline.py:")
    test_evidence_pipeline()

    print()
    print("=" * 60)
    print("ALL TESTS PASSED")
    print("=" * 60)


if __name__ == "__main__":
    main()
