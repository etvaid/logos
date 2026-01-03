-- ============================================================================
-- LOGOS Phase 4: Performance Indexes
-- Optimize hot query paths
-- ============================================================================

-- ============================================================================
-- A. Source Texts Indexes
-- ============================================================================

-- Fast lookup by URN
CREATE INDEX IF NOT EXISTS idx_source_texts_urn ON source_texts(urn);

-- Fast lookup by work
CREATE INDEX IF NOT EXISTS idx_source_texts_work ON source_texts(work);

-- Composite for work + language queries
CREATE INDEX IF NOT EXISTS idx_source_texts_work_lang ON source_texts(work, language);

-- ============================================================================
-- B. Passage Tokens Indexes
-- ============================================================================

-- Already has PRIMARY KEY on urn
CREATE INDEX IF NOT EXISTS idx_passage_tokens_lang ON passage_tokens(language);

-- ============================================================================
-- C. Morphology Indexes
-- ============================================================================

-- Fast lemma lookup across all entries
CREATE INDEX IF NOT EXISTS idx_morph_entries_lemma_trgm ON morph_entries USING gin (lemma gin_trgm_ops);

-- POS distribution queries
CREATE INDEX IF NOT EXISTS idx_morph_entries_lang_pos ON morph_entries(language, pos);

-- ============================================================================
-- D. Intertext Indexes
-- ============================================================================

-- Fast candidate lookup by source
CREATE INDEX IF NOT EXISTS idx_intertext_candidates_source ON intertext_candidates(source_urn);

-- Fast candidate lookup by target
CREATE INDEX IF NOT EXISTS idx_intertext_candidates_target ON intertext_candidates(target_urn);

-- High-score candidates first
CREATE INDEX IF NOT EXISTS idx_intertext_candidates_score ON intertext_candidates(score DESC);

-- Evidence lookup
CREATE INDEX IF NOT EXISTS idx_intertext_evidence_source ON intertext_evidence(source_urn);
CREATE INDEX IF NOT EXISTS idx_intertext_evidence_target ON intertext_evidence(target_urn);
CREATE INDEX IF NOT EXISTS idx_intertext_evidence_conf ON intertext_evidence(confidence_score DESC);

-- ============================================================================
-- E. Token Annotations Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_token_annotations_urn ON token_annotations(urn);
CREATE INDEX IF NOT EXISTS idx_token_annotations_lemma ON token_annotations(lemma);

-- ============================================================================
-- F. Entity Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_entity_mentions_urn ON entity_mentions(urn);
CREATE INDEX IF NOT EXISTS idx_named_entities_type ON named_entities(entity_type);

-- ============================================================================
-- G. Materialized Views for Hot Queries
-- ============================================================================

-- Works summary
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_works_summary AS
SELECT
  work,
  language,
  COUNT(*) as passage_count,
  MIN(section) as first_section,
  MAX(section) as last_section
FROM source_texts
WHERE work IS NOT NULL
GROUP BY work, language;

CREATE UNIQUE INDEX IF NOT EXISTS mv_works_summary_work_idx ON mv_works_summary(work, language);

-- Intertext summary per passage
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_passage_intertexts AS
SELECT
  source_urn as urn,
  COUNT(*) as intertext_count,
  AVG(confidence_score)::numeric(4,3) as avg_confidence,
  ARRAY_AGG(target_urn ORDER BY confidence_score DESC) FILTER (WHERE confidence_score > 0.2) as top_connections
FROM intertext_evidence
GROUP BY source_urn;

CREATE UNIQUE INDEX IF NOT EXISTS mv_passage_intertexts_urn_idx ON mv_passage_intertexts(urn);

-- Entity summary per passage
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_passage_entities AS
SELECT
  em.urn,
  COUNT(DISTINCT em.entity_id) as entity_count,
  ARRAY_AGG(DISTINCT ne.entity_type) as entity_types,
  ARRAY_AGG(DISTINCT ne.display_name) FILTER (WHERE ne.entity_type = 'person') as people,
  ARRAY_AGG(DISTINCT ne.display_name) FILTER (WHERE ne.entity_type = 'place') as places
FROM entity_mentions em
JOIN named_entities ne ON em.entity_id = ne.id
GROUP BY em.urn;

CREATE UNIQUE INDEX IF NOT EXISTS mv_passage_entities_urn_idx ON mv_passage_entities(urn);

-- ============================================================================
-- H. Refresh Function
-- ============================================================================

CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_works_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_passage_intertexts;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_passage_entities;
  -- Also refresh morph stats from earlier migration
  REFRESH MATERIALIZED VIEW morph_stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- I. Statistics Update
-- ============================================================================

ANALYZE source_texts;
ANALYZE passage_tokens;
ANALYZE morph_entries;
ANALYZE intertext_candidates;
ANALYZE intertext_evidence;
ANALYZE token_annotations;
ANALYZE entity_mentions;
ANALYZE named_entities;
