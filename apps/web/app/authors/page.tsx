"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Author {
  name: string;
  language: string;
  passage_count: number;
  has_profile: boolean;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [langFilter, setLangFilter] = useState<string>("all");

  useEffect(() => {
    fetch("http://localhost:8001/authorship/authors")
      .then(r => r.json())
      .then(data => {
        setAuthors(data.authors || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = langFilter === "all" 
    ? authors 
    : authors.filter(a => a.language?.toLowerCase() === langFilter);

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
          <span className="text-[#F5F3EF]/70">Authors</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-[#C9A962] mb-8">Authors</h1>
        
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setLangFilter("all")}
            className={`px-4 py-2 rounded ${langFilter === "all" ? "bg-[#C9A962] text-[#0D0D0F]" : "bg-[#C9A962]/10"}`}
          >
            All
          </button>
          <button
            onClick={() => setLangFilter("greek")}
            className={`px-4 py-2 rounded ${langFilter === "greek" ? "bg-blue-500 text-white" : "bg-blue-500/10 text-blue-400"}`}
          >
            Greek
          </button>
          <button
            onClick={() => setLangFilter("latin")}
            className={`px-4 py-2 rounded ${langFilter === "latin" ? "bg-red-500 text-white" : "bg-red-500/10 text-red-400"}`}
          >
            Latin
          </button>
        </div>

        {loading ? (
          <p className="text-center text-[#F5F3EF]/50">Loading authors...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(author => (
              <Link
                key={author.name}
                href={`/works?author=${encodeURIComponent(author.name)}`}
                className="p-4 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg hover:border-[#C9A962]/40 transition"
              >
                <h3 className="font-semibold text-lg mb-1">{author.name}</h3>
                <div className="flex justify-between items-center text-sm">
                  <span className={author.language === "greek" ? "text-blue-400" : "text-red-400"}>
                    {author.language}
                  </span>
                  <span className="text-[#F5F3EF]/50">{author.passage_count} passages</span>
                </div>
                {author.has_profile && (
                  <span className="inline-block mt-2 text-xs px-2 py-1 bg-[#C9A962]/20 text-[#C9A962] rounded">
                    Stylometric Profile
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
