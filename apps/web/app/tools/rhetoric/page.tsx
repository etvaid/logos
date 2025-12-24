'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RhetoricTool() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`/api/rhetoric`, {
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
      setResults(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', paddingBottom: '24px' }}>
      {/* Nav Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#F5F4F2', fontWeight: 'bold', fontSize: '1.2em' }}>
          LOGOS
        </Link>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px', color: '#F5F4F2' }}>Rhetorical Figure Detector</h1>

        {/* Input Area */}
        <div style={{ marginBottom: '24px' }}>
          <textarea
            style={{
              backgroundColor: '#0D0D0F',
              border: '1px solid #4B5563',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#F5F4F2',
              width: '100%',
              minHeight: '150px',
              resize: 'vertical',
            }}
            placeholder="Enter text to analyze..."
            value={text}
            onChange={handleInputChange}
          />
        </div>

        {/* Submit Button */}
        <button
          style={{
            backgroundColor: '#C9A227',
            color: '#0D0D0F',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            ':hover': { backgroundColor: '#E8D5A3' },
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>

        {/* Loading State */}
        {loading && (
          <div style={{ marginTop: '24px', textAlign: 'center', color: '#9CA3AF' }}>
            Loading...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#DC2626', color: '#F5F4F2', borderRadius: '8px' }}>
            Error: {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div style={{ marginTop: '24px', backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ color: '#F5F4F2', marginBottom: '16px' }}>Analysis Results:</h2>
            {Object.keys(results).length > 0 ? (
              <ul>
                {Object.entries(results).map(([figure, count]) => (
                  <li key={figure} style={{ color: '#9CA3AF', padding: '8px 0' }}>
                    {figure}: {count}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#9CA3AF' }}>No rhetorical figures detected.</p>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !results && (
          <div style={{ marginTop: '24px', textAlign: 'center', color: '#9CA3AF' }}>
            Enter text to analyze.
          </div>
        )}
      </div>
    </div>
  );
}