#!/usr/bin/env python3
"""
LOGOS Biblical Corpus Processor - FIXED v3
"""
import json
import asyncio
import aiohttp
import asyncpg
from pathlib import Path

GEMINI_KEY = "AIzaSyCWzAtEzVzfmlrSC18UePrHFwSR-rf9hKM"
DATABASE_URL = "postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway"
INPUT_FILE = "biblical_downloads/logos_biblical_batch.jsonl"

BATCH_SIZE = 10
DELAY = 1.0

async def get_embedding(session, text, sem):
    async with sem:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={GEMINI_KEY}"
        payload = {"model": "models/text-embedding-004", "content": {"parts": [{"text": text[:8000]}]}}
        try:
            async with session.post(url, json=payload) as r:
                if r.status == 200:
                    data = await r.json()
                    return data.get("embedding", {}).get("values", [])
        except Exception as e:
            print(f"    Embed error: {e}")
        return None

async def setup_table(conn):
    await conn.execute("DROP TABLE IF EXISTS biblical_passages CASCADE")
    await conn.execute("""
        CREATE TABLE biblical_passages (
            id SERIAL PRIMARY KEY,
            corpus TEXT,
            text_id TEXT,
            passage_num INTEGER,
            text TEXT,
            embedding vector(768),
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(corpus, text_id, passage_num)
        )
    """)
    print("✓ Table created fresh")

async def process():
    print("="*60)
    print("LOGOS BIBLICAL CORPUS PROCESSOR")
    print("="*60)
    
    passages = []
    with open(INPUT_FILE, 'r') as f:
        for line in f:
            try:
                passages.append(json.loads(line))
            except:
                pass
    print(f"Loaded {len(passages):,} passages")
    
    conn = await asyncpg.connect(DATABASE_URL)
    print("✓ Connected to Railway")
    await setup_table(conn)
    
    sem = asyncio.Semaphore(5)
    inserted = errors = 0
    
    async with aiohttp.ClientSession() as session:
        for i in range(0, len(passages), BATCH_SIZE):
            batch = passages[i:i+BATCH_SIZE]
            
            for p in batch:
                try:
                    text = p.get('request', {}).get('content', {}).get('parts', [{}])[0].get('text', '')
                    meta = p.get('metadata', {})
                    corpus = meta.get('corpus', 'biblical')
                    text_id = meta.get('text_id', 'unknown')
                    passage_num = meta.get('passage_num', 0)
                    
                    if not text:
                        continue
                    
                    embedding = await get_embedding(session, text, sem)
                    
                    if embedding:
                        # Convert list to pgvector string format: '[0.1, 0.2, ...]'
                        embedding_str = '[' + ','.join(str(x) for x in embedding) + ']'
                        
                        await conn.execute("""
                            INSERT INTO biblical_passages (corpus, text_id, passage_num, text, embedding)
                            VALUES ($1, $2, $3, $4, $5::vector)
                        """, corpus, text_id, passage_num, text[:10000], embedding_str)
                        inserted += 1
                    else:
                        errors += 1
                except Exception as e:
                    errors += 1
                    print(f"    Error: {e}")
            
            done = i + len(batch)
            print(f"  {done}/{len(passages)} ({100*done/len(passages):.1f}%) - Inserted: {inserted}")
            await asyncio.sleep(DELAY)
    
    await conn.close()
    print(f"\n{'='*60}")
    print(f"✓ COMPLETE: {inserted:,} inserted, {errors:,} errors")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(process())
