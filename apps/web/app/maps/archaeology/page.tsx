'use client';

import Link from 'next/link';

const SITES = [
  { name: "Pompeii", type: "City", lat: 40.75, lng: 14.48, period: "Imperial", finds: "Inscriptions, frescoes, manuscripts" },
  { name: "Oxyrhynchus", type: "Papyri", lat: 28.53, lng: 30.67, period: "Hellenistic-Roman", finds: "500,000+ papyrus fragments" },
  { name: "Herculaneum", type: "Villa", lat: 40.81, lng: 14.35, period: "Imperial", finds: "Carbonized scrolls, Epicurean library" },
  { name: "Delphi", type: "Sanctuary", lat: 38.48, lng: 22.50, period: "Archaic-Classical", finds: "Inscriptions, dedications" },
  { name: "Vindolanda", type: "Fort", lat: 55.0, lng: -2.36, period: "Imperial", finds: "Writing tablets, military records" },
];

export default function ArchaeologyMap() {
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A227]">LOGOS</Link>
          <Link href="/maps" className="hover:text-[#C9A227]">← Back to Maps</Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Archaeological Sites</h1>
        <div className="space-y-4">
          {SITES.map(s => (
            <div key={s.name} className="p-4 bg-[#1E1E24] rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-lg">{s.name}</span>
                <span className="text-[#C9A227]">{s.type}</span>
              </div>
              <p className="text-gray-400">{s.period}</p>
              <p className="text-sm text-gray-500">{s.finds}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
