'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReaderHubPage() {
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch('/api/works').then(r => r.json()).then(d => { setWorks(d.works || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#C9A227' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
      </nav>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 32 }}>📖 Reader</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {works.map((w, i) => (
            <Link key={i} href={`/reader/${w.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: 24, backgroundColor: '#1E1E24', borderRadius: 12 }}>
                <h3 style={{ color: '#F5F4F2', marginBottom: 8 }}>{w.title}</h3>
                <p style={{ color: '#9CA3AF' }}>{w.author_name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
