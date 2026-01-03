-- ============================================================================
-- LOGOS Phase 3: Context Engine
-- Named entities, geo, timeline, and thematic overlays
-- ============================================================================

-- ============================================================================
-- A. Named Entities (people, places, institutions)
-- ============================================================================

CREATE TABLE IF NOT EXISTS named_entities (
  id            BIGSERIAL PRIMARY KEY,
  entity_type   TEXT NOT NULL CHECK (entity_type IN ('person', 'place', 'institution', 'deity', 'group', 'work', 'event')),
  canonical_name TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  language      TEXT NOT NULL DEFAULT 'grc',
  aliases       TEXT[] DEFAULT '{}',
  description   TEXT,
  wikidata_id   TEXT,
  pleiades_id   TEXT,  -- For places

  -- Temporal bounds
  date_start    INT,   -- Year (negative for BCE)
  date_end      INT,
  date_precision TEXT CHECK (date_precision IN ('exact', 'decade', 'century', 'approximate')),

  -- Geo (for places)
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  region        TEXT,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (entity_type, canonical_name, language)
);

CREATE INDEX IF NOT EXISTS named_entities_type_idx ON named_entities(entity_type);
CREATE INDEX IF NOT EXISTS named_entities_name_idx ON named_entities(canonical_name);
CREATE INDEX IF NOT EXISTS named_entities_wikidata_idx ON named_entities(wikidata_id) WHERE wikidata_id IS NOT NULL;

-- ============================================================================
-- B. Entity Mentions (links entities to passages)
-- ============================================================================

CREATE TABLE IF NOT EXISTS entity_mentions (
  id            BIGSERIAL PRIMARY KEY,
  urn           TEXT NOT NULL,
  entity_id     BIGINT NOT NULL REFERENCES named_entities(id),
  mention_text  TEXT NOT NULL,
  char_start    INT,
  char_end      INT,
  confidence    REAL NOT NULL DEFAULT 0.8,
  source        TEXT NOT NULL DEFAULT 'manual',  -- 'manual', 'ner', 'dictionary'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (urn, entity_id, char_start)
);

CREATE INDEX IF NOT EXISTS entity_mentions_urn_idx ON entity_mentions(urn);
CREATE INDEX IF NOT EXISTS entity_mentions_entity_idx ON entity_mentions(entity_id);

-- ============================================================================
-- C. Thematic Tags
-- ============================================================================

