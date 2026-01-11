'use client';

import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card, Button, Badge, LoadingSpinner, Tabs } from '@/components/ui';
import { getAuthors, getWorksByAuthor, getPassages, getInstantTranslation } from '@/lib/api';
import { detectLanguage, detectPassageLanguage, formatNumber } from '@/lib/utils';
import type { Author, Work, Passage } from '@/lib/types';

// Language configuration with display info
const LANGUAGES = [
  { key: 'greek', label: 'Greek', badge: 'greek', icon: 'Α' },
  { key: 'latin', label: 'Latin', badge: 'latin', icon: 'L' },
  { key: 'hebrew', label: 'Hebrew', badge: 'hebrew', icon: 'א' },
  { key: 'aramaic', label: 'Aramaic', badge: 'aramaic', icon: 'ܐ' },
  { key: 'coptic', label: 'Coptic', badge: 'coptic', icon: 'Ⲁ' },
  { key: 'english', label: 'Translations', badge: 'success', icon: '📖' },
] as const;

// Simple cache for API responses (reduces redundant network calls)
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedData(key: string) {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  apiCache.set(key, { data, timestamp: Date.now() });
}

// Main page export with Suspense boundary for useSearchParams
export default function ReaderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <ReaderContent />
    </Suspense>
  );
}

function ReaderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Core state
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('lang') || 'greek');
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(searchParams.get('author'));
  const [selectedWork, setSelectedWork] = useState<string | null>(searchParams.get('work'));

  const [works, setWorks] = useState<Work[]>([]);
  const [passages, setPassages] = useState<Passage[]>([]);

  // Translation state (instant translation per passage)
  const [passageTranslations, setPassageTranslations] = useState<Record<string, string | null>>({});
  const [translatingPassage, setTranslatingPassage] = useState<string | null>(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingWorks, setLoadingWorks] = useState(false);
  const [loadingPassages, setLoadingPassages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Display options
  const [fontSize, setFontSize] = useState(18);
  const [authorSearch, setAuthorSearch] = useState('');
  const [showCitations, setShowCitations] = useState(true);
  const [lineSpacing, setLineSpacing] = useState<'compact' | 'normal' | 'relaxed'>('normal');

  // Virtual scrolling setup
  const parentRef = useRef<HTMLDivElement>(null);
  const [allPassagesLoaded, setAllPassagesLoaded] = useState(false);

  // Load authors for selected language (optimized - only load what's needed)
  useEffect(() => {
    const cacheKey = `authors:${selectedLanguage}`;
    const cached = getCachedData(cacheKey);

    if (cached) {
      setAllAuthors(cached.authors || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    getAuthors(selectedLanguage)
      .then((data) => {
        setCachedData(cacheKey, data);
        setAllAuthors(data.authors || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load authors:', err);
        setLoading(false);
      });
  }, [selectedLanguage]);

  // Filter authors by search term (client-side for instant feedback)
  const filteredAuthors = useMemo(() => {
    if (!authorSearch.trim()) return allAuthors;
    const searchLower = authorSearch.toLowerCase();
    return allAuthors.filter(a =>
      a.author.toLowerCase().includes(searchLower)
    );
  }, [allAuthors, authorSearch]);

  // Load works when author selected
  useEffect(() => {
    if (!selectedAuthor) {
      setWorks([]);
      return;
    }

    const cacheKey = `works:${selectedAuthor}:${selectedLanguage}`;
    const cached = getCachedData(cacheKey);

    if (cached) {
      setWorks(cached.works || []);
      setPassages([]);
      setLoadingWorks(false);
      return;
    }

    setLoadingWorks(true);
    setWorks([]);
    setPassages([]);

    getWorksByAuthor(selectedAuthor, selectedLanguage)
      .then((data) => {
        setCachedData(cacheKey, data);
        setWorks(data.works || []);
      })
      .catch(console.error)
      .finally(() => setLoadingWorks(false));
  }, [selectedAuthor, selectedLanguage]);

  // Track total passages and loading strategy
  const [totalPassages, setTotalPassages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Load passages when work selected - FAST LOADING (no translations)
  useEffect(() => {
    if (!selectedAuthor || !selectedWork) {
      setPassages([]);
      setTotalPassages(0);
      return;
    }

    setLoadingPassages(true);
    setPassages([]);
    setTotalPassages(0);
    setAllPassagesLoaded(false);

    // Initial fetch: Get first 100 passages + total count
    getPassages(selectedAuthor, selectedWork, 100, 0, selectedLanguage)
      .then(async (data) => {
        const total = data.total || 0;
        setTotalPassages(total);

        console.log('[Reader] Work loaded:', {
          work: selectedWork,
          totalPassages: total,
          strategy: total < 1000 ? 'LOAD_ALL' : 'PROGRESSIVE',
          initialLoaded: data.passages?.length || 0
        });

        if (!data.passages || data.passages.length === 0) {
          console.warn('[Reader] No passages returned from API');
          setPassages([]);
          setError(null);
          setLoadingPassages(false);
          return;
        }

        // SMART LOADING STRATEGY
        if (total <= 1000) {
          // Small work: Load ALL passages at once for best UX
          console.log('[Reader] Loading complete work (≤1000 passages)...');
          try {
            const completeData = await getPassages(selectedAuthor, selectedWork, total, 0, selectedLanguage);
            // Filter passages to match requested language (filters out mislabeled translations)
            const filteredPassages = (completeData.passages || []).filter(p => {
              const detectedLang = detectPassageLanguage(p.content);
              // Match exact language OR allow 'english' for 'latin' requests (translations)
              return detectedLang === selectedLanguage ||
                     (selectedLanguage === 'latin' && detectedLang === 'latin') ||
                     detectedLang === 'unknown';
            });
            setPassages(filteredPassages);
            console.log(`[Reader] ✓ Loaded complete work: ${completeData.passages?.length} passages (${filteredPassages.length} match language filter)`);
          } catch (err) {
            console.error('[Reader] Failed to load complete work:', err);
            // Fallback to initial 100 passages with filtering
            const filteredFallback = (data.passages || []).filter(p => {
              const detectedLang = detectPassageLanguage(p.content);
              return detectedLang === selectedLanguage ||
                     (selectedLanguage === 'latin' && detectedLang === 'latin') ||
                     detectedLang === 'unknown';
            });
            setPassages(filteredFallback);
          }
        } else {
          // Large work (>1000): Load progressively with filtering
          console.log('[Reader] Large work detected. Loading first 100 passages...');
          const filteredProgressive = (data.passages || []).filter(p => {
            const detectedLang = detectPassageLanguage(p.content);
            return detectedLang === selectedLanguage ||
                   (selectedLanguage === 'latin' && detectedLang === 'latin') ||
                   detectedLang === 'unknown';
          });
          setPassages(filteredProgressive);
          console.log(`[Reader] ✓ Loaded ${data.passages?.length} passages (${filteredProgressive.length} match language filter)`);
        }

        setError(null);
      })
      .catch((err) => {
        console.error('[Reader] Failed to load passages:', err);
        setError(err.message || 'Failed to load passages');
      })
      .finally(() => setLoadingPassages(false));
  }, [selectedAuthor, selectedWork, selectedLanguage]);

  // Handle language tab change
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setSelectedAuthor(null);
    setSelectedWork(null);
    setWorks([]);
    setPassages([]);
    router.push(`/reader?lang=${lang}`);
  };

  // Handle author selection
  const handleAuthorClick = (authorName: string, isWork?: boolean) => {
    setSelectedAuthor(authorName);

    // If this is actually a work (Hebrew/Aramaic/Coptic), load passages directly
    if (isWork) {
      setSelectedWork('__DIRECT__');
      setWorks([]);
      router.push(`/reader?lang=${selectedLanguage}&author=${encodeURIComponent(authorName)}&work=__DIRECT__`);
    } else {
      setSelectedWork(null);
      router.push(`/reader?lang=${selectedLanguage}&author=${encodeURIComponent(authorName)}`);
    }
  };

  // Handle work selection
  const handleWorkClick = (work: string) => {
    setSelectedWork(work);
    router.push(`/reader?lang=${selectedLanguage}&author=${encodeURIComponent(selectedAuthor!)}&work=${encodeURIComponent(work)}`);
  };

  // Virtual scrolling setup
  const virtualizer = useVirtualizer({
    count: passages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,  // Estimated passage height in pixels
    overscan: 10,  // Render 10 extra items above/below viewport for smooth scrolling
  });

  // Use total from API if available, otherwise fall back to loaded passages count
  const displayTotal = totalPassages > 0 ? totalPassages : passages.length;

  // Progressive loading - load more passages when scrolling near the end
  useEffect(() => {
    if (!selectedWork || allPassagesLoaded || loadingMore) return;

    const virtualItems = virtualizer.getVirtualItems();
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;

    // Load more when approaching end (within last 20 items)
    if (lastItem.index >= passages.length - 20 && passages.length < totalPassages) {
      const loadMore = async () => {
        setLoadingMore(true);
        try {
          const nextOffset = passages.length;
          const nextLimit = Math.min(500, totalPassages - passages.length);

          const data = await getPassages(selectedAuthor!, selectedWork!, nextLimit, nextOffset, selectedLanguage);
          setPassages(prev => [...prev, ...(data.passages || [])]);

          if (passages.length + (data.passages?.length || 0) >= totalPassages) {
            setAllPassagesLoaded(true);
          }
        } catch (err) {
          console.error('Failed to load more passages:', err);
        } finally {
          setLoadingMore(false);
        }
      };

      loadMore();
    }
  }, [virtualizer.getVirtualItems(), passages.length, totalPassages, selectedWork, allPassagesLoaded, loadingMore, selectedAuthor, selectedLanguage]);

  // Handle instant translation for a passage
  const handleTranslatePassage = async (passage: Passage) => {
    if (!passage.urn) {
      alert('This passage does not have a URN and cannot be translated instantly.');
      return;
    }

    const passageId = passage.id || passage.urn;

    // If already translated, toggle visibility
    if (passageTranslations[passageId]) {
      setPassageTranslations(prev => {
        const newTranslations = { ...prev };
        delete newTranslations[passageId];
        return newTranslations;
      });
      return;
    }

    // Fetch instant translation
    setTranslatingPassage(passageId);
    try {
      const result = await getInstantTranslation(passage.urn);
      if (result && result.translation) {
        setPassageTranslations(prev => ({
          ...prev,
          [passageId]: result.translation
        }));
      } else {
        alert('No instant translation available. Try the AI translation page.');
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please try again.');
    } finally {
      setTranslatingPassage(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-12 md:py-16 border-b border-[#C9A962]/20">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-[#C9A962]">READER</span>
          </h1>
          <p className="text-[#F5F3EF]/70">
            Browse 6.7M passages across all classical languages
          </p>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="border-b border-[#C9A962]/20 bg-[#0D0D0F]/50 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3 overflow-x-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.key}
                onClick={() => handleLanguageChange(lang.key)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition whitespace-nowrap ${
                  selectedLanguage === lang.key
                    ? 'bg-[#C9A962] text-[#0D0D0F]'
                    : 'bg-[#C9A962]/10 text-[#F5F3EF]/70 hover:bg-[#C9A962]/20'
                }`}
              >
                <span className="mr-2">{lang.icon}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Authors & Works */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              {/* Authors List */}
              <Card padding="sm">
                <div className="sticky top-24">
                  <h3 className="text-sm font-semibold text-[#C9A962] mb-3 px-3 py-2 border-b border-[#C9A962]/20">
                    Authors ({filteredAuthors.length})
                  </h3>
                  {/* Search Box */}
                  <div className="px-3 mb-3">
                    <input
                      type="text"
                      placeholder="Search authors..."
                      value={authorSearch}
                      onChange={(e) => setAuthorSearch(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#1A1410] border border-[#C9A962]/30 rounded text-[#F5F3EF] placeholder-[#F5F3EF]/40 focus:outline-none focus:border-[#C9A962]"
                    />
                  </div>
                  <div className="space-y-1 max-h-[calc(100vh-380px)] overflow-y-auto">
                    {filteredAuthors.map((author) => (
                      <button
                        key={author.author}
                        onClick={() => handleAuthorClick(author.author, author.is_work)}
                        className={`w-full text-left px-3 py-2 text-sm rounded transition ${
                          selectedAuthor === author.author
                            ? 'bg-[#C9A962]/20 text-[#C9A962]'
                            : 'hover:bg-[#C9A962]/10 text-[#F5F3EF]/80'
                        }`}
                      >
                        <div className="font-medium">{author.author}</div>
                        <div className="text-xs text-[#F5F3EF]/50">
                          {author.is_work
                            ? `${formatNumber(author.passage_count)} verses`
                            : `${author.work_count ? `${author.work_count} works · ` : ''}${formatNumber(author.passage_count)} passages`
                          }
                        </div>
                      </button>
                    ))}
                    {filteredAuthors.length === 0 && (
                      <p className="text-sm text-[#F5F3EF]/50 px-3 py-4">
                        No authors found for {selectedLanguage}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Works List */}
              {selectedAuthor && (
                <Card padding="sm">
                  <h3 className="text-sm font-semibold text-[#C9A962] mb-3 px-3 py-2 border-b border-[#C9A962]/20">
                    Works by {selectedAuthor}
                  </h3>
                  {loadingWorks ? (
                    <div className="flex justify-center py-6">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-[400px] overflow-y-auto">
                      {works.map((work) => (
                        <button
                          key={work.title}
                          onClick={() => handleWorkClick(work.title)}
                          className={`w-full text-left px-3 py-2 text-sm rounded transition ${
                            selectedWork === work.title
                              ? 'bg-[#C9A962]/20 text-[#C9A962]'
                              : 'hover:bg-[#C9A962]/10 text-[#F5F3EF]/80'
                          }`}
                        >
                          <div className="font-medium">{work.title}</div>
                          <div className="text-xs text-[#F5F3EF]/50">
                            {formatNumber(work.passage_count)} passages
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Main Content - Text Display */}
            <div className="col-span-12 lg:col-span-9">
              {!selectedWork ? (
                <Card padding="lg" className="text-center py-16">
                  <div className="text-6xl mb-4 font-serif text-[#C9A962]">L</div>
                  <h2 className="text-2xl text-[#C9A962] mb-2">Welcome to the Reader</h2>
                  <p className="text-[#F5F3EF]/70 max-w-xl mx-auto">
                    Select a language tab above, then choose an author and work to begin reading.
                    All texts are displayed in their original language with optional translations.
                  </p>
                  <div className="mt-6 text-sm text-[#F5F3EF]/50">
                    Currently viewing: <Badge variant={(LANGUAGES.find(l => l.key === selectedLanguage)?.badge || 'default') as any}>
                      {LANGUAGES.find(l => l.key === selectedLanguage)?.label || selectedLanguage}
                    </Badge>
                  </div>
                </Card>
              ) : loadingPassages ? (
                <div className="flex items-center justify-center py-16">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Error Display */}
                  {error && (
                    <Card padding="md" className="border-red-500/50 bg-red-500/5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                          <h3 className="text-red-400 font-medium">Error Loading Passages</h3>
                          <p className="text-sm text-[#F5F3EF]/70 mt-1">{error}</p>
                        </div>
                      </div>
                    </Card>
                  )}
                  {/* Text Header */}
                  <Card padding="md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-serif text-[#C9A962]">{selectedAuthor}</h2>
                        <p className="text-[#F5F3EF]/70">{selectedWork}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={(LANGUAGES.find(l => l.key === selectedLanguage)?.badge || 'default') as any}>
                            {LANGUAGES.find(l => l.key === selectedLanguage)?.label || selectedLanguage}
                          </Badge>
                          <Badge variant="ghost">
                            {totalPassages > 0 ? (
                              <>
                                {formatNumber(totalPassages)} passages
                                {passages.length < totalPassages && ` (${formatNumber(passages.length)} loaded)`}
                              </>
                            ) : (
                              `${formatNumber(passages.length)} passages`
                            )}
                          </Badge>
                          {loadingMore && (
                            <Badge variant="ghost">
                              Loading more...
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {/* Font Size Controls */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                        >
                          A-
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                        >
                          A+
                        </Button>

                        {/* Line Spacing */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const modes: Array<typeof lineSpacing> = ['compact', 'normal', 'relaxed'];
                            const current = modes.indexOf(lineSpacing);
                            setLineSpacing(modes[(current + 1) % modes.length]);
                          }}
                          title={`Line spacing: ${lineSpacing}`}
                        >
                          ≡
                        </Button>

                        {/* Citations Toggle */}
                        <Button
                          size="sm"
                          variant={showCitations ? 'default' : 'ghost'}
                          onClick={() => setShowCitations(!showCitations)}
                          title="Show/hide citations"
                        >
                          #
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Text Content - Enhanced with Infinite Scroll */}
                  <Card padding="lg" className="h-fit">
                      <div className="mb-4 pb-3 border-b border-[#C9A962]/20">
                        <h3 className="text-sm font-semibold text-[#C9A962]">Original Text</h3>
                        <p className="text-xs text-[#F5F3EF]/50 mt-1">
                          Showing {passages.length.toLocaleString()} of {displayTotal.toLocaleString()} passages
                        </p>
                      </div>
                      {passages.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4 font-serif text-[#C9A962]/50">∅</div>
                          <h3 className="text-xl text-[#C9A962] mb-2">No Passages Found</h3>
                          <p className="text-[#F5F3EF]/70 mb-4">
                            No text content available for this work.
                          </p>
                          <Button
                            variant="secondary"
                            className="mt-4"
                            onClick={() => {
                              setSelectedWork(null);
                              setPassages([]);
                            }}
                          >
                            ← Back to Works
                          </Button>
                        </div>
                      ) : (
                        <div
                          ref={parentRef}
                          className="h-[calc(100vh-400px)] overflow-auto"
                          style={{ contain: 'strict' }}
                        >
                          <div
                            style={{
                              height: `${virtualizer.getTotalSize()}px`,
                              width: '100%',
                              position: 'relative',
                            }}
                          >
                            {virtualizer.getVirtualItems().map((virtualRow) => {
                              const passage = passages[virtualRow.index];
                              const passageKey = passage.id || passage.urn || `${virtualRow.index}`;
                              return (
                                <div
                                  key={virtualRow.key}
                                  data-index={virtualRow.index}
                                  ref={virtualizer.measureElement}
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualRow.start}px)`,
                                  }}
                                  className="group hover:bg-[#C9A962]/5 p-3 rounded transition"
                                >
                                  <div className="flex gap-4">
                                    {showCitations && (
                                      <span className="text-[#C9A962]/50 text-sm font-mono shrink-0 w-12 pt-1">
                                        {virtualRow.index + 1}
                                      </span>
                                    )}
                                    <div className="flex-1" dir={['hebrew', 'aramaic'].includes(selectedLanguage) ? 'rtl' : 'ltr'}>
                                      <div className="flex items-start gap-2">
                                        <p
                                          className={`flex-1 text-[#F5F3EF] ${
                                            lineSpacing === 'compact' ? 'leading-normal' :
                                            lineSpacing === 'relaxed' ? 'leading-loose' :
                                            'leading-relaxed'
                                          } ${
                                            selectedLanguage === 'greek' ? 'font-greek' :
                                            selectedLanguage === 'hebrew' ? 'font-hebrew' :
                                            selectedLanguage === 'aramaic' ? 'font-aramaic' :
                                            selectedLanguage === 'coptic' ? 'font-coptic' :
                                            'font-serif'
                                          }`}
                                          style={{ fontSize: `${fontSize}px` }}
                                        >
                                          {passage.content}
                                        </p>
                                        {passage.urn && (
                                          <button
                                            onClick={() => handleTranslatePassage(passage)}
                                            disabled={translatingPassage === passageKey}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1.5 hover:bg-[#C9A962]/20 rounded text-[#C9A962] disabled:opacity-50"
                                            title="Translate passage"
                                          >
                                            {translatingPassage === passageKey ? (
                                              <span className="text-xs">...</span>
                                            ) : passageTranslations[passageKey] ? (
                                              <span className="text-base">✓</span>
                                            ) : (
                                              <span className="text-base">🌐</span>
                                            )}
                                          </button>
                                        )}
                                      </div>
                                      {passageTranslations[passageKey] && (
                                        <div className="mt-3 pt-3 border-t border-[#C9A962]/20">
                                          <p className="text-sm text-[#F5F3EF]/80 italic leading-relaxed">
                                            {passageTranslations[passageKey]}
                                          </p>
                                        </div>
                                      )}
                                      {showCitations && passage.section && (
                                        <p className="text-xs text-[#C9A962]/60 mt-2 font-mono">{passage.section}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {loadingMore && (
                            <div className="flex justify-center py-4">
                              <LoadingSpinner size="sm" />
                              <span className="ml-2 text-sm text-[#C9A962]">Loading more passages...</span>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
