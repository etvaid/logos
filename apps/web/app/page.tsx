'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const stats = [
  { label: 'Passages', value: '1.7M+', icon: '📜', detail: 'Texts from Homer to Byzantine era' },
  { label: 'Morphological Forms', value: '892K', icon: '📖', detail: 'Lemmatized and analyzed' },
  { label: 'Semantic Links', value: '500K+', icon: '🔗', detail: 'AI-discovered connections' },
  { label: 'Historical Span', value: '2,300 yrs', icon: '⏱️', detail: '800 BCE - 1500 CE' },
];

const features = [
  { 
    href: '/search', 
    title: 'Critical Text Search', 
    desc: 'Semantic search with apparatus criticus and manuscript variants',
    icon: '🔍', 
    color: '#3B82F6',
    badge: 'NEW LSJ Integration'
  },
  { 
    href: '/translate', 
    title: 'Scholarly Translation', 
    desc: 'Context-aware AI with polytonic Greek display and paradigm tables',
    icon: '📝', 
    color: '#10B981',
    badge: 'Morphological Parser'
  },
  { 
    href: '/discover', 
    title: 'Philological Discovery', 
    desc: 'AI patterns in textual criticism and intertextuality',
    icon: '💡', 
    color: '#F59E0B',
    badge: 'ML Insights'
  },
  { 
    href: '/semantia', 
    title: 'SEMANTIA Engine', 
    desc: 'Diachronic semantic analysis with word embedding visualization',
    icon: '📊', 
    color: '#8B5CF6',
    badge: 'Semantic Drift'
  },
  { 
    href: '/connectome', 
    title: 'Textual Connectome', 
    desc: 'Author Influence Networks',
    icon: '🕸️', 
    color: '#EC4899',
    badge: 'Network Analysis'
  },
  { 
    href: '/maps', 
    title: 'Chronotope Maps', 
    desc: 'Spatio-temporal visualization of classical world',
    icon: '🗺️', 
    color: '#06B6D4',
    badge: 'Interactive Timeline'
  },
];

const navItems = [
  { name: 'Critical Search', href: '/search', icon: '🔍' },
  { name: 'Translation', href: '/translate', icon: '📝' },
  { name: 'Discovery', href: '/discover', icon: '💡' },
  { name: 'SEMANTIA', href: '/semantia', icon: '📊' },
  { name: 'Connectome', href: '/connectome', icon: '🕸️' },
  { name: 'Apparatus', href: '/apparatus', icon: '📋' },
];

const searchSuggestions = [
  'ἀρετή in Aristotelian corpus',
  'virtus evolution Cicero→Seneca',
  'θάνατος semantic field Homer-Sophocles',
  'iustitia legal→philosophical Plato',
  'gloria vs κλέος comparative analysis',
  'φιλία Aristotle EN vs EE variants',
  'honos manuscript variants Livy',
  'φρόνησις practical wisdom contexts',
];

const recentSearches = [
  { query: 'κόσμος in Presocratic fragments', results: 147, timestamp: '2 hours ago' },
  { query: 'pietas Aeneid book VI apparatus', results: 23, timestamp: '1 day ago' },
  { query: 'ψυχή immortality arguments Phaedo', results: 89, timestamp: '3 days ago' },
];

