'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, Badge, LoadingSpinner, Select } from '@/components/ui';
import { InspectorDrawer, InspectorSection, InspectorMetric, InspectorGauge } from '@/components/ui/InspectorDrawer';
import { ExplainInline } from '@/components/ExplainButton';

interface Translation {
  id: string;
  translator: string;
  style: string;
  text: string;
  qualityScore: number;
}

interface Intertext {
  id: string;
  sourceUrn: string;
  targetUrn: string;
  sourceText: string;
  targetText: string;
  type: 'quotation' | 'allusion' | 'echo' | 'parallel';
  strength: number;
  evidence: string;
}

interface WordData {
  form: string;
  lemma: string;
  pos: string;
  morph: string;
}

interface Passage {
  urn: string;
  work: string;
  author: string;
  section: string;
  language: string;
  sourceText: string;
  words?: WordData[];
  translations: Translation[];
}

interface WordAnalysis {
  lemma: string;
  forms: string[];
  pos: string;
  definition: string;
  etymology: string;
  relatedWords: string[];
  occurrences: number;
  topAuthors: { name: string; count: number }[];
}

export default function PassagePage() {
  const params = useParams();
  const urn = params?.urn as string;

  const [passage, setPassage] = useState<Passage | null>(null);
  const [intertexts, setIntertexts] = useState<Intertext[]>([]);
  const [wordAnalysis, setWordAnalysis] = useState<WordAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTranslation, setSelectedTranslation] = useState<string>('');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  // Fetch passage data
  useEffect(() => {
    if (!urn) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch passage and intertexts in parallel
        const [passageRes, intertextsRes] = await Promise.all([
          fetch(`/api/passages/${encodeURIComponent(urn)}`),
          fetch(`/api/passages/${encodeURIComponent(urn)}/intertexts`),
        ]);

        if (!passageRes.ok) throw new Error('Failed to fetch passage');

        const passageData = await passageRes.json();
        const intertextsData = intertextsRes.ok ? await intertextsRes.json() : [];

        setPassage(passageData);
        setIntertexts(intertextsData);

        // Set default translation
        if (passageData.translations?.length > 0) {
          setSelectedTranslation(passageData.translations[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [urn]);

  // Fetch word analysis when word is selected
  const fetchWordAnalysis = useCallback(async (lemma: string) => {
    try {
      const res = await fetch(`/api/words/${encodeURIComponent(lemma)}`);
      if (res.ok) {
        const data = await res.json();
        setWordAnalysis(data);
      }
    } catch (err) {
      console.error('Failed to fetch word analysis:', err);
    }
  }, []);

  const handleWordClick = (word: string) => {
    const cleaned = word.replace(/[,.;:'"·]/g, '');
    setSelectedWord(cleaned);
    setInspectorOpen(true);
    fetchWordAnalysis(cleaned);
  };

  const copyPermalink = () => {
    const url = `${window.location.origin}/passage/${encodeURIComponent(urn)}`;
    navigator.clipboard.writeText(url);
  };

  const copyCitation = () => {
    if (!passage) return;
    const citation = `${passage.author}, ${passage.work} ${passage.section}`;
    navigator.clipboard.writeText(citation);
  };

  // Parse source text into lines
  const sourceLines = passage?.sourceText?.split('\n').map((text, i) => ({ num: i + 1, text })) || [];

  const currentTranslation = passage?.translations.find((t) => t.id === selectedTranslation);

  // Calculate metrics from passage data
  const metrics = {
    wordCount: passage?.sourceText?.split(/\s+/).length || 0,
    uniqueWords: new Set(passage?.sourceText?.toLowerCase().split(/\s+/)).size || 0,
    avgWordLength: passage?.sourceText
      ? (passage.sourceText.replace(/\s/g, '').length / passage.sourceText.split(/\s+/).length).toFixed(1)
      : '0',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-[#F5F3EF]/50">Loading passage...</p>
        </div>
      </div>
    );
  }

  if (error || !passage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card padding="lg" className="max-w-md text-center">
          <div className="text-4xl mb-4">404</div>
          <h2 className="text-xl font-semibold text-[#C9A962] mb-2">Passage Not Found</h2>
          <p className="text-[#F5F3EF]/60 mb-4">
            {error || "The requested passage could not be found."}
          </p>
          <p className="text-sm text-[#F5F3EF]/40 mb-4 font-mono break-all">{decodeURIComponent(urn)}</p>
          <Link href="/library">
            <Button variant="primary">Browse Library</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Source Text */}
      <div className="w-1/3 border-r border-[#C9A962]/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#C9A962]/20 bg-[#0D0D0F]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant={passage.language === 'greek' ? 'greek' : passage.language === 'latin' ? 'latin' : 'default'}>
                {passage.language}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFontSize((s) => Math.max(14, s - 2))}
                className="p-1.5 text-[#F5F3EF]/50 hover:text-[#C9A962] transition"
              >
                <span className="text-xs">A-</span>
              </button>
              <button
                onClick={() => setFontSize((s) => Math.min(24, s + 2))}
                className="p-1.5 text-[#F5F3EF]/50 hover:text-[#C9A962] transition"
              >
                <span className="text-sm">A+</span>
              </button>
            </div>
          </div>
          <h2 className="text-xl font-serif text-[#C9A962]">
            {passage.author}, <em>{passage.work}</em>
          </h2>
          <p className="text-sm text-[#F5F3EF]/60">{passage.section}</p>
        </div>

        {/* Source text */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {sourceLines.map((line) => (
              <div key={line.num} className="flex gap-3 group">
                {showLineNumbers && (
                  <span className="text-[#C9A962]/40 text-sm font-mono w-8 shrink-0 text-right group-hover:text-[#C9A962]/70 transition">
                    {line.num}
                  </span>
                )}
                <p className="font-serif leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                  {line.text.split(/\s+/).map((word, i) => (
                    <span
                      key={i}
                      onClick={() => handleWordClick(word)}
                      className={`cursor-pointer hover:text-[#C9A962] hover:bg-[#C9A962]/10 px-0.5 rounded transition ${
                        selectedWord === word.replace(/[,.;:'"·]/g, '') ? 'text-[#C9A962] bg-[#C9A962]/20' : ''
                      }`}
                    >
                      {word}{' '}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Source metrics */}
        <div className="p-3 border-t border-[#C9A962]/20 bg-[#0D0D0F]">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-[#C9A962] font-medium">{metrics.wordCount}</div>
              <div className="text-[#F5F3EF]/40">words</div>
            </div>
            <div className="text-center">
              <div className="text-[#C9A962] font-medium">{metrics.uniqueWords}</div>
              <div className="text-[#F5F3EF]/40">unique</div>
            </div>
            <div className="text-center">
              <div className="text-[#C9A962] font-medium">{metrics.avgWordLength}</div>
              <div className="text-[#F5F3EF]/40">avg len</div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Column - Translation */}
      <div className="flex-1 flex flex-col">
        {/* Translation selector */}
        <div className="p-4 border-b border-[#C9A962]/20 bg-[#0D0D0F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {passage.translations.length > 0 ? (
              <>
                <Select
                  value={selectedTranslation}
                  onChange={(e) => setSelectedTranslation(e.target.value)}
                  options={passage.translations.map((t) => ({
                    value: t.id,
                    label: t.translator,
                  }))}
                  className="w-64"
                />
                {currentTranslation && (
                  <Badge size="sm" variant="default">
                    {currentTranslation.style.replace('_', ' ')}
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-[#F5F3EF]/50">No translations available</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyCitation}
              className="p-2 text-[#F5F3EF]/50 hover:text-[#C9A962] transition"
              title="Copy citation"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={copyPermalink}
              className="p-2 text-[#F5F3EF]/50 hover:text-[#C9A962] transition"
              title="Copy permalink"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
            <Button
              variant={inspectorOpen ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setInspectorOpen(!inspectorOpen)}
            >
              Inspector
            </Button>
          </div>
        </div>

        {/* Translation text */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl">
            {currentTranslation ? (
              <p className="font-serif text-lg leading-relaxed text-[#F5F3EF]/90 whitespace-pre-line">
                {currentTranslation.text}
              </p>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#F5F3EF]/50 mb-4">No translation selected</p>
                <Link href="/translate">
                  <Button variant="secondary">Generate Translation</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quality scores */}
        {currentTranslation && (
          <div className="p-4 border-t border-[#C9A962]/20 bg-[#0D0D0F]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#F5F3EF]/50 uppercase tracking-wide">Translation Quality</span>
              <Link href="/translations/quality">
                <span className="text-xs text-[#C9A962] hover:underline">View Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-2xl font-medium ${
                  currentTranslation.qualityScore >= 0.85 ? 'text-green-400' :
                  currentTranslation.qualityScore >= 0.7 ? 'text-[#C9A962]' : 'text-orange-400'
                }`}>
                  {(currentTranslation.qualityScore * 100).toFixed(0)}
                </div>
                <div className="text-xs text-[#F5F3EF]/40">Overall Score</div>
              </div>
              <div className="flex-1 h-2 bg-[#C9A962]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C9A962] rounded-full transition-all"
                  style={{ width: `${currentTranslation.qualityScore * 100}%` }}
                />
              </div>
            </div>
            {/* AI Explain */}
            <div className="mt-3">
              <ExplainInline
                type="translation"
                context={{
                  source: passage?.sourceText?.substring(0, 200),
                  translation: currentTranslation.text.substring(0, 200),
                  translator: currentTranslation.translator,
                  score: currentTranslation.qualityScore * 100,
                  sourceLanguage: passage?.language,
                }}
                triggerLabel="Why this score?"
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Intertexts */}
      <div className="w-80 border-l border-[#C9A962]/20 flex flex-col">
        <div className="p-4 border-b border-[#C9A962]/20 bg-[#0D0D0F]">
          <h3 className="text-sm font-semibold text-[#C9A962] uppercase tracking-wide">Intertexts</h3>
          <p className="text-xs text-[#F5F3EF]/50 mt-1">
            {intertexts.length} connected passages
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {intertexts.length > 0 ? (
            intertexts.map((intertext) => (
              <Link key={intertext.id} href={`/passage/${encodeURIComponent(intertext.targetUrn)}`}>
                <Card
                  padding="sm"
                  variant="interactive"
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge size="sm" variant={intertext.type === 'quotation' ? 'success' : intertext.type === 'allusion' ? 'warning' : 'default'}>
                      {intertext.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#F5F3EF]/70 mb-2 line-clamp-2 font-serif italic">
                    "{intertext.targetText}"
                  </p>
                  <p className="text-xs text-[#F5F3EF]/50 mb-2">{intertext.evidence}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#C9A962]/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C9A962] rounded-full"
                        style={{ width: `${intertext.strength * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#F5F3EF]/50">{(intertext.strength * 100).toFixed(0)}%</span>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-[#F5F3EF]/50">No intertexts found</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#C9A962]/20 bg-[#0D0D0F]">
          <Link href="/intertexts/map">
            <Button variant="secondary" size="sm" className="w-full">
              View Full Network
            </Button>
          </Link>
        </div>
      </div>

      {/* Inspector Drawer */}
      <InspectorDrawer
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        title={selectedWord ? `Word: ${selectedWord}` : 'Passage Inspector'}
        width="lg"
      >
        {selectedWord && wordAnalysis ? (
          <>
            <InspectorSection title="Word Information">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#F5F3EF]/50">Lemma</span>
                  <span className="text-[#C9A962] font-serif">{wordAnalysis.lemma}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F5F3EF]/50">Part of Speech</span>
                  <span className="capitalize">{wordAnalysis.pos}</span>
                </div>
              </div>
            </InspectorSection>

            <InspectorSection title="Definition">
              <p className="text-sm text-[#F5F3EF]/80">{wordAnalysis.definition}</p>
            </InspectorSection>

            <InspectorSection title="Etymology" collapsible defaultOpen={false}>
              <p className="text-sm text-[#F5F3EF]/70">{wordAnalysis.etymology}</p>
            </InspectorSection>

            <InspectorSection title="Corpus Statistics">
              <InspectorMetric label="Occurrences" value={wordAnalysis.occurrences.toLocaleString()} />
              <InspectorMetric label="Forms" value={wordAnalysis.forms.length} />
            </InspectorSection>

            <InspectorSection title="Top Authors">
              <div className="space-y-2">
                {wordAnalysis.topAuthors.slice(0, 5).map((author, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#F5F3EF]/70">{author.name}</span>
                    <span className="text-[#C9A962]">{author.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </InspectorSection>

            <InspectorSection title="Related Words" collapsible defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {wordAnalysis.relatedWords.map((word) => (
                  <Badge key={word} size="sm" variant="default" className="font-serif">
                    {word}
                  </Badge>
                ))}
              </div>
            </InspectorSection>
          </>
        ) : selectedWord ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-[#F5F3EF]/50">Loading word analysis...</span>
          </div>
        ) : (
          <>
            <InspectorSection title="Passage Metrics">
              <InspectorMetric label="Word Count" value={metrics.wordCount} />
              <InspectorMetric label="Unique Words" value={metrics.uniqueWords} />
              <InspectorMetric label="Avg Word Length" value={metrics.avgWordLength} unit="chars" />
            </InspectorSection>

            <InspectorSection title="Translations Available">
              {passage.translations.map((t) => (
                <div key={t.id} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{t.translator}</span>
                    <Badge size="sm" variant="default">{t.style}</Badge>
                  </div>
                  <InspectorGauge value={t.qualityScore * 100} label="Quality Score" color="gold" />
                </div>
              ))}
            </InspectorSection>
          </>
        )}
      </InspectorDrawer>
    </div>
  );
}
