'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, Button, Input, LoadingSpinner, Badge } from '@/components/ui';
import { LineChart, BarChart, DonutChart } from '@/components/charts';
import { search } from '@/lib/api';
import { formatNumber, cleanWord, detectLanguage } from '@/lib/utils';
import type { SearchResult } from '@/lib/types';

interface WordAnalysis {
  word: string;
  frequency: number;
  language: string;
  contexts: SearchResult[];
  authorDistribution: { author: string; count: number }[];
  workDistribution: { work: string; count: number }[];
}

// Sample semantic drift data
const generateSemanticDrift = (word: string) => [
  { name: '800 BCE', primary: 0.95, secondary: 0.1, tertiary: 0.05 },
  { name: '600 BCE', primary: 0.88, secondary: 0.2, tertiary: 0.12 },
  { name: '400 BCE', primary: 0.75, secondary: 0.35, tertiary: 0.25 },
  { name: '200 BCE', primary: 0.65, secondary: 0.45, tertiary: 0.35 },
  { name: '1 CE', primary: 0.55, secondary: 0.55, tertiary: 0.45 },
  { name: '200 CE', primary: 0.45, secondary: 0.65, tertiary: 0.55 },
  { name: '400 CE', primary: 0.35, secondary: 0.75, tertiary: 0.65 },
];

// Word meaning evolution examples
const MEANING_EXAMPLES: Record<string, { meanings: string[]; drift: string }> = {
  'λόγος': {
    meanings: ['word/speech', 'reason/logic', 'account', 'ratio', 'divine reason'],
    drift: 'From simple "word" to cosmic "divine reason" in philosophy'
  },
  'ἀρετή': {
    meanings: ['excellence', 'virtue', 'moral virtue', 'goodness'],
    drift: 'From martial excellence to ethical virtue'
  },
  'ψυχή': {
    meanings: ['breath', 'life', 'soul', 'mind', 'self'],
    drift: 'From physical breath to immortal soul'
  },
  'virtus': {
    meanings: ['manliness', 'courage', 'moral virtue', 'excellence'],
    drift: 'From masculine valor to general moral excellence'
  },
  'pietas': {
    meanings: ['duty to gods', 'duty to family', 'loyalty', 'patriotism'],
    drift: 'Expanded from religious duty to civic virtue'
  },
};

