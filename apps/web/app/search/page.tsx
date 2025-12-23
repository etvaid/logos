
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const PASSAGES = [
  { id: 1, author: "Homer", work: "Iliad", book: "1.1", text: "Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", translation: "Sing, O goddess, the anger of Achilles son of Peleus", era: "archaic", language: "greek" },
  { id: 2, author: "Homer", work: "Odyssey", book: "1.1", text: "Ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον", translation: "Tell me, O muse, of that ingenious hero", era: "archaic", language: "greek" },
  { id: 3, author: "Plato", work: "Republic", book: "514a", text: "Μετὰ ταῦτα δὴ ἀπείκασον", translation: "Next, compare our nature with respect to education", era: "classical", language: "greek" },
  { id: 4, author: "Plato", work: "Apology", book: "21d", text: "ἓν οἶδα ὅτι οὐδὲν οἶδα", translation: "I know that I know nothing", era: "classical", language: "greek" },
  { id: 5, author: "Aristotle", work: "Ethics", book: "1094a", text: "Πᾶσα τέχνη καὶ πᾶσα μέθοδος", translation: "Every art and every inquiry aims at some good", era: "classical", language: "greek" },
  { id: 6, author: "Sophocles", work: "Antigone", book: "332", text: "Πολλὰ τὰ δεινά", translation: "Many wonders there are, but none more wondrous than man", era: "classical", language: "greek" },
  { id: 7, author: "Virgil", work: "Aeneid", book: "1.1", text: "Arma virumque cano", translation: "I sing of arms and the man", era: "imperial", language: "latin" },
  { id: 8, author: "Cicero", work: "In Catilinam", book: "1.1", text: "Quo usque tandem abutere patientia nostra?", translation: "How long will you abuse our patience?", era: "imperial", language: "latin" },
  { id: 9, author: "Seneca", work: "Letters", book: "1.1", text: "Vindica te tibi", translation: "Claim yourself for yourself", era: "imperial", language: "latin" },
  { id: 10, author: "Augustine", work: "Confessions", book: "1.1", text: "Magnus es, Domine", translation: "Great are you, O Lord", era: "lateAntique", language: "latin" },
  { id: 11, author: "Ovid", work: "Metamorphoses", book: "1.1", text: "In nova fert animus mutatas dicere formas", translation: "My mind inclines to tell of forms changed", era: "imperial", language: "latin" },
  { id: 12, author: "Herodotus", work: "Histories", book: "1.1", text: "Ἡροδότου ἱστορίης ἀπόδεξις ἥδε", translation: "This is the display of the inquiry of Herodotus", era: "classical", language: "greek" },
];

const ERA_COLORS: Record<string, string> = {
  archaic: "#D97706", classical: "#F59E0B", hellenistic: "#3B82F6",
  imperial: "#DC2626", lateAntique: "#7C3AED", byzantine: "#059669",
};

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [language, setLanguage] = useState('all');
  const [results, setResults] = useState(PASSAGES);

  const doSearch = () => {
    let filtered = PASSAGES;
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(p => 
        p.author.toLowerCase().includes(q) || p.work.toLowerCase().includes(q) ||
        p.text.toLowerCase().includes(q) || p.translation.toLowerCase().includes(q)
      );
    }
    if (language !== 'all') filtered = filtered.filter(p => p.language === language);
    setResults(filtered);
  };

  useEffect(() => { doSearch(); }, []);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">Semantic Search</h1>
      <p className="text-gray-400 mb-8">Search 1.7M+ passages by meaning</p>

      <div className="flex gap-4 mb-4">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && doSearch()}
          placeholder="Search authors, works, or concepts..."
          className="flex-1 px-4 py-3 bg-[#1E1E24] border border-gray-700 rounded-lg focus:border-[#C9A227] focus:outline-none" />
        <select value={language} onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-3 bg-[#1E1E24] border border-gray-700 rounded-lg">
          <option value="all">All</option>
          <option value="greek">Greek</option>
          <option value="latin">Latin</option>
        </select>
        <button onClick={doSearch} className="px-8 py-3 bg-[#C9A227] text-black font-bold rounded-lg hover:bg-[#E8D5A3]">Search</button>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {['Homer', 'Plato', 'Virgil', 'anger', 'virtue', 'war'].map(t => (
          <button key={t} onClick={() => setQuery(t)} className="px-3 py-1 bg-[#1E1E24] border border-gray-700 rounded-full text-sm hover:border-[#C9A227]">{t}</button>
        ))}
      </div>

      <p className="text-gray-400 mb-4">{results.length} results</p>
      <div className="space-y-4">
        {results.map(p => (
          <div key={p.id} className="p-6 bg-[#1E1E24] rounded-lg border-l-4" style={{ borderLeftColor: ERA_COLORS[p.era] }}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-lg font-bold ${p.language === 'greek' ? 'text-blue-400' : 'text-red-400'}`}>
                {p.language === 'greek' ? 'Α' : 'L'}
              </span>
              <span className="font-bold">{p.author}</span>
              <span className="text-gray-400">•</span>
              <span className="italic">{p.work}</span>
              <span className="ml-auto px-2 py-1 rounded text-xs" style={{ backgroundColor: ERA_COLORS[p.era] + '33', color: ERA_COLORS[p.era] }}>{p.era}</span>
            </div>
            <p className="text-lg mb-2 font-serif">{p.text}</p>
            <p className="text-gray-400 italic">{p.translation}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A227]">LOGOS</Link>
          <div className="flex gap-6 text-sm">
            <Link href="/search" className="text-[#C9A227]">Search</Link>
            <Link href="/translate" className="hover:text-[#C9A227]">Translate</Link>
            <Link href="/semantia" className="hover:text-[#C9A227]">SEMANTIA</Link>
            <Link href="/maps" className="hover:text-[#C9A227]">Maps</Link>
          </div>
        </div>
      </nav>
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
