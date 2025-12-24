'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BattlesPage() {
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/battles');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBattles(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch battles:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#F5F4F2', fontWeight: 'bold', fontSize: '1.2rem' }}>
          LOGOS
        </Link>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', flex: 1 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>Military Campaigns & Battle Locations</h1>

        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '1.2rem' }}>Loading battles...</div>
        ) : error ? (
          <div style={{ color: '#DC2626', textAlign: 'center', fontSize: '1.2rem' }}>Error: {error.message}</div>
        ) : battles.length === 0 ? (
          <div style={{ textAlign: 'center', fontSize: '1.2rem' }}>No battles found.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {battles.map((battle) => (
              <div key={battle.id} style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px', transition: 'all 0.2s', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                boxShadow: '0 0 30px rgba(201,162,39,0.3)'
              }
              }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '12px', color: '#F5F4F2' }}>{battle.name}</h2>
                <p style={{ color: '#9CA3AF', marginBottom: '8px' }}>Date: {battle.date}</p>
                <p style={{ color: '#9CA3AF', marginBottom: '8px' }}>Location: {battle.location}</p>
                <p style={{ color: '#9CA3AF' }}>Description: {battle.description}</p>
                <Link href={`/battles/${battle.id}`} style={{ display: 'inline-block', marginTop: '16px', backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#E8D5A3'
                    }
                  }}>
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer (Optional) */}
      <footer style={{ textAlign: 'center', padding: '16px', color: '#9CA3AF' }}>
        &copy; 2024 LOGOS Classical Research Platform
      </footer>
    </div>
  );
}