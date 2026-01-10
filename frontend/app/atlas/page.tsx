'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Card, Button, Input, Badge, Select } from '@/components/ui';
import { BarChart, DonutChart } from '@/components/charts';

// Ancient world locations with coordinates (simplified map projection)
interface Location {
  id: string;
  name: string;
  latinName?: string;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  region: string;
  significance: string;
  authors: Author[];
  works: Work[];
  events: HistoricalEvent[];
}

interface Author {
  name: string;
  dates: string;
  language: 'greek' | 'latin' | 'hebrew' | 'aramaic' | 'coptic' | 'syriac';
  works: string[];
}

interface Work {
  title: string;
  author: string;
  type: string;
}

interface HistoricalEvent {
  date: string;
  event: string;
  significance: 'high' | 'medium' | 'low';
}

// Ancient world locations data
const LOCATIONS: Location[] = [
  {
    id: 'athens',
    name: 'Athens',
    latinName: 'Athenae',
    x: 58.5,
    y: 52,
    region: 'Greece',
    significance: 'Center of philosophy, drama, and democracy',
    authors: [
      { name: 'Plato', dates: '428-348 BCE', language: 'greek', works: ['Republic', 'Symposium', 'Phaedo'] },
      { name: 'Aristotle', dates: '384-322 BCE', language: 'greek', works: ['Nicomachean Ethics', 'Politics', 'Poetics'] },
      { name: 'Sophocles', dates: '496-406 BCE', language: 'greek', works: ['Oedipus Rex', 'Antigone', 'Electra'] },
      { name: 'Euripides', dates: '480-406 BCE', language: 'greek', works: ['Medea', 'The Bacchae', 'Hippolytus'] },
      { name: 'Aristophanes', dates: '446-386 BCE', language: 'greek', works: ['The Clouds', 'The Birds', 'Lysistrata'] },
      { name: 'Thucydides', dates: '460-400 BCE', language: 'greek', works: ['History of the Peloponnesian War'] },
      { name: 'Demosthenes', dates: '384-322 BCE', language: 'greek', works: ['Philippics', 'Olynthiacs', 'On the Crown'] },
    ],
    works: [
      { title: 'Oresteia', author: 'Aeschylus', type: 'tragedy' },
      { title: 'Clouds', author: 'Aristophanes', type: 'comedy' },
    ],
    events: [
      { date: '508 BCE', event: 'Establishment of Athenian democracy', significance: 'high' },
      { date: '480 BCE', event: 'Battle of Salamis', significance: 'high' },
      { date: '399 BCE', event: 'Trial and death of Socrates', significance: 'high' },
    ],
  },
  {
    id: 'rome',
    name: 'Rome',
    latinName: 'Roma',
    x: 47,
    y: 44,
    region: 'Italy',
    significance: 'Capital of the Roman Empire, center of Latin literature',
    authors: [
      { name: 'Virgil', dates: '70-19 BCE', language: 'latin', works: ['Aeneid', 'Georgics', 'Eclogues'] },
      { name: 'Cicero', dates: '106-43 BCE', language: 'latin', works: ['De Oratore', 'De Re Publica', 'Philippics'] },
      { name: 'Horace', dates: '65-8 BCE', language: 'latin', works: ['Odes', 'Satires', 'Ars Poetica'] },
      { name: 'Ovid', dates: '43 BCE-17 CE', language: 'latin', works: ['Metamorphoses', 'Fasti', 'Ars Amatoria'] },
      { name: 'Seneca', dates: '4 BCE-65 CE', language: 'latin', works: ['Letters to Lucilius', 'Tragedies', 'De Clementia'] },
      { name: 'Tacitus', dates: '56-120 CE', language: 'latin', works: ['Annals', 'Histories', 'Germania'] },
      { name: 'Livy', dates: '59 BCE-17 CE', language: 'latin', works: ['Ab Urbe Condita'] },
    ],
    works: [
      { title: 'Aeneid', author: 'Virgil', type: 'epic' },
      { title: 'Metamorphoses', author: 'Ovid', type: 'epic' },
    ],
    events: [
      { date: '753 BCE', event: 'Traditional founding of Rome', significance: 'high' },
      { date: '509 BCE', event: 'Establishment of Roman Republic', significance: 'high' },
      { date: '44 BCE', event: 'Assassination of Julius Caesar', significance: 'high' },
    ],
  },
  {
    id: 'alexandria',
    name: 'Alexandria',
    latinName: 'Alexandria',
    x: 62,
    y: 58,
    region: 'Egypt',
    significance: 'Library of Alexandria, center of Hellenistic learning',
    authors: [
      { name: 'Callimachus', dates: '310-240 BCE', language: 'greek', works: ['Aetia', 'Hymns', 'Epigrams'] },
      { name: 'Apollonius of Rhodes', dates: '295-215 BCE', language: 'greek', works: ['Argonautica'] },
      { name: 'Euclid', dates: '325-265 BCE', language: 'greek', works: ['Elements'] },
      { name: 'Philo', dates: '20 BCE-50 CE', language: 'greek', works: ['Allegorical Interpretations'] },
      { name: 'Clement', dates: '150-215 CE', language: 'greek', works: ['Stromata', 'Paedagogus'] },
      { name: 'Origen', dates: '185-253 CE', language: 'greek', works: ['Hexapla', 'Contra Celsum'] },
    ],
    works: [
      { title: 'Argonautica', author: 'Apollonius', type: 'epic' },
      { title: 'Elements', author: 'Euclid', type: 'mathematics' },
    ],
    events: [
      { date: '331 BCE', event: 'Founding of Alexandria by Alexander', significance: 'high' },
      { date: '283 BCE', event: 'Founding of Library of Alexandria', significance: 'high' },
      { date: '48 BCE', event: 'Partial burning during Caesar\'s war', significance: 'medium' },
    ],
  },
  {
    id: 'jerusalem',
    name: 'Jerusalem',
    latinName: 'Hierosolyma',
    x: 68,
    y: 54,
    region: 'Judea',
    significance: 'Religious center, biblical texts',
    authors: [
      { name: 'Josephus', dates: '37-100 CE', language: 'greek', works: ['Jewish Antiquities', 'Jewish War'] },
    ],
    works: [
      { title: 'Hebrew Bible', author: 'Various', type: 'scripture' },
      { title: 'Dead Sea Scrolls', author: 'Various', type: 'scripture' },
    ],
    events: [
      { date: '957 BCE', event: 'Building of Solomon\'s Temple', significance: 'high' },
      { date: '586 BCE', event: 'Babylonian destruction', significance: 'high' },
      { date: '70 CE', event: 'Roman destruction of Second Temple', significance: 'high' },
    ],
  },
  {
    id: 'antioch',
    name: 'Antioch',
    latinName: 'Antiochia',
    x: 69,
    y: 48,
    region: 'Syria',
    significance: 'Third largest city, early Christian center',
    authors: [
      { name: 'Libanius', dates: '314-393 CE', language: 'greek', works: ['Orations', 'Letters'] },
      { name: 'John Chrysostom', dates: '349-407 CE', language: 'greek', works: ['Homilies'] },
    ],
    works: [
      { title: 'Orations', author: 'Libanius', type: 'rhetoric' },
    ],
    events: [
      { date: '300 BCE', event: 'Founding by Seleucus I', significance: 'high' },
      { date: '40 CE', event: 'Disciples first called Christians here', significance: 'high' },
    ],
  },
  {
    id: 'carthage',
    name: 'Carthage',
    latinName: 'Carthago',
    x: 44,
    y: 50,
    region: 'North Africa',
    significance: 'Phoenician colony, rival of Rome',
    authors: [
      { name: 'Tertullian', dates: '155-220 CE', language: 'latin', works: ['Apologeticum', 'Adversus Marcionem'] },
      { name: 'Cyprian', dates: '200-258 CE', language: 'latin', works: ['De Lapsis', 'De Ecclesiae Unitate'] },
      { name: 'Augustine', dates: '354-430 CE', language: 'latin', works: ['Confessions', 'City of God', 'De Trinitate'] },
    ],
    works: [],
    events: [
      { date: '814 BCE', event: 'Traditional founding', significance: 'medium' },
      { date: '146 BCE', event: 'Destruction by Rome', significance: 'high' },
      { date: '439 CE', event: 'Vandal conquest', significance: 'medium' },
    ],
  },
  {
    id: 'ephesus',
    name: 'Ephesus',
    latinName: 'Ephesus',
    x: 61,
    y: 48,
    region: 'Asia Minor',
    significance: 'Temple of Artemis, early Christian community',
    authors: [
      { name: 'Heraclitus', dates: '535-475 BCE', language: 'greek', works: ['On Nature (fragments)'] },
    ],
    works: [],
    events: [
      { date: '356 BCE', event: 'Temple of Artemis burned', significance: 'medium' },
      { date: '262 CE', event: 'Destruction by Goths', significance: 'medium' },
    ],
  },
  {
    id: 'sparta',
    name: 'Sparta',
    latinName: 'Sparta',
    x: 57,
    y: 54,
    region: 'Greece',
    significance: 'Military power, rival of Athens',
    authors: [
      { name: 'Tyrtaeus', dates: '7th c. BCE', language: 'greek', works: ['Elegies'] },
      { name: 'Alcman', dates: '7th c. BCE', language: 'greek', works: ['Partheneion'] },
    ],
    works: [],
    events: [
      { date: '480 BCE', event: 'Battle of Thermopylae', significance: 'high' },
      { date: '404 BCE', event: 'Victory in Peloponnesian War', significance: 'high' },
    ],
  },
  {
    id: 'thebes',
    name: 'Thebes',
    latinName: 'Thebae',
    x: 57.5,
    y: 51,
    region: 'Greece',
    significance: 'Mythological city, birthplace of Dionysus',
    authors: [
      { name: 'Pindar', dates: '518-438 BCE', language: 'greek', works: ['Olympian Odes', 'Pythian Odes'] },
    ],
    works: [],
    events: [
      { date: '371 BCE', event: 'Battle of Leuctra', significance: 'high' },
      { date: '335 BCE', event: 'Destruction by Alexander', significance: 'medium' },
    ],
  },
  {
    id: 'corinth',
    name: 'Corinth',
    latinName: 'Corinthus',
    x: 57,
    y: 52.5,
    region: 'Greece',
    significance: 'Major trade center, site of Paul\'s letters',
    authors: [],
    works: [],
    events: [
      { date: '146 BCE', event: 'Destruction by Rome', significance: 'medium' },
      { date: '44 BCE', event: 'Refounding by Caesar', significance: 'medium' },
    ],
  },
  {
    id: 'miletus',
    name: 'Miletus',
    latinName: 'Miletus',
    x: 62,
    y: 49,
    region: 'Asia Minor',
    significance: 'Birthplace of philosophy, Ionian school',
    authors: [
      { name: 'Thales', dates: '624-546 BCE', language: 'greek', works: ['(no surviving texts)'] },
      { name: 'Anaximander', dates: '610-546 BCE', language: 'greek', works: ['On Nature (fragments)'] },
      { name: 'Anaximenes', dates: '585-528 BCE', language: 'greek', works: ['(fragments)'] },
    ],
    works: [],
    events: [
      { date: '494 BCE', event: 'Destruction by Persians', significance: 'medium' },
    ],
  },
  {
    id: 'smyrna',
    name: 'Smyrna',
    latinName: 'Smyrna',
    x: 60,
    y: 47.5,
    region: 'Asia Minor',
    significance: 'Claimed birthplace of Homer',
    authors: [
      { name: 'Quintus of Smyrna', dates: '4th c. CE', language: 'greek', works: ['Posthomerica'] },
    ],
    works: [],
    events: [],
  },
  {
    id: 'pergamon',
    name: 'Pergamon',
    latinName: 'Pergamum',
    x: 60.5,
    y: 46,
    region: 'Asia Minor',
    significance: 'Library rival to Alexandria, parchment invention',
    authors: [
      { name: 'Galen', dates: '129-216 CE', language: 'greek', works: ['Medical writings'] },
    ],
    works: [],
    events: [
      { date: '133 BCE', event: 'Bequeathed to Rome', significance: 'medium' },
    ],
  },
  {
    id: 'constantinople',
    name: 'Constantinople',
    latinName: 'Constantinopolis',
    x: 62,
    y: 43,
    region: 'Thrace',
    significance: 'New Rome, Byzantine capital',
    authors: [
      { name: 'Procopius', dates: '500-565 CE', language: 'greek', works: ['Wars', 'Buildings', 'Secret History'] },
    ],
    works: [],
    events: [
      { date: '330 CE', event: 'Founding as New Rome', significance: 'high' },
      { date: '532 CE', event: 'Nika Riots', significance: 'medium' },
    ],
  },
  {
    id: 'syracuse',
    name: 'Syracuse',
    latinName: 'Syracusae',
    x: 49,
    y: 50,
    region: 'Sicily',
    significance: 'Greek colony, Archimedes\' home',
    authors: [
      { name: 'Theocritus', dates: '300-260 BCE', language: 'greek', works: ['Idylls'] },
      { name: 'Archimedes', dates: '287-212 BCE', language: 'greek', works: ['On Floating Bodies', 'The Sand Reckoner'] },
    ],
    works: [],
    events: [
      { date: '212 BCE', event: 'Roman conquest, death of Archimedes', significance: 'high' },
    ],
  },
  {
    id: 'naples',
    name: 'Naples',
    latinName: 'Neapolis',
    x: 48,
    y: 45,
    region: 'Italy',
    significance: 'Greek colony, Virgil\'s home',
    authors: [],
    works: [],
    events: [],
  },
  {
    id: 'hippo',
    name: 'Hippo Regius',
    latinName: 'Hippo Regius',
    x: 42,
    y: 49,
    region: 'North Africa',
    significance: 'Augustine\'s bishopric',
    authors: [
      { name: 'Augustine', dates: '354-430 CE', language: 'latin', works: ['Confessions', 'City of God'] },
    ],
    works: [],
    events: [
      { date: '430 CE', event: 'Death of Augustine during Vandal siege', significance: 'high' },
    ],
  },
  {
    id: 'babylon',
    name: 'Babylon',
    latinName: 'Babylon',
    x: 76,
    y: 52,
    region: 'Mesopotamia',
    significance: 'Ancient empire, Jewish exile',
    authors: [],
    works: [
      { title: 'Babylonian Talmud', author: 'Various', type: 'religious' },
    ],
    events: [
      { date: '586 BCE', event: 'Jewish exile begins', significance: 'high' },
      { date: '539 BCE', event: 'Fall to Persians', significance: 'high' },
      { date: '323 BCE', event: 'Death of Alexander', significance: 'high' },
    ],
  },
  {
    id: 'susa',
    name: 'Susa',
    latinName: 'Susa',
    x: 80,
    y: 53,
    region: 'Persia',
    significance: 'Persian capital, biblical Shushan',
    authors: [],
    works: [],
    events: [
      { date: '331 BCE', event: 'Captured by Alexander', significance: 'medium' },
    ],
  },
  {
    id: 'cyrene',
    name: 'Cyrene',
    latinName: 'Cyrene',
    x: 55,
    y: 56,
    region: 'North Africa',
    significance: 'Greek colony, philosophical school',
    authors: [
      { name: 'Callimachus', dates: '310-240 BCE', language: 'greek', works: ['Aetia', 'Hymns'] },
      { name: 'Eratosthenes', dates: '276-194 BCE', language: 'greek', works: ['Geography'] },
    ],
    works: [],
    events: [],
  },
];

