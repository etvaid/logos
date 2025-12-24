'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MorphologyPage() {
  const [word, setWord] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWord(event.target.value);
  };

  const handleParse = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch(`/api/morphology?word=${word}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setAnalysis(data);
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
          <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none', margin: '0 12px', transition: 'all 0.2s' }}>
            Home
          </Link>
          <Link href="/texts" style={{ color: '#9CA3AF', textDecoration: 'none', margin: '0 12px', transition: 'all 0.2s' }}>
            Texts
          </Link>
          <Link href="/morphology" style={{ color: '#9CA3AF', textDecoration: 'none', margin: '0 12px', transition: 'all 0.2s' }}>
            Morphology
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ color: '#F5F4F2', marginBottom: '24px' }}>Morphology Parser</h1>

        {/* Input and Button */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Enter a word"
            value={word}
            onChange={handleInputChange}
            style={{ backgroundColor: '#0D0D0F', border: '1px solid #4B5563', borderRadius: 8, padding: '12px 16px', color: '#F5F4F2', width: '100%' }}
          />
          <button
            onClick={handleParse}
            style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Parse
          </button>
        </div>

        {/* Loading State */}
        {loading && <p style={{ color: '#9CA3AF' }}>Loading...</p>}

        {/* Error State */}
        {error && <p style={{ color: '#DC2626' }}>Error: {error}</p>}

        {/* Analysis Display */}
        {analysis && (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
            <h2 style={{ color: '#F5F4F2', marginBottom: '12px' }}>Analysis</h2>
            <p style={{ color: '#9CA3AF' }}>Lemma: {analysis.lemma || 'N/A'}</p>
            <p style={{ color: '#9CA3AF' }}>POS: {analysis.pos || 'N/A'}</p>
            <p style={{ color: '#9CA3AF' }}>Parsing: {analysis.parsing || 'N/A'}</p>
          </div>
        )}
      </main>
    </div>
  );
}