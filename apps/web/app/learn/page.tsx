'use client';

import Link from 'next/link';

export default function LearnHubPage() {
  const courses = [
    { icon: '🇬🇷', title: 'Learn Greek', desc: 'Ancient Greek from basics', href: '/learn/greek', color: '#3B82F6' },
    { icon: '🇮🇹', title: 'Learn Latin', desc: 'Latin grammar and reading', href: '/learn/latin', color: '#DC2626' },
    { icon: '📝', title: 'Vocabulary', desc: 'Build word knowledge', href: '/learn/vocabulary', color: '#C9A227' },
    { icon: '🎴', title: 'Flashcards', desc: 'Spaced repetition', href: '/learn/flashcards', color: '#7C3AED' },
    { icon: '📊', title: 'Progress', desc: 'Track your journey', href: '/learn/progress', color: '#F59E0B' },
  ];

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
      </nav>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 32 }}>🎓 Learn Ancient Languages</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {courses.map((c, i) => (
            <Link key={i} href={c.href} style={{ textDecoration: 'none' }}>
              <div style={{ padding: 24, backgroundColor: '#1E1E24', borderRadius: 12, borderLeft: `4px solid ${c.color}` }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{c.icon}</div>
                <h3 style={{ color: '#F5F4F2', marginBottom: 8 }}>{c.title}</h3>
                <p style={{ color: '#9CA3AF' }}>{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
