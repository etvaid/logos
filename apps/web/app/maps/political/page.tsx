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
  const [selectedView, setSelectedView] = useState<'political' | 'military' | 'economic' | 'cultural'>('political');

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
  };

  const territories = {
    'Italia': { x: 450, y: 320, width: 80, height: 120 },
    'Gallia': { x: 380, y: 250, width: 100, height: 100 },
    'Hispania': { x: 280, y: 300, width: 120, height: 80 },
    'Britannia': { x: 350, y: 180, width: 90, height: 60 },
    'Germania': { x: 480, y: 200, width: 100, height: 80 },
    'Germania_Inferior': { x: 460, y: 220, width: 60, height: 50 },
    'Dacia': { x: 550, y: 280, width: 70, height: 60 },
    'Thracia': { x: 520, y: 340, width: 80, height: 50 },
    'Aegyptus': { x: 580, y: 420, width: 70, height: 80 },
    'Syria': { x: 650, y: 380, width: 80, height: 60 },
    'Judaea': { x: 630, y: 400, width: 40, height: 40 },
    'Arabia': { x: 680, y: 450, width: 90, height: 80 },
    'Mesopotamia': { x: 720, y: 360, width: 80, height: 70 },
    'Persis': { x: 800, y: 380, width: 100, height: 80 },
    'Armenia': { x: 700, y: 320, width: 60, height: 50 },
    'Atropatene': { x: 740, y: 300, width: 50, height: 40 },
    'Bactria': { x: 900, y: 340, width: 80, height: 60 },
    'Sogdiana': { x: 920, y: 300, width: 70, height: 50 },
    'Chorasmia': { x: 860, y: 280, width: 60, height: 50 },
    'Herat': { x: 880, y: 380, width: 50, height: 40 },
    'Gothia': { x: 520, y: 260, width: 80, height: 60 },
    'Gothia_Minor': { x: 540, y: 240, width: 40, height: 30 },
    'Pannonia': { x: 510, y: 300, width: 60, height: 50 },
    'Hispania_Gothica': { x: 300, y: 320, width: 100, height: 60 },
    'Gallia_Narbonensis': { x: 400, y: 320, width: 50, height: 40 },
    'Francia': { x: 420, y: 240, width: 60, height: 50 },
    'Francia_Minor': { x: 430, y: 250, width: 30, height: 25 },
    'Austrasia': { x: 460, y: 240, width: 50, height: 40 },
    'Neustria': { x: 380, y: 260, width: 60, height: 50 },
    'Burgundia': { x: 440, y: 290, width: 50, height: 40 },
    'Aquitania': { x: 360, y: 300, width: 70, height: 50 },
    'Alemannia': { x: 480, y: 270, width: 40, height: 30 },
    'Ripuaria': { x: 450, y: 250, width: 30, height: 25 },
    'Scythia': { x: 600, y: 200, width: 120, height: 80 },
    'Scythia_Minor': { x: 580, y: 320, width: 60, height: 40 },
    'Sarmatia': { x: 580, y: 240, width: 80, height: 60 },
    'Alania': { x: 720, y: 260, width: 70, height: 50 },
  };

  const tradeRoutes = [
    { from: { x: 450, y: 350 }, to: { x: 720, y: 380 }, name: 'Silk Road West' },
    { from: { x: 720, y: 380 }, to: { x: 900, y: 350 }, name: 'Silk Road East' },
    { from: { x: 500, y: 360 }, to: { x: 600, y: 450 }, name: 'Mediterranean Route' },
    { from: { x: 380, y: 280 }, to: { x: 320, y: 340 }, name: 'Atlantic Trade' },
    { from: { x: 650, y: 410 }, to: { x: 700, y: 480 }, name: 'Arabian Route' },
  ];

  const influenceSpheres = [
    { empire: 'Roman Empire', x: 450, y: 350, radius: 180 },
    { empire: 'Sasanian Empire', x: 800, y: 350, radius: 160 },
    { empire: 'Hunnic Empire', x: 650, y: 250, radius: 140 },
    { empire: 'Frankish Kingdom', x: 420, y: 280, radius: 100 },
    { empire: 'Visigothic Kingdom', x: 350, y: 340, radius: 80 },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isDragging) {
      interval = setInterval(() => {
        setCurrentYear(prev => {
          const next = prev + (10 * playSpeed);
          return next > 600 ? 100 : next;
        });
      }, 1000 / playSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isDragging, playSpeed]);

  const getClosestYear = (year: number) => {
    const years = [100, 200, 300, 400, 500, 600];
    return years.reduce((prev, curr) => 
      Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
    );
  };

  const getCurrentEmpireData = (empireName: string) => {
    const year = getClosestYear(currentYear);
    return empires[empireName as keyof typeof empires].periods[year as keyof typeof empires[keyof typeof empires]['periods']];
  };

  const getTerritoryOwner = (territoryName: string) => {
    for (const [empireName, empire] of Object.entries(empires)) {
      const data = getCurrentEmpireData(empireName);
      if (data.territories.includes(territoryName)) {
        return { name: empireName, color: empire.color };
      }
    }
    return null;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  const getEraColor = (era: string) => {
    switch (era) {
      case 'Imperial': return '#DC2626';
      case 'Late Antique': return '#7C3AED';
      default: return '#C9A227';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid #1E1E24',
        background: 'linear-gradient(135deg, #141419 0%, #1E1E24 100%)'
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
              fontSize: '32px',
              fontWeight: '800',
              margin: '0 0 8px 0',
              background: 'linear-gradient(135deg, #C9A227 0%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Political Empires Map
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#9CA3AF',
              margin: 0
            }}>
              Interactive visualization of ancient empires • {currentYear} CE
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/" style={{
              padding: '12px 24px',
              backgroundColor: '#1E1E24',
              color: '#C9A227',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              border: '1px solid #C9A227'
            }}>
              ← Back to LOGOS
            </Link>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        maxWidth: '1400px',
        margin: '0 auto',
        gap: '24px',
        padding: '24px'
      }}>
        {/* Control Panel */}
        <div style={{
          width: '320px',
          backgroundColor: '#1E1E24',
          borderRadius: '16px',
          padding: '24px',
          height: 'fit-content',
          border: '1px solid #141419'
        }}>
          {/* Time Controls */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#C9A227',
              margin: '0 0 16px 0'
            }}>
              Timeline Control
            </h3>
            
            <div style={{
              backgroundColor: '#141419',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#F5F4F2',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                {currentYear} CE
              </div>
              
              <input
                type="range"
                min="100"
                max="600"
                step="10"
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: '#6B7280',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#9CA3AF',
                marginTop: '8px'
              }}>
                <span>100 CE</span>
                <span>600 CE</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: isPlaying ? '#DC2626' : '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              
              <select
                value={playSpeed}
                onChange={(e) => setPlaySpeed(Number(e.target.value))}
                style={{
                  padding: '12px',
                  backgroundColor: '#141419',
                  color: '#F5F4F2',
                  border: '1px solid #6B7280',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={3}>3x</option>
              </select>
            </div>
          </div>

          {/* View Options */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#C9A227',
              margin: '0 0 16px 0'
            }}>
              Map Views
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {['political', 'military', 'economic', 'cultural'].map(view => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view as any)}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: selectedView === view ? '#C9A227' : '#141419',
                    color: selectedView === view ? '#0D0D0F' : '#F5F4F2',
                    border: '1px solid #6B7280',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize'
                  }}
                >
                  {view}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={showInfluence}
                  onChange={(e) => setShowInfluence(e.target.checked)}
                  style={{ accentColor: '#C9A227' }}
                />
                Show Influence Spheres
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={showTrade}
                  onChange={(e) => setShowTrade(e.target.checked)}
                  style={{ accentColor: '#C9A227' }}
                />
                Show Trade Routes
              </label>
            </div>
          </div>

          {/* Empire List */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#C9A227',
              margin: '0 0 16px 0'
            }}>
              Active Empires
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(empires).map(([name, empire]) => {
                const data = getCurrentEmpireData(name);
                if (data.size === 0) return null;
                
                return (
                  <div
                    key={name}
                    onClick={() => setSelectedEmpire(selectedEmpire === name ? null : name)}
                    style={{
                      padding: '12px',
                      backgroundColor: selectedEmpire === name ? '#141419' : 'transparent',
                      border: `2px solid ${selectedEmpire === name ? empire.color : 'transparent'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: empire.color,
                        borderRadius: '50%'
                      }} />
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>{name}</span>
                    </div>
                    
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                      <div>Power: {data.power}% • Pop: {formatNumber(data.population)}</div>
                      <div style={{ color: getEraColor(empire.era) }}>{empire.type}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Map */}
        <div style={{ flex: 1 }}>
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #141419',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <svg
              width="100%"
              height="600"
              viewBox="0 0 1200 600"
              style={{ backgroundColor: '#141419', borderRadius: '12px' }}
            >
              {/* Background Grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6B7280" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
                
                {/* Glowing Effects */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                <filter id="influence-glow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Influence Spheres */}
              {showInfluence && influenceSpheres.map((sphere, i) => {
                const data = getCurrentEmpireData(sphere.empire);
                if (data.size === 0) return null;
                
                const empire = empires[sphere.empire as keyof typeof empires];
                const radius = (sphere.radius * data.power) / 100;
                
                return (
                  <circle
                    key={`influence-${i}`}
                    cx={sphere.x}
                    cy={sphere.y}
                    r={radius}
                    fill={empire.color}
                    opacity="0.08"
                    stroke={empire.color}
                    strokeWidth="2"
                    strokeOpacity="0.3"
                    filter="url(#influence-glow)"
                    style={{
                      transition: 'all 0.3s ease'
                    }}
                  />
                );
              })}

              {/* Trade Routes */}
              {showTrade && tradeRoutes.map((route, i) => (
                <g key={`trade-${i}`}>
                  <line
                    x1={route.from.x}
                    y1={route.from.y}
                    x2={route.to.x}
                    y2={route.to.y}
                    stroke="#C9A227"
                    strokeWidth="3"
                    strokeDasharray="8,4"
                    opacity="0.7"
                    filter="url(#glow)"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;24"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </line>
                  
                  <circle cx={route.from.x} cy={route.from.y} r="4" fill="#C9A227" opacity="0.8" />
                  <circle cx={route.to.x} cy={route.to.y} r="4" fill="#C9A227" opacity="0.8" />
                </g>
              ))}

              {/* Territories */}
              {Object.entries(territories).map(([name, territory]) => {
                const owner = getTerritoryOwner(name);
                const isHovered = hoveredTerritory === name;
                
                return (
                  <g key={name}>
                    <rect
                      x={territory.x}
                      y={territory.y}
                