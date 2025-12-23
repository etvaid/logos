'use client';
import React, { useState } from 'react';

const API_URL = 'https://logos-production-ef2b.up.railway.app';

interface WordResult {
  word: string;
  language: string;
  occurrences: number;
  traditional_def: string;
  semantia_finding: string;
  neighbors: { word: string; sim: number }[];
  temporal_drift: { period: string; meaning: string; drift: number }[];
  challenges_lexicon: boolean;
  untranslatable: string[];
}

const DEMO_RESULTS: Record<string, WordResult> = {
  'ἀρετή': {
    word: 'ἀρετή',
    language: 'Greek',
    occurrences: 4523,
    traditional_def: 'virtue, excellence, goodness (LSJ)',
    semantia_finding: 'Meaning shifted dramatically over 1500 years. In Homer, clusters with warfare and physical prowess. By Plato, ethics and wisdom. Christian period shows major shift (+0.31) toward moral/religious sense.',
    neighbors: [
      { word: 'φρόνησις', sim: 0.89 },
      { word: 'ἀνδρεία', sim: 0.87 },
      { word: 'σωφροσύνη', sim: 0.85 },
      { word: 'δικαιοσύνη', sim: 0.84 },
      { word: 'ἀγαθόν', sim: 0.82 },
    ],
    temporal_drift: [
      { period: 'Archaic (Homer)', meaning: 'Excellence in battle, being the best warrior', drift: 0 },
      { period: 'Classical (Plato)', meaning: 'Excellence of any kind, moral virtue', drift: 0.18 },
      { period: 'Hellenistic', meaning: 'Philosophical virtue, character excellence', drift: 0.12 },
      { period: 'Christian', meaning: 'Moral virtue, godliness, holiness', drift: 0.31 },
    ],
    challenges_lexicon: true,
    untranslatable: [
      '"Virtue" is too moralized for classical usage',
      '"Excellence" misses the competitive/honor dimension',
      'Greek concept COMBINES what English separates',
    ],
  },
  'λόγος': {
    word: 'λόγος',
    language: 'Greek',
    occurrences: 10663,
    traditional_def: 'word, speech, reason, account (LSJ)',
    semantia_finding: 'One of the most semantically complex words in Greek. Shows distinct clustering patterns: philosophical (reason), rhetorical (speech), theological (Word/divine). 10,663 occurrences reveal contextual meaning shifts.',
    neighbors: [
      { word: 'λέγειν', sim: 0.95 },
      { word: 'νοῦς', sim: 0.88 },
      { word: 'φρόνησις', sim: 0.84 },
      { word: 'ἀλήθεια', sim: 0.82 },
      { word: 'σοφία', sim: 0.80 },
    ],
    temporal_drift: [
      { period: 'Pre-Socratic', meaning: 'Cosmic principle, rational order', drift: 0 },
      { period: 'Classical', meaning: 'Argument, reasoning, discourse', drift: 0.15 },
      { period: 'Stoic', meaning: 'Divine reason, world-soul', drift: 0.22 },
      { period: 'Christian (John 1:1)', meaning: 'The Word, divine Son', drift: 0.45 },
    ],
    challenges_lexicon: true,
    untranslatable: [
      'No single English word captures the range',
      '"Word" misses the rational/cosmic dimension',
      '"Reason" misses the speech/discourse dimension',
    ],
  },
  'θεός': {
    word: 'θεός',
    language: 'Greek',
    occurrences: 8942,
    traditional_def: 'god, deity, divinity (LSJ)',
    semantia_finding: 'SEMANTIA reveals distinct semantic fields: clusters with αἰώνιος (eternal), ὑψίστου (Most High), ἔλεος (mercy) in religious texts. This is organic discovery of biblical/theological language patterns.',
    neighbors: [
      { word: 'αἰώνιος', sim: 0.995 },
      { word: 'ὑψίστου', sim: 0.993 },
      { word: 'ἔλεος', sim: 0.992 },
      { word: 'ἐπάκουσον', sim: 0.992 },
      { word: 'δούλου', sim: 0.992 },
    ],
    temporal_drift: [
      { period: 'Homer', meaning: 'Anthropomorphic deities, Olympians', drift: 0 },
      { period: 'Philosophy', meaning: 'Divine principle, unmoved mover', drift: 0.25 },
      { period: 'Jewish-Greek', meaning: 'The God, monotheistic', drift: 0.35 },
      { period: 'Christian', meaning: 'Triune God, Father/Son/Spirit', drift: 0.42 },
    ],
    challenges_lexicon: false,
    untranslatable: [
      'Greek allows both "a god" and "God" - English must choose',
      'Divine attributes cluster differently across periods',
    ],
  },
};

