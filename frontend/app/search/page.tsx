'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, Button, Input, Select, LoadingSpinner, Badge } from '@/components/ui';
import { search } from '@/lib/api';
import { formatNumber, highlightSearchTerm, getLanguageName } from '@/lib/utils';
import type { SearchResult, SearchResponse } from '@/lib/types';

// Main page export with Suspense boundary for useSearchParams
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [language, setLanguage] = useState('');
  const [author, setAuthor] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Search on initial load if query exists
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  // Re-search when filters or pagination change
  useEffect(() => {
    if (query && results) {
      performSearch(query);
    }
  }, [language, author, sortBy, page]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * pageSize;
      const data = await search(searchQuery, {
        language: language || undefined,
        author: author || undefined,
        limit: pageSize,
        offset: offset,
        sortBy: sortBy,
      });
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
    performSearch(query);
    setPage(1);
  };

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setLanguage('');
    setAuthor('');
    router.push('/search');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#C9A962]">Search</span>
          </h1>
          <p className="text-[#F5F3EF]/70">
            Full-text search across 6.7 million passages
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for words, phrases, or concepts..."
              className="text-lg py-4"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <Button type="submit" size="lg" loading={loading}>
              Search
            </Button>
          </div>
        </form>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Select
            label="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={[
              { value: '', label: 'All Languages' },
              { value: 'greek', label: 'Greek' },
              { value: 'latin', label: 'Latin' },
              { value: 'hebrew', label: 'Hebrew' },
            ]}
          />
          <Input
            label="Author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Filter by author..."
          />
          <Select
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'relevance', label: 'Relevance' },
              { value: 'author', label: 'Author' },
              { value: 'work', label: 'Work' },
            ]}
          />
          <div className="flex items-end">
            {(language || author) && (
              <Button variant="ghost" onClick={handleClear} className="w-full">
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-8 border-red-500/20">
            <p className="text-red-400">{error}</p>
          </Card>
        )}

        {/* Results */}
        {results && (
          <div>
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  Found <span className="text-[#C9A962]">{formatNumber(results.total || results.count)}</span> results
                </h2>
                <p className="text-sm text-[#F5F3EF]/50">
                  for "{results.query}"
                </p>
              </div>
            </div>

            {/* Results list */}
            {results.results.length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-5xl mb-4 font-serif text-[#C9A962]/50">∅</div>
                <h3 className="text-xl text-[#C9A962] mb-2">No results found</h3>
                <p className="text-[#F5F3EF]/50">
                  Try different keywords or remove some filters
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {results.results.map((result, i) => (
                  <SearchResultCard key={i} result={result} query={query} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {results.results.length > 0 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-[#F5F3EF]/50">
                  Page {page}
                </span>
                <Button
                  variant="secondary"
                  disabled={results.results.length < pageSize}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!results && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 font-serif text-[#C9A962]">S</div>
            <h2 className="text-2xl text-[#C9A962] mb-2">Full-Text Search</h2>
            <p className="text-[#F5F3EF]/50 max-w-xl mx-auto mb-8">
              Search through the complete LOGOS corpus including Homer, Plato, Aristotle,
              Virgil, Cicero, and thousands of other ancient authors.
            </p>

            {/* Sample searches */}
            <div className="flex flex-wrap justify-center gap-3">
              {['μῆνιν', 'arma virumque', 'logos', 'amor', 'virtue'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    performSearch(term);
                  }}
                  className="px-4 py-2 bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-full text-sm hover:bg-[#C9A962]/20 transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchResultCard({ result, query }: { result: SearchResult; query: string }) {
  return (
    <Card variant="hover" className="group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <Link
            href={`/reader?author=${encodeURIComponent(result.author)}&work=${encodeURIComponent(result.work)}`}
            className="font-semibold text-[#C9A962] hover:underline"
          >
            {result.author}
          </Link>
          <span className="text-[#F5F3EF]/50 mx-2">—</span>
          <span className="text-[#F5F3EF]/70">{result.work}</span>
        </div>
        {result.language && (
          <Badge
            variant={
              result.language.toLowerCase() === 'greek'
                ? 'greek'
                : result.language.toLowerCase() === 'latin'
                ? 'latin'
                : 'default'
            }
          >
            {getLanguageName(result.language)}
          </Badge>
        )}
      </div>

      <p
        className="font-serif text-[#F5F3EF]/90 leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: highlightSearchTerm(result.passage, query),
        }}
      />

      {result.reference && (
        <p className="mt-3 text-sm text-[#F5F3EF]/50">{result.reference}</p>
      )}

      <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition">
        <Link href={`/reader?author=${encodeURIComponent(result.author)}&work=${encodeURIComponent(result.work)}`}>
          <Button variant="ghost" size="sm">
            Read in Context
          </Button>
        </Link>
        <Link href={`/translate?text=${encodeURIComponent(result.passage.slice(0, 200))}`}>
          <Button variant="ghost" size="sm">
            Translate
          </Button>
        </Link>
      </div>
    </Card>
  );
}
