
'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_URL = 'https://logos-api-production-3270.up.railway.app';

const ERA_COLORS: Record<string, string> = {
  archaic: '#D97706',
  classical: '#F59E0B', 
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
  byzantine: '#059669',
};

interface Passage {
  id: number;
  author: string;
  work: string;
  text?: string;
  greek?: string;
  latin?: string;
  translation: string;
  era: string;
  language: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Passage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    
    try {
      const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#C9A227]">LOGOS</Link>
          <div className="flex gap-6">
            <Link href="/search" className="text-[#C9A227]">Search</Link>
            <Link href="/translate" className="hover:text-[#C9A227]">Translate</Link>
            <Link href="/discover" className="hover:text-[#C9A227]">Discover</Link>
            <Link href="/semantia" className="hover:text-[#C9A227]">SEMANTIA</Link>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">Semantic Search</h1>
        <p className="text-gray-400 mb-8">Search 1.6M+ passages by meaning</p>

        {/* Search Box */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for concepts, authors, or text..."
            className="flex-1 px-4 py-3 bg-[#1E1E24] border border-gray-700 rounded-lg focus:border-[#C9A227] focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-3 bg-[#C9A227] text-black font-semibold rounded-lg hover:bg-[#E8D5A3] disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Quick searches */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {['Homer', 'virtue', 'anger', 'love', 'Plato', 'war'].map((term) => (
            <button
              key={term}
              onClick={() => { setQuery(term); }}
              className="px-3 py-1 bg-[#1E1E24] border border-gray-700 rounded-full text-sm hover:border-[#C9A227]"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl">α</div>
            <p className="mt-4 text-gray-400">Searching the corpus...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No results found for "{query}"
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <p className="text-gray-400">{results.length} results found</p>
            {results.map((passage) => (
              <div
                key={passage.id}
                className="p-6 bg-[#1E1E24] rounded-lg border-l-4"
                style={{ borderLeftColor: ERA_COLORS[passage.era] || '#C9A227' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-lg font-bold ${passage.language === 'greek' ? 'text-blue-400' : 'text-red-400'}`}>
                    {passage.language === 'greek' ? 'Α' : 'L'}
                  </span>
                  <span className="font-semibold">{passage.author}</span>
                  <span className="text-gray-400">•</span>
                  <span className="italic text-gray-300">{passage.work}</span>
                  <span 
                    className="ml-auto px-2 py-1 rounded text-xs"
                    style={{ backgroundColor: ERA_COLORS[passage.era] + '33', color: ERA_COLORS[passage.era] }}
                  >
                    {passage.era}
                  </span>
                </div>
                <p className="text-lg mb-2 font-serif">
                  {passage.text || passage.greek || passage.latin}
                </p>
                <p className="text-gray-400 italic">
                  {passage.translation}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
// rebuild Tue Dec 23 10:37:55 EST 2025
