
'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_URL = 'https://logos-api-production-3270.up.railway.app';

export default function TranslatePage() {
  const [input, setInput] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, style: 'literal' })
      });
      const data = await res.json();
      setTranslation(data.translation || 'Translation not available');
    } catch (err) {
      // Fallback demo translations
      const demos: Record<string, string> = {
        'μῆνιν ἄειδε θεὰ': 'Sing, goddess, of the wrath',
        'arma virumque cano': 'I sing of arms and the man',
        'cogito ergo sum': 'I think, therefore I am',
        'γνῶθι σεαυτόν': 'Know thyself',
        'carpe diem': 'Seize the day',
      };
      const lower = input.toLowerCase();
      setTranslation(demos[lower] || 'Enter Greek or Latin text to translate');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <header className="border-b border-gray-800 p-4">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#C9A227]">LOGOS</Link>
          <div className="flex gap-6">
            <Link href="/search" className="hover:text-[#C9A227]">Search</Link>
            <Link href="/translate" className="text-[#C9A227]">Translate</Link>
            <Link href="/discover" className="hover:text-[#C9A227]">Discover</Link>
            <Link href="/semantia" className="hover:text-[#C9A227]">SEMANTIA</Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">AI Translation</h1>
        <p className="text-gray-400 mb-8">Translate Greek and Latin with contextual understanding</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Greek or Latin Text</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-48 px-4 py-3 bg-[#1E1E24] border border-gray-700 rounded-lg focus:border-[#C9A227] focus:outline-none resize-none font-serif text-lg"
            />
            <div className="flex gap-2 mt-3 flex-wrap">
              {['μῆνιν ἄειδε θεὰ', 'arma virumque cano', 'carpe diem'].map((ex) => (
                <button
                  key={ex}
                  onClick={() => setInput(ex)}
                  className="px-3 py-1 bg-[#1E1E24] border border-gray-700 rounded text-sm hover:border-[#C9A227]"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Output */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Translation</label>
            <div className="w-full h-48 px-4 py-3 bg-[#1E1E24] border border-gray-700 rounded-lg text-lg">
              {loading ? (
                <span className="text-gray-500 animate-pulse">Translating...</span>
              ) : (
                translation || <span className="text-gray-500">Translation will appear here</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleTranslate}
          disabled={loading || !input.trim()}
          className="mt-6 px-8 py-3 bg-[#C9A227] text-black font-semibold rounded-lg hover:bg-[#E8D5A3] disabled:opacity-50"
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </main>
    </div>
  );
}
