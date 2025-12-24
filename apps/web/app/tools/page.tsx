'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/tools');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setTools(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 'bold', fontSize: '1.2em', textDecoration: 'none' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/about" style={{ color: '#9CA3AF', textDecoration: 'none', marginRight: '16px' }}>
            About
          </Link>
          <Link href="/tools" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
            Tools
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '960px', margin: '0 auto', flex: '1' }}>
        <h1>Tools</h1>

        {loading && <p>Loading tools...</p>}

        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

        {!loading && !error && tools.length === 0 && <p>No tools available.</p>}

        {!loading && !error && tools.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {tools.map((tool) => (
              <div key={tool.id} style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, transition: 'all 0.2s', ':hover': { boxShadow: '0 0 30px rgba(201,162,39,0.3)' } }}>
                <Link href={tool.link} style={{ textDecoration: 'none', color: '#F5F4F2', display: 'block' }}>
                  <h2 style={{ marginBottom: '8px', color: '#C9A227' }}>{tool.name}</h2>
                  <p style={{ color: '#9CA3AF' }}>{tool.description}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}