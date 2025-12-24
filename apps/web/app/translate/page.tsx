'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TranslatePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try { const res = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, source_lang: 'greek', style: 'literary' }) }); const data = await res.json(); setResult(data); } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 24 }}>🔄 Translation Studio</h1>
        <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste Greek or Latin text here..." style={{ width: '100%', minHeight: 200, padding: 16, backgroundColor: '#0D0D0F', border: '1px solid #4B5563', borderRadius: 8, color: '#F5F4F2', outline: 'none', resize: 'vertical', fontSize: 16 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <span style={{ color: '#6B7280' }}>Words: {text.split(/\s+/).filter(w => w).length}</span>
            <button onClick={handleTranslate} disabled={loading} style={{ padding: '12px 32px', backgroundColor: loading ? '#4B5563' : '#C9A227', color: '#0D0D0F', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>{loading ? 'Translating...' : '🔄 Translate'}</button>
          </div>
        </div>
        {result && (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
            <h3 style={{ color: '#6B7280', marginBottom: 16 }}>TRANSLATION</h3>
            <p style={{ fontSize: 18, lineHeight: 1.8 }}>{result.translation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
