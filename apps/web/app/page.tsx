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

const navItems = [
  { name: 'Search', href: '/search' },
  { name: 'Translate', href: '/translate' },
  { name: 'Discover', href: '/discover' },
  { name: 'SEMANTIA', href: '/semantia' },
  { name: 'Connectome', href: '/connectome' },
  { name: 'Maps', href: '/maps' },
];

const searchSuggestions = [
  'virtue in Aristotle',
  'death in Seneca',
  'justice in Plato',
  'glory in Virgil',
  'wisdom in Marcus Aurelius',
  'honor in Homer',
  'friendship in Cicero',
  'courage in Caesar',
  'love in Ovid',
  'fate in Sophocles',
  'war in Thucydides',
  'philosophy in Epictetus',
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(false);
  const [animationOffset, setAnimationOffset] = useState(0);
  const [hoveredNavItem, setHoveredNavItem] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('logos_authenticated') === 'true';
    }
    return false;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [userProfile, setUserProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('logos_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      name: 'Scholar',
      email: '',
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true,
      }
    };
  });
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateSuggestions = () => {
      if (query.trim() && query.length > 0) {
        const filtered = searchSuggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setSelectedSuggestion(-1);
      } else {
        setShowSuggestions(false);
        setFilteredSuggestions([]);
        setSelectedSuggestion(-1);
      }
    };

    // Use setTimeout to ensure immediate updates
    const timeoutId = setTimeout(updateSuggestions, 0);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('logos_authenticated', isAuthenticated.toString());
      if (isAuthenticated) {
        localStorage.setItem('logos_profile', JSON.stringify(userProfile));
      } else {
        localStorage.removeItem('logos_profile');
      }
    }
  }, [isAuthenticated, userProfile]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication logic
    if (authMode === 'login') {
      if (email === 'demo@logos.com' && password === 'password') {
        setIsAuthenticated(true);
        setUserProfile(prev => ({ 
          ...prev, 
          name: 'Demo Scholar',
          email: email
        }));
        setShowAuthModal(false);
        setEmail('');
        setPassword('');
      } else if (email && password) {
        // Allow any email/password for demo
        setIsAuthenticated(true);
        setUserProfile(prev => ({ 
          ...prev, 
          name: email.split('@')[0],
          email: email
        }));
        setShowAuthModal(false);
        setEmail('');
        setPassword('');
      } else {
        setAuthError('Please enter valid credentials');
      }
    } else if (authMode === 'signup') {
      if (email && password && username) {
        setIsAuthenticated(true);
        setUserProfile(prev => ({ 
          ...prev, 
          name: username,
          email: email
        }));
        setShowAuthModal(false);
        setEmail('');
        setPassword('');
        setUsername('');
      } else {
        setAuthError('Please fill in all fields');
      }
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowProfile(false);
    setUserProfile({
      name: 'Scholar',
      email: '',
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true,
      }
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('logos_authenticated');
      localStorage.removeItem('logos_profile');
    }
  };

  const updatePreferences = (key: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (showSuggestions && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          handleSuggestionSelect(filteredSuggestions[selectedSuggestion]);
        } else {
          handleSearch(e as any);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      }
    } else if (e.key === 'Enter') {
      handleSearch(e as any);
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
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            backgroundColor: '#C9A227',
            borderRadius: '50%',
            left: `${(i * 137.5) % 100}%`,
            top: `${(i * 73.2) % 100}%`,
            opacity: 0.05 + (Math.sin((animationOffset + i * 10) * 0.02) * 0.05),
            transform: `scale(${1 + Math.sin((animationOffset + i * 15) * 0.03) * 0.5})`,
            transition: 'all 0.1s ease-out'
          }}
        />
      ))}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(201, 162, 39, 0.03) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: `pulse 4s ease-in-out infinite`
      }} />
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.03; }
          50% { transform: scale(1.2); opacity: 0.06; }
        }
      `}</style>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh' }}>
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'rgba(30, 30, 36, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.1)',
        padding: '16px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#C9A227',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📚 LOGOS
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                style={{
                  color: hoveredNavItem === index ? '#C9A227' : '#9CA3AF',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  transform: hoveredNavItem === index ? 'translateY(-1px)' : 'translateY(0)'
                }}
                onMouseEnter={() => setHoveredNavItem(index)}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  style={{
                    backgroundColor: 'rgba(201, 162, 39, 0.1)',
                    border: '1px solid #C9A227',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#C9A227',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {userProfile.name} ▼
                </button>
                
                {showProfile && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: '#1E1E24',
                    border: '1px solid rgba(201, 162, 39, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    minWidth: '280px',
                    zIndex: 1001,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                  }}>
                    <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(201, 162, 39, 0.2)' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{userProfile.name}</div>
                      <div style={{ color: '#9CA3AF', fontSize: '14px' }}>{userProfile.email}</div>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: '500', marginBottom: '12px' }}>Preferences</div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                          <input
                            type="checkbox"
                            checked={userProfile.preferences.notifications}
                            onChange={(e) => updatePreferences('notifications', e.target.checked)}
                            style={{ accentColor: '#C9A227' }}
                          />
                          Email Notifications
                        </label>
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                          Language
                        </label>
                        <select
                          value={userProfile.preferences.language}
                          onChange={(e) => updatePreferences('language', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            backgroundColor: '#0D0D0F',
                            border: '1px solid rgba(201, 162, 39, 0.3)',
                            borderRadius: '4px',
                            color: '#F5F4F2',
                            fontSize: '14px'
                          }}
                        >
                          <option value="en">English</option>
                          <option value="la">Latin</option>
                          <option value="grc">Ancient Greek</option>
                        </select>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '8px 16px',
                        backgroundColor: '#DC2626',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#F5F4F2',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  backgroundColor: '#C9A227',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#0D0D0F',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            padding: '32px',
            width: '400px',
            maxWidth: '90vw',
            border: '1px solid rgba(201, 162, 39, 0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, marginBottom: '8px', color: '#C9A227' }}>
                {authMode === 'login' ? 'Welcome Back' : 'Join LOGOS'}
              </h2>
              <p style={{ margin: 0, color: '#9CA3AF', fontSize: '14px' }}>
                {authMode === 'login' ? 'Sign in to your account' : 'Create your account'}
              </p>
            </div>

            <form onSubmit={handleAuth}>
              {authMode === 'signup' && (
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#0D0D0F',
                      border: '1px solid rgba(201, 162, 39, 0.3)',
                      borderRadius: '8px',
                      color: '#F5F4F2',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>
              )}
              
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#0D0D0F',
                    border: '1px solid rgba(201, 162, 39, 0.3)',
                    borderRadius: '8px',
                    color: '#F5F4F2',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#0D0D0F',
                    border: '1px solid rgba(201, 162, 39, 0.3)',
                    borderRadius: '8px',
                    color: '#F5F4F2',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              {authError && (
                <div style={{
                  marginBottom: '16px',
                  padding: '12px',
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  borderRadius: '8px',
                  color: '#DC2626',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: isLoading ? '#6B7280' : '#C9A227',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#0D0D0F',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  marginBottom: '16px',
                  transition: 'all 0.2s ease'
                }}
              >
                {isLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'signup' : 'login');
                  setAuthError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#C9A227',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textDecoration: 'underline',
                  marginRight: '16px'
                }}
              >
                {authMode === 'login' ? 'Create Account' : 'Sign In Instead'}
              </button>
              
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError('');
                  setEmail('');
                  setPassword('');
                  setUsername('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>

            {authMode === 'login' && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: 'rgba(201, 162, 39, 0.1)',
                border: '1px solid rgba(201, 162, 39, 0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#9CA3AF',
                textAlign: 'center'
              }}>
                Demo credentials: demo@logos.com / password
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={{ padding: '64px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            margin: '0 0 24px 0',
            background: 'linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            LOGOS
          </h1>
          
          <p style={{
            fontSize: '1.5rem',
            color: '#9CA3AF',
            margin: '0 0 48px 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6'
          }}>
            AI-powered exploration of classical literature. Search by meaning, discover connections, trace the evolution of ideas.
          </p>

          {/* Search Bar */}
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 32px auto' }}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search by meaning: 'virtue in Stoicism', 'death in tragedy'..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setSearchFocused(false);
                    setShowSuggestions(false);
                  }, 200);
                }}
                style={{
                  width: '100%',
                  padding: '20px 60px 20px 24px',
                  fontSize: '18px',
                  backgroundColor: searchFocused ? '#1E1E24' : 'rgba(30, 30, 36, 0.8)',
                  border: searchFocused ? '2px solid #C9A227' : '1px solid rgba(156, 163, 175, 0.3)',
                  borderRadius: '16px',
                  color: '#F5F4F2',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  boxSizing: 'border-box'
                }}
              />
              
              <button
                type="submit"
                onMouseEnter={() => setHoveredButton(true)}
                onMouseLeave={() => setHoveredButton(false)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: hoveredButton ? '#E8D5A3' : '#C9A227',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '16px'
                }}
              >
                🔍
              </button>
            </form>

            {/* Search Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '8px',
                backgroundColor: '#1E1E24',
                border: '1px solid rgba(201, 162, 39, 0.3)',
                borderRadius: '12px',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 100,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
              }}>
                {filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      backgroundColor: selectedSuggestion === index ? 'rgba(201, 162, 39, 0.1)' : 'transparent',
                      color: selectedSuggestion === index ? '#C9A227' : '#F5F4F2',
                      borderBottom: index < filteredSuggestions.length - 1 ? '1px solid rgba(156, 163, 175, 0.1)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🔍 {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '48px' }}>
            Try: "{searchSuggestions[Math.floor(animationOffset / 60) % searchSuggestions.length]}"
          </p>
        </div>

        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '64px'
        }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
              style={{
                backgroundColor: hoveredStat === index ? 'rgba(201, 162, 39, 0