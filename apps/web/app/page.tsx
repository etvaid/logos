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
        pointerEvents: 'none', // Prevent blocking interactions
      }}
    />
  );


  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      {/* Floating Particles */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={Math.random() * 5} duration={10 + Math.random() * 10} />
        ))}
      </div>

      {/* Navigation */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '1rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 10, transition: 'background-color 0.3s ease' }}>
        {navItems.map((item, index) => (
          <Link href={item.href} key={index} style={{ color: '#F5F4F2', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.3s ease', padding: '0.5rem 1rem', borderRadius: '0.375rem', '&:hover': { color: '#C9A227' } }}>
            <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Hero Section */}
      <header style={{ padding: '4rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Logos: Ancient Texts, Modern Discovery</h1>
        <p style={{ fontSize: '1.25rem', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>Explore the depths of classical literature with our AI-powered research platform.</p>

        {/* Search Bar */}
        <div style={{ maxWidth: '600px', margin: '2rem auto', position: 'relative' }}>
          <input
            type="text"
            ref={searchInputRef}
            placeholder="Search texts, authors, concepts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              border: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              outline: 'none',
              '&:focus': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
              },
            }}
          />
          <button
            onClick={handleSearch}
            onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}
            style={{
              position: 'absolute',
              top: '50%',
              right: '0.75rem',
              transform: 'translateY(-50%)',
              backgroundColor: '#C9A227',
              color: '#0D0D0F',
              border: 'none',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, color 0.3s ease',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              '&:hover': {
                backgroundColor: hoveredButton ? '#F5F4F2' : '#C9A227',
                color: hoveredButton ? '#0D0D0F' : '#0D0D0F',
              },
            }}
          >
            Search
          </button>
        </div>

        {/* Search Suggestions (Conditionally Rendered) */}
        {searchFocused && showSuggestions && (
          <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#141419', borderRadius: '0.5rem', boxShadow: '0 4px 8px rgba(0,0,0,0.5)', padding: '1rem' }}>
            <h3 style={{ color: '#9CA3AF', marginBottom: '0.5rem' }}>Suggestions:</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {searchSuggestions.map((suggestion, index) => (
                <li key={index} style={{ padding: '0.5rem', cursor: 'pointer', transition: 'background-color 0.3s ease', '&:hover': { backgroundColor: '#1E1E24' } }} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Stats Section */}
      <section style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#F5F4F2', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Unlock Ancient Wisdom</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', justifyContent: 'center', padding: '0 2rem' }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
              style={{
                backgroundColor: '#1E1E24',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: hoveredStat === index ? 'scale(1.05)' : 'scale(1)',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#C9A227' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stat.value}</div>
              <div style={{ fontSize: '1rem', color: '#9CA3AF' }}>{stat.label}</div>
              {hoveredStat === index && <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.5rem' }}>{stat.detail}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '3rem 2rem', backgroundColor: '#141419', borderRadius: '1rem', margin: '2rem', boxShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: '#F5F4F2', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Explore Our Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {features.map((feature, index) => (
            <Link href={feature.href} key={index} style={{ textDecoration: 'none' }}>
              <div
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  backgroundColor: '#1E1E24',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  transform: hoveredFeature === index ? 'scale(1.05)' : 'scale(1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem', color: feature.color }}>{feature.icon}</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#F5F4F2' }}>{feature.title}</h3>
                  <p style={{ fontSize: '1rem', color: '#9CA3AF', lineHeight: '1.5' }}>{feature.desc}</p>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
                  <span style={{ backgroundColor: feature.color, color: '#0D0D0F', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 'bold' }}>{feature.badge}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Searches Section */}
      <section style={{ padding: '2rem', textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#F5F4F2' }}>Recent Searches</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {recentSearches.map((search, index) => (
            <li key={index} style={{ backgroundColor: '#1E1E24', padding: '1rem', borderRadius: '0.5rem', marginBottom: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>{search.query}</span>
                  <span style={{ color: '#9CA3AF', marginLeft: '0.5rem' }}>({search.results} results)</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{search.timestamp}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured Authors Section */}
      <section style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#1E1E24', borderRadius: '1rem', margin: '2rem', boxShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#F5F4F2', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Featured Authors</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', justifyContent: 'center', padding: '0 2rem' }}>
          {featuredAuthors.map((author, index) => (
            <div key={index} style={{ backgroundColor: '#141419', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', transition: 'transform 0.3s ease' , transform: hoveredStat === index ? 'scale(1.05)' : 'scale(1)'}}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#F5F4F2' }}>{author.name}</h3>
              <p style={{ fontSize: '1rem', color: '#9CA3AF' }}>Works: {author.works}</p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Era: {author.era}</p>
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ display: 'inline-block', width: '0.75rem', height: '0.75rem', borderRadius: '50%', backgroundColor: author.color, marginRight: '0.5rem' }}></span>
                <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Texts: {author.texts}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1E1E24', padding: '1rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.875rem', borderTop: '1px solid #141419' }}>
        &copy; {new Date().getFullYear()} Logos. All rights reserved.
      </footer>
    </div>
  );
}