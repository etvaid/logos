'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DiscoveryPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const discover = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try { const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20`); const data = await res.json(); setResults(data.results || []); } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 24 }}>🔬 Discovery Engine</h1>
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && discover()} placeholder="Ask about the ancient world..." style={{ flex: 1, padding: '12px 16px', backgroundColor: '#1E1E24', border: '1px solid #4B5563', borderRadius: 8, color: '#F5F4F2', outline: 'none' }} />
          <button onClick={discover} style={{ padding: '12px 24px', backgroundColor: '#C9A227', color: '#0D0D0F', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Discover</button>
        </div>
        {loading && <div style={{ color: '#C9A227' }}>Discovering...</div>}
        {!loading && results.length > 0 && (
          <div>
            {results.map((r, i) => (
              <div key={i} style={{ padding: 16, backgroundColor: '#1E1E24', borderRadius: 8, marginBottom: 12, borderLeft: '3px solid #C9A227' }}>
                <div style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 8 }}>{r.author_name} • {r.work_title}</div>
                <div style={{ color: '#F5F4F2' }}>{r.text_original}</div>
                {r.translation && <div style={{ color: '#9CA3AF', marginTop: 8, fontStyle: 'italic' }}>{r.translation}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
