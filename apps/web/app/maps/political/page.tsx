'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PoliticalMap() {
  const [currentYear, setCurrentYear] = useState(400);
  const [selectedEmpire, setSelectedEmpire] = useState<string | null>(null);
  const [hoveredTerritory, setHoveredTerritory] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [showInfluence, setShowInfluence] = useState(false);
  const [showTrade, setShowTrade] = useState(false);

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
      type: 'Barbarian Kingdom',
      periods: {
        100: { size: 0, power: 0, territories: [], capital: '', population: 0, warriors: 0 },
        200: { size: 15, power: 25, territories: ['Gothia_Minor'], capital: 'Tanais', population: 500000, warriors: 15000 },
        300: { size: 25, power: 35, territories: ['Gothia', 'Dacia'], capital: 'Sarmizegetusa', population: 800000, warriors: 25000 },
        400: { size: 45, power: 55, territories: ['Dacia', 'Pannonia'], capital: 'Aquincum', population: 1200000, warriors: 40000 },
        500: { size: 60, power: 70, territories: ['Hispania_Gothica', 'Gallia_Narbonensis'], capital: 'Tolosa', population: 2000000, warriors: 60000 },
        600: { size: 65, power: 75, territories: ['Hispania_Gothica'], capital: 'Toletum', population: 2500000, warriors: 70000 },
      }
    },
    'Frankish Kingdom': {
      color: '#059669',
      era: 'Late Antique',
      type: 'Germanic Federation',
      periods: {
        100: { size: 5, power: 15, territories: ['Francia_Minor'], capital: 'Tornacum', population: 200000, warriors: 8000 },
        200: { size: 15, power: 25, territories: ['Francia'], capital: 'Colonia', population: 400000, warriors: 15000 },
        300: { size: 25, power: 35, territories: ['Francia', 'Ripuaria'], capital: 'Colonia', population: 600000, warriors: 25000 },
        400: { size: 35, power: 45, territories: ['Francia', 'Austrasia'], capital: 'Reims', population: 1000000, warriors: 35000 },
        500: { size: 55, power: 65, territories: ['Francia', 'Austrasia', 'Neustria', 'Burgundia'], capital: 'Soissons', population: 2500000, warriors: 80000 },
        600: { size: 75, power: 85, territories: ['Francia', 'Austrasia', 'Neustria', 'Burgundia', 'Aquitania', 'Alemannia'], capital: 'Paris', population: 4000000, warriors: 120000 },
      }
    },
    'Hunnic Empire': {
      color: '#D97706',
      era: 'Late Antique',
      type: 'Nomadic Confederation',
      periods: {
        100: { size: 10, power: 20, territories: ['Scythia_Minor'], capital: 'Mobile', population: 300000, horsemen: 20000 },
        200: { size: 20, power: 30, territories: ['Scythia', 'Sarmatia'], capital: 'Mobile', population: 500000, horsemen: 35000 },
        300: { size: 35, power: 50, territories: ['Scythia', 'Sarmatia', 'Alania'], capital: 'Mobile', population: 800000, horsemen: 60000 },
        400: { size: 65, power: 85, territories: ['Scythia', 'Sarmatia', 'Alania', 'Pannonia', 'Dacia'], capital: 'Mobile', population: 1500000, horsemen: 120000 },
        500: { size: 35, power: 45, territories: ['Scythia', 'Alania'], capital: 'Mobile', population: 600000, horsemen: 40000 },
        600: { size: 15, power: 25, territories: ['Scythia_Minor'], capital: 'Mobile', population: 200000, horsemen: 15000 },
      }
    },
    'Eastern Roman Empire': {
      color: '#3B82F6',
      era: 'Byzantine',
      type: 'Orthodox Empire',
      periods: {
        100: { size: 0, power: 0, territories: [], capital: '', population: 0, themes: 0 },
        200: { size: 0, power: 0, territories: [], capital: '', population: 0, themes: 0 },
        300: { size: 45, power: 60, territories: ['Thracia', 'Asia_Minor', 'Syria'], capital: 'Constantinopolis', population: 25000000, themes: 8 },
        400: { size: 55, power: 70, territories: ['Thracia', 'Asia_Minor', 'Syria', 'Aegyptus', 'Illyria'], capital: 'Constantinopolis', population: 30000000, themes: 12 },
        500: { size: 65, power: 75, territories: ['Thracia', 'Asia_Minor', 'Syria', 'Aegyptus', 'Italia_Orientalis'], capital: 'Constantinopolis', population: 35000000, themes: 15 },
        600: { size: 70, power: 80, territories: ['Thracia', 'Asia_Minor', 'Syria', 'Aegyptus', 'Illyria', 'Italia_Orientalis'], capital: 'Constantinopolis', population: 40000000, themes: 18 },
      }
    }
  };

  const territories = {
    'Italia': { x: 320, y: 260, size: 25 },
    'Gallia': { x: 280, y: 200, size: 30 },
    'Hispania': { x: 220, y: 240, size: 28 },
    'Britannia': { x: 260, y: 160, size: 20 },
    'Germania': { x: 320, y: 180, size: 25 },
    'Germania_Inferior': { x: 300, y: 180, size: 18 },
    'Dacia': { x: 380, y: 210, size: 22 },
    'Thracia': { x: 370, y: 240, size: 20 },
    'Asia_Minor': { x: 420, y: 250, size: 28 },
    'Syria': { x: 460, y: 280, size: 24 },
    'Judaea': { x: 450, y: 300, size: 15 },
    'Aegyptus': { x: 440, y: 340, size: 26 },
    'Arabia': { x: 480, y: 320, size: 22 },
    'Mesopotamia': { x: 500, y: 290, size: 24 },
    'Persis': { x: 580, y: 310, size: 30 },
    'Armenia': { x: 480, y: 250, size: 20 },
    'Atropatene': { x: 520, y: 270, size: 18 },
    'Bactria': { x: 620, y: 280, size: 25 },
    'Sogdiana': { x: 650, y: 250, size: 22 },
    'Chorasmia': { x: 600, y: 220, size: 20 },
    'Herat': { x: 640, y: 300, size: 18 },
    'Francia': { x: 280, y: 180, size: 22 },
    'Francia_Minor': { x: 270, y: 170, size: 15 },
    'Austrasia': { x: 300, y: 170, size: 20 },
    'Neustria': { x: 260, y: 180, size: 18 },
    'Burgundia': { x: 290, y: 200, size: 20 },
    'Aquitania': { x: 250, y: 220, size: 22 },
    'Alemannia': { x: 310, y: 190, size: 18 },
    'Pannonia': { x: 350, y: 220, size: 24 },
    'Hispania_Gothica': { x: 220, y: 250, size: 26 },
    'Gallia_Narbonensis': { x: 270, y: 230, size: 18 },
    'Gothia': { x: 400, y: 200, size: 22 },
    'Gothia_Minor': { x: 420, y: 210, size: 16 },
    'Scythia': { x: 450, y: 180, size: 28 },
    'Scythia_Minor': { x: 430, y: 190, size: 18 },
    'Sarmatia': { x: 480, y: 160, size: 26 },
    'Alania': { x: 520, y: 180, size: 22 },
    'Ripuaria': { x: 290, y: 160, size: 16 },
    'Illyria': { x: 340, y: 250, size: 24 },
    'Italia_Orientalis': { x: 340, y: 280, size: 20 },
    'Italia_Gothica': { x: 330, y: 270, size: 22 },
  };

  const tradeRoutes = [
    { from: 'Constantinopolis', to: 'Alexandria', type: 'Sea Route', value: 850 },
    { from: 'Roma', to: 'Carthago', type: 'Sea Route', value: 720 },
    { from: 'Ctesiphon', to: 'Samarkand', type: 'Silk Road', value: 650 },
    { from: 'Constantinopolis', to: 'Trebizond', type: 'Black Sea', value: 580 },
    { from: 'Massilia', to: 'Narbo', type: 'Coastal', value: 450 },
    { from: 'Aquileia', to: 'Sirmium', type: 'Amber Road', value: 520 },
  ];

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear(prev => {
          const nextYear = prev + (50 * playSpeed);
          return nextYear > 600 ? 100 : nextYear;
        });
      }, 2000 / playSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed]);

  const getEmpireAtYear = (empireName: string, year: number) => {
    const empire = empires[empireName as keyof typeof empires];
    const availableYears = Object.keys(empire.periods).map(Number).sort((a, b) => a - b);
    
    let closestYear = availableYears[0];
    for (const availableYear of availableYears) {
      if (availableYear <= year) {
        closestYear = availableYear;
      } else {
        break;
      }
    }
    
    return empire.periods[closestYear as keyof typeof empire.periods];
  };

  const getEraColor = (year: number) => {
    if (year <= 323) return '#F59E0B'; // Classical
    if (year <= 284) return '#3B82F6'; // Hellenistic
    if (year <= 600) return '#7C3AED'; // Late Antique
    return '#059669'; // Byzantine
  };

  const formatPopulation = (pop: number) => {
    return (pop / 1000000).toFixed(1) + 'M';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        padding: '1rem 2rem',
        borderBottom: '1px solid #2D2D35'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link href="/" style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#C9A227',
              textDecoration: 'none'
            }}>
              ΛΟΓΟΣ
            </Link>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/maps" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>Maps</Link>
              <span style={{ color: '#C9A227' }}>Political</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>Year {currentYear} CE</span>
            <div style={{ 
              padding: '0.25rem 0.75rem', 
              backgroundColor: getEraColor(currentYear) + '20',
              color: getEraColor(currentYear),
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>
              {currentYear <= 323 ? 'Classical' : currentYear <= 284 ? 'Hellenistic' : currentYear <= 600 ? 'Late Antique' : 'Byzantine'}
            </div>
          </div>
        </div>
      </nav>

      <div style={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
        {/* Main Map */}
        <div style={{ flex: 1, position: 'relative', backgroundColor: '#141419' }}>
          {/* Controls */}
          <div style={{ 
            position: 'absolute', 
            top: '1rem', 
            left: '1rem', 
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {/* Time Control */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              padding: '1rem', 
              borderRadius: '8px',
              border: '1px solid #2D2D35',
              minWidth: '300px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: '600', color: '#C9A227' }}>Temporal Navigation</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{
                      backgroundColor: isPlaying ? '#DC2626' : '#059669',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                </div>
              </div>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <input
                  type="range"
                  min="100"
                  max="600"
                  step="50"
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#2D2D35',
                    outline: 'none',
                    borderRadius: '3px'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                  <span>100 CE</span>
                  <span>350 CE</span>
                  <span>600 CE</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Speed:</label>
                <select 
                  value={playSpeed}
                  onChange={(e) => setPlaySpeed(Number(e.target.value))}
                  style={{
                    backgroundColor: '#141419',
                    color: '#F5F4F2',
                    border: '1px solid #2D2D35',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px'
                  }}
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                </select>
              </div>
            </div>

            {/* Display Options */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              padding: '1rem', 
              borderRadius: '8px',
              border: '1px solid #2D2D35'
            }}>
              <div style={{ fontWeight: '600', color: '#C9A227', marginBottom: '0.75rem' }}>
                Display Options
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <input 
                    type="checkbox"
                    checked={showInfluence}
                    onChange={(e) => setShowInfluence(e.target.checked)}
                    style={{ accentColor: '#C9A227' }}
                  />
                  <span>Spheres of Influence</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <input 
                    type="checkbox"
                    checked={showTrade}
                    onChange={(e) => setShowTrade(e.target.checked)}
                    style={{ accentColor: '#C9A227' }}
                  />
                  <span>Trade Routes</span>
                </label>
              </div>
            </div>
          </div>

          {/* SVG Map */}
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 800 500"
            style={{ backgroundColor: '#0D0D0F' }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <pattern id="water" patternUnits="userSpaceOnUse" width="4" height="4">
                <rect width="4" height="4" fill="#1E293B"/>
                <circle cx="2" cy="2" r="0.5" fill="#334155"/>
              </pattern>
            </defs>

            {/* Background Ocean */}
            <rect width="800" height="500" fill="url(#water)" opacity="0.3"/>

            {/* Mediterranean Sea */}
            <ellipse cx="350" cy="320" rx="120" ry="40" fill="#1E293B" opacity="0.6"/>
            <ellipse cx="280" cy="280" rx="60" ry="25" fill="#1E293B" opacity="0.4"/>
            
            {/* Black Sea */}
            <ellipse cx="450" cy="200" rx="50" ry="25" fill="#1E293B" opacity="0.6"/>

            {/* Trade Routes */}
            {showTrade && tradeRoutes.map((route, index) => (
              <g key={index}>
                <line
                  x1={300 + index * 40}
                  y1={200 + index * 20}
                  x2={500 + index * 30}
                  y2={300 + index * 15}
                  stroke="#C9A227"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.6"
                >
                  <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                </line>
              </g>
            ))}

            {/* Territories */}
            {Object.entries(empires).map(([empireName, empire]) => {
              const empireData = getEmpireAtYear(empireName, currentYear);
              if (!empireData || empireData.territories.length === 0) return null;

              return empireData.territories.map((territoryName, index) => {
                const territory = territories[territoryName as keyof typeof territories];
                if (!territory) return null;

                const isHovered = hoveredTerritory === territoryName;
                const isSelected = selectedEmpire === empireName;

                return (
                  <g key={`${empireName}-${territoryName}`}>
                    {/* Influence Sphere */}
                    {showInfluence && (
                      <circle
                        cx={territory.x}
                        cy={territory.y}
                        r={territory.size + 15}
                        fill={empire.color}
                        opacity="0.1"
                        style={{ transition: 'all 0.3s ease' }}
                      />
                    )}
                    
                    {/* Territory */}
                    <circle
                      cx={territory.x}
                      cy={territory.y}
                      r={territory.size * (empireData.size / 100)}
                      fill={empire.color}
                      opacity={isHovered || isSelected ? 0.8 : 0.6}
                      stroke={isSelected ? '#C9A227' : empire.color}
                      strokeWidth={isSelected ? 3 : 1}
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        filter: isHovered ? 'url(#glow)' : 'none'
                      }}
                      onMouseEnter={() => setHoveredTerritory(territoryName)}
                      onMouseLeave={() => setHoveredTerritory(null)}
                      onClick={() => setSelectedEmpire(selectedEmpire === empireName ? null : empireName)}
                    />

                    {/* Territory Labels */}
                    {(isHovered || isSelected) && (
                      <text
                        x={territory.x}
                        y={territory.y - territory.size - 10}
                        textAnchor="middle"
                        fill="#F5F4F2"
                        fontSize="12"
                        fontWeight="600"
                        style={{ pointerEvents: 'none' }}
                      >
                        {territoryName.replace(/_/g, ' ')}
                      </text>
                    )}
                  </g>
                );
              });
            })}

            {/* Empire Power Indicators */}
            {Object.entries(empires).map(([empireName, empire]) => {
              const empireData = getEmpireAtYear(empireName, currentYear);
              if (!empireData || empireData.territories.length === 0) return null;

              // Calculate center of empire
              const territories_coords = empireData.territories
                .map(name => territories[name as keyof typeof territories])
                .filter(Boolean);
              
              const centerX = territories_coords.reduce((sum, t) => sum + t.x, 0) / territories_coords.length;
              const centerY = territories_coords.reduce((sum, t) => sum + t.y, 0) / territories_coords.length;

              return (
                <g key={`power-${empireName}`}>
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={empireData.power / 10}
                    fill="none"
                    stroke={empire.color}
                    strokeWidth="3"
                    opacity="0.4"
                    strokeDasharray="8,4"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values={`0 ${centerX} ${centerY};360 ${centerX} ${centerY}`}
                      dur="20s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}

            {/* Year Indicator */}
            <text x="50" y="450" fill="#C9A227" fontSize="24" fontWeight="bold">
              {currentYear} CE
            </text>
          </svg>

          {/* Hover Tooltip */}
          {hoveredTerritory && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#1E1E24',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #2D2D35',
              pointerEvents: 'none',
              zIndex: 20
            }}>
              <div style={{ fontWeight: '600', color: '#