-- =============================================================================
-- LOGOS Translation Style Database Schema
-- =============================================================================
-- 
-- This schema extends the LOGOS PostgreSQL database with tables for:
--   1. Translator profiles and style vectors
--   2. Translation pairs (source + translation)
--   3. Style analysis results
--   4. LTQI scores
--   5. Style evolution history
--
-- Run: psql logos < translation_schema.sql
-- =============================================================================

-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================================================
-- TRANSLATOR PROFILES
-- =============================================================================

CREATE TABLE IF NOT EXISTS translators (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    birth_year INTEGER,
    death_year INTEGER,
    nationality VARCHAR(100),
    philosophy TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS translator_works (
    id SERIAL PRIMARY KEY,
    translator_id INTEGER REFERENCES translators(id),
    work_title VARCHAR(255) NOT NULL,
    publication_year INTEGER,
    source_language VARCHAR(50),
    UNIQUE(translator_id, work_title)
);

CREATE TABLE IF NOT EXISTS translator_features (
    id SERIAL PRIMARY KEY,
    translator_id INTEGER REFERENCES translators(id),
    feature TEXT NOT NULL
);

-- Style vectors stored as 20-dimensional arrays
CREATE TABLE IF NOT EXISTS style_vectors (
    id SERIAL PRIMARY KEY,
    translator_id INTEGER REFERENCES translators(id) UNIQUE,
    
    -- 20 style dimensions (0-1 scale)
    formality REAL NOT NULL,
    archaism REAL NOT NULL,
    sentence_length REAL NOT NULL,
    clause_complexity REAL NOT NULL,
    word_order_freedom REAL NOT NULL,
    anglo_saxon_pref REAL NOT NULL,
    figurative_pres REAL NOT NULL,
    rhythmic_reg REAL NOT NULL,
    source_fidelity REAL NOT NULL,
    addition_tolerance REAL NOT NULL,
    omission_tolerance REAL NOT NULL,
    register_consistency REAL NOT NULL,
    lexical_density REAL NOT NULL,
    syntactic_mirror REAL NOT NULL,
    particle_rendering REAL NOT NULL,
    proper_name_handling REAL NOT NULL,
    dialect_fidelity REAL NOT NULL,
    semantic_drift REAL NOT NULL,
    intertext_pres REAL NOT NULL,
    era_bias REAL NOT NULL,
    
    -- Confidence score
    confidence REAL DEFAULT 0.9,
    
    -- Full vector for similarity search (pgvector)
    vector_embedding vector(20),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for vector similarity search
CREATE INDEX IF NOT EXISTS style_vectors_embedding_idx 
    ON style_vectors USING ivfflat (vector_embedding vector_cosine_ops);

-- =============================================================================
-- TRANSLATION PAIRS
-- =============================================================================

CREATE TABLE IF NOT EXISTS translation_pairs (
    id SERIAL PRIMARY KEY,
    
    -- Source text
    source_text TEXT NOT NULL,
    source_language VARCHAR(10) NOT NULL, -- 'grc', 'lat'
    source_work_id INTEGER, -- References works table if available
    source_line_start INTEGER,
    source_line_end INTEGER,
    
    -- Translation
    translation TEXT NOT NULL,
    target_language VARCHAR(10) DEFAULT 'en',
    translator_id INTEGER REFERENCES translators(id),
    publication_year INTEGER,
    
    -- Embeddings
    source_embedding vector(768),
    translation_embedding vector(768),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS translation_pairs_source_lang_idx 
    ON translation_pairs(source_language);
CREATE INDEX IF NOT EXISTS translation_pairs_translator_idx 
    ON translation_pairs(translator_id);

-- =============================================================================
-- STYLE ANALYSIS
-- =============================================================================

CREATE TABLE IF NOT EXISTS style_analyses (
    id SERIAL PRIMARY KEY,
    
    -- What was analyzed
    analysis_type VARCHAR(50) NOT NULL, -- 'text', 'corpus', 'comparison'
    input_text_ids INTEGER[], -- Array of translation_pair IDs
    
    -- Extracted style vector
    extracted_style JSONB NOT NULL,
    
    -- Most similar known translators
    similar_translators JSONB,
    
    -- Analysis metadata
    confidence REAL,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- LTQI SCORES
-- =============================================================================

CREATE TABLE IF NOT EXISTS ltqi_scores (
    id SERIAL PRIMARY KEY,
    
    -- Reference to translation
    translation_pair_id INTEGER REFERENCES translation_pairs(id),
    
    -- LTQI components (0-1 scale)
    semantic_fidelity REAL NOT NULL,
    stylistic_consistency REAL NOT NULL,
    fluency REAL NOT NULL,
    cultural_accuracy REAL NOT NULL,
    
    -- Weights used
    weights JSONB DEFAULT '{"semantic_fidelity": 0.35, "stylistic_consistency": 0.20, "fluency": 0.30, "cultural_accuracy": 0.15}',
    
    -- Overall score
    overall_score REAL GENERATED ALWAYS AS (
        semantic_fidelity * 0.35 +
        stylistic_consistency * 0.20 +
        fluency * 0.30 +
        cultural_accuracy * 0.15
    ) STORED,
    
    -- Letter grade
    letter_grade VARCHAR(2) GENERATED ALWAYS AS (
        CASE 
            WHEN (semantic_fidelity * 0.35 + stylistic_consistency * 0.20 + fluency * 0.30 + cultural_accuracy * 0.15) >= 0.90 THEN 'A'
            WHEN (semantic_fidelity * 0.35 + stylistic_consistency * 0.20 + fluency * 0.30 + cultural_accuracy * 0.15) >= 0.80 THEN 'B'
            WHEN (semantic_fidelity * 0.35 + stylistic_consistency * 0.20 + fluency * 0.30 + cultural_accuracy * 0.15) >= 0.70 THEN 'C'
            WHEN (semantic_fidelity * 0.35 + stylistic_consistency * 0.20 + fluency * 0.30 + cultural_accuracy * 0.15) >= 0.60 THEN 'D'
            ELSE 'F'
        END
    ) STORED,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- STYLE BLENDS
-- =============================================================================

CREATE TABLE IF NOT EXISTS style_blends (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    
    -- Component translators and weights
    components JSONB NOT NULL, -- [{"translator_id": 1, "weight": 0.5}, ...]
    
    -- Resulting blended style
    blended_style JSONB NOT NULL,
    
    -- Most similar known translator
    nearest_translator_id INTEGER REFERENCES translators(id),
    nearest_distance REAL,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- TRANSLATION COMPARISONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS translation_comparisons (
    id SERIAL PRIMARY KEY,
    
    -- Source passage
    source_text TEXT NOT NULL,
    source_language VARCHAR(10) NOT NULL,
    
    -- Multiple translations of same passage
    translations JSONB NOT NULL, -- [{"translator_id": 1, "text": "..."}, ...]
    
    -- Analysis
    divergence_score REAL, -- How much translations differ
    difficulty_rating VARCHAR(20), -- 'easy', 'moderate', 'hard'
    analysis_notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================

-- Function to convert style vector to array
CREATE OR REPLACE FUNCTION get_style_array(translator_key VARCHAR)
RETURNS REAL[] AS $$
DECLARE
    result REAL[];
BEGIN
    SELECT ARRAY[
        formality, archaism, sentence_length, clause_complexity,
        word_order_freedom, anglo_saxon_pref, figurative_pres, rhythmic_reg,
        source_fidelity, addition_tolerance, omission_tolerance, register_consistency,
        lexical_density, syntactic_mirror, particle_rendering, proper_name_handling,
        dialect_fidelity, semantic_drift, intertext_pres, era_bias
    ] INTO result
    FROM style_vectors sv
    JOIN translators t ON sv.translator_id = t.id
    WHERE t.key = translator_key;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to compute style distance
CREATE OR REPLACE FUNCTION style_distance(key1 VARCHAR, key2 VARCHAR)
RETURNS REAL AS $$
DECLARE
    v1 vector(20);
    v2 vector(20);
BEGIN
    SELECT vector_embedding INTO v1
    FROM style_vectors sv
    JOIN translators t ON sv.translator_id = t.id
    WHERE t.key = key1;
    
    SELECT vector_embedding INTO v2
    FROM style_vectors sv
    JOIN translators t ON sv.translator_id = t.id
    WHERE t.key = key2;
    
    RETURN v1 <-> v2; -- Euclidean distance
END;
$$ LANGUAGE plpgsql;

-- Function to find similar translators
CREATE OR REPLACE FUNCTION find_similar_translators(target_style vector(20), k INTEGER DEFAULT 5)
RETURNS TABLE(translator_key VARCHAR, translator_name VARCHAR, distance REAL) AS $$
BEGIN
    RETURN QUERY
    SELECT t.key, t.name, (sv.vector_embedding <-> target_style)::REAL as dist
    FROM style_vectors sv
    JOIN translators t ON sv.translator_id = t.id
    ORDER BY sv.vector_embedding <-> target_style
    LIMIT k;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Full translator profile view
CREATE OR REPLACE VIEW translator_profiles AS
SELECT 
    t.id,
    t.key,
    t.name,
    t.category,
    t.birth_year,
    t.death_year,
    t.nationality,
    t.philosophy,
    sv.formality,
    sv.archaism,
    sv.sentence_length,
    sv.clause_complexity,
    sv.word_order_freedom,
    sv.anglo_saxon_pref,
    sv.figurative_pres,
    sv.rhythmic_reg,
    sv.source_fidelity,
    sv.addition_tolerance,
    sv.omission_tolerance,
    sv.register_consistency,
    sv.lexical_density,
    sv.syntactic_mirror,
    sv.particle_rendering,
    sv.proper_name_handling,
    sv.dialect_fidelity,
    sv.semantic_drift,
    sv.intertext_pres,
    sv.era_bias,
    sv.confidence,
    array_agg(DISTINCT tw.work_title) FILTER (WHERE tw.work_title IS NOT NULL) as works,
    array_agg(DISTINCT tf.feature) FILTER (WHERE tf.feature IS NOT NULL) as features
FROM translators t
LEFT JOIN style_vectors sv ON t.id = sv.translator_id
LEFT JOIN translator_works tw ON t.id = tw.translator_id
LEFT JOIN translator_features tf ON t.id = tf.translator_id
GROUP BY t.id, sv.id;

-- Style comparison matrix view
CREATE OR REPLACE VIEW style_distance_matrix AS
SELECT 
    t1.name as translator1,
    t2.name as translator2,
    (sv1.vector_embedding <-> sv2.vector_embedding)::REAL as distance
FROM translators t1
CROSS JOIN translators t2
JOIN style_vectors sv1 ON t1.id = sv1.translator_id
JOIN style_vectors sv2 ON t2.id = sv2.translator_id
WHERE t1.id < t2.id;

-- Category statistics view
CREATE OR REPLACE VIEW category_stats AS
SELECT 
    category,
    COUNT(*) as translator_count,
    AVG(sv.formality) as avg_formality,
    AVG(sv.archaism) as avg_archaism,
    AVG(sv.source_fidelity) as avg_fidelity
FROM translators t
JOIN style_vectors sv ON t.id = sv.translator_id
GROUP BY category;

-- =============================================================================
-- SAMPLE DATA INSERTION
-- =============================================================================

-- Insert sample translators (run after creating tables)
INSERT INTO translators (key, name, category, birth_year, death_year, nationality, philosophy)
VALUES 
    ('alexander_pope', 'Alexander Pope', 'homer', 1688, 1744, 'English', 'Poetry must be refined for civilized readers'),
    ('richmond_lattimore', 'Richmond Lattimore', 'homer', 1906, 1984, 'American', 'The poem should speak for itself'),
    ('robert_fagles', 'Robert Fagles', 'homer', 1933, 2008, 'American', 'Make ancient poetry live for modern readers'),
    ('emily_wilson', 'Emily Wilson', 'homer', 1971, NULL, 'British-American', 'Clarity and attention to what Greek says')
ON CONFLICT (key) DO NOTHING;

-- Insert style vectors for sample translators
INSERT INTO style_vectors (translator_id, formality, archaism, sentence_length, clause_complexity,
    word_order_freedom, anglo_saxon_pref, figurative_pres, rhythmic_reg,
    source_fidelity, addition_tolerance, omission_tolerance, register_consistency,
    lexical_density, syntactic_mirror, particle_rendering, proper_name_handling,
    dialect_fidelity, semantic_drift, intertext_pres, era_bias, vector_embedding)
SELECT 
    t.id,
    0.92, 0.85, 0.75, 0.80, 0.55, 0.25, 0.70, 0.95, 0.45, 0.80,
    0.60, 0.85, 0.75, 0.50, 0.35, 0.70, 0.20, 0.65, 0.40, 0.90,
    '[0.92, 0.85, 0.75, 0.80, 0.55, 0.25, 0.70, 0.95, 0.45, 0.80, 0.60, 0.85, 0.75, 0.50, 0.35, 0.70, 0.20, 0.65, 0.40, 0.90]'::vector
FROM translators t WHERE t.key = 'alexander_pope'
ON CONFLICT (translator_id) DO NOTHING;

INSERT INTO style_vectors (translator_id, formality, archaism, sentence_length, clause_complexity,
    word_order_freedom, anglo_saxon_pref, figurative_pres, rhythmic_reg,
    source_fidelity, addition_tolerance, omission_tolerance, register_consistency,
    lexical_density, syntactic_mirror, particle_rendering, proper_name_handling,
    dialect_fidelity, semantic_drift, intertext_pres, era_bias, vector_embedding)
SELECT 
    t.id,
    0.40, 0.15, 0.35, 0.35, 0.25, 0.85, 0.65, 0.40, 0.75, 0.20,
    0.25, 0.65, 0.45, 0.25, 0.70, 0.50, 0.50, 0.35, 0.60, 0.15,
    '[0.40, 0.15, 0.35, 0.35, 0.25, 0.85, 0.65, 0.40, 0.75, 0.20, 0.25, 0.65, 0.45, 0.25, 0.70, 0.50, 0.50, 0.35, 0.60, 0.15]'::vector
FROM translators t WHERE t.key = 'emily_wilson'
ON CONFLICT (translator_id) DO NOTHING;

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

-- Grant access to web user (adjust username as needed)
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO logos_web;
-- GRANT INSERT, UPDATE ON translation_pairs, style_analyses, ltqi_scores TO logos_web;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO logos_web;

COMMENT ON TABLE translators IS 'Translator profiles with biographical data';
COMMENT ON TABLE style_vectors IS '20-dimensional style vectors for each translator';
COMMENT ON TABLE translation_pairs IS 'Source texts paired with translations';
COMMENT ON TABLE ltqi_scores IS 'LOGOS Translation Quality Index scores';
