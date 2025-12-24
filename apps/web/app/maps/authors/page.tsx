'use client';

import Link from 'next/link';

export default function AuthorsMap() {
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
    { name: 'Sicily', coords: [240, 320], label: 'Sicilia' },
    { name: 'Italy', coords: [220, 260], label: 'Italia' },
    { name: 'Greece', coords: [330, 280], label: 'Hellas' },
    { name: 'Asia Minor', coords: [380, 270], label: 'Asia Minor' },
    { name: 'Egypt', coords: [290, 340], label: 'Aegyptus' },
    { name: 'North Africa', coords: [200, 380], label: 'Africa' }
  ];

  const eras = [
    { name: 'Archaic', period: '800-500 BCE', color: '#D97706', description: 'Foundation of Greek literary tradition' },
    { name: 'Classical', period: '500-323 BCE', color: '#F59E0B', description: 'Golden age of Athens' },
    { name: 'Hellenistic', period: '323-31 BCE', color: '#3B82F6', description: 'Post-Alexandrian scholarship' },
    { name: 'Imperial', period: '31 BCE-284 CE', color: '#DC2626', description: 'Roman literary dominance' },
    { name: 'Late Antique', period: '284-600 CE', color: '#7C3AED', description: 'Christian transformation' },
    { name: 'Byzantine', period: '600-1453 CE', color: '#059669', description: 'Medieval Greek renaissance' }
  ];

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Header */}
      <div style={{ 
        borderBottom: '1px solid #1E1E24', 
        padding: '2rem',
        background: 'linear-gradient(135deg, #141419 0%, #1E1E24 100%)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Link href="/" style={{ 
              color: '#C9A227', 
              textDecoration: 'none',
              fontSize: '1.1rem',
              transition: 'all 0.2s ease',
              opacity: 0.8
            }}>
              ← LOGOS
            </Link>
            <div style={{ color: '#6B7280' }}>|</div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              margin: 0,
              background: 'linear-gradient(135deg, #F5F4F2, #C9A227)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Geographical Distribution of Authors
            </h1>
          </div>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#9CA3AF', 
            margin: 0,
            fontStyle: 'italic'
          }}>
            Birthplaces and temporal distribution across the Mediterranean world
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Era Legend */}
        <div style={{ 
          backgroundColor: '#1E1E24', 
          borderRadius: '12px', 
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid #141419'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            color: '#F5F4F2'
          }}>
            Chronological Periods
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {eras.map((era, index) => (
              <div 
                key={era.name}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: '#141419',
                  borderRadius: '8px',
                  border: '1px solid #0D0D0F',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  backgroundColor: era.color,
                  borderRadius: '50%',
                  boxShadow: `0 0 10px ${era.color}40`
                }}></div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#F5F4F2' }}>{era.name}</div>
                  <div style={{ fontSize: '0.9rem', color: era.color, fontWeight: '500' }}>{era.period}</div>
                  <div style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
                    {era.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Map Container */}
        <div style={{ 
          backgroundColor: '#1E1E24', 
          borderRadius: '12px', 
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid #141419'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            color: '#F5F4F2'
          }}>
            Mediterranean Literary Geography
          </h2>

          {/* Interactive Map */}
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '600px',
            backgroundColor: '#0D0D0F',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #141419'
          }}>
            <svg 
              viewBox="0 0 600 450" 
              style={{ 
                width: '100%', 
                height: '100%',
                background: 'radial-gradient(circle at 300px 225px, #141419 0%, #0D0D0F 70%)'
              }}
            >
              {/* Mediterranean coastlines (simplified) */}
              <path
                d="M50 200 Q100 180 200 190 Q300 200 400 210 Q500 220 550 240 L550 300 Q500 320 400 330 Q300 340 200 330 Q100 320 50 300 Z"
                style={{ 
                  fill: 'none', 
                  stroke: '#6B7280', 
                  strokeWidth: '1',
                  strokeDasharray: '3,3',
                  opacity: 0.3
                }}
              />
              
              {/* Region labels */}
              {regions.map((region, index) => (
                <text
                  key={region.name}
                  x={region.coords[0]}
                  y={region.coords[1] - 20}
                  style={{ 
                    fill: '#6B7280', 
                    fontSize: '12px', 
                    textAnchor: 'middle',
                    fontStyle: 'italic',
                    opacity: 0.7
                  }}
                >
                  {region.label}
                </text>
              ))}

              {/* Author points */}
              {authors.map((author, index) => (
                <g key={author.name}>
                  {/* Glow effect */}
                  <circle
                    cx={author.coords[0]}
                    cy={author.coords[1]}
                    r="12"
                    style={{ 
                      fill: author.color,
                      opacity: 0.2
                    }}
                  />
                  {/* Main point */}
                  <circle
                    cx={author.coords[0]}
                    cy={author.coords[1]}
                    r="6"
                    style={{ 
                      fill: author.color,
                      stroke: '#F5F4F2',
                      strokeWidth: '1',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  />
                  {/* Language indicator */}
                  <text
                    x={author.coords[0]}
                    y={author.coords[1] + 2}
                    style={{ 
                      fill: '#F5F4F2', 
                      fontSize: '8px', 
                      textAnchor: 'middle',
                      fontWeight: 'bold',
                      pointerEvents: 'none'
                    }}
                  >
                    {author.language === 'Greek' ? 'Α' : 'L'}
                  </text>
                  {/* Author name */}
                  <text
                    x={author.coords[0]}
                    y={author.coords[1] + 20}
                    style={{ 
                      fill: '#F5F4F2', 
                      fontSize: '10px', 
                      textAnchor: 'middle',
                      fontWeight: '500'
                    }}
                  >
                    {author.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Authors by Era */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {eras.map((era) => {
            const eraAuthors = authors.filter(author => author.era === era.name);
            
            return (
              <div 
                key={era.name}
                style={{ 
                  backgroundColor: '#1E1E24', 
                  borderRadius: '12px', 
                  padding: '2rem',
                  border: '1px solid #141419'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: era.color,
                    borderRadius: '50%'
                  }}></div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    margin: 0,
                    color: '#F5F4F2'
                  }}>
                    {era.name} Period
                  </h3>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: era.color,
                    fontWeight: '500'
                  }}>
                    {era.period}
                  </span>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ 
                    color: '#9CA3AF', 
                    margin: 0,
                    fontSize: '0.9rem',
                    fontStyle: 'italic'
                  }}>
                    {era.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {eraAuthors.map((author) => (
                    <div 
                      key={author.name}
                      style={{ 
                        padding: '1rem',
                        backgroundColor: '#141419',
                        borderRadius: '8px',
                        border: '1px solid #0D0D0F',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ 
                            fontWeight: 'bold', 
                            color: '#F5F4F2'
                          }}>
                            {author.name}
                          </span>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            color: author.language === 'Greek' ? '#3B82F6' : '#DC2626',
                            fontWeight: '500',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: author.language === 'Greek' ? '#3B82F620' : '#DC262620',
                            borderRadius: '4px'
                          }}>
                            {author.language === 'Greek' ? 'Α Greek' : 'L Latin'}
                          </span>
                        </div>
                        <span style={{ 
                          fontSize: '0.85rem', 
                          color: '#9CA3AF'
                        }}>
                          {author.dates}
                        </span>
                      </div>
                      
                      <div style={{ marginBottom: '0.5rem' }}>
                        <span style={{ 
                          fontSize: '0.85rem', 
                          color: '#6B7280'
                        }}>
                          Born in {author.birth}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {author.works.map((work, workIndex) => (
                          <span 
                            key={workIndex}
                            style={{ 
                              fontSize: '0.75rem', 
                              color: '#C9A227',
                              backgroundColor: '#C9A22720',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontStyle: 'italic'
                            }}
                          >
                            {work}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistics Panel */}
        <div style={{ 
          backgroundColor: '#1E1E24', 
          borderRadius: '12px', 
          padding: '2rem',
          marginTop: '2rem',
          border: '1px solid #141419'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            color: '#F5F4F2'
          }}>
            Distribution Analysis
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#3B82F6',
                marginBottom: '0.5rem'
              }}>
                {authors.filter(a => a.language === 'Greek').length}
              </div>
              <div style={{ color: '#9CA3AF' }}>Greek Authors</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#DC2626',
                marginBottom: '0.5rem'
              }}>
                {authors.filter(a => a.language === 'Latin').length}
              </div>
              <div style={{ color: '#9CA3AF' }}>Latin Authors</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#C9A227',
                marginBottom: '0.5rem'
              }}>
                {eras.length}
              </div>
              <div style={{ color: '#9CA3AF' }}>Historical Periods</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#F59E0B',
                marginBottom: '0.5rem'
              }}>
                1653
              </div>
              <div style={{ color: '#9CA3AF' }}>Years Covered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}