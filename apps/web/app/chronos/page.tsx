
'use client';

import { useState } from 'react';
import Link from 'next/link';

const CONCEPTS = {
  "ἀρετή": [
    { era: "Archaic", years: "800-500 BCE", color: "#D97706", meaning: "Battle excellence", authors: ["Homer"], pct: 92 },
    { era: "Classical", years: "500-323 BCE", color: "#F59E0B", meaning: "Moral excellence", authors: ["Plato"], pct: 95 },
    { era: "Late Antique", years: "284-600 CE", color: "#7C3AED", meaning: "Christian virtue", authors: ["Augustine"], pct: 90 },
  ],
  "λόγος": [
    { era: "Archaic", years: "800-500 BCE", color: "#D97706", meaning: "Speech, story", authors: ["Homer"], pct: 94 },
    { era: "Classical", years: "500-323 BCE", color: "#F59E0B", meaning: "Reason", authors: ["Plato"], pct: 96 },
    { era: "Late Antique", years: "284-600 CE", color: "#7C3AED", meaning: "Divine Word", authors: ["John"], pct: 93 },
  ],
};

export default function ChronosPage() {
  const [selected, setSelected] = useState<keyof typeof CONCEPTS>("ἀρετή");

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A227]">LOGOS</Link>
          <div className="flex gap-6 text-sm">
            <Link href="/search" className="hover:text-[#C9A227]">Search</Link>
            <Link href="/chronos" className="text-[#C9A227]">CHRONOS</Link>
            <Link href="/maps" className="hover:text-[#C9A227]">Maps</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">CHRONOS</h1>
        <p className="text-gray-400 mb-8">Concept evolution across 1500 years</p>

        <div className="flex gap-4 mb-8">
          {(Object.keys(CONCEPTS) as Array<keyof typeof CONCEPTS>).map(w => (
            <button key={w} onClick={() => setSelected(w)}
              className={`px-6 py-3 rounded-lg font-serif text-xl ${selected === w ? 'bg-[#C9A227] text-black' : 'bg-[#1E1E24] border border-gray-700'}`}>
              {w}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700" />
          {CONCEPTS[selected].map((era, i) => (
            <div key={i} className="relative pl-16 pb-8">
              <div className="absolute left-4 w-5 h-5 rounded-full border-4 border-[#0D0D0F]" style={{ backgroundColor: era.color }} />
              <div className="p-4 bg-[#1E1E24] rounded-lg border-l-4" style={{ borderLeftColor: era.color }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold" style={{ color: era.color }}>{era.era}</span>
                  <span className="text-gray-500 text-sm">{era.years}</span>
                  <span className="ml-auto text-sm text-gray-400">{era.pct}%</span>
                </div>
                <p className="text-lg mb-1">{era.meaning}</p>
                <p className="text-sm text-gray-400">Key: {era.authors.join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
