'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthorPage({ params }: { params: { id: string } }) {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAuthor = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/author/${params.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAuthor(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [params.id]);

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Nav Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 'bold', fontSize: '1.2em', textDecoration: 'none' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/" style={{ color: '#F5F4F2', textDecoration: 'none', marginRight: '16px' }}>Home</Link>
          <Link href="/about" style={{ color: '#F5F4F2', textDecoration: 'none' }}>About</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px' }}>
        {loading && <div style={{ textAlign: 'center', fontSize: '1.2em' }}>Loading author data...</div>}
        {error && <div style={{ color: '#DC2626', textAlign: 'center', fontSize: '1.2em' }}>Error: {error}</div>}
        {!loading && !error && author && (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
            <h1 style={{ fontSize: '2em', marginBottom: '16px', color: '#F5F4F2' }}>{author.name}</h1>
            <p style={{ color: '#9CA3AF', marginBottom: '8px' }}>ID: {author.id}</p>
            <p style={{ color: '#9CA3AF', marginBottom: '16px' }}>Era: {author.era}</p>

            <h2 style={{ fontSize: '1.5em', marginBottom: '12px', color: '#F5F4F2' }}>Influences</h2>
            {author.influences && author.influences.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {author.influences.map((influence: any) => (
                  <li key={influence.id} style={{ marginBottom: '8px' }}>
                    <Link href={`/connectome/author/${influence.id}`} style={{ color: '#3B82F6', textDecoration: 'none' }}>
                      {influence.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#6B7280' }}>No known influences.</p>
            )}

            <button style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold', marginTop: '24px', cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => router.back()}>
                Back
            </button>
          </div>
        )}
          {!loading && !error && !author && (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, textAlign: 'center' }}>
                  <p style={{ color: '#6B7280' }}>Author not found.</p>
              </div>
          )}
      </div>
    </div>
  );
}