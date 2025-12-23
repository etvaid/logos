'use client';
import React, { useState } from 'react';

const API_URL = 'https://logos-production-ef2b.up.railway.app';

interface Result { urn: string; text: string; author: string; work: string; score: number; translation?: string; }

const DEMO: Result[] = [
  { urn: "urn:cts:greekLit:tlg0012.tlg001:1.1", text: "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", author: "Homer", work: "Iliad 1.1", score: 0.95, translation: "Sing, goddess, the wrath of Achilles son of Peleus" },
  { urn: "urn:cts:latinLit:phi0690.phi003:1.1", text: "Arma virumque cano, Troiae qui primus ab oris", author: "Virgil", work: "Aeneid 1.1", score: 0.91, translation: "Arms and the man I sing, who first from the shores of Troy" },
  { urn: "urn:cts:greekLit:tlg0059.tlg030:514b", text: "δικαιοσύνη ἐστὶν ἀρετὴ μεγίστη", author: "Plato", work: "Republic 1.514b", score: 0.87, translation: "Justice is the greatest virtue" },
  { urn: "urn:cts:greekLit:tlg0012.tlg002:1.1", text: "ἄνδρα μοι ἔννεπε, Μοῦσα, πολύτροπον", author: "Homer", work: "Odyssey 1.1", score: 0.85, translation: "Tell me, Muse, of the man of many ways" },
];

export default function SearchPage() {
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'semantic'|'keyword'>('semantic');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expanded, setExpanded] = useState<string|null>(null);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setSearched(true);
    try {
      const res = await fetch(`${API_URL}/api/search/${type}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, limit: 20 }) });
      if (res.ok) { const d = await res.json(); setResults(d.results || []); } else setResults(DEMO);
    } catch { setResults(DEMO); }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#0D0D0F] text-[#F5F4F2]' : 'bg-[#FAFAF8] text-[#1A1814]'}`}>
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-lg ${dark ? 'bg-[#0D0D0F]/80 border-b border-white/10' : 'bg-white/80 border-b'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-wider">LOGOS</a>
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-white/10">{dark ? '☀️' : '🌙'}</button>
        </div>
      </nav>
      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Semantic Search</h1>
        <p className={`mb-8 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Search 1.7M passages by meaning</p>
        <div className={`p-6 rounded-2xl mb-8 ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
          <div className="flex gap-4 mb-4">
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="What is justice? / The nature of virtue..." className={`flex-1 px-4 py-3 rounded-xl ${dark ? 'bg-[#0D0D0F] border border-white/10' : 'bg-gray-100'}`} />
            <button onClick={search} disabled={loading} className="px-8 py-3 bg-[#C9A227] text-black rounded-xl font-semibold">{loading ? '...' : 'Search'}</button>
          </div>
          <div className="flex gap-2">
            {(['semantic', 'keyword'] as const).map(t => (<button key={t} onClick={() => setType(t)} className={`px-3 py-1 rounded-lg text-sm capitalize ${type === t ? 'bg-[#C9A227] text-black' : dark ? 'bg-white/10' : 'bg-gray-100'}`}>{t}</button>))}
          </div>
        </div>
        {searched && <div className="space-y-4">
          {results.length === 0 ? <div className={`p-8 text-center rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>No results</div> : results.map((r, i) => (
            <div key={i} className={`p-5 rounded-2xl cursor-pointer ${dark ? 'bg-[#1E1E24] hover:bg-[#252530]' : 'bg-white border'}`} onClick={() => setExpanded(expanded === r.urn ? null : r.urn)}>
              <div className="flex justify-between items-start mb-2">
                <div><span className="font-semibold">{r.author}</span><span className={`ml-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{r.work}</span></div>
                <span className="px-2 py-1 rounded bg-[#C9A227]/20 text-[#C9A227] text-sm">{(r.score * 100).toFixed(0)}%</span>
              </div>
              <p className="text-lg font-serif mb-2">{r.text}</p>
              {expanded === r.urn && r.translation && <div className={`mt-3 pt-3 border-t ${dark ? 'border-white/10' : 'border-gray-200'}`}><p className="italic">{r.translation}</p><a href={`/read?urn=${encodeURIComponent(r.urn)}`} className="inline-block mt-2 text-[#C9A227] text-sm">Read full →</a></div>}
            </div>
          ))}
        </div>}
      </main>
    </div>
  );
}
