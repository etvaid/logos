'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { const q = searchParams.get('q'); if (q) { setQuery(q); search(q); } }, [searchParams]);

  const search = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    try { const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=50`); const data = await res.json(); setResults(data.results || []); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); search(query); window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`); };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 24 }}>🔍 Search Corpus</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Greek or Latin..." style={{ flex: 1, padding: '12px 16px', backgroundColor: '#1E1E24', border: '1px solid #4B5563', borderRadius: 8, color: '#F5F4F2', outline: 'none' }} />
          <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#C9A227', color: '#0D0D0F', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Search</button>
        </form>
        {loading && <div style={{ color: '#C9A227' }}>Searching...</div>}
        {!loading && results.length > 0 && (
          <div>
            <p style={{ color: '#6B7280', marginBottom: 16 }}>{results.length} results</p>
            {results.map((r, i) => (
              <div key={i} style={{ padding: 16, backgroundColor: '#1E1E24', borderRadius: 8, marginBottom: 12, borderLeft: '3px solid #C9A227' }}>
                <div style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 8 }}>{r.author_name} • {r.work_title}</div>
                <div style={{ color: '#F5F4F2', fontSize: 18, marginBottom: 8 }}>{r.text_original}</div>
                {r.translation && <div style={{ color: '#9CA3AF', fontStyle: 'italic' }}>{r.translation}</div>}
              </div>
            ))}
          </div>
        )}
        {!loading && results.length === 0 && query && <div style={{ color: '#6B7280' }}>No results found</div>}
      </div>
    </div>
  );
}
