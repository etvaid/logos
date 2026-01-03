'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Card, Button, Badge, Select, Input, LoadingSpinner } from '@/components/ui';
import { ForceGraph, BarChart } from '@/components/charts';

interface Passage {
  id: string;
  urn: string;
  author: string;
  work: string;
  section: string;
  language: 'greek' | 'latin';
  date: number; // BCE negative, CE positive
  genre: string;
  preview: string;
}

interface Intertext {
  source: string;
  target: string;
  type: 'allusion' | 'quotation' | 'echo' | 'model' | 'parody';
  strength: number;
  direction: 'forward' | 'backward' | 'bidirectional';
}

interface GraphData {
  passages: Passage[];
  intertexts: Intertext[];
}

// Demo data for fallback
const DEMO_PASSAGES: Passage[] = [
  { id: 'il1', urn: 'urn:cts:greekLit:tlg0012.tlg001:1.1', author: 'Homer', work: 'Iliad', section: '1.1-7', language: 'greek', date: -750, genre: 'Epic', preview: 'Sing, goddess, the anger of Peleus\' son Achilleus...' },
  { id: 'od1', urn: 'urn:cts:greekLit:tlg0012.tlg002:1.1', author: 'Homer', work: 'Odyssey', section: '1.1-10', language: 'greek', date: -750, genre: 'Epic', preview: 'Tell me, Muse, of the man of many ways...' },
  { id: 'ae1', urn: 'urn:cts:latinLit:phi0690.phi003:1.1', author: 'Virgil', work: 'Aeneid', section: '1.1-7', language: 'latin', date: -19, genre: 'Epic', preview: 'Arms and the man I sing...' },
  { id: 'ge1', urn: 'urn:cts:latinLit:phi0690.phi001:1.1', author: 'Virgil', work: 'Georgics', section: '1.1-5', language: 'latin', date: -29, genre: 'Didactic', preview: 'What makes the crops joyous...' },
  { id: 'me1', urn: 'urn:cts:latinLit:phi0893.phi001:1.1', author: 'Ovid', work: 'Metamorphoses', section: '1.1-4', language: 'latin', date: 8, genre: 'Epic', preview: 'My mind carries me to tell of forms changed into new bodies...' },
  { id: 'th1', urn: 'urn:cts:greekLit:tlg0020.tlg001:1', author: 'Hesiod', work: 'Theogony', section: '1-21', language: 'greek', date: -700, genre: 'Theogony', preview: 'From the Heliconian Muses let us begin to sing...' },
  { id: 'wd1', urn: 'urn:cts:greekLit:tlg0020.tlg002:1', author: 'Hesiod', work: 'Works and Days', section: '1-10', language: 'greek', date: -700, genre: 'Didactic', preview: 'Muses of Pieria who give glory through song...' },
  { id: 'ap1', urn: 'urn:cts:greekLit:tlg0013.tlg003:1', author: 'Homeric Hymns', work: 'Hymn to Apollo', section: '1-13', language: 'greek', date: -650, genre: 'Hymn', preview: 'I will remember and not forget Apollo who shoots afar...' },
  { id: 'med1', urn: 'urn:cts:greekLit:tlg0006.tlg012:1', author: 'Euripides', work: 'Medea', section: '1-48', language: 'greek', date: -431, genre: 'Tragedy', preview: 'Would that the Argo had never sailed...' },
  { id: 'arg1', urn: 'urn:cts:greekLit:tlg0001.tlg001:1.1', author: 'Apollonius', work: 'Argonautica', section: '1.1-22', language: 'greek', date: -250, genre: 'Epic', preview: 'Beginning from you, Phoebus, I will recall the famous deeds...' },
  { id: 'pha1', urn: 'urn:cts:latinLit:phi0893.phi006:1', author: 'Ovid', work: 'Phaedra', section: '1-84', language: 'latin', date: 1, genre: 'Tragedy', preview: 'Go, hunt the shady groves...' },
  { id: 'sen1', urn: 'urn:cts:latinLit:phi1017.phi010:1', author: 'Seneca', work: 'Medea', section: '1-55', language: 'latin', date: 50, genre: 'Tragedy', preview: 'Gods of marriage, Lucina guardian of the marriage bed...' },
];

