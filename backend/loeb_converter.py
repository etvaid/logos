#!/usr/bin/env python3
"""
LOGOS Loeb DSL Converter
========================

Converts GoldenDict DSL files from Anna's Archive Loeb collection
into clean text files suitable for corpus processing.

DSL Format Overview:
    - UTF-16 LE encoding (usually)
    - Headwords on lines starting without whitespace
    - Content indented with tabs or spaces
    - Tags in [brackets] for formatting
    - {{...}} for references

Output:
    - Individual text files per author/work
    - Metadata JSON index
    - Parallel Greek/Latin + English pairs for translation analysis

Usage:
    python loeb_converter.py --input loeb.dsl --output ./loeb_texts/

Author: LOGOS Project
License: MIT
"""

import os
import re
import json
import argparse
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from collections import defaultdict
import unicodedata


@dataclass
class LoebEntry:
    """A single entry from the Loeb DSL file."""
    headword: str
    volume_number: int = 0
    page_number: int = 0
    author: str = ""
    work: str = ""
    book: str = ""
    chapter: str = ""
    content_greek_latin: str = ""
    content_english: str = ""
    raw_content: str = ""
    
    def __post_init__(self):
        self._parse_headword()
    
    def _parse_headword(self):
        """Parse headword to extract metadata."""
        # Headword formats:
        # -203.321 (volume.page)
        # %Author Work, Chapter
        # AUTHOR, Work
        
        hw = self.headword.strip()
        
        # Volume.page format: -203.321
        if hw.startswith('-'):
            match = re.match(r'-(\d+)\.(\d+)', hw)
            if match:
                self.volume_number = int(match.group(1))
                self.page_number = int(match.group(2))
        
        # Chapter format: %Author Work, Chapter
        elif hw.startswith('%'):
            parts = hw[1:].split(',', 1)
            if len(parts) >= 1:
                self.work = parts[0].strip()
            if len(parts) >= 2:
                self.chapter = parts[1].strip()
        
        # Book format: AUTHOR, Work
        elif hw.isupper() or ',' in hw:
            parts = hw.split(',', 1)
            if len(parts) >= 1:
                self.author = parts[0].strip()
            if len(parts) >= 2:
                self.work = parts[1].strip()


@dataclass  
class LoebWork:
    """A complete work from the Loeb collection."""
    author: str
    title: str
    volume_numbers: List[int] = field(default_factory=list)
    entries: List[LoebEntry] = field(default_factory=list)
    language: str = ""  # "greek" or "latin"
    
    @property
    def full_text_original(self) -> str:
        """Get concatenated Greek/Latin text."""
        return "\n\n".join(e.content_greek_latin for e in self.entries if e.content_greek_latin)
    
    @property
    def full_text_english(self) -> str:
        """Get concatenated English translation."""
        return "\n\n".join(e.content_english for e in self.entries if e.content_english)
    
    @property
    def parallel_pairs(self) -> List[Tuple[str, str]]:
        """Get parallel original/translation pairs."""
        pairs = []
        for e in self.entries:
            if e.content_greek_latin and e.content_english:
                pairs.append((e.content_greek_latin, e.content_english))
        return pairs


