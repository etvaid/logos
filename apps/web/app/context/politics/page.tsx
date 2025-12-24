'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PoliticsPage() {
  const [politicalSystems, setPoliticalSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/politics');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPoliticalSystems(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 'bold', fontSize: '1.2em', textDecoration: 'none' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none', marginRight: '16px' }}>
            Home
          </Link>
          <Link href="/context/politics" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
            Politics
          </Link>
        </div>
      </nav>

      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ color: '#F5F4F2', marginBottom: '24px' }}>Classical Political Systems</h1>

        {loading && <p style={{ color: '#9CA3AF' }}>Loading...</p>}

        {error && <p style={{ color: '#DC2626' }}>Error: {error}</p>}

        {!loading && !error && politicalSystems.length === 0 && (
          <p style={{ color: '#9CA3AF' }}>No political systems found.</p>
        )}

        {!loading && !error && politicalSystems.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {politicalSystems.map((system: any) => (
              <div key={system.id} style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', hover: { transform: 'translateY(-4px)' } }}>
                <h2 style={{ color: '#F5F4F2', marginBottom: '12px' }}>{system.name}</h2>
                <p style={{ color: '#9CA3AF', lineHeight: '1.6' }}>{system.description}</p>
                <Link href={`/context/politics/${system.id}`} style={{ display: 'inline-block', marginTop: '16px', backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', transition: 'all 0.2s', hover: { backgroundColor: '#E8D5A3' } }}>
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}