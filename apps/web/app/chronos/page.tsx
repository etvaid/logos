"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Period {
  name: string;
  start: number;
  end: number;
  authors: string[];
}

interface Periods {
  greek: Period[];
  latin: Period[];
}

export default function ChronosPage() {
  const [periods, setPeriods] = useState<Periods>({ greek: [], latin: [] });
  const [selectedLang, setSelectedLang] = useState<"greek" | "latin">("greek");
  const [wordQuery, setWordQuery] = useState("");
  const [wordResult, setWordResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://logos-backend-production-0d96.up.railway.app/chronos/periods")
      .then(r => r.json())
      .then(data => setPeriods(data.periods || { greek: [], latin: [] }))
      .catch(console.error);
  }, []);

  const analyzeWord = async () => {
    if (!wordQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://logos-backend-production-0d96.up.railway.app/chronos/${encodeURIComponent(wordQuery.trim())}`);
      setWordResult(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const currentPeriods = periods[selectedLang] || [];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
          <span className="text-[#F5F3EF]/70">CHRONOS - Temporal Analysis</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          <span className="text-[#C9A962]">CHRONOS</span>
        </h1>
        <p className="text-center text-[#F5F3EF]/70 mb-8">
          Track how word meanings evolved across time periods
        </p>

        {/* Word Analysis */}
        <div className="bg-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/20 mb-8">
          <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Analyze Word Evolution</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={wordQuery}
              onChange={e => setWordQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && analyzeWord()}
              placeholder="Enter a Greek or Latin word..."
              className="flex-1 px-4 py-2 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg"
            />
            <button
              onClick={analyzeWord}
              disabled={loading}
              className="px-6 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold"
            >
              {loading ? "..." : "Analyze"}
            </button>
          </div>
          
          {wordResult && (
            <div className="mt-4 p-4 bg-[#0D0D0F] rounded-lg">
              <h3 className="text-lg font-semibold text-[#C9A962]">{wordResult.word}</h3>
              <p className="text-[#F5F3EF]/70">Total occurrences: {wordResult.total_occurrences}</p>
              {wordResult.drift_score !== undefined && (
                <p className="text-[#F5F3EF]/70">
                  Semantic drift score: {wordResult.drift_score.toFixed(2)}
                  <span className="text-xs ml-2">(0 = stable, 1 = changed)</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Language Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedLang("greek")}
            className={`px-6 py-2 rounded-lg ${selectedLang === "greek" ? "bg-blue-500 text-white" : "bg-blue-500/10 text-blue-400"}`}
          >
            Greek Periods
          </button>
          <button
            onClick={() => setSelectedLang("latin")}
            className={`px-6 py-2 rounded-lg ${selectedLang === "latin" ? "bg-red-500 text-white" : "bg-red-500/10 text-red-400"}`}
          >
            Latin Periods
          </button>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#C9A962]/30"></div>
          <div className="space-y-6">
            {currentPeriods.map((period, i) => (
              <div key={period.name} className="relative pl-16">
                <div className="absolute left-6 w-4 h-4 rounded-full bg-[#C9A962] border-4 border-[#0D0D0F]"></div>
                <div className="bg-[#C9A962]/5 rounded-lg p-4 border border-[#C9A962]/20">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-[#C9A962]">{period.name}</h3>
                    <span className="text-[#F5F3EF]/50 text-sm">
                      {period.start > 0 ? period.start : Math.abs(period.start) + " BCE"} – 
                      {period.end > 0 ? period.end + " CE" : Math.abs(period.end) + " BCE"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {period.authors?.map(author => (
                      <Link
                        key={author}
                        href={`/authors?name=${encodeURIComponent(author)}`}
                        className="text-sm px-2 py-1 bg-[#C9A962]/10 rounded hover:bg-[#C9A962]/20"
                      >
                        {author}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
