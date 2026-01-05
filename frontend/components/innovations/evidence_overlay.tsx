'use client';

/**
 * LOGOS Evidence Overlay
 * Phase 9: WOW features - Show provenance and evidence trails for translations
 *
 * Displays translation provenance, source evidence, and confidence scores
 * as an overlay panel.
 */

import React, { useState, useEffect, useCallback } from 'react';

interface ProvenanceItem {
  type: string;
  source?: string;
  confidence?: number;
  details?: Record<string, any>;
  contributors?: number;
  choices?: Record<string, string>;
  count?: number;
}

interface TranslationVariant {
  style: string;
  text: string;
  fidelityScore: number | null;
}

interface SourceReference {
  type: string;
  title: string;
  author: string | null;
  year: string | null;
  location: string | null;
}

interface CitationBundle {
  urn: string;
  sourceLanguage: string;
  sourceText: string;
  author: string | null;
  work: string | null;
  section: string | null;
  translations: TranslationVariant[];
  sources: SourceReference[];
  citations: Record<string, string>;
  provenance: ProvenanceItem[];
  generatedAt: string;
}

interface EvidenceOverlayProps {
  urn: string;
  onClose?: () => void;
  isOpen: boolean;
}

const STYLE_DESCRIPTIONS: Record<string, string> = {
  scholarly: 'Technical, preserves original structure',
  literary: 'Natural, flowing prose',
  accessible: 'Simple vocabulary',
  literal: 'Word-for-word',
  neutral: 'Consensus baseline'
};

const CITATION_LABELS: Record<string, string> = {
  chicago: 'Chicago',
  mla: 'MLA',
  apa: 'APA',
  turabian: 'Turabian'
};

export default function EvidenceOverlay({ urn, onClose, isOpen }: EvidenceOverlayProps) {
  const [bundle, setBundle] = useState<CitationBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('scholarly');
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);

  const fetchBundle = useCallback(async () => {
    if (!urn) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/translation/citation_bundle/${encodeURIComponent(urn)}`);
      if (!res.ok) {
        throw new Error(`Failed to load: ${res.statusText}`);
      }
      const data = await res.json();
      setBundle(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load citation bundle');
    } finally {
      setLoading(false);
    }
  }, [urn]);

  useEffect(() => {
    if (isOpen && urn) {
      fetchBundle();
    }
  }, [isOpen, urn, fetchBundle]);

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitation(format);
    setTimeout(() => setCopiedCitation(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Evidence Trail</h2>
            <p className="text-sm text-gray-500 truncate max-w-md">{urn}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          {bundle && !loading && (
            <div className="space-y-8">
              {/* Source Text */}
              <section>
                <h3 className="text-lg font-semibold mb-3">Source Text</h3>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded text-xs font-medium">
                      {bundle.sourceLanguage}
                    </span>
                    {bundle.author && (
                      <span className="text-sm text-gray-600">{bundle.author}</span>
                    )}
                  </div>
                  <p className="text-gray-800 italic">{bundle.sourceText || 'No source text available'}</p>
                </div>
              </section>

              {/* Translation Variants */}
              {bundle.translations.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold mb-3">Translation Variants</h3>
                  <div className="flex gap-2 mb-4">
                    {bundle.translations.map((t) => (
                      <button
                        key={t.style}
                        onClick={() => setSelectedStyle(t.style)}
                        className={`px-3 py-1 rounded text-sm ${
                          selectedStyle === t.style
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t.style}
                      </button>
                    ))}
                  </div>
                  {bundle.translations.filter(t => t.style === selectedStyle).map((t) => (
                    <div key={t.style} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs text-gray-500">{STYLE_DESCRIPTIONS[t.style]}</p>
                        {t.fidelityScore !== null && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                            Fidelity: {(t.fidelityScore * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <p className="text-gray-800">{t.text}</p>
                    </div>
                  ))}
                </section>
              )}

              {/* Provenance */}
              <section>
                <h3 className="text-lg font-semibold mb-3">Provenance</h3>
                <div className="space-y-3">
                  {bundle.provenance.map((p, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{p.type.replace(/_/g, ' ')}</p>
                        {p.contributors && (
                          <p className="text-sm text-gray-600">Contributors: {p.contributors}</p>
                        )}
                        {p.confidence !== undefined && (
                          <p className="text-sm text-gray-600">
                            Confidence: {(p.confidence * 100).toFixed(0)}%
                          </p>
                        )}
                        {p.count !== undefined && (
                          <p className="text-sm text-gray-600">Count: {p.count}</p>
                        )}
                        {p.choices && (
                          <div className="mt-1">
                            {Object.entries(p.choices).map(([k, v]) => (
                              <span key={k} className="mr-2 px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                                {k} = {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Citations */}
              <section>
                <h3 className="text-lg font-semibold mb-3">Citation Formats</h3>
                <div className="space-y-2">
                  {Object.entries(bundle.citations).map(([format, citation]) => (
                    <div key={format} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div>
                        <span className="text-xs font-medium text-gray-500">
                          {CITATION_LABELS[format] || format}
                        </span>
                        <p className="text-sm text-gray-800">{citation}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(citation, format)}
                        className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100"
                      >
                        {copiedCitation === format ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sources */}
              {bundle.sources.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold mb-3">Sources</h3>
                  <div className="space-y-2">
                    {bundle.sources.map((s, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">{s.title}</p>
                        {s.author && <p className="text-sm text-gray-600">{s.author}</p>}
                        {s.location && <p className="text-sm text-gray-500">{s.location}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Footer */}
              <div className="text-xs text-gray-400 text-center pt-4 border-t">
                Generated {new Date(bundle.generatedAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
