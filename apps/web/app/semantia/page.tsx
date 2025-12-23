
'use client';

import { useState } from 'react';
import Link from 'next/link';

const WORDS = {
  "ἀρετή": {
    word: "ἀρετή", translit: "aretē", traditional: "virtue",
    corpus: "excellence → moral virtue → Christian virtue",
    count: 2847,
    drift: [
      { era: "Archaic", meaning: "Battle excellence", pct: 92, color: "#D97706" },
      { era: "Classical", meaning: "Moral excellence", pct: 95, color: "#F59E0B" },
      { era: "Late Antique", meaning: "Christian virtue", pct: 90, color: "#7C3AED" },
    ],
    insight: "LSJ misses the shift from Homeric battle prowess to Platonic moral virtue.",
  },
  "λόγος": {
    word: "λόγος", translit: "logos", traditional: "word, reason",
    corpus: "speech → reason → cosmic principle → divine Word",
    count: 12453,
    drift: [
      { era: "Archaic", meaning: "Speech, story", pct: 94, color: "#D97706" },
      { era: "Classical", meaning: "Reason, argument", pct: 96, color: "#F59E0B" },
      { era: "Late Antique", meaning: "Divine Word", pct: 93, color: "#7C3AED" },
    ],
    insight: "Most dramatic semantic transformation in Greek.",
  },
  "ψυχή": {
    word: "ψυχή", translit: "psychē", traditional: "soul",
    corpus: "breath-soul → immortal soul",
    count: 5621,
    drift: [
      { era: "Archaic", meaning: "Breath, life-force", pct: 93, color: "#D97706" },
      { era: "Classical", meaning: "Immortal soul", pct: 95, color: "#F59E0B" },
    ],
    insight: "Homer's psychē is NOT Plato's.",
  },
};

export default function SemantiaPage() {
  const [selected, setSelected] = useState<keyof typeof WORDS | null>(null);
  const word = selected ? WORDS[selected] : null;

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A227]">LOGOS</Link>
          <div className="flex gap-6 text-sm">
            <Link href="/search" className="hover:text-[#C9A227]">Search</Link>
            <Link href="/translate" className="hover:text-[#C9A227]">Translate</Link>
            <Link href="/semantia" className="text-[#C9A227]">SEMANTIA</Link>
            <Link href="/maps" className="hover:text-[#C9A227]">Maps</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">SEMANTIA</h1>
        <p className="text-gray-400 mb-8">Corpus-derived meanings</p>

        <div className="flex gap-4 mb-8">
          {(Object.keys(WORDS) as Array<keyof typeof WORDS>).map(w => (
            <button key={w} onClick={() => setSelected(w)}
              className={`px-6 py-3 rounded-lg font-serif text-xl border ${selected === w ? 'bg-[#C9A227] text-black' : 'bg-[#1E1E24] border-gray-700 hover:border-[#C9A227]'}`}>
              {w}
            </button>
          ))}
        </div>

        {word && (
          <div className="space-y-6">
            <div className="p-6 bg-[#1E1E24] rounded-lg">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-5xl font-serif">{word.word}</span>
                <span className="text-xl text-gray-400">{word.translit}</span>
                <span className="ml-auto text-[#C9A227]">{word.count.toLocaleString()} occurrences</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-400">Traditional</p><p className="text-lg">{word.traditional}</p></div>
                <div><p className="text-sm text-gray-400">LOGOS Corpus</p><p className="text-lg text-[#C9A227]">{word.corpus}</p></div>
              </div>
            </div>

            <div className="p-6 bg-[#1E1E24] rounded-lg">
              <h3 className="text-xl font-bold mb-4">Semantic Evolution</h3>
              {word.drift.map((d, i) => (
                <div key={i} className="flex items-center gap-4 mb-3">
                  <div className="w-28 text-center py-2 rounded font-semibold text-sm" style={{ backgroundColor: d.color + '33', color: d.color }}>{d.era}</div>
                  <div className="flex-1">{d.meaning}</div>
                  <div className="w-16">
                    <div className="h-2 bg-gray-700 rounded-full"><div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.color }} /></div>
                    <div className="text-xs text-gray-400 text-center mt-1">{d.pct}%</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gradient-to-r from-[#C9A227]/20 to-transparent border border-[#C9A227]/30 rounded-lg">
              <h3 className="text-lg font-bold text-[#C9A227] mb-2">💡 LOGOS Insight</h3>
              <p>{word.insight}</p>
            </div>
          </div>
        )}

        {!word && <div className="text-center py-12 text-gray-400">Click a word above</div>}
      </main>
    </div>
  );
}
