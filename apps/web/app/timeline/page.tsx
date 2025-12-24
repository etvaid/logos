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
    criticalNotes: "Vulgate vs. Ptolemaic source traditions",
    textVariants: ["Ἀλέξανδρος vs. Ἀλεξάνδρος"],
    greekText: "Ἀλέξανδρος βασιλεὺς τῶν Μακεδόνων ἐγένετο",
    translation: "Alexander became king of the Macedonians"
  },
  { 
    year: -323, 
    name: "Death of Alexander", 
    category: "political", 
    era: "hellenistic",
    description: "Alexander the Great dies in Babylon at age 32, leaving a vast empire stretching from Greece to India without a clear succession plan.",
    significance: "His death triggers the Wars of the Successors and creates the Hellenistic kingdoms that dominate the ancient world for centuries.",
    sources: ["Plutarch, Vita Alexandri 75-77", "Diodorus 17.117"],
    manuscripts: ["Codex Parisinus 1671", "P.Oxy. 1367"],
    criticalNotes: "Cause of death disputed: poison vs. fever vs. disease",
    textVariants: ["ἐτελεύτησε vs. ἀπέθανε"],
    greekText: "Ἀλέξανδρος ἐν Βαβυλῶνι ἐτελεύτησε",
    translation: "Alexander died in Babylon"
  },
  { 
    year: -146, 
    name: "Roman Conquest of Greece", 
    category: "political", 
    era: "hellenistic",
    description: "Roman forces destroy Corinth and establish Macedonia as a Roman province, effectively ending Greek political independence.",
    significance: "Marks the transition from Hellenistic to Roman hegemony, though Greek cultural influence continues to grow.",
    sources: ["Polybius 39.2", "Pausanias 7.16"],
    manuscripts: ["Codex Vaticanus 124", "P.Tebt. 1.8"],
    criticalNotes: "Archaeological evidence confirms widespread destruction at Corinth",
    textVariants: ["Κόρινθος vs. Κορίνθος"],
    greekText: "Κόρινθος ὑπὸ Ῥωμαίων κατεσκάφη",
    translation: "Corinth was razed by the Romans"
  }
];

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  late: '#7C3AED',
  byzantine: '#059669'
};

