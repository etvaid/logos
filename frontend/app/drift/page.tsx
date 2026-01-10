'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card, Button, Badge, Select, Input, LoadingSpinner, Tabs } from '@/components/ui';
import { BarChart } from '@/components/charts';
import { formatNumber } from '@/lib/utils';

interface SemanticSnapshot {
  period: string;
  year: number;
  meaning: string;
  usage: string;
  frequency: number;
  examples: { author: string; work: string; passage: string }[];
}

interface TermEvolution {
  id: string;
  term: string;
  language: 'greek' | 'latin';
  baseTranslation: string;
  semanticField: string;
  timeline: SemanticSnapshot[];
  totalOccurrences: number;
  driftScore: number; // 0-1, higher = more semantic change
  relatedTerms: string[];
}

// Demo term evolution data for fallback
const DEMO_TERM_EVOLUTIONS: TermEvolution[] = [
  {
    id: 'logos',
    term: 'logos',
    language: 'greek',
    baseTranslation: 'word, reason, speech',
    semanticField: 'Philosophy/Theology',
    totalOccurrences: 45672,
    driftScore: 0.89,
    relatedTerms: ['mythos', 'lexis', 'rhema', 'verbum'],
    timeline: [
      { period: 'Homeric', year: -750, meaning: 'speech, story', usage: 'Narrative speech, oral communication', frequency: 234, examples: [{ author: 'Homer', work: 'Iliad', passage: 'kai ton logos eipe' }] },
      { period: 'Pre-Socratic', year: -500, meaning: 'account, reason', usage: 'Rational explanation of cosmos', frequency: 567, examples: [{ author: 'Heraclitus', work: 'Fragments', passage: 'tou logou toud\' eontos' }] },
      { period: 'Classical', year: -400, meaning: 'reason, argument, ratio', usage: 'Philosophical argumentation', frequency: 3456, examples: [{ author: 'Plato', work: 'Republic', passage: 'kata ton orthon logon' }] },
      { period: 'Hellenistic', year: -200, meaning: 'cosmic reason', usage: 'Stoic divine principle', frequency: 2890, examples: [{ author: 'Chrysippus', work: 'On the Soul', passage: 'ho logos ho dioikon' }] },
      { period: 'Imperial', year: 50, meaning: 'Word (divine)', usage: 'Christian theology', frequency: 8934, examples: [{ author: 'John', work: 'Gospel', passage: 'En arche en ho Logos' }] },
      { period: 'Late Antique', year: 400, meaning: 'Word/Christ', usage: 'Trinitarian theology', frequency: 12456, examples: [{ author: 'Augustine', work: 'Confessions', passage: 'Verbum tuum' }] },
    ],
  },
  {
    id: 'arete',
    term: 'arete',
    language: 'greek',
    baseTranslation: 'excellence, virtue',
    semanticField: 'Ethics',
    totalOccurrences: 23456,
    driftScore: 0.72,
    relatedTerms: ['virtus', 'kalos', 'agathon'],
    timeline: [
      { period: 'Homeric', year: -750, meaning: 'martial excellence', usage: 'Heroic prowess in battle', frequency: 189, examples: [{ author: 'Homer', work: 'Iliad', passage: 'arete d\'Achileos' }] },
      { period: 'Archaic', year: -600, meaning: 'aristocratic excellence', usage: 'Noble birth and achievement', frequency: 345, examples: [{ author: 'Pindar', work: 'Olympian Odes', passage: 'areta...pheggos' }] },
      { period: 'Classical', year: -400, meaning: 'moral virtue', usage: 'Ethical excellence of soul', frequency: 4567, examples: [{ author: 'Aristotle', work: 'Ethics', passage: 'he arete hexis prohairetike' }] },
      { period: 'Hellenistic', year: -200, meaning: 'philosophical virtue', usage: 'Stoic/Epicurean ethics', frequency: 3245, examples: [{ author: 'Epictetus', work: 'Discourses', passage: 'mone arete agathon' }] },
      { period: 'Imperial', year: 100, meaning: 'moral excellence', usage: 'General ethical usage', frequency: 2134, examples: [{ author: 'Plutarch', work: 'Moralia', passage: 'peri aretes' }] },
    ],
  },
  {
    id: 'pietas',
    term: 'pietas',
    language: 'latin',
    baseTranslation: 'duty, devotion, piety',
    semanticField: 'Religion/Ethics',
    totalOccurrences: 18923,
    driftScore: 0.65,
    relatedTerms: ['eusebeia', 'religio', 'fides'],
    timeline: [
      { period: 'Early Republic', year: -400, meaning: 'duty to family/state', usage: 'Familial and civic obligation', frequency: 123, examples: [{ author: 'Ennius', work: 'Annales', passage: 'pietate insignis' }] },
      { period: 'Late Republic', year: -100, meaning: 'Roman virtue', usage: 'Political and religious duty', frequency: 2345, examples: [{ author: 'Cicero', work: 'De Officiis', passage: 'pietas erga patriam' }] },
      { period: 'Augustan', year: -20, meaning: 'Aenean virtue', usage: 'Imperial ideology', frequency: 4567, examples: [{ author: 'Virgil', work: 'Aeneid', passage: 'pius Aeneas' }] },
      { period: 'Imperial', year: 100, meaning: 'devotion', usage: 'Religious and familial', frequency: 3456, examples: [{ author: 'Tacitus', work: 'Annals', passage: 'in pietatem' }] },
      { period: 'Christian', year: 350, meaning: 'Christian piety', usage: 'Religious devotion to God', frequency: 5678, examples: [{ author: 'Jerome', work: 'Vulgate', passage: 'pietas quae secundum Deum' }] },
    ],
  },
  {
    id: 'psyche',
    term: 'psyche',
    language: 'greek',
    baseTranslation: 'soul, life, mind',
    semanticField: 'Psychology/Philosophy',
    totalOccurrences: 34567,
    driftScore: 0.81,
    relatedTerms: ['anima', 'thymos', 'nous', 'pneuma'],
    timeline: [
      { period: 'Homeric', year: -750, meaning: 'breath-soul, shade', usage: 'Life force that departs at death', frequency: 456, examples: [{ author: 'Homer', work: 'Odyssey', passage: 'psychai nekyon' }] },
      { period: 'Pre-Socratic', year: -500, meaning: 'life principle', usage: 'Animating force of living things', frequency: 678, examples: [{ author: 'Thales', work: 'Fragments', passage: 'psychen echei' }] },
      { period: 'Classical', year: -400, meaning: 'rational soul', usage: 'Tripartite soul theory', frequency: 5678, examples: [{ author: 'Plato', work: 'Phaedo', passage: 'he psyche athanatos' }] },
      { period: 'Hellenistic', year: -200, meaning: 'individual soul', usage: 'Personal identity and survival', frequency: 4567, examples: [{ author: 'Epicurus', work: 'Letter to Herodotus', passage: 'psyche kai soma' }] },
      { period: 'Imperial', year: 100, meaning: 'immortal soul', usage: 'Religious and philosophical', frequency: 6789, examples: [{ author: 'Plotinus', work: 'Enneads', passage: 'pasa psyche' }] },
      { period: 'Christian', year: 350, meaning: 'eternal soul', usage: 'Christian anthropology', frequency: 8901, examples: [{ author: 'Gregory of Nyssa', work: 'On the Soul', passage: 'psyche anthropou' }] },
    ],
  },
  {
    id: 'natura',
    term: 'natura',
    language: 'latin',
    baseTranslation: 'nature, birth, character',
    semanticField: 'Philosophy/Science',
    totalOccurrences: 28456,
    driftScore: 0.58,
    relatedTerms: ['physis', 'ingenium', 'essentia'],
    timeline: [
      { period: 'Early', year: -250, meaning: 'birth, origin', usage: 'Natural origin of things', frequency: 234, examples: [{ author: 'Plautus', work: 'Plays', passage: 'natura sua' }] },
      { period: 'Late Republic', year: -100, meaning: 'nature, essence', usage: 'Philosophical nature of things', frequency: 3456, examples: [{ author: 'Lucretius', work: 'De Rerum Natura', passage: 'rerum natura' }] },
      { period: 'Augustan', year: -20, meaning: 'natural world', usage: 'Physical nature', frequency: 4567, examples: [{ author: 'Virgil', work: 'Georgics', passage: 'naturae...leges' }] },
      { period: 'Imperial', year: 100, meaning: 'nature/essence', usage: 'Scientific and philosophical', frequency: 5678, examples: [{ author: 'Seneca', work: 'Natural Questions', passage: 'natura rerum' }] },
      { period: 'Late', year: 400, meaning: 'divine nature', usage: 'Theological essence', frequency: 6789, examples: [{ author: 'Augustine', work: 'De Trinitate', passage: 'natura divina' }] },
    ],
  },
];

