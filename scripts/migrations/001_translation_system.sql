-- LOGOS Translation System Migration
-- Phase 1: Create all required tables for translation and concept navigation
-- Created: 2026-01-05

-- ============================================================================
-- TRANSLATION MEMORY TABLES
-- ============================================================================

-- 1. Lexeme-level translation memory (word/lemma pairs)
CREATE TABLE IF NOT EXISTS translation_memory_lexeme (
    id SERIAL PRIMARY KEY,
    source_lemma TEXT NOT NULL,
    source_language VARCHAR(10) NOT NULL,  -- 'greek', 'latin', 'hebrew', 'aramaic'
    target_translation TEXT NOT NULL,
    target_language VARCHAR(10) NOT NULL DEFAULT 'english',
    confidence REAL NOT NULL DEFAULT 0.5,  -- 0-1 confidence score
    frequency INTEGER NOT NULL DEFAULT 1,  -- how often this pair seen
    morphological_context TEXT,  -- e.g., "noun.accusative.singular"
    semantic_domain TEXT,  -- e.g., "military", "religious", "philosophical"
    source_urns TEXT[],  -- URNs where this translation was extracted
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_lemma, source_language, target_translation, morphological_context)
);

CREATE INDEX IF NOT EXISTS idx_tm_lexeme_source ON translation_memory_lexeme(source_lemma, source_language);
CREATE INDEX IF NOT EXISTS idx_tm_lexeme_domain ON translation_memory_lexeme(semantic_domain);

-- 2. Phrase-level translation memory
CREATE TABLE IF NOT EXISTS translation_memory_phrase (
    id SERIAL PRIMARY KEY,
    source_phrase TEXT NOT NULL,
    source_language VARCHAR(10) NOT NULL,
    target_phrase TEXT NOT NULL,
    target_language VARCHAR(10) NOT NULL DEFAULT 'english',
    confidence REAL NOT NULL DEFAULT 0.5,
    frequency INTEGER NOT NULL DEFAULT 1,
    phrase_type VARCHAR(50),  -- 'idiom', 'collocation', 'formula', 'grammatical'
    source_urns TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_phrase, source_language, target_phrase)
);

CREATE INDEX IF NOT EXISTS idx_tm_phrase_source ON translation_memory_phrase(source_phrase, source_language);

-- 3. Idiom translation memory (special handling for complex expressions)
CREATE TABLE IF NOT EXISTS translation_memory_idiom (
    id SERIAL PRIMARY KEY,
    source_idiom TEXT NOT NULL,
    source_language VARCHAR(10) NOT NULL,
    literal_translation TEXT,
    idiomatic_translation TEXT NOT NULL,
    explanation TEXT,
    cultural_context TEXT,
    frequency INTEGER NOT NULL DEFAULT 1,
    source_urns TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_idiom, source_language, idiomatic_translation)
);

CREATE INDEX IF NOT EXISTS idx_tm_idiom_source ON translation_memory_idiom(source_idiom, source_language);

-- 4. Word order templates (for syntactic reordering)
CREATE TABLE IF NOT EXISTS translation_order_templates (
    id SERIAL PRIMARY KEY,
    source_pattern TEXT NOT NULL,  -- e.g., "VERB SUBJECT OBJECT" for Latin
    source_language VARCHAR(10) NOT NULL,
    target_pattern TEXT NOT NULL,  -- e.g., "SUBJECT VERB OBJECT" for English
    target_language VARCHAR(10) NOT NULL DEFAULT 'english',
    pattern_type VARCHAR(50),  -- 'main_clause', 'relative_clause', 'participle', etc.
    frequency INTEGER NOT NULL DEFAULT 1,
    confidence REAL NOT NULL DEFAULT 0.5,
    example_source TEXT,
    example_target TEXT,
    source_urns TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_pattern, source_language, target_pattern)
);

CREATE INDEX IF NOT EXISTS idx_order_pattern ON translation_order_templates(source_pattern, source_language);

-- ============================================================================
-- CONSENSUS AND STYLE VARIANT TABLES
-- ============================================================================

