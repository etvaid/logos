'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface PeriodData {
  period: string;
  timeRange: string;
  meaningEvolution: string;
  driftScore: number;
  keyAuthors: Array<{
    author: string;
    contribution: string;
    influence: number;
  }>;
  exampleUsages: Array<{
    text: string;
    author: string;
    work: string;
    context: string;
  }>;
  semanticShift: string;
}

interface ChronosData {
  word: string;
  language: 'greek' | 'latin';
  overallDriftScore: number;
  etymology: string;
  originalMeaning: string;
  modernMeaning: string;
  periods: PeriodData[];
  totalOccurrences: number;
}

interface ComparisonData {
  word1: ChronosData;
  word2: ChronosData;
  parallelEvolution: Array<{
    period: string;
    word1Meaning: string;
    word2Meaning: string;
    convergence: number;
  }>;
  crossInfluence: string[];
}

export default function ChronosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [compareWord, setCompareWord] = useState('');
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [wordData, setWordData] = useState<ChronosData | null>(null);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const fetchWordData = useCallback(async (word: string) => {
    if (!word.trim()) return;
    setLoading(true);
    setError(null);
    setCurrentWord(word);
    
    try {
      const response = await fetch(`http://localhost:8000/chronos/${encodeURIComponent(word)}`);
      if (!response.ok) {
        throw new Error(`Word "${word}" not found in temporal corpus`);
      }
      const data: ChronosData = await response.json();
      setWordData(data);
      setSearchHistory(prev => [word, ...prev.filter(w => w !== word)].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch temporal data');
      setWordData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComparison = useCallback(async (word1: string, word2: string) => {
    if (!word1.trim() || !word2.trim()) return;
    setComparisonLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8000/chronos/compare/${encodeURIComponent(word1)}/${encodeURIComponent(word2)}`);
      if (!response.ok) throw new Error('Failed to fetch comparison data');
      const data: ComparisonData = await response.json();
      setComparison(data);
      setShowComparison(true);
    } catch (err) {
      console.error('Failed to fetch comparison:', err);
    } finally {
      setComparisonLoading(false);
    }
  }, []);

  const handleSearch = (word: string) => {
    fetchWordData(word);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleSearch(searchTerm.trim());
    }
  };

  const handleCompare = () => {
    if (currentWord && compareWord.trim()) {
      fetchComparison(currentWord, compareWord.trim());
    }
  };

  const getLanguageColor = (language: 'greek' | 'latin') => {
    return language === 'greek' ? 'text-[#5BA4E8]' : 'text-[#E85B5B]';
  };

  const getDriftColor = (score: number) => {
    if (score <= 0.3) return 'text-green-400';
    if (score <= 0.7) return 'text-[#C9A962]';
    return 'text-red-400';
  };

  const getDriftLabel = (score: number) => {
    if (score <= 0.3) return 'Stable';
    if (score <= 0.7) return 'Evolved';
    return 'Transformed';
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
                <Link href="/chronos" className="text-[#C9A962] font-semibold">CHRONOS</Link>
                <Link href="/learn" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Learn</Link>
                <Link href="/discovery" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Discovery</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#C9A962] mb-4 font-serif">CHRONOS</h1>
          <p className="text-lg text-[#F5F3EF]/70 max-w-2xl mx-auto">Trace the temporal evolution of words and meanings through classical antiquity</p>
        </div>

        <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter a Greek or Latin word to trace its evolution..."
                className="w-full px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg text-[#F5F3EF] placeholder-[#F5F3EF]/50 focus:outline-none focus:border-[#C9A962]/40 font-serif"
              />
            </div>
            <button type="submit" disabled={loading || !searchTerm.trim()} className="px-8 py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {loading ? 'Tracing...' : 'Trace Evolution'}
            </button>
          </form>

          {wordData && (
            <div className="pt-4 border-t border-[#C9A962]/20">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-[#F5F3EF]/70 text-sm mb-2">Compare with another word:</label>
                  <input
                    type="text"
                    value={compareWord}
                    onChange={(e) => setCompareWord(e.target.value)}
                    placeholder="Enter second word for comparison..."
                    className="w-full px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg text-[#F5F3EF] placeholder-[#F5F3EF]/50 focus:outline-none focus:border-[#C9A962]/40 font-serif"
                  />
                </div>
                <button onClick={handleCompare} disabled={comparisonLoading || !compareWord.trim()} className="px-6 py-3 border border-[#C9A962]/20 hover:border-[#C9A962]/40 rounded-lg text-[#C9A962] hover:bg-[#C9A962]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold">
                  {comparisonLoading ? 'Comparing...' : 'Compare'}
                </button>
              </div>
            </div>
          )}
          
          {searchHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#C9A962]/20">
              <p className="text-[#F5F3EF]/70 text-sm mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((word, index) => (
                  <button key={index} onClick={() => { setSearchTerm(word); handleSearch(word); }} className="px-3 py-1 bg-[#C9A962]/10 border border-[#C9A962]/20 rounded text-[#F5F3EF]/70 hover:text-[#F5F3EF] hover:bg-[#C9A962]/20 transition-all text-sm font-serif">
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-[#E85B5B]/10 border border-[#E85B5B]/20 rounded-lg p-4 mb-8">
            <p className="text-[#E85B5B]">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-2 border-[#C9A962]/20 border-t-[#C9A962] rounded-full mx-auto mb-4"></div>
            <p className="text-[#F5F3EF]/70">Analyzing temporal evolution...</p>
          </div>
        )}

        {comparison && showComparison && (
          <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#C9A962]">Temporal Comparison</h2>
              <button onClick={() => setShowComparison(false)} className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">✕</button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <h3 className={`text-2xl font-bold font-serif ${getLanguageColor(comparison.word1.language)}`}>{comparison.word1.word}</h3>
                <div className={`text-lg font-semibold ${getDriftColor(comparison.word1.overallDriftScore)} mb-2`}>Drift Score: {comparison.word1.overallDriftScore.toFixed(2)} ({getDriftLabel(comparison.word1.overallDriftScore)})</div>
              </div>
              <div className="text-center">
                <h3 className={`text-2xl font-bold font-serif ${getLanguageColor(comparison.word2.language)}`}>{comparison.word2.word}</h3>
                <div className={`text-lg font-semibold ${getDriftColor(comparison.word2.overallDriftScore)} mb-2`}>Drift Score: {comparison.word2.overallDriftScore.toFixed(2)} ({getDriftLabel(comparison.word2.overallDriftScore)})</div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#C9A962] mb-4">Parallel Evolution</h4>
              {comparison.parallelEvolution.map((period, index) => (
                <div key={index} className="bg-[#0D0D0F]/50 rounded-lg p-4 border border-[#C9A962]/10">
                  <div className="text-[#C9A962] font-semibold mb-2">{period.period}</div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="font-serif">
                      <span className={getLanguageColor(comparison.word1.language)}>{comparison.word1.word}:</span> {period.word1Meaning}
                    </div>
                    <div className="font-serif">
                      <span className={getLanguageColor(comparison.word2.language)}>{comparison.word2.word}:</span