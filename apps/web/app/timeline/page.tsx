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
    significance: "Marks the end of ancient Rome and the beginning of the Medieval period in Western Europe."
  },
  { 
    year: 529, 
    name: "Closure of Academy", 
    category: "intellectual", 
    era: "lateAntique",
    description: "Emperor Justinian closes Plato's Academy in Athens, ending nearly a millennium of continuous philosophical education.",
    significance: "Symbolizes the end of ancient philosophical traditions and the triumph of Christian orthodoxy."
  },
  { 
    year: 726, 
    name: "Iconoclastic Controversy", 
    category: "religious", 
    era: "byzantine",
    description: "Emperor Leo III begins the Iconoclastic Controversy, banning religious images and dividing the Byzantine Empire.",
    significance: "Creates lasting theological and political divisions between Eastern and Western Christianity."
  },
  { 
    year: 1054, 
    name: "Great Schism", 
    category: "religious", 
    era: "byzantine",
    description: "The final split between Eastern Orthodox and Roman Catholic churches occurs, creating permanent religious division.",
    significance: "Divides Christianity into Eastern and Western branches that remain separate to this day."
  },
  { 
    year: 1453, 
    name: "Fall of Constantinople", 
    category: "political", 
    era: "byzantine",
    description: "Ottoman forces capture Constantinople, ending the Byzantine Empire and the last remnant of the Roman Empire.",
    significance: "Marks the end of the Middle Ages and drives Greek scholars westward, contributing to the Renaissance."
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
  cultural: '#3B82F6', 
  intellectual: '#7C3AED',
  religious: '#059669'
};

