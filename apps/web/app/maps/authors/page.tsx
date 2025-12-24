'use client';

import Link from 'next/link';

const AUTHORS = [
  { name: "Homer", location: "Ionia", lat: 38.4, lng: 27.1, language: "greek", era: "archaic", works: ["Iliad", "Odyssey"] },
  { name: "Plato", location: "Athens", lat: 37.9, lng: 23.7, language: "greek", era: "classical", works: ["Republic", "Symposium"] },
  { name: "Aristotle", location: "Stagira", lat: 40.5, lng: 23.7, language: "greek", era: "classical", works: ["Ethics", "Politics"] },
  { name: "Virgil", location: "Mantua", lat: 45.1, lng: 10.8, language: "latin", era: "imperial", works: ["Aeneid", "Eclogues"] },
  { name: "Cicero", location: "Arpinum", lat: 41.6, lng: 13.6, language: "latin", era: "imperial", works: ["De Officiis", "Orations"] },
  { name: "Augustine", location: "Thagaste", lat: 36.3, lng: 8.0, language: "latin", era: "lateAntique", works: ["Confessions", "City of God"] },
];

const ERA_COLORS: Record<string, string> = {
  archaic: "#D97706", classical: "#F59E0B", imperial: "#DC2626", lateAntique: "#7C3AED"
};

export default function AuthorsMap() {
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A227]">LOGOS</Link>
          <Link href="/maps" className="hover:text-[#C9A227]">← Back to Maps</Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Author Origins</h1>
        <div className="grid md:grid-cols-2 gap-4">
          {AUTHORS.map(a => (
            <div key={a.name} className="p-4 bg-[#1E1E24] rounded-lg border-l-4" style={{ borderLeftColor: ERA_COLORS[a.era] }}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-bold ${a.language === 'greek' ? 'text-blue-400' : 'text-red-400'}`}>
                  {a.language === 'greek' ? 'Α' : 'L'}
                </span>
                <span className="font-bold text-lg">{a.name}</span>
              </div>
              <p className="text-gray-400">{a.location}</p>
              <p className="text-sm text-gray-500">{a.works.join(", ")}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
