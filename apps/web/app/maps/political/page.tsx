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
      500: { size: 30, power: 40, territories: ['Francia', 'Francia_Minor', 'Neustria', 'Austrasia'], capital: 'Paris', population: 4000000, armies: 25000 },
      600: { size: 40, power: 50, territories: ['Francia', 'Francia_Minor', 'Neustria', 'Austrasia', 'Burgundia'], capital: 'Paris', population: 5000000, armies: 30000 },
    }
  },
};

const initialYear = 100;

const EmpiresPage = () => {
  const [selectedEmpire, setSelectedEmpire] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [hoveredTerritory, setHoveredTerritory] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        setSvgDimensions({
          width: svgRef.current.clientWidth,
          height: svgRef.current.clientHeight,
        });
      }
    };

    handleResize(); // Initial dimensions
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEmpireClick = (empireName: string) => {
    setSelectedEmpire(empireName);
    setSelectedYear(initialYear); // Reset year when selecting a new empire
    //Automatically pan and zoom onto empire's territory
  };

  const handleTerritoryHover = (territoryName: string | null) => {
    setHoveredTerritory(territoryName);
  };

  const currentEmpireData = selectedEmpire ? empires[selectedEmpire] : null;
  const currentPeriodData = currentEmpireData?.periods[selectedYear] || null;

  // Function to check if a territory belongs to the currently selected empire at the selected year
  const isTerritoryControlled = (territoryName: string) => {
    if (!currentPeriodData) return false;
    return currentPeriodData.territories.includes(territoryName);
  };

  const getTerritoryColor = (territoryName: string) => {
    if (isTerritoryControlled(territoryName)) {
      return currentEmpireData?.color || '#FFFFFF'; // Empire's color
    } else {
      return '#1E1E24'; // Default card background color
    }
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', marginBottom: '20px', color: '#C9A227' }}>Logos Professional Design System - Empires</h1>

      <div style={{ display: 'flex', width: '90%', maxWidth: '1200px', gap: '20px' }}>

        {/* Empire Selection Sidebar */}
        <div style={{ flex: '0 0 250px', backgroundColor: '#1E1E24', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', overflow: 'auto' }}>
          <h2 style={{ fontSize: '1.5em', marginBottom: '10px', color: '#F5F4F2' }}>Empires</h2>
          {Object.entries(empires).map(([empireName, empireData]) => (
            <div
              key={empireName}
              style={{
                padding: '10px',
                marginBottom: '8px',
                borderRadius: '6px',
                backgroundColor: selectedEmpire === empireName ? empireData.color : '#141419',
                color: '#F5F4F2',
                cursor: 'pointer',
                transition: 'background-color 0.3s, color 0.3s',
                border: `2px solid ${selectedEmpire === empireName ? '#C9A227' : 'transparent'}`,
              }}
              onClick={() => handleEmpireClick(empireName)}
            >
              {empireName}
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Map Visualization */}
          <div style={{ backgroundColor: '#1E1E24', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', overflow: 'hidden' }}>
            <svg width="100%" height="600" ref={svgRef} style={{ transition: 'background-color 0.3s' }}>
              {Object.entries(territoryData).map(([territoryName, territory]) => (
                <circle
                  key={territoryName}
                  cx={territory.x * (svgDimensions.width / 350)}
                  cy={territory.y * (svgDimensions.height / 300)}
                  r="8"
                  fill={getTerritoryColor(territoryName)}
                  stroke={hoveredTerritory === territoryName ? '#C9A227' : '#6B7280'}
                  strokeWidth={hoveredTerritory === territoryName ? 3 : 1}
                  style={{ transition: 'fill 0.3s, stroke 0.3s', cursor: 'pointer' }}
                  onMouseEnter={() => handleTerritoryHover(territoryName)}
                  onMouseLeave={() => handleTerritoryHover(null)}
                  title={territoryName}
                />
              ))}
            </svg>
          </div>

          {/* Empire Details */}
          {selectedEmpire && (
            <div style={{ backgroundColor: '#1E1E24', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
              <h2 style={{ fontSize: '1.8em', color: currentEmpireData.color, marginBottom: '10px' }}>{selectedEmpire}</h2>
              <p style={{ color: '#9CA3AF' }}>Era: {currentEmpireData.era}</p>
              <p style={{ color: '#9CA3AF' }}>Type: {currentEmpireData.type}</p>

              {/* Year Slider */}
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                <label htmlFor="year" style={{ marginRight: '10px', color: '#F5F4F2' }}>Year:</label>
                <input
                  type="range"
                  id="year"
                  min="100"
                  max="600"
                  step="100"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  style={{ width: '70%', cursor: 'pointer', transition: 'background-color 0.3s' }}
                />
                <span style={{ marginLeft: '10px', color: '#F5F4F2' }}>{selectedYear}</span>
              </div>

              {currentPeriodData ? (
                <>
                  <p style={{ color: '#9CA3AF' }}>Size: {currentPeriodData.size}</p>
                  <p style={{ color: '#9CA3AF' }}>Power: {currentPeriodData.power}</p>
                  <p style={{ color: '#9CA3AF' }}>Capital: {currentPeriodData.capital}</p>
                  <p style={{ color: '#9CA3AF' }}>Population: {currentPeriodData.population}</p>
                  {currentPeriodData.legions && <p style={{ color: '#9CA3AF' }}>Legions: {currentPeriodData.legions}</p>}
                  {currentPeriodData.armies && <p style={{ color: '#9CA3AF' }}>Armies: {currentPeriodData.armies}</p>}
                  <h3 style={{ marginTop: '15px', color: '#F5F4F2' }}>Territories:</h3>
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {currentPeriodData.territories.map((territory) => (
                      <li key={territory} style={{ color: '#9CA3AF' }}>{territory}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p style={{ color: '#6B7280' }}>No data available for this year.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <footer style={{ marginTop: '20px', color: '#9CA3AF', textAlign: 'center' }}>
        &copy; 2024 Logos Professional Design System
      </footer>
    </div>
  );
};

export default EmpiresPage;