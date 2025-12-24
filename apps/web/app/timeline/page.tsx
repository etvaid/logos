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
    significance: "These epics become the cornerstone of Greek education and cultural identity, influencing literature for millennia."
  },
  { 
    year: -776, 
    name: "First Olympic Games", 
    category: "cultural", 
    era: "archaic",
    description: "The first recorded Olympic Games held in Olympia, establishing a quadrennial athletic festival that unites the Greek world.",
    significance: "Creates a common cultural institution across Greek city-states and introduces the concept of organized international competition."
  },
  { 
    year: -508, 
    name: "Cleisthenes' Reforms", 
    category: "political", 
    era: "archaic",
    description: "Cleisthenes implements democratic reforms in Athens, creating the foundations of direct democracy with citizen participation in governance.",
    significance: "Establishes the world's first democratic system, influencing political thought for over 2,000 years."
  },
  { 
    year: -490, 
    name: "Battle of Marathon", 
    category: "political", 
    era: "classical",
    description: "Athenian forces defeat the Persian invasion at Marathon, preserving Greek independence and democratic ideals.",
    significance: "Demonstrates that disciplined citizen-soldiers can defeat imperial armies, inspiring later republican movements."
  },
  { 
    year: -447, 
    name: "Parthenon Construction", 
    category: "cultural", 
    era: "classical",
    description: "Construction begins on the Parthenon in Athens under Pericles, representing the height of Classical Greek architecture and sculpture.",
    significance: "Sets architectural standards that influence Western building design through the present day."
  },
  { 
    year: -431, 
    name: "Peloponnesian War Begins", 
    category: "political", 
    era: "classical",
    description: "The devastating war between Athens and Sparta begins, lasting 27 years and ultimately weakening all Greek city-states.",
    significance: "Marks the beginning of the end of the Classical Greek golden age and Athenian hegemony."
  },
  { 
    year: -399, 
    name: "Death of Socrates", 
    category: "intellectual", 
    era: "classical",
    description: "Socrates is executed by hemlock poisoning after being convicted of corrupting the youth and impiety against the gods.",
    significance: "His death and philosophical method, preserved by Plato, fundamentally shapes Western philosophical inquiry."
  },
  { 
    year: -336, 
    name: "Alexander becomes King", 
    category: "political", 
    era: "hellenistic",
    description: "Alexander III of Macedon ascends to the throne at age 20 and begins his campaign to conquer the known world.",
    significance: "Initiates the Hellenistic period and spreads Greek culture from Egypt to India."
  },
  { 
    year: -323, 
    name: "Death of Alexander", 
    category: "political", 
    era: "hellenistic",
    description: "Alexander the Great dies in Babylon at age 32, leaving behind a vast empire stretching from Greece to India.",
    significance: "His death fragments his empire but spreads Hellenistic culture throughout the ancient world."
  },
  { 
    year: -146, 
    name: "Roman Conquest of Greece", 
    category: "political", 
    era: "hellenistic",
    description: "Romans sack Corinth and establish complete control over mainland Greece, ending Greek political independence.",
    significance: "Marks the end of Greek political autonomy but begins the transmission of Greek culture to Rome."
  },
  { 
    year: -44, 
    name: "Caesar assassinated", 
    category: "political", 
    era: "imperial",
    description: "Julius Caesar is assassinated in the Roman Senate on the Ides of March, ending the Roman Republic's last hope for restoration.",
    significance: "Leads to the rise of Augustus and the Roman Empire, ending republican government for centuries."
  },
  { 
    year: 33, 
    name: "Crucifixion of Christ", 
    category: "religious", 
    era: "imperial",
    description: "Jesus of Nazareth is crucified in Jerusalem under Pontius Pilate, marking the foundational event of Christianity.",
    significance: "Initiates the spread of Christianity throughout the Roman Empire and eventually the world."
  },
  { 
    year: 79, 
    name: "Vesuvius erupts", 
    category: "cultural", 
    era: "imperial",
    description: "Mount Vesuvius erupts, destroying Pompeii and Herculaneum but preserving them for future archaeological study.",
    significance: "Provides an unparalleled snapshot of daily life in the Roman Empire, discovered centuries later."
  },
  { 
    year: 313, 
    name: "Edict of Milan", 
    category: "religious", 
    era: "lateAntique",
    description: "Emperor Constantine issues the Edict of Milan, granting religious tolerance throughout the empire and effectively legalizing Christianity.",
    significance: "Transforms Christianity from a persecuted sect to the empire's dominant religion."
  },
  { 
    year: 410, 
    name: "Sack of Rome", 
    category: "political", 
    era: "lateAntique",
    description: "Visigothic king Alaric I sacks Rome for three days, shocking the Mediterranean world and demonstrating Roman weakness.",
    significance: "Symbolizes the decline of Roman power and the beginning of barbarian dominance in Western Europe."
  },
  { 
    year: 476, 
    name: "Fall of Western Empire", 
    category: "political", 
    era: "lateAntique",
    description: "Germanic chieftain Odoacer deposes Romulus Augustulus, the last Western Roman Emperor, ending the Western Roman Empire.",
    significance: "Marks the end of ancient Rome and the beginning of medieval Europe."
  },
  { 
    year: 527, 
    name: "Justinian becomes Emperor", 
    category: "political", 
    era: "byzantine",
    description: "Justinian I becomes Byzantine Emperor and begins his ambitious campaign to reconquer the Western Roman Empire.",
    significance: "His legal code and architectural achievements, including Hagia Sophia, shape Byzantine civilization."
  },
  { 
    year: 1453, 
    name: "Fall of Constantinople", 
    category: "political", 
    era: "byzantine",
    description: "Ottoman forces capture Constantinople, ending the Byzantine Empire after over 1,000 years of continuous Roman rule.",
    significance: "Marks the definitive end of the Roman Empire and the rise of Ottoman dominance in the Eastern Mediterranean."
  }
];

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
  byzantine: '#059669'
};

