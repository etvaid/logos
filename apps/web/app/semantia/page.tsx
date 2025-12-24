'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SemantiaPage() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!word.trim()) return;
    setLoading(true);
    try { const res = await fetch(`/api/words/${encodeURIComponent(word)}`); const data = await res.json(); setResult(data.error ? null : data); } catch (e) { setResult(null); }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 24 }}>🧠 SEMANTIA</h1>
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          <input type="text" value={word} onChange={(e) => setWord(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && analyze()} placeholder="Enter a word..." style={{ flex: 1, padding: '12px 16px', backgroundColor: '#1E1E24', border: '1px solid #4B5563', borderRadius: 8, color: '#F5F4F2', outline: 'none', fontSize: 18 }} />
          <button onClick={analyze} style={{ padding: '12px 24px', backgroundColor: '#C9A227', color: '#0D0D0F', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Analyze</button>
        </div>
        {loading && <div style={{ color: '#C9A227' }}>Analyzing...</div>}
        {!loading && result && (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
            <h2 style={{ color: '#C9A227', fontSize: 32, marginBottom: 16 }}>{result.lemma}</h2>
            <p style={{ fontSize: 20 }}>{result.definition_short}</p>
          </div>
        )}
      </div>
    </div>
  );
}
