'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card, Button, Input, Badge, Tabs } from '@/components/ui';
import { DonutChart, BarChart } from '@/components/charts';

interface Fragment {
  id: string;
  text: string;
  source: string;
  sourceAuthor: string;
  sourceWork: string;
  language: 'greek' | 'latin';
  confidence: 'high' | 'medium' | 'low';
  context?: string;
}

interface LostWork {
  id: string;
  title: string;
  author: string;
  authorDates: string;
  language: 'greek' | 'latin';
  genre: string;
  estimatedLength: string;
  lostDate?: string;
  fragments: Fragment[];
  citations: number;
  reconstructionProgress: number;
  description: string;
  significance: string;
  knownSections?: string[];
  relatedWorks?: { title: string; author: string; relation: string }[];
}

// Major lost works with their fragments
const LOST_WORKS: LostWork[] = [
  {
    id: 'aristotle-dialogues',
    title: 'Dialogues',
    author: 'Aristotle',
    authorDates: '384-322 BCE',
    language: 'greek',
    genre: 'Philosophy',
    estimatedLength: '~30 dialogues',
    lostDate: '3rd century CE',
    fragments: [
      {
        id: 'ar-d-1',
        text: 'ὁ δὲ νοῦς ἐστι τὸ θεῖον ἐν ἡμῖν',
        source: 'Protrepticus, Fragment B108',
        sourceAuthor: 'Iamblichus',
        sourceWork: 'Protrepticus',
        language: 'greek',
        confidence: 'high',
        context: 'On the divine nature of reason',
      },
      {
        id: 'ar-d-2',
        text: 'φρόνησις γὰρ ἀρετὴ διανοίας',
        source: 'Eudemus, Fragment 41',
        sourceAuthor: 'Plutarch',
        sourceWork: 'Moralia',
        language: 'greek',
        confidence: 'medium',
      },
      {
        id: 'ar-d-3',
        text: 'τὸ ζῆν διττόν, τὸ μὲν κατὰ δύναμιν τὸ δὲ κατ᾽ ἐνέργειαν',
        source: 'Eudemus, Fragment 37',
        sourceAuthor: 'Simplicius',
        sourceWork: 'Commentary on Physics',
        language: 'greek',
        confidence: 'high',
      },
    ],
    citations: 127,
    reconstructionProgress: 15,
    description: 'Aristotle\'s published dialogues were famous in antiquity for their literary beauty, described by Cicero as "a river of gold." Unlike his surviving lecture notes, these were polished works intended for public consumption.',
    significance: 'Would reveal Aristotle\'s literary style and early Platonic influences',
    knownSections: ['Eudemus (On the Soul)', 'Protrepticus', 'On Philosophy', 'Gryllus', 'Nerinthus'],
    relatedWorks: [
      { title: 'Phaedo', author: 'Plato', relation: 'Eudemus modeled after' },
      { title: 'Hortensius', author: 'Cicero', relation: 'Inspired by Protrepticus' },
    ],
  },
  {
    id: 'livy-books',
    title: 'Ab Urbe Condita (Books 11-20, 46-142)',
    author: 'Livy',
    authorDates: '59 BCE - 17 CE',
    language: 'latin',
    genre: 'History',
    estimatedLength: '107 lost books',
    lostDate: '5th-6th century CE',
    fragments: [
      {
        id: 'livy-1',
        text: 'Hannibal cum exercitu Alpes transit',
        source: 'Periochae 21',
        sourceAuthor: 'Anonymous',
        sourceWork: 'Periochae',
        language: 'latin',
        confidence: 'high',
        context: 'Summary of Hannibal\'s crossing',
      },
      {
        id: 'livy-2',
        text: 'bellum quod populus Romanus cum Iugurtha rege Numidarum gessit',
        source: 'Periochae 62',
        sourceAuthor: 'Anonymous',
        sourceWork: 'Periochae',
        language: 'latin',
        confidence: 'high',
      },
    ],
    citations: 89,
    reconstructionProgress: 8,
    description: 'Livy\'s monumental history of Rome originally comprised 142 books, of which only 35 survive complete. The lost books covered the period from 292 BCE to 9 BCE, including the Punic Wars and the fall of the Republic.',
    significance: 'Primary source for late Republican Rome lost',
    knownSections: ['Second Punic War (21-30)', 'Macedonian Wars (31-45)', 'Civil Wars (109-142)'],
    relatedWorks: [
      { title: 'Periochae', author: 'Anonymous', relation: 'Summaries preserve outline' },
      { title: 'Histories', author: 'Polybius', relation: 'Parallel source' },
    ],
  },
  {
    id: 'sappho-poems',
    title: 'Complete Poems (Books 1-9)',
    author: 'Sappho',
    authorDates: '630-570 BCE',
    language: 'greek',
    genre: 'Lyric Poetry',
    estimatedLength: '~10,000 lines',
    lostDate: 'Medieval period',
    fragments: [
      {
        id: 'sappho-1',
        text: 'ποικιλόθρον᾽ ἀθανάτ᾽ Ἀφρόδιτα, παῖ Δίος δολόπλοκε',
        source: 'Fragment 1 (complete)',
        sourceAuthor: 'Dionysius of Halicarnassus',
        sourceWork: 'On Composition',
        language: 'greek',
        confidence: 'high',
        context: 'Hymn to Aphrodite - only complete poem',
      },
      {
        id: 'sappho-2',
        text: 'φαίνεταί μοι κῆνος ἴσος θέοισιν ἔμμεν᾽ ὤνηρ',
        source: 'Fragment 31',
        sourceAuthor: 'Longinus',
        sourceWork: 'On the Sublime',
        language: 'greek',
        confidence: 'high',
      },
      {
        id: 'sappho-3',
        text: 'δέδυκε μὲν ἀ σελάννα καὶ Πληΐαδες',
        source: 'Fragment 168B',
        sourceAuthor: 'Hephaestion',
        sourceWork: 'Handbook on Meters',
        language: 'greek',
        confidence: 'medium',
      },
    ],
    citations: 264,
    reconstructionProgress: 7,
    description: 'Sappho\'s nine books of poetry, organized by meter in Alexandria, were reduced to fragments through neglect and possibly censorship. Only one complete poem survives, though papyrus discoveries continue to add new fragments.',
    significance: 'Greatest female poet of antiquity, "Tenth Muse"',
    knownSections: ['Wedding Songs', 'Hymns to Aphrodite', 'Love Poems'],
    relatedWorks: [
      { title: 'Odes', author: 'Horace', relation: 'Adapted Sapphic meter' },
      { title: 'Poems', author: 'Catullus', relation: 'Translated Fragment 31' },
    ],
  },
  {
    id: 'cicero-de-republica',
    title: 'De Re Publica (Complete)',
    author: 'Cicero',
    authorDates: '106-43 BCE',
    language: 'latin',
    genre: 'Philosophy',
    estimatedLength: '6 books',
    lostDate: '7th century CE',
    fragments: [
      {
        id: 'cicero-rp-1',
        text: 'Est igitur res publica res populi, populus autem non omnis hominum coetus quoquo modo congregatus',
        source: 'Book 1.39',
        sourceAuthor: 'Cicero',
        sourceWork: 'Palimpsest',
        language: 'latin',
        confidence: 'high',
        context: 'Definition of the republic',
      },
      {
        id: 'cicero-rp-2',
        text: 'Somnium Scipionis',
        source: 'Book 6',
        sourceAuthor: 'Macrobius',
        sourceWork: 'Commentary',
        language: 'latin',
        confidence: 'high',
        context: 'Dream of Scipio - preserved complete',
      },
    ],
    citations: 156,
    reconstructionProgress: 35,
    description: 'Cicero\'s treatise on the ideal state, modeled on Plato\'s Republic but set in Roman context. About a third survives from a palimpsest discovered in 1819, plus the Somnium Scipionis preserved by Macrobius.',
    significance: 'Major work of Roman political philosophy',
    knownSections: ['Mixed Constitution', 'Best Citizen', 'Dream of Scipio'],
    relatedWorks: [
      { title: 'Republic', author: 'Plato', relation: 'Model' },
      { title: 'Politics', author: 'Aristotle', relation: 'Parallel treatment' },
    ],
  },
  {
    id: 'ovid-medea',
    title: 'Medea',
    author: 'Ovid',
    authorDates: '43 BCE - 17 CE',
    language: 'latin',
    genre: 'Tragedy',
    estimatedLength: '~1,500 lines',
    lostDate: 'Unknown',
    fragments: [
      {
        id: 'ovid-m-1',
        text: 'feror huc illuc, vae, plena deo',
        source: 'Fragment 1',
        sourceAuthor: 'Seneca',
        sourceWork: 'De Ira',
        language: 'latin',
        confidence: 'high',
        context: 'Medea\'s divine possession',
      },
      {
        id: 'ovid-m-2',
        text: 'servare potui: perdere an possim rogas?',
        source: 'Fragment 2',
        sourceAuthor: 'Quintilian',
        sourceWork: 'Institutio Oratoria',
        language: 'latin',
        confidence: 'high',
      },
    ],
    citations: 23,
    reconstructionProgress: 3,
    description: 'Ovid\'s tragedy on Medea was praised by Quintilian as showing "how much he could have achieved had he controlled his talent." Only two lines survive, but its influence on Seneca\'s Medea is evident.',
    significance: 'Praised as Ovid\'s masterpiece by ancient critics',
    relatedWorks: [
      { title: 'Medea', author: 'Euripides', relation: 'Greek original' },
      { title: 'Medea', author: 'Seneca', relation: 'Influenced by' },
    ],
  },
  {
    id: 'ennius-annales',
    title: 'Annales (Complete)',
    author: 'Ennius',
    authorDates: '239-169 BCE',
    language: 'latin',
    genre: 'Epic Poetry',
    estimatedLength: '18 books, ~30,000 lines',
    lostDate: '5th century CE',
    fragments: [
      {
        id: 'ennius-1',
        text: 'O Tite, tute, Tati, tibi tanta, tyranne, tulisti',
        source: 'Fragment 109',
        sourceAuthor: 'Cicero',
        sourceWork: 'De Oratore',
        language: 'latin',
        confidence: 'high',
        context: 'Famous alliterative line',
      },
      {
        id: 'ennius-2',
        text: 'Moribus antiquis res stat Romana virisque',
        source: 'Fragment 500',
        sourceAuthor: 'Augustine',
        sourceWork: 'City of God',
        language: 'latin',
        confidence: 'high',
      },
    ],
    citations: 420,
    reconstructionProgress: 12,
    description: 'The first great Latin epic, covering Roman history from Aeneas to Ennius\'s own time. It introduced the hexameter to Latin poetry and was the Roman national epic before the Aeneid.',
    significance: 'Father of Roman poetry, defined Latin hexameter',
    relatedWorks: [
      { title: 'Iliad/Odyssey', author: 'Homer', relation: 'Greek model' },
      { title: 'Aeneid', author: 'Virgil', relation: 'Superseded Annales' },
    ],
  },
  {
    id: 'tacitus-histories',
    title: 'Histories (Complete)',
    author: 'Tacitus',
    authorDates: '56-120 CE',
    language: 'latin',
    genre: 'History',
    estimatedLength: '14 books (9 lost)',
    lostDate: 'Medieval period',
    fragments: [],
    citations: 34,
    reconstructionProgress: 36,
    description: 'Tacitus\'s Histories originally covered 69-96 CE in 14 books. Only books 1-4 and part of 5 survive, covering just 69-70 CE. The lost books described the Flavian dynasty.',
    significance: 'Lost account of Flavian Rome',
    knownSections: ['Year of Four Emperors (1-4)', 'Jewish War (5)', 'Domitian (lost)'],
    relatedWorks: [
      { title: 'Annals', author: 'Tacitus', relation: 'Companion work' },
      { title: 'Jewish War', author: 'Josephus', relation: 'Parallel source' },
    ],
  },
  {
    id: 'aeschylus-plays',
    title: 'Lost Tragedies',
    author: 'Aeschylus',
    authorDates: '525-456 BCE',
    language: 'greek',
    genre: 'Tragedy',
    estimatedLength: '~80 plays (73 lost)',
    lostDate: 'Byzantine period',
    fragments: [
      {
        id: 'aesch-1',
        text: 'νῦν δ᾽ ἀτιμάζουσι δεινὰ πράγματα θεοί',
        source: 'Niobe, Fragment 154a',
        sourceAuthor: 'Stobaeus',
        sourceWork: 'Anthology',
        language: 'greek',
        confidence: 'medium',
      },
    ],
    citations: 187,
    reconstructionProgress: 5,
    description: 'Aeschylus wrote approximately 80-90 plays, winning 13 first prizes at the Dionysia. Only 7 complete plays survive: The Persians, Seven Against Thebes, Suppliants, the Oresteia trilogy, and Prometheus Bound (authorship disputed).',
    significance: 'Father of tragedy, invented second actor',
    knownSections: ['Myrmidons', 'Niobe', 'Prometheus Unbound', 'Daughters of Helios'],
    relatedWorks: [
      { title: 'Oresteia', author: 'Aeschylus', relation: 'Surviving trilogy' },
    ],
  },
];