const CATEGORY_COLORS = {
  political: '#DC2626',
  intellectual: '#3B82F6',
  cultural: '#C9A227',
  religious: '#7C3AED'
};

export default function TimelinePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const categories = ['all', 'political', 'intellectual', 'cultural', 'religious'];

  const filteredEvents = selectedCategory === 'all' 
    ? EVENTS 
    : EVENTS.filter(event => event.category === selectedCategory);

  // Calculate position for each event on timeline
  const minYear = Math.min(...EVENTS.map(e => e.year));
  const maxYear = Math.max(...EVENTS.map(e => e.year));
  const yearRange = maxYear - minYear;

  const scrollToYear = (targetYear: number) => {
    if (timelineRef.current) {
      const position = ((targetYear - minYear) / yearRange) * timelineRef.current.scrollWidth;
      timelineRef.current.scrollLeft = position - timelineRef.current.clientWidth / 2;
    }
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#141419', 
        borderBottom: '1px solid #1E1E24',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}>
            LOGOS
          </Link>
          
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/library" style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none',
              transition: 'all 0.2s',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => e.target.style.color = '#F5F4F2'}
            onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>
              Library
            </Link>
            <Link href="/timeline" style={{ 
              color: '#C9A227', 
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#1E1E24'
            }}>
              Timeline
            </Link>
            <Link href="/search" style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none',
              transition: 'all 0.2s',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => e.target.style.color = '#F5F4F2'}
            onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}>
              Search
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Historical Timeline
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#9CA3AF', 
            maxWidth: '600px', 
            margin: '0 auto' 
          }}>
            Explore the major events that shaped Western civilization, from archaic Greece through the Byzantine Empire.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ 
          marginBottom: '32px',
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: selectedCategory === category ? '#C9A227' : '#1E1E24',
                color: selectedCategory === category ? '#0D0D0F' : '#F5F4F2',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category) {
                  e.target.style.backgroundColor = '#2A2A32';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category) {
                  e.target.style.backgroundColor = '#1E1E24';
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Era Legend */}
        <div style={{ 
          marginBottom: '32px',
          backgroundColor: '#1E1E24',
          padding: '24px',
          borderRadius: '12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{ gridColumn: '1 / -1', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#F5F4F2' }}>Historical Eras</h3>
          </div>
          {Object.entries(ERA_COLORS).map(([era, color]) => (
            <div key={era} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                backgroundColor: color, 
                borderRadius: '50%' 
              }} />
              <span style={{ fontSize: '14px', color: '#9CA3AF', textTransform: 'capitalize' }}>
                {era === 'lateAntique' ? 'Late Antique' : era}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline Container */}
        <div style={{ 
          backgroundColor: '#1E1E24',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <div 
            ref={timelineRef}
            style={{ 
              position: 'relative',
              height: '400px',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollBehavior: 'smooth'
            }}
          >
            {/* Timeline Line */}
            <div style={{
              position: 'absolute',
              top: '200px',
              left: '0',
              right: '0',
              height: '2px',
              backgroundColor: '#6B7280',
              width: `${Math.max(1200, filteredEvents.length * 150)}px`
            }} />

            {/* Era Backgrounds */}
            {Object.entries(ERA_COLORS).map(([era, color]) => {
              const eraEvents = filteredEvents.filter(e => e.era === era);
              if (eraEvents.length === 0) return null;
              
              const minEraYear = Math.min(...eraEvents.map(e => e.year));
              const maxEraYear = Math.max(...eraEvents.map(e => e.year));
              const startPos = ((minEraYear - minYear) / yearRange) * Math.max(1200, filteredEvents.length * 150);
              const width = ((maxEraYear - minEraYear) / yearRange) * Math.max(1200, filteredEvents.length * 150);
              
              return (
                <div
                  key={era}
                  style={{
                    position: 'absolute',
                    top: '150px',
                    left: `${startPos}px`,
                    width: `${Math.max(width, 100)}px`,
                    height: '100px',
                    backgroundColor: `${color}10`,
                    borderRadius: '8px',
                    border: `1px solid ${color}30`
                  }}
                />
              );
            })}

            {/* Event Markers */}
            {filteredEvents.map((event, index) => {
              const position = ((event.year - minYear) / yearRange) * Math.max(1200, filteredEvents.length * 150);
              const isExpanded = expandedEvent === index;
              const isHovered = hoveredEvent === index;
              
              return (
                <div key={index} style={{ position: 'absolute', left: `${position}px` }}>
                  {/* Year Labels */}
                  <div style={{
                    position: 'absolute',
                    top: '230px',
                    left: '-30px',
                    width: '60px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#9CA3AF'
                  }}>
                    {event.year < 0 ? `${Math.abs(event.year)} BCE` : `${event.year} CE`}
                  </div>

                  {/* Event Marker */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '190px',
                      left: '-8px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: ERA_COLORS[event.era],
                      border: `3px solid ${CATEGORY_COLORS[event.category]}`,
                      cursor: 'pointer',
                      transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.2s',
                      zIndex: isExpanded ? 10 : 1
                    }}
                    onClick={() => setExpandedEvent(isExpanded ? null : index)}
                    onMouseEnter={() => setHoveredEvent(index)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  />

                  {/* Event Name */}
                  <div
                    style={{
                      position: 'absolute',
                      top: isExpanded ? '50px' : '160px',
                      left: '-60px',
                      width: '120px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: isExpanded ? '#C9A227' : '#F5F4F2',
                      fontWeight: isExpanded ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setExpandedEvent(isExpanded ? null : index)}
                  >
                    {event.name}
                  </div>

                  {/* Expanded Event Details */}
                  {isExpanded && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '70px',
                        left: '-150px',
                        width: '300px',
                        backgroundColor: '#141419',
                        border: `2px solid ${ERA_COLORS[event.era]}`,
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                        zIndex: 20
                      }}
                    >
                      <div style={{ marginBottom: '12px' }}>
                        <h4 style={{ 
                          color: '#C9A227', 
                          fontSize: '16px', 
                          fontWeight: '600',
                          marginBottom: '4px' 
                        }}>
                          {event.name}
                        </h4>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ 
                            fontSize: '11px',
                            padding: '4px 8px',
                            backgroundColor: CATEGORY_COLORS[event.category],
                            color: '#F5F4F2',
                            borderRadius: '4px',
                            textTransform: 'capitalize'
                          }}>
                            {event.category}
                          </span>
                          <span style={{ 
                            fontSize: '11px',
                            padding: '4px 8px',
                            backgroundColor: ERA_COLORS[event.era],
                            color: '#F5F4F2',
                            borderRadius: '4px',
                            textTransform: 'capitalize'
                          }}>
                            {event.era === 'lateAntique' ? 'Late Antique' : event.era}
                          </span>
                        </div>
                      </div>
                      
                      <p style={{ 
                        fontSize: '13px', 
                        color: '#9CA3AF',
                        lineHeight: '1.4',
                        marginBottom: '12px'
                      }}>
                        {event.description}
                      </p>
                      
                      <div>
                        <strong style={{ fontSize: '12px', color: '#C9A227' }}>Significance:</strong>
                        <p style={{ 
                          fontSize: '12px', 
                          color: '#9CA3AF',
                          lineHeight: '1.4',
                          marginTop: '4px'
                        }}>
                          {event.significance}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => setExpandedEvent(null)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'none',
                          border: 'none',
                          color: '#9CA3AF',
                          cursor: 'pointer',
                          fontSize: '16px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#F5F4F2'}
                        onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Navigation */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px'
        }}>
          {Object.entries(ERA_COLORS).map(([era, color]) => {
            const eraEvents = filteredEvents.filter(e => e.era === era);
            if (eraEvents.length === 0) return null;
            
            const midYear = eraEvents.reduce((sum, e) => sum + e.year, 0) / eraEvents.length;
            
            return (
              <button
                key={era}
                onClick={() => scrollToYear(midYear)}
                style={{
                  padding: '16px',
                  backgroundColor: '#1E1E24',
                  border: `2px solid ${color}`,
                  borderRadius: '8px',
                  color: '#F5F4F2',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = `${color}20`;
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#1E1E24';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', textTransform: 'capitalize' }}>
                  {era === 'lateAntique' ? 'Late Antique' : era}
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  {eraEvents.length} events
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}