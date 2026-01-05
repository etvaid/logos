-- LOGOS Database Audit Script
-- Phase 0: Detect existing infrastructure

-- ============================================================================
-- 1. EMBEDDING INFRASTRUCTURE
-- ============================================================================

-- 1a. All tables with embedding/vector columns
SELECT 'EMBEDDING_COLUMNS' as section;
SELECT table_name, column_name, data_type,
       CASE
         WHEN data_type = 'USER-DEFINED' THEN 'VECTOR'
         WHEN data_type = 'ARRAY' THEN 'ARRAY'
         WHEN data_type = 'bytea' THEN 'BYTEA'
         WHEN data_type = 'jsonb' THEN 'JSONB'
         ELSE data_type
       END as embed_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND (data_type ILIKE '%vector%'
     OR column_name ILIKE '%embed%'
     OR column_name ILIKE '%vector%')
ORDER BY table_name, column_name;

-- 1b. Check vector dimensions on key tables
SELECT 'VECTOR_DIMENSIONS' as section;
SELECT 'translations' as table_name,
       pg_typeof(embedding)::text as type,
       vector_dims(embedding) as dims
FROM translations
WHERE embedding IS NOT NULL
LIMIT 1;

SELECT 'style_invariant_embeddings' as table_name,
       CASE WHEN original_embedding IS NOT NULL THEN 'has_original' ELSE 'no_original' END as orig_status,
       CASE WHEN invariant_embedding IS NOT NULL THEN 'has_invariant' ELSE 'no_invariant' END as inv_status
FROM style_invariant_embeddings
LIMIT 1;

SELECT 'embeddings' as table_name,
       COUNT(*) as total_rows
FROM embeddings;

SELECT 'passages' as table_name,
       pg_typeof(embedding)::text as embed_type,
       pg_typeof(style_vector)::text as style_type
FROM passages
WHERE embedding IS NOT NULL
LIMIT 1;

-- ============================================================================
-- 2. SOURCE TEXT COUNTS
-- ============================================================================
SELECT 'SOURCE_TEXT_COUNTS' as section;
SELECT language, COUNT(*) as count
FROM source_texts
GROUP BY language
ORDER BY count DESC;

SELECT 'TOTAL_SOURCE_TEXTS' as section;
SELECT COUNT(*) as total FROM source_texts;

-- ============================================================================
-- 3. EMBEDDING COVERAGE
-- ============================================================================
SELECT 'EMBEDDING_COVERAGE' as section;

-- Check if source_texts has embedding column
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'source_texts'
AND column_name = 'embedding';

-- Check embeddings table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'embeddings'
ORDER BY ordinal_position;

-- Count embeddings by checking what keys exist
SELECT 'embeddings_count' as metric, COUNT(*) as value FROM embeddings;

-- ============================================================================
-- 4. TRANSLATION COVERAGE
-- ============================================================================
SELECT 'TRANSLATION_COVERAGE' as section;

-- Total translations
SELECT 'total_translations' as metric, COUNT(*) as value FROM translations;

-- Check translation table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'translations'
ORDER BY ordinal_position;

-- Translations with embeddings
SELECT 'translations_with_embeddings' as metric,
       COUNT(*) as value
FROM translations
WHERE embedding IS NOT NULL;

-- Check for URN or source_text_id column
SELECT 'translation_key_columns' as section;
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'translations'
AND column_name IN ('urn', 'source_text_id', 'passage_urn', 'text_id');

-- ============================================================================
-- 5. BACKFILL JOBS TABLE
-- ============================================================================
SELECT 'BACKFILL_JOBS' as section;
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_name = 'backfill_jobs'
) as backfill_jobs_exists;

-- If exists, show structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'backfill_jobs'
ORDER BY ordinal_position;

-- ============================================================================
-- 6. INDEX CHECK
-- ============================================================================
SELECT 'INDEXES' as section;
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND (indexdef ILIKE '%vector%'
     OR indexdef ILIKE '%hnsw%'
     OR indexdef ILIKE '%ivfflat%'
     OR indexname ILIKE '%urn%'
     OR indexname ILIKE '%language%')
ORDER BY indexname;

-- ============================================================================
-- 7. MORPHOLOGY COVERAGE
-- ============================================================================
SELECT 'MORPHOLOGY_COVERAGE' as section;
SELECT 'morph_entries' as table_name, COUNT(*) as count FROM morph_entries;
SELECT 'passage_tokens' as table_name, COUNT(*) as count FROM passage_tokens;

-- Check morph_entries structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'morph_entries'
ORDER BY ordinal_position
LIMIT 10;

-- ============================================================================
-- 8. PASSAGE TOKENS LANGUAGE DISTRIBUTION
-- ============================================================================
SELECT 'PASSAGE_TOKENS_SAMPLE' as section;
SELECT COUNT(*) as total_tokens FROM passage_tokens;

-- ============================================================================
-- 9. CHECK FOR EXISTING TRANSLATION SYSTEM TABLES
-- ============================================================================
SELECT 'EXISTING_TRANSLATION_TABLES' as section;
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'passage_consensus',
  'passage_style_variants',
  'translation_memory_lexeme',
  'translation_memory_phrase',
  'translation_memory_idiom',
  'translation_order_templates',
  'translation_runs',
  'translation_review_queue',
  'bridge_embeddings',
  'chunk_bridge_embeddings',
  'concept_clusters',
  'concept_members',
  'concept_edges',
  'evidence_trails'
);

-- ============================================================================
-- 10. SAMPLE DATA INSPECTION
-- ============================================================================
SELECT 'SAMPLE_TRANSLATION' as section;
SELECT id,
       SUBSTRING(COALESCE(source_text, '')::text, 1, 100) as source_preview,
       SUBSTRING(COALESCE(translated_text, '')::text, 1, 100) as translation_preview,
       language,
       CASE WHEN embedding IS NOT NULL THEN 'yes' ELSE 'no' END as has_embedding
FROM translations
LIMIT 3;

SELECT 'SAMPLE_SOURCE_TEXT' as section;
SELECT id,
       SUBSTRING(COALESCE(text, '')::text, 1, 100) as text_preview,
       author,
       work,
       language
FROM source_texts
LIMIT 3;
