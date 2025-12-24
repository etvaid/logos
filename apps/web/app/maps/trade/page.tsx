'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function TradeRoutes() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedGood, setSelectedGood] = useState(null);
  const [selectedEra, setSelectedEra] = useState<'archaic' | 'classical' | 'hellenistic' | 'imperial' | 'late-antique' | 'byzantine'>('classical');
  const [viewMode, setViewMode] = useState<'routes' | 'goods' | 'cities'>('routes');
  const [hoveredCity, setHoveredCity] = useState(null);
  const [animatedRoutes, setAnimatedRoutes] = useState(new Set());
  const [pulsingCities, setPulsingCities] = useState(new Set());
  const [flowAnimation, setFlowAnimation] = useState(true);
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
    ],
    'late-antique': [
      { id: 15, name: 'Rhine Trade', start: { x: 200, y: 160 }, end: { x: 250, y: 200 }, type: 'river', goods: ['grain', 'wine', 'amber'], description: 'Trade along the Rhine River', flow: 'medium' },
      { id: 16, name: 'Danube Route', start: { x: 300, y: 150 }, end: { x: 400, y: 160 }, type: 'river', goods: ['furs', 'slaves', 'amber'], description: 'Danube river trade network', flow: 'medium' }
    ],
    byzantine: [
      { id: 17, name: 'Silk Road Reaches', start: { x: 500, y: 200 }, end: { x: 350, y: 180 }, type: 'overland', goods: ['silk', 'spices', 'gold'], description: 'Byzantine involvement in Silk Road trade', flow: 'high' },
      { id: 18, name: 'Mediterranean Circuit', start: { x: 350, y: 180 }, end: { x: 220, y: 220 }, type: 'maritime', goods: ['silk', 'spices', 'wine'], description: 'Byzantine maritime dominance', flow: 'high' }
    ]
  };

  const cities = [
    { name: 'Athens', greekName: 'Ἀθῆναι', x: 340, y: 220, type: 'polis', era: ['archaic', 'classical'], goods: ['pottery', 'oil', 'wine'], importance: 'major' },
    { name: 'Alexandria', greekName: 'Ἀλεξάνδρεια', x: 380, y: 300, type: 'metropolis', era: ['hellenistic', 'imperial'], goods: ['papyrus', 'grain', 'glass'], importance: 'major' },
    { name: 'Rhodes', greekName: 'Ῥόδος', x: 360, y: 220, type: 'emporium', era: ['classical', 'hellenistic'], goods: ['wine', 'pottery'], importance: 'major' },
    { name: 'Byzantion', greekName: 'Βυζάντιον', x: 350, y: 180, type: 'polis', era: ['archaic', 'classical', 'hellenistic', 'byzantine'], goods: ['grain', 'fish'], importance: 'medium' },
    { name: 'Ephesus', greekName: 'Ἔφεσος', x: 330, y: 200, type: 'polis', era: ['archaic', 'classical', 'hellenistic'], goods: ['textiles', 'marble'], importance: 'medium' },
    { name: 'Antioch', greekName: 'Ἀντιόχεια', x: 400, y: 240, type: 'metropolis', era: ['hellenistic', 'imperial'], goods: ['spices', 'silk'], importance: 'major' },
    { name: 'Tanais', greekName: 'Τάναϊς', x: 420, y: 140, type: 'emporium', era: ['classical', 'hellenistic'], goods: ['grain', 'furs'], importance: 'medium' },
    { name: 'Cyrene', greekName: 'Κυρήνη', x: 320, y: 320, type: 'polis', era: ['archaic', 'classical', 'hellenistic'], goods: ['silphium', 'horses'], importance: 'medium' },
    { name: 'Marseilles', greekName: 'Μασσαλία', x: 220, y: 220, type: 'emporium', era: ['archaic', 'classical'], goods: ['wine', 'metals'], importance: 'medium' },
    { name: 'Chersonesos', greekName: 'Χερσόνησος', x: 380, y: 140, type: 'polis', era: ['classical', 'hellenistic'], goods: ['grain', 'wine'], importance: 'medium' }
  ];

  const tradeGoods = {
    grain: { color: '#F59E0B', symbol: '🌾', routes: [1, 4, 8, 13, 15] },
    wine: { color: '#7C2D12', symbol: '🍷', routes: [1, 4, 7, 14] },
    pottery: { color: '#EA580C', symbol: '🏺', routes: [1, 4, 7] },
    silk: { color: '#C084FC', symbol: '🧵', routes: [9, 11, 17] },
    spices: { color: '#DC2626', symbol: '🌶️', routes: [10, 11, 12, 17] },
    amber: { color: '#F59E0B', symbol: '💎', routes: [3, 5, 15] },
    metals: { color: '#6B7280', symbol: '⚒️', routes: [5, 6, 14] },
    incense: { color: '#7C3AED', symbol: '🔥', routes: [10, 12] }
  };

  const getFlowWidth = (flow: string) => {
    switch (flow) {
      case 'very-high': return 6;
      case 'high': return 4;
      case 'medium': return 3;
      case 'low': return 2;
      default: return 2;
    }
  };

  const getRoutePattern = (type: string) => {
    switch (type) {
      case 'maritime': return '8,4';
      case 'overland': return '0';
      case 'river': return '12,8';
      default: return '0';
    }
  };

  const getCitySize = (importance: string) => {
    switch (importance) {
      case 'major': return 12;
      case 'medium': return 8;
      default: return 6;
    }
  };

  const currentRoutes = routes[selectedEra] || [];
  const visibleCities = cities.filter(city => city.era.includes(selectedEra));

  useEffect(() => {
    const interval = setInterval(() => {
      if (flowAnimation) {
        const routeElements = document.querySelectorAll('.trade-route');
        routeElements.forEach((element, index) => {
          const animationDelay = index * 0.5;
          element.style.animationDelay = `${animationDelay}s`;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [flowAnimation, selectedEra]);

  return (
    <div style={{ 
      backgroundColor: '#0D0D0F', 
      minHeight: '100vh', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderBottom: '1px solid #2A2A32',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                margin: '0 0 0.5rem 0',
                background: `linear-gradient(135deg, ${eraColors[selectedEra]} 0%, #C9A227 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Ancient Trade Routes
              </h1>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#9CA3AF', 
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ 
                  color: '#3B82F6',
                  fontWeight: '600',
                  backgroundColor: '#1E3A8A20',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.8rem'
                }}>Α</span>
                Interactive map of commercial networks across Mediterranean and beyond
              </p>
            </div>
            <Link href="/" style={{ 
              color: '#C9A227', 
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              padding: '0.5rem 1rem',
              border: '1px solid #C9A227',
              borderRadius: '0.5rem',
              transition: 'all 0.2s ease',
              backgroundColor: '#C9A22710'
            }}>
              ← Back to Logos
            </Link>
          </div>

          {/* Era Navigation */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {Object.entries(eraColors).map(([era, color]) => (
              <button
                key={era}
                onClick={() => setSelectedEra(era as any)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: selectedEra === era ? color : '#1E1E24',
                  color: selectedEra === era ? '#000' : color,
                  border: `2px solid ${color}`,
                  borderRadius: '0.75rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize',
                  boxShadow: selectedEra === era ? `0 0 20px ${color}40` : 'none',
                  transform: selectedEra === era ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseOver={(e) => {
                  if (selectedEra !== era) {
                    e.currentTarget.style.backgroundColor = `${color}20`;
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedEra !== era) {
                    e.currentTarget.style.backgroundColor = '#1E1E24';
                  }
                }}
              >
                {era.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        maxWidth: '1200px', 
        margin: '0 auto',
        gap: '2rem',
        padding: '2rem'
      }}>
        {/* Controls Panel */}
        <div style={{ 
          width: '300px',
          backgroundColor: '#1E1E24',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '1px solid #2A2A32',
          height: 'fit-content'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            color: '#F5F4F2',
            fontSize: '1.2rem',
            fontWeight: '600'
          }}>
            View Controls
          </h3>

          {/* View Mode Toggle */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {['routes', 'goods', 'cities'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: viewMode === mode ? '#C9A227' : '#141419',
                    color: viewMode === mode ? '#000' : '#F5F4F2',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize'
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Animation Toggle */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}>
              <input
                type="checkbox"
                checked={flowAnimation}
                onChange={(e) => setFlowAnimation(e.target.checked)}
                style={{ 
                  accentColor: '#C9A227',
                  transform: 'scale(1.2)'
                }}
              />
              Flow Animation
            </label>
          </div>

          {/* Trade Goods Legend */}
          {viewMode === 'goods' && (
            <div>
              <h4 style={{ 
                margin: '0 0 1rem 0', 
                color: '#F5F4F2',
                fontSize: '1rem'
              }}>
                Trade Goods
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.entries(tradeGoods).map(([good, data]) => (
                  <button
                    key={good}
                    onClick={() => setSelectedGood(selectedGood === good ? null : good)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: selectedGood === good ? data.color + '20' : '#141419',
                      border: selectedGood === good ? `2px solid ${data.color}` : '1px solid #2A2A32',
                      borderRadius: '0.5rem',
                      color: '#F5F4F2',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '0.9rem',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{data.symbol}</span>
                    <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{good}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Route Info */}
          {selectedRoute && (
            <div style={{ 
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#141419',
              borderRadius: '0.5rem',
              border: '1px solid #2A2A32'
            }}>
              <h4 style={{ 
                margin: '0 0 0.5rem 0',
                color: eraColors[selectedEra],
                fontSize: '1rem'
              }}>
                {selectedRoute.name}
              </h4>
              <p style={{ 
                color: '#9CA3AF',
                fontSize: '0.8rem',
                margin: '0 0 0.75rem 0'
              }}>
                {selectedRoute.description}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedRoute.goods.map(good => (
                  <span
                    key={good}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: tradeGoods[good]?.color || '#6B7280',
                      color: '#000',
                      borderRadius: '0.25rem',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tradeGoods[good]?.symbol} {good}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div style={{ 
          flex: 1,
          backgroundColor: '#1E1E24',
          borderRadius: '1rem',
          border: '1px solid #2A2A32',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Map Header */}
          <div style={{ 
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #2A2A32',
            backgroundColor: '#141419'
          }}>
            <h3 style={{ 
              margin: 0,
              color: '#F5F4F2',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              {selectedEra.charAt(0).toUpperCase() + selectedEra.slice(1).replace('-', ' ')} Period
              <span style={{ 
                marginLeft: '1rem',
                fontSize: '0.9rem',
                color: '#9CA3AF',
                fontWeight: '400'
              }}>
                ({currentRoutes.length} active routes)
              </span>
            </h3>
          </div>

          {/* SVG Map */}
          <div style={{ padding: '2rem', backgroundColor: '#0D0D0F' }}>
            <svg
              ref={svgRef}
              viewBox="0 0 640 400"
              style={{ 
                width: '100%', 
                height: '500px',
                backgroundColor: '#0A1B2E',
                borderRadius: '0.5rem',
                border: '1px solid #1E3A5F'
              }}
            >
              {/* Background Map Elements */}
              <defs>
                <radialGradient id="seaGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" style={{ stopColor: '#1E3A8A', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#0F172A', stopOpacity: 0.8 }} />
                </radialGradient>
                
                {/* Flow Animation */}
                <style>
                  {`
                    @keyframes flowPulse {
                      0%, 100% { opacity: 0.6; stroke-width: 2px; }
                      50% { opacity: 1; stroke-width: 4px; }
                    }
                    .trade-route {
                      animation: flowPulse 3s ease-in-out infinite;
                    }
                    .city-pulse {
                      animation: flowPulse 2s ease-in-out infinite;
                    }
                  `}
                </style>

                {/* Arrow markers for route direction */}
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="10"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill={eraColors[selectedEra]}
                    opacity="0.8"
                  />
                </marker>
              </defs>

              {/* Sea Background */}
              <rect
                width="640"
                height="400"
                fill="url(#seaGradient)"
              />

              {/* Land Masses (Simplified) */}
              <path
                d="M 0,250 Q 100,200 200,220 Q 300,240 400,200 Q 500,180 640,160 L 640,400 L 0,400 Z"
                fill="#1A2332"
                stroke="#2A3441"
                strokeWidth="1"
                opacity="0.7"
              />
              
              <ellipse
                cx="350"
                cy="280"
                rx="80"
                ry="40"
                fill="#1A2332"
                opacity="0.6"
              />

              {/* Trade Routes */}
              {currentRoutes.map(route => {
                const isSelected = selectedRoute?.id === route.id;
                const isHighlighted = selectedGood && route.goods.includes(selectedGood);
                const shouldShow = !selectedGood || isHighlighted;
                
                return shouldShow && (
                  <g key={route.id}>
                    {/* Route Line */}
                    <line
                      x1={route.start.x}
                      y1={route.start.y}
                      x2={route.end.x}
                      y2={route.end.y}
                      stroke={isSelected ? '#C9A227' : eraColors[selectedEra]}
                      strokeWidth={isSelected ? getFlowWidth(route.flow) + 2 : getFlowWidth(route.flow)}
                      strokeDasharray={getRoutePattern(route.type)}
                      opacity={isSelected ? 1 : (isHighlighted ? 0.9 : 0.6)}
                      className={flowAnimation ? "trade-route" : ""}
                      markerEnd="url(#arrowhead)"
                      style={{
                        cursor: 'pointer',
                        filter: isSelected ? `drop-shadow(0 0 8px ${eraColors[selectedEra]})` : 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setSelectedRoute(selectedRoute?.id === route.id ? null : route)}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.target.style.strokeWidth = getFlowWidth(route.flow) + 1;
                          e.target.style.opacity = '0.9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.target.style.strokeWidth = getFlowWidth(route.flow);
                          e.target.style.opacity = isHighlighted ? '0.9' : '0.6';
                        }
                      }}
                    />
                    
                    {/* Route Label */}
                    {(isSelected || isHighlighted) && (
                      <text
                        x={(route.start.x + route.end.x) / 2}
                        y={(route.start.y + route.end.y) / 2 - 8}
                        fill="#F5F4F2"
                        fontSize="11"
                        fontWeight="600"
                        textAnchor="middle"
                        style={{
                          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))',
                          pointerEvents: 'none'
                        }}
                      >
                        {route.name}
                      </text>
                    )}

                    {/* Flow Indicators */}
                    {isSelected && flowAnimation && (
                      <>
                        {[0.25, 0.5, 0.75].map((offset, i) => {
                          const x = route.start.x + (route.end.x - route.start.x) * offset;
                          const y = route.start.y + (route.end.y - route.start.y) * offset;
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r="3"
                              fill="#C9A227"
                              className="city-pulse"
                              style={{
                                animationDelay: `${i * 0.5}s`
                              }}
                            />
                          );
                        })}
                      </>
                    )}
                  </g>
                );
              })}

              {/* Cities */}
              {viewMode !== 'routes' && visibleCities.map(city => {
                const isHovered = hoveredCity === city.name;
                const cityRoutes = currentRoutes.filter(route => 
                  Math.abs(route.start.x - city.x) < 20 && Math.abs(route.start.y - city.y) < 20 ||
                  Math.abs(route.end.x - city.x) < 20 && Math.abs(route.end.y - city.y) < 20
                );
                
                return (
                  <g key={city.name}>
                    {/* City Circle */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={isHovered ? getC