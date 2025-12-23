
'use client';

import Link from 'next/link';

const MAPS = [
  { href: "/maps/languages", title: "Language Distribution", desc: "Where Greek and Latin dominated", color: "#3B82F6" },
  { href: "/maps/political", title: "Political Control", desc: "2000 years of empires", color: "#DC2626" },
  { href: "/maps/authors", title: "Author Origins", desc: "Where writers came from", color: "#10B981" },
  { href: "/timeline", title: "Timeline", desc: "Events across 2300 years", color: "#F59E0B" },
];

export default function MapsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A227]">LOGOS</Link>
          <div className="flex gap-6 text-sm">
            <Link href="/search" className="hover:text-[#C9A227]">Search</Link>
            <Link href="/translate" className="hover:text-[#C9A227]">Translate</Link>
            <Link href="/maps" className="text-[#C9A227]">Maps</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">Interactive Maps</h1>
        <p className="text-gray-400 mb-8">Visualize the classical world</p>

        <div className="grid md:grid-cols-2 gap-6">
          {MAPS.map(m => (
            <Link key={m.href} href={m.href} className="p-6 bg-[#1E1E24] rounded-lg border border-transparent hover:border-[#C9A227]">
              <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-2xl" style={{ backgroundColor: m.color + '33' }}>🗺️</div>
              <h3 className="text-xl font-bold mb-2">{m.title}</h3>
              <p className="text-gray-400">{m.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
