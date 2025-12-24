'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const stats = { passages: 1700000, words: 850000, authors: 1200, works: 3500 };

  const features = [
    { icon: '🔍', title: 'Search', desc: 'Search 1.7M passages', href: '/search' },
    { icon: '📖', title: 'Reader', desc: 'Read full works', href: '/reader' },
    { icon: '📚', title: 'Lexicon', desc: 'LSJ & Lewis-Short', href: '/lexicon' },
    { icon: '🔄', title: 'Translate', desc: 'AI translation', href: '/translate' },
    { icon: '🧠', title: 'SEMANTIA', desc: 'Semantic analysis', href: '/semantia' },
    { icon: '🕸️', title: 'Connectome', desc: 'Author networks', href: '/connectome' },
    { icon: '⏳', title: 'Timeline', desc: 'Historical events', href: '/timeline' },
    { icon: '🗺️', title: 'Maps', desc: 'Ancient geography', href: '/maps' },
    { icon: '🎓', title: 'Learn', desc: 'Latin & Greek', href: '/learn' },
    { icon: '🔬', title: 'Discovery', desc: 'AI insights', href: '/discover' },
    { icon: '⏰', title: 'CHRONOS', desc: 'Word evolution', href: '/chronos' },
    { icon: '👥', title: 'Life Views', desc: 'Ancient daily life', href: '/context/life' },
  ];

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); if (query.trim()) window.location.href = `/search?q=${encodeURIComponent(query)}`; };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Search</Link>
          <Link href="/browse" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Browse</Link>
          <Link href="/learn" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Learn</Link>
        </div>
      </nav>
      <div style={{ textAlign: 'center', padding: '80px 24px', background: 'linear-gradient(180deg, #1E1E24 0%, #0D0D0F 100%)' }}>
        <h1 style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 16 }}><span style={{ color: '#C9A227' }}>LOGOS</span> Classical Research Platform</h1>
        <p style={{ fontSize: 20, color: '#9CA3AF', maxWidth: 600, margin: '0 auto 32px' }}>Explore 1.7 million passages of ancient Greek and Latin with AI-powered analysis.</p>
        <form onSubmit={handleSearch} style={{ maxWidth: 600, margin: '0 auto', display: 'flex', gap: 8 }}>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Greek or Latin texts..." style={{ flex: 1, padding: '16px 24px', backgroundColor: '#1E1E24', border: '1px solid #4B5563', borderRadius: 8, color: '#F5F4F2', outline: 'none' }} />
          <button type="submit" style={{ padding: '16px 32px', backgroundColor: '#C9A227', color: '#0D0D0F', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Search</button>
        </form>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, padding: '48px 24px', maxWidth: 1000, margin: '0 auto' }}>
        {[{ l: 'Passages', v: stats.passages }, { l: 'Words', v: stats.words }, { l: 'Authors', v: stats.authors }, { l: 'Works', v: stats.works }].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: 24, backgroundColor: '#1E1E24', borderRadius: 12 }}>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#C9A227' }}>{s.v.toLocaleString()}</div>
            <div style={{ color: '#9CA3AF', marginTop: 8 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '48px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, marginBottom: 48 }}>Explore LOGOS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <Link key={i} href={f.href} style={{ textDecoration: 'none' }}>
              <div style={{ padding: 20, backgroundColor: '#1E1E24', borderRadius: 12, cursor: 'pointer' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
                <h3 style={{ color: '#F5F4F2', marginBottom: 4, fontSize: 16 }}>{f.title}</h3>
                <p style={{ color: '#6B7280', fontSize: 13 }}>{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <footer style={{ padding: '48px 24px', textAlign: 'center', borderTop: '1px solid rgba(201,162,39,0.1)' }}>
        <p style={{ color: '#6B7280' }}>LOGOS Classical Research Platform</p>
      </footer>
    </div>
  );
}
