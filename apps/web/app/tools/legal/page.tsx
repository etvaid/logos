'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LegalPage() {
  const [legalCodes, setLegalCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/legal');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLegalCodes(data);
        setLoading(false);
      } catch (error) {
        console.error("Could not fetch legal codes:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2em' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none', margin: '0 12px', transition: 'all 0.2s' }}>
            Home
          </Link>
          <Link href="/tools/legal" style={{ color: '#9CA3AF', textDecoration: 'none', margin: '0 12px', transition: 'all 0.2s' }}>
            Legal
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '24px', color: '#F5F4F2' }}>Ancient Law Codes</h1>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Loading legal codes...
          </div>
        )}

        {error && (
          <div style={{ color: '#DC2626', padding: '20px', backgroundColor: '#1E1E24', borderRadius: '8px' }}>
            Error: {error.message}
          </div>
        )}

        {!loading && !error && legalCodes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#1E1E24', borderRadius: '8px' }}>
            No legal codes found.
          </div>
        )}

        {!loading && !error && legalCodes.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {legalCodes.map((code) => (
              <div key={code.id} style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, transition: 'all 0.2s', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',  }}>
                <h2 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '12px', color: '#F5F4F2' }}>{code.title}</h2>
                <p style={{ color: '#9CA3AF', marginBottom: '16px' }}>{code.description}</p>
                <Link href={`/tools/legal/${code.id}`} style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s', ':hover': { backgroundColor: '#E8D5A3' } }}>
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}