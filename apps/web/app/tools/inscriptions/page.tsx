'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InscriptionsPage() {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/inscriptions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInscriptions(data);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', fontFamily: 'sans-serif' }}>
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 'bold', fontSize: '1.2em', textDecoration: 'none' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/tools" style={{ color: '#9CA3AF', margin: '0 12px', textDecoration: 'none' }}>Tools</Link>
          <Link href="/about" style={{ color: '#9CA3AF', margin: '0 12px', textDecoration: 'none' }}>About</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '960px', margin: '24px auto', padding: '0 24px' }}>
        <h1 style={{ color: '#F5F4F2', marginBottom: '24px' }}>Epigraphic Database</h1>

        {loading && <p style={{ color: '#9CA3AF' }}>Loading inscriptions...</p>}
        {error && <p style={{ color: '#DC2626' }}>Error: {error.message}</p>}

        {!loading && !error && inscriptions.length === 0 && (
          <p style={{ color: '#9CA3AF' }}>No inscriptions found.</p>
        )}

        {!loading && !error && inscriptions.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {inscriptions.map((inscription) => (
              <div key={inscription.id} style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 30px rgba(201,162,39,0.3)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <h2 style={{ color: '#F5F4F2', marginBottom: '12px' }}>{inscription.title}</h2>
                <p style={{ color: '#9CA3AF', marginBottom: '12px' }}>{inscription.description}</p>
                <Link href={`/inscriptions/${inscription.id}`} style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}