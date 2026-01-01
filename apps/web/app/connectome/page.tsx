'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, Button, Select, Badge, LoadingSpinner, Input } from '@/components/ui';
import { ForceGraph, RadarChart, BarChart } from '@/components/charts';
import { formatNumber } from '@/lib/utils';

// Sample data
const SAMPLE_AUTHORS = [
  { id: 'homer', name: 'Homer', period: 'Archaic', language: 'Greek', influence: 1.0, works: 2 },
  { id: 'hesiod', name: 'Hesiod', period: 'Archaic', language: 'Greek', influence: 0.85, works: 3 },
  { id: 'herodotus', name: 'Herodotus', period: 'Classical', language: 'Greek', influence: 0.75, works: 1 },
  { id: 'thucydides', name: 'Thucydides', period: 'Classical', language: 'Greek', influence: 0.72, works: 1 },
  { id: 'plato', name: 'Plato', period: 'Classical', language: 'Greek', influence: 0.95, works: 36 },
  { id: 'aristotle', name: 'Aristotle', period: 'Classical', language: 'Greek', influence: 0.98, works: 47 },
  { id: 'euripides', name: 'Euripides', period: 'Classical', language: 'Greek', influence: 0.68, works: 19 },
  { id: 'sophocles', name: 'Sophocles', period: 'Classical', language: 'Greek', influence: 0.70, works: 7 },
  { id: 'virgil', name: 'Virgil', period: 'Augustan', language: 'Latin', influence: 0.92, works: 3 },
  { id: 'cicero', name: 'Cicero', period: 'Republican', language: 'Latin', influence: 0.88, works: 88 },
  { id: 'ovid', name: 'Ovid', period: 'Augustan', language: 'Latin', influence: 0.78, works: 9 },
  { id: 'horace', name: 'Horace', period: 'Augustan', language: 'Latin', influence: 0.75, works: 4 },
  { id: 'seneca', name: 'Seneca', period: 'Imperial', language: 'Latin', influence: 0.70, works: 12 },
  { id: 'tacitus', name: 'Tacitus', period: 'Imperial', language: 'Latin', influence: 0.68, works: 5 },
  { id: 'plutarch', name: 'Plutarch', period: 'Imperial', language: 'Greek', influence: 0.72, works: 78 },
  { id: 'augustine', name: 'Augustine', period: 'Late Antiquity', language: 'Latin', influence: 0.82, works: 113 },
];

const SAMPLE_CONNECTIONS = [
  { source: 'homer', target: 'virgil', type: 'model', value: 0.95 },
  { source: 'homer', target: 'plato', type: 'allusion', value: 0.70 },
  { source: 'hesiod', target: 'virgil', type: 'model', value: 0.60 },
  { source: 'plato', target: 'cicero', type: 'translation', value: 0.85 },
  { source: 'plato', target: 'aristotle', type: 'response', value: 0.90 },
  { source: 'aristotle', target: 'cicero', type: 'commentary', value: 0.75 },
  { source: 'euripides', target: 'seneca', type: 'model', value: 0.80 },
  { source: 'thucydides', target: 'tacitus', type: 'model', value: 0.70 },
  { source: 'herodotus', target: 'plutarch', type: 'source', value: 0.65 },
  { source: 'cicero', target: 'augustine', type: 'model', value: 0.75 },
  { source: 'plato', target: 'augustine', type: 'influence', value: 0.85 },
  { source: 'virgil', target: 'ovid', type: 'allusion', value: 0.60 },
  { source: 'horace', target: 'ovid', type: 'contemporary', value: 0.50 },
  { source: 'seneca', target: 'tacitus', type: 'contemporary', value: 0.45 },
  { source: 'homer', target: 'hesiod', type: 'contemporary', value: 0.50 },
  { source: 'sophocles', target: 'euripides', type: 'contemporary', value: 0.65 },
  { source: 'aristotle', target: 'plato', type: 'response', value: 0.95 },
  { source: 'virgil', target: 'horace', type: 'contemporary', value: 0.70 },
];

const CONNECTION_TYPES = [
  { type: 'model', label: 'Model/Imitation', color: '#C9A962', desc: 'Later author explicitly models their work' },
  { type: 'allusion', label: 'Allusion', color: '#6B8E23', desc: 'Indirect reference or echo' },
  { type: 'response', label: 'Response', color: '#4169E1', desc: 'Direct engagement or counter-argument' },
  { type: 'translation', label: 'Translation', color: '#9370DB', desc: 'Rendering into another language' },
  { type: 'commentary', label: 'Commentary', color: '#20B2AA', desc: 'Scholarly explication' },
  { type: 'source', label: 'Source', color: '#FF6347', desc: 'Historical source material' },
  { type: 'influence', label: 'Influence', color: '#DAA520', desc: 'Philosophical influence' },
  { type: 'contemporary', label: 'Contemporary', color: '#778899', desc: 'Contemporary interaction' },
];

