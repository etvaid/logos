# LOGOS BIBLICAL CORPUS DOWNLOADER

## Network Restricted Here - Run On Your Computer

The Claude environment has restricted network access. Download this package and run on your computer.

## Quick Start

```bash
# 1. Download this folder
# 2. Navigate to it
cd logos_biblical_downloads

# 3. Run the downloader
python download_all_corpora.py

# 4. Wait ~10-20 minutes for all downloads

# 5. Find texts in: ./logos_corpora/
```

## What Gets Downloaded

| Corpus | Texts | Source |
|--------|-------|--------|
| **Nag Hammadi Library** | 52 | gnosis.org |
| **Apostolic Fathers** | 16 | earlychristianwritings.com |
| **NT Apocrypha** | 26 | earlychristianwritings.com |
| **Dead Sea Scrolls** | 15 | earlyjewishwritings.com |
| **OT Pseudepigrapha** | 20 | earlyjewishwritings.com |
| **Other Gnostic** | 10 | gnosis.org |
| **Hermetic** | 4 | gnosis.org |
| **Manichaean** | 3 | gnosis.org |
| **Jewish Hellenistic** | 9 | earlyjewishwritings.com |
| **TOTAL** | ~155 | |

## Output Structure

```
logos_corpora/
├── nag_hammadi/
│   ├── gospel_thomas.txt
│   ├── gospel_philip.txt
│   ├── apocryphon_john_long.txt
│   └── ... (52 texts)
│
├── apostolic_fathers/
│   ├── didache.txt
│   ├── 1_clement.txt
│   └── ... (16 texts)
│
├── nt_apocrypha/
│   ├── gospel_peter.txt
│   ├── gospel_mary.txt
│   └── ... (26 texts)
│
├── dead_sea_scrolls/
│   ├── community_rule_1qs.txt
│   ├── war_scroll_1qm.txt
│   └── ... (15 texts)
│
├── ot_pseudepigrapha/
│   ├── 1_enoch.txt
│   ├── jubilees.txt
│   └── ... (20 texts)
│
└── manifest.json
```

## After Download

1. Upload `logos_corpora/` folder to Claude
2. Or transfer to server for batch processing
3. Ready for LOGOS ingestion and embedding

## Requirements

- Python 3.7+
- Internet connection
- ~50MB disk space
