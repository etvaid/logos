'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BatchMorphologyPage() {
  const [passageText, setPassageText] = useState('');
  const [morphData, setMorphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/morphology/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passage: passageText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMorphData(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 'bold', fontSize: '1.2em', textDecoration: 'none' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none', marginRight: '16px' }}>Home</Link>
          <Link href="/morphology" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Morphology</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '960px', margin: '24px auto', padding: '0 24px', flex: 1 }}>
        <h1 style={{ color: '#F5F4F2', marginBottom: '24px' }}>Batch Morphology Analysis</h1>

        {/* Input Card */}
        <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, marginBottom: '24px' }}>
          <label htmlFor="passageText" style={{ display: 'block', marginBottom: '8px', color: '#9CA3AF' }}>Enter Passage Text:</label>
          <textarea
            id="passageText"
            value={passageText}
            onChange={(e) => setPassageText(e.target.value)}
            style={{
              backgroundColor: '#0D0D0F',
              border: '1px solid #4B5563',
              borderRadius: 8,
              padding: '12px 16px',
              color: '#F5F4F2',
              width: '100%',
              minHeight: '120px',
              resize: 'vertical',
            }}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              backgroundColor: '#C9A227',
              color: '#0D0D0F',
              padding: '12px 24px',
              borderRadius: 8,
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '16px',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => { if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = '#E8D5A3'; }}
            onMouseLeave={(e) => { if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = '#C9A227'; }}
          >
            {loading ? 'Analyzing...' : 'Analyze Passage'}
          </button>
        </div>

        {/* Loading & Error States */}
        {loading && <p style={{ color: '#9CA3AF' }}>Loading analysis...</p>}
        {error && <p style={{ color: '#DC2626' }}>Error: {error}</p>}

        {/* Results Card */}
        {morphData && (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
            <h2 style={{ color: '#F5F4F2', marginBottom: '16px' }}>Analysis Results:</h2>
            {Array.isArray(morphData) && morphData.length > 0 ? (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {morphData.map((item: any, index: number) => (
                  <li key={index} style={{ marginBottom: '12px', borderBottom: '1px solid #4B5563', paddingBottom: '12px' }}>
                    <strong style={{ color: '#F5F4F2' }}>Word:</strong> {item.word}<br />
                    <strong style={{ color: '#F5F4F2' }}>Morphological Analysis:</strong> {item.analysis}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#9CA3AF' }}>No morphological data available.</p>
            )}
          </div>
        )}

          {!loading && !error && morphData === null && (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
                <p style={{ color: '#9CA3AF' }}>Enter passage text to see morphological analysis.</p>
              </div>
          )}
      </div>
    </div>
  );
}