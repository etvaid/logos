'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Work {
  id: string;
  title: string;
  author: string;
  authorId: string;
  language: 'greek' | 'latin';
  genre: string;
  date: number;
  estimatedDate: string;
  wordCount: number;
  popularity: number;
  description: string;
  hasTranslation: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  books?: number;
  chapters?: number;
  lines?: number;
  cover?: string;
}

interface FilterOptions {
  authors: Array<{ id: string; name: string; }>;
  languages: string[];
  genres: string[];
  periods: string[];
}

export default function WorksPage() {
  const router = useRouter();
  const [works, setWorks] = useState<Work[]>([]);
  const [filteredWorks, setFilteredWorks] = useState<Work[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    author: '',
    language: '',
    genre: '',
    period: ''
  });
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'date' | 'popularity'>('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);

  const fetchWorks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/reader/works');
      if (!response.ok) {
        throw new Error('Failed to fetch works');
      }
      const data = await response.json();
      setWorks(data.works || []);
      setFilterOptions({
        authors: data.authors || [],
        languages: data.languages || ['Greek', 'Latin'],
        genres: data.genres || ['Epic', 'Lyric', 'Drama', 'Philosophy', 'History', 'Oratory'],
        periods: data.periods || ['Archaic', 'Classical', 'Hellenistic', 'Roman', 'Late Antiquity']
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load works');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const applyFiltersAndSort = useCallback(() => {
    let result = [...works];

    if (searchTerm) {
      result = result.filter(work => 
        work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.author) {
      result = result.filter(work => work.authorId === filters.author);
    }
    if (filters.language) {
      result = result.filter(work => work.language === filters.language.toLowerCase());
    }
    if (filters.genre) {
      result = result.filter(work => work.genre === filters.genre);
    }
    if (filters.period) {
      const periodRanges: { [key: string]: [number, number] } = {
        'Archaic': [-800, -480],
        'Classical': [-480, -323],
        'Hellenistic': [-323, -146],
        'Roman': [-146, 476],
        'Late Antiquity': [476, 800]
      };
      const range = periodRanges[filters.period];
      if (range) {
        result = result.filter(work => work.date >= range[0] && work.date <= range[1]);
      }
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'date':
          comparison = a.date - b.date;
          break;
        case 'popularity':
          comparison = a.popularity - b.popularity;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredWorks(result);
  }, [works, searchTerm, filters, sortBy, sortOrder]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({ author: '', language: '', genre: '', period: '' });
    setSearchTerm('');
  };

  const handleStartReading = (work: Work) => {
    const params = new URLSearchParams({
      author: work.author,
      work: work.title,
      workId: work.id
    });
    router.push(`/reader?${params.toString()}`);
  };

  const getLanguageColor = (language: 'greek' | 'latin') => {
    return language === 'greek' ? 'text-[#5BA4E8]' : 'text-[#E85B5B]';
  };

  const getDifficultyColor = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-[#C9A962]';
      case 'advanced': return 'text-red-400';
    }
  };

  const formatWordCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (date: number) => {
    if (date < 0) return `${Math.abs(date)} BCE`;
    return `${date} CE`;
  };

  const getPopularityStars = (popularity: number) => {
    const stars = Math.round(popularity * 5);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
        <nav className="border-b border-[#C9A962]/20 bg-[#0D0D0F]/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
                <div className="hidden md:flex space-x-6">
                  <Link href="/reader" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Reader</Link>
                  <Link href="/works" className="text-[#C9A962] font-semibold">Works</Link>
                  <Link href="/authors" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Authors</Link>
                  <Link href="/semantia" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">SEMANTIA</Link>
                  <Link href="/translate" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Translate</Link>
                  <Link href="/learn" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Learn</Link>
                  <Link href="/discovery" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Discovery</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-2 border-[#C9A962]/20 border-t-[#C9A962] rounded-full mx-auto mb-4"></div>
            <p className="text-[#F5F3EF]/70">Loading works catalog...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E85B5B] mb-4">Error: {error}</p>
          <button 
            onClick={fetchWorks}
            className="px-4 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/90 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 bg-[#0D0D0F]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/reader" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Reader</Link>
                <Link href="/works" className="text-[#C9A962] font-semibold">Works</Link>
                <Link href="/authors" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Authors</Link>
                <Link href="/semantia" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">SEMANTIA</Link>
                <Link href="/translate" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Translate</Link>
                <Link href="/learn" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Learn</Link>
                <Link href="/discovery" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Discovery</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#C9A962] mb-4 font-serif">Works</h1>
          <p className="text-lg text-[#F5F3EF]/70 max-w-2xl mx-auto">Explore the complete catalog of classical texts in the LOGOS corpus</p>
        </div>

        <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-[#C9A962] mb-1">{works.length}</div>
              <div className="text-[#F5F3EF]/70 text-sm">Total Works</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#5BA4E8] mb-1">{works.filter(w => w.language === 'greek').length}</div>
              <div className="text-[#F5F3EF]/70 text-sm">Greek Texts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#E85B5B] mb-1">{works.filter(w => w.language === 'latin').length}</div>
              <div className="text-[#F5F3EF]/70 text-sm">Latin Texts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#C9A962] mb-1">{filteredWorks.length}</div>
              <div className="text-[#F5F3EF]/70 text-sm">Results</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6 mb-8