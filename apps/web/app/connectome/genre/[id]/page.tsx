'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GenreConnectomePage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [genre, setGenre] = useState<any>(null);
  const [influences, setInfluences] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);

  useEffect(() => {
    fetchGenreData();
  }, [params.id]);

  const fetchGenreData = async () => {
    try {
      setLoading(true);
      const [genreRes, influencesRes, connectionsRes] = await Promise.all([
        fetch(`/api/genres/${params.id}`),
        fetch(`/api/genres/${params.id}/influences`),
        fetch(`/api/genres/${params.id}/connections`)
      ]);

      const genreData = await genreRes.json();
      const influencesData = await influencesRes.json();
      const connectionsData = await connectionsRes.json();

      setGenre(genreData);
      setInfluences(influencesData);
      setConnections(connectionsData);
    } catch (err) {
      setError('Failed to load genre connectome data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEraColor = (era: string) => {
    const colors: { [key: string]: string } = {
      'Archaic': '#D97706',
      'Classical': '#F59E0B',
      'Hellenistic': '#3B82F6',
      'Imperial': '#DC2626',
      'Late Antique': '#7C3AED',
      'Byzantine': '#059669'
    };
    return colors[era] || '#6B7280';
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <Link href="/" style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold', textDecoration: 'none' }}>
            LOGOS
          </Link>
        </nav>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <div style={{ fontSize: 18, color: '#9CA3AF' }}>Loading genre connectome...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <Link href="/" style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold', textDecoration: 'none' }}>
            LOGOS
          </Link>
        </nav>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, color: '#DC2626', marginBottom: 16 }}>Error</div>
            <div style={{ color: '#9CA3AF' }}>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold', textDecoration: 'none' }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: 32 }}>
            <Link href="/connectome" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>
              Connectome
            </Link>
            <Link href="/works" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>
              Works
            </Link>
            <Link href="/authors" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>
              Authors
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <Link href="/connectome" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: 14 }}>
              ← Back to Connectome
            </Link>
          </div>
          
          {genre && (
            <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 32, marginBottom: 32 }}>
              <h1 style={{ fontSize: 36, fontWeight: 'bold', color: '#C9A227', marginBottom: 16 }}>
                {genre.name}
              </h1>
              <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                <div style={{ padding: '8px 16px', backgroundColor: '#0D0D0F', borderRadius: 6, fontSize: 14 }}>
                  {genre.language}
                </div>
                <div style={{ padding: '8px 16px', backgroundColor: getEraColor(genre.era), borderRadius: 6, fontSize: 14, color: '#F5F4F2' }}>
                  {genre.era}
                </div>
              </div>
              <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.6, marginBottom: 24 }}>
                {genre.description}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div style={{ padding: 16, backgroundColor: '#0D0D0F', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Works in Genre</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#C9A227' }}>{genre.workCount || 0}</div>
                </div>
                <div style={{ padding: 16, backgroundColor: '#0D0D0F', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Key Authors</div>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#C9A227' }}>{genre.authorCount || 0}</div>
                </div>
                <div style={{ padding: 16, backgroundColor: '#0D0D0F', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Time Span</div>
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: '#F5F4F2' }}>{genre.timeSpan || 'Unknown'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 32 }}>
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#C9A227', marginBottom: 24 }}>
              Influence Patterns
            </h2>
            {influences.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {influences.map((influence, index) => (
                  <div key={index} style={{ padding: 16, backgroundColor: '#0D0D0F', borderRadius: 8, border: '1px solid rgba(201,162,39,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#F5F4F2' }}>
                        {influence.sourceGenre} → {influence.targetGenre}
                      </div>
                      <div style={{ padding: '4px 8px', backgroundColor: 'rgba(201,162,39,0.2)', borderRadius: 4, fontSize: 12, color: '#C9A227' }}>
                        {influence.strength}%
                      </div>
                    </div>
                    <div style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 8 }}>
                      {influence.description}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {influence.examples?.map((example: string, i: number) => (
                        <span key={i} style={{ padding: '2px 6px', backgroundColor: '#1E1E24', borderRadius: 4, fontSize: 12, color: '#9CA3AF' }}>
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#6B7280', padding: 32 }}>
                No influence patterns found
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#C9A227', marginBottom: 24 }}>
              Connected Genres
            </h2>
            {connections.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {connections.map((connection, index) => (
                  <Link 
                    key={index} 
                    href={`/connectome/genre/${connection.id}`}
                    style={{ 
                      display: 'block',
                      padding: 16, 
                      backgroundColor: '#0D0D0F', 
                      borderRadius: 8, 
                      textDecoration: 'none',
                      border: '1px solid rgba(201,162,39,0.1)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#F5F4F2' }}>
                        {connection.name}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ padding: '2px 6px', backgroundColor: getEraColor(connection.era), borderRadius: 4, fontSize: 12, color: '#F5F4F2' }}>
                          {connection.era}
                        </div>
                        <div style={{ padding: '2px 6px', backgroundColor: '#1E1E24', borderRadius: 4, fontSize: 12, color: '#9CA3AF' }}>
                          {connection.connectionStrength}%
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: 14, color: '#9CA3AF' }}>
                      {connection.description}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#6B7280', padding: 32 }}>
                No connected genres found
              </div>
            )}
          </div>
        </div>

        <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, marginTop: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#C9A227', marginBottom: 24 }}>
            Temporal Evolution
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            <div style={{ padding: 16, backgroundColor: '#0D0D0F', borderRadius: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: '#D97706', marginBottom: 8 }}>
                Early Period
              </div>
              <div style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>
                Origins and foundational works that established the genre's core characteristics and conventions.
              </div>
            </div>
            <div style={{ padding: 16, backgroundColor: '#0D0D0F', borderRadius: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: '#F59E0B', marginBottom: 8 }}>
                Classical Period
              </div>
              <div style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>
                Peak development with masterworks that defined the genre's golden age and influenced later works.
              </div>
            </div>
            <div style={{ padding: 16, backgroundColor: '#0D0D0F', borderRadius: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: '#3B82F6', marginBottom: 8 }}>
                Later Period
              </div>
              <div style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5 }}>
                Evolution and transformation as the genre adapted to changing cultural contexts.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}