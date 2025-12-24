'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const EVENTS = [
  { 
    year: -800, 
    name: "Homer composes epics", 
    category: "intellectual", 
    era: "archaic",
    description: "Homer composes the Iliad and Odyssey, foundational works of Western literature that establish epic poetry traditions and preserve Bronze Age cultural memory.",
    significance: "These epics become the cornerstone of Greek education and cultural identity, influencing literature for millennia.",
    sources: ["Herodotus 2.53", "Plato, Republic 10.606e"],
    manuscripts: ["P.Oxy. 3831 (3rd cent. BCE)", "Venetus A (10th cent. CE)"],
    criticalNotes: "Homeric Question: unitary vs. multiple authorship debate",
    textVariants: ["μῆνιν ἄειδε θεά vs. μῆνιν ἄειδε θεὰ", "Πηληϊάδεω vs. Πηληιάδεω"],
    greekText: "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
    translation: "Sing, goddess, the wrath of Achilles, son of Peleus"
  },
  { 
    year: -776, 
    name: "First Olympic Games", 
    category: "cultural", 
    era: "archaic",
    description: "The first recorded Olympic Games held in Olympia, establishing a quadrennial athletic festival that unites the Greek world.",
    significance: "Creates a common cultural institution across Greek city-states and introduces the concept of organized international competition.",
    sources: ["Hippias of Elis", "Pausanias 5.8.6"],
    manuscripts: ["P.Oxy. 222 (2nd cent. CE)"],
    criticalNotes: "Archaeological evidence confirms cultic activity from 8th century",
    textVariants: ["Ὀλυμπιακὰ vs. Ὀλύμπια"],
    greekText: "τὰ Ὀλύμπια τέθη ἐν Ὀλυμπίᾳ",
    translation: "The Olympics were established at Olympia"
  },
  { 
    year: -508, 
    name: "Cleisthenes' Reforms", 
    category: "political", 
    era: "archaic",
    description: "Cleisthenes implements democratic reforms in Athens, creating the foundations of direct democracy with citizen participation in governance.",
    significance: "Establishes the world's first democratic system, influencing political thought for over 2,000 years.",
    sources: ["Herodotus 6.131", "Aristotle, Ath.Pol. 20-22"],
    manuscripts: ["P.Lond.Lit. 108", "Codex Parisinus 1741"],
    criticalNotes: "δημοκρατία first attested in Herodotus 6.43",
    textVariants: ["δημοκρατίη vs. δημοκρατία", "ἰσονομίη vs. ἰσονομία"],
    greekText: "δημοκρατίη ἐγένετο ἐν Ἀθήνῃσι",
    translation: "Democracy came into being in Athens"
  },
  { 
    year: -490, 
    name: "Battle of Marathon", 
    category: "political", 
    era: "classical",
    description: "Athenian forces defeat the Persian invasion at Marathon, preserving Greek independence and democratic ideals.",
    significance: "Demonstrates that disciplined citizen-soldiers can defeat imperial armies, inspiring later republican movements.",
    sources: ["Herodotus 6.102-117", "Plutarch, Vita Aristidis"],
    manuscripts: ["Codex Laurentianus 70.3", "P.Oxy. 1610"],
    criticalNotes: "Casualty figures vary significantly between sources",
    textVariants: ["Μαραθὼν vs. Μαραθῶνι", "ἐνίκησαν vs. ἐκράτησαν"],
    greekText: "ἐν Μαραθῶνι οἱ Ἀθηναῖοι τοὺς Πέρσας ἐνίκησαν",
    translation: "At Marathon the Athenians defeated the Persians"
  },
  { 
    year: -447, 
    name: "Parthenon Construction", 
    category: "cultural", 
    era: "classical",
    description: "Construction begins on the Parthenon in Athens under Pericles, representing the height of Classical Greek architecture and sculpture.",
    significance: "Sets architectural standards that influence Western building design through the present day.",
    sources: ["Plutarch, Vita Periclis 13", "IG I³ 436-451"],
    manuscripts: ["Codex Parisinus 1672"],
    criticalNotes: "Building accounts preserved on marble inscriptions (IG I³ 436-451)",
    textVariants: ["Παρθενὼν vs. Παρθενῶν"],
    greekText: "ὁ Παρθενὼν ἐπὶ Περικλέους ἠρχιτεκτήθη",
    translation: "The Parthenon was constructed under Pericles"
  },
  { 
    year: -431, 
    name: "Peloponnesian War Begins", 
    category: "political", 
    era: "classical",
    description: "The devastating war between Athens and Sparta begins, lasting 27 years and ultimately weakening all Greek city-states.",
    significance: "Marks the beginning of the end of the Classical Greek golden age and Athenian hegemony.",
    sources: ["Thucydides 1.1", "Xenophon, Hellenica"],
    manuscripts: ["Codex Laurentianus 69.2", "P.Oxy. 16.1876"],
    criticalNotes: "Thucydides vs. Diodorus chronology discrepancies",
    textVariants: ["Πελοποννησίων vs. Πελοποννησιακὸς πόλεμος"],
    greekText: "ὁ πόλεμος ἤρξατο Ἀθηναίων καὶ Πελοποννησίων",
    translation: "The war began between the Athenians and Peloponnesians"
  },
  { 
    year: -399, 
    name: "Death of Socrates", 
    category: "intellectual", 
    era: "classical",
    description: "Socrates is executed by hemlock poisoning after being convicted of corrupting the youth and impiety against the gods.",
    significance: "His death and philosophical method, preserved by Plato, fundamentally shapes Western philosophical inquiry.",
    sources: ["Plato, Phaedo", "Xenophon, Memorabilia"],
    manuscripts: ["Codex Parisinus 1807", "P.Oxy. 1016"],
    criticalNotes: "Plato vs. Xenophon accounts of Socrates' final words",
    textVariants: ["κώνειον vs. κώνιον", "ἀσεβείᾳ vs. ἀσεβίᾳ"],
    greekText: "ὦ Κρίτων, τῷ Ἀσκληπιῷ ὀφείλομεν ἀλεκτρυόνα",
    translation: "Crito, we owe a rooster to Asclepius"
  },
  { 
    year: -336, 
    name: "Alexander becomes King", 
    category: "political", 
    era: "classical",
    description: "Alexander III ascends to the Macedonian throne after Philip II's assassination, beginning his legendary conquests.",
    significance: "Initiates the Hellenistic period through unprecedented military campaigns that spread Greek culture across three continents.",
    sources: ["Arrian, Anabasis", "Plutarch, Vita Alexandri"],
    manuscripts: ["Codex Vindobonensis hist. gr. 4", "P.Oxy. 1798"],
    criticalNotes: "Vulgate tradition vs. Ptolemy/Aristobulus accounts",
    textVariants: ["Ἀλέξανδρος vs. Ἀλέξανδρος ὁ Μέγας"],
    greekText: "Ἀλέξανδρος βασιλεὺς Μακεδόνων ἐγένετο",
    translation: "Alexander became king of the Macedonians"
  },
  { 
    year: -323, 
    name: "Alexander's Death", 
    category: "political", 
    era: "hellenistic",
    description: "Alexander the Great dies in Babylon at age 32, leaving a vast empire without clear succession plans.",
    significance: "Marks the transition from Classical to Hellenistic period as his empire fragments among the Diadochi.",
    sources: ["Arrian 7.25-30", "Diodorus 17.117"],
    manuscripts: ["Codex Parisinus 1685", "P.Oxy. 4808"],
    criticalNotes: "Poison vs. fever debate; various accounts of final words",
    textVariants: ["ἐτελεύτησε vs. ἀπέθανε", "Βαβυλῶνι vs. ἐν Βαβυλῶνι"],
    greekText: "Ἀλέξανδρος ἐν Βαβυλῶνι ἐτελεύτησε",
    translation: "Alexander died in Babylon"
  },
  { 
    year: -31, 
    name: "Battle of Actium", 
    category: "political", 
    era: "hellenistic",
    description: "Octavian defeats Mark Antony and Cleopatra, ending the last Hellenistic kingdom and establishing Roman dominance.",
    significance: "Concludes the Hellenistic period and integrates the Greek world definitively into the Roman Empire.",
    sources: ["Plutarch, Vita Antonii", "Cassius Dio 50.31-35"],
    manuscripts: ["Codex Parisinus 1678", "P.Oxy. 2435"],
    criticalNotes: "Augustan propaganda affects historical accounts",
    textVariants: ["Ἄκτιον vs. Ἀκτιακὴ ναυμαχία"],
    greekText: "ἐν Ἀκτίῳ Ὀκταουιανὸς Ἀντώνιον ἐνίκησε",
    translation: "At Actium Octavian defeated Antony"
  }
];

