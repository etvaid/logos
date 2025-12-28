'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CorpusStats {
  totalTexts: number;
  totalAuthors: number;
  languages: string[];
  totalWords: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<CorpusStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCorpusStats();
  }, []);

  const fetchCorpusStats = async () => {
    try {
      const response = await fetch('/api/corpus/availability');
      if (!response.ok) {
        throw new Error('Failed to fetch corpus stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Navigation */}
      <nav className="bg-[#0D0D0F]/95 backdrop-blur-sm border-b border-[#C9A962]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-[#C9A962] hover:text-[#F5F3EF] transition-colors duration-200">
                LOGOS
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/corpus" className="text-[#F5F3EF] hover:text-[#C9A962] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Corpus
                </Link>
                <Link href="/search" className="text-[#F5F3EF] hover:text-[#C9A962] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Search
                </Link>
                <Link href="/authors" className="text-[#F5F3EF] hover:text-[#C9A962] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Authors
                </Link>
                <Link href="/about" className="text-[#F5F3EF] hover:text-[#C9A962] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  About
                </Link>
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-[#F5F3EF] hover:text-[#C9A962] focus:outline-none focus:text-[#C9A962] transition-colors duration-200">
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A962]/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-[#C9A962]">LOGOS</span>
            </h1>
            <p className="mt-6 text-xl sm:text-2xl md:text-3xl font-light text-[#F5F3EF]/90 max-w-4xl mx-auto">
              The Bible for Classical Studies
            </p>
            <p className="mt-8 text-lg sm:text-xl text-[#F5F3EF]/70 max-w-3xl mx-auto leading-relaxed">
              Explore the rich tapestry of ancient literature, philosophy, and historical texts that have shaped Western civilization. Access digitized manuscripts, critical editions, and scholarly commentaries all in one comprehensive platform.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#0D0D0F] bg-[#C9A962] hover:bg-[#F5F3EF] transition-colors duration-200 shadow-lg hover:shadow-xl">
                Start Exploring
              </Link>
              <Link href="/corpus" className="inline-flex items-center justify-center px-8 py-3 border border-[#C9A962] text-base font-medium rounded-md text-[#C9A962] hover:bg-[#C9A962]/10 transition-colors duration-200">
                Browse Corpus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#0D0D0F]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] mb-4">
              Corpus Statistics
            </h2>
            <p className="text-lg text-[#F5F3EF]/70">
              Discover the scope of our classical text collection
            </p>
          </div>
          
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A962]"></div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">Failed to load statistics</p>
              <button 
                onClick={fetchCorpusStats}
                className="px-6 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-md hover:bg-[#F5F3EF] transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          )}
          
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 hover:border-[#C9A962]/40 transition-colors duration-200">
                <div className="text-3xl sm:text-4xl font-bold text-[#C9A962] mb-2">
                  {stats.totalTexts.toLocaleString()}
                </div>
                <div className="text-[#F5F3EF]/80 font-medium">
                  Total Texts
                </div>
              </div>
              
              <div className="text-center p-6 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 hover:border-[#C9A962]/40 transition-colors duration-200">
                <div className="text-3xl sm:text-4xl font-bold text-[#C9A962] mb-2">
                  {stats.totalAuthors.toLocaleString()}
                </div>
                <div className="text-[#F5F3EF]/80 font-medium">
                  Authors
                </div>
              </div>
              
              <div className="text-center p-6 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 hover:border-[#C9A962]/40 transition-colors duration-200">
                <div className="text-3xl sm:text-4xl font-bold text-[#C9A962] mb-2">
                  {stats.languages.length}
                </div>
                <div className="text-[#F5F3EF]/80 font-medium">
                  Languages
                </div>
              </div>
              
              <div className="text-center p-6 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 hover:border-[#C9A962]/40 transition-colors duration-200">
                <div className="text-3xl sm:text-4xl font-bold text-[#C9A962] mb-2">
                  {(stats.totalWords / 1000000).toFixed(1)}M
                </div>
                <div className="text-[#F5F3EF]/80 font-medium">
                  Words
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] mb-4">
              Features
            </h2>
            <p className="text-lg text-[#F5F3EF]/70 max-w-2xl mx-auto">
              Powerful tools for classical scholarship and research
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-[#C9A962]/5 rounded-xl border border-[#C9A962]/10 hover:border-[#C9A962]/30 transition-all duration-200">
              <div className="w-16 h-16 bg-[#C9A962]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#C9A962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#F5F3EF] mb-4">Advanced Search</h3>
              <p className="text-[#F5F3EF]/70">
                Search through texts with powerful filters for author, genre, time period, and language
              </p>
            </div>
            
            <div className="text-center p-8 bg-[#C9A962]/5 rounded-xl border border-[#C9A962]/10 hover:border-[#C9A962]/30 transition-all duration-200">
              <div className="w-16 h-16 bg-[#C9A962]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#C9A962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#F5F3EF] mb-4">Scholarly Editions</h3>
              <p className="text-[#F5F3EF]/70">
                Access critical editions with apparatus, commentaries, and scholarly annotations
              </p>
            </div>
            
            <div className="text-center p-8 bg-[#C9A962]/5 rounded-xl border border-[#C9A962]/10 hover:border-[#C9A962]/30 transition-all duration-200">
              <div className="w-16 h-16 bg-[#C9A962]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#C9A962]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>