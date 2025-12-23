'use client';
import React, { useState } from 'react';

const FRAGMENTS = [
  { author: 'Ennius', work: 'Annales (Lost)', text: 'O Tite tute Tati tibi tanta tyranne tulisti', source: 'Quoted by Cicero', confidence: 92 },
  { author: 'Ennius', work: 'Annales (Lost)', text: 'Moribus antiquis res stat Romana virisque', source: 'Quoted by Augustine', confidence: 95 },
  { author: 'Sappho', work: 'Lost Poems', text: 'Fragment 16: Some say cavalry, others infantry...', source: 'Quoted by various', confidence: 88 },
];

export default function GhostPage() {
  const [dark, setDark] = useState(true);

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
          <span className="px-4 py-2 rounded-full bg-[#EC4899]/20 text-[#EC4899] text-sm">👻 Lost Works</span>
          <h1 className="text-5xl font-bold mt-4 mb-4">Ghost Texts</h1>
          <p className={`text-xl ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Discover works that survive only through quotations</p>
        </div>
        <div className="grid gap-4">
          {FRAGMENTS.map((f, i) => (
            <div key={i} className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-gray-100'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{f.author}</h3>
                  <p className="text-[#EC4899]">{f.work}</p>
                </div>
                <span className="px-3 py-1 bg-[#C9A227]/20 text-[#C9A227] rounded-full text-sm">{f.confidence}% confident</span>
              </div>
              <p className="font-serif text-lg italic mb-2">"{f.text}"</p>
              <p className={dark ? 'text-gray-500' : 'text-gray-600'}>Source: {f.source}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