const ERA_CONFIG = {
  archaic: { color: '#D97706', name: 'Archaic (800-500 BCE)' },
  classical: { color: '#F59E0B', name: 'Classical (500-323 BCE)' },
  hellenistic: { color: '#3B82F6', name: 'Hellenistic (323-31 BCE)' },
  imperial: { color: '#DC2626', name: 'Imperial (31 BCE-284 CE)' },
  lateAntique: { color: '#7C3AED', name: 'Late Antique (284-600 CE)' },
  byzantine: { color: '#059669', name: 'Byzantine (600-1453 CE)' }
};

const CATEGORY_CONFIG = {
  political: { color: '#DC2626', name: 'Political', icon: '⚔️' },
  cultural: { color: '#7C3AED', name: 'Cultural', icon: '🏛️' },
  intellectual: { color: '#3B82F6', name: 'Intellectual', icon: '📚' }
};

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterEra, setFilterEra] = useState('all');
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [showCriticalApparatus, setShowCriticalApparatus] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const timelineRef = useRef(null);

  const filteredEvents = EVENTS.filter(event => {
    return (filterCategory === 'all' || event.category === filterCategory) &&
           (filterEra === 'all' || event.era === filterEra);
  });

  const getTimelinePosition = (year) => {
    const minYear = Math.min(...EVENTS.map(e => e.year));
    const maxYear = Math.max(...EVENTS.map(e => e.year));
    return ((year - minYear) / (maxYear - minYear)) * 100;
  };

  const parseGreekText = (text) => {
    return text.split(' ').map((word, index) => ({
      greek: word,
      position: index,
      lemma: word.replace(/[ῆῇὴή]/g, 'η').replace(/[ώὼὦ]/g, 'ω'),
      morphology: 'nom.sg.masc',
      lsj: `${word}-entry`
    }));
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#1E1E24',
        borderBottom: '1px solid #2D2D35',
        padding: '1rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none' 
          }}>
            LOGOS
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            Historical Timeline
          </h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ 
              backgroundColor: '#3B82F6', 
              color: 'white', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              Α GREEK
            </span>
            <button
              onClick={() => setShowCriticalApparatus(!showCriticalApparatus)}
              style={{
                backgroundColor: showCriticalApparatus ? '#C9A227' : '#2D2D35',
                color: showCriticalApparatus ? '#0D0D0F' : '#F5F4F2',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease'
              }}
            >
              Critical Apparatus
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          marginBottom: '2rem',
          backgroundColor: '#1E1E24',
          padding: '1.5rem',
          borderRadius: '1rem'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: 'bold', 
              color: '#C9A227',
              marginBottom: '0.5rem' 
            }}>
              Era
            </label>
            <select
              value={filterEra}
              onChange={(e) => setFilterEra(e.target.value)}
              style={{
                backgroundColor: '#2D2D35',
                color: '#F5F4F2',
                border: '1px solid #404040',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Eras</option>
              {Object.entries(ERA_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: 'bold', 
              color: '#C9A227',
              marginBottom: '0.5rem' 
            }}>
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                backgroundColor: '#2D2D35',
                color: '#F5F4F2',
                border: '1px solid #404040',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.icon} {config.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <div style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '0.5rem' }}>
              Legend
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: config.color
                  }} />
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                    {config.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div style={{ 
          backgroundColor: '#1E1E24', 
          borderRadius: '1rem', 
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ position: 'relative', height: '120px' }} ref={timelineRef}>
            {/* Timeline line */}
            <div style={{
              position: 'absolute',
              top: '60px',
              left: '50px',
              right: '50px',
              height: '2px',
              backgroundColor: '#404040'
            }} />

            {/* Era segments */}
            <svg width="100%" height="120" style={{ position: 'absolute', top: 0, left: 0 }}>
              <defs>
                <linearGradient id="eraGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#D97706', stopOpacity: 0.6 }} />
                  <stop offset="35%" style={{ stopColor: '#F59E0B', stopOpacity: 0.6 }} />
                  <stop offset="80%" style={{ stopColor: '#3B82F6', stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: '#DC2626', stopOpacity: 0.6 }} />
                </linearGradient>
              </defs>
              <rect x="50" y="55" width="calc(100% - 100px)" height="10" fill="url(#eraGradient)" rx="5" />
            </svg>

            {/* Events */}
            {filteredEvents.map((event, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${50 + getTimelinePosition(event.year) * 0.8}px`,
                  top: index % 2 === 0 ? '25px' : '85px',
                  transform: 'translateX(-50%)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={() => setSelectedEvent(event)}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: CATEGORY_CONFIG[event.category].color,
                  border: `3px solid ${hoveredEvent === event ? '#C9A227' : '#1E1E24'}`,
                  transform: hoveredEvent === event ? 'scale(1.3)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }} />
                
                <div style={{
                  position: 'absolute',
                  top: index % 2 === 0 ? '25px' : '-45px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#2D2D35',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  whiteSpace: 'nowrap',
                  fontSize: '0.75rem',
                  opacity: hoveredEvent === event ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none',
                  zIndex: 10
                }}>
                  <div style={{ fontWeight: 'bold', color: '#F5F4F2' }}>{event.name}</div>
                  <div style={{ color: '#9CA3AF' }}>{event.year > 0 ? event.year : Math.abs(event.year) + ' BCE'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Details */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedEvent ? '1fr 1fr' : '1fr', gap: '2rem' }}>
          {/* Events List */}
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '1rem',
            padding: '1.5rem'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              color: '#C9A227'
            }}>
              Historical Events
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredEvents.map((event, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: selectedEvent === event ? '#2D2D35' : '#141419',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    border: `1px solid ${selectedEvent === event ? '#C9A227' : 'transparent'}`,
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      color: ERA_CONFIG[event.era].color,
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }}>
                      {event.year > 0 ? `${event.year} CE` : `${Math.abs(event.year)} BCE`}
                    </span>
                    <div style={{
                      backgroundColor: CATEGORY_CONFIG[event.category].color,
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem'
                    }}>
                      {CATEGORY_CONFIG[event.category].icon} {CATEGORY_CONFIG[event.category].name}
                    </div>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 'bold', 
                    color: '#F5F4F2',
                    margin: '0.5rem 0'
                  }}>
                    {event.name}
                  </h3>
                  
                  <p style={{ 
                    color: '#9CA3AF', 
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    {event.description.substring(0, 120)}...
                  </p>

                  {event.greekText && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.5rem',
                      backgroundColor: '#0D0D0F',
                      borderRadius: '0.5rem',
                      borderLeft: '3px solid #3B82F6'
                    }}>
                      <div style={{ 
                        fontFamily: 'serif',
                        fontSize: '0.875rem',
                        color: '#3B82F6',
                        marginBottom: '0.25rem'
                      }}>
                        {event.greekText}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem',
                        color: '#9CA3AF',
                        fontStyle: 'italic'
                      }}>
                        {event.translation}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Event Detail */}
          {selectedEvent && (
            <div style={{
              backgroundColor: '#1E1E24',
              borderRadius: '1rem',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#F5F4F2',
                  margin: 0
                }}>
                  {selectedEvent.name}
                </h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  style={{
                    backgroundColor: '#2D2D35',
                    color: '#9CA3AF',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  backgroundColor: ERA_CONFIG[selectedEvent.era].color,
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  {selectedEvent.year > 0 ? `${selectedEvent.year} CE` : `${Math.abs(selectedEvent.year)} BCE`}
                </div>
                <div style={{
                  backgroundColor: CATEGORY_CONFIG[selectedEvent.category].color,
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  {CATEGORY_CONFIG[selectedEvent.category].icon} {CATEGORY_CONFIG[selectedEvent.category].name}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1rem', 
                  fontWeight: 'bold', 
                  color: '#C9A227',
                  marginBottom: '0.5rem'
                }}>
                  Description
                </h3>
                <p style={{ 
                  color: '#F5F4F2', 
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  {selectedEvent.description}
                </p>
                <p style={{ 
                  color: '#9CA3AF', 
                  lineHeight: '1.6',
                  fontStyle: 'italic'
                }}>
                  {selectedEvent.significance}
                </p>
              </div>

              {/* Greek Text Analysis */}
              {selectedEvent.greekText && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontWeight: 'bold', 
                    color: '#C9A227',
                    marginBottom: '0.5rem'
                  }}>
                    Primary Text
                  </h3>
                  <div style={{
                    backgroundColor: '#0D0D0F',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    borderLeft: '4px solid #3B82F6'
                  }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      {parseGreekText(selectedEvent.greekText).map((word, index) => (
                        <span
                          key={index}
                          style={{
                            fontFamily: 'serif',
                            fontSize: '1.125rem',
                            color: '#3B82F6',
                            marginRight: '0.5rem',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '0.25rem