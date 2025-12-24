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
    criticalNotes: "Succession controversy resolved through military backing",
    textVariants: ["Ἀλέξανδρος vs. Ἀλεξάνδρος", "βασιλεύς vs. ἄναξ"],
    greekText: "Ἀλέξανδρος βασιλεὺς Μακεδόνων ἐγένετο",
    translation: "Alexander became king of the Macedonians"
  }
];

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateantique: '#7C3AED',
  byzantine: '#059669'
};

const CATEGORY_ICONS = {
  political: '⚔️',
  intellectual: '📜',
  cultural: '🏛️'
};

export default function InteractiveTimeline() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const timelineRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const timelineStart = -850;
  const timelineEnd = -300;
  const timelineRange = timelineEnd - timelineStart;

  const getEventPosition = (year) => {
    return ((year - timelineStart) / timelineRange) * 100;
  };

  const getEraSegments = () => {
    const segments = [
      { era: 'archaic', start: -800, end: -500, name: 'Archaic Period' },
      { era: 'classical', start: -500, end: -323, name: 'Classical Period' }
    ];
    
    return segments.map(segment => ({
      ...segment,
      left: getEventPosition(segment.start),
      width: getEventPosition(segment.end) - getEventPosition(segment.start)
    }));
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at ${mousePosition.x * 0.1}px ${mousePosition.y * 0.1}px, rgba(201, 162, 39, 0.1) 0%, transparent 50%),
          radial-gradient(circle at ${100 - mousePosition.x * 0.05}px ${100 - mousePosition.y * 0.05}px, rgba(59, 130, 246, 0.05) 0%, transparent 70%),
          linear-gradient(135deg, #0D0D0F 0%, #141419 50%, #1E1E24 100%)
        `,
        transition: 'background 0.5s ease'
      }} />

      {/* 3D Header */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.3)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        transform: 'translateZ(0)'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(45deg, #C9A227, #F59E0B, #C9A227)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '3.5rem',
          fontWeight: 'bold',
          textShadow: '0 0 30px rgba(201, 162, 39, 0.5)',
          transform: 'perspective(1000px) rotateX(10deg)',
          marginBottom: '1rem'
        }}>
          ANCIENT GREEK TIMELINE
        </div>
        <div style={{
          fontSize: '1.2rem',
          color: '#9CA3AF',
          fontStyle: 'italic',
          transform: 'translateY(-10px)'
        }}>
          Interactive Journey Through Classical Antiquity
        </div>
      </div>

      {/* Main Timeline Container */}
      <div style={{ 
        position: 'relative',
        zIndex: 5,
        padding: '4rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Era Background Segments */}
        <div style={{
          position: 'absolute',
          top: '8rem',
          left: '2rem',
          right: '2rem',
          height: '6px',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          {getEraSegments().map((segment, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${segment.left}%`,
                width: `${segment.width}%`,
                height: '100%',
                backgroundColor: ERA_COLORS[segment.era],
                background: `linear-gradient(90deg, ${ERA_COLORS[segment.era]}88, ${ERA_COLORS[segment.era]}, ${ERA_COLORS[segment.era]}88)`,
                boxShadow: `inset 0 2px 4px rgba(255, 255, 255, 0.2), 0 0 20px ${ERA_COLORS[segment.era]}44`
              }}
            />
          ))}
        </div>

        {/* Era Labels */}
        {getEraSegments().map((segment, index) => (
          <div
            key={`label-${index}`}
            style={{
              position: 'absolute',
              left: `calc(2rem + ${segment.left + segment.width/2}%)`,
              top: '6rem',
              transform: 'translateX(-50%)',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: ERA_COLORS[segment.era],
              textShadow: `0 0 10px ${ERA_COLORS[segment.era]}66`,
              background: 'rgba(13, 13, 15, 0.9)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: `1px solid ${ERA_COLORS[segment.era]}44`,
              backdropFilter: 'blur(5px)'
            }}
          >
            {segment.name}
          </div>
        ))}

        {/* Timeline Events */}
        <div ref={timelineRef} style={{ 
          position: 'relative',
          marginTop: '6rem',
          height: '300px'
        }}>
          {EVENTS.map((event, index) => {
            const position = getEventPosition(event.year);
            const isSelected = selectedEvent?.year === event.year;
            const isHovered = hoveredEvent?.year === event.year;
            
            return (
              <div
                key={event.year}
                style={{
                  position: 'absolute',
                  left: `${position}%`,
                  top: index % 2 === 0 ? '50px' : '150px',
                  transform: 'translateX(-50%)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  zIndex: isSelected || isHovered ? 20 : 10
                }}
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={() => setSelectedEvent(isSelected ? null : event)}
              >
                {/* Connection Line */}
                <div style={{
                  position: 'absolute',
                  top: index % 2 === 0 ? '60px' : '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '2px',
                  height: '40px',
                  background: `linear-gradient(${index % 2 === 0 ? '180deg' : '0deg'}, ${ERA_COLORS[event.era]}, transparent)`,
                  boxShadow: `0 0 10px ${ERA_COLORS[event.era]}66`
                }} />

                {/* Event Marker */}
                <div style={{
                  width: isSelected || isHovered ? '24px' : '16px',
                  height: isSelected || isHovered ? '24px' : '16px',
                  borderRadius: '50%',
                  backgroundColor: ERA_COLORS[event.era],
                  border: `3px solid ${isSelected ? '#C9A227' : 'rgba(255, 255, 255, 0.3)'}`,
                  boxShadow: `
                    0 0 20px ${ERA_COLORS[event.era]}aa,
                    ${isSelected ? '0 0 40px #C9A227aa' : '0 4px 15px rgba(0, 0, 0, 0.3)'},
                    inset 0 2px 4px rgba(255, 255, 255, 0.3)
                  `,
                  transform: `scale(${isSelected || isHovered ? 1.2 : 1}) translateZ(0)`,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  margin: '0 auto',
                  background: `radial-gradient(circle at 30% 30%, ${ERA_COLORS[event.era]}, ${ERA_COLORS[event.era]}dd)`
                }} />

                {/* Year Label */}
                <div style={{
                  position: 'absolute',
                  top: index % 2 === 0 ? '-40px' : '30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  color: '#F5F4F2',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                  background: 'rgba(13, 13, 15, 0.9)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(201, 162, 39, 0.3)',
                  backdropFilter: 'blur(5px)',
                  whiteSpace: 'nowrap'
                }}>
                  {Math.abs(event.year)} BCE
                </div>

                {/* Event Card */}
                <div style={{
                  position: 'absolute',
                  top: index % 2 === 0 ? '80px' : '-140px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: isSelected || isHovered ? '280px' : '240px',
                  backgroundColor: '#1E1E24',
                  border: `2px solid ${isSelected ? '#C9A227' : ERA_COLORS[event.era]}66`,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: `
                    0 10px 30px rgba(0, 0, 0, 0.5),
                    0 0 20px ${ERA_COLORS[event.era]}33,
                    ${isSelected ? '0 0 40px #C9A22744' : ''}
                  `,
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  background: `
                    linear-gradient(135deg, #1E1E24 0%, #141419 100%),
                    radial-gradient(circle at top right, ${ERA_COLORS[event.era]}15, transparent)
                  `,
                  opacity: isSelected || isHovered ? 1 : 0.95,
                  transform: `translateX(-50%) scale(${isSelected || isHovered ? 1.05 : 1}) perspective(1000px) rotateX(${isSelected ? '0deg' : '5deg'})`,
                  transformOrigin: 'center bottom'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>
                      {CATEGORY_ICONS[event.category]}
                    </span>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      background: `linear-gradient(45deg, ${ERA_COLORS[event.era]}, #F5F4F2)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {event.name}
                    </h3>
                  </div>

                  <p style={{
                    margin: '0 0 1rem 0',
                    fontSize: '0.85rem',
                    color: '#9CA3AF',
                    lineHeight: '1.4'
                  }}>
                    {event.description}
                  </p>

                  {event.greekText && (
                    <div style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{
                        fontFamily: 'serif',
                        fontSize: '0.9rem',
                        color: '#3B82F6',
                        marginBottom: '0.25rem',
                        direction: 'ltr'
                      }}>
                        <span style={{
                          background: '#3B82F6',
                          color: 'white',
                          padding: '0.1rem 0.3rem',
                          borderRadius: '4px',
                          fontSize: '0.6rem',
                          marginRight: '0.5rem'
                        }}>Α</span>
                        {event.greekText}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#6B7280',
                        fontStyle: 'italic'
                      }}>
                        "{event.translation}"
                      </div>
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem'
                  }}>
                    <span style={{
                      fontSize: '0.7rem',
                      color: ERA_COLORS[event.era],
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: `${ERA_COLORS[event.era]}22`,
                      borderRadius: '12px',
                      border: `1px solid ${ERA_COLORS[event.era]}44`
                    }}>
                      {event.category}
                    </span>
                    
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#6B7280'
                    }}>
                      Sources: {event.sources.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Event Panel */}
        {selectedEvent && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={() => setSelectedEvent(null)}
          >
            <div style={{
              backgroundColor: '#1E1E24',
              borderRadius: '20px',
              padding: '3rem',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              border: `3px solid ${ERA_COLORS[selectedEvent.era]}`,
              boxShadow: `
                0 25px 50px rgba(0, 0, 0, 0.7),
                0 0 60px ${ERA_COLORS[selectedEvent.era]}44,
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
              background: `
                linear-gradient(135deg, #1E1E24 0%, #141419 100%),
                radial-gradient(circle at top right, ${ERA_COLORS[selectedEvent.era]}20, transparent)
              `,
              transform: 'perspective(1000px) rotateX(0deg) scale(1)',
              animation: 'modalSlideIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <div>
                  <h2 style={{
                    margin: 0,
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    background: `linear-gradient(45deg, ${ERA_COLORS[selectedEvent.era]}, #F5F4F2)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: `0 0 30px ${ERA_COLORS[selectedEvent.era]}66`
                  }}>
                    {selectedEvent.name}
                  </h2>
                  <div style={{
                    fontSize: '1.2rem',
                    color: '#9CA3AF',
                    marginTop: '0.5rem'
                  }}>
                    {Math.abs(selectedEvent.year)} BCE • {selectedEvent.era} period
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedEvent(null)}
                  style={{
                    background: 'rgba(220, 38, 38, 0.2)',
                    border: '2px solid #DC2626',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    color: '#DC2626',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    transform: 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 0 20px #DC2626aa';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'grid', gap: '2rem' }}>
                <section>
                  <h3 style={{ 
                    color: ERA_COLORS[selectedEvent.era], 
                    marginBottom: '1rem',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>
                    📜 Description
                  </h3>
                  <p style={{ 
                    color: '#F5F4F2', 
                    lineHeight: '1.6',
                    fontSize: '1rem'
                  }}>
                    {selectedEvent.description}
                  </p>
                </section>

                <section>
                  <h3 style={{ 
                    color: ERA_COLORS[selectedEvent.era], 
                    marginBottom: '1rem',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}>
                    ⚡ Historical Significance
                  </h3>
                  <p style={{ 
                    color: '#F5F4F2', 
                    lineHeight: '1.6',
                    fontSize: '1rem'
                  }}>
                    {selectedEvent.significance}
                  </p>
                </section>

                {selectedEvent.greekText && (
                  <section style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '2px solid rgba