'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface WordData {
  word: string;
  definition: string;
  usagePercentage: number;
  totalOccurrences: number;
  language: 'greek' | 'latin';
  lemma: string;
  pos: string;
  authorUsage: Array<{
    author: string;
    occurrences: number;
    percentage: number;
  }>;
  eraUsage: Array<{
    era: string;
    period: string;
    occurrences: number;
    percentage: number;
  }>;
  lsjDefinition?: string;
}

interface SemanticNeighbor {
  word: string;
  similarity: number;
  language: 'greek' | 'latin';
  definition: string;
  usageCount: number;
}

interface SemanticNeighborsData {
  word: string;
  neighbors: SemanticNeighbor[];
}

export default function SemantiaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [neighbors, setNeighbors] = useState<SemanticNeighborsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [neighborsLoading, setNeighborsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLSJComparison, setShowLSJComparison] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const fetchWordData = useCallback(async (word: string) => {
    if (!word.trim()) return;
    setLoading(true);
    setError(null);
    setCurrentWord(word);
    
    try {
      const response = await fetch(`http://localhost:8000/semantia/${encodeURIComponent(word)}`);
      if (!response.ok) {
        throw new Error(`Word "${word}" not found in corpus`);
      }
      const data: WordData = await response.json();
      setWordData(data);
      setSearchHistory(prev => [word, ...prev.filter(w => w !== word)].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch word data');
      setWordData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNeighbors = useCallback(async (word: string) => {
    setNeighborsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/semantia/${encodeURIComponent(word)}/neighbors`);
      if (!response.ok) throw new Error('Failed to fetch semantic neighbors');
      const data: SemanticNeighborsData = await response.json();
      setNeighbors(data);
    } catch (err) {
      console.error('Failed to fetch neighbors:', err);
    } finally {
      setNeighborsLoading(false);
    }
  }, []);

  const handleSearch = (word: string) => {
    fetchWordData(word);
    fetchNeighbors(word);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleSearch(searchTerm.trim());
    }
  };

  const getLanguageColor = (language: 'greek' | 'latin') => {
    return language === 'greek' ? 'text-[#5BA4E8]' : 'text-[#E85B5B]';
  };

  const getMaxAuthorUsage = () => {
    if (!wordData?.authorUsage) return 0;
    return Math.max(...wordData.authorUsage.map(a => a.occurrences));
  };

  const getMaxEraUsage = () => {
    if (!wordData?.eraUsage) return 0;
    return Math.max(...wordData.eraUsage.map(e => e.occurrences));
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
                <Link href="/semantia" className="text-[#C9A962] font-semibold">SEMANTIA</Link>
                <Link href="/translate" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Translate</Link>
                <Link href="/learn" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Learn</Link>
                <Link href="/discovery" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Discovery</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#C9A962] mb-4 font-serif">SEMANTIA</h1>
          <p className="text-lg text-[#F5F3EF]/70 max-w-2xl mx-auto">Explore semantic relationships and conceptual networks in ancient texts through corpus-derived analysis</p>
        </div>

        <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter a Greek or Latin word..."
                className="w-full px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg text-[#F5F3EF] placeholder-[#F5F3EF]/50 focus:outline-none focus:border-[#C9A962]/40 font-serif"
              />
            </div>
            <button type="submit" disabled={loading || !searchTerm.trim()} className="px-8 py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          
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
            <p className="text-[#F5F3EF]/70">Analyzing semantic data...</p>
          </div>
        )}

        {wordData && currentWord && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className={`text-3xl font-bold font-serif ${getLanguageColor(wordData.language)}`}>{wordData.word}</h2>
                    <p className="text-[#F5F3EF]/70 mt-1">{wordData.lemma} • {wordData.pos} • {wordData.language.charAt(0).toUpperCase() + wordData.language.slice(1)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#C9A962]">{wordData.usagePercentage.toFixed(3)}%</div>
                    <p className="text-[#F5F3EF]/70 text-sm">corpus usage</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#C9A962] mb-2">Corpus-Derived Definition</h3>
                  <p className="text-[#F5F3EF] leading-relaxed font-serif">{wordData.definition}</p>
                  <p className="text-[#F5F3EF]/70 text-sm mt-2">Based on {wordData.totalOccurrences.toLocaleString()} occurrences in the corpus</p>
                </div>

                <button onClick={() => setShowLSJComparison(!showLSJComparison)} className="px-6 py-3 border border-[#C9A962]/20 hover:border-[#C9A962]/40 rounded-lg text-[#C9A962] hover:bg-[#C9A962]/10 transition-all font-semibold">
                  {showLSJComparison ? 'Hide' : 'Challenge'} LSJ Comparison
                </button>

                {showLSJComparison && (
                  <div className="mt-6 p-4 bg-[#0D0D0F]/50 rounded-lg border border-[#C9A962]/10">
                    <h4 className="text-md font-semibold text-[#C9A962] mb-2">LSJ Dictionary Definition</h4>
                    {wordData.lsjDefinition ? (
                      <div>
                        <p className="text-[#F5F3EF]/90 font-serif mb-4">{wordData.lsjDefinition}</p>
                        <div className="border-t border-[#C9A962]/20 pt-4">
                          <h5 className="text-sm font-semibold text-[#C9A962] mb-2">Key Differences:</h5>
                          <ul className="text-[#F5F3EF]/70 text-sm space-y-1">
                            <li>• Corpus definition reflects actual usage patterns</li>
                            <li>• LSJ provides comprehensive etymological context</li>
                            <li>• Semantic analysis reveals contextual meaning shifts</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[#F5F3EF]/70 italic">LSJ definition not available for this word</p>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#C9A962] mb-4">Usage by Author</h3>
                {wordData.authorUsage.length > 0 ? (
                  <div className="space-y-3">
                    {wordData.authorUsage.slice(0, 10).map((author, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex-1 mr-4">
                          <div className="text-[#F5F3EF] text-sm font-medium">{author.author}</div>
                          <div className="text-[#F5F3EF]/70 text-xs">{author.occurrences} occurrences ({author.percentage.toFixed(1)}%)</div>
                        </div>
                        <div className="flex-1 max-w-40">
                          <div className="w-full bg-[#0D0D0F] rounded-full h-2">
                            <div className="bg-[#C9A962] h-2 rounded-full transition-all" style={{ width: `${(author.occurrences / getMaxAuthorUsage()) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (