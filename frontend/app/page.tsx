'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Button, Input, LoadingSpinner, Badge } from '@/components/ui';
import { AnimatedCounter, DonutChart, BarChart, Timeline } from '@/components/charts';
import { getStats, search } from '@/lib/api';
import type { CorpusStats, SearchResult } from '@/lib/types';

// Language distribution data
const languageDistribution = [
  { name: 'Greek', value: 4200000, color: '#87CEEB' },
  { name: 'Latin', value: 2100000, color: '#DDA0DD' },
  { name: 'Hebrew', value: 250000, color: '#98D8C8' },
  { name: 'Aramaic', value: 100000, color: '#F7DC6F' },
  { name: 'Coptic', value: 35000, color: '#F1948A' },
  { name: 'Syriac', value: 12130, color: '#BB8FCE' },
];

// Top authors by passage count
const topAuthors = [
  { name: 'Homer', value: 27000, color: '#87CEEB' },
  { name: 'Plato', value: 21500, color: '#87CEEB' },
  { name: 'Aristotle', value: 19800, color: '#87CEEB' },
  { name: 'Cicero', value: 18200, color: '#DDA0DD' },
  { name: 'Virgil', value: 15600, color: '#DDA0DD' },
  { name: 'Xenophon', value: 14300, color: '#87CEEB' },
  { name: 'Plutarch', value: 13500, color: '#87CEEB' },
  { name: 'Livy', value: 12800, color: '#DDA0DD' },
];

// Historical timeline events
const timelineEvents = [
  { id: '1', year: -850, title: 'Homer', description: 'Iliad & Odyssey composed', type: 'author' as const },
  { id: '2', year: -700, title: 'Hesiod', description: 'Theogony, Works and Days', type: 'author' as const },
  { id: '3', year: -525, title: 'Aeschylus', description: 'Birth of Greek tragedy', type: 'author' as const },
  { id: '4', year: -469, title: 'Socrates', description: 'Philosophical revolution begins', type: 'author' as const },
  { id: '5', year: -428, title: 'Plato', description: 'Founder of the Academy', type: 'author' as const },
  { id: '6', year: -384, title: 'Aristotle', description: 'The Philosopher', type: 'author' as const },
  { id: '7', year: -106, title: 'Cicero', description: 'Master of Latin prose', type: 'author' as const },
  { id: '8', year: -70, title: 'Virgil', description: 'Rome\'s epic poet', type: 'author' as const },
  { id: '9', year: -43, title: 'Ovid', description: 'Metamorphoses', type: 'author' as const },
  { id: '10', year: 56, title: 'Tacitus', description: 'Rome\'s greatest historian', type: 'author' as const },
  { id: '11', year: 354, title: 'Augustine', description: 'City of God, Confessions', type: 'author' as const },
  { id: '12', year: 480, title: 'Boethius', description: 'Consolation of Philosophy', type: 'author' as const },
];

// Feature modules with enhanced descriptions
const features = [
  {
    name: 'Library',
    href: '/library',
    icon: '📚',
    desc: 'Browse the complete corpus with tree navigation',
    stats: '74,927 authors',
    color: 'from-blue-500/20'
  },
  {
    name: 'Reader',
    href: '/reader',
    icon: '📖',
    desc: 'Three-panel reading with analysis',
    stats: 'Side-by-side translation',
    color: 'from-green-500/20'
  },
  {
    name: 'Translate',
    href: '/translate',
    icon: '🌐',
    desc: 'AI-powered with 38 persona styles',
    stats: 'LTQI quality scoring',
    color: 'from-purple-500/20'
  },
  {
    name: 'SEMANTIA',
    href: '/semantia',
    icon: '💡',
    desc: 'Semantic drift over 2,400 years',
    stats: 'Word evolution tracking',
    color: 'from-yellow-500/20'
  },
  {
    name: 'CHRONOS',
    href: '/chronos',
    icon: '⏳',
    desc: 'Interactive D3 timeline',
    stats: '850 BCE - 600 CE',
    color: 'from-red-500/20'
  },
  {
    name: 'Connectome',
    href: '/connectome',
    icon: '🕸️',
    desc: 'Force-directed influence graph',
    stats: 'Network visualization',
    color: 'from-cyan-500/20'
  },
  {
    name: 'Learn',
    href: '/learn',
    icon: '🎓',
    desc: '64 Greek & Latin modules',
    stats: 'XP-based progression',
    color: 'from-orange-500/20'
  },
  {
    name: 'Analysis',
    href: '/analysis',
    icon: '🔬',
    desc: 'Morphology, syntax, scansion',
    stats: 'Stylometric fingerprinting',
    color: 'from-pink-500/20'
  },
];

