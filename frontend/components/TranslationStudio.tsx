'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StyleOption {
  id: string;
  name: string;
  description: string;
}

interface StyleMix {
  style: string;
  weight: number;
}

interface TranslationResult {
  text: string;
  style: string;
  fidelity: number;
  confidence: number;
  style_description: string;
}

export default function TranslationStudio({ urn }: { urn: string }) {
  const [mode, setMode] = useState<'single' | 'mixed' | 'custom'>('single');
  const [selectedStyle, setSelectedStyle] = useState('scholarly');
  const [styleMixes, setStyleMixes] = useState<StyleMix[]>([
    { style: 'scholarly', weight: 0.6 },
    { style: 'literary', weight: 0.4 }
  ]);
  const [customDescription, setCustomDescription] = useState('');
  const [customName, setCustomName] = useState('');
  const [translations, setTranslations] = useState<Record<string, TranslationResult>>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('scholarly');
  const [styles, setStyles] = useState<StyleOption[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load available styles
  useEffect(() => {
    fetch('/api/translate/styles')
      .then(res => res.json())
      .then(data => {
        if (data.base_styles) {
          setStyles(data.base_styles);
        }
      })
      .catch(console.error);
  }, []);

  // Auto-load all 5 base styles on mount
  useEffect(() => {
    if (urn) {
      loadAllBaseStyles();
    }
  }, [urn]);

  const loadAllBaseStyles = async () => {
    const styleIds = ['scholarly', 'literary', 'accessible', 'literal', 'kjv_archaic'];
    const results: Record<string, TranslationResult> = {};

    for (const styleId of styleIds) {
      try {
        const res = await fetch(`/api/translate?urn=${urn}&style=${styleId}`);
        if (res.ok) {
          results[styleId] = await res.json();
        }
      } catch (error) {
        console.error(`Failed to load ${styleId}:`, error);
      }
    }

    setTranslations(results);
  };

  const translateSingle = async (styleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/translate?urn=${urn}&style=${styleId}`);
      if (res.ok) {
        const result = await res.json();
        setTranslations(prev => ({ ...prev, [styleId]: result }));
        setActiveTab(styleId);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setError('Unable to connect to translation service');
    } finally {
      setLoading(false);
    }
  };

  const translateMixed = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/translate/mixed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urn, styles: styleMixes })
      });
      if (res.ok) {
        const result = await res.json();
        setTranslations(prev => ({ ...prev, mixed: result }));
        setActiveTab('mixed');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Mixed translation failed');
      }
    } catch (error) {
      console.error('Mixed translation error:', error);
      setError('Unable to create mixed translation');
    } finally {
      setLoading(false);
    }
  };

  const translateCustom = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/translate/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urn,
          description: customDescription,
          name: customName || undefined,
          save: true
        })
      });
      if (res.ok) {
        const result = await res.json();
        setTranslations(prev => ({ ...prev, custom: result }));
        setActiveTab('custom');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Custom translation failed');
      }
    } catch (error) {
      console.error('Custom translation error:', error);
      setError('Unable to generate custom translation');
    } finally {
      setLoading(false);
    }
  };

  const updateStyleMix = (index: number, field: 'style' | 'weight', value: string | number) => {
    const updated = [...styleMixes];
    if (field === 'style') {
      updated[index].style = value as string;
    } else {
      updated[index].weight = typeof value === 'number' ? value : parseFloat(value as string);
    }
    setStyleMixes(updated);
  };

  const addStyleMix = () => {
    setStyleMixes([...styleMixes, { style: 'scholarly', weight: 0.5 }]);
  };

  const removeStyleMix = (index: number) => {
    setStyleMixes(styleMixes.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            Translation Studio
          </h1>
          <p className="text-xl text-gray-300">
            Infinite translation possibilities. Mix styles, create custom translations, compare side-by-side.
          </p>
          <p className="text-sm text-gray-400 mt-2">URN: {urn}</p>
        </motion.div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { id: 'single', label: 'Single Style', icon: '📖' },
            { id: 'mixed', label: 'Mix & Match', icon: '🎨' },
            { id: 'custom', label: 'Custom AI', icon: '✨' }
          ].map((m) => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode(m.id as any)}
              className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
                mode === m.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              <span className="mr-2">{m.icon}</span>
              {m.label}
            </motion.button>
          ))}
        </div>

        {/* Control Panel */}
        <motion.div
          layout
          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-purple-500/30"
        >
          <AnimatePresence mode="wait">
            {mode === 'single' && (
              <motion.div
                key="single"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Choose Translation Style</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {styles.map((style) => (
                    <motion.button
                      key={style.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedStyle(style.id);
                        translateSingle(style.id);
                      }}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        selectedStyle === style.id
                          ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/50'
                          : 'bg-slate-700 border-slate-600 hover:border-purple-400'
                      }`}
                    >
                      <div className="text-2xl mb-2">
                        {style.id === 'scholarly' && '🎓'}
                        {style.id === 'literary' && '✍️'}
                        {style.id === 'accessible' && '💬'}
                        {style.id === 'literal' && '📏'}
                        {style.id === 'kjv_archaic' && '📜'}
                      </div>
                      <div className="text-white font-bold mb-2">{style.name}</div>
                      <div className="text-sm text-gray-300">{style.description.substring(0, 60)}...</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {mode === 'mixed' && (
              <motion.div
                key="mixed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Mix Translation Styles</h2>
                <div className="space-y-4 mb-6">
                  {styleMixes.map((mix, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <select
                        value={mix.style}
                        onChange={(e) => updateStyleMix(idx, 'style', e.target.value)}
                        className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600"
                      >
                        {styles.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={mix.weight}
                        onChange={(e) => updateStyleMix(idx, 'weight', parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-white font-mono w-16">{Math.round(mix.weight * 100)}%</span>
                      {styleMixes.length > 1 && (
                        <button
                          onClick={() => removeStyleMix(idx)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={addStyleMix}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    + Add Style
                  </button>
                  <button
                    onClick={translateMixed}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold disabled:opacity-50"
                  >
                    {loading ? 'Mixing...' : '🎨 Generate Mixed Translation'}
                  </button>
                </div>
              </motion.div>
            )}

            {mode === 'custom' && (
              <motion.div
                key="custom"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Create Custom Translation Style</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Style Name (optional)</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g., My Victorian Style"
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Describe Your Desired Style</label>
                    <textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="e.g., Modern and simple with short sentences, casual tone, no archaic words..."
                      rows={4}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-400 outline-none"
                    />
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">💡 <strong>Tips:</strong> Mention these keywords for best results:</p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• <strong>Formality:</strong> formal, casual, modern, archaic, elevated</li>
                      <li>• <strong>Clarity:</strong> simple, clear, easy, complex, flowing</li>
                      <li>• <strong>Style:</strong> dramatic, poetic, concise, em dash, short sentences</li>
                      <li>• <strong>Pronouns:</strong> thou, modern pronouns</li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={translateCustom}
                  disabled={loading || !customDescription}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white rounded-lg font-bold text-lg disabled:opacity-50 w-full"
                >
                  {loading ? 'Generating...' : '✨ Generate Custom Translation'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-red-500/20 border border-red-500/50 rounded-xl p-6"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-2">Translation Error</h3>
                <p className="text-red-200">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Comparison Toggle */}
        {Object.keys(translations).length > 1 && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold"
            >
              {showComparison ? '📖 Single View' : '⚖️ Compare All Translations'}
            </button>
          </div>
        )}

        {/* Translation Display */}
        {showComparison ? (
          // Comparison View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(translations).map(([key, result]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white capitalize">{key.replace('_', ' ')}</h3>
                  <span className="text-sm bg-purple-600 px-3 py-1 rounded-full text-white">
                    {Math.round(result.fidelity * 100)}% fidelity
                  </span>
                </div>
                <p className="text-gray-200 leading-relaxed text-lg mb-4">{result.text}</p>
                <p className="text-sm text-gray-400 italic">{result.style_description}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          // Tab View
          <AnimatePresence mode="wait">
            {translations[activeTab] && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-10 border border-purple-500/30"
              >
                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto">
                  {Object.keys(translations).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                        activeTab === key
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {key.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Translation Content */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full text-white font-semibold">
                      {Math.round(translations[activeTab].fidelity * 100)}% Fidelity
                    </span>
                    <span className="text-sm bg-gradient-to-r from-green-600 to-teal-600 px-4 py-2 rounded-full text-white font-semibold">
                      {Math.round(translations[activeTab].confidence * 100)}% Confidence
                    </span>
                  </div>
                  <p className="text-gray-200 leading-relaxed text-2xl font-serif mb-6">
                    {translations[activeTab].text}
                  </p>
                  <p className="text-gray-400 italic text-sm">
                    {translations[activeTab].style_description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-8 text-center">
              <div className="animate-spin text-6xl mb-4">⚡</div>
              <p className="text-white text-xl font-semibold">Translating...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
