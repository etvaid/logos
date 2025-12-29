'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface TranslationWord {
  word: string;
  translation: string;
  confidence: number;
  alternatives: Array<{
    text: string;
    confidence: number;
    context?: string;
  }>;
  morphology?: {
    lemma: string;
    pos: string;
    case?: string;
    number?: string;
    gender?: string;
  };
}

interface TranslationResult {
  originalText: string;
  translatedText: string;
  language: 'greek' | 'latin';
  style: 'literal' | 'literary' | 'student' | 'scholarly';
  words: TranslationWord[];
  confidence: number;
  processingTime: number;
}

interface BulkTranslationItem {
  id: string;
  text: string;
  result?: TranslationResult;
  loading: boolean;
  error?: string;
}

export default function TranslatePage() {
  const [sourceText, setSourceText] = useState('');
  const [language, setLanguage] = useState<'greek' | 'latin'>('latin');
  const [style, setStyle] = useState<'literal' | 'literary' | 'student' | 'scholarly'>('literal');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<TranslationWord | null>(null);
  const [showWordDetails, setShowWordDetails] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkItems, setBulkItems] = useState<BulkTranslationItem[]>([]);
  const [bulkInput, setBulkInput] = useState('');

  const translateText = useCallback(async (text: string, lang: 'greek' | 'latin', translationStyle: 'literal' | 'literary' | 'student' | 'scholarly') => {
    const response = await fetch('http://localhost:8000/translate/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text.trim(),
        source_language: lang,
        target_language: 'english',
        style: translationStyle,
        include_morphology: true,
        include_alternatives: true
      })
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    return await response.json() as TranslationResult;
  }, []);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const translationResult = await translateText(sourceText, language, style);
      setResult(translationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWordClick = (word: TranslationWord) => {
    setSelectedWord(word);
    setShowWordDetails(true);
  };

  const addToBulk = () => {
    if (!bulkInput.trim()) return;
    
    const sentences = bulkInput.split('\n').filter(line => line.trim()).map(line => ({
      id: Date.now() + Math.random().toString(),
      text: line.trim(),
      loading: false
    }));
    
    setBulkItems(prev => [...prev, ...sentences]);
    setBulkInput('');
  };

  const translateBulkItem = async (id: string) => {
    setBulkItems(prev => prev.map(item => 
      item.id === id ? { ...item, loading: true, error: undefined } : item
    ));
    
    try {
      const item = bulkItems.find(i => i.id === id);
      if (!item) return;
      
      const result = await translateText(item.text, language, style);
      setBulkItems(prev => prev.map(i => 
        i.id === id ? { ...i, result, loading: false } : i
      ));
    } catch (err) {
      setBulkItems(prev => prev.map(i => 
        i.id === id ? { ...i, loading: false, error: err instanceof Error ? err.message : 'Translation failed' } : i
      ));
    }
  };

  const removeBulkItem = (id: string) => {
    setBulkItems(prev => prev.filter(item => item.id !== id));
  };

  const getLanguageColor = (lang: 'greek' | 'latin') => {
    return lang === 'greek' ? 'text-[#5BA4E8]' : 'text-[#E85B5B]';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-[#C9A962]';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 bg-[#0D0D0F]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/reader" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Reader</Link>
                <Link href="/semantia" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">SEMANTIA</Link>
                <Link href="/translate" className="text-[#C9A962] font-semibold">Translate</Link>
                <Link href="/learn" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Learn</Link>
                <Link href="/discovery" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Discovery</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#C9A962] mb-4 font-serif">Translate</h1>
          <p className="text-lg text-[#F5F3EF]/70 max-w-2xl mx-auto">Advanced translation tools with contextual analysis and morphological insights</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-1">
            <button
              onClick={() => setBulkMode(false)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                !bulkMode 
                  ? 'bg-[#C9A962] text-[#0D0D0F]' 
                  : 'text-[#F5F3EF]/70 hover:text-[#F5F3EF]'
              }`}
            >
              Single Translation
            </button>
            <button
              onClick={() => setBulkMode(true)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                bulkMode 
                  ? 'bg-[#C9A962] text-[#0D0D0F]' 
                  : 'text-[#F5F3EF]/70 hover:text-[#F5F3EF]'
              }`}
            >
              Bulk Translation
            </button>
          </div>
        </div>

        {!bulkMode ? (
          /* Single Translation Mode */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Source Text</h2>
              
              {/* Language and Style Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[#F5F3EF]/70 text-sm mb-2">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'greek' | 'latin')}
                    className="w-full px-3 py-2 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]/40"
                  >
                    <option value="latin">Latin</option>
                    <option value="greek">Greek</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#F5F3EF]/70 text-sm mb-2">Translation Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as 'literal' | 'literary' | 'student' | 'scholarly')}
                    className="w-full px-3 py-2 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]/40"
                  >
                    <option value="literal">Literal</option>
                    <option value="literary">Literary</option>
                    <option value="student">Student</option>
                    <option value="scholarly">Scholarly</option>
                  </select>
                </div>
              </div>

              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder={`Enter ${language === 'greek' ? 'Greek' : 'Latin'} text here...`}
                className={`w-full h-40 px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg ${getLanguageColor(language)} placeholder-[#F5F3EF]/50 focus:outline-none focus:border-[#C9A962]/40 font-serif resize-none`}
              />

              <button
                onClick={handleTranslate}
                disabled={loading || !sourceText.trim()}
                className="w-full mt-4 px-6 py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Translating...' : 'Translate'}
              </button>
            </div>

            {/* Results Panel */}
            <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Translation</h2>
              
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-[#C9A962]/20 border-t-[#C9A962] rounded-full mx-auto mb-4"></div>
                  <p className="text-[#F5F3EF]/70">Processing translation...</p>
                </div>
              )}

              {error && (
                <div className="bg-[#E85B5B]/10 border border-[#E85B5B]/20 rounded-lg p-4">
                  <p className="text-[#E85B5B]">{error}</p>
                </div>
              )}

              {result && (
                <div>
                  {/* Translation Stats */}
                  <div className="mb-4 p-3 bg-[#0D0D0F]/50 rounded-lg border border-[#C9A962]/10">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#F5F3EF]/70">Confidence: <span className={getConfidenceColor(result.confidence)}>{(result.confidence * 100).toFixed(1)}%</span></span>
                      <span className="text-[#F5F3EF]/70">Style: <span className="text-[#C9A962]">{result.style}</span></span>
                      <span className="text-[#F5F3EF]/70">Time: <span className="text-[#C9A962]">{result.processingTime}ms</span></span>
                    </div>
                  </div>

                  {/* Interactive Translation */}
                  <div className="mb-4">
                    <h3 className="text-[#F5F3