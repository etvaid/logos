"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Pattern {
  id: string;
  order: number;
  type: string;
  pattern: string;
  confidence: number;
  frequency: number;
  description: string;
}

interface Hypothesis {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_time: string;
}

export default function DiscoveryPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8001/discovery/patterns").then(r => r.json()),
      fetch("http://localhost:8001/discovery/hypotheses").then(r => r.json())
    ]).then(([p, h]) => {
      setPatterns(p.patterns || []);
      setHypotheses(h.hypotheses || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredPatterns = selectedOrder === 0 
    ? patterns 
    : patterns.filter(p => p.order === selectedOrder);

  const orderLabels: Record<number, string> = {
    0: "All",
    1: "Syntactic",
    2: "Semantic",
    3: "Thematic",
    4: "Stylistic"
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
          <span className="text-[#F5F3EF]/70">Discovery Engine</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          <span className="text-[#C9A962]">DISCOVERY</span>
        </h1>
        <p className="text-center text-[#F5F3EF]/70 mb-8">
          AI-powered pattern detection across the corpus
        </p>

        {/* Order Filter */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {[0, 1, 2, 3, 4].map(order => (
            <button
              key={order}
              onClick={() => setSelectedOrder(order)}
              className={`px-6 py-2 rounded-lg ${
                selectedOrder === order
                  ? "bg-[#C9A962] text-[#0D0D0F]"
                  : "bg-[#C9A962]/10 text-[#C9A962]"
              }`}
            >
              {orderLabels[order]}
            </button>
          ))}
        </div>

        {/* Patterns */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[#C9A962] mb-6">Discovered Patterns</h2>
          {loading ? (
            <p className="text-center text-[#F5F3EF]/50">Loading patterns...</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredPatterns.map(pattern => (
                <div
                  key={pattern.id}
                  className="bg-[#C9A962]/5 rounded-lg p-4 border border-[#C9A962]/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{pattern.pattern}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      pattern.order === 1 ? "bg-blue-500/20 text-blue-400" :
                      pattern.order === 2 ? "bg-green-500/20 text-green-400" :
                      pattern.order === 3 ? "bg-purple-500/20 text-purple-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {pattern.type}
                    </span>
                  </div>
                  <p className="text-sm text-[#F5F3EF]/70 mb-3">{pattern.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F5F3EF]/50">
                      Confidence: <span className="text-[#C9A962]">{(pattern.confidence * 100).toFixed(0)}%</span>
                    </span>
                    <span className="text-[#F5F3EF]/50">
                      Found {pattern.frequency} times
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Research Hypotheses */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[#C9A962] mb-6">Research Hypotheses</h2>
          <div className="space-y-4">
            {hypotheses.map(h => (
              <div
                key={h.id}
                className="bg-[#C9A962]/5 rounded-lg p-4 border border-[#C9A962]/20"
              >
                <h3 className="font-semibold text-lg text-[#C9A962]">{h.title}</h3>
                <p className="text-[#F5F3EF]/70 mt-1">{h.description}</p>
                <div className="flex gap-4 mt-3 text-sm">
                  <span className="px-2 py-1 bg-[#C9A962]/10 rounded">
                    {h.difficulty}
                  </span>
                  <span className="text-[#F5F3EF]/50">
                    Est. time: {h.estimated_time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Paper */}
        <div className="bg-gradient-to-r from-[#C9A962]/20 to-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/30">
          <h2 className="text-2xl font-semibold text-[#C9A962] mb-4">Generate Research Paper</h2>
          <p className="text-[#F5F3EF]/70 mb-4">
            Use AI to generate a publication-ready research paper based on discovered patterns.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold">
              Generate LaTeX Paper
            </button>
            <button className="px-6 py-3 bg-[#C9A962]/20 text-[#C9A962] rounded-lg font-semibold">
              Export Patterns (JSON)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
