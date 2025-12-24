'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReceptionTracker() {
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/reception');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCitations(data);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#C9A227', fontWeight: 'bold', fontSize: '1.2em' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none', margin: '0 12px', transition: 'all 0.2s' }}>Home</Link>
          <Link href="/tools" style={{ color: '#9CA3AF', textDecoration: 'none', margin: '0 12px', transition: 'all 0.2s' }}>Tools</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', flex: 1 }}>
        <h1 style={{ fontSize: '2em', marginBottom: '24px', color: '#F5F4F2' }}>Citation and Reception Tracker</h1>

        {loading && <div style={{ textAlign: 'center', fontSize: '1.2em', color: '#9CA3AF' }}>Loading citations...</div>}

        {error && <div style={{ color: '#DC2626', marginBottom: '16px' }}>Error: {error.message}</div>}

        {!loading && !error && citations.length === 0 && (
          <div style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No citations found.</div>
        )}

        {!loading && !error && citations.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {citations.map((citation: any) => (
              <div key={citation.id} style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.5em', marginBottom: '12px', color: '#F5F4F2' }}>{citation.title}</h2>
                <p style={{ color: '#9CA3AF', marginBottom: '8px' }}>Author: {citation.author}</p>
                <p style={{ color: '#9CA3AF', marginBottom: '16px' }}>Year: {citation.year}</p>
                <p style={{ color: '#F5F4F2', lineHeight: '1.4' }}>{citation.summary}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF' }}>
        &copy; 2024 LOGOS Classical Research Platform
      </footer>
    </div>
  );
}