'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, Button, Select, Badge } from '@/components/ui';
import { Timeline, BarChart, DonutChart } from '@/components/charts';
import { formatYear } from '@/lib/utils';

// Extended timeline data
const TIMELINE_DATA = [
  { id: '1', date: -850, title: 'Homer', description: 'Composition of Iliad and Odyssey - foundational texts of Western literature', type: 'author' as const },
  { id: '2', date: -750, title: 'Hesiod', description: 'Theogony and Works and Days - systematic Greek mythology and ethics', type: 'author' as const },
  { id: '3', date: -650, title: 'Archilochus', description: 'First lyric poet - personal voice in poetry', type: 'author' as const },
  { id: '4', date: -620, title: 'Sappho', description: 'Greatest lyric poet from Lesbos - fragments of passionate poetry', type: 'author' as const },
  { id: '5', date: -590, title: 'Thales of Miletus', description: 'First philosopher - beginning of Western philosophy', type: 'author' as const },
  { id: '6', date: -525, title: 'Aeschylus', description: 'Father of tragedy - Oresteia, Prometheus Bound', type: 'author' as const },
  { id: '7', date: -496, title: 'Sophocles', description: 'Master tragedian - Oedipus Rex, Antigone', type: 'author' as const },
  { id: '8', date: -490, title: 'Battle of Marathon', description: 'Greeks defeat Persian invasion', type: 'event' as const },
  { id: '9', date: -480, title: 'Battle of Thermopylae', description: 'Spartans make heroic stand against Persians', type: 'event' as const },
  { id: '10', date: -480, title: 'Euripides', description: 'Psychological drama - Medea, Bacchae', type: 'author' as const },
  { id: '11', date: -470, title: 'Socrates', description: 'Athenian philosopher - dialectic method', type: 'author' as const },
  { id: '12', date: -460, title: 'Thucydides', description: 'Scientific historian - History of the Peloponnesian War', type: 'author' as const },
  { id: '13', date: -450, title: 'Herodotus', description: 'Father of History - Persian Wars', type: 'author' as const },
  { id: '14', date: -431, title: 'Peloponnesian War', description: 'Athens vs Sparta begins', type: 'event' as const },
  { id: '15', date: -428, title: 'Plato', description: 'Founder of the Academy - Republic, Symposium', type: 'author' as const },
  { id: '16', date: -404, title: 'Fall of Athens', description: 'End of Athenian golden age', type: 'event' as const },
  { id: '17', date: -384, title: 'Aristotle', description: 'The Philosopher - systematic knowledge', type: 'author' as const },
  { id: '18', date: -356, title: 'Alexander Born', description: 'Birth of Alexander the Great', type: 'event' as const },
  { id: '19', date: -323, title: 'Alexander Dies', description: 'End of Classical period, beginning of Hellenistic', type: 'event' as const },
  { id: '20', date: -300, title: 'Euclid', description: 'Elements - foundation of geometry', type: 'author' as const },
  { id: '21', date: -254, title: 'Plautus', description: 'Roman comedy begins - Menaechmi, Miles Gloriosus', type: 'author' as const },
  { id: '22', date: -239, title: 'Ennius', description: 'Father of Latin poetry - Annales', type: 'author' as const },
  { id: '23', date: -195, title: 'Terence', description: 'Refined Latin comedy', type: 'author' as const },
  { id: '24', date: -106, title: 'Cicero', description: 'Master orator and statesman - De Oratore', type: 'author' as const },
  { id: '25', date: -100, title: 'Julius Caesar', description: 'Gallic Wars, Civil War - clear Latin prose', type: 'author' as const },
  { id: '26', date: -87, title: 'Catullus', description: 'Personal lyric poetry - love poems', type: 'author' as const },
  { id: '27', date: -70, title: 'Virgil', description: 'Rome\'s national poet - Aeneid, Georgics', type: 'author' as const },
  { id: '28', date: -65, title: 'Horace', description: 'Satires and Odes - Ars Poetica', type: 'author' as const },
  { id: '29', date: -59, title: 'Livy', description: 'Ab Urbe Condita - Roman history', type: 'author' as const },
  { id: '30', date: -43, title: 'Ovid', description: 'Metamorphoses - mythological epic', type: 'author' as const },
  { id: '31', date: -44, title: 'Caesar Assassinated', description: 'Ides of March', type: 'event' as const },
  { id: '32', date: -31, title: 'Battle of Actium', description: 'Augustus defeats Antony, beginning of Empire', type: 'event' as const },
  { id: '33', date: 4, title: 'Seneca', description: 'Stoic philosopher - tragedies, letters', type: 'author' as const },
  { id: '34', date: 23, title: 'Pliny the Elder', description: 'Natural History - encyclopedia', type: 'author' as const },
  { id: '35', date: 40, title: 'Martial', description: 'Epigrammatist - wit and satire', type: 'author' as const },
  { id: '36', date: 46, title: 'Plutarch', description: 'Parallel Lives - Greek and Roman biography', type: 'author' as const },
  { id: '37', date: 56, title: 'Tacitus', description: 'Greatest Roman historian - Annals', type: 'author' as const },
  { id: '38', date: 61, title: 'Juvenal', description: 'Savage satirist - Satires', type: 'author' as const },
  { id: '39', date: 79, title: 'Vesuvius Erupts', description: 'Pompeii and Herculaneum destroyed', type: 'event' as const },
  { id: '40', date: 120, title: 'Marcus Aurelius', description: 'Philosopher-emperor - Meditations', type: 'author' as const },
  { id: '41', date: 125, title: 'Apuleius', description: 'The Golden Ass - Latin novel', type: 'author' as const },
  { id: '42', date: 165, title: 'Lucian', description: 'Satirist and humorist - True History', type: 'author' as const },
  { id: '43', date: 354, title: 'Augustine', description: 'Church Father - Confessions, City of God', type: 'author' as const },
  { id: '44', date: 380, title: 'Christianity Official', description: 'Theodosius makes Christianity state religion', type: 'event' as const },
  { id: '45', date: 410, title: 'Sack of Rome', description: 'Visigoths sack Rome', type: 'event' as const },
  { id: '46', date: 480, title: 'Boethius', description: 'Consolation of Philosophy - bridge to Middle Ages', type: 'author' as const },
  { id: '47', date: 476, title: 'Fall of Rome', description: 'End of Western Roman Empire', type: 'event' as const },
  { id: '48', date: 529, title: 'Academy Closes', description: 'Justinian closes Plato\'s Academy', type: 'event' as const },
];

