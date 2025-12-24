'use client';
import Link from 'next/link';
import { useState } from 'react';

const events = [
  {
    id: 1,
    date: '800 BCE',
    year: -800,
    name: 'Homer composes epics',
    category: 'intellectual',
    era: 'archaic',
    importance: 9,
    description: 'Homer composes the Iliad and Odyssey, foundational works of Western literature that would influence storytelling and poetry for millennia.',
    significance: 'These epic poems established many conventions of heroic literature and provided a shared cultural foundation for Greek civilization.'
  },
  {
    id: 2,
    date: '776 BCE',
    year: -776,
    name: 'First Olympic Games',
    category: 'cultural',
    era: 'archaic',
    importance: 8,
    description: 'The first recorded Olympic Games are held in Olympia, establishing a tradition of athletic competition that united the Greek world.',
    significance: 'Created a Panhellenic institution that promoted peace, unity, and excellence among Greek city-states.'
  },
  {
    id: 3,
    date: '490 BCE',
    year: -490,
    name: 'Battle of Marathon',
    category: 'political',
    era: 'classical',
    importance: 9,
    description: 'Athenians defeat the Persian army at Marathon, proving that the mighty Persian Empire could be defeated by Greek forces.',
    significance: 'Demonstrated Greek military prowess and helped preserve Greek independence, allowing democracy and philosophy to flourish.'
  },
  {
    id: 4,
    date: '399 BCE',
    year: -399,
    name: 'Death of Socrates',
    category: 'intellectual',
    era: 'classical',
    importance: 10,
    description: 'Socrates is executed by drinking hemlock after being convicted of corrupting youth and impiety.',
    significance: 'His death became a symbol of intellectual martyrdom and inspired Plato to develop systematic philosophy.'
  },
  {
    id: 5,
    date: '336 BCE',
    year: -336,
    name: 'Alexander becomes king',
    category: 'political',
    era: 'classical',
    importance: 10,
    description: 'Alexander III of Macedon ascends to the throne at age 20 after his father Philip II is assassinated.',
    significance: 'Marked the beginning of the most extensive conquest in ancient history, spreading Greek culture across three continents.'
  },
  {
    id: 6,
    date: '323 BCE',
    year: -323,
    name: 'Death of Alexander',
    category: 'political',
    era: 'hellenistic',
    importance: 10,
    description: 'Alexander the Great dies in Babylon at age 32, leaving behind a vast empire stretching from Greece to India.',
    significance: 'His death marked the end of classical Greece and the beginning of the Hellenistic period with its cultural fusion.'
  },
  {
    id: 7,
    date: '44 BCE',
    year: -44,
    name: 'Caesar assassination',
    category: 'political',
    era: 'imperial',
    importance: 9,
    description: 'Julius Caesar is assassinated on the Ides of March by senators who feared he would become a dictator.',
    significance: 'Led to the end of the Roman Republic and the rise of the Roman Empire under Augustus.'
  },
  {
    id: 8,
    date: '33 CE',
    year: 33,
    name: 'Crucifixion',
    category: 'religious',
    era: 'imperial',
    importance: 10,
    description: 'Jesus of Nazareth is crucified in Jerusalem under Pontius Pilate, according to Christian tradition.',
    significance: 'The foundational event of Christianity, which would eventually transform the Roman Empire and Western civilization.'
  },
  {
    id: 9,
    date: '79 CE',
    year: 79,
    name: 'Vesuvius erupts',
    category: 'cultural',
    era: 'imperial',
    importance: 7,
    description: 'Mount Vesuvius erupts, destroying Pompeii and Herculaneum but preserving them under volcanic ash.',
    significance: 'Provided unique archaeological evidence of daily Roman life and demonstrated the power of natural forces.'
  },
  {
    id: 10,
    date: '313 CE',
    year: 313,
    name: 'Edict of Milan',
    category: 'religious',
    era: 'lateAntique',
    importance: 9,
    description: 'Constantine issues the Edict of Milan, granting religious tolerance throughout the empire and ending Christian persecution.',
    significance: 'Marked the beginning of Christianity\'s transformation from persecuted sect to official religion of the Roman Empire.'
  },
  {
    id: 11,
    date: '410 CE',
    year: 410,
    name: 'Sack of Rome',
    category: 'political',
    era: 'lateAntique',
    importance: 8,
    description: 'Visigoth king Alaric I captures and sacks Rome, shocking the ancient world.',
    significance: 'Demonstrated the vulnerability of Rome and marked a major step in the fall of the Western Roman Empire.'
  },
  {
    id: 12,
    date: '476 CE',
    year: 476,
    name: 'Fall of Western Empire',
    category: 'political',
    era: 'lateAntique',
    importance: 10,
    description: 'The last Western Roman Emperor, Romulus Augustulus, is deposed by Germanic chieftain Odoacer.',
    significance: 'Traditionally marks the end of the Western Roman Empire and the beginning of the Middle Ages in Europe.'
  },
  {
    id: 13,
    date: '529 CE',
    year: 529,
    name: 'Academy closes',
    category: 'intellectual',
    era: 'byzantine',
    importance: 8,
    description: 'Emperor Justinian closes Plato\'s Academy in Athens, ending nearly 900 years of continuous philosophical teaching.',
    significance: 'Symbolized the end of classical pagan philosophy and the triumph of Christian orthodoxy.'
  },
  {
    id: 14,
    date: '1453 CE',
    year: 1453,
    name: 'Fall of Constantinople',
    category: 'political',
    era: 'byzantine',
    importance: 9,
    description: 'Ottoman forces under Mehmed II capture Constantinople, ending the Byzantine Empire after over 1,000 years.',
    significance: 'Marked the definitive end of the Roman Empire and drove Greek scholars westward, contributing to the Renaissance.'
  }
];

