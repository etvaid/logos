'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ApparatusPage() {
  const [variants, setVariants] = useState([]);
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const variantsResponse = await fetch('/api/variants');
        const variantsData = await variantsResponse.json();
        setVariants(variantsData);

        const manuscriptsResponse = await fetch('/api/manuscripts');
        const manuscriptsData = await manuscriptsResponse.json();
        setManuscripts(manuscriptsData);

        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>
          LOGOS
        </Link>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#F5F4F2', marginBottom: '24px' }}>Critical Apparatus Builder</h1>

        {loading && <p style={{ color: '#9CA3AF' }}>Loading...</p>}
        {error && <p style={{ color: '#DC2626' }}>Error: {error.message}</p>}

        {!loading && !error && (
          <>
            {/* Variants Section */}
            <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, marginBottom: '24px' }}>
              <h2 style={{ color: '#F5F4F2', marginBottom: '16px' }}>Variants</h2>
              {variants.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {variants.map((variant: any) => (
                    <li key={variant.id} style={{ marginBottom: '8px' }}>
                      {variant.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#9CA3AF' }}>No variants found.</p>
              )}
            </div>

            {/* Manuscripts Section */}
            <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
              <h2 style={{ color: '#F5F4F2', marginBottom: '16px' }}>Manuscripts</h2>
              {manuscripts.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {manuscripts.map((manuscript: any) => (
                    <li key={manuscript.id} style={{ marginBottom: '8px' }}>
                      {manuscript.name} ({manuscript.siglum})
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#9CA3AF' }}>No manuscripts found.</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}