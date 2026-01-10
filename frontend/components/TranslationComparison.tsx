'use client';

import React, { useState, useEffect } from 'react';

interface Translation {
  text: string;
  source: string;
  fidelity?: number;
  unique_words?: string[];
}

interface TranslationComparisonProps {
  urn: string;
}

export default function TranslationComparison({ urn }: TranslationComparisonProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState<string>('scholarly');
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    fetch(`/api/translate/compare?urn=${encodeURIComponent(urn)}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load translations:', err);
        setLoading(false);
      });
  }, [urn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8 text-gray-500">
        No translation data available
      </div>
    );
  }

  const styles = ['scholarly', 'accessible', 'literary', 'literal'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Translation Comparison</h2>
        <div className="text-sm text-gray-600">
          URN: {urn}
        </div>
      </div>

      {/* Source Text */}
      {data.source && (
        <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="text-xs font-semibold text-amber-800 mb-2">
            Original ({data.source.language})
          </div>
          <div className="text-lg font-serif" dir="auto">
            {data.source.text}
          </div>
        </div>
      )}

      {/* Translation Styles Tabs */}
      {data.styled_translations?.variants.length > 0 && (
        <div>
          <div className="flex gap-2 mb-4 border-b">
            {styles.map(style => {
              const variant = data.styled_translations.variants.find((v: any) => v.style === style);
              return (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 font-medium capitalize transition-colors ${
                    selectedStyle === style
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  disabled={!variant}
                >
                  {style}
                  {variant && (
                    <span className="ml-2 text-xs">
                      ({(variant.fidelity * 100).toFixed(0)}%)
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Translation */}
          {data.styled_translations.variants.map((variant: any) => {
            if (variant.style !== selectedStyle) return null;

            return (
              <div key={variant.style} className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm font-semibold text-blue-800 capitalize">
                    {variant.style} Translation
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-700">
                      Fidelity: {(variant.fidelity * 100).toFixed(1)}%
                    </span>
                    <button
                      onClick={() => setShowDiff(!showDiff)}
                      className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded hover:bg-blue-300"
                    >
                      {showDiff ? 'Hide' : 'Show'} Unique Words
                    </button>
                  </div>
                </div>

                <div className="text-base leading-relaxed">
                  {variant.text}
                </div>

                {showDiff && variant.unique_words && variant.unique_words.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-300">
                    <div className="text-xs font-semibold text-blue-700 mb-2">
                      Unique vocabulary in this translation:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {variant.unique_words.map((word: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Consensus Translation */}
      {data.consensus && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Consensus Translation</h3>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-green-800">
                Based on {data.consensus.variants?.length || 0} sources
              </span>
              <span className="text-xs text-green-700">
                Confidence: {(data.consensus.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="text-base leading-relaxed">
              {data.consensus.text}
            </div>
          </div>
        </div>
      )}

      {/* Direct Translations */}
      {data.direct_translations?.translations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Available Translations ({data.direct_translations.count})
          </h3>
          <div className="space-y-3">
            {data.direct_translations.translations.slice(0, 3).map((trans: any, idx: number) => (
              <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200">
                <div className="text-sm text-gray-700">
                  {trans.text}
                </div>
                {trans.created_at && (
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(trans.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis */}
      {data.analysis && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Translation Analysis</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {data.analysis.total_translations}
              </div>
              <div className="text-xs text-gray-600">Total Translations</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-green-600">
                {data.analysis.common_words?.length || 0}
              </div>
              <div className="text-xs text-gray-600">Common Words</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {data.analysis.avg_length || 0}
              </div>
              <div className="text-xs text-gray-600">Avg Length (chars)</div>
            </div>
          </div>

          {data.analysis.common_words && data.analysis.common_words.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Most common words across all translations:
              </div>
              <div className="flex flex-wrap gap-1">
                {data.analysis.common_words.slice(0, 20).map((word: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
