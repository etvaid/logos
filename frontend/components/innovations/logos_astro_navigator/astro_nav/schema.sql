CREATE SCHEMA IF NOT EXISTS astro;

-- ---------- catalogs ----------
CREATE TABLE IF NOT EXISTS astro.catalogs (
  catalog_id SERIAL PRIMARY KEY,
  catalog_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  epoch_year INT,
  coord_system TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- astro objects ----------
CREATE TABLE IF NOT EXISTS astro.objects (
  object_id SERIAL PRIMARY KEY,
  object_key TEXT UNIQUE NOT NULL,
  object_type TEXT NOT NULL,
  canonical_name TEXT NOT NULL,
  constellation TEXT,
  bayer TEXT,
  flamsteed TEXT,
  hip_id INT,
  gaia_source_id BIGINT,
  mag_modern REAL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_astro_objects_hip ON astro.objects(hip_id);
CREATE INDEX IF NOT EXISTS idx_astro_objects_gaia ON astro.objects(gaia_source_id);
CREATE INDEX IF NOT EXISTS idx_astro_objects_const ON astro.objects(constellation);

-- ---------- catalog entries ----------
CREATE TABLE IF NOT EXISTS astro.catalog_entries (
  entry_id BIGSERIAL PRIMARY KEY,
  catalog_id INT NOT NULL REFERENCES astro.catalogs(catalog_id) ON DELETE CASCADE,
  object_id INT REFERENCES astro.objects(object_id) ON DELETE SET NULL,
  entry_no INT,
  constellation TEXT,
  recorded_lon DOUBLE PRECISION,
  recorded_lat DOUBLE PRECISION,
  recorded_lon_raw TEXT,
  recorded_lat_raw TEXT,
  magnitude_int INT,
  description TEXT,
  source_urn TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(catalog_id, entry_no)
);

CREATE INDEX IF NOT EXISTS idx_entries_catalog ON astro.catalog_entries(catalog_id);
CREATE INDEX IF NOT EXISTS idx_entries_object ON astro.catalog_entries(object_id);

-- ---------- modern astrometry (Gaia/modern) ----------
CREATE TABLE IF NOT EXISTS astro.modern_astrometry (
  object_id INT PRIMARY KEY REFERENCES astro.objects(object_id) ON DELETE CASCADE,
  ref_epoch_jyear DOUBLE PRECISION DEFAULT 2000.0,
  ra_deg DOUBLE PRECISION,
  dec_deg DOUBLE PRECISION,
  pmra_masyr DOUBLE PRECISION,
  pmdec_masyr DOUBLE PRECISION,
  parallax_mas DOUBLE PRECISION,
  radvel_kms DOUBLE PRECISION,
  ra_error_mas DOUBLE PRECISION,
  dec_error_mas DOUBLE PRECISION,
  pmra_error_masyr DOUBLE PRECISION,
  pmdec_error_masyr DOUBLE PRECISION,
  phot_g_mean_mag REAL,
  source TEXT DEFAULT 'GaiaDR3',
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- analysis runs ----------
CREATE TABLE IF NOT EXISTS astro.analysis_runs (
  run_id BIGSERIAL PRIMARY KEY,
  run_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  config JSONB NOT NULL,
  code_version TEXT,
  notes TEXT
);

-- ---------- per-entry predictions/residuals ----------
CREATE TABLE IF NOT EXISTS astro.predictions (
  pred_id BIGSERIAL PRIMARY KEY,
  run_id BIGINT NOT NULL REFERENCES astro.analysis_runs(run_id) ON DELETE CASCADE,
  entry_id BIGINT NOT NULL REFERENCES astro.catalog_entries(entry_id) ON DELETE CASCADE,
  hypothesis TEXT NOT NULL,
  epoch_year INT,
  model_params JSONB,
  pred_lon DOUBLE PRECISION,
  pred_lat DOUBLE PRECISION,
  dlon DOUBLE PRECISION,
  dlat DOUBLE PRECISION,
  ang_resid DOUBLE PRECISION,
  loglik DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pred_run_hyp ON astro.predictions(run_id, hypothesis);
CREATE INDEX IF NOT EXISTS idx_pred_entry ON astro.predictions(entry_id);

-- ---------- run-level model summaries ----------
CREATE TABLE IF NOT EXISTS astro.model_summaries (
  summary_id BIGSERIAL PRIMARY KEY,
  run_id BIGINT NOT NULL REFERENCES astro.analysis_runs(run_id) ON DELETE CASCADE,
  catalog_key TEXT NOT NULL,
  hypothesis_a TEXT NOT NULL,
  hypothesis_b TEXT NOT NULL,
  n_entries INT NOT NULL,
  rms_a DOUBLE PRECISION,
  rms_b DOUBLE PRECISION,
  bic_a DOUBLE PRECISION,
  bic_b DOUBLE PRECISION,
  bic_mix DOUBLE PRECISION,
  mix_weight_b DOUBLE PRECISION,
  log_bayes_factor_mix_vs_best DOUBLE PRECISION,
  precession_shift_deg DOUBLE PRECISION,
  rounding_arcmin DOUBLE PRECISION,
  sigma_arcmin DOUBLE PRECISION,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_model_summaries_run ON astro.model_summaries(run_id);

-- ---------- constellation/systematics ----------
CREATE TABLE IF NOT EXISTS astro.systematics (
  sys_id BIGSERIAL PRIMARY KEY,
  run_id BIGINT NOT NULL REFERENCES astro.analysis_runs(run_id) ON DELETE CASCADE,
  catalog_key TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  constellation TEXT,
  n_entries INT,
  offset_lon_deg DOUBLE PRECISION,
  offset_lat_deg DOUBLE PRECISION,
  shrinkage DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_systematics_run ON astro.systematics(run_id, catalog_key, hypothesis);

-- ---------- job checkpointing ----------
CREATE TABLE IF NOT EXISTS astro.jobs (
  job_id BIGSERIAL PRIMARY KEY,
  job_type TEXT NOT NULL,
  job_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  detail JSONB,
  error TEXT,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  UNIQUE(job_type, job_key)
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON astro.jobs(job_type, status);

-- ---------- aliases + text mentions ----------
CREATE TABLE IF NOT EXISTS astro.star_aliases (
  alias_id BIGSERIAL PRIMARY KEY,
  object_id INT REFERENCES astro.objects(object_id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  language TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(object_id, alias)
);

CREATE INDEX IF NOT EXISTS idx_alias_text ON astro.star_aliases(alias);

CREATE TABLE IF NOT EXISTS astro.text_mentions (
  mention_id BIGSERIAL PRIMARY KEY,
  object_id INT REFERENCES astro.objects(object_id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  language TEXT,
  urn TEXT NOT NULL,
  char_start INT,
  char_end INT,
  snippet TEXT,
  confidence DOUBLE PRECISION DEFAULT 0.5,
  method TEXT DEFAULT 'string_match',
  evidence JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(object_id, urn, char_start, char_end)
);

CREATE INDEX IF NOT EXISTS idx_mentions_object ON astro.text_mentions(object_id);
CREATE INDEX IF NOT EXISTS idx_mentions_urn ON astro.text_mentions(urn);