// Regions for the map
const REGIONS = [
  { id: 'mediterranean', path: 'M20,35 Q40,25 60,30 Q80,35 95,45 L95,65 Q80,70 60,65 Q40,60 20,55 Z', fill: '#1e3a5f' },
  { id: 'italy', path: 'M42,38 L50,42 L52,50 L48,55 L45,52 L42,45 Z', fill: '#2d4a3e' },
  { id: 'greece', path: 'M54,45 L62,45 L60,55 L54,55 Z', fill: '#2d4a3e' },
  { id: 'asia-minor', path: 'M58,42 L75,42 L75,52 L62,52 L58,48 Z', fill: '#3d4a3e' },
  { id: 'egypt', path: 'M58,55 L70,55 L70,68 L58,68 Z', fill: '#4a3d2e' },
  { id: 'levant', path: 'M65,48 L72,48 L72,58 L65,58 Z', fill: '#3d3a2e' },
  { id: 'mesopotamia', path: 'M72,45 L85,45 L85,58 L72,58 Z', fill: '#3d352e' },
  { id: 'north-africa', path: 'M25,48 L58,48 L58,60 L25,60 Z', fill: '#3a3528' },
];

type FilterLanguage = 'all' | 'greek' | 'latin' | 'hebrew' | 'aramaic' | 'coptic' | 'syriac';
type FilterPeriod = 'all' | 'archaic' | 'classical' | 'hellenistic' | 'roman' | 'late-antique';

