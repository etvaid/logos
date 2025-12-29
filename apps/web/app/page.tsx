'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CorpusStats {
  totalTexts: number;
  totalAuthors: number;
  totalLanguages: number;
  totalWords: number;
}

interface FloatingLetter {
  id: number;
  letter: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<CorpusStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [floatingLetters, setFloatingLetters] = useState<FloatingLetter[]>([]);

  const greekLetters = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];

  useEffect(() => {
    // Generate floating letters
    const letters: FloatingLetter[] = [];
    for (let i = 0; i < 15; i++) {
      letters.push({
        id: i,
        letter: greekLetters[Math.floor(Math.random() * greekLetters.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 15 + Math.random() * 10
      });
    }
    setFloatingLetters(letters);

    // Fetch stats
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8001/corpus/availability');
        if (!response.ok) {
          throw new Error('Failed to fetch corpus statistics');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const featureCards = [
    {
      title: 'Reader',
      description: 'Read classical texts with advanced morphological analysis and commentary',
      icon: '📖',
      href: '/reader',
      color: 'text-[#5BA4E8]'
    },
    {
      title: 'SEMANTIA',
      description: 'Explore semantic relationships and conceptual networks in ancient texts',
      icon: '🧠',
      href: '/semantia',
      color: 'text-[#C9A962]'
    },
    {
      title: 'Translate',
      description: 'Advanced translation tools with contextual analysis and suggestions',
      icon: '🔄',
      href: '/translate',
      color: 'text-[#E85B5B]'
    },
    {
      title: 'Learn',
      description: 'Interactive lessons and exercises for classical languages',
      icon: '🎓',
      href: '/learn',
      color: 'text-[#5BA4E8]'
    },
    {
      title: 'Discovery',
      description: 'Discover new texts, authors, and connections through intelligent search',
      icon: '🔍',
      href: '/discovery',
      color: 'text-[#C9A962]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF] relative overflow-hidden">
      {/* Floating Greek Letters Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        {floatingLetters.map((letter) => (
          <div
            key={letter.id}
            className="absolute text-[#5BA4E8] font-serif text-4xl animate-pulse"
            style={{
              left: `${letter.x}%`,
              top: `${letter.y}%`,
              animationDelay: `${letter.delay}s`,
              animationDuration: `${letter.duration}s`
            }}
          >
            {letter.letter}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-[#C9A962]/20 bg-[#0D0D0F]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#C9A962]">
                LOGOS
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/reader" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">
                  Reader
                </Link>
                <Link href="/semantia" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">
                  SEMANTIA
                </Link>
                <Link href="/translate" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">
                  Translate
                </Link>
                <Link href="/learn" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">
                  Learn
                </Link>
                <Link href="/discovery" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">
                  Discovery
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 border border-[#C9A962]/20 hover:border-[#C9A962]/40 rounded-lg text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-all">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-[#C9A962] mb-6 font-serif">
            LOGOS
          </h1>
          <p className="text-xl md:text-2xl text-[#F5F3EF]/70 mb-12 font-serif">
            The Bible for Classical Studies
          </p>
          <p className="text-lg text-[#F5F3EF]/60 max-w-2xl mx-auto mb-12">
            Discover the ancient world through advanced digital humanities tools. 
            Read, analyze, translate, and explore classical texts with unprecedented depth and insight.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reader" className="px-8 py-4 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/90 transition-all">
              Start Reading
            </Link>
            <Link href="/discovery" className="px-8 py-4 border border-[#C9A962]/20 hover:border-[#C9A962]/40 rounded-lg text-[#F5F3EF] hover:bg-[#C9A962]/10 transition-all">
              Explore Corpus
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-8">
            {loading ? (
              <div className="text-center text-[#F5F3EF]/70">
                <div className="animate-spin h-8 w-8 border-2 border-[#C9A962]/20 border-t-[#C9A962] rounded-full mx-auto mb-4"></div>
                Loading corpus statistics...
              </div>
            ) : error ? (
              <div className="text-center text-[#E85B5B]">
                <p>Error loading statistics: {error}</p>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-[#C9A962] mb-2">
                    {stats.totalTexts?.toLocaleString() || '0'}
                  </div>
                  <div className="text-[#F5F3EF]/70">Texts</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-[#C9A962] mb-2">
                    {stats.totalAuthors?.toLocaleString() || '0'}
                  </div>
                  <div className="text-[#F5F3EF]/70">Authors</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-[#C9A962] mb-2">
                    {stats.totalLanguages?.toLocaleString() || '0'}
                  </div>
                  <div className="text-[#F5F3EF]/70">Languages</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-[#C9A962] mb-2">
                    {stats.totalWords?.toLocaleString() || '0'}
                  </div>
                  <div className="text-[#F5F3EF]/70">Words</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#F5F3EF] mb-4 font-serif">
            Powerful Tools for Classical Studies
          </h2>
          <p className="text-lg text-[#F5F3EF]/70 text-center mb-12 max-w-3xl mx-auto">
            Explore ancient texts with cutting-edge digital humanities technology
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, index) => (
              <Link key={index} href={card.href}>
                <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 hover:border-[#C9A962]/40 p-6 transition-all duration-300 hover:bg-[#C9A962]/10 group h-full">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${card.color} group-hover:text-[#C9A962] transition-colors`}>
                    {card.title}
                  </h3>
                  <p className="text-[#F5F3EF]/70 group-hover:text-[#F5F3EF]/90 transition-colors">
                    {card.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#C9A962]/20 mt-20 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#C9A962] mb-4 font-serif">
              LOGOS
            </div>
            <p className="text-[#F5F3EF]/70 mb-6">
              The Bible for Classical Studies
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <Link href="/about" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">
                Contact
              </Link>
              <Link href="/docs" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">
                Documentation
              </Link>
            </div>
            <div className="text-[#F5F3EF]/50 text-sm">
              <p className="font-serif">
                <span className="text-[#5BA4E8]">Λόγος</span> · 
                <span className="text-[#E85B5B]">Verbum</span> · 
                <span className="text-[#C9A962]">Word</span>
              </p>
              <p className="mt-2">
                © 2024 LOGOS. Advancing Classical Studies through Technology.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}