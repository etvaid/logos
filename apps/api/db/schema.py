"""
LOGOS Database Schema with pgvector Support
=============================================

Complete schema for the LOGOS platform with 50+ tables.
Uses pgvector for efficient embedding operations.

CRITICAL: All embedding columns use VECTOR(768) - matches EMBED_DIM in constants.py
"""

from typing import Optional
import asyncpg
from config.constants import EMBED_DIM, STYLE_DIM

# Schema version for migrations
SCHEMA_VERSION = "2.0.0"

# ═══════════════════════════════════════════════════════════════════════════════
# SCHEMA SQL - Execute in order
# ═══════════════════════════════════════════════════════════════════════════════

INIT_EXTENSIONS = """
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;
"""

# ═══════════════════════════════════════════════════════════════════════════════
# CORE TABLES
# ═══════════════════════════════════════════════════════════════════════════════

CORE_TABLES = f"""
-- ═══════════════════════════════════════════════════════════════════════════════
-- AUTHORS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_latin TEXT,
    name_greek TEXT,
    birth_year INTEGER,
    death_year INTEGER,
    floruit_start INTEGER,
    floruit_end INTEGER,
    language TEXT DEFAULT 'greek',
    period TEXT,
    genre TEXT,
    dialect TEXT,
    bio TEXT,
    tlg_id TEXT,
    phi_id TEXT,
    wikidata_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, language)
);

CREATE INDEX IF NOT EXISTS idx_authors_name ON authors(name);
CREATE INDEX IF NOT EXISTS idx_authors_language ON authors(language);
CREATE INDEX IF NOT EXISTS idx_authors_period ON authors(period);

-- ═══════════════════════════════════════════════════════════════════════════════
-- WORKS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS works (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_latin TEXT,
    title_greek TEXT,
    urn TEXT UNIQUE,
    language TEXT DEFAULT 'greek',
    genre TEXT,
    subgenre TEXT,
    date_composed_start INTEGER,
    date_composed_end INTEGER,
    is_disputed BOOLEAN DEFAULT FALSE,
    traditional_author TEXT,
    word_count INTEGER,
    manuscript_tradition TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_works_author ON works(author_id);
CREATE INDEX IF NOT EXISTS idx_works_urn ON works(urn);
CREATE INDEX IF NOT EXISTS idx_works_genre ON works(genre);

-- ═══════════════════════════════════════════════════════════════════════════════
-- SOURCE TEXTS TABLE (Original classical texts)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS source_texts (
    id SERIAL PRIMARY KEY,
    work_id INTEGER REFERENCES works(id) ON DELETE CASCADE,
    urn TEXT NOT NULL,
    reference TEXT NOT NULL,
    text_content TEXT NOT NULL,
    language TEXT DEFAULT 'greek',
    word_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(urn, reference)
);

CREATE INDEX IF NOT EXISTS idx_source_texts_work ON source_texts(work_id);
CREATE INDEX IF NOT EXISTS idx_source_texts_urn ON source_texts(urn);
CREATE INDEX IF NOT EXISTS idx_source_texts_reference ON source_texts(reference);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PASSAGES TABLE (Unified passage storage with embeddings)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS passages (
    id SERIAL PRIMARY KEY,
    source_text_id INTEGER REFERENCES source_texts(id) ON DELETE CASCADE,
    work_id INTEGER REFERENCES works(id) ON DELETE SET NULL,
    author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL,
    urn TEXT,
    reference TEXT,
    text_content TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'greek',

    -- Embeddings (CRITICAL: use VECTOR not FLOAT[])
    embedding VECTOR({EMBED_DIM}),
    style_vector VECTOR({STYLE_DIM}),

    -- Metrics
    word_count INTEGER,
    sentence_count INTEGER,
    hapax_count INTEGER,
    avg_sentence_length FLOAT,
    lexical_density FLOAT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_passages_work ON passages(work_id);
CREATE INDEX IF NOT EXISTS idx_passages_author ON passages(author_id);
CREATE INDEX IF NOT EXISTS idx_passages_urn ON passages(urn);
CREATE INDEX IF NOT EXISTS idx_passages_language ON passages(language);

-- CRITICAL: HNSW index for fast vector similarity search
CREATE INDEX IF NOT EXISTS idx_passages_embedding_hnsw
    ON passages USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 200);

CREATE INDEX IF NOT EXISTS idx_passages_style_hnsw
    ON passages USING hnsw (style_vector vector_cosine_ops)
    WITH (m = 16, ef_construction = 200);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TRANSLATIONS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS translations (
    id SERIAL PRIMARY KEY,
    source_text_id INTEGER REFERENCES source_texts(id) ON DELETE CASCADE,
    translator_id INTEGER,
    text_content TEXT NOT NULL,
    target_language TEXT DEFAULT 'english',

    -- Embeddings
    embedding VECTOR({EMBED_DIM}),
    style_vector VECTOR({STYLE_DIM}),
    style_residual VECTOR({EMBED_DIM}),

    -- Quality metrics
    ltqi_score FLOAT,
    semantic_score FLOAT,
    syntactic_score FLOAT,
    register_score FLOAT,
    fluency_score FLOAT,
    corpus_score FLOAT,

    -- Confidence
    ltqi_lower FLOAT,
    ltqi_upper FLOAT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_translations_source ON translations(source_text_id);
CREATE INDEX IF NOT EXISTS idx_translations_translator ON translations(translator_id);

CREATE INDEX IF NOT EXISTS idx_translations_embedding_hnsw
    ON translations USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 200);

CREATE INDEX IF NOT EXISTS idx_translations_style_residual_hnsw
    ON translations USING hnsw (style_residual vector_cosine_ops)
    WITH (m = 16, ef_construction = 200);
"""

# ═══════════════════════════════════════════════════════════════════════════════
# MEANING ANCHORS AND STYLE RESIDUALS
# ═══════════════════════════════════════════════════════════════════════════════