export default function AtlasPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<FilterLanguage>('all');
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const filteredLocations = useMemo(() => {
    return LOCATIONS.filter((loc) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!loc.name.toLowerCase().includes(q) &&
            !loc.latinName?.toLowerCase().includes(q) &&
            !loc.authors.some(a => a.name.toLowerCase().includes(q))) {
          return false;
        }
      }
      if (filterLanguage !== 'all') {
        if (!loc.authors.some(a => a.language === filterLanguage)) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, filterLanguage]);

  const languageStats = useMemo(() => {
    const counts: Record<string, number> = {};
    LOCATIONS.forEach(loc => {
      loc.authors.forEach(a => {
        counts[a.language] = (counts[a.language] || 0) + 1;
      });
    });
    return [
      { name: 'Greek', value: counts.greek || 0, color: '#4ECDC4' },
      { name: 'Latin', value: counts.latin || 0, color: '#C9A962' },
      { name: 'Hebrew', value: counts.hebrew || 0, color: '#FF6B6B' },
      { name: 'Aramaic', value: counts.aramaic || 0, color: '#DDA0DD' },
      { name: 'Syriac', value: counts.syriac || 0, color: '#87CEEB' },
      { name: 'Coptic', value: counts.coptic || 0, color: '#98D8C8' },
    ].filter(s => s.value > 0);
  }, []);

  const regionStats = useMemo(() => {
    const counts: Record<string, number> = {};
    LOCATIONS.forEach(loc => {
      counts[loc.region] = (counts[loc.region] || 0) + loc.authors.length;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, color: '#C9A962' }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, []);

  const handleLocationClick = useCallback((loc: Location) => {
    setSelectedLocation(loc);
  }, []);

  const getLocationSize = (loc: Location) => {
    const authorCount = loc.authors.length;
    if (authorCount >= 5) return 12;
    if (authorCount >= 3) return 10;
    if (authorCount >= 1) return 8;
    return 6;
  };

  const getLocationColor = (loc: Location) => {
    const languages = new Set(loc.authors.map(a => a.language));
    if (languages.has('greek') && languages.has('latin')) return '#98D8C8';
    if (languages.has('greek')) return '#4ECDC4';
    if (languages.has('latin')) return '#C9A962';
    if (languages.has('hebrew') || languages.has('aramaic')) return '#FF6B6B';
    return '#87CEEB';
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#C9A962]">ATLAS</span>
          </h1>
          <p className="text-[#F5F3EF]/70">
            Interactive map of the ancient Mediterranean world and its literary traditions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <Card className="mb-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Input
                  type="text"
                  placeholder="Search locations or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value as FilterLanguage)}
                  options={[
                    { value: 'all', label: 'All Languages' },
                    { value: 'greek', label: 'Greek' },
                    { value: 'latin', label: 'Latin' },
                    { value: 'hebrew', label: 'Hebrew' },
                    { value: 'aramaic', label: 'Aramaic' },
                  ]}
                />
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
                  >
                    +
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
                  >
                    -
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </Card>

            {/* Map */}
            <Card padding="none" className="overflow-hidden">
              <div
                className="relative bg-[#0a1628] h-[600px] overflow-hidden cursor-grab active:cursor-grabbing"
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, #1a2840 0%, #0a1628 100%)',
                }}
              >
                <svg
                  viewBox="0 0 100 80"
                  className="w-full h-full"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {/* Water pattern */}
                  <defs>
                    <pattern id="water" patternUnits="userSpaceOnUse" width="4" height="4">
                      <path d="M0,2 Q1,0 2,2 Q3,4 4,2" fill="none" stroke="#1e3a5f" strokeWidth="0.2" opacity="0.3" />
                    </pattern>
                    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#C9A962" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#C9A962" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Background sea */}
                  <rect x="0" y="0" width="100" height="80" fill="#0d1929" />
                  <rect x="0" y="0" width="100" height="80" fill="url(#water)" />

                  {/* Landmasses (simplified) */}
                  {/* Europe */}
                  <path d="M5,20 Q15,15 30,18 L45,15 Q55,12 65,15 L75,20 Q70,25 65,28 L60,35 Q55,38 50,35 L45,40 Q40,45 35,42 L30,45 Q20,48 15,40 Q10,35 8,28 Z" fill="#1a2820" />

                  {/* Italy */}
                  <path d="M42,35 L48,32 Q52,35 50,42 L52,48 Q50,52 46,50 L44,45 Q42,40 42,35 Z" fill="#1a2820" />
                  <path d="M45,50 Q48,52 52,55 L48,58 Q44,55 45,50 Z" fill="#1a2820" />

                  {/* Greece */}
                  <path d="M55,40 L62,38 Q65,42 62,48 L58,52 Q54,55 52,50 L54,45 Q55,42 55,40 Z" fill="#1a2820" />

                  {/* Asia Minor */}
                  <path d="M62,35 L80,32 Q85,38 82,45 L78,50 Q72,52 65,48 L60,42 Q62,38 62,35 Z" fill="#1a2820" />

                  {/* North Africa */}
                  <path d="M5,52 L58,55 Q65,58 70,62 L85,60 L95,65 L95,80 L5,80 Z" fill="#1a2820" />

                  {/* Levant */}
                  <path d="M65,48 L72,46 L74,55 Q72,62 68,65 L65,60 Q64,52 65,48 Z" fill="#1a2820" />

                  {/* Mesopotamia */}
                  <path d="M72,45 L85,40 L95,45 L95,60 L80,65 L72,58 Z" fill="#1a2820" />

                  {/* Mediterranean Sea label */}
                  <text x="50" y="48" textAnchor="middle" fill="#3d5a80" fontSize="2" fontStyle="italic" opacity="0.6">
                    Mare Nostrum
                  </text>

                  {/* Location markers */}
                  {filteredLocations.map((loc) => {
                    const isHovered = hoveredLocation === loc.id;
                    const isSelected = selectedLocation?.id === loc.id;
                    const size = getLocationSize(loc);
                    const color = getLocationColor(loc);

                    return (
                      <g key={loc.id}>
                        {/* Glow effect */}
                        {(isHovered || isSelected) && (
                          <circle
                            cx={loc.x}
                            cy={loc.y}
                            r={size + 3}
                            fill="url(#glow)"
                            className="animate-pulse"
                          />
                        )}

                        {/* Marker */}
                        <circle
                          cx={loc.x}
                          cy={loc.y}
                          r={size / 4}
                          fill={color}
                          stroke={isSelected ? '#fff' : 'transparent'}
                          strokeWidth="0.5"
                          className="cursor-pointer transition-all duration-200"
                          style={{
                            filter: isHovered || isSelected ? 'brightness(1.3)' : 'none',
                          }}
                          onMouseEnter={() => setHoveredLocation(loc.id)}
                          onMouseLeave={() => setHoveredLocation(null)}
                          onClick={() => handleLocationClick(loc)}
                        />

                        {/* Label */}
                        <text
                          x={loc.x}
                          y={loc.y - size / 3 - 1}
                          textAnchor="middle"
                          fill={isHovered || isSelected ? '#fff' : '#C9A962'}
                          fontSize="1.8"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          className="pointer-events-none select-none"
                          style={{
                            textShadow: '0 0 3px rgba(0,0,0,0.8)',
                          }}
                        >
                          {loc.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-[#0D0D0F]/80 backdrop-blur-sm p-3 rounded-lg border border-[#C9A962]/20">
                  <p className="text-xs text-[#F5F3EF]/50 mb-2">Languages</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-full bg-[#4ECDC4]" />
                      <span className="text-[#F5F3EF]/70">Greek</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-full bg-[#C9A962]" />
                      <span className="text-[#F5F3EF]/70">Latin</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
                      <span className="text-[#F5F3EF]/70">Semitic</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-full bg-[#98D8C8]" />
                      <span className="text-[#F5F3EF]/70">Mixed</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Location Details */}
            {selectedLocation ? (
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-serif text-[#C9A962]">{selectedLocation.name}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLocation(null)}
                  >
                    ×
                  </Button>
                </div>

                {selectedLocation.latinName && (
                  <p className="text-sm text-[#F5F3EF]/50 italic mb-2">
                    {selectedLocation.latinName}
                  </p>
                )}

                <Badge variant="default" className="mb-3">{selectedLocation.region}</Badge>

                <p className="text-sm text-[#F5F3EF]/70 mb-4">
                  {selectedLocation.significance}
                </p>

                {/* Authors */}
                {selectedLocation.authors.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#C9A962] mb-2">
                      Authors ({selectedLocation.authors.length})
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedLocation.authors.map((author, i) => (
                        <div key={i} className="p-2 bg-[#C9A962]/5 rounded">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{author.name}</span>
                            <Badge
                              variant={author.language === 'greek' ? 'greek' : 'latin'}
                              className="text-xs"
                            >
                              {author.language}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#F5F3EF]/50">{author.dates}</p>
                          <p className="text-xs text-[#F5F3EF]/60 mt-1">
                            {author.works.slice(0, 3).join(', ')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Events */}
                {selectedLocation.events.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#C9A962] mb-2">
                      Key Events
                    </h3>
                    <div className="space-y-2">
                      {selectedLocation.events.map((event, i) => (
                        <div key={i} className="flex gap-2 text-sm">
                          <span className="text-[#C9A962] whitespace-nowrap">{event.date}</span>
                          <span className="text-[#F5F3EF]/70">{event.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-[#C9A962]/20">
                  <Link href={`/search?q=${encodeURIComponent(selectedLocation.name)}`}>
                    <Button variant="secondary" size="sm" className="w-full">
                      Search Corpus
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <Card padding="lg">
                <h3 className="text-lg font-semibold text-[#C9A962] mb-3">Select a Location</h3>
                <p className="text-sm text-[#F5F3EF]/60">
                  Click on any city marker to view its authors, works, and historical significance.
                </p>
              </Card>
            )}

            {/* Statistics */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Authors by Language</h3>
              <DonutChart data={languageStats} size={160} showLegend={false} />
              <div className="mt-4 space-y-1">
                {languageStats.map((s) => (
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

            <Card padding="lg">
              <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Authors by Region</h3>
              <BarChart data={regionStats} horizontal maxBars={6} />
            </Card>

            {/* Quick Stats */}
            <Card>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#C9A962]">{LOCATIONS.length}</div>
                  <div className="text-xs text-[#F5F3EF]/50">Locations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#C9A962]">
                    {LOCATIONS.reduce((sum, l) => sum + l.authors.length, 0)}
                  </div>
                  <div className="text-xs text-[#F5F3EF]/50">Authors</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
