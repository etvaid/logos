#!/usr/bin/env python3
"""
╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                   ║
║   LOGOS COMPLETE DATA CLEANUP                                                                    ║
║                                                                                                   ║
║   - Cleans ALL translator names (removes "Release", "Contents", etc.)                            ║
║   - Merges ALL duplicates (weighted average of style vectors)                                    ║
║   - Filters PG volunteers, ancient authors, garbage names                                        ║
║   - Labels unknowns as Unknown_001, Unknown_002, etc.                                            ║
║   - NEVER creates duplicates                                                                     ║
║   - PRESERVES all data and analysis (weighted merging)                                           ║
║   - Processes EVERYTHING                                                                         ║
║                                                                                                   ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝
"""

import os
import re
import json
from collections import defaultdict
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
import copy

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

BASE_PATH = os.path.expanduser("~/Downloads/logos")
INPUT_DIR = os.path.join(BASE_PATH, "computed_data_v2")
OUTPUT_DIR = os.path.join(BASE_PATH, "computed_data_clean")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ═══════════════════════════════════════════════════════════════════════════════
# FILTER LISTS
# ═══════════════════════════════════════════════════════════════════════════════

# Project Gutenberg volunteers/staff (NOT translators)
PG_VOLUNTEERS = {
    "david widger", "al haines", "chuck greif", "distributed proofreaders",
    "anonymous volunteer", "internet", "various", "unknown", "anonymous",
    "online distributed proofreading", "project gutenberg", "transcriber", 
    "preparer", "editor", "volunteer", "don kostuch", "tapio riikonen", 
    "roger frank", "stuart locke", "tom cosmas", "kelly foster", "ed brandon", 
    "mark bear akrigg", "judith boss", "donald lainson", "upper room",
    "kaarlo forsman", "oskar blomstedt", "konstantin siitonen", "lauri soini",
    "veikko antero koskenniemi", "kaarlo koskimies", "heikki impiwaara",
    "weikko pakarinen lauri pelkonen", "otto manninen tyyni tuulio",
    "robert mellin", "erik aleksander ingman", "edvin hagfors",
    "michiel jan noordewier", "willem cornelis royaards",
}

# Ancient authors (should be in authors table, not translators)
ANCIENT_AUTHORS = {
    "homer", "herodotus", "thucydides", "aristotle", "plato", "aristophanes",
    "sophocles", "euripides", "aeschylus", "xenophon", "plutarch", "tacitus",
    "virgil", "ovid", "cicero", "seneca", "livy", "horace", "juvenal",
    "lucian", "pausanias", "strabo", "polybius", "diodorus", "appian",
    "arrian", "josephus", "galen", "hippocrates", "ptolemy", "epictetus",
    "marcus aurelius", "dio cassius", "diogenes laertius", "athenaeus",
    "lucan", "servius", "marcellus", "archimedes", "titus quinctius",
    "saint augustine", "augustine", "aeschylus being", "plutarch contents",
    "marcus aurelius contents", "virgil markham",
}

# Modern authors who are NOT translators of classical texts
MODERN_AUTHORS = {
    "william shakespeare", "george eliot", "george eliot contents", 
    "charles dickens", "bret harte", "ambrose bierce", "george bernard shaw", 
    "henry kingsley", "owen johnson", "james fenimore cooper", "honore de balzac", 
    "fritz leiber", "randall garrett", "walter horatio pater", "robert lynd", 
    "herbert kaufman", "princess catherine radziwill", "terence macswiney", 
    "theobald wolfe tone", "david livingstone", "edward clodd", "george sterling", 
    "clive bell", "harry graham", "william le queux", "cuthbert bede",
    "william patten", "william combe", "geoffrey chaucer", "julian hawthorne",
    "elbert hubbard", "james rusk", "rowland smith", "george daniel",
    "frances younghusband", "frances lance ferrero", "emma karinthy",
    "virginia tatnall peacock", "ella isabel harris", "clara erskine clement waters",
    "elizabeth twining hall", "john myers", "galen clark",
}

# Garbage/meaningless names
GARBAGE_NAMES = {
    "late", "various", "himself", "hope", "case", "earl", "means", "internet",
    "famous writers", "cambridge university", "street and smith corporation",
    "release", "contents", "introduction", "appendix", "notes", "book",
    "colonel", "sir", "messrs", "nicolas", "eduardo", "emil", "hugh",
    "maximilian", "leicester", "cyrus", "evelyn", "leconte", "diego graci",
    "luis segal", "federico bar", "enrique soms", "upper room", "memorial edition",
    "new", "american", "illustrated", "dedication to", "with permission",
    "originally", "author", "london", "john", "being", "philosophical essays",
    "nine greek", "little novels", "the birds", "peace", "preparer",
}

