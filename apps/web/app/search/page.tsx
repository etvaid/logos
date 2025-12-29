'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  text: string;
  author: string;
  work: string;
  language: 'greek' | 'latin';
  book?: number;
  chapter?: number;
  line?: number;
  similarity?: number;
  context?: string;
  snippet: string;
}

interface SearchResponse {
  query: string;
  mode: 'text' | 'semantic' | 'phrase';
  results: SearchResult[];
  totalResults: number;
  processingTime: number;
  filters?: {
    language?: string;
    author?: string;
    period?: string;
    genre?: string;
  };
}

interface FilterOptions {
  languages: string[];
  authors: string[];
  periods: string[];
  genres: string[];
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'text' | 'semantic' | 'phrase'>('text');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    language: '',
    author: '',
    period: '',
    genre: ''
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/search/filters');
      if (!response.ok) throw new Error('Failed to fetch filter options');
      const data: FilterOptions = await response.json();
      setFilterOptions(data);
    } catch (err) {
      console.error('Failed to fetch filter options:', err);
      setFilterOptions({
        languages: ['Greek', 'Latin'],
        authors: ['Homer', 'Virgil', 'Cicero', 'Plato', 'Aristotle', 'Caesar', 'Ovid', 'Horace'],
        periods: ['Archaic', 'Classical', 'Hellenistic', 'Roman', 'Late Antiquity'],
        genres: ['Epic', 'Lyric', 'Drama', 'Philosophy', 'History', 'Oratory', 'Novel']
      });
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const performSearch = useCallback(async (searchQuery: string, mode: 'text' | 'semantic' | 'phrase', filters?: any) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = mode === 'semantic' ? '/search/semantic' : '/search/text';
      const requestBody = {
        query: searchQuery.trim(),
        mode: mode,
        ...filters
      };
      
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      const data: SearchResponse = await response.json();
      setResults(data);
      setSearchHistory(prev => [searchQuery, ...prev.filter(q => q !== searchQuery)].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query, searchMode, activeFilters);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    const params = new URLSearchParams({
      author: result.author,
      work: result.work,
      ...(result.book && { book: result.book.toString() }),
      ...(result.chapter && { chapter: result.chapter.toString() }),
      ...(result.line && { line: result.line.toString() })
    });
    router.push(`/reader?${params.toString()}`);
  };

  const handleFilterChange = (filterType: keyof typeof activeFilters, value: string) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);
    if (query && results) {
      performSearch(query, searchMode, newFilters);
    }
  };

  const clearFilters = () => {
    setActiveFilters({ language: '', author: '', period: '', genre: '' });
    if (query && results) {
      performSearch(query, searchMode, {});
    }
  };

  const getLanguageColor = (language: 'greek' | 'latin') => {
    return language === 'greek' ? 'text-[#5BA4E8]' : 'text-[#E85B5B]';
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return 'text-green-400';
    if (similarity >= 0.6) return 'text-[#C9A962]';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 bg-[#0D0D0F]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/reader" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Reader</Link>
                <Link href="/semantia" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">SEMANTIA</Link>
                <Link href="/translate" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Translate</Link>
                <Link href="/search" className="text-[#C9A962] font-semibold">Search</Link>
                <Link href="/learn" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Learn</Link>
                <Link href="/discovery" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Discovery</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#C9A962] mb-4 font-serif">Search</h1>
          <p className="text-lg text-[#F5F3EF]/70 max-w-2xl mx-auto">Discover passages, authors, and concepts across the classical corpus</p>
        </div>

        <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6 mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-[#0D0D0F]/50 rounded-lg border border-[#C9A962]/20 p-1">
              {(['text', 'semantic', 'phrase'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSearchMode(mode)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all capitalize ${
                    searchMode === mode
                      ? 'bg-[#C9A962] text-[#0D0D0F]'
                      : 'text-[#F5F3EF]/70 hover:text-[#F5F3EF] hover:bg-[#C9A962]/10'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search for ${searchMode === 'semantic' ? 'concepts and meanings' : searchMode === 'phrase' ? 'exact phrases' : 'words and passages'}...`}
                className="w-full px-6 py-4 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg text-[#F5F3EF] placeholder-[#F5F3EF]/50 focus:outline-none focus:border-[#C9A962]/40 font-serif text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 py-4 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-4 border border-[#C9A962]/20 hover:border-[#C9A962]/40 rounded-lg text-[#C9A962] hover:bg-[#C9A962]/10 transition-all font-semibold"
            >
              Filters {showFilters ? '▼' : '▶'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-[#0D0D0F]/30 rounded-lg border border-[#C9A962]/10">
            <p className="text-[#F5F3EF]/70 text-sm">
              {searchMode === 'text' && 'Search for specific words and terms across all texts'}
              {searchMode === 'semantic' && 'Find conceptually related passages using AI-powered semantic search'}
              {searchMode === 'phrase' && 'Search for exact phrases and quotations'}
            </p>
          </div>

          {searchHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#C9A962]/20">
              <p className="text-[#F5F3EF]/70 text-sm mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => { setQuery(term); performSearch(term, searchMode, activeFilters); }}
                    className="px-3 py-1 bg-[#C9A962]/10 border border-[#C9A962]/20 rounded text-[#F5F3EF]/70 hover:text-[#F5F3EF] hover:bg-[#C9A962]/20 transition-all text-sm font-serif"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {showFilters && (
            <div className="w-80 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6 h-fit">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-[#C9A962]">Filters</h3>
                <button onClick={clearFilters} className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] text-sm transition-colors">
                  Clear All
                </button>
              </div>

              {filterOptions && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#F5F3EF]/70 text-sm mb-2">Language</label>
                    <select
                      value={activeFilters.language}
                      onChange={(e) => handleFilterChange('language', e.target.value)}
                      className="w-full px-3 py-2 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]/40"
                    >
                      <option value="">All Languages</option>
                      {filterOptions.languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#F5F3EF]/70 text-sm mb-2">Author</label>
                    <select
                      value={activeFilters.author}
                      onChange={(e) => handleFilterChange('author', e.target.value)}
                      className="w-full px-3 py-2 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg text-[#F5F3EF] focus:outline