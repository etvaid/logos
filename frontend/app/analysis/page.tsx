'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, Button, Input, Select, Badge, LoadingSpinner, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { RadarChart, DonutChart, BarChart, LineChart } from '@/components/charts';
import { cleanWord, detectLanguage, formatNumber } from '@/lib/utils';

// Morphological data
const GREEK_PARTS_OF_SPEECH = [
  'noun', 'verb', 'adjective', 'adverb', 'article', 'pronoun',
  'preposition', 'conjunction', 'particle', 'interjection'
];

const GREEK_CASES = ['nominative', 'genitive', 'dative', 'accusative', 'vocative'];
const GREEK_NUMBERS = ['singular', 'dual', 'plural'];
const GREEK_GENDERS = ['masculine', 'feminine', 'neuter'];

// Sample POS distribution for text analysis
const samplePOSDistribution = [
  { name: 'Noun', value: 28, color: '#87CEEB' },
  { name: 'Verb', value: 22, color: '#98D8C8' },
  { name: 'Adjective', value: 15, color: '#DDA0DD' },
  { name: 'Preposition', value: 12, color: '#F7DC6F' },
  { name: 'Article', value: 10, color: '#F1948A' },
  { name: 'Pronoun', value: 8, color: '#BB8FCE' },
  { name: 'Other', value: 5, color: '#85C1E9' },
];

// Stylometric features for radar
const stylometricFeatures = [
  { subject: 'Vocabulary Richness', value: 0.78 },
  { subject: 'Sentence Length', value: 0.65 },
  { subject: 'Particle Frequency', value: 0.82 },
  { subject: 'Subordination', value: 0.71 },
  { subject: 'Hapax Ratio', value: 0.58 },
];

// Sample word frequency data
const sampleWordFrequency = [
  { name: 'καί', value: 245, color: '#87CEEB' },
  { name: 'ὁ', value: 198, color: '#87CEEB' },
  { name: 'δέ', value: 156, color: '#87CEEB' },
  { name: 'τε', value: 134, color: '#87CEEB' },
  { name: 'γάρ', value: 98, color: '#87CEEB' },
  { name: 'μέν', value: 87, color: '#87CEEB' },
  { name: 'τις', value: 76, color: '#87CEEB' },
  { name: 'αὐτός', value: 65, color: '#87CEEB' },
];

// Sentence length distribution
const sentenceLengthData = [
  { name: '1-5', value: 12 },
  { name: '6-10', value: 28 },
  { name: '11-15', value: 35 },
  { name: '16-20', value: 22 },
  { name: '21-25', value: 15 },
  { name: '26-30', value: 8 },
  { name: '31+', value: 5 },
];

// Sample analysis result
const SAMPLE_ANALYSIS = {
  word: 'λόγος',
  language: 'Greek',
  lemma: 'λόγος',
  partOfSpeech: 'noun',
  morphology: {
    case: 'nominative',
    number: 'singular',
    gender: 'masculine',
  },
  meanings: [
    'word, speech, discourse',
    'reason, reasoning, logic',
    'account, explanation',
    'ratio, proportion (mathematical)',
    'divine reason, logos (philosophical)',
  ],
  etymology: 'From Proto-Indo-European *leǵ- ("to gather, collect"). Related to λέγω (légō, "to say, speak").',
  frequency: 15420,
  cognates: [
    { word: 'logic', language: 'English' },
    { word: 'logos', language: 'Latin' },
    { word: '-logy', language: 'English suffix' },
  ],
  declinedForms: [
    { form: 'λόγος', case: 'Nom. Sg.' },
    { form: 'λόγου', case: 'Gen. Sg.' },
    { form: 'λόγῳ', case: 'Dat. Sg.' },
    { form: 'λόγον', case: 'Acc. Sg.' },
    { form: 'λόγοι', case: 'Nom. Pl.' },
    { form: 'λόγων', case: 'Gen. Pl.' },
    { form: 'λόγοις', case: 'Dat. Pl.' },
    { form: 'λόγους', case: 'Acc. Pl.' },
  ],
};

