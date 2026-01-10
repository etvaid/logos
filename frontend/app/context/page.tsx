'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Button, Select, Badge, Input } from '@/components/ui';

// Historical periods
const PERIODS = [
  {
    id: 'archaic',
    name: 'Archaic Period',
    dates: '800-480 BCE',
    description: 'The formative era of Greek civilization, witnessing the emergence of the city-state (polis), colonization, and the development of epic poetry.',
    keyEvents: [
      { year: -776, event: 'First Olympic Games' },
      { year: -750, event: 'Homer composes Iliad and Odyssey' },
      { year: -621, event: 'Draco\'s law code in Athens' },
      { year: -594, event: 'Solon\'s reforms in Athens' },
      { year: -508, event: 'Cleisthenes establishes democracy' },
    ],
    keyFigures: ['Homer', 'Hesiod', 'Sappho', 'Solon'],
    literature: ['Epic poetry', 'Lyric poetry', 'Elegiac poetry'],
  },
  {
    id: 'classical',
    name: 'Classical Period',
    dates: '480-323 BCE',
    description: 'The golden age of Greek civilization, marked by Athenian democracy, philosophical inquiry, dramatic festivals, and the Macedonian conquest.',
    keyEvents: [
      { year: -480, event: 'Battle of Thermopylae and Salamis' },
      { year: -461, event: 'Age of Pericles begins' },
      { year: -431, event: 'Peloponnesian War begins' },
      { year: -399, event: 'Trial and death of Socrates' },
      { year: -338, event: 'Philip II conquers Greece' },
      { year: -323, event: 'Death of Alexander the Great' },
    ],
    keyFigures: ['Aeschylus', 'Sophocles', 'Euripides', 'Aristophanes', 'Socrates', 'Plato', 'Aristotle'],
    literature: ['Tragedy', 'Comedy', 'History', 'Philosophy', 'Oratory'],
  },
  {
    id: 'hellenistic',
    name: 'Hellenistic Period',
    dates: '323-31 BCE',
    description: 'The spread of Greek culture across the Mediterranean and Near East following Alexander\'s conquests, characterized by new literary forms and philosophical schools.',
    keyEvents: [
      { year: -323, event: 'Division of Alexander\'s empire' },
      { year: -280, event: 'Library of Alexandria founded' },
      { year: -146, event: 'Rome destroys Corinth' },
      { year: -31, event: 'Battle of Actium' },
    ],
    keyFigures: ['Callimachus', 'Apollonius', 'Theocritus', 'Menander', 'Epicurus', 'Zeno'],
    literature: ['Epigram', 'Pastoral poetry', 'New Comedy', 'Scholarship'],
  },
  {
    id: 'republican',
    name: 'Roman Republic',
    dates: '509-27 BCE',
    description: 'The rise of Rome from city-state to Mediterranean superpower, with the development of Latin literature under Greek influence.',
    keyEvents: [
      { year: -509, event: 'Establishment of Roman Republic' },
      { year: -264, event: 'First Punic War begins' },
      { year: -146, event: 'Destruction of Carthage' },
      { year: -63, event: 'Consulship of Cicero' },
      { year: -44, event: 'Assassination of Julius Caesar' },
    ],
    keyFigures: ['Plautus', 'Terence', 'Lucretius', 'Catullus', 'Cicero', 'Caesar', 'Sallust'],
    literature: ['Comedy', 'Satire', 'Oratory', 'History', 'Philosophy'],
  },
  {
    id: 'augustan',
    name: 'Augustan Age',
    dates: '27 BCE - 14 CE',
    description: 'The golden age of Latin literature under the patronage of Augustus, producing some of Rome\'s greatest poetry.',
    keyEvents: [
      { year: -27, event: 'Augustus becomes first emperor' },
      { year: -19, event: 'Death of Virgil' },
      { year: -8, event: 'Death of Horace' },
      { year: 8, event: 'Exile of Ovid' },
    ],
    keyFigures: ['Virgil', 'Horace', 'Ovid', 'Livy', 'Propertius', 'Tibullus'],
    literature: ['Epic', 'Lyric', 'Elegy', 'History'],
  },
  {
    id: 'imperial',
    name: 'Imperial Period',
    dates: '14-476 CE',
    description: 'The long span of Roman imperial rule, witnessing changes in literary taste, the rise of Christianity, and eventual decline.',
    keyEvents: [
      { year: 64, event: 'Great Fire of Rome under Nero' },
      { year: 79, event: 'Eruption of Vesuvius' },
      { year: 117, event: 'Empire at greatest extent under Trajan' },
      { year: 313, event: 'Edict of Milan (Christianity legalized)' },
      { year: 476, event: 'Fall of Western Roman Empire' },
    ],
    keyFigures: ['Seneca', 'Lucan', 'Petronius', 'Martial', 'Tacitus', 'Juvenal', 'Apuleius'],
    literature: ['Stoic philosophy', 'Satire', 'History', 'Novel', 'Silver Age poetry'],
  },
];

