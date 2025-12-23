
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-2xl font-bold text-[#C9A227]">LOGOS</span>
          <div className="flex gap-6 text-sm">
            <Link href="/search" className="hover:text-[#C9A227]">Search</Link>
            <Link href="/translate" className="hover:text-[#C9A227]">Translate</Link>
            <Link href="/discover" className="hover:text-[#C9A227]">Discover</Link>
            <Link href="/semantia" className="hover:text-[#C9A227]">SEMANTIA</Link>
            <Link href="/chronos" className="hover:text-[#C9A227]">CHRONOS</Link>
            <Link href="/maps" className="hover:text-[#C9A227]">Maps</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4 opacity-20 animate-pulse">α β γ δ ε</div>
        <h1 className="text-5xl font-bold mb-4">LOGOS</h1>
        <p className="text-xl text-gray-400 mb-8">AI-Powered Classical Research Platform</p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 1.7 million passages..."
              className="flex-1 px-6 py-4 bg-[#1E1E24] border border-gray-700 rounded-lg text-lg focus:border-[#C9A227] focus:outline-none"
            />
            <button type="submit" className="px-8 py-4 bg-[#C9A227] text-black font-bold rounded-lg hover:bg-[#E8D5A3]">
              Search
            </button>
          </div>
        </form>

        <div className="grid grid-cols-4 gap-8 mb-16">
          <div><div className="text-3xl font-bold text-[#C9A227]">1.7M+</div><div className="text-gray-400">Passages</div></div>
          <div><div className="text-3xl font-bold text-[#C9A227]">892K</div><div className="text-gray-400">Words</div></div>
          <div><div className="text-3xl font-bold text-[#C9A227]">500K+</div><div className="text-gray-400">Connections</div></div>
          <div><div className="text-3xl font-bold text-[#C9A227]">2300</div><div className="text-gray-400">Years</div></div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Link href="/search" className="p-6 bg-[#1E1E24] rounded-lg hover:border-[#C9A227] border border-transparent transition-all">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-bold mb-1">Semantic Search</h3>
            <p className="text-sm text-gray-400">Search by meaning</p>
          </Link>
          <Link href="/translate" className="p-6 bg-[#1E1E24] rounded-lg hover:border-[#C9A227] border border-transparent transition-all">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-bold mb-1">AI Translation</h3>
            <p className="text-sm text-gray-400">Greek & Latin</p>
          </Link>
          <Link href="/discover" className="p-6 bg-[#1E1E24] rounded-lg hover:border-[#C9A227] border border-transparent transition-all">
            <div className="text-2xl mb-2">💡</div>
            <h3 className="font-bold mb-1">Discovery</h3>
            <p className="text-sm text-gray-400">Find patterns</p>
          </Link>
          <Link href="/semantia" className="p-6 bg-[#1E1E24] rounded-lg hover:border-[#C9A227] border border-transparent transition-all">
            <div className="text-2xl mb-2">📖</div>
            <h3 className="font-bold mb-1">SEMANTIA</h3>
            <p className="text-sm text-gray-400">Word meanings</p>
          </Link>
          <Link href="/chronos" className="p-6 bg-[#1E1E24] rounded-lg hover:border-[#C9A227] border border-transparent transition-all">
            <div className="text-2xl mb-2">⏱️</div>
            <h3 className="font-bold mb-1">CHRONOS</h3>
            <p className="text-sm text-gray-400">Concept evolution</p>
          </Link>
          <Link href="/maps" className="p-6 bg-[#1E1E24] rounded-lg hover:border-[#C9A227] border border-transparent transition-all">
            <div className="text-2xl mb-2">🗺️</div>
            <h3 className="font-bold mb-1">Maps</h3>
            <p className="text-sm text-gray-400">Visualizations</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
