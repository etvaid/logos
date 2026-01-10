'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card, Button, Badge, Select, LoadingSpinner } from '@/components/ui';
import { RadarChart, DonutChart } from '@/components/charts';
import { StyleNormalizationOverlay, GenreSelector, GENRE_NEUTRAL_STYLES } from '@/components/StyleNormalizationOverlay';

interface TranslationScore {
  id: string;
  urn: string;
  translator: string;
  style: string;
  sourceText: string;
  translatedText: string;
  scores: {
    overall: number;
    semanticFidelity: number;
    registerMatch: number;
    literalness: number;
    readability: number;
    styleConsistency: number;
    translatorBias: number;
  };
  flagged: boolean;
  flagReason?: string;
}

const SCORE_LABELS: Record<string, string> = {
  semanticFidelity: 'SF',
  registerMatch: 'RM',
  literalness: 'LT',
  readability: 'RD',
  styleConsistency: 'SC',
  translatorBias: 'TB',
};

const SCORE_DESCRIPTIONS: Record<string, string> = {
  semanticFidelity: 'How accurately the translation preserves the original meaning',
  registerMatch: 'How well the translation matches the appropriate style register',
  literalness: 'Degree of word-for-word correspondence with source',
  readability: 'Clarity and fluency in the target language',
  styleConsistency: 'Uniformity of stylistic choices throughout',
  translatorBias: 'Deviation toward translator\'s characteristic patterns',
};

