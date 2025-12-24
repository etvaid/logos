
'use client';

import { useState } from 'react';
import Link from 'next/link';

const TRANSLATIONS: Record<string, { translation: string; notes: string }> = {
  "μῆνιν ἄειδε θεὰ": { translation: "Sing, O goddess, of the wrath", notes: "Opening of Homer's Iliad" },
  "arma virumque cano": { translation: "I sing of arms and the man", notes: "Opening of Virgil's Aeneid" },
  "carpe diem": { translation: "Seize the day", notes: "From Horace's Odes" },
  "veni vidi vici": { translation: "I came, I saw, I conquered", notes: "Julius Caesar" },
  "cogito ergo sum": { translation: "I think, therefore I am", notes: "Descartes" },
  "ἓν οἶδα ὅτι οὐδὲν οἶδα": { translation: "I know that I know nothing", notes: "Socratic paradox" },
};

const EXAMPLES = ["μῆνιν ἄειδε θεὰ", "arma virumque cano", "carpe diem", "veni vidi vici"];

export default function TranslatePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ translation: string; notes: string } | null>(null);

  const translate = () => {
    const match = TRANSLATIONS[input.toLowerCase().trim()];
    if (match) setResult(match);
    else setResult({ translation: "Translation not found in demo database", notes: "Try one of the example phrases" });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ borderBottom: '1px solid #2D2D35', padding: '16px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>LOGOS</Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Search</Link>
            <Link href="/translate" style={{ color: '#C9A227', textDecoration: 'none' }}>Translate</Link>
            <Link href="/semantia" style={{ color: '#9CA3AF', textDecoration: 'none' }}>SEMANTIA</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#C9A227', marginBottom: '8px' }}>AI Translation</h1>
        <p style={{ color: '#9CA3AF', marginBottom: '32px' }}>Context-aware Greek and Latin translation</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#9CA3AF', fontSize: '14px' }}>Greek or Latin</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text..." style={{ width: '100%', height: '150px', padding: '16px', backgroundColor: '#1E1E24', border: '1px solid #2D2D35', borderRadius: '12px', color: '#F5F4F2', fontSize: '18px', fontFamily: 'Georgia, serif', resize: 'none', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#9CA3AF', fontSize: '14px' }}>Translation</label>
            <div style={{ width: '100%', height: '150px', padding: '16px', backgroundColor: '#1E1E24', border: '1px solid #2D2D35', borderRadius: '12px', fontSize: '18px', overflow: 'auto' }}>
              {result ? (
                <div>
                  <p style={{ marginBottom: '12px' }}>{result.translation}</p>
                  <p style={{ color: '#9CA3AF', fontSize: '14px', fontStyle: 'italic' }}>{result.notes}</p>
                </div>
              ) : <span style={{ color: '#6B7280' }}>Translation appears here...</span>}
            </div>
          </div>
        </div>

        <button onClick={translate} style={{ padding: '14px 32px', backgroundColor: '#C9A227', color: '#0D0D0F', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '32px' }}>Translate</button>

        <div>
          <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Try these</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => setInput(ex)} style={{ padding: '10px 20px', backgroundColor: '#1E1E24', border: '1px solid #2D2D35', borderRadius: '8px', color: '#F5F4F2', cursor: 'pointer', fontFamily: 'Georgia, serif' }}>{ex}</button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