CREATE TABLE IF NOT EXISTS thematic_tags (
  id            BIGSERIAL PRIMARY KEY,
  tag_name      TEXT NOT NULL UNIQUE,
  category      TEXT NOT NULL CHECK (category IN ('politics', 'economics', 'religion', 'military', 'law', 'social', 'geography', 'philosophy')),
  description   TEXT,
  parent_tag_id BIGINT REFERENCES thematic_tags(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS thematic_tags_category_idx ON thematic_tags(category);

-- ============================================================================
-- D. Passage Themes (links themes to passages)
-- ============================================================================

CREATE TABLE IF NOT EXISTS passage_themes (
  id            BIGSERIAL PRIMARY KEY,
  urn           TEXT NOT NULL,
  tag_id        BIGINT NOT NULL REFERENCES thematic_tags(id),
  confidence    REAL NOT NULL DEFAULT 0.8,
  source        TEXT NOT NULL DEFAULT 'manual',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (urn, tag_id)
);

CREATE INDEX IF NOT EXISTS passage_themes_urn_idx ON passage_themes(urn);
CREATE INDEX IF NOT EXISTS passage_themes_tag_idx ON passage_themes(tag_id);

-- ============================================================================
-- E. Timeline Events (for timeline scrubber)
-- ============================================================================

CREATE TABLE IF NOT EXISTS timeline_events (
  id            BIGSERIAL PRIMARY KEY,
  event_name    TEXT NOT NULL,
  event_type    TEXT NOT NULL CHECK (event_type IN ('political', 'military', 'religious', 'literary', 'natural')),
  date_start    INT NOT NULL,  -- Year (negative for BCE)
  date_end      INT,
  date_display  TEXT NOT NULL,  -- Human-readable date
  description   TEXT,
  region        TEXT,
  importance    INT NOT NULL DEFAULT 5 CHECK (importance BETWEEN 1 AND 10),
  wikidata_id   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS timeline_events_date_idx ON timeline_events(date_start);
CREATE INDEX IF NOT EXISTS timeline_events_type_idx ON timeline_events(event_type);

-- ============================================================================
-- F. Context Cards (precomputed per passage)
-- ============================================================================

CREATE TABLE IF NOT EXISTS context_cards (
  urn           TEXT PRIMARY KEY,
  entities      JSONB NOT NULL DEFAULT '[]',  -- [{id, type, name, role}]
  places        JSONB NOT NULL DEFAULT '[]',  -- [{id, name, lat, lng}]
  themes        JSONB NOT NULL DEFAULT '[]',  -- [{id, name, category}]
  date_range    JSONB,                        -- {start, end, display}
  historical_context TEXT,                     -- Brief narrative
  related_events JSONB DEFAULT '[]',          -- [{id, name, date}]
  computed_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- G. Seed some initial thematic tags
-- ============================================================================

INSERT INTO thematic_tags (tag_name, category, description) VALUES
  ('kingship', 'politics', 'Discussions of royal authority and monarchy'),
  ('empire', 'politics', 'Roman imperial themes'),
  ('senate', 'politics', 'Roman Senate and senatorial class'),
  ('democracy', 'politics', 'Democratic governance'),
  ('tyranny', 'politics', 'Tyrannical rule'),

  ('taxation', 'economics', 'Taxes and tribute'),
  ('trade', 'economics', 'Commerce and trade routes'),
  ('debt', 'economics', 'Debt and lending'),
  ('wealth', 'economics', 'Wealth and poverty'),
  ('agriculture', 'economics', 'Farming and land'),

  ('temple', 'religion', 'Temple cult and sacrifice'),
  ('prophecy', 'religion', 'Prophetic speech'),
  ('prayer', 'religion', 'Prayer and devotion'),
  ('purity', 'religion', 'Ritual purity'),
  ('eschatology', 'religion', 'End times and judgment'),

  ('war', 'military', 'Warfare and battle'),
  ('siege', 'military', 'Siege warfare'),
  ('army', 'military', 'Military organization'),
  ('victory', 'military', 'Victory and triumph'),

  ('justice', 'law', 'Legal justice'),
  ('trial', 'law', 'Legal proceedings'),
  ('punishment', 'law', 'Penalties and punishment'),
  ('covenant', 'law', 'Covenant and treaty'),

  ('family', 'social', 'Family and kinship'),
  ('slavery', 'social', 'Slavery and servitude'),
  ('honor', 'social', 'Honor and shame'),
  ('death', 'social', 'Death and burial'),

  ('city', 'geography', 'Urban settings'),
  ('wilderness', 'geography', 'Desert and wilderness'),
  ('sea', 'geography', 'Maritime themes'),
  ('mountain', 'geography', 'Mountain settings')
ON CONFLICT (tag_name) DO NOTHING;

-- ============================================================================
-- H. Seed some key historical figures
-- ============================================================================

INSERT INTO named_entities (entity_type, canonical_name, display_name, language, description, date_start, date_end) VALUES
  ('person', 'Ἰησοῦς', 'Jesus of Nazareth', 'grc', 'Central figure of the Gospels', -4, 30),
  ('person', 'Πέτρος', 'Peter (Simon)', 'grc', 'Apostle, leader of the Twelve', -1, 64),
  ('person', 'Παῦλος', 'Paul of Tarsus', 'grc', 'Apostle to the Gentiles', 5, 64),
  ('person', 'Ἡρῴδης', 'Herod the Great', 'grc', 'King of Judea', -73, -4),
  ('person', 'Πιλᾶτος', 'Pontius Pilate', 'grc', 'Roman prefect of Judea', -10, 36),
  ('person', 'Καῖσαρ', 'Caesar Augustus', 'grc', 'First Roman Emperor', -63, 14),
  ('person', 'Τιβέριος', 'Tiberius', 'grc', 'Roman Emperor during Jesus ministry', -42, 37),

  ('place', 'Ἱερουσαλήμ', 'Jerusalem', 'grc', 'Holy city, Temple location', NULL, NULL),
  ('place', 'Γαλιλαία', 'Galilee', 'grc', 'Northern region of Israel', NULL, NULL),
  ('place', 'Ναζαρέτ', 'Nazareth', 'grc', 'Hometown of Jesus', NULL, NULL),
  ('place', 'Καφαρναούμ', 'Capernaum', 'grc', 'Fishing village on Sea of Galilee', NULL, NULL),
  ('place', 'Βηθλέεμ', 'Bethlehem', 'grc', 'Birthplace of Jesus', NULL, NULL),
  ('place', 'Ῥώμη', 'Rome', 'grc', 'Capital of the Roman Empire', NULL, NULL),

  ('institution', 'συνέδριον', 'Sanhedrin', 'grc', 'Jewish high council', NULL, NULL),
  ('institution', 'φαρισαῖοι', 'Pharisees', 'grc', 'Jewish religious party', NULL, NULL),
  ('institution', 'σαδδουκαῖοι', 'Sadducees', 'grc', 'Jewish priestly party', NULL, NULL)
ON CONFLICT (entity_type, canonical_name, language) DO NOTHING;

-- Update geo for places
UPDATE named_entities SET latitude = 31.7683, longitude = 35.2137, region = 'Judea' WHERE canonical_name = 'Ἱερουσαλήμ';
UPDATE named_entities SET latitude = 32.7000, longitude = 35.3000, region = 'Galilee' WHERE canonical_name = 'Γαλιλαία';
UPDATE named_entities SET latitude = 32.7019, longitude = 35.2978, region = 'Galilee' WHERE canonical_name = 'Ναζαρέτ';
UPDATE named_entities SET latitude = 32.8808, longitude = 35.5750, region = 'Galilee' WHERE canonical_name = 'Καφαρναούμ';
UPDATE named_entities SET latitude = 31.7054, longitude = 35.2024, region = 'Judea' WHERE canonical_name = 'Βηθλέεμ';
UPDATE named_entities SET latitude = 41.9028, longitude = 12.4964, region = 'Italy' WHERE canonical_name = 'Ῥώμη';
