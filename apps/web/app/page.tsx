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
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', transform: 'scale(1.05)', transition: 'transform 0.3s ease-in-out' }}>
              {/* Animated Logo */}
              <svg width="32" height="32" viewBox="0 0 100 100" style={{ display: 'block' }}>
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#C9A227' }} />
                    <stop offset="100%" style={{ stopColor: '#F5F4F2' }} />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" stroke="#C9A227" strokeWidth="3" strokeDasharray="200" strokeDashoffset={animationOffset} style={{ transition: 'stroke-dashoffset 0.3s ease' }} />
              </svg>
              <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#F5F4F2', letterSpacing: '0.05em' }}>Logos</span>
            </div>
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {navItems.map((item, index) => (
              <Link href={item.href} key={index} style={{ color: '#9CA3AF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', transition: 'background-color 0.2s ease, color 0.2s ease', ':hover': { backgroundColor: '#2D3748', color: '#F5F4F2' } }}
               onMouseEnter={() => setHoveredButton(true)}
               onMouseLeave={() => setHoveredButton(false)}>
                {item.icon} {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '4rem 0', textAlign: 'center', backgroundImage: 'linear-gradient(to bottom, #0D0D0F, #141419)', borderBottom: '1px solid #2D3748' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '-0.05em', color: '#F5F4F2' }}>
            Unlock the Wisdom of the Ancient World
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#9CA3AF', lineHeight: '1.75', marginBottom: '2rem' }}>
            Explore a vast digital library of classical texts, powered by AI-driven search, translation, and analysis.
          </p>
          <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '500px' }}>
            <input
              type="text"
              ref={searchInputRef}
              placeholder="Search for texts, authors, concepts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#1E1E24',
                color: '#F5F4F2',
                border: '1px solid #2D3748',
                borderRadius: '0.5rem',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                ':focus': { borderColor: '#C9A227', boxShadow: '0 0 0 3px rgba(201, 162, 39, 0.3)' },
                outline: 'none',
              }}
            />
            <button onClick={handleSearch} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#C9A227', color: '#0D0D0F', padding: '0.75rem 1.25rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s ease', ':hover': { backgroundColor: '#B89222' } }}>
              Search
            </button>
          </div>

          {showSuggestions && (
              <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  backgroundColor: '#1E1E24',
                  border: '1px solid #2D3748',
                  borderRadius: '0.5rem',
                  marginTop: '0.25rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                  zIndex: 2,
                  maxWidth: '500px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
              }}>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                      {searchSuggestions.map((suggestion, index) => (
                          <li key={index} style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #2D3748', cursor: 'pointer', transition: 'background-color 0.2s ease', ':hover': { backgroundColor: '#2D3748' } }} onClick={() => handleSuggestionClick(suggestion)}>
                              {suggestion}
                          </li>
                      ))}
                  </ul>
              </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '3rem 0', backgroundColor: '#141419' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#1E1E24',
                padding: '2rem',
                borderRadius: '0.75rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: hoveredStat === index ? 'scale(1.05)' : 'scale(1)',
                cursor: 'pointer',
                ':hover': { boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)' },
              }}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#F5F4F2' }}>{stat.value}</div>
              <div style={{ fontSize: '1rem', color: '#9CA3AF', marginTop: '0.5rem' }}>{stat.label}</div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '1rem' }}>{stat.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#0D0D0F' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem', textAlign: 'center', color: '#F5F4F2' }}>
            Explore Our Powerful Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {features.map((feature, index) => (
              <Link href={feature.href} key={index} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    backgroundColor: '#1E1E24',
                    padding: '2rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    transform: hoveredFeature === index ? 'scale(1.05)' : 'scale(1)',
                    ':hover': { boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)' },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div>
                    <div style={{ fontSize: '2rem', color: feature.color, marginBottom: '0.5rem' }}>{feature.icon}</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '0.75rem' }}>{feature.title}</h3>
                    <p style={{ fontSize: '1rem', color: '#9CA3AF', lineHeight: '1.6' }}>{feature.desc}</p>
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                    <span style={{ backgroundColor: feature.color, color: '#0D0D0F', padding: '0.3rem 0.6rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'medium' }}>{feature.badge}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Searches Section */}
      <section style={{ padding: '3rem 0', backgroundColor: '#141419' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#F5F4F2' }}>Recent Searches</h2>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {recentSearches.map((search, index) => (
              <li key={index} style={{ backgroundColor: '#1E1E24', padding: '1.25rem', borderRadius: '0.5rem', marginBottom: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)', transition: 'background-color 0.2s ease', ':hover': { backgroundColor: '#2D3748' } }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'medium', color: '#F5F4F2' }}>{search.query}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>{search.results} results</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{search.timestamp}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured Authors Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#0D0D0F' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem', textAlign: 'center', color: '#F5F4F2' }}>
            Featured Authors
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {featuredAuthors.map((author, index) => (
              <div key={index} style={{ backgroundColor: '#1E1E24', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', ':hover': { boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)' }, transform: 'scale(1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '0.5rem' }}>{author.name}</h3>
                  <p style={{ fontSize: '1rem', color: '#9CA3AF', marginBottom: '0.75rem' }}>Works: {author.works}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Era:</span>
                    <span style={{ backgroundColor: author.color, color: '#0D0D0F', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem' }}>{author.era}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280', textAlign: 'right' }}>{author.texts} texts available</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1E1E24', borderTop: '1px solid #2D3748', padding: '2rem 0', textAlign: 'center', color: '#9CA3AF' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <p>&copy; {new Date().getFullYear()} Logos. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}