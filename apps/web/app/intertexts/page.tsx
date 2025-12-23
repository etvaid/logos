'use client';
import React, { useState } from 'react';

const CONNECTIONS = [
  { source: 'Aeneid 1.1', target: 'Iliad 1.1', type: 'Structural', sim: 92, text: 'Arma virumque → μῆνιν ἄειδε' },
  { source: 'Aeneid 1.1', target: 'Odyssey 1.1', type: 'Verbal', sim: 89, text: 'virum → ἄνδρα' },
  { source: 'Aeneid 6.851', target: 'Iliad 6.146', type: 'Thematic', sim: 85, text: 'Leaf simile parallel' },
];

export default function IntertextsPage() {
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
          <span className="px-4 py-2 rounded-full bg-[#10B981]/20 text-[#10B981] text-sm">🔗 Layer 3</span>
          <h1 className="text-5xl font-bold mt-4 mb-4">Intertextuality</h1>
          <p className={`text-xl ${dark ? 'text-gray-400' : 'text-gray-600'}`}>500,000+ connections mapped across the corpus</p>
        </div>
        <div className="space-y-4">
          {CONNECTIONS.map((c, i) => (
            <div key={i} className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-gray-100'}`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-4">
                  <span className="font-bold">{c.source}</span>
                  <span className="text-[#C9A227]">→</span>
                  <span className="font-bold">{c.target}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>{c.type}</span>
                  <span className="text-[#10B981] font-bold">{c.sim}%</span>
                </div>
              </div>
              <p className={`font-serif italic ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{c.text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
