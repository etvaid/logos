'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WordTimelinePage({ params }: { params: { word: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wordData, setWordData] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);

  const eraColors = {
    'Archaic': '#D97706',
    'Classical': '#F59E0B', 
    'Hellenistic': '#3B82F6',
    'Imperial': '#DC2626',
    'Late Antique': '#7C3AED',
    'Byzantine': '#059669'
  };

  useEffect(() => {
    fetchWordTimeline();
  }, [params.word]);

  const fetchWordTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/chronos/${params.word}`);
      if (!response.ok) {
        throw new Error('Failed to fetch word timeline');
      }
      
      const data = await response.json();
      setWordData(data.word);
      setTimeline(data.timeline || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
        <nav style={{ 
          backgroundColor: '#1E1E24', 
          padding: '16px 24px', 
          borderBottom: '1px solid rgba(201,162,39,0.2)' 
        }}>
          <Link href="/" style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none' 
          }}>
            ΛΟΓΟΣ
          </Link>
        </nav>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: 64, 
              height: 64, 
              border: '4px solid #C9A227', 
              borderTop: '4px solid transparent', 
              borderRadius: '50%', 
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite' 
            }}></div>
            <p style={{ color: '#9CA3AF', fontSize: 18 }}>Loading word timeline...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
        <nav style={{ 
          backgroundColor: '#1E1E24', 
          padding: '16px 24px', 
          borderBottom: '1px solid rgba(201,162,39,0.2)' 
        }}>
          <Link href="/" style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none' 
          }}>
            ΛΟΓΟΣ
          </Link>
        </nav>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh' 
        }}>
          <div style={{ 
            backgroundColor: '#1E1E24', 
            padding: 32, 
            borderRadius: 12, 
            textAlign: 'center',
            maxWidth: 400
          }}>
            <h2 style={{ color: '#DC2626', marginBottom: 16 }}>Error</h2>
            <p style={{ color: '#9CA3AF', marginBottom: 24 }}>{error}</p>
            <button 
              onClick={fetchWordTimeline}
              style={{ 
                backgroundColor: '#C9A227', 
                color: '#0D0D0F', 
                padding: '12px 24px', 
                borderRadius: 8, 
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        padding: '16px 24px', 
        borderBottom: '1px solid rgba(201,162,39,0.2)' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none' 
          }}>
            ΛΟΓΟΣ
          </Link>
          
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/lexicon" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Lexicon</Link>
            <Link href="/chronos" style={{ color: '#C9A227', textDecoration: 'none' }}>Chronos</Link>
            <Link href="/corpus" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Corpus</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 24 }}>
        <div style={{ marginBottom: 32 }}>
          <Link 
            href="/chronos" 
            style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none',
              fontSize: 14,
              marginBottom: 16,
              display: 'inline-block'
            }}
          >
            ← Back to Chronos
          </Link>
          
          {wordData && (
            <div style={{ 
              backgroundColor: '#1E1E24', 
              padding: 32, 
              borderRadius: 12,
              marginBottom: 32
            }}>
              <h1 style={{ 
                fontSize: 36, 
                color: '#C9A227', 
                marginBottom: 16,
                fontFamily: 'serif'
              }}>
                {wordData.greek}
              </h1>
              
              <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                <span style={{ 
                  color: '#9CA3AF', 
                  fontSize: 18,
                  fontStyle: 'italic'
                }}>
                  {wordData.transliteration}
                </span>
                <span style={{ 
                  backgroundColor: wordData.language === 'Greek' ? '#3B82F6' : '#DC2626',
                  color: '#F5F4F2',
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 'bold'
                }}>
                  {wordData.language}
                </span>
              </div>
              
              <p style={{ 
                color: '#F5F4F2', 
                fontSize: 18, 
                lineHeight: 1.6,
                marginBottom: 16
              }}>
                {wordData.definition}
              </p>
              
              {wordData.etymology && (
                <p style={{ 
                  color: '#9CA3AF', 
                  fontSize: 14,
                  fontStyle: 'italic'
                }}>
                  Etymology: {wordData.etymology}
                </p>
              )}
            </div>
          )}
        </div>

        {timeline.length === 0 ? (
          <div style={{ 
            backgroundColor: '#1E1E24', 
            padding: 48, 
            borderRadius: 12, 
            textAlign: 'center' 
          }}>
            <h3 style={{ color: '#9CA3AF', marginBottom: 16 }}>No Timeline Data</h3>
            <p style={{ color: '#6B7280' }}>
              Timeline evolution data for this word is not yet available.
            </p>
          </div>
        ) : (
          <div>
            <h2 style={{ 
              fontSize: 28, 
              color: '#F5F4F2', 
              marginBottom: 24,
              textAlign: 'center'
            }}>
              Evolution Through Time
            </h2>
            
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: '#C9A227',
                transform: 'translateX(-50%)',
                zIndex: 1
              }}></div>
              
              {timeline.map((era, index) => (
                <div key={index} style={{ 
                  position: 'relative',
                  marginBottom: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: eraColors[era.period as keyof typeof eraColors] || '#C9A227',
                    border: '3px solid #0D0D0F',
                    zIndex: 2
                  }}></div>
                  
                  <div style={{
                    backgroundColor: '#1E1E24',
                    padding: 24,
                    borderRadius: 12,
                    maxWidth: '45%',
                    marginLeft: index % 2 === 0 ? 0 : 'auto',
                    marginRight: index % 2 === 0 ? 'auto' : 0,
                    border: `2px solid ${eraColors[era.period as keyof typeof eraColors] || '#C9A227'}`
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12, 
                      marginBottom: 12 
                    }}>
                      <h3 style={{ 
                        color: eraColors[era.period as keyof typeof eraColors] || '#C9A227',
                        fontSize: 20,
                        fontWeight: 'bold'
                      }}>
                        {era.period}
                      </h3>
                      <span style={{ 
                        color: '#9CA3AF', 
                        fontSize: 14 
                      }}>
                        {era.dateRange}
                      </span>
                    </div>
                    
                    <p style={{ 
                      color: '#F5F4F2', 
                      fontSize: 16, 
                      lineHeight: 1.6,
                      marginBottom: 12
                    }}>
                      {era.meaning}
                    </p>
                    
                    {era.context && (
                      <p style={{ 
                        color: '#9CA3AF', 
                        fontSize: 14,
                        fontStyle: 'italic'
                      }}>
                        Context: {era.context}
                      </p>
                    )}
                    
                    {era.examples && era.examples.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <h4 style={{ 
                          color: '#C9A227', 
                          fontSize: 14, 
                          fontWeight: 'bold',
                          marginBottom: 8
                        }}>
                          Examples:
                        </h4>
                        {era.examples.map((example: any, idx: number) => (
                          <div key={idx} style={{ 
                            backgroundColor: '#141419', 
                            padding: 12, 
                            borderRadius: 8,
                            marginBottom: 8
                          }}>
                            <p style={{ 
                              color: '#F5F4F2', 
                              fontSize: 14,
                              fontFamily: 'serif',
                              marginBottom: 4
                            }}>
                              "{example.text}"
                            </p>
                            <p style={{ 
                              color: '#9CA3AF', 
                              fontSize: 12 
                            }}>
                              — {example.author}, {example.work}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}