const featuredAuthors = [
  { name: 'Homer', works: 'Iliad, Odyssey', era: 'Archaic', color: '#D97706', texts: 47 },
  { name: 'Plato', works: 'Republic, Phaedo, Symposium', era: 'Classical', color: '#F59E0B', texts: 36 },
  { name: 'Aristotle', works: 'EN, Metaphysics, Poetics', era: 'Classical', color: '#F59E0B', texts: 52 },
  { name: 'Cicero', works: 'De Officiis, Pro Archia', era: 'Late Republic', color: '#DC2626', texts: 89 },
  { name: 'Virgil', works: 'Aeneid, Georgics', era: 'Augustan', color: '#DC2626', texts: 12 },
  { name: 'Seneca', works: 'Epistulae, Dialogi', era: 'Imperial', color: '#DC2626', texts: 34 },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(false);
  const [animationOffset, setAnimationOffset] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
    setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setSearchFocused(false);
      setShowSuggestions(false);
    }, 100);
  };
    
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const FloatingParticle = ({ delay, duration }: { delay: number, duration: number }) => (
    <div
      style={{
        position: 'absolute',
        width: '3px',
        height: '3px',
        backgroundColor: '#C9A227',
        borderRadius: '50%',
        opacity: '0.3',
        animation: `float ${duration}s ${delay}s infinite ease-in-out`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        filter: 'blur(0.5px)',
        boxShadow: `0 0 10px ${Math.random() > 0.5 ? '#C9A227' : '#3B82F6'}`,
      }}
    />
  );

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden', position: 'relative' }}>
      
      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(201, 162, 39, 0.2); }
          50% { box-shadow: 0 0 40px rgba(201, 162, 39, 0.4); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Dynamic Background Particles */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
        {Array.from({ length: 15 }, (_, i) => (
          <FloatingParticle key={i} delay={i * 0.5} duration={3 + i * 0.2} />
        ))}
      </div>

      {/* Parallax Background */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at ${mousePosition.x * 0.05}% ${mousePosition.y * 0.05}%, rgba(201, 162, 39, 0.05) 0%, transparent 50%),
            radial-gradient(circle at ${100 - mousePosition.x * 0.03}% ${100 - mousePosition.y * 0.03}%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
            linear-gradient(135deg, #0D0D0F 0%, #141419 100%)
          `,
          transform: `translateY(${scrollY * 0.2}px)`,
          zIndex: 0,
        }}
      />

      {/* Navigation */}
      <nav style={{ 
        backgroundColor: 'rgba(30, 30, 36, 0.95)', 
        borderBottom: '1px solid #2D3748', 
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              transform: 'scale(1.05)', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: 'drop-shadow(0 4px 8px rgba(201, 162, 39, 0.2))'
            }}>
              <svg width="40" height="40" viewBox="0 0 100 100" style={{ display: 'block' }}>
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#C9A227' }} />
                    <stop offset="50%" style={{ stopColor: '#F59E0B' }} />
                    <stop offset="100%" style={{ stopColor: '#3B82F6' }} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="50" cy="30" r="20" fill="url(#logoGradient)" filter="url(#glow)" opacity="0.9" />
                <circle cx="25" cy="65" r="15" fill="url(#logoGradient)" filter="url(#glow)" opacity="0.7" />
                <circle cx="75" cy="70" r="12" fill="url(#logoGradient)" filter="url(#glow)" opacity="0.6" />
                <path d="M30 40 L70 60 M40 25 L60 75 M25 50 L75 55" stroke="url(#logoGradient)" strokeWidth="2" opacity="0.5" filter="url(#glow)" />
              </svg>
              <div>
                <h1 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  margin: 0, 
                  background: 'linear-gradient(135deg, #C9A227, #F59E0B, #3B82F6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 200%',
                  animation: 'gradientShift 3s ease infinite',
                }}>
                  LOGOS
                </h1>
                <p style={{ fontSize: '0.7rem', color: '#9CA3AF', margin: 0, letterSpacing: '0.1em' }}>
                  PHILOLOGICAL AI
                </p>
              </div>
            </div>
          </Link>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {navItems.map((item, idx) => (
              <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: 'rgba(30, 30, 36, 0.5)',
                  border: '1px solid rgba(201, 162, 39, 0.1)',
                }} 
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(201, 162, 39, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(201, 162, 39, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(30, 30, 36, 0.5)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.1)';
                }}>
                  <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                  <span style={{ color: '#F5F4F2', fontSize: '0.875rem', fontWeight: '500' }}>{item.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 2rem', 
        textAlign: 'center', 
        position: 'relative',
        background: `
          radial-gradient(ellipse at center, rgba(201, 162, 39, 0.05) 0%, transparent 70%),
          linear-gradient(135deg, transparent 0%, rgba(59, 130, 246, 0.02) 100%)
        `,
        zIndex: 2,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          
          {/* Animated Title */}
          <h1 style={{ 
            fontSize: 'clamp(3rem, 8vw, 6rem)', 
            fontWeight: '900', 
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #C9A227 0%, #F59E0B 25%, #3B82F6 50%, #8B5CF6 75%, #C9A227 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 4s ease infinite',
            textShadow: '0 0 80px rgba(201, 162, 39, 0.3)',
            transform: `perspective(1000px) rotateX(${Math.sin(animationOffset * 0.01) * 2}deg)`,
            letterSpacing: '-0.02em',
          }}>
            PHILOLOGICAL AI
          </h1>

          <p style={{ 
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', 
            color: '#9CA3AF', 
            marginBottom: '3rem', 
            maxWidth: '800px', 
            margin: '0 auto 3rem',
            lineHeight: '1.6',
            fontWeight: '400',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}>
            Revolutionary AI-powered platform for{' '}
            <span style={{ 
              color: '#C9A227',
              fontWeight: '600',
              textShadow: '0 0 20px rgba(201, 162, 39, 0.4)',
            }}>
              Classical Philology
            </span>
            {' '}• Critical text analysis • Semantic discovery • Manuscript tradition
          </p>

          {/* Enhanced Search Bar */}
          <div style={{ 
            position: 'relative', 
            maxWidth: '700px', 
            margin: '0 auto 4rem',
            transform: `perspective(1000px) rotateX(${searchFocused ? -2 : 0}deg)`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <div style={{
              position: 'relative',
              backgroundColor: searchFocused ? 'rgba(30, 30, 36, 0.95)' : 'rgba(30, 30, 36, 0.8)',
              borderRadius: '20px',
              border: searchFocused ? '2px solid #C9A227' : '2px solid rgba(201, 162, 39, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: searchFocused 
                ? '0 20px 60px rgba(201, 162, 39, 0.3), 0 0 0 1px rgba(201, 162, 39, 0.2)' 
                : '0 8px 32px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
            }}>
              
              {/* Animated border shimmer */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.4), transparent)',
                animation: searchFocused ? 'shimmer 2s infinite' : 'none',
              }} />

              <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
                <div style={{ 
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <div style={{
                    fontSize: '1.25rem',
                    transition: 'transform 0.3s ease',
                    transform: searchFocused ? 'scale(1.1) rotate(10deg)' : 'scale(1)',
                  }}>
                    🔍
                  </div>
                </div>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  onKeyPress={handleKeyPress}
                  placeholder="Search: ἀρετή, virtus, semantic evolution, manuscript variants..."
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#F5F4F2',
                    fontSize: '1.1rem',
                    fontWeight: '400',
                    padding: '1.25rem 0',
                    fontFamily: 'inherit',
                  }}
                />

                <button
                  onClick={handleSearch}
                  onMouseEnter={() => setHoveredButton(true)}
                  onMouseLeave={() => setHoveredButton(false)}
                  style={{
                    backgroundColor: hoveredButton ? '#F59E0B' : '#C9A227',
                    color: '#0D0D0F',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '1rem 2rem',
                    margin: '0.5rem',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: hoveredButton ? 'scale(1.05) translateY(-1px)' : 'scale(1)',
                    boxShadow: hoveredButton 
                      ? '0 12px 28px rgba(201, 162, 39, 0.4)' 
                      : '0 6px 16px rgba(201, 162, 39, 0.2)',
                    fontFamily: 'inherit',
                  }}
                >
                  SEARCH
                </button>
              </div>
            </div>

            {/* Enhanced Suggestions Dropdown */}
            {showSuggestions && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'rgba(30, 30, 36, 0.98)',
                borderRadius: '16px',
                marginTop: '0.5rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(201, 162, 39, 0.2)',
                zIndex: 1000,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ 
                    color: '#C9A227', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    margin: '0 0 1rem 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    🎯 Popular Searches
                  </h3>
                  {searchSuggestions.slice(0, 6).map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{
                        padding: '0.875rem 1rem',
                        cursor: 'pointer',
                        borderRadius: '10px',
                        transition: 'all 0.2s ease',
                        backgroundColor: 'transparent',
                        border: '1px solid transparent',
                        margin: '0.25rem 0',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(201, 162, 39, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.2)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span style={{ color: '#F5F4F2', fontSize: '0.95rem' }}>{suggestion}</span>
                    </div>
                  ))}
                </div>

                {/* Recent Searches */}
                <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid rgba(201, 162, 39, 0.1)' }}>
                  <h3 style={{ 
                    color: '#9CA3AF', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    margin: '1rem 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    📚 Recent Activity
                  </h3>
                  {recentSearches.map((search, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSuggestionClick(search.query)}
                      style={{
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        backgroundColor: 'transparent',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>{search.query}</span>
                      <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>
                        {search.results} • {search.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem', 
            marginBottom: '4rem',
            perspective: '1000px',
          }}>
            {stats.map((stat, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredStat(idx)}
                onMouseLeave={() => setHoveredStat(null)}
                style={{
                  backgroundColor: hoveredStat === idx ? 'rgba(30, 30, 36, 0.9)' : 'rgba(30, 30, 36, 0.6)',
                  padding: '2.5rem 2rem',
                  borderRadius: '20px',
                  border: hoveredStat === idx ? '2px solid #C9A227' : '2px solid rgba(201, 162, 39, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredStat === idx 
                    ? 'translateY(-8px) rotateX(5deg) scale(1.03)' 
                    : 'translateY(0) rotateX(0deg) scale(1)',
                  boxShadow: hoveredStat === idx 
                    ? '0 25px 50px rgba(201, 162, 39, 0.3), 0 0 0 1px rgba(201, 162, 39, 0.1)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(20px)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Animated background effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: hoveredStat === idx ? '0%' : '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.05), rgba(