'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, Button, Input, Select, LoadingSpinner, Badge, Tabs } from '@/components/ui';
import { TreeView } from '@/components/library';
import { AnimatedCounter, DonutChart, BarChart } from '@/components/charts';
import { getAuthors, getWorksByAuthor } from '@/lib/api';
import { formatNumber, getLanguageColor } from '@/lib/utils';
import type { Author, Work } from '@/lib/types';

// Period definitions
const PERIODS = [
  { id: 'archaic', label: 'Archaic', range: '800-480 BCE', start: -800, end: -480, color: '#FF6B6B' },
  { id: 'classical', label: 'Classical', range: '480-323 BCE', start: -480, end: -323, color: '#4ECDC4' },
  { id: 'hellenistic', label: 'Hellenistic', range: '323-31 BCE', start: -323, end: -31, color: '#45B7D1' },
  { id: 'roman', label: 'Roman', range: '31 BCE-200 CE', start: -31, end: 200, color: '#DDA0DD' },
  { id: 'late', label: 'Late Antiquity', range: '200-600 CE', start: 200, end: 600, color: '#98D8C8' },
];

// Language stats
const languageStats = [
  { name: 'Greek', value: 4200000, color: '#87CEEB', authors: 45000 },
  { name: 'Latin', value: 2100000, color: '#DDA0DD', authors: 25000 },
  { name: 'Hebrew', value: 250000, color: '#98D8C8', authors: 2500 },
  { name: 'Aramaic', value: 100000, color: '#F7DC6F', authors: 1200 },
  { name: 'Coptic', value: 35000, color: '#F1948A', authors: 800 },
  { name: 'Syriac', value: 12130, color: '#BB8FCE', authors: 427 },
];

interface TreeNode {
  id: string;
  name: string;
  type: 'language' | 'period' | 'author' | 'work' | 'book';
  count?: number;
  language?: string;
  children?: TreeNode[];
  href?: string;
}

type ViewMode = 'tree' | 'alphabetical' | 'period';

