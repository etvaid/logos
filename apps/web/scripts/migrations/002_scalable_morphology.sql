-- ============================================================================
-- LOGOS Phase 2: Scalable Morphology Storage
-- This normalizes morphology to handle 6M+ passages efficiently
-- ============================================================================

-- ============================================================================
-- A. Canonical Morphology Dictionary
-- Each unique (language, lemma, pos, features) gets ONE entry
-- Duplicates collapse -> storage grows sublinearly
-- ============================================================================

CREATE TABLE IF NOT EXISTS morph_entries (
  morph_id      BIGSERIAL PRIMARY KEY,
  language      TEXT NOT NULL CHECK (language IN ('grc', 'lat', 'heb', 'ara', 'cop')),
  lemma         TEXT NOT NULL,
  pos           TEXT NOT NULL,
  feats         JSONB NOT NULL DEFAULT '{}'::jsonb,
  gloss         TEXT,
  source        TEXT NOT NULL DEFAULT 'cltk',
  frequency     BIGINT NOT NULL DEFAULT 0,  -- corpus-wide frequency
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (language, lemma, pos, feats)
);

-- Index for fast lemma lookups
CREATE INDEX IF NOT EXISTS morph_entries_lemma_idx ON morph_entries(lemma);
CREATE INDEX IF NOT EXISTS morph_entries_language_idx ON morph_entries(language);
CREATE INDEX IF NOT EXISTS morph_entries_pos_idx ON morph_entries(pos);

-- ============================================================================
-- B. Compact Passage Tokenization
-- One row per passage with arrays - very fast reads
-- ============================================================================

CREATE TABLE IF NOT EXISTS passage_tokens (
  urn           TEXT PRIMARY KEY,
  language      TEXT NOT NULL CHECK (language IN ('grc', 'lat', 'heb', 'ara', 'cop', 'eng')),
  tokens        TEXT[] NOT NULL,           -- surface forms, length N
  morph_ids     BIGINT[] NOT NULL,         -- length N, references morph_entries
  char_starts   INT[] NOT NULL,            -- length N, character offsets
  char_ends     INT[] NOT NULL,            -- length N, character offsets
  token_count   INT GENERATED ALWAYS AS (array_length(tokens, 1)) STORED,
  analyzer_version TEXT NOT NULL DEFAULT 'v1',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS passage_tokens_language_idx ON passage_tokens(language);
CREATE INDEX IF NOT EXISTS passage_tokens_updated_idx ON passage_tokens(updated_at);

-- ============================================================================
-- C. Backfill Job Tracking (Resumable)
-- ============================================================================

CREATE TABLE IF NOT EXISTS backfill_jobs (
  job_id        BIGSERIAL PRIMARY KEY,
  job_type      TEXT NOT NULL,  -- 'greek_morph', 'latin_morph', 'intertext_candidates'
  status        TEXT NOT NULL CHECK (status IN ('queued', 'running', 'done', 'failed', 'paused')),
  language      TEXT,
  urn_start     TEXT,
  urn_end       TEXT,
  total_count   BIGINT NOT NULL DEFAULT 0,
  processed     BIGINT NOT NULL DEFAULT 0,
  errors        BIGINT NOT NULL DEFAULT 0,
  last_urn      TEXT,           -- for resumability
  batch_size    INT NOT NULL DEFAULT 500,
  started_at    TIMESTAMPTZ,
  finished_at   TIMESTAMPTZ,
  error_sample  JSONB,          -- sample of recent errors for debugging
  config        JSONB,          -- job-specific configuration
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS backfill_jobs_status_idx ON backfill_jobs(status);
CREATE INDEX IF NOT EXISTS backfill_jobs_type_idx ON backfill_jobs(job_type);

-- ============================================================================
-- D. Intertext Candidates (Cheap, Many)
-- Stage 1 of 2-stage retrieval: generate many candidates quickly
-- ============================================================================

CREATE TABLE IF NOT EXISTS intertext_candidates (
  source_urn   TEXT NOT NULL,
  target_urn   TEXT NOT NULL,
  method       TEXT NOT NULL,  -- 'vector', 'lexical', 'citation', 'ngram'
  score        REAL NOT NULL,
  rank         INT,            -- rank within method
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (source_urn, target_urn, method)
);

CREATE INDEX IF NOT EXISTS intertext_candidates_source_idx ON intertext_candidates(source_urn);
CREATE INDEX IF NOT EXISTS intertext_candidates_target_idx ON intertext_candidates(target_urn);
CREATE INDEX IF NOT EXISTS intertext_candidates_score_idx ON intertext_candidates(score DESC);
CREATE INDEX IF NOT EXISTS intertext_candidates_method_idx ON intertext_candidates(method);

-- ============================================================================
-- E. External Attestations (Ground Truth for Validation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS external_attestations (
  id           BIGSERIAL PRIMARY KEY,
  dataset      TEXT NOT NULL,   -- 'thomas', 'didache', 'iqp', etc.
  source_urn   TEXT NOT NULL,
  target_urn   TEXT NOT NULL,
  label        TEXT NOT NULL,   -- 'parallel', 'allusion', 'quotation', 'none'
  confidence   REAL,            -- scholar confidence if available
  notes        TEXT,
  source_ref   TEXT,            -- scholarly reference
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (dataset, source_urn, target_urn)
);

CREATE INDEX IF NOT EXISTS external_attestations_dataset_idx ON external_attestations(dataset);
CREATE INDEX IF NOT EXISTS external_attestations_source_idx ON external_attestations(source_urn);

-- ============================================================================
-- F. Update intertext_evidence with versioning
-- ============================================================================

ALTER TABLE intertext_evidence
  ADD COLUMN IF NOT EXISTS evidence_version TEXT NOT NULL DEFAULT 'v1',
  ADD COLUMN IF NOT EXISTS features JSONB NOT NULL DEFAULT '{}'::jsonb;

-- ============================================================================
-- G. Helper function for morph_entry upsert
-- ============================================================================

CREATE OR REPLACE FUNCTION upsert_morph_entry(
  p_language TEXT,
  p_lemma TEXT,
  p_pos TEXT,
  p_feats JSONB,
  p_gloss TEXT,
  p_source TEXT
) RETURNS BIGINT AS $$
DECLARE
  v_morph_id BIGINT;
BEGIN
  INSERT INTO morph_entries (language, lemma, pos, feats, gloss, source)
  VALUES (p_language, p_lemma, p_pos, COALESCE(p_feats, '{}'::jsonb), p_gloss, p_source)
  ON CONFLICT (language, lemma, pos, feats)
  DO UPDATE SET frequency = morph_entries.frequency + 1
  RETURNING morph_id INTO v_morph_id;

  RETURN v_morph_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- H. Materialized view for morph stats
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS morph_stats AS
SELECT
  language,
  pos,
  COUNT(*) as entry_count,
  SUM(frequency) as total_occurrences,
  COUNT(DISTINCT lemma) as unique_lemmas
FROM morph_entries
GROUP BY language, pos;

-- Refresh periodically: REFRESH MATERIALIZED VIEW morph_stats;
