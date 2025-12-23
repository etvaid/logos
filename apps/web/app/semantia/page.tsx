
'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_URL = 'https://logos-api-production-3270.up.railway.app';

const ERA_COLORS: Record<string, string> = {
  'Archaic': '#D97706',
  'Classical': '#F59E0B',
  'Hellenistic': '#3B82F6',
  'Late Antique': '#7C3AED',
};

interface SemanticDrift {
  era: string;
  meaning: string;
  confidence: number;
}

interface WordData {
  word: string;
  transliteration: string;
  traditional: string;
  corpus_meaning: string;
  occurrences: number;
  semantic_drift: SemanticDrift[];
  insight: string;
}

const DEMO_WORDS: Record<string, WordData> = {
  'ἀρετή': {
    word: 'ἀρετή',
    transliteration: 'aretē',
    traditional: 'virtue',
    corpus_meaning: 'excellence; fitness for purpose; moral virtue (later)',
    occurrences: 2847,
    semantic_drift: [
      { era: 'Archaic', meaning: 'excellence in battle, prowess', confidence: 0.92 },
      { era: 'Classical', meaning: 'moral excellence, virtue', confidence: 0.95 },
      { era: 'Hellenistic', meaning: 'philosophical virtue', confidence: 0.88 },
      { era: 'Late Antique', meaning: 'Christian virtue', confidence: 0.90 },
    ],
    insight: 'LSJ misses the crucial semantic shift from Homeric "battle prowess" to Platonic "moral virtue". LOGOS corpus analysis reveals ἀρετή meant physical excellence 78% of the time in archaic texts, vs only 12% in classical philosophy.',
  },
  'λόγος': {
    word: 'λόγος',
    transliteration: 'logos',
    traditional: 'word, reason',
    corpus_meaning: 'structured speech; rational account; cosmic principle; divine Word',
    occurrences: 12453,
    semantic_drift: [
      { era: 'Archaic', meaning: 'speech, story, account', confidence: 0.94 },
      { era: 'Classical', meaning: 'reason, argument, definition', confidence: 0.96 },
      { era: 'Hellenistic', meaning: 'cosmic reason, natural law', confidence: 0.91 },
      { era: 'Late Antique', meaning: 'divine Word, Christ', confidence: 0.93 },
    ],
    insight: 'Logos underwent the most dramatic semantic transformation in Greek - from "story" to "cosmic principle" to "God incarnate".',
  },
  'ψυχή': {
    word: 'ψυχή',
    transliteration: 'psychē',
    traditional: 'soul',
    corpus_meaning: 'breath-soul; life force; immortal soul; rational soul',
    occurrences: 5621,
    semantic_drift: [
      { era: 'Archaic', meaning: 'breath, life-force that departs at death', confidence: 0.93 },
      { era: 'Classical', meaning: 'immortal soul, seat of reason', confidence: 0.95 },
      { era: 'Late Antique', meaning: 'rational Christian soul', confidence: 0.89 },
    ],
    insight: 'Homer\'s ψυχή is NOT Plato\'s. 94% of Homeric uses mean "breath that departs at death" with no moral dimension.',
  },
};

export default function SemantiaPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<WordData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    // Check local demo data first
    if (DEMO_WORDS[query]) {
      setResult(DEMO_WORDS[query]);
      setNotFound(false);
      return;
    }

    // Try API
    try {
      const res = await fetch(`${API_URL}/api/semantia/${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) {
        setResult(null);
        setNotFound(true);
      } else {
        setResult(data);
        setNotFound(false);
      }
    } catch {
      setResult(null);
      setNotFound(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <header className="border-b border-gray-800 p-4">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#C9A227]">LOGOS</Link>
          <div className="flex gap-6">
            <Link href="/search" className="hover:text-[#C9A227]">Search</Link>
            <Link href="/translate" className="hover:text-[#C9A227]">Translate</Link>
            <Link href="/discover" className="hover:text-[#C9A227]">Discover</Link>
            <Link href="/semantia" className="text-[#C9A227]">SEMANTIA</Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">SEMANTIA</h1>
        <p className="text-gray-400 mb-8">Corpus-derived meanings that challenge traditional lexicons</p>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter a Greek or Latin word..."
            className="flex-1 px-4 py-3 bg-[#1E1E24] border border-gray-700 rounded-lg focus:border-[#C9A227] focus:outline-none font-serif text-xl"
          />
          <button
            onClick={handleSearch}
            className="px-8 py-3 bg-[#C9A227] text-black font-semibold rounded-lg hover:bg-[#E8D5A3]"
          >
            Analyze
          </button>
        </div>

        {/* Demo words */}
        <div className="flex gap-2 mb-8">
          {Object.keys(DEMO_WORDS).map((word) => (
            <button
              key={word}
              onClick={() => { setQuery(word); setResult(DEMO_WORDS[word]); setNotFound(false); }}
              className="px-4 py-2 bg-[#1E1E24] border border-gray-700 rounded-lg hover:border-[#C9A227] font-serif"
            >
              {word}
            </button>
          ))}
        </div>

        {notFound && (
          <div className="p-6 bg-[#1E1E24] rounded-lg text-center">
            <p className="text-gray-400">Word not found in demo. Try: ἀρετή, λόγος, or ψυχή</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Header */}
            <div className="p-6 bg-[#1E1E24] rounded-lg">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-5xl font-serif">{result.word}</span>
                <span className="text-xl text-gray-400">{result.transliteration}</span>
                <span className="ml-auto text-[#C9A227]">{result.occurrences.toLocaleString()} occurrences</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Traditional (LSJ)</p>
                  <p className="text-lg">{result.traditional}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">LOGOS Corpus-Derived</p>
                  <p className="text-lg text-[#C9A227]">{result.corpus_meaning}</p>
                </div>
              </div>
            </div>

            {/* Semantic Drift */}
            <div className="p-6 bg-[#1E1E24] rounded-lg">
              <h3 className="text-xl font-bold mb-4">Semantic Evolution</h3>
              <div className="space-y-4">
                {result.semantic_drift.map((era, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div 
                      className="w-24 text-center py-1 rounded text-sm font-semibold"
                      style={{ backgroundColor: ERA_COLORS[era.era] + '33', color: ERA_COLORS[era.era] }}
                    >
                      {era.era}
                    </div>
                    <div className="flex-1">
                      <p>{era.meaning}</p>
                    </div>
                    <div className="text-gray-400">
                      {Math.round(era.confidence * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight */}
            <div className="p-6 bg-gradient-to-r from-[#C9A227]/20 to-transparent border border-[#C9A227]/30 rounded-lg">
              <h3 className="text-lg font-bold text-[#C9A227] mb-2">💡 LOGOS Insight</h3>
              <p>{result.insight}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
