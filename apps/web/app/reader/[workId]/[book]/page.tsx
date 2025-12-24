'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LogosDesignSystemExample() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockData = {
            title: "Logos Design System",
            description: "An example component.",
            items: ["Card", "Button", "Input"]
          };
          setData(mockData);
          setLoading(false);
        }, 1000);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      {/* Nav Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', width: '100%', maxWidth: '1200px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 'bold', fontSize: '20px', textDecoration: 'none' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/about" style={{ color: '#9CA3AF', textDecoration: 'none', marginRight: '16px' }}>About</Link>
          <Link href="/components" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Components</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', width: '100%', padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '18px' }}>Loading...</div>
        ) : error ? (
          <div style={{ color: '#DC2626', textAlign: 'center', fontSize: '18px' }}>Error: {error}</div>
        ) : data ? (
          <>
            <h1 style={{ color: '#F5F4F2', fontSize: '32px', marginBottom: '16px' }}>{data.title}</h1>
            <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '24px' }}>{data.description}</p>

            {/* Card Example */}
            <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, marginBottom: '20px', transition: 'all 0.2s', ':hover': { boxShadow: '0 0 30px rgba(201,162,39,0.3)' } }}>
              <h2 style={{ color: '#F5F4F2', fontSize: '24px', marginBottom: '12px' }}>Card Example</h2>
              <p style={{ color: '#9CA3AF' }}>This is a card component example.</p>
            </div>

            {/* Button Example */}
            <button style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', ':hover': { backgroundColor: '#E8D5A3' } }}>
              Click Me
            </button>

            {/* Input Example */}
            <input
              type="text"
              placeholder="Enter text"
              style={{ backgroundColor: '#0D0D0F', border: '1px solid #4B5563', borderRadius: 8, padding: '12px 16px', color: '#F5F4F2', marginTop: '20px' }}
            />
          </>
        ) : (
          <div style={{ textAlign: 'center', fontSize: '18px' }}>No data available.</div>
        )}
      </main>
    </div>
  );
}