#!/usr/bin/env python3
"""Fixed downloader - disables SSL verification for gnosis.org"""
import os
import re
import time
import ssl
import urllib.request

# Disable SSL verification for gnosis.org
ssl._create_default_https_context = ssl._create_unverified_context

OUTPUT_DIR = "logos_corpora"

NAG_HAMMADI = {
    "prayer_apostle_paul": "https://gnosis.org/naghamm/pap.html",
    "apocryphon_james": "https://gnosis.org/naghamm/jam.html",
    "gospel_truth": "https://gnosis.org/naghamm/got.html",
    "treatise_resurrection": "https://gnosis.org/naghamm/res.html",
    "apocryphon_john_long": "https://gnosis.org/naghamm/apocjn-long.html",
    "gospel_thomas": "https://gnosis.org/naghamm/gthlamb.html",
    "gospel_philip": "https://gnosis.org/naghamm/gop.html",
    "hypostasis_archons": "https://gnosis.org/naghamm/hypostas.html",
    "origin_world": "https://gnosis.org/naghamm/origin.html",
    "exegesis_soul": "https://gnosis.org/naghamm/exe.html",
    "book_thomas": "https://gnosis.org/naghamm/bookt.html",
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
    "trimorphic_protennoia": "https://gnosis.org/naghamm/trimorph.html",
}

OTHER_GNOSTIC = {
    "gospel_mary": "https://gnosis.org/library/marygosp.htm",
    "gospel_judas": "https://gnosis.org/library/judas.htm",
    "hymn_pearl": "https://gnosis.org/library/hymnpearl.htm",
    "poimandres": "https://gnosis.org/library/hermes1.htm",
}

def fetch(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read().decode('utf-8', errors='replace')
    except Exception as e:
        print(f"    Error: {e}")
        return None

def extract_text(html):
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL|re.I)
    html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL|re.I)
    html = re.sub(r'<br\s*/?>', '\n', html, flags=re.I)
    html = re.sub(r'</(p|div|h[1-6])>', '\n', html, flags=re.I)
    html = re.sub(r'<[^>]+>', '', html)
    html = html.replace('&nbsp;', ' ').replace('&amp;', '&')
    html = re.sub(r'\n{3,}', '\n\n', html)
    return html.strip()

def download_corpus(name, texts, subdir):
    print(f"\n{'='*60}")
    print(f"DOWNLOADING: {name}")
    print(f"{'='*60}")
    
    out_dir = f"{OUTPUT_DIR}/{subdir}"
    os.makedirs(out_dir, exist_ok=True)
    
    success = 0
    for text_id, url in texts.items():
        print(f"\n  [{success+1}/{len(texts)}] {text_id}")
        
        html = fetch(url)
        if html:
            text = extract_text(html)
            if len(text) > 100:
                with open(f"{out_dir}/{text_id}.txt", 'w') as f:
                    f.write(f"# Source: {url}\n# Text: {text_id}\n\n{text}")
                print(f"    ✓ Saved ({len(text):,} chars)")
                success += 1
            else:
                print(f"    ✗ Too short")
        else:
            print(f"    ✗ Failed")
        
        time.sleep(0.3)
    
    print(f"\n  Result: {success}/{len(texts)}")
    return success

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    total = 0
    total += download_corpus("Nag Hammadi Library", NAG_HAMMADI, "nag_hammadi")
    total += download_corpus("Other Gnostic", OTHER_GNOSTIC, "other_gnostic")
    
    print(f"\n{'='*60}")
    print(f"TOTAL NEW DOWNLOADS: {total}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
