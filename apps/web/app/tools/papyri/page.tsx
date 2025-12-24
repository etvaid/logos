'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PapyriPage() {
  const [papyri, setPapyri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/papyri');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPapyri(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Nav Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#F5F4F2', fontWeight: 'bold', fontSize: '1.2rem' }}>
          LOGOS
        </Link>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '24px' }}>
        <h1>Papyrology Viewer</h1>

        {loading && <p>Loading...</p>}

        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

        {!loading && !error && !papyri && <p>No papyri data available.</p>}

        {!loading && !error && papyri && (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, marginTop: 20 }}>
            <h2>{papyri.title}</h2>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
              <div>
                <img src={papyri.image_url} alt={papyri.title} style={{ maxWidth: '400px', borderRadius: 8 }} />
              </div>
              <div>
                <h3>Transcription</h3>
                <p>{papyri.transcription}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}