STYLE_TABLES = f"""
-- ═══════════════════════════════════════════════════════════════════════════════
-- MEANING ANCHORS TABLE (Centroids of parallel translations)
-- Fixed: Added source_author, source_work, source_urn columns
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS meaning_anchors (
    id SERIAL PRIMARY KEY,
    source_text_id INTEGER REFERENCES source_texts(id) ON DELETE CASCADE,
    source_author TEXT,
    source_work TEXT,
    source_urn TEXT,

    -- Anchor embedding (centroid or optimal transport barycenter)
    anchor_embedding VECTOR({EMBED_DIM}) NOT NULL,

    -- Computation metadata
    n_translations INTEGER NOT NULL DEFAULT 1,
    computation_method TEXT DEFAULT 'centroid',  -- 'centroid' or 'optimal_transport'
    barycenter_weights FLOAT[],

    -- Quality indicators
    embedding_variance FLOAT,
    stability_score FLOAT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(source_text_id)
);

CREATE INDEX IF NOT EXISTS idx_meaning_anchors_source ON meaning_anchors(source_text_id);
CREATE INDEX IF NOT EXISTS idx_meaning_anchors_author ON meaning_anchors(source_author);

CREATE INDEX IF NOT EXISTS idx_meaning_anchors_embedding_hnsw
    ON meaning_anchors USING hnsw (anchor_embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 200);

-- ═══════════════════════════════════════════════════════════════════════════════
-- STYLE RESIDUALS TABLE (Translation - Meaning Anchor)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS style_residuals (
    id SERIAL PRIMARY KEY,
    translation_id INTEGER REFERENCES translations(id) ON DELETE CASCADE,
    meaning_anchor_id INTEGER REFERENCES meaning_anchors(id) ON DELETE CASCADE,
    translator_id INTEGER,

    -- Style residual vector
    residual_vector VECTOR({EMBED_DIM}) NOT NULL,

    -- Magnitude and direction metrics
    residual_magnitude FLOAT,
    semantic_purity FLOAT,  -- How much style vs content

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(translation_id)
);

CREATE INDEX IF NOT EXISTS idx_style_residuals_translator ON style_residuals(translator_id);
CREATE INDEX IF NOT EXISTS idx_style_residuals_anchor ON style_residuals(meaning_anchor_id);

CREATE INDEX IF NOT EXISTS idx_style_residuals_vector_hnsw
    ON style_residuals USING hnsw (residual_vector vector_cosine_ops)
    WITH (m = 16, ef_construction = 200);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TRANSLATOR CENTROIDS TABLE (Average style per translator)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS translator_centroids (
    id SERIAL PRIMARY KEY,
    translator_id INTEGER NOT NULL UNIQUE,
    translator_name TEXT NOT NULL,

    -- Centroid embedding
    centroid_embedding VECTOR({EMBED_DIM}) NOT NULL,

    -- Statistics
    n_translations INTEGER DEFAULT 0,
    avg_residual_magnitude FLOAT,
    style_consistency FLOAT,  -- Lower variance = more consistent

    -- Interpretable style vector
    style_profile VECTOR({STYLE_DIM}),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_translator_centroids_embedding_hnsw
    ON translator_centroids USING hnsw (centroid_embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 200);
"""

# ═══════════════════════════════════════════════════════════════════════════════
# CALIBRATION TABLES
# ═══════════════════════════════════════════════════════════════════════════════

CALIBRATION_TABLES = f"""
-- ═══════════════════════════════════════════════════════════════════════════════
-- CALIBRATION RUNS TABLE (Overall calibration run metadata)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS calibration_runs (
    id SERIAL PRIMARY KEY,
    run_id UUID NOT NULL UNIQUE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'running',  -- 'running', 'completed', 'failed'

    -- Gates passed
    gate_1_passed BOOLEAN,
    gate_2_passed BOOLEAN,
    gate_3_passed BOOLEAN,
    gate_4_passed BOOLEAN,
    all_gates_passed BOOLEAN,

    -- Error details if failed
    error_message TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- GATE 1: STYLE SEPARABILITY (Supervised Classifier)
-- Fixed: Use supervised classifier not KMeans
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS calibration_gate1 (
    id SERIAL PRIMARY KEY,
    run_id UUID REFERENCES calibration_runs(run_id) ON DELETE CASCADE,

    -- Supervised classifier metrics
    classifier_type TEXT DEFAULT 'logistic_regression',
    top1_accuracy FLOAT NOT NULL,
    top3_accuracy FLOAT NOT NULL,

    -- Clustering metrics (for additional validation)
    nmi_score FLOAT,  -- Normalized Mutual Information
    ari_score FLOAT,  -- Adjusted Rand Index

    -- Calibration
    ece_score FLOAT,  -- Expected Calibration Error

    -- Per-translator breakdown
    per_translator_accuracy JSONB,
    confusion_matrix JSONB,

    -- Validation
    passed BOOLEAN NOT NULL,
    threshold_top1 FLOAT DEFAULT 0.70,
    threshold_top3 FLOAT DEFAULT 0.85,
    threshold_ece FLOAT DEFAULT 0.05,

    -- Leakage prevention
    split_by_meaning_anchor BOOLEAN DEFAULT TRUE,
    n_folds INTEGER DEFAULT 5,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- GATE 2: STABILITY ACROSS WINDOWS
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS calibration_gate2 (
    id SERIAL PRIMARY KEY,
    run_id UUID REFERENCES calibration_runs(run_id) ON DELETE CASCADE,

    -- Window sizes tested
    window_sizes INTEGER[] DEFAULT ARRAY[500, 1000, 2000],

    -- F-ratio per window size
    f_ratios JSONB,  -- {{"500": 3.5, "1000": 4.2, "2000": 5.1}}

    -- Signature stability
    signature_correlations JSONB,  -- Pearson r between window sizes
    min_f_ratio FLOAT,

    -- Validation
    passed BOOLEAN NOT NULL,
    threshold_f_ratio FLOAT DEFAULT 3.0,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- GATE 3: CROSS-ERA SEPARATION (Per-difficulty metrics)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS calibration_gate3 (
    id SERIAL PRIMARY KEY,
    run_id UUID REFERENCES calibration_runs(run_id) ON DELETE CASCADE,

    -- Difficulty categories
    easy_accuracy FLOAT,   -- Same author, different work
    medium_accuracy FLOAT, -- Same era, different author
    hard_accuracy FLOAT,   -- Different era impostor

    -- Cross-era confusion matrix
    era_confusion_matrix JSONB,

    -- Per-era metrics
    per_era_metrics JSONB,

    -- Validation
    passed BOOLEAN NOT NULL,
    threshold_easy FLOAT DEFAULT 0.90,
    threshold_medium FLOAT DEFAULT 0.80,
    threshold_hard FLOAT DEFAULT 0.70,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- GATE 4: EXTERNAL VALIDITY (Known impostors and scholarly consensus)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS calibration_gate4 (
    id SERIAL PRIMARY KEY,
    run_id UUID REFERENCES calibration_runs(run_id) ON DELETE CASCADE,

    -- Known cases tested
    known_cases_tested INTEGER,
    known_cases_correct INTEGER,
    neighbor_validity_score FLOAT,  -- % of known impostors correctly flagged

    -- Per-case results
    case_results JSONB,  -- [{{"urn": "...", "expected": "...", "predicted": "...", "correct": true}}]

    -- Scholarly consensus alignment
    consensus_agreement_rate FLOAT,
    disputed_works_tested INTEGER,

    -- Validation
    passed BOOLEAN NOT NULL,
    threshold_validity FLOAT DEFAULT 0.80,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- CALIBRATION HISTORY (Track all calibration attempts)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS calibration_history (
    id SERIAL PRIMARY KEY,
    gate_number INTEGER NOT NULL,
    run_id UUID,
    metric_name TEXT NOT NULL,
    metric_value FLOAT NOT NULL,
    threshold FLOAT NOT NULL,
    passed BOOLEAN NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calibration_history_gate ON calibration_history(gate_number);
CREATE INDEX IF NOT EXISTS idx_calibration_history_run ON calibration_history(run_id);
"""

