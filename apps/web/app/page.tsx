
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const stats = [
  { label: 'Passages', value: '1.7M+', icon: '📜' },
  { label: 'Words Analyzed', value: '892K', icon: '📖' },
  { label: 'Connections', value: '500K+', icon: '🔗' },
  { label: 'Years Covered', value: '2,300', icon: '⏱️' },
];

const features = [
  { href: '/search', title: 'Semantic Search', desc: 'Find passages by meaning', icon: '🔍', color: '#3B82F6' },
  { href: '/translate', title: 'AI Translation', desc: 'Context-aware Greek & Latin', icon: '📝', color: '#10B981' },
  { href: '/discover', title: 'Discovery Engine', desc: 'AI-found patterns', icon: '💡', color: '#F59E0B' },
  { href: '/semantia', title: 'SEMANTIA', desc: 'Word meaning evolution', icon: '📊', color: '#8B5CF6' },
  { href: '/connectome', title: 'Connectome', desc: 'Author influence networks', icon: '🕸️', color: '#EC4899' },
  { href: '/maps', title: 'Maps & Timeline', desc: 'Visualize the classical world', icon: '🗺️', color: '#06B6D4' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ borderBottom: '1px solid #2D2D35', padding: '16px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#C9A227', letterSpacing: '2px' }}>LOGOS</div>
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Search', 'Translate', 'Discover', 'SEMANTIA', 'Connectome', 'Maps'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px' }}>{item}</Link>
            ))}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '16px', color: '#C9A227' }}>LOGOS</h1>
        <p style={{ fontSize: '24px', color: '#9CA3AF', marginBottom: '48px' }}>AI-Powered Classical Research Platform</p>

        <form onSubmit={handleSearch} style={{ maxWidth: '700px', margin: '0 auto 64px' }}>
          <div style={{ display: 'flex', gap: '16px', padding: '8px', backgroundColor: '#1E1E24', borderRadius: '16px', border: '1px solid #2D2D35' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 1.7 million classical passages..."
              style={{ flex: 1, padding: '16px 24px', backgroundColor: 'transparent', border: 'none', color: '#F5F4F2', fontSize: '18px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '16px 48px', backgroundColor: '#C9A227', color: '#0D0D0F', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
          </div>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '80px' }}>
          {stats.map(stat => (
            <div key={stat.label} style={{ padding: '24px', backgroundColor: '#1E1E24', borderRadius: '16px', border: '1px solid #2D2D35' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#C9A227' }}>{stat.value}</div>
              <div style={{ color: '#9CA3AF', fontSize: '14px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>Explore</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {features.map(f => (
            <Link key={f.href} href={f.href} style={{ padding: '32px', backgroundColor: '#1E1E24', borderRadius: '16px', border: '1px solid #2D2D35', textDecoration: 'none', textAlign: 'left', transition: 'transform 0.2s, border-color 0.2s' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '14px' }}>{f.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