const CATEGORY_COLORS = {
  political: '#DC2626',
  intellectual: '#3B82F6',
  cultural: '#059669'
};

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('timeline');
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const timelineRef = useRef(null);

  const filteredEvents = filter === 'all' ? EVENTS : EVENTS.filter(event => event.category === filter);

  const formatYear = (year) => {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  };

  const TimelineVisualization = () => {
    const svgWidth = 1200;
    const svgHeight = 120;
    const minYear = -800;
    const maxYear = -146;
    const yearRange = maxYear - minYear;

    return (
      <div style={{
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid rgba(201, 162, 39, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ 
            color: '#F5F4F2', 
            fontSize: '24px', 
            fontWeight: '700',
            margin: 0,
            background: 'linear-gradient(135deg, #C9A227, #F59E0B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Ancient Greek Historical Timeline
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['all', 'political', 'intellectual', 'cultural'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: filter === f ? '2px solid #C9A227' : '1px solid #6B7280',
                  backgroundColor: filter === f ? 'rgba(201, 162, 39, 0.1)' : '#1E1E24',
                  color: filter === f ? '#C9A227' : '#9CA3AF',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize'
                }}
                onMouseEnter={(e) => {
                  if (filter !== f) {
                    e.target.style.borderColor = '#C9A227';
                    e.target.style.color = '#C9A227';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== f) {
                    e.target.style.borderColor = '#6B7280';
                    e.target.style.color = '#9CA3AF';
                  }
                }}
              >
                {f === 'all' ? 'All Events' : f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
          <svg width={svgWidth} height={svgHeight} style={{ minWidth: '1200px' }}>
            {/* Timeline base */}
            <line
              x1={50}
              y1={60}
              x2={svgWidth - 50}
              y2={60}
              stroke="url(#timelineGradient)"
              strokeWidth="4"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="80%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Era markers */}
            <text x={100} y={20} fill="#D97706" fontSize="12" fontWeight="600">Archaic</text>
            <text x={400} y={20} fill="#F59E0B" fontSize="12" fontWeight="600">Classical</text>
            <text x={800} y={20} fill="#3B82F6" fontSize="12" fontWeight="600">Hellenistic</text>

            {/* Events */}
            {filteredEvents.map((event, index) => {
              const x = 50 + ((event.year - minYear) / yearRange) * (svgWidth - 100);
              const isHovered = hoveredEvent === event.year;
              const isSelected = selectedEvent?.year === event.year;
              
              return (
                <g key={event.year}>
                  {/* Event line */}
                  <line
                    x1={x}
                    y1={35}
                    x2={x}
                    y2={85}
                    stroke={ERA_COLORS[event.era]}
                    strokeWidth={isHovered || isSelected ? "3" : "2"}
                    opacity={0.8}
                  />
                  
                  {/* Event dot */}
                  <circle
                    cx={x}
                    cy={60}
                    r={isHovered || isSelected ? "8" : "6"}
                    fill={CATEGORY_COLORS[event.category]}
                    stroke={ERA_COLORS[event.era]}
                    strokeWidth="2"
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      filter: isHovered || isSelected ? 'url(#glow)' : 'none'
                    }}
                    onMouseEnter={() => setHoveredEvent(event.year)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    onClick={() => setSelectedEvent(event)}
                  />
                  
                  {/* Year label */}
                  <text
                    x={x}
                    y={100}
                    fill="#9CA3AF"
                    fontSize="11"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {formatYear(event.year)}
                  </text>
                  
                  {/* Hover tooltip */}
                  {isHovered && (
                    <g>
                      <rect
                        x={x - 60}
                        y={-10}
                        width="120"
                        height="30"
                        fill="#0D0D0F"
                        stroke={ERA_COLORS[event.era]}
                        strokeWidth="1"
                        rx="4"
                        opacity="0.95"
                      />
                      <text
                        x={x}
                        y={8}
                        fill="#F5F4F2"
                        fontSize="10"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        {event.name.length > 20 ? event.name.substring(0, 20) + '...' : event.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: '#9CA3AF'
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#DC2626' }}></div>
              <span>Political</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3B82F6' }}></div>
              <span>Intellectual</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#059669' }}></div>
              <span>Cultural</span>
            </div>
          </div>
          <div>Click events for detailed analysis</div>
        </div>
      </div>
    );
  };

  const EventCard = ({ event }) => (
    <div
      style={{
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '16px',
        border: `1px solid ${ERA_COLORS[event.era]}40`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => setSelectedEvent(event)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 12px 48px rgba(0, 0, 0, 0.5), 0 0 24px ${ERA_COLORS[event.era]}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Era accent bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${ERA_COLORS[event.era]}, ${CATEGORY_COLORS[event.category]})`
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{
            color: '#F5F4F2',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            background: `linear-gradient(135deg, ${ERA_COLORS[event.era]}, ${CATEGORY_COLORS[event.category]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {event.name}
          </h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{
              backgroundColor: `${ERA_COLORS[event.era]}20`,
              color: ERA_COLORS[event.era],
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'capitalize',
              border: `1px solid ${ERA_COLORS[event.era]}40`
            }}>
              {event.era}
            </span>
            <span style={{
              backgroundColor: `${CATEGORY_COLORS[event.category]}20`,
              color: CATEGORY_COLORS[event.category],
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'capitalize',
              border: `1px solid ${CATEGORY_COLORS[event.category]}40`
            }}>
              {event.category}
            </span>
          </div>
        </div>
        <div style={{
          backgroundColor: `${ERA_COLORS[event.era]}15`,
          color: ERA_COLORS[event.era],
          padding: '8px 16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '700',
          border: `1px solid ${ERA_COLORS[event.era]}30`
        }}>
          {formatYear(event.year)}
        </div>
      </div>

      <p style={{
        color: '#9CA3AF',
        lineHeight: '1.6',
        margin: '0',
        fontSize: '14px'
      }}>
        {event.description}
      </p>

      {event.greekText && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <div style={{
            color: '#3B82F6',
            fontSize: '16px',
            fontFamily: 'Georgia, serif',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: '600'
            }}>Α</span>
            {event.greekText}
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '14px', fontStyle: 'italic' }}>
            "{event.translation}"
          </div>
        </div>
      )}
    </div>
  );

  const DetailModal = () => {
    if (!selectedEvent) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }} onClick={() => setSelectedEvent(null)}>
        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `2px solid ${ERA_COLORS[selectedEvent.era]}`,
          boxShadow: `0 24px 64px rgba(0, 0, 0, 0.6), 0 0 48px ${ERA_COLORS[selectedEvent.era]}40`,
          position: 'relative'
        }} onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button
            onClick={() => setSelectedEvent(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
              e.target.style.color = '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#9CA3AF';
            }}
          >
            ×
          </button>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <span style={{
                backgroundColor: `${ERA_COLORS[selectedEvent.era]}20`,
                color: ERA_COLORS[selectedEvent.era],
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'capitalize',
                border: `1px solid ${ERA_COLORS[selectedEvent.era]}40`
              }}>
                {selectedEvent.era}
              </span>
              <span style={{
                backgroundColor: `${CATEGORY_COLORS[selectedEvent.category]}20`,
                color: CATEGORY_COLORS[selectedEvent.category],
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'capitalize',
                border: `1px solid ${CATEGORY_COLORS[selectedEvent.category]}40`
              }}>
                {selectedEvent.category}
              </span>
              <span style={{
                backgroundColor: `${ERA_COLORS[selectedEvent.era]}15`,
                color: ERA_COLORS[selectedEvent.era],
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '700',
                border: `1px solid ${ERA_COLORS[selectedEvent.era]}30`
              }}>
                {formatYear(selectedEvent.year)}
              </span>
            </div>

            <h1 style={{
              color: '#F5F4F2',
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 16px 0',
              background: `linear-gradient(135deg, ${ERA_COLORS[selectedEvent.era]}, ${CATEGORY_COLORS[selectedEvent.category]})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {selectedEvent.name}
            </h1>

            <p style={{
              color: '#9CA3AF',
              fontSize: '16px',
              lineHeight: '1.7',
              margin: 0
            }}>
              {selectedEvent.description}
            </p>
          </div>

          {/* Greek Text */}
          {selectedEvent.greekText && (
            <div style={{
              marginBottom: '24px',
              padding: '20px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <h3 style={{ color: '#3B82F6', fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  backgroundColor: '#3B82F6',
                  color: 'white',