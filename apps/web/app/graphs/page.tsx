'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GraphsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/graphs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGraphData(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', fontFamily: 'sans-serif' }}>
      {/* Nav Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#F5F4F2', fontWeight: 'bold', fontSize: '1.2em' }}>
          LOGOS
        </Link>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px' }}>
        <h1>Graph Builder</h1>

        {loading && <p>Loading...</p>}

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!loading && !error && graphData === null && <p>No graph data available.</p>}

        {!loading && !error && graphData && (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
            <h2>Graph Visualization</h2>
            <p>Data: {JSON.stringify(graphData)}</p>
            {/* Placeholder for Graph Visualization Component */}
            <div style={{ height: '300px', backgroundColor: '#141419', marginTop: '16px' }}>
              {/* Add your graph visualization component here */}
              <p style={{ color: '#9CA3AF', textAlign: 'center', paddingTop: '140px' }}>
                Graph Visualization Placeholder
              </p>
            </div>
          </div>
        )}

        {/* Input Fields for Querying Data */}
        <div style={{ marginTop: '24px' }}>
          <h2>Query Builder</h2>
          <input
            type="text"
            placeholder="Enter your query..."
            style={{ backgroundColor: '#0D0D0F', border: '1px solid #4B5563', borderRadius: 8, padding: '12px 16px', color: '#F5F4F2', width: '100%', marginBottom: '12px' }}
          />
          <button style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
            Run Query
          </button>
        </div>
      </div>
    </div>
  );
}