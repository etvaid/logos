'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Homepage() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push('/search?q=' + encodeURIComponent(searchQuery.trim()))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as any)
    }
  }

  const features = [
    {
      title: 'Search & Discovery',
      description: 'Advanced semantic search across ancient texts with AI-powered insights',
      href: '/search',
      icon: '🔍'
    },
    {
      title: 'Translation Hub',
      description: 'Context-aware translations with scholarly annotations',
      href: '/translate',
      icon: '🌐'
    },
    {
      title: 'Discover Connections',
      description: 'Explore thematic and conceptual relationships between texts',
      href: '/discover',
      icon: '🔗'
    },
    {
      title: 'Semantia AI',
      description: 'AI-powered analysis and interpretation of classical literature',
      href: '/semantia',
      icon: '🧠'
    },
    {
      title: 'Chronos Timeline',
      description: 'Interactive historical timeline of authors and works',
      href: '/chronos',
      icon: '⏳'
    },
    {
      title: 'Geographic Maps',
      description: 'Explore the ancient world through interactive maps',
      href: '/maps',
      icon: '🗺️'
    }
  ]

  const stats = [
    { label: 'Passages', value: '1.7M', color: '#C9A227' },
    { label: 'Words', value: '892K', color: '#3B82F6' },
    { label: 'Connections', value: '500K', color: '#DC2626' }
  ]

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/search" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Search</Link>
            <Link href="/translate" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Translate</Link>
            <Link href="/discover" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Discover</Link>
            <Link href="/semantia" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Semantia</Link>
            <Link href="/chronos" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Chronos</Link>
            <Link href="/maps" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Maps</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem', background: `linear-gradient(135deg, #C9A227, #3B82F6)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Explore the Ancient World
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#F5F4F2', opacity: 0.8 }}>
          Discover connections across Greek and Latin literature with AI-powered insights
        </p>
        
        <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search ancient texts, authors, themes..."
            style={{
              width: '100%',
              padding: '1rem 4rem 1rem 1rem',
              fontSize: '1.1rem',
              backgroundColor: '#1E1E24',
              border: '2px solid #C9A227',
              borderRadius: '8px',
              color: '#F5F4F2',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            onClick={handleSearch}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#C9A227',
              color: '#0D0D0F',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </form>
      </section>

      {/* Stats Section */}
      <section style={{ backgroundColor: '#1E1E24', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
          {stats.map((stat, index) => (
            <div key={index}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: stat.color, marginBottom: '0.5rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#F5F4F2', opacity: 0.8 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '3rem', color: '#C9A227' }}>
          Explore Ancient Literature
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                backgroundColor: '#1E1E24',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid transparent',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C9A227'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#C9A227' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#F5F4F2', opacity: 0.8, lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Language Badge Section */}
      <section style={{ backgroundColor: '#1E1E24', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#C9A227' }}>
            Bilingual Corpus
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                backgroundColor: '#3B82F6', 
                color: 'white', 
                borderRadius: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Α
              </div>
              <span style={{ color: '#F5F4F2' }}>Ancient Greek</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                backgroundColor: '#DC2626', 
                color: 'white', 
                borderRadius: '4px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                L
              </div>
              <span style={{ color: '#F5F4F2' }}>Latin</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0D0D0F', padding: '2rem', textAlign: 'center', borderTop: '1px solid #1E1E24' }}>
        <p style={{ color: '#F5F4F2', opacity: 0.6 }}>
          © 2024 LOGOS Classical Literature Platform
        </p>
      </footer>
    </div>
  )
}