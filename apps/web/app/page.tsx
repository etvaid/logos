'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const stats = [
  { label: 'Passages', value: '1.7M+', icon: '📜' },
  { label: 'Words Analyzed', value: '892K', icon: '📖' },
  { label: 'Connections', value: '500K+', icon: '🔗' },
  { label: 'Years Covered', value: '2,300', icon: '⏱️' },
];

const features = [
  { href: '/search', title: 'Semantic Search', desc: 'Find passages by meaning across the classical corpus', icon: '🔍', color: '#3B82F6' },
  { href: '/translate', title: 'AI Translation', desc: 'Context-aware Greek & Latin translation', icon: '📝', color: '#10B981' },
  { href: '/discover', title: 'Discovery Engine', desc: 'AI-discovered patterns and connections', icon: '💡', color: '#F59E0B' },
  { href: '/semantia', title: 'SEMANTIA', desc: 'Track word meaning evolution over time', icon: '📊', color: '#8B5CF6' },
  { href: '/connectome', title: 'Connectome', desc: 'Visualize author influence networks', icon: '🕸️', color: '#EC4899' },
  { href: '/maps', title: 'Maps & Timeline', desc: 'Interactive historical visualization', icon: '🗺️', color: '#06B6D4' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(false);
  const [animationOffset, setAnimationOffset] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const AnimatedBackground = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden',
      backgroundColor: '#0D0D0F'
    }}>
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            backgroundColor: '#C9A227',
            borderRadius: '50%',
            left: `${(i * 137.5) % 100}%`,
            top: `${(i * 73.2) % 100}%`,
            opacity: 0.1 + (Math.sin((animationOffset + i * 20) * Math.PI / 180) * 0.15),
            transform: `scale(${0.3 + Math.sin((animationOffset + i * 30) * Math.PI / 180) * 0.7})`,
            transition: 'all 0.3s ease',
            boxShadow: `0 0 10px rgba(201, 162, 39, ${0.1 + Math.sin((animationOffset + i * 20) * Math.PI / 180) * 0.1})`
          }}
        />
      ))}
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 50%, rgba(201, 162, 39, 0.03) 0%, rgba(13, 13, 15, 0.1) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2', position: 'relative' }}>
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav style={{ 
        borderBottom: '1px solid #2D2D35', 
        padding: '16px 0',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(13, 13, 15, 0.9)',
        position: 'sticky',
        top: 0,
        zIndex: 100
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
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            letterSpacing: '2px',
            textDecoration: 'none',
            transition: 'all 0.3s ease'
          }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Search', 'Translate', 'Discover', 'SEMANTIA', 'Connectome', 'Maps'].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase()}`} 
                style={{ 
                  color: '#9CA3AF', 
                  textDecoration: 'none', 
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  padding: '8px 0',
                  borderBottom: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#C9A227';
                  e.currentTarget.style.borderBottomColor = '#C9A227';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9CA3AF';
                  e.currentTarget.style.borderBottomColor = 'transparent';
                }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        {/* Hero Section */}
        <div style={{ marginBottom: '80px' }}>
          <h1 style={{ 
            fontSize: '72px', 
            fontWeight: 'bold', 
            marginBottom: '16px', 
            color: '#C9A227',
            background: 'linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 30px rgba(201, 162, 39, 0.3)'
          }}>
            LOGOS
          </h1>
          <p style={{ 
            fontSize: '24px', 
            color: '#9CA3AF', 
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px auto',
            lineHeight: '1.6'
          }}>
            Unlock the wisdom of ancient texts with AI-powered search, translation, and discovery
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ marginBottom: '80px' }}>
            <div style={{
              display: 'flex',
              maxWidth: '600px',
              margin: '0 auto',
              position: 'relative',
              backgroundColor: '#1E1E24',
              borderRadius: '12px',
              border: searchFocused ? '2px solid #C9A227' : '2px solid transparent',
              transition: 'all 0.3s ease',
              boxShadow: searchFocused ? '0 0 20px rgba(201, 162, 39, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search ancient texts... Try 'virtue', 'love', or 'war'"
                style={{
                  flex: 1,
                  padding: '20px 24px',
                  fontSize: '16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#F5F4F2',
                  outline: 'none',
                  borderRadius: '12px'
                }}
              />
              <button
                type="submit"
                onMouseEnter={() => setHoveredButton(true)}
                onMouseLeave={() => setHoveredButton(false)}
                style={{
                  padding: '20px 32px',
                  backgroundColor: hoveredButton ? '#E8D5A3' : '#C9A227',
                  color: '#0D0D0F',
                  border: 'none',
                  borderRadius: '0 12px 12px 0',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: hoveredButton ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                🔍 Search
              </button>
            </div>
          </form>
        </div>

        {/* Stats Display Section */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#F5F4F2',
            marginBottom: '48px',
            textAlign: 'center'
          }}>
            Explore the Ancient World
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '80px'
          }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
                style={{
                  backgroundColor: hoveredStat === index ? '#2A2A32' : '#1E1E24',
                  padding: '32px',
                  borderRadius: '16px',
                  border: hoveredStat === index ? '2px solid #C9A227' : '2px solid transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  transform: hoveredStat === index ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredStat === index 
                    ? '0 12px 24px rgba(201, 162, 39, 0.2)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  filter: hoveredStat === index ? 'brightness(1.2)' : 'brightness(1)',
                  transition: 'all 0.3s ease'
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#C9A227',
                  marginBottom: '8px'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '16px',
                  color: '#9CA3AF',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards Section */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#F5F4F2',
            marginBottom: '48px',
            textAlign: 'center'
          }}>
            Powerful Tools for Classical Studies
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '32px'
          }}>
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  textDecoration: 'none',
                  backgroundColor: hoveredFeature === index ? '#2A2A32' : '#1E1E24',
                  padding: '32px',
                  borderRadius: '16px',
                  border: hoveredFeature === index ? `2px solid ${feature.color}` : '2px solid transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  transform: hoveredFeature === index ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredFeature === index 
                    ? `0 12px 24px ${feature.color}20` 
                    : '0 4px 12px rgba(0, 0, 0, 0.3)',
                  display: 'block'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    fontSize: '32px',
                    marginRight: '16px',
                    filter: hoveredFeature === index ? 'brightness(1.2)' : 'brightness(1)',
                    transition: 'all 0.3s ease'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: hoveredFeature === index ? feature.color : '#F5F4F2',
                    margin: 0,
                    transition: 'all 0.3s ease'
                  }}>
                    {feature.title}
                  </h3>
                </div>
                <p style={{
                  fontSize: '16px',
                  color: '#9CA3AF',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {feature.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          backgroundColor: '#1E1E24',
          padding: '64px 32px',
          borderRadius: '16px',
          border: '2px solid #C9A227',
          boxShadow: '0 8px 24px rgba(201, 162, 39, 0.1)'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#C9A227',
            marginBottom: '16px'
          }}>
            Ready to Begin Your Journey?
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#9CA3AF',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px auto',
            lineHeight: '1.6'
          }}>
            Join thousands of scholars, students, and enthusiasts exploring the ancient world with cutting-edge AI tools.
          </p>
          <Link
            href="/search"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              backgroundColor: '#C9A227',
              color: '#0D0D0F',
              fontSize: '18px',
              fontWeight: 'bold',
              textDecoration: 'none',
              borderRadius: '12px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E8D5A3';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A227';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Start Exploring →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #2D2D35',
        padding: '32px 0',
        backgroundColor: 'rgba(13, 13, 15, 0.9)',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <p style={{
            color: '#6B7280',
            fontSize: '14px',
            margin: 0
          }}>
            © 2024 LOGOS. Illuminating the ancient world through AI.
          </p>
        </div>
      </footer>
    </div>
  );
}