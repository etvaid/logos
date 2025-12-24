'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function TradeRoutes() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedGood, setSelectedGood] = useState(null);
  const [selectedEra, setSelectedEra] = useState('classical');
  const [viewMode, setViewMode] = useState('routes');
  const [hoveredCity, setHoveredCity] = useState(null);
  const [animatedRoutes, setAnimatedRoutes] = useState(new Set());
  const [pulsingCities, setPulsingCities] = useState(new Set());
  const svgRef = useRef(null);

  const eraColors = {
    archaic: '#D97706',
    classical: '#F59E0B',
    hellenistic: '#3B82F6',
    imperial: '#DC2626',
    'late-antique': '#7C3AED',
    byzantine: '#059669'
  };

  const routes = {
    archaic: [
      { id: 1, name: 'Via Pontica', start: { x: 200, y: 180 }, end: { x: 400, y: 160 }, type: 'maritime', goods: ['grain', 'wine', 'pottery'], description: 'Black Sea coastal route connecting Greek colonies', flow: 'high' },
      { id: 2, name: 'Phoenician Circuit', start: { x: 100, y: 240 }, end: { x: 300, y: 220 }, type: 'maritime', goods: ['purple', 'cedar', 'glass'], description: 'Western Mediterranean trade network', flow: 'medium' },
      { id: 3, name: 'Amber Path', start: { x: 280, y: 120 }, end: { x: 260, y: 240 }, type: 'overland', goods: ['amber', 'furs'], description: 'Early amber trade from northern Europe', flow: 'low' }
    ],
    classical: [
      { id: 4, name: 'Via Pontica', start: { x: 200, y: 180 }, end: { x: 400, y: 160 }, type: 'maritime', goods: ['grain', 'wine', 'pottery'], description: 'Expanded Black Sea trade under Athenian hegemony', flow: 'very-high' },
      { id: 5, name: 'Amber Road', start: { x: 300, y: 120 }, end: { x: 280, y: 280 }, type: 'overland', goods: ['amber', 'furs', 'metals'], description: 'Overland route from Baltic to Mediterranean', flow: 'high' },
      { id: 6, name: 'Trans-Alpine', start: { x: 250, y: 200 }, end: { x: 300, y: 160 }, type: 'overland', goods: ['metals', 'salt', 'wool'], description: 'Alpine passes connecting Gaul and Italy', flow: 'medium' },
      { id: 7, name: 'Aegean Network', start: { x: 320, y: 200 }, end: { x: 360, y: 220 }, type: 'maritime', goods: ['wine', 'pottery', 'oil'], description: 'Island-hopping trade in the Aegean', flow: 'high' }
    ],
    hellenistic: [
      { id: 8, name: 'Alexandria-Rhodes', start: { x: 380, y: 300 }, end: { x: 360, y: 220 }, type: 'maritime', goods: ['papyrus', 'grain', 'glass'], description: 'Ptolemaic trade axis', flow: 'very-high' },
      { id: 9, name: 'Bactrian Route', start: { x: 520, y: 160 }, end: { x: 580, y: 140 }, type: 'overland', goods: ['silk', 'horses', 'gems'], description: 'Silk Road through Greek Bactria', flow: 'high' },
      { id: 10, name: 'Red Sea Route', start: { x: 420, y: 320 }, end: { x: 480, y: 280 }, type: 'maritime', goods: ['incense', 'spices', 'ivory'], description: 'Indian Ocean trade via Ptolemaic ports', flow: 'high' },
      { id: 11, name: 'Seleucid Axis', start: { x: 400, y: 240 }, end: { x: 500, y: 200 }, type: 'overland', goods: ['spices', 'silk', 'gems'], description: 'Mesopotamian trade corridor', flow: 'medium' }
    ],
    imperial: [
      { id: 12, name: 'Via Maris', start: { x: 400, y: 280 }, end: { x: 500, y: 240 }, type: 'overland', goods: ['spices', 'incense', 'textiles'], description: 'Roman control of Eastern trade routes', flow: 'high' },
      { id: 13, name: 'Roman Egyptian Route', start: { x: 380, y: 300 }, end: { x: 200, y: 180 }, type: 'maritime', goods: ['grain', 'papyrus', 'glass'], description: 'Vital supply lines from Egypt to Rome', flow: 'very-high' },
      { id: 14, name: 'Via Appia', start: { x: 240, y: 260 }, end: { x: 280, y: 200 }, type: 'overland', goods: ['wine', 'oil', 'metals'], description: 'Roman road connecting Rome to southern Italy', flow: 'high' }
    ]
  };

  const cities = [
    { name: 'Athens', greekName: 'Ἀθῆναι', x: 340, y: 220, type: 'polis', era: ['archaic', 'classical'], goods: ['pottery', 'oil', 'wine'], importance: 'major' },
    { name: 'Alexandria', greekName: 'Ἀλεξάνδρεια', x: 380, y: 300, type: 'metropolis', era: ['hellenistic', 'imperial'], goods: ['papyrus', 'grain', 'glass'], importance: 'major' },
    { name: 'Rhodes', greekName: 'Ῥόδος', x: 360, y: 220, type: 'emporium', era: ['classical', 'hellenistic'], goods: ['wine', 'pottery'], importance: 'major' },
    { name: 'Byzantion', greekName: 'Βυζάντιον', x: 350, y: 180, type: 'polis', era: ['archaic', 'classical', 'hellenistic'], goods: ['grain', 'fish'], importance: 'medium' },
    { name: 'Ephesus', greekName: 'Ἔφεσος', x: 330, y: 200, type: 'polis', era: ['archaic', 'classical', 'hellenistic'], goods: ['textiles', 'marble'], importance: 'medium' },
    { name: 'Antioch', greekName: 'Ἀντιόχεια', x: 400, y: 240, type: 'metropolis', era: ['hellenistic', 'imperial'], goods: ['spices', 'silk'], importance: 'major' },
    { name: 'Tanais', greekName: 'Τάναϊς', x: 420, y: 140, type: 'emporium', era: ['classical', 'hellenistic'], goods: ['grain', 'furs'], importance: 'medium' },
    { name: 'Cyrene', greekName: 'Κυρήνη', x: 320, y: 320, type: 'polis', era: ['archaic', 'classical', 'hellenistic'], goods: ['silphium', 'horses'], importance: 'medium' },
    { name: 'Marseilles', greekName: 'Μασσαλία', x: 220, y: 220, type: 'apoikia', era: ['archaic', 'classical'], goods: ['wine', 'metals'], importance: 'medium' },
    { name: 'Chersonesos', greekName: 'Χερσόνησος', x: 380, y: 140, type: 'apoikia', era: ['classical', 'hellenistic'], goods: ['grain', 'wine'], importance: 'minor' },
    { name: 'Bactria', greekName: 'Βακτρία', x: 550, y: 150, type: 'metropolis', era: ['hellenistic'], goods: ['silk', 'gems'], importance: 'major' },
    { name: 'Seleucia', greekName: 'Σελεύκεια', x: 480, y: 210, type: 'metropolis', era: ['hellenistic'], goods: ['spices', 'textiles'], importance: 'major' },
    { name: 'Rome', latinName: 'Roma', x: 240, y: 260, type: 'metropolis', era: ['imperial'], goods: ['wine', 'oil', 'metals'], importance: 'major' }
  ];

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
    setAnimatedRoutes(new Set([route.id]));
    setTimeout(() => setAnimatedRoutes(new Set()), 500);
  };

  const handleCityHover = (city) => {
    setHoveredCity(city);
    setPulsingCities(new Set([city.name]));
  };

  const handleCityLeave = () => {
    setHoveredCity(null);
    setPulsingCities(new Set());
  };

  const filteredRoutes = routes[selectedEra] || [];
  const eraColor = eraColors[selectedEra] || '#FFFFFF';

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', transition: 'background-color 0.3s, color 0.3s' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#C9A227', textShadow: '1px 1px 2px #000' }}>Ancient Trade Routes</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={() => setSelectedEra('archaic')} style={{ backgroundColor: selectedEra === 'archaic' ? eraColors.archaic : '#1E1E24', color: '#F5F4F2', padding: '10px 20px', margin: '0 5px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s, color 0.3s' }}>Archaic (800-500 BCE)</button>
        <button onClick={() => setSelectedEra('classical')} style={{ backgroundColor: selectedEra === 'classical' ? eraColors.classical : '#1E1E24', color: '#F5F4F2', padding: '10px 20px', margin: '0 5px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s, color 0.3s' }}>Classical (500-323 BCE)</button>
        <button onClick={() => setSelectedEra('hellenistic')} style={{ backgroundColor: selectedEra === 'hellenistic' ? eraColors.hellenistic : '#1E1E24', color: '#F5F4F2', padding: '10px 20px', margin: '0 5px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s, color 0.3s' }}>Hellenistic (323-31 BCE)</button>
        <button onClick={() => setSelectedEra('imperial')} style={{ backgroundColor: selectedEra === 'imperial' ? eraColors.imperial : '#1E1E24', color: '#F5F4F2', padding: '10px 20px', margin: '0 5px', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s, color 0.3s' }}>Imperial (31 BCE-284 CE)</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', width: '90%', maxWidth: '1200px' }}>

        {/* SVG Map */}
        <div style={{ flex: '2', backgroundColor: '#1E1E24', borderRadius: '10px', padding: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
          <svg ref={svgRef} width="100%" height="600" style={{ display: 'block' }}>
            <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: eraColor, stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor: eraColor, stopOpacity:0.2}} />
                </linearGradient>
            </defs>

            {/* Map Background (Simple Rectangle) */}
            <rect width="100%" height="100%" fill="#141419" />

            {filteredRoutes.map(route => (
              <line
                key={route.id}
                x1={route.start.x}
                y1={route.start.y}
                x2={route.end.x}
                y2={route.end.y}
                stroke={animatedRoutes.has(route.id) ? 'url(#routeGradient)' : eraColor}
                strokeWidth="3"
                style={{ transition: 'stroke 0.3s', cursor: 'pointer' }}
                onClick={() => handleRouteClick(route)}
              />
            ))}

            {cities.filter(city => city.era.includes(selectedEra)).map(city => (
              <g key={city.name} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={() => handleCityHover(city)} onMouseLeave={handleCityLeave}>
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={city.importance === 'major' ? 8 : 6}
                  fill={eraColor}
                  style={{ opacity: pulsingCities.has(city.name) ? 0.8 : 0.6, transition: 'opacity 0.3s, transform 0.3s', transformOrigin: 'center', animation: pulsingCities.has(city.name) ? 'pulse 1.5s infinite' : 'none' }}
                />
                <text
                  x={city.x}
                  y={city.y - 10}
                  textAnchor="middle"
                  fontSize="0.8rem"
                  fill="#9CA3AF"
                >
                  {city.greekName ? city.greekName + ' Α' : (city.latinName ? city.latinName + ' L' : city.name)}
                </text>
              </g>
            ))}

             {/* Animated Ship (Example - can be improved with more complex pathing) */}
             {selectedRoute && animatedRoutes.has(selectedRoute.id) && (
                <image
                  href="/ship.svg"  // Replace with your ship SVG path
                  x={selectedRoute.start.x}
                  y={selectedRoute.start.y}
                  height="20"
                  width="20"
                  style={{
                    animation: `moveShip ${2}s linear forwards`,
                    transformOrigin: 'center',
                    rotate: '45deg',
                  }}
                />
              )}
          </svg>

            {/* Keyframes for Ship Animation */}
            <style jsx>{`
                @keyframes moveShip {
                    0% {
                        transform: translate(${selectedRoute?.start.x}px, ${selectedRoute?.start.y}px) rotate(45deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(${selectedRoute?.end.x}px, ${selectedRoute?.end.y}px) rotate(45deg);
                        opacity: 1;
                    }
                }
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.2);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `}</style>

        </div>

        {/* Route/City Details */}
        <div style={{ flex: '1', backgroundColor: '#1E1E24', borderRadius: '10px', padding: '20px', marginLeft: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px', color: '#F5F4F2' }}>
            {selectedRoute ? 'Route Details' : (hoveredCity ? 'City Details' : 'Select a Route or Hover over a City')}
          </h2>

          {selectedRoute && (
            <>
              <h3 style={{ fontSize: '1.2rem', color: '#C9A227', marginBottom: '5px' }}>{selectedRoute.name}</h3>
              <p style={{ color: '#9CA3AF', marginBottom: '10px' }}>{selectedRoute.description}</p>
              <p style={{ color: '#9CA3AF' }}><strong>Goods Traded:</strong> {selectedRoute.goods.join(', ')}</p>
              <p style={{ color: '#9CA3AF' }}><strong>Type:</strong> {selectedRoute.type}</p>
              <p style={{ color: '#9CA3AF' }}><strong>Flow:</strong> {selectedRoute.flow}</p>
            </>
          )}

          {hoveredCity && (
            <>
              <h3 style={{ fontSize: '1.2rem', color: '#C9A227', marginBottom: '5px' }}>{hoveredCity.name}</h3>
              {hoveredCity.greekName && <p style={{ color: '#9CA3AF' }}>Greek: {hoveredCity.greekName}</p>}
              {hoveredCity.latinName && <p style={{ color: '#9CA3AF' }}>Latin: {hoveredCity.latinName}</p>}
              <p style={{ color: '#9CA3AF', marginBottom: '10px' }}><strong>Type:</strong> {hoveredCity.type}</p>
              <p style={{ color: '#9CA3AF' }}><strong>Goods:</strong> {hoveredCity.goods.join(', ')}</p>
              <p style={{ color: '#9CA3AF' }}><strong>Importance:</strong> {hoveredCity.importance}</p>
            </>
          )}
        </div>
      </div>

      <footer style={{ marginTop: '30px', color: '#6B7280', textAlign: 'center' }}>
        <p>Logos Professional Design System</p>
      </footer>
    </div>
  );
}