#!/usr/bin/env python3
import os, asyncio, aiohttp
from pathlib import Path
from datetime import datetime

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

async def call_gpt(session, prompt, system=""):
    messages = []
    if system: messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    async with session.post("https://api.openai.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
        json={"model": "gpt-4o-mini", "messages": messages, "max_tokens": 4000}) as r:
        if r.status != 200: return f"[Error {r.status}]"
        return (await r.json())["choices"][0]["message"]["content"]

async def main():
    print("📚 SPECTACULAR DOCS GENERATOR - GPT-4 POWERED\n")
    docs = Path("docs")
    docs.mkdir(exist_ok=True)
    (docs/"tutorials").mkdir(exist_ok=True)
    
    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=120)) as s:
        print("📖 Generating User Manual...")
        manual = await call_gpt(s, "Create a comprehensive 3000+ word User Manual for LOGOS SPECTACULAR, a classical Greek/Latin scholarship platform with sections: Semantia (semantic analysis), Chronos (temporal word drift), Reader, Discovery (AI research), Connectome (500K connections), Translation, Forensic (stylometry), Atlas (maps). Include: Introduction, Getting Started, all 8 sections explained, Advanced Features, Troubleshooting. Make it exquisite with examples.", "You are a world-class technical writer.")
        (docs/"USER_MANUAL.md").write_text(manual)
        print(f"   ✅ USER_MANUAL.md ({len(manual)} chars)")
        
        print("🚀 Generating Quick Start...")
        qs = await call_gpt(s, "Create a Quick Start Guide for LOGOS SPECTACULAR that gets users productive in 5 minutes. Include: Launch, Pick a Text, Explore Semantia, Ask AI Research Question. Make it exciting with emojis.")
        (docs/"QUICK_START.md").write_text(qs)
        print(f"   ✅ QUICK_START.md ({len(qs)} chars)")
        
        print("❓ Generating FAQ...")
        faq = await call_gpt(s, "Create a comprehensive FAQ (50+ questions) for LOGOS SPECTACULAR covering: General, Getting Started, Features (Semantia, Chronos, Discovery, Connectome, Translation, Forensic, Atlas), Technical, Advanced usage.")
        (docs/"FAQ.md").write_text(faq)
        print(f"   ✅ FAQ.md ({len(faq)} chars)")
        
        print("🔌 Generating API Reference...")
        api = await call_gpt(s, "Create API documentation for LOGOS SPECTACULAR with endpoints for: /api/semantia/*, /api/chronos/*, /api/reader/*, /api/discovery/*, /api/connectome/*, /api/translation/*, /api/forensic/*, /api/atlas/*. Include examples, data types, error codes.")
        (docs/"API_REFERENCE.md").write_text(api)
        print(f"   ✅ API_REFERENCE.md ({len(api)} chars)")
        
        sections = [("semantia","Semantia"),("chronos","Chronos"),("reader","Reader"),("discovery","Discovery"),("connectome","Connectome"),("translation","Translation"),("forensic","Forensic"),("atlas","Atlas")]
        print("🎓 Generating Tutorials...")
        for sid, name in sections:
            tut = await call_gpt(s, f"Create a step-by-step tutorial for using {name} in LOGOS SPECTACULAR. Include: Overview, Prerequisites, 5 guided steps with examples, Summary, Practice exercises.")
            (docs/"tutorials"/f"tutorial_{sid}.md").write_text(tut)
            print(f"   ✅ tutorial_{sid}.md ({len(tut)} chars)")
    
    print(f"\n✅ COMPLETE! Generated {4 + len(sections)} documentation files in docs/")

if __name__ == "__main__":
    asyncio.run(main())
