"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface LostWork {
  id: string;
  title: string;
  author: string;
  original_extent: string;
  surviving: string;
  evidence: string;
  themes: string[];
}

export default function GhostPage() {
  const [works, setWorks] = useState<LostWork[]>([]);
  const [selected, setSelected] = useState<LostWork | null>(null);
  const [reconstruction, setReconstruction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8001/ghost/lost")
      .then(r => r.json())
      .then(data => setWorks(data.works || []))
      .catch(console.error);
  }, []);

  const reconstruct = async (workId: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8001/ghost/reconstruct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ work_id: workId, method: "contextual" })
      });
      const data = await res.json();
      setReconstruction(data.reconstruction);
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
          <span className="text-[#F5F3EF]/70">Ghost Texts</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-2">
          <span className="text-[#C9A962]">GHOST</span>
        </h1>
        <p className="text-center text-[#F5F3EF]/70 mb-8">
          Explore and reconstruct lost works of antiquity
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Works List */}
          <div>
            <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Lost Works</h2>
            <div className="space-y-4">
              {works.map(work => (
                <button
                  key={work.id}
                  onClick={() => setSelected(work)}
                  className={`w-full p-4 text-left rounded-lg border transition ${
                    selected?.id === work.id
                      ? "bg-[#C9A962]/20 border-[#C9A962]"
                      : "bg-[#C9A962]/5 border-[#C9A962]/20 hover:border-[#C9A962]/40"
                  }`}
                >
                  <h3 className="font-semibold text-[#C9A962]">{work.title}</h3>
                  <p className="text-sm text-[#F5F3EF]/70">{work.author}</p>
                  <p className="text-xs text-[#F5F3EF]/50 mt-1">{work.surviving}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            {selected ? (
              <div className="bg-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/20">
                <h2 className="text-2xl font-semibold text-[#C9A962] mb-2">{selected.title}</h2>
                <p className="text-lg text-[#F5F3EF]/70 mb-4">{selected.author}</p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#C9A962]">Original Extent</h3>
                    <p className="text-[#F5F3EF]/70">{selected.original_extent}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#C9A962]">Surviving</h3>
                    <p className="text-[#F5F3EF]/70">{selected.surviving}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#C9A962]">Evidence</h3>
                    <p className="text-[#F5F3EF]/70">{selected.evidence}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#C9A962]">Themes</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selected.themes.map(t => (
                        <span key={t} className="px-2 py-1 bg-[#C9A962]/10 text-xs rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => reconstruct(selected.id)}
                  disabled={loading}
                  className="mt-6 w-full py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate Hypothetical Reconstruction"}
                </button>

                {reconstruction && (
                  <div className="mt-4 p-4 bg-[#0D0D0F] rounded-lg border border-[#C9A962]/20">
                    <p className="text-sm text-[#F5F3EF]/70 whitespace-pre-wrap">{reconstruction}</p>
                    <p className="text-xs text-red-400 mt-2">⚠️ This is AI-generated speculation, not recovered text</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#C9A962]/5 rounded-lg p-6 border border-[#C9A962]/20 text-center">
                <p className="text-[#F5F3EF]/50">Select a lost work to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}