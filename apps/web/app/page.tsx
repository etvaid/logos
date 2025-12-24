
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
  { href: '/search', title: 'Semantic Search', desc: 'Find passages by meaning, not just keywords', icon: '🔍', color: '#3B82F6' },
  { href: '/translate', title: 'AI Translation', desc: 'Context-aware Greek & Latin translation', icon: '📝', color: '#10B981' },
  { href: '/discover', title: 'Discovery Engine', desc: 'AI-found patterns humans missed', icon: '💡', color: '#F59E0B' },
  { href: '/semantia', title: 'SEMANTIA', desc: 'How word meanings evolved over millennia', icon: '📊', color: '#8B5CF6' },
  { href: '/chronos', title: 'CHRONOS', desc: 'Track concepts through time', icon: '⏳', color: '#EC4899' },
  { href: '/maps', title: 'Interactive Maps', desc: 'Visualize the classical world', icon: '🗺️', color: '#06B6D4' },
];

const greekLetters = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ'];

export default function Home() {
  const [query, setQuery] = useState('');
  const [activeLetters, setActiveLetters] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndices = Array.from({ length: 3 }, () => Math.floor(Math.random() * greekLetters.length));
      setActiveLetters(randomIndices);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      {/* Floating Greek Letters Background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {greekLetters.map((letter, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              fontSize: '120px',
              color: '#C9A227',
              opacity: activeLetters.includes(i) ? 0.15 : 0.05,
              transition: 'opacity 1s ease',
              top: `${10 + (i * 12)}%`,
              left: `${5 + (i * 12)}%`,
              transform: 'rotate(-15deg)',
            }}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav style={{ position: 'relative', zIndex: 10, borderBottom: '1px solid #2D2D35', padding: '16px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#C9A227', letterSpacing: '2px' }}>LOGOS</div>
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Search', 'Translate', 'Discover', 'SEMANTIA', 'Maps'].map(item => (
              <Link key={item} href={`/${item.toLowerCase()}`} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '16px', background: 'linear-gradient(135deg, #C9A227 0%, #E8D5A3 50%, #C9A227 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            LOGOS
          </h1>
          <p style={{ fontSize: '24px', color: '#9CA3AF', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
            AI-Powered Classical Research Platform
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: '700px', margin: '0 auto 64px' }}>
            <div style={{ display: 'flex', gap: '16px', padding: '8px', backgroundColor: '#1E1E24', borderRadius: '16px', border: '1px solid #2D2D35' }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 1.7 million classical passages..."
                style={{
                  flex: 1,
                  padding: '16px 24px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#F5F4F2',
                  fontSize: '18px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '16px 48px',
                  backgroundColor: '#C9A227',
                  color: '#0D0D0F',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '80px' }}>
            {stats.map(stat => (
              <div key={stat.label} style={{ padding: '24px', backgroundColor: '#1E1E24', borderRadius: '16px', border: '1px solid #2D2D35' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#C9A227', marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ color: '#9CA3AF', fontSize: '14px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px' }}>Explore the Classical World</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {features.map(feature => (
              <Link
                key={feature.href}
                href={feature.href}
                style={{
                  padding: '32px',
                  backgroundColor: '#1E1E24',
                  borderRadius: '16px',
                  border: '1px solid #2D2D35',
                  textDecoration: 'none',
                  textAlign: 'left',
                  transition: 'all 0.3s',
                  display: 'block',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '8px' }}>{feature.title}</h3>
                <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #2D2D35', padding: '32px 24px', textAlign: 'center', color: '#6B7280' }}>
          <p>© 2024 LOGOS. Transforming classical scholarship with AI.</p>
        </footer>
      </main>
    </div>
  );
}
