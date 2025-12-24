'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MapsHub() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const mapCards = [
    {
      id: 1,
      title: "Language Distribution",
      description: "Where Greek and Latin dominated",
      icon: "🗣️",
      gradient: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)",
      shadowColor: "#3B82F6",
      href: "/maps/language-distribution"
    },
    {
      id: 2,
      title: "Political Control",
      description: "2000 years of empires",
      icon: "👑",
      gradient: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
      shadowColor: "#DC2626",
      href: "/maps/political-control"
    },
    {
      id: 3,
      title: "Author Origins",
      description: "Where classical writers came from",
      icon: "✍️",
      gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      shadowColor: "#059669",
      href: "/maps/author-origins"
    },
    {
      id: 4,
      title: "Trade Routes",
      description: "Ancient commerce paths",
      icon: "🚢",
      gradient: "linear-gradient(135deg, #D97706 0%, #B45309 100%)",
      shadowColor: "#D97706",
      href: "/maps/trade-routes"
    },
    {
      id: 5,
      title: "Libraries & Schools",
      description: "Centers of ancient learning",
      icon: "📚",
      gradient: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
      shadowColor: "#7C3AED",
      href: "/maps/libraries-schools"
    },
    {
      id: 6,
      title: "Timeline",
      description: "Major events across 2300 years",
      icon: "⏱️",
      gradient: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
      shadowColor: "#EC4899",
      href: "/maps/timeline"
    }
  ];

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid #1E1E24',
        backgroundColor: '#0D0D0F'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            textDecoration: 'none', 
            color: '#C9A227' 
          }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/texts" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Texts</Link>
            <Link href="/authors" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Authors</Link>
            <Link href="/maps" style={{ color: '#C9A227', textDecoration: 'none' }}>Maps</Link>
            <Link href="/timeline" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Timeline</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Hero Section */}
        <section style={{ textAlign: 'center', padding: '64px 0' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Interactive Maps
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#9CA3AF', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Visualize the classical world through time, space, and culture. 
            Explore how Greek and Latin literature shaped and was shaped by geography.
          </p>
        </section>

        {/* Maps Grid */}
        <section style={{ paddingBottom: '64px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '32px' 
          }}>
            {mapCards.map((card) => (
              <Link 
                key={card.id}
                href={card.href}
                style={{ textDecoration: 'none' }}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  style={{
                    background: card.gradient,
                    borderRadius: '16px',
                    padding: '32px',
                    minHeight: '240px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transform: hoveredCard === card.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                    boxShadow: hoveredCard === card.id 
                      ? `0 20px 40px rgba(${card.shadowColor === '#3B82F6' ? '59, 130, 246' : 
                          card.shadowColor === '#DC2626' ? '220, 38, 38' :
                          card.shadowColor === '#059669' ? '5, 150, 105' :
                          card.shadowColor === '#D97706' ? '217, 119, 6' :
                          card.shadowColor === '#7C3AED' ? '124, 58, 237' :
                          '236, 72, 153'}, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2)`
                      : '0 8px 16px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Background pattern overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: hoveredCard === card.id 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease'
                  }} />
                  
                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                      fontSize: '48px', 
                      marginBottom: '16px',
                      transform: hoveredCard === card.id ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s ease'
                    }}>
                      {card.icon}
                    </div>
                    <h3 style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold', 
                      marginBottom: '8px', 
                      color: '#FFFFFF',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}>
                      {card.title}
                    </h3>
                    <p style={{ 
                      fontSize: '16px', 
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: '1.5',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                    }}>
                      {card.description}
                    </p>
                  </div>

                  {/* Hover indicator */}
                  {hoveredCard === card.id && (
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      animation: 'pulse 2s infinite'
                    }}>
                      →
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Info Section */}
        <section style={{ 
          textAlign: 'center', 
          paddingBottom: '64px',
          borderTop: '1px solid #1E1E24',
          paddingTop: '64px'
        }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '24px', 
            color: '#F5F4F2' 
          }}>
            Why Maps Matter
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px',
            marginTop: '32px'
          }}>
            <div style={{ 
              backgroundColor: '#1E1E24', 
              padding: '24px', 
              borderRadius: '12px',
              border: '1px solid #2D2D35'
            }}>
              <h3 style={{ color: '#C9A227', marginBottom: '16px', fontSize: '20px' }}>
                Spatial Context
              </h3>
              <p style={{ color: '#9CA3AF', lineHeight: '1.6' }}>
                Understanding where authors lived and wrote reveals cultural influences, 
                trade connections, and the spread of ideas across the ancient world.
              </p>
            </div>
            <div style={{ 
              backgroundColor: '#1E1E24', 
              padding: '24px', 
              borderRadius: '12px',
              border: '1px solid #2D2D35'
            }}>
              <h3 style={{ color: '#3B82F6', marginBottom: '16px', fontSize: '20px' }}>
                Historical Patterns
              </h3>
              <p style={{ color: '#9CA3AF', lineHeight: '1.6' }}>
                Visualizing data geographically reveals patterns invisible in text alone - 
                migration routes, cultural boundaries, and centers of learning.
              </p>
            </div>
            <div style={{ 
              backgroundColor: '#1E1E24', 
              padding: '24px', 
              borderRadius: '12px',
              border: '1px solid #2D2D35'
            }}>
              <h3 style={{ color: '#DC2626', marginBottom: '16px', fontSize: '20px' }}>
                Interactive Discovery
              </h3>
              <p style={{ color: '#9CA3AF', lineHeight: '1.6' }}>
                Explore connections between geography, politics, and literature 
                through dynamic, interactive visualizations spanning 2300 years.
              </p>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}