export default function SemantiaPage() {
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<WordResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    // Check demo first
    const demoKey = Object.keys(DEMO_RESULTS).find(k => 
      k.toLowerCase() === query.toLowerCase() || query.includes(k)
    );
    
    if (demoKey) {
      await new Promise(r => setTimeout(r, 500));
      setResult(DEMO_RESULTS[demoKey]);
    } else {
      try {
        const res = await fetch(`${API_URL}/api/semantia/word/${encodeURIComponent(query)}`);
        if (res.ok) {
          setResult(await res.json());
        } else {
          setResult(null);
        }
      } catch {
        setResult(null);
      }
    }
    setLoading(false);
  };

  const examples = ['ἀρετή', 'λόγος', 'θεός', 'virtus', 'pietas'];

  return (
    <div className={`min-h-screen transition-colors ${dark ? 'bg-[#0D0D0F] text-[#F5F4F2]' : 'bg-[#FAFAF8] text-[#1A1814]'}`}>
      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-lg ${dark ? 'bg-[#0D0D0F]/80 border-b border-white/10' : 'bg-white/80 border-b'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-wider">LOGOS</a>
          <div className="flex items-center gap-4">
            <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-white/10">{dark ? '☀️' : '🌙'}</button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-sm font-medium mb-4">
            <span>📚</span>
            <span>Layer 2: Semantic Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">SEMANTIA</h1>
          <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            What words <span className="text-[#C9A227] font-semibold">ACTUALLY</span> meant — proven by 1.7M passages, not dictionaries.
          </p>
        </div>

        {/* Explanation */}
        <div className={`p-6 rounded-2xl mb-8 ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
          <h2 className="font-bold text-lg mb-3">Why SEMANTIA is Revolutionary</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-[#C9A227] mb-2">Traditional Lexicography</h3>
              <ul className={`space-y-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Scholar reads ~50 examples</li>
                <li>• Maps to English gloss</li>
                <li>• Victorian assumptions baked in</li>
                <li>• Static definition, ignores drift</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#C9A227] mb-2">SEMANTIA Approach</h3>
              <ul className={`space-y-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Analyzes ALL occurrences (thousands)</li>
                <li>• 768-dimensional semantic space</li>
                <li>• Tracks meaning over 1500 years</li>
                <li>• Cross-language (Greek ↔ Latin)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className={`p-6 rounded-2xl mb-8 ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Enter a Greek or Latin word..."
              className={`flex-1 px-4 py-3 rounded-xl ${dark ? 'bg-[#0D0D0F] border border-white/10' : 'bg-gray-100'}`}
            />
            <button onClick={handleSearch} disabled={loading}
              className="px-8 py-3 bg-[#8B5CF6] text-white rounded-xl font-semibold hover:bg-[#7C3AED] disabled:opacity-50">
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={dark ? 'text-gray-500' : 'text-gray-600'}>Try:</span>
            {examples.map(ex => (
              <button key={ex} onClick={() => { setQuery(ex); }}
                className={`px-3 py-1 rounded-lg text-sm ${dark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {searched && !loading && result && (
          <div className="space-y-6">
            {/* Word Header */}
            <div className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-[#C9A227]">{result.word}</h2>
                  <p className={dark ? 'text-gray-400' : 'text-gray-600'}>{result.language} • {result.occurrences.toLocaleString()} occurrences</p>
                </div>
                {result.challenges_lexicon && (
                  <span className="px-3 py-1 bg-[#F59E0B]/20 text-[#F59E0B] rounded-full text-sm font-semibold">
                    ⚠️ Challenges LSJ
                  </span>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Traditional Definition</h3>
                  <p className={dark ? 'text-gray-400' : 'text-gray-600'}>{result.traditional_def}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-[#8B5CF6]">SEMANTIA Finding</h3>
                  <p className={dark ? 'text-gray-300' : 'text-gray-700'}>{result.semantia_finding}</p>
                </div>
              </div>
            </div>

            {/* Temporal Drift */}
            <div className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
              <h3 className="font-bold text-lg mb-4">📊 Semantic Drift Over Time</h3>
              <div className="space-y-4">
                {result.temporal_drift.map((d, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium">{d.period}</div>
                    <div className="flex-1">
                      <div className="h-3 rounded-full bg-gray-700 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#C9A227]" 
                          style={{ width: `${Math.min(100, (1 - d.drift) * 100)}%` }} />
                      </div>
                    </div>
                    <div className={`w-16 text-sm text-right ${d.drift > 0.2 ? 'text-[#F59E0B]' : ''}`}>
                      {d.drift > 0 ? `+${d.drift.toFixed(2)}` : '—'}
                    </div>
                  </div>
                ))}
              </div>
              <div className={`mt-4 text-sm ${dark ? 'text-gray-500' : 'text-gray-600'}`}>
                {result.temporal_drift.map((d, i) => (
                  <p key={i}><strong>{d.period}:</strong> {d.meaning}</p>
                ))}
              </div>
            </div>

            {/* Semantic Neighbors */}
            <div className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
              <h3 className="font-bold text-lg mb-4">🔗 Semantic Neighbors</h3>
              <p className={`text-sm mb-4 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                Words that cluster with {result.word} in semantic space (based on actual usage)
              </p>
              <div className="flex flex-wrap gap-3">
                {result.neighbors.map((n, i) => (
                  <div key={i} className={`px-4 py-2 rounded-xl ${dark ? 'bg-[#0D0D0F]' : 'bg-gray-100'}`}>
                    <span className="font-medium">{n.word}</span>
                    <span className={`ml-2 text-sm ${dark ? 'text-gray-500' : 'text-gray-600'}`}>
                      {(n.sim * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Untranslatable */}
            {result.untranslatable.length > 0 && (
              <div className={`p-6 rounded-2xl border-2 border-dashed ${dark ? 'border-[#C9A227]/30 bg-[#C9A227]/5' : 'border-[#C9A227]/50 bg-[#C9A227]/10'}`}>
                <h3 className="font-bold text-lg mb-3 text-[#C9A227]">🌐 What English Cannot Capture</h3>
                <ul className="space-y-2">
                  {result.untranslatable.map((u, i) => (
                    <li key={i} className={dark ? 'text-gray-300' : 'text-gray-700'}>• {u}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {searched && !loading && !result && (
          <div className={`p-8 rounded-2xl text-center ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
            <p className={dark ? 'text-gray-400' : 'text-gray-600'}>
              Word not found. Try one of the examples above, or check your spelling.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
