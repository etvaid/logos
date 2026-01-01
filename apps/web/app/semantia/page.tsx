"use client";

import { useState } from "react";
import Link from "next/link";

interface Context {
  id: number;
  author: string;
  work: string;
  passage: string;
  reference: string;
  language: string;
}

interface AuthorDist {
  author: string;
  count: number;
}

interface WordAnalysis {
  word: string;
  frequency: number;
  sample_contexts: Context[];
  author_distribution: AuthorDist[];
  top_works: { work: string; count: number }[];
}

export default function SemantiaPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<WordAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeWord = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`http://localhost:8001/semantia/word/${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") analyzeWord();
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Navigation */}
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962] hover:text-[#F5F3EF] transition">
            LOGOS
          </Link>
          <span className="text-[#F5F3EF]/70">Corpus Word Analysis</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#C9A962]">SEMANTIA</span>
          </h1>
          <p className="text-[#F5F3EF]/70">
            Discover word meanings from actual usage across 6.6 million passages
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a Greek or Latin word (e.g., logos, amor, θεός)"
            className="flex-1 px-6 py-4 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg font-serif text-xl focus:border-[#C9A962] outline-none"
          />
          <button
            onClick={analyzeWord}
            disabled={loading || !query.trim()}
            className="px-8 py-4 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-bold hover:bg-[#F5F3EF] transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Frequency Card */}
            <div className="bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-serif text-[#C9A962]">{result.word}</h2>
                  <p className="text-[#F5F3EF]/70">Word Analysis</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-[#C9A962]">{result.frequency.toLocaleString()}</div>
                  <p className="text-[#F5F3EF]/70">occurrences</p>
                </div>
              </div>
            </div>

            {/* Two-Column Layout */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contexts */}
              <div>
                <h3 className="text-xl font-semibold text-[#C9A962] mb-4">
                  Sample Contexts ({result.sample_contexts.length})
                </h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {result.sample_contexts.map((ctx, i) => (
                    <div key={i} className="p-4 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg">
                      <div className="flex justify-between text-sm text-[#F5F3EF]/50 mb-2">
                        <span>{ctx.author}</span>
                        <span>{ctx.work}</span>
                      </div>
                      <p className="font-serif text-[#F5F3EF]/90 leading-relaxed">
                        {ctx.passage}
                      </p>
                      {ctx.reference && (
                        <p className="mt-2 text-xs text-[#C9A962]">{ctx.reference}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-6">
                {/* Author Distribution */}
                <div>
                  <h3 className="text-xl font-semibold text-[#C9A962] mb-4">
                    Top Authors
                  </h3>
                  <div className="space-y-2">
                    {result.author_distribution.slice(0, 10).map((a, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{a.author}</span>
                            <span className="text-[#C9A962]">{a.count.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-[#C9A962]/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#C9A962]"
                              style={{
                                width: `${(a.count / result.author_distribution[0].count) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Works */}
                {result.top_works && result.top_works.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-[#C9A962] mb-4">
                      Top Works
                    </h3>
                    <div className="space-y-2">
                      {result.top_works.slice(0, 8).map((w, i) => (
                        <div key={i} className="flex justify-between p-2 bg-[#C9A962]/5 rounded">
                          <span className="text-sm truncate mr-2">{w.work}</span>
                          <span className="text-[#C9A962] text-sm">{w.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Intro when no results */}
        {!result && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-[#C9A962] mb-2">
              Corpus-Derived Meanings
            </h2>
            <p className="text-[#F5F3EF]/70 max-w-xl mx-auto">
              Unlike dictionaries, SEMANTIA shows you how words are actually used
              across the entire corpus of 6.6 million passages from 380+ ancient authors.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["λόγος", "amor", "θεός", "virtus", "ψυχή", "pietas"].map(word => (
                <button
                  key={word}
                  onClick={() => { setQuery(word); }}
                  className="px-4 py-2 bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-full font-serif hover:bg-[#C9A962]/20 transition"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}