'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LanguagesMap() {
  const [selectedEra, setSelectedEra] = useState(500);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const eras = [
    { year: 800, label: '800 BCE', color: '#D97706', name: 'Archaic' },
    { year: 500, label: '500 BCE', color: '#F59E0B', name: 'Classical' },
    { year: 323, label: '323 BCE', color: '#3B82F6', name: 'Hellenistic' },
    { year: 31, label: '31 BCE', color: '#DC2626', name: 'Imperial' },
    { year: 284, label: '284 CE', color: '#7C3AED', name: 'Late Antique' },
    { year: 600, label: '600 CE', color: '#059669', name: 'Byzantine' }
  ];

  const languageTypes = [
    { name: 'Greek', color: '#3B82F6', symbol: 'Γ' },
    { name: 'Latin', color: '#DC2626', symbol: 'L' },
    { name: 'Celtic', color: '#D97706', symbol: 'C' },
    { name: 'Germanic', color: '#10B981', symbol: 'G' },
    { name: 'Persian', color: '#7C3AED', symbol: 'P' },
    { name: 'Egyptian', color: '#F59E0B', symbol: 'E' },
    { name: 'Semitic', color: '#EF4444', symbol: 'S' }
  ];

  const allRegions: { [key: number]: Array<{
    id: string;
    name: string;
    language: string;
    color: string;
    type: string;
    cx: number;
    cy: number;
    size: number;
    influence: string;
    population: string;
  }> } = {
    800: [
      { id: 'attica', name: 'Attica', language: 'Attic Greek', color: '#3B82F6', type: 'Greek', cx: 360, cy: 200, size: 15, influence: 'Strong Greek presence in city-states', population: '~200,000' },
      { id: 'ionia', name: 'Ionia', language: 'Ionic Greek', color: '#3B82F6', type: 'Greek', cx: 380, cy: 180, size: 20, influence: 'Birthplace of philosophy and science', population: '~300,000' },
      { id: 'sparta', name: 'Sparta', language: 'Doric Greek', color: '#3B82F6', type: 'Greek', cx: 340, cy: 220, size: 18, influence: 'Military-focused Greek dialect', population: '~150,000' },
      { id: 'sicily', name: 'Sicily', language: 'Greek Colonies', color: '#3B82F6', type: 'Greek', cx: 260, cy: 240, size: 16, influence: 'Greek colonial expansion', population: '~100,000' },
      { id: 'rome', name: 'Rome', language: 'Latin', color: '#DC2626', type: 'Latin', cx: 240, cy: 200, size: 12, influence: 'Early Latin in central Italy', population: '~50,000' },
      { id: 'gaul', name: 'Gaul', language: 'Celtic', color: '#D97706', type: 'Celtic', cx: 180, cy: 140, size: 25, influence: 'Celtic languages dominant', population: '~2,000,000' },
      { id: 'egypt', name: 'Egypt', language: 'Egyptian', color: '#F59E0B', type: 'Egyptian', cx: 400, cy: 300, size: 22, influence: 'Ancient Egyptian hieroglyphs', population: '~3,000,000' }
    ],
    500: [
      { id: 'athens', name: 'Athens', language: 'Attic Greek', color: '#3B82F6', type: 'Greek', cx: 360, cy: 200, size: 20, influence: 'Golden Age of Athens', population: '~300,000' },
      { id: 'sparta', name: 'Sparta', language: 'Doric Greek', color: '#3B82F6', type: 'Greek', cx: 340, cy: 220, size: 18, influence: 'Peloponnesian power', population: '~200,000' },
      { id: 'ionia', name: 'Ionia', language: 'Ionic Greek', color: '#3B82F6', type: 'Greek', cx: 380, cy: 180, size: 19, influence: 'Persian Wars era', population: '~400,000' },
      { id: 'magna-graecia', name: 'Magna Graecia', language: 'Greek Dialects', color: '#3B82F6', type: 'Greek', cx: 280, cy: 260, size: 17, influence: 'Greek colonies in southern Italy', population: '~250,000' },
      { id: 'rome', name: 'Roman Republic', language: 'Latin', color: '#DC2626', type: 'Latin', cx: 240, cy: 200, size: 16, influence: 'Early Roman expansion', population: '~200,000' },
      { id: 'persia', name: 'Persian Empire', language: 'Old Persian', color: '#7C3AED', type: 'Persian', cx: 450, cy: 160, size: 30, influence: 'Achaemenid administrative language', population: '~10,000,000' },
      { id: 'egypt', name: 'Egypt', language: 'Egyptian', color: '#F59E0B', type: 'Egyptian', cx: 400, cy: 300, size: 20, influence: 'Under Persian rule', population: '~2,500,000' }
    ],
    323: [
      { id: 'macedonia', name: 'Macedonia', language: 'Greek Koine', color: '#3B82F6', type: 'Greek', cx: 350, cy: 180, size: 25, influence: 'Hellenistic lingua franca', population: '~500,000' },
      { id: 'ptolemaic', name: 'Ptolemaic Egypt', language: 'Greek Koine', color: '#3B82F6', type: 'Greek', cx: 400, cy: 300, size: 28, influence: 'Greek rule in Egypt', population: '~3,000,000' },
      { id: 'seleucid', name: 'Seleucid Empire', language: 'Greek Koine', color: '#3B82F6', type: 'Greek', cx: 420, cy: 180, size: 35, influence: 'Hellenistic Near East', population: '~8,000,000' },
      { id: 'rome', name: 'Roman Republic', language: 'Latin', color: '#DC2626', type: 'Latin', cx: 240, cy: 200, size: 20, influence: 'Rising power in Italy', population: '~500,000' },
      { id: 'carthage', name: 'Carthage', language: 'Punic', color: '#EF4444', type: 'Semitic', cx: 200, cy: 280, size: 18, influence: 'Phoenician maritime empire', population: '~400,000' },
      { id: 'gaul', name: 'Gaul', language: 'Celtic', color: '#D97706', type: 'Celtic', cx: 180, cy: 140, size: 22, influence: 'Independent Celtic tribes', population: '~3,000,000' }
    ],
    31: [
      { id: 'rome', name: 'Roman Empire', language: 'Latin', color: '#DC2626', type: 'Latin', cx: 240, cy: 200, size: 40, influence: 'Imperial Latin dominance', population: '~50,000,000' },
      { id: 'greece', name: 'Roman Greece', language: 'Greek/Latin', color: '#9333EA', type: 'Greek', cx: 360, cy: 200, size: 18, influence: 'Bilingual elite culture', population: '~2,000,000' },
      { id: 'egypt', name: 'Roman Egypt', language: 'Latin/Greek', color: '#DC2626', type: 'Latin', cx: 400, cy: 300, size: 25, influence: 'Roman administration', population: '~4,000,000' },
      { id: 'gaul', name: 'Roman Gaul', language: 'Latin/Celtic', color: '#DC2626', type: 'Latin', cx: 180, cy: 140, size: 30, influence: 'Romanization process', population: '~3,500,000' },
      { id: 'britain', name: 'Roman Britain', language: 'Latin/Celtic', color: '#DC2626', type: 'Latin', cx: 140, cy: 100, size: 18, influence: 'Roman frontier', population: '~1,000,000' }
    ],
    284: [
      { id: 'eastern-empire', name: 'Eastern Empire', language: 'Greek/Latin', color: '#7C3AED', type: 'Greek', cx: 380, cy: 200, size: 35, influence: 'Greek administrative language', population: '~20,000,000' },
      { id: 'western-empire', name: 'Western Empire', language: 'Latin', color: '#DC2626', type: 'Latin', cx: 220, cy: 180, size: 32, influence: 'Latin declining in provinces', population: '~25,000,000' },
      { id: 'gothic', name: 'Gothic Territories', language: 'Gothic', color: '#10B981', type: 'Germanic', cx: 320, cy: 120, size: 20, influence: 'Germanic migrations', population: '~500,000' },
      { id: 'persian-sassanid', name: 'Sassanid Persia', language: 'Middle Persian', color: '#7C3AED', type: 'Persian', cx: 480, cy: 180, size: 28, influence: 'Zoroastrian empire', population: '~12,000,000' }
    ],
    600: [
      { id: 'byzantine', name: 'Byzantine Empire', language: 'Greek', color: '#059669', type: 'Greek', cx: 370, cy: 190, size: 30, influence: 'Medieval Greek empire', population: '~15,000,000' },
      { id: 'frankish', name: 'Frankish Kingdom', language: 'Latin/Germanic', color: '#10B981', type: 'Germanic', cx: 200, cy: 150, size: 25, influence: 'Carolingian Renaissance', population: '~8,000,000' },
      { id: 'lombard', name: 'Lombard Italy', language: 'Latin/Lombard', color: '#DC2626', type: 'Latin', cx: 260, cy: 200, size: 18, influence: 'Germanic kingdom in Italy', population: '~3,000,000' },
      { id: 'visigoth', name: 'Visigothic Spain', language: 'Latin/Gothic', color: '#10B981', type: 'Germanic', cx: 160, cy: 240, size: 22, influence: 'Germanic rule in Iberia', population: '~4,000,000' }
    ]
  };

  const currentRegions = allRegions[selectedEra] || [];
  const currentEra = eras.find(era => era.year === selectedEra);

  const getContextualInfo = (year: number) => {
    switch (year) {
      case 800:
        return {
          title: 'Archaic Period (800-500 BCE)',
          description: 'The rise of Greek city-states and early Latin development. Greek colonization spreads across the Mediterranean while Rome begins its ascent.',
          keyEvents: ['Greek alphabet adoption', 'Homer\'s epics', 'Roman monarchy']
        };
      case 500:
        return {
          title: 'Classical Period (500-323 BCE)',
          description: 'The Golden Age of Athens and the height of Greek culture. Persian Wars and the Peloponnesian War shape the Greek world.',
          keyEvents: ['Persian Wars', 'Athenian democracy', 'Socrates, Plato, Aristotle']
        };
      case 323:
        return {
          title: 'Hellenistic Period (323-31 BCE)',
          description: 'Alexander\'s conquests spread Greek language and culture across the known world. Koine Greek becomes the lingua franca.',
          keyEvents: ['Alexander\'s empire', 'Hellenistic kingdoms', 'Septuagint translation']
        };
      case 31:
        return {
          title: 'Imperial Period (31 BCE-284 CE)',
          description: 'Roman Empire at its peak. Latin dominates the west while Greek remains important in the east. Pax Romana enables cultural exchange.',
          keyEvents: ['Augustus becomes emperor', 'Roman citizenship expansion', 'Early Christianity']
        };
      case 284:
        return {
          title: 'Late Antique Period (284-600 CE)',
          description: 'Empire divides into East and West. Germanic migrations begin. Christianity becomes dominant religion.',
          keyEvents: ['Constantine\'s conversion', 'Council of Nicaea', 'Fall of Western Rome']
        };
      case 600:
        return {
          title: 'Byzantine Period (600-1453 CE)',
          description: 'The Eastern Roman Empire continues as the Byzantine Empire. Greek becomes the sole official language in the east.',
          keyEvents: ['Justinian\'s reconquest', 'Islamic expansion', 'Iconoclastic controversy']
        };
      default:
        return { title: '', description: '', keyEvents: [] };
    }
  };

  const selectedRegionData = selectedRegion ? currentRegions.find(r => r.id === selectedRegion) : null;
  const contextualInfo = getContextualInfo(selectedEra);

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
        borderBottom: '1px solid #333',
        padding: '16px 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 24px'
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ΛΟΓΟΣ
          </Link>
          <div style={{ display: 'flex', gap: '32px' }}>
            <Link href="/maps" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Maps</Link>
            <Link href="/etymology" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>Etymology</Link>
            <Link href="/timeline" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>Timeline</Link>
            <Link href="/about" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>About</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            margin: '0 0 16px 0',
            background: 'linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Language Distribution Map
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#9CA3AF', 
            margin: 0,
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Explore the evolution of languages across the ancient Mediterranean world through different historical periods
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
          {/* Main Map Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Time Slider */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '16px', 
              padding: '24px',
              border: '1px solid #333'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  margin: '0 0 8px 0',
                  color: '#F5F4F2'
                }}>
                  Historical Period
                </h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px',
                  color: currentEra?.color || '#C9A227'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {currentEra?.name}
                  </span>
                  <span style={{ color: '#9CA3AF' }}>
                    ({currentEra?.label})
                  </span>
                </div>
              </div>
              
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <input
                  type="range"
                  min="0"
                  max={eras.length - 1}
                  value={eras.findIndex(era => era.year === selectedEra)}
                  onChange={(e) => setSelectedEra(eras[parseInt(e.target.value)].year)}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: '#333',
                    outline: 'none',
                    opacity: '0.8',
                    transition: 'opacity 0.2s',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                {eras.map((era) => (
                  <button
                    key={era.year}
                    onClick={() => setSelectedEra(era.year)}
                    style={{
                      backgroundColor: selectedEra === era.year ? era.color : '#333',
                      color: selectedEra === era.year ? '#0D0D0F' : '#9CA3AF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: selectedEra === era.year ? 'bold' : 'normal',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      minWidth: '80px'
                    }}
                  >
                    {era.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Map Container */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '16px', 
              padding: '24px',
              border: '1px solid #333'
            }}>
              <svg 
                width="100%" 
                height="500" 
                viewBox="0 0 600 400"
                style={{ backgroundColor: '#141419', borderRadius: '12px' }}
              >
                {/* Mediterranean coastlines */}
                <path
                  d="M50 300 Q150 280 250 290 Q350 300 450 310 Q550 320 580 330 L580 380 L50 380 Z"
                  fill="#2563EB"
                  opacity="0.3"
                />
                
                {/* Land masses */}
                <path
                  d="M100 200 Q200 180 300 190 Q400 185 500 195 Q550 200 580 210 L580 300 Q450 290 350 295 Q250 285 150 290 Q100 295 50 300 L50 250 Q75 225 100 200 Z"
                  fill="#374151"
                  opacity="0.6"
                />
                
                {/* Additional land features */}
                <ellipse cx="180" cy="120" rx="60" ry="40" fill="#374151" opacity="0.6" />
                <ellipse cx="360" cy="160" rx="80" ry="50" fill="#374151" opacity="0.6" />
                <ellipse cx="140" cy="80" rx="40" ry="25" fill="#374151" opacity="0.6" />
                
                {/* Language regions */}
                {currentRegions.map((region) => (
                  <g key={region.id}>
                    <circle
                      cx={region.cx}
                      cy={region.cy}
                      r={region.size + (hoveredRegion === region.id ? 5 : 0)}
                      fill={region.color}
                      opacity={selectedRegion === region.id ? 0.9 : hoveredRegion === region.id ? 0.8 : 0.7}
                      stroke={selectedRegion === region.id ? '#C9A227' : region.color}
                      strokeWidth={selectedRegion === region.id ? 3 : 1}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        filter: hoveredRegion === region.id ? 'brightness(1.2)' : 'none'
                      }}
                      onMouseEnter={() => setHoveredRegion(region.id)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                    />
                    <text
                      x={region.cx}
                      y={region.cy - region.size - 8}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#F5F4F2"
                      fontWeight={selectedRegion === region.id ? 'bold' : 'normal'}
                      style={{
                        pointerEvents: 'none',
                        opacity: hoveredRegion === region.id || selectedRegion === region.id ? 1 : 0.8
                      }}
                    >
                      {region.name}
                    </text>
                    <text
                      x={region.cx}
                      y={region.cy + 4}
                      textAnchor="middle"
                      fontSize="14"
                      fill="#0D0D0F"
                      fontWeight="bold"
                      style={{ pointerEvents: 'none' }}
                    >
                      {languageTypes.find(lt => lt.name === region.type)?.symbol}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Legend */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '16px', 
              padding: '24px',
              border: '1px solid #333'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                margin: '0 0 16px 0',
                color: '#F5F4F2'
              }}>
                Language Families
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {languageTypes.map((lang) => (
                  <div key={lang.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: lang.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0D0D0F',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {lang.symbol}
                    </div>
                    <span style={{ color: '#F5F4F2', fontSize: '14px' }}>{lang.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Historical Context */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '16px', 
              padding: '24px',
              border: '1px solid #333'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                margin: '0 0 16px 0',
                color: currentEra?.color || '#C9A227'
              }}>
                {contextualInfo.title}
              </h3>
              <p style={{ 
                color: '#9CA3AF', 
                margin: '0 0 16px 0', 
                lineHeight: '1.6',
                fontSize: '14px'
              }}>
                {contextualInfo.description}
              </p>
              <div>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  margin: '0 0 8px 0',
                  color: '#F5F4F2'
                }}>
                  Key Events:
                </h4>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '16px',
                  color: '#9CA3AF',
                  fontSize: '13px'
                }}>
                  {contextualInfo.keyEvents.map((event, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{event}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Selected Region Details */}
            {selectedRegionData && (
              <div style={{ 
                backgroundColor: '#1E1E24', 
                borderRadius: '16px', 
                padding: '24px',
                border: `2px solid ${selectedRegionData.color}`
              }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  margin: '0 0 16px 0',
                  color: selectedRegionData.color
                }}>
                  {selectedRegionData.name}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Language: </span>
                    <span style={{ color: '#F5F4F2', fontWeight: 'bold' }}>{selectedRegionData.language}</span>
                  </div>
                  <div>
                    <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Population: </span>
                    <span style={{ color: '#F5F4F2' }}>{selectedRegionData.population}</span>
                  </div>
                  <div>
                    <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Influence: </span>
                    <p style={{ 
                      color: '#F5F4F2', 
                      margin: '4px 0 0 0', 
                      lineHeight: '1.5',
                      fontSize: '14px'
                    }}>
                      {selectedRegionData.influence}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRegion(null)}
                  style={{
                    marginTop: '16px',
                    backgroundColor: 'transparent',
                    color: '#9CA3AF',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Close Details
                </button>
              </div>
            )}

            {/* Statistics */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '16px', 
              padding: '24px',
              border: '1px solid #333'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                margin: '0 0 16px 0',
                color: '#F5F4F2'
              }}>
                Period Statistics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Total Regions:</span>
                  <span style={{ color: '#F5F4F2', fontWeight: 'bold' }}>{currentRegions.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF', fontSize