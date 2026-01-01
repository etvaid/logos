#!/usr/bin/env python3
"""
LOGOS BIBLICAL CORPUS DOWNLOADER - STANDALONE VERSION
=====================================================
Run this on YOUR computer (not Claude's restricted environment).

Usage:
    python download_biblical_corpora.py

Output:
    ./logos_corpora/  (all texts organized by corpus)
"""

import os
import sys
import json
import time
import re
from pathlib import Path
from datetime import datetime

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False
    from urllib.request import urlopen, Request
    from urllib.error import HTTPError, URLError

# Output directory (current directory)
OUTPUT_DIR = Path("./logos_corpora")

def fetch_url(url, retries=3, delay=1):
    """Fetch URL with retries"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    
    for attempt in range(retries):
        try:
            if HAS_REQUESTS:
                response = requests.get(url, headers=headers, timeout=30)
                response.raise_for_status()
                return response.text
            else:
                req = Request(url, headers=headers)
                with urlopen(req, timeout=30) as response:
                    return response.read().decode('utf-8', errors='replace')
        except Exception as e:
            print(f"    Attempt {attempt+1}/{retries} failed: {e}")
            if attempt < retries - 1:
                time.sleep(delay * (attempt + 1))
    return None

def extract_text(html):
    """Simple HTML to text extraction"""
    # Remove script and style
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL | re.IGNORECASE)
    
    # Convert block elements to newlines
    html = re.sub(r'<br\s*/?>', '\n', html, flags=re.IGNORECASE)
    html = re.sub(r'</(p|div|h[1-6]|li|tr)>', '\n', html, flags=re.IGNORECASE)
    html = re.sub(r'<(p|div|h[1-6])>', '\n', html, flags=re.IGNORECASE)
    
    # Remove all remaining tags
    html = re.sub(r'<[^>]+>', '', html)
    
    # Decode entities
    html = html.replace('&nbsp;', ' ')
    html = html.replace('&amp;', '&')
    html = html.replace('&lt;', '<')
    html = html.replace('&gt;', '>')
    html = html.replace('&quot;', '"')
    html = html.replace('&#39;', "'")
    
    # Clean whitespace
    html = re.sub(r'[ \t]+', ' ', html)
    html = re.sub(r'\n{3,}', '\n\n', html)
    html = html.strip()
    
    return html

def save_text(filepath, content, metadata=None):
    """Save text with metadata header"""
    filepath = Path(filepath)
    filepath.parent.mkdir(parents=True, exist_ok=True)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        if metadata:
            f.write("# " + "="*58 + "\n")
            f.write("# LOGOS CORPUS - METADATA\n")
            f.write("# " + "="*58 + "\n")
            for key, value in metadata.items():
                f.write(f"# {key}: {value}\n")
            f.write(f"# downloaded: {datetime.now().isoformat()}\n")
            f.write("# " + "="*58 + "\n\n")
        f.write(content)
    return True

def download_corpus(name, texts, output_subdir):
    """Download a corpus of texts"""
    print(f"\n{'='*60}")
    print(f"DOWNLOADING: {name}")
    print(f"{'='*60}")
    
    output_dir = OUTPUT_DIR / output_subdir
    output_dir.mkdir(parents=True, exist_ok=True)
    
    success = 0
    failed = []
    
    for text_id, url in texts.items():
        print(f"\n  [{success+1}/{len(texts)}] {text_id}")
        print(f"    URL: {url}")
        
        html = fetch_url(url)
        
        if html:
            text = extract_text(html)
            if len(text) > 100:  # Sanity check
                metadata = {
                    'corpus': name,
                    'text_id': text_id,
                    'source_url': url,
                }
                save_text(output_dir / f"{text_id}.txt", text, metadata)
                print(f"    ✓ Saved ({len(text):,} chars)")
                success += 1
            else:
                print(f"    ✗ Too short, skipping")
                failed.append(text_id)
        else:
            print(f"    ✗ Failed to download")
            failed.append(text_id)
        
        time.sleep(0.3)  # Rate limiting
    
    print(f"\n  Result: {success}/{len(texts)} downloaded")
    if failed:
        print(f"  Failed: {', '.join(failed)}")
    
    return success

# ============================================================
# CORPUS DEFINITIONS
# ============================================================

NAG_HAMMADI = {
    "prayer_apostle_paul": "https://gnosis.org/naghamm/pap.html",
    "apocryphon_james": "https://gnosis.org/naghamm/jam.html",
    "gospel_truth": "https://gnosis.org/naghamm/got.html",
    "treatise_resurrection": "https://gnosis.org/naghamm/res.html",
    "tripartite_tractate": "https://gnosis.org/naghamm/tripart.html",
    "apocryphon_john_long": "https://gnosis.org/naghamm/apocjn-long.html",
    "gospel_thomas": "https://gnosis.org/naghamm/gthlamb.html",
    "gospel_philip": "https://gnosis.org/naghamm/gop.html",
    "hypostasis_archons": "https://gnosis.org/naghamm/hypostas.html",
    "origin_world": "https://gnosis.org/naghamm/origin.html",
    "exegesis_soul": "https://gnosis.org/naghamm/exe.html",
    "book_thomas": "https://gnosis.org/naghamm/bookt.html",
    "apocryphon_john_short": "https://gnosis.org/naghamm/apocjn.html",
    "gospel_egyptians": "https://gnosis.org/naghamm/egygos.html",
    "eugnostos": "https://gnosis.org/naghamm/eugn.html",
    "sophia_jesus_christ": "https://gnosis.org/naghamm/sjc.html",
    "dialogue_savior": "https://gnosis.org/naghamm/dialog.html",
    "apocalypse_paul": "https://gnosis.org/naghamm/apocpaul.html",
    "first_apocalypse_james": "https://gnosis.org/naghamm/1ja.html",
    "second_apocalypse_james": "https://gnosis.org/naghamm/2ja.html",
    "apocalypse_adam": "https://gnosis.org/naghamm/adam.html",
    "acts_peter_twelve": "https://gnosis.org/naghamm/actpet12.html",
    "thunder_perfect_mind": "https://gnosis.org/naghamm/thunder.html",
    "authoritative_teaching": "https://gnosis.org/naghamm/autho.html",
    "concept_great_power": "https://gnosis.org/naghamm/concept.html",
    "discourse_eighth_ninth": "https://gnosis.org/naghamm/disco.html",
    "prayer_thanksgiving": "https://gnosis.org/naghamm/pray.html",
    "asclepius": "https://gnosis.org/naghamm/asclep.html",
    "paraphrase_shem": "https://gnosis.org/naghamm/parashem.html",
    "second_treatise_seth": "https://gnosis.org/naghamm/2seth.html",
    "apocalypse_peter_gnostic": "https://gnosis.org/naghamm/apocpet.html",
    "teachings_silvanus": "https://gnosis.org/naghamm/silvanus.html",
    "three_steles_seth": "https://gnosis.org/naghamm/3steles.html",
    "zostrianos": "https://gnosis.org/naghamm/zost.html",
    "letter_peter_philip": "https://gnosis.org/naghamm/peter-phil.html",
    "melchizedek": "https://gnosis.org/naghamm/melchiz.html",
    "thought_norea": "https://gnosis.org/naghamm/norea.html",
    "testimony_truth": "https://gnosis.org/naghamm/testim.html",
    "marsanes": "https://gnosis.org/naghamm/marsanes.html",
    "interpretation_knowledge": "https://gnosis.org/naghamm/intknow.html",
    "valentinian_exposition": "https://gnosis.org/naghamm/valexp.html",
    "allogenes": "https://gnosis.org/naghamm/allog.html",
    "hypsiphrone": "https://gnosis.org/naghamm/hypsiph.html",
    "sentences_sextus": "https://gnosis.org/naghamm/sextus.html",
    "trimorphic_protennoia": "https://gnosis.org/naghamm/trimorph.html",
}

APOSTOLIC_FATHERS = {
    "1_clement": "https://www.earlychristianwritings.com/text/1clement-lightfoot.html",
    "2_clement": "https://www.earlychristianwritings.com/text/2clement-lightfoot.html",
    "didache": "https://www.earlychristianwritings.com/text/didache-roberts.html",
    "barnabas": "https://www.earlychristianwritings.com/text/barnabas-lightfoot.html",
    "shepherd_hermas": "https://www.earlychristianwritings.com/text/shepherd-lightfoot.html",
    "ignatius_ephesians": "https://www.earlychristianwritings.com/text/ignatius-ephesians-lightfoot.html",
    "ignatius_magnesians": "https://www.earlychristianwritings.com/text/ignatius-magnesians-lightfoot.html",
    "ignatius_trallians": "https://www.earlychristianwritings.com/text/ignatius-trallians-lightfoot.html",
    "ignatius_romans": "https://www.earlychristianwritings.com/text/ignatius-romans-lightfoot.html",
    "ignatius_philadelphians": "https://www.earlychristianwritings.com/text/ignatius-philadelphians-lightfoot.html",
    "ignatius_smyrnaeans": "https://www.earlychristianwritings.com/text/ignatius-smyrnaeans-lightfoot.html",
    "ignatius_polycarp": "https://www.earlychristianwritings.com/text/ignatius-polycarp-lightfoot.html",
    "polycarp_philippians": "https://www.earlychristianwritings.com/text/polycarp-lightfoot.html",
    "martyrdom_polycarp": "https://www.earlychristianwritings.com/text/martyrdompolycarp-lightfoot.html",
    "diognetus": "https://www.earlychristianwritings.com/text/diognetus-lightfoot.html",
    "papias": "https://www.earlychristianwritings.com/text/papias-lightfoot.html",
}

NT_APOCRYPHA = {
    "gospel_peter": "https://www.earlychristianwritings.com/text/gospelpeter-brown.html",
    "infancy_thomas": "https://www.earlychristianwritings.com/text/infancythomas-b-roberts.html",
    "protevangelium_james": "https://www.earlychristianwritings.com/text/infancyjames-roberts.html",
    "gospel_nicodemus": "https://www.earlychristianwritings.com/text/gospelnicodemus.html",
    "gospel_hebrews_fragments": "https://www.earlychristianwritings.com/text/gospelhebrews-ogg.html",
    "gospel_ebionites_fragments": "https://www.earlychristianwritings.com/text/gospelebionites.html",
    "gospel_nazarenes_fragments": "https://www.earlychristianwritings.com/text/gospelnazoreans.html",
    "egerton_gospel": "https://www.earlychristianwritings.com/text/egerton.html",
    "secret_mark": "https://www.earlychristianwritings.com/text/secretmark.html",
    "acts_paul_thecla": "https://www.earlychristianwritings.com/text/actspaul.html",
    "acts_peter": "https://www.earlychristianwritings.com/text/actspeter.html",
    "acts_john": "https://www.earlychristianwritings.com/text/actsjohn.html",
    "acts_andrew": "https://www.earlychristianwritings.com/text/actsandrew.html",
    "acts_thomas": "https://www.earlychristianwritings.com/text/actsthomas.html",
    "3_corinthians": "https://www.earlychristianwritings.com/text/3corinthians.html",
    "epistle_apostles": "https://www.earlychristianwritings.com/text/epistleapostles.html",
    "laodiceans": "https://www.earlychristianwritings.com/text/laodiceans.html",
    "apocalypse_peter": "https://www.earlychristianwritings.com/text/apocalypsepeter-mrjames.html",
    "apocalypse_paul_christian": "https://www.earlychristianwritings.com/text/apocalypsepaul.html",
    "ascension_isaiah": "https://www.earlychristianwritings.com/text/ascensionisaiah.html",
    "odes_solomon": "https://www.earlychristianwritings.com/text/odes.html",
    "psalms_solomon": "https://www.earlychristianwritings.com/text/psalmsolomon.html",
}

DEAD_SEA_SCROLLS = {
    "community_rule_1qs": "https://www.earlyjewishwritings.com/text/communitymanual.html",
    "damascus_document": "https://www.earlyjewishwritings.com/text/damascusdocument.html",
    "war_scroll_1qm": "https://www.earlyjewishwritings.com/text/warscroll.html",
    "thanksgiving_hymns_1qh": "https://www.earlyjewishwritings.com/text/thanksgivingscroll.html",
    "temple_scroll": "https://www.earlyjewishwritings.com/text/templescroll.html",
    "messianic_rule": "https://www.earlyjewishwritings.com/text/messianicrule.html",
    "habakkuk_pesher": "https://www.earlyjewishwritings.com/text/habakkukpesher.html",
    "nahum_pesher": "https://www.earlyjewishwritings.com/text/nahumpesher.html",
    "psalm37_pesher": "https://www.earlyjewishwritings.com/text/psalm37pesher.html",
    "copper_scroll": "https://www.earlyjewishwritings.com/text/copperscroll.html",
    "genesis_apocryphon": "https://www.earlyjewishwritings.com/text/genesisapocryphon.html",
    "book_giants": "https://www.earlyjewishwritings.com/text/bookgiants.html",
    "melchizedek_11q13": "https://www.earlyjewishwritings.com/text/melchizedek.html",
    "new_jerusalem": "https://www.earlyjewishwritings.com/text/newjerusalem.html",
    "songs_sabbath": "https://www.earlyjewishwritings.com/text/songsabbath.html",
}

OT_PSEUDEPIGRAPHA = {
    "1_enoch": "https://www.earlyjewishwritings.com/text/1enoch.html",
    "2_enoch": "https://www.earlyjewishwritings.com/text/2enoch.html",
    "jubilees": "https://www.earlyjewishwritings.com/text/jubilees.html",
    "testament_12_patriarchs": "https://www.earlyjewishwritings.com/text/testaments.html",
    "assumption_moses": "https://www.earlyjewishwritings.com/text/testmoses.html",
    "4_ezra": "https://www.earlyjewishwritings.com/text/4ezra.html",
    "2_baruch": "https://www.earlyjewishwritings.com/text/2baruch.html",
    "3_baruch": "https://www.earlyjewishwritings.com/text/3baruch.html",
    "4_baruch": "https://www.earlyjewishwritings.com/text/4baruch.html",
    "apocalypse_abraham": "https://www.earlyjewishwritings.com/text/apocabraham.html",
    "testament_abraham": "https://www.earlyjewishwritings.com/text/testabraham.html",
    "testament_job": "https://www.earlyjewishwritings.com/text/testjob.html",
    "testament_solomon": "https://www.earlyjewishwritings.com/text/testsolomon.html",
    "life_adam_eve": "https://www.earlyjewishwritings.com/text/lifeofadam.html",
    "ladder_jacob": "https://www.earlyjewishwritings.com/text/ladderjacob.html",
    "joseph_aseneth": "https://www.earlyjewishwritings.com/text/josephaseneth.html",
    "letter_aristeas": "https://www.earlyjewishwritings.com/text/aristeas.html",
    "3_maccabees": "https://www.earlyjewishwritings.com/text/3maccabees.html",
    "4_maccabees": "https://www.earlyjewishwritings.com/text/4maccabees.html",
}

OTHER_GNOSTIC = {
    "gospel_mary_berlin": "https://gnosis.org/library/marygosp.htm",
    "pistis_sophia_excerpts": "https://gnosis.org/library/pistis-sophia/ps001.htm",
    "hymn_pearl": "https://gnosis.org/library/hymnpearl.htm",
    "hymn_robe_glory": "https://gnosis.org/library/gnostic/hymnrobe.htm",
    "gospel_judas": "https://gnosis.org/library/judas.htm",
}

HERMETIC = {
    "poimandres": "https://gnosis.org/library/hermes1.htm",
    "corpus_hermeticum_excerpts": "https://gnosis.org/library/grs-mead/TGH-v2/th201.html",
    "emerald_tablet": "https://gnosis.org/library/emerald.htm",
}

# ============================================================
# MAIN
# ============================================================

def create_manifest():
    """Create summary manifest"""
    manifest = {
        'created': datetime.now().isoformat(),
        'corpora': {}
    }
    
    for corpus_dir in OUTPUT_DIR.iterdir():
        if corpus_dir.is_dir():
            files = list(corpus_dir.glob("*.txt"))
            manifest['corpora'][corpus_dir.name] = {
                'count': len(files),
                'files': sorted([f.name for f in files])
            }
    
    with open(OUTPUT_DIR / "manifest.json", 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"\n✓ Manifest saved: {OUTPUT_DIR / 'manifest.json'}")

def main():
    print("="*60)
    print("LOGOS BIBLICAL CORPUS DOWNLOADER")
    print("="*60)
    print(f"\nOutput: {OUTPUT_DIR.absolute()}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    if not HAS_REQUESTS:
        print("\n⚠ Note: 'requests' not installed, using urllib")
        print("  For better performance: pip install requests")
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    results = {}
    
    # Download all corpora
    results['nag_hammadi'] = download_corpus(
        "Nag Hammadi Library", NAG_HAMMADI, "nag_hammadi")
    
    results['apostolic_fathers'] = download_corpus(
        "Apostolic Fathers", APOSTOLIC_FATHERS, "apostolic_fathers")
    
    results['nt_apocrypha'] = download_corpus(
        "NT Apocrypha", NT_APOCRYPHA, "nt_apocrypha")
    
    results['dead_sea_scrolls'] = download_corpus(
        "Dead Sea Scrolls", DEAD_SEA_SCROLLS, "dead_sea_scrolls")
    
    results['ot_pseudepigrapha'] = download_corpus(
        "OT Pseudepigrapha", OT_PSEUDEPIGRAPHA, "ot_pseudepigrapha")
    
    results['other_gnostic'] = download_corpus(
        "Other Gnostic Texts", OTHER_GNOSTIC, "other_gnostic")
    
    results['hermetic'] = download_corpus(
        "Hermetic Texts", HERMETIC, "hermetic")
    
    # Create manifest
    create_manifest()
    
    # Summary
    print("\n" + "="*60)
    print("DOWNLOAD COMPLETE")
    print("="*60)
    
    total = 0
    for corpus, count in results.items():
        print(f"  {corpus:25} {count:3} texts")
        total += count
    
    print(f"  {'-'*35}")
    print(f"  {'TOTAL':25} {total:3} texts")
    print(f"\n  Output: {OUTPUT_DIR.absolute()}")
    print(f"\nNext step: Upload logos_corpora/ folder to LOGOS for processing")

if __name__ == "__main__":
    main()
