'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContextPage() {
  const [loading, setLoading] = useState(true);
  const [contextData, setContextData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContextData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/context');
        if (!response.ok) {
          throw new Error('Failed to fetch context data');
        }
        const data = await response.json();
        setContextData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContextData();
  }, []);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>
            LOGOS
          </Link>
        </nav>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ fontSize: '18px', color: '#9CA3AF' }}>Loading historical context...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>
            LOGOS
          </Link>
        </nav>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ fontSize: '18px', color: '#DC2626' }}>Error: {error}</div>
        </div>
      </div>
    );
  }

  const contextSections = [
    {
      id: 'life',
      title: 'Daily Life & Society',
      description: 'Explore how people lived, worked, and interacted in the ancient world',
      icon: '🏛️',
      path: '/context/life',
      color: '#D97706'
    },
    {
      id: 'economy',
      title: 'Economy & Trade',
      description: 'Discover ancient commerce, currency, and economic systems',
      icon: '💰',
      path: '/context/economy',
      color: '#F59E0B'
    },
    {
      id: 'religion',
      title: 'Religion & Mythology',
      description: 'Delve into ancient beliefs, rituals, and divine narratives',
      icon: '⚡',
      path: '/context/religion',
      color: '#3B82F6'
    },
    {
      id: 'politics',
      title: 'Politics & Governance',
      description: 'Understand ancient political systems and power structures',
      icon: '👑',
      path: '/context/politics',
      color: '#DC2626'
    }
  ];

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: '32px' }}>
            <Link href="/search" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'all 0.2s' }}>
              Search
            </Link>
            <Link href="/analysis" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'all 0.2s' }}>
              Analysis
            </Link>
            <Link href="/context" style={{ color: '#C9A227', textDecoration: 'none', transition: 'all 0.2s' }}>
              Context
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', background: 'linear-gradient(135deg, #C9A227, #E8D5A3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Historical Context
          </h1>
          <p style={{ fontSize: '20px', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto' }}>
            Explore the rich tapestry of ancient civilizations through their daily life, economy, religion, and politics
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '48px' }}>
          {contextSections.map((section) => (
            <Link 
              key={section.id} 
              href={section.path} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div 
                style={{ 
                  backgroundColor: '#1E1E24', 
                  borderRadius: '12px', 
                  padding: '32px', 
                  transition: 'all 0.2s',
                  border: '1px solid rgba(75,85,99,0.3)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(30,30,36,0.8)';
                  e.currentTarget.style.borderColor = section.color;
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(${section.color === '#D97706' ? '217,119,6' : section.color === '#F59E0B' ? '245,158,11' : section.color === '#3B82F6' ? '59,130,246' : '220,38,38'},0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1E1E24';
                  e.currentTarget.style.borderColor = 'rgba(75,85,99,0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{section.icon}</div>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: section.color }}>
                  {section.title}
                </h3>
                <p style={{ color: '#9CA3AF', lineHeight: '1.6' }}>
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', color: '#C9A227' }}>
            Comprehensive Research
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '18px', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto' }}>
            Each context area provides detailed insights backed by primary sources, archaeological evidence, and scholarly research. 
            Navigate through interconnected aspects of ancient civilizations to build a complete understanding of historical periods.
          </p>
          <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/search"
              style={{
                backgroundColor: '#C9A227',
                color: '#0D0D0F',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E8D5A3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#C9A227';
              }}
            >
              Search Texts
            </Link>
            <Link 
              href="/analysis"
              style={{
                backgroundColor: 'transparent',
                color: '#C9A227',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                textDecoration: 'none',
                border: '1px solid #C9A227',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C9A227';
                e.currentTarget.style.color = '#0D0D0F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#C9A227';
              }}
            >
              Linguistic Analysis
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}