# ═══════════════════════════════════════════════════════════════════════════════
# AUTHORSHIP ANALYSIS TABLES
# ═══════════════════════════════════════════════════════════════════════════════

AUTHORSHIP_TABLES = f"""
-- ═══════════════════════════════════════════════════════════════════════════════
-- AUTHORSHIP FINGERPRINTS (Per-author stylometric signature)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS authorship_fingerprints (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,

    -- Style embedding
    fingerprint_embedding VECTOR({EMBED_DIM}) NOT NULL,

    -- Function word frequencies
    function_word_freqs JSONB,

    -- Syntactic patterns
    clause_depth_distribution FLOAT[],
    sentence_length_distribution FLOAT[],

    -- Vocabulary metrics
    hapax_ratio FLOAT,
    ttr_score FLOAT,  -- Type-token ratio

    -- Computed on n passages
    n_passages INTEGER,
    total_words INTEGER,

    -- Stability metrics
    internal_consistency FLOAT,
    cross_work_stability FLOAT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(author_id)
);

CREATE INDEX IF NOT EXISTS idx_authorship_fingerprints_embedding_hnsw
    ON authorship_fingerprints USING hnsw (fingerprint_embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 200);

-- ═══════════════════════════════════════════════════════════════════════════════
-- AUTHORSHIP SEGMENTS (HMM-detected authorial boundaries)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS authorship_segments (
    id SERIAL PRIMARY KEY,
    work_id INTEGER REFERENCES works(id) ON DELETE CASCADE,

    -- Segment boundaries
    start_position INTEGER NOT NULL,
    end_position INTEGER NOT NULL,
    start_reference TEXT,
    end_reference TEXT,

    -- Attribution
    predicted_author_id INTEGER REFERENCES authors(id),
    predicted_author_name TEXT,
    attribution_confidence FLOAT,

    -- HMM state
    hmm_state INTEGER,
    transition_probability FLOAT,
    emission_probability FLOAT,

    -- Style metrics for segment
    segment_embedding VECTOR({EMBED_DIM}),

    -- Anomaly indicators
    is_interpolation BOOLEAN DEFAULT FALSE,
    interpolation_confidence FLOAT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_authorship_segments_work ON authorship_segments(work_id);
CREATE INDEX IF NOT EXISTS idx_authorship_segments_author ON authorship_segments(predicted_author_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- AUTHORSHIP COMPARISONS (Pairwise author similarity)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS authorship_comparisons (
    id SERIAL PRIMARY KEY,
    author_a_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    author_b_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,

    -- Similarity metrics
    embedding_cosine_sim FLOAT,
    function_word_correlation FLOAT,
    syntactic_similarity FLOAT,

    -- Bootstrap confidence
    similarity_mean FLOAT,
    similarity_std FLOAT,
    similarity_lower FLOAT,
    similarity_upper FLOAT,

    -- P-value from permutation test
    p_value FLOAT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(author_a_id, author_b_id)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- DISPUTED WORK ANALYSIS
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS disputed_work_analyses (
    id SERIAL PRIMARY KEY,
    work_id INTEGER REFERENCES works(id) ON DELETE CASCADE,

    -- Traditional attribution
    traditional_author_id INTEGER REFERENCES authors(id),
    traditional_author_name TEXT,

    -- Model predictions (top 5)
    predicted_authors JSONB,  -- [{{"author_id": 1, "author": "Homer", "confidence": 0.85, "ci_lower": 0.72, "ci_upper": 0.93}}]

    -- Methods used
    methods_used TEXT[],
    ensemble_agreement FLOAT,

    -- Segment-level analysis
    heterogeneity_score FLOAT,  -- High = multiple authors likely
    n_detected_segments INTEGER,

    -- Scholarly consensus
    scholarly_consensus TEXT,
    model_agrees_with_consensus BOOLEAN,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
"""

# ═══════════════════════════════════════════════════════════════════════════════
# HYPOTHESIS FACTORY TABLES
# ═══════════════════════════════════════════════════════════════════════════════

