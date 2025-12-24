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
        opacity: '0.6',
        animation: `float ${duration}s ${delay}s infinite ease-in-out`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        filter: 'blur(1px)',
        boxShadow: `0 0 10px ${Math.random() > 0.5 ? '#C9A227' : '#3B82F6'}`,
        pointerEvents: 'none',
      }}
    />
  );


  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      {[...Array(20)].map((_, i) => (
        <FloatingParticle key={i} delay={Math.random() * 5} duration={5 + Math.random() * 5} />
      ))}

      {/* Hero Section */}
      <header style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
          Logos: The Digital Library of the Ancient World
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#9CA3AF', marginBottom: '2rem' }}>
          Explore and analyze classical texts with cutting-edge philological tools.
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', display: 'inline-block', width: '70%', maxWidth: '600px' }}>
          <input
            type="text"
            ref={searchInputRef}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              outline: 'none',
              transition: 'background-color 0.2s, box-shadow 0.2s',
              boxShadow: searchFocused ? '0 0 5px #C9A227' : 'none',
            }}
            placeholder="Search for texts, authors, concepts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onKeyDown={handleKeyPress}
          />
          <button
            style={{
              position: 'absolute',
              top: '50%',
              right: '1rem',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              fontSize: '1.2rem',
              transition: 'color 0.2s',
            }}
            onClick={handleSearch}
          >
            🔍
          </button>

          {showSuggestions && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                backgroundColor: '#141419',
                borderRadius: '0.5rem',
                marginTop: '0.25rem',
                padding: '0.5rem',
                zIndex: 10,
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
              }}
            >
              <h4 style={{ margin: '0.25rem 0', color: '#6B7280', fontSize: '0.9rem' }}>Suggestions:</h4>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {searchSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    style={{
                      padding: '0.5rem',
                      cursor: 'pointer',
                      borderRadius: '0.25rem',
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Stats Section */}
      <section style={{ padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#F5F4F2' }}>
          Unlocking the Treasures of Antiquity
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#1E1E24',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                width: 'calc(50% - 2rem)',
                maxWidth: '250px',
                marginBottom: '1.5rem',
                textAlign: 'left',
                transition: 'transform 0.3s, box-shadow 0.3s',
                transform: hoveredStat === index ? 'scale(1.05)' : 'scale(1)',
                boxShadow: hoveredStat === index ? '0 4px 8px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                position: 'relative', // Add relative positioning
              }}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stat.value}</div>
              <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>{stat.label}</div>
              {hoveredStat === index && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1.25rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    whiteSpace: 'nowrap',
                    backgroundColor: '#0D0D0F',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    zIndex: 1,
                    opacity: 0.9,
                  }}
                >
                  {stat.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '2rem', marginTop: '2rem', position: 'relative', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
          Explore Logos' Powerful Features
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {features.map((feature, index) => (
            <Link href={feature.href} key={index} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  backgroundColor: '#1E1E24',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  transform: hoveredFeature === index ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: hoveredFeature === index ? '0 4px 8px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: feature.color }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#F5F4F2' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: '1.4' }}>{feature.desc}</p>
                {feature.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      backgroundColor: feature.color,
                      color: '#0D0D0F',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      transition: 'opacity 0.2s',
                      opacity: hoveredFeature === index ? 1 : 0.7,
                    }}
                  >
                    {feature.badge}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Authors Section */}
      <section style={{ padding: '2rem', marginTop: '2rem', backgroundColor: '#141419' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
          Discover Classical Authors
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {featuredAuthors.map((author, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#1E1E24',
                padding: '1.25rem',
                borderRadius: '0.5rem',
                textAlign: 'left',
                transition: 'transform 0.3s, box-shadow 0.3s',
                transform: hoveredStat === index ? 'scale(1.05)' : 'scale(1)',
                boxShadow: hoveredStat === index ? '0 4px 8px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.3)',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{author.name}</h3>
              <div style={{ color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                Era: <span style={{ color: author.color, fontWeight: 'bold' }}>{author.era}</span>
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Works: {author.works}</div>
              <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                {author.texts} texts in the Logos library
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer style={{ backgroundColor: '#141419', padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#6B7280' }}>
          &copy; {new Date().getFullYear()} Logos. All rights reserved.
        </p>
      </footer>
    </div>
  );
}