# Words to strip from the END of names
STRIP_SUFFIXES = [
    "release", "contents", "introduction", "appendix", "notes", "book",
    "with", "and", "the", "of", "by", "from", "in", "to", "for",
    "permission", "originally", "author", "london", "new", "york",
    "illustrated", "dedication", "memorial", "edition", "american",
    "being", "essays", "philosophical", "nine", "greek", "little", "novels",
    "birds", "peace", "preparer", "editor", "dean", "sir", "cardinal",
]

# Words to strip from the START of names
STRIP_PREFIXES = [
    "sir", "dr", "mr", "mrs", "ms", "prof", "professor", "rev", "reverend",
    "hon", "honorable", "the", "by", "translated",
]

# ═══════════════════════════════════════════════════════════════════════════════
# CANONICAL TRANSLATOR NAMES
# Maps cleaned lowercase name → canonical display name
# ═══════════════════════════════════════════════════════════════════════════════

CANONICAL_TRANSLATORS = {
    # Major Homer translators
    "alexander pope": "Alexander Pope",
    "george chapman": "George Chapman",
    "samuel butler": "Samuel Butler",
    "richmond lattimore": "Richmond Lattimore",
    "robert fagles": "Robert Fagles",
    "emily wilson": "Emily Wilson",
    "robert fitzgerald": "Robert Fitzgerald",
    "william cowper": "William Cowper",
    "theodore alois buckley": "Theodore Alois Buckley",
    "andrew lang": "Andrew Lang",
    "walter leaf": "Walter Leaf",
    "ernest myers": "Ernest Myers",
    
    # Plato translators
    "benjamin jowett": "Benjamin Jowett",
    "harold north fowler": "Harold North Fowler",
    "paul shorey": "Paul Shorey",
    "w r m lamb": "W.R.M. Lamb",
    
    # Greek historians
    "richard crawley": "Richard Crawley",
    "george rawlinson": "George Rawlinson",
    "aubrey stewart": "Aubrey Stewart",
    "george long": "George Long",
    "henry graham dakyns": "Henry Graham Dakyns",
    "herbert baldwin foster": "Herbert Baldwin Foster",
    
    # Greek tragedy
    "gilbert murray": "Gilbert Murray",
    "francis storr": "Francis Storr",
    "richard jebb": "Richard Jebb",
    "e d a morshead": "E.D.A. Morshead",
    "edward coleridge": "Edward Coleridge",
    "arthur s way": "Arthur S. Way",
    "philip vellacott": "Philip Vellacott",
    
    # Latin translators
    "john dryden": "John Dryden",
    "john conington": "John Conington",
    "theodore chickering williams": "Theodore C. Williams",
    "h rushton fairclough": "H. Rushton Fairclough",
    "frank justus miller": "Frank Justus Miller",
    "rolfe humphries": "Rolfe Humphries",
    "charles duke yonge": "Charles Duke Yonge",
    
    # Plutarch translators
    "thomas north": "Thomas North",
    "john dryden": "John Dryden",
    "aubrey stewart": "Aubrey Stewart",
    
    # Philosophy translators
    "thomas taylor": "Thomas Taylor",
    "kenneth sylvan guthrie": "Kenneth Sylvan Guthrie",
    "george long": "George Long",
    "hastings crossley": "Hastings Crossley",
    
    # Roman prose
    "william melmoth": "William Melmoth",
    "thomas gordon": "Thomas Gordon",
    "william adlington": "William Adlington",
    "william burnaby": "William Burnaby",
    "philemon holland": "Philemon Holland",
    "john bostock": "John Bostock",
    
    # Other significant translators
    "charles rann kennedy": "Charles Rann Kennedy",
    "charles stuart calverley": "Charles Stuart Calverley",
    "william morris": "William Morris",
    "gawin douglas": "Gawin Douglas",
    "henry cary": "Henry Cary",
    "james rhoades": "James Rhoades",
    "lewis campbell": "Lewis Campbell",
    "ninian hill thomson": "Ninian Hill Thomson",
    "walter miller": "Walter Miller",
    "paul nixon": "Paul Nixon",
    "harold edgeworth butler": "Harold Edgeworth Butler",
    "william ellery leonard": "William Ellery Leonard",
    "horace meyer kallen": "Horace Meyer Kallen",
    "arthur john brock": "Arthur John Brock",
    "john watson mccrindle": "John Watson McCrindle",
    "thomas francklin": "Thomas Francklin",
    "george colman": "George Colman",
    "thomas creech": "Thomas Creech",
    "robinson ellis": "Robinson Ellis",
    "ingram bywater": "Ingram Bywater",
    "francis hickes": "Francis Hickes",
    "jack lindsay": "Jack Lindsay",
    "goldwin smith": "Goldwin Smith",
    "edward storer": "Edward Storer",
    "willis barnstone": "Willis Barnstone",
    "maurice platnauer": "Maurice Platnauer",
    "edward fairfax taylor": "Edward Fairfax Taylor",
    "fairfax harrison": "Fairfax Harrison",
    "thomas linacre": "Thomas Linacre",
    "michael wodhull": "Michael Wodhull",
    "horace barnett samuel": "Horace Barnett Samuel",
    "francis adams": "Francis Adams",
    "eric otto winstedt": "Eric Otto Winstedt",
    "lewis evans": "Lewis Evans",
    "william gifford": "William Gifford",
    "arthur wallace pickard": "Arthur Wallace Pickard-Cambridge",
    "john henry newman": "John Henry Newman",
    "henry hart milman": "Henry Hart Milman",
    "francis barham": "Francis Barham",
    "katharine prescott wormeley": "Katharine Prescott Wormeley",
    "wallace smith murray": "Wallace Smith Murray",
    "marsilius ficinus": "Marsilio Ficino",
    "william curry": "William Curry",
    "matthew arnold": "Matthew Arnold",
    "william hazlitt": "William Hazlitt",
    "charles cotton": "Charles Cotton",
    "richard francis burton": "Richard Francis Burton",
    "arthur livingston": "Arthur Livingston",
    "frederic whyte": "Frederic Whyte",
    "laurent tailhade": "Laurent Tailhade",
    "louis le gendre": "Louis Le Gendre",
    "derek davis": "Derek Davis",
    "gregory mcnamee": "Gregory McNamee",
    
    # Loeb translators (partial list)
    "walter c a ker": "Walter C.A. Ker",
    "j d duff": "J.D. Duff",
    "a t murray": "A.T. Murray",
    "w h d rouse": "W.H.D. Rouse",
    
    # Non-English translators (keep for completeness)
    "paulin paris": "Paulin Paris",
    "jacques amyot": "Jacques Amyot",
    "bartomeu pou": "Bartomeu Pou",
    "francisco crivell": "Francisco Crivell",
    "miguel antonio caro": "Miguel Antonio Caro",
    "fernando segundo brieva salvatierra": "Fernando Brieva Salvatierra",
    "iames amiot": "Jacques Amyot",
    "carolus raeticus": "Carolus Raeticus",
    "alexandre machard": "Alexandre Machard",
    "gergely csiky": "Gergely Csiky",
    "edvard rein": "Edvard Rein",
    "friedrich bruns": "Friedrich Bruns",
}

