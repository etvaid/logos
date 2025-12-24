'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface God {
  id: string;
  name: string;
  greekName?: string;
  romanName?: string;
  domain: string[];
  mythology: string;
  symbols: string[];
  culture: 'Greek' | 'Roman';
}

interface Festival {
  id: string;
  name: string;
  date: string;
  month: string;
  description: string;
  deity: string;
  location: string;
  rituals: string[];
  culture: 'Greek' | 'Roman';
}

interface Ritual {
  id: string;
  name: string;
  type: 'sacrifice' | 'procession' | 'mystery' | 'athletic' | 'theatrical';
  description: string;
  participants: string;
  offerings: string[];
  significance: string;
}

export default function ReligionPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gods, setGods] = useState<God[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [activeTab, setActiveTab] = useState<'gods' | 'festivals' | 'rituals' | 'calendar'>('gods');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCulture, setSelectedCulture] = useState<'All' | 'Greek' | 'Roman'>('All');

  useEffect(() => {
    const fetchReligionData = async () => {
      try {
        setLoading(true);
        
        const [godsResponse, festivalsResponse, ritualsResponse] = await Promise.all([
          fetch('/api/religion/gods'),
          fetch('/api/religion/festivals'),
          fetch('/api/religion/rituals')
        ]);

        if (!godsResponse.ok || !festivalsResponse.ok || !ritualsResponse.ok) {
          throw new Error('Failed to fetch religion data');
        }

        const [godsData, festivalsData, ritualsData] = await Promise.all([
          godsResponse.json(),
          festivalsResponse.json(),
          ritualsResponse.json()
        ]);

        setGods(godsData);
        setFestivals(festivalsData);
        setRituals(ritualsData);
      } catch (err) {
        setError('Failed to load religion data. Please try again.');
        console.error('Error fetching religion data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReligionData();
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const filteredGods = gods.filter(god => 
    selectedCulture === 'All' || god.culture === selectedCulture
  );

  const filteredFestivals = festivals.filter(festival => 
    (selectedCulture === 'All' || festival.culture === selectedCulture) &&
    (selectedMonth === '' || festival.month === selectedMonth)
  );

  const renderGods = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
      {filteredGods.map(god => (
        <div key={god.id} style={{
          backgroundColor: '#1E1E24',
          borderRadius: 12,
          padding: 24,
          transition: 'all 0.2s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <h3 style={{ 
              color: '#F5F4F2', 
              fontSize: 20, 
              fontWeight: 'bold', 
              margin: 0 
            }}>
              {god.name}
            </h3>
            <span style={{
              backgroundColor: god.culture === 'Greek' ? '#3B82F6' : '#DC2626',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 'bold'
            }}>
              {god.culture}
            </span>
          </div>

          {god.greekName && god.romanName && (
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#9CA3AF', fontSize: 14 }}>
                {god.culture === 'Greek' ? `Roman: ${god.romanName}` : `Greek: ${god.greekName}`}
              </span>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <h4 style={{ color: '#C9A227', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
              Domains
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {god.domain.map(domain => (
                <span key={domain} style={{
                  backgroundColor: '#0D0D0F',
                  color: '#F5F4F2',
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 12
                }}>
                  {domain}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <h4 style={{ color: '#C9A227', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
              Symbols
            </h4>
            <p style={{ color: '#9CA3AF', fontSize: 14, margin: 0 }}>
              {god.symbols.join(', ')}
            </p>
          </div>

          <div>
            <h4 style={{ color: '#C9A227', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
              Mythology
            </h4>
            <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              {god.mythology}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFestivals = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
      {filteredFestivals.map(festival => (
        <div key={festival.id} style={{
          backgroundColor: '#1E1E24',
          borderRadius: 12,
          padding: 24,
          transition: 'all 0.2s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <h3 style={{ 
              color: '#F5F4F2', 
              fontSize: 20, 
              fontWeight: 'bold', 
              margin: 0 
            }}>
              {festival.name}
            </h3>
            <span style={{
              backgroundColor: festival.culture === 'Greek' ? '#3B82F6' : '#DC2626',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 'bold'
            }}>
              {festival.culture}
            </span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
              <span style={{ color: '#C9A227', fontSize: 14, fontWeight: 'bold' }}>
                {festival.month} - {festival.date}
              </span>
              <span style={{ color: '#9CA3AF', fontSize: 14 }}>
                {festival.location}
              </span>
            </div>
            <p style={{ color: '#9CA3AF', fontSize: 14, margin: 0 }}>
              In honor of {festival.deity}
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <h4 style={{ color: '#C9A227', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
              Description
            </h4>
            <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              {festival.description}
            </p>
          </div>

          <div>
            <h4 style={{ color: '#C9A227', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
              Rituals
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {festival.rituals.map(ritual => (
                <span key={ritual} style={{
                  backgroundColor: '#0D0D0F',
                  color: '#F5F4F2',
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 12
                }}>
                  {ritual}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRituals = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
      {rituals.map(ritual => (
        <div key={ritual.id} style={{
          backgroundColor: '#1E1E24',
          borderRadius: 12,
          padding: 24,
          transition: 'all 0.2s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <h3 style={{ 
              color: '#F5F4F2', 
              fontSize: 20, 
              fontWeight: 'bold', 
              margin: 0 
            }}>
              {ritual.name}
            </h3>
            <span style={{
              backgroundColor: ritual.type === 'sacrifice' ? '#DC2626' : 
                            ritual.type === 'procession' ? '#3B82F6' :
                            ritual.type === 'mystery' ? '#7C3AED' :
                            ritual.type === 'athletic' ? '#F59E0B' : '#059669',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }}>
              {ritual.type}
            </span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <h4 style={{ color: '#C9A227', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
              Description
            </h4>
            <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              {ritual.description}
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <h4 style={{ color: '#C9A227', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
              Participants
            </h4>
            <p style={{ color: '#9CA3AF', fontSize: 14, margin: 0 }}>
              {ritual.participants}
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <h4 style={{ color: '#C9A227', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
              Offerings
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ritual.offerings.map(offering => (
                <span key={offering} style={{
                  backgroundColor: '#0D0D0F',
                  color: '#F5F4F2',
                  padding: '4px 8px',
                  borderRadius: 6,
                  fontSize: 12
                }}>
                  {offering}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: '#C9A227', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
              Significance
            </h4>
            <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              {ritual.significance}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCalendar = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
      {months.map(month => {
        const monthFestivals = festivals.filter(f => f.month === month);
        return (
          <div key={month} style={{
            backgroundColor: '#1E1E24',
            borderRadius: 12,
            padding: 24
          }}>
            <h3 style={{ 
              color: '#C9A227', 
              fontSize: 18, 
              fontWeight: 'bold', 
              marginBottom: 16,
              textAlign: 'center'
            }}>
              {month}
            </h3>
            
            {monthFestivals.length === 0 ? (
              <p style={{ color: '#6B7280', fontSize: 14, textAlign: 'center', margin: 0 }}>
                No festivals recorded
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {monthFestivals.map(festival => (
                  <div key={festival.id} style={{
                    backgroundColor: '#0D0D0F',
                    padding: 12,
                    borderRadius: 8,
                    borderLeft: `4px solid ${festival.culture === 'Greek' ? '#3B82F6' : '#DC2626'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <h4 style={{ color: '#F5F4F2', fontSize: 14, fontWeight: 'bold', margin: 0 }}>
                        {festival.name}
                      </h4>
                      <span style={{ color: '#9CA3AF', fontSize: 12 }}>
                        {festival.date}
                      </span>
                    </div>
                    <p style={{ color: '#9CA3AF', fontSize: 12, margin: 0 }}>
                      {festival.deity} • {festival.location}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0D0D0F',
        color: '#F5F4F2'
      }}>
        <nav style={{
          backgroundColor: '#1E1E24',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(201,162,39,0.2)'
        }}>
          <Link href="/" style={{
            color: '#C9A227',
            fontSize: 24,
            fontWeight: 'bold',
            textDecoration: 'none'
          }}>
            ΛΟΓΟΣ
          </Link>
        </nav>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 40,
              height: 40,
              border: '4px solid #C9A227',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#9CA3AF', fontSize: 16 }}>Loading religion database...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0D0D0F',
        color: '#F5F4F2'
      }}>
        <nav style={{
          backgroundColor: '#1E1E24',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(201,162,39,0.2)'
        }}>
          <Link href="/" style={{
            color: '#C9A227',
            fontSize: 24,
            fontWeight: 'bold',
            textDecoration: 'none'
          }}>
            ΛΟΓΟΣ
          </Link>
        </nav>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh'
        }}>
          <div style={{ 
            backgroundColor: '#1E1E24',
            padding: 32,
            borderRadius: 12,
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#DC2626', marginBottom: 16 }}>Error</h2>
            <p style={{ color: '#9CA3AF', marginBottom: 24 }}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#C9A227',
                color: '#0D0D0F',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 8,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2'
    }}>
      <nav style={{
        backgroundColor: '#1E1E24',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(201,162,39,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{
            color: '#C9A227',
            fontSize: 24,
            fontWeight: 'bold',
            textDecoration: 'none'
          }}>
            ΛΟΓΟΣ
          </Link>
          
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
              Search
            </Link>
            <Link href="/context" style={{ color: '#C9A227', textDecoration: 'none' }}>
              Context
            </Link>
            <Link href="/analysis" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
              Analysis
            </Link>
          </div>
        </div>
      </nav>

      <main style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: '#F5F4F2',
            marginBottom: 12,
            textAlign: 'center'
          }}>
            Religion & Mythology
          </h1>
          <p style={{
            fontSize: 18,
            color: '#9CA3AF',
            textAlign: 'center',
            margin: 0
          }}>
            Explore the gods, festivals, and religious practices of ancient civilizations
          </p>
        </div>

        <div style={{
          backgroundColor: '#1E1E24',
          padding: 24,
          borderRadius: 12,
          marginBottom: 32
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            alignItems: 'center',
            marginBottom: 24
          }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['gods', 'festivals', 'rituals', 'calendar'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    backgroundColor: activeTab === tab ? '#C9A227' : 'transparent',
                    color: activeTab === tab ? '#0D0D0F' : '#9CA3AF',
                    border: activeTab === tab ? 'none' : '1px solid #4B5563',
                    padding: '8px 16px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: activeTab === tab ? 'bold' : 'normal',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginLeft: 'auto' }}>
              {activeTab === 'festivals' && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{
                    backgroundColor: '#0D0D0F',
                    border: '1px solid #4B5563',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#F5F4F2',
                    fontSize: 14
                  }}
                >
                  <option value="">All Months</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              )}

              {(activeTab === 'gods' || activeTab === 'festivals') && (
                <select
                  value={selectedCulture}
                  onChange={(e) => setSelectedCulture(e.target.value as 'All' | 'Greek' | 'Roman')}
                  style={{
                    backgroundColor: '#0D0D0F',
                    border: '1px solid #4B5563',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#F5F4F2',
                    fontSize: 14
                  }}
                >
                  <option value="All">All Cultures</option>
                  <option value="Greek">Greek</option>
                  <option value="Roman">Roman</option>
                </select>
              )}
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: 24,
            fontSize: 14,
            color: '#9CA3AF'
          }}>
            <span>Gods: {filteredGods.length}</span>
            <span>Festivals: {filteredFestivals.length}</span>
            <span>Rituals: {rituals.length}</span>
          </div>
        </div>

        {activeTab === 'gods' && renderGods()}
        {activeTab === 'festivals' && renderFestivals()}
        {activeTab === 'rituals' && renderRituals()}
        {activeTab === 'calendar' && renderCalendar()}
      </main>
    </div>
  );
}