'use client';

import { useState } from 'react';
import Link from 'next/link';

const eras = ['archaic', 'classical', 'hellenistic', 'imperial', 'late_antique'];
const eraColors: Record<string, string> = { archaic: '#D97706', classical: '#F59E0B', hellenistic: '#3B82F6', imperial: '#DC2626', late_antique: '#7C3AED' };

export default function ChronosPage() {
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
        <h1 style={{ color: '#C9A227', marginBottom: 24 }}>⏰ CHRONOS - Word Evolution</h1>
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          <input type="text" value={word} onChange={(e) => setWord(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && analyze()} placeholder="Enter a word..." style={{ flex: 1, padding: '12px 16px', backgroundColor: '#1E1E24', border: '1px solid #4B5563', borderRadius: 8, color: '#F5F4F2', outline: 'none', fontSize: 18 }} />
          <button onClick={analyze} style={{ padding: '12px 24px', backgroundColor: '#C9A227', color: '#0D0D0F', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Track</button>
        </div>
        {loading && <div style={{ color: '#C9A227' }}>Analyzing...</div>}
        {!loading && result && (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
            <h2 style={{ color: '#C9A227', marginBottom: 24 }}>Evolution of "{result.lemma}"</h2>
            <div style={{ position: 'relative', paddingLeft: 50 }}>
              <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 3, background: 'linear-gradient(to bottom, #D97706, #F59E0B, #3B82F6, #DC2626, #7C3AED)' }} />
              {eras.map((era, i) => (
                <div key={era} style={{ marginBottom: 32 }}>
                  <div style={{ position: 'absolute', left: 12, width: 20, height: 20, borderRadius: '50%', backgroundColor: eraColors[era] }} />
                  <h3 style={{ color: eraColors[era], textTransform: 'capitalize', marginBottom: 8 }}>{era.replace('_', ' ')}</h3>
                  <p style={{ color: '#9CA3AF' }}>{result.definition_short}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