HYPOTHESIS_TABLES = f"""
-- ═══════════════════════════════════════════════════════════════════════════════
-- HYPOTHESES TABLE (Auto-generated and user-submitted)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS hypotheses (
    id SERIAL PRIMARY KEY,
    hypothesis_id UUID NOT NULL UNIQUE,

    -- Content
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,  -- From HYPOTHESIS_CATEGORIES

    -- Source
    source TEXT DEFAULT 'system',  -- 'system', 'user', 'literature'
    generated_by TEXT,  -- Engine name or user ID

    -- Scores (0-1)
    novelty_score FLOAT,
    evidence_score FLOAT,
    confound_resistance_score FLOAT,
    composite_score FLOAT,

    -- Confidence intervals
    evidence_ci_lower FLOAT,
    evidence_ci_upper FLOAT,

    -- Supporting evidence
    supporting_passages JSONB,  -- [{{"passage_id": 1, "relevance": 0.9}}]
    supporting_metrics JSONB,

    -- Falsification
    falsification_criteria JSONB,
    falsified BOOLEAN DEFAULT FALSE,
    falsification_evidence JSONB,

    -- Status
    status TEXT DEFAULT 'pending',  -- 'pending', 'validated', 'rejected', 'falsified'
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hypotheses_category ON hypotheses(category);
CREATE INDEX IF NOT EXISTS idx_hypotheses_status ON hypotheses(status);
CREATE INDEX IF NOT EXISTS idx_hypotheses_composite ON hypotheses(composite_score DESC);

-- ═══════════════════════════════════════════════════════════════════════════════
-- HYPOTHESIS TESTS (Validation and falsification attempts)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS hypothesis_tests (
    id SERIAL PRIMARY KEY,
    hypothesis_id UUID REFERENCES hypotheses(hypothesis_id) ON DELETE CASCADE,

    -- Test type
    test_type TEXT NOT NULL,  -- 'validation', 'falsification', 'confound'
    test_name TEXT NOT NULL,

    -- Results
    passed BOOLEAN,
    p_value FLOAT,
    effect_size FLOAT,

    -- Bootstrap results
    bootstrap_mean FLOAT,
    bootstrap_std FLOAT,
    bootstrap_n INTEGER,

    -- Details
    test_details JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hypothesis_tests_hypothesis ON hypothesis_tests(hypothesis_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ANOMALIES TABLE (Detected outliers and unusual patterns)
-- Fixed: Anomaly must beat negative controls
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS anomalies (
    id SERIAL PRIMARY KEY,
    anomaly_id UUID NOT NULL UNIQUE,

    -- Location
    passage_id INTEGER REFERENCES passages(id),
    work_id INTEGER REFERENCES works(id),
    author_id INTEGER REFERENCES authors(id),

    -- Type and severity
    anomaly_type TEXT NOT NULL,
    severity FLOAT,  -- 0-1, higher = more anomalous

    -- Detection method
    detection_method TEXT,
    detection_score FLOAT,

    -- Negative control validation (REQUIRED)
    beats_shuffle_baseline BOOLEAN,
    beats_impostor_baseline BOOLEAN,
    negative_control_margin FLOAT,  -- How much better than controls

    -- Context
    context_before TEXT,
    context_after TEXT,

    -- Status
    confirmed BOOLEAN,
    explanation TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anomalies_work ON anomalies(work_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_type ON anomalies(anomaly_type);
CREATE INDEX IF NOT EXISTS idx_anomalies_severity ON anomalies(severity DESC);
"""

# ═══════════════════════════════════════════════════════════════════════════════
# LATENT FACTORS AND REGIME SHIFTS
# ═══════════════════════════════════════════════════════════════════════════════

LATENT_FACTOR_TABLES = f"""
-- ═══════════════════════════════════════════════════════════════════════════════
-- LATENT AXES TABLE (Political, economic, institutional dimensions)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS latent_axes (
    id SERIAL PRIMARY KEY,
    axis_name TEXT NOT NULL UNIQUE,
    description TEXT,

    -- Axis definition
    positive_pole TEXT,
    negative_pole TEXT,

    -- Marker terms
    positive_markers TEXT[],
    negative_markers TEXT[],

    -- Computed axis vector
    axis_vector VECTOR({EMBED_DIM}),

    -- Validation
    discriminative_power FLOAT,  -- F-ratio
    stability_score FLOAT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- LATENT FACTOR SCORES (Per-passage projection onto axes)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS latent_factor_scores (
    id SERIAL PRIMARY KEY,
    passage_id INTEGER REFERENCES passages(id) ON DELETE CASCADE,
    work_id INTEGER REFERENCES works(id),
    author_id INTEGER REFERENCES authors(id),

    -- Scores per axis (stored as JSONB for flexibility)
    axis_scores JSONB,  -- {{"political": 0.7, "economic": -0.3}}

    -- Date estimate for time series
    estimated_date INTEGER,

    -- Uncertainty
    score_uncertainties JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_latent_factor_scores_passage ON latent_factor_scores(passage_id);
CREATE INDEX IF NOT EXISTS idx_latent_factor_scores_date ON latent_factor_scores(estimated_date);

-- ═══════════════════════════════════════════════════════════════════════════════
-- REGIME SHIFTS TABLE (Detected changepoints in latent factors)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS regime_shifts (
    id SERIAL PRIMARY KEY,
    axis_id INTEGER REFERENCES latent_axes(id) ON DELETE CASCADE,

    -- Changepoint location
    changepoint_date INTEGER NOT NULL,
    changepoint_type TEXT,  -- 'level_shift', 'trend_change', 'variance_change'

    -- Detection
    detection_method TEXT DEFAULT 'pelt',  -- 'pelt', 'binseg', 'bayesian'
    detection_score FLOAT,

    -- Magnitude
    pre_mean FLOAT,
    post_mean FLOAT,
    magnitude FLOAT,

    -- Uncertainty
    date_ci_lower INTEGER,
    date_ci_upper INTEGER,
    magnitude_ci_lower FLOAT,
    magnitude_ci_upper FLOAT,

    -- Historical context
    known_event TEXT,
    event_correlation FLOAT,

    -- Validation
    validated BOOLEAN,
    validation_method TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_regime_shifts_date ON regime_shifts(changepoint_date);
CREATE INDEX IF NOT EXISTS idx_regime_shifts_axis ON regime_shifts(axis_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- CONCEPT TRAJECTORIES (How concepts evolve over time)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS concept_trajectories (
    id SERIAL PRIMARY KEY,
    concept_term TEXT NOT NULL,
    language TEXT DEFAULT 'greek',

    -- Time series data
    time_points INTEGER[],  -- Years
    embeddings_over_time JSONB,  -- Serialized embeddings at each time point

    -- Drift metrics
    total_drift FLOAT,
    drift_rate FLOAT,  -- Drift per century

    -- Detected shifts
    semantic_shifts JSONB,  -- [{{"year": -400, "magnitude": 0.3, "type": "expansion"}}]

    -- Related concepts
    nearest_neighbors_over_time JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_concept_trajectories_term ON concept_trajectories(concept_term);
"""

# ═══════════════════════════════════════════════════════════════════════════════
# Q RECONSTRUCTION TABLES
# ═══════════════════════════════════════════════════════════════════════════════