const DEMO_INTERTEXTS: Intertext[] = [
  { source: 'il1', target: 'ae1', type: 'model', strength: 0.95, direction: 'forward' },
  { source: 'od1', target: 'ae1', type: 'model', strength: 0.92, direction: 'forward' },
  { source: 'il1', target: 'od1', type: 'echo', strength: 0.88, direction: 'bidirectional' },
  { source: 'th1', target: 'ge1', type: 'model', strength: 0.78, direction: 'forward' },
  { source: 'wd1', target: 'ge1', type: 'model', strength: 0.82, direction: 'forward' },
  { source: 'ae1', target: 'me1', type: 'allusion', strength: 0.71, direction: 'forward' },
  { source: 'il1', target: 'me1', type: 'allusion', strength: 0.65, direction: 'forward' },
  { source: 'th1', target: 'me1', type: 'model', strength: 0.75, direction: 'forward' },
  { source: 'ap1', target: 'arg1', type: 'echo', strength: 0.68, direction: 'forward' },
  { source: 'med1', target: 'arg1', type: 'model', strength: 0.85, direction: 'backward' },
  { source: 'med1', target: 'sen1', type: 'model', strength: 0.92, direction: 'forward' },
  { source: 'pha1', target: 'sen1', type: 'echo', strength: 0.55, direction: 'forward' },
  { source: 'arg1', target: 'sen1', type: 'allusion', strength: 0.62, direction: 'forward' },
  { source: 'il1', target: 'arg1', type: 'model', strength: 0.72, direction: 'forward' },
  { source: 'od1', target: 'arg1', type: 'model', strength: 0.70, direction: 'forward' },
];

const CONNECTION_TYPES = [
  { type: 'model', label: 'Model/Imitation', color: '#C9A962', desc: 'Direct structural imitation' },
  { type: 'allusion', label: 'Allusion', color: '#4ECDC4', desc: 'Indirect reference' },
  { type: 'quotation', label: 'Quotation', color: '#FF6B6B', desc: 'Direct quotation' },
  { type: 'echo', label: 'Echo', color: '#DDA0DD', desc: 'Thematic resonance' },
  { type: 'parody', label: 'Parody', color: '#F7DC6F', desc: 'Satirical imitation' },
];

const TIME_PERIODS = [
  { year: -800, label: '800 BCE' },
  { year: -600, label: '600 BCE' },
  { year: -400, label: '400 BCE' },
  { year: -200, label: '200 BCE' },
  { year: 0, label: '1 CE' },
  { year: 100, label: '100 CE' },
];