// Featured quotes from the corpus
const featuredQuotes = [
  {
    text: 'μῆνιν ἄειδε θεά, Πηληϊάδεω Ἀχιλῆος',
    translation: 'Sing, O goddess, the anger of Achilles son of Peleus',
    author: 'Homer',
    work: 'Iliad 1.1'
  },
  {
    text: 'Arma virumque cano, Troiae qui primus ab oris',
    translation: 'I sing of arms and the man, who first from the shores of Troy',
    author: 'Virgil',
    work: 'Aeneid 1.1'
  },
  {
    text: 'γνῶθι σεαυτόν',
    translation: 'Know thyself',
    author: 'Delphic Oracle',
    work: 'Inscribed at Apollo\'s Temple'
  },
];

export default function HomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<CorpusStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % featuredQuotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const data = await search(searchQuery, { limit: 5 });
      setSearchResults(data.results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const goToFullSearch = () => {
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const quote = featuredQuotes[currentQuote];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A962]/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C9A962]/10 via-transparent to-transparent" />

        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#C9A962]/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-[#C9A962] drop-shadow-lg">LOGOS</span>
            </h1>
            <p className="text-xl sm:text-2xl text-[#F5F3EF]/70 mb-4">
              The Complete Classical Research Platform
            </p>
            <p className="text-lg text-[#F5F3EF]/50 max-w-2xl mx-auto mb-20">
              Read, translate, and analyze Greek, Latin, and ancient texts
              with AI-powered tools built for scholars and learners
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-20">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 6.7 million passages..."
                    className="text-lg py-4 pl-12"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                  />
                </div>
                <Button type="submit" size="lg" loading={searching}>
                  Search
                </Button>
              </div>
            </form>

            {/* Quick search results */}
            {searchResults.length > 0 && (
              <div className="max-w-3xl mx-auto mb-12">
                <Card padding="sm">
                  <div className="text-left">
                    {searchResults.slice(0, 3).map((r, i) => (
                      <div key={i} className="py-3 border-b border-[#C9A962]/10 last:border-0">
                        <div className="text-sm text-[#C9A962]">
                          {r.author} — {r.work}
                        </div>
                        <p className="text-sm text-[#F5F3EF]/70 line-clamp-2 font-serif">
                          {r.passage}
                        </p>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={goToFullSearch} className="w-full mt-2">
                      View all results →
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Animated Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <Card variant="hover" className="text-center py-6">
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <AnimatedCounter
                    value={stats?.passages || 6697130}
                    className="text-3xl sm:text-4xl font-bold text-[#C9A962]"
                  />
                )}
                <div className="text-sm text-[#F5F3EF]/50 mt-2">Passages</div>
              </Card>
              <Card variant="hover" className="text-center py-6">
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <AnimatedCounter
                    value={stats?.authors || 74927}
                    className="text-3xl sm:text-4xl font-bold text-[#C9A962]"
                  />
                )}
                <div className="text-sm text-[#F5F3EF]/50 mt-2">Authors</div>
              </Card>
              <Card variant="hover" className="text-center py-6">
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <AnimatedCounter
                    value={6}
                    className="text-3xl sm:text-4xl font-bold text-[#C9A962]"
                  />
                )}
                <div className="text-sm text-[#F5F3EF]/50 mt-2">Languages</div>
              </Card>
              <Card variant="hover" className="text-center py-6">
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <AnimatedCounter
                    value={2400}
                    className="text-3xl sm:text-4xl font-bold text-[#C9A962]"
                  />
                )}
                <div className="text-sm text-[#F5F3EF]/50 mt-2">Years Covered</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Quote */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-transparent to-[#C9A962]/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="transition-all duration-500">
            <p className="text-xl sm:text-2xl font-serif text-[#87CEEB] mb-4 italic leading-relaxed">
              "{quote.text}"
            </p>
            <p className="text-base sm:text-lg text-[#F5F3EF]/70 mb-4 leading-relaxed">
              "{quote.translation}"
            </p>
            <p className="text-sm text-[#C9A962]">
              — {quote.author}, <span className="text-[#F5F3EF]/50">{quote.work}</span>
            </p>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {featuredQuotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuote(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentQuote ? 'bg-[#C9A962] w-6' : 'bg-[#C9A962]/30'
                }`}
                aria-label={`Go to quote ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            <span className="text-[#C9A962]">Corpus</span> Overview
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Language Distribution */}
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-[#C9A962] mb-6 text-center">
                Language Distribution
              </h3>
              <DonutChart
                data={languageDistribution}
                showLegend
                centerText="6.7M"
                centerSubtext="passages"
              />
            </Card>

            {/* Top Authors */}
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-[#C9A962] mb-6 text-center">
                Top Authors by Passage Count
              </h3>
              <div className="h-64">
                <BarChart
                  data={topAuthors}
                  horizontal
                  maxBars={8}
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Historical Timeline */}
      <section className="py-20 lg:py-24 bg-[#C9A962]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            <span className="text-[#C9A962]">Historical</span> Timeline
          </h2>
          <p className="text-center text-[#F5F3EF]/50 mb-8">
            2,400 years of classical literature
          </p>

          <Timeline events={timelineEvents} />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            <span className="text-[#C9A962]">Explore</span> the Platform
          </h2>
          <p className="text-center text-[#F5F3EF]/50 mb-8">
            Eight powerful modules for classical research
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link key={feature.name} href={feature.href}>
                <Card
                  variant="interactive"
                  className={`h-full bg-gradient-to-br ${feature.color} to-transparent group`}
                >
                  <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-[#C9A962] mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-[#F5F3EF]/60 mb-3">{feature.desc}</p>
                  <Badge size="sm" variant="default">{feature.stats}</Badge>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            <span className="text-[#C9A962]">Six</span> Ancient Languages
          </h2>
          <p className="text-[#F5F3EF]/50 mb-8">
            From Homer to the Dead Sea Scrolls
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {languageDistribution.map((lang) => (
              <Link
                key={lang.name}
                href={`/library?language=${lang.name.toLowerCase()}`}
              >
                <Card variant="interactive" className="text-center py-8">
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: lang.color }}
                  >
                    <AnimatedCounter value={lang.value} duration={1500} />
                  </div>
                  <div className="font-medium text-[#F5F3EF] mb-1">{lang.name}</div>
                  <div className="text-xs text-[#F5F3EF]/40">passages</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Features */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-[#C9A962]/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            <span className="text-[#C9A962]">Unique</span> Capabilities
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card padding="lg" className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C9A962]/20 flex items-center justify-center">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-[#C9A962] mb-3">
                LTQI Scoring
              </h3>
              <p className="text-sm text-[#F5F3EF]/60 leading-relaxed">
                Loeb Translation Quality Index measures translations across 5 dimensions:
                literalness, poeticness, formality, accessibility, and scholarly precision.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C9A962]/20 flex items-center justify-center">
                <span className="text-3xl">🧬</span>
              </div>
              <h3 className="text-lg font-semibold text-[#C9A962] mb-3">
                Style Vector Arithmetic
              </h3>
              <p className="text-sm text-[#F5F3EF]/60 leading-relaxed">
                Blend translator personas: "70% Fagles + 30% Lattimore" creates
                translations that are dramatic yet faithful.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C9A962]/20 flex items-center justify-center">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-[#C9A962] mb-3">
                Stylometric Fingerprinting
              </h3>
              <p className="text-sm text-[#F5F3EF]/60 leading-relaxed">
                50+ linguistic features per author create unique fingerprints
                for authorship attribution and literary analysis.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C9A962]/20 flex items-center justify-center">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-[#C9A962] mb-3">
                Semantic Drift
              </h3>
              <p className="text-sm text-[#F5F3EF]/60 leading-relaxed">
                Track how word meanings evolved across 2,400 years.
                See "ἀρετή" shift from "excellence" to "virtue."
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C9A962]/20 flex items-center justify-center">
                <span className="text-3xl">🕸️</span>
              </div>
              <h3 className="text-lg font-semibold text-[#C9A962] mb-3">
                Intertextuality Network
              </h3>
              <p className="text-sm text-[#F5F3EF]/60 leading-relaxed">
                Force-directed graphs reveal how authors influenced each other
                across centuries of literary tradition.
              </p>
            </Card>

            <Card padding="lg" className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C9A962]/20 flex items-center justify-center">
                <span className="text-3xl">👻</span>
              </div>
              <h3 className="text-lg font-semibold text-[#C9A962] mb-3">
                Lost Works Reconstruction
              </h3>
              <p className="text-sm text-[#F5F3EF]/60 leading-relaxed">
                AI-assisted reconstruction of fragmentary texts using
                quotations, citations, and stylometric analysis.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Start Your Journey
          </h2>
          <p className="text-lg text-[#F5F3EF]/70 mb-8 leading-relaxed">
            Whether you're a student, scholar, or curious reader,
            LOGOS has the tools you need to explore the ancient world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/library">
              <Button size="lg">Browse Library</Button>
            </Link>
            <Link href="/translate">
              <Button variant="secondary" size="lg">Try Translation</Button>
            </Link>
            <Link href="/learn">
              <Button variant="ghost" size="lg">Start Learning</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
