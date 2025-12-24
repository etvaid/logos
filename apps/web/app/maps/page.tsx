
'use client';

import Link from 'next/link';

const maps = [
  { href: "/maps/languages", title: "Language Distribution", desc: "Where Greek and Latin dominated", icon: "🗣️", color: "#3B82F6" },
  { href: "/maps/political", title: "Political Control", desc: "2000 years of empires", icon: "👑", color: "#DC2626" },
  { href: "/maps/authors", title: "Author Origins", desc: "Where classical writers came from", icon: "✍️", color: "#10B981" },
  { href: "/maps/trade", title: "Trade Routes", desc: "Ancient commerce paths", icon: "🚢", color: "#F59E0B" },
  { href: "/maps/libraries", title: "Libraries", desc: "Centers of ancient learning", icon: "📚", color: "#8B5CF6" },
  { href: "/timeline", title: "Timeline", desc: "Major events across 2300 years", icon: "⏱️", color: "#EC4899" },
];

export default function MapsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ borderBottom: '1px solid #2D2D35', padding: '16px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>LOGOS</Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Search</Link>
            <Link href="/connectome" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Connectome</Link>
            <Link href="/maps" style={{ color: '#C9A227', textDecoration: 'none' }}>Maps</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#C9A227', marginBottom: '8px' }}>Interactive Maps</h1>
        <p style={{ color: '#9CA3AF', marginBottom: '32px' }}>Visualize the classical world</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {maps.map(m => (
            <Link key={m.href} href={m.href} style={{ padding: '32px', backgroundColor: '#1E1E24', borderRadius: '16px', border: '1px solid #2D2D35', textDecoration: 'none', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{m.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '8px' }}>{m.title}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '14px' }}>{m.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