const eraColors = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
  byzantine: '#059669'
};

const categoryColors = {
  political: '#DC2626',
  religious: '#7C3AED',
  intellectual: '#3B82F6',
  cultural: '#F59E0B'
};

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.category === filter);

  const timelineStart = -800;
  const timelineEnd = 1453;
  const timelineRange = timelineEnd - timelineStart;

  const getPositionPercent = (year) => {
    return ((year - timelineStart) / timelineRange) * 100;
  };

  const getEraSegments = () => {
    const eras = [
      { name: 'Archaic', start: -800, end: -500, color: eraColors.archaic },
      { name: 'Classical', start: -500, end: -323, color: eraColors.classical },
      { name: 'Hellenistic', start: -323, end: -31, color: eraColors.hellenistic },
      { name: 'Imperial', start: -31, end: 284, color: eraColors.imperial },
      { name: 'Late Antique', start: 284, end: 600, color: eraColors.lateAntique },
      { name: 'Byzantine', start: 600, end: 1453, color: eraColors.byzantine }
    ];

    return eras.map(era => ({
      ...era,
      left: getPositionPercent(era.start),
      width: getPositionPercent(era.end) - getPositionPercent(era.start)
    }));
  };

  const closeModal = () => setSelectedEvent(null);

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        padding: '16px 24px',
        borderBottom: '1px solid #2D2D35'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none'
          }}>
            ΛΟΓΟΣ
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/library" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Library</Link>
            <Link href="/timeline" style={{ color: '#C9A227', textDecoration: 'none' }}>Timeline</Link>
            <Link href="/maps" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Maps</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '64px 24px' }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Classical Timeline
        </h1>
        <p style={{ fontSize: '20px', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto' }}>
          Journey through 2,253 years of classical civilization, from Homer's epics to the fall of Constantinople
        </p>
      </div>

      {/* Filters */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 24px 32px',
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'all', label: 'All Events', color: '#C9A227' },
          { key: 'political', label: 'Political', color: categoryColors.political },
          { key: 'religious', label: 'Religious', color: categoryColors.religious },
          { key: 'intellectual', label: 'Intellectual', color: categoryColors.intellectual },
          { key: 'cultural', label: 'Cultural', color: categoryColors.cultural }
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: `2px solid ${filter === key ? color : '#2D2D35'}`,
              backgroundColor: filter === key ? `${color}20` : '#1E1E24',
              color: filter === key ? color : '#9CA3AF',
              fontSize: '16px',
              fontWeight: filter === key ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (filter !== key) {
                e.target.style.borderColor = color;
                e.target.style.color = color;
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== key) {
                e.target.style.borderColor = '#2D2D35';
                e.target.style.color = '#9CA3AF';
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Timeline Container */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 24px 64px'
      }}>
        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #2D2D35'
        }}>
          {/* Timeline */}
          <div style={{ 
            position: 'relative',
            height: '300px',
            overflow: 'hidden',
            borderRadius: '8px',
            border: '1px solid #2D2D35'
          }}>
            {/* Era Background Bands */}
            <div style={{ position: 'relative', height: '100%' }}>
              {getEraSegments().map((era, index) => (
                <div
                  key={era.name}
                  style={{
                    position: 'absolute',
                    left: `${era.left}%`,
                    width: `${era.width}%`,
                    height: '100%',
                    background: `linear-gradient(to bottom, ${era.color}10, ${era.color}05)`,
                    borderRight: index < 5 ? `1px solid ${era.color}30` : 'none'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: era.color
                  }}>
                    {era.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Line */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '0',
              right: '0',
              height: '2px',
              backgroundColor: '#2D2D35',
              transform: 'translateY(-50%)'
            }} />

            {/* Event Markers */}
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                style={{
                  position: 'absolute',
                  left: `${getPositionPercent(event.year)}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: `${Math.max(12, event.importance * 2)}px`,
                  height: `${Math.max(12, event.importance * 2)}px`,
                  borderRadius: '50%',
                  backgroundColor: eraColors[event.era],
                  border: `3px solid ${categoryColors[event.category]}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translate(-50%, -50%) scale(1.3)';
                  e.target.style.boxShadow = `0 8px 24px ${eraColors[event.era]}40`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translate(-50%, -50%) scale(1)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                }}
              />
            ))}

            {/* Year Labels */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              fontSize: '12px',
              color: '#6B7280'
            }}>
              800 BCE
            </div>
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              fontSize: '12px',
              color: '#6B7280'
            }}>
              1453 CE
            </div>
          </div>

          {/* Legend */}
          <div style={{ 
            marginTop: '24px', 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>CATEGORIES</div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {Object.entries(categoryColors).map(([category, color]) => (
                  <div key={category} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: color
                    }} />
                    <span style={{ fontSize: '12px', color: '#9CA3AF', textTransform: 'capitalize' }}>
                      {category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: '#1E1E24',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              border: `2px solid ${eraColors[selectedEvent.era]}`,
              position: 'relative',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: eraColors[selectedEvent.era],
                border: `3px solid ${categoryColors[selectedEvent.category]}`
              }} />
              <div>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  color: eraColors[selectedEvent.era],
                  marginBottom: '4px'
                }}>
                  {selectedEvent.name}
                </h2>
                <div style={{ color: '#9CA3AF', fontSize: '16px' }}>
                  {selectedEvent.date} • {selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1)} • {selectedEvent.era.charAt(0).toUpperCase() + selectedEvent.era.slice(1)}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '12px',
                color: '#F5F4F2'
              }}>
                Description
              </h3>
              <p style={{ 
                color: '#9CA3AF', 
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                {selectedEvent.description}
              </p>
            </div>

            <div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '12px',
                color: '#F5F4F2'
              }}>
                Historical Significance
              </h3>
              <p style={{ 
                color: '#9CA3AF', 
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                {selectedEvent.significance}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}