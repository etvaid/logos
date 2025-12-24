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
      500: { size: 35, power: 45, territories: ['Francia', 'Ripuaria', 'Austrasia'], capital: 'Paris', population: 4000000, armies: 30000 },
      600: { size: 50, power: 65, territories: ['Francia', 'Ripuaria', 'Austrasia', 'Neustria', 'Burgundia'], capital: 'Paris', population: 5500000, armies: 45000 },
    }
  },
};

export default function EmpiresVisualization() {
  const [selectedYear, setSelectedYear] = useState(200);
  const [selectedEmpire, setSelectedEmpire] = useState('Roman Empire');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredTerritory, setHoveredTerritory] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState('3d');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setSelectedYear(prev => {
          const years = [100, 200, 300, 400, 500, 600];
          const currentIndex = years.indexOf(prev);
          return years[(currentIndex + 1) % years.length];
        });
      }, 2000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const years = [100, 200, 300, 400, 500, 600];
  
  const getActiveEmpires = (year) => {
    return Object.entries(empires).filter(([name, empire]) => 
      empire.periods[year]
    );
  };

  const getTerritoryEmpire = (territoryId, year) => {
    for (const [empireName, empire] of Object.entries(empires)) {
      if (empire.periods[year]?.territories.includes(territoryId)) {
        return { name: empireName, color: empire.color };
      }
    }
    return null;
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D0D0F 0%, #1E1E24 50%, #141419 100%)',
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        padding: '1rem 2rem',
        background: 'rgba(30, 30, 36, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#C9A227', fontSize: '1.5rem', fontWeight: 'bold' }}>
            ⚔️ LOGOS Empire Tracker
          </Link>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/words" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Words</Link>
            <Link href="/grammar" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Grammar</Link>
            <Link href="/history" style={{ color: '#C9A227', textDecoration: 'none' }}>History</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div style={{ padding: '2rem', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(201, 162, 39, 0.1) 0%, transparent 70%)',
          zIndex: 1
        }} />
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #C9A227, #F59E0B)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
          position: 'relative',
          zIndex: 2,
          textShadow: '0 4px 20px rgba(201, 162, 39, 0.3)'
        }}>
          🏛️ Ancient Empires Timeline
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#9CA3AF', position: 'relative', zIndex: 2 }}>
          Interactive 3D visualization of territorial control through the ages
        </p>
      </div>

      {/* Controls Panel */}
      <div style={{
        margin: '2rem',
        padding: '2rem',
        background: 'linear-gradient(145deg, #1E1E24, #141419)',
        borderRadius: '16px',
        border: '1px solid rgba(201, 162, 39, 0.2)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #C9A227, transparent)'
        }} />
        
        {/* Year Control */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#C9A227', fontSize: '1.3rem', fontWeight: '600' }}>⏰ Timeline Control</h3>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                padding: '0.75rem 1.5rem',
                background: isPlaying ? 'linear-gradient(135deg, #DC2626, #B91C1C)' : 'linear-gradient(135deg, #059669, #047857)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                transform: 'translateZ(0)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.05)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              }}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            background: 'rgba(13, 13, 15, 0.5)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid rgba(107, 114, 128, 0.2)'
          }}>
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: selectedYear === year 
                    ? 'linear-gradient(135deg, #C9A227, #F59E0B)' 
                    : 'rgba(107, 114, 128, 0.1)',
                  border: selectedYear === year 
                    ? '2px solid rgba(201, 162, 39, 0.5)' 
                    : '1px solid rgba(107, 114, 128, 0.3)',
                  borderRadius: '10px',
                  color: selectedYear === year ? '#0D0D0F' : '#F5F4F2',
                  fontWeight: selectedYear === year ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedYear === year 
                    ? '0 0 20px rgba(201, 162, 39, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.1)' 
                    : '0 2px 10px rgba(0, 0, 0, 0.1)',
                  transform: selectedYear === year ? 'scale(1.1)' : 'scale(1)',
                  zIndex: selectedYear === year ? 10 : 1
                }}
                onMouseEnter={(e) => {
                  if (selectedYear !== year) {
                    e.target.style.background = 'rgba(201, 162, 39, 0.2)';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 15px rgba(201, 162, 39, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedYear !== year) {
                    e.target.style.background = 'rgba(107, 114, 128, 0.1)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                  }
                }}
              >
                {year} CE
              </button>
            ))}
          </div>
        </div>

        {/* Empire Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#C9A227', fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>
            🏛️ Focus Empire
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {getActiveEmpires(selectedYear).map(([name, empire]) => (
              <button
                key={name}
                onClick={() => setSelectedEmpire(name)}
                style={{
                  padding: '0.75rem 1.25rem',
                  background: selectedEmpire === name 
                    ? `linear-gradient(135deg, ${empire.color}, ${empire.color}DD)` 
                    : 'rgba(30, 30, 36, 0.8)',
                  border: `2px solid ${selectedEmpire === name ? empire.color : 'rgba(107, 114, 128, 0.3)'}`,
                  borderRadius: '12px',
                  color: '#F5F4F2',
                  fontWeight: selectedEmpire === name ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedEmpire === name 
                    ? `0 0 25px ${empire.color}60` 
                    : '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transform: selectedEmpire === name ? 'translateY(-2px)' : 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  if (selectedEmpire !== name) {
                    e.target.style.borderColor = empire.color;
                    e.target.style.boxShadow = `0 0 15px ${empire.color}40`;
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedEmpire !== name) {
                    e.target.style.borderColor = 'rgba(107, 114, 128, 0.3)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div>
          <h3 style={{ color: '#C9A227', fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>
            👁️ Visualization Mode
          </h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['3d', 'flat', 'power'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: viewMode === mode 
                    ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)' 
                    : 'rgba(107, 114, 128, 0.1)',
                  border: viewMode === mode 
                    ? '2px solid #3B82F6' 
                    : '1px solid rgba(107, 114, 128, 0.3)',
                  borderRadius: '12px',
                  color: '#F5F4F2',
                  fontWeight: viewMode === mode ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'capitalize'
                }}
              >
                {mode === '3d' ? '🎮 3D View' : mode === 'flat' ? '🗺️ Map View' : '⚡ Power View'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Visualization */}
      <div style={{
        margin: '2rem',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Map Container */}
        <div style={{
          background: 'linear-gradient(145deg, #1E1E24, #141419)',
          borderRadius: '20px',
          border: '1px solid rgba(201, 162, 39, 0.2)',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #C9A227, transparent)',
            zIndex: 10
          }} />
          
          <div style={{
            padding: '1.5rem',
            background: 'rgba(13, 13, 15, 0.3)',
            borderBottom: '1px solid rgba(201, 162, 39, 0.2)'
          }}>
            <h3 style={{
              color: '#C9A227',
              fontSize: '1.4rem',
              fontWeight: '600',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              🌍 Ancient World - Year {selectedYear} CE
            </h3>
          </div>

          <div style={{
            position: 'relative',
            height: '600px',
            background: viewMode === '3d' 
              ? 'radial-gradient(ellipse at center, #1E1E24 0%, #0D0D0F 100%)' 
              : 'linear-gradient(180deg, #141419, #1E1E24)',
            overflow: 'hidden'
          }}
          onMouseMove={handleMouseMove}>
            
            {/* Background Grid */}
            <svg
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, opacity: 0.1 }}
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C9A227" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Territories Map */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 300"
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="shadow">
                  <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
                </filter>
              </defs>

              {Object.entries(territoryData).map(([id, territory]) => {
                const empireData = getTerritoryEmpire(id, selectedYear);
                const isSelected = empireData?.name === selectedEmpire;
                const scale = viewMode === '3d' ? (isSelected ? 1.3 : 1.0) : 1.0;
                const elevation = viewMode === '3d' ? (isSelected ? 8 : 4) : 0;
                
                return (
                  <g key={id}>
                    {/* Shadow for 3D effect */}
                    {viewMode === '3d' && (
                      <circle
                        cx={territory.x + 2}
                        cy={territory.y + 6}
                        r={8 * scale}
                        fill="rgba(0, 0, 0, 0.3)"
                        style={{ filter: 'blur(2px)' }}
                      />
                    )}
                    
                    {/* Territory Circle */}
                    <circle
                      cx={territory.x}
                      cy={territory.y - elevation}
                      r={8 * scale}
                      fill={empireData 
                        ? (viewMode === 'power' 
                          ? `url(#powerGradient-${empireData.name.replace(/\s+/g, '-')})`
                          : empireData.color)
                        : '#6B7280'
                      }
                      stroke={isSelected ? '#C9A227' : (empireData ? empireData.color : '#9CA3AF')}
                      strokeWidth={isSelected ? 3 : 1.5}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        filter: isSelected ? 'url(#glow)' : (empireData ? 'url(#shadow)' : 'none'),
                        opacity: hoveredTerritory === id ? 1 : (empireData ? 0.9 : 0