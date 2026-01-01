-- LOGOS Translator Profiles Import
-- Generated: 2025-12-30T04:06:36.934180
-- ALL VALUES COMPUTED FROM CORPUS - NO HARDCODING

BEGIN;

-- Clear existing computed profiles
DELETE FROM translator_profiles WHERE computation_date IS NOT NULL;


COMMIT;
