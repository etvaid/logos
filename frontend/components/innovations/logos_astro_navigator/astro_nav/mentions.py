from __future__ import annotations
import re
import json
from typing import Optional
import yaml
from astro_nav.config import settings
from astro_nav import db

def _safe_like(s: str) -> str:
    return s.replace("%", "\\%").replace("_", "\\_")

async def load_aliases_from_yaml(path: str) -> int:
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    inserted = 0
    for item in data:
        object_key = str(item["object_key"])
        canonical_name = str(item.get("canonical_name", object_key))
        constellation = item.get("constellation", None)
        await db.execute("""
          INSERT INTO astro.objects(object_key, object_type, canonical_name, constellation)
          VALUES ($1,'star',$2,$3)
          ON CONFLICT (object_key) DO UPDATE SET canonical_name=EXCLUDED.canonical_name, updated_at=NOW()
        """, object_key, canonical_name, constellation)
        oid = await db.fetchval("SELECT object_id FROM astro.objects WHERE object_key=$1", object_key)
        for a in item.get("aliases", []):
            alias = str(a["text"]).strip()
            lang = str(a.get("language", "")).strip() or None
            src = str(a.get("source", "manual")).strip()
            if not alias:
                continue
            await db.execute("INSERT INTO astro.star_aliases(object_id, alias, language, source) VALUES ($1,$2,$3,$4) ON CONFLICT (object_id, alias) DO NOTHING", int(oid), alias, lang, src)
            inserted += 1
    print(f"Loaded {inserted} aliases into astro.star_aliases")
    return inserted

async def mine_mentions(limit_aliases: Optional[int] = None, per_alias_limit: int = 250) -> int:
    text_cfg = settings.logos_text
    allowlist = text_cfg.allowlist()
    alias_rows = await db.fetch(f"SELECT a.alias_id, a.alias, a.language, o.object_id FROM astro.star_aliases a JOIN astro.objects o ON o.object_id=a.object_id ORDER BY a.alias_id {f'LIMIT {int(limit_aliases)}' if limit_aliases else ''}")
    if not alias_rows:
        print("No aliases found. Load aliases first.")
        return 0
    total = 0
    for ar in alias_rows:
        alias, lang, object_id = str(ar["alias"]), ar["language"], int(ar["object_id"])
        where, args = [f"{text_cfg.content_col} ILIKE $1 ESCAPE '\\\\'"], [f"%{_safe_like(alias)}%"]
        if lang and text_cfg.lang_col:
            where.append(f"{text_cfg.lang_col} = ${len(args)+1}")
            args.append(lang)
        if allowlist and text_cfg.work_col:
            where.append(f"{text_cfg.work_col} = ANY(${len(args)+1})")
            args.append(allowlist)
        q = f"SELECT {text_cfg.urn_col} AS urn, {text_cfg.content_col} AS content FROM {text_cfg.table} WHERE {' AND '.join(where)} LIMIT {int(per_alias_limit)}"
        hits = await db.fetch(q, *args)
        for h in hits:
            urn, content = str(h["urn"]), str(h["content"] or "")
            m = re.search(re.escape(alias), content, flags=re.IGNORECASE)
            if not m:
                continue
            start, end = int(m.start()), int(m.end())
            snippet = content[max(0, start-80):min(len(content), end+120)]
            await db.execute("INSERT INTO astro.text_mentions(object_id, alias, language, urn, char_start, char_end, snippet, confidence, method, evidence) VALUES ($1,$2,$3,$4,$5,$6,$7,0.6,'string_match',$8::jsonb) ON CONFLICT (object_id, urn, char_start, char_end) DO NOTHING", object_id, alias, lang, urn, start, end, snippet, json.dumps({"pattern": "ILIKE"}))
            total += 1
        if hits:
            print(f"alias='{alias}' hits={len(hits)}")
    print(f"Total mentions stored: {total}")
    return total