export default function IntertextsMapPage() {
  const [passages, setPassages] = useState<Passage[]>(DEMO_PASSAGES);
  const [intertexts, setIntertexts] = useState<Intertext[]>(DEMO_INTERTEXTS);
  const [loading, setLoading] = useState(true);
  const [selectedPassage, setSelectedPassage] = useState<Passage | null>(null);
  const [timeRange, setTimeRange] = useState<[number, number]>([-800, 100]);
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [minStrength, setMinStrength] = useState(0.5);

  // Fetch graph data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/intertexts');
        if (res.ok) {
          const data: GraphData = await res.json();
          if (data.passages?.length > 0) setPassages(data.passages);
          if (data.intertexts?.length > 0) setIntertexts(data.intertexts);
        }
      } catch (error) {
        console.log('Using demo data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const genres = useMemo(() => [...new Set(passages.map((p) => p.genre))], [passages]);
  const languages = useMemo(() => [...new Set(passages.map((p) => p.language))], [passages]);

  // Filter passages by time range and other filters
  const filteredPassages = useMemo(() => {
    return passages.filter((p) => {
      if (p.date < timeRange[0] || p.date > timeRange[1]) return false;
      if (filterLanguage && p.language !== filterLanguage) return false;
      if (filterGenre && p.genre !== filterGenre) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.author.toLowerCase().includes(q) && !p.work.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [passages, timeRange, filterLanguage, filterGenre, searchQuery]);

  // Filter connections
  const filteredIntertexts = useMemo(() => {
    const passageIds = new Set(filteredPassages.map((p) => p.id));
    return intertexts.filter((i) => {
      if (!passageIds.has(i.source) || !passageIds.has(i.target)) return false;
      if (filterType && i.type !== filterType) return false;
      if (i.strength < minStrength) return false;
      return true;
    });
  }, [intertexts, filteredPassages, filterType, minStrength]);

  // Graph data
  const graphNodes = useMemo(() => {
    return filteredPassages.map((p) => ({
      id: p.id,
      name: `${p.author}: ${p.work}`,
      group: p.language,
      size: 10 + (intertexts.filter((i) => i.source === p.id || i.target === p.id).length * 3),
    }));
  }, [filteredPassages, intertexts]);

  const graphLinks = useMemo(() => {
    return filteredIntertexts.map((i) => ({
      source: i.source,
      target: i.target,
      type: i.type,
      value: i.strength,
    }));
  }, [filteredIntertexts]);

  // Connections for selected passage
  const selectedConnections = useMemo(() => {
    if (!selectedPassage) return [];
    return intertexts.filter((i) => i.source === selectedPassage.id || i.target === selectedPassage.id).map((i) => {
      const otherId = i.source === selectedPassage.id ? i.target : i.source;
      const other = passages.find((p) => p.id === otherId);
      return { ...i, other, isSource: i.source === selectedPassage.id };
    });
  }, [selectedPassage, passages, intertexts]);

  // Type distribution for selected passage
  const typeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    selectedConnections.forEach((c) => {
      counts[c.type] = (counts[c.type] || 0) + 1;
    });
    return CONNECTION_TYPES.map((t) => ({
      name: t.label,
      value: counts[t.type] || 0,
      color: t.color,
    })).filter((d) => d.value > 0);
  }, [selectedConnections]);

  const handleNodeClick = useCallback((node: { id: string }) => {
    const passage = passages.find((p) => p.id === node.id);
    setSelectedPassage(passage || null);
  }, [passages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-[#F5F3EF]/50">Loading intertextual network...</p>
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
                <span className="text-[#C9A962]">Intertextual</span> Map
              </h1>
              <p className="text-[#F5F3EF]/70">
                Force-directed graph of literary connections across the classical corpus
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A962]">{filteredPassages.length}</div>
                <div className="text-xs text-[#F5F3EF]/50">Passages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#87CEEB]">{filteredIntertexts.length}</div>
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
          <div className="space-y-4">
            {/* Time Slider */}
            <div>
              <label className="text-xs text-[#F5F3EF]/50 mb-2 block">Time Range: {timeRange[0]} to {timeRange[1] > 0 ? `${timeRange[1]} CE` : `${Math.abs(timeRange[1])} BCE`}</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={-800}
                  max={100}
                  step={50}
                  value={timeRange[0]}
                  onChange={(e) => setTimeRange([parseInt(e.target.value), timeRange[1]])}
                  className="flex-1 accent-[#C9A962]"
                />
                <input
                  type="range"
                  min={-800}
                  max={100}
                  step={50}
                  value={timeRange[1]}
                  onChange={(e) => setTimeRange([timeRange[0], parseInt(e.target.value)])}
                  className="flex-1 accent-[#C9A962]"
                />
              </div>
              <div className="flex justify-between text-xs text-[#F5F3EF]/40 mt-1">
                {TIME_PERIODS.map((p) => (
                  <span key={p.year}>{p.label}</span>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <Input
                placeholder="Search authors/works..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48"
              />
              <Select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                options={[{ value: '', label: 'All Languages' }, ...languages.map((l) => ({ value: l, label: l.charAt(0).toUpperCase() + l.slice(1) }))]}
                className="w-36"
              />
              <Select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                options={[{ value: '', label: 'All Genres' }, ...genres.map((g) => ({ value: g, label: g }))]}
                className="w-36"
              />
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                options={[{ value: '', label: 'All Connection Types' }, ...CONNECTION_TYPES.map((t) => ({ value: t.type, label: t.label }))]}
                className="w-48"
              />
              <div className="flex items-center gap-2">
                <label className="text-xs text-[#F5F3EF]/50">Min Strength:</label>
                <input
                  type="range"
                  min={0}
                  max={0.9}
                  step={0.1}
                  value={minStrength}
                  onChange={(e) => setMinStrength(parseFloat(e.target.value))}
                  className="w-20 accent-[#C9A962]"
                />
                <span className="text-xs text-[#F5F3EF]/70 w-8">{(minStrength * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Graph */}
          <div className="lg:col-span-2">
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Connection Network</h2>
              <ForceGraph
                nodes={graphNodes}
                links={graphLinks}
                width={700}
                height={500}
                selectedNodeId={selectedPassage?.id}
                onNodeClick={handleNodeClick}
                linkColors={CONNECTION_TYPES.reduce((acc, t) => ({ ...acc, [t.type]: t.color }), {})}
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
                <span className="text-xs text-[#F5F3EF]/50">Node size = connection count</span>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedPassage ? (
              <>
                <Card padding="lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-serif text-[#C9A962]">{selectedPassage.work}</h2>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPassage(null)}>x</Button>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#F5F3EF]/50">Author</span>
                      <span>{selectedPassage.author}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#F5F3EF]/50">Section</span>
                      <span>{selectedPassage.section}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#F5F3EF]/50">Date</span>
                      <span>{selectedPassage.date < 0 ? `${Math.abs(selectedPassage.date)} BCE` : `${selectedPassage.date} CE`}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#F5F3EF]/50">Language</span>
                      <Badge variant={selectedPassage.language === 'greek' ? 'greek' : 'latin'}>
                        {selectedPassage.language}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-[#C9A962]/5 rounded-lg">
                    <p className="text-sm text-[#F5F3EF]/70 font-serif italic">{selectedPassage.preview}</p>
                  </div>
                  <Link href={`/passage/${encodeURIComponent(selectedPassage.urn)}`}>
                    <Button variant="secondary" size="sm" className="w-full mt-4">
                      View Passage
                    </Button>
                  </Link>
                </Card>

                {/* Connections List */}
                <Card padding="lg">
                  <h3 className="font-semibold text-[#C9A962] mb-4">
                    Connections ({selectedConnections.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedConnections.map((conn, i) => {
                      const connType = CONNECTION_TYPES.find((t) => t.type === conn.type);
                      return (
                        <button
                          key={i}
                          onClick={() => conn.other && setSelectedPassage(conn.other)}
                          className="w-full text-left p-2 rounded-lg hover:bg-[#C9A962]/10 transition"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: connType?.color }} />
                            <span className="text-sm text-[#F5F3EF]/50">{conn.isSource ? '→' : '←'}</span>
                            <span className="font-medium text-sm truncate">{conn.other?.author}: {conn.other?.work}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1 ml-5">
                            <Badge size="sm">{connType?.label}</Badge>
                            <span className="text-xs text-[#F5F3EF]/50">{(conn.strength * 100).toFixed(0)}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Card>

                {/* Type Distribution */}
                {typeDistribution.length > 0 && (
                  <Card padding="lg">
                    <h3 className="font-semibold text-[#C9A962] mb-4">Connection Types</h3>
                    <BarChart data={typeDistribution} horizontal maxBars={5} />
                  </Card>
                )}
              </>
            ) : (
              <Card padding="lg" className="text-center">
                <div className="text-4xl mb-4">🕸</div>
                <h3 className="text-lg text-[#C9A962] mb-2">Select a Passage</h3>
                <p className="text-sm text-[#F5F3EF]/50">
                  Click on any node to explore its intertextual connections across the classical corpus.
                </p>
              </Card>
            )}

            {/* Connection types legend */}
            <Card padding="lg">
              <h3 className="font-semibold text-[#C9A962] mb-4">Connection Types</h3>
              <div className="space-y-2">
                {CONNECTION_TYPES.map((type) => (
                  <div key={type.type} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: type.color }} />
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
