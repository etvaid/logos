'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StemmaTool() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stemmaData, setStemmaData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/stemma');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStemmaData(data);
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
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2em' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/" style={{ color: '#F5F4F2', textDecoration: 'none', marginRight: '16px' }}>
            Home
          </Link>
          <Link href="/about" style={{ color: '#F5F4F2', textDecoration: 'none' }}>
            About
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', flex: 1 }}>
        <h1 style={{ color: '#F5F4F2', marginBottom: '24px' }}>Manuscript Stemma Visualization</h1>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            Loading stemma data...
          </div>
        ) : error ? (
          <div style={{ color: '#DC2626', textAlign: 'center', marginTop: '32px' }}>
            Error: {error}
          </div>
        ) : stemmaData ? (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px' }}>
            {/* Display Stemma Data - Replace with actual visualization */}
            <pre style={{ whiteSpace: 'pre-wrap', color: '#9CA3AF' }}>
              {JSON.stringify(stemmaData, null, 2)}
            </pre>
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '32px', color: '#9CA3AF' }}>
            No stemma data available.
          </div>
        )}
      </main>

      {/* Footer (Optional) */}
      <footer style={{ backgroundColor: '#141419', color: '#6B7280', textAlign: 'center', padding: '16px' }}>
        © 2024 LOGOS Project
      </footer>
    </div>
  );
}