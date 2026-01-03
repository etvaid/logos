-- ============================================================================
-- LOGOS Phase 1: Real Data Infrastructure
-- Run this migration to create tables for morphology, evidence, and search
-- ============================================================================

-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- Job 1.1: Token Annotations (Real Morphology)
-- ============================================================================

CREATE TABLE IF NOT EXISTS token_annotations (
  id SERIAL PRIMARY KEY,
  urn TEXT NOT NULL,
  token_index INTEGER NOT NULL,
  surface_form TEXT NOT NULL,
  lemma TEXT,
  pos TEXT,                           -- Part of speech (noun, verb, adj, etc.)
  morphology_code TEXT,               -- Full morphology code (e.g., "V3PAIA")
  case_value TEXT,                    -- nominative, genitive, etc.
  number_value TEXT,                  -- singular, plural, dual
  gender TEXT,                        -- masculine, feminine, neuter
  tense TEXT,                         -- present, aorist, perfect, etc.
  mood TEXT,                          -- indicative, subjunctive, optative, etc.
  voice TEXT,                         -- active, middle, passive
  person TEXT,                        -- 1st, 2nd, 3rd
  gloss TEXT,                         -- English translation/definition
  confidence FLOAT DEFAULT 1.0,
  source TEXT DEFAULT 'manual',       -- perseus, morpheus, manual, ml
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT token_annotations_unique UNIQUE (urn, token_index)
);

CREATE INDEX IF NOT EXISTS idx_token_annotations_urn ON token_annotations(urn);
CREATE INDEX IF NOT EXISTS idx_token_annotations_lemma ON token_annotations(lemma);
CREATE INDEX IF NOT EXISTS idx_token_annotations_pos ON token_annotations(pos);

-- ============================================================================
-- Job 1.2: Embeddings with HNSW Index (Real Vector Search)
-- ============================================================================

-- Ensure embeddings table has proper vector column
-- ALTER TABLE embeddings ADD COLUMN IF NOT EXISTS vector vector(768);

-- Create HNSW index for fast similarity search
-- Note: Run this after embeddings table exists
-- CREATE INDEX IF NOT EXISTS embeddings_hnsw_idx ON embeddings
--   USING hnsw (vector vector_cosine_ops)
--   WITH (m = 16, ef_construction = 64);

-- ============================================================================
-- Job 1.3: Evidence Schema (Gates & Confidence)
-- ============================================================================