export default function LibraryPage() {
  const searchParams = useSearchParams();
  const initialLanguage = searchParams.get('language') || '';

  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('tree');

  // Tree state
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [worksCache, setWorksCache] = useState<Record<string, Work[]>>({});

  // Fetch authors on mount
  useEffect(() => {
    getAuthors()
      .then((data) => setAuthors(data.authors || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter authors
  const filteredAuthors = useMemo(() => {
    return authors.filter((author) => {
      const matchesSearch = !searchQuery ||
        author.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLanguage = !selectedLanguage ||
        author.language?.toLowerCase() === selectedLanguage.toLowerCase();
      return matchesSearch && matchesLanguage;
    });
  }, [authors, searchQuery, selectedLanguage]);

  // Build tree by language
  const treeByLanguage = useMemo((): TreeNode[] => {
    const langGroups: Record<string, Author[]> = {};

    filteredAuthors.forEach((author) => {
      const lang = author.language || 'Unknown';
      if (!langGroups[lang]) langGroups[lang] = [];
      langGroups[lang].push(author);
    });

    return Object.entries(langGroups)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([lang, authorsInLang]) => ({
        id: `lang-${lang}`,
        name: lang.charAt(0).toUpperCase() + lang.slice(1),
        type: 'language' as const,
        language: lang,
        count: authorsInLang.reduce((sum, a) => sum + (a.passage_count || 0), 0),
        children: authorsInLang
          .sort((a, b) => (b.passage_count || 0) - (a.passage_count || 0))
          .slice(0, 100) // Show top 100 per language
          .map((author) => ({
            id: `author-${author.author}`,
            name: author.author,
            type: 'author' as const,
            language: author.language,
            count: author.passage_count,
            children: worksCache[author.author]?.map((work) => ({
              id: `work-${author.author}-${work.work}`,
              name: work.work || 'Untitled',
              type: 'work' as const,
              count: work.passage_count,
              href: `/reader?author=${encodeURIComponent(author.author)}&work=${encodeURIComponent(work.work || '')}`,
            })),
          })),
      }));
  }, [filteredAuthors, worksCache]);

  // Group authors by first letter
  const groupedByLetter = useMemo(() => {
    const groups: Record<string, Author[]> = {};
    filteredAuthors.forEach((author) => {
      const letter = author.author.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(author);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredAuthors]);

  // Handle tree expand
  const handleExpand = async (nodeId: string) => {
    // Toggle expansion
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
      setExpandedNodes(newExpanded);
      return;
    }

    // Load works if this is an author node
    if (nodeId.startsWith('author-')) {
      const authorName = nodeId.replace('author-', '');
      if (!worksCache[authorName]) {
        setLoadingNodes(new Set([...loadingNodes, nodeId]));
        try {
          const data = await getWorksByAuthor(authorName);
          setWorksCache((prev) => ({ ...prev, [authorName]: data.works || [] }));
        } catch (err) {
          console.error('Failed to load works:', err);
        } finally {
          setLoadingNodes((prev) => {
            const next = new Set(prev);
            next.delete(nodeId);
            return next;
          });
        }
      }
    }

    newExpanded.add(nodeId);
    setExpandedNodes(newExpanded);
  };

  // Language options for filter
  const languageOptions = [
    { value: '', label: 'All Languages' },
    ...languageStats.map((l) => ({ value: l.name.toLowerCase(), label: l.name })),
  ];

  // Period tabs
  const periodTabs = [
    { id: 'all', label: 'All Periods' },
    ...PERIODS.map((p) => ({ id: p.id, label: p.label })),
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-[#C9A962]">Library</span>
              </h1>
              <p className="text-[#F5F3EF]/70">
                Browse the complete classical corpus
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A962]">
                  <AnimatedCounter value={74927} duration={1500} />
                </div>
                <div className="text-xs text-[#F5F3EF]/50">Authors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#87CEEB]">
                  <AnimatedCounter value={6697130} duration={1500} />
                </div>
                <div className="text-xs text-[#F5F3EF]/50">Passages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#DDA0DD]">
                  <AnimatedCounter value={6} duration={1000} />
                </div>
                <div className="text-xs text-[#F5F3EF]/50">Languages</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 shrink-0 space-y-6">
            {/* Search & Filters */}
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-[#C9A962] mb-4">Filters</h2>

              <div className="space-y-4">
                {/* Search */}
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search authors..."
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />

                {/* Language */}
                <Select
                  label="Language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  options={languageOptions}
                />

                {/* View mode */}
                <div>
                  <label className="text-sm text-[#F5F3EF]/50 mb-2 block">View Mode</label>
                  <div className="flex gap-2">
                    {(['tree', 'alphabetical'] as ViewMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`flex-1 py-2 px-3 text-sm rounded-lg transition ${
                          viewMode === mode
                            ? 'bg-[#C9A962] text-[#0D0D0F]'
                            : 'bg-[#C9A962]/10 hover:bg-[#C9A962]/20'
                        }`}
                      >
                        {mode === 'tree' ? '🌳 Tree' : '🔤 A-Z'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear filters */}
                {(searchQuery || selectedLanguage) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLanguage('');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* Filter stats */}
              <div className="mt-4 pt-4 border-t border-[#C9A962]/20 text-sm text-[#F5F3EF]/50">
                {formatNumber(filteredAuthors.length)} of {formatNumber(authors.length)} authors
              </div>
            </Card>

            {/* Language Distribution */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-4">By Language</h3>
              <div className="h-48">
                <DonutChart
                  data={languageStats}
                  size={160}
                  showLegend={false}
                />
              </div>
              <div className="mt-4 space-y-2">
                {languageStats.map((lang) => (
                  <button
                    key={lang.name}
                    onClick={() => setSelectedLanguage(lang.name.toLowerCase())}
                    className={`w-full flex items-center gap-2 py-1.5 px-2 rounded text-sm hover:bg-[#C9A962]/10 transition ${
                      selectedLanguage === lang.name.toLowerCase() ? 'bg-[#C9A962]/20' : ''
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="flex-1 text-left">{lang.name}</span>
                    <span className="text-[#F5F3EF]/40">{formatNumber(lang.authors)}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredAuthors.length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl text-[#C9A962] mb-2">No authors found</h3>
                <p className="text-[#F5F3EF]/50">
                  Try adjusting your filters or search query
                </p>
              </Card>
            ) : viewMode === 'tree' ? (
              /* Tree View */
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#C9A962]">
                    Browse by Language
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedNodes(new Set())}
                  >
                    Collapse All
                  </Button>
                </div>
                <TreeView
                  nodes={treeByLanguage}
                  expandedNodes={expandedNodes}
                  loading={loadingNodes}
                  selectedNodeId={selectedNodeId || undefined}
                  onExpand={handleExpand}
                  onNodeSelect={(node) => setSelectedNodeId(node.id)}
                />
              </Card>
            ) : (
              /* Alphabetical View */
              <div className="space-y-6">
                {/* Alphabet navigation */}
                <Card padding="sm">
                  <div className="flex flex-wrap gap-1.5">
                    {groupedByLetter.map(([letter]) => (
                      <a
                        key={letter}
                        href={`#letter-${letter}`}
                        className="w-8 h-8 flex items-center justify-center text-sm font-medium bg-[#C9A962]/10 hover:bg-[#C9A962]/20 rounded transition"
                      >
                        {letter}
                      </a>
                    ))}
                  </div>
                </Card>

                {/* Authors by letter */}
                {groupedByLetter.map(([letter, authorsInGroup]) => (
                  <div key={letter} id={`letter-${letter}`}>
                    <h2 className="text-2xl font-bold text-[#C9A962] mb-4 sticky top-20 bg-[#0D0D0F] py-2 z-10">
                      {letter}
                      <span className="text-sm font-normal text-[#F5F3EF]/40 ml-2">
                        {authorsInGroup.length} authors
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {authorsInGroup.map((author) => (
                        <Link
                          key={author.author}
                          href={`/reader?author=${encodeURIComponent(author.author)}`}
                        >
                          <Card variant="interactive" padding="sm" className="h-full">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-1.5 h-12 rounded-full"
                                style={{ backgroundColor: getLanguageColor(author.language) }}
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-[#F5F3EF] truncate">
                                  {author.author}
                                </h3>
                                <p className="text-sm text-[#F5F3EF]/50">
                                  {formatNumber(author.passage_count)} passages
                                </p>
                              </div>
                              <Badge
                                size="sm"
                                variant={
                                  author.language === 'greek'
                                    ? 'greek'
                                    : author.language === 'latin'
                                    ? 'latin'
                                    : 'default'
                                }
                              >
                                {author.language}
                              </Badge>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