export default function Timeline() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const timelineRef = useRef(null);

  const filteredEvents = activeCategory === 'all' 
    ? EVENTS 
    : EVENTS.filter(event => event.category === activeCategory);

  const sortedEvents = [...filteredEvents].sort((a, b) => a.year - b.year);

  const minYear = Math.min(...sortedEvents.map(e => e.year));
  const maxYear = Math.max(...sortedEvents.map(e => e.year));
  const yearRange = maxYear - minYear;

  const getEventPosition = (year) => {
    return ((year - minYear) / yearRange) * 90 + 5; // 5% margin on each side
  };

  const formatYear = (year) => {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  };

  const scrollToEvent = (eventIndex) => {
    const event = sortedEvents[eventIndex];
    const position = getEventPosition(event.year);
    if (timelineRef.current) {
      const scrollAmount = (position / 100) * timelineRef.current.scrollWidth;
      timelineRef.current.scrollTo({
        left: scrollAmount - timelineRef.current.clientWidth / 2,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const scrollWidth = e.target.scrollWidth - e.target.clientWidth;
    setScrollPosition(scrollLeft / scrollWidth);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        padding: '16px 24px',
        borderBottom: '1px solid #1E1E24',
        backgroundColor: '#0D0D0F'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227',
            textDecoration: 'none'
          }}>
            LOGOS
          </Link>
          
          <div style={{ display: 'flex', gap: '32px' }}>
            {['Lexicon', 'Texts', 'Grammar', 'Timeline', 'Maps'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{
                  color: item === 'Timeline' ? '#C9A227' : '#9CA3AF',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.color = '#C9A227'}
                onMouseLeave={(e) => e.target.style.color = item === 'Timeline' ? '#C9A227' : '#9CA3AF'}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '32px 24px' 
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          color: '#F5F4F2'
        }}>
          Classical Timeline
        </h1>
        
        <p style={{ 
          fontSize: '18px', 
          color: '#9CA3AF', 
          marginBottom: '32px',
          lineHeight: '1.6'
        }}>
          Explore the major events and developments from the Archaic period through the Byzantine Empire
        </p>

        {/* Category Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          {['all', 'political', 'cultural', 'intellectual', 'religious'].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '12px 24px',
                backgroundColor: activeCategory === category ? '#C9A227' : '#1E1E24',
                color: activeCategory === category ? '#0D0D0F' : '#F5F4F2',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== category) {
                  e.target.style.backgroundColor = '#2A2A32';
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== category) {
                  e.target.style.backgroundColor = '#1E1E24';
                }
              }}
            >
              {category === 'all' ? 'All Events' : category}
            </button>
          ))}
        </div>

        {/* Era Legend */}
        <div style={{ 
          display: 'flex', 
          gap: '24px', 
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          {Object.entries(ERA_COLORS).map(([era, color]) => (
            <div key={era} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '16px', 
                height: '16px', 
                backgroundColor: color,
                borderRadius: '50%' 
              }} />
              <span style={{ 
                fontSize: '14px', 
                color: '#9CA3AF',
                textTransform: 'capitalize'
              }}>
                {era === 'lateAntique' ? 'Late Antique' : era}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline Container */}
        <div style={{ 
          backgroundColor: '#1E1E24', 
          borderRadius: '16px', 
          padding: '32px',
          marginBottom: '32px'
        }}>
          {/* Scroll Navigation */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            marginBottom: '24px',
            alignItems: 'center'
          }}>
            <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Navigate:</span>
            <div style={{ 
              display: 'flex', 
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {sortedEvents.slice(0, 5).map((event, index) => (
                <button
                  key={event.year}
                  onClick={() => scrollToEvent(index)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#141419',
                    color: '#9CA3AF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#C9A227';
                    e.target.style.color = '#0D0D0F';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#141419';
                    e.target.style.color = '#9CA3AF';
                  }}
                >
                  {formatYear(event.year)}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline SVG */}
          <div 
            ref={timelineRef}
            onScroll={handleScroll}
            style={{ 
              overflowX: 'auto', 
              overflowY: 'hidden',
              paddingBottom: '16px'
            }}
          >
            <svg 
              width="2400" 
              height="400" 
              style={{ minWidth: '2400px' }}
            >
              {/* Timeline line */}
              <line 
                x1="120" 
                y1="200" 
                x2="2280" 
                y2="200" 
                stroke="#6B7280" 
                strokeWidth="2"
              />
              
              {/* Era backgrounds */}
              {Object.entries(ERA_COLORS).map(([era, color]) => {
                const eraEvents = sortedEvents.filter(e => e.era === era);
                if (eraEvents.length === 0) return null;
                
                const minEraYear = Math.min(...eraEvents.map(e => e.year));
                const maxEraYear = Math.max(...eraEvents.map(e => e.year));
                const startPos = getEventPosition(minEraYear);
                const endPos = getEventPosition(maxEraYear);
                
                return (
                  <rect
                    key={era}
                    x={startPos * 24}
                    y="190"
                    width={(endPos - startPos) * 24}
                    height="20"
                    fill={color}
                    fillOpacity="0.2"
                    rx="4"
                  />
                );
              })}

              {/* Event markers */}
              {sortedEvents.map((event, index) => {
                const x = getEventPosition(event.year) * 24;
                const isEven = index % 2 === 0;
                const y = isEven ? 140 : 240;
                const markerY = 200;
                
                return (
                  <g key={event.year}>
                    {/* Connection line */}
                    <line
                      x1={x}
                      y1={markerY}
                      x2={x}
                      y2={isEven ? y + 60 : y - 20}
                      stroke="#6B7280"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                    
                    {/* Event marker */}
                    <circle
                      cx={x}
                      cy={markerY}
                      r="8"
                      fill={ERA_COLORS[event.era]}
                      stroke="#0D0D0F"
                      strokeWidth="2"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => setExpandedEvent(expandedEvent === event.year ? null : event.year)}
                    />
                    
                    {/* Event card */}
                    <g
                      style={{ cursor: 'pointer' }}
                      onClick={() => setExpandedEvent(expandedEvent === event.year ? null : event.year)}
                    >
                      <rect
                        x={x - 80}
                        y={y}
                        width="160"
                        height="60"
                        fill="#141419"
                        rx="8"
                        stroke={expandedEvent === event.year ? '#C9A227' : 'transparent'}
                        strokeWidth="2"
                      />
                      
                      <text
                        x={x}
                        y={y + 20}
                        textAnchor="middle"
                        fill="#F5F4F2"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {formatYear(event.year)}
                      </text>
                      
                      <text
                        x={x}
                        y={y + 36}
                        textAnchor="middle"
                        fill="#9CA3AF"
                        fontSize="10"
                      >
                        {event.name.length > 18 ? event.name.substring(0, 18) + '...' : event.name}
                      </text>
                      
                      <circle
                        cx={x + 65}
                        cy={y + 15}
                        r="6"
                        fill={CATEGORY_COLORS[event.category]}
                      />
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Scroll indicator */}
          <div style={{ 
            height: '4px', 
            backgroundColor: '#141419', 
            borderRadius: '2px',
            position: 'relative',
            marginTop: '16px'
          }}>
            <div style={{
              height: '4px',
              backgroundColor: '#C9A227',
              borderRadius: '2px',
              width: '20%',
              transform: `translateX(${scrollPosition * 400}%)`
            }} />
          </div>
        </div>

        {/* Event Details */}
        {expandedEvent && (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '2px solid #C9A227'
          }}>
            {(() => {
              const event = sortedEvents.find(e => e.year === expandedEvent);
              return (
                <div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '24px'
                  }}>
                    <div>
                      <h3 style={{ 
                        fontSize: '32px', 
                        fontWeight: 'bold',
                        color: '#F5F4F2',
                        marginBottom: '8px'
                      }}>
                        {event.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: '18px', 
                          color: '#C9A227',
                          fontWeight: 'bold'
                        }}>
                          {formatYear(event.year)}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: ERA_COLORS[event.era],
                          color: '#F5F4F2',
                          borderRadius: '6px',
                          fontSize: '12px',
                          textTransform: 'capitalize'
                        }}>
                          {event.era === 'lateAntique' ? 'Late Antique' : event.era}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: CATEGORY_COLORS[event.category],
                          color: '#F5F4F2',
                          borderRadius: '6px',
                          fontSize: '12px',
                          textTransform: 'capitalize'
                        }}>
                          {event.category}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setExpandedEvent(null)}
                      style={{
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        fontSize: '24px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      color: '#F5F4F2',
                      marginBottom: '12px'
                    }}>
                      Description
                    </h4>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#9CA3AF',
                      lineHeight: '1.6'
                    }}>
                      {event.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      color: '#F5F4F2',
                      marginBottom: '12px'
                    }}>
                      Historical Significance
                    </h4>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#9CA3AF',
                      lineHeight: '1.6'
                    }}>
                      {event.significance}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Event List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {sortedEvents.map((event) => (
            <div
              key={event.year}
              style={{
                backgroundColor: '#1E1E24',
                padding: '24px',
                borderRadius: '12px',
                border: expandedEvent === event.year ? '2px solid #C9A227' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setExpandedEvent(expandedEvent === event.year ? null : event.year)}
              onMouseEnter={(e) => {
                if (expandedEvent !== event.year) {
                  e.currentTarget.style.backgroundColor = '#2A2A32';
                }
              }}
              onMouseLeave={(e) => {
                if (expandedEvent !== event.year) {
                  e.currentTarget.style.backgroundColor = '#1E1E24';
                }
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  color: '#F5F4F2',
                  marginBottom: '8px'
                }}>
                  {event.name}
                </h3>
                <span style={{ 
                  fontSize: '16px', 
                  color: '#C9A227',
                  fontWeight: 'bold',
                  minWidth: 'fit-content',
                  marginLeft: '16px'
                }}>
                  {formatYear(event.year)}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: ERA_COLORS[event.era],
                  color: '#F5F4F2',
                  borderRadius: '6px',
                  fontSize: '12px',
                  textTransform: 'capitalize'
                }}>
                  {event.era === 'lateAntique' ? 'Late Antique' : event.era}
                </span>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: CATEGORY_COLORS[event.category],
                  color: '#F5F4F2',
                  borderRadius: '6px',
                  fontSize: '12px',
                  textTransform: 'capitalize'
                }}>
                  {event.category}
                </span>
              </div>
              
              <p style={{ 
                fontSize: '14px', 
                color: '#9CA3AF',
                lineHeight: '1.5'
              }}>
                {event.description.length > 120 
                  ? event.description.substring(0, 120) + '...'
                  : event.description
                }
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}