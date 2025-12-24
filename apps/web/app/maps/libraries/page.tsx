'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function LibrariesMap() {
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [hoveredLibrary, setHoveredLibrary] = useState(null);
  const [viewMode, setViewMode] = useState('map');
  const [eraFilter, setEraFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showManuscripts, setShowManuscripts] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [particleAnimation, setParticleAnimation] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);
    const particleInterval = setInterval(() => {
      setParticleAnimation(prev => (prev + 0.5) % 100);
    }, 100);
    return () => {
      clearInterval(interval);
      clearInterval(particleInterval);
    };
  }, []);

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
      preservation: 'Papyrus scrolls in cedar boxes',
      importance: 10,
      language: 'Greek'
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
      preservation: 'Parchment codices (pergamene invention)',
      importance: 8,
      language: 'Greek'
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
      preservation: 'Stone niches with bronze nameplates',
      importance: 9,
      language: 'Both'
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
      preservation: 'Climate-controlled marble chambers',
      importance: 7,
      language: 'Greek'
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
      preservation: 'Two-story architectural niches',
      importance: 6,
      language: 'Greek'
    },
    {
      id: 6,
      name: 'Palatine Library',
      location: 'Rome',
      lat: 41.89,
      lng: 12.49,
      era: 'Imperial',
      founded: '28 BCE',
      description: 'Augustus\'s library on the Palatine Hill',
      scrolls: 150000,
      x: 375,
      y: 285,
      scholars: ['Ovid', 'Horace', 'Virgil', 'Propertius'],
      collections: ['Augustan poetry', 'State documents', 'Greek classics', 'Contemporary literature'],
      fate: 'Fire damage under Domitian',
      manuscripts: [
        { title: 'Aeneid', author: 'Virgil', variants: 51, apparatus: 'Epic poetry with commentaries' },
        { title: 'Metamorphoses', author: 'Ovid', variants: 33, apparatus: 'Mythological transformations' }
      ],
      catalogSystem: 'Augustan court classification',
      preservation: 'Temple-integrated storage',
      importance: 8,
      language: 'Both'
    },
    {
      id: 7,
      name: 'Imperial Library of Constantinople',
      location: 'Constantinople',
      lat: 41.01,
      lng: 28.98,
      era: 'Byzantine',
      founded: '357 CE',
      description: 'Byzantine Imperial Library, preserving classical texts',
      scrolls: 120000,
      x: 500,
      y: 250,
      scholars: ['Photios', 'Arethas', 'Michael Psellos', 'John Tzetzes'],
      collections: ['Greek patristics', 'Classical literature', 'Legal codes', 'Theological treatises'],
      fate: 'Partially survived Fourth Crusade 1204',
      manuscripts: [
        { title: 'Bibliotheca', author: 'Photios', variants: 17, apparatus: 'Literary reviews and excerpts' },
        { title: 'Chiliades', author: 'John Tzetzes', variants: 23, apparatus: 'Encyclopedic poetry' }
      ],
      catalogSystem: 'Byzantine patriarchal system',
      preservation: 'Vellum codices in metal containers',
      importance: 9,
      language: 'Greek'
    },
    {
      id: 8,
      name: 'Library of Caesarea Maritima',
      location: 'Caesarea, Palestine',
      lat: 32.5,
      lng: 34.9,
      era: 'Late Antique',
      founded: '290 CE',
      description: 'Christian library founded by Origen and Pamphilus',
      scrolls: 30000,
      x: 530,
      y: 320,
      scholars: ['Origen', 'Pamphilus', 'Eusebius of Caesarea', 'Jerome'],
      collections: ['Biblical manuscripts', 'Patristic texts', 'Hexapla', 'Church histories'],
      fate: 'Conquered by Arabs 640 CE',
      manuscripts: [
        { title: 'Hexapla', author: 'Origen', variants: 6, apparatus: 'Six-column biblical comparison' },
        { title: 'Ecclesiastical History', author: 'Eusebius', variants: 19, apparatus: 'Christian historiography' }
      ],
      catalogSystem: 'Patristic subject classification',
      preservation: 'Christian scriptural tradition',
      importance: 7,
      language: 'Greek'
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

  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push(
        <circle
          key={i}
          cx={50 + (i * 15) % 700}
          cy={50 + Math.sin(particleAnimation + i * 0.1) * 20 + (i * 7) % 400}
          r={1 + Math.sin(particleAnimation + i * 0.2)}
          fill="#C9A227"
          opacity={0.1 + Math.sin(particleAnimation + i * 0.3) * 0.1}
        />
      );
    }
    return particles;
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
        backgroundColor: '#1E1E24',
        borderBottom: '1px solid #C9A227',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#C9A227',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              display: 'inline-block',
              transform: `rotate(${animationPhase}deg)`,
              transition: 'transform 0.1s ease'
            }}>📚</span>
            Ancient Libraries
          </Link>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search libraries, scholars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: '#141419',
                border: '1px solid #6B7280',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                color: '#F5F4F2',
                width: '250px',
                fontSize: '0.9rem'
              }}
            />
            
            <select
              value={eraFilter}
              onChange={(e) => setEraFilter(e.target.value)}
              style={{
                backgroundColor: '#141419',
                border: '1px solid #6B7280',
                borderRadius: '8px',
                padding: '0.5rem',
                color: '#F5F4F2',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">All Eras</option>
              {Object.keys(eraColors).map(era => (
                <option key={era} value={era}>{era}</option>
              ))}
            </select>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setViewMode('map')}
                style={{
                  backgroundColor: viewMode === 'map' ? '#C9A227' : '#141419',
                  color: viewMode === 'map' ? '#0D0D0F' : '#F5F4F2',
                  border: '1px solid #C9A227',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              >
                Map View
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                style={{
                  backgroundColor: viewMode === 'timeline' ? '#C9A227' : '#141419',
                  color: viewMode === 'timeline' ? '#0D0D0F' : '#F5F4F2',
                  border: '1px solid #C9A227',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              >
                Timeline
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 80px)',
        overflow: 'hidden'
      }}>
        {/* Map/Timeline View */}
        <div style={{
          flex: selectedLibrary ? '1' : '1',
          position: 'relative',
          transition: 'all 0.3s ease'
        }}>
          {viewMode === 'map' ? (
            <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 500"
                style={{ background: 'linear-gradient(135deg, #0D0D0F 0%, #141419 50%, #1E1E24 100%)' }}
                ref={containerRef}
              >
                {/* Animated Background Particles */}
                {generateParticles()}
                
                {/* Mediterranean Coastlines */}
                <g opacity="0.3">
                  <path
                    d="M100,200 Q200,190 300,200 Q400,210 500,200 Q600,190 700,200 
                       L700,400 Q600,390 500,380 Q400,385 300,390 Q200,395 100,400 Z"
                    fill="none"
                    stroke="#6B7280"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                  <text x="50" y="190" fill="#9CA3AF" fontSize="12" opacity="0.7">
                    Mediterranean Sea
                  </text>
                </g>

                {/* Connection Lines */}
                {filteredLibraries.map(library => (
                  <g key={`connections-${library.id}`}>
                    {library.scholars.map((scholar, idx) => (
                      <line
                        key={`${library.id}-${idx}`}
                        x1={library.x}
                        y1={library.y}
                        x2={library.x + Math.cos(animationPhase * 0.01 + idx) * 30}
                        y2={library.y + Math.sin(animationPhase * 0.01 + idx) * 30}
                        stroke="#C9A227"
                        strokeWidth="0.5"
                        opacity={hoveredLibrary === library.id ? 0.4 : 0.1}
                        style={{ transition: 'opacity 0.3s ease' }}
                      />
                    ))}
                  </g>
                ))}

                {/* Library Points */}
                {filteredLibraries.map(library => (
                  <g key={library.id}>
                    {/* Pulsing Ring */}
                    <circle
                      cx={library.x}
                      cy={library.y}
                      r={8 + Math.sin(animationPhase * 0.05 + library.id) * 3}
                      fill="none"
                      stroke={eraColors[library.era]}
                      strokeWidth="2"
                      opacity={0.6}
                    />
                    
                    {/* Main Point */}
                    <circle
                      cx={library.x}
                      cy={library.y}
                      r={4 + (library.importance * 0.8)}
                      fill={eraColors[library.era]}
                      stroke="#F5F4F2"
                      strokeWidth="1"
                      style={{
                        cursor: 'pointer',
                        filter: hoveredLibrary === library.id ? 'drop-shadow(0 0 10px currentColor)' : 'none',
                        transition: 'all 0.3s ease',
                        transform: selectedLibrary?.id === library.id ? 'scale(1.5)' : 'scale(1)'
                      }}
                      onClick={() => setSelectedLibrary(library)}
                      onMouseEnter={() => setHoveredLibrary(library.id)}
                      onMouseLeave={() => setHoveredLibrary(null)}
                    />

                    {/* Language Indicator */}
                    <circle
                      cx={library.x + 8}
                      cy={library.y - 8}
                      r="6"
                      fill={library.language === 'Greek' ? '#3B82F6' : library.language === 'Both' ? '#C9A227' : '#DC2626'}
                      opacity="0.8"
                    />
                    <text
                      x={library.x + 8}
                      y={library.y - 5}
                      textAnchor="middle"
                      fill="#F5F4F2"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      {library.language === 'Greek' ? 'Α' : library.language === 'Both' ? '⚮' : 'L'}
                    </text>

                    {/* Label */}
                    <text
                      x={library.x}
                      y={library.y - 20}
                      textAnchor="middle"
                      fill="#F5F4F2"
                      fontSize="11"
                      fontWeight="500"
                      style={{
                        opacity: hoveredLibrary === library.id || selectedLibrary?.id === library.id ? 1 : 0.8,
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      {library.name.split(' ')[0]}
                    </text>
                    
                    {/* Scroll Count */}
                    <text
                      x={library.x}
                      y={library.y + 25}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="9"
                      style={{
                        opacity: hoveredLibrary === library.id ? 1 : 0.6,
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      {library.scrolls.toLocaleString()} scrolls
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          ) : (
            /* Timeline View */
            <div style={{
              padding: '2rem',
              height: '100%',
              overflow: 'auto',
              background: 'linear-gradient(180deg, #0D0D0F 0%, #141419 100%)'
            }}>
              <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                position: 'relative'
              }}>
                <h2 style={{
                  fontSize: '2rem',
                  color: '#C9A227',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  Timeline of Ancient Libraries
                </h2>

                {/* Era Legend */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  justifyContent: 'center',
                  marginBottom: '3rem'
                }}>
                  {Object.entries(eraColors).map(([era, color]) => (
                    <div key={era} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#1E1E24',
                      borderRadius: '20px',
                      border: `1px solid ${color}`
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: color
                      }} />
                      <span style={{ fontSize: '0.9rem', color: '#F5F4F2' }}>{era}</span>
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div style={{ position: 'relative' }}>
                  {/* Central Timeline Line */}
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    background: 'linear-gradient(180deg, #C9A227, #6B7280)',
                    transform: 'translateX(-50%)'
                  }} />

                  {filteredLibraries
                    .sort((a, b) => parseInt(a.founded.replace(/[^0-9-]/g, '')) - parseInt(b.founded.replace(/[^0-9-]/g, '')))
                    .map((library, index) => (
                      <div
                        key={library.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '3rem',
                          position: 'relative',
                          flexDirection: index % 2 === 0 ? 'row' : 'row-reverse'
                        }}
                      >
                        {/* Timeline Point */}
                        <div style={{
                          position: 'absolute',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 2
                        }}>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: eraColors[library.era],
                            border: '3px solid #1E1E24',
                            cursor: 'pointer'
                          }}
                          onClick={() => setSelectedLibrary(library)}
                          />
                        </div>

                        {/* Library Card */}
                        <div style={{
                          width: '45%',
                          backgroundColor: '#1E1E24',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          border: `1px solid ${eraColors[library.era]}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          transform: selectedLibrary?.id === library.id ? 'scale(1.02)' : 'scale(1)',
                          boxShadow: selectedLibrary?.id === library.id ? `0 8px 32px ${eraColors[library.era]}20` : 'none'
                        }}
                        onClick={() => setSelectedLibrary(library)}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '1rem'
                          }}>
                            <h3 style={{
                              fontSize: '1.2rem',
                              color: '#F5F4F2',
                              margin: 0
                            }}>
                              {library.name}
                            </h3>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: eraColors[library.era],
                              color: '#F5F4F2',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}>
                              {library.era}
                            </span>
                          </div>

                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.75rem'
                          }}>
                            <span style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                              📍 {library.location}
                            </span>
                            <span style={{ color: '#C9A227', fontSize: '0.9rem', fontWeight: 'bold' }}>
                              Founded {library.founded}
                            </span>
                          </div>

                          <p style={{
                            color: '#9CA3AF',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            margin: '0 0 1rem 0'
                          }}>
                            {library.description}
                          </p>

                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{
                              color: '#C9A227',
                              fontSize: '1rem',
                              fontWeight: 'bold'
                            }}>
                              📜 {library.scrolls.toLocaleString()} scrolls
                            </span>
                            <span style={{
                              color: '#F5F4F2',
                              fontSize: '0.8rem',
                              opacity: 0.8
                            }}>
                              👥 {library.scholars.length} notable scholars
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Library Details Panel */}
        {selectedLibrary && (
          <div style={{
            width: '500px',
            backgroundColor: '#1E1E24',
            borderLeft: '1px solid #C9A227',
            overflow: 'auto',
            position: 'relative',
            animation: isLoaded ? 'slideIn 0.3s ease-out' : 'none'
          }}>
            <div style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <div style={{
                backgroundColor: '#141419',
                padding: '1.5rem',
                borderBottom: `3px solid ${eraColors[selectedLibrary.era]}`
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    color: '#F5F4F2',
                    margin: 0,
                    flex: 1
                  }}>
                    {selectedLibrary.name}
                  </h2>
                  <button
                    onClick={() => setSelectedLibrary(null)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#9CA3AF',
                      fontSize: '1