Q_RECONSTRUCTION_TABLES = f"""
-- ═══════════════════════════════════════════════════════════════════════════════
-- SYNOPTIC ALIGNMENTS (Matthew-Mark-Luke parallel passages)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS synoptic_alignments (
    id SERIAL PRIMARY KEY,
    alignment_group TEXT NOT NULL,  -- Group identifier

    -- Passage references
    matthew_ref TEXT,
    mark_ref TEXT,
    luke_ref TEXT,

    -- Passage IDs
    matthew_passage_id INTEGER REFERENCES passages(id),
    mark_passage_id INTEGER REFERENCES passages(id),
    luke_passage_id INTEGER REFERENCES passages(id),

    -- Text content
    matthew_text TEXT,
    mark_text TEXT,
    luke_text TEXT,

    -- Alignment type
    tradition_type TEXT,  -- 'triple', 'double_mt_lk', 'double_mt_mk', 'double_mk_lk', 'sondergut'

    -- Semantic similarity matrix
    mt_mk_similarity FLOAT,
    mt_lk_similarity FLOAT,
    mk_lk_similarity FLOAT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_synoptic_alignments_group ON synoptic_alignments(alignment_group);
CREATE INDEX IF NOT EXISTS idx_synoptic_alignments_type ON synoptic_alignments(tradition_type);

-- ═══════════════════════════════════════════════════════════════════════════════
-- REDACTION SIGNATURES (Learned editorial patterns)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS redaction_signatures (
    id SERIAL PRIMARY KEY,
    evangelist TEXT NOT NULL,  -- 'matthew' or 'luke'

    -- Pattern type
    pattern_type TEXT NOT NULL,  -- 'addition', 'omission', 'modification', 'reordering'
    pattern_name TEXT,

    -- Pattern vector
    pattern_embedding VECTOR({EMBED_DIM}),

    -- Statistics
    frequency INTEGER,
    avg_magnitude FLOAT,

    -- Examples
    example_passages JSONB,

    -- Doctrinal associations
    doctrinal_axis TEXT,
    doctrinal_direction TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_redaction_signatures_evangelist ON redaction_signatures(evangelist);
CREATE INDEX IF NOT EXISTS idx_redaction_signatures_type ON redaction_signatures(pattern_type);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Q RECONSTRUCTIONS (Inferred Q source passages)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS q_reconstructions (
    id SERIAL PRIMARY KEY,
    alignment_id INTEGER REFERENCES synoptic_alignments(id),

    -- Q reference
    q_reference TEXT,  -- e.g., "Q 3:7-9"

    -- Reconstructed text (inferred)
    reconstructed_text TEXT,

    -- Reconstruction method
    method TEXT DEFAULT 'redaction_inversion',

    -- Confidence
    confidence_score FLOAT,
    confidence_lower FLOAT,
    confidence_upper FLOAT,

    -- Doctrinal profile
    doctrinal_scores JSONB,  -- Per-axis scores

    -- Scholarly comparison
    critical_edition_text TEXT,
    agreement_with_critical FLOAT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Q DOCTRINAL ANALYSIS
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS q_doctrinal_analysis (
    id SERIAL PRIMARY KEY,
    q_reconstruction_id INTEGER REFERENCES q_reconstructions(id) ON DELETE CASCADE,

    -- Per-axis analysis
    axis_name TEXT NOT NULL,
    score FLOAT,
    confidence_lower FLOAT,
    confidence_upper FLOAT,

    -- Evidence
    marker_occurrences JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
"""

# ═══════════════════════════════════════════════════════════════════════════════
# INTERTEXTUALITY TABLES
# ═══════════════════════════════════════════════════════════════════════════════

INTERTEXTUALITY_TABLES = f"""
-- ═══════════════════════════════════════════════════════════════════════════════
-- INTERTEXTUAL LINKS (Detected allusions and citations)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS intertextual_links (
    id SERIAL PRIMARY KEY,

    -- Source and target passages
    source_passage_id INTEGER REFERENCES passages(id),
    target_passage_id INTEGER REFERENCES passages(id),

    -- Work/author level references
    source_work_id INTEGER REFERENCES works(id),
    target_work_id INTEGER REFERENCES works(id),
    source_author_id INTEGER REFERENCES authors(id),
    target_author_id INTEGER REFERENCES authors(id),

    -- Link type
    link_type TEXT,  -- 'quotation', 'allusion', 'echo', 'parallel', 'contrast'

    -- Scores
    semantic_similarity FLOAT,
    lexical_overlap FLOAT,
    structural_similarity FLOAT,
    composite_score FLOAT,

    -- Direction
    direction TEXT,  -- 'forward', 'backward', 'bidirectional'
    confidence FLOAT,

    -- Temporal
    temporal_distance INTEGER,  -- Years

    -- Validation
    scholarly_confirmed BOOLEAN,
    source_citation TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intertextual_source ON intertextual_links(source_passage_id);
CREATE INDEX IF NOT EXISTS idx_intertextual_target ON intertextual_links(target_passage_id);
CREATE INDEX IF NOT EXISTS idx_intertextual_score ON intertextual_links(composite_score DESC);

-- ═══════════════════════════════════════════════════════════════════════════════
-- INFLUENCE NETWORKS (Author-to-author influence)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS influence_networks (
    id SERIAL PRIMARY KEY,

    source_author_id INTEGER REFERENCES authors(id),
    target_author_id INTEGER REFERENCES authors(id),

    -- Influence strength
    influence_score FLOAT,
    n_connections INTEGER,

    -- Type breakdown
    quotation_count INTEGER,
    allusion_count INTEGER,
    stylistic_similarity FLOAT,

    -- Temporal
    chronologically_valid BOOLEAN,  -- Source before target

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(source_author_id, target_author_id)
);

CREATE INDEX IF NOT EXISTS idx_influence_source ON influence_networks(source_author_id);
CREATE INDEX IF NOT EXISTS idx_influence_target ON influence_networks(target_author_id);
"""

# ═══════════════════════════════════════════════════════════════════════════════
# TRANSLATOR PERSONAS TABLES
# ═══════════════════════════════════════════════════════════════════════════════

PERSONA_TABLES = f"""
-- ═══════════════════════════════════════════════════════════════════════════════
-- TRANSLATORS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS translators (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,

    -- Biographical
    birth_year INTEGER,
    death_year INTEGER,
    nationality TEXT,
    era TEXT,

    -- Translation approach
    philosophy TEXT,
    philosophy_description TEXT,

    -- Specializations
    specializations TEXT[],
    languages TEXT[],

    -- Notable works
    notable_translations JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(name)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TRANSLATOR PROFILES (Extended style information)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS translator_profiles (
    id SERIAL PRIMARY KEY,
    translator_id INTEGER REFERENCES translators(id) ON DELETE CASCADE,

    -- Style vector (interpretable features)
    style_vector VECTOR({STYLE_DIM}),

    -- Detailed style breakdown
    style_scores JSONB,  -- Per-dimension scores

    -- Representative samples
    sample_translations JSONB,

    -- Comparison stats
    avg_ltqi FLOAT,
    n_translations INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(translator_id)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- EDITORIAL PERSONAS (Synthetic personas for style exploration)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS editorial_personas (
    id SERIAL PRIMARY KEY,
    persona_id UUID NOT NULL UNIQUE,
    name TEXT NOT NULL,

    -- Base translator (if derived from real translator)
    base_translator_id INTEGER REFERENCES translators(id),

    -- Style definition
    style_vector VECTOR({STYLE_DIM}),
    style_description TEXT,

    -- Modification from base
    style_delta JSONB,  -- Which dimensions were modified

    -- Usage
    is_public BOOLEAN DEFAULT FALSE,
    created_by TEXT,

    -- Validation
    ltqi_estimate FLOAT,
    coherence_score FLOAT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- STYLE INTERPOLATIONS (Blended styles)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS style_interpolations (
    id SERIAL PRIMARY KEY,

    -- Source translators
    translator_a_id INTEGER REFERENCES translators(id),
    translator_b_id INTEGER REFERENCES translators(id),

    -- Interpolation weight
    alpha FLOAT,  -- 0 = all A, 1 = all B

    -- Resulting style
    interpolated_style VECTOR({STYLE_DIM}),

    -- Quality prediction
    predicted_ltqi FLOAT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
"""

