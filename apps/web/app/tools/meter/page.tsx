'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MeterScanner() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/meter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (e: any) {
      setError(e.message);
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', paddingBottom: '24px' }}>
      {/* Nav Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/tools" style={{ color: '#9CA3AF', textDecoration: 'none', marginRight: '16px' }}>Tools</Link>
          <Link href="/texts" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Texts</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '960px', margin: '24px auto', padding: '0 24px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px', color: '#F5F4F2' }}>Meter and Prosody Scanner</h1>

        {/* Input Area */}
        <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, marginBottom: '24px' }}>
          <textarea
            value={text}
            onChange={handleInputChange}
            placeholder="Enter text to scan"
            style={{
              backgroundColor: '#0D0D0F',
              border: '1px solid #4B5563',
              borderRadius: 8,
              padding: '12px 16px',
              color: '#F5F4F2',
              width: '100%',
              minHeight: '150px',
              resize: 'vertical',
            }}
          />
          <button
            onClick={handleSubmit}
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
            }}
          >
            {loading ? 'Scanning...' : 'Scan'}
          </button>
        </div>

        {/* Result Area */}
        {loading && <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading...</p>}
        {error && <p style={{ color: '#DC2626', textAlign: 'center' }}>Error: {error}</p>}
        {result && (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
            <h2 style={{ color: '#F5F4F2', marginBottom: '12px' }}>Result:</h2>
            <p style={{ color: '#9CA3AF', whiteSpace: 'pre-wrap' }}>{result}</p>
          </div>
        )}

        {!loading && !error && !result && <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Enter text to see the analysis.</p>}
      </div>
    </div>
  );
}