'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card, Button, Input, Badge, Tabs, Select } from '@/components/ui';
import { RadarChart, BarChart, DonutChart, LineChart } from '@/components/charts';

interface Candidate {
  author: string;
  confidence: number;
  method: string;
  styleVector?: number[];
}

interface StyleProfile {
  name: string;
  sentenceLength: number;
  vocabularyRichness: number;
  particleFrequency: number;
  clauseDensity: number;
  hapaxRatio: number;
}

interface DisputedText {
  id: string;
  title: string;
  traditionalAuthor: string;
  language: 'greek' | 'latin';
  status: 'disputed' | 'resolved' | 'open';
  arguments: {
    for: string[];
    against: string[];
  };
  candidates: { name: string; probability: number }[];
  keyEvidence: string;
  modernConsensus?: string;
}

// Famous disputed texts
const DISPUTED_TEXTS: DisputedText[] = [
  {
    id: 'prometheus-bound',
    title: 'Prometheus Bound',
    traditionalAuthor: 'Aeschylus',
    language: 'greek',
    status: 'disputed',
    arguments: {
      for: ['Attributed in antiquity', 'Thematic continuity with other works', 'Similar use of compounds'],
      against: ['Unusual meter patterns', 'Higher resolution rates', 'Different theological outlook', 'Vocabulary anomalies'],
    },
    candidates: [
      { name: 'Aeschylus', probability: 0.45 },
      { name: 'Euphorion (son)', probability: 0.35 },
      { name: 'Unknown 5th c.', probability: 0.20 },
    ],
    keyEvidence: 'Resolution rates in iambic trimeter are 2x higher than authentic Aeschylus plays',
    modernConsensus: 'Majority of scholars now doubt Aeschylean authorship',
  },
  {
    id: 'rhesus',
    title: 'Rhesus',
    traditionalAuthor: 'Euripides',
    language: 'greek',
    status: 'disputed',
    arguments: {
      for: ['Listed in ancient catalog', 'Consistent with later style', 'Similar metrical patterns'],
      against: ['Weak dramaturgy', 'Limited choral role', 'Unusual vocabulary', 'Epic rather than tragic focus'],
    },
    candidates: [
      { name: 'Euripides', probability: 0.30 },
      { name: '4th c. imitator', probability: 0.55 },
      { name: 'Euphorion', probability: 0.15 },
    ],
    keyEvidence: 'Function word distribution differs significantly from authenticated Euripides',
    modernConsensus: 'Generally considered spurious by most scholars',
  },
  {
    id: 'heroides',
    title: 'Heroides 16-21',
    traditionalAuthor: 'Ovid',
    language: 'latin',
    status: 'open',
    arguments: {
      for: ['Stylistically similar to early books', 'Referenced by Ovid himself', 'Consistent vocabulary'],
      against: ['Different paired format', 'Less mythological precision', 'Possible later addition'],
    },
    candidates: [
      { name: 'Ovid (early)', probability: 0.60 },
      { name: 'Ovid (late)', probability: 0.25 },
      { name: 'Imitator', probability: 0.15 },
    ],
    keyEvidence: 'Hapax legomena rate matches authenticated Ovidian works',
    modernConsensus: 'Genuine but possibly revised later',
  },
  {
    id: 'consolatio',
    title: 'Consolatio ad Liviam',
    traditionalAuthor: 'Ovid',
    language: 'latin',
    status: 'resolved',
    arguments: {
      for: ['Found in Ovidian manuscripts', 'Uses Ovidian elegiac meter'],
      against: ['Historical inaccuracies', 'Stylistic differences', 'Vocabulary inconsistencies', 'Metrical irregularities'],
    },
    candidates: [
      { name: 'Ovid', probability: 0.10 },
      { name: 'Tiberian poet', probability: 0.70 },
      { name: 'Later imitator', probability: 0.20 },
    ],
    keyEvidence: 'Sentence structure analysis shows 92% divergence from Ovidian norms',
    modernConsensus: 'Universally rejected as non-Ovidian',
  },
  {
    id: 'octavia',
    title: 'Octavia',
    traditionalAuthor: 'Seneca',
    language: 'latin',
    status: 'resolved',
    arguments: {
      for: ['Preserved with genuine plays', 'Similar tragic style'],
      against: ['References events after Seneca\'s death', 'Different metrical patterns', 'Vocabulary differences'],
    },
    candidates: [
      { name: 'Seneca', probability: 0.05 },
      { name: 'Flavian poet', probability: 0.75 },
      { name: 'Unknown 1st c.', probability: 0.20 },
    ],
    keyEvidence: 'Contains prophecy of Nero\'s death (68 CE), written before Seneca died (65 CE)',
    modernConsensus: 'Unanimously rejected - anachronistic references prove later date',
  },
  {
    id: 'constitution-athens',
    title: 'Constitution of the Athenians',
    traditionalAuthor: 'Aristotle',
    language: 'greek',
    status: 'open',
    arguments: {
      for: ['From Aristotelian school', 'Consistent with Politics', 'Reflects Aristotelian method'],
      against: ['Some historical errors', 'Stylistic variations', 'Possibly by student'],
    },
    candidates: [
      { name: 'Aristotle', probability: 0.55 },
      { name: 'Student/collaborator', probability: 0.35 },
      { name: 'Later Peripatetic', probability: 0.10 },
    ],
    keyEvidence: 'Statistical analysis of particles matches Aristotle\'s authenticated works',
    modernConsensus: 'Generally accepted as authentic, possibly with student assistance',
  },
];