# ═══════════════════════════════════════════════════════════════════════════════
# MERGE GROUPS
# Names that should be merged into a single translator
# ═══════════════════════════════════════════════════════════════════════════════

MERGE_GROUPS = {
    "Alexander Pope": [
        "alexander pope", "alexander pope contents", "alexander pope contents introduction",
        "alexander pope release", "alexander pope introduction",
    ],
    "Benjamin Jowett": [
        "benjamin jowett", "benjamin jowett release", "benjamin jowett appendix",
        "benjamin jowett contents", "benjamin jowett contents introduction",
        "benjamin jowett introduction", "benjamin jowett introduction and",
        "benjamin jowett note",
    ],
    "George Chapman": [
        "george chapman", "george chapman release",
    ],
    "Samuel Butler": [
        "samuel butler", "samuel butler release",
    ],
    "John Dryden": [
        "john dryden", "john dryden contents", "john dryden contents book",
        "john dryden release", "john dryden book",
    ],
    "Gilbert Murray": [
        "gilbert murray", "gilbert murray release", "gilbert murray nine greek",
    ],
    "Lang, Leaf & Myers": [
        "andrew lang", "andrew lang walter leaf", "walter leaf", "ernest myers",
        "andrew lang release", "walter leaf release", "ernest myers release",
        "andrew lang walter leaf ernest myers",
    ],
    "William Cowper": [
        "william cowper", "william cowper release",
    ],
    "Thomas Taylor": [
        "thomas taylor", "thomas taylor release", "thomas taylor author",
        "thomas taylor london", "thomas taylor london john",
    ],
    "Theodore Alois Buckley": [
        "theodore alois buckley", "theodore alois buckley release",
        "theodore buckley",
    ],
    "Charles Duke Yonge": [
        "charles duke yonge", "charles duke yonge release",
    ],
    "John Conington": [
        "john conington", "john conington release",
    ],
    "Richard Crawley": [
        "richard crawley", "richard crawley with", "richard crawley with permission",
        "richard crawley release",
    ],
    "Francis Storr": [
        "francis storr", "francis storr release",
    ],
    "Thomas North": [
        "thomas north", "sir thomas north",
    ],
    "Charles Cotton": [
        "charles cotton", "charles cotton release", "charles cotton edited",
    ],
    "William Melmoth": [
        "william melmoth", "william melmoth release", "william melmoth revised",
    ],
    "Thomas Gordon": [
        "thomas gordon", "thomas gordon release", "thomas gordon preparer",
    ],
    "William Adlington": [
        "william adlington", "william adlington release", "william adlington first",
    ],
    "William Burnaby": [
        "william burnaby", "william burnaby release", "william burnaby introduction",
    ],
    "George Long": [
        "george long", "george long release", "george long aubrey stewart",
    ],
    "Aubrey Stewart": [
        "aubrey stewart", "aubrey stewart release",
    ],
    "Henry Graham Dakyns": [
        "henry graham dakyns", "henry graham dakyns release",
    ],
    "Herbert Baldwin Foster": [
        "herbert baldwin foster", "herbert baldwin foster release",
    ],
    "Kenneth Sylvan Guthrie": [
        "kenneth sylvan guthrie", "kenneth sylvan guthrie release",
    ],
    "William Morris": [
        "william morris", "william morris release",
    ],
    "Philip Vellacott": [
        "philip vellacott", "philip vellacott release",
    ],
    "Gawin Douglas": [
        "gawin douglas", "gawin douglas release",
    ],
    "Theodore C. Williams": [
        "theodore chickering williams", "theodore chickering williams release",
    ],
    "Frank Justus Miller": [
        "frank justus miller", "frank justus miller release",
    ],
    "Rolfe Humphries": [
        "rolfe humphries", "rolfe humphries release",
    ],
    "Lewis Evans & William Gifford": [
        "lewis evans william gifford", "lewis evans", "william gifford",
    ],
    "John Bostock & Henry Riley": [
        "john bostock henry", "john bostock", "henry riley",
    ],
    "Henry Hart Milman": [
        "henry hart milman", "dean milman", "milman",
    ],
    "Charles Rann Kennedy": [
        "charles rann kennedy", "charles rann kennedy release",
    ],
    "Charles Stuart Calverley": [
        "charles stuart calverley", "charles stuart calverley release",
    ],
    "Philemon Holland": [
        "philemon holland", "philemon holland release",
    ],
    "Marsilio Ficino": [
        "marsilius ficinus", "marsilius ficinus william curry", "marsilio ficino",
    ],
    "Paul Nixon": [
        "paul nixon", "paul nixon dean",
    ],
    "Arthur Wallace Pickard-Cambridge": [
        "arthur wallace pickard", "sir arthur wallace pickard",
    ],
    "John Henry Newman": [
        "john henry newman", "john henry cardinal newman",
    ],
    "Richard Francis Burton": [
        "richard francis burton", "sir richard francis burton",
    ],
    "Jacques Amyot": [
        "jacques amyot", "jacques amyot paul", "iames amiot", "iames amiot abbot",
    ],
    "Paulin Paris": [
        "paulin paris", "paulin paris release",
    ],
    "Eric Otto Winstedt": [
        "eric otto winstedt", "eric otto winstedt release",
    ],
    "Walter Miller": [
        "walter miller", "walter miller release",
    ],
    "Harold Edgeworth Butler": [
        "harold edgeworth butler", "harold edgeworth butler release",
    ],
    "William Ellery Leonard": [
        "william ellery leonard", "william ellery leonard release",
    ],
    "Horace Meyer Kallen": [
        "horace meyer kallen", "horace meyer kallen release",
    ],
    "Arthur John Brock": [
        "arthur john brock", "arthur john brock release",
    ],
    "Maurice Platnauer": [
        "maurice platnauer", "maurice platnauer release",
    ],
    "Edward Fairfax Taylor": [
        "edward fairfax taylor", "edward fairfax taylor release",
    ],
    "Fairfax Harrison": [
        "fairfax harrison", "fairfax harrison release",
    ],
    "Thomas Linacre": [
        "thomas linacre", "thomas linacre release",
    ],
    "Ninian Hill Thomson": [
        "ninian hill thomson", "ninian hill thomson release",
    ],
    "Lewis Campbell": [
        "lewis campbell", "lewis campbell release",
    ],
    "Henry Cary": [
        "henry cary", "henry cary release",
    ],
    "James Rhoades": [
        "james rhoades", "james rhoades release",
    ],
    "Thomas Francklin": [
        "thomas francklin", "thomas francklin release",
    ],
    "George Colman": [
        "george colman", "george colman release",
    ],
    "Thomas Creech": [
        "thomas creech", "thomas creech release",
    ],
    "Robinson Ellis": [
        "robinson ellis", "robinson ellis release",
    ],
    "Ingram Bywater": [
        "ingram bywater", "ingram bywater release",
    ],
    "Francis Hickes": [
        "francis hickes", "francis hickes release",
    ],
    "Jack Lindsay": [
        "jack lindsay", "jack lindsay release",
    ],
    "Goldwin Smith": [
        "goldwin smith", "goldwin smith release",
    ],
    "Edward Storer": [
        "edward storer", "edward storer release",
    ],
    "Hastings Crossley": [
        "hastings crossley", "hastings crossley release",
    ],
    "Miles Menander Dawson": [
        "miles menander dawson", "miles menander dawson release",
    ],
    "Alfred Gudemann": [
        "alfred gudemann", "alfred gudemann release",
    ],
    "Charles Edwardes": [
        "charles edwardes", "charles edwardes release",
    ],
    "Francis Adams": [
        "francis adams", "francis adams release",
    ],
    "Horace Barnett Samuel": [
        "horace barnett samuel", "horace barnett samuel release",
    ],
    "John Clarke": [
        "john clarke", "john clarke release",
    ],
    "Jerome Beers Thomas": [
        "jerome beers thomas", "jerome beers thomas release",
    ],
    "John Watson McCrindle": [
        "john watson mccrindle", "john watson mccrindle release",
    ],
    "George William Featherstonhaugh": [
        "george william featherstonhaugh", "george william featherstonhaugh release",
    ],
    "William Ellis": [
        "william ellis", "william ellis release",
    ],
    "Derek Davis": [
        "derek davis", "derek davis the birds", "derek davis peace",
    ],
    "Gregory McNamee": [
        "gregory mcnamee", "gregory mcnamee originally",
    ],
    "Clara Bell": [
        "clara bell", "clara bell dedication to",
    ],
    "Michael Wodhull": [
        "michael wodhull", "michael wodhull editor",
    ],
    "Richard Garnett": [
        "richard garnett", "richard garnett mdcccciii to",
    ],
    "Edward Kennard Rand": [
        "edward kennard rand", "edward kennard rand release",
    ],
    "Walter Libby": [
        "walter libby", "walter libby release",
    ],
    "Thomas Sheldon Green": [
        "thomas sheldon green", "thomas sheldon green release",
    ],
    "Manmatha Nath Dutt": [
        "manmatha nath dutt", "manmatha nath dutt release",
    ],
}

