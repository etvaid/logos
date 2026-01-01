#!/usr/bin/env python3
"""
LOGOS CORPUS DOWNLOADER
=======================
Downloads all biblical and religious texts for LOGOS analysis.

Corpora:
1. Nag Hammadi Library (52 Gnostic texts)
2. Gospel of Thomas (standalone)
3. Apostolic Fathers
4. NT Apocrypha
5. Dead Sea Scrolls (available transcriptions)
6. Didache
7. Other early Christian texts

Output: Structured directories with texts ready for LOGOS ingestion
"""

import os
import sys
import json
import time
import re
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import HTTPError, URLError
from html.parser import HTMLParser
from datetime import datetime

# Base output directory
OUTPUT_DIR = Path("/mnt/user-data/outputs/logos_corpora")

class TextExtractor(HTMLParser):
    """Extract text from HTML"""
    def __init__(self):
        super().__init__()
        self.text = []
        self.in_body = False
        self.skip_tags = {'script', 'style', 'nav', 'header', 'footer'}
        self.current_tag = None
        
    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        if tag == 'body':
            self.in_body = True
        if tag in ('p', 'br', 'div', 'h1', 'h2', 'h3', 'h4'):
            self.text.append('\n')
            
    def handle_endtag(self, tag):
        if tag == 'body':
            self.in_body = False
        if tag in ('p', 'div', 'h1', 'h2', 'h3', 'h4'):
            self.text.append('\n')
            
    def handle_data(self, data):
        if self.in_body and self.current_tag not in self.skip_tags:
            self.text.append(data)
            
    def get_text(self):
        return ''.join(self.text).strip()