export default function ConnectomePage() {
  const [selectedAuthor, setSelectedAuthor] = useState<typeof SAMPLE_AUTHORS[0] | null>(null);
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'network' | 'influence' | 'list'>('network');

  // Filter authors
  const filteredAuthors = useMemo(() => {
    return SAMPLE_AUTHORS.filter((a) => {
      if (filterLanguage && a.language !== filterLanguage) return false;
      if (filterPeriod && a.period !== filterPeriod) return false;
      if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [filterLanguage, filterPeriod, searchQuery]);

  // Prepare data for ForceGraph
  const graphNodes = useMemo(() => {
    return filteredAuthors.map((a) => ({
      id: a.id,
      name: a.name,
      group: a.language,
      size: 10 + a.influence * 20,
    }));
  }, [filteredAuthors]);

  const graphLinks = useMemo(() => {
    const authorIds = new Set(filteredAuthors.map((a) => a.id));
    return SAMPLE_CONNECTIONS.filter(
      (c) => authorIds.has(c.source) && authorIds.has(c.target)
    );
  }, [filteredAuthors]);

  // Get connections for selected author
  const authorConnections = useMemo(() => {
    if (!selectedAuthor) return [];
    return SAMPLE_CONNECTIONS.filter(
      (c) => c.source === selectedAuthor.id || c.target === selectedAuthor.id
    );
  }, [selectedAuthor]);

  // Influence comparison data
  const influenceData = useMemo(() => {
    return filteredAuthors
      .sort((a, b) => b.influence - a.influence)
      .slice(0, 10)
      .map((a) => ({
        name: a.name,
        value: Math.round(a.influence * 100),
        color: a.language === 'Greek' ? '#87CEEB' : '#DDA0DD',
      }));
  }, [filteredAuthors]);

  // Author style profile for radar
  const authorProfile = useMemo(() => {
    if (!selectedAuthor) return [];
    const conn = authorConnections.length;
    return [
      { subject: 'Influence', value: selectedAuthor.influence },
      { subject: 'Works', value: Math.min(selectedAuthor.works / 100, 1) },
      { subject: 'Connections', value: Math.min(conn / 10, 1) },
      { subject: 'Model', value: authorConnections.filter((c) => c.type === 'model').length / 5 },
      { subject: 'Cited', value: authorConnections.filter((c) => c.target === selectedAuthor.id).length / 5 },
    ];
  }, [selectedAuthor, authorConnections]);

  const periods = [...new Set(SAMPLE_AUTHORS.map((a) => a.period))];
  const languages = [...new Set(SAMPLE_AUTHORS.map((a) => a.language))];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-[#C9A962]">CONNECTOME</span>
              </h1>
              <p className="text-[#F5F3EF]/70">
                Force-directed graph of intertextual connections
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A962]">{SAMPLE_AUTHORS.length}</div>
                <div className="text-xs text-[#F5F3EF]/50">Authors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#87CEEB]">{SAMPLE_CONNECTIONS.length}</div>
                <div className="text-xs text-[#F5F3EF]/50">Connections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#DDA0DD]">{CONNECTION_TYPES.length}</div>
                <div className="text-xs text-[#F5F3EF]/50">Types</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <Card padding="md" className="mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Input
              placeholder="Search authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            />
            <Select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              options={[
                { value: '', label: 'All Languages' },
                ...languages.map((l) => ({ value: l, label: l })),
              ]}
              className="w-36"
            />
            <Select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              options={[
                { value: '', label: 'All Periods' },
                ...periods.map((p) => ({ value: p, label: p })),
              ]}
              className="w-40"
            />
            <div className="flex gap-2 ml-auto">
              {(['network', 'influence', 'list'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setViewMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main visualization area */}
          <div className="lg:col-span-2">
            {viewMode === 'network' && (
              <Card padding="lg">
                <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Connection Network</h2>
                <ForceGraph
                  nodes={graphNodes}
                  links={graphLinks}
                  width={700}
                  height={500}
                  selectedNodeId={selectedAuthor?.id}
                  onNodeClick={(node) => {
                    const author = SAMPLE_AUTHORS.find((a) => a.id === node.id);
                    setSelectedAuthor(author || null);
                  }}
                  linkColors={CONNECTION_TYPES.reduce((acc, t) => ({
                    ...acc,
                    [t.type]: t.color,
                  }), {})}
                />
                <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-[#C9A962]/20">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#87CEEB]" />
                    <span className="text-xs text-[#F5F3EF]/50">Greek</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#DDA0DD]" />
                    <span className="text-xs text-[#F5F3EF]/50">Latin</span>
                  </div>
                  <span className="text-xs text-[#F5F3EF]/30">|</span>
                  <span className="text-xs text-[#F5F3EF]/50">Node size = influence</span>
                </div>
              </Card>
            )}

            {viewMode === 'influence' && (
              <Card padding="lg">
                <h2 className="text-xl font-semibold text-[#C9A962] mb-6">Influence Ranking</h2>
                <div className="h-80">
                  <BarChart data={influenceData} horizontal maxBars={10} />
                </div>
                <div className="mt-6 space-y-3">
                  {filteredAuthors
                    .sort((a, b) => b.influence - a.influence)
                    .slice(0, 8)
                    .map((author, i) => (
                      <button
                        key={author.id}
                        onClick={() => setSelectedAuthor(author)}
                        className={`w-full text-left p-3 rounded-lg transition ${
                          selectedAuthor?.id === author.id
                            ? 'bg-[#C9A962]/20 border border-[#C9A962]'
                            : 'hover:bg-[#C9A962]/10'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-[#C9A962]/50 w-8">
                            {i + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{author.name}</span>
                              <div className="flex gap-2">
                                <Badge size="sm" variant={author.language === 'Greek' ? 'greek' : 'latin'}>
                                  {author.language}
                                </Badge>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-[#C9A962]/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#C9A962] transition-all"
                                style={{ width: `${author.influence * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </Card>
            )}

            {viewMode === 'list' && (
              <Card padding="lg">
                <h2 className="text-xl font-semibold text-[#C9A962] mb-4">All Authors</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {filteredAuthors.map((author) => (
                    <Card
                      key={author.id}
                      variant="interactive"
                      padding="sm"
                      onClick={() => setSelectedAuthor(author)}
                      className={selectedAuthor?.id === author.id ? 'border-[#C9A962]' : ''}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-[#C9A962]">{author.name}</h3>
                          <p className="text-xs text-[#F5F3EF]/50">
                            {author.period} | {author.works} works
                          </p>
                        </div>
                        <Badge variant={author.language === 'Greek' ? 'greek' : 'latin'}>
                          {author.language}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedAuthor ? (
              <>
                <Card padding="lg">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#C9A962]/20 flex items-center justify-center text-2xl">
                      {selectedAuthor.name.charAt(0)}
                    </div>
                    <h2 className="text-2xl font-bold text-[#C9A962]">{selectedAuthor.name}</h2>
                    <div className="flex justify-center gap-2 mt-2">
                      <Badge variant={selectedAuthor.language === 'Greek' ? 'greek' : 'latin'}>
                        {selectedAuthor.language}
                      </Badge>
                      <Badge>{selectedAuthor.period}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-[#C9A962]/10 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[#C9A962]">{selectedAuthor.works}</div>
                      <div className="text-xs text-[#F5F3EF]/50">Works</div>
                    </div>
                    <div className="p-3 bg-[#C9A962]/10 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[#C9A962]">
                        {(selectedAuthor.influence * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-[#F5F3EF]/50">Influence</div>
                    </div>
                  </div>

                  {/* Author profile radar */}
                  <div className="h-48 -mx-4">
                    <RadarChart data={authorProfile} name={selectedAuthor.name} />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link href={`/reader?author=${encodeURIComponent(selectedAuthor.name)}`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">Read Works</Button>
                    </Link>
                    <Link href={`/chronos?author=${encodeURIComponent(selectedAuthor.name)}`} className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full">Timeline</Button>
                    </Link>
                  </div>
                </Card>

                {/* Connections */}
                <Card padding="lg">
                  <h3 className="font-semibold text-[#C9A962] mb-4">
                    Connections ({authorConnections.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {authorConnections.map((conn, i) => {
                      const otherAuthor = SAMPLE_AUTHORS.find(
                        (a) => a.id === (conn.source === selectedAuthor.id ? conn.target : conn.source)
                      );
                      const connType = CONNECTION_TYPES.find((t) => t.type === conn.type);
                      const isSource = conn.source === selectedAuthor.id;

                      return (
                        <button
                          key={i}
                          onClick={() => otherAuthor && setSelectedAuthor(otherAuthor)}
                          className="w-full text-left p-2 rounded-lg hover:bg-[#C9A962]/10 transition"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: connType?.color }}
                            />
                            <span className="text-sm text-[#F5F3EF]/50">{isSource ? '→' : '←'}</span>
                            <span className="font-medium text-sm">{otherAuthor?.name}</span>
                            <Badge size="sm" className="ml-auto">{connType?.label}</Badge>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </>
            ) : (
              <Card padding="lg" className="text-center">
                <div className="text-4xl mb-4">🕸️</div>
                <h3 className="text-lg text-[#C9A962] mb-2">Select an Author</h3>
                <p className="text-sm text-[#F5F3EF]/50">
                  Click on any node to explore intertextual connections
                </p>
              </Card>
            )}

            {/* Connection types legend */}
            <Card padding="lg">
              <h3 className="font-semibold text-[#C9A962] mb-4">Connection Types</h3>
              <div className="space-y-2">
                {CONNECTION_TYPES.map((type) => (
                  <div key={type.type} className="flex items-start gap-2">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: type.color }}
                    />
                    <div>
                      <div className="text-sm font-medium">{type.label}</div>
                      <div className="text-xs text-[#F5F3EF]/40">{type.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