// Build chart data for visualization
const buildFrequencyData = (timeline: SemanticSnapshot[]) => {
  return timeline.map((s) => ({
    name: s.period,
    value: s.frequency,
    color: '#C9A962',
  }));
};

export default function SemanticDriftPage() {
  const [terms, setTerms] = useState<TermEvolution[]>(DEMO_TERM_EVOLUTIONS);
  const [loading, setLoading] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState<TermEvolution | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterField, setFilterField] = useState('');
  const [viewTab, setViewTab] = useState<'timeline' | 'frequency' | 'examples'>('timeline');
  const [sortBy, setSortBy] = useState<'drift' | 'occurrences' | 'term'>('drift');

  // Fetch all terms overview
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        // Try fetching from a terms list endpoint
        const res = await fetch('/api/terms');
        if (res.ok) {
          const data = await res.json();
          if (data.terms?.length > 0) setTerms(data.terms);
        }
      } catch (error) {
        console.log('Using demo data');
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  // Fetch detailed drift data when a term is selected
  const handleSelectTerm = async (term: TermEvolution) => {
    setSelectedTerm(term);
    setDetailLoading(true);

    try {
      const res = await fetch(`/api/terms/${encodeURIComponent(term.term)}/drift`);
      if (res.ok) {
        const data = await res.json();
        // Merge API data with existing term
        setSelectedTerm({ ...term, ...data });
      }
    } catch (error) {
      console.log('Using cached term data');
    } finally {
      setDetailLoading(false);
    }
  };

  const semanticFields = useMemo(() => [...new Set(terms.map((t) => t.semanticField))], [terms]);

  const filteredTerms = useMemo(() => {
    let result = terms;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.term.toLowerCase().includes(q) || t.baseTranslation.toLowerCase().includes(q));
    }
    if (filterLanguage) result = result.filter((t) => t.language === filterLanguage);
    if (filterField) result = result.filter((t) => t.semanticField === filterField);
    return result.sort((a, b) => {
      if (sortBy === 'drift') return b.driftScore - a.driftScore;
      if (sortBy === 'occurrences') return b.totalOccurrences - a.totalOccurrences;
      return a.term.localeCompare(b.term);
    });
  }, [terms, searchQuery, filterLanguage, filterField, sortBy]);

  const avgDrift = useMemo(() => terms.reduce((sum, t) => sum + t.driftScore, 0) / terms.length, [terms]);
  const totalTerms = terms.length;

  const getDriftColor = (score: number) => {
    if (score >= 0.8) return 'text-red-400';
    if (score >= 0.6) return 'text-[#C9A962]';
    return 'text-green-400';
  };

  const getDriftLabel = (score: number) => {
    if (score >= 0.8) return 'High';
    if (score >= 0.6) return 'Medium';
    return 'Low';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-[#F5F3EF]/50">Loading semantic drift data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-[#C9A962]">Semantic Drift</span> Timeline
              </h1>
              <p className="text-[#F5F3EF]/70">
                Track how word meanings evolve across centuries
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A962]">{totalTerms}</div>
                <div className="text-xs text-[#F5F3EF]/50">Terms Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A962]">{(avgDrift * 100).toFixed(0)}%</div>
                <div className="text-xs text-[#F5F3EF]/50">Avg Drift</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A962]">~1200</div>
                <div className="text-xs text-[#F5F3EF]/50">Years Span</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card padding="md" className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Input
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            />
            <Select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              options={[
                { value: '', label: 'All Languages' },
                { value: 'greek', label: 'Greek' },
                { value: 'latin', label: 'Latin' },
              ]}
              className="w-36"
            />
            <Select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              options={[{ value: '', label: 'All Fields' }, ...semanticFields.map((f) => ({ value: f, label: f }))]}
              className="w-48"
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              options={[
                { value: 'drift', label: 'Sort: Drift Score' },
                { value: 'occurrences', label: 'Sort: Frequency' },
                { value: 'term', label: 'Sort: Alphabetical' },
              ]}
              className="w-44"
            />
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Term List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredTerms.map((term) => (
              <Card
                key={term.id}
                className={`cursor-pointer transition-all ${
                  selectedTerm?.id === term.id ? 'ring-2 ring-[#C9A962]' : 'hover:border-[#C9A962]/40'
                }`}
                onClick={() => handleSelectTerm(term)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-serif text-[#C9A962]">{term.term}</h3>
                      <Badge variant={term.language === 'greek' ? 'greek' : 'latin'}>
                        {term.language}
                      </Badge>
                      <Badge variant="default">{term.semanticField}</Badge>
                    </div>
                    <p className="text-sm text-[#F5F3EF]/70 mb-2">"{term.baseTranslation}"</p>
                    <div className="flex flex-wrap gap-2">
                      {term.timeline.slice(0, 4).map((s) => (
                        <span key={s.period} className="text-xs px-2 py-1 bg-[#C9A962]/10 rounded">
                          {s.period}: {s.meaning.split(',')[0]}
                        </span>
                      ))}
                      {term.timeline.length > 4 && (
                        <span className="text-xs text-[#F5F3EF]/50">+{term.timeline.length - 4} more</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-sm text-[#F5F3EF]/50 mb-1">Semantic Drift</div>
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-20 h-2 bg-[#C9A962]/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${term.driftScore >= 0.8 ? 'bg-red-400' : term.driftScore >= 0.6 ? 'bg-[#C9A962]' : 'bg-green-400'}`}
                          style={{ width: `${term.driftScore * 100}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getDriftColor(term.driftScore)}`}>
                        {(term.driftScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-xs text-[#F5F3EF]/40 mt-1">
                      {formatNumber(term.totalOccurrences)} occurrences
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedTerm ? (
              <>
                {/* Term Detail */}
                <Card padding="lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-serif text-[#C9A962]">{selectedTerm.term}</h2>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTerm(null)}>x</Button>
                  </div>

                  {detailLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="md" />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#F5F3EF]/50">Language</span>
                          <Badge variant={selectedTerm.language === 'greek' ? 'greek' : 'latin'}>
                            {selectedTerm.language}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#F5F3EF]/50">Base Translation</span>
                          <span className="text-right max-w-32 truncate">{selectedTerm.baseTranslation}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#F5F3EF]/50">Semantic Field</span>
                          <span>{selectedTerm.semanticField}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#F5F3EF]/50">Total Occurrences</span>
                          <span>{formatNumber(selectedTerm.totalOccurrences)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#F5F3EF]/50">Drift Score</span>
                          <span className={getDriftColor(selectedTerm.driftScore)}>
                            {(selectedTerm.driftScore * 100).toFixed(0)}% ({getDriftLabel(selectedTerm.driftScore)})
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-xs text-[#F5F3EF]/50 mb-2">Related Terms</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedTerm.relatedTerms.map((rt) => (
                            <Badge key={rt} size="sm" variant="default">{rt}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </Card>

                {/* Timeline View */}
                <Card padding="lg">
                  <Tabs
                    tabs={[
                      { id: 'timeline', label: 'Timeline' },
                      { id: 'frequency', label: 'Frequency' },
                      { id: 'examples', label: 'Examples' },
                    ]}
                    activeTab={viewTab}
                    onChange={(id) => setViewTab(id as typeof viewTab)}
                  />

                  <div className="mt-4">
                    {viewTab === 'timeline' && (
                      <div className="space-y-4 max-h-72 overflow-y-auto">
                        {selectedTerm.timeline.map((snapshot) => (
                          <div key={snapshot.period} className="relative pl-6 pb-4 border-l-2 border-[#C9A962]/30 last:border-0">
                            <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-[#C9A962] -translate-x-[7px]" />
                            <div className="text-xs text-[#C9A962] mb-1">
                              {snapshot.period} ({snapshot.year < 0 ? `${Math.abs(snapshot.year)} BCE` : `${snapshot.year} CE`})
                            </div>
                            <div className="text-sm font-medium mb-1">{snapshot.meaning}</div>
                            <div className="text-xs text-[#F5F3EF]/50">{snapshot.usage}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {viewTab === 'frequency' && (
                      <div className="h-48">
                        <BarChart data={buildFrequencyData(selectedTerm.timeline)} horizontal={false} maxBars={6} />
                      </div>
                    )}

                    {viewTab === 'examples' && (
                      <div className="space-y-3 max-h-72 overflow-y-auto">
                        {selectedTerm.timeline.map((snapshot) => (
                          snapshot.examples.map((ex, i) => (
                            <div key={`${snapshot.period}-${i}`} className="p-3 bg-[#C9A962]/5 rounded-lg">
                              <div className="text-xs text-[#C9A962] mb-1">{snapshot.period}</div>
                              <p className="text-sm text-[#F5F3EF]/80 font-serif italic mb-1">"{ex.passage}"</p>
                              <div className="text-xs text-[#F5F3EF]/50">{ex.author}, {ex.work}</div>
                            </div>
                          ))
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                <Link href={`/search?q=${selectedTerm.term}`}>
                  <Button variant="secondary" className="w-full">
                    Search Corpus
                  </Button>
                </Link>
              </>
            ) : (
              <Card padding="lg" className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-lg text-[#C9A962] mb-2">Select a Term</h3>
                <p className="text-sm text-[#F5F3EF]/50">
                  Click on any term to explore its semantic evolution across time periods.
                </p>
              </Card>
            )}

            {/* Drift Scale Legend */}
            <Card padding="lg">
              <h3 className="font-semibold text-[#C9A962] mb-4">Drift Score Guide</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div>
                    <div className="text-sm font-medium text-red-400">High (80%+)</div>
                    <div className="text-xs text-[#F5F3EF]/40">Radical semantic shift</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#C9A962]" />
                  <div>
                    <div className="text-sm font-medium text-[#C9A962]">Medium (60-80%)</div>
                    <div className="text-xs text-[#F5F3EF]/40">Significant evolution</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div>
                    <div className="text-sm font-medium text-green-400">Low (&lt;60%)</div>
                    <div className="text-xs text-[#F5F3EF]/40">Stable meaning</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* About */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-3">About Semantic Drift</h3>
              <p className="text-xs text-[#F5F3EF]/60 leading-relaxed">
                Semantic drift measures how word meanings change over time. High drift scores indicate terms whose meanings have significantly evolved from their original usage.
              </p>
              <p className="text-xs text-[#F5F3EF]/50 mt-2">
                Calculated using embedding similarity across time periods.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
