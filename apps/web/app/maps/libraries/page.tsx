'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LibrariesMap() {
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [hoveredLibrary, setHoveredLibrary] = useState(null);
  const [viewMode, setViewMode] = useState('map');
  const [eraFilter, setEraFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showManuscripts, setShowManuscripts] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  const libraries = [
    { 
      id: 1, 
      name: 'Library of Alexandria', 
      location: 'Alexandria, Egypt', 
      lat: 31.2, 
      lng: 29.9, 
      era: 'Hellenistic', 
      founded: '295 BCE', 
      description: 'Greatest library of the ancient world, part of the Mouseion', 
      scrolls: 700000,
      x: 520,
      y: 340,
      scholars: ['Eratosthenes', 'Apollonius of Rhodes', 'Callimachus', 'Euclid', 'Archimedes'],
      collections: ['Homer manuscripts', 'Mathematical treatises', 'Medical texts', 'Astronomical works', 'Geographical studies'],
      fate: 'Gradual decline from 3rd century CE',
      manuscripts: [
        { title: 'Iliad α-δ', author: 'Homer', variants: 42, apparatus: 'Critical edition with scholia' },
        { title: 'Elements', author: 'Euclid', variants: 15, apparatus: 'Geometric proofs with diagrams' }
      ],
      catalogSystem: 'Pinakes by Callimachus',
      preservation: 'Papyrus scrolls in cedar boxes'
    },
    { 
      id: 2, 
      name: 'Library of Pergamon', 
      location: 'Pergamon, Asia Minor', 
      lat: 39.1, 
      lng: 27.2, 
      era: 'Hellenistic', 
      founded: '197 BCE', 
      description: 'Rival to Alexandria, invented parchment', 
      scrolls: 200000,
      x: 480,
      y: 260,
      scholars: ['Crates of Mallus', 'Apollodorus of Athens', 'Demetrius of Scepsis'],
      collections: ['Aristotelian texts', 'Stoic philosophy', 'Historical works', 'Grammatical treatises'],
      fate: 'Gifted to Cleopatra by Mark Antony',
      manuscripts: [
        { title: 'Metaphysics', author: 'Aristotle', variants: 28, apparatus: 'Peripatetic commentary tradition' },
        { title: 'Atthis', author: 'Apollodorus', variants: 12, apparatus: 'Historical chronography' }
      ],
      catalogSystem: 'Attalid royal registry',
      preservation: 'Parchment codices (pergamene invention)'
    },
    { 
      id: 3, 
      name: 'Trajan\'s Library', 
      location: 'Rome', 
      lat: 41.9, 
      lng: 12.5, 
      era: 'Imperial', 
      founded: '112 CE', 
      description: 'Imperial Roman library complex with Greek and Latin sections', 
      scrolls: 300000,
      x: 380,
      y: 280,
      scholars: ['Tacitus', 'Suetonius', 'Pliny the Younger', 'Juvenal'],
      collections: ['Imperial archives', 'Legal documents', 'Poetry collections', 'Historiographical works'],
      fate: 'Survived until Byzantine period',
      manuscripts: [
        { title: 'Annals', author: 'Tacitus', variants: 35, apparatus: 'Historical narrative with sources' },
        { title: 'Satires', author: 'Juvenal', variants: 22, apparatus: 'Satirical poetry with scholia' }
      ],
      catalogSystem: 'Bibliotheca Graeca et Latina division',
      preservation: 'Stone niches with bronze nameplates'
    },
    { 
      id: 4, 
      name: 'Library of Hadrian', 
      location: 'Athens', 
      lat: 37.98, 
      lng: 23.73, 
      era: 'Imperial', 
      founded: '132 CE', 
      description: 'Hadrian\'s philhellenic gift to Athens', 
      scrolls: 16800,
      x: 460,
      y: 300,
      scholars: ['Pausanias', 'Herodes Atticus', 'Aelius Aristides'],
      collections: ['Classical Greek literature', 'Philosophical texts', 'Rhetorical works', 'Antiquarian studies'],
      fate: 'Damaged in Herulian invasion 267 CE',
      manuscripts: [
        { title: 'Description of Greece', author: 'Pausanias', variants: 18, apparatus: 'Periegetic literature' },
        { title: 'Sacred Tales', author: 'Aelius Aristides', variants: 14, apparatus: 'Rhetorical prose' }
      ],
      catalogSystem: 'Hadrianic imperial classification',
      preservation: 'Climate-controlled marble chambers'
    },
    { 
      id: 5, 
      name: 'Library of Celsus', 
      location: 'Ephesus', 
      lat: 37.94, 
      lng: 27.34, 
      era: 'Imperial', 
      founded: '135 CE', 
      description: 'Memorial library for Tiberius Julius Celsus', 
      scrolls: 12000,
      x: 490,
      y: 290,
      scholars: ['Xenophon of Ephesus', 'Soranus', 'Rufus of Ephesus'],
      collections: ['Medical texts', 'Rhetorical handbooks', 'Local histories', 'Novel literature'],
      fate: 'Earthquake damage 3rd century CE',
      manuscripts: [
        { title: 'Ephesiaca', author: 'Xenophon of Ephesus', variants: 8, apparatus: 'Romance novel tradition' },
        { title: 'Gynecology', author: 'Soranus', variants: 25, apparatus: 'Medical treatise with diagrams' }
      ],
      catalogSystem: 'Celsian memorial organization',
      preservation: 'Two-story architectural niches'
    },
    { 
      id: 6, 
      name: 'Palatine Library', 
      location: 'Rome', 
      lat: 41.89, 
      lng: 12.49, 
      era: 'Imperial', 
      founded: '28 BCE', 
      description: 'Augustus\'s private library adjacent to Temple of Apollo', 
      scrolls: 50000,
      x: 375,
      y: 285,
      scholars: ['Ovid', 'Horace', 'Propertius', 'Hyginus'],
      collections: ['Augustan poetry', 'Sibylline books', 'Imperial correspondence', 'Mythographical works'],
      fate: 'Fire damage under Domitian',
      manuscripts: [
        { title: 'Metamorphoses', author: 'Ovid', variants: 33, apparatus: 'Epic poetry with commentary' },
        { title: 'Odes', author: 'Horace', variants: 19, apparatus: 'Lyric poetry with metrical analysis' }
      ],
      catalogSystem: 'Augustan court library system',
      preservation: 'Temple precinct with divine protection'
    },
    { 
      id: 7, 
      name: 'Imperial Library', 
      location: 'Constantinople', 
      lat: 41.01, 
      lng: 28.98, 
      era: 'Byzantine', 
      founded: '357 CE', 
      description: 'Constantius II\'s great library preserving ancient texts', 
      scrolls: 120000,
      x: 500,
      y: 270,
      scholars: ['Photius', 'Arethas', 'Constantine VII', 'Michael Psellus'],
      collections: ['Classical preservation', 'Patristic literature', 'Imperial chronicles', 'Theological works'],
      fate: 'Destroyed in Fourth Crusade 1204',
      manuscripts: [
        { title: 'Bibliotheca', author: 'Photius', variants: 52, apparatus: 'Literary abstracts and criticism' },
        { title: 'De Administrando Imperio', author: 'Constantine VII', variants: 8, apparatus: 'Administrative handbook' }
      ],
      catalogSystem: 'Byzantine ecclesiastical arrangement',
      preservation: 'Minuscule codices on parchment'
    }
  ];

  const eraColors = {
    'Archaic': '#D97706',
    'Classical': '#F59E0B',
    'Hellenistic': '#3B82F6',
    'Imperial': '#DC2626',
    'Late Antique': '#7C3AED',
    'Byzantine': '#059669'
  };

  const filteredLibraries = libraries.filter(lib => {
    const matchesEra = eraFilter === 'all' || lib.era === eraFilter;
    const matchesSearch = lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lib.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lib.scholars.some(scholar => scholar.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesEra && matchesSearch;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2',
      fontFamily: 'system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(201, 162, 39, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(220, 38, 38, 0.05) 0%, transparent 50%)
        `,
        animation: 'pulse 4s ease-in-out infinite'
      }} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(201, 162, 39, 0.5)); }
          50% { filter: drop-shadow(0 0 20px rgba(201, 162, 39, 0.8)); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '2rem',
        borderBottom: '1px solid #1E1E24'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #C9A227 0%, #F59E0B 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: 0,
              animation: 'glow 3s ease-in-out infinite'
            }}>
              Ancient Libraries Atlas
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: '#9CA3AF',
              margin: '0.5rem 0 0 0'
            }}>
              Mapping the Great Repositories of Classical Knowledge
            </p>
          </div>

          <Link href="/" style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#C9A227',
            color: '#0D0D0F',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            ':hover': {
              backgroundColor: '#F59E0B',
              transform: 'translateY(-2px)'
            }
          }}>
            ← Back to Logos
          </Link>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '2rem auto 0',
          flexWrap: 'wrap'
        }}>
          {/* View Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: '#1E1E24',
            borderRadius: '8px',
            padding: '4px'
          }}>
            <button
              onClick={() => setViewMode('map')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: viewMode === 'map' ? '#C9A227' : 'transparent',
                color: viewMode === 'map' ? '#0D0D0F' : '#F5F4F2',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Map View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: viewMode === 'timeline' ? '#C9A227' : 'transparent',
                color: viewMode === 'timeline' ? '#0D0D0F' : '#F5F4F2',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Timeline
            </button>
          </div>

          {/* Era Filter */}
          <select
            value={eraFilter}
            onChange={(e) => setEraFilter(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              border: '1px solid #3B82F6',
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            <option value="all">All Eras</option>
            {Object.keys(eraColors).map(era => (
              <option key={era} value={era}>{era}</option>
            ))}
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Search libraries, locations, scholars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              border: '1px solid #6B7280',
              borderRadius: '8px',
              minWidth: '300px',
              fontSize: '0.9rem'
            }}
          />

          {/* Manuscripts Toggle */}
          <button
            onClick={() => setShowManuscripts(!showManuscripts)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: showManuscripts ? '#3B82F6' : '#1E1E24',
              color: '#F5F4F2',
              border: '1px solid #3B82F6',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {showManuscripts ? '📜 Manuscripts' : '📚 Collections'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 200px)',
        position: 'relative',
        zIndex: 5
      }}>
        {/* Map/Timeline View */}
        <div style={{
          flex: 1,
          position: 'relative',
          padding: '2rem'
        }}>
          {viewMode === 'map' ? (
            /* Map View */
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              backgroundColor: '#141419',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #1E1E24'
            }}>
              <svg
                viewBox="0 0 800 500"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              >
                {/* Mediterranean Sea */}
                <ellipse
                  cx="400"
                  cy="300"
                  rx="300"
                  ry="150"
                  fill="rgba(59, 130, 246, 0.2)"
                  stroke="rgba(59, 130, 246, 0.4)"
                  strokeWidth="2"
                />

                {/* Coastlines */}
                <path
                  d="M100 250 Q200 230 300 240 Q400 250 500 245 Q600 240 700 250"
                  stroke="rgba(107, 114, 128, 0.5)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M150 350 Q300 360 450 355 Q600 350 750 360"
                  stroke="rgba(107, 114, 128, 0.5)"
                  strokeWidth="2"
                  fill="none"
                />

                {/* Connection lines between libraries */}
                {filteredLibraries.map((lib, i) => 
                  filteredLibraries.slice(i + 1).map((lib2, j) => (
                    <line
                      key={`${lib.id}-${lib2.id}`}
                      x1={lib.x}
                      y1={lib.y}
                      x2={lib2.x}
                      y2={lib2.y}
                      stroke="rgba(201, 162, 39, 0.1)"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                      style={{
                        animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`
                      }}
                    />
                  ))
                )}

                {/* Library markers */}
                {filteredLibraries.map((library, index) => (
                  <g key={library.id}>
                    {/* Glow effect */}
                    <circle
                      cx={library.x}
                      cy={library.y}
                      r="20"
                      fill={`${eraColors[library.era]}40`}
                      style={{
                        animation: `pulse ${3 + index * 0.5}s ease-in-out infinite`
                      }}
                    />
                    
                    {/* Main marker */}
                    <circle
                      cx={library.x}
                      cy={library.y}
                      r={hoveredLibrary === library.id ? "12" : "8"}
                      fill={eraColors[library.era]}
                      stroke="#F5F4F2"
                      strokeWidth="2"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        animation: hoveredLibrary === library.id ? 'float 2s ease-in-out infinite' : 'none'
                      }}
                      onMouseEnter={() => setHoveredLibrary(library.id)}
                      onMouseLeave={() => setHoveredLibrary(null)}
                      onClick={() => setSelectedLibrary(library)}
                    />

                    {/* Scroll count indicator */}
                    <text
                      x={library.x}
                      y={library.y - 25}
                      textAnchor="middle"
                      fill="#F5F4F2"
                      fontSize="12"
                      fontWeight="600"
                      style={{
                        opacity: hoveredLibrary === library.id ? 1 : 0.7,
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      {(library.scrolls / 1000).toFixed(0)}K
                    </text>

                    {/* Library name */}
                    <text
                      x={library.x}
                      y={library.y + 25}
                      textAnchor="middle"
                      fill="#F5F4F2"
                      fontSize="14"
                      fontWeight="bold"
                      style={{
                        opacity: hoveredLibrary === library.id ? 1 : 0.8,
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      {library.name.split(' ').slice(0, 2).join(' ')}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Legend */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                backgroundColor: '#1E1E24',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #6B7280'
              }}>
                <h4 style={{
                  color: '#C9A227',
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  Historical Periods
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {Object.entries(eraColors).map(([era, color]) => (
                    <div key={era} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: color,
                        borderRadius: '50%'
                      }} />
                      <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{era}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Timeline View */
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#141419',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid #1E1E24',
              overflow: 'auto'
            }}>
              <h3 style={{
                color: '#C9A227',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                Chronological Timeline
              </h3>
              
              <div style={{ position: 'relative' }}>
                {/* Timeline axis */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  backgroundColor: '#C9A227',
                  transform: 'translateX(-50%)'
                }} />

                {filteredLibraries
                  .sort((a, b) => parseInt(a.founded) - parseInt(b.founded))
                  .map((library, index) => (
                    <div
                      key={library.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '3rem',
                        position: 'relative'
                      }}
                    >
                      {/* Timeline marker */}
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        width: '16px',
                        height: '16px',
                        backgroundColor: eraColors[library.era],
                        borderRadius: '50%',
                        border: '3px solid #0D0D0F',
                        transform: 'translateX(-50%)',
                        zIndex: 10
                      }} />

                      {/* Content card */}
                      <div style={{
                        width: '45%',
                        marginLeft: index % 2 === 0 ? '0' : '55%',
                        backgroundColor: '#1E1E24',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: `1px solid ${eraColors[library.era]}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        ':hover': {
                          transform: 'scale(1.02)',
                          boxShadow: `0 10px 30px ${eraColors[library.era]}40`
                        }
                      }}
                      onClick={() => setSelectedLibrary(library)}
                      onMouseEnter={() => setHoveredLibrary(library.id)}
                      onMouseLeave={() => setHoveredLibrary(null)}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                      }}>
                        <h4 style={{
                          color: '#F5F4F2',
                          margin: 0,
                          fontSize: '1.2rem'
                        }}>
                          {library.name}
                        </h4>
                        <span style={{
                          color: eraColors[library.era],
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          {library.founded}
                        </span>
                      </div>
                      
                      <p style={{
                        color: '#9CA3AF',
                        margin: '0 0 1rem 0',
                        fontSize: '0.9rem'
                      }}>
                        {library.location}
                      </p>
                      
                      <p style={{
                        color: '#6B7280',
                        margin: 0,
                        fontSize: '0.85rem',
                        lineHeight: '1.4'
                      }}>
                        {library.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #6B7280'
                      }}>
                        <span style={{
                          color: '#C9A227',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          {library.scrolls.toLocaleString()} scrolls
                        </span>
                        <span style={{
                          color: '#9CA3AF',
                          fontSize: '0.8rem'
                        }}>
                          {library.era} Period
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{
          width: '400px',
          backgroundColor: '#1E1E24',
          borderLeft: '1px solid #6B7280',
          padding: '2rem',
          overflow: 'auto'
        }}>
          {selectedLibrary ? (
            /* Library Details */
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <h2 style={{
                    color: '#C9A227',
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.5rem'
                  }}>
                    {selectedLibrary.name}
                  </h2>
                  <p style={{
                    color: '#9CA3AF',
                    margin: 0,
                    fontSize: '1rem'
                  }}>
                    {selectedLibrary.location}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLibrary(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6B7280',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Key Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  backgroundColor: '#141419',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    color: eraColors[selectedLibrary.era],
                    fontSize: '1.5rem',
                    fontWeight: '700'
                  }}>
                    {selectedLibrary.scrolls.toLocaleString()}
                  </div>
                  <div style={{
                    color: '#9CA3AF',
                    fontSize: '0.8rem'
                  }}>
                    Scrolls/Codices
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#141419',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  