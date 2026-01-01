'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Button, Select, LoadingSpinner, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Modal } from '@/components/ui';
import { RadarChart, DonutChart, BarChart } from '@/components/charts';
import { PersonaCard, StyleBlender } from '@/components/personas';
import { TRANSLATOR_PERSONAS, STYLE_PRESETS, getPersonaById, blendStyles, calculateStyleSimilarity, TranslatorPersona } from '@/lib/personas';
import { translate } from '@/lib/api';
import type { TranslationResponse } from '@/lib/types';

// Sample texts for quick testing
const SAMPLE_TEXTS = {
  greek: {
    label: 'Homer (Iliad 1.1-7)',
    text: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε, πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν ἡρώων',
  },
  latin: {
    label: 'Virgil (Aeneid 1.1-3)',
    text: 'Arma virumque cano, Troiae qui primus ab oris Italiam fato profugus Laviniaque venit litora, multum ille et terris iactatus et alto',
  },
  hebrew: {
    label: 'Genesis 1:1-3',
    text: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ. וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ',
  },
};

// LTQI dimensions for radar chart
const LTQI_DIMENSIONS = [
  'Literalness',
  'Poeticness',
  'Formality',
  'Accessibility',
  'Scholarly Precision',
];

export default function TranslatePage() {
  const searchParams = useSearchParams();
  const initialText = searchParams.get('text') || '';

  // State
  const [sourceText, setSourceText] = useState(initialText);
  const [sourceLanguage, setSourceLanguage] = useState('greek');
  const [selectedPersona, setSelectedPersona] = useState<TranslatorPersona | null>(null);
  const [blendedStyle, setBlendedStyle] = useState<TranslatorPersona['style'] | null>(null);
  const [useBlendedStyle, setUseBlendedStyle] = useState(false);

  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [personaFilter, setPersonaFilter] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [viewMode, setViewMode] = useState<'presets' | 'personas' | 'blend'>('presets');

  // Comparison mode
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareResults, setCompareResults] = useState<{ persona: TranslatorPersona; translation: string }[]>([]);

  // Filter personas
  const filteredPersonas = useMemo(() => {
    return TRANSLATOR_PERSONAS.filter((p) => {
      const matchesSearch = !personaFilter ||
        p.name.toLowerCase().includes(personaFilter.toLowerCase()) ||
        p.specialty.some((s) => s.toLowerCase().includes(personaFilter.toLowerCase()));
      const matchesSpecialty = !selectedSpecialty ||
        p.specialty.includes(selectedSpecialty);
      return matchesSearch && matchesSpecialty;
    });
  }, [personaFilter, selectedSpecialty]);

  // Get all unique specialties
  const allSpecialties = useMemo(() => {
    const set = new Set<string>();
    TRANSLATOR_PERSONAS.forEach((p) => p.specialty.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, []);

  // Current style for display
  const currentStyle = useMemo(() => {
    if (useBlendedStyle && blendedStyle) return blendedStyle;
    if (selectedPersona) return selectedPersona.style;
    return null;
  }, [useBlendedStyle, blendedStyle, selectedPersona]);

  // Radar data for current style
  const styleRadarData = useMemo(() => {
    if (!currentStyle) return [];
    return [
      { subject: 'Literal', value: currentStyle.literalness },
      { subject: 'Poetic', value: currentStyle.poeticness },
      { subject: 'Formal', value: currentStyle.formality },
      { subject: 'Accessible', value: currentStyle.accessibility },
      { subject: 'Scholarly', value: currentStyle.scholarlyPrecision },
    ];
  }, [currentStyle]);

  // Handle translation
  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const style = useBlendedStyle && blendedStyle
        ? 'blended'
        : selectedPersona?.id || 'literal';

      const response = await translate({
        source_text: sourceText,
        source_language: sourceLanguage,
        target_style: style,
        persona: selectedPersona?.name || 'literal',
        include_literal: true,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle comparison translation
  const handleCompare = async () => {
    if (!sourceText.trim()) return;

    setLoading(true);
    setCompareResults([]);

    // Select 4 diverse translators
    const comparePersonas = [
      getPersonaById('lattimore'),
      getPersonaById('fagles'),
      getPersonaById('fitzgerald'),
      getPersonaById('pope'),
    ].filter(Boolean) as TranslatorPersona[];

    const results = [];
    for (const persona of comparePersonas) {
      try {
        const response = await translate({
          source_text: sourceText,
          source_language: sourceLanguage,
          target_style: persona.id,
          persona: persona.name,
        });
        results.push({ persona, translation: response.translation });
      } catch {
        // Skip failed translations
      }
    }

    setCompareResults(results);
    setLoading(false);
  };

  // Load sample text
  const loadSample = (lang: keyof typeof SAMPLE_TEXTS) => {
    setSourceText(SAMPLE_TEXTS[lang].text);
    setSourceLanguage(lang);
  };

  // Handle style change from blender
  const handleStyleChange = (style: TranslatorPersona['style']) => {
    setBlendedStyle(style);
    setUseBlendedStyle(true);
  };

  // Select a persona
  const selectPersona = (persona: TranslatorPersona) => {
    setSelectedPersona(persona);
    setUseBlendedStyle(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-[#C9A962]">Translate</span>
              </h1>
              <p className="text-[#F5F3EF]/70">
                AI-powered translation with 38 distinct translator personas
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant={comparisonMode ? 'default' : 'secondary'}
                onClick={() => setComparisonMode(!comparisonMode)}
              >
                {comparisonMode ? 'Single Mode' : 'Compare Styles'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-5">
            <Card padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#C9A962]">Source Text</h2>
                <Select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  options={[
                    { value: 'greek', label: 'Ancient Greek' },
                    { value: 'latin', label: 'Latin' },
                    { value: 'hebrew', label: 'Hebrew' },
                    { value: 'aramaic', label: 'Aramaic' },
                  ]}
                  className="w-40"
                />
              </div>

              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                className="w-full h-48 px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg font-serif text-lg focus:border-[#C9A962] outline-none resize-none"
              />

              {/* Sample texts */}
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-[#F5F3EF]/50">Load sample:</span>
                {Object.entries(SAMPLE_TEXTS).map(([lang, data]) => (
                  <button
                    key={lang}
                    onClick={() => loadSample(lang as keyof typeof SAMPLE_TEXTS)}
                    className="text-sm text-[#C9A962] hover:underline"
                  >
                    {data.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Style Selection */}
            <Card padding="lg" className="mt-6">
              <h2 className="text-lg font-semibold text-[#C9A962] mb-4">Translation Style</h2>

              {/* View mode tabs */}
              <div className="flex gap-2 mb-4">
                {(['presets', 'personas', 'blend'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 text-sm rounded-lg transition ${
                      viewMode === mode
                        ? 'bg-[#C9A962] text-[#0D0D0F]'
                        : 'bg-[#C9A962]/10 hover:bg-[#C9A962]/20'
                    }`}
                  >
                    {mode === 'presets' ? 'Quick Presets' : mode === 'personas' ? 'Translators' : 'Style Blend'}
                  </button>
                ))}
              </div>

              {viewMode === 'presets' && (
                <div className="grid grid-cols-2 gap-3">
                  {STYLE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setBlendedStyle(preset.style);
                        setUseBlendedStyle(true);
                        setSelectedPersona(null);
                      }}
                      className={`p-3 text-left rounded-lg border transition ${
                        useBlendedStyle && !selectedPersona
                          ? 'bg-[#C9A962]/20 border-[#C9A962]'
                          : 'border-[#C9A962]/20 hover:border-[#C9A962]/40'
                      }`}
                    >
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-[#F5F3EF]/50">{preset.description}</div>
                    </button>
                  ))}
                </div>
              )}

              {viewMode === 'personas' && (
                <div>
                  <input
                    type="text"
                    value={personaFilter}
                    onChange={(e) => setPersonaFilter(e.target.value)}
                    placeholder="Search translators..."
                    className="w-full px-3 py-2 mb-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg text-sm focus:border-[#C9A962] outline-none"
                  />
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredPersonas.slice(0, 20).map((persona) => (
                      <button
                        key={persona.id}
                        onClick={() => selectPersona(persona)}
                        className={`w-full p-3 text-left rounded-lg border transition ${
                          selectedPersona?.id === persona.id
                            ? 'bg-[#C9A962]/20 border-[#C9A962]'
                            : 'border-[#C9A962]/20 hover:border-[#C9A962]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{persona.name}</div>
                            <div className="text-xs text-[#F5F3EF]/50">{persona.era}</div>
                          </div>
                          <div className="flex gap-1">
                            {persona.specialty.slice(0, 2).map((spec) => (
                              <Badge key={spec} size="sm">{spec}</Badge>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {viewMode === 'blend' && (
                <StyleBlender
                  onStyleChange={handleStyleChange}
                  onPersonaSelect={(id) => {
                    const p = getPersonaById(id);
                    if (p) selectPersona(p);
                  }}
                />
              )}
            </Card>

            {/* Current Style Radar */}
            {currentStyle && (
              <Card padding="lg" className="mt-6">
                <h3 className="text-sm font-semibold text-[#C9A962] mb-3">
                  {selectedPersona ? selectedPersona.name : 'Blended'} Style Profile
                </h3>
                <div className="h-48">
                  <RadarChart data={styleRadarData} name="Style" />
                </div>
              </Card>
            )}

            {/* Translate Button */}
            <Button
              onClick={comparisonMode ? handleCompare : handleTranslate}
              loading={loading}
              disabled={!sourceText.trim()}
              size="lg"
              className="w-full mt-6"
            >
              {comparisonMode ? 'Compare 4 Styles' : 'Translate'}
            </Button>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-7">
            <Card padding="lg" className="h-full min-h-[600px]">
              <h2 className="text-lg font-semibold text-[#C9A962] mb-4">
                {comparisonMode ? 'Style Comparison' : 'Translation'}
              </h2>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-[#F5F3EF]/50">
                    {comparisonMode ? 'Generating comparisons...' : 'Translating...'}
                  </p>
                </div>
              ) : comparisonMode && compareResults.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {compareResults.map(({ persona, translation }) => (
                    <Card key={persona.id} padding="md" className="bg-[#0D0D0F]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-semibold text-[#C9A962]">{persona.name}</span>
                        <Badge size="sm">{persona.era}</Badge>
                      </div>
                      <p className="font-serif text-sm leading-relaxed text-[#F5F3EF]/80">
                        {translation}
                      </p>
                      <div className="mt-3 h-24">
                        <RadarChart
                          data={[
                            { subject: 'Lit', value: persona.style.literalness },
                            { subject: 'Poet', value: persona.style.poeticness },
                            { subject: 'Form', value: persona.style.formality },
                            { subject: 'Access', value: persona.style.accessibility },
                            { subject: 'Schol', value: persona.style.scholarlyPrecision },
                          ]}
                          name={persona.name}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Selected persona info */}
                  {selectedPersona && (
                    <div className="flex items-center gap-4 pb-4 border-b border-[#C9A962]/20">
                      <div className="w-12 h-12 rounded-full bg-[#C9A962]/20 flex items-center justify-center text-xl">
                        {selectedPersona.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#C9A962]">{selectedPersona.name}</div>
                        <div className="text-sm text-[#F5F3EF]/50">{selectedPersona.era}</div>
                      </div>
                      <div className="flex-1" />
                      <div className="text-right">
                        <div className="text-xs text-[#F5F3EF]/40">Signature</div>
                        <div className="text-sm italic text-[#F5F3EF]/70">"{selectedPersona.signature}"</div>
                      </div>
                    </div>
                  )}

                  {/* Main translation */}
                  <div>
                    <h3 className="text-sm text-[#F5F3EF]/50 mb-2">Translation</h3>
                    <p className="font-serif text-xl leading-relaxed">{result.translation}</p>
                  </div>

                  {/* Literal translation */}
                  {result.literal_translation && (
                    <div className="pt-4 border-t border-[#C9A962]/20">
                      <h3 className="text-sm text-[#F5F3EF]/50 mb-2">Literal Translation</h3>
                      <p className="font-serif text-[#F5F3EF]/60">{result.literal_translation}</p>
                    </div>
                  )}

                  {/* LTQI Score with Radar */}
                  {result.ltqi && (
                    <div className="pt-4 border-t border-[#C9A962]/20">
                      <h3 className="text-sm text-[#F5F3EF]/50 mb-4">
                        LTQI Score (Loeb Translation Quality Index)
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-4xl font-bold text-[#C9A962]">
                                {(result.ltqi.overall * 100).toFixed(0)}
                              </div>
                              <Badge variant="success" className="mt-1">{result.ltqi.grade}</Badge>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#F5F3EF]/50">Semantic Fidelity</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-[#C9A962]/20 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#C9A962] rounded-full"
                                    style={{ width: `${result.ltqi.semantic_fidelity * 100}%` }}
                                  />
                                </div>
                                <span className="w-10 text-right">{(result.ltqi.semantic_fidelity * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#F5F3EF]/50">Stylistic Consistency</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-[#C9A962]/20 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#87CEEB] rounded-full"
                                    style={{ width: `${result.ltqi.stylistic_consistency * 100}%` }}
                                  />
                                </div>
                                <span className="w-10 text-right">{(result.ltqi.stylistic_consistency * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#F5F3EF]/50">Fluency</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-[#C9A962]/20 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#98D8C8] rounded-full"
                                    style={{ width: `${result.ltqi.fluency * 100}%` }}
                                  />
                                </div>
                                <span className="w-10 text-right">{(result.ltqi.fluency * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="h-40">
                          <RadarChart
                            data={[
                              { subject: 'Semantic', value: result.ltqi.semantic_fidelity },
                              { subject: 'Style', value: result.ltqi.stylistic_consistency },
                              { subject: 'Fluency', value: result.ltqi.fluency },
                              { subject: 'Overall', value: result.ltqi.overall },
                              { subject: 'Register', value: 0.85 },
                            ]}
                            name="LTQI"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Vibe */}
                  {result.vibe && (
                    <div className="pt-4 border-t border-[#C9A962]/20">
                      <h3 className="text-sm text-[#F5F3EF]/50 mb-2">Translation Character</h3>
                      <p className="text-[#F5F3EF]/70">
                        <span className="text-[#C9A962]">{result.vibe.feeling}</span>
                        {' '}&mdash; Reads like {result.vibe.reads_like}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="secondary"
                      onClick={() => navigator.clipboard.writeText(result.translation)}
                      className="flex-1"
                    >
                      Copy Translation
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setComparisonMode(true)}
                    >
                      Compare Styles
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-6xl mb-4">🌐</div>
                  <h3 className="text-xl text-[#C9A962] mb-2">Ready to Translate</h3>
                  <p className="text-[#F5F3EF]/50 max-w-sm">
                    Enter ancient Greek, Latin, or Hebrew text and select your preferred
                    translation style from 38 historical translator personas.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Featured Translators */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#C9A962] mb-2">Featured Translators</h2>
          <p className="text-[#F5F3EF]/50 mb-6">
            Select a translator to see their unique style applied to your text
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TRANSLATOR_PERSONAS.slice(0, 8).map((persona) => (
              <PersonaCard
                key={persona.id}
                persona={persona}
                selected={selectedPersona?.id === persona.id}
                compact
                onClick={() => selectPersona(persona)}
              />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={() => setShowPersonaModal(true)}>
              View All 38 Translators
            </Button>
          </div>
        </div>

        {/* Style Arithmetic Example */}
        <div className="mt-12 p-6 bg-[#C9A962]/5 rounded-xl border border-[#C9A962]/20">
          <h3 className="text-lg font-semibold text-[#C9A962] mb-4">Style Vector Arithmetic</h3>
          <p className="text-[#F5F3EF]/70 mb-4">
            Blend translator styles using our unique style blending algorithm.
            Try combinations like:
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge className="text-base px-4 py-2">70% Fagles + 30% Lattimore = Dramatic yet faithful</Badge>
            <Badge className="text-base px-4 py-2">50% Pope + 50% Dryden = Classical English verse</Badge>
            <Badge className="text-base px-4 py-2">60% FitzGerald + 40% Academic = Lyrical precision</Badge>
          </div>
        </div>
      </div>

      {/* All Translators Modal */}
      <Modal
        isOpen={showPersonaModal}
        onClose={() => setShowPersonaModal(false)}
        title="All Translator Personas"
        size="xl"
      >
        <div className="mb-4">
          <input
            type="text"
            value={personaFilter}
            onChange={(e) => setPersonaFilter(e.target.value)}
            placeholder="Search translators..."
            className="w-full px-3 py-2 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg focus:border-[#C9A962] outline-none"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
          {filteredPersonas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              selected={selectedPersona?.id === persona.id}
              compact
              onClick={() => {
                selectPersona(persona);
                setShowPersonaModal(false);
              }}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}
