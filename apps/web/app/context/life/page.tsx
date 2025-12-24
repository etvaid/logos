'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const eras = ['archaic', 'classical', 'hellenistic', 'imperial', 'late_antique'];
const regions = ['greece', 'rome', 'egypt'];

export default function LifeViewsPage() {
  const [era, setEra] = useState('classical');
  const [region, setRegion] = useState('greece');
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try { const res = await fetch(`/api/context/life?era=${era}&region=${region}`); const data = await res.json(); setResult(data.contexts || []); } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { generate(); }, [era, region]);

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 24 }}>👥 Life Views</h1>
        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <select value={era} onChange={(e) => setEra(e.target.value)} style={{ padding: '10px 16px', backgroundColor: '#1E1E24', border: '1px solid #4B5563', borderRadius: 8, color: '#F5F4F2' }}>
            {eras.map(e => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
          </select>
          <select value={region} onChange={(e) => setRegion(e.target.value)} style={{ padding: '10px 16px', backgroundColor: '#1E1E24', border: '1px solid #4B5563', borderRadius: 8, color: '#F5F4F2' }}>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        {loading && <div style={{ color: '#C9A227' }}>Loading...</div>}
        {!loading && (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
            <h2 style={{ color: '#C9A227', marginBottom: 24, textTransform: 'capitalize' }}>Life in {era.replace('_', ' ')} {region}</h2>
            {result.length > 0 ? result.map((c, i) => (
              <div key={i}><h3 style={{ color: '#6B7280', marginBottom: 8 }}>📅 DAILY LIFE</h3><p>{c.daily_life}</p></div>
            )) : (
              <div><h3 style={{ color: '#6B7280', marginBottom: 8 }}>📅 DAILY LIFE</h3><p>Rise at dawn. Work in fields or workshop. Rest at midday. Evening meal with family.</p></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