// Cultural topics with comprehensive content
const TOPICS = [
  {
    id: 'religion',
    name: 'Religion & Mythology',
    icon: '🏛️',
    description: 'Ancient Greek and Roman religion was polytheistic, with gods representing natural forces and human experiences. Religious practice included public festivals, sacrifices, oracles, and mystery cults.',
    keyAspects: [
      'Olympian gods and goddesses (Zeus, Athena, Apollo, etc.)',
      'Mystery cults (Eleusinian Mysteries, Dionysian rites)',
      'Oracle sites (Delphi, Dodona)',
      'Public festivals (Panathenaea, Saturnalia)',
      'Hero worship and ancestor veneration',
      'Religious syncretism in Hellenistic period',
    ],
    relatedWorks: ['Hesiod - Theogony', 'Homer - Hymns', 'Ovid - Metamorphoses'],
  },
  {
    id: 'politics',
    name: 'Politics & Law',
    icon: '⚖️',
    description: 'Political systems evolved from monarchy through aristocracy to democracy in Athens, while Rome developed from republic to empire. Law codes and political philosophy shaped Western governance.',
    keyAspects: [
      'Athenian democracy and citizenship',
      'Roman Republic and Senate',
      'Law codes (Twelve Tables, Justinian Code)',
      'Political philosophy (Plato\'s Republic, Aristotle\'s Politics)',
      'Imperial governance and provincial administration',
      'Political oratory and rhetoric',
    ],
    relatedWorks: ['Plato - Republic', 'Aristotle - Politics', 'Cicero - De Re Publica'],
  },
  {
    id: 'daily',
    name: 'Daily Life',
    icon: '🏠',
    description: 'Daily life centered on family, work, and social obligations. Housing, food, clothing, and entertainment varied by social class, with significant differences between urban and rural life.',
    keyAspects: [
      'Family structure and gender roles',
      'Housing and domestic architecture',
      'Food, dining, and symposia',
      'Clothing and personal adornment',
      'Slavery and household economy',
      'Entertainment (theater, games, festivals)',
    ],
    relatedWorks: ['Xenophon - Oeconomicus', 'Juvenal - Satires', 'Martial - Epigrams'],
  },
  {
    id: 'war',
    name: 'Warfare',
    icon: '⚔️',
    description: 'Warfare was central to classical civilization, from Greek hoplite battles to Roman legionary conquests. Military organization, tactics, and technology evolved significantly over time.',
    keyAspects: [
      'Hoplite warfare and phalanx formation',
      'Naval warfare (triremes, Battle of Salamis)',
      'Roman legions and military discipline',
      'Siege warfare and military engineering',
      'Military leadership and strategy',
      'War memorials and victory monuments',
    ],
    relatedWorks: ['Thucydides - History', 'Caesar - Gallic Wars', 'Polybius - Histories'],
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    description: 'Education prepared elite males for public life through grammar, rhetoric, and philosophy. Schools, private tutors, and philosophical academies provided instruction at various levels.',
    keyAspects: [
      'Elementary education (grammatistes)',
      'Rhetorical training and sophists',
      'Philosophical schools (Academy, Lyceum, Stoa)',
      'Physical education and gymnastics',
      'Role of Homer and canonical texts',
      'Education for women and non-citizens',
    ],
    relatedWorks: ['Plato - Meno', 'Quintilian - Institutio Oratoria', 'Plutarch - Education of Children'],
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    icon: '🤔',
    description: 'Ancient philosophy explored fundamental questions about reality, knowledge, ethics, and human nature. Major schools included Platonism, Aristotelianism, Stoicism, and Epicureanism.',
    keyAspects: [
      'Pre-Socratic natural philosophy',
      'Socratic method and ethical inquiry',
      'Platonic forms and ideal state',
      'Aristotelian logic and natural science',
      'Stoic ethics and cosmopolitanism',
      'Epicurean atomism and pleasure',
    ],
    relatedWorks: ['Plato - Dialogues', 'Aristotle - Ethics', 'Marcus Aurelius - Meditations'],
  },
  {
    id: 'art',
    name: 'Art & Architecture',
    icon: '🏺',
    description: 'Classical art and architecture established enduring aesthetic principles. From Greek temples to Roman arches, artistic achievement spanned sculpture, painting, pottery, and monumental building.',
    keyAspects: [
      'Greek architectural orders (Doric, Ionic, Corinthian)',
      'Temple architecture (Parthenon, Pantheon)',
      'Sculpture (Phidias, Praxiteles)',
      'Pottery and vase painting',
      'Roman engineering (aqueducts, roads, arches)',
      'Mosaics and wall painting',
    ],
    relatedWorks: ['Vitruvius - De Architectura', 'Pliny - Natural History (Art sections)', 'Pausanias - Description of Greece'],
  },
  {
    id: 'economy',
    name: 'Economy & Trade',
    icon: '💰',
    description: 'The ancient economy was based on agriculture, supplemented by trade, manufacturing, and slave labor. Trade networks connected the Mediterranean world, facilitating cultural and economic exchange.',
    keyAspects: [
      'Agriculture and land ownership',
      'Trade routes and merchant activity',
      'Coinage and monetary systems',
      'Slavery and labor systems',
      'Craft production and workshops',
      'Markets, ports, and commercial infrastructure',
    ],
    relatedWorks: ['Xenophon - Ways and Means', 'Cato - De Agricultura', 'Columella - De Re Rustica'],
  },
];

