'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const eraColors = {
  'Archaic': '#D97706',
  'Classical': '#F59E0B',
  'Hellenistic': '#3B82F6',
  'Imperial': '#DC2626',
  'Late Antique': '#7C3AED',
  'Byzantine': '#059669',
};

const territoryData = {
  Italia: { name: 'Italia', x: 100, y: 150, empire: null },
  Gallia: { name: 'Gallia', x: 50, y: 80, empire: null },
  Hispania: { name: 'Hispania', x: 20, y: 200, empire: null },
  Britannia: { name: 'Britannia', x: 30, y: 30, empire: null },
  Germania: { name: 'Germania', x: 70, y: 40, empire: null },
  Germania_Inferior: { name: 'Germania Inferior', x: 65, y: 55, empire: null },
  Dacia: { name: 'Dacia', x: 120, y: 60, empire: null },
  Thracia: { name: 'Thracia', x: 130, y: 120, empire: null },
  Aegyptus: { name: 'Aegyptus', x: 150, y: 250, empire: null },
  Syria: { name: 'Syria', x: 170, y: 200, empire: null },
  Arabia: { name: 'Arabia', x: 200, y: 270, empire: null },
  Mesopotamia: { name: 'Mesopotamia', x: 190, y: 170, empire: null },
  Persis: { name: 'Persis', x: 250, y: 200, empire: null },
  Armenia: { name: 'Armenia', x: 220, y: 140, empire: null },
  Atropatene: { name: 'Atropatene', x: 230, y: 130, empire: null },
  Bactria: { name: 'Bactria', x: 280, y: 120, empire: null },
  Sogdiana: { name: 'Sogdiana', x: 300, y: 100, empire: null },
  Chorasmia: { name: 'Chorasmia', x: 290, y: 80, empire: null },
  Herat: { name: 'Herat', x: 270, y: 150, empire: null },
  Gothia_Minor: { name: 'Gothia Minor', x: 140, y: 40, empire: null },
  Gothia: { name: 'Gothia', x: 130, y: 30, empire: null },
  Pannonia: { name: 'Pannonia', x: 100, y: 50, empire: null },
  Hispania_Gothica: { name: 'Hispania Gothica', x: 25, y: 220, empire: null },
  Gallia_Narbonensis: { name: 'Gallia Narbonensis', x: 70, y: 140, empire: null },
  Francia_Minor: { name: 'Francia Minor', x: 40, y: 70, empire: null },
  Francia: { name: 'Francia', x: 50, y: 60, empire: null },
  Ripuaria: { name: 'Ripuaria', x: 60, y: 50, empire: null },
  Austrasia: { name: 'Austrasia', x: 70, y: 60, empire: null },
  Neustria: { name: 'Neustria', x: 50, y: 80, empire: null },
  Burgundia: { name: 'Burgundia', x: 70, y: 100, empire: null },
  Aquitania: { name: 'Aquitania', x: 40, y: 150, empire: null },
  Alemannia: { name: 'Alemannia', x: 80, y: 50, empire: null },
  Scythia_Minor: { name: 'Scythia Minor', x: 150, y: 50, empire: null },
  Scythia: { name: 'Scythia', x: 160, y: 40, empire: null },
  Sarmatia: { name: 'Sarmatia', x: 170, y: 30, empire: null },
  Alania: { name: 'Alania', x: 180, y: 60, empire: null },
  Judaea: { name: 'Judaea', x: 175, y: 220, empire: null }
};

