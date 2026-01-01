'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, Button, Select, LoadingSpinner, Badge, Modal, Tabs } from '@/components/ui';
import { RadarChart, BarChart } from '@/components/charts';
import { getAuthors, getWorksByAuthor, getPassages, search, translate } from '@/lib/api';
import { cleanWord, detectLanguage, formatNumber } from '@/lib/utils';
import type { Author, Work, Passage, SearchResult } from '@/lib/types';

// Morphological categories for display
const MORPHOLOGY_TAGS: Record<string, { label: string; color: string }> = {
  noun: { label: 'Noun', color: '#87CEEB' },
  verb: { label: 'Verb', color: '#98D8C8' },
  adj: { label: 'Adjective', color: '#DDA0DD' },
  adv: { label: 'Adverb', color: '#F7DC6F' },
  prep: { label: 'Preposition', color: '#F1948A' },
  conj: { label: 'Conjunction', color: '#BB8FCE' },
  part: { label: 'Particle', color: '#85C1E9' },
  art: { label: 'Article', color: '#A3E4D7' },
  pron: { label: 'Pronoun', color: '#F9E79F' },
  num: { label: 'Numeral', color: '#D7BDE2' },
};

// Mock morphological analysis (would come from API)
function analyzeMorphology(word: string) {
  // Simulated analysis
  const analyses = [
    {
      lemma: word.toLowerCase(),
      pos: 'noun',
      case: 'nominative',
      number: 'singular',
      gender: 'masculine',
      translation: 'word',
      frequency: Math.floor(Math.random() * 1000) + 100,
      firstAttested: 'Homer, Iliad',
    },
  ];
  return analyses;
}