CREATE TABLE IF NOT EXISTS gate_results (
  id SERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,          -- 'q_pericope', 'intertext', 'translation', 'attribution'
  entity_id TEXT NOT NULL,

  -- Gate 1: Statistical significance
  gate_1_name TEXT DEFAULT 'statistical_significance',
  gate_1_passed BOOLEAN,
  gate_1_score FLOAT,
  gate_1_threshold FLOAT,
  gate_1_details JSONB,

  -- Gate 2: Random baseline comparison
  gate_2_name TEXT DEFAULT 'random_baseline',
  gate_2_passed BOOLEAN,
  gate_2_score FLOAT,
  gate_2_threshold FLOAT,
  gate_2_details JSONB,

  -- Gate 3: Permutation test
  gate_3_name TEXT DEFAULT 'permutation_test',
  gate_3_passed BOOLEAN,
  gate_3_score FLOAT,
  gate_3_threshold FLOAT,
  gate_3_details JSONB,

  -- Gate 4: Feature ablation
  gate_4_name TEXT DEFAULT 'feature_ablation',
  gate_4_passed BOOLEAN,
  gate_4_score FLOAT,
  gate_4_threshold FLOAT,
  gate_4_details JSONB,

  -- Gate 5: Cross-validation stability
  gate_5_name TEXT DEFAULT 'cross_validation',
  gate_5_passed BOOLEAN,
  gate_5_score FLOAT,
  gate_5_threshold FLOAT,
  gate_5_details JSONB,

  -- Summary
  gates_passed INTEGER GENERATED ALWAYS AS (
    (CASE WHEN gate_1_passed THEN 1 ELSE 0 END) +
    (CASE WHEN gate_2_passed THEN 1 ELSE 0 END) +
    (CASE WHEN gate_3_passed THEN 1 ELSE 0 END) +
    (CASE WHEN gate_4_passed THEN 1 ELSE 0 END) +
    (CASE WHEN gate_5_passed THEN 1 ELSE 0 END)
  ) STORED,

  metrics_json JSONB,                 -- Additional metrics
  computed_at TIMESTAMP DEFAULT NOW(),
  pipeline_version TEXT DEFAULT '1.0',

  CONSTRAINT gate_results_unique UNIQUE (entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_gate_results_entity ON gate_results(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_gate_results_passed ON gate_results(gates_passed);

-- Confidence scores (separate from gates for flexibility)
CREATE TABLE IF NOT EXISTS confidence_scores (
  id SERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,

  score FLOAT NOT NULL,               -- Overall confidence 0-1
  tier TEXT,                          -- 'high', 'medium', 'low', 'uncertain'

  -- Component breakdown
  components_json JSONB,              -- {"lexical": 0.7, "semantic": 0.85, ...}

  -- Provenance
  computed_at TIMESTAMP DEFAULT NOW(),
  pipeline_version TEXT DEFAULT '1.0',

  CONSTRAINT confidence_scores_unique UNIQUE (entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_confidence_scores_entity ON confidence_scores(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_confidence_scores_tier ON confidence_scores(tier);

-- ============================================================================
-- Job 1.4: Intertext Evidence Stack
-- ============================================================================

CREATE TABLE IF NOT EXISTS intertext_evidence (
  id SERIAL PRIMARY KEY,
  source_urn TEXT NOT NULL,
  target_urn TEXT NOT NULL,

  -- Confidence & type
  confidence_score FLOAT,
  connection_type TEXT,               -- 'quotation', 'allusion', 'parallel', 'thematic'
  directionality TEXT,                -- 'source_to_target', 'target_to_source', 'bidirectional', 'uncertain'

  -- Evidence components
  lexical_overlap FLOAT,              -- Content word overlap
  function_word_overlap FLOAT,        -- Function word pattern match
  rare_word_overlap FLOAT,            -- IDF-weighted rare term overlap
  semantic_similarity FLOAT,          -- Embedding cosine similarity
  ngram_overlap_2 FLOAT,              -- Bigram overlap
  ngram_overlap_3 FLOAT,              -- Trigram overlap
  ngram_overlap_4 FLOAT,              -- 4-gram overlap
  syntax_similarity FLOAT,            -- Syntactic structure similarity

  -- Matched content (the actual evidence)
  matched_phrases JSONB,              -- [{"source": "...", "target": "...", "type": "exact|near"}]
  shared_rare_words JSONB,            -- ["word1", "word2", ...]
  shared_ngrams JSONB,                -- ["phrase1", "phrase2", ...]

  -- Falsification notes
  alternative_explanations JSONB,     -- What could explain this besides direct connection?
  confidence_notes TEXT,              -- Human-readable confidence explanation

  -- Provenance
  computed_at TIMESTAMP DEFAULT NOW(),
  pipeline_version TEXT DEFAULT '1.0',

  CONSTRAINT intertext_evidence_unique UNIQUE (source_urn, target_urn)
);

CREATE INDEX IF NOT EXISTS idx_intertext_evidence_source ON intertext_evidence(source_urn);
CREATE INDEX IF NOT EXISTS idx_intertext_evidence_target ON intertext_evidence(target_urn);
CREATE INDEX IF NOT EXISTS idx_intertext_evidence_confidence ON intertext_evidence(confidence_score);
CREATE INDEX IF NOT EXISTS idx_intertext_evidence_type ON intertext_evidence(connection_type);

-- ============================================================================
-- Precomputed Passage Payloads (for speed)
-- ============================================================================

CREATE TABLE IF NOT EXISTS passage_payloads (
  id SERIAL PRIMARY KEY,
  urn TEXT UNIQUE NOT NULL,

  -- Precomputed JSON payload containing everything needed for the passage viewer
  payload JSONB NOT NULL,

  -- What's included
  includes_morphology BOOLEAN DEFAULT false,
  includes_translations BOOLEAN DEFAULT false,
  includes_intertexts BOOLEAN DEFAULT false,
  includes_drift BOOLEAN DEFAULT false,

  computed_at TIMESTAMP DEFAULT NOW(),
  pipeline_version TEXT DEFAULT '1.0'
);

CREATE INDEX IF NOT EXISTS idx_passage_payloads_urn ON passage_payloads(urn);

-- ============================================================================
-- Translation Quality Scores (for dashboard)
-- ============================================================================

CREATE TABLE IF NOT EXISTS translation_quality (
  id SERIAL PRIMARY KEY,
  translation_id INTEGER,             -- FK to translations table
  translator_name TEXT,
  source_urn TEXT,

  -- Overall score
  overall_score FLOAT,
  grade TEXT,                         -- A, B, C, D, F

  -- Component scores (0-1)
  semantic_fidelity FLOAT,
  style_consistency FLOAT,
  fluency FLOAT,
  cultural_accuracy FLOAT,
  register_match FLOAT,
  literalness FLOAT,
  readability FLOAT,

  -- Genre-conditioned scores
  genre TEXT,
  genre_baseline_deviation FLOAT,

  -- Detected issues
  issues_json JSONB,                  -- [{"type": "omission", "location": "...", "severity": "high"}]

  computed_at TIMESTAMP DEFAULT NOW(),
  pipeline_version TEXT DEFAULT '1.0'
);

CREATE INDEX IF NOT EXISTS idx_translation_quality_translator ON translation_quality(translator_name);
CREATE INDEX IF NOT EXISTS idx_translation_quality_grade ON translation_quality(grade);

-- ============================================================================
-- Q Pericope Evidence (for Q Explorer)
-- ============================================================================

CREATE TABLE IF NOT EXISTS q_pericope_evidence (
  id SERIAL PRIMARY KEY,
  pericope_id TEXT UNIQUE NOT NULL,

  -- Core Q confidence
  q_confidence FLOAT,
  q_tier TEXT,                        -- 'certain', 'probable', 'possible', 'uncertain'

  -- Evidence breakdown
  verbatim_agreement FLOAT,           -- Mt-Lk exact match rate
  order_agreement FLOAT,              -- Sequence agreement score
  mark_independence FLOAT,            -- Independence from Mark
  style_consistency FLOAT,            -- Internal Q style coherence

  -- Detailed evidence
  parallel_urns JSONB,                -- {"matthew": "urn:...", "luke": "urn:..."}
  shared_vocabulary JSONB,            -- Unique shared terms
  distinctive_features JSONB,         -- What makes this Q-like

  -- External validation (Thomas, Didache)
  thomas_parallels JSONB,             -- Related Thomas logia
  didache_parallels JSONB,            -- Related Didache sections
  external_confidence FLOAT,          -- External validation boost

  computed_at TIMESTAMP DEFAULT NOW(),
  pipeline_version TEXT DEFAULT '1.0'
);

CREATE INDEX IF NOT EXISTS idx_q_pericope_evidence_pericope ON q_pericope_evidence(pericope_id);
CREATE INDEX IF NOT EXISTS idx_q_pericope_evidence_tier ON q_pericope_evidence(q_tier);

-- ============================================================================
-- Helper function for tier calculation
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_confidence_tier(score FLOAT)
RETURNS TEXT AS $$
BEGIN
  IF score >= 0.85 THEN RETURN 'high';
  ELSIF score >= 0.65 THEN RETURN 'medium';
  ELSIF score >= 0.45 THEN RETURN 'low';
  ELSE RETURN 'uncertain';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
