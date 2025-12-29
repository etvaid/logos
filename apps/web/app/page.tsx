"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface CorpusStats {
  total_passages: number;
  total_authors: number;
  total_words: number;
  languages: number;
}

interface LanguageAvailability {
  [key: string]: { status: string; count: number };
}

export default function Home() {
  const [stats, setStats] = useState<CorpusStats | null>(null);
  const [availability, setAvailability] = useState<LanguageAvailability>({});
  const [passagesCount, setPassagesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, availRes, worksRes] = await Promise.all([
          fetch("http://localhost:8001/corpus/stats"),
          fetch("http://localhost:8001/corpus/availability"),
          fetch("http://localhost:8001/reader/works?limit=1")
        ]);
        
        if (statsRes.ok) setStats(await statsRes.json());
        if (availRes.ok) setAvailability(await availRes.json());
        if (worksRes.ok) {
          const worksData = await worksRes.json();
          setPassagesCount(worksData.passages_available || 0);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  const features = [
    { title: "Reader", desc: "Read texts with morphological analysis", href: "/reader", icon: "📖", color: "blue" },
    { title: "SEMANTIA", desc: "Corpus-derived word meanings", href: "/semantia", icon: "🧠", color: "purple" },
    { title: "Translate", desc: "AI translation with 4 styles", href: "/translate", icon: "🔄", color: "green" },
    { title: "CHRONOS", desc: "Track meaning evolution over time", href: "/chronos", icon: "⏳", color: "amber" },
    { title: "Connectome", desc: "Intertextuality network", href: "/connectome", icon: "🔗", color: "cyan" },
    { title: "Learn", desc: "64 modules, XP, gamification", href: "/learn", icon: "🎓", color: "pink" },
    { title: "Search", desc: "Full-text and semantic search", href: "/search", icon: "🔍", color: "indigo" },
    { title: "Forensic", desc: "Stylometry & attribution", href: "/forensic", icon: "🔬", color: "red" },
    { title: "Discovery", desc: "AI pattern detection", href: "/discovery", icon: "💡", color: "yellow" },
    { title: "Works", desc: "Browse all works", href: "/works", icon: "📚", color: "teal" },
    { title: "Authors", desc: "Author catalog", href: "/authors", icon: "👤", color: "orange" },
    { title: "Atlas", desc: "Interactive historical maps", href: "/maps", icon: "🗺️", color: "emerald" },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Navigation */}
      <nav className="border-b border-[#C9A962]/20 bg-[#0D0D0F]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
            <div className="hidden md:flex gap-6">
              <Link href="/reader" className="hover:text-[#C9A962] transition">Reader</Link>
              <Link href="/semantia" className="hover:text-[#C9A962] transition">SEMANTIA</Link>
              <Link href="/translate" className="hover:text-[#C9A962] transition">Translate</Link>
              <Link href="/search" className="hover:text-[#C9A962] transition">Search</Link>
              <Link href="/learn" className="hover:text-[#C9A962] transition">Learn</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A962]/5 to-transparent"></div>
        <div className="relative z-10">
          <div className="text-6xl mb-4 animate-pulse">🏛️</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="text-[#C9A962]">LOGOS</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#F5F3EF]/70 mb-2">
            The Bible for Classical Studies
          </p>
          <p className="text-lg text-[#F5F3EF]/50 mb-8 max-w-2xl mx-auto">
            Explore ancient Greek and Latin texts with AI-powered analysis, 
            semantic search, and scholarly tools.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/reader" className="px-8 py-4 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/80 transition text-lg">
              📖 Start Reading
            </Link>
            <Link href="/search" className="px-8 py-4 border-2 border-[#C9A962] text-[#C9A962] rounded-lg font-semibold hover:bg-[#C9A962]/10 transition text-lg">
              🔍 Search Corpus
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-[#C9A962]/20 bg-[#C9A962]/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-[#C9A962]">
              {stats ? formatNumber(stats.total_passages) : "..."}
            </div>
            <div className="text-[#F5F3EF]/70">Source Texts</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-[#C9A962]">
              {passagesCount ? formatNumber(passagesCount) : "97K"}
            </div>
            <div className="text-[#F5F3EF]/70">Passages</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-[#C9A962]">
              {stats ? formatNumber(stats.total_authors) : "..."}
            </div>
            <div className="text-[#F5F3EF]/70">Authors</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-[#C9A962]">
              {stats ? formatNumber(stats.total_words) : "..."}
            </div>
            <div className="text-[#F5F3EF]/70">Words</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-[#C9A962]">
              {stats ? stats.languages : "..."}
            </div>
            <div className="text-[#F5F3EF]/70">Languages</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Powerful Tools for Scholars</h2>
          <p className="text-center text-[#F5F3EF]/50 mb-12">
            Everything you need to read, analyze, and explore classical texts
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {features.map(f => (
              <Link 
                key={f.title} 
                href={f.href} 
                className="group p-5 bg-[#C9A962]/5 rounded-xl border border-[#C9A962]/20 hover:border-[#C9A962]/50 hover:bg-[#C9A962]/10 transition-all"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-lg font-semibold text-[#C9A962] mb-1">{f.title}</h3>
                <p className="text-sm text-[#F5F3EF]/60">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-16 px-4 bg-[#C9A962]/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Corpus Languages</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(availability).map(([lang, info]) => (
              <div key={lang} className="p-4 bg-[#0D0D0F] rounded-lg border border-[#C9A962]/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="capitalize font-semibold text-lg">{lang}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    info.status === "available" ? "bg-green-500/20 text-green-400" :
                    info.status === "partial" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    {info.status === "coming_soon" ? "Coming" : info.status}
                  </span>
                </div>
                {info.count > 0 && (
                  <div className="text-2xl font-bold text-[#C9A962]">
                    {formatNumber(info.count)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
        <p className="text-[#F5F3EF]/70 mb-8 max-w-2xl mx-auto">
          Dive into thousands of ancient texts with modern digital humanities tools.
        </p>
        <Link 
          href="/works" 
          className="inline-block px-8 py-4 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/80 transition text-lg"
        >
          Browse All Works →
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#C9A962]/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#F5F3EF]/50">
            LOGOS - The Bible for Classical Studies
          </div>
          <div className="flex gap-6 text-sm text-[#F5F3EF]/50">
            <Link href="/about" className="hover:text-[#C9A962]">About</Link>
            <Link href="/api" className="hover:text-[#C9A962]">API</Link>
            <a href="https://github.com/etvaid/logos" className="hover:text-[#C9A962]">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
