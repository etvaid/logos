'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PoliticalMap() {
  const [currentYear, setCurrentYear] = useState(400);
  const [selectedEmpire, setSelectedEmpire] = useState<string | null>(null);
  const [hoveredTerritory, setHoveredTerritory] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const getTerritoryOwner = (territoryId: string) => {
    for (const [empireName, empire] of Object.entries(empires)) {
      const data = getEmpireData(empireName);
      if (data.territories.includes(territoryId)) {
        return { name: empireName, color: empire.color };
      }
    }
    return null;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentYear(parseInt(e.target.value));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentYear(prev => {
          if (prev >= 500) {
            setIsPlaying(false);
            return 500;
          }
          return prev + 5;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        padding: '16px 24px', 
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#C9A227', 
          textDecoration: 'none' 
        }}>
          LOGOS
        </Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/maps" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>
            Maps
          </Link>
          <Link href="/timeline" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>
            Timeline
          </Link>
          <Link href="/texts" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>
            Texts
          </Link>
        </div>
      </nav>

      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            marginBottom: '16px' 
          }}>
            Political Map
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#9CA3AF', 
            maxWidth: '800px' 
          }}>
            Explore the changing political landscape of the ancient world. Watch empires rise and fall through time.
          </p>
        </div>

        {/* Time Controls */}
        <div style={{ 
          backgroundColor: '#1E1E24',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                backgroundColor: isPlaying ? '#DC2626' : '#C9A227',
                color: '#0D0D0F',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '16px'
              }}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#C9A227',
              minWidth: '100px'
            }}>
              {currentYear} CE
            </span>
          </div>
          
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="range"
              min="100"
              max="500"
              step="5"
              value={currentYear}
              onChange={handleSliderChange}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#333',
                borderRadius: '4px',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '0',
              right: '0',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#6B7280'
            }}>
              <span>100 CE</span>
              <span>200 CE</span>
              <span>300 CE</span>
              <span>400 CE</span>
              <span>500 CE</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Main Map */}
          <div style={{ 
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            padding: '24px',
            flex: 1
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              marginBottom: '24px',
              color: '#F5F4F2'
            }}>
              Political Map - {currentYear} CE
            </h2>
            
            <div style={{ 
              position: 'relative',
              width: '100%',
              height: '600px',
              backgroundColor: '#141419',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 1200 600"
                style={{ display: 'block' }}
              >
                {/* Base map outline */}
                <rect 
                  width="1200" 
                  height="600" 
                  fill="#0D0D0F"
                  stroke="#333"
                  strokeWidth="2"
                />
                
                {/* Mediterranean Sea */}
                <ellipse
                  cx="450"
                  cy="350"
                  rx="200"
                  ry="80"
                  fill="#1E3A8A"
                  opacity="0.3"
                />
                
                {/* Territories */}
                {Object.entries(territoryPositions).map(([territoryId, pos]) => {
                  const owner = getTerritoryOwner(territoryId);
                  const isHovered = hoveredTerritory === territoryId;
                  const isSelected = selectedEmpire === owner?.name;
                  
                  return (
                    <rect
                      key={territoryId}
                      x={pos.x}
                      y={pos.y}
                      width={pos.width}
                      height={pos.height}
                      fill={owner ? owner.color : '#333333'}
                      opacity={isSelected || !selectedEmpire ? (isHovered ? 0.9 : 0.7) : 0.3}
                      stroke={isHovered ? '#C9A227' : (owner ? owner.color : '#555')}
                      strokeWidth={isHovered ? 3 : 1}
                      rx="4"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={() => setHoveredTerritory(territoryId)}
                      onMouseLeave={() => setHoveredTerritory(null)}
                    />
                  );
                })}
                
                {/* Territory Labels */}
                {Object.entries(territoryPositions).map(([territoryId, pos]) => {
                  const owner = getTerritoryOwner(territoryId);
                  const isHovered = hoveredTerritory === territoryId;
                  
                  if (!isHovered && !selectedEmpire) return null;
                  if (selectedEmpire && owner?.name !== selectedEmpire) return null;
                  
                  return (
                    <text
                      key={`label-${territoryId}`}
                      x={pos.x + pos.width / 2}
                      y={pos.y + pos.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#F5F4F2"
                      fontSize="12"
                      fontWeight="bold"
                      style={{ pointerEvents: 'none' }}
                    >
                      {pos.name}
                    </text>
                  );
                })}
                
                {/* Power indicators for capitals */}
                {Object.entries(empires).map(([empireName, empire]) => {
                  const data = getEmpireData(empireName);
                  if (data.territories.length === 0) return null;
                  
                  // Find the "capital" territory (first in the list)
                  const capitalId = data.territories[0];
                  const capital = territoryPositions[capitalId];
                  if (!capital) return null;
                  
                  const isSelected = selectedEmpire === empireName;
                  
                  return (
                    <circle
                      key={`capital-${empireName}`}
                      cx={capital.x + capital.width / 2}
                      cy={capital.y + capital.height / 2}
                      r={Math.max(4, data.power / 10)}
                      fill={empire.color}
                      stroke="#C9A227"
                      strokeWidth={isSelected ? 3 : 1}
                      opacity={isSelected || !selectedEmpire ? 1 : 0.5}
                      style={{
                        transition: 'all 0.2s ease'
                      }}
                    />
                  );
                })}
              </svg>
              
              {/* Tooltip */}
              {hoveredTerritory && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #C9A227',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  zIndex: 10
                }}>
                  <div style={{ fontWeight: 'bold', color: '#C9A227', marginBottom: '4px' }}>
                    {territoryPositions[hoveredTerritory]?.name}
                  </div>
                  <div style={{ color: '#9CA3AF' }}>
                    {getTerritoryOwner(hoveredTerritory)?.name || 'Independent'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Empire Panel */}
          <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Empire List */}
            <div style={{
              backgroundColor: '#1E1E24',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: '#F5F4F2'
              }}>
                Empires
              </h3>
              
              {Object.entries(empires).map(([empireName, empire]) => {
                const data = getEmpireData(empireName);
                const isSelected = selectedEmpire === empireName;
                
                return (
                  <div
                    key={empireName}
                    onClick={() => setSelectedEmpire(isSelected ? null : empireName)}
                    style={{
                      padding: '12px',
                      marginBottom: '8px',
                      backgroundColor: isSelected ? '#141419' : 'transparent',
                      border: `2px solid ${isSelected ? empire.color : 'transparent'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: empire.color,
                        borderRadius: '50%'
                      }} />
                      <span style={{ fontWeight: 'bold', color: '#F5F4F2', fontSize: '14px' }}>
                        {empireName}
                      </span>
                    </div>
                    
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                      <div style={{ marginBottom: '4px' }}>
                        Territories: {data.territories.length}
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        Size: {data.size}%
                      </div>
                      <div>
                        Power: {data.power}%
                      </div>
                    </div>
                    
                    {/* Power bar */}
                    <div style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: '#333',
                      borderRadius: '2px',
                      marginTop: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${data.power}%`,
                        height: '100%',
                        backgroundColor: empire.color,
                        borderRadius: '2px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{
              backgroundColor: '#1E1E24',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: '#F5F4F2'
              }}>
                Legend
              </h3>
              
              <div style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: '1.5' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#C9A227' }}>● </span>
                  Capital Cities
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#1E3A8A' }}>～ </span>
                  Mediterranean Sea
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#6B7280' }}>▢ </span>
                  Independent Territories
                </div>
                <div>
                  Click empires to highlight their territories
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}