'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components/ui';

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

interface Translator {
  translator_id: string;
  name: string;
  era: string;
  translation_count: number;
  archaism_score: number;
  formality_score: number;
  literalness_score: number;
  sentence_length_mean: number;
  primary_works: string[];
}

interface StyleCentroid {
  centroid_id: string;
  label: string;
  description: string;
  member_count: number;
  members: Array<{ translator_id: string; name: string }>;
}

interface TransferResult {
  urn: string;
  source_text: string;
  source_language: string;
  transferred_text: string;
  method: string;
  fidelity_score: number;
  style_match_score: number;
  fluency_score: number;
  evidence: any;
  cached: boolean;
}

interface TokenSegment {
  token: string;
  position: number;
  meaning_score: number;
  style_score: number;
  style_type: string | null;
  is_function_word: boolean;
  is_archaic: boolean;
  is_latinate: boolean;
  translator_variance: number;
  alternatives: Array<{ word: string; freq: number }>;
}

// ══════════════════════════════════════════════════════════════════════════════
// API CLIENT
// ══════════════════════════════════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function listTranslators(era?: string): Promise<Translator[]> {
  const url = new URL(`${API_URL}/api/style-transfer/translators`);
  if (era) url.searchParams.set('era', era);
  url.searchParams.set('limit', '100');

  const res = await fetch(url.toString());
  const data = await res.json();
  return data.translators || [];
}

async function listStyles(): Promise<StyleCentroid[]> {
  const res = await fetch(`${API_URL}/api/style-transfer/styles`);
  const data = await res.json();
  return data.styles || [];
}