// Period definitions
const PERIODS = [
  { id: 'archaic', name: 'Archaic', years: '800-480 BCE', start: -800, end: -480, color: '#FF6B6B', authors: 8 },
  { id: 'classical', name: 'Classical', years: '480-323 BCE', start: -480, end: -323, color: '#4ECDC4', authors: 12 },
  { id: 'hellenistic', name: 'Hellenistic', years: '323-31 BCE', start: -323, end: -31, color: '#45B7D1', authors: 6 },
  { id: 'augustan', name: 'Augustan', years: '31 BCE-14 CE', start: -31, end: 14, color: '#DDA0DD', authors: 8 },
  { id: 'imperial', name: 'Imperial', years: '14-284 CE', start: 14, end: 284, color: '#98D8C8', authors: 10 },
  { id: 'late', name: 'Late Antiquity', years: '284-600 CE', start: 284, end: 600, color: '#F7DC6F', authors: 4 },
];

export default function ChronosPage() {
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<typeof TIMELINE_DATA[0] | null>(null);

  // Filter events
  const filteredEvents = useMemo(() => {
    return TIMELINE_DATA.filter((item) => {
      if (selectedType && item.type !== selectedType) return false;
      if (selectedPeriod) {
        const period = PERIODS.find((p) => p.id === selectedPeriod);
        if (period && (item.date < period.start || item.date > period.end)) return false;
      }
      return true;
    });
  }, [selectedType, selectedPeriod]);

  // Stats
  const stats = useMemo(() => ({
    totalAuthors: TIMELINE_DATA.filter((e) => e.type === 'author').length,
    totalEvents: TIMELINE_DATA.filter((e) => e.type === 'event').length,
    span: '1,400 years',
    periods: PERIODS.length,
  }), []);

  // Period distribution for chart
  const periodDistribution = PERIODS.map((p) => ({
    name: p.name,
    value: TIMELINE_DATA.filter((e) => e.date >= p.start && e.date < p.end).length,
    color: p.color,
  }));

  // Authors per century
  const authorsByCentury = useMemo(() => {
    const centuries: Record<number, number> = {};
    TIMELINE_DATA.filter((e) => e.type === 'author').forEach((e) => {
      const century = Math.floor(e.date / 100) * 100;
      centuries[century] = (centuries[century] || 0) + 1;
    });
    return Object.entries(centuries)
      .map(([century, count]) => ({
        name: formatYear(parseInt(century)),
        value: count,
        color: '#C9A962',
      }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-[#C9A962]">CHRONOS</span>
              </h1>
              <p className="text-[#F5F3EF]/70">
                Interactive timeline of classical antiquity (850 BCE - 600 CE)
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A962]">{stats.totalAuthors}</div>
                <div className="text-xs text-[#F5F3EF]/50">Authors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{stats.totalEvents}</div>
                <div className="text-xs text-[#F5F3EF]/50">Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#87CEEB]">{stats.span}</div>
                <div className="text-xs text-[#F5F3EF]/50">Span</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <Card padding="md" className="mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              options={[
                { value: '', label: 'All Types' },
                { value: 'author', label: 'Authors' },
                { value: 'event', label: 'Events' },
              ]}
              className="w-40"
            />
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              options={[
                { value: '', label: 'All Periods' },
                ...PERIODS.map((p) => ({ value: p.id, label: `${p.name} (${p.years})` })),
              ]}
              className="w-56"
            />
            <div className="ml-auto text-sm text-[#F5F3EF]/50">
              Showing {filteredEvents.length} of {TIMELINE_DATA.length} items
            </div>
          </div>
        </Card>

        {/* Main Timeline */}
        <Card padding="lg" className="mb-8">
          <h2 className="text-xl font-semibold text-[#C9A962] mb-6">Historical Timeline</h2>
          <Timeline
            events={filteredEvents.map(e => ({ ...e, year: e.date }))}
            onEventClick={(event) => setSelectedEvent(filteredEvents.find(e => e.id === event.id) || null)}
          />
        </Card>

        {/* Selected event details */}
        {selectedEvent && (
          <Card padding="lg" className="mb-8 border-[#C9A962]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#C9A962]">{selectedEvent.title}</h2>
                <p className="text-[#F5F3EF]/50">{formatYear(selectedEvent.date)}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={selectedEvent.type === 'author' ? 'default' : 'danger'}>
                  {selectedEvent.type}
                </Badge>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-[#F5F3EF]/50 hover:text-[#F5F3EF]"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-[#F5F3EF]/70 mt-4">{selectedEvent.description}</p>
            {selectedEvent.type === 'author' && (
              <div className="mt-4 flex gap-2">
                <Link href={`/reader?author=${encodeURIComponent(selectedEvent.title)}`}>
                  <Button variant="secondary" size="sm">Read Works</Button>
                </Link>
                <Link href={`/connectome?author=${encodeURIComponent(selectedEvent.title)}`}>
                  <Button variant="ghost" size="sm">View Connections</Button>
                </Link>
              </div>
            )}
          </Card>
        )}

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card padding="lg">
            <h3 className="text-lg font-semibold text-[#C9A962] mb-4">Events by Period</h3>
            <DonutChart
              data={periodDistribution}
              showLegend
              centerText={TIMELINE_DATA.length.toString()}
              centerSubtext="total"
            />
          </Card>

          <Card padding="lg">
            <h3 className="text-lg font-semibold text-[#C9A962] mb-4">Authors by Century</h3>
            <div className="h-64">
              <BarChart data={authorsByCentury} maxBars={12} />
            </div>
          </Card>
        </div>

        {/* Period cards */}
        <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Historical Periods</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PERIODS.map((period) => {
            const periodEvents = TIMELINE_DATA.filter(
              (e) => e.date >= period.start && e.date < period.end
            );
            const authors = periodEvents.filter((e) => e.type === 'author');
            const events = periodEvents.filter((e) => e.type === 'event');

            return (
              <Card
                key={period.id}
                variant="interactive"
                padding="lg"
                onClick={() => setSelectedPeriod(selectedPeriod === period.id ? '' : period.id)}
                className={selectedPeriod === period.id ? 'border-[#C9A962]' : ''}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold" style={{ color: period.color }}>
                      {period.name}
                    </h3>
                    <p className="text-sm text-[#F5F3EF]/50">{period.years}</p>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: period.color }}
                  />
                </div>
                <div className="flex gap-4 mt-3">
                  <div>
                    <span className="text-xl font-bold text-[#C9A962]">{authors.length}</span>
                    <span className="text-xs text-[#F5F3EF]/40 ml-1">authors</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-red-400">{events.length}</span>
                    <span className="text-xs text-[#F5F3EF]/40 ml-1">events</span>
                  </div>
                </div>
                {authors.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#C9A962]/20">
                    <p className="text-xs text-[#F5F3EF]/50 line-clamp-1">
                      {authors.slice(0, 4).map((a) => a.title).join(', ')}
                      {authors.length > 4 && ` +${authors.length - 4}`}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