# ═══════════════════════════════════════════════════════════════════════════════
# DISCOVERY AND ANALYSIS TABLES
# ═══════════════════════════════════════════════════════════════════════════════

DISCOVERY_TABLES = f"""
-- ═══════════════════════════════════════════════════════════════════════════════
-- DISCOVERY RUNS (Track discovery program executions)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS discovery_runs (
    id SERIAL PRIMARY KEY,
    run_id UUID NOT NULL UNIQUE,

    -- Program
    program_name TEXT NOT NULL,  -- 'interpolation', 'Q_reconstruction', etc.

    -- Parameters
    parameters JSONB,

    -- Status
    status TEXT DEFAULT 'running',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    -- Results summary
    hypotheses_generated INTEGER,
    validated_hypotheses INTEGER,

    -- Error handling
    error_message TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- STABILITY TESTS (Bootstrap and cross-validation results)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS stability_tests (
    id SERIAL PRIMARY KEY,

    -- What was tested
    test_subject_type TEXT,  -- 'hypothesis', 'authorship', 'metric'
    test_subject_id TEXT,

    -- Test type
    test_type TEXT,  -- 'bootstrap', 'cv', 'window_size', 'negative_control'

    -- Results
    n_iterations INTEGER,
    mean_value FLOAT,
    std_value FLOAT,
    ci_lower FLOAT,
    ci_upper FLOAT,

    -- Stability assessment
    is_stable BOOLEAN,
    stability_score FLOAT,

    -- Full distribution (optional)
    distribution FLOAT[],

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stability_subject ON stability_tests(test_subject_type, test_subject_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- NEGATIVE CONTROL RESULTS
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS negative_control_results (
    id SERIAL PRIMARY KEY,

    -- What was tested
    test_subject_type TEXT,
    test_subject_id TEXT,

    -- Control type
    control_type TEXT,  -- From NEGATIVE_CONTROLS

    -- Results
    original_score FLOAT,
    control_score FLOAT,
    margin FLOAT,  -- original - control

    -- Pass/fail
    passed BOOLEAN,  -- original significantly better than control
    p_value FLOAT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- SEARCH LOGS (Track user queries for analysis)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS search_logs (
    id SERIAL PRIMARY KEY,

    -- Query
    query_text TEXT,
    query_type TEXT,  -- 'semantic', 'lexical', 'hybrid'

    -- Results
    n_results INTEGER,
    top_result_id INTEGER,
    top_result_score FLOAT,

    -- Performance
    latency_ms INTEGER,

    -- User (anonymized)
    session_id TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_logs_created ON search_logs(created_at);

-- ═══════════════════════════════════════════════════════════════════════════════
-- METRICS CACHE (Pre-computed expensive metrics)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS metrics_cache (
    id SERIAL PRIMARY KEY,

    -- Cache key
    metric_name TEXT NOT NULL,
    entity_type TEXT NOT NULL,  -- 'passage', 'work', 'author', 'translator'
    entity_id INTEGER NOT NULL,

    -- Cached value
    metric_value FLOAT,
    metric_json JSONB,

    -- Validity
    computed_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_valid BOOLEAN DEFAULT TRUE,

    UNIQUE(metric_name, entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_metrics_cache_lookup ON metrics_cache(metric_name, entity_type, entity_id);
"""

# ═══════════════════════════════════════════════════════════════════════════════
# GHOST/LOST WORKS TABLES
# ═══════════════════════════════════════════════════════════════════════════════

GHOST_TABLES = f"""
-- ═══════════════════════════════════════════════════════════════════════════════
-- LOST WORKS TABLE
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS lost_works (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author_id INTEGER REFERENCES authors(id),
    author_name TEXT,

    -- Dating
    date_composed_start INTEGER,
    date_composed_end INTEGER,

    -- Genre and type
    genre TEXT,
    work_type TEXT,

    -- Evidence
    fragment_count INTEGER,
    citation_count INTEGER,

    -- Reconstruction
    reconstruction_confidence FLOAT,
    has_ai_reconstruction BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- FRAGMENTS TABLE (Preserved fragments of lost works)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS fragments (
    id SERIAL PRIMARY KEY,
    lost_work_id INTEGER REFERENCES lost_works(id) ON DELETE CASCADE,

    -- Content
    fragment_number TEXT,
    text_content TEXT,

    -- Source of fragment
    citing_author_id INTEGER REFERENCES authors(id),
    citing_work_id INTEGER REFERENCES works(id),
    citing_reference TEXT,

    -- Embedding
    embedding VECTOR({EMBED_DIM}),

    -- Confidence
    authenticity_confidence FLOAT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fragments_lost_work ON fragments(lost_work_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- AI RECONSTRUCTIONS (LLM-generated reconstructions)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS ai_reconstructions (
    id SERIAL PRIMARY KEY,
    lost_work_id INTEGER REFERENCES lost_works(id) ON DELETE CASCADE,

    -- Reconstruction
    reconstructed_text TEXT,
    section_label TEXT,

    -- Method
    model_used TEXT,
    prompt_strategy TEXT,

    -- Quality
    coherence_score FLOAT,
    style_match_score FLOAT,

    -- Embedding
    embedding VECTOR({EMBED_DIM}),

    created_at TIMESTAMPTZ DEFAULT NOW()
);
"""

# ═══════════════════════════════════════════════════════════════════════════════
# ADDITIONAL TABLES FOR NEW ROUTERS
# ═══════════════════════════════════════════════════════════════════════════════

