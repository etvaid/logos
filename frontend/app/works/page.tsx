"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Work {
  urn: string;
  author: string;
  title: string;
  language: string;
  passage_count: number;
}

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [filtered, setFiltered] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [langFilter, setLangFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("https://logos-backend-production-0d96.up.railway.app/reader/works?limit=500")
      .then(r => r.json())
      .then(data => {
        setWorks(data.works || []);
        setFiltered(data.works || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = works;
    if (langFilter !== "all") {
      result = result.filter(w => w.language?.toLowerCase() === langFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(w => 
        w.title?.toLowerCase().includes(q) || 
        w.author?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [langFilter, searchQuery, works]);

  const languages = [...new Set(works.map(w => w.language?.toLowerCase()).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
          <span className="text-[#F5F3EF]/70">Works Catalog</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-[#C9A962] mb-8">Works Catalog</h1>
        
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Search works or authors..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg"
          />
          <select
            value={langFilter}
            onChange={e => setLangFilter(e.target.value)}
            className="px-4 py-2 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg"
          >
            <option value="all">All Languages</option>
            {languages.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center text-[#F5F3EF]/50">Loading works...</p>
        ) : (
          <>
            <p className="text-[#F5F3EF]/50 mb-4">{filtered.length} works found</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(work => (
                <Link
                  key={work.urn}
                  href={`/reader?urn=${encodeURIComponent(work.urn)}`}
                  className="p-4 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg hover:border-[#C9A962]/40 transition"
                >
                  <h3 className="font-semibold text-[#C9A962] mb-1">{work.title || "Untitled"}</h3>
                  <p className="text-sm text-[#F5F3EF]/70">{work.author || "Unknown"}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-[#F5F3EF]/50">
                    <span className={work.language === "greek" ? "text-blue-400" : "text-red-400"}>
                      {work.language}
                    </span>
                    <span>{work.passage_count} passages</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
