"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Languages, Brain, Network, Globe, Clock, GraduationCap, Sparkles, Menu, X, Home, Map, FileText, Compass } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/browse', icon: BookOpen, label: 'Browse' },
  { href: '/translate', icon: Languages, label: 'Translate' },
  { href: '/semantia', icon: Brain, label: 'SEMANTIA' },
  { href: '/chronos', icon: Clock, label: 'CHRONOS' },
  { href: '/discover', icon: Sparkles, label: 'Discover' },
  { href: '/connectome', icon: Network, label: 'Connectome' },
  { href: '/maps', icon: Map, label: 'Maps' },
  { href: '/timeline', icon: Globe, label: 'Timeline' },
  { href: '/reader', icon: FileText, label: 'Reader' },
  { href: '/lexicon', icon: Compass, label: 'Lexicon' },
  { href: '/learn', icon: GraduationCap, label: 'Learn' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  
  return (
    <html lang="en">
      <head>
        <title>LOGOS - Classical Research Platform</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Crimson+Pro:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, backgroundColor: '#0D0D0F', color: '#F5F3EF', fontFamily: '"Crimson Pro", serif', minHeight: '100vh' }}>
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '64px',
          backgroundColor: 'rgba(13,13,15,0.95)',
          borderBottom: '1px solid rgba(201,169,98,0.2)',
          display: 'flex', alignItems: 'center', padding: '0 1.5rem',
          zIndex: 1000, backdropFilter: 'blur(10px)'
        }}>
          <button onClick={() => setOpen(!open)} style={{
            background: 'none', border: 'none', color: '#C9A962',
            cursor: 'pointer', padding: '0.5rem', marginRight: '1rem'
          }}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 300, color: '#C9A962', fontFamily: '"Cormorant Garamond", serif', letterSpacing: '0.1em' }}>
              ΛΟΓΟΣ
            </span>
          </Link>
          
          <nav style={{ marginLeft: 'auto', display: 'flex', gap: '1.5rem' }}>
            {navItems.slice(0, 7).map(item => (
              <Link key={item.href} href={item.href} style={{
                color: 'rgba(245,243,239,0.7)', textDecoration: 'none',
                fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'color 0.2s'
              }}>
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </header>
        
        <aside style={{
          position: 'fixed', top: '64px', left: open ? 0 : '-280px',
          width: '280px', height: 'calc(100vh - 64px)',
          backgroundColor: 'rgba(30,30,36,0.98)',
          borderRight: '1px solid rgba(201,169,98,0.1)',
          transition: 'left 0.3s ease', zIndex: 999,
          padding: '1.5rem 0', overflowY: 'auto'
        }}>
          <div style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
            <span style={{ color: 'rgba(245,243,239,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Navigation
            </span>
          </div>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.875rem 1.5rem', color: 'rgba(245,243,239,0.7)',
              textDecoration: 'none', transition: 'all 0.2s',
              borderLeft: '3px solid transparent'
            }}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </aside>
        
        {open && (
          <div onClick={() => setOpen(false)} style={{
            position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998
          }} />
        )}
        
        <main style={{ paddingTop: '64px', minHeight: '100vh' }}>
          {children}
        </main>
        
        <footer style={{
          backgroundColor: '#0D0D0F',
          borderTop: '1px solid rgba(201,169,98,0.1)',
          padding: '2rem', textAlign: 'center',
          color: 'rgba(245,243,239,0.5)', fontSize: '0.875rem'
        }}>
          <p>LOGOS Classical Research Platform</p>
          <p style={{ marginTop: '0.5rem' }}>1,708,058 passages • 403 authors • 892,317 embeddings</p>
        </footer>
      </body>
    </html>
  );
}