ADDITIONAL_TABLES = f"""
-- ═══════════════════════════════════════════════════════════════════════════════
-- CALIBRATION EVALUATIONS (For uncertainty quantification)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS calibration_evaluations (
    id SERIAL PRIMARY KEY,
    analysis_type TEXT NOT NULL,  -- 'authorship', 'dating', 'style', 'hypothesis'
    entity_id TEXT,
    predicted_confidence FLOAT NOT NULL,
    actual_correct BOOLEAN NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calib_eval_type ON calibration_evaluations(analysis_type);
CREATE INDEX IF NOT EXISTS idx_calib_eval_confidence ON calibration_evaluations(predicted_confidence);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PERSONA ATTRIBUTIONS (Link passages to editorial personas)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS persona_attributions (
    id SERIAL PRIMARY KEY,
    persona_id INTEGER NOT NULL,
    passage_id INTEGER NOT NULL,
    confidence FLOAT NOT NULL,
    attribution_method TEXT,  -- 'embedding', 'function_word', 'combined'
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(persona_id, passage_id)
);

CREATE INDEX IF NOT EXISTS idx_persona_attr_persona ON persona_attributions(persona_id);
CREATE INDEX IF NOT EXISTS idx_persona_attr_passage ON persona_attributions(passage_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- MANUSCRIPTS (Manuscript tradition)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS manuscripts (
    id SERIAL PRIMARY KEY,
    work_id INTEGER,
    siglum TEXT NOT NULL,
    name TEXT,
    date_earliest INTEGER,
    date_latest INTEGER,
    provenance TEXT,
    text_type TEXT,  -- 'alexandrian', 'western', 'byzantine', etc.
    quality_rating FLOAT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_manuscripts_work ON manuscripts(work_id);
CREATE INDEX IF NOT EXISTS idx_manuscripts_siglum ON manuscripts(siglum);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TEXTUAL VARIANTS (Manuscript variants)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS textual_variants (
    id SERIAL PRIMARY KEY,
    work_id INTEGER,
    location TEXT NOT NULL,  -- e.g., "John 1:18"
    reading_a TEXT,
    reading_b TEXT,
    manuscripts_a TEXT[],  -- Array of sigla supporting reading A
    manuscripts_b TEXT[],  -- Array of sigla supporting reading B
    significance TEXT,  -- 'major', 'minor', 'orthographic'
    doctrinal_impact BOOLEAN DEFAULT FALSE,
    preferred_reading TEXT,  -- 'a', 'b', or NULL
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variants_work ON textual_variants(work_id);
CREATE INDEX IF NOT EXISTS idx_variants_location ON textual_variants(location);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PERICOPES (Gospel passages/units)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS pericopes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    tradition_type TEXT,  -- 'triple', 'double_mt_lk', 'sondergut', etc.
    q_reference TEXT,  -- e.g., "Q 3:7-9"

    -- References in each gospel
    matthew_ref TEXT,
    mark_ref TEXT,
    luke_ref TEXT,
    john_ref TEXT,

    -- Text content
    matthew_text TEXT,
    mark_text TEXT,
    luke_text TEXT,
    john_text TEXT,

    -- Metadata
    category TEXT,  -- 'discourse', 'narrative', 'parable', etc.
    themes TEXT[],

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pericopes_tradition ON pericopes(tradition_type);
CREATE INDEX IF NOT EXISTS idx_pericopes_q_ref ON pericopes(q_reference);

-- ═══════════════════════════════════════════════════════════════════════════════
-- SYNOPTIC PARALLELS (Cross-gospel parallels)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS synoptic_parallels (
    id SERIAL PRIMARY KEY,
    pericope_id INTEGER REFERENCES pericopes(id) ON DELETE CASCADE,
    parallel_group TEXT NOT NULL,
    gospel TEXT NOT NULL,  -- 'matthew', 'mark', 'luke'
    reference TEXT NOT NULL,
    verse_start INTEGER,
    verse_end INTEGER,
    text_content TEXT,
    word_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_synoptic_pericope ON synoptic_parallels(pericope_id);
CREATE INDEX IF NOT EXISTS idx_synoptic_group ON synoptic_parallels(parallel_group);

-- ═══════════════════════════════════════════════════════════════════════════════
-- SAYING CLUSTERS (Thomas parallels)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS saying_clusters (
    id SERIAL PRIMARY KEY,
    cluster_name TEXT NOT NULL,
    synoptic_ref TEXT,  -- Canonical gospel reference
    thomas_logion INTEGER,  -- Gospel of Thomas saying number
    q_reference TEXT,
    synoptic_text TEXT,
    thomas_text TEXT,
    similarity_score FLOAT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saying_thomas ON saying_clusters(thomas_logion);

-- ═══════════════════════════════════════════════════════════════════════════════
-- DOCTRINAL AXES (Semantic poles for theological analysis)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS doctrinal_axes (
    id SERIAL PRIMARY KEY,
    axis_name TEXT NOT NULL UNIQUE,
    language TEXT DEFAULT 'greek',
    positive_pole TEXT NOT NULL,
    negative_pole TEXT NOT NULL,
    positive_seed_terms TEXT[],
    negative_seed_terms TEXT[],

    -- Axis embedding (direction vector)
    axis_vector VECTOR({EMBED_DIM}),

    -- Validation
    discriminative_power FLOAT,
    example_passages_positive TEXT[],
    example_passages_negative TEXT[],

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctrinal_axis_name ON doctrinal_axes(axis_name);

-- ═══════════════════════════════════════════════════════════════════════════════
-- PASSAGE DOCTRINAL SCORES (Score passages on doctrinal axes)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS passage_doctrinal_scores (
    id SERIAL PRIMARY KEY,
    passage_id INTEGER NOT NULL,
    axis_id INTEGER REFERENCES doctrinal_axes(id) ON DELETE CASCADE,
    score FLOAT NOT NULL,  -- -1 to +1
    confidence FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(passage_id, axis_id)
);

CREATE INDEX IF NOT EXISTS idx_doctrinal_scores_passage ON passage_doctrinal_scores(passage_id);
CREATE INDEX IF NOT EXISTS idx_doctrinal_scores_axis ON passage_doctrinal_scores(axis_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- EXTENDED EDITORIAL PERSONAS (Additional columns for new router)
-- ═══════════════════════════════════════════════════════════════════════════════
-- Add columns to editorial_personas if they don't exist
DO $$
BEGIN
    -- Add source_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'editorial_personas' AND column_name = 'source_type') THEN
        ALTER TABLE editorial_personas ADD COLUMN source_type TEXT DEFAULT 'translator';
    END IF;

    -- Add description column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'editorial_personas' AND column_name = 'description') THEN
        ALTER TABLE editorial_personas ADD COLUMN description TEXT;
    END IF;

    -- Add n_attributed_passages column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'editorial_personas' AND column_name = 'n_attributed_passages') THEN
        ALTER TABLE editorial_personas ADD COLUMN n_attributed_passages INTEGER DEFAULT 0;
    END IF;

    -- Add signature_strength column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'editorial_personas' AND column_name = 'signature_strength') THEN
        ALTER TABLE editorial_personas ADD COLUMN signature_strength FLOAT;
    END IF;

    -- Add doctrinal_profile column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'editorial_personas' AND column_name = 'doctrinal_profile') THEN
        ALTER TABLE editorial_personas ADD COLUMN doctrinal_profile JSONB;
    END IF;

    -- Add function_word_freqs column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'editorial_personas' AND column_name = 'function_word_freqs') THEN
        ALTER TABLE editorial_personas ADD COLUMN function_word_freqs JSONB;
    END IF;

    -- Add style_centroid column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'editorial_personas' AND column_name = 'style_centroid') THEN
        ALTER TABLE editorial_personas ADD COLUMN style_centroid FLOAT[];
    END IF;

    -- Add lexical_preferences column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'editorial_personas' AND column_name = 'lexical_preferences') THEN
        ALTER TABLE editorial_personas ADD COLUMN lexical_preferences JSONB;
    END IF;

    -- Add transformation_patterns column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'editorial_personas' AND column_name = 'transformation_patterns') THEN
        ALTER TABLE editorial_personas ADD COLUMN transformation_patterns JSONB;
    END IF;
END $$;
"""