const empires = {
  'Roman Empire': {
    color: '#DC2626',
    era: 'Imperial',
    type: 'Mediterranean Thalassocracy',
    periods: {
      100: { size: 85, power: 95, territories: ['Italia', 'Gallia', 'Hispania', 'Britannia', 'Germania_Inferior', 'Dacia', 'Thracia', 'Aegyptus', 'Syria', 'Judaea'], capital: 'Roma', population: 65000000, legions: 30 },
      200: { size: 90, power: 90, territories: ['Italia', 'Gallia', 'Hispania', 'Britannia', 'Germania', 'Dacia', 'Thracia', 'Aegyptus', 'Syria', 'Arabia', 'Mesopotamia'], capital: 'Roma', population: 70000000, legions: 33 },
      300: { size: 88, power: 85, territories: ['Italia', 'Gallia', 'Hispania', 'Britannia', 'Germania_Inferior', 'Dacia', 'Thracia', 'Aegyptus', 'Syria', 'Arabia'], capital: 'Constantinopolis', population: 65000000, legions: 28 },
      400: { size: 75, power: 70, territories: ['Italia', 'Gallia', 'Hispania', 'Thracia', 'Aegyptus', 'Syria'], capital: 'Constantinopolis', population: 55000000, legions: 25 },
      500: { size: 60, power: 50, territories: ['Italia', 'Thracia', 'Aegyptus'], capital: 'Ravenna', population: 40000000, legions: 20 },
      600: { size: 45, power: 40, territories: ['Thracia'], capital: 'Constantinopolis', population: 30000000, legions: 15 },
    }
  },
  'Sasanian Empire': {
    color: '#F59E0B',
    era: 'Late Antique',
    type: 'Continental Empire',
    periods: {
      100: { size: 70, power: 80, territories: ['Persis', 'Mesopotamia', 'Armenia', 'Atropatene'], capital: 'Ctesiphon', population: 35000000, armies: 120000 },
      200: { size: 75, power: 85, territories: ['Persis', 'Mesopotamia', 'Armenia', 'Atropatene', 'Bactria'], capital: 'Ctesiphon', population: 40000000, armies: 150000 },
      300: { size: 80, power: 90, territories: ['Persis', 'Mesopotamia', 'Armenia', 'Atropatene', 'Bactria', 'Sogdiana'], capital: 'Ctesiphon', population: 45000000, armies: 180000 },
      400: { size: 85, power: 95, territories: ['Persis', 'Mesopotamia', 'Armenia', 'Atropatene', 'Bactria', 'Sogdiana', 'Chorasmia'], capital: 'Ctesiphon', population: 50000000, armies: 200000 },
      500: { size: 90, power: 100, territories: ['Persis', 'Mesopotamia', 'Armenia', 'Atropatene', 'Bactria', 'Sogdiana', 'Chorasmia', 'Herat'], capital: 'Ctesiphon', population: 55000000, armies: 220000 },
      600: { size: 88, power: 95, territories: ['Persis', 'Mesopotamia', 'Armenia', 'Bactria', 'Sogdiana'], capital: 'Isfahan', population: 52000000, armies: 200000 },
    }
  },
  'Visigothic Kingdom': {
    color: '#7C3AED',
    era: 'Late Antique',
    type: 'Germanic Kingdom',
    periods: {
      400: { size: 30, power: 40, territories: ['Hispania', 'Aquitania'], capital: 'Toulouse', population: 5000000, armies: 30000 },
      500: { size: 40, power: 50, territories: ['Hispania', 'Aquitania', 'Gallia_Narbonensis'], capital: 'Toulouse', population: 6000000, armies: 40000 },
      600: { size: 50, power: 60, territories: ['Hispania', 'Hispania_Gothica', 'Gallia_Narbonensis'], capital: 'Toledo', population: 7000000, armies: 50000 },
    }
  },
  'Frankish Kingdom': {
    color: '#059669',
    era: 'Late Antique',
    type: 'Germanic Kingdom',
    periods: {
      400: { size: 20, power: 30, territories: ['Francia_Minor'], capital: 'Tournai', population: 3000000, armies: 20000 },
      500: { size: 35, power: 45, territories: ['Francia', 'Neustria', 'Austrasia'], capital: 'Paris', population: 4000000, armies: 30000 },
      600: { size: 55, power: 70, territories: ['Francia', 'Neustria', 'Austrasia', 'Burgundia', 'Alemannia'], capital: 'Paris', population: 6000000, armies: 45000 },
    }
  },
  'Byzantine Empire': {
    color: '#059669',
    era: 'Byzantine',
    type: 'Orthodox Empire',
    periods: {
      600: { size: 60, power: 75, territories: ['Thracia', 'Aegyptus', 'Syria', 'Italia'], capital: 'Constantinopolis', population: 35000000, themes: 15 },
      700: { size: 40, power: 60, territories: ['Thracia', 'Scythia_Minor'], capital: 'Constantinopolis', population: 25000000, themes: 12 },
      800: { size: 35, power: 55, territories: ['Thracia'], capital: 'Constantinopolis', population: 20000000, themes: 10 },
    }
  }
};

