#!/usr/bin/env python3
"""Upload computed data to Railway PostgreSQL"""
import os, json
import psycopg2
from psycopg2.extras import Json

db_url = os.environ.get('DATABASE_URL')
if not db_url:
    print("❌ DATABASE_URL not found")
    exit(1)

print(f"📡 Connecting to database...")
conn = psycopg2.connect(db_url)
cur = conn.cursor()

# Drop and recreate translator_profiles
print("📝 Creating translator_profiles table...")
cur.execute('DROP TABLE IF EXISTS translator_profiles CASCADE')
cur.execute('''CREATE TABLE translator_profiles (
    id SERIAL PRIMARY KEY, 
    translator_id VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(200), 
    total_words INTEGER, 
    style_vector JSONB,
    function_word_freqs JSONB, 
    vocabulary_richness JSONB,
    computation_date TIMESTAMP, 
    confidence_score FLOAT)''')

print("📤 Uploading translator profiles...")
with open('computed_data/translator_profiles.json') as f:
    profiles = json.load(f)
    for p in profiles:
        cur.execute(
            'INSERT INTO translator_profiles (translator_id, full_name, total_words, style_vector, function_word_freqs, vocabulary_richness, computation_date, confidence_score) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)',
            (p['translator_id'], p['full_name'], p['total_words'], Json(p['style_vector']), Json(p['function_word_freqs']), Json(p['vocabulary_richness']), p['computation_date'], p['confidence_score'])
        )
print(f"✅ Uploaded {len(profiles)} translator profiles")

# Drop and recreate author_fingerprints
print("📝 Creating author_fingerprints table...")
cur.execute('DROP TABLE IF EXISTS author_fingerprints CASCADE')
cur.execute('''CREATE TABLE author_fingerprints (
    id SERIAL PRIMARY KEY, 
    author_id VARCHAR(100) UNIQUE NOT NULL,
    author_name VARCHAR(200), 
    language VARCHAR(50), 
    total_words INTEGER,
    function_word_freqs JSONB, 
    sentence_stats JSONB, 
    vocabulary_richness JSONB,
    computation_date TIMESTAMP)''')

print("📤 Uploading author fingerprints...")
with open('computed_data/author_fingerprints.json') as f:
    fingerprints = json.load(f)
    for fp in fingerprints:
        cur.execute(
            'INSERT INTO author_fingerprints (author_id, author_name, language, total_words, function_word_freqs, sentence_stats, vocabulary_richness, computation_date) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)',
            (fp['author_id'], fp['author_name'], fp['language'], fp['total_words'], Json(fp['function_word_freqs']), Json(fp['sentence_stats']), Json(fp['vocabulary_richness']), fp['computation_date'])
        )
print(f"✅ Uploaded {len(fingerprints)} author fingerprints")

conn.commit()
cur.close()
conn.close()

print("\n🎉 DATABASE UPLOAD COMPLETE!")
print(f"   - {len(profiles)} translator profiles")
print(f"   - {len(fingerprints)} author fingerprints")