# ═══════════════════════════════════════════════════════════════════════════════
# COMBINE ALL SQL
# ═══════════════════════════════════════════════════════════════════════════════

ALL_TABLES_SQL = [
    ("Extensions", INIT_EXTENSIONS),
    ("Core Tables", CORE_TABLES),
    ("Style Tables", STYLE_TABLES),
    ("Calibration Tables", CALIBRATION_TABLES),
    ("Authorship Tables", AUTHORSHIP_TABLES),
    ("Hypothesis Tables", HYPOTHESIS_TABLES),
    ("Latent Factor Tables", LATENT_FACTOR_TABLES),
    ("Q Reconstruction Tables", Q_RECONSTRUCTION_TABLES),
    ("Intertextuality Tables", INTERTEXTUALITY_TABLES),
    ("Persona Tables", PERSONA_TABLES),
    ("Discovery Tables", DISCOVERY_TABLES),
    ("Ghost Tables", GHOST_TABLES),
    ("Additional Tables", ADDITIONAL_TABLES),
]


async def create_all_tables(pool: asyncpg.Pool) -> dict:
    """
    Create all database tables.
    Returns status dict with success/failure per section.
    """
    results = {}

    async with pool.acquire() as conn:
        for section_name, sql in ALL_TABLES_SQL:
            try:
                await conn.execute(sql)
                results[section_name] = {"status": "success"}
            except Exception as e:
                results[section_name] = {"status": "error", "error": str(e)}

    return results


async def verify_schema(pool: asyncpg.Pool) -> dict:
    """
    Verify all tables exist and have correct structure.
    """
    expected_tables = [
        "authors", "works", "source_texts", "passages", "translations",
        "meaning_anchors", "style_residuals", "translator_centroids",
        "calibration_runs", "calibration_gate1", "calibration_gate2",
        "calibration_gate3", "calibration_gate4", "calibration_history",
        "authorship_fingerprints", "authorship_segments", "authorship_comparisons",
        "disputed_work_analyses", "hypotheses", "hypothesis_tests", "anomalies",
        "latent_axes", "latent_factor_scores", "regime_shifts", "concept_trajectories",
        "synoptic_alignments", "redaction_signatures", "q_reconstructions",
        "q_doctrinal_analysis", "intertextual_links", "influence_networks",
        "translators", "translator_profiles", "editorial_personas", "style_interpolations",
        "discovery_runs", "stability_tests", "negative_control_results",
        "search_logs", "metrics_cache", "lost_works", "fragments", "ai_reconstructions",
        # New tables for extended routers
        "calibration_evaluations", "persona_attributions", "manuscripts",
        "textual_variants", "pericopes", "synoptic_parallels", "saying_clusters",
        "doctrinal_axes", "passage_doctrinal_scores"
    ]

    async with pool.acquire() as conn:
        existing = await conn.fetch("""
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'public'
        """)
        existing_names = {row['table_name'] for row in existing}

    missing = [t for t in expected_tables if t not in existing_names]
    extra = [t for t in existing_names if t not in expected_tables and not t.startswith('pg_')]

    return {
        "expected_count": len(expected_tables),
        "existing_count": len(existing_names),
        "missing_tables": missing,
        "extra_tables": extra,
        "all_present": len(missing) == 0
    }


# ═══════════════════════════════════════════════════════════════════════════════
# MIGRATION HELPERS
# ═══════════════════════════════════════════════════════════════════════════════

async def migrate_embeddings_to_pgvector(pool: asyncpg.Pool) -> dict:
    """
    Migrate any existing FLOAT[] embedding columns to VECTOR type.
    This is a data migration for existing tables.
    """
    migrations = []

    # Tables and their embedding columns that might need migration
    embedding_columns = [
        ("passages", "embedding", EMBED_DIM),
        ("passages", "style_vector", STYLE_DIM),
        ("translations", "embedding", EMBED_DIM),
        ("translations", "style_vector", STYLE_DIM),
        ("translations", "style_residual", EMBED_DIM),
        ("meaning_anchors", "anchor_embedding", EMBED_DIM),
        ("style_residuals", "residual_vector", EMBED_DIM),
        ("translator_centroids", "centroid_embedding", EMBED_DIM),
        ("translator_centroids", "style_profile", STYLE_DIM),
    ]

    async with pool.acquire() as conn:
        for table, column, dim in embedding_columns:
            try:
                # Check if column exists and its type
                col_info = await conn.fetchrow(f"""
                    SELECT data_type, udt_name
                    FROM information_schema.columns
                    WHERE table_name = $1 AND column_name = $2
                """, table, column)

                if col_info and col_info['udt_name'] != 'vector':
                    # Need to migrate
                    await conn.execute(f"""
                        ALTER TABLE {table}
                        ALTER COLUMN {column} TYPE VECTOR({dim})
                        USING {column}::VECTOR({dim})
                    """)
                    migrations.append(f"{table}.{column}")
            except Exception as e:
                migrations.append(f"{table}.{column}: ERROR - {str(e)}")

    return {"migrated_columns": migrations}
