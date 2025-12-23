'use client';
import React, { useState } from 'react';

const API_URL = 'https://logos-production-ef2b.up.railway.app';

interface Translation {
  style: 'literal' | 'literary' | 'student';
  text: string;
  quality: number;
  highlights: { start: number; end: number; reason: string }[];
}

interface ComparisonData {
  original: string;
  translations: Translation[];
  semantiaEvidence?: string;
}

const TranslationComparison = () => {
  const [originalText, setOriginalText] = useState('μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος');
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState<string | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);

  // Demo data for Iliad 1.1
  const demoData: ComparisonData = {
    original: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
    translations: [
      {
        style: 'literal',
        text: 'Wrath sing, goddess, of Peleus-son Achilles',
        quality: 85,
        highlights: [
          { start: 0, end: 5, reason: 'Direct cognate translation' },
          { start: 35, end: 43, reason: 'Patronymic preserved' }
        ]
      },
      {
        style: 'literary',
        text: 'Sing, goddess, of Achilles\' rage, Peleus\' son',
        quality: 92,
        highlights: [
          { start: 23, end: 27, reason: 'Modern equivalent for μῆνιν' },
          { start: 29, end: 41, reason: 'Natural English word order' }
        ]
      },
      {
        style: 'student',
        text: 'Goddess, sing about the anger of Achilles, son of Peleus',
        quality: 78,
        highlights: [
          { start: 0, end: 7, reason: 'Vocative placement varies' },
          { start: 23, end: 28, reason: 'Simplified vocabulary choice' }
        ]
      }
    ],
    semantiaEvidence: 'SEMANTIA Analysis: μῆνιν (mēnin) represents divine wrath distinct from ordinary anger (ὀργή). Epic tradition emphasizes cosmic significance. Literary translation captures this nuance best through "rage" which implies sustained, destructive anger appropriate to heroic context.'
  };

  const handleTranslate = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API integration
      setTimeout(() => {
        setComparisonData(demoData);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Translation failed:', error);
      setLoading(false);
    }
  };

  const handleChallenge = (style: string) => {
    setSelectedTranslation(style);
    setShowEvidence(true);
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const renderHighlightedText = (text: string, highlights: { start: number; end: number; reason: string }[]) => {
    if (!highlights.length) return text;

    let result = [];
    let lastIndex = 0;

    highlights.forEach((highlight, i) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        result.push(text.slice(lastIndex, highlight.start));
      }
      
      // Add highlighted text
      result.push(
        <span
          key={i}
          className="bg-blue-600/30 border-b border-blue-400 cursor-help"
          title={highlight.reason}
        >
          {text.slice(highlight.start, highlight.end)}
        </span>
      );
      
      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Translation Comparison
        </h1>

        {/* Input Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            Original Greek/Latin Text
          </label>
          <div className="flex gap-4">
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Enter Greek or Latin text..."
            />
            <button
              onClick={handleTranslate}
              disabled={loading || !originalText.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              {loading ? 'Translating...' : 'Compare'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <p className="mt-4 text-gray-400">Generating translations...</p>
          </div>
        )}

        {/* Comparison Results */}
        {comparisonData && !loading && (
          <div className="space-y-8">
            {/* Original Text Display */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Original Text</h2>
              <p className="text-2xl font-serif text-blue-200 leading-relaxed">
                {comparisonData.original}
              </p>
            </div>

            {/* Translation Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {comparisonData.translations.map((translation, index) => (
                <div key={translation.style} className="bg-gray-800 rounded-lg p-6 relative">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold capitalize">
                      {translation.style}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getQualityColor(translation.quality)}`}>
                        {translation.quality}%
                      </span>
                      <div className="w-12 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            translation.quality >= 90 ? 'bg-green-400' :
                            translation.quality >= 80 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${translation.quality}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg leading-relaxed mb-4 min-h-[4rem]">
                    {renderHighlightedText(translation.text, translation.highlights)}
                  </p>
                  
                  <button
                    onClick={() => handleChallenge(translation.style)}
                    className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors text-sm"
                  >
                    Challenge Translation
                  </button>
                  
                  {translation.highlights.length > 0 && (
                    <div className="mt-4 text-xs text-gray-400">
                      {translation.highlights.length} highlighted feature{translation.highlights.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Key Differences */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Key Differences</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-300 mb-2">Word Choice</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• "Wrath" vs "Rage" vs "Anger" for μῆνιν</li>
                    <li>• Direct vs natural word order</li>
                    <li>• Patronymic handling varies</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-300 mb-2">Style Approach</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Literal preserves Greek syntax</li>
                    <li>• Literary prioritizes English flow</li>
                    <li>• Student aims for clarity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEMANTIA Evidence Modal */}
        {showEvidence && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">SEMANTIA Evidence</h2>
                  <button
                    onClick={() => setShowEvidence(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-purple-600 rounded-full text-sm font-medium">
                    Challenging: {selectedTranslation}
                  </span>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    {comparisonData?.semantiaEvidence}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEvidence(false)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
                  >
                    Accept Evidence
                  </button>
                  <button
                    onClick={() => setShowEvidence(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium"
                  >
                    Request More Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationComparison;