'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const categoryColors: Record<string, string> = { military: '#DC2626', political: '#3B82F6', culture: '#F59E0B', philosophy: '#7C3AED', disaster: '#6B7280' };

export default function TimelinePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch('/api/timeline?start=-800&end=500').then(r => r.json()).then(d => { setEvents(d.events || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const formatYear = (y: number) => y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`;

  if (loading) return <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#C9A227' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 24 }}>⏳ Timeline</h1>
        <div style={{ position: 'relative', paddingLeft: 40 }}>
          <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, backgroundColor: '#4B5563' }} />
          {events.map((e, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 24 }}>
              <div style={{ position: 'absolute', left: -29, width: 20, height: 20, borderRadius: '50%', backgroundColor: categoryColors[e.category] || '#6B7280' }} />
              <div style={{ backgroundColor: '#1E1E24', borderRadius: 8, padding: 16, marginLeft: 16 }}>
                <div style={{ color: '#C9A227', fontWeight: 'bold', marginBottom: 4 }}>{formatYear(e.year)}</div>
                <div style={{ fontSize: 18 }}>{e.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