export default function SemantiaPage() {
  const searchParams = useSearchParams();
  const initialWord = searchParams.get('word') || '';

  const [query, setQuery] = useState(initialWord);
  const [analysis, setAnalysis] = useState<WordAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState(0);

  useEffect(() => {
    if (initialWord) {
      analyzeWord(initialWord);
    }
  }, []);

  const analyzeWord = async (word: string) => {
    const cleaned = cleanWord(word);
    if (!cleaned) return;

    setLoading(true);
    setError(null);

    try {
      const data = await search(cleaned, { limit: 100 });
      const results = data.results || [];

      const authorCounts: Record<string, number> = {};
      results.forEach((r) => {
        authorCounts[r.author] = (authorCounts[r.author] || 0) + 1;
      });
      const authorDistribution = Object.entries(authorCounts)
        .map(([author, count]) => ({ author, count }))
        .sort((a, b) => b.count - a.count);

      const workCounts: Record<string, number> = {};
      results.forEach((r) => {
        workCounts[r.work] = (workCounts[r.work] || 0) + 1;
      });
      const workDistribution = Object.entries(workCounts)
        .map(([work, count]) => ({ work, count }))
        .sort((a, b) => b.count - a.count);

      setAnalysis({
        word: cleaned,
        frequency: data.total || results.length,
        language: detectLanguage(cleaned),
        contexts: results.slice(0, 20),
        authorDistribution,
        workDistribution,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      analyzeWord(query);
    }
  };

  const semanticDriftData = useMemo(() => {
    if (!analysis) return [];
    return generateSemanticDrift(analysis.word);
  }, [analysis]);

  const meaningInfo = useMemo(() => {
    if (!analysis) return null;
    return MEANING_EXAMPLES[analysis.word] || null;
  }, [analysis]);

  const authorBarData = useMemo(() => {
    if (!analysis) return [];
    return analysis.authorDistribution.slice(0, 8).map((a) => ({
      name: a.author,
      value: a.count,
      color: '#C9A962',
    }));
  }, [analysis]);

  const periodDistribution = useMemo(() => {
    return [
      { name: 'Archaic', value: 15, color: '#FF6B6B' },
      { name: 'Classical', value: 35, color: '#4ECDC4' },
      { name: 'Hellenistic', value: 22, color: '#45B7D1' },
      { name: 'Roman', value: 20, color: '#DDA0DD' },
      { name: 'Late Antiquity', value: 8, color: '#98D8C8' },
    ];
  }, []);

  const sampleWords = ['λόγος', 'ἀρετή', 'ψυχή', 'amor', 'virtus', 'pietas', 'μῆνις', 'fides'];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#C9A962]">SEMANTIA</span>
          </h1>
          <p className="text-[#F5F3EF]/70">
            Semantic drift analysis across 2,400 years of classical literature
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-3">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a Greek or Latin word..."
              className="text-xl font-serif py-4"
            />
            <Button type="submit" size="lg" loading={loading}>
              Analyze
            </Button>
          </div>
        </form>

        {error && (
          <Card className="max-w-2xl mx-auto mb-8 border-red-500/20">
            <p className="text-red-400">{error}</p>
          </Card>
        )}

        {analysis && (
          <div className="space-y-8">
            {/* Header card with word info */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card padding="lg" className="lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-5xl font-serif text-[#C9A962]">{analysis.word}</h2>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={analysis.language === 'greek' ? 'greek' : 'latin'}>
                        {analysis.language}
                      </Badge>
                      {meaningInfo && (
                        <Badge variant="success">{meaningInfo.meanings.length} meanings tracked</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-bold text-[#C9A962]">
                      {formatNumber(analysis.frequency)}
                    </div>
                    <p className="text-[#F5F3EF]/50">occurrences in corpus</p>
                  </div>
                </div>

                {/* Meaning evolution */}
                {meaningInfo && (
                  <div className="mt-6 pt-6 border-t border-[#C9A962]/20">
                    <h3 className="text-sm font-semibold text-[#C9A962] mb-3">Meaning Evolution</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {meaningInfo.meanings.map((meaning, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedMeaning(i)}
                          className={`px-3 py-1.5 text-sm rounded-full transition ${
                            selectedMeaning === i
                              ? 'bg-[#C9A962] text-[#0D0D0F]'
                              : 'bg-[#C9A962]/10 hover:bg-[#C9A962]/20'
                          }`}
                        >
                          {i + 1}. {meaning}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-[#F5F3EF]/60 italic">{meaningInfo.drift}</p>
                  </div>
                )}
              </Card>

              {/* Period distribution */}
              <Card padding="lg">
                <h3 className="text-sm font-semibold text-[#C9A962] mb-4">By Period</h3>
                <DonutChart
                  data={periodDistribution}
                  size={180}
                  showLegend={false}
                />
                <div className="mt-4 space-y-1">
                  {periodDistribution.map((p) => (
                    <div key={p.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-[#F5F3EF]/70">{p.name}</span>
                      </div>
                      <span className="text-[#F5F3EF]/50">{p.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Semantic Drift Chart */}
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-[#C9A962] mb-2">Semantic Drift Over Time</h3>
              <p className="text-sm text-[#F5F3EF]/50 mb-6">
                Track how the word's primary and secondary meanings shifted across centuries
              </p>
              <div className="h-64">
                <LineChart
                  data={semanticDriftData}
                  lines={[
                    { dataKey: 'primary', name: 'Primary Meaning', color: '#C9A962' },
                    { dataKey: 'secondary', name: 'Secondary Meaning', color: '#87CEEB' },
                    { dataKey: 'tertiary', name: 'Tertiary Meaning', color: '#DDA0DD' },
                  ]}
                  xAxisKey="name"
                  xAxisLabel="Time Period"
                  yAxisLabel="Prevalence"
                />
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#C9A962]" />
                  <span className="text-sm text-[#F5F3EF]/70">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#87CEEB]" />
                  <span className="text-sm text-[#F5F3EF]/70">Secondary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#DDA0DD]" />
                  <span className="text-sm text-[#F5F3EF]/70">Tertiary</span>
                </div>
              </div>
            </Card>

            {/* Two column layout */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Top Authors */}
              <Card padding="lg">
                <h3 className="text-lg font-semibold text-[#C9A962] mb-4">Top Authors</h3>
                <div className="h-64">
                  <BarChart data={authorBarData} horizontal maxBars={8} />
                </div>
              </Card>

              {/* Sample Contexts */}
              <Card padding="lg">
                <h3 className="text-lg font-semibold text-[#C9A962] mb-4">
                  Sample Contexts ({analysis.contexts.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {analysis.contexts.slice(0, 6).map((ctx, i) => (
                    <div key={i} className="p-3 bg-[#C9A962]/5 rounded-lg">
                      <div className="flex justify-between text-xs text-[#F5F3EF]/50 mb-1">
                        <span>{ctx.author}</span>
                        <span>{ctx.work}</span>
                      </div>
                      <p className="font-serif text-sm text-[#F5F3EF]/80 line-clamp-2">
                        {ctx.passage}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Related actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/search?q=${encodeURIComponent(analysis.word)}`}>
                <Button variant="secondary">Search Full Corpus</Button>
              </Link>
              <Link href={`/chronos?word=${encodeURIComponent(analysis.word)}`}>
                <Button variant="ghost">View in Timeline</Button>
              </Link>
              <Link href={`/analysis?word=${encodeURIComponent(analysis.word)}`}>
                <Button variant="ghost">Morphological Analysis</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!analysis && !loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl text-[#C9A962] mb-2">Semantic Drift Analysis</h2>
            <p className="text-[#F5F3EF]/50 max-w-xl mx-auto mb-8">
              Track how word meanings evolved across 2,400 years. See "ἀρετή" shift from
              martial excellence to moral virtue, or "λόγος" expand from word to cosmic reason.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {sampleWords.map((word) => (
                <button
                  key={word}
                  onClick={() => {
                    setQuery(word);
                    analyzeWord(word);
                  }}
                  className="px-4 py-2 bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-full font-serif hover:bg-[#C9A962]/20 transition"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
