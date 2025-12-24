
'use client';

import Link from 'next/link';

export default function LibrariesMap() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ borderBottom: '1px solid #2D2D35', padding: '16px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>LOGOS</Link>
          <Link href="/maps" style={{ color: '#9CA3AF', textDecoration: 'none' }}>← Back to Maps</Link>
        </div>
      </nav>
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#C9A227', marginBottom: '32px' }}>Libraries Map</h1>
        <div style={{ backgroundColor: '#1E1E24', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #2D2D35' }}>
          <p style={{ color: '#9CA3AF', fontSize: '18px' }}>Interactive visualization coming soon</p>
        </div>
      </main>
    </div>
  );
}