export default function EmpireTimeline() {
  const [currentYear, setCurrentYear] = useState(100);
  const [selectedEmpire, setSelectedEmpire] = useState(null);
  const [hoveredTerritory, setHoveredTerritory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const intervalRef = useRef(null);

  const years = [100, 200, 300, 400, 500, 600, 700, 800];
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentYear(prev => {
          const currentIndex = years.indexOf(prev);
          const nextIndex = (currentIndex + 1) % years.length;
          return years[nextIndex];
        });
      }, 2000 / playbackSpeed);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, playbackSpeed]);

  const getCurrentTerritories = () => {
    const territories = { ...territoryData };
    Object.entries(empires).forEach(([empireName, empire]) => {
      const period = empire.periods[currentYear];
      if (period) {
        period.territories.forEach(territoryId => {
          if (territories[territoryId]) {
            territories[territoryId].empire = empireName;
          }
        });
      }
    });
    return territories;
  };

  const getActiveEmpires = () => {
    return Object.entries(empires).filter(([_, empire]) => empire.periods[currentYear]);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num?.toString();
  };

  const getYearLabel = (year) => {
    return year <= 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #0D0D0F 0%, #1E1E24 50%, #141419 100%)'
    }}>
      {/* Header */}
      <div style={{
        padding: '2rem',
        borderBottom: '1px solid #1E1E24',
        background: 'rgba(29, 29, 36, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                margin: 0, 
                background: `linear-gradient(135deg, ${eraColors.Imperial} 0%, ${eraColors.Byzantine} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Empire Timeline Simulator
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', color: '#9CA3AF', fontSize: '1.1rem' }}>
                Interactive Map of Ancient & Medieval Empires
              </p>
            </div>
            <Link 
              href="/logos" 
              style={{ 
                color: '#C9A227', 
                textDecoration: 'none', 
                fontSize: '1.1rem',
                padding: '0.75rem 1.5rem',
                border: '1px solid #C9A227',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                backgroundColor: 'rgba(201, 162, 39, 0.1)'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(201, 162, 39, 0.2)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(201, 162, 39, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(201, 162, 39, 0.1)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ← Back to LOGOS
            </Link>
          </div>

          {/* Time Controls */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2rem', 
            flexWrap: 'wrap',
            padding: '1.5rem',
            backgroundColor: 'rgba(30, 30, 36, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(201, 162, 39, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: isPlaying ? '#DC2626' : '#C9A227',
                  color: '#F5F4F2',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Speed:</span>
                {[0.5, 1, 2, 3].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: playbackSpeed === speed ? '#C9A227' : 'transparent',
                      color: playbackSpeed === speed ? '#0D0D0F' : '#9CA3AF',
                      border: '1px solid #C9A227',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '600', color: '#C9A227' }}>
                  Current Year: {getYearLabel(currentYear)}
                </span>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '8px', backgroundColor: '#1E1E24', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${((currentYear - minYear) / (maxYear - minYear)) * 100}%`,
                    background: `linear-gradient(90deg, ${eraColors.Imperial} 0%, ${eraColors['Late Antique']} 60%, ${eraColors.Byzantine} 100%)`,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}
                />
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => setCurrentYear(year)}
                    style={{
                      position: 'absolute',
                      left: `${((year - minYear) / (maxYear - minYear)) * 100}%`,
                      top: '-8px',
                      transform: 'translateX(-50%)',
                      width: '16px',
                      height: '24px',
                      backgroundColor: currentYear === year ? '#C9A227' : '#6B7280',
                      border: '2px solid #0D0D0F',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateX(-50%) scale(1.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateX(-50%) scale(1)';
                    }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                {years.map(year => (
                  <span key={year} style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                    {getYearLabel(year)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
          
          {/* Map Section */}
          <div style={{ 
            backgroundColor: '#1E1E24', 
            borderRadius: '16px', 
            padding: '2rem',
            border: '1px solid rgba(201, 162, 39, 0.2)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem', 
              color: '#F5F4F2',
              textAlign: 'center'
            }}>
              Empire Territories - {getYearLabel(currentYear)}
            </h2>
            
            <div style={{ position: 'relative', width: '100%', height: '500px', backgroundColor: '#141419', borderRadius: '12px', overflow: 'hidden' }}>
              <svg 
                viewBox="0 0 350 300" 
                style={{ width: '100%', height: '100%' }}
              >
                {/* Background gradient */}
                <defs>
                  <radialGradient id="mapBg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1E1E24" />
                    <stop offset="100%" stopColor="#141419" />
                  </radialGradient>
                  
                  {/* Empire territory gradients */}
                  {Object.entries(empires).map(([empireName, empire]) => (
                    <radialGradient key={empireName} id={`${empireName}-gradient`} cx="50%" cy="50%" r="60%">
                      <stop offset="0%" stopColor={empire.color} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={empire.color} stopOpacity="0.4" />
                    </radialGradient>
                  ))}
                </defs>
                
                <rect width="100%" height="100%" fill="url(#mapBg)" />
                
                {/* Connection lines between territories of same empire */}
                {Object.entries(getCurrentTerritories()).map(([territoryId, territory]) => {
                  if (!territory.empire) return null;
                  
                  const sameEmpireTerritories = Object.entries(getCurrentTerritories())
                    .filter(([_, t]) => t.empire === territory.empire && t !== territory);
                  
                  return sameEmpireTerritories.map(([otherId, otherTerritory]) => (
                    <line
                      key={`${territoryId}-${otherId}`}
                      x1={territory.x}
                      y1={territory.y}
                      x2={otherTerritory.x}
                      y2={otherTerritory.y}
                      stroke={empires[territory.empire].color}
                      strokeWidth="0.5"
                      strokeOpacity="0.3"
                    />
                  ));
                })}
                
                {/* Territories */}
                {Object.entries(getCurrentTerritories()).map(([territoryId, territory]) => {
                  const empire = territory.empire ? empires[territory.empire] : null;
                  const isHovered = hoveredTerritory === territoryId;
                  const isSelected = selectedEmpire === territory.empire;
                  
                  return (
                    <g key={territoryId}>
                      {/* Territory influence area */}
                      {empire && (
                        <circle
                          cx={territory.x}
                          cy={territory.y}
                          r="12"
                          fill={`url(#${territory.empire}-gradient)`}
                          opacity={isSelected || isHovered ? 0.6 : 0.3}
                          style={{ transition: 'all 0.3s ease' }}
                        />
                      )}
                      
                      {/* Territory dot */}
                      <circle
                        cx={territory.x}
                        cy={territory.y}
                        r={isHovered ? "6" : "4"}
                        fill={empire ? empire.color : '#6B7280'}
                        stroke="#F5F4F2"
                        strokeWidth={isHovered ? "2" : "1"}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          filter: isHovered ? 'brightness(1.3)' : 'none'
                        }}
                        onMouseEnter={() => setHoveredTerritory(territoryId)}
                        onMouseLeave={() => setHoveredTerritory(null)}
                        onClick={() => territory.empire && setSelectedEmpire(selectedEmpire === territory.empire ? null : territory.empire)}
                      />
                      
                      {/* Territory label */}
                      {(isHovered || isSelected) && (
                        <text
                          x={territory.x}
                          y={territory.y - 15}
                          textAnchor="middle"
                          fill="#F5F4F2"
                          fontSize="10"
                          fontWeight="600"
                          style={{ 
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                            transition: 'opacity 0.2s ease'
                          }}
                        >
                          {territory.name}
                        </text>
                      )}
                    </g>
                  );
                })}
                
                {/* Empire expansion animations */}
                {getActiveEmpires().map(([empireName, empire]) => {
                  const period = empire.periods[currentYear];
                  return period.territories.map((territoryId, index) => {
                    const territory = territoryData[territoryId];
                    if (!territory) return null;
                    
                    return (
                      <circle
                        key={`${empireName}-${territoryId}-pulse`}
                        cx={territory.x}
                        cy={territory.y}
                        r="8"
                        fill="none"
                        stroke={empire.color}
                        strokeWidth="2"
                        opacity="0"
                      >
                        <animate
                          attributeName="r"
                          values="4;20;4"
                          dur="3s"
                          begin={`${index * 0.2}s`}
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.7;0;0.7"
                          dur="3s"
                          begin={`${index * 0.2}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    );
                  });
                })}
              </svg>
              
              {/* Hover tooltip */}
              {hoveredTerritory && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  backgroundColor: 'rgba(30, 30, 36, 0.95)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #C9A227',
                  backdropFilter: 'blur(10px)',
                  zIndex: 10
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#C9A227' }}>
                    {getCurrentTerritories()[hoveredTerritory].name}
                  </h4>
                  {getCurrentTerritories()[hoveredTerritory].empire ? (
                    <p style={{ margin: 0, color: '#9CA3AF' }}>
                      Controlled by: <span style={{ color: empires[getCurrentTerritories()[hoveredTerritory].empire].color }}>
                        {getCurrentTerritories()[hoveredTerritory].empire}
                      </span>
                    </p>
                  ) : (
                    <p style={{ margin: 0, color: '#6B7280' }}>Independent</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Empire Info Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Active Empires List */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '12px', 
              padding: '1.5rem',
              border: '1px solid rgba(201, 162, 39, 0.2)'
            }}>
              <h3 style={{ 
                fontSize: '1.4rem', 
                fontWeight: 'bold', 
                marginBottom: '1