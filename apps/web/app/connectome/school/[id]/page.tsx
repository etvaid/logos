'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SchoolPage({ params }: { params: { id: string } }) {
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSchool = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/schools/${params.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSchool(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Loading school data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Error: {error}
      </div>
    );
  }

  if (!school) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        School not found.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ fontWeight: 'bold', fontSize: '20px', color: '#C9A227', textDecoration: 'none' }}>
          LOGOS
        </Link>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px' }}>
        <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
          <h1 style={{ color: '#F5F4F2', marginBottom: '16px' }}>{school.name}</h1>
          <p style={{ color: '#9CA3AF', lineHeight: '1.6' }}>{school.description}</p>

          {/* Example Button */}
          <button
            style={{
              backgroundColor: '#C9A227',
              color: '#0D0D0F',
              padding: '12px 24px',
              borderRadius: 8,
              fontWeight: 'bold',
              marginTop: '24px',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#E8D5A3')}
            onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#C9A227')}
          >
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
}