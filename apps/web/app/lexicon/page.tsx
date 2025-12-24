'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LexiconPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try { const res = await fetch(`/api/words/${encodeURIComponent(query)}`); const data = await res.json(); setResult(data.error ? null : data); } catch (e) { setResult(null); }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
      </nav>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 24 }}>📚 Lexicon</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter Greek or Latin word..." style={{ flex: 1, padding: '12px 16px', backgroundColor: '#1E1E24', border: '1px solid #4B5563', borderRadius: 8, color: '#F5F4F2', outline: 'none', fontSize: 18 }} />
          <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#C9A227', color: '#0D0D0F', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Look Up</button>
        </form>
        {loading && <div style={{ color: '#C9A227' }}>Searching...</div>}
        {!loading && result && (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
            <h2 style={{ color: '#C9A227', fontSize: 32, marginBottom: 16 }}>{result.lemma}</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span style={{ padding: '4px 12px', backgroundColor: result.language === 'greek' ? 'rgba(59,130,246,0.2)' : 'rgba(220,38,38,0.2)', color: result.language === 'greek' ? '#3B82F6' : '#DC2626', borderRadius: 4 }}>{result.language}</span>
              <span style={{ padding: '4px 12px', backgroundColor: 'rgba(201,162,39,0.2)', color: '#C9A227', borderRadius: 4 }}>{result.pos}</span>
            </div>
            <p style={{ fontSize: 18 }}>{result.definition_short}</p>
          </div>
        )}
        {!loading && !result && query && <div style={{ color: '#6B7280' }}>Word not found</div>}
      </div>
    </div>
  );
}
