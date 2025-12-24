'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DiscoveryEngine() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredDiscoveries, setFilteredDiscoveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const discoveries = [
    {
      id: 1,
      title: "Homer's Wine-Dark Sea in Christian Hymns",
      type: "Pattern",
      description: "οἶνοψ πόντος appears 17 times in Homer but also in 4th century Christian hymns",
      confidence: 87,
      novelty: 92,
      evidence: ["Homer Od. 5.349", "Ephrem Hymn 3.4"]
    },
    {
      id: 2,
      title: "Stoic Vocabulary in Paul's Letters",
      type: "Influence",
      description: "23 technical Stoic terms cluster in Romans 7-8",
      confidence: 94,
      novelty: 76,
      evidence: ["Rom 7:23", "Epictetus 1.1"]
    },
    {
      id: 3,
      title: "Virgil's Hidden Ennius Debt",
      type: "Intertextuality",
      description: "47 unidentified structural parallels between Aeneid and Annales",
      confidence: 82,
      novelty: 88,
      evidence: ["Aen. 6.847", "Ennius fr. 500"]
    },
    {
      id: 4,
      title: "θεραπεία Semantic Reversal",
      type: "Semantic",
      description: "From 'service to gods' to 'medical treatment' to 'spiritual healing'",
      confidence: 91,
      novelty: 85,
      evidence: ["Hdt. 2.37", "Matt 4:23"]
    },
    {
      id: 5,
      title: "Plato's Republic in Islamic Philosophy",
      type: "Reception",
      description: "Al-Farabi's citations match Syriac tradition more than Greek manuscripts",
      confidence: 79,
      novelty: 94,
      evidence: ["Rep. 473c-d", "Al-Farabi Mab. 15"]
    }
  ];

  const typeColors = {
    Pattern: '#3B82F6',
    Influence: '#10B981',
    Semantic: '#EC4899',
    Intertextuality: '#F59E0B',
    Reception: '#8B5CF6'
  };

  const filters = ['All', 'Pattern', 'Influence', 'Semantic', 'Intertextuality', 'Reception'];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (activeFilter === 'All') {
        setFilteredDiscoveries(discoveries);
      } else {
        setFilteredDiscoveries(discoveries.filter(d => d.type === activeFilter));
      }
      setIsLoading(false);
    }, 500);
  }, [activeFilter]);

  const AnimatedBar = ({ value, color }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => setWidth(value), 200);
      return () => clearTimeout(timer);
    }, [value]);

    return (
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#1E1E24',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${width}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '4px',
          transition: 'width 1s ease-out'
        }} />
      </div>
    );
  };

  const DiscoveryCard = ({ discovery }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={{
          backgroundColor: '#1E1E24',
          border: `1px solid ${isHovered ? typeColors[discovery.type] : '#2D2D35'}`,
          borderRadius: '12px',
          padding: '24px',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <span style={{
            backgroundColor: typeColors[discovery.type],
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: '600',
            padding: '4px 12px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {discovery.type}
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: discovery.novelty > 90 ? '#10B981' : discovery.novelty > 80 ? '#F59E0B' : '#DC2626'
            }} />
            <span style={{ color: '#9CA3AF', fontSize: '12px' }}>
              Novel
            </span>
          </div>
        </div>

        <h3 style={{
          color: '#F5F4F2',
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '12px',
          lineHeight: '1.4'
        }}>
          {discovery.title}
        </h3>

        <p style={{
          color: '#9CA3AF',
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '20px'
        }}>
          {discovery.description}
        </p>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#F5F4F2', fontSize: '13px', fontWeight: '500' }}>
              Confidence
            </span>
            <span style={{ color: typeColors[discovery.type], fontSize: '14px', fontWeight: '600' }}>
              {discovery.confidence}%
            </span>
          </div>
          <AnimatedBar value={discovery.confidence} color={typeColors[discovery.type]} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#F5F4F2', fontSize: '13px', fontWeight: '500' }}>
              Novelty Score
            </span>
            <span style={{ color: '#C9A227', fontSize: '14px', fontWeight: '600' }}>
              {discovery.novelty}%
            </span>
          </div>
          <AnimatedBar value={discovery.novelty} color="#C9A227" />
        </div>

        <div>
          <div style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '8px', fontWeight: '500' }}>
            Evidence Citations:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {discovery.evidence.map((citation, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#141419',
                  color: '#C9A227',
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  border: '1px solid #2D2D35'
                }}
              >
                {citation}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#1E1E24',
        borderBottom: '1px solid #2D2D35',
        padding: '16px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#C9A227',
            textDecoration: 'none'
          }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: '32px' }}>
            <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Search</Link>
            <Link href="/analysis" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Analysis</Link>
            <Link href="/discovery" style={{ color: '#C9A227', textDecoration: 'none' }}>Discovery</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#C9A227',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🔍
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              margin: '0',
              background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              AI Discovery Engine
            </h1>
          </div>
          <p style={{
            fontSize: '20px',
            color: '#9CA3AF',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Uncover hidden patterns, influences, and connections across ancient texts using advanced AI analysis
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '32px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                backgroundColor: activeFilter === filter ? '#C9A227' : '#1E1E24',
                color: activeFilter === filter ? '#0D0D0F' : '#9CA3AF',
                border: `1px solid ${activeFilter === filter ? '#C9A227' : '#2D2D35'}`,
                borderRadius: '24px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Discovery Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #1E1E24',
              borderTop: '4px solid #C9A227',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#9CA3AF' }}>Analyzing patterns...</p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px'
          }}>
            {filteredDiscoveries.map((discovery) => (
              <DiscoveryCard key={discovery.id} discovery={discovery} />
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginTop: '48px',
          padding: '32px 0',
          borderTop: '1px solid #2D2D35'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#C9A227', marginBottom: '8px' }}>
              847
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Discoveries Made</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3B82F6', marginBottom: '8px' }}>
              2.3M
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Texts Analyzed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981', marginBottom: '8px' }}>
              94%
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Accuracy Rate</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#EC4899', marginBottom: '8px' }}>
              156
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '14px' }}>New Connections</div>
          </div>
        </div>
      </div>
    </div>
  );
}