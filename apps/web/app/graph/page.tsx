'use client';
import React, { useState } from 'react';

const ENTITIES = {
  'Homer': { type: 'Author', dates: 'c. 8th century BCE', connections: ['Virgil', 'Apollonius', 'Quintus'] },
  'Virgil': { type: 'Author', dates: '70-19 BCE', connections: ['Homer', 'Ennius', 'Dante'] },
  'Plato': { type: 'Author', dates: '428-348 BCE', connections: ['Socrates', 'Aristotle', 'Plotinus'] },
};

export default function GraphPage() {
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState('');
  const [entity, setEntity] = useState<string | null>(null);

  const search = () => {
    const key = Object.keys(ENTITIES).find(k => k.toLowerCase().includes(query.toLowerCase()));
    if (key) setEntity(key);
  };

  const data = entity ? ENTITIES[entity as keyof typeof ENTITIES] : null;

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
          <span className="px-4 py-2 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] text-sm">Layer 3: Relationships</span>
          <h1 className="text-5xl font-bold mt-4 mb-4">Knowledge Graph</h1>
          <p className={`text-xl ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Explore connections across the classical world</p>
        </div>
        <div className={`p-6 rounded-2xl mb-8 ${dark ? 'bg-[#1E1E24]' : 'bg-gray-100'}`}>
          <div className="flex gap-4 mb-4">
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Search for person, work, or concept..." className={`flex-1 px-4 py-3 rounded-xl ${dark ? 'bg-[#0D0D0F]' : 'bg-white'}`} />
            <button onClick={search} className="px-8 py-3 bg-[#3B82F6] text-white rounded-xl font-semibold">Search</button>
          </div>
          <div className="flex gap-2">
            {Object.keys(ENTITIES).map(e => <button key={e} onClick={() => { setQuery(e); setEntity(e); }} className={`px-3 py-1 rounded-lg ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>{e}</button>)}
          </div>
        </div>
        {data && (
          <div className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-gray-100'}`}>
            <h2 className="text-3xl font-bold text-[#C9A227] mb-2">{entity}</h2>
            <p className={`mb-4 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{data.type} • {data.dates}</p>
            <h3 className="font-semibold mb-3">Connections</h3>
            <div className="flex flex-wrap gap-3">
              {data.connections.map((c, i) => (
                <button key={i} onClick={() => { setQuery(c); if (ENTITIES[c as keyof typeof ENTITIES]) setEntity(c); }}
                  className={`px-4 py-2 rounded-xl ${dark ? 'bg-[#0D0D0F] hover:bg-[#252530]' : 'bg-white hover:bg-gray-50'}`}>
                  {c} →
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
