'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ArchaeologicalSitesPage() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sites');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSites(data);
        setLoading(false);
      } catch (e: any) {
        setError(e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 'bold', fontSize: '1.2em', textDecoration: 'none' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/maps" style={{ color: '#9CA3AF', textDecoration: 'none', marginRight: '16px' }}>Maps</Link>
          <Link href="/texts" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Texts</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', flex: 1 }}>
        <h1>Archaeological Sites</h1>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}

        {!loading && !error && sites.length === 0 && <p>No sites found.</p>}

        {!loading && !error && sites.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {sites.map((site: any) => (
              <div key={site.id} style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, transition: 'all 0.2s', ':hover': { boxShadow: '0 0 30px rgba(201,162,39,0.3)' } }}>
                <h2 style={{ color: '#F5F4F2' }}>{site.name}</h2>
                <p style={{ color: '#9CA3AF' }}>Location: {site.location}</p>
                <p style={{ color: '#9CA3AF' }}>Era: {site.era}</p>
                <Link href={`/sites/${site.id}`} style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', marginTop: '16px' }}>
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#141419', color: '#9CA3AF', textAlign: 'center', padding: '16px' }}>
        <p>&copy; 2024 LOGOS Classical Research Platform</p>
      </footer>
    </div>
  );
}