-- 5. Passage consensus (neutral "core meaning" for each passage)
CREATE TABLE IF NOT EXISTS passage_consensus (
    id SERIAL PRIMARY KEY,
    urn TEXT NOT NULL UNIQUE,
    source_language VARCHAR(10) NOT NULL,
    source_text TEXT NOT NULL,
    consensus_translation TEXT NOT NULL,
    confidence REAL NOT NULL DEFAULT 0.5,
    contributor_count INTEGER NOT NULL DEFAULT 1,  -- how many translations contributed
    embedding vector(768),  -- consensus embedding
    fidelity_score REAL,  -- cosine similarity to source embedding
    theological_choices JSONB,  -- e.g., {"יהוה": "the LORD", "אלהים": "God"}
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consensus_urn ON passage_consensus(urn);
CREATE INDEX IF NOT EXISTS idx_consensus_language ON passage_consensus(source_language);

-- 6. Style variants (4 pre-computed style variants for each consensus)
CREATE TABLE IF NOT EXISTS passage_style_variants (
    id SERIAL PRIMARY KEY,
    consensus_id INTEGER NOT NULL REFERENCES passage_consensus(id) ON DELETE CASCADE,
    urn TEXT NOT NULL,
    style VARCHAR(20) NOT NULL,  -- 'scholarly', 'literary', 'accessible', 'literal'
    variant_text TEXT NOT NULL,
    embedding vector(768),
    style_vector vector(20),  -- low-dimensional style representation
    fidelity_score REAL,  -- cosine similarity to consensus
    readability_score REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(consensus_id, style)
);

CREATE INDEX IF NOT EXISTS idx_style_variants_urn ON passage_style_variants(urn);
CREATE INDEX IF NOT EXISTS idx_style_variants_style ON passage_style_variants(style);

-- 7. Translation runs (track provenance of each translation)
CREATE TABLE IF NOT EXISTS translation_runs (
    id SERIAL PRIMARY KEY,
    run_id UUID NOT NULL DEFAULT gen_random_uuid(),
    urn TEXT NOT NULL,
    source_text TEXT NOT NULL,
    output_text TEXT NOT NULL,
    style VARCHAR(20),
    model_id TEXT,  -- which LLM was used
    prompt_template TEXT,  -- reference to prompt used
    tm_hits JSONB,  -- translation memory matches used
    fidelity_score REAL,
    passed_gate BOOLEAN DEFAULT FALSE,
    gate_failures JSONB,  -- what failed if any
    latency_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_runs_urn ON translation_runs(urn);
CREATE INDEX IF NOT EXISTS idx_runs_run_id ON translation_runs(run_id);
CREATE INDEX IF NOT EXISTS idx_runs_created ON translation_runs(created_at);

-- ============================================================================
-- BRIDGE EMBEDDINGS (MULTILINGUAL)
-- ============================================================================

-- 8. Bridge embeddings for cross-language concept search
-- Using multilingual-e5-small (384 dimensions)
CREATE TABLE IF NOT EXISTS bridge_embeddings (
    id SERIAL PRIMARY KEY,
    urn TEXT NOT NULL UNIQUE,
    language VARCHAR(10) NOT NULL,
    embedding vector(384) NOT NULL,  -- multilingual-e5-small
    source_embedding vector(768),  -- original language-specific embedding
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bridge_urn ON bridge_embeddings(urn);
CREATE INDEX IF NOT EXISTS idx_bridge_language ON bridge_embeddings(language);
CREATE INDEX IF NOT EXISTS idx_bridge_embedding_hnsw ON bridge_embeddings
    USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- 9. Chunk-level bridge embeddings (for longer passages)
CREATE TABLE IF NOT EXISTS chunk_bridge_embeddings (
    id SERIAL PRIMARY KEY,
    urn TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    language VARCHAR(10) NOT NULL,
    embedding vector(384) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(urn, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_chunk_bridge_urn ON chunk_bridge_embeddings(urn);
CREATE INDEX IF NOT EXISTS idx_chunk_bridge_embedding_hnsw ON chunk_bridge_embeddings
    USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- ============================================================================
-- CONCEPT CLUSTERS
-- ============================================================================

-- 10. Concept clusters (semantic groups)
CREATE TABLE IF NOT EXISTS concept_clusters (
    id SERIAL PRIMARY KEY,
    cluster_id UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    name TEXT,  -- human-readable name (can be assigned later)
    description TEXT,
    centroid vector(384),  -- cluster center in bridge embedding space
    member_count INTEGER NOT NULL DEFAULT 0,
    languages TEXT[],  -- languages represented in this cluster
    top_terms JSONB,  -- {"greek": ["λόγος", "ῥῆμα"], "latin": ["verbum", "sermo"]}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clusters_centroid_hnsw ON concept_clusters
    USING hnsw (centroid vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- 11. Concept members (passages in each cluster)
CREATE TABLE IF NOT EXISTS concept_members (
    id SERIAL PRIMARY KEY,
    cluster_id UUID NOT NULL REFERENCES concept_clusters(cluster_id) ON DELETE CASCADE,
    urn TEXT NOT NULL,
    language VARCHAR(10) NOT NULL,
    distance_to_centroid REAL,  -- for ranking within cluster
    snippet TEXT,  -- preview text
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cluster_id, urn)
);

CREATE INDEX IF NOT EXISTS idx_members_cluster ON concept_members(cluster_id);
CREATE INDEX IF NOT EXISTS idx_members_urn ON concept_members(urn);
CREATE INDEX IF NOT EXISTS idx_members_language ON concept_members(language);

-- 12. Concept edges (relationships between clusters)
CREATE TABLE IF NOT EXISTS concept_edges (
    id SERIAL PRIMARY KEY,
    source_cluster_id UUID NOT NULL REFERENCES concept_clusters(cluster_id) ON DELETE CASCADE,
    target_cluster_id UUID NOT NULL REFERENCES concept_clusters(cluster_id) ON DELETE CASCADE,
    edge_type VARCHAR(50) NOT NULL,  -- 'semantic_similarity', 'co-occurrence', 'etymological'
    weight REAL NOT NULL DEFAULT 0.5,
    evidence JSONB,  -- supporting evidence for this connection
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_cluster_id, target_cluster_id, edge_type)
);

CREATE INDEX IF NOT EXISTS idx_edges_source ON concept_edges(source_cluster_id);
CREATE INDEX IF NOT EXISTS idx_edges_target ON concept_edges(target_cluster_id);

-- ============================================================================
-- EVIDENCE TRAILS
-- ============================================================================

-- 13. Evidence trails (full provenance for scholarly transparency)
CREATE TABLE IF NOT EXISTS evidence_trails (
    id SERIAL PRIMARY KEY,
    trail_id UUID NOT NULL DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,  -- 'translation', 'consensus', 'cluster', 'tm_entry'
    entity_id TEXT NOT NULL,  -- reference to the entity
    action VARCHAR(50) NOT NULL,  -- 'created', 'updated', 'validated', 'rejected'
    actor TEXT,  -- 'system', 'user:xyz', 'model:gpt-4', etc.
    evidence JSONB NOT NULL,  -- detailed evidence for this action
    confidence REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trails_entity ON evidence_trails(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_trails_trail ON evidence_trails(trail_id);
CREATE INDEX IF NOT EXISTS idx_trails_created ON evidence_trails(created_at);

-- ============================================================================
-- UPDATE backfill_jobs IF NEEDED
-- ============================================================================

-- Add new job types to backfill_jobs if column doesn't exist
DO $$
BEGIN
    -- Add progress column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'backfill_jobs' AND column_name = 'progress'
    ) THEN
        ALTER TABLE backfill_jobs ADD COLUMN progress REAL DEFAULT 0;
    END IF;

    -- Add job_type column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'backfill_jobs' AND column_name = 'job_type'
    ) THEN
        ALTER TABLE backfill_jobs ADD COLUMN job_type VARCHAR(50);
    END IF;

    -- Add last_checkpoint column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'backfill_jobs' AND column_name = 'last_checkpoint'
    ) THEN
        ALTER TABLE backfill_jobs ADD COLUMN last_checkpoint TEXT;
    END IF;
END $$;

-- ============================================================================
-- SUMMARY VIEW
-- ============================================================================

-- Create a summary view for translation system health
CREATE OR REPLACE VIEW translation_system_health AS
SELECT
    (SELECT COUNT(*) FROM translation_memory_lexeme) as tm_lexeme_count,
    (SELECT COUNT(*) FROM translation_memory_phrase) as tm_phrase_count,
    (SELECT COUNT(*) FROM translation_memory_idiom) as tm_idiom_count,
    (SELECT COUNT(*) FROM translation_order_templates) as order_template_count,
    (SELECT COUNT(*) FROM passage_consensus) as consensus_count,
    (SELECT COUNT(*) FROM passage_style_variants) as style_variant_count,
    (SELECT COUNT(*) FROM bridge_embeddings) as bridge_embedding_count,
    (SELECT COUNT(*) FROM concept_clusters) as cluster_count,
    (SELECT COUNT(*) FROM concept_members) as member_count,
    (SELECT COUNT(*) FROM translation_runs) as translation_run_count;

-- Done!
SELECT 'Migration 001_translation_system completed successfully!' as status;
