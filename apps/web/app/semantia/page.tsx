'use client';
import React, { useState } from 'react';

interface WordResult {
  word: string;
  language: string;
  occurrences: number;
  traditional_def: string;
  semantia_finding: string;
  neighbors: { word: string; sim: number }[];
  challenges_lexicon: boolean;
}

const DEMO: Record<string, WordResult> = {
  'ἀρετή': {
    word: 'ἀρετή', language: 'Greek', occurrences: 4523,
    traditional_def: 'virtue, excellence, goodness (LSJ)',
    semantia_finding: 'Meaning shifted dramatically over 1500 years. In Homer, clusters with warfare and physical prowess. By Plato, ethics and wisdom. Christian period shows major shift toward moral/religious sense.',
    neighbors: [{ word: 'φρόνησις', sim: 0.89 }, { word: 'σωφροσύνη', sim: 0.85 }],
    challenges_lexicon: true,
  },
  'λόγος': {
    word: 'λόγος', language: 'Greek', occurrences: 10663,
    traditional_def: 'word, speech, reason (LSJ)',
    semantia_finding: 'Most semantically complex word in Greek. Clusters differently in philosophical (reason), rhetorical (speech), and theological (Word/divine) contexts.',
    neighbors: [{ word: 'λέγειν', sim: 0.95 }, { word: 'νοῦς', sim: 0.88 }],
    challenges_lexicon: true,
  },
};

export default function SemantiaPage() {
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<WordResult | null>(null);

  const handleSearch = () => {
    const key = Object.keys(DEMO).find(k => query.includes(k));
    if (key) setResult(DEMO[key]);
  };

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#0D0D0F] text-[#F5F4F2]' : 'bg-white text-black'}`}>
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-lg ${dark ? 'bg-[#0D0D0F]/80 border-b border-white/10' : 'bg-white/80 border-b'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-wider">LOGOS</a>
          <button onClick={() => setDark(!dark)} className="p-2">{dark ? '☀️' : '🌙'}</button>
        </div>
      </nav>
      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="px-4 py-2 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-sm">Layer 2: Semantic</span>
          <h1 className="text-5xl font-bold mt-4 mb-4">SEMANTIA</h1>
          <p className={`text-xl ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            What words <span className="text-[#C9A227]">ACTUALLY</span> meant — proven by 1.7M passages
          </p>
        </div>
        <div className={`p-6 rounded-2xl mb-8 ${dark ? 'bg-[#1E1E24]' : 'bg-gray-100'}`}>
          <div className="flex gap-4 mb-4">
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Enter Greek or Latin word (try ἀρετή or λόγος)" className={`flex-1 px-4 py-3 rounded-xl ${dark ? 'bg-[#0D0D0F]' : 'bg-white'}`} />
            <button onClick={handleSearch} className="px-8 py-3 bg-[#8B5CF6] text-white rounded-xl font-semibold">Analyze</button>
          </div>
          <div className="flex gap-2">
            {Object.keys(DEMO).map(w => <button key={w} onClick={() => setQuery(w)} className={`px-3 py-1 rounded-lg ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>{w}</button>)}
          </div>
        </div>
        {result && (
          <div className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-gray-100'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold text-[#C9A227]">{result.word}</h2>
                <p className={dark ? 'text-gray-400' : 'text-gray-600'}>{result.language} • {result.occurrences.toLocaleString()} occurrences</p>
              </div>
              {result.challenges_lexicon && <span className="px-3 py-1 bg-[#F59E0B]/20 text-[#F59E0B] rounded-full text-sm">⚠️ Challenges LSJ</span>}
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div><h3 className="font-semibold mb-2">Traditional Definition</h3><p className={dark ? 'text-gray-400' : 'text-gray-600'}>{result.traditional_def}</p></div>
              <div><h3 className="font-semibold mb-2 text-[#8B5CF6]">SEMANTIA Finding</h3><p>{result.semantia_finding}</p></div>
            </div>
            <h3 className="font-semibold mb-3">Semantic Neighbors</h3>
            <div className="flex gap-3">{result.neighbors.map((n, i) => <span key={i} className={`px-4 py-2 rounded-xl ${dark ? 'bg-[#0D0D0F]' : 'bg-white'}`}>{n.word} <span className="text-gray-500">{(n.sim*100).toFixed(0)}%</span></span>)}</div>
          </div>
        )}
      </main>
    </div>
  );
}