def fetch_url(url, retries=3, delay=1):
    """Fetch URL with retries and rate limiting"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; LOGOS-Corpus-Builder/1.0)'
    }
    
    for attempt in range(retries):
        try:
            req = Request(url, headers=headers)
            with urlopen(req, timeout=30) as response:
                return response.read().decode('utf-8', errors='replace')
        except (HTTPError, URLError) as e:
            print(f"  Attempt {attempt+1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(delay * (attempt + 1))
    return None

def save_text(filepath, content, metadata=None):
    """Save text with optional metadata"""
    filepath = Path(filepath)
    filepath.parent.mkdir(parents=True, exist_ok=True)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        if metadata:
            f.write(f"# METADATA\n")
            for key, value in metadata.items():
                f.write(f"# {key}: {value}\n")
            f.write(f"# Downloaded: {datetime.now().isoformat()}\n")
            f.write("#" + "="*60 + "\n\n")
        f.write(content)
    
    print(f"  Saved: {filepath}")

def extract_text_from_html(html):
    """Extract clean text from HTML"""
    parser = TextExtractor()
    parser.feed(html)
    text = parser.get_text()
    # Clean up multiple newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text

# ============================================================
# NAG HAMMADI LIBRARY
# ============================================================

NAG_HAMMADI_TEXTS = {
    # Codex I (Jung Codex)
    "prayer_apostle_paul": "https://gnosis.org/naghamm/pap.html",
    "apocryphon_james": "https://gnosis.org/naghamm/jam.html",
    "gospel_truth": "https://gnosis.org/naghamm/got.html",
    "treatise_resurrection": "https://gnosis.org/naghamm/res.html",
    "tripartite_tractate": "https://gnosis.org/naghamm/tripart.html",
    
    # Codex II
    "apocryphon_john_long": "https://gnosis.org/naghamm/apocjn-long.html",
    "gospel_thomas": "https://gnosis.org/naghamm/gthlamb.html",
    "gospel_philip": "https://gnosis.org/naghamm/gop.html",
    "hypostasis_archons": "https://gnosis.org/naghamm/hypostas.html",
    "origin_world": "https://gnosis.org/naghamm/origin.html",
    "exegesis_soul": "https://gnosis.org/naghamm/exe.html",
    "book_thomas": "https://gnosis.org/naghamm/bookt.html",
    
    # Codex III
    "apocryphon_john_short": "https://gnosis.org/naghamm/apocjn.html",
    "gospel_egyptians_iii": "https://gnosis.org/naghamm/egygos.html",
    "eugnostos": "https://gnosis.org/naghamm/eugn.html",
    "sophia_jesus_christ": "https://gnosis.org/naghamm/sjc.html",
    "dialogue_savior": "https://gnosis.org/naghamm/dialog.html",
    
    # Codex IV
    "apocryphon_john_iv": "https://gnosis.org/naghamm/apocjn-short.html",
    "gospel_egyptians_iv": "https://gnosis.org/naghamm/egygos-short.html",
    
    # Codex V
    "eugnostos_v": "https://gnosis.org/naghamm/eugnostos.html",
    "apocalypse_paul": "https://gnosis.org/naghamm/apocpaul.html",
    "first_apocalypse_james": "https://gnosis.org/naghamm/1ja.html",
    "second_apocalypse_james": "https://gnosis.org/naghamm/2ja.html",
    "apocalypse_adam": "https://gnosis.org/naghamm/adam.html",
    
    # Codex VI
    "acts_peter_twelve": "https://gnosis.org/naghamm/actpet12.html",
    "thunder_perfect_mind": "https://gnosis.org/naghamm/thunder.html",
    "authoritative_teaching": "https://gnosis.org/naghamm/autho.html",
    "concept_great_power": "https://gnosis.org/naghamm/concept.html",
    "plato_republic": "https://gnosis.org/naghamm/repub.html",
    "discourse_eighth_ninth": "https://gnosis.org/naghamm/disco.html",
    "prayer_thanksgiving": "https://gnosis.org/naghamm/pray.html",
    "asclepius": "https://gnosis.org/naghamm/asclep.html",
    
    # Codex VII
    "paraphrase_shem": "https://gnosis.org/naghamm/parashem.html",
    "second_treatise_seth": "https://gnosis.org/naghamm/2seth.html",
    "apocalypse_peter": "https://gnosis.org/naghamm/apocpet.html",
    "teachings_silvanus": "https://gnosis.org/naghamm/silvanus.html",
    "three_steles_seth": "https://gnosis.org/naghamm/3steles.html",
    
    # Codex VIII
    "zostrianos": "https://gnosis.org/naghamm/zost.html",
    "letter_peter_philip": "https://gnosis.org/naghamm/peter-phil.html",
    
    # Codex IX
    "melchizedek": "https://gnosis.org/naghamm/melchiz.html",
    "thought_norea": "https://gnosis.org/naghamm/norea.html",
    "testimony_truth": "https://gnosis.org/naghamm/testim.html",
    
    # Codex X
    "marsanes": "https://gnosis.org/naghamm/marsanes.html",
    
    # Codex XI
    "interpretation_knowledge": "https://gnosis.org/naghamm/intknow.html",
    "valentinian_exposition": "https://gnosis.org/naghamm/valexp.html",
    "allogenes": "https://gnosis.org/naghamm/allog.html",
    "hypsiphrone": "https://gnosis.org/naghamm/hypsiph.html",
    
    # Codex XII
    "sentences_sextus": "https://gnosis.org/naghamm/sextus.html",
    "gospel_truth_xii": "https://gnosis.org/naghamm/got-frag.html",
    
    # Codex XIII
    "trimorphic_protennoia": "https://gnosis.org/naghamm/trimorph.html",
    "on_origin_world_xiii": "https://gnosis.org/naghamm/origin-short.html",
}

def download_nag_hammadi():
    """Download all Nag Hammadi texts"""
    print("\n" + "="*60)
    print("DOWNLOADING NAG HAMMADI LIBRARY")
    print("="*60)
    
    output_dir = OUTPUT_DIR / "nag_hammadi"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    
    for name, url in NAG_HAMMADI_TEXTS.items():
        print(f"\nFetching: {name}")
        html = fetch_url(url)
        
        if html:
            text = extract_text_from_html(html)
            metadata = {
                'corpus': 'Nag Hammadi Library',
                'text_id': name,
                'source_url': url,
                'language': 'English (translated from Coptic)',
            }
            save_text(output_dir / f"{name}.txt", text, metadata)
            success_count += 1
        else:
            print(f"  FAILED: {name}")
        
        time.sleep(0.5)  # Rate limiting
    
    print(f"\nNag Hammadi: {success_count}/{len(NAG_HAMMADI_TEXTS)} texts downloaded")
    return success_count

# ============================================================
# APOSTOLIC FATHERS
# ============================================================

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

def download_apostolic_fathers():
    """Download Apostolic Fathers"""
    print("\n" + "="*60)
    print("DOWNLOADING APOSTOLIC FATHERS")
    print("="*60)
    
    output_dir = OUTPUT_DIR / "apostolic_fathers"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    
    for name, url in APOSTOLIC_FATHERS.items():
        print(f"\nFetching: {name}")
        html = fetch_url(url)
        
        if html:
            text = extract_text_from_html(html)
            metadata = {
                'corpus': 'Apostolic Fathers',
                'text_id': name,
                'source_url': url,
                'language': 'English (translated from Greek)',
            }
            save_text(output_dir / f"{name}.txt", text, metadata)
            success_count += 1
        else:
            print(f"  FAILED: {name}")
        
        time.sleep(0.5)
    
    print(f"\nApostolic Fathers: {success_count}/{len(APOSTOLIC_FATHERS)} texts downloaded")
    return success_count

# ============================================================
# NT APOCRYPHA
# ============================================================

NT_APOCRYPHA = {
    # Gospels
    "gospel_peter": "https://www.earlychristianwritings.com/text/gospelpeter-brown.html",
    "gospel_mary": "https://gnosis.org/library/marygosp.htm",
    "gospel_judas": "https://gnosis.org/library/judas.htm",
    "infancy_thomas": "https://www.earlychristianwritings.com/text/infancythomas-b-roberts.html",
    "protevangelium_james": "https://www.earlychristianwritings.com/text/infancyjames-roberts.html",
    "gospel_nicodemus": "https://www.earlychristianwritings.com/text/gospelnicodemus.html",
    "gospel_hebrews_fragments": "https://www.earlychristianwritings.com/text/gospelhebrews-ogg.html",
    "gospel_ebionites_fragments": "https://www.earlychristianwritings.com/text/gospelebionites.html",
    "gospel_nazarenes_fragments": "https://www.earlychristianwritings.com/text/gospelnazoreans.html",
    "egerton_gospel": "https://www.earlychristianwritings.com/text/egerton.html",
    "secret_mark": "https://www.earlychristianwritings.com/text/secretmark.html",
    
    # Acts
    "acts_paul_thecla": "https://www.earlychristianwritings.com/text/actspaul.html",
    "acts_peter": "https://www.earlychristianwritings.com/text/actspeter.html",
    "acts_john": "https://www.earlychristianwritings.com/text/actsjohn.html",
    "acts_andrew": "https://www.earlychristianwritings.com/text/actsandrew.html",
    "acts_thomas": "https://www.earlychristianwritings.com/text/actsthomas.html",
    
    # Epistles
    "3_corinthians": "https://www.earlychristianwritings.com/text/3corinthians.html",
    "epistle_apostles": "https://www.earlychristianwritings.com/text/epistleapostles.html",
    "laodiceans": "https://www.earlychristianwritings.com/text/laodiceans.html",
    "correspondence_paul_seneca": "https://www.earlychristianwritings.com/text/seneca.html",
    
    # Apocalypses
    "apocalypse_peter": "https://www.earlychristianwritings.com/text/apocalypsepeter-mrjames.html",
    "apocalypse_paul": "https://www.earlychristianwritings.com/text/apocalypsepaul.html",
    "ascension_isaiah": "https://www.earlychristianwritings.com/text/ascensionisaiah.html",
    "sibylline_oracles": "https://www.earlychristianwritings.com/text/sibylline.html",
    
    # Other
    "odes_solomon": "https://www.earlychristianwritings.com/text/odes.html",
    "psalms_solomon": "https://www.earlychristianwritings.com/text/psalmsolomon.html",
}

def download_nt_apocrypha():
    """Download NT Apocrypha"""
    print("\n" + "="*60)
    print("DOWNLOADING NT APOCRYPHA")
    print("="*60)
    
    output_dir = OUTPUT_DIR / "nt_apocrypha"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    
    for name, url in NT_APOCRYPHA.items():
        print(f"\nFetching: {name}")
        html = fetch_url(url)
        
        if html:
            text = extract_text_from_html(html)
            metadata = {
                'corpus': 'NT Apocrypha',
                'text_id': name,
                'source_url': url,
                'language': 'English (translated)',
            }
            save_text(output_dir / f"{name}.txt", text, metadata)
            success_count += 1
        else:
            print(f"  FAILED: {name}")
        
        time.sleep(0.5)
    
    print(f"\nNT Apocrypha: {success_count}/{len(NT_APOCRYPHA)} texts downloaded")
    return success_count

# ============================================================
# OTHER GNOSTIC TEXTS (Berlin Codex, etc.)
# ============================================================

OTHER_GNOSTIC = {
    "gospel_mary_berlin": "https://gnosis.org/library/marygosp.htm",
    "apocryphon_john_berlin": "https://gnosis.org/library/apocjn.htm",
    "sophia_jesus_berlin": "https://gnosis.org/library/sjc.htm",
    "act_peter_berlin": "https://gnosis.org/library/actpet.htm",
    "pistis_sophia": "https://gnosis.org/library/pistis-sophia/ps-index.htm",
    "books_jeu": "https://gnosis.org/library/1jeu.htm",
    "untitled_bruce": "https://gnosis.org/library/untitled.htm",
    "mandaean_john": "https://gnosis.org/library/haran.htm",
    "hymn_pearl": "https://gnosis.org/library/hymnpearl.htm",
    "hymn_robe": "https://gnosis.org/library/hymnrobe.htm",
}

def download_other_gnostic():
    """Download other Gnostic texts"""
    print("\n" + "="*60)
    print("DOWNLOADING OTHER GNOSTIC TEXTS")
    print("="*60)
    
    output_dir = OUTPUT_DIR / "other_gnostic"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    
    for name, url in OTHER_GNOSTIC.items():
        print(f"\nFetching: {name}")
        html = fetch_url(url)
        
        if html:
            text = extract_text_from_html(html)
            metadata = {
                'corpus': 'Other Gnostic Texts',
                'text_id': name,
                'source_url': url,
                'language': 'English (translated)',
            }
            save_text(output_dir / f"{name}.txt", text, metadata)
            success_count += 1
        else:
            print(f"  FAILED: {name}")
        
        time.sleep(0.5)
    
    print(f"\nOther Gnostic: {success_count}/{len(OTHER_GNOSTIC)} texts downloaded")
    return success_count

# ============================================================
# DEAD SEA SCROLLS (available online texts)
# ============================================================

DSS_TEXTS = {
    # Community texts
    "community_rule_1qs": "https://www.earlyjewishwritings.com/text/communitymanual.html",
    "damascus_document": "https://www.earlyjewishwritings.com/text/damascusdocument.html",
    "war_scroll_1qm": "https://www.earlyjewishwritings.com/text/warscroll.html",
    "thanksgiving_hymns_1qh": "https://www.earlyjewishwritings.com/text/thanksgivingscroll.html",
    "temple_scroll": "https://www.earlyjewishwritings.com/text/templescroll.html",
    "messianic_rule": "https://www.earlyjewishwritings.com/text/messianicrule.html",
    
    # Pesharim (commentaries)
    "habakkuk_pesher": "https://www.earlyjewishwritings.com/text/habakkukpesher.html",
    "nahum_pesher": "https://www.earlyjewishwritings.com/text/nahumpesher.html",
    "psalm37_pesher": "https://www.earlyjewishwritings.com/text/psalm37pesher.html",
    
    # Other
    "copper_scroll": "https://www.earlyjewishwritings.com/text/copperscroll.html",
    "genesis_apocryphon": "https://www.earlyjewishwritings.com/text/genesisapocryphon.html",
    "book_giants": "https://www.earlyjewishwritings.com/text/bookgiants.html",
    "melchizedek_11q13": "https://www.earlyjewishwritings.com/text/melchizedek.html",
    "new_jerusalem": "https://www.earlyjewishwritings.com/text/newjerusalem.html",
    "songs_sabbath": "https://www.earlyjewishwritings.com/text/songsabbath.html",
}

def download_dss():
    """Download Dead Sea Scrolls texts"""
    print("\n" + "="*60)
    print("DOWNLOADING DEAD SEA SCROLLS")
    print("="*60)
    
    output_dir = OUTPUT_DIR / "dead_sea_scrolls"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    
    for name, url in DSS_TEXTS.items():
        print(f"\nFetching: {name}")
        html = fetch_url(url)
        
        if html:
            text = extract_text_from_html(html)
            metadata = {
                'corpus': 'Dead Sea Scrolls',
                'text_id': name,
                'source_url': url,
                'language': 'English (translated from Hebrew/Aramaic)',
            }
            save_text(output_dir / f"{name}.txt", text, metadata)
            success_count += 1
        else:
            print(f"  FAILED: {name}")
        
        time.sleep(0.5)
    
    print(f"\nDead Sea Scrolls: {success_count}/{len(DSS_TEXTS)} texts downloaded")
    return success_count

# ============================================================
# OT PSEUDEPIGRAPHA
# ============================================================

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
    "ascension_isaiah": "https://www.earlyjewishwritings.com/text/ascensionisaiah.html",
    "ladder_jacob": "https://www.earlyjewishwritings.com/text/ladderjacob.html",
    "joseph_aseneth": "https://www.earlyjewishwritings.com/text/josephaseneth.html",
    "letter_aristeas": "https://www.earlyjewishwritings.com/text/aristeas.html",
    "3_maccabees": "https://www.earlyjewishwritings.com/text/3maccabees.html",
    "4_maccabees": "https://www.earlyjewishwritings.com/text/4maccabees.html",
}

def download_ot_pseudepigrapha():
    """Download OT Pseudepigrapha"""
    print("\n" + "="*60)
    print("DOWNLOADING OT PSEUDEPIGRAPHA")
    print("="*60)
    
    output_dir = OUTPUT_DIR / "ot_pseudepigrapha"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    
    for name, url in OT_PSEUDEPIGRAPHA.items():
        print(f"\nFetching: {name}")
        html = fetch_url(url)
        
        if html:
            text = extract_text_from_html(html)
            metadata = {
                'corpus': 'OT Pseudepigrapha',
                'text_id': name,
                'source_url': url,
                'language': 'English (translated)',
            }
            save_text(output_dir / f"{name}.txt", text, metadata)
            success_count += 1
        else:
            print(f"  FAILED: {name}")
        
        time.sleep(0.5)
    
    print(f"\nOT Pseudepigrapha: {success_count}/{len(OT_PSEUDEPIGRAPHA)} texts downloaded")
    return success_count

# ============================================================
# PHILO & JOSEPHUS (supplements)
# ============================================================

JEWISH_HELLENISTIC = {
    "philo_creation": "https://www.earlyjewishwritings.com/text/philo/book1.html",
    "philo_allegorical": "https://www.earlyjewishwritings.com/text/philo/book2.html",
    "philo_cherubim": "https://www.earlyjewishwritings.com/text/philo/book4.html",
    "philo_moses1": "https://www.earlyjewishwritings.com/text/philo/book25.html",
    "philo_moses2": "https://www.earlyjewishwritings.com/text/philo/book26.html",
    "philo_decalogue": "https://www.earlyjewishwritings.com/text/philo/book27.html",
    "philo_spec_laws1": "https://www.earlyjewishwritings.com/text/philo/book28.html",
    "philo_contemplative": "https://www.earlyjewishwritings.com/text/philo/book34.html",
    "josephus_war_preface": "https://www.earlyjewishwritings.com/text/josephus/war-preface.html",
}

def download_jewish_hellenistic():
    """Download Philo and Josephus supplements"""
    print("\n" + "="*60)
    print("DOWNLOADING JEWISH HELLENISTIC TEXTS")
    print("="*60)
    
    output_dir = OUTPUT_DIR / "jewish_hellenistic"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    
    for name, url in JEWISH_HELLENISTIC.items():
        print(f"\nFetching: {name}")
        html = fetch_url(url)
        
        if html:
            text = extract_text_from_html(html)
            metadata = {
                'corpus': 'Jewish Hellenistic',
                'text_id': name,
                'source_url': url,
                'language': 'English (translated from Greek)',
            }
            save_text(output_dir / f"{name}.txt", text, metadata)
            success_count += 1
        else:
            print(f"  FAILED: {name}")
        
        time.sleep(0.5)
    
    print(f"\nJewish Hellenistic: {success_count}/{len(JEWISH_HELLENISTIC)} texts downloaded")
    return success_count

# ============================================================
# HERMETIC TEXTS
# ============================================================

HERMETIC = {
    "corpus_hermeticum_1": "https://gnosis.org/library/grs-mead/TGH-v2/th201.html",
    "corpus_hermeticum_poimandres": "https://gnosis.org/library/hermes1.htm",
    "asclepius_hermetic": "https://gnosis.org/library/grs-mead/TGH-v2/th210.html",
    "emerald_tablet": "https://gnosis.org/library/emerald.htm",
}

def download_hermetic():
    """Download Hermetic texts"""
    print("\n" + "="*60)
    print("DOWNLOADING HERMETIC TEXTS")
    print("="*60)
    
    output_dir = OUTPUT_DIR / "hermetic"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    
    for name, url in HERMETIC.items():
        print(f"\nFetching: {name}")
        html = fetch_url(url)
        
        if html:
            text = extract_text_from_html(html)
            metadata = {
                'corpus': 'Hermetic Texts',
                'text_id': name,
                'source_url': url,
                'language': 'English (translated from Greek)',
            }
            save_text(output_dir / f"{name}.txt", text, metadata)
            success_count += 1
        else:
            print(f"  FAILED: {name}")
        
        time.sleep(0.5)
    
    print(f"\nHermetic: {success_count}/{len(HERMETIC)} texts downloaded")
    return success_count

# ============================================================
# MANICHAEAN TEXTS
# ============================================================

MANICHAEAN = {
    "kephalaia": "https://gnosis.org/library/kepha.htm",
    "psalm_book": "https://gnosis.org/library/manis.htm",
    "cologne_mani_codex": "https://gnosis.org/library/cmc.htm",
}

def download_manichaean():
    """Download Manichaean texts"""
    print("\n" + "="*60)
    print("DOWNLOADING MANICHAEAN TEXTS")
    print("="*60)
    
    output_dir = OUTPUT_DIR / "manichaean"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    success_count = 0
    
    for name, url in MANICHAEAN.items():
        print(f"\nFetching: {name}")
        html = fetch_url(url)
        
        if html:
            text = extract_text_from_html(html)
            metadata = {
                'corpus': 'Manichaean Texts',
                'text_id': name,
                'source_url': url,
                'language': 'English (translated)',
            }
            save_text(output_dir / f"{name}.txt", text, metadata)
            success_count += 1
        else:
            print(f"  FAILED: {name}")
        
        time.sleep(0.5)
    
    print(f"\nManichaean: {success_count}/{len(MANICHAEAN)} texts downloaded")
    return success_count

# ============================================================
# MAIN
# ============================================================

def create_manifest():
    """Create manifest of all downloaded corpora"""
    manifest = {
        'created': datetime.now().isoformat(),
        'corpora': {}
    }
    
    for corpus_dir in OUTPUT_DIR.iterdir():
        if corpus_dir.is_dir():
            files = list(corpus_dir.glob("*.txt"))
            manifest['corpora'][corpus_dir.name] = {
                'count': len(files),
                'files': [f.name for f in files]
            }
    
    with open(OUTPUT_DIR / "manifest.json", 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"\nManifest saved: {OUTPUT_DIR / 'manifest.json'}")

def main():
    """Run all downloads"""
    print("="*60)
    print("LOGOS CORPUS DOWNLOADER")
    print("="*60)
    print(f"Output directory: {OUTPUT_DIR}")
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    results = {}
    
    # Download all corpora
    results['nag_hammadi'] = download_nag_hammadi()
    results['apostolic_fathers'] = download_apostolic_fathers()
    results['nt_apocrypha'] = download_nt_apocrypha()
    results['other_gnostic'] = download_other_gnostic()
    results['dead_sea_scrolls'] = download_dss()
    results['ot_pseudepigrapha'] = download_ot_pseudepigrapha()
    results['jewish_hellenistic'] = download_jewish_hellenistic()
    results['hermetic'] = download_hermetic()
    results['manichaean'] = download_manichaean()
    
    # Create manifest
    create_manifest()
    
    # Summary
    print("\n" + "="*60)
    print("DOWNLOAD COMPLETE")
    print("="*60)
    
    total = 0
    for corpus, count in results.items():
        print(f"  {corpus}: {count} texts")
        total += count
    
    print(f"\n  TOTAL: {total} texts downloaded")
    print(f"  Location: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
