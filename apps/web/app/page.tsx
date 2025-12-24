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
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      {/* Animated Background Particles */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={Math.random() * 10} duration={10 + Math.random() * 15} />
        ))}
      </div>

      <header style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#C9A227', transition: 'color 0.3s' }}
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}>
            <Link href="/" style={{textDecoration: 'none', color: hoveredButton ? '#F5F4F2' : '#C9A227'}}>Logos</Link>
        </div>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1rem' }}>
            {navItems.map(item => (
              <li key={item.name} style={{ transition: 'transform 0.2s' }}>
                <Link href={item.href} style={{ color: '#9CA3AF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'color 0.2s' }}
                 onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#F5F4F2'}
                 onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#9CA3AF'}>
                  {item.icon} {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <section style={{ padding: '4rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Explore the World of Classical Texts
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#9CA3AF', marginBottom: '2rem' }}>
          Unlock ancient wisdom with our advanced philological tools.
        </p>
        <div style={{ position: 'relative', display: 'inline-block', width: '70%', maxWidth: '600px' }}>
          <input
            type="text"
            placeholder="Search texts, authors, and concepts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onKeyDown={handleKeyPress}
            ref={searchInputRef}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '0.5rem',
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              outline: 'none',
              transition: 'all 0.3s',
              ...(searchFocused ? { boxShadow: '0 6px 12px rgba(0,0,0,0.5)' } : {}),
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              position: 'absolute',
              top: '50%',
              right: '0.5rem',
              transform: 'translateY(-50%)',
              background: '#C9A227',
              color: '#0D0D0F',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.3rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s, color 0.3s',
              ...(searchFocused ? { backgroundColor: '#F5F4F2', color: '#0D0D0F' } : {}),
            }}
          >
            Search
          </button>
          {showSuggestions && (
              <ul style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '100%',
                  backgroundColor: '#1E1E24',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  listStyle: 'none',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                  zIndex: 2,
                  marginTop: '0.2rem'
              }}>
                {searchSuggestions.map((suggestion, index) => (
                    <li key={index} style={{padding: '0.5rem', cursor: 'pointer', transition: 'background-color 0.2s', borderRadius: '0.3rem'}}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#141419'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
                    onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion}
                    </li>
                ))}
              </ul>
          )}
        </div>
      </section>

      <section style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
          Key Statistics
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', padding: '0 2rem' }}>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: '#1E1E24',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                transform: hoveredStat === index ? 'scale(1.05)' : 'scale(1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>{stat.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{stat.value}</div>
              <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>{stat.label}</div>
              {hoveredStat === index && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.5)', color: '#F5F4F2', fontSize: '0.8rem', opacity: 0.8, transition: 'opacity 0.3s' }}>
                  {stat.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
          Featured Tools
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', padding: '0 2rem' }}>
          {features.map((feature, index) => (
            <Link href={feature.href} key={feature.title} style={{textDecoration: 'none'}}>
            <div
              style={{
                backgroundColor: '#1E1E24',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                transform: hoveredFeature === index ? 'scale(1.05)' : 'scale(1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                borderLeft: `4px solid ${feature.color}`,
              }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: feature.color }}>{feature.icon}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#F5F4F2' }}>{feature.title}</div>
              <div style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '1rem' }}>{feature.desc}</div>
              <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: feature.color, color: '#0D0D0F', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', fontSize: '0.7rem' }}>
                {feature.badge}
              </div>
            </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
          Featured Authors
        </h2>
        <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '1rem', gap: '1rem', padding: '0 2rem' }}>
          {featuredAuthors.map(author => (
            <div key={author.name} style={{ flex: '0 0 auto', backgroundColor: '#1E1E24', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', minWidth: '200px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{author.name}</div>
              <div style={{ color: '#9CA3AF', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{author.works}</div>
              <div style={{ color: author.color, fontSize: '0.8rem', marginBottom: '0.5rem' }}>Era: {author.era}</div>
              <div style={{ color: '#C9A227', fontSize: '0.8rem' }}>Texts: {author.texts}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ backgroundColor: '#141419', padding: '1rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.8rem' }}>
        &copy; 2024 Logos. All rights reserved.
      </footer>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}