export default function ContextPage() {
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[1]); // Classical by default
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#C9A962]">CONTEXT</span>
          </h1>
          <p className="text-[#F5F3EF]/70">
            Historical and cultural background for classical texts
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        {/* Period selector */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {PERIODS.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                selectedPeriod.id === period.id
                  ? 'bg-[#C9A962] text-[#0D0D0F]'
                  : 'bg-[#C9A962]/10 text-[#C9A962] hover:bg-[#C9A962]/20'
              }`}
            >
              {period.name}
            </button>
          ))}
        </div>

        {/* Selected period details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Period overview */}
            <Card padding="lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#C9A962]">{selectedPeriod.name}</h2>
                  <p className="text-[#F5F3EF]/50">{selectedPeriod.dates}</p>
                </div>
                <Badge variant="success">{selectedPeriod.dates.split(' ')[0]}</Badge>
              </div>
              <p className="text-[#F5F3EF]/80 leading-relaxed">{selectedPeriod.description}</p>
            </Card>

            {/* Timeline */}
            <Card padding="lg">
              <h3 className="text-xl font-semibold text-[#C9A962] mb-4">Key Events</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#C9A962]/20" />
                <div className="space-y-4">
                  {selectedPeriod.keyEvents.map((event, i) => (
                    <div key={i} className="flex items-start gap-4 pl-8 relative">
                      <div className="absolute left-2.5 w-3 h-3 rounded-full bg-[#C9A962] border-2 border-[#0D0D0F]" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[#C9A962] font-mono text-sm">
                            {event.year > 0 ? `${event.year} CE` : `${Math.abs(event.year)} BCE`}
                          </span>
                        </div>
                        <p className="text-[#F5F3EF]/80">{event.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Literary genres */}
            <Card padding="lg">
              <h3 className="text-xl font-semibold text-[#C9A962] mb-4">Literary Genres</h3>
              <div className="flex flex-wrap gap-3">
                {selectedPeriod.literature.map((genre) => (
                  <Link
                    key={genre}
                    href={`/search?q=${encodeURIComponent(genre)}`}
                    className="px-4 py-2 bg-[#C9A962]/10 rounded-lg hover:bg-[#C9A962]/20 transition"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            </Card>

            {/* Topics grid */}
            <div>
              <h3 className="text-xl font-semibold text-[#C9A962] mb-4">Cultural Topics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {TOPICS.map((topic) => (
                  <Card
                    key={topic.id}
                    variant="interactive"
                    padding="sm"
                    onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                    className={selectedTopic === topic.id ? 'border-[#C9A962]' : ''}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{topic.icon}</div>
                      <div className="text-sm font-medium">{topic.name}</div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Selected topic details */}
              {selectedTopic && (() => {
                const topic = TOPICS.find(t => t.id === selectedTopic);
                if (!topic) return null;
                return (
                  <Card padding="lg" className="border-[#C9A962]/40">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl">{topic.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-[#C9A962] mb-2">{topic.name}</h4>
                        <p className="text-[#F5F3EF]/80 leading-relaxed">{topic.description}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-[#C9A962] mb-3">Key Aspects:</h5>
                      <ul className="space-y-2">
                        {topic.keyAspects.map((aspect, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[#F5F3EF]/70">
                            <span className="text-[#C9A962] mt-1">•</span>
                            <span>{aspect}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold text-[#C9A962] mb-3">Related Works:</h5>
                      <div className="flex flex-wrap gap-2">
                        {topic.relatedWorks.map((work, idx) => (
                          <Link
                            key={idx}
                            href={`/search?q=${encodeURIComponent(work.split(' - ')[0])}`}
                            className="px-3 py-1.5 text-sm bg-[#C9A962]/10 rounded-lg hover:bg-[#C9A962]/20 transition"
                          >
                            {work}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key figures */}
            <Card padding="lg">
              <h3 className="font-semibold text-[#C9A962] mb-4">Key Figures</h3>
              <div className="space-y-2">
                {selectedPeriod.keyFigures.map((figure) => (
                  <Link
                    key={figure}
                    href={`/reader?author=${encodeURIComponent(figure)}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#C9A962]/10 transition"
                  >
                    <span>{figure}</span>
                    <svg className="w-4 h-4 text-[#C9A962]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Quick links */}
            <Card padding="lg">
              <h3 className="font-semibold text-[#C9A962] mb-4">Explore More</h3>
              <div className="space-y-2">
                <Link href="/chronos" className="block">
                  <Button variant="secondary" size="sm" className="w-full">
                    View Timeline
                  </Button>
                </Link>
                <Link href="/connectome" className="block">
                  <Button variant="ghost" size="sm" className="w-full">
                    Author Connections
                  </Button>
                </Link>
                <Link href={`/search?q=${encodeURIComponent(selectedPeriod.name)}`} className="block">
                  <Button variant="ghost" size="sm" className="w-full">
                    Search This Period
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Historical Geography */}
            <Card padding="lg">
              <h3 className="font-semibold text-[#C9A962] mb-4">📍 Key Locations</h3>
              <p className="text-sm text-[#F5F3EF]/60 mb-4">
                Major cities and sites of the {selectedPeriod.name}:
              </p>
              <div className="space-y-3">
                {selectedPeriod.id === 'archaic' && (
                  <>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Athens</div>
                      <div className="text-xs text-[#F5F3EF]/60">Birthplace of democracy</div>
                    </div>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Sparta</div>
                      <div className="text-xs text-[#F5F3EF]/60">Military state</div>
                    </div>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Delphi</div>
                      <div className="text-xs text-[#F5F3EF]/60">Oracle of Apollo</div>
                    </div>
                  </>
                )}
                {selectedPeriod.id === 'classical' && (
                  <>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Athens (Acropolis)</div>
                      <div className="text-xs text-[#F5F3EF]/60">Parthenon, center of culture</div>
                    </div>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Olympia</div>
                      <div className="text-xs text-[#F5F3EF]/60">Olympic Games</div>
                    </div>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Macedon</div>
                      <div className="text-xs text-[#F5F3EF]/60">Philip II & Alexander</div>
                    </div>
                  </>
                )}
                {selectedPeriod.id === 'hellenistic' && (
                  <>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Alexandria</div>
                      <div className="text-xs text-[#F5F3EF]/60">Library, scholarship center</div>
                    </div>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Pergamon</div>
                      <div className="text-xs text-[#F5F3EF]/60">Great altar, library</div>
                    </div>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Rhodes</div>
                      <div className="text-xs text-[#F5F3EF]/60">Colossus, trade hub</div>
                    </div>
                  </>
                )}
                {(selectedPeriod.id === 'republican' || selectedPeriod.id === 'augustan') && (
                  <>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Rome (Forum)</div>
                      <div className="text-xs text-[#F5F3EF]/60">Political center</div>
                    </div>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Carthage</div>
                      <div className="text-xs text-[#F5F3EF]/60">Punic Wars rival</div>
                    </div>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Capua</div>
                      <div className="text-xs text-[#F5F3EF]/60">Gladiator schools</div>
                    </div>
                  </>
                )}
                {selectedPeriod.id === 'imperial' && (
                  <>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Rome (Colosseum)</div>
                      <div className="text-xs text-[#F5F3EF]/60">Imperial capital</div>
                    </div>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Constantinople</div>
                      <div className="text-xs text-[#F5F3EF]/60">Eastern capital (330 CE)</div>
                    </div>
                    <div className="p-2 bg-[#C9A962]/5 rounded">
                      <div className="font-medium text-sm">Pompeii</div>
                      <div className="text-xs text-[#F5F3EF]/60">Preserved by Vesuvius</div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Primary sources */}
            <Card padding="lg">
              <h3 className="font-semibold text-[#C9A962] mb-4">Primary Sources</h3>
              <p className="text-sm text-[#F5F3EF]/60 mb-4">
                Read original texts from this period:
              </p>
              <div className="space-y-2">
                {selectedPeriod.keyFigures.slice(0, 3).map((author) => (
                  <Link
                    key={author}
                    href={`/reader?author=${encodeURIComponent(author)}`}
                    className="block text-sm text-[#C9A962] hover:underline"
                  >
                    Works of {author} →
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Period comparison */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#C9A962] mb-6">Period Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#C9A962]/20">
                  <th className="py-3 px-4 text-left text-[#C9A962]">Period</th>
                  <th className="py-3 px-4 text-left text-[#C9A962]">Dates</th>
                  <th className="py-3 px-4 text-left text-[#C9A962]">Key Authors</th>
                  <th className="py-3 px-4 text-left text-[#C9A962]">Dominant Genres</th>
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((period) => (
                  <tr
                    key={period.id}
                    className={`border-b border-[#C9A962]/10 hover:bg-[#C9A962]/5 cursor-pointer ${
                      selectedPeriod.id === period.id ? 'bg-[#C9A962]/10' : ''
                    }`}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    <td className="py-3 px-4 font-medium">{period.name}</td>
                    <td className="py-3 px-4 text-[#F5F3EF]/60">{period.dates}</td>
                    <td className="py-3 px-4 text-[#F5F3EF]/80">{period.keyFigures.slice(0, 3).join(', ')}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {period.literature.slice(0, 2).map((genre) => (
                          <Badge key={genre} size="sm">{genre}</Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