class LoebDSLConverter:
    """
    Converts Loeb DSL files to structured text corpus.
    """
    
    # Loeb catalog: volume number -> (author, work, language)
    LOEB_CATALOG = {
        # Greek - Homer
        170: ("Homer", "Iliad I", "greek"),
        171: ("Homer", "Iliad II", "greek"),
        104: ("Homer", "Odyssey I", "greek"),
        105: ("Homer", "Odyssey II", "greek"),
        
        # Greek - Tragedy
        145: ("Aeschylus", "Oresteia", "greek"),
        146: ("Aeschylus", "Persians, Seven, Supplices, Prometheus", "greek"),
        20: ("Sophocles", "Oedipus, Colonus, Antigone", "greek"),
        21: ("Sophocles", "Ajax, Electra, Trachiniae, Philoctetes", "greek"),
        
        # Greek - Philosophy
        36: ("Plato", "Republic I", "greek"),
        237: ("Aristotle", "Nicomachean Ethics", "greek"),
        
        # Greek - History
        117: ("Herodotus", "Histories I", "greek"),
        118: ("Herodotus", "Histories II", "greek"),
        108: ("Thucydides", "History I", "greek"),
        109: ("Thucydides", "History II", "greek"),
        
        # Latin - Epic
        63: ("Virgil", "Eclogues, Georgics, Aeneid I-VI", "latin"),
        64: ("Virgil", "Aeneid VII-XII, Minor Poems", "latin"),
        
        # Latin - Philosophy
        40: ("Cicero", "De Officiis", "latin"),
        214: ("Seneca", "Moral Essays I", "latin"),
        
        # Latin - History
        114: ("Livy", "History I", "latin"),
        231: ("Tacitus", "Histories, Annals", "latin"),
        
        # Add more as needed...
    }
    
    # DSL tag patterns to remove or convert
    DSL_TAGS = {
        r'\[b\]': '',           # Bold start
        r'\[/b\]': '',          # Bold end
        r'\[i\]': '',           # Italic start
        r'\[/i\]': '',          # Italic end
        r'\[u\]': '',           # Underline start
        r'\[/u\]': '',          # Underline end
        r'\[c\]': '',           # Color start
        r'\[/c\]': '',          # Color end
        r'\[m\d?\]': '',        # Margin
        r'\[/m\]': '',          # Margin end
        r'\[trn\]': '',         # Translation start
        r'\[/trn\]': '',        # Translation end
        r'\[ex\]': '',          # Example start
        r'\[/ex\]': '',         # Example end
        r'\[com\]': '',         # Comment start
        r'\[/com\]': '',        # Comment end
        r'\[s\].*?\[/s\]': '',  # Sound files
        r'\[ref\]': '',         # Reference start
        r'\[/ref\]': '',        # Reference end
        r'\[url\].*?\[/url\]': '',  # URLs
        r'<<.*?>>': '',         # Internal refs
        r'\{\{.*?\}\}': '',     # Special refs
        r'\[p\]': '\n',         # Paragraph
        r'\[br\]': '\n',        # Line break
        r'\\n': '\n',           # Newline escape
    }
    
    def __init__(self, input_path: str, output_dir: str):
        self.input_path = Path(input_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        self.entries: List[LoebEntry] = []
        self.works: Dict[str, LoebWork] = {}
        self.stats = {
            'total_entries': 0,
            'greek_entries': 0,
            'latin_entries': 0,
            'parallel_pairs': 0,
            'volumes_found': set()
        }
    
    def read_dsl(self) -> str:
        """Read DSL file with appropriate encoding."""
        # Try different encodings
        encodings = ['utf-16-le', 'utf-16', 'utf-8', 'latin-1']
        
        for encoding in encodings:
            try:
                with open(self.input_path, 'r', encoding=encoding) as f:
                    content = f.read()
                    # Check if it looks valid
                    if len(content) > 100 and not content.startswith('\x00'):
                        print(f"Successfully read with encoding: {encoding}")
                        return content
            except (UnicodeDecodeError, UnicodeError):
                continue
        
        raise ValueError(f"Could not decode DSL file with any known encoding")
    
    def clean_content(self, text: str) -> str:
        """Remove DSL tags and clean text."""
        result = text
        
        # Apply tag removals
        for pattern, replacement in self.DSL_TAGS.items():
            result = re.sub(pattern, replacement, result)
        
        # Normalize whitespace
        result = re.sub(r'\n{3,}', '\n\n', result)
        result = re.sub(r' +', ' ', result)
        result = result.strip()
        
        return result
    
    def is_greek(self, text: str) -> bool:
        """Check if text contains Greek characters."""
        for char in text:
            if '\u0370' <= char <= '\u03FF' or '\u1F00' <= char <= '\u1FFF':
                return True
        return False
    
    def is_latin_classical(self, text: str) -> bool:
        """Check if text looks like classical Latin (not English)."""
        # Latin indicators: macrons, specific endings, no modern English patterns
        latin_patterns = [
            r'\b\w+orum\b', r'\b\w+arum\b', r'\b\w+ibus\b',
            r'\b\w+ārum\b', r'\b\w+ōrum\b',  # With macrons
            r'\bque\b', r'\benim\b', r'\bsed\b', r'\baut\b',
            r'\best\b', r'\bsunt\b', r'\berat\b', r'\bfuit\b'
        ]
        
        for pattern in latin_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        return False
    
    def parse_dsl(self, content: str):
        """Parse DSL content into entries."""
        lines = content.split('\n')
        
        current_headword = None
        current_content = []
        
        for line in lines:
            # Skip DSL header
            if line.startswith('#'):
                continue
            
            # New headword (not indented)
            if line and not line[0].isspace() and not line.startswith('\t'):
                # Save previous entry
                if current_headword:
                    entry = self._create_entry(current_headword, '\n'.join(current_content))
                    if entry:
                        self.entries.append(entry)
                
                current_headword = line.strip()
                current_content = []
            else:
                # Content line
                current_content.append(line)
        
        # Don't forget last entry
        if current_headword:
            entry = self._create_entry(current_headword, '\n'.join(current_content))
            if entry:
                self.entries.append(entry)
        
        self.stats['total_entries'] = len(self.entries)
        print(f"Parsed {len(self.entries)} entries")
    
    def _create_entry(self, headword: str, raw_content: str) -> Optional[LoebEntry]:
        """Create a LoebEntry from headword and raw content."""
        cleaned = self.clean_content(raw_content)
        if not cleaned:
            return None
        
        entry = LoebEntry(
            headword=headword,
            raw_content=cleaned
        )
        
        # Try to separate Greek/Latin from English
        # Usually on facing pages, Greek/Latin first then English
        paragraphs = cleaned.split('\n\n')
        
        greek_latin_parts = []
        english_parts = []
        
        for para in paragraphs:
            if self.is_greek(para):
                greek_latin_parts.append(para)
                self.stats['greek_entries'] += 1
            elif self.is_latin_classical(para):
                greek_latin_parts.append(para)
                self.stats['latin_entries'] += 1
            else:
                english_parts.append(para)
        
        entry.content_greek_latin = '\n\n'.join(greek_latin_parts)
        entry.content_english = '\n\n'.join(english_parts)
        
        if entry.volume_number:
            self.stats['volumes_found'].add(entry.volume_number)
        
        return entry
    
    def organize_works(self):
        """Organize entries into works by author."""
        works_dict = defaultdict(list)
        
        for entry in self.entries:
            # Key by author or volume
            if entry.author:
                key = f"{entry.author}_{entry.work}"
            elif entry.volume_number:
                catalog = self.LOEB_CATALOG.get(entry.volume_number)
                if catalog:
                    key = f"{catalog[0]}_{catalog[1]}"
                else:
                    key = f"Volume_{entry.volume_number}"
            else:
                key = "Unknown"
            
            works_dict[key].append(entry)
        
        # Create LoebWork objects
        for key, entries in works_dict.items():
            parts = key.split('_', 1)
            author = parts[0] if parts else "Unknown"
            title = parts[1] if len(parts) > 1 else "Unknown"
            
            volumes = list(set(e.volume_number for e in entries if e.volume_number))
            
            # Determine language
            has_greek = any(e.content_greek_latin and self.is_greek(e.content_greek_latin) for e in entries)
            language = "greek" if has_greek else "latin"
            
            self.works[key] = LoebWork(
                author=author,
                title=title,
                volume_numbers=volumes,
                entries=entries,
                language=language
            )
        
        print(f"Organized into {len(self.works)} works")
    
    def export_texts(self):
        """Export works to text files."""
        # Create subdirectories
        (self.output_dir / "greek").mkdir(exist_ok=True)
        (self.output_dir / "latin").mkdir(exist_ok=True)
        (self.output_dir / "english").mkdir(exist_ok=True)
        (self.output_dir / "parallel").mkdir(exist_ok=True)
        
        index = []
        
        for key, work in self.works.items():
            # Sanitize filename
            safe_key = re.sub(r'[^\w\-]', '_', key)[:100]
            
            # Export original language text
            lang_dir = self.output_dir / work.language
            original_path = lang_dir / f"{safe_key}.txt"
            with open(original_path, 'w', encoding='utf-8') as f:
                f.write(f"# {work.author} - {work.title}\n")
                f.write(f"# Language: {work.language}\n")
                f.write(f"# Volumes: {work.volume_numbers}\n\n")
                f.write(work.full_text_original)
            
            # Export English translation
            english_path = self.output_dir / "english" / f"{safe_key}.txt"
            with open(english_path, 'w', encoding='utf-8') as f:
                f.write(f"# {work.author} - {work.title} (English)\n\n")
                f.write(work.full_text_english)
            
            # Export parallel pairs (for translation analysis)
            pairs = work.parallel_pairs
            if pairs:
                self.stats['parallel_pairs'] += len(pairs)
                parallel_path = self.output_dir / "parallel" / f"{safe_key}.json"
                with open(parallel_path, 'w', encoding='utf-8') as f:
                    json.dump({
                        'author': work.author,
                        'title': work.title,
                        'language': work.language,
                        'pairs': [
                            {'original': p[0], 'english': p[1]}
                            for p in pairs
                        ]
                    }, f, ensure_ascii=False, indent=2)
            
            # Add to index
            index.append({
                'key': key,
                'author': work.author,
                'title': work.title,
                'language': work.language,
                'volumes': work.volume_numbers,
                'entries': len(work.entries),
                'parallel_pairs': len(pairs),
                'files': {
                    'original': str(original_path.relative_to(self.output_dir)),
                    'english': str(english_path.relative_to(self.output_dir)),
                    'parallel': str((self.output_dir / "parallel" / f"{safe_key}.json").relative_to(self.output_dir)) if pairs else None
                }
            })
        
        # Write index
        index_path = self.output_dir / "loeb_index.json"
        with open(index_path, 'w', encoding='utf-8') as f:
            json.dump({
                'total_works': len(self.works),
                'stats': {
                    'total_entries': self.stats['total_entries'],
                    'greek_entries': self.stats['greek_entries'],
                    'latin_entries': self.stats['latin_entries'],
                    'parallel_pairs': self.stats['parallel_pairs'],
                    'volumes_found': sorted(list(self.stats['volumes_found']))
                },
                'works': index
            }, f, ensure_ascii=False, indent=2)
        
        print(f"Exported to {self.output_dir}")
        print(f"  Works: {len(self.works)}")
        print(f"  Parallel pairs: {self.stats['parallel_pairs']}")
    
    def convert(self):
        """Run full conversion pipeline."""
        print(f"Converting {self.input_path}...")
        
        # Step 1: Read DSL
        content = self.read_dsl()
        
        # Step 2: Parse entries
        self.parse_dsl(content)
        
        # Step 3: Organize into works
        self.organize_works()
        
        # Step 4: Export
        self.export_texts()
        
        print("\nConversion complete!")
        print(f"Stats: {json.dumps(dict(self.stats), default=list, indent=2)}")


def main():
    parser = argparse.ArgumentParser(description="Convert Loeb DSL to text corpus")
    parser.add_argument('--input', '-i', required=True, help="Input DSL file path")
    parser.add_argument('--output', '-o', required=True, help="Output directory")
    
    args = parser.parse_args()
    
    converter = LoebDSLConverter(args.input, args.output)
    converter.convert()


if __name__ == "__main__":
    main()