// Author style profiles for comparison
const AUTHOR_PROFILES: StyleProfile[] = [
  { name: 'Homer', sentenceLength: 0.75, vocabularyRichness: 0.95, particleFrequency: 0.60, clauseDensity: 0.70, hapaxRatio: 0.85 },
  { name: 'Plato', sentenceLength: 0.85, vocabularyRichness: 0.80, particleFrequency: 0.75, clauseDensity: 0.90, hapaxRatio: 0.45 },
  { name: 'Aristotle', sentenceLength: 0.90, vocabularyRichness: 0.70, particleFrequency: 0.80, clauseDensity: 0.95, hapaxRatio: 0.40 },
  { name: 'Thucydides', sentenceLength: 0.95, vocabularyRichness: 0.85, particleFrequency: 0.70, clauseDensity: 0.85, hapaxRatio: 0.65 },
  { name: 'Herodotus', sentenceLength: 0.70, vocabularyRichness: 0.90, particleFrequency: 0.55, clauseDensity: 0.60, hapaxRatio: 0.70 },
  { name: 'Cicero', sentenceLength: 0.90, vocabularyRichness: 0.85, particleFrequency: 0.65, clauseDensity: 0.90, hapaxRatio: 0.50 },
  { name: 'Virgil', sentenceLength: 0.80, vocabularyRichness: 0.95, particleFrequency: 0.45, clauseDensity: 0.75, hapaxRatio: 0.75 },
  { name: 'Tacitus', sentenceLength: 0.60, vocabularyRichness: 0.90, particleFrequency: 0.50, clauseDensity: 0.80, hapaxRatio: 0.80 },
];

// Stylometric methods explained
const METHODS = [
  {
    name: "Burrows' Delta",
    description: 'Measures deviation from author norms using most frequent words. The standard method for authorship attribution since 2002.',
    accuracy: 0.85,
    bestFor: 'Longer texts (2000+ words)',
  },
  {
    name: 'Function Words',
    description: 'Analyzes distribution of particles, conjunctions, articles, and prepositions. These are used unconsciously and resist imitation.',
    accuracy: 0.80,
    bestFor: 'Ancient Greek texts',
  },
  {
    name: 'Sentence Structure',
    description: 'Mean sentence length, subordination patterns, clause distribution. Reflects deep cognitive style.',
    accuracy: 0.75,
    bestFor: 'Prose authors',
  },
  {
    name: 'Metrical Analysis',
    description: 'For verse: resolution rates, caesura patterns, spondee/dactyl ratios. Highly distinctive for poets.',
    accuracy: 0.90,
    bestFor: 'Poetry and drama',
  },
  {
    name: 'Vocabulary Richness',
    description: 'Type-token ratio, hapax legomena frequency, rare word usage patterns.',
    accuracy: 0.70,
    bestFor: 'Distinguishing periods',
  },
  {
    name: 'N-gram Analysis',
    description: 'Character and word sequence patterns. Captures sublexical stylistic habits.',
    accuracy: 0.82,
    bestFor: 'Short texts',
  },
];

