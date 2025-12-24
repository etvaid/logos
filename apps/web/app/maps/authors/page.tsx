'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AuthorsMap() {
  const [hoveredAuthor, setHoveredAuthor] = useState(null);
  const [selectedEra, setSelectedEra] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [connectionLines, setConnectionLines] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
      setPulsePhase(prev => (prev + 2) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const authors = [
    // Archaic Era (800-500 BCE)
    { name: 'Homer', birth: 'Ionia', coords: [370, 280], era: 'Archaic', dates: 'c. 800-750 BCE', works: ['Iliad', 'Odyssey'], language: 'Greek', color: '#D97706' },
    { name: 'Hesiod', birth: 'Ascra', coords: [320, 270], era: 'Archaic', dates: 'c. 750-650 BCE', works: ['Theogony', 'Works and Days'], language: 'Greek', color: '#D97706' },
    { name: 'Sappho', birth: 'Mytilene', coords: [340, 260], era: 'Archaic', dates: 'c. 630-570 BCE', works: ['Lyric Poetry'], language: 'Greek', color: '#D97706' },
    { name: 'Solon', birth: 'Athens', coords: [330, 280], era: 'Archaic', dates: 'c. 630-560 BCE', works: ['Political Elegies'], language: 'Greek', color: '#D97706' },
    
    // Classical Era (500-323 BCE)
    { name: 'Aeschylus', birth: 'Eleusis', coords: [330, 285], era: 'Classical', dates: '525-456 BCE', works: ['Oresteia', 'Seven Against Thebes'], language: 'Greek', color: '#F59E0B' },
    { name: 'Sophocles', birth: 'Colonus', coords: [328, 282], era: 'Classical', dates: 'c. 496-406 BCE', works: ['Oedipus Rex', 'Antigone'], language: 'Greek', color: '#F59E0B' },
    { name: 'Euripides', birth: 'Salamis', coords: [325, 280], era: 'Classical', dates: 'c. 480-406 BCE', works: ['Medea', 'The Bacchae'], language: 'Greek', color: '#F59E0B' },
    { name: 'Herodotus', birth: 'Halicarnassus', coords: [380, 300], era: 'Classical', dates: 'c. 484-425 BCE', works: ['Histories'], language: 'Greek', color: '#F59E0B' },
    { name: 'Thucydides', birth: 'Athens', coords: [330, 280], era: 'Classical', dates: 'c. 460-400 BCE', works: ['History of the Peloponnesian War'], language: 'Greek', color: '#F59E0B' },
    { name: 'Aristophanes', birth: 'Athens', coords: [332, 282], era: 'Classical', dates: 'c. 446-386 BCE', works: ['The Clouds', 'The Birds'], language: 'Greek', color: '#F59E0B' },
    { name: 'Plato', birth: 'Athens', coords: [328, 278], era: 'Classical', dates: 'c. 428-348 BCE', works: ['Republic', 'Phaedrus'], language: 'Greek', color: '#F59E0B' },
    { name: 'Aristotle', birth: 'Stagira', coords: [340, 240], era: 'Classical', dates: '384-322 BCE', works: ['Poetics', 'Metaphysics'], language: 'Greek', color: '#F59E0B' },
    
    // Hellenistic Era (323-31 BCE)
    { name: 'Callimachus', birth: 'Cyrene', coords: [280, 360], era: 'Hellenistic', dates: 'c. 310-240 BCE', works: ['Aetia', 'Hymns'], language: 'Greek', color: '#3B82F6' },
    { name: 'Apollonius', birth: 'Alexandria', coords: [290, 340], era: 'Hellenistic', dates: 'c. 295-215 BCE', works: ['Argonautica'], language: 'Greek', color: '#3B82F6' },
    { name: 'Theocritus', birth: 'Syracuse', coords: [240, 320], era: 'Hellenistic', dates: 'c. 300-260 BCE', works: ['Idylls'], language: 'Greek', color: '#3B82F6' },
    
    // Imperial Era (31 BCE-284 CE)
    { name: 'Virgil', birth: 'Mantua', coords: [200, 220], era: 'Imperial', dates: '70-19 BCE', works: ['Aeneid', 'Georgics'], language: 'Latin', color: '#DC2626' },
    { name: 'Ovid', birth: 'Sulmo', coords: [240, 250], era: 'Imperial', dates: '43 BCE-17 CE', works: ['Metamorphoses', 'Ars Amatoria'], language: 'Latin', color: '#DC2626' },
    { name: 'Horace', birth: 'Venusia', coords: [260, 280], era: 'Imperial', dates: '65-8 BCE', works: ['Odes', 'Satires'], language: 'Latin', color: '#DC2626' },
    { name: 'Tacitus', birth: 'Gaul', coords: [150, 180], era: 'Imperial', dates: 'c. 56-120 CE', works: ['Annals', 'Germania'], language: 'Latin', color: '#DC2626' },
    { name: 'Plutarch', birth: 'Chaeronea', coords: [320, 270], era: 'Imperial', dates: 'c. 46-120 CE', works: ['Parallel Lives', 'Moralia'], language: 'Greek', color: '#DC2626' },
    { name: 'Juvenal', birth: 'Aquinum', coords: [230, 260], era: 'Imperial', dates: 'c. 55-127 CE', works: ['Satires'], language: 'Latin', color: '#DC2626' },
    
    // Late Antique Era (284-600 CE)
    { name: 'Augustine', birth: 'Thagaste', coords: [180, 380], era: 'Late Antique', dates: '354-430 CE', works: ['Confessions', 'City of God'], language: 'Latin', color: '#7C3AED' },
    { name: 'Jerome', birth: 'Stridon', coords: [250, 220], era: 'Late Antique', dates: 'c. 347-420 CE', works: ['Vulgate Bible'], language: 'Latin', color: '#7C3AED' },
    { name: 'John Chrysostom', birth: 'Antioch', coords: [420, 320], era: 'Late Antique', dates: 'c. 349-407 CE', works: ['Homilies'], language: 'Greek', color: '#7C3AED' },
    
    // Byzantine Era (600-1453 CE)
    { name: 'Photius', birth: 'Constantinople', coords: [390, 280], era: 'Byzantine', dates: 'c. 810-893 CE', works: ['Bibliotheca'], language: 'Greek', color: '#059669' },
    { name: 'Michael Psellus', birth: 'Constantinople', coords: [392, 282], era: 'Byzantine', dates: '1018-1078 CE', works: ['Chronographia'], language: 'Greek', color: '#059669' }
  ];

  const regions = [
    { name: 'Sicilia', coords: [240, 320], importance: 'high' },
    { name: 'Italia', coords: [220, 260], importance: 'high' },
    { name: 'Hellas', coords: [330, 280], importance: 'high' },
    { name: 'Asia Minor', coords: [380, 270], importance: 'medium' },
    { name: 'Aegyptus', coords: [290, 340], importance: 'medium' },
    { name: 'Africa', coords: [180, 380], importance: 'low' }
  ];

  const eras = [
    { name: 'Archaic', period: '800-500 BCE', color: '#D97706', description: 'Foundation of Greek literary tradition', count: 4 },
    { name: 'Classical', period: '500-323 BCE', color: '#F59E0B', description: 'Golden age of Athens', count: 8 },
    { name: 'Hellenistic', period: '323-31 BCE', color: '#3B82F6', description: 'Post-Alexandrian scholarship', count: 3 },
    { name: 'Imperial', period: '31 BCE-284 CE', color: '#DC2626', description: 'Roman literary dominance', count: 6 },
    { name: 'Late Antique', period: '284-600 CE', color: '#7C3AED', description: 'Christian transformation', count: 3 },
    { name: 'Byzantine', period: '600-1453 CE', color: '#059669', description: 'Eastern continuity', count: 2 }
  ];

  const filteredAuthors = selectedEra 
    ? authors.filter(author => author.era === selectedEra)
    : authors;

  const createMapPaths = () => {
    const paths = [
      // Mediterranean coastlines (simplified)
      "M 100 200 Q 150 180 200 200 Q 250 190 300 200 Q 350 210 400 220 Q 450 230 500 240",
      "M 150 350 Q 200 330 250 340 Q 300 350 350 360 Q 400 370 450 380",
      "M 200 250 Q 220 240 240 250 Q 260 260 280 250",
      "M 320 260 Q 340 250 360 260 Q 380 270 400 280"
    ];
    
    return paths.map((d, i) => (
      <path
        key={i}
        d={d}
        style={{
          stroke: '#6B7280',
          strokeWidth: 1.5,
          fill: 'none',
          opacity: 0.4,
          strokeDasharray: '5,3'
        }}
      />
    ));
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2',
      padding: '2rem',
      background: `
        radial-gradient(circle at 20% 20%, rgba(201, 162, 39, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        linear-gradient(135deg, #0D0D0F 0%, #141419 100%)
      `
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              backgroundColor: '#C9A227',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(1); }
          100% { opacity: 0.8; transform: scale(1.5); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px currentColor; }
          50% { box-shadow: 0 0 20px currentColor; }
        }
      `}</style>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          position: 'relative'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #C9A227 0%, #F5F4F2 50%, #C9A227 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            textShadow: '0 0 30px rgba(201, 162, 39, 0.3)',
            letterSpacing: '0.05em'
          }}>
            🗺️ LITERARY GEOGRAPHY
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#9CA3AF',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Explore the geographical distribution of ancient authors across the Mediterranean world,
            from the Archaic period through the Byzantine era
          </p>
        </div>

        {/* Era Timeline */}
        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid rgba(201, 162, 39, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#F5F4F2',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            📚 Historical Periods
          </h2>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => setSelectedEra(null)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: selectedEra === null ? '#C9A227' : 'rgba(156, 163, 175, 0.1)',
                color: selectedEra === null ? '#0D0D0F' : '#F5F4F2',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                transform: selectedEra === null ? 'scale(1.05)' : 'scale(1)',
                boxShadow: selectedEra === null ? '0 4px 16px rgba(201, 162, 39, 0.4)' : 'none'
              }}
            >
              All Periods ({authors.length})
            </button>
            {eras.map((era, index) => (
              <button
                key={era.name}
                onClick={() => setSelectedEra(era.name)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: selectedEra === era.name ? era.color : 'rgba(156, 163, 175, 0.1)',
                  color: selectedEra === era.name ? '#0D0D0F' : '#F5F4F2',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem',
                  transform: selectedEra === era.name ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedEra === era.name ? `0 4px 16px ${era.color}40` : 'none',
                  animation: selectedEra === era.name ? 'glow 2s ease-in-out infinite' : 'none'
                }}
              >
                {era.name} ({era.count})
                <div style={{
                  fontSize: '0.7rem',
                  opacity: 0.8,
                  marginTop: '0.2rem'
                }}>
                  {era.period}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Map */}
        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '2px solid rgba(201, 162, 39, 0.3)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Map Background Glow */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 30% 40%, rgba(201, 162, 39, 0.1) 0%, transparent 40%),
              radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.08) 0%, transparent 40%)
            `,
            animation: 'pulse 4s ease-in-out infinite'
          }} />

          <svg
            width="100%"
            height="500"
            viewBox="0 0 600 450"
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* Map Paths */}
            {createMapPaths()}
            
            {/* Region Labels */}
            {regions.map((region, index) => (
              <g key={region.name}>
                <circle
                  cx={region.coords[0]}
                  cy={region.coords[1]}
                  r={region.importance === 'high' ? 25 : region.importance === 'medium' ? 20 : 15}
                  fill="rgba(107, 114, 128, 0.1)"
                  stroke="rgba(107, 114, 128, 0.3)"
                  strokeWidth="1"
                  style={{
                    animation: 'pulse 3s ease-in-out infinite',
                    animationDelay: `${index * 0.2}s`
                  }}
                />
                <text
                  x={region.coords[0]}
                  y={region.coords[1] + 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#9CA3AF"
                  fontWeight="bold"
                  style={{ pointerEvents: 'none' }}
                >
                  {region.name}
                </text>
              </g>
            ))}

            {/* Connection Lines for Same Era */}
            {selectedEra && filteredAuthors.map((author, i) => 
              filteredAuthors.slice(i + 1).map((otherAuthor, j) => (
                <line
                  key={`${i}-${j}`}
                  x1={author.coords[0]}
                  y1={author.coords[1]}
                  x2={otherAuthor.coords[0]}
                  y2={otherAuthor.coords[1]}
                  stroke={author.color}
                  strokeWidth="1"
                  opacity="0.2"
                  strokeDasharray="3,3"
                  style={{
                    animation: 'pulse 2s ease-in-out infinite',
                    animationDelay: `${(i + j) * 0.1}s`
                  }}
                />
              ))
            )}

            {/* Author Points */}
            {filteredAuthors.map((author, index) => (
              <g key={author.name}>
                {/* Pulsing Ring */}
                <circle
                  cx={author.coords[0]}
                  cy={author.coords[1]}
                  r={hoveredAuthor === author.name ? 20 : 15}
                  fill="none"
                  stroke={author.color}
                  strokeWidth="2"
                  opacity={pulsePhase > 50 ? 0.8 : 0.3}
                  style={{
                    transition: 'all 0.3s ease',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
                
                {/* Author Dot */}
                <circle
                  cx={author.coords[0]}
                  cy={author.coords[1]}
                  r={hoveredAuthor === author.name ? 10 : 8}
                  fill={author.color}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    filter: hoveredAuthor === author.name ? 'brightness(1.3)' : 'brightness(1)',
                    animation: hoveredAuthor === author.name ? 'float 2s ease-in-out infinite' : 'none'
                  }}
                  onMouseEnter={() => setHoveredAuthor(author.name)}
                  onMouseLeave={() => setHoveredAuthor(null)}
                />

                {/* Language Indicator */}
                <circle
                  cx={author.coords[0] + 12}
                  cy={author.coords[1] - 12}
                  r="6"
                  fill={author.language === 'Greek' ? '#3B82F6' : '#DC2626'}
                  stroke="#F5F4F2"
                  strokeWidth="1"
                />
                <text
                  x={author.coords[0] + 12}
                  y={author.coords[1] - 8}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#F5F4F2"
                  fontWeight="bold"
                  style={{ pointerEvents: 'none' }}
                >
                  {author.language === 'Greek' ? 'Α' : 'L'}
                </text>

                {/* Author Name */}
                <text
                  x={author.coords[0]}
                  y={author.coords[1] + 25}
                  textAnchor="middle"
                  fontSize={hoveredAuthor === author.name ? "12" : "10"}
                  fill="#F5F4F2"
                  fontWeight="bold"
                  style={{
                    pointerEvents: 'none',
                    transition: 'all 0.3s ease',
                    textShadow: hoveredAuthor === author.name ? '0 0 10px currentColor' : 'none'
                  }}
                >
                  {author.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(30, 30, 36, 0.95)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid rgba(201, 162, 39, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              fontSize: '0.9rem',
              fontWeight: 'bold',
              color: '#F5F4F2',
              marginBottom: '0.5rem'
            }}>
              Legend
            </h3>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#3B82F6',
                  borderRadius: '50%'
                }} />
                <span style={{ color: '#9CA3AF' }}>Greek (Α)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#DC2626',
                  borderRadius: '50%'
                }} />
                <span style={{ color: '#9CA3AF' }}>Latin (L)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Author Details Panel */}
        {hoveredAuthor && (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            border: '2px solid #C9A227',
            boxShadow: '0 12px 40px rgba(201, 162, 39, 0.2)',
            animation: 'float 3s ease-in-out infinite',
            position: 'relative'
          }}>
            {(() => {
              const author = authors.find(a => a.name === hoveredAuthor);
              return (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: author.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#0D0D0F',
                      animation: 'glow 2s ease-in-out infinite'
                    }}>
                      {author.name[0]}
                    </div>
                    <div>
                      <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#F5F4F2',
                        marginBottom: '0.5rem'
                      }}>
                        {author.name}
                      </h2>
                      <div style={{
                        display: 'flex',
                        gap: '1rem',
                        fontSize: '0.9rem',
                        color: '#9CA3AF'
                      }}>
                        <span>📍 {author.birth}</span>
                        <span>📅 {author.dates}</span>
                        <span style={{
                          color: author.language === 'Greek' ? '#3B82F6' : '#DC2626',
                          fontWeight: 'bold'
                        }}>
                          🌐 {author.language}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: 'rgba(13, 13, 15, 0.6)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid rgba(107, 114, 128, 0.2)'
                  }}>
                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#C9A227',
                      marginBottom: '1rem'
                    }}>
                      📚 Major Works
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      {author.works.map((work, index) => (
                        <span
                          key={work}
                          style={{
                            backgroundColor: `${author.color}20`,
                            color: author.color,
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            border: `1px solid ${author.color}40`,
                            animation: `glow 3s ease-in-out infinite`,
                            animationDelay: `${index * 0.2}s`
                          }}
                        >
                          {work}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(201, 162, 