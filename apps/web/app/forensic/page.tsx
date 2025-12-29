"use client";
import { useState } from "react";
import Link from "next/link";

interface Candidate {
  author: string;
  confidence: number;
  method: string;
}

interface DisputedText {
  id: string;
  title: string;
  traditional_author: string;
  disputed_by: string[];
  arguments: string;
}

export default function ForensicPage() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("greek");
  const [results, setResults] = useState<Candidate[]>([]);
  const [disputed, setDisputed] = useState<DisputedText[]>([]);
  const [loading, setLoading] = useState(false);

  useState(() => {
    fetch("http://localhost:8001/authorship/disputed")
      .then(r => r.json())
      .then(data => setDisputed(data.texts || []))
      .catch(console.error);
  });

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8001/authorship/attribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), language })
      });
      const data = await res.json();
      setResults(data.candidates || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
          <span className="text-[#F5F3EF]/70">Forensic Stylometry</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          <span className="text-[#C9A962]">FORENSIC</span>
        </h1>
        <p className="text-center text-[#F5F3EF]/70 mb-8">
          Authorship attribution using stylometric analysis
        </p>

        {/* Input Section */}
        <div className="bg-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/20 mb-8">
          <div className="flex gap-4 mb-4">
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="px-4 py-2 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg"
            >
              <option value="greek">Greek</option>
              <option value="latin">Latin</option>
            </select>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste text for authorship analysis..."
            className="w-full h-40 px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg font-serif"
          />
          <button
            onClick={analyze}
            disabled={loading || !text.trim()}
            className="mt-4 w-full py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Authorship"}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/20 mb-8">
            <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Attribution Results</h2>
            <div className="space-y-3">
              {results.map((candidate, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-[#C9A962]/50 w-8">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">{candidate.author}</span>
                      <span className="text-[#F5F3EF]/50">{(candidate.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-[#0D0D0F] rounded-full h-2">
                      <div
                        className="bg-[#C9A962] h-2 rounded-full"
                        style={{ width: `${candidate.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[#F5F3EF]/30">{candidate.method}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Famous Disputed Texts */}
        <div>
          <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Famous Disputed Texts</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {disputed.map(d => (
              <div key={d.id} className="bg-[#C9A962]/5 rounded-lg p-4 border border-[#C9A962]/20">
                <h3 className="font-semibold text-[#C9A962]">{d.title}</h3>
                <p className="text-sm text-[#F5F3EF]/70">
                  Traditional: <span className="text-[#F5F3EF]">{d.traditional_author}</span>
                </p>
                <p className="text-sm text-[#F5F3EF]/50 mt-2">{d.arguments}</p>
                <div className="flex gap-2 mt-2">
                  {d.disputed_by?.map(name => (
                    <span key={name} className="text-xs px-2 py-1 bg-[#C9A962]/10 rounded">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Methods Explained */}
        <div className="mt-8 bg-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/20">
          <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Stylometric Methods</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Burrows' Delta", desc: "Most frequent word frequencies compared to author norms" },
              { name: "Function Words", desc: "Analysis of particles, conjunctions, prepositions" },
              { name: "Sentence Structure", desc: "Mean sentence length, clause distribution" }
            ].map(method => (
              <div key={method.name} className="p-3 bg-[#0D0D0F] rounded-lg">
                <h3 className="font-semibold text-sm text-[#C9A962]">{method.name}</h3>
                <p className="text-xs text-[#F5F3EF]/50 mt-1">{method.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
