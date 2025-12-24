'use client';

import Link from 'next/link';

export default function MapsHubPage() {
  const maps = [
    { icon: '🏛️', title: 'Political Map', desc: 'Borders change with time', href: '/maps/political' },
    { icon: '🗣️', title: 'Language Map', desc: 'Language distribution', href: '/maps/languages' },
    { icon: '👤', title: 'Author Origins', desc: 'Author birthplaces', href: '/maps/authors' },
  ];

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
      </nav>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 32 }}>🗺️ Maps</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {maps.map((m, i) => (
            <Link key={i} href={m.href} style={{ textDecoration: 'none' }}>
              <div style={{ padding: 24, backgroundColor: '#1E1E24', borderRadius: 12 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{m.icon}</div>
                <h3 style={{ color: '#F5F4F2', marginBottom: 8 }}>{m.title}</h3>
                <p style={{ color: '#9CA3AF' }}>{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
