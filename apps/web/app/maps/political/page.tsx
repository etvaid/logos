'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PoliticalMap() {
  const [currentYear, setCurrentYear] = useState(400);
  const [selectedEmpire, setSelectedEmpire] = useState<string | null>(null);
  const [hoveredTerritory, setHoveredTerritory] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const empires = {
    'Roman Empire': {
      color: '#DC2626',
      periods: {
        100: { size: 85, power: 95, territories: ['Italia', 'Gallia', 'Hispania', 'Britannia', 'Germania_Inferior', 'Dacia', 'Thracia', 'Aegyptus', 'Syria', 'Judaea'] },
        200: { size: 90, power: 90, territories: ['Italia', 'Gallia', 'Hispania', 'Britannia', 'Germania', 'Dacia', 'Thracia', 'Aegyptus', 'Syria', 'Arabia', 'Mesopotamia'] },
        300: { size: 88, power: 85, territories: ['Italia', 'Gallia', 'Hispania', 'Britannia', 'Germania_Inferior', 'Dacia', 'Thracia', 'Aegyptus', 'Syria', 'Arabia'] },
        400: { size: 75, power: 70, territories: ['Italia', 'Gallia', 'Hispania', 'Thracia', 'Aegyptus', 'Syria'] },
        500: { size: 60, power: 50, territories: ['Italia', 'Thracia', 'Aegyptus'] },
      }
    },
    'Persian Empire': {
      color: '#F59E0B',
      periods: {
        100: { size: 70, power: 80, territories: ['Persia', 'Mesopotamia', 'Armenia', 'Atropatene'] },
        200: { size: 75, power: 85, territories: ['Persia', 'Mesopotamia', 'Armenia', 'Atropatene', 'Bactria'] },
        300: { size: 80, power: 90, territories: ['Persia', 'Mesopotamia', 'Armenia', 'Atropatene', 'Bactria', 'Sogdiana'] },
        400: { size: 85, power: 95, territories: ['Persia', 'Mesopotamia', 'Armenia', 'Atropatene', 'Bactria', 'Sogdiana', 'Chorasmia'] },
        500: { size: 90, power: 100, territories: ['Persia', 'Mesopotamia', 'Armenia', 'Atropatene', 'Bactria', 'Sogdiana', 'Chorasmia', 'Herat'] },
      }
    },
    'Gothic Kingdoms': {
      color: '#7C3AED',
      periods: {
        100: { size: 20, power: 30, territories: ['Gothia_Minor'] },
        200: { size: 35, power: 45, territories: ['Gothia', 'Dacia'] },
        300: { size: 45, power: 55, territories: ['Gothia', 'Dacia', 'Pannonia'] },
        400: { size: 60, power: 70, territories: ['Gothia', 'Dacia', 'Pannonia', 'Hispania_Gothica'] },
        500: { size: 70, power: 80, territories: ['Gothia', 'Pannonia', 'Hispania_Gothica', 'Italia_Gothica'] },
      }
    },
    'Frankish Kingdom': {
      color: '#059669',
      periods: {
        100: { size: 15, power: 25, territories: ['Francia_Minor'] },
        200: { size: 25, power: 35, territories: ['Francia', 'Ripuaria'] },
        300: { size: 40, power: 50, territories: ['Francia', 'Ripuaria', 'Austrasia'] },
        400: { size: 55, power: 65, territories: ['Francia', 'Austrasia', 'Neustria'] },
        500: { size: 75, power: 85, territories: ['Francia', 'Austrasia', 'Neustria', 'Burgundia', 'Aquitania'] },
      }
    }
  };

  const territoryPositions = {
    'Italia': { x: 380, y: 280, width: 60, height: 120, name: 'Italia' },
    'Gallia': { x: 300, y: 200, width: 80, height: 100, name: 'Gallia' },
    'Hispania': { x: 200, y: 280, width: 90, height: 80, name: 'Hispania' },
    'Britannia': { x: 280, y: 120, width: 60, height: 70, name: 'Britannia' },
    'Germania': { x: 380, y: 150, width: 70, height: 80, name: 'Germania' },
    'Germania_Inferior': { x: 350, y: 150, width: 50, height: 60, name: 'Germania Inferior' },
    'Dacia': { x: 480, y: 220, width: 60, height: 70, name: 'Dacia' },
    'Thracia': { x: 520, y: 280, width: 50, height: 60, name: 'Thracia' },
    'Aegyptus': { x: 580, y: 380, width: 40, height: 100, name: 'Aegyptus' },
    'Syria': { x: 640, y: 320, width: 60, height: 80, name: 'Syria' },
    'Judaea': { x: 620, y: 340, width: 30, height: 40, name: 'Judaea' },
    'Arabia': { x: 680, y: 380, width: 50, height: 70, name: 'Arabia' },
    'Mesopotamia': { x: 720, y: 280, width: 70, height: 90, name: 'Mesopotamia' },
    'Persia': { x: 800, y: 300, width: 90, height: 100, name: 'Persia' },
    'Armenia': { x: 700, y: 240, width: 60, height: 50, name: 'Armenia' },
    'Atropatene': { x: 760, y: 220, width: 50, height: 60, name: 'Atropatene' },
    'Bactria': { x: 920, y: 280, width: 80, height: 70, name: 'Bactria' },
    'Sogdiana': { x: 1000, y: 240, width: 70, height: 60, name: 'Sogdiana' },
    'Chorasmia': { x: 900, y: 200, width: 60, height: 50, name: 'Chorasmia' },
    'Herat': { x: 850, y: 320, width: 50, height: 40, name: 'Herat' },
    'Gothia': { x: 450, y: 180, width: 70, height: 80, name: 'Gothia' },
    'Gothia_Minor': { x: 480, y: 200, width: 40, height: 50, name: 'Gothia Minor' },
    'Pannonia': { x: 420, y: 250, width: 60, height: 70, name: 'Pannonia' },
    'Hispania_Gothica': { x: 180, y: 300, width: 70, height: 60, name: 'Hispania Gothica' },
    'Italia_Gothica': { x: 360, y: 300, width: 40, height: 80, name: 'Italia Gothica' },
    'Francia': { x: 320, y: 180, width: 60, height: 70, name: 'Francia' },
    'Francia_Minor': { x: 340, y: 200, width: 30, height: 40, name: 'Francia Minor' },
    'Ripuaria': { x: 360, y: 160, width: 40, height: 50, name: 'Ripuaria' },
    'Austrasia': { x: 380, y: 180, width: 50, height: 60, name: 'Austrasia' },
    'Neustria': { x: 280, y: 180, width: 50, height: 60, name: 'Neustria' },
    'Burgundia': { x: 340, y: 240, width: 50, height: 60, name: 'Burgundia' },
    'Aquitania': { x: 260, y: 260, width: 60, height: 50, name: 'Aquitania' }
  };

  const getEmpireData = (empireName: string) => {
    const empire = empires[empireName];
    if (!empire) return { size: 0, power: 0, territories: [] };
    
    const years = Object.keys(empire.periods).map(Number).sort((a, b) => a - b);
    const closestYear = years.reduce((prev, curr) => 
      Math.abs(curr - currentYear) < Math.abs(prev - currentYear) ? curr : prev
    );
    
    return empire.periods[closestYear];
  };

  const getTerritoryOwner = (territory: string) => {
    for (const [empireName, empireData] of Object.entries(empires)) {
      const data = getEmpireData(empireName);
      if (data.territories.includes(territory)) {
        return { name: empireName, color: empireData.color };
      }
    }
    return { name: 'Independent', color: '#6B7280' };
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear(prev => {
          if (prev >= 500) {
            setIsPlaying(false);
            return 500;
          }
          return prev + 10;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        padding: '16px 32px',
        borderBottom: '1px solid #141419'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          maxWidth: '1200px', 
          margin: '0 auto' 
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}>
            ΛΟΓΟΣ
          </Link>
          
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <Link href="/maps" style={{ 
              color: '#F5F4F2', 
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}>
              Maps
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div style={{ padding: '32px', borderBottom: '1px solid #1E1E24' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          margin: '0 0 16px 0',
          background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Political Map
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#9CA3AF', 
          margin: 0,
          maxWidth: '800px'
        }}>
          Explore the rise and fall of ancient empires through interactive territorial control visualization
        </p>
      </div>

      <div style={{ padding: '32px', display: 'flex', gap: '32px' }}>
        {/* Map Container */}
        <div style={{ flex: '1', minWidth: '800px' }}>
          {/* Time Controls */}
          <div style={{ 
            backgroundColor: '#1E1E24', 
            padding: '24px', 
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                margin: 0,
                color: '#F5F4F2'
              }}>
                Year: {currentYear} CE
              </h3>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    backgroundColor: isPlaying ? '#DC2626' : '#C9A227',
                    color: '#F5F4F2',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                
                <button
                  onClick={() => { setCurrentYear(100); setIsPlaying(false); }}
                  style={{
                    backgroundColor: '#6B7280',
                    color: '#F5F4F2',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
            
            <input
              type="range"
              min="100"
              max="500"
              step="50"
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#141419',
                borderRadius: '4px',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '8px',
              fontSize: '14px',
              color: '#9CA3AF'
            }}>
              <span>100 CE</span>
              <span>200 CE</span>
              <span>300 CE</span>
              <span>400 CE</span>
              <span>500 CE</span>
            </div>
          </div>

          {/* Map Visualization */}
          <div style={{ 
            backgroundColor: '#1E1E24', 
            borderRadius: '12px', 
            padding: '24px',
            position: 'relative',
            overflow: 'auto'
          }}>
            <svg 
              width="1100" 
              height="500" 
              style={{ 
                backgroundColor: '#141419',
                borderRadius: '8px'
              }}
            >
              {/* Background territories */}
              {Object.entries(territoryPositions).map(([territoryId, territory]) => {
                const owner = getTerritoryOwner(territoryId);
                const isHovered = hoveredTerritory === territoryId;
                const isSelected = selectedEmpire && selectedEmpire === owner.name;
                
                return (
                  <rect
                    key={territoryId}
                    x={territory.x}
                    y={territory.y}
                    width={territory.width}
                    height={territory.height}
                    fill={owner.color}
                    fillOpacity={isSelected ? 1 : (selectedEmpire ? 0.3 : 0.8)}
                    stroke={isHovered ? '#C9A227' : owner.color}
                    strokeWidth={isHovered ? 3 : 1}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={() => setHoveredTerritory(territoryId)}
                    onMouseLeave={() => setHoveredTerritory(null)}
                    onClick={() => setSelectedEmpire(selectedEmpire === owner.name ? null : owner.name)}
                  />
                );
              })}
              
              {/* Territory labels */}
              {Object.entries(territoryPositions).map(([territoryId, territory]) => (
                <text
                  key={`label-${territoryId}`}
                  x={territory.x + territory.width / 2}
                  y={territory.y + territory.height / 2}
                  fill="#F5F4F2"
                  fontSize="10"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    pointerEvents: 'none',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                  }}
                >
                  {territory.name.split(' ')[0]}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Empire Controls & Info */}
        <div style={{ width: '300px' }}>
          {/* Empire Selection */}
          <div style={{ 
            backgroundColor: '#1E1E24', 
            padding: '24px', 
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              margin: '0 0 16px 0',
              color: '#F5F4F2'
            }}>
              Empires
            </h3>
            
            {Object.entries(empires).map(([empireName, empireData]) => {
              const data = getEmpireData(empireName);
              const isSelected = selectedEmpire === empireName;
              
              return (
                <button
                  key={empireName}
                  onClick={() => setSelectedEmpire(isSelected ? null : empireName)}
                  style={{
                    width: '100%',
                    backgroundColor: isSelected ? empireData.color : '#141419',
                    color: '#F5F4F2',
                    border: `2px solid ${empireData.color}`,
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                  }}>
                    <span style={{ fontWeight: 'bold' }}>{empireName}</span>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: empireData.color,
                      borderRadius: '50%'
                    }} />
                  </div>
                  
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#9CA3AF',
                    marginTop: '4px'
                  }}>
                    Territories: {data.territories.length}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Power Indicators */}
          <div style={{ 
            backgroundColor: '#1E1E24', 
            padding: '24px', 
            borderRadius: '12px'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              margin: '0 0 16px 0',
              color: '#F5F4F2'
            }}>
              Power Index ({currentYear} CE)
            </h3>
            
            {Object.entries(empires).map(([empireName, empireData]) => {
              const data = getEmpireData(empireName);
              
              return (
                <div 
                  key={empireName}
                  style={{ marginBottom: '16px' }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <span style={{ 
                      fontSize: '14px',
                      color: selectedEmpire === empireName ? empireData.color : '#F5F4F2'
                    }}>
                      {empireName}
                    </span>
                    <span style={{ 
                      fontSize: '14px', 
                      color: '#C9A227',
                      fontWeight: 'bold'
                    }}>
                      {data.power}
                    </span>
                  </div>
                  
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#141419',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        width: `${data.power}%`,
                        height: '100%',
                        backgroundColor: empireData.color,
                        borderRadius: '4px',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Territory Info Tooltip */}
      {hoveredTerritory && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '32px',
          backgroundColor: '#1E1E24',
          border: '2px solid #C9A227',
          borderRadius: '8px',
          padding: '16px',
          maxWidth: '300px',
          zIndex: 1000
        }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            color: '#F5F4F2',
            fontSize: '16px'
          }}>
            {territoryPositions[hoveredTerritory].name}
          </h4>
          
          <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
            <div style={{ marginBottom: '4px' }}>
              <strong>Controlled by:</strong> {getTerritoryOwner(hoveredTerritory).name}
            </div>
            <div>
              <strong>Year:</strong> {currentYear} CE
            </div>
          </div>
        </div>
      )}
    </div>
  );
}