// Meter patterns
const METERS = {
  hexameter: {
    name: 'Dactylic Hexameter',
    description: 'Epic meter: — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ×',
    examples: ['Homer', 'Virgil', 'Ovid (Metamorphoses)'],
    pattern: '— ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ∪ ∪ | — ×',
  },
  elegiac: {
    name: 'Elegiac Couplet',
    description: 'Alternating hexameter and pentameter lines',
    examples: ['Ovid (Amores)', 'Tibullus', 'Propertius'],
    pattern: '— ∪ ∪ | — ∪ ∪ | — || — ∪ ∪ | — ∪ ∪ | —',
  },
  iambic: {
    name: 'Iambic Trimeter',
    description: 'Dramatic meter: ∪ — | ∪ — | ∪ —',
    examples: ['Greek tragedy', 'Seneca'],
    pattern: '∪ — | ∪ — | ∪ — | ∪ — | ∪ — | ∪ —',
  },
  sapphic: {
    name: 'Sapphic Stanza',
    description: 'Lyric meter named after Sappho',
    examples: ['Sappho', 'Horace'],
    pattern: '— ∪ — × — ∪ ∪ — ∪ — —',
  },
};

// Author stylometric profiles for comparison
const authorProfiles = [
  {
    name: 'Homer',
    features: [
      { subject: 'Vocabulary', value: 0.95 },
      { subject: 'Sentence Len', value: 0.75 },
      { subject: 'Epithets', value: 0.98 },
      { subject: 'Formulae', value: 0.92 },
      { subject: 'Enjambment', value: 0.68 },
    ],
  },
  {
    name: 'Plato',
    features: [
      { subject: 'Vocabulary', value: 0.88 },
      { subject: 'Sentence Len', value: 0.82 },
      { subject: 'Epithets', value: 0.35 },
      { subject: 'Formulae', value: 0.28 },
      { subject: 'Enjambment', value: 0.45 },
    ],
  },
];

