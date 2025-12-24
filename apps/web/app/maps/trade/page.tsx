'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function TradeRoutes() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedGood, setSelectedGood] = useState(null);
  const [selectedEra, setSelectedEra] = useState('classical');
  const [viewMode, setViewMode] = useState('routes');
  const [hoveredCity, setHoveredCity] = useState(null);
  const [animatedRoutes, setAnimatedRoutes] = useState(new Set());
  const [pulsingCities, setPulsingCities] = useState(new Set());

  const eraColors = {
    archaic: '#D97706',
    classical: '#F59E0B',
    hellenistic: '#3B82F6'
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
    ]
  };

  const cities = [
    { name: 'Athens', greekName: 'Ἀθῆναι', x: 340, y: 220, type: 'polis', era: ['archaic', 'classical'], goods: ['pottery', 'oil', 'wine'], importance: 'major' },
    { name: 'Alexandria', greekName: 'Ἀλεξάνδρεια', x: 380, y: 300, type: 'metropolis', era: ['hellenistic'], goods: ['papyrus', 'grain', 'glass'], importance: 'major' },
    { name: 'Rhodes', greekName: 'Ῥόδος', x: 360, y: 220, type: 'emporium', era: ['classical', 'hellenistic'], goods: ['wine', 'pottery'], importance: 'major' },
    { name: 'Byzantion', greekName: 'Βυζάντιον', x: 350, y: 180, type: 'polis', era: ['archaic', 'classical'], goods: ['grain', 'fish'], importance: 'medium' },
    { name: 'Ephesus', greekName: 'Ἔφεσος', x: 330, y: 200, type: 'polis', era: ['archaic', 'classical'], goods: ['textiles', 'marble'], importance: 'medium' },
    { name: 'Antioch', greekName: 'Ἀντιόχεια', x: 400, y: 240, type: 'metropolis', era: ['hellenistic'], goods: ['spices', 'silk'], importance: 'major' },
    { name: 'Tanais', greekName: 'Τάναϊς', x: 420, y: 140, type: 'emporium', era: ['classical', 'hellenistic'], goods: ['grain', 'furs'], importance: 'medium' },
    { name: 'Cyrene', greekName: 'Κυρήνη', x: 320, y: 320, type: 'polis', era: ['archaic', 'classical'], goods: ['silphium', 'horses'], importance: 'medium' },
    { name: 'Marseilles', greekName: 'Μασσαλία', x: 220, y: 220, type: 'apoikia', era: ['archaic', 'classical'], goods: ['wine', 'metals'], importance: 'medium' },
    { name: 'Chersonesos', greekName: 'Χερσόνησος', x: 380, y: 140, type: 'apoikia', era: ['classical', 'hellenistic'], goods: ['grain', 'wine'], importance: 'minor' },
    { name: 'Bactria', greekName: 'Βακτρία', x: 550, y: 150, type: 'metropolis', era: ['hellenistic'], goods: ['silk', 'gems'], importance: 'major' },
    { name: 'Seleucia', greekName: 'Σελεύκεια', x: 480, y: 210, type: 'metropolis', era: ['hellenistic'], goods: ['spices', 'textiles'], importance: 'major' }
  ];

  const goods = {
    grain: { name: 'Grain', greek: 'σῖτος', latin: 'frumentum', color: '#F59E0B', regions: ['Chersonesos', 'Egypt', 'Sicily'], description: 'Essential staple food, basis of ancient economy', value: 'high' },
    wine: { name: 'Wine', greek: 'οἶνος', latin: 'vinum', color: '#DC2626', regions: ['Lesbos', 'Chios', 'Thasos'], description: 'Premium export, social and religious significance', value: 'very-high' },
    pottery: { name: 'Pottery', greek: 'κεραμεία', latin: 'fictilia', color: '#D97706', regions: ['Attica', 'Corinth', 'Samos'], description: 'Utilitarian and luxury ceramics, artistic export', value: 'medium' },
    amber: { name: 'Amber', greek: 'ἤλεκτρον', latin: 'electrum', color: '#C9A227', regions: ['Baltic', 'North Sea'], description: 'Fossilized resin, jewelry and amulets', value: 'very-high' },
    silk: { name: 'Silk', greek: 'σηρικόν', latin: 'sericum', color: '#7C3AED', regions: ['Seres', 'Bactria'], description: 'Luxury textile from distant China', value: 'luxury' },
    spices: { name: 'Spices', greek: 'ἀρώματα', latin: 'aromata', color: '#059669', regions: ['Arabia', 'India'], description: 'Aromatic substances for cuisine and medicine', value: 'luxury' },
    metals: { name: 'Metals', greek: 'μέταλλα', latin: 'metalla', color: '#6B7280', regions: ['Iberia', 'Scythia', 'Cyprus'], description: 'Raw materials for tools, weapons, and currency', value: 'high' },
    purple: { name: 'Purple Dye', greek: 'πορφύρα', latin: 'purpura', color: '#8B5CF6', regions: ['Tyre', 'Sidon'], description: 'Royal purple from murex shells', value: 'luxury' },
    oil: { name: 'Olive Oil', greek: 'ἔλαιον', latin: 'oleum', color: '#16A34A', regions: ['Attica', 'Crete'], description: 'Essential oil for cooking, lighting, and hygiene', value: 'high' },
    papyrus: { name: 'Papyrus', greek: 'πάπυρος', latin: 'papyrus', color: '#F97316', regions: ['Egypt'], description: 'Writing material made from river plant', value: 'high' }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedRoutes(new Set([Math.floor(Math.random() * routes[selectedEra].length)]));
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedEra]);

  const getFlowWidth = (flow) => {
    const widths = { 'low': 2, 'medium': 4, 'high': 6, 'very-high': 8 };
    return widths[flow] || 3;
  };

  const getCitySize = (importance) => {
    const sizes = { 'minor': 6, 'medium': 9, 'major': 12 };
    return sizes[importance] || 8;
  };

  const filteredCities = cities.filter(city => city.era.includes(selectedEra));
  const currentRoutes = routes[selectedEra] || [];

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 50%, rgba(201, 162, 39, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(220, 38, 38, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Header */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10,
        background: 'linear-gradient(135deg, rgba(30, 30, 36, 0.9) 0%, rgba(20, 20, 25, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
        padding: '1.5rem 2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Link href="/" style={{ 
              textDecoration: 'none', 
              color: '#C9A227',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              textShadow: '0 0 20px rgba(201, 162, 39, 0.3)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #C9A227, #F59E0B)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(201, 162, 39, 0.3)',
                transform: 'perspective(100px) rotateX(10deg)'
              }}>
                ⚓
              </div>
              LOGOS
            </Link>
          </div>
          
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/timeline" style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none', 
              transition: 'all 0.2s ease',
              padding: '0.5rem 1rem',
              borderRadius: '6px'
            }}>Timeline</Link>
            <Link href="/etymology" style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none', 
              transition: 'all 0.2s ease',
              padding: '0.5rem 1rem',
              borderRadius: '6px'
            }}>Etymology</Link>
          </nav>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            background: 'linear-gradient(135deg, #C9A227, #F59E0B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            textShadow: '0 0 40px rgba(201, 162, 39, 0.5)',
            transform: 'perspective(500px) rotateX(10deg)'
          }}>
            Ancient Trade Routes
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              backgroundColor: '#3B82F6', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px', 
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
            }}>
              <span style={{ fontWeight: 'bold' }}>Α</span>
              <span>ἐμπορία</span>
            </div>
            <div style={{ 
              backgroundColor: '#DC2626', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px', 
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)'
            }}>
              <span style={{ fontWeight: 'bold' }}>L</span>
              <span>commercium</span>
            </div>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
            Explore the maritime and overland trade networks that connected the ancient Mediterranean world
          </p>
        </div>

        {/* Controls */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {Object.entries(eraColors).map(([era, color]) => (
            <button
              key={era}
              onClick={() => setSelectedEra(era)}
              style={{
                backgroundColor: selectedEra === era ? color : '#1E1E24',
                color: selectedEra === era ? '#000' : '#F5F4F2',
                border: `2px solid ${selectedEra === era ? color : 'rgba(156, 163, 175, 0.3)'}`,
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize',
                fontWeight: selectedEra === era ? 'bold' : 'normal',
                boxShadow: selectedEra === era ? `0 8px 32px ${color}40` : '0 4px 16px rgba(0,0,0,0.2)',
                transform: selectedEra === era ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)'
              }}
              onMouseEnter={(e) => {
                if (selectedEra !== era) {
                  e.target.style.backgroundColor = '#2A2A32';
                  e.target.style.transform = 'translateY(-1px) scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedEra !== era) {
                  e.target.style.backgroundColor = '#1E1E24';
                  e.target.style.transform = 'translateY(0) scale(1)';
                }
              }}
            >
              {era === 'archaic' && '800-500 BCE'}
              {era === 'classical' && '500-323 BCE'}
              {era === 'hellenistic' && '323-31 BCE'}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.5rem', 
          marginBottom: '3rem'
        }}>
          {['routes', 'goods', 'cities'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                backgroundColor: viewMode === mode ? '#C9A227' : '#1E1E24',
                color: viewMode === mode ? '#000' : '#F5F4F2',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: viewMode === mode ? '8px' : '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'capitalize',
                fontWeight: viewMode === mode ? 'bold' : 'normal',
                transform: viewMode === mode ? 'scale(1.1)' : 'scale(1)',
                boxShadow: viewMode === mode ? '0 6px 20px rgba(201, 162, 39, 0.4)' : 'none'
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Map Container */}
          <div style={{ 
            flex: '2',
            background: 'linear-gradient(135deg, rgba(30, 30, 36, 0.95) 0%, rgba(20, 20, 25, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(201, 162, 39, 0.2)',
            boxShadow: '0 16px 64px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ 
              position: 'relative',
              backgroundColor: 'rgba(13, 13, 15, 0.9)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid rgba(201, 162, 39, 0.3)'
            }}>
              <svg viewBox="0 0 650 400" style={{ width: '100%', height: '500px' }}>
                {/* Gradient Definitions */}
                <defs>
                  <radialGradient id="seaGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
                  </radialGradient>
                  <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(107, 114, 128, 0.2)" />
                    <stop offset="100%" stopColor="rgba(107, 114, 128, 0.1)" />
                  </linearGradient>
                  {currentRoutes.map(route => (
                    <linearGradient key={`gradient-${route.id}`} id={`routeGradient-${route.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={eraColors[selectedEra]} stopOpacity="0.8" />
                      <stop offset="50%" stopColor={eraColors[selectedEra]} stopOpacity="1" />
                      <stop offset="100%" stopColor={eraColors[selectedEra]} stopOpacity="0.8" />
                    </linearGradient>
                  ))}
                </defs>

                {/* Background Sea */}
                <rect width="650" height="400" fill="url(#seaGradient)" />

                {/* Stylized Land Masses */}
                <g fill="url(#landGradient)" stroke="rgba(156, 163, 175, 0.3)" strokeWidth="1">
                  {/* Mediterranean outline */}
                  <path d="M50 100 Q200 80 350 120 Q500 140 600 160 L620 300 Q500 320 350 300 Q200 280 50 260 Z" />
                  {/* Greek peninsula */}
                  <path d="M300 180 Q340 170 360 200 Q380 230 340 250 Q320 240 300 220 Z" />
                  {/* Asia Minor */}
                  <path d="M380 160 Q450 150 500 170 Q520 190 480 210 Q420 200 380 180 Z" />
                  {/* Egyptian coast */}
                  <path d="M350 280 Q420 290 480 300 Q500 310 460 330 Q380 320 350 300 Z" />
                </g>

                {/* Trade Routes */}
                {currentRoutes.map((route, index) => {
                  const isSelected = selectedRoute?.id === route.id;
                  const isAnimated = animatedRoutes.has(index);
                  
                  return (
                    <g key={route.id}>
                      {/* Route Line */}
                      <line
                        x1={route.start.x}
                        y1={route.start.y}
                        x2={route.end.x}
                        y2={route.end.y}
                        stroke={isSelected ? '#C9A227' : `url(#routeGradient-${route.id})`}
                        strokeWidth={isSelected ? getFlowWidth(route.flow) + 4 : getFlowWidth(route.flow)}
                        strokeDasharray={route.type === 'maritime' ? 'none' : '8 4'}
                        opacity={isSelected ? 1 : 0.7}
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          filter: isSelected ? 'drop-shadow(0 0 10px currentColor)' : 'none',
                          animation: isAnimated ? 'pulse 2s infinite' : 'none'
                        }}
                        onClick={() => setSelectedRoute(selectedRoute?.id === route.id ? null : route)}
                      />
                      
                      {/* Route Direction Arrow */}
                      <polygon
                        points={`${route.end.x-8},${route.end.y-4} ${route.end.x},${route.end.y} ${route.end.x-8},${route.end.y+4}`}
                        fill={isSelected ? '#C9A227' : eraColors[selectedEra]}
                        opacity={0.8}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedRoute(selectedRoute?.id === route.id ? null : route)}
                      />

                      {/* Animated Trade Goods */}
                      {isAnimated && route.goods.map((good, goodIndex) => (
                        <circle
                          key={goodIndex}
                          r="3"
                          fill={goods[good]?.color || '#C9A227'}
                          opacity="0.9"
                          style={{
                            animation: `moveAlongRoute 4s infinite linear`,
                            animationDelay: `${goodIndex * 0.8}s`
                          }}
                        >
                          <animateMotion dur="4s" repeatCount="indefinite" begin={`${goodIndex * 0.8}s`}>
                            <mpath href={`#routePath-${route.id}`} />
                          </animateMotion>
                        </circle>
                      ))}
                    </g>
                  );
                })}

                {/* Cities */}
                {filteredCities.map(city => {
                  const isHovered = hoveredCity === city.name;
                  const citySize = getCitySize(city.importance);
                  
                  return (
                    <g key={city.name}>
                      {/* City Glow Effect */}
                      {isHovered && (
                        <circle
                          cx={city.x}
                          cy={city.y}
                          r={citySize + 10}
                          fill="none"
                          stroke={eraColors[selectedEra]}
                          strokeWidth="2"
                          opacity="0.5"
                          style={{
                            animation: 'pulse 2s infinite'
                          }}
                        />
                      )}
                      
                      {/* City Circle */}
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r={citySize}
                        fill={city.importance === 'major' ? '#C9A227' : city.importance === 'medium' ? '#F59E0B' : '#D97706'}
                        stroke="#F5F4F2"
                        strokeWidth="2"
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          filter: isHovered ? 'drop-shadow(0 0 12px currentColor)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                          transform: isHovered ? 'scale(1.2)' : 'scale(1)'
                        }}
                        onMouseEnter={() => setHoveredCity(city.name)}
                        onMouseLeave={() => setHoveredCity(null)}
                      />
                      
                      {/* City Label */}
                      <text
                        x={city.x}
                        y={city.y - citySize - 8}
                        textAnchor="middle"
                        fill="#F5F4F2"
                        fontSize="11"
                        fontWeight="bold"
                        style={{
                          pointerEvents: 'none',
                          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                          opacity: isHovered ? 1 : 0.8
                        }}
                      >
                        {city.name}
                      </text>
                      
                      {/* Greek Name on Hover */}
                      {isHovered && (
                        <text
                          x={city.x}
                          y={city.y + citySize + 18}
                          textAnchor="middle"
                          fill="#3B82F6"
                          fontSize="10"
                          style={{
                            pointerEvents: 'none',
                            textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                          }}
                        >
                          {city.greekName}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Legend */}
                <g transform="translate(20, 20)">
                  <rect width="180" height="120" fill="rgba(30, 30, 36, 0.95