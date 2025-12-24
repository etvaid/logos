
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const PASSAGES = [
  { id: 1, author: "Homer", work: "Iliad", book: "1.1-5", text: "Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην", translation: "Sing, O goddess, the anger of Achilles son of Peleus, that brought countless ills", era: "archaic", language: "greek" },
  { id: 2, author: "Homer", work: "Odyssey", book: "1.1-4", text: "Ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον", translation: "Tell me, O muse, of that ingenious hero who traveled far and wide", era: "archaic", language: "greek" },
  { id: 3, author: "Plato", work: "Republic", book: "514a", text: "Μετὰ ταῦτα δή ἀπείκασον τοιούτῳ πάθει τὴν ἡμετέραν φύσιν", translation: "Next, compare our nature in respect of education to such an experience", era: "classical", language: "greek" },
  { id: 4, author: "Plato", work: "Apology", book: "21d", text: "ἓν οἶδα ὅτι οὐδὲν οἶδα", translation: "I know that I know nothing", era: "classical", language: "greek" },
  { id: 5, author: "Aristotle", work: "Nicomachean Ethics", book: "1094a", text: "Πᾶσα τέχνη καὶ πᾶσα μέθοδος", translation: "Every art and every inquiry aims at some good", era: "classical", language: "greek" },
  { id: 6, author: "Virgil", work: "Aeneid", book: "1.1-4", text: "Arma virumque cano, Troiae qui primus ab oris", translation: "I sing of arms and the man, who first from the shores of Troy", era: "imperial", language: "latin" },
  { id: 7, author: "Cicero", work: "In Catilinam", book: "1.1", text: "Quo usque tandem abutere, Catilina, patientia nostra?", translation: "How long, O Catiline, will you abuse our patience?", era: "imperial", language: "latin" },
  { id: 8, author: "Seneca", work: "Epistulae", book: "1.1", text: "Ita fac, mi Lucili: vindica te tibi", translation: "Do this, my dear Lucilius: claim yourself for yourself", era: "imperial", language: "latin" },
  { id: 9, author: "Augustine", work: "Confessiones", book: "1.1", text: "Magnus es, Domine, et laudabilis valde", translation: "Great are you, O Lord, and greatly to be praised", era: "lateAntique", language: "latin" },
  { id: 10, author: "Sophocles", work: "Antigone", book: "332", text: "Πολλὰ τὰ δεινὰ κοὐδὲν ἀνθρώπου δεινότερον πέλει", translation: "Many wonders there are, but none more wondrous than man", era: "classical", language: "greek" },
];

const ERA_COLORS: Record<string, string> = { archaic: '#D97706', classical: '#F59E0B', imperial: '#DC2626', lateAntique: '#7C3AED' };

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [language, setLanguage] = useState('all');
  const [results, setResults] = useState(PASSAGES);

  const doSearch = () => {
    let filtered = PASSAGES;
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(p => p.author.toLowerCase().includes(q) || p.work.toLowerCase().includes(q) || p.text.toLowerCase().includes(q) || p.translation.toLowerCase().includes(q));
    }
    if (language !== 'all') filtered = filtered.filter(p => p.language === language);
    setResults(filtered);
  };

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#C9A227', marginBottom: '8px' }}>Semantic Search</h1>
      <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>Search 1.7 million passages by meaning</p>

      <div style={{ backgroundColor: '#1E1E24', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid #2D2D35' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && doSearch()} placeholder="Search..." style={{ flex: 1, padding: '14px 20px', backgroundColor: '#141419', border: '1px solid #2D2D35', borderRadius: '10px', color: '#F5F4F2', fontSize: '16px', outline: 'none' }} />
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '14px 20px', backgroundColor: '#141419', border: '1px solid #2D2D35', borderRadius: '10px', color: '#F5F4F2' }}>
            <option value="all">All Languages</option>
            <option value="greek">Greek</option>
            <option value="latin">Latin</option>
          </select>
          <button onClick={doSearch} style={{ padding: '14px 32px', backgroundColor: '#C9A227', color: '#0D0D0F', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Homer', 'Plato', 'virtue', 'anger', 'Virgil'].map(tag => (
            <button key={tag} onClick={() => setQuery(tag)} style={{ padding: '8px 16px', backgroundColor: '#141419', border: '1px solid #2D2D35', borderRadius: '20px', color: '#9CA3AF', cursor: 'pointer', fontSize: '13px' }}>{tag}</button>
          ))}
        </div>
      </div>

      <p style={{ color: '#9CA3AF', marginBottom: '16px' }}>{results.length} passages found</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {results.map(p => (
          <div key={p.id} style={{ padding: '24px', backgroundColor: '#1E1E24', borderRadius: '12px', borderLeft: `4px solid ${ERA_COLORS[p.era]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', backgroundColor: p.language === 'greek' ? '#3B82F620' : '#DC262620', color: p.language === 'greek' ? '#3B82F6' : '#DC2626', fontWeight: 'bold', fontSize: '18px' }}>{p.language === 'greek' ? 'Α' : 'L'}</span>
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{p.author}</span>
              <span style={{ color: '#6B7280' }}>•</span>
              <span style={{ fontStyle: 'italic', color: '#9CA3AF' }}>{p.work}</span>
              <span style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', backgroundColor: `${ERA_COLORS[p.era]}20`, color: ERA_COLORS[p.era] }}>{p.era}</span>
            </div>
            <p style={{ fontSize: '18px', lineHeight: '1.6', marginBottom: '12px', fontFamily: 'Georgia, serif' }}>{p.text}</p>
            <p style={{ color: '#9CA3AF', fontStyle: 'italic' }}>"{p.translation}"</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ borderBottom: '1px solid #2D2D35', padding: '16px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>LOGOS</Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/search" style={{ color: '#C9A227', textDecoration: 'none' }}>Search</Link>
            <Link href="/translate" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Translate</Link>
            <Link href="/connectome" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Connectome</Link>
            <Link href="/semantia" style={{ color: '#9CA3AF', textDecoration: 'none' }}>SEMANTIA</Link>
          </div>
        </div>
      </nav>
      <Suspense fallback={<div style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