async function transferStyle(
  urn: string,
  targetTranslatorId?: string,
  targetStyleId?: string,
  method: string = 'auto'
): Promise<TransferResult> {
  const res = await fetch(`${API_URL}/api/style-transfer/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      urn,
      target_translator_id: targetTranslatorId,
      target_style_id: targetStyleId,
      method
    })
  });

  if (!res.ok) {
    throw new Error(`Transfer failed: ${res.statusText}`);
  }

  return res.json();
}

async function segmentText(urn: string, translatorId: string) {
  const res = await fetch(`${API_URL}/api/style-transfer/segment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urn, translator_id: translatorId })
  });

  if (!res.ok) {
    throw new Error(`Segmentation failed: ${res.statusText}`);
  }

  return res.json();
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function StyleTransferPage() {
  // State
  const [translators, setTranslators] = useState<Translator[]>([]);
  const [styles, setStyles] = useState<StyleCentroid[]>([]);
  const [selectedTranslator, setSelectedTranslator] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [sourceUrn, setSourceUrn] = useState('');
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null);
  const [segmentation, setSegmentation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'transfer' | 'segment' | 'browse'>('transfer');

  // Load data
  useEffect(() => {
    loadTranslators();
    loadStyles();
  }, []);

  async function loadTranslators() {
    try {
      const data = await listTranslators();
      setTranslators(data);
    } catch (err: any) {
      console.error('Failed to load translators:', err);
    }
  }

  async function loadStyles() {
    try {
      const data = await listStyles();
      setStyles(data);
    } catch (err: any) {
      console.error('Failed to load styles:', err);
    }
  }

  async function handleTransfer() {
    if (!sourceUrn) {
      setError('Please enter a source URN');
      return;
    }

    if (!selectedTranslator && !selectedStyle) {
      setError('Please select a target translator or style');
      return;
    }

    setLoading(true);
    setError(null);
    setTransferResult(null);

    try {
      const result = await transferStyle(
        sourceUrn,
        selectedTranslator || undefined,
        selectedStyle || undefined
      );
      setTransferResult(result);
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSegment() {
    if (!sourceUrn || !selectedTranslator) {
      setError('Please enter a URN and select a translator');
      return;
    }

    setLoading(true);
    setError(null);
    setSegmentation(null);

    try {
      const result = await segmentText(sourceUrn, selectedTranslator);
      setSegmentation(result);
    } catch (err: any) {
      setError(err.message || 'Segmentation failed');
    } finally {
      setLoading(false);
    }
  }

  // Render
  return (
    <div className="min-h-screen bg-[#1A1410] text-[#F5F3EF] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[#C9A962] mb-4">
            Style Transfer System
          </h1>
          <p className="text-xl text-[#F5F3EF]/80 max-w-3xl">
            Mathematical style isolation for classical translations. Transfer any passage
            to any translator's style using vector embeddings, not prompt engineering.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[#C9A962]/20">
          {(['transfer', 'segment', 'browse'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === tab
                  ? 'text-[#C9A962] border-b-2 border-[#C9A962]'
                  : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'transfer' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Controls */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 border-[#C9A962]/30">
                <h2 className="text-2xl font-bold text-[#C9A962] mb-4">Transfer Controls</h2>

                {/* Source URN */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Source URN</label>
                  <input
                    type="text"
                    value={sourceUrn}
                    onChange={(e) => setSourceUrn(e.target.value)}
                    placeholder="urn:cts:greekLit:tlg0012.tlg001:1.1"
                    className="w-full px-4 py-2 bg-[#1A1410] border border-[#C9A962]/30 rounded-lg
                             text-[#F5F3EF] placeholder-[#F5F3EF]/50 focus:outline-none
                             focus:border-[#C9A962]"
                  />
                </div>

                {/* Target Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Target Translator</label>
                  <select
                    value={selectedTranslator || ''}
                    onChange={(e) => {
                      setSelectedTranslator(e.target.value || null);
                      setSelectedStyle(null);
                    }}
                    className="w-full px-4 py-2 bg-[#1A1410] border border-[#C9A962]/30 rounded-lg
                             text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]"
                  >
                    <option value="">Select translator...</option>
                    {translators.map((t) => (
                      <option key={t.translator_id} value={t.translator_id}>
                        {t.name} ({t.era})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-center text-[#F5F3EF]/50 mb-6">OR</div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Target Style</label>
                  <select
                    value={selectedStyle || ''}
                    onChange={(e) => {
                      setSelectedStyle(e.target.value || null);
                      setSelectedTranslator(null);
                    }}
                    className="w-full px-4 py-2 bg-[#1A1410] border border-[#C9A962]/30 rounded-lg
                             text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]"
                  >
                    <option value="">Select style...</option>
                    {styles.map((s) => (
                      <option key={s.centroid_id} value={s.centroid_id}>
                        {s.label} ({s.member_count} translators)
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleTransfer}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Transferring...' : 'Transfer Style'}
                </Button>
              </Card>

              {/* Selected translator info */}
              {selectedTranslator && (
                <Card className="p-6 border-[#C9A962]/30">
                  {(() => {
                    const t = translators.find((x) => x.translator_id === selectedTranslator);
                    if (!t) return null;

                    return (
                      <>
                        <h3 className="text-xl font-bold text-[#C9A962] mb-4">{t.name}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#F5F3EF]/70">Era:</span>
                            <span className="font-medium">{t.era}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#F5F3EF]/70">Translations:</span>
                            <span className="font-medium">{t.translation_count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#F5F3EF]/70">Archaism:</span>
                            <span className="font-medium">{(t.archaism_score * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#F5F3EF]/70">Formality:</span>
                            <span className="font-medium">{(t.formality_score * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#F5F3EF]/70">Literalness:</span>
                            <span className="font-medium">{(t.literalness_score * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </Card>
              )}
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-2">
              {error && (
                <Card className="p-6 border-red-500/50 bg-red-500/10 mb-6">
                  <div className="text-red-400">{error}</div>
                </Card>
              )}

              {transferResult && (
                <div className="space-y-6">
                  {/* Source */}
                  <Card className="p-6 border-[#C9A962]/30">
                    <h3 className="text-xl font-bold text-[#C9A962] mb-4">
                      Source ({transferResult.source_language})
                    </h3>
                    <div className="text-lg font-serif leading-relaxed">
                      {transferResult.source_text}
                    </div>
                  </Card>

                  {/* Transferred */}
                  <Card className="p-6 border-[#C9A962]/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-[#C9A962]">Transferred Text</h3>
                      {transferResult.cached && (
                        <Badge variant="ghost" className="text-xs">Cached</Badge>
                      )}
                    </div>
                    <div className="text-lg font-serif leading-relaxed mb-4">
                      {transferResult.transferred_text}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#C9A962]/20">
                      <div>
                        <div className="text-sm text-[#F5F3EF]/70 mb-1">Fidelity</div>
                        <div className="text-2xl font-bold text-[#C9A962]">
                          {(transferResult.fidelity_score * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-[#F5F3EF]/70 mb-1">Style Match</div>
                        <div className="text-2xl font-bold text-[#C9A962]">
                          {(transferResult.style_match_score * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-[#F5F3EF]/70 mb-1">Fluency</div>
                        <div className="text-2xl font-bold text-[#C9A962]">
                          {(transferResult.fluency_score * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* Method */}
                    <div className="mt-4 text-sm text-[#F5F3EF]/70">
                      Method: <span className="text-[#C9A962]">{transferResult.method}</span>
                    </div>
                  </Card>
                </div>
              )}

              {!transferResult && !error && (
                <Card className="p-12 border-[#C9A962]/30 text-center">
                  <div className="text-6xl mb-4">✨</div>
                  <div className="text-xl text-[#F5F3EF]/70">
                    Enter a source URN and select a target style to begin
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Segment Tab */}
        {activeTab === 'segment' && (
          <div className="max-w-5xl mx-auto">
            <Card className="p-6 border-[#C9A962]/30 mb-6">
              <h2 className="text-2xl font-bold text-[#C9A962] mb-4">Token Segmentation</h2>
              <p className="text-[#F5F3EF]/80 mb-6">
                Analyze which tokens are meaning (blue) vs style (red) using SAM-like segmentation.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Source URN</label>
                  <input
                    type="text"
                    value={sourceUrn}
                    onChange={(e) => setSourceUrn(e.target.value)}
                    placeholder="urn:cts:greekLit:tlg0012.tlg001:1.1"
                    className="w-full px-4 py-2 bg-[#1A1410] border border-[#C9A962]/30 rounded-lg
                             text-[#F5F3EF] placeholder-[#F5F3EF]/50 focus:outline-none
                             focus:border-[#C9A962]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Translator</label>
                  <select
                    value={selectedTranslator || ''}
                    onChange={(e) => setSelectedTranslator(e.target.value || null)}
                    className="w-full px-4 py-2 bg-[#1A1410] border border-[#C9A962]/30 rounded-lg
                             text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]"
                  >
                    <option value="">Select translator...</option>
                    {translators.map((t) => (
                      <option key={t.translator_id} value={t.translator_id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button onClick={handleSegment} disabled={loading}>
                {loading ? 'Segmenting...' : 'Segment Text'}
              </Button>
            </Card>

            {segmentation && (
              <Card className="p-6 border-[#C9A962]/30">
                <h3 className="text-xl font-bold text-[#C9A962] mb-4">Segmentation Result</h3>

                {/* Visualization */}
                <div className="mb-6 p-4 bg-[#1A1410]/50 rounded-lg">
                  <div className="text-lg leading-relaxed">
                    {segmentation.segments.map((seg: TokenSegment, i: number) => {
                      let color = '#a855f7'; // Purple (mixed)
                      if (seg.meaning_score > 0.7) color = '#3b82f6'; // Blue (meaning)
                      else if (seg.style_score > 0.7) color = '#ef4444'; // Red (style)

                      return (
                        <span
                          key={i}
                          style={{ color }}
                          title={`Meaning: ${(seg.meaning_score * 100).toFixed(0)}% | Style: ${(
                            seg.style_score * 100
                          ).toFixed(0)}%`}
                          className="cursor-help"
                        >
                          {seg.token}{' '}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }} />
                    <span>Meaning tokens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
                    <span>Style tokens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#a855f7' }} />
                    <span>Mixed</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Translators */}
            <Card className="p-6 border-[#C9A962]/30">
              <h2 className="text-2xl font-bold text-[#C9A962] mb-6">Translators</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {translators.map((t) => (
                  <div
                    key={t.translator_id}
                    className="p-4 bg-[#1A1410]/50 rounded-lg border border-[#C9A962]/10
                             hover:border-[#C9A962]/30 transition-all cursor-pointer"
                    onClick={() => setSelectedTranslator(t.translator_id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-[#C9A962]">{t.name}</div>
                      <Badge variant="ghost" className="text-xs">
                        {t.era}
                      </Badge>
                    </div>
                    <div className="text-sm text-[#F5F3EF]/70">
                      {t.translation_count} translations
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Styles */}
            <Card className="p-6 border-[#C9A962]/30">
              <h2 className="text-2xl font-bold text-[#C9A962] mb-6">Style Centroids</h2>
              <div className="space-y-3">
                {styles.map((s) => (
                  <div
                    key={s.centroid_id}
                    className="p-4 bg-[#1A1410]/50 rounded-lg border border-[#C9A962]/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-[#C9A962]">{s.label}</div>
                      <Badge variant="ghost" className="text-xs">
                        {s.member_count} members
                      </Badge>
                    </div>
                    <div className="text-sm text-[#F5F3EF]/70 mb-3">{s.description}</div>
                    <div className="text-xs text-[#F5F3EF]/50">
                      {s.members.slice(0, 3).map((m) => m.name).join(', ')}
                      {s.members.length > 3 && ` +${s.members.length - 3} more`}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
