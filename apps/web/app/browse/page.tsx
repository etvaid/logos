'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BrowsePage() {
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetch('/api/works').then(r => r.json()).then(d => { setWorks(d.works || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const filtered = filter === 'all' ? works : works.filter(w => w.language === filter);

  if (loading) return <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#C9A227' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
      </nav>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 24 }}>📚 Browse Works</h1>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['all', 'greek', 'latin'].map(l => (
            <button key={l} onClick={() => setFilter(l)} style={{ padding: '8px 16px', backgroundColor: filter === l ? '#C9A227' : '#1E1E24', color: filter === l ? '#0D0D0F' : '#9CA3AF', border: 'none', borderRadius: 4, cursor: 'pointer', textTransform: 'capitalize' }}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((w, i) => (
            <Link key={i} href={`/reader/${w.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: 20, backgroundColor: '#1E1E24', borderRadius: 12, borderLeft: `3px solid ${w.language === 'greek' ? '#3B82F6' : '#DC2626'}` }}>
                <h3 style={{ color: '#F5F4F2', marginBottom: 4 }}>{w.title}</h3>
                <p style={{ color: '#9CA3AF', fontSize: 14 }}>{w.author_name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