export default function TranslationQualityPage() {
  const [translations, setTranslations] = useState<TranslationScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<string>('overall');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filterTranslator, setFilterTranslator] = useState('');
  const [filterStyle, setFilterStyle] = useState('');
  const [showFlagged, setShowFlagged] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TranslationScore | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<keyof typeof GENRE_NEUTRAL_STYLES>('epic');

  // Fetch translations from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filterTranslator) params.set('translator', filterTranslator);
        if (showFlagged) params.set('flagged', 'true');
        params.set('limit', '100');

        const res = await fetch(`/api/translations?${params}`);
        if (!res.ok) throw new Error('Failed to fetch translations');

        const data = await res.json();
        setTranslations(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterTranslator, showFlagged]);

  const translators = useMemo(() => [...new Set(translations.map((t) => t.translator))], [translations]);
  const styles = useMemo(() => [...new Set(translations.map((t) => t.style))], [translations]);

  const filteredTranslations = useMemo(() => {
    let result = translations;
    if (filterStyle) result = result.filter((t) => t.style === filterStyle);

    return result.sort((a, b) => {
      const aVal = sortBy === 'overall' ? a.scores.overall : (a.scores as Record<string, number>)[sortBy] || 0;
      const bVal = sortBy === 'overall' ? b.scores.overall : (b.scores as Record<string, number>)[sortBy] || 0;
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [translations, filterStyle, sortBy, sortDir]);

  const avgScores = useMemo(() => {
    if (filteredTranslations.length === 0) {
      return { overall: 0, semanticFidelity: 0, registerMatch: 0, literalness: 0, readability: 0, styleConsistency: 0, translatorBias: 0 };
    }

    const sum = filteredTranslations.reduce(
      (acc, t) => ({
        overall: acc.overall + t.scores.overall,
        semanticFidelity: acc.semanticFidelity + t.scores.semanticFidelity,
        registerMatch: acc.registerMatch + t.scores.registerMatch,
        literalness: acc.literalness + t.scores.literalness,
        readability: acc.readability + t.scores.readability,
        styleConsistency: acc.styleConsistency + t.scores.styleConsistency,
        translatorBias: acc.translatorBias + t.scores.translatorBias,
      }),
      { overall: 0, semanticFidelity: 0, registerMatch: 0, literalness: 0, readability: 0, styleConsistency: 0, translatorBias: 0 }
    );

    const n = filteredTranslations.length;
    return {
      overall: sum.overall / n,
      semanticFidelity: sum.semanticFidelity / n,
      registerMatch: sum.registerMatch / n,
      literalness: sum.literalness / n,
      readability: sum.readability / n,
      styleConsistency: sum.styleConsistency / n,
      translatorBias: sum.translatorBias / n,
    };
  }, [filteredTranslations]);

  const radarData = useMemo(() => {
    return [
      { subject: 'Semantic', value: avgScores.semanticFidelity * 100 },
      { subject: 'Register', value: avgScores.registerMatch * 100 },
      { subject: 'Literal', value: avgScores.literalness * 100 },
      { subject: 'Readability', value: avgScores.readability * 100 },
      { subject: 'Consistency', value: avgScores.styleConsistency * 100 },
    ];
  }, [avgScores]);

  const styleStats = useMemo(() => {
    const counts: Record<string, number> = {};
    translations.forEach((t) => {
      counts[t.style] = (counts[t.style] || 0) + 1;
    });
    const colors = ['#C9A962', '#4ECDC4', '#FF6B6B', '#DDA0DD', '#45B7D1'];
    return Object.entries(counts).map(([name, value], i) => ({
      name: name.replace('_', ' '),
      value,
      color: colors[i % colors.length],
    }));
  }, [translations]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
  };

  const getScoreColor = (score: number, isBias = false) => {
    if (isBias) {
      return score < 0.15 ? 'text-green-400' : score < 0.25 ? 'text-[#C9A962]' : 'text-red-400';
    }
    return score >= 0.85 ? 'text-green-400' : score >= 0.7 ? 'text-[#C9A962]' : 'text-orange-400';
  };

  const flaggedCount = translations.filter((t) => t.flagged).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-[#F5F3EF]/50">Loading translation quality data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card padding="lg" className="max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Data</h2>
          <p className="text-[#F5F3EF]/60 mb-4">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
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
                <span className="text-[#C9A962]">Translation Quality</span> Dashboard
              </h1>
              <p className="text-[#F5F3EF]/70">
                Multi-dimensional quality scores with 6 sub-dimensions
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A962]">{translations.length}</div>
                <div className="text-xs text-[#F5F3EF]/50">Translations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{(avgScores.overall * 100).toFixed(1)}%</div>
                <div className="text-xs text-[#F5F3EF]/50">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{flaggedCount}</div>
                <div className="text-xs text-[#F5F3EF]/50">Flagged</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card padding="md" className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Select
              value={filterTranslator}
              onChange={(e) => setFilterTranslator(e.target.value)}
              options={[{ value: '', label: 'All Translators' }, ...translators.map((t) => ({ value: t, label: t }))]}
              className="w-44"
            />
            <Select
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value)}
              options={[{ value: '', label: 'All Styles' }, ...styles.map((s) => ({ value: s, label: s.replace('_', ' ') }))]}
              className="w-48"
            />
            <Button
              variant={showFlagged ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowFlagged(!showFlagged)}
            >
              {showFlagged ? 'Showing Flagged' : 'Show Flagged Only'}
              {flaggedCount > 0 && <Badge size="sm" variant="error" className="ml-2">{flaggedCount}</Badge>}
            </Button>
            <div className="ml-auto text-sm text-[#F5F3EF]/50">
              {filteredTranslations.length} of {translations.length} translations
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Table */}
          <div className="lg:col-span-3">
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#C9A962]/20">
                      <th className="text-left p-4 text-sm font-medium text-[#F5F3EF]/70">Passage</th>
                      <th className="text-left p-4 text-sm font-medium text-[#F5F3EF]/70">Translator</th>
                      {(['semanticFidelity', 'registerMatch', 'literalness', 'readability', 'styleConsistency', 'translatorBias'] as const).map((col) => (
                        <th
                          key={col}
                          onClick={() => handleSort(col)}
                          className="p-4 text-sm font-medium text-[#F5F3EF]/70 cursor-pointer hover:text-[#C9A962] transition text-center whitespace-nowrap"
                          title={SCORE_DESCRIPTIONS[col]}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {SCORE_LABELS[col]}
                            {sortBy === col && (
                              <span className="text-[#C9A962]">{sortDir === 'desc' ? '↓' : '↑'}</span>
                            )}
                          </div>
                        </th>
                      ))}
                      <th
                        onClick={() => handleSort('overall')}
                        className="p-4 text-sm font-medium text-[#C9A962] cursor-pointer hover:text-[#C9A962] transition text-center"
                      >
                        <div className="flex items-center justify-center gap-1">
                          Overall
                          {sortBy === 'overall' && (
                            <span>{sortDir === 'desc' ? '↓' : '↑'}</span>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTranslations.map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedRow(t)}
                        className={`border-b border-[#C9A962]/10 cursor-pointer transition ${
                          selectedRow?.id === t.id ? 'bg-[#C9A962]/10' : 'hover:bg-[#C9A962]/5'
                        } ${t.flagged ? 'bg-red-900/10' : ''}`}
                      >
                        <td className="p-4">
                          <div className="text-sm font-medium text-[#C9A962] truncate max-w-32" title={t.urn}>
                            {t.urn.split(':').pop()}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{t.translator}</span>
                            {t.flagged && (
                              <span className="text-red-400" title={t.flagReason}>!</span>
                            )}
                          </div>
                          <Badge size="sm" variant="default" className="mt-1">
                            {t.style.replace('_', ' ')}
                          </Badge>
                        </td>
                        {(['semanticFidelity', 'registerMatch', 'literalness', 'readability', 'styleConsistency', 'translatorBias'] as const).map((col) => (
                          <td key={col} className="p-4 text-center">
                            <span className={`font-mono text-sm ${getScoreColor(t.scores[col], col === 'translatorBias')}`}>
                              {(t.scores[col] * 100).toFixed(0)}
                            </span>
                          </td>
                        ))}
                        <td className="p-4 text-center">
                          <span className={`font-bold ${getScoreColor(t.scores.overall)}`}>
                            {(t.scores.overall * 100).toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Score Legend */}
            <div className="mt-4 flex flex-wrap gap-6 text-xs text-[#F5F3EF]/50">
              <div><span className="font-medium">SF</span> = Semantic Fidelity</div>
              <div><span className="font-medium">RM</span> = Register Match</div>
              <div><span className="font-medium">LT</span> = Literalness</div>
              <div><span className="font-medium">RD</span> = Readability</div>
              <div><span className="font-medium">SC</span> = Style Consistency</div>
              <div><span className="font-medium">TB</span> = Translator Bias</div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Average Scores Radar */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Average Quality Profile</h3>
              <div className="h-48 -mx-4">
                <RadarChart data={radarData} name="Average" />
              </div>
            </Card>

            {/* Style Distribution */}
            {styleStats.length > 0 && (
              <Card padding="lg">
                <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Style Distribution</h3>
                <DonutChart data={styleStats} size={140} showLegend={false} />
                <div className="mt-4 space-y-1">
                  {styleStats.map((s) => (
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

            {/* Genre Selector for Normalization */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-3">Genre Context</h3>
              <GenreSelector
                value={selectedGenre}
                onChange={setSelectedGenre}
                className="w-full"
              />
              <p className="text-xs text-[#F5F3EF]/40 mt-2">
                Select the source text genre for style normalization analysis
              </p>
            </Card>

            {/* Selected Row Details */}
            {selectedRow && (
              <>
                <Card padding="lg">
                  <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Selected Translation</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-lg font-medium">{selectedRow.translator}</div>
                      <div className="text-sm text-[#F5F3EF]/50">{selectedRow.style.replace('_', ' ')}</div>
                    </div>

                    {selectedRow.flagged && (
                      <div className="p-2 bg-red-900/20 border border-red-400/30 rounded text-xs text-red-400">
                        {selectedRow.flagReason}
                      </div>
                    )}

                    <div className="space-y-2">
                      {Object.entries(selectedRow.scores).filter(([key]) => key !== 'overall').map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-xs text-[#F5F3EF]/50 w-24 truncate">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <div className="flex-1 h-1.5 bg-[#C9A962]/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${key === 'translatorBias' ? 'bg-red-400' : 'bg-[#C9A962]'}`}
                              style={{ width: `${value * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono w-8 text-right">{(value * 100).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={`/passage/${encodeURIComponent(selectedRow.urn)}`}>
                      <Button variant="secondary" size="sm" className="w-full mt-2">
                        View Passage
                      </Button>
                    </Link>
                  </div>
                </Card>

                {/* Style Normalization Overlay */}
                <StyleNormalizationOverlay
                  genre={selectedGenre}
                  translatorStyle={{
                    literalness: selectedRow.scores.literalness,
                    poeticness: 1 - selectedRow.scores.readability, // Invert readability as poeticness proxy
                    formality: selectedRow.scores.registerMatch,
                    accessibility: selectedRow.scores.readability,
                    scholarlyPrecision: selectedRow.scores.semanticFidelity,
                  }}
                  translatorName={selectedRow.translator}
                  showResiduals
                  compact={false}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