export default function ReaderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialAuthor = searchParams.get('author') || '';
  const initialWork = searchParams.get('work') || '';

  // State
  const [authors, setAuthors] = useState<Author[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [passages, setPassages] = useState<Passage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingWorks, setLoadingWorks] = useState(false);
  const [loadingPassages, setLoadingPassages] = useState(false);

  const [selectedAuthor, setSelectedAuthor] = useState(initialAuthor);
  const [selectedWork, setSelectedWork] = useState(initialWork);
  const [searchFilter, setSearchFilter] = useState('');

  // Word analysis
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordOccurrences, setWordOccurrences] = useState<SearchResult[]>([]);
  const [loadingWord, setLoadingWord] = useState(false);
  const [morphAnalysis, setMorphAnalysis] = useState<ReturnType<typeof analyzeMorphology>>([]);

  // Display options
  const [fontSize, setFontSize] = useState(18);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [viewMode, setViewMode] = useState<'original' | 'translation' | 'side-by-side'>('original');

  // Panel states
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [analysisTab, setAnalysisTab] = useState<'morphology' | 'occurrences' | 'related'>('morphology');

  // Translation
  const [translation, setTranslation] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('literal');

  // Bookmarks
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);

  // Fetch authors on mount
  useEffect(() => {
    getAuthors()
      .then((data) => {
        setAuthors(data.authors || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  // Load works when author changes
  useEffect(() => {
    if (!selectedAuthor) return;

    setLoadingWorks(true);
    setWorks([]);
    setPassages([]);

    getWorksByAuthor(selectedAuthor)
      .then((data) => setWorks(data.works || []))
      .catch(console.error)
      .finally(() => setLoadingWorks(false));
  }, [selectedAuthor]);

  // Load passages when work changes
  useEffect(() => {
    if (!selectedAuthor || !selectedWork) return;

    setLoadingPassages(true);
    setPassages([]);

    getPassages(selectedAuthor, selectedWork, 200)
      .then((data) => setPassages(data.passages || []))
      .catch(console.error)
      .finally(() => setLoadingPassages(false));
  }, [selectedAuthor, selectedWork]);

  // Handle word click
  const handleWordClick = useCallback(async (word: string) => {
    const cleaned = cleanWord(word);
    if (!cleaned || cleaned.length < 2) return;

    setSelectedWord(cleaned);
    setRightPanelOpen(true);
    setLoadingWord(true);
    setMorphAnalysis(analyzeMorphology(cleaned));

    try {
      const data = await search(cleaned, { limit: 10 });
      setWordOccurrences(data.results || []);
    } catch (err) {
      console.error('Word search failed:', err);
    } finally {
      setLoadingWord(false);
    }
  }, []);

  // Translate current passage
  const handleTranslate = async () => {
    if (!passages.length) return;

    setTranslating(true);
    const sourceText = passages.slice(0, 5).map((p) => p.content).join(' ');
    const language = detectLanguage(sourceText);

    try {
      const result = await translate({
        source_text: sourceText.slice(0, 500),
        source_language: language === 'unknown' ? 'greek' : language,
        target_style: 'literary',
        persona: selectedPersona,
      });
      setTranslation(result.translation);
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setTranslating(false);
    }
  };

  // Filter authors
  const filteredAuthors = useMemo(() => {
    return authors.filter((a) =>
      a.author.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [authors, searchFilter]);

  // Current work stats
  const workStats = useMemo(() => {
    if (!passages.length) return null;
    const totalWords = passages.reduce((sum, p) => sum + (p.content?.split(/\s+/).length || 0), 0);
    return {
      passages: passages.length,
      words: totalWords,
      language: detectLanguage(passages[0]?.content || ''),
    };
  }, [passages]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Navigation */}
      <aside
        className={`${
          leftPanelCollapsed ? 'w-12' : 'w-72'
        } shrink-0 border-r border-[#C9A962]/20 bg-[#0D0D0F] overflow-hidden flex flex-col transition-all duration-300`}
      >
        {/* Collapse button */}
        <button
          onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
          className="p-3 border-b border-[#C9A962]/20 hover:bg-[#C9A962]/10 transition flex items-center justify-center"
        >
          <svg
            className={`w-5 h-5 text-[#C9A962] transition-transform ${leftPanelCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {!leftPanelCollapsed && (
          <>
            <div className="p-4 border-b border-[#C9A962]/20">
              <h2 className="text-lg font-semibold text-[#C9A962] mb-3">Navigation</h2>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter authors..."
                className="w-full px-3 py-2 text-sm bg-[#0D0D0F] border border-[#C9A962]/20 rounded focus:border-[#C9A962] outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredAuthors.slice(0, 100).map((author) => (
                    <button
                      key={author.author}
                      onClick={() => {
                        setSelectedAuthor(author.author);
                        setSelectedWork('');
                        router.push(`/reader?author=${encodeURIComponent(author.author)}`);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                        selectedAuthor === author.author
                          ? 'bg-[#C9A962]/20 text-[#C9A962]'
                          : 'hover:bg-[#C9A962]/10'
                      }`}
                    >
                      <div className="font-medium truncate">{author.author}</div>
                      <div className="text-xs text-[#F5F3EF]/50 flex justify-between">
                        <span>{formatNumber(author.passage_count)} passages</span>
                        <Badge size="sm" variant={author.language === 'greek' ? 'greek' : author.language === 'latin' ? 'latin' : 'default'}>
                          {author.language}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Works list */}
            {selectedAuthor && (
              <div className="border-t border-[#C9A962]/20 max-h-72 overflow-y-auto">
                <div className="p-2">
                  <h3 className="px-2 py-1 text-xs font-semibold text-[#C9A962] uppercase tracking-wider">
                    Works by {selectedAuthor}
                  </h3>
                  {loadingWorks ? (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : works.length === 0 ? (
                    <p className="px-2 text-xs text-[#F5F3EF]/50">No works found</p>
                  ) : (
                    <div className="space-y-1">
                      {works.map((work) => (
                        <button
                          key={work.work}
                          onClick={() => {
                            setSelectedWork(work.work);
                            router.push(
                              `/reader?author=${encodeURIComponent(selectedAuthor)}&work=${encodeURIComponent(work.work)}`
                            );
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                            selectedWork === work.work
                              ? 'bg-[#C9A962]/20 text-[#C9A962]'
                              : 'hover:bg-[#C9A962]/10'
                          }`}
                        >
                          <div className="truncate">{work.work || 'Untitled'}</div>
                          <div className="text-xs text-[#F5F3EF]/40">
                            {formatNumber(work.passage_count)} passages
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </aside>

      {/* Center Panel - Reading */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#C9A962]/20 bg-[#0D0D0F]">
          <div className="flex items-center gap-4">
            {selectedAuthor && selectedWork && (
              <div className="flex items-center gap-2">
                <span className="text-[#C9A962] font-medium">{selectedAuthor}</span>
                <span className="text-[#F5F3EF]/30">|</span>
                <span className="text-[#F5F3EF]/70">{selectedWork}</span>
                {workStats && (
                  <>
                    <span className="text-[#F5F3EF]/30">|</span>
                    <Badge size="sm" variant={workStats.language === 'greek' ? 'greek' : workStats.language === 'latin' ? 'latin' : 'default'}>
                      {workStats.language}
                    </Badge>
                    <span className="text-xs text-[#F5F3EF]/40">
                      {formatNumber(workStats.words)} words
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* View mode */}
            <Select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as typeof viewMode)}
              options={[
                { value: 'original', label: 'Original Text' },
                { value: 'translation', label: 'Translation Only' },
                { value: 'side-by-side', label: 'Side by Side' },
              ]}
              className="w-40"
            />

            {/* Font size */}
            <div className="flex items-center gap-1 bg-[#C9A962]/10 rounded-lg px-2">
              <button
                onClick={() => setFontSize((s) => Math.max(12, s - 2))}
                className="p-1.5 text-[#F5F3EF]/50 hover:text-[#C9A962] transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-xs text-[#F5F3EF]/50 w-8 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize((s) => Math.min(28, s + 2))}
                className="p-1.5 text-[#F5F3EF]/50 hover:text-[#C9A962] transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Persona selector */}
            <Select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              options={[
                { value: 'literal', label: 'Literal' },
                { value: 'lattimore', label: 'Lattimore' },
                { value: 'fagles', label: 'Fagles' },
                { value: 'pope', label: 'Pope' },
              ]}
              className="w-32"
            />

            {/* Translate button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleTranslate}
              loading={translating}
              disabled={!passages.length}
            >
              Translate
            </Button>

            {/* Toggle analysis panel */}
            <Button
              variant={rightPanelOpen ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
            >
              Analysis
            </Button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Text panel */}
          <div
            className={`flex-1 overflow-y-auto p-6 ${
              viewMode === 'side-by-side' ? 'grid grid-cols-2 gap-8' : ''
            }`}
          >
            {loadingPassages ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : !selectedAuthor || !selectedWork ? (
              <div className="text-center py-20 col-span-2">
                <div className="text-6xl mb-4">📖</div>
                <h2 className="text-2xl text-[#C9A962] mb-2">Select a Text</h2>
                <p className="text-[#F5F3EF]/50 max-w-md mx-auto mb-6">
                  Choose an author and work from the navigation panel to start reading.
                  Click any word for detailed morphological analysis.
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/library">
                    <Button variant="secondary">Browse Library</Button>
                  </Link>
                  <Link href="/search">
                    <Button variant="ghost">Search Texts</Button>
                  </Link>
                </div>
              </div>
            ) : passages.length === 0 ? (
              <div className="text-center py-12 col-span-2">
                <p className="text-[#F5F3EF]/50">No passages found</p>
              </div>
            ) : (
              <>
                {/* Original text */}
                {(viewMode === 'original' || viewMode === 'side-by-side') && (
                  <div className="space-y-4">
                    {viewMode === 'side-by-side' && (
                      <h3 className="text-sm font-semibold text-[#C9A962] uppercase tracking-wider pb-2 border-b border-[#C9A962]/20">
                        Original Text
                      </h3>
                    )}
                    {passages.map((passage) => (
                      <div key={passage.id} className="flex gap-4 group">
                        {showLineNumbers && (
                          <span className="text-[#C9A962]/40 text-sm font-mono w-16 shrink-0 text-right group-hover:text-[#C9A962]/60 transition">
                            {passage.section}
                          </span>
                        )}
                        <p className="flex-1 font-serif leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                          {passage.content.split(/\s+/).map((word, i) => (
                            <span
                              key={i}
                              onClick={() => handleWordClick(word)}
                              className={`cursor-pointer hover:text-[#C9A962] hover:bg-[#C9A962]/10 px-0.5 rounded transition ${
                                selectedWord === cleanWord(word)
                                  ? 'text-[#C9A962] bg-[#C9A962]/20'
                                  : ''
                              }`}
                            >
                              {word}{' '}
                            </span>
                          ))}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Translation */}
                {(viewMode === 'translation' || viewMode === 'side-by-side') && (
                  <div>
                    {viewMode === 'side-by-side' && (
                      <h3 className="text-sm font-semibold text-[#C9A962] uppercase tracking-wider pb-2 border-b border-[#C9A962]/20">
                        Translation
                      </h3>
                    )}
                    <div className="text-[#F5F3EF]/80 font-serif leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                      {translation ? (
                        <p className="mt-4">{translation}</p>
                      ) : (
                        <p className="text-[#F5F3EF]/30 italic mt-4">
                          Click "Translate" to generate an English translation with your selected persona style.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Panel - Word Analysis */}
          {rightPanelOpen && (
            <aside className="w-96 shrink-0 border-l border-[#C9A962]/20 overflow-y-auto bg-[#0D0D0F]">
              <div className="p-4 border-b border-[#C9A962]/20 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#C9A962]">
                  {selectedWord || 'Word Analysis'}
                </h3>
                <button
                  onClick={() => setRightPanelOpen(false)}
                  className="p-1 text-[#F5F3EF]/50 hover:text-[#F5F3EF] transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selectedWord ? (
                <div className="p-4">
                  {/* Tabs */}
                  <div className="flex gap-2 mb-4">
                    {(['morphology', 'occurrences', 'related'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setAnalysisTab(tab)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition ${
                          analysisTab === tab
                            ? 'bg-[#C9A962] text-[#0D0D0F]'
                            : 'bg-[#C9A962]/10 hover:bg-[#C9A962]/20'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {loadingWord ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : analysisTab === 'morphology' ? (
                    <div className="space-y-4">
                      {morphAnalysis.map((analysis, i) => (
                        <Card key={i} padding="lg">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-serif text-[#C9A962]">{analysis.lemma}</span>
                              <Badge variant={analysis.pos === 'noun' ? 'greek' : analysis.pos === 'verb' ? 'success' : 'default'}>
                                {MORPHOLOGY_TAGS[analysis.pos]?.label || analysis.pos}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-[#F5F3EF]/40">Case:</span>
                                <span className="text-[#F5F3EF] ml-2">{analysis.case}</span>
                              </div>
                              <div>
                                <span className="text-[#F5F3EF]/40">Number:</span>
                                <span className="text-[#F5F3EF] ml-2">{analysis.number}</span>
                              </div>
                              <div>
                                <span className="text-[#F5F3EF]/40">Gender:</span>
                                <span className="text-[#F5F3EF] ml-2">{analysis.gender}</span>
                              </div>
                              <div>
                                <span className="text-[#F5F3EF]/40">Frequency:</span>
                                <span className="text-[#F5F3EF] ml-2">{formatNumber(analysis.frequency)}</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-[#C9A962]/20">
                              <span className="text-[#F5F3EF]/40 text-sm">First attested:</span>
                              <p className="text-sm text-[#F5F3EF]/70">{analysis.firstAttested}</p>
                            </div>
                          </div>
                        </Card>
                      ))}

                      {/* Quick links */}
                      <div className="space-y-2">
                        <Link href={`/semantia?word=${encodeURIComponent(selectedWord)}`}>
                          <Button variant="secondary" size="sm" className="w-full">
                            Semantic Analysis
                          </Button>
                        </Link>
                        <Link href={`/search?q=${encodeURIComponent(selectedWord)}`}>
                          <Button variant="ghost" size="sm" className="w-full">
                            Search Full Corpus
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : analysisTab === 'occurrences' ? (
                    <div className="space-y-3">
                      <p className="text-sm text-[#F5F3EF]/50 mb-4">
                        Found {wordOccurrences.length} occurrences in corpus
                      </p>
                      {wordOccurrences.slice(0, 10).map((occ, i) => (
                        <Card key={i} padding="sm" variant="interactive">
                          <div className="text-xs text-[#C9A962] mb-1">
                            {occ.author} — {occ.work}
                          </div>
                          <p className="text-sm text-[#F5F3EF]/70 font-serif line-clamp-3">
                            {occ.passage}
                          </p>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-[#F5F3EF]/50">
                        Related words and semantic connections
                      </p>
                      {/* Placeholder for related words */}
                      <div className="grid grid-cols-2 gap-2">
                        {['λόγος', 'ῥῆμα', 'ἔπος', 'μῦθος'].map((word) => (
                          <button
                            key={word}
                            onClick={() => handleWordClick(word)}
                            className="p-2 text-sm bg-[#C9A962]/10 rounded hover:bg-[#C9A962]/20 transition font-serif"
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center py-12">
                  <div className="text-4xl mb-4">👆</div>
                  <p className="text-[#F5F3EF]/50">
                    Click any word in the text to see its analysis
                  </p>
                </div>
              )}
            </aside>
          )}
        </div>
      </main>

      {/* Bookmark confirmation modal */}
      <Modal
        isOpen={showBookmarkModal}
        onClose={() => setShowBookmarkModal(false)}
        title="Bookmarked!"
        size="sm"
      >
        <p className="text-[#F5F3EF]/70">
          Saved to your bookmarks. Access them from your reading history.
        </p>
      </Modal>
    </div>
  );
}