export default function AnalysisPage() {
  const [inputText, setInputText] = useState('');
  const [analysisType, setAnalysisType] = useState<'morphology' | 'scansion' | 'syntax' | 'statistics' | 'stylometry'>('morphology');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<typeof SAMPLE_ANALYSIS | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [textStats, setTextStats] = useState<{
    words: number;
    uniqueWords: number;
    sentences: number;
    avgSentenceLength: number;
    hapaxCount: number;
  } | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setAnalyzing(true);
    setError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const cleaned = cleanWord(inputText);
    const language = detectLanguage(cleaned);

    if (language === 'unknown') {
      setError('Could not detect language. Please enter Greek or Latin text.');
      setAnalyzing(false);
      return;
    }

    setResult({
      ...SAMPLE_ANALYSIS,
      word: cleaned,
      language: language === 'greek' ? 'Greek' : 'Latin',
    });
    setAnalyzing(false);
  };

  const handleTextAnalysis = () => {
    if (!inputText.trim()) return;

    const words = inputText.split(/\s+/).filter((w) => w.length > 0);
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
    const sentences = inputText.split(/[.;!?]+/).filter((s) => s.trim().length > 0);

    setTextStats({
      words: words.length,
      uniqueWords: uniqueWords.size,
      sentences: sentences.length,
      avgSentenceLength: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
      hapaxCount: Math.round(uniqueWords.size * 0.4),
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#C9A962]">ANALYSIS</span>
          </h1>
          <p className="text-[#F5F3EF]/70">
            Linguistic analysis tools for Greek and Latin with 50+ stylometric features
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analysis type tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['morphology', 'scansion', 'syntax', 'statistics', 'stylometry'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setAnalysisType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                analysisType === type
                  ? 'bg-[#C9A962] text-[#0D0D0F]'
                  : 'bg-[#C9A962]/10 hover:bg-[#C9A962]/20'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Morphological Analysis */}
        {analysisType === 'morphology' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Word Analysis</h2>
              <p className="text-[#F5F3EF]/60 mb-6">
                Enter a Greek or Latin word to analyze its morphology, etymology, and usage.
              </p>

              <div className="flex gap-3 mb-6">
                <Input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter a word (e.g., λόγος, amor)..."
                  className="text-xl font-serif"
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                <Button onClick={handleAnalyze} loading={analyzing}>
                  Analyze
                </Button>
              </div>

              {/* Quick examples */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm text-[#F5F3EF]/50">Try:</span>
                {['λόγος', 'ψυχή', 'amor', 'virtus', 'θεός', 'bellum', 'ἀρετή', 'gloria'].map((word) => (
                  <button
                    key={word}
                    onClick={() => setInputText(word)}
                    className="text-sm text-[#C9A962] hover:underline font-serif"
                  >
                    {word}
                  </button>
                ))}
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400">{error}</p>
                </div>
              )}

              {result && (
                <div className="space-y-6 border-t border-[#C9A962]/20 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-serif text-[#C9A962]">{result.word}</h3>
                      <p className="text-[#F5F3EF]/50">Lemma: {result.lemma}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={result.language === 'Greek' ? 'greek' : 'latin'}>
                        {result.language}
                      </Badge>
                      <p className="text-sm text-[#F5F3EF]/50 mt-1">
                        {formatNumber(result.frequency)} occurrences
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#C9A962] mb-2">Morphology</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{result.partOfSpeech}</Badge>
                      {Object.entries(result.morphology).map(([key, value]) => (
                        <Badge key={key} variant="success">
                          {key}: {value}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#C9A962] mb-2">Meanings</h4>
                    <ol className="list-decimal list-inside space-y-1 text-[#F5F3EF]/80">
                      {result.meanings.map((meaning, i) => (
                        <li key={i}>{meaning}</li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#C9A962] mb-2">Etymology</h4>
                    <p className="text-[#F5F3EF]/70">{result.etymology}</p>
                  </div>
                </div>
              )}
            </Card>

            {result && (
              <div className="space-y-6">
                {/* Declined forms */}
                <Card padding="lg">
                  <h3 className="font-semibold text-[#C9A962] mb-4">Declined Forms</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {result.declinedForms.map((form, i) => (
                      <div
                        key={i}
                        className="flex justify-between p-2 bg-[#C9A962]/5 rounded"
                      >
                        <span className="font-serif text-[#87CEEB]">{form.form}</span>
                        <span className="text-xs text-[#F5F3EF]/50">{form.case}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Cognates */}
                <Card padding="lg">
                  <h3 className="font-semibold text-[#C9A962] mb-4">Cognates & Derivatives</h3>
                  <div className="space-y-2">
                    {result.cognates.map((cognate, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 bg-[#C9A962]/5 rounded"
                      >
                        <span className="font-medium">{cognate.word}</span>
                        <Badge size="sm">{cognate.language}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/semantia?word=${encodeURIComponent(result.word)}`} className="flex-1">
                    <Button variant="secondary" className="w-full">
                      View in SEMANTIA
                    </Button>
                  </Link>
                  <Link href={`/search?q=${encodeURIComponent(result.word)}`} className="flex-1">
                    <Button variant="ghost" className="w-full">
                      Search Corpus
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scansion */}
        {analysisType === 'scansion' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Metrical Scansion</h2>
              <p className="text-[#F5F3EF]/60 mb-6">
                Enter a line of poetry to analyze its meter and rhythm.
              </p>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος..."
                className="w-full h-32 px-4 py-3 mb-4 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg font-serif text-lg focus:border-[#C9A962] outline-none resize-none"
              />
              <Button onClick={() => {}}>Scan Meter</Button>

              {/* Scansion symbols */}
              <div className="mt-8 pt-6 border-t border-[#C9A962]/20">
                <h3 className="font-semibold text-[#C9A962] mb-4">Scansion Symbols</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {[
                    { symbol: '—', name: 'Long', desc: 'longum' },
                    { symbol: '∪', name: 'Short', desc: 'breve' },
                    { symbol: '×', name: 'Anceps', desc: 'either' },
                    { symbol: '|', name: 'Foot', desc: 'boundary' },
                  ].map((s) => (
                    <div key={s.symbol} className="p-3 bg-[#C9A962]/10 rounded-lg">
                      <div className="text-2xl">{s.symbol}</div>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-[#F5F3EF]/50">{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="font-semibold text-[#C9A962]">Common Meters</h3>
              {Object.entries(METERS).map(([key, meter]) => (
                <Card key={key} variant="hover" padding="md">
                  <h4 className="font-medium text-[#C9A962] mb-1">{meter.name}</h4>
                  <p className="font-mono text-sm text-[#87CEEB] mb-2">{meter.pattern}</p>
                  <p className="text-sm text-[#F5F3EF]/60 mb-2">{meter.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {meter.examples.map((ex) => (
                      <Badge key={ex} size="sm">{ex}</Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Syntax */}
        {analysisType === 'syntax' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Syntax Diagram</h2>
              <p className="text-[#F5F3EF]/60 mb-6">
                Enter a sentence to generate a syntactic parse tree.
              </p>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter a sentence..."
                className="w-full h-32 px-4 py-3 mb-4 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg font-serif text-lg focus:border-[#C9A962] outline-none resize-none"
              />
              <Button onClick={() => {}}>Parse Syntax</Button>
            </Card>

            <div className="space-y-4">
              <h3 className="font-semibold text-[#C9A962]">Key Syntactic Structures</h3>
              <div className="grid gap-4">
                {[
                  { name: 'Genitive Absolute', desc: 'Participial clause in genitive case (Greek)', example: 'τοῦ στρατηγοῦ κελεύοντος' },
                  { name: 'Ablative Absolute', desc: 'Participial clause in ablative case (Latin)', example: 'urbe capta' },
                  { name: 'Accusative + Infinitive', desc: 'Indirect statement construction', example: 'dico te venire' },
                  { name: 'Purpose Clause', desc: 'Final clause with subjunctive', example: 'ut videat / ἵνα ἴδῃ' },
                  { name: 'Result Clause', desc: 'Consecutive clause expressing outcome', example: 'tam...ut / ὥστε' },
                ].map((concept) => (
                  <Card key={concept.name} variant="hover" padding="md">
                    <h4 className="font-medium text-[#C9A962]">{concept.name}</h4>
                    <p className="text-sm text-[#F5F3EF]/60">{concept.desc}</p>
                    <p className="text-sm font-serif text-[#87CEEB] mt-1">{concept.example}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        {analysisType === 'statistics' && (
          <div className="space-y-8">
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Text Statistics</h2>
              <p className="text-[#F5F3EF]/60 mb-6">
                Paste a text to get statistical analysis of vocabulary, sentence structure, and more.
              </p>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full h-48 px-4 py-3 mb-4 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg font-serif focus:border-[#C9A962] outline-none resize-none"
              />
              <Button onClick={handleTextAnalysis}>Analyze Text</Button>
            </Card>

            {textStats && (
              <>
                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card padding="md" className="text-center">
                    <div className="text-3xl font-bold text-[#C9A962]">{textStats.words}</div>
                    <div className="text-sm text-[#F5F3EF]/50">Total Words</div>
                  </Card>
                  <Card padding="md" className="text-center">
                    <div className="text-3xl font-bold text-[#87CEEB]">{textStats.uniqueWords}</div>
                    <div className="text-sm text-[#F5F3EF]/50">Unique Words</div>
                  </Card>
                  <Card padding="md" className="text-center">
                    <div className="text-3xl font-bold text-[#98D8C8]">{textStats.sentences}</div>
                    <div className="text-sm text-[#F5F3EF]/50">Sentences</div>
                  </Card>
                  <Card padding="md" className="text-center">
                    <div className="text-3xl font-bold text-[#DDA0DD]">{textStats.avgSentenceLength}</div>
                    <div className="text-sm text-[#F5F3EF]/50">Avg. Length</div>
                  </Card>
                  <Card padding="md" className="text-center">
                    <div className="text-3xl font-bold text-[#F7DC6F]">{textStats.hapaxCount}</div>
                    <div className="text-sm text-[#F5F3EF]/50">Hapax</div>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card padding="lg">
                    <h3 className="font-semibold text-[#C9A962] mb-4">Part of Speech Distribution</h3>
                    <DonutChart
                      data={samplePOSDistribution}
                      showLegend
                      centerText={`${textStats.words}`}
                      centerSubtext="words"
                    />
                  </Card>

                  <Card padding="lg">
                    <h3 className="font-semibold text-[#C9A962] mb-4">Word Frequency (Top 8)</h3>
                    <div className="h-64">
                      <BarChart data={sampleWordFrequency} horizontal maxBars={8} />
                    </div>
                  </Card>
                </div>

                <Card padding="lg">
                  <h3 className="font-semibold text-[#C9A962] mb-4">Sentence Length Distribution</h3>
                  <div className="h-48">
                    <LineChart
                      data={sentenceLengthData}
                      lines={[{ dataKey: 'value', name: 'Sentences', color: '#C9A962' }]}
                    />
                  </div>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Stylometry */}
        {analysisType === 'stylometry' && (
          <div className="space-y-8">
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Stylometric Fingerprinting</h2>
              <p className="text-[#F5F3EF]/60 mb-6">
                Analyze an author's unique stylistic fingerprint using 50+ linguistic features.
              </p>

              <div className="flex gap-4 mb-6">
                <Select
                  value="homer"
                  onChange={() => {}}
                  options={[
                    { value: 'homer', label: 'Homer' },
                    { value: 'plato', label: 'Plato' },
                    { value: 'aristotle', label: 'Aristotle' },
                    { value: 'cicero', label: 'Cicero' },
                    { value: 'virgil', label: 'Virgil' },
                  ]}
                  label="Author"
                  className="w-48"
                />
                <Select
                  value="iliad"
                  onChange={() => {}}
                  options={[
                    { value: 'iliad', label: 'Iliad' },
                    { value: 'odyssey', label: 'Odyssey' },
                    { value: 'all', label: 'All Works' },
                  ]}
                  label="Work"
                  className="w-48"
                />
                <Button>Analyze</Button>
              </div>
            </Card>

            {/* Author comparison */}
            <div className="grid lg:grid-cols-2 gap-8">
              {authorProfiles.map((author) => (
                <Card key={author.name} padding="lg">
                  <h3 className="font-semibold text-[#C9A962] mb-4">{author.name}</h3>
                  <div className="h-64">
                    <RadarChart data={author.features} name={author.name} />
                  </div>
                </Card>
              ))}
            </div>

            {/* Feature list */}
            <Card padding="lg">
              <h3 className="font-semibold text-[#C9A962] mb-4">Stylometric Features (50+)</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-[#87CEEB] mb-2">Vocabulary</h4>
                  <ul className="space-y-1 text-sm text-[#F5F3EF]/60">
                    <li>Type-token ratio</li>
                    <li>Hapax legomena ratio</li>
                    <li>Average word length</li>
                    <li>Vocabulary richness</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#98D8C8] mb-2">Syntax</h4>
                  <ul className="space-y-1 text-sm text-[#F5F3EF]/60">
                    <li>Sentence length</li>
                    <li>Subordination depth</li>
                    <li>Clause complexity</li>
                    <li>Verb-noun ratio</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#DDA0DD] mb-2">Style</h4>
                  <ul className="space-y-1 text-sm text-[#F5F3EF]/60">
                    <li>Particle frequency</li>
                    <li>Epithet usage</li>
                    <li>Formulaic expressions</li>
                    <li>Enjambment rate</li>
                  </ul>
                </div>
              </div>
            </Card>

            <div className="text-center">
              <Link href="/forensic">
                <Button size="lg">
                  Try Authorship Attribution
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Tool cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card variant="hover" padding="lg">
            <div className="text-3xl mb-3">🔤</div>
            <h3 className="font-semibold text-[#C9A962] mb-2">Morphological Parser</h3>
            <p className="text-sm text-[#F5F3EF]/60">
              Full parsing of word forms with all possible analyses
            </p>
          </Card>
          <Card variant="hover" padding="lg">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-[#C9A962] mb-2">Stylometry</h3>
            <p className="text-sm text-[#F5F3EF]/60">
              Compare authorial styles using 50+ statistical features
            </p>
          </Card>
          <Card variant="hover" padding="lg">
            <div className="text-3xl mb-3">🎵</div>
            <h3 className="font-semibold text-[#C9A962] mb-2">Prosody Tools</h3>
            <p className="text-sm text-[#F5F3EF]/60">
              Analyze rhythm, meter, and sound patterns in poetry
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
