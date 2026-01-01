#!/usr/bin/env python3
"""
LOGOS CORPUS CONVERTER
======================
Converts downloaded biblical texts to LOGOS JSONL format for batch embedding.

Usage:
    python convert_to_logos_jsonl.py ./logos_corpora

Output:
    ./logos_biblical_batch.jsonl (ready for Gemini batch embedding)
"""

import os
import sys
import json
import re
from pathlib import Path
from datetime import datetime
import hashlib

def segment_text(text, text_id, corpus, max_tokens=400):
    """
    Segment text into passages suitable for embedding.
    Target: ~400 tokens per passage (roughly 300-500 words)
    """
    passages = []
    
    # Split by double newlines (paragraphs) first
    paragraphs = re.split(r'\n\s*\n', text)
    
    current_passage = []
    current_length = 0
    passage_num = 1
    
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        
        # Skip metadata headers
        if para.startswith('#'):
            continue
        
        # Rough word count
        words = len(para.split())
        
        # If single paragraph is too long, split by sentences
        if words > max_tokens:
            sentences = re.split(r'(?<=[.!?])\s+', para)
            for sent in sentences:
                sent_words = len(sent.split())
                if current_length + sent_words > max_tokens and current_passage:
                    # Save current passage
                    passages.append({
                        'text_id': text_id,
                        'corpus': corpus,
                        'passage_num': passage_num,
                        'content': ' '.join(current_passage)
                    })
                    passage_num += 1
                    current_passage = [sent]
                    current_length = sent_words
                else:
                    current_passage.append(sent)
                    current_length += sent_words
        else:
            if current_length + words > max_tokens and current_passage:
                # Save current passage
                passages.append({
                    'text_id': text_id,
                    'corpus': corpus,
                    'passage_num': passage_num,
                    'content': ' '.join(current_passage)
                })
                passage_num += 1
                current_passage = [para]
                current_length = words
            else:
                current_passage.append(para)
                current_length += words
    
    # Don't forget the last passage
    if current_passage:
        passages.append({
            'text_id': text_id,
            'corpus': corpus,
            'passage_num': passage_num,
            'content': ' '.join(current_passage)
        })
    
    return passages

def create_embedding_request(passage, model="models/text-embedding-004"):
    """Create a Gemini batch embedding request"""
    
    # Create unique ID
    unique_str = f"{passage['corpus']}_{passage['text_id']}_{passage['passage_num']}"
    custom_id = hashlib.md5(unique_str.encode()).hexdigest()[:16]
    
    return {
        "custom_id": f"biblical_{passage['corpus']}_{passage['text_id']}_{passage['passage_num']}",
        "request": {
            "model": model,
            "content": {
                "parts": [{"text": passage['content']}]
            }
        },
        "metadata": {
            "corpus": passage['corpus'],
            "text_id": passage['text_id'],
            "passage_num": passage['passage_num'],
            "char_count": len(passage['content']),
            "word_count": len(passage['content'].split())
        }
    }

def process_corpus_directory(corpus_dir):
    """Process all texts in a corpus directory"""
    passages = []
    corpus_name = corpus_dir.name
    
    for txt_file in sorted(corpus_dir.glob("*.txt")):
        text_id = txt_file.stem
        
        with open(txt_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove metadata header
        if content.startswith('#'):
            # Find end of header
            lines = content.split('\n')
            content_start = 0
            for i, line in enumerate(lines):
                if not line.startswith('#') and line.strip():
                    content_start = i
                    break
            content = '\n'.join(lines[content_start:])
        
        # Segment
        text_passages = segment_text(content, text_id, corpus_name)
        passages.extend(text_passages)
        
        print(f"  {text_id}: {len(text_passages)} passages")
    
    return passages

def main():
    if len(sys.argv) < 2:
        corpus_dir = Path("./logos_corpora")
    else:
        corpus_dir = Path(sys.argv[1])
    
    if not corpus_dir.exists():
        print(f"Error: {corpus_dir} not found")
        print("Run download_biblical_corpora.py first")
        sys.exit(1)
    
    print("="*60)
    print("LOGOS CORPUS CONVERTER")
    print("="*60)
    print(f"\nInput: {corpus_dir.absolute()}")
    
    all_passages = []
    
    # Process each corpus subdirectory
    for subdir in sorted(corpus_dir.iterdir()):
        if subdir.is_dir():
            print(f"\nProcessing: {subdir.name}")
            passages = process_corpus_directory(subdir)
            all_passages.extend(passages)
    
    print(f"\n{'='*60}")
    print(f"TOTAL PASSAGES: {len(all_passages)}")
    print(f"{'='*60}")
    
    # Create JSONL for batch embedding
    output_file = corpus_dir.parent / "logos_biblical_batch.jsonl"
    
    print(f"\nCreating batch file: {output_file}")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        for passage in all_passages:
            request = create_embedding_request(passage)
            f.write(json.dumps(request) + '\n')
    
    # Stats
    total_chars = sum(len(p['content']) for p in all_passages)
    total_words = sum(len(p['content'].split()) for p in all_passages)
    
    print(f"\n✓ Batch file created: {output_file}")
    print(f"  Passages: {len(all_passages):,}")
    print(f"  Characters: {total_chars:,}")
    print(f"  Words: {total_words:,}")
    print(f"  Estimated tokens: ~{total_words * 1.3:,.0f}")
    
    # Create summary
    summary = {
        'created': datetime.now().isoformat(),
        'source': str(corpus_dir.absolute()),
        'output': str(output_file.absolute()),
        'stats': {
            'total_passages': len(all_passages),
            'total_characters': total_chars,
            'total_words': total_words,
            'estimated_tokens': int(total_words * 1.3)
        },
        'corpora': {}
    }
    
    for passage in all_passages:
        corpus = passage['corpus']
        if corpus not in summary['corpora']:
            summary['corpora'][corpus] = {'texts': set(), 'passages': 0}
        summary['corpora'][corpus]['texts'].add(passage['text_id'])
        summary['corpora'][corpus]['passages'] += 1
    
    # Convert sets to lists for JSON
    for corpus in summary['corpora']:
        summary['corpora'][corpus]['texts'] = sorted(summary['corpora'][corpus]['texts'])
        summary['corpora'][corpus]['text_count'] = len(summary['corpora'][corpus]['texts'])
    
    summary_file = corpus_dir.parent / "logos_biblical_summary.json"
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"  Summary: {summary_file}")
    
    print(f"\n{'='*60}")
    print("NEXT STEPS:")
    print("="*60)
    print("1. Upload logos_biblical_batch.jsonl to Gemini batch API")
    print("2. Or upload to Railway server for processing")
    print("3. Results will add to LOGOS database")

if __name__ == "__main__":
    main()
