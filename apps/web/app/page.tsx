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
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
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
    }, 100); // Delay to allow click on suggestion
  };
    
  const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        if (searchInputRef.current) {
            searchInputRef.current.focus(); // Keep focus on the input
        }
    };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden' }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        borderBottom: '1px solid #2D3748', 
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', transform: 'scale(1.05)', transition: 'transform 0.3s ease-in-out' }}>
              <div style={{ 
                fontSize: '1.75rem',
                fontWeight: 'bold', 
                background: `linear-gradient(45deg, #C9A227, #F59E0B)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)'
              }}>
                Logos
              </div>
            </div>
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} style={{ color: '#9CA3AF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'color 0.2s ease-in-out', '&:hover': { color: '#F5F4F2' } }}>
                <span style={{fontSize: '1rem'}}>{item.icon}</span>
                <span style={{fontSize: '0.9rem'}}>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: '6rem', paddingBottom: '6rem' }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '100%',
          background: `linear-gradient(45deg, rgba(201, 162, 39, 0.1), rgba(245, 158, 11, 0.1))`,
          transform: `translateX(-25%) rotate(${animationOffset}deg)`,
          transformOrigin: 'center',
          pointerEvents: 'none',
          animation: 'none',
          transition: 'opacity 0.3s ease',
          opacity: 1,
          zIndex: 0
        }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            Explore the World of Classical Texts
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#9CA3AF', marginBottom: '2rem' }}>
            Uncover the wisdom of the ancients with our advanced search and analysis tools.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '70%', maxWidth: '600px' }}>
              <input
                type="text"
                ref={searchInputRef}
                placeholder="Search classical texts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onKeyDown={handleKeyPress}
                style={{
                  padding: '1rem',
                  paddingRight: '3.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #2D3748',
                  backgroundColor: '#1E1E24',
                  color: '#F5F4F2',
                  width: '100%',
                  transition: 'border-color 0.2s ease',
                  outline: 'none',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  '&:focus': {
                    borderColor: '#C9A227',
                  },
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '0.5rem',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#C9A227',
                  color: '#0D0D0F',
                  border: 'none',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
                  '&:hover': {
                    backgroundColor: '#F59E0B',
                  },
                }}
              >
                Search
              </button>
              {showSuggestions && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  backgroundColor: '#1E1E24',
                  border: '1px solid #2D3748',
                  borderRadius: '0.375rem',
                  marginTop: '0.25rem',
                  padding: '0.5rem',
                  zIndex: 2,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                  overflow: 'hidden'
                }}>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    {searchSuggestions.map((suggestion, index) => (
                      <li key={index} style={{ padding: '0.5rem', cursor: 'pointer', transition: 'background-color 0.2s ease', '&:hover': { backgroundColor: '#2D3748' } }}
                          onClick={() => handleSuggestionClick(suggestion)}>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ backgroundColor: '#141419', padding: '4rem 0', borderBottom: '1px solid #2D3748' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
              style={{
                backgroundColor: '#1E1E24',
                padding: '2rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                transform: hoveredStat === index ? 'scale(1.05)' : 'scale(1)',
                boxShadow: hoveredStat === index ? '0 6px 12px rgba(0, 0, 0, 0.4)' : '0 4px 6px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '1.2rem', color: '#6B7280' }}>{stat.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F5F4F2', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>{stat.value}</div>
              <div style={{ fontSize: '1.1rem', color: '#9CA3AF' }}>{stat.label}</div>
              <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.5rem', transition: 'opacity 0.2s ease', opacity: hoveredStat === index ? 1 : 0 }}>{stat.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>
            Key Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {features.map((feature, index) => (
              <Link key={feature.title} href={feature.href} style={{ textDecoration: 'none' }}>
                <div
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  style={{
                    backgroundColor: '#1E1E24',
                    padding: '2rem',
                    borderRadius: '0.5rem',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    transform: hoveredFeature === index ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: hoveredFeature === index ? '0 6px 12px rgba(0, 0, 0, 0.4)' : '0 4px 6px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                   <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: feature.color, color: '#0D0D0F', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {feature.badge}
                    </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', color: feature.color, marginBottom: '0.5rem', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>{feature.icon}</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '0.5rem' }}>{feature.title}</h3>
                    <p style={{ fontSize: '1rem', color: '#9CA3AF' }}>{feature.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Searches */}
      <section style={{ backgroundColor: '#141419', padding: '3rem 0', borderTop: '1px solid #2D3748', borderBottom: '1px solid #2D3748'}}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#F5F4F2', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>Recent Searches</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {recentSearches.map((search, index) => (
              <li key={index} style={{ marginBottom: '0.75rem', padding: '1rem', backgroundColor: '#1E1E24', borderRadius: '0.375rem', borderBottom: '1px solid #2D3748', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.02)' } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.1rem', color: '#F5F4F2' }}>{search.query}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>Results: {search.results}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{search.timestamp}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured Authors */}
      <section style={{ padding: '3rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#F5F4F2', textAlign: 'center', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)' }}>Featured Authors</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {featuredAuthors.map((author, index) => (
              <div key={author.name} style={{ backgroundColor: '#1E1E24', padding: '1.5rem', borderRadius: '0.375rem', textAlign: 'center', borderBottom: `4px solid ${author.color}`, transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.03)' } }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '0.5rem', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>{author.name}</div>
                <div style={{ fontSize: '1rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>Works: {author.works}</div>
                 <div style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '0.5rem' }}>Texts: {author.texts}</div>
                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Era: {author.era}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#141419', padding: '2rem 0', textAlign: 'center', color: '#9CA3AF', fontSize: '0.85rem', borderTop: '1px solid #2D3748' }}>
        <p>&copy; {new Date().getFullYear()} Logos. All rights reserved.</p>
      </footer>
    </div>
  );
}