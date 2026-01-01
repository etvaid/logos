"use client";

import { useState } from "react";
import Link from "next/link";

interface SearchResult {
  id: number;
  author: string;
  work: string;
  passage: string;
  reference: string;
  language: string;
}

interface SearchResponse {
  query: string;
  total: number;
  results: SearchResult[];
  filters: {
    language: string | null;
    author: string | null;
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [author, setAuthor] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({ q: query });
      if (language) params.append("language", language);
      if (author) params.append("author", author);
      
      const res = await fetch(`http://localhost:8001/search/text?${params}`);
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setResults(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") search();
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Navigation */}
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962] hover:text-[#F5F3EF] transition">
            LOGOS
          </Link>
          <span className="text-[#F5F3EF]/70">Corpus Search</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#C9A962]">SEARCH</span>
          </h1>
          <p className="text-[#F5F3EF]/70">
            Search across 6.6 million passages from the ancient world
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for words, phrases, or concepts..."
              className="flex-1 px-6 py-4 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg text-lg focus:border-[#C9A962] outline-none"
            />
            <button
              onClick={search}
              disabled={loading || !query.trim()}
              className="px-8 py-4 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-bold hover:bg-[#F5F3EF] transition disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg focus:border-[#C9A962] outline-none"
          >
            <option value="">All Languages</option>
            <option value="greek">Greek</option>
            <option value="latin">Latin</option>
            <option value="hebrew">Hebrew</option>
          </select>
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Filter by author..."
            className="px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg focus:border-[#C9A962] outline-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Found <span className="text-[#C9A962]">{results.total.toLocaleString()}</span> results
              </h2>
            </div>

            <div className="space-y-4">
              {results.results.map((r, i) => (
                <div key={i} className="p-6 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg hover:border-[#C9A962]/40 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-semibold text-[#C9A962]">{r.author}</span>
                      <span className="text-[#F5F3EF]/50 mx-2">•</span>
                      <span className="text-[#F5F3EF]/70">{r.work}</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-[#C9A962]/10 rounded text-[#C9A962]">
                      {r.language}
                    </span>
                  </div>
                  <p className="font-serif text-[#F5F3EF]/90 leading-relaxed">
                    {r.passage}
                  </p>
                  {r.reference && (
                    <p className="mt-3 text-xs text-[#F5F3EF]/50">{r.reference}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!results && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-[#C9A962] mb-2">
              Full-Text Search
            </h2>
            <p className="text-[#F5F3EF]/70 max-w-xl mx-auto">
              Search through the complete LOGOS corpus including Homer, Plato, Aristotle,
              Virgil, Cicero, and 380+ other ancient authors.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}