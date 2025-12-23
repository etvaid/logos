
'use client';

import { useState } from 'react';
import Link from 'next/link';

const DISCOVERIES = [
  { id: 1, title: "Homer's Wine-Dark Sea in Christian Hymns", type: "Pattern", confidence: 87, novelty: 92,
    description: "οἶνοψ πόντος appears 17 times in Homer but also in 4th century Christian hymns.",
    evidence: ["Homer Od. 5.349", "Ephrem Hymn 3.4"] },
  { id: 2, title: "Stoic Vocabulary in Paul's Letters", type: "Influence", confidence: 94, novelty: 76,
    description: "23 technical Stoic terms cluster in Romans 7-8.",
    evidence: ["Rom 7:23", "Epictetus 1.1"] },
  { id: 3, title: "Virgil's Hidden Ennius Debt", type: "Intertextuality", confidence: 82, novelty: 88,
    description: "47 unidentified structural parallels between Aeneid and Annales.",
    evidence: ["Aen. 6.847", "Ennius fr. 500"] },
  { id: 4, title: "θεραπεία Semantic Reversal", type: "Semantic", confidence: 91, novelty: 85,
    description: "From 'service to gods' to 'medical treatment' to 'spiritual healing'.",
    evidence: ["Hdt. 2.37", "Matt 4:23"] },
];

const COLORS: Record<string, string> = { Pattern: "#3B82F6", Influence: "#10B981", Intertextuality: "#F59E0B", Semantic: "#EC4899" };

export default function DiscoverPage() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? DISCOVERIES : DISCOVERIES.filter(d => d.type === filter);

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A227]">LOGOS</Link>
          <div className="flex gap-6 text-sm">
            <Link href="/search" className="hover:text-[#C9A227]">Search</Link>
            <Link href="/translate" className="hover:text-[#C9A227]">Translate</Link>
            <Link href="/discover" className="text-[#C9A227]">Discover</Link>
            <Link href="/semantia" className="hover:text-[#C9A227]">SEMANTIA</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">AI Discovery Engine</h1>
        <p className="text-gray-400 mb-8">Patterns humans cannot see</p>

        <div className="flex gap-2 mb-8">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-[#C9A227] text-black' : 'bg-[#1E1E24]'}`}>All</button>
          {Object.keys(COLORS).map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-lg ${filter === t ? 'bg-[#C9A227] text-black' : 'bg-[#1E1E24]'}`}>{t}</button>
          ))}
        </div>

        <div className="space-y-6">
          {filtered.map(d => (
            <div key={d.id} className="p-6 bg-[#1E1E24] rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: COLORS[d.type] + '33', color: COLORS[d.type] }}>{d.type}</span>
                <span className="ml-auto text-gray-400">Confidence: <span className="text-white">{d.confidence}%</span></span>
                <span className="text-gray-400">Novelty: <span className="text-[#C9A227]">{d.novelty}%</span></span>
              </div>
              <h3 className="text-xl font-bold mb-2">{d.title}</h3>
              <p className="text-gray-300 mb-4">{d.description}</p>
              <div className="flex gap-2">{d.evidence.map((e, i) => <span key={i} className="px-2 py-1 bg-[#0D0D0F] rounded text-sm text-gray-400">{e}</span>)}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
