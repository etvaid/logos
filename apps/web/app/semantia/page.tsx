"use client";
import { useState } from "react";
import Link from "next/link";

interface WordAnalysis {
  word: string;
  lemma: string;
  corpus_frequency: number;
  definition: string;
  sample_contexts: Array<{
    author: string;
    work: string;
    passage: string;
    reference: string;
  }>;
  status: string;
}

export default function SemantiaPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<WordAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8001/semantia/${encodeURIComponent(query.trim())}`);
      setResult(await res.json());
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
          <span className="text-[#F5F3EF]/70">SEMANTIA</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          <span className="text-[#C9A962]">SEMANTIA</span>
        </h1>
        <p className="text-center text-[#F5F3EF]/70 mb-8">
          Corpus-derived word meanings, not dictionary definitions
        </p>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            placeholder="Enter a Greek or Latin word..."
            className="flex-1 px-4 py-3 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg focus:border-[#C9A962] outline-none"
          />
          <button
            onClick={search}
            disabled={loading}
            className="px-6 py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/80 disabled:opacity-50"
          >
            {loading ? "..." : "Analyze"}
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="bg-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/20">
              <h2 className="text-3xl font-serif text-[#C9A962] mb-2">{result.word}</h2>
              <div className="text-[#F5F3EF]/70 mb-4">Lemma: {result.lemma}</div>
              <div className="text-2xl font-bold text-[#C9A962] mb-2">
                {result.corpus_frequency.toLocaleString()} occurrences
              </div>
              <p className="text-lg">{result.definition}</p>
            </div>

            {result.sample_contexts && result.sample_contexts.length > 0 && (
              <div className="bg-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/20">
                <h3 className="text-xl font-semibold text-[#C9A962] mb-4">Sample Contexts</h3>
                <div className="space-y-4">
                  {result.sample_contexts.map((ctx, i) => (
                    <div key={i} className="border-l-2 border-[#C9A962]/40 pl-4">
                      <div className="text-[#F5F3EF]/70 text-sm mb-1">
                        {ctx.author} - {ctx.work} ({ctx.reference})
                      </div>
                      <p className="font-serif italic">{ctx.passage}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Link
                href={`/reader?search=${result.word}`}
                className="flex-1 text-center py-3 bg-[#C9A962]/10 rounded-lg text-[#C9A962] hover:bg-[#C9A962]/20"
              >
                Find in Texts
              </Link>
              <Link
                href={`/chronos?word=${result.word}`}
                className="flex-1 text-center py-3 bg-[#C9A962]/10 rounded-lg text-[#C9A962] hover:bg-[#C9A962]/20"
              >
                View Evolution
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