// Statistics
const GENRE_STATS = [
  { name: 'History', value: 3, color: '#C9A962' },
  { name: 'Philosophy', value: 2, color: '#4ECDC4' },
  { name: 'Poetry', value: 2, color: '#FF6B6B' },
  { name: 'Tragedy', value: 1, color: '#DDA0DD' },
];

const PERIOD_STATS = [
  { name: 'Archaic', value: 2, color: '#FF6B6B' },
  { name: 'Classical', value: 2, color: '#4ECDC4' },
  { name: 'Hellenistic', value: 1, color: '#45B7D1' },
  { name: 'Roman', value: 3, color: '#C9A962' },
];

export default function GhostPage() {
  const [selectedWork, setSelectedWork] = useState<LostWork | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<'all' | 'greek' | 'latin'>('all');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('fragments');
  const [reconstruction, setReconstruction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredWorks = useMemo(() => {
    return LOST_WORKS.filter((work) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!work.title.toLowerCase().includes(q) &&
            !work.author.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filterLanguage !== 'all' && work.language !== filterLanguage) return false;
      if (filterGenre !== 'all' && work.genre !== filterGenre) return false;
      return true;
    });
  }, [searchQuery, filterLanguage, filterGenre]);

  const genres = useMemo(() => {
    const set = new Set(LOST_WORKS.map(w => w.genre));
    return ['all', ...Array.from(set)];
  }, []);

  const totalFragments = useMemo(() => {
    return LOST_WORKS.reduce((sum, w) => sum + w.fragments.length, 0);
  }, []);

  const totalCitations = useMemo(() => {
    return LOST_WORKS.reduce((sum, w) => sum + w.citations, 0);
  }, []);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-[#F5F3EF]/50';
    }
  };

  const reconstruct = async (workId: string) => {
    setLoading(true);
    setReconstruction(null);
    try {
      const res = await fetch('https://logos-backend-production-0d96.up.railway.app/ghost/reconstruct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ work_id: workId, method: 'contextual' })
      });
      const data = await res.json();
      setReconstruction(data.reconstruction);
    } catch (e) {
      setReconstruction('Unable to generate reconstruction. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#C9A962]">GHOST</span>
          </h1>
          <p className="text-[#F5F3EF]/70">
            Reconstruction of lost classical works through fragments and citations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-[#C9A962]">{LOST_WORKS.length}</div>
            <div className="text-sm text-[#F5F3EF]/50">Major Lost Works</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-[#C9A962]">{totalFragments}</div>
            <div className="text-sm text-[#F5F3EF]/50">Surviving Fragments</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-[#C9A962]">{totalCitations}</div>
            <div className="text-sm text-[#F5F3EF]/50">Ancient Citations</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-[#C9A962]">~95%</div>
            <div className="text-sm text-[#F5F3EF]/50">Literature Lost</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Works List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <Card>
              <div className="flex flex-wrap gap-4">
                <Input
                  type="text"
                  placeholder="Search works or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <div className="flex gap-2">
                  <Button
                    variant={filterLanguage === 'all' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilterLanguage('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterLanguage === 'greek' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilterLanguage('greek')}
                  >
                    Greek
                  </Button>
                  <Button
                    variant={filterLanguage === 'latin' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilterLanguage('latin')}
                  >
                    Latin
                  </Button>
                </div>
              </div>
            </Card>

            {/* Works Grid */}
            <div className="space-y-4">
              {filteredWorks.map((work) => (
                <Card
                  key={work.id}
                  className={`cursor-pointer transition-all ${
                    selectedWork?.id === work.id
                      ? 'ring-2 ring-[#C9A962]'
                      : 'hover:border-[#C9A962]/40'
                  }`}
                  onClick={() => { setSelectedWork(work); setReconstruction(null); }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-serif text-[#C9A962]">{work.title}</h3>
                        <Badge variant={work.language === 'greek' ? 'greek' : 'latin'}>
                          {work.language}
                        </Badge>
                        <Badge variant="default">{work.genre}</Badge>
                      </div>
                      <p className="text-sm text-[#F5F3EF]/60">
                        {work.author} ({work.authorDates})
                      </p>
                      <p className="text-sm text-[#F5F3EF]/50 mt-2 line-clamp-2">
                        {work.description}
                      </p>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-sm text-[#F5F3EF]/50">Reconstruction</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-2 bg-[#C9A962]/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C9A962] rounded-full"
                            style={{ width: `${work.reconstructionProgress}%` }}
                          />
                        </div>
                        <span className="text-sm text-[#C9A962]">{work.reconstructionProgress}%</span>
                      </div>
                      <div className="text-xs text-[#F5F3EF]/40 mt-1">
                        {work.fragments.length} fragments
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar / Detail Panel */}
          <div className="space-y-6">
            {selectedWork ? (
              <>
                {/* Work Details */}
                <Card padding="lg">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-serif text-[#C9A962]">{selectedWork.title}</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedWork(null)}
                    >
                      ×
                    </Button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#F5F3EF]/50">Author</span>
                      <span className="text-[#F5F3EF]">{selectedWork.author}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#F5F3EF]/50">Dates</span>
                      <span className="text-[#F5F3EF]">{selectedWork.authorDates}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#F5F3EF]/50">Est. Length</span>
                      <span className="text-[#F5F3EF]">{selectedWork.estimatedLength}</span>
                    </div>
                    {selectedWork.lostDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#F5F3EF]/50">Lost</span>
                        <span className="text-[#F5F3EF]">{selectedWork.lostDate}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-[#F5F3EF]/50">Citations</span>
                      <span className="text-[#F5F3EF]">{selectedWork.citations}</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#F5F3EF]/70 mb-4">
                    {selectedWork.description}
                  </p>

                  <div className="p-3 bg-[#C9A962]/5 rounded-lg">
                    <p className="text-sm text-[#C9A962] font-medium">Significance</p>
                    <p className="text-sm text-[#F5F3EF]/70">{selectedWork.significance}</p>
                  </div>
                </Card>

                {/* Tabs */}
                <Card padding="lg">
                  <Tabs
                    tabs={[
                      { id: 'fragments', label: 'Fragments' },
                      { id: 'sections', label: 'Known Sections' },
                      { id: 'related', label: 'Related Works' },
                    ]}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                  />

                  <div className="mt-4">
                    {activeTab === 'fragments' && (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {selectedWork.fragments.length > 0 ? (
                          selectedWork.fragments.map((frag) => (
                            <div key={frag.id} className="p-3 bg-[#C9A962]/5 rounded-lg">
                              <p className="font-serif text-[#F5F3EF]/90 mb-2">{frag.text}</p>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#F5F3EF]/50">{frag.source}</span>
                                <span className={getConfidenceColor(frag.confidence)}>
                                  {frag.confidence} confidence
                                </span>
                              </div>
                              <p className="text-xs text-[#F5F3EF]/40 mt-1">
                                via {frag.sourceAuthor}, {frag.sourceWork}
                              </p>
                              {frag.context && (
                                <p className="text-xs text-[#C9A962]/60 mt-1 italic">
                                  {frag.context}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-[#F5F3EF]/50 text-center py-4">
                            No direct fragments survive. Reconstruction relies on ancient summaries and references.
                          </p>
                        )}
                      </div>
                    )}

                    {activeTab === 'sections' && (
                      <div className="space-y-2">
                        {selectedWork.knownSections?.map((section, i) => (
                          <div key={i} className="p-2 bg-[#C9A962]/5 rounded text-sm">
                            {section}
                          </div>
                        )) || (
                          <p className="text-sm text-[#F5F3EF]/50">No known sections recorded.</p>
                        )}
                      </div>
                    )}

                    {activeTab === 'related' && (
                      <div className="space-y-2">
                        {selectedWork.relatedWorks?.map((rel, i) => (
                          <div key={i} className="p-2 bg-[#C9A962]/5 rounded">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#F5F3EF]">{rel.title}</span>
                              <span className="text-[#F5F3EF]/50">{rel.author}</span>
                            </div>
                            <p className="text-xs text-[#C9A962]/70">{rel.relation}</p>
                          </div>
                        )) || (
                          <p className="text-sm text-[#F5F3EF]/50">No related works documented.</p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>

                {/* AI Reconstruction */}
                <Card padding="lg">
                  <h3 className="text-sm font-semibold text-[#C9A962] mb-3">AI Reconstruction</h3>
                  <p className="text-xs text-[#F5F3EF]/50 mb-3">
                    Generate a hypothetical reconstruction based on surviving fragments and ancient testimony.
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full"
                    loading={loading}
                    onClick={() => reconstruct(selectedWork.id)}
                  >
                    Generate Reconstruction
                  </Button>
                  {reconstruction && (
                    <div className="mt-4 p-3 bg-[#0D0D0F] rounded-lg border border-[#C9A962]/20">
                      <p className="text-sm text-[#F5F3EF]/70 whitespace-pre-wrap">{reconstruction}</p>
                      <p className="text-xs text-red-400/70 mt-2 flex items-center gap-1">
                        <span>⚠️</span>
                        AI-generated speculation, not recovered text
                      </p>
                    </div>
                  )}
                </Card>

                <Link href={`/search?q=${encodeURIComponent(selectedWork.author)}`}>
                  <Button variant="secondary" className="w-full">
                    Search Surviving Works
                  </Button>
                </Link>
              </>
            ) : (
              <Card padding="lg">
                <h3 className="text-lg font-semibold text-[#C9A962] mb-3">Select a Work</h3>
                <p className="text-sm text-[#F5F3EF]/60 mb-4">
                  Click on any lost work to explore its surviving fragments, ancient citations, and reconstruction progress.
                </p>
                <div className="text-sm text-[#F5F3EF]/50">
                  <p className="mb-2">Estimated 95% of ancient literature has been lost:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>~2,000 Greek tragedies → 33 survive</li>
                    <li>~30 Aristotle dialogues → 0 survive</li>
                    <li>Livy's 142 books → 35 survive</li>
                    <li>Sappho's 10,000 lines → 650 survive</li>
                  </ul>
                </div>
              </Card>
            )}

            {/* Genre Distribution */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Lost Works by Genre</h3>
              <DonutChart data={GENRE_STATS} size={160} showLegend={false} />
              <div className="mt-4 space-y-1">
                {GENRE_STATS.map((s) => (
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

            {/* Period Distribution */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-4">By Period</h3>
              <BarChart data={PERIOD_STATS} horizontal maxBars={4} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
