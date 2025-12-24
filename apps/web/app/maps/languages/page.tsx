'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LanguageDistributionMap() {
  const [selectedYear, setSelectedYear] = useState(100);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const languages = {
    latin: { color: '#DC2626', name: 'Latin' },
    greek: { color: '#3B82F6', name: 'Greek' },
    aramaic: { color: '#D97706', name: 'Aramaic' },
    coptic: { color: '#7C3AED', name: 'Coptic' },
    celtic: { color: '#059669', name: 'Celtic' },
    berber: { color: '#F59E0B', name: 'Berber' }
  };

  const regions = [
    {
      id: 'italy',
      name: 'Italia',
      path: 'M 350 280 L 370 260 L 380 270 L 390 280 L 395 300 L 400 320 L 398 340 L 395 360 L 390 380 L 385 400 L 380 420 L 375 430 L 365 435 L 355 430 L 350 420 L 345 400 L 340 380 L 338 360 L 340 340 L 345 320 L 348 300 Z',
      getLanguages: (year) => {
        if (year < -200) return ['greek'];
        if (year < 200) return ['latin', 'greek'];
        return ['latin'];
      }
    },
    {
      id: 'greece',
      name: 'Graecia',
      path: 'M 400 320 L 420 310 L 440 315 L 450 325 L 455 335 L 450 345 L 445 355 L 440 365 L 430 370 L 420 368 L 410 365 L 405 355 L 402 345 L 405 335 L 410 325 Z',
      getLanguages: (year) => ['greek']
    },
    {
      id: 'anatolia',
      name: 'Anatolia',
      path: 'M 460 280 L 520 270 L 540 280 L 550 290 L 545 310 L 540 330 L 520 340 L 500 345 L 480 340 L 465 330 L 462 310 L 465 290 Z',
      getLanguages: (year) => {
        if (year < -100) return ['greek', 'aramaic'];
        return ['greek'];
      }
    },
    {
      id: 'egypt',
      name: 'Aegyptus',
      path: 'M 450 380 L 480 375 L 500 380 L 510 400 L 505 420 L 500 440 L 490 450 L 470 455 L 450 450 L 445 430 L 448 410 L 450 390 Z',
      getLanguages: (year) => {
        if (year < -300) return ['greek', 'coptic'];
        if (year < 300) return ['greek', 'coptic'];
        return ['coptic', 'greek'];
      }
    },
    {
      id: 'levant',
      name: 'Syria',
      path: 'M 520 350 L 550 345 L 560 360 L 555 380 L 550 390 L 535 395 L 525 390 L 522 375 L 525 365 Z',
      getLanguages: (year) => {
        if (year < -200) return ['aramaic', 'greek'];
        if (year < 300) return ['greek', 'aramaic'];
        return ['aramaic'];
      }
    },
    {
      id: 'africa',
      name: 'Africa',
      path: 'M 320 400 L 380 395 L 420 400 L 440 410 L 435 430 L 430 440 L 400 445 L 370 440 L 340 435 L 325 425 L 322 415 Z',
      getLanguages: (year) => {
        if (year < -100) return ['berber'];
        if (year < 400) return ['latin', 'berber'];
        return ['berber', 'latin'];
      }
    },
    {
      id: 'gaul',
      name: 'Gallia',
      path: 'M 280 200 L 340 195 L 360 200 L 365 220 L 360 240 L 350 250 L 330 255 L 310 250 L 290 245 L 275 230 L 280 210 Z',
      getLanguages: (year) => {
        if (year < -50) return ['celtic'];
        if (year < 200) return ['latin', 'celtic'];
        return ['latin'];
      }
    },
    {
      id: 'hispania',
      name: 'Hispania',
      path: 'M 200 250 L 250 245 L 270 250 L 275 270 L 270 290 L 250 300 L 220 305 L 200 300 L 195 280 L 198 265 Z',
      getLanguages: (year) => {
        if (year < -200) return ['celtic'];
        if (year < 100) return ['latin', 'celtic'];
        return ['latin'];
      }
    }
  ];

  const getRegionColor = (region, year) => {
    const regionLanguages = region.getLanguages(year);
    const primaryLanguage = regionLanguages[0];
    return languages[primaryLanguage]?.color || '#6B7280';
  };

  const getHistoricalContext = (year) => {
    if (year < -400) {
      return {
        title: 'Archaic Period',
        description: 'Greek city-states expanding across the Mediterranean. Local languages dominate most regions with Greek colonies scattered along coasts.'
      };
    }
    if (year < -200) {
      return {
        title: 'Classical & Early Hellenistic',
        description: 'Alexander\'s conquests spread Greek culture. Greek becomes the lingua franca of the Eastern Mediterranean while local languages persist.'
      };
    }
    if (year < 0) {
      return {
        title: 'Roman Republic Expansion',
        description: 'Roman conquest brings Latin to Western Mediterranean. Greek remains dominant in the East. Bilingual administration emerges.'
      };
    }
    if (year < 300) {
      return {
        title: 'Roman Imperial Period',
        description: 'Latin dominates the West, Greek the East. Urban centers are largely bilingual. Local languages survive in rural areas.'
      };
    }
    return {
      title: 'Late Imperial Period',
      description: 'Latin fragmenting in the West. Greek Christianity spreading. Local languages experiencing revival as central authority weakens.'
    };
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const context = getHistoricalContext(selectedYear);

  return (
    <div style={{ 
      backgroundColor: '#0D0D0F', 
      minHeight: '100vh', 
      color: '#F5F4F2',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{ 
        padding: '24px 32px', 
        borderBottom: '1px solid #1E1E24',
        backgroundColor: '#141419'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/maps" style={{ 
            color: '#9CA3AF', 
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.2s ease'
          }}>
            ← Back to Maps
          </Link>
          <div style={{ height: '20px', width: '1px', backgroundColor: '#1E1E24' }} />
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none' 
          }}>
            LOGOS
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div style={{ padding: '48px 32px 32px' }}>
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Language Distribution Map
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#9CA3AF', 
          marginBottom: '32px',
          maxWidth: '800px'
        }}>
          Explore how languages spread across the Mediterranean from 500 BCE to 500 CE. 
          Use the timeline to see the evolution of linguistic dominance through conquest, 
          trade, and cultural exchange.
        </p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '0 32px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          
          {/* Map Section */}
          <div style={{ 
            backgroundColor: '#1E1E24', 
            borderRadius: '12px', 
            padding: '24px',
            border: '1px solid #2D2D35'
          }}>
            {/* Year Display */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '24px'
            }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: '#C9A227',
                marginBottom: '8px'
              }}>
                {selectedYear < 0 ? `${Math.abs(selectedYear)} BCE` : `${selectedYear} CE`}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#9CA3AF'
              }}>
                {context.title}
              </div>
            </div>

            {/* Timeline Slider */}
            <div style={{ 
              marginBottom: '32px',
              padding: '0 16px'
            }}>
              <input
                type="range"
                min="-500"
                max="500"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#141419',
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '8px',
                fontSize: '12px',
                color: '#6B7280'
              }}>
                <span>500 BCE</span>
                <span>1 CE</span>
                <span>500 CE</span>
              </div>
            </div>

            {/* SVG Map */}
            <div style={{ 
              backgroundColor: '#0F1419', 
              borderRadius: '8px', 
              padding: '16px',
              border: '1px solid #2D2D35'
            }}>
              <svg 
                viewBox="0 0 800 600" 
                style={{ width: '100%', height: '500px' }}
                onMouseMove={handleMouseMove}
              >
                {/* Mediterranean Sea */}
                <rect width="800" height="600" fill="#0A1628" />
                
                {/* Coastlines */}
                <path 
                  d="M 150 200 Q 300 180 450 200 Q 600 220 750 240 L 750 350 Q 600 370 450 380 Q 300 390 150 370 Z" 
                  fill="#1A365D" 
                  opacity="0.3"
                />

                {/* Regions */}
                {regions.map((region) => {
                  const isHovered = hoveredRegion === region.id;
                  const regionColor = getRegionColor(region, selectedYear);
                  
                  return (
                    <g key={region.id}>
                      <path
                        d={region.path}
                        fill={regionColor}
                        opacity={isHovered ? 0.9 : 0.7}
                        stroke={isHovered ? '#E8D5A3' : regionColor}
                        strokeWidth={isHovered ? 3 : 1}
                        style={{
                          transition: 'all 0.3s ease',
                          filter: isHovered ? 'drop-shadow(0 0 10px rgba(232, 213, 163, 0.5))' : 'none',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={() => setHoveredRegion(region.id)}
                        onMouseLeave={() => setHoveredRegion(null)}
                      />
                    </g>
                  );
                })}

                {/* Region Labels */}
                {regions.map((region) => {
                  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                  pathElement.setAttribute('d', region.path);
                  const bbox = pathElement.getBBox?.() || { x: 400, y: 300, width: 0, height: 0 };
                  const centerX = bbox.x + bbox.width / 2;
                  const centerY = bbox.y + bbox.height / 2;
                  
                  return (
                    <text
                      key={`${region.id}-label`}
                      x={centerX}
                      y={centerY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#F5F4F2"
                      fontSize="12"
                      fontWeight="bold"
                      style={{ 
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        pointerEvents: 'none'
                      }}
                    >
                      {region.name}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div style={{ 
              marginTop: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              {Object.entries(languages).map(([key, lang]) => (
                <div key={key} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '14px'
                }}>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    backgroundColor: lang.color, 
                    borderRadius: '3px',
                    border: '1px solid #2D2D35'
                  }} />
                  {lang.name}
                </div>
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Historical Context */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '12px', 
              padding: '24px',
              border: '1px solid #2D2D35'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: '#C9A227'
              }}>
                Historical Context
              </h3>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: '#F5F4F2'
              }}>
                {context.title}
              </h4>
              <p style={{ 
                fontSize: '14px', 
                color: '#9CA3AF', 
                lineHeight: '1.6'
              }}>
                {context.description}
              </p>
            </div>

            {/* Language Details */}
            {hoveredRegion && (
              <div style={{ 
                backgroundColor: '#1E1E24', 
                borderRadius: '12px', 
                padding: '24px',
                border: '1px solid #2D2D35',
                boxShadow: '0 4px 20px rgba(201, 162, 39, 0.1)'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  marginBottom: '16px',
                  color: '#E8D5A3'
                }}>
                  {regions.find(r => r.id === hoveredRegion)?.name}
                </h3>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#9CA3AF',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    Languages spoken:
                  </span>
                  {regions.find(r => r.id === hoveredRegion)?.getLanguages(selectedYear).map((lang, index) => (
                    <div key={lang} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: languages[lang]?.color, 
                        borderRadius: '2px'
                      }} />
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#F5F4F2',
                        fontWeight: index === 0 ? '600' : '400'
                      }}>
                        {languages[lang]?.name} {index === 0 ? '(Primary)' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '12px', 
              padding: '24px',
              border: '1px solid #2D2D35'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: '#C9A227'
              }}>
                How to Use
              </h3>
              <ul style={{ 
                fontSize: '14px', 
                color: '#9CA3AF', 
                lineHeight: '1.6',
                paddingLeft: '16px'
              }}>
                <li style={{ marginBottom: '8px' }}>Use the timeline slider to travel through time</li>
                <li style={{ marginBottom: '8px' }}>Hover over regions to see language details</li>
                <li style={{ marginBottom: '8px' }}>Colors represent dominant languages</li>
                <li>Watch how conquest and culture changed linguistics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredRegion && (
        <div style={{
          position: 'fixed',
          left: mousePosition.x + 10,
          top: mousePosition.y - 10,
          backgroundColor: '#0D0D0F',
          border: '1px solid #C9A227',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '12px',
          color: '#F5F4F2',
          pointerEvents: 'none',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          {regions.find(r => r.id === hoveredRegion)?.name}
        </div>
      )}
    </div>
  );
}