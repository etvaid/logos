"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  total_passages: number;
  total_authors: number;
  total_words: number;
  languages: number;
}

const features = [
  { name: "Reader", href: "/reader", icon: "📖", desc: "Browse 826 works" },
  { name: "Search", href: "/search", icon: "🔍", desc: "6.6M passages" },
  { name: "SEMANTIA", href: "/semantia", icon: "💡", desc: "Word analysis" },
  { name: "Translate", href: "/translate", icon: "🌐", desc: "4 AI styles" },
  { name: "CHRONOS", href: "/chronos", icon: "⏳", desc: "Word evolution" },
  { name: "Connectome", href: "/connectome", icon: "🕸️", desc: "Author network" },
  { name: "Learn", href: "/learn", icon: "🎓", desc: "64 modules" },
  { name: "Maps", href: "/maps", icon: "🗺️", desc: "Ancient world" },
  { name: "Timeline", href: "/timeline", icon: "📅", desc: "800 BCE-600 CE" },
  { name: "Forensic", href: "/forensic", icon: "🔬", desc: "Stylometry" },
  { name: "Discovery", href: "/discovery", icon: "✨", desc: "AI patterns" },
  { name: "Prosody", href: "/prosody", icon: "🎵", desc: "Meter analysis" },
  { name: "Ghost", href: "/ghost", icon: "👻", desc: "Lost works" },
  { name: "Authors", href: "/authors", icon: "👤", desc: "380+ profiles" },
  { name: "Works", href: "/works", icon: "📚", desc: "Complete catalog" },
];

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://logos-backend-production-0d96.up.railway.app/api/stats")
      .then(res => res.json())
      .then(data => {
        setStats({
          total_passages: data.passages || 662449,
          total_authors: data.authors || 380,
          total_words: 331000000,
          languages: Object.keys(data.languages || {}).length || 3
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load stats:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A962]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-8 py-20 relative">
          <div className="text-center">
            <h1 className="text-7xl font-bold mb-4">
              <span className="text-[#C9A962]">LOGOS</span>
            </h1>
            <p className="text-2xl text-[#F5F3EF]/70 mb-2">
              The Complete Classical Research Platform
            </p>
            <p className="text-lg text-[#F5F3EF]/50 max-w-2xl mx-auto">
              AI-powered analysis of Greek, Latin, and Hebrew texts.
              Read, translate, analyze, and discover across 6.6 million passages.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20">
              <div className="text-4xl font-bold text-[#C9A962]">
                {loading ? "..." : stats?.total_passages?.toLocaleString() || "6.6M"}
              </div>
              <div className="text-sm text-[#F5F3EF]/50">Passages</div>
            </div>
            <div className="text-center p-6 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20">
              <div className="text-4xl font-bold text-[#C9A962]">
                {loading ? "..." : stats?.total_authors || "380+"}
              </div>
              <div className="text-sm text-[#F5F3EF]/50">Authors</div>
            </div>
            <div className="text-center p-6 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20">
              <div className="text-4xl font-bold text-[#C9A962]">
                {loading ? "..." : `${Math.round((stats?.total_words || 331000000) / 1000000)}M`}
              </div>
              <div className="text-sm text-[#F5F3EF]/50">Words</div>
            </div>
            <div className="text-center p-6 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20">
              <div className="text-4xl font-bold text-[#C9A962]">
                {loading ? "..." : stats?.languages || 3}
              </div>
              <div className="text-sm text-[#F5F3EF]/50">Languages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="text-[#C9A962]">Explore</span> the Ancient World
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {features.map(feature => (
            <Link
              key={feature.name}
              href={feature.href}
              className="p-6 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg hover:border-[#C9A962]/60 hover:bg-[#C9A962]/10 transition group"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-[#C9A962] group-hover:text-[#F5F3EF] transition">
                {feature.name}
              </h3>
              <p className="text-xs text-[#F5F3EF]/50">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Languages Section */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            <span className="text-[#C9A962]">10 Ancient Languages</span>
          </h2>
          <p className="text-[#F5F3EF]/50 mt-2">
            From Homer to the Dead Sea Scrolls
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {["Greek", "Latin", "Hebrew", "Aramaic", "Sanskrit", "Pali", "Coptic", "Syriac", "Avestan", "Old Persian"].map(lang => (
            <span
              key={lang}
              className="px-4 py-2 bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-full text-sm"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#C9A962]/20 py-8">
        <div className="max-w-7xl mx-auto px-8 text-center text-[#F5F3EF]/50 text-sm">
          <p>LOGOS Classical Research Platform</p>
          <p className="mt-2">Powered by AI • 6.6M passages • 380+ authors</p>
        </div>
      </footer>
    </div>
  );
}