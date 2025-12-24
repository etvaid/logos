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
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}>
                ΛΟΓΟΣ
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '0.9rem', fontStyle: 'italic' }}>SCHOLARIS</div>
            </div>
          </Link>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {navItems.map((item, i) => (
              <Link key={i} href={item.href} style={{ 
                textDecoration: 'none', 
                color: '#9CA3AF', 
                transition: 'color 0.3s ease-in-out, transform 0.3s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.9rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                ':hover': {
                  color: '#F5F4F2',
                  transform: 'scale(1.1)'
                }
              }}>
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 0', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(${animationOffset}deg, #1E1E24 20%, #0D0D0F 80%)`,
          zIndex: -1,
          opacity: 0.7
        }} />

        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
          Unlock the Wisdom of the Ages
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#9CA3AF', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          Explore classical texts with cutting-edge AI-powered tools. Logos Scholaris provides semantic search, translation, and discovery for philologists, historians, and language enthusiasts.
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', display: 'inline-block', width: '80%', maxWidth: '600px' }}>
          <input
            type="text"
            placeholder="Search classical texts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            ref={searchInputRef}
            style={{
              padding: '1rem',
              fontSize: '1rem',
              width: '100%',
              borderRadius: '0.5rem',
              border: '1px solid #4B5563',
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              transition: 'all 0.3s ease-in-out',
              boxShadow: searchFocused ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none',
              outline: 'none',
              ':focus': {
                borderColor: '#3B82F6',
                boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
              }
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              padding: '0.75rem 1.25rem',
              backgroundColor: '#C9A227',
              color: '#0D0D0F',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease-in-out, transform 0.3s ease-in-out',
              ':hover': {
                backgroundColor: '#F59E0B',
                transform: 'scale(1.05)'
              }
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
                            border: '1px solid #4B5563',
                            borderRadius: '0.5rem',
                            marginTop: '0.25rem',
                            padding: '0.5rem',
                            zIndex: 1,
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}>
                            <ul>
                                {searchSuggestions.map((suggestion, index) => (
                                    <li key={index} style={{
                                        padding: '0.5rem',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s ease-in-out',
                                        ':hover': {
                                            backgroundColor: '#2D3748'
                                        }
                                    }} onClick={() => handleSuggestionClick(suggestion)}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#141419' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#1E1E24',
                padding: '2rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                transform: hoveredStat === index ? 'scale(1.05)' : 'scale(1)',
                boxShadow: hoveredStat === index ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                ':hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                }
              }}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stat.value}</div>
              <div style={{ color: '#9CA3AF' }}>{stat.label}</div>
              <div style={{ color: '#6B7280', marginTop: '0.5rem', fontSize: '0.875rem' }}>{stat.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '3rem' }}>
          Explore the Features
        </h2>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {features.map((feature, index) => (
            <Link key={index} href={feature.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  backgroundColor: '#1E1E24',
                  padding: '2rem',
                  borderRadius: '0.75rem',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  transform: hoveredFeature === index ? 'translateY(-5px)' : 'translateY(0)',
                  boxShadow: hoveredFeature === index ? '0 6px 8px rgba(0, 0, 0, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  ':hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.4)'
                  }
                }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', color: feature.color }}>{feature.icon}</div>
                  <div style={{ 
                    backgroundColor: feature.color, 
                    color: '#0D0D0F', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.375rem', 
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>{feature.badge}</div>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#F5F4F2' }}>{feature.title}</h3>
                <p style={{ color: '#9CA3AF', lineHeight: '1.4' }}>{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Searches Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#141419' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
            Recent Searches
          </h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recentSearches.map((search, index) => (
              <li key={index} style={{ 
                backgroundColor: '#1E1E24', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                marginBottom: '0.75rem',
                transition: 'background-color 0.3s ease-in-out',
                ':hover': {
                  backgroundColor: '#2D3748'
                }
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#F5F4F2' }}>{search.query}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>{search.results} results, {search.timestamp}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured Authors Section */}
      <section style={{ padding: '4rem 0' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '3rem' }}>
          Featured Authors
        </h2>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {featuredAuthors.map((author, index) => (
            <div key={index} style={{
              backgroundColor: '#1E1E24',
              padding: '2rem',
              borderRadius: '0.75rem',
              textAlign: 'center',
              border: `2px solid ${author.color}`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              ':hover': {
                transform: 'scale(1.05)',
                boxShadow: `0 4px 6px rgba(0, 0, 0, 0.3)`
              }
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{author.name}</h3>
              <p style={{ color: '#9CA3AF', marginBottom: '0.75rem' }}>{author.works}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ color: author.color, fontWeight: 'bold' }}>{author.era}</span>
                {/* <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>({author.eraStart} - {author.eraEnd})</span> */}
              </div>
              <div style={{ color: '#6B7280', fontSize: '0.875rem' }}>Texts: {author.texts}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#141419', padding: '2rem 0', textAlign: 'center', color: '#9CA3AF' }}>
        <p>© {new Date().getFullYear()} Logos Scholaris. All rights reserved.</p>
      </footer>
    </div>
  );
}