"use client";
import { useState } from "react";
import Link from "next/link";

interface SearchResult {
  id: number;
  urn: string;
  author: string;
  work: string;
  passage: string;
  reference: string;
  language: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<"text" | "semantic">("text");

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8001/search/${searchType}?q=${encodeURIComponent(query.trim())}&limit=50`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
          <span className="text-[#F5F3EF]/70">Search</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center text-[#C9A962] mb-8">Search Corpus</h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSearchType("text")}
            className={`px-4 py-2 rounded ${searchType === "text" ? "bg-[#C9A962] text-[#0D0D0F]" : "bg-[#C9A962]/10 text-[#C9A962]"}`}
          >
            Text Search
          </button>
          <button
            onClick={() => setSearchType("semantic")}
            className={`px-4 py-2 rounded ${searchType === "semantic" ? "bg-[#C9A962] text-[#0D0D0F]" : "bg-[#C9A962]/10 text-[#C9A962]"}`}
          >
            Semantic Search
          </button>
        </div>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            placeholder="Search for words, phrases, or concepts..."
            className="flex-1 px-4 py-3 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg focus:border-[#C9A962] outline-none"
          />
          <button
            onClick={search}
            disabled={loading}
            className="px-6 py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/80 disabled:opacity-50"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        <div className="space-y-4">
          {results.length === 0 && query && !loading && (
            <p className="text-center text-[#F5F3EF]/50">No results found</p>
          )}
          {results.map(r => (
            <div key={r.id} className="bg-[#C9A962]/5 rounded-lg p-4 border border-[#C9A962]/20">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-[#C9A962]">{r.author}</span>
                  <span className="text-[#F5F3EF]/50 mx-2">-</span>
                  <span>{r.work}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  r.language === "greek" ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {r.language}
                </span>
              </div>
              <p className="font-serif text-lg">{r.passage}</p>
              <div className="text-[#F5F3EF]/50 text-sm mt-2">{r.reference}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