# ═══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def clean_name(name: str) -> str:
    """Clean a translator/author name."""
    if not name:
        return ""
    
    # Lowercase for processing
    name = name.lower().strip()
    
    # Remove newlines and excess whitespace
    name = re.sub(r'\s+', ' ', name)
    
    # Remove "Release" and similar
    name = re.sub(r'\s*release\s*$', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\s*\d{4}\s*$', '', name)  # Remove years
    
    # Strip suffixes
    changed = True
    while changed:
        changed = False
        for suffix in STRIP_SUFFIXES:
            if name.endswith(' ' + suffix) or name == suffix:
                name = name[:-len(suffix)-1] if name.endswith(' ' + suffix) else ''
                name = name.strip()
                changed = True
    
    # Strip prefixes
    for prefix in STRIP_PREFIXES:
        if name.startswith(prefix + ' '):
            name = name[len(prefix)+1:]
            name = name.strip()
    
    return name.strip()

def normalize_for_matching(name: str) -> str:
    """Normalize name for matching/deduplication."""
    name = clean_name(name)
    # Remove all non-alphanumeric
    name = re.sub(r'[^a-z0-9]', '', name.lower())
    return name

def is_garbage(name: str) -> bool:
    """Check if name is garbage/meaningless."""
    clean = clean_name(name)
    
    # Too short
    if len(clean) < 3:
        return True
    
    # In garbage list
    if clean in GARBAGE_NAMES:
        return True
    
    # Check normalized version
    normalized = normalize_for_matching(name)
    for garbage in GARBAGE_NAMES:
        if normalize_for_matching(garbage) == normalized:
            return True
    
    return False

def is_pg_volunteer(name: str) -> bool:
    """Check if name is a Project Gutenberg volunteer."""
    clean = clean_name(name)
    normalized = normalize_for_matching(name)
    
    for volunteer in PG_VOLUNTEERS:
        if normalize_for_matching(volunteer) == normalized:
            return True
        if clean == volunteer:
            return True
    
    return False

def is_ancient_author(name: str) -> bool:
    """Check if name is an ancient author (should be in authors, not translators)."""
    clean = clean_name(name)
    normalized = normalize_for_matching(name)
    
    for author in ANCIENT_AUTHORS:
        if normalize_for_matching(author) == normalized:
            return True
        if clean.startswith(author):
            return True
    
    return False

def is_modern_author(name: str) -> bool:
    """Check if name is a modern author (not a translator)."""
    clean = clean_name(name)
    normalized = normalize_for_matching(name)
    
    for author in MODERN_AUTHORS:
        if normalize_for_matching(author) == normalized:
            return True
        if clean == author:
            return True
    
    return False

def find_merge_group(name: str) -> Optional[str]:
    """Find which merge group a name belongs to."""
    clean = clean_name(name)
    normalized = normalize_for_matching(name)
    
    for canonical, variants in MERGE_GROUPS.items():
        for variant in variants:
            if normalize_for_matching(variant) == normalized:
                return canonical
            if clean == variant:
                return canonical
            # Partial match
            if clean.startswith(variant) or variant.startswith(clean):
                if len(clean) > 5 and len(variant) > 5:  # Avoid short false matches
                    return canonical
    
    return None

def get_canonical_name(name: str) -> str:
    """Get canonical display name."""
    clean = clean_name(name)
    
    # Check merge groups first
    merge_group = find_merge_group(name)
    if merge_group:
        return merge_group
    
    # Check canonical mapping
    if clean in CANONICAL_TRANSLATORS:
        return CANONICAL_TRANSLATORS[clean]
    
    # Title case the cleaned name
    if clean:
        return ' '.join(word.capitalize() for word in clean.split())
    
    return name

def merge_profiles(profiles: List[Dict]) -> Dict:
    """Merge multiple profiles into one, with weighted averaging."""
    if not profiles:
        return {}
    
    if len(profiles) == 1:
        return profiles[0]
    
    # Calculate total words for weighting
    total_words = sum(p.get('total_words', 0) for p in profiles)
    
    # Merge basic info
    merged = {
        'total_words': total_words,
        'file_count': sum(p.get('file_count', len(p.get('source_files', []))) for p in profiles),
        'source_files': [],
        'computation_date': datetime.now().isoformat(),
    }
    
    # Collect all source files
    for p in profiles:
        merged['source_files'].extend(p.get('source_files', []))
    
    # Weighted average of style vectors
    style_vector = {}
    if total_words > 0:
        for p in profiles:
            weight = p.get('total_words', 0) / total_words
            for key, value in p.get('style_vector', {}).items():
                if isinstance(value, (int, float)):
                    style_vector[key] = style_vector.get(key, 0) + value * weight
    merged['style_vector'] = {k: round(v, 4) for k, v in style_vector.items()}
    
    # Weighted average of function word frequencies
    fw_freqs = {}
    if total_words > 0:
        for p in profiles:
            weight = p.get('total_words', 0) / total_words
            for key, value in p.get('function_word_freqs', {}).items():
                if isinstance(value, (int, float)):
                    fw_freqs[key] = fw_freqs.get(key, 0) + value * weight
    merged['function_word_freqs'] = {k: round(v, 4) for k, v in fw_freqs.items()}
    
    # Weighted average of vocabulary richness
    vocab = {}
    if total_words > 0:
        for p in profiles:
            weight = p.get('total_words', 0) / total_words
            for key, value in p.get('vocabulary_richness', {}).items():
                if isinstance(value, (int, float)):
                    vocab[key] = vocab.get(key, 0) + value * weight
    merged['vocabulary_richness'] = {k: round(v, 4) for k, v in vocab.items()}
    
    # Confidence score
    merged['confidence_score'] = min(1.0, total_words / 10000)
    
    return merged

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN CLEANUP FUNCTION
# ═══════════════════════════════════════════════════════════════════════════════

def cleanup_translators(translators: List[Dict]) -> List[Dict]:
    """Clean up translator profiles."""
    print("\n" + "="*80)
    print("CLEANING TRANSLATOR DATA")
    print("="*80)
    
    # Group profiles by canonical name
    grouped = defaultdict(list)
    filtered_reasons = defaultdict(list)
    unknown_counter = 0
    
    for t in translators:
        original_name = t.get('full_name', '')
        clean = clean_name(original_name)
        
        # Filter checks
        if is_garbage(original_name):
            filtered_reasons['garbage'].append(original_name)
            continue
        
        if is_pg_volunteer(original_name):
            filtered_reasons['pg_volunteer'].append(original_name)
            continue
        
        if is_ancient_author(original_name):
            filtered_reasons['ancient_author'].append(original_name)
            continue
        
        if is_modern_author(original_name):
            filtered_reasons['modern_author'].append(original_name)
            continue
        
        # Get canonical name
        canonical = get_canonical_name(original_name)
        
        # Handle unknowns
        if not canonical or len(canonical) < 3:
            unknown_counter += 1
            canonical = f"Unknown_{unknown_counter:03d}"
        
        # Keep special entries
        if original_name == "Loeb Classical Library":
            canonical = "Loeb Classical Library"
        if original_name == "Unattributed Translations":
            canonical = "Unattributed Translations"
        
        grouped[canonical].append(t)
    
    # Report filtering
    print(f"\n📊 Filtering Results:")
    print(f"   Garbage names removed: {len(filtered_reasons['garbage'])}")
    print(f"   PG volunteers removed: {len(filtered_reasons['pg_volunteer'])}")
    print(f"   Ancient authors removed: {len(filtered_reasons['ancient_author'])}")
    print(f"   Modern authors removed: {len(filtered_reasons['modern_author'])}")
    print(f"   Unknown entries labeled: {unknown_counter}")
    
    # Merge duplicates
    print(f"\n🔄 Merging duplicates...")
    cleaned = []
    
    for canonical, profiles in sorted(grouped.items()):
        merged = merge_profiles(profiles)
        merged['translator_id'] = re.sub(r'[^a-z0-9]', '_', canonical.lower())
        merged['full_name'] = canonical
        cleaned.append(merged)
        
        if len(profiles) > 1:
            print(f"   Merged {len(profiles)} profiles → {canonical} ({merged['total_words']:,} words)")
    
    print(f"\n✅ Final translator count: {len(cleaned)}")
    
    return cleaned

def cleanup_authors(authors: List[Dict]) -> List[Dict]:
    """Clean up author fingerprints."""
    print("\n" + "="*80)
    print("CLEANING AUTHOR DATA")
    print("="*80)
    
    # Group by normalized author_id
    grouped = defaultdict(list)
    
    for a in authors:
        author_id = a.get('author_id', '')
        # Normalize the ID
        normalized_id = author_id.lower().strip()
        grouped[normalized_id].append(a)
    
    # Merge duplicates
    cleaned = []
    for author_id, profiles in sorted(grouped.items()):
        merged = merge_profiles(profiles)
        merged['author_id'] = author_id
        merged['author_name'] = profiles[0].get('author_name', author_id)
        merged['language'] = profiles[0].get('language', 'unknown')
        cleaned.append(merged)
    
    print(f"✅ Final author count: {len(cleaned)}")
    
    return cleaned

# ═══════════════════════════════════════════════════════════════════════════════
# DATABASE UPLOAD
# ═══════════════════════════════════════════════════════════════════════════════

def upload_to_database(authors: List[Dict], translators: List[Dict]) -> bool:
    """Upload cleaned data to PostgreSQL."""
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("\n⚠️  No DATABASE_URL - skipping database upload")
        return False
    
    print("\n" + "="*80)
    print("UPLOADING TO DATABASE")
    print("="*80)
    
    try:
        import psycopg2
        from psycopg2.extras import Json
        
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Upload authors
        cur.execute('DROP TABLE IF EXISTS author_fingerprints CASCADE')
        cur.execute('''CREATE TABLE author_fingerprints (
            id SERIAL PRIMARY KEY,
            author_id VARCHAR(100) UNIQUE NOT NULL,
            author_name VARCHAR(200),
            language VARCHAR(50),
            total_words INTEGER,
            file_count INTEGER,
            style_vector JSONB,
            function_word_freqs JSONB,
            vocabulary_richness JSONB,
            computation_date TIMESTAMP
        )''')
        
        for a in authors:
            cur.execute('''INSERT INTO author_fingerprints 
                (author_id, author_name, language, total_words, file_count, style_vector, function_word_freqs, vocabulary_richness, computation_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)''',
                (a['author_id'], a.get('author_name', a['author_id']), a.get('language', 'unknown'), 
                 a['total_words'], a.get('file_count', 0), Json(a.get('style_vector', {})), 
                 Json(a.get('function_word_freqs', {})), Json(a.get('vocabulary_richness', {})), 
                 a.get('computation_date', datetime.now().isoformat())))
        
        print(f"   ✅ Uploaded {len(authors)} author fingerprints")
        
        # Upload translators
        cur.execute('DROP TABLE IF EXISTS translator_profiles CASCADE')
        cur.execute('''CREATE TABLE translator_profiles (
            id SERIAL PRIMARY KEY,
            translator_id VARCHAR(100) UNIQUE NOT NULL,
            full_name VARCHAR(200),
            total_words INTEGER,
            file_count INTEGER,
            style_vector JSONB,
            function_word_freqs JSONB,
            vocabulary_richness JSONB,
            computation_date TIMESTAMP,
            confidence_score FLOAT
        )''')
        
        for t in translators:
            cur.execute('''INSERT INTO translator_profiles 
                (translator_id, full_name, total_words, file_count, style_vector, function_word_freqs, vocabulary_richness, computation_date, confidence_score)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)''',
                (t['translator_id'], t['full_name'], t['total_words'], t.get('file_count', 0),
                 Json(t.get('style_vector', {})), Json(t.get('function_word_freqs', {})), 
                 Json(t.get('vocabulary_richness', {})), t.get('computation_date', datetime.now().isoformat()),
                 t.get('confidence_score', 1.0)))
        
        print(f"   ✅ Uploaded {len(translators)} translator profiles")
        
        conn.commit()
        cur.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"   ❌ Database error: {e}")
        return False

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    print("""
╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                   ║
║   LOGOS COMPLETE DATA CLEANUP                                                                    ║
║                                                                                                   ║
║   - Cleans ALL names                                                                             ║
║   - Merges ALL duplicates (weighted averaging)                                                   ║
║   - Filters garbage/volunteers/misclassified                                                     ║
║   - Labels unknowns as Unknown_001, etc.                                                         ║
║   - Preserves all computed data                                                                  ║
║                                                                                                   ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝
""")
    
    print(f"📁 Input: {INPUT_DIR}")
    print(f"📁 Output: {OUTPUT_DIR}")
    
    # Load existing data
    print("\n📂 Loading existing data...")
    
    try:
        with open(os.path.join(INPUT_DIR, "translator_profiles.json")) as f:
            translators_raw = json.load(f)
        print(f"   Loaded {len(translators_raw)} raw translator profiles")
    except FileNotFoundError:
        print("   ❌ translator_profiles.json not found!")
        return
    
    try:
        with open(os.path.join(INPUT_DIR, "author_fingerprints.json")) as f:
            authors_raw = json.load(f)
        print(f"   Loaded {len(authors_raw)} raw author fingerprints")
    except FileNotFoundError:
        print("   ❌ author_fingerprints.json not found!")
        return
    
    # Clean data
    translators_clean = cleanup_translators(translators_raw)
    authors_clean = cleanup_authors(authors_raw)
    
    # Save cleaned data
    print("\n" + "="*80)
    print("SAVING CLEANED DATA")
    print("="*80)
    
    with open(os.path.join(OUTPUT_DIR, "translator_profiles.json"), 'w') as f:
        json.dump(translators_clean, f, indent=2)
    print(f"   Saved: {OUTPUT_DIR}/translator_profiles.json")
    
    with open(os.path.join(OUTPUT_DIR, "author_fingerprints.json"), 'w') as f:
        json.dump(authors_clean, f, indent=2)
    print(f"   Saved: {OUTPUT_DIR}/author_fingerprints.json")
    
    # Create summary
    summary = {
        "computation_date": datetime.now().isoformat(),
        "input_translators": len(translators_raw),
        "output_translators": len(translators_clean),
        "input_authors": len(authors_raw),
        "output_authors": len(authors_clean),
        "total_translator_words": sum(t['total_words'] for t in translators_clean),
        "total_author_words": sum(a['total_words'] for a in authors_clean),
        "translators": [{"name": t['full_name'], "words": t['total_words']} for t in sorted(translators_clean, key=lambda x: -x['total_words'])],
        "greek_authors": len([a for a in authors_clean if a.get('language') == 'greek']),
        "latin_authors": len([a for a in authors_clean if a.get('language') == 'latin']),
    }
    
    with open(os.path.join(OUTPUT_DIR, "cleanup_summary.json"), 'w') as f:
        json.dump(summary, f, indent=2)
    print(f"   Saved: {OUTPUT_DIR}/cleanup_summary.json")
    
    # Upload to database
    db_success = upload_to_database(authors_clean, translators_clean)
    
    # Final report
    print("\n" + "="*80)
    print("✅ CLEANUP COMPLETE")
    print("="*80)
    print(f"""
Results:
  📚 Translators: {len(translators_raw)} → {len(translators_clean)} (cleaned & merged)
     - Total words: {sum(t['total_words'] for t in translators_clean):,}
  
  📜 Authors: {len(authors_raw)} → {len(authors_clean)}
     - Greek: {len([a for a in authors_clean if a.get('language') == 'greek'])}
     - Latin: {len([a for a in authors_clean if a.get('language') == 'latin'])}
     - Total words: {sum(a['total_words'] for a in authors_clean):,}
  
  💾 Database: {'✅ Uploaded' if db_success else '⚠️  Skipped'}
  
  📁 Output: {OUTPUT_DIR}/

Top 20 Translators by Word Count:
""")
    
    for i, t in enumerate(sorted(translators_clean, key=lambda x: -x['total_words'])[:20], 1):
        print(f"  {i:2}. {t['full_name']}: {t['total_words']:,} words")

if __name__ == "__main__":
    main()