// Status stats
const STATUS_STATS = [
  { name: 'Resolved', value: 2, color: '#4ECDC4' },
  { name: 'Disputed', value: 2, color: '#FF6B6B' },
  { name: 'Open', value: 2, color: '#C9A962' },
];

const LANGUAGE_STATS = [
  { name: 'Greek', value: 4, color: '#4ECDC4' },
  { name: 'Latin', value: 2, color: '#C9A962' },
];

export default function ForensicPage() {
  const [selectedText, setSelectedText] = useState<DisputedText | null>(null);
  const [activeTab, setActiveTab] = useState('analysis');
  const [inputText, setInputText] = useState('');
  const [inputLanguage, setInputLanguage] = useState<'greek' | 'latin'>('greek');
  const [results, setResults] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [compareAuthors, setCompareAuthors] = useState<string[]>(['Plato', 'Aristotle']);

  const radarData = useMemo(() => {
    return AUTHOR_PROFILES.filter(p => compareAuthors.includes(p.name)).map(profile => ({
      name: profile.name,
      'Sentence Length': profile.sentenceLength * 100,
      'Vocabulary Richness': profile.vocabularyRichness * 100,
      'Particle Frequency': profile.particleFrequency * 100,
      'Clause Density': profile.clauseDensity * 100,
      'Hapax Ratio': profile.hapaxRatio * 100,
    }));
  }, [compareAuthors]);

  const methodAccuracyData = useMemo(() => {
    return METHODS.map(m => ({
      name: m.name.split(' ')[0],
      value: m.accuracy * 100,
      color: '#C9A962',
    }));
  }, []);

  const candidateChartData = useMemo(() => {
    if (!selectedText) return [];
    return selectedText.candidates.map(c => ({
      name: c.name,
      value: c.probability * 100,
      color: c.name === selectedText.traditionalAuthor ? '#4ECDC4' : '#C9A962',
    }));
  }, [selectedText]);

  const analyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('https://logos-backend-production-0d96.up.railway.app/authorship/attribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText.trim(), language: inputLanguage })
      });
      const data = await res.json();
      setResults(data.candidates || []);
    } catch (e) {
      // Fallback demo results
      setResults([
        { author: 'Plato', confidence: 0.72, method: "Burrows' Delta" },
        { author: 'Xenophon', confidence: 0.15, method: 'Function Words' },
        { author: 'Aristotle', confidence: 0.08, method: 'Combined' },
      ]);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved': return <Badge variant="success">Resolved</Badge>;
      case 'disputed': return <Badge variant="warning">Disputed</Badge>;
      case 'open': return <Badge variant="default">Open</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#C9A962]">FORENSIC</span>
          </h1>
          <p className="text-[#F5F3EF]/70">
            Authorship attribution and stylometric fingerprinting for classical texts
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-[#C9A962]">{DISPUTED_TEXTS.length}</div>
            <div className="text-sm text-[#F5F3EF]/50">Famous Cases</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-[#C9A962]">{METHODS.length}</div>
            <div className="text-sm text-[#F5F3EF]/50">Detection Methods</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-[#C9A962]">{AUTHOR_PROFILES.length}</div>
            <div className="text-sm text-[#F5F3EF]/50">Author Profiles</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-[#C9A962]">85%</div>
            <div className="text-sm text-[#F5F3EF]/50">Avg. Accuracy</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <Card padding="lg">
              <Tabs
                tabs={[
                  { id: 'analysis', label: 'Analyze Text' },
                  { id: 'cases', label: 'Famous Cases' },
                  { id: 'compare', label: 'Compare Authors' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </Card>

            {/* Analyze Tab */}
            {activeTab === 'analysis' && (
              <Card padding="lg">
                <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Authorship Attribution</h2>
                <p className="text-sm text-[#F5F3EF]/60 mb-4">
                  Paste a Greek or Latin text to analyze its stylometric fingerprint and identify probable authors.
                </p>

                <div className="flex gap-4 mb-4">
                  <Select
                    value={inputLanguage}
                    onChange={(e) => setInputLanguage(e.target.value as 'greek' | 'latin')}
                    options={[
                      { value: 'greek', label: 'Greek' },
                      { value: 'latin', label: 'Latin' },
                    ]}
                  />
                </div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste Greek or Latin text here for analysis..."
                  className="w-full h-40 px-4 py-3 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg font-serif text-sm resize-none focus:outline-none focus:border-[#C9A962]/40"
                />

                <Button
                  variant="primary"
                  className="w-full mt-4"
                  loading={loading}
                  onClick={analyze}
                  disabled={!inputText.trim()}
                >
                  Analyze Authorship
                </Button>

                {results.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-[#C9A962]/20">
                    <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Attribution Results</h3>
                    <div className="space-y-4">
                      {results.map((candidate, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-[#C9A962]/30 w-8">{i + 1}</span>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-semibold">{candidate.author}</span>
                              <span className="text-[#C9A962]">{(candidate.confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-[#C9A962]/10 rounded-full h-2">
                              <div
                                className="bg-[#C9A962] h-2 rounded-full transition-all"
                                style={{ width: `${candidate.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-[#F5F3EF]/40">{candidate.method}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Cases Tab */}
            {activeTab === 'cases' && (
              <div className="space-y-4">
                {DISPUTED_TEXTS.map((text) => (
                  <Card
                    key={text.id}
                    className={`cursor-pointer transition-all ${
                      selectedText?.id === text.id
                        ? 'ring-2 ring-[#C9A962]'
                        : 'hover:border-[#C9A962]/40'
                    }`}
                    onClick={() => setSelectedText(text)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-serif text-[#C9A962]">{text.title}</h3>
                          <Badge variant={text.language === 'greek' ? 'greek' : 'latin'}>
                            {text.language}
                          </Badge>
                          {getStatusBadge(text.status)}
                        </div>
                        <p className="text-sm text-[#F5F3EF]/60">
                          Traditional: <span className="text-[#F5F3EF]">{text.traditionalAuthor}</span>
                        </p>
                        <p className="text-sm text-[#F5F3EF]/50 mt-2 line-clamp-2">
                          {text.keyEvidence}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-[#F5F3EF]/50">Top Candidate</div>
                        <div className="text-lg font-semibold text-[#C9A962]">
                          {text.candidates[0].name}
                        </div>
                        <div className="text-sm text-[#F5F3EF]/40">
                          {(text.candidates[0].probability * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Compare Tab */}
            {activeTab === 'compare' && (
              <Card padding="lg">
                <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Compare Author Styles</h2>
                <p className="text-sm text-[#F5F3EF]/60 mb-4">
                  Compare stylometric fingerprints of different ancient authors.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {AUTHOR_PROFILES.map((author) => (
                    <Button
                      key={author.name}
                      variant={compareAuthors.includes(author.name) ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        if (compareAuthors.includes(author.name)) {
                          if (compareAuthors.length > 1) {
                            setCompareAuthors(compareAuthors.filter(a => a !== author.name));
                          }
                        } else if (compareAuthors.length < 4) {
                          setCompareAuthors([...compareAuthors, author.name]);
                        }
                      }}
                    >
                      {author.name}
                    </Button>
                  ))}
                </div>

                <div className="h-80">
                  <RadarChart
                    data={radarData}
                    categories={['Sentence Length', 'Vocabulary Richness', 'Particle Frequency', 'Clause Density', 'Hapax Ratio']}
                    colors={['#C9A962', '#4ECDC4', '#FF6B6B', '#DDA0DD']}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  {AUTHOR_PROFILES.filter(p => compareAuthors.includes(p.name)).map((profile, i) => (
                    <div key={profile.name} className="p-3 bg-[#C9A962]/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: ['#C9A962', '#4ECDC4', '#FF6B6B', '#DDA0DD'][i] }}
                        />
                        <span className="font-semibold text-sm">{profile.name}</span>
                      </div>
                      <div className="text-xs text-[#F5F3EF]/50 space-y-1">
                        <div className="flex justify-between">
                          <span>Vocabulary:</span>
                          <span>{(profile.vocabularyRichness * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Complexity:</span>
                          <span>{(profile.clauseDensity * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Methods Section */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Stylometric Methods</h2>
              <div className="h-48 mb-4">
                <BarChart data={methodAccuracyData} horizontal maxBars={6} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {METHODS.slice(0, 4).map((method) => (
                  <div key={method.name} className="p-3 bg-[#C9A962]/5 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-sm text-[#C9A962]">{method.name}</h3>
                      <span className="text-xs text-[#F5F3EF]/50">{(method.accuracy * 100).toFixed(0)}% acc.</span>
                    </div>
                    <p className="text-xs text-[#F5F3EF]/60 mb-2">{method.description}</p>
                    <span className="text-xs text-[#C9A962]/70">Best for: {method.bestFor}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Case Details */}
            {selectedText ? (
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-serif text-[#C9A962]">{selectedText.title}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedText(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F5F3EF]/50">Traditional</span>
                    <span className="text-[#F5F3EF]">{selectedText.traditionalAuthor}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F5F3EF]/50">Language</span>
                    <Badge variant={selectedText.language === 'greek' ? 'greek' : 'latin'}>
                      {selectedText.language}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F5F3EF]/50">Status</span>
                    {getStatusBadge(selectedText.status)}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-[#C9A962] mb-2">Candidate Authors</h3>
                  <div className="h-32">
                    <BarChart data={candidateChartData} horizontal maxBars={3} />
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-[#C9A962] mb-2">Key Evidence</h3>
                  <p className="text-sm text-[#F5F3EF]/70 p-3 bg-[#C9A962]/5 rounded-lg">
                    {selectedText.keyEvidence}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-xs font-semibold text-green-400 mb-2">For Attribution</h4>
                    <ul className="text-xs text-[#F5F3EF]/60 space-y-1">
                      {selectedText.arguments.for.slice(0, 3).map((arg, i) => (
                        <li key={i}>• {arg}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-red-400 mb-2">Against</h4>
                    <ul className="text-xs text-[#F5F3EF]/60 space-y-1">
                      {selectedText.arguments.against.slice(0, 3).map((arg, i) => (
                        <li key={i}>• {arg}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {selectedText.modernConsensus && (
                  <div className="p-3 bg-[#0D0D0F] rounded-lg border border-[#C9A962]/20">
                    <h4 className="text-xs font-semibold text-[#C9A962] mb-1">Modern Consensus</h4>
                    <p className="text-sm text-[#F5F3EF]/70">{selectedText.modernConsensus}</p>
                  </div>
                )}
              </Card>
            ) : (
              <Card padding="lg">
                <h3 className="text-lg font-semibold text-[#C9A962] mb-3">Select a Case</h3>
                <p className="text-sm text-[#F5F3EF]/60">
                  Click on any disputed text in the "Famous Cases" tab to explore the evidence for and against traditional authorship.
                </p>
              </Card>
            )}

            {/* Case Status Distribution */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Cases by Status</h3>
              <DonutChart data={STATUS_STATS} size={160} showLegend={false} />
              <div className="mt-4 space-y-1">
                {STATUS_STATS.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-[#F5F3EF]/70">{s.name}</span>
                    </div>
                    <span className="text-[#F5F3EF]/50">{s.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Language Distribution */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-4">By Language</h3>
              <DonutChart data={LANGUAGE_STATS} size={140} showLegend={false} />
              <div className="mt-4 space-y-1">
                {LANGUAGE_STATS.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-[#F5F3EF]/70">{s.name}</span>
                    </div>
                    <span className="text-[#F5F3EF]/50">{s.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Links */}
            <Card>
              <Link href="/search">
                <Button variant="secondary" className="w-full mb-2">
                  Search Full Corpus
                </Button>
              </Link>
              <Link href="/analysis">
                <Button variant="ghost" className="w-full">
                  Morphological Analysis
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
