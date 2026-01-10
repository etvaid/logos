'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card, Button, Badge, Select, Input, LoadingSpinner, Tabs } from '@/components/ui';
import { BarChart, DonutChart } from '@/components/charts';
import { formatNumber } from '@/lib/utils';

interface QPericope {
  id: string;
  title: string;
  matthewRef: string;
  lukeRef: string;
  confidence: number;
  theme: string;
  reconstructedText: string;
}

interface QComparison {
  id: string;
  title: string;
  matthewText: string;
  lukeText: string;
  reconstructedQ: string;
  agreements: string[];
  matthewRedaction: string[];
  lukeRedaction: string[];
  scholarlyNotes: string[];
}

export default function QExplorerPage() {
  const [pericopes, setPericopes] = useState<QPericope[]>([]);
  const [selectedComparison, setSelectedComparison] = useState<QComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const [selectedPericope, setSelectedPericope] = useState<QPericope | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTheme, setFilterTheme] = useState('');
  const [sortBy, setSortBy] = useState<'confidence' | 'title'>('confidence');
  const [viewTab, setViewTab] = useState<'synoptic' | 'reconstruction' | 'analysis'>('synoptic');

  // Fetch pericopes list
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/q/pericopes');
        if (res.ok) {
          const data = await res.json();
          setPericopes(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch comparison when pericope is selected
  useEffect(() => {
    if (!selectedPericope) {
      setSelectedComparison(null);
      return;
    }

    const fetchComparison = async () => {
      setDetailLoading(true);
      try {
        const res = await fetch(`/api/q/pericopes/${selectedPericope.id}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedComparison(data);
        }
      } finally {
        setDetailLoading(false);
      }
    };
    fetchComparison();
  }, [selectedPericope]);

  const themes = useMemo(() => [...new Set(pericopes.map((p) => p.theme))], [pericopes]);

  const filteredPericopes = useMemo(() => {
    let result = pericopes;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.matthewRef.toLowerCase().includes(q) ||
        p.lukeRef.toLowerCase().includes(q)
      );
    }
    if (filterTheme) result = result.filter((p) => p.theme === filterTheme);
    return result.sort((a, b) => {
      if (sortBy === 'confidence') return b.confidence - a.confidence;
      return a.title.localeCompare(b.title);
    });
  }, [pericopes, searchQuery, filterTheme, sortBy]);

  const avgConfidence = useMemo(() => {
    if (pericopes.length === 0) return 0;
    return pericopes.reduce((sum, p) => sum + p.confidence, 0) / pericopes.length;
  }, [pericopes]);

  const themeStats = useMemo(() => {
    const counts: Record<string, number> = {};
    pericopes.forEach((p) => {
      counts[p.theme] = (counts[p.theme] || 0) + 1;
    });
    const colors = ['#C9A962', '#4ECDC4', '#FF6B6B', '#DDA0DD', '#45B7D1'];
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }));
  }, [pericopes]);

  const confidenceStats = useMemo(() => {
    const high = pericopes.filter((p) => p.confidence >= 0.85).length;
    const medium = pericopes.filter((p) => p.confidence >= 0.7 && p.confidence < 0.85).length;
    const low = pericopes.filter((p) => p.confidence < 0.7).length;
    return [
      { name: 'High (85%+)', value: high, color: '#4ade80' },
      { name: 'Medium', value: medium, color: '#C9A962' },
      { name: 'Low (<70%)', value: low, color: '#f87171' },
    ];
  }, [pericopes]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return 'text-green-400';
    if (confidence >= 0.7) return 'text-[#C9A962]';
    return 'text-red-400';
  };

  const getConfidenceBadge = (confidence: number): 'success' | 'warning' | 'error' => {
    if (confidence >= 0.85) return 'success';
    if (confidence >= 0.7) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-[#F5F3EF]/50">Loading Q source pericopes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-[#C9A962]">Q</span> Source Explorer
              </h1>
              <p className="text-[#F5F3EF]/70">
                Hypothetical sayings source behind Matthew and Luke
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A962]">{pericopes.length}</div>
                <div className="text-xs text-[#F5F3EF]/50">Pericopes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{(avgConfidence * 100).toFixed(0)}%</div>
                <div className="text-xs text-[#F5F3EF]/50">Avg Confidence</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card padding="md" className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Input
              placeholder="Search pericopes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56"
            />
            <Select
              value={filterTheme}
              onChange={(e) => setFilterTheme(e.target.value)}
              options={[
                { value: '', label: 'All Themes' },
                ...themes.map((t) => ({ value: t, label: t })),
              ]}
              className="w-40"
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              options={[
                { value: 'confidence', label: 'Sort: Confidence' },
                { value: 'title', label: 'Sort: Title' },
              ]}
              className="w-44"
            />
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pericope List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredPericopes.map((pericope) => (
              <Card
                key={pericope.id}
                className={`cursor-pointer transition-all ${
                  selectedPericope?.id === pericope.id ? 'ring-2 ring-[#C9A962]' : 'hover:border-[#C9A962]/40'
                }`}
                onClick={() => setSelectedPericope(pericope)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-serif text-[#C9A962]">{pericope.title}</h3>
                      <Badge variant={getConfidenceBadge(pericope.confidence)}>
                        {(pericope.confidence * 100).toFixed(0)}%
                      </Badge>
                      <Badge variant="default">{pericope.theme}</Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-[#F5F3EF]/60">
                      <span className="text-blue-400">{pericope.matthewRef}</span>
                      <span>||</span>
                      <span className="text-green-400">{pericope.lukeRef}</span>
                    </div>
                    <p className="text-sm text-[#F5F3EF]/50 mt-2 font-serif italic line-clamp-1">
                      {pericope.reconstructedText}
                    </p>
                  </div>

                  <div className="text-right ml-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-[#C9A962]/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            pericope.confidence >= 0.85 ? 'bg-green-400' :
                            pericope.confidence >= 0.7 ? 'bg-[#C9A962]' : 'bg-red-400'
                          }`}
                          style={{ width: `${pericope.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedPericope ? (
              <>
                {/* Detail Panel */}
                <Card padding="lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-serif text-[#C9A962]">{selectedPericope.title}</h2>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPericope(null)}>
                      x
                    </Button>
                  </div>

                  <Tabs
                    tabs={[
                      { id: 'synoptic', label: 'Synoptic' },
                      { id: 'reconstruction', label: 'Q Text' },
                      { id: 'analysis', label: 'Analysis' },
                    ]}
                    activeTab={viewTab}
                    onChange={(id) => setViewTab(id as typeof viewTab)}
                  />

                  <div className="mt-4">
                    {detailLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <LoadingSpinner size="sm" />
                      </div>
                    ) : selectedComparison ? (
                      <>
                        {viewTab === 'synoptic' && (
                          <div className="space-y-4">
                            <div className="p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
                              <div className="text-xs font-medium text-blue-400 mb-1">Matthew</div>
                              <p className="text-sm text-[#F5F3EF]/80 font-serif whitespace-pre-line">
                                {selectedComparison.matthewText}
                              </p>
                            </div>
                            <div className="p-3 bg-green-900/20 border border-green-400/30 rounded-lg">
                              <div className="text-xs font-medium text-green-400 mb-1">Luke</div>
                              <p className="text-sm text-[#F5F3EF]/80 font-serif whitespace-pre-line">
                                {selectedComparison.lukeText}
                              </p>
                            </div>
                          </div>
                        )}

                        {viewTab === 'reconstruction' && (
                          <div className="p-4 bg-[#C9A962]/10 border border-[#C9A962]/30 rounded-lg">
                            <div className="text-xs font-medium text-[#C9A962] mb-2">Reconstructed Q</div>
                            <p className="text-[#F5F3EF]/90 font-serif leading-relaxed whitespace-pre-line">
                              {selectedComparison.reconstructedQ}
                            </p>
                          </div>
                        )}

                        {viewTab === 'analysis' && (
                          <div className="space-y-4">
                            <div>
                              <div className="text-xs font-medium text-green-400 mb-2">Agreements</div>
                              <ul className="text-xs text-[#F5F3EF]/70 space-y-1">
                                {selectedComparison.agreements.map((a, i) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-green-400">•</span>
                                    {a}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-blue-400 mb-2">Matthew Redaction</div>
                              <ul className="text-xs text-[#F5F3EF]/70 space-y-1">
                                {selectedComparison.matthewRedaction.map((r, i) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-blue-400">•</span>
                                    {r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-purple-400 mb-2">Luke Redaction</div>
                              <ul className="text-xs text-[#F5F3EF]/70 space-y-1">
                                {selectedComparison.lukeRedaction.map((r, i) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    {r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-[#C9A962] mb-2">Scholarly Notes</div>
                              <ul className="text-xs text-[#F5F3EF]/50 space-y-1">
                                {selectedComparison.scholarlyNotes.map((n, i) => (
                                  <li key={i}>{n}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-[#F5F3EF]/50">Loading comparison...</p>
                    )}
                  </div>
                </Card>
              </>
            ) : (
              <Card padding="lg" className="text-center">
                <div className="text-4xl mb-4">Q</div>
                <h3 className="text-lg text-[#C9A962] mb-2">Select a Pericope</h3>
                <p className="text-sm text-[#F5F3EF]/50">
                  Click on any pericope to see the synoptic comparison and reconstructed Q text.
                </p>
              </Card>
            )}

            {/* Theme Distribution */}
            {themeStats.length > 0 && (
              <Card padding="lg">
                <h3 className="text-sm font-semibold text-[#C9A962] mb-4">By Theme</h3>
                <DonutChart data={themeStats} size={140} showLegend={false} />
                <div className="mt-4 space-y-1">
                  {themeStats.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-[#F5F3EF]/70">{s.name}</span>
                      </div>
                      <span className="text-[#F5F3EF]/50">{s.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Confidence Distribution */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-4">By Confidence</h3>
              <BarChart data={confidenceStats} horizontal maxBars={3} />
            </Card>

            {/* About Q */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-3">About Q</h3>
              <p className="text-xs text-[#F5F3EF]/60 leading-relaxed">
                Q (from German <em>Quelle</em>, "source") is a hypothetical written collection of Jesus's sayings used by Matthew and Luke.
                It explains the ~235 verses shared by Matthew and Luke but absent from Mark.
              </p>
              <p className="text-xs text-[#F5F3EF]/50 mt-2">
                Critical Edition: Robinson, Hoffmann, Kloppenborg (2000)
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
