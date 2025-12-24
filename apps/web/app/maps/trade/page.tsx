'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function TradeRoutes() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedGood, setSelectedGood] = useState(null);
  const [selectedEra, setSelectedEra] = useState('classical');
  const [viewMode, setViewMode] = useState('routes');
  const [hoveredCity, setHoveredCity] = useState(null);

  const routes = {
    archaic: [
      { id: 1, name: 'Via Pontica', start: { x: 200, y: 180 }, end: { x: 400, y: 160 }, type: 'maritime', goods: ['grain', 'wine', 'pottery'], description: 'Black Sea coastal route connecting Greek colonies' },
      { id: 2, name: 'Phoenician Circuit', start: { x: 100, y: 240 }, end: { x: 300, y: 220 }, type: 'maritime', goods: ['purple', 'cedar', 'glass'], description: 'Western Mediterranean trade network' }
    ],
    classical: [
      { id: 3, name: 'Via Pontica', start: { x: 200, y: 180 }, end: { x: 400, y: 160 }, type: 'maritime', goods: ['grain', 'wine', 'pottery'], description: 'Expanded Black Sea trade under Athenian hegemony' },
      { id: 4, name: 'Amber Road', start: { x: 300, y: 120 }, end: { x: 280, y: 280 }, type: 'overland', goods: ['amber', 'furs', 'metals'], description: 'Overland route from Baltic to Mediterranean' },
      { id: 5, name: 'Trans-Alpine', start: { x: 250, y: 200 }, end: { x: 300, y: 160 }, type: 'overland', goods: ['metals', 'salt', 'wool'], description: 'Alpine passes connecting Gaul and Italy' },
      { id: 6, name: 'Aegean Network', start: { x: 320, y: 200 }, end: { x: 360, y: 220 }, type: 'maritime', goods: ['wine', 'pottery', 'oil'], description: 'Island-hopping trade in the Aegean' }
    ],
    hellenistic: [
      { id: 7, name: 'Alexandria-Rhodes', start: { x: 380, y: 300 }, end: { x: 360, y: 220 }, type: 'maritime', goods: ['papyrus', 'grain', 'glass'], description: 'Ptolemaic trade axis' },
      { id: 8, name: 'Bactrian Route', start: { x: 520, y: 160 }, end: { x: 580, y: 140 }, type: 'overland', goods: ['silk', 'horses', 'gems'], description: 'Silk Road through Greek Bactria' },
      { id: 9, name: 'Red Sea Route', start: { x: 420, y: 320 }, end: { x: 480, y: 280 }, type: 'maritime', goods: ['incense', 'spices', 'ivory'], description: 'Indian Ocean trade via Ptolemaic ports' },
      { id: 10, name: 'Seleucid Axis', start: { x: 400, y: 240 }, end: { x: 500, y: 200 }, type: 'overland', goods: ['spices', 'silk', 'gems'], description: 'Mesopotamian trade corridor' }
    ]
  };

  const cities = [
    { name: 'Athens', greekName: 'Ἀθῆναι', x: 340, y: 220, type: 'polis', era: ['archaic', 'classical'], goods: ['pottery', 'oil', 'wine'] },
    { name: 'Alexandria', greekName: 'Ἀλεξάνδρεια', x: 380, y: 300, type: 'metropolis', era: ['hellenistic'], goods: ['papyrus', 'grain', 'glass'] },
    { name: 'Rhodes', greekName: 'Ῥόδος', x: 360, y: 220, type: 'emporium', era: ['classical', 'hellenistic'], goods: ['wine', 'pottery'] },
    { name: 'Byzantion', greekName: 'Βυζάντιον', x: 350, y: 180, type: 'polis', era: ['archaic', 'classical'], goods: ['grain', 'fish'] },
    { name: 'Ephesus', greekName: 'Ἔφεσος', x: 330, y: 200, type: 'polis', era: ['archaic', 'classical'], goods: ['textiles', 'marble'] },
    { name: 'Antioch', greekName: 'Ἀντιόχεια', x: 400, y: 240, type: 'metropolis', era: ['hellenistic'], goods: ['spices', 'silk'] },
    { name: 'Tanais', greekName: 'Τάναϊς', x: 420, y: 140, type: 'emporium', era: ['classical', 'hellenistic'], goods: ['grain', 'furs'] },
    { name: 'Cyrene', greekName: 'Κυρήνη', x: 320, y: 320, type: 'polis', era: ['archaic', 'classical'], goods: ['silphium', 'horses'] },
    { name: 'Marseilles', greekName: 'Μασσαλία', x: 220, y: 220, type: 'apoikia', era: ['archaic', 'classical'], goods: ['wine', 'metals'] },
    { name: 'Chersonesos', greekName: 'Χερσόνησος', x: 380, y: 140, type: 'apoikia', era: ['classical', 'hellenistic'], goods: ['grain', 'wine'] }
  ];

  const goods = {
    grain: { 
      name: 'Grain', 
      greek: 'σῖτος', 
      latin: 'frumentum',
      color: '#F59E0B', 
      regions: ['Chersonesos', 'Egypt', 'Sicily'],
      description: 'Essential staple food, basis of ancient economy'
    },
    wine: { 
      name: 'Wine', 
      greek: 'οἶνος', 
      latin: 'vinum',
      color: '#DC2626', 
      regions: ['Lesbos', 'Chios', 'Thasos'],
      description: 'Premium export, social and religious significance'
    },
    pottery: { 
      name: 'Pottery', 
      greek: 'κεραμεία', 
      latin: 'fictilia',
      color: '#D97706', 
      regions: ['Attica', 'Corinth', 'Samos'],
      description: 'Utilitarian and luxury ceramics, artistic export'
    },
    amber: { 
      name: 'Amber', 
      greek: 'ἤλεκτρον', 
      latin: 'electrum',
      color: '#F59E0B', 
      regions: ['Baltic', 'North Sea'],
      description: 'Fossilized resin, jewelry and amulets'
    },
    silk: { 
      name: 'Silk', 
      greek: 'σηρικόν', 
      latin: 'sericum',
      color: '#7C3AED', 
      regions: ['Seres', 'Bactria'],
      description: 'Luxury textile from distant China'
    },
    spices: { 
      name: 'Spices', 
      greek: 'ἀρώματα', 
      latin: 'aromata',
      color: '#059669', 
      regions: ['Arabia', 'India'],
      description: 'Aromatic substances for cuisine and medicine'
    },
    metals: { 
      name: 'Metals', 
      greek: 'μέταλλα', 
      latin: 'metalla',
      color: '#6B7280', 
      regions: ['Iberia', 'Scythia', 'Cyprus'],
      description: 'Raw materials for tools, weapons, and currency'
    },
    purple: { 
      name: 'Purple', 
      greek: 'πορφύρα', 
      latin: 'purpura',
      color: '#7C3AED', 
      regions: ['Tyre', 'Sidon'],
      description: 'Royal dye from murex shells'
    },
    incense: { 
      name: 'Incense', 
      greek: 'λίβανος', 
      latin: 'tus',
      color: '#059669', 
      regions: ['Arabia Felix'],
      description: 'Frankincense for religious ceremonies'
    },
    ivory: { 
      name: 'Ivory', 
      greek: 'ἐλέφας', 
      latin: 'ebur',
      color: '#F5F4F2', 
      regions: ['Ethiopia', 'India'],
      description: 'Luxury material for sculptures and inlays'
    },
    oil: {
      name: 'Olive Oil',
      greek: 'ἔλαιον',
      latin: 'oleum',
      color: '#059669',
      regions: ['Attica', 'Crete'],
      description: 'Essential for cooking, lighting, and athletics'
    },
    papyrus: {
      name: 'Papyrus',
      greek: 'πάπυρος',
      latin: 'papyrus',
      color: '#F59E0B',
      regions: ['Egypt'],
      description: 'Writing material, Egyptian monopoly'
    }
  };

  const eras = {
    archaic: { name: 'Archaic', color: '#D97706', period: '800-500 BCE' },
    classical: { name: 'Classical', color: '#F59E0B', period: '500-323 BCE' },
    hellenistic: { name: 'Hellenistic', color: '#3B82F6', period: '323-31 BCE' }
  };

  const renderRoute = (route) => {
    const isSelected = selectedRoute === route.id;
    const strokeWidth = isSelected ? 4 : 2;
    const opacity = selectedRoute && !isSelected ? 0.3 : 1;
    const color = route.type === 'maritime' ? '#3B82F6' : '#059669';

    return (
      <g key={route.id} style={{ opacity, transition: 'all 0.25s ease' }}>
        <line
          x1={route.start.x}
          y1={route.start.y}
          x2={route.end.x}
          y2={route.end.y}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={route.type === 'maritime' ? '5,5' : 'none'}
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedRoute(isSelected ? null : route.id)}
        />
        <circle
          cx={route.start.x}
          cy={route.start.y}
          r={4}
          fill={color}
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedRoute(isSelected ? null : route.id)}
        />
        <circle
          cx={route.end.x}
          cy={route.end.y}
          r={4}
          fill={color}
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedRoute(isSelected ? null : route.id)}
        />
        {isSelected && (
          <text
            x={(route.start.x + route.end.x) / 2}
            y={(route.start.y + route.end.y) / 2 - 10}
            fill="#F5F4F2"
            fontSize="12"
            textAnchor="middle"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {route.name}
          </text>
        )}
      </g>
    );
  };

  const renderCity = (city) => {
    const isActive = city.era.includes(selectedEra);
    const isHovered = hoveredCity === city.name;
    const opacity = isActive ? 1 : 0.3;
    const radius = isHovered ? 8 : 6;
    
    const typeColors = {
      polis: '#F59E0B',
      metropolis: '#DC2626',
      emporium: '#3B82F6',
      apoikia: '#059669'
    };

    return (
      <g key={city.name} style={{ opacity, transition: 'all 0.2s ease' }}>
        <circle
          cx={city.x}
          cy={city.y}
          r={radius}
          fill={typeColors[city.type]}
          stroke="#F5F4F2"
          strokeWidth="1"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredCity(city.name)}
          onMouseLeave={() => setHoveredCity(null)}
        />
        {(isHovered || isActive) && (
          <>
            <text
              x={city.x}
              y={city.y - 15}
              fill="#F5F4F2"
              fontSize="11"
              textAnchor="middle"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 'bold' }}
            >
              {city.name}
            </text>
            <text
              x={city.x}
              y={city.y + 25}
              fill="#9CA3AF"
              fontSize="10"
              textAnchor="middle"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {city.greekName}
            </text>
          </>
        )}
      </g>
    );
  };

  const currentRoutes = routes[selectedEra] || [];
  const selectedRouteData = currentRoutes.find(r => r.id === selectedRoute);

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1E1E24', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0', color: '#F5F4F2' }}>
                Trade Routes
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#9CA3AF', margin: '0.5rem 0 0 0' }}>
                Ancient Mediterranean Commercial Networks
              </p>
            </div>
            <Link href="/maps" style={{ 
              color: '#C9A227', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              border: '1px solid #C9A227',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}>
              ← Back to Maps
            </Link>
          </div>

          {/* Era Controls */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {Object.entries(eras).map(([key, era]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedEra(key);
                  setSelectedRoute(null);
                }}
                style={{
                  backgroundColor: selectedEra === key ? era.color : 'transparent',
                  color: selectedEra === key ? '#0D0D0F' : era.color,
                  border: `1px solid ${era.color}`,
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Georgia, serif'
                }}
              >
                {era.name} ({era.period})
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={() => setViewMode('routes')}
              style={{
                backgroundColor: viewMode === 'routes' ? '#C9A227' : 'transparent',
                color: viewMode === 'routes' ? '#0D0D0F' : '#C9A227',
                border: '1px solid #C9A227',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Georgia, serif'
              }}
            >
              Trade Routes
            </button>
            <button
              onClick={() => setViewMode('goods')}
              style={{
                backgroundColor: viewMode === 'goods' ? '#C9A227' : 'transparent',
                color: viewMode === 'goods' ? '#0D0D0F' : '#C9A227',
                border: '1px solid #C9A227',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Georgia, serif'
              }}
            >
              Trade Goods
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
          {/* Main Map */}
          <div style={{ backgroundColor: '#1E1E24', borderRadius: '8px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#F5F4F2' }}>
              Mediterranean Trade Network - {eras[selectedEra].name} Period
            </h2>
            
            <svg viewBox="0 0 700 400" style={{ width: '100%', height: '400px', backgroundColor: '#141419', borderRadius: '4px' }}>
              {/* Mediterranean Sea */}
              <rect x="0" y="0" width="700" height="400" fill="#0D1B2A" />
              
              {/* Land masses (simplified) */}
              <path d="M0,0 L700,0 L700,120 Q600,100 500,120 Q400,140 300,120 Q200,100 100,120 L0,140 Z" fill="#2D3748" />
              <path d="M0,350 L100,330 Q200,310 300,330 Q400,350 500,340 Q600,330 700,350 L700,400 L0,400 Z" fill="#2D3748" />
              <ellipse cx="180" cy="180" rx="80" ry="40" fill="#2D3748" />
              <ellipse cx="520" cy="220" rx="60" ry="30" fill="#2D3748" />

              {/* Routes */}
              {currentRoutes.map(route => renderRoute(route))}
              
              {/* Cities */}
              {cities
                .filter(city => city.era.includes(selectedEra))
                .map(city => renderCity(city))
              }
              
              {/* Legend */}
              <g transform="translate(20, 20)">
                <rect x="0" y="0" width="150" height="80" fill="#0D0D0F" fillOpacity="0.8" rx="4" />
                <text x="10" y="20" fill="#F5F4F2" fontSize="12" fontWeight="bold">Legend</text>
                <line x1="10" y1="30" x2="25" y2="30" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" />
                <text x="30" y="35" fill="#F5F4F2" fontSize="10">Maritime</text>
                <line x1="10" y1="45" x2="25" y2="45" stroke="#059669" strokeWidth="2" />
                <text x="30" y="50" fill="#F5F4F2" fontSize="10">Overland</text>
                <circle cx="17" cy="60" r="3" fill="#F59E0B" />
                <text x="30" y="65" fill="#F5F4F2" fontSize="10">Polis</text>
              </g>
            </svg>

            {/* Route Info */}
            {selectedRouteData && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: '#141419', 
                borderRadius: '4px',
                border: `2px solid ${selectedRouteData.type === 'maritime' ? '#3B82F6' : '#059669'}`
              }}>
                <h3 style={{ color: '#F5F4F2', margin: '0 0 0.5rem 0' }}>
                  {selectedRouteData.name}
                </h3>
                <p style={{ color: '#9CA3AF', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                  {selectedRouteData.description}
                </p>
                <p style={{ color: '#9CA3AF', margin: '0', fontSize: '0.9rem' }}>
                  <strong>Type:</strong> {selectedRouteData.type === 'maritime' ? 'Maritime (ναυτικός)' : 'Overland (χερσαῖος)'}
                </p>
                <div style={{ marginTop: '0.5rem' }}>
                  <strong style={{ color: '#F5F4F2' }}>Primary Goods:</strong>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {selectedRouteData.goods.map(goodKey => (
                      <span
                        key={goodKey}
                        style={{
                          backgroundColor: goods[goodKey]?.color,
                          color: '#0D0D0F',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {goods[goodKey]?.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Routes List */}
            {viewMode === 'routes' && (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#F5F4F2' }}>
                  Trade Routes
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentRoutes.map(route => (
                    <div
                      key={route.id}
                      onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: selectedRoute === route.id ? '#141419' : 'transparent',
                        border: `1px solid ${selectedRoute === route.id ? (route.type === 'maritime' ? '#3B82F6' : '#059669') : '#2D3748'}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div
                          style={{
                            width: '12px',
                            height: '2px',
                            backgroundColor: route.type === 'maritime' ? '#3B82F6' : '#059669',
                            borderRadius: '1px'
                          }}
                        />
                        <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>
                          {route.name}
                        </span>
                      </div>
                      <p style={{ 
                        fontSize: '0.8rem', 
                        color: '#9CA3AF', 
                        margin: '0',
                        lineHeight: '1.3'
                      }}>
                        {route.description}
                      </p>
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {route.goods.map(goodKey => (
                          <span
                            key={goodKey}
                            style={{
                              fontSize: '0.7rem',
                              backgroundColor: goods[goodKey]?.color,
                              color: '#0D0D0F',
                              padding: '0.125rem 0.25rem',
                              borderRadius: '8px',
                              fontWeight: 'bold'
                            }}
                          >
                            {goods[goodKey]?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Goods Encyclopedia */}
            {viewMode === 'goods' && (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#F5F4F2' }}>
                  Trade Goods Lexicon
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                  {Object.entries(goods).map(([key, good]) => (
                    <div
                      key={key}
                      onClick={() => setSelectedGood(selectedGood === key ? null : key)}
                      style={{
                        padding: '1rem',
                        backgroundColor: selectedGood === key ? '#141419' : 'transparent',
                        border: `1px solid ${selectedGood === key ? good.color : '#2D3748'}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: good.color,
                            borderRadius: '50%'
                          }}
                        />
                        <span style={{ fontWeight: 'bold', color: '#F5F4F2' }}>
                          {good.name}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '0.9rem', color: '#3B82F6', marginBottom: '0.25rem' }}>
                        <span style={{ 
                          backgroundColor: '#3B82F6', 
                          color: '#F5F4F2', 
                          padding: '0.125rem 0.25rem', 
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          marginRight: '0.25rem'
                        }}>Α</span>
                        {good.greek}
                      </div>
                      
                      <div style={{ fontSize: '0.9rem', color: '#DC2626', marginBottom: '0.5rem' }}>
                        <span style={{ 
                          backgroundColor: '#DC2626', 
                          color: '#F5F4F2', 
                          padding: '0.125rem 0.25rem', 
                          borderRadius: '3px',
                          fontSize: '0.7rem',
                          marginRight: '0.25rem'
                        }}>L</span>
                        {good.latin}
                      </div>

                      {selectedGood === key && (
                        <>
                          <p style={{ 
                            fontSize: '0.85rem', 
                            color: '#9CA3AF', 
                            margin: '0 0 0.5rem 0',
                            lineHeight: '1.4'
                          }}>
                            {good.description}
                          </p>
                          <div>
                            <strong style={{ color: '#F5F4F2', fontSize: '0.8rem' }}>
                              Primary Sources:
                            </strong>
                            <div style={{ 
                              display: 'flex', 
                              gap: '0.25rem', 
                              marginTop: '0.25rem',
                              flexWrap: 'wrap'
                            }}>
                              {good.regions.map(region => (
                                <span
                                  key={region}
                                  style={{
                                    fontSize: '0.7rem',
                                    backgroundColor: '#2D3748',
                                    color: '#9CA3AF',
                                    padding: '0.125rem 0.375rem',
                                    borderRadius: '8px'
                                  }}
                                >
                                  {region}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* City Information */}
            {hoveredCity && (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: '8px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#F5F4F2